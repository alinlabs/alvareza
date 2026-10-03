import React from 'react';
import { AtsSectionProps } from './types';

export const AtsCertifications: React.FC<AtsSectionProps> = ({ items, language, renderSectionHeader, cvData, sectionOrders, textAlign = 'left' }) => {
  if (!Object.values(items.certifications).some(Boolean) || !cvData.certifications) return null;

  return (
    <section className="mb-3.5 print:break-inside-avoid">
      {renderSectionHeader(language === 'en' ? 'Certifications' : 'Sertifikasi')}
      <div className="space-y-2.5">
        {cvData.certifications
          .filter((cert) => items.certifications[cert.id])
          .sort((a, b) => (sectionOrders.certifications.indexOf(a.id) !== -1 ? sectionOrders.certifications.indexOf(a.id) : 999) - (sectionOrders.certifications.indexOf(b.id) !== -1 ? sectionOrders.certifications.indexOf(b.id) : 999))
          .map((cert) => {
            const rightTop = cert.grade || cert.period;
            const rightBottom = cert.credentialSub || (cert.grade && cert.period ? cert.period : '');
            return (
              <div key={cert.id} className="space-y-0.5 print:break-inside-avoid">
                <div className="flex justify-between items-baseline gap-2">
                  <strong className="font-bold text-[#0F172A] text-[13px]">
                    {cert.title}
                  </strong>
                  {rightTop && (
                    <span className="text-xs text-slate-800 font-bold shrink-0 ml-2">
                      {rightTop}
                    </span>
                  )}
                </div>
                <div className="flex justify-between items-baseline gap-2">
                  <div className="text-xs font-bold text-slate-700">
                    {cert.issuer}
                  </div>
                  {rightBottom && (
                    <span className="text-xs text-slate-700 font-semibold shrink-0 ml-2">
                      {rightBottom}
                    </span>
                  )}
                </div>
                {cert.description && (
                  <p className={`text-[13px] text-slate-700 font-normal leading-relaxed pt-0.5 ${textAlign === 'justify' ? 'text-justify' : 'text-left'}`}>
                    {cert.description}
                  </p>
                )}
              </div>
            );
          })}
      </div>
    </section>
  );
};
