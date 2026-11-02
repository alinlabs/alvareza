import React, { useState, useEffect, useMemo } from 'react';
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
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { ALL_ACADEMIC_DOCS, downloadAcademicDocs } from '../../data/academicDocs';
import { useMetaTags } from '../../hooks/useMetaTags';
import { resolveAkademikSpesifik } from '../../utils/spesifikParamResolver';
import { MYCIVY_QR_LOGO_SVG } from './constants';

/**
 * Resolves active academic document strictly from the direct link/URL with smart tolerance & auto-correction
 */
export type AcademicDocMode = 'all' | 'skl' | 'transkrip';

/**
 * Resolves active academic document mode strictly from the direct link/URL with smart tolerance & auto-correction.
 *
 * Rules:
 * - Default full view (no &spesifik= or &spec=): Returns 'all' -> SKL and Transkrip in 1 view/PDF (SKL p.1, Transkrip p.2).
 * - Specific SKL link (&spesifik=skl or &spec=skl): Returns 'skl' -> SKL only.
 * - Specific Transkrip link (&spesifik=transkrip or &spec=trk): Returns 'transkrip' -> Transkrip only.
 */
export function resolveAcademicDocFromUrl(): AcademicDocMode {
  if (typeof window === 'undefined') return 'all';
  const pathname = window.location.pathname.replace(/^\/+/, '').trim().toLowerCase();
  const params = new URLSearchParams(window.location.search);

  // 1. Check "spec" / "spesifik" / "spesifikasi" query parameter with strict auto-correction
  const spesifikVal = params.get('spec') || params.get('spesifik') || params.get('spesifikasi');
  if (spesifikVal) {
    const clean = spesifikVal.trim().toLowerCase();
    if (clean === 'all' || clean === 'semua' || clean === 'gabungan') {
      return 'all';
    }
    const resolved = resolveAkademikSpesifik(spesifikVal);
    if (resolved) {
      return resolved;
    }
  }

  // 2. Check "doc" / "type" / "id" / "p" parameter
  const docVal = params.get('doc') || params.get('type') || params.get('id') || params.get('p');
  if (docVal) {
    const clean = docVal.trim().toLowerCase();
    if (clean === 'all' || clean === 'semua' || clean === 'gabungan') {
      return 'all';
    }
    const resolved = resolveAkademikSpesifik(docVal);
    if (resolved) {
      return resolved;
    }
  }

  // 3. Fallback for specific pathname routes
  if (pathname === 'skl' || pathname.endsWith('/skl')) {
    return 'skl';
  }
  if (
    pathname === 'transkrip' ||
    pathname.endsWith('/transkrip') ||
    pathname === 'trk' ||
    pathname.endsWith('/trk')
  ) {
    return 'transkrip';
  }

  // Default: 'all' -> SKL + Transkrip in 1 merged view & PDF
  return 'all';
}

/**
 * Parses URL flags strictly from the link:
 * - isColor: default FALSE (Hitam Putih / BW), becomes TRUE only if ?cl=true or ?color=true
 * - isOri: default FALSE (Sedikit di-kompresi), becomes TRUE only if ?q=ori or ?ori=true
 */
export function parseAcademicUrlFlags(): { isColor: boolean; isOri: boolean } {
  if (typeof window === 'undefined') return { isColor: false, isOri: false };
  const search = window.location.search.toLowerCase();
  const params = new URLSearchParams(window.location.search);

  const colorParam = params.get('cl') || params.get('color');
  const isColor =
    colorParam === 'true' ||
    colorParam === '1' ||
    search.includes('cl=true') ||
    search.includes('color=true') ||
    search.includes('warna=true');

  const qParam = params.get('q') || params.get('quality') || params.get('ori');
  const isOri =
    qParam === 'ori' ||
    qParam === 'true' ||
    search.includes('q=ori') ||
    search.includes('quality=ori') ||
    search.includes('ori=true');

  return { isColor, isOri };
}

/**
 * Constructs the canonical shareable URL preserving active link query parameters
 * Standard: https://[domain]/prev?f=a&cl=[true]&spec=[skl/trk]&q=ori
 */
