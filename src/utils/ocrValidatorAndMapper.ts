/**
 * OCR VALIDATOR & INPUT MAPPER SERVICE
 * File Khusus untuk Validasi, Penyaringan Ketat (Sanitasi),
 * dan Pemetaan Hasil OCR ke Kolom-Kolom Input Formulir Lamaran Kerja.
 *
 * Aturan Khusus:
 * 1. NAMA PERUSAHAAN:
 *    - Hanya ambil jika secara eksplisit memiliki awalan badan usaha hukum resmi seperti "PT.", "PT", "CV.", "CV", "UD.", "UD", "Yayasan", "Firma".
 *    - JIKA TIDAK ADA kata PT. atau CV., KOSONGKAN kolom nama perusahaan (hasil = "").
 * 2. POSISI / JABATAN:
 *    - Cocokkan secara ketat dengan keyword-keyword posisi kerja (misal: "HRD", "Staff", "Manager", "Supervisor", "Marketing", dll).
 *    - Jika ditemukan kata seperti "HRD" dan "Staff", hasilkan "HRD Staff" yang bersih.
 *    - Buang semua teks syarat/kualifikasi ("Minimal S1", "Pria/Wanita", "Usia maksimal", dll).
 * 3. FORMAT SUBJEK OTOMATIS:
 *    - Deteksi instruksi subjek pada poster (contoh: "Subject: HRD - Nama", "Subject : POSISI_NAMA", "Subjek: [Posisi] - [Nama]").
 *    - Isi otomatis dengan posisi yang tervalidasi dan nama kandidat "Alvareza" (atau "Alvareza Hilka Pratama").
 *    - Sesuaikan huruf kapital: Jika format poster menggunakan KAPITAL (contoh: POSISI_NAMA), hasilkan kapital (contoh: MARKETING_ALVAREZA). Jika Title Case (contoh: HRD - Nama), hasilkan "HRD - Alvareza".
 *    - Jika tidak ada format khusus di poster:
 *      - Bila ada PT/CV: "Lamaran Pekerjaan: [Posisi] - [Perusahaan] - Alvareza Hilka Pratama"
 *      - Bila tanpa PT/CV: "Lamaran Pekerjaan: [Posisi] - Alvareza Hilka Pratama"
 */

import { EmailLanguage, JobScanResult } from '../types/jobApplication';
import { APPLICANT_DATA, generateTailoredApplicationDraft } from './jobApplicationDraft';
import {
  matchExactJobPositionFromCatalog,
  stripOcrArtifactsFromText,
  ALL_CANONICAL_POSITIONS,
} from '../data/jobPositionsCatalog';

export interface ValidatedJobFormFields {
  companyName: string;
  jobTitle: string;
  recipientEmail: string;
  ccEmail?: string;
  showCcField?: boolean;
  recipientPhone: string;
  emailSubject: string;
  hasExplicitSubject?: boolean;
  emailBody: string;
  keyRequirements: string[];
  language: EmailLanguage;
  formatSubjectNotice: string;
  isValidated: boolean;
  validationNotes: string[];
}

/**
 * Daftar slogan, tajuk poster, dan teks umum yang DILARANG menjadi nama perusahaan atau posisi.
 */
const FORBIDDEN_BANNER_SLOGANS = [
  'we are hiring',
  "we're hiring",
  'hiring now',
  'we are open',
  'open recruitment',
  'walk in interview',
  'job vacancy',
  'career opportunity',
  'join our team',
  'join us',
  'dibutuhkan segera',
  'lowongan kerja',
  'loker terbaru',
  'loker',
  'penerimaan karyawan',
  'kualifikasi',
  'persyaratan',
  'syarat & ketentuan',
  'syarat',
  'tanggung jawab',
  'job description',
  'responsibilities',
  'requirements',
  'qualifications',
  'benefits',
  'cara melamar',
  'how to apply',
  'send your cv',
  'kirim cv anda',
  'kirim lamaran',
  'penempatan',
  'work location',
  'lokasi kerja',
  'contact person',
  'hubungi kami',
  'info lowongan',
  'open position',
  'urgently needed',
  'urgent needed',
  'segera',
  'waspada penipuan',
  'deskripsi pekerjaan'
];

