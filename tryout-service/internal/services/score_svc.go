package services

import (
	"encoding/json"
	"fmt"
	"net/http"
	"tryout-service/internal/logger"
	"tryout-service/internal/models"
	"tryout-service/internal/repositories"
)

type ScoreService interface {
	CalculateAndStoreScores(attemptID, userID int, tryoutToken string) (retErr error)
	GetAnswerKeyBasedOnSubtestFromSoalService(subtest, tryoutToken string) (*models.AnswerKeys, error)
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
func (s *scoreService) CalculateAndStoreScores(attemptID, userID int, tryoutToken string) (retErr error) {
	// begin transaction
	tx, err := s.scoreRepo.BeginTransaction()
	if err != nil {
		logger.LogError(err, "Failed to begin transaction", map[string]interface{}{"layer": "service", "operation": "CalculateAndStoreScores"})
		return err
	}

	// defer rollback if there is an error
	defer func() {
		if retErr != nil {
			if rbErr := tx.Rollback(); rbErr != nil {
				logger.LogError(rbErr, "Failed to rollback transaction", map[string]interface{}{
					"layer":     "service",
					"operation": "SubmitCurrentSubtest",
					"attemptID": attemptID,
				})
			}
		}
	}()
	// get all the subtests that are available for this attempt
	subtests := []string{"subtest_pu", "subtest_ppu", "subtest_pbm", "subtest_pk", "subtest_lbi", "subtest_lbe", "subtest_pm"}

	// loop through all the subtests and calculate the score for each subtest
	for _, subtest := range subtests {
		// get the user answers for this subtest from the user_answers table, for every subtest
		userAnswers, err := s.scoreRepo.GetUserAnswersFromAttemptIDandSubtestTx(tx, attemptID, subtest)
		if err != nil {
			logger.LogError(err, "Failed to get user answers from attempt id and subtest", map[string]interface{}{"layer": "service", "operation": "CalculateAndStoreScores"})
			retErr = err
			return retErr
		}

		// get the answer key for this subtest, call the soal service api
		answerKey, err := s.GetAnswerKeyBasedOnSubtestFromSoalService(subtest, tryoutToken)
		if err != nil {
			logger.LogError(err, "Failed to get answer key from subtest", map[string]interface{}{"layer": "service", "operation": "CalculateAndStoreScores"})
			retErr = err
			return retErr
		}

		// calculate the score for this subtest, apply a calculation logic
		score := s.CalculateScore(userAnswers, answerKey)

		// store the score for this subtest
		if err := s.scoreRepo.InsertScoreForUserAttemptIDAndSubtestTx(tx, attemptID, userID, subtest, score); err != nil {
			logger.LogError(err, "Failed to insert score for user attempt id and subtest", map[string]interface{}{"layer": "service", "operation": "CalculateAndStoreScores"})
			retErr = err
			return retErr
		}
	}

	// commit transaction if no error
	if err := tx.Commit(); err != nil {
		logger.LogError(err, "Failed to commit transaction", map[string]interface{}{"layer": "service", "operation": "CalculateAndStoreScores"})
		return err
	}

	return nil
}

// make a function that retrieves the answer key from the soal service and the subtest, also distinguish them from the soal type and shit type shit bro
func (s *scoreService) GetAnswerKeyBasedOnSubtestFromSoalService(subtest string, tryoutToken string) (*models.AnswerKeys, error) {
	// NANTI PAKETNYA DYNAMIC YAA JANGAN STATIC, FORGOT BRO PLES
	url := fmt.Sprintf("%s/soal/answer-key/paket1?subtest=%s", s.soalServiceURL, subtest)
	// make a new request and add cookie to the header
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		logger.LogError(err, "Failed to create request for answer key", map[string]interface{}{"layer": "service", "operation": "fetchAnswerKeyFromQuestionsService"})
		return nil, err
	}
	req.Header.Add("Cookie", fmt.Sprintf("tryout_token=%s", tryoutToken))

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
