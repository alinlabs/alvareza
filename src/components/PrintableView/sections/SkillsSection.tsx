import React from 'react';
import { SectionProps } from './types';
import { CheckSquare, Square, SectionHeadlineBar } from '../shared';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { getTailoredMetrics } from '../../../data/tailoredMetrics';
import { getTailoredExperiences } from '../../../data/tailoredExperiences';
import { getTailoredConsulting, getTailoredDigitalSolutions } from '../../../data/tailoredProjects';
import { getTailoredOrganizations } from '../../../data/tailoredOrganizations';

export const SkillsSection: React.FC<SectionProps & { customSummary?: string }> = ({
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
          {/* SECTION 5: SKILLS (Now separated into Hard, Soft, Tools) */}
          {/* HARD SKILLS */}
          <div id="section-skills" className="scroll-mt-24 space-y-2">
            <SectionHeadlineBar
              title={language === 'en' ? 'Hard Skills' : 'Hard Skills'}
              isActive={!!items.skills.hardGroup}
              isExpanded={expandedSections.skills_hard}
              onToggleAccordion={() => toggleAccordion('skills_hard')}
              onToggleActive={() => {
                setActivePreset(null);
                setItems((prev) => {
                  const newGroupVal = !prev.skills.hardGroup;
                  const newHard = { ...prev.skills.hard };
                  if (newGroupVal && !Object.values(newHard).some(Boolean)) {
                    cvData.skills.hard.forEach((_, idx) => { newHard[idx] = true; });
                  }
                  return {
                    ...prev,
                    skills: {
                      ...prev.skills,
                      hardGroup: newGroupVal,
                      hard: newHard,
                    },
                  };
                });
              }}
            />
            {expandedSections.skills_hard && items.skills.hardGroup && (
              <div className="pt-1.5 space-y-2">
                {cvData.skills.hard
                  .map((group, idx) => ({ ...group, idx }))
                  .sort((a, b) => (sectionOrders.skills_hard?.indexOf(a.idx) !== -1 ? sectionOrders.skills_hard.indexOf(a.idx) : 999) - (sectionOrders.skills_hard?.indexOf(b.idx) !== -1 ? sectionOrders.skills_hard.indexOf(b.idx) : 999))
                  .map((group, index, arr) => {
                    const isChecked = !!items.skills.hard?.[group.idx];
                    const isFirst = index === 0;
                    const isLast = index === arr.length - 1;
                    return (
                      <div
                        key={group.idx}
                        className={`rounded-xl p-3 border transition-all flex items-center justify-between gap-3 ${
                          isChecked
                            ? 'bg-[#0062E3] border-[#0062E3] text-white shadow-xs'
                            : 'bg-white border-slate-200 hover:border-slate-300 opacity-60 hover:opacity-100 text-slate-900'
                        }`}
                      >
                        <label
                          onClick={() => {
                            setActivePreset(null);
                            setItems((prev) => ({
                              ...prev,
                              skills: {
                                ...prev.skills,
                                hard: {
                                  ...(prev.skills.hard || {}),
                                  [group.idx]: !prev.skills.hard?.[group.idx],
                                },
                              },
                            }));
                          }}
                          className="flex items-start gap-3 cursor-pointer flex-1 select-none min-w-0"
                        >
                          <div className="flex flex-col min-w-0">
                            <span className={`text-xs font-bold leading-snug truncate ${isChecked ? 'text-white' : 'text-slate-900'}`}>
                              {group.category}
                            </span>
                            <span className={`text-[11px] font-normal leading-tight mt-0.5 truncate ${isChecked ? 'text-blue-100' : 'text-slate-500'}`}>
                              {group.items.join(', ')}
                            </span>
                          </div>
                        </label>
                        <div className={`flex items-center gap-0.5 p-1 rounded-lg border shrink-0 ${
                          isChecked ? 'bg-white/15 border-white/20' : 'bg-slate-50 border-slate-200/80'
                        }`}>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); moveItem('skills_hard', group.idx, 'up'); }}
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
                            onClick={(e) => { e.stopPropagation(); moveItem('skills_hard', group.idx, 'down'); }}
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

          {/* SOFT SKILLS */}
          <div className="scroll-mt-24 space-y-2">
            <SectionHeadlineBar
              title={language === 'en' ? 'Soft Skills' : 'Soft Skills'}
              isActive={!!items.skills.softGroup}
              isExpanded={expandedSections.skills_soft}
              onToggleAccordion={() => toggleAccordion('skills_soft')}
              onToggleActive={() => {
                setActivePreset(null);
                setItems((prev) => {
                  const newGroupVal = !prev.skills.softGroup;
                  const newSoft = { ...prev.skills.soft };
                  if (newGroupVal && !Object.values(newSoft).some(Boolean)) {
                    cvData.skills.soft.forEach((_, idx) => { newSoft[idx] = true; });
                  }
                  return {
                    ...prev,
                    skills: {
                      ...prev.skills,
                      softGroup: newGroupVal,
                      soft: newSoft,
                    },
                  };
                });
              }}
            />
            {expandedSections.skills_soft && items.skills.softGroup && (
              <div className="pt-1.5 space-y-2">
                {cvData.skills.soft
                  .map((item, idx) => ({ item, idx }))
                  .sort((a, b) => (sectionOrders.skills_soft?.indexOf(a.idx) !== -1 ? sectionOrders.skills_soft.indexOf(a.idx) : 999) - (sectionOrders.skills_soft?.indexOf(b.idx) !== -1 ? sectionOrders.skills_soft.indexOf(b.idx) : 999))
                  .map(({ item, idx }, index, arr) => {
                    const isChecked = !!items.skills.soft?.[idx];
                    const isFirst = index === 0;
                    const isLast = index === arr.length - 1;
                    const colonIdx = item.indexOf(':');
                    const title = colonIdx !== -1 ? item.substring(0, colonIdx) : item;
                    const desc = colonIdx !== -1 ? item.substring(colonIdx + 1).trim() : '';
                    return (
                      <div
                        key={idx}
                        className={`rounded-xl p-3 border transition-all flex items-center justify-between gap-3 ${
                          isChecked
                            ? 'bg-[#0062E3] border-[#0062E3] text-white shadow-xs'
                            : 'bg-white border-slate-200 hover:border-slate-300 opacity-60 hover:opacity-100 text-slate-900'
                        }`}
                      >
                        <label
                          onClick={() => {
                            setActivePreset(null);
                            setItems((prev) => ({
                              ...prev,
                              skills: {
                                ...prev.skills,
                                soft: {
                                  ...(prev.skills.soft || {}),
                                  [idx]: !prev.skills.soft?.[idx],
                                },
                              },
                            }));
                          }}
                          className="flex items-start gap-3 cursor-pointer flex-1 select-none min-w-0"
                        >
                          <div className="flex flex-col min-w-0">
                            <span className={`text-xs font-bold leading-snug truncate ${isChecked ? 'text-white' : 'text-slate-900'}`}>
                              {title}
                            </span>
                            {desc && (
                              <span className={`text-[11px] font-normal leading-tight mt-0.5 truncate ${isChecked ? 'text-blue-100' : 'text-slate-500'}`}>
                                {desc}
                              </span>
                            )}
                          </div>
                        </label>
                        <div className={`flex items-center gap-0.5 p-1 rounded-lg border shrink-0 ${
                          isChecked ? 'bg-white/15 border-white/20' : 'bg-slate-50 border-slate-200/80'
                        }`}>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); moveItem('skills_soft', idx, 'up'); }}
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
                            onClick={(e) => { e.stopPropagation(); moveItem('skills_soft', idx, 'down'); }}
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

          {/* TOOLS & EKOSISTEM */}
          <div className="scroll-mt-24 space-y-2">
            <SectionHeadlineBar
              title={language === 'en' ? 'Tools & Ecosystem' : 'Tools & Ekosistem'}
              isActive={!!items.skills.toolsGroup}
              isExpanded={expandedSections.skills_tools}
              onToggleAccordion={() => toggleAccordion('skills_tools')}
              onToggleActive={() => {
                setActivePreset(null);
                setItems((prev) => {
                  const newGroupVal = !prev.skills.toolsGroup;
                  const newTools = { ...prev.skills.tools };
                  if (newGroupVal && !Object.values(newTools).some(Boolean)) {
                    (cvData.skills.toolCategories || []).forEach((_, idx) => { newTools[idx] = true; });
                  }
                  return {
                    ...prev,
                    skills: {
                      ...prev.skills,
                      toolsGroup: newGroupVal,
                      tools: newTools,
                    },
                  };
                });
              }}
            />
            {expandedSections.skills_tools && items.skills.toolsGroup && (
              <div className="pt-1.5 space-y-2">
                {(cvData.skills.toolCategories || [])
                  .map((group, idx) => ({ ...group, idx }))
                  .sort((a, b) => (sectionOrders.skills_tools?.indexOf(a.idx) !== -1 ? sectionOrders.skills_tools.indexOf(a.idx) : 999) - (sectionOrders.skills_tools?.indexOf(b.idx) !== -1 ? sectionOrders.skills_tools.indexOf(b.idx) : 999))
                  .map((group, index, arr) => {
                    const isChecked = !!items.skills.tools?.[group.idx];
                    const isFirst = index === 0;
                    const isLast = index === arr.length - 1;
                    return (
                      <div
                        key={group.idx}
                        className={`rounded-xl p-3 border transition-all flex items-center justify-between gap-3 ${
                          isChecked
                            ? 'bg-[#0062E3] border-[#0062E3] text-white shadow-xs'
                            : 'bg-white border-slate-200 hover:border-slate-300 opacity-60 hover:opacity-100 text-slate-900'
                        }`}
                      >
                        <label
                          onClick={() => {
                            setActivePreset(null);
                            setItems((prev) => ({
                              ...prev,
                              skills: {
                                ...prev.skills,
                                tools: {
                                  ...(prev.skills.tools || {}),
                                  [group.idx]: !prev.skills.tools?.[group.idx],
                                },
                              },
                            }));
                          }}
                          className="flex items-start gap-3 cursor-pointer flex-1 select-none min-w-0"
                        >
                          <div className="flex flex-col min-w-0">
                            <span className={`text-xs font-bold leading-snug truncate ${isChecked ? 'text-white' : 'text-slate-900'}`}>
                              {group.category}
                            </span>
                            <span className={`text-[11px] font-normal leading-tight mt-0.5 truncate ${isChecked ? 'text-blue-100' : 'text-slate-500'}`}>
                              {group.tools}
                            </span>
                          </div>
                        </label>
                        <div className={`flex items-center gap-0.5 p-1 rounded-lg border shrink-0 ${
                          isChecked ? 'bg-white/15 border-white/20' : 'bg-slate-50 border-slate-200/80'
                        }`}>
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); moveItem('skills_tools', group.idx, 'up'); }}
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
                            onClick={(e) => { e.stopPropagation(); moveItem('skills_tools', group.idx, 'down'); }}
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