/**
 * Pola teks syarat/kualifikasi yang DILARANG masuk ke kolom Nama Posisi
 */
const FORBIDDEN_REQUIREMENT_PATTERNS = [
  /^minimal\s+/i,
  /^pendidikan\s+/i,
  /^pengalaman\s+/i,
  /^usia\s+/i,
  /^umur\s+/i,
  /^pria\s*\/?\s*wanita/i,
  /^laki-laki/i,
  /^perempuan/i,
  /^wanita/i,
  /^pria/i,
  /^gaji\s+/i,
  /^salary\s+/i,
  /^bersedia\s+/i,
  /^mampu\s+/i,
  /^menguasai\s+/i,
  /^surat\s+lamaran/i,
  /^kirimkan\s+/i,
  /^fresh\s+graduate/i,
  /^max\s+\d+/i,
  /^maksimal\s+\d+/i,
  /^d3\s*\/?\s*s1/i,
  /^sma\s*\/?\s*smk/i,
  /^memiliki\s+/i,
  /^memahami\s+/i,
  /^terbiasa\s+/i,
  /^teliti\s+/i,
  /^dapat\s+bergabung/i
];

/**
 * Katalog komprehensif keyword posisi kerja
 */
const JOB_POSITION_KEYWORDS = [
  // Multi-word combinations (Checked first for highest priority)
  'hrd staff', 'hr staff', 'hr specialist', 'hr generalist', 'hr officer', 'spesialis sdm', 'hrd & ga', 'hr & ga',
  'store manager', 'store supervisor', 'supervisor operasional', 'operational manager', 'kepala toko', 'kepala cabang',
  'staff administrasi', 'admin operasional', 'admin gudang', 'admin logistik', 'admin sales', 'admin sosmed', 'admin finance',
  'business development', 'account manager', 'account executive', 'sales executive', 'marketing executive', 'marketing staff',
  'project manager', 'project coordinator', 'project officer', 'pmo',
  'customer service', 'front liner', 'telemarketing', 'call center',
  'graphic designer', 'content creator', 'social media specialist', 'ui/ux designer',
  'quality control', 'qc inspector', 'quality assurance',
  'operator produksi', 'operator mesin', 'teknisi listrik', 'teknisi mesin',
  'crew store', 'crew outlet', 'service crew',

  // Single word roles
  'hrd', 'hr', 'staff', 'supervisor', 'manager', 'spv', 'admin', 'administrator', 'recruiter',
  'marketer', 'marketing', 'sales', 'barista', 'kasir', 'cashier', 'pramusaji', 'waiter', 'waitress',
  'designer', 'developer', 'programmer', 'analyst', 'coordinator', 'lead', 'leader',
  'driver', 'kurir', 'helper', 'gudang', 'teknisi', 'operator'
];

/**
 * Kata-kata instruksi kirim berkas / Curriculum Vitae yang DILARANG dianggap sebagai PT/CV Perusahaan.
 */
const RESUME_AND_ACTION_KEYWORDS = [
  'terbaru', 'ke email', 'email', 'pdf', 'portofolio', 'portfolio', 'lamaran', 'lengkap',
  'beserta', 'format', 'ats', 'subjek', 'subject', 'hrd@', '@gmail', 'kirim', 'kirimkan',
  'upload', 'submit', 'berkas', 'surat', 'foto', 'ijazah', 'transkrip', 'hubungi',
  'whatsapp', 'wa:', 'ke :', 'ke:', 'recruitment', 'rekrutmen', 'anda', 'kamu',
  'posisi', 'link', 'google form', 'gform', 'scan barcode', 'barcode', 'qr code',
  'bawa berkas', 'bawa lamaran', 'walk in', 'berikut', 'melalui', 'tuliskan'
];

