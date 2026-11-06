import { ALL_ROLE_PRESETS, RolePresetOption, resolvePresetFromQuery } from '../preset/RoleConfig';
import { BILINGUAL_PRESET_RULES } from './index';
import { PresetMatchingRule } from './types';
import {
  generateTitleVariations,
  expandTokensWithSynonyms,
} from './synonymEngine';

export type EmailLanguage = 'in' | 'en';

export interface JobMatchingContext {
  jobTitle?: string;
  jobDesk?: string;
  kualifikasi?: string;
  rawText?: string;
}

/**
 * Normalisasi teks posisi agar kebal variasi bahasa, ejaan, tanda baca, dan noise OCR.
 */
export function normalizeJobTitle(raw: string): string {
  if (!raw) return '';
  let str = raw.toLowerCase().trim();

  // 1. Hapus tag lowongan kerja / noise umum di awal
  str = str.replace(
    /^(?:posisi|position|role|job\s*title|sebagai|dibutuhkan|dibuka|loker|lowongan|we\s*are\s*hiring|we're\s*hiring|hiring|open\s*position|urgently\s*needed)\s*[:=\-–—]\s*/i,
    ''
  );

  // 2. Hapus noise tanda kurung di akhir seperti (pria/wanita), (fresh graduate), (magang), (kontrak), dll.
  str = str.replace(
    /\((?:pria|wanita|p\/w|p|w|male|female|m\/f|fresh\s*graduate|fg|magang|intern|internship|kontrak|contract|full\s*time|part\s*time|hybrid|remote|wfh|wfo|min\s*pengalaman[^)]*|\d+\s*tahun[^)]*)\)/gi,
    ''
  );

  // 3. Normalisasi ampersand khusus yang bermakna kesatuan peran sebelum pembersihan simbol umum
  str = str.replace(/\bf\s*&\s*b\b/g, 'fnb');
  str = str.replace(/\bc\s*&\s*b\b/g, 'cnb');
  str = str.replace(/\bl\s*&\s*d\b/g, 'lnd');
  str = str.replace(/\bfp\s*&\s*a\b/g, 'fpna');
  str = str.replace(/\br\s*&\s*d\b/g, 'rnd');
  str = str.replace(/\bs\s*&\s*op\b/g, 'snop');
  str = str.replace(/\bm\s*&\s*e\b/g, 'mne');
  str = str.replace(/\bp\s*&\s*l\b/g, 'pnl');
  str = str.replace(/\bhrd?\s*(?:&|\/|\+|dan|and)\s*ga\b/g, 'hrga');
  str = str.replace(/\bga\s*(?:&|\/|\+|dan|and)\s*hrd?\b/g, 'hrga');

  // 4. Normalisasi semua tanda kurung dan tanda baca menjadi spasi
  str = str.replace(/[/\\|•·\-–—_,:;+&()[\]{}'"`]/g, ' ');

  // 5. Normalisasi variasi C-Level, Direksi & Singkatan Kunci
  str = str.replace(/\bcoo\b/g, 'chief operating officer');
  str = str.replace(/\bceo\b/g, 'chief executive officer');
  str = str.replace(/\bcfo\b/g, 'chief financial officer');
  str = str.replace(/\bcto\b/g, 'chief technology officer');
  str = str.replace(/\bcmo\b/g, 'chief marketing officer');
  str = str.replace(/\bchro\b/g, 'chief human resources officer');
  str = str.replace(/\bgm\b/g, 'general manager');
  str = str.replace(/\btu\b/g, 'tata usaha');

  // 6. Normalisasi variasi kata serapan umum (ID <-> EN & singkatan)
  str = str.replace(/\bstaf\b/g, 'staff');
  str = str.replace(/\badm\b/g, 'admin');
  str = str.replace(/\badministrasi\b/g, 'admin');
  str = str.replace(/\badministration\b/g, 'admin');
  str = str.replace(/\bspv\b/g, 'supervisor');
  str = str.replace(/\bmgr\b/g, 'manager');
  str = str.replace(/\bmanajer\b/g, 'manager');
  str = str.replace(/\basisten\b/g, 'assistant');
  str = str.replace(/\bkoordinator\b/g, 'coordinator');
  str = str.replace(/\bspesialis\b/g, 'specialist');
  str = str.replace(/\beksekutif\b/g, 'executive');
  str = str.replace(/\bkepegawaian\b/g, 'personalia');
  str = str.replace(/\b(akuntansi|akunting)\b/g, 'accounting');
  str = str.replace(/\bkeuangan\b/g, 'finance');
  str = str.replace(/\bpemasaran\b/g, 'marketing');
  str = str.replace(/\bpenjualan\b/g, 'sales');
  str = str.replace(/\b(pengadaan|pembelian)\b/g, 'purchasing');
  str = str.replace(/\b(pajak|perpajakan)\b/g, 'tax');
  str = str.replace(/\b(medsos|media\s+sosial)\b/g, 'social media');
  str = str.replace(/\b(pelayanan\s+pelanggan|layanan\s+pelanggan|customer\s+support)\b/g, 'customer service');
  str = str.replace(/\b(gudang|pergudangan)\b/g, 'warehouse');
  str = str.replace(/\b(stok|persediaan)\b/g, 'stock');
  str = str.replace(/\b(inventaris)\b/g, 'inventory');
  str = str.replace(/\bpenggajian\b/g, 'payroll');
  str = str.replace(/\b(supir|sopir)\b/g, 'driver');
  str = str.replace(/\b(resepsionis)\b/g, 'receptionist');
  str = str.replace(/\b(exim|ekspor\s*impor|impor\s*ekspor|export\s*import|import\s*export)\b/g, 'export import');
  str = str.replace(/\b(accounts?\s*payable)\b/g, 'account payable');
  str = str.replace(/\b(accounts?\s*receivable)\b/g, 'account receivable');
  str = str.replace(/\b(systems?\s*analyst)\b/g, 'system analyst');
  str = str.replace(/\b(management\s*trainee|odp|mdp|bdp)\b/g, 'management trainee');
  str = str.replace(/\b(telesales|tele\s*sales|telemarketing|tele\s*marketing)\b/g, 'telesales');
  str = str.replace(/\b(doc\s*controller|doc\s*control)\b/g, 'document controller');

  return str.replace(/\s+/g, ' ').trim();
}

/**
 * Pengecekan kecocokan kata atau frasa dengan boundary kata (\b atau awal/akhir spasi)
 * Menggunakan pencarian berbasis indeks string cepat tanpa alokasi RegExp dinamis.
 */
export function matchesWordBoundary(text: string, term: string): boolean {
  if (!text || !term) return false;
  if (text === term) return true;
  const tLower = text.toLowerCase();
  const termLower = term.toLowerCase();
  let idx = tLower.indexOf(termLower);
  if (idx === -1) return false;

  const isWordChar = (c: string) => /[a-z0-9_]/.test(c);

  while (idx !== -1) {
    const prevChar = idx > 0 ? tLower[idx - 1] : ' ';
    const nextChar = idx + termLower.length < tLower.length ? tLower[idx + termLower.length] : ' ';
    if (!isWordChar(prevChar) && !isWordChar(nextChar)) {
      return true;
    }
    idx = tLower.indexOf(termLower, idx + 1);
  }
  return false;
}

/**
 * Akronim & singkatan penting 2 huruf yang wajib dipertahankan
 */
export const VITAL_2_LETTER_ACRONYMS = new Set([
  'it', 'hr', 'ea', 'pa', 'ap', 'ar', 'qa', 'qc', 'ga', 'mt', 'ui', 'ux', 'bi', 'ba', 'pm', 'gm', 'pr',
  'po', 'so', 'do', 'db', 'ai', 'ir', 'od', 'ta', 'cs', 'cx', 'eo', 'gl', 'k3', 'ob', 'sp'
]);

/**
 * Daftar komprehensif kata penghubung (conjunctions), kata depan (prepositions),
 * kata ganti (pronouns), kata bantu, dan noise iklan lowongan yang wajib diparsing & dieliminasi.
 */
export const COMPREHENSIVE_CONJUNCTIONS_AND_STOPWORDS = new Set([
  // 1. KATA PENGHUBUNG (CONJUNCTIONS) - INDONESIAN
  'dan', 'serta', 'atau', 'tetapi', 'namun', 'melainkan', 'sedangkan', 'padahal',
  'lalu', 'kemudian', 'bahkan', 'malahan', 'lagipula', 'seperti', 'sebagai',
  'laksana', 'ibarat', 'bak', 'yaitu', 'yakni', 'adalah', 'merupakan', 'bahwa',
  'karena', 'sebab', 'lantaran', 'sehingga', 'sampai', 'hingga', 'agar', 'supaya',
  'biar', 'jika', 'kalau', 'jikalau', 'bila', 'apabila', 'asalkan', 'walaupun',
  'meskipun', 'kendatipun', 'sekalipun', 'biarpun', 'sungguhpun', 'alih-alih',
  'maupun', 'ataupun', 'seolah', 'seakan', 'bagaikan', 'semisal', 'umpamanya',
  'kendati', 'manakala', 'tatkala', 'sewaktu', 'seraya', 'sambil', 'selagi',
  'yang', 'sama',

  // 2. KATA DEPAN (PREPOSITIONS) - INDONESIAN
  'di', 'ke', 'dari', 'pada', 'dalam', 'untuk', 'bagi', 'oleh', 'atas', 'tentang',
  'mengenai', 'antar', 'antara', 'kepada', 'terhadap', 'beserta', 'bersama',
  'menuju', 'seputar', 'lewat', 'melalui', 'tanpa', 'guna', 'demi', 'sepanjang',
  'sekitar', 'selaku', 'menurut', 'sesuai', 'berdasarkan', 'dengan',

  // 3. KATA GANTI, PARTIKEL & PENUNJUK - INDONESIAN
  'ini', 'itu', 'tersebut', 'nya', 'kami', 'kita', 'anda', 'kamu', 'dia', 'mereka',
  'saya', 'ia', 'para', 'seorang', 'suatu', 'sesuatu', 'masing-masing', 'setiap',
  'tiap', 'siapa', 'apa', 'mana', 'mana-mana', 'sesiapa', 'ada', 'pun', 'lah', 'kah',
  'tah', 'dong', 'sih', 'deh', 'kok', 'kan',

  // 4. KATA BANTU / TRANSISI - INDONESIAN
  'selain', 'setelah', 'sebelum', 'sesudah', 'selanjutnya', 'akibatnya', 'sebaliknya',
  'justru', 'makanya', 'bisa', 'dapat', 'mampu', 'boleh', 'harus', 'wajib', 'mesti',
  'akan', 'hendak', 'telah', 'sudah', 'belum', 'sedang', 'masih', 'selalu', 'sering',
  'pernah', 'kadang', 'jarang', 'sekaligus', 'semata', 'hanya', 'cuma', 'saja',
  'sangat', 'paling', 'lebih', 'kurang', 'cukup', 'agak', 'terlalu', 'begitu', 'amat',
  'makin', 'semakin', 'kian',

  // 5. NOISE IKLAN LOWONGAN UMUM - INDONESIAN
  'kualifikasi', 'persyaratan', 'syarat', 'kriteria', 'tanggung', 'jawab', 'bertanggung',
  'tugas', 'jobdesk', 'pekerjaan', 'kandidat', 'pelamar', 'deskripsi', 'posisi',
  'lowongan', 'loker', 'pria', 'wanita', 'gender', 'usia', 'umur', 'tahun', 'thn',
  'min', 'minimal', 'maks', 'maksimal', 'domisili', 'penempatan',
  'jurusan', 'pendidikan', 'lulusan', 'strata', 'diploma',
  's1', 'd3', 'sma', 'smk', 'fresh', 'graduate', 'pengalaman', 'kirim', 'email',
  'cv', 'lamaran', 'kontak', 'hubungi', 'whatsapp', 'wa', 'walk',
  'dibutuhkan', 'dicari', 'dibuka', 'segera', 'diutamakan', 'bersedia', 'ditempatkan',
  'memiliki', 'mempunyai', 'bidang', 'terkait', 'semua', 'dsb', 'dll', 'dst',

  // 6. CONJUNCTIONS - ENGLISH
  'and', 'or', 'but', 'nor', 'so', 'yet', 'for', 'although', 'though', 'while',
  'whereas', 'if', 'unless', 'until', 'since', 'because', 'as', 'that', 'whether',
  'both', 'either', 'neither', 'also', 'furthermore', 'moreover', 'however',
  'therefore', 'thus', 'meanwhile', 'otherwise', 'then', 'next', 'instead',

  // 7. PREPOSITIONS - ENGLISH
  'in', 'on', 'at', 'to', 'with', 'by', 'from', 'of', 'about', 'into',
  'through', 'during', 'before', 'after', 'above', 'below', 'under', 'between',
  'among', 'within', 'without', 'toward', 'towards', 'upon', 'across', 'behind',
  'beyond', 'against', 'throughout', 'per', 'via',

  // 8. PRONOUNS, DETERMINERS & AUXILIARY VERBS - ENGLISH
  'the', 'a', 'an', 'this', 'these', 'those', 'it', 'its', 'they', 'them',
  'their', 'we', 'us', 'our', 'you', 'your', 'he', 'him', 'his', 'she', 'her',
  'is', 'am', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
  'do', 'does', 'did', 'can', 'could', 'will', 'would', 'shall', 'should', 'may',
  'might', 'must', 'all', 'any', 'every', 'each', 'few', 'some', 'several', 'many',
  'much', 'other', 'others', 'such', 'what', 'which', 'who', 'whom', 'whose',

  // 9. JOB ADVERT NOISE - ENGLISH
  'qualification', 'qualifications', 'requirements', 'requirement', 'responsibilities',
  'responsibility', 'responsible', 'duties', 'duty', 'job', 'description', 'candidate',
  'candidates', 'applicant', 'applicants', 'minimum', 'maximum', 'experience',
  'years', 'year', 'degree', 'bachelor', 'location',
  'position', 'role', 'apply', 'send', 'resume', 'etc', 'eg', 'ie', 'plus',
  'preferred', 'hiring', 'vacancy', 'vacancies', 'needed', 'looking', 'join',
  'team', 'company', 'work', 'working', 'ability'
]);

/**
 * Kata jabatan level umum yang tidak mengindikasikan bidang spesifik bila berdiri sendiri
 */
const PURE_LEVEL_TITLE_WORDS = new Set([
  'staff', 'staf', 'officer', 'manager', 'manajer', 'lead', 'leader', 'head',
  'specialist', 'spesialis', 'coordinator', 'koordinator', 'supervisor', 'spv',
  'assistant', 'asisten', 'intern', 'internship', 'magang', 'associate',
  'trainee', 'management', 'mt', 'clerk', 'executive', 'eksekutif', 'generalist',
  'senior', 'junior', 'jr', 'sr', 'karyawan', 'pegawai', 'pelaksana', 'anggota',
  'crew', 'daily', 'worker', 'mitra', 'partner', 'tim', 'team'
]);

/**
 * Membersihkan tanda baca, simbol (seperti stripe '-', en-dash '–', em-dash '—', bullet '•', '*', dll.),
 * penomoran list (1., a., dll.), serta spasi ganda.
 */
export function cleanJobTextSymbolsAndPunctuation(raw: string): string {
  if (!raw) return '';
  let str = raw.toLowerCase();

  // Pertahankan singkatan komposit penting sebelum simbol dibersihkan
  str = str.replace(/\be-faktur\b/g, 'efaktur');
  str = str.replace(/\be-spt\b/g, 'espt');
  str = str.replace(/\be-bupot\b/g, 'ebupot');
  str = str.replace(/\be-dabu\b/g, 'edabu');
  str = str.replace(/\be-commerce\b/g, 'ecommerce');
  str = str.replace(/\be-katalog\b/g, 'ekatalog');
  str = str.replace(/\be-catalog\b/g, 'ekatalog');
  str = str.replace(/\be-procurement\b/g, 'eprocurement');
  str = str.replace(/\bc\s*&\s*b\b/g, 'cnb');
  str = str.replace(/\bl\s*&\s*d\b/g, 'lnd');
  str = str.replace(/\bfp\s*&\s*a\b/g, 'fpna');
  str = str.replace(/\bs\s*&\s*op\b/g, 'snop');
  str = str.replace(/\bp\s*&\s*l\b/g, 'pnl');
  str = str.replace(/\b3-way\b/g, '3way');
  str = str.replace(/\bhrd?\s*&\s*ga\b/g, 'hrga');

  // 1. Hapus bullet points, simbol list, dan berbagai variasi stripe
  str = str.replace(/[•·*+~‣⁃○●■□▪▫►√✔#_—–\-]/g, ' ');

  // 2. Hapus nomor urut / penomoran baris list (e.g., '1.', '2)', 'a.', 'b)', '(1)', '[1]')
  str = str.replace(/(?:^|\s)(?:\(?\d+[.)]|\[\d+\]|[a-z][.)])\s+/gi, ' ');

  // 3. Bersihkan seluruh tanda baca dan simbol menjadi spasi
  str = str.replace(/[•·*+~‣⁃○●■□▪▫►√✔#_—–\-.,:;!?()[\]{}'"`“‘”’$%&^=<>\/\\|@№°§©®]/g, ' ');

  // 4. Bersihkan sisa karakter non-alfanumerik umum menjadi spasi
  str = str.replace(/[^\w\s]/g, ' ');

  // 5. Konversi variasi baris & spasi ke single space
  return str.replace(/\s+/g, ' ').trim();
}

/**
 * Ekstraksi token kata kunci dan n-gram dari teks jobdesk & kualifikasi
 */
export function extractKeywordsFromJobText(raw: string): {
  cleanText: string;
  parsedKeywordsText: string;
  keywords: string[];
  ngrams: string[];
} {
  const cleaned = cleanJobTextSymbolsAndPunctuation(raw);
  if (!cleaned) {
    return { cleanText: '', parsedKeywordsText: '', keywords: [], ngrams: [] };
  }

  const rawTokens = cleaned.split(' ').filter(Boolean);
  const keywords: string[] = [];
  const contentTokens: string[] = [];

  for (const rawToken of rawTokens) {
    const token = rawToken.replace(/[^a-zA-Z0-9]/g, '').trim();
    if (!token) continue;

    if (VITAL_2_LETTER_ACRONYMS.has(token)) {
      keywords.push(token);
      contentTokens.push(token);
    } else if (
      token.length >= 2 &&
      !COMPREHENSIVE_CONJUNCTIONS_AND_STOPWORDS.has(token) &&
      !/^\d+$/.test(token)
    ) {
      keywords.push(token);
      contentTokens.push(token);
    }
  }

  const ngrams: string[] = [];
  for (let i = 0; i < contentTokens.length - 1; i++) {
    const w1 = contentTokens[i];
    const w2 = contentTokens[i + 1];
    ngrams.push(`${w1} ${w2}`);
    if (i < contentTokens.length - 2) {
      const w3 = contentTokens[i + 2];
      ngrams.push(`${w1} ${w2} ${w3}`);
    }
  }

  return {
    cleanText: cleaned,
    parsedKeywordsText: contentTokens.join(' '),
    keywords,
    ngrams,
  };
}

/**
 * Deteksi Bahasa Dominan (English vs Indonesian)
 */
export function detectDominantLanguage(
  jobDesk?: string,
  kualifikasi?: string,
  jobTitle?: string
): EmailLanguage {
  const combined = [jobDesk, kualifikasi, jobTitle].filter(Boolean).join(' ').toLowerCase();
  if (!combined.trim()) return 'in';

  const enPatterns = [
    /\b(?:and|or|but|with|for|from|to|in|on|at|of|by|as|about|into|through|during|before|after)\b/g,
    /\b(?:the|this|that|these|those|is|are|was|were|be|been|have|has|had|can|could|will|would|should|must)\b/g,
    /\b(?:responsible|responsibility|responsibilities|qualifications|requirements|duties|skills|experience)\b/g,
    /\b(?:develop|developing|manage|managing|create|creating|ensure|ensuring|support|supporting|maintain|maintaining)\b/g,
    /\b(?:bachelor|degree|fluent|proficient|minimum|preferred|plus|knowledge|ability|communication|closely)\b/g,
    /\b(?:execute|executing|deliver|delivery|milestones|stakeholder|collaborate|collaborating|deploy|deploying)\b/g
  ];

  const inPatterns = [
    /\b(?:dan|atau|serta|tetapi|namun|sedangkan|melainkan|dengan|untuk|bagi|pada|dalam|dari|ke|di|oleh|atas|tentang)\b/g,
    /\b(?:yang|adalah|merupakan|yaitu|yakni|sebagai|bahwa|karena|sebab|sehingga|agar|supaya|jika|kalau|bila|apabila)\b/g,
    /\b(?:kualifikasi|persyaratan|syarat|tanggung|jawab|tugas|pekerjaan|pengalaman|kemampuan|keahlian|pendidikan)\b/g,
    /\b(?:mengelola|membuat|merancang|memastikan|mendukung|memelihara|membantu|menyiapkan|memonitor|mengawasi)\b/g,
    /\b(?:minimal|maksimal|pria|wanita|usia|umur|tahun|jurusan|lulusan|bersedia|ditempatkan|terbiasa|mahir)\b/g,
    /\b(?:bekerja|melakukan|mencapai|penjualan|pembelian|keuangan|laporan|pembukuan|kepegawaian|rekonsiliasi)\b/g
  ];

  let enScore = 0;
  for (const pat of enPatterns) {
    const matches = combined.match(pat);
    if (matches) enScore += matches.length;
  }

  let inScore = 0;
  for (const pat of inPatterns) {
    const matches = combined.match(pat);
    if (matches) inScore += matches.length;
  }

  const enMorphology = combined.match(/\b[a-z]{4,}(?:ing|tion|ment|able|ness|less|ance|ence)\b/g);
  if (enMorphology) enScore += Math.min(enMorphology.length, 12);

  const idMorphology = combined.match(/\b(?:me[a-z]{4,}|ber[a-z]{4,}|di[a-z]{4,}|pe[a-z]{4,}|ter[a-z]{4,})\b/g);
  if (idMorphology) inScore += Math.min(idMorphology.length, 12);

  if (enScore > inScore && enScore >= 2) {
    return 'en';
  }

  return 'in';
}

export interface SpecificRoleMatcherItem {
  code: string;
  regex: RegExp;
  /**
   * Jika true, judul ini adalah nama payung bidang umum (e.g. "HRD", "Admin", "Marketing", "Finance", "Operasional").
   * Saat Kolom Detail kosong -> gunakan code ini sebagai baseline.
   * Saat Kolom Detail terisi -> bebaskan Kolom Detail (50%) menentukan sub-role paling spesifik di dalam bidang tersebut.
   */
  isUmbrella?: boolean;
}

export interface CategoryGroupSpec {
  id: string;
  name: string;
  roleCodes: string[];
  defaultBaselineCode: string;
  specificRoleMatchers: SpecificRoleMatcherItem[];
}

/**
 * Definisi 10 Kategori/Group Preset Resmi beserta seluruh 84 kode peran domain + irisan lintas fungsi.
 * Urutan specificRoleMatchers: Spesifik lebih dulu, Payung Bidang (isUmbrella: true) paling bawah.
 */
export const CATEGORY_GROUPS: Record<string, CategoryGroupSpec> = {
  hr_talent: {
    id: 'hr_talent',
    name: 'SDM, Rekrutmen & Pengembangan Talenta',
    roleCodes: ['HRS', 'HGA', 'REC', 'LND', 'ODD', 'HBP', 'CNB', 'IRL', 'PAS', 'EBR', 'HRA'],
    defaultBaselineCode: 'HRS',
    specificRoleMatchers: [
      { code: 'HGA', regex: /\b(?:hrga|hr\s*&\s*ga|hr\s+ga|hr\/ga|hrd\s*ga|hrd\s*&\s*ga|hrd\s+dan\s+ga|hr\s+general\s+affairs|human\s+resources?\s+(?:&|and)?\s*general\s+affairs|general\s+affairs\s+(?:&|and)?\s*hrd?|ga\s+(?:&|and)?\s*hrd?)\b/i },
      { code: 'REC', regex: /\b(?:recruiter|recruitment|rekrutmen|talent\s*acquisition|talent\s*sourcer|headhunter|sourcing\s*specialist|talent\s*scout|hiring\s*specialist|staff\s*rekrutmen|ta\s*specialist)\b/i },
      { code: 'LND', regex: /\b(?:learning\s*(?:&|and)?\s*development|l&d|lnd|training|pelatihan|trainer|corporate\s*trainer|people\s*development|instructional|tna|diklat)\b/i },
      { code: 'ODD', regex: /\b(?:organi[sz]ational\s*development|organi[sz]ation\s*development|od\s*specialist|od\s*manager|od\s*lead|pengembangan\s*organisasi|culture\s*(?:&|and)?\s*engagement|talent\s*management)\b/i },
      { code: 'HBP', regex: /\b(?:hrbp|hr\s*business\s*partner|human\s*resources?\s*business\s*partner|people\s*partner|mitra\s*bisnis\s*sdm)\b/i },
      { code: 'CNB', regex: /\b(?:compensation|payroll|penggajian|c&b|cnb|compben|remunerasi|total\s*rewards|remuneration|benefit\s*specialist)\b/i },
      { code: 'IRL', regex: /\b(?:industrial\s*relations?|hubungan\s*industrial|labor\s*relations?|ir\s*specialist|ir\s*officer|ir\s*manager|disnaker|hukum\s*ketenagakerjaan|perselisihan\s*kerja|employee\s*relations?)\b/i },
      { code: 'PAS', regex: /\b(?:people\s*analytics|hris|hr\s*data|workforce\s*analytics|analis\s*data\s*sdm|sistem\s*informasi\s*sdm|hr\s*analyst)\b/i },
      { code: 'EBR', regex: /\b(?:employer\s*branding|campus\s*recruitment|campus\s*hiring|university\s*relations|bursa\s*karir|talent\s*brand)\b/i },
      { code: 'HRA', regex: /\b(?:admin\s*hrd?|hrd?\s*admin|admin\s*personalia|personalia\s*admin|admin\s*absensi|attendance\s*admin|personnel\s*admin)\b/i },
      { code: 'HRA', regex: /\b(?:staff\s*hrd?|hrd?\s*staff|staff\s*personalia|personalia\s*staff|hrd?\s*officer|officer\s*hrd?)\b/i, isUmbrella: true },
      { code: 'HRS', regex: /\b(?:hr|hrd|human\s*resources?|human\s*capital|hc|sdm|personalia|kepegawaian|people\s*operations|people\s*ops|hr\s*generalist|hrd\s*generalist)\b/i, isUmbrella: true },
    ],
  },
  operations_retail: {
    id: 'operations_retail',
    name: 'Operasional, Ritel & Manajemen Lapangan',
    roleCodes: ['OPS', 'RTL', 'BRN', 'GAF', 'QAC', 'MFG', 'FLD', 'UTL', 'OPX', 'SOM', 'COS', 'FRE', 'POM'],
    defaultBaselineCode: 'OPS',
    specificRoleMatchers: [
      { code: 'COS', regex: /\b(?:chief\s*of\s*staff|executive\s*operations|strategic\s*operations|corporate\s*operations)\b/i },
      { code: 'SOM', regex: /\b(?:service\s*operations|field\s*service|technical\s*operations|service\s*delivery|after\s*sales\s*operations|operasional\s*layanan|layanan\s*teknis)\b/i },
      { code: 'RTL', regex: /\b(?:retail|ritel|toko|store|outlet|supermarket|minimarket|kepala\s*toko|store\s*manager|store\s*supervisor|pramuniaga|visual\s*merchandis)\b/i },
      { code: 'BRN', regex: /\b(?:branch\s*manager|kepala\s*cabang|pimpinan\s*cabang|area\s*manager|regional\s*manager|multi\s*unit|operasional\s*cabang|branch\s*operations)\b/i },
      { code: 'GAF', regex: /\b(?:general\s*affairs?|ga\s*manager|ga\s*supervisor|ga\s*officer|ga\s*staff|staff\s*ga|admin\s*ga|spv\s*ga|umum\s*operasional|office\s*manager|workplace\s*operations|facility\s*manager|building\s*management|kerumahtanggaan)\b/i },
      { code: 'QAC', regex: /\b(?:qa|qc|quality\s*control|quality\s*assurance|mutu|pengendalian\s*mutu|inspeksi\s*kualitas|iso\s*compliance)\b/i },
      { code: 'MFG', regex: /\b(?:manufacturing|manufaktur|plant\s*manager|kepala\s*pabrik|pabrik|produksi|kepala\s*produksi|production\s*operations|production\s*supervisor|workshop)\b/i },
      { code: 'FLD', regex: /\b(?:lapangan|field\s*operations|field\s*coordinator|koordinator\s*lapangan|pengawas\s*lapangan|site\s*supervisor|site\s*operations|korlap)\b/i },
      { code: 'UTL', regex: /\b(?:utilitas|utility|utilities|pdam|bpspams|spam|layanan\s*air|public\s*utilities|infrastruktur\s*air)\b/i },
      { code: 'OPX', regex: /\b(?:operational\s*excellence|continuous\s*improvement|kaizen|lean\s*six\s*sigma|six\s*sigma|process\s*improvement|business\s*process\s*improvement)\b/i },
      { code: 'FRE', regex: /\b(?:franchise|waralaba|retail\s*expansion|ekspansi\s*ritel|new\s*store\s*opening|store\s*expansion|lokasi\s*ekspansi)\b/i },
      { code: 'POM', regex: /\b(?:product\s*operations|product\s*ops)\b/i },
      { code: 'OPS', regex: /\b(?:operasional|operations|ops|business\s*operations|bizops|head\s*of\s*operations|chief\s*operating\s*officer)\b/i, isUmbrella: true },
    ],
  },
  finance_accounting: {
    id: 'finance_accounting',
    name: 'Keuangan, Akuntansi & Pengendalian Biaya',
    roleCodes: ['ACC', 'FAC', 'TAX', 'APA', 'PSC', 'IAF', 'FBA'],
    defaultBaselineCode: 'ACC',
    specificRoleMatchers: [
      { code: 'TAX', regex: /\b(?:tax|pajak|perpajakan|brevet|fiskal|spt|efaktur|e\s*faktur)\b/i },
      { code: 'APA', regex: /\b(?:ap\s*ar|account\s*payable|account\s*receivable|hutang\s*piutang|utang\s*piutang|staff\s*piutang|staff\s*hutang|ar\s*staff|ap\s*staff|ar\s*officer|ap\s*officer|collection\s*finance)\b/i },
      { code: 'PSC', regex: /\b(?:pricing|commercial\s*analyst|commercial\s*finance|analis\s*harga|margin\s*analyst|sku\s*profitability)\b/i },
      { code: 'IAF', regex: /\b(?:internal\s*audit|audit\s*internal|audit\s*finance|auditor|financial\s*auditor|spi|satuan\s*pengawas\s*intern)\b/i },
      { code: 'FAC', regex: /\b(?:financial\s*analyst|cost\s*control|cost\s*accounting|pengendali\s*biaya|hpp|budgeting|anggaran|fpna|fp&a|corporate\s*finance\s*analyst)\b/i },
      { code: 'FBA', regex: /\b(?:admin\s*finance|finance\s*admin|admin\s*keuangan|billing\s*admin|admin\s*billing|admin\s*invoicing|kasir\s*kantor)\b/i },
      { code: 'ACC', regex: /\b(?:accounting|akuntansi|akunting|finance|keuangan|pembukuan|bookkeeper|ledger|treasury|cashflow)\b/i, isUmbrella: true },
    ],
  },
  marketing_cx: {
    id: 'marketing_cx',
    name: 'Pemasaran, Hubungan Masyarakat & Customer Service',
    roleCodes: ['MKT', 'PRS', 'CSO', 'MCB', 'PMA', 'ECO', 'SMM', 'GRM', 'BRM'],
    defaultBaselineCode: 'MKT',
    specificRoleMatchers: [
      { code: 'PMA', regex: /\b(?:performance\s*marketing|paid\s*ads|digital\s*ads|media\s*buyer|meta\s*ads|facebook\s*ads|google\s*ads|tiktok\s*ads|roas|ppc|sem\s*specialist|advertiser)\b/i },
      { code: 'SMM', regex: /\b(?:social\s*media|medsos|admin\s*sosmed|content\s*creator|content\s*specialist|tiktok\s*specialist|instagram|reels|copywriter|creative\s*content)\b/i },
      { code: 'ECO', regex: /\b(?:ecommerce|e\s*commerce|marketplace|shopee|tokopedia|lazada|tiktok\s*shop|store\s*marketplace|admin\s*marketplace|host\s*live)\b/i },
      { code: 'PRS', regex: /\b(?:public\s*relations?|humas|hubungan\s*masyarakat|pr\s*specialist|pr\s*officer|pr\s*manager|media\s*relations|juru\s*bicara|corporate\s*communications?|corpcomm)\b/i },
      { code: 'CSO', regex: /\b(?:customer\s*service|customer\s*care|customer\s*experience|cs\s*staff|staff\s*cs|helpdesk|layanan\s*pelanggan|call\s*center|contact\s*center|frontliner)\b/i },
      { code: 'MCB', regex: /\b(?:marcom|marcomm|marketing\s*communications?|brand\s*activation|event\s*marketing|promosi\s*komunikasi)\b/i },
      { code: 'GRM', regex: /\b(?:growth\s*marketing|growth\s*hacker|growth\s*lead|lead\s*generation|crm\s*marketing|retention\s*marketing|seo\s*specialist)\b/i },
      { code: 'BRM', regex: /\b(?:brand\s*manager|brand\s*executive|brand\s*specialist|brand\s*strategist|manajer\s*merek)\b/i },
      { code: 'MKT', regex: /\b(?:marketing|pemasaran|digital\s*marketing|marketer)\b/i, isUmbrella: true },
    ],
  },
  business_sales: {
    id: 'business_sales',
    name: 'Bisnis, B2B Sales, Kemitraan & Hubungan Eksternal',
    roleCodes: ['BDV', 'SLS', 'KAM', 'GOV', 'CSM', 'CSD', 'CSE', 'SOP', 'TND', 'SAD'],
    defaultBaselineCode: 'BDV',
    specificRoleMatchers: [
      { code: 'KAM', regex: /\b(?:key\s*account|kam|strategic\s*account|national\s*account)\b/i },
      { code: 'GOV', regex: /\b(?:government\s*relations|hubungan\s*pemerintah|kemitraan\s*pemerintah|b2g|institusi\s*pemerintah|institutional\s*partnership)\b/i },
      { code: 'CSM', regex: /\b(?:client\s*success|customer\s*success|csm|account\s*servicing|client\s*relations)\b/i },
      { code: 'CSD', regex: /\b(?:channel\s*sales|distribution\s*sales|distribusi\s*mitra|reseller|partner\s*sales|modern\s*trade|general\s*trade|area\s*sales)\b/i },
      { code: 'CSE', regex: /\b(?:enterprise\s*sales|corporate\s*sales|commercial\s*enterprise|b2b\s*enterprise)\b/i },
      { code: 'SOP', regex: /\b(?:sales\s*operations?|sales\s*ops|sales\s*enablement|revenue\s*operations|revops|crm\s*specialist)\b/i },
      { code: 'TND', regex: /\b(?:tender|bid\s*specialist|bidding|proposal\s*komersial|lpse|ekatalog|rfp|rfq|lelang)\b/i },
      { code: 'SAD', regex: /\b(?:sales\s*admin|admin\s*sales|admin\s*penjualan|sales\s*support)\b/i },
      { code: 'SLS', regex: /\b(?:sales|b2b\s*sales|sales\s*executive|sales\s*officer|account\s*executive|salesman|direct\s*sales|penjualan|telesales)\b/i, isUmbrella: true },
      { code: 'BDV', regex: /\b(?:business\s*development|bizdev|bdv|bd\s*officer|bd\s*manager|bd\s*specialist|pengembangan\s*bisnis|partnership|kemitraan)\b/i, isUmbrella: true },
    ],
  },
  supply_chain_logistics: {
    id: 'supply_chain_logistics',
    name: 'Rantai Pasok, Logistik, Gudang & Pengadaan',
    roleCodes: ['SCM', 'PPC', 'PRC', 'WHS', 'LDC', 'VMR', 'DIP', 'WHA', 'PPA'],
    defaultBaselineCode: 'SCM',
    specificRoleMatchers: [
      { code: 'PPC', regex: /\b(?:ppic|production\s*planning|perencanaan\s*produksi|inventory\s*control|material\s*planning)\b/i },
      { code: 'VMR', regex: /\b(?:vendor\s*management|supplier\s*management|manajemen\s*vendor|hubungan\s*pemasok|strategic\s*sourcing)\b/i },
      { code: 'DIP', regex: /\b(?:demand\s*planning|demand\s*planner|inventory\s*planner|supply\s*planner|snop|peramalan\s*stok|forecasting\s*inventory)\b/i },
      { code: 'PPA', regex: /\b(?:admin\s*purchasing|purchasing\s*admin|procurement\s*admin|admin\s*procurement|admin\s*pembelian)\b/i },
      { code: 'PRC', regex: /\b(?:purchasing|procurement|pengadaan|buyer|pembelian)\b/i },
      { code: 'WHA', regex: /\b(?:admin\s*gudang|warehouse\s*admin|admin\s*warehouse|admin\s*logistik|inventory\s*admin)\b/i },
      { code: 'LDC', regex: /\b(?:fleet|dispatch|dispatcher|ekspedisi|pengiriman|transportasi|armada|distribusi\s*logistik|delivery\s*coordinator)\b/i },
      { code: 'WHS', regex: /\b(?:kepala\s*gudang|warehouse\s*lead|warehouse\s*supervisor|warehouse\s*manager|spv\s*gudang)\b/i },
      { code: 'WHS', regex: /\b(?:gudang|warehouse|pergudangan|stock\s*keeper|storekeeper)\b/i, isUmbrella: true },
      { code: 'SCM', regex: /\b(?:supply\s*chain|scm|logistik|logistics|rantai\s*pasok|export\s*import)\b/i, isUmbrella: true },
    ],
  },
  project_pmo: {
    id: 'project_pmo',
    name: 'Manajemen Proyek, Program & Delivery',
    roleCodes: ['PMO', 'ITP', 'EVM', 'NGO', 'ASM', 'POM', 'IPM', 'CPM', 'PRA'],
    defaultBaselineCode: 'PMO',
    specificRoleMatchers: [
      { code: 'ITP', regex: /\b(?:it\s*project|project\s*manager\s*it|digital\s*project|software\s*project|technical\s*project\s*manager|tpm)\b/i },
      { code: 'EVM', regex: /\b(?:event|eo|event\s*organizer|event\s*producer|event\s*manager|production\s*event|penyelenggara\s*acara|mice|conference\s*coordinator)\b/i },
      { code: 'NGO', regex: /\b(?:ngo|yayasan|nirlaba|nonprofit|program\s*kemanusiaan|csr\s*officer|csr\s*manager|community\s*development|comdev)\b/i },
      { code: 'ASM', regex: /\b(?:scrum\s*master|agile\s*coach|agile\s*delivery|scrum|sprint\s*master)\b/i },
      { code: 'POM', regex: /\b(?:product\s*operations|product\s*ops|system\s*enablement)\b/i },
      { code: 'IPM', regex: /\b(?:implementation\s*manager|implementation\s*specialist|manajer\s*implementasi|client\s*onboarding\s*project|delivery\s*implementation)\b/i },
      { code: 'CPM', regex: /\b(?:creative\s*project|creative\s*pm|traffic\s*manager|agency\s*producer|multimedia\s*project)\b/i },
      { code: 'PRA', regex: /\b(?:project\s*admin|admin\s*project|admin\s*proyek|project\s*secretary)\b/i },
      { code: 'PMO', regex: /\b(?:project|proyek|pmo|project\s*lead|manajemen\s*proyek|project\s*manager|project\s*coordinator|project\s*officer|program\s*manager)\b/i, isUmbrella: true },
    ],
  },
  admin_secretariat: {
    id: 'admin_secretariat',
    name: 'Administrasi, Kesekretariatan & Dukungan Eksekutif',
    roleCodes: ['ADM', 'AST', 'HOS', 'LGL', 'SAD', 'FBA', 'HRA', 'PRA', 'PPA', 'DEA', 'WHA'],
    defaultBaselineCode: 'ADM',
    specificRoleMatchers: [
      { code: 'AST', regex: /\b(?:sekretaris|secretary|executive\s*assistant|personal\s*assistant|asisten\s*direksi|asisten\s*pribadi|corporate\s*secretary|corsec|ea|pa)\b/i },
      { code: 'HOS', regex: /\b(?:admin\s*rs|rumah\s*sakit|faskes|klinik|puskesmas|healthcare\s*admin|rekam\s*medis|pendaftaran\s*pasien|hospital\s*admin)\b/i },
      { code: 'LGL', regex: /\b(?:legal|hukum|document\s*controller|pengendali\s*dokumen|perizinan|notaris|corporate\s*legal)\b/i },
      { code: 'SAD', regex: /\b(?:sales\s*admin|admin\s*sales|admin\s*penjualan|sales\s*support\s*admin)\b/i },
      { code: 'FBA', regex: /\b(?:billing\s*admin|admin\s*billing|invoicing\s*admin|kasir|cashier|admin\s*finance|finance\s*admin|admin\s*keuangan)\b/i },
      { code: 'HRA', regex: /\b(?:admin\s*hrd?|hrd?\s*admin|admin\s*personalia|personalia\s*admin|admin\s*kepegawaian)\b/i },
      { code: 'PRA', regex: /\b(?:project\s*admin|admin\s*project|admin\s*proyek)\b/i },
      { code: 'PPA', regex: /\b(?:purchasing\s*admin|admin\s*purchasing|procurement\s*admin|admin\s*pengadaan|admin\s*pembelian)\b/i },
      { code: 'DEA', regex: /\b(?:data\s*entry|entry\s*data|input\s*data|master\s*data|operator\s*data)\b/i },
      { code: 'WHA', regex: /\b(?:admin\s*gudang|warehouse\s*admin|admin\s*warehouse|admin\s*logistik|admin\s*stok)\b/i },
      { code: 'ADM', regex: /\b(?:administrasi|admin|administrator|tata\s*usaha|office\s*admin|back\s*office|resepsionis|receptionist|front\s*office)\b/i, isUmbrella: true },
    ],
  },
  digital_tech: {
    id: 'digital_tech',
    name: 'Digital, ERP, Sistem & Analisis Bisnis',
    roleCodes: ['DIG', 'SWE', 'FED', 'BSA', 'DAT', 'BIA', 'PDM', 'ERP', 'ITP'],
    defaultBaselineCode: 'DIG',
    specificRoleMatchers: [
      { code: 'FED', regex: /\b(?:frontend|front\s*end|ui\s*developer|ui\s*engineer|react\s*developer|vue\s*developer|web\s*designer|ui\s*ux)\b/i },
      { code: 'SWE', regex: /\b(?:fullstack|full\s*stack|backend|back\s*end|software\s*engineer|software\s*developer|web\s*developer|node\s*js|application\s*developer)\b/i },
      { code: 'BSA', regex: /\b(?:business\s*analyst|analis\s*bisnis|system\s*analyst|analis\s*sistem|business\s*system|functional\s*analyst|it\s*business\s*partner)\b/i },
      { code: 'BIA', regex: /\b(?:bi\s*analyst|business\s*intelligence|dashboard\s*specialist|looker\s*studio|power\s*bi|tableau)\b/i },
      { code: 'DAT', regex: /\b(?:data\s*analyst|analis\s*data|data\s*operations|data\s*engineer|data\s*scientist|reporting\s*specialist|mis\s*specialist)\b/i },
      { code: 'PDM', regex: /\b(?:product\s*manager|associate\s*product\s*manager|apm|product\s*owner|product\s*lead|manajer\s*produk)\b/i },
      { code: 'ERP', regex: /\b(?:erp|odoo|sap|accurate|oracle\s*netsuite|crm\s*implementation|erp\s*consultant|erp\s*specialist)\b/i },
      { code: 'DIG', regex: /\b(?:digital\s*transformation|transformasi\s*digital|digital\s*solution|it\s*support|it\s*staff|staff\s*it|it\s*specialist|it\s*officer|it\s*manager|programmer|developer|teknologi\s*informasi|it)\b/i, isUmbrella: true },
    ],
  },
  strategic_consulting: {
    id: 'strategic_consulting',
    name: 'Manajemen Strategis & Konsultansi Bisnis',
    roleCodes: ['MGT', 'CON', 'BTR', 'PAR', 'COS'],
    defaultBaselineCode: 'MGT',
    specificRoleMatchers: [
      { code: 'CON', regex: /\b(?:management\s*consultant|business\s*consultant|konsultan\s*manajemen|konsultan\s*bisnis|strategy\s*consultant|consulting|advisory)\b/i },
      { code: 'BTR', regex: /\b(?:turnaround|restrukturisasi|business\s*restructuring|recovery\s*specialist|transformasi\s*bisnis)\b/i },
      { code: 'PAR', regex: /\b(?:public\s*affairs|kebijakan\s*publik|public\s*policy|advokasi|regulatory\s*affairs|government\s*affairs)\b/i },
      { code: 'MGT', regex: /\b(?:strategic\s*management|manajemen\s*strategis|corporate\s*strategy|corporate\s*planning|general\s*manager|chief\s*executive\s*officer|direktur)\b/i, isUmbrella: true },
    ],
  },
};

/**
 * Peta alias kode peran lama/eksternal ke kode kanonikal resmi di ALL_ROLE_PRESETS
 */
export const CODE_ALIAS_MAP: Record<string, string> = {
  HRBP: 'HBP',
  HRG: 'HGA',
  HRGA: 'HGA',
  HR: 'HRS',
  ACT: 'ACC',
  CST: 'FAC',
  AUD: 'IAF',
  TRM: 'ACC',
  GAM: 'GAF',
  FOM: 'FLD',
  STR: 'MGT',
  STU: 'MGT',
  EXP: 'SCM',
  DGM: 'MKT',
  EVO: 'EVM',
  BAN: 'BSA',
  EBC: 'EBR',
};

/**
 * Kamus Kompetensi, Tugas Harian, Tools, & Regulasi Spesifik Per-Role (Bilingual ID & EN).
 * Menjadi mesin presisi untuk Kolom 2 (Detail Posisi = 50%) di dalam masing-masing bidang!
 * - highSignals: Indikator spesifik pembeda utama (+58 poin per kecocokan unik)
 * - mediumSignals: Indikator pendukung khas sub-role (+28 poin per kecocokan unik)
 * - mustHaveOneInContext: Syarat pengaman agar role hibrida tidak salah merebut role murni
 */
interface RoleDutyLexiconSpec {
  highSignals: string[];
  mediumSignals: string[];
  mustHaveOneInContext?: string[];
}

const ROLE_SPECIFIC_DUTY_LEXICON: Record<string, RoleDutyLexiconSpec> = {
  // === 1. HR & TALENT ===
  HRS: {
    highSignals: [
      'hr generalist', 'hrd generalist', 'people operations', 'tata kelola sdm', 'operasional sdm',
      'employee lifecycle', 'employee life cycle', 'kebijakan sdm', 'sop hrd', 'manajemen sdm menyeluruh',
      'end to end hr', 'seluruh fungsi hrd', 'all round hr'
    ],
    mediumSignals: [
      'evaluasi karyawan', 'penilaian kinerja', 'onboarding', 'offboarding', 'peraturan perusahaan',
      'manpower', 'kebutuhan sdm', 'kesejahteraan karyawan', 'disiplin kerja'
    ],
  },
  HGA: {
    highSignals: [
      'hrga', 'general affairs', 'general affair', 'kepegawaian dan umum', 'fasilitas kantor',
      'aset kantor', 'inventaris kantor', 'gedung kantor', 'kendaraan operasional', 'rumah tangga kantor',
      'building management', 'pengelolaan driver', 'office boy', 'perizinan kantor', 'oss rba'
    ],
    mediumSignals: [
      'security', 'kebersihan kantor', 'atk', 'alat tulis kantor', 'maintenance gedung',
      'servis kendaraan', 'pajak kendaraan', 'utilitas kantor', 'vendor kebersihan', 'k3 gedung'
    ],
    mustHaveOneInContext: [
      'hrga', 'ga', 'general affairs', 'general affair', 'fasilitas', 'gedung', 'aset kantor',
      'inventaris', 'kendaraan', 'driver', 'ob', 'office boy', 'security', 'satpam', 'kebersihan',
      'atk', 'rumah tangga', 'perizinan kantor', 'building', 'workplace', 'facility', 'umum'
    ],
  },
  REC: {
    highSignals: [
      'rekrutmen', 'recruitment', 'talent acquisition', 'psikotes', 'psychotest', 'psychometric',
      'sourcing kandidat', 'candidate sourcing', 'screening cv', 'seleksi kandidat', 'seleksi karyawan',
      'wawancara kerja', 'interview kandidat', 'bebi', 'star interview', 'jobstreet', 'glints',
      'offering letter', 'end to end recruitment', 'time to hire', 'time to fill', 'headhunting',
      'talent pool', 'talent pipeline', 'applicant tracking'
    ],
    mediumSignals: [
      'interview', 'wawancara', 'linkedin', 'job portal', 'iklan lowongan', 'mpp', 'manpower planning',
      'background check', 'referensi kerja', 'tes tertulis', 'asesmen kandidat', 'jadwal interview'
    ],
  },
  LND: {
    highSignals: [
      'learning development', 'lnd', 'pelatihan karyawan', 'training need analysis', 'training needs analysis',
      'tna', 'modul pelatihan', 'materi pelatihan', 'kurikulum pelatihan', 'evaluasi pelatihan',
      'kirkpatrick', 'lms', 'learning management system', 'e learning', 'in house training',
      'instruktur pelatihan', 'fasilitator pelatihan', 'corporate university', 'people development'
    ],
    mediumSignals: [
      'training', 'pelatihan', 'trainer', 'workshop', 'seminar internal', 'coaching', 'mentoring',
      ' matriks kompetensi', 'competency matrix', 'skill gap', 'onboarding training', 'orientasi karyawan'
    ],
  },
  ODD: {
    highSignals: [
      'organizational development', 'organization development', 'pengembangan organisasi', 'struktur organisasi',
      'analisis jabatan', 'job analysis', 'job grading', 'job evaluation', 'performance management system',
      'manajemen kinerja', 'kpi karyawan', 'okr', 'kamus kompetensi', 'culture engagement',
      'budaya perusahaan', 'budaya kerja', 'employee engagement survey', 'change management'
    ],
    mediumSignals: [
      'workload analysis', 'analisa beban kerja', 'abk', 'job description', 'talent mapping',
      '9 box', 'succession planning', 'suksesi kepemimpinan', 'survey kepuasan karyawan'
    ],
  },
  HBP: {
    highSignals: [
      'hr business partner', 'hrbp', 'people partner', 'mitra bisnis sdm', 'strategic hr partner',
      'business unit leader', 'workforce transformation', 'talent review', 'organizational alignment',
      'konsultasi sdm unit bisnis', 'retensi talenta kunci'
    ],
    mediumSignals: [
      'manpower planning strategis', 'suksesi', 'coaching manajer', 'employee retention',
      'attrition analysis', 'produktifitas organisasi', 'strategi people'
    ],
  },
  CNB: {
    highSignals: [
      'payroll', 'penggajian', 'perhitungan gaji', 'hitung gaji', 'slip gaji', 'gaji bulanan',
      'compensation benefits', 'cnb', 'compben', 'remunerasi', 'struktur skala upah',
      'pph 21', 'pph pasal 21', 'bpjs ketenagakerjaan', 'bpjs kesehatan', 'edabu', 'sipp online',
      'upah lembur', 'perhitungan lembur', 'thr', 'insentif bonus'
    ],
    mediumSignals: [
      'bpjs', 'potongan gaji', 'tunjangan', 'klaim medis', 'asuransi kesehatan karyawan',
      'salary survey', 'salary benchmarking', 'jamsostek', 'rekap lembur'
    ],
  },
  IRL: {
    highSignals: [
      'hubungan industrial', 'industrial relations', 'labor relations', 'uu ketenagakerjaan',
      'uu cipta kerja', 'peraturan perusahaan', 'perjanjian kerja bersama', 'pkb',
      'bipartit', 'tripartit', 'disnaker', 'serikat pekerja', 'serikat buruh',
      'perselisihan hubungan industrial', 'phi', 'surat peringatan', 'pemutusan hubungan kerja',
      'phk', 'pesangon', 'mediasi ketenagakerjaan', 'wlkp'
    ],
    mediumSignals: [
      'sanksi disiplin', 'indisipliner', 'investigasi pelanggaran', 'kontrak kerja hukum',
      'kepatuhan ketenagakerjaan', 'labor compliance', 'outsourcing compliance', 'norma kerja'
    ],
  },
  PAS: {
    highSignals: [
      'people analytics', 'hris', 'workforce analytics', 'hr analytics', 'hr data',
      'sistem informasi sdm', 'dashboard sdm', 'dashboard hr', 'analitik sdm',
      'turnover analysis', 'headcount reporting', 'konfigurasi hris', 'implementasi hris'
    ],
    mediumSignals: [
      'talenta hris', 'sunfish', 'darwinbox', 'workday', 'bamboo hr', 'data karyawan',
      'hr metrics', 'otomasi hr', 'pelaporan sdm'
    ],
  },
  EBR: {
    highSignals: [
      'employer branding', 'campus hiring', 'campus recruitment', 'job fair', 'career fair',
      'bursa kerja', 'university relations', 'kerjasama kampus', 'employee value proposition',
      'evp', 'konten karir', 'life at', 'management trainee program'
    ],
    mediumSignals: [
      'magang kampus', 'internship program', 'employer brand', 'media sosial karir',
      'branding rekrutmen', 'talent community'
    ],
  },

  // === 2. ADMIN & SECRETARIAT ===
  ADM: {
    highSignals: [
      'administrasi perkantoran', 'office administration', 'tata usaha', 'surat menyurat',
      'pengarsipan dokumen', 'administrasi umum', 'back office', 'front office'
    ],
    mediumSignals: [
      'arsip', 'filing', 'korespondensi', 'notulensi', 'jadwal rapat', 'rekapitulasi laporan',
      'microsoft office', 'penerimaan tamu', 'dokumen kantor'
    ],
  },
  AST: {
    highSignals: [
      'sekretaris', 'executive assistant', 'personal assistant', 'asisten direksi', 'asisten pribadi',
      'asisten ceo', 'direksi', 'dewan direksi', 'bod', 'perjalanan dinas', 'business trip',
      'travel arrangement', 'jadwal direksi', 'agenda direksi', 'agenda pimpinan', 'jadwal pimpinan',
      'korespondensi eksekutif', 'corporate secretary', 'minutes of meeting', 'protokoler'
    ],
    mediumSignals: [
      'calendar management', 'itinerary', 'booking tiket', 'reservasi hotel', 'c level',
      'kerahasiaan dokumen', 'confidential', 'direktur'
    ],
  },
  HOS: {
    highSignals: [
      'rumah sakit', 'klinik', 'puskesmas', 'faskes', 'fasilitas kesehatan', 'rekam medis',
      'pendaftaran pasien', 'registrasi pasien', 'administrasi pasien', 'klaim bpjs kesehatan',
      'ina cbgs', 'vclaim', 'simrs', 'rawat jalan', 'rawat inap', 'instalasi gawat darurat'
    ],
    mediumSignals: [
      'pasien', 'medis', 'dokter', 'apotek', 'asuransi kesehatan', 'rujukan medis', 'antrian poli'
    ],
  },
  LGL: {
    highSignals: [
      'legal admin', 'administrasi hukum', 'document controller', 'pengendali dokumen',
      'drafting kontrak', 'perjanjian kerjasama', 'pks', 'mou', 'akta perusahaan', 'notaris',
      'perizinan usaha', 'oss', 'nib', 'iso document', 'dokumen legalitas'
    ],
    mediumSignals: [
      'legal', 'kontrak', 'hukum', 'perizinan', 'lisensi', 'regulasi', 'arsip kontrak', 'somasi'
    ],
  },
  SAD: {
    highSignals: [
      'sales admin', 'administrasi penjualan', 'admin sales', 'sales order', 'surat penawaran harga',
      'quotation', 'input order pelanggan', 'rekap penjualan', 'faktur penjualan', 'sales support',
      'monitoring pengiriman pesanan', 'klaim diskon distributor'
    ],
    mediumSignals: [
      'penawaran harga', 'order pelanggan', 'database pelanggan', 'laporan omzet', 'komisi sales',
      'koordinasi pengiriman sales'
    ],
  },
  FBA: {
    highSignals: [
      'finance admin', 'administrasi keuangan', 'billing admin', 'admin billing', 'petty cash',
      'kas kecil', 'reimbursement', 'klaim biaya', 'pembuatan invoice', 'invoicing',
      'kasir kantor', 'mutasi bank harian', 'voucher kas'
    ],
    mediumSignals: [
      'bukti kas', 'kwitansi', 'tanda terima tagihan', 'pembayaran operasional', 'rekap pengeluaran harian'
    ],
  },
  HRA: {
    highSignals: [
      'admin hrd', 'admin hr', 'administrasi personalia', 'admin personalia', 'administrasi kepegawaian',
      'rekap absensi', 'fingerprint', 'mesin absensi', 'kontrak pkwt', 'pkwt', 'pkwtt',
      'administrasi cuti', 'surat keterangan kerja', 'paklaring', 'arsip berkas karyawan',
      'database karyawan', 'onboarding dokumen'
    ],
    mediumSignals: [
      'absensi karyawan', 'kehadiran karyawan', 'cuti izin sakit', 'lembur harian',
      'berkas lamaran', 'update data karyawan'
    ],
  },
  PRA: {
    highSignals: [
      'project admin', 'administrasi proyek', 'admin proyek', 'berita acara serah terima',
      'bast', 'bapp', 'dokumentasi proyek', 'laporan harian proyek', 'administrasi lapangan proyek',
      'timesheet proyek', 'arsip gambar kerja'
    ],
    mediumSignals: [
      'jadwal proyek', 'notulen proyek', 'progress proyek', 'klaim termin proyek', 'dokumen tender proyek'
    ],
  },
  PPA: {
    highSignals: [
      'purchasing admin', 'procurement admin', 'administrasi pembelian', 'admin purchasing',
      'pembuatan purchase order', 'input po', 'purchase request', 'perbandingan harga supplier',
      'rekap pembelian', 'administrasi pengadaan'
    ],
    mediumSignals: [
      'purchase order', 'daftar harga vendor', 'tanda terima barang po', 'arsip po', 'dokumen supplier'
    ],
  },
  DEA: {
    highSignals: [
      'data entry', 'entry data', 'input data', 'entri data', 'verifikasi data',
      'validasi akurasi data', 'master data', 'data cleansing', 'kecepatan mengetik',
      'typing speed', 'digitasi dokumen'
    ],
    mediumSignals: [
      'spreadsheet', 'input database', 'pemutakhiran data', 'rekap data excel', 'ketelitian data'
    ],
  },
  WHA: {
    highSignals: [
      'admin gudang', 'warehouse admin', 'administrasi gudang', 'admin logistik', 'surat jalan',
      'delivery order', 'kartu stok', 'bin card', 'input keluar masuk barang', 'rekap stock opname',
      'pencatatan stok', 'input wms', 'bukti barang masuk', 'bukti barang keluar'
    ],
    mediumSignals: [
      'selisih stok', 'mutasi barang', 'laporan stok harian', 'packing list', 'retur barang admin'
    ],
  },

  // === 3. OPERATIONS & RETAIL ===
  OPS: {
    highSignals: [
      'business operations', 'operasional bisnis', 'manajemen operasional', 'koordinasi operasional',
      'efisiensi operasional', 'sop operasional', 'target operasional harian'
    ],
    mediumSignals: [
      'monitoring operasional', 'evaluasi proses kerja', 'kinerja operasional', 'lintas divisi'
    ],
  },
  RTL: {
    highSignals: [
      'kepala toko', 'store manager', 'store supervisor', 'operasional toko', 'operasional outlet',
      'ritel', 'retail store', 'visual merchandising', 'planogram', 'display produk',
      'mesin kasir', 'pos kasir', 'shrinkage', 'kehilangan barang toko', 'shift pramuniaga',
      'target omzet toko', 'minimarket', 'supermarket'
    ],
    mediumSignals: [
      'toko', 'outlet', 'gerai', 'pramuniaga', 'kebersihan toko', 'stock opname toko', 'pelayanan toko'
    ],
  },
  BRN: {
    highSignals: [
      'branch manager', 'kepala cabang', 'pimpinan cabang', 'area manager', 'regional manager',
      'operasional cabang', 'laba rugi cabang', 'pnl cabang', 'target cabang', 'multi cabang',
      'pengawasan cabang', 'kinerja kantor cabang'
    ],
    mediumSignals: [
      'cabang', 'kantor cabang', 'koordinasi area', 'tim cabang', 'audit cabang'
    ],
  },
  GAF: {
    highSignals: [
      'general affairs', 'general affair', 'office manager', 'manajemen fasilitas', 'facility management',
      'pemeliharaan gedung', 'perawatan aset kantor', 'kendaraan operasional', 'manajemen driver',
      'kebersihan keamanan kantor', 'pengadaan atk', 'inventaris aset', 'building maintenance',
      'kerumahtanggaan kantor'
    ],
    mediumSignals: [
      'gedung', 'fasilitas', 'parkir', 'ac gedung', 'listrik air kantor', 'security', 'cleaning service', 'vendor gedung'
    ],
  },
  QAC: {
    highSignals: [
      'quality control', 'quality assurance', 'pengendalian mutu', 'jaminan mutu', 'inspeksi kualitas',
      'incoming qc', 'in process qc', 'outgoing qc', 'iso 9001', 'haccp', 'gmp', 'standar mutu',
      'analisa cacat produk', 'defect rate', 'root cause analysis', 'capa', 'kalibrasi alat ukur'
    ],
    mediumSignals: [
      'mutu', 'qc', 'qa', 'audit mutu', 'sampel produk', 'reject', 'spesifikasi kualitas', 'sop mutu'
    ],
  },
  MFG: {
    highSignals: [
      'manufaktur', 'manufacturing', 'lantai produksi', 'pabrik', 'plant operations',
      'target hasil produksi', 'oee', 'overall equipment effectiveness', 'kapasitas mesin',
      'shift produksi', 'operator produksi', 'keselamatan kerja pabrik', 'downtime mesin'
    ],
    mediumSignals: [
      'produksi', 'mesin pabrik', 'bahan baku produksi', 'line produksi', 'efisiensi pabrik', '5r', '5s'
    ],
  },
  FLD: {
    highSignals: [
      'koordinator lapangan', 'field operations', 'operasional lapangan', 'pengawas lapangan',
      'site supervisor', 'tim lapangan', 'kunjungan lapangan', 'rute lapangan', 'inspeksi lokasi',
      'survey lapangan', 'monitoring titik lokasi'
    ],
    mediumSignals: [
      'lapangan', 'luar kantor', 'mobilitas tinggi', 'koordinasi petugas lapangan', 'laporan lapangan'
    ],
  },
  UTL: {
    highSignals: [
      'utilitas publik', 'public utilities', 'pdam', 'spam', 'bpspams', 'distribusi air bersih',
      'pengolahan air', 'jaringan perpipaan', 'meteran pelanggan', 'kebocoran air', 'nrw',
      'layanan utilitas'
    ],
    mediumSignals: [
      'air bersih', 'infrastruktur publik', 'instalasi pipa', 'pelanggan air', 'teknisi jaringan'
    ],
  },
  OPX: {
    highSignals: [
      'operational excellence', 'continuous improvement', 'lean six sigma', 'six sigma', 'kaizen',
      'process improvement', 'business process reengineering', 'value stream mapping',
      'reduksi waste', 'eliminasi bottleneck', 'green belt', 'black belt', 'pdca'
    ],
    mediumSignals: [
      'efisiensi proses', 'standarisasi proses', 'produktivitas kerja', 'sla improvement'
    ],
  },
  SOM: {
    highSignals: [
      'service operations', 'field service', 'layanan teknis', 'instalasi teknis', 'purna jual',
      'after sales service', 'penjadwalan teknisi', 'tiket perbaikan', 'sla pengerjaan teknis',
      'service center', 'preventive maintenance klien'
    ],
    mediumSignals: [
      'teknisi servis', 'perbaikan unit', 'kunjungan servis', 'kepuasan layanan teknis', 'garansi servis'
    ],
  },
  COS: {
    highSignals: [
      'chief of staff', 'pendampingan ceo', 'inisiatif strategis eksekutif', 'okr korporat',
      'board meeting', 'board deck', 'penyelarasan lintas divisi', 'eksekusi prioritas direksi',
      'executive alignment', 'strategic PMO ceo'
    ],
    mediumSignals: [
      'direksi', 'c level', 'kpi korporat', 'proyek khusus ceo', 'strategic initiatives'
    ],
  },
  FRE: {
    highSignals: [
      'franchise', 'waralaba', 'ekspansi ritel', 'retail expansion', 'pembukaan toko baru',
      'new store opening', 'nso', 'survei lokasi baru', 'studi kelayakan lokasi',
      'negosiasi sewa ruko', 'mitra franchisee', 'akuisisi titik lokasi'
    ],
    mediumSignals: [
      'ekspansi cabang', 'traffic lokasi', 'kontrak sewa tempat', 'fit out toko', 'kemitraan waralaba'
    ],
  },

  // === 4. PROJECT & PMO ===
  PMO: {
    highSignals: [
      'project management', 'manajemen proyek', 'pmo', 'project charter', 'work breakdown structure',
      'wbs', 'gantt chart', 'milestone proyek', 'risiko proyek', 'anggaran proyek', 'timeline proyek'
    ],
    mediumSignals: [
      'proyek', 'project', 'kick off', 'stakeholder proyek', 'deliverables', 'evaluasi proyek'
    ],
  },
  ITP: {
    highSignals: [
      'it project manager', 'proyek teknologi', 'proyek software', 'proyek pengembangan aplikasi',
      'sdlc', 'uat', 'user acceptance test', 'deployment sistem', 'koordinasi developer qa',
      'jira', 'rilis aplikasi', 'technical project'
    ],
    mediumSignals: [
      'integrasi sistem', 'migrasi server', 'timeline development', 'sprint delivery', 'spesifikasi teknis'
    ],
  },
  EVM: {
    highSignals: [
      'event organizer', 'event manager', 'event producer', 'penyelenggaraan acara', 'manajemen acara',
      'rundown acara', 'produksi panggung', 'stage management', 'seminar nasional', 'konferensi',
      'festival', 'pameran', 'exhibition', 'mice', 'vendor acara', 'protokoler acara'
    ],
    mediumSignals: [
      'event', 'acara', 'eo', 'kepanitiaan', 'sponsor acara', 'registrasi peserta', 'venue acara', 'sound lighting'
    ],
  },
  NGO: {
    highSignals: [
      'ngo', 'nirlaba', 'nonprofit', 'yayasan sosial', 'pemberdayaan masyarakat', 'community development',
      'comdev', 'program csr', 'corporate social responsibility', 'hibah donor', 'grant management',
      'monitoring evaluasi dampak', 'penerima manfaat', 'program kemanusiaan'
    ],
    mediumSignals: [
      'sosial', 'relawan', 'pendampingan komunitas', 'laporan donor', 'sdgs', 'keberlanjutan sosial'
    ],
  },
  ASM: {
    highSignals: [
      'scrum master', 'agile coach', 'sprint planning', 'daily standup', 'sprint review',
      'sprint retrospective', 'product backlog', 'burndown chart', 'velocity tim', 'kanban',
      'agile manifesto', 'impediment removal'
    ],
    mediumSignals: [
      'scrum', 'agile', 'sprint', 'ceremony', 'jira board', 'story points', 'squad'
    ],
  },
  POM: {
    highSignals: [
      'product operations', 'product ops', 'kesiapan rilis produk', 'launch readiness',
      'adopsi fitur', 'user adoption', 'feedback loop produk', 'dokumentasi produk internal',
      'enablement tim operasional', 'eskalsi bug produk'
    ],
    mediumSignals: [
      'rilis fitur', 'uji coba produk', 'umpan balik pengguna', 'knowledge base produk'
    ],
  },
  IPM: {
    highSignals: [
      'implementation manager', 'client implementation', 'onboarding sistem klien', 'go live klien',
      'migrasi data klien', 'konfigurasi sistem klien', 'pelatihan user klien', 'end user training',
      'implementasi solusi b2b', 'serah terima implementasi'
    ],
    mediumSignals: [
      'implementasi', 'setup akun klien', 'integrasi klien', 'uat klien', 'time to value'
    ],
  },
  CPM: {
    highSignals: [
      'creative project manager', 'traffic manager', 'agensi kreatif', 'produksi kampanye kreatif',
      'produksi video komersial', 'creative brief', 'jadwal desainer video', 'revisi aset kreatif',
      'multimedia production'
    ],
    mediumSignals: [
      'tim kreatif', 'art director', 'shooting', 'post production', 'timeline konten agensi'
    ],
  },

  // === 5. BUSINESS & SALES ===
  BDV: {
    highSignals: [
      'business development', 'pengembangan bisnis', 'peluang bisnis baru', 'kemitraan strategis',
      'strategic partnership', 'ekspansi pasar', 'riset peluang usaha', 'pitching mitra', 'kolaborasi b2b'
    ],
    mediumSignals: [
      'kemitraan', 'mitra bisnis', 'negosiasi kerjasama', 'proposal kerjasama', 'pertumbuhan pendapatan'
    ],
  },
  SLS: {
    highSignals: [
      'sales executive', 'pencapaian target penjualan', 'kuota penjualan', 'prospek pelanggan baru',
      'canvassing', 'cold calling', 'presentasi penjualan', 'closing penjualan', 'kunjungan sales',
      'direct selling', 'akuisisi pelanggan'
    ],
    mediumSignals: [
      'target sales', 'omzet penjualan', 'follow up prospek', 'negosiasi harga jual', 'pelanggan baru'
    ],
  },
  KAM: {
    highSignals: [
      'key account manager', 'key account', 'klien utama', 'akun strategis', 'retensi klien korporat',
      'upselling', 'cross selling', 'quarterly business review', 'qbr', 'hubungan jangka panjang klien',
      'portofolio akun besar'
    ],
    mediumSignals: [
      'akun eksisting', 'kontrak tahunan klien', 'pertumbuhan akun', 'kepuasan klien korporat'
    ],
  },
  GOV: {
    highSignals: [
      'government relations', 'hubungan pemerintah', 'instansi pemerintah', 'kementerian', 'bumn',
      'pemda', 'dinas pemerintah', 'audiensi pejabat', 'kemitraan pemerintah', 'b2g',
      'nota kesepahaman pemerintah'
    ],
    mediumSignals: [
      'birokrasi', 'lembaga negara', 'sektor publik', 'kerjasama kelembagaan', 'regulasi pemerintah'
    ],
  },
  CSM: {
    highSignals: [
      'customer success manager', 'client success', 'retensi pelanggan saas', 'churn rate',
      'mencegah churn', 'customer health score', 'perpanjangan langganan', 'subscription renewal',
      'adopsi layanan klien', 'net revenue retention'
    ],
    mediumSignals: [
      'onboarding pelanggan', 'loyalitas klien', 'renewal kontrak', 'check in berkala klien'
    ],
  },
  CSD: {
    highSignals: [
      'channel sales', 'distribution sales', 'manajemen distributor', 'jaringan reseller',
      'keagenan', 'sub distributor', 'general trade', 'modern trade', 'gt mt',
      'sell in', 'sell through', 'sell out', 'spreading produk'
    ],
    mediumSignals: [
      'distributor', 'agen', 'grosir', 'toko mitra', 'program insentif dealer', 'cakupan wilayah distribusi'
    ],
  },
  CSE: {
    highSignals: [
      'enterprise sales', 'corporate sales', 'high ticket sales', 'penjualan korporasi besar',
      'negosiasi c level', 'siklus penjualan panjang', 'solusi enterprise', 'multi stakeholder deal',
      'kontrak bernilai besar'
    ],
    mediumSignals: [
      'klien enterprise', 'presentasi eksekutif', 'komersial korporat', 'custom solution pitch'
    ],
  },
  SOP: {
    highSignals: [
      'sales operations', 'sales ops', 'sales enablement', 'revenue operations', 'revops',
      'manajemen crm', 'salesforce', 'hubspot', 'analisa pipeline penjualan', 'forecasting penjualan',
      'perhitungan skema komisi', 'pembagian teritori sales', 'sales productivity'
    ],
    mediumSignals: [
      'dashboard sales', 'akurasi data crm', 'materi training sales', 'konversi funnel sales'
    ],
  },
  TND: {
    highSignals: [
      'tender', 'bidding', 'bid specialist', 'lpse', 'ekatalog', 'lkpp', 'e procurement',
      'dokumen penawaran teknis', 'dokumen kualifikasi lelang', 'rfp', 'rfq', 'rfi',
      'aanwijzing', 'jaminan penawaran', 'bank garansi tender'
    ],
    mediumSignals: [
      'lelang', 'pengadaan pemerintah', 'proposal tender', 'harga perkiraan sendiri', 'hps'
    ],
  },

  // === 6. SUPPLY CHAIN & LOGISTICS ===
  SCM: {
    highSignals: [
      'supply chain management', 'rantai pasok', 'end to end supply chain', 'integrasi logistik',
      'efisiensi rantai pasok', 'export import', 'kepabeanan', 'bea cukai', 'pib peb'
    ],
    mediumSignals: [
      'logistik', 'supply chain', 'distribusi barang', 'lead time pasokan'
    ],
  },
  PPC: {
    highSignals: [
      'ppic', 'production planning inventory control', 'jadwal induk produksi', 'master production schedule',
      'mps', 'material requirement planning', 'mrp', 'bill of material', 'bom',
      'perencanaan kapasitas produksi', 'kontrol bahan baku', 'work in process', 'wip'
    ],
    mediumSignals: [
      'jadwal produksi', 'ketersediaan material', 'buffer stock produksi', 'koordinasi pabrik gudang'
    ],
  },
  PRC: {
    highSignals: [
      'purchasing', 'procurement', 'pengadaan barang jasa', 'sourcing vendor', 'negosiasi harga supplier',
      'term of payment', 'cost saving pembelian', 'seleksi pemasok', 'pembelian bahan baku',
      'pembelian impor lokal'
    ],
    mediumSignals: [
      'pembelian', 'buyer', 'supplier', 'kuotasi vendor', 'kontrak pembelian', 'efisiensi pengadaan'
    ],
  },
  WHS: {
    highSignals: [
      'kepala gudang', 'warehouse supervisor', 'warehouse manager', 'operasional gudang',
      'inbound outbound', 'putaway', 'picking packing', 'fifo', 'fefo', 'akurasi stock opname',
      'tata letak gudang', 'kapasitas penyimpanan gudang', 'warehouse management system',
      'keselamatan forklift'
    ],
    mediumSignals: [
      'gudang', 'pergudangan', 'bongkar muat', 'checker gudang', 'penyimpanan barang', 'helper gudang'
    ],
  },
  LDC: {
    highSignals: [
      'fleet management', 'manajemen armada', 'dispatch', 'pengaturan rute pengiriman',
      'jadwal keberangkatan truk', 'ekspedisi 3pl', 'utilisasi kendaraan pengiriman',
      'biaya bahan bakar armada', 'monitoring gps armada', 'proof of delivery', 'pod', 'on time delivery'
    ],
    mediumSignals: [
      'armada', 'kurir', 'sopir pengiriman', 'truk', 'kargo', 'pengiriman barang', 'surat muatan'
    ],
  },
  VMR: {
    highSignals: [
      'vendor management', 'supplier relationship', 'evaluasi kinerja vendor', 'vendor scorecard',
      'audit pemasok', 'sla vendor', 'kualifikasi rekanan', 'mitigasi risiko pemasok',
      'manajemen rekanan'
    ],
    mediumSignals: [
      'performa supplier', 'kepatuhan vendor', 'review kontrak vendor', 'database rekanan'
    ],
  },
  DIP: {
    highSignals: [
      'demand planning', 'demand forecasting', 'inventory planning', 'peramalan permintaan',
      'snop', 'sales operations planning', 'safety stock', 'reorder point', 'overstock', 'stockout',
      'inventory turnover', 'ito', 'days of inventory', 'replenishment'
    ],
    mediumSignals: [
      'forecast stok', 'proyeksi kebutuhan barang', 'analisa pergerakan stok', 'aging inventory'
    ],
  },

  // === 7. MARKETING & CX ===
  MKT: {
    highSignals: [
      'strategi pemasaran', 'marketing plan', 'kampanye pemasaran', 'riset pasar',
      'bauran pemasaran', 'marketing mix', 'akuisisi pasar', 'pertumbuhan pangsa pasar'
    ],
    mediumSignals: [
      'pemasaran', 'marketing', 'promosi produk', 'materi pemasaran', 'target market'
    ],
  },
  PRS: {
    highSignals: [
      'public relations', 'hubungan masyarakat', 'humas', 'press release', 'siaran pers',
      'media relations', 'konferensi pers', 'komunikasi krisis', 'crisis communication',
      'reputasi korporat', 'juru bicara', 'kliping media', 'corporate communication'
    ],
    mediumSignals: [
      'wartawan', 'jurnalis', 'publikasi media', 'citra perusahaan', 'hubungan eksternal media'
    ],
  },
  CSO: {
    highSignals: [
      'customer service', 'customer care', 'layanan pelanggan', 'penanganan komplain',
      'keluhan pelanggan', 'call center', 'contact center', 'live chat', 'omnichannel ticketing',
      'csat', 'nps', 'first response time', 'resolusi tiket pelanggan'
    ],
    mediumSignals: [
      'pelanggan', 'komplain', 'eskalsi keluhan', 'kepuasan pelanggan', 'zendesk', 'freshdesk'
    ],
  },
  MCB: {
    highSignals: [
      'marketing communication', 'marcom', 'marcomm', 'brand activation', 'aktivasi brand',
      'kampanye atl btl', 'atl btl', 'roadshow promosi', 'media partner', 'sponsorship promosi',
      'pameran pemasaran', 'materi komunikasi promosi'
    ],
    mediumSignals: [
      'event promosi', 'kolaborasi brand', 'publikasi kampanye', 'merchandise promosi'
    ],
  },
  PMA: {
    highSignals: [
      'performance marketing', 'meta ads', 'facebook ads', 'instagram ads', 'google ads',
      'tiktok ads', 'paid ads', 'media buying', 'roas', 'return on ad spend', 'cpa', 'cpc', 'cpm', 'ctr',
      'google tag manager', 'gtm', 'meta pixel', 'conversion api', 'search engine marketing', 'sem'
    ],
    mediumSignals: [
      'iklan berbayar', 'budget iklan', 'split testing iklan', 'ad creative', 'retargeting', 'kampanye digital ads'
    ],
  },
  ECO: {
    highSignals: [
      'ecommerce', 'marketplace', 'shopee', 'tokopedia', 'lazada', 'tiktok shop', 'blibli',
      'official store', 'campaign tanggal kembar', 'flash sale', 'live shopping', 'live streaming toko',
      'optimasi judul produk marketplace', 'iklan shopee', 'tokopedia ads', 'manajemen katalog sku'
    ],
    mediumSignals: [
      'toko online', 'seller center', 'rating ulasan toko', 'voucher toko online', 'pemenuhan pesanan online'
    ],
  },
  SMM: {
    highSignals: [
      'social media specialist', 'content creator', 'media sosial', 'content calendar', 'kalender konten',
      'content pillar', 'instagram reels', 'tiktok video', 'youtube shorts', 'copywriting caption',
      'engagement rate', 'pertumbuhan followers', 'admin sosmed', 'social media management'
    ],
    mediumSignals: [
      'instagram', 'tiktok', 'konten kreatif', 'tren viral', 'komunitas online', 'canva', 'capcut', 'insight sosmed'
    ],
  },
  GRM: {
    highSignals: [
      'growth marketing', 'growth hacking', 'funnel optimization', 'conversion rate optimization', 'cro',
      'ab testing', 'lead generation', 'crm marketing', 'email marketing automation',
      'whatsapp blast retention', 'seo organik', 'user acquisition retention', 'cac ltv'
    ],
    mediumSignals: [
      'akuisi user', 'retensi user', 'eksperimen pertumbuhan', 'landing page conversion', 'drip campaign'
    ],
  },
  BRM: {
    highSignals: [
      'brand manager', 'manajemen merek', 'brand positioning', 'brand identity', 'brand guideline',
      'brand equity', 'brand awareness', 'peluncuran produk baru', 'new product launch',
      'consumer insight', 'riset perilaku konsumen', 'arsitektur brand'
    ],
    mediumSignals: [
      'identitas visual brand', 'persepsi konsumen', 'kompetitor brand', 'strategi merek jangka panjang'
    ],
  },

  // === 8. FINANCE & ACCOUNTING ===
  ACC: {
    highSignals: [
      'laporan keuangan', 'financial statement', 'neraca', 'laba rugi', 'arus kas', 'jurnal umum',
      'general ledger', 'buku besar', 'rekonsiliasi bank', 'tutup buku', 'closing bulanan',
      'standar akuntansi', 'psak', 'pembukuan akuntansi', 'chart of accounts'
    ],
    mediumSignals: [
      'akuntansi', 'jurnal', 'neraca saldo', 'trial balance', 'penyusutan aset', 'treasury'
    ],
  },
  FAC: {
    highSignals: [
      'financial analyst', 'fpna', 'cost control', 'cost accounting', 'pengendalian biaya',
      'harga pokok produksi', 'harga pokok penjualan', 'hpp', 'cogs', 'penyusunan anggaran',
      'budgeting forecasting', 'analisa varians', 'variance analysis', 'financial modeling', 'proyeksi keuangan'
    ],
    mediumSignals: [
      'efisiensi biaya', 'evaluasi capex opex', 'analisa profitabilitas', 'budget tahunan'
    ],
  },
  TAX: {
    highSignals: [
      'perpajakan', 'pajak perusahaan', 'pph 21', 'pph 22', 'pph 23', 'pph 25', 'pph 4 ayat 2',
      'pph badan', 'ppn', 'efaktur', 'ebupot', 'espt', 'spt masa', 'spt tahunan',
      'djp online', 'coretax', 'rekonsiliasi fiskal', 'koreksi fiskal', 'brevet pajak', 'sp2dk',
      'pajak masukan', 'pajak keluaran'
    ],
    mediumSignals: [
      'pajak', 'tax', 'faktur pajak', 'npwp', 'bukti potong', 'pemeriksaan pajak', 'kepatuhan pajak'
    ],
  },
  APA: {
    highSignals: [
      'account payable', 'account receivable', 'ap ar', 'hutang usaha', 'piutang usaha',
      'aging schedule', 'aging piutang', 'aging hutang', '3way matching', 'tukar faktur',
      'penagihan piutang', 'collection piutang', 'pembayaran tagihan vendor', 'rekonsiliasi hutang piutang',
      'days sales outstanding', 'dso'
    ],
    mediumSignals: [
      'piutang', 'hutang', 'jatuh tempo tagihan', 'faktur tagihan', 'pelunasan pelanggan', 'verifikasi invoice vendor'
    ],
  },
  PSC: {
    highSignals: [
      'pricing analyst', 'commercial finance', 'penetapan harga jual', 'strategi harga',
      'margin produk', 'profitabilitas sku', 'evaluasi diskon promosi', 'simulasi harga komersial',
      'trade spend analysis', 'gross margin', 'price elasticity'
    ],
    mediumSignals: [
      'struktur harga', 'katalog harga', 'kompetitivitas harga', 'roi promosi', 'rebate komersial'
    ],
  },
  IAF: {
    highSignals: [
      'internal audit', 'audit internal', 'auditor internal', 'pemeriksaan kepatuhan sop',
      'pengendalian internal', 'internal control', 'audit operasional keuangan', 'audit kas fisik',
      'cash opname', 'investigasi kecurangan', 'fraud audit', 'laporan hasil audit', 'lha',
      'tindak lanjut temuan audit', 'manajemen risiko internal'
    ],
    mediumSignals: [
      'audit', 'auditor', 'kertas kerja audit', 'temuan audit', 'kepatuhan internal', 'sampling audit'
    ],
  },

  // === 9. DIGITAL & TECH ===
  DIG: {
    highSignals: [
      'transformasi digital', 'digital transformation', 'otomasi proses bisnis', 'integrasi sistem digital',
      'infrastruktur it', 'tata kelola teknologi', 'it governance', 'digitalisasi operasional',
      'troubleshooting hardware jaringan', 'it support sistem'
    ],
    mediumSignals: [
      'sistem informasi', 'dukungan teknis it', 'pemeliharaan jaringan', 'keamanan sistem', 'cloud'
    ],
  },
  SWE: {
    highSignals: [
      'software engineer', 'fullstack developer', 'backend developer', 'pengembangan aplikasi web',
      'node js', 'express', 'nestjs', 'golang', 'python backend', 'php laravel', 'rest api', 'graphql',
      'postgresql', 'mysql', 'mongodb', 'microservices', 'arsitektur perangkat lunak', 'git ci cd', 'docker'
    ],
    mediumSignals: [
      'coding', 'pemrograman', 'unit testing', 'integrasi api', 'database schema', 'clean code', 'debugging'
    ],
  },
  FED: {
    highSignals: [
      'frontend developer', 'front end engineer', 'react js', 'nextjs', 'vue js', 'typescript frontend',
      'tailwind css', 'html css javascript', 'antarmuka pengguna', 'responsive web design',
      'konversi figma ke kode', 'ui komponen', 'web performance Core Web Vitals', 'state management redux'
    ],
    mediumSignals: [
      'frontend', 'ui ux', 'figma', 'tampilan web', 'kompatibilitas browser', 'interaksi antarmuka'
    ],
  },
  BSA: {
    highSignals: [
      'business analyst', 'systems analyst', 'system analyst', 'analis bisnis sistem',
      'requirement gathering', 'business requirement document', 'brd', 'functional specification', 'fsd',
      'bpmn', 'flowchart proses', 'uml', 'use case diagram', 'gap analysis sistem',
      'user acceptance testing', 'jembatan user developer'
    ],
    mediumSignals: [
      'analisis kebutuhan sistem', 'alur proses bisnis', 'dokumentasi sistem', 'wireframe fungsional', 'spesifikasi fitur'
    ],
  },
  DAT: {
    highSignals: [
      'data analyst', 'analis data', 'pengolahan data', 'query sql', 'python pandas',
      'pembersihan data', 'exploratory data analysis', 'analisis statistik bisnis',
      'otomasi laporan berkala', 'mis reporting', 'data driven insight', 'advanced excel pivot macro'
    ],
    mediumSignals: [
      'sql', 'analisis tren data', 'dataset', 'pelaporan manajemen', 'big data'
    ],
  },
  BIA: {
    highSignals: [
      'business intelligence', 'bi analyst', 'dashboard interaktif', 'power bi', 'looker studio',
      'google data studio', 'tableau', 'metabase', 'data warehouse', 'etl pipeline',
      'data modeling dax', 'visualisasi kpi eksekutif'
    ],
    mediumSignals: [
      'visualisasi data', 'bi dashboard', 'integrasi sumber data', 'monitoring metrik real time'
    ],
  },
  PDM: {
    highSignals: [
      'product manager', 'product owner', 'product roadmap', 'peta jalan produk',
      'product requirement document', 'prd', 'user stories', 'prioritas fitur', 'feature prioritization',
      'discovery produk', 'riset pengguna produk', 'product market fit', 'metrik retensi produk'
    ],
    mediumSignals: [
      'siklus hidup produk', 'product lifecycle', 'kolaborasi engineering design', 'uji kegunaan produk'
    ],
  },
  ERP: {
    highSignals: [
      'implementasi erp', 'erp consultant', 'erp specialist', 'odoo', 'sap', 'oracle netsuite',
      'accurate', 'jurnal id', 'microsoft dynamics', 'konfigurasi modul erp', 'migrasi master data erp',
      'pelatihan pengguna erp', 'troubleshooting erp crm', 'blueprint erp'
    ],
    mediumSignals: [
      'erp', 'modul finance inventory', 'kustomisasi sistem erp', 'support fungsional erp'
    ],
  },

  // === 10. STRATEGIC & CONSULTING ===
  MGT: {
    highSignals: [
      'strategic management', 'manajemen strategis', 'perencanaan strategis korporat', 'corporate strategy',
      'general manager', 'kepemimpinan unit bisnis', 'target pertumbuhan korporasi', 'tata kelola perusahaan'
    ],
    mediumSignals: [
      'visi strategi', 'ekspansi korporat', 'pengambilan keputusan eksekutif', 'evaluasi portofolio bisnis'
    ],
  },
  CON: {
    highSignals: [
      'management consultant', 'konsultan manajemen', 'konsultan bisnis', 'proyek advisory klien',
      'analisis pasar kompetitor', 'market entry strategy', 'rekomendasi strategis klien',
      'presentasi deck eksekutif', 'problem solving terstruktur', 'studi kelayakan bisnis'
    ],
    mediumSignals: [
      'konsultansi', 'consulting', 'advisory', 'benchmarking industri', 'transformasi klien'
    ],
  },
  BTR: {
    highSignals: [
      'business turnaround', 'restrukturisasi bisnis', 'pemulihan kinerja perusahaan',
      'efisiensi biaya menyeluruh', 'perbaikan arus kas kritis', 'transformasi unit merugi',
      'reorganisasi operasional finansial', 'cost reduction program'
    ],
    mediumSignals: [
      'penyelamatan bisnis', 'stabilisasi operasional', 'negosiasi restrukturisasi', 'perbaikan margin'
    ],
  },
  PAR: {
    highSignals: [
      'public affairs', 'kebijakan publik', 'public policy', 'regulatory affairs',
      'advokasi kebijakan', 'asosiasi industri', 'kadin', 'apindo', 'analisis dampak regulasi',
      'hubungan pemangku kepentingan publik', 'position paper'
    ],
    mediumSignals: [
      'regulasi industri', 'advokasi', 'kebijakan pemerintah', 'dialog pemangku kepentingan'
    ],
  },
};

/**
 * Helper: Menemukan preset berdasarkan kode atau key (case-insensitive & alias-aware)
 */
export function findPresetByCode(code: string): RolePresetOption | null {
  const clean = code.toUpperCase().trim();
  const canonicalCode = CODE_ALIAS_MAP[clean] || clean;
  const found = ALL_ROLE_PRESETS.find(
    (p) => p.code.toUpperCase() === clean || p.code.toUpperCase() === canonicalCode
  );
  if (found) return found;

  const byKey = ALL_ROLE_PRESETS.find(
    (p) => p.key.toLowerCase() === clean.toLowerCase()
  );
  return byKey || null;
}

/**
 * Mencari rule di BILINGUAL_PRESET_RULES yang berkorespondensi dengan kode kanonikal preset
 * (termasuk menangani kode historis HRG->HGA, EVO->EVM, BAN->BSA).
 */
function findBilingualRuleForPreset(code: string, presetKey?: string): PresetMatchingRule | undefined {
  const upper = code.toUpperCase();
  return BILINGUAL_PRESET_RULES.find(
    (r) =>
      r.code.toUpperCase() === upper ||
      (CODE_ALIAS_MAP[r.code.toUpperCase()] || '') === upper ||
      (presetKey && r.key === presetKey)
  );
}

/**
 * Indeks sub-frasa hasil dekomposisi pintar dari secondaryKeywords & positions preset
 * agar bundel panjang seperti "delivery order surat jalan" dipecah menjadi frasa nyata
 * yang benar-benar ditulis pada loker ("delivery order", "surat jalan").
 */
interface PrecompiledRoleRule {
  exactClean: string[];
  exactNorm: string[];
  strongClean: string[];
  strongNorm: string[];
  secondarySubPhrases: string[];
  negativeTerms: string[];
}

const PRECOMPILED_ROLE_INDEX = new Map<string, PrecompiledRoleRule>();

function decomposeCompoundKeywordBundle(rawPhrase: string): string[] {
  const cleaned = cleanJobTextSymbolsAndPunctuation(rawPhrase);
  if (!cleaned) return [];
  const results = new Set<string>();
  if (cleaned.split(' ').length <= 3 && !/\d/.test(cleaned)) {
    results.add(cleaned);
  }

  // Pisahkan juga berdasarkan slash/dan/atau dari raw asli
  const segments = rawPhrase
    .toLowerCase()
    .split(/[/,&|]+|\b(?:dan|and|atau|or)\b/)
    .map((s) => cleanJobTextSymbolsAndPunctuation(s))
    .filter(Boolean);

  for (const seg of segments) {
    const tokens = seg
      .split(' ')
      .filter((t) => t.length >= 2 && !/^\d+[x%+]*$/.test(t) && !COMPREHENSIVE_CONJUNCTIONS_AND_STOPWORDS.has(t));
    if (tokens.length === 0) continue;
    if (tokens.length <= 3) {
      results.add(tokens.join(' '));
    } else {
      // Ambil bigram substantif yang bermakna
      for (let i = 0; i < tokens.length - 1; i++) {
        results.add(`${tokens[i]} ${tokens[i + 1]}`);
      }
    }
  }
  return Array.from(results).filter((s) => s.length >= 3);
}

function getPrecompiledRoleRule(code: string, preset: RolePresetOption): PrecompiledRoleRule {
  const cached = PRECOMPILED_ROLE_INDEX.get(code);
  if (cached) return cached;

  const rule = findBilingualRuleForPreset(code, preset.key);
  const exactCleanSet = new Set<string>();
  const exactNormSet = new Set<string>();
  const strongCleanSet = new Set<string>();
  const strongNormSet = new Set<string>();
  const secSubSet = new Set<string>();
  const negSet = new Set<string>();

  // Tambahkan daftar posisi kanonikal dari RoleConfig.ts (positionsIn & positionsEn)
  const rawPositions = [preset.positionsIn, preset.positionsId, preset.positionsEn]
    .filter(Boolean)
    .join(',')
    .split(',')
    .map((s) => s.trim().replace(/\([^)]*\)/g, '').trim())
    .filter((s) => s.length >= 3);

  for (const pos of rawPositions) {
    const c = cleanJobTextSymbolsAndPunctuation(pos);
    const n = normalizeJobTitle(pos);
    if (c) exactCleanSet.add(c);
    if (n) exactNormSet.add(n);
  }

  if (rule) {
    for (const ep of rule.exactPhrases) {
      const c = cleanJobTextSymbolsAndPunctuation(ep);
      const n = normalizeJobTitle(ep);
      if (c && c.length >= 2) exactCleanSet.add(c);
      if (n && n.length >= 2) exactNormSet.add(n);
    }
    for (const skw of rule.strongKeywords) {
      const c = cleanJobTextSymbolsAndPunctuation(skw);
      const n = normalizeJobTitle(skw);
      if (c && c.length >= 2) strongCleanSet.add(c);
      if (n && n.length >= 2) strongNormSet.add(n);
    }
    if (rule.secondaryKeywords) {
      for (const sec of rule.secondaryKeywords) {
        for (const sub of decomposeCompoundKeywordBundle(sec)) {
          secSubSet.add(sub);
          const normSub = normalizeJobTitle(sub);
          if (normSub && normSub.length >= 3) secSubSet.add(normSub);
        }
      }
    }
    if (rule.negativeKeywords) {
      for (const nk of rule.negativeKeywords) {
        const c = cleanJobTextSymbolsAndPunctuation(nk);
        const n = normalizeJobTitle(nk);
        if (c) negSet.add(c);
        if (n) negSet.add(n);
      }
    }
  }

  const compiled: PrecompiledRoleRule = {
    exactClean: Array.from(exactCleanSet),
    exactNorm: Array.from(exactNormSet),
    strongClean: Array.from(strongCleanSet),
    strongNorm: Array.from(strongNormSet),
    secondarySubPhrases: Array.from(secSubSet),
    negativeTerms: Array.from(negSet),
  };

  PRECOMPILED_ROLE_INDEX.set(code, compiled);
  return compiled;
}

/**
 * Cek kecocokan kata/frasa terhadap teks asli yang sudah dibersihkan simbolnya MAUPUN teks hasil normalisasi lintas bahasa.
 * Memperbaiki bug dimana keyword Bahasa Indonesia ("penggajian", "perpajakan", "gudang", "akuntansi")
 * sebelumnya gagal cocok karena dinormalisasi sepihak ke Bahasa Inggris.
 */
function matchesTermDual(
  rawCleanText: string,
  normCleanText: string,
  term: string
): boolean {
  if (!term) return false;
  const cleanTerm = cleanJobTextSymbolsAndPunctuation(term);
  if (cleanTerm && matchesWordBoundary(rawCleanText, cleanTerm)) {
    return true;
  }
  const normTerm = normalizeJobTitle(term);
  if (normTerm && (matchesWordBoundary(normCleanText, normTerm) || matchesWordBoundary(rawCleanText, normTerm))) {
    return true;
  }
  return false;
}

/**
 * Mengevaluasi skor kecocokan Kolom 2 (Detail Posisi: Deskripsi Pekerjaan & Persyaratan)
 * pada skala 0 - 500 poin (Bobot Penuh 50%).
 */
function scoreRoleDetailFit(
  code: string,
  preset: RolePresetOption,
  rawDetailClean: string,
  normDetailClean: string,
  detailKeywordsData: ReturnType<typeof extractKeywordsFromJobText>,
  expandedDetailTokens: Set<string>,
  rawTitleClean: string
): { score: number; matchedSignals: string[] } {
  if (!rawDetailClean) {
    return { score: 0, matchedSignals: [] };
  }

  const lexicon = ROLE_SPECIFIC_DUTY_LEXICON[code];
  const compiled = getPrecompiledRoleRule(code, preset);
  const matchedSignals = new Set<string>();
  let rawScore = 0;

  // Guard khusus peran hibrida (contoh: HGA tidak boleh mengalahkan role HR murni bila tidak ada sinyal GA/fasilitas sama sekali di judul maupun detail)
  if (lexicon?.mustHaveOneInContext && lexicon.mustHaveOneInContext.length > 0) {
    const combinedRaw = `${rawTitleClean} ${rawDetailClean}`;
    const combinedNorm = `${normalizeJobTitle(rawTitleClean)} ${normDetailClean}`;
    const hasRequiredContext = lexicon.mustHaveOneInContext.some((req) =>
      matchesTermDual(combinedRaw, combinedNorm, req)
    );
    if (!hasRequiredContext) {
      return { score: 0, matchedSignals: [] };
    }
  }

  // 1. High-Specificity Duty & Tool Signals (+58 poin per sinyal unik)
  if (lexicon) {
    for (const sig of lexicon.highSignals) {
      if (matchesTermDual(rawDetailClean, normDetailClean, sig)) {
        rawScore += 58;
        matchedSignals.add(sig);
      }
    }
    // 2. Medium-Specificity Supporting Signals (+28 poin per sinyal unik)
    for (const sig of lexicon.mediumSignals) {
      if (!matchedSignals.has(sig) && matchesTermDual(rawDetailClean, normDetailClean, sig)) {
        rawScore += 28;
        matchedSignals.add(sig);
      }
    }
  }

  // 3. Strong Keywords dari BILINGUAL_PRESET_RULES (+36 poin langsung, +18 via sinonim)
  for (const skw of compiled.strongClean) {
    if (matchedSignals.has(skw)) continue;
    if (matchesWordBoundary(rawDetailClean, skw)) {
      rawScore += 36;
      matchedSignals.add(skw);
    } else {
      const nkw = normalizeJobTitle(skw);
      if (nkw && matchesWordBoundary(normDetailClean, nkw)) {
        rawScore += 36;
        matchedSignals.add(nkw);
      } else if (expandedDetailTokens.has(skw) || (nkw && expandedDetailTokens.has(nkw))) {
        rawScore += 18;
        matchedSignals.add(skw);
      }
    }
  }

  // 4. Secondary Sub-Phrases hasil dekomposisi (+22 poin per frasa unik)
  for (const sub of compiled.secondarySubPhrases) {
    if (matchedSignals.has(sub)) continue;
    if (matchesWordBoundary(rawDetailClean, sub) || matchesWordBoundary(normDetailClean, sub)) {
      rawScore += 22;
      matchedSignals.add(sub);
    }
  }

  // 5. Kecocokan N-gram substantif terhadap deskripsi kompetensi profil preset (descIn / descEn)
  const descCombined = cleanJobTextSymbolsAndPunctuation(
    `${preset.descIn || preset.descId || ''} ${preset.descEn || ''}`
  );
  if (descCombined) {
    for (const ngram of detailKeywordsData.ngrams.slice(0, 24)) {
      if (ngram.length >= 6 && !matchedSignals.has(ngram) && matchesWordBoundary(descCombined, ngram)) {
        rawScore += 14;
        matchedSignals.add(ngram);
      }
    }
  }

  // 6. Penalti Negative Keywords (-45 poin per kecocokan negatif)
  for (const neg of compiled.negativeTerms) {
    if (matchesWordBoundary(rawDetailClean, neg) || matchesWordBoundary(normDetailClean, neg)) {
      rawScore -= 45;
    }
  }

  const clampedScore = Math.max(0, Math.min(500, rawScore));
  return {
    score: clampedScore,
    matchedSignals: Array.from(matchedSignals),
  };
}

/**
 * Mengecek apakah judul hanya berisi kata jabatan generik tanpa indikasi bidang
 * (misal: "Staff", "Supervisor", "Manager", "Management Trainee", "Officer", "Magang").
 */
function isPurelyGenericLevelTitle(rawTitleClean: string, normTitle: string): boolean {
  if (!rawTitleClean && !normTitle) return true;
  const tokens = rawTitleClean.split(' ').filter(Boolean);
  if (tokens.length === 0) return true;
  return tokens.every((t) => PURE_LEVEL_TITLE_WORDS.has(t));
}

// Cache O(1) untuk pencocokan preset peran kerja
const MATCH_PRESET_CACHE = new Map<string, RolePresetOption>();

/**
 * Mesin Pencocok Presisi Bilingual 2-Kolom Seimbang (50% Kolom Posisi : 50% Kolom Detail Posisi)
 *
 * Arsitektur Keputusan:
 * - KOLOM 1: Input Posisi ("Posisi yang Dilamar") = Bobot 50% (0 - 500 poin)
 *   Menentukan Bidang/Kategori utama beserta seluruh daftar peran di dalam bidang tersebut,
 *   serta menetapkan apakah judul merupakan Payung Bidang Umum (e.g. "HRD", "Admin", "Marketing", "Finance")
 *   atau Peran Spesialis Eksplisit (e.g. "Tax Officer", "Talent Acquisition", "PPIC", "Event Manager").
 *
 * - KOLOM 2: Input Detail Posisi ("Deskripsi Pekerjaan & Persyaratan") = Bobot 50% (0 - 500 poin)
 *   Mengevaluasi kata kunci tugas harian, tools, dokumen kerja, regulasi, dan sinonim dwibahasa
 *   untuk memilih peran paling spesifik di dalam bidang yang telah ditentukan oleh Kolom 1
 *   (atau lintas seluruh bidang apabila Kolom 1 kosong / hanya berisi level jabatan umum seperti "Staff").
 */
export function matchPresetIntensive(
  context: string | JobMatchingContext,
  jobDeskParam?: string,
  kualifikasiParam?: string
): RolePresetOption {
  let titleStr = '';
  let deskStr = '';
  let qualStr = '';
  let fallbackRawStr = '';

  if (typeof context === 'string') {
    titleStr = context;
    deskStr = jobDeskParam || '';
    qualStr = kualifikasiParam || '';
  } else if (context && typeof context === 'object') {
    titleStr = context.jobTitle || '';
    deskStr = context.jobDesk || jobDeskParam || '';
    qualStr = context.kualifikasi || kualifikasiParam || '';
    fallbackRawStr = context.rawText || '';
  }

  // Satukan Kolom Detail (Deskripsi Pekerjaan & Persyaratan) menjadi satu kesatuan teks 50%
  const explicitDetailStr = [deskStr.trim(), qualStr.trim()].filter(Boolean).join('\n');
  const unifiedDetailStr = explicitDetailStr || fallbackRawStr.trim();

  const rawTitleTrimmed = (titleStr || '').trim();
  const rawTitleLower = rawTitleTrimmed.toLowerCase();
  const rawDetailLower = unifiedDetailStr.toLowerCase();

  // Cek cache O(1)
  const cacheKey = `${rawTitleLower}||${rawDetailLower}`;
  const cached = MATCH_PRESET_CACHE.get(cacheKey);
  if (cached) return cached;

  const rawTitleClean = cleanJobTextSymbolsAndPunctuation(rawTitleTrimmed);
  const normTitle = normalizeJobTitle(rawTitleTrimmed);
  const detailData = extractKeywordsFromJobText(unifiedDetailStr);
  const rawDetailClean = detailData.cleanText;
  const normDetailClean = normalizeJobTitle(unifiedDetailStr);
  const hasDetailContent = detailData.keywords.length > 0;

  // Jika kedua kolom benar-benar kosong -> kembalikan preset default 'optimal' (OPT)
  if (!rawTitleClean && !hasDetailContent) {
    const opt = ALL_ROLE_PRESETS[0];
    MATCH_PRESET_CACHE.set(cacheKey, opt);
    return opt;
  }

  // JIKA KOLOM DETAIL KOSONG, cek terlebih dahulu resolusi langsung kode/alias presisi dari RoleConfig
  // (PENTING: Jangan short-circuit bila Kolom Detail terisi, agar Kolom Detail 50% tetap dievaluasi!)
  if (!hasDetailContent && rawTitleLower) {
    const resolvedKey = resolvePresetFromQuery(rawTitleLower) || resolvePresetFromQuery(normTitle);
    if (resolvedKey) {
      const directPreset = ALL_ROLE_PRESETS.find((p) => p.key === resolvedKey);
      if (directPreset) {
        MATCH_PRESET_CACHE.set(cacheKey, directPreset);
        return directPreset;
      }
    }
    const byCode = findPresetByCode(rawTitleLower);
    if (byCode) {
      MATCH_PRESET_CACHE.set(cacheKey, byCode);
      return byCode;
    }
  }

  const expandedDetailTokens = new Set(expandTokensWithSynonyms(detailData.keywords));
  const titleVariations = normTitle ? generateTitleVariations(normTitle) : [];
  const pureLevelTitle = isPurelyGenericLevelTitle(rawTitleClean, normTitle);

  // =========================================================================
  // TAHAP 1: EVALUASI KOLOM 1 — POSISI YANG DILAMAR (BOBOT 50% = 0 - 500 POIN)
  // Menentukan Bidang (CategoryGroup) beserta seluruh isinya & Skor Posisi Awal
  // =========================================================================
  let lockedGroupKey: string | null = null;
  let titleMatchedRoleCode: string | null = null;
  let isTitleUmbrellaMatch = true;
  let bestGroupMaxRoleScore = 0;
  let bestGroupTieBreaker = 0;

  // Simpan skor judul spesifik per roleCode di setiap grup
  const perGroupRoleTitleBoost = new Map<string, Map<string, { boost: number; isUmbrella: boolean }>>();

  if (rawTitleClean && !pureLevelTitle) {
    // Cek juga apakah judul secara utuh cocok dengan alias kurasi di RoleConfig (misal "staff hrd" -> HRA, "hrga" -> HGA, "office manager" -> GAF)
    const exactAliasKey = resolvePresetFromQuery(rawTitleLower) || resolvePresetFromQuery(normTitle);
    const exactAliasPreset = exactAliasKey
      ? ALL_ROLE_PRESETS.find((p) => p.key === exactAliasKey && p.groupKey !== 'featured') || null
      : null;

    for (const group of Object.values(CATEGORY_GROUPS)) {
      const roleBoostMap = new Map<string, { boost: number; isUmbrella: boolean }>();
      let groupMaxScore = 0;
      let groupSumScore = 0;
      let groupBestCode = group.defaultBaselineCode;
      let groupBestIsUmbrella = true;

      // 1. Evaluasi specificRoleMatchers pada grup ini
      for (const matcher of group.specificRoleMatchers) {
        let mScore = 0;
        if (matcher.regex.test(rawTitleTrimmed) || matcher.regex.test(rawTitleClean) || matcher.regex.test(normTitle)) {
          mScore = matcher.isUmbrella ? 320 : 390;
        } else if (titleVariations.length > 0 && titleVariations.some((tv) => matcher.regex.test(tv))) {
          mScore = matcher.isUmbrella ? 250 : 310;
        }

        if (mScore > 0) {
          const prev = roleBoostMap.get(matcher.code);
          if (!prev || mScore > prev.boost) {
            roleBoostMap.set(matcher.code, { boost: mScore, isUmbrella: Boolean(matcher.isUmbrella) });
          }
          groupSumScore += mScore;
          if (mScore > groupMaxScore) {
            groupMaxScore = mScore;
            groupBestCode = matcher.code;
            groupBestIsUmbrella = Boolean(matcher.isUmbrella);
          }
        }
      }

      // 2. Evaluasi kecocokan exactPhrases & positions preset pada seluruh role di grup ini
      for (const code of group.roleCodes) {
        const preset = findPresetByCode(code);
        if (!preset) continue;
        const compiled = getPrecompiledRoleRule(code, preset);
        const existing = roleBoostMap.get(code);
        let phraseScore = 0;
        const isDefaultUmbrellaCode = code === group.defaultBaselineCode;

        if (
          compiled.exactClean.includes(rawTitleClean) ||
          compiled.exactNorm.includes(normTitle)
        ) {
          phraseScore = isDefaultUmbrellaCode ? 340 : 420;
        } else if (
          compiled.exactClean.some((p) => p.length >= 4 && matchesWordBoundary(rawTitleClean, p)) ||
          compiled.exactNorm.some((p) => p.length >= 4 && matchesWordBoundary(normTitle, p))
        ) {
          phraseScore = isDefaultUmbrellaCode ? 260 : 330;
        } else if (
          compiled.strongClean.some((k) => k.length >= 3 && matchesWordBoundary(rawTitleClean, k)) ||
          compiled.strongNorm.some((k) => k.length >= 3 && matchesWordBoundary(normTitle, k))
        ) {
          phraseScore = isDefaultUmbrellaCode ? 230 : 290;
        }

        // Jika exactAliasPreset menunjuk ke role ini pada grup utamanya, beri prioritas presisi
        if (exactAliasPreset && exactAliasPreset.code === code && group.id === exactAliasPreset.groupKey) {
          const isUmbrellaAlias =
            code === group.defaultBaselineCode ||
            (code === 'HRA' && /\b(?:staff\s*hrd?|hrd?\s*staff)\b/i.test(rawTitleClean)) ||
            (code === 'SLS' && /\b(?:sales|penjualan)\b/i.test(rawTitleClean));
          phraseScore = Math.max(phraseScore, isUmbrellaAlias ? 355 : 435);
          roleBoostMap.set(code, { boost: phraseScore, isUmbrella: isUmbrellaAlias });
        } else if (phraseScore > (existing?.boost || 0)) {
          roleBoostMap.set(code, {
            boost: phraseScore,
            isUmbrella: existing ? existing.isUmbrella : isDefaultUmbrellaCode,
          });
        }

        const currentEntry = roleBoostMap.get(code);
        if (currentEntry && currentEntry.boost > groupMaxScore) {
          groupMaxScore = currentEntry.boost;
          groupBestCode = code;
          groupBestIsUmbrella = currentEntry.isUmbrella;
        }
        if (phraseScore > 0) {
          groupSumScore += Math.round(phraseScore * 0.5);
        }
      }

      perGroupRoleTitleBoost.set(group.id, roleBoostMap);

      // Pilih bidang dengan skor kecocokan role tertinggi (gunakan groupSumScore hanya sebagai tie-breaker!)
      if (
        groupMaxScore > bestGroupMaxRoleScore ||
        (groupMaxScore === bestGroupMaxRoleScore && groupMaxScore > 0 && groupSumScore > bestGroupTieBreaker)
      ) {
        bestGroupMaxRoleScore = groupMaxScore;
        bestGroupTieBreaker = groupSumScore;
        lockedGroupKey = group.id;
        titleMatchedRoleCode = groupBestCode;
        isTitleUmbrellaMatch = groupBestIsUmbrella;
      }
    }
  }

  // =========================================================================
  // TAHAP 2 & 3: GABUNGAN 50% KOLOM POSISI (0-500) + 50% KOLOM DETAIL (0-500)
  // =========================================================================

  // KASUS A: Kolom 1 berhasil menentukan Bidang (lockedGroupKey !== null)
  if (lockedGroupKey && CATEGORY_GROUPS[lockedGroupKey]) {
    const activeGroup = CATEGORY_GROUPS[lockedGroupKey];
    const baselineCode = titleMatchedRoleCode || activeGroup.defaultBaselineCode;
    const baselinePreset = findPresetByCode(baselineCode) || findPresetByCode(activeGroup.defaultBaselineCode) || ALL_ROLE_PRESETS[0];

    // Jika Kolom 2 (Detail) kosong -> langsung gunakan hasil terbaik Kolom 1 di bidang tersebut
    if (!hasDetailContent) {
      MATCH_PRESET_CACHE.set(cacheKey, baselinePreset);
      return baselinePreset;
    }

    const groupTitleBoosts = perGroupRoleTitleBoost.get(lockedGroupKey) || new Map();

    interface CombinedCandidate {
      code: string;
      preset: RolePresetOption;
      titleColumnScore: number;  // 0 - 500 (50% Kolom Posisi)
      detailColumnScore: number; // 0 - 500 (50% Kolom Detail)
      combinedScore: number;     // 0 - 1000
      signalCount: number;
    }

    const candidates: CombinedCandidate[] = [];
    let maxDetailScoreInGroup = 0;

    for (const code of activeGroup.roleCodes) {
      const preset = findPresetByCode(code);
      if (!preset) continue;

      // 1. Hitung Skor Kolom 1 (50% = 0 - 500 poin):
      // Seluruh peran di dalam bidang terpilih memperoleh Basis Keanggotaan Bidang = 250 poin.
      // - Bila judul posisi adalah Payung Bidang Umum (isTitleUmbrellaMatch = true, misal "HRD", "Admin", "Marketing", "Finance"),
      //   baseline umum hanya diberi keunggulan tipis +35 poin (285/500) agar mudah dispesifikkan oleh Kolom Detail (50%).
      // - Bila judul posisi sudah Spesifik (isTitleUmbrellaMatch = false, misal "Tax Officer", "Staff Rekrutmen", "PPIC"),
      //   peran spesifik tersebut memperoleh jangkar +160 poin (410/500) sehingga tetap kokoh kecuali Kolom Detail sangat dominan ke peran lain.
      let titleColumnScore = 250;
      const roleTitleEntry = groupTitleBoosts.get(code);
      if (code === baselineCode) {
        titleColumnScore += isTitleUmbrellaMatch ? 35 : 160;
      } else if (roleTitleEntry && !roleTitleEntry.isUmbrella && roleTitleEntry.boost >= 300) {
        titleColumnScore += 95;
      }

      // 2. Hitung Skor Kolom 2 (50% = 0 - 500 poin) untuk spesifikasi di dalam bidang ini
      const detailEval = scoreRoleDetailFit(
        code,
        preset,
        rawDetailClean,
        normDetailClean,
        detailData,
        expandedDetailTokens,
        rawTitleClean
      );

      if (detailEval.score > maxDetailScoreInGroup) {
        maxDetailScoreInGroup = detailEval.score;
      }

      const combinedScore = titleColumnScore + detailEval.score;
      candidates.push({
        code,
        preset,
        titleColumnScore,
        detailColumnScore: detailEval.score,
        combinedScore,
        signalCount: detailEval.matchedSignals.length,
      });
    }

    // Jika tidak ada satu pun sinyal relevan di Kolom Detail untuk bidang ini -> kembali ke Baseline Kolom 1
    if (maxDetailScoreInGroup < 25) {
      MATCH_PRESET_CACHE.set(cacheKey, baselinePreset);
      return baselinePreset;
    }

    candidates.sort((a, b) => {
      if (b.combinedScore !== a.combinedScore) {
        return b.combinedScore - a.combinedScore;
      }
      if (b.signalCount !== a.signalCount) {
        return b.signalCount - a.signalCount;
      }
      return b.detailColumnScore - a.detailColumnScore;
    });

    const winner = candidates[0]?.preset || baselinePreset;
    if (MATCH_PRESET_CACHE.size > 300) {
      MATCH_PRESET_CACHE.clear();
    }
    MATCH_PRESET_CACHE.set(cacheKey, winner);
    return winner;
  }

  // KASUS B: Kolom 1 kosong ATAU hanya berisi level jabatan umum tanpa bidang (e.g. "Staff", "Supervisor", "MT")
  // Evaluasi seluruh 10 bidang berdasarkan kekuatan sinyal Kolom 2 (Detail Posisi)
  if (hasDetailContent) {
    let bestGlobalPreset: RolePresetOption | null = null;
    let bestGlobalScore = 0;
    let bestGlobalSignals = 0;
    const evaluatedCodes = new Set<string>();

    for (const group of Object.values(CATEGORY_GROUPS)) {
      for (const code of group.roleCodes) {
        if (evaluatedCodes.has(code)) continue;
        evaluatedCodes.add(code);

        const preset = findPresetByCode(code);
        if (!preset) continue;

        const detailEval = scoreRoleDetailFit(
          code,
          preset,
          rawDetailClean,
          normDetailClean,
          detailData,
          expandedDetailTokens,
          rawTitleClean
        );

        // Beri bonus tipis pada peran spesialis non-baseline bila skornya setara agar tidak jatuh ke umbrella generik
        const specialistBonus = code !== group.defaultBaselineCode && detailEval.score >= 50 ? 12 : 0;
        const effectiveScore = detailEval.score + specialistBonus;

        if (
          effectiveScore > bestGlobalScore ||
          (effectiveScore === bestGlobalScore && effectiveScore > 0 && detailEval.matchedSignals.length > bestGlobalSignals)
        ) {
          bestGlobalScore = effectiveScore;
          bestGlobalSignals = detailEval.matchedSignals.length;
          bestGlobalPreset = preset;
        }
      }
    }

    if (bestGlobalPreset && bestGlobalScore >= 25) {
      if (MATCH_PRESET_CACHE.size > 300) {
        MATCH_PRESET_CACHE.clear();
      }
      MATCH_PRESET_CACHE.set(cacheKey, bestGlobalPreset);
      return bestGlobalPreset;
    }
  }

  // Fallback apabila hanya ada judul generik seperti "Management Trainee" / "Manager" tanpa detail
  if (/\b(?:management\s*trainee|general\s*manager|manager)\b/i.test(normTitle)) {
    const mgtPreset = findPresetByCode('MGT') || ALL_ROLE_PRESETS[0];
    MATCH_PRESET_CACHE.set(cacheKey, mgtPreset);
    return mgtPreset;
  }

  const fallbackOpt = ALL_ROLE_PRESETS[0];
  MATCH_PRESET_CACHE.set(cacheKey, fallbackOpt);
  return fallbackOpt;
}

/**
 * Mesin Pencocok Presisi Bilingual (Kompatibilitas Penuh & Multi-Aspek)
 */
export function matchPresetBilingual(
  rawJobTitleOrContext: string | JobMatchingContext,
  jobDeskParam?: string,
  kualifikasiParam?: string
): RolePresetOption {
  return matchPresetIntensive(rawJobTitleOrContext, jobDeskParam, kualifikasiParam);
}
