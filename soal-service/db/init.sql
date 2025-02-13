CREATE TABLE IF NOT EXISTS paket_soal (
    paket_soal_id VARCHAR(36) PRIMARY KEY,
    nama_paket VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS soal (
    kode_soal VARCHAR(36) PRIMARY KEY,
    paket_soal_id VARCHAR(36) NOT NULL,
    subtest VARCHAR(20) CHECK (subtest IN ('subtest_pu', 'subtest_ppu', 'subtest_pbm', 'subtest_pk', 'subtest_lbi', 'subtest_lbe', 'subtest_pm')),
    tipe_soal VARCHAR(20) CHECK (tipe_soal IN ('multiple_choice', 'true_false', 'short_answer')),
    text_soal TEXT NOT NULL,
    path_gambar_soal VARCHAR(255),
    bobot_soal INT NOT NULL CHECK (bobot_soal > 0 AND bobot_soal <= 100),
    pembahasan TEXT NOT NULL,
    FOREIGN KEY (paket_soal_id) REFERENCES paket_soal(paket_soal_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS pilihan_pilihan_ganda (
    pilihan_pilihan_ganda_id VARCHAR(36) PRIMARY KEY,
    kode_soal VARCHAR(36) NOT NULL,
    pilihan TEXT NOT NULL,
    is_correct BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (kode_soal) REFERENCES soal(kode_soal) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS pilihan_true_false (
    pilihan_true_false_id VARCHAR(36) PRIMARY KEY,
    kode_soal VARCHAR(36) NOT NULL,
    pilihan_tf TEXT NOT NULL
    jawaban BOOLEAN NOT NULL,
    FOREIGN KEY (kode_soal) REFERENCES soal(kode_soal) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS uraian (
    uraian_id VARCHAR(36) PRIMARY KEY,
    kode_soal VARCHAR(36) NOT NULL,
    jawaban TEXT NOT NULL,
    FOREIGN KEY (kode_soal) REFERENCES soal(kode_soal) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX idx_paket_soal ON soal (paket_soal_id);
CREATE INDEX idx_kode_soal_pilihan ON pilihan_pilihan_ganda (kode_soal);
CREATE INDEX idx_kode_pilihan_true_false ON pilihan_true_false (kode_soal);
CREATE INDEX idx_kode_uraian ON uraian (kode_soal);