import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
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
  ShieldCheck,
  Building2,
  Briefcase,
  Mail,
  Sparkles,
  User,
  LayoutTemplate,
  AlignLeft,
  AlignJustify,
} from 'lucide-react';
import { JobApplicationDraftItem } from '../../types/jobDraft';
import { JobDraftService } from '../../services/jobDraftService';
import { ALL_ROLE_PRESETS } from '../../data/rolePresetsConfig';
import { useBulkDraftSender } from '../../hooks/useBulkDraftSender';

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

interface JobDraftsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectForEdit?: (draft: JobApplicationDraftItem) => void;
  highlightDraftId?: string | null;
}

export const JobDraftsModal: React.FC<JobDraftsModalProps> = ({
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

  useEffect(() => {
    if (isOpen) {
      setDrafts(JobDraftService.getDrafts());
      setDelaySeconds(JobDraftService.getBulkDelaySeconds());
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
          className="fixed inset-0 z-50 bg-slate-950/10 backdrop-blur-md flex flex-col justify-end md:justify-center md:items-center p-0 md:p-4 pt-[60px] md:pt-0 overflow-hidden"
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
            className="w-full md:max-w-2xl bg-white text-slate-800 rounded-t-3xl md:rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[calc(100vh-60px)] md:max-h-[88vh] overflow-hidden"
          >
            {/* Header */}
            <div className="px-4 py-3.5 sm:px-5 sm:py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/90 shrink-0">
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="sm:hidden p-1.5 -ml-1.5 text-slate-500 hover:text-slate-800 rounded-lg"
                  aria-label="Kembali"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-tight">
                    Draft Lamaran
                  </h3>
                  <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full min-w-[22px] text-center">
                    {drafts.length}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {drafts.length > 0 && !bulkState.isActive && (
                  <button
                    type="button"
                    onClick={handleClearAll}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
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
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-40 cursor-pointer"
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
                  <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner">
                    <FileText className="w-7 h-7" />
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-slate-800">
                    Belum Ada Draf Lamaran
                  </h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1.5 leading-relaxed">
                    Ketik atau pindai lowongan di modal lamar kerja, lalu klik tombol{' '}
                    <strong className="text-blue-600">Draft</strong> di sebelah kiri tombol kirim untuk menyimpan lamaran ke dalam daftar ini.
                  </p>
                </div>
              ) : (
                drafts.map((draft) => {
                  const isSendingThis = sendingDraftId === draft.id || (bulkState.isActive && bulkState.currentDraftId === draft.id);
                  const isQueued = bulkState.isActive && draft.status === 'queued';
                  const isSent = draft.status === 'sent';
                  const isFailed = draft.status === 'failed';
                  const isHighlighted = highlightDraftId === draft.id;
                  const isExpanded = Boolean(expandedDraftIds[draft.id]);

                  return (
                    <div
                      key={draft.id}
                      id={`draft-card-${draft.id}`}
                      onClick={(e) => toggleExpandDraft(draft.id, e)}
                      className={`group p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer relative ${
                        isSendingThis
                          ? 'border-blue-500 bg-blue-50/60 ring-2 ring-blue-400'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-2xs'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        {/* Initial Clean Stacked Header View (ONLY Company, Position, Email) */}
                        <div className="space-y-0.5 flex-1 min-w-0 select-none">
                          <div className="font-bold text-slate-900 text-sm sm:text-base leading-snug truncate">
                            {draft.companyName || 'Perusahaan Tujuan'}
                          </div>
                          <div className="text-xs font-semibold text-blue-700 leading-snug truncate">
                            {draft.jobTitle || 'Posisi Dilamar'}
                          </div>
                          <div className="text-xs font-medium text-slate-600 leading-snug truncate">
                            {draft.recipientEmail || 'Belum ada email'}
                          </div>
                        </div>

                        {/* Right Action: Edit & Delete Buttons */}
                        <div className="flex items-center gap-1 shrink-0 pt-0.5">
                          {isSendingThis ? (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 bg-blue-100 px-2.5 py-1 rounded-lg animate-pulse">
                              <RotateCw className="w-3.5 h-3.5 animate-spin" />
                              Mengirim...
                            </span>
                          ) : isQueued ? (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-lg">
                              <Clock className="w-3.5 h-3.5" />
                              Mengantre
                            </span>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={(e) => handleEditDraft(draft, e)}
                                className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                                title="Edit draf di form"
                                aria-label="Edit draf"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>

                              <button
                                type="button"
                                onClick={(e) => handleDeleteItem(draft.id, e)}
                                disabled={bulkState.isActive}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer disabled:opacity-40"
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
                        <div className="pt-2.5 mt-2.5 border-t border-slate-100 space-y-2 text-xs text-slate-700 leading-relaxed font-sans">
                          {/* CC & Subjek or Subjek */}
                          {(() => {
                            const ccEmails = draft.ccEmail
                              ? draft.ccEmail.split(/[,;]+/).map((e) => e.trim()).filter(Boolean)
                              : [];
                            const hasCc = ccEmails.length > 0;

                            return (
                              <div>
                                <div className="font-bold text-slate-900">
                                  {hasCc ? 'CC & Subjek' : 'Subjek'}
                                </div>
                                <div className="text-slate-600 font-normal space-y-0.5">
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
                            <div className="font-bold text-slate-900">CV ATS Preset</div>
                            <div className="text-slate-600 font-normal">
                              {draft.language || 'id'}, {get3LetterPresetCode(draft.presetKey)}, {getDesignLabelLower(draft.cvDesignPreset)}, {draft.cvHeaderColor || '#0062E3'}, {draft.cvTextAlign === 'justify' ? 'kanan-kiri' : 'kiri'}
                            </div>
                          </div>

                          {/* Akademik | Portofolio | Sertifikasi | Tambahan (Sebaris 4 Kolom Rata Tengah) */}
                          <div className="grid grid-cols-4 gap-1.5 pt-0.5 text-center">
                            <div className="text-center">
                              <div className="font-bold text-slate-900 truncate text-center">Akademik</div>
                              <div className="text-slate-600 font-normal truncate text-center">
                                {draft.selectedAcademicIds ? draft.selectedAcademicIds.length : 0} Dok
                              </div>
                            </div>
                            <div className="border-l border-slate-200 text-center">
                              <div className="font-bold text-slate-900 truncate text-center">Portofolio</div>
                              <div className="text-slate-600 font-normal truncate text-center">
                                {draft.selectedPortfolioSlideIds ? draft.selectedPortfolioSlideIds.length : 0} Dok
                              </div>
                            </div>
                            <div className="border-l border-slate-200 text-center">
                              <div className="font-bold text-slate-900 truncate text-center">Sertifikasi</div>
                              <div className="text-slate-600 font-normal truncate text-center">
                                {draft.selectedCertIds ? draft.selectedCertIds.length : 0} Dok
                              </div>
                            </div>
                            <div className="border-l border-slate-200 text-center">
                              <div className="font-bold text-slate-900 truncate text-center">Tambahan</div>
                              <div className="text-slate-600 font-normal truncate text-center">
                                {draft.customAttachmentNames ? draft.customAttachmentNames.length : 0} Dok
                              </div>
                            </div>
                          </div>

                          {/* Error message if failed */}
                          {isFailed && draft.lastError && (
                            <div className="flex items-center gap-1.5 text-xs text-rose-700 bg-rose-100/70 p-1.5 rounded-md font-medium">
                              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                              <span className="truncate">{draft.lastError}</span>
                            </div>
                          )}

                          {/* Sent timestamp */}
                          {isSent && draft.sentAt && (
                            <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
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

            {/* Sticky Bottom Action Bar */}
            <div className="px-4 py-3 sm:px-5 bg-slate-50 border-t border-slate-200 shrink-0 relative z-30">
              {drafts.length > 0 ? (
                bulkState.isActive ? (
                  /* Active Bulk Sending Controller */
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 font-semibold text-slate-800">
                        <RotateCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
                        <span>
                          Mengirim {bulkState.currentIndex} dari {bulkState.total} draf...
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                        <span className="text-emerald-600 font-medium">{bulkState.successCount} Sukses</span>
                        <span>•</span>
                        <span className="text-rose-600 font-medium">{bulkState.failedCount} Gagal</span>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full bg-slate-200/80 rounded-full h-2 overflow-hidden shadow-inner">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min(100, Math.round((bulkState.currentIndex / bulkState.total) * 100))}%`,
                        }}
                      />
                    </div>

                    {/* Status current item & controls */}
                    <div className="flex items-center justify-between gap-2 text-xs pt-0.5">
                      <div className="truncate text-slate-700 font-medium">
                        {bulkState.countdownSeconds > 0 ? (
                          <span className="inline-flex items-center gap-1.5 text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                            <Clock className="w-3.5 h-3.5 animate-pulse" />
                            Jeda: <strong>{bulkState.countdownSeconds} detik</strong>
                          </span>
                        ) : (
                          <span className="text-blue-700 truncate block">
                            Target: {bulkState.currentDraftName}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {bulkState.isPaused ? (
                          <button
                            type="button"
                            onClick={handleResumeBulk}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 rounded-lg cursor-pointer"
                          >
                            <Play className="w-3 h-3 fill-emerald-700" />
                            Lanjutkan
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={handlePauseBulk}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-amber-700 bg-amber-100 hover:bg-amber-200 rounded-lg cursor-pointer"
                          >
                            <Pause className="w-3 h-3" />
                            Jeda
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={handleCancelBulk}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-rose-700 bg-rose-100 hover:bg-rose-200 rounded-lg cursor-pointer"
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
                    <div className="flex-1 h-10 flex items-center justify-center gap-1.5 text-xs text-slate-600 bg-white px-3 rounded-xl border border-slate-300 shadow-2xs min-w-0">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-semibold text-slate-700 shrink-0">Jeda:</span>
                      <select
                        value={delaySeconds}
                        onChange={(e) => handleDelayChange(parseInt(e.target.value, 10))}
                        className="bg-transparent font-bold text-slate-800 outline-none cursor-pointer text-xs min-w-0 truncate"
                      >
                        <option value={5}>5 detik</option>
                        <option value={8}>8 detik</option>
                        <option value={10}>10 detik</option>
                        <option value={15}>15 detik</option>
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
                )
              ) : (
                /* Footer Note for empty state */
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    Draf tersimpan di browser lokal Anda.
                  </span>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 hover:border-slate-300 rounded-lg shadow-2xs cursor-pointer"
                  >
                    Tutup
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
