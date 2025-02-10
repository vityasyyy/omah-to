package routes

import (
	"auth-service/internal/handlers"
	"auth-service/internal/utils"

	"github.com/gin-gonic/gin"
)

func InitializeRoutes(r *gin.Engine, userHandler *handlers.UserHandler) {
	ping := r.Group("/ping")
	{
		ping.GET("/", func(c *gin.Context) {
			c.JSON(200, gin.H{
				"message": "pong",
			})
		})
	}

	public := r.Group("/user")
	{
		public.POST("/register", userHandler.RegisterUserHandler)
		public.POST("/login", userHandler.LoginUserHandler)
		public.POST("/refresh", userHandler.RefreshTokenHandler)
		public.POST("/reset-password", userHandler.ResetPasswordHandler)
		public.POST("/request-password-reset", userHandler.RequestPasswordResetHandler)
	}

	authorized := r.Group("/auth")
	authorized.Use(utils.ValidateAccessTokenMiddleware())
	{
		authorized.GET("/validateprofile", userHandler.ValidateUserAndGetInfoHandler)
		authorized.POST("/logout", userHandler.LogoutUserHandler)
	}
}
