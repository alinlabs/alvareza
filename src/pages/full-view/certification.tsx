import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Share2,
  Copy,
  CheckCheck,
  QrCode,
  FileText,
  Briefcase,
  ExternalLink,
  Moon,
  Sun,
  Star,
  Download,
  Loader2,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useLanguage } from '../../context/LanguageContext';
import { useThemeMode } from '../../hooks/useThemeMode';
import { CVCertification } from '../../types';
import {
  ALL_ROLE_PRESETS,
  resolvePresetFromQuery,
} from '../../data/preset/RoleConfig';
import {
  getItemSelectionForPreset,
  getPresetSectionOrders,
} from '../../data/preset/ItemSelections';
import { buildCertificatesCompilationPdf } from '../../utils/portfolioPdfGenerator';
import { useMetaTags } from '../../hooks/useMetaTags';
import { DIGITALPROFILE_QR_LOGO_SVG } from './constants';
import { FullViewExportMenu, FullViewExportItem } from './components/FullViewExportMenu';

// Mapping certification ID to image filename in /public/sertifikasi
export const CERTIFICATION_IMAGES: Record<string, string> = {
  'cert-5': '/sertifikasi/six-sigma.webp',
  'cert-3': '/sertifikasi/hrs-saylor.webp',
  'cert-2': '/sertifikasi/opm-saylor.webp',
  'cert-4': '/sertifikasi/mis-saylor.webp',
  'cert-1': '/sertifikasi/hr-mpic.webp',
  'cert-6': '/sertifikasi/analytics-google.webp',
  'cert-7': '/sertifikasi/ads-google.webp',
  'cert-8': '/sertifikasi/web-google.webp',
};

interface FullPageCertificationViewProps {
  initialPreset?: string;
  onNavigateToEditor: () => void;
  onNavigateToPdf?: () => void;
  onNavigateToPortfolio?: () => void;
}

