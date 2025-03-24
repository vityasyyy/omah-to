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
