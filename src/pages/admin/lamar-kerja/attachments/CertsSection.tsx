import React, { useState, useEffect, useMemo } from 'react';
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
} from '../../../../utils/gasAttachmentGenerator';

export interface CertsSectionProps {
  selectedCertIds: string[];
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
  const [internalIsGrayscale, setInternalIsGrayscale] = useState<boolean>(false); // Default OFF
  const [internalIsCompressed, setInternalIsCompressed] = useState<boolean>(true); // Default ON

  const isCertsGrayscale = externalIsGrayscale ?? internalIsGrayscale;
  const setIsCertsGrayscale = setExternalIsGrayscale ?? setInternalIsGrayscale;

  const isCertsCompressed = externalIsCompressed ?? internalIsCompressed;
  const setIsCertsCompressed = setExternalIsCompressed ?? setInternalIsCompressed;

  // Rekomendasi Sertifikat default berdasarkan Role (Preset) yang dipilih
  const defaultCertIds = useMemo(() => {
    return getActiveCertificateList(selectedCvPreset || 'optimal').map((c) => c.id);
  }, [selectedCvPreset]);

  const defaultUnselectedCertIds = useMemo(() => {
    return ALL_CERTIFICATES_LIST
      .map((c) => c.id)
      .filter((id) => !defaultCertIds.includes(id));
  }, [defaultCertIds]);

  // Urutan list badge putih sertifikat (yang belum dipilih)
  const [unselectedCertIds, setUnselectedCertIds] = useState<string[]>(() => {
    return ALL_CERTIFICATES_LIST
      .map((c) => c.id)
      .filter((id) => !selectedCertIds.includes(id));
  });

  // Sinkronisasi saat preset role atau rekomendasi sertifikat berubah
  useEffect(() => {
    setUnselectedCertIds(defaultUnselectedCertIds);
  }, [defaultUnselectedCertIds]);

  // Cek apakah sertifikat telah diubah pengguna dari set awal role
  const isCertsChangedFromDefault = useMemo(() => {
    if (isCertsGrayscale || !isCertsCompressed) return true;
    if (selectedCertIds.length !== defaultCertIds.length) return true;
    for (let i = 0; i < selectedCertIds.length; i++) {
      if (selectedCertIds[i] !== defaultCertIds[i]) return true;
    }
    if (unselectedCertIds.length !== defaultUnselectedCertIds.length) return true;
    for (let i = 0; i < unselectedCertIds.length; i++) {
      if (unselectedCertIds[i] !== defaultUnselectedCertIds[i]) return true;
    }
    return false;
  }, [isCertsGrayscale, isCertsCompressed, selectedCertIds, defaultCertIds, unselectedCertIds, defaultUnselectedCertIds]);

  // Handler menambahkan sertifikat: dihapus dari list putih, masuk ke posisi paling akhir badge biru
  const handleAddCert = (certId: string) => {
    setUnselectedCertIds((prev) => prev.filter((id) => id !== certId));
    handleToggleCert(certId);
  };

  // Handler melepaskan sertifikat: dihapus dari badge biru, masuk ke posisi paling akhir badge putih
  const handleRemoveCert = (certId: string) => {
    handleToggleCert(certId);
    setUnselectedCertIds((prev) => [...prev.filter((id) => id !== certId), certId]);
  };

