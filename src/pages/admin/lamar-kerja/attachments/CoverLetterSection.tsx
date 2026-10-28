import React, { useRef, useEffect } from 'react';
import {
  Eye,
  RotateCw,
  Download,
  ChevronUp,
  ChevronDown,
  Check,
  Copy,
} from 'lucide-react';
import { FormattedEmailBodyPreview } from '../FormattedEmailBodyPreview';
import {
  formatCoverLetterDate,
  formatCoverLetterShortDate,
} from '../../../../utils/gasAttachmentGenerator';
import { CvTextAlignType } from '../../types';

export interface CoverLetterSectionProps {
  showCoverLetterBreakdown?: boolean;
  setShowCoverLetterBreakdown?: React.Dispatch<React.SetStateAction<boolean>>;
  coverLetterDate?: string;
  setCoverLetterDate?: (val: string) => void;
  isCoverLetterDateAuto?: boolean;
  setIsCoverLetterDateAuto?: (val: boolean) => void;
  coverLetterCity?: string;
  setCoverLetterCity?: (val: string) => void;
  isCoverLetterCityActive?: boolean;
  setIsCoverLetterCityActive?: (val: boolean) => void;
  coverLetterTextAlign?: CvTextAlignType;
  setCoverLetterTextAlign?: (val: CvTextAlignType) => void;
  handlePreviewCoverLetterPdf?: () => void;
  isPreviewingCoverLetter?: boolean;
  onOpenCoverLetterPreviewModal?: () => void;
  emailBody?: string;
  copiedBody?: boolean;
  handleCopy?: (text: string, type: 'subject' | 'body' | 'all' | 'email' | 'cc' | 'phone') => void;
  language?: 'in' | 'en' | 'id';
}

