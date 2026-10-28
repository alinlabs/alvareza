import React, { useState, useEffect, useCallback } from 'react';
import {
  Download,
  AlignLeft,
  AlignJustify,
  Loader2,
  X,
  Check,
} from 'lucide-react';
import {
  buildCoverLetterPDFDocument,
  CoverLetterOptions,
} from '../../../utils/pdf/coverLetterGenerator';
import { renderPdfToPageImages } from '../../../utils/pdf';
import { HEADER_COLOR_PRESETS } from '../constants';
import { CvTextAlignType } from '../types';

export interface ModalSuratLamaranPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  companyName?: string;
  jobTitle?: string;
  jobDesk?: string;
  kualifikasi?: string;
  coverLetterDate?: string;
  coverLetterCity?: string;
  presetKey?: string;
  headerColor?: string;
  textAlign?: CvTextAlignType;
  language?: 'in' | 'en' | 'id';
  applicantEmail?: string;
  onHeaderColorChange?: (color: string) => void;
  onTextAlignChange?: (align: CvTextAlignType) => void;
  onLanguageChange?: (lang: 'in' | 'en') => void;
}

export const ModalSuratLamaranPreview: React.FC<ModalSuratLamaranPreviewProps> = ({
  isOpen,
  onClose,
  companyName = '',
  jobTitle = '',
  jobDesk = '',
  kualifikasi = '',
  coverLetterDate = '',
  coverLetterCity = '',
  presetKey = 'optimal',
  applicantEmail,
  headerColor: initialHeaderColor = '#0062E3',
  textAlign: initialTextAlign = 'justify',
  language: initialLanguage = 'in',
  onHeaderColorChange,
  onTextAlignChange,
  onLanguageChange,
}) => {
  const [currentLang, setCurrentLang] = useState<'in' | 'en'>(() => {
    return initialLanguage === 'en' ? 'en' : 'in';
  });
  const [headerColor, setHeaderColor] = useState<string>(initialHeaderColor);
  const [textAlign, setTextAlign] = useState<CvTextAlignType>(initialTextAlign || 'justify');
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // PDF Preview Images State
  const [previewPageImages, setPreviewPageImages] = useState<string[]>([]);
  const [isBuildingPdf, setIsBuildingPdf] = useState<boolean>(false);

  useEffect(() => {
    if (initialLanguage === 'en' || initialLanguage === 'in') {
      setCurrentLang(initialLanguage);
    }
  }, [initialLanguage]);

  useEffect(() => {
    setHeaderColor(initialHeaderColor);
  }, [initialHeaderColor]);

  useEffect(() => {
    setTextAlign(initialTextAlign || 'justify');
  }, [initialTextAlign]);

  // Lock background scroll when modal is active
  useEffect(() => {
    if (isOpen) {
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
  }, [isOpen]);

  const handleToggleLanguage = () => {
    const nextLang: 'in' | 'en' = currentLang === 'in' ? 'en' : 'in';
    setCurrentLang(nextLang);
    if (onLanguageChange) {
      onLanguageChange(nextLang);
    }
  };

  // Re-build PDF and render page images whenever parameters change
  useEffect(() => {
    let isCancelled = false;

    if (isOpen) {
      setIsBuildingPdf(true);
      (async () => {
        try {
          const pdfOptions: CoverLetterOptions = {
            companyName,
            jobTitle,
            jobDesk,
            kualifikasi,
            coverLetterDate,
            coverLetterCity,
            presetKey,
            headerColor,
            textAlign,
            language: currentLang,
            applicantEmail,
          };

          const { doc } = buildCoverLetterPDFDocument(pdfOptions);
          const images = await renderPdfToPageImages(doc);

          if (!isCancelled) {
            setPreviewPageImages(images);
          }
        } catch (err) {
          console.error('Failed to render Cover Letter PDF page images:', err);
        } finally {
          if (!isCancelled) {
            setIsBuildingPdf(false);
          }
        }
      })();
    }

    return () => {
      isCancelled = true;
    };
  }, [
    isOpen,
    companyName,
    jobTitle,
    jobDesk,
    kualifikasi,
    coverLetterDate,
    coverLetterCity,
    presetKey,
    headerColor,
    textAlign,
    currentLang,
    applicantEmail,
  ]);

  const handleDownloadPdf = () => {
    try {
      setIsDownloading(true);
      const { doc, filename } = buildCoverLetterPDFDocument({
        companyName,
        jobTitle,
        jobDesk,
        kualifikasi,
        coverLetterDate,
        coverLetterCity,
        presetKey,
        headerColor,
        textAlign,
        language: currentLang,
        applicantEmail,
      });
      doc.save(filename);
    } catch (err) {
      console.error('Failed to download Cover Letter PDF:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id="modal-surat-lamaran-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/10 backdrop-blur-md w-full h-full min-h-[100dvh] flex flex-col justify-end sm:justify-center sm:items-center p-0 sm:p-4 pt-[60px] sm:pt-0 overflow-hidden"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* DESKTOP & TABLET MODAL */}
      <div className="hidden sm:flex bg-white text-slate-800 rounded-2xl max-w-4xl w-full h-[90vh] shadow-2xl border border-slate-200 overflow-hidden flex-col pointer-events-auto transition-all animate-in fade-in zoom-in-95">
        {/* Modal Header */}
        <div className="bg-slate-50/80 text-slate-900 px-5 py-3 flex items-center justify-between border-b border-slate-200 shrink-0">
          <div className="flex flex-col">
            <h3 className="text-sm font-bold text-slate-900 leading-tight">
              {currentLang === 'en'
                ? 'PDF Preview - Cover Letter'
                : 'PDF Preview - Surat Lamaran'}
            </h3>
            <p className="text-xs text-slate-500">
              1 Halaman • surat-lamaran.pdf {jobTitle ? `• ${jobTitle}` : ''}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Switcher */}
            <button
              type="button"
              id="btn-modal-cover-letter-language-toggle"
              onClick={handleToggleLanguage}
              title={
                currentLang === 'en'
                  ? 'English (Click to switch to Bahasa Indonesia)'
                  : 'Bahasa Indonesia (Klik untuk ganti ke English)'
              }
              aria-label={
                currentLang === 'en'
                  ? 'Switch to Bahasa Indonesia'
                  : 'Switch to English'
              }
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer flex items-center justify-center border border-slate-200 bg-white shadow-2xs group"
            >
              <img
                src={
                  currentLang === 'en'
                    ? 'https://flagcdn.com/gb.svg'
                    : 'https://flagcdn.com/id.svg'
                }
                alt={currentLang === 'en' ? 'UK Flag' : 'Bendera Indonesia'}
                className="w-5 h-3.5 object-cover rounded-xs shadow-2xs border border-black/10 group-hover:scale-105 transition-transform"
                referrerPolicy="no-referrer"
                loading="eager"
              />
            </button>

            {/* Color Picker */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
                title={
                  currentLang === 'en'
                    ? 'Header Accent Color'
                    : 'Warna Aksen Header'
                }
                aria-label="Warna Aksen Header"
                className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer flex items-center justify-center border border-slate-200 bg-white shadow-2xs"
              >
                <span
                  className="w-4 h-4 rounded-full border border-slate-300 shadow-2xs shrink-0 block"
                  style={{ backgroundColor: headerColor }}
                />
              </button>

              {isColorPickerOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsColorPickerOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-200 p-3.5 z-50 animate-in fade-in zoom-in-95">
                    <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0"
                          style={{ backgroundColor: headerColor }}
                        />
                        <span className="text-xs font-bold text-slate-900">
                          {currentLang === 'en'
                            ? 'Header Accent Color'
                            : 'Warna Aksen Header'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsColorPickerOpen(false)}
                        className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-6 gap-2 mb-3">
                      {HEADER_COLOR_PRESETS.map((preset) => {
                        const isSelected =
                          headerColor.toLowerCase() === preset.hex.toLowerCase();
                        return (
                          <button
                            key={preset.hex}
                            type="button"
                            onClick={() => {
                              setHeaderColor(preset.hex);
                              if (onHeaderColorChange) {
                                onHeaderColorChange(preset.hex);
                              }
                            }}
                            title={preset.label}
                            className={`w-7 h-7 rounded-full transition-all flex items-center justify-center border cursor-pointer ${
                              isSelected
                                ? 'ring-2 ring-blue-500 ring-offset-1 ring-offset-white scale-110 border-white shadow-xs'
                                : 'border-slate-200 hover:scale-105'
                            }`}
                            style={{ backgroundColor: preset.hex }}
                          >
                            {isSelected && (
                              <Check className="w-3.5 h-3.5 text-white drop-shadow-xs" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                      <input
                        type="text"
                        value={headerColor}
                        onChange={(e) => {
                          const val = e.target.value;
                          setHeaderColor(val);
                          if (onHeaderColorChange) onHeaderColorChange(val);
                        }}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-lg px-2 py-1 text-xs text-slate-800 font-mono outline-none uppercase transition-all"
                        placeholder="#0062E3"
                      />
                      <input
                        type="color"
                        value={
                          headerColor.startsWith('#') &&
                          headerColor.length === 7
                            ? headerColor
                            : '#0062E3'
                        }
                        onChange={(e) => {
                          const val = e.target.value.toUpperCase();
                          setHeaderColor(val);
                          if (onHeaderColorChange) onHeaderColorChange(val);
                        }}
                        className="w-7 h-7 rounded-lg border border-slate-200 cursor-pointer p-0 bg-transparent overflow-hidden shrink-0"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Text Alignment */}
            <div
              className="flex items-center rounded-lg border border-slate-200 bg-white shadow-2xs p-0.5"
              title={
                textAlign === 'justify'
                  ? (currentLang === 'en' ? 'Text Alignment: Justify (Default)' : 'Perataan Teks: Rata Kanan Kiri / Justify (Default)')
                  : (currentLang === 'en' ? 'Text Alignment: Left' : 'Perataan Teks: Rata Kiri')
              }
            >
              <button
                type="button"
                id="btn-modal-cover-letter-align-justify"
                onClick={() => {
                  setTextAlign('justify');
                  if (onTextAlignChange) onTextAlignChange('justify');
                }}
                title={
                  currentLang === 'en'
                    ? 'Justify Alignment (Default)'
                    : 'Rata Kanan Kiri (Justify - Default)'
                }
                aria-label="Rata Kanan Kiri (Justify)"
                className={`p-1.5 rounded-md transition-colors cursor-pointer flex items-center justify-center ${
                  textAlign === 'justify'
                    ? 'bg-blue-50 text-blue-600 font-bold'
                    : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'
                }`}
              >
                <AlignJustify className="w-4 h-4" />
              </button>
              <button
                type="button"
                id="btn-modal-cover-letter-align-left"
                onClick={() => {
                  setTextAlign('left');
                  if (onTextAlignChange) onTextAlignChange('left');
                }}
                title={
                  currentLang === 'en'
                    ? 'Left Alignment'
                    : 'Rata Kiri'
                }
                aria-label="Rata Kiri"
                className={`p-1.5 rounded-md transition-colors cursor-pointer flex items-center justify-center ${
                  textAlign === 'left'
                    ? 'bg-blue-50 text-blue-600 font-bold'
                    : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'
                }`}
              >
                <AlignLeft className="w-4 h-4" />
              </button>
            </div>

            {/* Download Button */}
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              title={currentLang === 'en' ? 'Download PDF' : 'Unduh PDF'}
              aria-label="Download PDF"
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-50 border border-slate-200 bg-white shadow-2xs"
            >
              {isDownloading ? (
                <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
              ) : (
                <Download className="w-5 h-5" />
              )}
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              title={currentLang === 'en' ? 'Close' : 'Tutup'}
              aria-label="Close"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Authentic Paper Sheet Preview */}
        <div className="flex-1 bg-slate-100/80 p-4 sm:p-8 overflow-y-auto relative flex flex-col items-center w-full h-full">
          {isBuildingPdf ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-slate-500 my-auto py-16">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              <p className="text-sm font-medium">
                {currentLang === 'en'
                  ? 'Generating Cover Letter PDF preview...'
                  : 'Menyiapkan pratinjau Surat Lamaran PDF...'}
              </p>
            </div>
          ) : previewPageImages.length > 0 ? (
            <div className="w-full max-w-2xl flex flex-col items-center space-y-6 pb-6">
              {previewPageImages.map((pageImg, idx) => (
                <div
                  key={idx}
                  className="bg-white shadow-xl rounded-sm border border-slate-200 w-full overflow-hidden transition-all duration-200"
                >
                  <img
                    src={pageImg}
                    alt="Surat Lamaran Halaman 1"
                    className="w-full h-auto block select-none"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-2 text-slate-400 my-auto py-16">
              <p className="text-sm">Gagal memuat pratinjau halaman.</p>
            </div>
          )}
        </div>
      </div>

      {/* MOBILE SHEET MODAL */}
      <div className="sm:hidden flex bg-white text-slate-800 rounded-t-3xl w-full h-[92vh] shadow-2xl border-t border-slate-200 overflow-hidden flex-col pointer-events-auto transition-all">
        {/* Mobile Header */}
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-bold text-slate-900 truncate">
              {currentLang === 'en' ? 'Cover Letter' : 'Surat Lamaran'}
            </h3>
            <p className="text-[11px] text-slate-500 truncate">
              surat-lamaran.pdf {jobTitle ? `• ${jobTitle}` : ''}
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleToggleLanguage}
              className="p-1.5 rounded-lg border border-slate-200 bg-white"
            >
              <img
                src={
                  currentLang === 'en'
                    ? 'https://flagcdn.com/gb.svg'
                    : 'https://flagcdn.com/id.svg'
                }
                alt="Flag"
                className="w-4 h-3 object-cover rounded-xs"
              />
            </button>

            <div className="flex items-center rounded-lg border border-slate-200 bg-white p-0.5">
              <button
                type="button"
                onClick={() => {
                  setTextAlign('justify');
                  if (onTextAlignChange) onTextAlignChange('justify');
                }}
                title="Rata Kanan Kiri (Justify - Default)"
                aria-label="Rata Kanan Kiri"
                className={`p-1 rounded transition-colors cursor-pointer ${
                  textAlign === 'justify'
                    ? 'bg-blue-50 text-blue-600 font-bold'
                    : 'text-slate-400'
                }`}
              >
                <AlignJustify className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setTextAlign('left');
                  if (onTextAlignChange) onTextAlignChange('left');
                }}
                title="Rata Kiri"
                aria-label="Rata Kiri"
                className={`p-1 rounded transition-colors cursor-pointer ${
                  textAlign === 'left'
                    ? 'bg-blue-50 text-blue-600 font-bold'
                    : 'text-slate-400'
                }`}
              >
                <AlignLeft className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600"
            >
              {isDownloading ? (
                <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
              ) : (
                <Download className="w-4 h-4" />
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Body */}
        <div className="flex-1 bg-slate-100 p-3 overflow-y-auto flex flex-col items-center">
          {isBuildingPdf ? (
            <div className="my-auto py-12 flex flex-col items-center gap-2 text-slate-500">
              <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
              <p className="text-xs">Memuat pratinjau...</p>
            </div>
          ) : previewPageImages.length > 0 ? (
            <div className="w-full max-w-lg space-y-4 pb-6">
              {previewPageImages.map((pageImg, idx) => (
                <div
                  key={idx}
                  className="bg-white shadow-md rounded-sm border border-slate-200 w-full overflow-hidden"
                >
                  <img
                    src={pageImg}
                    alt="Surat Lamaran"
                    className="w-full h-auto block select-none"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="my-auto py-12 text-slate-400 text-xs text-center">
              Gagal memuat pratinjau.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
