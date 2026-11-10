import React, { useState, useMemo } from 'react';
import {
  Eye,
  RotateCw,
  RotateCcw,
  Download,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { ALL_ACADEMIC_DOCS } from '../../../../data/academicDocs';

export interface AcademicSectionProps {
  selectedAcademicIds: string[];
  showAcademicBreakdown: boolean;
  setShowAcademicBreakdown: React.Dispatch<React.SetStateAction<boolean>>;
  handlePreviewAcademicPdf: () => void;
  isPreviewingAcademic: boolean;
  onOpenAcademicPreviewModal?: () => void;
  handleToggleAcademicDoc: (docId: 'skl' | 'transkrip') => void;
  onResetAcademic?: () => void;
  isAcademicGrayscale?: boolean;
  setIsAcademicGrayscale?: (val: boolean) => void;
  isAcademicCompressed?: boolean;
  setIsAcademicCompressed?: (val: boolean) => void;
  // Legacy backward compatibility props
  isColorPrint?: boolean;
  setIsColorPrint?: (val: boolean) => void;
}

export const AcademicSection: React.FC<AcademicSectionProps> = ({
  selectedAcademicIds,
  showAcademicBreakdown,
  setShowAcademicBreakdown,
  handlePreviewAcademicPdf,
  isPreviewingAcademic,
  onOpenAcademicPreviewModal,
  handleToggleAcademicDoc,
  onResetAcademic,
  isAcademicGrayscale: externalIsGrayscale,
  setIsAcademicGrayscale: setExternalIsGrayscale,
  isAcademicCompressed: externalIsCompressed,
  setIsAcademicCompressed: setExternalIsCompressed,
  isColorPrint,
  setIsColorPrint,
}) => {
  // Internal fallback states
  const [internalIsGrayscale, setInternalIsGrayscale] = useState<boolean>(
    externalIsGrayscale !== undefined
      ? externalIsGrayscale
      : isColorPrint !== undefined
      ? !isColorPrint
      : false // Default OFF
  );
  const [internalIsCompressed, setInternalIsCompressed] = useState<boolean>(true); // Default ON

  const isAcademicGrayscale =
    externalIsGrayscale !== undefined
      ? externalIsGrayscale
      : isColorPrint !== undefined
      ? !isColorPrint
      : internalIsGrayscale;

  const setIsAcademicGrayscale = (val: boolean) => {
    if (setExternalIsGrayscale) setExternalIsGrayscale(val);
    if (setIsColorPrint) setIsColorPrint(!val);
    setInternalIsGrayscale(val);
  };

  const isAcademicCompressed = externalIsCompressed ?? internalIsCompressed;
  const setIsAcademicCompressed = (val: boolean) => {
    if (setExternalIsCompressed) setExternalIsCompressed(val);
    setInternalIsCompressed(val);
  };

  const defaultAcademicIds = useMemo(() => ['skl', 'transkrip'], []);
  const defaultUnselectedAcademicIds = useMemo(() => {
    return ALL_ACADEMIC_DOCS
      .map((d) => d.id)
      .filter((id) => !defaultAcademicIds.includes(id));
  }, [defaultAcademicIds]);

  // Urutan list badge putih dokumen akademik (yang belum dipilih)
  const [unselectedAcademicIds, setUnselectedAcademicIds] = useState<string[]>(() => {
    return ALL_ACADEMIC_DOCS
      .map((d) => d.id)
      .filter((id) => !selectedAcademicIds.includes(id));
  });

  const isAcademicChangedFromDefault = useMemo(() => {
    if (isAcademicGrayscale || !isAcademicCompressed) return true;
    if (selectedAcademicIds.length !== defaultAcademicIds.length) return true;
    for (let i = 0; i < selectedAcademicIds.length; i++) {
      if (selectedAcademicIds[i] !== defaultAcademicIds[i]) return true;
    }
    if (unselectedAcademicIds.length !== defaultUnselectedAcademicIds.length) return true;
    for (let i = 0; i < unselectedAcademicIds.length; i++) {
      if (unselectedAcademicIds[i] !== defaultUnselectedAcademicIds[i]) return true;
    }
    return false;
  }, [isAcademicGrayscale, isAcademicCompressed, selectedAcademicIds, defaultAcademicIds, unselectedAcademicIds, defaultUnselectedAcademicIds]);

  const handleAddAcademicDoc = (docId: 'skl' | 'transkrip') => {
    setUnselectedAcademicIds((prev) => prev.filter((id) => id !== docId));
    handleToggleAcademicDoc(docId);
  };

  const handleRemoveAcademicDoc = (docId: 'skl' | 'transkrip') => {
    handleToggleAcademicDoc(docId);
    setUnselectedAcademicIds((prev) => [...prev.filter((id) => id !== docId), docId]);
  };

  const handleResetAcademic = () => {
    if (onResetAcademic) {
      onResetAcademic();
    }
    setIsAcademicGrayscale(false);
    setIsAcademicCompressed(true);
    setUnselectedAcademicIds(defaultUnselectedAcademicIds);
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-start justify-between gap-2">
        <div
          onClick={() => setShowAcademicBreakdown((prev) => !prev)}
          className="min-w-0 flex-1 cursor-pointer select-none"
        >
          <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Akademik
          </h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
            {selectedAcademicIds.length === 0
              ? '0 Dokumen dipilih'
              : `${selectedAcademicIds.length} Dokumen Fisik • ${
                  isAcademicGrayscale ? 'Hitam Putih' : 'Berwarna'
                }${isAcademicCompressed ? ' • Kompresi' : ''}`}
          </p>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {/* Reset to Default Academic Docs (Samping kiri icon download) */}
          <button
            type="button"
            onClick={handleResetAcademic}
            disabled={!isAcademicChangedFromDefault}
            className={`p-1.5 rounded-lg transition-colors flex items-center justify-center ${
              isAcademicChangedFromDefault
                ? 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer'
                : 'text-slate-300 dark:text-slate-600 hover:text-slate-300 dark:hover:text-slate-600 cursor-not-allowed opacity-40'
            }`}
            title={
              isAcademicChangedFromDefault
                ? 'Kembalikan ke dokumen akademik awal (SKL & Transkrip Nilai)'
                : 'Dokumen akademik sudah sesuai set awal'
            }
            aria-label="Kembalikan Dokumen Akademik ke Set Awal"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* 1. Unduh / Preview PDF (Icon Download di kiri icon mata) */}
          <button
            type="button"
            onClick={handlePreviewAcademicPdf}
            disabled={isPreviewingAcademic || selectedAcademicIds.length === 0}
            className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            title={
              selectedAcademicIds.length === 0
                ? 'Pilih minimal 1 dokumen akademik untuk diunduh'
                : selectedAcademicIds.length === 2
                ? 'Unduh & Periksa Berkas Gabungan Akademik'
                : 'Unduh & Periksa Dokumen Akademik'
            }
          >
            {isPreviewingAcademic ? (
              <RotateCw className="w-4 h-4 animate-spin text-blue-600 dark:text-blue-400" />
            ) : (
              <Download className="w-4 h-4" />
            )}
          </button>

          {/* 2. Pratinjau Modal Akademik (Icon Mata di kiri dropdown) */}
          {onOpenAcademicPreviewModal && (
            <button
              type="button"
              onClick={onOpenAcademicPreviewModal}
              disabled={selectedAcademicIds.length === 0}
              className={`p-1.5 rounded-lg transition-colors flex items-center justify-center ${
                selectedAcademicIds.length === 0
                  ? 'text-slate-300 dark:text-slate-600 cursor-not-allowed opacity-40'
                  : 'text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer'
              }`}
              title={
                selectedAcademicIds.length === 0
                  ? 'Pilih minimal 1 dokumen akademik untuk melihat pratinjau'
                  : 'Lihat Pratinjau Dokumen Akademik'
              }
              aria-label="Lihat Pratinjau Dokumen Akademik"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowAcademicBreakdown((prev) => !prev)}
            className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-center cursor-pointer"
            title={showAcademicBreakdown ? 'Sembunyikan daftar dokumen akademik' : 'Tampilkan daftar dokumen akademik'}
          >
            {showAcademicBreakdown ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Breakdown Drawer: 2 Cards Pengaturan (Cetak Hitam Putih & Kompresi File) + List Badges */}
      {showAcademicBreakdown && (
        <div className="space-y-2 text-xs animate-in fade-in duration-150">
          {/* 2 Card Pengaturan (Cetak Hitam Putih & Kompresi File) - Tampil saat ada dokumen terpilih */}
          {selectedAcademicIds.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {/* Card 1: Cetak Hitam Putih (Default OFF) */}
              <div className="flex items-center justify-between px-2.5 sm:px-3.5 py-2.5 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-900/75 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors shadow-2xs">
                <div className="min-w-0 pr-1.5 sm:pr-2">
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-100 block truncate">
                    Cetak Hitam Putih
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block truncate">
                    {isAcademicGrayscale ? 'Dicetak Hitam Putih' : 'Dicetak Berwarna'}
                  </span>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={isAcademicGrayscale}
                  onClick={() => setIsAcademicGrayscale(!isAcademicGrayscale)}
                  title={
                    isAcademicGrayscale
                      ? 'Cetak hitam putih aktif (klik untuk cetak berwarna)'
                      : 'Cetak berwarna (klik untuk aktifkan cetak hitam putih)'
                  }
                  aria-label="Toggle Cetak Hitam Putih Akademik"
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${
                    isAcademicGrayscale ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                      isAcademicGrayscale ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Card 2: Kompresi File (Default ON) */}
              <div className="flex items-center justify-between px-2.5 sm:px-3.5 py-2.5 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-900/75 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors shadow-2xs">
                <div className="min-w-0 pr-1.5 sm:pr-2">
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-100 block truncate">
                    Kompresi File
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block truncate">
                    {isAcademicCompressed ? 'Ukuran Dioptimalkan' : 'Kualitas Asli (Besar)'}
                  </span>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={isAcademicCompressed}
                  onClick={() => setIsAcademicCompressed(!isAcademicCompressed)}
                  title={
                    isAcademicCompressed
                      ? 'Kompresi file aktif (ukuran dioptimalkan)'
                      : 'Kompresi file nonaktif (kualitas asli)'
                  }
                  aria-label="Toggle Kompresi File Akademik"
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${
                    isAcademicCompressed ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                      isAcademicCompressed ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          {/* Kolom Atas: Card Badge Dokumen Akademik Terpilih (Hanya tampil jika ada yang dipilih) */}
          {selectedAcademicIds.length > 0 && (
            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
              <div className="flex flex-wrap items-center gap-1.5">
                {selectedAcademicIds.map((docId) => {
                  const doc = ALL_ACADEMIC_DOCS.find((d) => d.id === docId);
                  if (!doc) return null;
                  return (
                    <button
                      key={doc.id}
                      type="button"
                      onClick={() => handleRemoveAcademicDoc(doc.id as 'skl' | 'transkrip')}
                      className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-medium shadow-2xs transition-colors cursor-pointer select-none active:scale-95"
                      title={`Klik untuk melepaskan ${doc.title}`}
                    >
                      {doc.title}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Kolom Bawah: Badge-badge Putih Dokumen Akademik */}
          {unselectedAcademicIds.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              {unselectedAcademicIds.map((docId) => {
                const doc = ALL_ACADEMIC_DOCS.find((d) => d.id === docId);
                if (!doc) return null;
                return (
                  <button
                    key={doc.id}
                    type="button"
                    onClick={() => handleAddAcademicDoc(doc.id as 'skl' | 'transkrip')}
                    className="inline-flex items-center px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 text-[11px] font-medium shadow-2xs transition-colors cursor-pointer select-none active:scale-95"
                    title={`Klik untuk memilih ${doc.title}`}
                  >
                    {doc.title}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
