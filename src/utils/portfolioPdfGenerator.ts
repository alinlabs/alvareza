import { jsPDF } from 'jspdf';
import { getPresetSectionOrders } from '../data/presetSectionOrders';
import { getItemSelectionForPreset } from '../data/presetItemSelections';
import { getPresetKeyFromCodeOrKey, ALL_ROLE_PRESETS } from '../data/rolePresetsConfig';
import { cvData } from '../data/cvData';
import { GasAttachment } from '../types/gasSender';

export interface PortfolioSlideConfig {
  id: string;
  filename: string;
  title: string;
  section: 'I' | 'II' | 'III' | 'IV' | 'V';
  sectionLabel: string;
}

export interface CertItemConfig {
  id: string;
  filename: string;
  title: string;
  issuer: string;
  isPortrait?: boolean;
}

// Peta Solusi Digital CV ke file slide portofolio
export const DIGITAL_SOLUTION_SLIDES: Record<string, { filename: string; title: string }> = {
  'sol-1': { filename: 'mitra gateway.jpg', title: 'MITRA GATEWAY App' },
  'sol-2': { filename: 'logistor.jpg', title: 'LOGISTOR App' },
  'sol-3': { filename: 'hr matrix.jpg', title: 'HR MATRIX App' },
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
    title: 'HR MATRIX App',
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
export function isHrPosition(presetKey?: string, jobTitle?: string): boolean {
  const normKey = (presetKey || '').toLowerCase().trim();
  const canonicalKey = getPresetKeyFromCodeOrKey(normKey) || normKey;
  const matchedPreset = ALL_ROLE_PRESETS.find(
    (p) =>
      p.key.toLowerCase() === canonicalKey ||
      p.code.toLowerCase() === canonicalKey ||
      p.code.toLowerCase() === normKey
  );
  const groupKey = matchedPreset?.groupKey || '';

  if (groupKey === 'hr_talent') return true;

  const keyToTest = `${normKey} ${canonicalKey}`.toLowerCase();
  if (
    keyToTest.includes('hr') ||
    keyToTest.includes('talent') ||
    keyToTest.includes('recruit') ||
    keyToTest.includes('personnel') ||
    keyToTest.includes('personalia') ||
    keyToTest.includes('kepegawaian') ||
    keyToTest.includes('payroll') ||
    keyToTest.includes('lnd') ||
    keyToTest.includes('cnb') ||
    keyToTest.includes('hra') ||
    keyToTest.includes('hrs') ||
    keyToTest.includes('rec') ||
    keyToTest.includes('hbp') ||
    keyToTest.includes('odd') ||
    keyToTest.includes('irl') ||
    keyToTest.includes('pas') ||
    keyToTest.includes('ebr')
  ) {
    return true;
  }

  if (jobTitle && jobTitle.trim()) {
    const cleanTitle = jobTitle.toLowerCase();
    return /\b(hr|hrd|hrga|hrbp|human\s*resources?|sdm|sumber\s*daya\s*manusia|personalia|kepegawaian|talents?|rekrutmen|recruitments?|recruiters?|sourcing|headhunters?|screenings?|hirings?|onboardings?|payrolls?|gaji|remunerasi|c&b|compensations?|benefits?|bpjs|l&d|learnings?|trainings?|pelatihans?|assessors?|psikotes|peoples?|people\s*operations?|industrial\s*relations?|hubungan\s*industrial)\b/i.test(
      cleanTitle
    );
  }

  return false;
}

/**
 * Memeriksa apakah fokus posisi HR adalah spesifik proses rekrutmen & screening kandidat
 */
export function isRecruitmentScreeningFocus(presetKey?: string, jobTitle?: string): boolean {
  const normKey = (presetKey || '').toLowerCase().trim();
  const canonicalKey = getPresetKeyFromCodeOrKey(normKey) || normKey;
  const matchedPreset = ALL_ROLE_PRESETS.find(
    (p) =>
      p.key.toLowerCase() === canonicalKey ||
      p.code.toLowerCase() === canonicalKey ||
      p.code.toLowerCase() === normKey
  );

  const code = (matchedPreset?.code || normKey).toLowerCase();
  const key = (matchedPreset?.key || canonicalKey).toLowerCase();

  if (
    code === 'rec' ||
    code === 'ebr' ||
    key === 'talent_acquisition' ||
    key === 'employer_branding_campus' ||
    key.includes('recruit') ||
    key.includes('sourcing') ||
    key.includes('screening')
  ) {
    return true;
  }

  if (jobTitle && jobTitle.trim()) {
    const clean = jobTitle.toLowerCase();
    return /\b(recruitment|recruiter|rekrutmen|talent\s*acq|sourcing|screening|hiring|headhunter|psikotes|asesmen|assessment|seleksi|campus\s*recruitment|campus\s*hiring)\b/i.test(
      clean
    );
  }

  return false;
}

/**
 * Mengurutkan slide ID secara cerdas sesuai urutan bagian I -> II -> III -> IV -> V
 * Khusus posisi HR di Bagian IV:
 * - Jika fokus Rekrutmen/Screening: Talenty (sol-8) #1, HR Matrix (sol-3) #2
 * - Jika fokus Sistem HR End-to-End pasca Onboarding: HR Matrix (sol-3) #1, Talenty (sol-8) #2
 */
export function sortPortfolioSlideIds(
  slideIds: string[],
  presetKey?: string,
  jobTitle?: string
): string[] {
  const isHr = isHrPosition(presetKey, jobTitle);
  const isRecruitment = isHr && isRecruitmentScreeningFocus(presetKey, jobTitle);

  const sectionRank: Record<string, number> = {
    I: 1,
    II: 2,
    III: 3,
    IV: 4,
    V: 5,
  };

  return [...slideIds].sort((a, b) => {
    const slideA = ALL_PORTFOLIO_SLIDES.find((s) => s.id === a);
    const slideB = ALL_PORTFOLIO_SLIDES.find((s) => s.id === b);

    const rankA = slideA ? sectionRank[slideA.section] || 9 : 9;
    const rankB = slideB ? sectionRank[slideB.section] || 9 : 9;

    if (rankA !== rankB) {
      return rankA - rankB;
    }

    // Jika keduanya berada di Bagian IV (Solusi Digital) dan posisi HR:
    if (isHr && slideA?.section === 'IV' && slideB?.section === 'IV') {
      if (isRecruitment) {
        // Talenty (sol-8) harus sebelum HR Matrix (sol-3)
        if (a === 'sol-8' && b === 'sol-3') return -1;
        if (a === 'sol-3' && b === 'sol-8') return 1;
      } else {
        // HR Matrix (sol-3) harus sebelum Talenty (sol-8)
        if (a === 'sol-3' && b === 'sol-8') return -1;
        if (a === 'sol-8' && b === 'sol-3') return 1;
      }
    }

    // Default canonical index dalam ALL_PORTFOLIO_SLIDES
    const idxA = ALL_PORTFOLIO_SLIDES.findIndex((s) => s.id === a);
    const idxB = ALL_PORTFOLIO_SLIDES.findIndex((s) => s.id === b);
    return (idxA !== -1 ? idxA : 99) - (idxB !== -1 ? idxB : 99);
  });
}

/**
 * Menentukan daftar slide portofolio yang adaptif sesuai logika spesifik CV & Preset Role:
 * - Bagian I: cover.jpg (wajib), key impact.jpg (wajib/opsi)
 * - Bagian II (Showcase per group):
 *     - Group marketing, bd dll -> metodelogi business development.jpg, business consulting.jpg
 *     - Group operations, hr dll -> efficiency operations.jpg, kpi operations.jpg, operations consultant.jpg
 * - Bagian III: Solusi digital yang aktif di CV
 * - Bagian IV: Support digitalisasi (3 slide lengkap jika role condong ke digital/IT/tech/ERP)
 * - Bagian V: Dukungan lisensi (sertifikasi industri.jpg jika ada di CV, sertifikasi google.jpg jika ada di CV)
 */
export function getAdaptivePortfolioSlides(
  presetKey = 'optimal',
  options?: {
    activeDigitalSolutions?: string[];
    activeCertifications?: string[];
    includeKeyImpact?: boolean;
    jobTitle?: string;
  }
): PortfolioSlideConfig[] {
  const normKey = (presetKey || 'optimal').toLowerCase();
  const canonicalKey = getPresetKeyFromCodeOrKey(normKey);
  const presetSelection = getItemSelectionForPreset(canonicalKey);
  const presetOrder = getPresetSectionOrders(canonicalKey);

  const activeSolutions = options?.activeDigitalSolutions && options.activeDigitalSolutions.length > 0
    ? options.activeDigitalSolutions
    : presetOrder.digitalSolutions.filter((solId) => presetSelection.digitalSolutions?.[solId] === true);

  const activeCerts = options?.activeCertifications && options.activeCertifications.length > 0
    ? options.activeCertifications
    : presetOrder.certifications.filter((certId) => presetSelection.certifications?.[certId] === true);

  const slides: PortfolioSlideConfig[] = [];

  // BAGIAN I: Cover & Key Impact
  slides.push({
    id: 'cover',
    filename: 'cover.jpg',
    title: 'Sampul Utama',
    section: 'I',
    sectionLabel: 'Bagian I: Executive Overview',
  });

  if (options?.includeKeyImpact !== false) {
    slides.push({
      id: 'key-impact',
      filename: 'key impact.jpg',
      title: 'Ringkasan Umum',
      section: 'I',
      sectionLabel: 'Bagian I: Executive Overview',
    });
  }

  // Identifikasi kategori preset & group dari rolePresetsConfig
  const keyToTest = (canonicalKey || normKey).toLowerCase();
  const matchedPreset = ALL_ROLE_PRESETS.find(
    (p) => p.key.toLowerCase() === keyToTest || p.code.toLowerCase() === keyToTest
  );
  const groupKey = matchedPreset?.groupKey || '';

  const isHrRole = isHrPosition(canonicalKey || normKey, options?.jobTitle);

  // BAGIAN II: Showcase Per Group (Disesuaikan spesifik dengan bidang role)
  const canonicalDomainOrder = [
    'metodologi-bd',
    'business-consulting',
    'efficiency-ops',
    'kpi-ops',
    'operations-consultant',
  ];

  let rawDomainSlides: { id: string; filename: string; title: string }[] = [];

  if (groupKey === 'business_sales' || groupKey === 'marketing_cx') {
    rawDomainSlides = [
      { id: 'metodologi-bd', filename: 'metodelogi business development.jpg', title: 'Business Development' },
      { id: 'business-consulting', filename: 'business consulting.jpg', title: 'Business Consultant' },
    ];
  } else if (groupKey === 'operations_retail' || groupKey === 'supply_chain_logistics') {
    rawDomainSlides = [
      { id: 'efficiency-ops', filename: 'efficiency operations.jpg', title: 'Efisiensi Operasional' },
      { id: 'kpi-ops', filename: 'kpi operations.jpg', title: 'KPI & Mentoring' },
      { id: 'operations-consultant', filename: 'operations consultant.jpg', title: 'Operations Consultant' },
    ];
  } else if (groupKey === 'hr_talent' || groupKey === 'admin_secretariat') {
    rawDomainSlides = [
      { id: 'efficiency-ops', filename: 'efficiency operations.jpg', title: 'Efisiensi Operasional' },
      { id: 'kpi-ops', filename: 'kpi operations.jpg', title: 'KPI & Mentoring' },
    ];
  } else if (groupKey === 'finance_accounting') {
    rawDomainSlides = [
      { id: 'efficiency-ops', filename: 'efficiency operations.jpg', title: 'Efisiensi Operasional' },
      { id: 'kpi-ops', filename: 'kpi operations.jpg', title: 'KPI & Mentoring' },
      { id: 'business-consulting', filename: 'business consulting.jpg', title: 'Business Consultant' },
    ];
  } else if (groupKey === 'digital_tech') {
    rawDomainSlides = [
      { id: 'efficiency-ops', filename: 'efficiency operations.jpg', title: 'Efisiensi Operasional' },
      { id: 'kpi-ops', filename: 'kpi operations.jpg', title: 'KPI & Mentoring' },
      { id: 'business-consulting', filename: 'business consulting.jpg', title: 'Business Consultant' },
    ];
  } else if (groupKey === 'project_pmo') {
    rawDomainSlides = [
      { id: 'efficiency-ops', filename: 'efficiency operations.jpg', title: 'Efisiensi Operasional' },
      { id: 'kpi-ops', filename: 'kpi operations.jpg', title: 'KPI & Mentoring' },
      { id: 'operations-consultant', filename: 'operations consultant.jpg', title: 'Operations Consultant' },
      { id: 'business-consulting', filename: 'business consulting.jpg', title: 'Business Consultant' },
    ];
  } else if (groupKey === 'strategic_consulting') {
    rawDomainSlides = [
      { id: 'metodologi-bd', filename: 'metodelogi business development.jpg', title: 'Business Development' },
      { id: 'business-consulting', filename: 'business consulting.jpg', title: 'Business Consultant' },
      { id: 'efficiency-ops', filename: 'efficiency operations.jpg', title: 'Efisiensi Operasional' },
      { id: 'kpi-ops', filename: 'kpi operations.jpg', title: 'KPI & Mentoring' },
    ];
  } else {
    // Universal / Featured / Optimal profile: Berikan seluruh 5 slide domain sesuai urutan standar
    rawDomainSlides = [
      { id: 'metodologi-bd', filename: 'metodelogi business development.jpg', title: 'Business Development' },
      { id: 'business-consulting', filename: 'business consulting.jpg', title: 'Business Consultant' },
      { id: 'efficiency-ops', filename: 'efficiency operations.jpg', title: 'Efisiensi Operasional' },
      { id: 'kpi-ops', filename: 'kpi operations.jpg', title: 'KPI & Mentoring' },
      { id: 'operations-consultant', filename: 'operations consultant.jpg', title: 'Operations Consultant' },
    ];
  }

  // Sort Bagian II domain slides strictly according to canonical order
  rawDomainSlides.sort((a, b) => {
    const idxA = canonicalDomainOrder.indexOf(a.id);
    const idxB = canonicalDomainOrder.indexOf(b.id);
    return (idxA !== -1 ? idxA : 99) - (idxB !== -1 ? idxB : 99);
  });

  for (const ds of rawDomainSlides) {
    slides.push({
      id: ds.id,
      filename: ds.filename,
      title: ds.title,
      section: 'II',
      sectionLabel: 'Bagian II: Showcase Domain',
    });
  }

  // BAGIAN III: Dukungan Digitalisasi (Penjelasan Solusi Digital)
  // Ditampilkan sebagai fondasi/arsitektur solusi sebelum daftar aplikasi
  const isDigitalTechFocus =
    groupKey === 'digital_tech' ||
    keyToTest.includes('it_') ||
    keyToTest.includes('erp') ||
    keyToTest.includes('developer') ||
    keyToTest.includes('product_') ||
    keyToTest.includes('software') ||
    keyToTest.includes('digital') ||
    keyToTest.includes('automation') ||
    keyToTest.includes('bi_') ||
    keyToTest.includes('tech');

  if (activeSolutions.length > 0 || isDigitalTechFocus) {
    const digitalPack = [
      {
        id: 'dig-trans-overview',
        filename: 'digital transformation overview.jpg',
        title: 'Ringkasan Solusi Digital',
      },
      {
        id: 'dig-solution-ecosystem',
        filename: 'digital solution.jpg',
        title: 'Ekosistem Solusi Digital',
      },
      {
        id: 'automation-ai',
        filename: 'automation & ai integration.jpg',
        title: 'Otomasi & Integrasi AI',
      },
    ];

    for (const item of digitalPack) {
      if (!slides.some((s) => s.filename === item.filename)) {
        slides.push({
          id: item.id,
          filename: item.filename,
          title: item.title,
          section: 'III',
          sectionLabel: 'Bagian III: Dukungan Digitalisasi',
        });
      }
    }
  }

  // BAGIAN IV: Solusi Digital Berdasarkan CV (Aplikasi)
  if (isHrRole) {
    // KHUSUS POSISI HR: Utamakan dan sertakan HANYA antara HR MATRIX dan TALENTY saja.
    // Alasan:
    // - Talenty berfokus pada recruitment process, psikotes & asesmen online, screening & scoring pelamar.
    // - HR Matrix berfokus pada sistem tata kelola HR menyeluruh end-to-end setelah on-boarding (payroll, BPJS, PPh 21, presensi QR, KPI).
    const isRecruitmentFocus = isRecruitmentScreeningFocus(canonicalKey || normKey, options?.jobTitle);

    // Jika fokus rekrutmen/screening: TALENTY #1, HR MATRIX #2.
    // Untuk seluruh posisi HR lainnya (HR Operations, Payroll, HRGA, L&D, dsb): HR MATRIX #1, TALENTY #2.
    const hrSolutions = isRecruitmentFocus
      ? ['sol-8', 'sol-3']
      : ['sol-3', 'sol-8'];

    for (const solId of hrSolutions) {
      const matched = DIGITAL_SOLUTION_SLIDES[solId];
      if (matched && !slides.some((s) => s.filename === matched.filename)) {
        slides.push({
          id: solId,
          filename: matched.filename,
          title: matched.title,
          section: 'IV',
          sectionLabel: 'Bagian IV: Solusi Digital',
        });
      }
    }
  } else {
    // Non-HR standard behavior
    const canonicalSolOrder = ['sol-1', 'sol-2', 'sol-4', 'sol-6', 'sol-5', 'sol-3', 'sol-8'];
    const orderedActiveSolutions = [...activeSolutions].sort((a, b) => {
      const idxA = canonicalSolOrder.indexOf(a);
      const idxB = canonicalSolOrder.indexOf(b);
      return (idxA !== -1 ? idxA : 99) - (idxB !== -1 ? idxB : 99);
    });

    for (const solId of orderedActiveSolutions) {
      const matched = DIGITAL_SOLUTION_SLIDES[solId];
      if (matched) {
        if (!slides.some((s) => s.filename === matched.filename)) {
          slides.push({
            id: solId,
            filename: matched.filename,
            title: matched.title,
            section: 'IV',
            sectionLabel: 'Bagian IV: Solusi Digital',
          });
        }
      }
    }
  }

  // BAGIAN V: Dukungan Lisensi
  // - sertifikasi industri.jpg jika ada sertifikasi industri di CV
  const industrialCertIds = ['cert-1', 'cert-2', 'cert-3', 'cert-4', 'cert-5'];
  const hasIndustrialCerts = activeCerts.some((c) => industrialCertIds.includes(c));

  if (hasIndustrialCerts) {
    slides.push({
      id: 'cert-industri',
      filename: 'sertifikasi industri.jpg',
      title: 'Sertifikasi Industri',
      section: 'V',
      sectionLabel: 'Bagian V: Dukungan Lisensi',
    });
  }

  // - sertifikasi google.jpg jika ada sertifikasi Google di CV
  const googleCertIds = ['cert-6', 'cert-7', 'cert-8'];
  const hasGoogleCerts = activeCerts.some((c) => googleCertIds.includes(c));

  if (hasGoogleCerts) {
    slides.push({
      id: 'cert-google',
      filename: 'sertifikasi google.jpg',
      title: 'Sertifikasi Google',
      section: 'V',
      sectionLabel: 'Bagian V: Dukungan Lisensi',
    });
  }

  return slides;
}

/**
 * Mengambil daftar file sertifikat fisik resmi yang aktif di CV untuk kompilasi sertifikasi.pdf
 */
export function getActiveCertificateList(
  presetKey = 'optimal',
  customActiveCerts?: string[]
): CertItemConfig[] {
  const normKey = (presetKey || 'optimal').toLowerCase();
  const canonicalKey = getPresetKeyFromCodeOrKey(normKey);
  const presetSelection = getItemSelectionForPreset(canonicalKey);
  const presetOrder = getPresetSectionOrders(canonicalKey);

  const activeCerts = customActiveCerts && customActiveCerts.length > 0
    ? customActiveCerts
    : presetOrder.certifications.filter((certId) => presetSelection.certifications?.[certId] === true);

  const results: CertItemConfig[] = [];

  for (const certId of activeCerts) {
    const certConfig = CERTIFICATE_FILES[certId];
    if (certConfig && !results.some((c) => c.id === certId)) {
      results.push(certConfig);
    }
  }

  return results;
}

// In-Memory Cache untuk Base64 Gambar agar rendering PDF cepat dan tidak berulang kali fetch
const imageBase64Cache = new Map<string, string>();

export interface ImageOptimizationOptions {
  maxDimension?: number;
  quality?: number;
}

/**
 * Helper untuk mengambil dan mengompresi gambar dari /portofolio/ atau /sertifikasi/
 * Menggunakan HTML5 Canvas resampling agar ukuran file PDF tetap sangat ringan (<2MB)
 * namun teks dan grafis tetap tajam & jernih (High-Fidelity).
 */
export async function loadImageAsDataUrl(
  imagePath: string,
  options: ImageOptimizationOptions = { maxDimension: 1800, quality: 0.83 }
): Promise<string> {
  const maxDim = options.maxDimension || 1800;
  const quality = options.quality ?? 0.83;
  const cacheKey = `${imagePath}_${maxDim}_${quality}`;

  if (imageBase64Cache.has(cacheKey)) {
    return imageBase64Cache.get(cacheKey)!;
  }

  // Fetch file dari direktori public
  const response = await fetch(imagePath);
  if (!response.ok) {
    throw new Error(`Gagal memuat gambar: ${imagePath} (${response.status})`);
  }

  const blob = await response.blob();

  // Optimasi resolusi dan kompresi kanvas di sisi klien (Browser)
  if (typeof document !== 'undefined' && typeof window !== 'undefined') {
    try {
      const optimizedDataUrl = await new Promise<string>((resolve, reject) => {
        const img = new Image();
        const objectUrl = URL.createObjectURL(blob);

        img.onload = () => {
          URL.revokeObjectURL(objectUrl);
          try {
            let targetWidth = img.naturalWidth || img.width;
            let targetHeight = img.naturalHeight || img.height;

            // Hitung skala jika dimensi melebihi batas resolusi optimal
            if (targetWidth > maxDim || targetHeight > maxDim) {
              if (targetWidth >= targetHeight) {
                targetHeight = Math.round((targetHeight * maxDim) / targetWidth);
                targetWidth = maxDim;
              } else {
                targetWidth = Math.round((targetWidth * maxDim) / targetHeight);
                targetHeight = maxDim;
              }
            }

            const canvas = document.createElement('canvas');
            canvas.width = targetWidth;
            canvas.height = targetHeight;
            const ctx = canvas.getContext('2d');

            if (!ctx) {
              throw new Error('Canvas 2D context tidak tersedia');
            }

            // Gunakan interpolation berkualitas tinggi untuk ketajaman teks/grafis
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, targetWidth, targetHeight);
            ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

            const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
            resolve(compressedDataUrl);
          } catch (e) {
            reject(e);
          }
        };

        img.onerror = () => {
          URL.revokeObjectURL(objectUrl);
          reject(new Error(`Gagal memproses gambar: ${imagePath}`));
        };

        img.src = objectUrl;
      });

      imageBase64Cache.set(cacheKey, optimizedDataUrl);
      return optimizedDataUrl;
    } catch (err) {
      console.warn('Canvas optimization fallback to standard reader:', err);
    }
  }

  // Fallback standar bila canvas tidak dapat diakses
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      imageBase64Cache.set(cacheKey, dataUrl);
      resolve(dataUrl);
    };
    reader.onerror = () => reject(new Error(`Gagal membaca berkas: ${imagePath}`));
    reader.readAsDataURL(blob);
  });
}

