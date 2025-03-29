package repositories

import (
	"fmt"
	"strings"
	"time"
	"tryout-service/internal/logger"
	"tryout-service/internal/models"

	"github.com/jmoiron/sqlx"
)

type TryoutRepo interface {
	BeginTransaction() (*sqlx.Tx, error)
	CreateTryoutAttemptTx(tx *sqlx.Tx, attempt *models.TryoutAttempt) error                                          // Create a new tryout attempt
	GetTryoutAttemptByUserIDTx(tx *sqlx.Tx, userID int) (string, error)                                              // Get the ongoing tryout attempt for a user
	GetTryoutAttemptByUserIDAndPaket(userID int, paket string) (*models.TryoutAttempt, error)                        // Get the ongoing tryout attempt for a user
	GetTryoutAttemptTx(tx *sqlx.Tx, attemptID int) (*models.TryoutAttempt, error)                                    // Get a tryout attempt by its ID, including the user's answers based on the current subtest also (for transactinos)
	GetAnswerFromCurrentAttemptAndSubtestTx(tx *sqlx.Tx, attemptID int, subtest string) ([]models.UserAnswer, error) // Get user's answers for the current subtest (for transactions)
	GetSubtestTimeTx(tx *sqlx.Tx, attemptID int, subtest string) (time.Time, error)                                  // Get the remaining time for a subtest (for transactions)
	SaveAnswersTx(tx *sqlx.Tx, answers []models.UserAnswer) error                                                    // Save user's answers to the database
	ProgressTryoutTx(tx *sqlx.Tx, attemptID int, subtest string) (string, error)                                     // End a subtest attempt, marking the end time
	EndTryOutTx(tx *sqlx.Tx, attemptID int) error
	GetTryoutAttempt(attemptID int) (*models.TryoutAttempt, error) // End a tryout attempt, marking the end time
	DeleteAttempt(tx *sqlx.Tx, attemptID int) error
}

type tryoutRepo struct {
	db *sqlx.DB
}

func NewTryoutRepo(db *sqlx.DB) TryoutRepo {
	return &tryoutRepo{db: db}
}

func (r *tryoutRepo) BeginTransaction() (*sqlx.Tx, error) {
	tx, err := r.db.Beginx()
	if err != nil {
		logger.LogError(err, "Failed to start transaction", map[string]interface{}{"layer": "repository", "operation": "BeginTransaction"})
		return nil, err
	}

	logger.LogDebug("Transaction started", map[string]interface{}{"layer": "repository", "operation": "BeginTransaction"})
	return tx, nil
}

func (r *tryoutRepo) CreateTryoutAttemptTx(tx *sqlx.Tx, attempt *models.TryoutAttempt) error {
	// Insert into tryout_attempt and get attempt_id
	query := `INSERT INTO tryout_attempt (user_id, username, start_time, subtest_sekarang, paket, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING attempt_id`
	startTime := time.Now()
	err := tx.QueryRowx(query, attempt.UserID, attempt.Username, startTime, "subtest_pu", attempt.Paket, "ongoing").Scan(&attempt.TryoutAttemptID)
	if err != nil {
		logger.LogError(err, "Failed to create tryout attempt", map[string]interface{}{"layer": "repository", "operation": "CreateTryoutAttempt"})
		return err
	}

	// Define subtests and their time limits
	subtests := []struct {
		Subtest   string
		TimeLimit time.Duration // Time in minutes
	}{
		{"subtest_pu", 2 * time.Minute},
  		{"subtest_ppu", 2 * time.Minute},
  		{"subtest_pbm", 2 * time.Minute},
  		{"subtest_pk", 2 * time.Minute},
  		{"subtest_lbi", 2 * time.Minute},
  		{"subtest_lbe", 2 * time.Minute},
  		{"subtest_pm", 2 * time.Minute},
	}

	// Construct the query for batch insertion
	var values []string
	var args []interface{}
	currentTime := startTime
	for i, sub := range subtests {
		startTime := currentTime
		endTime := startTime.Add(sub.TimeLimit) // Calculate end time

		values = append(values, fmt.Sprintf("($%d, $%d, $%d)", i*3+1, i*3+2, i*3+3))
		args = append(args, attempt.TryoutAttemptID, sub.Subtest, endTime)
		currentTime = endTime
	}

	timeQuery := fmt.Sprintf(`INSERT INTO time_limit (attempt_id, subtest, time_limit) VALUES %s`, strings.Join(values, ", "))
	_, err = tx.Exec(timeQuery, args...)
	if err != nil {
		logger.LogError(err, "Failed to insert time limits", map[string]interface{}{"layer": "repository", "operation": "CreateTryoutAttempt"})
		return err
	}

	logger.LogDebug("Tryout attempt and time limits inserted", map[string]interface{}{
		"layer":     "repository",
		"operation": "CreateTryoutAttempt",
		"attemptID": attempt.TryoutAttemptID,
	})

	return nil
}

