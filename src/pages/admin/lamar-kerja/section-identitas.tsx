import React, { useState, useMemo } from 'react';
import {
  Eye,
  RotateCw,
  RotateCcw,
  Download,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { ALL_IDENTITY_DOCS } from '../../../data/identitas';

export interface IdentitySectionProps {
  selectedIdentityIds: string[];
  defaultIdentityIds?: string[];
  showIdentityBreakdown: boolean;
  setShowIdentityBreakdown: React.Dispatch<React.SetStateAction<boolean>>;
  handlePreviewIdentityPdf: () => void;
  isPreviewingIdentity: boolean;
  onOpenIdentityPreviewModal?: () => void;
  handleToggleIdentityDoc: (docId: string) => void;
  onResetIdentity?: () => void;
  isIdentityColorPrint?: boolean;
  setIsIdentityColorPrint?: (val: boolean) => void;
  isIdentityCompressed?: boolean;
  setIsIdentityCompressed?: (val: boolean) => void;
  isIdentitySeparatePhotoPrint?: boolean;
  setIsIdentitySeparatePhotoPrint?: (val: boolean) => void;
  isIdentityPhotoAsJpg?: boolean;
  setIsIdentityPhotoAsJpg?: (val: boolean) => void;
}

export const IdentitySection: React.FC<IdentitySectionProps> = ({
  selectedIdentityIds,
  defaultIdentityIds: externalDefaultIds,
  showIdentityBreakdown,
  setShowIdentityBreakdown,
  handlePreviewIdentityPdf,
  isPreviewingIdentity,
  onOpenIdentityPreviewModal,
  handleToggleIdentityDoc,
  onResetIdentity,
  isIdentityColorPrint: externalIsColorPrint,
  setIsIdentityColorPrint: setIsIdentityColorPrintProp,
  isIdentityCompressed: externalIsCompressed,
  setIsIdentityCompressed: setIsIdentityCompressedProp,
  isIdentitySeparatePhotoPrint: externalIsSeparatePhotoPrint,
  setIsIdentitySeparatePhotoPrint: setIsIdentitySeparatePhotoPrintProp,
  isIdentityPhotoAsJpg: externalIsPhotoAsJpg,
  setIsIdentityPhotoAsJpg: setIsIdentityPhotoAsJpgProp,
}) => {
  // Internal fallback states
  const [internalIsColorPrint, setInternalIsColorPrint] = useState<boolean>(false); // Default OFF (Hitam Putih)
  const [internalIsCompressed, setInternalIsCompressed] = useState<boolean>(true); // Default ON
  const [internalIsSeparatePhotoPrint, setInternalIsSeparatePhotoPrint] = useState<boolean>(false); // Full Foto default OFF
  const [internalIsPhotoAsJpg, setInternalIsPhotoAsJpg] = useState<boolean>(true); // File JPG default ON saat Full Foto muncul

  const isIdentityColorPrint = externalIsColorPrint ?? internalIsColorPrint;
  const setIsIdentityColorPrint = setIsIdentityColorPrintProp ?? setInternalIsColorPrint;

  const isIdentityCompressed = externalIsCompressed ?? internalIsCompressed;
  const setIsIdentityCompressed = setIsIdentityCompressedProp ?? setInternalIsCompressed;

  const isIdentitySeparatePhotoPrint = externalIsSeparatePhotoPrint ?? internalIsSeparatePhotoPrint;
  const setIsIdentitySeparatePhotoPrint = setIsIdentitySeparatePhotoPrintProp ?? setInternalIsSeparatePhotoPrint;

  const isIdentityPhotoAsJpg = externalIsPhotoAsJpg ?? internalIsPhotoAsJpg;
  const setIsIdentityPhotoAsJpg = setIsIdentityPhotoAsJpgProp ?? setInternalIsPhotoAsJpg;

  const defaultIdentityIds = useMemo<string[]>(() => {
    return externalDefaultIds ?? [];
  }, [externalDefaultIds]);

  // Check if any photo document (pas-foto-3x4, pas-foto-4x6, pas-foto-setengah-badan) is selected
  const hasSelectedPhotos = useMemo(() => {
    const photoIds = ['pas-foto-3x4', 'pas-foto-4x6', 'pas-foto-setengah-badan'];
    return selectedIdentityIds.some((id) => photoIds.includes(id));
  }, [selectedIdentityIds]);

  // Check if any non-photo document (ktp, npwp, kk) is selected
  const hasSelectedOtherDocs = useMemo(() => {
    const photoIds = ['pas-foto-3x4', 'pas-foto-4x6', 'pas-foto-setengah-badan'];
    return selectedIdentityIds.some((id) => !photoIds.includes(id));
  }, [selectedIdentityIds]);

  // Hitung berapa jumlah seekbar/toggle aktif untuk layout responsive desktop (2, 3, atau 4 dalam 1 baris horizontal)
  const seekbarCount = useMemo(() => {
    let count = 2; // Cetak Warna, Kompresi File
    if (hasSelectedPhotos) {
      count += 1; // Full Foto
      if (isIdentitySeparatePhotoPrint) {
        count += 1; // File JPG
      }
    }
    return count;
  }, [hasSelectedPhotos, isIdentitySeparatePhotoPrint]);

  const desktopSeekbarColsClass = useMemo(() => {
    if (seekbarCount === 4) return 'sm:grid-cols-4';
    if (seekbarCount === 3) return 'sm:grid-cols-3';
    return 'sm:grid-cols-2';
  }, [seekbarCount]);

  // Evaluasi apakah dokumen identitas diubah dari set awal
  const isIdentityChangedFromDefault = useMemo(() => {
    if (selectedIdentityIds.length !== defaultIdentityIds.length) return true;
    const sortedSel = [...selectedIdentityIds].sort();
    const sortedDef = [...defaultIdentityIds].sort();
    const isSelectionChanged = !sortedSel.every((val, idx) => val === sortedDef[idx]);
    return (
      isSelectionChanged ||
      isIdentityColorPrint !== false ||
      isIdentityCompressed !== true ||
      isIdentitySeparatePhotoPrint !== false ||
      (isIdentitySeparatePhotoPrint && !isIdentityPhotoAsJpg)
    );
  }, [
    selectedIdentityIds,
    defaultIdentityIds,
    isIdentityColorPrint,
    isIdentityCompressed,
    isIdentitySeparatePhotoPrint,
    isIdentityPhotoAsJpg,
  ]);

  // Format subtitle header: [jumlah] Hal, Berwarna/Hitam Putih, Dikompresi[, File JPG / Full Foto]
  const headerSubtitleText = useMemo(() => {
    if (selectedIdentityIds.length === 0) {
      return '0 Hal';
    }
    const parts: string[] = [];
    parts.push(`${selectedIdentityIds.length} Hal`);
    parts.push(isIdentityColorPrint ? 'Berwarna' : 'Hitam Putih');
    if (isIdentityCompressed) {
      parts.push('Dikompresi');
    }
    if (hasSelectedPhotos && isIdentitySeparatePhotoPrint) {
      parts.push(isIdentityPhotoAsJpg ? 'File JPG' : 'Full Foto');
    }
    return parts.join(', ');
  }, [
    selectedIdentityIds.length,
    isIdentityColorPrint,
    isIdentityCompressed,
    hasSelectedPhotos,
    isIdentitySeparatePhotoPrint,
    isIdentityPhotoAsJpg,
  ]);

  const handleReset = () => {
    if (onResetIdentity) {
      onResetIdentity();
    }
    setInternalIsColorPrint(false);
    setInternalIsCompressed(true);
    setInternalIsSeparatePhotoPrint(false);
    setInternalIsPhotoAsJpg(true);
    if (setIsIdentityColorPrintProp) setIsIdentityColorPrintProp(false);
    if (setIsIdentityCompressedProp) setIsIdentityCompressedProp(true);
    if (setIsIdentitySeparatePhotoPrintProp) setIsIdentitySeparatePhotoPrintProp(false);
    if (setIsIdentityPhotoAsJpgProp) setIsIdentityPhotoAsJpgProp(true);
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-start justify-between gap-2">
        <div
          onClick={() => setShowIdentityBreakdown((prev) => !prev)}
          className="min-w-0 flex-1 cursor-pointer select-none"
        >
          <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Identitas
          </h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
            {headerSubtitleText}
          </p>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {/* Reset button - HANYA TAMPIL JIKA ADA PERUBAHAN MANUAL */}
          {isIdentityChangedFromDefault && (
            <button
              type="button"
              onClick={handleReset}
              className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-center cursor-pointer animate-in fade-in duration-150"
              title="Kembalikan ke pilihan identitas awal"
              aria-label="Kembalikan Dokumen Identitas ke Set Awal"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

          {/* 1. Unduh / Preview PDF (Icon Download di kiri icon mata) */}
          <button
            type="button"
            onClick={handlePreviewIdentityPdf}
            disabled={isPreviewingIdentity || selectedIdentityIds.length === 0}
            className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            title={
              selectedIdentityIds.length === 0
                ? 'Pilih minimal 1 dokumen identitas untuk diunduh'
                : hasSelectedPhotos && isIdentitySeparatePhotoPrint
                ? isIdentityPhotoAsJpg
                  ? hasSelectedOtherDocs
                    ? `Unduh Berurutan: ${isIdentityColorPrint ? 'identitas-alvareza.pdf' : 'identitas-alvareza-bw.pdf'} lalu foto (.jpg)`
                    : 'Unduh Berkas Foto Asli (.jpg)'
                  : hasSelectedOtherDocs
                  ? `Unduh Berurutan: ${isIdentityColorPrint ? 'identitas-alvareza.pdf' : 'identitas-alvareza-bw.pdf'} lalu ${isIdentityColorPrint ? 'foto-alvareza.pdf' : 'foto-alvareza-bw.pdf'}`
                  : `Unduh Berkas Foto PDF (${isIdentityColorPrint ? 'foto-alvareza.pdf' : 'foto-alvareza-bw.pdf'})`
                : `Unduh Dokumen Identitas PDF (${isIdentityColorPrint ? 'identitas-alvareza.pdf' : 'identitas-alvareza-bw.pdf'})`
            }
          >
            {isPreviewingIdentity ? (
              <RotateCw className="w-4 h-4 animate-spin text-blue-600 dark:text-blue-400" />
            ) : (
              <Download className="w-4 h-4" />
            )}
          </button>

          {/* 2. Pratinjau Modal Identitas (Icon Mata di kiri dropdown) */}
          {onOpenIdentityPreviewModal && (
            <button
              type="button"
              onClick={onOpenIdentityPreviewModal}
              disabled={selectedIdentityIds.length === 0}
              className={`p-1.5 rounded-lg transition-colors flex items-center justify-center ${
                selectedIdentityIds.length === 0
                  ? 'text-slate-300 dark:text-slate-600 cursor-not-allowed opacity-40'
                  : 'text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer'
              }`}
              title={
                selectedIdentityIds.length === 0
                  ? 'Pilih minimal 1 dokumen identitas untuk melihat pratinjau'
                  : 'Lihat Pratinjau Dokumen Identitas'
              }
              aria-label="Lihat Pratinjau Dokumen Identitas"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowIdentityBreakdown((prev) => !prev)}
            className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-center cursor-pointer"
            title={showIdentityBreakdown ? 'Sembunyikan daftar dokumen identitas' : 'Tampilkan daftar dokumen identitas'}
          >
            {showIdentityBreakdown ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Breakdown Drawer: Card Pengaturan & Grid Badge Identitas */}
      {showIdentityBreakdown && (
        <div className="space-y-2 text-xs animate-in fade-in duration-150">
          {/* Card Pengaturan Seekbar - Tampil jika ada dokumen identitas yang dipilih */}
          {selectedIdentityIds.length > 0 && (
            <div className={`grid grid-cols-2 ${desktopSeekbarColsClass} gap-2`}>
              {/* Card 1: Cetak Warna (Khusus Dokumen Identitas, default OFF / Hitam Putih) */}
              <div className="flex items-center justify-between px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-900/75 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors shadow-2xs min-w-0">
                <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 truncate mr-1">
                  Cetak Warna
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={isIdentityColorPrint}
                  onClick={() => setIsIdentityColorPrint(!isIdentityColorPrint)}
                  title={
                    isIdentityColorPrint
                      ? 'Cetak warna aktif (klik untuk cetak hitam putih)'
                      : 'Cetak warna nonaktif (klik untuk aktifkan cetak warna)'
                  }
                  aria-label="Toggle Cetak Warna Identitas"
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isIdentityColorPrint ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                      isIdentityColorPrint ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Card 2: Kompresi File (Default ON / Aktif) */}
              <div className="flex items-center justify-between px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-900/75 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors shadow-2xs min-w-0">
                <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 truncate mr-1">
                  Kompresi File
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={isIdentityCompressed}
                  onClick={() => setIsIdentityCompressed(!isIdentityCompressed)}
                  title={
                    isIdentityCompressed
                      ? 'Kompresi file aktif (ukuran dokumen lebih ringan)'
                      : 'Kompresi file nonaktif (kualitas dokumen maksimal)'
                  }
                  aria-label="Toggle Kompresi File Identitas"
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isIdentityCompressed ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                      isIdentityCompressed ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Card 3: Full Foto (Jika ada foto dipilih) */}
              {hasSelectedPhotos && (
                <div className="flex items-center justify-between px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-900/75 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors shadow-2xs min-w-0 animate-in fade-in duration-150">
                  <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 truncate mr-1">
                    Full Foto
                  </span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={isIdentitySeparatePhotoPrint}
                    onClick={() => {
                      const nextVal = !isIdentitySeparatePhotoPrint;
                      setIsIdentitySeparatePhotoPrint(nextVal);
                      if (nextVal) {
                        // Saat Full Foto diaktifkan, File JPG default langsung ON
                        setIsIdentityPhotoAsJpg(true);
                      }
                    }}
                    title={
                      isIdentitySeparatePhotoPrint
                        ? 'Full foto aktif (foto dipisahkan dari dokumen identitas)'
                        : 'Full foto nonaktif (foto digabung di berkas A4 identitas)'
                    }
                    aria-label="Toggle Full Foto"
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isIdentitySeparatePhotoPrint ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                        isIdentitySeparatePhotoPrint ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              )}

              {/* Card 4: File JPG (Hanya muncul jika Full Foto aktif, default saat muncul: ON) */}
              {hasSelectedPhotos && isIdentitySeparatePhotoPrint && (
                <div className="flex items-center justify-between px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-900/75 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors shadow-2xs min-w-0 animate-in fade-in duration-150">
                  <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 truncate mr-1">
                    File JPG
                  </span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={isIdentityPhotoAsJpg}
                    onClick={() => setIsIdentityPhotoAsJpg(!isIdentityPhotoAsJpg)}
                    title={
                      isIdentityPhotoAsJpg
                        ? 'File JPG aktif (foto dilampirkan sebagai file gambar .jpg asli)'
                        : 'File JPG nonaktif (foto dilampirkan sebagai file dokumen PDF terpisah)'
                    }
                    aria-label="Toggle File JPG"
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isIdentityPhotoAsJpg ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                        isIdentityPhotoAsJpg ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Grid Badge Items Responsive (3 Kolom Mobile, 6 Kolom Desktop) In-Place */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 pt-0.5">
            {ALL_IDENTITY_DOCS.map((doc) => {
              const selectedIndex = selectedIdentityIds.indexOf(doc.id);
              const isSelected = selectedIndex !== -1;
              const orderNumber = selectedIndex + 1;

              return (
                <button
                  key={doc.id}
                  type="button"
                  onClick={() => handleToggleIdentityDoc(doc.id)}
                  className={`w-full inline-flex items-center justify-between px-2 sm:px-2.5 py-1.5 rounded-lg text-[11px] font-medium shadow-2xs transition-all cursor-pointer select-none active:scale-95 text-left gap-1 min-w-0 ${
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
                  <span className="truncate min-w-0 flex-1 text-left font-semibold text-[10px] sm:text-[11px]">
                    {doc.badgeLabel}
                  </span>
                  {isSelected && (
                    <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-white text-blue-600 font-bold text-[9px] sm:text-[10px] inline-flex items-center justify-center shrink-0 ml-0.5 shadow-2xs leading-none">
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

export default IdentitySection;
