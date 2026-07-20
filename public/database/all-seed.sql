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
-- Seeding data for Table: kejuaraan
DELETE FROM kejuaraan;
INSERT INTO kejuaraan (id, tingkat, judul, penerbit, deskripsi, tahun, sertifikat) VALUES
('ach-5', 'Tingkat Kabupaten', 'Winner Duta Genre Kab. Purwakarta', 'Kabupaten Purwakarta', 'Memenangkan kompetisi Duta Genre tingkat kabupaten.', '2025', '/gambar/sertifikat/prestasi1.webp'),
('ach-20', 'Tingkat Kabupaten', 'Winner Duta Generasi Berencana Purwakarta', 'Kabupaten Purwakarta', 'Memenangkan kompetisi Duta Generasi Berencana.', '2023', ''),
('ach-24', 'Tingkat Kabupaten', 'Juara 1 Lomba Pidato Tingkat SMK', 'Penyelenggara Lomba', 'Meraih Juara 1 dalam kompetisi Lomba Pidato tingkat SMK.', '2019', '/gambar/sertifikat/prestasi3.webp'),
('ach-23', 'Tingkat Kabupaten', 'Juara 2 Lomba Pidato Tingkat SMK', 'Penyelenggara Lomba', 'Meraih Juara 2 dalam ajang Lomba Pidato bergengsi tingkat SMK.', '2019', '/gambar/sertifikat/prestasi4.webp'),
('ach-21', 'Tingkat Kabupaten', 'Juara Harapan 2 Lomba Pidato', 'Pemerintah Kabupaten Purwakarta', 'Meraih predikat Juara Harapan 2 dalam ajang perlombaan pidato tingkat Kabupaten.', '2019', '/gambar/sertifikat/prestasi5.webp'),
('ach-14', 'Tingkat Kampus', 'Juara 1 Sastra Puisi Porsa', 'Porsa', 'Memenangkan kompetisi sastra puisi.', '2023', '');
-- Seeding data for Table: pelatihan
DROP TABLE IF EXISTS pelatihan;
CREATE TABLE IF NOT EXISTS pelatihan (
    id TEXT PRIMARY KEY,
    judul TEXT NOT NULL,
    penyelenggara TEXT,
    deskripsi TEXT,
    hasil TEXT,
    tahun TEXT,
    sertifikat TEXT
);
INSERT INTO pelatihan (id, judul, penyelenggara, deskripsi, hasil, tahun, sertifikat) VALUES
(
    'trn-1',
    'Seminar Keorganisasian',
    'Organisasi Mahasiswa Purwakarta',
    'Seminar yang membahas tentang dasar-dasar keorganisasian, tata kelola yang baik, dan strategi kepemimpinan yang efektif untuk mahasiswa.',
    '["Memahami prinsip dasar organisasi", "Mempelajari strategi kepemimpinan dalam organisasi mahasiswa", "Praktik pengambilan keputusan secara efektif"]',
    '2023',
    '/gambar/sertifikat/public-speaking2.webp'
),
(
    'trn-2',
    'Kelas Iklan & Sosial Media',
    'Kelas Jawara',
    'Pelatihan tentang periklanan dan manajemen sosial media untuk kebutuhan bisnis modern.',
    '["Strategi konten sosial media", "Manajemen kampanye periklanan digital", "Analisis performa sosial media"]',
    '2023',
    '/gambar/sertifikat/7.webp'
),
(
    'trn-3',
    'Seminar TACO Interior & Meet and Greet se-Jawa Barat',
    'TACO',
    'Seminar TACO untuk interior dari perusahaan TACO di Bekasi sekaligus meet and greet se-Jawa Barat.',
    '["Pemahaman material interior terbaru dari TACO", "Networking dengan profesional desain interior se-Jawa Barat", "Eksplorasi tren desain interior masa kini"]',
    '2023',
    '/gambar/sertifikat/8.webp'
),
(
    'trn-4',
    'Membangun Karakter Bangsa Di Era Digital',
    'Kominfo, BPIP dan Siberkreasi',
    'Pelatihan ini berfokus pada penguatan nilai-nilai kebangsaan dan Pancasila di ruang digital. Peserta dibekali pemahaman mengenai literasi digital, etika berkomunikasi di dunia maya, serta strategi menangkal disinformasi dan radikalisme digital.',
    '["Meningkatkan literasi digital dan etika bermedia sosial", "Memahami implementasi nilai Pancasila di ruang digital", "Mampu mengidentifikasi dan menangkal hoaks serta disinformasi"]',
    '2023',
    '/gambar/sertifikat/bisnis-digital1.webp'
),
(
    'trn-5',
    'Pelatihan Pemasaran Berbasis Digital bagi UMKM dan Calon Wirausahawan di Jawa Barat',
    'Dinas Tenaga Kerja dan Transmigrasi dan FKLPID Provinsi Jawa Barat',
    'Program pelatihan intensif untuk membekali pelaku UMKM dan wirausahawan dengan strategi pemasaran digital yang komprehensif. Materi mencakup pemanfaatan e-commerce, optimasi media sosial untuk bisnis, and strategi digital branding guna memperluas jangkauan pasar.',
    '["Menguasai teknik pemasaran digital untuk UMKM", "Mampu mengelola dan mengoptimalkan toko di platform e-commerce", "Memahami strategi digital branding dan customer engagement"]',
    '2023',
    '/gambar/sertifikat/bisnis-digital2.webp'
),
(
    'trn-6',
    'Marketing & Branding: Strategi Efektif Membangun Citra dan Daya Saing di Era Digital',
    'Eduverse Indonesia',
    'Kelas komprehensif yang membahas fundamental marketing and branding di era digital. Peserta mempelajari bagaimana membangun identitas merek yang kuat, merancang kampanye pemasaran yang efektif, dan menganalisis tren perilaku konsumen di berbagai platform digital.',
    '["Merancang strategi branding yang kuat dan berkesan", "Mengembangkan kampanye pemasaran digital yang tepat sasaran", "Menganalisis tren pasar dan perilaku konsumen online"]',
    '2023',
    '/gambar/sertifikat/bisnis-digital3.webp'
);
-- Seeding data for Table: pencapaian
DELETE FROM pencapaian;
INSERT INTO pencapaian (id, tingkat, judul, penerbit, deskripsi, kategori, tahun, sertifikat) VALUES
('ach-2', 'Tingkat Nasional', 'Presentator Meeting Nasional Konica Minolta', 'Konica Minolta', 'Menjadi presentator dalam pertemuan tingkat nasional.', 'Presentasi', '2024', ''),
('ach-19', 'Tingkat Provinsi', 'Ketua Penyelenggara Stand Up Comedy Piala Gubernur', 'Pemerintah Provinsi', 'Menjadi ketua penyelenggara acara Stand Up Comedy Piala Gubernur.', 'Kepanitiaan', '2025', '/gambar/sertifikat/kepemimpinan2.webp'),
('ach-12', 'Tingkat Kampus', 'Moderator Seminar Kementerian Keuangan', 'Kampus & Kemenkeu', 'Memoderasi acara seminar kerja sama kampus dan Kementerian Keuangan.', 'Moderator', '2024', '/gambar/sertifikat/public-speaking1.webp'),
('ach-4', 'Tingkat Nasional', 'Host Podcast Putra Batik Indonesia', 'Putra Batik Indonesia', 'Menjadi host untuk podcast resmi.', 'Public Speaking', '2023', ''),
('ach-8', 'Tingkat Kabupaten', 'Juri Kompetisi UMKM Bangga Kencana Kab. Purwakarta', 'Pemkab Purwakarta', 'Dipercaya sebagai juri kompetisi UMKM.', 'Juri', '2023', ''),
('ach-17', 'Tingkat Kampus', 'Presiden Mahasiswa STIE Wikara', 'STIE Wikara', 'Menjabat sebagai Presiden Mahasiswa.', 'Organisasi', '2024', '/gambar/sertifikat/kepemimpinan1.webp'),
('ach-26', 'Tingkat Kampus', 'Head of Business Education UKM KWU STIE Wikara', 'UKM KWU STIE Wikara', 'Menjabat sebagai Head of Business Education di Unit Kegiatan Mahasiswa Kewirausahaan STIE Wikara.', 'Organisasi', '2025', '/gambar/sertifikat/bisnis-digital5.webp'),
('ach-6', 'Tingkat Kabupaten', 'Pemateri Seminar Fosta', 'Fosta', 'Menjadi pemateri dalam seminar edukasi.', 'Pemateri', '2024', '/gambar/sertifikat/public-speaking4.webp'),
('ach-7', 'Tingkat Kabupaten', 'Pemateri Edufest Lebih Kenal Manajemen', 'Edufest', 'Memberikan materi pengenalan manajemen.', 'Pemateri', '2024', '/gambar/sertifikat/public-speaking1.webp'),
('ach-25', 'Tingkat Kampus', 'Pembicara Mini Seminar Kewirausahaan', 'UKM KWU STIE Wikara', 'Dipercaya sebagai pembicara dalam acara Mini Seminar Kewirausahaan untuk menginspirasi mahasiswa.', 'Pemateri', '2024', '/gambar/sertifikat/public-speaking3.webp'),
('ach-16', 'Tingkat Kampus', 'Mahasiswa PKKMB Terbaik', 'Kampus', 'Terpilih sebagai mahasiswa terbaik pada masa orientasi.', 'Penghargaan', '2022', '/gambar/sertifikat/prestasi2.webp'),
('ach-1', 'Tingkat Nasional', 'Team Grand Opening Vany Villa Balige Sumatra Utara', 'Vany Villa', 'Berpartisipasi sebagai tim pelaksana dalam acara grand opening.', 'Kepanitiaan', '2024', ''),
('ach-32', 'Tingkat Kabupaten', 'Ketua Pelaksana GenRe Berbagi Senyuman', 'GenRe Purwakarta', 'Memimpin pelaksanaan program kegiatan sosial kemanusiaan.', 'Kepanitiaan', '2024', ''),
('ach-27', 'Tingkat Kampus', 'Apresiasi Steering Committee PKKMB', 'STIE Wikara', 'Menerima penghargaan dan apresiasi atas kontribusi sebagai Steering Committee PKKMB 2025.', 'Kepanitiaan', '2025', '/gambar/sertifikat/kepemimpinan4.webp'),
('ach-9', 'Tingkat Kabupaten', 'Moderator Seminar Keorganisasian Indonesia', 'Seminar', 'Memoderasi seminar keorganisasian Indonesia.', 'Moderator', '2023', '/gambar/sertifikat/public-speaking2.webp'),
('ach-3', 'Tingkat Nasional', 'Meet Exclusive Bincang Ulos', 'Bincang Ulos', 'Turut serta dalam kegiatan Meet Exclusive.', 'Partisipasi', '2024', ''),
('ach-18', 'Tingkat Kampus', 'Director of Tak Kasat (Film Dokumenter Horor Mahasiswa)', 'Mahasiswa', 'Menjadi sutradara film dokumenter horor mahasiswa.', 'Sutradara', '2025', '/gambar/sertifikat/kepemimpinan3.webp'),
('ach-29', 'Tingkat Kampus', 'MC PORSA 2024', 'Panitia PORSA STIE Wikara', 'Bertindak sebagai Master of Ceremony (MC) dalam gelaran Pekan Olahraga dan Seni Akademik (PORSA) 2024.', 'Public Speaking', '2024', '/gambar/sertifikat/public-speaking5.webp'),
('ach-31', 'Tingkat Kampus', 'Executive Producer WIHUB', 'Wihub UKM', 'Bertanggung jawab atas production kegiatan dan acara UKM.', 'Kepanitiaan', '2024', ''),
('ach-34', 'Tingkat Kampus', 'Ketua Divisi Acara Pekan Olahraga Mahasiswa', 'BEM', 'Merancang dan mengeksekusi rangkaian acara Pekan Olahraga Mahasiswa.', 'Kepanitiaan', '2024', ''),
('ach-13', 'Tingkat Kampus', 'Moderator Debat Pemira', 'Panitia Pemira', 'Memandu debat kandidat pemilihan raya tingkat kampus.', 'Moderator', '2024', ''),
('ach-15', 'Tingkat Kampus', 'Moderator Diksi', 'Diksi', 'Menjadi moderator dalam acara Diksi.', 'Moderator', '2023', ''),
('ach-30', 'Tingkat Kampus', 'Ketua Divisi Seksi Acara PEMIRA', 'BEM', 'Mengelola rangkaian acara pemilihan raya mahasiswa.', 'Kepanitiaan', '2022', ''),
('ach-10', 'Tingkat Kampus', 'Delegasi Promosi Kampus', 'Kampus', 'Menjadi perwakilan untuk kegiatan promosi kampus.', 'Delegasi', '2023', ''),
('ach-28', 'Tingkat Kecamatan', 'Dewan Juri Lomba UPPKA Kecamatan Campaka', 'Kecamatan Campaka Purwakarta', 'Menerima apresiasi atas peran sebagai Dewan Juri Lomba UPPKA tingkat Kecamatan Campaka, Purwakarta.', 'Juri', '2023', '/gambar/sertifikat/bisnis-digital4.webp'),
('ach-11', 'Tingkat Kecamatan', 'Pengibar Bendera - Paskibra Kecamatan Kiarapedes', 'Kecamatan Kiarapedes', 'Menjadi anggota paskibraka tingkat kecamatan sebagai pengibar bendera.', 'Paskibra', '2017', '/gambar/sertifikat/prestasi7.webp'),
('ach-22', 'Tingkat Kabupaten', 'Peserta Lomba IPA Kabupaten Purwakarta', 'Dinas Pendidikan Kabupaten Purwakarta', 'Berpartisipasi aktif dalam kegiatan Lomba IPA tingkat Kabupaten Purwakarta.', 'Partisipasi', '2017', '/gambar/sertifikat/prestasi6.webp'),
('ach-33', 'Tingkat Kecamatan', 'Pelatih Paskibra', 'Kecamatan Kiarapedes', 'Melatih kedisiplinan dan keterampilan baris-berbaris.', 'Kepanitiaan', '', ''),
('ach-35', 'Tingkat Sekolah', 'Duta Baca SMP', 'SMP', 'Berhasil membaca 167 buku dalam 3 bulan dan menjelaskan ulang resensinya.', 'Penghargaan', '', '');
-- Seeding data for Table: pendidikan
DELETE FROM pendidikan;
INSERT INTO pendidikan (id, gelar, institusi, tahun_masuk, tahun_lulus, deskripsi, logo_url, sertifikat) VALUES
(
    'edu-1',
    'Akuntansi Keuangan Lembaga',
    'SMK Negeri Kiarapedes',
    '2015',
    '2018',
    '["Mempelajari dasar-dasar pemrograman web, algoritma, dan struktur data.", "Membangun aplikasi sistem informasi sekolah sederhana sebagai proyek akhir.", "Lulus dengan predikat nilai terbaik di jurusan."]',
    '/gambar/tutwurihandayani.png',
    '["/gambar/sertifikat/akademis1.webp", "/gambar/sertifikat/akademis2.webp"]'
),
(
    'edu-2',
    'S1 Manajemen',
    'STIE Wibawa Karta Raharja',
    '2022',
    '2026',
    '["Fokus pada manajemen bisnis dan strategi operasional.", "Menyelesaikan skripsi tentang optimalisasi proses bisnis di startup teknologi.", "Aktif dalam organisasi mahasiswa sebagai ketua BEM fakultas ekonomi."]',
    '/gambar/wikara.png',
    '[]'
);
-- Seeding data for Table: pengalaman_kerjasama
DELETE FROM pengalaman_kerjasama;
INSERT INTO pengalaman_kerjasama (id, partner, peran, proyek, mulai, selesai, bidang, deskripsi, tujuan, dampak, logo_url, paklaring) VALUES
(
    'collab-6',
    'Melin Parfum',
    'Strategic Partner / Founder',
    'Pembangunan Brand & Strategi Penjualan Ritel',
    '2023',
    'Sekarang',
    'Ritel & Kosmetik',
    'Kemitraan pendiri dalam merintis, membangun model bisnis, merancang identitas merek, dan mengeksekusi strategi pemasaran digital parfum.',
    '["Merancang identitas brand parfum yang memiliki daya pikat tinggi di pasar lokal.", "Menyusun saluran pemasaran online dan offline yang efektif dan berkelanjutan."]',
    '[{"indikator": "Kemandirian rantai pasok produk", "persentase": 90}, {"indikator": "Retensi pelanggan ritel digital", "persentase": 88}]',
    'https://raw.githubusercontent.com/alinlabs/alinlabs-data/main/gambar/logo-klien/melin-parfum.png',
    ''
),
(
    'collab-7',
    'Wood Street',
    'Strategic Partner / Founder',
    'Manajemen Bisnis & Operasional Outlet Kuliner',
    '2022',
    'Sekarang',
    'F&B / Ritel',
    'Kemitraan operasional dalam mengonsep, mengelola, serta mengembangkan operasional harian outlet kuliner Wood Street secara menyeluruh.',
    '["Membangun manajemen operasional outlet yang efisien and mengutamakan kualitas produk.", "Meningkatkan daya tarik outlet melalui aktivitas pemasaran kreatif di wilayah target."]',
    '[{"indikator": "Kerapihan tata kelola F&B", "persentase": 95}, {"indikator": "Kenaikan arus kunjungan pelanggan", "persentase": 30}]',
    'https://raw.githubusercontent.com/alinlabs/alinlabs-data/main/gambar/logo-klien/worldstreet.png',
    ''
),
(
    'collab-8',
    'Alin Labs',
    'Strategic Partner / Founder',
    'Penyusunan Solusi & Layanan Teknologi Digital',
    '2022',
    'Sekarang',
    'Teknologi / Layanan Digital',
    'Kemitraan teknologi dalam penyusunan produk, penyediaan konsultansi, dan pengerjaan proyek-proyek inovasi digital untuk klien.',
    '["Melahirkan solusi rekayasa perangkat lunak dan layanan digital yang handal.", "Mengelola siklus pengerjaan proyek teknologi informasi secara profesional dan akurat."]',
    '[{"indikator": "Peluncuran produk digital UMKM", "persentase": 100}, {"indikator": "Reputasi mitra pengembang", "persentase": 96}]',
    'https://www.alinlabs.biz.id/gambar/logo-icon-color.png',
    ''
),
(
    'collab-5',
    'Lingua First',
    'Kemitraan Operasional (COO)',
    'Manajemen Mutu & Optimalisasi Operasional Pendidikan',
    '2024',
    '2025',
    'Pendidikan & Pelatihan Bahasa',
    'Kolaborasi kepemimpinan operasional untuk memimpin, menata, dan mengoptimalkan seluruh aktivitas belajar mengajar harian, serta standarisasi kualitas mutu layanan.',
    '["Mengoptimalkan efisiensi operasional kursus bahasa dan koordinasi staf pengajar.", "Memastikan konsistensi standar mutu akademik untuk mempertahankan loyalitas siswa."]',
    '[{"indikator": "Efisiensi penjadwalan & koordinasi", "persentase": 25}, {"indikator": "Kepuasan layanan siswa", "persentase": 92}]',
    '/gambar/lingua.png',
    ''
),
(
    'collab-2',
    'STIE Wikara',
    'Konsultan Digital Marketing',
    'Social Media Branding & Awareness Kampus',
    '2024',
    '2024',
    'Pendidikan Tinggi',
    'Kemitraan dalam rangka perancangan strategi pemasaran digital dan sosial media guna memperkuat brand awareness STIE Wikara sebagai institusi pendidikan pilihan.',
    '["Meningkatkan jangkauan informasi penerimaan mahasiswa baru.", "Membangun citra kampus yang modern dan interaktif di media sosial."]',
    '[{"indikator": "Peningkatan audiens organik", "persentase": 75}, {"indikator": "Efektivitas kampanye promosi digital", "persentase": 80}]',
    'https://raw.githubusercontent.com/alinlabs/alinlabs-data/main/gambar/logo-klien/stiewikara.png',
    ''
),
(
    'collab-4',
    'Pesantren Minnatul Huda',
    'Sistem Integrator / Developer',
    'Digitalisasi Sistem & Website Informasi Pesantren',
    '2023',
    '2024',
    'Pendidikan & Sosial Keagamaan',
    'Kerjasama pengembangan platform digital berupa website resmi dan aplikasi manajemen internal untuk mendukung proses digitalisasi di lingkungan pesantren.',
    '["Menyediakan pusat informasi publik terpadu mengenai kegiatan pesantren.", "Modernisasi administrasi santri dan sistem informasi internal pesantren."]',
    '[{"indikator": "Aksesibilitas informasi publik", "persentase": 95}, {"indikator": "Efisiensi administrasi internal", "persentase": 85}]',
    'https://raw.githubusercontent.com/alinlabs/alinlabs-data/main/gambar/logo-klien/minnatulhuda.png',
    ''
),
(
    'collab-4-2',
    'Pesantren Miftahul Huda',
    'Sistem Integrator / Developer',
    'Digitalisasi Sistem & Website Informasi Pesantren',
    '2023',
    '2024',
    'Pendidikan & Sosial Keagamaan',
    'Kerjasama pengembangan platform digital berupa website resmi dan aplikasi manajemen internal untuk mendukung proses digitalisasi di lingkungan pesantren.',
    '["Menyediakan pusat informasi publik terpadu mengenai kegiatan pesantren.", "Modernisasi administrasi santri dan sistem informasi internal pesantren."]',
    '[{"indikator": "Aksesibilitas informasi publik", "persentase": 95}, {"indikator": "Efisiensi administrasi internal", "persentase": 85}]',
    'https://raw.githubusercontent.com/alinlabs/alinlabs-data/main/gambar/logo-klien/miftahulhuda.png',
    ''
),
(
    'collab-3',
    'PT. Sentral Informatika, Tbk',
    'Professional Presentation Designer',
    'Penyusunan Presentasi Bisnis Tahunan',
    '2023',
    '2024',
    'Teknologi & Informasi',
    'Kerjasama profesional dalam mendesain, memformulasikan konsep, dan menyusun materi presentasi laporan tahunan serta prospek bisnis korporat.',
    '["Menyampaikan performa bisnis perusahaan secara visual yang jernih dan profesional.", "Memastikan struktur materi presentasi selaras dengan visi korporat kepada stakeholder."]',
    '[{"indikator": "Akurasi & standar visual laporan", "persentase": 98}, {"indikator": "Pemahaman pesan bagi manajemen", "persentase": 90}]',
    'https://raw.githubusercontent.com/alinlabs/alinlabs-data/main/gambar/logo-klien/pt-sentral-informatika.png',
    ''
),
(
    'collab-1',
    'PT. Tiens Ambefit',
    'Mitra Kerjasama Konten',
    'Iklan Promosi Produk Kesehatan',
    '2024',
    '2024',
    'Kesehatan & Kebugaran',
    'Kerjasama strategis dalam perancangan dan produksi konten iklan promosi multimedia kreatif untuk jajaran produk kesehatan unggulan perusahaan.',
    '["Membuat visual promosi produk kesehatan yang menarik minat audiens.", "Mengoptimalkan digital marketing melalui konten video pendek di media sosial."]',
    '[{"indikator": "Peningkatan interaksi (engagement) digital", "persentase": 85}, {"indikator": "Materi periklanan berkualitas tinggi", "persentase": 95}]',
    'https://raw.githubusercontent.com/alinlabs/alinlabs-data/main/gambar/logo-klien/pt-tiensherba.png',
    ''
),
(
    'collab-9',
    'PT Anugrah Dwi Tunggal',
    'Mitra Kerjasama Konten',
    'Penyusunan Konten dan Manajemen Sosial Media',
    '2024',
    '2024',
    'Sosial Media & E-Commerce',
    'Kerjasama dalam pembuatan dan pengelolaan konten pemasaran di berbagai platform e-commerce dan sosial media.',
    '["Meningkatkan penjualan produk melalui konten yang menarik.", "Meningkatkan brand awareness di platform sosial media dan e-commerce."]',
    '[{"indikator": "Peningkatan engagement media sosial", "persentase": 85}, {"indikator": "Pertumbuhan transaksi penjualan online", "persentase": 70}]',
    'https://raw.githubusercontent.com/alinlabs/alinlabs-data/main/gambar/logo-klien/pt-adt.png',
    ''
),
(
    'collab-10',
    'PT Katisolusindo',
    'Mitra Kerjasama Konten',
    'Penyusunan Konten dan Manajemen Sosial Media',
    '2024',
    '2024',
    'Sosial Media & E-Commerce',
    'Kerjasama dalam pembuatan dan pengelolaan konten pemasaran di berbagai platform e-commerce dan sosial media.',
    '["Meningkatkan penjualan produk melalui konten yang menarik.", "Meningkatkan brand awareness di platform sosial media dan e-commerce."]',
    '[{"indikator": "Peningkatan engagement media sosial", "persentase": 85}, {"indikator": "Pertumbuhan transaksi penjualan online", "persentase": 70}]',
    'https://raw.githubusercontent.com/alinlabs/alinlabs-data/main/gambar/logo-klien/pt-katisolusindo.png',
    ''
);
-- Seeding data for Table: pengalaman_organisasi
DELETE FROM pengalaman_organisasi;
INSERT INTO pengalaman_organisasi (id, peran, organisasi, logo_url, mulai, selesai, deskripsi, pencapaian) VALUES
(
    'org-10',
    'Presiden Mahasiswa',
    'STIE Wikara',
    '/gambar/logo/bem.png',
    '2024', '',
    'Menjabat sebagai Presiden Mahasiswa, memimpin jalannya organisasi eksekutif kemahasiswaan tingkat kampus.',
    '["Memimpin program digitalisasi administrasi kemahasiswaan kampus.", "Menginisiasi pembentukan Forum Kewirausahaan Mahasiswa guna meningkatkan kemandirian finansial ormawa.", "Menyelenggarakan bakti sosial dan seminar kepemimpinan tingkat regional Jawa Barat."]'
),
(
    'org-1',
    'Ketua Divisi Mitra Strategis Dan Sponsor',
    'Edufest Purwakarta',
    '/gambar/logo/edufest.png',
    '2024', '',
    'Mengelola hubungan kemitraan strategis dan pencarian sponsor untuk acara.',
    '["Menjalin kemitraan dengan 15+ korporasi lokal dan instansi pemerintah daerah.", "Mengamankan dana sponsorship senilai puluhan juta rupiah, melampaui target awal sebesar 120%."]'
),
(
    'org-20',
    'Kastrat. Ekonomi',
    'Aliansi BEM Purwakarta',
    '/gambar/logo/aliansi.png',
    '', '',
    'Mengkaji, mengevaluasi, serta mengamati perkembangan ekonomi di wilayah Purwakarta.',
    '["Menyusun kajian strategis terkait evaluasi dampak kebijakan ekonomi mikro bagi pedagang kaki lima di Purwakarta.", "Menyelenggarakan audiensi publik bersama Dinas Koperasi dan UMKM Purwakarta."]'
),
(
    'org-9',
    'Ketua Divisi Edukasi Bisnis',
    'UKM Kewirausahaan',
    '/gambar/logo/kewirausahaan.png',
    '', '',
    'Memberikan edukasi terkait pengembangan bisnis bagi anggota.',
    '["Menyelenggarakan program Inkubator Bisnis Mahasiswa yang diikuti oleh lebih dari 50 peserta aktif.", "Melatih dan mendampingi kelompok usaha mahasiswa dalam menyusun perencanaan bisnis (business plan)."]'
),
(
    'org-16',
    'KADIV. Kaderisasi',
    'Himpunan Mahasiswa Manajemen STIE Wikara',
    '/gambar/logo/himamen.png',
    '', '',
    'Mengelola kaderisasi dan pengembangan anggota himpunan.',
    '["Mendesain kurikulum Latihan Kepemimpinan Mahasiswa Manajemen (LKMM) yang adaptif dan interaktif.", "Meningkatkan antusiasme dan angka retensi keanggotaan aktif baru sebesar 15%."]'
),
(
    'org-14',
    'KADIV. SDM',
    'UKESTRA (Unit Kegiatan Mahasiswa Kesenian dan Sastra STIE Wikara)',
    '/gambar/logo/ukestra.png',
    '2023', '',
    'Berperan aktif dalam kegiatan kesenian dan sastra.',
    '["Mengkoordinasikan pengembangan bakat internal anggota dan menyelenggarakan pementasan tahunan.", "Membangun modul pelatihan keaktoran dan kepenulisan kreatif dasar bagi anggota baru."]'
),
(
    'org-7',
    'Duta Genre',
    'DPPKB',
    '/gambar/logo/genre.png',
    '', '',
    'Menjadi representasi program Generasi Berencana.',
    '["Melakukan sosialisasi tentang pentingnya kesehatan reproduksi dan perencanaan masa depan bagi remaja sekolah.", "Mewakili daerah dalam forum pertukaran program duta Genre tingkat kabupaten."]'
),
(
    'org-17',
    'Anggota',
    'Paskibra SMK Negeri Kiarapedes',
    '/gambar/logo/paskibra.png',
    '', '',
    'Berpartisipasi aktif dalam kegiatan baris-berbaris dan pengibaran bendera.',
    '["Menjadi bagian dari tim pengibar bendera utama dalam peringatan HUT RI tingkat kecamatan."]'
),
(
    'org-18',
    'Anggota',
    'Paskibra SMP 1 Negeri Kiarapedes',
    '/gambar/logo/paskibra.png',
    '', '',
    'Berpartisipasi aktif dalam kegiatan baris-berbaris dan pengibaran bendera.',
    '["Mendukung kelancaran upacara rutin dan hari-hari besar kenegaraan di lingkungan sekolah."]'
),
(
    'org-19',
    'Anggota',
    'Pramuka SMP 1 Cilengkrang',
    '/gambar/logo/pramuka.png',
    '', '',
    'Berpartisipasi dalam kegiatan kepramukaan.',
    '["Berpartisipasi aktif dalam kegiatan Jambore Ranting dan penjelajahan alam."]'
);
-- Seeding data for Table: pengalaman_profesi
DELETE FROM pengalaman_profesi;
INSERT INTO pengalaman_profesi (id, logo_url, paklaring, peran, tingkatan, perusahaan, mulai, selesai, industri, deskripsi, spesialisasi, tugas_tanggung_jawab, ringkasan) VALUES
(
    'kerja-1',
    'https://raw.githubusercontent.com/alinlabs/alinlabs-data/main/gambar/logo-klien/pt-shansusdzar-indonesia.png',
    '',
    'Operational Manager',
    'Project Based',
    'PT Shansudza Indonesia',
    '2025', 'Sekarang',
    'Manajemen Proyek & Operasional',
    'Memimpin operasional proyek mulai dari perencanaan, pengawasan pelaksanaan, pengendalian kualitas, hingga koordinasi dengan klien. Berhasil menjaga tingkat penyelesaian proyek tepat waktu sekitar 96%, meningkatkan efisiensi proses kerja sekitar 20%, serta mempertahankan standar kualitas operasional secara konsisten.',
    '["Operational Management", "Project Management", "Quality Assurance", "Client Management", "Process Optimization", "Team Leadership"]',
    '["Perencanaan Operasional: Menyusun rencana kerja proyek dengan tingkat kesiapan sekitar 95% sebelum pelaksanaan.", "Pengawasan Proyek: Memastikan progres proyek berjalan sesuai timeline dengan tingkat ketepatan sekitar 96%.", "Quality Control: Mengawasi kualitas pekerjaan sehingga tingkat kesesuaian terhadap standar mencapai sekitar 98%.", "Koordinasi Klien: Menjalin komunikasi aktif dengan klien untuk memastikan kebutuhan proyek terpenuhi secara optimal.", "Pengembangan Tim: Mengarahkan dan mengevaluasi tim operasional sehingga produktivitas meningkat sekitar 18%."]',
    '[{"pekerjaan": "Ketepatan Penyelesaian Proyek", "persentase": 96}, {"pekerjaan": "Kepatuhan Standar Kualitas", "persentase": 98}, {"pekerjaan": "Efisiensi Operasional", "persentase": 20}, {"pekerjaan": "Produktivitas Tim", "persentase": 18}]'
),
(
    'kerja-2',
    'https://raw.githubusercontent.com/alinlabs/alinlabs-data/main/gambar/logo-klien/pt-gmg.png',
    '/gambar/paklaring/gmg.webp',
    'Operational Manager',
    'Project Based',
    'PT Galaksi Mitra Gemilang',
    '2024', '2025',
    'Logistik & Operasional',
    'Mengelola operasional perusahaan, mengawasi pelaksanaan pekerjaan, serta memastikan seluruh aktivitas berjalan sesuai target. Berhasil meningkatkan efisiensi operasional sekitar 22% and menjaga penyelesaian pekerjaan tepat waktu hingga 95%.',
    '["Operational Management", "Project Monitoring", "SOP Implementation", "Team Leadership", "Process Improvement", "Quality Control"]',
    '["Manajemen Operasional: Mengendalikan aktivitas operasional dengan tingkat pencapaian target sekitar 95%.", "Pengawasan Pekerjaan: Memastikan seluruh pekerjaan sesuai SOP dengan kepatuhan sekitar 98%.", "Koordinasi Tim: Mengoptimalkan pembagian tugas sehingga efisiensi kerja meningkat sekitar 22%.", "Monitoring Target: Mengawasi progres pekerjaan melalui evaluasi berkala.", "Peningkatan Proses: Mengembangkan proses kerja agar lebih efektif dan efisien."]',
    '[{"pekerjaan": "Efisiensi Operasional", "persentase": 22}, {"pekerjaan": "Ketepatan Penyelesaian", "persentase": 95}, {"pekerjaan": "Kepatuhan SOP", "persentase": 98}, {"pekerjaan": "Produktivitas Tim", "persentase": 18}]'
),
(
    'kerja-4',
    'https://raw.githubusercontent.com/alinlabs/alinlabs-data/main/gambar/logo-klien/konika-minolta.png',
    '',
    'Account Manager',
    'Project Based',
    'PT Perdana Jatiputra',
    '2024', '2024',
    'Distribusi & Penjualan B2B',
    'Mengelola hubungan dengan klien, penyusunan penawaran, koordinasi proyek, serta pengembangan peluang bisnis. Berkontribusi meningkatkan retensi klien sekitar 18% and mempercepat proses koordinasi proyek hingga 20%.',
    '["Account Management", "Client Relationship", "Business Development", "Proposal Management", "Project Coordination", "Negotiation"]',
    '["Hubungan Klien: Menjaga komunikasi dengan klien sehingga tingkat kepuasan mencapai sekitar 90%.", "Penyusunan Penawaran: Menyiapkan proposal dan penawaran sesuai kebutuhan klien dengan ketepatan sekitar 98%.", "Koordinasi Proyek: Menghubungkan kebutuhan klien dengan tim internal sehingga proses kerja lebih efisien sekitar 20%.", "Administrasi Penjualan: Mengelola dokumen penjualan secara lengkap dan tepat waktu.", "Pengembangan Bisnis: Mengidentifikasi peluang kerja sama baru untuk mendukung pertumbuhan perusahaan."]',
    '[{"pekerjaan": "Retensi Klien", "persentase": 18}, {"pekerjaan": "Efisiensi Koordinasi", "persentase": 20}, {"pekerjaan": "Akurasi Proposal", "persentase": 98}, {"pekerjaan": "Kepuasan Klien", "persentase": 90}]'
),
(
    'kerja-5',
    'https://raw.githubusercontent.com/alinlabs/alinlabs-data/main/gambar/logo-klien/vanysongket.png',
    '',
    'Social Media Manager',
    'Project Based',
    'PT Vany''s Group',
    '2023', '2024',
    'Agensi Media & Periklanan',
    'Mengelola seluruh aktivitas media sosial perusahaan mulai dari perencanaan konten, iklan digital, hingga analisis performa. Berhasil meningkatkan engagement sekitar 35%, jangkauan konten 40%, dan konsistensi publikasi hingga 100%.',
    '["Social Media Strategy", "Content Marketing", "Meta Ads", "Performance Analytics", "Branding", "Campaign Optimization"]',
    '["Manajemen Media Sosial: Mengelola seluruh platform media sosial dengan konsistensi publikasi mencapai 100%.", "Strategi Konten: Menyusun konten yang meningkatkan jangkauan organik sekitar 40%.", "Digital Advertising: Mengoptimalkan iklan digital dengan peningkatan performa kampanye sekitar 25%.", "Monitoring Analytics: Mengevaluasi insight media sosial untuk meningkatkan engagement sekitar 35%.", "Pengembangan Branding: Menjaga citra perusahaan melalui komunikasi visual yang konsisten."]',
    '[{"pekerjaan": "Engagement", "persentase": 35}, {"pekerjaan": "Reach Konten", "persentase": 40}, {"pekerjaan": "Efektivitas Iklan", "persentase": 25}, {"pekerjaan": "Konsistensi Publikasi", "persentase": 100}]'
),
(
    'kerja-6',
    'https://raw.githubusercontent.com/alinlabs/alinlabs-data/main/gambar/logo-klien/hokage.png',
    '/gambar/paklaring/multisejahtera.webp',
    'Marketing Communication Manager',
    'Project Based',
    'CV Multi Sejahtera',
    '2023', '2023',
    'Perdagangan & Ritel',
    'Memimpin aktivitas komunikasi pemasaran perusahaan mulai dari penyusunan strategi, koordinasi promosi, hingga evaluasi performa kampanye. Berhasil meningkatkan efektivitas kampanye sekitar 28% and memperkuat konsistensi branding perusahaan.',
    '["Marketing Strategy", "Team Coordination", "Branding", "Campaign Management", "Performance Analysis", "Business Communication"]',
    '["Strategi Pemasaran: Menyusun strategi pemasaran yang meningkatkan efektivitas kampanye hingga sekitar 28%.", "Koordinasi Tim: Mengarahkan tim pemasaran sehingga target pekerjaan tercapai lebih konsisten sekitar 95%.", "Pengelolaan Branding: Menjaga konsistensi identitas perusahaan di seluruh media promosi.", "Monitoring Kinerja: Mengevaluasi performa kampanye menggunakan data dan KPI pemasaran.", "Pelaporan Manajemen: Menyusun laporan perkembangan pemasaran sebagai dasar pengambilan keputusan."]',
    '[{"pekerjaan": "Efektivitas Kampanye", "persentase": 28}, {"pekerjaan": "Konsistensi Target Tim", "persentase": 95}, {"pekerjaan": "Peningkatan Brand Exposure", "persentase": 22}, {"pekerjaan": "Ketepatan Evaluasi", "persentase": 98}]'
),
(
    'kerja-7',
    'https://raw.githubusercontent.com/alinlabs/alinlabs-data/main/gambar/logo-klien/jayabaru.png',
    '/gambar/paklaring/jayabaru.webp',
    'Marketing Communication',
    'Project Based',
    'CV Jayabaru',
    '2023', '2023',
    'Pemasaran & Distribusi',
    'Mengembangkan strategi komunikasi pemasaran melalui media sosial dan berbagai materi promosi perusahaan. Berkontribusi meningkatkan jangkauan digital sekitar 30% serta meningkatkan interaksi audiens rata-rata 20% melalui penyusunan konten yang lebih terarah.',
    '["Marketing Communication", "Content Planning", "Branding", "Copywriting", "Social Media", "Promotion Strategy"]',
    '["Perencanaan Konten: Menyusun kalender konten yang meningkatkan konsistensi publikasi hingga 100% sesuai jadwal.", "Brand Communication: Mengembangkan materi komunikasi untuk memperkuat identitas merek dengan peningkatan awareness sekitar 25%.", "Promosi Digital: Membuat materi promosi yang membantu meningkatkan engagement sekitar 20%.", "Koordinasi Tim: Berkolaborasi dengan berbagai divisi agar proses promosi berjalan efektif dengan efisiensi waktu sekitar 15%.", "Evaluasi Kampanye: Melakukan analisis performa kampanye sebagai dasar perbaikan strategi berikutnya."]',
    '[{"pekerjaan": "Peningkatan Engagement", "persentase": 20}, {"pekerjaan": "Brand Awareness", "persentase": 25}, {"pekerjaan": "Jangkauan Konten", "persentase": 30}, {"pekerjaan": "Konsistensi Publikasi", "persentase": 100}]'
),
(
    'exp-11',
    '/gambar/bpspams.png',
    '/gambar/paklaring/bpspams.webp',
    'Administrasi Dan Keuangan',
    'Staff',
    'BPSPAMS',
    '2022', '2023',
    'Utilitas & Pengelolaan Air',
    'Mengelola seluruh administrasi, pencatatan keuangan, pelaporan berkala, serta pelayanan administrasi pelanggan untuk BPSPAMS skala desa.',
    '["Administrasi Keuangan", "Pencatatan Transaksi", "Pelaporan Keuangan", "Pelayanan Pelanggan", "Pengarsipan Dokumen"]',
    '["Pencatatan Keuangan: Menyusun laporan arus kas harian dan mingguan dengan tingkat ketelitian tinggi.", "Administrasi Pelanggan: Mengelola pencatatan administrasi penggunaan layanan air pelanggan desa.", "Arsip Dokumen: Mengatur pengarsipan dokumen transaksi dan tagihan agar mudah diakses saat audit internal."]',
    '[{"pekerjaan": "Administrasi Keuangan", "persentase": 50}, {"pekerjaan": "Pelayanan Pelanggan", "persentase": 30}, {"pekerjaan": "Pengarsipan Dokumen", "persentase": 20}]'
),
(
    'exp-7',
    '/gambar/tirtaabadiutama.png',
    '',
    'Field Marketing Officer',
    'Officer / Staff',
    'PT TIRTA ABADI UTAMA',
    '2020', '2021',
    'FMCG (Fast Moving Consumer Goods)',
    'Bertanggung jawab mengelola distribusi produk, monitoring stok, serta memastikan ketersediaan produk di area penjualan. Mendukung peningkatan efektivitas distribusi hingga sekitar 18%, menjaga tingkat ketersediaan produk rata-rata di atas 95%, serta memperkuat hubungan kerja sama dengan outlet dan distributor.',
    '["Field Marketing", "Distribution Management", "Stock Monitoring", "Sales Support", "Area Coverage", "Trade Marketing"]',
    '["Monitoring Distribusi: Mengawasi proses distribusi produk agar tingkat ketersediaan mencapai sekitar 95% di seluruh area.", "Manajemen Stok: Mengontrol stok produk untuk mengurangi potensi kekosongan barang hingga sekitar 20%.", "Hubungan Mitra: Menjalin komunikasi aktif dengan distributor dan outlet untuk meningkatkan efektivitas kerja sama sekitar 15%.", "Analisis Lapangan: Melakukan evaluasi kondisi pasar dan kompetitor sebagai dasar pengambilan keputusan pemasaran.", "Pelaporan: Menyusun laporan penjualan dan distribusi secara berkala dengan tingkat ketepatan data sekitar 98%."]',
    '[{"pekerjaan": "Ketersediaan Produk", "persentase": 95}, {"pekerjaan": "Efektivitas Distribusi", "persentase": 18}, {"pekerjaan": "Pengurangan Stock Out", "persentase": 20}, {"pekerjaan": "Akurasi Laporan", "persentase": 98}]'
),
(
    'exp-8',
    '/gambar/bjb.png',
    '',
    'PKL / Magang',
    'Intern / Internship',
    'PT Bank Pembangunan Daerah Jawa Barat dan Banten, Tbk (Bank bjb)',
    '2019', '2019',
    'Perbankan & Keuangan',
    'Melaksanakan program Praktik Kerja Lapangan pada unit operasional perbankan dengan berfokus pada administrasi dokumen, pelayanan nasabah, serta pengelolaan data transaksi. Berhasil menyelesaikan sekitar 95% pekerjaan administrasi tepat waktu serta membantu meningkatkan ketelitian pengarsipan dokumen hingga sekitar 20% melalui proses pencatatan yang lebih rapi.',
    '["Administrasi Perbankan", "Pengarsipan Dokumen", "Input Data", "Pelayanan Nasabah", "Microsoft Office", "Administrasi Operasional"]',
    '["Administrasi Dokumen: Mengelola, menyusun, dan mengarsipkan dokumen operasional dengan tingkat akurasi sekitar 98%.", "Input Data: Melakukan pencatatan data transaksi dan administrasi harian dengan ketepatan input sekitar 97%.", "Pelayanan Nasabah: Membantu proses pelayanan serta memberikan informasi dasar kepada nasabah dengan tingkat kepuasan layanan yang baik.", "Koordinasi Internal: Berkoordinasi dengan staf operasional untuk memastikan proses administrasi berjalan lancar dan sesuai prosedur.", "Kepatuhan SOP: Menjalankan seluruh pekerjaan sesuai standar operasional perusahaan dengan kepatuhan sekitar 100% terhadap prosedur yang diberikan."]',
    '[{"pekerjaan": "Ketepatan Administrasi", "persentase": 98}, {"pekerjaan": "Penyelesaian Tugas Tepat Waktu", "persentase": 95}, {"pekerjaan": "Efisiensi Pengarsipan", "persentase": 20}, {"pekerjaan": "Akurasi Input Data", "persentase": 97}]'
);
-- Seeding data for Table: portofolio
DELETE FROM portofolio;
INSERT INTO portofolio (id, judul, kategori, deskripsi, teknologi, gambar, link, tanggal, fitur) VALUES
(
    'portfolio-1',
    'Konten & Iklan dengan Ambefit',
    'Digital Marketing',
    'Meningkatkan brand awareness melalui kampanye media sosial yang strategis dengan konten video potrait yang mengundang interaksi tinggi, menjangkau audiens secara luas di berbagai platform.',
    '["Social Media Ads", "TikTok & Reels", "Video Production", "Copywriting", "Audience Targeting"]',
    '',
    'https://www.alinlabs.biz.id/portofolio?project=ambefit#ambefit',
    '2024-06-01',
    '["Pembuatan konsep video potrait kreatif", "Penyusunan copywriting iklan persuasif", "Kampanye promosi terarah di platform media sosial", "Optimasi konversi dan perluasan jangkauan audiens"]'
),
(
    'portfolio-2',
    'Video Profil Pesantren Minnatul Huda',
    'Web & Multimedia',
    'Transformasi digital menyeluruh melalui pembuatan video profil yang sinematik, serta pengembangan website dan aplikasi mobile custom untuk mempermudah sistem administrasi dan informasi pesantren agar lebih modern dan terstruktur.',
    '["Web Development", "Mobile App Development", "Cinematography", "UI/UX Design", "Database Management"]',
    '',
    'https://www.alinlabs.biz.id/portofolio?project=minnatulhuda#minnatulhuda',
    '2024-07-15',
    '["Produksi video profil pesantren sinematik berkualitas tinggi", "Sistem administrasi pesantren terintegrasi", "Aplikasi mobile penyebaran informasi pesantren", "Akses cepat jadwal kegiatan dan administrasi santri"]'
),
(
    'portfolio-3',
    'Desain Promosi & Pemasaran Melin Perfume',
    'Creative Design',
    'Koleksi desain promosi kreatif yang dirancang untuk menarik audiens, meningkatkan engagement, dan membangun identitas visual yang elegan dan memikat.',
    '["Visual Branding", "Social Media Design", "Creative Direction", "Content Strategy", "Adobe Creative Suite"]',
    '',
    'https://www.alinlabs.biz.id/portofolio?project=melin#melin',
    '2024-09-01',
    '["Aset desain promosi kreatif dan berkelas", "Pengembangan identitas visual produk parfum", "Penyusunan materi konten media sosial estetis", "Peningkatan brand engagement secara berkala"]'
),
(
    'portfolio-4',
    'Sosial Media & Desain Kreatif STIE Wikara',
    'Digital Marketing',
    'Pengelolaan media sosial dan pembuatan konten desain publikasi kreatif untuk STIE Wikara guna mengedukasi calon mahasiswa serta memperkuat brand identity institusi di era digital.',
    '["Social Media Management", "Content Creation", "Graphic Design", "Brand Identity", "Edu-Marketing"]',
    '',
    'https://www.alinlabs.biz.id/portofolio?project=stie-wikara#stie-wikara',
    '2024-10-10',
    '["Desain publikasi kreatif penerimaan mahasiswa baru", "Pengelolaan feeds dan stories interaktif harian", "Penyusunan infografis akademik yang komunikatif", "Meningkatkan interaksi di akun resmi kampus"]'
),
(
    'portfolio-5',
    'Digital Marketing & Branding UMKM Worldstreet',
    'Digital Marketing',
    'Pengembangan strategi digital marketing dan aset desain promosi visual interaktif untuk UMKM Worldstreet guna memperluas jangkauan pasar kuliner dan meningkatkan penjualan online.',
    '["Digital Marketing", "Social Media Design", "Content Strategy", "Culinary Branding", "UMKM Growth"]',
    '',
    'https://www.alinlabs.biz.id/portofolio?project=worldstreet#worldstreet',
    '2024-11-20',
    '["Perancangan visual menu digital interaktif", "Copywriting kreatif promosi kuliner harian", "Strategi jangkauan pasar lokal kuliner terarah", "Peningkatan trafik penjualan online UMKM"]'
),
(
    'portfolio-6',
    'Video Promosi Vany Songket & Vany Villa Balige',
    'Video Production',
    'Pembuatan video promosi eksklusif yang memadukan keindahan wastra tradisional Vany Songket dengan pesona akomodasi premium Vany Villa Balige di Sumatera Utara untuk menarik wisatawan nusantara maupun mancanegara.',
    '["Videography", "Creative Direction", "Cultural Marketing", "Drone Footage", "Tourism Promotion"]',
    '',
    'https://www.alinlabs.biz.id/portofolio?project=vanysongket#vanysongket',
    '2024-12-05',
    '["Produksi video promosi wastra tenun songket", "Pengambilan gambar sinematik villa eksklusif Balige", "Konseptualisasi tema pariwisata budaya & modernitas", "Pengemasan konten promosi destinasi wisata Danau Toba"]'
);
-- Seeding data for Table: profil
DROP TABLE IF EXISTS profil;

