export interface JobScanResult {
  companyName: string;
  jobTitle: string;
  recipientEmail: string;
  recipientPhone?: string;
  formatSubjectNotice?: string;
  keyRequirements: string[];
  emailSubject: string;
  emailBody: string;
  language?: EmailLanguage;
  rawExtractedText?: string;
  notes?: string;
  isAi?: boolean;
  isFallback?: boolean;
}

export type EmailTone = 'formal' | 'concise' | 'confident';
export type EmailLanguage = 'id' | 'en';

export interface JobScanTextRequest {
  extractedText: string;
  filename?: string;
  language?: EmailLanguage;
  tone?: EmailTone;
}
