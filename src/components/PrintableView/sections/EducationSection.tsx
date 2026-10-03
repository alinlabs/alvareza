import React from 'react';
import { SectionProps } from './types';
import { CheckSquare, Square, SectionHeadlineBar } from '../shared';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { getTailoredMetrics } from '../../../data/tailoredMetrics';
import { getTailoredExperiences } from '../../../data/tailoredExperiences';
import { getTailoredConsulting, getTailoredDigitalSolutions } from '../../../data/tailoredProjects';
import { getTailoredOrganizations } from '../../../data/tailoredOrganizations';

export const EducationSection: React.FC<SectionProps & { customSummary?: string }> = ({
  cvData,
  items,
  language,
  expandedSections,
  isSectionActive,
  toggleAccordion,
  setSectionActiveState,
  toggleItem,
  toggleEntireSection,
  sectionOrders,
  moveItem,
  selectedPresetRole,
  customSummary,
  setSectionOrders,
  setActivePreset,
  setItems
}) => {
  return (
    <>
          {/* SECTION 4: EDUCATION */}
          <div id="section-education" className="scroll-mt-24 space-y-2">
            <SectionHeadlineBar
              title={language === 'en' ? 'Education' : 'Pendidikan'}
              isActive={isSectionActive('education')}
              isExpanded={expandedSections.education}
              onToggleAccordion={() => toggleAccordion('education')}
              onToggleActive={(val) => setSectionActiveState('education', val)}
            />
            {expandedSections.education && (
              <div className="pt-1.5 space-y-2">
                {cvData.education
                  .map((edu, idx) => ({ ...edu, idx }))
                  .sort((a, b) => (sectionOrders.education.indexOf(a.idx) !== -1 ? sectionOrders.education.indexOf(a.idx) : 999) - (sectionOrders.education.indexOf(b.idx) !== -1 ? sectionOrders.education.indexOf(b.idx) : 999))
                  .map((edu, index, arr) => {
                    const isFirst = index === 0;
                    const isLast = index === arr.length - 1;
                    const isSelected = !!items.education[edu.idx];
                    return (
                      <div key={edu.idx} className={`rounded-xl p-3 border transition-all flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-[#0062E3] border-[#0062E3] text-white shadow-xs'
                          : 'bg-white border-slate-200 hover:border-slate-300 opacity-60 hover:opacity-100 text-slate-900'
                      }`}>
                        <label onClick={() => toggleItem('education', edu.idx)} className="flex items-start gap-3 cursor-pointer flex-1 select-none min-w-0">
                          <div className="flex flex-col min-w-0">
                            <span className={`text-xs font-bold leading-snug truncate ${isSelected ? 'text-white' : 'text-slate-900'}`}>{edu.degree}</span>
                            <span className={`text-[11px] font-medium leading-tight mt-0.5 truncate ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>{edu.institution} • {edu.period}</span>
                          </div>
                        </label>
                        <div className={`flex items-center gap-0.5 p-1 rounded-lg border shrink-0 ${
                          isSelected ? 'bg-white/15 border-white/20' : 'bg-slate-50 border-slate-200/80'
                        }`}>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); moveItem('education', edu.idx, 'up'); }}
                            disabled={isFirst}
                            className={`p-1 rounded transition-colors ${
                              isSelected
                                ? (isFirst ? 'text-white/30 cursor-not-allowed' : 'text-white hover:bg-white/20 cursor-pointer')
                                : (isFirst ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:text-[#0062E3] hover:bg-white cursor-pointer shadow-2xs')
                            }`}
                            title="Pindah urutan ke atas"
                            aria-label="Pindah ke atas"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); moveItem('education', edu.idx, 'down'); }}
                            disabled={isLast}
                            className={`p-1 rounded transition-colors ${
                              isSelected
                                ? (isLast ? 'text-white/30 cursor-not-allowed' : 'text-white hover:bg-white/20 cursor-pointer')
                                : (isLast ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 hover:text-[#0062E3] hover:bg-white cursor-pointer shadow-2xs')
                            }`}
                            title="Pindah urutan ke bawah"
                            aria-label="Pindah ke bawah"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>

    </>
  );
};
