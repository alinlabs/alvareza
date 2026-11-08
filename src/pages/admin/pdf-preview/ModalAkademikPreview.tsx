import React, { useState, useEffect, useMemo } from 'react';
import {
  Download,
  Loader2,
  X,
  FileText,
  ExternalLink,
} from 'lucide-react';
import { ALL_ACADEMIC_DOCS, downloadAcademicDocs } from '../../../data/academicDocs';
import { useScrollLock } from '../../../utils/scrollLock';

export interface ModalAkademikPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAcademicIds?: string[];
  isColorPrint?: boolean;
}

export const ModalAkademikPreview: React.FC<ModalAkademikPreviewProps> = ({
  isOpen,
  onClose,
  selectedAcademicIds = [],
  isColorPrint = false,
}) => {
  const [isDownloading, setIsDownloading] = useState(false);

  // List dokumen akademik yang aktif dipilih
  const docsToRender = useMemo(() => {
    return selectedAcademicIds
      .map((id) => ALL_ACADEMIC_DOCS.find((d) => d.id === id))
      .filter((d): d is NonNullable<typeof d> => Boolean(d));
  }, [selectedAcademicIds]);

  useScrollLock(isOpen, 'modal-akademik-preview');

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
      className="fixed inset-0 z-50 bg-slate-950/30 dark:bg-slate-950/70 backdrop-blur-md w-full h-full min-h-[100dvh] flex flex-col justify-end sm:justify-center sm:items-center p-0 sm:p-4 pt-[60px] sm:pt-0 overflow-hidden"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* DESKTOP MODAL */}
      <div className="hidden sm:flex bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-2xl max-w-4xl w-full h-[90vh] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex-col pointer-events-auto transition-all animate-in fade-in zoom-in-95">
        {/* Header Bar */}
        <div className="bg-slate-50/80 dark:bg-slate-900/90 text-slate-900 dark:text-slate-100 px-5 py-3 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div className="flex flex-col min-w-0 pr-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-tight">
              Pratinjau Dokumen Akademik
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
              {docsToRender.length} Dokumen • {isColorPrint ? 'Berwarna' : 'Hitam Putih (BW)'}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {docsToRender.length === 1 && (
              <a
                href={docsToRender[0].url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-2xs"
                title={`Buka ${docsToRender[0].title} di tab browser baru`}
              >
                <ExternalLink className="w-5 h-5 text-slate-600 dark:text-slate-300" />
              </a>
            )}

            <button
              type="button"
              onClick={handleDownload}
              disabled={isDownloading || docsToRender.length === 0}
              title={
                docsToRender.length === 2
                  ? 'Unduh Berkas Gabungan PDF (akademik-alvareza.pdf)'
                  : docsToRender.length === 1
                  ? `Unduh ${docsToRender[0].title} PDF`
                  : 'Unduh Dokumen Akademik PDF'
              }
              aria-label="Unduh PDF"
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-50 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-2xs"
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
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: High resolution WebP images */}
        <div className="flex-1 bg-slate-100/80 dark:bg-slate-950/80 p-4 sm:p-8 overflow-y-auto relative flex flex-col items-center w-full h-full">
          {docsToRender.length > 0 ? (
            <div className="w-full max-w-2xl flex flex-col items-center space-y-6 pb-6">
              {docsToRender.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-white shadow-xl rounded-sm border border-slate-200 dark:border-slate-800 w-full overflow-hidden transition-all duration-200"
                >
                  <img
                    src={doc.url}
                    alt={doc.title}
                    className={`w-full h-auto block select-none ${!isColorPrint ? 'grayscale contrast-105' : ''}`}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center my-auto gap-3 py-16 text-slate-500 dark:text-slate-400 text-center">
              <FileText className="w-10 h-10 text-slate-300 dark:text-slate-600" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Tidak ada dokumen akademik yang dipilih</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 max-w-sm">
                Silakan pilih minimal satu dokumen pada laci Akademik untuk melihat pratinjau.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* MOBILE BOTTOM SHEET */}
      <div className="sm:hidden w-full bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-t-3xl shadow-2xl border-t border-slate-200 dark:border-slate-800 max-h-[calc(100vh-60px)] h-[calc(100vh-60px)] flex flex-col overflow-hidden transition-transform duration-300 animate-in slide-in-from-bottom">
        <div className="bg-slate-50/80 dark:bg-slate-900/90 text-slate-900 dark:text-slate-100 px-4 py-2.5 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 shrink-0 relative">
          <div className="flex flex-col min-w-0 pr-2">
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-tight">
              Akademik
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
              {docsToRender.length} Dokumen • {isColorPrint ? 'Berwarna' : 'Hitam Putih (BW)'}
            </span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleDownload}
              disabled={isDownloading || docsToRender.length === 0}
              className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 disabled:opacity-50"
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
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 bg-slate-100/80 dark:bg-slate-950/80 p-3 overflow-y-auto relative flex flex-col items-center w-full h-full">
          {docsToRender.length > 0 ? (
            <div className="w-full flex flex-col items-center space-y-4 pb-4">
              {docsToRender.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-white shadow-md rounded-sm border border-slate-200 dark:border-slate-800 w-full overflow-hidden"
                >
                  <img
                    src={doc.url}
                    alt={doc.title}
                    className={`w-full h-auto block select-none ${!isColorPrint ? 'grayscale contrast-105' : ''}`}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center my-auto gap-3 py-12 text-slate-500 dark:text-slate-400 text-center">
              <FileText className="w-8 h-8 text-slate-300 dark:text-slate-600" />
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">Tidak ada dokumen yang dipilih</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
