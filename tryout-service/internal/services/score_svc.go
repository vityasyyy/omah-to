package services

import (
	"encoding/json"
	"fmt"
	"net/http"
	"tryout-service/internal/logger"
	"tryout-service/internal/models"
	"tryout-service/internal/repositories"

	"github.com/jmoiron/sqlx"
)

type ScoreService interface {
	CalculateAndStoreScores(tx *sqlx.Tx, attemptID, userID int, tryoutToken string) error
	GetAnswerKeyBasedOnSubtestFromSoalService(subtest, token, tokenType string) (*models.AnswerKeys, error)
	CalculateScore(userAnswers []models.UserAnswer, answerKeys *models.AnswerKeys) (totalScore float64)
}

// scoreService is a struct that represents the service for score, has a dependency on score repo (injected), http client, and soal service url
type scoreService struct {
	scoreRepo      repositories.ScoreRepo
	httpClient     *http.Client
	soalServiceURL string
}

// NewScoreService is a factory function that returns a new instance of score service
func NewScoreService(scoreRepo repositories.ScoreRepo, soalServiceURL string) ScoreService {
	return &scoreService{scoreRepo: scoreRepo, httpClient: &http.Client{}, soalServiceURL: soalServiceURL}
}

// CalculateAndStoreScores is a function that calculates the score for each subtest and stores it in the database
func (s *scoreService) CalculateAndStoreScores(tx *sqlx.Tx, attemptID, userID int, tryoutToken string) error {
	subtests := []string{"subtest_pu", "subtest_ppu", "subtest_pbm", "subtest_pk", "subtest_lbi", "subtest_lbe", "subtest_pm"}

	// loop through all the subtests and calculate the score for each subtest
	for _, subtest := range subtests {
		// get the user answers for this subtest from the user_answers table, for every subtest
		userAnswers, err := s.scoreRepo.GetUserAnswersFromAttemptIDandSubtestTx(tx, attemptID, subtest)
		if err != nil {
			logger.LogError(err, "Failed to get user answers from attempt id and subtest", map[string]interface{}{"layer": "service", "operation": "CalculateAndStoreScores"})
			return err
		}

		// get the answer key for this subtest, call the soal service api
		answerKey, err := s.GetAnswerKeyBasedOnSubtestFromSoalService(subtest, tryoutToken, "tryout")
		if err != nil {
			logger.LogError(err, "Failed to get answer key from subtest", map[string]interface{}{"layer": "service", "operation": "CalculateAndStoreScores"})
			return err
		}

		// calculate the score for this subtest, apply a calculation logic
		score := s.CalculateScore(userAnswers, answerKey)

		// store the score for this subtest
		if err := s.scoreRepo.InsertScoreForUserAttemptIDAndSubtestTx(tx, attemptID, userID, subtest, score); err != nil {
			logger.LogError(err, "Failed to insert score for user attempt id and subtest", map[string]interface{}{"layer": "service", "operation": "CalculateAndStoreScores"})
			return err
		}
	}

	averageScore, err := s.scoreRepo.CalculateAverageScoreForAttempt(tx, attemptID)
	if err != nil {
		logger.LogError(err, "Failed to calculate average score for attempt", map[string]interface{}{"layer": "service", "operation": "CalculateAndStoreScores"})
		return err
	}

	if err := s.scoreRepo.UpdateScoreForTryOutAttempt(tx, attemptID, averageScore); err != nil {
		logger.LogError(err, "Failed to update score for tryout attempt", map[string]interface{}{"layer": "service", "operation": "CalculateAndStoreScores"})
		return err
	}

	return nil
}

// make a function that retrieves the answer key from the soal service and the subtest, also distinguish them from the soal type and shit type shit bro
func (s *scoreService) GetAnswerKeyBasedOnSubtestFromSoalService(subtest, token, tokenType string) (*models.AnswerKeys, error) {
	// NANTI PAKETNYA DYNAMIC YAA JANGAN STATIC, FORGOT BRO PLES
	url := fmt.Sprintf("%s/soal/answer-key/paket1?subtest=%s", s.soalServiceURL, subtest)
	// make a new request and add cookie to the header
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		logger.LogError(err, "Failed to create request for answer key", map[string]interface{}{"layer": "service", "operation": "fetchAnswerKeyFromQuestionsService"})
		return nil, err
	}
	switch tokenType {
	case "tryout":
		req.Header.Add("Cookie", fmt.Sprintf("tryout_token=%s", token))
	case "access":
		req.Header.Add("Cookie", fmt.Sprintf("access_token=%s", token))
	default:
		err := fmt.Errorf("invalid token type: %s", tokenType)
		logger.LogError(err, "Invalid token type provided", map[string]interface{}{
			"layer": "service", "operation": "fetchAnswerKeyFromQuestionsService",
		})
		return nil, err
	}

	// Send the request
	resp, err := s.httpClient.Do(req)
	if err != nil {
		logger.LogError(err, "Failed to send request to fetch answer key", map[string]interface{}{"layer": "service", "operation": "fetchAnswerKeyFromQuestionsService"})
		return nil, err
	}
	defer resp.Body.Close()

	// Handle non-200 responses
	if resp.StatusCode != http.StatusOK {
		err := fmt.Errorf("unexpected response status: %d", resp.StatusCode)
		logger.LogError(err, "Failed to fetch answer key", map[string]interface{}{"layer": "service", "operation": "fetchAnswerKeyFromQuestionsService"})
		return nil, err
	}

	// Parse the response body
	var answerKey models.AnswerKeys
	if err := json.NewDecoder(resp.Body).Decode(&answerKey); err != nil {
		logger.LogError(err, "Failed to decode answer key response", map[string]interface{}{"layer": "service", "operation": "fetchAnswerKeyFromQuestionsService"})
		return nil, err
	}

	// Check if answerKey is empty
	if isAnswerKeyEmpty(answerKey) {
		err := fmt.Errorf("answer key is empty for subtest: %s", subtest)
		logger.LogError(err, "Empty answer key received", map[string]interface{}{
			"layer": "service", "operation": "fetchAnswerKeyFromQuestionsService",
		})
		return nil, err
	}

	return &answerKey, nil
}

// isAnswerKeyEmpty checks if the answer key is empty
func isAnswerKeyEmpty(answerKey models.AnswerKeys) bool {
	return len(answerKey.PilihanGandaAnswers) == 0 &&
		len(answerKey.TrueFalseAnswers) == 0 &&
		len(answerKey.UraianAnswers) == 0
}

func (s *scoreService) CalculateScore(userAnswers []models.UserAnswer, answerKeys *models.AnswerKeys) (totalScore float64) {
	totalScore = 0

	for _, userAnswer := range userAnswers { // kode soal dari tabel user answers
		kodeSoal := userAnswer.KodeSoal
		// check pilgan
		if pilihanGandaChoice, exists := answerKeys.PilihanGandaAnswers[kodeSoal]; exists {
			if correctChoice, exists := pilihanGandaChoice[userAnswer.Jawaban]; exists && correctChoice.IsCorrect {
				totalScore += float64(correctChoice.Bobot)
			}
		}

		//check true false
		if tfAnswer, exists := answerKeys.TrueFalseAnswers[kodeSoal]; exists {
			if userAnswer.Jawaban == tfAnswer.Jawaban {
				totalScore += float64(tfAnswer.Bobot)
			}
		}

		// check uraian
		if uraianAnswer, exists := answerKeys.UraianAnswers[kodeSoal]; exists {
			if userAnswer.Jawaban == uraianAnswer.Jawaban {
				totalScore += float64(uraianAnswer.Bobot)
			}
		}
	}
	return totalScore
}
