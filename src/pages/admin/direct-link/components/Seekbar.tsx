import React from 'react';
import { SeekbarProps } from '../types';

/**
 * Reusable Interactive Seekbar Component with Sliding Pill Thumb & Clean Plain-Text Tabs
 */
export const Seekbar: React.FC<SeekbarProps> = ({
  label,
  leftLabel,
  rightLabel,
  value,
  onChange,
}) => {
  return (
    <div className="space-y-1 select-none">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 block">
          {label}
        </label>
      </div>

      {/* Seekbar Track with animated thumb */}
      <div className="relative h-9 bg-slate-100 dark:bg-slate-800 rounded-xl p-0.5 border border-slate-200/90 dark:border-slate-700 shadow-2xs flex items-center">
        {/* Animated Sliding Pill / Knob */}
        <div
          className={`absolute top-0.5 bottom-0.5 w-[calc(50%-2px)] rounded-lg bg-white dark:bg-slate-900 shadow-xs border border-slate-200/80 dark:border-slate-700 transition-all duration-200 ease-out pointer-events-none ${
            value ? 'left-[calc(50%+1px)]' : 'left-0.5'
          }`}
        />

        {/* Left Option Button */}
        <button
          type="button"
          onClick={() => onChange(false)}
          className={`relative z-1 flex-1 h-full rounded-lg flex items-center justify-center px-2 text-xs font-semibold transition-colors cursor-pointer ${
            !value
              ? 'text-slate-900 dark:text-slate-100 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          }`}
          title={leftLabel}
        >
          <span className="truncate">{leftLabel}</span>
        </button>

        {/* Right Option Button */}
        <button
          type="button"
          onClick={() => onChange(true)}
          className={`relative z-1 flex-1 h-full rounded-lg flex items-center justify-center px-2 text-xs font-semibold transition-colors cursor-pointer ${
            value
              ? 'text-blue-700 dark:text-blue-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
          }`}
          title={rightLabel}
        >
          <span className="truncate">{rightLabel}</span>
        </button>

        {/* Hidden range slider for smooth touch/drag & accessibility */}
        <input
          type="range"
          min="0"
          max="1"
          step="1"
          value={value ? 1 : 0}
          onChange={(e) => onChange(e.target.value === '1')}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-2"
          aria-label={label}
        />
      </div>
    </div>
  );
};

export default Seekbar;
