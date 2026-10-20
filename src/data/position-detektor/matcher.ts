import { ALL_ROLE_PRESETS, RolePresetOption } from '../preset/RoleConfig';
import { BILINGUAL_PRESET_RULES } from './index';
import {
  generateTitleVariations,
  expandTokensWithSynonyms,
  getSynonymsForTerm,
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
  str = str.replace(/^(?:posisi|position|role|job\s*title|sebagai|dibutuhkan|dibuka|loker|lowongan|we\s*are\s*hiring|we're\s*hiring|hiring|open\s*position|urgently\s*needed)\s*[:=\-–—]\s*/i, '');

  // 2. Hapus noise tanda kurung di akhir seperti (pria/wanita), (fresh graduate), (magang), (kontrak), dll.
  str = str.replace(/\((?:pria|wanita|p\/w|p|w|male|female|m\/f|fresh\s*graduate|fg|magang|intern|internship|kontrak|contract|full\s*time|part\s*time|hybrid|remote|wfh|wfo|min\s*pengalaman[^)]*|\d+\s*tahun[^)]*)\)/gi, '');

  // 3. Normalisasi semua tanda kurung dan tanda baca menjadi spasi
  str = str.replace(/[/\\|•·\-–—_,:;+&()[\]{}'"`]/g, ' ');

  // 4. Normalisasi variasi C-Level, Direksi & Singkatan Kunci
  str = str.replace(/\bcoo\b/g, 'chief operating officer');
  str = str.replace(/\bceo\b/g, 'chief executive officer');
  str = str.replace(/\bcfo\b/g, 'chief financial officer');
  str = str.replace(/\bcto\b/g, 'chief technology officer');
  str = str.replace(/\bcmo\b/g, 'chief marketing officer');
  str = str.replace(/\bchro\b/g, 'chief human resources officer');
  str = str.replace(/\bgm\b/g, 'general manager');
  str = str.replace(/\btu\b/g, 'tata usaha');

  // 5. Normalisasi variasi kata serapan umum (ID <-> EN & singkatan)
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

  // Bersihkan spasi berlebih
  return str.replace(/\s+/g, ' ').trim();
}

/**
 * Pengecekan kecocokan kata atau frasa dengan boundary kata (\b atau awal/akhir spasi)
 */
export function matchesWordBoundary(text: string, term: string): boolean {
  if (!text || !term) return false;
  if (text === term) return true;
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(?:^|\\s)${escaped}(?:\\s|$)`, 'i');
  return regex.test(text);
}

/**
 * Akronim & singkatan penting 2 huruf yang wajib dipertahankan
 */
export const VITAL_2_LETTER_ACRONYMS = new Set([
  'it', 'hr', 'ea', 'pa', 'ap', 'ar', 'qa', 'qc', 'ga', 'mt', 'ui', 'ux', 'bi', 'ba', 'pm', 'gm', 'pr',
  'po', 'so', 'db', 'ai'
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
  'min', 'minimal', 'maks', 'maksimal', 'gaji', 'salary', 'domisili', 'penempatan',
  'fasilitas', 'benefit', 'jurusan', 'pendidikan', 'lulusan', 'strata', 'diploma',
  's1', 'd3', 'sma', 'smk', 'fresh', 'graduate', 'pengalaman', 'kirim', 'email',
  'cv', 'lamaran', 'kontak', 'hubungi', 'whatsapp', 'wa', 'walk', 'interview',
  'dibutuhkan', 'dicari', 'dibuka', 'segera', 'diutamakan', 'bersedia', 'ditempatkan',
  'memiliki', 'mempunyai', 'bidang', 'terkait', 'semua', 'dsb', 'dll', 'dst',

  // 6. CONJUNCTIONS - ENGLISH
  'and', 'or', 'but', 'nor', 'so', 'yet', 'for', 'although', 'though', 'while',
  'whereas', 'if', 'unless', 'until', 'since', 'because', 'as', 'that', 'whether',
  'both', 'either', 'neither', 'also', 'furthermore', 'moreover', 'however',
  'therefore', 'thus', 'meanwhile', 'otherwise', 'then', 'next', 'instead',

  // 7. PREPOSITIONS - ENGLISH
  'in', 'on', 'at', 'to', 'for', 'with', 'by', 'from', 'of', 'about', 'into',
  'through', 'during', 'before', 'after', 'above', 'below', 'under', 'between',
  'among', 'within', 'without', 'toward', 'towards', 'upon', 'across', 'behind',
  'beyond', 'against', 'throughout', 'per', 'via',

  // 8. PRONOUNS, DETERMINERS & AUXILIARY VERBS - ENGLISH
  'the', 'a', 'an', 'this', 'that', 'these', 'those', 'it', 'its', 'they', 'them',
  'their', 'we', 'us', 'our', 'you', 'your', 'he', 'him', 'his', 'she', 'her',
  'is', 'am', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
  'do', 'does', 'did', 'can', 'could', 'will', 'would', 'shall', 'should', 'may',
  'might', 'must', 'all', 'any', 'every', 'each', 'few', 'some', 'several', 'many',
  'much', 'other', 'others', 'such', 'what', 'which', 'who', 'whom', 'whose',

  // 9. JOB ADVERT NOISE - ENGLISH
  'qualification', 'qualifications', 'requirements', 'requirement', 'responsibilities',
  'responsibility', 'responsible', 'duties', 'duty', 'job', 'description', 'candidate',
  'candidates', 'applicant', 'applicants', 'minimum', 'maximum', 'experience',
  'years', 'year', 'degree', 'bachelor', 'diploma', 'salary', 'benefits', 'location',
  'position', 'role', 'apply', 'send', 'resume', 'cv', 'etc', 'eg', 'ie', 'plus',
  'preferred', 'hiring', 'vacancy', 'vacancies', 'needed', 'looking', 'join',
  'team', 'company', 'work', 'working', 'ability'
]);

/**
 * Kata peran generik / jabatan umum
 */
const GENERIC_ROLE_WORDS = new Set([
  'staff', 'admin', 'administrator', 'officer', 'manager', 'lead', 'head',
  'specialist', 'coordinator', 'supervisor', 'spv', 'assistant', 'intern',
  'associate', 'trainee', 'clerk', 'executive', 'generalist'
]);

/**
 * Sebutan peran umum / umbrella roles
 */
const UMBRELLA_GENERIC_ROLES = new Set([
  'office_administration',
  'business_operations',
  'general_affairs',
  'sales_executive',
  'field_operations'
]);

/**
 * Membersihkan tanda baca, simbol (seperti stripe '-', en-dash '–', em-dash '—', bullet '•', '*', dll.),
 * penomoran list (1., a., dll.), serta spasi ganda.
 */
export function cleanJobTextSymbolsAndPunctuation(raw: string): string {
  if (!raw) return '';
  let str = raw.toLowerCase();

  // 1. Hapus bullet points, simbol list, dan berbagai variasi stripe
  str = str.replace(/[•·*+~‣⁃○●■□▪▫►√✔#_—–\-]/g, ' ');

  // 2. Hapus nomor urut / penomoran baris list (e.g., '1.', '2)', 'a.', 'b)', '(1)', '[1]')
  str = str.replace(/(?:^|\s)(?:\(?\d+[.\)]|\[\d+\]|[a-z][.\)])\s+/gi, ' ');

  // 3. Bersihkan seluruh tanda baca lainnya menjadi spasi
  str = str.replace(/[/\\|,:;!?()[\]{}'"`“‘”’$%&^=<>]/g, ' ');

  // 4. Konversi variasi baris & spasi ke single space
  return str.replace(/\s+/g, ' ').trim();
}

