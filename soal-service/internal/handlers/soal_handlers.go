package handlers

import (
	"net/http"

	"soal-service/internal/services"

	"github.com/gin-gonic/gin"
)

type SoalHandler struct {
	soalService services.SoalService
}

func NewSoalHandler(soalService services.SoalService) *SoalHandler {
	return &SoalHandler{soalService: soalService}
}

func (h *SoalHandler) GetSoalByPaketAndSubtest(c *gin.Context) {
	var paketSoal = c.Param("paket_soal")
	var subtest = c.Request.URL.Query().Get("subtest")

	soalGabungans, err := h.soalService.GetSoalByPaketAndSubtest(paketSoal, subtest)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to get soal by paket and subtest"})
		return
	}
	c.JSON(http.StatusOK, soalGabungans)
}

func (h *SoalHandler) GetAnswerKeyByPaketAndSubtest(c *gin.Context) {
	var paketSoal = c.Param("paket_soal")
	var subtest = c.Request.URL.Query().Get("subtest")

	answerKeys, err := h.soalService.GetAnswerKeyByPaketAndSubtest(paketSoal, subtest)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to get answer key by paket and subtest"})
		return
	}
	c.JSON(http.StatusOK, answerKeys)
}
