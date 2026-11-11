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
import { SectionDownloadModal } from './modal-download-section';
import { ALL_IDENTITY_DOCS } from '../../../data/identitas';
import { buildIdentityDocsPdf } from '../../../utils/pdf-engine/identitas';
import { ALL_ACADEMIC_DOCS, getAcademicAttachments } from '../../../data/akademik';
import {
  ALL_PORTFOLIO_SLIDES,
  ALL_CERTIFICATES_LIST,
  CERTIFICATE_FILES,
  generateCvPdfAttachment,
  generateCoverLetterPdfAttachment,
  generatePortfolioPdfAttachment,
  generateCertificatesPdfAttachment,
} from '../../../utils/google-apps-script/generator';
import { ALL_AWARDS_LIST } from '../../../data/penghargaan';
import { buildAwardsCompilationPdf } from '../../../utils/pdf-engine/portofolio';
import { JobDraftService } from '../../../services/jobDraftService';
import { generateTailoredApplicationDraft } from '../../../utils/draft';
import { EmailLanguage } from '../../../types/jobApplication';
import { CvDesignType, CvTextAlignType } from '../main/types';

export type ActiveModalView =
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
  | 'download-section'
  | 'apply'
  | null;

export interface SubModalsProps {
  activeModalView: ActiveModalView;

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

  // Section Download Modal
  activeDownloadSection?: 'cv' | 'surat-lamaran' | 'identitas' | 'akademik' | 'portofolio' | 'sertifikasi' | 'penghargaan' | null;
  setActiveDownloadSection?: (val: 'cv' | 'surat-lamaran' | 'identitas' | 'akademik' | 'portofolio' | 'sertifikasi' | 'penghargaan' | null) => void;

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
  isIdentityPhotoAsJpg?: boolean;
  isIdentityCompressed?: boolean;

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
  activeDownloadSection,
  setActiveDownloadSection,
  selectedIdentityIds = [],
  isIdentityColorPrint = false,
  isIdentitySeparatePhotoPrint = false,
  isIdentityPhotoAsJpg = true,
  isIdentityCompressed = true,
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
          rawText={[quickInputText, ...(keyRequirements || [])].filter(Boolean).join(' ')}
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
          isPhotoAsJpg={isIdentityPhotoAsJpg}
          isCompressed={isIdentityCompressed}
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

