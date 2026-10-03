import { useEffect } from 'react';

export interface MetaTagsConfig {
  enabled?: boolean;
  isFullPdf?: boolean;
  pageType?: 'home' | 'cv' | 'portfolio' | 'certifications' | 'academic';
  presetCode?: string;
  presetTitle?: string;
  canonicalPath?: string;
  language?: 'id' | 'en';
}

/**
 * Custom hook to dynamically update document title, description,
 * OpenGraph, Twitter Card, and canonical metadata tags.
 */
export const useMetaTags = ({
  enabled = true,
  isFullPdf = false,
  pageType,
  presetCode,
  presetTitle,
  canonicalPath,
  language = 'id',
}: MetaTagsConfig) => {
  useEffect(() => {
    if (!enabled) return;
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    const origin = window.location.origin;
    const fallbackBaseUrl = 'https://alvareza.vercel.app';
    let absoluteImageUrl = `${fallbackBaseUrl}/og-image.jpg`;

    const normalizedPath = (canonicalPath || '').toLowerCase();
    const isAcademic =
      pageType === 'academic' ||
      normalizedPath.includes('akademik') ||
      normalizedPath.includes('skl') ||
      normalizedPath.includes('transkrip');
    const isPortfolio =
      pageType === 'portfolio' ||
      normalizedPath.includes('portofolio') ||
      normalizedPath.includes('portfolio');
    const isCertification =
      pageType === 'certifications' ||
      normalizedPath.includes('sertifikasi') ||
      normalizedPath.includes('sertifikat') ||
      normalizedPath.includes('certification');

    let title = 'MyCivy Alvareza';
    let description =
      language === 'en'
        ? 'Professional ATS-Friendly CV & Portfolio Platform. Customize specific job role presets, adjust layout and theme, and instantly download HR-ready PDF resumes.'
        : 'Platform CV ATS-Friendly & Portfolio Professional. Kustomisasi preset peran kerja spesifik, sesuaikan tata letak dan tema, lalu unduh resume PDF siap kirim ke HRD instan.';

    let ogType = isFullPdf ? 'profile' : 'website';

    if (isAcademic) {
      const isTranskrip = normalizedPath.includes('transkrip');
      ogType = 'website';
      if (isTranskrip) {
        title =
          language === 'en'
            ? 'Official Academic Transcript — Alvareza Hilka Pratama, S.M.'
            : 'Transkrip Nilai Akademik Resmi — Alvareza Hilka Pratama, S.M.';
        description =
          language === 'en'
            ? 'Official Academic Transcript of Alvareza Hilka Pratama, S.M. (Bachelor of Management, Universitas Al-Ghifari).'
            : 'Transkrip Nilai Akademik resmi Program Studi S1 Manajemen, Universitas Al-Ghifari - Alvareza Hilka Pratama, S.M.';
      } else {
        title =
          language === 'en'
            ? 'Official Graduation Certificate (SKL) — Alvareza Hilka Pratama, S.M.'
            : 'Surat Keterangan Lulus (SKL) Resmi — Alvareza Hilka Pratama, S.M.';
        description =
          language === 'en'
            ? 'Official Graduation Certificate (Surat Keterangan Lulus) of Alvareza Hilka Pratama, S.M. (Universitas Al-Ghifari).'
            : 'Surat Keterangan Lulus (SKL) resmi Program Studi S1 Manajemen, Universitas Al-Ghifari - Alvareza Hilka Pratama, S.M.';
      }
    } else if (isPortfolio) {
      absoluteImageUrl = `${fallbackBaseUrl}/og-portfolio.jpg`;
      ogType = 'website';
      const presetLabel = presetCode ? ` [${presetCode.toUpperCase()}]` : '';
      title =
        language === 'en'
          ? `Executive Portfolio & Digital Solutions${presetLabel} — Alvareza Hilka Pratama`
          : `Portofolio Eksekutif & Solusi Digital${presetLabel} — Alvareza Hilka Pratama`;
      description =
        language === 'en'
          ? 'Executive portfolio and digital solutions showcase of Alvareza Hilka Pratama: 50+ custom web apps, workflow automation, operational optimization, and integrated ERP architectures.'
          : 'Portofolio eksekutif dan showcase solusi digital Alvareza Hilka Pratama: 50+ aplikasi web kustom, otomatisasi operasional, sistem ERP terintegrasi, dan rekam jejak 100+ proyek komersial.';
    } else if (isCertification) {
      absoluteImageUrl = `${fallbackBaseUrl}/og-certification.jpg`;
      ogType = 'website';
      const presetLabel = presetCode ? ` [${presetCode.toUpperCase()}]` : '';
      title =
        language === 'en'
          ? `Professional Certifications & Licenses${presetLabel} — Alvareza Hilka Pratama`
          : `Sertifikasi Resmi & Lisensi Profesi${presetLabel} — Alvareza Hilka Pratama`;
      description =
        language === 'en'
          ? 'Verified professional certifications and industry licenses of Alvareza Hilka Pratama: MarkPlus Institute Certified HR Specialist (Grade A), Six Sigma White Belt CSSC USA, Saylor Academy IACET, and Google Certified.'
          : 'Daftar sertifikasi kompetensi industri resmi Alvareza Hilka Pratama: MarkPlus Institute Certified HR Specialist (Grade A), Six Sigma White Belt CSSC USA, Saylor Academy IACET, dan Google Certified.';
    } else if (isFullPdf) {
      if (canonicalPath === '/cv' || !presetCode || presetCode.toLowerCase() === 'opt' || presetCode.toLowerCase() === 'optimal') {
        title = 'My Professional CV — Alvareza Hilka Pratama';
        description =
          language === 'en'
            ? 'Official ATS-friendly Curriculum Vitae (CV) of Alvareza Hilka Pratama. Business Operations & Certified HR Specialist. Proven track record in supervising 13 retail outlets, coordinating 6 divisions, and 100+ commercial projects.'
            : 'Curriculum Vitae (CV) ATS-Friendly resmi Alvareza Hilka Pratama. Business Operations & Certified HR Specialist. Rekam jejak supervisi 13 gerai ritel, koordinasi 6 divisi, 100+ proyek komersial, dan sertifikasi IACET & Six Sigma.';
      } else {
        const codeDisplay = presetCode ? presetCode.toUpperCase() : 'OPTIMAL';
        const roleDisplay = presetTitle ? ` - ${presetTitle}` : '';
        title = `Curriculum Vitae (CV) ATS - Alvareza H. Pratama (${codeDisplay}${roleDisplay}) | MyCivy`;
        description =
          language === 'en'
            ? `View official ATS-friendly Curriculum Vitae (CV) of Alvareza H. Pratama for ${roleDisplay}. Verified industry standard format, ready to print and download directly as PDF.`
            : `Lihat pratinjau Curriculum Vitae (CV) ATS-Friendly resmi Alvareza H. Pratama untuk posisi ${roleDisplay}. Format standar industri terverifikasi, siap cetak dan diunduh langsung format PDF.`;
      }
    }

    const currentUrl = canonicalPath
      ? `${origin}${canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`}`
      : window.location.href;

    // 1. Update Document Title
    document.title = title;

    // Helper to safely set/update meta tag
    const updateMeta = (nameOrProp: 'name' | 'property', key: string, content: string) => {
      let meta = document.querySelector(`meta[${nameOrProp}="${key}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(nameOrProp, key);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Primary Meta Tags
    updateMeta('name', 'title', title);
    updateMeta('name', 'description', description);

    // OpenGraph
    updateMeta('property', 'og:type', ogType);
    updateMeta('property', 'og:title', title);
    updateMeta('property', 'og:description', description);
    updateMeta('property', 'og:url', currentUrl);
    updateMeta('property', 'og:image', absoluteImageUrl);
    updateMeta('property', 'og:image:secure_url', absoluteImageUrl);
    updateMeta('property', 'og:image:type', 'image/jpeg');
    updateMeta('property', 'og:image:width', '1200');
    updateMeta('property', 'og:image:height', '630');
    updateMeta('property', 'og:image:alt', title);
    updateMeta('property', 'og:site_name', 'MyCivy');

    // Twitter Card
    updateMeta('name', 'twitter:title', title);
    updateMeta('name', 'twitter:description', description);
    updateMeta('name', 'twitter:url', currentUrl);
    updateMeta('name', 'twitter:image', absoluteImageUrl);
    updateMeta('name', 'twitter:image:alt', title);
    updateMeta('name', 'twitter:card', 'summary_large_image');

    // Canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', currentUrl);

    // Direct image_src link
    let imageSrc = document.querySelector('link[rel="image_src"]');
    if (!imageSrc) {
      imageSrc = document.createElement('link');
      imageSrc.setAttribute('rel', 'image_src');
      document.head.appendChild(imageSrc);
    }
    imageSrc.setAttribute('href', absoluteImageUrl);
  }, [enabled, isFullPdf, pageType, presetCode, presetTitle, canonicalPath, language]);
};
