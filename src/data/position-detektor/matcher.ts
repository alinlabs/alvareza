import { ALL_ROLE_PRESETS, RolePresetOption } from '../preset/RoleConfig';
import { BILINGUAL_PRESET_RULES } from './index';

export type EmailLanguage = 'in' | 'en';

export interface JobMatchingContext {
  jobTitle?: string;
  jobDesk?: string;
  kualifikasi?: string;
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

  // 1. Cek langsung jika input berupa kode 3-karakter atau nama key persis (misal 'ADM', 'PMO', 'WHA', 'TAX')
  if (rawClean) {
    const directMatch = ALL_ROLE_PRESETS.find(
      (p) =>
        p.code.toLowerCase() === rawClean ||
        p.key.toLowerCase() === rawClean ||
        p.code.toLowerCase() === rawClean.replace(/[^a-z0-9]/g, '')
    );
    if (directMatch) return directMatch;
  }

  // 2. Normalisasi & ekstraksi token
  const normTitle = normalizeJobTitle(titleStr);
  const deskData = extractKeywordsFromJobText(deskStr);
  const qualData = extractKeywordsFromJobText(qualStr);

  const hasDeskOrQual = deskData.keywords.length > 0 || qualData.keywords.length > 0;

  // Jika semua kolom kosong, fallback ke 'optimal'
  if (!normTitle && !hasDeskOrQual) {
    return ALL_ROLE_PRESETS[0]; // 'optimal'
  }

  const fullCleanContext = [normTitle, deskData.cleanText, qualData.cleanText].filter(Boolean).join(' ');

  // Periksa apakah judul yang dimasukkan adalah judul umum/payung level (e.g. 'staff', 'admin', 'coordinator lapangan', 'executive')
  const isGenericTitle =
    !normTitle ||
    /^(?:admin|administrator|staff|staf|officer|supervisor|spv|asisten|assistant|koordinator|coordinator|lead|head|specialist|spesialis|executive|eksekutif|generalist|operasional|operations|lapangan|field)(?:\s+(?:admin|administrator|staff|staf|officer|umum|kantor|operasional|operations|lapangan|field))?$/.test(
      normTitle
    );

  let bestMatchKey = 'optimal';
  let highestScore = 0;

