package services

import (
	"context"
	"sync"
	"tryout-service/internal/models"
	"tryout-service/internal/repositories"

	"golang.org/x/sync/errgroup"
)

type PageService interface {
	GetLeaderboard() ([]models.TryoutAttempt, error)
	GetUserSubtestNilai(userId int) ([]models.UserScore, error)
	GetScoreAndRank(userID int, paket string) (float64, int, error)
	GetPembahasanPage(ctx context.Context, userID int, paket, accessToken string) ([]models.EnrichedUserAnswer, float64, int, []models.UserScore, error)
}

type pageService struct {
	pageRepo     repositories.PageRepo
	scoreService ScoreService
}

func NewPageService(pageRepo repositories.PageRepo, scoreService ScoreService) PageService {
	return &pageService{pageRepo: pageRepo, scoreService: scoreService}
}

func (s *pageService) GetPembahasanPage(ctx context.Context, userID int, paket, accessToken string) ([]models.EnrichedUserAnswer, float64, int, []models.UserScore, error) {
	var (
		mu                sync.Mutex
		enrichedAnswers   []models.EnrichedUserAnswer
		averageScore      float64
		rank              int
		userSubtestScores []models.UserScore
	)

	g, ctx := errgroup.WithContext(ctx) //use errgroup instead of waitgroup for error handling, auto goroutine cancellation when one of them fails also

	// 1. Get Rank & Average Score
	g.Go(func() error {
		avg, r, err := s.GetScoreAndRank(userID, paket)
		if err != nil {
			return err
		}
		// mutex when averageScore and rank are updated, to avoid being modified by other concurrent processes (do for every assigning type shit)
		mu.Lock()
		averageScore = avg
		rank = r
		mu.Unlock()
		return nil
	})

	// 2. Get User Subtest Scores
	g.Go(func() error {
		scores, err := s.GetUserSubtestNilai(userID)
		if err != nil {
			return err
		}
		mu.Lock()
		userSubtestScores = scores
		mu.Unlock()
		return nil
	})

	// 3. Fetch Enriched Answers (Parallel per Subtest)
	subtests := []string{"subtest_pu", "subtest_ppu", "subtest_pbm", "subtest_pk", "subtest_lbi", "subtest_lbe", "subtest_pm"}

	for _, subtest := range subtests {
		subtest := subtest // Prevent loop variable issue

		// Check ctx before launching the goroutine
		if ctx.Err() != nil {
			break
		}

		// make a goroutine errgroup for 7 requests to the soal service type shit
		g.Go(func() error {
			if ctx.Err() != nil {
				return ctx.Err()
			}

			// Get user answers
			userAnswers, err := s.pageRepo.GetUserAnswersBasedOnIDPaketAndSubtest(userID, paket, subtest)
			if err != nil {
				return err
			}

			// Get answer keys from soal service
			answerKeys, err := s.scoreService.GetAnswerKeyBasedOnSubtestFromSoalService(subtest, accessToken, "access")
			if err != nil {
				return err
			}
			if ctx.Err() != nil {
				return ctx.Err()
			}

			// Process answers
			var localEnrichedAnswers []models.EnrichedUserAnswer
			for _, ua := range userAnswers {
				enriched := models.EnrichedUserAnswer{
					AttemptID:  ua.TryoutAttemptID,
					Subtest:    ua.Subtest,
					KodeSoal:   ua.KodeSoal,
					UserAnswer: ua.Jawaban,
				}

				// Multiple Choice
				if choices, exists := answerKeys.PilihanGandaAnswers[ua.KodeSoal]; exists {
					if choice, ok := choices[ua.Jawaban]; ok {
						enriched.IsCorrect = choice.IsCorrect
						enriched.Bobot = choice.Bobot
						enriched.TextPilihan = choice.TextPilihan
						enriched.Pembahasan = choice.Pembahasan
					}
					// for _, v := range choices {
					// 	enriched.Pembahasan = v.Pembahasan
					// 	break
					// }
				}

				// True/False
				if tf, exists := answerKeys.TrueFalseAnswers[ua.KodeSoal]; exists {
					enriched.IsCorrect = (ua.Jawaban == tf.Jawaban)
					enriched.Bobot = tf.Bobot
					enriched.TextPilihan = tf.TextPilihan
					enriched.Pembahasan = tf.Pembahasan
				}

				// Essay
				if uraian, exists := answerKeys.UraianAnswers[ua.KodeSoal]; exists {
					enriched.IsCorrect = (ua.Jawaban == uraian.Jawaban)
					enriched.Bobot = uraian.Bobot
					enriched.Pembahasan = uraian.Pembahasan
				}

				localEnrichedAnswers = append(localEnrichedAnswers, enriched)
			}

			// Append to shared slice
			mu.Lock()
			enrichedAnswers = append(enrichedAnswers, localEnrichedAnswers...)
			mu.Unlock()

			return nil
		})
	}

	// Wait for all goroutines to complete, return the first error encountered
	if err := g.Wait(); err != nil {
		return nil, 0, 0, nil, err
	}

	// return all of our needed stuff
	return enrichedAnswers, averageScore, rank, userSubtestScores, nil
}

func (s *pageService) GetLeaderboard() ([]models.TryoutAttempt, error) {
	return s.pageRepo.GetTop4Leaderboard()
}

func (s *pageService) GetUserSubtestNilai(userId int) ([]models.UserScore, error) {
	return s.pageRepo.GetAllSubtestScoreForAUser(userId)
}

func (s *pageService) GetScoreAndRank(userID int, paket string) (float64, int, error) {
	return s.pageRepo.GetScoreAndRank(userID, paket)
}
