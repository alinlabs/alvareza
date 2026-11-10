/**
 * Short Link Obfuscation & Identification Codec
 *
 * Provides bidirectional mapping and auto-correction between full URLs and
 * obfuscated short URLs to keep links discreet and compact.
 *
 * Examples:
 * - /search?page=admin -> /sr?pg=adm
 * - /search?page=profile -> /sr?pg=prf
 * - /preview?file=portofolio&color=true -> /prev?f=p&cl=true
 * - /preview?file=sertifikasi&color=true&quality=ori -> /prev?f=s&cl=true&q=ori
 * - /preview?file=akademik&color=true&spesifik=skl -> /prev?f=a&cl=true&spec=skl
 * - /preview?file=akademik&spesifik=transkrip -> /prev?f=a&spec=trk
 * - /preview?file=identitas&spesifik=kartu%20keluarga -> /prev?f=id&spec=kk
 * - /preview?file=identitas&spesifik=ktp -> /prev?f=id&spec=ktp
 * - /preview?file=foto&spesifik=3x4 -> /prev?f=ft&spec=3x4
 * - /preview?file=cv&color=0062E3&design=block -> /prev?f=cv&cl=0062E3&ds=blok
 */

// 1. Path mappings (Only preview files use obfuscated short links '/prev')
export const PATH_LONG_TO_SHORT: Record<string, string> = {
  preview: 'prev',
};

export const PATH_SHORT_TO_LONG: Record<string, string> = {
  sr: 'search',
  prev: 'preview',
};

// 2. Query Key mappings
export const KEY_LONG_TO_SHORT: Record<string, string> = {
  page: 'pg',
  file: 'f',
  color: 'cl',
  quality: 'q',
  spesifik: 'spec',
  spesifikasi: 'spec',
  specific: 'spec',
  doc: 'spec',
  type: 'spec',
  size: 'spec',
  preset: 'pr',
  role: 'pr',
  design: 'ds',
  desgin: 'ds',
  theme: 'th',
  mode: 'th',
  ui: 'th',
  lang: 'lng',
  align: 'al',
};

export const KEY_SHORT_TO_LONG: Record<string, string> = {
  pg: 'page',
  f: 'file',
  cl: 'color',
  q: 'quality',
  spec: 'spesifik',
  pr: 'preset',
  ds: 'design',
  th: 'theme',
  lng: 'lang',
  al: 'align',
};

// 3. Query Value mappings
export const VALUE_LONG_TO_SHORT: Record<string, Record<string, string>> = {
  // Page values
  pg: {
    admin: 'adm',
    executive: 'exec',
    profile: 'prf',
  },
  // File values
  f: {
    portofolio: 'p',
    portfolio: 'p',
    sertifikasi: 's',
    sertifikat: 's',
    certification: 's',
    certifications: 's',
    akademik: 'a',
    academic: 'a',
    identitas: 'id',
    identity: 'id',
    foto: 'ft',
    'pas-foto': 'ft',
    pasfoto: 'ft',
    cv: 'cv',
    penghargaan: 'awd',
    award: 'awd',
    awards: 'awd',
    prestasi: 'awd',
    awd: 'awd',
  },
  // Spesifik values
  spec: {
    skl: 'skl',
    suratketeranganlulus: 'skl',
    'surat-keterangan-lulus': 'skl',
    'surat keterangan lulus': 'skl',
    transkrip: 'trk',
    transkripnilai: 'trk',
    'transkrip-nilai': 'trk',
    'transkrip nilai': 'trk',
    transkripakademik: 'trk',
    'transkrip-akademik': 'trk',
    'transkrip akademik': 'trk',
    ijazah: 'ijz',
    'ijazah-kelulusan': 'ijz',
    'ijazah kelulusan': 'ijz',
    ktp: 'ktp',
    kartutandapenduduk: 'ktp',
    'kartu-tanda-penduduk': 'ktp',
    'kartu tanda penduduk': 'ktp',
    kk: 'kk',
    kartukeluarga: 'kk',
    'kartu-keluarga': 'kk',
    'kartu keluarga': 'kk',
    npwp: 'npwp',
    kartunpwp: 'npwp',
    nomorpokokwajibpajak: 'npwp',
    'nomor-pokok-wajib-pajak': 'npwp',
    'nomor pokok wajib pajak': 'npwp',
    '3x4': '3x4',
    '4x6': '4x6',
    'setengah-badan': 'sb',
    'setengah badan': 'sb',
    setengahbadan: 'sb',
  },
  // Quality values
  q: {
    ori: 'ori',
    original: 'ori',
    full: 'ori',
  },
  // Design values
  ds: {
    block: 'blok',
    blok: 'blok',
    line: 'line',
    garis: 'line',
    badge: 'badge',
    plain: 'plain',
    clean: 'plain',
    minimalist: 'plain',
    modern: 'mdrn',
    mdrn: 'mdrn',
  },
};

