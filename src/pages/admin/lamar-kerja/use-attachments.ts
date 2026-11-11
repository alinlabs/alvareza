import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { CustomAttachmentItem, CvDesignType, CvTextAlignType } from '../main/types';
import { getAdaptivePortfolioSlides, getActiveCertificateList } from '../../../utils/pdf-engine/portofolio';
import { ALL_AWARDS_LIST, getAwardIdsForAchievements } from '../../../data/penghargaan';
import { getItemSelectionForPreset, ItemSelectionState } from '../../../data/preset/config/item-seleksi';

export interface UseLamarKerjaAttachmentsProps {
  jobTitle: string;
  debouncedJobTitle: string;
  cvItems?: ItemSelectionState | null;
}

export function useLamarKerjaAttachments({
  jobTitle,
  debouncedJobTitle,
  cvItems,
}: UseLamarKerjaAttachmentsProps) {
  const [cvDesignPreset, setCvDesignPreset] = useState<CvDesignType>('block');
  const [cvHeaderColor, setCvHeaderColor] = useState<string>('#0062E3');
  const [cvTextAlign, setCvTextAlign] = useState<CvTextAlignType>('left');
  const [coverLetterTextAlign, setCoverLetterTextAlign] = useState<CvTextAlignType>('justify');
  const [showCvBreakdown, setShowCvBreakdown] = useState<boolean>(false);
  const [selectedCvPreset, setSelectedCvPreset] = useState<string>('optimal');
  const [isPresetAuto, setIsPresetAuto] = useState<boolean>(true);

  const [coverLetterDate, setCoverLetterDate] = useState<string>(() => {
    return new Date().toISOString().slice(0, 10);
  });
  const [isCoverLetterDateAuto, setIsCoverLetterDateAuto] = useState<boolean>(true);
  const [coverLetterCity, setCoverLetterCity] = useState<string>('');
  const [isCoverLetterCityActive, setIsCoverLetterCityActive] = useState<boolean>(false);
  const [showCoverLetterBreakdown, setShowCoverLetterBreakdown] = useState<boolean>(false);

  // Identity docs states
  const [selectedIdentityIds, setSelectedIdentityIds] = useState<string[]>([]);
  const [isIdentityColorPrint, setIsIdentityColorPrint] = useState<boolean>(false);
  const [isIdentityCompressed, setIsIdentityCompressed] = useState<boolean>(true);
  const [isIdentitySeparatePhotoPrint, setIsIdentitySeparatePhotoPrint] = useState<boolean>(false);
  const [isIdentityPhotoAsJpg, setIsIdentityPhotoAsJpg] = useState<boolean>(true);
  const [showIdentityBreakdown, setShowIdentityBreakdown] = useState<boolean>(false);

  // Academic docs states
  const [selectedAcademicIds, setSelectedAcademicIds] = useState<string[]>(['skl', 'transkrip']);
  const [isColorPrint, setIsColorPrint] = useState<boolean>(true);
  const [isAcademicGrayscale, setIsAcademicGrayscale] = useState<boolean>(false);
  const [isAcademicCompressed, setIsAcademicCompressed] = useState<boolean>(true);
  const [showAcademicBreakdown, setShowAcademicBreakdown] = useState<boolean>(false);

  // Portfolio docs states
  const [showPortfolioBreakdown, setShowPortfolioBreakdown] = useState(false);
  const [isPortfolioCompressed, setIsPortfolioCompressed] = useState<boolean>(true);
  const [isPortfolioGrayscale, setIsPortfolioGrayscale] = useState<boolean>(false);

  // Certs docs states
  const [showCertsBreakdown, setShowCertsBreakdown] = useState(false);
  const [isCertsGrayscale, setIsCertsGrayscale] = useState<boolean>(false);
  const [isCertsCompressed, setIsCertsCompressed] = useState<boolean>(true);

  const effectiveCvHeaderColor = cvHeaderColor;

  // Rekomendasi otomatis sesuai preset role aktif
  const recommendedPortfolioSlideIds = useMemo(() => {
    return getAdaptivePortfolioSlides(selectedCvPreset, {
      jobTitle: debouncedJobTitle,
    }).map((s) => s.id);
  }, [selectedCvPreset, debouncedJobTitle]);

  const recommendedCertIds = useMemo(() => {
    return getActiveCertificateList(selectedCvPreset).map((c) => c.id);
  }, [selectedCvPreset]);

  // State: Slide portofolio yang dipilih pengguna
  const [selectedPortfolioSlideIds, setSelectedPortfolioSlideIds] = useState<string[]>(() => {
    return getAdaptivePortfolioSlides(selectedCvPreset || 'optimal', {
      jobTitle,
    }).map((s) => s.id);
  });

  // State: Sertifikat fisik yang dipilih pengguna
  const [selectedCertIds, setSelectedCertIds] = useState<string[]>(() => {
    return getActiveCertificateList(selectedCvPreset || 'optimal').map((c) => c.id);
  });

  // Helper untuk menentukan inisialisasi piagam penghargaan dari prestasi aktif CV
  const getAdaptiveAwardIds = useCallback((): string[] => {
    if (cvItems?.achievements) {
      const activeAchIds = Object.keys(cvItems.achievements).filter(
        (id) => cvItems.achievements[id]
      );
      const mapped = getAwardIdsForAchievements(activeAchIds);
      if (mapped.length > 0) return mapped;
    }
    const presetSelection = getItemSelectionForPreset(selectedCvPreset || 'optimal');
    const activeAchIds = Object.keys(presetSelection.achievements || {}).filter(
      (id) => presetSelection.achievements[id]
    );
    const mapped = getAwardIdsForAchievements(activeAchIds);
    return mapped.length > 0 ? mapped : ['awd-1', 'awd-2', 'awd-3'];
  }, [cvItems, selectedCvPreset]);

  const defaultAwardIds = useMemo(() => {
    return getAdaptiveAwardIds();
  }, [getAdaptiveAwardIds]);

  // State: Sertifikat fisik penghargaan yang dipilih pengguna
  const [selectedAwardIds, setSelectedAwardIds] = useState<string[]>(() => {
    return getAdaptiveAwardIds();
  });
  const [showAwardsBreakdown, setShowAwardsBreakdown] = useState<boolean>(false);
  const [isAwardsGrayscale, setIsAwardsGrayscale] = useState<boolean>(false);
  const [isAwardsCompressed, setIsAwardsCompressed] = useState<boolean>(true);

  // Otomatis sinkronisasi penghargaan ketika CV achievements di admin builder berubah
  useEffect(() => {
    if (cvItems?.achievements) {
      const activeAchIds = Object.keys(cvItems.achievements).filter(
        (id) => cvItems.achievements[id]
      );
      const mappedAwards = getAwardIdsForAchievements(activeAchIds);
      setSelectedAwardIds(mappedAwards);
    }
  }, [cvItems?.achievements]);

  // Otomatis centang rekomendasi setiap kali preset berganti atau user selesai mengetik posisi
  useEffect(() => {
    const recommendedSlides = getAdaptivePortfolioSlides(selectedCvPreset, {
      jobTitle: debouncedJobTitle,
    }).map((s) => s.id);
    setSelectedPortfolioSlideIds(recommendedSlides);

    const recommendedCerts = getActiveCertificateList(selectedCvPreset).map((c) => c.id);
    setSelectedCertIds(recommendedCerts);

    if (!cvItems?.achievements) {
      setSelectedAwardIds(defaultAwardIds);
    }
  }, [selectedCvPreset, debouncedJobTitle, cvItems, defaultAwardIds]);

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

  // Handlers
  const handleResetAwardsToDefault = () => {
    setIsAwardsGrayscale(false);
    setIsAwardsCompressed(true);
    setSelectedAwardIds(defaultAwardIds);
  };

  const handleToggleIdentityDoc = (docId: string) => {
    setSelectedIdentityIds((prev) =>
      prev.includes(docId) ? prev.filter((id) => id !== docId) : [...prev, docId]
    );
  };

  const handleResetIdentityToDefault = () => {
    setSelectedIdentityIds([]);
    setIsIdentityColorPrint(false);
    setIsIdentityCompressed(true);
    setIsIdentitySeparatePhotoPrint(false);
    setIsIdentityPhotoAsJpg(true);
  };

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
    setIsAcademicGrayscale(false);
    setIsAcademicCompressed(true);
    setIsColorPrint(true);
  };

  const handleResetPortfolioToRoleDefault = () => {
    setIsPortfolioGrayscale(false);
    setIsPortfolioCompressed(true);
    setSelectedPortfolioSlideIds(recommendedPortfolioSlideIds);
  };

  const handleResetCertsToRoleDefault = () => {
    setIsCertsGrayscale(false);
    setIsCertsCompressed(true);
    setSelectedCertIds(recommendedCertIds);
  };

  const handleToggleCert = (certId: string) => {
    setSelectedCertIds((prev) =>
      prev.includes(certId) ? prev.filter((id) => id !== certId) : [...prev, certId]
    );
  };

  return {
    cvDesignPreset,
    setCvDesignPreset,
    cvHeaderColor,
    setCvHeaderColor,
    effectiveCvHeaderColor,
    cvTextAlign,
    setCvTextAlign,
    coverLetterTextAlign,
    setCoverLetterTextAlign,
    showCvBreakdown,
    setShowCvBreakdown,
    selectedCvPreset,
    setSelectedCvPreset,
    isPresetAuto,
    setIsPresetAuto,
    coverLetterDate,
    setCoverLetterDate,
    isCoverLetterDateAuto,
    setIsCoverLetterDateAuto,
    coverLetterCity,
    setCoverLetterCity,
    isCoverLetterCityActive,
    setIsCoverLetterCityActive,
    showCoverLetterBreakdown,
    setShowCoverLetterBreakdown,
    selectedIdentityIds,
    setSelectedIdentityIds,
    isIdentityColorPrint,
    setIsIdentityColorPrint,
    isIdentityCompressed,
    setIsIdentityCompressed,
    isIdentitySeparatePhotoPrint,
    setIsIdentitySeparatePhotoPrint,
    isIdentityPhotoAsJpg,
    setIsIdentityPhotoAsJpg,
    showIdentityBreakdown,
    setShowIdentityBreakdown,
    selectedAcademicIds,
    setSelectedAcademicIds,
    isColorPrint,
    setIsColorPrint,
    isAcademicGrayscale,
    setIsAcademicGrayscale,
    isAcademicCompressed,
    setIsAcademicCompressed,
    showAcademicBreakdown,
    setShowAcademicBreakdown,
    showPortfolioBreakdown,
    setShowPortfolioBreakdown,
    isPortfolioCompressed,
    setIsPortfolioCompressed,
    isPortfolioGrayscale,
    setIsPortfolioGrayscale,
    showCertsBreakdown,
    setShowCertsBreakdown,
    isCertsGrayscale,
    setIsCertsGrayscale,
    isCertsCompressed,
    setIsCertsCompressed,
    recommendedPortfolioSlideIds,
    recommendedCertIds,
    selectedPortfolioSlideIds,
    setSelectedPortfolioSlideIds,
    selectedCertIds,
    setSelectedCertIds,
    getAdaptiveAwardIds,
    defaultAwardIds,
    selectedAwardIds,
    setSelectedAwardIds,
    showAwardsBreakdown,
    setShowAwardsBreakdown,
    isAwardsGrayscale,
    setIsAwardsGrayscale,
    isAwardsCompressed,
    setIsAwardsCompressed,
    customAttachments,
    setCustomAttachments,
    isAttachmentDropOver,
    setIsAttachmentDropOver,
    targetCertIdForPick,
    setTargetCertIdForPick,
    attachmentInputRef,
    processUploadedFiles,
    handleRemoveCustomAttachment,
    handleResetAwardsToDefault,
    handleToggleIdentityDoc,
    handleResetIdentityToDefault,
    handleToggleAcademicDoc,
    handleTogglePortfolioSlide,
    handleResetAcademicToDefault,
    handleResetPortfolioToRoleDefault,
    handleResetCertsToRoleDefault,
    handleToggleCert,
  };
}

export type LamarKerjaAttachmentsResult = ReturnType<typeof useLamarKerjaAttachments>;
