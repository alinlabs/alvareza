import React, { useState, useEffect, useMemo } from 'react';
import { GasSenderService } from '../../../services/gasSenderService';
import { JobDraftService } from '../../../services/jobDraftService';
import { JobApplicationDraftItem } from '../../../types/jobDraft';
import { GasAccountConfig, GasSendMode } from '../../../types/gasSender';
import { EmailLanguage } from '../../../types/jobApplication';
import {
  generateCvPdfAttachment,
  generateCoverLetterPdfAttachment,
  generatePortfolioPdfAttachment,
  generateCertificatesPdfAttachment,
  formatEmailBodyToHtml,
} from '../../../utils/google-apps-script/generator';
import { getAcademicAttachments } from '../../../data/akademik';
import { buildIdentityDocsPdf } from '../../../utils/pdf-engine/identitas';
import { buildAwardsCompilationPdf } from '../../../utils/pdf-engine/portofolio';
import { createMailtoUrl, generateTailoredApplicationDraft } from '../../../utils/draft';
import { CustomAttachmentItem, CvDesignType, CvTextAlignType } from '../main/types';

export interface UseLamarKerjaDispatcherProps {
  isOpen: boolean;
  companyName: string;
  setCompanyName: (val: string) => void;
  jobTitle: string;
  setJobTitle: (val: string) => void;
  jobDesk: string;
  setJobDesk: (val: string) => void;
  kualifikasi: string;
  setKualifikasi: (val: string) => void;
  setShowJobDetailFields: (val: boolean) => void;
  recipientEmail: string;
  setRecipientEmail: (val: string) => void;
  ccEmail: string;
  setCcEmail: (val: string) => void;
  setShowCcField: (val: boolean) => void;
  setRecipientPhone: (val: string) => void;
  emailSubject: string;
  setEmailSubject: (val: string) => void;
  isSubjectAuto: boolean;
  setIsSubjectAuto: (val: boolean) => void;
  emailBody: string;
  setEmailBody: (val: string) => void;
  language: EmailLanguage;
  setLanguage: (val: EmailLanguage) => void;
  selectedCvPreset: string;
  setSelectedCvPreset: (val: string) => void;
  setIsPresetAuto: (val: boolean) => void;
  cvDesignPreset: CvDesignType;
  setCvDesignPreset: (val: CvDesignType) => void;
  cvHeaderColor: string;
  setCvHeaderColor: (val: string) => void;
  cvTextAlign: CvTextAlignType;
  setCvTextAlign: (val: CvTextAlignType) => void;
  coverLetterDate: string;
  setCoverLetterDate: (val: string) => void;
  isCoverLetterDateAuto: boolean;
  setIsCoverLetterDateAuto: (val: boolean) => void;
  coverLetterCity: string;
  setCoverLetterCity: (val: string) => void;
  isCoverLetterCityActive: boolean;
  setIsCoverLetterCityActive: (val: boolean) => void;
  coverLetterTextAlign: CvTextAlignType;
  setCoverLetterTextAlign: (val: CvTextAlignType) => void;
  isColorPrint: boolean;
  setIsColorPrint: (val: boolean) => void;
  isAcademicGrayscale: boolean;
  isAcademicCompressed: boolean;
  selectedIdentityIds: string[];
  setSelectedIdentityIds: (val: string[]) => void;
  isIdentityColorPrint: boolean;
  setIsIdentityColorPrint: (val: boolean) => void;
  isIdentityCompressed: boolean;
  isIdentitySeparatePhotoPrint: boolean;
  setIsIdentitySeparatePhotoPrint: (val: boolean) => void;
  isIdentityPhotoAsJpg: boolean;
  setIsIdentityPhotoAsJpg: (val: boolean) => void;
  selectedAcademicIds: string[];
  setSelectedAcademicIds: (val: string[]) => void;
  selectedPortfolioSlideIds: string[];
  setSelectedPortfolioSlideIds: (val: string[]) => void;
  isPortfolioCompressed: boolean;
  setIsPortfolioCompressed: (val: boolean) => void;
  isPortfolioGrayscale: boolean;
  setIsPortfolioGrayscale?: (val: boolean) => void;
  selectedCertIds: string[];
  setSelectedCertIds: (val: string[]) => void;
  isCertsCompressed: boolean;
  setIsCertsCompressed?: (val: boolean) => void;
  isCertsGrayscale: boolean;
  setIsCertsGrayscale?: (val: boolean) => void;
  selectedAwardIds: string[];
  setSelectedAwardIds: (val: string[]) => void;
  isAwardsCompressed: boolean;
  setIsAwardsCompressed?: (val: boolean) => void;
  isAwardsGrayscale: boolean;
  setIsAwardsGrayscale?: (val: boolean) => void;
  setIsAcademicGrayscale?: (val: boolean) => void;
  setIsAcademicCompressed?: (val: boolean) => void;
  setIsIdentityCompressed?: (val: boolean) => void;
  customAttachments: CustomAttachmentItem[];
  setCustomAttachments: React.Dispatch<React.SetStateAction<CustomAttachmentItem[]>>;
  setQuickInputText: (val: string) => void;
  setImagePreviewUrl: (val: string | null) => void;
  setIsImageExpanded: (val: boolean) => void;
  setKeyRequirements: (val: string[]) => void;
  quickInputText: string;
  keyRequirements: string[];
  effectiveCvHeaderColor: string;
}

