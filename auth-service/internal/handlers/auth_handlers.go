package handlers

import (
	"auth-service/internal/models"
	"auth-service/internal/services"
	"auth-service/internal/utils"
	"net/http"

	"github.com/gin-gonic/gin"
)

type UserHandler struct {
	authService  services.AuthService
	tokenService services.RefreshTokenService
}

func NewUserHandler(authService services.AuthService, tokenService services.RefreshTokenService) *UserHandler {
	return &UserHandler{authService: authService, tokenService: tokenService}
}

func (h *UserHandler) RegisterUserHandler(c *gin.Context) {
	var userStructThatWantsToRegister models.User

	// check if the password is more than 72 characters (bcrypt limitation)
	if len(userStructThatWantsToRegister.Password) > 72 {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Password maximum length is 72 characters"})
		return
	}

	// bind the json input to the user struct so that it matches the user models
	if err := c.ShouldBindJSON(&userStructThatWantsToRegister); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid input", "error": err.Error()})
		return
	}

	// call the register user function from the auth service
	if err := h.authService.RegisterUser(&userStructThatWantsToRegister); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Failed to register user", "error": err.Error()})
		return
	}

	// if the user is registered successfully, return a success message and status code 201
	c.JSON(http.StatusCreated, gin.H{"message": "User registered successfully"})
}

func (h *UserHandler) LoginUserHandler(c *gin.Context) {
	// create a struct to hold the login request that will be sent by the client
	var loginRequestStruct struct {
		NamaUser string `json:"nama_user" binding:"required"`
		Password string `json:"password" binding:"required"`
	}

	// bind the json input to the login request struct
	if err := c.ShouldBindJSON(&loginRequestStruct); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid input", "error": err.Error()})
		return
	}

	// call the login user function from the auth service
	accessToken, refreshToken, err := h.authService.LoginUser(loginRequestStruct.NamaUser, loginRequestStruct.Password)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Failed to login", "error": err.Error()})
		return
	}

	// set the access and refresh token in the cookie
	if err := utils.SetAccessAndRefresh(c, accessToken, refreshToken); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to set cookie", "error": err.Error()})
		return
	}

	// if the login is successful, return a success message and status code 200
	c.JSON(http.StatusOK, gin.H{"message": "Login successful"})
}

func (h *UserHandler) LogoutUserHandler(c *gin.Context) {
	// get the refresh token from the cookie
	refreshToken, err := c.Cookie("refresh_token")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Failed to get refresh token for revoke", "error": err.Error()})
		return
	}

	// blacklist the refresh token, if it's not possible then the token is already invalid
	err = h.tokenService.BlacklistRefreshToken(refreshToken)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Failed to blacklist token, you are already logged out"})
		return
	}

	// clear cookies after blacklisting the refresh token
	utils.ClearCookie(c, "access_token")
	utils.ClearCookie(c, "refresh_token")

	// return a success message and status code 200
	c.JSON(http.StatusOK, gin.H{"message": "Logout successful"})
}

func (h *UserHandler) RefreshTokenHandler(c *gin.Context) {
	// get the refresh token from the cookie
	refreshToken, err := c.Cookie("refresh_token")
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Failed to retrieve cookie", "error": err.Error()})
		return
	}
	if refreshToken == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "No refresh token found in cookie"})
		return
	}

	// validate the refresh token and generate a new token pair from the validate refresh token function from the service layer
	newAccessToken, newRefreshToken, err := h.tokenService.ValidateRefreshToken(refreshToken)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Failed to validate refresh token", "error": err.Error()})
		return
	}

	// set the new access and refresh token in the cookie
	if err := utils.SetAccessAndRefresh(c, newAccessToken, newRefreshToken); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to set cookie after refreshing tokens", "error": err.Error()})
		return
	}

	// return a success message and status code 200
	c.JSON(http.StatusOK, gin.H{"message": "Token refreshed"})
}

func (h *UserHandler) ValidateUserAndGetInfoHandler(c *gin.Context) {
	// get the user info from the context middleware
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Failed to get user ID from context middleware"})
		return
	}
	username, exists := c.Get("nama_user")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Failed to get username from context middleware"})
		return
	}
	asalSekolah, exists := c.Get("asal_sekolah")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Failed to get asal sekolah from context middleware"})
		return
	}
	// return the user info and status code 200
	c.JSON(http.StatusOK, gin.H{"message": "Authorized and okay to proceed", "user_id": userID, "username": username, "asal_sekolah": asalSekolah})
}
