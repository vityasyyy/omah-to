package routes

import (
	"minat-bakat-service/internal/handlers"

	"github.com/vityasyyy/sharedlib/jwt"

	"github.com/gin-gonic/gin"
)

func InitializeRoutes(r *gin.Engine, mbHandler *handlers.MinatBakatHandler) {
	ping := r.Group("/ping")
	{
		ping.GET("/", func(c *gin.Context) {
			c.JSON(200, gin.H{
				"message": "pong",
			})
		})
	}

	mb := r.Group("/minat-bakat")
	mb.Use(jwt.ValidateJWT())
	{
		mb.POST("/process", mbHandler.ProcessMinatBakatHandler)
		mb.GET("/attempt", mbHandler.GetMinatBakatAttemptHandler)
	}
}