/**
 * 1. Validasi & Penyaringan Nama Perusahaan
 * ATURAN USER:
 * - Hanya ambil jika ada istilah kata PT. atau CV. (atau Yayasan/UD/Firma) yang merupakan nama badan usaha resmi.
 * - Istilah "Kirim CV Terbaru", "CV anda", "CV ke email" adalah berkas lamaran, BUKAN perusahaan!
 * - Jika tidak ada PT atau CV perusahaan asli, KOSONGKAN ("").
 */
export function sanitizeCompanyName(rawCompany?: string, lines: string[] = []): { company: string; note?: string } {
  const allLines = [...(rawCompany ? [rawCompany] : []), ...lines];

  // Cari baris yang mengandung PT, PT., CV, CV., UD, UD., Yayasan, Firma
  for (const rawLine of allLines) {
    const line = (rawLine || '')
      .replace(/^[^a-zA-Z0-9(]+/, '')
      .replace(/[^a-zA-Z0-9.)]+$/, '')
      .trim();

    if (!line || line.length < 3 || line.length > 65) continue;
    if (FORBIDDEN_BANNER_SLOGANS.some(s => line.toLowerCase().includes(s))) continue;

    // Reject jika baris merupakan instruksi kirim berkas/email
    if (/^(?:kirim|kirimkan|send|submit|lampirkan|upload|email)\b/i.test(line)) continue;

    // Pola eksplisit: PT, PT., CV, CV., UD, UD., Yayasan, Firma
    const legalEntityMatch = line.match(/\b(PT\.?|CV\.?|UD\.?|Yayasan|Firma)\s+([A-Za-z0-9\s.,&-]{2,50})/i);
    if (legalEntityMatch) {
      const prefix = legalEntityMatch[1].toUpperCase().replace(/\.$/, '');
      const namePart = legalEntityMatch[2].trim();
      const lowerName = namePart.toLowerCase();

      // Cek apakah ini kata Curriculum Vitae (resume) e.g. "CV Terbaru Ke Email", "CV Anda", "CV Format PDF"
      const isResumeWord = RESUME_AND_ACTION_KEYWORDS.some(kw => lowerName.includes(kw));
      if (isResumeWord) {
        continue; // Lewatkan karena ini berkas resume, bukan nama perusahaan
      }

      // Validasi panjang dan kualitas nama perusahaan
      if (namePart.length >= 3 && !/^(anda|kamu|kami|saya|di|ke|dan|atau)\b/i.test(namePart)) {
        const formatted = `${prefix}. ${formatTitleCase(namePart)}`;
        return { company: formatted, note: 'Terdeteksi dari nama badan usaha resmi (PT/CV)' };
      }
    }

    // Pola jika PT/CV ada di belakang (contoh: "Indofood Sukses Makmur PT")
    const legalSuffixMatch = line.match(/^([A-Za-z0-9\s.,&-]{2,50})\s+(PT\.?|CV\.?|Tbk\.?)$/i);
    if (legalSuffixMatch) {
      const namePart = legalSuffixMatch[1].trim();
      const lowerName = namePart.toLowerCase();
      if (!RESUME_AND_ACTION_KEYWORDS.some(kw => lowerName.includes(kw))) {
        const suffix = legalSuffixMatch[2].toUpperCase().replace(/\.$/, '');
        const formatted = `${suffix}. ${formatTitleCase(namePart)}`;
        return { company: formatted, note: 'Terdeteksi dari nama badan usaha resmi' };
      }
    }
  }

  // Jika TIDAK ADA istilah PT / CV / UD, KOSONGKAN sesuai permintaan user
  return { company: '', note: 'Tidak ditemukan istilah PT atau CV pada poster (dikosongkan).' };
}

/**
 * 2. Validasi & Penyaringan Posisi / Jabatan
 * ATURAN USER:
 * - Cocokkan HANYA nama posisi standar dari ribuan keyword katalog posisi.
 * - Buang artefak OCR seperti "Ee", "We", "1.", atau kata sampah yang tidak ada di keyword posisi.
 * - Contoh: jika ada "Ee HRD Staff" -> hasilkan "HRD Staff" yang bersih.
 */
