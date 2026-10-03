import { CVExperience } from '../types';
import { presetExperiencesId } from './presetExperiencesId';
import { presetExperiencesEn } from './presetExperiencesEn';
import { cvData } from './cvData';
import { cvDataEn } from './cvDataEn';
import { ALL_ROLE_PRESETS } from './rolePresetsConfig';

/**
 * Maps any preset key (including sub-role preset options and codes) to its matching base dataset in dataPool.
 */
export function resolvePresetBaseKey(presetKey?: string | null): string {
  if (!presetKey) return 'optimal';
  const rawKey = presetKey.toLowerCase().trim();

  // Direct match in dataset
  if (rawKey in presetExperiencesId) return rawKey;

  // Exact match from ALL_ROLE_PRESETS config
  const matched = ALL_ROLE_PRESETS.find(
    (p) => p.key.toLowerCase() === rawKey || p.code.toLowerCase() === rawKey
  );

  if (matched) {
    if (matched.key === 'hospital_office_admin' || matched.code.toLowerCase() === 'hos') return 'hospital_office_admin';
    if (matched.key === 'branch_manager' || matched.code.toLowerCase() === 'brn') return 'branch_manager';
    if (matched.key === 'manufacturing_operations' || matched.code.toLowerCase() === 'mfg' || matched.code.toLowerCase() === 'qac') return 'manufacturing_operations';
    if (matched.code.toLowerCase() === 'sls' || matched.code.toLowerCase() === 'sop' || matched.code.toLowerCase() === 'tnd') return 'sales_executive';
    if (matched.code.toLowerCase() === 'prs') return 'public_relations';
    if (matched.code.toLowerCase() === 'dig') return 'digital_transformation';

    switch (matched.groupKey) {
      case 'hr_talent':
        return 'hr_operations';
      case 'admin_secretariat':
        if (matched.key === 'hospital_office_admin') return 'hospital_office_admin';
        return 'office_administration';
      case 'operations_retail':
        if (matched.key === 'branch_manager' || matched.key === 'retail_store_operations' || matched.key === 'franchise_retail_expansion') return 'branch_manager';
        if (matched.key === 'manufacturing_operations' || matched.key === 'qa_qc_compliance' || matched.key === 'operational_excellence') return 'manufacturing_operations';
        return 'business_operations';
      case 'project_pmo':
        return 'project_management';
      case 'business_sales':
        if (matched.key === 'sales_executive' || matched.key === 'enterprise_sales_lead' || matched.key === 'sales_operations_enablement' || matched.key === 'tender_bid_specialist') return 'sales_executive';
        return 'business_development';
      case 'supply_chain_logistics':
        return 'supply_chain_logistics';
      case 'marketing_cx':
        if (matched.key === 'public_relations') return 'public_relations';
        return 'marketing';
      case 'finance_accounting':
        return 'finance_accounting';
      case 'digital_tech':
      case 'tech_software':
        if (matched.key === 'digital_transformation' || matched.key === 'business_systems_analyst' || matched.key === 'data_business_reporting' || matched.key === 'erp_crm_implementation' || matched.key === 'bi_dashboard_specialist') return 'digital_transformation';
        return 'software_development';
      case 'strategic_consulting':
      case 'strategy_consulting':
        return 'strategic_management';
      default:
        break;
    }
  }

  // HR & Talent presets
  if (
    rawKey.includes('hr') ||
    rawKey.includes('personnel') ||
    rawKey.includes('talent') ||
    rawKey.includes('recruit') ||
    rawKey.includes('training') ||
    rawKey.includes('comben') ||
    rawKey.includes('payroll') ||
    rawKey.includes('industrial_rel') ||
    rawKey.includes('employer_brand') ||
    rawKey.includes('lnd') ||
    rawKey.includes('cnb') ||
    rawKey.includes('hra') ||
    rawKey.includes('hrs')
  ) {
    return 'hr_operations';
  }

  // Healthcare Admin
  if (rawKey.includes('hospital') || rawKey.includes('health') || rawKey.includes('hos')) {
    return 'hospital_office_admin';
  }

  // Admin & Secretariat presets
  if (
    rawKey.includes('admin') ||
    rawKey.includes('secretar') ||
    rawKey.includes('executive_assistant') ||
    rawKey.includes('legal') ||
    rawKey.includes('clerk') ||
    rawKey.includes('data_entry') ||
    rawKey.includes('adm') ||
    rawKey.includes('ast') ||
    rawKey.includes('lgl') ||
    rawKey.includes('sad') ||
    rawKey.includes('fba') ||
    rawKey.includes('pra') ||
    rawKey.includes('ppa') ||
    rawKey.includes('dea') ||
    rawKey.includes('wha')
  ) {
    return 'office_administration';
  }

  // Supply Chain, Logistics, Gudang & Procurement presets
  if (
    rawKey.includes('supply') ||
    rawKey.includes('logis') ||
    rawKey.includes('warehouse') ||
    rawKey.includes('ppic') ||
    rawKey.includes('procu') ||
    rawKey.includes('purchas') ||
    rawKey.includes('inventory') ||
    rawKey.includes('fleet') ||
    rawKey.includes('vendor') ||
    rawKey.includes('demand') ||
    rawKey.includes('scm') ||
    rawKey.includes('ppc') ||
    rawKey.includes('prc') ||
    rawKey.includes('whs') ||
    rawKey.includes('ldc') ||
    rawKey.includes('vmr') ||
    rawKey.includes('dip')
  ) {
    return 'supply_chain_logistics';
  }

  // Finance, Accounting & Tax presets
  if (
    rawKey.includes('finan') ||
    rawKey.includes('account') ||
    rawKey.includes('tax') ||
    rawKey.includes('billing') ||
    rawKey.includes('audit') ||
    rawKey.includes('cost') ||
    rawKey.includes('pricing') ||
    rawKey.includes('ap_ar') ||
    rawKey.includes('fac') ||
    rawKey.includes('tao') ||
    rawKey.includes('apa') ||
    rawKey.includes('pca') ||
    rawKey.includes('iaf') ||
    rawKey.includes('fin') ||
    rawKey.includes('acc')
  ) {
    return 'finance_accounting';
  }

  // Project Management & PMO presets
  if (
    rawKey.includes('proj') ||
    rawKey.includes('pmo') ||
    rawKey.includes('scrum') ||
    rawKey.includes('agile') ||
    rawKey.includes('event') ||
    rawKey.includes('nonprofit') ||
    rawKey.includes('implementation') ||
    rawKey.includes('itp') ||
    rawKey.includes('evm') ||
    rawKey.includes('ngo') ||
    rawKey.includes('asm') ||
    rawKey.includes('pom') ||
    rawKey.includes('ipm') ||
    rawKey.includes('cpm')
  ) {
    return 'project_management';
  }

  // Sales & Business Development presets
  if (
    rawKey.includes('sales') ||
    rawKey.includes('biz') ||
    rawKey.includes('business_dev') ||
    rawKey.includes('account_manager') ||
    rawKey.includes('partnership') ||
    rawKey.includes('client_success') ||
    rawKey.includes('tender') ||
    rawKey.includes('bdv') ||
    rawKey.includes('sls') ||
    rawKey.includes('kam') ||
    rawKey.includes('gov') ||
    rawKey.includes('csm') ||
    rawKey.includes('csd') ||
    rawKey.includes('cse') ||
    rawKey.includes('sop') ||
    rawKey.includes('tnd')
  ) {
    if (rawKey.includes('sls') || rawKey.includes('sop') || rawKey.includes('tnd')) {
      return 'sales_executive';
    }
    return 'business_development';
  }

  // Tech, Software & Digital presets
  if (
    rawKey.includes('soft') ||
    rawKey.includes('dev') ||
    rawKey.includes('code') ||
    rawKey.includes('tech') ||
    rawKey.includes('digit') ||
    rawKey.includes('system') ||
    rawKey.includes('data') ||
    rawKey.includes('erp') ||
    rawKey.includes('bi_') ||
    rawKey.includes('frontend') ||
    rawKey.includes('product') ||
    rawKey.includes('bsa') ||
    rawKey.includes('dbr') ||
    rawKey.includes('fed') ||
    rawKey.includes('pdm') ||
    rawKey.includes('eci') ||
    rawKey.includes('bds') ||
    rawKey.includes('swe') ||
    rawKey.includes('dig')
  ) {
    if (rawKey.includes('dig')) return 'digital_transformation';
    return 'software_development';
  }

  // PR & Public Relations
  if (rawKey.includes('pr') || rawKey.includes('public_rel') || rawKey.includes('media') || rawKey.includes('humas') || rawKey.includes('prs')) {
    return 'public_relations';
  }

  // Marketing, Marcom & Customer Service presets
  if (
    rawKey.includes('market') ||
    rawKey.includes('brand') ||
    rawKey.includes('marcom') ||
    rawKey.includes('ads') ||
    rawKey.includes('ecom') ||
    rawKey.includes('social') ||
    rawKey.includes('customer_service') ||
    rawKey.includes('mkt') ||
    rawKey.includes('cso') ||
    rawKey.includes('mcb') ||
    rawKey.includes('pma') ||
    rawKey.includes('eco') ||
    rawKey.includes('smc') ||
    rawKey.includes('gml') ||
    rawKey.includes('bmc')
  ) {
    return 'marketing';
  }

  // Operations & Retail presets
  if (rawKey.includes('manufac') || rawKey.includes('pabrik') || rawKey.includes('plant') || rawKey.includes('qc') || rawKey.includes('qa') || rawKey.includes('mfg') || rawKey.includes('qac')) {
    return 'manufacturing_operations';
  }
  if (rawKey.includes('branch') || rawKey.includes('cabang') || rawKey.includes('brn')) {
    return 'branch_manager';
  }
  if (
    rawKey.includes('operat') ||
    rawKey.includes('retail') ||
    rawKey.includes('store') ||
    rawKey.includes('ga') ||
    rawKey.includes('affair') ||
    rawKey.includes('field') ||
    rawKey.includes('utility') ||
    rawKey.includes('ops') ||
    rawKey.includes('rtl') ||
    rawKey.includes('gaf') ||
    rawKey.includes('fld') ||
    rawKey.includes('utl') ||
    rawKey.includes('opx') ||
    rawKey.includes('som') ||
    rawKey.includes('cos') ||
    rawKey.includes('fre')
  ) {
    return 'business_operations';
  }

  // Strategy & Consulting presets
  if (rawKey.includes('consult') || rawKey.includes('strateg') || rawKey.includes('turnaround') || rawKey.includes('bts') || rawKey.includes('pal') || rawKey.includes('mgt')) {
    return 'strategic_management';
  }

  return 'optimal';
}

