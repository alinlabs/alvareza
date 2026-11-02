import { CardId, CardStateCV, CardStateGeneric } from './types';

/**
 * Returns safe origin URL for preview link generation
 */
export const getSafeOrigin = (): string => {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return window.location.origin;
  }
  return 'https://alvareza.app';
};

/**
 * Helper to generate dynamic preview URL for CV using obfuscated short format
 */
export const generateCvUrl = (cvState: CardStateCV, origin: string): string => {
  const params = new URLSearchParams();
  params.set('f', 'cv');

  const cleanColor = (cvState.color || '#0062E3').replace(/^#/, '').toUpperCase();
  if (cleanColor) {
    params.set('cl', cleanColor);
  }

  if (cvState.preset && cvState.preset !== 'optimal') {
    params.set('pr', cvState.preset);
  }
  if (cvState.lang && cvState.lang !== 'id') {
    params.set('lng', cvState.lang);
  }
  if (cvState.align && cvState.align !== 'left') {
    params.set('al', cvState.align);
  }
  if (cvState.design) {
    params.set('ds', cvState.design === 'block' ? 'blok' : cvState.design);
  }

  return `${origin}/prev?${params.toString()}`;
};

/**
 * Helper to generate dynamic preview URL for generic cards (portfolio, certs, academic, identity, photo)
 * Standards:
 * - Obfuscated short format: /prev?f=...
 * - Default color is BW (isColor = false). Add &cl=true ONLY when user selects Cetak Berwarna (isColor = true).
 * - Default compression is Compressed (isCompressed = true). Add &q=ori ONLY when user selects Kualitas Penuh (isCompressed = false).
 * - Specific values: transkrip -> trk, setengah-badan -> sb, etc.
 */
export const generateGenericUrl = (
  cardId: Exclude<CardId, 'cv'>,
  state: CardStateGeneric,
  origin: string
): string => {
  const params = new URLSearchParams();

  const fileMap: Record<Exclude<CardId, 'cv'>, string> = {
    portofolio: 'p',
    sertifikasi: 's',
    akademik: 'a',
    identitas: 'id',
    foto: 'ft',
  };
  params.set('f', fileMap[cardId] || cardId);

  // 1. Color parameter: Default is BW (isColor = false). Only add &cl=true when isColor === true
  if (state.isColor) {
    params.set('cl', 'true');
  }

  // 2. Quality/Compression parameter: Default is Compressed (isCompressed = true). Only add &q=ori when isCompressed === false
  if (cardId === 'portofolio' || cardId === 'sertifikasi') {
    if (!state.isCompressed) {
      params.set('q', 'ori');
    }
  } else {
    if (state.specific && state.specific !== 'all') {
      let shortSpec = state.specific;
      if (cardId === 'akademik') {
        if (state.specific === 'transkrip') shortSpec = 'trk';
        else if (state.specific === 'skl') shortSpec = 'skl';
      } else if (cardId === 'foto') {
        if (state.specific === 'setengah-badan') shortSpec = 'sb';
      }
      params.set('spec', shortSpec);
    }
  }

  return `${origin}/prev?${params.toString()}`;
};

/**
 * Resilient cross-browser clipboard copy with DOM fallback
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    throw new Error('Clipboard API unavailable');
  } catch {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      textArea.setAttribute('readonly', '');
      document.body.appendChild(textArea);
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    } catch {
      return false;
    }
  }
};
