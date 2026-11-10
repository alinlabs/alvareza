import React from 'react';
import { GasSettingsModal } from '../lamar-kerja-setting';
import { GasHistoryModal } from '../lamar-kerja-history';
import { JobDraftsModal } from '../lamar-kerja-draft';
import {
  ModalCvPreview,
  ModalSuratLamaranPreview,
  ModalIdentitasPreview,
  ModalAkademikPreview,
  ModalPortofolioPreview,
  ModalSertifikasiPreview,
  ModalPenghargaanPreview,
} from '../pdf-preview';
import { JobDraftService } from '../../../services/jobDraftService';
import { generateTailoredApplicationDraft } from '../../../utils/jobApplicationDraft';
import { EmailLanguage } from '../../../types/jobApplication';
import { CvDesignType, CvTextAlignType } from '../types';

export interface SubModalsProps {
  activeModalView:
    | 'settings'
    | 'history'
    | 'drafts'
    | 'preview-cv'
    | 'preview-surat-lamaran'
    | 'preview-identitas'
    | 'preview-akademik'
    | 'preview-portfolio'
    | 'preview-certs'
    | 'preview-awards'
    | 'apply'
    | null;

  // Gas Settings Modal
  isGasSettingsOpen: boolean;
  setIsGasSettingsOpen: (val: boolean) => void;
  refreshSenderInfo: () => void;

  // Gas History Modal
  isGasHistoryOpen: boolean;
  setIsGasHistoryOpen: (val: boolean) => void;
  handleSelectHistoryItemForEdit: (item: any) => void;

  // Job Drafts Modal
  isDraftsModalOpen: boolean;
  setIsDraftsModalOpen: (val: boolean) => void;
  setDraftCount: (val: number) => void;
  setActiveDraftId: (val: string | null) => void;
  handleLoadDraftForEdit: (draft: any) => void;
  highlightDraftId: string | null;

  // Draft Reset Setters
  setQuickInputText: (val: string) => void;
  setCompanyName: (val: string) => void;
  setJobTitle: (val: string) => void;
  setJobDesk?: (val: string) => void;
  setKualifikasi?: (val: string) => void;
  setRecipientEmail: (val: string) => void;
  setCcEmail: (val: string) => void;
  setShowCcField: (val: boolean) => void;
  setRecipientPhone: (val: string) => void;
  setOcrResultText: (val: string) => void;
  setImagePreviewUrl: (val: string | null) => void;
  setIsImageExpanded: (val: boolean) => void;
  setKeyRequirements: (val: string[]) => void;
  setEmailSubject: (val: string) => void;
  setIsSubjectAuto: (val: boolean) => void;
  setSelectedCvPreset: (val: string) => void;
  setIsPresetAuto: (val: boolean) => void;
  setCoverLetterCity: (val: string) => void;
  setCoverLetterDate: (val: string) => void;
  setSelectedIdentityIds?: (val: string[]) => void;
  setIsIdentityColorPrint?: (val: boolean) => void;
  setSelectedAcademicIds: (val: string[]) => void;
  setIsColorPrint: (val: boolean) => void;
  setCustomAttachments: (val: any[]) => void;
  setEmailBody: (val: string) => void;

  // Shared Preview Modals
  setActivePreviewModal: (val: 'cv' | 'surat-lamaran' | 'identitas' | 'akademik' | 'portofolio' | 'sertifikasi' | 'penghargaan' | null) => void;
  applicantEmail?: string;

  // CV Preview Modal
  selectedCvPreset: string;
  cvDesignPreset: CvDesignType;
  effectiveCvHeaderColor: string;
  cvTextAlign: CvTextAlignType;
  language: EmailLanguage;
  jobTitle: string;
  companyName: string;
  jobDesk?: string;
  kualifikasi?: string;
  ocrResultText: string;
  quickInputText: string;
  keyRequirements?: string[];
  setLanguage: (val: EmailLanguage) => void;
  setGlobalLanguage: (val: 'in' | 'en') => void;

