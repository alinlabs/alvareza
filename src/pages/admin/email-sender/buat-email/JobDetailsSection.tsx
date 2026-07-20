import React from 'react';
import { motion } from 'motion/react';
import { Mail, Briefcase, Building, User, MapPin } from 'lucide-react';
import { CustomSelect } from './components';

interface JobDetailsSectionProps {
  targetEmail: string;
  setTargetEmail: (val: string) => void;
  companyName: string;
  setCompanyName: (val: string) => void;
  positionName: string;
  setPositionName: (val: string) => void;
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
}

export const JobDetailsSection = ({
  targetEmail,
  setTargetEmail,
  companyName,
  setCompanyName,
  positionName,
  setPositionName,
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
}: JobDetailsSectionProps) => {
  return (
    <div className="space-y-5">
      {/* Target Details Grid: 4 columns of equal widths */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
          <label className="block text-[10px] font-bold text-slate-450 dark:text-slate-450 uppercase tracking-wider mb-2">
            Posisi Pekerjaan *
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              <Briefcase className="w-3.5 h-3.5" />
            </span>
            <input
              type="text"
              required
              placeholder="Misal: Business Development"
              value={positionName}
              onChange={(e) => setPositionName(e.target.value)}
              className="w-full pl-9 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-slate-300 dark:focus:border-slate-700 focus:outline-none rounded-xl text-xs font-semibold text-[#1e293b] dark:text-[#f8fafc] shadow-inner"
            />
          </div>
        </div>

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
              value={isSubjectAuto ? (subjectPreview || "Menyusun subjek otomatis...") : customSubject}
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