export const VALUE_SHORT_TO_LONG: Record<string, Record<string, string>> = {
  pg: {
    adm: 'admin',
    a: 'admin',
    ad: 'admin',
    admin: 'admin',
    exec: 'executive',
    ex: 'executive',
    executive: 'executive',
    prf: 'profile',
    p: 'profile',
    profile: 'profile',
  },
  f: {
    p: 'portofolio',
    s: 'sertifikasi',
    a: 'akademik',
    id: 'identitas',
    ft: 'foto',
    cv: 'cv',
    awd: 'penghargaan',
    award: 'penghargaan',
    awards: 'penghargaan',
    prestasi: 'penghargaan',
    penghargaan: 'penghargaan',
  },
  spec: {
    skl: 'skl',
    trk: 'transkrip',
    ijz: 'ijazah',
    ktp: 'ktp',
    kk: 'kk',
    npwp: 'npwp',
    '3x4': '3x4',
    '4x6': '4x6',
    sb: 'setengah-badan',
  },
  q: {
    ori: 'ori',
  },
  ds: {
    blok: 'block',
    line: 'line',
    badge: 'badge',
    plain: 'plain',
    mdrn: 'modern',
    modern: 'modern',
  },
};

/**
 * Normalizes raw query value strings (decodes URI, trims, lowercases)
 */
function cleanVal(v: string | null | undefined): string {
  if (!v) return '';
  try {
    return decodeURIComponent(v).trim().toLowerCase();
  } catch {
    return v.trim().toLowerCase();
  }
}

/**
 * Encodes a path and parameter object into a canonical short URL string.
 */
export function encodeShortPathAndSearch(
  path: string,
  rawParams: Record<string, string | boolean | undefined | null> = {}
): string {
  const cleanPath = path.replace(/^\/+/, '').trim().toLowerCase();
  const shortPath = PATH_LONG_TO_SHORT[cleanPath] || cleanPath;

  const searchParams = new URLSearchParams();

  // Iterate over provided parameters
  for (const [rawKey, rawValue] of Object.entries(rawParams)) {
    if (rawValue === undefined || rawValue === null || rawValue === '') continue;

    const lowerKey = rawKey.toLowerCase().trim();
    const shortKey = KEY_LONG_TO_SHORT[lowerKey] || lowerKey;
    const strVal = String(rawValue).trim();
    const lowerVal = cleanVal(strVal);

    // Filter out defaults according to specification:
    // 1. Color: default is false (BW). Only add if true
    if (shortKey === 'cl') {
      if (lowerVal === 'true' || lowerVal === '1' || lowerVal === 'berwarna') {
        searchParams.set('cl', 'true');
      } else if (/^[0-9a-f]{3,8}$/i.test(strVal)) {
        // Hex color for CV (e.g. 0062E3)
        searchParams.set('cl', strVal.toUpperCase());
      }
      continue;
    }

    // 2. Quality: default is compressed. Only add if 'ori'
    if (shortKey === 'q') {
      if (lowerVal === 'ori' || lowerVal === 'original' || lowerVal === 'full') {
        searchParams.set('q', 'ori');
      }
      continue;
    }

    // 3. Specific: ignore 'all' or 'semua'
    if (shortKey === 'spec') {
      if (lowerVal === 'all' || lowerVal === 'semua') continue;
      const mappedVal = VALUE_LONG_TO_SHORT.spec?.[lowerVal] ||
        VALUE_LONG_TO_SHORT.spec?.[lowerVal.replace(/[^a-z0-9]/g, '')] ||
        lowerVal;
      searchParams.set('spec', mappedVal);
      continue;
    }

    // Check value dictionary mapping
    const valueMap = VALUE_LONG_TO_SHORT[shortKey];
    if (valueMap) {
      const mappedVal = valueMap[lowerVal] || valueMap[lowerVal.replace(/[^a-z0-9]/g, '')] || lowerVal;
      searchParams.set(shortKey, mappedVal);
    } else {
      searchParams.set(shortKey, strVal);
    }
  }

  const queryString = searchParams.toString();
  return shortPath ? `/${shortPath}${queryString ? `?${queryString}` : ''}` : `/${queryString ? `?${queryString}` : ''}`;
}

