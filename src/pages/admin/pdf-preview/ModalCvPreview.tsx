import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Download,
  AlignLeft,
  AlignJustify,
  Loader2,
  X,
  Check,
} from 'lucide-react';
import {
  buildATSPDFDocument,
  renderPdfToPageImages,
  PDFItemSelectionConfig,
} from '../../../utils/pdf';
import { AtsDocumentSheet } from '../../full-view/ats-render';
import { cvData as defaultCvDataId, cvDataEn } from '../../../data/cv';
import { useLanguage } from '../../../context/LanguageContext';
import {
  getItemSelectionForPreset,
  getPresetSectionOrders,
  ItemSelectionState,
  SectionOrdersState,
} from '../../../data/preset/ItemSelections';
import {
  PRESET_HEADLINES,
  PRESET_SUMMARIES,
} from '../../../data/preset/HeadlinesSummaries';
import { ALL_ROLE_PRESETS } from '../../../data/preset/RoleConfig';
import { HEADER_COLOR_PRESETS } from '../constants';
import { CvDesignType, CvTextAlignType } from '../types';

export interface ModalCvPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  presetKey?: string;
  designPreset?: CvDesignType;
  headerColor?: string;
  textAlign?: CvTextAlignType;
  language?: 'in' | 'en' | 'id';
  jobTitle?: string;
  companyName?: string;
  jobDesk?: string;
  kualifikasi?: string;
  rawText?: string;
  items?: ItemSelectionState;
  sectionOrders?: SectionOrdersState;
  customHeadline?: string;
  customSummary?: string;
  onDesignPresetChange?: (preset: CvDesignType) => void;
  onHeaderColorChange?: (color: string) => void;
  onTextAlignChange?: (align: CvTextAlignType) => void;
  onLanguageChange?: (lang: 'in' | 'en') => void;
}

