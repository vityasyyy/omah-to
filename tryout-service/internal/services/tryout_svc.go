package services

import (
	"errors"
	"time"
	"tryout-service/internal/logger"
	"tryout-service/internal/models"
	"tryout-service/internal/repositories"
	"tryout-service/internal/utils"
)

type TryoutService interface {
	StartAttempt(userID int, accessToken string) (*models.TryoutAttempt, error)
	SyncWithDatabase(answers []models.AnswerPayload, attemptID int) (answerInDB []models.UserAnswer, timeLimit time.Time, err error)
	SubmitCurrentSubtest(answers []models.AnswerPayload, attemptID int) error
	SubmitTryOut(attemptID int) error
}

type tryoutService struct {
	tryoutRepo repositories.TryoutRepo
}

func NewTryoutService(tryoutRepo repositories.TryoutRepo) TryoutService {
	return &tryoutService{tryoutRepo: tryoutRepo}
}

func (s *tryoutService) StartAttempt(userID int, accessToken string) (*models.TryoutAttempt, error) {
	// Check if user has any ongoing attempts (MUST IMPLEMENT LATER)
	attempt := &models.TryoutAttempt{
		UserID:    userID,
		StartTime: time.Now(),
	}

	// Create new attempt, calling the db
	err := s.tryoutRepo.CreateTryoutAttempt(attempt)
	if err != nil {
		logger.LogError(err, "Failed to create tryout attempt", map[string]interface{}{
			"layer":     "service",
			"operation": "StartAttempt",
			"userID":    userID,
		})
		return nil, err
	}

	// Issue tryout token using the access token and attempt id and user id from create tryout attempt
	err = utils.IssueTryOutToken(userID, attempt.TryoutAttemptID, accessToken)
	if err != nil {
		logger.LogError(err, "Failed to issue tryout token", map[string]interface{}{
			"layer":     "service",
			"operation": "StartAttempt",
			"userID":    userID,
		})
		s.tryoutRepo.DeleteAttempt(attempt.TryoutAttemptID)
		return nil, errors.New("failed to issue tryout token")
	}

	return attempt, nil
}

func (s *tryoutService) SyncWithDatabase(answers []models.AnswerPayload, attemptID int) (answerInDB []models.UserAnswer, timeLimit time.Time, err error) {
	// Get the current attempt and validate its state
	attempt, err := s.tryoutRepo.GetTryoutAttempt(attemptID)
	if err != nil {
		logger.LogError(err, "Failed to get tryout attempt", map[string]interface{}{
			"layer":     "service",
			"operation": "SyncWithDatabase",
			"attemptID": attemptID,
		})
		return nil, time.Time{}, err
	}

	if attempt.EndTime != nil {
		return nil, time.Time{}, errors.New("tryout attempt has ended")
	}

	if attempt.SubtestSekarang == "" {
		return nil, time.Time{}, errors.New("no active subtest found")
	}

	// Get time limit for current subtest
	timeLimit, err = s.tryoutRepo.GetSubtestTime(attemptID, attempt.SubtestSekarang)
	if err != nil {
		logger.LogError(err, "Failed to get time limit", map[string]interface{}{
			"layer":     "service",
			"operation": "SyncWithDatabase",
			"attemptID": attemptID,
			"subtest":   attempt.SubtestSekarang,
		})
		return nil, time.Time{}, err
	}

	if time.Now().After(timeLimit) {
		return nil, time.Time{}, errors.New("time limit has been reached for this subtest")
	}

	// Process and save new answers
	if len(answers) > 0 {
		userAnswers := make([]models.UserAnswer, 0, len(answers))
		for _, answer := range answers {
			userAnswer := models.UserAnswer{
				TryoutAttemptID: attemptID,
				Subtest:         attempt.SubtestSekarang,
				KodeSoal:        answer.KodeSoal,
				Jawaban:         answer.Jawaban,
			}
			userAnswers = append(userAnswers, userAnswer)
		}

		err = s.tryoutRepo.SaveAnswers(userAnswers)
		if err != nil {
			logger.LogError(err, "Failed to save answers", map[string]interface{}{
				"layer":     "service",
				"operation": "SyncWithDatabase",
				"attemptID": attemptID,
			})
			return nil, timeLimit, err
		}
	}

	// Get updated answers from database
	answersInDB, err := s.tryoutRepo.GetAnswerFromCurrentAttemptAndSubtest(attemptID, attempt.SubtestSekarang)
	if err != nil {
		logger.LogError(err, "Failed to get answers from database", map[string]interface{}{
			"layer":     "service",
			"operation": "SyncWithDatabase",
			"attemptID": attemptID,
		})
		return nil, timeLimit, err
	}

	return answersInDB, timeLimit, nil
}

func (s *tryoutService) SubmitCurrentSubtest(answers []models.AnswerPayload, attemptID int) error {
	// Get and validate current attempt
	attempt, err := s.tryoutRepo.GetTryoutAttempt(attemptID)
	if err != nil {
		logger.LogError(err, "Failed to get tryout attempt", map[string]interface{}{
			"layer":     "service",
			"operation": "SubmitCurrentSubtest",
			"attemptID": attemptID,
		})
		return err
	}

	if attempt.EndTime != nil {
		return errors.New("tryout attempt has already ended")
	}

	if attempt.SubtestSekarang == "" {
		return errors.New("no active subtest found")
	}

	// Save final answers if any
	if len(answers) > 0 {
		userAnswers := make([]models.UserAnswer, 0, len(answers))
		for _, answer := range answers {
			userAnswer := models.UserAnswer{
				TryoutAttemptID: attemptID,
				Subtest:         attempt.SubtestSekarang,
				KodeSoal:        answer.KodeSoal,
				Jawaban:         answer.Jawaban,
			}
			userAnswers = append(userAnswers, userAnswer)
		}

		err = s.tryoutRepo.SaveAnswers(userAnswers)
		if err != nil {
			logger.LogError(err, "Failed to save final answers", map[string]interface{}{
				"layer":     "service",
				"operation": "SubmitCurrentSubtest",
				"attemptID": attemptID,
			})
			return err
		}
	}

	// End current subtest
	err = s.tryoutRepo.ProgressTryout(attemptID, attempt.SubtestSekarang)
	if err != nil {
		logger.LogError(err, "Failed to end subtest", map[string]interface{}{
			"layer":     "service",
			"operation": "SubmitCurrentSubtest",
			"attemptID": attemptID,
		})
		return err
	}

	return nil
}

func (s *tryoutService) SubmitTryOut(attemptID int) error {
	// Get and validate current attempt
	attempt, err := s.tryoutRepo.GetTryoutAttempt(attemptID)
	if err != nil {
		logger.LogError(err, "Failed to get tryout attempt", map[string]interface{}{
			"layer":     "service",
			"operation": "SubmitTryOut",
			"attemptID": attemptID,
		})
		return err
	}

	if attempt.EndTime != nil {
		return errors.New("tryout attempt has already ended")
	}

	// End the tryout
	err = s.tryoutRepo.EndTryOut(attemptID)
	if err != nil {
		logger.LogError(err, "Failed to end tryout", map[string]interface{}{
			"layer":     "service",
			"operation": "SubmitTryOut",
			"attemptID": attemptID,
		})
		return err
	}

	return nil
}