/**
 * Decodes the current location or a given URL path + search into canonical long values.
 */
export interface DecodedRouteInfo {
  isShortFormat: boolean;
  rawPathname: string;
  canonicalPathname: string; // 'search' | 'preview' | ''
  pageParam: string;         // 'admin' | 'executive' | 'profile' | ''
  fileParam: string;         // 'portofolio' | 'sertifikasi' | 'akademik' | 'identitas' | 'foto' | 'cv' | ''
  colorParam: string;        // 'true' | hex | ''
  isColor: boolean;
  qualityParam: string;      // 'ori' | ''
  isCompressed: boolean;     // default true, false if q=ori
  spesifikParam: string;     // 'skl' | 'transkrip' | 'ktp' | 'kk' | 'npwp' | '3x4' | '4x6' | 'setengah-badan' | ''
  presetParam: string;
  designParam: string;       // 'block' | 'line' | 'badge' | 'plain'
  langParam: string;
  alignParam: string;
  modeParam: 'dark' | 'light' | '';
  isDarkMode: boolean;
}

export function decodeRoute(urlOrPath?: string): DecodedRouteInfo {
  let pathname = '';
  let search = '';

  if (urlOrPath) {
    try {
      const parsed = new URL(urlOrPath, 'https://dummy.local');
      pathname = parsed.pathname;
      search = parsed.search;
    } catch {
      const [p, s] = urlOrPath.split('?');
      pathname = p || '';
      search = s ? `?${s}` : '';
    }
  } else if (typeof window !== 'undefined') {
    pathname = window.location.pathname;
    search = window.location.search;
  }

  const cleanPath = pathname.replace(/^\/+/, '').trim().toLowerCase();
  const params = new URLSearchParams(search);

  // Detect if current path is already short format
  const isShortPath = cleanPath === 'sr' || cleanPath === 'prev';

  // Canonical pathname:
  const canonicalPathname = PATH_SHORT_TO_LONG[cleanPath] || cleanPath;

  // 1. Page param (pg or page)
  const rawPage = cleanVal(params.get('pg') || params.get('page'));
  const pageParam = VALUE_SHORT_TO_LONG.pg?.[rawPage] || rawPage;

  // 2. File param (f or file)
  const rawFile = cleanVal(params.get('f') || params.get('file'));
  const fileParam = VALUE_SHORT_TO_LONG.f?.[rawFile] || rawFile;

  // 3. Color param (cl or color or c)
  const rawColor = (params.get('cl') || params.get('color') || params.get('c') || '').trim();
  const lowerColor = cleanVal(rawColor);
  const isColor = lowerColor === 'true' || lowerColor === '1' || lowerColor === 'berwarna';

  // 4. Quality param (q or quality)
  const rawQuality = cleanVal(params.get('q') || params.get('quality'));
  const isCompressed = rawQuality !== 'ori' && rawQuality !== 'original' && rawQuality !== 'full';

  // 5. Spesifik param (spec or spesifik or doc or size or type)
  const rawSpec = cleanVal(
    params.get('spec') ||
    params.get('spesifik') ||
    params.get('spesifikasi') ||
    params.get('doc') ||
    params.get('size') ||
    params.get('type')
  );
  const spesifikParam = VALUE_SHORT_TO_LONG.spec?.[rawSpec] ||
    VALUE_SHORT_TO_LONG.spec?.[rawSpec.replace(/[^a-z0-9]/g, '')] ||
    rawSpec;

  // 6. Preset param (pr or preset or role)
  const presetParam = (params.get('pr') || params.get('preset') || params.get('role') || '').trim();

  // 7. Design param (ds or design or desgin or theme)
  const rawDesign = cleanVal(params.get('ds') || params.get('design') || params.get('desgin') || params.get('theme'));
  const designParam = VALUE_SHORT_TO_LONG.ds?.[rawDesign] || rawDesign;

  // 8. Lang param (lng or lang or l)
  const langParam = cleanVal(params.get('lng') || params.get('lang') || params.get('l'));

  // 9. Align param (al or align)
  const alignParam = cleanVal(params.get('al') || params.get('align'));

  // 10. Mode param (mode or theme or th)
  const rawMode = cleanVal(params.get('mode') || params.get('theme') || params.get('th') || params.get('ui'));
  const modeParam: 'dark' | 'light' | '' = rawMode === 'dark' || rawMode === 'night' || rawMode === 'gelap'
    ? 'dark'
    : rawMode === 'light' || rawMode === 'terang' || rawMode === 'white'
    ? 'light'
    : '';
  const isDarkMode = modeParam === 'dark';

  // Check if current URL was short
  const hasShortKeys = params.has('pg') || params.has('f') || params.has('cl') || params.has('q') || params.has('spec') || params.has('pr') || params.has('ds');
  const isShortFormat = isShortPath || hasShortKeys;

  return {
    isShortFormat,
    rawPathname: cleanPath,
    canonicalPathname,
    pageParam,
    fileParam,
    colorParam: rawColor,
    isColor,
    qualityParam: rawQuality,
    isCompressed,
    spesifikParam,
    presetParam,
    designParam,
    langParam,
    alignParam,
    modeParam,
    isDarkMode,
  };
}

