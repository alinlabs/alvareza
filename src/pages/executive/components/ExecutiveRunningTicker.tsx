import React from 'react';

export interface ExecutiveRunningTickerProps {
  language?: 'in' | 'en' | 'id';
  isDarkMode?: boolean;
  variant?: 'top' | 'bottom';
  className?: string;
  isMobileBackground?: boolean;
}

const COMPANY_NAMES: string[] = [
  'PT GALAKSI MITRA GEMILANG',
  'PT PERDANA JATIPUTRA',
  'PT SHANSUSDZAR INDONESIA',
  'KONICA MINOLTA INDONESIA',
  'JAYA BARU RETAIL GROUP',
  'MULTI SEJAHTERA RETAIL',
  'WORLD STREET TRENDY FASHION',
  'LINGUA FIRST ACADEMY',
  'MELIN PARFUM',
  'LOGISTOR SYSTEM',
  'MITRA GATEWAY',
  'TALENTY',
  'ALVAREZ STUDIO',
  'MARKPLUS INSTITUTE',
];

export const ExecutiveRunningTicker: React.FC<ExecutiveRunningTickerProps> = ({
  className = '',
  isMobileBackground = false,
}) => {
  const renderItemsGroup = (keyPrefix: string) => (
    <div key={keyPrefix} className="flex items-center shrink-0 gap-6 sm:gap-8 px-4">
      {COMPANY_NAMES.map((companyName, idx) => (
        <div key={`${keyPrefix}-${idx}`} className="flex items-center shrink-0">
          <span
            className={
              isMobileBackground
                ? 'text-lg sm:text-xl md:text-2xl font-black tracking-widest uppercase text-slate-700/90 dark:text-slate-200/90 whitespace-nowrap mr-12 sm:mr-16'
                : 'text-xs sm:text-[13px] font-bold tracking-wider uppercase text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors cursor-default whitespace-nowrap'
            }
          >
            {companyName}
          </span>
          {!isMobileBackground && (
            <span
              className="text-slate-300 dark:text-slate-700 text-xs select-none ml-6 sm:ml-8"
              aria-hidden="true"
            >
              •
            </span>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div
      className={`w-full bg-transparent border-none py-2 sm:py-2.5 overflow-hidden select-none relative group [mask-image:linear-gradient(to_right,transparent,black_24px,black_calc(100%-24px),transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_24px,black_calc(100%-24px),transparent)] ${className}`}
      title="Perusahaan & Klien"
    >
      {/* Infinite Seamless Running Marquee */}
      <div className="animate-ticker flex items-center">
        {renderItemsGroup('list-a')}
        {renderItemsGroup('list-b')}
      </div>
    </div>
  );
};
