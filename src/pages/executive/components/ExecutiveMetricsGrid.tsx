import React from 'react';
import { EXECUTIVE_METRICS } from '../constants';

interface ExecutiveMetricsGridProps {
  language: 'in' | 'en' | 'id';
}

export const ExecutiveMetricsGrid: React.FC<ExecutiveMetricsGridProps> = ({ language }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-0.5">
      {EXECUTIVE_METRICS.map((metric) => {
        const label = language === 'en' ? metric.labelEn : (metric.labelIn || metric.labelId);

        return (
          <div
            key={metric.id}
            className="p-2 sm:p-2.5 rounded-lg bg-white border border-slate-200/70 hover:border-blue-400/50 transition-colors shadow-2xs flex flex-col justify-center"
          >
            <span className="text-sm sm:text-base md:text-lg font-black text-[#0A3395] leading-tight block">
              {metric.value}
            </span>
            <p className="text-[10px] sm:text-[11px] font-normal text-slate-600 leading-tight mt-1">
              {label}
            </p>
          </div>
        );
      })}
    </div>
  );
};
