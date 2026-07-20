import React from 'react';
import { CoverLetterTemplate } from './Templates';
import { ProfileData } from '../../../types';

export interface EmailDraft {
  id: string;
  targetEmail: string;
  companyName: string;
  positionName: string;
  subject: string;
  body: string;
  createdAt: string;
  
  // Custom states
  includePerihal?: boolean;
  includeLampiranAwal?: boolean;
  includeDaftarLampiran?: boolean;
  includeBio?: boolean;
  
  cvOption?: 'default' | 'upload' | 'none';
  cvAtsOption?: 'default' | 'none';
  portofolioOption?: 'default' | 'upload' | 'none';
  paklaringOption?: 'default' | 'upload' | 'none';
  sertifikatKompetensiAkademikOption?: 'default' | 'upload' | 'none';
  sertifikatKompetensiBisnisDigitalOption?: 'default' | 'upload' | 'none';
  sertifikatKompetensiKepemimpinanOption?: 'default' | 'upload' | 'none';
  sertifikatKompetensiPublicSpeakingOption?: 'default' | 'upload' | 'none';
  sertifikatPrestasiOption?: 'default' | 'upload' | 'none';
  ijazahOption?: 'default' | 'upload' | 'none';
  bodyFontFamily?: string;
  emailFormat?: 'modern' | 'formal' | 'plain';
  paragraphAlign?: 'justify' | 'left';
  status?: 'draft' | 'terkirim';
  isSubjectAuto?: boolean;
  customSubject?: string;
  mergeAttachments?: 'none' | 'all' | 'optimal';
  bioAlamat?: string;
  senderLocation?: string;
}

export interface AttachedFile {
  label: string;
  option: 'default' | 'upload' | 'none';
  file: File | null;
  defaultName: string;
}

export interface EmailSenderState {
  templates: CoverLetterTemplate[];
  setTemplates: React.Dispatch<React.SetStateAction<CoverLetterTemplate[]>>;
  selectedTplId: string;
  setSelectedTplId: React.Dispatch<React.SetStateAction<string>>;
  drafts: EmailDraft[];
  setDrafts: React.Dispatch<React.SetStateAction<EmailDraft[]>>;
  editingDraftId: string | null;
  setEditingDraftId: React.Dispatch<React.SetStateAction<string | null>>;
  editingDraftStatus: 'draft' | 'terkirim' | null;
  setEditingDraftStatus: React.Dispatch<React.SetStateAction<'draft' | 'terkirim' | null>>;
  activeTab: 'editor' | 'status' | 'templates' | 'email-templates';
  setActiveTab: React.Dispatch<React.SetStateAction<'editor' | 'status' | 'templates' | 'email-templates'>>;
  isPreviewModalOpen: boolean;
  setIsPreviewModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isBulkSending: boolean;
  setIsBulkSending: React.Dispatch<React.SetStateAction<boolean>>;
  desktopActionTarget: HTMLElement | null;
  setDesktopActionTarget: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
  profileData: ProfileData | null;
  
