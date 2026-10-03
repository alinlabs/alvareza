import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, History, Trash2, Pencil, RotateCw, RotateCcw, BarChart2 } from 'lucide-react';
import { GasSendHistoryItem, INITIAL_6_GAS_ACCOUNTS } from '../../types/gasSender';
import { GasSenderService } from '../../services/gasSenderService';
import { generateCvPdfAttachment } from '../../utils/gasAttachmentGenerator';

interface GasHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectForEdit?: (item: GasSendHistoryItem) => void;
}

export const GasHistoryModal: React.FC<GasHistoryModalProps> = ({
  isOpen,
  onClose,
  onSelectForEdit,
}) => {
  const [history, setHistory] = useState<GasSendHistoryItem[]>([]);
  const [resendingId, setResendingId] = useState<string | null>(null);
  const [showAnalytics, setShowAnalytics] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setHistory(GasSenderService.getHistory());
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    }
    return () => {
      setTimeout(() => {
        if (!document.querySelector('[id$="-backdrop"]')) {
          document.body.style.overflow = '';
          document.documentElement.style.overflow = '';
        }
      }, 0);
    };
  }, [isOpen]);

  const senderAnalytics = useMemo(() => {
    const counts: Record<string, number> = {};

    // Initialize counts for configured 6 GAS accounts
    for (const acc of INITIAL_6_GAS_ACCOUNTS) {
      if (acc.email) {
        counts[acc.email] = 0;
      }
    }

    // Accumulate counts from actual history
    for (const item of history) {
      const sender = item.senderEmail || 'Google Apps Script';
      counts[sender] = (counts[sender] || 0) + 1;
    }

    return Object.entries(counts).map(([email, count]) => ({ email, count }));
  }, [history]);

  const handleClear = () => {
    GasSenderService.clearHistory();
    setHistory([]);
  };

  const handleDeleteItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    GasSenderService.deleteHistoryItem(id);
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const handleEditItem = (item: GasSendHistoryItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSelectForEdit) {
      onSelectForEdit(item);
    }
  };

  const handleResendItem = async (item: GasSendHistoryItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (resendingId) return;

    setResendingId(item.id);

    try {
      const currentSender = GasSenderService.getNextSenderAccount();
      if (!currentSender || !currentSender.account.webAppUrl) {
        alert('URL Google Apps Script belum dikonfigurasi di Pengaturan GAS.');
        setResendingId(null);
        return;
      }

      const cvAttachment = generateCvPdfAttachment({
        jobTitle: item.jobTitle,
        companyName: item.companyName,
      });

      const finalSubject =
        item.subject ||
        (item.jobTitle ? `${item.jobTitle} - Alvareza` : 'Lamaran Pekerjaan - Alvareza');

      const result = await GasSenderService.sendEmail(
        {
          targetEmail: item.targetEmail,
          companyName: item.companyName,
          jobTitle: item.jobTitle,
          subject: finalSubject,
          senderName: 'Lamaran Kerja Alvareza',
          attachments: [cvAttachment],
        },
        currentSender.account,
        { autoAdvanceRotation: true }
      );

      if (result.success) {
        const updatedItem: GasSendHistoryItem = {
          ...item,
          status: 'success',
          errorMessage: undefined,
          timestamp: new Date().toISOString(),
          senderEmail: currentSender.account.email,
          senderAccountId: currentSender.account.id,
        };
        GasSenderService.updateHistoryItem(updatedItem);
        setHistory((prev) => prev.map((h) => (h.id === item.id ? updatedItem : h)));
      } else {
        const updatedItem: GasSendHistoryItem = {
          ...item,
          status: 'failed',
          errorMessage: result.error || 'Gagal mengirim ulang email.',
          timestamp: new Date().toISOString(),
        };
        GasSenderService.updateHistoryItem(updatedItem);
        setHistory((prev) => prev.map((h) => (h.id === item.id ? updatedItem : h)));
      }
    } catch (err: any) {
      console.error('Failed to resend history item:', err);
    } finally {
      setResendingId(null);
    }
  };

  const formatPosition = (jobTitle?: string) => {
    if (jobTitle && jobTitle.trim()) {
      return jobTitle.trim();
    }
    return 'Posisi';
  };

  const formatHistoryDate = (dateStr: string, status: 'success' | 'failed') => {
    try {
      const d = new Date(dateStr);
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      const day = d.getDate();
      const months = [
        'Januari',
        'Februari',
        'Maret',
        'April',
        'Mei',
        'Juni',
        'Juli',
        'Agustus',
        'September',
        'Oktober',
        'November',
        'Desember',
      ];
      const month = months[d.getMonth()] || '';
      const year = d.getFullYear();
      const timeFormatted = `${hours}:${minutes}, ${day} ${month} ${year}`;

      if (status === 'success') {
        return `Berhasil Dikirim Pada  ${timeFormatted}`;
      } else {
        return `Gagal Dikirim Pada  ${timeFormatted}`;
      }
    } catch {
      return status === 'success' ? `Berhasil Dikirim Pada  ${dateStr}` : `Gagal Dikirim Pada  ${dateStr}`;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="gas-history-modal-backdrop"
          id="gas-history-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 bg-slate-950/10 backdrop-blur-md flex flex-col justify-end md:justify-center md:items-center p-0 md:p-4 pt-[60px] md:pt-0 overflow-hidden"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            key="gas-history-modal-container"
            id="gas-history-modal-container"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
            className="w-full md:max-w-2xl bg-white text-slate-800 rounded-t-3xl md:rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[calc(100vh-60px)] md:max-h-[88vh] overflow-hidden"
          >
        {/* Header Bar */}
        <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between shrink-0 bg-slate-50/80">
          <div className="flex items-center gap-2 min-w-0">
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer shrink-0"
              title="Kembali"
              aria-label="Kembali"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight truncate">
                Riwayat Pengiriman
              </h2>
              <p className="text-xs text-slate-500 truncate">
                Email terkirim di lokal
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Tombol Analisa (Di sebelah kiri icon Reset) */}
            <button
              type="button"
              onClick={() => setShowAnalytics((prev) => !prev)}
              className={`p-1.5 rounded-lg transition-all cursor-pointer flex items-center justify-center shrink-0 ${
                showAnalytics
                  ? 'text-blue-600 bg-blue-100/90 border border-blue-300/80 shadow-2xs'
                  : 'text-slate-400 hover:text-slate-700 hover:bg-slate-200/60'
              }`}
              title={showAnalytics ? 'Sembunyikan Analisa' : 'Analisa Pengiriman per Email'}
              aria-label="Analisa Pengiriman"
            >
              <BarChart2 className="w-5 h-5" />
            </button>

            {history.length > 0 && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1 cursor-pointer font-medium"
                title="Reset Riwayat"
                aria-label="Reset Riwayat"
              >
                <RotateCcw className="w-4 h-4" />
                <span className="hidden sm:inline">Reset Riwayat</span>
              </button>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-4 sm:p-5 space-y-3">
          {/* Panel Analisa Email (Toggled by Icon Analisa, tanpa card pembungkus) */}
          {showAnalytics && (
            <div className="py-1 px-0.5 space-y-2 border-b border-slate-200/80 pb-3 mb-2 animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                  <BarChart2 className="w-4 h-4 text-blue-600" />
                  <span>Analisa Pengiriman Email</span>
                </div>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                  Total {history.length} Kiriman
                </span>
              </div>

              {senderAnalytics.length === 0 ? (
                <p className="text-xs text-slate-500 py-1 text-center">Belum ada data pengiriman.</p>
              ) : (
                <div className="grid grid-cols-2 gap-x-8 sm:gap-x-12 gap-y-1 pt-0.5">
                  {senderAnalytics.map(({ email, count }) => {
                    const displayUsername = email.split('@')[0];
                    return (
                      <div
                        key={email}
                        className="flex items-center justify-start gap-1 py-1 px-1 border-b border-slate-100 text-xs min-w-0"
                      >
                        <span className="font-semibold text-slate-800 truncate text-[11px] sm:text-xs" title={email}>
                          {displayUsername}
                        </span>
                        <span className="text-slate-400 font-medium shrink-0 text-[11px] sm:text-xs ml-0.5">:</span>
                        <span className="font-bold text-blue-600 shrink-0 text-[11px] sm:text-xs">
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
          {history.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <History className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-sm font-semibold text-slate-600">Belum ada riwayat pengiriman</p>
              <p className="text-xs text-slate-400">Email yang Anda kirimkan akan otomatis tersimpan di lokal perangkat</p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="p-3.5 sm:p-4 bg-white border border-slate-200 rounded-xl space-y-1 hover:border-slate-300 transition-colors shadow-2xs"
              >
                {/* 1. Nama Perusahaan & Action Buttons */}
                <div className="flex items-center justify-between gap-2">
                  <div className="text-sm font-bold text-slate-900 truncate">
                    {item.companyName || 'Perusahaan'}
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {/* Icon Resend: khusus pengiriman gagal, diletakkan di samping kiri icon pensil */}
                    {item.status === 'failed' && (
                      <button
                        type="button"
                        onClick={(e) => handleResendItem(item, e)}
                        disabled={resendingId === item.id}
                        className="p-1.5 text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors cursor-pointer shrink-0 disabled:opacity-50"
                        title="Kirim Ulang Email"
                        aria-label="Kirim Ulang Email"
                      >
                        <RotateCw className={`w-4 h-4 ${resendingId === item.id ? 'animate-spin text-amber-600' : ''}`} />
                      </button>
                    )}

                    {/* Icon Pensil: default di samping kiri icon delete */}
                    <button
                      type="button"
                      onClick={(e) => handleEditItem(item, e)}
                      className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer shrink-0"
                      title="Edit / Gunakan di formulir"
                      aria-label="Edit / Gunakan di formulir"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>

                    {/* Icon Delete: paling kanan */}
                    <button
                      type="button"
                      onClick={(e) => handleDeleteItem(item.id, e)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer shrink-0"
                      title="Hapus riwayat ini"
                      aria-label="Hapus riwayat ini"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* 2. Posisi (Subject tetap disimpan di data tetapi tidak ditampilkan) */}
                <div className="text-xs font-semibold text-slate-700 truncate">
                  {formatPosition(item.jobTitle)}
                </div>

                {/* 3. Email Tujuan */}
                <div className="text-xs text-slate-600 pt-0.5">
                  <span className="font-medium text-slate-800 break-all">{item.targetEmail}</span>
                </div>

                {/* 4. Status Tanggal Terkirim & Pengirim */}
                <div className="pt-1.5 space-y-0.5">
                  <div
                    className={`text-[11px] font-medium ${
                      item.status === 'success' ? 'text-slate-500' : 'text-rose-600 font-semibold'
                    }`}
                  >
                    {formatHistoryDate(item.timestamp, item.status)}
                  </div>
                  <div className="text-[11px] font-medium text-slate-500 truncate">
                    Oleh {item.senderEmail || 'Google Apps Script'}
                  </div>
                </div>

                {item.status === 'failed' && item.errorMessage && (
                  <p className="text-[11px] text-rose-600 bg-rose-50 p-2 rounded-lg border border-rose-200 mt-2">
                    Error: {item.errorMessage}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
  );
};
