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
  ALL_AWARDS_LIST,
  AwardItemConfig,
  sortAwardsChronologicalDesc,
} from '../../../../data/awards/awardsCatalog';
import { buildAwardsCompilationPdf } from '../../../../utils/portfolioPdfGenerator';
import { downloadBase64Pdf } from '../../../../utils/gasAttachmentPreview';

export interface AwardsSectionProps {
  selectedAwardIds?: string[];
  setSelectedAwardIds?: React.Dispatch<React.SetStateAction<string[]>>;
  showAwardsBreakdown?: boolean;
  setShowAwardsBreakdown?: React.Dispatch<React.SetStateAction<boolean>>;
  onOpenAwardsPreviewModal?: () => void;
  onResetAwards?: () => void;
  isAwardsGrayscale?: boolean;
  setIsAwardsGrayscale?: (val: boolean) => void;
  isAwardsCompressed?: boolean;
  setIsAwardsCompressed?: (val: boolean) => void;
  handlePreviewAwardsPdf?: () => void;
  isPreviewingAwards?: boolean;
}

/** Helper untuk memformat label badge: Tahun di depan dan menghapus kata "Sertifikat", "Piagam", "Certificate", "Apresiasi", "Penghargaan" */
export const formatAwardBadgeLabel = (title: string, year: string): string => {
  let cleanTitle = title;
  const prefixRegex = /^(Sertifikat|Piagam|Certificate\s+of\s+Appreciation|Certificate\s+of|Certificate|Apresiasi|Penghargaan|dan)\s+/i;
  while (prefixRegex.test(cleanTitle)) {
    cleanTitle = cleanTitle.replace(prefixRegex, '').trim();
  }
  return `${year} - ${cleanTitle}`;
};

