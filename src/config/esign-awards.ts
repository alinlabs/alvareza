/**
 * Konfigurasi Tanda Tangan Elektronik Kriptografi (PKCS#7 / PAdES)
 * Modul Full View: Penghargaan & Prestasi (Awards & Honors)
 *
 * Sinkronisasi 100% dengan data resmi pengguna untuk seluruh 19 berkas sertifikat fisik:
 * awd-1 s.d. awd-19 (Halaman 1 s.d. Halaman 19 secara kronologis dari terbaru ke terlama).
 * Mendukung Single, Dual, dan Multi-Signer sesuai dokumen fisik asli.
 */

import type { MasterDossierCredential, ItemIssuerCredential } from './config-esign';

export const AWARDS_MASTER_DOSSIER: MasterDossierCredential = {
  authority: {
    commonName: 'Digital Profile Alvareza - Awards & Achievements Certificate Authority',
    organization: 'Digital Profile Alvareza Trust Network',
    organizationalUnit: 'Awards & Honors Certification Board',
    country: 'ID',
    stateOrProvince: 'Jawa Barat',
    locality: 'Purwakarta',
    email: 'awards-ca@digitalprofile-alvareza.app',
    validityYears: 10,
  },
  signer: {
    commonName: 'Alvareza Hilka Pratama',
    organization: 'Digital Profile Alvareza Honors',
    organizationalUnit: 'Award Winner & Certified Certificate Holder',
    country: 'ID',
    stateOrProvince: 'Jawa Barat',
    locality: 'Purwakarta',
    email: 'alvareza@digitalprofile-alvareza.app',
    validityYears: 5,
  },
  reason: 'Pengesahan Berkas Kompilasi Terpadu Seluruh Piagam & Penghargaan Resmi Alvareza Hilka Pratama',
  signatureFieldTitle: 'DigitalProfileAlvarezaAwardsMasterSignature',
};

