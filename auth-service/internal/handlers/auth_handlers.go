package handlers

import (
	"auth-service/internal/models"
	"auth-service/internal/services"
	"auth-service/pkg/utils/cookie"
	"auth-service/pkg/utils/jwt"

	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/vityasyyy/sharedlib/logger"
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
		logger.LogErrorCtx(c, errors.New("password too long"), "Password maximum length is 72 characters", map[string]interface{}{"email": userStructThatWantsToRegister.Email})
		c.JSON(http.StatusBadRequest, gin.H{"message": "Password maximum length is 72 characters"})
		return
	}

	// bind the json input to the user struct so that it matches the user models
	if err := c.ShouldBindJSON(&userStructThatWantsToRegister); err != nil {
		logger.LogErrorCtx(c, err, "Failed to bind user input", map[string]interface{}{"email": userStructThatWantsToRegister.Email})
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid input", "error": err.Error()})
		return
	}

	// call the register user function from the auth service
	if err := h.authService.RegisterUser(c, &userStructThatWantsToRegister); err != nil {
		logger.LogErrorCtx(c, err, "Failed to register user", map[string]interface{}{"email": userStructThatWantsToRegister.Email})
		if err.Error() == "user with that email already exists" {
			c.JSON(http.StatusConflict, gin.H{"message": "User with that email already exists"})
			return
		}
		c.JSON(http.StatusBadRequest, gin.H{"message": "Failed to register user", "error": err.Error()})
		return
	}

	// if the user is registered successfully, return a success message and status code 201
	c.JSON(http.StatusCreated, gin.H{"message": "User registered successfully"})
}

func (h *UserHandler) LoginUserHandler(c *gin.Context) {
	// create a struct to hold the login request that will be sent by the client
	var loginRequestStruct struct {
		Email    string `json:"email" binding:"required"`
		Password string `json:"password" binding:"required"`
	}

	// bind the json input to the login request struct
	if err := c.ShouldBindJSON(&loginRequestStruct); err != nil {
		logger.LogErrorCtx(c, err, "Failed to bind login request input", map[string]interface{}{"email": loginRequestStruct.Email})
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid input", "error": err.Error()})
		return
	}

	// call the login user function from the auth service
	accessToken, refreshToken, err := h.authService.LoginUser(c, loginRequestStruct.Email, loginRequestStruct.Password)
	if err != nil {
		logger.LogErrorCtx(c, err, "Failed to login", map[string]interface{}{"email": loginRequestStruct.Email})
		c.JSON(http.StatusBadRequest, gin.H{"message": "Failed to login", "error": err.Error()})
		return
	}

	// set the access and refresh token in the cookie
	if err := cookie.SetAccessAndRefresh(c, accessToken, refreshToken); err != nil {
		logger.LogErrorCtx(c, err, "Failed to set cookie after login", map[string]interface{}{"email": loginRequestStruct.Email})
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
		logger.LogErrorCtx(c, err, "Failed to retrieve cookie for logout")
		c.JSON(http.StatusBadRequest, gin.H{"message": "Failed to get refresh token for revoke", "error": err.Error()})
		return
	}

	// blacklist the refresh token, if it's not possible then the token is already invalid
	err = h.tokenService.BlacklistRefreshToken(c, refreshToken)
	if err != nil {
		logger.LogErrorCtx(c, err, "Failed to blacklist refresh token", map[string]interface{}{"refresh_token": refreshToken})
		c.JSON(http.StatusUnauthorized, gin.H{"message": "You are already logged out"})
		return
	}

	// clear cookies after blacklisting the refresh token
	cookie.ClearCookie(c, "access_token")
	cookie.ClearCookie(c, "refresh_token")

	// return a success message and status code 200
	c.JSON(http.StatusOK, gin.H{"message": "Logout successful"})
}

