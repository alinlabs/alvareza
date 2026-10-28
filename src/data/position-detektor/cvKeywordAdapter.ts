/**
 * CV Keyword & Synonym Adaptation Engine
 * src/data/position-detektor/cvKeywordAdapter.ts
 *
 * Menyelaraskan istilah & kata kunci pada CV secara dinamis sesuai dengan
 * sinonim kata yang tertulis pada Deskripsi Pekerjaan (Jobdesk) & Syarat Kualifikasi loker.
 *
 * Contoh:
 * Jika di loker penyedia kerja terdapat kata "payroll", sementara di preset CV tertulis "penggajian",
 * maka kata "penggajian" pada CV diselaraskan menjadi "payroll" (dengan preservasi format huruf/casing).
 * Hal ini meningkatkan skor kecocokan sistem ATS (Applicant Tracking System).
 */

import { SINONIM_INDONESIA } from './in';
import { SINONIM_ENGLISH } from './en';
import {
  cleanJobTextSymbolsAndPunctuation,
  COMPREHENSIVE_CONJUNCTIONS_AND_STOPWORDS,
  VITAL_2_LETTER_ACRONYMS,
  JobMatchingContext,
} from './matcher';

export interface KeywordAdaptationRule {
  targetKeyword: string; // Kata yang tertulis di poster/loker (misal: "payroll")
  sourceSynonym: string; // Sinonim yang ada di CV yang akan diselaraskan (misal: "penggajian")
  regex: RegExp;
}

export interface KeywordAdaptationResult {
  rules: KeywordAdaptationRule[];
  detectedJobTerms: string[];
}

// Map global sinonim terpadu (term -> Set of synonyms)
const UNIFIED_SYN_GRAPH = new Map<string, Set<string>>();

function registerBidirectional(a: string, b: string) {
  const cleanA = a.toLowerCase().trim();
  const cleanB = b.toLowerCase().trim();
  if (!cleanA || !cleanB || cleanA === cleanB) return;

  if (!UNIFIED_SYN_GRAPH.has(cleanA)) UNIFIED_SYN_GRAPH.set(cleanA, new Set());
  if (!UNIFIED_SYN_GRAPH.has(cleanB)) UNIFIED_SYN_GRAPH.set(cleanB, new Set());

  UNIFIED_SYN_GRAPH.get(cleanA)!.add(cleanB);
  UNIFIED_SYN_GRAPH.get(cleanB)!.add(cleanA);
}

// Inisialisasi graf sinonim dari kamus Indonesia & English
// PENTING: Hanya hubungkan secara langsung (direct mapping) antara entitas kunci dan sinonimnya.
// DILARANG melakukan clique all-to-all (s <-> other) agar tidak terjadi kontaminasi semantik
// antar istilah turunan yang berbeda kategori (misal: 'absensi' atau 'kontrak kerja' tercampur jadi 'hrd').
for (const [key, synList] of Object.entries(SINONIM_INDONESIA)) {
  for (const s of synList) {
    registerBidirectional(key, s);
  }
}

for (const [key, synList] of Object.entries(SINONIM_ENGLISH)) {
  for (const s of synList) {
    registerBidirectional(key, s);
  }
}