  // Surat Lamaran Preview Modal
  coverLetterDate: string;
  coverLetterCity?: string;
  isCoverLetterCityActive?: boolean;
  setIsCoverLetterCityActive?: (val: boolean) => void;
  coverLetterTextAlign?: CvTextAlignType;
  setCvHeaderColor: (val: string) => void;
  setCoverLetterTextAlign: (val: CvTextAlignType) => void;

  // Identitas Preview Modal
  selectedIdentityIds?: string[];
  isIdentityColorPrint?: boolean;
  isIdentitySeparatePhotoPrint?: boolean;

  // Akademik Preview Modal
  selectedAcademicIds: string[];
  isColorPrint: boolean;
  isAcademicGrayscale?: boolean;
  isAcademicCompressed?: boolean;

  // Portofolio Preview Modal
  selectedPortfolioSlideIds: string[];
  isPortfolioGrayscale?: boolean;
  isPortfolioCompressed?: boolean;

  // Sertifikasi Preview Modal
  selectedCertIds: string[];
  isCertsGrayscale?: boolean;
  isCertsCompressed?: boolean;

  // Penghargaan Preview Modal
  selectedAwardIds?: string[];
  isAwardsGrayscale?: boolean;
  isAwardsCompressed?: boolean;
}

export type JobApplySubModalsProps = SubModalsProps;

