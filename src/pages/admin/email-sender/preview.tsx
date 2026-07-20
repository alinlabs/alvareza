import { ApiService } from '../../../services/api';
import React from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'motion/react';
import { 
  Archive, 
  Mail, 
  Loader, 
  Play, 
  ChevronUp, 
  ChevronDown, 
  FileText, 
  File, 
  X,
  AlertCircle,
  Eye,
  Edit2,
  Check,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { EmailSenderState, EmailDraft } from './type';
import { getCityFromAlamat } from './logic';
import PdfViewer from '../../../components/PdfViewer';
import PdfThumbnail from '../../../components/PdfThumbnail';

interface PreviewProps {
  state: EmailSenderState;
}

export default function EmailSenderPreview({ state }: PreviewProps) {
  const {
    activeTab,
    drafts,
    setDrafts,
    handleSendBulk,
    isBulkSending,
    isPreviewModalOpen,
    previewSections,
    togglePreviewSection,
    targetEmail,
    subjectPreview,
    attachmentNamePreview,
    renderedHTML,
    bodyPreview,
    attachedFilesList,
    openPdfPreview,
    previewPdf,
    closePdfPreview,
    setTargetEmail,
    setCompanyName,
    setPositionName,
    setActiveTab,
    
    
    bodyFontFamily,
    setEditingDraftId,
    setIncludePerihal,
    setIncludeLampiranAwal,
    setIncludeDaftarLampiran,
    setIncludeBio,
    setCvOption,
    setPaklaringOption,
    setSertifikatKompetensiBisnisDigitalOption,
    setSertifikatKompetensiKepemimpinanOption,
    setSertifikatKompetensiPublicSpeakingOption,
    setSertifikatPrestasiOption,
    setIjazahOption,
    
    
    setBodyFontFamily
  } = state;

  const [pdfZoom, setPdfZoom] = React.useState(1);
  const [viewingDraft, setViewingDraft] = React.useState<EmailDraft | null>(null);

  const [draftRenderedHTML, setDraftRenderedHTML] = React.useState('');

  const [atsCvUrl, setAtsCvUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    let isMounted = true;
    const generatePreviewUrl = async () => {
      try {
        const { generateAtsCvDoc } = await import('../../../utils/atsCvGenerator');
        const { doc } = await generateAtsCvDoc();
        const blob = doc.output('blob');
        const url = URL.createObjectURL(blob);
        if (isMounted) {
          setAtsCvUrl(url);
        }
      } catch (err) {
        console.error("Gagal melakukan pra-generasi ATS CV:", err);
      }
    };
    generatePreviewUrl();
    return () => {
      isMounted = false;
    };
  }, []);

  const getFileUrl = (fileData: any) => {
    if (fileData.label === 'CV ATS') {
      return atsCvUrl || '';
    }
    
    // Resolve for others
    if (fileData.option === 'default') {
      const urlMap: Record<string, string> = {
        'CV': '/pdf/cv.pdf',
        'Portofolio': '/pdf/portofolio.pdf',
        'Paklaring': '/pdf/paklaring.pdf',
        'Sertifikat Kompetensi Akademik': '/pdf/sertifikat/akademis.pdf',
        'Sertifikat Kompetensi Bisnis dan Digital': '/pdf/sertifikat/bisnis-digital.pdf',
        'Sertifikat Kompetensi Kepemimpinan': '/pdf/sertifikat/kepemimpinan.pdf',
        'Sertifikat Kompetensi Public Speaking': '/pdf/sertifikat/public-speaking.pdf',
        'Sertifikat Prestasi': '/pdf/sertifikat/prestasi.pdf',
        'Ijazah': '/pdf/ijazah.pdf'
      };
      return urlMap[fileData.label] || '';
    } else if (fileData.option === 'upload' && fileData.file) {
      return URL.createObjectURL(fileData.file);
    }
    
    // Fallback: Check if there's any file in state to create object URL for
    const labelKeyMap: Record<string, { option: string; file: File | null; defaultPath: string }> = {
      'CV': { option: state.cvOption, file: state.cvFile, defaultPath: '/pdf/cv.pdf' },
      'Portofolio': { option: state.portofolioOption, file: state.portofolioFile, defaultPath: '/pdf/portofolio.pdf' },
      'Paklaring': { option: state.paklaringOption, file: state.paklaringFile, defaultPath: '/pdf/paklaring.pdf' },
      'Sertifikat Kompetensi Akademik': { option: state.sertifikatKompetensiAkademikOption, file: state.sertifikatKompetensiAkademikFile, defaultPath: '/pdf/sertifikat/akademis.pdf' },
      'Sertifikat Kompetensi Bisnis dan Digital': { option: state.sertifikatKompetensiBisnisDigitalOption, file: state.sertifikatKompetensiBisnisDigitalFile, defaultPath: '/pdf/sertifikat/bisnis-digital.pdf' },
      'Sertifikat Kompetensi Kepemimpinan': { option: state.sertifikatKompetensiKepemimpinanOption, file: state.sertifikatKompetensiKepemimpinanFile, defaultPath: '/pdf/sertifikat/kepemimpinan.pdf' },
      'Sertifikat Kompetensi Public Speaking': { option: state.sertifikatKompetensiPublicSpeakingOption, file: state.sertifikatKompetensiPublicSpeakingFile, defaultPath: '/pdf/sertifikat/public-speaking.pdf' },
      'Sertifikat Prestasi': { option: state.sertifikatPrestasiOption, file: state.sertifikatPrestasiFile, defaultPath: '/pdf/sertifikat/prestasi.pdf' },
      'Ijazah': { option: state.ijazahOption, file: state.ijazahFile, defaultPath: '/pdf/ijazah.pdf' }
    };
    
    const config = labelKeyMap[fileData.label];
    if (config) {
      if (config.option === 'upload' && config.file) {
        return URL.createObjectURL(config.file);
      }
      return config.defaultPath;
    }
    
    return '';
  };

  const getDisplayLabel = (label: string) => {
    const labelMap: Record<string, string> = {
      'CV': 'CV Kreatif',
      'CV ATS': 'Curriculum Vitae ATS',
      'Paklaring': 'Surat Pengalaman Kerja',
      'Ijazah': 'Ijazah & Transkrip Nilai',
      'Sertifikat Kompetensi Bisnis dan Digital': 'Sertifikat Kompetensi Bisnis & Digital'
    };
    return labelMap[label] || label;
  };

  React.useEffect(() => {
    if (viewingDraft) {
      const fetchDraftHTML = async () => {
        try {
          const response = await fetch('/api/preview-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              body: viewingDraft.body,
              bodyFontFamily: viewingDraft.bodyFontFamily || bodyFontFamily,
              location: viewingDraft.includeBio ? getCityFromAlamat(viewingDraft.bioAlamat || '') : (viewingDraft.senderLocation || 'Purwakarta')
            })
          });
          const data = await response.json();
          if (response.ok && data.html) {
            setDraftRenderedHTML(data.html);
          } else {
            setDraftRenderedHTML('');
          }
        } catch (err) {
          console.error(err);
        }
      };
      fetchDraftHTML();
    } else {
      setDraftRenderedHTML('');
    }
  }, [viewingDraft,   bodyFontFamily]);

  const handleEditDraft = (draft: EmailDraft) => {
    setEditingDraftId(draft.id);
    setTargetEmail(draft.targetEmail);
    setCompanyName(draft.companyName);
    setPositionName(draft.positionName);
    
    if (draft.includePerihal !== undefined) setIncludePerihal(draft.includePerihal);
    if (draft.includeLampiranAwal !== undefined) setIncludeLampiranAwal(draft.includeLampiranAwal);
    if (draft.includeDaftarLampiran !== undefined) setIncludeDaftarLampiran(draft.includeDaftarLampiran);
    if (draft.includeBio !== undefined) setIncludeBio(draft.includeBio);
    
    if (draft.cvOption) setCvOption(draft.cvOption);
    if (draft.paklaringOption) setPaklaringOption(draft.paklaringOption);
    if (draft.sertifikatKompetensiBisnisDigitalOption) setSertifikatKompetensiBisnisDigitalOption(draft.sertifikatKompetensiBisnisDigitalOption);
    if (draft.sertifikatKompetensiKepemimpinanOption) setSertifikatKompetensiKepemimpinanOption(draft.sertifikatKompetensiKepemimpinanOption);
    if (draft.sertifikatKompetensiPublicSpeakingOption) setSertifikatKompetensiPublicSpeakingOption(draft.sertifikatKompetensiPublicSpeakingOption);
    if (draft.sertifikatPrestasiOption) setSertifikatPrestasiOption(draft.sertifikatPrestasiOption);
    if (draft.ijazahOption) setIjazahOption(draft.ijazahOption);
    
    
    
    if (draft.bodyFontFamily) setBodyFontFamily(draft.bodyFontFamily);
    
    setActiveTab('editor');
  };

  return (
    <div className="w-full">
      {/* Draft Preview Modal */}
      {viewingDraft && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm"
          onClick={() => setViewingDraft(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  Preview Draft: {viewingDraft.positionName} - {viewingDraft.companyName}
                </h3>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" />
                  Ke: {viewingDraft.targetEmail}
                </p>
              </div>
              <button
                onClick={() => setViewingDraft(null)}
                className="p-2 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-100 dark:bg-slate-950">
              <div className="w-full max-w-3xl mx-auto space-y-4">
                <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-[10px] font-bold text-slate-500 uppercase tracking-wider shrink-0 w-max">
                    Subjek
                  </div>
                  <div className="text-sm font-medium text-slate-800 dark:text-slate-200">
                    {viewingDraft.subject}
                  </div>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden min-h-[400px]">
                  {draftRenderedHTML ? (
                    <iframe
                      srcDoc={draftRenderedHTML}
                      title="Preview Draft HTML"
                      className="w-full h-[60vh] border-0"
                      sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin"
                    />
                  ) : (
                    <div className="w-full h-40 flex items-center justify-center text-slate-400">
                      <Loader className="w-6 h-6 animate-spin" />
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Footer actions */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex justify-end gap-3">
              <button
                onClick={() => setViewingDraft(null)}
                className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-lg text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  setViewingDraft(null);
                  handleEditDraft(viewingDraft);
                }}
                className="px-4 py-2 bg-accent hover:bg-accent/90 text-white font-bold rounded-lg text-xs flex items-center gap-2 transition-colors shadow-sm cursor-pointer"
              >
                <Edit2 className="w-4 h-4" />
                Edit Draft
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Preview Layout */}
      {isPreviewModalOpen && (
        <div className="relative w-full space-y-4 pb-12">
          
          {/* Section: Email Tertuju */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden flex flex-col text-left">
            <button 
              onClick={() => togglePreviewSection('tertuju')}
              className="flex items-center justify-between px-5 py-4 bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 cursor-pointer"
            >
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <Mail className="w-5 h-5 text-accent" />
                Email Tertuju
              </h3>
              {previewSections.tertuju ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
            </button>
            {previewSections.tertuju && (
              <div className="p-5 space-y-3">
                <div className="flex items-start text-[11px] md:text-xs">
                  <span className="text-slate-500 font-medium w-24 shrink-0 text-left">Ke:</span>
                  <span className="text-slate-800 dark:text-slate-200 font-bold text-left">{targetEmail || 'hrd@perusahaan.com'}</span>
                </div>
                <div className="flex items-start text-[11px] md:text-xs">
                  <span className="text-slate-500 font-medium w-24 shrink-0 text-left">Subjek:</span>
                  <span className="text-slate-800 dark:text-slate-200 font-bold text-left">{subjectPreview || 'Silakan pilih template...'}</span>
                </div>
                <div className="flex items-start text-[11px] md:text-xs">
                  <span className="text-slate-500 font-medium w-24 shrink-0 text-left">Lampiran:</span>
                  <span className="text-accent font-bold text-left">{attachmentNamePreview || 'Tidak ada lampiran'}</span>
                </div>
              </div>
            )}
          </div>

          {/* Section: Isi Email */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden flex flex-col text-left">
            <button 
              onClick={() => togglePreviewSection('isi')}
              className="flex items-center justify-between px-5 py-4 bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 cursor-pointer"
            >
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <FileText className="w-5 h-5 text-accent" />
                Isi Email
              </h3>
              {previewSections.isi ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
            </button>
            {previewSections.isi && (
              <div className="bg-white dark:bg-slate-100 overflow-hidden text-left">
                {renderedHTML ? (
                  <iframe 
                    title="Email Preview"
                    srcDoc={renderedHTML}
                    className="w-full border-0 block"
                    style={{ minHeight: '400px' }}
                    onLoad={(e) => {
                      const iframe = e.target as HTMLIFrameElement;
                      if (iframe.contentWindow) {
                        iframe.style.height = '0px';
                        iframe.style.height = iframe.contentWindow.document.documentElement.scrollHeight + 'px';
                      }
                    }}
                  />
                ) : (
                  <div className="p-5 whitespace-pre-line text-sm text-slate-700 font-mono min-h-[400px]">
                    {bodyPreview || 'Isi email pengantar surat lamaran akan tampil di sini...'}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Section: Lampiran */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden flex flex-col text-left">
            <button 
              onClick={() => togglePreviewSection('lampiran')}
              className="flex items-center justify-between px-5 py-4 bg-slate-50 dark:bg-slate-950 border-b border-slate-100 dark:border-slate-800 cursor-pointer"
            >
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <File className="w-5 h-5 text-accent" />
                Lampiran
              </h3>
              {previewSections.lampiran ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
            </button>
            {previewSections.lampiran && (
              <div className="p-5">
                {attachedFilesList.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {attachedFilesList.map((fileData, i) => {
                      const fileUrl = getFileUrl(fileData);
                      return (
                        <div
                          key={i}
                          onClick={() => openPdfPreview(fileData)}
                          className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden hover:border-indigo-400/80 transition-all duration-300 flex flex-col shadow-sm cursor-pointer"
                        >
                          {/* PDF Thumbnail Area - 1:1 Aspect Square */}
                          <div 
                            className="aspect-square w-full bg-slate-100/50 dark:bg-slate-950 flex flex-col items-center justify-center shrink-0 relative overflow-hidden border-b border-slate-100 dark:border-slate-800/80"
                            title="Klik untuk melihat dokumen"
                          >
                            {fileUrl ? (
                              <div className="w-full h-full scale-[0.98] origin-top transition-transform duration-300 group-hover:scale-100">
                                <PdfThumbnail url={fileUrl} />
                              </div>
                            ) : (
                              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100/50 dark:bg-slate-800/50 text-slate-450 gap-2">
                                <File className="w-8 h-8 text-indigo-500 animate-pulse" />
                                <span className="text-[10px] font-semibold text-slate-500">Membuat PDF...</span>
                              </div>
                            )}
                            
                            {/* Subtle overlay on hover */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                          </div>

                          {/* Text */}
                          <div className="p-2 flex flex-col flex-1 justify-center text-left">
                            <div className="min-w-0 flex-1">
                              <h4 className="text-[10px] font-bold text-slate-800 dark:text-slate-200 truncate leading-tight hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" title={getDisplayLabel(fileData.label)}>
                                {getDisplayLabel(fileData.label)}
                              </h4>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">Tidak ada lampiran.</p>
                )}
              </div>
            )}
          </div>
          
        </div>
      )}

      {/* Modal PDF Preview */}
      {previewPdf && createPortal((() => {
        return (
          <div 
            className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 md:p-8 bg-slate-950/70 backdrop-blur-sm"
            onClick={() => { closePdfPreview(); setPdfZoom(1); }}
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
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 shrink-0 text-left">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 truncate min-w-0">
                  <FileText className="w-5 h-5 text-accent shrink-0" />
                  <span className="truncate">{previewPdf.name}</span>
                </h3>
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
                  onClick={() => { closePdfPreview(); setPdfZoom(1); }}
                  className="px-3.5 py-1.5 ml-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 rounded-lg text-xs font-bold transition-colors cursor-pointer border border-slate-200 dark:border-slate-800"
                >
                  Tutup
                </button>
              </div>
            </div>

            {/* Content Body */}
            <div className="flex-grow bg-slate-100 dark:bg-slate-950 overflow-hidden flex flex-col items-center justify-center relative rounded-b-2xl">
              <div className="w-full h-full bg-white dark:bg-slate-900 overflow-hidden flex flex-col relative">
                <PdfViewer url={previewPdf.url} zoom={pdfZoom} />
              </div>
            </div>
            </motion.div>
          </div>
        );
      })(),
        document.body
      )}
    </div>
  );
}
