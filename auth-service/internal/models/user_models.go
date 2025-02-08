package models

type User struct {
	UserID      int    `db:"user_id" json:"user_id"`
	NamaUser    string `db:"nama_user" json:"nama_user" binding:"required,max=20"`
	Password    string `db:"password" json:"password" binding:"required,min=8"`
	AsalSekolah string `db:"asal_sekolah" json:"asal_sekolah" binding:"required"`
}
