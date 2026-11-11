import React, { useEffect, useRef, useMemo, useCallback, useState } from 'react';
import { matchPresetFromJobTitle } from '../../../data/preset/config/konfigurasi-peran';
import { detectDominantLanguage } from '../../../data/position-detektor/config';
import { JobDraftService } from '../../../services/jobDraftService';
import { EmailLanguage } from '../../../types/jobApplication';
import { parseJobTextHeuristically, generateTailoredApplicationDraft } from '../../../utils/draft';
import { useScrollLock } from '../../../utils/scrollLock';
import { getAdaptivePortfolioSlides, getActiveCertificateList } from '../../../utils/pdf-engine/portofolio';
import { useLamarKerjaState } from './use-state';
import { useLamarKerjaAttachments } from './use-attachments';
import { useLamarKerjaPreview } from './use-preview';
import { useLamarKerjaDispatcher } from './use-dispatcher';
import { ModalSheetProps } from './container';
import { ActiveModalView } from './router-modal';

export type LamarKerjaFlowProps = ModalSheetProps;

export function useLamarKerjaFlow(props: LamarKerjaFlowProps) {
  const {
    isOpen,
    cvItems,
  } = props;

  // 1. State Sub-hook
  const state = useLamarKerjaState();

  // 2. Attachments Sub-hook
  const attachments = useLamarKerjaAttachments({
    jobTitle: state.jobTitle,
    debouncedJobTitle: state.debouncedJobTitle,
    cvItems,
  });

  // 3. Dispatcher & Drafts Sub-hook
  const dispatcher = useLamarKerjaDispatcher({
    isOpen,
    companyName: state.companyName,
    setCompanyName: state.setCompanyName,
    jobTitle: state.jobTitle,
    setJobTitle: state.setJobTitle,
    jobDesk: state.jobDesk,
    setJobDesk: state.setJobDesk,
    kualifikasi: state.kualifikasi,
    setKualifikasi: state.setKualifikasi,
    setShowJobDetailFields: state.setShowJobDetailFields,
    recipientEmail: state.recipientEmail,
    setRecipientEmail: state.setRecipientEmail,
    ccEmail: state.ccEmail,
    setCcEmail: state.setCcEmail,
    setShowCcField: state.setShowCcField,
    setRecipientPhone: state.setRecipientPhone,
    emailSubject: state.emailSubject,
    setEmailSubject: state.setEmailSubject,
    isSubjectAuto: state.isSubjectAuto,
    setIsSubjectAuto: state.setIsSubjectAuto,
    emailBody: state.emailBody,
    setEmailBody: state.setEmailBody,
    language: state.language,
    setLanguage: state.setLanguage,
    selectedCvPreset: attachments.selectedCvPreset,
    setSelectedCvPreset: attachments.setSelectedCvPreset,
    setIsPresetAuto: attachments.setIsPresetAuto,
    cvDesignPreset: attachments.cvDesignPreset,
    setCvDesignPreset: attachments.setCvDesignPreset,
    cvHeaderColor: attachments.cvHeaderColor,
    setCvHeaderColor: attachments.setCvHeaderColor,
    cvTextAlign: attachments.cvTextAlign,
    setCvTextAlign: attachments.setCvTextAlign,
    coverLetterDate: attachments.coverLetterDate,
    setCoverLetterDate: attachments.setCoverLetterDate,
    isCoverLetterDateAuto: attachments.isCoverLetterDateAuto,
    setIsCoverLetterDateAuto: attachments.setIsCoverLetterDateAuto,
    coverLetterCity: attachments.coverLetterCity,
    setCoverLetterCity: attachments.setCoverLetterCity,
    isCoverLetterCityActive: attachments.isCoverLetterCityActive,
    setIsCoverLetterCityActive: attachments.setIsCoverLetterCityActive,
    coverLetterTextAlign: attachments.coverLetterTextAlign,
    setCoverLetterTextAlign: attachments.setCoverLetterTextAlign,
    isColorPrint: attachments.isColorPrint,
    setIsColorPrint: attachments.setIsColorPrint,
    isAcademicGrayscale: attachments.isAcademicGrayscale,
    isAcademicCompressed: attachments.isAcademicCompressed,
    selectedIdentityIds: attachments.selectedIdentityIds,
    setSelectedIdentityIds: attachments.setSelectedIdentityIds,
    isIdentityColorPrint: attachments.isIdentityColorPrint,
    setIsIdentityColorPrint: attachments.setIsIdentityColorPrint,
    isIdentityCompressed: attachments.isIdentityCompressed,
    isIdentitySeparatePhotoPrint: attachments.isIdentitySeparatePhotoPrint,
    setIsIdentitySeparatePhotoPrint: attachments.setIsIdentitySeparatePhotoPrint,
    isIdentityPhotoAsJpg: attachments.isIdentityPhotoAsJpg,
    setIsIdentityPhotoAsJpg: attachments.setIsIdentityPhotoAsJpg,
    selectedAcademicIds: attachments.selectedAcademicIds,
    setSelectedAcademicIds: attachments.setSelectedAcademicIds,
    selectedPortfolioSlideIds: attachments.selectedPortfolioSlideIds,
    setSelectedPortfolioSlideIds: attachments.setSelectedPortfolioSlideIds,
    isPortfolioCompressed: attachments.isPortfolioCompressed,
    setIsPortfolioCompressed: attachments.setIsPortfolioCompressed,
    isPortfolioGrayscale: attachments.isPortfolioGrayscale,
    setIsPortfolioGrayscale: attachments.setIsPortfolioGrayscale,
    selectedCertIds: attachments.selectedCertIds,
    setSelectedCertIds: attachments.setSelectedCertIds,
    isCertsCompressed: attachments.isCertsCompressed,
    setIsCertsCompressed: attachments.setIsCertsCompressed,
    isCertsGrayscale: attachments.isCertsGrayscale,
    setIsCertsGrayscale: attachments.setIsCertsGrayscale,
    selectedAwardIds: attachments.selectedAwardIds,
    setSelectedAwardIds: attachments.setSelectedAwardIds,
    isAwardsCompressed: attachments.isAwardsCompressed,
    setIsAwardsCompressed: attachments.setIsAwardsCompressed,
    isAwardsGrayscale: attachments.isAwardsGrayscale,
    setIsAwardsGrayscale: attachments.setIsAwardsGrayscale,
    setIsAcademicGrayscale: attachments.setIsAcademicGrayscale,
    setIsAcademicCompressed: attachments.setIsAcademicCompressed,
    setIsIdentityCompressed: attachments.setIsIdentityCompressed,
    customAttachments: attachments.customAttachments,
    setCustomAttachments: attachments.setCustomAttachments,
    setQuickInputText: state.setQuickInputText,
    setImagePreviewUrl: state.setImagePreviewUrl,
    setIsImageExpanded: state.setIsImageExpanded,
    setKeyRequirements: state.setKeyRequirements,
    quickInputText: state.quickInputText,
    keyRequirements: state.keyRequirements,
    effectiveCvHeaderColor: attachments.effectiveCvHeaderColor,
  });

  // 4. Preview Sub-hook
  const preview = useLamarKerjaPreview({
    selectedCvPreset: attachments.selectedCvPreset,
    language: state.language,
    jobTitle: state.jobTitle,
    companyName: state.companyName,
    effectiveCvHeaderColor: attachments.effectiveCvHeaderColor,
    cvDesignPreset: attachments.cvDesignPreset,
    cvTextAlign: attachments.cvTextAlign,
    coverLetterDate: attachments.coverLetterDate,
    isCoverLetterCityActive: attachments.isCoverLetterCityActive,
    coverLetterCity: attachments.coverLetterCity,
    coverLetterTextAlign: attachments.coverLetterTextAlign,
    resolvedApplicantEmail: dispatcher.resolvedApplicantEmail,
    jobDesk: state.jobDesk,
    kualifikasi: state.kualifikasi,
    quickInputText: state.quickInputText,
    keyRequirements: state.keyRequirements,
    selectedIdentityIds: attachments.selectedIdentityIds,
    isIdentityColorPrint: attachments.isIdentityColorPrint,
    isIdentitySeparatePhotoPrint: attachments.isIdentitySeparatePhotoPrint,
    isIdentityPhotoAsJpg: attachments.isIdentityPhotoAsJpg,
    isIdentityCompressed: attachments.isIdentityCompressed,
    selectedAcademicIds: attachments.selectedAcademicIds,
    isAcademicGrayscale: attachments.isAcademicGrayscale,
    isAcademicCompressed: attachments.isAcademicCompressed,
    selectedPortfolioSlideIds: attachments.selectedPortfolioSlideIds,
    isPortfolioCompressed: attachments.isPortfolioCompressed,
    isPortfolioGrayscale: attachments.isPortfolioGrayscale,
    selectedCertIds: attachments.selectedCertIds,
    isCertsCompressed: attachments.isCertsCompressed,
    isCertsGrayscale: attachments.isCertsGrayscale,
    selectedAwardIds: attachments.selectedAwardIds,
    isAwardsCompressed: attachments.isAwardsCompressed,
    isAwardsGrayscale: attachments.isAwardsGrayscale,
  });

  // Additional Helper States & References
  const [isResettingAll, setIsResettingAll] = useState<boolean>(false);
  const [isLangAuto, setIsLangAuto] = useState<boolean>(true);

  useScrollLock(isOpen, 'job-apply-modal');

  const activeEditingDraft = useMemo(() => {
    if (!dispatcher.activeDraftId) return null;
    const drafts = JobDraftService.getDrafts();
    return drafts.find((d) => d.id === dispatcher.activeDraftId) || null;
  }, [dispatcher.activeDraftId]);

  // Initialize default application draft if body is empty
  useEffect(() => {
    if (!state.emailBody) {
      const draft = generateTailoredApplicationDraft({
        companyName: state.companyName || '',
        jobTitle: state.jobTitle || '',
        recipientEmail: state.recipientEmail || '',
        keyRequirements: [],
        tone: 'concise',
        language: state.language || 'in',
      });
      state.setEmailBody(draft.emailBody);
    }
  }, []);

  // Quick pasted text change handler
  const handleQuickTextChange = (text: string) => {
    state.setQuickInputText(text);
    attachments.setIsPresetAuto(true);
    if (!text.trim()) {
      state.setCompanyName('');
      state.setJobTitle('');
      state.setJobDesk('');
      state.setKualifikasi('');
      state.setKeyRequirements([]);
      attachments.setSelectedCvPreset('optimal');
      state.setRecipientEmail('');
      state.setCcEmail('');
      state.setShowCcField(false);
      state.setRecipientPhone('');
      if (!state.isSubjectAuto) {
        state.setEmailSubject('');
      }
      return;
    }

    if (text.includes(',')) {
      const parts = text.split(',').map((p) => p.trim());
      const comp = parts[0] || '';
      const pos = parts[1] || '';
      const rawPrimaryEmail = parts[2] || '';
      const fourth = parts[3] || '';
      const fifth = parts[4] || '';

      const formatEmailList = (raw: string): string => {
        if (!raw) return '';
        return raw
          .split(/[,;]+/)
          .map((e) => e.trim())
          .filter(Boolean)
          .join(', ');
      };

      if (comp) state.setCompanyName(comp);
      if (pos) {
        state.setJobTitle(pos);
        const matchedComma = matchPresetFromJobTitle({
          jobTitle: pos,
          jobDesk: state.jobDesk,
          kualifikasi: state.kualifikasi,
        });
        if (matchedComma && matchedComma.key) {
          attachments.setSelectedCvPreset(matchedComma.key);
        }
      }

      if (rawPrimaryEmail) {
        state.setRecipientEmail(formatEmailList(rawPrimaryEmail));
      }

      let cc = '';
      let subj = '';

      if (fourth) {
        if (fourth.includes('@')) {
          cc = formatEmailList(fourth);
          if (fifth) subj = fifth;
        } else {
          subj = fourth;
          if (fifth && fifth.includes('@')) {
            cc = formatEmailList(fifth);
          }
        }
      }

      if (cc) {
        state.setCcEmail(cc);
        state.setShowCcField(true);
      } else {
        state.setCcEmail('');
        state.setShowCcField(false);
      }

      if (subj) {
        state.setEmailSubject(subj);
        state.setIsSubjectAuto(false);
      } else if (state.isSubjectAuto) {
        const cleanTitle = (pos || '').trim();
        const cleanComp = (comp || '').trim();
        if (cleanTitle && cleanComp) {
          state.setEmailSubject(`${cleanTitle} - ${cleanComp} - Alvareza Hilka Pratama`);
        } else if (cleanTitle) {
          state.setEmailSubject(`${cleanTitle} - Alvareza Hilka Pratama`);
        } else {
          state.setEmailSubject('Lamaran Pekerjaan - Alvareza Hilka Pratama');
        }
      }

      const validated = parseJobTextHeuristically(text);
      if (validated.emailBody) state.setEmailBody(validated.emailBody);
      return;
    }

    const validated = parseJobTextHeuristically(text);

    state.setCompanyName(validated.companyName);
    state.setJobTitle(validated.jobTitle);
    state.setRecipientEmail(validated.recipientEmail);
    if (validated.recipientPhone) state.setRecipientPhone(validated.recipientPhone);
    if (validated.keyRequirements && validated.keyRequirements.length > 0) {
      state.setKeyRequirements(validated.keyRequirements);
    }
    state.setLanguage(validated.language);

    const matchedQuick = matchPresetFromJobTitle({
      jobTitle: validated.jobTitle || '',
      jobDesk: state.jobDesk,
      kualifikasi: state.kualifikasi,
      rawText: [...(validated.keyRequirements || []), text].filter(Boolean).join('\n'),
    });
    if (matchedQuick && matchedQuick.key) {
      attachments.setSelectedCvPreset(matchedQuick.key);
    }

    if (validated.emailSubject) {
      state.setEmailSubject(validated.emailSubject);
    } else if (state.isSubjectAuto) {
      const cleanTitle = (validated.jobTitle || '').trim();
      state.setEmailSubject(cleanTitle ? `${cleanTitle} - Alvareza` : (validated.emailSubject || ''));
    } else {
      state.setEmailSubject('');
    }

    if (validated.emailBody) state.setEmailBody(validated.emailBody);
  };



  // Auto-sync ATS CV Preset berdasarkan perbandingan 50% Posisi & 50% Detail Posisi
  useEffect(() => {
    if (!attachments.isPresetAuto) return;

    const hasExplicitDetail = Boolean(state.debouncedJobDesk.trim() || state.debouncedKualifikasi.trim());
    const fallbackDetail =
      !hasExplicitDetail && state.keyRequirements.length > 0 ? state.keyRequirements.join('\n') : '';

    if (state.debouncedJobTitle.trim() || hasExplicitDetail || fallbackDetail) {
      const matched = matchPresetFromJobTitle({
        jobTitle: state.debouncedJobTitle,
        jobDesk: state.debouncedJobDesk,
        kualifikasi: state.debouncedKualifikasi,
        rawText: fallbackDetail || undefined,
      });
      if (matched && matched.key) {
        attachments.setSelectedCvPreset((prev) => (prev === matched.key ? prev : matched.key));
      }
    } else {
      attachments.setSelectedCvPreset((prev) => (prev === 'optimal' ? prev : 'optimal'));
    }
  }, [state.debouncedJobTitle, state.debouncedJobDesk, state.debouncedKualifikasi, state.keyRequirements, attachments.isPresetAuto]);

  // Auto rotasi bahasa CV ke English jika jobdesk/kualifikasi dominan bahasa Inggris
  useEffect(() => {
    if (!isLangAuto || dispatcher.activeDraftId) return;
    if (state.debouncedJobTitle || state.debouncedJobDesk || state.debouncedKualifikasi) {
      const dominantLang = detectDominantLanguage(state.debouncedJobDesk, state.debouncedKualifikasi, state.debouncedJobTitle);
      state.setLanguage((prevLang) => {
        if (dominantLang !== prevLang) {
          state.setGlobalLanguage(dominantLang);
          return dominantLang;
        }
        return prevLang;
      });
    }
  }, [state.debouncedJobTitle, state.debouncedJobDesk, state.debouncedKualifikasi, dispatcher.activeDraftId, isLangAuto, state.setGlobalLanguage]);

  // Reset all fields to auto recommendations
  const handleResetAllToAuto = useCallback(() => {
    if (isResettingAll) return;
    setIsResettingAll(true);
    setTimeout(() => setIsResettingAll(false), 600);

    let autoPreset = 'optimal';
    if (state.jobTitle || state.jobDesk || state.kualifikasi || state.quickInputText) {
      const matched = matchPresetFromJobTitle({
        jobTitle: state.jobTitle,
        jobDesk: state.jobDesk,
        kualifikasi: state.kualifikasi,
      });
      if (matched && matched.key) {
        autoPreset = matched.key;
      }
    }
    attachments.setSelectedCvPreset(autoPreset);
    attachments.setIsPresetAuto(true);

    const dominantLang: EmailLanguage = detectDominantLanguage(state.jobDesk, state.kualifikasi, state.jobTitle);
    state.setLanguage(dominantLang);
    state.setGlobalLanguage(dominantLang);
    setIsLangAuto(true);

    attachments.setCvHeaderColor('#0062E3');
    attachments.setCvTextAlign('left');
    attachments.setCvDesignPreset('block');

    const cleanTitle = state.jobTitle.trim();
    if (cleanTitle) {
      state.setEmailSubject(`${cleanTitle} - Alvareza Hilka Pratama`);
    } else {
      state.setEmailSubject('');
    }
    state.setIsSubjectAuto(true);

    const combinedReqs = [
      ...state.keyRequirements,
      ...(state.kualifikasi ? state.kualifikasi.split(/[\n,;]+/).map((s) => s.trim()).filter((s) => s.length > 3) : []),
      ...(state.jobDesk ? state.jobDesk.split(/[\n,;]+/).map((s) => s.trim()).filter((s) => s.length > 3) : []),
    ];
    const draft = generateTailoredApplicationDraft({
      companyName: state.companyName.trim(),
      jobTitle: state.jobTitle.trim(),
      recipientEmail: state.recipientEmail.trim() || 'recruitment@perusahaan.com',
      keyRequirements: combinedReqs,
      tone: 'concise',
      language: dominantLang,
      presetKey: autoPreset,
    });
    state.setEmailBody(draft.emailBody);

    const recSlides = getAdaptivePortfolioSlides(autoPreset, {
      jobTitle: state.jobTitle,
    }).map((s) => s.id);
    attachments.setSelectedPortfolioSlideIds(recSlides);

    const recCerts = getActiveCertificateList(autoPreset).map((c) => c.id);
    attachments.setSelectedCertIds(recCerts);

    const allContextText = `${state.jobTitle} ${state.jobDesk} ${state.kualifikasi} ${state.quickInputText}`.toLowerCase();
    const mentionsAcademic = /transkrip|ijazah|skl|surat keterangan lulus|ipk|akademik/i.test(allContextText);
    if (mentionsAcademic) {
      attachments.setSelectedAcademicIds(['skl', 'transkrip']);
    } else {
      attachments.setSelectedAcademicIds([]);
    }

    attachments.setCoverLetterDate(new Date().toISOString().slice(0, 10));
    attachments.setIsCoverLetterDateAuto(true);
    attachments.setCoverLetterCity('');
    attachments.setIsCoverLetterCityActive(false);
    attachments.setCoverLetterTextAlign('justify');
    attachments.setIsPortfolioCompressed(false);
  }, [
    isResettingAll,
    state.jobTitle,
    state.jobDesk,
    state.kualifikasi,
    state.companyName,
    state.recipientEmail,
    state.keyRequirements,
    state.quickInputText,
    state.setGlobalLanguage,
  ]);

  const handleResetCvToAuto = handleResetAllToAuto;

  // Sync subject when isSubjectAuto is enabled
  useEffect(() => {
    if (state.isSubjectAuto) {
      const cleanTitle = state.jobTitle.trim();
      const cleanComp = state.companyName.trim();
      if (cleanTitle && cleanComp) {
        state.setEmailSubject(`${cleanTitle} - ${cleanComp} - Alvareza Hilka Pratama`);
      } else if (cleanTitle) {
        state.setEmailSubject(`${cleanTitle} - Alvareza Hilka Pratama`);
      } else if (cleanComp) {
        state.setEmailSubject(`Lamaran Pekerjaan - ${cleanComp} - Alvareza Hilka Pratama`);
      } else {
        state.setEmailSubject('');
      }
    }
  }, [state.isSubjectAuto, state.jobTitle, state.companyName]);

  // Sync email body when preset or language or company/job changes
  useEffect(() => {
    if (!dispatcher.activeDraftId) {
      const combinedReqs = [
        ...state.keyRequirements,
        ...(state.debouncedKualifikasi
          ? state.debouncedKualifikasi.split(/[\n,;]+/).map((s) => s.trim()).filter((s) => s.length > 3)
          : []),
        ...(state.debouncedJobDesk
          ? state.debouncedJobDesk.split(/[\n,;]+/).map((s) => s.trim()).filter((s) => s.length > 3)
          : []),
      ];
      const draft = generateTailoredApplicationDraft({
        companyName: state.debouncedCompanyName.trim(),
        jobTitle: state.debouncedJobTitle.trim(),
        recipientEmail: state.recipientEmail.trim() || 'recruitment@perusahaan.com',
        keyRequirements: combinedReqs,
        tone: 'concise',
        language: state.language,
        presetKey: attachments.selectedCvPreset,
      });
      state.setEmailBody(draft.emailBody);
    }
  }, [
    attachments.selectedCvPreset,
    state.language,
    state.debouncedJobTitle,
    state.debouncedJobDesk,
    state.debouncedKualifikasi,
    state.debouncedCompanyName,
    state.keyRequirements,
    dispatcher.activeDraftId,
  ]);

  const handleSetLanguage = useCallback(
    (newLang: EmailLanguage) => {
      setIsLangAuto(false);
      state.setLanguage(newLang);
      state.setGlobalLanguage(newLang === 'id' ? 'in' : newLang);
    },
    [state.setGlobalLanguage]
  );

  const handleToggleLanguage = () => {
    const nextLang: EmailLanguage = state.language === 'in' ? 'en' : 'in';
    setIsLangAuto(false);
    state.setLanguage(nextLang);
    state.setGlobalLanguage(nextLang);
    const draft = generateTailoredApplicationDraft({
      companyName: state.companyName.trim(),
      jobTitle: state.jobTitle.trim(),
      recipientEmail: state.recipientEmail.trim() || 'recruitment@perusahaan.com',
      keyRequirements: state.keyRequirements,
      tone: 'concise',
      language: nextLang,
      presetKey: attachments.selectedCvPreset,
    });
    state.setEmailBody(draft.emailBody);
  };

  const activeModalView = useMemo<ActiveModalView>(() => {
    if (!isOpen) return null;
    if (dispatcher.isGasSettingsOpen) return 'settings';
    if (dispatcher.isGasHistoryOpen) return 'history';
    if (dispatcher.isDraftsModalOpen) return 'drafts';
    if (preview.activePreviewModal === 'cv') return 'preview-cv';
    if (preview.activePreviewModal === 'surat-lamaran') return 'preview-surat-lamaran';
    if (preview.activePreviewModal === 'identitas') return 'preview-identitas';
    if (preview.activePreviewModal === 'akademik') return 'preview-akademik';
    if (preview.activePreviewModal === 'portofolio') return 'preview-portfolio';
    if (preview.activePreviewModal === 'sertifikasi') return 'preview-certs';
    if (preview.activePreviewModal === 'penghargaan') return 'preview-awards';
    if (preview.activeDownloadSection !== null) return 'download-section';
    return 'apply';
  }, [
    isOpen,
    dispatcher.isGasSettingsOpen,
    dispatcher.isGasHistoryOpen,
    dispatcher.isDraftsModalOpen,
    preview.activePreviewModal,
    preview.activeDownloadSection,
  ]);

  // Single unified return contract matching 100% of original useLamarKerjaFlow hook
  return {
    quickInputText: state.quickInputText,
    setQuickInputText: state.setQuickInputText,
    imagePreviewUrl: state.imagePreviewUrl,
    companyName: state.companyName,
    setCompanyName: state.setCompanyName,
    jobTitle: state.jobTitle,
    setJobTitle: state.setJobTitle,
    recipientEmail: state.recipientEmail,
    setRecipientEmail: state.setRecipientEmail,
    ccEmail: state.ccEmail,
    setCcEmail: state.setCcEmail,
    showCcField: state.showCcField,
    setShowCcField: state.setShowCcField,
    recipientPhone: state.recipientPhone,
    setRecipientPhone: state.setRecipientPhone,
    emailSubject: state.emailSubject,
    setEmailSubject: state.setEmailSubject,
    isSubjectAuto: state.isSubjectAuto,
    setIsSubjectAuto: state.setIsSubjectAuto,
    emailBody: state.emailBody,
    setEmailBody: state.setEmailBody,
    isEmailBodyExpanded: state.isEmailBodyExpanded,
    setIsEmailBodyExpanded: state.setIsEmailBodyExpanded,
    language: state.language,
    setLanguage: state.setLanguage,
    cvDesignPreset: attachments.cvDesignPreset,
    setCvDesignPreset: attachments.setCvDesignPreset,
    cvHeaderColor: attachments.cvHeaderColor,
    setCvHeaderColor: attachments.setCvHeaderColor,
    effectiveCvHeaderColor: attachments.effectiveCvHeaderColor,
    cvTextAlign: attachments.cvTextAlign,
    setCvTextAlign: attachments.setCvTextAlign,
    coverLetterTextAlign: attachments.coverLetterTextAlign,
    setCoverLetterTextAlign: attachments.setCoverLetterTextAlign,
    showCvBreakdown: attachments.showCvBreakdown,
    setShowCvBreakdown: attachments.setShowCvBreakdown,
    activeDraftId: dispatcher.activeDraftId,
    setActiveDraftId: dispatcher.setActiveDraftId,
    highlightDraftId: dispatcher.highlightDraftId,
    keyRequirements: state.keyRequirements,
    setKeyRequirements: state.setKeyRequirements,
    jobDesk: state.jobDesk,
    setJobDesk: state.setJobDesk,
    kualifikasi: state.kualifikasi,
    setKualifikasi: state.setKualifikasi,
    showJobDetailFields: state.showJobDetailFields,
    setShowJobDetailFields: state.setShowJobDetailFields,
    isDropOver: state.isDropOver,
    setIsDropOver: state.setIsDropOver,
    isImageExpanded: state.isImageExpanded,
    setIsImageExpanded: state.setIsImageExpanded,
    copiedSubject: state.copiedSubject,
    copiedBody: state.copiedBody,
    copiedAll: state.copiedAll,
    copiedEmail: state.copiedEmail,
    copiedCc: state.copiedCc,
    isGasSettingsOpen: dispatcher.isGasSettingsOpen,
    setIsGasSettingsOpen: dispatcher.setIsGasSettingsOpen,
    isGasHistoryOpen: dispatcher.isGasHistoryOpen,
    setIsGasHistoryOpen: dispatcher.setIsGasHistoryOpen,
    isDraftsModalOpen: dispatcher.isDraftsModalOpen,
    setIsDraftsModalOpen: dispatcher.setIsDraftsModalOpen,
    activePreviewModal: preview.activePreviewModal,
    setActivePreviewModal: preview.setActivePreviewModal,
    activeDownloadSection: preview.activeDownloadSection,
    setActiveDownloadSection: preview.setActiveDownloadSection,
    handleOpenSectionDownload: preview.handleOpenSectionDownload,
    coverLetterDate: attachments.coverLetterDate,
    setCoverLetterDate: attachments.setCoverLetterDate,
    isCoverLetterDateAuto: attachments.isCoverLetterDateAuto,
    setIsCoverLetterDateAuto: attachments.setIsCoverLetterDateAuto,
    coverLetterCity: attachments.coverLetterCity,
    setCoverLetterCity: attachments.setCoverLetterCity,
    isCoverLetterCityActive: attachments.isCoverLetterCityActive,
    setIsCoverLetterCityActive: attachments.setIsCoverLetterCityActive,
    showCoverLetterBreakdown: attachments.showCoverLetterBreakdown,
    setShowCoverLetterBreakdown: attachments.setShowCoverLetterBreakdown,
    isPreviewingCoverLetter: preview.isPreviewingCoverLetter,
    draftCount: dispatcher.draftCount,
    draftSaveFeedback: dispatcher.draftSaveFeedback,
    selectedIdentityIds: attachments.selectedIdentityIds,
    setSelectedIdentityIds: attachments.setSelectedIdentityIds,
    isIdentityColorPrint: attachments.isIdentityColorPrint,
    setIsIdentityColorPrint: attachments.setIsIdentityColorPrint,
    isIdentityCompressed: attachments.isIdentityCompressed,
    setIsIdentityCompressed: attachments.setIsIdentityCompressed,
    isIdentitySeparatePhotoPrint: attachments.isIdentitySeparatePhotoPrint,
    setIsIdentitySeparatePhotoPrint: attachments.setIsIdentitySeparatePhotoPrint,
    isIdentityPhotoAsJpg: attachments.isIdentityPhotoAsJpg,
    setIsIdentityPhotoAsJpg: attachments.setIsIdentityPhotoAsJpg,
    showIdentityBreakdown: attachments.showIdentityBreakdown,
    setShowIdentityBreakdown: attachments.setShowIdentityBreakdown,
    isPreviewingIdentity: preview.isPreviewingIdentity,
    selectedAcademicIds: attachments.selectedAcademicIds,
    setSelectedAcademicIds: attachments.setSelectedAcademicIds,
    isColorPrint: attachments.isColorPrint,
    setIsColorPrint: attachments.setIsColorPrint,
    isAcademicGrayscale: attachments.isAcademicGrayscale,
    setIsAcademicGrayscale: attachments.setIsAcademicGrayscale,
    isAcademicCompressed: attachments.isAcademicCompressed,
    setIsAcademicCompressed: attachments.setIsAcademicCompressed,
    showAcademicBreakdown: attachments.showAcademicBreakdown,
    setShowAcademicBreakdown: attachments.setShowAcademicBreakdown,
    isPreviewingAcademic: preview.isPreviewingAcademic,
    isPreviewingPortfolio: preview.isPreviewingPortfolio,
    isPreviewingCerts: preview.isPreviewingCerts,
    showPortfolioBreakdown: attachments.showPortfolioBreakdown,
    setShowPortfolioBreakdown: attachments.setShowPortfolioBreakdown,
    isPortfolioCompressed: attachments.isPortfolioCompressed,
    setIsPortfolioCompressed: attachments.setIsPortfolioCompressed,
    isPortfolioGrayscale: attachments.isPortfolioGrayscale,
    setIsPortfolioGrayscale: attachments.setIsPortfolioGrayscale,
    showCertsBreakdown: attachments.showCertsBreakdown,
    setShowCertsBreakdown: attachments.setShowCertsBreakdown,
    isCertsGrayscale: attachments.isCertsGrayscale,
    setIsCertsGrayscale: attachments.setIsCertsGrayscale,
    isCertsCompressed: attachments.isCertsCompressed,
    setIsCertsCompressed: attachments.setIsCertsCompressed,
    selectedCvPreset: attachments.selectedCvPreset,
    setSelectedCvPreset: attachments.setSelectedCvPreset,
    isPresetAuto: attachments.isPresetAuto,
    setIsPresetAuto: attachments.setIsPresetAuto,
    recommendedPortfolioSlideIds: attachments.recommendedPortfolioSlideIds,
    recommendedCertIds: attachments.recommendedCertIds,
    selectedPortfolioSlideIds: attachments.selectedPortfolioSlideIds,
    setSelectedPortfolioSlideIds: attachments.setSelectedPortfolioSlideIds,
    selectedCertIds: attachments.selectedCertIds,
    setSelectedCertIds: attachments.setSelectedCertIds,
    defaultAwardIds: attachments.defaultAwardIds,
    selectedAwardIds: attachments.selectedAwardIds,
    setSelectedAwardIds: attachments.setSelectedAwardIds,
    showAwardsBreakdown: attachments.showAwardsBreakdown,
    setShowAwardsBreakdown: attachments.setShowAwardsBreakdown,
    isAwardsGrayscale: attachments.isAwardsGrayscale,
    setIsAwardsGrayscale: attachments.setIsAwardsGrayscale,
    isAwardsCompressed: attachments.isAwardsCompressed,
    setIsAwardsCompressed: attachments.setIsAwardsCompressed,
    isPreviewingAwards: preview.isPreviewingAwards,
    activeSenderInfo: dispatcher.activeSenderInfo,
    gasSendState: dispatcher.gasSendState,
    gasSendMsg: dispatcher.gasSendMsg,
    sendProgress: dispatcher.sendProgress,
    sendingSenderEmail: dispatcher.sendingSenderEmail,
    lastSentAccount: dispatcher.lastSentAccount,
    emailOption: dispatcher.emailOption,
    gasAccounts: dispatcher.gasAccounts,
    activeEditingDraft,
    customAttachments: attachments.customAttachments,
    isAttachmentDropOver: attachments.isAttachmentDropOver,
    setIsAttachmentDropOver: attachments.setIsAttachmentDropOver,
    attachmentInputRef: attachments.attachmentInputRef,
    handleEmailOptionChange: dispatcher.handleEmailOptionChange,
    handleQuickTextChange,
    handleCopy: state.handleCopy,
    handleSetLanguage,
    handleToggleLanguage,
    handleOpenMailClient: dispatcher.handleOpenMailClient,
    handleSendEmailViaGas: dispatcher.handleSendViaGas,
    handlePreviewCvPdf: preview.handlePreviewCvPdf,
    handlePreviewCoverLetterPdf: preview.handlePreviewCoverLetterPdf,
    handlePreviewIdentityPdf: preview.handlePreviewIdentityPdf,
    handlePreviewAcademicPdf: preview.handlePreviewAcademicPdf,
    handlePreviewPortfolioPdf: preview.handlePreviewPortfolioPdf,
    handlePreviewCertsPdf: preview.handlePreviewCertsPdf,
    handlePreviewAwardsPdf: preview.handlePreviewAwardsPdf,
    handleSaveDraft: dispatcher.handleSaveToDraft,
    handleSelectDraft: dispatcher.handleLoadDraftForEdit,
    handleDeleteDraft: dispatcher.handleDeleteDraft,
    handleSelectHistoryItemForEdit: dispatcher.handleSelectHistoryItemForEdit,
    handleResetAllToAuto,
    handleResetCvToAuto,
    handleResetIdentityToDefault: attachments.handleResetIdentityToDefault,
    handleResetAcademicToDefault: attachments.handleResetAcademicToDefault,
    handleResetPortfolioToRoleDefault: attachments.handleResetPortfolioToRoleDefault,
    handleResetCertsToRoleDefault: attachments.handleResetCertsToRoleDefault,
    handleResetAwardsToDefault: attachments.handleResetAwardsToDefault,
    handleToggleIdentityDoc: attachments.handleToggleIdentityDoc,
    handleToggleAcademicDoc: attachments.handleToggleAcademicDoc,
    handleTogglePortfolioSlide: attachments.handleTogglePortfolioSlide,
    handleToggleCert: attachments.handleToggleCert,
    processUploadedFiles: attachments.processUploadedFiles,
    handleRemoveCustomAttachment: attachments.handleRemoveCustomAttachment,
    setTargetCertIdForPick: attachments.setTargetCertIdForPick,
    isPreviewingCv: preview.isPreviewingCv,
    activeModalView,
    handleLoadDraftForEdit: dispatcher.handleLoadDraftForEdit,
    handleSaveToDraft: dispatcher.handleSaveToDraft,
    handleSendViaGas: dispatcher.handleSendViaGas,
    isResettingAll,
    refreshSenderInfo: dispatcher.refreshSenderInfo,
    defaultCertIds: attachments.recommendedCertIds,
    defaultPortfolioSlideIds: attachments.recommendedPortfolioSlideIds,
    setCustomAttachments: attachments.setCustomAttachments,
    setDraftCount: dispatcher.setDraftCount,
    setImagePreviewUrl: state.setImagePreviewUrl,
    onResetAwards: attachments.handleResetAwardsToDefault,
    resolvedApplicantEmail: dispatcher.resolvedApplicantEmail,
  };
}

export default useLamarKerjaFlow;
