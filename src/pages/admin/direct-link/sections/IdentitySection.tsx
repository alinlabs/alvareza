import React from 'react';
import { motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { CardStateGeneric } from '../types';
import { Seekbar } from '../components/Seekbar';
import { UrlBox } from '../components/UrlBox';
import { CustomOptionCombobox, OptionItem } from '../components/CustomOptionCombobox';

interface IdentitySectionProps {
  isOpen: boolean;
  onToggle: () => void;
  state: CardStateGeneric;
  onChange: (updater: (prev: CardStateGeneric) => CardStateGeneric) => void;
  url: string;
  isCopied: boolean;
  onCopy: () => void;
}

const IDENTITY_OPTIONS: OptionItem[] = [
  { value: 'all', label: 'Semua Berkas Identitas Diri' },
  { value: 'ktp', label: 'Kartu Tanda Penduduk (KTP)' },
  { value: 'npwp', label: 'Nomor Pokok Wajib Pajak (NPWP)' },
  { value: 'kk', label: 'Kartu Keluarga (KK)' },
];

export const IdentitySection: React.FC<IdentitySectionProps> = ({
  isOpen,
  onToggle,
  state,
  onChange,
  url,
  isCopied,
  onCopy,
}) => {
  return (
    <div className="py-3 sm:py-3.5 border-b border-slate-200/80 dark:border-slate-800 last:border-b-0 px-1 sm:px-2 group transition-colors">
      <div
        onClick={onToggle}
        className="flex items-center justify-between gap-3 cursor-pointer select-none"
      >
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
            Identitas
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium line-clamp-1 mt-0.5">
            KTP, KK, & NPWP
          </p>
        </div>
        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-200 group-hover:bg-slate-100 dark:group-hover:bg-slate-800 transition-colors shrink-0">
          <ChevronDown
            className={`w-4 h-4 stroke-[1.5] transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-blue-600 dark:text-blue-400' : ''
            }`}
          />
        </div>
      </div>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="mt-3.5 pt-3.5 border-t border-slate-100 dark:border-slate-800 space-y-3.5"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <CustomOptionCombobox
              label="Dokumen Identitas"
              options={IDENTITY_OPTIONS}
              value={state.specific}
              onChange={(val) =>
                onChange((prev) => ({ ...prev, specific: val }))
              }
            />

            <Seekbar
              label="Mode Tampilan"
              leftLabel="Hitam Putih (BW)"
              rightLabel="Cetak Berwarna"
              value={state.isColor}
              onChange={(val) => onChange((prev) => ({ ...prev, isColor: val }))}
            />
          </div>

          <UrlBox
            url={url}
            isCopied={isCopied}
            onCopy={onCopy}
          />
        </motion.div>
      )}
    </div>
  );
};

export default IdentitySection;
