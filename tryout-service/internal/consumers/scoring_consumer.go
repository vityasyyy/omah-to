package consumers

import (
	"context"
	"encoding/json"
	"log"
	"tryout-service/internal/models"
	pb "tryout-service/internal/proto/soal"
	"tryout-service/internal/repositories"
	"tryout-service/internal/services"

	"github.com/confluentinc/confluent-kafka-go/v2/kafka"
	"github.com/jmoiron/sqlx"
	"github.com/vityasyyy/sharedlib/logger"
)

// StartScoringConsumer starts a Kafka consumer for the tryout_scoring topic
func StartScoringConsumer(brokers, topic string, db *sqlx.DB, soalClient pb.SoalServiceClient) {
	consumer, err := kafka.NewConsumer(&kafka.ConfigMap{
		"bootstrap.servers": brokers,
		"group.id":          "tryout-scorers",
		"auto.offset.reset": "earliest",
	})
	if err != nil {
		log.Fatalf("Failed to create scoring consumer: %s", err)
	}
	defer consumer.Close()

	if err := consumer.SubscribeTopics([]string{topic}, nil); err != nil {
		log.Fatalf("Failed to subscribe to topic %s: %s", topic, err)
	}

	// Create a single ScoreService instance to use
	scoreRepo := repositories.NewScoreRepo(db)
	scoreService := services.NewScoreService(scoreRepo, soalClient)

	for {
		ctx := context.Background()

		msg, err := consumer.ReadMessage(-1)
		if err != nil {
			logger.LogErrorCtx(ctx, err, "Scoring consumer read error")
			continue
		}

		var event models.KafkaScoringEvent
		if err := json.Unmarshal(msg.Value, &event); err != nil {
			logger.LogErrorCtx(ctx, err, "Failed to unmarshal scoring event",
				map[string]any{"topic": *msg.TopicPartition.Topic, "offset": msg.TopicPartition.Offset})
			continue
		}

		// --- Process message with DB transaction ---
		// CalculateAndStoreScores must now create its own transaction
		tx, err := scoreRepo.BeginTransaction(ctx)
		if err != nil {
			logger.LogErrorCtx(ctx, err, "Scoring consumer failed to begin transaction", map[string]any{"attemptID": event.AttemptID})
			continue
		}

		err = scoreService.CalculateAndStoreScores(ctx, tx, event.AttemptID, event.UserID, event.AccessToken)
		if err != nil {
			logger.LogErrorCtx(ctx, err, "Consumer failed to calculate scores", map[string]any{"attemptID": event.AttemptID})
			tx.Rollback()
			continue // Retry message later
		}

		if err := tx.Commit(); err != nil {
			logger.LogErrorCtx(ctx, err, "Scoring consumer failed to commit transaction", map[string]any{"attemptID": event.AttemptID})
			continue // Retry message later
		}
		// --- End Transaction ---
	}
}
