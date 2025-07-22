package handlers

import (
	"net/http"

	"soal-service/internal/logger"
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

	soalGabungans, err := h.soalService.GetSoalByPaketAndSubtest(c, paketSoal, subtest)
	if err != nil {
		logger.LogErrorCtx(c, err, "Failed to get soal by paket and subtest", map[string]interface{}{"paket_soal": paketSoal, "subtest": subtest})
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to get soal by paket and subtest"})
		return
	}
	c.JSON(http.StatusOK, soalGabungans)
}

func (h *SoalHandler) GetAnswerKeyByPaketAndSubtest(c *gin.Context) {
	var paketSoal = c.Param("paket_soal")
	var subtest = c.Request.URL.Query().Get("subtest")

	answerKeys, err := h.soalService.GetAnswerKeyByPaketAndSubtest(c, paketSoal, subtest)
	if err != nil {
		logger.LogErrorCtx(c, err, "Failed to get answer key by paket and subtest", map[string]interface{}{"paket_soal": paketSoal, "subtest": subtest})
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to get answer key by paket and subtest"})
		return
	}
	c.JSON(http.StatusOK, answerKeys)
}

func (h *SoalHandler) GetMinatBakatSoal(c *gin.Context) {
	minatBakatSoal, err := h.soalService.GetMinatBakatSoal(c)
	if err != nil {
		logger.LogErrorCtx(c, err, "Failed to get minat bakat soal")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to get minat bakat soal"})
		return
	}
	c.JSON(http.StatusOK, minatBakatSoal)
}
