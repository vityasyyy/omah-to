-- Insert questions into minat_bakat_soal
INSERT INTO minat_bakat_soal (kode_soal, text_soal) VALUES
('q1', 'Apa yang paling menarik bagi Anda dalam dunia teknologi?'),
('q2', 'Ketika menggunakan aplikasi atau website, Anda lebih tertarik pada...'),
('q3', 'Jika Anda harus membangun sebuah aplikasi, apa yang ingin Anda fokuskan?'),
('q4', 'Bagian mana yang menurut Anda paling menarik dari pemrograman?'),
('q5', 'Anda lebih suka menghabiskan waktu untuk...'),
('q6', 'Jika diberikan tantangan untuk membuat sebuah proyek teknologi, mana yang lebih menarik?'),
('q7', 'Mana yang paling menggambarkan pendekatan Anda dalam menyelesaikan masalah?'),
('q8', 'Jika Anda harus memilih satu proyek untuk dikerjakan, Anda akan memilih?'),
('q9', 'Apa yang paling membuat Anda tertarik dalam dunia IT?'),
('q10', 'Jika Anda harus berkontribusi dalam tim teknologi, apa peran yang ingin Anda ambil?'),
('q11', 'Apa yang lebih menarik bagi Anda saat belajar coding?'),
('q12', 'Bagaimana cara Anda menyelesaikan tantangan dalam pemrograman?'),
('q13', 'Dalam membuat aplikasi, mana yang lebih penting bagi Anda?'),
('q14', 'Ketika bermain game, apa yang paling membuat Anda tertarik?'),
('q15', 'Jika Anda harus memilih satu bidang untuk ditekuni dalam IT, mana yang Anda pilih?');

-- Insert choices into minat_bakat_pilihan
INSERT INTO minat_bakat_pilihan (pilihan_id, kode_soal, text_pilihan, divisi) VALUES
-- Question 1
('p1', 'q1', 'Membuat tampilan website yang menarik dan interaktif', 'frontend'),
('p2', 'q1', 'Mengelola data dan membuat prediksi dengan kecerdasan buatan', 'dsai'),
('p3', 'q1', 'Menyusun strategi serangan dan pertahanan keamanan sistem', 'cysec'),
('p4', 'q1', 'Membangun aplikasi yang bisa dijalankan di berbagai platform', 'mobapps'),

-- Question 2
('p5', 'q2', 'Desain dan bagaimana tampilan terlihat menarik', 'frontend'),
('p6', 'q2', 'Bagaimana aplikasi memproses data di belakang layar', 'backend'),
('p7', 'q2', 'Bagaimana data dapat dimanfaatkan untuk membuat keputusan', 'dsai'),
('p8', 'q2', 'Cara mengamankan aplikasi dari serangan hacker', 'cysec'),

-- Question 3
('p9', 'q3', 'Antarmuka yang mudah digunakan dan menarik', 'frontend'),
('p10', 'q3', 'Performa dan efisiensi sistem di balik layar', 'backend'),
('p11', 'q3', 'Algoritma cerdas yang bisa mempelajari pola dari data', 'dsai'),
('p12', 'q3', 'Keamanan dan perlindungan dari ancaman digital', 'cysec'),

-- Question 4
('p13', 'q4', 'Membangun logika yang efisien untuk memecahkan masalah algoritma', 'cp'),
('p14', 'q4', 'Membuat efek visual dan animasi yang menarik', 'gamedev'),
('p15', 'q4', 'Mengoptimalkan kecepatan dan efisiensi sistem backend', 'backend'),
('p16', 'q4', 'Mengembangkan aplikasi berbasis smartphone', 'mobapps'),

-- Question 5
('p17', 'q5', 'Menganalisis data dan mencari pola dari kumpulan informasi', 'dsai'),
('p18', 'q5', 'Mencari celah keamanan dalam sistem dan memperbaikinya', 'cysec'),
('p19', 'q5', 'Mengembangkan fitur baru dalam sebuah aplikasi', 'mobapps'),
('p20', 'q5', 'Mengikuti kompetisi coding dan memecahkan tantangan algoritma', 'cp'),

