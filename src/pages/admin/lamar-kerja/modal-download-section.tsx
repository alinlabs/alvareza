import React, { useEffect } from 'react';
import {
  FileText,
  Images,
  FolderArchive,
  Loader2,
  ArrowLeft,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useDownloadEngine, DocumentExportItem } from '../../../utils/export/useDownloadEngine';
import { useScrollLock } from '../../../utils/scrollLock';

export interface SectionDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  sectionType: 'cv' | 'surat-lamaran' | 'identitas' | 'akademik' | 'portofolio' | 'sertifikasi' | 'penghargaan';
  sectionTitle: string;
  items: DocumentExportItem[];
  isColorMode?: boolean;
  isCompressedMode?: boolean;
  onBuildCompletePdf?: (
    onProgress: (current: number, total: number, title: string) => void
  ) => Promise<Uint8Array | string>;
  isDarkMode?: boolean;
}

export const SectionDownloadModal: React.FC<SectionDownloadModalProps> = ({
  isOpen,
  onClose,
  sectionType,
  sectionTitle,
  items,
  isColorMode = true,
  isCompressedMode = true,
  onBuildCompletePdf,
  isDarkMode = false,
}) => {
  useScrollLock(isOpen, 'section-download-modal');

  const {
    isSingleItem,
    isProcessing,
    processingType,
    progressStatus,
    progressPercent,
    resetState,
    handleDownloadSingleImage,
    handleDownloadSinglePdf,
    handleDownloadImagesNonZip,
    handleDownloadFullPdf,
    handleDownloadImagesZip,
    handleDownloadPdfsZip,
  } = useDownloadEngine({
    documentCategory:
      sectionType === 'portofolio'
        ? 'portfolio'
        : sectionType === 'sertifikasi'
        ? 'certification'
        : sectionType === 'akademik'
        ? 'academic'
        : sectionType === 'identitas'
        ? 'identity'
        : sectionType === 'penghargaan'
        ? 'awards'
        : sectionType === 'surat-lamaran'
        ? 'cover-letter'
        : 'cv',
    documentTitle: sectionTitle.replace(/[\s\(\)]+/g, '_'),
    items,
    isColorMode,
    onBuildCompletePdf,
    onFinish: () => {
      setTimeout(() => {
        onClose();
      }, 800);
    },
  });

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isProcessing) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isProcessing, onClose]);

  if (!isOpen) return null;

  const displayTitle = (() => {
    switch (sectionType) {
      case 'cv':
        return 'Unduh Curriculum Vitae';
      case 'surat-lamaran':
        return 'Unduh Surat Lamaran';
      case 'identitas':
        return 'Unduh Identitas';
      case 'akademik':
        return 'Unduh Akademik';
      case 'portofolio':
        return 'Unduh Portofolio';
      case 'sertifikasi':
        return 'Unduh Sertifikasi';
      case 'penghargaan':
        return 'Unduh Piagam';
      default:
        return `Unduh ${sectionTitle}`;
    }
  })();

  const countLabel =
    items.length === 1
      ? '1 Berkas'
      : `${items.length} Lembar/Halaman`;

  const colorLabel = isColorMode ? 'Berwarna' : 'Hitam Putih';
  const compressLabel = isCompressedMode ? 'Kompresi' : 'Kualitas Penuh';
  const subText = [countLabel, colorLabel, compressLabel].filter(Boolean).join(', ');

  return (
    <AnimatePresence>
      <div
        id="section-download-modal-backdrop"
        className="fixed inset-0 z-50 bg-slate-950/40 dark:bg-black/70 backdrop-blur-md flex flex-col justify-end sm:justify-center sm:items-center p-0 sm:p-4 pt-[60px] sm:pt-0 overflow-hidden"
        onClick={(e) => {
          if (e.target === e.currentTarget && !isProcessing) {
            onClose();
          }
        }}
      >
        {/* Main Modal / Bottom Sheet Box */}
        <motion.div
          key="section-download-modal-container"
          initial={{ y: '100%', opacity: 0.8 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ duration: 0.24, ease: [0.32, 0.72, 0, 1] }}
          className="relative w-full sm:max-w-md bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-t-3xl sm:rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[calc(100vh-60px)] sm:max-h-[85vh] overflow-hidden"
        >
          {/* Header */}
          <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/90 dark:bg-slate-900/90">
            <div className="flex items-center gap-2.5 min-w-0">
              <button
                type="button"
                onClick={() => {
                  if (!isProcessing) onClose();
                }}
                disabled={isProcessing}
                className="p-1 -ml-1 text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shrink-0 disabled:opacity-40"
                title="Kembali ke Lamar Kerja"
                aria-label="Kembali ke Lamar Kerja"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="min-w-0">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 leading-tight truncate">
                  {displayTitle}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate mt-0.5">
                  {subText}
                </p>
              </div>
            </div>
          </div>

          {/* Body Cards */}
          <div className="p-4 sm:p-5 overflow-y-auto space-y-2.5">
            {/* KONDISI 1: BERKAS TUNGGAL */}
            {isSingleItem ? (
              <div className="space-y-2.5">
                {/* Card 1: Gambar Asli (.JPG) */}
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleDownloadSingleImage}
                  className={`w-full p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isProcessing && processingType !== 'single_image'
                      ? 'opacity-40 cursor-not-allowed bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800'
                      : 'bg-white dark:bg-slate-900 hover:bg-blue-50/40 dark:hover:bg-blue-950/20 border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0">
                      <Images className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        Gambar Asli
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        Format citra resolusi tinggi JPEG (tanpa arsip)
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 font-bold shrink-0">
                    .JPG
                  </span>
                </button>

                {/* Card 2: PDF (.PDF) */}
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleDownloadSinglePdf}
                  className={`w-full p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isProcessing && processingType !== 'single_pdf'
                      ? 'opacity-40 cursor-not-allowed bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800'
                      : 'bg-white dark:bg-slate-900 hover:bg-rose-50/40 dark:hover:bg-rose-950/20 border-slate-200 dark:border-slate-800 hover:border-rose-300 dark:hover:border-rose-700 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        Dokumen PDF
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        Berkas PDF resmi bertanda tangan digital PAdES
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 font-bold shrink-0">
                    .PDF
                  </span>
                </button>
              </div>
            ) : (
              /* KONDISI 2: BANYAK BERKAS (>1 ITEM) */
              <div className="space-y-2.5">
                {/* Card 1: Gambar Asli (.JPG) */}
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleDownloadImagesNonZip}
                  className={`w-full p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isProcessing && processingType !== 'images_non_zip'
                      ? 'opacity-40 cursor-not-allowed bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800'
                      : 'bg-white dark:bg-slate-900 hover:bg-blue-50/40 dark:hover:bg-blue-950/20 border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0">
                      <Images className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        Gambar Asli
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        Unduh semua gambar berurutan langsung (tanpa ZIP)
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 font-bold shrink-0">
                    .JPG
                  </span>
                </button>

                {/* Card 2: PDF Lengkap (.PDF) */}
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleDownloadFullPdf}
                  className={`w-full p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isProcessing && processingType !== 'full_pdf'
                      ? 'opacity-40 cursor-not-allowed bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800'
                      : 'bg-white dark:bg-slate-900 hover:bg-rose-50/40 dark:hover:bg-rose-950/20 border-slate-200 dark:border-slate-800 hover:border-rose-300 dark:hover:border-rose-700 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        PDF Lengkap
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        Dokumen PDF terpadu gabungan Master Dossier PAdES
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 font-bold shrink-0">
                    .PDF
                  </span>
                </button>

                {/* Card 3: Gambar Terpisah (.ZIP) */}
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleDownloadImagesZip}
                  className={`w-full p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isProcessing && processingType !== 'images_zip'
                      ? 'opacity-40 cursor-not-allowed bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800'
                      : 'bg-white dark:bg-slate-900 hover:bg-amber-50/40 dark:hover:bg-amber-950/20 border-slate-200 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-700 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
                      <FolderArchive className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        Gambar Terpisah
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        Seluruh lembar gambar dikompresi dalam arsip .zip
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 font-bold shrink-0">
                    .ZIP
                  </span>
                </button>

                {/* Card 4: PDF Terpisah (.ZIP) */}
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleDownloadPdfsZip}
                  className={`w-full p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isProcessing && processingType !== 'pdfs_zip'
                      ? 'opacity-40 cursor-not-allowed bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800'
                      : 'bg-white dark:bg-slate-900 hover:bg-amber-50/40 dark:hover:bg-amber-950/20 border-slate-200 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-700 shadow-2xs'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
                      <FolderArchive className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                        PDF Terpisah
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        Kompilasi berkas PDF individual bertanda tangan di .zip
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 font-bold shrink-0">
                    .ZIP
                  </span>
                </button>
              </div>
            )}

            {/* Progress Status Bar Box */}
            {isProcessing && (
              <div
                className={`mt-4 p-3.5 rounded-xl border animate-in fade-in ${
                  isDarkMode
                    ? 'bg-slate-950/90 border-slate-800'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-600 dark:text-blue-400 shrink-0" />
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {progressStatus || 'Sedang menyiapkan berkas...'}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400 ml-2 shrink-0">
                    {progressPercent}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SectionDownloadModal;
