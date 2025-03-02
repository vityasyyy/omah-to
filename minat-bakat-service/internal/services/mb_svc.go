package services

import (
	"errors"
	"minat-bakat-service/internal/logger"
	"minat-bakat-service/internal/models"
	"minat-bakat-service/internal/repositories"
)

type MinatBakatService interface {
	ProcessMinatBakatAnswers(userID int, answers []models.MinatBakatAnswers) (string, error)
	GetMinatBakatAttempt(userID int) (*models.MinatBakatAttempt, error)
}

type minatBakatService struct {
	minatBakatRepo repositories.MbRepo
}

func NewMinatBakatService(minatBakatRepo repositories.MbRepo) MinatBakatService {
	return &minatBakatService{minatBakatRepo: minatBakatRepo}
}

func (s *minatBakatService) ProcessMinatBakatAnswers(userID int, answers []models.MinatBakatAnswers) (string, error) {
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
		logger.LogError(errors.New("failed to get top interest"), "Failed to get top interest", map[string]interface{}{"layer": "service", "operation": "ProcessMinatBakatAnswers"})
		return "", errors.New("failed to get top interest")
	}

	attempt := models.MinatBakatAttempt{
		UserID:    userID,
		BakatUser: topInterest,
	}

	err := s.minatBakatRepo.StoreMinatBakat(&attempt)
	if err != nil {
		logger.LogError(err, "Failed to store minat bakat", map[string]interface{}{"layer": "service", "operation": "ProcessMinatBakatAnswers"})
		return "", err
	}

	return topInterest, nil
}

func (s *minatBakatService) GetMinatBakatAttempt(userID int) (*models.MinatBakatAttempt, error) {
	attempt, err := s.minatBakatRepo.GetMinatBakatFromUserID(userID)
	if err != nil {
		logger.LogError(err, "Failed to get minat bakat from user id", map[string]interface{}{"layer": "service", "operation": "GetMinatBakatAttempt"})
		return nil, err
	}

	return attempt, nil
}
