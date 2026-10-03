import React from 'react';
import { AtsSectionProps } from './types';

export const AtsAchievements: React.FC<AtsSectionProps> = ({ items, language, renderSectionHeader, cvData, sectionOrders, preset, textAlign = 'left' }) => {
  if (!Object.values(items.achievements).some(Boolean)) return null;

  const countEn = preset === 'all'
    ? cvData.achievements.filter((a) => items.achievements[a.id]).length
    : cvData.achievements.filter((a) => items.achievements[a.id]).slice(0, 5).length;
    
  const countId = preset === 'all'
    ? cvData.achievements.filter((a) => items.achievements[a.id]).length
    : cvData.achievements.filter((a) => items.achievements[a.id]).slice(0, 5).length;

  return (
    <section className="mb-3.5 print:break-inside-avoid">
      {renderSectionHeader(
        language === 'en'
          ? `Honors, Awards & Achievements (${countEn} Items)`
          : `Prestasi, Penghargaan & Pencapaian (${countId} Kegiatan)`
      )}
      <div className="space-y-2">
        {(preset === 'all'
          ? cvData.achievements
              .filter((ach) => items.achievements[ach.id])
              .sort((a, b) => (sectionOrders.achievements.indexOf(a.id) !== -1 ? sectionOrders.achievements.indexOf(a.id) : 999) - (sectionOrders.achievements.indexOf(b.id) !== -1 ? sectionOrders.achievements.indexOf(b.id) : 999))
          : cvData.achievements
              .filter((ach) => items.achievements[ach.id])
              .sort((a, b) => (sectionOrders.achievements.indexOf(a.id) !== -1 ? sectionOrders.achievements.indexOf(a.id) : 999) - (sectionOrders.achievements.indexOf(b.id) !== -1 ? sectionOrders.achievements.indexOf(b.id) : 999))
              .slice(0, 5)
        ).map((ach) => (
            <div key={ach.id} className="space-y-0.5 print:break-inside-avoid">
              <div className="flex justify-between items-baseline gap-2">
                <strong className="font-bold text-[#0F172A] text-[13px]">
                  {ach.title}
                </strong>
                <span className="text-xs text-slate-800 font-bold shrink-0 ml-2">
                  {language === 'en' ? `${ach.level} Level` : `Tingkat ${ach.level}`}
                </span>
              </div>
              <div className="flex justify-between items-baseline gap-2">
                <div className="text-xs font-bold text-slate-700">
                  {ach.organization}
                </div>
                <span className="text-xs text-slate-700 font-bold shrink-0 ml-2">
                  {ach.year}
                </span>
              </div>
              {ach.description && (
                <p className={`text-[13px] text-slate-700 font-normal leading-relaxed ${textAlign === 'justify' ? 'text-justify [text-justify:inter-word]' : 'text-left'}`}>
                  {ach.description}
                </p>
              )}
            </div>
          ))}
      </div>
    </section>
  );
};
