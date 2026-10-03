import React from 'react';
import { AtsSectionProps } from './types';
import { PRESET_HEADLINES } from '../../../data/presetHeadlinesSummaries';

export const AtsHeader: React.FC<AtsSectionProps> = ({ cvData, headline, preset, language }) => {
  const activeHeadline =
    headline ||
    (preset && PRESET_HEADLINES[preset]?.[language]) ||
    cvData.personalInfo.headline;

  return (
    <header className="pb-2.5 mb-2 border-b border-slate-200 text-center">
      <h1 className="text-xl sm:text-2xl md:text-[26px] tracking-tight uppercase leading-tight font-extrabold text-[#0F172A] break-words">
        {cvData.personalInfo.fullName}
      </h1>

      <p className="text-xs sm:text-[13px] tracking-tight font-bold text-[#0F172A] break-words">
        {activeHeadline}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs text-slate-600 mt-2.5 font-normal">
        <span>{cvData.personalInfo.phone}</span>
        <span className="text-slate-300">|</span>
        <a href={`mailto:${cvData.personalInfo.email}`} className="text-slate-900 hover:underline">
          {cvData.personalInfo.email}
        </a>
        <span className="text-slate-300">|</span>
        <a href={`https://${cvData.personalInfo.linkedin}`} target="_blank" rel="noreferrer" className="text-slate-900 hover:underline font-bold">
          {cvData.personalInfo.linkedin}
        </a>
        <span className="text-slate-300">|</span>
        <a href={`https://${cvData.personalInfo.website}`} target="_blank" rel="noreferrer" className="text-slate-900 hover:underline font-medium">
          {cvData.personalInfo.website}
        </a>
      </div>
    </header>
  );
};