// Helper untuk escape karakter spesial regex
function escapeRegExp(str: string): string {
  return str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

/**
 * Mengekstrak seluruh frase & kata kunci substantif dari teks lowongan
 */
export function extractJobKeywords(jobText: string): string[] {
  if (!jobText || !jobText.trim()) return [];

  const cleaned = cleanJobTextSymbolsAndPunctuation(jobText);
  const words = cleaned
    .split(/\s+/)
    .map((w) => w.replace(/[^a-zA-Z0-9]/g, '').trim())
    .filter(Boolean);
  const result = new Set<string>();

  // 1. Ekstraksi kata individual substantif
  for (const w of words) {
    if (VITAL_2_LETTER_ACRONYMS.has(w)) {
      result.add(w);
    } else if (w.length >= 3 && !COMPREHENSIVE_CONJUNCTIONS_AND_STOPWORDS.has(w) && !/^\d+$/.test(w)) {
      result.add(w);
    }
  }

  // 2. Ekstraksi n-gram (2 kata dan 3 kata) untuk menangkap istilah majemuk (e.g. 'human resources', 'supply chain', 'tata kelola')
  for (let i = 0; i < words.length - 1; i++) {
    const w1 = words[i];
    const w2 = words[i + 1];
    if (
      !COMPREHENSIVE_CONJUNCTIONS_AND_STOPWORDS.has(w1) &&
      !COMPREHENSIVE_CONJUNCTIONS_AND_STOPWORDS.has(w2)
    ) {
      result.add(`${w1} ${w2}`);
      if (i < words.length - 2) {
        const w3 = words[i + 2];
        if (!COMPREHENSIVE_CONJUNCTIONS_AND_STOPWORDS.has(w3)) {
          result.add(`${w1} ${w2} ${w3}`);
        }
      }
    }
  }

  return Array.from(result);
}

/**
 * Membangun aturan penggantian sinonim berdasarkan konteks lowongan pekerjaan.
 * Menghasilkan aturan: Jika di CV ada kata 'sourceSynonym', gantikan dengan 'targetKeyword' dari loker.
 */
export function buildKeywordAdaptationRules(context?: JobMatchingContext | null): KeywordAdaptationResult {
  if (!context) {
    return { rules: [], detectedJobTerms: [] };
  }

  const combinedText = [
    context.jobTitle,
    context.jobDesk,
    context.kualifikasi,
    context.rawText,
  ]
    .filter(Boolean)
    .join(' ');

  if (!combinedText.trim()) {
    return { rules: [], detectedJobTerms: [] };
  }

  const jobKeywords = extractJobKeywords(combinedText);
  const rules: KeywordAdaptationRule[] = [];
  const processedPairs = new Set<string>();

  // Kumpulan kata struktur / deskriptif yang TIDAK BOLEH digantikan oleh akronim departemen (e.g. 'hrd', 'hr', 'ga', 'it')
  const STRUCTURAL_WORDS_PROTECTED = new Set([
    'personnel', 'personalia', 'kepegawaian', 'karyawan', 'tenaga kerja',
    'tata kelola', 'operations', 'operasional', 'governance', 'management',
    'manajemen', 'specialist', 'spesialis', 'administration', 'administrasi',
    'support', 'layanan', 'service', 'services', 'systems', 'sistem'
  ]);

  // Akronim departemen yang rentan merusak kalimat jika menggantikan kata benda struktural
  const DEPARTMENT_ACRONYMS = new Set(['hrd', 'hr', 'ga', 'it', 'pmo', 'erp', 'crm', 'qc', 'qa', 'sdm', 'hc']);

  // Periksa setiap keyword yang muncul di lowongan kerja
  for (const targetKw of jobKeywords) {
    const synSet = UNIFIED_SYN_GRAPH.get(targetKw);
    if (!synSet || synSet.size === 0) continue;

    const isTargetAcronym = DEPARTMENT_ACRONYMS.has(targetKw.toLowerCase());

    for (const sourceSyn of synSet) {
      const cleanSource = sourceSyn.toLowerCase().trim();

      // PROTEKSI 1: Jangan ganti jika sinonim sumber juga tertulis secara eksplisit di deskripsi loker
      if (jobKeywords.includes(sourceSyn)) continue;

      // PROTEKSI 2: Akronim departemen (misal 'hrd') dilarang menggantikan kata benda struktural/fungsional
      // Contoh: 'personnel', 'kepegawaian', 'operations' tidak boleh diganti jadi 'hrd'
      if (isTargetAcronym && STRUCTURAL_WORDS_PROTECTED.has(cleanSource)) {
        continue;
      }

      // PROTEKSI 3: Jangan ganti jika sumber adalah akronim dan target adalah frasa panjang yang membuat kalimat canggung
      if (DEPARTMENT_ACRONYMS.has(cleanSource) && targetKw.length > 25) {
        continue;
      }

      // PROTEKSI 4: Dilarang menukar tingkatan hierarki (misal: supervisor/spv dilarang dipromosikan jadi manager/manajer atau sebaliknya)
      const SUPERVISORY_TERMS = new Set(['supervisor', 'spv', 'penyelia', 'pengawas', 'store supervisor']);
      const MANAGERIAL_TERMS = new Set(['manager', 'manajer', 'store manager', 'retail manager', 'general manager', 'gm', 'director', 'direktur']);
      const targetLower = targetKw.toLowerCase().trim();
      if (
        (SUPERVISORY_TERMS.has(cleanSource) && MANAGERIAL_TERMS.has(targetLower)) ||
        (MANAGERIAL_TERMS.has(cleanSource) && SUPERVISORY_TERMS.has(targetLower))
      ) {
        continue;
      }

      const pairKey = `${sourceSyn}--->${targetKw}`;
      if (processedPairs.has(pairKey)) continue;
      processedPairs.add(pairKey);

      // Buat regex word boundary
      const escaped = escapeRegExp(sourceSyn);
      // Mendukung word boundary untuk kata tunggal atau multi-kata
      const pattern = `\\b${escaped}\\b`;
      const regex = new RegExp(pattern, 'gi');

      rules.push({
        targetKeyword: targetKw,
        sourceSynonym: sourceSyn,
        regex,
      });
    }
  }

  // Urutkan aturan dari yang terpanjang (multi-kata) ke terpendek agar frasa spesifik diproses terlebih dahulu
  rules.sort((a, b) => b.sourceSynonym.length - a.sourceSynonym.length);

  return {
    rules,
    detectedJobTerms: jobKeywords,
  };
}

/**
 * Menyelaraskan teks dengan mencocokkan format casing (TitleCase, UPPERCASE, lowercase)
 */
export function adaptTextCasing(originalMatch: string, targetKeyword: string): string {
  // Jika seluruhnya huruf besar (e.g. "PENGGAJIAN") -> "PAYROLL"
  if (originalMatch === originalMatch.toUpperCase() && originalMatch.length > 1) {
    return targetKeyword.toUpperCase();
  }

  // Jika kata-kata dalam match diawali huruf kapital (TitleCase, e.g. "Industrial Relations" atau "Penggajian")
  const words = originalMatch.trim().split(/\s+/);
  const isTitleCase = words.length > 0 && words.every((w) => w.length > 0 && w[0] === w[0].toUpperCase());
  if (isTitleCase) {
    return targetKeyword
      .split(/\s+/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
  }

  // Default: lowercase atau sesuai target asli
  return targetKeyword.toLowerCase();
}

/**
 * Menyesuaikan teks string CV dengan aturan sinonim lowongan dan merapikan redundansi repetitif
 */
export function adaptCvText(text: string, rules: KeywordAdaptationRule[]): string {
  if (!text) return text;

  let result = text;

  // Track target keywords already present or applied in this text block
  // Mencegah pemborosan kata / repetisi (Target Keyword Saturation Guard)
  const saturatedTargets = new Set<string>();

  // Inisialisasi keyword yang SUDAH ADA di teks asli
  // Jika teks sudah mengandung targetKeyword (misal "Industrial Relations"),
  // maka dilarang mengganti kata pelengkap lainnya (misal "Labor Law") menjadi kata yang sama!
  if (rules && rules.length > 0) {
    for (const rule of rules) {
      const targetLower = rule.targetKeyword.toLowerCase().trim();
      const escapedTarget = escapeRegExp(rule.targetKeyword);
      const targetPresenceRegex = new RegExp(`\\b${escapedTarget}\\b`, 'i');
      if (targetPresenceRegex.test(result)) {
        saturatedTargets.add(targetLower);
      }
    }

    for (const rule of rules) {
      const targetLower = rule.targetKeyword.toLowerCase().trim();

      // Jika target keyword SUDAH ADA atau sudah diaplikasikan sebelumnya di teks ini,
      // lewati aturan ini agar tidak merusak kata lain menjadi kata kembar / repetisi!
      if (saturatedTargets.has(targetLower)) {
        continue;
      }

      rule.regex.lastIndex = 0;
      if (rule.regex.test(result)) {
        rule.regex.lastIndex = 0;
        result = result.replace(rule.regex, (match) => {
          saturatedTargets.add(targetLower);
          return adaptTextCasing(match, rule.targetKeyword);
        });
      }
    }
  }

  // =========================================================================
  // MULTI-PASS POST-PROCESSING & UNIVERSAL TAUTOLOGY CLEANUP (Zero-Redundancy)
  // Menjamin 100% tidak ada pemborosan kata multi-kata maupun kata tunggal
  // =========================================================================

  // 1. Bersihkan pengulangan koordinatif identik (Multi-word & Single-word):
  // Contoh: "Industrial Relations & industrial relations" -> "Industrial Relations"
  // Contoh: "Supply Chain & Supply Chain" -> "Supply Chain"
  // Contoh: "HRD & HRD" -> "HRD", "hrd dan hrd" -> "hrd", "HRD / hrd" -> "HRD"
  result = result.replace(/\b([a-zA-Z0-9]+(?:\s+[a-zA-Z0-9]+)*)\s*(?:&|and|dan|\/)\s*\1\b/gi, (match, p1) => {
    return p1;
  });

  // 2. Bersihkan benturan akronim domain yang berdekatan (e.g. "HRD & HR", "HR & HRD"):
  result = result.replace(/\b(hrd|hr)\s*(?:&|dan|and|\/)\s*(hrd|hr)\b/gi, (match) => {
    return match.toUpperCase().includes('HRD') ? 'HRD' : 'HR';
  });

  // 3. Bersihkan sisa benturan domain Industrial Relations:
  result = result.replace(/\b(industrial\s+relations)\s*(?:&|and|dan|\/)\s*(?:industrial\s+relations)\b/gi, 'Industrial Relations');
  result = result.replace(/\b(hubungan\s+industrial)\s*(?:&|and|dan|\/)\s*(?:hubungan\s+industrial)\b/gi, 'Hubungan Industrial');

  // 4. Bersihkan pemborosan kata pada judul spesialisasi / headline:
  // "HRD & hrd administration specialist" -> "HRD Administration Specialist"
  // "HR & hr administration specialist" -> "HR Administration Specialist"
  result = result.replace(/\b(hrd|hr)\s*(?:&|dan|and)\s*(?:hrd|hr)\s+administration\s+specialist\b/gi, '$1 Administration Specialist');
  
  // "HRD & personnel administration specialist" -> "HRD & Personnel Administration Specialist" (Format TitleCase elegan)
  result = result.replace(/\b(hrd|hr)\s*&\s*personnel\s+administration\s+specialist\b/gi, '$1 & Personnel Administration Specialist');

  // "HRD administration and hrd" -> "HRD Administration"
  result = result.replace(/\b(hrd|hr)\s+administration\s+(?:and|dan|&)\s+(?:hrd|hr)\b/gi, '$1 Administration');

  // 5. Bersihkan pemborosan kata pada ringkasan / summary teks:
  // "administrasi hrd & hrd" -> "administrasi HRD"
  result = result.replace(/\badministrasi\s+(?:hrd|hr)\s*(?:&|dan|and)\s*(?:hrd|hr)\b/gi, 'administrasi $1');
  result = result.replace(/\bspesialis\s+administrasi\s+(?:hrd|hr)\s*(?:&|dan|and)\s*(?:hrd|hr)\b/gi, 'spesialis administrasi $1');

  // "HRD Generalist & hrd" -> "HRD Generalist & People Operations"
  result = result.replace(/\b(hrd|hr)\s+generalist\s*(?:&|dan|and)\s*(?:hrd|hr)\b/gi, '$1 Generalist & People Operations');

  // "Strategic hrd & Governance" -> "Strategic People Operations & Governance"
  result = result.replace(/\bstrategic\s+(?:hrd|hr)\s*&\s*governance\b/gi, 'Strategic People Operations & Governance');

  // "memadukan hrd terpadu" -> "memadukan tata kelola SDM terpadu"
  result = result.replace(/\bmemadukan\s+(?:hrd|hr)\s+terpadu\b/gi, 'memadukan tata kelola SDM terpadu');

  // "tata kelola hrd yang patuh" -> "tata kelola kepegawaian yang patuh"
  result = result.replace(/\btata\s+kelola\s+(?:hrd|hr)\s+yang\s+patuh\b/gi, 'tata kelola kepegawaian yang patuh');

  // 6. Bersihkan duplikasi kata berturutan dan tanda kurung berulang:
  result = result.replace(/\b([a-zA-Z0-9]+)\s*\(\s*\1\s*\)/gi, '$1');
  result = result.replace(/\b([a-zA-Z0-9]+)\s*[/–—\-]\s*\1\b/gi, '$1');
  result = result.replace(/\b([a-zA-Z0-9]+)\s+\1\b/gi, '$1');

  return result;
}

export function getAdaptedKeywordStats(
  sampleTexts: string[],
  rules: KeywordAdaptationRule[]
): Array<{ from: string; to: string; count: number }> {
  if (!sampleTexts || sampleTexts.length === 0 || rules.length === 0) return [];

  const joined = sampleTexts.join(' ');
  const stats: Array<{ from: string; to: string; count: number }> = [];

  for (const rule of rules) {
    rule.regex.lastIndex = 0;
    const matches = joined.match(rule.regex);
    if (matches && matches.length > 0) {
      stats.push({
        from: rule.sourceSynonym,
        to: rule.targetKeyword,
        count: matches.length,
      });
    }
  }

  return stats;
}
