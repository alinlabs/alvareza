import { GasSendHistoryItem } from '../../../types/gasSender';

export interface GasHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectForEdit?: (item: GasSendHistoryItem) => void;
}

export type LamarKerjaHistoryModalProps = GasHistoryModalProps;
