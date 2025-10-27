package server

import (
	"context"
	"log"
	"os"
	"strings"
	"time"
	"tryout-service/internal/consumers" // New import
	"tryout-service/internal/handlers"
	pb "tryout-service/internal/proto/soal"
	"tryout-service/internal/repositories"
	"tryout-service/internal/routes"
	"tryout-service/internal/services"

	"github.com/confluentinc/confluent-kafka-go/v2/kafka"
	"github.com/gin-gonic/gin"
	"github.com/go-redis/redis/v8"
	"github.com/jmoiron/sqlx"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"github.com/vityasyyy/sharedlib/logger"
	"github.com/vityasyyy/sharedlib/middleware"
)

func NewRouter(db *sqlx.DB, soalClient pb.SoalServiceClient) *gin.Engine {
	if os.Getenv("ENVIRONMENT") == "production" {
		gin.SetMode(gin.ReleaseMode)
	} else {
		gin.SetMode(gin.DebugMode)
	}

	r := gin.New()
	r.Use(gin.Recovery())

	// Shared middlewares
	r.Use(middleware.RequestIDMiddleware())
	r.Use(middleware.ReqLoggingMiddleware())
	r.Use(middleware.PrometheusMiddleware())
	r.GET("/metrics", gin.WrapH(promhttp.Handler()))
	r.Use(middleware.RateLimiter(25, time.Minute))
	r.Use(middleware.CORSFromEnv(os.Getenv("CORS_URL")))
	r.SetTrustedProxies(strings.Split(os.Getenv("TRUSTED_PROXIES"), ","))

	redisAddr := os.Getenv("REDIS_ADDR")
	if redisAddr == "" {
		redisAddr = "localhost:6379"
	}
	redisClient := redis.NewClient(&redis.Options{
		Addr: redisAddr,
	})
	if _, err := redisClient.Ping(context.Background()).Result(); err != nil {
		log.Fatalf("Failed to connect to Redis at %s: %v", redisAddr, err)
	}

	// --- Initialize Kafka Producer ---
	kafkaBrokers := os.Getenv("KAFKA_BROKERS")
	if kafkaBrokers == "" {
		kafkaBrokers = "localhost:9092"
	}
	kafkaProducer, err := kafka.NewProducer(&kafka.ConfigMap{"bootstrap.servers": kafkaBrokers})
	if err != nil {
		log.Fatalf("Failed to create Kafka producer: %v", err)
	}
	ctx := context.Background()
	// Go routine to handle delivery reports
	go func() {
		for e := range kafkaProducer.Events() {
			switch ev := e.(type) {
			case *kafka.Message:
				if ev.TopicPartition.Error != nil {
					logger.LogErrorCtx(ctx, ev.TopicPartition.Error, "Kafka delivery failed",
						map[string]any{"topic": *ev.TopicPartition.Topic})
				} else {
					logger.LogDebugCtx(ctx, "Kafka message delivered",
						map[string]any{"topic": *ev.TopicPartition.Topic, "offset": ev.TopicPartition.Offset})
				}
			}
		}
	}()

	// --- Dependencies ---
	tryoutRepo := repositories.NewTryoutRepo(db)
	scoreRepo := repositories.NewScoreRepo(db)
	pageRepo := repositories.NewPageRepo(db)

	scoreService := services.NewScoreService(scoreRepo, soalClient)
	pageService := services.NewPageService(pageRepo, scoreService, tryoutRepo)

	// Inject Redis and Kafka Producer into TryoutService
	tryoutService := services.NewTryoutService(tryoutRepo, scoreService, kafkaProducer, redisClient)

	tryoutHandler := handlers.NewTryoutHandler(tryoutService)
	pageHandler := handlers.NewPageHandler(pageService)

	routes.InitializeRoutes(r, tryoutHandler, pageHandler)

	// --- Start Kafka Consumers ---
	// We pass the raw db connection and repo constructors to the consumers
	// This ensures they create their own dependencies per message if needed
	go consumers.StartAnswerConsumer(
		kafkaBrokers,
		os.Getenv("KAFKA_ANSWER_TOPIC"),
		db,
	)
	go consumers.StartScoringConsumer(
		kafkaBrokers,
		os.Getenv("KAFKA_SCORING_TOPIC"),
		db,         // Pass db
		soalClient, // Pass gRPC client
	)

	return r
}
