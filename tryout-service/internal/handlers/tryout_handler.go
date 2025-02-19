package handlers

import (
	"net/http"
	"tryout-service/internal/services"

	"github.com/gin-gonic/gin"
)

type TryoutHandler struct {
	tryoutService services.TryoutService
}

func NewTryoutHandler(tryoutService services.TryoutService) *TryoutHandler {
	return &TryoutHandler{tryoutService: tryoutService}
}

func (h *TryoutHandler) StartAttempt(c *gin.Context) {
	// retrieve user_id and access token from context
	userID := c.GetInt("user_id")
	accessToken, _ := c.Cookie("access_token")
	if accessToken == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Access token is required"})
		return
	}

	// start the attempt, making a new record in the database
	attempt, err := h.tryoutService.StartAttempt(userID, accessToken)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to start attempt", "error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Successfully started attempt", "data": attempt})
}
