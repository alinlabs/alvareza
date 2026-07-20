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

export default function OrganisasiEditor() {
  const [dataObj, setDataObj] = useState<any[]>([]);
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
      const response = await ApiService.get<any>('pengalaman-organisasi');
      if (!response.success) {
        throw new Error(response.message || 'Gagal memuat data pengalaman organisasi');
      }
      const data = response.data;
      setDataObj(Array.isArray(data) ? data : []);
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
      const response = await ApiService.post('pengalaman-organisasi', dataObj);
      if (!response.success) {
        throw new Error(response.error || response.message || 'Gagal menyimpan data');
      }
      
      setSuccessMsg('Data organisasi berhasil disimpan!');
      setTimeout(() => {
        setSuccessMsg(null);
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat menyimpan data');
    } finally {
      setSaving(false);
    }
  };

  const handleAddItem = () => {
    const newItem = {
      id: `org-${Date.now()}`,
      peran: '',
      organisasi: '',
      logoUrl: '',
      logo_url: '',
      mulai: '',
      selesai: '',
      deskripsi: '',
      pencapaian: []
    };
    setDataObj([newItem, ...dataObj]);
  };

  const handleDeleteItem = async (index: number) => {
    const item = dataObj[index];
    if (item.id && window.confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      try {
        const response = await ApiService.delete('pengalaman-organisasi', { body: JSON.stringify({ id: item.id }) });
        if (!response.success) {
          setError(response.message || 'Gagal menghapus data di server');
          return;
        }
      } catch (err: any) {
        setError(err.message || 'Terjadi kesalahan saat menghapus data');
        return;
      }
    } else if (item.id) {
      return; // Cancelled
    }
    
    const newArr = [...dataObj];
    newArr.splice(index, 1);
    setDataObj(newArr);
  };

  const saveButtonDesktop = (
    <div className="flex items-center gap-3">
      <button
        onClick={handleSave}
        disabled={saving}
        className="p-2 text-[#02227E] hover:text-[#02227E]/80 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all hover:scale-110 active:scale-95 flex items-center justify-center"
        title="Simpan Perubahan"
      >
        {saving ? (
          <div className="w-5 h-5 border-2 border-[#02227E]/30 border-t-[#02227E] rounded-full animate-spin" />
        ) : (
          <Save className="w-5 h-5" />
        )}
      </button>
      <button
        onClick={handleAddItem}
        className="flex items-center gap-2 px-5 py-2.5 bg-[#02227E] hover:bg-[#02227E]/90 text-white font-semibold text-sm rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-sm shadow-[#02227E]/10"
      >
        <Plus className="w-4 h-4" />
        Buat Baru
      </button>
    </div>
  );

  const saveButtonMobile = (
    <div className="flex items-center gap-2">
      <button
        onClick={handleSave}
        disabled={saving}
        className="p-1.5 text-[#02227E] hover:text-[#02227E]/80 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all active:scale-95 flex items-center justify-center"
        title="Simpan"
      >
        {saving ? (
          <div className="w-4 h-4 border-2 border-[#02227E]/30 border-t-[#02227E] rounded-full animate-spin" />
        ) : (
          <Save className="w-4 h-4" />
        )}
      </button>
      <button
        onClick={handleAddItem}
        className="flex items-center gap-1.5 px-3 py-2 bg-[#02227E] hover:bg-[#02227E]/90 text-white font-bold text-xs rounded-xl transition-all active:scale-[0.95] cursor-pointer"
      >
        <Plus className="w-3.5 h-3.5" />
        Buat Baru
      </button>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 text-sm">Memuat data organisasi...</p>
        </div>
      </div>
    );
  }

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

      <div className="space-y-10">
        {dataObj.map((item, index) => {
          const logo = item.logoUrl !== undefined ? item.logoUrl : (item.logo_url || '');
          const mulai = item.mulai || item.periode?.masuk || '';
          const selesai = item.selesai || item.periode?.keluar || '';
          const achievements = Array.isArray(item.pencapaian) ? item.pencapaian : [];

          return (
            <div key={index} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-10 shadow-sm animate-fadeIn">
              <div className="space-y-6">
                {/* Header section styled like Profil page */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-5 bg-accent rounded-full shrink-0"></span>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-[#1e293b] dark:text-[#f8fafc] line-clamp-1">
                      {item.organisasi ? item.organisasi : 'Organisasi Baru'}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteItem(index)}
                    className="text-red-500 hover:text-red-700 text-xs px-3 py-1.5 bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-900/50 rounded-xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shrink-0 inline-flex items-center gap-1"
                    title="Hapus Organisasi"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Hapus</span>
                  </button>
                </div>

                {/* Row 1: Peran | Organisasi | Logo */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400">Organisasi</label>
                      <input 
                        type="text" 
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#1e293b] dark:text-[#f8fafc] font-normal focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                        value={item.organisasi || ''} 
                        onChange={(e) => {
                          const newArr = [...dataObj];
                          newArr[index] = { ...item, organisasi: e.target.value };
                          setDataObj(newArr);
                        }} 
                        placeholder="STIE Wikara"
                      />
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400">Peran</label>
                      <input 
                        type="text" 
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#1e293b] dark:text-[#f8fafc] font-normal focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                        value={item.peran || ''} 
                        onChange={(e) => {
                          const newArr = [...dataObj];
                          newArr[index] = { ...item, peran: e.target.value };
                          setDataObj(newArr);
                        }} 
                        placeholder="Presiden Mahasiswa"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400">Logo</label>
                      <div className="flex gap-4 items-center">
                        <div className="flex-grow">
                          <input 
                            type="text" 
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#1e293b] dark:text-[#f8fafc] font-normal focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                            value={logo} 
                            onChange={(e) => {
                              const newArr = [...dataObj];
                              newArr[index] = { 
                                ...item, 
                                logoUrl: e.target.value,
                                logo_url: e.target.value 
                              };
                              setDataObj(newArr);
                            }} 
                            placeholder="/gambar/logo/bem.png"
                          />
                        </div>
                        <div className="shrink-0">
                          <div className="w-[42px] h-[42px] bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center overflow-hidden shadow-sm">
                            {logo ? (
                              <img 
                                src={logo} 
                                alt="Pratinjau Logo" 
                                className="w-full h-full object-contain p-1"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <span className="text-[10px] text-slate-400 font-bold uppercase">1:1</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Row 2: Periode Masuk & Keluar */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400">Mulai</label>
                      <input 
                        type="text" 
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#1e293b] dark:text-[#f8fafc] font-normal focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                        value={mulai} 
                        onChange={(e) => {
                          const newArr = [...dataObj];
                          newArr[index] = { 
                            ...item, 
                            mulai: e.target.value 
                          };
                          setDataObj(newArr);
                        }} 
                        placeholder="2024"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400">Selesai</label>
                      <input 
                        type="text" 
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#1e293b] dark:text-[#f8fafc] font-normal focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                        value={selesai} 
                        onChange={(e) => {
                          const newArr = [...dataObj];
                          newArr[index] = { 
                            ...item, 
                            selesai: e.target.value 
                          };
                          setDataObj(newArr);
                        }} 
                        placeholder="2025"
                      />
                    </div>
                  </div>

                  {/* Row 3: Deskripsi */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400">Deskripsi</label>
                    <AutoResizingTextarea 
                      value={item.deskripsi || ''} 
                      onChange={(val) => {
                        const newArr = [...dataObj];
                        newArr[index] = { ...item, deskripsi: val };
                        setDataObj(newArr);
                      }} 
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#1e293b] dark:text-[#f8fafc] font-normal focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all min-h-[60px] block"
                      placeholder="Deskripsi..."
                    />
                  </div>

                  {/* Row 4: Pencapaian / Achievements */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Pencapaian</label>
                      <button 
                        type="button"
                        onClick={() => {
                          const newArr = [...dataObj];
                          newArr[index] = { ...item, pencapaian: [...achievements, ''] };
                          setDataObj(newArr);
                        }}
                        className="px-3 py-1.5 text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer border border-slate-200 dark:border-slate-700 inline-flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" /> Tambah
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      {achievements.map((ach: string, aIdx: number) => (
                        <div key={aIdx} className="flex items-center gap-3">
                          <input 
                            type="text" 
                            className="flex-grow bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#1e293b] dark:text-[#f8fafc] font-normal focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                            value={ach} 
                            onChange={(e) => {
                              const newArr = [...dataObj];
                              const newAch = [...achievements];
                              newAch[aIdx] = e.target.value;
                              newArr[index] = { ...item, pencapaian: newAch };
                              setDataObj(newArr);
                            }} 
                            placeholder="Program kerja atau pencapaian kerja..."
                          />
                          <button 
                            type="button"
                            onClick={() => {
                              const newArr = [...dataObj];
                              const newAch = [...achievements];
                              newAch.splice(aIdx, 1);
                              newArr[index] = { ...item, pencapaian: newAch };
                              setDataObj(newArr);
                            }}
                            className="text-red-500 hover:text-red-700 p-2.5 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors cursor-pointer shrink-0"
                            title="Hapus pencapaian"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