export const AwardsSection: React.FC<AwardsSectionProps> = ({
  selectedAwardIds: externalSelectedIds,
  setSelectedAwardIds: setExternalSelectedIds,
  showAwardsBreakdown: externalShowBreakdown,
  setShowAwardsBreakdown: setExternalShowBreakdown,
  onOpenAwardsPreviewModal,
  onResetAwards,
  isAwardsGrayscale: externalIsGrayscale,
  setIsAwardsGrayscale: setExternalIsGrayscale,
  isAwardsCompressed: externalIsCompressed,
  setIsAwardsCompressed: setExternalIsCompressed,
  handlePreviewAwardsPdf,
  isPreviewingAwards = false,
}) => {
  // Default rekomendasi awal pilihan penghargaan (Top 3 Prestasi Utama)
  const defaultSelectedAwardIds = ['awd-1', 'awd-2', 'awd-3'];

  // Internal state jika props tidak disediakan dari parent
  const [internalSelectedIds, setInternalSelectedIds] = useState<string[]>(defaultSelectedAwardIds);
  const [internalShowBreakdown, setInternalShowBreakdown] = useState<boolean>(false);
  const [internalIsGrayscale, setInternalIsGrayscale] = useState<boolean>(false); // Default OFF
  const [internalIsCompressed, setInternalIsCompressed] = useState<boolean>(true); // Default ON
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  const selectedAwardIds = externalSelectedIds ?? internalSelectedIds;
  const setSelectedAwardIds = setExternalSelectedIds ?? setInternalSelectedIds;

  const showAwardsBreakdown = externalShowBreakdown ?? internalShowBreakdown;
  const setShowAwardsBreakdown = setExternalShowBreakdown ?? setInternalShowBreakdown;

  const isAwardsGrayscale = externalIsGrayscale ?? internalIsGrayscale;
  const setIsAwardsGrayscale = setExternalIsGrayscale ?? setInternalIsGrayscale;

  const isAwardsCompressed = externalIsCompressed ?? internalIsCompressed;
  const setIsAwardsCompressed = setExternalIsCompressed ?? setInternalIsCompressed;

  // Daftar penghargaan terpilih - urutan sesuai urutan klik / seleksi pengguna (bukan berdasarkan tahun)
  const sortedSelectedAwards = useMemo(() => {
    return selectedAwardIds
      .map((id) => ALL_AWARDS_LIST.find((a) => a.id === id))
      .filter((a): a is AwardItemConfig => Boolean(a));
  }, [selectedAwardIds]);

  // Daftar penghargaan belum terpilih - SELALU diurutkan dari tahun terbaru ke terlama
  const sortedUnselectedAwards = useMemo(() => {
    const unselected = ALL_AWARDS_LIST.filter((a) => !selectedAwardIds.includes(a.id));
    return sortAwardsChronologicalDesc(unselected);
  }, [selectedAwardIds]);

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
    setIsAwardsGrayscale(false);
    setIsAwardsCompressed(true);
  };

  const isChangedFromDefault =
    selectedAwardIds.length > 0 || isAwardsGrayscale || !isAwardsCompressed;

  // Download PDF Kompilasi Penghargaan
  const handlePreviewDownloadPdf = async () => {
    if (handlePreviewAwardsPdf) {
      handlePreviewAwardsPdf();
      return;
    }
    if (selectedAwardIds.length === 0) return;
    try {
      setIsDownloadingPdf(true);
      const attachment = await buildAwardsCompilationPdf({
        selectedAwardIds,
        isCompressed: isAwardsCompressed,
        isGrayscale: isAwardsGrayscale,
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
            {selectedAwardIds.length === 0
              ? '0 Sertifikat dipilih'
              : `${selectedAwardIds.length} Sertifikat & Piagam Fisik • ${
                  isAwardsGrayscale ? 'Hitam Putih' : 'Berwarna'
                }${isAwardsCompressed ? ' • Kompresi' : ''}`}
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
            disabled={isDownloadingPdf || isPreviewingAwards || selectedAwardIds.length === 0}
            className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            title="Unduh & Periksa Berkas Kompilasi Penghargaan Fisik"
          >
            {isDownloadingPdf || isPreviewingAwards ? (
              <RotateCw className="w-4 h-4 animate-spin text-blue-600 dark:text-blue-400" />
            ) : (
              <Download className="w-4 h-4" />
            )}
          </button>

          {/* Pratinjau Modal Penghargaan (Buka Modal Preview, bukan full view) */}
          <button
            type="button"
            onClick={() => {
              if (onOpenAwardsPreviewModal) {
                onOpenAwardsPreviewModal();
              }
            }}
            disabled={selectedAwardIds.length === 0}
            className={`p-1.5 rounded-lg transition-colors flex items-center justify-center ${
              selectedAwardIds.length === 0
                ? 'text-slate-300 dark:text-slate-600 cursor-not-allowed opacity-40'
                : 'text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer'
            }`}
            title={
              selectedAwardIds.length === 0
                ? 'Pilih minimal 1 penghargaan untuk melihat pratinjau'
                : 'Lihat Pratinjau Penghargaan Terkait'
            }
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

      {/* Breakdown Drawer: 2 Cards Pengaturan (Cetak Hitam Putih & Kompresi File) + List Badges */}
      {showAwardsBreakdown && (
        <div className="space-y-2 text-xs animate-in fade-in duration-150">
          {/* 2 Card Pengaturan (Cetak Hitam Putih & Kompresi File) - Tampil saat ada pilihan terpilih */}
          {selectedAwardIds.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {/* Card 1: Cetak Hitam Putih (Default OFF) */}
              <div className="flex items-center justify-between px-2.5 sm:px-3.5 py-2.5 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-900/75 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors shadow-2xs">
                <div className="min-w-0 pr-1.5 sm:pr-2">
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-100 block truncate">
                    Cetak Hitam Putih
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block truncate">
                    {isAwardsGrayscale ? 'Dicetak Hitam Putih' : 'Dicetak Berwarna'}
                  </span>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={isAwardsGrayscale}
                  onClick={() => setIsAwardsGrayscale(!isAwardsGrayscale)}
                  title={
                    isAwardsGrayscale
                      ? 'Cetak hitam putih aktif (klik untuk cetak berwarna)'
                      : 'Cetak berwarna (klik untuk aktifkan cetak hitam putih)'
                  }
                  aria-label="Toggle Cetak Hitam Putih Penghargaan"
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${
                    isAwardsGrayscale ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                      isAwardsGrayscale ? 'translate-x-4' : 'translate-x-0'
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
                    {isAwardsCompressed ? 'Ukuran Dioptimalkan' : 'Kualitas Asli (Besar)'}
                  </span>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={isAwardsCompressed}
                  onClick={() => setIsAwardsCompressed(!isAwardsCompressed)}
                  title={
                    isAwardsCompressed
                      ? 'Kompresi file aktif (ukuran dioptimalkan)'
                      : 'Kompresi file nonaktif (kualitas asli gambar)'
                  }
                  aria-label="Toggle Kompresi File Penghargaan"
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${
                    isAwardsCompressed ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                      isAwardsCompressed ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          {/* Kolom Atas: Card Badge Penghargaan Terpilih (Urut Terbaru ke Terlama) */}
          {sortedSelectedAwards.length > 0 && (
            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
              <div className="flex flex-wrap items-center gap-1.5">
                {sortedSelectedAwards.map((awd) => (
                  <button
                    key={awd.id}
                    type="button"
                    onClick={() => handleRemoveAward(awd.id)}
                    className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-medium shadow-2xs transition-colors cursor-pointer select-none active:scale-95"
                    title={`Klik untuk melepaskan ${awd.title}`}
                  >
                    {formatAwardBadgeLabel(awd.title, awd.year)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Kolom Bawah: Badge-badge Putih Penghargaan Belum Terpilih (Urut Terbaru ke Terlama) */}
          {sortedUnselectedAwards.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              {sortedUnselectedAwards.map((awd) => (
                <button
                  key={awd.id}
                  type="button"
                  onClick={() => handleAddAward(awd.id)}
                  className="inline-flex items-center px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 text-[11px] font-medium shadow-2xs transition-colors cursor-pointer select-none active:scale-95"
                  title={`Klik untuk memilih ${awd.title}`}
                >
                  {formatAwardBadgeLabel(awd.title, awd.year)}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AwardsSection;
