import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Download,
  X,
  Share2,
  Copy,
  CheckCheck,
  QrCode,
  Loader2,
  Moon,
  Sun,
  Palette,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { renderIdentityPagesForPreview, downloadIdentityDocsPdf, buildIdentityDocsPdf, RenderedIdentityPagePreview } from '../../utils/pdf-engine/identitas';
import { useMetaTags } from '../../hooks/useMetaTags';
import { useThemeMode } from '../../hooks/useThemeMode';
import { resolveIdentitasSpesifik, resolvePhotoSizeFromParam } from '../../utils/spesifikParamResolver';
import { FullViewExportMenu, FullViewExportItem } from './menu-export';
import { FullViewQrModal } from './modal-qr';

export type IdentityRouteType = 'identitas' | 'ktp' | 'npwp' | 'kk' | 'foto';

export interface IdentityRouteInfo {
  routeType: IdentityRouteType;
  photoSizeParam: string;
  selectedIds: string[];
  isSeparatePhotoPrint: boolean;
  isSingleCardDirectFit: boolean;
  title: string;
  subtitle: string;
  canonicalPath: string;
}

/**
 * Resolves active identity document route and document list strictly from the URL path and search params
 * with full tolerance, auto-correction for "spesifik", and image-to-pdf direct-fit rendering.
 */
export function resolveIdentityRouteFromUrl(): IdentityRouteInfo {
  if (typeof window === 'undefined') {
    return {
      routeType: 'identitas',
      photoSizeParam: '',
      selectedIds: ['pas-foto-setengah-badan', 'pas-foto-4x6', 'pas-foto-3x4', 'ktp', 'npwp', 'kk'],
      isSeparatePhotoPrint: false,
      isSingleCardDirectFit: false,
      title: 'Alvareza H. Pratama',
      subtitle: 'Dokumen Identitas (Lengkap) - Digital Profile',
      canonicalPath: '/preview?file=identitas',
    };
  }

  const pathname = window.location.pathname.replace(/^\/+/, '').trim().toLowerCase();
  const params = new URLSearchParams(window.location.search);
  const fileParam = (params.get('f') || params.get('file') || '').trim().toLowerCase();
  const spesifikParam = params.get('spec') || params.get('spesifik') || params.get('spesifikasi');
  const docParam = params.get('doc') || params.get('id') || params.get('type');
  const sizeParam = params.get('sz') || params.get('size') || params.get('s') || params.get('p');

  // Check specific identity document via resolver
  const resolvedSpesifik = resolveIdentitasSpesifik(spesifikParam || docParam || pathname);

  const isFotoRequest =
    resolvedSpesifik === 'foto' ||
    fileParam === 'ft' ||
    fileParam === 'foto' ||
    fileParam === 'pas-foto' ||
    pathname === 'foto' ||
    pathname === 'pas-foto' ||
    pathname.startsWith('foto/');

  // 1. Photo full area view (/prev?f=ft or /preview?file=foto or spec=3x4/4x6/sb)
  if (isFotoRequest) {
    const resolvedSize = resolvePhotoSizeFromParam(sizeParam || spesifikParam || docParam);

    if (resolvedSize === '3x4') {
      return {
        routeType: 'foto',
        photoSizeParam: '3x4',
        selectedIds: ['pas-foto-3x4'],
        isSeparatePhotoPrint: true,
        isSingleCardDirectFit: false,
        title: 'Alvareza H. Pratama',
        subtitle: 'Pas Foto 3x4 - Digital Profile',
        canonicalPath: '/prev?f=ft&spec=3x4',
      };
    }
    if (resolvedSize === '4x6') {
      return {
        routeType: 'foto',
        photoSizeParam: '4x6',
        selectedIds: ['pas-foto-4x6'],
        isSeparatePhotoPrint: true,
        isSingleCardDirectFit: false,
        title: 'Alvareza H. Pratama',
        subtitle: 'Pas Foto 4x6 - Digital Profile',
        canonicalPath: '/prev?f=ft&spec=4x6',
      };
    }
    if (resolvedSize === 'setengah-badan') {
      return {
        routeType: 'foto',
        photoSizeParam: 'setengah-badan',
        selectedIds: ['pas-foto-setengah-badan'],
        isSeparatePhotoPrint: true,
        isSingleCardDirectFit: false,
        title: 'Alvareza H. Pratama',
        subtitle: 'Pas Foto Setengah Badan - Digital Profile',
        canonicalPath: '/prev?f=ft&spec=sb',
      };
    }

    // Default photo view without specific size: full area for all photos
    return {
      routeType: 'foto',
      photoSizeParam: '',
      selectedIds: ['pas-foto-setengah-badan', 'pas-foto-4x6', 'pas-foto-3x4'],
      isSeparatePhotoPrint: true,
      isSingleCardDirectFit: false,
      title: 'Alvareza H. Pratama',
      subtitle: 'Pas Foto (Full Area) - Digital Profile',
      canonicalPath: '/prev?f=ft',
    };
  }

  // 2. Specific Documents: KTP, NPWP, KK (Rendered in direct-fit image-to-pdf mode without A4 empty sheet borders)
  if (resolvedSpesifik === 'ktp') {
    return {
      routeType: 'ktp',
      photoSizeParam: '',
      selectedIds: ['ktp'],
      isSeparatePhotoPrint: false,
      isSingleCardDirectFit: true,
      title: 'Alvareza H. Pratama',
      subtitle: 'Kartu Tanda Penduduk (KTP) - Digital Profile',
      canonicalPath: '/prev?f=id&spec=ktp',
    };
  }

  if (resolvedSpesifik === 'npwp') {
    return {
      routeType: 'npwp',
      photoSizeParam: '',
      selectedIds: ['npwp'],
      isSeparatePhotoPrint: false,
      isSingleCardDirectFit: true,
      title: 'Alvareza H. Pratama',
      subtitle: 'Kartu NPWP - Digital Profile',
      canonicalPath: '/prev?f=id&spec=npwp',
    };
  }

  if (resolvedSpesifik === 'kk') {
    return {
      routeType: 'kk',
      photoSizeParam: '',
      selectedIds: ['kk'],
      isSeparatePhotoPrint: false,
      isSingleCardDirectFit: true,
      title: 'Alvareza H. Pratama',
      subtitle: 'Kartu Keluarga (KK) - Digital Profile',
      canonicalPath: '/prev?f=id&spec=kk',
    };
  }

  // 3. Default combined identity view (/prev?f=id or /preview?file=identitas)
  return {
    routeType: 'identitas',
    photoSizeParam: '',
    selectedIds: ['pas-foto-setengah-badan', 'pas-foto-4x6', 'pas-foto-3x4', 'ktp', 'npwp', 'kk'],
    isSeparatePhotoPrint: false,
    isSingleCardDirectFit: false,
    title: 'Alvareza H. Pratama',
    subtitle: 'Dokumen Identitas (Lengkap) - Digital Profile',
    canonicalPath: '/prev?f=id',
  };
}

