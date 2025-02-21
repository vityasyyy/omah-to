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

	// public routes
	public := r.Group("/user")
	{
		public.POST("/register", userHandler.RegisterUserHandler)
		public.POST("/login", userHandler.LoginUserHandler)
		public.POST("/refresh", userHandler.RefreshTokenHandler)
		public.POST("/reset-password", userHandler.ResetPasswordHandler)
		public.POST("/request-password-reset", userHandler.RequestPasswordResetHandler)
	}

	// authorized routes for access token validation
	authorized := r.Group("/auth")
	authorized.Use(utils.ValidateAccessTokenMiddleware())
	{
		authorized.GET("/validateprofile", userHandler.ValidateUserAndGetInfoHandler)
		authorized.POST("/issue-token", userHandler.IssueTryOutTokenHandler)
		authorized.POST("/logout", userHandler.LogoutUserHandler)
	}

	// tryout routes for tryout token validation
	tryout := r.Group("/tryout")
	tryout.Use(utils.ValidateTryoutTokenMiddleware())
	{
		tryout.GET("/validatetryout", userHandler.ValidateTryoutTokenHandler)
	}
}