-- Question 6
('p21', 'q6', 'Membuat website yang interaktif dengan desain menarik', 'frontend'),
('p22', 'q6', 'Mengembangkan sistem backend yang optimal', 'backend'),
('p23', 'q6', 'Membangun kecerdasan buatan untuk menganalisis data', 'dsai'),
('p24', 'q6', 'Menciptakan game yang seru dan menantang', 'gamedev'),

-- Question 7
('p25', 'q7', 'Menyusun strategi dan mencari solusi algoritmik tercepat', 'cp'),
('p26', 'q7', 'Menganalisis keamanan sistem dan mencari cara melindunginya', 'cysec'),
('p27', 'q7', 'Mendesain tampilan dan pengalaman pengguna yang lebih baik', 'frontend'),
('p28', 'q7', 'Mengembangkan aplikasi mobile dengan pengalaman pengguna yang baik', 'mobapps'),

-- Question 8
('p29', 'q8', 'Membangun dashboard interaktif untuk sebuah aplikasi', 'frontend'),
('p30', 'q8', 'Mengembangkan API yang menangani ribuan permintaan per detik', 'backend'),
('p31', 'q8', 'Mengembangkan model AI yang dapat mengenali wajah', 'dsai'),
('p32', 'q8', 'Menganalisis serangan cyber dan melindungi data dari hacker', 'cysec'),

-- Question 9
('p33', 'q9', 'Membuat animasi dan efek keren dalam game', 'gamedev'),
('p34', 'q9', 'Meningkatkan keamanan sistem dan melindungi dari serangan', 'cysec'),
('p35', 'q9', 'Mengembangkan solusi berbasis AI yang dapat menyelesaikan tugas manusia', 'dsai'),
('p36', 'q9', 'Menulis kode efisien untuk menyelesaikan masalah dalam waktu cepat', 'cp'),

-- Question 10
('p37', 'q10', 'Mendesain tampilan dan pengalaman pengguna', 'frontend'),
('p38', 'q10', 'Mengoptimalkan performa backend dan database', 'backend'),
('p39', 'q10', 'Mengembangkan AI untuk mengotomatisasi tugas', 'dsai'),
('p40', 'q10', 'Menjaga keamanan sistem dan menangkal serangan cyber', 'cysec'),

-- Question 11
('p41', 'q11', 'Mempelajari framework untuk membangun tampilan web', 'frontend'),
('p42', 'q11', 'Mengimplementasikan sistem backend yang skalabel', 'backend'),
('p43', 'q11', 'Meneliti dan mengolah data untuk mendapatkan insight', 'dsai'),
('p44', 'q11', 'Mengembangkan aplikasi dengan fitur unik untuk smartphone', 'mobapps'),

-- Question 12
('p45', 'q12', 'Mencari solusi tercepat dan optimal untuk algoritma', 'cp'),
('p46', 'q12', 'Menganalisis kesalahan dalam sistem dan memperbaikinya', 'backend'),
('p47', 'q12', 'Menggunakan teknologi AI untuk membuat solusi pintar', 'dsai'),
('p48', 'q12', 'Mendesain pengalaman pengguna yang intuitif', 'frontend'),

-- Question 13
('p49', 'q13', 'Tampilan menarik dan interaktif', 'frontend'),
('p50', 'q13', 'Struktur backend yang aman dan efisien', 'backend'),
('p51', 'q13', 'Implementasi AI untuk meningkatkan fitur', 'dsai'),
('p52', 'q13', 'Keamanan sistem dan perlindungan data', 'cysec'),

-- Question 14
('p53', 'q14', 'Desain karakter dan efek visual yang keren', 'gamedev'),
('p54', 'q14', 'Bagaimana game merespons input pemain dengan cepat', 'backend'),
('p55', 'q14', 'Strategi dan algoritma yang membuat game lebih menantang', 'cp'),
('p56', 'q14', 'Keamanan akun dan bagaimana game mencegah peretasan', 'cysec'),

-- Question 15
('p57', 'q15', 'Merancang antarmuka pengguna yang keren dan fungsional', 'frontend'),
('p58', 'q15', 'Menganalisis dan memproses data dalam jumlah besar', 'dsai'),
('p59', 'q15', 'Membangun sistem backend yang kuat dan responsif', 'backend'),
('p60', 'q15', 'Mengembangkan aplikasi mobile untuk memudahkan kehidupan', 'mobapps');
