-- Insert into paket_soal
INSERT INTO paket_soal (paket_soal_id, nama_paket)
VALUES ('paket1', 'Paket Soal Tryout');

-- Insert into soal for each subtest
INSERT INTO soal (kode_soal, paket_soal_id, subtest, tipe_soal, text_soal, path_gambar_soal, bobot_soal, pembahasan) VALUES
-- Multiple choice questions
('pu-001', 'paket1', 'subtest_pu', 'multiple_choice', 'What is 2 + 2?', NULL, 10, 'Basic arithmetic.'),
('ppu-001', 'paket1', 'subtest_ppu', 'multiple_choice', 'What is the capital of France?', NULL, 10, 'Paris is the capital.'),
('pbm-001', 'paket1', 'subtest_pbm', 'multiple_choice', 'Which planet is known as the Red Planet?', NULL, 10, 'Mars is the Red Planet.'),
('pk-001', 'paket1', 'subtest_pk', 'multiple_choice', 'Who developed the theory of relativity?', NULL, 10, 'Albert Einstein.'),
('lbi-001', 'paket1', 'subtest_lbi', 'multiple_choice', 'What is the synonym of happy?', NULL, 10, 'Synonym example: joyful.'),
('lbe-001', 'paket1', 'subtest_lbe', 'multiple_choice', 'What is the antonym of weak?', NULL, 10, 'Antonym example: strong.'),
('pm-001', 'paket1', 'subtest_pm', 'multiple_choice', 'Solve for x: 5x = 25', NULL, 10, 'x = 5.'),

-- True/False questions
('pu-002', 'paket1', 'subtest_pu', 'true_false', 'The sky is green.', NULL, 10, 'The sky is blue, so this is false.'),
('ppu-002', 'paket1', 'subtest_ppu', 'true_false', 'Water boils at 100°C.', NULL, 10, 'True at sea level.'),
('pbm-002', 'paket1', 'subtest_pbm', 'true_false', 'Earth is flat.', NULL, 10, 'This is false.'),
('pk-002', 'paket1', 'subtest_pk', 'true_false', 'Newton discovered gravity.', NULL, 10, 'This is true.'),
('lbi-002', 'paket1', 'subtest_lbi', 'true_false', 'Shakespeare wrote Hamlet.', NULL, 10, 'This is true.'),
('lbe-002', 'paket1', 'subtest_lbe', 'true_false', 'The Pacific Ocean is the largest ocean.', NULL, 10, 'This is true.'),
('pm-002', 'paket1', 'subtest_pm', 'true_false', '2 is a prime number.', NULL, 10, 'This is true.'),

-- Short answer questions
('pu-003', 'paket1', 'subtest_pu', 'short_answer', 'Define gravity.', NULL, 10, 'Gravity is the force that attracts objects toward each other.'),
('ppu-003', 'paket1', 'subtest_ppu', 'short_answer', 'Who wrote Hamlet?', NULL, 10, 'William Shakespeare wrote Hamlet.'),
('pbm-003', 'paket1', 'subtest_pbm', 'short_answer', 'What is the speed of light?', NULL, 10, '299,792,458 meters per second.'),
('pk-003', 'paket1', 'subtest_pk', 'short_answer', 'Explain photosynthesis.', NULL, 10, 'Photosynthesis is the process by which plants convert sunlight into energy.'),
('lbi-003', 'paket1', 'subtest_lbi', 'short_answer', 'What is an idiom?', NULL, 10, 'An idiom is a phrase with a meaning different from its literal meaning.'),
('lbe-003', 'paket1', 'subtest_lbe', 'short_answer', 'Translate "apple" to Spanish.', NULL, 10, 'Manzana.'),
('pm-003', 'paket1', 'subtest_pm', 'short_answer', 'What is the Pythagorean theorem?', NULL, 10, 'a² + b² = c².');

