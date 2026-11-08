import React from 'react';
import { AtsSectionProps } from './types';
import { PRESET_SUMMARIES } from '../../../data/preset/HeadlinesSummaries';
import { resolvePresetFromQuery } from '../../../data/preset/RoleConfig';

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

  const canonicalPreset = (preset && resolvePresetFromQuery(preset)) || preset;
  const activeSummary =
    summaryText ||
    (canonicalPreset && PRESET_SUMMARIES[canonicalPreset]?.[language]) ||
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

export const Summary = AtsSummary;
