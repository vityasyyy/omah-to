package repositories

import (
	"auth-service/internal/logger"
	"auth-service/internal/models"

	"github.com/jmoiron/sqlx"
)

// Must implement all methods in the interface
type AuthRepo interface {
	CreateUser(user *models.User) error
	GetUserByUsername(username string) (*models.User, error)
	GetUserByID(userID int) (*models.User, error)
}

type authRepo struct {
	db *sqlx.DB // Depends on a database connection
}

// Constructor for authRepo that returns the interface
func NewAuthRepo(db *sqlx.DB) AuthRepo {
	// return the pointer to a struct with the database connection
	return &authRepo{db: db}
}

// This function implements the CreateUser method from the AuthRepo interface, it creates a new user in the database, accepts the user models as the params, and returns an error if the query fails
func (r *authRepo) CreateUser(user *models.User) error {
	// Define the query to insert a new user
	query := "INSERT INTO users (nama_user, password, asal_sekolah) VALUES ($1, $2, $3) RETURNING user_id"
	// Execute the query and scan the result into the user struct
	err := r.db.QueryRow(query, user.UserID, user.NamaUser, user.Password, user.AsalSekolah).Scan(&user.UserID)
	if err != nil {
		// Log the error if the query fails
		logger.LogError(err, "Failed to create user", map[string]interface{}{"layer": "repository", "operation": "CreateUser"})
		return err
	}
	// Log the success if the query succeeds (this wont be logged in production)
	logger.LogDebug("User created", map[string]interface{}{"layer": "repository", "operation": "CreateUser"})
	return nil
}

func (r *authRepo) GetUserByUsername(username string) (*models.User, error) {
	// Create a new user struct to store the result
	var user models.User
	query := "SELECT user_id, nama_user, asal_sekolah FROM users WHERE nama_user = $1"
	// Get the user struct from the database using the query and the username
	err := r.db.Get(&user, query, username)
	if err != nil {
		logger.LogError(err, "Failed to get user", map[string]interface{}{"layer": "repository", "operation": "GetUserByUsername"})
		return nil, err
	}
	logger.LogDebug("User retrieved", map[string]interface{}{"layer": "repository", "operation": "GetUserByUsername"})
	return &user, nil
}

func (r *authRepo) GetUserByID(userID int) (*models.User, error) {
	var user models.User
	query := "SELECT user_id, nama_user, asal_sekolah FROM users WHERE user_id = $1"
	err := r.db.Get(&user, query, userID)
	if err != nil {
		logger.LogError(err, "Failed to get user", map[string]interface{}{"layer": "repository", "operation": "GetUserByID"})
		return nil, err
	}
	logger.LogDebug("User retrieved", map[string]interface{}{"layer": "repository", "operation": "GetUserByID"})
	return &user, nil
}
