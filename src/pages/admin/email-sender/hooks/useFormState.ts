import React, { useState, useEffect, useRef } from 'react';
import { ApiService } from '../../../../services/api';
import { generateAtsCvDoc } from '../../../../utils/atsCvGenerator';
import { CoverLetterTemplate, DEFAULT_TEMPLATES } from '../templates';
import { ProfileData } from '../../../../types';
import { EmailDraft, AttachedFile } from '../type';
import { buildEmailContent, getCityFromAlamat } from '../utils/parser';
import { defaultImagesMap } from '../utils/defaultImagesMap';

export function useFormState() {
  const [templates, setTemplates] = useState<CoverLetterTemplate[]>([]);
  const [selectedTplId, setSelectedTplId] = useState('');
  
  // Drafts & Previews
  const [drafts, setDrafts] = useState<EmailDraft[]>([]);
  const [editingDraftId, setEditingDraftId] = useState<string | null>(null);
  const [editingDraftStatus, setEditingDraftStatus] = useState<'draft' | 'terkirim' | null>(null);
  const [activeTab, setActiveTab] = useState<'editor' | 'status' | 'templates' | 'email-templates'>(() => {
    const path = window.location.pathname;
    if (path.startsWith('/admin/email-sender/')) {
      const sub = path.split('/')[3];
      if (['editor', 'status', 'templates', 'email-templates'].includes(sub)) {
        return sub as any;
      }
    }
    return 'editor';
  });

  // Sync internal activeTab to URL
  useEffect(() => {
    // Only update if we are currently in email-sender
    if (window.location.pathname.startsWith('/admin/email-sender')) {
      const newPath = `/admin/email-sender/${activeTab}`;
      if (window.location.pathname !== newPath) {
        window.history.pushState(null, '', newPath);
      }
    }
  }, [activeTab]);

  // Listen to browser navigation
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.startsWith('/admin/email-sender/')) {
        const sub = path.split('/')[3];
        if (['editor', 'status', 'templates', 'email-templates'].includes(sub)) {
          setActiveTab(sub as any);
        } else {
          setActiveTab('editor');
        }
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [desktopActionTarget, setDesktopActionTarget] = useState<HTMLElement | null>(null);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  // Preview Layout States
  const [previewSections, setPreviewSections] = useState({ tertuju: true, isi: true, lampiran: true });
  const [previewPdf, setPreviewPdf] = useState<{ url: string, urls?: string[], name: string } | null>(null);

  const togglePreviewSection = (section: 'tertuju' | 'isi' | 'lampiran') => {
    setPreviewSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const openPdfPreview = async (fileData: AttachedFile) => {
    if (fileData.option === 'default') {
      if (fileData.label === 'CV ATS') {
        try {
          const { doc } = await generateAtsCvDoc();
          const blob = doc.output('blob');
          const url = URL.createObjectURL(blob);
          setPreviewPdf({ url, name: fileData.defaultName });
        } catch (err) {
          console.error("Gagal membuat preview CV ATS", err);
          alert("Gagal membuat preview CV ATS. Pastikan data profil Anda sudah lengkap.");
        }
        return;
      }
      
      let urls: string[] | undefined = undefined;
      let url = '';

      if (fileData.label.includes('HRD')) {
        urls = defaultImagesMap.portofolio_app_hr;
        url = urls[0];
      } else if (fileData.label.includes('Logistik')) {
        urls = defaultImagesMap.portofolio_app_logistik;
        url = urls[0];
      } else if (fileData.label.includes('Marketing')) {
        urls = defaultImagesMap.portofolio_app_marketing;
        url = urls[0];
      } else if (fileData.label.includes('Content') || fileData.label.includes('Copywriting') || fileData.label.includes('Tertulis') || fileData.label.includes('Detail Pengalaman Kerja')) {
        urls = defaultImagesMap.portofolio_text;
        url = urls[0];
      } else if (fileData.label === 'Sertifikat Kompetensi Akademik') {
        urls = defaultImagesMap.akademik;
        url = urls[0];
      } else if (fileData.label === 'Sertifikat Kompetensi Bisnis dan Digital') {
        urls = defaultImagesMap.bisnis;
        url = urls[0];
      } else if (fileData.label === 'Sertifikat Kompetensi Kepemimpinan') {
        urls = defaultImagesMap.kepemimpinan;
        url = urls[0];
      } else if (fileData.label === 'Sertifikat Kompetensi Public Speaking') {
        urls = defaultImagesMap.speaking;
        url = urls[0];
      } else if (fileData.label === 'Sertifikat Prestasi') {
        urls = defaultImagesMap.prestasi;
        url = urls[0];
      } else if (fileData.label === 'Paklaring') {
        urls = defaultImagesMap.paklaring;
        url = urls[0];
      } else {
        const urlMap: Record<string, string> = {
          'CV': '/gambar/cv/cv-blue-2026.webp',
          'Portofolio': '/gambar/portofolio/app-hr1.webp',
          'Paklaring': '/gambar/paklaring/gmg.webp',
          'Ijazah': '/gambar/sertifikat/akademis1.webp'
        };
        url = urlMap[fileData.label] || '';
      }

      setPreviewPdf({ url, urls, name: fileData.defaultName });
    } else if (fileData.option === 'upload' && fileData.file) {
      const url = URL.createObjectURL(fileData.file);
      setPreviewPdf({ url, name: fileData.file.name });
    }
  };

  const closePdfPreview = () => {
    if (previewPdf?.url.startsWith('blob:')) {
      URL.revokeObjectURL(previewPdf.url);
    }
    setPreviewPdf(null);
  };

  useEffect(() => {
    setDesktopActionTarget(document.getElementById('desktop-top-bar-actions'));
  }, []);

  useEffect(() => {
    ApiService.get<any>('profil')
      .then(res => res.data)
      .then(data => {
        setProfileData(data);
        if (data) {
          if (data.nama) {
            setBioNama(data.nama);
            setCvAtsName(`CV_ATS_${data.nama.replace(/\s+/g, '_')}.pdf`);
          }
          const tempatLahir = data.tempatLahir || data.tempat_lahir;
          const tanggalLahir = data.tanggalLahir || data.tanggal_lahir;
          if (tempatLahir && tanggalLahir) {
            setBioTtl(`${tempatLahir}, ${tanggalLahir}`);
          }
          if (data.telepon) setBioTelp(data.telepon);
          const edu = data.pendidikanTerakhir || data.pendidikan_terakhir;
          if (edu) {
            if (edu.toLowerCase().includes('stie')) {
              setBioPendidikan('S1 / Sarjana');
            } else {
              setBioPendidikan(edu);
            }
          }
          if (data.jurusan) setBioJurusan(data.jurusan);
          
          const alamatList = data.alamatTempatTinggal || data.alamat_tempat_tinggal;
          if (alamatList && alamatList.length > 0) {
            const savedAlamat = localStorage.getItem('career_bio_alamat');
            const isValid = alamatList.some((a: any) => a.alamat === savedAlamat) || savedAlamat === 'none';
            if (!savedAlamat || !isValid) {
              setBioAlamat(alamatList[0].alamat);
            }
          }
        }
      })
      .catch(err => console.error("Failed to load profil data in EmailSender", err));
  }, []);

  useEffect(() => {
    ApiService.get<any[]>('email-sender').then(res => {
      if (res.success && res.data) {
        setDrafts(res.data.filter((item: any) => item.status === 'draft'));
      }
    });
  }, []);
  
  // Recipient inputs
  const [quickInput, setQuickInput] = useState('');
  const [targetEmail, setTargetEmail] = useState('');
  const [ccEmail, setCcEmail] = useState('');
  const [bccEmail, setBccEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [positionName, setPositionName] = useState('');
  const [isSubjectAuto, setIsSubjectAuto] = useState(() => { const saved = localStorage.getItem('career_is_subject_auto'); return saved !== null ? saved === 'true' : true; });
  const [isTemplateAuto, setIsTemplateAuto] = useState(() => { const saved = localStorage.getItem('career_is_template_auto'); return saved !== null ? saved === 'true' : true; });
  const [isBccDefault, setIsBccDefault] = useState(() => { const saved = localStorage.getItem('career_is_bcc_default'); return saved !== null ? saved === 'true' : false; });
  const [isPositionGeneral, setIsPositionGeneral] = useState(() => { const saved = localStorage.getItem('career_is_position_general'); return saved !== null ? saved === 'true' : false; });

  const isAutoSelectingRef = useRef(false);

  const handleSetBccDefault = (val: React.SetStateAction<boolean>) => {
    const nextVal = typeof val === 'function' ? val(isBccDefault) : val;
    setIsBccDefault(nextVal);
    if (nextVal) {
      setBccEmail('halo.alvareza@gmail.com');
    } else {
      if (bccEmail === 'halo.alvareza@gmail.com') {
        setBccEmail('');
      }
    }
  };

  useEffect(() => {
    if (bccEmail === 'halo.alvareza@gmail.com') {
      setIsBccDefault(true);
    } else if (isBccDefault && bccEmail !== 'halo.alvareza@gmail.com') {
      setIsBccDefault(false);
    }
  }, [bccEmail]);

  const handleSetPositionGeneral = (val: React.SetStateAction<boolean>) => {
    const nextVal = typeof val === 'function' ? val(isPositionGeneral) : val;
    setIsPositionGeneral(nextVal);
    if (nextVal) {
      setPositionName('Umum');
      const exists = templates.some(t => t.id === 'tpl-0');
      if (exists) {
        isAutoSelectingRef.current = true;
        setSelectedTplId('tpl-0');
        isAutoSelectingRef.current = false;
      }
    } else {
      if (positionName === 'Umum') {
        setPositionName('');
      }
    }
  };

  const customSetSelectedTplId = (val: React.SetStateAction<string>) => {
    if (!isAutoSelectingRef.current) {
      setIsTemplateAuto(false);
    }
    setSelectedTplId(val);
  };
  const [customSubject, setCustomSubject] = useState('');
  const [mergeAttachments, setMergeAttachments] = useState<'none' | 'all' | 'optimal'>(() => { 
    const saved = localStorage.getItem('career_merge_attachments'); 
    if (saved === 'true') return 'all';
    if (saved === 'false') return 'none';
    if (saved === 'all' || saved === 'optimal' || saved === 'none') return saved;
    return 'optimal';
  });
  const [locationName, setLocationName] = useState(() => { return localStorage.getItem('career_location_name') || 'Jakarta / Jabar'; });
  const [salaryExpectation, setSalaryExpectation] = useState(() => { return localStorage.getItem('career_salary_expectation') || ''; });
  const [recipientGender, setRecipientGender] = useState(() => { return localStorage.getItem('career_recipient_gender') || 'Bapak/Ibu'; });
  const [recipientRole, setRecipientRole] = useState(() => { return localStorage.getItem('career_recipient_role') || 'HRD'; });
  const [customRecipientRole, setCustomRecipientRole] = useState(() => { return localStorage.getItem('career_custom_recipient_role') || ''; });
  const [recipientName, setRecipientName] = useState('');
  const [recipientPlaceOption, setRecipientPlaceOption] = useState(() => { return localStorage.getItem('career_recipient_place_option') || 'di_tempat'; });
  const [recipientPlaceName, setRecipientPlaceName] = useState('');
  const [recipientRoleCompanyFormat, setRecipientRoleCompanyFormat] = useState(() => { return localStorage.getItem('career_recipient_role_company_format') || 'satu_baris'; });
  const [includePerihal, setIncludePerihal] = useState(() => {
    const saved = localStorage.getItem('career_include_perihal');
    return saved !== null ? saved === 'true' : true;
  });
  const [includeLampiranAwal, setIncludeLampiranAwal] = useState(() => {
    const saved = localStorage.getItem('career_include_lampiran_awal');
    return saved !== null ? saved === 'true' : true;
  });
  const [includeDaftarLampiran, setIncludeDaftarLampiran] = useState(() => {
    const saved = localStorage.getItem('career_include_daftar_lampiran');
    return saved !== null ? saved === 'true' : true;
  });

  // Styling States
  const [bodyFontFamily, setBodyFontFamily] = useState(() => {
    return localStorage.getItem('career_body_font') || 'Arial, sans-serif';
  });
  const [emailFormat, setEmailFormat] = useState<'modern' | 'formal' | 'plain'>(() => {
    return (localStorage.getItem('career_email_format') as any) || 'modern';
  });
  const [paragraphAlign, setParagraphAlign] = useState<'justify' | 'left'>(() => {
    return (localStorage.getItem('career_paragraph_align') as any) || 'justify';
  });

  // Bio Singkat States
  const [includeBio, setIncludeBio] = useState(() => {
    return localStorage.getItem('career_include_bio') === 'true';
  });
  const [bioNama, setBioNama] = useState(() => {
    return localStorage.getItem('career_bio_nama') || 'Alvareza Hilka Pratama';
  });
  const [bioTtl, setBioTtl] = useState(() => {
    return localStorage.getItem('career_bio_ttl') || 'Purwakarta, 15 Juli 2002';
  });
  const [bioAlamat, setBioAlamat] = useState(() => {
    return localStorage.getItem('career_bio_alamat') || 'Jl. Veteran No. 123, Purwakarta, Jawa Barat';
  });
  const [senderLocation, setSenderLocation] = useState(() => {
    return localStorage.getItem('career_sender_location') || 'Purwakarta';
  });
  const [bioTelp, setBioTelp] = useState(() => {
    return localStorage.getItem('career_bio_telp') || '085797184059';
  });
  const [bioPendidikan, setBioPendidikan] = useState(() => {
    const saved = localStorage.getItem('career_bio_pendidikan');
    if (!saved || saved.toLowerCase().includes('stie')) {
      return 'S1 / Sarjana';
    }
    return saved;
  });
  const [bioJurusan, setBioJurusan] = useState(() => {
    return localStorage.getItem('career_bio_jurusan') || 'Manajemen';
  });
  
  // Curriculum Vitae
  const [cvOption, setCvOption] = useState<'default' | 'upload' | 'none'>(() => { return (localStorage.getItem('career_cv_option') as 'default' | 'upload' | 'none') || 'default'; });
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvName, setCvName] = useState('CV_Alvareza_Hilka_Pratama.pdf');
  const cvInputRef = useRef<HTMLInputElement>(null);

  // Portofolio
  const [portofolioOption, setPortofolioOption] = useState<'default' | 'upload' | 'none'>(() => { return (localStorage.getItem('career_portofolio_option') as 'default' | 'upload' | 'none') || 'default'; });
  const [portofolioSubtype, setPortofolioSubtype] = useState<string>(() => {
    const saved = localStorage.getItem('career_portofolio_subtype') || 'app_hr,app_logistik,app_marketing,text';
    if (saved === 'all') {
      return 'app_hr,app_logistik,app_marketing,text';
    }
    return saved;
  });
  const [portofolioFile, setPortofolioFile] = useState<File | null>(null);
  const [portofolioName, setPortofolioName] = useState('Portofolio_Alvareza_Hilka_Pratama.pdf');
  const portofolioInputRef = useRef<HTMLInputElement>(null);

  // CV ATS
  const [cvAtsOption, setCvAtsOption] = useState<'default' | 'none'>(() => { return (localStorage.getItem('career_cv_ats_option') as 'default' | 'none') || 'none'; });
  const [cvAtsName, setCvAtsName] = useState('CV_ATS_Alvareza_Hilka_Pratama.pdf');

  // Paklaring
  const [paklaringOption, setPaklaringOption] = useState<'default' | 'upload' | 'none'>(() => { return (localStorage.getItem('career_paklaring_option') as 'default' | 'upload' | 'none') || 'default'; });
  const [paklaringFile, setPaklaringFile] = useState<File | null>(null);
  const [paklaringName, setPaklaringName] = useState('Paklaring_Alvareza_Hilka_Pratama.pdf');
  const paklaringInputRef = useRef<HTMLInputElement>(null);

  // Sertifikat Kompetensi Akademik
  const [sertifikatKompetensiAkademikOption, setSertifikatKompetensiAkademikOption] = useState<'default' | 'upload' | 'none'>(() => { return (localStorage.getItem('career_sert_kompetensi_akademis_option') as 'default' | 'upload' | 'none') || 'default'; });
  const [sertifikatKompetensiAkademikFile, setSertifikatKompetensiAkademikFile] = useState<File | null>(null);
  const [sertifikatKompetensiAkademikName, setSertifikatKompetensiAkademikName] = useState('Sertifikat_Kompetensi_Akademik.pdf');
  const sertifikatKompetensiAkademikInputRef = useRef<HTMLInputElement>(null);

  // Sertifikat Kompetensi Bisnis dan Digital
  const [sertifikatKompetensiBisnisDigitalOption, setSertifikatKompetensiBisnisDigitalOption] = useState<'default' | 'upload' | 'none'>(() => { return (localStorage.getItem('career_sert_kompetensi_bisnis_digital_option') as 'default' | 'upload' | 'none') || 'default'; });
  const [sertifikatKompetensiBisnisDigitalFile, setSertifikatKompetensiBisnisDigitalFile] = useState<File | null>(null);
  const [sertifikatKompetensiBisnisDigitalName, setSertifikatKompetensiBisnisDigitalName] = useState('Sertifikat_Kompetensi_Bisnis_dan_Digital.pdf');
  const sertifikatKompetensiBisnisDigitalInputRef = useRef<HTMLInputElement>(null);

  // Sertifikat Kompetensi Kepemimpinan
  const [sertifikatKompetensiKepemimpinanOption, setSertifikatKompetensiKepemimpinanOption] = useState<'default' | 'upload' | 'none'>(() => { return (localStorage.getItem('career_sert_kompetensi_kepemimpinan_option') as 'default' | 'upload' | 'none') || 'default'; });
  const [sertifikatKompetensiKepemimpinanFile, setSertifikatKompetensiKepemimpinanFile] = useState<File | null>(null);
  const [sertifikatKompetensiKepemimpinanName, setSertifikatKompetensiKepemimpinanName] = useState('Sertifikat_Kompetensi_Kepemimpinan.pdf');
  const sertifikatKompetensiKepemimpinanInputRef = useRef<HTMLInputElement>(null);

  // Sertifikat Kompetensi Public Speaking
  const [sertifikatKompetensiPublicSpeakingOption, setSertifikatKompetensiPublicSpeakingOption] = useState<'default' | 'upload' | 'none'>(() => { return (localStorage.getItem('career_sert_kompetensi_public_speaking_option') as 'default' | 'upload' | 'none') || 'default'; });
  const [sertifikatKompetensiPublicSpeakingFile, setSertifikatKompetensiPublicSpeakingFile] = useState<File | null>(null);
  const [sertifikatKompetensiPublicSpeakingName, setSertifikatKompetensiPublicSpeakingName] = useState('Sertifikat_Kompetensi_Public_Speaking.pdf');
  const sertifikatKompetensiPublicSpeakingInputRef = useRef<HTMLInputElement>(null);

  // Sertifikat Prestasi
  const [sertifikatPrestasiOption, setSertifikatPrestasiOption] = useState<'default' | 'upload' | 'none'>(() => { return (localStorage.getItem('career_sert_prestasi_option') as 'default' | 'upload' | 'none') || 'default'; });
  const [sertifikatPrestasiFile, setSertifikatPrestasiFile] = useState<File | null>(null);
  const [sertifikatPrestasiName, setSertifikatPrestasiName] = useState('Sertifikat_Prestasi.pdf');
  const sertifikatPrestasiInputRef = useRef<HTMLInputElement>(null);

  // Ijazah
  const [ijazahOption, setIjazahOption] = useState<'default' | 'upload' | 'none'>(() => { return (localStorage.getItem('career_ijazah_option') as 'default' | 'upload' | 'none') || 'none'; });
  const [ijazahFile, setIjazahFile] = useState<File | null>(null);
  const [ijazahName, setIjazahName] = useState('Ijazah_Alvareza_Hilka_Pratama.pdf');
  const ijazahInputRef = useRef<HTMLInputElement>(null);

  const getPortofolioLabel = () => {
    const active = portofolioSubtype ? portofolioSubtype.split(',').filter(Boolean) : [];
    if (active.length === 0) return 'Portofolio';
    const labels = active.map(sub => {
      switch (sub) {
        case 'app_hr': return 'App HRD';
        case 'app_logistik': return 'App Logistik & Ops';
        case 'app_marketing': return 'App Marketing';
        case 'text': return 'Detail Pengalaman Kerja';
        default: return sub;
      }
    });
    return `Portofolio (${labels.join(', ')})`;
  };

  const attachedFilesList: AttachedFile[] = [
    { label: 'CV ATS', option: cvAtsOption === 'default' ? 'default' : 'none', file: null, defaultName: cvAtsName },
    { label: 'CV', option: cvOption, file: cvFile, defaultName: cvName },
    { label: getPortofolioLabel(), option: portofolioOption, file: portofolioFile, defaultName: portofolioName },
    { label: 'Paklaring', option: paklaringOption, file: paklaringFile, defaultName: paklaringName },
    { label: 'Sertifikat Kompetensi Akademik', option: sertifikatKompetensiAkademikOption, file: sertifikatKompetensiAkademikFile, defaultName: sertifikatKompetensiAkademikName },
    { label: 'Sertifikat Kompetensi Bisnis dan Digital', option: sertifikatKompetensiBisnisDigitalOption, file: sertifikatKompetensiBisnisDigitalFile, defaultName: sertifikatKompetensiBisnisDigitalName },
    { label: 'Sertifikat Kompetensi Kepemimpinan', option: sertifikatKompetensiKepemimpinanOption, file: sertifikatKompetensiKepemimpinanFile, defaultName: sertifikatKompetensiKepemimpinanName },
    { label: 'Sertifikat Kompetensi Public Speaking', option: sertifikatKompetensiPublicSpeakingOption, file: sertifikatKompetensiPublicSpeakingFile, defaultName: sertifikatKompetensiPublicSpeakingName },
    { label: 'Sertifikat Prestasi', option: sertifikatPrestasiOption, file: sertifikatPrestasiFile, defaultName: sertifikatPrestasiName }
  ].filter(f => f.option !== 'none');

  let attachmentNamePreview = 'Tidak ada lampiran';
  if (attachedFilesList.length === 1) {
    attachmentNamePreview = attachedFilesList[0].label;
  } else if (attachedFilesList.length > 1) {
    attachmentNamePreview = '1 Bundle berkas';
  }

  // Dynamic preview state
  const [subjectPreview, setSubjectPreview] = useState('');
  const [bodyPreview, setBodyPreview] = useState('');

  // Prepared / Merged PDF States
  const [preparedPdfs, setPreparedPdfs] = useState<{ blob: Blob; filename: string }[] | null>(null);
  const [isPreparingPdf, setIsPreparingPdf] = useState(false);
  const [preparePdfProgress, setPreparePdfProgress] = useState(0);
  const [preparePdfStatusMsg, setPreparePdfStatusMsg] = useState('');

  // Reset prepared PDFs if any attachment choice or merge mode changes
  useEffect(() => {
    setPreparedPdfs(null);
  }, [
    cvOption, cvFile, cvAtsOption,
    portofolioOption, portofolioSubtype, portofolioFile,
    paklaringOption, paklaringFile,
    ijazahOption, ijazahFile,
    sertifikatKompetensiAkademikOption, sertifikatKompetensiAkademikFile,
    sertifikatKompetensiBisnisDigitalOption, sertifikatKompetensiBisnisDigitalFile,
    sertifikatKompetensiKepemimpinanOption, sertifikatKompetensiKepemimpinanFile,
    sertifikatKompetensiPublicSpeakingOption, sertifikatKompetensiPublicSpeakingFile,
    sertifikatPrestasiOption, sertifikatPrestasiFile,
    mergeAttachments
  ]);

  const preparedTotalBytes = preparedPdfs ? preparedPdfs.reduce((sum, item) => sum + item.blob.size, 0) : 0;
  const isPdfReady = attachedFilesList.length === 0 || preparedPdfs !== null;

  // Dispatch pipeline state
  const [isSending, setIsSending] = useState(false);
  const [isBulkSending, setIsBulkSending] = useState(false);
  const [sendProgress, setSendProgress] = useState<number>(0);
  const [sendStatusMsg, setSendStatusMsg] = useState<string>('');
  const [sendError, setSendError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [successMsg, setSuccessMsg] = useState(false);
  const [autoLogToTracker, setAutoLogToTracker] = useState(true);
  const [renderedHTML, setRenderedHTML] = useState('');

  // Load configs & templates with synchronization for default template changes
  useEffect(() => {
    const fetchTemplatesFromSQL = async () => {
      try {
        const res = await ApiService.get<CoverLetterTemplate[]>('cover-letter-templates');
        if (res.success && res.data && res.data.length > 0) {
          const dbTemplates = res.data;
          const merged = DEFAULT_TEMPLATES.map(tpl => {
            const dbTpl = dbTemplates.find(d => d.id === tpl.id);
            if (dbTpl) {
              if ((tpl.body !== dbTpl.body || tpl.name !== dbTpl.name) && tpl.id.startsWith('tpl-')) {
                ApiService.put('cover-letter-templates', tpl).catch(() => {});
                return tpl;
              }
              return dbTpl;
            } else {
              if (tpl.id.startsWith('tpl-')) {
                ApiService.post('cover-letter-templates', tpl).catch(() => {});
              }
              return tpl;
            }
          });
          
          const mergedIds = new Set(merged.map(m => m.id));
          const extraDbTemplates = dbTemplates.filter(d => !mergedIds.has(d.id) && !d.id.startsWith('tpl-'));
          const synchronized = [...merged, ...extraDbTemplates];

          setTemplates(synchronized);
          localStorage.setItem('career_templates', JSON.stringify(synchronized));
          
          if (synchronized.length > 0 && !selectedTplId) {
            setSelectedTplId(synchronized[0].id);
          }
        } else {
          setTemplates(DEFAULT_TEMPLATES);
          localStorage.setItem('career_templates', JSON.stringify(DEFAULT_TEMPLATES));
          if (DEFAULT_TEMPLATES.length > 0 && !selectedTplId) {
            setSelectedTplId(DEFAULT_TEMPLATES[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to load templates from SQL database:', err);
        const saved = localStorage.getItem('career_templates');
        if (saved) {
          let parsed = JSON.parse(saved) as CoverLetterTemplate[];
          if (!Array.isArray(parsed)) parsed = [];
          const customTemplates = parsed.filter(t => !t.id.startsWith('tpl-'));
          parsed = [...DEFAULT_TEMPLATES, ...customTemplates];
          setTemplates(parsed);
          if (parsed.length > 0 && !selectedTplId) {
            setSelectedTplId(parsed[0].id);
          }
        } else {
          setTemplates(DEFAULT_TEMPLATES);
          if (DEFAULT_TEMPLATES.length > 0 && !selectedTplId) {
            setSelectedTplId(DEFAULT_TEMPLATES[0].id);
          }
        }
      }
    };

    fetchTemplatesFromSQL();
  }, [activeTab]);

  // Save bio states to localStorage on change (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('career_include_bio', String(includeBio));
      localStorage.setItem('career_bio_nama', bioNama);
      localStorage.setItem('career_bio_ttl', bioTtl);
      localStorage.setItem('career_bio_alamat', bioAlamat);
      localStorage.setItem('career_sender_location', senderLocation);
      localStorage.setItem('career_bio_telp', bioTelp);
      localStorage.setItem('career_bio_pendidikan', bioPendidikan);
      localStorage.setItem('career_bio_jurusan', bioJurusan);
    }, 400);
    return () => clearTimeout(timer);
  }, [includeBio, bioNama, bioTtl, bioAlamat, senderLocation, bioTelp, bioPendidikan, bioJurusan]);

  // Save template settings (Perihal & Lampiran) to localStorage (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('career_include_perihal', String(includePerihal));
      localStorage.setItem('career_include_lampiran_awal', String(includeLampiranAwal));
      localStorage.setItem('career_include_daftar_lampiran', String(includeDaftarLampiran));
    }, 400);
    return () => clearTimeout(timer);
  }, [includePerihal, includeLampiranAwal, includeDaftarLampiran]);

  // Save styling states to localStorage (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('career_body_font', bodyFontFamily);
    }, 400);
    return () => clearTimeout(timer);
  }, [bodyFontFamily]);

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('career_email_format', emailFormat);
    }, 400);
    return () => clearTimeout(timer);
  }, [emailFormat]);

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('career_paragraph_align', paragraphAlign);
    }, 400);
    return () => clearTimeout(timer);
  }, [paragraphAlign]);

  // Save all generic settings to localStorage (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('career_is_subject_auto', String(isSubjectAuto));
      localStorage.setItem('career_is_template_auto', String(isTemplateAuto));
      localStorage.setItem('career_is_bcc_default', String(isBccDefault));
      localStorage.setItem('career_is_position_general', String(isPositionGeneral));
      localStorage.setItem('career_merge_attachments', String(mergeAttachments));
      localStorage.setItem('career_location_name', locationName);
      localStorage.setItem('career_salary_expectation', salaryExpectation);
      localStorage.setItem('career_recipient_gender', recipientGender);
      localStorage.setItem('career_recipient_role', recipientRole);
      localStorage.setItem('career_custom_recipient_role', customRecipientRole);
      localStorage.setItem('career_recipient_place_option', recipientPlaceOption);
      localStorage.setItem('career_recipient_role_company_format', recipientRoleCompanyFormat);
      localStorage.setItem('career_cv_option', cvOption);
      localStorage.setItem('career_cv_ats_option', cvAtsOption);
      localStorage.setItem('career_portofolio_option', portofolioOption);
      localStorage.setItem('career_portofolio_subtype', portofolioSubtype);
      localStorage.setItem('career_paklaring_option', paklaringOption);
      localStorage.setItem('career_sert_kompetensi_akademis_option', sertifikatKompetensiAkademikOption);
      localStorage.setItem('career_sert_kompetensi_bisnis_digital_option', sertifikatKompetensiBisnisDigitalOption);
      localStorage.setItem('career_sert_kompetensi_kepemimpinan_option', sertifikatKompetensiKepemimpinanOption);
      localStorage.setItem('career_sert_kompetensi_public_speaking_option', sertifikatKompetensiPublicSpeakingOption);
      localStorage.setItem('career_sert_prestasi_option', sertifikatPrestasiOption);
      localStorage.setItem('career_ijazah_option', ijazahOption);
    }, 400);
    return () => clearTimeout(timer);
  }, [
    isSubjectAuto, isTemplateAuto, mergeAttachments, locationName, salaryExpectation, recipientGender, recipientRole, 
    customRecipientRole, recipientPlaceOption, recipientRoleCompanyFormat,
    cvOption, cvAtsOption, portofolioOption, portofolioSubtype, paklaringOption, 
    sertifikatKompetensiAkademikOption,
    sertifikatKompetensiBisnisDigitalOption, sertifikatKompetensiKepemimpinanOption, sertifikatKompetensiPublicSpeakingOption, 
    sertifikatPrestasiOption, ijazahOption
  ]);

  // Auto-select template based on job position keywords (masih tanpa AI)
  useEffect(() => {
    if (isPositionGeneral) {
      const exists = templates.some(t => t.id === 'tpl-0');
      if (exists && selectedTplId !== 'tpl-0') {
        isAutoSelectingRef.current = true;
        setSelectedTplId('tpl-0');
        isAutoSelectingRef.current = false;
      }
      return;
    }

    if (!isTemplateAuto || !positionName || templates.length === 0) return;
    
    const posLower = positionName.toLowerCase().trim();
    
    // Keyword mappings to default template IDs
    const templateKeywords: { [key: string]: string[] } = {
      'tpl-0': ['umum', 'general', 'semua posisi', 'sembarang', 'kandidat umum', 'open position'],
      'tpl-1': ['social media', 'sosial media', 'branding', 'instagram', 'tiktok', 'reels', 'youtube', 'influencer', 'community', 'socmed', 'content creator'],
      'tpl-2': ['digital marketing', 'performance marketing', 'growth marketing', 'growth campaign', 'performance campaign', 'ads', 'meta ads', 'google ads', 'pemasaran digital'],
      'tpl-3': ['graphic designer', 'graphic design', 'desainer grafis', 'desain grafis', 'illustrator', 'creative design', 'visual branding', 'art director', 'ui/ux', 'ui designer', 'ux designer', 'desain'],
      'tpl-4': ['web developer', 'programmer', 'koding', 'software engineer', 'fullstack', 'frontend', 'backend', 'it support', 'system specialist', 'systems specialist', 'aplikasi', 'application developer'],
      'tpl-5': ['content writer', 'copywriter', 'penulis', 'writer', 'storytelling', 'seo writer', 'artikel', 'editor naskah'],
      'tpl-6': ['video editor', 'videographer', 'motion graphics', 'editor video', 'video production', 'youtube editor'],
      'tpl-7': ['sales', 'business development', 'bizdev', 'bd executive', 'account executive', 'ae', 'kemitraan', 'penjualan', 'partnership manager'],
      'tpl-8': ['customer service', 'cs officer', 'client relations', 'frontliner', 'receptionist', 'layanan pelanggan', 'customer support'],
      'tpl-9': ['management trainee', 'mt program', 'future leader', 'fresh graduate', 'graduate leader'],
      'tpl-10': ['project manager', 'scrum master', 'scrum specialist', 'agile coach', 'product manager', 'pm ', 'product owner'],
      'tpl-11': ['operasional', 'operations', 'manajemen operasional', 'general affair', 'ga officer', 'office manager', 'operations manager'],
      'tpl-12': ['public relations', 'pr officer', 'humas', 'hubungan eksternal', 'media relations'],
      'tpl-13': ['administrasi', 'admin', 'office support', 'kearsipan', 'sekretaris', 'secretary', 'document control'],
      'tpl-14': ['human resources', 'hr support', 'hrd', 'talent acquisition', 'personalia', 'rekrutmen', 'recruiter', 'hr specialist'],
      'tpl-15': ['brand strategist', 'marcom', 'marketing communication', 'brand manager', 'activation'],
      'tpl-16': ['seo specialist', 'search engine', 'content strategist', 'traffic specialist', 'seo executive'],
      'tpl-17': ['data analyst', 'data analysis', 'analytics specialist', 'business intelligence', 'bi analyst', 'data scientist'],
      'tpl-18': ['virtual assistant', 'va ', 'remote support', 'executive assistant', 'personal assistant'],
      'tpl-19': ['finance', 'keuangan', 'akuntansi', 'accounting', 'treasury', 'auditor', 'kasir', 'cashier'],
      'tpl-20': ['gudang', 'warehouse', 'logistik', 'logistic', 'inventory', 'stock opname', 'staf gudang', 'staff gudang'],
      'tpl-21': ['operator produksi', 'pabrik', 'factory operator', 'produksi', 'production staff', 'operator mesin'],
      'tpl-22': ['it support', 'staff it', 'teknisi it', 'jaringan', 'network administrator', 'technical support', 'helpdesk'],
      'tpl-23': ['admin gudang', 'inventory controller', 'logistik gudang', 'staf logistik', 'gudang admin'],
      'tpl-24': ['koordinator wilayah', 'field supervisor', 'spv lapangan', 'operasional lapangan', 'area coordinator'],
      'tpl-25': ['ui/ux', 'ux design', 'ui design', 'figma', 'ux researcher', 'desain produk'],
      'tpl-26': ['accounting staff', 'tax executive', 'staf akuntansi', 'perpajakan', 'pajak'],
      'tpl-27': ['supervisor produksi', 'operational generalist', 'koordinator operasional', 'spv produksi', 'shift supervisor'],
      'tpl-28': ['hr recruiter', 'employee relations', 'rekruter', 'hubungan karyawan', 'staf rekrutmen'],
      'tpl-29': ['business analyst', 'sistem informasi bisnis', 'analis bisnis', 'analyst bisnis', 'sistem bisnis'],
      'tpl-30': ['customer success', 'escalation', 'client relations', 'success specialist']
    };

    let bestTplId = '';
    let highestScore = 0;

    // Check each template's keywords
    Object.entries(templateKeywords).forEach(([tplId, keywords]) => {
      keywords.forEach(keyword => {
        if (posLower.includes(keyword)) {
          // Score is based on keyword length to prefer longer/more specific matches
          const score = keyword.length;
          if (score > highestScore) {
            highestScore = score;
            bestTplId = tplId;
          }
        }
      });
    });

    if (bestTplId && bestTplId !== selectedTplId) {
      // Check if the template exists in currently loaded templates
      const exists = templates.some(t => t.id === bestTplId);
      if (exists) {
        isAutoSelectingRef.current = true;
        setSelectedTplId(bestTplId);
        isAutoSelectingRef.current = false;
      }
    }
  }, [positionName, templates, isTemplateAuto, selectedTplId]);

  // Update dynamic preview on input changes (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      const res = buildEmailContent({
        selectedTplId,
        templates,
        companyName,
        positionName,
        isPositionGeneral,
        recipientGender,
        recipientRole,
        customRecipientRole,
        recipientName,
        recipientPlaceOption,
        recipientPlaceName,
        recipientRoleCompanyFormat,
        includePerihal,
        includeLampiranAwal,
        includeDaftarLampiran,
        attachmentNamePreview,
        includeBio,
        bioNama,
        bioTtl,
        bioAlamat,
        bioTelp,
        bioPendidikan,
        bioJurusan,
        attachedFilesList,
        isSubjectAuto,
        customSubject,
        profileData
      });

      setSubjectPreview(res.subject);
      setBodyPreview(res.body);
    }, 120);

    return () => clearTimeout(timer);
  }, [
    selectedTplId,
    templates,
    companyName,
    positionName,
    isPositionGeneral,
    recipientGender,
    recipientRole,
    customRecipientRole,
    recipientName,
    recipientPlaceOption,
    recipientPlaceName,
    recipientRoleCompanyFormat,
    includePerihal,
    includeLampiranAwal,
    includeDaftarLampiran,
    attachmentNamePreview,
    includeBio,
    bioNama,
    bioTtl,
    bioAlamat,
    bioTelp,
    bioPendidikan,
    bioJurusan,
    attachedFilesList,
    isSubjectAuto,
    customSubject,
    profileData
  ]);

  // Sync customSubject with generated subject if isSubjectAuto is true
  useEffect(() => {
    if (isSubjectAuto && subjectPreview) {
      setCustomSubject(subjectPreview);
    }
  }, [isSubjectAuto, subjectPreview]);

  // Fetch rendered HTML for preview (debounced)
  useEffect(() => {
    if (!bodyPreview) return;
    const timer = setTimeout(async () => {
      try {
        const response = await fetch('/api/preview-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            body: bodyPreview, 
            bodyFontFamily, 
            emailFormat, 
            paragraphAlign,
            location: includeBio ? getCityFromAlamat(bioAlamat) : senderLocation
          })
        });
        const data = await response.json();
        if (response.ok && data.html) {
          setRenderedHTML(data.html);
        } else {
          setRenderedHTML('');
        }
      } catch (err) {
        console.error(err);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [bodyPreview, bodyFontFamily, emailFormat, paragraphAlign, includeBio, bioAlamat, senderLocation]);

  const handleCVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCvFile(file);
      setCvOption('upload');
    }
  };

  const handlePortofolioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPortofolioFile(file);
      setPortofolioOption('upload');
    }
  };

  const handlePaklaringChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPaklaringFile(file);
      setPaklaringOption('upload');
    }
  };

  const handleSertifikatKompetensiAkademikChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSertifikatKompetensiAkademikFile(file);
      setSertifikatKompetensiAkademikOption('upload');
    }
  };

  const handleSertifikatKompetensiBisnisDigitalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSertifikatKompetensiBisnisDigitalFile(file);
      setSertifikatKompetensiBisnisDigitalOption('upload');
    }
  };

  const handleSertifikatKompetensiKepemimpinanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSertifikatKompetensiKepemimpinanFile(file);
      setSertifikatKompetensiKepemimpinanOption('upload');
    }
  };

  const handleSertifikatKompetensiPublicSpeakingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSertifikatKompetensiPublicSpeakingFile(file);
      setSertifikatKompetensiPublicSpeakingOption('upload');
    }
  };

  const handleSertifikatPrestasiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSertifikatPrestasiFile(file);
      setSertifikatPrestasiOption('upload');
    }
  };

  const handleIjazahChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIjazahFile(file);
      setIjazahOption('upload');
    }
  };

  const resetForm = () => {
    setEditingDraftId(null);
    setEditingDraftStatus(null);
    setTargetEmail('');
    setCcEmail('');
    
    // bcc default on
    setIsBccDefault(true);
    setBccEmail('halo.alvareza@gmail.com');
    
    setCompanyName('');
    setCustomSubject('');
    setRecipientName('');
    setRecipientPlaceName('');

    // pekerjaan umum off
    setIsPositionGeneral(false);
    setPositionName('');
    
    // subject otomatis on
    setIsSubjectAuto(true);
    
    // template teks itu auto on
    setIsTemplateAuto(true);
    setSelectedTplId('tpl-0');
    
    // deteksi danisi otomatis clear/delete teks
    setQuickInput('');
    
    // Lampiran berkas menjadi tidak ada yang dipilih
    setCvOption('none');
    setCvAtsOption('none');
    setPortofolioOption('none');
    setPortofolioSubtype('');
    setPaklaringOption('none');
    setIjazahOption('none');
    setSertifikatKompetensiAkademikOption('none');
    setSertifikatKompetensiBisnisDigitalOption('none');
    setSertifikatKompetensiKepemimpinanOption('none');
    setSertifikatKompetensiPublicSpeakingOption('none');
    setSertifikatPrestasiOption('none');
    
    // Reset draft-specific locations to default localStorage or fallback
    const originalAlamat = localStorage.getItem('career_bio_alamat') || 'Jl. Veteran No. 123, Purwakarta, Jawa Barat';
    setBioAlamat(originalAlamat);
    const originalSenderLocation = localStorage.getItem('career_sender_location') || 'Purwakarta';
    setSenderLocation(originalSenderLocation);
  };

  const handleEditDraft = (draft: any) => {
    setEditingDraftId(draft.id);
    setEditingDraftStatus(draft.status || 'draft');
    setTargetEmail(draft.targetEmail || '');
    setCcEmail(draft.ccEmail || '');
    setBccEmail(draft.bccEmail || '');
    setCompanyName(draft.companyName || '');
    setPositionName(draft.positionName || '');
    if (draft.subject) setSubjectPreview(draft.subject);
    if (draft.body) setBodyPreview(draft.body);
    
    if (draft.isSubjectAuto !== undefined) {
      setIsSubjectAuto(draft.isSubjectAuto);
    } else {
      setIsSubjectAuto(false);
    }
    if (draft.customSubject != null) {
      setCustomSubject(draft.customSubject);
    } else if (draft.subject) {
      setCustomSubject(draft.subject);
    } else {
      setCustomSubject('');
    }
    
    if (draft.mergeAttachments !== undefined) {
      setMergeAttachments(draft.mergeAttachments);
    }
    
    if (draft.includePerihal !== undefined) setIncludePerihal(draft.includePerihal);
    if (draft.includeLampiranAwal !== undefined) setIncludeLampiranAwal(draft.includeLampiranAwal);
    if (draft.includeDaftarLampiran !== undefined) setIncludeDaftarLampiran(draft.includeDaftarLampiran);
    if (draft.includeBio !== undefined) setIncludeBio(draft.includeBio);
    
    if (draft.cvOption) setCvOption(draft.cvOption);
    if (draft.cvAtsOption) {
      setCvAtsOption(draft.cvAtsOption);
    } else {
      setCvAtsOption('none');
    }
    if (draft.portofolioOption) {
      setPortofolioOption(draft.portofolioOption);
      if (draft.portofolioSubtype) setPortofolioSubtype(draft.portofolioSubtype);
    } else {
      setPortofolioOption('none');
    }
    if (draft.paklaringOption) setPaklaringOption(draft.paklaringOption);
    if (draft.sertifikatKompetensiAkademikOption) setSertifikatKompetensiAkademikOption(draft.sertifikatKompetensiAkademikOption);
    if (draft.sertifikatKompetensiBisnisDigitalOption) setSertifikatKompetensiBisnisDigitalOption(draft.sertifikatKompetensiBisnisDigitalOption);
    if (draft.sertifikatKompetensiKepemimpinanOption) setSertifikatKompetensiKepemimpinanOption(draft.sertifikatKompetensiKepemimpinanOption);
    if (draft.sertifikatKompetensiPublicSpeakingOption) setSertifikatKompetensiPublicSpeakingOption(draft.sertifikatKompetensiPublicSpeakingOption);
    if (draft.sertifikatPrestasiOption) setSertifikatPrestasiOption(draft.sertifikatPrestasiOption);
    if (draft.ijazahOption) setIjazahOption(draft.ijazahOption);
    if (draft.bodyFontFamily) setBodyFontFamily(draft.bodyFontFamily);
    if (draft.emailFormat) setEmailFormat(draft.emailFormat);
    if (draft.paragraphAlign) setParagraphAlign(draft.paragraphAlign);

    // Load locations from the draft
    if (draft.bioAlamat) {
      setBioAlamat(draft.bioAlamat);
    }
    if (draft.senderLocation) {
      setSenderLocation(draft.senderLocation);
    }

    setActiveTab('editor');
  };

  return {
    templates,
    setTemplates,
    selectedTplId,
    setSelectedTplId: customSetSelectedTplId,
    drafts,
    setDrafts,
    editingDraftId,
    setEditingDraftId,
    editingDraftStatus,
    setEditingDraftStatus,
    activeTab,
    setActiveTab,
    isPreviewModalOpen,
    setIsPreviewModalOpen,
    desktopActionTarget,
    setDesktopActionTarget,
    profileData,
    setProfileData,
    previewSections,
    setPreviewSections,
    previewPdf,
    setPreviewPdf,
    togglePreviewSection,
    openPdfPreview,
    closePdfPreview,
    
    targetEmail,
    setTargetEmail,
    ccEmail,
    setCcEmail,
    bccEmail,
    setBccEmail,
    companyName,
    setCompanyName,
    positionName,
    setPositionName,
    isSubjectAuto,
    setIsSubjectAuto,
    isTemplateAuto,
    setIsTemplateAuto,
    isBccDefault,
    setIsBccDefault: handleSetBccDefault,
    isPositionGeneral,
    setIsPositionGeneral: handleSetPositionGeneral,
    customSubject,
    setCustomSubject,
    mergeAttachments,
    setMergeAttachments,
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
    
    bodyFontFamily,
    setBodyFontFamily,
    emailFormat,
    setEmailFormat,
    paragraphAlign,
    setParagraphAlign,
    
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
    setCvFile,
    cvName,
    setCvName,
    cvInputRef,
    
    portofolioOption,
    setPortofolioOption,
    portofolioSubtype,
    setPortofolioSubtype,
    portofolioFile,
    setPortofolioFile,
    portofolioName,
    setPortofolioName,
    portofolioInputRef,
    
    cvAtsOption,
    setCvAtsOption,
    cvAtsName,
    setCvAtsName,
    
    paklaringOption,
    setPaklaringOption,
    paklaringFile,
    setPaklaringFile,
    paklaringName,
    setPaklaringName,
    paklaringInputRef,
    
    sertifikatKompetensiAkademikOption,
    setSertifikatKompetensiAkademikOption,
    sertifikatKompetensiAkademikFile,
    setSertifikatKompetensiAkademikFile,
    sertifikatKompetensiAkademikName,
    setSertifikatKompetensiAkademikName,
    sertifikatKompetensiAkademikInputRef,
    
    sertifikatKompetensiBisnisDigitalOption,
    setSertifikatKompetensiBisnisDigitalOption,
    sertifikatKompetensiBisnisDigitalFile,
    setSertifikatKompetensiBisnisDigitalFile,
    sertifikatKompetensiBisnisDigitalName,
    setSertifikatKompetensiBisnisDigitalName,
    sertifikatKompetensiBisnisDigitalInputRef,
    
    sertifikatKompetensiKepemimpinanOption,
    setSertifikatKompetensiKepemimpinanOption,
    sertifikatKompetensiKepemimpinanFile,
    setSertifikatKompetensiKepemimpinanFile,
    sertifikatKompetensiKepemimpinanName,
    setSertifikatKompetensiKepemimpinanName,
    sertifikatKompetensiKepemimpinanInputRef,
    
    sertifikatKompetensiPublicSpeakingOption,
    setSertifikatKompetensiPublicSpeakingOption,
    sertifikatKompetensiPublicSpeakingFile,
    setSertifikatKompetensiPublicSpeakingFile,
    sertifikatKompetensiPublicSpeakingName,
    setSertifikatKompetensiPublicSpeakingName,
    sertifikatKompetensiPublicSpeakingInputRef,
    
    sertifikatPrestasiOption,
    setSertifikatPrestasiOption,
    sertifikatPrestasiFile,
    setSertifikatPrestasiFile,
    sertifikatPrestasiName,
    setSertifikatPrestasiName,
    sertifikatPrestasiInputRef,
    
    ijazahOption,
    setIjazahOption,
    ijazahFile,
    setIjazahFile,
    ijazahName,
    setIjazahName,
    ijazahInputRef,
    
    attachedFilesList,
    attachmentNamePreview,
    subjectPreview,
    bodyPreview,
    
    isSending,
    setIsSending,
    isBulkSending,
    setIsBulkSending,
    sendProgress,
    setSendProgress,
    sendStatusMsg,
    setSendStatusMsg,
    sendError,
    setSendError,
    logs,
    setLogs,
    successMsg,
    setSuccessMsg,
    autoLogToTracker,
    setAutoLogToTracker,
    renderedHTML,
    setRenderedHTML,

    preparedPdfs,
    setPreparedPdfs,
    isPreparingPdf,
    setIsPreparingPdf,
    preparePdfProgress,
    setPreparePdfProgress,
    preparePdfStatusMsg,
    setPreparePdfStatusMsg,
    preparedTotalBytes,
    isPdfReady,
    
    handleCVChange,
    handlePortofolioChange,
    handlePaklaringChange,
    handleSertifikatKompetensiAkademikChange,
    handleSertifikatKompetensiBisnisDigitalChange,
    handleSertifikatKompetensiKepemimpinanChange,
    handleSertifikatKompetensiPublicSpeakingChange,
    handleSertifikatPrestasiChange,
    handleIjazahChange,
    resetForm,
    handleEditDraft,
    quickInput,
    setQuickInput
  };
}
