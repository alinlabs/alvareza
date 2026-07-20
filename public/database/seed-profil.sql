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
