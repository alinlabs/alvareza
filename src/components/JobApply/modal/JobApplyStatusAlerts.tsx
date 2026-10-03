import React from 'react';
import { RotateCw, XCircle, Settings } from 'lucide-react';
import { GasSendMode } from '../../../types/gasSender';

interface JobApplyStatusAlertsProps {
  isScanning: boolean;
  gasSendState: GasSendMode;
  gasSendMsg: string;
  sendingSenderEmail?: string | null;
  activeSenderEmail?: string;
  recipientEmail: string;
  onOpenGasSettings: () => void;
}

export const JobApplyStatusAlerts: React.FC<JobApplyStatusAlertsProps> = ({
  isScanning,
  gasSendState,
  gasSendMsg,
  sendingSenderEmail,
  activeSenderEmail,
  recipientEmail,
  onOpenGasSettings,
}) => {
  if (isScanning || gasSendState === 'idle') return null;

  return (
    <div className="space-y-2">
      {/* Sending Feedback Alerts */}
      {gasSendState === 'generating' && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center gap-2 text-xs text-blue-800">
          <RotateCw className="w-4 h-4 animate-spin text-blue-600 shrink-0" />
          <span>{gasSendMsg}</span>
        </div>
      )}

      {gasSendState === 'sending' && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center gap-2 text-xs text-blue-800">
          <RotateCw className="w-4 h-4 animate-spin text-blue-600 shrink-0" />
          <span className="font-medium">{gasSendMsg}</span>
        </div>
      )}

      {gasSendState === 'success' && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 animate-in fade-in duration-200 space-y-0.5">
          <div className="font-bold">Lamaran Berhasil Terkirim!</div>
          <div className="text-emerald-800">
            Dari {sendingSenderEmail || activeSenderEmail || 'email pengirim'} ke {recipientEmail || 'email tujuan'}
          </div>
        </div>
      )}

      {gasSendState === 'error' && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2 text-xs text-rose-900 animate-in fade-in duration-200">
          <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1 flex-1">
            <div className="font-bold">Pengiriman Gagal:</div>
            <p className="text-rose-800 leading-relaxed">{gasSendMsg}</p>
            <button
              type="button"
              onClick={onOpenGasSettings}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 hover:text-rose-900 underline cursor-pointer"
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
