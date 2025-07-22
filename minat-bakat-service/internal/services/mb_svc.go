package services

import (
	"context"
	"errors"
	"minat-bakat-service/internal/logger"
	"minat-bakat-service/internal/models"
	"minat-bakat-service/internal/repositories"
)

type MinatBakatService interface {
	ProcessMinatBakatAnswers(c context.Context, userID int, answers []models.MinatBakatAnswers) (string, error)
	GetMinatBakatAttempt(c context.Context, userID int) (*models.MinatBakatAttempt, error)
}

type minatBakatService struct {
	minatBakatRepo repositories.MbRepo
}

func NewMinatBakatService(minatBakatRepo repositories.MbRepo) MinatBakatService {
	return &minatBakatService{minatBakatRepo: minatBakatRepo}
}

func (s *minatBakatService) ProcessMinatBakatAnswers(c context.Context, userID int, answers []models.MinatBakatAnswers) (string, error) {
	existingAttempt, _ := s.minatBakatRepo.GetMinatBakatFromUserID(c, userID)
	if existingAttempt != nil {
		logger.LogErrorCtx(c, errors.New("user already has minat bakat attempt"), "User already has minat bakat attempt", map[string]interface{}{"user_id": userID})
		// Return an error if the user already has a minat
		return "", errors.New("user already has minat bakat attempt")
	}
	counts := make(map[string]int)

	for _, answer := range answers {
		counts[answer.Jawaban]++
	}

	var maxCount int
	var topInterest string
	for interest, count := range counts {
		if count > maxCount {
			maxCount = count
			topInterest = interest
		}
	}

	if topInterest == "" {
		logger.LogErrorCtx(c, errors.New("no valid interest found"), "Failed to get top interest")
		return "", errors.New("failed to get top interest")
	}

	attempt := models.MinatBakatAttempt{
		UserID:    userID,
		BakatUser: topInterest,
	}

	err := s.minatBakatRepo.StoreMinatBakat(c, &attempt)
	if err != nil {
		logger.LogErrorCtx(c, err, "Failed to store minat bakat attempt")
		return "", err
	}

	return topInterest, nil
}

func (s *minatBakatService) GetMinatBakatAttempt(c context.Context, userID int) (*models.MinatBakatAttempt, error) {
	attempt, err := s.minatBakatRepo.GetMinatBakatFromUserID(c, userID)
	if err != nil {
		logger.LogErrorCtx(c, err, "Failed to get minat bakat attempt", map[string]interface{}{"user_id": userID})
		return nil, err
	}

	return attempt, nil
}