func (h *UserHandler) RefreshTokenHandler(c *gin.Context) {
	// get the refresh token from the cookie
	refreshToken, err := c.Cookie("refresh_token")
	if err != nil {
		logger.LogErrorCtx(c, err, "Failed to retrieve cookie for refresh token")
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Failed to retrieve cookie", "error": err.Error()})
		return
	}
	if refreshToken == "" {
		logger.LogErrorCtx(c, errors.New("no refresh token found in cookie"), "No refresh token found in cookie")
		c.JSON(http.StatusUnauthorized, gin.H{"message": "No refresh token found in cookie"})
		return
	}

	// validate the refresh token and generate a new token pair from the validate refresh token function from the service layer
	newAccessToken, newRefreshToken, err := h.tokenService.ValidateRefreshToken(c, refreshToken)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Failed to validate refresh token", "error": err.Error()})
		return
	}

	// set the new access and refresh token in the cookie
	if err := cookie.SetAccessAndRefresh(c, newAccessToken, newRefreshToken); err != nil {
		logger.LogErrorCtx(c, err, "Failed to set cookie after refreshing tokens")
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to set cookie after refreshing tokens", "error": err.Error()})
		return
	}

	// return a success message and status code 200
	c.JSON(http.StatusOK, gin.H{"message": "Token refreshed", "newAccessToken": newAccessToken, "newRefreshToken": newRefreshToken})
}

func (h *UserHandler) ValidateUserAndGetInfoHandler(c *gin.Context) {
	// get the user info from the context middleware
	claimsVal, exists := c.Get("claims")
	if !exists {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to get user info from context"})
		return
	}

	claims, ok := claimsVal.(jwt.AccessTokenClaims)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to get user info from context"})
		return
	}

	// return the user info and status code 200
	c.JSON(http.StatusOK, gin.H{"message": "Authorized and okay to proceed", "email": claims.Email, "user_id": claims.UserID, "username": claims.NamaUser, "asal_sekolah": claims.AsalSekolah})
}

func (h *UserHandler) RequestPasswordResetHandler(c *gin.Context) {
	// create a struct to hold the email that will be sent by the client
	var emailStruct struct {
		Email string `json:"email" binding:"required"`
	}

	// bind the json input to the email struct
	if err := c.ShouldBindJSON(&emailStruct); err != nil {
		logger.LogErrorCtx(c, err, "Failed to bind email input", map[string]interface{}{"email": emailStruct.Email})
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid input", "error": err.Error()})
		return
	}

	// call the request password reset function from the auth service
	if err := h.authService.RequestPasswordReset(c, emailStruct.Email); err != nil {
		logger.LogErrorCtx(c, err, "Failed to request password reset", map[string]interface{}{"email": emailStruct.Email})
		c.JSON(http.StatusBadRequest, gin.H{"message": "Failed to request password reset", "error": err.Error()})
		return
	}

	// return a success message and status code 200
	c.JSON(http.StatusOK, gin.H{"message": "Password reset requested, check your spam folder if you receive nothing"})
}

func (h *UserHandler) ResetPasswordHandler(c *gin.Context) {
	// create a struct to hold the reset token and the new password that will be sent by the client
	var resetPasswordStruct struct {
		ResetToken  string `json:"reset_token" binding:"required"`
		NewPassword string `json:"new_password" binding:"required"`
	}

	// bind the json input to the reset password struct
	if err := c.ShouldBindJSON(&resetPasswordStruct); err != nil {
		logger.LogErrorCtx(c, err, "Failed to bind reset password input", map[string]interface{}{"reset_token": resetPasswordStruct.ResetToken})
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid input", "error": err.Error()})
		return
	}

	// call the reset password function from the auth service
	if err := h.authService.ResetPassword(c, resetPasswordStruct.ResetToken, resetPasswordStruct.NewPassword); err != nil {
		logger.LogErrorCtx(c, err, "Failed to reset password", map[string]interface{}{"reset_token": resetPasswordStruct.ResetToken})
		c.JSON(http.StatusBadRequest, gin.H{"message": "Failed to reset password", "error": err.Error()})
		return
	}

	// return a success message and status code 200
	c.JSON(http.StatusOK, gin.H{"message": "Password reset successful"})
}

func (h *UserHandler) JWKSHandler(c *gin.Context) {
	c.JSON(http.StatusOK, jwt.GetJWKS())
}