/**
 * Generate PDF Portofolio Adaptif secara Base64 Attachment Object
 */
export async function buildAdaptivePortfolioPdf(options: {
  preset?: string;
  selectedSlideIds?: string[];
  activeDigitalSolutions?: string[];
  activeCertifications?: string[];
  includeKeyImpact?: boolean;
  jobTitle?: string;
  onProgress?: (current: number, total: number, slideTitle: string) => void;
}): Promise<GasAttachment> {
  const presetKey = options.preset || 'optimal';
  let slides: PortfolioSlideConfig[] = [];

  const isHr = isHrPosition(presetKey, options.jobTitle);

  if (options.selectedSlideIds && options.selectedSlideIds.length > 0) {
    let rawSlideIds = options.selectedSlideIds;

    // Untuk posisi HR: Pastikan di Bagian IV HANYA ada HR Matrix dan Talenty, dan diurutkan sesuai prioritas
    if (isHr) {
      rawSlideIds = rawSlideIds.filter((id) => {
        const s = ALL_PORTFOLIO_SLIDES.find((item) => item.id === id);
        if (s && s.section === 'IV' && s.id !== 'sol-3' && s.id !== 'sol-8') {
          return false;
        }
        return true;
      });
      rawSlideIds = sortPortfolioSlideIds(rawSlideIds, presetKey, options.jobTitle);
    }

    // Susun slide persis sesuai urutan
    slides = rawSlideIds
      .map((id) => ALL_PORTFOLIO_SLIDES.find((s) => s.id === id))
      .filter((s): s is PortfolioSlideConfig => Boolean(s));
  } else {
    slides = getAdaptivePortfolioSlides(presetKey, {
      activeDigitalSolutions: options.activeDigitalSolutions,
      activeCertifications: options.activeCertifications,
      includeKeyImpact: options.includeKeyImpact !== false,
      jobTitle: options.jobTitle,
    });
  }

  if (slides.length === 0) {
    throw new Error('Tidak ada slide portofolio yang dipilih.');
  }

  // Portofolio menggunakan A4 Portrait (210mm x 297mm) persis dengan rasio gambar 1414x2000
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;

  for (let i = 0; i < slides.length; i++) {
    const slide = slides[i];
    if (options.onProgress) {
      options.onProgress(i + 1, slides.length, slide.title);
    }

    if (i > 0) {
      doc.addPage('a4', 'portrait');
    }

    const imagePath = `/portofolio/${slide.filename}`;
    const imgDataUrl = await loadImageAsDataUrl(imagePath);

    doc.addImage(imgDataUrl, 'JPEG', 0, 0, pageWidth, pageHeight, undefined, 'FAST');
  }

  const dataUri = doc.output('datauristring');
  const base64Data = dataUri.split(',')[1] || '';
  const sizeBytes = Math.round((base64Data.length * 3) / 4);

  const filename = 'portofolio_alvareza.pdf';

  return {
    filename,
    mimeType: 'application/pdf',
    base64: base64Data,
    sizeBytes,
  };
}

