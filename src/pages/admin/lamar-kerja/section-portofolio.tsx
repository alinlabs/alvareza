import React, { useState, useMemo } from 'react';
import {
  Eye,
  RotateCw,
  RotateCcw,
  Download,
  ChevronUp,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import {
  ALL_PORTFOLIO_SLIDES,
  isHrPosition,
  isRecruitmentScreeningFocus,
  getAdaptivePortfolioSlides,
} from '../../../utils/google-apps-script/generator';

export interface PortfolioSectionProps {
  selectedPortfolioSlideIds: string[];
  defaultPortfolioSlideIds?: string[];
  showPortfolioBreakdown: boolean;
  setShowPortfolioBreakdown: React.Dispatch<React.SetStateAction<boolean>>;
  handlePreviewPortfolioPdf: () => void;
  isPreviewingPortfolio: boolean;
  onOpenPortfolioPreviewModal?: () => void;
  handleTogglePortfolioSlide: (slideId: string) => void;
  onResetPortfolio?: () => void;
  selectedCvPreset: string;
  jobTitle: string;
  isPortfolioGrayscale?: boolean;
  setIsPortfolioGrayscale?: (val: boolean) => void;
  isPortfolioCompressed?: boolean;
  setIsPortfolioCompressed?: (val: boolean) => void;
}

export const PortfolioSection: React.FC<PortfolioSectionProps> = ({
  selectedPortfolioSlideIds,
  defaultPortfolioSlideIds: externalDefaultSlideIds,
  showPortfolioBreakdown,
  setShowPortfolioBreakdown,
  handlePreviewPortfolioPdf,
  isPreviewingPortfolio,
  onOpenPortfolioPreviewModal,
  handleTogglePortfolioSlide,
  onResetPortfolio,
  selectedCvPreset,
  jobTitle,
  isPortfolioGrayscale: externalIsGrayscale,
  setIsPortfolioGrayscale: setExternalIsGrayscale,
  isPortfolioCompressed: externalIsCompressed,
  setIsPortfolioCompressed: setExternalIsCompressed,
}) => {
  // Internal state fallback
  const [internalIsGrayscale, setInternalIsGrayscale] = useState<boolean>(false); // Default OFF (Cetak Warna ON)
  const [internalIsCompressed, setInternalIsCompressed] = useState<boolean>(true); // Default ON

  const isPortfolioGrayscale = externalIsGrayscale ?? internalIsGrayscale;
  const setIsPortfolioGrayscale = setExternalIsGrayscale ?? setInternalIsGrayscale;

  const isPortfolioCompressed = externalIsCompressed ?? internalIsCompressed;
  const setIsPortfolioCompressed = setExternalIsCompressed ?? setInternalIsCompressed;

  // Rekomendasi Portofolio default berdasarkan Role (Preset) yang dipilih
  const defaultSlideList = useMemo(() => {
    return (
      externalDefaultSlideIds ??
      getAdaptivePortfolioSlides(selectedCvPreset || 'optimal', {
        jobTitle,
      }).map((s) => s.id)
    );
  }, [externalDefaultSlideIds, selectedCvPreset, jobTitle]);

  // Evaluasi apakah portofolio diubah dari rekomendasi default
  const isPortfolioChangedFromDefault = useMemo(() => {
    if (isPortfolioGrayscale || !isPortfolioCompressed) return true;
    if (selectedPortfolioSlideIds.length !== defaultSlideList.length) return true;
    const sortedSel = [...selectedPortfolioSlideIds].sort();
    const sortedDef = [...defaultSlideList].sort();
    return !sortedSel.every((val, idx) => val === sortedDef[idx]);
  }, [isPortfolioGrayscale, isPortfolioCompressed, selectedPortfolioSlideIds, defaultSlideList]);

  // Format subtitle header: [jumlah] Hal, Berwarna, Dikompresi
  const headerSubtitleText = useMemo(() => {
    const parts: string[] = [];
    parts.push(`${selectedPortfolioSlideIds.length} Hal`);
    parts.push(!isPortfolioGrayscale ? 'Berwarna' : 'Hitam Putih');
    if (isPortfolioCompressed) {
      parts.push('Dikompresi');
    }
    return parts.join(', ');
  }, [selectedPortfolioSlideIds.length, isPortfolioGrayscale, isPortfolioCompressed]);

  // Handler reset portofolio ke rekomendasi awal role
  const handleResetPortfolio = () => {
    if (onResetPortfolio) {
      onResetPortfolio();
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
          onClick={() => setShowPortfolioBreakdown((prev) => !prev)}
          className="min-w-0 flex-1 cursor-pointer select-none"
        >
          <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            Portofolio
          </h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
            {headerSubtitleText}
          </p>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {/* Reset button - HANYA TAMPIL JIKA ADA PERUBAHAN MANUAL */}
          {isPortfolioChangedFromDefault && (
            <button
              type="button"
              onClick={handleResetPortfolio}
              className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-center cursor-pointer animate-in fade-in duration-150"
              title="Kembalikan ke rekomendasi awal portofolio sesuai role"
              aria-label="Kembalikan Portofolio ke Rekomendasi Awal"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

          {/* Unduh / Preview Portofolio PDF */}
          <button
            type="button"
            onClick={handlePreviewPortfolioPdf}
            disabled={isPreviewingPortfolio || selectedPortfolioSlideIds.length === 0}
            className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            title="Unduh & Periksa Portofolio Terpilih"
          >
            {isPreviewingPortfolio ? (
              <RotateCw className="w-4 h-4 animate-spin text-blue-600 dark:text-blue-400" />
            ) : (
              <Download className="w-4 h-4" />
            )}
          </button>

          {/* Pratinjau Modal Portofolio */}
          {onOpenPortfolioPreviewModal && (
            <button
              type="button"
              onClick={onOpenPortfolioPreviewModal}
              disabled={selectedPortfolioSlideIds.length === 0}
              className={`p-1.5 rounded-lg transition-colors flex items-center justify-center ${
                selectedPortfolioSlideIds.length === 0
                  ? 'text-slate-300 dark:text-slate-600 cursor-not-allowed opacity-40'
                  : 'text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer'
              }`}
              title={
                selectedPortfolioSlideIds.length === 0
                  ? 'Pilih minimal 1 slide portofolio untuk melihat pratinjau'
                  : 'Lihat Pratinjau Portofolio Eksekutif'
              }
              aria-label="Lihat Pratinjau Portofolio Eksekutif"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowPortfolioBreakdown((prev) => !prev)}
            className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-center cursor-pointer"
            title={showPortfolioBreakdown ? 'Sembunyikan daftar slide' : 'Tampilkan daftar slide'}
          >
            {showPortfolioBreakdown ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Breakdown Drawer: HR Banner + 2 Card Pengaturan Toggle + List Badges 2 Kolom Mobile / 3 Kolom Desktop */}
      {showPortfolioBreakdown && (
        <div className="space-y-2 text-xs animate-in fade-in duration-150">
          {/* HR Specific Prioritization Helper Banner */}
          {isHrPosition(selectedCvPreset, jobTitle) && (
            <div className="p-2.5 rounded-xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/60 text-blue-950 dark:text-blue-100 text-xs flex items-start gap-2 shadow-2xs">
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5 min-w-0">
                <p className="font-semibold text-[11px] text-blue-900 dark:text-blue-200">
                  {isRecruitmentScreeningFocus(selectedCvPreset, jobTitle)
                    ? 'Prioritas Portofolio HR (Rekrutmen & Screening): Talenty & HR Matrix'
                    : 'Prioritas Portofolio HR (Sistem Menyeluruh): HR Matrix & Talenty'}
                </p>
                <p className="text-[10px] text-blue-700 dark:text-blue-300 leading-relaxed">
                  {isRecruitmentScreeningFocus(selectedCvPreset, jobTitle)
                    ? 'Portofolio difokuskan pada aplikasi Talenty (proses rekrutmen, tes & asesmen, scoring pelamar) didukung HR Matrix (sistem HR menyeluruh).'
                    : 'Portofolio difokuskan pada aplikasi HR Matrix (sistem HR end-to-end pasca-onboarding: presensi QR, payroll, BPJS & KPI) didukung Talenty (rekrutmen & screening).'}
                </p>
              </div>
            </div>
          )}

          {/* 2 Card Pengaturan Toggle Ringkas - Tampil saat ada slide terpilih */}
          {selectedPortfolioSlideIds.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {/* Card 1: Cetak Warna (Default ON / Aktif) */}
              <div className="flex items-center justify-between px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-900/75 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors shadow-2xs">
                <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                  Cetak Warna
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={!isPortfolioGrayscale}
                  onClick={() => setIsPortfolioGrayscale(!isPortfolioGrayscale)}
                  title={
                    !isPortfolioGrayscale
                      ? 'Cetak warna aktif (klik untuk cetak hitam putih)'
                      : 'Cetak warna nonaktif (klik untuk aktifkan cetak warna)'
                  }
                  aria-label="Toggle Cetak Warna Portofolio"
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    !isPortfolioGrayscale ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                      !isPortfolioGrayscale ? 'translate-x-4' : 'translate-x-0'
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
                  aria-checked={isPortfolioCompressed}
                  onClick={() => setIsPortfolioCompressed(!isPortfolioCompressed)}
                  title={
                    isPortfolioCompressed
                      ? 'Kompresi file aktif (ukuran dioptimalkan)'
                      : 'Kompresi file nonaktif (kualitas asli)'
                  }
                  aria-label="Toggle Kompresi File Portofolio"
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isPortfolioCompressed ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                      isPortfolioCompressed ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          {/* Grid Badge Items Responsive (2 Kolom Mobile, 3 Kolom Desktop) In-Place */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 pt-0.5">
            {ALL_PORTFOLIO_SLIDES.map((slide) => {
              const selectedIndex = selectedPortfolioSlideIds.indexOf(slide.id);
              const isSelected = selectedIndex !== -1;
              const orderNumber = selectedIndex + 1;

              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => handleTogglePortfolioSlide(slide.id)}
                  className={`w-full inline-flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] font-medium shadow-2xs transition-all cursor-pointer select-none active:scale-95 text-left gap-1.5 min-w-0 ${
                    isSelected
                      ? 'bg-blue-600 hover:bg-blue-700 text-white border border-blue-600 font-semibold'
                      : 'bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400'
                  }`}
                  title={
                    isSelected
                      ? `Urutan ke-${orderNumber} • Klik untuk melepaskan ${slide.title}`
                      : `Klik untuk memilih ${slide.title}`
                  }
                >
                  <span className="truncate min-w-0 flex-1 text-left">
                    {slide.title}
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

export default PortfolioSection;
