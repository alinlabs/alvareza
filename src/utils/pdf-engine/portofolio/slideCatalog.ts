import { PortfolioSlideConfig, CertItemConfig } from './types';

export const DIGITAL_SOLUTION_SLIDES: Record<string, { filename: string; title: string }> = {
  'sol-1': { filename: 'mitra-gateway-app.webp', title: 'MITRA GATEWAY App' },
  'sol-2': { filename: 'logistor-app.webp', title: 'LOGISTOR App' },
  'sol-3': { filename: 'hrmatrix-app.webp', title: 'HRMATRIKS App' },
  'sol-8': { filename: 'talenty-app.webp', title: 'TALENTY App' },
  'sol-4': { filename: 'nextmark-app.webp', title: 'NEXTMARK App' },
  'sol-5': { filename: 'vynance-app.webp', title: 'VYNANCE App' },
  'sol-6': { filename: 'my-diby-app.webp', title: 'MY DIBY App' },
};

// Peta Sertifikat CV ke file sertifikat fisik di public/sertifikasi/
export const CERTIFICATE_FILES: Record<string, CertItemConfig> = {
  'cert-5': {
    id: 'cert-5',
    filename: 'six-sigma.webp',
    title: 'Six Sigma C.S.S.S.',
    issuer: 'The Council for Six Sigma Certification (USA)',
    isPortrait: false,
  },
  'cert-3': {
    id: 'cert-3',
    filename: 'hrs-saylor.webp',
    title: 'HRM S.A., IACET',
    issuer: 'Saylor Academy (IACET USA)',
    isPortrait: false,
  },
  'cert-2': {
    id: 'cert-2',
    filename: 'opm-saylor.webp',
    title: 'OPM S.A., IACET',
    issuer: 'Saylor Academy (IACET USA)',
    isPortrait: false,
  },
  'cert-4': {
    id: 'cert-4',
    filename: 'mis-saylor.webp',
    title: 'MIS S.A., IACET',
    issuer: 'Saylor Academy (IACET USA)',
    isPortrait: false,
  },
  'cert-1': {
    id: 'cert-1',
    filename: 'hr-mpic.webp',
    title: 'HR MICP',
    issuer: 'MarkPlus Institute',
    isPortrait: true, // 1414x2000 A4 Portrait
  },
  'cert-6': {
    id: 'cert-6',
    filename: 'analytics-google.webp',
    title: 'GA4 Google',
    issuer: 'Google Digital Academy',
    isPortrait: false,
  },
  'cert-7': {
    id: 'cert-7',
    filename: 'ads-google.webp',
    title: 'Ads Google',
    issuer: 'Google Digital Academy',
    isPortrait: false,
  },
  'cert-8': {
    id: 'cert-8',
    filename: 'web-google.webp',
    title: 'Web Google',
    issuer: 'Google Digital Academy',
    isPortrait: false,
  },
  'cert-akuntansi': {
    id: 'cert-akuntansi',
    filename: 'kompetensi-akuntansi-depan.webp',
    filenames: ['kompetensi-akuntansi-depan.webp', 'kompetensi-akuntansi-belakang.webp'],
    title: 'Kompetensi Akuntansi',
    issuer: 'Sertifikasi Kompetensi Akuntansi Resmi',
    isPortrait: true,
  },
};

/**
 * Daftar Lengkap Seluruh Slide Portofolio (19 Slide)
 */
