import React, { useState, useEffect, useRef } from 'react';
import {
  Download,
  AlignLeft,
  AlignJustify,
  ArrowLeft,
  ShieldCheck,
  RotateCcw,
  FileCheck,
  Briefcase,
  GraduationCap,
  Wrench,
  FolderKanban,
  Layers,
  Building2,
  Award,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Eye,
  ArrowUp,
  ArrowDown,
  Loader2,
  FileText,
  X,
  LayoutList,
  Minus,
  TrendingUp,
  Code2,
  FolderGit2,
  Cpu,
  Trophy,
  Palette,
  Search,
  Check,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { generateATSPDF, getATSPDFBlobUrl, buildATSPDFDocument, renderPdfToPageImages, PDFItemSelectionConfig, PRESET_HEADLINES, PRESET_SUMMARIES, resolvePresetFromQuery } from '../utils/pdf/index';
import { useLanguage } from '../context/LanguageContext';
import { CVData } from '../types';
import { getTailoredExperiences } from '../data/tailoredExperiences';
import { getTailoredConsulting, getTailoredDigitalSolutions } from '../data/tailoredProjects';
import { QuickbarNavigator } from "./PrintableView/QuickbarNavigator";
import { DESIGN_OPTIONS, HEADER_COLOR_PRESETS } from "./PrintableView/constants";
import { DesignModal } from "./PrintableView/DesignModal";
import { SectionList } from "./PrintableView/SectionList";
import { getTailoredOrganizations } from '../data/tailoredOrganizations';
import { getTailoredMetrics } from '../data/tailoredMetrics';
import { ItemSelectionState } from '../data/presetItemSelections';
import { useCvSelection } from '../hooks/useCvSelection';
import { useDocumentCustomization } from '../hooks/useDocumentCustomization';
import { usePdfPreview } from '../hooks/usePdfPreview';
import { AtsDocumentSheet } from './AtsDocumentSheet';
import { RolePresetModal } from './RolePresetModal';
import { DesignPreset } from './PrintableView/types';

export const ROLE_PRESET_OPTIONS = ALL_ROLE_PRESETS;

import { ALL_ROLE_PRESETS, ROLE_PRESET_GROUPS, RolePresetOption, RolePresetGroup, getRolePresetsByGroup } from '../data/rolePresetsConfig';



interface PrintableViewProps {
  onBackToLanding?: () => void;
  isPreviewOpen?: boolean;
  onClosePreview?: () => void;
  onOpenPreview?: () => void;
  disableUrlActions?: boolean;
  onPresetChange?: (preset: string) => void;
}

export const PrintableView: React.FC<PrintableViewProps> = ({
  onBackToLanding,
  isPreviewOpen = false,
  onClosePreview,
  onOpenPreview,
  disableUrlActions = false,
  onPresetChange,
}) => {
  const { language, activeCvData: cvData, t } = useLanguage();

  // Custom Hook: CV Item and Order Selections
  const {
    items, setItems, sectionOrders, setSectionOrders, expandedSections, setExpandedSections,
    selectedPresetRole, setSelectedPresetRole, activePreset, setActivePreset, moveItem,
    toggleAccordion, isSectionActive, setSectionActiveState, toggleEntireSection, toggleItem,
    applyPreset, scrollToSection
  } = useCvSelection(cvData, onPresetChange);

  // Design Preset State ('block' or 'line')
  const [designPreset, setDesignPreset] = useState<DesignPreset>('block');
  // Text Alignment State ('left' or 'justify')
  const [textAlign, setTextAlign] = useState<'left' | 'justify'>('left');
  // Section Header Background Color State
  const [headerColor, setHeaderColor] = useState<string>('#0F172A');
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);

  // Modal / Bottom Sheet States
  const [isDesignModalOpen, setIsDesignModalOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [roleSearchQuery, setRoleSearchQuery] = useState('');

  // Lock background body scroll when any modal / bottom sheet is active
  useEffect(() => {
    const isAnyModalActive = isPreviewOpen || isDesignModalOpen || isRoleModalOpen;
    if (isAnyModalActive) {
      const originalOverflow = document.body.style.overflow;
      const originalDocOverflow = document.documentElement.style.overflow;
      const originalPaddingRight = document.body.style.paddingRight;

      // Check if scrollbar exists to prevent layout shifting
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
  }, [isPreviewOpen, isDesignModalOpen, isRoleModalOpen]);

  // Custom Hook: Target Role / Headline / Summary Customization
  const {
    customHeadline,
    setCustomHeadline,
    customSummary,
    setCustomSummary,
    isSummaryExpanded,
    setIsSummaryExpanded,
    summaryTextareaRef,
  } = useDocumentCustomization(selectedPresetRole, language, cvData);

  // Custom Hook: Live Built PDF Preview & Generation
  const {
    previewPageImages,
    pdfPages,
    isBuildingPdf,
    isDownloading,
    handleDownloadCustomPDF
  } = usePdfPreview({
    disableUrlActions,
    applyPreset,
    onOpenPreview,
    isPreviewOpen,
    items,
    language,
    sectionOrders,
    selectedPresetRole,
    customHeadline,
    customSummary,
    designPreset,
    textAlign,
    headerColor,
  });

  const filteredRoleOptions = ROLE_PRESET_OPTIONS.filter((item) => {
    if (!roleSearchQuery.trim()) return true;
    const q = roleSearchQuery.toLowerCase();
    return (
      item.code.toLowerCase().includes(q) ||
      item.titleId.toLowerCase().includes(q) ||
      item.titleEn.toLowerCase().includes(q) ||
      item.descId.toLowerCase().includes(q) ||
      item.descEn.toLowerCase().includes(q) ||
      item.tag.toLowerCase().includes(q) ||
      item.positionsId.toLowerCase().includes(q) ||
      item.positionsEn.toLowerCase().includes(q)
    );
  });

  // Total active items calculation
  const totalActiveItems =
    (items.summary ? 1 : 0) +
    cvData.metrics.filter((_, idx) => items.metrics[idx]).length +
    cvData.experiences.filter((e) => items.experiences[e.id]).length +
    cvData.education.filter((_, idx) => items.education[idx]).length +
    (items.skills.hard ? 1 : 0) +
    (items.skills.soft ? 1 : 0) +
    (items.skills.tools ? 1 : 0) +
    (cvData.certifications || []).filter((c) => items.certifications[c.id]).length +
    (cvData.consulting.projects || []).filter((p) => items.consultingProjects[p.id]).length +
    (cvData.digitalSolutions || []).filter((s) => items.digitalSolutions[s.id]).length +
    (cvData.organizations || []).filter((_, idx) => items.organizations[idx]).length +
    (cvData.achievements || []).filter((a) => items.achievements[a.id]).length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
      {/* QUICKBAR NAVIGATOR (Direct on main layout, without group card or title) */}
      <QuickbarNavigator
        language={language}
        isSectionActive={isSectionActive}
        scrollToSection={scrollToSection}
      />

      {/* FILTER BAR (Desain & Peran Modal Triggers + Editable Inputs) */}
      <div className="print:hidden w-full space-y-3">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full">
          {/* Desain Trigger */}
          <div className="flex items-center gap-2 w-full min-w-0">
            <span className="font-bold text-sm text-slate-900 select-none shrink-0">
              {language === 'en' ? 'Design' : 'Desain'}
            </span>
            <button
              type="button"
              onClick={() => setIsDesignModalOpen(true)}
              className="flex items-center justify-between gap-2 bg-slate-50 hover:bg-slate-100 active:bg-slate-200 font-semibold text-xs text-slate-800 border border-slate-200 hover:border-blue-400 rounded-xl px-3 py-1.5 cursor-pointer transition-all focus:outline-none focus:ring-1.5 focus:ring-[#0062E3]/30 w-full min-w-0"
            >
              <span className="truncate font-medium">
                {designPreset === 'block' && (language === 'en' ? 'Block' : 'Blok')}
                {designPreset === 'line' && (language === 'en' ? 'Line' : 'Garis')}
                {designPreset === 'badge' && (language === 'en' ? 'Badge' : 'Badge')}
                {designPreset === 'plain' && (language === 'en' ? 'Plain' : 'Polos')}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </button>
          </div>

          {/* Peran Trigger */}
          <div className="flex items-center gap-2 w-full min-w-0">
            <span className="font-bold text-sm text-slate-900 select-none shrink-0">
              {language === 'en' ? 'Role' : 'Peran'}
            </span>
            <button
              type="button"
              onClick={() => setIsRoleModalOpen(true)}
              className="flex items-center justify-between gap-2 bg-slate-50 hover:bg-slate-100 active:bg-slate-200 font-semibold text-xs text-slate-800 border border-slate-200 hover:border-blue-400 rounded-xl px-3 py-1.5 cursor-pointer transition-all focus:outline-none focus:ring-1.5 focus:ring-[#0062E3]/30 w-full min-w-0 text-left"
            >
              <span className="truncate font-medium">
                {(() => {
                  const currentKey = selectedPresetRole || activePreset;
                  const matched = ALL_ROLE_PRESETS.find((opt) => opt.key === currentKey);
                  return matched ? matched.code : (currentKey ? currentKey.toUpperCase() : 'ALL');
                })()}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </button>
          </div>
        </div>

        {/* EDITABLE INPUT FIELD: JUDUL SPESIALISASI */}
        <div className="flex flex-col gap-1.5 pt-1">
          {/* Judul Spesialisasi */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-bold text-sm text-slate-900 select-none">
                {language === 'en' ? 'Specialization' : 'Spesialisasi'}
              </label>
            </div>
            <input
              type="text"
              value={customHeadline}
              onChange={(e) => setCustomHeadline(e.target.value)}
              placeholder={language === 'en' ? 'e.g. Business Operations Manager...' : 'mis. Management Professional, Strategic Operations...'}
              className="w-full bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-xs font-normal text-slate-700 border border-slate-200 focus:border-[#0062E3] focus:ring-1.5 focus:ring-[#0062E3]/20 rounded-xl px-3 py-2 outline-none transition-all placeholder:text-slate-400"
            />
          </div>
        </div>
      </div>

      {/* 10 CATEGORY CHECKLIST WITH PLAIN TEXT HEADLINES & INDIVIDUAL ITEM CARDS */}
      <SectionList 
        cvData={cvData}
        items={items}
        language={language}
        expandedSections={expandedSections}
        isSectionActive={isSectionActive}
        toggleAccordion={toggleAccordion}
        setSectionActiveState={setSectionActiveState}
        toggleItem={toggleItem}
        toggleEntireSection={toggleEntireSection}
        sectionOrders={sectionOrders}
        moveItem={moveItem}
        selectedPresetRole={selectedPresetRole}
        customSummary={customSummary}
        setCustomSummary={setCustomSummary}
        isSummaryExpanded={isSummaryExpanded}
        setIsSummaryExpanded={setIsSummaryExpanded}
        summaryTextareaRef={summaryTextareaRef}
        setItems={setItems}
        setActivePreset={setActivePreset}
        setSectionOrders={setSectionOrders}
      />
      {/* HIDDEN PRINT CONTAINER (Only visible when browser Print is invoked) */}
      <div className="hidden print:block">
        <AtsDocumentSheet
          cvData={cvData}
          items={items}
          language={language}
          totalActiveItems={totalActiveItems}
          sectionOrders={sectionOrders}
          headline={customHeadline}
          summaryText={customSummary}
          designPreset={designPreset}
          preset={selectedPresetRole}
          textAlign={textAlign}
          headerColor={headerColor}
        />
      </div>

      {/* PREVIEW PDF OVERLAY: DESKTOP MODAL (sm:flex) AND MOBILE BOTTOM SHEET (sm:hidden) */}
      {isPreviewOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/10 backdrop-blur-md w-full h-full min-h-[100dvh] flex flex-col justify-end sm:justify-center sm:items-center p-0 sm:p-4 pt-[60px] sm:pt-0 overflow-hidden"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClosePreview();
          }}
        >
          {/* DESKTOP MODAL: Light Canvas Dialog */}
          <div className="hidden sm:flex bg-white text-slate-800 rounded-2xl max-w-6xl w-full h-[90vh] shadow-2xl border border-slate-200 overflow-hidden flex-col pointer-events-auto transition-all animate-in fade-in zoom-in-95">
              {/* Modal Header */}
              <div className="bg-slate-50/80 text-slate-900 px-5 py-3 flex items-center justify-between border-b border-slate-200 shrink-0">
                <div className="flex flex-col">
                  <h3 className="text-sm font-bold text-slate-900 leading-tight">
                    PDF Preview
                  </h3>
                  <p className="text-xs text-slate-500">
                    {pdfPages} {language === 'en' ? 'Pages' : 'Halaman'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {/* Color Picker Control Button & Popup Menu */}
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
                      title={language === 'en' ? 'Section Header Color' : 'Warna Latar Header Section'}
                      aria-label={language === 'en' ? 'Section Header Color' : 'Warna Latar Header Section'}
                      className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer flex items-center justify-center border border-slate-200 bg-white shadow-2xs"
                    >
                      <span
                        className="w-4 h-4 rounded-full border border-slate-300 shadow-2xs shrink-0 block"
                        style={{ backgroundColor: headerColor }}
                      />
                    </button>

                    {isColorPickerOpen && (
                      <>
                        {/* Backdrop Dismiss */}
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setIsColorPickerOpen(false)}
                        />

                        {/* Dropdown Popup */}
                        <div className="absolute right-0 top-full mt-2 w-64 bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-200 p-3.5 z-50 animate-in fade-in zoom-in-95">
                          <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-slate-100">
                            <div className="flex items-center gap-1.5">
                              <span
                                className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0"
                                style={{ backgroundColor: headerColor }}
                              />
                              <span className="text-xs font-bold text-slate-900">
                                {language === 'en' ? 'Header Section Color' : 'Warna Header Section'}
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
                            {language === 'en'
                              ? 'Choose background color for PDF section headers:'
                              : 'Pilih warna latar belakang untuk header section PDF:'}
                          </p>

                          {/* Preset Color Circles */}
                          <div className="grid grid-cols-6 gap-2 mb-3">
                            {HEADER_COLOR_PRESETS.map((preset) => {
                              const isSelected = headerColor.toLowerCase() === preset.hex.toLowerCase();
                              return (
                                <button
                                  key={preset.hex}
                                  type="button"
                                  onClick={() => {
                                    setHeaderColor(preset.hex);
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
                                    <Check className="w-3.5 h-3.5 text-white drop-shadow-xs" strokeWidth={3} />
                                  )}
                                </button>
                              );
                            })}
                          </div>

                          {/* Hex Input & Native Color Picker */}
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
                              title={language === 'en' ? 'Pick custom color' : 'Pilih warna khusus'}
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
                        ? (language === 'en' ? 'Text Alignment: Left (Click to Justify)' : 'Rata Teks: Rata Kiri (Klik untuk Justify)')
                        : (language === 'en' ? 'Text Alignment: Justify (Click to Left)' : 'Rata Teks: Rata Justify (Klik untuk Rata Kiri)')
                    }
                    aria-label={
                      textAlign === 'left'
                        ? (language === 'en' ? 'Set text alignment to justify' : 'Ubah ke rata justify')
                        : (language === 'en' ? 'Set text alignment to left' : 'Ubah ke rata kiri')
                    }
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
                    onClick={handleDownloadCustomPDF}
                    disabled={isDownloading}
                    title={language === 'en' ? 'Download PDF' : 'Unduh PDF'}
                    aria-label={language === 'en' ? 'Download PDF' : 'Unduh PDF'}
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
                    onClick={onClosePreview}
                    title={language === 'en' ? 'Close' : 'Tutup'}
                    aria-label={language === 'en' ? 'Close' : 'Tutup'}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Body: Clean Light Stage for PDF Document */}
              <div className="flex-1 bg-slate-100/80 p-4 sm:p-8 overflow-y-auto relative flex flex-col items-center w-full h-full">
                {isBuildingPdf ? (
                  <div className="flex flex-col items-center justify-center h-full gap-3 text-slate-500 my-auto">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                    <p className="text-sm font-medium">
                      {language === 'en'
                        ? 'Generating multi-page PDF preview...'
                        : 'Menyiapkan pratinjau PDF multi-halaman...'}
                    </p>
                  </div>
                ) : previewPageImages.length > 0 ? (
                  <div className="w-full max-w-3xl flex flex-col items-center space-y-6 pb-6">
                    {/* Page Cards */}
                    {previewPageImages.map((pageImg, idx) => (
                      <div key={idx} className="bg-white shadow-lg rounded-sm border border-slate-200 w-full overflow-hidden transition-all duration-200">
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
                      language={language}
                      totalActiveItems={totalActiveItems}
                      sectionOrders={sectionOrders}
                      headline={customHeadline}
                      summaryText={customSummary}
                      designPreset={designPreset}
                      preset={selectedPresetRole}
                      textAlign={textAlign}
                      headerColor={headerColor}
                    />
                  </div>
                )}
              </div>
            </div>

          {/* MOBILE BOTTOM SHEET: Light Slide-up Drawer */}
          <div className="sm:hidden w-full bg-white text-slate-800 rounded-t-3xl shadow-2xl border-t border-slate-200 max-h-[calc(100vh-60px)] h-[calc(100vh-60px)] flex flex-col overflow-hidden transition-transform duration-300 animate-in slide-in-from-bottom">
            {/* Mobile Header */}
            <div className="bg-slate-50/80 text-slate-900 px-4 py-2.5 flex items-center justify-between border-b border-slate-200 shrink-0 relative">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-900 leading-tight">
                  PDF Preview
                </span>
                <span className="text-xs text-slate-500">
                  {pdfPages} {language === 'en' ? 'Pages' : 'Halaman'}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                {/* Color Picker Control Button */}
                <button
                  type="button"
                  onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
                  title={language === 'en' ? 'Section Header Color' : 'Warna Latar Header Section'}
                  aria-label={language === 'en' ? 'Section Header Color' : 'Warna Latar Header Section'}
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
                      ? (language === 'en' ? 'Text Alignment: Left (Click to Justify)' : 'Rata Teks: Rata Kiri (Klik untuk Justify)')
                      : (language === 'en' ? 'Text Alignment: Justify (Click to Left)' : 'Rata Teks: Rata Justify (Klik untuk Rata Kiri)')
                  }
                  aria-label={
                    textAlign === 'left'
                      ? (language === 'en' ? 'Set text alignment to justify' : 'Ubah ke rata justify')
                      : (language === 'en' ? 'Set text alignment to left' : 'Ubah ke rata kiri')
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
                  onClick={onClosePreview}
                  title={language === 'en' ? 'Close' : 'Tutup'}
                  aria-label={language === 'en' ? 'Close' : 'Tutup'}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Full-width Color Picker Popup on Mobile */}
              {isColorPickerOpen && (
                <>
                  {/* Backdrop Dismiss */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsColorPickerOpen(false)}
                  />

                  {/* Dropdown Popup */}
                  <div className="absolute left-3 right-3 top-full mt-2 bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-200 p-3.5 z-50 animate-in fade-in zoom-in-95">
                    <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0"
                          style={{ backgroundColor: headerColor }}
                        />
                        <span className="text-xs font-bold text-slate-900">
                          {language === 'en' ? 'Header Color' : 'Warna Header'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsColorPickerOpen(false)}
                        className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Preset Color Circles */}
                    <div className="grid grid-cols-6 gap-2 mb-3">
                      {HEADER_COLOR_PRESETS.map((preset) => {
                        const isSelected = headerColor.toLowerCase() === preset.hex.toLowerCase();
                        return (
                          <button
                            key={preset.hex}
                            type="button"
                            onClick={() => {
                              setHeaderColor(preset.hex);
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
                              <Check className="w-3.5 h-3.5 text-white drop-shadow-xs" strokeWidth={3} />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Hex Input & Native Color Picker */}
                    <div className="flex items-center gap-2 pt-2.5 border-t border-slate-100">
                      <label className="text-xs font-bold text-slate-500 shrink-0">HEX</label>
                      <div className="flex-1 flex items-center">
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
                          className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-lg px-2.5 py-1 text-xs font-mono font-bold text-slate-800 outline-none uppercase"
                          placeholder="#0F172A"
                        />
                      </div>
                      <input
                        type="color"
                        value={headerColor.startsWith('#') && headerColor.length === 7 ? headerColor : '#0F172A'}
                        onChange={(e) => setHeaderColor(e.target.value.toUpperCase())}
                        className="w-7 h-7 rounded-lg border border-slate-200 cursor-pointer p-0 bg-transparent overflow-hidden shrink-0"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Sheet Body: Multi-Page View on Clean Light Background */}
            <div className="flex-1 bg-slate-100/80 p-3 overflow-y-auto relative flex flex-col items-center w-full h-full pb-6">
              {isBuildingPdf ? (
                <div className="flex flex-col items-center justify-center h-full gap-3 text-slate-500 my-auto">
                  <Loader2 className="w-7 h-7 animate-spin text-blue-500" />
                  <p className="text-xs font-medium">
                    {language === 'en' ? 'Preparing multi-page PDF...' : 'Menyiapkan PDF multi-halaman...'}
                  </p>
                </div>
              ) : previewPageImages.length > 0 ? (
                <div className="w-full flex flex-col items-center space-y-4 pb-4">
                  {previewPageImages.map((pageImg, idx) => (
                    <div key={idx} className="bg-white shadow-lg rounded-sm border border-slate-200 w-full overflow-hidden">
                      <img
                        src={pageImg}
                        alt={`Halaman ${idx + 1}`}
                        className="w-full h-auto block select-none"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="w-full max-w-3xl py-1 overflow-y-auto">
                  <AtsDocumentSheet
                    cvData={cvData}
                    items={items}
                    language={language}
                    totalActiveItems={totalActiveItems}
                    sectionOrders={sectionOrders}
                    headline={customHeadline}
                    summaryText={customSummary}
                    designPreset={designPreset}
                    preset={selectedPresetRole}
                    textAlign={textAlign}
                    headerColor={headerColor}
                  />
                </div>
              )}
            </div>

            {/* Mobile Fixed Footer: Download PDF Button */}
            <div className="bg-white border-t border-slate-200 p-3 shrink-0 w-full">
              <button
                type="button"
                onClick={handleDownloadCustomPDF}
                disabled={isDownloading}
                className="w-full bg-[#0062E3] hover:bg-[#0052be] active:bg-[#00419e] text-white font-bold text-sm py-3 px-4 rounded-xl transition-colors shadow-xs disabled:opacity-60 cursor-pointer text-center"
              >
                {isDownloading
                  ? (language === 'en' ? 'Downloading...' : 'Mengunduh...')
                  : 'Download PDF'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL / BOTTOM SHEET: PRESET DESIGN */}
      <DesignModal
        isOpen={isDesignModalOpen}
        onClose={() => setIsDesignModalOpen(false)}
        language={language}
        designPreset={designPreset}
        setDesignPreset={setDesignPreset}
        DESIGN_OPTIONS={DESIGN_OPTIONS}
      />

      {/* MODAL / BOTTOM SHEET: PRESET ROLE */}
      <RolePresetModal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        language={language}
        roleSearchQuery={roleSearchQuery}
        setRoleSearchQuery={setRoleSearchQuery}
        filteredRoleOptions={filteredRoleOptions}
        activePreset={activePreset}
        applyPreset={applyPreset}
      />
    </div>
  );
};