/**
 * Parses URL flags: default FALSE (Hitam Putih / BW), becomes TRUE only if ?cl=true or ?color=true
 */
export function parseIdentityUrlFlags(): { isColor: boolean } {
  if (typeof window === 'undefined') return { isColor: false };
  const search = window.location.search.toLowerCase();
  const params = new URLSearchParams(window.location.search);

  const colorParam = params.get('cl') || params.get('color') || params.get('warna');
  const isColor =
    colorParam === 'true' ||
    colorParam === '1' ||
    search.includes('cl=true') ||
    search.includes('color=true') ||
    search.includes('warna=true');

  return { isColor };
}

/**
 * Constructs the canonical shareable URL for identity documents using /prev?f=... format
 */
export function buildIdentityShareUrl(routeInfo: IdentityRouteInfo, isColor: boolean, mode?: 'dark' | 'light'): string {
  if (typeof window === 'undefined') return `https://alvareza.app${routeInfo.canonicalPath}`;
  const origin = window.location.origin;
  const params: string[] = [];

  if (routeInfo.routeType === 'foto') {
    params.push('f=ft');
    if (isColor) params.push('cl=true');
    if (routeInfo.photoSizeParam) {
      const shortSz = routeInfo.photoSizeParam === 'setengah-badan' ? 'sb' : routeInfo.photoSizeParam;
      params.push(`spec=${shortSz}`);
    }
  } else if (routeInfo.routeType === 'ktp' || routeInfo.routeType === 'npwp' || routeInfo.routeType === 'kk') {
    params.push('f=id');
    if (isColor) params.push('cl=true');
    params.push(`spec=${routeInfo.routeType}`);
  } else {
    params.push('f=id');
    if (isColor) params.push('cl=true');
  }

  if (mode) {
    params.push(`mode=${mode}`);
  }

  const qs = params.length > 0 ? `?${params.join('&')}` : '';
  return `${origin}/prev${qs}`;
}