/**
 * Ekstraksi token kata kunci dan n-gram dari teks jobdesk & kualifikasi
 * Mem-parsing dan mengeliminasi seluruh kata penghubung, preposisi, dan noise,
 * menyisakan HANYA kata kunci substantif dan frasa kompetensi industri.
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

  // Filter kata penghubung, preposisi, dan kata pengisi
  for (const token of rawTokens) {
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

  // Buat n-gram 2-kata dan 3-kata dari token substantif (bebas kata penghubung)
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
 * Mengevaluasi apakah isi teks Job Desk Detail dan Kualifikasi lebih dominan bahasa Inggris.
 * Jika bahasa Inggris lebih dominan, sistem memicu auto-rotasi CV ke bahasa Inggris ('en').
 */
export function detectDominantLanguage(
  jobDesk?: string,
  kualifikasi?: string,
  jobTitle?: string
): EmailLanguage {
  const combined = [jobDesk, kualifikasi, jobTitle].filter(Boolean).join(' ').toLowerCase();
  if (!combined.trim()) return 'in'; // Default Indonesian

  // Pola & kosakata khas bahasa Inggris
  const enPatterns = [
    /\b(?:and|or|but|with|for|from|to|in|on|at|of|by|as|about|into|through|during|before|after)\b/g,
    /\b(?:the|this|that|these|those|is|are|was|were|be|been|have|has|had|can|could|will|would|should|must)\b/g,
    /\b(?:responsible|responsibility|responsibilities|qualifications|requirements|duties|skills|experience)\b/g,
    /\b(?:develop|developing|manage|managing|create|creating|ensure|ensuring|support|supporting|maintain|maintaining)\b/g,
    /\b(?:bachelor|degree|fluent|proficient|minimum|preferred|plus|knowledge|ability|communication|closely)\b/g,
    /\b(?:execute|executing|deliver|delivery|milestones|stakeholder|collaborate|collaborating|deploy|deploying)\b/g
  ];

  // Pola & kosakata khas bahasa Indonesia
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

  // Morfologi bahasa Inggris (kata berakhiran -ing, -tion, -ment, -able, -ance, -ence)
  const enMorphology = combined.match(/\b[a-z]{4,}(?:ing|tion|ment|able|ness|less|ance|ence)\b/g);
  if (enMorphology) enScore += Math.min(enMorphology.length, 12);

  // Morfologi bahasa Indonesia (kata berawalan meng-, mem-, ber-, di-, pe-, ter-)
  const idMorphology = combined.match(/\b(?:me[a-z]{4,}|ber[a-z]{4,}|di[a-z]{4,}|pe[a-z]{4,}|ter[a-z]{4,})\b/g);
  if (idMorphology) inScore += Math.min(idMorphology.length, 12);

  // Jika skor bahasa Inggris lebih besar dan signifikan (minimal 2 indikator), rotasikan ke English
  if (enScore > inScore && enScore >= 2) {
    return 'en';
  }

  return 'in';
}

