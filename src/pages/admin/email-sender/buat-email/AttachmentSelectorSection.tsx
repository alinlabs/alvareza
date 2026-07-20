import React from 'react';
import { File as FileIcon, Eye, AlertCircle, Upload } from 'lucide-react';
import { formatFileSize } from './components';
import PdfThumbnail from '../../../../components/PdfThumbnail';

interface AttachmentSelectorSectionProps {
  cvOption: string;
  setCvOption: (val: string) => void;
  cvFile: File | null;
  cvName: string;
  cvInputRef: React.RefObject<HTMLInputElement | null>;
  handleCVChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  
  cvAtsOption: string;
  setCvAtsOption: (val: string) => void;
  cvAtsName: string;
  
  portofolioOption: string;
  setPortofolioOption: (val: string) => void;
  portofolioFile: File | null;
  portofolioName: string;
  portofolioInputRef: React.RefObject<HTMLInputElement | null>;
  handlePortofolioChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  
  paklaringOption: string;
  setPaklaringOption: (val: string) => void;
  paklaringFile: File | null;
  paklaringName: string;
  paklaringInputRef: React.RefObject<HTMLInputElement | null>;
  handlePaklaringChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  
  sertifikatKompetensiAkademikOption: string;
  setSertifikatKompetensiAkademikOption: (val: string) => void;
  sertifikatKompetensiAkademikFile: File | null;
  sertifikatKompetensiAkademikName: string;
  sertifikatKompetensiAkademikInputRef: React.RefObject<HTMLInputElement | null>;
  handleSertifikatKompetensiAkademikChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  
  sertifikatKompetensiBisnisDigitalOption: string;
  setSertifikatKompetensiBisnisDigitalOption: (val: string) => void;
  sertifikatKompetensiBisnisDigitalFile: File | null;
  sertifikatKompetensiBisnisDigitalName: string;
  sertifikatKompetensiBisnisDigitalInputRef: React.RefObject<HTMLInputElement | null>;
  handleSertifikatKompetensiBisnisDigitalChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  
  sertifikatKompetensiKepemimpinanOption: string;
  setSertifikatKompetensiKepemimpinanOption: (val: string) => void;
  sertifikatKompetensiKepemimpinanFile: File | null;
  sertifikatKompetensiKepemimpinanName: string;
  sertifikatKompetensiKepemimpinanInputRef: React.RefObject<HTMLInputElement | null>;
  handleSertifikatKompetensiKepemimpinanChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  
  sertifikatKompetensiPublicSpeakingOption: string;
  setSertifikatKompetensiPublicSpeakingOption: (val: string) => void;
  sertifikatKompetensiPublicSpeakingFile: File | null;
  sertifikatKompetensiPublicSpeakingName: string;
  sertifikatKompetensiPublicSpeakingInputRef: React.RefObject<HTMLInputElement | null>;
  handleSertifikatKompetensiPublicSpeakingChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  
  sertifikatPrestasiOption: string;
  setSertifikatPrestasiOption: (val: string) => void;
  sertifikatPrestasiFile: File | null;
  sertifikatPrestasiName: string;
  sertifikatPrestasiInputRef: React.RefObject<HTMLInputElement | null>;
  handleSertifikatPrestasiChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  
  ijazahOption: string;
  setIjazahOption: (val: string) => void;
  ijazahFile: File | null;
  ijazahName: string;
  ijazahInputRef: React.RefObject<HTMLInputElement | null>;
  handleIjazahChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  
  mergeAttachments: 'none' | 'all' | 'optimal';
  setMergeAttachments: (val: 'none' | 'all' | 'optimal') => void;
  onPreview: (title: string, url: string) => void;
  onPreviewAtsCv: () => void;
  viewMode?: 'list' | 'card';
}

