package main

import (
	"auth-service/internal/handlers"
	"auth-service/internal/logger"
	"auth-service/internal/repositories"
	"auth-service/internal/routes"
	"auth-service/internal/services"
	"auth-service/internal/utils"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
)

func main() {
	logger.InitLogger()
	dbURL := os.Getenv("DB_URL")
	db, err := sqlx.Connect("postgres", dbURL)
	if err != nil {
		logger.Log.Fatal().Err(err).Msg("Failed to connect to the database")
	}
	defer db.Close()

	authRepo := repositories.NewAuthRepo(db)
	refreshTokenRepo := repositories.NewTokenRepository(db)

	tokenService := services.NewRefreshTokenService(refreshTokenRepo, authRepo)
	authService := services.NewAuthService(authRepo, tokenService)

	userHandler := handlers.NewUserHandler(authService, tokenService)

	r := gin.Default()
	r.Use(utils.ReqLoggingMiddleware())
	routes.InitializeRoutes(r, userHandler)

	if err := r.Run(os.Getenv("PORT")); err != nil {
		logger.Log.Fatal().Err(err).Msg("Failed to start the server")
	}

	logger.Log.Info().Msg("Server started successfully")
}