/**
 * Mesin Pencocok Presisi Bilingual & Multi-Aspek (Intensive Matcher)
 * Menganalisis Judul Posisi, Job Desk Detail, dan Kualifikasi secara intensif:
 * - Parsing simbol, tanda baca, stripe list, bullet points
 * - Parsing dan mengeliminasi kata penghubung & preposisi
 * - Ekstraksi keyword & n-gram spesifik industri
 * - Multi-tier scoring (Title fit + Job Desk task fit + Kualifikasi skills fit)
 * - Mencegah regresi dan menjaga akurasi maksimal untuk setiap peran
 */
export interface CategoryGroupSpec {
  id: string;
  name: string;
  roleCodes: string[];
  defaultBaselineCode: string;
  specificRoleMatchers: Array<{
    code: string;
    regex: RegExp;
  }>;
}

/**
 * Definisi 10 Kategori/Group Preset Resmi beserta kode peran dan pencocok peran awal.
 */
export const CATEGORY_GROUPS: Record<string, CategoryGroupSpec> = {
  hr_talent: {
    id: 'hr_talent',
    name: 'SDM, Rekrutmen & Pengembangan Talenta',
    roleCodes: ['HRS', 'HGA', 'REC', 'LND', 'ODD', 'HBP', 'CNB', 'IRL', 'PAS', 'EBR'],
    defaultBaselineCode: 'HRS',
    specificRoleMatchers: [
      { code: 'HGA', regex: /\b(?:hrga|hr\s*&\s*ga|hr\s+ga|hr\/ga|hrd\s*ga|hrd\s*&\s*ga|hrd\s+dan\s+ga|hr\s+general\s+affairs|human\s+resources\s+(?:&|and)?\s*general\s+affairs|general\s+affairs\s+(?:&|and)?\s*hr|ga\s+(?:&|and)?\s*hr)\b/i },
      { code: 'REC', regex: /\b(?:recruiter|recruitment|rekrutmen|talent\s*acquisition|hiring|talent\s*sourcer|headhunter|sourcing|talent\s*scout)\b/i },
      { code: 'LND', regex: /\b(?:learning|l&d|lnd|training|pelatihan|trainer|people\s*development|instructional|tna)\b/i },
      { code: 'ODD', regex: /\b(?:organizational\s*development|organization\s*development|od\s*specialist|od\s*manager|pengembangan\s*organisasi|culture\s*engagement)\b/i },
      { code: 'HBP', regex: /\b(?:hrbp|hr\s*business\s*partner|human\s*resources\s*business\s*partner|people\s*partner|mitra\s*bisnis\s*sdm)\b/i },
      { code: 'CNB', regex: /\b(?:compensation|payroll|penggajian|c&b|cnb|remunerasi|total\s*rewards|remuneration|salary|upah)\b/i },
      { code: 'IRL', regex: /\b(?:industrial\s*relations|hubungan\s*industrial|labor\s*relations|disnaker|hukum\s*ketenagakerjaan|perselisihan\s*kerja)\b/i },
      { code: 'PAS', regex: /\b(?:people\s*analytics|hris|hr\s*data|workforce\s*analytics|analis\s*data\s*sdm|sistem\s*informasi\s*sdm)\b/i },
      { code: 'EBR', regex: /\b(?:employer\s*branding|campus\s*recruitment|campus\s*hiring|university\s*relations|bursa\s*karir|job\s*fair)\b/i },
      { code: 'HRS', regex: /\b(?:hr|hrd|human\s*resources|human\s*capital|sdm|personalia|kepegawaian|people\s*operations|people\s*ops|hr\s*generalist|hrd\s*generalist)\b/i },
    ],
  },
  operations_retail: {
    id: 'operations_retail',
    name: 'Operasional, Ritel & Manajemen Lapangan',
    roleCodes: ['OPS', 'RTL', 'BRN', 'GAF', 'QAC', 'MFG', 'FLD', 'UTL', 'OPX', 'FRE', 'POM'],
    defaultBaselineCode: 'OPS',
    specificRoleMatchers: [
      { code: 'RTL', regex: /\b(?:retail|ritel|toko|store|outlet|supermarket|minimarket|kasir\s*retail|kepala\s*toko|pramuniaga)\b/i },
      { code: 'BRN', regex: /\b(?:branch|cabang|multi\s*unit|area\s*manager|kepala\s*cabang)\b/i },
      { code: 'GAF', regex: /\b(?:general\s*affairs|ga\s*manager|ga\s*supervisor|ga\s*officer|ga\s*staff|umum\s*operasional|office\s*manager|workplace\s*operations|facility\s*manager)\b/i },
      { code: 'QAC', regex: /\b(?:qa|qc|quality\s*control|quality\s*assurance|mutu|pengendalian\s*mutu)\b/i },
      { code: 'MFG', regex: /\b(?:manufacturing|manufaktur|plant|pabrik|produksi|production\s*operations|workshop)\b/i },
      { code: 'FLD', regex: /\b(?:lapangan|field|field\s*operations|koordinator\s*lapangan|site\s*supervisor)\b/i },
      { code: 'UTL', regex: /\b(?:utilitas|utility|pdam|bpspams|layanan\s*air|public\s*utilities)\b/i },
      { code: 'OPX', regex: /\b(?:operational\s*excellence|continuous\s*improvement|kaizen|lean|six\s*sigma)\b/i },
      { code: 'FRE', regex: /\b(?:franchise|waralaba|retail\s*expansion|ekspansi\s*ritel)\b/i },
      { code: 'POM', regex: /\b(?:product\s*operations|product\s*ops)\b/i },
      { code: 'OPS', regex: /\b(?:operasional|operations|ops|business\s*operations|branch\s*operations|head\s*of\s*operations|coo)\b/i },
    ],
  },
  finance_accounting: {
    id: 'finance_accounting',
    name: 'Keuangan, Akuntansi & Pengendalian Biaya',
    roleCodes: ['ACC', 'FAC', 'TAX', 'APA', 'PSC', 'IAF'],
    defaultBaselineCode: 'ACC',
    specificRoleMatchers: [
      { code: 'TAX', regex: /\b(?:tax|pajak|perpajakan|brevet|fiskal|spt|e-faktur)\b/i },
      { code: 'APA', regex: /\b(?:ap\s*ar|accounts?\s*payable|accounts?\s*receivable|piutang|utang|billing|invoicing)\b/i },
      { code: 'PSC', regex: /\b(?:pricing|commercial\s*analyst|harga\s*dasar|margin|sku\s*profitability)\b/i },
      { code: 'IAF', regex: /\b(?:internal\s*audit|audit\s*finance|auditor)\b/i },
      { code: 'FAC', regex: /\b(?:financial\s*analyst|cost\s*control|pengendali\s*biaya|hpp|budgeting|anggaran|fp&a)\b/i },
      { code: 'ACC', regex: /\b(?:accounting|akuntansi|akunting|finance|keuangan|pembukuan|ledger|kasir|cashflow|treasury)\b/i },
    ],
  },
  marketing_cx: {
    id: 'marketing_cx',
    name: 'Pemasaran, Hubungan Masyarakat & Customer Service',
    roleCodes: ['MKT', 'PRS', 'CSO', 'MCB', 'PMA', 'ECO', 'SMM', 'GRM', 'BRM'],
    defaultBaselineCode: 'MKT',
    specificRoleMatchers: [
      { code: 'PMA', regex: /\b(?:performance\s*marketing|paid\s*ads|media\s*buyer|meta\s*ads|google\s*ads|roas|ppc)\b/i },
      { code: 'SMM', regex: /\b(?:social\s*media|medsos|content\s*creator|tiktok|instagram|reels)\b/i },
      { code: 'ECO', regex: /\b(?:ecommerce|e-commerce|marketplace|shopee|tokopedia|lazada|tiktok\s*shop)\b/i },
      { code: 'PRS', regex: /\b(?:pr|humas|public\s*relations|media\s*relations|juru\s*bicara|press\s*release)\b/i },
      { code: 'CSO', regex: /\b(?:customer\s*service|cs|cx|customer\s*care|helpdesk|layanan\s*pelanggan|call\s*center)\b/i },
      { code: 'MCB', regex: /\b(?:marcom|marketing\s*communications?|brand\s*activation|event\s*marketing)\b/i },
      { code: 'GRM', regex: /\b(?:growth\s*marketing|growth\s*hacker|lead\s*generation)\b/i },
      { code: 'BRM', regex: /\b(?:brand\s*manager|branding|brand\s*strategist)\b/i },
      { code: 'MKT', regex: /\b(?:marketing|pemasaran|digital\s*marketing|marketer)\b/i },
    ],
  },
  business_sales: {
    id: 'business_sales',
    name: 'Bisnis, B2B Sales, Kemitraan & Hubungan Eksternal',
    roleCodes: ['BDV', 'SLS', 'KAM', 'GOV', 'CSM', 'CSD', 'CSE', 'SOP', 'TND'],
    defaultBaselineCode: 'BDV',
    specificRoleMatchers: [
      { code: 'KAM', regex: /\b(?:key\s*account|kam|strategic\s*account)\b/i },
      { code: 'GOV', regex: /\b(?:government\s*relations|hubungan\s*pemerintah|instansi|kemitraan\s*pemerintah|mou)\b/i },
      { code: 'CSM', regex: /\b(?:client\s*success|customer\s*success|csm|account\s*servicing)\b/i },
      { code: 'CSD', regex: /\b(?:channel\s*sales|distribusi\s*mitra|reseller\s*network|partner\s*manager)\b/i },
      { code: 'CSE', regex: /\b(?:enterprise\s*sales|high\s*ticket|corporate\s*sales|commercial\s*enterprise)\b/i },
      { code: 'SOP', regex: /\b(?:sales\s*operations?|sales\s*ops|sales\s*enablement|crm\s*pipeline)\b/i },
      { code: 'TND', regex: /\b(?:tender|bid|bidding|proposal\s*komersial|rfp|rfq|lelang)\b/i },
      { code: 'SLS', regex: /\b(?:sales|b2b\s*sales|sales\s*executive|sales\s*officer|account\s*executive|salesman|direct\s*sales|penjualan)\b/i },
      { code: 'BDV', regex: /\b(?:business\s*development|bizdev|bdv|pengembangan\s*bisnis|kemitraan)\b/i },
    ],
  },
  supply_chain_logistics: {
    id: 'supply_chain_logistics',
    name: 'Rantai Pasok, Logistik, Gudang & Pengadaan',
    roleCodes: ['SCM', 'PPC', 'PRC', 'WHS', 'LDC', 'VMR', 'DIP'],
    defaultBaselineCode: 'SCM',
    specificRoleMatchers: [
      { code: 'PPC', regex: /\b(?:ppic|perencanaan\s*produksi|inventory\s*control|pengendalian\s*stok)\b/i },
      { code: 'PRC', regex: /\b(?:purchasing|procurement|pengadaan|buyer|sourcing|pembelian)\b/i },
      { code: 'WHS', regex: /\b(?:gudang|warehouse|kepala\s*gudang|stock\s*opname|pergudangan)\b/i },
      { code: 'LDC', regex: /\b(?:fleet|dispatch|ekspedisi|pengiriman|transportasi|armada|kurir)\b/i },
      { code: 'VMR', regex: /\b(?:vendor\s*management|supplier\s*management|hubungan\s*pemasok)\b/i },
      { code: 'DIP', regex: /\b(?:demand\s*planning|demand\s*planner|mrp|peramalan\s*stok)\b/i },
      { code: 'SCM', regex: /\b(?:supply\s*chain|scm|logistik|logistics|rantai\s*pasok)\b/i },
    ],
  },
  project_pmo: {
    id: 'project_pmo',
    name: 'Manajemen Proyek, Program & Delivery',
    roleCodes: ['PMO', 'ITP', 'EVO', 'NGO', 'ASM', 'IPM', 'CPM'],
    defaultBaselineCode: 'PMO',
    specificRoleMatchers: [
      { code: 'ITP', regex: /\b(?:it\s*project|project\s*manager\s*it|digital\s*project|software\s*project)\b/i },
      { code: 'EVO', regex: /\b(?:event|eo|event\s*organizer|production\s*event|penyelenggara\s*acara)\b/i },
      { code: 'NGO', regex: /\b(?:ngo|yayasan|nirlaba|nonprofit|program\s*kemanusiaan)\b/i },
      { code: 'ASM', regex: /\b(?:scrum\s*master|agile|scrum|sprint)\b/i },
      { code: 'IPM', regex: /\b(?:implementation\s*manager|manajer\s*implementasi|onboarding\s*project)\b/i },
      { code: 'CPM', regex: /\b(?:creative\s*project|creative\s*pm|video\s*production|media\s*project)\b/i },
      { code: 'PMO', regex: /\b(?:project|proyek|pmo|project\s*lead|manajemen\s*proyek|project\s*manager)\b/i },
    ],
  },
  admin_secretariat: {
    id: 'admin_secretariat',
    name: 'Administrasi, Kesekretariatan & Dukungan Eksekutif',
    roleCodes: ['ADM', 'AST', 'HOS', 'LGL', 'SAD', 'FBA', 'HRA', 'PRA', 'PPA', 'DEA', 'WHA'],
    defaultBaselineCode: 'ADM',
    specificRoleMatchers: [
      { code: 'AST', regex: /\b(?:sekretaris|secretary|executive\s*assistant|personal\s*assistant|asisten\s*direksi|ea|pa)\b/i },
      { code: 'HOS', regex: /\b(?:administrasi\s*rs|rumah\s*sakit|faskes|klinik|healthcare\s*admin)\b/i },
      { code: 'LGL', regex: /\b(?:legal\s*admin|administrasi\s*hukum|kontrak\s*kerja|document\s*controller)\b/i },
      { code: 'SAD', regex: /\b(?:sales\s*admin|administrasi\s*penjualan)\b/i },
      { code: 'FBA', regex: /\b(?:billing\s*admin|invoicing|kasir\s*admin|administrasi\s*keuangan)\b/i },
      { code: 'HRA', regex: /\b(?:admin\s*hrd?|administrasi\s*personalia|administrasi\s*kepegawaian|admin\s*hr)\b/i },
      { code: 'PRA', regex: /\b(?:project\s*admin|administrasi\s*proyek)\b/i },
      { code: 'PPA', regex: /\b(?:purchasing\s*admin|procurement\s*admin|administrasi\s*pengadaan)\b/i },
      { code: 'DEA', regex: /\b(?:data\s*entry|entry\s*data|master\s*data)\b/i },
      { code: 'WHA', regex: /\b(?:admin\s*gudang|warehouse\s*admin|administrasi\s*pergudangan)\b/i },
      { code: 'ADM', regex: /\b(?:administrasi|admin|administrator|tata\s*usaha|office\s*admin)\b/i },
    ],
  },
  digital_tech: {
    id: 'digital_tech',
    name: 'Digital, ERP, Sistem & Analisis Bisnis',
    roleCodes: ['DIG', 'BAN', 'DAT', 'FED', 'PDM', 'ERP', 'BIA'],
    defaultBaselineCode: 'DIG',
    specificRoleMatchers: [
      { code: 'FED', regex: /\b(?:frontend|front\s*end|web\s*developer|react|javascript|fullstack)\b/i },
      { code: 'BAN', regex: /\b(?:business\s*analyst|analis\s*bisnis|system\s*analyst)\b/i },
      { code: 'BIA', regex: /\b(?:bi\s*analyst|business\s*intelligence|dashboard\s*specialist|looker\s*studio)\b/i },
      { code: 'DAT', regex: /\b(?:data\s*analyst|data\s*operations|data\s*engineer)\b/i },
      { code: 'PDM', regex: /\b(?:product\s*manager|pm\s*tech|product\s*lead)\b/i },
      { code: 'ERP', regex: /\b(?:erp|crm\s*implementation|odoo|sap)\b/i },
      { code: 'DIG', regex: /\b(?:digital\s*solution|software|programmer|developer|it\s*lead|teknologi)\b/i },
    ],
  },
  strategic_consulting: {
    id: 'strategic_consulting',
    name: 'Manajemen Strategis & Konsultansi Bisnis',
    roleCodes: ['MGT', 'CON', 'BTR', 'PAR'],
    defaultBaselineCode: 'MGT',
    specificRoleMatchers: [
      { code: 'CON', regex: /\b(?:management\s*consultant|konsultan\s*manajemen|consulting|advisory)\b/i },
      { code: 'BTR', regex: /\b(?:turnaround|restrukturisasi|business\s*restructuring)\b/i },
      { code: 'PAR', regex: /\b(?:public\s*affairs|kebijakan\s*publik|advokasi)\b/i },
      { code: 'MGT', regex: /\b(?:strategic|manajemen\s*strategis|strategi|general\s*manager|gm)\b/i },
    ],
  },
};

