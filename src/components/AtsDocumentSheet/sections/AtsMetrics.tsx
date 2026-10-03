import React from 'react';
import { AtsSectionProps } from './types';
import { getTailoredMetrics } from '../../../data/tailoredMetrics';

export const AtsMetrics: React.FC<AtsSectionProps> = ({ items, language, renderSectionHeader, sectionOrders, preset, textAlign = 'left' }) => {
  if (!Object.values(items.metrics).some(Boolean)) return null;
  
  const tailoredMetrics = getTailoredMetrics(preset, language, items.certifications);

  return (
    <section className="mb-3.5">
      {renderSectionHeader(language === 'en' ? 'Key Metrics & Highlights' : 'Sorotan Kinerja & Metrik Kunci')}
      <ul className="space-y-1.5 text-[13px] text-slate-800">
        {tailoredMetrics
          .map((m, idx) => ({
            idx,
            text: `${m.value} ${m.label} : ${m.sublabel}`,
          }))
          .filter((m) => items.metrics[m.idx])
          .sort((a, b) => (sectionOrders.metrics.indexOf(a.idx) !== -1 ? sectionOrders.metrics.indexOf(a.idx) : 999) - (sectionOrders.metrics.indexOf(b.idx) !== -1 ? sectionOrders.metrics.indexOf(b.idx) : 999))
          .map((m) => {
            const colonIdx = m.text.indexOf(':');
            const prefix = colonIdx !== -1 ? m.text.substring(0, colonIdx + 1) : m.text;
            const rest = colonIdx !== -1 ? m.text.substring(colonIdx + 1).trim() : '';
            return (
              <li key={m.idx} className="flex items-start gap-2 leading-relaxed">
                <span className="text-[#0F172A] font-bold text-xs shrink-0 select-none mt-0.5">•</span>
                <p className={`flex-1 min-w-0 ${textAlign === 'justify' ? 'text-justify [text-justify:inter-word]' : 'text-left'}`}>
                  <strong className="font-bold text-[#0F172A]">{prefix}</strong>{' '}
                  <span className="font-normal text-slate-700">{rest}</span>
                </p>
              </li>
            );
          })}
      </ul>
    </section>
  );
};
