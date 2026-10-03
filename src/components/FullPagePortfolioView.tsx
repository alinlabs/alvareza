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
import { useLanguage } from '../context/LanguageContext';
import {
  ALL_PORTFOLIO_SLIDES,
  buildAdaptivePortfolioPdf,
  getAdaptivePortfolioSlides,
} from '../utils/portfolioPdfGenerator';
import {
  ALL_ROLE_PRESETS,
  resolvePresetFromQuery,
} from '../data/rolePresetsConfig';
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
    return true; // Default to dark mode for executive portfolio
  };

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

  const [isDarkMode, setIsDarkMode] = useState<boolean>(getInitialIsDark);
  const [selectedPreset, setSelectedPreset] = useState<string>(getInitialPreset);
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
    canonicalPath: '/portofolio',
    presetCode: activePresetObj?.code || (selectedPreset !== 'all' ? selectedPreset : undefined),
    presetTitle: activePresetObj?.titleId,
    language,
  });

  // Sync URL search params with active preset and theme without page reload
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    if (!url.pathname.includes('portofolio') && !url.pathname.includes('portfolio')) {
      url.pathname = '/portofolio';
    }

    // Set or clear preset parameter (uses uppercase short code if available like HRS or OPT)
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
        ? `Executive Portfolio & Digital Solutions${presetLabel} - Alvareza Hilka Pratama | MyCivy`
        : `Portofolio Eksekutif & Solusi Digital${presetLabel} - Alvareza Hilka Pratama | MyCivy`;
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
    if (typeof window === 'undefined') return 'https://alvareza.vercel.app/portofolio';
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
    return `${origin}/portofolio${qs ? `?${qs}` : ''}`;
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

      // Generate adaptive PDF matching active preset & filtered slides
      const attachment = await buildAdaptivePortfolioPdf({
        preset: selectedPreset && selectedPreset !== 'all' ? selectedPreset : 'optimal',
        selectedSlideIds: displayedSlides.map((s) => s.id),
        onProgress: (current, total, title) => {
          setDownloadProgress({ current, total, title });
        },
      });

      // Trigger browser download
      const link = document.createElement('a');
      link.href = `data:application/pdf;base64,${attachment.base64}`;
      const code = activePresetObj?.code;
      link.download =
        selectedPreset && selectedPreset !== 'all'
          ? `Portofolio_Alvareza_Hilka_Pratama_${code || selectedPreset}.pdf`
          : 'Portofolio_Alvareza_Hilka_Pratama.pdf';
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
      text: `Lihat dokumen portofolio ${displayedSlides.length} slide Alvareza Hilka Pratama di MyCivy${presetInfo}:`,
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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
            Portofolio - MyCivy
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
              title={language === 'en' ? 'Share Portfolio' : 'Bagikan Portofolio'}
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
                        handleDownloadPortfolioPDF();
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

      {/* Main Full-Page Portfolio Canvas Body */}
      <main
        className={`flex-1 ${
          isDarkMode ? 'bg-slate-950' : 'bg-slate-200'
        } p-3 sm:p-8 flex flex-col items-center justify-start w-full relative transition-colors`}
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
