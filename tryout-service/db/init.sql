CREATE TABLE IF NOT EXISTS tryout_attempt (
    tryout_attempt_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP,
    tryout_score DOUBLE PRECISION DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS user_answers (
    tryout_attempt_id INT NOT NULL,
    kode_soal VARCHAR(36) NOT NULL,
    jawaban TEXT NOT NULL,
    PRIMARY KEY(tryout_attempt_id, kode_soal),
    FOREIGN KEY (tryout_attempt_id) REFERENCES tryout_attempt(tryout_attempt_id) ON DELETE CASCADE
)