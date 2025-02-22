package handlers

import (
	"net/http"
	"tryout-service/internal/models"
	"tryout-service/internal/services"
	"tryout-service/internal/utils"

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
	paket := c.Param("paket")
	accessToken, _ := c.Cookie("access_token")
	if accessToken == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Access token is required"})
		return
	}
	// start the attempt, making a new record in the database
	attempt, tryoutToken, err := h.tryoutService.StartAttempt(userID, paket, accessToken)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to start attempt", "error": err.Error()})
		return
	}
	// set the tryout token to the context cookie
	if err = utils.SetTryoutTokenCookie(c, tryoutToken); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to set tryout token", "error": err.Error()})
	}

	c.JSON(http.StatusOK, gin.H{"message": "Successfully started attempt", "data": attempt})
}

func (h *TryoutHandler) SyncHandler(c *gin.Context) {
	attemptID := c.GetInt("attempt_id")
	userID := c.GetInt("user_id")
	var answers struct {
		Answers []models.AnswerPayload `json:"answers"`
	}

	if err := c.ShouldBindJSON(&answers); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid input", "error": err.Error()})
		return
	}
	answersInDB, timeLimit, err := h.tryoutService.SyncWithDatabase(answers.Answers, attemptID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to sync answers", "error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Successfully synced answers", "data": gin.H{"answers": answersInDB, "time_limit": timeLimit}, "attemptID": attemptID, "userID": userID})
}

func (h *TryoutHandler) ProgressTryoutHandler(c *gin.Context) {
	attemptID := c.GetInt("attempt_id")

	var answers struct {
		Answers []models.AnswerPayload `json:"answers"`
	}

	if err := c.ShouldBindJSON(&answers); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"message": "Invalid input", "error": err.Error()})
		return
	}

	updatedSubtest, err := h.tryoutService.SubmitCurrentSubtest(answers.Answers, attemptID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Failed to submit answers", "error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Successfully get progress", "updated_subtest": updatedSubtest})
}
