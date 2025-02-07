package services

import (
	"auth-service/internal/logger"
	"auth-service/internal/models"
	"auth-service/internal/repositories"
	"auth-service/internal/utils"
	"time"
)

type RefreshTokenService interface {
	GenerateAccessRefreshTokenPair(userID int) (string, string, error)
	ValidateRefreshToken(refreshToken string) (string, string, error)
}

type refreshTokenService struct {
	refreshTokenRepo repositories.RefreshTokenRepo
	authRepo         repositories.AuthRepo
}

func NewRefreshTokenService(refreshTokenRepo repositories.RefreshTokenRepo, authRepo repositories.AuthRepo) RefreshTokenService {
	return &refreshTokenService{refreshTokenRepo: refreshTokenRepo, authRepo: authRepo}
}

func (s *refreshTokenService) GenerateAccessRefreshTokenPair(userID int) (string, string, error) {
	// Get user using user id so that it can be used to generate the access token
	user, err := s.authRepo.GetUserByID(userID)
	if err != nil {
		logger.LogError(err, "Failed to get user for token pair generation", map[string]interface{}{"layer": "service", "operation": "GenerateAccessRefreshTokenPair"})
		return "", "", err
	}

	// generate access token using the user that we fetched
	accessToken, err := utils.CreateAccessToken(user.UserID, user.NamaUser, user.AsalSekolah)
	if err != nil {
		logger.LogError(err, "Failed to generate access token", map[string]interface{}{"layer": "service", "operation": "GenerateAccessRefreshTokenPair"})
		return "", "", err
	}

	// generate opqaue refresh token and later store in the database for later check
	refreshToken, err := utils.CreateRefreshToken()
	if err != nil {
		logger.LogError(err, "Failed to generate refresh token", map[string]interface{}{"layer": "service", "operation": "GenerateAccessRefreshTokenPair"})
		return "", "", err
	}

	// store the refresh token in the database
	err = s.refreshTokenRepo.StoreRefreshToken(&models.RefreshToken{
		UserID:            userID,
		RefreshTokenValue: refreshToken,
		ExpiredAt:         time.Now().Add(7 * 24 * time.Hour),
		CreatedAt:         time.Now(),
		Revoked:           false,
	})
	if err != nil {
		logger.LogError(err, "Failed to store refresh token", map[string]interface{}{"layer": "service", "operation": "GenerateAccessRefreshTokenPair"})
		return "", "", err
	}
	// return the access token and refresh token for handler or auth service to send to the client
	return accessToken, refreshToken, nil
}

func (s *refreshTokenService) ValidateRefreshToken(refreshTokenString string) (string, string, error) {
	// find the refresh token in the database
	refreshToken, err := s.refreshTokenRepo.FindValidRefreshToken(refreshTokenString)
	if err != nil {
		logger.LogError(err, "Failed to find valid refresh token", map[string]interface{}{"layer": "service", "operation": "ValidateRefreshToken"})
		return "", "", err
	}

	// revoke the refresh token so that it can't be used again
	err = s.refreshTokenRepo.RevokeRefreshToken(refreshTokenString)
	if err != nil {
		logger.LogError(err, "Failed to revoke refresh token", map[string]interface{}{"layer": "service", "operation": "ValidateRefreshToken"})
		return "", "", err
	}

	// generate new token pair for the user
	newAccessToken, newRefreshToken, err := s.GenerateAccessRefreshTokenPair(refreshToken.UserID)
	if err != nil {
		logger.LogError(err, "Failed to generate new token pair while validating refresh token", map[string]interface{}{"layer": "service", "operation": "ValidateRefreshToken"})
		return "", "", err
	}

	return newAccessToken, newRefreshToken, nil

}
