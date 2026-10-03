import { EmailLanguage } from '../types/jobApplication';
import { matchExactJobPositionFromCatalog, stripOcrArtifactsFromText } from '../data/jobPositionsCatalog';

/**
 * Noise words and slogans that should NEVER be recognized as company names or positions
 */
export const NOISE_SLOGANS = [
  'we are hiring', "we're hiring", 'hiring now', 'we are open', 'open recruitment',
  'walk in interview', 'job vacancy', 'career opportunity', 'join our team', 'join us',
  'dibutuhkan segera', 'lowongan kerja', 'loker terbaru', 'loker', 'penerimaan karyawan',
  'kualifikasi', 'persyaratan', 'syarat & ketentuan', 'syarat', 'tanggung jawab',
  'job description', 'responsibilities', 'requirements', 'qualifications', 'benefits',
  'cara melamar', 'how to apply', 'send your cv', 'kirim cv anda', 'kirim lamaran',
  'penempatan', 'work location', 'lokasi kerja', 'contact person', 'hubungi kami',
  'info lowongan', 'open position', 'urgently needed', 'urgent needed', 'segera'
];

/**
 * Detect language from text (Indonesian vs English)
 */
export function detectLanguageFromText(rawText: string): EmailLanguage {
  const text = (rawText || '').toLowerCase();

  const englishTokens = [
    'hiring', 'we are hiring', 'vacancy', 'job vacancy', 'qualifications',
    'requirements', 'responsibilities', 'apply', 'send your cv', 'send cv',
    'send your resume', 'bachelor degree', 'experience', 'full time', 'part time',
    'work location', 'benefits', 'join our team', 'job description', 'skills',
    'good communication', 'fluent in english', 'must have', 'years of experience',
    'looking for', 'position', 'apply now', 'please send', 'recruitment', 'candidate',
    'minimum degree', 'salary', 'working hours', 'role', 'we\'re hiring', 'careers'
  ];

  const indonesianTokens = [
    'lowongan kerja', 'loker', 'dibutuhkan', 'kualifikasi', 'persyaratan',
    'tanggung jawab', 'kirim berkas', 'kirim cv', 'surat lamaran', 'pria/wanita',
    'pendidikan minimal', 'pengalaman minimal', 'penempatan', 'usia maksimal',
    'bersedia ditempatkan', 'gaji', 'perusahaan', 'diutamakan', 'surat lamaran',
    'pria', 'wanita', 'jurusan', 'lamaran pekerjaan', 'walk in interview', 'rekrutmen'
  ];

  let enScore = 0;
  let idScore = 0;

  for (const token of englishTokens) {
    if (text.includes(token)) enScore += 2;
  }
  for (const token of indonesianTokens) {
    if (text.includes(token)) idScore += 2;
  }

  // Common phrasing weights
  if (/\b(we\s+are\s+looking\s+for|open\s+position|job\s+title|apply\s+to|send\s+resume|join\s+our\s+team)\b/i.test(text)) {
    enScore += 5;
  }
  if (/\b(dibutuhkan\s+segera|kualifikasi\s*:|persyaratan\s*:|kirim\s+lamaran|kirimkan\s+cv|lowongan\s+kerja)\b/i.test(text)) {
    idScore += 5;
  }

  return enScore > idScore ? 'en' : 'id';
}

/**
 * Cleans OCR artifacts from string
 */
