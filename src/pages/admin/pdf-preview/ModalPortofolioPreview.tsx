import React, { useState, useEffect, useMemo } from 'react';
import {
  Download,
  Loader2,
  X,
} from 'lucide-react';
import {
  ALL_PORTFOLIO_SLIDES,
  buildAdaptivePortfolioPdf,
  sortPortfolioSlideIds,
} from '../../../utils/portfolioPdfGenerator';
import { downloadBase64Pdf } from '../../../utils/gasAttachmentPreview';

export interface ModalPortofolioPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPortfolioSlideIds?: string[];
  presetKey?: string;
  jobTitle?: string;
  isPortfolioCompressed?: boolean;
}

export const ModalPortofolioPreview: React.FC<ModalPortofolioPreviewProps> = ({
  isOpen,
  onClose,
  selectedPortfolioSlideIds = [],
  presetKey = 'optimal',
  jobTitle = '',
  isPortfolioCompressed = false,
}) => {
  const [filterMode, setFilterMode] = useState<'selected' | 'all'>('selected');
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFilterMode(selectedPortfolioSlideIds.length > 0 ? 'selected' : 'all');

      const originalOverflow = document.body.style.overflow;
      const originalDocOverflow = document.documentElement.style.overflow;
      const originalPaddingRight = document.body.style.paddingRight;
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;

      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      if (scrollBarWidth > 0) {
        document.body.style.paddingRight = `${scrollBarWidth}px`;
      }

      return () => {
        document.body.style.overflow = originalOverflow;
        document.documentElement.style.overflow = originalDocOverflow;
        document.body.style.paddingRight = originalPaddingRight;
      };
    }
  }, [isOpen, selectedPortfolioSlideIds.length]);

  const displaySlides = useMemo(() => {
    if (filterMode === 'selected' && selectedPortfolioSlideIds.length > 0) {
      const sortedIds = sortPortfolioSlideIds(selectedPortfolioSlideIds, presetKey, jobTitle);
      return sortedIds
        .map((id) => ALL_PORTFOLIO_SLIDES.find((s) => s.id === id))
        .filter(Boolean) as typeof ALL_PORTFOLIO_SLIDES;
    }
    return ALL_PORTFOLIO_SLIDES;
  }, [filterMode, selectedPortfolioSlideIds, presetKey, jobTitle]);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const slideIds =
        selectedPortfolioSlideIds.length > 0
          ? selectedPortfolioSlideIds
          : ALL_PORTFOLIO_SLIDES.map((s) => s.id);

      const attachment = await buildAdaptivePortfolioPdf({
        preset: presetKey,
        selectedSlideIds: slideIds,
        jobTitle,
        isCompressed: isPortfolioCompressed,
      });

      if (attachment?.base64) {
        downloadBase64Pdf(
          attachment.base64,
          attachment.filename || (isPortfolioCompressed ? 'portofolio-alvareza-kompresi.pdf' : 'portofolio-alvareza.pdf')
        );
      }
    } catch (err) {
      console.error('Failed to download portfolio PDF:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id="modal-portfolio-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/10 backdrop-blur-md w-full h-full min-h-[100dvh] flex flex-col justify-end sm:justify-center sm:items-center p-0 sm:p-4 pt-[60px] sm:pt-0 overflow-hidden"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* DESKTOP MODAL */}
      <div className="hidden sm:flex bg-white text-slate-800 rounded-2xl max-w-4xl w-full h-[90vh] shadow-2xl border border-slate-200 overflow-hidden flex-col pointer-events-auto transition-all animate-in fade-in zoom-in-95">
        {/* Header Bar */}
        <div className="bg-slate-50/80 text-slate-900 px-5 py-3 flex items-center justify-between border-b border-slate-200 shrink-0">
          <div className="flex flex-col">
            <h3 className="text-sm font-bold text-slate-900 leading-tight">
              PDF Preview - Portofolio
            </h3>
            <p className="text-xs text-slate-500">
              {displaySlides.length} Halaman{isPortfolioCompressed ? ' (Kompresi ≤ 1 MB)' : ''}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Filter Toggle */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
              <button
                type="button"
                onClick={() => setFilterMode('selected')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  filterMode === 'selected'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Terpilih ({selectedPortfolioSlideIds.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterMode('all')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  filterMode === 'all'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Semua ({ALL_PORTFOLIO_SLIDES.length})
              </button>
            </div>

            <button
              type="button"
              onClick={handleDownload}
              disabled={isDownloading}
              title="Unduh Portofolio Format PDF"
              aria-label="Unduh PDF"
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50 border border-slate-200 bg-white shadow-2xs"
            >
              {isDownloading ? (
                <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
              ) : (
                <Download className="w-5 h-5" />
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              title="Tutup Pratinjau & Kembali ke Lamar Kerja"
              aria-label="Tutup"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: MURNI GAMBAR LEMBARAN KERTAS SELEBAR MODE CV (max-w-3xl) - TANPA CARD WRAPPER / TEKS */}
        <div className="flex-1 bg-slate-100/80 p-4 sm:p-8 overflow-y-auto relative flex flex-col items-center w-full h-full">
          <div className="w-full max-w-2xl flex flex-col items-center space-y-6 pb-6">
            {displaySlides.map((slide) => (
              <div
                key={slide.id}
                className="bg-white shadow-lg rounded-sm border border-slate-200/90 w-full overflow-hidden transition-all duration-200"
              >
                <img
                  src={encodeURI(`/portofolio/${slide.filename}`)}
                  crossOrigin="anonymous"
                  alt={slide.title}
                  className="w-full h-auto block select-none"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/portofolio/cover.jpg';
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MOBILE BOTTOM SHEET */}
      <div className="sm:hidden w-full bg-white text-slate-800 rounded-t-3xl shadow-2xl border-t border-slate-200 max-h-[calc(100vh-60px)] h-[calc(100vh-60px)] flex flex-col overflow-hidden transition-transform duration-300 animate-in slide-in-from-bottom">
        <div className="bg-slate-50/80 text-slate-900 px-4 py-2.5 flex items-center justify-between border-b border-slate-200 shrink-0 relative">
          <div className="flex flex-col">
            <span className="text-sm font-bold text-slate-900 leading-tight">
              Portofolio
            </span>
            <span className="text-xs text-slate-500">
              {displaySlides.length} Halaman{isPortfolioCompressed ? ' (Kompresi ≤ 1 MB)' : ''}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleDownload}
              disabled={isDownloading}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer border border-slate-200 bg-white"
            >
              {isDownloading ? (
                <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
              ) : (
                <Download className="w-5 h-5" />
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Body: Murni gambar lembaran kertas scroll ke bawah */}
        <div className="flex-1 bg-slate-100/80 p-3 overflow-y-auto relative flex flex-col items-center w-full h-full">
          <div className="w-full flex flex-col items-center space-y-4 pb-4">
            {displaySlides.map((slide) => (
              <div
                key={slide.id}
                className="bg-white shadow-md rounded-sm border border-slate-200/90 w-full overflow-hidden"
              >
                <img
                  src={encodeURI(`/portofolio/${slide.filename}`)}
                  crossOrigin="anonymous"
                  alt={slide.title}
                  className="w-full h-auto block select-none"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/portofolio/cover.jpg';
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