export function sanitizeJobTitle(rawTitle?: string, lines: string[] = [], language: EmailLanguage = 'id'): { jobTitle: string; note?: string } {
  const allLines = [...(rawTitle ? [rawTitle] : []), ...lines];

  // 1. Pencocokan Presisi Tinggi dengan Katalog Ribuan Posisi Resmi
  const catalogMatch = matchExactJobPositionFromCatalog(rawTitle || '', allLines);
  if (catalogMatch) {
    return {
      jobTitle: catalogMatch,
      note: `Terverifikasi dari katalog posisi standar: ${catalogMatch}`
    };
  }

  // 2. Jika belum ditemukan langsung di katalog, bersihkan artefak OCR pada setiap baris
  for (const rawLine of allLines) {
    const strippedLine = stripOcrArtifactsFromText(rawLine || '');
    if (!strippedLine || strippedLine.length < 2 || strippedLine.length > 50) continue;
    if (FORBIDDEN_BANNER_SLOGANS.some(s => strippedLine.toLowerCase() === s)) continue;
    if (FORBIDDEN_REQUIREMENT_PATTERNS.some(p => p.test(strippedLine))) continue;

    const lineMatch = matchExactJobPositionFromCatalog(strippedLine);
    if (lineMatch) {
      return {
        jobTitle: lineMatch,
        note: `Terverifikasi dari katalog posisi standar: ${lineMatch}`
      };
    }

    const lower = strippedLine.toLowerCase();

    // Cek kecocokan dengan keyword posisi
    for (const kw of JOB_POSITION_KEYWORDS) {
      if (lower === kw || lower.includes(kw) || kw.includes(lower)) {
        return {
          jobTitle: formatRoleTitleCase(kw),
          note: `Cocok dengan keyword posisi: ${kw.toUpperCase()}`
        };
      }
    }
  }

  // 3. Cek kombinasi kata kunci spesifik
  const fullCombinedText = allLines.join(' ').toLowerCase();
  if (fullCombinedText.includes('hrd') && (fullCombinedText.includes('staff') || fullCombinedText.includes('staf'))) {
    return { jobTitle: 'HRD Staff', note: 'Terdeteksi dari kombinasi keyword "HRD" dan "Staff"' };
  }
  if (fullCombinedText.includes('store') && fullCombinedText.includes('manager')) {
    return { jobTitle: 'Store Manager', note: 'Terdeteksi dari kombinasi keyword "Store" dan "Manager"' };
  }
  if (fullCombinedText.includes('admin') && fullCombinedText.includes('operasional')) {
    return { jobTitle: 'Admin Operasional', note: 'Terdeteksi dari kombinasi keyword "Admin Operasional"' };
  }
  if (fullCombinedText.includes('staff') && fullCombinedText.includes('administrasi')) {
    return { jobTitle: 'Staff Administrasi', note: 'Terdeteksi dari kombinasi keyword "Staff Administrasi"' };
  }
  if (fullCombinedText.includes('marketing') && fullCombinedText.includes('staff')) {
    return { jobTitle: 'Marketing Staff', note: 'Terdeteksi dari kombinasi keyword "Marketing Staff"' };
  }

  // 4. Fallback jika tidak ada keyword spesifik
  const defaultTitle = language === 'en' ? 'Operations & Management Specialist' : 'Spesialis Operasional & Manajemen';
  return { jobTitle: defaultTitle, note: 'Menggunakan profil keahlian utama pelamar' };
}

/**
 * 3. Validasi & Format Subjek Otomatis Berdasarkan Pola Poster
 * ATURAN USER:
 * - Jika poster ada "Subject : POSISI_NAMA" -> MARKETING_ALVAREZA (all caps)
 * - Jika poster ada "Subject : HRD - Nama" -> "HRD - Alvareza" (title case)
 * - Huruf kapital vs normal mengikuti contoh template di poster
 * - Ambil data dari posisi yang sudah divalidasi
 */
