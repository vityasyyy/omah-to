package repositories_test

import (
	"fmt"
	"testing"
	"time"

	"github.com/DATA-DOG/go-sqlmock"
	"github.com/jmoiron/sqlx"
	"github.com/stretchr/testify/require"

	"auth-service/internal/models"
	"auth-service/internal/repositories"
)

func setupMock(t *testing.T) (repositories.AuthRepo, sqlmock.Sqlmock) {
	db, mock, err := sqlmock.New()
	require.NoError(t, err)
	sqlxDB := sqlx.NewDb(db, "sqlmock")
	return repositories.NewAuthRepo(sqlxDB), mock
}

func TestCreateUser_Success(t *testing.T) {
	repo, mock := setupMock(t)
	user := &models.User{Email: "a@b.com", NamaUser: "Test", Password: "pwd", AsalSekolah: "School"}
	rows := sqlmock.NewRows([]string{"user_id"}).AddRow(42)
	mock.ExpectQuery(`INSERT INTO users`).
		WithArgs(user.Email, user.NamaUser, user.Password, user.AsalSekolah).
		WillReturnRows(rows)

	err := repo.CreateUser(user)
	require.NoError(t, err)
	require.Equal(t, 42, user.UserID)
	require.NoError(t, mock.ExpectationsWereMet())
}

func TestCreateUser_Error(t *testing.T) {
	repo, mock := setupMock(t)
	user := &models.User{}
	mock.ExpectQuery(`INSERT INTO users`).WillReturnError(fmt.Errorf("fail"))

	err := repo.CreateUser(user)
	require.Error(t, err)
	require.NoError(t, mock.ExpectationsWereMet())
}

func TestCreateUser_MissingField(t *testing.T) {
	repo, mock := setupMock(t)
	user := &models.User{Email: "oke@gmail.com", NamaUser: "Test", Password: "pwd", AsalSekolah: "School"}
	mock.ExpectQuery(`INSERT INTO users`).
		WithArgs(user.Email, user.NamaUser, user.Password, user.AsalSekolah).
		WillReturnError(fmt.Errorf("missing email"))
	err := repo.CreateUser(user)
	require.Error(t, err)
	require.Equal(t, "missing email", err.Error())
	require.NoError(t, mock.ExpectationsWereMet())
}

func TestGetUserByEmail_Success(t *testing.T) {
	repo, mock := setupMock(t)
	expected := models.User{UserID: 7, Email: "x@y.com", NamaUser: "X", AsalSekolah: "Z", Password: "p"}
	rows := sqlmock.NewRows([]string{"user_id", "email", "nama_user", "asal_sekolah", "password"}).
		AddRow(expected.UserID, expected.Email, expected.NamaUser, expected.AsalSekolah, expected.Password)
	mock.ExpectQuery(`SELECT user_id, email`).
		WithArgs(expected.Email).
		WillReturnRows(rows)

	u, err := repo.GetUserByEmail(expected.Email)
	require.NoError(t, err)
	require.Equal(t, &expected, u)
	require.NoError(t, mock.ExpectationsWereMet())
}

func TestGetUserByEmail_Error(t *testing.T) {
	repo, mock := setupMock(t)
	mock.ExpectQuery(`SELECT user_id, email`).WillReturnError(fmt.Errorf("nope"))

	_, err := repo.GetUserByEmail("e@e.com")
	require.Error(t, err)
	require.NoError(t, mock.ExpectationsWereMet())
}

func TestGetUserByID_Success(t *testing.T) {
	repo, mock := setupMock(t)
	expected := models.User{UserID: 5, Email: "e@f.com", NamaUser: "E", AsalSekolah: "Y", Password: "pwd"}
	rows := sqlmock.NewRows([]string{"user_id", "email", "nama_user", "asal_sekolah", "password"}).
		AddRow(expected.UserID, expected.Email, expected.NamaUser, expected.AsalSekolah, expected.Password)
	mock.ExpectQuery(`SELECT user_id, email`).
		WithArgs(expected.UserID).
		WillReturnRows(rows)

	u, err := repo.GetUserByID(expected.UserID)
	require.NoError(t, err)
	require.Equal(t, &expected, u)
	require.NoError(t, mock.ExpectationsWereMet())
}

func TestGetUserByID_Error(t *testing.T) {
	repo, mock := setupMock(t)
	mock.ExpectQuery(`SELECT user_id, email`).WillReturnError(fmt.Errorf("oops"))

	_, err := repo.GetUserByID(1)
	require.Error(t, err)
	require.NoError(t, mock.ExpectationsWereMet())
}

func TestResetPassword_Success(t *testing.T) {
	repo, mock := setupMock(t)
	token := "tok"
	newPass := "new"
	mock.ExpectExec(`UPDATE users SET password`).
		WithArgs(newPass, token).
		WillReturnResult(sqlmock.NewResult(0, 1))

	err := repo.ResetPassword(newPass, token)
	require.NoError(t, err)
	require.NoError(t, mock.ExpectationsWereMet())
}

func TestResetPassword_Error(t *testing.T) {
	repo, mock := setupMock(t)
	mock.ExpectExec(`UPDATE users SET password`).WillReturnError(fmt.Errorf("err"))

	err := repo.ResetPassword("p", "t")
	require.Error(t, err)
	require.NoError(t, mock.ExpectationsWereMet())
}

func TestRequestingPasswordReset_Success(t *testing.T) {
	repo, mock := setupMock(t)
	email, token := "a@b", "tkn"
	exp := time.Now().Add(time.Hour)
	mock.ExpectExec(`UPDATE users SET reset_token`).
		WithArgs(token, exp, email).
		WillReturnResult(sqlmock.NewResult(0, 1))

	err := repo.RequestingPasswordReset(email, token, exp)
	require.NoError(t, err)
	require.NoError(t, mock.ExpectationsWereMet())
}

func TestRequestingPasswordReset_Error(t *testing.T) {
	repo, mock := setupMock(t)
	mock.ExpectExec(`UPDATE users SET reset_token`).WillReturnError(fmt.Errorf("fail"))

	err := repo.RequestingPasswordReset("e", "t", time.Now())
	require.Error(t, err)
	require.NoError(t, mock.ExpectationsWereMet())
}
