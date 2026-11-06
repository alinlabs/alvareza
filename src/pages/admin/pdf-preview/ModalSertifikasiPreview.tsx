import React, { useState, useEffect, useMemo } from 'react';
import {
  Download,
  Loader2,
  X,
  CheckCircle2,
} from 'lucide-react';
import {
  ALL_CERTIFICATES_LIST,
  buildCertificatesCompilationPdf,
} from '../../../utils/portfolioPdfGenerator';
import { downloadBase64Pdf } from '../../../utils/gasAttachmentPreview';
import { useScrollLock } from '../../../utils/scrollLock';

export interface ModalSertifikasiPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCertIds?: string[];
  presetKey?: string;
}

export const ModalSertifikasiPreview: React.FC<ModalSertifikasiPreviewProps> = ({
  isOpen,
  onClose,
  selectedCertIds = [],
  presetKey = 'optimal',
}) => {
  const [filterMode, setFilterMode] = useState<'selected' | 'all'>('selected');
  const [isDownloading, setIsDownloading] = useState(false);

  useScrollLock(isOpen, 'modal-sertifikasi-preview');

  useEffect(() => {
    if (isOpen) {
      setFilterMode(selectedCertIds.length > 0 ? 'selected' : 'all');
    }
  }, [isOpen, selectedCertIds.length]);

  const displayCerts = useMemo(() => {
    if (filterMode === 'selected' && selectedCertIds.length > 0) {
      return ALL_CERTIFICATES_LIST.filter((c) => selectedCertIds.includes(c.id));
    }
    return ALL_CERTIFICATES_LIST;
  }, [filterMode, selectedCertIds]);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const certIds =
        selectedCertIds.length > 0
          ? selectedCertIds
          : ALL_CERTIFICATES_LIST.map((c) => c.id);

      const attachment = await buildCertificatesCompilationPdf({
        preset: presetKey,
        selectedCertIds: certIds,
      });

      if (attachment?.base64) {
        downloadBase64Pdf(
          attachment.base64,
          'sertifikasi-alvareza.pdf'
        );
      }
    } catch (err) {
      console.error('Failed to download certificates compilation PDF:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id="modal-certs-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/30 dark:bg-slate-950/70 backdrop-blur-md w-full h-full min-h-[100dvh] flex flex-col justify-end sm:justify-center sm:items-center p-0 sm:p-4 pt-[60px] sm:pt-0 overflow-hidden"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* DESKTOP MODAL */}
      <div className="hidden sm:flex bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-2xl max-w-4xl w-full h-[90vh] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex-col pointer-events-auto transition-all animate-in fade-in zoom-in-95">
        {/* Header Bar */}
        <div className="bg-slate-50/80 dark:bg-slate-900/90 text-slate-900 dark:text-slate-100 px-5 py-3 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div className="flex flex-col">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-tight">
              PDF Preview - Sertifikasi
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {displayCerts.length} Halaman
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Filter Toggle */}
            <div className="flex items-center gap-1 bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs">
              <button
                type="button"
                onClick={() => setFilterMode('selected')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  filterMode === 'selected'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                Terpilih ({selectedCertIds.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterMode('all')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  filterMode === 'all'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                Semua ({ALL_CERTIFICATES_LIST.length})
              </button>
            </div>

            <button
              type="button"
              onClick={handleDownload}
              disabled={isDownloading}
              title="Unduh Kompilasi Sertifikat Fisik Format PDF"
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

        {/* Modal Body: MURNI GAMBAR LEMBARAN KERTAS SELEBAR MODE CV - TANPA CARD WRAPPER / TEKS */}
        <div className="flex-1 bg-slate-100/80 dark:bg-slate-950/80 p-4 sm:p-8 overflow-y-auto relative flex flex-col items-center w-full h-full">
          <div className="w-full max-w-2xl flex flex-col items-center space-y-6 pb-6">
            {displayCerts.map((cert) => {
              const imageSrc = encodeURI(`/sertifikasi/${cert.filename}`);

              return (
                <div
                  key={cert.id}
                  className="bg-white shadow-lg rounded-sm border border-slate-200/90 dark:border-slate-800 w-full overflow-hidden transition-all duration-200"
                >
                  <img
                    src={imageSrc}
                    crossOrigin="anonymous"
                    alt={cert.title}
                    className="w-full h-auto block select-none"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/sertifikasi/six-sigma.webp';
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* MOBILE BOTTOM SHEET */}
      <div className="sm:hidden w-full bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-t-3xl shadow-2xl border-t border-slate-200 dark:border-slate-800 max-h-[calc(100vh-60px)] h-[calc(100vh-60px)] flex flex-col overflow-hidden transition-transform duration-300 animate-in slide-in-from-bottom">
        <div className="bg-slate-50/80 dark:bg-slate-900/90 text-slate-900 dark:text-slate-100 px-4 py-2.5 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 shrink-0 relative">
          <div className="flex flex-col">
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-tight">
              Sertifikasi
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {displayCerts.length} Halaman
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleDownload}
              disabled={isDownloading}
              className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
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

        {/* Mobile Body: Murni gambar lembar kertas sertifikat scroll ke bawah */}
        <div className="flex-1 bg-slate-100/80 dark:bg-slate-950/80 p-3 overflow-y-auto relative flex flex-col items-center w-full h-full">
          <div className="w-full flex flex-col items-center space-y-4 pb-4">
            {displayCerts.map((cert) => {
              const imageSrc = encodeURI(`/sertifikasi/${cert.filename}`);

              return (
                <div
                  key={cert.id}
                  className="bg-white shadow-md rounded-sm border border-slate-200/90 dark:border-slate-800 w-full overflow-hidden"
                >
                  <img
                    src={imageSrc}
                    crossOrigin="anonymous"
                    alt={cert.title}
                    className="w-full h-auto block select-none"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/sertifikasi/six-sigma.webp';
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