export function formatEmailSubjectAuto(params: {
  rawSubjectNotice?: string;
  rawText?: string;
  validatedJobTitle: string;
  companyName: string;
  language: EmailLanguage;
}): { emailSubject: string; formatSubjectNotice: string } {
  const { rawSubjectNotice = '', rawText = '', validatedJobTitle, companyName, language } = params;

  // 1. Cari instruksi subjek di rawText jika rawSubjectNotice kosong
  let noticeLine = rawSubjectNotice.trim();
  if (!noticeLine && rawText) {
    const lines = rawText.split(/\r?\n/);
    for (const line of lines) {
      if (/(?:format\s*subjek|format\s*subject|subjek\s*email|subject\s*email|subject\s*:|subjek\s*:)/i.test(line)) {
        noticeLine = line.replace(/^(?:format\s*subjek|format\s*subject|subjek\s*email|subject\s*email|subject|subjek)\s*[:=\-]\s*/i, '').trim();
        break;
      }
    }
  }

  // 2. Jika ada format khusus pada poster
  if (noticeLine) {
    let result = noticeLine;

    // Cek apakah template menggunakan huruf kapital semua (misal: "POSISI_NAMA" atau "HRD_NAMA")
    const isAllCapsTemplate = /^[A-Z0-9_\-\s:\[\]]+$/.test(noticeLine.replace(/[_\-\s:\[\]]/g, ''));

    // Tentukan nama pengganti (Alvareza) sesuai kapitalisasi
    const nameReplacement = isAllCapsTemplate ? 'ALVAREZA' : 'Alvareza';
    const fullNameReplacement = isAllCapsTemplate ? 'ALVAREZA HILKA PRATAMA' : 'Alvareza Hilka Pratama';
    const positionReplacement = isAllCapsTemplate ? validatedJobTitle.toUpperCase() : validatedJobTitle;

    // Ganti placeholder nama
    if (/\[nama\s*lengkap\]|\[fullname\]/i.test(result)) {
      result = result.replace(/\[nama\s*lengkap\]|\[fullname\]/gi, fullNameReplacement);
    } else if (/\[nama\]|\[name\]|\[nama\s*pelamar\]/i.test(result)) {
      result = result.replace(/\[nama\]|\[name\]|\[nama\s*pelamar\]/gi, nameReplacement);
    } else if (/\bNAMA\b/.test(result)) {
      result = result.replace(/\bNAMA\b/g, 'ALVAREZA');
    } else if (/\bNama\b/.test(result)) {
      result = result.replace(/\bNama\b/g, 'Alvareza');
    } else if (/\bnama\b/i.test(result)) {
      result = result.replace(/\bnama\b/gi, nameReplacement);
    }

    // Ganti placeholder posisi (bila ada kata generic POSISI / [Posisi] / POSITION)
    if (/\[posisi\]|\[position\]|\[job\s*title\]/i.test(result)) {
      result = result.replace(/\[posisi\]|\[position\]|\[job\s*title\]/gi, positionReplacement);
    } else if (/\bPOSISI\b/.test(result)) {
      result = result.replace(/\bPOSISI\b/g, validatedJobTitle.toUpperCase());
    } else if (/\bPosisi\b/.test(result)) {
      result = result.replace(/\bPosisi\b/g, validatedJobTitle);
    } else if (/\bposition\b/i.test(result)) {
      result = result.replace(/\bposition\b/gi, positionReplacement);
    }

    // Bersihkan sisa kurung siku jika ada
    result = result.replace(/[\[\]]/g, '').trim();

    return {
      emailSubject: result,
      formatSubjectNotice: noticeLine,
    };
  }

  // 3. Jika TIDAK ADA format subjek khusus di poster, gunakan subjek standar resmi
  let defaultSubject = '';
  if (companyName && companyName.trim().length > 0) {
    defaultSubject = language === 'en'
      ? `Job Application: ${validatedJobTitle} - ${companyName} - Alvareza Hilka Pratama`
      : `Lamaran Pekerjaan: ${validatedJobTitle} - ${companyName} - Alvareza Hilka Pratama`;
  } else {
    // Jika nama perusahaan kosong (karena poster tidak mencantumkan PT/CV)
    defaultSubject = language === 'en'
      ? `Job Application: ${validatedJobTitle} - Alvareza Hilka Pratama`
      : `Lamaran Pekerjaan: ${validatedJobTitle} - Alvareza Hilka Pratama`;
  }

  return {
    emailSubject: defaultSubject,
    formatSubjectNotice: '',
  };
}

