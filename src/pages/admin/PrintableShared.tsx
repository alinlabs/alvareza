import React, { ReactNode } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

export const CheckSquare = ({ className }: { className?: string }) => {
  const isShrink = className?.includes('shrink-0');
  return (
    <div className={`w-[16px] h-[16px] rounded-full border-[1.5px] flex items-center justify-center transition-all duration-200 bg-[#0062E3] border-[#0062E3] ${isShrink ? 'shrink-0' : ''}`}>
      <svg className="w-2.5 h-2.5 text-white scale-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </div>
  );
};

export const Square = ({ className }: { className?: string }) => {
  const isShrink = className?.includes('shrink-0');
  return (
    <div className={`w-[16px] h-[16px] rounded-full border-[1.5px] border-slate-300 transition-all duration-200 bg-transparent ${isShrink ? 'shrink-0' : ''}`}></div>
  );
};

export interface SectionHeadlineBarProps {
  title: string;
  isActive: boolean;
  isExpanded: boolean;
  onToggleAccordion: () => void;
  onToggleActive: (active: boolean) => void;
  extraAction?: ReactNode;
}

export const SectionHeadlineBar: React.FC<SectionHeadlineBarProps> = ({
  title,
  isActive,
  isExpanded,
  onToggleAccordion,
  onToggleActive,
  extraAction,
}) => {
  return (
    <div className="flex items-center justify-between py-1 gap-2">
      {/* Title */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-slate-900 tracking-tight">{title}</span>
      </div>

      {/* Right Controls: Action + Seekbar Toggle + Accordion Chevron */}
      <div className="flex items-center gap-2">
        {extraAction}

        {/* Minimalist Switch Toggle */}
        <label className="relative inline-flex items-center cursor-pointer select-none">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={isActive}
            onChange={(e) => onToggleActive(e.target.checked)}
          />
          <div className="w-8 h-4.5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-3.5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-[#0062E3]"></div>
        </label>

        {/* Dropdown Chevron */}
        <button
          type="button"
          onClick={onToggleAccordion}
          className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label={isExpanded ? 'Tutup daftar seksi' : 'Buka daftar seksi'}
        >
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
};
