import { getPresetSectionOrders } from '../../data/preset/SectionOrders';
import { getItemSelectionForPreset } from '../../data/preset/ItemSelections';
import { getPresetKeyFromCodeOrKey, ALL_ROLE_PRESETS } from '../../data/preset/RoleConfig';
import { cvData } from '../../data/cv';
import { PortfolioSlideConfig, CertItemConfig } from './types';
import {
  ALL_PORTFOLIO_SLIDES,
  ALL_CERTIFICATES_LIST,
  DIGITAL_SOLUTION_SLIDES,
  CERTIFICATE_FILES,
} from './slideCatalog';

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
