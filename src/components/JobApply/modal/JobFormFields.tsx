import React, { useMemo } from 'react';
import { Copy, Check, ChevronDown, ChevronUp, AlertCircle, AlertTriangle } from 'lucide-react';
import { FormattedEmailBodyPreview } from './FormattedEmailBodyPreview';
import { GasSenderService } from '../../../services/gasSenderService';
import { JobDraftService } from '../../../services/jobDraftService';

interface JobFormFieldsProps {
  companyName: string;
  setCompanyName: (val: string) => void;
  jobTitle: string;
  setJobTitle: (val: string) => void;
  isPresetAuto: boolean;
  setIsPresetAuto: (val: boolean) => void;
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
  isPresetAuto,
  setIsPresetAuto,
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
  return (
    <>
      {/* Row 1: Nama Perusahaan & Posisi */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* Kolom 1: Nama Perusahaan */}
        <div>
          <label htmlFor="company-name-input" className="block text-xs font-semibold text-slate-700 mb-1.5">
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

        {/* Kolom 2: Posisi yang Dilamar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="job-title-input" className="block text-xs font-semibold text-slate-700">
              Posisi yang Dilamar
            </label>
            <div className="flex items-center gap-1.5 select-none" title="Pencocokan Preset Otomatis">
              <span
                onClick={() => setIsPresetAuto(!isPresetAuto)}
                className={`text-xs font-semibold cursor-pointer transition-colors ${
                  isPresetAuto ? 'text-blue-600' : 'text-slate-400'
                }`}
              >
                Auto
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={isPresetAuto}
                onClick={() => setIsPresetAuto(!isPresetAuto)}
                className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${
                  isPresetAuto ? 'bg-blue-600' : 'bg-slate-300'
                }`}
                aria-label="Toggle Auto Preset"
              >
                <span
                  className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${
                    isPresetAuto ? 'translate-x-3' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
          <input
            id="job-title-input"
            type="text"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            className="w-full h-10 px-3.5 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs hover:border-slate-400 transition-all"
          />
        </div>
      </div>

      {/* Row 2: Email Tujuan & Email CC */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="recipient-email-input" className="block text-xs font-semibold text-slate-700">
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
            className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Email CC: Langsung tampil di mode desktop (sm:block), di mode mobile tampil jika tombol Tambah CC diklik atau dari Smart Teks */}
        <div className={`${(showCcField || ccEmail) ? 'block' : 'hidden sm:block'} animate-in fade-in duration-200`}>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="recipient-cc-email-input" className="block text-xs font-semibold text-slate-700">
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
            className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <label htmlFor="email-subject-input" className="text-xs font-semibold text-slate-700">
            Subject
          </label>
          <div className="flex items-center gap-2">
            {/* Toggle / Seekbar Format Otomatis: [Posisi] - Alvareza */}
            <div className="flex items-center gap-1.5 select-none" title="Format subject otomatis: [Posisi] - Alvareza">
              <span
                onClick={() => {
                  const nextState = !isSubjectAuto;
                  setIsSubjectAuto(nextState);
                  if (nextState) {
                    const cleanTitle = jobTitle.trim();
                    setEmailSubject(cleanTitle ? `${cleanTitle} - Alvareza` : '');
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
                    setEmailSubject(cleanTitle ? `${cleanTitle} - Alvareza` : '');
                  } else {
                    setEmailSubject('');
                  }
                }}
                className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${
                  isSubjectAuto ? 'bg-blue-600' : 'bg-slate-300'
                }`}
                aria-label="Format subject otomatis [Posisi] - Alvareza"
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
          className="w-full px-3 py-2 text-xs sm:text-sm font-normal rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Isi Email (Teks Statis dengan Format Bersih, Bold Yth, & Hyperlink WhatsApp) */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label
            onClick={() => setIsEmailBodyExpanded(!isEmailBodyExpanded)}
            className="text-xs font-semibold text-slate-700 cursor-pointer select-none hover:text-blue-600 transition-colors"
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
