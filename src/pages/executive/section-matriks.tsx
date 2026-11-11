import React from 'react';
import { EXECUTIVE_METRICS } from './constants';

interface ExecutiveMetricsGridProps {
  language: 'in' | 'en' | 'id';
  isDarkMode?: boolean;
}

export const ExecutiveMetricsGrid: React.FC<ExecutiveMetricsGridProps> = ({
  language,
  isDarkMode = false,
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-0.5">
      {EXECUTIVE_METRICS.map((metric) => {
        const label = language === 'en' ? metric.labelEn : (metric.labelIn || metric.labelId);

        return (
          <div
            key={metric.id}
            className={`p-2 sm:p-2.5 rounded-lg border transition-colors shadow-2xs flex flex-col justify-center ${
              isDarkMode
                ? 'bg-slate-900 border-slate-800 hover:border-blue-500/60'
                : 'bg-white border-slate-200/70 hover:border-blue-400/50'
            }`}
          >
            <span
              className={`text-sm sm:text-base md:text-lg font-black leading-tight block ${
                isDarkMode ? 'text-blue-400' : 'text-[#0A3395]'
              }`}
            >
              {metric.value}
            </span>
            <p
              className={`text-[10px] sm:text-[11px] font-normal leading-tight mt-1 ${
                isDarkMode ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              {label}
            </p>
          </div>
        );
      })}
    </div>
  );
};
