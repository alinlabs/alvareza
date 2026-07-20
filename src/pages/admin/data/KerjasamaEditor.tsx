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

export default function KerjasamaEditor() {
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
      const response = await ApiService.get<any>('pengalaman-kerjasama');
      if (!response.success) {
        throw new Error(response.message || 'Gagal memuat data pengalaman kerjasama');
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
      const response = await ApiService.post('pengalaman-kerjasama', dataObj);
      if (!response.success) {
        throw new Error(response.error || response.message || 'Gagal menyimpan data');
      }
      
      setSuccessMsg('Data kerjasama berhasil disimpan!');
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
      id: `collab-${Date.now()}`,
      partner: '',
      peran: '',
      proyek: '',
      mulai: '',
      selesai: '',
      bidang: '',
      deskripsi: '',
      tujuan: [],
      dampak: [],
      logoUrl: '',
      logo_url: ''
    };
    setDataObj([newItem, ...dataObj]);
  };

  const handleDeleteItem = async (index: number) => {
    const item = dataObj[index];
    if (item.id && window.confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      try {
        const response = await ApiService.delete('pengalaman-kerjasama', { body: JSON.stringify({ id: item.id }) });
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
          <p className="text-slate-500 text-sm">Memuat data kerjasama...</p>
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
          const tujuans = Array.isArray(item.tujuan) ? item.tujuan : [];
          const dampaks = Array.isArray(item.dampak) ? item.dampak : [];
          const logo = item.logoUrl !== undefined ? item.logoUrl : (item.logo_url || '');

          return (
            <div key={index} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-10 shadow-sm animate-fadeIn">
              <div className="space-y-6">
                {/* Header section styled like Profil page */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-5 bg-accent rounded-full shrink-0"></span>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-[#1e293b] dark:text-[#f8fafc] line-clamp-1">
                      {item.partner ? item.partner : 'Kerjasama Baru'}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteItem(index)}
                    className="text-red-500 hover:text-red-700 text-xs px-3 py-1.5 bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-900/50 rounded-xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shrink-0 inline-flex items-center gap-1"
                    title="Hapus Kerjasama"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Hapus</span>
                  </button>
                </div>

                                  {/* Row 1: Partner | Bidang | Logo */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400">Partner</label>
                      <input 
                        type="text" 
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#1e293b] dark:text-[#f8fafc] font-normal focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                        value={item.partner || ''} 
                        onChange={(e) => {
                          const newArr = [...dataObj];
                          newArr[index] = { ...item, partner: e.target.value };
                          setDataObj(newArr);
                        }} 
                        placeholder="Melin Parfum"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400">Bidang</label>
                      <input 
                        type="text" 
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#1e293b] dark:text-[#f8fafc] font-normal focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                        value={item.bidang || ''} 
                        onChange={(e) => {
                          const newArr = [...dataObj];
                          newArr[index] = { ...item, bidang: e.target.value };
                          setDataObj(newArr);
                        }} 
                        placeholder="Kosmetik"
                      />
                    </div>

                    <div className="flex gap-4 items-end">
                      <div className="flex-grow space-y-1.5">
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400">
                          Logo
                        </label>
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
                          placeholder="URL Gambar"
                        />
                      </div>
                      <div className="shrink-0">
                        <div className="w-[46px] h-[46px] bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center overflow-hidden shadow-sm">
                          {logo ? (
                            <img 
                              src={logo} 
                              alt="Pratinjau Logo" 
                              className="w-full h-full object-contain p-1"
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                console.error("Failed to load logo preview", logo);
                              }}
                            />
                          ) : (
                            <span className="text-[10px] text-slate-400 font-bold uppercase">1:1</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Row 2: Peran | Proyek | Mulai | Selesai */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                        placeholder="Founder"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400">Proyek</label>
                      <input 
                        type="text" 
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#1e293b] dark:text-[#f8fafc] font-normal focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                        value={item.proyek || ''} 
                        onChange={(e) => {
                          const newArr = [...dataObj];
                          newArr[index] = { ...item, proyek: e.target.value };
                          setDataObj(newArr);
                        }} 
                        placeholder="Pembangunan Brand"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400">Mulai</label>
                      <input 
                        type="text" 
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#1e293b] dark:text-[#f8fafc] font-normal focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                        value={item.mulai || ''} 
                        onChange={(e) => {
                          const val = e.target.value;
                          const newArr = [...dataObj];
                          newArr[index] = { 
                            ...item, 
                            mulai: val
                          };
                          setDataObj(newArr);
                        }} 
                        placeholder="2023"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400">Selesai</label>
                      <input 
                        type="text" 
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#1e293b] dark:text-[#f8fafc] font-normal focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                        value={item.selesai || ''} 
                        onChange={(e) => {
                          const val = e.target.value;
                          const newArr = [...dataObj];
                          newArr[index] = { 
                            ...item, 
                            selesai: val
                          };
                          setDataObj(newArr);
                        }} 
                        placeholder="2024"
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
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#1e293b] dark:text-[#f8fafc] font-normal focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all min-h-[50px] block"
                      placeholder="Deskripsi..."
                    />
                  </div>

                  {/* Row 4: Tujuan / Goals */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Tujuan</label>
                      <button 
                        type="button"
                        onClick={() => {
                          const newArr = [...dataObj];
                          newArr[index] = { ...item, tujuan: [...tujuans, ''] };
                          setDataObj(newArr);
                        }}
                        className="px-3 py-1.5 text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer border border-slate-200 dark:border-slate-700 inline-flex items-center gap-1.5"
                      >
                        <Plus className="w-3 h-3" /> Tambah
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {tujuans.map((tujuan: string, tIdx: number) => (
                        <div key={tIdx} className="flex items-center gap-3">
                          <input 
                            type="text" 
                            className="flex-grow bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#1e293b] dark:text-[#f8fafc] font-normal focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
                            value={tujuan} 
                            onChange={(e) => {
                              const newArr = [...dataObj];
                              const newTujuan = [...tujuans];
                              newTujuan[tIdx] = e.target.value;
                              newArr[index] = { ...item, tujuan: newTujuan };
                              setDataObj(newArr);
                            }} 
                            placeholder="Misi..."
                          />
                          <button 
                            type="button"
                            onClick={() => {
                              const newArr = [...dataObj];
                              const newTujuan = [...tujuans];
                              newTujuan.splice(tIdx, 1);
                              newArr[index] = { ...item, tujuan: newTujuan };
                              setDataObj(newArr);
                            }}
                            className="text-red-500 hover:text-red-700 p-2.5 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors cursor-pointer shrink-0"
                            title="Hapus tujuan"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Row 5: Dampak / KPI Metrics */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Dampak</label>
                      <button 
                        type="button"
                        onClick={() => {
                          const newArr = [...dataObj];
                          newArr[index] = { ...item, dampak: [...dampaks, { indikator: '', persentase: 80 }] };
                          setDataObj(newArr);
                        }}
                        className="px-3 py-1.5 text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer border border-slate-200 dark:border-slate-700 inline-flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" /> Tambah
                      </button>
                    </div>

                    <div className="space-y-3">
                      {dampaks.map((dampakItem: any, dIdx: number) => (
                        <div key={dIdx} className="flex flex-col sm:flex-row items-center gap-3 w-full">
                          <div className="flex-grow w-full">
                            <input 
                              type="text"
                              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#1e293b] dark:text-[#f8fafc] font-normal focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                              value={dampakItem.indikator || ''}
                              onChange={(e) => {
                                const newArr = [...dataObj];
                                const newDampak = [...dampaks];
                                newDampak[dIdx] = { ...dampakItem, indikator: e.target.value };
                                newArr[index] = { ...item, dampak: newDampak };
                                setDataObj(newArr);
                              }}
                              placeholder="Metrik Dampak (contoh: Peningkatan kepuasan pelanggan, Efisiensi proses, dsb.)"
                            />
                          </div>
                          
                          <div className="w-full sm:w-32 shrink-0 relative">
                            <input 
                              type="number"
                              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-4 pr-10 py-2.5 text-xs sm:text-sm text-[#1e293b] dark:text-[#f8fafc] font-normal focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              value={dampakItem.persentase !== undefined ? dampakItem.persentase : 0}
                              onChange={(e) => {
                                const newArr = [...dataObj];
                                const newDampak = [...dampaks];
                                newDampak[dIdx] = { ...dampakItem, persentase: parseInt(e.target.value) || 0 };
                                newArr[index] = { ...item, dampak: newDampak };
                                setDataObj(newArr);
                              }}
                              min="0"
                              max="100"
                              placeholder="Persen"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">%</span>
                          </div>

                          <button 
                            type="button"
                            onClick={() => {
                              const newArr = [...dataObj];
                              const newDampak = [...dampaks];
                              newDampak.splice(dIdx, 1);
                              newArr[index] = { ...item, dampak: newDampak };
                              setDataObj(newArr);
                            }}
                            className="text-red-500 hover:text-red-700 p-2.5 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors cursor-pointer shrink-0 w-full sm:w-auto flex items-center justify-center gap-1.5 sm:inline-flex"
                            title="Hapus metrik"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span className="sm:hidden text-xs font-bold">Hapus Metrik</span>
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
