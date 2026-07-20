-- Seeding data for Table: pengalaman_organisasi
DELETE FROM pengalaman_organisasi;

INSERT INTO pengalaman_organisasi (id, peran, organisasi, logo_url, periode, deskripsi, pencapaian) VALUES
(
    'org-10',
    'Presiden Mahasiswa',
    'STIE Wikara',
    '/gambar/logo/bem.png',
    '{"masuk": "2024", "keluar": ""}',
    'Menjabat sebagai Presiden Mahasiswa, memimpin jalannya organisasi eksekutif kemahasiswaan tingkat kampus.',
    '["Memimpin program digitalisasi administrasi kemahasiswaan kampus.", "Menginisiasi pembentukan Forum Kewirausahaan Mahasiswa guna meningkatkan kemandirian finansial ormawa.", "Menyelenggarakan bakti sosial dan seminar kepemimpinan tingkat regional Jawa Barat."]'
),
(
    'org-1',
    'Ketua Divisi Mitra Strategis Dan Sponsor',
    'Edufest Purwakarta',
    '/gambar/logo/edufest.png',
    '{"masuk": "2024", "keluar": ""}',
    'Mengelola hubungan kemitraan strategis dan pencarian sponsor untuk acara.',
    '["Menjalin kemitraan dengan 15+ korporasi lokal dan instansi pemerintah daerah.", "Mengamankan dana sponsorship senilai puluhan juta rupiah, melampaui target awal sebesar 120%."]'
),
(
    'org-20',
    'Kastrat. Ekonomi',
    'Aliansi BEM Purwakarta',
    '/gambar/logo/aliansi.png',
    '{"masuk": "", "keluar": ""}',
    'Mengkaji, mengevaluasi, serta mengamati perkembangan ekonomi di wilayah Purwakarta.',
    '["Menyusun kajian strategis terkait evaluasi dampak kebijakan ekonomi mikro bagi pedagang kaki lima di Purwakarta.", "Menyelenggarakan audiensi publik bersama Dinas Koperasi dan UMKM Purwakarta."]'
),
(
    'org-9',
    'Ketua Divisi Edukasi Bisnis',
    'UKM Kewirausahaan',
    '/gambar/logo/kewirausahaan.png',
    '{"masuk": "", "keluar": ""}',
    'Memberikan edukasi terkait pengembangan bisnis bagi anggota.',
    '["Menyelenggarakan program Inkubator Bisnis Mahasiswa yang diikuti oleh lebih dari 50 peserta aktif.", "Melatih dan mendampingi kelompok usaha mahasiswa dalam menyusun perencanaan bisnis (business plan)."]'
),
(
    'org-16',
    'KADIV. Kaderisasi',
    'Himpunan Mahasiswa Manajemen STIE Wikara',
    '/gambar/logo/himamen.png',
    '{"masuk": "", "keluar": ""}',
    'Mengelola kaderisasi dan pengembangan anggota himpunan.',
    '["Mendesain kurikulum Latihan Kepemimpinan Mahasiswa Manajemen (LKMM) yang adaptif dan interaktif.", "Meningkatkan antusiasme dan angka retensi keanggotaan aktif baru sebesar 15%."]'
),
(
    'org-14',
    'KADIV. SDM',
    'UKESTRA (Unit Kegiatan Mahasiswa Kesenian dan Sastra STIE Wikara)',
    '/gambar/logo/ukestra.png',
    '{"masuk": "2023", "keluar": ""}',
    'Berperan aktif dalam kegiatan kesenian dan sastra.',
    '["Mengkoordinasikan pengembangan bakat internal anggota dan menyelenggarakan pementasan tahunan.", "Membangun modul pelatihan keaktoran dan kepenulisan kreatif dasar bagi anggota baru."]'
),
(
    'org-7',
    'Duta Genre',
    'DPPKB',
    '/gambar/logo/genre.png',
    '{"masuk": "", "keluar": ""}',
    'Menjadi representasi program Generasi Berencana.',
    '["Melakukan sosialisasi tentang pentingnya kesehatan reproduksi dan perencanaan masa depan bagi remaja sekolah.", "Mewakili daerah dalam forum pertukaran program duta Genre tingkat kabupaten."]'
),
(
    'org-17',
    'Anggota',
    'Paskibra SMK Negeri Kiarapedes',
    '/gambar/logo/paskibra.png',
    '{"masuk": "", "keluar": ""}',
    'Berpartisipasi aktif dalam kegiatan baris-berbaris dan pengibaran bendera.',
    '["Menjadi bagian dari tim pengibar bendera utama dalam peringatan HUT RI tingkat kecamatan."]'
),
(
    'org-18',
    'Anggota',
    'Paskibra SMP 1 Negeri Kiarapedes',
    '/gambar/logo/paskibra.png',
    '{"masuk": "", "keluar": ""}',
    'Berpartisipasi aktif dalam kegiatan baris-berbaris dan pengibaran bendera.',
    '["Mendukung kelancaran upacara rutin dan hari-hari besar kenegaraan di lingkungan sekolah."]'
),
(
    'org-19',
    'Anggota',
    'Pramuka SMP 1 Cilengkrang',
    '/gambar/logo/pramuka.png',
    '{"masuk": "", "keluar": ""}',
    'Berpartisipasi dalam kegiatan kepramukaan.',
    '["Berpartisipasi aktif dalam kegiatan Jambore Ranting dan penjelajahan alam."]'
);
