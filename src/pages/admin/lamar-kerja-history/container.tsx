import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ChevronLeft,
  History,
  Trash2,
  Pencil,
  RotateCw,
  RotateCcw,
  BarChart2,
  FileText,
  Paperclip,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { GasSendHistoryItem, INITIAL_6_GAS_ACCOUNTS, GasAttachment } from '../../../types/gasSender';
import { GasSenderService } from '../../../services/gasSenderService';
import {
  generateCvPdfAttachment,
  generateCoverLetterPdfAttachment,
  generatePortfolioPdfAttachment,
  generateCertificatesPdfAttachment,
} from '../../../utils/gasAttachmentGenerator';
import { buildIdentityDocsPdf } from '../../../utils/identityPdfGenerator';
import { getAcademicAttachments } from '../../../data/academicDocs';
import { useScrollLock } from '../../../utils/scrollLock';
import { GasHistoryModalProps } from './types';

export const GasHistoryContainer: React.FC<GasHistoryModalProps> = ({
  isOpen,
  onClose,
  onSelectForEdit,
}) => {
  const [history, setHistory] = useState<GasSendHistoryItem[]>([]);
  const [resendingId, setResendingId] = useState<string | null>(null);
  const [showAnalytics, setShowAnalytics] = useState<boolean>(false);
  const [expandedFileIds, setExpandedFileIds] = useState<Record<string, boolean>>({});

  useScrollLock(isOpen, 'modal-history');

  useEffect(() => {
    if (isOpen) {
      setHistory(GasSenderService.getHistory());
    }
  }, [isOpen]);

  const toggleExpandFiles = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setExpandedFileIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

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

      const attachments: GasAttachment[] = [];

      // 1. CV ATS PDF
      const cvAttachment = generateCvPdfAttachment({
        jobTitle: item.jobTitle,
        companyName: item.companyName,
        preset: item.presetKey || 'optimal',
        language: item.language || 'id',
      });
      attachments.push(cvAttachment);

      // 2. Surat Lamaran PDF jika aktif
      if (item.isCoverLetterActive !== false) {
        try {
          const coverLetterAtt = generateCoverLetterPdfAttachment({
            companyName: item.companyName,
            jobTitle: item.jobTitle,
            language: item.language === 'en' ? 'en' : 'in',
            presetKey: item.presetKey || 'optimal',
            applicantEmail: currentSender.account.email,
          });
          attachments.push(coverLetterAtt);
        } catch (err) {
          console.error('Failed to generate cover letter on resend:', err);
        }
      }

      // 3. Dokumen Identitas jika ada
      if (item.selectedIdentityIds && item.selectedIdentityIds.length > 0) {
        try {
          const identityAtts = await buildIdentityDocsPdf({
            selectedIds: item.selectedIdentityIds,
            isColorPrint: item.isIdentityColorPrint === true,
            isSeparatePhotoPrint: item.isIdentitySeparatePhotoPrint === true,
          });
          if (identityAtts && identityAtts.length > 0) {
            identityAtts.forEach((att) => attachments.push(att));
          }
        } catch (err) {
          console.error('Failed to generate identity attachments on resend:', err);
        }
      }

      // 4. Dokumen Akademik jika ada
      if (item.selectedAcademicIds && item.selectedAcademicIds.length > 0) {
        try {
          const academicAtts = await getAcademicAttachments(
            item.selectedAcademicIds,
            item.isColorPrint === true
          );
          for (const att of academicAtts) {
            attachments.push(att);
          }
        } catch (err) {
          console.error('Failed to get academic attachments on resend:', err);
        }
      }

      // 5. Portofolio jika ada
      if (item.selectedPortfolioSlideIds && item.selectedPortfolioSlideIds.length > 0) {
        try {
          const portAtt = await generatePortfolioPdfAttachment({
            preset: item.presetKey || 'optimal',
            selectedSlideIds: item.selectedPortfolioSlideIds,
            jobTitle: item.jobTitle,
            isCompressed: item.isPortfolioCompressed,
          });
          attachments.push(portAtt);
        } catch (err) {
          console.error('Failed to generate portfolio attachment on resend:', err);
        }
      }

      // 6. Sertifikasi jika ada
      if (item.selectedCertIds && item.selectedCertIds.length > 0) {
        try {
          const certAtt = await generateCertificatesPdfAttachment({
            preset: item.presetKey || 'optimal',
            selectedCertIds: item.selectedCertIds,
            jobTitle: item.jobTitle,
          });
          attachments.push(certAtt);
        } catch (err) {
          console.error('Failed to generate certs attachment on resend:', err);
        }
      }

      const finalSubject =
        item.subject ||
        (item.jobTitle ? `${item.jobTitle} - Alvareza Hilka Pratama` : 'Lamaran Pekerjaan - Alvareza Hilka Pratama');

      const result = await GasSenderService.sendEmail(
        {
          targetEmail: item.targetEmail,
          companyName: item.companyName,
          jobTitle: item.jobTitle,
          subject: finalSubject,
          body: item.emailBody,
          senderName: 'Alvareza Hilka Pratama',
          attachments,
          attachmentNames: attachments.map((a) => a.filename),
          isCoverLetterActive: item.isCoverLetterActive,
          selectedIdentityIds: item.selectedIdentityIds,
          isIdentityColorPrint: item.isIdentityColorPrint,
          isIdentitySeparatePhotoPrint: item.isIdentitySeparatePhotoPrint,
          selectedAcademicIds: item.selectedAcademicIds,
          isColorPrint: item.isColorPrint,
          selectedPortfolioSlideIds: item.selectedPortfolioSlideIds,
          isPortfolioCompressed: item.isPortfolioCompressed,
          selectedCertIds: item.selectedCertIds,
          customAttachmentNames: item.customAttachmentNames,
          presetKey: item.presetKey,
          language: item.language,
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
          hasAttachment: attachments.length > 0,
          attachmentName: attachments[0]?.filename,
          attachmentNames: attachments.map((a) => a.filename),
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
          className="fixed inset-0 z-50 bg-slate-950/40 dark:bg-slate-950/70 backdrop-blur-md flex flex-col justify-end md:justify-center md:items-center p-0 md:p-4 pt-[60px] md:pt-0 overflow-hidden"
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
            className="w-full md:max-w-2xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-t-3xl md:rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[calc(100vh-60px)] md:max-h-[88vh] overflow-hidden"
          >
            {/* Header Bar */}
            <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/80 dark:bg-slate-900/90">
              <div className="flex items-center gap-2 min-w-0">
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shrink-0"
                  title="Kembali"
                  aria-label="Kembali"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="min-w-0">
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 leading-tight truncate">
                    Riwayat Pengiriman
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
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
                      ? 'text-blue-600 dark:text-blue-400 bg-blue-100/90 dark:bg-blue-950/50 border border-blue-300/80 dark:border-blue-800 shadow-2xs'
                      : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800'
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
                    className="p-1.5 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors flex items-center gap-1 cursor-pointer font-medium"
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
              {/* Panel Analisa Email */}
              {showAnalytics && (
                <div className="py-1 px-0.5 space-y-2 border-b border-slate-200/80 dark:border-slate-800 pb-3 mb-2 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-slate-100">
                      <BarChart2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span>Analisa Pengiriman Email</span>
                    </div>
                    <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-0.5 rounded-full border border-blue-100 dark:border-blue-900">
                      Total {history.length} Kiriman
                    </span>
                  </div>

                  {senderAnalytics.length === 0 ? (
                    <p className="text-xs text-slate-500 dark:text-slate-400 py-1 text-center">Belum ada data pengiriman.</p>
                  ) : (
                    <div className="grid grid-cols-2 gap-x-8 sm:gap-x-12 gap-y-1 pt-0.5">
                      {senderAnalytics.map(({ email, count }) => {
                        const displayUsername = email.split('@')[0];
                        return (
                          <div
                            key={email}
                            className="flex items-center justify-start gap-1 py-1 px-1 border-b border-slate-100 dark:border-slate-800 text-xs min-w-0"
                          >
                            <span className="font-semibold text-slate-800 dark:text-slate-200 truncate text-[11px] sm:text-xs" title={email}>
                              {displayUsername}
                            </span>
                            <span className="text-slate-400 dark:text-slate-500 font-medium shrink-0 text-[11px] sm:text-xs ml-0.5">:</span>
                            <span className="font-bold text-blue-600 dark:text-blue-400 shrink-0 text-[11px] sm:text-xs">
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
                <div className="py-12 text-center text-slate-400 dark:text-slate-500 space-y-2">
                  <History className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600" />
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Belum ada riwayat pengiriman</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">Email yang Anda kirimkan akan otomatis tersimpan di lokal perangkat</p>
                </div>
              ) : (
                history.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 sm:p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-1 hover:border-slate-300 dark:hover:border-slate-700 transition-colors shadow-2xs"
                  >
                    {/* 1. Nama Perusahaan & Action Buttons */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                        {item.companyName || 'Perusahaan'}
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        {/* Icon Resend */}
                        {item.status === 'failed' && (
                           <button
                            type="button"
                            onClick={(e) => handleResendItem(item, e)}
                            disabled={resendingId === item.id}
                            className="p-1.5 text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-lg transition-colors cursor-pointer shrink-0 disabled:opacity-50"
                            title="Kirim Ulang Email"
                            aria-label="Kirim Ulang Email"
                          >
                            <RotateCw className={`w-4 h-4 ${resendingId === item.id ? 'animate-spin text-amber-600 dark:text-amber-400' : ''}`} />
                          </button>
                        )}

                        {/* Icon Pensil */}
                        <button
                          type="button"
                          onClick={(e) => handleEditItem(item, e)}
                          className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-lg transition-colors cursor-pointer shrink-0"
                          title="Edit / Gunakan di formulir"
                          aria-label="Edit / Gunakan di formulir"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>

                        {/* Icon Delete */}
                        <button
                          type="button"
                          onClick={(e) => handleDeleteItem(item.id, e)}
                          className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer shrink-0"
                          title="Hapus riwayat ini"
                          aria-label="Hapus riwayat ini"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* 2. Posisi */}
                    <div className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">
                      {formatPosition(item.jobTitle)}
                    </div>

                    {/* 3. Email Tujuan */}
                    <div className="text-xs text-slate-600 dark:text-slate-400 pt-0.5">
                      <span className="font-medium text-slate-800 dark:text-slate-200 break-all">{item.targetEmail}</span>
                    </div>

                    {/* 4. Status Tanggal Terkirim & Pengirim */}
                    <div className="pt-1.5 space-y-0.5">
                      <div
                        className={`text-[11px] font-medium ${
                          item.status === 'success' ? 'text-slate-500 dark:text-slate-400' : 'text-rose-600 dark:text-rose-400 font-semibold'
                        }`}
                      >
                        {formatHistoryDate(item.timestamp, item.status)}
                      </div>
                      <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">
                        Oleh {item.senderEmail || 'Google Apps Script'}
                      </div>
                    </div>

                    {/* 5. Detail Lampiran Dokumen */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                      <div className="flex flex-wrap items-center gap-1.5 select-none">
                        {/* CV ATS */}
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800">
                          CV ATS
                        </span>

                        {/* Surat Lamaran */}
                        {item.isCoverLetterActive !== false && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                            Lamaran
                          </span>
                        )}

                        {/* Identitas */}
                        {item.selectedIdentityIds && item.selectedIdentityIds.length > 0 ? (
                          <span
                            className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${
                              item.isIdentitySeparatePhotoPrint
                                ? 'bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200/70 dark:border-purple-800'
                                : 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200/70 dark:border-indigo-800'
                            }`}
                            title={`Identitas: ${item.selectedIdentityIds.length} Dokumen, ${item.isIdentityColorPrint ? 'Warna' : 'Hitam Putih / BW'}, Cetak Foto: ${item.isIdentitySeparatePhotoPrint ? 'Dipisah' : 'Digabung'}`}
                          >
                            Identitas ({item.selectedIdentityIds.length} Dok • {item.isIdentityColorPrint ? 'Warna' : 'BW'} • {item.isIdentitySeparatePhotoPrint ? 'Pisah Foto' : 'Gabung'})
                          </span>
                        ) : item.attachmentNames?.some((n) => n.toLowerCase().includes('identitas') || n.toLowerCase().includes('foto-') || n.toLowerCase().includes('ktp')) ? (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200/70 dark:border-indigo-800">
                            Identitas ({item.attachmentNames.some((n) => n.toLowerCase().includes('foto-')) ? 'Pisah Foto' : 'Gabung'})
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700">
                            Tanpa Identitas
                          </span>
                        )}

                        {/* Portofolio */}
                        {item.selectedPortfolioSlideIds && item.selectedPortfolioSlideIds.length > 0 ? (
                          <span
                            className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${
                              item.isPortfolioCompressed
                                ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200/70 dark:border-amber-800'
                                : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-800'
                            }`}
                            title={`Portofolio: ${item.selectedPortfolioSlideIds.length} Slide, ${item.isPortfolioCompressed ? 'Dikompresi ≤ 1MB' : 'Kualitas File Standar Penuh'}`}
                          >
                            Portofolio ({item.selectedPortfolioSlideIds.length} Slide • {item.isPortfolioCompressed ? 'Kompresi ≤1MB' : 'Penuh'})
                          </span>
                        ) : item.attachmentNames?.some((n) => n.toLowerCase().includes('portofolio')) ? (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-800">
                            Portofolio (Terlampir)
                          </span>
                        ) : null}

                        {/* Akademik */}
                        {item.selectedAcademicIds && item.selectedAcademicIds.length > 0 ? (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                            Akademik ({item.selectedAcademicIds.length} Dok • {item.isColorPrint ? 'Warna' : 'BW'})
                          </span>
                        ) : item.attachmentNames?.some((n) => n.toLowerCase().includes('akademik') || n.toLowerCase().includes('transkrip') || n.toLowerCase().includes('skl')) ? (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                            Akademik (Terlampir)
                          </span>
                        ) : null}

                        {/* Sertifikasi */}
                        {item.selectedCertIds && item.selectedCertIds.length > 0 ? (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                            Sertifikasi ({item.selectedCertIds.length} Dok)
                          </span>
                        ) : item.attachmentNames?.some((n) => n.toLowerCase().includes('sertifikasi')) ? (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                            Sertifikasi (Terlampir)
                          </span>
                        ) : null}

                        {/* Toggle button for attached filenames */}
                        {item.attachmentNames && item.attachmentNames.length > 0 && (
                          <button
                            type="button"
                            onClick={(e) => toggleExpandFiles(item.id, e)}
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200 bg-blue-50/80 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900 border border-blue-200/70 dark:border-blue-800 cursor-pointer ml-auto transition-colors"
                            title="Lihat rincian nama berkas file yang terlampir"
                          >
                            <Paperclip className="w-2.5 h-2.5" />
                            <span>{item.attachmentNames.length} File</span>
                            {expandedFileIds[item.id] ? <ChevronUp className="w-2.5 h-2.5" /> : <ChevronDown className="w-2.5 h-2.5" />}
                          </button>
                        )}
                      </div>

                      {/* Expandable list of exact filenames */}
                      {expandedFileIds[item.id] && item.attachmentNames && item.attachmentNames.length > 0 && (
                        <div className="mt-1.5 p-2 bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 rounded-lg space-y-1 text-[11px] text-slate-700 dark:text-slate-200 animate-in fade-in duration-150">
                          <div className="font-semibold text-slate-800 dark:text-slate-200 text-[10px] uppercase tracking-wider flex items-center justify-between">
                            <span>Berkas Terlampir ({item.attachmentNames.length}):</span>
                          </div>
                          {item.attachmentNames.map((fn, idx) => (
                            <div key={idx} className="flex items-center gap-1.5 font-mono text-[10px] text-slate-600 dark:text-slate-300 truncate">
                              <FileText className="w-3 h-3 text-blue-600 dark:text-blue-400 shrink-0" />
                              <span className="truncate">{fn}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {item.status === 'failed' && item.errorMessage && (
                      <p className="text-[11px] text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 p-2 rounded-lg border border-rose-200 dark:border-rose-900 mt-2">
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

export const GasHistoryModal = GasHistoryContainer;
export const ModalHistory = GasHistoryContainer;
