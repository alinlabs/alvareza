/**
 * Smart URL Parameter Resolver with Strict Auto-Correction & Tolerance
 * Specifically tuned for Academic (SKL, Transkrip) & Identity (KTP, KK, NPWP, Foto) documents.
 */

export type ResolvedAkademikDoc = 'skl' | 'transkrip' | null;
export type ResolvedIdentitasDoc = 'ktp' | 'npwp' | 'kk' | 'foto' | null;
export type ResolvedPhotoSize = '3x4' | '4x6' | 'setengah-badan' | null;

/**
 * Safely decodes and normalizes raw query parameter values.
 */
export function cleanRawParam(raw: string | null | undefined): string {
  if (!raw) return '';
  try {
    return decodeURIComponent(raw).trim().toLowerCase();
  } catch {
    return raw.trim().toLowerCase();
  }
}

/**
 * Resolves academic document from specific parameter with smart tolerance and auto-correction.
 *
 * Accepted valid forms for SKL:
 * - "skl", "SKL", "s-k-l"
 * - "suratketeranganlulus", "surat-keterangan-lulus", "surat%20keterangan%20lulus", "surat keterangan lulus"
 *
 * Strictly rejects typos or incomplete queries:
 * - "zurat keterangan lulus" -> null (corrupted word)
 * - "ski" -> null (typo)
 * - "surat keterangan" -> null (incomplete)
 *
 * Accepted valid forms for Transkrip:
 * - "transkrip", "TRANSKRIP"
 * - "transkripnilai", "transkrip-nilai", "transkrip%20nilai", "transkrip nilai"
 * - "transkripakademik", "transkrip-akademik", "transkrip akademik"
 */
export function resolveAkademikSpesifik(rawVal: string | null | undefined): ResolvedAkademikDoc {
  const cleaned = cleanRawParam(rawVal);
  if (!cleaned) return null;

  const compact = cleaned.replace(/[^a-z0-9]/g, '');
  const words = cleaned.split(/[\s\-_\/.]+/).filter(Boolean);

  // 1. SKL Check
  if (compact === 'skl') return 'skl';
  if (compact === 'suratketeranganlulus') return 'skl';

  // Separated words for SKL: All 3 words ('surat', 'keterangan', 'lulus') must be present and NO extra corrupted words
  if (words.length === 3) {
    const requiredSklWords = ['surat', 'keterangan', 'lulus'];
    if (requiredSklWords.every((w) => words.includes(w))) {
      return 'skl';
    }
  }

  // 2. Transkrip Check
  if (
    compact === 'trk' ||
    compact === 'transkrip' ||
    compact === 'transkripnilai' ||
    compact === 'transkripakademik' ||
    compact === 'transkripnilaiakademik'
  ) {
    return 'transkrip';
  }

  if (words.length === 1 && words[0] === 'transkrip') {
    return 'transkrip';
  }
  if (words.length === 2 && words[0] === 'transkrip' && (words[1] === 'nilai' || words[1] === 'akademik')) {
    return 'transkrip';
  }
  if (
    words.length === 3 &&
    words.includes('transkrip') &&
    words.includes('nilai') &&
    words.includes('akademik')
  ) {
    return 'transkrip';
  }

  // Reject invalid / unknown / corrupted forms
  return null;
}

/**
 * Resolves identity document from specific parameter with smart tolerance and auto-correction.
 *
 * Accepted valid forms:
 * - KTP: "ktp", "KTP", "kartutandapenduduk", "kartu-tanda-penduduk", "kartu%20tanda%20penduduk", "kartu tanda penduduk"
 * - KK: "kk", "KK", "kartukeluarga", "kartu-keluarga", "kartu%20keluarga", "kartu keluarga"
 * - NPWP: "npwp", "NPWP", "kartunpwp", "kartu-npwp", "kartu%20npwp",
 *         "nomorpokokwajibpajak", "nomor-pokok-wajib-pajak", "nomor%20pokok%20wajib%20pajak",
 *         "kartunomorpokokwajibpajak", "kartu-nomor-pokok-wajib-pajak", "kartu nomor pokok wajib pajak"
 * - Foto: "foto", "pasfoto", "3x4", "4x6", "setengah-badan"
 */
export function resolveIdentitasSpesifik(rawVal: string | null | undefined): ResolvedIdentitasDoc {
  const cleaned = cleanRawParam(rawVal);
  if (!cleaned) return null;

  const compact = cleaned.replace(/[^a-z0-9]/g, '');
  const words = cleaned.split(/[\s\-_\/.]+/).filter(Boolean);

  // 1. KTP
  if (compact === 'ktp' || compact === 'kartutandapenduduk') {
    return 'ktp';
  }
  if (words.length === 1 && words[0] === 'ktp') {
    return 'ktp';
  }
  if (words.length === 3 && words[0] === 'kartu' && words[1] === 'tanda' && words[2] === 'penduduk') {
    return 'ktp';
  }

  // 2. KK
  if (compact === 'kk' || compact === 'kartukeluarga') {
    return 'kk';
  }
  if (words.length === 1 && words[0] === 'kk') {
    return 'kk';
  }
  if (words.length === 2 && words[0] === 'kartu' && words[1] === 'keluarga') {
    return 'kk';
  }

  // 3. NPWP
  if (
    compact === 'npwp' ||
    compact === 'kartunpwp' ||
    compact === 'nomorpokokwajibpajak' ||
    compact === 'kartunomorpokokwajibpajak'
  ) {
    return 'npwp';
  }
  if (words.length === 1 && words[0] === 'npwp') {
    return 'npwp';
  }
  if (words.length === 2 && words.includes('kartu') && words.includes('npwp')) {
    return 'npwp';
  }
  if (
    words.length === 4 &&
    words[0] === 'nomor' &&
    words[1] === 'pokok' &&
    words[2] === 'wajib' &&
    words[3] === 'pajak'
  ) {
    return 'npwp';
  }
  if (
    words.length === 5 &&
    words[0] === 'kartu' &&
    words[1] === 'nomor' &&
    words[2] === 'pokok' &&
    words[3] === 'wajib' &&
    words[4] === 'pajak'
  ) {
    return 'npwp';
  }

  // 4. Foto
  if (
    compact === 'foto' ||
    compact === 'pasfoto' ||
    compact === '3x4' ||
    compact === '4x6' ||
    compact === 'setengahbadan' ||
    compact.includes('foto')
  ) {
    return 'foto';
  }

  return null;
}

/**
 * Resolves specific photo dimensions from raw size or doc parameter.
 */
export function resolvePhotoSizeFromParam(rawVal: string | null | undefined): ResolvedPhotoSize {
  const cleaned = cleanRawParam(rawVal);
  if (!cleaned) return null;

  const compact = cleaned.replace(/[^a-z0-9]/g, '');

  if (compact === '3x4' || compact === 'pasfoto3x4' || compact === 'foto3x4') {
    return '3x4';
  }
  if (compact === '4x6' || compact === 'pasfoto4x6' || compact === 'foto4x6') {
    return '4x6';
  }
  if (
    compact === 'sb' ||
    compact === 'setengahbadan' ||
    compact === 'fotosetengahbadan' ||
    compact === 'pasfotosetengahbadan' ||
    compact.includes('setengah')
  ) {
    return 'setengah-badan';
  }

  return null;
}
