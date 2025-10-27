package services

import (
	"context"
	"fmt"
	"tryout-service/internal/models"
	"tryout-service/internal/repositories"

	pb "tryout-service/internal/proto/soal"

	"github.com/vityasyyy/sharedlib/logger"

	"github.com/jmoiron/sqlx"
	"google.golang.org/grpc/metadata"
)

type ScoreService interface {
	CalculateAndStoreScores(c context.Context, tx *sqlx.Tx, attemptID, userID int, tryoutToken string) error
	GetAnswerKeyBasedOnSubtestFromSoalService(c context.Context, subtest, token, tokenType string) (*models.AnswerKeys, error)
	CalculateScore(userAnswers []models.UserAnswer, answerKeys *models.AnswerKeys) (totalScore float64)
}

// scoreService is a struct that represents the service for score, has a dependency on score repo (injected), http client, and soal service url
type scoreService struct {
	scoreRepo repositories.ScoreRepo
	// httpClient     *http.Client
	// soalServiceURL string
	soalClient pb.SoalServiceClient
}

// NewScoreService is a factory function that returns a new instance of score service
func NewScoreService(scoreRepo repositories.ScoreRepo, soalClient pb.SoalServiceClient) ScoreService {
	return &scoreService{scoreRepo: scoreRepo, soalClient: soalClient}
}

// CalculateAndStoreScores is a function that calculates the score for each subtest and stores it in the database
func (s *scoreService) CalculateAndStoreScores(c context.Context, tx *sqlx.Tx, attemptID, userID int, tryoutToken string) error {
	subtests := []string{"subtest_pu", "subtest_ppu", "subtest_pbm", "subtest_pk", "subtest_lbi", "subtest_lbe", "subtest_pm"}

	// loop through all the subtests and calculate the score for each subtest
	for _, subtest := range subtests {
		// get the user answers for this subtest from the user_answers table, for every subtest
		userAnswers, err := s.scoreRepo.GetUserAnswersFromAttemptIDandSubtestTx(c, tx, attemptID, subtest)
		if err != nil {
			logger.LogErrorCtx(c, err, "Failed to get user answers from attempt ID and subtest", map[string]any{"attempt_id": attemptID, "subtest": subtest})
			return err
		}

		// get the answer key for this subtest, call the soal service api
		answerKey, err := s.GetAnswerKeyBasedOnSubtestFromSoalService(c, subtest, tryoutToken, "tryout")
		if err != nil {
			logger.LogErrorCtx(c, err, "Failed to get answer key from soal service", map[string]any{"subtest": subtest})
			return err
		}

		// calculate the score for this subtest, apply a calculation logic
		score := s.CalculateScore(userAnswers, answerKey)

		// store the score for this subtest
		if err := s.scoreRepo.InsertScoreForUserAttemptIDAndSubtestTx(c, tx, attemptID, userID, subtest, score); err != nil {
			logger.LogErrorCtx(c, err, "Failed to insert score for user attempt ID and subtest", map[string]any{
				"attempt_id": attemptID,
				"user_id":    userID,
				"subtest":    subtest,
				"score":      score,
			})

			return err
		}
	}

	averageScore, err := s.scoreRepo.CalculateAverageScoreForAttempt(c, tx, attemptID)
	if err != nil {
		logger.LogErrorCtx(c, err, "Failed to calculate average score for attempt", map[string]any{"attempt_id": attemptID})
		return err
	}

	if err := s.scoreRepo.UpdateScoreForTryOutAttempt(c, tx, attemptID, averageScore); err != nil {
		logger.LogErrorCtx(c, err, "Failed to update score for tryout attempt", map[string]any{"attempt_id": attemptID})
		return err
	}

	return nil
}

