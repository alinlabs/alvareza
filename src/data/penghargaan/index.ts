export interface AwardSignerInfo {
  nama_lengkap: string;
  jabatan: string;
  nip_nik_id?: string;
}

export interface AwardItemConfig {
  id: string;
  filename: string;
  title: string;
  issuer: string;
  year: string;
  date?: string; // Format ISO 'YYYY-MM-DD' untuk pengurutan kronologis presisi
  level?: string;
  category?: string;
  role?: string;
  certificateNumber?: string;
  signatureType?: 'SINGLE' | 'DUAL' | 'MULTI';
  isPortrait: boolean;
  description?: string;
  signers?: AwardSignerInfo[];
}

/**
 * Daftar Resmi Seluruh Piagam & Sertifikat Fisik Penghargaan Alvareza Hilka Pratama.
 * Terurut secara kronologis dari waktu TERBARU (Halaman 1) ke waktu TERLAMA (Halaman 19):
 * awd-1 s.d. awd-19
 */
export const ALL_AWARDS_LIST: AwardItemConfig[] = [
  // ============================================================
  // AWD-1 | HALAMAN 1 (2025)
  // ============================================================
  {
    id: 'awd-1',
    filename: '2025-steering-committee-pkkmb.webp',
    title: 'Sertifikat Apresiasi Steering Committee PKKMB STIE Wikara 2025/2026',
    issuer: 'Sekolah Tinggi Ilmu Ekonomi Wibawa Karta Raharja',
    year: '2025',
    date: '2025-10-04',
    level: 'Kampus',
    category: 'Organisasi dan Kepemimpinan',
    role: 'Steering Committee PKKMB STIE Wikara',
    certificateNumber: '5-021/PKKMB/STIE-WIKARA/X/2025',
    signatureType: 'DUAL',
    isPortrait: false,
    description: 'Apresiasi atas dedikasi, komitmen, dan kontribusi sebagai Steering Committee PKKMB STIE Wikara Tahun Akademik 2025/2026 dalam kegiatan bertema Wikara Next Generation.',
    signers: [
      {
        nama_lengkap: 'Drs. H. Duki Adam, M.M.',
        jabatan: 'Ketua STIE Wikara',
        nip_nik_id: 'NIDN. 0405029404',
      },
      {
        nama_lengkap: 'Drs. Asep Gumelar, M.M.',
        jabatan: 'Kemahasiswaan',
        nip_nik_id: 'NIDN. 99401690',
      },
    ],
  },

  // ============================================================
  // AWD-2 | HALAMAN 2 (2025)
  // ============================================================
  {
    id: 'awd-2',
    filename: '2025-ketua-wsc-piala-gubernur.webp',
    title: 'Sertifikat Penghargaan Ketua Pelaksana Stand Up Comedy Champion Piala Gubernur Jawa Barat 2025',
    issuer: 'STIE Wibawa Karta Raharja dan Cabang Dinas Pendidikan Wilayah IV',
    year: '2025',
    date: '2025-08-31',
    level: 'Provinsi',
    category: 'Organisasi dan Kepemimpinan',
    role: 'Ketua Pelaksana',
    certificateNumber: '',
    signatureType: 'DUAL',
    isPortrait: false,
    description: 'Penghargaan atas peran sebagai Ketua Pelaksana dalam kompetisi Stand Up Comedy Champion Piala Gubernur Jawa Barat 2025 yang diselenggarakan dalam rangka Dies Natalis STIE Wibawa Karta Raharja ke-25 tingkat SMA/SMK se-Jawa Barat Wilayah IV.',
    signers: [
      {
        nama_lengkap: 'Riesye Silvana, S.STP., M.A.P.',
        jabatan: 'Kepala CADISDIK Wilayah IV',
        nip_nik_id: 'NIP. 198501312003122001',
      },
      {
        nama_lengkap: 'Drs. H. Duki Adam, M.M.',
        jabatan: 'Ketua STIE Wikara',
        nip_nik_id: 'NIDN. 0414066202',
      },
    ],
  },

  // ============================================================
  // AWD-3 | HALAMAN 3 (2025 / Periode 2025-2026)
  // ============================================================
  {
    id: 'awd-3',
    filename: '2025-ketua-bem.webp',
    title: 'Sertifikat Penghargaan Ketua Badan Eksekutif Mahasiswa STIE Wikara Periode 2025/2026',
    issuer: 'Sekolah Tinggi Ilmu Ekonomi Wibawa Karta Raharja',
    year: '2025',
    date: '2025-08-15',
    level: 'Kampus',
    category: 'Organisasi dan Kepemimpinan',
    role: 'Ketua Badan Eksekutif Mahasiswa',
    certificateNumber: '6-034/ORMAWA/WKR/X/2025',
    signatureType: 'DUAL',
    isPortrait: true,
    description: 'Penghargaan atas pencapaian sebagai Ketua Badan Eksekutif Mahasiswa STIE Wikara periode 2025/2026.',
    signers: [
      {
        nama_lengkap: 'Drs. H. Duki Adam, M.M.',
        jabatan: 'Ketua STIE Wikara',
        nip_nik_id: 'NIDN. 0405029404',
      },
      {
        nama_lengkap: 'Drs. A. Gumelar, M.Si.',
        jabatan: 'Kemahasiswaan',
        nip_nik_id: 'NIDN. 99401690',
      },
    ],
  },

  // ============================================================
  // AWD-4 | HALAMAN 4 (2025)
  // ============================================================
  {
    id: 'awd-4',
    filename: '2025-director-film.webp',
    title: 'Sertifikat Penghargaan Director Film Tak Kasat - Misteri Gunung Hejo',
    issuer: 'STIE Wibawa Karta Raharja',
    year: '2025',
    date: '2025-08-05',
    level: 'Kampus',
    category: 'Kreativitas dan Produksi Film',
    role: 'Director',
    certificateNumber: '',
    signatureType: 'SINGLE',
    isPortrait: false,
    description: 'Apresiasi atas kontribusi sebagai Director pembuatan film Tak Kasat - Misteri Gunung Hejo dalam rangka KPPM STIE Wikara di Desa Gunung Hejo, Purwakarta.',
    signers: [
      {
        nama_lengkap: 'Eddy Junaedi, S.E., M.M.',
        jabatan: 'Pejabat Penandatangan Sertifikat',
        nip_nik_id: 'NIDN. 7462748649130082',
      },
    ],
  },

  // ============================================================
  // AWD-5 | HALAMAN 5 (2025)
  // ============================================================
  {
    id: 'awd-5',
    filename: '2025-pemateri-edufest.webp',
    title: 'Sertifikat Apresiasi dan Penghargaan Pemateri Edufest Purwakarta 2025',
    issuer: 'Saduta Foundation',
    year: '2025',
    date: '2025-04-01',
    level: 'Kabupaten/Kota',
    category: 'Pendidikan dan Pengembangan Pengetahuan',
    role: 'Pemateri',
    certificateNumber: '',
    signatureType: 'DUAL',
    isPortrait: true,
    description: 'Apresiasi atas dedikasi dan kontribusi sebagai Pemateri dalam kegiatan Pengenalan Program Studi Manajemen pada Edukasi Festival Kabupaten Purwakarta Tahun 2025.',
    signers: [
      {
        nama_lengkap: 'Fadjrin Diraja Muhammad',
        jabatan: 'Ketua Yayasan Saduta Foundation',
      },
      {
        nama_lengkap: 'Diki Ramdani Hermawan',
        jabatan: 'Ketua Yayasan Saduta Foundation',
      },
    ],
  },

  // ============================================================
  // AWD-6 | HALAMAN 6 (2024)
  // ============================================================
  {
    id: 'awd-6',
    filename: '2024-mc-porsa.webp',
    title: 'Sertifikat Apresiasi Master of Ceremony Pekan Olahraga Mahasiswa (PORSA) 2024',
    issuer: 'STIE Wibawa Karta Raharja',
    year: '2024',
    date: '2024-07-08',
    level: 'Kampus',
    category: 'Komunikasi dan Acara',
    role: 'Master of Ceremony',
    certificateNumber: '',
    signatureType: 'DUAL',
    isPortrait: false,
    description: 'Apresiasi atas dedikasi dan kontribusi luar biasa sebagai Master of Ceremony pada acara Pekan Olahraga Mahasiswa (PORSA) yang diselenggarakan pada 8 Juli 2024 di STIE Wibawa Karta Raharja.',
    signers: [
      {
        nama_lengkap: 'Sopian Hidayat',
        jabatan: 'Ketua Pelaksana',
      },
      {
        nama_lengkap: 'M. Fadil Maulana',
        jabatan: 'Penanggung Jawab',
      },
    ],
  },

  // ============================================================
  // AWD-7 | HALAMAN 7 (2024)
  // ============================================================
  {
    id: 'awd-7',
    filename: '2024-seminar-fosta.webp',
    title: 'Sertifikat Apresiasi Pembicara Seminar Berani Jadi Beda FOSTA Purwakarta 2023',
    issuer: 'FOSTA Kabupaten Purwakarta',
    year: '2024',
    date: '2024-07-04',
    level: 'Kabupaten/Kota',
    category: 'Pendidikan dan Pengembangan Pengetahuan',
    role: 'Pembicara/Narasumber',
    certificateNumber: '',
    signatureType: 'SINGLE',
    isPortrait: false,
    description: 'Apresiasi atas kontribusi dan kesediaan menjadi Pembicara/Narasumber untuk berbagi ilmu dalam Seminar Berani Jadi Beda yang diselenggarakan oleh FOSTA Purwakarta.',
    signers: [
      {
        nama_lengkap: 'Dika Saputra',
        jabatan: 'Pembina FOSTA Kabupaten Purwakarta',
      },
    ],
  },

  // ============================================================
  // AWD-8 | HALAMAN 8 (2024)
  // ============================================================
  {
    id: 'awd-8',
    filename: '2024-pembicara-kwu.webp',
    title: 'Sertifikat Penghargaan Pembicara Mini Seminar Menggali Potensi Diri 2024',
    issuer: 'STIE Wibawa Karta Raharja',
    year: '2024',
    date: '2024-03-31',
    level: 'Kampus',
    category: 'Pendidikan dan Pengembangan Pengetahuan',
    role: 'Pembicara',
    certificateNumber: '0119/SF/KWU/4/III/2024',
    signatureType: 'SINGLE',
    isPortrait: false,
    description: 'Penghargaan atas kontribusi dan kesediaan berbagi ilmu sebagai Pembicara/Narasumber dalam Mini Seminar Menggali Potensi Diri yang diselenggarakan oleh UKM Kewirausahaan STIE Wikara pada 31 Maret 2024.',
    signers: [
      {
        nama_lengkap: 'Muhamad Ridwan N.A.',
        jabatan: 'Ketua UKM Kewirausahaan',
      },
    ],
  },

  // ============================================================
  // AWD-9 | HALAMAN 9 (2024 / Periode 2024-2025)
  // ============================================================
  {
    id: 'awd-9',
    filename: '2024-hbe-kwu.webp',
    title: 'Certificate of Appreciation Head of the Business Education 2024-2025',
    issuer: 'Kewirausahaan Organization STIE Wikara',
    year: '2024',
    date: '2024-01-15',
    level: 'Kampus',
    category: 'Organisasi dan Kepemimpinan',
    role: 'Head of the Business Education',
    certificateNumber: '0141/SF/KWU/4/IV/2025',
    signatureType: 'DUAL',
    isPortrait: false,
    description: 'Penghargaan atas dedikasi, komitmen, dan kontribusi dalam Kewirausahaan Organization selama periode 2024-2025.',
    signers: [
      {
        nama_lengkap: 'Dewi Puspasari, S.M., M.M.',
        jabatan: 'Advisor',
      },
      {
        nama_lengkap: 'Muhamad Ridwan N.A.',
        jabatan: 'Chairman',
      },
    ],
  },

  // ============================================================
  // AWD-10 | HALAMAN 10 (2023)
  // ============================================================
  {
    id: 'awd-10',
    filename: '2023-moderator-kemeneku.webp',
    title: 'Sertifikat Penghargaan Moderator Ministry of Finance Goes to Campus',
    issuer: 'Kementerian Keuangan Republik Indonesia',
    year: '2023',
    date: '2023-10-05',
    level: 'Nasional',
    category: 'Komunikasi dan Acara',
    role: 'Moderator',
    certificateNumber: '',
    signatureType: 'MULTI',
    isPortrait: false,
    description: 'Penghargaan atas peran sebagai Moderator dalam kegiatan Ministry of Finance Goes to Campus.',
    signers: [
      {
        nama_lengkap: 'Rahmady Effendi Hutahaean',
        jabatan: 'Kepala KPPBC TMP A Purwakarta',
      },
      {
        nama_lengkap: 'Subandono Rachmadi, S.E., M.Si.',
        jabatan: 'Kepala KPP Pratama Purwakarta',
      },
      {
        nama_lengkap: 'Wahjudi Prajogo',
        jabatan: 'Kepala KPKNL Purwakarta',
      },
      {
        nama_lengkap: 'Budi Utomo, S.E.',
        jabatan: 'Kepala KPPN Purwakarta',
      },
    ],
  },

  // ============================================================
  // AWD-11 | HALAMAN 11 (2023)
  // ============================================================
  {
    id: 'awd-11',
    filename: '2023-juri-umkm.webp',
    title: 'Sertifikat Penghargaan Dewan Juri Lomba UPPKA Kecamatan Campaka Purwakarta 2023',
    issuer: 'Panitia Lomba UPPKA Kecamatan Campaka Purwakarta',
    year: '2023',
    date: '2023-08-14',
    level: 'Kabupaten/Kota',
    category: 'Penilaian dan Kompetisi',
    role: 'Dewan Juri',
    certificateNumber: '',
    signatureType: 'DUAL',
    isPortrait: false,
    description: 'Apresiasi atas dedikasi dan kontribusi sebagai Dewan Juri dalam melaksanakan penilaian pada kegiatan Lomba UPPKA Kecamatan Campaka Purwakarta pada 14 Agustus 2023.',
    signers: [
      {
        nama_lengkap: 'Dea Apriani',
        jabatan: 'Koordinator',
      },
      {
        nama_lengkap: 'Raka',
        jabatan: 'Ketua Pelaksana',
      },
    ],
  },

  // ============================================================
  // AWD-12 | HALAMAN 12 (2023)
  // ============================================================
  {
    id: 'awd-12',
    filename: '2023-winner-duta-genre.webp',
    title: 'Sertifikat Penghargaan Winner Duta Generasi Berencana Kabupaten Purwakarta Tahun 2023',
    issuer: 'Dinas Pengendalian Penduduk dan Keluarga Berencana Kabupaten Purwakarta',
    year: '2023',
    date: '2023-07-02',
    level: 'Kabupaten/Kota',
    category: 'Prestasi dan Kepemudaan',
    role: 'Winner Duta Generasi Berencana Kabupaten Purwakarta',
    certificateNumber: '',
    signatureType: 'DUAL',
    isPortrait: false,
    description: 'Penghargaan atas prestasi sebagai Winner Duta Generasi Berencana Kabupaten Purwakarta Tahun 2023 dalam kegiatan Apresiasi Duta dan Jambore Ajang Kreativitas Generasi Berencana Kabupaten Purwakarta.',
    signers: [
      {
        nama_lengkap: 'H. Anne Ratna Mustika, S.E.',
        jabatan: 'Bupati Purwakarta',
      },
      {
        nama_lengkap: 'H. Yayat Hidayat, S.Sos.',
        jabatan: 'Kepala Dinas Pengendalian Penduduk dan Keluarga Berencana Kabupaten Purwakarta',
      },
    ],
  },

  // ============================================================
  // AWD-13 | HALAMAN 13 (2023)
  // ============================================================
  {
    id: 'awd-13',
    filename: '2023-moderator-seminar-keorganisasian.webp',
    title: 'Certificate of Appreciation Moderator Seminar Keorganisasian Indonesia 2023',
    issuer: 'Panitia Seminar Keorganisasian Indonesia 2023',
    year: '2023',
    date: '2023-05-10',
    level: 'Kampus',
    category: 'Organisasi dan Pendidikan',
    role: 'Moderator',
    certificateNumber: '',
    signatureType: 'DUAL',
    isPortrait: false,
    description: 'Apresiasi atas dedikasi, kontribusi, profesionalisme, dan partisipasi sebagai Moderator dalam Seminar Keorganisasian Indonesia 2023.',
    signers: [
      {
        nama_lengkap: 'Rukmana Yuda',
        jabatan: 'Organizing Committee Chair',
      },
      {
        nama_lengkap: 'Andre Noor. S',
        jabatan: 'Steering Committee',
      },
    ],
  },

  // ============================================================
  // AWD-14 | HALAMAN 14 (2022)
  // ============================================================
  {
    id: 'awd-14',
    filename: '2022-mahasiswa-terbaik.webp',
    title: 'Sertifikat Penghargaan Mahasiswa Terbaik I PKKMB STIE Wikara Tahun 2022',
    issuer: 'Sekolah Tinggi Ilmu Ekonomi Wibawa Karta Raharja',
    year: '2022',
    date: '2022-09-15',
    level: 'Kampus',
    category: 'Prestasi Akademik dan Kepemimpinan',
    role: 'Mahasiswa Terbaik I',
    certificateNumber: '2-039/PKKMB/WKR/IX/2022',
    signatureType: 'SINGLE',
    isPortrait: false,
    description: 'Apresiasi atas pencapaian sebagai Mahasiswa Terbaik I dalam kegiatan Pengenalan Kehidupan Kampus bagi Mahasiswa Baru (PKKMB) STIE Wikara Tahun 2022 atas dedikasi, kedisiplinan, semangat, kepemimpinan, serta partisipasi aktif selama seluruh rangkaian kegiatan.',
    signers: [
      {
        nama_lengkap: 'Drs. H. Duki Adam, M.M.',
        jabatan: 'Ketua STIE Wikara',
        nip_nik_id: 'NIDN. 0405029404',
      },
    ],
  },

  // ============================================================
  // AWD-15 | HALAMAN 15 (2019)
  // ============================================================
  {
    id: 'awd-15',
    filename: '2019-juara-ii-lomba-pidato-smk.webp',
    title: 'Piagam Penghargaan Juara 2 Lomba Pidato Maulid Nabi Muhammad SAW 2019',
    issuer: 'SMK Negeri Kiarapedes',
    year: '2019',
    date: '2019-11-16',
    level: 'Sekolah',
    category: 'Prestasi dan Kompetisi',
    role: 'Juara 2 Lomba Pidato',
    certificateNumber: '',
    signatureType: 'SINGLE',
    isPortrait: false,
    description: 'Penghargaan Juara 2 dalam Lomba Pidato yang diselenggarakan oleh OSIS dan MPK SMK Negeri Kiarapedes untuk memperingati Maulid Nabi Muhammad SAW pada tanggal 11–16 November 2019.',
    signers: [
      {
        nama_lengkap: 'Abi Suryawan, S.Pd., M.Pd.',
        jabatan: 'Kepala Sekolah SMK Negeri Kiarapedes',
        nip_nik_id: 'NIP. 19640629 198903 1 007',
      },
    ],
  },

  // ============================================================
  // AWD-16 | HALAMAN 16 (2019)
  // ============================================================
  {
    id: 'awd-16',
    filename: '2019-juara-i-lomba-pidato-smk.webp',
    title: 'Piagam Penghargaan Juara 1 Lomba Pidato Hari Sumpah Pemuda 2019',
    issuer: 'SMK Negeri Kiarapedes',
    year: '2019',
    date: '2019-11-02',
    level: 'Sekolah',
    category: 'Prestasi dan Kompetisi',
    role: 'Juara 1 Lomba Pidato',
    certificateNumber: '',
    signatureType: 'SINGLE',
    isPortrait: false,
    description: 'Penghargaan Juara 1 dalam Lomba Pidato yang diselenggarakan oleh OSIS dan MPK SMK Negeri Kiarapedes untuk memperingati Hari Sumpah Pemuda pada tanggal 2 November 2019.',
    signers: [
      {
        nama_lengkap: 'Abi Suryawan, S.Pd., M.Pd.',
        jabatan: 'Kepala Sekolah SMK Negeri Kiarapedes',
        nip_nik_id: 'NIP. 19640629 198903 1 007',
      },
    ],
  },

  // ============================================================
  // AWD-17 | HALAMAN 17 (2019)
  // ============================================================
  {
    id: 'awd-17',
    filename: '2019-juara-harapan-ii-pidato.webp',
    title: 'Sertifikat Juara Harapan II Lomba Pidato Bulan Bahasa Tingkat SMK Kabupaten Purwakarta 2019',
    issuer: 'Panitia Lomba Bulan Bahasa Kabupaten Purwakarta',
    year: '2019',
    date: '2019-10-03',
    level: 'Kabupaten/Kota',
    category: 'Prestasi dan Kompetisi',
    role: 'Juara Harapan II Lomba Pidato',
    certificateNumber: '',
    signatureType: 'MULTI',
    isPortrait: false,
    description: 'Penghargaan Juara Harapan II dalam Lomba Pidato pada Peringatan Bulan Bahasa dengan tema Pembentukan Karakter untuk Menghadapi Industri 4.0 melalui Peningkatan Berbahasa dan Bersastra Indonesia tingkat SMK se-Kabupaten Purwakarta yang dilaksanakan di SMK Negeri Bojong pada 3 Oktober 2019.',
    signers: [
      {
        nama_lengkap: 'Drs. Darta',
        jabatan: 'Ketua MKKS SMK Kabupaten Purwakarta',
        nip_nik_id: 'NIP. 19670908 198903 1 002',
      },
      {
        nama_lengkap: 'Asep Suryanto, S.Pd.',
        jabatan: 'Ketua MGMP Bahasa Indonesia Kabupaten Purwakarta',
        nip_nik_id: 'NIP. 19730620 200312 1 005',
      },
      {
        nama_lengkap: 'Farhan Akbar Muttaqi, S.Pd.',
        jabatan: 'Ketua Pelaksana',
        nip_nik_id: 'NIP. 19930511 201903 1 010',
      },
    ],
  },

  // ============================================================
  // AWD-18 | HALAMAN 18 (2017)
  // ============================================================
  {
    id: 'awd-18',
    filename: '2017-kepesertaan-paskibra-kecamatan.webp',
    title: 'Piagam Penghargaan Peserta Pasukan Pengibar Bendera (PASKIBRA) Kecamatan Kiarapedes 2017',
    issuer: 'Panitia Hari Besar Nasional Kecamatan Kiarapedes',
    year: '2017',
    date: '2017-08-18',
    level: 'Kecamatan',
    category: 'Kepemimpinan dan Kegiatan Kebangsaan',
    role: 'Peserta Pasukan Pengibar Bendera (PASKIBRA)',
    certificateNumber: '01/Pan-PHBN/VIII/2017',
    signatureType: 'DUAL',
    isPortrait: true,
    description: 'Penghargaan sebagai Peserta Pasukan Pengibar Bendera (PASKIBRA) Tahun 2017 Kecamatan Kiarapedes pada Upacara Peringatan Hari Ulang Tahun Proklamasi Kemerdekaan Republik Indonesia ke-72 tingkat Kecamatan Kiarapedes.',
    signers: [
      {
        nama_lengkap: 'Camat Kiarapedes',
        jabatan: 'Camat Kiarapedes',
        nip_nik_id: 'NIP. 19710124 199203 1 005',
      },
      {
        nama_lengkap: 'Subachri, AP., M.Si.',
        jabatan: 'Ketua PHBN Kiarapedes',
      },
    ],
  },

  // ============================================================
  // AWD-19 | HALAMAN 19 (2017)
  // ============================================================
  {
    id: 'awd-19',
    filename: '2017-kepesertaan-olimpiade-ipa.webp',
    title: 'Piagam Penghargaan Peserta Lomba Olimpiade Sains Nasional (OSN) Tingkat SMP Kabupaten Purwakarta 2017',
    issuer: 'Pemerintah Kabupaten Purwakarta - Dinas Pendidikan',
    year: '2017',
    date: '2017-03-11',
    level: 'Kabupaten/Kota',
    category: 'Pendidikan dan Kompetisi Akademik',
    role: 'Peserta Olimpiade Sains Nasional (OSN) Mata Pelajaran IPA',
    certificateNumber: '861 / 396 / DIKDAS',
    signatureType: 'SINGLE',
    isPortrait: false,
    description: 'Penghargaan sebagai Peserta Mata Pelajaran IPA dalam kegiatan Lomba Olimpiade Sains Nasional (OSN) tingkat SMP se-Kabupaten Purwakarta yang diselenggarakan oleh Dinas Pendidikan Kabupaten Purwakarta bertempat di SMPN 2 Purwakarta pada tanggal 11 Maret 2017.',
    signers: [
      {
        nama_lengkap: 'H. M. Rasmita NS, S.Pd., M.Pd.',
        jabatan: 'Kepala Dinas Pendidikan Kabupaten Purwakarta',
        nip_nik_id: 'NIP. 19580401 197903 1 002',
      },
    ],
  },
];

