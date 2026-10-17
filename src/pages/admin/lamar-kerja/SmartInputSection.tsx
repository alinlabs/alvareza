import React from 'react';
import { X } from 'lucide-react';

interface SmartInputSectionProps {
  isScanning?: boolean;
  activeEditingDraft?: any;
  quickInputText: string;
  setQuickInputText: (text: string) => void;
  handleQuickTextChange: (text: string) => void;
  triggerFileInput?: () => void;
  handleDrop?: (e: React.DragEvent) => void;
  isDropOver?: boolean;
  setIsDropOver?: (over: boolean) => void;
  isImageExpanded?: boolean;
  setIsImageExpanded?: (expanded: boolean) => void;
  imagePreviewUrl?: string | null;
  ocrResultText?: string;
  handleOcrTextChange?: (text: string) => void;
  handleRemoveFile?: () => void;
  handleCopy?: (text: string, type: 'subject' | 'body' | 'all' | 'email' | 'cc' | 'phone') => void;
  copiedAll?: boolean;
}

export const SmartInputSection: React.FC<SmartInputSectionProps> = ({
  activeEditingDraft,
  quickInputText,
  setQuickInputText,
  handleQuickTextChange,
}) => {
  if (activeEditingDraft) return null;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-900">
          Tulis Cepat
        </label>
        {quickInputText && (
          <button
            type="button"
            onClick={() => {
              setQuickInputText('');
              handleQuickTextChange('');
            }}
            className="text-[11px] font-semibold text-rose-500 hover:text-rose-700 flex items-center gap-0.5 cursor-pointer"
          >
            <X className="w-3 h-3" />
            <span>Bersihkan</span>
          </button>
        )}
      </div>

      <input
        type="text"
        value={quickInputText}
        onChange={(e) => {
          setQuickInputText(e.target.value);
          handleQuickTextChange(e.target.value);
        }}
        className="w-full h-10 px-3.5 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs hover:border-slate-400 transition-all font-normal"
      />
    </div>
  );
};
