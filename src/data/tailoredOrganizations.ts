import { cvData } from './cvData';
import { cvDataEn } from './cvDataEn';
import { PRESET_ORGANIZATIONS_ID } from './presetOrganizationsId';
import { PRESET_ORGANIZATIONS_EN } from './presetOrganizationsEn';
import { Organization } from '../types';

/**
 * Returns tailored organization descriptions based on the active role preset and language.
 */
export function getTailoredOrganizations(
  presetKey?: string,
  lang: 'id' | 'en' = 'id'
): Organization[] {
  const baseOrgs = lang === 'en' ? cvDataEn.organizations : cvData.organizations;
  const key = (presetKey || 'optimal').toLowerCase();

  const dataset = lang === 'en' ? PRESET_ORGANIZATIONS_EN : PRESET_ORGANIZATIONS_ID;

  let targetList = dataset[key];
  if (!targetList) {
    let fallbackKey = 'optimal';
    if (key.includes('oper') || key.includes('branch') || key.includes('supply') || key.includes('logist')) {
      fallbackKey = 'business_operations';
    } else if (key.includes('hr') || key.includes('people') || key.includes('talent')) {
      fallbackKey = 'hr_operations';
    } else if (key.includes('proj') || key.includes('delivery')) {
      fallbackKey = 'project_management';
    } else if (key.includes('strateg') || key.includes('exec') || key.includes('general')) {
      fallbackKey = 'strategic_management';
    } else if (key.includes('finan') || key.includes('account') || key.includes('tax') || key.includes('audit')) {
      fallbackKey = 'finance_accounting';
    } else if (key.includes('market') || key.includes('brand') || key.includes('pr') || key.includes('public_rel') || key.includes('sales')) {
      fallbackKey = 'marketing';
    } else if (key.includes('digit') || key.includes('tech') || key.includes('soft') || key.includes('code') || key.includes('trans')) {
      fallbackKey = 'digital_transformation';
    }
    targetList = dataset[fallbackKey] || dataset['optimal'];
  }

  if (targetList && targetList.length > 0) {
    return baseOrgs.map((baseOrg, idx) => {
      const tailoredOrg = targetList[idx];
      if (tailoredOrg) {
        return {
          ...baseOrg,
          role: tailoredOrg.role || baseOrg.role,
          description: tailoredOrg.description || baseOrg.description,
        };
      }
      return baseOrg;
    });
  }

  return baseOrgs;
}