CREATE TABLE IF NOT EXISTS profil (
    nama TEXT PRIMARY KEY,
    jabatan TEXT,
    bio TEXT,
    tentang TEXT,
    email TEXT,
    telepon TEXT,
    whatsapp TEXT,
    lokasi TEXT,
    instagram TEXT,
    tempat_lahir TEXT,
    tanggal_lahir TEXT,
    alamat_tempat_tinggal TEXT,
    pendidikan_terakhir TEXT,
    jurusan TEXT,
    password TEXT,
    email_app_password TEXT
);

INSERT INTO profil (
    nama, jabatan, bio, tentang, email, telepon, whatsapp, lokasi, instagram, tempat_lahir, tanggal_lahir, alamat_tempat_tinggal, pendidikan_terakhir, jurusan, password, email_app_password
) VALUES (
    'Alvareza Hilka Pratama',
    'Open To Work',
    'Profesional yang dinamis dengan keahlian dalam operasional bisnis, administrasi keuangan, dan pemasaran lapangan. Berpengalaman memimpin inisiatif strategis untuk mendorong efisiensi, pertumbuhan, dan keunggulan operasional di berbagai industri.',
    'Saya adalah seorang profesional yang berdedikasi tinggi dengan fokus pada pengembangan dan operasional bisnis. Dengan rekam jejak yang kuat dalam mengoptimalkan proses operasional, mengelola administrasi keuangan yang akurat, serta memimpin tim untuk mencapai target bisnis. Saya selalu bersemangat untuk menghadapi tantangan baru, terus berinovasi, dan berkontribusi secara maksimal untuk pertumbuhan perusahaan.',
    'alvareza.work@gmail.com',
    '0857 9718 4059',
    '+62 857-9718-4059',
    'Indonesia',
    'https://instagram.com/varezza_',
    'Bandung',
    '8 Agustus 2002',
    '[{"label": "Rumah", "alamat": "Kp. Cilopang RT/RW 006/002 Ciracas, Kec. Kiarapedes, Kab. Purwakarta"}, {"label": "Saat ini", "alamat": "Jln. Cendrawasih, No. 1, Nagri Kidul, Purwakarta"}, {"label": "Rumah Saudara", "alamat": "Vila jakasetia, Blok I No. 5, Bekasi Selatan"}]',
    'STIE Wikara',
    'Manajemen',
    'admin123',
    'taxcsetjntqsjdpw'
);
-- Seeding data for Table: cover_letter_templates
DROP TABLE IF EXISTS cover_letter_templates;
CREATE TABLE IF NOT EXISTS cover_letter_templates (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    body TEXT NOT NULL,
    bahasa TEXT,
    rekomendasi TEXT
);

