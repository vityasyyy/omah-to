package repositories

import (
	"soal-service/internal/logger"
	"soal-service/internal/models"

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
	// Map soal by kode soal as key and soal gabungan as value
	var mappedSoal = make(map[string]*models.SoalGabungan)
	// query that joins 4 table soal, pilihan_pilihan_ganda, pilihan_true_false, and uraian
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

	// query the db
	rows, err := r.db.Queryx(query, paketSoal, subtest)
	if err != nil {
		return nil, err
	}
	// close the rows after the function ends
	defer rows.Close()

	// iterate over the rows
	for rows.Next() {
		var soal models.SoalGabungan
		var pilihanGanda models.PilihanPilihanGanda
		var trueFalse models.PilihanTrueFalse
		var uraian models.Uraian
		// scan the rows into the struct
		err := rows.Scan(
			&soal.KodeSoal, &soal.PaketSoalID, &soal.Subtest, &soal.TextSoal, &soal.PathGambarSoal,
			&pilihanGanda.PilihanPilihanGandaID, &pilihanGanda.Pilihan,
			&trueFalse.PilihanTrueFalseID, &trueFalse.PilihanTf,
			&uraian.UraianID,
		)
		if err != nil {
			return nil, err
		}
		// check if the soal is not in the map, if not then add it to the map
		if _, exists := mappedSoal[soal.KodeSoal]; !exists {
			mappedSoal[soal.KodeSoal] = &soal
		}

		// append the pilihan ganda, true false, and uraian to the soal
		if pilihanGanda.PilihanPilihanGandaID != "" {
			mappedSoal[soal.KodeSoal].PilihanGanda = append(mappedSoal[soal.KodeSoal].PilihanGanda, pilihanGanda)
		}

		if trueFalse.PilihanTrueFalseID != "" {
			mappedSoal[soal.KodeSoal].TrueFalse = append(mappedSoal[soal.KodeSoal].TrueFalse, trueFalse)
		}

		if uraian.UraianID != "" {
			mappedSoal[soal.KodeSoal].Uraian = &uraian
		}
	}
	// create a list of soal from the map
	var listSoal []models.SoalGabungan
	// iterate over the map and append the soal to the list
	for _, soal := range mappedSoal {
		listSoal = (append(listSoal, *soal))
	}
	logger.LogDebug("User retrieved", map[string]interface{}{"layer": "repository", "operation": "GetUserByEmail", "paket_soal": paketSoal, "subtest": subtest})
	return listSoal, nil
}

func (r *soalRepo) GetAnswerKeyByPaketAndSubtest(paketSoal, subtest string) (*models.AnswerKeys, error) {
	// create an answer key struct
	answers := &models.AnswerKeys{
		PilihanGandaAnswers: make(map[string]struct {
			IsCorrect bool
			Bobot     int
		}),
		TrueFalseAnswers: make(map[string]struct {
			IsCorrect bool
			Bobot     int
		}),
		UraianAnswers: make(map[string]struct {
			Jawaban string
			Bobot   int
		}),
	}
	// query to get the answer key for pilihan ganda
	pgQuery := `
		SELECT ppg.pilihan_pilihan_ganda_id, ppg.is_correct, s.bobot_soal
		FROM pilihan_pilihan_ganda ppg
		JOIN soal s ON ppg.kode_soal = s.kode_soal
		WHERE s.paket_soal_id = $1 AND s.subtest = $2
	`
	// execute the query in db, will return sqlx rows
	pgRows, err := r.db.Queryx(pgQuery, paketSoal, subtest)
	if err != nil {
		return nil, err
	}
	defer pgRows.Close()
	// iterate over the rows
	for pgRows.Next() {
		var pilihan_ganda_id string
		var is_correct bool
		var bobot int
		// scan the rows into the struct
		if err := pgRows.Scan(&pilihan_ganda_id, &is_correct, &bobot); err != nil {
			return nil, err
		}
		// add the answer to the answer key struct
		answers.PilihanGandaAnswers[pilihan_ganda_id] = struct {
			IsCorrect bool
			Bobot     int
		}{IsCorrect: is_correct, Bobot: bobot}
	}
	// then do the same for true false and uraian
	tfQuery := `
		SELECT ptf.pilihan_true_false_id, ptf.jawaban, s.bobot_soal
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
		var pilihan_tf_id string
		var jawaban bool
		var bobot int
		if err := tfRows.Scan(&pilihan_tf_id, &jawaban, &bobot); err != nil {
			return nil, err
		}
		answers.TrueFalseAnswers[pilihan_tf_id] = struct {
			IsCorrect bool
			Bobot     int
		}{IsCorrect: jawaban, Bobot: bobot}
	}

	uraianQuery := `
		SELECT u.uraian_id, u.jawaban, s.bobot_soal
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
		var uraian_id string
		var jawaban string
		var bobot int
		if err := uraianRows.Scan(&uraian_id, &jawaban, &bobot); err != nil {
			return nil, err
		}
		answers.UraianAnswers[uraian_id] = struct {
			Jawaban string
			Bobot   int
		}{Jawaban: jawaban, Bobot: bobot}
	}
	logger.LogDebug("answer retrieved", map[string]interface{}{"layer": "repository", "operation": "GetAnswerByPaketAndSubtest", "paket_soal": paketSoal, "subtest": subtest})
	return answers, nil
}
