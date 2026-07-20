-- SQLite Database Schema for Alvareza Hilka Pratama CV & Portfolio

-- Drop old tables if they exist to apply new schema changes
DROP TABLE IF EXISTS keahlian_kategori;
DROP TABLE IF EXISTS keahlian;
DROP TABLE IF EXISTS profil;
DROP TABLE IF EXISTS kejuaraan;
DROP TABLE IF EXISTS pelatihan;
DROP TABLE IF EXISTS pencapaian;
DROP TABLE IF EXISTS pendidikan;
DROP TABLE IF EXISTS pengalaman_kerjasama;
DROP TABLE IF EXISTS pengalaman_organisasi;
DROP TABLE IF EXISTS pengalaman_profesi;
DROP TABLE IF EXISTS portofolio;
DROP TABLE IF EXISTS cover_letter_templates;
DROP TABLE IF EXISTS job_applications;
DROP TABLE IF EXISTS email_drafts;
DROP TABLE IF EXISTS email_sender;

-- 1. Profil Table
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

-- 2. Keahlian Table
CREATE TABLE IF NOT EXISTS keahlian (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    kategori TEXT NOT NULL,
    bidang TEXT NOT NULL,
    persentase INTEGER CHECK (persentase >= 0 AND persentase <= 100),
    deskripsi TEXT,
    penguasaan TEXT
);

-- 4. Kejuaraan Table
CREATE TABLE IF NOT EXISTS kejuaraan (
    id TEXT PRIMARY KEY,
    tingkat TEXT,
    judul TEXT NOT NULL,
    penerbit TEXT,
    deskripsi TEXT,
    tahun TEXT,
    sertifikat TEXT
);

-- 5. Pelatihan Table
CREATE TABLE IF NOT EXISTS pelatihan (
    id TEXT PRIMARY KEY,
    judul TEXT NOT NULL,
    penyelenggara TEXT,
    deskripsi TEXT,
    hasil TEXT,
    tahun TEXT,
    sertifikat TEXT
);

-- 6. Pencapaian Table
CREATE TABLE IF NOT EXISTS pencapaian (
    id TEXT PRIMARY KEY,
    tingkat TEXT,
    judul TEXT NOT NULL,
    penerbit TEXT,
    deskripsi TEXT,
    kategori TEXT,
    tahun TEXT,
    sertifikat TEXT
);

-- 7. Pendidikan Table
CREATE TABLE IF NOT EXISTS pendidikan (
    id TEXT PRIMARY KEY,
    gelar TEXT NOT NULL,
    institusi TEXT NOT NULL,
    tahun_masuk TEXT,
    tahun_lulus TEXT,
    deskripsi TEXT,
    logo_url TEXT,
    sertifikat TEXT
);

-- 8. Pengalaman Kerjasama Table
CREATE TABLE IF NOT EXISTS pengalaman_kerjasama (
    id TEXT PRIMARY KEY,
    partner TEXT NOT NULL,
    peran TEXT,
    proyek TEXT,
    mulai TEXT,
    selesai TEXT,
    bidang TEXT,
    deskripsi TEXT,
    tujuan TEXT,
    dampak TEXT,
    logo_url TEXT,
    paklaring TEXT
);

-- 9. Pengalaman Organisasi Table
CREATE TABLE IF NOT EXISTS pengalaman_organisasi (
    id TEXT PRIMARY KEY,
    peran TEXT NOT NULL,
    organisasi TEXT NOT NULL,
    logo_url TEXT,
    mulai TEXT,
    selesai TEXT,
    deskripsi TEXT,
    pencapaian TEXT
);

-- 10. Pengalaman Profesi Table
CREATE TABLE IF NOT EXISTS pengalaman_profesi (
    id TEXT PRIMARY KEY,
    logo_url TEXT,
    paklaring TEXT,
    peran TEXT NOT NULL,
    tingkatan TEXT,
    perusahaan TEXT NOT NULL,
    mulai TEXT,
    selesai TEXT,
    industri TEXT,
    deskripsi TEXT,
    spesialisasi TEXT,
    tugas_tanggung_jawab TEXT,
    ringkasan TEXT
);

-- 11. Portofolio Table
CREATE TABLE IF NOT EXISTS portofolio (
    id TEXT PRIMARY KEY,
    judul TEXT NOT NULL,
    kategori TEXT,
    deskripsi TEXT,
    teknologi TEXT,
    gambar TEXT,
    link TEXT,
    tanggal TEXT,
    fitur TEXT
);

-- 12. Cover Letter Templates Table
CREATE TABLE IF NOT EXISTS cover_letter_templates (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    body TEXT NOT NULL,
    bahasa TEXT,
    rekomendasi TEXT
);

-- 13. Email Sender Table (Draft & Tracker)
CREATE TABLE IF NOT EXISTS email_sender (
    id TEXT PRIMARY KEY,
    target_email TEXT,
    company_name TEXT,
    position_name TEXT,
    subject TEXT,
    body TEXT,
    status TEXT, -- 'draft' or 'terkirim'
    addressed_to TEXT,
    attached_files TEXT,
    created_at TEXT,
    include_perihal BOOLEAN,
    include_lampiran_awal BOOLEAN,
    include_daftar_lampiran BOOLEAN,
    include_bio BOOLEAN,
    cv_option TEXT,
    cv_ats_option TEXT,
    portofolio_option TEXT,
    paklaring_option TEXT,
    sertifikat_kompetensi_akademik_option TEXT,
    sertifikat_kompetensi_bisnis_digital_option TEXT,
    sertifikat_kompetensi_kepemimpinan_option TEXT,
    sertifikat_kompetensi_public_speaking_option TEXT,
    sertifikat_prestasi_option TEXT,
    ijazah_option TEXT,
    header_bg_color TEXT,
    header_text_color TEXT,
    body_font_family TEXT,
    email_format TEXT,
    paragraph_align TEXT,
    is_subject_auto BOOLEAN,
    custom_subject TEXT,
    merge_attachments BOOLEAN
);

-- 15. Email Template Table
CREATE TABLE IF NOT EXISTS email_template (
    id TEXT PRIMARY KEY,
    jenis TEXT NOT NULL,
    html TEXT NOT NULL
);

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

