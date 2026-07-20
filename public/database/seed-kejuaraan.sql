-- Seeding data for Table: kejuaraan
DELETE FROM kejuaraan;

INSERT INTO kejuaraan (id, tingkat, judul, penerbit, deskripsi, tahun, sertifikat) VALUES
('ach-5', 'Tingkat Kabupaten', 'Winner Duta Genre Kab. Purwakarta', 'Kabupaten Purwakarta', 'Memenangkan kompetisi Duta Genre tingkat kabupaten.', '2025', '/gambar/sertifikat/prestasi1.webp'),
('ach-20', 'Tingkat Kabupaten', 'Winner Duta Generasi Berencana Purwakarta', 'Kabupaten Purwakarta', 'Memenangkan kompetisi Duta Generasi Berencana.', '2023', ''),
('ach-24', 'Tingkat Kabupaten', 'Juara 1 Lomba Pidato Tingkat SMK', 'Penyelenggara Lomba', 'Meraih Juara 1 dalam kompetisi Lomba Pidato tingkat SMK.', '2019', '/gambar/sertifikat/prestasi3.webp'),
('ach-23', 'Tingkat Kabupaten', 'Juara 2 Lomba Pidato Tingkat SMK', 'Penyelenggara Lomba', 'Meraih Juara 2 dalam ajang Lomba Pidato bergengsi tingkat SMK.', '2019', '/gambar/sertifikat/prestasi4.webp'),
('ach-21', 'Tingkat Kabupaten', 'Juara Harapan 2 Lomba Pidato', 'Pemerintah Kabupaten Purwakarta', 'Meraih predikat Juara Harapan 2 dalam ajang perlombaan pidato tingkat Kabupaten.', '2019', '/gambar/sertifikat/prestasi5.webp'),
('ach-14', 'Tingkat Kampus', 'Juara 1 Sastra Puisi Porsa', 'Porsa', 'Memenangkan kompetisi sastra puisi.', '2023', '');