/**
 * Peta alias kode peran ke kode kanonikal resmi
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
  COS: 'MGT',
  STU: 'MGT',
  EXP: 'SCM',
  DGM: 'MKT',
};

/**
 * Helper: Menemukan preset berdasarkan kode (case-insensitive & alias-aware)
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
 * Mesin Pencocok Presisi Bilingual & Multi-Aspek (50% Posisi, 25% Jobdesk, 25% Syarat)
 * Sesuai arsitektur hierarkis:
 * 1. 50% Posisi yang Dilamar -> Menentukan Kategori/Grup dan Rekomendasi Awal (Baseline).
 * 2. 25% Deskripsi Pekerjaan & 25% Syarat/Ketentuan -> Mencocokkan potensi keyword di dalam grup secara intensif.
 * 3. Logika Keputusan:
 *    - Jika tidak ada yang cocok dominan di desk/qual -> kembali ke Rekomendasi Awal (Baseline).
 *    - Jika ada yang dominan paling tinggi berdasarkan keyword hasil parsing -> pilih peran dominan tersebut.
 */
export function matchPresetIntensive(
  context: string | JobMatchingContext,
  jobDeskParam?: string,
  kualifikasiParam?: string
): RolePresetOption {
  let titleStr = '';
  let deskStr = '';
  let qualStr = '';

  if (typeof context === 'string') {
    titleStr = context;
    deskStr = jobDeskParam || '';
    qualStr = kualifikasiParam || '';
  } else if (context && typeof context === 'object') {
    titleStr = context.jobTitle || '';
    deskStr = context.jobDesk || jobDeskParam || '';
    qualStr = context.kualifikasi || kualifikasiParam || '';
  }

  const rawClean = (titleStr || '').trim().toLowerCase();

  // 1. Cek langsung jika input berupa kode 3/4-karakter persis (e.g. 'HRS', 'HGA', 'HRBP', 'TAX', 'ACT', 'PMO')
  if (rawClean) {
    const directMatch = findPresetByCode(rawClean);
    if (directMatch) return directMatch;
  }

  // 2. Normalisasi input & ekstraksi kata kunci substantif
  const normTitle = normalizeJobTitle(titleStr);
  const deskData = extractKeywordsFromJobText(deskStr);
  const qualData = extractKeywordsFromJobText(qualStr);

  const hasDeskOrQual = deskData.keywords.length > 0 || qualData.keywords.length > 0;

  // Jika seluruh kolom kosong, kembalikan preset default optimal
  if (!normTitle && !hasDeskOrQual) {
    return ALL_ROLE_PRESETS[0]; // 'optimal'
  }

  // Ekstraksi sinonim substantif dari Job Desk dan Kualifikasi
  const expandedDeskKeywords = new Set(expandTokensWithSynonyms(deskData.keywords));
  const expandedQualKeywords = new Set(expandTokensWithSynonyms(qualData.keywords));
  const titleVariations = normTitle ? generateTitleVariations(normTitle) : [];

  // =========================================================================
  // TAHAP 1: EVALUASI POSISI YANG DILAMAR (BOBOT 50% DOMINAN)
  // Menentukan Kategori / Group Preset Role dan Rekomendasi Awal (Baseline Role)
  // =========================================================================
  let determinedGroupKey: string = 'featured';
  let baselineRoleCode: string = 'OPT';
  let highestGroupScore = -1;

  if (normTitle) {
    // Evaluasi kecocokan judul terhadap setiap Group
    for (const group of Object.values(CATEGORY_GROUPS)) {
      let groupAffinityScore = 0;
      let groupBestMatcherCode = group.defaultBaselineCode;
      let groupBestMatcherScore = 0;

      for (const matcher of group.specificRoleMatchers) {
        let matcherScore = 0;
        if (matcher.regex.test(normTitle)) {
          // Exact regex boundary match
          matcherScore += 350;
        } else if (titleVariations.some((tv) => matcher.regex.test(tv))) {
          matcherScore += 260;
        }

        // Cek exact phrase dari aturan preset terkait kode peran ini
        const associatedRule = BILINGUAL_PRESET_RULES.find(
          (r) => r.code === matcher.code || CODE_ALIAS_MAP[r.code] === matcher.code
        );
        if (associatedRule) {
          for (const phrase of associatedRule.exactPhrases) {
            const normP = normalizeJobTitle(phrase);
            if (!normP) continue;
            if (normTitle === normP) {
              matcherScore += 400;
              break;
            } else if (matchesWordBoundary(normTitle, normP)) {
              matcherScore += 240;
            } else if (titleVariations.some((tv) => matchesWordBoundary(tv, normP))) {
              matcherScore += 180;
            }
          }
        }

        groupAffinityScore += matcherScore;
        if (matcherScore > groupBestMatcherScore) {
          groupBestMatcherScore = matcherScore;
          groupBestMatcherCode = matcher.code;
        }
      }

      if (groupAffinityScore > highestGroupScore) {
        highestGroupScore = groupAffinityScore;
        determinedGroupKey = group.id;
        baselineRoleCode = groupBestMatcherCode;
      }
    }
  }

  // Jika judul kosong atau tidak menghasilkan kecocokan grup spesifik:
  // Tentukan grup dari densitas keyword gabungan deskripsi & kualifikasi
  if (highestGroupScore <= 50 && hasDeskOrQual) {
    let bestDeskGroupKey = 'operations_retail';
    let highestDeskGroupScore = 0;

    for (const group of Object.values(CATEGORY_GROUPS)) {
      let groupScore = 0;
      for (const code of group.roleCodes) {
        const rule = BILINGUAL_PRESET_RULES.find(
          (r) => r.code === code || CODE_ALIAS_MAP[r.code] === code
        );
        if (!rule) continue;
        for (const kw of rule.strongKeywords) {
          const normKw = normalizeJobTitle(kw);
          if (normKw && (deskData.cleanText.includes(normKw) || qualData.cleanText.includes(normKw))) {
            groupScore += 20;
          }
        }
      }
      if (groupScore > highestDeskGroupScore) {
        highestDeskGroupScore = groupScore;
        bestDeskGroupKey = group.id;
      }
    }

    determinedGroupKey = bestDeskGroupKey;
    baselineRoleCode = CATEGORY_GROUPS[bestDeskGroupKey]?.defaultBaselineCode || 'OPS';
  }

  const activeGroup = CATEGORY_GROUPS[determinedGroupKey] || CATEGORY_GROUPS['hr_talent'];
  const baselinePreset = findPresetByCode(baselineRoleCode) || ALL_ROLE_PRESETS[0];

  // =========================================================================
  // TAHAP 2: EVALUASI KEYWORD DESKRIPSI PEKERJAAN (25%) & SYARAT/KETENTUAN (25%)
  // Mencocokkan potensi kesamaan keyword secara intensif pada seluruh peran di dalam grup
  // =========================================================================
  interface RoleScoreCandidate {
    preset: RolePresetOption;
    code: string;
    deskScore: number;         // 0 - 250 (25%)
    qualScore: number;         // 0 - 250 (25%)
    totalKeywordScore: number; // 0 - 500 (50%)
    matchedKeywords: string[];
    keywordCount: number;
  }

  const roleCandidates: RoleScoreCandidate[] = [];

  // Evaluasi seluruh role code yang ada di dalam kategori/group yang ditentukan
  for (const code of activeGroup.roleCodes) {
    const preset = findPresetByCode(code);
    if (!preset) continue;

    const rule = BILINGUAL_PRESET_RULES.find(
      (r) => r.code === code || r.key === preset.key || CODE_ALIAS_MAP[r.code] === code
    );

    let deskScore = 0;
    let qualScore = 0;
    const matchedKeywordsSet = new Set<string>();

    if (rule) {
      // --- 1. Evaluasi Deskripsi Pekerjaan (Bobot 25% -> 0 - 250) ---
      if (deskData.cleanText) {
        // Exact Phrases di Jobdesk
        for (const phrase of rule.exactPhrases) {
          const normP = normalizeJobTitle(phrase);
          if (!normP || normP.length < 3) continue;
          if (deskData.cleanText.includes(normP) || deskData.parsedKeywordsText.includes(normP)) {
            deskScore += 45;
            matchedKeywordsSet.add(normP);
          }
        }

        // Strong Keywords di Jobdesk & Sinonim
        for (const kw of rule.strongKeywords) {
          const normKw = normalizeJobTitle(kw);
          if (!normKw) continue;
          if (matchesWordBoundary(deskData.cleanText, normKw) || matchesWordBoundary(deskData.parsedKeywordsText, normKw)) {
            deskScore += 25;
            matchedKeywordsSet.add(normKw);
          } else if (expandedDeskKeywords.has(normKw)) {
            deskScore += 16;
            matchedKeywordsSet.add(normKw);
          }
        }

        // Secondary Keywords di Jobdesk
        if (rule.secondaryKeywords) {
          for (const sk of rule.secondaryKeywords) {
            const normSk = normalizeJobTitle(sk);
            if (!normSk) continue;
            if (matchesWordBoundary(deskData.cleanText, normSk) || expandedDeskKeywords.has(normSk)) {
              deskScore += 12;
              matchedKeywordsSet.add(normSk);
            }
          }
        }

        // Match dengan deskripsi kompetensi profil preset
        const posId = (preset.positionsIn || preset.positionsId || '').toLowerCase();
        const descId = (preset.descIn || preset.descId || '').toLowerCase();
        for (const ngram of deskData.ngrams.slice(0, 15)) {
          if (ngram.length > 5 && (descId.includes(ngram) || posId.includes(ngram))) {
            deskScore += 10;
            matchedKeywordsSet.add(ngram);
          }
        }

        // Penalti Negative Keywords
        if (rule.negativeKeywords) {
          for (const nk of rule.negativeKeywords) {
            const normNk = normalizeJobTitle(nk);
            if (normNk && matchesWordBoundary(deskData.cleanText, normNk)) {
              deskScore -= 35;
            }
          }
        }
      }

      // --- 2. Evaluasi Syarat & Ketentuan / Kualifikasi (Bobot 25% -> 0 - 250) ---
      if (qualData.cleanText) {
        // Exact Phrases di Kualifikasi
        for (const phrase of rule.exactPhrases) {
          const normP = normalizeJobTitle(phrase);
          if (!normP || normP.length < 3) continue;
          if (qualData.cleanText.includes(normP) || qualData.parsedKeywordsText.includes(normP)) {
            qualScore += 45;
            matchedKeywordsSet.add(normP);
          }
        }

        // Strong Keywords di Kualifikasi & Sinonim
        for (const kw of rule.strongKeywords) {
          const normKw = normalizeJobTitle(kw);
          if (!normKw) continue;
          if (matchesWordBoundary(qualData.cleanText, normKw) || matchesWordBoundary(qualData.parsedKeywordsText, normKw)) {
            qualScore += 25;
            matchedKeywordsSet.add(normKw);
          } else if (expandedQualKeywords.has(normKw)) {
            qualScore += 16;
            matchedKeywordsSet.add(normKw);
          }
        }

        // Secondary Keywords di Kualifikasi
        if (rule.secondaryKeywords) {
          for (const sk of rule.secondaryKeywords) {
            const normSk = normalizeJobTitle(sk);
            if (!normSk) continue;
            if (matchesWordBoundary(qualData.cleanText, normSk) || expandedQualKeywords.has(normSk)) {
              qualScore += 12;
              matchedKeywordsSet.add(normSk);
            }
          }
        }

        // Match dengan deskripsi kompetensi profil preset
        const posId = (preset.positionsIn || preset.positionsId || '').toLowerCase();
        const descId = (preset.descIn || preset.descId || '').toLowerCase();
        for (const ngram of qualData.ngrams.slice(0, 15)) {
          if (ngram.length > 5 && (descId.includes(ngram) || posId.includes(ngram))) {
            qualScore += 10;
            matchedKeywordsSet.add(ngram);
          }
        }

        // Penalti Negative Keywords
        if (rule.negativeKeywords) {
          for (const nk of rule.negativeKeywords) {
            const normNk = normalizeJobTitle(nk);
            if (normNk && matchesWordBoundary(qualData.cleanText, normNk)) {
              qualScore -= 35;
            }
          }
        }
      }
    }

    const clampedDeskScore = Math.max(0, Math.min(250, deskScore));
    const clampedQualScore = Math.max(0, Math.min(250, qualScore));
    const totalKeywordScore = clampedDeskScore + clampedQualScore;
    const matchedKeywords = Array.from(matchedKeywordsSet);

    roleCandidates.push({
      preset,
      code,
      deskScore: clampedDeskScore,
      qualScore: clampedQualScore,
      totalKeywordScore,
      matchedKeywords,
      keywordCount: matchedKeywords.length,
    });
  }

  // =========================================================================
  // TAHAP 3: LOGIKA KEPUTUSAN AKHIR (DECISION ENGINE)
  // Aturan User:
  // 1. Jika benar-benar tidak ada yang cocok di desk/qual -> kembali ke rekomendasi awal (baselineRoleCode).
  // 2. Jika ada yang cocok dominan paling tinggi berdasarkan keyword hasil parsing
  //    (misal 'HRS' lebih banyak dan dominan kesamaan keyword lebih banyak) -> maka pilih peran dominan tersebut.
  // =========================================================================

  // Urutkan kandidat berdasarkan:
  // 1. Jumlah kata kunci yang cocok (keywordCount)
  // 2. Total skor bobot keyword (totalKeywordScore)
  roleCandidates.sort((a, b) => {
    if (b.keywordCount !== a.keywordCount) {
      return b.keywordCount - a.keywordCount;
    }
    return b.totalKeywordScore - a.totalKeywordScore;
  });

  const topCandidate = roleCandidates[0];
  const baselineCandidate = roleCandidates.find(
    (c) => c.code === baselineRoleCode || CODE_ALIAS_MAP[c.code] === baselineRoleCode
  );

  // Jika kolom deskripsi dan kualifikasi kosong atau tidak memiliki keyword substantif yang cocok:
  // KEMBALI KE REKOMENDASI AWAL
  if (!hasDeskOrQual || !topCandidate || topCandidate.keywordCount === 0 || topCandidate.totalKeywordScore < 30) {
    return baselinePreset;
  }

  // Jika kandidat dengan keyword tertinggi adalah baseline itu sendiri:
  if (topCandidate.code === baselineRoleCode || CODE_ALIAS_MAP[topCandidate.code] === baselineRoleCode) {
    return baselinePreset;
  }

  // Jika ada peran lain yang COCOK DOMINAN PALING TINGGI:
  // Syarat dominan:
  // - Memiliki keywordCount minimal 2
  // - keywordCount lebih banyak dari baselineCandidate
  // - totalKeywordScore lebih tinggi secara signifikan dari baselineCandidate (selisih minimal 20 poin atau skor >= 45 jika baseline 0)
  const baselineHits = baselineCandidate ? baselineCandidate.keywordCount : 0;
  const baselineScore = baselineCandidate ? baselineCandidate.totalKeywordScore : 0;

  const isDominantAboveBaseline =
    topCandidate.keywordCount >= 2 &&
    topCandidate.keywordCount > baselineHits &&
    topCandidate.totalKeywordScore >= baselineScore + 20;

  if (isDominantAboveBaseline) {
    return topCandidate.preset;
  }

  // Jika tidak ada peran lain yang dominan secara jelas di atas baseline:
  // Kembali ke Rekomendasi Awal (Baseline Role)
  return baselineCandidate ? baselineCandidate.preset : baselinePreset;
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

