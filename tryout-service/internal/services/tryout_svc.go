package services

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"time"
	"tryout-service/internal/models"
	"tryout-service/internal/repositories"

	"github.com/confluentinc/confluent-kafka-go/v2/kafka"
	"github.com/go-redis/redis/v8"
	"github.com/vityasyyy/sharedlib/logger"
)

type TryoutService interface {
	StartAttempt(c context.Context, userID int, username, paket string) (attempt *models.TryoutAttempt, retErr error)
	SyncWithDatabase(c context.Context, answers []models.AnswerPayload, userID int) (answersInCache []models.UserAnswer, timeLimit time.Time, err error)
	SubmitCurrentSubtest(c context.Context, answers []models.AnswerPayload, userID int, accessToken string) (updatedSubtest string, retErr error)
	GetCurrentAttempt(c context.Context, userID int) (*models.TryoutAttempt, error)
}

type tryoutService struct {
	tryoutRepo    repositories.TryoutRepo
	scoreService  ScoreService
	kafkaProducer *kafka.Producer
	redisClient   *redis.Client
}

func NewTryoutService(tryoutRepo repositories.TryoutRepo, scoreService ScoreService, kafkaProducer *kafka.Producer, redisClient *redis.Client) TryoutService {
	return &tryoutService{tryoutRepo: tryoutRepo, scoreService: scoreService, kafkaProducer: kafkaProducer, redisClient: redisClient}
}

func (s *tryoutService) StartAttempt(c context.Context, userID int, username, paket string) (attempt *models.TryoutAttempt, retErr error) {
	// sstart a transaction to the db
	startTime := time.Now()
	tx, err := s.tryoutRepo.BeginTransaction(c)
	if err != nil {
		logger.LogErrorCtx(c, err, "Failed to start transaction for starting attempt", map[string]any{
			"userID":   userID,
			"username": username,
			"paket":    paket,
		})
		return nil, err
	}

	// Defer rollback if error occurs, if something returns an error
	defer func() {
		if retErr != nil {
			if rbErr := tx.Rollback(); rbErr != nil {
				logger.LogErrorCtx(c, rbErr, "Failed to rollback transaction after error", map[string]any{
					"userID":   userID,
					"username": username,
					"paket":    paket,
				})
			}
		}
	}()

	// Check if user already has an ongoing attempt
	ongoing, _ := s.tryoutRepo.GetTryoutAttemptByUserIDTx(c, tx, userID)
	if ongoing != "" {
		retErr = errors.New("user already has an ongoing attempt")
		return nil, retErr
	}

	// Create new attempt object to later be saved in the database
	attempt = &models.TryoutAttempt{
		UserID:    userID,
		Username:  username,
		StartTime: startTime,
		Paket:     paket,
	}

	// Create new attempt, calling the db
	err = s.tryoutRepo.CreateTryoutAttemptTx(c, tx, attempt)
	if err != nil {
		logger.LogErrorCtx(c, err, "Failed to create tryout attempt", map[string]any{
			"userID":   userID,
			"username": username,
			"paket":    paket,
		})
		retErr = err
		return nil, retErr
	}

	// Issue tryout token using the access token and attempt id and user id from create tryout attempt

	// commit transaction if everything is successful
	if err := tx.Commit(); err != nil {
		logger.LogErrorCtx(c, err, "Failed to commit transaction after starting attempt", map[string]any{
			"userID":   userID,
			"username": username,
			"paket":    paket,
		})
		retErr = err
		return nil, retErr
	}

	return attempt, nil
}

