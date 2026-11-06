import React from 'react';
import { Sliders, Globe } from 'lucide-react';

interface ExecutiveFloatingControlsProps {
  language: 'in' | 'en' | 'id';
  toggleLanguage: () => void;
  isAdmin?: boolean;
  onOpenBuilder?: () => void;
}

export const ExecutiveFloatingControls: React.FC<ExecutiveFloatingControlsProps> = ({
  language,
  toggleLanguage,
  isAdmin = false,
  onOpenBuilder,
}) => {
  return (
    <div className="absolute top-4 right-4 sm:top-6 sm:right-8 z-30 flex items-center gap-2">
      {/* Language Switcher */}
      <button
        type="button"
        onClick={toggleLanguage}
        className="px-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white/90 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer text-slate-700 shadow-sm backdrop-blur-xs"
        title={language === 'en' ? 'Ganti ke Bahasa Indonesia' : 'Switch to English'}
      >
        <Globe className="w-3.5 h-3.5 text-slate-500" />
        <span>{language === 'en' ? 'IN' : 'EN'}</span>
      </button>

      {/* Admin Mode: Builder Switch */}
      {isAdmin && onOpenBuilder && (
        <button
          type="button"
          onClick={onOpenBuilder}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors shadow-sm cursor-pointer"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Builder CV</span>
        </button>
      )}
    </div>
  );
};
