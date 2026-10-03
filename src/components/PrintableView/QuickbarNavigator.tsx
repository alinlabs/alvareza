import React from 'react';
import { QUICKBAR_SECTIONS } from './constants';
import { ItemSelectionState } from '../../data/presetItemSelections';

export const QuickbarNavigator = ({
  language,
  isSectionActive,
  scrollToSection
}: {
  language: 'id' | 'en';
  isSectionActive: (secKey: keyof ItemSelectionState) => boolean;
  scrollToSection: (id: string) => void;
}) => {
  const row1 = QUICKBAR_SECTIONS.slice(0, 5);
  const row2 = QUICKBAR_SECTIONS.slice(5, 10);

  const renderRow = (items: typeof QUICKBAR_SECTIONS) => (
    <div className="flex items-start justify-between w-full">
      {items.map((item) => {
        const IconComponent = item.icon;
        const active = isSectionActive(item.key as keyof ItemSelectionState);
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => scrollToSection(item.key)}
            className="flex flex-col items-center group cursor-pointer select-none focus:outline-none w-12 sm:w-14 md:w-16 lg:w-[72px]"
            title={language === 'en' ? `Scroll to ${item.labelEn}` : `Lompat ke headline ${item.labelId}`}
          >
            {/* Card Icon */}
            <div className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-[72px] lg:h-[72px] rounded-xl md:rounded-2xl border flex items-center justify-center transition-all duration-200 shadow-2xs group-hover:scale-105 shrink-0 ${
              active 
                ? 'bg-[#0062E3] border-[#0062E3] text-white hover:bg-[#0050B8] hover:border-[#0050B8] shadow-xs' 
                : 'bg-slate-50 border-slate-200 text-slate-400 group-hover:border-slate-400 group-hover:text-slate-700 group-hover:bg-slate-100'
            }`}>
              <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 transition-transform group-hover:scale-110" />
            </div>
            {/* Teks di bawah dari card icon nya */}
            <span className={`text-[10px] sm:text-xs md:text-xs font-semibold text-center mt-1.5 sm:mt-2 line-clamp-1 transition-colors w-max max-w-[80px] sm:max-w-[96px] md:max-w-[112px] ${
              active ? 'text-slate-900 group-hover:text-[#0062E3]' : 'text-slate-400 group-hover:text-slate-700'
            }`}>
              {language === 'en' ? item.labelEn : item.labelId}
            </span>
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="flex flex-col gap-4 sm:gap-5 md:gap-6 print:hidden py-1 w-full">
      {renderRow(row1)}
      {renderRow(row2)}
    </div>
  );
};

