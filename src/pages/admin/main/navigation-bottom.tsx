import React from 'react';
import { Home, Network, Send, Printer, Settings } from 'lucide-react';

export interface AdminBottomNavProps {
  onNavigateHome?: () => void;
  onOpenMindmapModal?: () => void;
  onOpenApplyModal?: () => void;
  onOpenPreviewModal?: () => void;
  onOpenGasSettings?: () => void;
}

export const AdminBottomNav: React.FC<AdminBottomNavProps> = ({
  onNavigateHome,
  onOpenMindmapModal,
  onOpenApplyModal,
  onOpenPreviewModal,
  onOpenGasSettings,
}) => {
  return (
    <nav
      id="admin-bottom-nav"
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/90 dark:border-slate-800 shadow-[0_-4px_20px_rgba(15,23,42,0.08)] px-2 pt-1 pb-2 flex items-end justify-around print:hidden select-none transition-colors"
      aria-label="Admin Mobile Bottom Navigation"
    >
      {/* 1. Home - Kembali ke Halaman Eksekutif */}
      <button
        type="button"
        onClick={onNavigateHome}
        className="flex-1 flex flex-col items-center justify-center gap-0.5 py-1 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 active:scale-95 transition-all cursor-pointer group"
        title="Kembali ke Halaman Profil Eksekutif"
      >
        <div className="w-9 h-7 rounded-xl flex items-center justify-center group-hover:bg-blue-50 dark:group-hover:bg-slate-800 transition-colors">
          <Home className="w-5 h-5 text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
        </div>
        <span className="text-[10px] font-semibold tracking-tight text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          Home
        </span>
      </button>

      {/* 2. Links - Modal Direct Links (Mindmap / Peta Links) */}
      <button
        type="button"
        onClick={onOpenMindmapModal}
        className="flex-1 flex flex-col items-center justify-center gap-0.5 py-1 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 active:scale-95 transition-all cursor-pointer group"
        title="Buka Peta Links Modal"
      >
        <div className="w-9 h-7 rounded-xl flex items-center justify-center group-hover:bg-blue-50 dark:group-hover:bg-slate-800 transition-colors">
          <Network className="w-5 h-5 text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
        </div>
        <span className="text-[10px] font-semibold tracking-tight text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          Links
        </span>
      </button>

      {/* 3. Lamar - Floating Button (40% Overflow di Luar Area Putih Navbar, Precision Center Icon) */}
      <button
        type="button"
        onClick={onOpenApplyModal}
        className="flex-1 flex flex-col items-center justify-center cursor-pointer group relative -mt-5"
        title="Buka Modal Lamar Kerja (Smart Form & GAS Email)"
      >
        {/* Floating Blue Pill Button - Elevated 40% above navbar border line with border-white ring */}
        <div className="w-12 h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/35 border-[3px] border-white dark:border-slate-900 flex items-center justify-center transition-all group-active:scale-90 shrink-0">
          <Send className="w-5 h-5 text-white stroke-[2.2]" />
        </div>
        <span className="text-[10px] font-extrabold tracking-tight text-blue-600 dark:text-blue-400 mt-0.5">
          Lamar
        </span>
      </button>

      {/* 4. Preview - Preview CV (Printer Icon) */}
      <button
        type="button"
        onClick={onOpenPreviewModal}
        className="flex-1 flex flex-col items-center justify-center gap-0.5 py-1 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 active:scale-95 transition-all cursor-pointer group"
        title="Lihat Pratinjau Tampilan & Cetak CV PDF"
      >
        <div className="w-9 h-7 rounded-xl flex items-center justify-center group-hover:bg-blue-50 dark:group-hover:bg-slate-800 transition-colors">
          <Printer className="w-5 h-5 text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
        </div>
        <span className="text-[10px] font-semibold tracking-tight text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          Preview
        </span>
      </button>

      {/* 5. Pengaturan - Modal Pengaturan GAS / App (Gear Icon) */}
      <button
        type="button"
        onClick={onOpenGasSettings}
        className="flex-1 flex flex-col items-center justify-center gap-0.5 py-1 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 active:scale-95 transition-all cursor-pointer group"
        title="Pengaturan Akun & Layanan GAS"
      >
        <div className="w-9 h-7 rounded-xl flex items-center justify-center group-hover:bg-blue-50 dark:group-hover:bg-slate-800 transition-colors">
          <Settings className="w-5 h-5 text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
        </div>
        <span className="text-[10px] font-semibold tracking-tight text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          Pengaturan
        </span>
      </button>
    </nav>
  );
};

export const BottomNav = AdminBottomNav;
export type BottomNavProps = AdminBottomNavProps;
export default BottomNav;