export const CoverLetterSection: React.FC<CoverLetterSectionProps> = ({
  showCoverLetterBreakdown = false,
  setShowCoverLetterBreakdown,
  coverLetterDate = '',
  setCoverLetterDate,
  isCoverLetterDateAuto = true,
  setIsCoverLetterDateAuto,
  coverLetterCity = '',
  setCoverLetterCity,
  isCoverLetterCityActive = false,
  setIsCoverLetterCityActive,
  handlePreviewCoverLetterPdf,
  isPreviewingCoverLetter = false,
  onOpenCoverLetterPreviewModal,
  emailBody = '',
  copiedBody = false,
  handleCopy,
  language = 'in',
}) => {
  const handleToggleCoverLetterDrawer = () => {
    if (setShowCoverLetterBreakdown) {
      setShowCoverLetterBreakdown((prev) => !prev);
    }
  };

  const formattedCoverLetterDateDisplay = formatCoverLetterDate(
    coverLetterDate,
    language === 'en' ? 'en' : 'in'
  );

  const formattedCoverLetterShortDateDisplay = formatCoverLetterShortDate(
    coverLetterDate,
    language === 'en' ? 'en' : 'in'
  );

  const displayCity = isCoverLetterCityActive
    ? (coverLetterCity?.trim() || 'Purwakarta')
    : '';

  const coverLetterSubtitle = displayCity
    ? `${displayCity}, ${formattedCoverLetterShortDateDisplay}`
    : formattedCoverLetterShortDateDisplay;

  const getTodayIsoDate = () => new Date().toISOString().slice(0, 10);

  // Jaga sinkronisasi tanggal otomatis ke hari ini selama toggle auto aktif
  useEffect(() => {
    if (isCoverLetterDateAuto && setCoverLetterDate) {
      const today = getTodayIsoDate();
      if (coverLetterDate !== today) {
        setCoverLetterDate(today);
      }
    }
  }, [isCoverLetterDateAuto, setCoverLetterDate, coverLetterDate]);

  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    if (setCoverLetterDate) {
      setCoverLetterDate(newDate);
    }
    const today = getTodayIsoDate();
    if (setIsCoverLetterDateAuto) {
      setIsCoverLetterDateAuto(newDate === today);
    }
  };

  const handleToggleDateAuto = () => {
    if (!setIsCoverLetterDateAuto) return;
    const next = !isCoverLetterDateAuto;
    setIsCoverLetterDateAuto(next);
    if (next && setCoverLetterDate) {
      setCoverLetterDate(getTodayIsoDate());
    }
  };

  const handleCityInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (setCoverLetterCity) {
      setCoverLetterCity(val);
    }
    const hasText = val.trim().length > 0;
    if (setIsCoverLetterCityActive) {
      setIsCoverLetterCityActive(hasText);
    }
  };

  const handleToggleCityActive = () => {
    if (!setIsCoverLetterCityActive || !setCoverLetterCity) return;
    const next = !isCoverLetterCityActive;
    setIsCoverLetterCityActive(next);
    if (next) {
      // Saat diaktifkan, selalu set default dari 'Purwakarta'
      setCoverLetterCity('Purwakarta');
    } else {
      setCoverLetterCity('');
    }
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-start justify-between gap-2">
        <div
          onClick={handleToggleCoverLetterDrawer}
          className="min-w-0 flex-1 cursor-pointer select-none"
        >
          <h4 className="text-xs font-bold text-slate-900 hover:text-blue-600 transition-colors flex items-center gap-1.5">
            <span>Surat Lamaran</span>
          </h4>
          <p className="text-[11px] text-slate-500 truncate mt-0.5 font-normal">
            {coverLetterSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {/* 1. Salin Format Teks Isi Email (Icon Salin di kiri icon download) */}
          {emailBody && (
            <button
              type="button"
              onClick={() => {
                if (handleCopy) {
                  handleCopy(emailBody, 'body');
                } else if (navigator.clipboard) {
                  navigator.clipboard.writeText(emailBody);
                }
              }}
              className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-center cursor-pointer"
              title="Salin Format Teks Surat Lamaran / Isi Email"
              aria-label="Salin Format Teks Surat Lamaran / Isi Email"
            >
              {copiedBody ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          )}

          {/* 2. Unduh / Preview Surat Lamaran PDF Button (Icon Download di kiri icon mata) */}
          {handlePreviewCoverLetterPdf && (
            <button
              type="button"
              onClick={handlePreviewCoverLetterPdf}
              disabled={isPreviewingCoverLetter}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              title="Unduh & Periksa Berkas Surat Lamaran PDF"
              aria-label="Unduh & Periksa Berkas Surat Lamaran PDF"
            >
              {isPreviewingCoverLetter ? (
                <RotateCw className="w-4 h-4 animate-spin text-blue-600" />
              ) : (
                <Download className="w-4 h-4" />
              )}
            </button>
          )}

          {/* 3. Pratinjau Modal Surat Lamaran (Icon Mata di kiri dropdown) */}
          {onOpenCoverLetterPreviewModal && (
            <button
              type="button"
              onClick={onOpenCoverLetterPreviewModal}
              className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-center cursor-pointer"
              title="Lihat Pratinjau Surat Lamaran"
              aria-label="Lihat Pratinjau Surat Lamaran"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}

          {/* 4. Toggle Drawer Button */}
          <button
            type="button"
            onClick={handleToggleCoverLetterDrawer}
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-center cursor-pointer"
            title={
              showCoverLetterBreakdown
                ? 'Sembunyikan opsi Surat Lamaran'
                : 'Tampilkan opsi Surat Lamaran'
            }
            aria-label="Toggle Surat Lamaran Breakdown"
          >
            {showCoverLetterBreakdown ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Breakdown Drawer: 2 Kolom (Tanggal & Nama Kota) & Draf Isi Email */}
      {showCoverLetterBreakdown && (
        <div className="pt-1.5 text-xs animate-in fade-in duration-150 space-y-3">
          <div className="grid grid-cols-2 gap-2 sm:gap-3 w-full">
            {/* Kolom 1: Tanggal */}
            <div className="flex flex-col gap-1 min-w-0">
              <label className="text-[11px] font-semibold text-slate-700 flex items-center justify-between">
                <span>Tanggal</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={isCoverLetterDateAuto}
                  onClick={handleToggleDateAuto}
                  title={
                    isCoverLetterDateAuto
                      ? 'Otomatisasi tanggal hari ini aktif (klik untuk matikan)'
                      : 'Otomatisasi tanggal hari ini nonaktif (klik untuk aktifkan)'
                  }
                  aria-label="Toggle otomatisasi tanggal hari ini"
                  className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${
                    isCoverLetterDateAuto ? 'bg-blue-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                      isCoverLetterDateAuto ? 'translate-x-3' : 'translate-x-0'
                    }`}
                  />
                </button>
              </label>
              <input
                type="date"
                value={coverLetterDate}
                onChange={handleDateInputChange}
                className="w-full h-10 px-2 sm:px-3 rounded-xl border border-slate-300 bg-white text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs transition-all"
              />
            </div>

            {/* Kolom 2: Nama Kota */}
            <div className="flex flex-col gap-1 min-w-0">
              <label className="text-[11px] font-semibold text-slate-700 flex items-center justify-between">
                <span>Nama Kota</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={isCoverLetterCityActive}
                  onClick={handleToggleCityActive}
                  title={
                    isCoverLetterCityActive
                      ? 'Pencantuman kota domisili aktif (klik untuk nonaktifkan)'
                      : 'Pencantuman kota domisili nonaktif (klik untuk aktifkan)'
                  }
                  aria-label="Toggle cantumkan kota domisili"
                  className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${
                    isCoverLetterCityActive ? 'bg-blue-600' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                      isCoverLetterCityActive ? 'translate-x-3' : 'translate-x-0'
                    }`}
                  />
                </button>
              </label>
              <input
                type="text"
                value={coverLetterCity}
                onChange={handleCityInputChange}
                placeholder={
                  isCoverLetterCityActive
                    ? 'Purwakarta'
                    : 'Nonaktif'
                }
                className="w-full h-10 px-2.5 sm:px-3 rounded-xl border border-slate-300 bg-white text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Draf Isi Email (Menyatu dalam Surat Lamaran) */}
          <div className="space-y-1.5 pt-0.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-700">
                Isi Email
              </span>
            </div>

            <div className="w-full p-3 sm:p-3.5 rounded-xl border border-slate-200 bg-slate-50/75 text-slate-800 shadow-2xs overflow-y-auto max-h-60 select-text">
              <FormattedEmailBodyPreview body={emailBody} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
