import React, { useState, useEffect, ReactNode } from 'react';
import {
  Download,
  AlignLeft,
  AlignJustify,
  Loader2,
  X,
  ChevronDown,
  ChevronUp,
  Check,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { QuickbarNavigator } from "./section/quickbar";
import { DESIGN_OPTIONS, HEADER_COLOR_PRESETS } from "./constants";
import { DesignModal } from "./section/modal-design";
import { SectionList } from "./section/SectionList";
import { useCvSelection } from '../../hooks/useCvSelection';
import { useDocumentCustomization } from '../../hooks/useDocumentCustomization';
import { usePdfPreview } from '../../hooks/usePdfPreview';
import { AtsDocumentSheet } from '../full-view/ats-render';
import { ModalCvPreview } from './pdf-preview/ModalCvPreview';
import { RolePresetModal } from "./section/modal-preset";
import { DesignPreset } from './types';
import { ALL_ROLE_PRESETS } from '../../data/preset/RoleConfig';
import { useScrollLock } from '../../utils/scrollLock';

// --- Shared Reusable Section Elements ---
export const CheckSquare = ({ className }: { className?: string }) => {
  const isShrink = className?.includes('shrink-0');
  return (
    <div className={`w-[16px] h-[16px] rounded-full border-[1.5px] flex items-center justify-center transition-all duration-200 bg-[#0062E3] border-[#0062E3] ${isShrink ? 'shrink-0' : ''}`}>
      <svg className="w-2.5 h-2.5 text-white scale-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </div>
  );
};

export const Square = ({ className }: { className?: string }) => {
  const isShrink = className?.includes('shrink-0');
  return (
    <div className={`w-[16px] h-[16px] rounded-full border-[1.5px] border-slate-300 dark:border-slate-600 transition-all duration-200 bg-transparent ${isShrink ? 'shrink-0' : ''}`}></div>
  );
};

export interface SectionHeadlineBarProps {
  title: string;
  isActive: boolean;
  isExpanded: boolean;
  onToggleAccordion: () => void;
  onToggleActive: (active: boolean) => void;
  extraAction?: ReactNode;
}

export const SectionHeadlineBar: React.FC<SectionHeadlineBarProps> = ({
  title,
  isActive,
  isExpanded,
  onToggleAccordion,
  onToggleActive,
  extraAction,
}) => {
  return (
    <div className="flex items-center justify-between py-1 gap-2">
      {/* Title */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-slate-900 dark:text-slate-100 tracking-tight">{title}</span>
      </div>

      {/* Right Controls: Action + Seekbar Toggle + Accordion Chevron */}
      <div className="flex items-center gap-2">
        {extraAction}

        {/* Minimalist Switch Toggle */}
        <label className="relative inline-flex items-center cursor-pointer select-none">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={isActive}
            onChange={(e) => onToggleActive(e.target.checked)}
          />
          <div className="w-8 h-4.5 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-3.5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 dark:after:border-slate-600 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-[#0062E3]"></div>
        </label>

        {/* Dropdown Chevron */}
        <button
          type="button"
          onClick={onToggleAccordion}
          className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label={isExpanded ? 'Tutup daftar seksi' : 'Buka daftar seksi'}
        >
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
};

export const ROLE_PRESET_OPTIONS = ALL_ROLE_PRESETS;

export interface BuilderProps {
  onBackToLanding?: () => void;
  isPreviewOpen?: boolean;
  onClosePreview?: () => void;
  onOpenPreview?: () => void;
  disableUrlActions?: boolean;
  onPresetChange?: (preset: string) => void;
  onSelectionChange?: (items: import('../../data/preset/ItemSelections').ItemSelectionState) => void;
}

export const Builder: React.FC<BuilderProps> = ({
  isPreviewOpen = false,
  onClosePreview,
  onOpenPreview,
  disableUrlActions = false,
  onPresetChange,
  onSelectionChange,
}) => {
  const { language, setLanguage, activeCvData: cvData } = useLanguage();

  // Custom Hook: CV Item and Order Selections
  const {
    items, setItems, sectionOrders, setSectionOrders, expandedSections,
    selectedPresetRole, activePreset, setActivePreset, moveItem,
    toggleAccordion, isSectionActive, setSectionActiveState, toggleEntireSection, toggleItem,
    applyPreset, scrollToSection
  } = useCvSelection(cvData, onPresetChange);

  // Notify parent of active CV item selection changes
  useEffect(() => {
    onSelectionChange?.(items);
  }, [items, onSelectionChange]);

  // Design Preset State ('block' or 'line')
  const [designPreset, setDesignPreset] = useState<DesignPreset>('block');
  // Text Alignment State ('left' or 'justify')
  const [textAlign, setTextAlign] = useState<'left' | 'justify'>('left');
  // Section Header Background Color State
  const [headerColor, setHeaderColor] = useState<string>('#0F172A');
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);

  // Specialization (Headline) Active & Accordion States - default active and collapsed
  const [isSpecializationActive, setIsSpecializationActive] = useState<boolean>(true);
  const [isSpecializationExpanded, setIsSpecializationExpanded] = useState<boolean>(false);

  // Modal / Bottom Sheet States
  const [isDesignModalOpen, setIsDesignModalOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [roleSearchQuery, setRoleSearchQuery] = useState('');

  // Lock background body scroll cleanly via centralized manager when any modal is active
  useScrollLock(isPreviewOpen || isDesignModalOpen || isRoleModalOpen, 'printable-view');

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

  // Effective specialization headline (disabled when seekbar switch is toggled off)
  const effectiveHeadline = isSpecializationActive ? customHeadline : '';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-1 sm:pt-1.5 space-y-4">
      {/* QUICKBAR NAVIGATOR */}
      <QuickbarNavigator
        language={language}
        isSectionActive={isSectionActive}
        scrollToSection={scrollToSection}
      />

      {/* FILTER BAR (Desain & Peran Modal Triggers + Editable Inputs) */}
      <div className="print:hidden w-full space-y-3">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full">
          {/* Desain Trigger: Judul di atas kolom */}
          <div className="flex flex-col gap-1.5 w-full min-w-0">
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100 tracking-tight select-none">
              {language === 'en' ? 'Design' : 'Desain'}
            </span>
            <button
              type="button"
              onClick={() => setIsDesignModalOpen(true)}
              className="flex items-center justify-between gap-2 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 active:bg-slate-200 dark:active:bg-slate-750 font-semibold text-xs text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 rounded-xl px-3 py-2 cursor-pointer transition-all focus:outline-none focus:ring-1.5 focus:ring-[#0062E3]/30 w-full min-w-0"
            >
              <span className="truncate font-medium">
                {designPreset === 'block' && (language === 'en' ? 'Block' : 'Blok')}
                {designPreset === 'line' && (language === 'en' ? 'Line' : 'Garis')}
                {designPreset === 'badge' && (language === 'en' ? 'Badge' : 'Badge')}
                {designPreset === 'plain' && (language === 'en' ? 'Plain' : 'Polos')}
                {designPreset === 'modern' && (language === 'en' ? 'Modern' : 'Modern')}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </button>
          </div>

          {/* Peran Trigger: Judul di atas kolom */}
          <div className="flex flex-col gap-1.5 w-full min-w-0">
            <span className="text-xs font-bold text-slate-900 dark:text-slate-100 tracking-tight select-none">
              {language === 'en' ? 'Role' : 'Peran'}
            </span>
            <button
              type="button"
              onClick={() => setIsRoleModalOpen(true)}
              className="flex items-center justify-between gap-2 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 active:bg-slate-200 dark:active:bg-slate-750 font-semibold text-xs text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 rounded-xl px-3 py-2 cursor-pointer transition-all focus:outline-none focus:ring-1.5 focus:ring-[#0062E3]/30 w-full min-w-0 text-left"
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

        {/* EDITABLE INPUT FIELD: JUDUL SPESIALISASI DENGAN SEEKBAR & DROPDOWN ACCORDION */}
        <div id="section-specialization" className="space-y-1.5 pt-1">
          <SectionHeadlineBar
            title={language === 'en' ? 'Specialization' : 'Spesialisasi'}
            isActive={isSpecializationActive}
            isExpanded={isSpecializationExpanded}
            onToggleAccordion={() => setIsSpecializationExpanded((prev) => !prev)}
            onToggleActive={(val) => setIsSpecializationActive(val)}
          />

          {isSpecializationExpanded && (
            <div className="pt-0.5">
              <input
                type="text"
                value={customHeadline}
                onChange={(e) => setCustomHeadline(e.target.value)}
                placeholder={language === 'en' ? 'e.g. Business Operations Manager...' : 'mis. Management Professional, Strategic Operations...'}
                className="w-full bg-slate-50 dark:bg-slate-900 hover:bg-slate-100/80 dark:hover:bg-slate-850 focus:bg-white dark:focus:bg-slate-900 text-xs font-normal text-slate-700 dark:text-slate-100 border border-slate-200 dark:border-slate-800 focus:border-[#0062E3] dark:focus:border-blue-500 focus:ring-1.5 focus:ring-[#0062E3]/20 rounded-xl px-3 py-2 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
            </div>
          )}
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
          headline={effectiveHeadline}
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
        customHeadline={effectiveHeadline}
        customSummary={customSummary}
        onDesignPresetChange={setDesignPreset}
        onHeaderColorChange={setHeaderColor}
        onTextAlignChange={setTextAlign}
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

// Aliases for clean backward compatibility
export const PrintableView = Builder;
export type PrintableViewProps = BuilderProps;
export default Builder;
