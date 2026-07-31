import React from 'react';
import { motion } from 'motion/react';
import { Mail, Briefcase, Building, User, MapPin, Sparkles, AlertCircle, CheckCircle2, Trash2 } from 'lucide-react';
import { CustomSelect } from './komponen-view';

interface JobDetailsSectionProps {
  targetEmail: string;
  setTargetEmail: (val: string) => void;
  ccEmail: string;
  setCcEmail: (val: string) => void;
  bccEmail: string;
  setBccEmail: (val: string) => void;
  isBccDefault?: boolean;
  setIsBccDefault?: (val: boolean) => void;
  companyName: string;
  setCompanyName: (val: string) => void;
  positionName: string;
  setPositionName: (val: string) => void;
  isPositionGeneral?: boolean;
  setIsPositionGeneral?: (val: boolean) => void;
  recipientGender: string;
  setRecipientGender: (val: string) => void;
  recipientRole: string;
  setRecipientRole: (val: string) => void;
  customRecipientRole: string;
  setCustomRecipientRole: (val: string) => void;
  recipientName: string;
  setRecipientName: (val: string) => void;
  recipientPlaceOption: string;
  setRecipientPlaceOption: (val: string) => void;
  recipientPlaceName: string;
  setRecipientPlaceName: (val: string) => void;
  recipientRoleCompanyFormat: string;
  setRecipientRoleCompanyFormat: (val: string) => void;
  isSubjectAuto: boolean;
  setIsSubjectAuto: (val: boolean) => void;
  customSubject: string;
  setCustomSubject: (val: string) => void;
  subjectPreview: string;
  quickInput: string;
  setQuickInput: (val: string) => void;
}

