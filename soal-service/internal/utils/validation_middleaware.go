package utils

import (
	"fmt"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

func ValidateToAuthApi() gin.HandlerFunc {
	return func(c *gin.Context) {
		// get the tryout token or access token from the context cookie sent by the client
		tryoutToken, errTryout := c.Cookie("tryout_token")
		accessToken, errAccess := c.Cookie("access_token")

		var authServiceURL string
		var token string

		// check if the tryout token or access token is present
		if errTryout == nil && tryoutToken != "" {
			authServiceURL = os.Getenv("AUTH_SERVICE_URL") + "/tryout/validatetryout"
			token = tryoutToken
		} else if errAccess == nil && accessToken != "" {
			authServiceURL = os.Getenv("AUTH_SERVICE_URL") + "/auth/validateprofile"
			token = accessToken
		} else {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "No valid authentication token found"})
			c.Abort()
			return
		}

		// send a request to the auth service to validate the token
		req, err := http.NewRequest("GET", authServiceURL, nil)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create request"})
			c.Abort()
			return
		}

		// add a cookie to the request
		if tryoutToken != "" {
			req.Header.Add("Cookie", fmt.Sprintf("tryout_token=%s", token))
		} else {
			req.Header.Add("Cookie", fmt.Sprintf("access_token=%s", token))
		}

		// make a http client, send the request, and check the response
		client := &http.Client{}
		response, err := client.Do(req)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send request"})
			c.Abort()
			return
		}
		defer response.Body.Close()
		if response.StatusCode != http.StatusOK {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid authentication token"})
			c.Abort()
			return
		}
		c.Next()
	}
}
