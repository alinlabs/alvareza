import React from 'react';
import { CustomAttachmentItem, CvDesignType, CvTextAlignType } from '../types';
import {
  CoverLetterSection,
  CvControlsSection,
  IdentitySection,
  AcademicSection,
  PortfolioSection,
  CertsSection,
  AwardsSection,
  CustomFilesSection,
} from './attachments';

export interface AttachmentsSectionProps {
  // Curriculum Vitae Section Props
  selectedCvPreset: string;
  setSelectedCvPreset?: (val: string) => void;
  setIsPresetAuto?: (val: boolean) => void;
  onPresetChangeWithDraft?: (newPreset: string) => void;
  cvDesignPreset: CvDesignType;
  setCvDesignPreset: (val: CvDesignType) => void;
  cvHeaderColor: string;
  setCvHeaderColor: (val: string) => void;
  cvTextAlign: CvTextAlignType;
  setCvTextAlign: (val: CvTextAlignType) => void;
  handlePreviewCvPdf?: () => void;
  isPreviewingCv?: boolean;
  onOpenCvPreviewModal?: () => void;
  showCvBreakdown?: boolean;
  setShowCvBreakdown?: React.Dispatch<React.SetStateAction<boolean>>;

  // Surat Lamaran Section Props
  showCoverLetterBreakdown?: boolean;
  setShowCoverLetterBreakdown?: React.Dispatch<React.SetStateAction<boolean>>;
  coverLetterDate?: string;
  setCoverLetterDate?: (val: string) => void;
  isCoverLetterDateAuto?: boolean;
  setIsCoverLetterDateAuto?: (val: boolean) => void;
  coverLetterCity?: string;
  setCoverLetterCity?: (val: string) => void;
  isCoverLetterCityActive?: boolean;
  setIsCoverLetterCityActive?: (val: boolean) => void;
  coverLetterTextAlign?: CvTextAlignType;
  setCoverLetterTextAlign?: (val: CvTextAlignType) => void;
  handlePreviewCoverLetterPdf?: () => void;
  isPreviewingCoverLetter?: boolean;
  onOpenCoverLetterPreviewModal?: () => void;
  emailBody?: string;
  copiedBody?: boolean;
  handleCopy?: (text: string, type: 'subject' | 'body' | 'all' | 'email' | 'cc' | 'phone') => void;

  // Print Mode
  isColorPrint?: boolean;
  setIsColorPrint?: (val: boolean) => void;

  // Job Context
  jobTitle: string;
  jobDesk?: string;
  kualifikasi?: string;
  rawText?: string;
  language?: 'in' | 'en' | 'id';
  onToggleLanguage?: () => void;
  onSelectLanguage?: (lang: 'id' | 'en') => void;

  // Identitas Section Props
  selectedIdentityIds?: string[];
  showIdentityBreakdown?: boolean;
  setShowIdentityBreakdown?: React.Dispatch<React.SetStateAction<boolean>>;
  handlePreviewIdentityPdf?: () => void;
  isPreviewingIdentity?: boolean;
  onOpenIdentityPreviewModal?: () => void;
  handleToggleIdentityDoc?: (docId: string) => void;
  onResetIdentity?: () => void;
  isIdentityColorPrint?: boolean;
  setIsIdentityColorPrint?: (val: boolean) => void;
  isIdentitySeparatePhotoPrint?: boolean;
  setIsIdentitySeparatePhotoPrint?: (val: boolean) => void;

  // Akademik Section Props
  selectedAcademicIds: string[];
  showAcademicBreakdown: boolean;
  setShowAcademicBreakdown: React.Dispatch<React.SetStateAction<boolean>>;
  handlePreviewAcademicPdf: () => void;
  isPreviewingAcademic: boolean;
  onOpenAcademicPreviewModal?: () => void;
  handleToggleAcademicDoc: (docId: 'skl' | 'transkrip') => void;
  onResetAcademic?: () => void;

