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
import { useLanguage } from '../context/LanguageContext';
import { CVCertification } from '../types';
import {
  ALL_ROLE_PRESETS,
  resolvePresetFromQuery,
} from '../data/rolePresetsConfig';
import {
  getItemSelectionForPreset,
  getPresetSectionOrders,
} from '../data/presetItemSelections';
import { buildCertificatesCompilationPdf } from '../utils/portfolioPdfGenerator';
import { useMetaTags } from '../hooks/useMetaTags';

// Embedded vector SVG badge for MyCivy logo inside the QR Code
const MYCIVY_QR_LOGO_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 32" width="96" height="32">
  <rect width="96" height="32" rx="6" fill="#ffffff"/>
  <text x="48" y="16" text-anchor="middle" dominant-baseline="central" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="16.5" font-weight="900" letter-spacing="-0.3">
    <tspan fill="#0062E3">My</tspan><tspan fill="#0F172A">Civy</tspan>
  </text>
</svg>`
)}`;

// Mapping certification ID to image filename in /public/sertifikasi
export const CERTIFICATION_IMAGES: Record<string, string> = {
  'cert-5': '/sertifikasi/Six Sigma.jpg',
  'cert-3': '/sertifikasi/HRM Saylor.jpg',
  'cert-2': '/sertifikasi/OPM Saylor.jpg',
  'cert-4': '/sertifikasi/MIS Saylor.jpg',
  'cert-1': '/sertifikasi/HR MICP.jpg',
  'cert-6': '/sertifikasi/Google Analytics.jpg',
  'cert-7': '/sertifikasi/Google Ads Search.jpg',
  'cert-8': '/sertifikasi/Google Web.jpg',
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

  // Check initial dark theme mode: default is Dark Mode, unless user chose light
  const getInitialIsDark = (): boolean => {
    if (typeof window === 'undefined') return true;
    const params = new URLSearchParams(window.location.search);
    const themeParam = (params.get('theme') || params.get('ui') || params.get('mode') || '').toLowerCase().trim();
    let savedTheme: string | null = null;
    try {
      savedTheme = localStorage.getItem('mycivy_theme_preference');
    } catch {
      // ignore
    }

    if (themeParam === 'light' || themeParam === 'terang' || themeParam === 'white') {
      return false;
    }
    if (themeParam === 'dark' || themeParam === 'night' || themeParam === 'gelap') {
      return true;
    }
    if (savedTheme === 'light') {
      return false;
    }
    if (savedTheme === 'dark') {
      return true;
    }
    return true; // Default to dark mode for certified presentation
  };

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

  const [isDarkMode, setIsDarkMode] = useState<boolean>(getInitialIsDark);
  const [selectedPreset, setSelectedPreset] = useState<string>(getInitialPreset);
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
  const [showQrCode, setShowQrCode] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [selectedCert, setSelectedCert] = useState<CVCertification | null>(null);

  // Synchronize on popstate (browser back / forward button)
  useEffect(() => {
    const handlePopState = () => {
      setSelectedPreset(getInitialPreset());
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
    canonicalPath: '/sertifikasi',
    presetCode: activePresetObj?.code || (selectedPreset !== 'all' ? selectedPreset : undefined),
    presetTitle: activePresetObj?.titleId,
    language,
  });

  // Sync URL search params with active preset and theme without page reload
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    if (
      !url.pathname.includes('sertifikasi') &&
      !url.pathname.includes('sertifikat') &&
      !url.pathname.includes('certification')
    ) {
      url.pathname = '/sertifikasi';
    }

    // Set or clear preset parameter (uses uppercase short code if available like OPT or HRS)
    if (selectedPreset && selectedPreset !== 'all') {
      const code = activePresetObj?.code || selectedPreset;
      url.searchParams.set('preset', code);
    } else {
      url.searchParams.delete('preset');
    }

    // Clean URL: dark mode is default! Only write theme=light if user switched to light
    if (!isDarkMode) {
      url.searchParams.set('theme', 'light');
    } else {
      url.searchParams.delete('theme');
      url.searchParams.delete('ui');
    }

    window.history.replaceState({}, '', url.toString());
  }, [selectedPreset, activePresetObj, isDarkMode]);

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
        ? `Professional Certifications & Licenses${presetLabel} - Alvareza Hilka Pratama | MyCivy`
        : `Sertifikasi Profesi & Lisensi${presetLabel} - Alvareza Hilka Pratama | MyCivy`;
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
    if (typeof window === 'undefined') return 'https://alvareza.vercel.app/sertifikasi';
    const origin = window.location.origin;
    const params = new URLSearchParams();
    if (selectedPreset && selectedPreset !== 'all') {
      const code = activePresetObj?.code || selectedPreset;
      params.set('preset', code);
    }
    if (isDarkMode) {
      params.set('theme', 'dark');
    }
    const qs = params.toString();
    return `${origin}/sertifikasi${qs ? `?${qs}` : ''}`;
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
      });

      const link = document.createElement('a');
      link.href = `data:application/pdf;base64,${attachment.base64}`;
      const code = activePresetObj?.code;
      link.download =
        selectedPreset && selectedPreset !== 'all'
          ? `Sertifikasi_Alvareza_Hilka_Pratama_${code || selectedPreset}.pdf`
          : 'Sertifikasi_Alvareza_Hilka_Pratama.pdf';
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
      text: `Lihat dokumen sertifikasi dan lisensi resmi Alvareza Hilka Pratama di MyCivy${presetInfo}:`,
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

  const shareableUrl = getPublicShareUrl();

  return (
    <div
      className={`min-h-screen ${
        isDarkMode
          ? 'bg-slate-950 text-slate-100 selection:bg-blue-900 selection:text-white'
          : 'bg-slate-200 text-slate-900 selection:bg-blue-100 selection:text-slate-900'
      } flex flex-col font-sans w-full`}
    >
      {/* Top Standalone Header Bar */}
      <header
        className={`sticky top-0 z-40 px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2 shadow-xs w-full transition-colors ${
          isDarkMode
            ? 'bg-slate-900/95 border-b border-slate-800 text-slate-100 backdrop-blur-md'
            : 'bg-white border-b border-slate-200 text-slate-900'
        }`}
      >
        {/* Left Section: Title */}
        <div className="flex flex-col min-w-0">
          <h1 className={`text-sm sm:text-base font-bold truncate leading-tight ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
            Alvareza H. Pratama
          </h1>
          <p className={`text-[10px] sm:text-xs font-medium truncate leading-tight ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Sertifikasi - MyCivy
          </p>
        </div>

        {/* Right Section: Theme Toggle & Share Card */}
        <div className="flex items-center gap-2 shrink-0 relative">
          {/* Theme Toggle Button (Light/Dark mode) */}
          <button
            type="button"
            onClick={() => {
              const nextMode = !isDarkMode;
              setIsDarkMode(nextMode);
              try {
                localStorage.setItem('mycivy_theme_preference', nextMode ? 'dark' : 'light');
              } catch {
                // ignore
              }
            }}
            className={`p-2 rounded-xl transition-all cursor-pointer border flex items-center justify-center ${
              isDarkMode
                ? 'bg-slate-800 hover:bg-slate-700 border-slate-700'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
            }`}
            title={
              isDarkMode
                ? 'Ganti ke Mode Terang (theme=light)'
                : 'Ganti ke Mode Gelap (default)'
            }
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-white" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Share Card Button & Popup Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsShareMenuOpen(!isShareMenuOpen)}
              className={`p-2 rounded-xl transition-colors border cursor-pointer relative ${
                isDarkMode
                  ? 'bg-slate-800 hover:bg-slate-700 border-slate-700'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
              }`}
              title={language === 'en' ? 'Share Certifications' : 'Bagikan Sertifikasi'}
            >
              <Share2 className={`w-4 h-4 ${isDarkMode ? 'text-white' : 'text-slate-600'}`} />
            </button>

            {/* Share Popup Menu Dropdown */}
            {isShareMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsShareMenuOpen(false)}
                />
                <div
                  className={`absolute right-0 top-full mt-2 w-32 rounded-2xl shadow-xl border p-2 z-50 animate-in fade-in zoom-in-95 ${
                    isDarkMode
                      ? 'bg-slate-900 text-slate-100 border-slate-800 shadow-slate-950/80'
                      : 'bg-white text-slate-900 border-slate-200'
                  }`}
                >
                  <div className="space-y-0.5">
                    {/* QR Code Option */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsShareMenuOpen(false);
                        setShowQrCode(true);
                      }}
                      className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer text-left ${
                        isDarkMode
                          ? 'hover:bg-slate-800 text-slate-200'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <QrCode className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>QR</span>
                    </button>

                    {/* Copy Link Option */}
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer text-left ${
                        isDarkMode
                          ? 'hover:bg-slate-800 text-slate-200'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {isCopied ? (
                          <CheckCheck className="w-4 h-4 text-green-500 shrink-0" />
                        ) : (
                          <Copy className="w-4 h-4 text-slate-400 shrink-0" />
                        )}
                        <span>
                          {isCopied
                            ? language === 'en'
                              ? 'Copied!'
                              : 'Disalin!'
                            : 'Link'}
                        </span>
                      </div>
                    </button>

                    {/* Download PDF Option */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsShareMenuOpen(false);
                        handleDownloadCertificatesPDF();
                      }}
                      className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer text-left ${
                        isDarkMode
                          ? 'hover:bg-slate-800 text-slate-200'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <Download className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>PDF</span>
                    </button>

                    {/* Lainnya Option */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsShareMenuOpen(false);
                        handleNativeShare();
                      }}
                      className={`w-full flex items-center p-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer text-left ${
                        isDarkMode
                          ? 'hover:bg-slate-800 text-slate-200'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span>{language === 'en' ? 'More' : 'Lainnya'}</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Full-Page Certification Content Canvas Body */}
      <main
        className={`flex-1 ${
          isDarkMode ? 'bg-slate-950' : 'bg-slate-200'
        } p-3 sm:p-8 flex flex-col items-center justify-start w-full relative transition-colors`}
      >
        <div className="flex flex-col gap-6 sm:gap-8 items-center w-full max-w-4xl my-auto py-2">
          {/* Subtle Notice Text */}
          <div className="w-full text-center -mb-3 sm:-mb-5">
            <p className={`text-[11px] sm:text-xs font-normal tracking-wide select-none ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
              {language === 'en' ? 'Tap to View Certification Details' : 'Ketuk Untuk Melihat Detail Sertifikasi'}
            </p>
          </div>

          {displayedCertifications.map((cert, index) => {
            const imageSrc = CERTIFICATION_IMAGES[cert.id] || `/sertifikasi/${cert.title}.jpg`;
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
                  className="w-full h-auto block select-none"
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
              {/* Level / Badge if present */}
              {selectedCert.level && (
                <div>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold text-white bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 shadow-sm border border-amber-400/40">
                    <span>{selectedCert.level}</span>
                    <Star className="w-3.5 h-3.5 text-white fill-white shrink-0" />
                  </span>
                </div>
              )}

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
                  src: MYCIVY_QR_LOGO_SVG,
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
