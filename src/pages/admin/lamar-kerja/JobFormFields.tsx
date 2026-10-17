import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Copy, Check, ChevronDown, ChevronUp, AlertCircle, AlertTriangle } from 'lucide-react';
import { FormattedEmailBodyPreview } from './FormattedEmailBodyPreview';
import { GasSenderService } from '../../../services/gasSenderService';
import { JobDraftService } from '../../../services/jobDraftService';
import { matchPresetFromJobTitle } from '../../../data/preset/RoleConfig';
import { extractKeywordsFromJobText } from '../../../data/position-detektor';

interface JobFormFieldsProps {
  companyName: string;
  setCompanyName: (val: string) => void;
  jobTitle: string;
  setJobTitle: (val: string) => void;
  jobDesk?: string;
  setJobDesk?: (val: string) => void;
  kualifikasi?: string;
  setKualifikasi?: (val: string) => void;
  showJobDetailFields?: boolean;
  setShowJobDetailFields?: (val: boolean) => void;
  isPresetAuto: boolean;
  setIsPresetAuto: (val: boolean) => void;
  selectedCvPreset?: string;
  setSelectedCvPreset?: (val: string) => void;
  onPresetChangeWithDraft?: (newPreset: string) => void;
  recipientEmail: string;
  setRecipientEmail: (val: string) => void;
  ccEmail: string;
  setCcEmail: (val: string) => void;
  showCcField: boolean;
  setShowCcField: (val: boolean) => void;
  emailSubject: string;
  setEmailSubject: (val: string) => void;
  isSubjectAuto: boolean;
  setIsSubjectAuto: (val: boolean) => void;
  emailBody: string;
  isEmailBodyExpanded: boolean;
  setIsEmailBodyExpanded: (val: boolean) => void;
  copiedEmail: boolean;
  copiedCc: boolean;
  copiedSubject: boolean;
  copiedBody: boolean;
  handleCopy: (text: string, type: 'subject' | 'body' | 'all' | 'email' | 'cc' | 'phone') => void;
  activeDraftId?: string | null;
}

