package utils

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func ValidateAccessTokenMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// get the access token from the context cookie sent by the client
		accessToken, err := c.Cookie("access_token")
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Failed to get access token"})
			c.Abort()
		}
		if accessToken == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Access token is required"})
			c.Abort()
		}

		// validate the access token using the ValidateAccessToken function in the same utils package
		accessTokenClaims, err := ValidateAccessToken(accessToken)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid access token"})
			c.Abort()
		}

		// set the user information to the context
		c.Set("user_id", accessTokenClaims.UserID)
		c.Set("nama_user", accessTokenClaims.NamaUser)
		c.Set("asal_sekolah", accessTokenClaims.AsalSekolah)

		// proceed the request further
		c.Next()
	}
}
