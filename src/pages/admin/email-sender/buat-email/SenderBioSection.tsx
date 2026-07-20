import React from 'react';
import { motion } from 'motion/react';
import { User, MapPin, Calendar, Phone, Award } from 'lucide-react';
import { CustomSelect, ModernToggle } from './components';
import { ProfileData } from '../../../../types';

interface SenderBioSectionProps {
  includeBio: boolean;
  setIncludeBio: (val: boolean) => void;
  bioNama: string;
  setBioNama: (val: string) => void;
  bioTtl: string;
  setBioTtl: (val: string) => void;
  bioAlamat: string;
  setBioAlamat: (val: string) => void;
  senderLocation: string;
  setSenderLocation: (val: string) => void;
  bioTelp: string;
  setBioTelp: (val: string) => void;
  bioPendidikan: string;
  setBioPendidikan: (val: string) => void;
  bioJurusan: string;
  setBioJurusan: (val: string) => void;
  salaryExpectation: string;
  setSalaryExpectation: (val: string) => void;
  profileData: ProfileData | null;
  includePerihal: boolean;
  setIncludePerihal: (val: boolean) => void;
  includeLampiranAwal: boolean;
  setIncludeLampiranAwal: (val: boolean) => void;
  includeDaftarLampiran: boolean;
  setIncludeDaftarLampiran: (val: boolean) => void;
}

export const SenderBioSection = ({
  includeBio,
  setIncludeBio,
  bioNama,
  setBioNama,
  bioTtl,
  setBioTtl,
  bioAlamat,
  setBioAlamat,
  senderLocation,
  setSenderLocation,
  bioTelp,
  setBioTelp,
  bioPendidikan,
  setBioPendidikan,
  bioJurusan,
  setBioJurusan,
  salaryExpectation,
  setSalaryExpectation,
  profileData,
  includePerihal,
  setIncludePerihal,
  includeLampiranAwal,
  setIncludeLampiranAwal,
  includeDaftarLampiran,
  setIncludeDaftarLampiran,
}: SenderBioSectionProps) => {
  return (
    <div className="space-y-4">
      {/* Row of Toggles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <ModernToggle
          id="toggle-include-perihal"
          checked={includePerihal}
          onChange={setIncludePerihal}
          label="Tampilkan Perihal"
          description="Sertakan baris perihal di atas surat"
        />
        <ModernToggle
          id="toggle-include-lampiran"
          checked={includeLampiranAwal && includeDaftarLampiran}
          onChange={(val) => {
            setIncludeLampiranAwal(val);
            setIncludeDaftarLampiran(val);
          }}
          label="Tampilkan Lampiran"
          description="Sertakan jumlah & daftar dokumen berkas di surat"
        />
        <ModernToggle
          id="toggle-include-bio"
          checked={includeBio}
          onChange={setIncludeBio}
          label="Tampilkan Bio Singkat di Surat"
          description="Sertakan rincian identitas diri lengkap Anda langsung di body email"
        />
      </div>

      {/* Form Fields */}
      <motion.div
        layout
        className="grid grid-cols-1 gap-4 pt-1"
      >
        {includeBio ? (
          /* Pilihan Alamat Domisili */
          <div className="space-y-1 text-left">
            <label className="block text-[10px] font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider mb-1">
              Pilihan Alamat Domisili
            </label>
            <CustomSelect
              value={bioAlamat}
              onChange={setBioAlamat}
              options={[
                ...( ((profileData as any)?.alamatTempatTinggal || profileData?.alamat_tempat_tinggal || []).length > 0 
                  ? ((profileData as any)?.alamatTempatTinggal || profileData?.alamat_tempat_tinggal).map((alamat: any) => ({
                      value: alamat.alamat,
                      label: `${alamat.label} (${alamat.alamat.substring(0, 45)}${alamat.alamat.length > 45 ? '...' : ''})`
                    }))
                  : [{ value: bioAlamat !== 'none' ? bioAlamat : '', label: 'Alamat Utama' }]),
                { value: 'none', label: 'Tidak menampilkan alamat di biodata' }
              ]}
            />
          </div>
        ) : (
          /* Lokasi Pengiriman Surat (Kota/Kabupaten) */
          <div className="space-y-1 text-left">
            <label className="block text-[10px] font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider mb-1">
              Lokasi Pengiriman Surat (Kota/Kabupaten)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <MapPin className="w-3.5 h-3.5" />
              </span>
              <input
                id="input-sender-location"
                type="text"
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:border-slate-300 dark:focus:border-slate-700 focus:outline-none rounded-xl text-xs font-semibold text-[#1e293b] dark:text-[#f8fafc] shadow-inner"
                value={senderLocation}
                onChange={(e) => setSenderLocation(e.target.value)}
                placeholder="Contoh: Purwakarta, Bandung, dsb."
              />
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
