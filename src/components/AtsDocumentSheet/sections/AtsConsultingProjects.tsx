import React from 'react';
import { AtsSectionProps } from './types';
import { getTailoredConsulting } from '../../../data/tailoredProjects';

export const AtsConsultingProjects: React.FC<AtsSectionProps> = ({ items, language, renderSectionHeader, sectionOrders, preset, textAlign = 'left' }) => {
  if (!Object.values(items.consultingProjects).some(Boolean)) return null;

  const tailoredConsulting = getTailoredConsulting(preset, language);

  return (
    <section className="mb-3.5">
      {renderSectionHeader(language === 'en' ? 'Independent Project Consulting' : 'Konsultan Proyek Independen')}
      <p className={`text-[13px] text-slate-700 leading-relaxed font-normal mb-2 ${textAlign === 'justify' ? 'text-justify' : 'text-left'}`}>
        {tailoredConsulting.summary}
      </p>

      <div className="space-y-3">
        {(tailoredConsulting.projects || [])
          .filter((proj) => items.consultingProjects[proj.id])
          .sort((a, b) => {
            const idxA = sectionOrders.consultingProjects?.indexOf(a.id) ?? -1;
            const idxB = sectionOrders.consultingProjects?.indexOf(b.id) ?? -1;
            return (idxA !== -1 ? idxA : 999) - (idxB !== -1 ? idxB : 999);
          })
          .map((proj) => (
            <div key={proj.id} className="space-y-0.5">
              <div className="flex justify-between items-baseline">
                <h3 className="text-[12.5px] font-bold text-[#0F172A] uppercase">
                  {proj.organization}
                </h3>
                <span className="text-xs font-bold text-slate-800 shrink-0 ml-2">
                  {proj.sector}
                </span>
              </div>

              <div className="flex justify-between items-baseline">
                <span className="text-xs font-bold text-slate-800">
                  {proj.role}
                </span>
                <span className="text-xs font-bold text-slate-700 shrink-0 ml-2">
                  {proj.periodType}
                </span>
              </div>

              <ul className="space-y-1 text-[13px] text-slate-800 pt-0.5">
                {proj.highlights.map((hl, hlIdx) => (
                  <li key={hlIdx} className="flex items-start gap-2 leading-relaxed">
                    <span className="text-[#0F172A] font-bold text-xs shrink-0 select-none mt-0.5">•</span>
                    <p className={`flex-1 min-w-0 font-normal text-slate-700 ${textAlign === 'justify' ? 'text-justify [text-justify:inter-word]' : 'text-left'}`}>{hl}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
      </div>
    </section>
  );
};
