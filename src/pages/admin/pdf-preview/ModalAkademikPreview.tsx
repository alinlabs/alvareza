import React, { useState, useEffect, useMemo } from 'react';
import {
  Download,
  Loader2,
  X,
  FileText,
  ExternalLink,
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
  isColorPrint?: boolean;
}

interface RenderedAcademicPage {
  id: string;
  docTitle: string;
  pageNum: number;
  totalDocPages: number;
  imageUrl: string;
}

export const ModalAkademikPreview: React.FC<ModalAkademikPreviewProps> = ({
  isOpen,
  onClose,
  selectedAcademicIds = [],
  isColorPrint = false,
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [renderedPages, setRenderedPages] = useState<RenderedAcademicPage[]>([]);
  const [isLoadingPdf, setIsLoadingPdf] = useState(true);

  // List dokumen akademik yang aktif dipilih
  const docsToRender = useMemo(() => {
    return selectedAcademicIds
      .map((id) => ALL_ACADEMIC_DOCS.find((d) => d.id === id))
      .filter((d): d is NonNullable<typeof d> => Boolean(d));
  }, [selectedAcademicIds]);

  useEffect(() => {
    if (isOpen) {
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
  }, [isOpen]);

  // Render PDF pages for all selected documents sequentially
  useEffect(() => {
    if (!isOpen) return;

    if (docsToRender.length === 0) {
      setRenderedPages([]);
      setIsLoadingPdf(false);
      return;
    }

    let isCancelled = false;

    async function loadAndRenderAllDocs() {
      setIsLoadingPdf(true);
      setRenderedPages([]);

      const allPagesAccumulator: RenderedAcademicPage[] = [];

      for (const doc of docsToRender) {
        if (isCancelled) return;

        const targetUrls = !isColorPrint
          ? [
              doc.urlBw,
              `/akademik/${doc.filenameBw}`,
              `/api/academic-pdf/${doc.id}?bw=true`,
              `/akademik-stream/${doc.id}?bw=true`,
              doc.url,
            ]
          : [
              doc.url,
              `/api/academic-pdf/${doc.id}`,
              `/akademik-stream/${doc.id}`,
              `/akademik/${doc.filename}`,
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
          continue;
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

          for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
            if (isCancelled) return;

            const page = await pdfDoc.getPage(pageNum);
            const viewport = page.getViewport({ scale: 2.0 });
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d', { willReadFrequently: true });

            if (!context) continue;

            canvas.width = viewport.width;
            canvas.height = viewport.height;

            await page.render({
              canvasContext: context,
              viewport,
              canvas,
            } as any).promise;

            if (isCancelled) return;

            // Jika mode Cetak Hitam Putih (BW / non-color), konversi pixel canvas ke grayscale murni
            if (!isColorPrint) {
              const imgData = context.getImageData(0, 0, canvas.width, canvas.height);
              const data = imgData.data;
              for (let i = 0; i < data.length; i += 4) {
                const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
                data[i] = gray;
                data[i + 1] = gray;
                data[i + 2] = gray;
              }
              context.putImageData(imgData, 0, 0);
            }

            allPagesAccumulator.push({
              id: `${doc.id}-${pageNum}`,
              docTitle: doc.title,
              pageNum,
              totalDocPages: pdfDoc.numPages,
              imageUrl: canvas.toDataURL('image/jpeg', 0.95),
            });
          }
        } catch (err) {
          console.error(`PDF.js render error for ${doc.title}:`, err);
        }
      }

      if (!isCancelled) {
        setRenderedPages(allPagesAccumulator);
        setIsLoadingPdf(false);
      }
    }

    loadAndRenderAllDocs();

    return () => {
      isCancelled = true;
    };
  }, [isOpen, docsToRender, isColorPrint]);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      await downloadAcademicDocs(selectedAcademicIds, isColorPrint);
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
      <div className="hidden sm:flex bg-white text-slate-800 rounded-2xl max-w-4xl w-full h-[90vh] shadow-2xl border border-slate-200 overflow-hidden flex-col pointer-events-auto transition-all animate-in fade-in zoom-in-95">
        {/* Header Bar */}
        <div className="bg-slate-50/80 text-slate-900 px-5 py-3 flex items-center justify-between border-b border-slate-200 shrink-0">
          <div className="flex flex-col min-w-0 pr-4">
            <h3 className="text-sm font-bold text-slate-900 leading-tight">
              PDF Preview - Dokumen Akademik
            </h3>
            <p className="text-xs text-slate-500 truncate mt-0.5">
              {renderedPages.length} Halaman • {isColorPrint ? 'Berwarna' : 'Hitam Putih'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {docsToRender.length === 1 && (
              <a
                href={docsToRender[0].url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer border border-slate-200 bg-white shadow-2xs"
                title={`Buka ${docsToRender[0].title} di tab browser baru`}
              >
                <ExternalLink className="w-5 h-5 text-slate-600" />
              </a>
            )}

            <button
              type="button"
              onClick={handleDownload}
              disabled={isDownloading || docsToRender.length === 0}
              title={
                docsToRender.length === 2
                  ? 'Unduh Berkas Gabungan (akademik-alvareza.pdf)'
                  : docsToRender.length === 1
                  ? `Unduh ${docsToRender[0].title}`
                  : 'Unduh Dokumen Akademik'
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

        {/* Modal Body: Crisp Canvas Pages */}
        <div className="flex-1 bg-slate-100/80 p-4 sm:p-8 overflow-y-auto relative flex flex-col items-center w-full h-full">
          {isLoadingPdf ? (
            <div className="flex flex-col items-center justify-center my-auto gap-3 py-16 text-slate-500">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              <p className="text-sm font-semibold">Memuat dokumen akademik resmi...</p>
            </div>
          ) : renderedPages.length > 0 ? (
            <div className="w-full max-w-2xl flex flex-col items-center space-y-6 pb-6">
              {renderedPages.map((page) => (
                <div
                  key={page.id}
                  className="bg-white shadow-xl rounded-sm border border-slate-200 w-full overflow-hidden transition-all duration-200"
                >
                  <img
                    src={page.imageUrl}
                    alt={`${page.docTitle} - Halaman ${page.pageNum}`}
                    className={`w-full h-auto block select-none ${!isColorPrint ? 'grayscale contrast-105' : ''}`}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center my-auto gap-3 py-16 text-slate-500 text-center">
              <FileText className="w-10 h-10 text-slate-300" />
              <p className="text-sm font-semibold text-slate-700">Tidak ada dokumen akademik yang dipilih</p>
              <p className="text-xs text-slate-400 max-w-sm">
                Silakan pilih minimal satu dokumen pada laci Akademik untuk melihat pratinjau.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* MOBILE BOTTOM SHEET */}
      <div className="sm:hidden w-full bg-white text-slate-800 rounded-t-3xl shadow-2xl border-t border-slate-200 max-h-[calc(100vh-60px)] h-[calc(100vh-60px)] flex flex-col overflow-hidden transition-transform duration-300 animate-in slide-in-from-bottom">
        <div className="bg-slate-50/80 text-slate-900 px-4 py-2.5 flex items-center justify-between border-b border-slate-200 shrink-0 relative">
          <div className="flex flex-col min-w-0 pr-2">
            <span className="text-sm font-bold text-slate-900 leading-tight">
              Akademik
            </span>
            <span className="text-xs text-slate-500 truncate mt-0.5">
              {renderedPages.length} Halaman • {isColorPrint ? 'Berwarna' : 'Hitam Putih'}
            </span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleDownload}
              disabled={isDownloading || docsToRender.length === 0}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer border border-slate-200 bg-white disabled:opacity-50"
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
          ) : renderedPages.length > 0 ? (
            <div className="w-full flex flex-col items-center space-y-4 pb-4">
              {renderedPages.map((page) => (
                <div
                  key={page.id}
                  className="bg-white shadow-md rounded-sm border border-slate-200 w-full overflow-hidden"
                >
                  <img
                    src={page.imageUrl}
                    alt={`${page.docTitle} - Halaman ${page.pageNum}`}
                    className={`w-full h-auto block select-none ${!isColorPrint ? 'grayscale contrast-105' : ''}`}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center my-auto gap-3 py-12 text-slate-500 text-center">
              <FileText className="w-8 h-8 text-slate-300" />
              <p className="text-xs font-semibold text-slate-700">Tidak ada dokumen yang dipilih</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
