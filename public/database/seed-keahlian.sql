-- Seeding data for Table: keahlian
-- Drop old tables if they exist to apply new schema changes
DROP TABLE IF EXISTS keahlian_kategori;
DROP TABLE IF EXISTS keahlian;

CREATE TABLE IF NOT EXISTS keahlian (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    kategori TEXT NOT NULL,
    bidang TEXT NOT NULL,
    persentase INTEGER CHECK (persentase >= 0 AND persentase <= 100),
    deskripsi TEXT,
    penguasaan TEXT
);

-- Insert skills with kategori directly
INSERT INTO keahlian (kategori, bidang, persentase, deskripsi, penguasaan) VALUES
('Komunikasi', 'Negosiasi', 90, 'Kemampuan dalam bernegosiasi untuk mencapai kesepakatan yang menguntungkan kedua belah pihak.', '["Negosiasi B2B", "Manajemen Konflik", "Diplomasi", "Persuasi"]'),
('Komunikasi', 'Public Speaking', 85, 'Keahlian berbicara di depan umum dengan percaya diri dan komunikatif.', '["Presentasi Bisnis", "MC/Moderator", "Pidato", "Storytelling"]'),
('Komunikasi', 'Marketing', 80, 'Strategi pemasaran dan promosi untuk meningkatkan penjualan dan brand awareness.', '["Digital Marketing", "SEO/SEM", "Social Media Management", "Market Research"]'),
('Komunikasi', 'Copywriting', 85, 'Penulisan teks persuasif untuk keperluan pemasaran dan iklan.', '["Ad Copy", "Email Marketing", "Blog Post", "Sales Page"]'),
('Komunikasi', 'Public Relations', 75, 'Membangun dan memelihara hubungan baik antara perusahaan dan publik.', '["Media Relations", "Press Release", "Event Management", "Crisis Management"]'),

('Teknologi', 'Web Development', 95, 'Pengembangan situs web dari sisi front-end maupun back-end.', '["React", "Node.js", "TypeScript", "Tailwind CSS"]'),
('Teknologi', 'AI Development', 85, 'Membangun sistem dan aplikasi menggunakan teknologi kecerdasan buatan.', '["Machine Learning", "NLP", "Computer Vision", "Prompt Engineering"]'),
('Teknologi', 'Database Management', 90, 'Pengelolaan dan perancangan basis data yang efisien dan aman.', '["SQL (PostgreSQL)", "NoSQL (MongoDB)", "Redis", "Firebase"]'),
('Teknologi', 'Cloud Computing', 80, 'Penyediaan sumber daya komputasi melalui internet.', '["AWS", "Google Cloud", "Docker", "Kubernetes"]'),
('Teknologi', 'System Architecture', 85, 'Merancang dan membangun arsitektur sistem yang skalabel dan handal.', '["Microservices", "REST API", "GraphQL", "System Design"]'),

('Kreatif', 'Graphic Design', 85, 'Perancangan elemen visual untuk berbagai keperluan desain.', '["Adobe Photoshop", "Adobe Illustrator", "CorelDraw", "Figma"]'),
('Kreatif', 'UI/UX Design', 90, 'Desain antarmuka dan pengalaman pengguna yang intuitif dan menarik.', '["Wireframing", "Prototyping", "User Testing", "Interaction Design"]'),
('Kreatif', 'Video Editing', 80, 'Penyuntingan video untuk menghasilkan konten yang menarik dan profesional.', '["Adobe Premiere", "After Effects", "DaVinci Resolve", "CapCut"]'),
('Kreatif', 'Content Creation', 85, 'Pembuatan konten visual dan teks untuk platform digital.', '["TikTok", "Instagram Reels", "YouTube", "Blogging"]'),
('Kreatif', 'Animation', 70, 'Pembuatan animasi 2D dan 3D untuk berbagai kebutuhan.', '["Motion Graphics", "Character Animation", "Lottie", "Blender"]'),

('Administrasi', 'Ms. Office', 95, 'Penguasaan aplikasi perkantoran untuk administrasi harian.', '["Word", "Excel", "PowerPoint", "Access"]'),
('Administrasi', 'Manajemen Keuangan', 85, 'Pengelolaan arus kas, anggaran, dan laporan keuangan.', '["Budgeting", "Financial Reporting", "Auditing", "Taxation"]'),
('Administrasi', 'Manajemen Proyek', 90, 'Perencanaan, pelaksanaan, dan pengawasan proyek hingga selesai.', '["Agile/Scrum", "Trello", "Jira", "Asana"]'),
('Administrasi', 'Pembukuan', 85, 'Pencatatan transaksi keuangan secara sistematis dan akurat.', '["Jurnal Umum", "Buku Besar", "Neraca Saldo", "Laporan Laba Rugi"]'),
('Administrasi', 'Data Entry', 95, 'Pengisian data ke dalam sistem komputer dengan cepat dan akurat.', '["Kecepatan Mengetik", "Akurasi Data", "Database Input", "Data Cleaning"]');
