/**
 * Comprehensive Career & Job Role Synonyms Dictionary (English)
 * src/data/position-detektor/sinonim-en.ts
 *
 * Utilized by the intensive position matcher to expand keywords across
 * Job Titles, Responsibilities (Jobdesk), and Qualifications.
 */

export const SINONIM_ENGLISH: Record<string, string[]> = {
  // =========================================================================
  // 1. HUMAN RESOURCES, TALENT ACQUISITION & PEOPLE OPERATIONS
  // =========================================================================
  'hr': [
    'human resources', 'hrd', 'people operations', 'people ops', 'human capital',
    'talent management', 'personnel', 'talent acquisition', 'people culture'
  ],
  'human resources': [
    'hr', 'hrd', 'people operations', 'human capital', 'talent management', 'personnel',
    'employee relations', 'people team'
  ],
  'people operations': [
    'people ops', 'hr', 'human resources', 'hr operations', 'people partner', 'talent operations'
  ],
  'people ops': [
    'people operations', 'hr', 'human resources', 'hr operations'
  ],
  'recruitment': [
    'talent acquisition', 'recruiter', 'hiring', 'sourcing', 'headhunting', 'talent sourcing',
    'candidate screening', 'interviewing', 'applicant tracking'
  ],
  'recruiter': [
    'talent acquisition specialist', 'headhunter', 'talent sourcer', 'recruitment consultant', 'hiring specialist'
  ],
  'talent acquisition': [
    'recruitment', 'recruiter', 'talent sourcing', 'headhunting', 'staffing', 'talent partner'
  ],
  'payroll': [
    'compensation and benefits', 'c&b', 'salary administration', 'remuneration',
    'wage calculation', 'tax withholding', 'payroll accounting'
  ],
  'compensation': [
    'benefits', 'c&b', 'remuneration', 'reward', 'incentives', 'total rewards', 'payroll'
  ],
  'talent management': [
    'people development', 'succession planning', 'career pathway', 'employee retention', 'hr'
  ],
  'employee relations': [
    'industrial relations', 'workplace relations', 'dispute resolution', 'employee grievance'
  ],
  'labor law': [
    'labor regulations', 'statutory compliance', 'employment standards', 'labor compliance'
  ],
  'learning & development': [
    'l&d', 'training', 'employee training', 'organizational development', 'workforce capability'
  ],
  'training': [
    'learning development', 'l&d', 'coaching', 'upskilling', 'workshop facilitation', 'employee education'
  ],
  'performance management': [
    'kpi', 'performance appraisal', 'okr', 'quarterly review', 'performance evaluation'
  ],
  'onboarding': [
    'new hire induction', 'employee orientation', 'offboarding', 'employee lifecycle'
  ],

  // =========================================================================
  // 2. LEADERSHIP, MANAGERIAL & HIERARCHY
  // =========================================================================
  'manager': [
    'head', 'lead', 'leader', 'supervisor', 'principal', 'in-charge'
  ],
  'supervisor': [
    'team lead', 'foreman', 'overseer', 'chief', 'lead', 'coordinator', 'spv'
  ],
  'staff': [
    'officer', 'associate', 'assistant', 'specialist', 'analyst', 'clerk', 'executive'
  ],
  'director': [
    'head', 'vp', 'vice president', 'chief', 'principal', 'general manager', 'gm'
  ],
  'general manager': [
    'gm', 'operations director', 'branch head', 'business unit manager', 'head of operations'
  ],
  'coordinator': [
    'facilitator', 'liaison', 'organizer', 'planner', 'administrator', 'lead'
  ],
  'assistant': [
    'aide', 'deputy', 'associate', 'secretary', 'support specialist'
  ],

  // =========================================================================
  // 3. BUSINESS OPERATIONS, RETAIL & STORE MANAGEMENT
  // =========================================================================
  'operations': [
    'operational', 'business operations', 'bizops', 'process governance', 'workflow management',
    'field operations', 'store operations'
  ],
  'store': [
    'retail store', 'outlet', 'branch', 'shop', 'boutique', 'showroom', 'retail outlet'
  ],
  'retail': [
    'store operations', 'merchandising', 'fmcg', 'brick and mortar', 'point of sale', 'pos'
  ],
  'sop': [
    'standard operating procedure', 'standard operating procedures', 'policy',
    'work instructions', 'guidelines', 'workflow', 'standardization'
  ],
  'store manager': [
    'retail manager', 'store lead', 'shop manager', 'outlet manager', 'store supervisor'
  ],
  'inventory': [
    'stock', 'stock control', 'inventory control', 'stock audit', 'stock replenishment', 'merchandise'
  ],

  // =========================================================================
  // 4. PROJECT MANAGEMENT & PMO
  // =========================================================================
  'project': [
    'program', 'initiative', 'project management', 'pmo', 'work package', 'deliverable'
  ],
  'pmo': [
    'project management office', 'program office', 'project coordinator', 'project officer', 'project governance'
  ],
  'project manager': [
    'pmo lead', 'program manager', 'delivery manager', 'project lead', 'technical project manager'
  ],
  'agile': [
    'scrum', 'sprint', 'kanban', 'backlog', 'standup', 'iterative delivery'
  ],
  'scrum': [
    'agile', 'scrum master', 'sprint planning', 'backlog grooming', 'retrospective'
  ],
  'timeline': [
    'milestone', 'gantt chart', 'schedule', 'work breakdown structure', 'wbs', 'project deadline'
  ],

  // =========================================================================
  // 5. CREATIVE, MEDIA & VIDEO PRODUCTION (CPM)
  // =========================================================================
  'creative': [
    'creative production', 'content creation', 'art direction', 'creative design'
  ],
  'producer': [
    'creative producer', 'video producer', 'media producer', 'content producer', 'executive producer'
  ],
  'video': [
    'video production', 'videography', 'shooting', 'filming', 'video editing', 'motion graphics'
  ],
  'content': [
    'media assets', 'social content', 'promotional video', 'creative assets', 'content project'
  ],
  'creative project': [
    'media production', 'video campaign', 'creative producer', 'content production', 'content project'
  ],

  // =========================================================================
  // 6. ADMINISTRATION, SECRETARIAL & OFFICE MANAGEMENT
  // =========================================================================
  'administration': [
    'admin', 'office management', 'clerical', 'data entry', 'record keeping', 'documentation'
  ],
  'admin': [
    'administration', 'administrator', 'office administrator', 'administrative assistant'
  ],
  'secretary': [
    'executive assistant', 'ea', 'personal assistant', 'pa', 'office secretary', 'administrative liaison'
  ],
  'receptionist': [
    'front desk', 'front office', 'guest relation', 'switchboard operator', 'concierge'
  ],
  'data entry': [
    'data processing', 'database updating', 'transcription', 'typing', 'record management'
  ],

  // =========================================================================
  // 7. MARKETING, DIGITAL MEDIA & BRANDING
  // =========================================================================
  'marketing': [
    'digital marketing', 'brand marketing', 'advertising', 'growth marketing', 'campaign management'
  ],
  'digital marketing': [
    'performance marketing', 'online marketing', 'paid ads', 'meta ads', 'google ads', 'seo', 'sem'
  ],
  'social media': [
    'social media marketing', 'smm', 'content distribution', 'community management', 'influencer marketing'
  ],
  'advertising': [
    'ad campaigns', 'paid media', 'promotion', 'creative ads', 'commercials'
  ],

  // =========================================================================
  // 8. SALES & BUSINESS DEVELOPMENT
  // =========================================================================
  'sales': [
    'business development', 'account management', 'deal closing', 'revenue generation', 'canvassing'
  ],
  'business development': [
    'bizdev', 'b2b sales', 'strategic partnership', 'client acquisition', 'commercial growth'
  ],
  'account executive': [
    'ae', 'sales representative', 'client relationship manager', 'corporate sales'
  ],

  // =========================================================================
  // 9. FINANCE & ACCOUNTING
  // =========================================================================
  'finance': [
    'financial management', 'cash flow', 'budgeting', 'treasury', 'financial forecasting'
  ],
  'accounting': [
    'bookkeeping', 'general ledger', 'gl', 'financial reporting', 'balance sheet', 'profit and loss', 'p&l'
  ],
  'tax': [
    'taxation', 'corporate tax', 'vat', 'tax compliance', 'withholding tax', 'tax return'
  ],
  'audit': [
    'internal audit', 'compliance audit', 'financial inspection', 'risk assessment'
  ],

  // =========================================================================
  // 10. SUPPLY CHAIN, LOGISTICS & PROCUREMENT
  // =========================================================================
  'logistics': [
    'freight', 'distribution', 'shipping', 'transportation', 'fleet management', 'supply chain'
  ],
  'warehouse': [
    'inventory warehouse', 'stockroom', 'fulfillment center', 'inbound outbound', 'storage'
  ],
  'procurement': [
    'purchasing', 'vendor management', 'supplier negotiation', 'strategic sourcing', 'purchase order'
  ],
  'purchasing': [
    'procurement', 'buyer', 'buying', 'vendor sourcing', 'order placement', 'po tracking'
  ],

  // =========================================================================
  // 11. INFORMATION TECHNOLOGY & SOFTWARE
  // =========================================================================
  'it': [
    'information technology', 'tech', 'software', 'systems', 'infrastructure'
  ],
  'developer': [
    'software engineer', 'programmer', 'web developer', 'full stack developer', 'backend developer'
  ],
  'software': [
    'applications', 'systems', 'programs', 'web app', 'digital platforms'
  ]
};
