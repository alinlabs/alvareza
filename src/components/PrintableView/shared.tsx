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
      <span className="font-bold text-sm text-slate-900 select-none truncate">
        {title}
      </span>
      <div className="flex items-center gap-2.5 shrink-0">
        {extraAction}

        {/* Seekbar Toggle: Blue when ON, Gray when OFF, No ON/OFF text */}
        <div
          onClick={() => onToggleActive(!isActive)}
          className={`relative inline-flex items-center w-11 h-6 rounded-full p-0.5 cursor-pointer transition-colors duration-200 ease-in-out ${
            isActive ? 'bg-[#0062E3]' : 'bg-slate-300'
          }`}
          title={isActive ? 'Status Aktif (Klik/Geser untuk nonaktifkan)' : 'Status Nonaktif (Klik/Geser untuk aktifkan)'}
        >
          <input
            type="range"
            min={0}
            max={1}
            step={1}
            value={isActive ? 1 : 0}
            onChange={(e) => onToggleActive(e.target.value === '1')}
            onClick={(e) => e.stopPropagation()}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            aria-label={`Toggle ${title}`}
          />
          <div
            className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform duration-200 ease-in-out pointer-events-none ${
              isActive ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </div>

        <button
          type="button"
          onClick={onToggleAccordion}
          className="p-1 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
          title="Buka/Tutup Item"
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};
