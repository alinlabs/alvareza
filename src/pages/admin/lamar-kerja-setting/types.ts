import { GasAccountConfig } from '../../../types/gasSender';

export interface GasSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccountsUpdated?: () => void;
}

export type LamarKerjaSettingsModalProps = GasSettingsModalProps;