  // Portofolio Section Props
  selectedPortfolioSlideIds: string[];
  showPortfolioBreakdown: boolean;
  setShowPortfolioBreakdown: React.Dispatch<React.SetStateAction<boolean>>;
  handlePreviewPortfolioPdf: () => void;
  isPreviewingPortfolio: boolean;
  onOpenPortfolioPreviewModal?: () => void;
  handleTogglePortfolioSlide: (slideId: string) => void;
  onResetPortfolio?: () => void;
  isPortfolioCompressed?: boolean;
  setIsPortfolioCompressed?: (val: boolean) => void;

  // Sertifikasi Section Props
  selectedCertIds: string[];
  showCertsBreakdown: boolean;
  setShowCertsBreakdown: React.Dispatch<React.SetStateAction<boolean>>;
  handlePreviewCertsPdf: () => void;
  isPreviewingCerts: boolean;
  onOpenCertsPreviewModal?: () => void;
  handleToggleCert: (certId: string) => void;
  onResetCerts?: () => void;

  // Penghargaan Section Props
  selectedAwardIds?: string[];
  setSelectedAwardIds?: React.Dispatch<React.SetStateAction<string[]>>;
  showAwardsBreakdown?: boolean;
  setShowAwardsBreakdown?: React.Dispatch<React.SetStateAction<boolean>>;
  onOpenAwardsPreviewModal?: () => void;
  onResetAwards?: () => void;

  // Custom Attachments Props
  customAttachments: CustomAttachmentItem[];
  handleRemoveCustomAttachment: (id: string) => void;
  processUploadedFiles: (files: FileList | File[], forCertId?: string | null) => Promise<void>;
  setTargetCertIdForPick: (id: string | null) => void;
  attachmentInputRef: React.RefObject<HTMLInputElement | null>;
  isAttachmentDropOver: boolean;
  setIsAttachmentDropOver: (over: boolean) => void;
  formatFileSize: (bytes: number) => string;
}

