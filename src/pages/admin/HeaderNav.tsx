import React, { useState, useEffect } from 'react';
import { Home, Network, Printer, Settings, Sun, Moon, Share2 } from 'lucide-react';
import { useThemeMode } from '../../hooks/useThemeMode';

interface HeaderNavbarProps {
  onOpenPreviewModal?: () => void;
  onOpenGasSettings?: () => void;
  onOpenMindmapModal?: () => void;
  onOpenApplyModal?: () => void;
  isAdmin?: boolean;
  onNavigateHome?: () => void;
}

export const HeaderNavbar: React.FC<HeaderNavbarProps> = ({
  onNavigateHome,
  onOpenMindmapModal,
  onOpenPreviewModal,
  onOpenGasSettings,
}) => {
  const { isDarkMode, toggleTheme } = useThemeMode();

  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 2400);
  };

  const handleInstallPWA = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          setDeferredPrompt(null);
          showToast('Aplikasi berhasil dipasang!');
        }
      } catch {
        // user dismiss
      }
    } else {
      showToast('Pilih "Tambahkan ke Layar Utama" / "Instal Aplikasi" di browser.');
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Digital Profile - Alvareza H. Pratama',
      text: 'Identitas & Portofolio Digital - Alvareza H. Pratama',
      url: window.location.href,
    };

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err: any) {
        if (err?.name === 'AbortError') return;
      }
    }

    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        showToast('Tautan berhasil disalin ke clipboard!');
      }
    } catch {
      showToast('Tautan halaman siap dibagikan.');
    }
  };

  // Reusable 2-line small Install App Button
  const renderInstallButton = () => (
    <button
      type="button"
      onClick={handleInstallPWA}
      title="Instal Aplikasi Digital Profile"
      aria-label="Instal Aplikasi"
      className="h-8 sm:h-9 px-2 sm:px-2.5 rounded-lg sm:rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-blue-50/80 dark:hover:bg-slate-700/80 border border-slate-200/90 dark:border-slate-700 text-[#0062E3] dark:text-blue-400 font-bold text-[9px] sm:text-[10px] tracking-wider uppercase flex flex-col items-center justify-center leading-[1.05] shadow-2xs active:scale-95 cursor-pointer transition-all duration-200 shrink-0 select-none"
    >
      <span className="leading-tight">INSTAL</span>
      <span className="leading-tight mt-0.5">APP</span>
    </button>
  );

  // Theme Toggle Button (Positioned directly to the left of Share button)
  const renderThemeButton = () => (
    <button
      type="button"
      onClick={toggleTheme}
      className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200/90 dark:border-slate-700 text-slate-700 dark:text-slate-200 transition-all duration-200 flex items-center justify-center shadow-2xs active:scale-95 cursor-pointer shrink-0"
      title={isDarkMode ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
      aria-label="Toggle theme"
    >
      {isDarkMode ? (
        <Sun className="w-4 h-4 text-white" />
      ) : (
        <Moon className="w-4 h-4 text-slate-600" />
      )}
    </button>
  );

  // Reusable Share Button
  const renderShareButton = () => (
    <button
      type="button"
      onClick={handleShare}
      title="Bagikan Tautan Halaman"
      aria-label="Bagikan Tautan"
      className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-blue-50/80 dark:hover:bg-slate-700 border border-slate-200/90 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:text-[#0062E3] dark:hover:text-blue-400 transition-all duration-200 flex items-center justify-center shadow-2xs active:scale-95 cursor-pointer shrink-0"
    >
      <Share2 className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
    </button>
  );

  // Desktop Action Buttons
  const renderHomeButton = () => (
    <button
      type="button"
      onClick={onNavigateHome}
      title="Halaman Utama"
      aria-label="Halaman Utama"
      className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-blue-50/80 dark:hover:bg-slate-700 border border-slate-200/90 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:text-[#0062E3] dark:hover:text-blue-400 transition-all duration-200 flex items-center justify-center shadow-2xs active:scale-95 cursor-pointer shrink-0"
    >
      <Home className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
    </button>
  );

  const renderMindmapButton = () => (
    <button
      type="button"
      onClick={onOpenMindmapModal}
      title="Peta Links & Direct Link"
      aria-label="Peta Links & Direct Link"
      className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-blue-50/80 dark:hover:bg-slate-700 border border-slate-200/90 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:text-[#0062E3] dark:hover:text-blue-400 transition-all duration-200 flex items-center justify-center shadow-2xs active:scale-95 cursor-pointer shrink-0"
    >
      <Network className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
    </button>
  );

  const renderPrintButton = () => (
    <button
      type="button"
      onClick={onOpenPreviewModal}
      title="Cetak & Pratinjau Dokumen"
      aria-label="Cetak & Pratinjau Dokumen"
      className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-blue-50/80 dark:hover:bg-slate-700 border border-slate-200/90 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:text-[#0062E3] dark:hover:text-blue-400 transition-all duration-200 flex items-center justify-center shadow-2xs active:scale-95 cursor-pointer shrink-0"
    >
      <Printer className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
    </button>
  );

  const renderGearButton = () => (
    <button
      type="button"
      onClick={onOpenGasSettings}
      title="Pengaturan Integrasi & Akun"
      aria-label="Pengaturan Integrasi & Akun"
      className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-blue-50/80 dark:hover:bg-slate-700 border border-slate-200/90 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:text-[#0062E3] dark:hover:text-blue-400 transition-all duration-200 flex items-center justify-center shadow-2xs active:scale-95 cursor-pointer shrink-0"
    >
      <Settings className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
    </button>
  );

  return (
    <header className="sticky top-0 z-50 shrink-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/90 dark:border-slate-800 shadow-2xs py-2.5 transition-colors w-full">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-3">
        {/* Left Section: Name & Subtitle */}
        <button
          type="button"
          onClick={onNavigateHome}
          className="flex flex-col text-left cursor-pointer group shrink-0"
          title="Kembali ke Halaman Utama"
        >
          <span className="font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-[#0062E3] transition-colors text-sm sm:text-base tracking-tight leading-tight">
            Alvareza H. Pratama
          </span>
          <span className="text-[10px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 tracking-normal leading-tight mt-0.5">
            Identitas - Digital Profile
          </span>
        </button>

        {/* Right Section: Mobile (Install App | Theme Icon | Share Icon) */}
        <div className="flex md:hidden items-center gap-1.5 shrink-0">
          {renderInstallButton()}
          {renderThemeButton()}
          {renderShareButton()}
        </div>

        {/* Right Section: Desktop (Install App | Home | Mindmap | Print | Theme Icon | Gear | Share Icon) */}
        <div className="hidden md:flex items-center gap-1.5 sm:gap-2 shrink-0">
          {renderInstallButton()}
          {renderHomeButton()}
          {renderMindmapButton()}
          {renderPrintButton()}
          {renderThemeButton()}
          {renderGearButton()}
          {renderShareButton()}
        </div>
      </div>

      {/* Floating subtle toast feedback */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-slate-900/90 dark:bg-slate-100/90 text-white dark:text-slate-900 text-xs font-medium rounded-full shadow-lg backdrop-blur-sm transition-all pointer-events-none">
          {toastMessage}
        </div>
      )}
    </header>
  );
};

export const HeaderNav = HeaderNavbar;
export type HeaderNavProps = HeaderNavbarProps;
export default HeaderNav;
