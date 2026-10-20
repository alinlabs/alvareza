import React, { useState, useEffect, useRef } from 'react';
import {
  Download,
  Loader2,
  X,
  FileText,
  ExternalLink,
  GraduationCap,
  CheckCircle2,
} from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import { ALL_ACADEMIC_DOCS, downloadAcademicDocs } from '../../../data/academicDocs';

// Initialize PDF.js worker from reliable CDN
if (typeof window !== 'undefined' && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs`;
}

export interface ModalAkademikPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAcademicIds?: string[];
}

export const ModalAkademikPreview: React.FC<ModalAkademikPreviewProps> = ({
  isOpen,
  onClose,
  selectedAcademicIds = [],
}) => {
  const [activeTab, setActiveTab] = useState<'skl' | 'transkrip'>('skl');
  const [isDownloading, setIsDownloading] = useState(false);
  const [renderedPageImages, setRenderedPageImages] = useState<string[]>([]);
  const [isLoadingPdf, setIsLoadingPdf] = useState(true);

  useEffect(() => {
    if (isOpen) {
      if (selectedAcademicIds.length === 1) {
        setActiveTab(selectedAcademicIds[0] as 'skl' | 'transkrip');
      }

      const originalOverflow = document.body.style.overflow;
      const originalDocOverflow = document.documentElement.style.overflow;
      const originalPaddingRight = document.body.style.paddingRight;
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;

      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      if (scrollBarWidth > 0) {
        document.body.style.paddingRight = `${scrollBarWidth}px`;
      }

      return () => {
        document.body.style.overflow = originalOverflow;
        document.documentElement.style.overflow = originalDocOverflow;
        document.body.style.paddingRight = originalPaddingRight;
      };
    }
  }, [isOpen, selectedAcademicIds]);

  const activeDoc = ALL_ACADEMIC_DOCS.find((d) => d.id === activeTab) || ALL_ACADEMIC_DOCS[0];

  // Render PDF pages using PDF.js with multiple CORS and proxy fallback strategies
  useEffect(() => {
    if (!isOpen) return;
    let isCancelled = false;

    async function loadAndRenderPdf() {
      setIsLoadingPdf(true);
      setRenderedPageImages([]);

      const targetUrls = [
        activeDoc.url,
        `/api/academic-pdf/${activeTab}`,
        `/akademik-stream/${activeTab}`,
        `/akademik/${activeDoc.filename}`,
      ];

      let pdfDataBuffer: ArrayBuffer | null = null;

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
          const viewport = page.getViewport({ scale: 2.0 });
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d', { willReadFrequently: false });

          if (!context) continue;

          canvas.width = viewport.width;
          canvas.height = viewport.height;

          await page.render({
            canvasContext: context,
            viewport,
            canvas,
          } as any).promise;

          if (isCancelled) return;
          pageImages.push(canvas.toDataURL('image/jpeg', 0.95));
        }

        if (!isCancelled) {
          setRenderedPageImages(pageImages);
          setIsLoadingPdf(false);
        }
      } catch (err) {
        console.error('PDF.js render error in ModalAkademikPreview:', err);
        if (!isCancelled) {
          setIsLoadingPdf(false);
        }
      }
    }

    loadAndRenderPdf();

    return () => {
      isCancelled = true;
    };
  }, [isOpen, activeTab, activeDoc]);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const idsToDownload = selectedAcademicIds.length > 0 ? selectedAcademicIds : [activeTab];
      await downloadAcademicDocs(idsToDownload);
    } catch (err) {
      console.error('Failed to download academic docs:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id="modal-akademik-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/10 backdrop-blur-md w-full h-full min-h-[100dvh] flex flex-col justify-end sm:justify-center sm:items-center p-0 sm:p-4 pt-[60px] sm:pt-0 overflow-hidden"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* DESKTOP MODAL */}
      <div className="hidden sm:flex bg-white text-slate-800 rounded-2xl max-w-6xl w-full h-[90vh] shadow-2xl border border-slate-200 overflow-hidden flex-col pointer-events-auto transition-all animate-in fade-in zoom-in-95">
        {/* Header Bar */}
        <div className="bg-slate-50/80 text-slate-900 px-5 py-3 flex items-center justify-between border-b border-slate-200 shrink-0">
          <div className="flex flex-col">
            <h3 className="text-sm font-bold text-slate-900 leading-tight">
              PDF Preview - Akademik
            </h3>
            <p className="text-xs text-slate-500">
              {renderedPageImages.length || 1} Halaman
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Tabs Selector in Header */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
              {ALL_ACADEMIC_DOCS.map((doc) => {
                const isActive = activeTab === doc.id;
                const isSelectedInApply = selectedAcademicIds.includes(doc.id);
                return (
                  <button
                    key={doc.id}
                    type="button"
                    onClick={() => setActiveTab(doc.id as 'skl' | 'transkrip')}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <span>{doc.title}</span>
                    {isSelectedInApply && (
                      <CheckCircle2
                        className={`w-3 h-3 ${isActive ? 'text-blue-100' : 'text-blue-600'}`}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            <a
              href={activeDoc.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer border border-slate-200 bg-white shadow-2xs"
              title="Buka PDF di tab browser baru"
            >
              <ExternalLink className="w-5 h-5 text-slate-600" />
            </a>

            <button
              type="button"
              onClick={handleDownload}
              disabled={isDownloading}
              title={
                selectedAcademicIds.length === 2
                  ? 'Unduh Berkas Gabungan (akademik-alvareza.pdf)'
                  : `Unduh ${activeDoc.title}`
              }
              aria-label="Unduh PDF"
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50 border border-slate-200 bg-white shadow-2xs"
            >
              {isDownloading ? (
                <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
              ) : (
                <Download className="w-5 h-5" />
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              title="Tutup Pratinjau & Kembali ke Lamar Kerja"
              aria-label="Tutup"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Crisp Canvas Pages or Native Embed Fallback */}
        <div className="flex-1 bg-slate-100/80 p-4 sm:p-8 overflow-y-auto relative flex flex-col items-center w-full h-full">
          {isLoadingPdf ? (
            <div className="flex flex-col items-center justify-center my-auto gap-3 py-16 text-slate-500">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              <p className="text-sm font-semibold">Memuat dokumen akademik resmi...</p>
            </div>
          ) : renderedPageImages.length > 0 ? (
            <div className="w-full max-w-3xl flex flex-col items-center space-y-6 pb-6">
              {renderedPageImages.map((pageImg, idx) => (
                <div
                  key={idx}
                  className="bg-white shadow-xl rounded-sm border border-slate-200 w-full overflow-hidden transition-all duration-200"
                >
                  <img
                    src={pageImg}
                    alt={`${activeDoc.title} - Halaman ${idx + 1}`}
                    className="w-full h-auto block select-none"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
              <iframe
                src={`${activeDoc.url}#view=FitH&toolbar=0`}
                title={activeDoc.title}
                className="w-full h-full border-none"
              />
            </div>
          )}
        </div>
      </div>

      {/* MOBILE BOTTOM SHEET */}
      <div className="sm:hidden w-full bg-white text-slate-800 rounded-t-3xl shadow-2xl border-t border-slate-200 max-h-[calc(100vh-60px)] h-[calc(100vh-60px)] flex flex-col overflow-hidden transition-transform duration-300 animate-in slide-in-from-bottom">
        <div className="bg-slate-50/80 text-slate-900 px-4 py-2.5 flex items-center justify-between border-b border-slate-200 shrink-0 relative">
          <div className="flex flex-col">
            <span className="text-sm font-bold text-slate-900 leading-tight">
              PDF Preview - Akademik
            </span>
            <span className="text-xs text-slate-500">
              {renderedPageImages.length || 1} Halaman
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() =>
                setActiveTab((prev) => (prev === 'skl' ? 'transkrip' : 'skl'))
              }
              className="px-2 py-1 text-xs font-semibold bg-white border border-slate-200 rounded-lg text-slate-700 shadow-2xs cursor-pointer"
            >
              Ganti ({activeTab === 'skl' ? 'Transkrip' : 'SKL'})
            </button>

            <button
              type="button"
              onClick={handleDownload}
              disabled={isDownloading}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer border border-slate-200 bg-white"
            >
              {isDownloading ? (
                <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
              ) : (
                <Download className="w-5 h-5" />
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 bg-slate-100/80 p-3 overflow-y-auto relative flex flex-col items-center w-full h-full">
          {isLoadingPdf ? (
            <div className="flex flex-col items-center justify-center my-auto gap-3 py-12 text-slate-500">
              <Loader2 className="w-7 h-7 animate-spin text-blue-500" />
              <p className="text-xs font-medium">Memuat dokumen...</p>
            </div>
          ) : renderedPageImages.length > 0 ? (
            <div className="w-full flex flex-col items-center space-y-4 pb-4">
              {renderedPageImages.map((pageImg, idx) => (
                <div
                  key={idx}
                  className="bg-white shadow-md rounded-sm border border-slate-200 w-full overflow-hidden"
                >
                  <img
                    src={pageImg}
                    alt={`${activeDoc.title} - Halaman ${idx + 1}`}
                    className="w-full h-auto block select-none"
                  />
                </div>
              ))}
            </div>
          ) : (
            <iframe
              src={`${activeDoc.url}#view=FitH`}
              title={activeDoc.title}
              className="w-full h-full border-none bg-white rounded-lg"
            />
          )}
        </div>
      </div>
    </div>
  );
};