export const AWARDS_ITEM_CREDENTIALS: Record<string, ItemIssuerCredential> = {
  // ============================================================
  // AWD-1 | HALAMAN 1 (2025) - DUAL SIGNATURE
  // File: 2025-steering-committee-pkkmb.webp
  // ============================================================
  'awd-1': {
    authority: {
      commonName: 'Sekolah Tinggi Ilmu Ekonomi Wibawa Karta Raharja',
      organization: 'STIE Wibawa Karta Raharja',
      organizationalUnit: 'Panitia PKKMB STIE Wikara 2025/2026',
      country: 'ID',
      stateOrProvince: 'Jawa Barat',
      locality: 'Purwakarta',
      email: 'pkkmb@stiewikara.ac.id',
      validityYears: 10,
    },
    signer: {
      commonName: 'Drs. H. Duki Adam, M.M.',
      organization: 'STIE Wibawa Karta Raharja',
      organizationalUnit: 'Ketua STIE Wikara (NIDN. 0405029404)',
      country: 'ID',
      stateOrProvince: 'Jawa Barat',
      locality: 'Purwakarta',
      email: 'ketua@stiewikara.ac.id',
      validityYears: 5,
    },
    coSigner: {
      commonName: 'Drs. Asep Gumelar, M.M.',
      organization: 'STIE Wibawa Karta Raharja',
      organizationalUnit: 'Kemahasiswaan (NIDN. 99401690)',
      country: 'ID',
      stateOrProvince: 'Jawa Barat',
      locality: 'Purwakarta',
      email: 'kemahasiswaan@stiewikara.ac.id',
      validityYears: 5,
    },
    signatureType: 'DUAL',
    certificateNumber: '5-021/PKKMB/STIE-WIKARA/X/2025',
    issueDate: '4 Oktober 2025',
    reason: 'Verifikasi Keaslian Sertifikat Apresiasi Steering Committee PKKMB STIE Wikara 2025/2026 - Alvareza Hilka Pratama',
  },

  // ============================================================
  // AWD-2 | HALAMAN 2 (2025) - DUAL SIGNATURE
  // File: 2025-ketua-wsc-piala-gubernur.webp
  // ============================================================
  'awd-2': {
    authority: {
      commonName: 'STIE Wibawa Karta Raharja dan Cabang Dinas Pendidikan Wilayah IV',
      organization: 'Dinas Pendidikan Jawa Barat & STIE Wikara',
      organizationalUnit: 'Panitia Stand Up Comedy Champion Piala Gubernur Jawa Barat 2025',
      country: 'ID',
      stateOrProvince: 'Jawa Barat',
      locality: 'Purwakarta',
      email: 'cadisdik4@jabarprov.go.id',
      validityYears: 10,
    },
    signer: {
      commonName: 'Riesye Silvana, S.STP., M.A.P.',
      organization: 'Cabang Dinas Pendidikan Wilayah IV Jawa Barat',
      organizationalUnit: 'Kepala CADISDIK Wilayah IV (NIP. 198501312003122001)',
      country: 'ID',
      stateOrProvince: 'Jawa Barat',
      locality: 'Purwakarta',
      email: 'cadisdik4@jabarprov.go.id',
      validityYears: 5,
    },
    coSigner: {
      commonName: 'Drs. H. Duki Adam, M.M.',
      organization: 'STIE Wibawa Karta Raharja',
      organizationalUnit: 'Ketua STIE Wikara (NIDN. 0414066202)',
      country: 'ID',
      stateOrProvince: 'Jawa Barat',
      locality: 'Purwakarta',
      email: 'ketua@stiewikara.ac.id',
      validityYears: 5,
    },
    signatureType: 'DUAL',
    issueDate: '31 Agustus 2025',
    reason: 'Verifikasi Keaslian Sertifikat Penghargaan Ketua Pelaksana Stand Up Comedy Champion Piala Gubernur Jawa Barat 2025 - Alvareza Hilka Pratama',
  },

  // ============================================================
  // AWD-3 | HALAMAN 3 (2026) - DUAL SIGNATURE
  // File: 2025-ketua-bem.webp
  // ============================================================
  'awd-3': {
    authority: {
      commonName: 'Sekolah Tinggi Ilmu Ekonomi Wibawa Karta Raharja',
      organization: 'STIE Wibawa Karta Raharja',
      organizationalUnit: 'Organisasi Kemahasiswaan STIE Wikara',
      country: 'ID',
      stateOrProvince: 'Jawa Barat',
      locality: 'Purwakarta',
      email: 'ormawa@stiewikara.ac.id',
      validityYears: 10,
    },
    signer: {
      commonName: 'Drs. H. Duki Adam, M.M.',
      organization: 'STIE Wibawa Karta Raharja',
      organizationalUnit: 'Ketua STIE Wikara (NIDN. 0405029404)',
      country: 'ID',
      stateOrProvince: 'Jawa Barat',
      locality: 'Purwakarta',
      email: 'ketua@stiewikara.ac.id',
      validityYears: 5,
    },
    coSigner: {
      commonName: 'Drs. A. Gumelar, M.Si.',
      organization: 'STIE Wibawa Karta Raharja',
      organizationalUnit: 'Kemahasiswaan (NIDN. 99401690)',
      country: 'ID',
      stateOrProvince: 'Jawa Barat',
      locality: 'Purwakarta',
      email: 'kemahasiswaan@stiewikara.ac.id',
      validityYears: 5,
    },
    signatureType: 'DUAL',
    certificateNumber: '6-034/ORMAWA/WKR/X/2025',
    issueDate: '6 April 2026',
    reason: 'Verifikasi Keaslian Sertifikat Penghargaan Ketua Badan Eksekutif Mahasiswa STIE Wikara Periode 2025/2026 - Alvareza Hilka Pratama',
  },

  // ============================================================
  // AWD-4 | HALAMAN 4 (2025) - SINGLE SIGNATURE
  // File: 2025-director-film.webp
  // ============================================================
  'awd-4': {
    authority: {
      commonName: 'STIE Wibawa Karta Raharja',
      organization: 'STIE Wibawa Karta Raharja',
      organizationalUnit: 'KPPM STIE Wikara & Desa Gunung Hejo',
      country: 'ID',
      stateOrProvince: 'Jawa Barat',
      locality: 'Purwakarta',
      email: 'kppm@stiewikara.ac.id',
      validityYears: 10,
    },
    signer: {
      commonName: 'Eddy Junaedi, S.E., M.M.',
      organization: 'STIE Wibawa Karta Raharja',
      organizationalUnit: 'Pejabat Penandatangan Sertifikat (NIDN. 7462748649130082)',
      country: 'ID',
      stateOrProvince: 'Jawa Barat',
      locality: 'Purwakarta',
      email: 'eddy.junaedi@stiewikara.ac.id',
      validityYears: 5,
    },
    signatureType: 'SINGLE',
    issueDate: '5 Agustus 2025',
    reason: 'Verifikasi Keaslian Sertifikat Penghargaan Director Film Tak Kasat - Misteri Gunung Hejo - Alvareza Hilka Pratama',
  },

  // ============================================================
  // AWD-5 | HALAMAN 5 (2025) - DUAL SIGNATURE
  // File: 2025-pemateri-edufest.webp
  // ============================================================
  'awd-5': {
    authority: {
      commonName: 'Saduta Foundation',
      organization: 'Saduta Foundation',
      organizationalUnit: 'Panitia Edukasi Festival Kabupaten Purwakarta 2025',
      country: 'ID',
      stateOrProvince: 'Jawa Barat',
      locality: 'Purwakarta',
      email: 'info@saduta.or.id',
      validityYears: 10,
    },
    signer: {
      commonName: 'Fadjrin Diraja Muhammad',
      organization: 'Saduta Foundation',
      organizationalUnit: 'Ketua Yayasan Saduta Foundation',
      country: 'ID',
      stateOrProvince: 'Jawa Barat',
      locality: 'Purwakarta',
      email: 'fadjrin@saduta.or.id',
      validityYears: 5,
    },
    coSigner: {
      commonName: 'Diki Ramdani Hermawan',
      organization: 'Saduta Foundation',
      organizationalUnit: 'Ketua Yayasan Saduta Foundation',
      country: 'ID',
      stateOrProvince: 'Jawa Barat',
      locality: 'Purwakarta',
      email: 'diki@saduta.or.id',
      validityYears: 5,
    },
    signatureType: 'DUAL',
    issueDate: '1 April 2025',
    reason: 'Verifikasi Keaslian Sertifikat Apresiasi dan Penghargaan Pemateri Edufest Purwakarta 2025 - Alvareza Hilka Pratama',
  },

  // ============================================================
  // AWD-6 | HALAMAN 6 (2024) - DUAL SIGNATURE
  // File: 2024-mc-porsa.webp
  // ============================================================
  'awd-6': {
    authority: {
      commonName: 'STIE Wibawa Karta Raharja',
      organization: 'STIE Wibawa Karta Raharja',
      organizationalUnit: 'Panitia Pekan Olahraga Mahasiswa (PORSA)',
      country: 'ID',
      stateOrProvince: 'Jawa Barat',
      locality: 'Purwakarta',
      email: 'porsa@stiewikara.ac.id',
      validityYears: 10,
    },
    signer: {
      commonName: 'Sopian Hidayat',
      organization: 'PORSA STIE Wikara 2024',
      organizationalUnit: 'Ketua Pelaksana',
      country: 'ID',
      stateOrProvince: 'Jawa Barat',
      locality: 'Purwakarta',
      email: 'porsa@stiewikara.ac.id',
      validityYears: 5,
    },
    coSigner: {
      commonName: 'M. Fadil Maulana',
      organization: 'PORSA STIE Wikara 2024',
      organizationalUnit: 'Penanggung Jawab',
      country: 'ID',
      stateOrProvince: 'Jawa Barat',
      locality: 'Purwakarta',
      email: 'porsa@stiewikara.ac.id',
      validityYears: 5,
    },
    signatureType: 'DUAL',
    issueDate: '8 Juli 2024',
    reason: 'Verifikasi Keaslian Sertifikat Apresiasi Master of Ceremony Pekan Olahraga Mahasiswa (PORSA) 2024 - Alvareza Hilka Pratama',
  },

  // ============================================================
  // AWD-7 | HALAMAN 7 (2024) - SINGLE SIGNATURE
  // File: 2024-seminar-fosta.webp
  // ============================================================
  'awd-7': {
    authority: {
      commonName: 'FOSTA Kabupaten Purwakarta',
      organization: 'FOSTA Kabupaten Purwakarta',
      organizationalUnit: 'Panitia Seminar Berani Jadi Beda',
      country: 'ID',
      stateOrProvince: 'Jawa Barat',
      locality: 'Purwakarta',
      email: 'fosta@purwakartakab.go.id',
      validityYears: 10,
    },
    signer: {
      commonName: 'Dika Saputra',
      organization: 'FOSTA Kabupaten Purwakarta',
      organizationalUnit: 'Pembina FOSTA Kabupaten Purwakarta',
      country: 'ID',
      stateOrProvince: 'Jawa Barat',
      locality: 'Purwakarta',
      email: 'fosta@purwakartakab.go.id',
      validityYears: 5,
    },
    signatureType: 'SINGLE',
    issueDate: '4 Juli 2024',
    reason: 'Verifikasi Keaslian Sertifikat Apresiasi Pembicara Seminar Berani Jadi Beda FOSTA Purwakarta 2024 - Alvareza Hilka Pratama',
  },

  // ============================================================
  // AWD-8 | HALAMAN 8 (2024) - SINGLE SIGNATURE
  // File: 2024-pembicara-kwu.webp
  // ============================================================
  'awd-8': {
    authority: {
      commonName: 'STIE Wibawa Karta Raharja',
      organization: 'STIE Wibawa Karta Raharja',
      organizationalUnit: 'UKM Kewirausahaan STIE Wikara',
      country: 'ID',
      stateOrProvince: 'Jawa Barat',
      locality: 'Purwakarta',
      email: 'kwu@stiewikara.ac.id',
      validityYears: 10,
    },
    signer: {
      commonName: 'Muhamad Ridwan N.A.',
      organization: 'UKM Kewirausahaan STIE Wikara',
      organizationalUnit: 'Ketua UKM Kewirausahaan',
      country: 'ID',
      stateOrProvince: 'Jawa Barat',
      locality: 'Purwakarta',
      email: 'kwu@stiewikara.ac.id',
      validityYears: 5,
    },
    signatureType: 'SINGLE',
    certificateNumber: '0119/SF/KWU/4/III/2024',
    issueDate: '31 Maret 2024',
    reason: 'Verifikasi Keaslian Sertifikat Penghargaan Pembicara Mini Seminar Menggali Potensi Diri 2024 - Alvareza Hilka Pratama',
  },

  // ============================================================
  // AWD-9 | HALAMAN 9 (2025) - DUAL SIGNATURE
  // File: 2024-hbe-kwu.webp
  // ============================================================
  'awd-9': {
    authority: {
      commonName: 'Kewirausahaan Organization STIE Wikara',
      organization: 'STIE Wibawa Karta Raharja',
      organizationalUnit: 'Kewirausahaan Organization',
      country: 'ID',
      stateOrProvince: 'Jawa Barat',
      locality: 'Purwakarta',
      email: 'kwu@stiewikara.ac.id',
      validityYears: 10,
    },
    signer: {
      commonName: 'Dewi Puspasari, S.M., M.M.',
      organization: 'Kewirausahaan Organization STIE Wikara',
      organizationalUnit: 'Advisor',
      country: 'ID',
      stateOrProvince: 'Jawa Barat',
      locality: 'Purwakarta',
      email: 'dewi.puspasari@stiewikara.ac.id',
      validityYears: 5,
    },
    coSigner: {
      commonName: 'Muhamad Ridwan N.A.',
      organization: 'Kewirausahaan Organization STIE Wikara',
      organizationalUnit: 'Chairman',
      country: 'ID',
      stateOrProvince: 'Jawa Barat',
      locality: 'Purwakarta',
      email: 'chairman.kwu@stiewikara.ac.id',
      validityYears: 5,
    },
    signatureType: 'DUAL',
    certificateNumber: '0141/SF/KWU/4/IV/2025',
    issueDate: '16 April 2025',
    reason: 'Verifikasi Keaslian Certificate of Appreciation Head of the Business Education 2024-2025 - Alvareza Hilka Pratama',
  },

  // ============================================================
  // AWD-10 | HALAMAN 10 (2023) - MULTI SIGNATURE (4 SIGNERS)
  // File: 2023-moderator-kemeneku.webp
  // ============================================================
  'awd-10': {
    authority: {
      commonName: 'Kementerian Keuangan Republik Indonesia',
      organization: 'Kementerian Keuangan RI',
      organizationalUnit: 'Kemenkeu-One Purwakarta',
      country: 'ID',
      stateOrProvince: 'Jawa Barat',
      locality: 'Purwakarta',
      email: 'kemenkeu.purwakarta@kemenkeu.go.id',
      validityYears: 10,
    },
    signer: {
      commonName: 'Rahmady Effendi Hutahaean',
      organization: 'Kementerian Keuangan Republik Indonesia',
      organizationalUnit: 'Kepala KPPBC TMP A Purwakarta',
      country: 'ID',
      stateOrProvince: 'Jawa Barat',
      locality: 'Purwakarta',
      email: 'kppbc.purwakarta@kemenkeu.go.id',
      validityYears: 5,
    },
    coSigner: {
      commonName: 'Subandono Rachmadi, S.E., M.Si.',
      organization: 'Kementerian Keuangan Republik Indonesia',
      organizationalUnit: 'Kepala KPP Pratama Purwakarta',
      country: 'ID',
      stateOrProvince: 'Jawa Barat',
      locality: 'Purwakarta',
      email: 'kpp.purwakarta@kemenkeu.go.id',
      validityYears: 5,
    },
    signers: [
      {
        commonName: 'Rahmady Effendi Hutahaean',
        organization: 'Kementerian Keuangan RI',
        organizationalUnit: 'Kepala KPPBC TMP A Purwakarta',
        country: 'ID',
        stateOrProvince: 'Jawa Barat',
        locality: 'Purwakarta',
        email: 'kppbc.purwakarta@kemenkeu.go.id',
        validityYears: 5,
      },
      {
        commonName: 'Subandono Rachmadi, S.E., M.Si.',
        organization: 'Kementerian Keuangan RI',
        organizationalUnit: 'Kepala KPP Pratama Purwakarta',
        country: 'ID',
        stateOrProvince: 'Jawa Barat',
        locality: 'Purwakarta',
        email: 'kpp.purwakarta@kemenkeu.go.id',
        validityYears: 5,
      },
      {
        commonName: 'Wahjudi Prajogo',
        organization: 'Kementerian Keuangan RI',
        organizationalUnit: 'Kepala KPKNL Purwakarta',
        country: 'ID',
        stateOrProvince: 'Jawa Barat',
        locality: 'Purwakarta',
        email: 'kpknl.purwakarta@kemenkeu.go.id',
        validityYears: 5,
      },
      {
        commonName: 'Budi Utomo, S.E.',
        organization: 'Kementerian Keuangan RI',
        organizationalUnit: 'Kepala KPPN Purwakarta',
        country: 'ID',
        stateOrProvince: 'Jawa Barat',
        locality: 'Purwakarta',
        email: 'kppn.purwakarta@kemenkeu.go.id',
        validityYears: 5,
      },
    ],
    signatureType: 'MULTI',
    issueDate: '5 Oktober 2023',
    reason: 'Verifikasi Keaslian Sertifikat Penghargaan Moderator Ministry of Finance Goes to Campus - Alvareza Hilka Pratama',
  },

  // ============================================================
  // AWD-11 | HALAMAN 11 (2023) - DUAL SIGNATURE
  // File: 2023-juri-umkm.webp
  // ============================================================
  'awd-11': {
    authority: {
      commonName: 'Panitia Lomba UPPKA Kecamatan Campaka Purwakarta',
      organization: 'Pemerintah Kabupaten Purwakarta',
      organizationalUnit: 'Panitia Pelaksana Lomba UPPKA',
      country: 'ID',
      stateOrProvince: 'Jawa Barat',
      locality: 'Purwakarta',
      email: 'uppka.campaka@purwakartakab.go.id',
      validityYears: 10,
    },
    signer: {
      commonName: 'Dea Apriani',
      organization: 'Lomba UPPKA Kecamatan Campaka',
      organizationalUnit: 'Koordinator',
      country: 'ID',
      stateOrProvince: 'Jawa Barat',
      locality: 'Purwakarta',
      email: 'uppka.campaka@purwakartakab.go.id',
      validityYears: 5,
    },
    coSigner: {
      commonName: 'Raka',
      organization: 'Lomba UPPKA Kecamatan Campaka',
      organizationalUnit: 'Ketua Pelaksana',
      country: 'ID',
      stateOrProvince: 'Jawa Barat',
      locality: 'Purwakarta',
      email: 'uppka.campaka@purwakartakab.go.id',
      validityYears: 5,
    },
    signatureType: 'DUAL',
    issueDate: '14 Agustus 2023',
    reason: 'Verifikasi Keaslian Sertifikat Penghargaan Dewan Juri Lomba UPPKA Kecamatan Campaka Purwakarta 2023 - Alvareza Hilka Pratama',
  },

  // ============================================================
  // AWD-12 | HALAMAN 12 (2023) - DUAL SIGNATURE
  // File: 2023-winner-duta-genre.webp
  // ============================================================
  'awd-12': {
    authority: {
      commonName: 'Dinas Pengendalian Penduduk dan Keluarga Berencana Kabupaten Purwakarta',
      organization: 'Pemerintah Kabupaten Purwakarta',
      organizationalUnit: 'Apresiasi Duta dan Jambore Ajang Kreativitas Generasi Berencana',
      country: 'ID',
      stateOrProvince: 'Jawa Barat',
      locality: 'Purwakarta',
      email: 'dppkb@purwakartakab.go.id',
      validityYears: 10,
    },
    signer: {
      commonName: 'H. Anne Ratna Mustika, S.E.',
      organization: 'Pemerintah Kabupaten Purwakarta',
      organizationalUnit: 'Bupati Purwakarta',
      country: 'ID',
      stateOrProvince: 'Jawa Barat',
      locality: 'Purwakarta',
      email: 'bupati@purwakartakab.go.id',
      validityYears: 5,
    },
    coSigner: {
      commonName: 'H. Yayat Hidayat, S.Sos.',
      organization: 'DPPKB Kabupaten Purwakarta',
      organizationalUnit: 'Kepala Dinas Pengendalian Penduduk dan Keluarga Berencana Kabupaten Purwakarta',
      country: 'ID',
      stateOrProvince: 'Jawa Barat',
      locality: 'Purwakarta',
      email: 'dppkb@purwakartakab.go.id',
      validityYears: 5,
    },
    signatureType: 'DUAL',
    issueDate: '2 Juli 2023',
    reason: 'Verifikasi Keaslian Sertifikat Penghargaan Winner Duta Generasi Berencana Kabupaten Purwakarta Tahun 2023 - Alvareza Hilka Pratama',
  },

  // ============================================================
  // AWD-13 | HALAMAN 13 (2023) - DUAL SIGNATURE
  // File: 2023-moderator-seminar-keorganisasian.webp
  // ============================================================
  'awd-13': {
    authority: {
      commonName: 'Panitia Seminar Keorganisasian Indonesia 2023',
      organization: 'STIE Wibawa Karta Raharja Purwakarta',
      organizationalUnit: 'Organizing Committee dan Steering Committee',
      country: 'ID',
      stateOrProvince: 'Jawa Barat',
      locality: 'Purwakarta',
      email: 'bem@stiewikara.ac.id',
      validityYears: 10,
    },
    signer: {
      commonName: 'Rukmana Yuda',
      organization: 'Seminar Keorganisasian Indonesia 2023',
      organizationalUnit: 'Organizing Committee Chair',
      country: 'ID',
      stateOrProvince: 'Jawa Barat',
      locality: 'Purwakarta',
      email: 'bem@stiewikara.ac.id',
      validityYears: 5,
    },
    coSigner: {
      commonName: 'Andre Noor. S',
      organization: 'Seminar Keorganisasian Indonesia 2023',
      organizationalUnit: 'Steering Committee',
      country: 'ID',
      stateOrProvince: 'Jawa Barat',
      locality: 'Purwakarta',
      email: 'bem@stiewikara.ac.id',
      validityYears: 5,
    },
    signatureType: 'DUAL',
    issueDate: '10 Mei 2023',
    reason: 'Verifikasi Keaslian Certificate of Appreciation Moderator Seminar Keorganisasian Indonesia 2023 - Alvareza Hilka Pratama',
  },

  // ============================================================
  // AWD-14 | HALAMAN 14 (2022) - SINGLE SIGNATURE
  // File: 2022-mahasiswa-terbaik.webp
  // ============================================================
  'awd-14': {
    authority: {
      commonName: 'Sekolah Tinggi Ilmu Ekonomi Wibawa Karta Raharja',
      organization: 'STIE Wibawa Karta Raharja',
      organizationalUnit: 'Panitia PKKMB STIE Wikara 2022',
      country: 'ID',
      stateOrProvince: 'Jawa Barat',
      locality: 'Purwakarta',
      email: 'kemahasiswaan@stiewikara.ac.id',
      validityYears: 10,
    },
    signer: {
      commonName: 'Drs. H. Duki Adam, M.M.',
      organization: 'STIE Wibawa Karta Raharja',
      organizationalUnit: 'Ketua STIE Wikara (NIDN. 0405029404)',
      country: 'ID',
      stateOrProvince: 'Jawa Barat',
      locality: 'Purwakarta',
      email: 'ketua@stiewikara.ac.id',
      validityYears: 5,
    },
    signatureType: 'SINGLE',
    certificateNumber: '2-039/PKKMB/WKR/IX/2022',
    issueDate: '15 September 2022',
    reason: 'Verifikasi Keaslian Sertifikat Penghargaan Mahasiswa Terbaik I PKKMB STIE Wikara Tahun 2022 - Alvareza Hilka Pratama',
  },

  // ============================================================
  // AWD-15 | HALAMAN 15 (2019) - SINGLE SIGNATURE
  // File: 2019-juara-ii-lomba-pidato-smk.webp
  // ============================================================
  'awd-15': {
    authority: {
      commonName: 'SMK Negeri Kiarapedes',
      organization: 'Dinas Pendidikan Provinsi Jawa Barat',
      organizationalUnit: 'OSIS dan MPK SMK Negeri Kiarapedes',
      country: 'ID',
      stateOrProvince: 'Jawa Barat',
      locality: 'Kiarapedes',
      email: 'smknkiarapedes@disdik.jabarprov.go.id',
      validityYears: 10,
    },
    signer: {
      commonName: 'Abi Suryawan, S.Pd., M.Pd.',
      organization: 'SMK Negeri Kiarapedes',
      organizationalUnit: 'Kepala Sekolah SMK Negeri Kiarapedes (NIP. 19640629 198903 1 007)',
      country: 'ID',
      stateOrProvince: 'Jawa Barat',
      locality: 'Kiarapedes',
      email: 'smknkiarapedes@disdik.jabarprov.go.id',
      validityYears: 5,
    },
    signatureType: 'SINGLE',
    issueDate: '16 November 2019',
    reason: 'Verifikasi Keaslian Piagam Penghargaan Juara 2 Lomba Pidato Maulid Nabi Muhammad SAW 2019 - Alvareza Hilka Pratama',
  },

  // ============================================================
  // AWD-16 | HALAMAN 16 (2019) - SINGLE SIGNATURE
  // File: 2019-juara-i-lomba-pidato-smk.webp
  // ============================================================
  'awd-16': {
    authority: {
      commonName: 'SMK Negeri Kiarapedes',
      organization: 'Dinas Pendidikan Provinsi Jawa Barat',
      organizationalUnit: 'OSIS dan MPK SMK Negeri Kiarapedes',
      country: 'ID',
      stateOrProvince: 'Jawa Barat',
      locality: 'Kiarapedes',
      email: 'smknkiarapedes@disdik.jabarprov.go.id',
      validityYears: 10,
    },
    signer: {
      commonName: 'Abi Suryawan, S.Pd., M.Pd.',
      organization: 'SMK Negeri Kiarapedes',
      organizationalUnit: 'Kepala Sekolah SMK Negeri Kiarapedes (NIP. 19640629 198903 1 007)',
      country: 'ID',
      stateOrProvince: 'Jawa Barat',
      locality: 'Kiarapedes',
      email: 'smknkiarapedes@disdik.jabarprov.go.id',
      validityYears: 5,
    },
    signatureType: 'SINGLE',
    issueDate: '2 November 2019',
    reason: 'Verifikasi Keaslian Piagam Penghargaan Juara 1 Lomba Pidato Hari Sumpah Pemuda 2019 - Alvareza Hilka Pratama',
  },

  // ============================================================
  // AWD-17 | HALAMAN 17 (2019) - MULTI SIGNATURE (3 SIGNERS)
  // File: 2019-juara-harapan-ii-pidato.webp
  // ============================================================
  'awd-17': {
    authority: {
      commonName: 'Panitia Lomba Bulan Bahasa Kabupaten Purwakarta',
      organization: 'Dinas Pendidikan Kab. Purwakarta & MKKS SMK',
      organizationalUnit: 'MKKS SMK, MGMP Bahasa Indonesia, dan Panitia Pelaksana',
      country: 'ID',
      stateOrProvince: 'Jawa Barat',
      locality: 'Purwakarta',
      email: 'disdik@purwakartakab.go.id',
      validityYears: 10,
    },
    signer: {
      commonName: 'Drs. Darta',
      organization: 'MKKS SMK Kabupaten Purwakarta',
      organizationalUnit: 'Ketua MKKS SMK Kabupaten Purwakarta (NIP. 19670908 198903 1 002)',
      country: 'ID',
      stateOrProvince: 'Jawa Barat',
      locality: 'Purwakarta',
      email: 'mkks@purwakartakab.go.id',
      validityYears: 5,
    },
    coSigner: {
      commonName: 'Asep Suryanto, S.Pd.',
      organization: 'MGMP Bahasa Indonesia Kabupaten Purwakarta',
      organizationalUnit: 'Ketua MGMP Bahasa Indonesia Kabupaten Purwakarta (NIP. 19730620 200312 1 005)',
      country: 'ID',
      stateOrProvince: 'Jawa Barat',
      locality: 'Purwakarta',
      email: 'mgmp@purwakartakab.go.id',
      validityYears: 5,
    },
    signers: [
      {
        commonName: 'Drs. Darta',
        organization: 'MKKS SMK Kabupaten Purwakarta',
        organizationalUnit: 'Ketua MKKS SMK Kabupaten Purwakarta (NIP. 19670908 198903 1 002)',
        country: 'ID',
        stateOrProvince: 'Jawa Barat',
        locality: 'Purwakarta',
        email: 'mkks@purwakartakab.go.id',
        validityYears: 5,
      },
      {
        commonName: 'Asep Suryanto, S.Pd.',
        organization: 'MGMP Bahasa Indonesia Kabupaten Purwakarta',
        organizationalUnit: 'Ketua MGMP Bahasa Indonesia Kabupaten Purwakarta (NIP. 19730620 200312 1 005)',
        country: 'ID',
        stateOrProvince: 'Jawa Barat',
        locality: 'Purwakarta',
        email: 'mgmp@purwakartakab.go.id',
        validityYears: 5,
      },
      {
        commonName: 'Farhan Akbar Muttaqi, S.Pd.',
        organization: 'Panitia Lomba Bulan Bahasa',
        organizationalUnit: 'Ketua Pelaksana (NIP. 19930511 201903 1 010)',
        country: 'ID',
        stateOrProvince: 'Jawa Barat',
        locality: 'Purwakarta',
        email: 'panitia@purwakartakab.go.id',
        validityYears: 5,
      },
    ],
    signatureType: 'MULTI',
    issueDate: '3 Oktober 2019',
    reason: 'Verifikasi Keaslian Sertifikat Juara Harapan II Lomba Pidato Bulan Bahasa Tingkat SMK Kabupaten Purwakarta 2019 - Alvareza Hilka Pratama',
  },

  // ============================================================
  // AWD-18 | HALAMAN 18 (2017) - DUAL SIGNATURE
  // File: 2017-kepesertaan-paskibra-kecamatan.webp
  // ============================================================
  'awd-18': {
    authority: {
      commonName: 'Panitia Hari Besar Nasional Kecamatan Kiarapedes',
      organization: 'Pemerintah Kecamatan Kiarapedes Purwakarta',
      organizationalUnit: 'PHBN Kecamatan Kiarapedes',
      country: 'ID',
      stateOrProvince: 'Jawa Barat',
      locality: 'Kiarapedes',
      email: 'kiarapedes@purwakartakab.go.id',
      validityYears: 10,
    },
    signer: {
      commonName: 'Camat Kiarapedes',
      organization: 'Pemerintah Kecamatan Kiarapedes',
      organizationalUnit: 'Camat Kiarapedes (NIP. 19710124 199203 1 005)',
      country: 'ID',
      stateOrProvince: 'Jawa Barat',
      locality: 'Kiarapedes',
      email: 'camat.kiarapedes@purwakartakab.go.id',
      validityYears: 5,
    },
    coSigner: {
      commonName: 'Subachri, AP., M.Si.',
      organization: 'PHBN Kecamatan Kiarapedes',
      organizationalUnit: 'Ketua PHBN Kiarapedes',
      country: 'ID',
      stateOrProvince: 'Jawa Barat',
      locality: 'Kiarapedes',
      email: 'phbn.kiarapedes@purwakartakab.go.id',
      validityYears: 5,
    },
    signatureType: 'DUAL',
    certificateNumber: '01/Pan-PHBN/VIII/2017',
    issueDate: '18 Agustus 2017',
    reason: 'Verifikasi Keaslian Piagam Penghargaan Peserta Pasukan Pengibar Bendera (PASKIBRA) Kecamatan Kiarapedes 2017 - Alvareza Hilka Pratama',
  },

  // ============================================================
  // AWD-19 | HALAMAN 19 (2017) - SINGLE SIGNATURE
  // File: 2017-kepesertaan-olimpiade-ipa.webp
  // ============================================================
  'awd-19': {
    authority: {
      commonName: 'Pemerintah Kabupaten Purwakarta - Dinas Pendidikan',
      organization: 'Pemerintah Kabupaten Purwakarta',
      organizationalUnit: 'Dinas Pendidikan Kabupaten Purwakarta',
      country: 'ID',
      stateOrProvince: 'Jawa Barat',
      locality: 'Purwakarta',
      email: 'disdik@purwakartakab.go.id',
      validityYears: 10,
    },
    signer: {
      commonName: 'H. M. Rasmita NS, S.Pd., M.Pd.',
      organization: 'Dinas Pendidikan Kabupaten Purwakarta',
      organizationalUnit: 'Kepala Dinas Pendidikan Kabupaten Purwakarta (NIP. 19580401 197903 1 002)',
      country: 'ID',
      stateOrProvince: 'Jawa Barat',
      locality: 'Purwakarta',
      email: 'disdik@purwakartakab.go.id',
      validityYears: 5,
    },
    signatureType: 'SINGLE',
    certificateNumber: '861 / 396 / DIKDAS',
    issueDate: '11 Maret 2017',
    reason: 'Verifikasi Keaslian Piagam Penghargaan Peserta Lomba Olimpiade Sains Nasional (OSN) Tingkat SMP Kabupaten Purwakarta 2017 - Alvareza Hilka Pratama',
  },
};
