export interface JobApplicationDraftItem {
  id: string;
  createdAt: string;
  updatedAt: string;
  companyName: string;
  jobTitle: string;
  jobDesk?: string;
  kualifikasi?: string;
  recipientEmail: string;
  ccEmail?: string;
  subject: string;
  emailBody: string;
  language: 'id' | 'en';
  presetKey: string;
  emailOption: string;
  cvDesignPreset?: 'block' | 'line' | 'badge' | 'plain';
  cvHeaderColor?: string;
  cvTextAlign?: 'left' | 'justify';
  isCoverLetterActive?: boolean;
  coverLetterDate?: string;
  isCoverLetterDateAuto?: boolean;
  coverLetterCity?: string;
  isCoverLetterCityActive?: boolean;
  isColorPrint?: boolean;
  isPortfolioCompressed?: boolean;
  status: 'draft' | 'queued' | 'sending' | 'sent' | 'failed';
  selectedIdentityIds?: string[];
  isIdentityColorPrint?: boolean;
  isIdentitySeparatePhotoPrint?: boolean;
  selectedAcademicIds?: string[];
  selectedPortfolioSlideIds?: string[];
  selectedCertIds?: string[];
  selectedAwardIds?: string[];
  customAttachmentNames?: string[];
  lastError?: string;
  sentAt?: string;
  sentByEmail?: string;
}

export interface BulkSendProgressState {
  isActive: boolean;
  isPaused: boolean;
  total: number;
  currentIndex: number;
  successCount: number;
  failedCount: number;
  currentDraftId: string | null;
  currentDraftName: string;
  countdownSeconds: number;
  delayBetweenSends: number; // in seconds, default 8
}
