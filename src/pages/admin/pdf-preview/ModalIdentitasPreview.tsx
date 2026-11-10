import React, { useState, useEffect } from 'react';
import {
  Download,
  Loader2,
  X,
  FileText,
} from 'lucide-react';
import {
  renderIdentityPagesForPreview,
  downloadIdentityDocsPdf,
  RenderedIdentityPagePreview,
} from '../../../utils/identityPdfGenerator';
import { useScrollLock } from '../../../utils/scrollLock';

export interface ModalIdentitasPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  selectedIdentityIds?: string[];
  isColorPrint?: boolean;
  isSeparatePhotoPrint?: boolean;
}

export const ModalIdentitasPreview: React.FC<ModalIdentitasPreviewProps> = ({
  isOpen,
  onClose,
  selectedIdentityIds = [],
  isColorPrint = false,
  isSeparatePhotoPrint = false,
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [renderedPages, setRenderedPages] = useState<RenderedIdentityPagePreview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useScrollLock(isOpen, 'modal-identitas-preview');

  useEffect(() => {
    if (!isOpen) return;

    if (selectedIdentityIds.length === 0) {
      setRenderedPages([]);
      setIsLoading(false);
      return;
    }

    let isCancelled = false;
    setIsLoading(true);

    renderIdentityPagesForPreview({
      selectedIds: selectedIdentityIds,
      isColorPrint,
      isSeparatePhotoPrint,
    })
      .then((pages) => {
        if (!isCancelled) {
          setRenderedPages(pages);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error rendering identity preview pages:', err);
        if (!isCancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [isOpen, selectedIdentityIds, isColorPrint, isSeparatePhotoPrint]);

  const handleDownload = async () => {
    if (selectedIdentityIds.length === 0) return;
    try {
      setIsDownloading(true);
      await downloadIdentityDocsPdf(selectedIdentityIds, isColorPrint, isSeparatePhotoPrint);
    } catch (err) {
      console.error('Failed to download identity docs:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  if (!isOpen) return null;

  const hasPhotoDocs = selectedIdentityIds.some((id) =>
    ['pas-foto-setengah-badan', 'pas-foto-4x6', 'pas-foto-3x4'].includes(id)
  );
  const hasOtherDocs = selectedIdentityIds.some(
    (id) => !['pas-foto-setengah-badan', 'pas-foto-4x6', 'pas-foto-3x4'].includes(id)
  );

  const subtitleText =
    selectedIdentityIds.length === 0
      ? '0 Berkas'
      : isSeparatePhotoPrint && hasPhotoDocs && hasOtherDocs
      ? '2 Berkas'
      : '1 Berkas';

  const downloadTooltip =
    selectedIdentityIds.length === 0
      ? 'Pilih minimal 1 dokumen identitas untuk diunduh'
      : isSeparatePhotoPrint && hasPhotoDocs && hasOtherDocs
      ? `Unduh 2 Berkas PDF: ${isColorPrint ? 'identitas-alvareza.pdf & foto-alvareza.pdf' : 'identitas-alvareza-bw.pdf & foto-alvareza-bw.pdf'}`
      : `Unduh Berkas PDF (${isColorPrint ? 'identitas-alvareza.pdf' : 'identitas-alvareza-bw.pdf'})`;

  return (
    <div
      id="modal-identitas-backdrop"
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
              PDF Preview - Dokumen Identitas
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
              {subtitleText}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleDownload}
              disabled={isDownloading || selectedIdentityIds.length === 0}
              title={downloadTooltip}
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

        {/* Modal Body: Pages */}
        <div className="flex-1 bg-slate-100/80 dark:bg-slate-950/80 p-4 sm:p-8 overflow-y-auto relative flex flex-col items-center w-full h-full">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center my-auto gap-3 py-16 text-slate-500 dark:text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              <p className="text-sm font-semibold">Memuat dokumen identitas...</p>
            </div>
          ) : renderedPages.length > 0 ? (
            <div className="w-full max-w-xl flex flex-col items-center space-y-6 pb-6">
              {renderedPages.map((page) => (
                <div
                  key={page.id}
                  className="bg-white shadow-xl rounded-sm border border-slate-200 dark:border-slate-800 w-full overflow-hidden transition-all duration-200"
                >
                  <img
                    src={page.imageUrl}
                    alt={`Dokumen Identitas - Halaman ${page.pageNum}`}
                    className="w-full h-auto block select-none"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center my-auto gap-3 py-16 text-slate-500 dark:text-slate-400 text-center">
              <FileText className="w-10 h-10 text-slate-300 dark:text-slate-600" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Tidak ada dokumen identitas yang dipilih</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 max-w-sm">
                Silakan pilih minimal satu dokumen pada laci Identitas untuk melihat pratinjau.
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
              Identitas
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
              {subtitleText}
            </span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleDownload}
              disabled={isDownloading || selectedIdentityIds.length === 0}
              title={downloadTooltip}
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
          {isLoading ? (
            <div className="flex flex-col items-center justify-center my-auto gap-3 py-12 text-slate-500 dark:text-slate-400">
              <Loader2 className="w-7 h-7 animate-spin text-blue-500" />
              <p className="text-xs font-medium">Memuat dokumen identitas...</p>
            </div>
          ) : renderedPages.length > 0 ? (
            <div className="w-full flex flex-col items-center space-y-4 pb-4">
              {renderedPages.map((page) => (
                <div
                  key={page.id}
                  className="bg-white shadow-md rounded-sm border border-slate-200 dark:border-slate-800 w-full overflow-hidden"
                >
                  <img
                    src={page.imageUrl}
                    alt={`Dokumen Identitas - Halaman ${page.pageNum}`}
                    className="w-full h-auto block select-none"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center my-auto gap-3 py-12 text-slate-500 dark:text-slate-400 text-center">
              <FileText className="w-8 h-8 text-slate-300 dark:text-slate-600" />
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">Tidak ada dokumen identitas yang dipilih</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