func (r *tryoutRepo) GetTryoutAttemptByUserIDTx(tx *sqlx.Tx, userID int) (string, error) {
	var status string
	query := `SELECT status FROM tryout_attempt WHERE user_id = $1 AND status = 'ongoing'`
	err := tx.Get(&status, query, userID)
	if err != nil {
		logger.LogError(err, "Failed to get ongoing tryout attempt", map[string]interface{}{"layer": "repository", "operation": "GetTryoutAttemptByUserID"})
		return "", err
	}
	return status, nil
}

func (r *tryoutRepo) SaveAnswersTx(tx *sqlx.Tx, answers []models.UserAnswer) error {
	if len(answers) == 0 {
		return nil // No data to insert
	}

	query := `INSERT INTO user_answers (attempt_id, subtest, kode_soal, jawaban) VALUES `

	// Constructing bulk insert placeholders
	var values []interface{}
	var placeholders []string
	for i, answer := range answers {
		placeholders = append(placeholders, fmt.Sprintf("($%d, $%d, $%d, $%d)", i*4+1, i*4+2, i*4+3, i*4+4))
		values = append(values, answer.TryoutAttemptID, answer.Subtest, answer.KodeSoal, answer.Jawaban)
	}

	// Joining placeholders to form the full query
	query += strings.Join(placeholders, ",")
	query += ` ON CONFLICT (attempt_id, kode_soal) DO UPDATE SET jawaban = EXCLUDED.jawaban`

	// Executing the query
	_, err := tx.Exec(query, values...)
	if err != nil {
		logger.LogError(err, "Failed to save/update user answers", map[string]interface{}{"layer": "repository", "operation": "SaveAnswersTx"})
		return err
	}

	logger.LogDebug("User answers saved/updated", map[string]interface{}{"layer": "repository", "operation": "SaveAnswersTx"})
	return nil
}

func (r *tryoutRepo) ProgressTryoutTx(tx *sqlx.Tx, attemptID int, subtest string) (string, error) {
	// Update the tryout attempt with end_time and next subtest (or NULL if last subtest)
	var subtestUpdated string
	updateQuery := `UPDATE tryout_attempt SET subtest_sekarang = $1 WHERE attempt_id = $2 RETURNING subtest_sekarang`
	err := tx.QueryRow(updateQuery, subtest, attemptID).Scan(&subtestUpdated)
	if err != nil {
		logger.LogError(err, "Failed to update tryout attempt", map[string]interface{}{
			"layer": "repository", "operation": "EndAttempt",
		})
		return "", err
	}

	logger.LogDebug("Tryout attempt progressed", map[string]interface{}{
		"layer": "repository", "operation": "EndAttempt",
		"next": subtest,
	})

	return subtestUpdated, nil
}

func (r *tryoutRepo) EndTryOutTx(tx *sqlx.Tx, attemptID int) error {
	query := `UPDATE tryout_attempt SET end_time = $1, status = 'finished' WHERE attempt_id = $2`
	_, err := tx.Exec(query, time.Now(), attemptID)
	if err != nil {
		logger.LogError(err, "Failed to end tryout attempt", map[string]interface{}{
			"layer": "repository", "operation": "EndTryOut",
		})
		return err
	}
	logger.LogDebug("Tryout attempt ended", map[string]interface{}{
		"layer": "repository", "operation": "EndTryOut",
	})
	return nil
}

