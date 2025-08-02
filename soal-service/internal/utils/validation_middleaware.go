package utils

import (
	"log"
	"net/http"
	"os"
	"time"

	"github.com/MicahParks/keyfunc"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
)

var jwks *keyfunc.JWKS

func init() {
	// Fetch JWKS at startup
	jwksURL := os.Getenv("JWKS_URL") // e.g., https://auth.omahto.localhost/user/.well-known/jwks.json
	if jwksURL == "" {
		log.Fatal("JWKS_URL not set in environment")
	}

	var err error
	jwks, err = keyfunc.Get(jwksURL, keyfunc.Options{
		RefreshInterval: time.Hour,
		RefreshErrorHandler: func(err error) {
			log.Printf("error refreshing JWKS: %v", err)
		},
		RefreshTimeout:    10 * time.Second,
		RefreshUnknownKID: true,
	})
	if err != nil {
		log.Fatalf("failed to load JWKS: %v", err)
	}
}

func ValidateJWT() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Get token from cookie
		tryoutToken, errTryout := c.Cookie("tryout_token")
		accessToken, errAccess := c.Cookie("access_token")

		var tokenStr string
		if errTryout == nil && tryoutToken != "" {
			tokenStr = tryoutToken
		} else if errAccess == nil && accessToken != "" {
			tokenStr = accessToken
		} else {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "No valid authentication token found"})
			c.Abort()
			return
		}

		// Parse and verify token using JWKS
		token, err := jwt.Parse(tokenStr, jwks.Keyfunc)
		if err != nil || !token.Valid {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
			c.Abort()
			return
		}

		// Optionally: store claims in context
		if claims, ok := token.Claims.(jwt.MapClaims); ok {
			c.Set("claims", claims)
		}

		c.Next()
	}
}
