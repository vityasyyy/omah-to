package repositories

import (
	"soal-service/internal/logger"
	"soal-service/internal/models"

	"database/sql"

	"github.com/jmoiron/sqlx"
)

type SoalRepo interface {
	GetSoalByPaketAndSubtest(paketSoal, subtest string) ([]models.SoalGabungan, error)
	GetAnswerKeyByPaketAndSubtest(paketSoal, subtest string) (*models.AnswerKeys, error)
}

type soalRepo struct {
	db *sqlx.DB
}

func NewSoalRepo(db *sqlx.DB) SoalRepo {
	return &soalRepo{db: db}
}

func (r *soalRepo) GetSoalByPaketAndSubtest(paketSoal, subtest string) ([]models.SoalGabungan, error) {
	// Map soal by kode_soal as key
	var mappedSoal = make(map[string]*models.SoalGabungan)

	query := `
		SELECT 
			s.kode_soal, s.paket_soal_id, s.subtest, s.text_soal, s.path_gambar_soal, 
			ppg.pilihan_pilihan_ganda_id, ppg.pilihan, 
			ptf.pilihan_true_false_id, ptf.pilihan_tf,
			u.uraian_id
		FROM soal s
		LEFT JOIN pilihan_pilihan_ganda ppg ON s.kode_soal = ppg.kode_soal
		LEFT JOIN pilihan_true_false ptf ON s.kode_soal = ptf.kode_soal
		LEFT JOIN uraian u ON s.kode_soal = u.kode_soal
		WHERE s.paket_soal_id = $1 AND s.subtest = $2
	`

	rows, err := r.db.Queryx(query, paketSoal, subtest)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var soal models.SoalGabungan
		var pilihanGandaID, pilihanGandaPilihan sql.NullString
		var trueFalseID, trueFalsePilihan sql.NullString
		var uraianID sql.NullString

		err := rows.Scan(
			&soal.KodeSoal, &soal.PaketSoalID, &soal.Subtest, &soal.TextSoal, &soal.PathGambarSoal,
			&pilihanGandaID, &pilihanGandaPilihan,
			&trueFalseID, &trueFalsePilihan,
			&uraianID,
		)
		if err != nil {
			return nil, err
		}

		// Ensure soal exists in the map
		if _, exists := mappedSoal[soal.KodeSoal]; !exists {
			mappedSoal[soal.KodeSoal] = &soal
		}

		// Append choices only if not NULL
		if pilihanGandaID.Valid {
			mappedSoal[soal.KodeSoal].PilihanGanda = append(mappedSoal[soal.KodeSoal].PilihanGanda, models.PilihanPilihanGanda{
				PilihanPilihanGandaID: pilihanGandaID.String,
				Pilihan:               pilihanGandaPilihan.String,
			})
		}

		if trueFalseID.Valid {
			mappedSoal[soal.KodeSoal].TrueFalse = append(mappedSoal[soal.KodeSoal].TrueFalse, models.PilihanTrueFalse{
				PilihanTrueFalseID: trueFalseID.String,
				PilihanTf:          trueFalsePilihan.String,
			})
		}

		if uraianID.Valid {
			mappedSoal[soal.KodeSoal].Uraian = &models.Uraian{
				UraianID: uraianID.String,
			}
		}
	}

	// Convert map to slice
	var listSoal []models.SoalGabungan
	for _, soal := range mappedSoal {
		listSoal = append(listSoal, *soal)
	}

	logger.LogDebug("Soal retrieved", map[string]interface{}{
		"layer": "repository", "operation": "GetSoalByPaketAndSubtest", "paket_soal": paketSoal, "subtest": subtest,
	})
	return listSoal, nil
}

