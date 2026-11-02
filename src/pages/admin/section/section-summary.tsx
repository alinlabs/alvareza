import React, { useEffect, useRef } from 'react';
import { SectionProps } from '../types';
import { SectionHeadlineBar } from '../PrintableShared';

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

      {isExpanded && (
        <div className="pt-1.5 space-y-1.5">
          <div className="relative">
            <textarea
              ref={activeRef}
              rows={4}
              value={customSummary}
              onChange={(e) => {
                if (setCustomSummary) {
                  setCustomSummary(e.target.value);
                }
                // Dynamic auto-grow
                e.target.style.height = 'auto';
                e.target.style.height = `${e.target.scrollHeight + 4}px`;
              }}
              placeholder={language === 'en' ? 'Write executive professional summary...' : 'Tulis ringkasan profil eksekutif profesional...'}
              className="w-full text-xs font-normal text-slate-800 bg-white border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-[#0062E3] focus:border-[#0062E3] leading-relaxed resize-none shadow-2xs overflow-hidden transition-all placeholder:text-slate-400"
            />
          </div>
        </div>
      )}
    </div>
  );
};
