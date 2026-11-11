import React from 'react';
import { SectionProps } from '../main/types';
import { SectionHeadlineBar } from '../main/builder';
import { ArrowUp, ArrowDown, Award } from 'lucide-react';
import { CV_ACHIEVEMENT_TO_AWARD_ID_MAP } from '../../../data/penghargaan';

export const AchievementsSection: React.FC<SectionProps & { customSummary?: string }> = ({
  cvData,
  items,
  language,
  expandedSections,
  isSectionActive,
  toggleAccordion,
  setSectionActiveState,
  toggleItem,
  sectionOrders,
  moveItem,
}) => {
  return (
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
              const hasCertificate = Boolean(CV_ACHIEVEMENT_TO_AWARD_ID_MAP[ach.id]);
              return (
                <div key={ach.id} className={`rounded-xl p-3 border transition-all flex items-center justify-between gap-3 ${
                  isChecked
                    ? 'bg-[#0062E3] border-[#0062E3] text-white shadow-xs'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 opacity-60 hover:opacity-100 text-slate-900 dark:text-slate-100'
                } ${isMaxReached ? 'opacity-40' : ''}`}>
                  <label
                    onClick={() => !isMaxReached && toggleItem('achievements', ach.id)}
                    className={`flex items-start gap-3 flex-1 select-none min-w-0 ${isMaxReached ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    title={isMaxReached ? (language === 'en' ? 'Maximum 5 achievements reached' : 'Maksimal 5 prestasi tercapai') : undefined}
                  >
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className={`text-xs font-bold leading-snug truncate ${isChecked ? 'text-white' : 'text-slate-900 dark:text-slate-100'}`}>{ach.title}</span>
                        {hasCertificate && (
                          <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[9.5px] font-semibold shrink-0 ${
                            isChecked
                              ? 'bg-white/20 text-white'
                              : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                          }`}>
                            <Award className="w-2.5 h-2.5" />
                            <span>{language === 'en' ? 'Certified' : 'Sertifikat'}</span>
                          </span>
                        )}
                      </div>
                      <span className={`text-[11px] font-medium leading-tight mt-0.5 truncate ${isChecked ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'}`}>{ach.organization} • {ach.year} ({ach.level})</span>
                    </div>
                  </label>
                  <div className={`flex items-center gap-0.5 p-1 rounded-lg border shrink-0 ${
                    isChecked ? 'bg-white/15 border-white/20' : 'bg-slate-50 dark:bg-slate-800 border-slate-200/80 dark:border-slate-700'
                  }`}>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); moveItem('achievements', ach.id, 'up'); }}
                      disabled={isFirst}
                      className={`p-1 rounded transition-colors ${
                        isChecked
                          ? (isFirst ? 'text-white/30 cursor-not-allowed' : 'text-white hover:bg-white/20 cursor-pointer')
                          : (isFirst ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 dark:text-slate-300 hover:text-[#0062E3] dark:hover:text-blue-400 hover:bg-white dark:hover:bg-slate-700 cursor-pointer shadow-2xs')
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
                          : (isLast ? 'text-slate-300 cursor-not-allowed' : 'text-slate-600 dark:text-slate-300 hover:text-[#0062E3] dark:hover:text-blue-400 hover:bg-white dark:hover:bg-slate-700 cursor-pointer shadow-2xs')
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
  );
};