// SyncWithDatabase is a service that syncs the answers from the user with the database
func (s *tryoutService) SyncWithDatabase(c context.Context, answers []models.AnswerPayload, userID int) (answersInCache []models.UserAnswer, timeLimit time.Time, retErr error) {
	var committed bool
	// Start transaction
	tx, err := s.tryoutRepo.BeginTransaction(c)
	if err != nil {
		logger.LogErrorCtx(c, err, "Failed to start transaction for syncing with database", map[string]any{"userID": userID})
		return nil, time.Time{}, err
	}

	// Ensure rollback on error
	defer func() {
		if committed {
			return
		}
		if retErr != nil {
			if rbErr := tx.Rollback(); rbErr != nil {
				logger.LogErrorCtx(c, rbErr, "Failed to rollback transaction after error", map[string]any{
					"layer":     "service",
					"operation": "SyncWithDatabase",
					"userID":    userID,
				})
			}
		}
	}()

	// Get and validate current attempt within transaction
	attempt, err := s.tryoutRepo.GetOngoingAttemptByUserIDTx(c, tx, userID)
	if err != nil {
		retErr = err
		logger.LogErrorCtx(c, err, "Failed to get tryout attempt", map[string]any{
			"userID": userID,
		})
		return nil, time.Time{}, retErr
	}

	attemptID := attempt.TryoutAttemptID

	if attempt.EndTime != nil {
		retErr = errors.New("tryout attempt has ended")
		return nil, time.Time{}, retErr
	}
	if attempt.Status != "ongoing" {
		retErr = errors.New("tryout attempt is not ongoing")
		return nil, time.Time{}, retErr
	}
	if attempt.SubtestSekarang == "" {
		retErr = errors.New("no active subtest found")
		return nil, time.Time{}, retErr
	}

	// Get time limit within transaction
	timeLimit, err = s.tryoutRepo.GetSubtestTimeTx(c, tx, attemptID, attempt.SubtestSekarang)
	if err != nil {
		retErr = err
		logger.LogErrorCtx(c, err, "Failed to get time limit for subtest", map[string]any{
			"attemptID": attemptID,
			"subtest":   attempt.SubtestSekarang,
		})
		return nil, time.Time{}, retErr
	}

	// exceed time limit, let redis kafka handle it
	if time.Now().After(timeLimit) {
		retErr = errors.New("time limit has been reached for this subtest")
		return nil, time.Time{}, retErr
	}

	kafkaAnswers := make([]models.UserAnswer, 0, len(answers))
	redisPipe := s.redisClient.Pipeline()
	redisKeyPrefix := fmt.Sprintf("attempt:%d:subtest:%s", attemptID, attempt.SubtestSekarang)
	redisAnswerMapKey := fmt.Sprintf("%s:answers", redisKeyPrefix)
	if len(answers) > 0 {
		redisAnswers := make(map[string]any)
		for _, answer := range answers {
			if answer.Jawaban != nil {
				// Add to map for Redis HSet
				redisAnswers[answer.KodeSoal] = *answer.Jawaban
				// Add to slice for Kafka event
				kafkaAnswers = append(kafkaAnswers, models.UserAnswer{
					TryoutAttemptID: attemptID,
					Subtest:         attempt.SubtestSekarang,
					KodeSoal:        answer.KodeSoal,
					Jawaban:         *answer.Jawaban,
				})
			}
		}

		if len(redisAnswers) > 0 {
			redisPipe.HSet(c, redisAnswerMapKey, redisAnswers)
			redisPipe.Expire(c, redisAnswerMapKey, 24*time.Hour) // Set expiration TODO should have timelimit as the expiry of th ecache
		}
	}
	allRedisAnswers, err := s.redisClient.HGetAll(c, redisAnswerMapKey).Result()
	if err != nil {
		logger.LogErrorCtx(c, err, "Failed to get all answers from Redis", map[string]any{"attemptID": attemptID})
		// Non-fatal, just return empty list
	} else {
		for k, v := range allRedisAnswers {
			answersInCache = append(answersInCache, models.UserAnswer{
				TryoutAttemptID: attemptID,
				Subtest:         attempt.SubtestSekarang,
				KodeSoal:        k,
				Jawaban:         v,
			})
		}
	}
	// Execute Redis pipeline
	if _, err := redisPipe.Exec(c); err != nil {
		// non fatal err, log but not return
		logger.LogErrorCtx(c, err, "Failed to exec redis pipeline for sync", map[string]any{"attemptID": attemptID})
	}

	if len(kafkaAnswers) > 0 {
		event := models.KafkaAnswerEvent{
			AttemptID: attemptID,
			UserID:    attempt.UserID,
			Subtest:   attempt.SubtestSekarang,
			Answers:   kafkaAnswers,
		}
		go s.publishToKafka(c, os.Getenv("KAFKA_ANSWER_TOPIC"), fmt.Sprintf("%d", attemptID), event)
	}
	return answersInCache, timeLimit, nil
}

