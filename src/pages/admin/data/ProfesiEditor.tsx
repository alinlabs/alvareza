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

export default function ProfesiEditor() {
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
      const response = await ApiService.get<any>('pengalaman-profesi');
      if (!response.success) {
        throw new Error(response.message || 'Gagal memuat data pengalaman profesi');
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
      const response = await ApiService.post('pengalaman-profesi', dataObj);
      if (!response.success) {
        throw new Error(response.error || response.message || 'Gagal menyimpan data');
      }
      
      setSuccessMsg('Data profesi berhasil disimpan!');
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
      id: `kerja-${Date.now()}`,
      logoUrl: '',
      logo_url: '',
      paklaring: '',
      peran: '',
      tingkatan: 'Full-Time',
      perusahaan: '',
      mulai: '',
      selesai: 'Sekarang',
      industri: '',
      deskripsi: '',
      spesialisasi: [],
      tugasTanggungJawab: []
    };
    setDataObj([newItem, ...dataObj]);
  };

  const handleDeleteItem = async (index: number) => {
    const item = dataObj[index];
    if (item.id && window.confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      try {
        const response = await ApiService.delete('pengalaman-profesi', { body: JSON.stringify({ id: item.id }) });
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
          <p className="text-slate-500 text-sm">Memuat data profesi...</p>
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
          const paklaring = item.paklaring || '';
          const mulai = item.mulai || item.periode?.masuk || '';
          const selesai = item.selesai || item.periode?.keluar || '';
          const spesialisasi = Array.isArray(item.spesialisasi) ? item.spesialisasi : [];
          const tugas = Array.isArray(item.tugasTanggungJawab) 
            ? item.tugasTanggungJawab 
            : (Array.isArray(item.tugas_tanggung_jawab) ? item.tugas_tanggung_jawab : []);

          return (
            <div key={index} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-10 shadow-sm animate-fadeIn">
              <div className="space-y-6">
                {/* Header section styled like Profil page */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-5 bg-accent rounded-full shrink-0"></span>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-[#1e293b] dark:text-[#f8fafc] line-clamp-1">
                      {item.perusahaan ? item.perusahaan : 'Profesi Baru'}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteItem(index)}
                    className="text-red-500 hover:text-red-700 text-xs px-3 py-1.5 bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-900/50 rounded-xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer shrink-0 inline-flex items-center gap-1"
                    title="Hapus Profesi"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Hapus</span>
                  </button>
                </div>

                {/* Row 1: Perusahaan | Industri | Logo */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400">Perusahaan</label>
                      <input 
                        type="text" 
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#1e293b] dark:text-[#f8fafc] font-normal focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                        value={item.perusahaan || ''} 
                        onChange={(e) => {
                          const newArr = [...dataObj];
                          newArr[index] = { ...item, perusahaan: e.target.value };
                          setDataObj(newArr);
                        }} 
                        placeholder="PT Shansudza Indonesia"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400">Industri</label>
                      <input 
                        type="text" 
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#1e293b] dark:text-[#f8fafc] font-normal focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                        value={item.industri || ''} 
                        onChange={(e) => {
                          const newArr = [...dataObj];
                          newArr[index] = { ...item, industri: e.target.value };
                          setDataObj(newArr);
                        }} 
                        placeholder="Manajemen Proyek"
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
                            placeholder="https://url-logo.png"
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

                  {/* Row 2: Tingkatan | Peran | Mulai | Selesai */}
                  <div className="grid grid-cols-1 md:grid-cols-[2fr_3fr_1fr_1fr] gap-6">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400">Tingkatan</label>
                      <input 
                        type="text" 
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#1e293b] dark:text-[#f8fafc] font-normal focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                        value={item.tingkatan || ''} 
                        onChange={(e) => {
                          const newArr = [...dataObj];
                          newArr[index] = { ...item, tingkatan: e.target.value };
                          setDataObj(newArr);
                        }} 
                        placeholder="Full-Time, Project Based, Freelance"
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
                        placeholder="Operational Manager"
                      />
                    </div>

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
                        placeholder="2025"
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
                        placeholder="Sekarang, 2026 (Tulis Sekarang jika masih aktif)"
                      />
                    </div>
                  </div>

                  {/* Row 3: Paklaring */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400">Paklaring</label>
                      <input 
                        type="text" 
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#1e293b] dark:text-[#f8fafc] font-normal focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                        value={paklaring} 
                        onChange={(e) => {
                          const newArr = [...dataObj];
                          newArr[index] = { ...item, paklaring: e.target.value };
                          setDataObj(newArr);
                        }} 
                        placeholder="Jalur file atau link bukti kerja..."
                      />
                    </div>
                  </div>

                  {/* Row 4: Deskripsi Umum */}
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
                      placeholder="Tulis rangkuman ringkas mengenai hasil kontribusi Anda..."
                    />
                  </div>

                  {/* Row 5: Spesialisasi / Tags */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/40 pb-1.5">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Spesialisasi</label>
                      <button 
                        type="button"
                        onClick={() => {
                          const newArr = [...dataObj];
                          newArr[index] = { ...item, spesialisasi: [...spesialisasi, ''] };
                          setDataObj(newArr);
                        }}
                        className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors inline-flex items-center gap-1 text-[11px] font-bold cursor-pointer"
                      >
                        <Plus className="w-3 h-3" /> Tambah Tag Keahlian
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                      {spesialisasi.map((spec: string, sIdx: number) => (
                        <div key={sIdx} className="flex items-center gap-2">
                          <input 
                            type="text" 
                            className="flex-grow bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-xs sm:text-sm text-[#1e293b] dark:text-[#f8fafc] font-normal focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                            value={spec} 
                            onChange={(e) => {
                              const newArr = [...dataObj];
                              const newSpec = [...spesialisasi];
                              newSpec[sIdx] = e.target.value;
                              newArr[index] = { ...item, spesialisasi: newSpec };
                              setDataObj(newArr);
                            }} 
                            placeholder="Tag Keahlian"
                          />
                          <button 
                            type="button"
                            onClick={() => {
                              const newArr = [...dataObj];
                              const newSpec = [...spesialisasi];
                              newSpec.splice(sIdx, 1);
                              newArr[index] = { ...item, spesialisasi: newSpec };
                              setDataObj(newArr);
                            }}
                            className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl shrink-0 transition-all active:scale-95"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Row 6: Tugas & Tanggung Jawab / Key Tasks */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/40 pb-1.5">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Tugas</label>
                      <button 
                        type="button"
                        onClick={() => {
                          const newArr = [...dataObj];
                          newArr[index] = { 
                            ...item, 
                            tugasTanggungJawab: [...tugas, ''],
                            tugas_tanggung_jawab: [...tugas, ''] 
                          };
                          setDataObj(newArr);
                        }}
                        className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors inline-flex items-center gap-1 text-[11px] font-bold cursor-pointer"
                      >
                        <Plus className="w-3 h-3" /> Tambah Tugas
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      {tugas.map((tPoint: string, tIdx: number) => (
                        <div key={tIdx} className="flex items-start gap-3">
                          <AutoResizingTextarea 
                            value={tPoint} 
                            onChange={(val) => {
                              const newArr = [...dataObj];
                              const newTugas = [...tugas];
                              newTugas[tIdx] = val;
                              newArr[index] = { 
                                ...item, 
                                tugasTanggungJawab: newTugas,
                                tugas_tanggung_jawab: newTugas 
                              };
                              setDataObj(newArr);
                            }} 
                            className="flex-grow bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#1e293b] dark:text-[#f8fafc] font-normal min-h-[45px] focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                            placeholder="Tulis detail kontribusi, indikator performa, atau tugas spesifik..."
                          />
                          <button 
                            type="button"
                            onClick={() => {
                              const newArr = [...dataObj];
                              const newTugas = [...tugas];
                              newTugas.splice(tIdx, 1);
                              newArr[index] = { 
                                ...item, 
                                tugasTanggungJawab: newTugas,
                                tugas_tanggung_jawab: newTugas 
                              };
                              setDataObj(newArr);
                            }}
                            className="text-red-500 hover:text-red-700 p-2.5 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl shrink-0 mt-1 transition-all active:scale-95"
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
