package repositories

import (
	"context"
	"minat-bakat-service/internal/logger"
	"minat-bakat-service/internal/models"

	"github.com/jmoiron/sqlx"
)

type MbRepo interface {
	StoreMinatBakat(c context.Context, attempt *models.MinatBakatAttempt) error
	GetMinatBakatFromUserID(c context.Context, userID int) (*models.MinatBakatAttempt, error)
}

type mbRepo struct {
	db *sqlx.DB
}

func NewMbRepo(db *sqlx.DB) MbRepo {
	return &mbRepo{db: db}
}

func (r *mbRepo) StoreMinatBakat(c context.Context, attempt *models.MinatBakatAttempt) error {
	query := `
		INSERT INTO minat_bakat_attempt (user_id, bakat_user)
		VALUES ($1, $2)
	`

	_, err := r.db.ExecContext(c, query, attempt.UserID, attempt.BakatUser)
	if err != nil {
		logger.LogErrorCtx(c, err, "Failed to store minat bakat attempt")
		return err
	}

	logger.LogDebugCtx(c, "Minat bakat attempt stored successfully")
	return nil
}

func (r *mbRepo) GetMinatBakatFromUserID(c context.Context, userID int) (*models.MinatBakatAttempt, error) {
	query := `
		SELECT user_id, bakat_user
		FROM minat_bakat_attempt
		WHERE user_id = $1
	`

	var attempt models.MinatBakatAttempt
	err := r.db.Get(&attempt, query, userID)
	if err != nil {
		logger.LogErrorCtx(c, err, "Failed to get minat bakat from user id", map[string]interface{}{"user_id": userID})
		return nil, err
	}

	return &attempt, nil
}
