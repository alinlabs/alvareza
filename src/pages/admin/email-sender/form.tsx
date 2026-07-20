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
  List,
  LayoutGrid
} from 'lucide-react';
import { EmailSenderState } from './type';
import PdfViewer from '../../../components/PdfViewer';

// Import refactored sections
import { CustomSelect, ModernToggle } from './buat-email/components';
import { SenderBioSection } from './buat-email/SenderBioSection';
import { JobDetailsSection } from './buat-email/JobDetailsSection';
import { AttachmentSelectorSection } from './buat-email/AttachmentSelectorSection';
import { SendProgressBar } from './buat-email/SendProgressBar';

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

export default function EmailSenderForm({ state }: FormProps) {
  const {
    templates,
    selectedTplId,
    setSelectedTplId,
    targetEmail,
    setTargetEmail,
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
    profileData,
    
    bodyFontFamily, setBodyFontFamily,
    emailFormat, setEmailFormat,
    paragraphAlign, setParagraphAlign,
    isSubjectAuto, setIsSubjectAuto,
    customSubject, setCustomSubject
  } = state;

  const [previewFile, setPreviewFile] = React.useState<{ title: string; url: string } | null>(null);
  const [pdfZoom, setPdfZoom] = React.useState(1);
  const [attachmentViewMode, setAttachmentViewMode] = React.useState<'card' | 'list'>('list');
  const [showTemplatePreview, setShowTemplatePreview] = React.useState(false);

  const handlePreviewAtsCv = async () => {
    try {
      const { generateAtsCvDoc } = await import('../../../utils/atsCvGenerator');
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
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-sm dark:shadow-none">
        <form onSubmit={handleDispatch} className="space-y-6 text-left">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-2">
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Mail className="w-4 h-4 text-accent" /> {state.editingDraftId ? 'Edit Draft Lamaran' : 'Parameter Lamaran'}
            </h3>
            {state.editingDraftId && (
              <button
                type="button"
                onClick={() => {
                  state.resetForm();
                }}
                className="text-[10px] font-extrabold text-rose-500 hover:text-rose-600 uppercase tracking-wider flex items-center gap-1 cursor-pointer bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 px-2 py-1 rounded-md transition-all"
              >
                <X className="w-3.5 h-3.5" /> Batal Edit
              </button>
            )}
          </div>

          {/* Section Divider: TEMPLATE EMAIL */}
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800/60 pb-2 pt-2 mb-2">
            <span className="w-1.5 h-4 bg-accent rounded-full shrink-0"></span>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#1e293b] dark:text-[#f8fafc]">
              TEMPLATE EMAIL
            </h3>
          </div>

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
                <button
                  type="button"
                  onClick={() => setShowTemplatePreview(!showTemplatePreview)}
                  className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors cursor-pointer select-none"
                >
                  {showTemplatePreview ? 'Sembunyikan' : 'Tampilkan'}
                </button>
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
                  options={(templates || []).map(t => {
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
                    const langStr = t.bahasa ? `(${t.bahasa})` : "";
                    const searchStr = `${t.name} ${recsStr} ${langStr}`.toLowerCase();
                    
                    return {
                      value: t.id,
                      searchValue: searchStr,
                      selectedLabel: (
                        <div className="flex items-center select-none gap-1 truncate w-full">
                          <strong className="font-bold text-slate-800 dark:text-slate-100 shrink-0">{t.name}</strong>
                          <span className="text-slate-500 dark:text-slate-400 font-normal truncate">
                            {recsStr ? ` - ${recsStr}` : ''}{langStr ? ` ${langStr}` : ''}
                          </span>
                        </div>
                      ),
                      label: (
                        <div className="flex flex-col select-none gap-0.5 w-full">
                          <div className="flex items-center gap-1 flex-wrap w-full">
                            <strong className="font-bold text-slate-800 dark:text-slate-100 whitespace-normal break-words">{t.name}</strong>
                            {langStr && (
                              <strong className="font-bold text-slate-800 dark:text-slate-100 whitespace-nowrap"> - {langStr}</strong>
                            )}
                          </div>
                          {recsStr && (
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-normal w-full whitespace-normal break-words">
                              {recsStr}
                            </span>
                          )}
                        </div>
                      )
                    };
                  })}
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

          {/* Section Divider: INFORMASI PERUSAHAAN */}
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800/60 pb-2 pt-4 mb-2">
            <span className="w-1.5 h-4 bg-accent rounded-full shrink-0"></span>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#1e293b] dark:text-[#f8fafc]">
              INFORMASI PERUSAHAAN
            </h3>
          </div>

          {/* Job details (Company, Role, Recruiter) Section */}
          <JobDetailsSection
            targetEmail={targetEmail}
            setTargetEmail={setTargetEmail}
            companyName={companyName}
            setCompanyName={setCompanyName}
            positionName={positionName}
            setPositionName={setPositionName}
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
          />

          {/* Section Divider: TAMPILAN SURAT */}
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800/60 pb-2 pt-4 mb-2">
            <span className="w-1.5 h-4 bg-accent rounded-full shrink-0"></span>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#1e293b] dark:text-[#f8fafc]">
              TAMPILAN SURAT
            </h3>
          </div>

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

          {/* Section Divider: LAMPIRAN BERKAS with Inline Toggle */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60 pb-2 pt-4 mb-2">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-4 bg-accent rounded-full shrink-0"></span>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#1e293b] dark:text-[#f8fafc]">
                LAMPIRAN BERKAS
              </h3>
            </div>
            
              <div className="flex items-center gap-3 select-none">
              {/* Tampilan Toggle List/Card */}
              <div className="flex bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-0.5 items-center gap-0.5">
                <button
                  type="button"
                  onClick={() => setAttachmentViewMode('list')}
                  className={`p-1 flex items-center justify-center rounded transition-all cursor-pointer ${
                    attachmentViewMode === 'list'
                      ? 'bg-white dark:bg-slate-800 text-[#02227E] shadow-sm border border-slate-200 dark:border-slate-700/60'
                      : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 border border-transparent'
                  }`}
                  title="Tampilan List"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setAttachmentViewMode('card')}
                  className={`p-1 flex items-center justify-center rounded transition-all cursor-pointer ${
                    attachmentViewMode === 'card'
                      ? 'bg-white dark:bg-slate-800 text-[#02227E] shadow-sm border border-slate-200 dark:border-slate-700/60'
                      : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 border border-transparent'
                  }`}
                  title="Tampilan Berkas/Card"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Gabung PDF:</span>
                <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-0.5 rounded-lg">
                  <button
                    type="button"
                    onClick={() => state.setMergeAttachments('none')}
                    className={`px-2 py-1 text-[10px] font-bold rounded-md transition-all ${state.mergeAttachments === 'none' ? 'bg-white dark:bg-slate-700 text-[#02227E] dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
                  >
                    PISAH
                  </button>
                  <button
                    type="button"
                    onClick={() => state.setMergeAttachments('optimal')}
                    className={`px-2 py-1 text-[10px] font-bold rounded-md transition-all ${state.mergeAttachments === 'optimal' ? 'bg-white dark:bg-slate-700 text-[#02227E] dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
                  >
                    OPTIMAL
                  </button>
                  <button
                    type="button"
                    onClick={() => state.setMergeAttachments('all')}
                    className={`px-2 py-1 text-[10px] font-bold rounded-md transition-all ${state.mergeAttachments === 'all' ? 'bg-white dark:bg-slate-700 text-[#02227E] dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'}`}
                  >
                    SEMUA
                  </button>
                </div>
              </div>
            </div>
          </div>

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
            onPreview={(title, url) => setPreviewFile({ title, url })}
            onPreviewAtsCv={handlePreviewAtsCv}
            viewMode={attachmentViewMode}
          />

          {/* Form Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="button"
              onClick={() => handleSaveDraft(false)}
              className="w-full py-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold tracking-widest rounded-xl transition-all border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2 cursor-pointer text-xs"
            >
              <Save className="w-4 h-4" />
              <span>Update</span>
            </button>
            
            {state.editingDraftId && (
              <button
                type="button"
                onClick={() => handleSaveDraft(true)}
                className="w-full py-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold tracking-widest rounded-xl transition-all border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2 cursor-pointer text-xs"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Baru</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => state.setIsPreviewModalOpen(true)}
              className="w-full py-4 bg-accent/10 hover:bg-accent/20 text-accent font-bold tracking-widest rounded-xl transition-all border border-accent/20 flex items-center justify-center gap-2 cursor-pointer text-xs"
            >
              <Eye className="w-4 h-4" />
              <span>Preview</span>
            </button>
            <button
              type="button"
              onClick={(e) => handleDispatch(e as any, true)}
              disabled={isSending || !companyName || !positionName}
              className="w-full py-4 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold tracking-widest rounded-xl transition-all border border-emerald-500/20 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center gap-2 cursor-pointer text-xs"
              title="Kirim ke alvareza.work@gmail.com"
            >
              <Mail className="w-4 h-4" />
              <span>Testing</span>
            </button>
            {isSending ? (
              <button
                type="button"
                onClick={state.handleCancelSend}
                className="w-full py-4 bg-rose-600 hover:bg-rose-700 text-white font-bold tracking-widest rounded-xl transition-all shadow-[0_4px_15px_rgba(225,29,72,0.15)] hover:shadow-[0_4px_22px_rgba(225,29,72,0.3)] flex items-center justify-center gap-2 cursor-pointer text-xs animate-none"
              >
                <X className="w-4 h-4" />
                <span>Batal</span>
              </button>
            ) : (
              <button
                type="submit"
                disabled={!targetEmail || !companyName || !positionName}
                className="w-full py-4 bg-accent hover:bg-accent/90 text-white font-bold tracking-widest rounded-xl transition-all shadow-[0_4px_15px_rgba(2,34,126,0.15)] hover:shadow-[0_4px_22px_rgba(2,34,126,0.3)] disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center gap-2 cursor-pointer text-xs animate-none"
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
          sendError={sendError}
          successMsg={successMsg}
          handleCancelSend={state.handleCancelSend}
        />
      </div>

      {/* Centered Popup for PDF Preview */}
      {previewFile && (() => {
        return (
          <div 
            className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 md:p-8 bg-slate-950/70 backdrop-blur-sm"
            onClick={() => { setPreviewFile(null); setPdfZoom(1); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-slate-900 w-full max-w-5xl rounded-2xl shadow-2xl flex flex-col h-[75vh] sm:h-[80vh] max-h-[calc(100vh-4rem)] min-h-[350px] border border-slate-200 dark:border-slate-800 m-auto overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950 shrink-0 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-accent/10 text-accent rounded-lg flex items-center justify-center border border-accent/20">
                    <File className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                      Preview Dokumen Berkas
                    </h3>
                    <p className="text-[10px] font-semibold text-slate-450 dark:text-slate-500 mt-0.5">
                      {previewFile.title}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPdfZoom(prev => Math.max(0.5, prev - 0.25))}
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors cursor-pointer border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <span className="text-[10px] text-slate-500 font-bold w-8 text-center">{Math.round(pdfZoom * 100)}%</span>
                  <button
                    type="button"
                    onClick={() => setPdfZoom(prev => Math.min(3, prev + 0.25))}
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors cursor-pointer border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => { setPreviewFile(null); setPdfZoom(1); }}
                    className="px-3.5 py-1.5 ml-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 rounded-lg text-xs font-bold transition-colors cursor-pointer border border-slate-200 dark:border-slate-800"
                  >
                    Tutup
                  </button>
                </div>
              </div>

              {/* Content Body */}
              <div className="flex-1 bg-slate-100 dark:bg-slate-950 overflow-hidden flex flex-col items-center justify-center relative rounded-b-2xl">
                <div className="w-full h-full bg-white dark:bg-slate-900 overflow-hidden flex flex-col relative">
                  <PdfViewer url={previewFile.url} zoom={pdfZoom} />
                </div>
              </div>
            </motion.div>
          </div>
        );
      })()}
    </>
  );
}
