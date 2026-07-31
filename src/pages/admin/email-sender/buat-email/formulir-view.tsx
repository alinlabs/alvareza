import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Mail, 
  AlertCircle,
  Loader, 
  Send, 
  Save, 
  File, 
  Eye,
  ZoomIn,
  ZoomOut,
  X,
  AlignLeft,
  AlignJustify,
  Loader2,
  CheckCircle2,
  FileText,
  RotateCcw,
  ChevronDown
} from 'lucide-react';
import { EmailSenderState } from '../type';
import PdfViewer from '../../../../components/PdfViewer';
import { defaultImagesMap } from '../utils/defaultImagesMap';
import { generatePdfFromImages } from '../../../../utils/imgToPdf';


// Import refactored sections
import { CustomSelect, ModernToggle } from './komponen-view';
import { SenderBioSection } from './bagian-bio-view';
import { JobDetailsSection } from './bagian-pekerjaan-view';
import { AttachmentSelectorSection } from './bagian-lampiran-view';
import { SendProgressBar } from './kemajuan-kirim-view';

interface FormProps {
  state: EmailSenderState & {
    cvInputRef: React.RefObject<HTMLInputElement | null>;
    portofolioInputRef: React.RefObject<HTMLInputElement | null>;
    paklaringInputRef: React.RefObject<HTMLInputElement | null>;
    sertifikatKompetensiAkademikInputRef: React.RefObject<HTMLInputElement | null>;
    sertifikatKompetensiBisnisDigitalInputRef: React.RefObject<HTMLInputElement | null>;
    sertifikatKompetensiKepemimpinanInputRef: React.RefObject<HTMLInputElement | null>;
    sertifikatKompetensiPublicSpeakingInputRef: React.RefObject<HTMLInputElement | null>;
    sertifikatPrestasiInputRef: React.RefObject<HTMLInputElement | null>;
    ijazahInputRef: React.RefObject<HTMLInputElement | null>;
  };
}

const getTemplateCategory = (t: any): string => {
  const id = t.id;
  const name = (t.name || '').toLowerCase();
  
  if (id === 'tpl-0' || id === 'tpl-9' || id === 'tpl-11' || id === 'tpl-24') return 'Umum & Kepemimpinan';
  if (id === 'tpl-13' || id === 'tpl-14' || id === 'tpl-18' || id === 'tpl-28') return 'Administrasi & Kantor';
  if (id === 'tpl-20' || id === 'tpl-21' || id === 'tpl-23' || id === 'tpl-27') return 'Pabrik & Logistik / Operasional';
  if (id === 'tpl-4' || id === 'tpl-17' || id === 'tpl-22' || id === 'tpl-29') return 'Teknologi & IT / Data';
  if (id === 'tpl-19' || id === 'tpl-26') return 'Finance & Keuangan';
  if (id === 'tpl-7' || id === 'tpl-8' || id === 'tpl-12' || id === 'tpl-30') return 'Sales, Humas & Pelayanan';
  if (id === 'tpl-1' || id === 'tpl-2' || id === 'tpl-3' || id === 'tpl-5' || id === 'tpl-6' || id === 'tpl-10' || id === 'tpl-15' || id === 'tpl-16' || id === 'tpl-25') {
    return 'Digital Marketing, Kreatif & Media';
  }
  
  if (name.includes('umum') || name.includes('general') || name.includes('trainee') || name.includes('leader')) return 'Umum & Kepemimpinan';
  if (name.includes('admin') || name.includes('kantor') || name.includes('hrd') || name.includes('human') || name.includes('va')) return 'Administrasi & Kantor';
  if (name.includes('gudang') || name.includes('warehouse') || name.includes('logistik') || name.includes('produksi') || name.includes('pabrik') || name.includes('operator')) return 'Pabrik & Logistik / Operasional';
  if (name.includes('web') || name.includes('developer') || name.includes('programmer') || name.includes('it') || name.includes('sistem') || name.includes('data') || name.includes('analis') || name.includes('analyst')) return 'Teknologi & IT / Data';
  if (name.includes('finance') || name.includes('keuangan') || name.includes('akuntansi') || name.includes('accounting') || name.includes('kasir')) return 'Finance & Keuangan';
  if (name.includes('sales') || name.includes('marketing') || name.includes('pemasaran') || name.includes('desain') || name.includes('design') || name.includes('video') || name.includes('content') || name.includes('penulis') || name.includes('seo') || name.includes('media') || name.includes('kreatif')) return 'Digital Marketing, Kreatif & Media';
  if (name.includes('service') || name.includes('client') || name.includes('hubungan') || name.includes('humas') || name.includes('pr') || name.includes('public')) return 'Sales, Humas & Pelayanan';

  return 'Kustom / Lainnya';
};

const CATEGORY_ORDER = [
  'Umum & Kepemimpinan',
  'Administrasi & Kantor',
  'Finance & Keuangan',
  'Pabrik & Logistik / Operasional',
  'Teknologi & IT / Data',
  'Digital Marketing, Kreatif & Media',
  'Sales, Humas & Pelayanan',
  'Kustom / Lainnya'
];

