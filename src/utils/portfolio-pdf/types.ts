export interface PortfolioSlideConfig {
  id: string;
  filename: string;
  title: string;
  section: 'I' | 'II' | 'III' | 'IV' | 'V';
  sectionLabel: string;
}

export interface CertItemConfig {
  id: string;
  filename: string;
  title: string;
  issuer: string;
  isPortrait?: boolean;
}

// Peta Solusi Digital CV ke file slide portofolio

export interface ImageOptimizationOptions {
  maxDimension?: number;
  quality?: number;
}

/**
 * Helper untuk mengambil dan mengompresi gambar dari /portofolio/ atau /sertifikasi/
 * Menggunakan HTML5 Canvas resampling agar ukuran file PDF tetap sangat ringan (<2MB)
 * namun teks dan grafis tetap tajam & jernih (High-Fidelity).
 */
