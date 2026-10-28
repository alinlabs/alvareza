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
}) => {
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
    if (selectedCertIds.length !== defaultCertIds.length) return true;
    for (let i = 0; i < selectedCertIds.length; i++) {
      if (selectedCertIds[i] !== defaultCertIds[i]) return true;
    }
    if (unselectedCertIds.length !== defaultUnselectedCertIds.length) return true;
    for (let i = 0; i < unselectedCertIds.length; i++) {
      if (unselectedCertIds[i] !== defaultUnselectedCertIds[i]) return true;
    }
    return false;
  }, [selectedCertIds, defaultCertIds, unselectedCertIds, defaultUnselectedCertIds]);

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
    setUnselectedCertIds(defaultUnselectedCertIds);
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-start justify-between gap-2">
        <div
          onClick={() => setShowCertsBreakdown((prev) => !prev)}
          className="min-w-0 flex-1 cursor-pointer select-none"
        >
          <h4 className="text-xs font-bold text-slate-900 hover:text-blue-600 transition-colors">
            Sertifikasi Terkait
          </h4>
          <p className="text-[11px] text-slate-500 truncate mt-0.5">
            {selectedCertIds.length} Sertifikat Fisik
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
                ? 'text-slate-500 hover:text-slate-800 hover:bg-slate-100 cursor-pointer'
                : 'text-slate-300 hover:text-slate-300 cursor-not-allowed opacity-40'
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
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            title="Unduh & Periksa Berkas Kompilasi Sertifikat Fisik"
          >
            {isPreviewingCerts ? (
              <RotateCw className="w-4 h-4 animate-spin text-blue-600" />
            ) : (
              <Download className="w-4 h-4" />
            )}
          </button>

          {/* 2. Pratinjau Modal Sertifikasi (Icon Mata di kiri dropdown) */}
          {onOpenCertsPreviewModal && (
            <button
              type="button"
              onClick={onOpenCertsPreviewModal}
              className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-center cursor-pointer"
              title="Lihat Pratinjau Sertifikasi Terkait"
              aria-label="Lihat Pratinjau Sertifikasi Terkait"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowCertsBreakdown((prev) => !prev)}
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-center cursor-pointer"
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

      {/* Breakdown Drawer: Badge Container & Sistem Badge Lengkap */}
      {showCertsBreakdown && (
        <div className="space-y-2 text-xs animate-in fade-in duration-150">
          {/* Kolom Atas: Card Badge Sertifikat Terpilih (Badge Biru, Teks Putih, ADA CARD PEMBUNGKUS) */}
          <div className="p-2.5 rounded-xl bg-white border border-slate-200 min-h-[44px] shadow-2xs">
            {selectedCertIds.length > 0 ? (
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
                      title={`Klik untuk melepaskan ${cert.title} (pindah ke akhir daftar badge putih)`}
                    >
                      {cert.title}
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="text-slate-400 text-[11px] italic py-1 px-1">
                Belum ada sertifikat yang dipilih. Klik badge di bawah untuk memilih.
              </p>
            )}
          </div>

          {/* Kolom Bawah: Badge-badge Putih Sertifikat (TIDAK ADA CARD PEMBUNGKUS) */}
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
                    className="inline-flex items-center px-2.5 py-1 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 text-slate-700 hover:text-blue-600 text-[11px] font-medium shadow-2xs transition-colors cursor-pointer select-none active:scale-95"
                    title={`Klik untuk memilih ${cert.title} (pindah ke akhir sertifikat)`}
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
