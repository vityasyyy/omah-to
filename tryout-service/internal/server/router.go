package server

import (
	"time"
	"tryout-service/internal/handlers"
	"tryout-service/internal/repositories"
	"tryout-service/internal/routes"
	"tryout-service/internal/services"

	"os"

	"github.com/gin-gonic/gin"
	"github.com/jmoiron/sqlx"
	"github.com/prometheus/client_golang/prometheus/promhttp"
	"github.com/vityasyyy/sharedlib/middleware"

	"strings"
)

func NewRouter(db *sqlx.DB) *gin.Engine {
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

	// Dependencies
	soalServiceURL := os.Getenv("SOAL_SERVICE_URL")

	tryoutRepo := repositories.NewTryoutRepo(db)
	scoreRepo := repositories.NewScoreRepo(db)
	pageRepo := repositories.NewPageRepo(db)

	scoreService := services.NewScoreService(scoreRepo, soalServiceURL)
	pageService := services.NewPageService(pageRepo, scoreService, tryoutRepo)
	tryoutService := services.NewTryoutService(tryoutRepo, scoreService)

	tryoutHandler := handlers.NewTryoutHandler(tryoutService)
	pageHandler := handlers.NewPageHandler(pageService)

	routes.InitializeRoutes(r, tryoutHandler, pageHandler)
	return r
}