// make a function that retrieves the answer key from the soal service and the subtest, also distinguish them from the soal type and shit type shit bro
func (s *scoreService) GetAnswerKeyBasedOnSubtestFromSoalService(c context.Context, subtest, token, tokenType string) (*models.AnswerKeys, error) {
	// 1. Create gRPC request
	req := &pb.GetAnswerKeyRequest{
		PaketSoal: "paket1", // This is still hardcoded, as in your original
		Subtest:   subtest,
	}

	// 2. Add authentication token to gRPC metadata (context)
	var cookieName string
	switch tokenType {
	case "tryout":
		cookieName = "tryout_token"
	case "access":
		cookieName = "access_token"
	default:
		err := fmt.Errorf("invalid token type: %s", tokenType)
		logger.LogErrorCtx(c, err, "Invalid token type provided", map[string]any{"subtest": subtest})
		return nil, err
	}

	// Create context with metadata
	md := metadata.Pairs("cookie", fmt.Sprintf("%s=%s", cookieName, token))
	ctx := metadata.NewOutgoingContext(c, md)

	// 3. Call gRPC service
	resp, err := s.soalClient.GetAnswerKey(ctx, req)
	if err != nil {
		logger.LogErrorCtx(c, err, "gRPC call to GetAnswerKey failed", map[string]any{"subtest": subtest})
		return nil, err
	}

	// 4. Convert gRPC response back to internal model
	answerKey, err := convertToProtoModel(resp)
	if err != nil {
		logger.LogErrorCtx(c, err, "gRPC: failed to convert proto to model", map[string]any{"subtest": subtest})
		return nil, err
	}

	if isAnswerKeyEmpty(*answerKey) {
		err := fmt.Errorf("answer key is empty for subtest: %s", subtest)
		logger.LogErrorCtx(c, err, "Empty answer key received", map[string]any{"subtest": subtest})
		return nil, err
	}

	return answerKey, nil
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

		// check true false
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

func convertToProtoModel(resp *pb.GetAnswerKeyResponse) (*models.AnswerKeys, error) {
	keys := &models.AnswerKeys{
		PilihanGandaAnswers: make(map[string]map[string]struct {
			IsCorrect   bool
			Bobot       int
			TextPilihan string
			Pembahasan  string
		}),
		TrueFalseAnswers: make(map[string]struct {
			Jawaban     string
			Bobot       int
			TextPilihan string
			Pembahasan  string
		}),
		UraianAnswers: make(map[string]struct {
			Jawaban    string
			Bobot      int
			Pembahasan string
		}),
	}

	// Convert Pilihan Ganda
	for kodeSoal, grpcChoicesMap := range resp.PilihanGandaAnswers {
		choices := make(map[string]struct {
			IsCorrect   bool
			Bobot       int
			TextPilihan string
			Pembahasan  string
		})
		for choiceID, choice := range grpcChoicesMap.Choices {
			choices[choiceID] = struct {
				IsCorrect   bool
				Bobot       int
				TextPilihan string
				Pembahasan  string
			}{
				IsCorrect:   choice.IsCorrect,
				Bobot:       int(choice.Bobot),
				TextPilihan: choice.TextPilihan,
				Pembahasan:  choice.Pembahasan,
			}
		}
		keys.PilihanGandaAnswers[kodeSoal] = choices
	}

	// Convert True False
	for kodeSoal, answer := range resp.TrueFalseAnswers {
		keys.TrueFalseAnswers[kodeSoal] = struct {
			Jawaban     string
			Bobot       int
			TextPilihan string
			Pembahasan  string
		}{
			Jawaban:     answer.Jawaban,
			Bobot:       int(answer.Bobot),
			TextPilihan: answer.TextPilihan,
			Pembahasan:  answer.Pembahasan,
		}
	}

	// Convert Uraian
	for kodeSoal, answer := range resp.UraianAnswers {
		keys.UraianAnswers[kodeSoal] = struct {
			Jawaban    string
			Bobot      int
			Pembahasan string
		}{
			Jawaban:    answer.Jawaban,
			Bobot:      int(answer.Bobot),
			Pembahasan: answer.Pembahasan,
		}
	}

	return keys, nil
}
