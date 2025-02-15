package routes

import (
	"soal-service/internal/handlers"
	"soal-service/internal/utils"

	"github.com/gin-gonic/gin"
)

func InitializeRoutes(r *gin.Engine, soalHandler *handlers.SoalHandler) {
	ping := r.Group("/ping")
	{
		ping.GET("/", func(c *gin.Context) {
			c.JSON(200, gin.H{
				"message": "pong",
			})
		})
	}

	soal := r.Group("/soal")
	soal.Use(utils.ValidateToAuthApi())
	{
		soal.GET("/:paket_soal", soalHandler.GetSoalByPaketAndSubtest)
		soal.GET("/answer-key/:paket_soal", soalHandler.GetAnswerKeyByPaketAndSubtest)
	}
}
