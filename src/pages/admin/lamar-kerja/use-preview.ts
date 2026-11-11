import { useState } from 'react';
import { downloadBase64Pdf } from '../../../utils/google-apps-script/preview';
import {
  generateCvPdfAttachment,
  generateCoverLetterPdfAttachment,
  generatePortfolioPdfAttachment,
  generateCertificatesPdfAttachment,
} from '../../../utils/google-apps-script/generator';
import { downloadIdentityDocsPdf } from '../../../utils/pdf-engine/identitas';
import { downloadAcademicDocs } from '../../../data/akademik';
import { buildAwardsCompilationPdf } from '../../../utils/pdf-engine/portofolio';
import { EmailLanguage } from '../../../types/jobApplication';
import { CvDesignType, CvTextAlignType } from '../main/types';

export interface UseLamarKerjaPreviewProps {
  selectedCvPreset: string;
  language: EmailLanguage;
  jobTitle: string;
  companyName: string;
  effectiveCvHeaderColor: string;
  cvDesignPreset: CvDesignType;
  cvTextAlign: CvTextAlignType;
  coverLetterDate: string;
  isCoverLetterCityActive: boolean;
  coverLetterCity: string;
  coverLetterTextAlign: CvTextAlignType;
  resolvedApplicantEmail: string;
  jobDesk: string;
  kualifikasi: string;
  quickInputText: string;
  keyRequirements: string[];
  selectedIdentityIds: string[];
  isIdentityColorPrint: boolean;
  isIdentitySeparatePhotoPrint: boolean;
  isIdentityPhotoAsJpg: boolean;
  isIdentityCompressed: boolean;
  selectedAcademicIds: string[];
  isAcademicGrayscale: boolean;
  isAcademicCompressed: boolean;
  selectedPortfolioSlideIds: string[];
  isPortfolioCompressed: boolean;
  isPortfolioGrayscale: boolean;
  selectedCertIds: string[];
  isCertsCompressed: boolean;
  isCertsGrayscale: boolean;
  selectedAwardIds: string[];
  isAwardsCompressed: boolean;
  isAwardsGrayscale: boolean;
}

export function useLamarKerjaPreview({
  selectedCvPreset,
  language,
  jobTitle,
  companyName,
  effectiveCvHeaderColor,
  cvDesignPreset,
  cvTextAlign,
  coverLetterDate,
  isCoverLetterCityActive,
  coverLetterCity,
  coverLetterTextAlign,
  resolvedApplicantEmail,
  jobDesk,
  kualifikasi,
  quickInputText,
  keyRequirements,
  selectedIdentityIds,
  isIdentityColorPrint,
  isIdentitySeparatePhotoPrint,
  isIdentityPhotoAsJpg,
  isIdentityCompressed,
  selectedAcademicIds,
  isAcademicGrayscale,
  isAcademicCompressed,
  selectedPortfolioSlideIds,
  isPortfolioCompressed,
  isPortfolioGrayscale,
  selectedCertIds,
  isCertsCompressed,
  isCertsGrayscale,
  selectedAwardIds,
  isAwardsCompressed,
  isAwardsGrayscale,
}: UseLamarKerjaPreviewProps) {
  const [activeDownloadSection, setActiveDownloadSection] = useState<'cv' | 'surat-lamaran' | 'identitas' | 'akademik' | 'portofolio' | 'sertifikasi' | 'penghargaan' | null>(null);
  const [activePreviewModal, setActivePreviewModal] = useState<'cv' | 'surat-lamaran' | 'identitas' | 'akademik' | 'portofolio' | 'sertifikasi' | 'penghargaan' | null>(null);
  const [isPreviewingCv, setIsPreviewingCv] = useState<boolean>(false);
  const [isPreviewingCoverLetter, setIsPreviewingCoverLetter] = useState<boolean>(false);
  const [isPreviewingIdentity, setIsPreviewingIdentity] = useState<boolean>(false);
  const [isPreviewingAcademic, setIsPreviewingAcademic] = useState<boolean>(false);
  const [isPreviewingPortfolio, setIsPreviewingPortfolio] = useState(false);
  const [isPreviewingCerts, setIsPreviewingCerts] = useState(false);
  const [isPreviewingAwards, setIsPreviewingAwards] = useState<boolean>(false);

  const handleOpenSectionDownload = (section: 'cv' | 'surat-lamaran' | 'identitas' | 'akademik' | 'portofolio' | 'sertifikasi' | 'penghargaan') => {
    setActiveDownloadSection(section);
  };

  const handlePreviewCvPdf = async () => {
    handleOpenSectionDownload('cv');
  };

  const handlePreviewCoverLetterPdf = async () => {
    handleOpenSectionDownload('surat-lamaran');
  };

  const handlePreviewIdentityPdf = async () => {
    if (selectedIdentityIds.length === 0) {
      alert('Mohon pilih minimal 1 dokumen identitas untuk diunduh.');
      return;
    }
    handleOpenSectionDownload('identitas');
  };

  const handlePreviewAcademicPdf = async () => {
    if (selectedAcademicIds.length === 0) {
      alert('Mohon pilih minimal 1 dokumen akademik untuk diunduh.');
      return;
    }
    handleOpenSectionDownload('akademik');
  };

  const handlePreviewPortfolioPdf = async () => {
    if (selectedPortfolioSlideIds.length === 0) {
      alert('Mohon pilih minimal 1 slide portofolio untuk di-preview.');
      return;
    }
    handleOpenSectionDownload('portofolio');
  };

  const handlePreviewCertsPdf = async () => {
    if (selectedCertIds.length === 0) {
      alert('Mohon pilih minimal 1 sertifikasi untuk di-preview.');
      return;
    }
    handleOpenSectionDownload('sertifikasi');
  };

  const handlePreviewAwardsPdf = async () => {
    if (selectedAwardIds.length === 0) {
      alert('Mohon pilih minimal 1 penghargaan untuk di-preview.');
      return;
    }
    handleOpenSectionDownload('penghargaan');
  };

  return {
    activePreviewModal,
    setActivePreviewModal,
    activeDownloadSection,
    setActiveDownloadSection,
    isPreviewingCv,
    setIsPreviewingCv,
    isPreviewingCoverLetter,
    setIsPreviewingCoverLetter,
    isPreviewingIdentity,
    setIsPreviewingIdentity,
    isPreviewingAcademic,
    setIsPreviewingAcademic,
    isPreviewingPortfolio,
    setIsPreviewingPortfolio,
    isPreviewingCerts,
    setIsPreviewingCerts,
    isPreviewingAwards,
    setIsPreviewingAwards,
    handlePreviewCvPdf,
    handlePreviewCoverLetterPdf,
    handlePreviewIdentityPdf,
    handlePreviewAcademicPdf,
    handlePreviewPortfolioPdf,
    handlePreviewCertsPdf,
    handlePreviewAwardsPdf,
    handleOpenSectionDownload,
  };
}

export type LamarKerjaPreviewResult = ReturnType<typeof useLamarKerjaPreview>;