/**
 * Returns the permitted experience order for the preset.
 */
export function getPresetExperienceOrder(presetKey?: string | null): string[] {
  const baseKey = resolvePresetBaseKey(presetKey);
  if (baseKey === 'marketing' || baseKey === 'public_relations') {
    return ['exp-4', 'exp-3', 'exp-2', 'exp-1'];
  }
  return ['exp-1', 'exp-2', 'exp-4', 'exp-3'];
}

/**
 * Common, realistic job titles used in Indonesia (and English equivalents)
 * for specific role presets and codes.
 */
const SUBROLE_CUSTOM_ROLE_TITLES: Record<string, Record<string, { id: string; en: string }>> = {
  // HR & Talent specific roles - keeping Perdana Jatiputra as Corporate Relations & Account Manager, Multi Sejahtera as Manager, and Jaya Baru as Supervisor
  hr_operations: {
    'exp-1': { id: 'HR Manager', en: 'HR Manager' },
    'exp-2': { id: 'Corporate Relations & Account Manager', en: 'Corporate Relations & Account Manager' },
    'exp-4': { id: 'Store Operations & Training Manager', en: 'Store Operations & Training Manager' },
    'exp-3': { id: 'People & Marketing Communications Supervisor', en: 'People & Marketing Communications Supervisor' },
  },
  hrs: {
    'exp-1': { id: 'HR Manager', en: 'HR Manager' },
    'exp-2': { id: 'Corporate Relations & Account Manager', en: 'Corporate Relations & Account Manager' },
    'exp-4': { id: 'Store Operations & Training Manager', en: 'Store Operations & Training Manager' },
    'exp-3': { id: 'People & Marketing Communications Supervisor', en: 'People & Marketing Communications Supervisor' },
  },
  talent_acquisition: {
    'exp-1': { id: 'HR Manager', en: 'HR Manager' },
    'exp-2': { id: 'Corporate Relations & Talent Lead', en: 'Corporate Relations & Talent Lead' },
    'exp-4': { id: 'Sales & People Training Manager', en: 'Sales & People Training Manager' },
    'exp-3': { id: 'Marketing & Recruitment Supervisor', en: 'Marketing & Recruitment Supervisor' },
  },
  rec: {
    'exp-1': { id: 'HR Manager', en: 'HR Manager' },
    'exp-2': { id: 'Corporate Relations & Talent Lead', en: 'Corporate Relations & Talent Lead' },
    'exp-4': { id: 'Sales & People Training Manager', en: 'Sales & People Training Manager' },
    'exp-3': { id: 'Marketing & Recruitment Supervisor', en: 'Marketing & Recruitment Supervisor' },
  },
  training_learning_dev: {
    'exp-1': { id: 'Operations & L&D Manager', en: 'Operations & L&D Manager' },
    'exp-2': { id: 'Corporate Relations & Account Manager', en: 'Corporate Relations & Account Manager' },
    'exp-4': { id: 'Sales & Marketing Training Manager', en: 'Sales & Marketing Training Manager' },
    'exp-3': { id: 'Marketing & Training Supervisor', en: 'Marketing & Training Supervisor' },
  },
  lnd: {
    'exp-1': { id: 'Operations & L&D Manager', en: 'Operations & L&D Manager' },
    'exp-2': { id: 'Corporate Relations & Account Manager', en: 'Corporate Relations & Account Manager' },
    'exp-4': { id: 'Sales & Marketing Training Manager', en: 'Sales & Marketing Training Manager' },
    'exp-3': { id: 'Marketing & Training Supervisor', en: 'Marketing & Training Supervisor' },
  },
  compensation_benefits_payroll: {
    'exp-1': { id: 'HR Operations & Payroll Manager', en: 'HR Operations & Payroll Manager' },
    'exp-2': { id: 'Corporate Account & Compensation Specialist', en: 'Corporate Account & Compensation Specialist' },
    'exp-4': { id: 'Store Administration & Payroll Manager', en: 'Store Administration & Payroll Manager' },
    'exp-3': { id: 'Marketing Budget & Administration Supervisor', en: 'Marketing Budget & Administration Supervisor' },
  },
  cnb: {
    'exp-1': { id: 'HR Operations & Payroll Manager', en: 'HR Operations & Payroll Manager' },
    'exp-2': { id: 'Corporate Account & Compensation Specialist', en: 'Corporate Account & Compensation Specialist' },
    'exp-4': { id: 'Store Administration & Payroll Manager', en: 'Store Administration & Payroll Manager' },
    'exp-3': { id: 'Marketing Budget & Administration Supervisor', en: 'Marketing Budget & Administration Supervisor' },
  },
  industrial_relations_compliance: {
    'exp-1': { id: 'HR Operations & Industrial Relations Manager', en: 'HR Operations & Industrial Relations Manager' },
    'exp-2': { id: 'Corporate Relations & Account Manager', en: 'Corporate Relations & Account Manager' },
    'exp-4': { id: 'Store Operations & Compliance Manager', en: 'Store Operations & Compliance Manager' },
    'exp-3': { id: 'Marketing & Operations Supervisor', en: 'Marketing & Operations Supervisor' },
  },
  irl: {
    'exp-1': { id: 'HR Operations & Industrial Relations Manager', en: 'HR Operations & Industrial Relations Manager' },
    'exp-2': { id: 'Corporate Relations & Account Manager', en: 'Corporate Relations & Account Manager' },
    'exp-4': { id: 'Store Operations & Compliance Manager', en: 'Store Operations & Compliance Manager' },
    'exp-3': { id: 'Marketing & Operations Supervisor', en: 'Marketing & Operations Supervisor' },
  },
  organizational_development: {
    'exp-1': { id: 'Operations & Organization Development Manager', en: 'Operations & Organization Development Manager' },
    'exp-2': { id: 'Corporate Relations & Account Manager', en: 'Corporate Relations & Account Manager' },
    'exp-4': { id: 'Store Operations & Workflow Manager', en: 'Store Operations & Workflow Manager' },
    'exp-3': { id: 'Marketing & Organization Supervisor', en: 'Marketing & Organization Supervisor' },
  },
  odd: {
    'exp-1': { id: 'Operations & Organization Development Manager', en: 'Operations & Organization Development Manager' },
    'exp-2': { id: 'Corporate Relations & Account Manager', en: 'Corporate Relations & Account Manager' },
    'exp-4': { id: 'Store Operations & Workflow Manager', en: 'Store Operations & Workflow Manager' },
    'exp-3': { id: 'Marketing & Organization Supervisor', en: 'Marketing & Organization Supervisor' },
  },
  people_analytics_hris: {
    'exp-1': { id: 'Operations & HRIS Lead', en: 'Operations & HRIS Lead' },
    'exp-2': { id: 'Corporate Account & Data Specialist', en: 'Corporate Account & Data Specialist' },
    'exp-4': { id: 'Retail Analytics & Marketing Manager', en: 'Retail Analytics & Marketing Manager' },
    'exp-3': { id: 'Marketing Reporting Supervisor', en: 'Marketing Reporting Supervisor' },
  },
  pas: {
    'exp-1': { id: 'Operations & HRIS Lead', en: 'Operations & HRIS Lead' },
    'exp-2': { id: 'Corporate Account & Data Specialist', en: 'Corporate Account & Data Specialist' },
    'exp-4': { id: 'Retail Analytics & Marketing Manager', en: 'Retail Analytics & Marketing Manager' },
    'exp-3': { id: 'Marketing Reporting Supervisor', en: 'Marketing Reporting Supervisor' },
  },
  hr_personnel_admin: {
    'exp-1': { id: 'HR & Operations Manager', en: 'HR & Operations Manager' },
    'exp-2': { id: 'Corporate Relations & Account Manager', en: 'Corporate Relations & Account Manager' },
    'exp-4': { id: 'Sales & Marketing Training Manager', en: 'Sales & Marketing Training Manager' },
    'exp-3': { id: 'Marketing & Sales Training Supervisor', en: 'Marketing & Sales Training Supervisor' },
  },
  hra: {
    'exp-1': { id: 'HR & Operations Manager', en: 'HR & Operations Manager' },
    'exp-2': { id: 'Corporate Relations & Account Manager', en: 'Corporate Relations & Account Manager' },
    'exp-4': { id: 'Sales & Marketing Training Manager', en: 'Sales & Marketing Training Manager' },
    'exp-3': { id: 'Marketing & Sales Training Supervisor', en: 'Marketing & Sales Training Supervisor' },
  },
  hr_business_partner: {
    'exp-1': { id: 'Operations & HR Business Partner', en: 'Operations & HR Business Partner' },
    'exp-2': { id: 'Corporate Relations & Account Manager', en: 'Corporate Relations & Account Manager' },
    'exp-4': { id: 'Store Operations & People Manager', en: 'Store Operations & People Manager' },
    'exp-3': { id: 'Marketing & People Supervisor', en: 'Marketing & People Supervisor' },
  },
  hbp: {
    'exp-1': { id: 'Operations & HR Business Partner', en: 'Operations & HR Business Partner' },
    'exp-2': { id: 'Corporate Relations & Account Manager', en: 'Corporate Relations & Account Manager' },
    'exp-4': { id: 'Store Operations & People Manager', en: 'Store Operations & People Manager' },
    'exp-3': { id: 'Marketing & People Supervisor', en: 'Marketing & People Supervisor' },
  },
  general_affairs: {
    'exp-1': { id: 'General Affairs & Operations Manager', en: 'General Affairs & Operations Manager' },
    'exp-2': { id: 'Corporate Relation & Account Manager', en: 'Corporate Relations & Account Manager' },
    'exp-4': { id: 'Store Operations & Marketing Manager', en: 'Store Operations & Marketing Manager' },
    'exp-3': { id: 'Marketing & Operations Supervisor', en: 'Marketing & Operations Supervisor' },
  },
  gaf: {
    'exp-1': { id: 'General Affairs & Operations Manager', en: 'General Affairs & Operations Manager' },
    'exp-2': { id: 'Corporate Relation & Account Manager', en: 'Corporate Relations & Account Manager' },
    'exp-4': { id: 'Store Operations & Marketing Manager', en: 'Store Operations & Marketing Manager' },
    'exp-3': { id: 'Marketing & Operations Supervisor', en: 'Marketing & Operations Supervisor' },
  },
  executive_assistant: {
    'exp-1': { id: 'Operations & Executive Support Manager', en: 'Operations & Executive Support Manager' },
    'exp-2': { id: 'Corporate Relation & Account Manager', en: 'Corporate Relations & Account Manager' },
    'exp-4': { id: 'Marketing & Administrative Manager', en: 'Marketing & Administrative Manager' },
    'exp-3': { id: 'Marketing & Operations Supervisor', en: 'Marketing & Operations Supervisor' },
  },
  ast: {
    'exp-1': { id: 'Operations & Executive Support Manager', en: 'Operations & Executive Support Manager' },
    'exp-2': { id: 'Corporate Relation & Account Manager', en: 'Corporate Relations & Account Manager' },
    'exp-4': { id: 'Marketing & Administrative Manager', en: 'Marketing & Administrative Manager' },
    'exp-3': { id: 'Marketing & Operations Supervisor', en: 'Marketing & Operations Supervisor' },
  },
  sales_administration: {
    'exp-1': { id: 'Office & Operations Manager', en: 'Office & Operations Manager' },
    'exp-2': { id: 'Corporate Relation & Account Administrator', en: 'Corporate Relations & Account Administrator' },
    'exp-4': { id: 'Marketing & Sales Manager', en: 'Marketing & Sales Manager' },
    'exp-3': { id: 'Marketing & Sales Supervisor', en: 'Marketing & Sales Supervisor' },
  },
  sad: {
    'exp-1': { id: 'Office & Operations Manager', en: 'Office & Operations Manager' },
    'exp-2': { id: 'Corporate Relation & Account Administrator', en: 'Corporate Relations & Account Administrator' },
    'exp-4': { id: 'Marketing & Sales Manager', en: 'Marketing & Sales Manager' },
    'exp-3': { id: 'Marketing & Sales Supervisor', en: 'Marketing & Sales Supervisor' },
  },
  finance_billing_admin: {
    'exp-1': { id: 'Finance & Operations Manager', en: 'Finance & Operations Manager' },
    'exp-2': { id: 'Commercial Account Specialist', en: 'Commercial Account Specialist' },
    'exp-4': { id: 'Commercial & Marketing Manager', en: 'Commercial & Marketing Manager' },
    'exp-3': { id: 'Marketing Budget & Promotion Supervisor', en: 'Marketing Budget & Promotion Supervisor' },
  },
  fba: {
    'exp-1': { id: 'Finance & Operations Manager', en: 'Finance & Operations Manager' },
    'exp-2': { id: 'Commercial Account Specialist', en: 'Commercial Account Specialist' },
    'exp-4': { id: 'Commercial & Marketing Manager', en: 'Commercial & Marketing Manager' },
    'exp-3': { id: 'Marketing Budget & Promotion Supervisor', en: 'Marketing Budget & Promotion Supervisor' },
  },
  project_administration: {
    'exp-1': { id: 'Project Operations Manager', en: 'Project Operations Manager' },
    'exp-2': { id: 'Account & Project Coordinator', en: 'Account & Project Coordinator' },
    'exp-4': { id: 'Marketing Project Manager', en: 'Marketing Project Manager' },
    'exp-3': { id: 'Marketing Campaign Project Supervisor', en: 'Marketing Campaign Project Supervisor' },
  },
  pra: {
    'exp-1': { id: 'Project Operations Manager', en: 'Project Operations Manager' },
    'exp-2': { id: 'Account & Project Coordinator', en: 'Account & Project Coordinator' },
    'exp-4': { id: 'Marketing Project Manager', en: 'Marketing Project Manager' },
    'exp-3': { id: 'Marketing Campaign Project Supervisor', en: 'Marketing Campaign Project Supervisor' },
  },
  procurement_administration: {
    'exp-1': { id: 'Procurement & Operations Manager', en: 'Procurement & Operations Manager' },
    'exp-2': { id: 'Commercial Account Specialist', en: 'Commercial Account Specialist' },
    'exp-4': { id: 'Store Operations & Marketing Manager', en: 'Store Operations & Marketing Manager' },
    'exp-3': { id: 'Marketing & Merchandising Supervisor', en: 'Marketing & Merchandising Supervisor' },
  },
  ppa: {
    'exp-1': { id: 'Procurement & Operations Manager', en: 'Procurement & Operations Manager' },
    'exp-2': { id: 'Commercial Account Specialist', en: 'Commercial Account Specialist' },
    'exp-4': { id: 'Store Operations & Marketing Manager', en: 'Store Operations & Marketing Manager' },
    'exp-3': { id: 'Marketing & Merchandising Supervisor', en: 'Marketing & Merchandising Supervisor' },
  },
  data_entry_admin: {
    'exp-1': { id: 'Operations & Database Manager', en: 'Operations & Database Manager' },
    'exp-2': { id: 'Master Data & Account Administrator', en: 'Master Data & Account Administrator' },
    'exp-4': { id: 'Digital Marketing Manager', en: 'Digital Marketing Manager' },
    'exp-3': { id: 'Marketing & Operations Supervisor', en: 'Marketing & Operations Supervisor' },
  },
  dea: {
    'exp-1': { id: 'Operations & Database Manager', en: 'Operations & Database Manager' },
    'exp-2': { id: 'Master Data & Account Administrator', en: 'Master Data & Account Administrator' },
    'exp-4': { id: 'Digital Marketing Manager', en: 'Digital Marketing Manager' },
    'exp-3': { id: 'Marketing & Operations Supervisor', en: 'Marketing & Operations Supervisor' },
  },
  warehouse_inventory_admin: {
    'exp-1': { id: 'Warehouse & Operations Manager', en: 'Warehouse & Operations Manager' },
    'exp-2': { id: 'Commercial Account Specialist', en: 'Commercial Account Specialist' },
    'exp-4': { id: 'Store Operations & Marketing Manager', en: 'Store Operations & Marketing Manager' },
    'exp-3': { id: 'Marketing & Merchandising Supervisor', en: 'Marketing & Merchandising Supervisor' },
  },
  wha: {
    'exp-1': { id: 'Warehouse & Operations Manager', en: 'Warehouse & Operations Manager' },
    'exp-2': { id: 'Commercial Account Specialist', en: 'Commercial Account Specialist' },
    'exp-4': { id: 'Store Operations & Marketing Manager', en: 'Store Operations & Marketing Manager' },
    'exp-3': { id: 'Marketing & Merchandising Supervisor', en: 'Marketing & Merchandising Supervisor' },
  },
  warehouse_logistics_lead: {
    'exp-1': { id: 'Warehouse & Operations Manager', en: 'Warehouse & Operations Manager' },
    'exp-2': { id: 'Commercial Account Specialist', en: 'Commercial Account Specialist' },
    'exp-4': { id: 'Store Operations & Marketing Manager', en: 'Store Operations & Marketing Manager' },
    'exp-3': { id: 'Marketing & Merchandising Supervisor', en: 'Marketing & Merchandising Supervisor' },
  },
  whs: {
    'exp-1': { id: 'Warehouse & Operations Manager', en: 'Warehouse & Operations Manager' },
    'exp-2': { id: 'Commercial Account Specialist', en: 'Commercial Account Specialist' },
    'exp-4': { id: 'Store Operations & Marketing Manager', en: 'Store Operations & Marketing Manager' },
    'exp-3': { id: 'Marketing & Merchandising Supervisor', en: 'Marketing & Merchandising Supervisor' },
  },
  ppic_inventory: {
    'exp-1': { id: 'PPIC & Operations Manager', en: 'PPIC & Operations Manager' },
    'exp-2': { id: 'Commercial Account Specialist', en: 'Commercial Account Specialist' },
    'exp-4': { id: 'Store Operations & Marketing Manager', en: 'Store Operations & Marketing Manager' },
    'exp-3': { id: 'Marketing & Merchandising Supervisor', en: 'Marketing & Merchandising Supervisor' },
  },
  ppc: {
    'exp-1': { id: 'PPIC & Operations Manager', en: 'PPIC & Operations Manager' },
    'exp-2': { id: 'Commercial Account Specialist', en: 'Commercial Account Specialist' },
    'exp-4': { id: 'Store Operations & Marketing Manager', en: 'Store Operations & Marketing Manager' },
    'exp-3': { id: 'Marketing & Merchandising Supervisor', en: 'Marketing & Merchandising Supervisor' },
  },
  procurement_purchasing: {
    'exp-1': { id: 'Procurement & Operations Manager', en: 'Procurement & Operations Manager' },
    'exp-2': { id: 'Commercial Account Specialist', en: 'Commercial Account Specialist' },
    'exp-4': { id: 'Store Operations & Marketing Manager', en: 'Store Operations & Marketing Manager' },
    'exp-3': { id: 'Marketing & Merchandising Supervisor', en: 'Marketing & Merchandising Supervisor' },
  },
  prc: {
    'exp-1': { id: 'Procurement & Operations Manager', en: 'Procurement & Operations Manager' },
    'exp-2': { id: 'Commercial Account Specialist', en: 'Commercial Account Specialist' },
    'exp-4': { id: 'Store Operations & Marketing Manager', en: 'Store Operations & Marketing Manager' },
    'exp-3': { id: 'Marketing & Merchandising Supervisor', en: 'Marketing & Merchandising Supervisor' },
  },
  retail_store_operations: {
    'exp-1': { id: 'Retail Operations Manager', en: 'Retail Operations Manager' },
    'exp-2': { id: 'Account & Operations Specialist', en: 'Account & Operations Specialist' },
    'exp-4': { id: 'Store Operations & Marketing Manager', en: 'Store Operations & Marketing Manager' },
    'exp-3': { id: 'Marketing & Retail Operations Supervisor', en: 'Marketing & Retail Operations Supervisor' },
  },
  rtl: {
    'exp-1': { id: 'Retail Operations Manager', en: 'Retail Operations Manager' },
    'exp-2': { id: 'Account & Operations Specialist', en: 'Account & Operations Specialist' },
    'exp-4': { id: 'Store Operations & Marketing Manager', en: 'Store Operations & Marketing Manager' },
    'exp-3': { id: 'Marketing & Retail Operations Supervisor', en: 'Marketing & Retail Operations Supervisor' },
  },
  customer_service_operations: {
    'exp-1': { id: 'Customer Service & Operations Manager', en: 'Customer Service & Operations Manager' },
    'exp-2': { id: 'Client Relations Specialist', en: 'Client Relations Specialist' },
    'exp-4': { id: 'Customer Relations & Marketing Manager', en: 'Customer Relations & Marketing Manager' },
    'exp-3': { id: 'Marketing & Service Relations Supervisor', en: 'Marketing & Service Relations Supervisor' },
  },
  cso: {
    'exp-1': { id: 'Customer Service & Operations Manager', en: 'Customer Service & Operations Manager' },
    'exp-2': { id: 'Client Relations Specialist', en: 'Client Relations Specialist' },
    'exp-4': { id: 'Customer Relations & Marketing Manager', en: 'Customer Relations & Marketing Manager' },
    'exp-3': { id: 'Marketing & Service Relations Supervisor', en: 'Marketing & Service Relations Supervisor' },
  },
  ecommerce_marketplace_ops: {
    'exp-1': { id: 'Operations Manager', en: 'Operations Manager' },
    'exp-2': { id: 'Account Specialist', en: 'Account Specialist' },
    'exp-4': { id: 'E-Commerce & Digital Marketing Manager', en: 'E-Commerce & Digital Marketing Manager' },
    'exp-3': { id: 'Digital Marketing & Marketplace Supervisor', en: 'Digital Marketing & Marketplace Supervisor' },
  },
  eco: {
    'exp-1': { id: 'Operations Manager', en: 'Operations Manager' },
    'exp-2': { id: 'Account Specialist', en: 'Account Specialist' },
    'exp-4': { id: 'E-Commerce & Digital Marketing Manager', en: 'E-Commerce & Digital Marketing Manager' },
    'exp-3': { id: 'Digital Marketing & Marketplace Supervisor', en: 'Digital Marketing & Marketplace Supervisor' },
  },
  social_media_content_lead: {
    'exp-1': { id: 'Operations Manager', en: 'Operations Manager' },
    'exp-2': { id: 'Content & Account Specialist', en: 'Content & Account Specialist' },
    'exp-4': { id: 'Digital Media & Marketing Manager', en: 'Digital Media & Marketing Manager' },
    'exp-3': { id: 'Media & Social Marketing Supervisor', en: 'Media & Social Marketing Supervisor' },
  },
  smm: {
    'exp-1': { id: 'Operations Manager', en: 'Operations Manager' },
    'exp-2': { id: 'Content & Account Specialist', en: 'Content & Account Specialist' },
    'exp-4': { id: 'Digital Media & Marketing Manager', en: 'Digital Media & Marketing Manager' },
    'exp-3': { id: 'Media & Social Marketing Supervisor', en: 'Media & Social Marketing Supervisor' },
  },
  smc: {
    'exp-1': { id: 'Operations Manager', en: 'Operations Manager' },
    'exp-2': { id: 'Content & Account Specialist', en: 'Content & Account Specialist' },
    'exp-4': { id: 'Digital Media & Marketing Manager', en: 'Digital Media & Marketing Manager' },
    'exp-3': { id: 'Media & Social Marketing Supervisor', en: 'Media & Social Marketing Supervisor' },
  },
  key_account_manager: {
    'exp-1': { id: 'Business Operations Manager', en: 'Business Operations Manager' },
    'exp-2': { id: 'Key Account Manager', en: 'Key Account Manager' },
    'exp-4': { id: 'Marketing & Sales Manager', en: 'Marketing & Sales Manager' },
    'exp-3': { id: 'Partnership & Marketing Supervisor', en: 'Partnership & Marketing Supervisor' },
  },
  kam: {
    'exp-1': { id: 'Business Operations Manager', en: 'Business Operations Manager' },
    'exp-2': { id: 'Key Account Manager', en: 'Key Account Manager' },
    'exp-4': { id: 'Marketing & Sales Manager', en: 'Marketing & Sales Manager' },
    'exp-3': { id: 'Partnership & Marketing Supervisor', en: 'Partnership & Marketing Supervisor' },
  },
  it_project_manager: {
    'exp-1': { id: 'IT & Operations Project Manager', en: 'IT & Operations Project Manager' },
    'exp-2': { id: 'Technical Account Specialist', en: 'Technical Account Specialist' },
    'exp-4': { id: 'Marketing Project Manager', en: 'Marketing Project Manager' },
    'exp-3': { id: 'Digital Media Project Supervisor', en: 'Digital Media Project Supervisor' },
  },
  itp: {
    'exp-1': { id: 'IT & Operations Project Manager', en: 'IT & Operations Project Manager' },
    'exp-2': { id: 'Technical Account Specialist', en: 'Technical Account Specialist' },
    'exp-4': { id: 'Marketing Project Manager', en: 'Marketing Project Manager' },
    'exp-3': { id: 'Digital Media Project Supervisor', en: 'Digital Media Project Supervisor' },
  },
  event_program_manager: {
    'exp-1': { id: 'Operations Manager', en: 'Operations Manager' },
    'exp-2': { id: 'Event Partnership Specialist', en: 'Event Partnership Specialist' },
    'exp-4': { id: 'Event & Marketing Manager', en: 'Event & Marketing Manager' },
    'exp-3': { id: 'Event & Promotion Supervisor', en: 'Event & Promotion Supervisor' },
  },
  evm: {
    'exp-1': { id: 'Operations Manager', en: 'Operations Manager' },
    'exp-2': { id: 'Event Partnership Specialist', en: 'Event Partnership Specialist' },
    'exp-4': { id: 'Event & Marketing Manager', en: 'Event & Marketing Manager' },
    'exp-3': { id: 'Event & Promotion Supervisor', en: 'Event & Promotion Supervisor' },
  },
};

