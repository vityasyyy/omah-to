package utils

import (
	"soal-service/internal/logger"
	"time"

	"github.com/gin-gonic/gin"
)

func ReqLoggingMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()

		c.Next()

		duration := time.Since(start)

		logger.Log.Info().
			Str("method", c.Request.Method).
			Str("path", c.Request.URL.Path).
			Int("status", c.Writer.Status()).
			Dur("duration", duration).
			Str("ip_address", c.ClientIP()).
			Msg("Request processed")
	}
}
