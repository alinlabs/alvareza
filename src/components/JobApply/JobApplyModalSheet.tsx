import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  RotateCw,
  AlertCircle,
  XCircle,
  FileText,
  History,
  Settings,
  ArrowLeft,
} from 'lucide-react';
import { matchPresetFromJobTitle } from '../../data/rolePresetsConfig';
import { GasHistoryModal } from './GasHistoryModal';
import { JobDraftsModal } from './JobDraftsModal';
import { JobDraftService } from '../../services/jobDraftService';
import { JobApplicationDraftItem } from '../../types/jobDraft';
import { EmailLanguage, JobScanResult } from '../../types/jobApplication';
import {
  createMailtoUrl,
  generateTailoredApplicationDraft,
} from '../../utils/jobApplicationDraft';
import { validateAndSanitizeOcrResult } from '../../utils/ocrValidatorAndMapper';
import { GasSenderService } from '../../services/gasSenderService';
import {
  generateCvPdfAttachment,
  generatePortfolioPdfAttachment,
  generateCertificatesPdfAttachment,
  getAdaptivePortfolioSlides,
  getActiveCertificateList,
  ALL_PORTFOLIO_SLIDES,
  ALL_CERTIFICATES_LIST,
  formatEmailBodyToHtml,
} from '../../utils/gasAttachmentGenerator';
import {
  getAcademicAttachments,
  downloadAcademicDocs,
  ALL_ACADEMIC_DOCS,
} from '../../data/academicDocs';
import { GasSettingsModal } from './GasSettingsModal';
import { GasAccountConfig, GasSendMode } from '../../types/gasSender';
import { useLanguage } from '../../context/LanguageContext';
import { SendingLottieAnimation } from './SendingLottieAnimation';
import { formatFileSize, downloadBase64Pdf } from '../../utils/gasAttachmentPreview';

// Modular Subcomponents
import { CustomAttachmentItem, CvDesignType, CvTextAlignType } from './modal/types';
import { SmartInputSection } from './modal/SmartInputSection';
import { JobFormFields } from './modal/JobFormFields';
import { AttachmentsSection } from './modal/AttachmentsSection';
import { JobApplyFooter } from './modal/JobApplyFooter';
import { JobApplyScanningView } from './modal/JobApplyScanningView';
import { JobApplyStatusAlerts } from './modal/JobApplyStatusAlerts';

interface JobApplyModalSheetProps {
  isOpen: boolean;
  onClose: () => void;
  selectedFile: File | null;
  scanResult: JobScanResult | null;
  isScanning: boolean;
  scanStage?: 'idle' | 'ocr' | 'analyzing';
  ocrProgress?: number;
  onRescanFile: (file: File) => void;
  onClearFile?: () => void;
  error?: string | null;
}

