package services

import (
	"soal-service/internal/logger"
	"soal-service/internal/models"
	"soal-service/internal/repositories"
)

type SoalService interface {
	GetSoalByPaketAndSubtest(paketSoal, subtest string) ([]models.SoalGabungan, error)
	GetAnswerKeyByPaketAndSubtest(paketSoal, subtest string) (*models.AnswerKeys, error)
	GetMinatBakatSoal() ([]models.MinatBakatGabungan, error)
}

type soalService struct {
	soalRepo repositories.SoalRepo
}

func NewSoalService(soalRepo repositories.SoalRepo) SoalService {
	return &soalService{soalRepo: soalRepo}
}

func (s *soalService) GetSoalByPaketAndSubtest(paketSoal, subtest string) ([]models.SoalGabungan, error) {
	soalGabungans, err := s.soalRepo.GetSoalByPaketAndSubtest(paketSoal, subtest)
	if err != nil {
		logger.LogError(err, "Failed to get soal by paket and subtest", map[string]interface{}{"layer": "service", "operation": "GetSoalByPaketAndSubtest"})
		return nil, err
	}

	return soalGabungans, nil
}

func (s *soalService) GetAnswerKeyByPaketAndSubtest(paketSoal, subtest string) (*models.AnswerKeys, error) {
	answerKeys, err := s.soalRepo.GetAnswerKeyByPaketAndSubtest(paketSoal, subtest)
	if err != nil {
		logger.LogError(err, "Failed to get answer key by paket and subtest", map[string]interface{}{"layer": "service", "operation": "GetAnswerKeyByPaketAndSubtest"})
		return nil, err
	}

	return answerKeys, nil
}

func (s *soalService) GetMinatBakatSoal() ([]models.MinatBakatGabungan, error) {
	minatBakatSoal, err := s.soalRepo.GetMinatBakatSoal()
	if err != nil {
		logger.LogError(err, "Failed to get minat bakat soal", map[string]interface{}{"layer": "service", "operation": "GetMinatBakatSoal"})
		return nil, err
	}

	return minatBakatSoal, nil
}
