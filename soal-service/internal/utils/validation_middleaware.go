package utils

import (
	"fmt"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

func ValidateToAuthApi() gin.HandlerFunc {
	return func(c *gin.Context) {
		tryoutToken, err := c.Cookie("tryout_token")
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Failed to get tryout token"})
			c.Abort()
			return
		}
		if tryoutToken == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Tryout token is required"})
			c.Abort()
			return
		}

		authServiceURL := os.Getenv("AUTH_SERVICE_URL") + "/auth/tryoutvalidate"

		req, err := http.NewRequest("GET", authServiceURL, nil)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create request"})
			c.Abort()
			return
		}
		req.Header.Add("Cookie", fmt.Sprintf("tryout_token=%s", tryoutToken))

		client := &http.Client{}
		response, err := client.Do(req)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send request"})
			c.Abort()
			return
		}
		defer response.Body.Close()
		if response.StatusCode != http.StatusOK {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid tryout token"})
			c.Abort()
			return
		}
		c.Next()
	}
}
