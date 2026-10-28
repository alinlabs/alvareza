/**
 * Engine Ekspansi Sinonim Karir & Kompetensi Kerja (Bilingual ID & EN)
 * src/data/position-detektor/synonymEngine.ts
 */

import { SINONIM_INDONESIA } from './in';
import { SINONIM_ENGLISH } from './en';

// Satukan kamus sinonim untuk lookup cepat O(1)
const UNIFIED_SYNONYM_MAP = new Map<string, Set<string>>();

function registerSynonym(term: string, syns: string[]) {
  const cleanTerm = term.toLowerCase().trim();
  if (!cleanTerm) return;

  let existing = UNIFIED_SYNONYM_MAP.get(cleanTerm);
  if (!existing) {
    existing = new Set<string>();
    UNIFIED_SYNONYM_MAP.set(cleanTerm, existing);
  }

  for (const s of syns) {
    const cleanSyn = s.toLowerCase().trim();
    if (cleanSyn && cleanSyn !== cleanTerm) {
      existing.add(cleanSyn);
    }
  }
}

// Inisialisasi dari kamus Indonesia
for (const [key, list] of Object.entries(SINONIM_INDONESIA)) {
  registerSynonym(key, list);
  // Tambahkan relasi dua arah (bidirectional)
  for (const item of list) {
    registerSynonym(item, [key, ...list]);
  }
}

// Inisialisasi dari kamus English
for (const [key, list] of Object.entries(SINONIM_ENGLISH)) {
  registerSynonym(key, list);
  for (const item of list) {
    registerSynonym(item, [key, ...list]);
  }
}

// Cache hasil konversi Set ke Array untuk lookup instan O(1) tanpa alokasi memori berulang
const TERM_ARRAY_CACHE = new Map<string, string[]>();
const TITLE_VARIATIONS_CACHE = new Map<string, string[]>();

/**
 * Mengambil seluruh sinonim dari satu kata atau frasa tertentu
 */
export function getSynonymsForTerm(term: string): string[] {
  if (!term) return [];
  const clean = term.toLowerCase().trim();
  const cached = TERM_ARRAY_CACHE.get(clean);
  if (cached) return cached;

  const set = UNIFIED_SYNONYM_MAP.get(clean);
  if (!set || set.size === 0) {
    const empty: string[] = [];
    TERM_ARRAY_CACHE.set(clean, empty);
    return empty;
  }
  const result = Array.from(set);
  TERM_ARRAY_CACHE.set(clean, result);
  return result;
}

/**
 * Memperluas daftar token/kata kunci dengan seluruh sinonim yang relevan.
 * Berguna saat membandingkan keyword dari jobdesk & kualifikasi.
 */
export function expandTokensWithSynonyms(tokens: string[]): string[] {
  if (!tokens || tokens.length === 0) return [];
  const result = new Set<string>();

  // Batasi pemrosesan maksimal 60 token unik agar performa tetap 60fps
  const limitedTokens = tokens.slice(0, 60);

  for (const token of limitedTokens) {
    if (!token) continue;
    const clean = token.toLowerCase().trim();
    result.add(clean);

    const synonyms = getSynonymsForTerm(clean);
    // Batasi 8 sinonim teratas per token
    const topSynonyms = synonyms.slice(0, 8);
    for (const syn of topSynonyms) {
      result.add(syn);
      if (syn.includes(' ')) {
        const parts = syn.split(/\s+/);
        for (const p of parts) {
          if (p.length > 2) result.add(p);
        }
      }
    }
  }

  return Array.from(result);
}

/**
 * Menghasilkan variasi judul sinonim dari judul posisi yang diinput dengan caching instan O(1).
 * Contoh: "HRD Manager" -> ["hr manager", "human resources manager", "manajer hrd", "manajer sdm"]
 */
export function generateTitleVariations(rawTitle: string): string[] {
  if (!rawTitle) return [];
  const clean = rawTitle.toLowerCase().trim().replace(/[/\\|•·\-–—_,:;+&()[\]{}'"`]/g, ' ').replace(/\s+/g, ' ');
  if (!clean) return [];

  const cached = TITLE_VARIATIONS_CACHE.get(clean);
  if (cached) return cached;

  const words = clean.split(' ').filter(Boolean);
  if (words.length === 0) return [];

  const variations = new Set<string>();
  variations.add(clean);

  // Ambil sinonim untuk seluruh frasa utuh terlebih dahulu (paling relevan)
  const wholePhraseSynonyms = getSynonymsForTerm(clean);
  for (const s of wholePhraseSynonyms.slice(0, 10)) {
    variations.add(s);
  }

  // Jika kata tunggal
  if (words.length === 1) {
    const syns = getSynonymsForTerm(words[0]);
    for (const s of syns.slice(0, 10)) {
      variations.add(s);
    }
  } else if (words.length === 2) {
    // 2 kata (misal: "hrd manager")
    const syns1 = [words[0], ...getSynonymsForTerm(words[0]).slice(0, 4)];
    const syns2 = [words[1], ...getSynonymsForTerm(words[1]).slice(0, 4)];
    for (const s1 of syns1) {
      for (const s2 of syns2) {
        if (variations.size >= 16) break;
        variations.add(`${s1} ${s2}`);
      }
      if (variations.size >= 16) break;
    }
  } else if (words.length === 3) {
    // 3 kata: batasi kombinasi agar tidak eksponensial
    const syns1 = [words[0], ...getSynonymsForTerm(words[0]).slice(0, 2)];
    const syns2 = [words[1], ...getSynonymsForTerm(words[1]).slice(0, 2)];
    const syns3 = [words[2], ...getSynonymsForTerm(words[2]).slice(0, 2)];
    for (const s1 of syns1) {
      for (const s2 of syns2) {
        for (const s3 of syns3) {
          if (variations.size >= 16) break;
          variations.add(`${s1} ${s2} ${s3}`);
        }
        if (variations.size >= 16) break;
      }
      if (variations.size >= 16) break;
    }
  } else {
    // Lebih dari 3 kata: ambil sinonim kata penting terpanjang saja
    for (const w of words) {
      if (w.length > 3) {
        const syns = getSynonymsForTerm(w);
        for (const s of syns.slice(0, 3)) {
          if (variations.size >= 16) break;
          variations.add(clean.split(w).join(s));
        }
      }
      if (variations.size >= 16) break;
    }
  }

  const result = Array.from(variations).slice(0, 16);
  if (TITLE_VARIATIONS_CACHE.size > 200) {
    TITLE_VARIATIONS_CACHE.clear();
  }
  TITLE_VARIATIONS_CACHE.set(clean, result);
  return result;
}
