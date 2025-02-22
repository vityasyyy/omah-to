package utils

import (
	"github.com/gin-gonic/gin"
)

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
	SetCookie(c, "tryout_token", tryoutToken, 200*60, "/", "", true, true) // access token, 15 mins
	return nil
}
