import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { matchPresetFromJobTitle } from '../../../data/preset/RoleConfig';
import { detectDominantLanguage } from '../../../data/position-detektor';
import { JobDraftService } from '../../../services/jobDraftService';
import { JobApplicationDraftItem } from '../../../types/jobDraft';
import { EmailLanguage, JobScanResult } from '../../../types/jobApplication';
import {
  APPLICANT_DATA,
  generateTailoredApplicationDraft,
  parseJobTextHeuristically,
  createMailtoUrl,
} from '../../../utils/jobApplicationDraft';
import { validateAndSanitizeOcrResult } from '../../../utils/ocrValidatorAndMapper';
import { GasSenderService } from '../../../services/gasSenderService';
import {
  generateCvPdfAttachment,
  generateCoverLetterPdfAttachment,
  generatePortfolioPdfAttachment,
  generateCertificatesPdfAttachment,
  formatEmailBodyToHtml,
} from '../../../utils/gasAttachmentGenerator';
import {
  getAcademicAttachments,
  downloadAcademicDocs,
} from '../../../data/academicDocs';
import {
  ALL_PORTFOLIO_SLIDES,
  ALL_CERTIFICATES_LIST,
  getAdaptivePortfolioSlides,
  getActiveCertificateList,
} from '../../../utils/portfolioPdfGenerator';
import { GasAccountConfig, GasSendMode } from '../../../types/gasSender';
import { useLanguage } from '../../../context/LanguageContext';
import { formatFileSize, downloadBase64Pdf } from '../../../utils/gasAttachmentPreview';
import { CustomAttachmentItem, CvDesignType, CvTextAlignType } from '../types';