export function buildAcademicShareUrl(
  docMode: AcademicDocMode,
  isColor: boolean,
  isOri: boolean
): string {
  if (typeof window === 'undefined') return `https://alvareza.app/prev?f=a`;
  const origin = window.location.origin;
  const params: string[] = ['f=a'];
  if (isColor) params.push('cl=true');
  if (docMode === 'skl') params.push('spec=skl');
  if (docMode === 'transkrip') params.push('spec=trk');
  if (isOri) params.push('q=ori');
  const qs = params.length > 0 ? `?${params.join('&')}` : '';
  return `${origin}/prev${qs}`;
}

interface FullPageAcademicViewProps {
  initialDocId?: AcademicDocMode;
}

export const FullPageAcademicView: React.FC<FullPageAcademicViewProps> = ({
  initialDocId,
}) => {
  const [activeDocMode, setActiveDocMode] = useState<AcademicDocMode>(() => {
    return initialDocId || resolveAcademicDocFromUrl();
  });

  const [isColor, setIsColor] = useState<boolean>(() => parseAcademicUrlFlags().isColor);
  const [isOri, setIsOri] = useState<boolean>(() => parseAcademicUrlFlags().isOri);

  const getInitialIsDark = (): boolean => {
    if (typeof window === 'undefined') return false;
    const params = new URLSearchParams(window.location.search);
    const themeParam = (
      params.get('theme') ||
      params.get('ui') ||
      params.get('mode') ||
      ''
    )
      .toLowerCase()
      .trim();
    let savedTheme: string | null = null;
    try {
      savedTheme = localStorage.getItem('mycivy_theme_preference');
    } catch {
      // ignore
    }

    if (themeParam === 'dark' || themeParam === 'night' || themeParam === 'gelap') {
      return true;
    }
    if (themeParam === 'light' || themeParam === 'terang' || themeParam === 'white') {
      return false;
    }
    if (savedTheme === 'dark') {
      return true;
    }
    if (savedTheme === 'light') {
      return false;
    }
    return false;
  };

  const [isDarkMode, setIsDarkMode] = useState<boolean>(getInitialIsDark);
  const [isDownloading, setIsDownloading] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
  const [showQrCode, setShowQrCode] = useState(false);

  // Filter list dokumen akademik yang ditampilkan secara urut (SKL #1, Transkrip #2)
  const docsToRender = useMemo(() => {
    if (activeDocMode === 'skl') {
      const doc = ALL_ACADEMIC_DOCS.find((d) => d.id === 'skl');
      return doc ? [doc] : [];
    }
    if (activeDocMode === 'transkrip') {
      const doc = ALL_ACADEMIC_DOCS.find((d) => d.id === 'transkrip');
      return doc ? [doc] : [];
    }
    // Mode 'all': Tampilkan SKL (Halaman 1) dan Transkrip Nilai (Halaman 2) berurutan
    const skl = ALL_ACADEMIC_DOCS.find((d) => d.id === 'skl');
    const transkrip = ALL_ACADEMIC_DOCS.find((d) => d.id === 'transkrip');
    return [skl, transkrip].filter((d): d is NonNullable<typeof d> => Boolean(d));
  }, [activeDocMode]);

  useEffect(() => {
    const handlePopState = () => {
      const docMode = resolveAcademicDocFromUrl();
      const flags = parseAcademicUrlFlags();
      setActiveDocMode(docMode);
      setIsColor(flags.isColor);
      setIsOri(flags.isOri);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('mycivy_theme_preference', next ? 'dark' : 'light');
      } catch {
        // ignore
      }
      return next;
    });
  };

  const handleCopyLink = async () => {
    if (typeof window === 'undefined') return;
    const shareUrl = buildAcademicShareUrl(activeDocMode, isColor, isOri);
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
      if (activeDocMode === 'skl') {
        await downloadAcademicDocs(['skl'], isColor);
      } else if (activeDocMode === 'transkrip') {
        await downloadAcademicDocs(['transkrip'], isColor);
      } else {
        // Mode 'all': Unduh 1 berkas PDF gabungan SKL (p.1) & Transkrip (p.2)
        await downloadAcademicDocs(['skl', 'transkrip'], isColor);
      }
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  useMetaTags({
    enabled: true,
    isFullPdf: true,
    canonicalPath: `/preview?file=akademik${
      activeDocMode === 'skl'
        ? '&spesifik=skl'
        : activeDocMode === 'transkrip'
        ? '&spesifik=transkrip'
        : ''
    }`,
    language: 'in',
  });

  const shareUrl = buildAcademicShareUrl(activeDocMode, isColor, isOri);

  const headerSubtitle =
    activeDocMode === 'transkrip'
      ? 'Transkrip Nilai Akademik - My Civy'
      : activeDocMode === 'skl'
      ? 'Surat Keterangan Lulus (SKL) - My Civy'
      : 'Dokumen Akademik (SKL & Transkrip Nilai) - My Civy';


  return (
    <div
      className={`min-h-screen ${
        isDarkMode
          ? 'bg-slate-950 text-slate-100 selection:bg-blue-900 selection:text-white'
          : 'bg-slate-200 text-slate-900 selection:bg-blue-100 selection:text-slate-900'
      } flex flex-col font-sans w-full`}
    >
      {/* Top Header Bar */}
      <header
        className={`sticky top-0 z-40 px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2 shadow-xs w-full transition-colors ${
          isDarkMode
            ? 'bg-slate-900/95 border-b border-slate-800 text-slate-100 backdrop-blur-md'
            : 'bg-white border-b border-slate-200 text-slate-900'
        }`}
      >
        {/* Left Section: Name & Document Title */}
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
            {headerSubtitle}
          </p>
        </div>

        {/* Right Section: Theme Toggle | Share Card */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 relative">
          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleDarkMode}
            className={`p-2 rounded-xl transition-all cursor-pointer border flex items-center justify-center ${
              isDarkMode
                ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-white'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
            }`}
            title={isDarkMode ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>

          {/* Vertical Separator */}
          <span className={`text-xs font-light select-none px-0.5 ${isDarkMode ? 'text-slate-700' : 'text-slate-300'}`} aria-hidden="true">
            |
          </span>

          {/* Share Button (right-pointing snout >) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsShareMenuOpen(!isShareMenuOpen)}
              className={`p-2 rounded-xl transition-colors border cursor-pointer flex items-center justify-center ${
                isDarkMode
                  ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-white'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
              }`}
              title={
                activeDocMode === 'transkrip'
                  ? 'Bagikan Transkrip'
                  : activeDocMode === 'skl'
                  ? 'Bagikan SKL'
                  : 'Bagikan Dokumen Akademik'
              }
              aria-label="Bagikan Dokumen"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="6" cy="5" r="3" />
                <circle cx="18" cy="12" r="3" />
                <circle cx="6" cy="19" r="3" />
                <line x1="8.59" y1="6.51" x2="15.42" y2="10.49" />
                <line x1="8.59" y1="17.49" x2="15.42" y2="13.51" />
              </svg>
            </button>

            {isShareMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsShareMenuOpen(false)}
                />
                <div
                  className={`absolute right-0 top-full mt-2 w-36 rounded-2xl shadow-xl border p-2 z-50 animate-in fade-in zoom-in-95 ${
                    isDarkMode
                      ? 'bg-slate-900 text-slate-100 border-slate-800 shadow-slate-950/80'
                      : 'bg-white text-slate-900 border-slate-200'
                  }`}
                >
                  <div className="space-y-0.5">
                    <button
                      type="button"
                      onClick={() => {
                        setShowQrCode(true);
                        setIsShareMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer text-left ${
                        isDarkMode
                          ? 'hover:bg-slate-800 text-slate-200'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <QrCode className="w-4 h-4 text-blue-500 shrink-0" />
                      <span>QR</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        handleCopyLink();
                        setIsShareMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer text-left ${
                        isDarkMode
                          ? 'hover:bg-slate-800 text-slate-200'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {copiedLink ? (
                          <CheckCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                        ) : (
                          <Copy className="w-4 h-4 text-indigo-500 shrink-0" />
                        )}
                        <span>{copiedLink ? 'Tersalin!' : 'Salin Link'}</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        handleDownloadPdf();
                        setIsShareMenuOpen(false);
                      }}
                      disabled={isDownloading}
                      className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer text-left ${
                        isDarkMode
                          ? 'hover:bg-slate-800 text-slate-200'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      {isDownloading ? (
                        <Loader2 className="w-4 h-4 text-blue-500 animate-spin shrink-0" />
                      ) : (
                        <Download className="w-4 h-4 text-emerald-500 shrink-0" />
                      )}
                      <span>Unduh PDF</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Full-Page View */}
      <main
        className={`flex-1 ${
          isDarkMode ? 'bg-slate-950' : 'bg-slate-200'
        } p-3 sm:p-8 flex flex-col items-center justify-start w-full relative transition-colors`}
      >
        <div className="flex flex-col gap-6 sm:gap-8 items-center w-full max-w-4xl my-auto py-2">
          {docsToRender.map((doc) => (
            <div
              key={doc.id}
              className={`w-full bg-white rounded-xl overflow-hidden transition-all duration-200 ${
                isDarkMode
                  ? 'shadow-2xl shadow-blue-950/40 border border-slate-800'
                  : 'shadow-xl border border-slate-300'
              }`}
            >
              <img
                src={doc.url}
                alt={doc.title}
                className={`w-full h-auto block select-none ${!isColor ? 'grayscale contrast-105' : ''}`}
                loading="eager"
              />
            </div>
          ))}
        </div>
      </main>

      {/* QR Code Modal */}
      {showQrCode && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-hidden overscroll-contain">
          <div
            className="fixed inset-0 bg-slate-950/20 backdrop-blur-md transition-opacity animate-in fade-in duration-300 cursor-pointer touch-none"
            onClick={() => setShowQrCode(false)}
          />

          <div
            className={`relative w-full max-w-sm sm:max-w-[380px] rounded-t-3xl sm:rounded-3xl shadow-2xl p-6 sm:p-7 z-10 flex flex-col items-center animate-in slide-in-from-bottom sm:slide-in-from-none sm:zoom-in-95 duration-300 border ${
              isDarkMode
                ? 'bg-slate-900 border-slate-800 text-slate-100'
                : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <button
              type="button"
              onClick={() => setShowQrCode(false)}
              className={`absolute top-4 right-4 p-2 rounded-full transition-colors cursor-pointer ${
                isDarkMode
                  ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
              }`}
              title="Tutup"
            >
              <X className="w-4 h-4" />
            </button>

            <h3
              className={`text-base font-bold mb-1 ${
                isDarkMode ? 'text-slate-100' : 'text-slate-900'
              }`}
            >
              QR Code - {activeDocMode === 'all' ? 'Dokumen Akademik' : docsToRender[0]?.title || 'Dokumen Akademik'}
            </h3>
            <p
              className={`text-xs mb-5 text-center px-4 leading-relaxed ${
                isDarkMode ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              Pindai kode untuk mengakses berkas digital resmi {activeDocMode === 'all' ? 'Dokumen Akademik (SKL & Transkrip Nilai)' : docsToRender[0]?.title}
            </p>


            <div className="p-4 bg-white rounded-2xl shadow-inner border border-slate-200 flex items-center justify-center">
              <QRCodeSVG
                value={shareUrl}
                size={200}
                level="H"
                includeMargin={false}
                imageSettings={{
                  src: MYCIVY_QR_LOGO_SVG,
                  x: undefined,
                  y: undefined,
                  height: 28,
                  width: 60,
                  excavate: true,
                }}
              />
            </div>

            <div className="mt-5 w-full">
              <button
                type="button"
                onClick={handleCopyLink}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                {copiedLink ? (
                  <>
                    <CheckCheck className="w-4 h-4 text-emerald-300" />
                    <span>Link Tersalin ke Clipboard</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Salin Link URL</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const AcademicView = FullPageAcademicView;
