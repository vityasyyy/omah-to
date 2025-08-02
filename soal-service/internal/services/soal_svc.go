package services

import (
	"context"
	"soal-service/internal/logger"
	"soal-service/internal/models"
	"soal-service/internal/repositories"
)

type SoalService interface {
	GetSoalByPaketAndSubtest(c context.Context, paketSoal, subtest string) ([]models.SoalGabungan, error)
	GetAnswerKeyByPaketAndSubtest(c context.Context, paketSoal, subtest string) (*models.AnswerKeys, error)
	GetMinatBakatSoal(c context.Context) ([]models.MinatBakatGabungan, error)
}

type soalService struct {
	soalRepo repositories.SoalRepo
}

func NewSoalService(soalRepo repositories.SoalRepo) SoalService {
	return &soalService{soalRepo: soalRepo}
}

func (s *soalService) GetSoalByPaketAndSubtest(c context.Context, paketSoal, subtest string) ([]models.SoalGabungan, error) {
	soalGabungans, err := s.soalRepo.GetSoalByPaketAndSubtest(c, paketSoal, subtest)
	if err != nil {
		logger.LogErrorCtx(c, err, "Failed to get soal by paket and subtest", map[string]interface{}{"paket_soal": paketSoal, "subtest": subtest})
		return nil, err
	}

	return soalGabungans, nil
}

func (s *soalService) GetAnswerKeyByPaketAndSubtest(c context.Context, paketSoal, subtest string) (*models.AnswerKeys, error) {
	answerKeys, err := s.soalRepo.GetAnswerKeyByPaketAndSubtest(c, paketSoal, subtest)
	if err != nil {
		logger.LogErrorCtx(c, err, "Failed to get answer key by paket and subtest", map[string]interface{}{"paket_soal": paketSoal, "subtest": subtest})
		return nil, err
	}

	return answerKeys, nil
}

func (s *soalService) GetMinatBakatSoal(c context.Context) ([]models.MinatBakatGabungan, error) {
	minatBakatSoal, err := s.soalRepo.GetMinatBakatSoal(c)
	if err != nil {
		logger.LogErrorCtx(c, err, "Failed to get minat bakat soal")
		return nil, err
	}

	return minatBakatSoal, nil
}
