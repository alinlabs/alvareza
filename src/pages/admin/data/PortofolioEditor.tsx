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

export default function PortofolioEditor() {
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
      const response = await ApiService.get<any>('portofolio');
      if (!response.success) {
        throw new Error(response.message || 'Gagal memuat data portofolio');
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
      const response = await ApiService.post('portofolio', dataObj);
      if (!response.success) {
        throw new Error(response.error || response.message || 'Gagal menyimpan data');
      }
      
      setSuccessMsg('Data portofolio berhasil disimpan!');
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
      id: `portfolio-${Date.now()}`,
      judul: '',
      kategori: 'Web App',
      deskripsi: '',
      teknologi: [],
      gambar: '',
      link: '',
      tanggal: new Date().toISOString().split('T')[0],
      fitur: []
    };
    setDataObj([newItem, ...dataObj]);
  };

  const handleDeleteItem = async (index: number) => {
    const item = dataObj[index];
    if (item.id && window.confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      try {
        const response = await ApiService.delete('portofolio', { body: JSON.stringify({ id: item.id }) });
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
          <p className="text-slate-500 text-sm">Memuat data portofolio...</p>
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
          const technologies = Array.isArray(item.teknologi) ? item.teknologi : [];
          const features = Array.isArray(item.fitur) ? item.fitur : [];
          const gambar = item.gambar !== undefined ? item.gambar : (item.image || '');
          const link = item.link !== undefined ? item.link : (item.demoUrl || item.demo_url || item.tautan || '');

          return (
            <div key={index} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-10 shadow-sm animate-fadeIn">
              <div className="space-y-6">
                {/* Header section styled like Profil page */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-5 bg-accent rounded-full shrink-0"></span>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-[#1e293b] dark:text-[#f8fafc] line-clamp-1">
                      {item.judul ? item.judul : 'Portofolio Baru'}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteItem(index)}
                    className="text-red-500 hover:text-red-700 text-xs px-3 py-1.5 bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-900/50 rounded-xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shrink-0 inline-flex items-center gap-1"
                    title="Hapus Portofolio"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Hapus</span>
                  </button>
                </div>

                {/* Row 1: Judul | Kategori | Tanggal */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400">Judul</label>
                      <input 
                        type="text" 
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#1e293b] dark:text-[#f8fafc] font-normal focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                        value={item.judul || ''} 
                        onChange={(e) => {
                          const newArr = [...dataObj];
                          newArr[index] = { ...item, judul: e.target.value };
                          setDataObj(newArr);
                        }} 
                        placeholder="Sistem Manajemen Inventory Toko"
                      />
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400">Kategori</label>
                      <input 
                        type="text" 
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#1e293b] dark:text-[#f8fafc] font-normal focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                        value={item.kategori || ''} 
                        onChange={(e) => {
                          const newArr = [...dataObj];
                          newArr[index] = { ...item, kategori: e.target.value };
                          setDataObj(newArr);
                        }} 
                        placeholder="Web App, Mobile App, IoT, dll."
                      />
                    </div>
                  </div>

                  {/* Row 2: Gambar | Tanggal Rilis */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-1.5">
                      <label className="block text-xs font-bold text-slate-500">Gambar (URL / Path)</label>
                      <div className="flex gap-3 items-center">
                        {gambar && (
                          <div className="w-16 aspect-video rounded-lg overflow-hidden border border-slate-200 shrink-0 bg-slate-50">
                            <img 
                              src={gambar} 
                              alt="Preview" 
                              className="w-full h-full object-cover" 
                              onError={(e) => {
                                e.currentTarget.src = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop';
                              }}
                            />
                          </div>
                        )}
                        <input 
                          type="text" 
                          className="flex-grow bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#1e293b] font-normal focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                          value={gambar} 
                          onChange={(e) => {
                            const newArr = [...dataObj];
                            newArr[index] = { 
                              ...item, 
                              gambar: e.target.value,
                              image: e.target.value 
                            };
                            setDataObj(newArr);
                          }} 
                          placeholder="/gambar/portofolio/umkm_finance.webp"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-500">Tanggal</label>
                      <input 
                        type="date" 
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs sm:text-sm text-[#1e293b] font-normal focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                        value={item.tanggal || ''} 
                        onChange={(e) => {
                          const newArr = [...dataObj];
                          newArr[index] = { ...item, tanggal: e.target.value };
                          setDataObj(newArr);
                        }} 
                      />
                    </div>
                  </div>

                  {/* Row 3: Tautan Kunjungan Proyek (No Repository GitHub) */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-500">Tautan Kunjungan Proyek (URL)</label>
                    <input 
                      type="text" 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#1e293b] font-normal focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                      value={link} 
                      onChange={(e) => {
                        const newArr = [...dataObj];
                        newArr[index] = { 
                          ...item, 
                          link: e.target.value,
                          demoUrl: e.target.value,
                          demo_url: e.target.value,
                          tautan: e.target.value
                        };
                        setDataObj(newArr);
                      }} 
                      placeholder="https://tautan-kunjungan-proyek.com"
                    />
                  </div>

                  {/* Row 4: Deskripsi Proyek */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-500">Deskripsi</label>
                    <AutoResizingTextarea 
                      value={item.deskripsi || ''} 
                      onChange={(val) => {
                        const newArr = [...dataObj];
                        newArr[index] = { ...item, deskripsi: val };
                        setDataObj(newArr);
                      }} 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#1e293b] font-normal focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all min-h-[60px] block"
                      placeholder="Tulis deskripsi ringkas dan latar belakang pengerjaan proyek ini..."
                    />
                  </div>

                  {/* Row 5: Alat & Teknologi */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Alat / Teknologi Pendukung</label>
                      <button 
                        type="button"
                        onClick={() => {
                          const newArr = [...dataObj];
                          newArr[index] = { ...item, teknologi: [...technologies, ''] };
                          setDataObj(newArr);
                        }}
                        className="px-3 py-1.5 text-xs font-bold bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200 transition-colors cursor-pointer border border-slate-200 inline-flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" /> Tambah Alat
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {technologies.map((tech: string, tIdx: number) => {
                        // Parse current value
                        let category = '';
                        let name = tech;
                        if (tech.includes(':')) {
                          const parts = tech.split(':');
                          category = parts[0].trim();
                          name = parts.slice(1).join(':').trim();
                        }

                        const updateItem = (newCat: string, newName: string) => {
                          const combined = newCat ? `${newCat}: ${newName}` : newName;
                          const newArr = [...dataObj];
                          const newTechs = [...technologies];
                          newTechs[tIdx] = combined;
                          newArr[index] = { ...item, teknologi: newTechs };
                          setDataObj(newArr);
                        };

                        return (
                          <div key={tIdx} className="flex flex-col gap-1.5 p-3 bg-slate-50/50 border border-slate-100 rounded-xl">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-slate-400 uppercase">Alat #{tIdx + 1}</span>
                              <button 
                                type="button"
                                onClick={() => {
                                  const newArr = [...dataObj];
                                  const newTechs = [...technologies];
                                  newTechs.splice(tIdx, 1);
                                  newArr[index] = { ...item, teknologi: newTechs };
                                  setDataObj(newArr);
                                }}
                                className="text-red-500 hover:text-red-700 p-1 hover:bg-red-50 rounded-lg transition-colors"
                                title="Hapus Alat"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            
                            <div className="space-y-1">
                              <input 
                                type="text" 
                                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-[#1e293b] focus:outline-none focus:ring-1 focus:ring-accent/30 focus:border-accent transition-all font-medium"
                                value={category} 
                                onChange={(e) => updateItem(e.target.value, name)} 
                                placeholder="Kategori (cth: Desain, Frontend)"
                              />
                              <input 
                                type="text" 
                                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-[#1e293b] focus:outline-none focus:ring-1 focus:ring-accent/30 focus:border-accent transition-all font-semibold"
                                value={name} 
                                onChange={(e) => updateItem(category, e.target.value)} 
                                placeholder="Nama Alat (cth: Figma, React)"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Row 6: Fitur / Features List */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Fitur Utama Proyek</label>
                      <button 
                        type="button"
                        onClick={() => {
                          const newArr = [...dataObj];
                          newArr[index] = { ...item, fitur: [...features, ''] };
                          setDataObj(newArr);
                        }}
                        className="px-3 py-1.5 text-xs font-bold bg-slate-100 text-slate-500 rounded-xl hover:bg-slate-200 transition-colors cursor-pointer border border-slate-200 inline-flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" /> Tambah Fitur
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      {features.map((feature: string, fIdx: number) => (
                        <div key={fIdx} className="flex items-center gap-3">
                          <input 
                            type="text" 
                            className="flex-grow bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#1e293b] font-normal focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                            value={feature} 
                            onChange={(e) => {
                              const newArr = [...dataObj];
                              const newFeatures = [...features];
                              newFeatures[fIdx] = e.target.value;
                              newArr[index] = { ...item, fitur: newFeatures };
                              setDataObj(newArr);
                            }} 
                            placeholder="Manajemen stok real-time dengan notifikasi otomatis..."
                          />
                          <button 
                            type="button"
                            onClick={() => {
                              const newArr = [...dataObj];
                              const newFeatures = [...features];
                              newFeatures.splice(fIdx, 1);
                              newArr[index] = { ...item, fitur: newFeatures };
                              setDataObj(newArr);
                            }}
                            className="text-red-500 hover:text-red-700 p-2.5 hover:bg-red-50 rounded-xl shrink-0"
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