export const SubModals: React.FC<SubModalsProps> = ({
  activeModalView,
  isGasSettingsOpen,
  setIsGasSettingsOpen,
  refreshSenderInfo,
  isGasHistoryOpen,
  setIsGasHistoryOpen,
  handleSelectHistoryItemForEdit,
  isDraftsModalOpen,
  setIsDraftsModalOpen,
  setDraftCount,
  setActiveDraftId,
  handleLoadDraftForEdit,
  highlightDraftId,
  setQuickInputText,
  setCompanyName,
  setJobTitle,
  setJobDesk,
  setKualifikasi,
  setRecipientEmail,
  setCcEmail,
  setShowCcField,
  setRecipientPhone,
  setOcrResultText,
  setImagePreviewUrl,
  setIsImageExpanded,
  setKeyRequirements,
  setEmailSubject,
  setIsSubjectAuto,
  setSelectedCvPreset,
  setIsPresetAuto,
  setCoverLetterCity,
  setCoverLetterDate,
  setSelectedIdentityIds,
  setIsIdentityColorPrint,
  setSelectedAcademicIds,
  setIsColorPrint,
  setCustomAttachments,
  setEmailBody,
  setActivePreviewModal,
  applicantEmail,
  selectedCvPreset,
  cvDesignPreset,
  effectiveCvHeaderColor,
  cvTextAlign,
  language,
  jobTitle,
  companyName,
  jobDesk,
  kualifikasi,
  ocrResultText,
  quickInputText,
  keyRequirements,
  setLanguage,
  setGlobalLanguage,
  coverLetterDate,
  coverLetterCity,
  isCoverLetterCityActive,
  setIsCoverLetterCityActive,
  coverLetterTextAlign,
  setCvHeaderColor,
  setCoverLetterTextAlign,
  selectedIdentityIds = [],
  isIdentityColorPrint = false,
  isIdentitySeparatePhotoPrint = false,
  selectedAcademicIds,
  isColorPrint,
  isAcademicGrayscale = false,
  isAcademicCompressed = true,
  selectedPortfolioSlideIds,
  isPortfolioGrayscale = false,
  isPortfolioCompressed = true,
  selectedCertIds,
  isCertsGrayscale = false,
  isCertsCompressed = true,
  selectedAwardIds = [],
  isAwardsGrayscale = false,
  isAwardsCompressed = true,
}) => {
  return (
    <>
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
            setJobDesk?.('');
            setKualifikasi?.('');
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
            setCoverLetterCity('');
            if (setIsCoverLetterCityActive) {
              setIsCoverLetterCityActive(false);
            }
            setCoverLetterDate(new Date().toISOString().slice(0, 10));
            setSelectedIdentityIds?.([]);
            setIsIdentityColorPrint?.(false);
            setSelectedAcademicIds(['skl', 'transkrip']);
            setIsColorPrint(false);
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
          }}
          onSelectForEdit={handleLoadDraftForEdit}
          highlightDraftId={highlightDraftId}
        />
      )}

      {activeModalView === 'preview-cv' && (
        <ModalCvPreview
          key="modal-view-preview-cv"
          isOpen={true}
          onClose={() => setActivePreviewModal(null)}
          presetKey={selectedCvPreset}
          designPreset={cvDesignPreset}
          headerColor={effectiveCvHeaderColor}
          textAlign={cvTextAlign}
          language={language}
          jobTitle={jobTitle}
          companyName={companyName}
          jobDesk={jobDesk}
          kualifikasi={kualifikasi}
          applicantEmail={applicantEmail}
          rawText={[ocrResultText, quickInputText, ...(keyRequirements || [])].filter(Boolean).join(' ')}
          onLanguageChange={(newLang) => {
            setLanguage(newLang);
            setGlobalLanguage(newLang);
          }}
        />
      )}

      {activeModalView === 'preview-surat-lamaran' && (
        <ModalSuratLamaranPreview
          key="modal-view-preview-surat-lamaran"
          isOpen={true}
          onClose={() => setActivePreviewModal(null)}
          companyName={companyName}
          jobTitle={jobTitle}
          jobDesk={jobDesk}
          kualifikasi={kualifikasi}
          coverLetterDate={coverLetterDate}
          coverLetterCity={isCoverLetterCityActive ? coverLetterCity : ''}
          presetKey={selectedCvPreset}
          headerColor={effectiveCvHeaderColor}
          textAlign={coverLetterTextAlign}
          language={language}
          applicantEmail={applicantEmail}
          onHeaderColorChange={(color) => setCvHeaderColor(color)}
          onTextAlignChange={(align) => setCoverLetterTextAlign(align)}
          onLanguageChange={(newLang) => {
            setLanguage(newLang);
            setGlobalLanguage(newLang);
          }}
        />
      )}

      {activeModalView === 'preview-identitas' && (
        <ModalIdentitasPreview
          key="modal-view-preview-identitas"
          isOpen={true}
          onClose={() => setActivePreviewModal(null)}
          selectedIdentityIds={selectedIdentityIds}
          isColorPrint={isIdentityColorPrint}
          isSeparatePhotoPrint={isIdentitySeparatePhotoPrint}
        />
      )}

      {activeModalView === 'preview-akademik' && (
        <ModalAkademikPreview
          key="modal-view-preview-akademik"
          isOpen={true}
          onClose={() => setActivePreviewModal(null)}
          selectedAcademicIds={selectedAcademicIds}
          isColorPrint={isColorPrint}
          isAcademicGrayscale={isAcademicGrayscale}
          isAcademicCompressed={isAcademicCompressed}
        />
      )}

      {activeModalView === 'preview-portfolio' && (
        <ModalPortofolioPreview
          key="modal-view-preview-portfolio"
          isOpen={true}
          onClose={() => setActivePreviewModal(null)}
          selectedPortfolioSlideIds={selectedPortfolioSlideIds}
          presetKey={selectedCvPreset}
          jobTitle={jobTitle}
          isPortfolioGrayscale={isPortfolioGrayscale}
          isPortfolioCompressed={isPortfolioCompressed}
        />
      )}

      {activeModalView === 'preview-certs' && (
        <ModalSertifikasiPreview
          key="modal-view-preview-certs"
          isOpen={true}
          onClose={() => setActivePreviewModal(null)}
          selectedCertIds={selectedCertIds}
          presetKey={selectedCvPreset}
          isCertsGrayscale={isCertsGrayscale}
          isCertsCompressed={isCertsCompressed}
        />
      )}

      {activeModalView === 'preview-awards' && (
        <ModalPenghargaanPreview
          key="modal-view-preview-awards"
          isOpen={true}
          onClose={() => setActivePreviewModal(null)}
          selectedAwardIds={selectedAwardIds}
          isGrayscale={isAwardsGrayscale}
          isCompressed={isAwardsCompressed}
        />
      )}
    </>
  );
};

export const JobApplySubModals = SubModals;
export default SubModals;
