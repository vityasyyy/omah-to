package server

import (
	"soal-service/internal/handlers"
	"soal-service/internal/repositories"
	"soal-service/internal/routes"
	"soal-service/internal/services"
	"time"

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
	// Setup repositories and services
	soalRepo := repositories.NewSoalRepo(db)
	soalService := services.NewSoalService(soalRepo)
	soalHandler := handlers.NewSoalHandler(soalService)

	routes.InitializeRoutes(r, soalHandler)
	return r
}
