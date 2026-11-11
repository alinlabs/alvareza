import React, { useMemo } from 'react';
import {
  X,
} from 'lucide-react';
import {
  ALL_AWARDS_LIST,
  AwardItemConfig,
} from '../../../data/penghargaan';
import { buildAwardsCompilationPdf } from '../../../utils/pdf-engine/portofolio';
import { useScrollLock } from '../../../utils/scrollLock';
import { PreviewDownloadDropdown } from './preview-download-dropdown';
import { DocumentExportItem } from '../../../utils/export/useDownloadEngine';

export interface ModalPenghargaanPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAwardIds?: string[];
  isGrayscale?: boolean;
  isCompressed?: boolean;
}

export const ModalPenghargaanPreview: React.FC<ModalPenghargaanPreviewProps> = ({
  isOpen,
  onClose,
  selectedAwardIds = [],
  isGrayscale = false,
  isCompressed = true,
}) => {
  useScrollLock(isOpen, 'modal-penghargaan-preview');

  // Hanya menampilkan sertifikat/penghargaan yang dipilih pengguna sesuai urutan klik / seleksi
  const displayAwards = useMemo(() => {
    return selectedAwardIds
      .map((id) => ALL_AWARDS_LIST.find((a) => a.id === id))
      .filter((a): a is AwardItemConfig => Boolean(a));
  }, [selectedAwardIds]);

  const exportItems: DocumentExportItem[] = useMemo(() => {
    return displayAwards.map((award) => ({
      id: award.id,
      title: award.title,
      src: `/penghargaan/${award.filename}`,
      filename: award.filename,
      isPortrait: award.isPortrait,
    }));
  }, [displayAwards]);

  if (!isOpen) return null;

  return (
    <div
      id="modal-awards-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/30 dark:bg-slate-950/70 backdrop-blur-md w-full h-full min-h-[100dvh] flex flex-col justify-end sm:justify-center sm:items-center p-0 sm:p-4 pt-[60px] sm:pt-0 overflow-hidden"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* DESKTOP MODAL */}
      <div className="hidden sm:flex bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-2xl max-w-4xl w-full h-[90vh] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex-col pointer-events-auto transition-all animate-in fade-in zoom-in-95">
        {/* Header Bar - Tanpa Tab Filter, Hanya Informasi Dokumen Terpilih & Action Buttons */}
        <div className="bg-slate-50/80 dark:bg-slate-900/90 text-slate-900 dark:text-slate-100 px-5 py-3 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div className="flex flex-col">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-tight">
              Pratinjau Dokumen - Penghargaan
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {displayAwards.length} Dokumen Terpilih {isGrayscale ? '• Hitam Putih' : '• Berwarna'}
              {isCompressed ? ' • Kompresi' : ''}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <PreviewDownloadDropdown
              documentCategory="awards"
              documentTitle="Penghargaan_Prestasi"
              items={exportItems}
              isColorMode={!isGrayscale}
              isCompressedMode={isCompressed}
              onBuildCompletePdf={async (onProgress) => {
                onProgress(1, 1, 'Menyusun berkas penghargaan...');
                const attachment = await buildAwardsCompilationPdf({
                  selectedAwardIds: displayAwards.map((a) => a.id),
                  isGrayscale,
                  isCompressed,
                });
                return attachment?.base64 || '';
              }}
            />

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

        {/* Modal Body: MURNI GAMBAR SERTIFIKAT TERPILIH */}
        <div className="flex-1 bg-slate-100/80 dark:bg-slate-950/80 p-4 sm:p-8 overflow-y-auto relative flex flex-col items-center w-full h-full">
          {displayAwards.length === 0 ? (
            <div className="my-auto text-center py-12 text-slate-400 dark:text-slate-500">
              <p className="text-sm font-medium">Tidak ada sertifikat penghargaan yang dipilih.</p>
              <p className="text-xs mt-1">Pilih minimal 1 penghargaan di menu Lamar Kerja.</p>
            </div>
          ) : (
            <div className="w-full max-w-2xl flex flex-col items-center space-y-6 pb-6">
              {displayAwards.map((award) => {
                const imageSrc = encodeURI(`/penghargaan/${award.filename}`);

                return (
                  <div
                    key={award.id}
                    className={`bg-white shadow-lg rounded-sm border border-slate-200/90 dark:border-slate-800 w-full overflow-hidden transition-all duration-200 ${
                      isGrayscale ? 'grayscale' : ''
                    }`}
                  >
                    <img
                      src={imageSrc}
                      crossOrigin="anonymous"
                      alt={award.title}
                      className="w-full h-auto block select-none"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/penghargaan/2025-steering-committee-pkkmb.webp';
                      }}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* MOBILE BOTTOM SHEET */}
      <div className="sm:hidden w-full bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-t-3xl shadow-2xl border-t border-slate-200 dark:border-slate-800 max-h-[calc(100vh-60px)] h-[calc(100vh-60px)] flex flex-col overflow-hidden transition-transform duration-300 animate-in slide-in-from-bottom">
        <div className="bg-slate-50/80 dark:bg-slate-900/90 text-slate-900 dark:text-slate-100 px-4 py-2.5 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 shrink-0 relative">
          <div className="flex flex-col">
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-tight">
              Penghargaan
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {displayAwards.length} Dokumen {isGrayscale ? '• Hitam Putih' : '• Berwarna'}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <PreviewDownloadDropdown
              documentCategory="awards"
              documentTitle="Penghargaan_Prestasi"
              items={exportItems}
              isColorMode={!isGrayscale}
              isCompressedMode={isCompressed}
              buttonClassName="p-1.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              onBuildCompletePdf={async (onProgress) => {
                onProgress(1, 1, 'Menyusun berkas penghargaan...');
                const attachment = await buildAwardsCompilationPdf({
                  selectedAwardIds: displayAwards.map((a) => a.id),
                  isGrayscale,
                  isCompressed,
                });
                return attachment?.base64 || '';
              }}
            />

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Body */}
        <div className="flex-1 bg-slate-100/80 dark:bg-slate-950/80 p-3 overflow-y-auto relative flex flex-col items-center w-full h-full">
          {displayAwards.length === 0 ? (
            <div className="my-auto text-center py-8 text-slate-400 dark:text-slate-500">
              <p className="text-sm font-medium">Tidak ada sertifikat penghargaan yang dipilih.</p>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center space-y-4 pb-4">
              {displayAwards.map((award) => {
                const imageSrc = encodeURI(`/penghargaan/${award.filename}`);

                return (
                  <div
                    key={award.id}
                    className={`bg-white shadow-md rounded-sm border border-slate-200/90 dark:border-slate-800 w-full overflow-hidden ${
                      isGrayscale ? 'grayscale' : ''
                    }`}
                  >
                    <img
                      src={imageSrc}
                      crossOrigin="anonymous"
                      alt={award.title}
                      className="w-full h-auto block select-none"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/penghargaan/2025-steering-committee-pkkmb.webp';
                      }}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalPenghargaanPreview;
