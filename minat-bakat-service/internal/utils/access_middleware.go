package utils

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

func ValidateToAuthApi() gin.HandlerFunc {
	return func(c *gin.Context) {
		accessToken, err := c.Cookie("access_token")
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Failed to get Access token"})
			c.Abort()
			return
		}
		if accessToken == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Access token is required"})
			c.Abort()
			return
		}

		authServiceURL := os.Getenv("AUTH_SERVICE_URL") + "/auth/validateprofile"

		req, err := http.NewRequest("GET", authServiceURL, nil)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create request"})
			c.Abort()
			return
		}
		req.Header.Add("Cookie", fmt.Sprintf("access_token=%s", accessToken))

		client := &http.Client{}
		response, err := client.Do(req)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send request"})
			c.Abort()
			return
		}
		defer response.Body.Close()
		if response.StatusCode != http.StatusOK {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid access token"})
			c.Abort()
			return
		}

		body, err := io.ReadAll(response.Body)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read response body"})
			c.Abort()
			return
		}

		var authResponse struct {
			UserID   int    `json:"user_id"`
			Username string `json:"username"`
		}

		if err := json.Unmarshal(body, &authResponse); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse response body"})
			c.Abort()
			return
		}
		c.Set("user_id", authResponse.UserID)
		c.Set("username", authResponse.Username)
		c.Next()
	}
}
