import { JobScanResult } from '../../../types/jobApplication';

export interface JobApplyModalSheetProps {
  isOpen: boolean;
  onClose: () => void;
  selectedFile: File | null;
  scanResult: JobScanResult | null;
  isScanning: boolean;
  scanStage?: 'idle' | 'ocr' | 'analyzing';
  ocrProgress?: number;
  onRescanFile: (file: File) => void;
  onClearFile?: () => void;
  error?: string | null;
}

export interface JobApplyBottomBarProps {
  onOpenApplyModal: () => void;
  isLoading?: boolean;
}

export interface LamarKerjaContainerProps extends JobApplyModalSheetProps {
  showBottomBar?: boolean;
  onOpenApplyModal?: () => void;
}