export function cleanOcrLine(str: string): string {
  return str
    .replace(/^[^a-zA-Z0-9(]+/, '')
    .replace(/[^a-zA-Z0-9.)]+$/, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/**
 * Formats string to clean Title Case
 */
export function cleanTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => {
      // Special acronyms
      if (['hr', 'hrd', 'sdm', 'pmo', 'b2b', 'sop', 'erp', 'crm', 'ui', 'ux', 'it'].includes(word)) {
        return word.toUpperCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

/**
 * Strict Company Name Extractor
 * Identifies legitimate company entities (PT, CV, UD, Yayasan, Firma)
 * Rejects resume action instructions like "CV Terbaru Ke Email" and returns "" if not found.
 */
export function extractCompanyNameStrict(lines: string[], email?: string): string {
  const RESUME_ACTION_WORDS = [
    'terbaru', 'ke email', 'email', 'pdf', 'portofolio', 'portfolio', 'lamaran', 'lengkap',
    'beserta', 'format', 'ats', 'subjek', 'subject', 'hrd@', '@gmail', 'kirim', 'kirimkan',
    'upload', 'submit', 'berkas', 'surat', 'foto', 'ijazah', 'transkrip', 'hubungi', 'wa:'
  ];

  for (const rawLine of lines) {
    const line = cleanOcrLine(rawLine);
    if (!line || line.length < 3 || line.length > 55) continue;

    // Reject noise slogans and submission commands
    if (NOISE_SLOGANS.some(slogan => line.toLowerCase().includes(slogan))) continue;
    if (/^(?:kirim|kirimkan|send|submit|lampirkan|upload|email)\b/i.test(line)) continue;

    // Pattern: PT / CV / UD / Yayasan / Firma
    const legalMatch = line.match(/\b(PT\.?|CV\.?|UD\.?|Yayasan|Firma)\s+([A-Za-z0-9\s.,&-]{2,50})/i);
    if (legalMatch) {
      const prefix = legalMatch[1].toUpperCase().replace(/\.$/, '');
      const namePart = legalMatch[2].trim();
      const lowerName = namePart.toLowerCase();

      // Check if this is Curriculum Vitae (resume) instruction
      if (RESUME_ACTION_WORDS.some(w => lowerName.includes(w))) {
        continue;
      }

      if (namePart.length >= 3 && !/^(anda|kamu|kami|saya|di|ke|dan|atau)\b/i.test(namePart)) {
        return `${prefix}. ${cleanTitleCase(namePart)}`;
      }
    }
  }

  // Strict user rule: If no PT / CV is present, return empty string ""
  return '';
}

/**
 * Strict Job Position / Role Extractor
 * Matches against exact canonical job catalog and strips OCR artifacts like 'Ee', '1.', 'We'.
 */
export function extractJobPositionStrict(lines: string[], filename?: string, language: EmailLanguage = 'id'): string {
  // 1. Check exact matcher from canonical job catalog
  const catalogMatch = matchExactJobPositionFromCatalog('', lines);
  if (catalogMatch) {
    return catalogMatch;
  }

  // Comprehensive catalog of real job position patterns
  const rolePatterns: RegExp[] = [
    // Operations & Management
    /\b(store\s+manager|store\s+supervisor|supervisor\s+operasional|operational\s+manager|kepala\s+toko|kepala\s+cabang|branch\s+manager|asisten\s+manager|assistant\s+manager|area\s+manager)\b/i,
    /\b(operations\s+specialist|business\s+operations|operation\s+lead|operations\s+officer|staff\s+operasional|operational\s+staff|management\s+trainee|leader|team\s+leader)\b/i,
    // HR & Administration
    /\b(hr\s+specialist|hr\s+generalist|human\s+resources|hrd\s+staff|hr\s+officer|recruiter|talent\s+acquisition|spesialis\s+sdm|personalia)\b/i,
    /\b(staff\s+administrasi|admin\s+operasional|admin\s+gudang|admin\s+logistik|admin\s+sosmed|admin\s+sales|administrative\s+officer|data\s+entry)\b/i,
    // Project & Business Development
    /\b(project\s+manager|project\s+officer|project\s+coordinator|pmo|business\s+development|account\s+manager|account\s+executive|b2b\s+sales|sales\s+executive|marketing\s+executive)\b/i,
    // Retail, F&B & Services
    /\b(barista|cashier|kasir|crew\s+store|pramusaji|waiter|waitress|customer\s+service|front\s+liner|receptionist|telemarketing)\b/i,
    // Tech & Creative
    /\b(graphic\s+designer|content\s+creator|social\s+media\s+specialist|digital\s+marketer|web\s+developer|frontend\s+developer|backend\s+developer|ui\/ux\s+designer|copywriter)\b/i,
    // Generic titles
    /\b(supervisor|manager|officer|specialist|analyst|coordinator|staff)\b/i
  ];

  // 2. Look for explicit position prefixes with artifact stripping
  for (const rawLine of lines) {
    const stripped = stripOcrArtifactsFromText(rawLine);
    const posMatch = stripped.match(/(?:posisi|position|role|sebagai|job\s*title|opening\s*for)\s*[:=\-]\s*(.+)/i);
    if (posMatch && posMatch[1]) {
      const extracted = cleanOcrLine(posMatch[1]);
      const exactMatch = matchExactJobPositionFromCatalog(extracted);
      if (exactMatch) return exactMatch;
      if (extracted.length >= 3 && extracted.length <= 45 && !extracted.includes('@')) {
        return cleanTitleCase(extracted);
      }
    }
  }

  // 3. Match against known role catalog
  for (const rawLine of lines) {
    const line = stripOcrArtifactsFromText(rawLine);
    if (line.length < 3 || line.length > 50 || line.includes('@')) continue;

    // Must not be a requirement line (e.g. "Pria/Wanita", "Minimal S1", "Pengalaman 1 tahun")
    if (/^(minimal|pendidikan|pengalaman|usia|pria|wanita|gaji|bersedia|mampu|menguasai|surat|cv|kirim)/i.test(line)) continue;

    for (const pattern of rolePatterns) {
      if (pattern.test(line)) {
        const exact = matchExactJobPositionFromCatalog(line);
        return exact || cleanTitleCase(line);
      }
    }
  }

  // 4. Fallback from filename if provided
  if (filename) {
    const cleanFn = filename.toLowerCase();
    if (cleanFn.includes('store') || cleanFn.includes('ritel') || cleanFn.includes('retail')) {
      return language === 'en' ? 'Store Operations Supervisor' : 'Supervisor Operasional Ritel';
    }
    if (cleanFn.includes('hr') || cleanFn.includes('human')) {
      return language === 'en' ? 'Human Resources Specialist' : 'Spesialis SDM / HR Specialist';
    }
    if (cleanFn.includes('b2b') || cleanFn.includes('sales') || cleanFn.includes('bizdev')) {
      return language === 'en' ? 'B2B Growth & Account Specialist' : 'B2B Growth & Account Specialist';
    }
    if (cleanFn.includes('pmo') || cleanFn.includes('project')) {
      return language === 'en' ? 'Project Management Officer' : 'Project Management Officer (PMO)';
    }
    if (cleanFn.includes('admin')) {
      return language === 'en' ? 'Operations & Administrative Officer' : 'Staff Administrasi & Operasional';
    }
  }

  return language === 'en' ? 'Operations & Management Specialist' : 'Spesialis Operasional & Manajemen';
}

/**
 * Strict Email Extractor & OCR Fixer
 */
export function extractEmailStrict(text: string): string {
  // Normalize common OCR misreads in emails
  const sanitized = text
    .replace(/\[at\]|\(at\)|_at_|@\s+/gi, '@')
    .replace(/\s+@/g, '@')
    .replace(/@([a-zA-Z0-9.-]+)\s+\.([a-zA-Z]{2,})/g, '@$1.$2');

  const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/gi;
  const emails = sanitized.match(emailRegex) || [];

  // Filter out applicant's own email and common template domains
  const validEmails = emails.filter(e => {
    const low = e.toLowerCase();
    return !low.includes('alvareza') && !low.includes('mycivy') && !low.includes('example.com') && !low.includes('domain.com');
  });

  if (validEmails.length === 0) return '';

  let bestEmail = validEmails[0];

  // Fix common OCR domain typos
  bestEmail = bestEmail
    .replace(/gmai1\.com/i, 'gmail.com')
    .replace(/gmall\.com/i, 'gmail.com')
    .replace(/gmaill\.com/i, 'gmail.com')
    .replace(/yaho\.com/i, 'yahoo.com')
    .replace(/\.con$/i, '.com')
    .replace(/\.co\.ld$/i, '.co.id');

  return bestEmail.toLowerCase();
}

/**
 * Strict Phone / WhatsApp Extractor & OCR Fixer
 */
export function extractPhoneStrict(text: string): string {
  // Normalize OCR digit errors in numbers
  const lines = text.split(/\r?\n/);

  for (const line of lines) {
    if (/(?:wa|whatsapp|telp|telepon|phone|hp|contact|hubungi|call)\b/i.test(line) || /(?:\+62|62|08)[0-9\s\-]{8,16}/.test(line)) {
      // Clean phone numbers
      const cleaned = line
        .replace(/[oO]/g, '0')
        .replace(/[lI]/g, '1')
        .replace(/[B]/g, '8');

      const match = cleaned.match(/(?:\+62|62|08)[0-9\s\-]{8,16}/);
      if (match) {
        const rawPhone = match[0].replace(/[\s\-]/g, '');
        // Validate length and exclude applicant's own number
        if (rawPhone.length >= 10 && rawPhone.length <= 15 && !rawPhone.includes('85797184059')) {
          if (rawPhone.startsWith('08')) {
            return rawPhone;
          } else if (rawPhone.startsWith('62')) {
            return '0' + rawPhone.slice(2);
          } else if (rawPhone.startsWith('+62')) {
            return '0' + rawPhone.slice(3);
          }
          return rawPhone;
        }
      }
    }
  }

  return '';
}

/**
 * Extract Subject Format Notice from Poster if present
 */
export function extractSubjectFormatNotice(lines: string[]): string {
  for (const rawLine of lines) {
    const line = cleanOcrLine(rawLine);
    if (/(?:format\s*subjek|format\s*subject|subjek\s*email|subject\s*email|subject\s*:|subjek\s*:)/i.test(line)) {
      const notice = line.replace(/^(?:format\s*subjek|format\s*subject|subjek\s*email|subject\s*email|subject|subjek)\s*[:=\-]\s*/i, '').trim();
      if (notice.length > 2) return notice;
    }
  }
  return '';
}