export const JobFormFields: React.FC<JobFormFieldsProps> = ({
  companyName,
  setCompanyName,
  jobTitle,
  setJobTitle,
  jobDesk,
  setJobDesk,
  kualifikasi,
  setKualifikasi,
  showJobDetailFields,
  setShowJobDetailFields,
  isPresetAuto,
  setIsPresetAuto,
  selectedCvPreset,
  setSelectedCvPreset,
  onPresetChangeWithDraft,
  recipientEmail,
  setRecipientEmail,
  ccEmail,
  setCcEmail,
  showCcField,
  setShowCcField,
  emailSubject,
  setEmailSubject,
  isSubjectAuto,
  setIsSubjectAuto,
  emailBody,
  isEmailBodyExpanded,
  setIsEmailBodyExpanded,
  copiedEmail,
  copiedCc,
  copiedSubject,
  copiedBody,
  handleCopy,
  activeDraftId,
}) => {
  const statusNotice = useMemo(() => {
    const cleanEmail = recipientEmail.trim().toLowerCase();
    const cleanTitle = jobTitle.trim().toLowerCase();

    if (!cleanEmail || !cleanTitle) return null;

    // 1. Cek Riwayat Pengiriman (History) terlebih dahulu
    try {
      const historyList = GasSenderService.getHistory();
      const inHistory = historyList.some((item) => {
        const itemEmail = (item.targetEmail || '').trim().toLowerCase();
        const itemTitle = (item.jobTitle || '').trim().toLowerCase();
        return itemEmail === cleanEmail && itemTitle === cleanTitle;
      });

      if (inHistory) {
        return {
          type: 'history' as const,
          text: 'Email sudah di kirim sebelumnya',
        };
      }
    } catch (e) {
      console.error('Error checking history status:', e);
    }

    // 2. Cek Daftar Draf (Drafts)
    try {
      const draftsList = JobDraftService.getDrafts();
      const inDrafts = draftsList.some((draft) => {
        if (activeDraftId && draft.id === activeDraftId) return false;
        const draftEmail = (draft.recipientEmail || '').trim().toLowerCase();
        const draftTitle = (draft.jobTitle || '').trim().toLowerCase();
        return draftEmail === cleanEmail && draftTitle === cleanTitle;
      });

      if (inDrafts) {
        return {
          type: 'draft' as const,
          text: 'Email Tujuan Sudah Tersimpan Dalam Draft',
        };
      }
    } catch (e) {
      console.error('Error checking draft status:', e);
    }

    return null;
  }, [recipientEmail, jobTitle, activeDraftId]);

  const [localJobDesk, setLocalJobDesk] = useState('');
  const [localKualifikasi, setLocalKualifikasi] = useState('');
  const [localShowDetail, setLocalShowDetail] = useState(false);

  const activeJobDesk = jobDesk !== undefined ? jobDesk : localJobDesk;
  const activeSetJobDesk = setJobDesk || setLocalJobDesk;
  const activeKualifikasi = kualifikasi !== undefined ? kualifikasi : localKualifikasi;
  const activeSetKualifikasi = setKualifikasi || setLocalKualifikasi;
  const activeShowDetail = showJobDetailFields !== undefined ? showJobDetailFields : localShowDetail;
  const activeSetShowDetail = setShowJobDetailFields || setLocalShowDetail;

  const jobDeskTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  const kualifikasiTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  const [showDeskBadges, setShowDeskBadges] = useState(false);
  const [showQualBadges, setShowQualBadges] = useState(false);

  const deskUniqueKeywords = useMemo(() => {
    if (!activeJobDesk || !activeJobDesk.trim()) return [];
    const parsed = extractKeywordsFromJobText(activeJobDesk);
    return Array.from(new Set(parsed.keywords));
  }, [activeJobDesk]);

  const qualUniqueKeywords = useMemo(() => {
    if (!activeKualifikasi || !activeKualifikasi.trim()) return [];
    const parsed = extractKeywordsFromJobText(activeKualifikasi);
    return Array.from(new Set(parsed.keywords));
  }, [activeKualifikasi]);

  const autoResize = (el: HTMLTextAreaElement | null) => {
    if (!el) return;
    el.style.height = 'auto';
    const newHeight = Math.min(el.scrollHeight, 104);
    el.style.height = `${Math.max(newHeight, 38)}px`;
  };

  useEffect(() => {
    if (activeShowDetail && !showDeskBadges) {
      autoResize(jobDeskTextareaRef.current);
    }
  }, [activeShowDetail, activeJobDesk, showDeskBadges]);

  useEffect(() => {
    if (activeShowDetail && !showQualBadges) {
      autoResize(kualifikasiTextareaRef.current);
    }
  }, [activeShowDetail, activeKualifikasi, showQualBadges]);

  const handleTriggerAutoPreset = (title: string, desk: string, qual: string) => {
    if (!isPresetAuto) return;
    if (title || desk || qual) {
      const matched = matchPresetFromJobTitle({
        jobTitle: title,
        jobDesk: desk,
        kualifikasi: qual,
      });
      if (matched?.key) {
        setSelectedCvPreset?.(matched.key);
        onPresetChangeWithDraft?.(matched.key);
      }
    }
  };

  return (
    <>
      {/* Row 1: Nama Perusahaan & Posisi */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* Kolom 1: Nama Perusahaan */}
        <div>
          <label htmlFor="company-name-input" className="block text-xs font-bold text-slate-900 mb-1.5">
            Nama Perusahaan
          </label>
          <input
            id="company-name-input"
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full h-10 px-3.5 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs hover:border-slate-400 transition-all"
          />
        </div>

        {/* Kolom 2: Posisi yang Dilamar dengan Seekbar Detail */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="job-title-input" className="block text-xs font-bold text-slate-900">
              Posisi yang Dilamar
            </label>

            {/* Seekbar / Toggle Switch: Detail */}
            <div
              onClick={() => activeSetShowDetail(!activeShowDetail)}
              className="flex items-center gap-1.5 cursor-pointer select-none group"
              title="Aktifkan untuk menambahkan Deskripsi Pekerjaan & Syarat & Kualifikasi"
            >
              <span
                className={`text-[11px] font-semibold transition-colors ${
                  activeShowDetail ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
                }`}
              >
                Detail
              </span>
              <button
                type="button"
                id="job-detail-toggle"
                role="switch"
                aria-checked={activeShowDetail}
                onClick={(e) => {
                  e.stopPropagation();
                  activeSetShowDetail(!activeShowDetail);
                }}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  activeShowDetail ? 'bg-blue-600' : 'bg-slate-300 hover:bg-slate-400'
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                    activeShowDetail ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          <input
            id="job-title-input"
            type="text"
            value={jobTitle}
            onChange={(e) => {
              const newTitle = e.target.value;
              setJobTitle(newTitle);
              handleTriggerAutoPreset(newTitle, activeJobDesk, activeKualifikasi);
            }}
            className="w-full h-10 px-3.5 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs hover:border-slate-400 transition-all"
          />
        </div>
      </div>

      {/* Row Tambahan Saat Seekbar Detail Aktif: Deskripsi Pekerjaan (Kolom 1) & Syarat & Kualifikasi (Kolom 2) */}
      {activeShowDetail && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 animate-in fade-in duration-200">
          {/* Kolom 1 (selebar Nama Perusahaan): Deskripsi Pekerjaan */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="job-desk-input" className="block text-xs font-bold text-slate-900">
                Deskripsi Pekerjaan
              </label>
              <button
                type="button"
                onClick={() => setShowDeskBadges(!showDeskBadges)}
                className={`text-[11px] font-semibold transition-all px-2 py-0.5 rounded-lg border flex items-center gap-1 cursor-pointer select-none ${
                  showDeskBadges
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 border-slate-200'
                }`}
                title={showDeskBadges ? 'Klik untuk mengedit teks' : 'Klik untuk melihat badge kata kunci terdeteksi'}
              >
                <span>{deskUniqueKeywords.length} Kata</span>
              </button>
            </div>

            {showDeskBadges ? (
              <div
                onClick={() => setShowDeskBadges(false)}
                className="w-full min-h-[38px] max-h-[104px] p-2 text-xs rounded-xl border border-slate-300 bg-white shadow-2xs overflow-y-auto flex flex-wrap gap-1.5 cursor-pointer hover:border-slate-400 transition-all select-none"
                title="Klik untuk kembali mengedit teks"
              >
                {deskUniqueKeywords.length > 0 ? (
                  deskUniqueKeywords.map((kw, idx) => (
                    <span
                      key={`desk-kw-${kw}-${idx}`}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-[11px] font-medium bg-blue-600 text-white shadow-2xs"
                    >
                      {kw}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-400 italic text-[11px] py-1">Belum ada kata kunci terdeteksi</span>
                )}
              </div>
            ) : (
              <textarea
                id="job-desk-input"
                ref={jobDeskTextareaRef}
                rows={1}
                value={activeJobDesk}
                onChange={(e) => {
                  const newDesk = e.target.value;
                  activeSetJobDesk(newDesk);
                  handleTriggerAutoPreset(jobTitle, newDesk, activeKualifikasi);
                  autoResize(e.target);
                }}
                className="w-full min-h-[38px] max-h-[104px] py-2 px-3.5 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs hover:border-slate-400 transition-all resize-none overflow-y-auto leading-normal"
              />
            )}
          </div>

          {/* Kolom 2 (kanan): Syarat & Kualifikasi */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="job-qualification-input" className="block text-xs font-bold text-slate-900">
                Syarat & Kualifikasi
              </label>
              <button
                type="button"
                onClick={() => setShowQualBadges(!showQualBadges)}
                className={`text-[11px] font-semibold transition-all px-2 py-0.5 rounded-lg border flex items-center gap-1 cursor-pointer select-none ${
                  showQualBadges
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 border-slate-200'
                }`}
                title={showQualBadges ? 'Klik untuk mengedit teks' : 'Klik untuk melihat badge kata kunci terdeteksi'}
              >
                <span>{qualUniqueKeywords.length} Kata</span>
              </button>
            </div>

            {showQualBadges ? (
              <div
                onClick={() => setShowQualBadges(false)}
                className="w-full min-h-[38px] max-h-[104px] p-2 text-xs rounded-xl border border-slate-300 bg-white shadow-2xs overflow-y-auto flex flex-wrap gap-1.5 cursor-pointer hover:border-slate-400 transition-all select-none"
                title="Klik untuk kembali mengedit teks"
              >
                {qualUniqueKeywords.length > 0 ? (
                  qualUniqueKeywords.map((kw, idx) => (
                    <span
                      key={`qual-kw-${kw}-${idx}`}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-[11px] font-medium bg-blue-600 text-white shadow-2xs"
                    >
                      {kw}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-400 italic text-[11px] py-1">Belum ada kata kunci terdeteksi</span>
                )}
              </div>
            ) : (
              <textarea
                id="job-qualification-input"
                ref={kualifikasiTextareaRef}
                rows={1}
                value={activeKualifikasi}
                onChange={(e) => {
                  const newQual = e.target.value;
                  activeSetKualifikasi(newQual);
                  handleTriggerAutoPreset(jobTitle, activeJobDesk, newQual);
                  autoResize(e.target);
                }}
                className="w-full min-h-[38px] max-h-[104px] py-2 px-3.5 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs hover:border-slate-400 transition-all resize-none overflow-y-auto leading-normal"
              />
            )}
          </div>
        </div>
      )}

      {/* Row 2: Email Tujuan & Email CC */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="recipient-email-input" className="block text-xs font-bold text-slate-900">
              Email Tujuan
            </label>

            <div className="flex items-center gap-2">
              {/* Tombol Tambah CC hanya di mode mobile karena desktop sudah menampilkan kolom CC di samping */}
              <button
                type="button"
                onClick={() => {
                  if (showCcField || ccEmail) {
                    setShowCcField(false);
                    setCcEmail('');
                  } else {
                    setShowCcField(true);
                  }
                }}
                className="sm:hidden text-xs text-blue-600 hover:text-blue-800 font-medium hover:underline cursor-pointer"
              >
                {showCcField || ccEmail ? 'Hapus CC' : 'Tambah CC'}
              </button>

              {recipientEmail && (
                <button
                  type="button"
                  onClick={() => handleCopy(recipientEmail, 'email')}
                  className="p-1 text-slate-500 hover:text-blue-600 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Salin Email Tujuan"
                  aria-label="Salin Email Tujuan"
                >
                  {copiedEmail ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              )}
            </div>
          </div>

          <input
            id="recipient-email-input"
            type="email"
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
            className="w-full h-10 px-3.5 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs hover:border-slate-400 transition-all font-normal"
          />
        </div>

        {/* Email CC: Langsung tampil di mode desktop (sm:block), di mode mobile tampil jika tombol Tambah CC diklik atau dari Smart Teks */}
        <div className={`${(showCcField || ccEmail) ? 'block' : 'hidden sm:block'} animate-in fade-in duration-200`}>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="recipient-cc-email-input" className="block text-xs font-bold text-slate-900">
              Email CC <span className="text-[10px] text-slate-400 font-normal">(Opsional)</span>
            </label>
            <div className="flex items-center gap-1.5">
              {/* Tombol Hapus CC di mobile */}
              {(showCcField || ccEmail) && (
                <button
                  type="button"
                  onClick={() => {
                    setShowCcField(false);
                    setCcEmail('');
                  }}
                  className="sm:hidden text-xs text-rose-500 hover:text-rose-700 font-medium hover:underline cursor-pointer"
                >
                  Hapus CC
                </button>
              )}

              {ccEmail && (
                <button
                  type="button"
                  onClick={() => handleCopy(ccEmail, 'cc')}
                  className="p-1 text-slate-500 hover:text-blue-600 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Salin Email CC"
                  aria-label="Salin Email CC"
                >
                  {copiedCc ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              )}
            </div>
          </div>
          <input
            id="recipient-cc-email-input"
            type="text"
            value={ccEmail}
            onChange={(e) => setCcEmail(e.target.value)}
            className="w-full h-10 px-3.5 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs hover:border-slate-400 transition-all font-normal"
          />
        </div>
      </div>

      {/* Notice Card: Full-width alert banner for duplicate Draft / Sent History */}
      {statusNotice && (
        <div
          className={`w-full px-3.5 py-2.5 rounded-xl border flex items-center gap-2.5 text-xs font-semibold shadow-2xs animate-in fade-in duration-200 ${
            statusNotice.type === 'history'
              ? 'bg-rose-50 border-rose-200 text-rose-800'
              : 'bg-amber-50 border-amber-200 text-amber-800'
          }`}
        >
          {statusNotice.type === 'history' ? (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          )}
          <span className="leading-snug">{statusNotice.text}</span>
        </div>
      )}

      {/* Subject */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor="email-subject-input" className="text-xs font-bold text-slate-900">
            Subject
          </label>
          <div className="flex items-center gap-2">
            {/* Toggle / Seekbar Format Otomatis: [Posisi] - Alvareza Hilka Pratama */}
            <div className="flex items-center gap-1.5 select-none" title="Format subject otomatis: [Posisi] - Alvareza Hilka Pratama">
              <span
                onClick={() => {
                  const nextState = !isSubjectAuto;
                  setIsSubjectAuto(nextState);
                  if (nextState) {
                    const cleanTitle = jobTitle.trim();
                    setEmailSubject(cleanTitle ? `${cleanTitle} - Alvareza Hilka Pratama` : '');
                  } else {
                    setEmailSubject('');
                  }
                }}
                className={`text-xs font-semibold cursor-pointer transition-colors ${
                  isSubjectAuto ? 'text-blue-600' : 'text-slate-400'
                }`}
              >
                Auto
              </span>
              <button
                type="button"
                id="toggle-auto-subject"
                role="switch"
                aria-checked={isSubjectAuto}
                onClick={() => {
                  const nextState = !isSubjectAuto;
                  setIsSubjectAuto(nextState);
                  if (nextState) {
                    const cleanTitle = jobTitle.trim();
                    setEmailSubject(cleanTitle ? `${cleanTitle} - Alvareza Hilka Pratama` : '');
                  } else {
                    setEmailSubject('');
                  }
                }}
                className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${
                  isSubjectAuto ? 'bg-blue-600' : 'bg-slate-300'
                }`}
                aria-label="Format subject otomatis [Posisi] - Alvareza Hilka Pratama"
              >
                <span
                  className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    isSubjectAuto ? 'translate-x-3' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <button
              type="button"
              onClick={() => handleCopy(emailSubject, 'subject')}
              className="p-1 text-slate-500 hover:text-blue-600 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
              title="Salin Subject"
              aria-label="Salin Subject"
            >
              {copiedSubject ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>
        <input
          id="email-subject-input"
          type="text"
          value={emailSubject}
          onChange={(e) => {
            if (isSubjectAuto) setIsSubjectAuto(false);
            setEmailSubject(e.target.value);
          }}
          className="w-full h-10 px-3.5 text-xs sm:text-sm font-normal rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs hover:border-slate-400 transition-all"
        />
      </div>

      {/* Isi Email (Teks Statis dengan Format Bersih, Bold Yth, & Hyperlink WhatsApp) */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label
            onClick={() => setIsEmailBodyExpanded(!isEmailBodyExpanded)}
            className="text-xs font-bold text-slate-900 cursor-pointer select-none hover:text-blue-600 transition-colors"
          >
            Isi Email
          </label>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => handleCopy(emailBody, 'body')}
              className="p-1 text-slate-500 hover:text-blue-600 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
              title="Salin Isi Email"
              aria-label="Salin Isi Email"
            >
              {copiedBody ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setIsEmailBodyExpanded(!isEmailBodyExpanded)}
              className="p-1 text-slate-500 hover:text-blue-600 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
              title={isEmailBodyExpanded ? 'Sembunyikan Isi Email' : 'Tampilkan Isi Email'}
              aria-label={isEmailBodyExpanded ? 'Sembunyikan Isi Email' : 'Tampilkan Isi Email'}
            >
              {isEmailBodyExpanded ? (
                <ChevronUp className="w-3.5 h-3.5 text-slate-600" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-slate-600" />
              )}
            </button>
          </div>
        </div>

        {isEmailBodyExpanded && (
          <div className="w-full p-3.5 sm:p-4 rounded-lg border border-slate-200 bg-slate-50/75 text-slate-800 shadow-2xs overflow-y-auto max-h-72 select-text animate-in fade-in duration-150">
            <FormattedEmailBodyPreview body={emailBody} />
          </div>
        )}
      </div>
    </>
  );
};
