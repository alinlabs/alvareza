import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building, 
  Mail, 
  Clock, 
  Trash2, 
  Edit2, 
  Loader2, 
  Send, 
  ChevronUp, 
  ChevronDown, 
  Paperclip 
} from 'lucide-react';
import { JobApplication, EmbeddedLetterPreview } from './EmbeddedLetterPreview';

interface TrackerItemProps {
  key?: React.Key;
  job: JobApplication;
  isExpanded: boolean;
  onToggleExpand: () => void;
  sendingDraftId: string | null;
  onDeleteJob: (id: string) => Promise<void>;
  onEditDraft?: (job: JobApplication) => void;
  handleSendSingleDraft: (job: JobApplication) => Promise<void>;
  onCancelSingleSend?: () => void;
  getJobEmail: (job: JobApplication) => string;
  getJobAddressedTo: (job: JobApplication) => string;
  formatDateTime: (dateString: string) => string;
  parseAttachments: (attachmentsVal: any) => string[];
}

export const TrackerItem = React.forwardRef<HTMLDivElement, TrackerItemProps>(({
  job,
  isExpanded,
  onToggleExpand,
  sendingDraftId,
  onDeleteJob,
  onEditDraft,
  handleSendSingleDraft,
  onCancelSingleSend,
  getJobEmail,
  getJobAddressedTo,
  formatDateTime,
  parseAttachments
}, ref) => {
  const attachmentsList = parseAttachments(job.attachedFiles);
  const formattedDate = formatDateTime(job.createdAt);

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/70 hover:border-slate-200 dark:hover:border-slate-750 rounded-2xl shadow-sm transition-all overflow-hidden"
    >
      {/* Main Card Header */}
      <div className="p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Job Info */}
        <div className="flex-grow space-y-2 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center text-[10px] text-slate-400 dark:text-slate-500 font-extrabold tracking-wider uppercase bg-slate-50 dark:bg-slate-950 px-2.5 py-1 rounded-md border border-slate-100 dark:border-slate-850">
              <Building className="w-3 h-3 mr-1" />
              {job.companyName}
            </span>
          </div>

          <h3 className="text-base font-black text-slate-800 dark:text-slate-100 leading-snug">
            {job.positionName}
          </h3>

          {/* Meta Row: Email, Date */}
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[11px] text-slate-500 dark:text-slate-400 font-semibold pt-1">
            <span className="flex items-center">
              <Mail className="w-3.5 h-3.5 text-slate-400 mr-1 shrink-0" />
              {getJobEmail(job)}
            </span>
            <span className="flex items-center">
              <Clock className="w-3.5 h-3.5 text-slate-400 mr-1 shrink-0" />
              Waktu: <strong className="ml-1 text-slate-700 dark:text-slate-300 font-sans font-bold">{formattedDate}</strong>
            </span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
          {job.status === 'draft' ? (
            <>
              {/* Hapus */}
              <button
                type="button"
                onClick={() => onDeleteJob(job.id)}
                className="p-2.5 text-slate-400 hover:text-rose-500 dark:text-slate-600 dark:hover:text-rose-400 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-rose-100 dark:hover:border-rose-950/40 rounded-xl transition-all cursor-pointer flex items-center justify-center"
                title="Hapus draft"
                disabled={sendingDraftId === job.id}
              >
                <Trash2 className="w-4 h-4" />
              </button>

              {/* Edit */}
              {onEditDraft && (
                <button
                  type="button"
                  onClick={() => onEditDraft(job)}
                  className="p-2.5 bg-amber-50/10 hover:bg-amber-55/20 border border-amber-500/20 text-amber-600 dark:text-amber-400 rounded-xl transition-all cursor-pointer flex items-center justify-center"
                  title="Edit Draft"
                  disabled={sendingDraftId === job.id}
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              )}

              {/* Kirim */}
              {sendingDraftId === job.id ? (
                <button
                  type="button"
                  onClick={() => {
                    if (onCancelSingleSend) onCancelSingleSend();
                  }}
                  className="px-3.5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                  title="Batalkan pengiriman"
                >
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Batal</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSendSingleDraft(job)}
                  disabled={sendingDraftId !== null}
                  className="px-3.5 py-2.5 bg-accent hover:bg-accent/90 text-white font-bold rounded-xl text-xs transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50 shadow-sm"
                  title="Kirim email secara nyata"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim</span>
                </button>
              )}

              {/* Dropdown Toggle */}
              <button
                type="button"
                onClick={onToggleExpand}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
                  isExpanded 
                    ? 'bg-accent/10 border-accent/20 text-accent' 
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-450 hover:bg-slate-100 dark:hover:bg-slate-900'
                }`}
                title={isExpanded ? 'Tutup Detail' : 'Lihat Detail Lengkap'}
              >
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </>
          ) : (
            <>
              {/* Hapus */}
              <button
                type="button"
                onClick={() => onDeleteJob(job.id)}
                className="p-2.5 text-slate-400 hover:text-rose-500 dark:text-slate-600 dark:hover:text-rose-400 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-rose-100 dark:hover:border-rose-950/40 rounded-xl transition-all cursor-pointer flex items-center justify-center"
                title="Hapus data pelacakan"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              
              {/* Edit */}
              {onEditDraft && (
                <button
                  type="button"
                  onClick={() => onEditDraft(job)}
                  className="p-2.5 bg-amber-50/10 hover:bg-amber-55/20 border border-amber-500/20 text-amber-600 dark:text-amber-400 rounded-xl transition-all cursor-pointer flex items-center justify-center"
                  title="Edit Data"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              )}

              {/* Dropdown Toggle */}
              <button
                type="button"
                onClick={onToggleExpand}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
                  isExpanded 
                    ? 'bg-accent/10 border-accent/20 text-accent' 
                    : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-450 hover:bg-slate-100 dark:hover:bg-slate-900'
                }`}
                title={isExpanded ? 'Tutup Detail' : 'Lihat Detail Lengkap'}
              >
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Collapsible Expanded Details */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="border-t border-slate-100 dark:border-slate-850 bg-slate-50/40 dark:bg-slate-950/20 overflow-hidden"
          >
            <div className="p-5 md:p-6 space-y-6 text-xs">
              {/* Detail Yang Dikirim (Subject, Recipient, & Attachments) */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  {/* Subject */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">Subjek Email:</span>
                    <p className="font-sans text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-2 rounded-xl font-semibold overflow-x-auto text-[11px]">
                      {job.subject || `Lamaran Pekerjaan - ${job.positionName} - Alvareza Hilka Pratama`}
                    </p>
                  </div>

                  {/* Penerima */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">Penerima (Ditujukan Kepada):</span>
                    <p className="text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-2 rounded-xl font-bold text-[11px]">
                      {getJobAddressedTo(job)}
                    </p>
                  </div>
                </div>

                {/* Attachments Checklist */}
                <div className="space-y-1.5 text-left">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">Berkas Lampiran yang Dikirim:</span>
                  <div className="flex flex-wrap gap-2 pt-0.5">
                    {attachmentsList.length > 0 ? (
                      attachmentsList.map((att, idx) => (
                        <span key={idx} className="inline-flex items-center bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-xl font-semibold text-[10px]">
                          <Paperclip className="w-3 h-3 mr-1.5 text-accent" />
                          {att}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400 italic text-[11px]">Tidak ada lampiran dokumen</span>
                    )}
                  </div>
                </div>
              </div>

              {/* High Fidelity Embedded Letter Preview & Mode Toggles */}
              {job.body && (
                <EmbeddedLetterPreview job={job} />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});
