import React from 'react';
import { AtsSectionProps } from './types';

export const AtsSkills: React.FC<AtsSectionProps> = ({ items, language, renderSectionHeader, cvData, sectionOrders, textAlign = 'left' }) => {
  const hasHardSkills = items.skills?.hardGroup && Object.values(items.skills.hard || {}).some(Boolean);
  const hasSoftSkills = items.skills?.softGroup && Object.values(items.skills.soft || {}).some(Boolean);
  const hasTools = items.skills?.toolsGroup && Object.values(items.skills.tools || {}).some(Boolean);

  if (!hasHardSkills && !hasSoftSkills && !hasTools) return null;

  return (
    <>
      {/* 5. Keahlian */}
              <section className="mb-3.5">
          {renderSectionHeader(language === 'en' ? 'Core Competencies & Skills' : 'Keahlian')}
          <div className="space-y-2">
            {items.skills.hardGroup && Object.values(items.skills.hard || {}).some(Boolean) && (
              <div>
                <div className="text-[13px] font-bold text-[#0F172A] mb-1">
                  Hard Skills :
                </div>
                <ul className="space-y-1 text-[13px] text-slate-800">
                  {cvData.skills.hard
                    .map((group, idx) => ({ ...group, idx }))
                    .filter((g) => items.skills.hard?.[g.idx])
                    .sort((a, b) => {
                      const idxA = sectionOrders?.skills_hard?.indexOf(a.idx) ?? -1;
                      const idxB = sectionOrders?.skills_hard?.indexOf(b.idx) ?? -1;
                      return (idxA !== -1 ? idxA : a.idx) - (idxB !== -1 ? idxB : b.idx);
                    })
                    .map((group) => (
                      <li key={group.idx} className="flex items-start gap-2 leading-relaxed">
                        <span className="text-[#0F172A] font-bold text-xs shrink-0 select-none mt-0.5">•</span>
                        <p className={`flex-1 min-w-0 font-normal text-slate-700 ${textAlign === 'justify' ? 'text-justify [text-justify:inter-word]' : 'text-left'}`}>
                          <strong className="font-bold text-[#0F172A]">{group.category} :</strong>{' '}
                          {group.items.join(', ')}
                        </p>
                      </li>
                    ))}
                </ul>
              </div>
            )}

            {items.skills.softGroup && Object.values(items.skills.soft || {}).some(Boolean) && (
              <div>
                <div className="text-[13px] font-bold text-[#0F172A] mb-1">
                  {language === 'en' ? 'Soft Skills & Leadership :' : 'Soft Skills & Kepemimpinan :'}
                </div>
                <ul className="space-y-1 text-[13px] text-slate-800">
                  {cvData.skills.soft
                    .map((item, idx) => ({ item, idx }))
                    .filter((s) => items.skills.soft?.[s.idx])
                    .sort((a, b) => {
                      const idxA = sectionOrders?.skills_soft?.indexOf(a.idx) ?? -1;
                      const idxB = sectionOrders?.skills_soft?.indexOf(b.idx) ?? -1;
                      return (idxA !== -1 ? idxA : a.idx) - (idxB !== -1 ? idxB : b.idx);
                    })
                    .map(({ item, idx }) => {
                      const colonIdx = item.indexOf(':');
                      if (colonIdx !== -1) {
                        const prefix = item.substring(0, colonIdx).trim() + ' :';
                        const rest = item.substring(colonIdx + 1);
                        return (
                          <li key={idx} className="flex items-start gap-2 leading-relaxed">
                            <span className="text-[#0F172A] font-bold text-xs shrink-0 select-none mt-0.5">•</span>
                            <p className={`flex-1 min-w-0 font-normal text-slate-700 ${textAlign === 'justify' ? 'text-justify [text-justify:inter-word]' : 'text-left'}`}>
                              <strong className="font-bold text-[#0F172A]">{prefix}</strong>{' '}
                              {rest.trim()}
                            </p>
                          </li>
                        );
                      }
                      return (
                        <li key={idx} className="flex items-start gap-2 leading-relaxed">
                          <span className="text-[#0F172A] font-bold text-xs shrink-0 select-none mt-0.5">•</span>
                          <p className={`flex-1 min-w-0 font-normal text-slate-700 ${textAlign === 'justify' ? 'text-justify [text-justify:inter-word]' : 'text-left'}`}>{item}</p>
                        </li>
                      );
                    })}
                </ul>
              </div>
            )}

            {items.skills.toolsGroup && Object.values(items.skills.tools || {}).some(Boolean) && (
              <div>
                <div className="text-[13px] font-bold text-[#0F172A] mb-1">
                  {language === 'en' ? 'Tools & Software Ecosystem :' : 'Tools & Ekosistem Digital :'}
                </div>
                <ul className="space-y-1 text-[13px] text-slate-800">
                  {(cvData.skills.toolCategories || [])
                    .map((cat, idx) => ({ ...cat, idx }))
                    .filter((c) => items.skills.tools?.[c.idx])
                    .sort((a, b) => {
                      const idxA = sectionOrders?.skills_tools?.indexOf(a.idx) ?? -1;
                      const idxB = sectionOrders?.skills_tools?.indexOf(b.idx) ?? -1;
                      return (idxA !== -1 ? idxA : a.idx) - (idxB !== -1 ? idxB : b.idx);
                    })
                    .map((cat) => (
                      <li key={cat.idx} className="flex items-start gap-2 leading-relaxed">
                        <span className="text-[#0F172A] font-bold text-xs shrink-0 select-none mt-0.5">•</span>
                        <p className={`flex-1 min-w-0 font-normal text-slate-700 ${textAlign === 'justify' ? 'text-justify [text-justify:inter-word]' : 'text-left'}`}>
                          <strong className="font-bold text-[#0F172A]">{cat.category} :</strong> {cat.tools}
                        </p>
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </div>
        </section>


    </>
  );
};