export const FullPageIdentityView: React.FC = () => {
  const [routeInfo, setRouteInfo] = useState<IdentityRouteInfo>(resolveIdentityRouteFromUrl);
  const [isColor, setIsColor] = useState<boolean>(() => parseIdentityUrlFlags().isColor);
  const { isDarkMode, toggleTheme } = useThemeMode();
  const [previews, setPreviews] = useState<RenderedIdentityPagePreview[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [isShareMenuOpen, setIsShareMenuOpen] = useState<boolean>(false);
  const [showQrCode, setShowQrCode] = useState<boolean>(false);

  // Sync mode parameter in URL
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('mode', isDarkMode ? 'dark' : 'light');
      url.searchParams.delete('theme');
      url.searchParams.delete('th');
      url.searchParams.delete('ui');
      window.history.replaceState(null, '', url.toString());
    } catch {}
  }, [isDarkMode]);

  // Update previews whenever routeInfo or isColor changes
  const updatePreviews = useCallback(async () => {
    setIsLoading(true);
    try {
      const pagePreviews = await renderIdentityPagesForPreview({
        selectedIds: routeInfo.selectedIds,
        isColorPrint: isColor,
        isSeparatePhotoPrint: routeInfo.isSeparatePhotoPrint,
        isSingleCardDirectFit: routeInfo.isSingleCardDirectFit,
      });
      setPreviews(pagePreviews);
    } catch (err) {
      console.error('Failed to render identity page previews:', err);
    } finally {
      setIsLoading(false);
    }
  }, [routeInfo, isColor]);

  useEffect(() => {
    updatePreviews();
  }, [updatePreviews]);

  useEffect(() => {
    const handlePopState = () => {
      setRouteInfo(resolveIdentityRouteFromUrl());
      setIsColor(parseIdentityUrlFlags().isColor);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  
  const exportItems: FullViewExportItem[] = useMemo(() => {
    const map: Record<string, { title: string; filename: string; isPortrait: boolean }> = {
      'pas-foto-setengah-badan': { title: 'Pas Foto Setengah Badan', filename: 'pas-foto-setengah-badan.webp', isPortrait: true },
      'pas-foto-4x6': { title: 'Pas Foto 4x6', filename: 'pas-foto-4x6.webp', isPortrait: true },
      'pas-foto-3x4': { title: 'Pas Foto 3x4', filename: 'pas-foto-3x4.webp', isPortrait: true },
      'ktp': { title: 'KTP Elektronik', filename: 'ktp.webp', isPortrait: false },
      'npwp': { title: 'Kartu NPWP', filename: 'npwp.webp', isPortrait: false },
      'kk': { title: 'Kartu Keluarga (KK)', filename: 'kk.webp', isPortrait: false },
    };
    return routeInfo.selectedIds.map((id) => {
      const info = map[id] || { title: id, filename: `${id}.webp`, isPortrait: false };
      return {
        id,
        title: info.title,
        src: `/identitas/${info.filename}`,
        filename: info.filename,
        isPortrait: info.isPortrait,
      };
    });
  }, [routeInfo.selectedIds]);

  const shareUrl = useMemo(
    () => buildIdentityShareUrl(routeInfo, isColor, isDarkMode ? 'dark' : 'light'),
    [routeInfo, isColor, isDarkMode]
  );

  const identityExportTitle = useMemo(() => {
    if (routeInfo.selectedIds.length === 1) {
      const id = routeInfo.selectedIds[0];
      if (id === 'ktp') return 'KTP_Elektronik';
      if (id === 'npwp') return 'Kartu_NPWP';
      if (id === 'kk') return 'Kartu_Keluarga_KK';
      if (id === 'pas-foto-setengah-badan') return 'Pas_Foto_Setengah_Badan';
      if (id === 'pas-foto-4x6') return 'Pas_Foto_4x6';
      if (id === 'pas-foto-3x4') return 'Pas_Foto_3x4';
    }
    return 'Dokumen_Identitas';
  }, [routeInfo.selectedIds]);

  const handleCopyLink = async () => {
    if (typeof window === 'undefined') return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = shareUrl;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    try {
      await downloadIdentityDocsPdf(
        routeInfo.selectedIds,
        isColor,
        routeInfo.isSeparatePhotoPrint,
        routeInfo.isSingleCardDirectFit
      );
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  useMetaTags({
    enabled: true,
    isFullPdf: true,
    canonicalPath: routeInfo.canonicalPath,
    language: 'in',
  });

  return (
    <div
      className={`h-screen ${
        isDarkMode
          ? 'bg-slate-950 text-slate-100 selection:bg-blue-900 selection:text-white'
          : 'bg-slate-200 text-slate-900 selection:bg-blue-100 selection:text-slate-900'
      } flex flex-col font-sans w-full overflow-hidden`}
    >
      {/* Top Header Bar */}
      <header
        className={`sticky top-0 z-50 shrink-0 px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2 shadow-xs w-full transition-colors ${
          isDarkMode
            ? 'bg-slate-900/95 border-b border-slate-800 text-slate-100 backdrop-blur-md'
            : 'bg-white border-b border-slate-200 text-slate-900'
        }`}
      >
        {/* Left Section: Name & Subtitle */}
        <div className="flex flex-col min-w-0">
          <h1
            className={`text-sm sm:text-base font-bold truncate leading-tight ${
              isDarkMode ? 'text-slate-100' : 'text-slate-900'
            }`}
          >
            Alvareza H. Pratama
          </h1>
          <p
            className={`text-[10px] sm:text-xs font-medium truncate leading-tight ${
              isDarkMode ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            {routeInfo.subtitle.replace('- Digital Profile', '- Digital Profile')}
          </p>
        </div>

        {/* Right Section: Theme Toggle | Share Icon */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 relative">
          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className={`p-2 rounded-xl transition-all cursor-pointer border flex items-center justify-center ${
              isDarkMode
                ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-white'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
            }`}
            title={isDarkMode ? 'Ganti ke Mode Terang (mode=light)' : 'Ganti ke Mode Gelap (mode=dark)'}
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-white" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>

          {/* Share & Export Dropdown 2-Layer Menu */}
          <FullViewExportMenu
            documentCategory="identity"
            documentTitle={identityExportTitle}
            shareableUrl={shareUrl}
            isDarkMode={isDarkMode}
            isColorMode={isColor}
            items={exportItems}
            onOpenQrCode={() => setShowQrCode(true)}
            onBuildCompletePdf={async (onProgress) => {
              onProgress(1, 1, 'Menyusun berkas PDF Identitas...');
              const attachments = await buildIdentityDocsPdf({
                selectedIds: routeInfo.selectedIds,
                isColorPrint: isColor,
                isSeparatePhotoPrint: routeInfo.isSeparatePhotoPrint,
                isSingleCardDirectFit: routeInfo.isSingleCardDirectFit,
              });
              if (attachments && attachments.length > 0) {
                return attachments[0].base64;
              }
              throw new Error('Gagal menghasilkan dokumen PDF Identitas');
            }}
          />
        </div>
      </header>

      {/* Main Full-Page Document Preview */}
      <main
        className={`flex-1 overflow-y-auto ${
          isDarkMode ? 'bg-slate-950' : 'bg-slate-200'
        } px-3 sm:px-8 py-6 flex flex-col items-center justify-start w-full relative transition-colors`}
      >
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <span className="text-xs font-medium">Memuat pratinjau dokumen...</span>
          </div>
        ) : (
          <div className="flex flex-col gap-6 sm:gap-8 items-center w-full max-w-4xl my-auto py-2">
            {previews.map((page) => (
              <div
                key={page.id}
                className={`w-full bg-white rounded-xl overflow-hidden transition-all duration-200 ${
                  isDarkMode
                    ? 'shadow-2xl shadow-blue-950/40 border border-slate-800'
                    : 'shadow-xl border border-slate-300'
                }`}
              >
                <img
                  src={page.imageUrl}
                  alt={page.title}
                  className="w-full h-auto block select-none"
                  loading="eager"
                />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* QR Code Modal */}
      <FullViewQrModal
        isOpen={showQrCode}
        onClose={() => setShowQrCode(false)}
        title={`QR Code - ${routeInfo.subtitle}`}
        description="Pindai kode QR untuk mengakses dokumen identitas secara langsung"
        shareableUrl={shareUrl}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};

export const IdentityView = FullPageIdentityView;
