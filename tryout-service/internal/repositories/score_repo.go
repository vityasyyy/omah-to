package repositories

import (
	"tryout-service/internal/logger"
	"tryout-service/internal/models"

	"github.com/jmoiron/sqlx"
)

type ScoreRepo interface {
	BeginTransaction() (*sqlx.Tx, error)
	InsertScoreForUserAttemptIDAndSubtestTx(tx *sqlx.Tx, attemptID, userID int, subtest string, score float64) error // Insert a user's score for a subtest, this will be called after calculating
	GetUserAnswersFromAttemptIDandSubtestTx(tx *sqlx.Tx, attemptID int, subtest string) ([]models.UserAnswer, error) // Get user's answers for a subtest
	GetUserScoreFromAttemptIDAndSubtestTx(tx *sqlx.Tx, attemptID int, subtest string) (*models.UserScore, error)     // Get user's score for a subtest
}

type scoreRepo struct {
	db *sqlx.DB
}

func NewScoreRepo(db *sqlx.DB) ScoreRepo {
	return &scoreRepo{db: db}
}

func (r *scoreRepo) BeginTransaction() (*sqlx.Tx, error) {
	tx, err := r.db.Beginx()
	if err != nil {
		logger.LogError(err, "Failed to begin transaction", map[string]interface{}{"layer": "repository", "operation": "BeginTransaction"})
		return nil, err
	}
	logger.LogDebug("Transaction started", map[string]interface{}{"layer": "repository", "operation": "BeginTransaction"})
	return tx, nil
}

func (r *scoreRepo) InsertScoreForUserAttemptIDAndSubtestTx(tx *sqlx.Tx, attemptID, userID int, subtest string, score float64) error {
	query := `
		INSERT INTO user_scores (attempt_id, user_id, subtest, score)
		VALUES ($1, $2, $3, $4)
	`

	_, err := tx.Exec(query, attemptID, userID, subtest, score)
	if err != nil {
		logger.LogError(err, "Failed to insert user score", map[string]interface{}{
			"layer":     "repository",
			"operation": "InsertScoreForUserAttemptIDAndSubtestTx",
			"attemptID": attemptID,
			"userID":    userID,
			"subtest":   subtest,
			"score":     score,
		})
		return err
	}

	logger.LogDebug("Inserted user score", map[string]interface{}{
		"layer":     "repository",
		"operation": "InsertScoreForUserAttemptIDAndSubtestTx",
		"attemptID": attemptID,
		"userID":    userID,
		"subtest":   subtest,
		"score":     score,
	})

	return nil
}

func (r *scoreRepo) GetUserAnswersFromAttemptIDandSubtestTx(tx *sqlx.Tx, attemptID int, subtest string) ([]models.UserAnswer, error) {
	var userAnswers []models.UserAnswer

	query := `SELECT attempt_id, subtest, kode_soal, jawaban FROM user_answers WHERE attempt_id = $1 AND subtest = $2`

	err := tx.Select(&userAnswers, query, attemptID, subtest)
	if err != nil {
		logger.LogError(err, "Failed to fetch user answers", map[string]interface{}{
			"layer":     "repository",
			"operation": "GetUserAnswersFromAttemptIDandSubtestTx",
			"attemptID": attemptID,
			"subtest":   subtest,
		})
		return nil, err
	}

	logger.LogDebug("Fetched user answers", map[string]interface{}{
		"layer":       "repository",
		"operation":   "GetUserAnswersFromAttemptIDandSubtestTx",
		"attemptID":   attemptID,
		"subtest":     subtest,
		"answerCount": len(userAnswers),
	})

	return userAnswers, nil
}

func (r *scoreRepo) GetUserScoreFromAttemptIDAndSubtestTx(tx *sqlx.Tx, attemptID int, subtest string) (*models.UserScore, error) {
	query := `
		SELECT score
		FROM user_scores
		WHERE attempt_id = $1 AND subtest = $2
	`

	var userScore models.UserScore
	err := tx.Get(&userScore, query, attemptID, subtest)
	if err != nil {
		logger.LogError(err, "Failed to get user score", map[string]interface{}{
			"layer":     "repository",
			"operation": "GetUserScoreFromAttemptIDAndSubtestTx",
			"attemptID": attemptID,
			"subtest":   subtest,
		})
		return nil, err
	}

	logger.LogDebug("Fetched user score", map[string]interface{}{
		"layer":     "repository",
		"operation": "GetUserScoreFromAttemptIDAndSubtestTx",
		"attemptID": attemptID,
		"subtest":   subtest,
		"score":     userScore.Score,
	})
	return &userScore, nil
}
