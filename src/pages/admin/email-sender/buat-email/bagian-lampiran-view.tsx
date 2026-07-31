import React, { useState } from 'react';
import { FileText, Eye, Check, ArrowUp, ArrowDown, Sparkles, RotateCcw } from 'lucide-react';
import { formatFileSize } from './komponen-view';
import { defaultImagesMap } from '../utils/defaultImagesMap';


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
  onPreview: (title: string, url: string, urls?: string[]) => void;
  onPreviewAtsCv: () => void;
  viewMode?: 'list' | 'card';
  portofolioSubtype?: string;
  setPortofolioSubtype?: (val: string) => void;
  
  preparedPdfs?: { blob: Blob; filename: string }[] | null;
  setPreparedPdfs?: (val: { blob: Blob; filename: string }[] | null) => void;
  preparedTotalBytes?: number;
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
  portofolioSubtype = 'all',
  setPortofolioSubtype,
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
  preparedPdfs,
  setPreparedPdfs,
  preparedTotalBytes = 0,
}: AttachmentSelectorSectionProps) => {

  const [orderCv, setOrderCv] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('career_order_cv');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (_) {}
    return ['cv', 'cv_ats'];
  });

  const [orderPengalaman, setOrderPengalaman] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('career_order_pengalaman');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (_) {}
    return ['paklaring', 'portofolio_text'];
  });

  const [orderPortofolio, setOrderPortofolio] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('career_order_portofolio');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (_) {}
    return ['portofolio_app_hr', 'portofolio_app_logistik', 'portofolio_app_marketing'];
  });

  const [orderSertifikat, setOrderSertifikat] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('career_order_sertifikat');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (_) {}
    return ['ijazah', 'akademik', 'bisnis', 'prestasi', 'kepemimpinan', 'speaking'];
  });

  const handleSwap = (groupKey: 'cv' | 'pengalaman' | 'portofolio' | 'sertifikat', indexA: number, indexB: number) => {
    let itemsArray: typeof items = [];
    let orderArray: string[] = [];
    let setOrder: any = null;
    let storageKey = '';

    if (groupKey === 'cv') {
      itemsArray = cvItems; orderArray = orderCv; setOrder = setOrderCv; storageKey = 'career_order_cv';
    } else if (groupKey === 'pengalaman') {
      itemsArray = pengalamanItems; orderArray = orderPengalaman; setOrder = setOrderPengalaman; storageKey = 'career_order_pengalaman';
    } else if (groupKey === 'portofolio') {
      itemsArray = portofolioItems; orderArray = orderPortofolio; setOrder = setOrderPortofolio; storageKey = 'career_order_portofolio';
    } else if (groupKey === 'sertifikat') {
      itemsArray = sertifikatItems; orderArray = orderSertifikat; setOrder = setOrderSertifikat; storageKey = 'career_order_sertifikat';
    }

    if (!setOrder) return;

    const idA = itemsArray[indexA].id;
    const idB = itemsArray[indexB].id;

    const next = [...orderArray];
    const realIndexA = next.indexOf(idA);
    const realIndexB = next.indexOf(idB);
    
    if (realIndexA !== -1 && realIndexB !== -1) {
      next[realIndexA] = idB;
      next[realIndexB] = idA;
      setOrder(next);
      localStorage.setItem(storageKey, JSON.stringify(next));
    }
  };

  // Estimate size of files to inform user
  const getEstimatedSize = (option: string, file: File | null, defaultKb: number) => {
    if (option === 'none') return 0;
    if (option === 'upload' && file) return file.size;
    return defaultKb * 1024; // convert KB to bytes
  };

  const getPortofolioSize = () => {
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

  const cvSize = getEstimatedSize(cvOption, cvFile, 250);
  const cvAtsSize = getEstimatedSize(cvAtsOption, null, 120);
  const portofolioSize = getPortofolioSize();
  const paklaringSize = getEstimatedSize(paklaringOption, paklaringFile, 350);
  const akademikSize = getEstimatedSize(sertifikatKompetensiAkademikOption, sertifikatKompetensiAkademikFile, 300);
  const bisnisSize = getEstimatedSize(sertifikatKompetensiBisnisDigitalOption, sertifikatKompetensiBisnisDigitalFile, 300);
  const kepemimpinanSize = getEstimatedSize(sertifikatKompetensiKepemimpinanOption, sertifikatKompetensiKepemimpinanFile, 300);
  const speakingSize = getEstimatedSize(sertifikatKompetensiPublicSpeakingOption, sertifikatKompetensiPublicSpeakingFile, 300);
  const prestasiSize = getEstimatedSize(sertifikatPrestasiOption, sertifikatPrestasiFile, 300);

  const totalBytes = cvSize + cvAtsSize + portofolioSize + paklaringSize +
    akademikSize + bisnisSize + kepemimpinanSize + speakingSize + prestasiSize;

  const totalMb = totalBytes / (1024 * 1024);
  const limitMb = 25.0; // standard Gmail limit

  const items = [
    {
      id: 'cv',
      label: 'CV Kreatif',
      option: cvOption,
      setOption: (checked: boolean) => {
        setCvOption(checked ? 'default' : 'none');
        if (checked) {
          setCvAtsOption('none');
        }
      },
      fileName: cvOption === 'none' ? 'Tidak dilampirkan' : cvName,
      sizeLabel: cvOption === 'upload' && cvFile ? formatFileSize(cvFile) : (cvOption !== 'none' ? "~250 KB" : null),
      url: '/gambar/cv/cv-blue-2026.webp',
    },
    {
      id: 'cv_ats',
      label: 'Curriculum Vitae ATS',
      option: cvAtsOption,
      setOption: (checked: boolean) => {
        setCvAtsOption(checked ? 'default' : 'none');
        if (checked) {
          setCvOption('none');
        }
      },
      fileName: cvAtsOption === 'none' ? 'Tidak dilampirkan' : cvAtsName,
      sizeLabel: cvAtsOption !== 'none' ? "~120 KB" : null,
      url: '/gambar/cv/cv-blue-2026.webp',
      onCustomPreview: onPreviewAtsCv,
    },
    {
      id: 'paklaring',
      label: 'Surat Pengalaman Kerja',
      option: paklaringOption,
      setOption: (checked: boolean) => setPaklaringOption(checked ? 'default' : 'none'),
      fileName: paklaringOption === 'none' ? 'Tidak dilampirkan' : paklaringName,
      sizeLabel: paklaringOption === 'upload' && paklaringFile ? formatFileSize(paklaringFile) : (paklaringOption !== 'none' ? "~350 KB" : null),
      url: '/gambar/paklaring/gmg.webp',
      urls: defaultImagesMap.paklaring,
    },
    {
      id: 'ijazah',
      label: 'Ijazah & Transkrip Nilai',
      option: ijazahOption,
      setOption: (checked: boolean) => setIjazahOption(checked ? 'default' : 'none'),
      fileName: ijazahOption === 'none' ? 'Tidak dilampirkan' : ijazahName,
      sizeLabel: ijazahOption === 'upload' && ijazahFile ? formatFileSize(ijazahFile) : (ijazahOption !== 'none' ? "~450 KB" : null),
      url: '/gambar/sertifikat/akademis1.webp',
      urls: defaultImagesMap.ijazah,
    },
    {
      id: 'akademik',
      label: 'Sertifikat Akademik',
      option: sertifikatKompetensiAkademikOption,
      setOption: (checked: boolean) => setSertifikatKompetensiAkademikOption(checked ? 'default' : 'none'),
      fileName: sertifikatKompetensiAkademikOption === 'none' ? 'Tidak dilampirkan' : sertifikatKompetensiAkademikName,
      sizeLabel: sertifikatKompetensiAkademikOption === 'upload' && sertifikatKompetensiAkademikFile ? formatFileSize(sertifikatKompetensiAkademikFile) : (sertifikatKompetensiAkademikOption !== 'none' ? "~300 KB" : null),
      url: '/gambar/sertifikat/akademis1.webp',
      urls: defaultImagesMap.akademik,
    },
    {
      id: 'bisnis',
      label: 'Sertifikat Bisnis & Digital',
      option: sertifikatKompetensiBisnisDigitalOption,
      setOption: (checked: boolean) => setSertifikatKompetensiBisnisDigitalOption(checked ? 'default' : 'none'),
      fileName: sertifikatKompetensiBisnisDigitalOption === 'none' ? 'Tidak dilampirkan' : sertifikatKompetensiBisnisDigitalName,
      sizeLabel: sertifikatKompetensiBisnisDigitalOption === 'upload' && sertifikatKompetensiBisnisDigitalFile ? formatFileSize(sertifikatKompetensiBisnisDigitalFile) : (sertifikatKompetensiBisnisDigitalOption !== 'none' ? "~300 KB" : null),
      url: '/gambar/sertifikat/bisnis-digital1.webp',
      urls: defaultImagesMap.bisnis,
    },
    {
      id: 'prestasi',
      label: 'Sertifikat Prestasi',
      option: sertifikatPrestasiOption,
      setOption: (checked: boolean) => setSertifikatPrestasiOption(checked ? 'default' : 'none'),
      fileName: sertifikatPrestasiOption === 'none' ? 'Tidak dilampirkan' : sertifikatPrestasiName,
      sizeLabel: sertifikatPrestasiOption === 'upload' && sertifikatPrestasiFile ? formatFileSize(sertifikatPrestasiFile) : (sertifikatPrestasiOption !== 'none' ? "~300 KB" : null),
      url: '/gambar/sertifikat/prestasi1.webp',
      urls: defaultImagesMap.prestasi,
    },
    {
      id: 'kepemimpinan',
      label: 'Sertifikat Kepemimpinan',
      option: sertifikatKompetensiKepemimpinanOption,
      setOption: (checked: boolean) => setSertifikatKompetensiKepemimpinanOption(checked ? 'default' : 'none'),
      fileName: sertifikatKompetensiKepemimpinanOption === 'none' ? 'Tidak dilampirkan' : sertifikatKompetensiKepemimpinanName,
      sizeLabel: sertifikatKompetensiKepemimpinanOption === 'upload' && sertifikatKompetensiKepemimpinanFile ? formatFileSize(sertifikatKompetensiKepemimpinanFile) : (sertifikatKompetensiKepemimpinanOption !== 'none' ? "~300 KB" : null),
      url: '/gambar/sertifikat/kepemimpinan1.webp',
      urls: defaultImagesMap.kepemimpinan,
    },
    {
      id: 'speaking',
      label: 'Sertifikat Public Speaking',
      option: sertifikatKompetensiPublicSpeakingOption,
      setOption: (checked: boolean) => setSertifikatKompetensiPublicSpeakingOption(checked ? 'default' : 'none'),
      fileName: sertifikatKompetensiPublicSpeakingOption === 'none' ? 'Tidak dilampirkan' : sertifikatKompetensiPublicSpeakingName,
      sizeLabel: sertifikatKompetensiPublicSpeakingOption === 'upload' && sertifikatKompetensiPublicSpeakingFile ? formatFileSize(sertifikatKompetensiPublicSpeakingFile) : (sertifikatKompetensiPublicSpeakingOption !== 'none' ? "~300 KB" : null),
      url: '/gambar/sertifikat/public-speaking1.webp',
      urls: defaultImagesMap.speaking,
    },
    {
      id: 'portofolio_app_hr',
      label: 'Portofolio App HRD',
      option: (portofolioOption !== 'none' && portofolioSubtype.split(',').includes('app_hr')) ? portofolioOption : 'none',
      setOption: (checked: boolean) => {
        let active = portofolioOption === 'none' ? [] : (portofolioSubtype ? portofolioSubtype.split(',').filter(Boolean) : []);
        if (checked) {
          if (!active.includes('app_hr')) {
            active.push('app_hr');
          }
          setPortofolioOption('default');
        } else {
          active = active.filter(x => x !== 'app_hr');
          if (active.length === 0) {
            setPortofolioOption('none');
          }
        }
        if (setPortofolioSubtype) setPortofolioSubtype(active.join(','));
      },
      fileName: (portofolioOption !== 'none' && portofolioSubtype.split(',').includes('app_hr')) ? 'Portofolio_App_HRD.pdf' : 'Tidak dilampirkan',
      sizeLabel: (portofolioOption !== 'none' && portofolioSubtype.split(',').includes('app_hr')) ? "~500 KB" : null,
      url: '/gambar/portofolio/app-hr1.webp',
      urls: defaultImagesMap.portofolio_app_hr,
    },
    {
      id: 'portofolio_app_logistik',
      label: 'Portofolio App Logistik & Ops',
      option: (portofolioOption !== 'none' && portofolioSubtype.split(',').includes('app_logistik')) ? portofolioOption : 'none',
      setOption: (checked: boolean) => {
        let active = portofolioOption === 'none' ? [] : (portofolioSubtype ? portofolioSubtype.split(',').filter(Boolean) : []);
        if (checked) {
          if (!active.includes('app_logistik')) {
            active.push('app_logistik');
          }
          setPortofolioOption('default');
        } else {
          active = active.filter(x => x !== 'app_logistik');
          if (active.length === 0) {
            setPortofolioOption('none');
          }
        }
        if (setPortofolioSubtype) setPortofolioSubtype(active.join(','));
      },
      fileName: (portofolioOption !== 'none' && portofolioSubtype.split(',').includes('app_logistik')) ? 'Portofolio_App_Logistik_Ops.pdf' : 'Tidak dilampirkan',
      sizeLabel: (portofolioOption !== 'none' && portofolioSubtype.split(',').includes('app_logistik')) ? "~500 KB" : null,
      url: '/gambar/portofolio/app-log-op1.webp',
      urls: defaultImagesMap.portofolio_app_logistik,
    },
    {
      id: 'portofolio_app_marketing',
      label: 'Portofolio App Marketing',
      option: (portofolioOption !== 'none' && portofolioSubtype.split(',').includes('app_marketing')) ? portofolioOption : 'none',
      setOption: (checked: boolean) => {
        let active = portofolioOption === 'none' ? [] : (portofolioSubtype ? portofolioSubtype.split(',').filter(Boolean) : []);
        if (checked) {
          if (!active.includes('app_marketing')) {
            active.push('app_marketing');
          }
          setPortofolioOption('default');
        } else {
          active = active.filter(x => x !== 'app_marketing');
          if (active.length === 0) {
            setPortofolioOption('none');
          }
        }
        if (setPortofolioSubtype) setPortofolioSubtype(active.join(','));
      },
      fileName: (portofolioOption !== 'none' && portofolioSubtype.split(',').includes('app_marketing')) ? 'Portofolio_App_Marketing.pdf' : 'Tidak dilampirkan',
      sizeLabel: (portofolioOption !== 'none' && portofolioSubtype.split(',').includes('app_marketing')) ? "~500 KB" : null,
      url: '/gambar/portofolio/app-marketing1.webp',
      urls: defaultImagesMap.portofolio_app_marketing,
    },
    {
      id: 'portofolio_text',
      label: 'Detail Pengalaman Kerja',
      option: (portofolioOption !== 'none' && portofolioSubtype.split(',').includes('text')) ? portofolioOption : 'none',
      setOption: (checked: boolean) => {
        let active = portofolioOption === 'none' ? [] : (portofolioSubtype ? portofolioSubtype.split(',').filter(Boolean) : []);
        if (checked) {
          if (!active.includes('text')) {
            active.push('text');
          }
          setPortofolioOption('default');
        } else {
          active = active.filter(x => x !== 'text');
          if (active.length === 0) {
            setPortofolioOption('none');
          }
        }
        if (setPortofolioSubtype) setPortofolioSubtype(active.join(','));
      },
      fileName: (portofolioOption !== 'none' && portofolioSubtype.split(',').includes('text')) ? 'Detail_Pengalaman_Kerja.pdf' : 'Tidak dilampirkan',
      sizeLabel: (portofolioOption !== 'none' && portofolioSubtype.split(',').includes('text')) ? "~1.5 MB" : null,
      url: '/gambar/portofolio/text-mo-sdz.webp',
      urls: defaultImagesMap.portofolio_text,
    },
  ];

  const sortOptimalGroup = (itemsArr: typeof items, orderArr: string[]) => {
    return itemsArr.sort((a, b) => {
      const aSelected = a.option !== 'none';
      const bSelected = b.option !== 'none';
      if (aSelected && !bSelected) return -1;
      if (!aSelected && bSelected) return 1;
      return orderArr.indexOf(a.id) - orderArr.indexOf(b.id);
    });
  };

  const cvItems = sortOptimalGroup(
    items.filter(item => ['cv', 'cv_ats'].includes(item.id)),
    orderCv
  );

  const pengalamanItems = sortOptimalGroup(
    items.filter(item => ['paklaring', 'portofolio_text'].includes(item.id)),
    orderPengalaman
  );

  const portofolioItems = sortOptimalGroup(
    items.filter(item => ['portofolio_app_hr', 'portofolio_app_logistik', 'portofolio_app_marketing'].includes(item.id)),
    orderPortofolio
  );

  const sertifikatItems = sortOptimalGroup(
    items.filter(item => ['ijazah', 'akademik', 'bisnis', 'prestasi', 'kepemimpinan', 'speaking'].includes(item.id)),
    orderSertifikat
  );

  const defaultOrder = [
    'cv', 'cv_ats', 
    'paklaring', 'portofolio_text',
    'ijazah', 'akademik', 'bisnis', 'prestasi', 
    'kepemimpinan', 'speaking',
    'portofolio_app_hr', 'portofolio_app_logistik', 
    'portofolio_app_marketing'
  ];

  const allOrder = [
    'cv', 'cv_ats', 
    'portofolio_app_hr', 'portofolio_app_logistik', 'portofolio_app_marketing', 'portofolio_text', 
    'paklaring', 
    'ijazah', 'akademik', 'bisnis', 'kepemimpinan', 'speaking', 'prestasi'
  ];

  const sortedItems = [...items].sort((a, b) => {
    if (mergeAttachments === 'all') {
      return allOrder.indexOf(a.id) - allOrder.indexOf(b.id);
    } else {
      return defaultOrder.indexOf(a.id) - defaultOrder.indexOf(b.id);
    }
  });

  const renderItem = (item: typeof items[0]) => {
    const isSelected = item.option !== 'none';
    return (
      <div 
        key={item.id}
        onClick={() => item.setOption(!isSelected)}
        className={`p-3 rounded-xl transition-all flex items-center justify-between gap-3 cursor-pointer select-none ${
          isSelected 
            ? 'bg-blue-50/80 dark:bg-slate-800/90 shadow-xs border border-[#02227E]/30 dark:border-blue-500/30' 
            : 'bg-white dark:bg-slate-900 shadow-xs hover:shadow-md border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
        }`}
      >
        {/* Left: Circle Checkbox + Title + File Info */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          {/* Circle Checkbox Dark Blue (#02227E) */}
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all ${
              isSelected
                ? 'bg-[#02227E] text-white shadow-xs'
                : 'border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:border-[#02227E]'
            }`}
          >
            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
          </div>

          <div className="min-w-0 flex-1 text-left">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className={`text-xs font-bold leading-tight ${
                isSelected 
                  ? 'text-[#02227E] dark:text-blue-300' 
                  : 'text-slate-800 dark:text-slate-200'
              }`}>
                {item.label}
              </span>
              {item.sizeLabel && (
                <span className={`text-[9px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-full ${
                  isSelected ? 'hidden sm:inline' : ''
                }`}>
                  {item.sizeLabel}
                </span>
              )}
            </div>
            <p className={`text-[10px] text-slate-400 dark:text-slate-500 truncate mt-0.5 ${
              isSelected ? 'hidden sm:block' : ''
            }`}>
              {item.fileName}
            </p>
          </div>
        </div>

        {/* Right: Actions (Buka Modal) tanpa garis pemisah */}
        <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
          {/* Tombol Buka Modal (#F1F5F9 di desktop, icon mata saja di mobile) */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (item.onCustomPreview) {
                item.onCustomPreview();
              } else {
                onPreview(item.label, item.url, item.urls);
              }
            }}
            className="p-1 sm:px-2.5 sm:py-1 text-[11px] font-bold text-slate-700 dark:text-slate-300 bg-transparent sm:bg-[#F1F5F9] dark:sm:bg-slate-800 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 active:scale-95 sm:rounded-lg transition-all flex items-center gap-1 cursor-pointer border-none shadow-none outline-hidden"
            title="Buka preview modal berkas"
          >
            <Eye className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-slate-500 dark:text-slate-400" />
            <span className="hidden sm:inline">Buka</span>
          </button>
        </div>
      </div>
    );
  };

  const renderItemWithArrows = (
    item: typeof items[0],
    groupKey: 'cv' | 'pengalaman' | 'portofolio' | 'sertifikat',
    index: number,
    itemsArray: typeof items
  ) => {
    const isSelected = item.option !== 'none';
    const totalCount = itemsArray.length;
    const canMoveUp = isSelected && index > 0 && itemsArray[index - 1].option !== 'none';
    const canMoveDown = isSelected && index < totalCount - 1 && itemsArray[index + 1].option !== 'none';

    return (
      <div 
        key={item.id}
        onClick={() => item.setOption(!isSelected)}
        className={`p-3 rounded-xl transition-all flex items-center justify-between gap-3 cursor-pointer select-none ${
          isSelected 
            ? 'bg-blue-50/80 dark:bg-slate-800/90 shadow-xs border border-[#02227E]/30 dark:border-blue-500/30' 
            : 'bg-white dark:bg-slate-900 shadow-xs hover:shadow-md border border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
        }`}
      >
        {/* Left: Circle Checkbox + Title + File Info */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          {/* Circle Checkbox Dark Blue (#02227E) */}
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all ${
              isSelected
                ? 'bg-[#02227E] text-white shadow-xs'
                : 'border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 hover:border-[#02227E]'
            }`}
          >
            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
          </div>

          <div className="min-w-0 flex-1 text-left">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className={`text-xs font-bold leading-tight ${
                isSelected 
                  ? 'text-[#02227E] dark:text-blue-300' 
                  : 'text-slate-800 dark:text-slate-200'
              }`}>
                {item.label}
              </span>
              {item.sizeLabel && (
                <span className={`text-[9px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-full ${
                  isSelected ? 'hidden sm:inline' : ''
                }`}>
                  {item.sizeLabel}
                </span>
              )}
            </div>
            <p className={`text-[10px] text-slate-400 dark:text-slate-500 truncate mt-0.5 ${
              isSelected ? 'hidden sm:block' : ''
            }`}>
              {item.fileName}
            </p>
          </div>
        </div>

        {/* Right: Actions (Arrows + Buka Modal) */}
        <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
          {/* Swapping Arrows */}
          {canMoveUp && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleSwap(groupKey, index, index - 1);
              }}
              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg transition-all cursor-pointer"
              title="Pindahkan ke atas"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          )}
          {canMoveDown && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleSwap(groupKey, index, index + 1);
              }}
              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg transition-all cursor-pointer"
              title="Pindahkan ke bawah"
            >
              <ArrowDown className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Tombol Buka Modal (#F1F5F9 di desktop, icon mata saja di mobile) */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (item.onCustomPreview) {
                item.onCustomPreview();
              } else {
                onPreview(item.label, item.url, item.urls);
              }
            }}
            className="p-1 sm:px-2.5 sm:py-1 text-[11px] font-bold text-slate-700 dark:text-slate-300 bg-transparent sm:bg-[#F1F5F9] dark:sm:bg-slate-800 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 active:scale-95 sm:rounded-lg transition-all flex items-center gap-1 cursor-pointer border-none shadow-none outline-hidden"
            title="Buka preview modal berkas"
          >
            <Eye className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-slate-500 dark:text-slate-400" />
            <span className="hidden sm:inline">Buka</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4 text-left">
      {preparedPdfs && preparedPdfs.length > 0 ? (
        <div className="space-y-4">
          {/* Header Bar when PDFs are merged */}
          <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/80 p-3.5 rounded-xl flex items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center shrink-0">
                <Check className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div className="text-left">
                <p className="font-bold text-xs text-emerald-900 dark:text-emerald-200">
                  {preparedPdfs.length} Berkas PDF Siap Kirim (Total: {formatFileSize(preparedTotalBytes)})
                </p>
                <p className="text-[10px] text-emerald-700/90 dark:text-emerald-400/90 mt-0.5">
                  Seluruh lampiran telah dikonversi &amp; digabung. Klik <b>Buka</b> untuk preview sebelum dikirim.
                </p>
              </div>
            </div>
          </div>

          {/* List of Merged PDFs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {preparedPdfs.map((pdf, idx) => (
              <div 
                key={idx} 
                className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between gap-3 hover:border-blue-300 dark:hover:border-blue-700 transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-[#02227E] flex items-center justify-center shrink-0 text-white">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 text-left">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                      {pdf.filename}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 hidden sm:inline">
                        {formatFileSize(pdf.blob.size)}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const blobUrl = URL.createObjectURL(pdf.blob);
                    onPreview(pdf.filename, blobUrl);
                  }}
                  className="p-1 sm:px-3 sm:py-1.5 text-[11px] font-bold text-slate-700 dark:text-slate-300 bg-transparent sm:bg-[#F1F5F9] dark:sm:bg-slate-800 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 active:scale-95 sm:rounded-lg transition-all flex items-center gap-1 cursor-pointer border-none shadow-none shrink-0"
                >
                  <Eye className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-slate-500 dark:text-slate-400" />
                  <span className="hidden sm:inline">Buka</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : mergeAttachments === 'optimal' ? (
        <div className="space-y-5">
          {/* Row 1: Curriculum Vitae | Pengalaman Kerja */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {/* Section 1: Curriculum Vitae */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Curriculum Vitae
                </span>
                <span className="text-[10px] font-normal text-slate-400 dark:text-slate-500">
                  ({cvItems.filter(i => i.option !== 'none').length} dipilih)
                </span>
                <div className="h-px bg-slate-100 dark:bg-slate-800 flex-grow" />
              </div>
              <div className="flex flex-col gap-2">
                {cvItems.map((item, idx) => renderItemWithArrows(item, 'cv', idx, cvItems))}
              </div>
            </div>

            {/* Section 2: Pengalaman Kerja */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Pengalaman Kerja
                </span>
                <span className="text-[10px] font-normal text-slate-400 dark:text-slate-500">
                  ({pengalamanItems.filter(i => i.option !== 'none').length} dipilih)
                </span>
                <div className="h-px bg-slate-100 dark:bg-slate-800 flex-grow" />
              </div>
              <div className="flex flex-col gap-2">
                {pengalamanItems.map((item, idx) => renderItemWithArrows(item, 'pengalaman', idx, pengalamanItems))}
              </div>
            </div>
          </div>

          {/* Row 2: Portofolio | Sertifikat */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {/* Section 3: Portofolio */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Portofolio
                </span>
                <span className="text-[10px] font-normal text-slate-400 dark:text-slate-500">
                  ({portofolioItems.filter(i => i.option !== 'none').length} dipilih)
                </span>
                <div className="h-px bg-slate-100 dark:bg-slate-800 flex-grow" />
              </div>
              <div className="flex flex-col gap-2">
                {portofolioItems.map((item, idx) => renderItemWithArrows(item, 'portofolio', idx, portofolioItems))}
              </div>
            </div>

            {/* Section 4: Sertifikat */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Sertifikat
                </span>
                <span className="text-[10px] font-normal text-slate-400 dark:text-slate-500">
                  ({sertifikatItems.filter(i => i.option !== 'none').length} dipilih)
                </span>
                <div className="h-px bg-slate-100 dark:bg-slate-800 flex-grow" />
              </div>
              <div className="flex flex-col gap-2">
                {sertifikatItems.map((item, idx) => renderItemWithArrows(item, 'sertifikat', idx, sertifikatItems))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {sortedItems.map(renderItem)}
        </div>
      )}
    </div>
  );
};

