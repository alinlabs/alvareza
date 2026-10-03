export type { ItemSelectionState, SectionOrdersState } from './presetSelectionHelper';
export {
  defaultItemSelection,
  defaultSectionOrders,
  createSelection,
} from './presetSelectionHelper';
export { PRESET_SELECTION_REGISTRY } from './presetRegistryData';
export { getPresetSectionOrders } from './presetSectionOrders';

import { ItemSelectionState, defaultItemSelection } from './presetSelectionHelper';
import { PRESET_SELECTION_REGISTRY } from './presetRegistryData';
import { getPresetKeyFromCodeOrKey } from './rolePresetsConfig';

/**
 * Retrieves the item selection state for a given preset key or 3-letter code.
 */
export function getItemSelectionForPreset(presetKey: string): ItemSelectionState {
  if (!presetKey) {
    return PRESET_SELECTION_REGISTRY.optimal;
  }

  const rawKey = presetKey.trim();
  if (rawKey.toLowerCase() === 'all') {
    return { ...defaultItemSelection };
  }

  // 1. Direct key match (e.g. 'sales_executive', 'optimal')
  if (PRESET_SELECTION_REGISTRY[rawKey]) {
    return PRESET_SELECTION_REGISTRY[rawKey];
  }

  const lower = rawKey.toLowerCase();
  if (PRESET_SELECTION_REGISTRY[lower]) {
    return PRESET_SELECTION_REGISTRY[lower];
  }

  // 2. Resolve code (e.g. 'SLS' -> 'sales_executive', 'HRM' -> 'hr_specialist')
  const resolved = getPresetKeyFromCodeOrKey(rawKey);
  if (resolved && PRESET_SELECTION_REGISTRY[resolved]) {
    return PRESET_SELECTION_REGISTRY[resolved];
  }

  // Fallback to optimal
  return PRESET_SELECTION_REGISTRY.optimal;
}

export const optimalItemSelection: ItemSelectionState = getItemSelectionForPreset('optimal');
