package repositories

import (
	"tryout-service/internal/logger"
	"tryout-service/internal/models"

	"github.com/jmoiron/sqlx"
)

type PageRepo interface {
	GetAllSubtestScoreForAUser(userID int) ([]models.UserScore, error)
	GetTop4Leaderboard() ([]models.TryoutAttempt, error)            // /leaderboard
	GetScoreAndRank(userID int, paket string) (float64, int, error) // /pembahasan
	GetUserAnswersBasedOnIDPaketAndSubtest(userID int, paket, subtest string) ([]models.UserAnswer, error)
}

type pageRepo struct {
	db *sqlx.DB
}

func NewPageRepo(db *sqlx.DB) PageRepo {
	return &pageRepo{db: db}
}

// buat tryout homepage ama pembahasan
func (r *pageRepo) GetAllSubtestScoreForAUser(userID int) ([]models.UserScore, error) {
	var scores []models.UserScore
	query := `SELECT user_id, attempt_id, score, subtest FROM user_scores WHERE user_id = $1`
	err := r.db.Select(&scores, query, userID)
	if err != nil {
		logger.LogError(err, "Failed to get all subtest scores for a user", map[string]interface{}{"layer": "repository", "operation": "GetAllSubtestScoreForAUser"})
		return nil, err
	}
	return scores, nil
}

// tryout homepage
func (r *pageRepo) GetTop4Leaderboard() ([]models.TryoutAttempt, error) {
	var leaderboards []models.TryoutAttempt
	query := `SELECT user_id, username, tryout_score FROM tryout_attempt WHERE status = 'finished' ORDER BY tryout_score DESC LIMIT 4`
	err := r.db.Select(&leaderboards, query)
	if err != nil {
		logger.LogError(err, "Failed to get top 4 leaderboard", map[string]interface{}{"layer": "repository", "operation": "GetTop4Leaderboard"})
		return nil, err
	}
	return leaderboards, nil
}

// buat rank dan score di pembahasan
func (r *pageRepo) GetScoreAndRank(userID int, paket string) (float64, int, error) {
	var userScore float64
	var userRank int

	query := `
	WITH RankedUsers AS (
	    SELECT user_id, paket, tryout_score,
	           RANK() OVER (PARTITION BY paket ORDER BY tryout_score DESC) AS rank
	    FROM tryout_attempt WHERE status = 'finished'
	)
	SELECT tryout_score, rank FROM RankedUsers WHERE user_id = $1 AND paket = $2;
	`

	err := r.db.QueryRow(query, userID, paket).Scan(&userScore, &userRank)
	if err != nil {
		logger.LogError(err, "Failed to get score and rank", map[string]interface{}{"layer": "repository", "operation": "GetScoreAndRank"})
		return 0, 0, err
	}

	return userScore, userRank, nil
}

// buat di pembahasan
func (s *pageRepo) GetUserAnswersBasedOnIDPaketAndSubtest(userID int, paket, subtest string) ([]models.UserAnswer, error) {
	query := `
	SELECT 
		ua.attempt_id, ua.subtest, ua.kode_soal, ua.jawaban
	FROM user_answers ua
	JOIN tryout_attempt ta ON ua.attempt_id = ta.attempt_id
	WHERE ta.user_id = $1 AND ta.paket = $2 AND ua.subtest = $3;
	`

	var userAnswers []models.UserAnswer
	err := s.db.Select(&userAnswers, query, userID, paket, subtest)
	if err != nil {
		logger.LogError(err, "Failed to get user answers based on id paket and subtest", map[string]interface{}{"layer": "repository", "operation": "GetUserAnswersBasedOnIDPaketAndSubtest"})
		return nil, err
	}

	return userAnswers, nil
}
