import React from 'react';
import { AtsSectionProps } from './types';
import { getTailoredOrganizations } from '../../../data/tailoredOrganizations';

export const AtsOrganizations: React.FC<AtsSectionProps> = ({ items, language, renderSectionHeader, sectionOrders, preset, textAlign = 'left' }) => {
  if (!Object.values(items.organizations).some(Boolean)) return null;

  const tailoredOrganizations = getTailoredOrganizations(preset, language);

  return (
    <section className="mb-3.5">
      {renderSectionHeader(language === 'en' ? 'Organizational Leadership' : 'Pengalaman Organisasi & Kepemimpinan')}
      <div className="space-y-2">
        {tailoredOrganizations
          .map((org, idx) => ({ ...org, idx }))
          .filter((org) => items.organizations[org.idx])
          .sort((a, b) => (sectionOrders.organizations.indexOf(a.idx) !== -1 ? sectionOrders.organizations.indexOf(a.idx) : 999) - (sectionOrders.organizations.indexOf(b.idx) !== -1 ? sectionOrders.organizations.indexOf(b.idx) : 999))
          .map((org, idx) => (
            <div key={idx} className="space-y-0.5">
              <div className="flex justify-between items-baseline">
                <strong className="font-bold text-[#0F172A] text-[13px]">
                  {org.role}
                </strong>
                <span className="text-xs text-slate-800 font-bold shrink-0 ml-2">
                  {org.period}
                </span>
              </div>
              <div className="text-xs font-bold text-slate-700">
                {org.organization}
              </div>
              {org.description && (
                <p className={`text-[13px] text-slate-700 font-normal leading-relaxed ${textAlign === 'justify' ? 'text-justify [text-justify:inter-word]' : 'text-left'}`}>
                  {org.description}
                </p>
              )}
            </div>
          ))}
      </div>
    </section>
  );
};