export function useLamarKerjaDispatcher({
  isOpen,
  companyName,
  setCompanyName,
  jobTitle,
  setJobTitle,
  jobDesk,
  setJobDesk,
  kualifikasi,
  setKualifikasi,
  setShowJobDetailFields,
  recipientEmail,
  setRecipientEmail,
  ccEmail,
  setCcEmail,
  setShowCcField,
  setRecipientPhone,
  emailSubject,
  setEmailSubject,
  isSubjectAuto,
  setIsSubjectAuto,
  emailBody,
  setEmailBody,
  language,
  setLanguage,
  selectedCvPreset,
  setSelectedCvPreset,
  setIsPresetAuto,
  cvDesignPreset,
  setCvDesignPreset,
  cvHeaderColor,
  setCvHeaderColor,
  cvTextAlign,
  setCvTextAlign,
  coverLetterDate,
  setCoverLetterDate,
  isCoverLetterDateAuto,
  setIsCoverLetterDateAuto,
  coverLetterCity,
  setCoverLetterCity,
  isCoverLetterCityActive,
  setIsCoverLetterCityActive,
  coverLetterTextAlign,
  setCoverLetterTextAlign,
  isColorPrint,
  setIsColorPrint,
  isAcademicGrayscale,
  isAcademicCompressed,
  selectedIdentityIds,
  setSelectedIdentityIds,
  isIdentityColorPrint,
  setIsIdentityColorPrint,
  isIdentityCompressed,
  isIdentitySeparatePhotoPrint,
  setIsIdentitySeparatePhotoPrint,
  isIdentityPhotoAsJpg,
  setIsIdentityPhotoAsJpg,
  selectedAcademicIds,
  setSelectedAcademicIds,
  selectedPortfolioSlideIds,
  setSelectedPortfolioSlideIds,
  isPortfolioCompressed,
  setIsPortfolioCompressed,
  isPortfolioGrayscale,
  setIsPortfolioGrayscale,
  selectedCertIds,
  setSelectedCertIds,
  isCertsCompressed,
  setIsCertsCompressed,
  isCertsGrayscale,
  setIsCertsGrayscale,
  selectedAwardIds,
  setSelectedAwardIds,
  isAwardsCompressed,
  setIsAwardsCompressed,
  isAwardsGrayscale,
  setIsAwardsGrayscale,
  setIsAcademicGrayscale,
  setIsAcademicCompressed,
  setIsIdentityCompressed,
  customAttachments,
  setCustomAttachments,
  setQuickInputText,
  setImagePreviewUrl,
  setIsImageExpanded,
  setKeyRequirements,
  quickInputText,
  keyRequirements,
  effectiveCvHeaderColor,
}: UseLamarKerjaDispatcherProps) {
  const [activeDraftId, setActiveDraftId] = useState<string | null>(null);
  const [highlightDraftId, setHighlightDraftId] = useState<string | null>(null);
  const [isGasSettingsOpen, setIsGasSettingsOpen] = useState(false);
  const [isGasHistoryOpen, setIsGasHistoryOpen] = useState(false);
  const [isDraftsModalOpen, setIsDraftsModalOpen] = useState(false);
  const [draftCount, setDraftCount] = useState<number>(() => JobDraftService.getDraftCount());
  const [draftSaveFeedback, setDraftSaveFeedback] = useState(false);

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
    }
  }, [isOpen]);

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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const recipientEmails = cleanEmail
      .split(/[,;]+/)
      .map((e) => e.trim())
      .filter(Boolean);

    if (recipientEmails.length === 0) {
      return {
        valid: false,
        message: 'Email Tujuan wajib diisi.',
      };
    }

    for (const em of recipientEmails) {
      if (!emailRegex.test(em)) {
        return {
          valid: false,
          message: `Format Email Tujuan "${em}" tidak valid (contoh: hrd@perusahaan.com). Pisahkan multi-email dengan tanda titik koma (;) atau koma (,).`,
        };
      }
    }

    if (ccEmail.trim()) {
      const ccEmails = ccEmail
        .split(/[,;]+/)
        .map((e) => e.trim())
        .filter(Boolean);
      for (const cc of ccEmails) {
        if (!emailRegex.test(cc)) {
          return {
            valid: false,
            message: `Format Email CC "${cc}" tidak valid. Pisahkan multi-email dengan tanda titik koma (;) atau koma (,).`,
          };
        }
      }
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
        rawText: [quickInputText, ...(keyRequirements || [])].filter(Boolean).join(' '),
      });
      attachments.push(cvAttachment);
      setSendProgress((prev) => Math.max(prev, 35));

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

      if (selectedIdentityIds.length > 0) {
        setGasSendMsg(
          isIdentityColorPrint
            ? 'Menyusun Dokumen Identitas Resmi (KTP/NPWP/KK)...'
            : 'Menyusun Dokumen Identitas Resmi (Hitam Putih / BW)...'
        );
        const identityAttachments = await buildIdentityDocsPdf({
          selectedIds: selectedIdentityIds,
          isColorPrint: isIdentityColorPrint,
          isSeparatePhotoPrint: isIdentitySeparatePhotoPrint,
          isPhotoAsJpg: isIdentityPhotoAsJpg,
          isCompressed: isIdentityCompressed,
        });
        if (identityAttachments && identityAttachments.length > 0) {
          identityAttachments.forEach((att) => attachments.push(att));
        }
      }
      setSendProgress((prev) => Math.max(prev, 46));

      if (selectedAcademicIds.length > 0) {
        setGasSendMsg(
          selectedAcademicIds.length === 2
            ? (isAcademicGrayscale
                ? 'Menggabungkan SKL & Transkrip Nilai (Hitam Putih)...'
                : 'Menggabungkan SKL & Transkrip Nilai (Berwarna)...')
            : (isAcademicGrayscale
                ? 'Mempersiapkan Dokumen Akademik Resmi (Hitam Putih)...'
                : 'Mempersiapkan Dokumen Akademik Resmi (Berwarna)...')
        );
        const academicAttachments = await getAcademicAttachments(selectedAcademicIds, {
          isGrayscale: isAcademicGrayscale,
          isCompressed: isAcademicCompressed,
        });
        for (const academicAttachment of academicAttachments) {
          attachments.push(academicAttachment);
        }
      }
      setSendProgress((prev) => Math.max(prev, 48));

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
          isGrayscale: isPortfolioGrayscale,
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

      if (selectedCertIds.length > 0) {
        setGasSendMsg(
          isCertsCompressed
            ? 'Mengompilasi Sertifikasi PDF Terpilih Kompresi...'
            : 'Mengompilasi Sertifikasi PDF Terpilih...'
        );
        const certsAttachment = await generateCertificatesPdfAttachment({
          preset: selectedCvPreset,
          selectedCertIds: selectedCertIds,
          jobTitle,
          isCompressed: isCertsCompressed,
          isGrayscale: isCertsGrayscale,
          onProgress: (cur, tot) => {
            setGasSendMsg(`Mengompilasi Sertifikat PDF (${cur}/${tot} dokumen)...`);
          },
        });
        attachments.push(certsAttachment);
      }
      setSendProgress((prev) => Math.max(prev, 70));

      if (selectedAwardIds.length > 0) {
        setGasSendMsg('Mengompilasi Piagam Penghargaan PDF Terpilih...');
        try {
          const awardsAttachment = await buildAwardsCompilationPdf({
            selectedAwardIds,
            isCompressed: isAwardsCompressed,
            isGrayscale: isAwardsGrayscale,
            onProgress: (cur, tot) => {
              setGasSendMsg(`Mengompilasi Piagam Penghargaan (${cur}/${tot} dokumen)...`);
            },
          });
          if (awardsAttachment?.base64) {
            attachments.push({
              filename: awardsAttachment.filename || 'penghargaan-alvareza.pdf',
              mimeType: awardsAttachment.mimeType || 'application/pdf',
              base64: awardsAttachment.base64,
              sizeBytes: awardsAttachment.sizeBytes,
            });
          }
        } catch (err) {
          console.error('Gagal mengompilasi berkas penghargaan:', err);
        }
      }
      setSendProgress((prev) => Math.max(prev, 78));

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
          jobDesk: jobDesk.trim(),
          kualifikasi: kualifikasi.trim(),
          cc: ccEmail.trim() ? ccEmail.trim() : undefined,
          subject: finalSubject,
          body: plainBody,
          bodyText: plainBody,
          bodyHtml: htmlFormatted,
          senderName: 'Alvareza Hilka Pratama',
          attachments,
          attachmentNames: attachments.map((a) => a.filename),
          isCoverLetterActive: true,
          coverLetterDate: coverLetterDate,
          isCoverLetterDateAuto: isCoverLetterDateAuto,
          coverLetterCity: isCoverLetterCityActive ? coverLetterCity : '',
          isCoverLetterCityActive: isCoverLetterCityActive,
          coverLetterTextAlign: coverLetterTextAlign,
          cvDesignPreset: cvDesignPreset,
          cvHeaderColor: cvHeaderColor,
          cvTextAlign: cvTextAlign,
          selectedIdentityIds: selectedIdentityIds,
          isIdentityColorPrint: isIdentityColorPrint,
          isIdentitySeparatePhotoPrint: isIdentitySeparatePhotoPrint,
          isIdentityPhotoAsJpg: isIdentityPhotoAsJpg,
          isIdentityCompressed: isIdentityCompressed,
          selectedAcademicIds: selectedAcademicIds,
          isColorPrint: isColorPrint,
          isAcademicGrayscale: isAcademicGrayscale,
          isAcademicCompressed: isAcademicCompressed,
          selectedPortfolioSlideIds: selectedPortfolioSlideIds,
          isPortfolioCompressed: isPortfolioCompressed,
          isPortfolioGrayscale: isPortfolioGrayscale,
          selectedCertIds: selectedCertIds,
          isCertsCompressed: isCertsCompressed,
          isCertsGrayscale: isCertsGrayscale,
          selectedAwardIds: selectedAwardIds,
          isAwardsCompressed: isAwardsCompressed,
          isAwardsGrayscale: isAwardsGrayscale,
          customAttachmentNames: customAttachments.map((a) => a.name),
          presetKey: selectedCvPreset,
          language: language === 'en' ? 'en' : 'id',
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

          setQuickInputText('');
          setCompanyName('');
          setJobTitle('');
          setJobDesk('');
          setKualifikasi('');
          setRecipientEmail('');
          setCcEmail('');
          setShowCcField(false);
          setRecipientPhone('');
          setImagePreviewUrl(null);
          setKeyRequirements([]);
          setEmailSubject('');
          setSelectedCvPreset('optimal');
          setIsPresetAuto(true);
          setSelectedIdentityIds([]);
          setIsIdentityColorPrint(false);
          setSelectedAcademicIds(['skl', 'transkrip']);
          setIsColorPrint(false);
          setCoverLetterCity('');
          setIsCoverLetterCityActive(false);
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

  const handleSelectHistoryItemForEdit = (item: any) => {
    if (item.companyName) setCompanyName(item.companyName);
    if (item.jobTitle) {
      setIsPresetAuto(true);
      setJobTitle(item.jobTitle);
    }
    if (item.jobDesk) setJobDesk(item.jobDesk);
    if (item.kualifikasi) setKualifikasi(item.kualifikasi);
    if (item.jobDesk || item.kualifikasi) setShowJobDetailFields(true);
    if (item.targetEmail) setRecipientEmail(item.targetEmail);
    if (item.subject) {
      setEmailSubject(item.subject);
      setIsSubjectAuto(false);
    }
    if (item.emailBody) setEmailBody(item.emailBody);
    if (item.presetKey) setSelectedCvPreset(item.presetKey);
    if (item.language) setLanguage(item.language);
    if (item.coverLetterDate) {
      setCoverLetterDate(item.coverLetterDate);
      setIsCoverLetterDateAuto(false);
    }
    if (item.coverLetterCity) {
      setCoverLetterCity(item.coverLetterCity);
      setIsCoverLetterCityActive(true);
    }
    if (item.coverLetterTextAlign) setCoverLetterTextAlign(item.coverLetterTextAlign);
    if (item.cvDesignPreset) setCvDesignPreset(item.cvDesignPreset);
    if (item.cvHeaderColor) setCvHeaderColor(item.cvHeaderColor);
    if (item.cvTextAlign) setCvTextAlign(item.cvTextAlign);
    if (item.selectedIdentityIds) setSelectedIdentityIds(item.selectedIdentityIds);
    if (item.isIdentityColorPrint !== undefined) setIsIdentityColorPrint(item.isIdentityColorPrint);
    if (item.isIdentitySeparatePhotoPrint !== undefined) setIsIdentitySeparatePhotoPrint(item.isIdentitySeparatePhotoPrint);
    if (item.isIdentityPhotoAsJpg !== undefined) setIsIdentityPhotoAsJpg(item.isIdentityPhotoAsJpg);
    if (item.isIdentityCompressed !== undefined && setIsIdentityCompressed) setIsIdentityCompressed(item.isIdentityCompressed);
    if (item.selectedAcademicIds) setSelectedAcademicIds(item.selectedAcademicIds);
    if (item.isColorPrint !== undefined) setIsColorPrint(item.isColorPrint);
    if (item.isAcademicGrayscale !== undefined && setIsAcademicGrayscale) setIsAcademicGrayscale(item.isAcademicGrayscale);
    if (item.isAcademicCompressed !== undefined && setIsAcademicCompressed) setIsAcademicCompressed(item.isAcademicCompressed);
    if (item.selectedPortfolioSlideIds) setSelectedPortfolioSlideIds(item.selectedPortfolioSlideIds);
    if (item.isPortfolioCompressed !== undefined) setIsPortfolioCompressed(item.isPortfolioCompressed);
    if (item.isPortfolioGrayscale !== undefined && setIsPortfolioGrayscale) setIsPortfolioGrayscale(item.isPortfolioGrayscale);
    if (item.selectedCertIds) setSelectedCertIds(item.selectedCertIds);
    if (item.isCertsCompressed !== undefined && setIsCertsCompressed) setIsCertsCompressed(item.isCertsCompressed);
    if (item.isCertsGrayscale !== undefined && setIsCertsGrayscale) setIsCertsGrayscale(item.isCertsGrayscale);
    if ((item as any).selectedAwardIds) setSelectedAwardIds((item as any).selectedAwardIds);
    if (item.isAwardsCompressed !== undefined && setIsAwardsCompressed) setIsAwardsCompressed(item.isAwardsCompressed);
    if (item.isAwardsGrayscale !== undefined && setIsAwardsGrayscale) setIsAwardsGrayscale(item.isAwardsGrayscale);
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
      language: (language === 'en' ? 'en' : 'id') as any,
      presetKey: selectedCvPreset || 'optimal',
      emailOption: emailOption,
      cvDesignPreset: cvDesignPreset as any,
      cvHeaderColor: cvHeaderColor,
      cvTextAlign: cvTextAlign,
      coverLetterDate: coverLetterDate,
      isCoverLetterDateAuto: isCoverLetterDateAuto,
      coverLetterCity: coverLetterCity,
      isCoverLetterCityActive: isCoverLetterCityActive,
      coverLetterTextAlign: coverLetterTextAlign,
      isColorPrint: isColorPrint,
      isAcademicGrayscale: isAcademicGrayscale,
      isAcademicCompressed: isAcademicCompressed,
      isPortfolioCompressed: isPortfolioCompressed,
      isPortfolioGrayscale: isPortfolioGrayscale,
      selectedIdentityIds: selectedIdentityIds,
      isIdentityColorPrint: isIdentityColorPrint,
      isIdentitySeparatePhotoPrint: isIdentitySeparatePhotoPrint,
      isIdentityPhotoAsJpg: isIdentityPhotoAsJpg,
      isIdentityCompressed: isIdentityCompressed,
      selectedAcademicIds: selectedAcademicIds,
      selectedPortfolioSlideIds: selectedPortfolioSlideIds,
      selectedCertIds: selectedCertIds,
      isCertsCompressed: isCertsCompressed,
      isCertsGrayscale: isCertsGrayscale,
      selectedAwardIds: selectedAwardIds,
      isAwardsCompressed: isAwardsCompressed,
      isAwardsGrayscale: isAwardsGrayscale,
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

      setQuickInputText('');
      setCompanyName('');
      setJobTitle('');
      setJobDesk('');
      setKualifikasi('');
      setRecipientEmail('');
      setCcEmail('');
      setShowCcField(false);
      setRecipientPhone('');
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
      setSelectedIdentityIds([]);
      setIsIdentityColorPrint(false);
      setIsIdentitySeparatePhotoPrint(false);
      setIsIdentityPhotoAsJpg(true);
      if (setIsIdentityCompressed) setIsIdentityCompressed(true);
      setSelectedAcademicIds(['skl', 'transkrip']);
      setIsColorPrint(true);
      if (setIsAcademicGrayscale) setIsAcademicGrayscale(false);
      if (setIsAcademicCompressed) setIsAcademicCompressed(true);
      setIsPortfolioCompressed(true);
      if (setIsPortfolioGrayscale) setIsPortfolioGrayscale(false);
      if (setIsCertsCompressed) setIsCertsCompressed(true);
      if (setIsCertsGrayscale) setIsCertsGrayscale(false);
      if (setIsAwardsCompressed) setIsAwardsCompressed(true);
      if (setIsAwardsGrayscale) setIsAwardsGrayscale(false);
      setCustomAttachments([]);

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
    if (draft.cvDesignPreset) setCvDesignPreset(draft.cvDesignPreset);
    if (draft.cvHeaderColor) setCvHeaderColor(draft.cvHeaderColor);
    if (draft.cvTextAlign) setCvTextAlign(draft.cvTextAlign);
    if (draft.coverLetterDate) {
      setCoverLetterDate(draft.coverLetterDate);
      setIsCoverLetterDateAuto(false);
    }
    if (draft.coverLetterCity) {
      setCoverLetterCity(draft.coverLetterCity);
      setIsCoverLetterCityActive(true);
    } else {
      setCoverLetterCity('');
      setIsCoverLetterCityActive(false);
    }
    if (draft.coverLetterTextAlign) setCoverLetterTextAlign(draft.coverLetterTextAlign);
    if (draft.isColorPrint !== undefined) setIsColorPrint(draft.isColorPrint);
    if (draft.isAcademicGrayscale !== undefined && setIsAcademicGrayscale) setIsAcademicGrayscale(draft.isAcademicGrayscale);
    if (draft.isAcademicCompressed !== undefined && setIsAcademicCompressed) setIsAcademicCompressed(draft.isAcademicCompressed);
    if (draft.isPortfolioCompressed !== undefined) setIsPortfolioCompressed(draft.isPortfolioCompressed);
    if (draft.isPortfolioGrayscale !== undefined && setIsPortfolioGrayscale) setIsPortfolioGrayscale(draft.isPortfolioGrayscale);
    if (draft.selectedIdentityIds) setSelectedIdentityIds(draft.selectedIdentityIds);
    if (draft.isIdentityColorPrint !== undefined) setIsIdentityColorPrint(draft.isIdentityColorPrint);
    if (draft.isIdentitySeparatePhotoPrint !== undefined) setIsIdentitySeparatePhotoPrint(draft.isIdentitySeparatePhotoPrint);
    if (draft.isIdentityPhotoAsJpg !== undefined) setIsIdentityPhotoAsJpg(draft.isIdentityPhotoAsJpg);
    if (draft.isIdentityCompressed !== undefined && setIsIdentityCompressed) setIsIdentityCompressed(draft.isIdentityCompressed);
    if (draft.selectedAcademicIds) setSelectedAcademicIds(draft.selectedAcademicIds);
    if (draft.selectedPortfolioSlideIds) setSelectedPortfolioSlideIds(draft.selectedPortfolioSlideIds);
    if (draft.selectedCertIds) setSelectedCertIds(draft.selectedCertIds);
    if (draft.isCertsCompressed !== undefined && setIsCertsCompressed) setIsCertsCompressed(draft.isCertsCompressed);
    if (draft.isCertsGrayscale !== undefined && setIsCertsGrayscale) setIsCertsGrayscale(draft.isCertsGrayscale);
    if ((draft as any).selectedAwardIds) setSelectedAwardIds((draft as any).selectedAwardIds);
    if (draft.isAwardsCompressed !== undefined && setIsAwardsCompressed) setIsAwardsCompressed(draft.isAwardsCompressed);
    if (draft.isAwardsGrayscale !== undefined && setIsAwardsGrayscale) setIsAwardsGrayscale(draft.isAwardsGrayscale);
    setIsDraftsModalOpen(false);
  };

  const handleDeleteDraft = (draftId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    JobDraftService.deleteDraft(draftId);
    setDraftCount(JobDraftService.getDraftCount());
    if (activeDraftId === draftId) {
      setActiveDraftId(null);
    }
  };

  return {
    activeDraftId,
    setActiveDraftId,
    highlightDraftId,
    setHighlightDraftId,
    isGasSettingsOpen,
    setIsGasSettingsOpen,
    isGasHistoryOpen,
    setIsGasHistoryOpen,
    isDraftsModalOpen,
    setIsDraftsModalOpen,
    draftCount,
    setDraftCount,
    draftSaveFeedback,
    setDraftSaveFeedback,
    activeSenderInfo,
    setActiveSenderInfo,
    gasSendState,
    setGasSendState,
    gasSendMsg,
    setGasSendMsg,
    sendProgress,
    setSendProgress,
    sendingSenderEmail,
    setSendingSenderEmail,
    lastSentAccount,
    setLastSentAccount,
    emailOption,
    setEmailOption,
    gasAccounts,
    setGasAccounts,
    refreshSenderInfo,
    handleEmailOptionChange,
    resolvedApplicantEmail,
    validateMandatoryFields,
    handleOpenMailClient,
    handleSendViaGas,
    handleSelectHistoryItemForEdit,
    handleSaveToDraft,
    handleLoadDraftForEdit,
    handleDeleteDraft,
  };
}

export type LamarKerjaDispatcherResult = ReturnType<typeof useLamarKerjaDispatcher>;
