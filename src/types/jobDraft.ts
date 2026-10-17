export interface JobApplicationDraftItem {
  id: string;
  createdAt: string;
  updatedAt: string;
  companyName: string;
  jobTitle: string;
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
  status: 'draft' | 'queued' | 'sending' | 'sent' | 'failed';
  selectedAcademicIds?: string[];
  selectedPortfolioSlideIds?: string[];
  selectedCertIds?: string[];
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