  for (const rule of BILINGUAL_PRESET_RULES) {
    // A. Syarat Mutlak (Must Include Any)
    if (rule.mustIncludeAny && rule.mustIncludeAny.length > 0) {
      const hasRequired = rule.mustIncludeAny.some((req) => {
        const normReq = normalizeJobTitle(req);
        return (
          matchesWordBoundary(normTitle, normReq) ||
          matchesWordBoundary(fullCleanContext, normReq) ||
          fullCleanContext.includes(normReq)
        );
      });
      if (!hasRequired) continue;
    }

    let score = 0;

    // ==========================================
    // 1. EVALUASI JUDUL POSISI (Ambil skor frasa terbaik)
    // ==========================================
    if (normTitle) {
      let maxTitlePhraseScore = 0;
      for (const phrase of rule.exactPhrases) {
        const normPhrase = normalizeJobTitle(phrase);
        if (!normPhrase) continue;
        if (normTitle === normPhrase) {
          const s = (isGenericTitle && hasDeskOrQual) ? 120 : 360;
          if (s > maxTitlePhraseScore) maxTitlePhraseScore = s;
        } else if (matchesWordBoundary(normTitle, normPhrase)) {
          const s = (isGenericTitle && hasDeskOrQual) ? 80 : 270;
          if (s > maxTitlePhraseScore) maxTitlePhraseScore = s;
        } else if (
          !GENERIC_ROLE_WORDS.has(normTitle) &&
          !isGenericTitle &&
          normPhrase.length >= 4 &&
          matchesWordBoundary(normPhrase, normTitle)
        ) {
          const s = 150;
          if (s > maxTitlePhraseScore) maxTitlePhraseScore = s;
        }
      }
      score += maxTitlePhraseScore;

      // Strong Keywords pada Judul
      for (const kw of rule.strongKeywords) {
        const normKw = normalizeJobTitle(kw);
        if (!normKw) continue;
        if (matchesWordBoundary(normTitle, normKw)) {
          score += 65;
        }
      }

      // Check mustIncludeAny matches on title directly (e.g. 'tax' in 'staff accounting tax')
      if (rule.mustIncludeAny) {
        for (const req of rule.mustIncludeAny) {
          const normReq = normalizeJobTitle(req);
          if (normReq && matchesWordBoundary(normTitle, normReq)) {
            score += 70;
          }
        }
      }

      // Secondary Keywords pada Judul
      if (rule.secondaryKeywords) {
        for (const sk of rule.secondaryKeywords) {
          const normSk = normalizeJobTitle(sk);
          if (normSk && matchesWordBoundary(normTitle, normSk)) {
            score += 25;
          }
        }
      }

      // Negative Keywords pada Judul (Penalti)
      if (rule.negativeKeywords) {
        for (const nk of rule.negativeKeywords) {
          const normNk = normalizeJobTitle(nk);
          if (normNk && matchesWordBoundary(normTitle, normNk)) {
            score -= 220;
          }
        }
      }
    }

    // ==========================================
    // 2. EVALUASI JOB DESK DETAIL (Tugas & Operasional Bebas Kata Penghubung)
    // ==========================================
    if (deskData.cleanText) {
      // Kecocokan frasa domain di jobdesk (Bobot intensif tinggi)
      for (const phrase of rule.exactPhrases) {
        const normPhrase = normalizeJobTitle(phrase);
        if (!normPhrase || normPhrase.length < 4) continue;
        if (deskData.cleanText.includes(normPhrase) || deskData.parsedKeywordsText.includes(normPhrase)) {
          score += 160;
        }
      }

      // Kecocokan kata kunci kuat di jobdesk
      for (const kw of rule.strongKeywords) {
        const normKw = normalizeJobTitle(kw);
        if (!normKw) continue;
        if (
          matchesWordBoundary(deskData.cleanText, normKw) ||
          matchesWordBoundary(deskData.parsedKeywordsText, normKw)
        ) {
          score += 85;
        }
      }

      // Kecocokan mustIncludeAny di jobdesk (Indikator kuat peran domain)
      if (rule.mustIncludeAny) {
        for (const req of rule.mustIncludeAny) {
          const normReq = normalizeJobTitle(req);
          if (
            normReq &&
            (matchesWordBoundary(deskData.cleanText, normReq) ||
              matchesWordBoundary(deskData.parsedKeywordsText, normReq))
          ) {
            score += 80;
          }
        }
      }

      // Kecocokan kata kunci sekunder di jobdesk
      if (rule.secondaryKeywords) {
        for (const sk of rule.secondaryKeywords) {
          const normSk = normalizeJobTitle(sk);
          if (
            normSk &&
            (matchesWordBoundary(deskData.cleanText, normSk) ||
              matchesWordBoundary(deskData.parsedKeywordsText, normSk))
          ) {
            score += 35;
          }
        }
      }

      // Penalti negatif di jobdesk (jika bertolak belakang dengan aturan spesifik)
      if (rule.negativeKeywords) {
        for (const nk of rule.negativeKeywords) {
          const normNk = normalizeJobTitle(nk);
          if (
            normNk &&
            (matchesWordBoundary(deskData.cleanText, normNk) ||
              matchesWordBoundary(deskData.parsedKeywordsText, normNk))
          ) {
            score -= 120;
          }
        }
      }
    }

    // ==========================================
    // 3. EVALUASI KUALIFIKASI (Keahlian & Syarat Bebas Kata Penghubung)
    // ==========================================
    if (qualData.cleanText) {
      // Kecocokan frasa domain di kualifikasi
      for (const phrase of rule.exactPhrases) {
        const normPhrase = normalizeJobTitle(phrase);
        if (!normPhrase || normPhrase.length < 4) continue;
        if (qualData.cleanText.includes(normPhrase) || qualData.parsedKeywordsText.includes(normPhrase)) {
          score += 140;
        }
      }

      // Kecocokan kata kunci kuat di kualifikasi
      for (const kw of rule.strongKeywords) {
        const normKw = normalizeJobTitle(kw);
        if (!normKw) continue;
        if (
          matchesWordBoundary(qualData.cleanText, normKw) ||
          matchesWordBoundary(qualData.parsedKeywordsText, normKw)
        ) {
          score += 75;
        }
      }

      // Kecocokan mustIncludeAny di kualifikasi
      if (rule.mustIncludeAny) {
        for (const req of rule.mustIncludeAny) {
          const normReq = normalizeJobTitle(req);
          if (
            normReq &&
            (matchesWordBoundary(qualData.cleanText, normReq) ||
              matchesWordBoundary(qualData.parsedKeywordsText, normReq))
          ) {
            score += 70;
          }
        }
      }

      // Kecocokan kata kunci sekunder di kualifikasi
      if (rule.secondaryKeywords) {
        for (const sk of rule.secondaryKeywords) {
          const normSk = normalizeJobTitle(sk);
          if (
            normSk &&
            (matchesWordBoundary(qualData.cleanText, normSk) ||
              matchesWordBoundary(qualData.parsedKeywordsText, normSk))
          ) {
            score += 30;
          }
        }
      }
    }

    // ==========================================
    // 4. CROSS-CHECK DENGAN PRESET CATALOG METADATA
    // ==========================================
    const matchedPreset = ALL_ROLE_PRESETS.find((p) => p.key === rule.key);
    if (matchedPreset) {
      const posId = (matchedPreset.positionsId || '').toLowerCase();
      const posEn = (matchedPreset.positionsEn || '').toLowerCase();
      const descId = (matchedPreset.descId || '').toLowerCase();

      // Cek apakah n-grams jobdesk/kualifikasi ada di deskripsi preset
      for (const ngram of deskData.ngrams.slice(0, 15)) {
        if (ngram.length > 5 && (descId.includes(ngram) || posId.includes(ngram) || posEn.includes(ngram))) {
          score += 25;
        }
      }
      for (const ngram of qualData.ngrams.slice(0, 15)) {
        if (ngram.length > 5 && (descId.includes(ngram) || posId.includes(ngram) || posEn.includes(ngram))) {
          score += 20;
        }
      }
    }

    // Redam preset payung umum jika ada tugas spesifik yang dimasukkan pada peran lain
    if (UMBRELLA_GENERIC_ROLES.has(rule.key) && hasDeskOrQual && isGenericTitle) {
      score -= 60;
    }

    if (score > highestScore) {
      highestScore = score;
      bestMatchKey = rule.key;
    }
  }

