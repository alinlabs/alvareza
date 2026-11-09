import React, { useState, useMemo } from 'react';
import {
  Eye,
  RotateCw,
  Download,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { ALL_IDENTITY_DOCS } from '../../../../data/identityDocs';

export interface IdentitySectionProps {
  selectedIdentityIds: string[];
  showIdentityBreakdown: boolean;
  setShowIdentityBreakdown: React.Dispatch<React.SetStateAction<boolean>>;
  handlePreviewIdentityPdf: () => void;
  isPreviewingIdentity: boolean;
  onOpenIdentityPreviewModal?: () => void;
  handleToggleIdentityDoc: (docId: string) => void;
  onResetIdentity?: () => void;
  isIdentityColorPrint?: boolean;
  setIsIdentityColorPrint?: (val: boolean) => void;
  isIdentitySeparatePhotoPrint?: boolean;
  setIsIdentitySeparatePhotoPrint?: (val: boolean) => void;
}

export const IdentitySection: React.FC<IdentitySectionProps> = ({
  selectedIdentityIds,
  showIdentityBreakdown,
  setShowIdentityBreakdown,
  handlePreviewIdentityPdf,
  isPreviewingIdentity,
  onOpenIdentityPreviewModal,
  handleToggleIdentityDoc,
  onResetIdentity,
  isIdentityColorPrint = false,
  setIsIdentityColorPrint,
  isIdentitySeparatePhotoPrint = false,
  setIsIdentitySeparatePhotoPrint,
}) => {
  const defaultIdentityIds = useMemo<string[]>(() => [], []);
  const defaultUnselectedIdentityIds = useMemo(() => {
    return ALL_IDENTITY_DOCS
      .map((d) => d.id)
      .filter((id) => !defaultIdentityIds.includes(id));
  }, [defaultIdentityIds]);

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

  // Urutan list badge putih dokumen identitas (yang belum dipilih)
  const unselectedIdentityIds = useMemo(() => {
    return ALL_IDENTITY_DOCS
      .map((d) => d.id)
      .filter((id) => !selectedIdentityIds.includes(id));
  }, [selectedIdentityIds]);

  const isIdentityChangedFromDefault = useMemo(() => {
    return selectedIdentityIds.length > 0 || isIdentityColorPrint || isIdentitySeparatePhotoPrint;
  }, [selectedIdentityIds, isIdentityColorPrint, isIdentitySeparatePhotoPrint]);

  const handleAddIdentityDoc = (docId: string) => {
    handleToggleIdentityDoc(docId);
  };

  const handleRemoveIdentityDoc = (docId: string) => {
    handleToggleIdentityDoc(docId);
  };

  const handleReset = () => {
    if (onResetIdentity) {
      onResetIdentity();
    }
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
            {selectedIdentityIds.length === 0
              ? '0 Dokumen dipilih'
              : `${selectedIdentityIds.length} Dokumen, ${isIdentityColorPrint ? 'Berwarna' : 'Hitam Putih'}${
                  hasSelectedPhotos && isIdentitySeparatePhotoPrint
                    ? hasSelectedOtherDocs
                      ? ' • Cetak Terpisah'
                      : ' • Full Foto'
                    : ''
                }`}
          </p>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {/* 1. Unduh / Preview PDF (Icon Download di kiri icon mata) */}
          <button
            type="button"
            onClick={handlePreviewIdentityPdf}
            disabled={isPreviewingIdentity || selectedIdentityIds.length === 0}
            className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            title={
              selectedIdentityIds.length === 0
                ? 'Pilih minimal 1 dokumen identitas untuk diunduh'
                : hasSelectedPhotos && hasSelectedOtherDocs && isIdentitySeparatePhotoPrint
                ? 'Unduh 2 Berkas Terpisah (identitas-alvareza.pdf & foto-alvareza.pdf)'
                : hasSelectedPhotos && !hasSelectedOtherDocs && isIdentitySeparatePhotoPrint
                ? 'Unduh Berkas Foto Full Area (foto-alvareza.pdf)'
                : 'Unduh Berkas Dokumen Identitas PDF (identitas-alvareza.pdf)'
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

      {/* Breakdown Drawer: Cetak Berwarna, Badge Container & Sistem Badge Identitas */}
      {showIdentityBreakdown && (
        <div className="space-y-2 text-xs animate-in fade-in duration-150">
          {/* Card Pengaturan Cetak - Hanya tampil jika ada dokumen identitas yang dipilih */}
          {selectedIdentityIds.length > 0 && (
            <div className={`grid gap-2 ${hasSelectedPhotos ? 'grid-cols-2' : 'grid-cols-1'}`}>
              {/* Card Cetak Foto: Berlabel "Cetak Terpisah" jika ada dokumen lain, atau "Full Foto" jika hanya foto saja */}
              {hasSelectedPhotos && (
                <div className="flex items-center justify-between px-2.5 sm:px-3.5 py-2.5 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-900/75 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors shadow-2xs">
                  <div className="min-w-0 pr-1.5 sm:pr-2">
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-100 block truncate">
                      {hasSelectedOtherDocs ? 'Cetak Terpisah' : 'Full Foto'}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 block truncate">
                      {hasSelectedOtherDocs
                        ? isIdentitySeparatePhotoPrint
                          ? 'File terpisah'
                          : 'File Digabung'
                        : isIdentitySeparatePhotoPrint
                        ? 'Foto dicetak full'
                        : 'Dicetak dalam A4'}
                    </span>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={isIdentitySeparatePhotoPrint}
                    onClick={() =>
                      setIsIdentitySeparatePhotoPrint &&
                      setIsIdentitySeparatePhotoPrint(!isIdentitySeparatePhotoPrint)
                    }
                    title={
                      hasSelectedOtherDocs
                        ? isIdentitySeparatePhotoPrint
                          ? 'Cetak terpisah aktif (2 berkas: foto-alvareza.pdf full area & identitas-alvareza.pdf)'
                          : 'Cetak terpisah nonaktif (1 berkas: foto & identitas digabung di kertas A4 identitas-alvareza.pdf)'
                        : isIdentitySeparatePhotoPrint
                        ? 'Full foto aktif (foto-alvareza.pdf dicetak full area gambar)'
                        : 'Full foto nonaktif (foto dicetak di kertas A4 identitas-alvareza.pdf dengan teks lampiran)'
                    }
                    aria-label={hasSelectedOtherDocs ? 'Toggle Cetak Terpisah' : 'Toggle Full Foto'}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${
                      isIdentitySeparatePhotoPrint ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
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

              {/* Pertanyaan Cetak Berwarna dengan Seekbar (Khusus Section Identitas) */}
              <div className="flex items-center justify-between px-2.5 sm:px-3.5 py-2.5 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-900/75 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors shadow-2xs">
                <div className="min-w-0 pr-1.5 sm:pr-2">
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-100 block truncate">Cetak Berwarna</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block truncate">
                    {isIdentityColorPrint ? 'Dicetak Berwarna' : 'Dicetak Hitam Putih'}
                  </span>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={isIdentityColorPrint}
                  onClick={() => setIsIdentityColorPrint && setIsIdentityColorPrint(!isIdentityColorPrint)}
                  title={
                    isIdentityColorPrint
                      ? 'Cetak identitas berwarna aktif (klik untuk cetak hitam putih)'
                      : 'Cetak identitas hitam putih (klik untuk aktifkan cetak berwarna)'
                  }
                  aria-label="Toggle Cetak Berwarna Identitas"
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${
                    isIdentityColorPrint ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                      isIdentityColorPrint ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          {/* Kolom Atas: Card Badge Dokumen Identitas Terpilih (Hanya tampil jika ada yang dipilih) */}
          {selectedIdentityIds.length > 0 && (
            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
              <div className="flex flex-wrap items-center gap-1.5">
                {selectedIdentityIds.map((docId) => {
                  const doc = ALL_IDENTITY_DOCS.find((d) => d.id === docId);
                  if (!doc) return null;
                  return (
                    <button
                      key={doc.id}
                      type="button"
                      onClick={() => handleRemoveIdentityDoc(doc.id)}
                      className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-medium shadow-2xs transition-colors cursor-pointer select-none active:scale-95"
                      title={`Klik untuk melepaskan ${doc.title} (pindah ke bawah)`}
                    >
                      {doc.badgeLabel}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Kolom Bawah: Badge-badge Putih Dokumen Identitas (TIDAK ADA CARD PEMBUNGKUS) */}
          {unselectedIdentityIds.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              {unselectedIdentityIds.map((docId) => {
                const doc = ALL_IDENTITY_DOCS.find((d) => d.id === docId);
                if (!doc) return null;
                return (
                  <button
                    key={doc.id}
                    type="button"
                    onClick={() => handleAddIdentityDoc(doc.id)}
                    className="inline-flex items-center px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 text-[11px] font-medium shadow-2xs transition-colors cursor-pointer select-none active:scale-95"
                    title={`Klik untuk memilih ${doc.title}`}
                  >
                    {doc.badgeLabel}
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