  // Recipient inputs
  targetEmail: string;
  setTargetEmail: React.Dispatch<React.SetStateAction<string>>;
  companyName: string;
  setCompanyName: React.Dispatch<React.SetStateAction<string>>;
  positionName: string;
  setPositionName: React.Dispatch<React.SetStateAction<string>>;
  locationName: string;
  setLocationName: React.Dispatch<React.SetStateAction<string>>;
  salaryExpectation: string;
  setSalaryExpectation: React.Dispatch<React.SetStateAction<string>>;
  recipientGender: string;
  setRecipientGender: React.Dispatch<React.SetStateAction<string>>;
  recipientRole: string;
  setRecipientRole: React.Dispatch<React.SetStateAction<string>>;
  customRecipientRole: string;
  setCustomRecipientRole: React.Dispatch<React.SetStateAction<string>>;
  recipientName: string;
  setRecipientName: React.Dispatch<React.SetStateAction<string>>;
  recipientPlaceOption: string;
  setRecipientPlaceOption: React.Dispatch<React.SetStateAction<string>>;
  recipientPlaceName: string;
  setRecipientPlaceName: React.Dispatch<React.SetStateAction<string>>;
  recipientRoleCompanyFormat: string;
  setRecipientRoleCompanyFormat: React.Dispatch<React.SetStateAction<string>>;
  includePerihal: boolean;
  setIncludePerihal: React.Dispatch<React.SetStateAction<boolean>>;
  includeLampiranAwal: boolean;
  setIncludeLampiranAwal: React.Dispatch<React.SetStateAction<boolean>>;
  includeDaftarLampiran: boolean;
  setIncludeDaftarLampiran: React.Dispatch<React.SetStateAction<boolean>>;
  isSubjectAuto: boolean;
  setIsSubjectAuto: React.Dispatch<React.SetStateAction<boolean>>;
  customSubject: string;
  setCustomSubject: React.Dispatch<React.SetStateAction<string>>;
  mergeAttachments: 'none' | 'all' | 'optimal';
  setMergeAttachments: React.Dispatch<React.SetStateAction<'none' | 'all' | 'optimal'>>;
  // Styling States
  bodyFontFamily: string;
  setBodyFontFamily: React.Dispatch<React.SetStateAction<string>>;
  emailFormat: 'modern' | 'formal' | 'plain';
  setEmailFormat: React.Dispatch<React.SetStateAction<'modern' | 'formal' | 'plain'>>;
  paragraphAlign: 'justify' | 'left';
  setParagraphAlign: React.Dispatch<React.SetStateAction<'justify' | 'left'>>;

  // Bio Singkat States
  includeBio: boolean;
  setIncludeBio: React.Dispatch<React.SetStateAction<boolean>>;
  bioNama: string;
  setBioNama: React.Dispatch<React.SetStateAction<string>>;
  bioTtl: string;
  setBioTtl: React.Dispatch<React.SetStateAction<string>>;
  bioAlamat: string;
  setBioAlamat: React.Dispatch<React.SetStateAction<string>>;
  senderLocation: string;
  setSenderLocation: React.Dispatch<React.SetStateAction<string>>;
  bioTelp: string;
  setBioTelp: React.Dispatch<React.SetStateAction<string>>;
  bioPendidikan: string;
  setBioPendidikan: React.Dispatch<React.SetStateAction<string>>;
  bioJurusan: string;
  setBioJurusan: React.Dispatch<React.SetStateAction<string>>;

  // Documents
  cvOption: 'default' | 'upload' | 'none';
  setCvOption: React.Dispatch<React.SetStateAction<'default' | 'upload' | 'none'>>;
  cvFile: File | null;
  setCvFile: React.Dispatch<React.SetStateAction<File | null>>;
  cvName: string;
  setCvName: React.Dispatch<React.SetStateAction<string>>;

  cvAtsOption: 'default' | 'none';
  setCvAtsOption: React.Dispatch<React.SetStateAction<'default' | 'none'>>;
  cvAtsName: string;
  setCvAtsName: React.Dispatch<React.SetStateAction<string>>;
  
  portofolioOption: 'default' | 'upload' | 'none';
  setPortofolioOption: React.Dispatch<React.SetStateAction<'default' | 'upload' | 'none'>>;
  portofolioFile: File | null;
  setPortofolioFile: React.Dispatch<React.SetStateAction<File | null>>;
  portofolioName: string;
  setPortofolioName: React.Dispatch<React.SetStateAction<string>>;
  
  paklaringOption: 'default' | 'upload' | 'none';
  setPaklaringOption: React.Dispatch<React.SetStateAction<'default' | 'upload' | 'none'>>;
  paklaringFile: File | null;
  setPaklaringFile: React.Dispatch<React.SetStateAction<File | null>>;
  paklaringName: string;
  setPaklaringName: React.Dispatch<React.SetStateAction<string>>;

  sertifikatKompetensiAkademikOption: 'default' | 'upload' | 'none';
  setSertifikatKompetensiAkademikOption: React.Dispatch<React.SetStateAction<'default' | 'upload' | 'none'>>;
  sertifikatKompetensiAkademikFile: File | null;
  setSertifikatKompetensiAkademikFile: React.Dispatch<React.SetStateAction<File | null>>;
  sertifikatKompetensiAkademikName: string;
  setSertifikatKompetensiAkademikName: React.Dispatch<React.SetStateAction<string>>;

