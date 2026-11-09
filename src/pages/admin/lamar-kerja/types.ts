import { JobScanResult } from '../../../types/jobApplication';
import { ItemSelectionState } from '../../../data/preset/ItemSelections';

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
  cvItems?: ItemSelectionState | null;
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
