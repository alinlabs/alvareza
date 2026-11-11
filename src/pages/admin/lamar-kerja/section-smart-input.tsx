import React, { useState } from 'react';
import { X, Info } from 'lucide-react';

interface SmartInputSectionProps {
  activeEditingDraft?: any;
  quickInputText: string;
  setQuickInputText: (text: string) => void;
  handleQuickTextChange: (text: string) => void;
}

export const SmartInputSection = React.memo<SmartInputSectionProps>(({
  activeEditingDraft,
  quickInputText,
  setQuickInputText,
  handleQuickTextChange,
}) => {
  const [showHelp, setShowHelp] = useState(false);

  if (activeEditingDraft) return null;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-900 dark:text-slate-100">
          Smart Text
        </label>
        <button
          type="button"
          onClick={() => setShowHelp((prev) => !prev)}
          className={`p-1 rounded-full transition-colors cursor-pointer ${
            showHelp
              ? 'text-blue-600 dark:text-blue-400 bg-blue-100/70 dark:bg-blue-900/50'
              : 'text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
          title={showHelp ? 'Sembunyikan info format' : 'Petunjuk format Smart Text'}
          aria-label="Petunjuk format Smart Text"
        >
          <Info className="w-4 h-4" />
        </button>
      </div>

      <div className="relative flex items-center">
        <input
          type="text"
          value={quickInputText}
          onChange={(e) => {
            setQuickInputText(e.target.value);
            handleQuickTextChange(e.target.value);
          }}
          className="w-full h-10 pl-3.5 pr-9 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs hover:border-slate-400 dark:hover:border-slate-600 transition-all font-normal"
        />
        {quickInputText && (
          <button
            type="button"
            onClick={() => {
              setQuickInputText('');
              handleQuickTextChange('');
            }}
            className="absolute right-2 p-1 text-slate-400 hover:text-rose-500 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
            title="Bersihkan text"
            aria-label="Bersihkan text"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {showHelp && (
        <div className="mt-2 p-2.5 sm:p-3 rounded-xl bg-slate-50/90 dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 text-[11px] text-center leading-relaxed shadow-2xs animate-in fade-in duration-150 space-y-1">
          <div className="font-bold text-slate-900 dark:text-slate-100">
            Perusahaan, Posisi, Email Utama, Email CC, Subject
          </div>
          <div className="font-normal text-slate-400 dark:text-slate-500">
            Gunakan pemisah <span className="font-bold font-mono text-slate-900 dark:text-slate-100 px-0.5 text-xs">;</span> untuk multi email
          </div>
        </div>
      )}
    </div>
  );
});