export const JobDetailsSection = ({
  targetEmail,
  setTargetEmail,
  ccEmail,
  setCcEmail,
  bccEmail,
  setBccEmail,
  isBccDefault = false,
  setIsBccDefault,
  companyName,
  setCompanyName,
  positionName,
  setPositionName,
  isPositionGeneral = false,
  setIsPositionGeneral,
  recipientGender,
  setRecipientGender,
  recipientRole,
  setRecipientRole,
  customRecipientRole,
  setCustomRecipientRole,
  recipientName,
  setRecipientName,
  recipientPlaceOption,
  setRecipientPlaceOption,
  recipientPlaceName,
  setRecipientPlaceName,
  recipientRoleCompanyFormat,
  setRecipientRoleCompanyFormat,
  isSubjectAuto,
  setIsSubjectAuto,
  customSubject,
  setCustomSubject,
  subjectPreview,
  quickInput,
  setQuickInput,
}: JobDetailsSectionProps) => {
  const [parseStatus, setParseStatus] = React.useState<'idle' | 'success' | 'partial' | 'error'>('idle');
  const [lastParsed, setLastParsed] = React.useState<{
    company?: string;
    position?: string;
    email?: string;
    cc?: string;
    bcc?: string;
    subject?: string;
  }>({});

  React.useEffect(() => {
    if (!quickInput) {
      setParseStatus('idle');
      setLastParsed({});
    }
  }, [quickInput]);

  const handleQuickInput = (val: string) => {
    setQuickInput(val);
    if (!val.trim()) {
      setParseStatus('idle');
      setLastParsed({});
      return;
    }

    // Helper to extract email
    const extractEmail = (str: string): string | null => {
      const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i;
      const match = str.match(emailRegex);
      return match ? match[0] : null;
    };

    // Split text into lines/parts
    let parts: string[] = [];
    if (val.includes('\n')) {
      parts = val.split('\n').map(s => s.trim()).filter(Boolean);
    } else if (val.includes('|')) {
      parts = val.split('|').map(s => s.trim()).filter(Boolean);
    } else if (val.includes(';')) {
      parts = val.split(';').map(s => s.trim()).filter(Boolean);
    } else if (val.includes(',')) {
      parts = val.split(',').map(s => s.trim()).filter(Boolean);
    } else {
      parts = val.split(/\s{2,}/).map(s => s.trim()).filter(Boolean);
      if (parts.length < 2) {
        parts = [val.trim()];
      }
    }

    // Find first email index
    let firstEmailIdx = -1;
    for (let i = 0; i < parts.length; i++) {
      if (extractEmail(parts[i])) {
        firstEmailIdx = i;
        break;
      }
    }

    let detectedCompany = '';
    let detectedPosition = '';
    let detectedTargetEmail = '';
    let detectedCcEmail = '';
    let detectedBccEmail = '';
    let detectedSubject = '';

    // Parse pre-email lines as company and position
    if (firstEmailIdx > 0) {
      const preEmailLines = parts.slice(0, firstEmailIdx);
      if (preEmailLines.length === 1) {
        const line = preEmailLines[0];
        const lineLower = line.toLowerCase();
        const positionKeywords = [
          'developer', 'engineer', 'manager', 'lead', 'staff', 'admin', 'intern', 'magang',
          'spv', 'supervisor', 'specialist', 'designer', 'writer', 'officer', 'analyst', 'head',
          'sales', 'marketing', 'akuntansi', 'accounting', 'operator', 'kurir', 'driver',
          'sekretaris', 'surveyor', 'hrd', 'resources', 'strategist', 'pmo', 'assistant'
        ];
        const isPosition = positionKeywords.some(kw => lineLower.includes(kw));
        if (isPosition) {
          detectedPosition = line;
        } else {
          detectedCompany = line;
        }
      } else if (preEmailLines.length >= 2) {
        detectedCompany = preEmailLines[0];
        detectedPosition = preEmailLines[1];
      }
    } else if (firstEmailIdx === -1) {
      // No email found yet, try to assign first few lines to Company & Position
      if (parts.length === 1) {
        detectedCompany = parts[0];
      } else if (parts.length >= 2) {
        detectedCompany = parts[0];
        detectedPosition = parts[1];
      }
    }

    // Parse from first email index downwards
    if (firstEmailIdx !== -1) {
      for (let i = firstEmailIdx; i < parts.length; i++) {
        const part = parts[i];
        const email = extractEmail(part);

        if (email) {
          if (!detectedTargetEmail) {
            detectedTargetEmail = email;
          } else if (!detectedCcEmail) {
            detectedCcEmail = email;
          } else if (!detectedBccEmail) {
            detectedBccEmail = email;
          }
        } else {
          // It's not an email. Let's make sure it's not just a phone number
          const isPhone = /^[0-9+\s\-()]{7,15}$/.test(part.trim());
          if (!isPhone && !detectedSubject) {
            detectedSubject = part;
          }
        }
      }
    }

    // Apply the parsed values to parent state
    if (detectedCompany) setCompanyName(detectedCompany);
    if (detectedPosition) setPositionName(detectedPosition);
    if (detectedTargetEmail) setTargetEmail(detectedTargetEmail);
    
    // Set CC & BCC (always overwrite with detected, even if empty/cleared)
    setCcEmail(detectedCcEmail);
    setBccEmail(detectedBccEmail);

    if (detectedSubject) {
      setIsSubjectAuto(false);
      setCustomSubject(detectedSubject);
    }

    setLastParsed({
      company: detectedCompany || undefined,
      position: detectedPosition || undefined,
      email: detectedTargetEmail || undefined,
      cc: detectedCcEmail || undefined,
      bcc: detectedBccEmail || undefined,
      subject: detectedSubject || undefined,
    });

    if (detectedCompany && detectedPosition && detectedTargetEmail) {
      setParseStatus('success');
    } else if (detectedCompany || detectedPosition || detectedTargetEmail) {
      setParseStatus('partial');
    } else {
      setParseStatus('error');
    }
  };

  return (
    <div className="space-y-5">
      {/* SECTION: INPUT OTOMATIS (FAST COPY-PASTE) */}
      <div className="text-left space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-[10px] font-bold text-slate-450 dark:text-slate-450 uppercase tracking-wider">
            Deteksi &amp; Isi Otomatis (Tanpa AI)
          </label>
          {quickInput && (
            <button
              type="button"
              onClick={() => {
                setQuickInput('');
                setParseStatus('idle');
                setLastParsed({});
              }}
              className="text-[10px] font-bold text-rose-500 hover:text-rose-600 bg-rose-50 dark:bg-rose-950/20 px-2 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer border-none"
            >
              <Trash2 className="w-3 h-3" /> Bersihkan
            </button>
          )}
        </div>

        <div className="relative">
          <textarea
            rows={2}
            placeholder="Contoh: PT Kreatif Teknologi, Web Developer, hrd@kreatif.com atau gunakan enter untuk tiap baris."
            value={quickInput}
            onChange={(e) => handleQuickInput(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-slate-300 dark:focus:border-slate-700 focus:outline-none rounded-xl text-xs font-semibold text-[#1e293b] dark:text-[#f8fafc] shadow-inner resize-none placeholder-slate-400 dark:placeholder-slate-600"
          />
        </div>

        {parseStatus !== 'idle' && (
          <div className="flex flex-wrap gap-2 pt-1 text-[11px]">
            {lastParsed.company && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 font-semibold rounded-md border border-emerald-100 dark:border-emerald-900/30">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Perusahaan: <strong className="font-extrabold">{lastParsed.company}</strong>
              </span>
            )}
            {lastParsed.position && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 font-semibold rounded-md border border-emerald-100 dark:border-emerald-900/30">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Posisi: <strong className="font-extrabold">{lastParsed.position}</strong>
              </span>
            )}
            {lastParsed.email && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 font-semibold rounded-md border border-emerald-100 dark:border-emerald-900/30">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Email: <strong className="font-extrabold">{lastParsed.email}</strong>
              </span>
            )}
            {lastParsed.cc && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 font-semibold rounded-md border border-emerald-100 dark:border-emerald-900/30">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> CC: <strong className="font-extrabold">{lastParsed.cc}</strong>
              </span>
            )}
            {lastParsed.bcc && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 font-semibold rounded-md border border-emerald-100 dark:border-emerald-900/30">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> BCC: <strong className="font-extrabold">{lastParsed.bcc}</strong>
              </span>
            )}
            {lastParsed.subject && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 font-semibold rounded-md border border-emerald-100 dark:border-emerald-900/30">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Subjek: <strong className="font-extrabold">{lastParsed.subject}</strong>
              </span>
            )}
            {parseStatus === 'partial' && (!lastParsed.company || !lastParsed.position || !lastParsed.email) && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 font-semibold rounded-md border border-amber-100 dark:border-amber-900/30">
                <AlertCircle className="w-3.5 h-3.5 text-amber-500" /> Beberapa field belum terdeteksi. Silakan isi manual di bawah.
              </span>
            )}
          </div>
        )}
      </div>

      {/* Row 1: Company, Position, Subject */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Target Company */}
        <div className="text-left">
          <label className="block text-[10px] font-bold text-slate-450 dark:text-slate-450 uppercase tracking-wider mb-2">
            Nama Perusahaan *
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              <Building className="w-3.5 h-3.5" />
            </span>
            <input
              type="text"
              required
              placeholder="Misal: PT GoTo Gojek Tokopedia"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full pl-9 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-slate-300 dark:focus:border-slate-700 focus:outline-none rounded-xl text-xs font-semibold text-[#1e293b] dark:text-[#f8fafc] shadow-inner"
            />
          </div>
        </div>

        {/* Target Position */}
        <div className="text-left">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-[10px] font-bold text-slate-450 dark:text-slate-450 uppercase tracking-wider">
              Posisi Pekerjaan *
            </label>
            {setIsPositionGeneral && (
              <div
                className="flex items-center gap-1.5 cursor-pointer select-none"
                onClick={() => setIsPositionGeneral(!isPositionGeneral)}
                title="Aktifkan jika melamar posisi umum (tanpa spesifikasi posisi)"
              >
                <div className={`relative w-8 h-4.5 transition-colors duration-200 rounded-full ${isPositionGeneral ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-750'}`}>
                  <div className={`absolute top-0.5 left-0.5 w-3.5 h-3.5 bg-white rounded-full shadow-md transition-transform duration-200 ${isPositionGeneral ? 'translate-x-3.5' : 'translate-x-0'}`} />
                </div>
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Umum
                </span>
              </div>
            )}
          </div>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              <Briefcase className="w-3.5 h-3.5" />
            </span>
            <input
              type="text"
              required={!isPositionGeneral}
              disabled={isPositionGeneral}
              placeholder={isPositionGeneral ? "Umum / Semua Posisi" : "Misal: Business Development"}
              value={isPositionGeneral ? "Umum" : positionName}
              onChange={(e) => setPositionName(e.target.value)}
              className={`w-full pl-9 pr-4 py-3 border focus:outline-none rounded-xl text-xs font-semibold shadow-inner transition-all ${
                isPositionGeneral 
                  ? 'bg-slate-100/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-850 text-slate-400 cursor-not-allowed' 
                  : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:border-slate-300 dark:focus:border-slate-700 text-[#1e293b] dark:text-[#f8fafc]'
              }`}
            />
          </div>
        </div>

        {/* Subjek Email Section */}
        <div className="text-left">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-[10px] font-bold text-slate-450 dark:text-slate-450 uppercase tracking-wider">
              Subject Email *
            </label>
            <div
              className="flex items-center gap-1.5 cursor-pointer select-none"
              onClick={() => setIsSubjectAuto(!isSubjectAuto)}
            >
              <div className={`relative w-8 h-4.5 transition-colors duration-200 rounded-full ${isSubjectAuto ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-750'}`}>
                <div className={`absolute top-0.5 left-0.5 w-3.5 h-3.5 bg-white rounded-full shadow-md transition-transform duration-200 ${isSubjectAuto ? 'translate-x-3.5' : 'translate-x-0'}`} />
              </div>
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Otomatis
              </span>
            </div>
          </div>
          <div className="relative">
            <input
              type="text"
              required
              disabled={isSubjectAuto}
              placeholder="Tulis subjek email kustom Anda..."
              value={isSubjectAuto ? (subjectPreview || "Menyusun subjek otomatis...") : (customSubject || '')}
              onChange={(e) => setCustomSubject(e.target.value)}
              className={`w-full px-4 py-3 border focus:outline-none rounded-xl text-xs font-semibold shadow-inner transition-all ${
                isSubjectAuto 
                  ? 'bg-slate-100/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-850 text-slate-400 cursor-not-allowed' 
                  : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 focus:border-slate-300 dark:focus:border-slate-700 text-[#1e293b] dark:text-[#f8fafc]'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Row 2: Target Email, CC, BCC */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Recipient HRD Email */}
        <div className="text-left">
          <label className="block text-[10px] font-bold text-slate-450 dark:text-slate-450 uppercase tracking-wider mb-2">
            Email Tujuan *
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              <Mail className="w-3.5 h-3.5" />
            </span>
            <input
              type="email"
              required
              placeholder="hrd@perusahaan-tujuan.com"
              value={targetEmail}
              onChange={(e) => setTargetEmail(e.target.value)}
              className="w-full pl-9 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-slate-300 dark:focus:border-slate-700 focus:outline-none rounded-xl text-xs font-semibold text-[#1e293b] dark:text-[#f8fafc] shadow-inner"
            />
          </div>
        </div>

        {/* CC Email */}
        <div className="text-left">
          <label className="block text-[10px] font-bold text-slate-450 dark:text-slate-450 uppercase tracking-wider mb-2">
            CC Email (Opsional)
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              <Mail className="w-3.5 h-3.5" />
            </span>
            <input
              type="text"
              placeholder="pisahkan dengan koma"
              value={ccEmail}
              onChange={(e) => setCcEmail(e.target.value)}
              className="w-full pl-9 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-slate-300 dark:focus:border-slate-700 focus:outline-none rounded-xl text-xs font-semibold text-[#1e293b] dark:text-[#f8fafc] shadow-inner"
            />
          </div>
        </div>

        {/* BCC Email */}
        <div className="text-left">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-[10px] font-bold text-slate-450 dark:text-slate-450 uppercase tracking-wider">
              BCC Email (Opsional)
            </label>
            {setIsBccDefault && (
              <div
                className="flex items-center gap-1.5 cursor-pointer select-none"
                onClick={() => setIsBccDefault(!isBccDefault)}
                title="Aktifkan untuk mengisi BCC default halo.alvareza@gmail.com"
              >
                <div className={`relative w-8 h-4.5 transition-colors duration-200 rounded-full ${isBccDefault ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-750'}`}>
                  <div className={`absolute top-0.5 left-0.5 w-3.5 h-3.5 bg-white rounded-full shadow-md transition-transform duration-200 ${isBccDefault ? 'translate-x-3.5' : 'translate-x-0'}`} />
                </div>
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Default
                </span>
              </div>
            )}
          </div>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              <Mail className="w-3.5 h-3.5" />
            </span>
            <input
              type="text"
              placeholder="pisahkan dengan koma"
              value={bccEmail}
              onChange={(e) => setBccEmail(e.target.value)}
              className="w-full pl-9 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-slate-300 dark:focus:border-slate-700 focus:outline-none rounded-xl text-xs font-semibold text-[#1e293b] dark:text-[#f8fafc] shadow-inner"
            />
          </div>
        </div>
      </div>

      {/* Row: Alamat Perusahaan, Penerima, Jabatan, Format jabatan */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Alamat Perusahaan */}
        <div className="text-left">
          <label className="block text-[10px] font-bold text-slate-450 dark:text-slate-450 uppercase tracking-wider mb-2">
            Alamat Perusahaan *
          </label>
          <CustomSelect
            value={recipientPlaceOption}
            onChange={setRecipientPlaceOption}
            options={[
              { value: 'di_tempat', label: 'Di tempat (Umum)' },
              { value: 'spesifik', label: 'Spesifik Nama Kota / Daerah' }
            ]}
          />
        </div>

        {/* Penerima */}
        <div className="text-left">
          <label className="block text-[10px] font-bold text-slate-450 dark:text-slate-450 uppercase tracking-wider mb-2">
            Penerima *
          </label>
          <CustomSelect
            value={recipientGender}
            onChange={setRecipientGender}
            options={[
              { value: 'Bapak/Ibu', label: 'Bapak/Ibu (Umum)' },
              { value: 'Bapak', label: 'Bapak (Spesifik Pria - Bpk.)' },
              { value: 'Ibu', label: 'Ibu (Spesifik Wanita - Ibu)' }
            ]}
          />
        </div>

        {/* Jabatan */}
        <div className="text-left">
          <label className="block text-[10px] font-bold text-slate-450 dark:text-slate-450 uppercase tracking-wider mb-2">
            Jabatan *
          </label>
          <CustomSelect
            value={recipientRole}
            onChange={setRecipientRole}
            options={[
              { value: 'HRD', label: 'HRD (Default)' },
              { value: 'Pimpinan', label: 'Pimpinan' },
              { value: 'Kepala Cabang', label: 'Kepala Cabang' },
              { value: 'Recruiter', label: 'Recruiter' },
              { value: 'Direktur', label: 'Direktur' },
              { value: 'Manager', label: 'Manager' },
              { value: 'Lainnya', label: 'Lainnya...' }
            ]}
          />
        </div>

        {/* Format jabatan */}
        <div className="text-left">
          <label className="block text-[10px] font-bold text-slate-450 dark:text-slate-450 uppercase tracking-wider mb-2">
            Format jabatan *
          </label>
          <CustomSelect
            value={recipientRoleCompanyFormat}
            onChange={setRecipientRoleCompanyFormat}
            options={[
              { value: 'satu_baris', label: 'Satu Baris (Pimpinan Cabang PT ABC)' },
              { value: 'dua_baris', label: 'Dua Baris (Pimpinan Cabang [Enter] PT ABC)' }
            ]}
          />
        </div>
      </div>

      {recipientRole === 'Lainnya' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2 text-left"
        >
          <label className="block text-[10px] font-bold text-slate-450 dark:text-slate-450 uppercase tracking-wider mb-1">
            Tulis Jabatan Kustom *
          </label>
          <input
            type="text"
            required
            placeholder="Misal: Team Leader, Owner, dsb."
            value={customRecipientRole}
            onChange={(e) => setCustomRecipientRole(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-slate-300 dark:focus:border-slate-700 focus:outline-none rounded-xl text-xs font-semibold text-[#1e293b] dark:text-[#f8fafc] shadow-inner"
          />
        </motion.div>
      )}

      {/* Row: Lokasi Detail dan Nama Penerima Detail */}
      {(recipientPlaceOption === 'spesifik' || recipientGender !== 'Bapak/Ibu') && (
        <div className={
          (recipientPlaceOption === 'spesifik' && recipientGender !== 'Bapak/Ibu')
            ? "grid grid-cols-1 md:grid-cols-2 gap-4"
            : "grid grid-cols-1 gap-4"
        }>
          {/* Lokasi Detail */}
          {recipientPlaceOption === 'spesifik' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-left w-full"
            >
              <label className="block text-[10px] font-bold text-slate-450 dark:text-slate-450 uppercase tracking-wider mb-2">
                Tulis Nama Kota / Lokasi *
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <MapPin className="w-3.5 h-3.5" />
                </span>
                <input
                  type="text"
                  required
                  placeholder="Misal: Jakarta Barat, Purwakarta, dsb."
                  value={recipientPlaceName}
                  onChange={(e) => setRecipientPlaceName(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-slate-300 dark:focus:border-slate-700 focus:outline-none rounded-xl text-xs font-semibold text-[#1e293b] dark:text-[#f8fafc] shadow-inner"
                />
              </div>
            </motion.div>
          )}

          {/* Nama Penerima Detail */}
          {recipientGender !== 'Bapak/Ibu' && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col justify-between text-left w-full"
            >
              <label className="block text-[10px] font-bold text-slate-450 dark:text-slate-450 uppercase tracking-wider mb-2">
                Nama Penerima (Opsional)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <User className="w-3.5 h-3.5" />
                </span>
                <input
                  type="text"
                  placeholder="Misal: Budi Santoso, S.Kom."
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-slate-300 dark:focus:border-slate-700 focus:outline-none rounded-xl text-xs font-semibold text-[#1e293b] dark:text-[#f8fafc] shadow-inner"
                />
              </div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};
