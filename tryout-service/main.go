package main

import (
	"context"
	"os"
	"strings"
	"time"
	"tryout-service/internal/handlers"
	"tryout-service/internal/logger"
	"tryout-service/internal/repositories"
	"tryout-service/internal/routes"
	"tryout-service/internal/services"
	"tryout-service/internal/utils"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
	"github.com/ulule/limiter/v3"
	memory "github.com/ulule/limiter/v3/drivers/store/memory"
)

func main() {
	corsURLs := os.Getenv("CORS_URL")
	allowedOrigins := strings.Split(corsURLs, ",")
	logger.InitLogger()

	// Set Gin mode early before creating the engine
	if os.Getenv("ENVIRONMENT") == "production" {
		gin.SetMode(gin.ReleaseMode)
	} else {
		gin.SetMode(gin.DebugMode) // Explicitly set debug mode if not in production
	}

	logger.InitLogger()
	dbURL := os.Getenv("DB_URL")
	db, err := sqlx.Connect("postgres", dbURL)
	if err != nil {
		logger.Log.Fatal().Err(err).Msg("Failed to connect to the database")
	}
	defer db.Close()

	soalServiceURL := os.Getenv("SOAL_SERVICE_URL")

	tryoutRepo := repositories.NewTryoutRepo(db)
	scoreRepo := repositories.NewScoreRepo(db)
	pageRepo := repositories.NewPageRepo(db)

	scoreService := services.NewScoreService(scoreRepo, soalServiceURL)
	pageService := services.NewPageService(pageRepo, scoreService, tryoutRepo)
	tryoutService := services.NewTryoutService(tryoutRepo, scoreService)

	tryoutHandler := handlers.NewTryoutHandler(tryoutService)
	pageHandler := handlers.NewPageHandler(pageService)

	// Use gin.New() instead of gin.Default() to avoid warning about middleware already attached
	r := gin.New()

	// Manually add the Logger and Recovery middleware
	r.Use(gin.Recovery())

	r.Use(utils.ReqLoggingMiddleware()) // Request logging middleware
	r.Use(securityHeadersMiddleware())  // Security headers middleware
	r.SetTrustedProxies([]string{"0.0.0.0/0"})

	// CORS middleware
	r.Use(cors.New(cors.Config{
		AllowOrigins:     allowedOrigins, // change to a specific origin later
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE"},
		AllowHeaders:     []string{"Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length", "Authorization", "Content-Type"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	r.Use(rateLimiterMiddleware())             // Rate limiter middleware
	r.Use(requestSizeLimitMiddleware(2 << 20)) // Request size limit middleware (2MB)
	r.Use(timeoutMiddleware(20 * time.Second)) // Timeout middleware

	routes.InitializeRoutes(r, tryoutHandler, pageHandler)
	port := os.Getenv("PORT")
	if port == "" {
		port = "8083"
	}

	logger.Log.Info().Msg("Server started successfully")

	if err := r.Run(":" + port); err != nil {
		logger.Log.Fatal().Err(err).Msg("Failed to start the server")
	}
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

func timeoutMiddleware(timeout time.Duration) gin.HandlerFunc {
	return func(c *gin.Context) {
		ctx, cancel := context.WithTimeout(c.Request.Context(), timeout)
		defer cancel()

		c.Request = c.Request.WithContext(ctx)
		c.Next()
	}
}

func requestSizeLimitMiddleware(maxSize int64) gin.HandlerFunc {
	return func(c *gin.Context) {
		if c.Request.ContentLength > maxSize {
			c.AbortWithStatusJSON(413, gin.H{"error": "Payload too large"})
			return
		}
		c.Next()
	}
}
