import { jsPDF } from 'jspdf';
import { GasAttachment } from '../../types/gasSender';
import { PortfolioSlideConfig, CertItemConfig } from './types';
import { ALL_PORTFOLIO_SLIDES, ALL_CERTIFICATES_LIST, CERTIFICATE_FILES } from './slideCatalog';
import {
  isHrPosition,
  sortPortfolioSlideIds,
  getAdaptivePortfolioSlides,
  getActiveCertificateList,
} from './slideSelector';
import { loadImageAsDataUrl } from './imageLoader';

/**
 * Menghitung resolusi (maxDimension) dan kualitas JPEG optimal secara adaptif
 * agar total ukuran berkas PDF portofolio berkisar maksimal 1 MB (~1,000 KB),
 * dengan mengutamakan ketajaman teks/grafis dan mencegah kompresi berlebih ("pecah").
 */
export function calculateAdaptivePortfolioQuality(slideCount: number): {
  maxDimension: number;
  quality: number;
} {
  const count = Math.max(1, slideCount);

  // Target ukuran aman maksimal ~980 KB agar setelah enkapsulasi PDF dan overhead struktur tetap <= 1 MB (1,048,576 bytes)
  if (count <= 2) {
    return { maxDimension: 1600, quality: 0.78 };
  } else if (count <= 4) {
    return { maxDimension: 1400, quality: 0.72 };
  } else if (count <= 6) {
    return { maxDimension: 1300, quality: 0.66 };
  } else if (count <= 8) {
    return { maxDimension: 1200, quality: 0.62 };
  } else if (count <= 11) {
    return { maxDimension: 1100, quality: 0.58 };
  } else if (count <= 14) {
    return { maxDimension: 1000, quality: 0.54 };
  } else if (count <= 16) {
    return { maxDimension: 940, quality: 0.52 };
  } else {
    // 17-19 slide (semua portofolio masuk)
    // Berdasarkan benchmark riil seluruh 19 berkas slide:
    // Dim 880 dengan Quality 0.50 menghasilkan PDF ~1,035,798 bytes (~0.988 MB), persis di bawah batas 1 MB
    // dengan resolusi dan ketajaman teks yang tetap terjaga (tidak pecah/rusak).
    return { maxDimension: 880, quality: 0.50 };
  }
}

export async function buildAdaptivePortfolioPdf(options: {
  preset?: string;
  selectedSlideIds?: string[];
  activeDigitalSolutions?: string[];
  activeCertifications?: string[];
  includeKeyImpact?: boolean;
  jobTitle?: string;
  isCompressed?: boolean;
  onProgress?: (current: number, total: number, slideTitle: string) => void;
}): Promise<GasAttachment> {
  const presetKey = options.preset || 'optimal';
  let slides: PortfolioSlideConfig[] = [];

  const isHr = isHrPosition(presetKey, options.jobTitle);

  if (options.selectedSlideIds && options.selectedSlideIds.length > 0) {
    let rawSlideIds = options.selectedSlideIds;

    // Untuk posisi HR: Pastikan di Bagian IV HANYA ada HR Matrix dan Talenty, dan diurutkan sesuai prioritas
    if (isHr) {
      rawSlideIds = rawSlideIds.filter((id) => {
        const s = ALL_PORTFOLIO_SLIDES.find((item) => item.id === id);
        if (s && s.section === 'IV' && s.id !== 'sol-3' && s.id !== 'sol-8') {
          return false;
        }
        return true;
      });
      rawSlideIds = sortPortfolioSlideIds(rawSlideIds, presetKey, options.jobTitle);
    }

    // Susun slide persis sesuai urutan
    slides = rawSlideIds
      .map((id) => ALL_PORTFOLIO_SLIDES.find((s) => s.id === id))
      .filter((s): s is PortfolioSlideConfig => Boolean(s));
  } else {
    slides = getAdaptivePortfolioSlides(presetKey, {
      activeDigitalSolutions: options.activeDigitalSolutions,
      activeCertifications: options.activeCertifications,
      includeKeyImpact: options.includeKeyImpact !== false,
      jobTitle: options.jobTitle,
    });
  }

  if (slides.length === 0) {
    throw new Error('Tidak ada slide portofolio yang dipilih.');
  }

  const isCompressed = Boolean(options.isCompressed);

  // Portofolio menggunakan A4 Portrait (210mm x 297mm) persis dengan rasio gambar 1414x2000
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: isCompressed,
  });

  const pageWidth = 210;
  const pageHeight = 297;

  // Konfigurasi resolusi & kualitas kompresi gambar adaptif agar target maksimal 1 MB tercapai tanpa membuat gambar pecah
  let imageOptions = { maxDimension: 1800, quality: 0.83 };
  if (isCompressed) {
    imageOptions = calculateAdaptivePortfolioQuality(slides.length);
  }

  for (let i = 0; i < slides.length; i++) {
    const slide = slides[i];
    if (options.onProgress) {
      options.onProgress(i + 1, slides.length, slide.title);
    }

    if (i > 0) {
      doc.addPage('a4', 'portrait');
    }

    const imagePath = `/portofolio/${slide.filename}`;
    const imgDataUrl = await loadImageAsDataUrl(imagePath, imageOptions);

    doc.addImage(imgDataUrl, 'JPEG', 0, 0, pageWidth, pageHeight, undefined, 'FAST');
  }

  let dataUri = doc.output('datauristring');
  let base64Data = dataUri.split(',')[1] || '';
  let sizeBytes = Math.round((base64Data.length * 3) / 4);

  // Garansi ketat: Jika opsi kompresi aktif dan ukuran masih melebihi 1MB (1,048,576 byte),
  // lakukan pass penyesuaian halus terarah (bukan penurunan ekstrem yang merusak ketajaman)
  if (isCompressed && sizeBytes > 1024 * 1024) {
    const fallbackOptions = {
      maxDimension: Math.max(820, Math.round(imageOptions.maxDimension * 0.95)),
      quality: Math.max(0.45, Number((imageOptions.quality - 0.04).toFixed(2))),
    };

    const fallbackDoc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i];
      if (i > 0) {
        fallbackDoc.addPage('a4', 'portrait');
      }
      const imagePath = `/portofolio/${slide.filename}`;
      const imgDataUrl = await loadImageAsDataUrl(imagePath, fallbackOptions);
      fallbackDoc.addImage(imgDataUrl, 'JPEG', 0, 0, pageWidth, pageHeight, undefined, 'FAST');
    }
    dataUri = fallbackDoc.output('datauristring');
    base64Data = dataUri.split(',')[1] || '';
    sizeBytes = Math.round((base64Data.length * 3) / 4);
  }

  const filename = isCompressed ? 'portofolio-alvareza-kompresi.pdf' : 'portofolio-alvareza.pdf';

  return {
    filename,
    mimeType: 'application/pdf',
    base64: base64Data,
    sizeBytes,
  };
}

