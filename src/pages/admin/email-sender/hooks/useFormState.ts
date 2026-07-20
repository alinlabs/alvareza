import React, { useState, useEffect, useRef } from 'react';
import { ApiService } from '../../../../services/api';
import { generateAtsCvDoc } from '../../../../utils/atsCvGenerator';
import { CoverLetterTemplate, DEFAULT_TEMPLATES } from '../Templates';
import { ProfileData } from '../../../../types';
import { EmailDraft, AttachedFile } from '../type';
import { buildEmailContent, getCityFromAlamat } from '../utils/parser';

export function useFormState() {
  const [templates, setTemplates] = useState<CoverLetterTemplate[]>([]);
  const [selectedTplId, setSelectedTplId] = useState('');
  
  // Drafts & Previews
  const [drafts, setDrafts] = useState<EmailDraft[]>([]);
  const [editingDraftId, setEditingDraftId] = useState<string | null>(null);
  const [editingDraftStatus, setEditingDraftStatus] = useState<'draft' | 'terkirim' | null>(null);
  const [activeTab, setActiveTab] = useState<'editor' | 'status' | 'templates' | 'email-templates'>('editor');
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [desktopActionTarget, setDesktopActionTarget] = useState<HTMLElement | null>(null);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  // Preview Layout States
  const [previewSections, setPreviewSections] = useState({ tertuju: true, isi: true, lampiran: true });
  const [previewPdf, setPreviewPdf] = useState<{ url: string, name: string } | null>(null);

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
      setPreviewPdf({ url: urlMap[fileData.label] || '', name: fileData.defaultName });
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
  const [targetEmail, setTargetEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [positionName, setPositionName] = useState('');
  const [isSubjectAuto, setIsSubjectAuto] = useState(() => { const saved = localStorage.getItem('career_is_subject_auto'); return saved !== null ? saved === 'true' : true; });
  const [customSubject, setCustomSubject] = useState('');
  const [mergeAttachments, setMergeAttachments] = useState<'none' | 'all' | 'optimal'>(() => { 
    const saved = localStorage.getItem('career_merge_attachments'); 
    if (saved === 'true') return 'all';
    if (saved === 'false') return 'none';
    if (saved === 'all' || saved === 'optimal' || saved === 'none') return saved;
    return 'none';
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
  const [ijazahOption, setIjazahOption] = useState<'default' | 'upload' | 'none'>(() => { return (localStorage.getItem('career_ijazah_option') as 'default' | 'upload' | 'none') || 'default'; });
  const [ijazahFile, setIjazahFile] = useState<File | null>(null);
  const [ijazahName, setIjazahName] = useState('Ijazah_Alvareza_Hilka_Pratama.pdf');
  const ijazahInputRef = useRef<HTMLInputElement>(null);

  const attachedFilesList: AttachedFile[] = [
    { label: 'CV ATS', option: cvAtsOption === 'default' ? 'default' : 'none', file: null, defaultName: cvAtsName },
    { label: 'CV', option: cvOption, file: cvFile, defaultName: cvName },
    { label: 'Portofolio', option: portofolioOption, file: portofolioFile, defaultName: portofolioName },
    { label: 'Paklaring', option: paklaringOption, file: paklaringFile, defaultName: paklaringName },
    { label: 'Sertifikat Kompetensi Akademik', option: sertifikatKompetensiAkademikOption, file: sertifikatKompetensiAkademikFile, defaultName: sertifikatKompetensiAkademikName },
    { label: 'Sertifikat Kompetensi Bisnis dan Digital', option: sertifikatKompetensiBisnisDigitalOption, file: sertifikatKompetensiBisnisDigitalFile, defaultName: sertifikatKompetensiBisnisDigitalName },
    { label: 'Sertifikat Kompetensi Kepemimpinan', option: sertifikatKompetensiKepemimpinanOption, file: sertifikatKompetensiKepemimpinanFile, defaultName: sertifikatKompetensiKepemimpinanName },
    { label: 'Sertifikat Kompetensi Public Speaking', option: sertifikatKompetensiPublicSpeakingOption, file: sertifikatKompetensiPublicSpeakingFile, defaultName: sertifikatKompetensiPublicSpeakingName },
    { label: 'Sertifikat Prestasi', option: sertifikatPrestasiOption, file: sertifikatPrestasiFile, defaultName: sertifikatPrestasiName },
    { label: 'Ijazah', option: ijazahOption, file: ijazahFile, defaultName: ijazahName }
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

  // Dispatch pipeline state
  const [isSending, setIsSending] = useState(false);
  const [isBulkSending, setIsBulkSending] = useState(false);
  const [sendProgress, setSendProgress] = useState<number>(0);
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
            return dbTpl ? dbTpl : tpl;
          });
          
          const mergedIds = new Set(merged.map(m => m.id));
          const extraDbTemplates = dbTemplates.filter(d => !mergedIds.has(d.id));
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

  // Save bio states to localStorage on change
  useEffect(() => {
    localStorage.setItem('career_include_bio', String(includeBio));
    localStorage.setItem('career_bio_nama', bioNama);
    localStorage.setItem('career_bio_ttl', bioTtl);
    localStorage.setItem('career_bio_alamat', bioAlamat);
    localStorage.setItem('career_sender_location', senderLocation);
    localStorage.setItem('career_bio_telp', bioTelp);
    localStorage.setItem('career_bio_pendidikan', bioPendidikan);
    localStorage.setItem('career_bio_jurusan', bioJurusan);
  }, [includeBio, bioNama, bioTtl, bioAlamat, senderLocation, bioTelp, bioPendidikan, bioJurusan]);

  // Save template settings (Perihal & Lampiran) to localStorage
  useEffect(() => {
    localStorage.setItem('career_include_perihal', String(includePerihal));
    localStorage.setItem('career_include_lampiran_awal', String(includeLampiranAwal));
    localStorage.setItem('career_include_daftar_lampiran', String(includeDaftarLampiran));
  }, [includePerihal, includeLampiranAwal, includeDaftarLampiran]);

  // Save styling states to localStorage
  useEffect(() => {
    localStorage.setItem('career_body_font', bodyFontFamily);
  }, [bodyFontFamily]);

  useEffect(() => {
    localStorage.setItem('career_email_format', emailFormat);
  }, [emailFormat]);

  useEffect(() => {
    localStorage.setItem('career_paragraph_align', paragraphAlign);
  }, [paragraphAlign]);

  // Save all generic settings to localStorage
  useEffect(() => {
    localStorage.setItem('career_is_subject_auto', String(isSubjectAuto));
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
    localStorage.setItem('career_paklaring_option', paklaringOption);
    localStorage.setItem('career_sert_kompetensi_akademis_option', sertifikatKompetensiAkademikOption);
    localStorage.setItem('career_sert_kompetensi_bisnis_digital_option', sertifikatKompetensiBisnisDigitalOption);
    localStorage.setItem('career_sert_kompetensi_kepemimpinan_option', sertifikatKompetensiKepemimpinanOption);
    localStorage.setItem('career_sert_kompetensi_public_speaking_option', sertifikatKompetensiPublicSpeakingOption);
    localStorage.setItem('career_sert_prestasi_option', sertifikatPrestasiOption);
    localStorage.setItem('career_ijazah_option', ijazahOption);
  }, [
    isSubjectAuto, mergeAttachments, locationName, salaryExpectation, recipientGender, recipientRole, 
    customRecipientRole, recipientPlaceOption, recipientRoleCompanyFormat,
    cvOption, cvAtsOption, portofolioOption, paklaringOption, 
    sertifikatKompetensiAkademikOption,
    sertifikatKompetensiBisnisDigitalOption, sertifikatKompetensiKepemimpinanOption, sertifikatKompetensiPublicSpeakingOption, 
    sertifikatPrestasiOption, ijazahOption
  ]);

  // Update dynamic preview on input changes
  useEffect(() => {
    const res = buildEmailContent({
      selectedTplId,
      templates,
      companyName,
      positionName,
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
  }, [
    selectedTplId,
    templates,
    companyName,
    positionName,
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

  // Fetch rendered HTML for preview
  useEffect(() => {
    const fetchHTML = async () => {
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
    };
    if (bodyPreview) {
      fetchHTML();
    }
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
    setCompanyName('');
    setPositionName('');
    setCustomSubject('');
    setRecipientName('');
    setRecipientPlaceName('');
    
    // Default CV kreatif on, CV ATS off when starting a new email
    setCvOption('default');
    setCvAtsOption('none');
    
    // Also reset other options back to defaults
    setPortofolioOption('default');
    setPaklaringOption('default');
    setIjazahOption('default');
    setSertifikatKompetensiAkademikOption('default');
    setSertifikatKompetensiBisnisDigitalOption('default');
    setSertifikatKompetensiKepemimpinanOption('default');
    setSertifikatKompetensiPublicSpeakingOption('default');
    setSertifikatPrestasiOption('default');
    
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
    setCompanyName(draft.companyName || '');
    setPositionName(draft.positionName || '');
    if (draft.subject) setSubjectPreview(draft.subject);
    if (draft.body) setBodyPreview(draft.body);
    
    if (draft.isSubjectAuto !== undefined) {
      setIsSubjectAuto(draft.isSubjectAuto);
    } else {
      setIsSubjectAuto(false);
    }
    if (draft.customSubject !== undefined) {
      setCustomSubject(draft.customSubject);
    } else if (draft.subject) {
      setCustomSubject(draft.subject);
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
    setSelectedTplId,
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
    companyName,
    setCompanyName,
    positionName,
    setPositionName,
    isSubjectAuto,
    setIsSubjectAuto,
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
    handleEditDraft
  };
}
