import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Download,
  X,
  Share2,
  Copy,
  CheckCheck,
  QrCode,
  ArrowLeft,
  Loader2,
  ChevronUp,
  FileText,
  Layers,
  Award,
  Moon,
  Sun,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useLanguage } from '../../context/LanguageContext';
import { useThemeMode } from '../../hooks/useThemeMode';
import {
  ALL_PORTFOLIO_SLIDES,
  buildAdaptivePortfolioPdf,
  getAdaptivePortfolioSlides,
} from '../../utils/portfolioPdfGenerator';
import {
  ALL_ROLE_PRESETS,
  resolvePresetFromQuery,
} from '../../data/preset/RoleConfig';
import { useMetaTags } from '../../hooks/useMetaTags';
import { DIGITALPROFILE_QR_LOGO_SVG } from './constants';
import { FullViewExportMenu, FullViewExportItem } from './components/FullViewExportMenu';

interface FullPagePortfolioViewProps {
  initialPreset?: string;
  onNavigateToEditor: () => void;
  onNavigateToPdf?: () => void;
  onNavigateToCertifications?: () => void;
}

export const FullPagePortfolioView: React.FC<FullPagePortfolioViewProps> = ({
  initialPreset,
  onNavigateToEditor,
  onNavigateToPdf,
  onNavigateToCertifications,
}) => {
  const { language } = useLanguage();
  const { isDarkMode, toggleTheme } = useThemeMode();

  // Resolve initial preset from prop or URL query (?preset=HRS, ?preset=OPT, etc.)
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
  const [downloadProgress, setDownloadProgress] = useState<{ current: number; total: number; title: string } | null>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState(1);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

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

  // Integrated Meta Tags hook for Portfolio
  useMetaTags({
    pageType: 'portfolio',
    canonicalPath: '/preview?file=portofolio',
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
      url.searchParams.set('f', 'p');
      url.searchParams.delete('file');
    } else {
      url.pathname = '/preview';
      url.searchParams.set('file', 'portofolio');
      url.searchParams.delete('f');
    }
    url.searchParams.delete('pages');
    url.searchParams.delete('page');
    url.searchParams.delete('admin');

    // Set or clear preset parameter
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

  // Compute displayed slides based on selected preset
  const displayedSlides = useMemo(() => {
    if (!selectedPreset || selectedPreset === 'all') {
      return ALL_PORTFOLIO_SLIDES;
    }
    const filtered = getAdaptivePortfolioSlides(selectedPreset);
    return filtered.length > 0 ? filtered : ALL_PORTFOLIO_SLIDES;
  }, [selectedPreset]);

  // Update Page Title and Meta Tags
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const presetLabel = activePresetObj ? ` [${activePresetObj.code}]` : '';
    const title =
      language === 'en'
        ? `Executive Portfolio & Digital Solutions${presetLabel} - Alvareza Hilka Pratama | Digital Profile`
        : `Portofolio Eksekutif & Solusi Digital${presetLabel} - Alvareza Hilka Pratama | Digital Profile`;
    document.title = title;

    const desc =
      language === 'en'
        ? `Explore the curated ${displayedSlides.length}-slide executive portfolio, business domain showcase, and enterprise digital solutions of Alvareza Hilka Pratama.`
        : `Jelajahi portofolio eksekutif ${displayedSlides.length} slide terpilih, showcase domain bisnis, dan solusi digital Alvareza Hilka Pratama.`;

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', desc);

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', title);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', desc);
  }, [language, activePresetObj, displayedSlides.length]);

  // Track active slide on scroll with requestAnimationFrame to eliminate layout thrashing
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          setShowScrollTop(scrollY > 400);

          // Find currently visible slide
          for (let i = 0; i < slideRefs.current.length; i++) {
            const el = slideRefs.current[i];
            if (el) {
              const rect = el.getBoundingClientRect();
              if (rect.top <= window.innerHeight * 0.45 && rect.bottom >= window.innerHeight * 0.2) {
                setActiveSlideIndex(i + 1);
                break;
              }
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getPublicShareUrl = (): string => {
    if (typeof window === 'undefined') return 'https://alvareza.my.id/prev?f=p';
    const origin = window.location.origin;
    const params = new URLSearchParams();
    params.set('f', 'p');
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

  const handleDownloadPortfolioPDF = async () => {
    try {
      setIsDownloadingPdf(true);
      setDownloadProgress({ current: 1, total: displayedSlides.length, title: 'Inisialisasi...' });

      // Generate adaptive PDF matching active preset & filtered slides with color and compression options
      const attachment = await buildAdaptivePortfolioPdf({
        preset: selectedPreset && selectedPreset !== 'all' ? selectedPreset : 'optimal',
        selectedSlideIds: displayedSlides.map((s) => s.id),
        isCompressed: isCompressedMode,
        isGrayscale: !isColorMode,
        onProgress: (current, total, title) => {
          setDownloadProgress({ current, total, title });
        },
      });

      // Trigger browser download
      const link = document.createElement('a');
      link.href = `data:application/pdf;base64,${attachment.base64}`;
      link.download = isCompressedMode
        ? (!isColorMode ? 'portofolio-alvareza-bw-kompresi.pdf' : 'portofolio-alvareza-kompresi.pdf')
        : (!isColorMode ? 'portofolio-alvareza-bw.pdf' : 'portofolio-alvareza.pdf');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Gagal mengunduh PDF Portofolio:', error);
      alert('Terjadi kendala saat membuat PDF Portofolio. Silakan coba beberapa saat lagi.');
    } finally {
      setIsDownloadingPdf(false);
      setDownloadProgress(null);
    }
  };

  const handleNativeShare = async () => {
    const shareUrl = getPublicShareUrl();
    const presetInfo = activePresetObj ? ` (${activePresetObj.code} - ${activePresetObj.titleId})` : '';
    const shareData = {
      title: `Portofolio Eksekutif & Solusi Bisnis - Alvareza Hilka Pratama${presetInfo}`,
      text: `Lihat dokumen portofolio ${displayedSlides.length} slide Alvareza Hilka Pratama di Digital Profile${presetInfo}:`,
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
    return displayedSlides.map((slide) => ({
      id: slide.id,
      title: slide.title,
      src: `/portofolio/${slide.filename}`,
      filename: slide.filename,
      isPortrait: false,
    }));
  }, [displayedSlides]);

  const shareableUrl = getPublicShareUrl();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
            Portofolio - Digital Profile
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
            documentCategory="portfolio"
            documentTitle="Portofolio_Eksekutif"
            shareableUrl={shareableUrl}
            isDarkMode={isDarkMode}
            isColorMode={isColorMode}
            items={exportItems}
            onOpenQrCode={() => setShowQrCode(true)}
            onBuildCompletePdf={async (onProgress) => {
              const result = await buildAdaptivePortfolioPdf({
                preset: selectedPreset,
                selectedSlideIds: displayedSlides.map((s) => s.id),
                isCompressed: false,
                isGrayscale: !isColorMode,
                onProgress: (curr, tot, tit) => onProgress(curr, tot, tit),
              });
              return result.base64;
            }}
          />
        </div>
      </header>

      {/* Main Full-Page Portfolio Canvas Body */}
      <main
        className={`flex-1 overflow-y-auto ${
          isDarkMode ? 'bg-slate-950' : 'bg-slate-200'
        } px-3 sm:px-8 py-6 flex flex-col items-center justify-start w-full relative transition-colors`}
      >
        <div className="flex flex-col gap-6 sm:gap-8 items-center w-full max-w-4xl my-auto py-2">
          {displayedSlides.map((slide, index) => {
            const isFirstTwo = index < 2;
            const imageSrc = `/portofolio/${slide.filename}`;

            return (
              <div
                key={slide.id}
                ref={(el) => (slideRefs.current[index] = el)}
                className={`w-full bg-white rounded-lg overflow-hidden transition-all scroll-mt-20 ${
                  isDarkMode
                    ? 'shadow-2xl shadow-blue-950/40 border border-slate-800'
                    : 'shadow-xl border border-slate-300'
                }`}
                id={`slide-${index + 1}`}
              >
                <img
                  src={imageSrc}
                  alt={`Slide ${index + 1}: ${slide.title}`}
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

      {/* Responsive Bottom Sheet / Modal QR Code Overlay (Identical to FullPagePdfView) */}
      {showQrCode && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-hidden overscroll-contain">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/10 backdrop-blur-md transition-opacity animate-in fade-in duration-300 cursor-pointer touch-none"
            onClick={() => setShowQrCode(false)}
          />
          {/* Container (Sheet on mobile, centered Modal on desktop) */}
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
              QR Code - Portofolio
            </h3>
            <p className={`text-xs mb-5 text-center px-4 leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              {language === 'en'
                ? "Scan code to view Alvareza H. Pratama's Portfolio"
                : 'Pindai kode untuk melihat Portofolio Alvareza H. Pratama'}
            </p>

            {/* QR Code Container with Centered Embedded SVG Logo */}
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
                      ? 'Link Copied!'
                      : 'Link Disalin!'
                    : language === 'en'
                    ? 'Copy Link'
                    : 'Salin Link'}
                </span>
              </button>

              <button
                type="button"
                onClick={handleDownloadPortfolioPDF}
                disabled={isDownloadingPdf}
                className="py-2.5 px-4 rounded-xl bg-[#0062E3] hover:bg-[#0052BF] text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer disabled:opacity-75"
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

export const PortfolioView = FullPagePortfolioView;
