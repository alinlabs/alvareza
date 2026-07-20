import React from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, Check, X } from 'lucide-react';

interface SendProgressBarProps {
  isSending: boolean;
  sendProgress: number;
  sendError: string | null;
  successMsg: boolean;
  handleCancelSend: () => void;
}

export const SendProgressBar = ({
  isSending,
  sendProgress,
  sendError,
  successMsg,
  handleCancelSend,
}: SendProgressBarProps) => {
  if (!isSending && !successMsg && !sendError) return null;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm mt-6 text-left">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
          Status Pengiriman
        </h3>
        {isSending && (
          <span className="text-xs font-bold text-accent">{sendProgress}%</span>
        )}
      </div>
      
      {isSending && (
        <div className="space-y-4">
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
            <motion.div 
              className="bg-accent h-2.5 rounded-full" 
              initial={{ width: 0 }}
              animate={{ width: `${sendProgress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      )}

      {sendError && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/30 rounded-xl flex items-start gap-3 text-rose-600 dark:text-rose-400 text-sm shadow-sm"
        >
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Gagal Mengirim Email</p>
            <p className="text-xs mt-1 leading-relaxed">
              {sendError.includes('Kredensial') || sendError.includes('password') 
                ? 'Password Aplikasi atau Email tidak valid/belum diatur. Pastikan Anda telah mengisi Email App Password (berupa 16 digit huruf) yang valid di pengaturan profil (bukan password login biasa).' 
                : sendError}
            </p>
          </div>
        </motion.div>
      )}

      {successMsg && !sendError && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/30 rounded-xl flex items-start gap-3 text-emerald-600 dark:text-emerald-400 text-sm mt-4 shadow-sm"
        >
          <Check className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Pengiriman Berhasil!</p>
            <p className="text-xs mt-1 leading-relaxed">
              Email lamaran telah dikirimkan ke tujuan dengan sukses.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};
