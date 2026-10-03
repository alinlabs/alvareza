import React from 'react';
import { Settings } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface HeaderNavbarProps {
  onOpenPreviewModal: () => void;
  onOpenGasSettings?: () => void;
  onOpenApplyModal?: () => void;
  isAdmin?: boolean;
}

export const HeaderNavbar: React.FC<HeaderNavbarProps> = ({
  onOpenPreviewModal,
  onOpenGasSettings,
  isAdmin = false,
}) => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs py-2.5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Brand Title: Stacked Text */}
        <div className="flex flex-col">
          <span className="font-extrabold text-slate-900 text-xl sm:text-2xl tracking-tight leading-none">
            MyCivy
          </span>
          <span className="text-[11px] sm:text-xs font-light text-slate-500 tracking-normal mt-0.5">
            Alvareza H. Pratama
          </span>
        </div>

        {/* Action Controls: Preview | Flag | Setting */}
        <div className="flex items-center gap-2.5">
          {/* Plain Text Button: Preview */}
          <button
            type="button"
            onClick={onOpenPreviewModal}
            className="px-2 py-1 text-slate-800 hover:text-[#0062E3] text-xs sm:text-sm font-bold transition-colors cursor-pointer"
            title="Lihat Preview PDF"
          >
            Preview
          </button>

          {/* Language Switcher Flag */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="p-1.5 sm:p-2 bg-slate-50 hover:bg-slate-100 active:bg-slate-200 rounded-lg border border-slate-200 hover:border-slate-300 transition-all flex items-center justify-center cursor-pointer shadow-2xs group"
            title={language === 'id' ? 'Bahasa Indonesia (Klik untuk ganti ke English)' : 'English (Click to switch to Bahasa Indonesia)'}
            aria-label="Switch language"
          >
            <img
              src={language === 'id' ? 'https://flagcdn.com/id.svg' : 'https://flagcdn.com/gb.svg'}
              alt={language === 'id' ? 'Bendera Indonesia' : 'UK Flag'}
              className="w-5 h-3.5 sm:w-6 sm:h-4 object-cover rounded-xs shadow-2xs border border-black/10 group-hover:scale-105 transition-transform"
              referrerPolicy="no-referrer"
              loading="eager"
            />
          </button>

          {/* Settings Icon on Far Right (Only in Admin mode: ?admin=true) */}
          {isAdmin && onOpenGasSettings && (
            <button
              type="button"
              onClick={onOpenGasSettings}
              className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-slate-100 active:bg-slate-200 rounded-lg transition-all cursor-pointer flex items-center justify-center"
              title="Pengaturan Akun Pengirim Email (GAS)"
              aria-label="Pengaturan Email GAS"
            >
              <Settings className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-slate-700 hover:text-blue-600" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

