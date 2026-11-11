import React, { useState, useMemo } from 'react';
import {
  Eye,
  RotateCw,
  RotateCcw,
  Download,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import {
  ALL_CERTIFICATES_LIST,
  getActiveCertificateList,
} from '../../../utils/google-apps-script/generator';

export interface CertsSectionProps {
  selectedCertIds: string[];
  defaultCertIds?: string[];
  showCertsBreakdown: boolean;
  setShowCertsBreakdown: React.Dispatch<React.SetStateAction<boolean>>;
  handlePreviewCertsPdf: () => void;
  isPreviewingCerts: boolean;
  onOpenCertsPreviewModal?: () => void;
  handleToggleCert: (certId: string) => void;
  onResetCerts?: () => void;
  selectedCvPreset: string;
  isCertsGrayscale?: boolean;
  setIsCertsGrayscale?: (val: boolean) => void;
  isCertsCompressed?: boolean;
  setIsCertsCompressed?: (val: boolean) => void;
}

export const CertsSection: React.FC<CertsSectionProps> = ({
  selectedCertIds,
  defaultCertIds: externalDefaultCertIds,
  showCertsBreakdown,
  setShowCertsBreakdown,
  handlePreviewCertsPdf,
  isPreviewingCerts,
  onOpenCertsPreviewModal,
  handleToggleCert,
  onResetCerts,
  selectedCvPreset,
  isCertsGrayscale: externalIsGrayscale,
  setIsCertsGrayscale: setExternalIsGrayscale,
  isCertsCompressed: externalIsCompressed,
  setIsCertsCompressed: setExternalIsCompressed,
}) => {
  // Internal state fallback
  const [internalIsGrayscale, setInternalIsGrayscale] = useState<boolean>(false); // Default OFF (Cetak Warna ON)
  const [internalIsCompressed, setInternalIsCompressed] = useState<boolean>(true); // Default ON

  const isCertsGrayscale = externalIsGrayscale ?? internalIsGrayscale;
  const setIsCertsGrayscale = setExternalIsGrayscale ?? setInternalIsGrayscale;

  const isCertsCompressed = externalIsCompressed ?? internalIsCompressed;
  const setIsCertsCompressed = setExternalIsCompressed ?? setInternalIsCompressed;

  // Rekomendasi Sertifikat default berdasarkan Role (Preset) yang dipilih
  const defaultCertList = useMemo(() => {
    return (
      externalDefaultCertIds ??
      getActiveCertificateList(selectedCvPreset || 'optimal').map((c) => c.id)
    );
  }, [externalDefaultCertIds, selectedCvPreset]);

  // Evaluasi apakah sertifikat diubah dari rekomendasi default
  const isCertsChangedFromDefault = useMemo(() => {
    if (isCertsGrayscale || !isCertsCompressed) return true;
    if (selectedCertIds.length !== defaultCertList.length) return true;
    const sortedSel = [...selectedCertIds].sort();
    const sortedDef = [...defaultCertList].sort();
    return !sortedSel.every((val, idx) => val === sortedDef[idx]);
  }, [isCertsGrayscale, isCertsCompressed, selectedCertIds, defaultCertList]);

  // Format subtitle header: [jumlah] Hal, Berwarna, Dikompresi
  const headerSubtitleText = useMemo(() => {
    const parts: string[] = [];
    parts.push(`${selectedCertIds.length} Hal`);
    parts.push(!isCertsGrayscale ? 'Berwarna' : 'Hitam Putih');
    if (isCertsCompressed) {
      parts.push('Dikompresi');
    }
    return parts.join(', ');
  }, [selectedCertIds.length, isCertsGrayscale, isCertsCompressed]);

  // Handler reset sertifikat ke rekomendasi awal role
  const handleResetCerts = () => {
    if (onResetCerts) {
      onResetCerts();
    }
    setInternalIsGrayscale(false);
    setInternalIsCompressed(true);
    if (setExternalIsGrayscale) setExternalIsGrayscale(false);
    if (setExternalIsCompressed) setExternalIsCompressed(true);
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-start justify-between gap-2">
        <div
          onClick={() => setShowCertsBreakdown((prev) => !prev)}
          className="min-w-0 flex-1 cursor-pointer select-none"
        >
          <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Sertifikasi
          </h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
            {headerSubtitleText}
          </p>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {/* Reset button - HANYA TAMPIL JIKA ADA PERUBAHAN MANUAL */}
          {isCertsChangedFromDefault && (
            <button
              type="button"
              onClick={handleResetCerts}
              className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-center cursor-pointer animate-in fade-in duration-150"
              title="Kembalikan ke rekomendasi awal sertifikat sesuai role"
              aria-label="Kembalikan Sertifikasi ke Rekomendasi Awal"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

          {/* Unduh / Preview Berkas Kompilasi Sertifikat Fisik */}
          <button
            type="button"
            onClick={handlePreviewCertsPdf}
            disabled={isPreviewingCerts || selectedCertIds.length === 0}
            className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            title="Unduh & Periksa Berkas Kompilasi Sertifikat Fisik"
          >
            {isPreviewingCerts ? (
              <RotateCw className="w-4 h-4 animate-spin text-blue-600 dark:text-blue-400" />
            ) : (
              <Download className="w-4 h-4" />
            )}
          </button>

          {/* Pratinjau Modal Sertifikasi */}
          {onOpenCertsPreviewModal && (
            <button
              type="button"
              onClick={onOpenCertsPreviewModal}
              disabled={selectedCertIds.length === 0}
              className={`p-1.5 rounded-lg transition-colors flex items-center justify-center ${
                selectedCertIds.length === 0
                  ? 'text-slate-300 dark:text-slate-600 cursor-not-allowed opacity-40'
                  : 'text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer'
              }`}
              title={
                selectedCertIds.length === 0
                  ? 'Pilih minimal 1 sertifikat untuk melihat pratinjau'
                  : 'Lihat Pratinjau Sertifikasi Terkait'
              }
              aria-label="Lihat Pratinjau Sertifikasi Terkait"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowCertsBreakdown((prev) => !prev)}
            className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-center cursor-pointer"
            title={showCertsBreakdown ? 'Sembunyikan daftar sertifikat' : 'Tampilkan daftar sertifikat'}
          >
            {showCertsBreakdown ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Breakdown Drawer: 2 Card Pengaturan Ringkas (Cetak Warna & Kompresi File) + List Badges 2 Kolom Mobile / 3 Kolom Desktop */}
      {showCertsBreakdown && (
        <div className="space-y-2 text-xs animate-in fade-in duration-150">
          {/* 2 Card Pengaturan Toggle Ringkas - Tampil saat ada sertifikat terpilih */}
          {selectedCertIds.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {/* Card 1: Cetak Warna (Default ON / Aktif) */}
              <div className="flex items-center justify-between px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-900/75 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors shadow-2xs">
                <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                  Cetak Warna
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={!isCertsGrayscale}
                  onClick={() => setIsCertsGrayscale(!isCertsGrayscale)}
                  title={
                    !isCertsGrayscale
                      ? 'Cetak warna aktif (klik untuk cetak hitam putih)'
                      : 'Cetak warna nonaktif (klik untuk aktifkan cetak warna)'
                  }
                  aria-label="Toggle Cetak Warna Sertifikasi"
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    !isCertsGrayscale ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                      !isCertsGrayscale ? 'translate-x-4' : 'translate-x-0'
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
                  aria-checked={isCertsCompressed}
                  onClick={() => setIsCertsCompressed(!isCertsCompressed)}
                  title={
                    isCertsCompressed
                      ? 'Kompresi file aktif (ukuran dioptimalkan)'
                      : 'Kompresi file nonaktif (kualitas asli)'
                  }
                  aria-label="Toggle Kompresi File Sertifikasi"
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isCertsCompressed ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                      isCertsCompressed ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          {/* Grid Badge Items Responsive (2 Kolom Mobile, 3 Kolom Desktop) In-Place */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 pt-0.5">
            {ALL_CERTIFICATES_LIST.map((cert) => {
              const selectedIndex = selectedCertIds.indexOf(cert.id);
              const isSelected = selectedIndex !== -1;
              const orderNumber = selectedIndex + 1;

              return (
                <button
                  key={cert.id}
                  type="button"
                  onClick={() => handleToggleCert(cert.id)}
                  className={`w-full inline-flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] font-medium shadow-2xs transition-all cursor-pointer select-none active:scale-95 text-left gap-1.5 min-w-0 ${
                    isSelected
                      ? 'bg-blue-600 hover:bg-blue-700 text-white border border-blue-600 font-semibold'
                      : 'bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
                  title={
                    isSelected
                      ? `Urutan ke-${orderNumber} • Klik untuk melepaskan ${cert.title}`
                      : `Klik untuk memilih ${cert.title}`
                  }
                >
                  <span className="truncate min-w-0 flex-1 text-left">
                    {cert.title}
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

export default CertsSection;
