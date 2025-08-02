package logger

import (
	"auth-service/internal/logger"
	"auth-service/internal/metrics"
	"fmt"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

const RequestIDKey = "request_id"

// RequestIDMiddleware ensures every request has a unique ID
func RequestIDMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		requestID := c.GetHeader("X-Request-ID")
		if requestID == "" {
			requestID = uuid.New().String() // Generate a new ID
		}
		c.Set(RequestIDKey, requestID)
		c.Writer.Header().Set("X-Request-ID", requestID) // Include in response

		c.Next()
	}
}

func ReqLoggingMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()
		requestID := c.GetString(RequestIDKey)

		// Create a request-scoped logger
		reqLogger := logger.Log.With().
			Str("request_id", requestID).
			Str("method", c.Request.Method).
			Str("path", c.Request.URL.Path).
			Logger()

		logger.AttachLogger(c, reqLogger)

		c.Next()

		duration := time.Since(start)
		reqLogger.Info().
			Int("status", c.Writer.Status()).
			Dur("duration", duration).
			Str("ip_address", c.ClientIP()).
			Msg("Request completed")
	}
}

func PrometheusMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()
		c.Next()
		status := fmt.Sprint(c.Writer.Status())
		path := c.FullPath()
		method := c.Request.Method
		duration := time.Since(start)
		metrics.HTTPReqs.WithLabelValues(method, path, status).Inc()
		metrics.HTTPDur.WithLabelValues(method, path).Observe(duration.Seconds())
	}
}
