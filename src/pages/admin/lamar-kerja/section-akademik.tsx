import React, { useState, useMemo } from 'react';
import {
  Eye,
  RotateCw,
  RotateCcw,
  Download,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { ALL_ACADEMIC_DOCS } from '../../../data/akademik';

export interface AcademicSectionProps {
  selectedAcademicIds: string[];
  defaultAcademicIds?: string[];
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
  defaultAcademicIds: externalDefaultIds,
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
      : false // Default OFF (Cetak Warna ON)
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

  // Rekomendasi Dokumen Akademik default (SKL & Transkrip Nilai)
  const defaultAcademicList = useMemo(() => {
    return externalDefaultIds ?? ['skl', 'transkrip'];
  }, [externalDefaultIds]);

  // Evaluasi apakah dokumen akademik diubah dari set awal
  const isAcademicChangedFromDefault = useMemo(() => {
    if (isAcademicGrayscale || !isAcademicCompressed) return true;
    if (selectedAcademicIds.length !== defaultAcademicList.length) return true;
    const sortedSel = [...selectedAcademicIds].sort();
    const sortedDef = [...defaultAcademicList].sort();
    return !sortedSel.every((val, idx) => val === sortedDef[idx]);
  }, [isAcademicGrayscale, isAcademicCompressed, selectedAcademicIds, defaultAcademicList]);

  // Format subtitle header: [jumlah] Hal, Berwarna, Dikompresi
  const headerSubtitleText = useMemo(() => {
    const parts: string[] = [];
    parts.push(`${selectedAcademicIds.length} Hal`);
    parts.push(!isAcademicGrayscale ? 'Berwarna' : 'Hitam Putih');
    if (isAcademicCompressed) {
      parts.push('Dikompresi');
    }
    return parts.join(', ');
  }, [selectedAcademicIds.length, isAcademicGrayscale, isAcademicCompressed]);

  const handleResetAcademic = () => {
    if (onResetAcademic) {
      onResetAcademic();
    }
    setIsAcademicGrayscale(false);
    setIsAcademicCompressed(true);
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
            {headerSubtitleText}
          </p>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {/* Reset button - HANYA TAMPIL JIKA ADA PERUBAHAN MANUAL */}
          {isAcademicChangedFromDefault && (
            <button
              type="button"
              onClick={handleResetAcademic}
              className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-center cursor-pointer animate-in fade-in duration-150"
              title="Kembalikan ke dokumen akademik awal (SKL & Transkrip Nilai)"
              aria-label="Kembalikan Dokumen Akademik ke Set Awal"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

          {/* Unduh / Preview PDF Akademik */}
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

          {/* Pratinjau Modal Akademik */}
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

      {/* Breakdown Drawer: 2 Card Pengaturan Ringkas (Cetak Warna & Kompresi File) + List Badges 2 Kolom Mobile / 3 Kolom Desktop */}
      {showAcademicBreakdown && (
        <div className="space-y-2 text-xs animate-in fade-in duration-150">
          {/* 2 Card Pengaturan Toggle Ringkas - Tampil saat ada dokumen akademik terpilih */}
          {selectedAcademicIds.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {/* Card 1: Cetak Warna (Default ON / Aktif) */}
              <div className="flex items-center justify-between px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-900/75 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors shadow-2xs">
                <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                  Cetak Warna
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={!isAcademicGrayscale}
                  onClick={() => setIsAcademicGrayscale(!isAcademicGrayscale)}
                  title={
                    !isAcademicGrayscale
                      ? 'Cetak warna aktif (klik untuk cetak hitam putih)'
                      : 'Cetak warna nonaktif (klik untuk aktifkan cetak warna)'
                  }
                  aria-label="Toggle Cetak Warna Akademik"
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    !isAcademicGrayscale ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                      !isAcademicGrayscale ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Card 2: Kompresi File (Default ON / Aktif) */}
              <div className="flex items-center justify-between px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-900/75 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors shadow-2xs">
                <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                  Kompresi File
                </span>
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
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isAcademicCompressed ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600'
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

          {/* Grid Badge Items Responsive (2 Kolom Mobile, 3 Kolom Desktop) In-Place */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 pt-0.5">
            {ALL_ACADEMIC_DOCS.map((doc) => {
              const selectedIndex = selectedAcademicIds.indexOf(doc.id);
              const isSelected = selectedIndex !== -1;
              const orderNumber = selectedIndex + 1;

              return (
                <button
                  key={doc.id}
                  type="button"
                  onClick={() => handleToggleAcademicDoc(doc.id as 'skl' | 'transkrip')}
                  className={`w-full inline-flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] font-medium shadow-2xs transition-all cursor-pointer select-none active:scale-95 text-left gap-1.5 min-w-0 ${
                    isSelected
                      ? 'bg-blue-600 hover:bg-blue-700 text-white border border-blue-600 font-semibold'
                      : 'bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
                  title={
                    isSelected
                      ? `Urutan ke-${orderNumber} • Klik untuk melepaskan ${doc.title}`
                      : `Klik untuk memilih ${doc.title}`
                  }
                >
                  <span className="truncate min-w-0 flex-1 text-left">
                    {doc.title}
                  </span>
                  {isSelected && (
                    <span className="w-4 h-4 rounded-full bg-white text-blue-600 font-bold text-[10px] inline-flex items-center justify-center shrink-0 ml-1 shadow-2xs leading-none">
                      {orderNumber}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default AcademicSection;
