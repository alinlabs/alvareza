import React, { useState } from 'react';
import {
  Eye,
  RotateCw,
  RotateCcw,
  Download,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { ALL_AWARDS_LIST, AwardItemConfig } from '../../../../data/awards/awardsCatalog';
import { buildAwardsCompilationPdf } from '../../../../utils/portfolioPdfGenerator';
import { downloadBase64Pdf } from '../../../../utils/gasAttachmentPreview';

export interface AwardsSectionProps {
  selectedAwardIds?: string[];
  setSelectedAwardIds?: React.Dispatch<React.SetStateAction<string[]>>;
  showAwardsBreakdown?: boolean;
  setShowAwardsBreakdown?: React.Dispatch<React.SetStateAction<boolean>>;
  onOpenAwardsPreviewModal?: () => void;
  onResetAwards?: () => void;
}

export const AwardsSection: React.FC<AwardsSectionProps> = ({
  selectedAwardIds: externalSelectedIds,
  setSelectedAwardIds: setExternalSelectedIds,
  showAwardsBreakdown: externalShowBreakdown,
  setShowAwardsBreakdown: setExternalShowBreakdown,
  onOpenAwardsPreviewModal,
  onResetAwards,
}) => {
  // Default rekomendasi awal pilihan penghargaan (Top 3 Prestasi Utama)
  const defaultSelectedAwardIds = ['awd-1', 'awd-2', 'awd-3'];

  // Internal state jika props tidak disediakan dari parent
  const [internalSelectedIds, setInternalSelectedIds] = useState<string[]>(defaultSelectedAwardIds);
  const [internalShowBreakdown, setInternalShowBreakdown] = useState<boolean>(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  const selectedAwardIds = externalSelectedIds ?? internalSelectedIds;
  const setSelectedAwardIds = setExternalSelectedIds ?? setInternalSelectedIds;

  const showAwardsBreakdown = externalShowBreakdown ?? internalShowBreakdown;
  const setShowAwardsBreakdown = setExternalShowBreakdown ?? setInternalShowBreakdown;

  const unselectedAwardIds = ALL_AWARDS_LIST
    .map((a) => a.id)
    .filter((id) => !selectedAwardIds.includes(id));

  // Handler menambahkan penghargaan ke badge biru terpilih
  const handleAddAward = (awardId: string) => {
    setSelectedAwardIds((prev) => (prev.includes(awardId) ? prev : [...prev, awardId]));
  };

  // Handler melepaskan penghargaan kembali ke badge putih
  const handleRemoveAward = (awardId: string) => {
    setSelectedAwardIds((prev) => prev.filter((id) => id !== awardId));
  };

  // Handler reset ke pilihan awal
  const handleResetAwards = () => {
    if (onResetAwards) {
      onResetAwards();
    } else {
      setSelectedAwardIds(defaultSelectedAwardIds);
    }
  };

  const isChangedFromDefault = selectedAwardIds.length > 0;

  // Download PDF Kompilasi Penghargaan
  const handlePreviewDownloadPdf = async () => {
    if (selectedAwardIds.length === 0) return;
    try {
      setIsDownloadingPdf(true);
      const attachment = await buildAwardsCompilationPdf({
        selectedAwardIds,
        isCompressed: true,
        isGrayscale: true,
      });
      if (attachment?.base64) {
        downloadBase64Pdf(attachment.base64, attachment.filename || 'penghargaan-alvareza.pdf');
      }
    } catch (err) {
      console.error('Gagal mengunduh dokumen penghargaan:', err);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-start justify-between gap-2">
        <div
          onClick={() => setShowAwardsBreakdown((prev) => !prev)}
          className="min-w-0 flex-1 cursor-pointer select-none"
        >
          <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Penghargaan
          </h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
            {selectedAwardIds.length} Sertifikat & Piagam Fisik
          </p>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {/* Reset button */}
          <button
            type="button"
            onClick={handleResetAwards}
            disabled={!isChangedFromDefault}
            className={`p-1.5 rounded-lg transition-colors flex items-center justify-center ${
              isChangedFromDefault
                ? 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer'
                : 'text-slate-300 dark:text-slate-600 hover:text-slate-300 dark:hover:text-slate-600 cursor-not-allowed opacity-40'
            }`}
            title="Kembalikan ke pilihan rekomendasi awal penghargaan"
            aria-label="Reset Penghargaan"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Unduh / Preview Berkas Kompilasi Penghargaan */}
          <button
            type="button"
            onClick={handlePreviewDownloadPdf}
            disabled={isDownloadingPdf || selectedAwardIds.length === 0}
            className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            title="Unduh & Periksa Berkas Kompilasi Penghargaan Fisik"
          >
            {isDownloadingPdf ? (
              <RotateCw className="w-4 h-4 animate-spin text-blue-600 dark:text-blue-400" />
            ) : (
              <Download className="w-4 h-4" />
            )}
          </button>

          {/* Pratinjau Full View Penghargaan */}
          <button
            type="button"
            onClick={() => {
              if (onOpenAwardsPreviewModal) {
                onOpenAwardsPreviewModal();
              } else {
                window.location.href = '/prev?f=awd';
              }
            }}
            className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-center cursor-pointer"
            title="Lihat Pratinjau Penghargaan Terkait"
            aria-label="Lihat Pratinjau Penghargaan Terkait"
          >
            <Eye className="w-4 h-4" />
          </button>

          {/* Expand / Collapse Chevron */}
          <button
            type="button"
            onClick={() => setShowAwardsBreakdown((prev) => !prev)}
            className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-center cursor-pointer"
            title={showAwardsBreakdown ? 'Sembunyikan daftar penghargaan' : 'Tampilkan daftar penghargaan'}
          >
            {showAwardsBreakdown ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Breakdown Drawer: Badge Container & Sistem Badge Lengkap */}
      {showAwardsBreakdown && (
        <div className="space-y-2 text-xs animate-in fade-in duration-150">
          {/* Kolom Atas: Card Badge Penghargaan Terpilih */}
          {selectedAwardIds.length > 0 && (
            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
              <div className="flex flex-wrap items-center gap-1.5">
                {selectedAwardIds.map((awardId) => {
                  const awd = ALL_AWARDS_LIST.find((a) => a.id === awardId);
                  if (!awd) return null;
                  return (
                    <button
                      key={awd.id}
                      type="button"
                      onClick={() => handleRemoveAward(awd.id)}
                      className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-medium shadow-2xs transition-colors cursor-pointer select-none active:scale-95"
                      title={`Klik untuk melepaskan ${awd.title}`}
                    >
                      {awd.title}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Kolom Bawah: Badge-badge Putih Penghargaan Belum Terpilih */}
          {unselectedAwardIds.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              {unselectedAwardIds.map((awardId) => {
                const awd = ALL_AWARDS_LIST.find((a) => a.id === awardId);
                if (!awd) return null;
                return (
                  <button
                    key={awd.id}
                    type="button"
                    onClick={() => handleAddAward(awd.id)}
                    className="inline-flex items-center px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 text-[11px] font-medium shadow-2xs transition-colors cursor-pointer select-none active:scale-95"
                    title={`Klik untuk memilih ${awd.title}`}
                  >
                    {awd.title}
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

export default AwardsSection;
