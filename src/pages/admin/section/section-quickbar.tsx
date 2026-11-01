import React from 'react';
import { QUICKBAR_SECTIONS } from '../constants';
import { ItemSelectionState } from '../../../data/preset/ItemSelections';

export const QuickbarNavigator = ({
  language,
  isSectionActive,
  scrollToSection
}: {
  language: 'in' | 'en' | 'id';
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
            title={language === 'en' ? `Scroll to ${item.labelEn}` : `Lompat ke headline ${item.labelIn}`}
          >
            {/* Card Icon */}
            <div
              className={`w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-xl flex items-center justify-center transition-all duration-200 bg-[#1E6CFF] text-white shadow-xs ${
                active
                  ? 'shadow-blue-500/25 group-hover:scale-105 group-hover:brightness-105 group-active:scale-95'
                  : 'opacity-80 group-hover:opacity-100 group-hover:scale-105'
              }`}
            >
              <IconComponent className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white transition-transform duration-200 group-hover:scale-110" />
            </div>

            {/* Label Under Card */}
            <span
              className={`mt-1 text-[10px] sm:text-[11px] font-medium leading-tight text-center line-clamp-1 transition-colors duration-150 ${
                active ? 'text-slate-800 font-bold' : 'text-slate-500 group-hover:text-slate-700'
              }`}
            >
              {language === 'en' ? item.labelEn : item.labelIn}
            </span>
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-2 py-1 print:hidden">
      {renderRow(row1)}
      {renderRow(row2)}
    </div>
  );
};

export const SectionQuickbar = QuickbarNavigator;
