import React, { useState, useEffect } from 'react';
import {
  Download,
  AlignLeft,
  AlignJustify,
  Loader2,
  X,
  ChevronDown,
  Check,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { QuickbarNavigator } from "./section/section-quickbar";
import { DESIGN_OPTIONS, HEADER_COLOR_PRESETS } from "./constants";
import { DesignModal } from "./modal-design";
import { SectionList } from "./section/SectionList";
import { useCvSelection } from '../../hooks/useCvSelection';
import { useDocumentCustomization } from '../../hooks/useDocumentCustomization';
import { usePdfPreview } from '../../hooks/usePdfPreview';
import { AtsDocumentSheet } from '../full-view/ats-render';
import { ModalCvPreview } from './pdf-preview/ModalCvPreview';
import { RolePresetModal } from "./modal-preset";
import { DesignPreset } from './types';
import { ALL_ROLE_PRESETS } from '../../data/preset/RoleConfig';

export const ROLE_PRESET_OPTIONS = ALL_ROLE_PRESETS;

interface PrintableViewProps {
  onBackToLanding?: () => void;
  isPreviewOpen?: boolean;
  onClosePreview?: () => void;
  onOpenPreview?: () => void;
  disableUrlActions?: boolean;
  onPresetChange?: (preset: string) => void;
}

export const PrintableView: React.FC<PrintableViewProps> = ({
  isPreviewOpen = false,
  onClosePreview,
  onOpenPreview,
  disableUrlActions = false,
  onPresetChange,
}) => {
  const { language, setLanguage, activeCvData: cvData } = useLanguage();

  // Custom Hook: CV Item and Order Selections
  const {
    items, setItems, sectionOrders, setSectionOrders, expandedSections,
    selectedPresetRole, activePreset, setActivePreset, moveItem,
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
      {/* QUICKBAR NAVIGATOR */}
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

      {/* HIDDEN PRINT CONTAINER */}
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

      {/* PREVIEW PDF MODAL (MODALCVPREVIEW DARI PDF-PREVIEW) */}
      <ModalCvPreview
        isOpen={isPreviewOpen}
        onClose={onClosePreview || (() => {})}
        presetKey={selectedPresetRole}
        designPreset={designPreset}
        headerColor={headerColor}
        textAlign={textAlign}
        language={language}
        items={items}
        sectionOrders={sectionOrders}
        customHeadline={customHeadline}
        customSummary={customSummary}
        onDesignPresetChange={setDesignPreset}
        onHeaderColorChange={setHeaderColor}
        onTextAlignChange={setTextAlign}
        onLanguageChange={setLanguage}
      />

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