export const ALL_PORTFOLIO_SLIDES: PortfolioSlideConfig[] = [
  // Bagian I: Executive Overview
  {
    id: 'cover',
    filename: 'cover.webp',
    title: 'Sampul Utama',
    section: 'I',
    sectionLabel: 'Bagian I: Executive Overview',
  },
  {
    id: 'key-impact',
    filename: 'key-impact.webp',
    title: 'Ringkasan Umum',
    section: 'I',
    sectionLabel: 'Bagian I: Executive Overview',
  },

  // Bagian II: Showcase Domain
  {
    id: 'metodologi-bd',
    filename: 'metodelogi-bd.webp',
    title: 'Business Development',
    section: 'II',
    sectionLabel: 'Bagian II: Showcase Domain',
  },
  {
    id: 'business-consulting',
    filename: 'business-consulting.webp',
    title: 'Business Consultant',
    section: 'II',
    sectionLabel: 'Bagian II: Showcase Domain',
  },
  {
    id: 'efficiency-ops',
    filename: 'efficiency-operations.webp',
    title: 'Efisiensi Operasional',
    section: 'II',
    sectionLabel: 'Bagian II: Showcase Domain',
  },
  {
    id: 'kpi-ops',
    filename: 'kpi-operations.webp',
    title: 'KPI & Mentoring',
    section: 'II',
    sectionLabel: 'Bagian II: Showcase Domain',
  },
  {
    id: 'operations-consultant',
    filename: 'operations-consultant.webp',
    title: 'Operations Consultant',
    section: 'II',
    sectionLabel: 'Bagian II: Showcase Domain',
  },

  // Bagian III: Dukungan Digitalisasi (Penjelasan Solusi Digital)
  {
    id: 'dig-trans-overview',
    filename: 'digital-transformation-overview.webp',
    title: 'Ringkasan Solusi Digital',
    section: 'III',
    sectionLabel: 'Bagian III: Dukungan Digitalisasi',
  },
  {
    id: 'dig-solution-ecosystem',
    filename: 'digital-solution.webp',
    title: 'Ekosistem Solusi Digital',
    section: 'III',
    sectionLabel: 'Bagian III: Dukungan Digitalisasi',
  },
  {
    id: 'automation-ai',
    filename: 'automation-ai-integration.webp',
    title: 'Otomasi & Integrasi AI',
    section: 'III',
    sectionLabel: 'Bagian III: Dukungan Digitalisasi',
  },

  // Bagian IV: Solusi Digital Berdasarkan CV (Aplikasi)
  {
    id: 'sol-1',
    filename: 'mitra-gateway-app.webp',
    title: 'MITRA GATEWAY App',
    section: 'IV',
    sectionLabel: 'Bagian IV: Solusi Digital',
  },
  {
    id: 'sol-2',
    filename: 'logistor-app.webp',
    title: 'LOGISTOR App',
    section: 'IV',
    sectionLabel: 'Bagian IV: Solusi Digital',
  },
  {
    id: 'sol-4',
    filename: 'nextmark-app.webp',
    title: 'NEXTMARK App',
    section: 'IV',
    sectionLabel: 'Bagian IV: Solusi Digital',
  },
  {
    id: 'sol-6',
    filename: 'my-diby-app.webp',
    title: 'MY DIBY App',
    section: 'IV',
    sectionLabel: 'Bagian IV: Solusi Digital',
  },
  {
    id: 'sol-5',
    filename: 'vynance-app.webp',
    title: 'VYNANCE App',
    section: 'IV',
    sectionLabel: 'Bagian IV: Solusi Digital',
  },
  {
    id: 'sol-3',
    filename: 'hrmatrix-app.webp',
    title: 'HRMATRIKS App',
    section: 'IV',
    sectionLabel: 'Bagian IV: Solusi Digital',
  },
  {
    id: 'sol-8',
    filename: 'talenty-app.webp',
    title: 'TALENTY App',
    section: 'IV',
    sectionLabel: 'Bagian IV: Solusi Digital',
  },

  // Bagian V: Dukungan Lisensi
  {
    id: 'cert-industri',
    filename: 'sertifikasi-industri.webp',
    title: 'Sertifikasi Industri',
    section: 'V',
    sectionLabel: 'Bagian V: Dukungan Lisensi',
  },
  {
    id: 'cert-google',
    filename: 'sertifikasi-google.webp',
    title: 'Sertifikasi Google',
    section: 'V',
    sectionLabel: 'Bagian V: Dukungan Lisensi',
  },
];

/**
 * Daftar Lengkap Seluruh Berkas Sertifikat Fisik Resmi (8 Dokumen)
 */
export const ALL_CERTIFICATES_LIST: CertItemConfig[] = [
  CERTIFICATE_FILES['cert-5'],
  CERTIFICATE_FILES['cert-2'],
  CERTIFICATE_FILES['cert-3'],
  CERTIFICATE_FILES['cert-4'],
  CERTIFICATE_FILES['cert-1'],
  CERTIFICATE_FILES['cert-akuntansi'],
  CERTIFICATE_FILES['cert-6'],
  CERTIFICATE_FILES['cert-7'],
  CERTIFICATE_FILES['cert-8'],
];

/**
 * Memeriksa apakah preset role atau judul lowongan pekerjaan masuk dalam kategori Human Resources (HR)
 */
