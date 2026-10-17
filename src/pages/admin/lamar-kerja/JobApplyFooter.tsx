import React from 'react';
import { Send } from 'lucide-react';
import { EmailOptionCombobox } from './JobApplyComboboxes';
import { GasAccountConfig } from '../../../types/gasSender';

interface JobApplyFooterProps {
  gasSendState: 'idle' | 'generating' | 'sending' | 'success' | 'error';
  sendProgress: number;
  emailOption: string;
  handleEmailOptionChange: (val: string) => void;
  gasAccounts: GasAccountConfig[];
  handleSaveToDraft: () => void;
  draftSaveFeedback: boolean;
  activeEditingDraft: any;
  handleOpenMailClient: () => void;
  handleSendViaGas: () => void;
}

export const JobApplyFooter: React.FC<JobApplyFooterProps> = ({
  gasSendState,
  sendProgress,
  emailOption,
  handleEmailOptionChange,
  gasAccounts,
  handleSaveToDraft,
  draftSaveFeedback,
  activeEditingDraft,
  handleOpenMailClient,
  handleSendViaGas,
}) => {
  // Action Buttons Footer: Saat proses kirim, digantikan dengan bar progress di paling bawah
  if (gasSendState === 'generating' || gasSendState === 'sending') {
    return (
      <div className="px-5 py-4 border-t border-slate-200 bg-white flex items-center gap-3.5 shrink-0 animate-in fade-in duration-200">
        <div className="flex-1 bg-slate-100 rounded-full h-2.5 overflow-hidden shadow-inner border border-slate-200/60">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-200 ease-out"
            style={{ width: `${Math.min(100, Math.max(5, sendProgress))}%` }}
          />
        </div>
        <span className="text-xs sm:text-sm font-bold text-slate-700 font-mono tracking-tight shrink-0 min-w-[42px] text-right">
          {sendProgress}%
        </span>
      </div>
    );
  }

  return (
    <div className="border-t border-slate-200 bg-slate-50/90 flex flex-col shrink-0 relative z-30">
      {/* Sticky Bottom Action Bar */}
      <div className="px-4 sm:px-5 py-3 flex items-center justify-between gap-2.5">
        {/* Kolom Opsi Email Pengiriman (GAS Account 1-6 atau Mailto) */}
        <div className={`flex items-center gap-1.5 ${activeEditingDraft ? 'shrink-0' : 'flex-1 min-w-0'}`}>
          {!activeEditingDraft && (
            <EmailOptionCombobox
              value={emailOption}
              onChange={handleEmailOptionChange}
              gasAccounts={gasAccounts}
            />
          )}
        </div>

        {/* Tombol Draft / Simpan & Tombol Kirim */}
        <div className={`flex items-center gap-2 ${activeEditingDraft ? 'flex-1 min-w-0' : 'shrink-0'}`}>
          <button
            type="button"
            id="btn-save-draft-action"
            onClick={handleSaveToDraft}
            disabled={gasSendState === 'generating' || gasSendState === 'sending'}
            className={`h-10 px-3.5 rounded-xl flex items-center justify-center font-bold text-xs tracking-wide transition-all shadow-2xs cursor-pointer disabled:opacity-50 border select-none ${
              activeEditingDraft ? 'flex-1 min-w-0' : 'shrink-0'
            } ${
              draftSaveFeedback
                ? 'bg-emerald-100 text-emerald-800 border-emerald-400 ring-2 ring-emerald-400'
                : activeEditingDraft
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100/80 active:scale-95'
                : 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100/80 active:scale-95'
            }`}
            title={
              activeEditingDraft
                ? 'Simpan perubahan draf tersimpan ini'
                : 'Simpan data formulir ini ke Draf baru'
            }
            aria-label={activeEditingDraft ? 'Simpan Perubahan Draf' : 'Simpan Draf Baru'}
          >
            {draftSaveFeedback
              ? 'TERSIMPAN!'
              : activeEditingDraft
              ? 'SIMPAN'
              : 'DRAFT'}
          </button>

          {/* Samping Paling Kanan: Tombol Kirim Presisi */}
          <button
            type="button"
            id="btn-send-email-action"
            onClick={() => {
              if (emailOption === 'mailto') {
                handleOpenMailClient();
              } else {
                handleSendViaGas();
              }
            }}
            disabled={gasSendState === 'generating' || gasSendState === 'sending'}
            className={`h-10 rounded-xl flex items-center justify-center text-white bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all shadow-sm shadow-blue-600/30 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed border border-blue-500/20 ${
              activeEditingDraft
                ? 'flex-1 min-w-0 px-3.5 font-bold text-xs tracking-wide'
                : 'w-10 sm:w-11 shrink-0'
            }`}
            title={emailOption === 'mailto' ? 'Buka Aplikasi Email' : 'Kirim Email Lamaran'}
            aria-label={emailOption === 'mailto' ? 'Buka Aplikasi Email' : 'Kirim Email Lamaran'}
          >
            {activeEditingDraft ? (
              <span>KIRIM</span>
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
