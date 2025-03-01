-- Insert sample questions into minat_bakat_soal
INSERT INTO minat_bakat_soal (kode_soal, text_soal) VALUES
('q1', 'Which development area interests you the most?'),
('q2', 'What kind of projects do you enjoy working on?'),
('q3', 'Which of these tools do you prefer using?');

-- Insert sample choices into minat_bakat_pilihan
INSERT INTO minat_bakat_pilihan (pilihan_id, kode_soal, text_pilihan, divisi) VALUES
-- Choices for question 1
('p1', 'q1', 'Building user interfaces for websites', 'frontend'),
('p2', 'q1', 'Developing server-side logic and APIs', 'backend'),
('p3', 'q1', 'Creating mobile applications', 'mobapps'),
('p4', 'q1', 'Designing user experiences', 'uiux'),
('p5', 'q1', 'Working with data and AI', 'dsai'),
('p6', 'q1', 'Cybersecurity and hacking', 'cysec'),
('p7', 'q1', 'Developing video games', 'gamedev'),

-- Choices for question 2
('p8', 'q2', 'Web development projects', 'frontend'),
('p9', 'q2', 'Backend system development', 'backend'),
('p10', 'q2', 'Mobile apps and responsive UI', 'mobapps'),
('p11', 'q2', 'Wireframing and prototyping', 'uiux'),
('p12', 'q2', 'Machine learning models', 'dsai'),
('p13', 'q2', 'Penetration testing & security audits', 'cysec'),
('p14', 'q2', 'Game design and physics simulations', 'gamedev'),

-- Choices for question 3
('p15', 'q3', 'React, Vue, or Svelte', 'frontend'),
('p16', 'q3', 'Node.js, Go, or Java', 'backend'),
('p17', 'q3', 'Flutter, React Native, or Swift', 'mobapps'),
('p18', 'q3', 'Figma, Sketch, or Adobe XD', 'uiux'),
('p19', 'q3', 'TensorFlow, PyTorch, or scikit-learn', 'dsai'),
('p20', 'q3', 'Kali Linux, Burp Suite, or Wireshark', 'cysec'),
('p21', 'q3', 'Unity, Unreal Engine, or Godot', 'gamedev');
