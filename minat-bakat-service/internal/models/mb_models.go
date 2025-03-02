package models

type MinatBakatAttempt struct {
	UserID    int    `db:"user_id" json:"user_id"`
	BakatUser string `db:"bakat_user" json:"bakat_user"`
}

type MinatBakatAnswers struct {
	KodeSoal string `json:"kode_soal"`
	Jawaban  string `json:"jawaban"`
}