func (r *soalRepo) GetAnswerKeyByPaketAndSubtest(paketSoal, subtest string) (*models.AnswerKeys, error) {
	answers := &models.AnswerKeys{
		PilihanGandaAnswers: make(map[string]map[string]struct {
			IsCorrect   bool
			Bobot       int
			TextPilihan string
			Pembahasan  string
		}),
		TrueFalseAnswers: make(map[string]struct {
			Jawaban     string
			Bobot       int
			TextPilihan string
			Pembahasan  string
		}),
		UraianAnswers: make(map[string]struct {
			Jawaban    string
			Bobot      int
			Pembahasan string
		}),
	}

	// 🔹 Pilihan Ganda
	pgQuery := `
		SELECT ppg.pilihan_pilihan_ganda_id, ppg.is_correct, s.bobot_soal, ppg.kode_soal, s.pembahasan, ppg.pilihan
		FROM pilihan_pilihan_ganda ppg
		JOIN soal s ON ppg.kode_soal = s.kode_soal
		WHERE s.paket_soal_id = $1 AND s.subtest = $2
	`
	pgRows, err := r.db.Queryx(pgQuery, paketSoal, subtest)
	if err != nil {
		return nil, err
	}
	defer pgRows.Close()

	for pgRows.Next() {
		var pilihanGandaID string
		var isCorrect sql.NullBool
		var bobot int
		var kodeSoal string
		var textPilihan string
		var pembahasan string
		if err := pgRows.Scan(&pilihanGandaID, &isCorrect, &bobot, &kodeSoal, &pembahasan, &textPilihan); err != nil {
			return nil, err
		}

		// If kodeSoal not exists, initialize it
		if _, exists := answers.PilihanGandaAnswers[kodeSoal]; !exists {
			answers.PilihanGandaAnswers[kodeSoal] = make(map[string]struct {
				IsCorrect   bool
				Bobot       int
				TextPilihan string
				Pembahasan  string
			})
		}

		// Add multiple choice answer inside the corresponding kode_soal
		answers.PilihanGandaAnswers[kodeSoal][pilihanGandaID] = struct {
			IsCorrect   bool
			Bobot       int
			TextPilihan string
			Pembahasan  string
		}{IsCorrect: isCorrect.Valid && isCorrect.Bool, Bobot: bobot, TextPilihan: textPilihan, Pembahasan: pembahasan}
	}

	// 🔹 True False
	tfQuery := `
		SELECT ptf.jawaban, s.bobot_soal, ptf.kode_soal, s.pembahasan, ptf.pilihan_tf
		FROM pilihan_true_false ptf
		JOIN soal s ON ptf.kode_soal = s.kode_soal
		WHERE s.paket_soal_id = $1 AND s.subtest = $2
	`
	tfRows, err := r.db.Queryx(tfQuery, paketSoal, subtest)
	if err != nil {
		return nil, err
	}
	defer tfRows.Close()

	for tfRows.Next() {
		var jawaban string
		var bobot int
		var kodeSoal string
		var textPilihan string
		var pembahasan string

		if err := tfRows.Scan(&jawaban, &bobot, &kodeSoal, &pembahasan, &textPilihan); err != nil {
			return nil, err
		}

		// Store by kodeSoal
		answers.TrueFalseAnswers[kodeSoal] = struct {
			Jawaban     string
			Bobot       int
			TextPilihan string
			Pembahasan  string
		}{Jawaban: jawaban, Bobot: bobot, TextPilihan: textPilihan, Pembahasan: pembahasan}
	}

	// 🔹 Uraian
	uraianQuery := `
		SELECT u.jawaban, s.bobot_soal, u.kode_soal, s.pembahasan
		FROM uraian u
		JOIN soal s ON u.kode_soal = s.kode_soal
		WHERE s.paket_soal_id = $1 AND s.subtest = $2
	`
	uraianRows, err := r.db.Queryx(uraianQuery, paketSoal, subtest)
	if err != nil {
		return nil, err
	}
	defer uraianRows.Close()

	for uraianRows.Next() {
		var jawaban sql.NullString
		var bobot int
		var kodeSoal string
		var pembahasan string

		if err := uraianRows.Scan(&jawaban, &bobot, &kodeSoal, &pembahasan); err != nil {
			return nil, err
		}

		// Store by kodeSoal
		answers.UraianAnswers[kodeSoal] = struct {
			Jawaban    string
			Bobot      int
			Pembahasan string
		}{Jawaban: jawaban.String, Bobot: bobot, Pembahasan: pembahasan}
	}

	// ✅ Debugging log
	logger.LogDebug("Answer key retrieved", map[string]interface{}{
		"layer": "repository", "operation": "GetAnswerKeyByPaketAndSubtest", "paket_soal": paketSoal, "subtest": subtest,
	})

	return answers, nil
}