-- Insert into pilihan_pilihan_ganda
INSERT INTO pilihan_pilihan_ganda (pilihan_pilihan_ganda_id, kode_soal, pilihan, is_correct) VALUES
-- Multiple choice for subtest_pu
('pu-001-a', 'pu-001', '2', FALSE),
('pu-001-b', 'pu-001', '3', FALSE),
('pu-001-c', 'pu-001', '4', TRUE),
('pu-001-d', 'pu-001', '5', FALSE),
-- Multiple choice for subtest_ppu
('ppu-001-a', 'ppu-001', 'London', FALSE),
('ppu-001-b', 'ppu-001', 'Berlin', FALSE),
('ppu-001-c', 'ppu-001', 'Paris', TRUE),
('ppu-001-d', 'ppu-001', 'Madrid', FALSE),
-- Multiple choice for subtest_pbm
('pbm-001-a', 'pbm-001', 'Venus', FALSE),
('pbm-001-b', 'pbm-001', 'Mars', TRUE),
('pbm-001-c', 'pbm-001', 'Jupiter', FALSE),
('pbm-001-d', 'pbm-001', 'Saturn', FALSE),
-- Multiple choice for subtest_pk
('pk-001-a', 'pk-001', 'Isaac Newton', FALSE),
('pk-001-b', 'pk-001', 'Albert Einstein', TRUE),
('pk-001-c', 'pk-001', 'Galileo Galilei', FALSE),
('pk-001-d', 'pk-001', 'Nikola Tesla', FALSE),
-- Multiple choice for subtest_lbi
('lbi-001-a', 'lbi-001', 'Sad', FALSE),
('lbi-001-b', 'lbi-001', 'Joyful', TRUE),
('lbi-001-c', 'lbi-001', 'Angry', FALSE),
('lbi-001-d', 'lbi-001', 'Bored', FALSE),
-- Multiple choice for subtest_lbe
('lbe-001-a', 'lbe-001', 'Strong', TRUE),
('lbe-001-b', 'lbe-001', 'Weak', FALSE),
('lbe-001-c', 'lbe-001', 'Soft', FALSE),
('lbe-001-d', 'lbe-001', 'Tired', FALSE),
-- Multiple choice for subtest_pm
('pm-001-a', 'pm-001', '3', FALSE),
('pm-001-b', 'pm-001', '4', FALSE),
('pm-001-c', 'pm-001', '5', TRUE),
('pm-001-d', 'pm-001', '6', FALSE);

-- Insert into pilihan_true_false
INSERT INTO pilihan_true_false (pilihan_true_false_id, kode_soal, pilihan_tf, jawaban) VALUES
-- True/False for subtest_pu
('pu-002-tfa', 'pu-002', 'True', 'pu-002-tfa'),
('pu-002-tfb', 'pu-002', 'False', 'pu-002-tfa'),
-- True/False for subtest_ppu
('ppu-002-tfa', 'ppu-002', 'True', 'ppu-002-tfb'),
('ppu-002-tfb', 'ppu-002', 'False', 'ppu-002-tfb'),
-- True/False for subtest_pbm
('pbm-002-tfa', 'pbm-002', 'True', ''),
('pbm-002-tfb', 'pbm-002', 'False', ''),
-- True/False for subtest_pk
('pk-002-tfa', 'pk-002', 'True', 'pk-002-tfa,pk-002-tfb'),
('pk-002-tfb', 'pk-002', 'False', 'pk-002-tfa,pk-002-tfb'),
-- True/False for subtest_lbi
('lbi-002-tfa', 'lbi-002', 'True', ''),
('lbi-002-tfb', 'lbi-002', 'False', ''),
-- True/False for subtest_lbe
('lbe-002-tfa', 'lbe-002', 'True', ''),
('lbe-002-tfb', 'lbe-002', 'False', ''),
-- True/False for subtest_pm
('pm-002-tfa', 'pm-002', 'True', ''),
('pm-002-tfb', 'pm-002', 'False', '');

-- Insert into uraian (essay answers)
INSERT INTO uraian (uraian_id, kode_soal, jawaban) VALUES
('pu-003-ur', 'pu-003', 'Gravity is the force that attracts objects toward the center of the Earth.'),
('ppu-003-ur', 'ppu-003', 'William Shakespeare wrote Hamlet.'),
('pbm-003-ur', 'pbm-003', '299,792,458 meters per second.'),
('pk-003-ur', 'pk-003', 'Photosynthesis is the process by which plants convert sunlight into energy.'),
('lbi-003-ur', 'lbi-003', 'An idiom is a phrase with a meaning different from its literal meaning.'),
('lbe-003-ur', 'lbe-003', 'The Spanish translation of "apple" is "manzana".'),
('pm-003-ur', 'pm-003', 'The Pythagorean theorem states that a² + b² = c².');