  sertifikatKompetensiBisnisDigitalOption: 'default' | 'upload' | 'none';
  setSertifikatKompetensiBisnisDigitalOption: React.Dispatch<React.SetStateAction<'default' | 'upload' | 'none'>>;
  sertifikatKompetensiBisnisDigitalFile: File | null;
  setSertifikatKompetensiBisnisDigitalFile: React.Dispatch<React.SetStateAction<File | null>>;
  sertifikatKompetensiBisnisDigitalName: string;
  setSertifikatKompetensiBisnisDigitalName: React.Dispatch<React.SetStateAction<string>>;

  sertifikatKompetensiKepemimpinanOption: 'default' | 'upload' | 'none';
  setSertifikatKompetensiKepemimpinanOption: React.Dispatch<React.SetStateAction<'default' | 'upload' | 'none'>>;
  sertifikatKompetensiKepemimpinanFile: File | null;
  setSertifikatKompetensiKepemimpinanFile: React.Dispatch<React.SetStateAction<File | null>>;
  sertifikatKompetensiKepemimpinanName: string;
  setSertifikatKompetensiKepemimpinanName: React.Dispatch<React.SetStateAction<string>>;

  sertifikatKompetensiPublicSpeakingOption: 'default' | 'upload' | 'none';
  setSertifikatKompetensiPublicSpeakingOption: React.Dispatch<React.SetStateAction<'default' | 'upload' | 'none'>>;
  sertifikatKompetensiPublicSpeakingFile: File | null;
  setSertifikatKompetensiPublicSpeakingFile: React.Dispatch<React.SetStateAction<File | null>>;
  sertifikatKompetensiPublicSpeakingName: string;
  setSertifikatKompetensiPublicSpeakingName: React.Dispatch<React.SetStateAction<string>>;

  sertifikatPrestasiOption: 'default' | 'upload' | 'none';
  setSertifikatPrestasiOption: React.Dispatch<React.SetStateAction<'default' | 'upload' | 'none'>>;
  sertifikatPrestasiFile: File | null;
  setSertifikatPrestasiFile: React.Dispatch<React.SetStateAction<File | null>>;
  sertifikatPrestasiName: string;
  setSertifikatPrestasiName: React.Dispatch<React.SetStateAction<string>>;

  ijazahOption: 'default' | 'upload' | 'none';
  setIjazahOption: React.Dispatch<React.SetStateAction<'default' | 'upload' | 'none'>>;
  ijazahFile: File | null;
  setIjazahFile: React.Dispatch<React.SetStateAction<File | null>>;
  ijazahName: string;
  setIjazahName: React.Dispatch<React.SetStateAction<string>>;

  attachedFilesList: AttachedFile[];
  attachmentNamePreview: string;

  // Dynamic preview states
  subjectPreview: string;
  bodyPreview: string;

  // Dispatch pipeline
  isSending: boolean;
  sendProgress: number;
  sendError: string | null;
  logs: string[];
  successMsg: boolean;
  autoLogToTracker: boolean;
  setAutoLogToTracker: React.Dispatch<React.SetStateAction<boolean>>;
  renderedHTML: string;

  // Preview sections
  previewSections: { tertuju: boolean; isi: boolean; lampiran: boolean };
  previewPdf: { url: string; name: string } | null;
  togglePreviewSection: (section: 'tertuju' | 'isi' | 'lampiran') => void;
  openPdfPreview: (fileData: AttachedFile) => void;
  closePdfPreview: () => void;

  // Actions
  handleCVChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePortofolioChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePaklaringChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSertifikatKompetensiAkademikChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSertifikatKompetensiBisnisDigitalChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSertifikatKompetensiKepemimpinanChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSertifikatKompetensiPublicSpeakingChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSertifikatPrestasiChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleIjazahChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSaveDraft: (saveAsNew?: boolean) => void;
  handleSendBulk: () => Promise<void>;
  handleDispatch: (e?: React.FormEvent, isTest?: boolean) => Promise<void>;
  handleCancelSend: () => void;
  handleDownloadPDF: () => Promise<void>;
  handleEditDraft: (draft: any) => void;
  resetForm: () => void;
}