export interface JobApplyModalSheetProps {
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

export function useJobApplyFlow({
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
}: JobApplyModalSheetProps) {
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
  const [language, setLanguage] = useState<EmailLanguage>(globalLanguage || 'in');
  const [cvDesignPreset, setCvDesignPreset] = useState<CvDesignType>('block');
  const [cvHeaderColor, setCvHeaderColor] = useState<string>('#0062E3');
  const [cvTextAlign, setCvTextAlign] = useState<CvTextAlignType>('left');
  const [coverLetterTextAlign, setCoverLetterTextAlign] = useState<CvTextAlignType>('justify');
  const [showCvBreakdown, setShowCvBreakdown] = useState<boolean>(false);
  const [isPreviewingCv, setIsPreviewingCv] = useState<boolean>(false);
  const [activeDraftId, setActiveDraftId] = useState<string | null>(null);
  const [highlightDraftId, setHighlightDraftId] = useState<string | null>(null);
  const [keyRequirements, setKeyRequirements] = useState<string[]>([]);
  const [jobDesk, setJobDesk] = useState<string>('');
  const [kualifikasi, setKualifikasi] = useState<string>('');
  const [showJobDetailFields, setShowJobDetailFields] = useState<boolean>(false);
  const [isDropOver, setIsDropOver] = useState(false);
  const [isImageExpanded, setIsImageExpanded] = useState<boolean>(false);

  // Debounce nilai input untuk algoritma berat (ATS Preset matching, Language detection, Draft generation)
  const [debouncedJobTitle, setDebouncedJobTitle] = useState(jobTitle);
  const [debouncedJobDesk, setDebouncedJobDesk] = useState(jobDesk);
  const [debouncedKualifikasi, setDebouncedKualifikasi] = useState(kualifikasi);
  const [debouncedCompanyName, setDebouncedCompanyName] = useState(companyName);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedJobTitle(jobTitle);
      setDebouncedJobDesk(jobDesk);
      setDebouncedKualifikasi(kualifikasi);
      setDebouncedCompanyName(companyName);
    }, 100);
    return () => clearTimeout(timer);
  }, [jobTitle, jobDesk, kualifikasi, companyName]);

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
  const [activePreviewModal, setActivePreviewModal] = useState<'cv' | 'surat-lamaran' | 'akademik' | 'portofolio' | 'sertifikasi' | null>(null);
  const [coverLetterDate, setCoverLetterDate] = useState<string>(() => {
    return new Date().toISOString().slice(0, 10);
  });
  const [isCoverLetterDateAuto, setIsCoverLetterDateAuto] = useState<boolean>(true);
  const [coverLetterCity, setCoverLetterCity] = useState<string>('');
  const [isCoverLetterCityActive, setIsCoverLetterCityActive] = useState<boolean>(false);
  const [showCoverLetterBreakdown, setShowCoverLetterBreakdown] = useState<boolean>(false);
  const [isPreviewingCoverLetter, setIsPreviewingCoverLetter] = useState<boolean>(false);
  const [draftCount, setDraftCount] = useState<number>(() => JobDraftService.getDraftCount());
  const [draftSaveFeedback, setDraftSaveFeedback] = useState(false);
  const [selectedAcademicIds, setSelectedAcademicIds] = useState<string[]>(['skl', 'transkrip']);
  const [isColorPrint, setIsColorPrint] = useState<boolean>(false);
  const [showAcademicBreakdown, setShowAcademicBreakdown] = useState<boolean>(false);
  const [isPreviewingAcademic, setIsPreviewingAcademic] = useState<boolean>(false);
  const [isPreviewingPortfolio, setIsPreviewingPortfolio] = useState(false);
  const [isPreviewingCerts, setIsPreviewingCerts] = useState(false);
  const [showPortfolioBreakdown, setShowPortfolioBreakdown] = useState(false);
  const [isPortfolioCompressed, setIsPortfolioCompressed] = useState<boolean>(false);
  const [showCertsBreakdown, setShowCertsBreakdown] = useState(false);
  const [selectedCvPreset, setSelectedCvPreset] = useState<string>('optimal');
  const [isResettingAll, setIsResettingAll] = useState<boolean>(false);
  const effectiveCvHeaderColor = cvHeaderColor;

  // Rekomendasi otomatis sesuai preset role aktif (menggunakan debouncedJobTitle agar tidak lag saat mengetik)
  const recommendedPortfolioSlideIds = useMemo(() => {
    return getAdaptivePortfolioSlides(selectedCvPreset, {
      jobTitle: debouncedJobTitle,
    }).map((s) => s.id);
  }, [selectedCvPreset, debouncedJobTitle]);

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

  // Otomatis centang rekomendasi setiap kali preset berganti atau user selesai mengetik posisi
  useEffect(() => {
    const recommendedSlides = getAdaptivePortfolioSlides(selectedCvPreset, {
      jobTitle: debouncedJobTitle,
    }).map((s) => s.id);
    setSelectedPortfolioSlideIds(recommendedSlides);

    const recommendedCerts = getActiveCertificateList(selectedCvPreset).map((c) => c.id);
    setSelectedCertIds(recommendedCerts);
  }, [selectedCvPreset, debouncedJobTitle]);

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

  const handleResetAcademicToDefault = () => {
    setSelectedAcademicIds(['skl', 'transkrip']);
  };

  const handleResetPortfolioToRoleDefault = () => {
    const recommendedSlides = getAdaptivePortfolioSlides(selectedCvPreset || 'optimal', {
      jobTitle,
    }).map((s) => s.id);
    setSelectedPortfolioSlideIds(recommendedSlides);
  };

  const handleResetCertsToRoleDefault = () => {
    const recommendedCerts = getActiveCertificateList(selectedCvPreset || 'optimal').map((c) => c.id);
    setSelectedCertIds(recommendedCerts);
  };

  const handleToggleCert = (certId: string) => {
    setSelectedCertIds((prev) =>
      prev.includes(certId) ? prev.filter((id) => id !== certId) : [...prev, certId]
    );
  };

  const [isPresetAuto, setIsPresetAuto] = useState<boolean>(true);

  useEffect(() => {
    try {
      localStorage.removeItem('isPresetAuto');
    } catch {
      // ignore storage errors
    }
  }, []);

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

  /**
   * Resolve applicant email for manual preview and download:
   * - If bottom selector is "Rotasi Otomatis" (or "mailto"): default to 'alvareza.work@gmail.com'
   * - If bottom selector is set to a specific account: use that account's email
   */
  const resolvedApplicantEmail = useMemo(() => {
    if (emailOption === 'rotate' || emailOption === 'mailto') {
      return 'alvareza.work@gmail.com';
    }

    const matched = gasAccounts.find(
      (a) => a.id === emailOption || a.email.toLowerCase() === emailOption.toLowerCase()
    );
    if (matched && matched.email) {
      return matched.email;
    }
    if (emailOption.includes('@')) {
      return emailOption;
    }

    return 'alvareza.work@gmail.com';
  }, [emailOption, gasAccounts]);

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

      setIsPresetAuto(true);
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

      const matchedFromScan = matchPresetFromJobTitle({
        jobTitle: validated.jobTitle || '',
        jobDesk,
        kualifikasi,
        rawText: [
          ...(validated.keyRequirements || []),
          scanResult.rawExtractedText || '',
        ]
          .filter(Boolean)
          .join('\n'),
      });
      if (matchedFromScan && matchedFromScan.key) {
        setSelectedCvPreset(matchedFromScan.key);
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
        language: 'in',
      });
      setEmailBody(draft.emailBody);
    }
  }, [scanResult, selectedFile]);

  // Handler for quick pasted / typed job ad text (Tulis Cepat)
  const handleQuickTextChange = (text: string) => {
    setQuickInputText(text);
    setIsPresetAuto(true);
    if (!text.trim()) {
      setCompanyName('');
      setJobTitle('');
      setJobDesk('');
      setKualifikasi('');
      setKeyRequirements([]);
      setSelectedCvPreset('optimal');
      setRecipientEmail('');
      setCcEmail('');
      setShowCcField(false);
      setRecipientPhone('');
      if (!isSubjectAuto) {
        setEmailSubject('');
      }
      return;
    }

    // Format: [Nama Perusahaan], [Posisi], [email tujuan], [cc jika ada @] atau [subject jika tidak ada @]
    if (text.includes(',')) {
      const parts = text.split(',').map((p) => p.trim());
      const comp = parts[0] || '';
      const pos = parts[1] || '';
      const email = parts[2] || '';
      const fourth = parts[3] || '';
      const fifth = parts[4] || '';

      if (comp) setCompanyName(comp);
      if (pos) {
        setJobTitle(pos);
        const matchedComma = matchPresetFromJobTitle({
          jobTitle: pos,
          jobDesk,
          kualifikasi,
        });
        if (matchedComma && matchedComma.key) {
          setSelectedCvPreset(matchedComma.key);
        }
      }
      if (email) setRecipientEmail(email);

      let cc = '';
      let subj = '';

      if (fourth) {
        if (fourth.includes('@')) {
          cc = fourth;
          if (fifth) subj = fifth;
        } else {
          subj = fourth;
          if (fifth && fifth.includes('@')) cc = fifth;
        }
      }

      if (cc) {
        setCcEmail(cc);
        setShowCcField(true);
      } else {
        setCcEmail('');
        setShowCcField(false);
      }

      if (subj) {
        setEmailSubject(subj);
        setIsSubjectAuto(false);
      } else if (isSubjectAuto) {
        const cleanTitle = (pos || '').trim();
        setEmailSubject(cleanTitle ? `${cleanTitle} - Alvareza` : '');
      }

      const validated = validateAndSanitizeOcrResult(null, text, undefined);
      if (validated.emailBody) setEmailBody(validated.emailBody);
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

    const matchedQuick = matchPresetFromJobTitle({
      jobTitle: validated.jobTitle || '',
      jobDesk,
      kualifikasi,
      rawText: [...(validated.keyRequirements || []), text].filter(Boolean).join('\n'),
    });
    if (matchedQuick && matchedQuick.key) {
      setSelectedCvPreset(matchedQuick.key);
    }

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
    setIsPresetAuto(true);
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

    const matchedOcr = matchPresetFromJobTitle({
      jobTitle: validated.jobTitle || jobTitle,
      jobDesk,
      kualifikasi,
      rawText: [...(validated.keyRequirements || []), text].filter(Boolean).join('\n'),
    });
    if (matchedOcr && matchedOcr.key) {
      setSelectedCvPreset(matchedOcr.key);
    }

    if (validated.hasExplicitSubject && validated.emailSubject) {
      setEmailSubject(validated.emailSubject);
    } else if (isSubjectAuto) {
      const cleanTitle = (validated.jobTitle || '').trim();
      setEmailSubject(cleanTitle ? `${cleanTitle} - Alvareza Hilka Pratama` : (validated.emailSubject || ''));
    } else {
      setEmailSubject('');
    }
  };

  // Auto-sync ATS CV Preset berdasarkan perbandingan 50% Kolom Posisi & 50% Kolom Detail Posisi
  useEffect(() => {
    if (!isPresetAuto) return;

    const hasExplicitDetail = Boolean(debouncedJobDesk.trim() || debouncedKualifikasi.trim());
    const fallbackDetail =
      !hasExplicitDetail && keyRequirements.length > 0 ? keyRequirements.join('\n') : '';

    if (debouncedJobTitle.trim() || hasExplicitDetail || fallbackDetail) {
      const matched = matchPresetFromJobTitle({
        jobTitle: debouncedJobTitle,
        jobDesk: debouncedJobDesk,
        kualifikasi: debouncedKualifikasi,
        rawText: fallbackDetail || undefined,
      });
      if (matched && matched.key) {
        setSelectedCvPreset((prev) => (prev === matched.key ? prev : matched.key));
      }
    } else {
      setSelectedCvPreset((prev) => (prev === 'optimal' ? prev : 'optimal'));
    }
  }, [debouncedJobTitle, debouncedJobDesk, debouncedKualifikasi, keyRequirements, isPresetAuto]);

  // Auto rotasi bahasa CV ke English jika jobdesk detail dan kualifikasi lebih dominan bahasa Inggris
  useEffect(() => {
    if ((debouncedJobTitle || debouncedJobDesk || debouncedKualifikasi) && !activeDraftId) {
      const dominantLang = detectDominantLanguage(debouncedJobDesk, debouncedKualifikasi, debouncedJobTitle);
      setLanguage((prevLang) => {
        if (dominantLang !== prevLang) {
          setGlobalLanguage(dominantLang);
          return dominantLang;
        }
        return prevLang;
      });
    }
  }, [debouncedJobTitle, debouncedJobDesk, debouncedKualifikasi, activeDraftId, setGlobalLanguage]);

  // Handler untuk mengembalikan formasi CV, format draf, portofolio & sertifikasi ke rekomendasi otomatis berdasarkan keyword posisi, jobdesk & kualifikasi
  const handleResetAllToAuto = useCallback(() => {
    if (isResettingAll) return;
    setIsResettingAll(true);
    setTimeout(() => setIsResettingAll(false), 600);

    // 1. Re-detect preset peran dari judul posisi, jobdesk, kualifikasi, dan teks scan
    let autoPreset = 'optimal';
    if (jobTitle || jobDesk || kualifikasi || ocrResultText || quickInputText) {
      const matched = matchPresetFromJobTitle({
        jobTitle,
        jobDesk,
        kualifikasi,
      });
      if (matched && matched.key) {
        autoPreset = matched.key;
      }
    }
    setSelectedCvPreset(autoPreset);
    setIsPresetAuto(true);

    // 2. Re-detect bahasa dominan
    const dominantLang: EmailLanguage = detectDominantLanguage(jobDesk, kualifikasi, jobTitle);
    setLanguage(dominantLang);
    setGlobalLanguage(dominantLang);

    // 3. Reset formasi styling CV ke standar:
    // Warna standar: Biru (#0062E3)
    // Rata teks: Kiri ('left')
    // Desain layout: Blok solid ('block')
    setCvHeaderColor('#0062E3');
    setCvTextAlign('left');
    setCvDesignPreset('block');

    // 4. Sinkronisasi format subjek email otomatis
    const cleanTitle = jobTitle.trim();
    if (cleanTitle) {
      setEmailSubject(`${cleanTitle} - Alvareza Hilka Pratama`);
    } else {
      setEmailSubject('');
    }
    setIsSubjectAuto(true);

    // 5. Sinkronisasi draf email lamaran kerja format otomatis
    const combinedReqs = [
      ...keyRequirements,
      ...(kualifikasi ? kualifikasi.split(/[\n,;]+/).map((s) => s.trim()).filter((s) => s.length > 3) : []),
      ...(jobDesk ? jobDesk.split(/[\n,;]+/).map((s) => s.trim()).filter((s) => s.length > 3) : []),
    ];
    const draft = generateTailoredApplicationDraft({
      companyName: companyName.trim(),
      jobTitle: jobTitle.trim(),
      recipientEmail: recipientEmail.trim() || 'recruitment@perusahaan.com',
      keyRequirements: combinedReqs,
      tone: 'concise',
      language: dominantLang,
      presetKey: autoPreset,
    });
    setEmailBody(draft.emailBody);

    // 6. Kembalikan rekomendasi portofolio yang selaras dengan posisi & preset ini by data
    const recSlides = getAdaptivePortfolioSlides(autoPreset, {
      jobTitle,
    }).map((s) => s.id);
    setSelectedPortfolioSlideIds(recSlides);

    // 7. Kembalikan rekomendasi sertifikasi fisik yang selaras dengan posisi & preset ini by data
    const recCerts = getActiveCertificateList(autoPreset).map((c) => c.id);
    setSelectedCertIds(recCerts);

    // 8. Sesuaikan lampiran dokumen akademik bila relevan dengan syarat lowongan by data
    const allContextText = `${jobTitle} ${jobDesk} ${kualifikasi} ${ocrResultText} ${quickInputText}`.toLowerCase();
    const mentionsAcademic = /transkrip|ijazah|skl|surat keterangan lulus|ipk|akademik/i.test(allContextText);
    if (mentionsAcademic) {
      setSelectedAcademicIds(['skl', 'transkrip']);
    } else {
      setSelectedAcademicIds([]);
    }

    // 9. Reset tanggal surat lamaran ke hari ini dan kota ke nonaktif (kosong)
    setCoverLetterDate(new Date().toISOString().slice(0, 10));
    setIsCoverLetterDateAuto(true);
    setCoverLetterCity('');
    setIsCoverLetterCityActive(false);
    setCoverLetterTextAlign('justify');
    setIsPortfolioCompressed(false);
  }, [
    isResettingAll,
    jobTitle,
    jobDesk,
    kualifikasi,
    companyName,
    recipientEmail,
    keyRequirements,
    ocrResultText,
    quickInputText,
    setGlobalLanguage,
  ]);

  // Backward compatibility alias
  const handleResetCvToAuto = handleResetAllToAuto;

  // Sync subject ONLY when isSubjectAuto is enabled, or jobTitle / companyName changes
  useEffect(() => {
    if (isSubjectAuto) {
      const cleanTitle = jobTitle.trim();
      const cleanComp = companyName.trim();
      if (cleanTitle && cleanComp) {
        setEmailSubject(`${cleanTitle} - ${cleanComp} - Alvareza Hilka Pratama`);
      } else if (cleanTitle) {
        setEmailSubject(`${cleanTitle} - Alvareza Hilka Pratama`);
      } else if (cleanComp) {
        setEmailSubject(`Lamaran Pekerjaan - ${cleanComp} - Alvareza Hilka Pratama`);
      } else {
        setEmailSubject('');
      }
    }
  }, [isSubjectAuto, jobTitle, companyName]);

  // Synchronization of email body when preset, language, or debounced company/job/detail changes
  useEffect(() => {
    if (!activeDraftId) {
      const combinedReqs = [
        ...keyRequirements,
        ...(debouncedKualifikasi
          ? debouncedKualifikasi.split(/[\n,;]+/).map((s) => s.trim()).filter((s) => s.length > 3)
          : []),
        ...(debouncedJobDesk
          ? debouncedJobDesk.split(/[\n,;]+/).map((s) => s.trim()).filter((s) => s.length > 3)
          : []),
      ];
      const draft = generateTailoredApplicationDraft({
        companyName: debouncedCompanyName.trim(),
        jobTitle: debouncedJobTitle.trim(),
        recipientEmail: recipientEmail.trim() || 'recruitment@perusahaan.com',
        keyRequirements: combinedReqs,
        tone: 'concise',
        language,
        presetKey: selectedCvPreset,
      });
      setEmailBody(draft.emailBody);
    }
  }, [
    selectedCvPreset,
    language,
    debouncedJobTitle,
    debouncedJobDesk,
    debouncedKualifikasi,
    debouncedCompanyName,
    keyRequirements,
    activeDraftId,
  ]);

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

  const handleToggleLanguage = () => {
    const nextLang: EmailLanguage = language === 'in' ? 'en' : 'in';
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

  const handlePreviewCvPdf = async () => {
    try {
      setIsPreviewingCv(true);
      const att = generateCvPdfAttachment({
        preset: selectedCvPreset,
        language,
        jobTitle,
        companyName,
        headerColor: effectiveCvHeaderColor,
        designPreset: cvDesignPreset,
        textAlign: cvTextAlign,
        applicantEmail: resolvedApplicantEmail,
        jobDesk,
        kualifikasi,
        rawText: [ocrResultText, quickInputText, ...(keyRequirements || [])].filter(Boolean).join(' '),
      });
      downloadBase64Pdf(att.base64, att.filename);
    } catch (e: any) {
      alert('Gagal membuat preview CV ATS PDF: ' + (e?.message || 'Error tidak diketahui'));
    } finally {
      setIsPreviewingCv(false);
    }
  };

  const handlePreviewCoverLetterPdf = async () => {
    try {
      setIsPreviewingCoverLetter(true);
      const att = generateCoverLetterPdfAttachment({
        companyName,
        jobTitle,
        jobDesk,
        kualifikasi,
        coverLetterDate,
        coverLetterCity: isCoverLetterCityActive ? coverLetterCity : '',
        language,
        presetKey: selectedCvPreset,
        headerColor: effectiveCvHeaderColor,
        textAlign: coverLetterTextAlign,
        applicantEmail: resolvedApplicantEmail,
      });
      downloadBase64Pdf(att.base64, att.filename);
    } catch (e: any) {
      alert('Gagal membuat Surat Lamaran PDF: ' + (e?.message || 'Error tidak diketahui'));
    } finally {
      setIsPreviewingCoverLetter(false);
    }
  };

  const handlePreviewAcademicPdf = async () => {
    if (selectedAcademicIds.length === 0) {
      alert('Mohon pilih minimal 1 dokumen akademik untuk diunduh.');
      return;
    }
    try {
      setIsPreviewingAcademic(true);
      await downloadAcademicDocs(selectedAcademicIds, isColorPrint);
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
        isCompressed: isPortfolioCompressed,
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

      const senderEmail = currentSender.account.email;

      // 1. Dokumen CV ATS PDF (Otomatis disertakan sesuai preset yang dipilih)
      setGasSendMsg('Men-generate CV ATS PDF resmi...');
      const cvAttachment = generateCvPdfAttachment({
        preset: selectedCvPreset,
        language,
        jobTitle,
        companyName,
        headerColor: effectiveCvHeaderColor,
        designPreset: cvDesignPreset,
        textAlign: cvTextAlign,
        applicantEmail: senderEmail,
        jobDesk,
        kualifikasi,
        rawText: [ocrResultText, quickInputText, ...(keyRequirements || [])].filter(Boolean).join(' '),
      });
      attachments.push(cvAttachment);
      setSendProgress((prev) => Math.max(prev, 35));

      // 2. Dokumen Surat Lamaran PDF Resmi (surat-lamaran.pdf)
      setGasSendMsg('Menyusun Surat Lamaran PDF resmi (surat-lamaran.pdf)...');
      const coverLetterAttachment = generateCoverLetterPdfAttachment({
        companyName,
        jobTitle,
        jobDesk,
        kualifikasi,
        coverLetterDate,
        coverLetterCity: isCoverLetterCityActive ? coverLetterCity : '',
        language,
        presetKey: selectedCvPreset,
        headerColor: effectiveCvHeaderColor,
        textAlign: coverLetterTextAlign,
        applicantEmail: senderEmail,
      });
      attachments.push(coverLetterAttachment);
      setSendProgress((prev) => Math.max(prev, 42));

      // 3. Dokumen Akademik Resmi PDF (Jika ada pilihan Surat Keterangan Lulus / Transkrip Nilai yang dicentang)
      if (selectedAcademicIds.length > 0) {
        setGasSendMsg(
          selectedAcademicIds.length === 2
            ? (isColorPrint
                ? 'Menggabungkan SKL & Transkrip Nilai (akademik-alvareza.pdf)...'
                : 'Menggabungkan SKL & Transkrip Nilai (Hitam Putih / BW)...')
            : (isColorPrint
                ? 'Mempersiapkan Dokumen Akademik Resmi...'
                : 'Mempersiapkan Dokumen Akademik Resmi (Hitam Putih / BW)...')
        );
        const academicAttachments = await getAcademicAttachments(selectedAcademicIds, isColorPrint);
        for (const academicAttachment of academicAttachments) {
          attachments.push(academicAttachment);
        }
      }
      setSendProgress((prev) => Math.max(prev, 48));

      // 3. Dokumen Portofolio Adaptif PDF (Jika ada slide yang dipilih)
      if (selectedPortfolioSlideIds.length > 0) {
        setGasSendMsg(
          isPortfolioCompressed
            ? 'Menyusun Portofolio PDF Terpilih Kompresi (≤ 1MB)...'
            : 'Menyusun Portofolio PDF Terpilih...'
        );
        const portfolioAttachment = await generatePortfolioPdfAttachment({
          preset: selectedCvPreset,
          selectedSlideIds: selectedPortfolioSlideIds,
          jobTitle,
          isCompressed: isPortfolioCompressed,
          onProgress: (cur, tot) => {
            setGasSendMsg(
              isPortfolioCompressed
                ? `Mengompresi Portofolio PDF (${cur}/${tot} slide, target ≤ 1MB)...`
                : `Menyusun Portofolio PDF (${cur}/${tot} slide)...`
            );
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

      const finalSubject = emailSubject.trim() || (jobTitle.trim() ? `${jobTitle.trim()} - Alvareza Hilka Pratama` : 'Lamaran Pekerjaan - Alvareza Hilka Pratama');

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
          senderName: 'Alvareza Hilka Pratama',
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
          setJobDesk('');
          setKualifikasi('');
          setRecipientEmail('');
          setCcEmail('');
          setShowCcField(false);
          setRecipientPhone('');
          setOcrResultText('');
          setImagePreviewUrl(null);
          setKeyRequirements([]);
          setEmailSubject('');
          setSelectedCvPreset('optimal');
          setIsPresetAuto(true);
          setSelectedAcademicIds(['skl', 'transkrip']);
          setIsColorPrint(false);
          setCoverLetterCity('');
          setIsCoverLetterCityActive(false);
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
    if (item.jobTitle) {
      setIsPresetAuto(true);
      setJobTitle(item.jobTitle);
    }
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
      jobDesk: jobDesk.trim(),
      kualifikasi: kualifikasi.trim(),
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
      coverLetterDate: coverLetterDate,
      isCoverLetterDateAuto: isCoverLetterDateAuto,
      coverLetterCity: coverLetterCity,
      isCoverLetterCityActive: isCoverLetterCityActive,
      isColorPrint: isColorPrint,
      isPortfolioCompressed: isPortfolioCompressed,
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
      setJobDesk('');
      setKualifikasi('');
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
      setCoverLetterCity('');
      setIsCoverLetterCityActive(false);
      setSelectedAcademicIds(['skl', 'transkrip']);
      setIsColorPrint(false);
      setIsPortfolioCompressed(false);
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
        language: language || 'in',
        presetKey: 'optimal',
      });
      setEmailBody(freshDraft.emailBody);
    }
  };

  const handleLoadDraftForEdit = (draft: JobApplicationDraftItem) => {
    setActiveDraftId(draft.id);
    setCompanyName(draft.companyName || '');
    setJobTitle(draft.jobTitle || '');
    setJobDesk(draft.jobDesk || '');
    setKualifikasi(draft.kualifikasi || '');
    setShowJobDetailFields(Boolean(draft.jobDesk || draft.kualifikasi));
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
    } else {
      setIsPresetAuto(true);
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
    if (draft.coverLetterDate) {
      setCoverLetterDate(draft.coverLetterDate);
    }
    if (draft.isCoverLetterDateAuto !== undefined) {
      setIsCoverLetterDateAuto(draft.isCoverLetterDateAuto);
    }
    if (draft.coverLetterCity !== undefined) {
      setCoverLetterCity(draft.coverLetterCity);
    }
    if (draft.isCoverLetterCityActive !== undefined) {
      setIsCoverLetterCityActive(draft.isCoverLetterCityActive);
    }
    if (draft.isColorPrint !== undefined) {
      setIsColorPrint(draft.isColorPrint);
    } else {
      setIsColorPrint(false);
    }
    if (draft.isPortfolioCompressed !== undefined) {
      setIsPortfolioCompressed(draft.isPortfolioCompressed);
    } else {
      setIsPortfolioCompressed(false);
    }
    if (draft.selectedAcademicIds) {
      setSelectedAcademicIds(draft.selectedAcademicIds);
    } else {
      setSelectedAcademicIds(['skl', 'transkrip']);
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

  let activeModalView:
    | 'settings'
    | 'history'
    | 'drafts'
    | 'preview-cv'
    | 'preview-surat-lamaran'
    | 'preview-akademik'
    | 'preview-portfolio'
    | 'preview-certs'
    | 'apply'
    | null = null;
  if (isOpen) {
    if (isGasSettingsOpen) activeModalView = 'settings';
    else if (isGasHistoryOpen) activeModalView = 'history';
    else if (isDraftsModalOpen) activeModalView = 'drafts';
    else if (activePreviewModal === 'cv') activeModalView = 'preview-cv';
    else if (activePreviewModal === 'surat-lamaran') activeModalView = 'preview-surat-lamaran';
    else if (activePreviewModal === 'akademik') activeModalView = 'preview-akademik';
    else if (activePreviewModal === 'portofolio') activeModalView = 'preview-portfolio';
    else if (activePreviewModal === 'sertifikasi') activeModalView = 'preview-certs';
    else activeModalView = 'apply';
  }



  return {
    activeDraftId,
    activeEditingDraft,
    activeModalView,
    activeSenderInfo,
    attachmentInputRef,
    ccEmail,
    companyName,
    copiedAll,
    copiedBody,
    copiedCc,
    copiedEmail,
    copiedSubject,
    coverLetterCity,
    coverLetterDate,
    coverLetterTextAlign,
    customAttachments,
    cvDesignPreset,
    cvHeaderColor,
    cvTextAlign,
    draftCount,
    draftSaveFeedback,
    effectiveCvHeaderColor,
    emailBody,
    emailOption,
    emailSubject,
    fileInputRef,
    gasAccounts,
    gasSendMsg,
    gasSendState,
    handleCopy,
    handleDrop,
    handleEmailOptionChange,
    handleFileChange,
    handleLoadDraftForEdit,
    handleOcrTextChange,
    handleOpenMailClient,
    handlePreviewAcademicPdf,
    handlePreviewCertsPdf,
    handlePreviewCoverLetterPdf,
    handlePreviewCvPdf,
    handlePreviewPortfolioPdf,
    handleQuickTextChange,
    handleRemoveCustomAttachment,
    handleRemoveFile,
    handleResetAcademicToDefault,
    handleResetAllToAuto,
    handleResetCertsToRoleDefault,
    handleResetPortfolioToRoleDefault,
    handleSaveToDraft,
    handleSelectHistoryItemForEdit,
    handleSendViaGas,
    handleToggleAcademicDoc,
    handleToggleCert,
    handleTogglePortfolioSlide,
    highlightDraftId,
    imagePreviewUrl,
    isAttachmentDropOver,
    isColorPrint,
    isPortfolioCompressed,
    isCoverLetterCityActive,
    isCoverLetterDateAuto,
    isDraftsModalOpen,
    isDropOver,
    isEmailBodyExpanded,
    isGasHistoryOpen,
    isGasSettingsOpen,
    isImageExpanded,
    isPresetAuto,
    isPreviewingAcademic,
    isPreviewingCerts,
    isPreviewingCoverLetter,
    isPreviewingCv,
    isPreviewingPortfolio,
    isResettingAll,
    isSubjectAuto,
    jobDesk,
    jobTitle,
    keyRequirements,
    kualifikasi,
    language,
    ocrResultText,
    processUploadedFiles,
    quickInputText,
    recipientEmail,
    refreshSenderInfo,
    resolvedApplicantEmail,
    selectedAcademicIds,
    selectedCertIds,
    selectedCvPreset,
    selectedPortfolioSlideIds,
    sendProgress,
    sendingSenderEmail,
    setActiveDraftId,
    setActivePreviewModal,
    setCcEmail,
    setCompanyName,
    setCoverLetterCity,
    setCoverLetterDate,
    setCoverLetterTextAlign,
    setCustomAttachments,
    setCvDesignPreset,
    setCvHeaderColor,
    setCvTextAlign,
    setDraftCount,
    setEmailBody,
    setEmailSubject,
    setImagePreviewUrl,
    setIsAttachmentDropOver,
    setIsColorPrint,
    setIsPortfolioCompressed,
    setIsCoverLetterCityActive,
    setIsCoverLetterDateAuto,
    setIsDraftsModalOpen,
    setIsDropOver,
    setIsEmailBodyExpanded,
    setIsGasHistoryOpen,
    setIsGasSettingsOpen,
    setIsImageExpanded,
    setIsPresetAuto,
    setIsSubjectAuto,
    setJobDesk,
    setJobTitle,
    setKeyRequirements,
    setKualifikasi,
    setLanguage,
    setOcrResultText,
    setQuickInputText,
    setRecipientEmail,
    setRecipientPhone,
    setSelectedAcademicIds,
    setSelectedCvPreset,
    setShowAcademicBreakdown,
    setShowCcField,
    setShowCertsBreakdown,
    setShowCoverLetterBreakdown,
    setShowCvBreakdown,
    setShowJobDetailFields,
    setShowPortfolioBreakdown,
    setTargetCertIdForPick,
    showAcademicBreakdown,
    showCcField,
    showCertsBreakdown,
    showCoverLetterBreakdown,
    showCvBreakdown,
    showJobDetailFields,
    showPortfolioBreakdown,
    triggerFileInput
  };
}
