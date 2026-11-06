import { PresetMatchingRule } from '../types';
import { hrRulesEn, hrSynonymsEn } from './hr';
import { operationsRulesEn, operationsSynonymsEn } from './operations';
import { pmoRulesEn, pmoSynonymsEn } from './pmo';
import { adminRulesEn, adminSynonymsEn } from './admin';
import { marketingRulesEn, marketingSynonymsEn } from './marketing';
import { salesRulesEn, salesSynonymsEn } from './sales';
import { financeRulesEn, financeSynonymsEn } from './finance';
import { logisticsRulesEn, logisticsSynonymsEn } from './logistics';
import { techRulesEn, techSynonymsEn } from './tech';
import { consultingRulesEn, consultingSynonymsEn } from './consulting';
import { featuredRulesEn, featuredSynonymsEn } from './featured';

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

// All English Preset Rules Combined
export const ALL_EN_RULES: PresetMatchingRule[] = [
  ...hrRulesEn,
  ...operationsRulesEn,
  ...pmoRulesEn,
  ...adminRulesEn,
  ...marketingRulesEn,
  ...salesRulesEn,
  ...financeRulesEn,
  ...logisticsRulesEn,
  ...techRulesEn,
  ...consultingRulesEn,
  ...featuredRulesEn,
];

// Consolidated English Synonyms Dictionary
export const SINONIM_ENGLISH: Record<string, string[]> = {
  ...hrSynonymsEn,
  ...operationsSynonymsEn,
  ...pmoSynonymsEn,
  ...adminSynonymsEn,
  ...marketingSynonymsEn,
  ...salesSynonymsEn,
  ...financeSynonymsEn,
  ...logisticsSynonymsEn,
  ...techSynonymsEn,
  ...consultingSynonymsEn,
  ...featuredSynonymsEn,
};
