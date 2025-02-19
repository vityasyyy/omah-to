package utils

import (
	"bytes"
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
			UserID int `json:"user_id"`
		}

		if err := json.Unmarshal(body, &authResponse); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse response body"})
			c.Abort()
			return
		}
		c.Set("user_id", authResponse.UserID)
		c.Next()
	}
}

func IssueTryOutToken(userID, attemptID int, accessToken string) error {
	authServiceURL := os.Getenv("AUTH_SERVICE_URL") + "/auth/issue-token"
	type IssueTokenRequest struct {
		UserID    int `json:"user_id"`
		AttemptID int `json:"attempt_id"`
	}
	reqBody, err := json.Marshal(IssueTokenRequest{
		UserID:    userID,
		AttemptID: attemptID,
	})

	if err != nil {
		return fmt.Errorf("failed to marshal request body: %v", err)
	}

	req, err := http.NewRequest("POST", authServiceURL, bytes.NewBuffer(reqBody))
	if err != nil {
		return fmt.Errorf("failed to create request: %v", err)
	}

	// Set headers
	req.Header.Add("Cookie", fmt.Sprintf("access_token=%s", accessToken)) // Attach token

	// Send request using http.Client
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return fmt.Errorf("failed to send request: %v", err)
	}
	defer resp.Body.Close()

	// Check response status
	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("invalid status code: %d", resp.StatusCode)
	}

	return nil
}

func ValidateTryoutToken() gin.HandlerFunc {
	return func(c *gin.Context) {
		tryout_token, err := c.Cookie("tryout_token")
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Failed to get tryout token"})
			c.Abort()
			return
		}
		if tryout_token == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Tryout token is required"})
			c.Abort()
			return
		}

		authServiceURL := os.Getenv("AUTH_SERVICE_URL") + "/tryout/validatetryout"

		req, err := http.NewRequest("GET", authServiceURL, nil)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create request"})
			c.Abort()
			return
		}

		req.Header.Add("Cookie", fmt.Sprintf("tryout_token=%s", tryout_token))

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
