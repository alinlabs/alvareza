import React, { useState, useRef, useEffect } from 'react';
import {
  Download,
  FileText,
  Images,
  FolderArchive,
  Loader2,
} from 'lucide-react';
import { useDownloadEngine, DocumentExportItem } from '../../../utils/export/useDownloadEngine';

export interface PreviewDownloadDropdownProps {
  documentCategory?: 'awards' | 'certification' | 'portfolio' | 'academic' | 'identity' | 'cv' | 'cover-letter';
  documentTitle: string;
  items: DocumentExportItem[];
  isColorMode?: boolean;
  isCompressedMode?: boolean;
  onBuildCompletePdf?: (
    onProgress: (current: number, total: number, title: string) => void
  ) => Promise<Uint8Array | string>;
  isDarkMode?: boolean;
  buttonClassName?: string;
  iconClassName?: string;
  dropdownAlign?: 'right' | 'left';
}

export const PreviewDownloadDropdown: React.FC<PreviewDownloadDropdownProps> = ({
  documentCategory,
  documentTitle,
  items,
  isColorMode = true,
  onBuildCompletePdf,
  isDarkMode = false,
  buttonClassName,
  iconClassName = 'w-5 h-5',
  dropdownAlign = 'right',
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

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
    documentCategory,
    documentTitle,
    items,
    isColorMode,
    onBuildCompletePdf,
    onFinish: () => {
      setIsOpen(false);
    },
  });

  // Auto close on outside click or Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        if (!isProcessing) {
          setIsOpen(false);
          resetState();
        }
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isProcessing) {
        setIsOpen(false);
        resetState();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, isProcessing]);

  const defaultBtnClass = `p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-2xs flex items-center justify-center ${
    isOpen ? 'ring-2 ring-blue-500' : ''
  }`;

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => {
          if (items.length === 0) return;
          if (isOpen && !isProcessing) {
            setIsOpen(false);
            resetState();
          } else if (!isOpen) {
            setIsOpen(true);
          }
        }}
        disabled={items.length === 0}
        title={
          items.length === 0
            ? 'Tidak ada berkas untuk diunduh'
            : isSingleItem
            ? 'Pilihan Unduh Berkas'
            : 'Pilihan Unduh Dokumen (JPG, PDF, ZIP)'
        }
        aria-label="Pilihan Unduh Dokumen"
        aria-expanded={isOpen}
        className={buttonClassName || defaultBtnClass}
      >
        <Download className={iconClassName} />
      </button>

      {/* Dropdown Popup Menu (Layer 2) */}
      {isOpen && (
        <>
          {/* Invisible Backdrop to capture clicks outside */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => {
              if (!isProcessing) {
                setIsOpen(false);
                resetState();
              }
            }}
          />

          <div
            className={`absolute ${
              dropdownAlign === 'right' ? 'right-0' : 'left-0'
            } top-full mt-2 w-56 sm:w-60 rounded-2xl shadow-2xl border p-2 z-50 transition-all duration-200 animate-in fade-in zoom-in-95 ${
              isDarkMode
                ? 'bg-slate-900 text-slate-100 border-slate-800 shadow-slate-950/80'
                : 'bg-white text-slate-900 border-slate-200 shadow-xl'
            }`}
          >
            {/* Header Submenu */}
            <div
              className={`flex items-center justify-between pb-2 mb-1 border-b px-2 ${
                isDarkMode ? 'border-slate-800 text-slate-200' : 'border-slate-100 text-slate-700'
              }`}
            >
              <span className="text-xs font-bold truncate">
                {isSingleItem ? 'Unduh Berkas' : 'Pilihan Unduh'}
              </span>
              <span className="text-[10px] font-medium text-slate-400">
                {items.length} {items.length === 1 ? 'Berkas' : 'Lembar'}
              </span>
            </div>

            {/* KONDISI 1: BERKAS TUNGGAL (1 ITEM) */}
            {isSingleItem ? (
              <div className="space-y-1">
                {/* Opsi 1: Gambar Asli (.JPG) */}
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleDownloadSingleImage}
                  className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left transition-colors cursor-pointer ${
                    isProcessing && processingType !== 'single_image'
                      ? 'opacity-40 cursor-not-allowed'
                      : isDarkMode
                      ? 'hover:bg-slate-800 text-slate-200'
                      : 'hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500 shrink-0">
                    <Images className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1 flex items-center justify-between">
                    <span className="text-xs font-semibold truncate">Gambar Asli</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 font-bold shrink-0 ml-1">
                      .JPG
                    </span>
                  </div>
                </button>

                {/* Opsi 2: PDF (.PDF) */}
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleDownloadSinglePdf}
                  className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left transition-colors cursor-pointer ${
                    isProcessing && processingType !== 'single_pdf'
                      ? 'opacity-40 cursor-not-allowed'
                      : isDarkMode
                      ? 'hover:bg-slate-800 text-slate-200'
                      : 'hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-500 dark:text-rose-400 shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1 flex items-center justify-between">
                    <span className="text-xs font-semibold truncate">PDF</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 font-bold shrink-0 ml-1">
                      .PDF
                    </span>
                  </div>
                </button>
              </div>
            ) : (
              /* KONDISI 2: BANYAK BERKAS (> 1 ITEM) */
              <div className="space-y-1">
                {/* Opsi 1: Gambar Asli (.JPG) */}
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleDownloadImagesNonZip}
                  className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left transition-colors cursor-pointer ${
                    isProcessing && processingType !== 'images_non_zip'
                      ? 'opacity-40 cursor-not-allowed'
                      : isDarkMode
                      ? 'hover:bg-slate-800 text-slate-200'
                      : 'hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500 shrink-0">
                    <Images className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1 flex items-center justify-between">
                    <span className="text-xs font-semibold truncate">Gambar Asli</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 font-bold shrink-0 ml-1">
                      .JPG
                    </span>
                  </div>
                </button>

                {/* Opsi 2: PDF Lengkap (.PDF) */}
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleDownloadFullPdf}
                  className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left transition-colors cursor-pointer ${
                    isProcessing && processingType !== 'full_pdf'
                      ? 'opacity-40 cursor-not-allowed'
                      : isDarkMode
                      ? 'hover:bg-slate-800 text-slate-200'
                      : 'hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-500 dark:text-rose-400 shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1 flex items-center justify-between">
                    <span className="text-xs font-semibold truncate">PDF Lengkap</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 font-bold shrink-0 ml-1">
                      .PDF
                    </span>
                  </div>
                </button>

                {/* Opsi 3: Gambar Terpisah (.ZIP) */}
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleDownloadImagesZip}
                  className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left transition-colors cursor-pointer ${
                    isProcessing && processingType !== 'images_zip'
                      ? 'opacity-40 cursor-not-allowed'
                      : isDarkMode
                      ? 'hover:bg-slate-800 text-slate-200'
                      : 'hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500 dark:text-amber-400 shrink-0">
                    <FolderArchive className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1 flex items-center justify-between">
                    <span className="text-xs font-semibold truncate">Gambar Terpisah</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 font-bold shrink-0 ml-1">
                      .ZIP
                    </span>
                  </div>
                </button>

                {/* Opsi 4: PDF Terpisah (.ZIP) */}
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleDownloadPdfsZip}
                  className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left transition-colors cursor-pointer ${
                    isProcessing && processingType !== 'pdfs_zip'
                      ? 'opacity-40 cursor-not-allowed'
                      : isDarkMode
                      ? 'hover:bg-slate-800 text-slate-200'
                      : 'hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500 dark:text-amber-400 shrink-0">
                    <FolderArchive className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1 flex items-center justify-between">
                    <span className="text-xs font-semibold truncate">PDF Terpisah</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 font-bold shrink-0 ml-1">
                      .ZIP
                    </span>
                  </div>
                </button>
              </div>
            )}

            {/* Progress & Status Box */}
            {isProcessing && (
              <div
                className={`mt-2 p-2 rounded-xl border ${
                  isDarkMode ? 'bg-slate-950/70 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-500 shrink-0" />
                  <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300 truncate">
                    {progressStatus || 'Memproses...'}
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PreviewDownloadDropdown;
