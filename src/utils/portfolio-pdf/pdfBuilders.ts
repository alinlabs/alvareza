import { jsPDF } from 'jspdf';
import { GasAttachment } from '../../types/gasSender';
import { PortfolioSlideConfig, CertItemConfig } from './types';
import { ALL_PORTFOLIO_SLIDES, ALL_CERTIFICATES_LIST, CERTIFICATE_FILES } from './slideCatalog';
import {
  ALL_AWARDS_LIST,
  AwardItemConfig,
  sortAwardsChronologicalDesc,
} from '../../data/awards/awardsCatalog';
import {
  isHrPosition,
  sortPortfolioSlideIds,
  getAdaptivePortfolioSlides,
  getActiveCertificateList,
} from './slideSelector';
import { loadImageAsDataUrl } from './imageLoader';
import { signPdfBuffer } from '../crypto/pdfDigitalSigner';
import { getItemIssuerCredentials, getMasterDossierCredentials } from '../../config/digitalSignatureConfig';

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
  isGrayscale?: boolean;
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
  const isGrayscale = Boolean(options.isGrayscale);

  // Portofolio menggunakan A4 Portrait (210mm x 297mm) persis dengan rasio gambar 1414x2000
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  const pageWidth = 210;
  const pageHeight = 297;

  // Konfigurasi resolusi & kualitas kompresi gambar adaptif:
  // Standard mode: maxDimension 1440 & quality 0.78 (menghasilkan PDF ~1.4MB untuk 19 slide, seimbang & tajam mirip total source webp)
  // Compressed mode: kalkulasi adaptif agar total PDF < 1 MB
  let imageOptions: { maxDimension: number; quality: number; isGrayscale?: boolean } = {
    maxDimension: 1440,
    quality: 0.78,
    isGrayscale,
  };
  if (isCompressed) {
    const adaptive = calculateAdaptivePortfolioQuality(slides.length);
    imageOptions = { ...adaptive, isGrayscale };
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

  const unsignedPdfArrayBuffer = doc.output('arraybuffer');
  const unsignedPdfBytes = new Uint8Array(unsignedPdfArrayBuffer);

  let signedPdfBytes = unsignedPdfBytes;
  try {
    const masterCreds = getMasterDossierCredentials('portfolio', 'Dokumen Kompilasi Eksekutif Portofolio Digital');
    signedPdfBytes = await signPdfBuffer(unsignedPdfBytes, {
      level: 'MASTER_DOSSIER',
      title: 'Kompilasi Eksekutif Portofolio Digital - Alvareza Hilka Pratama',
      author: masterCreds.signer.commonName,
      subject: masterCreds.reason,
      keywords: [
        'Digital Profile',
        'Portofolio Eksekutif',
        masterCreds.authority.commonName,
        masterCreds.signer.commonName,
        'Master Dossier Verification',
        'PAdES',
      ],
      reason: masterCreds.reason,
      authorityProfile: masterCreds.authority,
      signerProfile: masterCreds.signer,
    });
  } catch (err) {
    console.warn('Gagal menandatangani PDF portofolio secara digital:', err);
  }

  let binary = '';
  const len = signedPdfBytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(signedPdfBytes[i]);
  }
  const base64Data = btoa(binary);
  const sizeBytes = Math.round((base64Data.length * 3) / 4);

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
  isCompressed?: boolean;
  isGrayscale?: boolean;
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

  const isCompressed = Boolean(options.isCompressed);
  const isGrayscale = Boolean(options.isGrayscale);

  // Tentukan orientasi halaman pertama
  const firstCert = certs[0];
  const firstOrientation = firstCert.isPortrait ? 'portrait' : 'landscape';

  const doc = new jsPDF({
    orientation: firstOrientation,
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  const imageOptions = isCompressed
    ? { maxDimension: 1080, quality: 0.55, isGrayscale }
    : { maxDimension: 1440, quality: 0.78, isGrayscale };

  let pageIndex = 0;
  for (let i = 0; i < certs.length; i++) {
    const cert = certs[i];
    if (options.onProgress) {
      options.onProgress(i + 1, certs.length, cert.title);
    }

    const fileList = cert.filenames && cert.filenames.length > 0 ? cert.filenames : [cert.filename];
    const isPortrait = !!cert.isPortrait;
    const pageWidth = isPortrait ? 210 : 297;
    const pageHeight = isPortrait ? 297 : 210;

    for (const file of fileList) {
      if (pageIndex > 0) {
        doc.addPage('a4', isPortrait ? 'portrait' : 'landscape');
      }

      const imagePath = `/sertifikasi/${file}`;
      const imgDataUrl = await loadImageAsDataUrl(imagePath, imageOptions);

      doc.addImage(imgDataUrl, 'JPEG', 0, 0, pageWidth, pageHeight, undefined, 'FAST');
      pageIndex++;
    }
  }

  const unsignedPdfArrayBuffer = doc.output('arraybuffer');
  const unsignedPdfBytes = new Uint8Array(unsignedPdfArrayBuffer);

  let signedPdfBytes = unsignedPdfBytes;
  try {
    if (certs.length === 1) {
      const singleCert = certs[0];
      const issuerCreds = getItemIssuerCredentials(singleCert.id, singleCert.filename, singleCert.title);
      signedPdfBytes = await signPdfBuffer(unsignedPdfBytes, {
        level: 'UNIT_CREDENTIAL',
        title: `${singleCert.title} - Alvareza Hilka Pratama`,
        author: issuerCreds.signer.commonName,
        subject: issuerCreds.reason,
        keywords: [
          'Digital Profile',
          singleCert.title,
          issuerCreds.authority.commonName,
          issuerCreds.signer.commonName,
          'Verified Unit Credential',
          'PAdES',
        ],
        reason: issuerCreds.reason,
        authorityProfile: issuerCreds.authority,
        signerProfile: issuerCreds.signer,
      });
    } else {
      const masterCreds = getMasterDossierCredentials('certification', 'Dokumen Kompilasi Sertifikasi Profesi');
      signedPdfBytes = await signPdfBuffer(unsignedPdfBytes, {
        level: 'MASTER_DOSSIER',
        title: 'Kompilasi Sertifikasi Profesi & Lisensi Resmi - Alvareza Hilka Pratama',
        author: masterCreds.signer.commonName,
        subject: masterCreds.reason,
        keywords: [
          'Digital Profile',
          'Sertifikasi Profesi',
          masterCreds.authority.commonName,
          masterCreds.signer.commonName,
          'Master Dossier Verification',
          'PAdES',
        ],
        reason: masterCreds.reason,
        authorityProfile: masterCreds.authority,
        signerProfile: masterCreds.signer,
      });
    }
  } catch (err) {
    console.warn('Gagal menandatangani PDF kompilasi sertifikasi secara digital:', err);
  }

  let binary = '';
  const len = signedPdfBytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(signedPdfBytes[i]);
  }
  const base64Data = btoa(binary);
  const sizeBytes = Math.round((base64Data.length * 3) / 4);

  const filename = isCompressed ? 'sertifikasi-alvareza-kompresi.pdf' : 'sertifikasi-alvareza.pdf';

  return {
    filename,
    mimeType: 'application/pdf',
    base64: base64Data,
    sizeBytes,
  };
}

