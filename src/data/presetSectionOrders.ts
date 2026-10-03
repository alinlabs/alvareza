import { SectionOrdersState, defaultSectionOrders } from './presetSelectionHelper';
import { getPresetKeyFromCodeOrKey } from './rolePresetsConfig';

/**
 * Intelligent ATS Ordering Engine.
 * Reorders every section (hard skills, projects, KPIs/metrics, certifications, digital solutions,
 * organizations, and achievements) so the most job-specific keywords, highest-impact credentials,
 * and relevant projects appear at the very top (index 0) for ATS parsers and recruiters.
 */
export function getPresetSectionOrders(presetKey: string): SectionOrdersState {
  const normKey = getPresetKeyFromCodeOrKey(presetKey || 'optimal');
  const targetKey = normKey || (presetKey || 'optimal').toLowerCase();
  // 1. HR, TALENT ACQUISITION, COMPENSATION & PEOPLE OPS
  if (
    targetKey.includes('hr_') ||
    targetKey.includes('talent_') ||
    targetKey.includes('training_') ||
    targetKey.includes('organization_') ||
    targetKey.includes('people_') ||
    targetKey.includes('compensation') ||
    targetKey.includes('payroll') ||
    targetKey.includes('industrial_relations') ||
    targetKey.includes('employer_branding')
  ) {
    return {
      ...defaultSectionOrders,
      skills_hard: [0, 1, 2, 3, 4, 7, 8, 6, 5, 9, 10], // Labor law, Comp/Ben/Payroll, Performance/HRIS, Shift mgmt
      skills_soft: [6, 0, 4, 1, 7, 2, 3, 5], // Mentoring & HR mindset, Leadership, Conflict resolution
      skills_tools: [0, 4, 5, 1, 2, 3, 6, 7, 8], // HRIS & Payroll tools first
      certifications: ['cert-1', 'cert-3', 'cert-5', 'cert-4', 'cert-2', 'cert-6', 'cert-7', 'cert-8'], // MarkPlus HR #1, Saylor HRM #2, Six Sigma #3
      consultingProjects: ['proj-12', 'proj-1', 'proj-10', 'proj-3', 'proj-7', 'proj-2', 'proj-4', 'proj-5', 'proj-6', 'proj-8', 'proj-9', 'proj-11', 'proj-13'], // PT Shansusdzar, AlinLabs, Tirta Raharja, Lingua First, PRATAMA EO
      digitalSolutions: ['sol-3', 'sol-8', 'sol-1', 'sol-5', 'sol-4', 'sol-2', 'sol-6'], // HR Matrix #1, Talenty #2
      metrics: [11, 8, 2, 6, 0, 5, 1, 3, 4, 7, 9, 10, 12], // 6 Divisions HRGA, 30+ Officials, 400+ Youth Talents
      organizations: [1, 0, 2, 4, 3], // Koordinator Kaderisasi & PSDM #1, Presiden Mahasiswa #2
      achievements: ['ach-7', 'ach-9', 'ach-1', 'ach-10', 'ach-18', 'ach-5'],
    };
  }

  // 2. SUPPLY CHAIN, LOGISTICS, WAREHOUSE & PROCUREMENT
  if (
    targetKey.includes('supply_chain') ||
    targetKey.includes('logistics') ||
    targetKey.includes('warehouse') ||
    targetKey.includes('procurement') ||
    targetKey.includes('ppic') ||
    targetKey.includes('fleet') ||
    targetKey.includes('demand_') ||
    targetKey.includes('vendor_')
  ) {
    return {
      ...defaultSectionOrders,
      skills_hard: [4, 9, 6, 7, 8, 3, 0, 5, 1, 2, 10], // Ops/SOP/SLA, Retail/POS/Inventory, COGS HPP, Project
      skills_soft: [3, 1, 5, 7, 4, 0, 2, 6], // Project planning & SLA, Analytical, Operational resilience
      skills_tools: [1, 3, 5, 4, 0, 2, 8, 6, 7], // Ops/Logistics/Supply chain tools first (Logistor, POS, Maps)
      certifications: ['cert-2', 'cert-5', 'cert-4', 'cert-3', 'cert-1', 'cert-6', 'cert-7', 'cert-8'], // Saylor Ops & SCM #1, Six Sigma #2
      consultingProjects: ['proj-1', 'proj-2', 'proj-4', 'proj-12', 'proj-10', 'proj-6'], // Workshop material flow & 100+ projects, 13 retail inventory
      digitalSolutions: ['sol-2', 'sol-1', 'sol-5', 'sol-6', 'sol-4', 'sol-3', 'sol-8'], // Logistor Supply Chain #1
      metrics: [4, 9, 5, 6, 1, 11, 0, 2, 3, 7, 8, 10, 12], // 100% SKU COGS, 13 Retail Outlets, SLA >95%
      organizations: [0, 1, 2, 4, 3],
      achievements: ['ach-10', 'ach-8', 'ach-1', 'ach-7', 'ach-18', 'ach-5'],
    };
  }

  // 3. MARKETING, PR, E-COMMERCE & CREATIVE
  if (
    targetKey === 'marketing' ||
    targetKey.includes('marketing') ||
    targetKey === 'public_relations' ||
    targetKey === 'marcom_branding' ||
    targetKey.includes('social_media') ||
    targetKey.includes('ecommerce') ||
    targetKey.includes('brand_') ||
    targetKey.includes('creative_project')
  ) {
    return {
      ...defaultSectionOrders,
      experiences: ['exp-3', 'exp-2', 'exp-1', 'exp-4'],
      skills_hard: [10, 5, 8, 4, 7, 6, 9, 2, 0, 1, 3], // Digital marketing & E-commerce #1, B2B sales CRM #2
      skills_soft: [2, 1, 7, 6, 0, 3, 4, 5], // B2B Strategic communication & influencing #1
      skills_tools: [6, 7, 2, 5, 4, 8, 1, 0, 3], // Ad platforms & Creative tools (Meta, Google, TikTok, Canva)
      certifications: ['cert-6', 'cert-7', 'cert-8', 'cert-5', 'cert-4', 'cert-1', 'cert-2', 'cert-3'], // Google Ads Search & Creative #1 & #2
      consultingProjects: ['proj-8', 'proj-11', 'proj-13', 'proj-10', 'proj-1', 'proj-2'], // Paid Ads, E-Commerce Multi-Channel, PR events
      digitalSolutions: ['sol-4', 'sol-1', 'sol-6', 'sol-2', 'sol-5', 'sol-3', 'sol-8'], // NextMark CRM & Lead nurturing
      metrics: [0, 5, 10, 7, 2, 6, 11, 4, 1, 3, 8, 9, 12], // 4.000+ Lead DB, 98% CSAT, 10+ Brand Partnerships
      organizations: [3, 4, 0, 1, 2], // Dokumentasi & Humas Publikasi #1
      achievements: ['ach-2', 'ach-3', 'ach-4', 'ach-1', 'ach-7', 'ach-18'], // National Business Plan & Marketing awards
    };
  }

  // 4. B2B SALES, COMMERCIAL, ACCOUNT MANAGEMENT & PARTNERSHIPS
  if (
    targetKey.includes('sales') ||
    targetKey.includes('b2b') ||
    targetKey.includes('account') ||
    targetKey.includes('commercial') ||
    targetKey.includes('client_') ||
    targetKey.includes('partnerships') ||
    targetKey.includes('tender') ||
    targetKey.includes('channel_') ||
    targetKey.includes('enterprise_') ||
    targetKey.includes('business_development')
  ) {
    return {
      ...defaultSectionOrders,
      skills_hard: [5, 4, 10, 8, 6, 7, 9, 0, 1, 2, 3], // B2B sales CRM #1, Operations SLA #2
      skills_soft: [2, 4, 0, 1, 7, 3, 5, 6], // B2B Communication #1, Commercial negotiation #2
      skills_tools: [2, 1, 5, 6, 4, 3, 0, 7, 8], // NextMark CRM & WhatsApp Business API #1
      certifications: ['cert-6', 'cert-7', 'cert-8', 'cert-5', 'cert-4', 'cert-2', 'cert-1', 'cert-3'], // Google Ads Search & Analytics #1
      consultingProjects: ['proj-10', 'proj-1', 'proj-3', 'proj-12', 'proj-2', 'proj-13'], // B2B Market intelligence 4.000+ companies #1
      digitalSolutions: ['sol-1', 'sol-4', 'sol-6', 'sol-2', 'sol-5', 'sol-3', 'sol-8'], // Mitra Gateway ERP, NextMark CRM, My Diby
      metrics: [0, 5, 10, 6, 4, 11, 1, 2, 3, 7, 8, 9, 12], // 4.000+ B2B CRM, 100+ Projects CSAT 98%, 10+ Brand principals
      organizations: [0, 4, 1, 2, 3], // Presiden Mahasiswa, Hubungan Eksternal
      achievements: ['ach-10', 'ach-8', 'ach-1', 'ach-7', 'ach-18', 'ach-5'],
    };
  }

  // 5. FINANCE, ACCOUNTING, COST CONTROL & AUDIT
  if (
    targetKey.includes('finance') ||
    targetKey.includes('accounting') ||
    targetKey.includes('cost_control') ||
    targetKey.includes('tax') ||
    targetKey.includes('pricing') ||
    targetKey.includes('ap_ar') ||
    targetKey.includes('audit')
  ) {
    return {
      ...defaultSectionOrders,
      skills_hard: [6, 4, 8, 1, 7, 9, 5, 0, 2, 3, 10], // Accounting & COGS HPP #1, Operations #2, ERP/Automation #3
      skills_soft: [1, 7, 3, 4, 0, 5, 2, 6], // Analytical thinking #1, Efficiency orientation #2
      skills_tools: [3, 5, 4, 1, 0, 2, 8, 6, 7], // Finance/Accounting tools (Accurate, Jurnal, Spreadsheet COGS)
      certifications: ['cert-4', 'cert-5', 'cert-2', 'cert-1', 'cert-3', 'cert-6', 'cert-7', 'cert-8'], // MIS & Database #1, Six Sigma #2
      consultingProjects: ['proj-4', 'proj-2', 'proj-9', 'proj-1', 'proj-12', 'proj-10'], // BPSPAMS Financial Ledger 2.000+ clients #1, 13 Outlets COGS
      digitalSolutions: ['sol-5', 'sol-2', 'sol-1', 'sol-6', 'sol-4', 'sol-3', 'sol-8'], // Vynance Financial Ledger #1
      metrics: [4, 1, 6, 5, 9, 11, 0, 2, 3, 7, 8, 10, 12], // 100% SKU HPP COGS #1, 2.000+ BPSPAMS Clients #2
      organizations: [0, 1, 2, 4, 3],
      achievements: ['ach-10', 'ach-8', 'ach-1', 'ach-7', 'ach-18', 'ach-5'],
    };
  }

  // 6. IT, ERP, SOFTWARE, BI & TECH
  if (
    targetKey.includes('it_') ||
    targetKey.includes('erp') ||
    targetKey.includes('developer') ||
    targetKey.includes('intelligence') ||
    targetKey.includes('frontend') ||
    targetKey.includes('product_') ||
    targetKey.includes('bi_') ||
    targetKey.includes('agile') ||
    targetKey.includes('software_') ||
    targetKey.includes('digital_')
  ) {
    return {
      ...defaultSectionOrders,
      skills_hard: [8, 7, 4, 6, 2, 5, 10, 0, 1, 3, 9], // ERP/Automation/BI #1, Project management #2
      skills_soft: [1, 3, 7, 0, 5, 2, 4, 6], // Analytical #1, Project SLA #2, Adaptability #3
      skills_tools: [8, 4, 5, 1, 0, 2, 6, 7, 3], // Modern Web stack, AI/Automation, Looker Studio BI
      certifications: ['cert-4', 'cert-5', 'cert-6', 'cert-8', 'cert-2', 'cert-3', 'cert-1', 'cert-7'], // MIS IACET #1, Six Sigma #2
      consultingProjects: ['proj-6', 'proj-1', 'proj-12', 'proj-10', 'proj-7', 'proj-2'], // Full-Stack Web & ERP Initiative #1
      digitalSolutions: ['sol-1', 'sol-2', 'sol-3', 'sol-4', 'sol-5', 'sol-6', 'sol-8'], // 50+ Apps portfolio
      metrics: [7, 6, 5, 11, 0, 4, 1, 2, 3, 8, 9, 10, 12], // 50+ Web apps #1, 70% Bottleneck elimination #2
      organizations: [0, 4, 1, 2, 3],
      achievements: ['ach-1', 'ach-5', 'ach-10', 'ach-7', 'ach-18', 'ach-2'],
    };
  }

  // 7. ADMINISTRATION, SECRETARIAT & EXECUTIVE SUPPORT
  if (
    targetKey.includes('admin') ||
    targetKey.includes('secretariat') ||
    targetKey.includes('assistant') ||
    targetKey.includes('hospital') ||
    targetKey.includes('legal')
  ) {
    return {
      ...defaultSectionOrders,
      skills_hard: [4, 6, 7, 0, 3, 1, 8, 5, 2, 9, 10], // Management SOP/SLA #1, Accounting & Cost #2, Project #3
      skills_soft: [1, 7, 3, 4, 0, 2, 5, 6], // Analytical, Adaptability, SLA, Discretion
      skills_tools: [1, 3, 4, 0, 2, 5, 8, 6, 7], // Workspace, Notion, Trello, SOP Hub
      certifications: ['cert-5', 'cert-4', 'cert-2', 'cert-1', 'cert-3', 'cert-6', 'cert-7', 'cert-8'], // Six Sigma #1, MIS #2
      consultingProjects: ['proj-12', 'proj-1', 'proj-4', 'proj-10', 'proj-2', 'proj-5'], // 20+ SOP & Workflow Architecture #1
      digitalSolutions: ['sol-1', 'sol-5', 'sol-2', 'sol-4', 'sol-6', 'sol-3', 'sol-8'], // HR Matrix & Standardized Workflows
      metrics: [6, 4, 1, 5, 11, 0, 2, 3, 7, 8, 9, 10, 12], // 70% Process efficiency, 100% Accuracy, 2000+ Utility records
      organizations: [0, 1, 2, 4, 3],
      achievements: ['ach-1', 'ach-10', 'ach-8', 'ach-7', 'ach-18', 'ach-5'],
    };
  }

  // 8. PROJECT, PMO & PROGRAM DELIVERY
  if (
    targetKey.includes('project_') ||
    targetKey.includes('program_') ||
    targetKey.includes('pmo') ||
    targetKey.includes('delivery') ||
    targetKey.includes('event_')
  ) {
    return {
      ...defaultSectionOrders,
      skills_hard: [7, 4, 8, 6, 0, 3, 5, 1, 2, 9, 10], // Project Management #1, Ops SOP/SLA #2
      skills_soft: [3, 1, 0, 7, 5, 4, 2, 6], // Project planning & SLA #1, Leadership #2
      skills_tools: [1, 4, 5, 8, 2, 0, 3, 6, 7], // Trello/Notion, Workspace, Looker Studio
      certifications: ['cert-5', 'cert-4', 'cert-2', 'cert-1', 'cert-3', 'cert-6', 'cert-7', 'cert-8'], // Six Sigma #1, MIS #2
      consultingProjects: ['proj-1', 'proj-12', 'proj-6', 'proj-5', 'proj-10', 'proj-13'], // 100+ Projects SLA >95% #1
      digitalSolutions: ['sol-2', 'sol-1', 'sol-4', 'sol-3', 'sol-5', 'sol-6', 'sol-8'],
      metrics: [5, 6, 7, 11, 0, 4, 1, 2, 3, 8, 9, 10, 12], // 100+ Projects SLA >95% #1, 70% Efficiency #2
      organizations: [0, 1, 4, 2, 3],
      achievements: ['ach-1', 'ach-5', 'ach-10', 'ach-7', 'ach-18', 'ach-2'],
    };
  }

  // 9. OPTIMAL PROFILE & GENERAL OPERATIONS
  if (targetKey === 'optimal') {
    return {
      ...defaultSectionOrders,
      skills_hard: [0, 1, 2, 4, 7, 6, 8, 3, 5, 9, 10], // Labor law, Comp/Ben/Payroll, Performance/HRIS, Ops SOP #1
      skills_soft: [6, 0, 1, 3, 7, 4, 2, 5], // Mentoring & HR mindset #1, Executive leadership #2, Analytical #3
      skills_tools: [0, 1, 3, 2, 4, 5, 8, 6, 7], // HR Matrix, Talenty, Payroll, Custom ATS #1
      certifications: ['cert-1', 'cert-3', 'cert-5', 'cert-2', 'cert-4', 'cert-6', 'cert-7', 'cert-8'], // MarkPlus HR #1, Saylor HRM #2, Six Sigma #3
      consultingProjects: ['proj-12', 'proj-7', 'proj-1', 'proj-9', 'proj-5', 'proj-10'], // HR & Operations SOP, Restrukturisasi Organisasi #1
      digitalSolutions: ['sol-3', 'sol-8', 'sol-1', 'sol-5', 'sol-2', 'sol-4', 'sol-6'], // HR Matrix #1, Talenty #2
      metrics: [11, 6, 2, 8, 5, 0, 4, 1, 3, 7, 9, 10, 12], // 6 Divisions HRGA #1, 70% Efficiency SOP #2, 400+ Talents #3
      organizations: [1, 0, 2, 4, 3], // Koordinator Kaderisasi & PSDM #1, Presiden Mahasiswa #2
      achievements: ['ach-7', 'ach-1', 'ach-10', 'ach-18', 'ach-5', 'ach-8'], // MarkPlus HR Grade A #1, Presiden Mahasiswa #2, Saylor IACET #3
    };
  }

  // 10. OPERATIONS, RETAIL & GENERAL MANAGEMENT
  return {
    ...defaultSectionOrders,
    skills_hard: [4, 7, 9, 6, 0, 1, 5, 8, 3, 2, 10], // Management SOP/SLA #1, Project #2, Retail #3
    skills_soft: [0, 1, 3, 7, 4, 2, 5, 6], // Executive leadership #1, Analytical #2, Project SLA #3
    skills_tools: [1, 0, 3, 2, 4, 5, 8, 6, 7], // Ops & Project management tools #1
    certifications: ['cert-5', 'cert-2', 'cert-1', 'cert-3', 'cert-4', 'cert-6', 'cert-7', 'cert-8'], // Six Sigma #1, Saylor Ops #2, MarkPlus HR #3
    consultingProjects: ['proj-1', 'proj-12', 'proj-2', 'proj-10', 'proj-7', 'proj-4'], // PT Galaksi 100+ projects #1, 20+ SOP Architecture #2
    digitalSolutions: ['sol-1', 'sol-2', 'sol-5', 'sol-4', 'sol-6', 'sol-3', 'sol-8'], // HR Matrix #1, Logistor #2
    metrics: [5, 6, 11, 0, 4, 9, 7, 1, 2, 3, 8, 10, 12], // SLA >95% #1, 70% Bottleneck elimination #2, 6 divisions #3
    organizations: [0, 1, 2, 4, 3],
    achievements: ['ach-1', 'ach-10', 'ach-7', 'ach-5', 'ach-18', 'ach-8'],
  };
}
