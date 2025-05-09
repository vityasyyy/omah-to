package handlers

import (
	"minat-bakat-service/internal/models"
	"minat-bakat-service/internal/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

type MinatBakatHandler struct {
	minatBakatService services.MinatBakatService
}

func NewMinatBakatHandler(minatBakatService services.MinatBakatService) *MinatBakatHandler {
	return &MinatBakatHandler{minatBakatService: minatBakatService}
}

func (h *MinatBakatHandler) ProcessMinatBakatHandler(c *gin.Context) {
	userID := c.GetInt("user_id")
	var answers []models.MinatBakatAnswers

	if err := c.ShouldBindJSON(&answers); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	topInterest, err := h.minatBakatService.ProcessMinatBakatAnswers(userID, answers)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to process minat bakat answers"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"top_interest": topInterest})
}

func (h *MinatBakatHandler) GetMinatBakatAttemptHandler(c *gin.Context) {
	userID := c.GetInt("user_id")

	attempt, err := h.minatBakatService.GetMinatBakatAttempt(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to get minat bakat attempt"})
		return
	}

	c.JSON(http.StatusOK, attempt)
}
