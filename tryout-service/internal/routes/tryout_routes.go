package routes

import (
	"tryout-service/internal/handlers"
	"tryout-service/internal/utils"

	"github.com/gin-gonic/gin"
)

func InitializeRoutes(r *gin.Engine, tryoutHandler *handlers.TryoutHandler) {
	ping := r.Group("/ping")
	{
		ping.GET("/", func(c *gin.Context) {
			c.JSON(200, gin.H{
				"message": "pong",
			})
		})
	}

	tryout := r.Group("/tryout")
	tryout.Use(utils.ValidateToAuthApi())
	{
		tryout.POST("/start-attempt/:paket", tryoutHandler.StartAttempt)
	}

	sync := r.Group("/sync")
	sync.Use(utils.ValidateTryoutToken())
	{
		sync.POST("", tryoutHandler.SyncHandler)
		sync.POST("/progress", tryoutHandler.ProgressTryoutHandler)
	}
}
