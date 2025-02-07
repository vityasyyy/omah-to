package services

import (
	"errors"

	"auth-service/internal/logger"
	"auth-service/internal/models"
	"auth-service/internal/repositories"
	"auth-service/internal/utils"
)

type AuthService interface {
	RegisterUser(user *models.User) error
	LoginUser(username, password string) (string, string, error)
}

type authService struct {
	authRepo     repositories.AuthRepo
	tokenService RefreshTokenService
}

func NewAuthService(authRepo repositories.AuthRepo, tokenService RefreshTokenService) AuthService {
	return &authService{authRepo: authRepo, tokenService: tokenService}
}

func (s *authService) RegisterUser(userFromHandlers *models.User) error {
	// check if a user with that username exists, returns nil if no user is found and okay to proceed
	existingUser, err := s.authRepo.GetUserByUsername(userFromHandlers.NamaUser)
	if err != nil {
		logger.LogError(err, "Failed to get user", map[string]interface{}{"layer": "service", "operation": "RegisterUser"})
		return err
	}
	if existingUser != nil {
		logger.LogError(err, "User exists", map[string]interface{}{"layer": "service", "operation": "RegisterUser"})
		return errors.New("user with that username already exists")
	}

	// hash the password before storing it in the database
	hashedPassword, err := utils.HashPassword(userFromHandlers.Password)
	if err != nil {
		logger.LogError(err, "Failed to hash password", map[string]interface{}{"layer": "service", "operation": "RegisterUser"})
		return err
	}
	// set the user struct that is passed by the handlers password to the hashed password
	userFromHandlers.Password = hashedPassword

	// call the repo and create the user using the repo function, if the error is nil then log the error
	if err := s.authRepo.CreateUser(userFromHandlers); err != nil {
		logger.LogError(err, "Failed to create user", map[string]interface{}{"layer": "service", "operation": "RegisterUser"})
		return err
	}

	return nil
}

func (s *authService) LoginUser(username, password string) (string, string, error) {
	// get the user that wants to login using the username that is passed from handler
	userThatWantsToLogin, err := s.authRepo.GetUserByUsername(username)
	if err != nil {
		logger.LogError(err, "Failed to login", map[string]interface{}{"layer": "service", "operation": "LoginUser"})
		return "", "", errors.New("invalid email or password")
	}

	// check the password that the user entered with the password in the database (check hash)
	if validPassword := utils.CheckPasswordHash(password, userThatWantsToLogin.Password); !validPassword {
		logger.LogError(err, "Failed to login", map[string]interface{}{"layer": "service", "operation": "LoginUser"})
		return "", "", errors.New("invalid email or password")
	}

	// if all is okay then generate the token pair and return it to the handler to be sent to the client
	accessToken, refreshToken, err := s.tokenService.GenerateAccessRefreshTokenPair(userThatWantsToLogin.UserID)
	if err != nil {
		logger.LogError(err, "Failed to generate token pair", map[string]interface{}{"layer": "service", "operation": "LoginUser"})
		return "", "", errors.New("failed to generate token pair")
	}

	return accessToken, refreshToken, nil
}