INSERT INTO cover_letter_templates (id, name, body, bahasa, rekomendasi) VALUES
('tpl-1', 'Umum', 'Saya merupakan lulusan **Sarjana Manajemen dari STIE Wikara** dengan portofolio pengalaman kerja yang solid di bidang **operasional ritel dan manajemen proyek**. Portofolio profesional saya mencakup peran strategis dalam mengelola efisiensi alur kerja di **Lingua / Tirta Abadi Utama** serta penyelesaian proyek distribusi sumber daya pada program **BPSPAMS**. Didukung dengan kepemimpinan kuat selaku mantan **Presiden Mahasiswa** serta gelar **Duta GenRe Kabupaten Purwakarta**, saya terbiasa mengoordinasikan tim lintas divisi dan membangun kemitraan strategis.

Saya memiliki daya adaptasi tinggi, etos kerja disiplin, dan kemampuan public speaking yang mumpuni. Saya sangat antusias untuk mengaplikasikan rekam jejak manajerial ini untuk mendukung operasional dan pencapaian target **[Perusahaan]** sebagai **[Posisi]**.', 'Indonesia', '["HRD", "PR", "Manajemen"]'),
('tpl-2', 'General', 'I am a **Bachelor of Management from STIE Wikara** with a robust work portfolio in **retail operations and project management**. My professional background includes managing operational workflows at **Lingua / Tirta Abadi Utama** and resource coordination within the **BPSPAMS project**. Combined with my leadership experience as the **President of the Student Executive Board (Presma)** and my achievement as **Duta GenRe Kabupaten Purwakarta**, I excel in cross-functional coordination and strategic partnerships.

I possess strong adaptability, exceptional communication skills, and a result-oriented mindset. I am highly motivated to leverage my practical experience and leadership track record to contribute to **[Perusahaan]** as a **[Posisi]**.', 'Inggris', '["HRD", "PR", "Management"]'),
('tpl-3', 'Fokus Kepemimpinan, Akademis & Prestasi', 'Sebagai lulusan **Sarjana Manajemen dari STIE Wikara** yang memegang **Sertifikat Kompetensi Kepemimpinan & Public Speaking**, perjalanan karir saya dibentuk oleh jiwa kepemimpinan yang matang dan prestasi nyata. Saya dipercaya memimpin organisasi kemahasiswaan tertinggi sebagai **Presiden Mahasiswa STIE Wikara** dan mengoordinasikan aksi daerah bersama **Aliansi BEM Purwakarta**. Prestasi saya sebagai **Duta GenRe Kabupaten Purwakarta** merefleksikan keahlian komunikasi persuasif dan diplomasi yang kuat, yang juga saya terapkan saat mengoptimalkan tim operasional di **Lingua / Tirta Abadi Utama** dan **BPSPAMS**.

Saya memiliki kemampuan pemecahan masalah yang analitis dan mentalitas yang berorientasi pada prestasi. Saya siap membawa dedikasi terbaik ini untuk mendukung pertumbuhan **[Perusahaan]** pada posisi **[Posisi]**.', 'Indonesia', '["Kepemimpinan", "Akademis", "Prestasi"]'),
('tpl-4', 'Focus on Academic Excellence, Leadership & Awards', 'As a **Bachelor of Management from STIE Wikara** holding **Leadership & Public Speaking Certificates**, my professional journey is anchored in high-impact leadership and recognized excellence. I served as the **President of the Student Executive Board (Presma)** and regional coordinator for the **Purwakarta Student Alliance**. My achievement as **Duta GenRe Kabupaten Purwakarta** highlights my ability to influence and build alliances, which I have successfully translated into operational achievements at **Lingua / Tirta Abadi Utama** and **BPSPAMS**.

With a strong foundation in strategic management, outstanding communication, and a history of awards, I am fully prepared to excel as a **[Posisi]** at **[Perusahaan]**.', 'Inggris', '["Academic", "Leadership", "Awards"]'),
('tpl-5', 'Fokus Pengalaman Kerja & Operasional Ritel', 'Portofolio profesional saya berfokus pada **manajemen operasional ritel dan efisiensi kerja**. Saya memiliki pengalaman langsung mengelola rantai pasok dan pelayanan pelanggan di **Lingua / Tirta Abadi Utama**, serta memimpin administrasi dan pelaporan keuangan pada proyek lingkungan **BPSPAMS**. Melalui pengalaman ini, didukung kompetensi manajerial dari studi **Sarjana Manajemen STIE Wikara**, saya terbukti mampu mereduksi hambatan operasional dan meningkatkan kepuasan mitra kerja secara signifikan.

Dengan dukungan sertifikasi kompetensi di bidang **Bisnis dan Digital**, saya siap menerapkan strategi operasional yang lincah dan berorientasi data untuk mengoptimalkan kinerja divisi **[Posisi]** di **[Perusahaan]**.', 'Indonesia', '["Pengalaman Kerja", "Ritel", "Operasional"]'),
('tpl-6', 'Focus on Work Experience & Retail Operations', 'My professional portfolio is centered on **retail operations management and workflow optimization**. I have hands-on experience managing supply chain logistics and customer relations at **Lingua / Tirta Abadi Utama**, alongside administering project logistics for the **BPSPAMS program**. Guided by my business education in **Bachelor of Management from STIE Wikara**, I have a proven track record of reducing operational bottlenecks and driving partner satisfaction.

Holding a **Digital Business Competency Certificate**, I am fully equipped to bring agile, data-driven operational solutions to support the **[Posisi]** role at **[Perusahaan]**.', 'Inggris', '["Work Experience", "Retail", "Operations"]'),
('tpl-7', 'Management Trainee / Graduate Leader Program', 'Sebagai lulusan **Sarjana Manajemen dari STIE Wikara** dengan jiwa kepemimpinan tinggi selaku mantan **Presiden Mahasiswa**, saya sangat berambisi untuk bergabung dalam program **Management Trainee** di **[Perusahaan]**. Latar belakang akademis saya diperkuat oleh pengalaman lapangan mengelola operasional ritel di **Lingua / Tirta Abadi Utama** serta administrasi proyek **BPSPAMS**, yang membuktikan bahwa saya tidak hanya menguasai teori, tetapi juga andal dalam eksekusi taktis.

Dengan kepemilikan **Sertifikat Kompetensi Bisnis, Digital, dan Kepemimpinan**, saya memiliki kegesitan belajar (learning agility) yang tinggi untuk ditempatkan lintas divisi. Saya siap mendedikasikan potensi terbaik saya untuk tumbuh dan berkontribusi jangka panjang bagi **[Perusahaan]** sebagai **[Posisi]**.', 'Indonesia', '["MT", "Graduate Leader"]'),
('tpl-8', 'Management Trainee / Future Leaders Program', 'As a **Bachelor of Management from STIE Wikara** with stellar leadership credentials as the former **President of the Student Executive Board (Presma)**, I am highly driven to join the **Management Trainee program** at **[Perusahaan]**. My academic excellence is balanced by solid hands-on experience in retail operations at **Lingua / Tirta Abadi Utama** and administrative governance at **BPSPAMS**, proving my capability to transition smoothly from strategy to execution.

Armed with **Leadership & Digital Business certificates**, I possess high learning agility and cross-functional adaptability. I am eager to contribute fresh strategic perspectives and a strong work ethic to **[Perusahaan]** as a **[Posisi]**.', 'Inggris', '["MT", "Future Leaders"]'),
('tpl-9', 'Hubungan Masyarakat, Publik & Kemitraan', 'Dengan kombinasi keahlian sebagai **Duta GenRe Kabupaten Purwakarta** dan pemegang **Sertifikat Kompetensi Public Speaking**, saya melamar untuk posisi **[Posisi]** di **[Perusahaan]**. Keahlian komunikasi strategis saya terasah nyata melalui peran eksternal di **Aliansi BEM Purwakarta** serta koordinasi kemitraan publik pada proyek **BPSPAMS**. Saya mahir dalam mengelola pesan komunikasi publik, menjalin relasi media, serta membangun citra positif organisasi.

Didukung oleh landasan keilmuan **Sarjana Manajemen dari STIE Wikara**, saya memiliki pendekatan yang sistematis dan berorientasi bisnis dalam merancang strategi kehumasan. Saya yakin dapat memperkuat reputasi dan hubungan kemitraan strategis **[Perusahaan]**.', 'Indonesia', '["Humas", "Public Relations", "PR"]'),
('tpl-10', 'Public Relations, Communication & Partnerships', 'Leveraging my background as the **Duta GenRe (Ambassador) of Purwakarta Regency** and my **Public Speaking Competency Certificate**, I am writing to apply for the **[Posisi]** role at **[Perusahaan]**. My communication skills were honed through managing external stakeholder relations for the **Purwakarta Student Alliance** and coordinating public partnerships for **BPSPAMS**. I excel in public speaking, message crafting, and building long-term organizational trust.

With a structured business mindset from my **Bachelor of Management from STIE Wikara**, I bring a strategic approach to public relations. I am highly confident in my ability to enhance stakeholder engagement and public trust for **[Perusahaan]**.', 'Inggris', '["PR", "Communication", "Partnerships"]'),
('tpl-11', 'Administrasi Operasional & Manajemen Kantor', 'Sebagai lulusan **Sarjana Manajemen dari STIE Wikara** dengan penguasaan mendalam dalam tata kelola administrasi, saya bermaksud mengajukan diri untuk posisi **[Posisi]** di **[Perusahaan]**. Pengalaman saya memimpin administrasi kegiatan mahasiswa selaku **Presiden Mahasiswa** serta mengelola pelaporan dan logistik keuangan pada program **BPSPAMS** menjamin ketelitian tinggi, keteraturan berkas, dan efisiensi koordinasi harian.

Didukung oleh **Sertifikat Kompetensi Akademik**, saya sangat terbiasa menggunakan instrumen digital untuk manajemen data operasional. Saya berkomitmen penuh untuk menjaga kelancaran operasional harian kantor di **[Perusahaan]** dengan etos kerja yang disiplin dan andal.', 'Indonesia', '["Administrasi", "Office Management"]'),
('tpl-12', 'Office Administration & Operational Support', 'With a solid academic background in **Bachelor of Management from STIE Wikara** and extensive organizational governance experience, I am applying for the **[Posisi]** role at **[Perusahaan]**. My expertise in document control, budget tracking, and scheduling was developed during my tenure as **President of the Student Executive Board** and through handling operational logs for **BPSPAMS** and **Lingua / Tirta Abadi Utama**.

Equipped with an **Academic Competency Certificate**, I am highly proficient in digital administration tools and administrative database management. I am committed to supporting the daily office efficiency and operational workflow of **[Perusahaan]**.', 'Inggris', '["Office Administration", "Operational Support"]'),
('tpl-13', 'Fokus Digital Marketing & Pemasaran', 'Sebagai lulusan **Sarjana Manajemen dari STIE Wikara** yang memiliki minat besar dan pengalaman lapangan di bidang pemasaran, saya mengajukan diri untuk posisi **[Posisi]** di **[Perusahaan]**. Berbekal pengalaman dalam pemasaran lapangan dan pemahaman kuat terhadap perilaku konsumen, saya mahir dalam merancang strategi akuisisi audiens, membangun kesadaran merek (brand awareness), serta mengoptimalkan kampanye yang berorientasi pada data dan hasil nyata.

Dengan sertifikasi kompetensi di bidang **Bisnis dan Digital**, pemahaman manajerial yang solid, serta kreativitas yang terasah melalui kepemimpinan kemahasiswaan, saya siap membantu meningkatkan metrik konversi dan visibilitas digital **[Perusahaan]**.', 'Indonesia', '["Digital Marketing", "Pemasaran"]'),
('tpl-14', 'Focus on Digital Marketing & Growth', 'As a **Bachelor of Management from STIE Wikara** with a profound passion and hands-on experience in marketing operations, I am writing to express my interest in the **[Posisi]** role at **[Perusahaan]**. Equipped with a robust background in field marketing and consumer behavior analysis, I am highly capable of designing audience acquisition strategies, driving brand awareness, and optimizing data-driven campaigns for tangible growth.

Holding a **Digital Business Competency Certificate** alongside a solid managerial foundation and creativity honed through leadership roles, I am eager to contribute to boosting digital visibility and conversion metrics for **[Perusahaan]**.', 'Inggris', '["Digital Marketing", "Growth"]');

-- Seeding data for Table: email_sender
DELETE FROM email_sender;

INSERT INTO email_sender (
    id, target_email, company_name, position_name, subject, body, status, addressed_to, attached_files, created_at,
    include_perihal, include_lampiran_awal, include_daftar_lampiran, include_bio,
    cv_option, cv_ats_option, portofolio_option, paklaring_option, sertifikat_kompetensi_akademik_option, sertifikat_kompetensi_bisnis_digital_option, sertifikat_kompetensi_kepemimpinan_option, sertifikat_kompetensi_public_speaking_option, sertifikat_prestasi_option, ijazah_option,
    header_bg_color, header_text_color, body_font_family, email_format, paragraph_align, is_subject_auto, custom_subject, merge_attachments
) VALUES 
(
    'job-1',
    'hrd@konicaminolta.co.id',
    'Konica Minolta Indonesia',
    'Business Development Specialist',
    'Lamaran Pekerjaan - Business Development Specialist - Alvareza Hilka Pratama',
    'Melalui email ini saya bermaksud mengajukan diri untuk bergabung di Konica Minolta Indonesia pada posisi Business Development Specialist. Dengan latar belakang pendidikan Manajemen dari STIE Wikara serta pengalaman memimpin organisasi kemahasiswaan...',
    'terkirim',
    'Bapak Rian Hermawan (HR Manager)',
    'CV, Paklaring, Sertifikat',
    '2026-06-15 09:30:00',
    0, 0, 0, 0, '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'justify', 0, '', 0
),
(
    'job-2',
    'recruitment@shopee.co.id',
    'Shopee Indonesia',
    'Operations Associate',
    'Application for Operations Associate - Alvareza Hilka Pratama',
    'Dear Hiring Team, I am writing to express my strong interest in the Operations Associate position at Shopee Indonesia. My background as President of Student Executive Board at STIE Wikara has provided me with exceptional operational coordination and project management skills...',
    'terkirim',
    'Ibu Shinta Bella (Talent Acquisition Specialist)',
    'CV, Sertifikat, Ijazah',
    '2026-06-20 14:45:00',
    0, 0, 0, 0, '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'justify', 0, '', 0
),
(
    'job-3',
    'kerjasama@jabarprov.go.id',
    'Pemerintah Provinsi Jawa Barat',
    'Project Coordinator (Stand Up Comedy Event)',
    'Pengajuan Proposal Kerjasama Penyelenggaraan Stand Up Comedy Regional Jawa Barat',
    'Dengan hormat, sehubungan dengan rencana pengembangan kreativitas pemuda di bidang seni komedi tunggal, kami mengajukan proposal kerjasama pelaksanaan event Stand Up Comedy Piala Gubernur Jawa Barat...',
    'terkirim',
    'Bapak Dr. H. Setiawan Wangsaatmaja (Sekretaris Daerah Jabar)',
    'CV, Sertifikat, Proposal Kerjasama',
    '2026-05-10 10:15:00',
    0, 0, 0, 0, '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'justify', 0, '', 0
),
(
    'job-4',
    'dutagenre@purwakartakab.go.id',
    'DPPKB Purwakarta',
    'Program Ambassador (Duta Genre)',
    'Pendaftaran Calon Duta GenRe Kabupaten Purwakarta',
    'Dengan hormat, saya Alvareza Hilka Pratama, mahasiswa Manajemen STIE Wikara. Melalui surat ini, saya mendaftarkan diri sebagai peserta seleksi Duta GenRe Kabupaten Purwakarta dengan komitmen mengedukasi remaja...',
    'terkirim',
    'Ibu Dra. H. Yayat Hidayat (Kepala DPPKB Purwakarta)',
    'CV, Ijazah, Sertifikat Prestasi',
    '2025-02-18 08:00:00',
    0, 0, 0, 0, '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'justify', 0, '', 0
),
(
    'draft-sample-1',
    'hrd@company.co.id',
    'PT Global Inovasi',
    'Operational Manager',
    'Lamaran Pekerjaan - Operational Manager - Alvareza Hilka Pratama',
    'Yth. Bapak/Ibu HRD PT Global Inovasi,\n\nMelalui email ini saya ingin menyampaikan ketertarikan saya untuk melamar posisi Operational Manager di PT Global Inovasi.\n\nSaya merupakan lulusan program studi Manajemen dari STIE Wikara dengan fokus pengembangan keterampilan di bidang operasional, manajemen kemitraan, dan kepemimpinan. Selama masa studi, saya aktif memimpin sebagai Presiden Mahasiswa serta terlibat dalam inisiatif strategis tingkat daerah seperti Aliansi BEM Purwakarta. Selain rekam jejak akademis dan organisasi, saya juga memiliki pengalaman profesional yang relevan dalam operasional bisnis dan penyelesaian proyek di lingkungan kerja nyata.\n\nKemampuan komunikasi saya yang kuat, dikombinasikan with etos kerja tinggi dan kapasitas adaptasi yang baik, memungkinkan saya untuk mengkoordinasikan tim lintas divisi serta menyelesaikan tantangan kerja secara efisien. Saya meyakini bahwa latar belakang dan keterampilan saya selaras dengan kebutuhan PT Global Inovasi untuk posisi Operational Manager.\n\nAtas perhatian dan waktu Bapak/Ibu, saya ucapkan terima kasih.\n\nHormat saya,\nAlvareza Hilka Pratama',
    'draft',
    '',
    '',
    '2026-07-11T13:00:00Z',
    1,
    1,
    1,
    1,
    'default',
    'default',
    'default',
    'default',
    'default',
    'default',
    'default',
    'default',
    'default',
    'default',
    '#1e293b',
    '#ffffff',
    'Arial, sans-serif',
    'formal',
    'justify',
    1,
    'Lamaran Pekerjaan - Operational Manager - Alvareza Hilka Pratama',
    0
);

-- Seeding data for Table: email_template
-- Seed data for email_template
DROP TABLE IF EXISTS email_template;
CREATE TABLE IF NOT EXISTS email_template (
    id TEXT PRIMARY KEY,
    jenis TEXT NOT NULL,
    html TEXT NOT NULL
);

INSERT INTO email_template (id, jenis, html) VALUES
('otp', 'Verifikasi OTP', '<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kode OTP Verifikasi Keamanan</title>
  <style>
    body { font-family: ''Segoe UI'', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #1e293b; margin: 0; padding: 0; background-color: #f8fafc; }
    .container { max-width: 500px; margin: 40px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; }
    .header { background-color: #0f172a; color: #ffffff; padding: 32px 24px; text-align: center; }
    .header .shield-icon { font-size: 40px; margin-bottom: 12px; display: block; }
    .header h1 { margin: 0; font-size: 20px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase; color: #f8fafc; }
    .content { padding: 40px 32px; font-size: 15px; color: #334155; }
    .greeting { font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 16px; }
    .desc { margin-bottom: 24px; color: #475569; }
    .otp-container { text-align: center; margin: 32px 0; }
    .otp-card { display: inline-block; background-color: #f1f5f9; border: 2px dashed #cbd5e1; border-radius: 12px; padding: 16px 32px; }
    .otp-code { font-family: ''Courier New'', Courier, monospace; font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #02227E; margin: 0; }
    .warning-box { background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 16px; border-radius: 8px; margin-top: 32px; font-size: 13px; color: #991b1b; }
    .warning-box p { margin: 0; }
    .footer { background-color: #f1f5f9; padding: 24px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; }
    .footer p { margin: 4px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <span class="shield-icon">🛡️</span>
      <h1>Verifikasi Keamanan</h1>
    </div>
    <div class="content">
      <div class="greeting">Halo Administrator,</div>
      <p class="desc">Seseorang mencoba mengakses Dashboard Admin menggunakan fitur Lupa Kata Sandi. Guna melanjutkan proses verifikasi identitas, silakan gunakan Kode Keamanan (OTP) berikut:</p>
      
      <div class="otp-container">
        <div class="otp-card">
          <div class="otp-code">{{OTP_CODE}}</div>
        </div>
      </div>
      
      <p class="desc" style="font-size: 14px; color: #64748b;">Kode OTP di atas hanya berlaku untuk sesi login saat ini dan bersifat sangat rahasia.</p>
      
      <div class="warning-box">
        <p><strong>PENTING:</strong> Demi keamanan akun Anda, harap jangan membagikan kode verifikasi ini kepada siapapun termasuk pihak yang mengaku sebagai teknisi atau sistem pengelola.</p>
      </div>
    </div>
    <div class="footer">
      <p style="font-weight: 700; color: #475569;">Sistem Otentikasi Dashboard Admin</p>
      <p>Email ini dihasilkan secara otomatis. Mohon tidak membalas email ini.</p>
    </div>
  </div>
</body>
</html>
'),
('formal', 'Surat Lamaran Kerja - Formal', '<!DOCTYPE html><html><head><meta charset="UTF-8"><style>body { font-family: Arial, sans-serif !important; background: #ffffff; color: #000000; margin: 0; padding: 20px; } .container { max-width: 800px; margin: 0 auto; line-height: 1.6; font-size: 15px; } table { font-family: Arial, sans-serif !important; } .kop-surat { text-align: center; margin-bottom: 30px; } .kop-surat h1 { margin: 0; font-size: 22px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; } .kop-garis-tebal { margin-top: 15px; margin-bottom: 2px; border: 0; border-top: 3px solid #000; } .kop-garis-tipis { margin-top: 0; margin-bottom: 25px; border: 0; border-top: 1px solid #000; }</style></head><body><div class="container"><div class="kop-surat"><h1>SURAT LAMARAN KERJA</h1><hr class="kop-garis-tebal" /><hr class="kop-garis-tipis" /></div>{{BODY_CONTENT}}</div></body></html>'),
('surat-lamaran', 'Surat Lamaran Kerja', '<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: ''Arial'', sans-serif; line-height: 1.6; color: #333333; margin: 0; padding: 0; background-color: #f9fafb; }
    .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #e5e7eb; }
    .header { background-color: #02227E; color: #ffffff; padding: 24px; text-align: center; }
    .header h1 { margin: 0; font-size: 20px; font-weight: 600; letter-spacing: 0.5px; }
    .content { padding: 32px 32px; font-size: 15px; color: #374151; text-align: justify; }
    .footer { background-color: #f8fafc; padding: 24px 32px; text-align: center; border-top: 1px solid #e5e7eb; font-size: 13px; color: #64748b; }
    .social-icon { display: inline-block; margin: 0 12px; opacity: 0.6; text-decoration: none; }
    .social-icon img { width: 22px; height: 22px; border: 0; }
    .date-text { text-align: right; margin-bottom: 24px; font-size: 14px; color: #64748b; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header" style="background: linear-gradient(135deg, #02227E 0%, #0439b5 100%); padding: 32px 24px; text-align: center; border-bottom: 4px solid #facc15;">       <h1 style="margin: 0; font-size: 28px; font-weight: 800; color: #ffffff; letter-spacing: 1px; text-transform: uppercase; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">Surat Lamaran Kerja</h1>     </div>
    <div class="content">
      <div class="date-text">
        {{DATE_NOW}}
      </div>
      {{BODY_CONTENT}}
      
      <div style="text-align: center; margin-top: 40px; margin-bottom: 10px;">
        <a href="https://www.alvareza.my.id/" style="display: inline-block; text-decoration: none; border: 1px solid #e2e8f0; border-radius: 50px; padding: 6px 20px 6px 6px; background-color: #ffffff;">
          <table cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td valign="middle" style="padding-right: 14px; border-right: 1px solid #e2e8f0;">
                <img src="https://www.alvareza.my.id/gambar/profil.png" alt="Profile" style="width: 46px; height: 46px; border-radius: 50%; display: block; object-fit: cover;" />
              </td>
              <td valign="middle" style="padding-left: 14px;">
                <div style="font-size: 15px; font-weight: 700; color: #0f172a; font-family: ''Arial'', sans-serif; line-height: 1.2;">Alvareza Hilka Pratama</div>
                <div style="font-size: 13px; font-weight: 400; color: #64748b; margin-top: 4px; font-family: ''Arial'', sans-serif; line-height: 1;">
                  Lihat Portofolio <span style="font-size: 12px; margin-left: 2px;">&#10095;</span>
                </div>
              </td>
            </tr>
          </table>
        </a>
      </div>
    </div>
    <div class="footer">
      <p style="margin-top: 0; margin-bottom: 4px; font-size: 13px; font-weight: 500; color: #64748b;">Email ini dikirim melalui sistem portofolio terintegrasi</p>
      <p style="margin-top: 0; margin-bottom: 16px; font-size: 13px;"><a href="https://www.alvareza.my.id" style="color: #02227E; text-decoration: none; font-weight: 600;">www.alvareza.my.id</a></p>
      <div>
        <a href="https://wa.me/6285797184059" class="social-icon">
          <img src="https://img.icons8.com/color/96/whatsapp.png" alt="WhatsApp" />
        </a>
        <a href="mailto:alvareza.work@gmail.com" class="social-icon">
          <img src="https://img.icons8.com/color/96/gmail-new.png" alt="Email" />
        </a>
        <a href="https://instagram.com/varezza_" class="social-icon">
          <img src="https://img.icons8.com/color/96/instagram-new.png" alt="Instagram" />
        </a>
      </div>
    </div>
  </div>
</body>
</html>
');

-- 16. Rekruter Table
DROP TABLE IF EXISTS rekruter;
CREATE TABLE IF NOT EXISTS rekruter (
    id TEXT PRIMARY KEY,
    nama TEXT,
    jabatan TEXT,
    perusahaan TEXT,
    posisi TEXT,
    whatsapp TEXT,
    catatan TEXT,
    gender TEXT
);

DELETE FROM rekruter;

INSERT INTO rekruter (id, nama, jabatan, perusahaan, posisi, whatsapp, catatan, gender) VALUES
(
    'rec-1',
    'Budi Santoso',
    'HR Manager',
    'PT Global Tech',
    'Frontend Developer',
    '6281234567890',
    'Lowongan aktif hingga akhir bulan ini. Membutuhkan React developer.',
    'pria'
),
(
    'rec-2',
    'Siti Rahma',
    'Recruiter',
    'CV Kreatif Digital',
    'Social Media Specialist',
    '628987654321',
    'Sangat menyukai portofolio desain visual.',
    'wanita'
);

