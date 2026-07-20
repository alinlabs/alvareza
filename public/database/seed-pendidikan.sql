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