export const AttachmentSelectorSection = ({
  cvOption,
  setCvOption,
  cvFile,
  cvName,
  cvInputRef,
  handleCVChange,
  cvAtsOption,
  setCvAtsOption,
  cvAtsName,
  portofolioOption,
  setPortofolioOption,
  portofolioFile,
  portofolioName,
  portofolioInputRef,
  handlePortofolioChange,
  paklaringOption,
  setPaklaringOption,
  paklaringFile,
  paklaringName,
  paklaringInputRef,
  handlePaklaringChange,
  sertifikatKompetensiAkademikOption,
  setSertifikatKompetensiAkademikOption,
  sertifikatKompetensiAkademikFile,
  sertifikatKompetensiAkademikName,
  sertifikatKompetensiAkademikInputRef,
  handleSertifikatKompetensiAkademikChange,
  sertifikatKompetensiBisnisDigitalOption,
  setSertifikatKompetensiBisnisDigitalOption,
  sertifikatKompetensiBisnisDigitalFile,
  sertifikatKompetensiBisnisDigitalName,
  sertifikatKompetensiBisnisDigitalInputRef,
  handleSertifikatKompetensiBisnisDigitalChange,
  sertifikatKompetensiKepemimpinanOption,
  setSertifikatKompetensiKepemimpinanOption,
  sertifikatKompetensiKepemimpinanFile,
  sertifikatKompetensiKepemimpinanName,
  sertifikatKompetensiKepemimpinanInputRef,
  handleSertifikatKompetensiKepemimpinanChange,
  sertifikatKompetensiPublicSpeakingOption,
  setSertifikatKompetensiPublicSpeakingOption,
  sertifikatKompetensiPublicSpeakingFile,
  sertifikatKompetensiPublicSpeakingName,
  sertifikatKompetensiPublicSpeakingInputRef,
  handleSertifikatKompetensiPublicSpeakingChange,
  sertifikatPrestasiOption,
  setSertifikatPrestasiOption,
  sertifikatPrestasiFile,
  sertifikatPrestasiName,
  sertifikatPrestasiInputRef,
  handleSertifikatPrestasiChange,
  ijazahOption,
  setIjazahOption,
  ijazahFile,
  ijazahName,
  ijazahInputRef,
  handleIjazahChange,
  mergeAttachments,
  setMergeAttachments,
  onPreview,
  onPreviewAtsCv,
  viewMode = 'list'
}: AttachmentSelectorSectionProps) => {

  const [atsCvUrl, setAtsCvUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    let isMounted = true;
    const generatePreviewUrl = async () => {
      try {
        const { generateAtsCvDoc } = await import('../../../../utils/atsCvGenerator');
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

  // Estimate size of files to inform user
  const getEstimatedSize = (option: string, file: File | null, defaultKb: number) => {
    if (option === 'none') return 0;
    if (option === 'upload' && file) return file.size;
    return defaultKb * 1024; // convert KB to bytes
  };

  const cvSize = getEstimatedSize(cvOption, cvFile, 250);
  const cvAtsSize = getEstimatedSize(cvAtsOption, null, 120);
  const portofolioSize = getEstimatedSize(portofolioOption, portofolioFile, 2500);
  const paklaringSize = getEstimatedSize(paklaringOption, paklaringFile, 350);
  const ijazahSize = getEstimatedSize(ijazahOption, ijazahFile, 450);
  const akademikSize = getEstimatedSize(sertifikatKompetensiAkademikOption, sertifikatKompetensiAkademikFile, 300);
  const bisnisSize = getEstimatedSize(sertifikatKompetensiBisnisDigitalOption, sertifikatKompetensiBisnisDigitalFile, 300);
  const kepemimpinanSize = getEstimatedSize(sertifikatKompetensiKepemimpinanOption, sertifikatKompetensiKepemimpinanFile, 300);
  const speakingSize = getEstimatedSize(sertifikatKompetensiPublicSpeakingOption, sertifikatKompetensiPublicSpeakingFile, 300);
  const prestasiSize = getEstimatedSize(sertifikatPrestasiOption, sertifikatPrestasiFile, 300);

  const totalBytes = cvSize + cvAtsSize + portofolioSize + paklaringSize + ijazahSize +
    akademikSize + bisnisSize + kepemimpinanSize + speakingSize + prestasiSize;

  const totalMb = totalBytes / (1024 * 1024);
  const limitMb = 25.0; // standard Gmail limit

  const items = [
    {
      id: 'cv_kreatif',
      label: 'CV Kreatif',
      option: cvOption,
      setOption: (checked: boolean) => {
        setCvOption(checked ? (cvFile ? 'upload' : 'default') : 'none');
        if (checked) {
          setCvAtsOption('none');
        }
      },
      fileName: cvOption === 'none' ? 'Tidak dilampirkan' : (cvOption === 'upload' && cvFile ? cvFile.name : cvName),
      sizeLabel: cvOption !== 'none' ? formatFileSize(cvFile, "~250 KB") : null,
      url: cvOption === 'upload' && cvFile ? URL.createObjectURL(cvFile) : '/pdf/cv.pdf',
      inputRef: cvInputRef,
      onChange: handleCVChange,
      canUpload: true,
    },
    {
      id: 'cv_ats',
      label: 'Curriculum Vitae ATS',
      option: cvAtsOption,
      setOption: (checked: boolean) => {
        setCvAtsOption(checked ? 'default' : 'none');
        if (checked) {
          setCvOption('none');
          setPortofolioOption('none');
        }
      },
      fileName: cvAtsOption === 'none' ? 'Tidak dilampirkan' : cvAtsName,
      sizeLabel: cvAtsOption !== 'none' ? "~120 KB" : null,
      url: atsCvUrl || '',
      inputRef: null,
      onChange: null,
      canUpload: false,
      onCustomPreview: onPreviewAtsCv,
    },
    {
      id: 'paklaring',
      label: 'Surat Pengalaman Kerja',
      option: paklaringOption,
      setOption: (checked: boolean) => setPaklaringOption(checked ? (paklaringFile ? 'upload' : 'default') : 'none'),
      fileName: paklaringOption === 'none' ? 'Tidak dilampirkan' : (paklaringOption === 'upload' && paklaringFile ? paklaringFile.name : paklaringName),
      sizeLabel: paklaringOption !== 'none' ? formatFileSize(paklaringFile, "~350 KB") : null,
      url: paklaringOption === 'upload' && paklaringFile ? URL.createObjectURL(paklaringFile) : '/pdf/paklaring.pdf',
      inputRef: paklaringInputRef,
      onChange: handlePaklaringChange,
      canUpload: true,
    },
    {
      id: 'ijazah',
      label: 'Ijazah & Transkrip Nilai',
      option: ijazahOption,
      setOption: (checked: boolean) => setIjazahOption(checked ? (ijazahFile ? 'upload' : 'default') : 'none'),
      fileName: ijazahOption === 'none' ? 'Tidak dilampirkan' : (ijazahOption === 'upload' && ijazahFile ? ijazahFile.name : ijazahName),
      sizeLabel: ijazahOption !== 'none' ? formatFileSize(ijazahFile, "~450 KB") : null,
      url: ijazahOption === 'upload' && ijazahFile ? URL.createObjectURL(ijazahFile) : '/pdf/ijazah.pdf',
      inputRef: ijazahInputRef,
      onChange: handleIjazahChange,
      canUpload: true,
    },
    {
      id: 'portofolio',
      label: 'Portofolio',
      option: portofolioOption,
      setOption: (checked: boolean) => {
        setPortofolioOption(checked ? (portofolioFile ? 'upload' : 'default') : 'none');
        if (checked) {
          setCvAtsOption('none');
        }
      },
      fileName: portofolioOption === 'none' ? 'Tidak dilampirkan' : (portofolioOption === 'upload' && portofolioFile ? portofolioFile.name : portofolioName),
      sizeLabel: portofolioOption !== 'none' ? formatFileSize(portofolioFile, "~2.5 MB") : null,
      url: portofolioOption === 'upload' && portofolioFile ? URL.createObjectURL(portofolioFile) : '/pdf/portofolio.pdf',
      inputRef: portofolioInputRef,
      onChange: handlePortofolioChange,
      canUpload: true,
    },
    {
      id: 'akademik',
      label: 'Sertifikat Akademik',
      option: sertifikatKompetensiAkademikOption,
      setOption: (checked: boolean) => setSertifikatKompetensiAkademikOption(checked ? (sertifikatKompetensiAkademikFile ? 'upload' : 'default') : 'none'),
      fileName: sertifikatKompetensiAkademikOption === 'none' ? 'Tidak dilampirkan' : (sertifikatKompetensiAkademikOption === 'upload' && sertifikatKompetensiAkademikFile ? sertifikatKompetensiAkademikFile.name : sertifikatKompetensiAkademikName),
      sizeLabel: sertifikatKompetensiAkademikOption !== 'none' ? formatFileSize(sertifikatKompetensiAkademikFile, "~300 KB") : null,
      url: sertifikatKompetensiAkademikOption === 'upload' && sertifikatKompetensiAkademikFile ? URL.createObjectURL(sertifikatKompetensiAkademikFile) : '/pdf/sertifikat/akademis.pdf',
      inputRef: sertifikatKompetensiAkademikInputRef,
      onChange: handleSertifikatKompetensiAkademikChange,
      canUpload: true,
    },
    {
      id: 'bisnis',
      label: 'Sertifikat Bisnis & Digital',
      option: sertifikatKompetensiBisnisDigitalOption,
      setOption: (checked: boolean) => setSertifikatKompetensiBisnisDigitalOption(checked ? (sertifikatKompetensiBisnisDigitalFile ? 'upload' : 'default') : 'none'),
      fileName: sertifikatKompetensiBisnisDigitalOption === 'none' ? 'Tidak dilampirkan' : (sertifikatKompetensiBisnisDigitalOption === 'upload' && sertifikatKompetensiBisnisDigitalFile ? sertifikatKompetensiBisnisDigitalFile.name : sertifikatKompetensiBisnisDigitalName),
      sizeLabel: sertifikatKompetensiBisnisDigitalOption !== 'none' ? formatFileSize(sertifikatKompetensiBisnisDigitalFile, "~300 KB") : null,
      url: sertifikatKompetensiBisnisDigitalOption === 'upload' && sertifikatKompetensiBisnisDigitalFile ? URL.createObjectURL(sertifikatKompetensiBisnisDigitalFile) : '/pdf/sertifikat/bisnis-digital.pdf',
      inputRef: sertifikatKompetensiBisnisDigitalInputRef,
      onChange: handleSertifikatKompetensiBisnisDigitalChange,
      canUpload: true,
    },
    {
      id: 'kepemimpinan',
      label: 'Sertifikat Kepemimpinan',
      option: sertifikatKompetensiKepemimpinanOption,
      setOption: (checked: boolean) => setSertifikatKompetensiKepemimpinanOption(checked ? (sertifikatKompetensiKepemimpinanFile ? 'upload' : 'default') : 'none'),
      fileName: sertifikatKompetensiKepemimpinanOption === 'none' ? 'Tidak dilampirkan' : (sertifikatKompetensiKepemimpinanOption === 'upload' && sertifikatKompetensiKepemimpinanFile ? sertifikatKompetensiKepemimpinanFile.name : sertifikatKompetensiKepemimpinanName),
      sizeLabel: sertifikatKompetensiKepemimpinanOption !== 'none' ? formatFileSize(sertifikatKompetensiKepemimpinanFile, "~300 KB") : null,
      url: sertifikatKompetensiKepemimpinanOption === 'upload' && sertifikatKompetensiKepemimpinanFile ? URL.createObjectURL(sertifikatKompetensiKepemimpinanFile) : '/pdf/sertifikat/kepemimpinan.pdf',
      inputRef: sertifikatKompetensiKepemimpinanInputRef,
      onChange: handleSertifikatKompetensiKepemimpinanChange,
      canUpload: true,
    },
    {
      id: 'speaking',
      label: 'Sertifikat Public Speaking',
      option: sertifikatKompetensiPublicSpeakingOption,
      setOption: (checked: boolean) => setSertifikatKompetensiPublicSpeakingOption(checked ? (sertifikatKompetensiPublicSpeakingFile ? 'upload' : 'default') : 'none'),
      fileName: sertifikatKompetensiPublicSpeakingOption === 'none' ? 'Tidak dilampirkan' : (sertifikatKompetensiPublicSpeakingOption === 'upload' && sertifikatKompetensiPublicSpeakingFile ? sertifikatKompetensiPublicSpeakingFile.name : sertifikatKompetensiPublicSpeakingName),
      sizeLabel: sertifikatKompetensiPublicSpeakingOption !== 'none' ? formatFileSize(sertifikatKompetensiPublicSpeakingFile, "~300 KB") : null,
      url: sertifikatKompetensiPublicSpeakingOption === 'upload' && sertifikatKompetensiPublicSpeakingFile ? URL.createObjectURL(sertifikatKompetensiPublicSpeakingFile) : '/pdf/sertifikat/public-speaking.pdf',
      inputRef: sertifikatKompetensiPublicSpeakingInputRef,
      onChange: handleSertifikatKompetensiPublicSpeakingChange,
      canUpload: true,
    },
    {
      id: 'prestasi',
      label: 'Sertifikat Prestasi',
      option: sertifikatPrestasiOption,
      setOption: (checked: boolean) => setSertifikatPrestasiOption(checked ? (sertifikatPrestasiFile ? 'upload' : 'default') : 'none'),
      fileName: sertifikatPrestasiOption === 'none' ? 'Tidak dilampirkan' : (sertifikatPrestasiOption === 'upload' && sertifikatPrestasiFile ? sertifikatPrestasiFile.name : sertifikatPrestasiName),
      sizeLabel: sertifikatPrestasiOption !== 'none' ? formatFileSize(sertifikatPrestasiFile, "~300 KB") : null,
      url: sertifikatPrestasiOption === 'upload' && sertifikatPrestasiFile ? URL.createObjectURL(sertifikatPrestasiFile) : '/pdf/sertifikat/prestasi.pdf',
      inputRef: sertifikatPrestasiInputRef,
      onChange: handleSertifikatPrestasiChange,
      canUpload: true,
    },
  ];

  return (
    <div className="space-y-4">
      {viewMode === 'list' ? (
        /* List layout: very compact horizontal grid items */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
          {items.map((item) => {
            const isSelected = item.option !== 'none';

            return (
              <div 
                key={item.id}
                className={`group border rounded-lg p-2.5 transition-all duration-300 flex items-center justify-between shadow-sm ${
                  isSelected 
                    ? 'bg-[#02227E] dark:bg-[#02227E] border-[#02227E] dark:border-[#02227E] text-white' 
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-[#02227E]/80'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <label className="flex items-center gap-2.5 select-none cursor-pointer min-w-0 flex-1">
                    <input 
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => item.setOption(e.target.checked)}
                      className={`w-3.5 h-3.5 rounded cursor-pointer shrink-0 ${
                        isSelected 
                          ? 'text-[#02227E] bg-white border-white focus:ring-offset-0 focus:ring-0 focus:ring-transparent' 
                          : 'text-[#02227E] border-slate-300 dark:border-slate-700 focus:ring-[#02227E]'
                      }`}
                    />
                    <FileIcon className={`w-4 h-4 transition-colors shrink-0 ${
                      isSelected 
                        ? 'text-white' 
                        : 'text-slate-400 group-hover:text-[#02227E] dark:text-slate-500 dark:group-hover:text-[#02227E]'
                    }`} />
                    <div className="min-w-0 flex-1 text-left">
                      <h4 className={`text-[10.5px] font-bold truncate leading-tight transition-colors ${
                        isSelected 
                          ? 'text-white' 
                          : 'text-slate-800 dark:text-slate-200 hover:text-[#02227E] dark:hover:text-[#02227E]'
                      }`} title={item.label}>
                        {item.label}
                      </h4>
                    </div>
                  </label>
                </div>
                
                {/* Action preview trigger button */}
                {item.url && (
                  <button
                    type="button"
                    onClick={() => item.onCustomPreview ? item.onCustomPreview() : onPreview(item.label, item.url)}
                    className={`p-1.5 rounded transition-colors cursor-pointer shrink-0 ml-1.5 ${
                      isSelected 
                        ? 'text-white/90 hover:text-white hover:bg-white/15' 
                        : 'text-slate-400 hover:text-[#02227E] dark:text-slate-500 dark:hover:text-[#02227E] hover:bg-slate-100 dark:hover:bg-slate-800/80'
                    }`}
                    title="Lihat Dokumen"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* Card layout with PDF Thumbnail - 5 columns */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {items.map((item) => {
            const isSelected = item.option !== 'none';

            return (
              <div 
                key={item.id}
                className={`group bg-white dark:bg-slate-900 border ${
                  isSelected 
                    ? 'border-[#02227E] ring-1 ring-[#02227E]/10' 
                    : 'border-slate-200 dark:border-slate-800 hover:border-[#02227E]/80'
                } rounded-lg overflow-hidden transition-all duration-300 flex flex-col shadow-sm`}
              >
                {/* PDF Thumbnail Area - 1:1 Aspect Square */}
                <div 
                  className="aspect-square w-full bg-slate-100/50 dark:bg-slate-950 flex flex-col items-center justify-center shrink-0 relative overflow-hidden border-b border-slate-100 dark:border-slate-800/80 cursor-pointer"
                  onClick={() => item.onCustomPreview ? item.onCustomPreview() : onPreview(item.label, item.url)}
                  title="Klik untuk melihat dokumen"
                >
                  {item.url ? (
                    <div className="w-full h-full scale-[0.98] origin-top transition-transform duration-300 group-hover:scale-100">
                      <PdfThumbnail url={item.url} />
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100/50 dark:bg-slate-800/50 text-slate-450 gap-2">
                      <FileIcon className="w-8 h-8 text-[#02227E] animate-pulse" />
                      <span className="text-[10px] font-semibold text-slate-500">Membuat PDF...</span>
                    </div>
                  )}
                  
                  {/* Subtle overlay on hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                </div>

                {/* Text & checkbox */}
                <div className={`p-2 flex flex-col flex-1 justify-center text-left transition-colors duration-300 ${
                  isSelected 
                    ? 'bg-[#02227E] text-white' 
                    : 'bg-white dark:bg-slate-900'
                }`}>
                  <label className="flex items-center gap-1.5 select-none cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => item.setOption(e.target.checked)}
                      className={`w-3.5 h-3.5 rounded cursor-pointer shrink-0 ${
                        isSelected 
                          ? 'text-[#02227E] bg-white border-white focus:ring-offset-0 focus:ring-0 focus:ring-transparent' 
                          : 'text-[#02227E] border-slate-300 dark:border-slate-700 focus:ring-[#02227E]'
                      }`}
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className={`text-[10px] font-bold truncate leading-tight transition-colors ${
                        isSelected 
                          ? 'text-white' 
                          : 'text-slate-800 dark:text-slate-200 hover:text-[#02227E] dark:hover:text-[#02227E]'
                      }`} title={item.label}>
                        {item.label}
                      </h4>
                    </div>
                  </label>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
