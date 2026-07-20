import { ApiService } from '../../../services/api';
import React, { useState, useEffect } from 'react';
import { PDFDocument } from 'pdf-lib';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Briefcase,
  CheckCircle2,
  Clock3,
  Play,
  Send,
  X
} from 'lucide-react';
import { JobApplication } from './tracker/EmbeddedLetterPreview';
import { TrackerStats } from './tracker/TrackerStats';
import { TrackerItem } from './tracker/TrackerItem';

export type { JobApplication };

export default function Tracker({ 
  type = 'status', 
  onSendBulk, 
  isBulkSending,
  onCancelSend,
  onEditDraft
}: { 
  type?: 'draft' | 'tracker' | 'status', 
  onSendBulk?: () => void, 
  isBulkSending?: boolean,
  onCancelSend?: () => void,
  onEditDraft?: (job: JobApplication) => void
}) {
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'terkirim' | 'draft'>('draft');
  const [sendingDraftId, setSendingDraftId] = useState<string | null>(null);
  const abortControllerRef = React.useRef<AbortController | null>(null);

  useEffect(() => {
    fetchJobs(true);
  }, []);

  const handleSendSingleDraft = async (job: JobApplication) => {
    if (!window.confirm(`Apakah Anda yakin ingin mengirim lamaran "${job.positionName}" ke ${getJobEmail(job)} secara nyata sekarang?`)) {
      return;
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;
    setSendingDraftId(job.id);

    try {
      if (controller.signal.aborted) throw new DOMException('Aborted', 'AbortError');

      const formData = new FormData();
      formData.append('targetEmail', getJobEmail(job));
      formData.append('subject', job.subject || `Lamaran Pekerjaan - ${job.positionName} - Alvareza Hilka Pratama`);
      formData.append('body', job.body);
      formData.append('bodyFontFamily', job.bodyFontFamily || 'Arial, sans-serif');

      const attachmentsList = parseAttachments(job.attachedFiles);
      
      const docMap: Record<string, { url: string; name: string }> = {
        'CV': { url: '/pdf/cv.pdf', name: 'CV_Alvareza_Hilka_Pratama.pdf' },
        'Curriculum Vitae': { url: '/pdf/cv.pdf', name: 'CV_Alvareza_Hilka_Pratama.pdf' },
        'Paklaring': { url: '/pdf/paklaring.pdf', name: 'Paklaring_Alvareza_Hilka_Pratama.pdf' },
        'Sertifikat': { url: '/pdf/sertifikat.pdf', name: 'Sertifikat_Alvareza_Hilka_Pratama.pdf' },
        'Ijazah': { url: '/pdf/ijazah.pdf', name: 'Ijazah_Alvareza_Hilka_Pratama.pdf' }
      };

      const gatheredAttachments: { blob: Blob, filename: string }[] = [];
      for (const att of attachmentsList) {
        if (controller.signal.aborted) throw new DOMException('Aborted', 'AbortError');
        const match = docMap[att] || docMap[att.trim()];
        if (match) {
          try {
            const defaultRes = await fetch(match.url, { signal: controller.signal });
            if (defaultRes.ok) {
              const blob = await defaultRes.blob();
              gatheredAttachments.push({ blob, filename: match.name });
            }
          } catch (e: any) {
            if (e.name === 'AbortError') throw e;
            console.error(`Gagal mengambil berkas lampiran ${att}:`, e);
          }
        }
      }

      if (controller.signal.aborted) throw new DOMException('Aborted', 'AbortError');

      if (job.mergeAttachments && gatheredAttachments.length > 0) {
        try {
          const mergedPdf = await PDFDocument.create();
          for (const item of gatheredAttachments) {
            if (controller.signal.aborted) throw new DOMException('Aborted', 'AbortError');
            if (item.blob.type === 'application/pdf' || item.filename.toLowerCase().endsWith('.pdf')) {
              const arrayBuffer = await item.blob.arrayBuffer();
              const pdf = await PDFDocument.load(arrayBuffer);
              const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
              copiedPages.forEach((page) => {
                mergedPdf.addPage(page);
              });
            }
          }
          if (controller.signal.aborted) throw new DOMException('Aborted', 'AbortError');
          const mergedPdfBytes = await mergedPdf.save();
          const mergedBlob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
          formData.append('attachments', mergedBlob, 'berkas_alvareza.pdf');
        } catch (e: any) {
          if (e.name === 'AbortError') throw e;
          console.error("Gagal menggabungkan PDF:", e);
          for (const item of gatheredAttachments) {
            formData.append('attachments', item.blob, item.filename);
          }
        }
      } else {
        for (const item of gatheredAttachments) {
          formData.append('attachments', item.blob, item.filename);
        }
      }

      if (controller.signal.aborted) throw new DOMException('Aborted', 'AbortError');

      const response = await fetch('/api/send-email', {
        method: 'POST',
        body: formData,
        signal: controller.signal
      });

      const textData = await response.text();
      let resData: any = {};
      try {
        resData = textData ? JSON.parse(textData) : {};
      } catch (e) {
        console.error("Response is not JSON in Tracker:", textData);
        if (!response.ok) {
          throw new Error(`Gagal mengirim email (Server Error ${response.status}): ${textData.substring(0, 150) || 'Unknown server error'}`);
        } else {
          resData = { message: "Email berhasil terkirim!" };
        }
      }

      if (!response.ok) {
        throw new Error(resData.error || 'Gagal mengirim email');
      }

      // Success! Update status in server DB
      // 1. Delete draft
      await ApiService.delete('email-sender', { body: JSON.stringify({ id: job.id }) });

      // 2. Insert as sent
      const sentJob: JobApplication = {
        ...job,
        id: `job-${Date.now()}`,
        status: 'terkirim',
        createdAt: new Date().toISOString()
      };
      await ApiService.post('email-sender', sentJob);

      // 3. Update React local state
      setJobs(prev => prev.filter(j => j.id !== job.id).concat(sentJob));
      setViewMode('terkirim');
      await fetchJobs(false);
      alert('Email lamaran pekerjaan berhasil terkirim secara nyata!');
    } catch (err: any) {
      if (err.name === 'AbortError') {
        alert('Pengiriman email dibatalkan.');
      } else {
        console.error(err);
        alert(`Gagal mengirim email secara nyata: ${err.message || err}.`);
      }
    } finally {
      setSendingDraftId(null);
      abortControllerRef.current = null;
    }
  };

  const handleCancelSingleSend = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setSendingDraftId(null);
  };

  const fetchJobs = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const res = await ApiService.get<JobApplication[]>('email-sender');
      if (res.success && res.data) {
        setJobs(res.data);
      }
    } catch (err) {
      console.error('Failed to load job applications:', err);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const getJobEmail = (job: JobApplication) => {
    if (job.targetEmail) return job.targetEmail;
    if (job.id === 'job-1') return 'hrd@konicaminolta.co.id';
    if (job.id === 'job-2') return 'recruitment@shopee.co.id';
    if (job.id === 'job-3') return 'kerjasama@jabarprov.go.id';
    if (job.id === 'job-4') return 'dutagenre@purwakartakab.go.id';
    return 'hrd@company.co.id';
  };

  const getJobAddressedTo = (job: JobApplication) => {
    if (job.addressedTo) return job.addressedTo;
    if (job.id === 'job-1') return 'Bapak Rian Hermawan (HR Manager)';
    if (job.id === 'job-2') return 'Ibu Shinta Bella (Talent Acquisition Specialist)';
    if (job.id === 'job-3') return 'Bapak Dr. H. Setiawan Wangsaatmaja (Sekretaris Daerah Jabar)';
    if (job.id === 'job-4') return 'Ibu Dra. H. Yayat Hidayat (Kepala DPPKB Purwakarta)';
    return 'Bapak/Ibu HRD';
  };

  const handleDeleteJob = async (jobId: string) => {
    const job = (jobs || []).find(j => j.id === jobId);
    const isDraft = job?.status === 'draft';

    if (isDraft || window.confirm('Apakah Anda yakin ingin menghapus data pelacakan lamaran ini?')) {
      if (expandedJobId === jobId) setExpandedJobId(null);
      
      try {
        // Optimistic Update: Remove immediately
        setJobs(prev => prev.filter(j => j.id !== jobId));
        
        const response = await ApiService.delete('email-sender', { body: JSON.stringify({ id: jobId }) });
        if (!response.success) {
           throw new Error(response.message || "Failed to delete");
        }
      } catch (err: any) {
        console.error("Gagal menghapus:", err);
        alert('Gagal menghapus data: ' + (err.message || err));
      } finally {
        await fetchJobs(false); // Sinkronisasi ulang dengan worker secara realtime
      }
    }
  };

  // Helper to format date with time beautifully
  const formatDateTime = (dateString: string) => {
    try {
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return dateString;
      
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
      const dateFormatted = `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
      
      const hasTime = dateString.includes(':') || dateString.includes('T');
      if (hasTime) {
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        return `${dateFormatted} - ${hours}:${minutes}`;
      }
      return dateFormatted;
    } catch (e) {
      return dateString;
    }
  };

  function parseAttachments(attachmentsVal: any): string[] {
    if (!attachmentsVal) return [];
    if (Array.isArray(attachmentsVal)) return attachmentsVal;
    if (typeof attachmentsVal === 'string') {
      try {
        if (attachmentsVal.includes(',') && !attachmentsVal.startsWith('[')) {
          return attachmentsVal.split(',').map((s: string) => s.trim());
        }
        const parsed = JSON.parse(attachmentsVal);
        return Array.isArray(parsed) ? parsed : [attachmentsVal];
      } catch (e) {
        return attachmentsVal.split(',').map((s: string) => s.trim());
      }
    }
    return [];
  }

  // Stats calculation
  const totalTerkirim = (jobs || []).filter(j => j.status === 'terkirim').length;
  const totalDrafts = (jobs || []).filter(j => j.status === 'draft').length;

  // Filter & Search
  const filteredJobs = (jobs || []).filter(job => {
    if (viewMode === 'draft' && job.status !== 'draft') return false;
    if (viewMode === 'terkirim' && job.status !== 'terkirim') return false;

    const query = searchTerm.toLowerCase();
    const company = job.companyName?.toLowerCase() || '';
    const position = job.positionName?.toLowerCase() || '';
    const email = getJobEmail(job).toLowerCase();
    const addressedTo = getJobAddressedTo(job).toLowerCase();
    const matchesSearch = company.includes(query) || position.includes(query) || email.includes(query) || addressedTo.includes(query);
    
    return matchesSearch;
  });

  return (
    <div id="admin-tracker-page" className="space-y-8 text-left">
      {/* Mini Stats Row */}
      <TrackerStats 
        totalJobs={(jobs || []).length} 
        totalTerkirim={totalTerkirim} 
        totalDrafts={totalDrafts} 
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        {/* Left Side: Toggle Options and Kirim Semua button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          {/* Toggle Selector Option */}
          <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-full sm:w-auto border border-slate-200/50 dark:border-slate-700/50 shrink-0">
            <button
              type="button"
              onClick={() => setViewMode('draft')}
              className={`flex-1 sm:flex-initial whitespace-nowrap px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-2 ${
                viewMode === 'draft'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <Clock3 className={`w-4 h-4 ${viewMode === 'draft' ? 'text-amber-500' : 'text-slate-400'}`} />
              <span>Draft Email</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('terkirim')}
              className={`flex-1 sm:flex-initial whitespace-nowrap px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-2 ${
                viewMode === 'terkirim'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <CheckCircle2 className={`w-4 h-4 ${viewMode === 'terkirim' ? 'text-emerald-500' : 'text-slate-400'}`} />
              <span>Lamaran Terkirim</span>
            </button>
          </div>

          {/* Kirim Semua Button directly on the right of Toggle Selector */}
          {viewMode === 'draft' && onSendBulk && (
            <div className="flex items-center gap-2">
              {isBulkSending ? (
                <button
                  type="button"
                  onClick={onCancelSend}
                  className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer shrink-0 h-[38px] sm:h-auto animate-pulse"
                >
                  <X className="w-4 h-4" />
                  <span>Batalkan (Mengirim...)</span>
                </button>
              ) : (
                (jobs || []).filter(j => j.status === 'draft').length > 0 && (
                  <button
                    type="button"
                    onClick={onSendBulk}
                    className="px-4 py-2 bg-accent hover:bg-accent/90 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer shrink-0 h-[38px] sm:h-auto"
                  >
                    <Play className="w-4 h-4" />
                    <span>Kirim Semua ({(jobs || []).filter(j => j.status === 'draft').length})</span>
                  </button>
                )
              )}
            </div>
          )}
        </div>

        {/* Right Side: Searchbar (stretches to the left) */}
        <div className="flex-grow flex justify-end w-full md:w-auto">
          <div className="relative w-full md:max-w-md lg:max-w-lg">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder={viewMode === 'draft' ? "Cari draft..." : "Cari lamaran..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none text-[#1e293b] dark:text-[#f8fafc] shadow-sm transition-all"
            />
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-20 text-center text-slate-400">
            <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="font-semibold text-xs">Memuat data pelacak lamaran...</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-12 text-center text-slate-400 dark:text-slate-500 shadow-sm">
            <Briefcase className="w-12 h-12 text-slate-200 dark:text-slate-800 mx-auto mb-3 animate-pulse" />
            <p className="font-semibold text-slate-600 dark:text-slate-400 text-sm">Tidak ada lamaran yang ditemukan</p>
            <p className="text-slate-400 dark:text-slate-600 text-xs mt-1">Sesuaikan kata kunci pencarian atau gunakan Email Dispatcher untuk mengirim lamaran.</p>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {(filteredJobs || []).map((job) => (
              <TrackerItem
                key={job.id}
                job={job}
                isExpanded={expandedJobId === job.id}
                onToggleExpand={() => setExpandedJobId(expandedJobId === job.id ? null : job.id)}
                sendingDraftId={sendingDraftId}
                onDeleteJob={handleDeleteJob}
                onEditDraft={onEditDraft}
                handleSendSingleDraft={handleSendSingleDraft}
                onCancelSingleSend={handleCancelSingleSend}
                getJobEmail={getJobEmail}
                getJobAddressedTo={getJobAddressedTo}
                formatDateTime={formatDateTime}
                parseAttachments={parseAttachments}
              />
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