/**
 * Computes the exact shareable URL representation for the given current URL or route state.
 * Admin and Executive pages ALWAYS use full URLs (/search?page=admin or /search?page=executive).
 * ONLY Preview files (/preview?file=...) use obfuscated short URLs (/prev?f=...).
 */
export function getShortUrlForCurrentLocation(urlOrPath?: string): string {
  const decoded = decodeRoute(urlOrPath);

  // 1. Admin workspace -> Always full URL /search?page=admin
  if (decoded.canonicalPathname === 'search' && decoded.pageParam === 'admin') {
    const mode = decoded.isDarkMode ? '&mode=dark' : '&mode=light';
    return `/search?page=admin${mode}`;
  }

  // 2. Executive Page -> Always full URL /search?page=executive
  if (decoded.canonicalPathname === 'search' && (decoded.pageParam === 'executive' || decoded.pageParam === 'profile')) {
    const lang = decoded.langParam === 'en' ? 'en' : 'in';
    const mode = decoded.isDarkMode ? '&mode=dark' : '&mode=light';
    return `/search?page=executive&lang=${lang}${mode}`;
  }

  // 3. PDF Previews (/preview?file=... -> /prev?f=...)
  if (decoded.canonicalPathname === 'preview') {
    const params: Record<string, string | boolean | undefined> = {};

    if (decoded.fileParam) {
      params.f = decoded.fileParam;
    }

    if (decoded.isColor) {
      params.cl = 'true';
    } else if (decoded.fileParam === 'cv' && decoded.colorParam && decoded.colorParam !== '#0062E3') {
      params.cl = decoded.colorParam.replace(/^#/, '');
    }

    if (!decoded.isCompressed) {
      params.q = 'ori';
    }

    if (decoded.spesifikParam) {
      params.spec = decoded.spesifikParam;
    }

    if (decoded.presetParam && decoded.presetParam !== 'optimal' && decoded.presetParam !== 'all') {
      params.pr = decoded.presetParam;
    }

    if (decoded.designParam) {
      params.ds = decoded.designParam === 'block' ? 'blok' : decoded.designParam;
    }

    if (decoded.langParam && decoded.langParam !== 'id') {
      params.lng = decoded.langParam;
    }

    if (decoded.alignParam && decoded.alignParam !== 'left') {
      params.al = decoded.alignParam;
    }

    if (decoded.modeParam) {
      params.mode = decoded.modeParam;
    }

    return encodeShortPathAndSearch('prev', params);
  }

  // 4. Fallback / Root -> redirect to /search?page=executive&lang=in
  return '/search?page=executive&lang=in';
}

/**
 * Preserves the browser address bar as entered by the user.
 * Both long URLs (e.g. /search?page=admin, /preview?file=portofolio) and
 * short URLs (e.g. /sr?pg=a, /prev?f=p) remain intact without forced rewrite.
 */
export function autoCorrectLocationToShort(): void {
  // Intentionally a no-op: do not rewrite user address bar.
  // Both long and short URLs work directly. Short links are used for sharing & QR codes.
}