  // Handler reset sertifikat ke rekomendasi awal role
  const handleResetCerts = () => {
    if (onResetCerts) {
      onResetCerts();
    }
    setInternalIsGrayscale(false);
    setInternalIsCompressed(true);
    if (setExternalIsGrayscale) setExternalIsGrayscale(false);
    if (setExternalIsCompressed) setExternalIsCompressed(true);
    setUnselectedCertIds(defaultUnselectedCertIds);
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
            {selectedCertIds.length === 0
              ? '0 Sertifikat dipilih'
              : `${selectedCertIds.length} Sertifikat Fisik • ${
                  isCertsGrayscale ? 'Hitam Putih' : 'Berwarna'
                }${isCertsCompressed ? ' • Kompresi' : ''}`}
          </p>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {/* Reset to Role Recommendation (Samping kiri icon download) */}
          <button
            type="button"
            onClick={handleResetCerts}
            disabled={!isCertsChangedFromDefault}
            className={`p-1.5 rounded-lg transition-colors flex items-center justify-center ${
              isCertsChangedFromDefault
                ? 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer'
                : 'text-slate-300 dark:text-slate-600 hover:text-slate-300 dark:hover:text-slate-600 cursor-not-allowed opacity-40'
            }`}
            title={
              isCertsChangedFromDefault
                ? 'Kembalikan ke rekomendasi awal sertifikat sesuai role'
                : 'Sertifikat sudah sesuai rekomendasi role'
            }
            aria-label="Kembalikan Sertifikasi ke Rekomendasi Awal"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* 1. Unduh / Preview Berkas Kompilasi Sertifikat Fisik (Icon Download di kiri icon mata) */}
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

          {/* 2. Pratinjau Modal Sertifikasi (Icon Mata di kiri dropdown) */}
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

      {/* Breakdown Drawer: 2 Cards Pengaturan (Cetak Hitam Putih & Kompresi File) + List Badges */}
      {showCertsBreakdown && (
        <div className="space-y-2 text-xs animate-in fade-in duration-150">
          {/* 2 Card Pengaturan (Cetak Hitam Putih & Kompresi File) - Tampil saat ada sertifikat terpilih */}
          {selectedCertIds.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {/* Card 1: Cetak Hitam Putih (Default OFF) */}
              <div className="flex items-center justify-between px-2.5 sm:px-3.5 py-2.5 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-900/75 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors shadow-2xs">
                <div className="min-w-0 pr-1.5 sm:pr-2">
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-100 block truncate">
                    Cetak Hitam Putih
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block truncate">
                    {isCertsGrayscale ? 'Dicetak Hitam Putih' : 'Dicetak Berwarna'}
                  </span>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={isCertsGrayscale}
                  onClick={() => setIsCertsGrayscale(!isCertsGrayscale)}
                  title={
                    isCertsGrayscale
                      ? 'Cetak hitam putih aktif (klik untuk cetak berwarna)'
                      : 'Cetak berwarna (klik untuk aktifkan cetak hitam putih)'
                  }
                  aria-label="Toggle Cetak Hitam Putih Sertifikasi"
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${
                    isCertsGrayscale ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                      isCertsGrayscale ? 'translate-x-4' : 'translate-x-0'
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
                    {isCertsCompressed ? 'Ukuran Dioptimalkan' : 'Kualitas Asli (Besar)'}
                  </span>
                </div>
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
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${
                    isCertsCompressed ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
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

          {/* Kolom Atas: Card Badge Sertifikat Terpilih (Hanya tampil jika ada yang dipilih) */}
          {selectedCertIds.length > 0 && (
            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
              <div className="flex flex-wrap items-center gap-1.5">
                {selectedCertIds.map((certId) => {
                  const cert = ALL_CERTIFICATES_LIST.find((c) => c.id === certId);
                  if (!cert) return null;
                  return (
                    <button
                      key={cert.id}
                      type="button"
                      onClick={() => handleRemoveCert(cert.id)}
                      className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-medium shadow-2xs transition-colors cursor-pointer select-none active:scale-95"
                      title={`Klik untuk melepaskan ${cert.title}`}
                    >
                      {cert.title}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Kolom Bawah: Badge-badge Putih Sertifikat */}
          {unselectedCertIds.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              {unselectedCertIds.map((certId) => {
                const cert = ALL_CERTIFICATES_LIST.find((c) => c.id === certId);
                if (!cert) return null;
                return (
                  <button
                    key={cert.id}
                    type="button"
                    onClick={() => handleAddCert(cert.id)}
                    className="inline-flex items-center px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 text-[11px] font-medium shadow-2xs transition-colors cursor-pointer select-none active:scale-95"
                    title={`Klik untuk memilih ${cert.title}`}
                  >
                    {cert.title}
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
