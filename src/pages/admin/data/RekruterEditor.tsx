import { ApiService } from '../../../services/api';
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Save, 
  AlertTriangle, 
  Trash2, 
  Plus, 
  MessageSquare, 
  ExternalLink, 
  HelpCircle, 
  Edit2, 
  Check, 
  Copy, 
  User, 
  Building, 
  Briefcase, 
  Phone, 
  CheckCircle2, 
  Sparkles, 
  X,
  FileText,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

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

export default function RekruterEditor() {
  const [dataObj, setDataObj] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  
  // Track which indices are in editing mode
  const [editingIndices, setEditingIndices] = useState<{ [key: number]: boolean }>({});
  
  // Track which indices are expanded/collapsed
  const [expandedIndices, setExpandedIndices] = useState<{ [key: number]: boolean }>({});
  
  // Selected templates for each recruiter
  const [selectedTemplateType, setSelectedTemplateType] = useState<{ [key: number]: 'tanya' | 'followup' | 'terimakasih' }>({});

  const [desktopPortal, setDesktopPortal] = useState<HTMLElement | null>(null);
  const [mobilePortal, setMobilePortal] = useState<HTMLElement | null>(null);

  // Custom draft messages for each recruiter contact
  const [draftMessages, setDraftMessages] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    fetchData();
    const timer = setTimeout(() => {
      setDesktopPortal(document.getElementById('desktop-top-bar-actions'));
      setMobilePortal(document.getElementById('mobile-top-bar-actions'));
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg(null);
    }, 2500);
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await ApiService.get<any>('rekruter');
      if (!response.success) {
        throw new Error(response.message || 'Gagal memuat data rekruter');
      }
      const data = response.data;
      const parsedData = Array.isArray(data) ? data : [];
      setDataObj(parsedData);

      // Initialize default message drafts and template type for each recruiter
      const initialDrafts: { [key: number]: string } = {};
      const initialTemplates: { [key: number]: 'tanya' | 'followup' | 'terimakasih' } = {};
      
      parsedData.forEach((item, index) => {
        initialTemplates[index] = 'tanya';
        initialDrafts[index] = generateTemplateMessage(item, 'tanya');
      });
      
      setDraftMessages(initialDrafts);
      setSelectedTemplateType(initialTemplates);
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan saat memuat data');
    } finally {
      setLoading(false);
    }
  };

  const generateTemplateMessage = (item: any, type: 'tanya' | 'followup' | 'terimakasih') => {
    const comp = item.perusahaan || '[Nama Perusahaan]';
    const pos = item.posisi || '[Nama Posisi]';
    const hasName = !!item.nama;
    
    // Honorific based on gender/greeting choice
    let honorific = 'Bapak/Ibu';
    let nameString = '';

    if (item.gender === 'pria') {
      honorific = 'Bapak';
      nameString = hasName ? ` ${item.nama}` : '';
    } else if (item.gender === 'wanita') {
      honorific = 'Ibu';
      nameString = hasName ? ` ${item.nama}` : '';
    }

    const greeting = `Selamat siang ${honorific}${nameString}`;
    const morningGreeting = `Selamat pagi ${honorific}${nameString}`;

    if (type === 'tanya') {
      return `${greeting}, mohon maaf mengganggu waktunya. Saya Alvareza, ingin menanyakan apakah benar di ${comp} sedang membuka lowongan pekerjaan untuk posisi ${pos}? Terima kasih.`;
    } else if (type === 'followup') {
      return `${morningGreeting}, perkenalkan saya Alvareza Hilka Pratama yang mengirimkan lamaran untuk posisi ${pos} di ${comp} beberapa waktu lalu. Saya ingin menanyakan dengan hormat apakah ada pembaruan atau feedback terkait proses seleksi tersebut? Terima kasih banyak atas perhatiannya.`;
    } else {
      return `${greeting}, terima kasih banyak atas kesempatan diskusi dan wawancara untuk posisi ${pos} di ${comp} sebelumnya. Saya sangat antusias dan berharap dapat berkontribusi bersama tim. Sukses selalu untuk ${comp}.`;
    }
  };

  const handleFieldChange = (index: number, key: string, value: any) => {
    const newArr = [...dataObj];
    const updatedItem = { ...newArr[index], [key]: value };
    newArr[index] = updatedItem;
    setDataObj(newArr);

    // Dynamic regeneration of messages if key variables change
    const activeTemplate = selectedTemplateType[index] || 'tanya';
    setDraftMessages(prev => ({
      ...prev,
      [index]: generateTemplateMessage(updatedItem, activeTemplate)
    }));
  };

  const selectTemplate = (index: number, type: 'tanya' | 'followup' | 'terimakasih') => {
    setSelectedTemplateType(prev => ({ ...prev, [index]: type }));
    setDraftMessages(prev => ({
      ...prev,
      [index]: generateTemplateMessage(dataObj[index], type)
    }));
  };

  const handleSave = async () => {
    setError(null);
    setSuccessMsg(null);
    setSaving(true);
    
    try {
      const response = await ApiService.post('rekruter', dataObj);
      if (!response.success) {
        throw new Error(response.error || response.message || 'Gagal menyimpan data');
      }
      
      setSuccessMsg('Data rekruter berhasil disimpan!');
      setEditingIndices({}); // Collapse all cards back on successful save
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
      id: `rec-${Date.now()}`,
      nama: '',
      jabatan: '',
      perusahaan: '',
      posisi: '',
      whatsapp: '',
      catatan: '',
      gender: 'umum'
    };
    
    // Prepend new item to the data array so it appears at the very top
    setDataObj([newItem, ...dataObj]);
    
    // Shift draft messages, selected templates, and editing states for existing items
    const shiftedDrafts: { [key: number]: string } = {
      0: generateTemplateMessage(newItem, 'tanya')
    };
    const shiftedTemplates: { [key: number]: 'tanya' | 'followup' | 'terimakasih' } = {
      0: 'tanya'
    };
    const shiftedEdits: { [key: number]: boolean } = {
      0: true // Put new item directly into editing mode
    };
    const shiftedExpands: { [key: number]: boolean } = {
      0: true // Keep new item expanded by default
    };

    Object.keys(draftMessages).forEach(k => {
      const idx = parseInt(k, 10);
      shiftedDrafts[idx + 1] = draftMessages[idx];
    });

    Object.keys(selectedTemplateType).forEach(k => {
      const idx = parseInt(k, 10);
      shiftedTemplates[idx + 1] = selectedTemplateType[idx];
    });

    Object.keys(editingIndices).forEach(k => {
      const idx = parseInt(k, 10);
      shiftedEdits[idx + 1] = editingIndices[idx];
    });

    Object.keys(expandedIndices).forEach(k => {
      const idx = parseInt(k, 10);
      shiftedExpands[idx + 1] = expandedIndices[idx];
    });

    setDraftMessages(shiftedDrafts);
    setSelectedTemplateType(shiftedTemplates);
    setEditingIndices(shiftedEdits);
    setExpandedIndices(shiftedExpands);
  };

  const handleDeleteItem = async (index: number) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus kontak rekruter ini?')) return;
    
    const item = dataObj[index];
    if (item.id) {
      try {
        const response = await ApiService.delete('rekruter', { body: JSON.stringify({ id: item.id }) });
        if (!response.success) {
          setError(response.message || 'Gagal menghapus data di server');
          return;
        }
      } catch (err: any) {
        setError(err.message || 'Terjadi kesalahan saat menghapus data');
        return;
      }
    }

    const newArr = [...dataObj];
    newArr.splice(index, 1);
    setDataObj(newArr);

    // Adjust draft messages keys
    const newDrafts: { [key: number]: string } = {};
    const newTemplates: { [key: number]: 'tanya' | 'followup' | 'terimakasih' } = {};
    const newEdits: { [key: number]: boolean } = {};
    const newExpands: { [key: number]: boolean } = {};

    newArr.forEach((item, idx) => {
      const oldIndex = idx >= index ? idx + 1 : idx;
      newDrafts[idx] = draftMessages[oldIndex] || generateTemplateMessage(item, 'tanya');
      newTemplates[idx] = selectedTemplateType[oldIndex] || 'tanya';
      newEdits[idx] = editingIndices[oldIndex] || false;
      newExpands[idx] = expandedIndices[oldIndex] || false;
    });

    setDraftMessages(newDrafts);
    setSelectedTemplateType(newTemplates);
    setEditingIndices(newEdits);
    setExpandedIndices(newExpands);
    showToast('Kontak dihapus dari draf sementara');
  };

  const formatWhatsAppNumber = (num: string) => {
    let clean = num.replace(/\D/g, ''); // keep only digits
    if (clean.startsWith('0')) {
      clean = '62' + clean.slice(1);
    }
    return clean;
  };

  const handleWhatsAppClick = (whatsappNum: string, message: string) => {
    if (!whatsappNum) {
      alert('Mohon isi nomor WhatsApp rekruter terlebih dahulu.');
      return;
    }
    const cleanNum = formatWhatsAppNumber(whatsappNum);
    const encodedText = encodeURIComponent(message);
    const waUrl = `https://api.whatsapp.com/send?phone=${cleanNum}&text=${encodedText}`;
    window.open(waUrl, '_blank');
  };

  const toggleEditMode = (index: number) => {
    setEditingIndices(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const toggleExpand = (index: number) => {
    setExpandedIndices(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('Teks berhasil disalin!');
  };

  const saveButtonDesktop = (
    <div className="flex items-center gap-3">
      <button
        onClick={handleSave}
        disabled={saving}
        className="p-2 text-[#02227E] hover:text-[#02227E]/80 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all hover:scale-110 active:scale-95 flex items-center justify-center"
        title="Simpan Semua Perubahan"
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
        Tambah Rekruter
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
        Tambah
      </button>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 text-sm">Memuat data rekruter...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 pb-10">
      {desktopPortal && createPortal(saveButtonDesktop, desktopPortal)}
      {mobilePortal && createPortal(saveButtonMobile, mobilePortal)}

      {/* Floating Toast Notification */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 text-xs font-semibold"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded-xl flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
          <p className="text-sm text-red-800 dark:text-red-300 whitespace-pre-wrap">{error}</p>
        </div>
      )}
      
      {successMsg && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-900 rounded-xl flex items-center gap-3 animate-fadeIn">
          <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center shrink-0">
            <svg className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">{successMsg}</p>
        </div>
      )}

      {dataObj.length === 0 ? (
        <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center">
          <p className="text-slate-400 text-sm mb-4">Belum ada data rekruter yang ditambahkan.</p>
          <button
            onClick={handleAddItem}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#02227E] hover:bg-[#02227E]/90 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" /> Tambah Rekruter Pertama
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {dataObj.map((item, index) => {
            const isEditing = !!editingIndices[index];
            const activeTemplate = selectedTemplateType[index] || 'tanya';
            const draftText = draftMessages[index] || '';

            // Formatting helper for badges
            let genderLabel = 'Umum';
            let genderColor = 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
            if (item.gender === 'pria') {
              genderLabel = 'Laki-laki (Bapak)';
              genderColor = 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-900/50 border';
            } else if (item.gender === 'wanita') {
              genderLabel = 'Perempuan (Ibu)';
              genderColor = 'bg-pink-50 text-pink-700 border-pink-100 dark:bg-pink-950/30 dark:text-pink-300 dark:border-pink-900/50 border';
            }

            return (
              <div 
                key={index} 
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs hover:shadow-sm transition-all duration-300 overflow-hidden"
              >
                
                {/* 1. VISUAL CARD VIEW (Show when NOT editing) */}
                {!isEditing && (
                  <div className={`p-6 transition-all duration-300 ${expandedIndices[index] ? 'md:p-8 space-y-6' : 'space-y-0'}`}>
                    {/* Header with recruiter information */}
                    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${expandedIndices[index] ? 'border-b border-slate-100 dark:border-slate-800/60 pb-5' : ''}`}>
                      <div className="flex items-start gap-4 cursor-pointer select-none" onClick={() => toggleExpand(index)}>
                        {/* Avatar Initials Placeholder */}
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#02227E] to-accent text-white flex items-center justify-center font-bold text-base shrink-0 shadow-sm">
                          {item.perusahaan ? item.perusahaan.substring(0, 2).toUpperCase() : 'RC'}
                        </div>
                        
                        <div className="space-y-1 text-left">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">
                              {item.gender !== 'umum' && item.nama ? (
                                <span>{item.gender === 'pria' ? 'Bapak' : 'Ibu'} {item.nama}</span>
                              ) : (
                                <span>{item.nama || 'Bapak/Ibu HRD'}</span>
                              )}
                            </h3>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${genderColor}`}>
                              {genderLabel}
                            </span>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                            {item.jabatan && (
                              <span className="flex items-center gap-1">
                                <User className="w-3.5 h-3.5 text-slate-400" />
                                {item.jabatan}
                              </span>
                            )}
                            {item.perusahaan && (
                              <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                                <Building className="w-3.5 h-3.5 text-slate-400" />
                                {item.perusahaan}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Top Action Buttons (Edit / Delete / Toggle) */}
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          type="button"
                          onClick={() => toggleEditMode(index)}
                          className="inline-flex items-center gap-1 px-3.5 py-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl font-bold text-xs transition-all cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          Edit Profil
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteItem(index)}
                          className="p-2 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 rounded-xl transition-all cursor-pointer"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleExpand(index)}
                          className="p-2 bg-[#02227E]/5 hover:bg-[#02227E]/10 dark:bg-slate-800 dark:hover:bg-slate-700 text-[#02227E] dark:text-slate-300 rounded-xl transition-all cursor-pointer flex items-center justify-center"
                          title={expandedIndices[index] ? "Sembunyikan Detail" : "Tampilkan Detail"}
                        >
                          {expandedIndices[index] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <AnimatePresence initial={false}>
                      {expandedIndices[index] && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="space-y-6 overflow-hidden pt-5"
                        >
                          {/* Job Position Info */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Posisi yg di-followup */}
                            <div className="bg-slate-50 dark:bg-slate-950/50 p-4 rounded-xl space-y-1 border border-slate-100 dark:border-slate-850">
                              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Posisi Lowongan</span>
                              <div className="flex items-center gap-2">
                                <Briefcase className="w-4 h-4 text-accent" />
                                <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                                  {item.posisi || 'Belum diisi'}
                                </span>
                              </div>
                            </div>

                            {/* WhatsApp Info */}
                            <div className="bg-slate-50 dark:bg-slate-950/50 p-4 rounded-xl space-y-1 border border-slate-100 dark:border-slate-850">
                              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Kontak WhatsApp</span>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Phone className="w-4 h-4 text-emerald-500" />
                                  <span className="text-sm font-mono text-slate-800 dark:text-slate-200">
                                    {item.whatsapp || 'Belum diisi'}
                                  </span>
                                </div>
                                {item.whatsapp && (
                                  <button
                                    onClick={() => copyToClipboard(item.whatsapp)}
                                    className="text-[10px] font-bold text-[#02227E] hover:underline p-1 rounded hover:bg-[#02227E]/5"
                                  >
                                    Salin No
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Catatan khusus */}
                          {item.catatan && (
                            <div className="space-y-1.5 text-left bg-amber-500/5 border border-amber-500/10 p-4 rounded-xl">
                              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">Catatan Penting</span>
                              <p className="text-xs text-slate-700 dark:text-slate-350 leading-relaxed font-normal">
                                {item.catatan}
                              </p>
                            </div>
                          )}

                          {/* Follow-up Assistant Component */}
                          <div className="border border-slate-100 dark:border-slate-800 bg-[#128C7E]/5 rounded-2xl p-4 sm:p-6 space-y-4 text-left">
                            <div className="flex items-center justify-between gap-4 flex-wrap border-b border-slate-200/50 dark:border-slate-800/40 pb-3">
                              <div className="flex items-center gap-2 text-[#128C7E]">
                                <MessageSquare className="w-4.5 h-4.5 shrink-0" />
                                <span className="text-xs font-bold uppercase tracking-wider">Asisten Follow-up Otomatis</span>
                              </div>

                              {/* Interactive templates selections */}
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <button
                                  type="button"
                                  onClick={() => selectTemplate(index, 'tanya')}
                                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                                    activeTemplate === 'tanya'
                                      ? 'bg-[#128C7E] text-white'
                                      : 'bg-white hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
                                  }`}
                                >
                                  Tanya Lowongan
                                </button>
                                <button
                                  type="button"
                                  onClick={() => selectTemplate(index, 'followup')}
                                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                                    activeTemplate === 'followup'
                                      ? 'bg-[#128C7E] text-white'
                                      : 'bg-white hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
                                  }`}
                                >
                                  Follow-up Status
                                </button>
                                <button
                                  type="button"
                                  onClick={() => selectTemplate(index, 'terimakasih')}
                                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                                    activeTemplate === 'terimakasih'
                                      ? 'bg-[#128C7E] text-white'
                                      : 'bg-white hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
                                  }`}
                                >
                                  Terima Kasih
                                </button>
                              </div>
                            </div>

                            {/* Template Output message preview with copy/edit */}
                            <div className="space-y-2 relative">
                              <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold">
                                <span>DRAF PESAN CHAT WHATSAPP</span>
                                <button
                                  type="button"
                                  onClick={() => copyToClipboard(draftText)}
                                  className="inline-flex items-center gap-1 text-[#128C7E] hover:underline"
                                >
                                  <Copy className="w-3 h-3" /> Salin Draf
                                </button>
                              </div>
                              
                              <textarea
                                rows={3}
                                className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs text-[#1e293b] dark:text-[#f8fafc] focus:outline-none focus:ring-1 focus:ring-[#128C7E]/40 focus:border-[#128C7E] leading-relaxed transition-all"
                                value={draftText}
                                onChange={(e) => {
                                  setDraftMessages(prev => ({
                                    ...prev,
                                    [index]: e.target.value
                                  }));
                                }}
                              />
                            </div>

                            {/* Action buttons footer */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2 border-t border-slate-200/50 dark:border-slate-800/45">
                              <div className="text-[10px] text-slate-500 dark:text-slate-400">
                                Target No: <span className="font-semibold">{item.whatsapp || '(No. WA belum terisi)'}</span>
                              </div>
                              
                              <div className="flex items-center gap-2 w-full sm:w-auto">
                                <button
                                  type="button"
                                  onClick={() => handleWhatsAppClick(item.whatsapp, draftText)}
                                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#128C7E] hover:bg-[#075e54] text-white font-bold text-xs rounded-xl shadow-xs hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
                                >
                                  <MessageSquare className="w-4 h-4" />
                                  Kirim WhatsApp
                                  <ExternalLink className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* 2. FORM EDITING VIEW (Show when isEditing is true) */}
                {isEditing && (
                  <div className="p-6 md:p-8 space-y-6 bg-slate-50/50 dark:bg-slate-900/40 border-l-4 border-accent animate-fadeIn">
                    
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-3">
                      <div className="flex items-center gap-2 text-left">
                        <span className="w-2 h-2 rounded-full bg-accent animate-pulse shrink-0"></span>
                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                          Edit Detail Kontak Rekruter #{index + 1}
                        </h4>
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => toggleEditMode(index)}
                        className="text-xs font-bold text-[#02227E] hover:underline px-3 py-1.5 bg-white dark:bg-slate-850 hover:bg-slate-100 border border-slate-200 dark:border-slate-800 rounded-xl"
                      >
                        Selesai Edit
                      </button>
                    </div>

                    {/* Inputs Form */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
                      
                      {/* 1. Sapaan / Greeting Type Selector */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400">
                          Sapaan / Jenis Kontak
                        </label>
                        <select
                          className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#1e293b] dark:text-[#f8fafc] font-normal focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all cursor-pointer"
                          value={item.gender || 'umum'}
                          onChange={(e) => handleFieldChange(index, 'gender', e.target.value)}
                        >
                          <option value="umum">Umum (Bapak/Ibu HRD)</option>
                          <option value="pria">Laki-laki (Bapak)</option>
                          <option value="wanita">Perempuan (Ibu)</option>
                        </select>
                      </div>

                      {/* 2. Nama Orang / Rekruter (Only shown if Laki-laki or Perempuan is selected!) */}
                      {item.gender !== 'umum' && (
                        <div className="space-y-1.5 animate-slideDown">
                          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                            Nama Orang / Rekruter
                            <span className="text-red-500 font-bold">*</span>
                          </label>
                          <input 
                            type="text" 
                            className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#1e293b] dark:text-[#f8fafc] font-normal focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                            value={item.nama || ''} 
                            onChange={(e) => handleFieldChange(index, 'nama', e.target.value)} 
                            placeholder="Contoh: Budi Santoso / Siti"
                            required
                          />
                        </div>
                      )}

                      {/* 3. Jabatan */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400">
                          Jabatan Rekruter
                        </label>
                        <input 
                          type="text" 
                          className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#1e293b] dark:text-[#f8fafc] font-normal focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                          value={item.jabatan || ''} 
                          onChange={(e) => handleFieldChange(index, 'jabatan', e.target.value)} 
                          placeholder="Contoh: HR Manager / Recruiter Specialist"
                        />
                      </div>

                      {/* 4. Perusahaan */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400">
                          Nama Perusahaan
                        </label>
                        <input 
                          type="text" 
                          className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#1e293b] dark:text-[#f8fafc] font-normal focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                          value={item.perusahaan || ''} 
                          onChange={(e) => handleFieldChange(index, 'perusahaan', e.target.value)} 
                          placeholder="Contoh: PT Global Tech"
                        />
                      </div>

                      {/* 5. Posisi */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400">
                          Posisi Lowongan Kerja
                        </label>
                        <input 
                          type="text" 
                          className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#1e293b] dark:text-[#f8fafc] font-normal focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                          value={item.posisi || ''} 
                          onChange={(e) => handleFieldChange(index, 'posisi', e.target.value)} 
                          placeholder="Contoh: Frontend Developer"
                        />
                      </div>

                      {/* 6. WhatsApp */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400">
                          Nomor WhatsApp (dengan kode negara)
                        </label>
                        <input 
                          type="text" 
                          className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#1e293b] dark:text-[#f8fafc] font-normal focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all"
                          value={item.whatsapp || ''} 
                          onChange={(e) => handleFieldChange(index, 'whatsapp', e.target.value)} 
                          placeholder="Contoh: 081234567890 / 628123..."
                        />
                      </div>
                    </div>

                    {/* Catatan Khusus */}
                    <div className="space-y-1.5 text-left">
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400">
                        Catatan Khusus (Status Lamaran, Progres, Hasil Wawancara, dll)
                      </label>
                      <AutoResizingTextarea 
                        value={item.catatan || ''} 
                        onChange={(val) => handleFieldChange(index, 'catatan', val)} 
                        className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#1e293b] dark:text-[#f8fafc] font-normal focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-all min-h-[60px] block"
                        placeholder="Tulis catatan penting seperti tanggal mendaftar, pertanyaan khusus, atau progres di sini..."
                      />
                    </div>

                    {/* Bottom Action inside Form */}
                    <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800/60">
                      <button
                        type="button"
                        onClick={() => handleDeleteItem(index)}
                        className="text-red-600 hover:text-red-700 font-bold text-xs px-4 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-900/50 rounded-xl"
                      >
                        Hapus Kontak
                      </button>
                      <button
                        type="button"
                        onClick={() => toggleEditMode(index)}
                        className="px-5 py-2.5 bg-[#02227E] text-white font-bold text-xs rounded-xl hover:bg-[#02227E]/90 transition-all cursor-pointer shadow-xs"
                      >
                        Selesai & Tutup Form
                      </button>
                    </div>

                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

      {/* Global save reminder when changes are present */}
      {dataObj.length > 0 && (
        <div className="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-xs text-slate-600 dark:text-slate-400">Pastikan Anda menyimpan semua perubahan draf dengan mengeklik tombol simpan di kanan atas.</span>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-[#02227E] hover:bg-[#02227E]/90 disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-xs shrink-0"
          >
            {saving ? 'Menyimpan...' : 'Simpan Semua'}
          </button>
        </div>
      )}
    </div>
  );
}
