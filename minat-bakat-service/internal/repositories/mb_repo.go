package repositories

import (
	"minat-bakat-service/internal/logger"
	"minat-bakat-service/internal/models"

	"github.com/jmoiron/sqlx"
)

type MbRepo interface {
	StoreMinatBakat(attempt *models.MinatBakatAttempt) error
	GetMinatBakatFromUserID(userID int) (*models.MinatBakatAttempt, error)
}

type mbRepo struct {
	db *sqlx.DB
}

func NewMbRepo(db *sqlx.DB) MbRepo {
	return &mbRepo{db: db}
}

func (r *mbRepo) StoreMinatBakat(attempt *models.MinatBakatAttempt) error {
	query := `
		INSERT INTO minat_bakat_attempt (user_id, bakat_user)
		VALUES ($1, $2)
	`

	_, err := r.db.Exec(query, attempt.UserID, attempt.BakatUser)
	if err != nil {
		logger.LogError(err, "Failed to store minat bakat", map[string]interface{}{"layer": "repository", "operation": "StoreMinatBakat"})
		return err
	}

	logger.LogDebug("Success store minat bakat", map[string]interface{}{"layer": "repository", "operation": "StoreMinatBakat"})
	return nil
}

func (r *mbRepo) GetMinatBakatFromUserID(userID int) (*models.MinatBakatAttempt, error) {
	query := `
		SELECT user_id, bakat_user
		FROM minat_bakat_attempt
		WHERE user_id = $1
	`

	var attempt models.MinatBakatAttempt
	err := r.db.Get(&attempt, query, userID)
	if err != nil {
		logger.LogError(err, "Failed to get minat bakat from user id", map[string]interface{}{"layer": "repository", "operation": "GetMinatBakatFromUserID"})
		return nil, err
	}

	return &attempt, nil
}
