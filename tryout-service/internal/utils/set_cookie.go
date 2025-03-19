package utils

import (
	"os"

	"github.com/gin-gonic/gin"
)

var cookieDomain = os.Getenv("COOKIE_DOMAIN")

func SetCookie(c *gin.Context, name, value string, maxAge int, path, domain string, secure, httpOnly bool) {
	c.SetCookie(
		name,
		value,
		maxAge,
		path,
		domain,
		secure,
		httpOnly)
}

func SetAccessAndRefresh(c *gin.Context, tryoutToken string) error {
	SetCookie(c, "tryout_token", tryoutToken, 200*60, "/", cookieDomain, true, true) // access token, 15 mins
	return nil
}
