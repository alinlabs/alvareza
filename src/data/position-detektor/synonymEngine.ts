/**
 * Engine Ekspansi Sinonim Karir & Kompetensi Kerja (Bilingual ID & EN)
 * src/data/position-detektor/synonymEngine.ts
 */

import { SINONIM_INDONESIA } from './sinonim-in';
import { SINONIM_ENGLISH } from './sinonim-en';

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

/**
 * Mengambil seluruh sinonim dari satu kata atau frasa tertentu
 */
export function getSynonymsForTerm(term: string): string[] {
  if (!term) return [];
  const clean = term.toLowerCase().trim();
  const set = UNIFIED_SYNONYM_MAP.get(clean);
  if (!set || set.size === 0) return [];
  return Array.from(set);
}

/**
 * Memperluas daftar token/kata kunci dengan seluruh sinonim yang relevan.
 * Berguna saat membandingkan keyword dari jobdesk & kualifikasi.
 */
export function expandTokensWithSynonyms(tokens: string[]): string[] {
  const result = new Set<string>();

  for (const token of tokens) {
    if (!token) continue;
    const clean = token.toLowerCase().trim();
    result.add(clean);

    const synonyms = getSynonymsForTerm(clean);
    for (const syn of synonyms) {
      result.add(syn);
      // Jika sinonim berupa frasa multi-kata (misal 'human resources'), masukkan juga kata individualnya
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
 * Menghasilkan variasi judul sinonim dari judul posisi yang diinput.
 * Contoh: "HRD Manager" -> ["hr manager", "human resources manager", "manajer hrd", "manajer sdm", "people operations manager"]
 */
export function generateTitleVariations(rawTitle: string): string[] {
  if (!rawTitle) return [];
  const clean = rawTitle.toLowerCase().trim().replace(/[/\\|•·\-–—_,:;+&()[\]{}'"`]/g, ' ').replace(/\s+/g, ' ');
  const words = clean.split(' ').filter(Boolean);
  if (words.length === 0) return [];

  const variations = new Set<string>();
  variations.add(clean);

  // Ambil sinonim per kata
  const wordSynonyms: string[][] = words.map((w) => {
    const syns = getSynonymsForTerm(w);
    return [w, ...syns.slice(0, 6)]; // Batasi 6 sinonim teratas per kata
  });

  // Jika judul terdiri dari 2 kata (misal: "hrd manager")
  if (words.length === 2) {
    const [syns1, syns2] = wordSynonyms;
    for (const s1 of syns1) {
      for (const s2 of syns2) {
        variations.add(`${s1} ${s2}`);
        variations.add(`${s2} ${s1}`);
      }
    }
  } else if (words.length === 3) {
    // 3 kata: kombinasikan sinonim kata ke-1 & ke-2 atau ke-2 & ke-3
    const [syns1, syns2, syns3] = wordSynonyms;
    for (const s1 of syns1.slice(0, 3)) {
      for (const s2 of syns2.slice(0, 3)) {
        for (const s3 of syns3.slice(0, 3)) {
          variations.add(`${s1} ${s2} ${s3}`);
        }
      }
    }
  } else {
    // Kata tunggal atau lebih dari 3 kata
    for (const w of words) {
      const syns = getSynonymsForTerm(w);
      for (const s of syns) {
        variations.add(clean.replace(new RegExp(`\\b${w}\\b`, 'g'), s));
      }
    }
  }

  // Cek juga sinonim untuk seluruh frasa utuh
  const wholePhraseSynonyms = getSynonymsForTerm(clean);
  for (const s of wholePhraseSynonyms) {
    variations.add(s);
  }

  return Array.from(variations);
}
