import React from 'react';
import { X } from 'lucide-react';

interface DirectLinkHeaderProps {
  areAllOpen: boolean;
  onToggleAll: () => void;
  onClose: () => void;
}

export const DirectLinkHeader: React.FC<DirectLinkHeaderProps> = ({
  areAllOpen,
  onToggleAll,
  onClose,
}) => {
  return (
    <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between shrink-0 bg-slate-50/80">
      <div className="min-w-0 flex-1">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight truncate">
          Peta Links
        </h2>
        <p className="text-xs text-slate-500 truncate mt-0.5 font-normal">
          Kustomisasi & link publik 6 dokumen utama
        </p>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={onToggleAll}
          className="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-blue-600 bg-slate-200/60 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer hidden sm:block"
        >
          {areAllOpen ? 'Tutup Semua' : 'Buka Semua'}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
          title="Tutup Modal"
          aria-label="Tutup Modal"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default DirectLinkHeader;