/**
 * 4. Validasi & Perbaikan Artefak OCR pada Email
 */
export function sanitizeRecipientEmail(rawEmail?: string, rawText: string = ''): { email: string; note?: string } {
  let email = (rawEmail || '').trim();

  // Jika kosong, cari di teks
  if (!email && rawText) {
    const sanitized = rawText
      .replace(/\[at\]|\(at\)|_at_|@\s+/gi, '@')
      .replace(/\s+@/g, '@')
      .replace(/@([a-zA-Z0-9.-]+)\s+\.([a-zA-Z]{2,})/g, '@$1.$2');

    const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/gi;
    const matches = sanitized.match(emailRegex) || [];
    const valid = matches.filter(e => !e.toLowerCase().includes('alvareza') && !e.toLowerCase().includes('mycivy'));
    if (valid.length > 0) {
      email = valid[0];
    }
  }

  if (!email) {
    return { email: '' };
  }

  // Perbaiki error umum OCR
  let cleaned = email.toLowerCase()
    .replace(/gmai1\.com/g, 'gmail.com')
    .replace(/gmall\.com/g, 'gmail.com')
    .replace(/gmaill\.com/g, 'gmail.com')
    .replace(/yaho\.com/g, 'yahoo.com')
    .replace(/\.con$/g, '.com')
    .replace(/\.co\.ld$/g, '.co.id');

  const isValidEmailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleaned);
  if (!isValidEmailFormat) {
    return { email: '', note: 'Format email tidak valid.' };
  }

  return { email: cleaned };
}

/**
 * 5. Validasi & Perbaikan Nomor WhatsApp / Telepon
 */
export function sanitizeRecipientPhone(rawPhone?: string, rawText: string = ''): { phone: string; note?: string } {
  let phone = (rawPhone || '').trim();

  if (!phone && rawText) {
    const lines = rawText.split(/\r?\n/);
    for (const line of lines) {
      if (/(?:wa|whatsapp|telp|telepon|phone|hp|contact|hubungi|call)\b/i.test(line) || /(?:\+62|62|08)[0-9\s\-]{8,16}/.test(line)) {
        const cleanedLine = line
          .replace(/[oO]/g, '0')
          .replace(/[lI]/g, '1')
          .replace(/[B]/g, '8');

        const match = cleanedLine.match(/(?:\+62|62|08)[0-9\s\-]{8,16}/);
        if (match) {
          phone = match[0];
          break;
        }
      }
    }
  }

  if (!phone) return { phone: '' };

  const digits = phone.replace(/[^0-9+]/g, '');
  if (digits.length < 10 || digits.length > 16 || digits.includes('85797184059')) {
    return { phone: '' };
  }

  let formatted = digits;
  if (formatted.startsWith('+62')) {
    formatted = '0' + formatted.slice(3);
  } else if (formatted.startsWith('62')) {
    formatted = '0' + formatted.slice(2);
  }

  return { phone: formatted };
}

/**
 * Helper: Format Role Title Case dengan akronim profesional
 */
