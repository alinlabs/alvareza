import React, { useState, useEffect, useMemo } from 'react';
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
} from '../../../../utils/gasAttachmentGenerator';

export interface PortfolioSectionProps {
  selectedPortfolioSlideIds: string[];
  showPortfolioBreakdown: boolean;
  setShowPortfolioBreakdown: React.Dispatch<React.SetStateAction<boolean>>;
  handlePreviewPortfolioPdf: () => void;
  isPreviewingPortfolio: boolean;
  onOpenPortfolioPreviewModal?: () => void;
  handleTogglePortfolioSlide: (slideId: string) => void;
  onResetPortfolio?: () => void;
  selectedCvPreset: string;
  jobTitle: string;
  isPortfolioCompressed?: boolean;
  setIsPortfolioCompressed?: (val: boolean) => void;
}

export const PortfolioSection: React.FC<PortfolioSectionProps> = ({
  selectedPortfolioSlideIds,
  showPortfolioBreakdown,
  setShowPortfolioBreakdown,
  handlePreviewPortfolioPdf,
  isPreviewingPortfolio,
  onOpenPortfolioPreviewModal,
  handleTogglePortfolioSlide,
  onResetPortfolio,
  selectedCvPreset,
  jobTitle,
  isPortfolioCompressed = false,
  setIsPortfolioCompressed,
}) => {
  // Rekomendasi Portofolio default berdasarkan Role (Preset) yang dipilih
  const defaultPortfolioSlideIds = useMemo(() => {
    return getAdaptivePortfolioSlides(selectedCvPreset || 'optimal', {
      jobTitle,
    }).map((s) => s.id);
  }, [selectedCvPreset, jobTitle]);

  const defaultUnselectedSlideIds = useMemo(() => {
    return ALL_PORTFOLIO_SLIDES
      .map((s) => s.id)
      .filter((id) => !defaultPortfolioSlideIds.includes(id));
  }, [defaultPortfolioSlideIds]);

  // Urutan list badge putih (slide yang belum dipilih)
  const [unselectedSlideIds, setUnselectedSlideIds] = useState<string[]>(() => {
    return ALL_PORTFOLIO_SLIDES
      .map((s) => s.id)
      .filter((id) => !selectedPortfolioSlideIds.includes(id));
  });

  // Sinkronisasi saat preset role atau rekomendasi berubah
  useEffect(() => {
    setUnselectedSlideIds(defaultUnselectedSlideIds);
  }, [defaultUnselectedSlideIds]);

  // Cek apakah portofolio telah diubah pengguna dari set awal role
  const isPortfolioChangedFromDefault = useMemo(() => {
    if (selectedPortfolioSlideIds.length !== defaultPortfolioSlideIds.length) return true;
    for (let i = 0; i < selectedPortfolioSlideIds.length; i++) {
      if (selectedPortfolioSlideIds[i] !== defaultPortfolioSlideIds[i]) return true;
    }
    if (unselectedSlideIds.length !== defaultUnselectedSlideIds.length) return true;
    for (let i = 0; i < unselectedSlideIds.length; i++) {
      if (unselectedSlideIds[i] !== defaultUnselectedSlideIds[i]) return true;
    }
    return false;
  }, [selectedPortfolioSlideIds, defaultPortfolioSlideIds, unselectedSlideIds, defaultUnselectedSlideIds]);

  // Handler menambahkan slide: dihapus dari list putih, masuk ke posisi paling akhir badge biru
  const handleAddPortfolioSlide = (slideId: string) => {
    setUnselectedSlideIds((prev) => prev.filter((id) => id !== slideId));
    handleTogglePortfolioSlide(slideId);
  };

  // Handler melepaskan slide: dihapus dari badge biru, masuk ke posisi paling akhir badge putih
  const handleRemovePortfolioSlide = (slideId: string) => {
    handleTogglePortfolioSlide(slideId);
    setUnselectedSlideIds((prev) => [...prev.filter((id) => id !== slideId), slideId]);
  };

  // Handler reset portofolio ke rekomendasi awal role
  const handleResetPortfolio = () => {
    if (onResetPortfolio) {
      onResetPortfolio();
    }
    setUnselectedSlideIds(defaultUnselectedSlideIds);
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-start justify-between gap-2">
        <div
          onClick={() => setShowPortfolioBreakdown((prev) => !prev)}
          className="min-w-0 flex-1 cursor-pointer select-none"
        >
          <h4 className="text-xs font-bold text-slate-900 hover:text-blue-600 transition-colors">
            Portofolio Eksekutif
          </h4>
          <p className="text-[11px] text-slate-500 truncate mt-0.5">
            {`${selectedPortfolioSlideIds.length} Dokumen, ${isPortfolioCompressed ? 'Kompresi ≤ 1 MB' : 'Kualitas Standar'}`}
          </p>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {/* Reset to Role Recommendation (Samping kiri icon download) */}
          <button
            type="button"
            onClick={handleResetPortfolio}
            disabled={!isPortfolioChangedFromDefault}
            className={`p-1.5 rounded-lg transition-colors flex items-center justify-center ${
              isPortfolioChangedFromDefault
                ? 'text-slate-500 hover:text-slate-800 hover:bg-slate-100 cursor-pointer'
                : 'text-slate-300 hover:text-slate-300 cursor-not-allowed opacity-40'
            }`}
            title={
              isPortfolioChangedFromDefault
                ? 'Kembalikan ke rekomendasi awal portofolio sesuai role'
                : 'Portofolio sudah sesuai rekomendasi role'
            }
            aria-label="Kembalikan Portofolio ke Rekomendasi Awal"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* 1. Unduh / Preview Portofolio PDF (Icon Download di kiri icon mata) */}
          <button
            type="button"
            onClick={handlePreviewPortfolioPdf}
            disabled={isPreviewingPortfolio || selectedPortfolioSlideIds.length === 0}
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            title="Unduh & Periksa Portofolio Terpilih"
          >
            {isPreviewingPortfolio ? (
              <RotateCw className="w-4 h-4 animate-spin text-blue-600" />
            ) : (
              <Download className="w-4 h-4" />
            )}
          </button>

          {/* 2. Pratinjau Modal Portofolio (Icon Mata di kiri dropdown) */}
          {onOpenPortfolioPreviewModal && (
            <button
              type="button"
              onClick={onOpenPortfolioPreviewModal}
              className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-center cursor-pointer"
              title="Lihat Pratinjau Portofolio Eksekutif"
              aria-label="Lihat Pratinjau Portofolio Eksekutif"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowPortfolioBreakdown((prev) => !prev)}
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-center cursor-pointer"
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

      {/* Breakdown Drawer: Badge Container & Sistem Checkbox Lengkap */}
      {showPortfolioBreakdown && (
        <div className="space-y-2 text-xs animate-in fade-in duration-150">
          {/* HR Specific Prioritization Helper Banner */}
          {isHrPosition(selectedCvPreset, jobTitle) && (
            <div className="p-2.5 rounded-xl bg-blue-50/80 border border-blue-200/80 text-blue-950 text-xs flex items-start gap-2 shadow-2xs">
              <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5 min-w-0">
                <p className="font-semibold text-[11px] text-blue-900">
                  {isRecruitmentScreeningFocus(selectedCvPreset, jobTitle)
                    ? 'Prioritas Portofolio HR (Rekrutmen & Screening): Talenty & HR Matrix'
                    : 'Prioritas Portofolio HR (Sistem Menyeluruh): HR Matrix & Talenty'}
                </p>
                <p className="text-[10px] text-blue-700 leading-relaxed">
                  {isRecruitmentScreeningFocus(selectedCvPreset, jobTitle)
                    ? 'Portofolio difokuskan pada aplikasi Talenty (proses rekrutmen, tes & asesmen, scoring pelamar) didukung HR Matrix (sistem HR menyeluruh).'
                    : 'Portofolio difokuskan pada aplikasi HR Matrix (sistem HR end-to-end pasca-onboarding: presensi QR, payroll, BPJS & KPI) didukung Talenty (rekrutmen & screening).'}
                </p>
              </div>
            </div>
          )}

          {/* Pertanyaan Cetak Kompresi File dengan Seekbar (Khusus Section Portofolio) */}
          <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl border border-slate-200/90 bg-slate-50/75 hover:bg-slate-50 transition-colors shadow-2xs">
            <div className="min-w-0 pr-2">
              <span className="text-xs font-semibold text-slate-800 block">Cetak Kompresi File</span>
              <span className="text-[11px] text-slate-500 block truncate">
                {isPortfolioCompressed
                  ? 'Kompresi aktif (ukuran berkas portofolio dioptimalkan ≤ 1 MB)'
                  : 'Kompresi nonaktif (kualitas gambar penuh / standar)'}
              </span>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={isPortfolioCompressed}
              onClick={() => setIsPortfolioCompressed && setIsPortfolioCompressed(!isPortfolioCompressed)}
              title={
                isPortfolioCompressed
                  ? 'Kompresi portofolio aktif (klik untuk matikan)'
                  : 'Kompresi portofolio nonaktif (klik untuk aktifkan)'
              }
              aria-label="Toggle Cetak Kompresi File Portofolio"
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${
                isPortfolioCompressed ? 'bg-blue-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                  isPortfolioCompressed ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Kolom Atas: Card Badge Slide Terpilih (Badge Biru, Teks Putih, ADA CARD PEMBUNGKUS) */}
          <div className="p-2.5 rounded-xl bg-white border border-slate-200 min-h-[44px] shadow-2xs">
            {selectedPortfolioSlideIds.length > 0 ? (
              <div className="flex flex-wrap items-center gap-1.5">
                {selectedPortfolioSlideIds.map((slideId) => {
                  const slide = ALL_PORTFOLIO_SLIDES.find((s) => s.id === slideId);
                  if (!slide) return null;
                  return (
                    <button
                      key={slide.id}
                      type="button"
                      onClick={() => handleRemovePortfolioSlide(slide.id)}
                      className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-medium shadow-2xs transition-colors cursor-pointer select-none active:scale-95"
                      title={`Klik untuk melepaskan ${slide.title} (pindah ke akhir daftar badge putih)`}
                    >
                      {slide.title}
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="text-slate-400 text-[11px] italic py-1 px-1">
                Belum ada portofolio yang dipilih. Klik badge di bawah untuk memilih.
              </p>
            )}
          </div>

          {/* Kolom Bawah: Badge-badge Putih (TIDAK ADA CARD PEMBUNGKUS) */}
          {unselectedSlideIds.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              {unselectedSlideIds.map((slideId) => {
                const slide = ALL_PORTFOLIO_SLIDES.find((s) => s.id === slideId);
                if (!slide) return null;
                return (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => handleAddPortfolioSlide(slide.id)}
                    className="inline-flex items-center px-2.5 py-1 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 text-slate-700 hover:text-blue-600 text-[11px] font-medium shadow-2xs transition-colors cursor-pointer select-none active:scale-95"
                    title={`Klik untuk memilih ${slide.title} (pindah ke akhir badge biru)`}
                  >
                    {slide.title}
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