export const ModalCvPreview: React.FC<ModalCvPreviewProps> = ({
  isOpen,
  onClose,
  presetKey = 'optimal',
  designPreset: initialDesignPreset = 'block',
  headerColor: initialHeaderColor = '#0062E3',
  textAlign: initialTextAlign = 'left',
  language: initialLanguage = 'in',
  jobTitle = '',
  companyName = '',
  jobDesk = '',
  kualifikasi = '',
  rawText = '',
  items: propItems,
  sectionOrders: propSectionOrders,
  customHeadline: propCustomHeadline,
  customSummary: propCustomSummary,
  onDesignPresetChange,
  onHeaderColorChange,
  onTextAlignChange,
  onLanguageChange,
}) => {
  const { language: globalLanguage, setLanguage: setGlobalLanguage } = useLanguage();
  const [currentLang, setCurrentLang] = useState<'in' | 'en'>(() => {
    if (initialLanguage === 'en' || initialLanguage === 'in') return initialLanguage;
    return globalLanguage === 'en' ? 'en' : 'in';
  });
  const [headerColor, setHeaderColor] = useState<string>(initialHeaderColor);
  const [textAlign, setTextAlign] = useState<CvTextAlignType>(initialTextAlign);
  const [designPreset, setDesignPreset] = useState<CvDesignType>(initialDesignPreset);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Real Multi-Page PDF Images (Identik dengan header PDF Preview)
  const [previewPageImages, setPreviewPageImages] = useState<string[]>([]);
  const [pdfPages, setPdfPages] = useState<number>(1);
  const [isBuildingPdf, setIsBuildingPdf] = useState<boolean>(false);

  const cvData = useMemo(() => {
    return currentLang === 'en' ? cvDataEn : defaultCvDataId;
  }, [currentLang]);

  useEffect(() => {
    if (initialLanguage === 'en' || initialLanguage === 'in') {
      setCurrentLang(initialLanguage);
    }
  }, [initialLanguage]);

  const handleToggleLanguage = () => {
    const nextLang: 'in' | 'en' = currentLang === 'in' ? 'en' : 'in';
    setCurrentLang(nextLang);
    setGlobalLanguage(nextLang);
    if (onLanguageChange) {
      onLanguageChange(nextLang);
    }
  };

  useEffect(() => {
    setHeaderColor(initialHeaderColor);
  }, [initialHeaderColor]);

  useEffect(() => {
    setTextAlign(initialTextAlign);
  }, [initialTextAlign]);

  useEffect(() => {
    setDesignPreset(initialDesignPreset);
  }, [initialDesignPreset]);

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

  const presetInfo = useMemo(() => {
    return ALL_ROLE_PRESETS.find((p) => p.key === presetKey || p.code.toLowerCase() === presetKey?.toLowerCase()) || ALL_ROLE_PRESETS[0];
  }, [presetKey]);

  const cvCode = useMemo(() => {
    if (presetInfo?.code) return presetInfo.code.toUpperCase();
    return (presetKey || 'OPT').substring(0, 3).toUpperCase();
  }, [presetInfo, presetKey]);

  const cvLang = currentLang === 'en' ? 'Inggris' : 'Indonesia';

  const items = useMemo(() => {
    if (propItems) return propItems;
    return getItemSelectionForPreset(presetKey);
  }, [presetKey, propItems]);

  const sectionOrders = useMemo(() => {
    if (propSectionOrders) return propSectionOrders;
    return getPresetSectionOrders(presetKey);
  }, [presetKey, propSectionOrders]);

  const headline = useMemo(() => {
    if (propCustomHeadline) return propCustomHeadline;
    const raw = (PRESET_HEADLINES[presetKey] || PRESET_HEADLINES.optimal) as any;
    return currentLang === 'en' ? raw.en : (raw.in || raw.id);
  }, [presetKey, currentLang, propCustomHeadline]);

  const summaryText = useMemo(() => {
    if (propCustomSummary) return propCustomSummary;
    const raw = (PRESET_SUMMARIES[presetKey] || PRESET_SUMMARIES.optimal) as any;
    return currentLang === 'en' ? raw.en : (raw.in || raw.id);
  }, [presetKey, currentLang, propCustomSummary]);

  const totalActiveItems = useMemo(() => {
    if (!items) return 0;
    let count = 0;
    Object.values(items).forEach((arr) => {
      if (Array.isArray(arr)) count += arr.length;
    });
    return count;
  }, [items]);

  const getPdfItemsConfig = useCallback((): PDFItemSelectionConfig => ({
    summary: items.summary,
    metrics: items.metrics,
    experiences: items.experiences,
    education: items.education,
    skills: items.skills,
    certifications: items.certifications,
    consultingProjects: items.consultingProjects,
    digitalSolutions: items.digitalSolutions,
    organizations: items.organizations,
    achievements: items.achievements,
  }), [items]);

  const getMappedHeaderStyle = useCallback((design: CvDesignType): 'solid-banner' | 'navy-solid' | 'plain' | 'badge' => {
    if (design === 'line') return 'navy-solid';
    if (design === 'plain') return 'plain';
    if (design === 'badge') return 'badge';
    return 'solid-banner';
  }, []);

  // Build the real multi-page PDF document and render to paper sheet page images
  useEffect(() => {
    let isCancelled = false;

    if (isOpen) {
      setIsBuildingPdf(true);
      (async () => {
        try {
          const pdfItemsConfig = getPdfItemsConfig();
          const mappedHeaderStyle = getMappedHeaderStyle(designPreset);

          const safeLang: 'in' | 'en' = currentLang === 'en' ? 'en' : 'in';
          const pdfOptions = {
            language: safeLang,
            marginMm: 15,
            fontSizeScale: 1.15,
            headerStyle: mappedHeaderStyle,
            boldWeight: 'refined' as const,
            headline,
            summaryText,
            preset: presetKey,
            items: pdfItemsConfig,
            sectionOrders,
            textAlign: textAlign === 'justify' ? ('justify' as const) : ('left' as const),
            headerColor,
            jobContext: (jobDesk || kualifikasi || jobTitle || rawText) ? {
              jobTitle,
              jobDesk,
              kualifikasi,
              rawText,
            } : undefined,
          };

          const { doc, totalPages } = buildATSPDFDocument(pdfOptions);
          const images = await renderPdfToPageImages(doc);

          if (!isCancelled) {
            setPdfPages(totalPages);
            setPreviewPageImages(images);
          }
        } catch (err) {
          console.error('Error generating PDF preview in ModalCvPreview:', err);
        } finally {
          if (!isCancelled) {
            setIsBuildingPdf(false);
          }
        }
      })();
    } else {
      setPreviewPageImages([]);
    }

    return () => {
      isCancelled = true;
    };
  }, [
    isOpen,
    presetKey,
    designPreset,
    headerColor,
    textAlign,
    currentLang,
    headline,
    summaryText,
    getPdfItemsConfig,
    getMappedHeaderStyle,
    sectionOrders,
    jobDesk,
    kualifikasi,
    jobTitle,
    rawText,
  ]);

  // Download PDF that matches 100% byte-for-byte what is seen on the preview sheets
  const handleDownloadPdf = async () => {
    try {
      setIsDownloading(true);
      const pdfItemsConfig = getPdfItemsConfig();
      const mappedHeaderStyle = getMappedHeaderStyle(designPreset);

      const safeLang: 'in' | 'en' = currentLang === 'en' ? 'en' : 'in';
      const pdfOptions = {
        language: safeLang,
        marginMm: 15,
        fontSizeScale: 1.15,
        headerStyle: mappedHeaderStyle,
        boldWeight: 'refined' as const,
        headline,
        summaryText,
        preset: presetKey,
        items: pdfItemsConfig,
        sectionOrders,
        textAlign: textAlign === 'justify' ? ('justify' as const) : ('left' as const),
        headerColor,
        jobContext: (jobDesk || kualifikasi || jobTitle || rawText) ? {
          jobTitle,
          jobDesk,
          kualifikasi,
          rawText,
        } : undefined,
      };

      const { doc, filename } = buildATSPDFDocument(pdfOptions);
      doc.save(filename);
    } catch (err) {
      console.error('Failed to download CV PDF:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id="modal-cv-backdrop"
      className="fixed inset-0 z-50 bg-slate-950/10 backdrop-blur-md w-full h-full min-h-[100dvh] flex flex-col justify-end sm:justify-center sm:items-center p-0 sm:p-4 pt-[60px] sm:pt-0 overflow-hidden"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* DESKTOP MODAL */}
      <div className="hidden sm:flex bg-white text-slate-800 rounded-2xl max-w-6xl w-full h-[90vh] shadow-2xl border border-slate-200 overflow-hidden flex-col pointer-events-auto transition-all animate-in fade-in zoom-in-95">
        {/* Modal Header */}
        <div className="bg-slate-50/80 text-slate-900 px-5 py-3 flex items-center justify-between border-b border-slate-200 shrink-0">
          <div className="flex flex-col">
            <h3 className="text-sm font-bold text-slate-900 leading-tight">
              PDF Preview - CV {cvCode} {cvLang}
            </h3>
            <p className="text-xs text-slate-500">
              {pdfPages} Halaman
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Single Flag Language Switcher to the left of Color Picker */}
            <button
              type="button"
              id="btn-modal-cv-language-toggle"
              onClick={handleToggleLanguage}
              title={
                currentLang === 'en'
                  ? 'English (Click to switch to Bahasa Indonesia)'
                  : 'Bahasa Indonesia (Klik untuk ganti ke English)'
              }
              aria-label={currentLang === 'en' ? 'Switch to Bahasa Indonesia' : 'Switch to English'}
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer flex items-center justify-center border border-slate-200 bg-white shadow-2xs group"
            >
              <img
                src={currentLang === 'en' ? 'https://flagcdn.com/gb.svg' : 'https://flagcdn.com/id.svg'}
                alt={currentLang === 'en' ? 'UK Flag' : 'Bendera Indonesia'}
                className="w-5 h-3.5 object-cover rounded-xs shadow-2xs border border-black/10 group-hover:scale-105 transition-transform"
                referrerPolicy="no-referrer"
                loading="eager"
              />
            </button>

            {/* Color Picker Control Button & Popup Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
                title={currentLang === 'en' ? 'Section Header Color' : 'Warna Latar Header Section'}
                aria-label={currentLang === 'en' ? 'Section Header Color' : 'Warna Latar Header Section'}
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
                          {currentLang === 'en' ? 'Header Section Color' : 'Warna Header Section'}
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

                    <p className="text-[11px] text-slate-500 font-medium mb-2.5">
                      {currentLang === 'en'
                        ? 'Choose background color for PDF section headers:'
                        : 'Pilih warna latar belakang untuk header section PDF:'}
                    </p>

                    <div className="grid grid-cols-6 gap-2 mb-3">
                      {HEADER_COLOR_PRESETS.map((preset) => {
                        const isSelected = headerColor.toLowerCase() === preset.hex.toLowerCase();
                        return (
                          <button
                            key={preset.hex}
                            type="button"
                            onClick={() => setHeaderColor(preset.hex)}
                            title={preset.label}
                            className={`w-7 h-7 rounded-full transition-all flex items-center justify-center border cursor-pointer ${
                              isSelected
                                ? 'ring-2 ring-blue-500 ring-offset-1 ring-offset-white scale-110 border-white shadow-xs'
                                : 'border-slate-200 hover:scale-105'
                            }`}
                            style={{ backgroundColor: preset.hex }}
                          >
                            {isSelected && (
                              <Check className="w-3.5 h-3.5 text-white drop-shadow-xs" strokeWidth={3} />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex items-center gap-2 pt-2.5 border-t border-slate-100">
                      <label className="text-[11px] font-bold text-slate-500 shrink-0">HEX</label>
                      <div className="relative flex-1 flex items-center">
                        <input
                          type="text"
                          maxLength={7}
                          value={headerColor.startsWith('#') ? headerColor : `#${headerColor}`}
                          onChange={(e) => {
                            let val = e.target.value;
                            if (!val.startsWith('#')) {
                              val = '#' + val.replace(/#/g, '');
                            }
                            const hexPart = val.slice(1).replace(/[^0-9A-Fa-f]/g, '');
                            if (hexPart.length <= 6) {
                              setHeaderColor(`#${hexPart}`);
                            }
                          }}
                          className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-lg px-2.5 py-1 text-xs text-slate-800 font-normal outline-none uppercase transition-all"
                          placeholder="#0F172A"
                        />
                      </div>
                      <input
                        type="color"
                        value={headerColor.startsWith('#') && headerColor.length === 7 ? headerColor : '#0F172A'}
                        onChange={(e) => setHeaderColor(e.target.value.toUpperCase())}
                        className="w-7 h-7 rounded-lg border border-slate-200 cursor-pointer p-0 bg-transparent overflow-hidden shrink-0"
                        title={currentLang === 'en' ? 'Pick custom color' : 'Pilih warna khusus'}
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            <button
              type="button"
              onClick={() => setTextAlign((prev) => (prev === 'left' ? 'justify' : 'left'))}
              title={
                textAlign === 'left'
                  ? (currentLang === 'en' ? 'Text Alignment: Left (Click to Justify)' : 'Rata Teks: Rata Kiri (Klik untuk Justify)')
                  : (currentLang === 'en' ? 'Text Alignment: Justify (Click to Left)' : 'Rata Teks: Rata Justify (Klik untuk Rata Kiri)')
              }
              aria-label={textAlign === 'left' ? 'Set text alignment to justify' : 'Set text alignment to left'}
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer flex items-center gap-1 border border-slate-200 bg-white shadow-2xs"
            >
              {textAlign === 'left' ? (
                <AlignLeft className="w-5 h-5 text-slate-600" />
              ) : (
                <AlignJustify className="w-5 h-5 text-slate-600" />
              )}
            </button>

            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              title={currentLang === 'en' ? 'Download PDF' : 'Unduh PDF'}
              aria-label={currentLang === 'en' ? 'Download PDF' : 'Unduh PDF'}
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
              title={currentLang === 'en' ? 'Close' : 'Tutup'}
              aria-label={currentLang === 'en' ? 'Close' : 'Tutup'}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Identik dengan PrintableView (Kertas-kertas halaman PDF asli) */}
        <div className="flex-1 bg-slate-100/80 p-4 sm:p-8 overflow-y-auto relative flex flex-col items-center w-full h-full">
          {isBuildingPdf ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-slate-500 my-auto py-16">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              <p className="text-sm font-medium">
                {currentLang === 'en'
                  ? 'Generating multi-page PDF preview...'
                  : 'Menyiapkan pratinjau PDF multi-halaman...'}
              </p>
            </div>
          ) : previewPageImages.length > 0 ? (
            <div className="w-full max-w-3xl flex flex-col items-center space-y-6 pb-6">
              {previewPageImages.map((pageImg, idx) => (
                <div
                  key={idx}
                  className="bg-white shadow-lg rounded-sm border border-slate-200 w-full overflow-hidden transition-all duration-200"
                >
                  <img
                    src={pageImg}
                    alt={`Halaman ${idx + 1}`}
                    className="w-full h-auto block select-none"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full max-w-3xl my-auto py-2">
              <AtsDocumentSheet
                cvData={cvData}
                items={items}
                language={currentLang}
                totalActiveItems={totalActiveItems}
                sectionOrders={sectionOrders}
                headline={headline}
                summaryText={summaryText}
                designPreset={designPreset === 'block' ? 'block' : 'line'}
                preset={presetKey}
                textAlign={textAlign}
                headerColor={headerColor}
              />
            </div>
          )}
        </div>
      </div>

      {/* MOBILE BOTTOM SHEET */}
      <div className="sm:hidden w-full bg-white text-slate-800 rounded-t-3xl shadow-2xl border-t border-slate-200 max-h-[calc(100vh-60px)] h-[calc(100vh-60px)] flex flex-col overflow-hidden transition-transform duration-300 animate-in slide-in-from-bottom">
        <div className="bg-slate-50/80 text-slate-900 px-4 py-2.5 flex items-center justify-between border-b border-slate-200 shrink-0 relative">
          <div className="flex flex-col">
            <span className="text-sm font-bold text-slate-900 leading-tight">
              PDF Preview - CV {cvCode} {cvLang}
            </span>
            <span className="text-xs text-slate-500">
              {pdfPages} Halaman
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {/* Single Flag Language Switcher to the left of Color Picker */}
            <button
              type="button"
              id="btn-modal-cv-language-toggle-mobile"
              onClick={handleToggleLanguage}
              title={
                currentLang === 'en'
                  ? 'English (Click to switch to Bahasa Indonesia)'
                  : 'Bahasa Indonesia (Klik untuk ganti ke English)'
              }
              aria-label={currentLang === 'en' ? 'Switch to Bahasa Indonesia' : 'Switch to English'}
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer flex items-center justify-center border border-slate-200 bg-white shadow-2xs group"
            >
              <img
                src={currentLang === 'en' ? 'https://flagcdn.com/gb.svg' : 'https://flagcdn.com/id.svg'}
                alt={currentLang === 'en' ? 'UK Flag' : 'Bendera Indonesia'}
                className="w-5 h-3.5 object-cover rounded-xs shadow-2xs border border-black/10 group-hover:scale-105 transition-transform"
                referrerPolicy="no-referrer"
                loading="eager"
              />
            </button>

            <button
              type="button"
              onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
              title={currentLang === 'en' ? 'Section Header Color' : 'Warna Latar Header Section'}
              aria-label={currentLang === 'en' ? 'Section Header Color' : 'Warna Latar Header Section'}
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer flex items-center justify-center border border-slate-200 bg-white"
            >
              <span
                className="w-4 h-4 rounded-full border border-slate-300 shadow-2xs shrink-0 block"
                style={{ backgroundColor: headerColor }}
              />
            </button>

            <button
              type="button"
              onClick={() => setTextAlign((prev) => (prev === 'left' ? 'justify' : 'left'))}
              title={
                textAlign === 'left'
                  ? (currentLang === 'en' ? 'Text Alignment: Left (Click to Justify)' : 'Rata Teks: Rata Kiri (Klik untuk Justify)')
                  : (currentLang === 'en' ? 'Text Alignment: Justify (Click to Left)' : 'Rata Teks: Rata Justify (Klik untuk Rata Kiri)')
              }
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer flex items-center border border-slate-200 bg-white"
            >
              {textAlign === 'left' ? (
                <AlignLeft className="w-5 h-5 text-slate-600" />
              ) : (
                <AlignJustify className="w-5 h-5 text-slate-600" />
              )}
            </button>

            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              title={currentLang === 'en' ? 'Download PDF' : 'Unduh PDF'}
              aria-label={currentLang === 'en' ? 'Download PDF' : 'Unduh PDF'}
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
              title={currentLang === 'en' ? 'Close' : 'Tutup'}
              aria-label={currentLang === 'en' ? 'Close' : 'Tutup'}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Body: Lembar kertas halaman PDF asli */}
        <div className="flex-1 bg-slate-100/80 p-3 overflow-y-auto relative flex flex-col items-center w-full h-full">
          {isBuildingPdf ? (
            <div className="flex flex-col items-center justify-center my-auto gap-3 py-12 text-slate-500">
              <Loader2 className="w-7 h-7 animate-spin text-blue-500" />
              <p className="text-xs font-medium">Menyiapkan pratinjau PDF...</p>
            </div>
          ) : previewPageImages.length > 0 ? (
            <div className="w-full flex flex-col items-center space-y-4 pb-4">
              {previewPageImages.map((pageImg, idx) => (
                <div
                  key={idx}
                  className="bg-white shadow-md rounded-sm border border-slate-200 w-full overflow-hidden"
                >
                  <img
                    src={pageImg}
                    alt={`Halaman ${idx + 1}`}
                    className="w-full h-auto block select-none"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full my-auto py-1">
              <AtsDocumentSheet
                cvData={cvData}
                items={items}
                language={currentLang}
                totalActiveItems={totalActiveItems}
                sectionOrders={sectionOrders}
                headline={headline}
                summaryText={summaryText}
                designPreset={designPreset === 'block' ? 'block' : 'line'}
                preset={presetKey}
                textAlign={textAlign}
                headerColor={headerColor}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