func (r *tryoutRepo) GetTryoutAttemptTx(tx *sqlx.Tx, attemptID int) (*models.TryoutAttempt, error) {
	var attempt models.TryoutAttempt

	query := `SELECT * FROM tryout_attempt WHERE attempt_id = $1`
	err := tx.Get(&attempt, query, attemptID)
	if err != nil {
		logger.LogError(err, "Failed to get tryout attempt", map[string]interface{}{
			"layer": "repository", "operation": "GetTryoutAttempt",
		})
		return nil, err
	}

	logger.LogDebug("Tryout attempt retrieved", map[string]interface{}{
		"layer": "repository", "operation": "GetTryoutAttempt",
	})
	return &attempt, nil
}

func (r *tryoutRepo) GetAnswerFromCurrentAttemptAndSubtestTx(tx *sqlx.Tx, attemptID int, subtest string) ([]models.UserAnswer, error) {
	var answers []models.UserAnswer

	query := `SELECT attempt_id, subtest, kode_soal, jawaban FROM user_answers WHERE attempt_id = $1 AND subtest = $2`
	err := tx.Select(&answers, query, attemptID, subtest)
	if err != nil {
		logger.LogError(err, "Failed to get user answers", map[string]interface{}{"layer": "repository", "operation": "GetAnswerFromCurrentAttemptAndSubtest"})
		return nil, err
	}

	logger.LogDebug("User answers retrieved", map[string]interface{}{"layer": "repository", "operation": "GetAnswerFromCurrentAttemptAndSubtest"})
	return answers, nil
}

func (r *tryoutRepo) GetSubtestTimeTx(tx *sqlx.Tx, attemptID int, subtest string) (time.Time, error) {
	var timeLimit time.Time

	query := `SELECT time_limit FROM time_limit WHERE attempt_id = $1 AND subtest = $2`
	err := tx.Get(&timeLimit, query, attemptID, subtest)
	if err != nil {
		logger.LogError(err, "Failed to get time limit", map[string]interface{}{"layer": "repository", "operation": "GetRemainingSubtestTime"})
		return time.Time{}, err
	}

	logger.LogDebug("Time limit retrieved", map[string]interface{}{"layer": "repository", "operation": "GetRemainingSubtestTime"})
	return timeLimit, nil
}

func (r *tryoutRepo) GetTryoutAttemptByUserIDAndPaket(userID int, paket string) (*models.TryoutAttempt, error) {
	var attempt models.TryoutAttempt
	query := `SELECT user_id, username, attempt_id, tryout_score FROM tryout_attempt WHERE user_id = $1 AND status = $2 AND paket = $3`
	err := r.db.Get(&attempt, query, userID, "finished", paket)
	if err != nil {
		logger.LogError(err, "Failed to get attempt", map[string]interface{}{"layer": "repository", "operation": "GetTryoutAttemptByUserID"})
		return nil, err
	}

	logger.LogDebug("Attempt retrieved", map[string]interface{}{"layer": "repository", "operation": "GetTryoutAttemptByUserID"})
	return &attempt, nil
}

func (r *tryoutRepo) GetTryoutAttempt(attemptID int) (*models.TryoutAttempt, error) {
	var attempt models.TryoutAttempt
	query := `SELECT * FROM tryout_attempt WHERE attempt_id = $1 AND status = 'ongoing'`
	err := r.db.Get(&attempt, query, attemptID)
	if err != nil {
		logger.LogError(err, "Failed to get attempt", map[string]interface{}{"layer": "repository", "operation": "GetTryoutAttempt"})
		return nil, err
	}

	logger.LogDebug("Attempt retrieved", map[string]interface{}{"layer": "repository", "operation": "GetTryoutAttempt"})
	return &attempt, nil
}

func (r *tryoutRepo) DeleteAttempt(tx *sqlx.Tx, attemptID int) error {
	query := `DELETE FROM tryout_attempt WHERE attempt_id = $1`
	_, err := tx.Exec(query, attemptID)
	if err != nil {
		logger.LogError(err, "Failed to delete attempt", map[string]interface{}{"layer": "repository", "operation": "DeleteAttempt"})
		return err
	}

	logger.LogDebug("Attempt deleted", map[string]interface{}{"layer": "repository", "operation": "DeleteAttempt"})
	return nil
}