  // Jika skor meyakinkan (>= 40), kembalikan preset terbaik
  if (highestScore >= 40) {
    const found = ALL_ROLE_PRESETS.find((p) => p.key === bestMatchKey);
    if (found) return found;
  }

  // Cadangan token-level jika belum terdeteksi (fallback pintar)
  const allTokens = [
    ...normTitle.split(/\s+/),
    ...deskData.keywords.slice(0, 10),
    ...qualData.keywords.slice(0, 10)
  ].filter((t) => t.length > 2 || VITAL_2_LETTER_ACRONYMS.has(t));

  let tokenBestKey = 'optimal';
  let tokenHighScore = 0;

  for (const preset of ALL_ROLE_PRESETS) {
    if (preset.key === 'optimal' || preset.key === 'all') continue;
    let tScore = 0;

    const posId = (preset.positionsIn || preset.positionsId || '').toLowerCase();
    const posEn = (preset.positionsEn || '').toLowerCase();
    const titleId = (preset.titleIn || preset.titleId || '').toLowerCase();
    const titleEn = (preset.titleEn || '').toLowerCase();
    const descId = (preset.descIn || preset.descId || '').toLowerCase();

    for (const t of allTokens) {
      if (matchesWordBoundary(posId, t)) tScore += 15;
      if (matchesWordBoundary(posEn, t)) tScore += 15;
      if (matchesWordBoundary(titleId, t)) tScore += 15;
      if (matchesWordBoundary(titleEn, t)) tScore += 15;
      if (matchesWordBoundary(descId, t)) tScore += 10;
    }

    if (tScore > tokenHighScore) {
      tokenHighScore = tScore;
      tokenBestKey = preset.key;
    }
  }

  if (tokenHighScore >= 20) {
    const found = ALL_ROLE_PRESETS.find((p) => p.key === tokenBestKey);
    if (found) return found;
  }

  // Default optimal jika tidak ada indikator spesifik
  return ALL_ROLE_PRESETS[0]; // 'optimal'
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
