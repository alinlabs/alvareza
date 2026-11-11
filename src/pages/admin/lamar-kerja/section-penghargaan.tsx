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
} from '../../../data/penghargaan';
import { buildAwardsCompilationPdf } from '../../../utils/pdf-engine/portofolio';
import { downloadBase64Pdf } from '../../../utils/google-apps-script/preview';

export interface AwardsSectionProps {
  selectedAwardIds?: string[];
  setSelectedAwardIds?: React.Dispatch<React.SetStateAction<string[]>>;
  defaultAwardIds?: string[];
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

/** Map penamaan ringkas badge card penghargaan untuk modal lamar kerja */
export const SHORT_AWARD_BADGE_MAP: Record<string, string> = {
  'awd-1': '2025 SC PKKMB',
  'awd-2': '2025 EM WSC',
  'awd-3': '2025 Ketua BEM',
  'awd-4': '2025 Director Tak Kasat',
  'awd-5': '2025 Pemateri Edufest',
  'awd-6': '2024 MC PORSA',
  'awd-7': '2024 Pembicara FOSTA',
  'awd-8': '2024 Pembicara KWU',
  'awd-9': '2024 HBE KWU',
  'awd-10': '2023 Moderator KEMENKEU',
  'awd-11': '2023 Juri UPPKA',
  'awd-12': '2023 Winner Duta GenRe',
  'awd-13': '2023 Moderator SKI',
  'awd-14': '2022 Mahasiswa Terbaik',
  'awd-15': '2019 Juara 2 Pidato',
  'awd-16': '2019 Juara 1 Pidato',
  'awd-17': '2019 Juara H II Pidato',
  'awd-18': '2017 PASKIBRA',
  'awd-19': '2017 OSN SMP',
};

/** Helper untuk memformat label badge: Tahun di depan dan nama ringkas spesifik (tanpa stripe/strip "-") */
export const formatAwardBadgeLabel = (title: string, year: string, id?: string): string => {
  if (id && SHORT_AWARD_BADGE_MAP[id]) {
    return SHORT_AWARD_BADGE_MAP[id];
  }

  // Lookup berdasarkan kesamaan kata kunci judul jika ID tidak langsung diberikan
  if (title.includes('Steering Committee') || title.includes('PKKMB STIE Wikara 2025')) return '2025 SC PKKMB';
  if (title.includes('Stand Up Comedy Champion') || title.includes('Piala Gubernur')) return '2025 EM WSC';
  if (title.includes('Ketua Badan Eksekutif Mahasiswa') || title.includes('BEM STIE Wikara')) return '2025 Ketua BEM';
  if (title.includes('Director Film Tak Kasat') || title.includes('Gunung Hejo')) return '2025 Director Tak Kasat';
  if (title.includes('Pemateri Edufest') || title.includes('Edufest Purwakarta')) return '2025 Pemateri Edufest';
  if (title.includes('Master of Ceremony') && title.includes('PORSA')) return '2024 MC PORSA';
  if (title.includes('Berani Jadi Beda') || title.includes('FOSTA')) return '2024 Pembicara FOSTA';
  if (title.includes('Menggali Potensi Diri') || (title.includes('Mini Seminar') && title.includes('2024'))) return '2024 Pembicara KWU';
  if (title.includes('Head of the Business Education') || title.includes('HBE')) return '2024 HBE KWU';
  if (title.includes('Ministry of Finance') || title.includes('Kemenkeu')) return '2023 Moderator KEMENKEU';
  if (title.includes('Dewan Juri') || title.includes('UPPKA')) return '2023 Juri UPPKA';
  if (title.includes('Winner Duta Generasi Berencana') || title.includes('Duta GenRe')) return '2023 Winner Duta GenRe';
  if (title.includes('Seminar Keorganisasian Indonesia')) return '2023 Moderator SKI';
  if (title.includes('Mahasiswa Terbaik') && title.includes('2022')) return '2022 Mahasiswa Terbaik';
  if (title.includes('Juara 2') && title.includes('Pidato')) return '2019 Juara 2 Pidato';
  if (title.includes('Juara 1') && title.includes('Pidato')) return '2019 Juara 1 Pidato';
  if (title.includes('Juara Harapan II') || title.includes('Bulan Bahasa')) return '2019 Juara H II Pidato';
  if (title.includes('PASKIBRA') || title.includes('Pengibar Bendera')) return '2017 PASKIBRA';
  if (title.includes('Olimpiade Sains Nasional') || title.includes('OSN')) return '2017 OSN SMP';

  let cleanTitle = title;
  const prefixRegex = /^(Sertifikat|Piagam|Certificate\s+of\s+Appreciation|Certificate\s+of|Certificate|Apresiasi|Penghargaan|dan)\s+/i;
  while (prefixRegex.test(cleanTitle)) {
    cleanTitle = cleanTitle.replace(prefixRegex, '').trim();
  }
  return `${year} ${cleanTitle}`;
};

export const AwardsSection: React.FC<AwardsSectionProps> = ({
  selectedAwardIds: externalSelectedIds,
  setSelectedAwardIds: setExternalSelectedIds,
  defaultAwardIds: externalDefaultAwardIds,
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
  const [internalIsGrayscale, setInternalIsGrayscale] = useState<boolean>(false); // Default OFF (Cetak Warna ON)
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

  // Daftar seluruh penghargaan terurut secara kronologis dari terbaru ke terlama
  const sortedAllAwards = useMemo(() => {
    return sortAwardsChronologicalDesc(ALL_AWARDS_LIST);
  }, []);

  // Handler toggle status seleksi penghargaan (tetap di tempatnya)
  const handleToggleAward = (awardId: string) => {
    setSelectedAwardIds((prev) =>
      prev.includes(awardId) ? prev.filter((id) => id !== awardId) : [...prev, awardId]
    );
  };

  // Handler reset ke pilihan awal rekomendasi
  const handleResetAwards = () => {
    if (onResetAwards) {
      onResetAwards();
    } else {
      setSelectedAwardIds(externalDefaultAwardIds ?? defaultSelectedAwardIds);
    }
    setIsAwardsGrayscale(false);
    setIsAwardsCompressed(true);
  };

  // Evaluasi apakah pengguna telah mengubah opsi dari rekomendasi default
  const defaultAwardList = externalDefaultAwardIds ?? defaultSelectedAwardIds;
  const isSelectionChanged = useMemo(() => {
    if (selectedAwardIds.length !== defaultAwardList.length) return true;
    const sortedSel = [...selectedAwardIds].sort();
    const sortedDef = [...defaultAwardList].sort();
    return !sortedSel.every((val, idx) => val === sortedDef[idx]);
  }, [selectedAwardIds, defaultAwardList]);

  const isColorChanged = isAwardsGrayscale !== false; // Default: Cetak Warna ON (isAwardsGrayscale = false)
  const isCompressionChanged = isAwardsCompressed !== true; // Default: Kompresi File ON (isAwardsCompressed = true)

  const isChangedFromDefault = isSelectionChanged || isColorChanged || isCompressionChanged;

  // Format subtitle header: [jumlah] Hal, Berwarna, Dikompresi
  const headerSubtitleText = useMemo(() => {
    const parts: string[] = [];
    parts.push(`${selectedAwardIds.length} Hal`);
    parts.push(!isAwardsGrayscale ? 'Berwarna' : 'Hitam Putih');
    if (isAwardsCompressed) {
      parts.push('Dikompresi');
    }
    return parts.join(', ');
  }, [selectedAwardIds.length, isAwardsGrayscale, isAwardsCompressed]);

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
            {headerSubtitleText}
          </p>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {/* Reset/Refresh button - TAMPIL HANYA JIKA ADA PERUBAHAN MANUAL OLEH USER */}
          {isChangedFromDefault && (
            <button
              type="button"
              onClick={handleResetAwards}
              className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-center cursor-pointer animate-in fade-in duration-150"
              title="Kembalikan ke pilihan rekomendasi awal penghargaan"
              aria-label="Reset Penghargaan"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

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

          {/* Pratinjau Modal Penghargaan */}
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

      {/* Breakdown Drawer: 2 Card Pengaturan Ringkas (Cetak Warna & Kompresi File) + List Badges 2 Kolom */}
      {showAwardsBreakdown && (
        <div className="space-y-2 text-xs animate-in fade-in duration-150">
          {/* 2 Card Pengaturan Ringkas Dibungkus Card Box - Tampil saat ada pilihan terpilih */}
          {selectedAwardIds.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {/* Card 1: Cetak Warna (Default ON / Aktif) */}
              <div className="flex items-center justify-between px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-900/75 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors shadow-2xs">
                <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                  Cetak Warna
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={!isAwardsGrayscale}
                  onClick={() => setIsAwardsGrayscale(!isAwardsGrayscale)}
                  title={
                    !isAwardsGrayscale
                      ? 'Cetak warna aktif (klik untuk cetak hitam putih)'
                      : 'Cetak warna nonaktif (klik untuk aktifkan cetak warna)'
                  }
                  aria-label="Toggle Cetak Warna Penghargaan"
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    !isAwardsGrayscale ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                      !isAwardsGrayscale ? 'translate-x-4' : 'translate-x-0'
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
                  aria-checked={isAwardsCompressed}
                  onClick={() => setIsAwardsCompressed(!isAwardsCompressed)}
                  title={
                    isAwardsCompressed
                      ? 'Kompresi file aktif (ukuran dioptimalkan)'
                      : 'Kompresi file nonaktif (kualitas asli gambar)'
                  }
                  aria-label="Toggle Kompresi File Penghargaan"
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isAwardsCompressed ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600'
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

          {/* Grid Badge Responsive: 2 Kolom di Mobile, 3 Kolom di Desktop (Tanpa Card Pemisah) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 pt-0.5">
            {sortedAllAwards.map((awd) => {
              const selectedIndex = selectedAwardIds.indexOf(awd.id);
              const isSelected = selectedIndex !== -1;
              const orderNumber = selectedIndex + 1;

              return (
                <button
                  key={awd.id}
                  type="button"
                  onClick={() => handleToggleAward(awd.id)}
                  className={`w-full inline-flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] font-medium shadow-2xs transition-all cursor-pointer select-none active:scale-95 text-left gap-1.5 min-w-0 ${
                    isSelected
                      ? 'bg-blue-600 hover:bg-blue-700 text-white border border-blue-600 font-semibold'
                      : 'bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
                  title={
                    isSelected
                      ? `Urutan ke-${orderNumber} • Klik untuk melepaskan ${awd.title}`
                      : `Klik untuk memilih ${awd.title}`
                  }
                >
                  <span className="truncate min-w-0 flex-1">
                    {formatAwardBadgeLabel(awd.title, awd.year, awd.id)}
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

export default AwardsSection;
