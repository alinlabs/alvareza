import React from 'react';
import { AtsSectionProps } from './types';
import { PRESET_SUMMARIES } from '../../../data/presetHeadlinesSummaries';

export const AtsSummary: React.FC<AtsSectionProps> = ({
  items,
  language,
  renderSectionHeader,
  summaryText,
  cvData,
  preset,
  textAlign = 'left',
}) => {
  if (!items.summary) return null;

  const activeSummary =
    summaryText ||
    (preset && PRESET_SUMMARIES[preset]?.[language]) ||
    cvData.personalInfo.summary;

  return (
    <section className="mb-3.5">
      {renderSectionHeader(language === 'en' ? 'Professional Summary' : 'Ringkasan')}
      <p className={`text-[13px] text-slate-700 leading-relaxed font-normal ${textAlign === 'justify' ? 'text-justify [text-justify:inter-word]' : 'text-left'}`}>
        {activeSummary}
      </p>
    </section>
  );
};
