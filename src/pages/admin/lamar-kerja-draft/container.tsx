import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ChevronLeft,
  FileText,
  Trash2,
  Pencil,
  Send,
  Play,
  Pause,
  StopCircle,
  RotateCw,
  RotateCcw,
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { JobApplicationDraftItem } from '../../../types/jobDraft';
import { JobDraftService } from '../../../services/jobDraftService';
import { ALL_ROLE_PRESETS } from '../../../data/preset/RoleConfig';
import { useBulkDraftSender } from '../../../hooks/useBulkDraftSender';
import { useScrollLock } from '../../../utils/scrollLock';
import { JobDraftsModalProps } from './types';

const get3LetterPresetCode = (presetKey?: string) => {
  if (!presetKey) return 'OPT';
  const found = ALL_ROLE_PRESETS.find(
    (p) => p.key === presetKey || p.code.toLowerCase() === presetKey.toLowerCase()
  );
  if (found && found.code) {
    return found.code;
  }
  return presetKey.substring(0, 3).toUpperCase();
};

const getDesignLabelLower = (design?: string) => {
  switch (design) {
    case 'line':
      return 'garis';
    case 'badge':
      return 'badge';
    case 'plain':
      return 'polos';
    case 'block':
    default:
      return 'blok';
  }
};

