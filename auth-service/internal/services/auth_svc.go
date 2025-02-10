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
	LoginUser(email, password string) (string, string, error)
	RequestPasswordReset(email string) error
	ResetPassword(resetToken, newPassword string) error
}

type authService struct {
	authRepo     repositories.AuthRepo
	tokenService RefreshTokenService
}

func NewAuthService(authRepo repositories.AuthRepo, tokenService RefreshTokenService) AuthService {
	return &authService{authRepo: authRepo, tokenService: tokenService}
}

func (s *authService) RegisterUser(userFromHandlers *models.User) error {
	// check if a user with that email exists, returns nil if no user is found and okay to proceed
	existingUser, _ := s.authRepo.GetUserByEmail(userFromHandlers.Email)

	if existingUser != nil {
		logger.LogError(errors.New("user exists"), "User exists", map[string]interface{}{"layer": "service", "operation": "RegisterUser"})
		return errors.New("user with that email already exists")
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

func (s *authService) LoginUser(email, password string) (string, string, error) {
	// get the user that wants to login using the email that is passed from handler
	userThatWantsToLogin, err := s.authRepo.GetUserByEmail(email)
	if err != nil {
		logger.LogError(err, "Failed to login", map[string]interface{}{"layer": "service", "operation": "LoginUser"})
		return "", "", errors.New("invalid email or password")
	}

	// check the password that the user entered with the password in the database (check hash)
	if !utils.CheckPasswordHash(password, userThatWantsToLogin.Password) {
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

func (s *authService) RequestPasswordReset(email string) error {
	// get the user using the email that is passed from the handler
	user, err := s.authRepo.GetUserByEmail(email)
	if err != nil {
		logger.LogError(err, "Failed to request password reset", map[string]interface{}{"layer": "service", "operation": "RequestPasswordReset"})
		return errors.New("invalid email")
	}

	// generate a reset token and set the expired time to 24 hours from now
	resetToken, resetTokenExpiredAt, err := utils.CreateResetToken()
	if err != nil {
		logger.LogError(err, "Failed to generate reset token", map[string]interface{}{"layer": "service", "operation": "RequestPasswordReset"})
		return errors.New("failed to generate reset token")
	}

	// email the user the reset link, using utils later on

	// blacklist the token that is associated with the email, so that when user is requesting password reset, the token is blacklisted
	if err := s.tokenService.BlacklistTokenOnEmail(email); err != nil {
		logger.LogError(err, "Failed to blacklist token on email", map[string]interface{}{"layer": "service", "operation": "RequestPasswordReset"})
		return errors.New("failed to blacklist token on email")
	}

	// call the repo and store the reset token in the database
	err = s.authRepo.RequestingPasswordReset(user.Email, resetToken, resetTokenExpiredAt)
	if err != nil {
		logger.LogError(err, "Failed to request password reset", map[string]interface{}{"layer": "service", "operation": "RequestPasswordReset"})
		return errors.New("failed to request password reset")
	}

	return nil
}

func (s *authService) ResetPassword(resetToken, newPassword string) error {
	newHashedPassword, err := utils.HashPassword(newPassword)
	if err != nil {
		logger.LogError(err, "Failed to hash password", map[string]interface{}{"layer": "service", "operation": "ResetPassword"})
		return errors.New("failed to hash password")
	}

	// call the repo and reset the password using the reset token and the new password
	err = s.authRepo.ResetPassword(newHashedPassword, resetToken)
	if err != nil {
		logger.LogError(err, "Failed to reset password", map[string]interface{}{"layer": "service", "operation": "ResetPassword"})
		return errors.New("failed to reset password")
	}

	return nil
}
