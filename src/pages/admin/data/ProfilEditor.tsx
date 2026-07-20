import { ApiService } from '../../../services/api';
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Save, AlertTriangle, Trash2, Plus } from 'lucide-react';

const AutoResizingTextarea = ({ 
  value, 
  onChange, 
  className,
  placeholder
}: { 
  value: string; 
  onChange: (val: string) => void; 
  className?: string;
  placeholder?: string;
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={className}
      placeholder={placeholder}
      rows={1}
      style={{ resize: 'none', overflowY: 'hidden' }}
    />
  );
};

export default function ProfilEditor() {
  const [dataObj, setDataObj] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  
  const [desktopPortal, setDesktopPortal] = useState<HTMLElement | null>(null);
  const [mobilePortal, setMobilePortal] = useState<HTMLElement | null>(null);

  useEffect(() => {
    fetchData();
    const timer = setTimeout(() => {
      setDesktopPortal(document.getElementById('desktop-top-bar-actions'));
      setMobilePortal(document.getElementById('mobile-top-bar-actions'));
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await ApiService.get<any>('profil');
      if (!response.success) {
        throw new Error(response.message || 'Gagal memuat data profil');
      }
      const data = response.data;
      setDataObj(data || {});
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat memuat data');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setError(null);
    setSuccessMsg(null);
    setSaving(true);
    
    try {
      const response = await ApiService.post('profil', dataObj);
      if (!response.success) {
        throw new Error(response.error || response.message || 'Gagal menyimpan data');
      }
      
      setSuccessMsg('Data profil berhasil disimpan!');
      setTimeout(() => {
        setSuccessMsg(null);
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat menyimpan data');
    } finally {
      setSaving(false);
    }
  };

  const saveButtonDesktop = (
    <button
      onClick={handleSave}
      disabled={saving}
      className="p-2 text-[#02227E] hover:text-[#02227E]/80 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all hover:scale-110 active:scale-95"
      title="Simpan Perubahan"
    >
      {saving ? (
        <div className="w-5 h-5 border-2 border-[#02227E]/30 border-t-[#02227E] rounded-full animate-spin" />
      ) : (
        <Save className="w-5 h-5" />
      )}
    </button>
  );

  const saveButtonMobile = (
    <button
      onClick={handleSave}
      disabled={saving}
      className="p-1.5 text-[#02227E] hover:text-[#02227E]/80 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all active:scale-95"
      title="Simpan"
    >
      {saving ? (
        <div className="w-4 h-4 border-2 border-[#02227E]/30 border-t-[#02227E] rounded-full animate-spin" />
      ) : (
        <Save className="w-4 h-4" />
      )}
    </button>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 text-sm">Memuat data profil...</p>
        </div>
      </div>
    );
  }

  // Fallback safe keys in case they are parsed differently
  const getVal = (key: string) => {
    if (!dataObj) return '';
    return dataObj[key] !== undefined ? dataObj[key] : '';
  };

  const setVal = (key: string, val: any) => {
    setDataObj({
      ...dataObj,
      [key]: val
    });
  };

  const alamatList = Array.isArray(dataObj?.alamat_tempat_tinggal) 
    ? dataObj.alamat_tempat_tinggal 
    : (Array.isArray(dataObj?.alamatTempatTinggal) ? dataObj.alamatTempatTinggal : []);

  const handleUpdateAlamat = (index: number, field: string, val: string) => {
    const updated = [...alamatList];
    updated[index] = { ...updated[index], [field]: val };
    
    // update both snake_case and camelCase to keep APIs in sync
    setDataObj({
      ...dataObj,
      alamat_tempat_tinggal: updated,
      alamatTempatTinggal: updated
    });
  };

  const handleAddAlamat = () => {
    const updated = [...alamatList, { label: '', alamat: '' }];
    setDataObj({
      ...dataObj,
      alamat_tempat_tinggal: updated,
      alamatTempatTinggal: updated
    });
  };

  const handleDeleteAlamat = (index: number) => {
    const updated = [...alamatList];
    updated.splice(index, 1);
    setDataObj({
      ...dataObj,
      alamat_tempat_tinggal: updated,
      alamatTempatTinggal: updated
    });
  };

  return (
    <div className="w-full space-y-6 pb-10">
      {desktopPortal && createPortal(saveButtonDesktop, desktopPortal)}
      {mobilePortal && createPortal(saveButtonMobile, mobilePortal)}

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded-xl flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
          <p className="text-sm text-red-800 dark:text-red-300 whitespace-pre-wrap">{error}</p>
        </div>
      )}
      
      {successMsg && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-900 rounded-xl flex items-center gap-3">
          <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center shrink-0">
            <svg className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">{successMsg}</p>
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-10 shadow-sm space-y-8 animate-fadeIn">
        
        {/* Section 1: Informasi Pribadi */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800/60 pb-3">
            <span className="w-1.5 h-5 bg-accent rounded-full"></span>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#1e293b] dark:text-[#f8fafc]">
              Informasi Pribadi
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400">
                Nama Lengkap
              </label>
              <input 
                type="text" 
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#1e293b] dark:text-[#f8fafc] font-normal focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                value={getVal('nama')} 
                onChange={(e) => setVal('nama', e.target.value)} 
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400">
                Jabatan / Status Pekerjaan
              </label>
              <input 
                type="text" 
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#1e293b] dark:text-[#f8fafc] font-normal focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                value={getVal('jabatan')} 
                onChange={(e) => setVal('jabatan', e.target.value)} 
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400">
                Tempat Lahir
              </label>
              <input 
                type="text" 
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#1e293b] dark:text-[#f8fafc] font-normal focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                value={dataObj?.tempat_lahir !== undefined ? dataObj.tempat_lahir : getVal('tempatLahir')} 
                onChange={(e) => {
                  setDataObj({
                    ...dataObj,
                    tempat_lahir: e.target.value,
                    tempatLahir: e.target.value
                  });
                }} 
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400">
                Tanggal Lahir
              </label>
              <input 
                type="text" 
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#1e293b] dark:text-[#f8fafc] font-normal focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                value={dataObj?.tanggal_lahir !== undefined ? dataObj.tanggal_lahir : getVal('tanggalLahir')} 
                onChange={(e) => {
                  setDataObj({
                    ...dataObj,
                    tanggal_lahir: e.target.value,
                    tanggalLahir: e.target.value
                  });
                }} 
              />
            </div>
          </div>

          <div className="space-y-1.5 pt-2">
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400">
              Ringkasan Bio (Pendek)
            </label>
            <AutoResizingTextarea 
              value={getVal('bio')} 
              onChange={(val) => setVal('bio', val)} 
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#1e293b] dark:text-[#f8fafc] font-normal focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all min-h-[50px] block"
              placeholder="Deskripsi singkat yang tampil di bagian atas portofolio..."
            />
          </div>

          <div className="space-y-1.5 pt-2">
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400">
              Tentang Saya (Lengkap)
            </label>
            <AutoResizingTextarea 
              value={getVal('tentang')} 
              onChange={(val) => setVal('tentang', val)} 
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#1e293b] dark:text-[#f8fafc] font-normal focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all min-h-[90px] block"
              placeholder="Deskripsi lengkap mengenai siapa Anda..."
            />
          </div>
        </div>

        {/* Section 2: Kontak & Media Sosial */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800/60 pb-3">
            <span className="w-1.5 h-5 bg-accent rounded-full"></span>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#1e293b] dark:text-[#f8fafc]">
              Kontak & Media Sosial
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400">
                Email
              </label>
              <input 
                type="email" 
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#1e293b] dark:text-[#f8fafc] font-normal focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                value={getVal('email')} 
                onChange={(e) => setVal('email', e.target.value)} 
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400">
                Telepon
              </label>
              <input 
                type="text" 
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#1e293b] dark:text-[#f8fafc] font-normal focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                value={getVal('telepon')} 
                onChange={(e) => setVal('telepon', e.target.value)} 
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400">
                Whatsapp
              </label>
              <input 
                type="text" 
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#1e293b] dark:text-[#f8fafc] font-normal focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                value={getVal('whatsapp')} 
                onChange={(e) => setVal('whatsapp', e.target.value)} 
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400">
                Lokasi (Negara / Kota)
              </label>
              <input 
                type="text" 
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#1e293b] dark:text-[#f8fafc] font-normal focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                value={getVal('lokasi')} 
                onChange={(e) => setVal('lokasi', e.target.value)} 
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400">
                Instagram Link (URL)
              </label>
              <input 
                type="text" 
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#1e293b] dark:text-[#f8fafc] font-normal focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                value={getVal('instagram')} 
                onChange={(e) => setVal('instagram', e.target.value)} 
              />
            </div>
          </div>
        </div>

        {/* Section: Kredensial & Keamanan */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800/60 pb-3">
            <span className="w-1.5 h-5 bg-accent rounded-full"></span>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#1e293b] dark:text-[#f8fafc]">
              Kredensial & Keamanan
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400">
                Password Admin (Akses Panel)
              </label>
              <input 
                type="text" 
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#1e293b] dark:text-[#f8fafc] font-normal focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                value={getVal('password')} 
                onChange={(e) => setVal('password', e.target.value)} 
                placeholder="Masukkan password admin..."
              />
              <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                Password yang digunakan untuk masuk ke halaman Dashboard Admin ini.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400">
                Email App Password (Gmail SMTP)
              </label>
              <input 
                type="text" 
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#1e293b] dark:text-[#f8fafc] font-normal focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                value={dataObj?.email_app_password !== undefined ? dataObj.email_app_password : getVal('emailAppPassword')} 
                onChange={(e) => {
                  setDataObj({
                    ...dataObj,
                    email_app_password: e.target.value,
                    emailAppPassword: e.target.value
                  });
                }} 
                placeholder="Masukkan 16-digit Gmail App Password..."
              />
              <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                App Password 16-digit dari Google Account Security untuk pengiriman lamaran via Gmail.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Pendidikan Terakhir */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800/60 pb-3">
            <span className="w-1.5 h-5 bg-accent rounded-full"></span>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#1e293b] dark:text-[#f8fafc]">
              Pendidikan Terakhir (Sekilas)
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400">
                Institusi Pendidikan Terakhir
              </label>
              <input 
                type="text" 
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#1e293b] dark:text-[#f8fafc] font-normal focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                value={dataObj?.pendidikan_terakhir !== undefined ? dataObj.pendidikan_terakhir : getVal('pendidikanTerakhir')} 
                onChange={(e) => {
                  setDataObj({
                    ...dataObj,
                    pendidikan_terakhir: e.target.value,
                    pendidikanTerakhir: e.target.value
                  });
                }} 
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400">
                Jurusan / Program Studi
              </label>
              <input 
                type="text" 
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#1e293b] dark:text-[#f8fafc] font-normal focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                value={getVal('jurusan')} 
                onChange={(e) => setVal('jurusan', e.target.value)} 
              />
            </div>
          </div>
        </div>

        {/* Section 4: Alamat & Domisili */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-5 bg-accent rounded-full"></span>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#1e293b] dark:text-[#f8fafc]">
                Daftar Alamat / Tempat Tinggal
              </h3>
            </div>
            <button 
              type="button"
              onClick={handleAddAlamat}
              className="px-3 py-1.5 text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer border border-slate-200 dark:border-slate-700 inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Tambah Alamat
            </button>
          </div>

          <div className="space-y-4">
            {alamatList.map((alamatItem, index) => (
              <div key={index} className="flex flex-col sm:flex-row gap-4 items-start sm:items-end w-full pb-4 border-b border-slate-100 dark:border-slate-800/40 last:border-b-0 last:pb-0">
                <div className="w-full sm:w-1/4 space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400">
                    Label Alamat
                  </label>
                  <input 
                    type="text" 
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-xs sm:text-sm text-[#1e293b] dark:text-[#f8fafc] font-normal focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                    value={alamatItem.label || ''} 
                    onChange={(e) => handleUpdateAlamat(index, 'label', e.target.value)}
                    placeholder="Misal: Domisili"
                  />
                </div>
                <div className="flex-grow w-full space-y-1.5">
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400">
                    Detail Alamat Lengkap
                  </label>
                  <AutoResizingTextarea 
                    value={alamatItem.alamat || ''} 
                    onChange={(val) => handleUpdateAlamat(index, 'alamat', val)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-xs sm:text-sm text-[#1e293b] dark:text-[#f8fafc] font-normal focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all min-h-[40px] block"
                    placeholder="Tulis alamat lengkap..."
                  />
                </div>
                <div className="shrink-0 pb-1.5 self-start sm:self-end">
                  <button 
                    type="button"
                    onClick={() => handleDeleteAlamat(index)}
                    className="text-red-500 hover:text-red-700 p-2.5 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-all cursor-pointer inline-flex items-center justify-center active:scale-95 border border-transparent hover:border-red-200 dark:hover:border-red-900/40"
                    title="Hapus alamat"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
