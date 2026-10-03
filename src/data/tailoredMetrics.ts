import { cvData } from './cvData';
import { cvDataEn } from './cvDataEn';
import { getItemSelectionForPreset } from './presetItemSelections';

export interface MetricItem {
  value: string;
  label: string;
  sublabel: string;
}

const CERT_SHORT_NAMES_ID: Record<string, string> = {
  'cert-1': 'MarkPlus Human Resources (Nilai 9,30/A)',
  'cert-2': 'Saylor BUS300 Operations (IACET)',
  'cert-3': 'Saylor BUS301 HR (IACET)',
  'cert-4': 'Saylor BUS206 MIS (IACET)',
  'cert-5': 'CSSC Six Sigma White Belt',
  'cert-6': 'Google Analytics 4 (GA4)',
  'cert-7': 'Google Ads Search',
  'cert-8': 'Google Web Designer',
};

const CERT_SHORT_NAMES_EN: Record<string, string> = {
  'cert-1': 'MarkPlus Human Resources (Score 9.30/A)',
  'cert-2': 'Saylor BUS300 Operations (IACET)',
  'cert-3': 'Saylor BUS301 HR (IACET)',
  'cert-4': 'Saylor BUS206 MIS (IACET)',
  'cert-5': 'CSSC Six Sigma White Belt',
  'cert-6': 'Google Analytics 4 (GA4)',
  'cert-7': 'Google Ads Search',
  'cert-8': 'Google Web Designer',
};

/**
 * Computes a dynamic, role-aligned certification metric based on the currently active certifications or role preset.
 */
export function getCertificationMetric(
  preset?: string | null,
  language: 'id' | 'en' = 'id',
  activeCertifications?: Record<string, boolean>
): MetricItem {
  const isEn = language === 'en';

  // Determine active cert IDs
  let activeIds: string[] = [];
  if (activeCertifications) {
    activeIds = Object.keys(activeCertifications).filter((k) => activeCertifications[k]);
  } else if (preset) {
    const presetSelection = getItemSelectionForPreset(preset);
    const certMap = presetSelection.certifications;
    activeIds = Object.keys(certMap).filter((k) => certMap[k]);
  } else {
    // Default: all 8 certs
    activeIds = ['cert-1', 'cert-2', 'cert-3', 'cert-4', 'cert-5', 'cert-6', 'cert-7', 'cert-8'];
  }

  const count = activeIds.length;
  const countLabel = isEn
    ? `${count} License${count === 1 ? '' : 's'}`
    : `${count} Lisensi`;

  // Case 1: All 8 or full profile
  if (count >= 8 || (!preset || preset === 'all' || preset === 'optimal') && count >= 6) {
    return {
      value: isEn ? `${count} Licenses` : `${count} Lisensi`,
      label: isEn ? 'Professional Certifications & Licenses' : 'Sertifikasi Profesi & Lisensi Global',
      sublabel: isEn
        ? 'MarkPlus Institute, Saylor Academy USA (IACET Accredited), CSSC Six Sigma & Google Certified'
        : 'MarkPlus Institute, Saylor Academy USA (IACET Accredited), CSSC Six Sigma & Google Certified',
    };
  }

  // Case 2: HR focus (e.g. cert-1, cert-3)
  const hasMarkPlusHR = activeIds.includes('cert-1');
  const hasSaylorHR = activeIds.includes('cert-3');
  const hasOperations = activeIds.includes('cert-2');
  const hasSixSigma = activeIds.includes('cert-5');
  const hasMIS = activeIds.includes('cert-4');
  const hasGoogleAnalytics = activeIds.includes('cert-6');
  const hasGoogleAds = activeIds.includes('cert-7');
  const hasGoogleWebDesigner = activeIds.includes('cert-8');

  if (hasMarkPlusHR && hasSaylorHR && !hasOperations && !hasSixSigma) {
    return {
      value: countLabel,
      label: isEn ? 'Accredited HR Certifications' : 'Sertifikasi & Lisensi HR Terakreditasi',
      sublabel: isEn
        ? 'Human Resources (MarkPlus Institute - Score: 93.00, Grade A) & Saylor Academy USA BUS301 HR Management (IACET Accredited)'
        : 'Human Resources (MarkPlus Institute - Nilai: 93,00, Predikat A) & Saylor Academy USA BUS301 Human Resource (IACET Accredited)',
    };
  }

  if ((hasOperations || hasSixSigma) && !hasGoogleAds && !hasGoogleWebDesigner) {
    return {
      value: countLabel,
      label: isEn ? 'Operations & Six Sigma Accreditations' : 'Sertifikasi Operasional & Six Sigma Terakreditasi',
      sublabel: isEn
        ? 'Saylor Academy USA BUS300 Operations Management (IACET Accredited) & Six Sigma White Belt Certified (CSSC)'
        : 'Saylor Academy USA BUS300 Operations Management (IACET Accredited) & Six Sigma White Belt Certified (CSSC)',
    };
  }

  if (hasMIS && hasGoogleAnalytics && !hasMarkPlusHR) {
    return {
      value: countLabel,
      label: isEn ? 'Information Systems & Analytics Certifications' : 'Sertifikasi Sistem Informasi & Analitik Data',
      sublabel: isEn
        ? 'Saylor Academy USA BUS206 MIS (IACET Accredited) & Google Analytics Certification (GA4)'
        : 'Saylor Academy USA BUS206 Management Information Systems (IACET Accredited) & Google Analytics Certification (GA4)',
    };
  }

  if ((hasGoogleAnalytics || hasGoogleAds || hasGoogleWebDesigner) && !hasMarkPlusHR && !hasOperations) {
    return {
      value: countLabel,
      label: isEn ? 'Official Google Marketing & Analytics Certifications' : 'Sertifikasi Digital Marketing & Google Resmi',
      sublabel: isEn
        ? 'Google Analytics 4 (GA4), Google Ads Search, & Google Web Designer Certified'
        : 'Google Analytics 4 (GA4), Google Ads Search, dan Google Web Designer Certified',
    };
  }

  // Dynamic fallback: build sublabel from active certification short names
  const nameMap = isEn ? CERT_SHORT_NAMES_EN : CERT_SHORT_NAMES_ID;
  const activeNames = activeIds.map((id) => nameMap[id] || id).filter(Boolean);

  return {
    value: countLabel,
    label: isEn ? 'Accredited Professional Certifications' : 'Sertifikasi Profesi & Lisensi Terakreditasi',
    sublabel: activeNames.length > 0 ? activeNames.join(', ') : (isEn ? 'Standardized professional credentials' : 'Kredensial profesi terstandarisasi'),
  };
}

/**
 * Returns the complete array of 13 metrics for the requested language and preset,
 * with metric index 12 (Certifications) dynamically tailored to match the active certifications.
 */
export function getTailoredMetrics(
  preset?: string | null,
  language: 'id' | 'en' = 'id',
  activeCertifications?: Record<string, boolean>
): MetricItem[] {
  const baseData = language === 'en' ? cvDataEn : cvData;
  const certMetric = getCertificationMetric(preset, language, activeCertifications);

  return baseData.metrics.map((m, idx) => {
    if (idx === 12) {
      return certMetric;
    }
    return m;
  });
}
