import { PresetMatchingRule } from '../types';
import { hrRulesIn, hrSynonymsIn } from './hr';
import { operationsRulesIn, operationsSynonymsIn } from './operations';
import { pmoRulesIn, pmoSynonymsIn } from './pmo';
import { adminRulesIn, adminSynonymsIn } from './admin';
import { marketingRulesIn, marketingSynonymsIn } from './marketing';
import { salesRulesIn, salesSynonymsIn } from './sales';
import { financeRulesIn, financeSynonymsIn } from './finance';
import { logisticsRulesIn, logisticsSynonymsIn } from './logistics';
import { techRulesIn, techSynonymsIn } from './tech';
import { consultingRulesIn, consultingSynonymsIn } from './consulting';
import { featuredRulesIn, featuredSynonymsIn } from './featured';

// Export all individual domain modules
export * from './hr';
export * from './operations';
export * from './pmo';
export * from './admin';
export * from './marketing';
export * from './sales';
export * from './finance';
export * from './logistics';
export * from './tech';
export * from './consulting';
export * from './featured';

// All Indonesian Preset Rules Combined
export const ALL_IN_RULES: PresetMatchingRule[] = [
  ...hrRulesIn,
  ...operationsRulesIn,
  ...pmoRulesIn,
  ...adminRulesIn,
  ...marketingRulesIn,
  ...salesRulesIn,
  ...financeRulesIn,
  ...logisticsRulesIn,
  ...techRulesIn,
  ...consultingRulesIn,
  ...featuredRulesIn,
];

// Consolidated Indonesian Synonyms Dictionary
export const SINONIM_INDONESIA: Record<string, string[]> = {
  ...hrSynonymsIn,
  ...operationsSynonymsIn,
  ...pmoSynonymsIn,
  ...adminSynonymsIn,
  ...marketingSynonymsIn,
  ...salesSynonymsIn,
  ...financeSynonymsIn,
  ...logisticsSynonymsIn,
  ...techSynonymsIn,
  ...consultingSynonymsIn,
  ...featuredSynonymsIn,
};
