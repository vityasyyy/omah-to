package utils

import (
	"os"
	"time"

	"crypto/rand"
	"encoding/hex"

	"github.com/golang-jwt/jwt/v5"
)

var jwtSecretKey = []byte(os.Getenv("JWT_SECRET_KEY"))

type AccessTokenClaims struct {
	UserID      int    `json:"user_id"`
	NamaUser    string `json:"nama_user"`
	AsalSekolah string `json:"asal_sekolah"`
	jwt.RegisteredClaims
}

// Create AccessToken for the user to later be sent via cookies to the frontend (used for authentication and authorization)
func CreateAccessToken(userID int, namaUser, asalSekolah string) (string, error) {
	expirationTime := time.Now().Add(15 * time.Minute)
	claims := AccessTokenClaims{
		UserID:      userID,
		NamaUser:    namaUser,
		AsalSekolah: asalSekolah,
		// RegisteredClaims is a struct that contains the standard claims (exp, iat, nbf, iss, aud, sub, jti)
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	// Create a new token with the claims and the signing method
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// Sign the token with the secret key
	return token.SignedString(jwtSecretKey)
}

// Create an opaque refresh token (doesn't contain any credentials, just for refreshing purpose) for the user to later be stored in the database (used for refreshing the access token)
func CreateRefreshToken() (string, error) {
	bytes := make([]byte, 32)  // 32 bytes = 256 bits
	_, err := rand.Read(bytes) // generate random bytes
	if err != nil {
		return "", err
	}
	// Encode the random bytes to a hexadecimal string
	return hex.EncodeToString(bytes), nil
}

// Validate AccessToken to check if it's valid, returns a pointer to AccessTokenClaims if valid
func ValidateAccessToken(accessToken string) (*AccessTokenClaims, error) {

	// Parse the token, use the accessToken to extract the claims into the AccessTokenClaims struct, and validate the token using the secret key in our .env file
	token, err := jwt.ParseWithClaims(accessToken, &AccessTokenClaims{}, func(token *jwt.Token) (interface{}, error) {
		return jwtSecretKey, nil // lookup function to get the secret key
	})

	if err != nil {
		return nil, err
	}

	// Check if the extracted token can be casted to AccessTokenClaims to make "ok" true, and token.Valid is true if it's not expired and the signature is valid
	if claims, ok := token.Claims.(*AccessTokenClaims); ok && token.Valid {
		return claims, nil // return the claims (pointer to the AccessTokenClaims) if the token is valid
	}

	// If the token is invalid, return nil and an error
	return nil, jwt.ErrTokenInvalidClaims
}
