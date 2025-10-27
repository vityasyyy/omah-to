package consumers

import (
	"context"
	"encoding/json"
	"log"
	"tryout-service/internal/models"
	"tryout-service/internal/repositories"

	"github.com/confluentinc/confluent-kafka-go/v2/kafka"
	"github.com/jmoiron/sqlx"
	"github.com/vityasyyy/sharedlib/logger"
)

// StartAnswerConsumer starts a Kafka consumer for the tryout_answers topic
func StartAnswerConsumer(brokers, topic string, db *sqlx.DB) {
	consumer, err := kafka.NewConsumer(&kafka.ConfigMap{
		"bootstrap.servers": brokers,
		"group.id":          "tryout-answer-savers", // Consumer group ID
		"auto.offset.reset": "earliest",
	})
	if err != nil {
		log.Fatalf("Failed to create answer consumer: %s", err)
	}
	defer consumer.Close()

	if err := consumer.SubscribeTopics([]string{topic}, nil); err != nil {
		log.Fatalf("Failed to subscribe to topic %s: %s", topic, err)
	}

	for {
		ctx := context.Background()

		msg, err := consumer.ReadMessage(-1) // Block until next message
		if err != nil {
			logger.LogErrorCtx(ctx, err, "Answer consumer read error")
			continue
		}

		var event models.KafkaAnswerEvent
		if err := json.Unmarshal(msg.Value, &event); err != nil {
			logger.LogErrorCtx(ctx, err, "Failed to unmarshal answer event",
				map[string]any{"topic": *msg.TopicPartition.Topic, "offset": msg.TopicPartition.Offset})
			continue // Skip bad message
		}

		// --- Process message with DB transaction ---
		// This is where the idempotent write happens
		repo := repositories.NewTryoutRepo(db)
		tx, err := repo.BeginTransaction(ctx)
		if err != nil {
			logger.LogErrorCtx(ctx, err, "Consumer failed to begin transaction", map[string]any{"attemptID": event.AttemptID})
			continue // Retry message later
		}

		err = repo.SaveAnswersTx(ctx, tx, event.Answers)
		if err != nil {
			logger.LogErrorCtx(ctx, err, "Consumer failed to save answers", map[string]any{"attemptID": event.AttemptID})
			tx.Rollback()
			continue // Retry message later
		}

		if err := tx.Commit(); err != nil {
			logger.LogErrorCtx(ctx, err, "Consumer failed to commit transaction", map[string]any{"attemptID": event.AttemptID})
			continue // Retry message later
		}
		// --- End Transaction ---
	}
}