/**
 * Peta absolut lokasi gambar penghargaan berdasarkan ID sertifikat.
 */
export const AWARDS_IMAGES: Record<string, string> = ALL_AWARDS_LIST.reduce(
  (acc, item) => {
    acc[item.id] = `/penghargaan/${item.filename}`;
    return acc;
  },
  {} as Record<string, string>
);

/**
 * Mengurutkan daftar penghargaan secara kronologis dari waktu terbaru ke terlama.
 */
export function sortAwardsChronologicalDesc(items: AwardItemConfig[]): AwardItemConfig[] {
  return [...items].sort((a, b) => {
    const valA = a.date || `${a.year}-01-01`;
    const valB = b.date || `${b.year}-01-01`;
    if (valB !== valA) {
      return valB.localeCompare(valA);
    }
    return Number(b.year) - Number(a.year);
  });
}

/**
 * Pemetaan antara ID Prestasi CV ('ach-X') dan ID Sertifikat Fisik Penghargaan ('awd-Y').
 * Terpetakan 1:1 secara kronologis dari Halaman 1 (awd-1) s.d. Halaman 19 (awd-19).
 */
export const CV_ACHIEVEMENT_TO_AWARD_ID_MAP: Record<string, string> = {
  'ach-11': 'awd-1',  // Steering Committee PKKMB 2025 -> 2025-steering-committee-pkkmb.webp (Hal 1)
  'ach-5':  'awd-2',  // Ketua Pelaksana WSC Piala Gubernur 2025 -> 2025-ketua-wsc-piala-gubernur.webp (Hal 2)
  'ach-19': 'awd-3',  // Ketua BEM STIE Wikara 2025/2026 -> 2025-ketua-bem.webp (Hal 3)
  'ach-14': 'awd-4',  // Director Film Tak Kasat 2025 -> 2025-director-film.webp (Hal 4)
  'ach-9':  'awd-5',  // Pemateri EduFest 2025 -> 2025-pemateri-edufest.webp (Hal 5)
  'ach-13': 'awd-6',  // Master of Ceremony (MC) PORSA 2024 -> 2024-mc-porsa.webp (Hal 6)
  'ach-21': 'awd-7',  // Pembicara Seminar Berani Jadi Beda 2024 -> 2024-seminar-fosta.webp (Hal 7)
  'ach-15': 'awd-8',  // Pembicara Seminar Potensi Diri KWU 2024 -> 2024-pembicara-kwu.webp (Hal 8)
  'ach-20': 'awd-9',  // Head of Business Education KWU 2024-2025 -> 2024-hbe-kwu.webp (Hal 9)
  'ach-10': 'awd-10', // Moderator Kemenkeu Goes to Campus 2023 -> 2023-moderator-kemeneku.webp (Hal 10)
  'ach-8':  'awd-11', // Dewan Juri UMKM 2023 -> 2023-juri-umkm.webp (Hal 11)
  'ach-7':  'awd-12', // Winner Duta GenRe Kab. Purwakarta 2023 -> 2023-winner-duta-genre.webp (Hal 12)
  'ach-16': 'awd-13', // Moderator Seminar Keorganisasian 2023 -> 2023-moderator-seminar-keorganisasian.webp (Hal 13)
  'ach-18': 'awd-14', // Mahasiswa Terbaik I PMB / PKKMB 2022 -> 2022-mahasiswa-terbaik.webp (Hal 14)
  'ach-25': 'awd-15', // Juara 2 Lomba Pidato Maulid Nabi SMK 2019 -> 2019-juara-ii-lomba-pidato-smk.webp (Hal 15)
  'ach-24': 'awd-16', // Juara 1 Lomba Pidato Sumpah Pemuda SMK 2019 -> 2019-juara-i-lomba-pidato-smk.webp (Hal 16)
  'ach-26': 'awd-17', // Juara Harapan II Pidato SMK Bulan Bahasa 2019 -> 2019-juara-harapan-ii-pidato.webp (Hal 17)
  'ach-23': 'awd-18', // Peserta Paskibra Kecamatan 2017 -> 2017-kepesertaan-paskibra-kecamatan.webp (Hal 18)
  'ach-22': 'awd-19', // Peserta OSN IPA SMP 2017 -> 2017-kepesertaan-olimpiade-ipa.webp (Hal 19)
};

export const AWARD_TO_CV_ACHIEVEMENT_MAP: Record<string, string> = Object.entries(
  CV_ACHIEVEMENT_TO_AWARD_ID_MAP
).reduce((acc, [achId, awdId]) => {
  acc[awdId] = achId;
  return acc;
}, {} as Record<string, string>);

/**
 * Returns physical award certificate ID for a given CV achievement ID, if certified.
 */
export function getAwardIdForAchievement(achId: string): string | undefined {
  return CV_ACHIEVEMENT_TO_AWARD_ID_MAP[achId];
}

/**
 * Maps an array of CV achievement IDs to unique physical award certificate IDs.
 */
export function getAwardIdsForAchievements(achievementIds: string[]): string[] {
  const result: string[] = [];
  for (const achId of achievementIds) {
    const awdId = CV_ACHIEVEMENT_TO_AWARD_ID_MAP[achId];
    if (awdId && !result.includes(awdId)) {
      result.push(awdId);
    }
  }
  return result;
}