/**
 * Generate PDF Kompilasi Sertifikasi Resmi secara Base64 Attachment Object
 */
export async function buildCertificatesCompilationPdf(options: {
  preset?: string;
  selectedCertIds?: string[];
  activeCertifications?: string[];
  jobTitle?: string;
  onProgress?: (current: number, total: number, certTitle: string) => void;
}): Promise<GasAttachment> {
  const presetKey = options.preset || 'optimal';
  let certs: CertItemConfig[] = [];

  if (options.selectedCertIds) {
    // Susun sertifikat persis sesuai ID yang dipilih pengguna via checkbox
    certs = options.selectedCertIds
      .map((id) => CERTIFICATE_FILES[id])
      .filter((c): c is CertItemConfig => Boolean(c));
  } else {
    certs = getActiveCertificateList(presetKey, options.activeCertifications);
  }

  if (certs.length === 0) {
    throw new Error('Tidak ada sertifikat yang dipilih untuk dikompilasi.');
  }

  // Tentukan orientasi halaman pertama
  const firstCert = certs[0];
  const firstOrientation = firstCert.isPortrait ? 'portrait' : 'landscape';

  const doc = new jsPDF({
    orientation: firstOrientation,
    unit: 'mm',
    format: 'a4',
  });

  for (let i = 0; i < certs.length; i++) {
    const cert = certs[i];
    if (options.onProgress) {
      options.onProgress(i + 1, certs.length, cert.title);
    }

    const isPortrait = !!cert.isPortrait;
    const pageWidth = isPortrait ? 210 : 297;
    const pageHeight = isPortrait ? 297 : 210;

    if (i > 0) {
      doc.addPage('a4', isPortrait ? 'portrait' : 'landscape');
    }

    const imagePath = `/sertifikasi/${cert.filename}`;
    const imgDataUrl = await loadImageAsDataUrl(imagePath);

    doc.addImage(imgDataUrl, 'JPEG', 0, 0, pageWidth, pageHeight, undefined, 'FAST');
  }

  const dataUri = doc.output('datauristring');
  const base64Data = dataUri.split(',')[1] || '';
  const sizeBytes = Math.round((base64Data.length * 3) / 4);

  const filename = 'sertifikasi_alvareza.pdf';

  return {
    filename,
    mimeType: 'application/pdf',
    base64: base64Data,
    sizeBytes,
  };
}
