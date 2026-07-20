/**
 * API Service untuk Integrasi Cloudflare Worker & D1.
 * Arsitektur: Modular, Scalable, Aman, dan Clean Code.
 */

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  error?: string;
}

const BASE_URL = 'https://portofolio.alvareza-work.workers.dev/';

interface FetchOptions extends RequestInit {
  timeout?: number;
}

// ==========================================
// LOGGING UTILITIES (Simple Text)
// ==========================================

function logSuccess(endpoint: string) {
  console.log(`Log | Berhasil memproses data dari ${endpoint} cloudflare`);
}

function logFatal(endpoint: string, ...rest: any[]) {
  console.error(`Log | Gagal memproses permintaan ke ${endpoint} cloudflare.`, ...rest);
}

// ==========================================
// DATA TRANSFORMATION (Adapter for Worker Schema)
// ==========================================
const toCamel = (s: string) => {
  return s.replace(/([-_][a-z])/ig, ($1) => {
    return $1.toUpperCase().replace('-', '').replace('_', '');
  });
};

const formatKeys = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(formatKeys);
  } else if (obj !== null && typeof obj === 'object') {
    const newObj: any = {};
    for (let key in obj) {
      newObj[toCamel(key)] = formatKeys(obj[key]);
    }
    return newObj;
  }
  return obj;
};

const transformData = (endpoint: string, data: any) => {
  if (!data) return data;
  
  let transformed = formatKeys(data);
  
  // Parse known JSON string columns
  const jsonColumns = ["alamatTempatTinggal","penguasaan","poin","hasil","deskripsi","tujuan","dampak","periode","pencapaian","spesialisasi","tugasTanggungJawab","ringkasan","teknologi","fitur","attachments","rekomendasi"];
  const booleanCols = ['includePerihal', 'includeLampiranAwal', 'includeDaftarLampiran', 'includeBio', 'isSubjectAuto', 'mergeAttachments'];

  const parseRecursively = (obj: any) => {
    if (Array.isArray(obj)) {
      obj.forEach(parseRecursively);
    } else if (obj !== null && typeof obj === 'object') {
      for (let key in obj) {
        if (jsonColumns.includes(key) && typeof obj[key] === 'string') {
          try {
            obj[key] = JSON.parse(obj[key]);
          } catch(e) {
            // keep as string if parse fails
          }
        } else if (booleanCols.includes(key)) {
          obj[key] = Boolean(obj[key]);
        } else {
          parseRecursively(obj[key]);
        }
      }
    }
  };
  
  parseRecursively(transformed);

  if (endpoint === 'profil') {
     if (Array.isArray(transformed) && transformed.length > 0) {
        return transformed[0];
     }
  }

  return transformed;
};

// ==========================================
// CORE FETCH LOGIC
// ==========================================
async function performFetch<T>(endpoint: string, options: FetchOptions = {}): Promise<ApiResponse<T>> {
  const { timeout = 25000, ...fetchOptions } = options;
  const method = fetchOptions.method || 'GET';
  
  // Normalisasi URL
  const isSendEmail = endpoint === 'send-email' || endpoint === 'preview-email' || endpoint === 'berkas';
  let url = isSendEmail ? `/api/${endpoint}` : new URL(endpoint.replace(/^\/+/, ''), BASE_URL).toString();

  if (method === 'GET') {
    const urlObj = new URL(url, window.location.origin);
    urlObj.searchParams.set('_t', Date.now().toString());
    url = urlObj.toString();
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      cache: 'no-store', // Always fetch fresh data
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorMsg = `HTTP Error: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData && (errorData.message || errorData.error)) {
           errorMsg = errorData.message || errorData.error;
        }
      } catch (e) {
        // ignore JSON parse error for error response
      }
      throw new Error(errorMsg);
    }

    let jsonResponse: ApiResponse<T>;
    try {
      jsonResponse = await response.json();
    } catch (parseError) {
      throw new Error('Invalid JSON response from server');
    }

    if (!jsonResponse.success) {
      throw new Error(jsonResponse.message || jsonResponse.error || 'Unknown API Error');
    }

    logSuccess(endpoint);

    jsonResponse.data = transformData(endpoint, jsonResponse.data);

    return jsonResponse;

  } catch (error: any) {
    clearTimeout(timeoutId);
    const isTimeout = error.name === 'AbortError';
    const errorMsg = isTimeout ? 'Request Timeout (Limit exceeded)' : error.message;

    logFatal(endpoint, errorMsg, error.stack || '');

    return {
      success: false,
      message: 'Permintaan data gagal.',
      error: errorMsg,
      data: null,
    };
  }
}

// ==========================================
// EXPORTED API SERVICE MODULE
// ==========================================
const sanitizeEmailSenderBody = (body: any): any => {
  const allowedKeys = new Set([
    'id',
    'targetEmail',
    'companyName',
    'positionName',
    'subject',
    'body',
    'status',
    'addressedTo',
    'attachedFiles',
    'createdAt',
    'includePerihal',
    'includeLampiranAwal',
    'includeDaftarLampiran',
    'includeBio',
    'cvOption',
    'cvAtsOption',
    'portofolioOption',
    'paklaringOption',
    'sertifikatKompetensiAkademikOption',
    'sertifikatKompetensiBisnisDigitalOption',
    'sertifikatKompetensiKepemimpinanOption',
    'sertifikatKompetensiPublicSpeakingOption',
    'sertifikatPrestasiOption',
    'ijazahOption',
    'headerBgColor',
    'headerTextColor',
    'bodyFontFamily',
    'emailFormat',
    'paragraphAlign',
    'isSubjectAuto',
    'customSubject',
    'mergeAttachments'
  ]);

  const sanitizeObject = (obj: any) => {
    if (obj !== null && typeof obj === 'object') {
      const newObj: any = {};
      for (const key in obj) {
        if (allowedKeys.has(key)) {
          newObj[key] = obj[key];
        }
      }
      return newObj;
    }
    return obj;
  };

  if (Array.isArray(body)) {
    return body.map(sanitizeObject);
  }
  return sanitizeObject(body);
};

export const ApiService = {
  get: <T>(endpoint: string, options?: Omit<FetchOptions, 'method'>) => {
    return performFetch<T>(endpoint, { ...options, method: 'GET' });
  },

  post: async <T>(endpoint: string, body: any, options?: Omit<FetchOptions, 'method' | 'body'>) => {
    const sanitizedBody = endpoint === 'email-sender' ? sanitizeEmailSenderBody(body) : body;
    return performFetch<T>(endpoint, {
      ...options,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: JSON.stringify(sanitizedBody),
    });
  },

  put: <T>(endpoint: string, body: any, options?: Omit<FetchOptions, 'method' | 'body'>) => {
    const sanitizedBody = endpoint === 'email-sender' ? sanitizeEmailSenderBody(body) : body;
    return performFetch<T>(endpoint, {
      ...options,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: JSON.stringify(sanitizedBody),
    });
  },

  delete: <T>(endpoint: string, options?: Omit<FetchOptions, 'method'>) => {
    return performFetch<T>(endpoint, {
      ...options,
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
  },
};


