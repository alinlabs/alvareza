import React from 'react';
import { AtsSectionProps } from './types';
import { getTailoredDigitalSolutions } from '../../../data/tailoredProjects';

export const AtsDigitalSolutions: React.FC<AtsSectionProps> = ({ items, language, renderSectionHeader, sectionOrders, preset, textAlign = 'left' }) => {
  if (!Object.values(items.digitalSolutions).some(Boolean)) return null;

  const tailoredDigitalSolutions = getTailoredDigitalSolutions(preset, language);

  return (
    <section className="mb-3.5">
      {renderSectionHeader(language === 'en' ? 'Digital Portfolio' : 'Portofolio Digital')}
      <p className={`text-[13px] text-slate-700 leading-relaxed font-normal mb-2 ${textAlign === 'justify' ? 'text-justify' : 'text-left'}`}>
        {language === 'en'
          ? 'All web-based system prototypes are designed as live testing prototypes ready for customization according to corporate workflows and operational scale :'
          : 'Seluruh prototipe sistem berbasis web ini dirancang sebagai kerangka kerja awal (live testing prototype) yang siap dikustomisasi sesuai alur kerja dan skala operasional perusahaan :'}
      </p>

      <ul className="space-y-1.5 text-[13px] text-slate-800">
        {tailoredDigitalSolutions
          .filter((sol) => items.digitalSolutions[sol.id])
          .sort((a, b) => (sectionOrders.digitalSolutions.indexOf(a.id) !== -1 ? sectionOrders.digitalSolutions.indexOf(a.id) : 999) - (sectionOrders.digitalSolutions.indexOf(b.id) !== -1 ? sectionOrders.digitalSolutions.indexOf(b.id) : 999))
          .map((sol) => {
            const displayUrl = sol.demoUrl ? sol.demoUrl.replace(/^https?:\/\//, '') : '';
            return (
              <li key={sol.id} className="leading-relaxed">
                <div>
                  <div className="flex items-baseline justify-between gap-2">
                    <strong className="font-bold text-[#0F172A]">
                      {sol.title}{sol.subtitle ? ` - ${sol.subtitle}` : ''}
                    </strong>
                  </div>
                  <p className={`font-normal text-slate-700 mt-0.5 ${textAlign === 'justify' ? 'text-justify [text-justify:inter-word]' : 'text-left'}`}>
                    {sol.description}
                    {sol.impact && (
                      <span>
                        {' '}
                        <strong className="text-slate-900 font-bold">{language === 'en' ? 'Impact :' : 'Dampak :'}</strong>{' '}
                        <span className="text-slate-700 font-normal">{sol.impact}</span>
                      </span>
                    )}
                  </p>
                  {sol.demoUrl && (
                    <div className="text-xs text-slate-600 font-medium mt-0.5">
                      <strong className="text-slate-800">Link & Demo :</strong>{' '}
                      <a href={sol.demoUrl} target="_blank" rel="noreferrer" className="text-blue-600 underline hover:text-blue-800">
                        {sol.demoUrl}
                      </a>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
      </ul>
    </section>
  );
};