func (s *tryoutService) SubmitCurrentSubtest(c context.Context, answers []models.AnswerPayload, userID int, accessToken string) (updatedSubtest string, retErr error) {
	// --- 1. Save final answers to Redis and publish to Kafka ---
	// (This part is non-transactional with the DB)
	var kafkaAnswers []models.UserAnswer

	var committed bool
	tx, err := s.tryoutRepo.BeginTransaction(c)
	if err != nil {
		logger.LogErrorCtx(c, err, "Failed to start transaction for submit")
		return "", err
	}
	defer func() {
		if !committed && retErr != nil {
			tx.Rollback()
		}
	}()

	attempt, err := s.tryoutRepo.GetOngoingAttemptByUserIDTx(c, tx, userID)
	if err != nil {
		logger.LogErrorCtx(c, err, "Failed to get tryout attempt for submit")
		return "", err
	}
	currentSubtest := attempt.SubtestSekarang
	attemptID := attempt.TryoutAttemptID
	// (Same Redis/Kafka logic as Sync)
	if len(answers) > 0 {
		redisAnswerMapKey := fmt.Sprintf("attempt:%d:subtest:%s:answers", attemptID, currentSubtest)
		redisAnswers := make(map[string]any)
		for _, answer := range answers {
			if answer.Jawaban != nil {
				redisAnswers[answer.KodeSoal] = *answer.Jawaban
				kafkaAnswers = append(kafkaAnswers, models.UserAnswer{
					TryoutAttemptID: attemptID,
					Subtest:         currentSubtest,
					KodeSoal:        answer.KodeSoal,
					Jawaban:         *answer.Jawaban,
				})
			}
		}
		if len(redisAnswers) > 0 {
			// Write to Redis (fire and forget, with logging)
			if err := s.redisClient.HSet(c, redisAnswerMapKey, redisAnswers).Err(); err != nil {
				logger.LogErrorCtx(c, err, "Failed to HSet answers on submit", map[string]any{"attemptID": attemptID})
			}
			s.redisClient.Expire(c, redisAnswerMapKey, 24*time.Hour)
		}
	}
	// Publish to Kafka (fire and forget, with logging)
	if len(kafkaAnswers) > 0 {
		event := models.KafkaAnswerEvent{
			AttemptID: attemptID,
			UserID:    attempt.UserID,
			Subtest:   currentSubtest,
			Answers:   kafkaAnswers,
		}
		go s.publishToKafka(c, os.Getenv("KAFKA_ANSWER_TOPIC"), fmt.Sprintf("%d", attemptID), event)
	}

	// --- 2. Handle State Change in a DB Transaction ---
	// Re-fetch attempt *inside* the transaction to lock the row
	attempt, err = s.tryoutRepo.GetOngoingAttemptByUserIDTx(c, tx, userID)
	if err != nil {
		retErr = err
		return "", retErr
	}

	attemptID = attempt.TryoutAttemptID
	// validate the attempt
	if attempt.EndTime != nil {
		retErr = errors.New("tryout attempt has already ended")
		return "", retErr
	}

	if attempt.SubtestSekarang == "" {
		retErr = errors.New("no active subtest found")
		return "", retErr
	}

	// Get time limit (check again inside transaction)
	timeLimit, err := s.tryoutRepo.GetSubtestTimeTx(c, tx, attemptID, currentSubtest)
	if err != nil {
		retErr = err
		return "", retErr
	}

	// Time limit check (as before)
	if time.Now().After(timeLimit) {
		// ... (delete attempt logic as before) ...
		if err = s.tryoutRepo.DeleteAttempt(c, tx, attemptID); err != nil {
			retErr = err
			return "", retErr
		}
		if err = tx.Commit(); err != nil {
			retErr = err
			return "", retErr
		}
		committed = true
		retErr = errors.New("time limit has been reached for this subtest")
		return "", retErr
	}

	// Get next subtest (as before)
	subtests := []string{"subtest_pu", "subtest_ppu", "subtest_pbm", "subtest_pk", "subtest_lbi", "subtest_lbe", "subtest_pm"}
	var nextSubtest *string
	for i, sub := range subtests {
		if sub == currentSubtest && i < len(subtests)-1 {
			nextSubtest = &subtests[i+1]
			break
		}
	}

	// if no next subtest, end the tryout
	if nextSubtest == nil {
		err = s.tryoutRepo.EndTryOutTx(c, tx, attemptID) // Mark as 'finished'
		if err != nil {
			retErr = err
			return "", retErr
		}

		// *** PUBLISH TO KAFKA FOR SCORING ***
		// (Replaces direct call to scoreService)
		scoringEvent := models.KafkaScoringEvent{
			AttemptID:   attemptID,
			UserID:      userID,
			AccessToken: accessToken,
		}
		go s.publishToKafka(c, os.Getenv("KAFKA_SCORING_TOPIC"), fmt.Sprintf("%d", attemptID), scoringEvent)

		if err := tx.Commit(); err != nil {
			retErr = err
			return "", retErr
		}
		committed = true
		return "final", nil
	}

	// Progress to next subtest
	updatedSubtest, err = s.tryoutRepo.ProgressTryoutTx(c, tx, attemptID, *nextSubtest)
	if err != nil {
		retErr = err
		return "", retErr
	}

	if err := tx.Commit(); err != nil {
		retErr = err
		return "", retErr
	}
	committed = true

	return updatedSubtest, nil
}

func (s *tryoutService) GetCurrentAttempt(c context.Context, attemptID int) (*models.TryoutAttempt, error) {
	return s.tryoutRepo.GetTryoutAttempt(c, attemptID)
}

func (s *tryoutService) publishToKafka(ctx context.Context, topic string, key string, data any) {
	payload, err := json.Marshal(data)
	if err != nil {
		logger.LogErrorCtx(ctx, err, "Failed to marshal Kafka payload", map[string]any{"topic": topic})
		return
	}

	msg := &kafka.Message{
		TopicPartition: kafka.TopicPartition{Topic: &topic, Partition: kafka.PartitionAny},
		Value:          payload,
		Key:            []byte(key),
	}

	// Produce message
	err = s.kafkaProducer.Produce(msg, nil) // nil delivery channel for fire-and-forget
	if err != nil {
		logger.LogErrorCtx(ctx, err, "Failed to produce Kafka message", map[string]any{"topic": topic})
	}
}
