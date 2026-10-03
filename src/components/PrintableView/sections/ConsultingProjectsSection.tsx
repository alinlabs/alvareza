import React from 'react';
import { SectionProps } from './types';
import { CheckSquare, Square, SectionHeadlineBar } from '../shared';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { getTailoredMetrics } from '../../../data/tailoredMetrics';
import { getTailoredExperiences } from '../../../data/tailoredExperiences';
import { getTailoredConsulting, getTailoredDigitalSolutions } from '../../../data/tailoredProjects';
import { getTailoredOrganizations } from '../../../data/tailoredOrganizations';

export const ConsultingProjectsSection: React.FC<SectionProps & { customSummary?: string }> = ({
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
          {/* SECTION 7: CONSULTING PROJECTS */}
          <div id="section-consultingProjects" className="scroll-mt-24 space-y-2">
            <SectionHeadlineBar
              title={language === 'en' ? 'Project Consulting' : 'Konsultan Proyek'}
              isActive={isSectionActive('consultingProjects')}
              isExpanded={expandedSections.consultingProjects}
              onToggleAccordion={() => toggleAccordion('consultingProjects')}
              onToggleActive={(val) => setSectionActiveState('consultingProjects', val)}
            />
            {expandedSections.consultingProjects && (
              <div className="pt-1.5 space-y-2">
                {(getTailoredConsulting(selectedPresetRole, language).projects || [])
                  .sort((a, b) => (sectionOrders.consultingProjects.indexOf(a.id) !== -1 ? sectionOrders.consultingProjects.indexOf(a.id) : 999) - (sectionOrders.consultingProjects.indexOf(b.id) !== -1 ? sectionOrders.consultingProjects.indexOf(b.id) : 999))
                  .map((proj, index, arr) => {
                    const isFirst = index === 0;
                    const isLast = index === arr.length - 1;
                    const isSelected = !!items.consultingProjects[proj.id];
                    return (
                      <div key={proj.id} className={`rounded-xl p-3 border transition-all flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-[#0062E3] border-[#0062E3] text-white shadow-xs'
                          : 'bg-white border-slate-200 hover:border-slate-300 opacity-60 hover:opacity-100 text-slate-900'
                      }`}>
                        <label onClick={() => toggleItem('consultingProjects', proj.id)} className="flex items-start gap-3 cursor-pointer flex-1 select-none min-w-0">
                          <div className="flex flex-col min-w-0">
                            <span className={`text-xs font-bold leading-snug truncate ${isSelected ? 'text-white' : 'text-slate-900'}`}>{proj.role} - {proj.organization}</span>
                            <span className={`text-[11px] font-medium leading-tight mt-0.5 truncate ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>{proj.sector} • {proj.periodType}</span>
                          </div>
                        </label>
                        <div className={`flex items-center gap-0.5 p-1 rounded-lg border shrink-0 ${
                          isSelected ? 'bg-white/15 border-white/20' : 'bg-slate-50 border-slate-200/80'
                        }`}>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); moveItem('consultingProjects', proj.id, 'up'); }}
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
                            onClick={(e) => { e.stopPropagation(); moveItem('consultingProjects', proj.id, 'down'); }}
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
