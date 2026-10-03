export interface GasAccountConfig {
  id: string; // e.g. 'halo', 'work', 'career', 'business', 'studio', 'alinlabs'
  name: string; // 'Alvareza Hilka Pratama'
  email: string;
  roleBadge: string;
  webAppUrl: string;
  isActive: boolean;
  totalSent: number;
  lastSentAt?: string;
  status: 'ready' | 'needs_url' | 'testing' | 'active' | 'error';
  lastError?: string;
}

export type GasSendMode = 'rotate' | 'manual';

export interface GasAttachment {
  filename: string;
  mimeType: string;
  base64: string;
  sizeBytes?: number;
}

export interface GasEmailPayload {
  gasUrl?: string; // Optional if backend resolves from account
  accountId?: string;
  targetEmail: string;
  companyName?: string;
  jobTitle?: string;
  subject: string;
  body?: string;
  bodyText?: string;
  bodyHtml?: string;
  senderName?: string;
  cc?: string;
  bcc?: string;
  attachments?: GasAttachment[];
}

export interface GasSendHistoryItem {
  id: string;
  timestamp: string;
  targetEmail: string;
  companyName: string;
  jobTitle: string;
  subject: string;
  senderEmail: string;
  senderAccountId: string;
  status: 'success' | 'failed';
  errorMessage?: string;
  hasAttachment: boolean;
  attachmentName?: string;
}

export interface GasSendResponse {
  success: boolean;
  message?: string;
  error?: string;
  senderEmail?: string;
  accountId?: string;
  quotaWarning?: string;
}

export const INITIAL_6_GAS_ACCOUNTS: GasAccountConfig[] = [
  {
    id: 'halo',
    name: 'Alvareza Hilka Pratama',
    email: 'halo.alvareza@gmail.com',
    roleBadge: 'Primer / Personal Brand',
    webAppUrl: 'https://script.google.com/macros/s/AKfycbzO0Wu76ugfHFx25jMf5akzYM9JfPFYLPkkGnmaj4Z-OBqLIXLA4VhoGrk1W1aOL68-Rw/exec',
    isActive: true,
    totalSent: 0,
    status: 'ready',
  },
  {
    id: 'work',
    name: 'Alvareza Hilka Pratama',
    email: 'alvareza.work@gmail.com',
    roleBadge: 'Professional / Work',
    webAppUrl: 'https://script.google.com/macros/s/AKfycbxLRHgwZgOOzcHahZPGLrqhf5Cqw2P-Po5CIctwB6YNuYLcrP727QvbQxc47BZhOQlQfQ/exec',
    isActive: true,
    totalSent: 0,
    status: 'ready',
  },
  {
    id: 'alinlabs',
    name: 'Alvareza Hilka Pratama',
    email: 'alvareza.alinlabs@gmail.com',
    roleBadge: 'Tech, Automation & Labs',
    webAppUrl: 'https://script.google.com/macros/s/AKfycbyZJi1L2cjD2G7lBSc5FiBn0Apny3N1h2WU_jnnOTpZXAj9i2Nw5vkmUdambpktFV-m/exec',
    isActive: true,
    totalSent: 0,
    status: 'ready',
  },
  {
    id: 'career',
    name: 'Alvareza Hilka Pratama',
    email: 'alvareza.career@gmail.com',
    roleBadge: 'Career & ATS Recruitment',
    webAppUrl: 'https://script.google.com/macros/s/AKfycbw1G-PJRhu_WZWysxaTKogU2HYn0egIKXK2qyFqzG4CSqPIeUFPgXdeLZx-w1GvvKft/exec',
    isActive: true,
    totalSent: 0,
    status: 'ready',
  },
  {
    id: 'business',
    name: 'Alvareza Hilka Pratama',
    email: 'alvareza.business@gmail.com',
    roleBadge: 'Business & Operations',
    webAppUrl: 'https://script.google.com/macros/s/AKfycbyTOIm4zJTb5fk3q50kaOVAVKxV_A3M5pR2oFi4rrahMikT7_GXLXBe4Z3wDDm7qvNN/exec',
    isActive: true,
    totalSent: 0,
    status: 'ready',
  },
  {
    id: 'studio',
    name: 'Alvareza Hilka Pratama',
    email: 'alvarezastudio@gmail.com',
    roleBadge: 'Creative & Digital Solutions',
    webAppUrl: 'https://script.google.com/macros/s/AKfycbw2DOOSTJ06t-JocDwCtS3cyzYCEfRLoHQwB5fQ9GgKWLmWZJRZZ1-uPKZvI3ryubYQ/exec',
    isActive: true,
    totalSent: 0,
    status: 'ready',
  },
];