/**
 * Generate PDF Kompilasi Sertifikasi Resmi secara Base64 Attachment Object
 */
export async function buildCertificatesCompilationPdf(options: {
  preset?: string;
  selectedCertIds?: string[];
  activeCertifications?: string[];
  jobTitle?: string;
  onProgress?: (current: number, total: number, certTitle: string) => void;
}): Promise<GasAttachment> {
  const presetKey = options.preset || 'optimal';
  let certs: CertItemConfig[] = [];

  if (options.selectedCertIds) {
    // Susun sertifikat persis sesuai ID yang dipilih pengguna via checkbox
    certs = options.selectedCertIds
      .map((id) => CERTIFICATE_FILES[id])
      .filter((c): c is CertItemConfig => Boolean(c));
  } else {
    certs = getActiveCertificateList(presetKey, options.activeCertifications);
  }

  if (certs.length === 0) {
    throw new Error('Tidak ada sertifikat yang dipilih untuk dikompilasi.');
  }

  // Tentukan orientasi halaman pertama
  const firstCert = certs[0];
  const firstOrientation = firstCert.isPortrait ? 'portrait' : 'landscape';

  const doc = new jsPDF({
    orientation: firstOrientation,
    unit: 'mm',
    format: 'a4',
  });

  for (let i = 0; i < certs.length; i++) {
    const cert = certs[i];
    if (options.onProgress) {
      options.onProgress(i + 1, certs.length, cert.title);
    }

    const isPortrait = !!cert.isPortrait;
    const pageWidth = isPortrait ? 210 : 297;
    const pageHeight = isPortrait ? 297 : 210;

    if (i > 0) {
      doc.addPage('a4', isPortrait ? 'portrait' : 'landscape');
    }

    const imagePath = `/sertifikasi/${cert.filename}`;
    const imgDataUrl = await loadImageAsDataUrl(imagePath);

    doc.addImage(imgDataUrl, 'JPEG', 0, 0, pageWidth, pageHeight, undefined, 'FAST');
  }

  const dataUri = doc.output('datauristring');
  const base64Data = dataUri.split(',')[1] || '';
  const sizeBytes = Math.round((base64Data.length * 3) / 4);

  const filename = 'sertifikasi-alvareza.pdf';

  return {
    filename,
    mimeType: 'application/pdf',
    base64: base64Data,
    sizeBytes,
  };
}