/**
 * Mengompilasi berkas sertifikat fisik Penghargaan & Kejuaraan menjadi satu berkas PDF terpadu.
 * Mendukung dokumen landscape maupun portrait sesuai orientasi berkas masing-masing.
 */
export async function buildAwardsCompilationPdf(options: {
  selectedAwardIds?: string[];
  isCompressed?: boolean;
  isGrayscale?: boolean;
  onProgress?: (current: number, total: number, awardTitle: string) => void;
}): Promise<GasAttachment> {
  const allAwards = ALL_AWARDS_LIST;
  const rawAwards =
    options.selectedAwardIds && options.selectedAwardIds.length > 0
      ? options.selectedAwardIds
          .map((id) => allAwards.find((a) => a.id === id))
          .filter((a): a is AwardItemConfig => Boolean(a))
      : allAwards;

  const awards = sortAwardsChronologicalDesc(rawAwards);

  if (awards.length === 0) {
    throw new Error('Tidak ada penghargaan yang dipilih untuk dikompilasi.');
  }

  const isCompressed = Boolean(options.isCompressed);
  const isGrayscale = Boolean(options.isGrayscale);

  // Tentukan orientasi halaman pertama
  const firstAward = awards[0];
  const firstOrientation = firstAward.isPortrait ? 'portrait' : 'landscape';

  const doc = new jsPDF({
    orientation: firstOrientation,
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  const imageOptions = isCompressed
    ? { maxDimension: 1080, quality: 0.55, isGrayscale }
    : { maxDimension: 1440, quality: 0.78, isGrayscale };

  for (let i = 0; i < awards.length; i++) {
    const awd = awards[i];
    if (options.onProgress) {
      options.onProgress(i + 1, awards.length, awd.title);
    }

    const isPortrait = !!awd.isPortrait;
    const pageWidth = isPortrait ? 210 : 297;
    const pageHeight = isPortrait ? 297 : 210;

    if (i > 0) {
      doc.addPage('a4', isPortrait ? 'portrait' : 'landscape');
    }

    const imagePath = `/penghargaan/${awd.filename}`;
    const imgDataUrl = await loadImageAsDataUrl(imagePath, imageOptions);

    doc.addImage(imgDataUrl, 'JPEG', 0, 0, pageWidth, pageHeight, undefined, 'FAST');
  }

  const unsignedPdfArrayBuffer = doc.output('arraybuffer');
  const unsignedPdfBytes = new Uint8Array(unsignedPdfArrayBuffer);

  let signedPdfBytes = unsignedPdfBytes;
  try {
    if (awards.length === 1) {
      const singleAwd = awards[0];
      const issuerCreds = getItemIssuerCredentials(singleAwd.id, singleAwd.filename, singleAwd.title);
      signedPdfBytes = await signPdfBuffer(unsignedPdfBytes, {
        level: 'UNIT_CREDENTIAL',
        title: `${singleAwd.title} - Alvareza Hilka Pratama`,
        author: issuerCreds.signer.commonName,
        subject: issuerCreds.reason,
        keywords: [
          'Digital Profile',
          singleAwd.title,
          issuerCreds.authority.commonName,
          issuerCreds.signer.commonName,
          ...(issuerCreds.coSigner?.commonName ? [issuerCreds.coSigner.commonName] : []),
          ...(issuerCreds.certificateNumber ? [issuerCreds.certificateNumber] : []),
          'Verified Unit Credential',
          'PAdES',
        ],
        reason: issuerCreds.reason,
        authorityProfile: issuerCreds.authority,
        signerProfile: issuerCreds.signer,
      });
    } else {
      const masterCreds = getMasterDossierCredentials('awards', 'Dokumen Kompilasi Piagam & Sertifikat Penghargaan Fisik');
      signedPdfBytes = await signPdfBuffer(unsignedPdfBytes, {
        level: 'MASTER_DOSSIER',
        title: 'Kompilasi Piagam & Sertifikat Penghargaan Resmi - Alvareza Hilka Pratama',
        author: masterCreds.signer.commonName,
        subject: masterCreds.reason,
        keywords: [
          'Digital Profile',
          'Penghargaan',
          'Piagam Fisik',
          masterCreds.authority.commonName,
          masterCreds.signer.commonName,
          'Master Dossier Verification',
          'PAdES',
        ],
        reason: masterCreds.reason,
        authorityProfile: masterCreds.authority,
        signerProfile: masterCreds.signer,
      });
    }
  } catch (err) {
    console.warn('Gagal menandatangani PDF kompilasi penghargaan secara digital:', err);
  }

  let binary = '';
  const len = signedPdfBytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(signedPdfBytes[i]);
  }
  const base64Data = btoa(binary);
  const sizeBytes = Math.round((base64Data.length * 3) / 4);

  const filename = isCompressed ? 'penghargaan-alvareza-kompresi.pdf' : 'penghargaan-alvareza.pdf';

  return {
    filename,
    mimeType: 'application/pdf',
    base64: base64Data,
    sizeBytes,
  };
}