export function formatRoleTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => {
      if (['hr', 'hrd', 'sdm', 'pmo', 'b2b', 'sop', 'erp', 'crm', 'ui', 'ux', 'it', 'cs', 'pt', 'cv', 'ga', 'qc', 'qa'].includes(word)) {
        return word.toUpperCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

/**
 * Helper: General Title Case
 */
function formatTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * PARSER SMART TEKS FORMAT KOMMA
 * Mengisi otomatis kolom input dari format koma:
 * [Nama Perusahaan], [Posisi], [Email Tujuan], [Email CC (Opsional)], [No. WA (Opsional)], [Subject (Opsional)]
 *
 * Contoh 1: PT. Abc, HRD Manager, hrd@abc.com, hrd.cc@abc.com, HRD - Alvareza
 * Contoh 2: PT. Abc, HRD Manager, hrd@abc.com, HRD - Alvareza (tanpa CC)
 * Contoh 3: PT. Abc, HRD Manager, hrd@abc.com, hrd.cc@abc.com, 083312345678, HRD - Alvareza (dengan CC + No WA)
 * Contoh 4: PT. Abc, HRD Manager, hrd@abc.com, 083312345678, HRD - Alvareza (tanpa CC + ada No WA)
 */
export function parseCommaSeparatedSmartText(rawText: string): ValidatedJobFormFields | null {
  if (!rawText || typeof rawText !== 'string') return null;

  const trimmed = rawText.trim();
  if (!trimmed.includes(',')) return null;

  const rawParts = trimmed.split(',').map(p => p.trim()).filter(Boolean);
  if (rawParts.length < 2) return null;

  const emails: string[] = [];
  const phones: string[] = [];
  const textItems: string[] = [];

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  for (const part of rawParts) {
    if (emailRegex.test(part) || (part.includes('@') && !part.includes(' '))) {
      const sanitized = sanitizeRecipientEmail(part, '').email || part;
      emails.push(sanitized);
    } else {
      const digitsOnly = part.replace(/[^0-9+]/g, '');
      const isPhoneLike = (
        part.startsWith('08') ||
        part.startsWith('+62') ||
        part.startsWith('62') ||
        (digitsOnly.length >= 9 && digitsOnly.length <= 15 && /^[0-9\+\-\s\(\)]+$/.test(part))
      );
      if (isPhoneLike) {
        const sanitized = sanitizeRecipientPhone(part, '').phone || part;
        phones.push(sanitized);
      } else {
        textItems.push(part);
      }
    }
  }

  // Jika tidak ada item teks maupun email yang dapat diurai, lempar ke OCR biasa
  if (textItems.length === 0 && emails.length === 0) return null;

  let companyName = '';
  let jobTitle = '';
  let emailSubject = '';
  let hasExplicitSubject = false;

  if (textItems.length >= 2) {
    companyName = textItems[0];
    jobTitle = formatRoleTitleCase(textItems[1]);
    if (textItems.length >= 3) {
      emailSubject = textItems.slice(2).join(', ').trim();
      hasExplicitSubject = Boolean(emailSubject);
    }
  } else if (textItems.length === 1) {
    const item = textItems[0];
    if (/^(pt|cv|ud|yayasan|firma)\b/i.test(item)) {
      companyName = item;
    } else {
      jobTitle = formatRoleTitleCase(item);
    }
  }

  const recipientEmail = emails.length > 0 ? emails[0] : '';
  const ccEmail = emails.length > 1 ? emails[1] : '';
  const showCcField = Boolean(ccEmail);
  const recipientPhone = phones.length > 0 ? phones[0] : '';

  const detectedLanguage: EmailLanguage = 'id';
  const keyRequirements = [
    'Manajemen operasional & standardisasi SOP',
    'Kepemimpinan tim lintas divisi',
    'Efisiensi proses kerja & otomatisasi sistem'
  ];

  const draft = generateTailoredApplicationDraft({
    companyName: companyName || 'Perusahaan',
    jobTitle: jobTitle || 'Posisi Terkait',
    recipientEmail,
    keyRequirements,
    language: detectedLanguage
  });

  return {
    companyName,
    jobTitle,
    recipientEmail,
    ccEmail,
    showCcField,
    recipientPhone,
    emailSubject,
    hasExplicitSubject,
    emailBody: draft.emailBody,
    keyRequirements,
    language: detectedLanguage,
    formatSubjectNotice: '',
    isValidated: true,
    validationNotes: ['Otomatis mengurai input Smart Teks (Format Komma)']
  };
}

/**
 * FUNGSI UTAMA: Validasi & Sanitasi Data OCR Menyeluruh
 * Menghasilkan struktur data input yang telah diseleksi bersih dan terstandarisasi.
 */
export function validateAndSanitizeOcrResult(
  rawResult: Partial<JobScanResult> | null | undefined,
  rawText: string = '',
  filename?: string
): ValidatedJobFormFields {
  const effectiveText = (rawText || rawResult?.rawExtractedText || '').trim();

  // 0. Cek pemrosesan Smart Teks format koma terlebih dahulu
  const commaParsed = parseCommaSeparatedSmartText(effectiveText);
  if (commaParsed) {
    return commaParsed;
  }

  const lines = effectiveText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const detectedLanguage: EmailLanguage = rawResult?.language || 'id';
  const validationNotes: string[] = [];

  // 1. Validasi Email
  const emailRes = sanitizeRecipientEmail(rawResult?.recipientEmail, rawText);
  if (emailRes.note) validationNotes.push(emailRes.note);

  // 2. Validasi Nama Perusahaan (Hanya ambil jika ada istilah PT. atau CV., jika tidak ada kosongkan "")
  const companyRes = sanitizeCompanyName(rawResult?.companyName, lines);
  if (companyRes.note) validationNotes.push(companyRes.note);

  // 3. Validasi Posisi / Jabatan (Mencocokkan dengan keyword posisi, misal "HRD Staff")
  const jobRes = sanitizeJobTitle(rawResult?.jobTitle, lines, detectedLanguage);
  if (jobRes.note) validationNotes.push(jobRes.note);

  // 4. Validasi Nomor Telepon / WhatsApp
  const phoneRes = sanitizeRecipientPhone(rawResult?.recipientPhone, rawText);
  if (phoneRes.note) validationNotes.push(phoneRes.note);

  // 5. Validasi Kualifikasi Kunci
  const keyRequirements: string[] = Array.isArray(rawResult?.keyRequirements) && rawResult.keyRequirements.length > 0
    ? rawResult.keyRequirements.filter(k => k && k.length > 3 && k.length < 90).slice(0, 4)
    : [
        detectedLanguage === 'en' ? 'Operational management & SOP governance' : 'Manajemen operasional & standardisasi SOP',
        detectedLanguage === 'en' ? 'Cross-functional team leadership' : 'Kepemimpinan tim lintas divisi',
        detectedLanguage === 'en' ? 'Continuous improvement & digital automation' : 'Efisiensi proses kerja & otomatisasi sistem'
      ];

  // 6. Validasi & Format Subjek Otomatis
  const subjectRes = formatEmailSubjectAuto({
    rawSubjectNotice: rawResult?.formatSubjectNotice,
    rawText,
    validatedJobTitle: jobRes.jobTitle,
    companyName: companyRes.company,
    language: detectedLanguage,
  });

  // 7. Validasi Draf Isi Email (Ringkas, Padat, & Otomatis Terkustomisasi berdasarkan Keyword Posisi)
  let emailBody = rawResult?.emailBody || '';
  if (!emailBody || emailBody.length < 50 || !companyRes.company) {
    const draft = generateTailoredApplicationDraft({
      companyName: companyRes.company || 'Perusahaan',
      jobTitle: jobRes.jobTitle || 'Posisi Terkait',
      recipientEmail: emailRes.email || '',
      keyRequirements,
      language: detectedLanguage,
    });
    emailBody = draft.emailBody;
  }

  return {
    companyName: companyRes.company,
    jobTitle: jobRes.jobTitle,
    recipientEmail: emailRes.email,
    recipientPhone: phoneRes.phone,
    emailSubject: subjectRes.emailSubject,
    hasExplicitSubject: Boolean(subjectRes.formatSubjectNotice),
    emailBody,
    keyRequirements,
    language: detectedLanguage,
    formatSubjectNotice: subjectRes.formatSubjectNotice,
    isValidated: true,
    validationNotes,
  };
}