export const JobApplyModalSheet: React.FC<JobApplyModalSheetProps> = ({
  isOpen,
  onClose,
  selectedFile,
  scanResult,
  isScanning,
  scanStage = 'idle',
  ocrProgress = 0,
  onRescanFile,
  onClearFile,
  error,
}) => {
  const [quickInputText, setQuickInputText] = useState<string>('');
  const [ocrResultText, setOcrResultText] = useState<string>('');
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState<string>('');
  const [jobTitle, setJobTitle] = useState<string>('');
  const [recipientEmail, setRecipientEmail] = useState<string>('');
  const [ccEmail, setCcEmail] = useState<string>('');
  const [showCcField, setShowCcField] = useState<boolean>(false);
  const [recipientPhone, setRecipientPhone] = useState<string>('');
  const [emailSubject, setEmailSubject] = useState<string>('');
  const [isSubjectAuto, setIsSubjectAuto] = useState<boolean>(true);
  const [emailBody, setEmailBody] = useState<string>('');
  const [isEmailBodyExpanded, setIsEmailBodyExpanded] = useState<boolean>(false);
  const { language: globalLanguage, setLanguage: setGlobalLanguage } = useLanguage();
  const [language, setLanguage] = useState<EmailLanguage>(globalLanguage || 'id');
  const [cvDesignPreset, setCvDesignPreset] = useState<CvDesignType>('block');
  const [cvHeaderColor, setCvHeaderColor] = useState<string>('#0062E3');
  const [cvTextAlign, setCvTextAlign] = useState<CvTextAlignType>('left');
  const [isCvOptionsOpen, setIsCvOptionsOpen] = useState<boolean>(false);
  const [activeDraftId, setActiveDraftId] = useState<string | null>(null);
  const [highlightDraftId, setHighlightDraftId] = useState<string | null>(null);
  const [keyRequirements, setKeyRequirements] = useState<string[]>([]);
  const [isDropOver, setIsDropOver] = useState(false);
  const [isImageExpanded, setIsImageExpanded] = useState<boolean>(false);

  // Check if current form content matches an existing draft or active draft
  const activeEditingDraft = useMemo(() => {
    if (!activeDraftId) return null;
    const drafts = JobDraftService.getDrafts();
    return drafts.find((d) => d.id === activeDraftId) || null;
  }, [activeDraftId]);

  // Custom User Attachments (Drop / Pick Files to send alongside email)
  const [customAttachments, setCustomAttachments] = useState<CustomAttachmentItem[]>([]);
  const [isAttachmentDropOver, setIsAttachmentDropOver] = useState<boolean>(false);
  const [targetCertIdForPick, setTargetCertIdForPick] = useState<string | null>(null);
  const attachmentInputRef = useRef<HTMLInputElement | null>(null);

  const processUploadedFiles = async (files: FileList | File[], forCertId?: string | null) => {
    const certIdToUse = forCertId !== undefined ? forCertId : targetCertIdForPick;
    const newItems: CustomAttachmentItem[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > 15 * 1024 * 1024) {
        alert(`File "${file.name}" melebihi batas 15MB. Silakan pilih file yang lebih kecil.`);
        continue;
      }
      try {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const res = reader.result as string;
            const clean = res.replace(/^data:[^;]+;base64,/, '');
            resolve(clean);
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        newItems.push({
          id: certIdToUse
            ? `att_cert_${certIdToUse}`
            : 'att_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
          certId: certIdToUse || undefined,
          name: file.name,
          size: file.size,
          mimeType: file.type || 'application/octet-stream',
          base64,
        });
      } catch (err) {
        console.error('Failed to read attachment file:', err);
      }
    }

    if (newItems.length > 0) {
      setCustomAttachments((prev) => {
        if (certIdToUse) {
          const filtered = prev.filter((item) => item.certId !== certIdToUse);
          return [...filtered, ...newItems];
        }
        return [...prev, ...newItems];
      });
    }
  };

  const handleRemoveCustomAttachment = (id: string) => {
    setCustomAttachments((prev) => prev.filter((item) => item.id !== id));
  };

  // Sync modal language if global language changes
  useEffect(() => {
    if (globalLanguage && globalLanguage !== language) {
      setLanguage(globalLanguage);
    }
  }, [globalLanguage]);

  // Copy feedback states
  const [copiedSubject, setCopiedSubject] = useState(false);
  const [copiedBody, setCopiedBody] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedCc, setCopiedCc] = useState(false);

  // GAS Email Sender states
  const [isGasSettingsOpen, setIsGasSettingsOpen] = useState(false);
  const [isGasHistoryOpen, setIsGasHistoryOpen] = useState(false);
  const [isDraftsModalOpen, setIsDraftsModalOpen] = useState(false);
  const [draftCount, setDraftCount] = useState<number>(() => JobDraftService.getDraftCount());
  const [draftSaveFeedback, setDraftSaveFeedback] = useState(false);
  const [selectedAcademicIds, setSelectedAcademicIds] = useState<string[]>([]);
  const [showAcademicBreakdown, setShowAcademicBreakdown] = useState<boolean>(false);
  const [isPreviewingAcademic, setIsPreviewingAcademic] = useState<boolean>(false);
  const [isPreviewingPortfolio, setIsPreviewingPortfolio] = useState(false);
  const [isPreviewingCerts, setIsPreviewingCerts] = useState(false);
  const [showPortfolioBreakdown, setShowPortfolioBreakdown] = useState(false);
  const [showCertsBreakdown, setShowCertsBreakdown] = useState(false);
  const [selectedCvPreset, setSelectedCvPreset] = useState<string>('optimal');

  // Rekomendasi otomatis sesuai preset role aktif
  const recommendedPortfolioSlideIds = useMemo(() => {
    return getAdaptivePortfolioSlides(selectedCvPreset, {
      jobTitle,
    }).map((s) => s.id);
  }, [selectedCvPreset, jobTitle]);

  const recommendedCertIds = useMemo(() => {
    return getActiveCertificateList(selectedCvPreset).map((c) => c.id);
  }, [selectedCvPreset]);

  // State: Slide portofolio yang dipilih pengguna (default otomatis tercentang sesuai role aktif)
  const [selectedPortfolioSlideIds, setSelectedPortfolioSlideIds] = useState<string[]>(() => {
    return getAdaptivePortfolioSlides(selectedCvPreset || 'optimal', {
      jobTitle,
    }).map((s) => s.id);
  });

  // State: Sertifikat fisik yang dipilih pengguna (default otomatis tercentang sesuai role aktif)
  const [selectedCertIds, setSelectedCertIds] = useState<string[]>(() => {
    return getActiveCertificateList(selectedCvPreset || 'optimal').map((c) => c.id);
  });

  // Otomatis centang rekomendasi setiap kali preset berganti, namun user tetap bebas custom
  useEffect(() => {
    const recommendedSlides = getAdaptivePortfolioSlides(selectedCvPreset, {
      jobTitle,
    }).map((s) => s.id);
    setSelectedPortfolioSlideIds(recommendedSlides);

    const recommendedCerts = getActiveCertificateList(selectedCvPreset).map((c) => c.id);
    setSelectedCertIds(recommendedCerts);
  }, [selectedCvPreset, jobTitle]);

  const handleToggleAcademicDoc = (docId: 'skl' | 'transkrip') => {
    setSelectedAcademicIds((prev) =>
      prev.includes(docId) ? prev.filter((id) => id !== docId) : [...prev, docId]
    );
  };

  const handleTogglePortfolioSlide = (slideId: string) => {
    setSelectedPortfolioSlideIds((prev) =>
      prev.includes(slideId) ? prev.filter((id) => id !== slideId) : [...prev, slideId]
    );
  };

  const handleToggleCert = (certId: string) => {
    setSelectedCertIds((prev) =>
      prev.includes(certId) ? prev.filter((id) => id !== certId) : [...prev, certId]
    );
  };

  const [isPresetAuto, setIsPresetAuto] = useState<boolean>(() => {
    const saved = localStorage.getItem('isPresetAuto');
    return saved !== null ? saved === 'true' : true;
  });

  useEffect(() => {
    localStorage.setItem('isPresetAuto', String(isPresetAuto));
  }, [isPresetAuto]);

  const [activeSenderInfo, setActiveSenderInfo] = useState<{
    account: GasAccountConfig;
    index: number;
    mode: GasSendMode;
    totalConfigured: number;
  } | null>(null);

  const [gasSendState, setGasSendState] = useState<'idle' | 'generating' | 'sending' | 'success' | 'error'>('idle');
  const [gasSendMsg, setGasSendMsg] = useState<string>('');
  const [sendProgress, setSendProgress] = useState<number>(0);
  const [sendingSenderEmail, setSendingSenderEmail] = useState<string>('');
  const [lastSentAccount, setLastSentAccount] = useState<string>('');
  const [emailOption, setEmailOption] = useState<string>('rotate');
  const [gasAccounts, setGasAccounts] = useState<GasAccountConfig[]>([]);

  // Hidden file input ref
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const refreshSenderInfo = () => {
    const next = GasSenderService.getNextSenderAccount();
    setActiveSenderInfo(next);
    const accs = GasSenderService.getAccounts();
    setGasAccounts(accs);
    const mode = GasSenderService.getSendMode();
    if (mode === 'manual') {
      const manualId = GasSenderService.getManualAccountId();
      setEmailOption(manualId);
    } else {
      setEmailOption('rotate');
    }
  };

  const handleEmailOptionChange = (value: string) => {
    setEmailOption(value);
    if (value === 'rotate') {
      GasSenderService.setSendMode('rotate');
      const next = GasSenderService.getNextSenderAccount();
      setActiveSenderInfo(next);
    } else if (value !== 'mailto') {
      GasSenderService.setSendMode('manual');
      GasSenderService.setManualAccountId(value);
      const next = GasSenderService.getNextSenderAccount();
      setActiveSenderInfo(next);
    }
  };

  useEffect(() => {
    if (isOpen) {
      refreshSenderInfo();
      setGasSendState('idle');
      setGasSendMsg('');
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      setTimeout(() => {
        if (!document.querySelector('[id$="-backdrop"]')) {
          document.body.style.overflow = '';
          document.documentElement.style.overflow = '';
        }
      }, 0);
    };
  }, [isOpen, isGasSettingsOpen, isGasHistoryOpen]);

  // Create image preview URL when file changes
  useEffect(() => {
    if (!selectedFile) {
      setImagePreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(selectedFile);
    setImagePreviewUrl(url);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [selectedFile]);

  // Populate form input fields and OCR text when scanResult changes
  useEffect(() => {
    if (scanResult) {
      const validated = validateAndSanitizeOcrResult(
        scanResult,
        scanResult.rawExtractedText || '',
        selectedFile?.name
      );

      setLanguage(validated.language);
      setCompanyName(validated.companyName || '');
      setJobTitle(validated.jobTitle || '');
      setRecipientEmail(validated.recipientEmail || '');
      if (validated.ccEmail !== undefined) setCcEmail(validated.ccEmail);
      if (validated.showCcField !== undefined) setShowCcField(validated.showCcField);
      setRecipientPhone(validated.recipientPhone || '');
      if (validated.keyRequirements && validated.keyRequirements.length > 0) {
        setKeyRequirements(validated.keyRequirements);
      }
      if (validated.hasExplicitSubject && validated.emailSubject) {
        setEmailSubject(validated.emailSubject);
      } else if (isSubjectAuto) {
        if (validated.emailSubject) {
          setEmailSubject(validated.emailSubject);
        } else if (validated.jobTitle) {
          setEmailSubject(`${validated.jobTitle.trim()} - Alvareza`);
        }
      } else {
        setEmailSubject('');
      }
      if (validated.emailBody) {
        setEmailBody(validated.emailBody);
      }
      if (scanResult.rawExtractedText) {
        setOcrResultText(scanResult.rawExtractedText.trim());
      }
    } else if (!emailBody) {
      const draft = generateTailoredApplicationDraft({
        companyName: companyName || '',
        jobTitle: jobTitle || '',
        recipientEmail: recipientEmail || '',
        keyRequirements: [],
        tone: 'concise',
        language: 'id',
      });
      setEmailBody(draft.emailBody);
    }
  }, [scanResult, selectedFile]);

  // Handler for quick pasted / typed job ad text (Smart Teks)
  const handleQuickTextChange = (text: string) => {
    setQuickInputText(text);
    if (!text.trim()) {
      setCompanyName('');
      setJobTitle('');
      setRecipientEmail('');
      setCcEmail('');
      setShowCcField(false);
      setRecipientPhone('');
      if (!isSubjectAuto) {
        setEmailSubject('');
      }
      return;
    }

    const validated = validateAndSanitizeOcrResult(
      null,
      text,
      undefined
    );

    setCompanyName(validated.companyName);
    setJobTitle(validated.jobTitle);
    setRecipientEmail(validated.recipientEmail);
    if (validated.ccEmail !== undefined) setCcEmail(validated.ccEmail);
    if (validated.showCcField !== undefined) setShowCcField(validated.showCcField);
    setRecipientPhone(validated.recipientPhone);
    if (validated.keyRequirements && validated.keyRequirements.length > 0) {
      setKeyRequirements(validated.keyRequirements);
    }
    setLanguage(validated.language);

    if (validated.hasExplicitSubject && validated.emailSubject) {
      setEmailSubject(validated.emailSubject);
    } else if (isSubjectAuto) {
      const cleanTitle = (validated.jobTitle || '').trim();
      setEmailSubject(cleanTitle ? `${cleanTitle} - Alvareza` : (validated.emailSubject || ''));
    } else {
      setEmailSubject('');
    }

    if (validated.emailBody) setEmailBody(validated.emailBody);
  };

  // Handler for editing OCR extracted text
  const handleOcrTextChange = (text: string) => {
    setOcrResultText(text);
    if (!text.trim()) return;

    const validated = validateAndSanitizeOcrResult(
      null,
      text,
      selectedFile?.name
    );

    if (validated.companyName) setCompanyName(validated.companyName);
    if (validated.jobTitle) setJobTitle(validated.jobTitle);
    if (validated.recipientEmail) setRecipientEmail(validated.recipientEmail);
    if (validated.ccEmail !== undefined) setCcEmail(validated.ccEmail);
    if (validated.showCcField !== undefined) setShowCcField(validated.showCcField);
    if (validated.recipientPhone) setRecipientPhone(validated.recipientPhone);
    if (validated.keyRequirements && validated.keyRequirements.length > 0) {
      setKeyRequirements(validated.keyRequirements);
    }
    setLanguage(validated.language);

    if (validated.hasExplicitSubject && validated.emailSubject) {
      setEmailSubject(validated.emailSubject);
    } else if (isSubjectAuto) {
      const cleanTitle = (validated.jobTitle || '').trim();
      setEmailSubject(cleanTitle ? `${cleanTitle} - Alvareza` : (validated.emailSubject || ''));
    } else {
      setEmailSubject('');
    }
  };

  // Auto-sync ATS CV Preset and email highlights whenever jobTitle changes
  useEffect(() => {
    if (isPresetAuto && jobTitle && jobTitle.trim()) {
      const matched = matchPresetFromJobTitle(jobTitle);
      if (matched && matched.key) {
        setSelectedCvPreset(matched.key);
      }
    }
  }, [jobTitle, isPresetAuto]);

  // Sync subject ONLY when isSubjectAuto is enabled or jobTitle changes (NOT dependent on language)
  useEffect(() => {
    if (isSubjectAuto) {
      const cleanTitle = jobTitle.trim();
      setEmailSubject(cleanTitle ? `${cleanTitle} - Alvareza` : '');
    }
  }, [isSubjectAuto, jobTitle]);

  // Synchronization of email body when preset or language changes or if body is empty
  useEffect(() => {
    if (!emailBody) {
      const draft = generateTailoredApplicationDraft({
        companyName: companyName.trim() || (language === 'en' ? 'Company' : 'Perusahaan'),
        jobTitle: jobTitle.trim() || (language === 'en' ? 'Position' : 'Posisi Terkait'),
        recipientEmail: recipientEmail.trim() || 'recruitment@perusahaan.com',
        keyRequirements,
        tone: 'concise',
        language,
        presetKey: selectedCvPreset,
      });
      setEmailBody(draft.emailBody);
    }
  }, [selectedCvPreset, language]);

  const handleCopy = async (text: string, type: 'subject' | 'body' | 'all' | 'email' | 'cc' | 'phone') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'subject') {
        setCopiedSubject(true);
        setTimeout(() => setCopiedSubject(false), 2000);
      } else if (type === 'body') {
        setCopiedBody(true);
        setTimeout(() => setCopiedBody(false), 2000);
      } else if (type === 'email') {
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 2000);
      } else if (type === 'cc') {
        setCopiedCc(true);
        setTimeout(() => setCopiedCc(false), 2000);
      } else if (type === 'all') {
        setCopiedAll(true);
        setTimeout(() => setCopiedAll(false), 2000);
      }
    } catch {
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      if (type === 'all') {
        setCopiedAll(true);
        setTimeout(() => setCopiedAll(false), 2000);
      }
    }
  };

  const validateMandatoryFields = (): { valid: boolean; message?: string } => {
    const cleanCompany = companyName.trim();
    const cleanJob = jobTitle.trim();
    const cleanEmail = recipientEmail.trim();

    const missingFields: string[] = [];
    if (!cleanCompany) missingFields.push('Nama Perusahaan');
    if (!cleanJob) missingFields.push('Posisi Pekerjaan');
    if (!cleanEmail) missingFields.push('Email Tujuan');

    if (missingFields.length > 0) {
      return {
        valid: false,
        message: `Mohon lengkapi kolom ${missingFields.join(', ')} terlebih dahulu.`,
      };
    }

    if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      return {
        valid: false,
        message: 'Format Email Tujuan tidak valid (contoh: hrd@perusahaan.com).',
      };
    }

    return { valid: true };
  };

  const handleOpenMailClient = () => {
    const validation = validateMandatoryFields();
    if (!validation.valid) {
      alert(validation.message);
      return;
    }

    if (activeDraftId) {
      JobDraftService.deleteDraft(activeDraftId);
      setActiveDraftId(null);
      setDraftCount(JobDraftService.getDraftCount());
    }

    const mailto = createMailtoUrl(
      recipientEmail,
      emailSubject,
      emailBody,
      ccEmail.trim() ? ccEmail.trim() : undefined
    );
    window.location.href = mailto;
  };

  const handlePreviewAcademicPdf = async () => {
    if (selectedAcademicIds.length === 0) {
      alert('Mohon pilih minimal 1 dokumen akademik untuk diunduh.');
      return;
    }
    try {
      setIsPreviewingAcademic(true);
      await downloadAcademicDocs(selectedAcademicIds);
    } catch (e: any) {
      alert('Gagal mengunduh Dokumen Akademik: ' + (e?.message || 'Error tidak diketahui'));
    } finally {
      setIsPreviewingAcademic(false);
    }
  };

  const handlePreviewPortfolioPdf = async () => {
    if (selectedPortfolioSlideIds.length === 0) {
      alert('Mohon pilih minimal 1 slide portofolio untuk di-preview.');
      return;
    }
    try {
      setIsPreviewingPortfolio(true);
      const att = await generatePortfolioPdfAttachment({
        preset: selectedCvPreset,
        selectedSlideIds: selectedPortfolioSlideIds,
        jobTitle,
      });
      downloadBase64Pdf(att.base64, att.filename);
    } catch (e: any) {
      alert('Gagal membuat preview Portofolio PDF: ' + (e?.message || 'Error tidak diketahui'));
    } finally {
      setIsPreviewingPortfolio(false);
    }
  };

  const handlePreviewCertsPdf = async () => {
    if (selectedCertIds.length === 0) {
      alert('Mohon pilih minimal 1 sertifikat untuk di-preview.');
      return;
    }
    try {
      setIsPreviewingCerts(true);
      const att = await generateCertificatesPdfAttachment({
        preset: selectedCvPreset,
        selectedCertIds: selectedCertIds,
        jobTitle,
      });
      downloadBase64Pdf(att.base64, att.filename);
    } catch (e: any) {
      alert('Gagal membuat preview Sertifikasi PDF: ' + (e?.message || 'Error tidak diketahui'));
    } finally {
      setIsPreviewingCerts(false);
    }
  };

  const handleSendViaGas = async () => {
    const validation = validateMandatoryFields();
    if (!validation.valid) {
      alert(validation.message);
      return;
    }

    const currentSender = GasSenderService.getNextSenderAccount();
    if (!currentSender || currentSender.totalConfigured === 0 || !currentSender.account.webAppUrl) {
      setIsGasSettingsOpen(true);
      return;
    }

    setSendingSenderEmail(currentSender.account.email);
    setSendProgress(18);
    setGasSendState('generating');
    setGasSendMsg('Mempersiapkan dokumen lampiran resmi...');

    const progressInterval = setInterval(() => {
      setSendProgress((prev) => {
        if (prev >= 92) return 92;
        return prev + Math.floor(Math.random() * 4) + 2;
      });
    }, 120);

    try {
      const attachments = [];

      // 1. Dokumen CV ATS PDF (Otomatis disertakan sesuai preset yang dipilih)
      setGasSendMsg('Men-generate CV ATS PDF resmi...');
      const cvAttachment = generateCvPdfAttachment({
        preset: selectedCvPreset,
        language,
        jobTitle,
        companyName,
        headerColor: cvHeaderColor,
        designPreset: cvDesignPreset,
        textAlign: cvTextAlign,
      });
      attachments.push(cvAttachment);
      setSendProgress((prev) => Math.max(prev, 35));

      // 2. Dokumen Akademik Resmi PDF (Jika ada pilihan Surat Keterangan Lulus / Transkrip Nilai yang dicentang)
      if (selectedAcademicIds.length > 0) {
        setGasSendMsg(
          selectedAcademicIds.length === 2
            ? 'Menggabungkan SKL & Transkrip Nilai (skl_transkrip_alvareza.pdf)...'
            : 'Mempersiapkan Dokumen Akademik Resmi...'
        );
        const academicAttachments = await getAcademicAttachments(selectedAcademicIds);
        for (const academicAttachment of academicAttachments) {
          attachments.push(academicAttachment);
        }
      }
      setSendProgress((prev) => Math.max(prev, 48));

      // 3. Dokumen Portofolio Adaptif PDF (Jika ada slide yang dipilih)
      if (selectedPortfolioSlideIds.length > 0) {
        setGasSendMsg('Menyusun Portofolio PDF Terpilih...');
        const portfolioAttachment = await generatePortfolioPdfAttachment({
          preset: selectedCvPreset,
          selectedSlideIds: selectedPortfolioSlideIds,
          jobTitle,
          onProgress: (cur, tot) => {
            setGasSendMsg(`Menyusun Portofolio PDF (${cur}/${tot} slide)...`);
          },
        });
        attachments.push(portfolioAttachment);
      }
      setSendProgress((prev) => Math.max(prev, 62));

      // 4. Dokumen Kompilasi Sertifikasi Fisik Resmi PDF (Jika ada sertifikat yang dipilih)
      if (selectedCertIds.length > 0) {
        setGasSendMsg('Mengompilasi Sertifikasi PDF Terpilih...');
        const certsAttachment = await generateCertificatesPdfAttachment({
          preset: selectedCvPreset,
          selectedCertIds: selectedCertIds,
          jobTitle,
          onProgress: (cur, tot) => {
            setGasSendMsg(`Mengompilasi Sertifikat PDF (${cur}/${tot} dokumen)...`);
          },
        });
        attachments.push(certsAttachment);
      }
      setSendProgress((prev) => Math.max(prev, 75));

      // 5. Sertakan lampiran kustom yang di-drop/upload manual oleh pengguna
      for (const customAtt of customAttachments) {
        attachments.push({
          filename: customAtt.name,
          mimeType: customAtt.mimeType,
          base64: customAtt.base64,
          sizeBytes: customAtt.size,
        });
      }

      const plainBody = emailBody.trim();
      const htmlFormatted = formatEmailBodyToHtml(plainBody);

      setGasSendState('sending');
      setGasSendMsg(`Mengirimkan email via ${currentSender.account.email}...`);
      setSendProgress((prev) => Math.max(prev, 68));

      const finalSubject = emailSubject.trim() || (jobTitle.trim() ? `${jobTitle.trim()} - Alvareza` : 'Lamaran Pekerjaan - Alvareza');

      const result = await GasSenderService.sendEmail(
        {
          targetEmail: recipientEmail.trim(),
          companyName: companyName.trim(),
          jobTitle: jobTitle.trim(),
          cc: ccEmail.trim() ? ccEmail.trim() : undefined,
          subject: finalSubject,
          body: plainBody,
          bodyText: plainBody,
          bodyHtml: htmlFormatted,
          senderName: 'Lamaran Kerja Alvareza',
          attachments,
        },
        currentSender.account,
        { autoAdvanceRotation: true }
      );

      clearInterval(progressInterval);

      if (result.success) {
        setSendProgress(100);
        if (activeDraftId) {
          JobDraftService.deleteDraft(activeDraftId);
          setActiveDraftId(null);
          setDraftCount(JobDraftService.getDraftCount());
        }
        setTimeout(() => {
          setGasSendState('success');
          setLastSentAccount(currentSender.account.email);
          setGasSendMsg(
            result.message ||
              `Email lamaran beserta CV ATS berhasil terkirim ke ${recipientEmail} menggunakan ${currentSender.account.email}!`
          );
          refreshSenderInfo();

          // Reset semua field formulir input (kecuali lampiran kustom yang tetap dipertahankan)
          setQuickInputText('');
          setCompanyName('');
          setJobTitle('');
          setRecipientEmail('');
          setCcEmail('');
          setShowCcField(false);
          setRecipientPhone('');
          setOcrResultText('');
          setImagePreviewUrl(null);
          setKeyRequirements([]);
          setEmailSubject('');
          setSelectedAcademicIds([]);
          if (onClearFile) {
            onClearFile();
          }
        }, 600);
      } else {
        setSendProgress(0);
        setGasSendState('error');
        setGasSendMsg(result.error || 'Gagal mengirim email via Google Apps Script.');
      }
    } catch (err: any) {
      clearInterval(progressInterval);
      setSendProgress(0);
      setGasSendState('error');
      setGasSendMsg(err?.message || 'Terjadi kesalahan saat memproses pengiriman.');
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onRescanFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDropOver(false);
    if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files) as File[];
      const file = files.find((f) => f.type.startsWith('image/')) || files[0];
      if (file) {
        onRescanFile(file);
      }
    }
  };

  const handleRemoveFile = () => {
    setImagePreviewUrl(null);
    setOcrResultText('');
    setIsImageExpanded(false);
    if (onClearFile) {
      onClearFile();
    }
  };

  const handleSelectHistoryItemForEdit = (item: any) => {
    if (item.companyName) setCompanyName(item.companyName);
    if (item.jobTitle) setJobTitle(item.jobTitle);
    if (item.targetEmail) setRecipientEmail(item.targetEmail);
    if (item.subject) {
      setEmailSubject(item.subject);
      setIsSubjectAuto(false);
    }
    setIsGasHistoryOpen(false);
  };

  const handleSaveToDraft = () => {
    const validation = validateMandatoryFields();
    if (!validation.valid) {
      alert(validation.message);
      return;
    }

    const isEditingMode = Boolean(activeDraftId);

    const effectiveSubject =
      emailSubject.trim() ||
      (jobTitle.trim()
        ? `Lamaran Pekerjaan: ${jobTitle.trim()} - Alvareza Hilka Pratama`
        : 'Lamaran Pekerjaan - Alvareza Hilka Pratama');

    const saved = JobDraftService.saveDraft({
      id: activeDraftId || undefined,
      companyName: companyName.trim(),
      jobTitle: jobTitle.trim(),
      recipientEmail: recipientEmail.trim(),
      ccEmail: ccEmail.trim(),
      subject: effectiveSubject,
      emailBody: emailBody,
      language: language,
      presetKey: selectedCvPreset || 'optimal',
      emailOption: emailOption,
      cvDesignPreset: cvDesignPreset,
      cvHeaderColor: cvHeaderColor,
      cvTextAlign: cvTextAlign,
      selectedAcademicIds: selectedAcademicIds,
      selectedPortfolioSlideIds: selectedPortfolioSlideIds,
      selectedCertIds: selectedCertIds,
      customAttachmentNames: customAttachments.map((att) => att.name),
    });

    setDraftCount(JobDraftService.getDraftCount());

    if (isEditingMode && saved && saved.id) {
      setHighlightDraftId(saved.id);
      setActiveDraftId(null);
      setIsDraftsModalOpen(true);
    } else {
      setDraftSaveFeedback(true);
      setTimeout(() => {
        setDraftSaveFeedback(false);
      }, 2000);

      // Reset semua field input formulir ke kondisi kosong agar user siap mengisi lamaran baru
      setQuickInputText('');
      setCompanyName('');
      setJobTitle('');
      setRecipientEmail('');
      setCcEmail('');
      setShowCcField(false);
      setRecipientPhone('');
      setOcrResultText('');
      setImagePreviewUrl(null);
      setIsImageExpanded(false);
      setKeyRequirements([]);
      setEmailSubject('');
      setIsSubjectAuto(true);
      setActiveDraftId(null);
      setSelectedCvPreset('optimal');
      setIsPresetAuto(true);
      setSelectedAcademicIds([]);
      setCustomAttachments([]);
      if (onClearFile) {
        onClearFile();
      }

      // Generate draf email default baru yang bersih
      const freshDraft = generateTailoredApplicationDraft({
        companyName: '',
        jobTitle: '',
        recipientEmail: 'recruitment@perusahaan.com',
        keyRequirements: [],
        tone: 'concise',
        language: language || 'id',
        presetKey: 'optimal',
      });
      setEmailBody(freshDraft.emailBody);
    }
  };

  const handleLoadDraftForEdit = (draft: JobApplicationDraftItem) => {
    setActiveDraftId(draft.id);
    setCompanyName(draft.companyName || '');
    setJobTitle(draft.jobTitle || '');
    setRecipientEmail(draft.recipientEmail || '');
    setCcEmail(draft.ccEmail || '');
    setShowCcField(Boolean(draft.ccEmail));
    if (draft.subject) {
      setEmailSubject(draft.subject);
      setIsSubjectAuto(false);
    } else if (draft.jobTitle) {
      setEmailSubject(`${draft.jobTitle} - Alvareza`);
      setIsSubjectAuto(true);
    } else {
      setEmailSubject('');
      setIsSubjectAuto(true);
    }
    if (draft.emailBody) setEmailBody(draft.emailBody);
    if (draft.language) setLanguage(draft.language);
    if (draft.presetKey) {
      setSelectedCvPreset(draft.presetKey);
      setIsPresetAuto(false);
    }
    if (draft.emailOption) {
      setEmailOption(draft.emailOption);
    }
    if (draft.cvDesignPreset) {
      setCvDesignPreset(draft.cvDesignPreset);
    }
    if (draft.cvHeaderColor) {
      setCvHeaderColor(draft.cvHeaderColor);
    }
    if (draft.cvTextAlign) {
      setCvTextAlign(draft.cvTextAlign);
    }
    if (draft.selectedAcademicIds) {
      setSelectedAcademicIds(draft.selectedAcademicIds);
    } else {
      setSelectedAcademicIds([]);
    }
    if (draft.selectedPortfolioSlideIds) {
      setSelectedPortfolioSlideIds(draft.selectedPortfolioSlideIds);
    }
    if (draft.selectedCertIds) {
      setSelectedCertIds(draft.selectedCertIds);
    }
    setIsDraftsModalOpen(false);
    setDraftCount(JobDraftService.getDraftCount());
    setGasSendState('idle');
    setGasSendMsg('');
  };

  let activeModalView: 'settings' | 'history' | 'drafts' | 'apply' | null = null;
  if (isOpen) {
    if (isGasSettingsOpen) activeModalView = 'settings';
    else if (isGasHistoryOpen) activeModalView = 'history';
    else if (isDraftsModalOpen) activeModalView = 'drafts';
    else activeModalView = 'apply';
  }

  return (
    <AnimatePresence mode="wait">
      {activeModalView === 'settings' && (
        <GasSettingsModal
          key="modal-view-settings"
          isOpen={true}
          onClose={() => {
            setIsGasSettingsOpen(false);
            refreshSenderInfo();
          }}
          onAccountsUpdated={refreshSenderInfo}
        />
      )}

      {activeModalView === 'history' && (
        <GasHistoryModal
          key="modal-view-history"
          isOpen={true}
          onClose={() => setIsGasHistoryOpen(false)}
          onSelectForEdit={handleSelectHistoryItemForEdit}
        />
      )}

      {activeModalView === 'drafts' && (
        <JobDraftsModal
          key="modal-view-drafts"
          isOpen={true}
          onClose={() => {
            setIsDraftsModalOpen(false);
            setDraftCount(JobDraftService.getDraftCount());
            setActiveDraftId(null);
            // Reset form input ke kondisi bersih default
            setQuickInputText('');
            setCompanyName('');
            setJobTitle('');
            setRecipientEmail('');
            setCcEmail('');
            setShowCcField(false);
            setRecipientPhone('');
            setOcrResultText('');
            setImagePreviewUrl(null);
            setIsImageExpanded(false);
            setKeyRequirements([]);
            setEmailSubject('');
            setIsSubjectAuto(true);
            setSelectedCvPreset('optimal');
            setIsPresetAuto(true);
            setCustomAttachments([]);
            const freshDraft = generateTailoredApplicationDraft({
              companyName: '',
              jobTitle: '',
              recipientEmail: 'recruitment@perusahaan.com',
              keyRequirements: [],
              tone: 'concise',
              language: language || 'id',
              presetKey: 'optimal',
            });
            setEmailBody(freshDraft.emailBody);
          }}
          onSelectForEdit={handleLoadDraftForEdit}
          highlightDraftId={highlightDraftId}
        />
      )}

      {activeModalView === 'apply' && (
        <motion.div
          key="modal-view-apply-backdrop"
          id="job-apply-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 bg-slate-950/10 backdrop-blur-md flex flex-col justify-end md:justify-center md:items-center p-0 md:p-4 pt-[60px] md:pt-0 overflow-hidden"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              if (activeEditingDraft) {
                setActiveDraftId(null);
                setIsDraftsModalOpen(true);
              } else {
                onClose();
              }
            }
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            aria-label="Pilih flyer lowongan kerja"
            className="hidden"
            onChange={handleFileChange}
          />

          {/* Main Container: Mobile Bottom Sheet (rounded-t-3xl) vs Desktop Centered Modal (rounded-2xl) */}
          <motion.div
            key="modal-view-apply-container"
            id="job-apply-modal-container"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
            className="relative w-full md:max-w-2xl bg-white text-slate-800 rounded-t-3xl md:rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[calc(100vh-60px)] md:max-h-[88vh] overflow-hidden"
          >
            {/* Header Bar */}
            <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between shrink-0 bg-slate-50/80">
              <div className="flex items-center gap-2.5 min-w-0">
                {activeEditingDraft && (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveDraftId(null);
                      setIsDraftsModalOpen(true);
                    }}
                    className="p-1 -ml-1 text-slate-500 hover:text-blue-600 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer shrink-0"
                    title="Kembali ke Daftar Draf"
                    aria-label="Kembali ke Daftar Draf"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                )}
                <div className="min-w-0">
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight truncate">
                    {isScanning
                      ? 'Scan Gambar'
                      : gasSendState === 'generating' || gasSendState === 'sending'
                      ? 'Mengirimkan Lamaran'
                      : activeEditingDraft
                      ? 'Edit Draft'
                      : 'Lamar Kerja'}
                  </h2>
                  <p className="text-xs text-slate-500 truncate">
                    {isScanning
                      ? 'Mengekstrak informasi lowongan...'
                      : gasSendState === 'generating' || gasSendState === 'sending'
                      ? 'Sedang memproses pengiriman...'
                      : activeEditingDraft
                      ? 'Perbarui data draf lamaran'
                      : 'Otomatisasi Mail'}
                  </p>
                </div>
              </div>

              {!isScanning && (gasSendState !== 'generating' && gasSendState !== 'sending') && (
                <div className="flex items-center gap-1.5 shrink-0">
                  {/* Card Bendera Bahasa: Hanya gambar bendera saja, berada di samping kiri icon Riwayat */}
                  <button
                    type="button"
                    id="btn-header-flag-language"
                    onClick={() => {
                      const nextLang: EmailLanguage = language === 'id' ? 'en' : 'id';
                      setLanguage(nextLang);
                      setGlobalLanguage(nextLang);
                      const draft = generateTailoredApplicationDraft({
                        companyName: companyName.trim(),
                        jobTitle: jobTitle.trim(),
                        recipientEmail: recipientEmail.trim() || 'recruitment@perusahaan.com',
                        keyRequirements,
                        tone: 'concise',
                        language: nextLang,
                        presetKey: selectedCvPreset,
                      });
                      setEmailBody(draft.emailBody);
                    }}
                    className="p-1.5 text-slate-500 hover:bg-slate-200/60 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer select-none shrink-0 group flex items-center justify-center border border-slate-200/80 bg-white shadow-2xs"
                    title={
                      language === 'id'
                        ? 'Bahasa Indonesia (Klik untuk beralih ke English)'
                        : 'English (Click to switch to Bahasa Indonesia)'
                    }
                    aria-label="Ganti Bahasa Draf Email dan Preset CV"
                  >
                    <img
                      src={language === 'id' ? 'https://flagcdn.com/id.svg' : 'https://flagcdn.com/gb.svg'}
                      alt={language === 'id' ? 'Bendera Indonesia' : 'UK Flag'}
                      className="w-5 h-3.5 object-cover rounded-xs shadow-2xs border border-black/10 group-hover:scale-105 transition-transform block"
                      referrerPolicy="no-referrer"
                      loading="eager"
                    />
                  </button>

                  {/* Tombol Draf Lamaran & Riwayat Pengiriman (Hanya tampil saat mode buat lamaran baru) */}
                  {!activeEditingDraft && (
                    <>
                      <button
                        type="button"
                        onClick={() => setIsDraftsModalOpen(true)}
                        className="relative p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
                        title={`Draf Lamaran (${draftCount} tersimpan)`}
                        aria-label="Draf Lamaran"
                      >
                        <FileText className="w-5 h-5" />
                        {draftCount > 0 && (
                          <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-blue-600 text-white text-[9px] font-extrabold flex items-center justify-center ring-2 ring-white">
                            {draftCount > 99 ? '99+' : draftCount}
                          </span>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsGasHistoryOpen(true)}
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
                        title="Riwayat Pengiriman Email"
                        aria-label="Riwayat Pengiriman Email"
                      >
                        <History className="w-5 h-5" />
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      if (activeEditingDraft) {
                        setActiveDraftId(null);
                        setIsDraftsModalOpen(true);
                      } else {
                        onClose();
                      }
                    }}
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer"
                    aria-label={activeEditingDraft ? 'Kembali ke Daftar Draf' : 'Tutup modal'}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            {/* Modal / Sheet Body */}
            <div className="relative overflow-y-auto p-4 sm:p-5 space-y-3.5 min-h-[220px]">
              {/* Sending State: Only Lottie Animation, Title, & Subtitle */}
              {(gasSendState === 'generating' || gasSendState === 'sending') ? (
                <div className="py-10 px-4 flex flex-col items-center justify-center text-center animate-in fade-in duration-200 min-h-[300px]">
                  <SendingLottieAnimation
                    className="w-44 h-44 sm:w-52 sm:h-52"
                    senderEmail={sendingSenderEmail || activeSenderInfo?.account.email || 'halo.alvareza@gmail.com'}
                  />
                </div>
              ) : (
                <>
                  {/* Smart Teks Input & OCR Image Pick Button */}
                  <SmartInputSection
                    isScanning={isScanning}
                    activeEditingDraft={activeEditingDraft}
                    quickInputText={quickInputText}
                    setQuickInputText={setQuickInputText}
                    handleQuickTextChange={handleQuickTextChange}
                    triggerFileInput={triggerFileInput}
                    handleDrop={handleDrop}
                    isDropOver={isDropOver}
                    setIsDropOver={setIsDropOver}
                    isImageExpanded={isImageExpanded}
                    setIsImageExpanded={setIsImageExpanded}
                    imagePreviewUrl={imagePreviewUrl}
                    ocrResultText={ocrResultText}
                    handleOcrTextChange={handleOcrTextChange}
                    handleRemoveFile={handleRemoveFile}
                    handleCopy={handleCopy}
                    copiedAll={copiedAll}
                  />

                  {/* Scanning State */}
                  <JobApplyScanningView
                    isScanning={isScanning}
                    imagePreviewUrl={imagePreviewUrl}
                    scanStage={scanStage}
                    ocrProgress={ocrProgress}
                  />

                  {/* Error Notice if any */}
                  {!isScanning && error && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2 text-xs text-amber-800">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold">Catatan:</span> Menggunakan draf asistensi cerdas berbasis data CV Alvareza. Anda dapat mengedit detail di bawah.
                      </div>
                    </div>
                  )}

                  {/* Form Fields - Perfectly uniform 14px (space-y-3.5) vertical spacing */}
                  {!isScanning && (
                    <div className="space-y-3.5">
                      <JobFormFields
                        companyName={companyName}
                        setCompanyName={setCompanyName}
                        jobTitle={jobTitle}
                        setJobTitle={setJobTitle}
                        isPresetAuto={isPresetAuto}
                        setIsPresetAuto={setIsPresetAuto}
                        recipientEmail={recipientEmail}
                        setRecipientEmail={setRecipientEmail}
                        ccEmail={ccEmail}
                        setCcEmail={setCcEmail}
                        showCcField={showCcField}
                        setShowCcField={setShowCcField}
                        emailSubject={emailSubject}
                        setEmailSubject={setEmailSubject}
                        isSubjectAuto={isSubjectAuto}
                        setIsSubjectAuto={setIsSubjectAuto}
                        emailBody={emailBody}
                        isEmailBodyExpanded={isEmailBodyExpanded}
                        setIsEmailBodyExpanded={setIsEmailBodyExpanded}
                        copiedEmail={copiedEmail}
                        copiedCc={copiedCc}
                        copiedSubject={copiedSubject}
                        copiedBody={copiedBody}
                        handleCopy={handleCopy}
                        activeDraftId={activeDraftId}
                      />

                      {/* SECTION: Paket Dokumen Terpadu Otomatis (Akademik, Portofolio, Sertifikasi, Lampiran Tambahan) */}
                      <AttachmentsSection
                        selectedCvPreset={selectedCvPreset}
                        jobTitle={jobTitle}
                        selectedAcademicIds={selectedAcademicIds}
                        showAcademicBreakdown={showAcademicBreakdown}
                        setShowAcademicBreakdown={setShowAcademicBreakdown}
                        handlePreviewAcademicPdf={handlePreviewAcademicPdf}
                        isPreviewingAcademic={isPreviewingAcademic}
                        handleToggleAcademicDoc={handleToggleAcademicDoc}
                        selectedPortfolioSlideIds={selectedPortfolioSlideIds}
                        showPortfolioBreakdown={showPortfolioBreakdown}
                        setShowPortfolioBreakdown={setShowPortfolioBreakdown}
                        handlePreviewPortfolioPdf={handlePreviewPortfolioPdf}
                        isPreviewingPortfolio={isPreviewingPortfolio}
                        handleTogglePortfolioSlide={handleTogglePortfolioSlide}
                        selectedCertIds={selectedCertIds}
                        showCertsBreakdown={showCertsBreakdown}
                        setShowCertsBreakdown={setShowCertsBreakdown}
                        handlePreviewCertsPdf={handlePreviewCertsPdf}
                        isPreviewingCerts={isPreviewingCerts}
                        handleToggleCert={handleToggleCert}
                        customAttachments={customAttachments}
                        handleRemoveCustomAttachment={handleRemoveCustomAttachment}
                        processUploadedFiles={processUploadedFiles}
                        setTargetCertIdForPick={setTargetCertIdForPick}
                        attachmentInputRef={attachmentInputRef}
                        isAttachmentDropOver={isAttachmentDropOver}
                        setIsAttachmentDropOver={setIsAttachmentDropOver}
                        formatFileSize={formatFileSize}
                      />
                    </div>
                  )}

                  {/* SECTION: Status Pengiriman & Feedback */}
                  <JobApplyStatusAlerts
                    isScanning={isScanning}
                    gasSendState={gasSendState}
                    gasSendMsg={gasSendMsg}
                    sendingSenderEmail={sendingSenderEmail}
                    activeSenderEmail={activeSenderInfo?.account.email}
                    recipientEmail={recipientEmail}
                    onOpenGasSettings={() => setIsGasSettingsOpen(true)}
                  />
                </>
              )}
            </div>

            {/* Action Buttons Footer */}
            {!isScanning && (
              <JobApplyFooter
                gasSendState={gasSendState}
                sendProgress={sendProgress}
                isCvOptionsOpen={isCvOptionsOpen}
                setIsCvOptionsOpen={setIsCvOptionsOpen}
                selectedCvPreset={selectedCvPreset}
                setSelectedCvPreset={setSelectedCvPreset}
                setIsPresetAuto={setIsPresetAuto}
                cvDesignPreset={cvDesignPreset}
                setCvDesignPreset={setCvDesignPreset}
                cvHeaderColor={cvHeaderColor}
                setCvHeaderColor={setCvHeaderColor}
                cvTextAlign={cvTextAlign}
                setCvTextAlign={setCvTextAlign}
                emailOption={emailOption}
                handleEmailOptionChange={handleEmailOptionChange}
                gasAccounts={gasAccounts}
                handleSaveToDraft={handleSaveToDraft}
                draftSaveFeedback={draftSaveFeedback}
                activeEditingDraft={activeEditingDraft}
                handleOpenMailClient={handleOpenMailClient}
                handleSendViaGas={handleSendViaGas}
                onPresetChangeWithDraft={(newPreset) => {
                  const draft = generateTailoredApplicationDraft({
                    companyName: companyName.trim(),
                    jobTitle: jobTitle.trim(),
                    recipientEmail: recipientEmail.trim() || 'recruitment@perusahaan.com',
                    keyRequirements,
                    tone: 'concise',
                    language,
                    presetKey: newPreset,
                  });
                  setEmailBody(draft.emailBody);
                }}
              />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
