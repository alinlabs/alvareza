import React from 'react';
import { SectionProps } from './types';
import { CheckSquare, Square, SectionHeadlineBar } from '../shared';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { getTailoredMetrics } from '../../../data/tailoredMetrics';
import { getTailoredExperiences } from '../../../data/tailoredExperiences';
import { getTailoredConsulting, getTailoredDigitalSolutions } from '../../../data/tailoredProjects';
import { getTailoredOrganizations } from '../../../data/tailoredOrganizations';

export const AchievementsSection: React.FC<SectionProps & { customSummary?: string }> = ({
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
          {/* SECTION 10: ACHIEVEMENTS */}
          <div id="section-achievements" className="scroll-mt-24 space-y-2">
            <SectionHeadlineBar
              title={language === 'en' ? 'Achievements' : 'Penghargaan'}
              isActive={isSectionActive('achievements')}
              isExpanded={expandedSections.achievements}
              onToggleAccordion={() => toggleAccordion('achievements')}
              onToggleActive={(val) => setSectionActiveState('achievements', val)}
            />
            {expandedSections.achievements && (
              <div className="pt-1.5 space-y-2">
                <div className="flex items-center justify-between px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600">
                  <span>{language === 'en' ? 'Maximum 5 achievements displayed' : 'Maksimal 5 prestasi ditampilkan'}</span>
                  <span className="font-bold text-[#0062E3]">
                    {Object.values(items.achievements).filter(Boolean).length} / 5
                  </span>
                </div>
                {(cvData.achievements || [])
                  .sort((a, b) => (sectionOrders.achievements.indexOf(a.id) !== -1 ? sectionOrders.achievements.indexOf(a.id) : 999) - (sectionOrders.achievements.indexOf(b.id) !== -1 ? sectionOrders.achievements.indexOf(b.id) : 999))
                  .map((ach, index, arr) => {
                    const isFirst = index === 0;
                    const isLast = index === arr.length - 1;
                    const isChecked = !!items.achievements[ach.id];
                    const isMaxReached = !isChecked && Object.values(items.achievements).filter(Boolean).length >= 5;
                    return (
                      <div key={ach.id} className={`rounded-xl p-3 border transition-all flex items-center justify-between gap-3 ${
                        isChecked
                          ? 'bg-[#0062E3] border-[#0062E3] text-white shadow-xs'
                          : 'bg-white border-slate-200 hover:border-slate-300 opacity-60 hover:opacity-100 text-slate-900'
                      } ${isMaxReached ? 'opacity-40' : ''}`}>
                        <label
                          onClick={() => !isMaxReached && toggleItem('achievements', ach.id)}
                          className={`flex items-start gap-3 flex-1 select-none min-w-0 ${isMaxReached ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                          title={isMaxReached ? (language === 'en' ? 'Maximum 5 achievements reached' : 'Maksimal 5 prestasi tercapai') : undefined}
                        >
                          <div className="flex flex-col min-w-0">
                            <span className={`text-xs font-bold leading-snug truncate ${isChecked ? 'text-white' : 'text-slate-900'}`}>{ach.title}</span>
                            <span className={`text-[11px] font-medium leading-tight mt-0.5 truncate ${isChecked ? 'text-blue-100' : 'text-slate-500'}`}>{ach.organization} • {ach.year} ({ach.level})</span>
                          </div>
                        </label>
                        <div className={`flex items-center gap-0.5 p-1 rounded-lg border shrink-0 ${
                          isChecked ? 'bg-white/15 border-white/20' : 'bg-slate-50 border-slate-200/80'
                        }`}>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); moveItem('achievements', ach.id, 'up'); }}
                            disabled={isFirst}
                            className={`p-1 rounded transition-colors ${
                              isChecked
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
                            onClick={(e) => { e.stopPropagation(); moveItem('achievements', ach.id, 'down'); }}
                            disabled={isLast}
                            className={`p-1 rounded transition-colors ${
                              isChecked
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
