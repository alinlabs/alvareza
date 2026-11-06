import { JobScanResult } from '../../../types/jobApplication';

export interface ModalSheetProps {
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

export type JobApplyModalSheetProps = ModalSheetProps;

export interface BottomBarProps {
  onOpenApplyModal: () => void;
  isLoading?: boolean;
}

export type JobApplyBottomBarProps = BottomBarProps;

export interface LamarKerjaContainerProps extends ModalSheetProps {
  showBottomBar?: boolean;
  onOpenApplyModal?: () => void;
}
