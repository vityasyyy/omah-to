package main

import (
	"auth-service/internal/handlers"
	"auth-service/internal/logger"
	"auth-service/internal/repositories"
	"auth-service/internal/routes"
	"auth-service/internal/services"
	"auth-service/internal/utils"
	"os"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
	"github.com/ulule/limiter/v3"
	memory "github.com/ulule/limiter/v3/drivers/store/memory"
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
	r.Use(utils.ReqLoggingMiddleware()) // Request logging middleware
	r.Use(securityHeadersMiddleware())  // Security headers middleware

	// CORS middleware
	r.Use(cors.New(cors.Config{
		//AllowOrigins:     []string{"http://localhost:3000", "https://auth.omahtryout.web.id", "http://tryout-service-api:8082", "h"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders:     []string{"Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length", "Authorization", "Content-Type"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	r.Use(rateLimiterMiddleware()) // Rate limiter middleware

	routes.InitializeRoutes(r, userHandler)
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	if err := r.Run(":" + port); err != nil {
		logger.Log.Fatal().Err(err).Msg("Failed to start the server")
	}

	logger.Log.Info().Msg("Server started successfully")
}

// securityHeadersMiddleware adds security headers to all responses
func securityHeadersMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("X-Content-Type-Options", "nosniff")
		c.Writer.Header().Set("X-Frame-Options", "DENY")
		c.Writer.Header().Set("X-XSS-Protection", "1; mode=block")
		// c.Writer.Header().Set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload") // Enforce HTTPS
		c.Writer.Header().Set("Content-Security-Policy", "default-src 'self'; frame-ancestors 'none';") // Prevents XSS
		c.Next()
	}
}

func rateLimiterMiddleware() gin.HandlerFunc {
	store := memory.NewStore()
	rate := limiter.Rate{
		Period: 1 * time.Minute,
		Limit:  25, // Allow max 10 requests per minute per IP
	}
	// Create a new rate limiter instance
	instance := limiter.New(store, rate)

	return func(c *gin.Context) {
		ctx, err := instance.Get(c, c.ClientIP())
		// If an error occurred or the limit is reached, abort the request
		if err != nil || ctx.Reached {
			c.AbortWithStatusJSON(429, gin.H{"error": "Too many requests"})
			return
		}
		c.Next()
	}
}
