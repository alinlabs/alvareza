import React from 'react';
import { Settings } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface HeaderNavbarProps {
  onOpenPreviewModal: () => void;
  onOpenGasSettings?: () => void;
  onOpenApplyModal?: () => void;
  isAdmin?: boolean;
  onNavigateHome?: () => void;
}

export const HeaderNavbar: React.FC<HeaderNavbarProps> = ({
  onOpenPreviewModal,
  onOpenGasSettings,
  isAdmin = false,
  onNavigateHome,
}) => {
  const { language } = useLanguage();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs py-2.5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Brand Title: Stacked Text with click to home */}
        <button
          type="button"
          onClick={onNavigateHome}
          className="flex flex-col text-left cursor-pointer group"
          title="Kembali ke Halaman Profil Utama"
        >
          <span className="font-extrabold text-slate-900 group-hover:text-[#0062E3] transition-colors text-xl sm:text-2xl tracking-tight leading-none">
            MyCivy
          </span>
          <span className="text-[11px] sm:text-xs font-light text-slate-500 tracking-normal mt-0.5">
            Alvareza H. Pratama
          </span>
        </button>

        {/* Action Controls: Profil | Preview | Setting */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {onNavigateHome && (
            <>
              <button
                type="button"
                onClick={onNavigateHome}
                className="px-2 py-1 text-slate-600 hover:text-slate-900 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
                title="Lihat Profil Eksekutif"
              >
                {language === 'en' ? 'Profile' : 'Profil'}
              </button>
              <span className="text-slate-300 text-xs select-none" aria-hidden="true">
                |
              </span>
            </>
          )}

          {/* Plain Text Button: Preview */}
          <button
            type="button"
            onClick={onOpenPreviewModal}
            className="px-2 py-1 text-slate-600 hover:text-slate-900 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
            title="Lihat Preview PDF"
          >
            Preview
          </button>

          {/* Settings Icon on Far Right (Only in Admin mode: ?admin=true or /tools) */}
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
