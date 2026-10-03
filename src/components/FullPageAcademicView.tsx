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
import * as pdfjsLib from 'pdfjs-dist';
import { ALL_ACADEMIC_DOCS, downloadAcademicDocs } from '../data/academicDocs';
import { useMetaTags } from '../hooks/useMetaTags';

// Initialize PDF.js worker from reliable CDN
if (typeof window !== 'undefined' && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs`;
}

// Embedded vector SVG badge for MyCivy logo inside the QR Code
const MYCIVY_QR_LOGO_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 32" width="96" height="32">
  <rect width="96" height="32" rx="6" fill="#ffffff"/>
  <text x="48" y="16" text-anchor="middle" dominant-baseline="central" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="16.5" font-weight="900" letter-spacing="-0.3">
    <tspan fill="#0062E3">My</tspan><tspan fill="#0F172A">Civy</tspan>
  </text>
</svg>`
)}`;

export function resolveAcademicDocFromUrl(): 'skl' | 'transkrip' {
  if (typeof window === 'undefined') return 'skl';
  const pathname = window.location.pathname.replace(/^\/+/, '').trim().toLowerCase();
  const search = window.location.search.toLowerCase();
  const params = new URLSearchParams(window.location.search);

  if (pathname.includes('transkrip') || search.includes('transkrip')) {
    return 'transkrip';
  }
  if (pathname.includes('skl') || search.includes('skl')) {
    return 'skl';
  }

  const queryVal = (
    params.get('') ||
    params.get('doc') ||
    params.get('type') ||
    params.get('id') ||
    params.get('p') ||
    ''
  )
    .toLowerCase()
    .trim();

  if (queryVal === 'transkrip' || queryVal.includes('transkrip')) {
    return 'transkrip';
  }
  return 'skl';
}

interface FullPageAcademicViewProps {
  initialDocId?: 'skl' | 'transkrip';
}

export const FullPageAcademicView: React.FC<FullPageAcademicViewProps> = ({
  initialDocId,
}) => {
  const [activeDocId, setActiveDocId] = useState<'skl' | 'transkrip'>(() => {
    return initialDocId || resolveAcademicDocFromUrl();
  });

  // Dark Mode preference
  const getInitialIsDark = (): boolean => {
    if (typeof window === 'undefined') return true;
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
    return true; // Default dark mode
  };

  const [isDarkMode, setIsDarkMode] = useState<boolean>(getInitialIsDark);
  const [isDownloading, setIsDownloading] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
  const [showQrCode, setShowQrCode] = useState(false);

  // PDF Canvas Rendering State (Zero Chrome CORS & iframe blocking)
  const [renderedPageImages, setRenderedPageImages] = useState<string[]>([]);
  const [isLoadingPdf, setIsLoadingPdf] = useState(true);
  const [blobPdfUrl, setBlobPdfUrl] = useState<string | null>(null);

  // Active Document Object
  const currentDoc = useMemo(() => {
    return (
      ALL_ACADEMIC_DOCS.find((d) => d.id === activeDocId) || ALL_ACADEMIC_DOCS[0]
    );
  }, [activeDocId]);

  // Load and render PDF using PDF.js with CORS & fallback
  useEffect(() => {
    let isCancelled = false;

    async function loadAndRenderPdf() {
      setIsLoadingPdf(true);
      setRenderedPageImages([]);

      // Try primary static url and proxy streaming url
      const targetUrls = [
        currentDoc.url,
        `/api/academic-pdf/${activeDocId}`,
        `/akademik-stream/${activeDocId}`,
      ];

      let pdfDataBuffer: ArrayBuffer | null = null;
      let loadedBlobUrl: string | null = null;

      for (const url of targetUrls) {
        try {
          const response = await fetch(url, {
            method: 'GET',
            mode: 'cors',
            headers: {
              Accept: 'application/pdf, */*',
            },
          });

          if (response.ok) {
            const blob = await response.blob();
            pdfDataBuffer = await blob.arrayBuffer();
            loadedBlobUrl = URL.createObjectURL(blob);
            break;
          }
        } catch (fetchErr) {
          console.warn(`Fetch error for ${url}:`, fetchErr);
        }
      }

      if (isCancelled) return;

      if (!pdfDataBuffer) {
        setIsLoadingPdf(false);
        return;
      }

      if (loadedBlobUrl) {
        setBlobPdfUrl(loadedBlobUrl);
      }

      try {
        const loadingTask = pdfjsLib.getDocument({
          data: new Uint8Array(pdfDataBuffer),
          cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/cmaps/',
          cMapPacked: true,
          standardFontDataUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/standard_fonts/',
        });

        const pdfDoc = await loadingTask.promise;
        if (isCancelled) return;

        const pageImages: string[] = [];

        for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
          const page = await pdfDoc.getPage(pageNum);
          // Scale 2.0 for Retina 2x crisp resolution
          const viewport = page.getViewport({ scale: 2.0 });
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d', { willReadFrequently: false });

          if (!context) continue;

          canvas.width = viewport.width;
          canvas.height = viewport.height;

          await page.render({
            canvasContext: context,
            viewport: viewport,
            canvas: canvas,
          } as any).promise;

          if (isCancelled) return;

          pageImages.push(canvas.toDataURL('image/png'));
        }

        if (!isCancelled) {
          setRenderedPageImages(pageImages);
          setIsLoadingPdf(false);
        }
      } catch (renderErr: any) {
        console.warn('PDF.js canvas render error, using blob fallback:', renderErr);
        if (!isCancelled) {
          setIsLoadingPdf(false);
        }
      }
    }

    loadAndRenderPdf();

    return () => {
      isCancelled = true;
      if (blobPdfUrl) {
        URL.revokeObjectURL(blobPdfUrl);
      }
    };
  }, [currentDoc, activeDocId]);

  // Sync route on popstate
  useEffect(() => {
    const handlePopState = () => {
      const doc = resolveAcademicDocFromUrl();
      setActiveDocId(doc);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Update theme preference
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

  // Copy shareable link (https://[domain]/skl or https://[domain]/transkrip)
  const handleCopyLink = async () => {
    if (typeof window === 'undefined') return;
    const shareUrl = `${window.location.origin}/${activeDocId}`;
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

  // Download active document PDF
  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    try {
      await downloadAcademicDocs([activeDocId]);
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  // Dynamic Meta Tags
  useMetaTags({
    enabled: true,
    isFullPdf: true,
    canonicalPath: `/${activeDocId}`,
    language: 'id',
  });

  const shareUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/${activeDocId}`
      : `https://mycivy.com/${activeDocId}`;

  const headerSubtitle =
    activeDocId === 'transkrip' ? 'Transkrip - MyCivy' : 'SKL - MyCivy';

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

        {/* Right Section: Theme Toggle & Share Card */}
        <div className="flex items-center gap-2 shrink-0 relative">
          {/* Theme Toggle Button (Light/Dark mode) */}
          <button
            type="button"
            onClick={toggleDarkMode}
            className={`p-2 rounded-xl transition-all cursor-pointer border flex items-center justify-center ${
              isDarkMode
                ? 'bg-slate-800 hover:bg-slate-700 border-slate-700'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
            }`}
            title={isDarkMode ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-white" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
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
              title={activeDocId === 'transkrip' ? 'Bagikan Transkrip' : 'Bagikan SKL'}
            >
              <Share2
                className={`w-4 h-4 ${isDarkMode ? 'text-white' : 'text-slate-600'}`}
              />
            </button>

            {/* Share Popup Menu Dropdown */}
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
                    {/* QR Code Option */}
                    <button
                      type="button"
                      onClick={() => {
                        setShowQrCode(true);
                        setIsShareMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-xs rounded-xl font-medium transition-colors cursor-pointer text-left ${
                        isDarkMode
                          ? 'hover:bg-slate-800 text-slate-200'
                          : 'hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <QrCode className="w-4 h-4 text-blue-500 shrink-0" />
                      <span>QR Code</span>
                    </button>

                    {/* Copy Link Option */}
                    <button
                      type="button"
                      onClick={() => {
                        handleCopyLink();
                        setIsShareMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-xs rounded-xl font-medium transition-colors cursor-pointer text-left ${
                        isDarkMode
                          ? 'hover:bg-slate-800 text-slate-200'
                          : 'hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      {copiedLink ? (
                        <>
                          <CheckCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span className="text-emerald-500">Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 text-indigo-500 shrink-0" />
                          <span>Salin Link</span>
                        </>
                      )}
                    </button>

                    {/* Download PDF Option */}
                    <button
                      type="button"
                      onClick={() => {
                        handleDownloadPdf();
                        setIsShareMenuOpen(false);
                      }}
                      disabled={isDownloading}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-xs rounded-xl font-medium transition-colors cursor-pointer text-left ${
                        isDarkMode
                          ? 'hover:bg-slate-800 text-slate-200'
                          : 'hover:bg-slate-100 text-slate-700'
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

      {/* Main Full-Page Document Canvas: Pure PDF Pages Without Any Wrapping Card Or Text */}
      <main
        className={`flex-1 ${
          isDarkMode ? 'bg-slate-950' : 'bg-slate-200'
        } p-3 sm:p-8 flex flex-col items-center justify-start w-full relative transition-colors`}
      >
        <div className="flex flex-col gap-6 sm:gap-8 items-center w-full max-w-4xl my-auto py-2">
          {/* Loading State */}
          {isLoadingPdf && (
            <div className="py-24 flex flex-col items-center justify-center text-center">
              <Loader2 className="w-9 h-9 animate-spin text-blue-500 mb-3" />
            </div>
          )}

          {/* Rendered PDF Pages */}
          {!isLoadingPdf && renderedPageImages.length > 0 && (
            <div className="w-full flex flex-col items-center gap-6 sm:gap-8">
              {renderedPageImages.map((pageDataUrl, idx) => (
                <div
                  key={idx}
                  className={`w-full bg-white rounded-xl overflow-hidden transition-all duration-200 ${
                    isDarkMode
                      ? 'shadow-2xl shadow-blue-950/40 border border-slate-800'
                      : 'shadow-xl border border-slate-300'
                  }`}
                >
                  <img
                    src={pageDataUrl}
                    alt={`${currentDoc.title} - Halaman ${idx + 1}`}
                    className="w-full h-auto block select-none"
                    loading={idx === 0 ? 'eager' : 'lazy'}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Fallback if PDF.js fails: Native Embed */}
          {!isLoadingPdf && renderedPageImages.length === 0 && (
            <div className="w-full flex-1 min-h-[85vh] flex flex-col">
              <object
                data={blobPdfUrl || currentDoc.url}
                type="application/pdf"
                className="w-full flex-1 rounded-xl min-h-[85vh] border-0"
              >
                <iframe
                  src={`${blobPdfUrl || currentDoc.url}#toolbar=0`}
                  title={currentDoc.title}
                  className="w-full flex-1 rounded-xl min-h-[85vh] border-0"
                />
              </object>
            </div>
          )}
        </div>
      </main>

      {/* QR Code Modal */}
      {showQrCode && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-hidden overscroll-contain">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/20 backdrop-blur-md transition-opacity animate-in fade-in duration-300 cursor-pointer touch-none"
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
              QR Code - {currentDoc.title}
            </h3>
            <p
              className={`text-xs mb-5 text-center px-4 leading-relaxed ${
                isDarkMode ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              Pindai kode untuk mengakses berkas digital resmi {currentDoc.title}
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