      {activeModalView === 'download-section' && activeDownloadSection && (
        <SectionDownloadModal
          key="modal-view-download-section"
          isOpen={true}
          onClose={() => setActiveDownloadSection?.(null)}
          sectionType={activeDownloadSection}
          sectionTitle={
            activeDownloadSection === 'cv'
              ? 'Curriculum Vitae ATS'
              : activeDownloadSection === 'surat-lamaran'
              ? 'Surat Lamaran Pekerjaan'
              : activeDownloadSection === 'identitas'
              ? 'Dokumen Identitas Resmi'
              : activeDownloadSection === 'akademik'
              ? 'Dokumen Akademik Resmi'
              : activeDownloadSection === 'portofolio'
              ? 'Portofolio Digital'
              : activeDownloadSection === 'sertifikasi'
              ? 'Sertifikasi Keahlian'
              : 'Piagam Penghargaan'
          }
          items={(() => {
            if (activeDownloadSection === 'identitas') {
              return ALL_IDENTITY_DOCS.filter((d) => selectedIdentityIds.includes(d.id)).map((d) => ({
                id: d.id,
                title: d.title,
                url: d.url,
                filename: `${d.id}.jpg`,
                mimeType: 'image/jpeg',
              }));
            }
            if (activeDownloadSection === 'akademik') {
              return ALL_ACADEMIC_DOCS.filter((d) => selectedAcademicIds.includes(d.id)).map((d) => ({
                id: d.id,
                title: d.title,
                url: d.url,
                filename: d.filename,
                mimeType: 'application/pdf',
              }));
            }
            if (activeDownloadSection === 'portofolio') {
              return ALL_PORTFOLIO_SLIDES.filter((s) => selectedPortfolioSlideIds.includes(s.id)).map((s) => ({
                id: s.id,
                title: s.title,
                url: `/portofolio/${s.filename}`,
                filename: `${s.id}.jpg`,
                mimeType: 'image/jpeg',
              }));
            }
            if (activeDownloadSection === 'sertifikasi') {
              return selectedCertIds
                .map((id) => ALL_CERTIFICATES_LIST.find((c) => c.id === id))
                .filter(Boolean)
                .map((c: any) => ({
                  id: c.id,
                  title: c.title,
                  url: c.filename,
                  filename: `${c.id}.pdf`,
                  mimeType: 'application/pdf',
                }));
            }
            if (activeDownloadSection === 'penghargaan') {
              return ALL_AWARDS_LIST.filter((a) => selectedAwardIds.includes(a.id)).map((a) => ({
                id: a.id,
                title: a.title,
                url: `/penghargaan/${a.filename}`,
                filename: a.filename,
                mimeType: 'image/jpeg',
              }));
            }
            if (activeDownloadSection === 'surat-lamaran') {
              return [
                {
                  id: 'surat-lamaran',
                  title: 'Surat Lamaran Pekerjaan',
                  url: '',
                  filename: 'surat-lamaran.pdf',
                  mimeType: 'application/pdf',
                },
              ];
            }
            return [
              {
                id: 'cv-ats',
                title: 'Curriculum Vitae ATS',
                url: '',
                filename: 'cv-alvareza.pdf',
                mimeType: 'application/pdf',
              },
            ];
          })()}
          isColorMode={
            activeDownloadSection === 'identitas'
              ? isIdentityColorPrint
              : activeDownloadSection === 'akademik'
              ? !isAcademicGrayscale
              : activeDownloadSection === 'portofolio'
              ? !isPortfolioGrayscale
              : activeDownloadSection === 'sertifikasi'
              ? !isCertsGrayscale
              : activeDownloadSection === 'penghargaan'
              ? !isAwardsGrayscale
              : true
          }
          isCompressedMode={
            activeDownloadSection === 'identitas'
              ? isIdentityCompressed
              : activeDownloadSection === 'akademik'
              ? isAcademicCompressed
              : activeDownloadSection === 'portofolio'
              ? isPortfolioCompressed
              : activeDownloadSection === 'sertifikasi'
              ? isCertsCompressed
              : activeDownloadSection === 'penghargaan'
              ? isAwardsCompressed
              : true
          }
          onBuildCompletePdf={async () => {
            if (activeDownloadSection === 'cv') {
              const att = generateCvPdfAttachment({
                preset: selectedCvPreset,
                language,
                jobTitle,
                companyName,
                headerColor: effectiveCvHeaderColor,
                designPreset: cvDesignPreset,
                textAlign: cvTextAlign,
                applicantEmail,
                jobDesk,
                kualifikasi,
                rawText: [quickInputText, ...(keyRequirements || [])].filter(Boolean).join(' '),
              });
              const binary = atob(att.base64);
              const bytes = new Uint8Array(binary.length);
              for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
              return bytes;
            }
            if (activeDownloadSection === 'surat-lamaran') {
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
                applicantEmail,
              });
              const binary = atob(att.base64);
              const bytes = new Uint8Array(binary.length);
              for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
              return bytes;
            }
            if (activeDownloadSection === 'identitas') {
              const atts = await buildIdentityDocsPdf({
                selectedIds: selectedIdentityIds,
                isColorPrint: isIdentityColorPrint,
                isSeparatePhotoPrint: isIdentitySeparatePhotoPrint,
                isPhotoAsJpg: isIdentityPhotoAsJpg,
                isCompressed: isIdentityCompressed,
              });
              if (atts && atts.length > 0 && atts[0].base64) {
                const binary = atob(atts[0].base64);
                const bytes = new Uint8Array(binary.length);
                for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
                return bytes;
              }
              return new Uint8Array();
            }
            if (activeDownloadSection === 'akademik') {
              const atts = await getAcademicAttachments(selectedAcademicIds, {
                isGrayscale: isAcademicGrayscale,
                isCompressed: isAcademicCompressed,
              });
              if (atts && atts.length > 0 && atts[0].base64) {
                const binary = atob(atts[0].base64);
                const bytes = new Uint8Array(binary.length);
                for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
                return bytes;
              }
              return new Uint8Array();
            }
            if (activeDownloadSection === 'portofolio') {
              const att = await generatePortfolioPdfAttachment({
                preset: selectedCvPreset,
                selectedSlideIds: selectedPortfolioSlideIds,
                jobTitle,
                isCompressed: isPortfolioCompressed,
                isGrayscale: isPortfolioGrayscale,
              });
              const binary = atob(att.base64);
              const bytes = new Uint8Array(binary.length);
              for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
              return bytes;
            }
            if (activeDownloadSection === 'sertifikasi') {
              const att = await generateCertificatesPdfAttachment({
                selectedCertIds,
                isCompressed: isCertsCompressed,
                isGrayscale: isCertsGrayscale,
              });
              const binary = atob(att.base64);
              const bytes = new Uint8Array(binary.length);
              for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
              return bytes;
            }
            if (activeDownloadSection === 'penghargaan') {
              const att = await buildAwardsCompilationPdf({
                selectedAwardIds,
                isCompressed: isAwardsCompressed,
                isGrayscale: isAwardsGrayscale,
              });
              if (att?.base64) {
                const binary = atob(att.base64);
                const bytes = new Uint8Array(binary.length);
                for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
                return bytes;
              }
            }
            return new Uint8Array();
          }}
        />
      )}
    </>
  );
};

export const JobApplySubModals = SubModals;
export default SubModals;