function getSubroleCustomTitle(
  presetKey: string,
  expId: string,
  lang: 'id' | 'en'
): string | undefined {
  const normalized = presetKey.toLowerCase().trim();
  const entry = SUBROLE_CUSTOM_ROLE_TITLES[normalized];
  if (entry && entry[expId]) {
    return entry[expId][lang];
  }
  return undefined;
}

export function getTailoredExperiences(
  presetKey?: string | null,
  lang: 'id' | 'en' = 'id'
): CVExperience[] {
  const normalizedKey = presetKey || 'optimal';
  const baseKey = resolvePresetBaseKey(normalizedKey);
  const dataPool = lang === 'en' ? presetExperiencesEn : presetExperiencesId;
  const fallbackExperiences = lang === 'en' ? cvDataEn.experiences : cvData.experiences;
  const optimalList = dataPool['optimal']?.length ? dataPool['optimal'] : fallbackExperiences;

  const rawList =
    dataPool[baseKey]?.length
      ? dataPool[baseKey]
      : optimalList;

  const listMap = new Map<string, CVExperience>();
  rawList.forEach((item) => {
    const customTitle = getSubroleCustomTitle(normalizedKey, item.id, lang);
    listMap.set(item.id, customTitle ? { ...item, role: customTitle } : item);
  });

  // Guarantee all 4 core experiences (exp-1, exp-2, exp-4, exp-3) are present in every preset
  const requiredIds = ['exp-1', 'exp-2', 'exp-4', 'exp-3'];
  for (const reqId of requiredIds) {
    if (!listMap.has(reqId)) {
      const fallbackItem =
        optimalList.find((item) => item.id === reqId) ||
        fallbackExperiences.find((item) => item.id === reqId);
      if (fallbackItem) {
        const customTitle = getSubroleCustomTitle(normalizedKey, reqId, lang);
        listMap.set(reqId, customTitle ? { ...fallbackItem, role: customTitle } : fallbackItem);
      }
    }
  }

  const fullList = Array.from(listMap.values());
  const targetOrder = getPresetExperienceOrder(normalizedKey);
  return fullList.sort((a, b) => {
    const idxA = targetOrder.indexOf(a.id);
    const idxB = targetOrder.indexOf(b.id);
    return (idxA !== -1 ? idxA : 999) - (idxB !== -1 ? idxB : 999);
  });
}

export function getExperienceById(
  id: string,
  presetKey?: string | null,
  lang: 'id' | 'en' = 'id'
): CVExperience | undefined {
  const experiences = getTailoredExperiences(presetKey, lang);
  return experiences.find((exp) => exp.id === id);
}

export function getTailoredExperienceById(
  id: string,
  presetKey?: string | null,
  lang: 'id' | 'en' = 'id'
): CVExperience | undefined {
  return getExperienceById(id, presetKey, lang);
}


