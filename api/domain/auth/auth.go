package auth

import (
	"errors"

	"github.com/golang-jwt/jwt/v5"
	"github.com/labstack/echo/v4"
)

// GetUserIDFromContext extracts user ID from JWT token in Echo context
func GetUserIDFromContext(c echo.Context) (string, error) {
	token, ok := c.Get("user").(*jwt.Token)
	if !ok {
		return "", errors.New("User authentication failed")
	}
	claims := token.Claims.(jwt.MapClaims)
	userId, ok := claims["sub"].(string)
	if !ok {
		return "", errors.New("Invalid token claims")
	}
	return userId, nil
}
