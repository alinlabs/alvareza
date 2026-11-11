import React from 'react';
import { RotateCw, XCircle, Settings, Send } from 'lucide-react';
import { ItemSelectionState } from '../../../data/preset/config/item-seleksi';
import { GasSendMode } from '../../../types/gasSender';
import { ModalSheet } from './index';

// ==========================================
// 1. Types & Interfaces
// ==========================================

export interface ModalSheetProps {
  isOpen: boolean;
  onClose: () => void;
  cvItems?: ItemSelectionState | null;
}

export type JobApplyModalSheetProps = ModalSheetProps;

export interface BottomBarProps {
  onOpenApplyModal: () => void;
  isLoading?: boolean;
}

export type JobApplyBottomBarProps = BottomBarProps;

export interface StatusAlertsProps {
  gasSendState: GasSendMode;
  gasSendMsg: string;
  sendingSenderEmail?: string | null;
  activeSenderEmail?: string;
  recipientEmail: string;
  onOpenGasSettings: () => void;
}

export type JobApplyStatusAlertsProps = StatusAlertsProps;

export interface LamarKerjaContainerProps extends ModalSheetProps {
  showBottomBar?: boolean;
  onOpenApplyModal?: () => void;
}

// ==========================================
// 2. StatusAlerts Component
// ==========================================

export const StatusAlerts: React.FC<StatusAlertsProps> = ({
  gasSendState,
  gasSendMsg,
  sendingSenderEmail,
  activeSenderEmail,
  recipientEmail,
  onOpenGasSettings,
}) => {
  if (gasSendState === 'idle') return null;

  return (
    <div className="space-y-2">
      {/* Sending Feedback Alerts */}
      {gasSendState === 'generating' && (
        <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-xl flex items-center gap-2 text-xs text-blue-800 dark:text-blue-200">
          <RotateCw className="w-4 h-4 animate-spin text-blue-600 dark:text-blue-400 shrink-0" />
          <span>{gasSendMsg}</span>
        </div>
      )}

      {gasSendState === 'sending' && (
        <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-xl flex items-center gap-2 text-xs text-blue-800 dark:text-blue-200">
          <RotateCw className="w-4 h-4 animate-spin text-blue-600 dark:text-blue-400 shrink-0" />
          <span className="font-medium">{gasSendMsg}</span>
        </div>
      )}

      {gasSendState === 'success' && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 rounded-xl text-xs text-emerald-900 dark:text-emerald-100 animate-in fade-in duration-200 space-y-0.5">
          <div className="font-bold">Lamaran Berhasil Terkirim!</div>
          <div className="text-emerald-800 dark:text-emerald-300">
            Dari {sendingSenderEmail || activeSenderEmail || 'email pengirim'} ke {recipientEmail || 'email tujuan'}
          </div>
        </div>
      )}

      {gasSendState === 'error' && (
        <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 rounded-xl flex items-start gap-2 text-xs text-rose-900 dark:text-rose-100 animate-in fade-in duration-200">
          <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
          <div className="space-y-1 flex-1">
            <div className="font-bold">Pengiriman Gagal:</div>
            <p className="text-rose-800 dark:text-rose-300 leading-relaxed">{gasSendMsg}</p>
            <button
              type="button"
              onClick={onOpenGasSettings}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 dark:text-rose-300 hover:text-rose-900 dark:hover:text-rose-200 underline cursor-pointer"
            >
              <Settings className="w-3 h-3" />
              Periksa URL di Pengaturan 6 Akun GAS
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export const JobApplyStatusAlerts = StatusAlerts;

// ==========================================
// 3. BottomBar Component
// ==========================================

export const BottomBar: React.FC<BottomBarProps> = ({
  onOpenApplyModal,
  isLoading = false,
}) => {
  return (
    <div
      id="job-apply-bottom-bar"
      className="fixed bottom-0 left-0 right-0 z-40 print:hidden p-3 sm:p-4 pointer-events-none hidden md:flex justify-center"
    >
      <div className="w-full max-w-6xl mx-auto px-1 sm:px-2">
        <button
          id="btn-lamar-sekarang"
          type="button"
          onClick={onOpenApplyModal}
          disabled={isLoading}
          className="pointer-events-auto w-full py-3.5 sm:py-4 px-6 rounded-2xl font-bold text-base sm:text-lg text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-all duration-150 border border-blue-500 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 flex items-center justify-center gap-2 text-center shadow-lg"
        >
          <Send className="w-5 h-5" />
          <span>{isLoading ? 'Memproses Draf...' : 'Lamar Pekerjaan Sekarang'}</span>
        </button>
      </div>
    </div>
  );
};

export const JobApplyBottomBar = BottomBar;

// ==========================================
// 4. LamarKerjaContainer Component (Main Container Orchestrator)
// ==========================================

export const LamarKerjaContainer: React.FC<LamarKerjaContainerProps> = ({
  showBottomBar = false,
  onOpenApplyModal,
  isOpen,
  onClose,
  cvItems,
}) => {
  return (
    <>
      {showBottomBar && onOpenApplyModal && (
        <BottomBar
          onOpenApplyModal={onOpenApplyModal}
        />
      )}

      <ModalSheet
        isOpen={isOpen}
        onClose={onClose}
        cvItems={cvItems}
      />
    </>
  );
};

export default LamarKerjaContainer;
