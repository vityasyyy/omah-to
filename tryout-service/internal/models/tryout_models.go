package models

import "time"

type TryoutAttempt struct {
	TryoutAttemptID int          `db:"attempt_id" json:"attempt_id" binding:"required"`
	Paket           string       `db:"paket" json:"paket" binding:"required"`
	Status          string       `db:"status" json:"status" binding:"required"`
	Username        string       `db:"username" json:"username" binding:"required"`
	UserID          int          `db:"user_id" json:"user_id" binding:"required"`
	StartTime       time.Time    `db:"start_time" json:"start_time" binding:"required"`
	EndTime         *time.Time   `db:"end_time" json:"end_time"`
	TryoutScore     *float64     `db:"tryout_score" json:"tryout_score"`
	SubtestSekarang string       `db:"subtest_sekarang" json:"subtest_sekarang"` // supaya mudah untuk join dengan tabel answer, nanti where subtest = subtest_sekarang
	UserAnswers     []UserAnswer `json:"user_answers"`
}

type UserAnswer struct {
	TryoutAttemptID int    `db:"attempt_id" json:"attempt_id" binding:"required"`
	Subtest         string `db:"subtest" json:"subtest" binding:"required"`
	KodeSoal        string `db:"kode_soal" json:"kode_soal" binding:"required"`
	Jawaban         string `db:"jawaban" json:"jawaban" binding:"required"`
}

type UserScore struct {
	UserID          int     `db:"user_id" json:"user_id" binding:"required"`
	TryoutAttemptID int     `db:"attempt_id" json:"attempt_id" binding:"required"`
	Subtest         string  `db:"subtest" json:"subtest" binding:"required"`
	Score           float64 `db:"score" json:"score" binding:"required"`
}

type TimeLimit struct {
	TimeLimitID     int    `db:"time_limit_id" json:"time_limit_id" binding:"required"`
	TryoutAttemptID int    `db:"attempt_id" json:"attempt_id" binding:"required"`
	Subtest         string `db:"subtest" json:"subtest" binding:"required"`
	TimeLimit       int    `db:"time_limit" json:"time_limit" binding:"required"`
}
type AnswerPayload struct {
	KodeSoal string  `json:"kode_soal" binding:"required"`
	Jawaban  *string `json:"jawaban" binding:"omitempty"`
}

type AnswerKeys struct {
	PilihanGandaAnswers map[string]map[string]struct { // Now groups by KodeSoal
		IsCorrect bool
		Bobot     int
	} `json:"pilihan_ganda,omitempty"`

	TrueFalseAnswers map[string]struct { // Now groups by KodeSoal
		Jawaban string
		Bobot   int
	} `json:"true_false,omitempty"`

	UraianAnswers map[string]struct { // Now groups by KodeSoal
		Jawaban string
		Bobot   int
	} `json:"uraian,omitempty"`
}
