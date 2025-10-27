package handlers

import (
	"net/http"
	"tryout-service/internal/models"
	"tryout-service/internal/services"

	"github.com/vityasyyy/sharedlib/logger"

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
	username := c.GetString("username")
	paket := c.Param("paket")
	accessToken, _ := c.Cookie("access_token")
	if accessToken == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Access token is required"})
		return
	}
	// start the attempt, making a new record in the database
	attempt, err := h.tryoutService.StartAttempt(c, userID, username, paket)
	if err != nil {
		logger.LogErrorCtx(c, err, "Failed to start attempt")
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to start attempt", "error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Successfully started attempt", "data": attempt})
}

func (h *TryoutHandler) SyncHandler(c *gin.Context) {
	userID := c.GetInt("user_id")
	var answers struct {
		Answers []models.AnswerPayload `json:"answers" binding:"required,dive"`
	}

	if err := c.ShouldBindJSON(&answers); err != nil {
		logger.LogErrorCtx(c, err, "Invalid input for sync handler")
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid input", "error": err.Error()})
		return
	}
	answersInDB, timeLimit, err := h.tryoutService.SyncWithDatabase(c, answers.Answers, userID)
	if err != nil {
		logger.LogErrorCtx(c, err, "Failed to sync answers")
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to sync answers", "error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Successfully synced answers", "data": gin.H{"answers": answersInDB, "time_limit": timeLimit}, "userID": userID})
}

func (h *TryoutHandler) ProgressTryoutHandler(c *gin.Context) {
	userID := c.GetInt("user_id")
	accessToken, err := c.Cookie("access_token")
	if err != nil || accessToken == "" {
		logger.LogErrorCtx(c, err, "Access token not found in cookie")
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Access token is required"})
		return
	}
	var answers struct {
		Answers []models.AnswerPayload `json:"answers" binding:"required,dive"`
	}

	if err := c.ShouldBindJSON(&answers); err != nil {
		logger.LogErrorCtx(c, err, "Invalid input for progress handler")
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid input", "error": err.Error()})
		return
	}

	updatedSubtest, err := h.tryoutService.SubmitCurrentSubtest(c, answers.Answers, userID, accessToken)
	if err != nil {
		logger.LogErrorCtx(c, err, "Failed to submit answers")
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to submit answers", "error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Successfully get progress or submitted scores", "updated_subtest": updatedSubtest})
}

func (h *TryoutHandler) GetCurrentAttempt(c *gin.Context) {
	userID := c.GetInt("user_id")
	attempt, err := h.tryoutService.GetCurrentAttempt(c, userID)
	if err != nil {
		logger.LogErrorCtx(c, err, "Failed to get current attempt")
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to get current attempt", "error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Successfully get current attempt", "data": attempt})
}
