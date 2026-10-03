import React, { useEffect, useRef } from 'react';
import { SectionProps } from './types';
import { SectionHeadlineBar } from '../shared';

export const SummarySection: React.FC<SectionProps & {
  customSummary?: string;
  setCustomSummary?: (val: string) => void;
  summaryTextareaRef?: React.RefObject<HTMLTextAreaElement>;
}> = ({
  items,
  language,
  expandedSections,
  isSectionActive,
  toggleAccordion,
  setSectionActiveState,
  customSummary = '',
  setCustomSummary,
  summaryTextareaRef,
}) => {
  const localRef = useRef<HTMLTextAreaElement>(null);
  const activeRef = summaryTextareaRef || localRef;

  const isExpanded = expandedSections?.summary ?? false;

  // Ensure textarea height auto-adjusts to fit all content without scrollbar
  useEffect(() => {
    if (isExpanded && activeRef.current) {
      activeRef.current.style.height = 'auto';
      activeRef.current.style.height = `${activeRef.current.scrollHeight + 4}px`;
    }
  }, [customSummary, activeRef, isExpanded]);

  return (
    <div id="section-summary" className="scroll-mt-24 space-y-1.5">
      {/* Header Bar: "Ringkasan Eksekutif" + Seekbar Toggle + Dropdown Accordion Icon */}
      <SectionHeadlineBar
        title={language === 'en' ? 'Summary' : 'Ringkasan'}
        isActive={isSectionActive('summary')}
        isExpanded={isExpanded}
        onToggleAccordion={() => toggleAccordion('summary')}
        onToggleActive={(val) => setSectionActiveState('summary', val)}
      />

      {/* Input Textarea Column for Executive Summary (Auto-height, No Scroll) */}
      {isExpanded && (
        <textarea
          ref={activeRef}
          rows={2}
          value={customSummary}
          onChange={(e) => setCustomSummary && setCustomSummary(e.target.value)}
          placeholder={language === 'en' ? 'Enter executive summary...' : 'Tuliskan ringkasan profil eksekutif...'}
          className={`w-full bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-xs font-normal text-slate-700 border border-slate-200 focus:border-[#0062E3] focus:ring-1.5 focus:ring-[#0062E3]/20 rounded-xl px-3 py-2 outline-none transition-all leading-relaxed placeholder:text-slate-400 overflow-hidden resize-none ${
            !items.summary ? 'opacity-50' : ''
          }`}
        />
      )}
    </div>
  );
};


