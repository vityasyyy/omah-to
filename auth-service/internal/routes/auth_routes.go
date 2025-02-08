package routes

import (
	"auth-service/internal/handlers"
	"auth-service/internal/utils"

	"github.com/gin-gonic/gin"
)

func InitializeRoutes(r *gin.Engine, userHandler *handlers.UserHandler) {
	public := r.Group("/user")
	{
		public.POST("/register", userHandler.RegisterUserHandler)
		public.POST("/login", userHandler.LoginUserHandler)
		public.POST("/refresh", userHandler.RefreshTokenHandler)
	}

	authorized := r.Group("/auth")
	authorized.Use(utils.ValidateAccessTokenMiddleware())
	{
		authorized.GET("/validateprofile", userHandler.ValidateUserAndGetInfoHandler)
		authorized.POST("/logout", userHandler.LogoutUserHandler)
	}
}
