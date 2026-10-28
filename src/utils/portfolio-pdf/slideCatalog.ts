import { PortfolioSlideConfig, CertItemConfig } from './types';

export const DIGITAL_SOLUTION_SLIDES: Record<string, { filename: string; title: string }> = {
  'sol-1': { filename: 'mitra gateway.jpg', title: 'MITRA GATEWAY App' },
  'sol-2': { filename: 'logistor.jpg', title: 'LOGISTOR App' },
  'sol-3': { filename: 'hr matrix.jpg', title: 'HRMATRIKS App' },
  'sol-8': { filename: 'talenty.jpg', title: 'TALENTY App' },
  'sol-4': { filename: 'next marketing.jpg', title: 'NEXTMARK App' },
  'sol-5': { filename: 'vynance.jpg', title: 'VYNANCE App' },
  'sol-6': { filename: 'my diby.jpg', title: 'MY DIBY App' },
};

// Peta Sertifikat CV ke file sertifikat fisik di public/sertifikasi/
export const CERTIFICATE_FILES: Record<string, CertItemConfig> = {
  'cert-5': {
    id: 'cert-5',
    filename: 'Six Sigma.jpg',
    title: 'Six Sigma C.S.S.S.',
    issuer: 'The Council for Six Sigma Certification (USA)',
    isPortrait: false,
  },
  'cert-3': {
    id: 'cert-3',
    filename: 'HRM Saylor.jpg',
    title: 'HRM S.A., IACET',
    issuer: 'Saylor Academy (IACET USA)',
    isPortrait: false,
  },
  'cert-2': {
    id: 'cert-2',
    filename: 'OPM Saylor.jpg',
    title: 'OPM S.A., IACET',
    issuer: 'Saylor Academy (IACET USA)',
    isPortrait: false,
  },
  'cert-4': {
    id: 'cert-4',
    filename: 'MIS Saylor.jpg',
    title: 'MIS S.A., IACET',
    issuer: 'Saylor Academy (IACET USA)',
    isPortrait: false,
  },
  'cert-1': {
    id: 'cert-1',
    filename: 'HR MICP.jpg',
    title: 'HR MICP',
    issuer: 'MarkPlus Institute',
    isPortrait: true, // 1414x2000 A4 Portrait
  },
  'cert-6': {
    id: 'cert-6',
    filename: 'Google Analytics.jpg',
    title: 'GA4 Google',
    issuer: 'Google Digital Academy',
    isPortrait: false,
  },
  'cert-7': {
    id: 'cert-7',
    filename: 'Google Ads Search.jpg',
    title: 'Ads Google',
    issuer: 'Google Digital Academy',
    isPortrait: false,
  },
  'cert-8': {
    id: 'cert-8',
    filename: 'Google Web.jpg',
    title: 'Web Google',
    issuer: 'Google Digital Academy',
    isPortrait: false,
  },
};

/**
 * Daftar Lengkap Seluruh Slide Portofolio (19 Slide)
 */
export const ALL_PORTFOLIO_SLIDES: PortfolioSlideConfig[] = [
  // Bagian I: Executive Overview
  {
    id: 'cover',
    filename: 'cover.jpg',
    title: 'Sampul Utama',
    section: 'I',
    sectionLabel: 'Bagian I: Executive Overview',
  },
  {
    id: 'key-impact',
    filename: 'key impact.jpg',
    title: 'Ringkasan Umum',
    section: 'I',
    sectionLabel: 'Bagian I: Executive Overview',
  },

  // Bagian II: Showcase Domain
  {
    id: 'metodologi-bd',
    filename: 'metodelogi business development.jpg',
    title: 'Business Development',
    section: 'II',
    sectionLabel: 'Bagian II: Showcase Domain',
  },
  {
    id: 'business-consulting',
    filename: 'business consulting.jpg',
    title: 'Business Consultant',
    section: 'II',
    sectionLabel: 'Bagian II: Showcase Domain',
  },
  {
    id: 'efficiency-ops',
    filename: 'efficiency operations.jpg',
    title: 'Efisiensi Operasional',
    section: 'II',
    sectionLabel: 'Bagian II: Showcase Domain',
  },
  {
    id: 'kpi-ops',
    filename: 'kpi operations.jpg',
    title: 'KPI & Mentoring',
    section: 'II',
    sectionLabel: 'Bagian II: Showcase Domain',
  },
  {
    id: 'operations-consultant',
    filename: 'operations consultant.jpg',
    title: 'Operations Consultant',
    section: 'II',
    sectionLabel: 'Bagian II: Showcase Domain',
  },

  // Bagian III: Dukungan Digitalisasi (Penjelasan Solusi Digital)
  {
    id: 'dig-trans-overview',
    filename: 'digital transformation overview.jpg',
    title: 'Ringkasan Solusi Digital',
    section: 'III',
    sectionLabel: 'Bagian III: Dukungan Digitalisasi',
  },
  {
    id: 'dig-solution-ecosystem',
    filename: 'digital solution.jpg',
    title: 'Ekosistem Solusi Digital',
    section: 'III',
    sectionLabel: 'Bagian III: Dukungan Digitalisasi',
  },
  {
    id: 'automation-ai',
    filename: 'automation & ai integration.jpg',
    title: 'Otomasi & Integrasi AI',
    section: 'III',
    sectionLabel: 'Bagian III: Dukungan Digitalisasi',
  },

  // Bagian IV: Solusi Digital Berdasarkan CV (Aplikasi)
  {
    id: 'sol-1',
    filename: 'mitra gateway.jpg',
    title: 'MITRA GATEWAY App',
    section: 'IV',
    sectionLabel: 'Bagian IV: Solusi Digital',
  },
  {
    id: 'sol-2',
    filename: 'logistor.jpg',
    title: 'LOGISTOR App',
    section: 'IV',
    sectionLabel: 'Bagian IV: Solusi Digital',
  },
  {
    id: 'sol-4',
    filename: 'next marketing.jpg',
    title: 'NEXTMARK App',
    section: 'IV',
    sectionLabel: 'Bagian IV: Solusi Digital',
  },
  {
    id: 'sol-6',
    filename: 'my diby.jpg',
    title: 'MY DIBY App',
    section: 'IV',
    sectionLabel: 'Bagian IV: Solusi Digital',
  },
  {
    id: 'sol-5',
    filename: 'vynance.jpg',
    title: 'VYNANCE App',
    section: 'IV',
    sectionLabel: 'Bagian IV: Solusi Digital',
  },
  {
    id: 'sol-3',
    filename: 'hr matrix.jpg',
    title: 'HRMATRIKS App',
    section: 'IV',
    sectionLabel: 'Bagian IV: Solusi Digital',
  },
  {
    id: 'sol-8',
    filename: 'talenty.jpg',
    title: 'TALENTY App',
    section: 'IV',
    sectionLabel: 'Bagian IV: Solusi Digital',
  },

  // Bagian V: Dukungan Lisensi
  {
    id: 'cert-industri',
    filename: 'sertifikasi industri.jpg',
    title: 'Sertifikasi Industri',
    section: 'V',
    sectionLabel: 'Bagian V: Dukungan Lisensi',
  },
  {
    id: 'cert-google',
    filename: 'sertifikasi google.jpg',
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
  CERTIFICATE_FILES['cert-6'],
  CERTIFICATE_FILES['cert-7'],
  CERTIFICATE_FILES['cert-8'],
];

/**
 * Memeriksa apakah preset role atau judul lowongan pekerjaan masuk dalam kategori Human Resources (HR)
 */
