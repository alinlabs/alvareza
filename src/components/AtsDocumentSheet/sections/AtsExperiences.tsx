import React from 'react';
import { AtsSectionProps } from './types';
import { getTailoredExperiences } from '../../../data/tailoredExperiences';

export const AtsExperiences: React.FC<AtsSectionProps> = ({ items, language, renderSectionHeader, sectionOrders, preset, textAlign = 'left' }) => {
  if (!Object.values(items.experiences).some(Boolean)) return null;
  
  const tailoredExperiences = getTailoredExperiences(preset, language);

  return (
    <section className="mb-3.5">
      {renderSectionHeader(language === 'en' ? 'Work Experience' : 'Pengalaman Kerja')}
      <div className="space-y-3">
        {tailoredExperiences
          .filter((exp) => items.experiences[exp.id])
          .sort((a, b) => (sectionOrders.experiences.indexOf(a.id) !== -1 ? sectionOrders.experiences.indexOf(a.id) : 999) - (sectionOrders.experiences.indexOf(b.id) !== -1 ? sectionOrders.experiences.indexOf(b.id) : 999))
          .map((exp) => (
            <div key={exp.id} className="space-y-1 print:break-inside-avoid">
              <div className="flex justify-between items-baseline">
                <h3 className="text-sm font-bold text-[#0F172A] uppercase">
                  {exp.company}
                </h3>
                <span className="text-xs font-bold text-slate-800 shrink-0 ml-2">
                  {exp.location} ({exp.type})
                </span>
              </div>

              <div className="flex justify-between items-baseline">
                <div className="text-[13px] font-bold text-slate-800">
                  {exp.role}
                </div>
                <span className="text-xs font-bold text-slate-700 shrink-0 ml-2">
                  {exp.period}
                </span>
              </div>

              {exp.description && (
                <p className={`text-[13px] text-slate-700 leading-relaxed font-normal pt-0.5 ${textAlign === 'justify' ? 'text-justify' : 'text-left'}`}>
                  {exp.description}
                </p>
              )}

              <ul className="space-y-1 text-[13px] text-slate-800 pt-0.5">
                {exp.highlights.map((hl, idx) => (
                  <li key={idx} className="flex items-start gap-2 leading-relaxed">
                    <span className="text-[#0F172A] font-bold text-xs shrink-0 select-none mt-0.5">•</span>
                    <p className={`flex-1 min-w-0 font-normal text-slate-700 ${textAlign === 'justify' ? 'text-justify [text-justify:inter-word]' : 'text-left'}`}>{hl}</p>
                  </li>
                ))}
              </ul>

              <p className={`text-[11px] text-slate-600 font-medium pt-0.5 ${textAlign === 'justify' ? 'text-justify [text-justify:inter-word]' : 'text-left'}`}>
                <strong className="font-bold text-slate-900">Tools & Platform :</strong> {exp.tools.join(', ')}
              </p>
            </div>
          ))}
      </div>
    </section>
  );
};