export default function EmailSenderForm({ state }: FormProps) {
  const {
    templates,
    selectedTplId,
    setSelectedTplId,
    targetEmail,
    setTargetEmail,
    ccEmail,
    setCcEmail,
    bccEmail,
    setBccEmail,
    quickInput,
    setQuickInput,
    companyName,
    setCompanyName,
    positionName,
    setPositionName,
    locationName,
    setLocationName,
    salaryExpectation,
    setSalaryExpectation,
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
    includePerihal,
    setIncludePerihal,
    includeLampiranAwal,
    setIncludeLampiranAwal,
    includeDaftarLampiran,
    setIncludeDaftarLampiran,
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
    cvOption,
    setCvOption,
    cvFile,
    cvName,
    cvInputRef,
    cvAtsOption,
    setCvAtsOption,
    cvAtsName,
    portofolioOption,
    setPortofolioOption,
    portofolioSubtype,
    setPortofolioSubtype,
    portofolioFile,
    portofolioName,
    portofolioInputRef,
    paklaringOption,
    setPaklaringOption,
    paklaringFile,
    paklaringName,
    paklaringInputRef,
    sertifikatKompetensiAkademikOption,
    setSertifikatKompetensiAkademikOption,
    sertifikatKompetensiAkademikFile,
    sertifikatKompetensiAkademikName,
    sertifikatKompetensiAkademikInputRef,
    sertifikatKompetensiBisnisDigitalOption,
    setSertifikatKompetensiBisnisDigitalOption,
    sertifikatKompetensiBisnisDigitalFile,
    sertifikatKompetensiBisnisDigitalName,
    sertifikatKompetensiBisnisDigitalInputRef,
    sertifikatKompetensiKepemimpinanOption,
    setSertifikatKompetensiKepemimpinanOption,
    sertifikatKompetensiKepemimpinanFile,
    sertifikatKompetensiKepemimpinanName,
    sertifikatKompetensiKepemimpinanInputRef,
    sertifikatKompetensiPublicSpeakingOption,
    setSertifikatKompetensiPublicSpeakingOption,
    sertifikatKompetensiPublicSpeakingFile,
    sertifikatKompetensiPublicSpeakingName,
    sertifikatKompetensiPublicSpeakingInputRef,
    sertifikatPrestasiOption,
    setSertifikatPrestasiOption,
    sertifikatPrestasiFile,
    sertifikatPrestasiName,
    sertifikatPrestasiInputRef,
    ijazahOption,
    setIjazahOption,
    ijazahFile,
    ijazahName,
    ijazahInputRef,
    isSending,
    sendProgress,
    sendError,
    successMsg,
    handleCVChange,
    handlePortofolioChange,
    handlePaklaringChange,
    handleSertifikatKompetensiAkademikChange,
    handleSertifikatKompetensiBisnisDigitalChange,
    handleSertifikatKompetensiKepemimpinanChange,
    handleSertifikatKompetensiPublicSpeakingChange,
    handleSertifikatPrestasiChange,
    handleIjazahChange,
    handleSaveDraft,
    handleDispatch,
    handleProcessMergePdfs,
    profileData,
    
    bodyFontFamily, setBodyFontFamily,
    emailFormat, setEmailFormat,
    paragraphAlign, setParagraphAlign,
    isSubjectAuto, setIsSubjectAuto,
    isTemplateAuto, setIsTemplateAuto,
    isBccDefault, setIsBccDefault,
    isPositionGeneral, setIsPositionGeneral,
    customSubject, setCustomSubject
  } = state;

  // Estimate size of files to inform user
  const getEstimatedSizeInForm = (option: string, file: File | null, defaultKb: number) => {
    if (option === 'none') return 0;
    if (option === 'upload' && file) return file.size;
    return defaultKb * 1024; // convert KB to bytes
  };

  const getPortofolioSizeInForm = () => {
    if (portofolioOption === 'none') return 0;
    if (portofolioOption === 'upload' && portofolioFile) return portofolioFile.size;
    const activeSubtypes = portofolioSubtype ? portofolioSubtype.split(',').filter(Boolean) : [];
    let size = 0;
    for (const sub of activeSubtypes) {
      if (sub === 'app_hr') size += 500 * 1024;
      else if (sub === 'app_logistik') size += 500 * 1024;
      else if (sub === 'app_marketing') size += 500 * 1024;
      else if (sub === 'text') size += 1500 * 1024;
    }
    return size;
  };

  const formCvSize = getEstimatedSizeInForm(cvOption, cvFile, 250);
  const formCvAtsSize = getEstimatedSizeInForm(cvAtsOption, null, 120);
  const formPortofolioSize = getPortofolioSizeInForm();
  const formPaklaringSize = getEstimatedSizeInForm(paklaringOption, paklaringFile, 350);
  const formIjazahSize = getEstimatedSizeInForm(ijazahOption, ijazahFile, 450);
  const formAkademikSize = getEstimatedSizeInForm(sertifikatKompetensiAkademikOption, sertifikatKompetensiAkademikFile, 300);
  const formBisnisSize = getEstimatedSizeInForm(sertifikatKompetensiBisnisDigitalOption, sertifikatKompetensiBisnisDigitalFile, 300);
  const formKepemimpinanSize = getEstimatedSizeInForm(sertifikatKompetensiKepemimpinanOption, sertifikatKompetensiKepemimpinanFile, 300);
  const formSpeakingSize = getEstimatedSizeInForm(sertifikatKompetensiPublicSpeakingOption, sertifikatKompetensiPublicSpeakingFile, 300);
  const formPrestasiSize = getEstimatedSizeInForm(sertifikatPrestasiOption, sertifikatPrestasiFile, 300);

  const formTotalBytes = formCvSize + formCvAtsSize + formPortofolioSize + formPaklaringSize + formIjazahSize +
    formAkademikSize + formBisnisSize + formKepemimpinanSize + formSpeakingSize + formPrestasiSize;

  const formatTotalSize = (bytes: number) => {
    if (bytes === 0) return '0 KB';
    if (bytes < 1024 * 1024) {
      return `${Math.round(bytes / 1024)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const activeTotalBytes = state.preparedPdfs && state.preparedPdfs.length > 0 
    ? state.preparedTotalBytes 
    : formTotalBytes;
  const formattedTotalSize = formatTotalSize(activeTotalBytes);

  const isMergeNeededAndNotReady = 
    state.mergeAttachments !== 'none' && 
    state.attachedFilesList.length > 0 && 
    (!state.preparedPdfs || state.preparedPdfs.length === 0 || state.isPreparingPdf);

  const [previewFile, setPreviewFile] = React.useState<{ title: string; url: string; urls?: string[] } | null>(null);
  const [pdfZoom, setPdfZoom] = React.useState(1);
  const [showTemplatePreview, setShowTemplatePreview] = React.useState(false);

  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    template: true,
    perusahaan: true,
    surat: true,
    lampiran: true
  });

  const toggleSection = (key: string) => {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePreviewAtsCv = async () => {
    try {
      const { generateAtsCvDoc } = await import('../../../../utils/atsCvGenerator');
      const { doc } = await generateAtsCvDoc();
      const blob = doc.output('blob');
      const url = URL.createObjectURL(blob);
      setPreviewFile({ title: 'Curriculum Vitae ATS', url });
    } catch (err) {
      console.error(err);
      alert("Gagal memuat preview CV ATS. Pastikan data profil lengkap.");
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm dark:shadow-none pb-20 md:pb-8">
        <form onSubmit={handleDispatch} className="space-y-6 text-left">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-3 mb-2">
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Mail className="w-4 h-4 text-accent" /> {state.editingDraftId ? 'Edit Draft Lamaran' : 'Parameter Lamaran'}
            </h3>
            {state.editingDraftId && (
              <button
                type="button"
                onClick={() => {
                  state.resetForm();
                }}
                className="text-[10px] font-extrabold text-rose-500 hover:text-rose-600 uppercase tracking-wider flex items-center gap-1 cursor-pointer bg-[#F1F5F9] dark:bg-slate-800 border-none px-2 py-1 rounded-md transition-all outline-hidden"
              >
                <X className="w-3.5 h-3.5" /> Batal Edit
              </button>
            )}
          </div>

          {/* Section Divider: TEMPLATE EMAIL */}
          <div 
            onClick={() => toggleSection('template')}
            className="flex items-center justify-between pb-2 pt-2 mb-2 select-none cursor-pointer md:cursor-default"
          >
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-4 bg-accent rounded-full shrink-0"></span>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#1e293b] dark:text-[#f8fafc]">
                TEMPLATE EMAIL
              </h3>
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 md:hidden ${openSections.template ? 'rotate-180' : ''}`} />
          </div>

          <div className={openSections.template ? 'block space-y-4' : 'hidden md:block md:space-y-4'}>
            {/* Template Selection and Styling */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[4fr_9fr_2fr_1fr] gap-4">
            {/* Tampilan Email: 2/8 (4/16) */}
            <div>
              <label className="block text-[10px] font-bold text-slate-455 dark:text-slate-450 uppercase tracking-wider mb-2">
                Tampilan Email
              </label>
              <CustomSelect
                value={emailFormat}
                onChange={setEmailFormat}
                options={[
                  { value: "modern", label: "Modern (Background Abu)" },
                  { value: "formal", label: "Formal (Kertas Putih)" },
                  { value: "plain", label: "Teks Biasa (Plain Text)" }
                ]}
              />
            </div>

            {/* Template Teks: 4.5/8 (9/16) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-[10px] font-bold text-slate-455 dark:text-slate-450 uppercase tracking-wider">
                  Template Teks
                </label>
                <div className="flex items-center gap-2.5">
                  <div
                    className="flex items-center gap-1.5 cursor-pointer select-none"
                    onClick={() => setIsTemplateAuto(!isTemplateAuto)}
                    title={isTemplateAuto ? 'Mencocokkan template otomatis berdasarkan Posisi Pekerjaan' : 'Mencocokkan otomatis dinonaktifkan.'}
                  >
                    <div className={`relative w-8 h-4.5 transition-colors duration-200 rounded-full ${isTemplateAuto ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-750'}`}>
                      <div className={`absolute top-0.5 left-0.5 w-3.5 h-3.5 bg-white rounded-full shadow-md transition-transform duration-200 ${isTemplateAuto ? 'translate-x-3.5' : 'translate-x-0'}`} />
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Auto
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowTemplatePreview(!showTemplatePreview)}
                    className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors cursor-pointer select-none"
                  >
                    {showTemplatePreview ? 'Sembunyikan' : 'Tampilkan'}
                  </button>
                </div>
              </div>
              {(templates || []).length === 0 ? (
                <div className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-500 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4.5 h-4.5 text-slate-400" />
                  <span>Belum ada template. Silakan buat di menu "Cover Letter"</span>
                </div>
              ) : (
                <CustomSelect
                  value={selectedTplId}
                  onChange={setSelectedTplId}
                  options={(() => {
                    const groupedOptions: any[] = [];
                    const categorizedIds = new Set<string>();

                    CATEGORY_ORDER.forEach(cat => {
                      const catTemplates = (templates || []).filter(t => getTemplateCategory(t) === cat);
                      if (catTemplates.length > 0) {
                        groupedOptions.push({
                          value: `header-${cat}`,
                          label: cat,
                          isHeader: true
                        });

                        catTemplates.forEach(t => {
                          categorizedIds.add(t.id);
                          let recsStr = "";
                          if (Array.isArray(t.rekomendasi)) {
                            recsStr = t.rekomendasi.join("/");
                          } else if (typeof t.rekomendasi === "string") {
                            try {
                              const parsed = JSON.parse(t.rekomendasi);
                              if (Array.isArray(parsed)) {
                                recsStr = parsed.join("/");
                              } else {
                                recsStr = t.rekomendasi;
                              }
                            } catch {
                              recsStr = t.rekomendasi;
                            }
                          }
                          const searchStr = `${t.name} ${recsStr}`.toLowerCase();

                          groupedOptions.push({
                            value: t.id,
                            searchValue: searchStr,
                            selectedLabel: (
                              <div className="flex items-center select-none truncate w-full">
                                <span className="font-bold text-slate-800 dark:text-slate-100 truncate">
                                  {t.name}
                                </span>
                              </div>
                            ),
                            label: (
                              <div className="flex flex-col select-none gap-0.5 w-full pl-2 text-left">
                                <div className="flex items-center gap-1 flex-wrap w-full">
                                  <strong className="font-bold text-slate-850 dark:text-slate-100 whitespace-normal break-words">{t.name}</strong>
                                </div>
                                {recsStr && (
                                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal w-full whitespace-normal break-words">
                                    {recsStr}
                                  </span>
                                )}
                              </div>
                            )
                          });
                        });
                      }
                    });

                    // Leftovers safety check
                    const leftovers = (templates || []).filter(t => !categorizedIds.has(t.id));
                    if (leftovers.length > 0) {
                      groupedOptions.push({
                        value: 'header-leftover',
                        label: 'Kustom / Lainnya',
                        isHeader: true
                      });

                      leftovers.forEach(t => {
                        let recsStr = "";
                        if (Array.isArray(t.rekomendasi)) {
                          recsStr = t.rekomendasi.join("/");
                        } else if (typeof t.rekomendasi === "string") {
                          try {
                            const parsed = JSON.parse(t.rekomendasi);
                            if (Array.isArray(parsed)) {
                              recsStr = parsed.join("/");
                            } else {
                              recsStr = t.rekomendasi;
                            }
                          } catch {
                            recsStr = t.rekomendasi;
                          }
                        }
                        const searchStr = `${t.name} ${recsStr}`.toLowerCase();

                        groupedOptions.push({
                          value: t.id,
                          searchValue: searchStr,
                          selectedLabel: (
                            <div className="flex items-center select-none truncate w-full">
                              <span className="font-bold text-slate-800 dark:text-slate-100 truncate">
                                {t.name}
                              </span>
                            </div>
                          ),
                          label: (
                            <div className="flex flex-col select-none gap-0.5 w-full pl-2 text-left">
                              <div className="flex items-center gap-1 flex-wrap w-full">
                                <strong className="font-bold text-slate-850 dark:text-slate-100 whitespace-normal break-words">{t.name}</strong>
                              </div>
                              {recsStr && (
                                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal w-full whitespace-normal break-words">
                                    {recsStr}
                                  </span>
                              )}
                            </div>
                          )
                        });
                      });
                    }

                    return groupedOptions;
                  })()}
                />
              )}
            </div>

            {/* Font Email: 1/8 (2/16) */}
            <div>
              <label className="block text-[10px] font-bold text-slate-455 dark:text-slate-450 uppercase tracking-wider mb-2">
                Font Email
              </label>
              <CustomSelect
                value={bodyFontFamily}
                onChange={setBodyFontFamily}
                options={[
                  { value: "'Arial', sans-serif", label: "Arial" },
                  { value: "'Times New Roman', serif", label: "Times New Roman" },
                  { value: "'Helvetica', sans-serif", label: "Helvetica" },
                  { value: "'Verdana', sans-serif", label: "Verdana" },
                  { value: "'Georgia', serif", label: "Georgia" },
                  { value: "'Courier New', monospace", label: "Courier New" },
                ]}
              />
            </div>

            {/* Perataan: 0.5/8 (1/16) */}
            <div>
              <label className="block text-[10px] font-bold text-slate-455 dark:text-slate-450 uppercase tracking-wider mb-2">
                Perataan
              </label>
              <div className="flex bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-1 h-[42px] items-center gap-1 shadow-inner">
                <button
                  type="button"
                  onClick={() => setParagraphAlign('left')}
                  className={`flex-1 h-full flex items-center justify-center rounded-lg transition-all cursor-pointer ${
                    paragraphAlign === 'left'
                      ? 'bg-white dark:bg-slate-800 text-accent shadow-sm border border-slate-200 dark:border-slate-700'
                      : 'text-slate-400 dark:text-slate-600 hover:text-slate-700 dark:hover:text-slate-300 border border-transparent'
                  }`}
                  title="Rata Kiri"
                >
                  <AlignLeft className="w-4 h-4 shrink-0" />
                </button>
                <button
                  type="button"
                  onClick={() => setParagraphAlign('justify')}
                  className={`flex-1 h-full flex items-center justify-center rounded-lg transition-all cursor-pointer ${
                    paragraphAlign === 'justify'
                      ? 'bg-white dark:bg-slate-800 text-accent shadow-sm border border-slate-200 dark:border-slate-700'
                      : 'text-slate-400 dark:text-slate-600 hover:text-slate-700 dark:hover:text-slate-300 border border-transparent'
                  }`}
                  title="Rata Kanan Kiri (Justify)"
                >
                  <AlignJustify className="w-4 h-4 shrink-0" />
                </button>
              </div>
            </div>
          </div>

          {/* Selected Template Body Preview - Full Width */}
          {showTemplatePreview && (() => {
            const selectedTpl = (templates || []).find(t => t.id === selectedTplId);
            if (!selectedTpl) return null;
            
            // Format bold tags manually
            const formattedBody = selectedTpl.body.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            
            return (
              <div className="w-full bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800/80 rounded-xl p-4 mt-2">
                <div 
                  style={{ 
                    fontFamily: bodyFontFamily, 
                    textAlign: paragraphAlign === 'justify' ? 'justify' : 'left' 
                  }}
                  className="text-slate-700 dark:text-slate-300 text-xs sm:text-sm leading-relaxed whitespace-pre-line"
                  dangerouslySetInnerHTML={{ __html: formattedBody }}
                />
              </div>
            );
          })()}
          </div>

          {/* Section Divider: INFORMASI PERUSAHAAN */}
          <div 
            onClick={() => toggleSection('perusahaan')}
            className="flex items-center justify-between pb-2 pt-4 mb-2 select-none cursor-pointer md:cursor-default"
          >
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-4 bg-accent rounded-full shrink-0"></span>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#1e293b] dark:text-[#f8fafc]">
                INFORMASI PERUSAHAAN
              </h3>
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 md:hidden ${openSections.perusahaan ? 'rotate-180' : ''}`} />
          </div>

          <div className={openSections.perusahaan ? 'block' : 'hidden md:block'}>
            {/* Job details (Company, Role, Recruiter) Section */}
          <JobDetailsSection
            targetEmail={targetEmail}
            setTargetEmail={setTargetEmail}
            ccEmail={ccEmail}
            setCcEmail={setCcEmail}
            bccEmail={bccEmail}
            setBccEmail={setBccEmail}
            isBccDefault={isBccDefault}
            setIsBccDefault={setIsBccDefault}
            companyName={companyName}
            setCompanyName={setCompanyName}
            positionName={positionName}
            setPositionName={setPositionName}
            isPositionGeneral={isPositionGeneral}
            setIsPositionGeneral={setIsPositionGeneral}
            recipientGender={recipientGender}
            setRecipientGender={setRecipientGender}
            recipientRole={recipientRole}
            setRecipientRole={setRecipientRole}
            customRecipientRole={customRecipientRole}
            setCustomRecipientRole={setCustomRecipientRole}
            recipientName={recipientName}
            setRecipientName={setRecipientName}
            recipientPlaceOption={recipientPlaceOption}
            setRecipientPlaceOption={setRecipientPlaceOption}
            recipientPlaceName={recipientPlaceName}
            setRecipientPlaceName={setRecipientPlaceName}
            recipientRoleCompanyFormat={recipientRoleCompanyFormat}
            setRecipientRoleCompanyFormat={setRecipientRoleCompanyFormat}
            isSubjectAuto={isSubjectAuto}
            setIsSubjectAuto={setIsSubjectAuto}
            customSubject={customSubject}
            setCustomSubject={setCustomSubject}
            subjectPreview={state.subjectPreview || ""}
            quickInput={quickInput}
            setQuickInput={setQuickInput}
          />
          </div>

          {/* Section Divider: TAMPILAN SURAT */}
          <div 
            onClick={() => toggleSection('surat')}
            className="flex items-center justify-between pb-2 pt-4 mb-2 select-none cursor-pointer md:cursor-default"
          >
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-4 bg-accent rounded-full shrink-0"></span>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#1e293b] dark:text-[#f8fafc]">
                TAMPILAN SURAT
              </h3>
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 md:hidden ${openSections.surat ? 'rotate-180' : ''}`} />
          </div>

          <div className={openSections.surat ? 'block' : 'hidden md:block'}>
            {/* Applicant Bio & Salary Section + Letter Customization */}
          <SenderBioSection
            includeBio={includeBio}
            setIncludeBio={setIncludeBio}
            bioNama={bioNama}
            setBioNama={setBioNama}
            bioTtl={bioTtl}
            setBioTtl={setBioTtl}
            bioAlamat={bioAlamat}
            setBioAlamat={setBioAlamat}
            senderLocation={senderLocation}
            setSenderLocation={setSenderLocation}
            bioTelp={bioTelp}
            setBioTelp={setBioTelp}
            bioPendidikan={bioPendidikan}
            setBioPendidikan={setBioPendidikan}
            bioJurusan={bioJurusan}
            setBioJurusan={setBioJurusan}
            salaryExpectation={salaryExpectation}
            setSalaryExpectation={setSalaryExpectation}
            profileData={profileData}
            includePerihal={includePerihal}
            setIncludePerihal={setIncludePerihal}
            includeLampiranAwal={includeLampiranAwal}
            setIncludeLampiranAwal={setIncludeLampiranAwal}
            includeDaftarLampiran={includeDaftarLampiran}
            setIncludeDaftarLampiran={setIncludeDaftarLampiran}
          />
          </div>

          {/* Section Divider: LAMPIRAN BERKAS with Inline Toggle */}
          <div className="pb-2 pt-4 mb-2 space-y-2.5">
            <div 
              onClick={() => toggleSection('lampiran')}
              className="flex items-center justify-between select-none cursor-pointer md:cursor-default"
            >
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-4 bg-accent rounded-full shrink-0"></span>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#1e293b] dark:text-[#f8fafc] flex items-baseline gap-1.5">
                  <span>LAMPIRAN BERKAS</span>
                  {formTotalBytes > 0 && (
                    <span className="text-[10px] font-normal text-slate-400 dark:text-slate-500 normal-case tracking-normal">
                      ({formattedTotalSize})
                    </span>
                  )}
                </h3>
              </div>

              <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 md:hidden ${openSections.lampiran ? 'rotate-180' : ''}`} />
            </div>

            {/* Action Bar (Filters + Gabung PDF): Below title on mobile, flex row */}
            <div 
              onClick={(e) => e.stopPropagation()}
              className={`flex flex-wrap items-center justify-between gap-2 select-none ${openSections.lampiran ? 'flex' : 'hidden md:flex'}`}
            >
              <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-0.5 rounded-lg">
                <button
                  type="button"
                  onClick={() => state.setMergeAttachments('none')}
                  className={`px-2 py-1 text-[10px] font-bold rounded-md transition-all ${state.mergeAttachments === 'none' ? 'bg-white dark:bg-slate-700 text-[#02227E] dark:text-white shadow-xs' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
                >
                  PISAH
                </button>
                <button
                  type="button"
                  onClick={() => state.setMergeAttachments('optimal')}
                  className={`px-2 py-1 text-[10px] font-bold rounded-md transition-all ${state.mergeAttachments === 'optimal' ? 'bg-white dark:bg-slate-700 text-[#02227E] dark:text-white shadow-xs' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
                >
                  OPTIMAL
                </button>
                <button
                  type="button"
                  onClick={() => state.setMergeAttachments('all')}
                  className={`px-2 py-1 text-[10px] font-bold rounded-md transition-all ${state.mergeAttachments === 'all' ? 'bg-white dark:bg-slate-700 text-[#02227E] dark:text-white shadow-xs' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
                >
                  SEMUA
                </button>
              </div>

              {/* TOMBOL "Gabung" DI PALING KANAN TAB atau "Batalkan & Reset" jika sudah gabung */}
              {state.preparedPdfs && state.preparedPdfs.length > 0 ? (
                <button
                  type="button"
                  onClick={() => state.setPreparedPdfs(null)}
                  className="px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-xs bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 active:scale-95 shrink-0"
                  title="Batalkan penggabungan dan kembali ke pilihan awal"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Batal &amp; Reset</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleProcessMergePdfs()}
                  disabled={state.isPreparingPdf || state.attachedFilesList.length === 0}
                  className="px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50 disabled:cursor-not-allowed bg-[#02227E] hover:bg-[#02227E]/90 text-white shrink-0"
                >
                  {state.isPreparingPdf ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                  ) : (
                    <FileText className="w-3.5 h-3.5 text-white" />
                  )}
                  <span>
                    {state.isPreparingPdf ? 'Menggabungkan...' : 'Gabung'}
                  </span>
                </button>
              )}
            </div>
          </div>

          <div className={openSections.lampiran ? 'block space-y-3' : 'hidden md:block md:space-y-3'}>

          {/* PDF Preparation Status Alert */}
          {state.isPreparingPdf && (
            <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/80 p-2.5 rounded-xl text-xs text-blue-800 dark:text-blue-300 flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-blue-600 dark:text-blue-400 shrink-0" />
                <span className="font-semibold text-[11px]">{state.preparePdfStatusMsg || 'Sedang menggabungkan berkas PDF...'}</span>
              </div>
              <span className="text-[10px] font-bold bg-blue-100 dark:bg-blue-900/60 px-2 py-0.5 rounded text-blue-700 dark:text-blue-300">{state.preparePdfProgress}%</span>
            </div>
          )}

          {/* File Attachments Selector Section */}
          <AttachmentSelectorSection
            cvOption={cvOption}
            setCvOption={setCvOption}
            cvFile={cvFile}
            cvName={cvName}
            cvInputRef={cvInputRef}
            handleCVChange={handleCVChange}
            cvAtsOption={cvAtsOption}
            setCvAtsOption={setCvAtsOption}
            cvAtsName={cvAtsName}
            portofolioOption={portofolioOption}
            setPortofolioOption={setPortofolioOption}
            portofolioSubtype={portofolioSubtype}
            setPortofolioSubtype={setPortofolioSubtype}
            portofolioFile={portofolioFile}
            portofolioName={portofolioName}
            portofolioInputRef={portofolioInputRef}
            handlePortofolioChange={handlePortofolioChange}
            paklaringOption={paklaringOption}
            setPaklaringOption={setPaklaringOption}
            paklaringFile={paklaringFile}
            paklaringName={paklaringName}
            paklaringInputRef={paklaringInputRef}
            handlePaklaringChange={handlePaklaringChange}
            sertifikatKompetensiAkademikOption={sertifikatKompetensiAkademikOption}
            setSertifikatKompetensiAkademikOption={setSertifikatKompetensiAkademikOption}
            sertifikatKompetensiAkademikFile={sertifikatKompetensiAkademikFile}
            sertifikatKompetensiAkademikName={sertifikatKompetensiAkademikName}
            sertifikatKompetensiAkademikInputRef={sertifikatKompetensiAkademikInputRef}
            handleSertifikatKompetensiAkademikChange={handleSertifikatKompetensiAkademikChange}
            sertifikatKompetensiBisnisDigitalOption={sertifikatKompetensiBisnisDigitalOption}
            setSertifikatKompetensiBisnisDigitalOption={setSertifikatKompetensiBisnisDigitalOption}
            sertifikatKompetensiBisnisDigitalFile={sertifikatKompetensiBisnisDigitalFile}
            sertifikatKompetensiBisnisDigitalName={sertifikatKompetensiBisnisDigitalName}
            sertifikatKompetensiBisnisDigitalInputRef={sertifikatKompetensiBisnisDigitalInputRef}
            handleSertifikatKompetensiBisnisDigitalChange={handleSertifikatKompetensiBisnisDigitalChange}
            sertifikatKompetensiKepemimpinanOption={sertifikatKompetensiKepemimpinanOption}
            setSertifikatKompetensiKepemimpinanOption={setSertifikatKompetensiKepemimpinanOption}
            sertifikatKompetensiKepemimpinanFile={sertifikatKompetensiKepemimpinanFile}
            sertifikatKompetensiKepemimpinanName={sertifikatKompetensiKepemimpinanName}
            sertifikatKompetensiKepemimpinanInputRef={sertifikatKompetensiKepemimpinanInputRef}
            handleSertifikatKompetensiKepemimpinanChange={handleSertifikatKompetensiKepemimpinanChange}
            sertifikatKompetensiPublicSpeakingOption={sertifikatKompetensiPublicSpeakingOption}
            setSertifikatKompetensiPublicSpeakingOption={setSertifikatKompetensiPublicSpeakingOption}
            sertifikatKompetensiPublicSpeakingFile={sertifikatKompetensiPublicSpeakingFile}
            sertifikatKompetensiPublicSpeakingName={sertifikatKompetensiPublicSpeakingName}
            sertifikatKompetensiPublicSpeakingInputRef={sertifikatKompetensiPublicSpeakingInputRef}
            handleSertifikatKompetensiPublicSpeakingChange={handleSertifikatKompetensiPublicSpeakingChange}
            sertifikatPrestasiOption={sertifikatPrestasiOption}
            setSertifikatPrestasiOption={setSertifikatPrestasiOption}
            sertifikatPrestasiFile={sertifikatPrestasiFile}
            sertifikatPrestasiName={sertifikatPrestasiName}
            sertifikatPrestasiInputRef={sertifikatPrestasiInputRef}
            handleSertifikatPrestasiChange={handleSertifikatPrestasiChange}
            ijazahOption={ijazahOption}
            setIjazahOption={setIjazahOption}
            ijazahFile={ijazahFile}
            ijazahName={ijazahName}
            ijazahInputRef={ijazahInputRef}
            handleIjazahChange={handleIjazahChange}
            mergeAttachments={state.mergeAttachments}
            setMergeAttachments={(val) => state.setMergeAttachments(val)}
            onPreview={(title, url, urls) => setPreviewFile({ title, url, urls })}
            onPreviewAtsCv={handlePreviewAtsCv}
            preparedPdfs={state.preparedPdfs}
            setPreparedPdfs={state.setPreparedPdfs}
            preparedTotalBytes={state.preparedTotalBytes}
          />

          {/* Warning Banner if Merge Required but Not Prepared */}
          {isMergeNeededAndNotReady && (
            <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 rounded-xl text-left flex items-start gap-2.5 shadow-xs pt-3 mt-2">
              <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-800 dark:text-amber-300">
                <p className="font-bold">Penggabungan PDF Belum Dilakukan</p>
                <p className="text-[11px] text-amber-700/90 dark:text-amber-400/90 mt-0.5">
                  Anda memilih mode gabung <b>{state.mergeAttachments === 'optimal' ? 'OPTIMAL' : 'SEMUA'}</b>. Silakan klik tombol <b>Gabung</b> pada bagian Lampiran Berkas terlebih dahulu sebelum mengirim email.
                </p>
              </div>
            </div>
          )}
          </div>

          {/* Form Action Buttons (Hidden on mobile as mobile uses floating bottom sheet) */}
          <div className="hidden md:flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="button"
              onClick={() => handleSaveDraft(false)}
              className="w-full py-4 bg-[#F1F5F9] dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold tracking-widest rounded-xl transition-all border-none flex items-center justify-center gap-2 cursor-pointer text-xs shadow-none outline-hidden"
            >
              <Save className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span>{state.editingDraftId ? 'Update' : 'Simpan'}</span>
            </button>
            
            {state.editingDraftId && (
              <button
                type="button"
                onClick={() => handleSaveDraft(true)}
                className="w-full py-4 bg-[#F1F5F9] dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold tracking-widest rounded-xl transition-all border-none flex items-center justify-center gap-2 cursor-pointer text-xs shadow-none outline-hidden"
              >
                <Save className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                <span>Simpan Baru</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => state.setIsPreviewModalOpen(true)}
              className="w-full py-4 bg-[#F1F5F9] dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[#02227E] dark:text-blue-400 font-bold tracking-widest rounded-xl transition-all border-none flex items-center justify-center gap-2 cursor-pointer text-xs shadow-none outline-hidden"
            >
              <Eye className="w-4 h-4 text-[#02227E]/70 dark:text-blue-400/70" />
              <span>Preview</span>
            </button>
            <button
              type="button"
              onClick={(e) => handleDispatch(e as any, true)}
              disabled={isSending || !companyName || !positionName || isMergeNeededAndNotReady}
              className="w-full py-4 bg-[#F1F5F9] dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[#02227E] dark:text-blue-400 font-bold tracking-widest rounded-xl transition-all border-none disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center gap-2 cursor-pointer text-xs shadow-none outline-hidden"
              title={isMergeNeededAndNotReady ? "Gabungkan PDF terlebih dahulu pada tab Lampiran Berkas" : "Kirim ke alvareza.work@gmail.com"}
            >
              <Mail className="w-4 h-4 text-[#02227E]/70 dark:text-blue-400/70" />
              <span>Testing</span>
            </button>
            {isSending ? (
              <button
                type="button"
                onClick={state.handleCancelSend}
                className="w-full py-4 bg-[#F1F5F9] dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-rose-600 dark:text-rose-400 font-bold tracking-widest rounded-xl transition-all border-none flex items-center justify-center gap-2 cursor-pointer text-xs shadow-none outline-hidden animate-none"
              >
                <X className="w-4 h-4 text-rose-500/70 dark:text-rose-400/70" />
                <span>Batal</span>
              </button>
            ) : (
              <button
                type="submit"
                disabled={!targetEmail || !companyName || !positionName || isSending || isMergeNeededAndNotReady}
                className="w-full py-4 bg-accent hover:bg-accent/90 text-white font-bold tracking-widest rounded-xl transition-all shadow-[0_4px_15px_rgba(2,34,126,0.15)] hover:shadow-[0_4px_22px_rgba(2,34,126,0.3)] disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center gap-2 cursor-pointer text-xs animate-none border-none outline-hidden"
                title={isMergeNeededAndNotReady ? "Gabungkan PDF terlebih dahulu pada tab Lampiran Berkas" : "Kirim Email Candidate"}
              >
                <Send className="w-4 h-4" />
                <span>Kirim</span>
              </button>
            )}
          </div>
        </form>

        {/* Progress & Error Status Section */}
        <SendProgressBar
          isSending={isSending}
          sendProgress={sendProgress}
          sendStatusMsg={state.sendStatusMsg}
          sendError={sendError}
          successMsg={successMsg}
          handleCancelSend={state.handleCancelSend}
        />
      </div>

      {/* Mobile Floating Bottom Sheet for "Buat Email" Actions */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 p-2 px-3 shadow-[0_-4px_25px_rgba(0,0,0,0.15)] flex items-center justify-between gap-2">
        {/* Simpan */}
        <button
          type="button"
          onClick={() => handleSaveDraft(false)}
          className="flex-1 py-2.5 px-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl flex flex-col items-center justify-center gap-1 text-[10px] cursor-pointer active:scale-95 transition-all outline-hidden border-none"
        >
          <Save className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          <span className="truncate">{state.editingDraftId ? 'Update' : 'Simpan'}</span>
        </button>

        {/* Preview */}
        <button
          type="button"
          onClick={() => state.setIsPreviewModalOpen(true)}
          className="flex-1 py-2.5 px-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[#02227E] dark:text-blue-400 font-bold rounded-xl flex flex-col items-center justify-center gap-1 text-[10px] cursor-pointer active:scale-95 transition-all outline-hidden border-none"
        >
          <Eye className="w-4 h-4 text-[#02227E]/70 dark:text-blue-400/70" />
          <span className="truncate">Preview</span>
        </button>

        {/* Testing */}
        <button
          type="button"
          onClick={(e) => handleDispatch(e as any, true)}
          disabled={isSending || !companyName || !positionName || isMergeNeededAndNotReady}
          className="flex-1 py-2.5 px-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[#02227E] dark:text-blue-400 font-bold rounded-xl flex flex-col items-center justify-center gap-1 text-[10px] cursor-pointer disabled:opacity-40 disabled:pointer-events-none active:scale-95 transition-all outline-hidden border-none"
          title={isMergeNeededAndNotReady ? "Gabungkan PDF terlebih dahulu" : "Testing Email"}
        >
          <Mail className="w-4 h-4 text-[#02227E]/70 dark:text-blue-400/70" />
          <span className="truncate">Testing</span>
        </button>

        {/* Kirim or Batal */}
        {isSending ? (
          <button
            type="button"
            onClick={state.handleCancelSend}
            className="flex-1 py-2.5 px-1 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl flex flex-col items-center justify-center gap-1 text-[10px] cursor-pointer active:scale-95 transition-all outline-hidden border-none"
          >
            <X className="w-4 h-4" />
            <span className="truncate">Batal</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={(e) => handleDispatch(e as any, false)}
            disabled={!targetEmail || !companyName || !positionName || isSending || isMergeNeededAndNotReady}
            className="flex-[1.2] py-2.5 px-1 bg-accent hover:bg-accent/90 text-white font-bold rounded-xl flex flex-col items-center justify-center gap-1 text-[10px] cursor-pointer disabled:opacity-40 disabled:pointer-events-none active:scale-95 transition-all shadow-sm outline-hidden border-none"
            title={isMergeNeededAndNotReady ? "Gabungkan PDF terlebih dahulu" : "Kirim Email Candidate"}
          >
            <Send className="w-4 h-4" />
            <span className="truncate">Kirim</span>
          </button>
        )}
      </div>

      {/* Document Preview (Bottom Sheet on Mobile, Popup on Desktop) */}
      {previewFile && (() => {
        const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
        return (
          <div 
            className="fixed inset-0 z-[99999] flex items-end sm:items-center justify-center p-0 sm:p-6 md:p-8 bg-slate-950/70 backdrop-blur-sm"
            onClick={() => { setPreviewFile(null); setPdfZoom(1); }}
          >
            <motion.div
              initial={isMobile ? { y: '100%' } : { opacity: 0, scale: 0.95, y: 15 }}
              animate={isMobile ? { y: 0 } : { opacity: 1, scale: 1, y: 0 }}
              exit={isMobile ? { y: '100%' } : { opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-slate-900 w-full max-w-5xl rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col h-[85vh] sm:h-[80vh] max-h-[85vh] sm:max-h-[calc(100vh-4rem)] min-h-[350px] border-t sm:border border-slate-200 dark:border-slate-800 sm:m-auto overflow-hidden"
            >
              {/* Drag handle for mobile bottom sheet */}
              <div className="flex sm:hidden justify-center pt-2.5 pb-1 shrink-0 bg-slate-50 dark:bg-slate-950">
                <div className="w-10 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
              </div>

              {/* Header */}
              <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950 shrink-0 text-left">
                <div className="flex items-center gap-3 truncate min-w-0 pr-2">
                  <div className="w-8 h-8 bg-accent/10 text-accent rounded-lg flex items-center justify-center border border-accent/20 shrink-0">
                    <File className="w-4 h-4" />
                  </div>
                  <div className="truncate min-w-0">
                    <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                      Preview Dokumen Berkas
                    </h3>
                    <p className="text-[10px] font-semibold text-slate-450 dark:text-slate-500 mt-0.5 truncate">
                      {previewFile.title}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setPdfZoom(prev => Math.max(0.5, prev - 0.25))}
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors cursor-pointer border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPdfZoom(prev => Math.min(3, prev + 0.25))}
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors cursor-pointer border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => { setPreviewFile(null); setPdfZoom(1); }}
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex items-center justify-center"
                    title="Tutup"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Content Body */}
              <div className="flex-1 bg-slate-100 dark:bg-slate-950 overflow-hidden flex flex-col items-center justify-center relative sm:rounded-b-2xl">
                <div className="w-full h-full bg-white dark:bg-slate-900 overflow-hidden flex flex-col relative">
                  <PdfViewer url={previewFile.url} urls={previewFile.urls} zoom={pdfZoom} />
                </div>
              </div>
            </motion.div>
          </div>
        );
      })()}
    </>
  );
}
