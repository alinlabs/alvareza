import { PresetMatchingRule } from './types';
import { adminSecretariatRules } from './admin_secretariat';
import { operationsRetailRules } from './operations_retail';
import { projectPmoRules } from './project_pmo';
import { businessSalesRules } from './business_sales';
import { supplyChainLogisticsRules } from './supply_chain_logistics';
import { hrTalentRules } from './hr_talent';
import { marketingCxRules } from './marketing_cx';
import { financeAccountingRules } from './finance_accounting';
import { digitalTechRules } from './digital_tech';
import { strategicConsultingRules } from './strategic_consulting';
import { featuredRules } from './featured';

export * from './types';
export * from './admin_secretariat';
export * from './operations_retail';
export * from './project_pmo';
export * from './business_sales';
export * from './supply_chain_logistics';
export * from './hr_talent';
export * from './marketing_cx';
export * from './finance_accounting';
export * from './digital_tech';
export * from './strategic_consulting';
export * from './featured';
export * from './matcher';

export const BILINGUAL_PRESET_RULES: PresetMatchingRule[] = [
  ...adminSecretariatRules,
  ...operationsRetailRules,
  ...projectPmoRules,
  ...businessSalesRules,
  ...supplyChainLogisticsRules,
  ...hrTalentRules,
  ...marketingCxRules,
  ...financeAccountingRules,
  ...digitalTechRules,
  ...strategicConsultingRules,
  ...featuredRules,
];