export const AttachmentsSection: React.FC<AttachmentsSectionProps> = ({
  // Curriculum Vitae
  selectedCvPreset,
  setSelectedCvPreset,
  setIsPresetAuto,
  onPresetChangeWithDraft,
  cvDesignPreset,
  setCvDesignPreset,
  cvHeaderColor,
  setCvHeaderColor,
  cvTextAlign,
  setCvTextAlign,
  handlePreviewCvPdf,
  isPreviewingCv = false,
  onOpenCvPreviewModal,
  showCvBreakdown = false,
  setShowCvBreakdown,

  // Surat Lamaran
  showCoverLetterBreakdown = false,
  setShowCoverLetterBreakdown,
  coverLetterDate = '',
  setCoverLetterDate,
  isCoverLetterDateAuto = true,
  setIsCoverLetterDateAuto,
  coverLetterCity = '',
  setCoverLetterCity,
  isCoverLetterCityActive = false,
  setIsCoverLetterCityActive,
  coverLetterTextAlign = 'justify',
  setCoverLetterTextAlign,
  handlePreviewCoverLetterPdf,
  isPreviewingCoverLetter = false,
  onOpenCoverLetterPreviewModal,
  emailBody = '',
  copiedBody = false,
  handleCopy,

  // Print Mode
  isColorPrint = false,
  setIsColorPrint,

  // Job Context
  jobTitle,
  jobDesk,
  kualifikasi,
  rawText,
  language = 'in',
  onToggleLanguage,
  onSelectLanguage,

  // Identitas
  selectedIdentityIds = [],
  showIdentityBreakdown = false,
  setShowIdentityBreakdown,
  handlePreviewIdentityPdf,
  isPreviewingIdentity = false,
  onOpenIdentityPreviewModal,
  handleToggleIdentityDoc,
  onResetIdentity,
  isIdentityColorPrint = false,
  setIsIdentityColorPrint,
  isIdentitySeparatePhotoPrint = false,
  setIsIdentitySeparatePhotoPrint,

  // Akademik
  selectedAcademicIds,
  showAcademicBreakdown,
  setShowAcademicBreakdown,
  handlePreviewAcademicPdf,
  isPreviewingAcademic,
  onOpenAcademicPreviewModal,
  handleToggleAcademicDoc,
  onResetAcademic,

  // Portofolio
  selectedPortfolioSlideIds,
  showPortfolioBreakdown,
  setShowPortfolioBreakdown,
  handlePreviewPortfolioPdf,
  isPreviewingPortfolio,
  onOpenPortfolioPreviewModal,
  handleTogglePortfolioSlide,
  onResetPortfolio,
  isPortfolioCompressed = false,
  setIsPortfolioCompressed,

  // Sertifikasi
  selectedCertIds,
  showCertsBreakdown,
  setShowCertsBreakdown,
  handlePreviewCertsPdf,
  isPreviewingCerts,
  onOpenCertsPreviewModal,
  handleToggleCert,
  onResetCerts,

  // Penghargaan
  selectedAwardIds,
  setSelectedAwardIds,
  showAwardsBreakdown,
  setShowAwardsBreakdown,
  onOpenAwardsPreviewModal,
  onResetAwards,

  // Custom Attachments
  customAttachments,
  handleRemoveCustomAttachment,
  processUploadedFiles,
  setTargetCertIdForPick,
  attachmentInputRef,
  isAttachmentDropOver,
  setIsAttachmentDropOver,
  formatFileSize,
}) => {
  return (
    <div className="space-y-3 pt-2">
      {/* Hidden File Input for General Extra Attachments */}
      <input
        ref={attachmentInputRef}
        type="file"
        multiple
        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp,.zip,.rar"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            processUploadedFiles(e.target.files, null);
            e.target.value = '';
          }
        }}
        className="hidden"
      />

      {/* Automated Document Sections (Curriculum Vitae, Akademik, Portofolio & Sertifikasi) */}
      <div className="space-y-4">
        {/* SECTION 1: SURAT LAMARAN */}
        <CoverLetterSection
          showCoverLetterBreakdown={showCoverLetterBreakdown}
          setShowCoverLetterBreakdown={setShowCoverLetterBreakdown}
          coverLetterDate={coverLetterDate}
          setCoverLetterDate={setCoverLetterDate}
          isCoverLetterDateAuto={isCoverLetterDateAuto}
          setIsCoverLetterDateAuto={setIsCoverLetterDateAuto}
          coverLetterCity={coverLetterCity}
          setCoverLetterCity={setCoverLetterCity}
          isCoverLetterCityActive={isCoverLetterCityActive}
          setIsCoverLetterCityActive={setIsCoverLetterCityActive}
          coverLetterTextAlign={coverLetterTextAlign}
          setCoverLetterTextAlign={setCoverLetterTextAlign}
          handlePreviewCoverLetterPdf={handlePreviewCoverLetterPdf}
          isPreviewingCoverLetter={isPreviewingCoverLetter}
          onOpenCoverLetterPreviewModal={onOpenCoverLetterPreviewModal}
          emailBody={emailBody}
          copiedBody={copiedBody}
          handleCopy={handleCopy}
          language={language}
        />

        <div className="border-t border-slate-200/60 dark:border-slate-800" />

        {/* SECTION 2: CURRICULUM VITAE */}
        <CvControlsSection
          selectedCvPreset={selectedCvPreset}
          setSelectedCvPreset={setSelectedCvPreset}
          setIsPresetAuto={setIsPresetAuto}
          onPresetChangeWithDraft={onPresetChangeWithDraft}
          cvDesignPreset={cvDesignPreset}
          setCvDesignPreset={setCvDesignPreset}
          cvHeaderColor={cvHeaderColor}
          setCvHeaderColor={setCvHeaderColor}
          cvTextAlign={cvTextAlign}
          setCvTextAlign={setCvTextAlign}
          handlePreviewCvPdf={handlePreviewCvPdf}
          isPreviewingCv={isPreviewingCv}
          onOpenCvPreviewModal={onOpenCvPreviewModal}
          showCvBreakdown={showCvBreakdown}
          setShowCvBreakdown={setShowCvBreakdown}
          language={language}
          onToggleLanguage={onToggleLanguage}
          onSelectLanguage={onSelectLanguage}
        />

        <div className="border-t border-slate-200/60 dark:border-slate-800" />

        {/* SECTION 3: DOKUMEN IDENTITAS */}
        <IdentitySection
          selectedIdentityIds={selectedIdentityIds}
          showIdentityBreakdown={showIdentityBreakdown}
          setShowIdentityBreakdown={setShowIdentityBreakdown || (() => {})}
          handlePreviewIdentityPdf={handlePreviewIdentityPdf || (() => {})}
          isPreviewingIdentity={isPreviewingIdentity}
          onOpenIdentityPreviewModal={onOpenIdentityPreviewModal}
          handleToggleIdentityDoc={handleToggleIdentityDoc || (() => {})}
          onResetIdentity={onResetIdentity}
          isIdentityColorPrint={isIdentityColorPrint}
          setIsIdentityColorPrint={setIsIdentityColorPrint}
          isIdentitySeparatePhotoPrint={isIdentitySeparatePhotoPrint}
          setIsIdentitySeparatePhotoPrint={setIsIdentitySeparatePhotoPrint}
        />

        <div className="border-t border-slate-200/60 dark:border-slate-800" />

        {/* SECTION 4: DOKUMEN AKADEMIK */}
        <AcademicSection
          selectedAcademicIds={selectedAcademicIds}
          showAcademicBreakdown={showAcademicBreakdown}
          setShowAcademicBreakdown={setShowAcademicBreakdown}
          handlePreviewAcademicPdf={handlePreviewAcademicPdf}
          isPreviewingAcademic={isPreviewingAcademic}
          onOpenAcademicPreviewModal={onOpenAcademicPreviewModal}
          handleToggleAcademicDoc={handleToggleAcademicDoc}
          onResetAcademic={onResetAcademic}
          isColorPrint={isColorPrint}
          setIsColorPrint={setIsColorPrint}
        />

        <div className="border-t border-slate-200/60 dark:border-slate-800" />

        {/* SECTION 4: PORTOFOLIO EKSEKUTIF */}
        <PortfolioSection
          selectedPortfolioSlideIds={selectedPortfolioSlideIds}
          showPortfolioBreakdown={showPortfolioBreakdown}
          setShowPortfolioBreakdown={setShowPortfolioBreakdown}
          handlePreviewPortfolioPdf={handlePreviewPortfolioPdf}
          isPreviewingPortfolio={isPreviewingPortfolio}
          onOpenPortfolioPreviewModal={onOpenPortfolioPreviewModal}
          handleTogglePortfolioSlide={handleTogglePortfolioSlide}
          onResetPortfolio={onResetPortfolio}
          selectedCvPreset={selectedCvPreset}
          jobTitle={jobTitle}
          isPortfolioCompressed={isPortfolioCompressed}
          setIsPortfolioCompressed={setIsPortfolioCompressed}
        />

        <div className="border-t border-slate-200/60 dark:border-slate-800" />

        {/* SECTION 5: SERTIFIKASI TERKAIT */}
        <CertsSection
          selectedCertIds={selectedCertIds}
          showCertsBreakdown={showCertsBreakdown}
          setShowCertsBreakdown={setShowCertsBreakdown}
          handlePreviewCertsPdf={handlePreviewCertsPdf}
          isPreviewingCerts={isPreviewingCerts}
          onOpenCertsPreviewModal={onOpenCertsPreviewModal}
          handleToggleCert={handleToggleCert}
          onResetCerts={onResetCerts}
          selectedCvPreset={selectedCvPreset}
        />

        <div className="border-t border-slate-200/60 dark:border-slate-800" />

        {/* SECTION 6: PENGHARGAAN & PRESTASI */}
        <AwardsSection
          selectedAwardIds={selectedAwardIds}
          setSelectedAwardIds={setSelectedAwardIds}
          showAwardsBreakdown={showAwardsBreakdown}
          setShowAwardsBreakdown={setShowAwardsBreakdown}
          onOpenAwardsPreviewModal={onOpenAwardsPreviewModal}
          onResetAwards={onResetAwards}
        />
      </div>

      {/* SECTION 7: LAMPIRAN TAMBAHAN */}
      <CustomFilesSection
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
  );
};
