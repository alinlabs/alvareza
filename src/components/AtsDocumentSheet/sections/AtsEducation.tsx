import React from 'react';
import { AtsSectionProps } from './types';

export const AtsEducation: React.FC<AtsSectionProps> = ({ items, language, renderSectionHeader, cvData, sectionOrders, textAlign = 'left' }) => {
  if (!Object.values(items.education).some(Boolean)) return null;

  return (
    <section className="mb-3.5">
      {renderSectionHeader(language === 'en' ? 'Education' : 'Pendidikan')}
      <div className="space-y-3.5">
        {cvData.education
          .map((edu, idx) => ({ ...edu, idx }))
          .filter((edu) => items.education[edu.idx])
          .sort((a, b) => (sectionOrders.education.indexOf(a.idx) !== -1 ? sectionOrders.education.indexOf(a.idx) : 999) - (sectionOrders.education.indexOf(b.idx) !== -1 ? sectionOrders.education.indexOf(b.idx) : 999))
          .map((edu, idx) => (
            <div key={idx} className="space-y-0.5">
              <div className="flex justify-between items-baseline">
                <strong className="font-bold text-[#0F172A] uppercase text-sm">
                  {edu.institution}
                </strong>
                <span className="text-xs text-slate-800 font-bold shrink-0 ml-2">
                  {edu.period}
                </span>
              </div>
              <div className="text-[13px] font-bold text-slate-800">
                {edu.degree}
              </div>
              {edu.detail && (
                <p className={`text-xs text-slate-600 font-normal leading-relaxed ${textAlign === 'justify' ? 'text-justify' : 'text-left'}`}>
                  {edu.detail}
                </p>
              )}
            </div>
          ))}
      </div>
    </section>
  );
};