export const JobDraftsContainer: React.FC<JobDraftsModalProps> = ({
  isOpen,
  onClose,
  onSelectForEdit,
  highlightDraftId,
}) => {
  const [drafts, setDrafts] = useState<JobApplicationDraftItem[]>([]);
  const [expandedDraftIds, setExpandedDraftIds] = useState<Record<string, boolean>>({});
  const [delaySeconds, setDelaySeconds] = useState<number>(8);

  const toggleExpandDraft = (draftId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setExpandedDraftIds((prev) => ({
      ...prev,
      [draftId]: !prev[draftId],
    }));
  };

  useEffect(() => {
    if (isOpen && highlightDraftId) {
      setTimeout(() => {
        const el = document.getElementById(`draft-card-${highlightDraftId}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 200);
    }
  }, [isOpen, highlightDraftId]);

  useScrollLock(isOpen, 'modal-drafts');

  useEffect(() => {
    if (isOpen) {
      setDrafts(JobDraftService.getDrafts());
      setDelaySeconds(JobDraftService.getBulkDelaySeconds());
    }
  }, [isOpen]);

  const refreshDrafts = () => {
    setDrafts(JobDraftService.getDrafts());
  };

  const {
    bulkState,
    sendingDraftId,
    handleStartBulkSend,
    handlePauseBulk,
    handleResumeBulk,
    handleCancelBulk,
  } = useBulkDraftSender({
    drafts,
    delaySeconds,
    onRefreshDrafts: refreshDrafts,
  });

  const handleDelayChange = (seconds: number) => {
    setDelaySeconds(seconds);
    JobDraftService.setBulkDelaySeconds(seconds);
  };

  const handleDeleteItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    JobDraftService.deleteDraft(id);
    setDrafts((prev) => prev.filter((d) => d.id !== id));
  };

  const handleClearAll = () => {
    if (drafts.length === 0) return;
    if (window.confirm('Yakin ingin menghapus semua draf lamaran yang tersimpan?')) {
      JobDraftService.clearDrafts();
      setDrafts([]);
    }
  };

  const handleEditDraft = (draft: JobApplicationDraftItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSelectForEdit) {
      onSelectForEdit(draft);
    }
  };

  const pendingDraftsCount = drafts.length;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="gas-drafts-modal-backdrop"
          id="gas-drafts-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 bg-slate-950/40 dark:bg-slate-950/70 backdrop-blur-md flex flex-col justify-end md:justify-center md:items-center p-0 md:p-4 pt-[60px] md:pt-0 overflow-hidden"
          onClick={(e) => {
            if (e.target === e.currentTarget && !bulkState.isActive) onClose();
          }}
        >
          {/* Modal Container */}
          <motion.div
            key="gas-drafts-modal-container"
            id="gas-drafts-modal-container"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
            className="w-full md:max-w-2xl bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-t-3xl md:rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[calc(100vh-60px)] md:max-h-[88vh] overflow-hidden"
          >
            {/* Header */}
            <div className="px-4 py-3.5 sm:px-5 sm:py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/90 dark:bg-slate-900/90 shrink-0">
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="sm:hidden p-1.5 -ml-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 rounded-lg"
                  aria-label="Kembali"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base leading-tight">
                    Draft Lamaran
                  </h3>
                  <span className="text-xs font-bold bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 px-2.5 py-0.5 rounded-full min-w-[22px] text-center">
                    {drafts.length}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {drafts.length > 0 && !bulkState.isActive && (
                  <button
                    type="button"
                    onClick={handleClearAll}
                    className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                    title="Reset / Hapus Semua Draf"
                    aria-label="Reset / Hapus Semua Draf"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  disabled={bulkState.isActive}
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors disabled:opacity-40 cursor-pointer"
                  aria-label="Tutup modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Drafts List */}
            <div className="overflow-y-auto p-4 sm:p-5 space-y-3 flex-1">
              {drafts.length === 0 ? (
                /* Empty State */
                <div className="py-12 px-4 text-center">
                  <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-inner">
                    <FileText className="w-7 h-7" />
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100">
                    Belum Ada Draf Lamaran
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1.5 leading-relaxed">
                    Ketik atau pindai lowongan di modal lamar kerja, lalu klik tombol{' '}
                    <strong className="text-blue-600 dark:text-blue-400">Draft</strong> di sebelah kiri tombol kirim untuk menyimpan lamaran ke dalam daftar ini.
                  </p>
                </div>
              ) : (
                drafts.map((draft) => {
                  const isSendingThis = sendingDraftId === draft.id || (bulkState.isActive && bulkState.currentDraftId === draft.id);
                  const isQueued = bulkState.isActive && draft.status === 'queued';
                  const isSent = draft.status === 'sent';
                  const isFailed = draft.status === 'failed';
                  const isExpanded = Boolean(expandedDraftIds[draft.id]);

                  return (
                    <div
                      key={draft.id}
                      id={`draft-card-${draft.id}`}
                      onClick={(e) => toggleExpandDraft(draft.id, e)}
                      className={`group p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer relative ${
                        isSendingThis
                          ? 'border-blue-500 bg-blue-50/60 dark:bg-blue-950/40 ring-2 ring-blue-400'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-2xs'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        {/* Initial Clean Stacked Header View (ONLY Company, Position, Email) */}
                        <div className="space-y-0.5 flex-1 min-w-0 select-none">
                          <div className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base leading-snug truncate">
                            {draft.companyName || 'Perusahaan Tujuan'}
                          </div>
                          <div className="text-xs font-semibold text-blue-700 dark:text-blue-400 leading-snug truncate">
                            {draft.jobTitle || 'Posisi Dilamar'}
                          </div>
                          <div className="text-xs font-medium text-slate-600 dark:text-slate-400 leading-snug truncate">
                            {draft.recipientEmail || 'Belum ada email'}
                          </div>

                          {/* Quick Badges: Identitas status, Pisah Foto, Kompresi, etc. */}
                          <div className="flex flex-wrap items-center gap-1.5 pt-1.5 select-none">
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800">
                              CV ATS ({get3LetterPresetCode(draft.presetKey)})
                            </span>
                            {draft.isCoverLetterActive !== false && (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                                Lamaran
                              </span>
                            )}
                            {draft.selectedIdentityIds && draft.selectedIdentityIds.length > 0 ? (
                              <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${
                                draft.isIdentitySeparatePhotoPrint
                                  ? 'bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200/70 dark:border-purple-800'
                                  : 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200/70 dark:border-indigo-800'
                              }`}>
                                Identitas ({draft.selectedIdentityIds.length} Dok • {draft.isIdentityColorPrint ? 'Warna' : 'BW'} • {draft.isIdentitySeparatePhotoPrint ? 'Pisah Foto' : 'Gabung'})
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-50 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700">
                                Tanpa Identitas
                              </span>
                            )}
                            {draft.selectedPortfolioSlideIds && draft.selectedPortfolioSlideIds.length > 0 && (
                              <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${
                                draft.isPortfolioCompressed
                                  ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200/70 dark:border-amber-800'
                                  : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-800'
                              }`}>
                                Portofolio ({draft.selectedPortfolioSlideIds.length} Slide • {draft.isPortfolioCompressed ? 'Kompresi ≤1MB' : 'Penuh'})
                              </span>
                            )}
                            {draft.selectedAcademicIds && draft.selectedAcademicIds.length > 0 && (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                                Akademik ({draft.selectedAcademicIds.length} Dok)
                              </span>
                            )}
                            {draft.selectedCertIds && draft.selectedCertIds.length > 0 && (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                                Sertifikasi ({draft.selectedCertIds.length} Dok)
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Right Action: Edit & Delete Buttons */}
                        <div className="flex items-center gap-1 shrink-0 pt-0.5">
                          {isSendingThis ? (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-950/50 px-2.5 py-1 rounded-lg animate-pulse">
                              <RotateCw className="w-3.5 h-3.5 animate-spin" />
                              Mengirim...
                            </span>
                          ) : isQueued ? (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/50 px-2.5 py-1 rounded-lg">
                              <Clock className="w-3.5 h-3.5" />
                              Mengantre
                            </span>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={(e) => handleEditDraft(draft, e)}
                                className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                                title="Edit draf di form"
                                aria-label="Edit draf"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>

                              <button
                                type="button"
                                onClick={(e) => handleDeleteItem(draft.id, e)}
                                disabled={bulkState.isActive}
                                className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer disabled:opacity-40"
                                title="Hapus draf"
                                aria-label="Hapus draf"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Expanded Details Section (Plain text, comma separated) */}
                      {isExpanded && (
                        <div className="pt-2.5 mt-2.5 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-sans">
                          {/* CC & Subjek or Subjek */}
                          {(() => {
                            const ccEmails = draft.ccEmail
                              ? draft.ccEmail.split(/[,;]+/).map((e) => e.trim()).filter(Boolean)
                              : [];
                            const hasCc = ccEmails.length > 0;

                            return (
                              <div>
                                <div className="font-bold text-slate-900 dark:text-slate-100">
                                  {hasCc ? 'CC & Subjek' : 'Subjek'}
                                </div>
                                <div className="text-slate-600 dark:text-slate-400 font-normal space-y-0.5">
                                  {ccEmails.map((cc, idx) => (
                                    <div key={idx}>{cc}</div>
                                  ))}
                                  <div>{draft.subject || 'Lamaran Pekerjaan'}</div>
                                </div>
                              </div>
                            );
                          })()}

                          {/* CV ATS Preset */}
                          <div>
                            <div className="font-bold text-slate-900 dark:text-slate-100">CV ATS Preset</div>
                            <div className="text-slate-600 dark:text-slate-400 font-normal">
                              {draft.language || 'in'}, {get3LetterPresetCode(draft.presetKey)}, {getDesignLabelLower(draft.cvDesignPreset)}, {draft.cvHeaderColor || '#0062E3'}, {draft.cvTextAlign === 'justify' ? 'kanan-kiri' : 'kiri'}
                            </div>
                          </div>

                          {/* Identitas | Akademik | Portofolio | Sertifikasi | Tambahan (Sebaris 5 Kolom Rata Tengah) */}
                          <div className="grid grid-cols-5 gap-1 pt-0.5 text-center">
                            <div className="text-center">
                              <div className="font-bold text-slate-900 dark:text-slate-100 truncate text-center">Identitas</div>
                              <div
                                className="text-slate-600 dark:text-slate-400 font-normal truncate text-center"
                                title={
                                  draft.selectedIdentityIds && draft.selectedIdentityIds.length > 0
                                    ? `${draft.selectedIdentityIds.length} Dokumen (${draft.isIdentityColorPrint ? 'Berwarna' : 'Hitam Putih / BW'}, Cetak Foto: ${draft.isIdentitySeparatePhotoPrint ? 'Dipisah' : 'Digabung'})`
                                    : 'Tidak ada dokumen identitas dilampirkan'
                                }
                              >
                                {draft.selectedIdentityIds && draft.selectedIdentityIds.length > 0
                                  ? `${draft.selectedIdentityIds.length} Dok (${draft.isIdentityColorPrint ? 'Warna' : 'BW'}, ${draft.isIdentitySeparatePhotoPrint ? 'Pisah' : 'Gabung'})`
                                  : '0 Dok'}
                              </div>
                            </div>
                            <div className="border-l border-slate-200 dark:border-slate-800 text-center">
                              <div className="font-bold text-slate-900 dark:text-slate-100 truncate text-center">Akademik</div>
                              <div
                                className="text-slate-600 dark:text-slate-400 font-normal truncate text-center"
                                title={
                                  draft.selectedAcademicIds && draft.selectedAcademicIds.length > 0
                                    ? `${draft.selectedAcademicIds.length} Dokumen (${draft.isColorPrint ? 'Berwarna' : 'Hitam Putih / BW'})`
                                    : 'Tidak ada dokumen akademik'
                                }
                              >
                                {draft.selectedAcademicIds && draft.selectedAcademicIds.length > 0
                                  ? `${draft.selectedAcademicIds.length} Dok (${draft.isColorPrint ? 'Warna' : 'BW'})`
                                  : '0 Dok'}
                              </div>
                            </div>
                            <div className="border-l border-slate-200 dark:border-slate-800 text-center">
                              <div className="font-bold text-slate-900 dark:text-slate-100 truncate text-center">Portofolio</div>
                              <div
                                className="text-slate-600 dark:text-slate-400 font-normal truncate text-center"
                                title={
                                  draft.selectedPortfolioSlideIds && draft.selectedPortfolioSlideIds.length > 0
                                    ? `${draft.selectedPortfolioSlideIds.length} Slide (${draft.isPortfolioCompressed ? 'Kompresi ≤1MB' : 'Kualitas Penuh'})`
                                    : 'Tidak ada portofolio dilampirkan'
                                }
                              >
                                {draft.selectedPortfolioSlideIds && draft.selectedPortfolioSlideIds.length > 0
                                  ? `${draft.selectedPortfolioSlideIds.length} Slide (${draft.isPortfolioCompressed ? 'Kompresi' : 'Penuh'})`
                                  : '0 Dok'}
                              </div>
                            </div>
                            <div className="border-l border-slate-200 dark:border-slate-800 text-center">
                              <div className="font-bold text-slate-900 dark:text-slate-100 truncate text-center">Sertifikasi</div>
                              <div className="text-slate-600 dark:text-slate-400 font-normal truncate text-center">
                                {draft.selectedCertIds ? `${draft.selectedCertIds.length} Dok` : '0 Dok'}
                              </div>
                            </div>
                            <div className="border-l border-slate-200 dark:border-slate-800 text-center">
                              <div className="font-bold text-slate-900 dark:text-slate-100 truncate text-center">Tambahan</div>
                              <div className="text-slate-600 dark:text-slate-400 font-normal truncate text-center">
                                {draft.customAttachmentNames ? `${draft.customAttachmentNames.length} Dok` : '0 Dok'}
                              </div>
                            </div>
                          </div>

                          {/* Error message if failed */}
                          {isFailed && draft.lastError && (
                            <div className="flex items-center gap-1.5 text-xs text-rose-700 dark:text-rose-300 bg-rose-100/70 dark:bg-rose-950/50 p-1.5 rounded-md font-medium border border-rose-200 dark:border-rose-900">
                              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                              <span className="truncate">{draft.lastError}</span>
                            </div>
                          )}

                          {/* Sent timestamp */}
                          {isSent && draft.sentAt && (
                            <div className="flex items-center gap-1 text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                              <span>
                                Terkirim {new Date(draft.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                {draft.sentByEmail ? ` via ${draft.sentByEmail}` : ''}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Sticky Bottom Action Bar (Hanya tampil jika ada draf) */}
            {drafts.length > 0 && (
              <div className="px-4 py-3 sm:px-5 bg-slate-50 dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800 shrink-0 relative z-30">
                {bulkState.isActive ? (
                  /* Active Bulk Sending Controller */
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200">
                        <RotateCw className="w-3.5 h-3.5 animate-spin text-blue-600 dark:text-blue-400" />
                        <span>
                          Mengirim {bulkState.currentIndex} dari {bulkState.total} draf...
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-400">
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium">{bulkState.successCount} Sukses</span>
                        <span>•</span>
                        <span className="text-rose-600 dark:text-rose-400 font-medium">{bulkState.failedCount} Gagal</span>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full bg-slate-200/80 dark:bg-slate-800 rounded-full h-2 overflow-hidden shadow-inner">
                      <div
                        className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min(100, Math.round((bulkState.currentIndex / bulkState.total) * 100))}%`,
                        }}
                      />
                    </div>

                    {/* Status current item & controls */}
                    <div className="flex items-center justify-between gap-2 text-xs pt-0.5">
                      <div className="truncate text-slate-700 dark:text-slate-300 font-medium">
                        {bulkState.countdownSeconds > 0 ? (
                          <span className="inline-flex items-center gap-1.5 text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md border border-amber-200/60 dark:border-amber-800">
                            <Clock className="w-3.5 h-3.5 animate-pulse" />
                            Jeda: <strong>{bulkState.countdownSeconds} detik</strong>
                          </span>
                        ) : (
                          <span className="text-blue-700 dark:text-blue-400 truncate block">
                            Target: {bulkState.currentDraftName}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {bulkState.isPaused ? (
                          <button
                            type="button"
                            onClick={handleResumeBulk}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/50 hover:bg-emerald-200 dark:hover:bg-emerald-900 rounded-lg cursor-pointer"
                          >
                            <Play className="w-3 h-3 fill-emerald-700 dark:fill-emerald-300" />
                            Lanjutkan
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={handlePauseBulk}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/50 hover:bg-amber-200 dark:hover:bg-amber-900 rounded-lg cursor-pointer"
                          >
                            <Pause className="w-3 h-3" />
                            Jeda
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={handleCancelBulk}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-950/50 hover:bg-rose-200 dark:hover:bg-rose-900 rounded-lg cursor-pointer"
                        >
                          <StopCircle className="w-3 h-3" />
                          Hentikan
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Sticky Bottom Action Controls: Jeda Select & Kirim Semua */
                  <div className="flex items-center gap-2 w-full">
                    {/* Tempo delay select */}
                    <div className="flex-1 h-10 flex items-center justify-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 px-3 rounded-xl border border-slate-300 dark:border-slate-700 shadow-2xs min-w-0">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-semibold text-slate-700 dark:text-slate-300 shrink-0">Jeda:</span>
                      <select
                        value={delaySeconds}
                        onChange={(e) => handleDelayChange(parseInt(e.target.value, 10))}
                        className="bg-transparent font-bold text-slate-800 dark:text-slate-100 dark:bg-slate-800 outline-none cursor-pointer text-xs min-w-0 truncate"
                      >
                        <option value={5} className="dark:bg-slate-800">5 detik</option>
                        <option value={8} className="dark:bg-slate-800">8 detik</option>
                        <option value={10} className="dark:bg-slate-800">10 detik</option>
                        <option value={15} className="dark:bg-slate-800">15 detik</option>
                      </select>
                    </div>

                    {/* Start Bulk Send Button */}
                    <button
                      type="button"
                      onClick={handleStartBulkSend}
                      disabled={pendingDraftsCount === 0}
                      className="flex-1 h-10 inline-flex items-center justify-center gap-1.5 px-3 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all rounded-xl shadow-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed min-w-0 truncate"
                    >
                      <Send className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">Kirim Semua ({pendingDraftsCount})</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const JobDraftsModal = JobDraftsContainer;
