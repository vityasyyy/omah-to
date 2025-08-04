package server

import (
	"auth-service/internal/handlers"
	"auth-service/internal/repositories"
	"auth-service/internal/routes"
	"auth-service/internal/services"
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
	authRepo := repositories.NewAuthRepo(db)
	tokenRepo := repositories.NewTokenRepository(db)
	tokenService := services.NewRefreshTokenService(tokenRepo, authRepo)
	authService := services.NewAuthService(authRepo, tokenService)
	userHandler := handlers.NewUserHandler(authService, tokenService)

	routes.InitializeRoutes(r, userHandler)
	return r
}
