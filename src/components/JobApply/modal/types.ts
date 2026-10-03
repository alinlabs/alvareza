import { GasAccountConfig } from '../../../types/gasSender';
import { EmailLanguage, JobScanResult } from '../../../types/jobApplication';

export interface CustomAttachmentItem {
  id: string;
  certId?: string;
  name: string;
  size: number;
  mimeType: string;
  base64: string;
}

export type CvDesignType = 'block' | 'line' | 'badge' | 'plain';
export type CvTextAlignType = 'left' | 'justify';

export interface HeaderColorPreset {
  hex: string;
  label: string;
}