export const FullPageCertificationView: React.FC<FullPageCertificationViewProps> = ({
  initialPreset,
  onNavigateToEditor,
  onNavigateToPdf,
  onNavigateToPortfolio,
}) => {
  const { language, activeCvData } = useLanguage();
  const { isDarkMode, toggleTheme } = useThemeMode();

  // Resolve initial preset from prop or URL query (?preset=OPT, ?preset=HRS, etc.)
  const getInitialPreset = (): string => {
    if (initialPreset && initialPreset !== 'all') {
      return initialPreset;
    }
    if (typeof window === 'undefined') return 'all';
    const params = new URLSearchParams(window.location.search);
    const p = (params.get('preset') || params.get('role') || params.get('p') || '').trim();
    if (!p) return 'all';
    if (p.toLowerCase() === 'all' || p.toLowerCase() === 'semua') return 'all';
    const resolved = resolvePresetFromQuery(p);
    return resolved || 'all';
  };

  const getInitialColorMode = (): boolean => {
    if (typeof window === 'undefined') return false; // Default BW
    const params = new URLSearchParams(window.location.search);
    const colorParam = (params.get('cl') || params.get('color') || params.get('c') || '').toLowerCase().trim();
    return colorParam === 'true' || colorParam === '1' || colorParam === 'berwarna';
  };

  const getInitialCompressedMode = (): boolean => {
    if (typeof window === 'undefined') return true; // Default compressed
    const params = new URLSearchParams(window.location.search);
    const qualityParam = (params.get('q') || params.get('quality') || '').toLowerCase().trim();
    if (qualityParam === 'ori' || qualityParam === 'full' || qualityParam === 'original') {
      return false;
    }
    const compressParam = (params.get('compress') || params.get('compressed') || '').toLowerCase().trim();
    if (compressParam === 'false' || compressParam === '0') {
      return false;
    }
    return true;
  };

  const [selectedPreset, setSelectedPreset] = useState<string>(getInitialPreset);
  const [isColorMode, setIsColorMode] = useState<boolean>(getInitialColorMode);
  const [isCompressedMode, setIsCompressedMode] = useState<boolean>(getInitialCompressedMode);
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
  const [showQrCode, setShowQrCode] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [selectedCert, setSelectedCert] = useState<CVCertification | null>(null);

  // Synchronize on popstate (browser back / forward button)
  useEffect(() => {
    const handlePopState = () => {
      setSelectedPreset(getInitialPreset());
      setIsColorMode(getInitialColorMode());
      setIsCompressedMode(getInitialCompressedMode());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Find active preset config object
  const activePresetObj = useMemo(() => {
    if (!selectedPreset || selectedPreset === 'all') return null;
    return ALL_ROLE_PRESETS.find((p) => p.key === selectedPreset) || null;
  }, [selectedPreset]);

  // Integrated Meta Tags hook for Certifications
  useMetaTags({
    pageType: 'certifications',
    canonicalPath: '/preview?file=sertifikasi',
    presetCode: activePresetObj?.code || (selectedPreset !== 'all' ? selectedPreset : undefined),
    presetTitle: (activePresetObj?.titleIn || activePresetObj?.titleId),
    language,
  });

  // Sync URL search params with active preset, color, compress, and theme without page reload
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    const cleanPath = url.pathname.replace(/^\/+/, '').trim().toLowerCase();
    const isShort = cleanPath === 'prev' || (!cleanPath.startsWith('preview') && url.searchParams.has('f'));

    if (isShort) {
      url.pathname = '/prev';
      url.searchParams.set('f', 's');
      url.searchParams.delete('file');
    } else {
      url.pathname = '/preview';
      url.searchParams.set('file', 'sertifikasi');
      url.searchParams.delete('f');
    }
    url.searchParams.delete('pages');
    url.searchParams.delete('page');
    url.searchParams.delete('admin');

    // Set or clear preset parameter (uses uppercase short code if available like OPT or HRS)
    if (selectedPreset && selectedPreset !== 'all') {
      const code = activePresetObj?.code || selectedPreset;
      if (isShort) {
        url.searchParams.set('pr', code);
        url.searchParams.delete('preset');
      } else {
        url.searchParams.set('preset', code);
        url.searchParams.delete('pr');
      }
    } else {
      url.searchParams.delete('pr');
      url.searchParams.delete('preset');
    }

    // Sync color parameter (Default BW: omit color param unless isColorMode is true)
    if (isColorMode) {
      if (isShort) {
        url.searchParams.set('cl', 'true');
        url.searchParams.delete('color');
      } else {
        url.searchParams.set('color', 'true');
        url.searchParams.delete('cl');
      }
    } else {
      url.searchParams.delete('cl');
      url.searchParams.delete('color');
      url.searchParams.delete('c');
      url.searchParams.delete('bw');
    }

    // Sync quality/compress parameter (Default Compressed: omit quality param unless isCompressedMode is false)
    if (!isCompressedMode) {
      if (isShort) {
        url.searchParams.set('q', 'ori');
        url.searchParams.delete('quality');
      } else {
        url.searchParams.set('quality', 'ori');
        url.searchParams.delete('q');
      }
      url.searchParams.delete('compress');
      url.searchParams.delete('compressed');
    } else {
      url.searchParams.delete('q');
      url.searchParams.delete('quality');
      url.searchParams.delete('compress');
      url.searchParams.delete('compressed');
    }

    // Sync mode parameter (dark / light)
    url.searchParams.set('mode', isDarkMode ? 'dark' : 'light');
    url.searchParams.delete('theme');
    url.searchParams.delete('th');
    url.searchParams.delete('ui');

    window.history.replaceState({}, '', url.toString());
  }, [selectedPreset, activePresetObj, isColorMode, isCompressedMode, isDarkMode]);

  // All certifications available in activeCvData
  const allCertifications = useMemo(() => {
    return activeCvData?.certifications || [];
  }, [activeCvData]);

  // Filtered certifications according to active preset
  const displayedCertifications = useMemo(() => {
    if (!selectedPreset || selectedPreset === 'all') {
      return allCertifications;
    }

    const selection = getItemSelectionForPreset(selectedPreset);
    const orders = getPresetSectionOrders(selectedPreset);

    const filtered = allCertifications
      .filter((cert) => selection.certifications?.[cert.id] === true)
      .sort((a, b) => {
        const orderA = orders.certifications?.indexOf(a.id) ?? 999;
        const orderB = orders.certifications?.indexOf(b.id) ?? 999;
        return (orderA !== -1 ? orderA : 999) - (orderB !== -1 ? orderB : 999);
      });

    return filtered.length > 0 ? filtered : allCertifications;
  }, [allCertifications, selectedPreset]);

  // Update Page Title and Meta Tags
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const presetLabel = activePresetObj ? ` [${activePresetObj.code}]` : '';
    const title =
      language === 'en'
        ? `Professional Certifications & Licenses${presetLabel} - Alvareza Hilka Pratama | Digital Profile`
        : `Sertifikasi Profesi & Lisensi${presetLabel} - Alvareza Hilka Pratama | Digital Profile`;
    document.title = title;

    const desc =
      language === 'en'
        ? `Official certifications and licenses of Alvareza Hilka Pratama (${displayedCertifications.length} verified credentials), including MarkPlus Institute, Saylor Academy USA, CSSC Six Sigma, and Google Credentials.`
        : `Sertifikasi dan lisensi resmi Alvareza Hilka Pratama (${displayedCertifications.length} kredensial terverifikasi) dari MarkPlus Institute, Saylor Academy USA, CSSC Six Sigma, dan Google Credentials.`;

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', desc);

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', title);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', desc);
  }, [language, activePresetObj, displayedCertifications.length]);

  const getPublicShareUrl = (): string => {
    if (typeof window === 'undefined') return 'https://alvareza.my.id/prev?f=s';
    const origin = window.location.origin;
    const params = new URLSearchParams();
    params.set('f', 's');
    if (selectedPreset && selectedPreset !== 'all') {
      const code = activePresetObj?.code || selectedPreset;
      params.set('pr', code);
    }
    if (isColorMode) {
      params.set('cl', 'true');
    }
    if (!isCompressedMode) {
      params.set('q', 'ori');
    }
    params.set('mode', isDarkMode ? 'dark' : 'light');
    const qs = params.toString();
    return `${origin}/prev?${qs}`;
  };

  const handleCopyLink = async () => {
    const url = getPublicShareUrl();
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleDownloadCertificatesPDF = async () => {
    try {
      setIsDownloadingPdf(true);
      const attachment = await buildCertificatesCompilationPdf({
        preset: selectedPreset && selectedPreset !== 'all' ? selectedPreset : 'optimal',
        selectedCertIds: displayedCertifications.map((c) => c.id),
        isCompressed: isCompressedMode,
        isGrayscale: !isColorMode,
      });

      const link = document.createElement('a');
      link.href = `data:application/pdf;base64,${attachment.base64}`;
      link.download = isCompressedMode
        ? (!isColorMode ? 'sertifikasi-alvareza-bw-kompresi.pdf' : 'sertifikasi-alvareza-kompresi.pdf')
        : (!isColorMode ? 'sertifikasi-alvareza-bw.pdf' : 'sertifikasi-alvareza.pdf');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Gagal mengunduh PDF Sertifikasi:', err);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handleNativeShare = async () => {
    const shareUrl = getPublicShareUrl();
    const presetInfo = activePresetObj ? ` (${activePresetObj.code} - ${activePresetObj.titleId})` : '';
    const shareData = {
      title: `Sertifikasi Profesi & Lisensi - Alvareza Hilka Pratama${presetInfo}`,
      text: `Lihat dokumen sertifikasi dan lisensi resmi Alvareza Hilka Pratama di Digital Profile${presetInfo}:`,
      url: shareUrl,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          handleCopyLink();
        }
      }
    } else {
      handleCopyLink();
    }
  };

  const exportItems: FullViewExportItem[] = useMemo(() => {
    return displayedCertifications.map((c) => {
      const src = CERTIFICATION_IMAGES[c.id] || '/sertifikasi/six-sigma.webp';
      const filename = src.split('/').pop() || 'sertifikat.webp';
      return {
        id: c.id,
        title: c.title,
        src,
        filename,
        isPortrait: false,
      };
    });
  }, [displayedCertifications]);

  const shareableUrl = getPublicShareUrl();

  return (
    <div
      className={`h-screen ${
        isDarkMode
          ? 'bg-slate-950 text-slate-100 selection:bg-blue-900 selection:text-white'
          : 'bg-slate-200 text-slate-900 selection:bg-blue-100 selection:text-slate-900'
      } flex flex-col font-sans w-full overflow-hidden`}
    >
      {/* Top Standalone Header Bar */}
      <header
        className={`sticky top-0 z-50 shrink-0 px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2 shadow-xs w-full transition-colors ${
          isDarkMode
            ? 'bg-slate-900/95 border-b border-slate-800 text-slate-100 backdrop-blur-md'
            : 'bg-white border-b border-slate-200 text-slate-900'
        }`}
      >
        {/* Left Section: Name & Subtitle */}
        <div className="flex flex-col min-w-0">
          <h1 className={`text-sm sm:text-base font-bold truncate leading-tight ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
            Alvareza H. Pratama
          </h1>
          <p className={`text-[10px] sm:text-xs font-medium truncate leading-tight ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Sertifikasi - Digital Profile
          </p>
        </div>

        {/* Right Section: Theme Toggle | Share Card */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 relative">
          {/* Theme Toggle Button (Light/Dark mode) */}
          <button
            type="button"
            onClick={toggleTheme}
            className={`p-2 rounded-xl transition-all cursor-pointer border flex items-center justify-center ${
              isDarkMode
                ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-white'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
            }`}
            title={
              isDarkMode
                ? 'Ganti ke Mode Terang (mode=light)'
                : 'Ganti ke Mode Gelap (mode=dark)'
            }
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-white" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Share & Export Dropdown 2-Layer Menu */}
          <FullViewExportMenu
            documentCategory="certification"
            documentTitle="Sertifikasi_Profesi"
            shareableUrl={shareableUrl}
            isDarkMode={isDarkMode}
            isColorMode={isColorMode}
            items={exportItems}
            onOpenQrCode={() => setShowQrCode(true)}
            onBuildCompletePdf={async (onProgress) => {
              const result = await buildCertificatesCompilationPdf({
                preset: selectedPreset,
                isCompressed: false,
                isGrayscale: !isColorMode,
                onProgress: (curr, tot, tit) => onProgress(curr, tot, tit),
              });
              return result.base64;
            }}
          />
        </div>
      </header>

      {/* Main Full-Page Certification Content Canvas Body */}
      <main
        className={`flex-1 overflow-y-auto ${
          isDarkMode ? 'bg-slate-950' : 'bg-slate-200'
        } px-3 sm:px-8 py-6 flex flex-col items-center justify-start w-full relative transition-colors`}
      >
        <div className="flex flex-col gap-6 sm:gap-8 items-center w-full max-w-4xl my-auto py-2">
          {displayedCertifications.map((cert, index) => {
            const imageSrc = CERTIFICATION_IMAGES[cert.id] || '/sertifikasi/six-sigma.webp';
            const isFirstTwo = index < 2;

            return (
              <div
                key={cert.id}
                onClick={() => setSelectedCert(cert)}
                className={`w-full bg-white rounded-xl overflow-hidden transition-all cursor-pointer group hover:scale-[1.005] active:scale-[0.995] duration-200 ${
                  isDarkMode
                    ? 'shadow-2xl shadow-blue-950/40 border border-slate-800 hover:border-blue-500/50'
                    : 'shadow-xl border border-slate-300 hover:border-blue-500/60'
                }`}
                title={language === 'en' ? 'Click to view details' : 'Klik untuk melihat detail'}
              >
                <img
                  src={imageSrc}
                  alt={`Sertifikat: ${cert.title}`}
                  className={`w-full h-auto block select-none transition-all duration-200 ${
                    !isColorMode ? 'filter grayscale contrast-105' : ''
                  }`}
                  loading={isFirstTwo ? 'eager' : 'lazy'}
                  decoding="async"
                  referrerPolicy="no-referrer"
                />
              </div>
            );
          })}
        </div>
      </main>

      {/* Detail Modal (Desktop) / Bottom Sheet (Mobile) */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-hidden overscroll-contain">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-md transition-opacity animate-in fade-in duration-300 cursor-pointer touch-none"
            onClick={() => setSelectedCert(null)}
          />

          {/* Modal / Bottom Sheet Container */}
          <div
            className={`relative w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl z-10 flex flex-col animate-in slide-in-from-bottom sm:slide-in-from-none sm:zoom-in-95 duration-300 border max-h-[85vh] overflow-hidden ${
              isDarkMode
                ? 'bg-slate-900 border-slate-800 text-slate-100'
                : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            {/* Sticky Header */}
            <div
              className={`p-5 sm:p-6 border-b shrink-0 flex items-start justify-between gap-3 ${
                isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-100 bg-white'
              }`}
            >
              <div>
                {/* Level / Badge above title */}
                {selectedCert.level && (
                  <div className="mb-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold text-white bg-blue-600 dark:bg-blue-600 border border-blue-500/40 shadow-xs">
                      <span>{selectedCert.level}</span>
                      <Star className="w-3.5 h-3.5 text-white fill-white shrink-0" />
                    </span>
                  </div>
                )}
                <h3 className={`text-base sm:text-lg font-bold leading-snug ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                  {selectedCert.title}
                </h3>
                <p className={`text-xs font-medium mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  {selectedCert.issuer} {selectedCert.credentialSub ? `• ${selectedCert.credentialSub}` : ''} {selectedCert.period ? `(${selectedCert.period})` : ''}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCert(null)}
                className={`p-1.5 rounded-full transition-colors cursor-pointer shrink-0 ${
                  isDarkMode
                    ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                }`}
                title={language === 'en' ? 'Close' : 'Tutup'}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Modal Content */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
              {/* Description */}
              {selectedCert.description && (
                <p className={`text-xs sm:text-sm leading-relaxed text-justify ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  {selectedCert.description}
                </p>
              )}

              {/* Competencies / Skills */}
              {selectedCert.skills && selectedCert.skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {selectedCert.skills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${
                        isDarkMode
                          ? 'bg-slate-800 text-slate-200 border-slate-700'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}

              {/* Grade if present */}
              {selectedCert.grade && (
                <div className="text-xs text-center text-slate-500 dark:text-slate-400 pt-2 font-medium">
                  {selectedCert.grade}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Responsive Bottom Sheet / Modal QR Code Overlay */}
      {showQrCode && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-hidden overscroll-contain">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/10 backdrop-blur-md transition-opacity animate-in fade-in duration-300 cursor-pointer touch-none"
            onClick={() => setShowQrCode(false)}
          />
          {/* Container */}
          <div
            className={`relative w-full max-w-sm sm:max-w-[380px] rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 sm:p-7 z-10 flex flex-col items-center animate-in slide-in-from-bottom sm:slide-in-from-none sm:zoom-in-95 duration-300 border ${
              isDarkMode
                ? 'bg-slate-900 border-slate-800 text-slate-100'
                : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            {/* Top-right subtle close icon button */}
            <button
              type="button"
              onClick={() => setShowQrCode(false)}
              className={`absolute top-4 right-4 p-2 rounded-full transition-colors cursor-pointer ${
                isDarkMode
                  ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
              }`}
              title={language === 'en' ? 'Close' : 'Tutup'}
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header Text */}
            <h3 className={`text-base font-bold mb-1 ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
              QR Code - Sertifikasi
            </h3>
            <p className={`text-xs mb-5 text-center px-4 leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              {language === 'en'
                ? "Scan code to view Alvareza H. Pratama's Certifications"
                : 'Pindai kode untuk melihat Sertifikasi Alvareza H. Pratama'}
            </p>

            {/* QR Code Container */}
            <div className="relative bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-inner flex items-center justify-center">
              <QRCodeSVG
                value={shareableUrl}
                size={270}
                level="H"
                includeMargin={false}
                imageSettings={{
                  src: DIGITALPROFILE_QR_LOGO_SVG,
                  x: undefined,
                  y: undefined,
                  height: 34,
                  width: 102,
                  excavate: true,
                }}
              />
            </div>

            {/* Bottom Actions */}
            <div className="mt-6 flex items-center gap-2 w-full">
              <button
                type="button"
                onClick={handleCopyLink}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                  isDarkMode
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-100'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                }`}
              >
                {isCopied ? (
                  <CheckCheck className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4 text-slate-400" />
                )}
                <span>
                  {isCopied
                    ? language === 'en'
                      ? 'Copied!'
                      : 'Disalin!'
                    : language === 'en'
                    ? 'Copy Link'
                    : 'Salin Link'}
                </span>
              </button>

              <button
                type="button"
                onClick={handleDownloadCertificatesPDF}
                disabled={isDownloadingPdf}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer bg-[#0062E3] hover:bg-[#0052BF] text-white disabled:opacity-50`}
              >
                {isDownloadingPdf ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                <span>PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const CertificationView = FullPageCertificationView;
