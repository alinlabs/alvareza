import { DomainMetadata } from './domain-definitions';

export const pmoDomain: DomainMetadata = {
  domain: 'pmo',
  nameIn: 'Manajemen Proyek & Delivery (PMO)',
  nameEn: 'Project Management Office (PMO)',
  roles: [
    {
      key: 'project_management_office',
      code: 'PMO',
      basesIn: [
        'pmo', 'project management', 'project manager', 'manajer proyek', 'project lead',
        'manajemen proyek', 'project coordinator', 'project delivery', 'pengelola proyek'
      ],
      basesEn: [
        'pmo manager', 'project manager', 'project lead', 'head of pmo', 'project delivery lead',
        'program manager', 'pmo specialist'
      ],
      strongIn: ['pmo', 'project management', 'project manager', 'manajer proyek', 'project delivery'],
      strongEn: ['pmo', 'project management', 'project manager', 'program management', 'project delivery'],
      secondaryIn: ['wbs work breakdown structure', 'gantt chart & critical path', 'manajemen risiko proyek', 'baseline schedule & budget', 'rapat koordinasi stakeholder'],
      secondaryEn: ['work breakdown structure wbs', 'gantt chart critical path', 'project risk management', 'budget baseline tracking', 'stakeholder governance']
    },
    {
      key: 'it_digital_project_management',
      code: 'ITP',
      basesIn: [
        'it project manager', 'digital project manager', 'software project manager', 'pm tech',
        'proyek it', 'it project lead', 'digital project delivery', 'proyek perangkat lunak'
      ],
      basesEn: [
        'it project manager', 'technical project manager', 'digital project manager', 'software pm',
        'engineering project manager', 'tech delivery lead'
      ],
      strongIn: ['it project manager', 'digital project', 'software project', 'technical project manager'],
      strongEn: ['it project manager', 'technical project manager', 'digital project manager', 'software delivery'],
      secondaryIn: ['sdlc waterfall & agile', 'jira trello backlog', 'uat user acceptance testing', 'go live deployment timeline', 'sprint planning dev'],
      secondaryEn: ['software development lifecycle sdlc', 'jira sprint backlog', 'uat coordination', 'production deployment release', 'scope management']
    },
    {
      key: 'event_production_management',
      code: 'EVO',
      basesIn: [
        'event organizer', 'eo', 'event manager', 'event production', 'penyelenggara acara',
        'manajer acara', 'event coordinator', 'event specialist', 'produksi event'
      ],
      basesEn: [
        'event manager', 'event producer', 'event director', 'event operations lead',
        'event production manager', 'event coordinator'
      ],
      strongIn: ['event organizer', 'eo', 'event manager', 'event production', 'penyelenggara acara'],
      strongEn: ['event manager', 'event producer', 'event production', 'event coordinator'],
      secondaryIn: ['rundown acara ketat', 'loading & venue setup', 'koordinasi vendor sound lighting panggung', 'manajemen crowd & guest flow'],
      secondaryEn: ['event rundown choreography', 'venue logistics setup', 'vendor av stage coordination', 'crowd safety protocols']
    },
    {
      key: 'ngo_community_program_management',
      code: 'NGO',
      basesIn: [
        'ngo', 'nonprofit', 'program manager ngo', 'yayasan', 'nirlaba', 'program kemanusiaan',
        'community development', 'community program', 'pengelola program sosial'
      ],
      basesEn: [
        'ngo program manager', 'nonprofit director', 'community development lead',
        'grant project manager', 'humanitarian program lead'
      ],
      strongIn: ['ngo', 'nonprofit', 'yayasan', 'program sosial', 'community development'],
      strongEn: ['ngo', 'nonprofit', 'community development', 'humanitarian programs', 'social impact'],
      secondaryIn: ['logframe logical framework', 'laporan pertanggungjawaban donor', 'm&e monitoring and evaluation', 'pemberdayaan masyarakat akar rumput'],
      secondaryEn: ['logical framework approach', 'donor accountability reports', 'monitoring and evaluation m&e', 'grassroots community engagement']
    },
    {
      key: 'agile_scrum_master',
      code: 'ASM',
      basesIn: [
        'scrum master', 'agile coach', 'scrum', 'agile delivery', 'sprint master',
        'facilitator scrum', 'agile practitioner', 'kanban master'
      ],
      basesEn: [
        'scrum master', 'agile coach', 'agile delivery manager', 'certified scrum master csm',
        'scrum facilitator', 'agile practitioner'
      ],
      strongIn: ['scrum master', 'agile coach', 'scrum', 'sprint planning', 'daily standup'],
      strongEn: ['scrum master', 'agile coach', 'scrum delivery', 'sprint ceremonies'],
      secondaryIn: ['daily standup sprint retro', 'sprint burndown chart', 'menghilangkan blocker tim dev', 'velocity tracking & backlog refinement'],
      secondaryEn: ['daily standup and retrospective', 'burndown velocity metrics', 'impediment removal', 'backlog grooming sessions']
    },
    {
      key: 'implementation_onboarding_pm',
      code: 'IPM',
      basesIn: [
        'implementation manager', 'implementation project manager', 'onboarding project manager',
        'manajer implementasi', 'project onboarding', 'client rollout manager'
      ],
      basesEn: [
        'implementation manager', 'client onboarding manager', 'customer rollout lead',
        'enterprise implementation specialist', 'solutions deployment manager'
      ],
      strongIn: ['implementation manager', 'client onboarding', 'manajer implementasi', 'system rollout'],
      strongEn: ['implementation manager', 'client onboarding', 'solution rollout', 'deployment manager'],
      secondaryIn: ['data migration checklist', 'user training modul', 'timeline go live klien', 'hypercare support pasca launching'],
      secondaryEn: ['data migration governance', 'end user training workshops', 'client go live sign off', 'hypercare post launch support']
    },
    {
      key: 'creative_media_production_pm',
      code: 'CPM',
      basesIn: [
        'creative project manager', 'creative pm', 'video production manager', 'media production manager',
        'manajer produksi kreatif', 'creative producer', 'content production lead'
      ],
      basesEn: [
        'creative project manager', 'creative producer', 'media production manager',
        'video production lead', 'content project manager'
      ],
      strongIn: ['creative project manager', 'creative producer', 'video production', 'produksi kreatif'],
      strongEn: ['creative project manager', 'creative producer', 'media production', 'video production'],
      secondaryIn: ['storyboard & shooting schedule', 'post production editing vfx', 'manajemen kru talent & lokasi', 'delivery aset kreatif tepat waktu'],
      secondaryEn: ['storyboarding and shooting schedule', 'post production workflows', 'talent and crew scheduling', 'digital asset deliverables']
    }
  ],
  synonymsIn: {
    'proyek': ['project', 'pmo', 'pekerjaan proyek', 'program kerja', 'inisiatif', 'tenggat waktu'],
    'manajer proyek': ['project manager', 'pm', 'pmo lead', 'koordinator proyek', 'kepala proyek'],
    'timeline': ['jadwal', 'time schedule', 'milestone', 'target waktu', 'tahapan kerja'],
    'anggaran proyek': ['budget', 'rab proyek', 'alokasi biaya', 'cost estimate']
  },
  synonymsEn: {
    'project': ['initiative', 'engagement', 'program', 'workstream', 'project delivery'],
    'project manager': ['pmo lead', 'delivery manager', 'scrum master', 'program manager'],
    'schedule': ['timeline', 'roadmap', 'milestones', 'gantt chart', 'critical path']
  }
};

export const logisticsDomain: DomainMetadata = {
  domain: 'logistics',
  nameIn: 'Rantai Pasok, Logistik & Pengadaan (SCM)',
  nameEn: 'Supply Chain, Logistics & Procurement (SCM)',
  roles: [
    {
      key: 'supply_chain_management',
      code: 'SCM',
      basesIn: [
        'supply chain', 'scm', 'rantai pasok', 'logistik', 'logistics', 'manajemen logistik',
        'supply chain operations', 'supply chain lead', 'distribusi rantai pasok'
      ],
      basesEn: [
        'supply chain manager', 'head of supply chain', 'supply chain director', 'scm lead',
        'supply chain operations manager', 'logistics and supply chain'
      ],
      strongIn: ['supply chain', 'scm', 'rantai pasok', 'logistik', 'logistics'],
      strongEn: ['supply chain', 'scm', 'logistics', 'supply chain management'],
      secondaryIn: ['end to end supply chain visibility', 'lead time optimization', 'biaya logistik per unit', 'inventory turnover rasio'],
      secondaryEn: ['end to end supply chain', 'lead time reduction', 'logistics cost optimization', 'inventory turnover']
    },
    {
      key: 'ppic_production_planning_inventory',
      code: 'PPC',
      basesIn: [
        'ppic', 'production planning', 'inventory control', 'perencanaan produksi', 'pengendalian persediaan',
        'jadwal produksi', 'mps', 'mrp', 'material planning'
      ],
      basesEn: [
        'ppic specialist', 'production planning and inventory control', 'production planner',
        'inventory controller', 'materials requirement planner'
      ],
      strongIn: ['ppic', 'production planning', 'inventory control', 'perencanaan produksi', 'mrp'],
      strongEn: ['ppic', 'production planner', 'inventory control', 'mrp', 'materials planning'],
      secondaryIn: ['bill of materials bom', 'master production schedule mps', 'safety stock & reorder point rop', 'analisis kapasitas produksi'],
      secondaryEn: ['bill of materials bom', 'master production schedule', 'safety stock calculations', 'capacity requirement planning']
    },
    {
      key: 'procurement_purchasing_sourcing',
      code: 'PRC',
      basesIn: [
        'purchasing', 'procurement', 'pengadaan', 'pembelian', 'buyer', 'sourcing',
        'vendor sourcing', 'purchase order', 'po buyer', 'spesialis pengadaan'
      ],
      basesEn: [
        'procurement manager', 'purchasing manager', 'strategic sourcing specialist',
        'category buyer', 'procurement specialist', 'head of procurement'
      ],
      strongIn: ['purchasing', 'procurement', 'pengadaan', 'pembelian', 'sourcing', 'buyer'],
      strongEn: ['procurement', 'purchasing', 'strategic sourcing', 'buyer', 'category manager'],
      secondaryIn: ['negosiasi term pembayaran top', 'tender vendor supplier', 'saving cost pengadaan 15%', 'purchase requisition pr to po'],
      secondaryEn: ['payment term negotiations', 'supplier vendor bidding', 'procurement cost savings', 'vendor qualification']
    },
    {
      key: 'warehouse_inventory_management',
      code: 'WHS',
      basesIn: [
        'warehouse', 'gudang', 'pergudangan', 'kepala gudang', 'stock opname',
        'inventory management', 'manajemen gudang', 'pergudangan logistik'
      ],
      basesEn: [
        'warehouse manager', 'warehouse supervisor', 'inventory manager', 'distribution center manager',
        'warehouse operations lead'
      ],
      strongIn: ['warehouse', 'gudang', 'pergudangan', 'stock opname', 'manajemen gudang'],
      strongEn: ['warehouse', 'inventory management', 'distribution center', 'warehouse operations'],
      secondaryIn: ['metode fifo lifo fefo', 'akurasi stok 99%+', 'wms warehouse management system', 'tata letak layout racking gudang'],
      secondaryEn: ['fifo fefo stock rotation', '99%+ inventory accuracy', 'warehouse management system wms', 'rack layout optimization']
    },
    {
      key: 'fleet_logistics_dispatch',
      code: 'LDC',
      basesIn: [
        'fleet', 'dispatch', 'ekspedisi', 'pengiriman', 'transportasi', 'armada',
        'logistik pengiriman', 'distribusi armada', 'delivery operations'
      ],
      basesEn: [
        'fleet manager', 'dispatch coordinator', 'transportation manager', 'logistics dispatch lead',
        'delivery fleet supervisor'
      ],
      strongIn: ['fleet', 'dispatch', 'ekspedisi', 'pengiriman', 'transportasi', 'armada'],
      strongEn: ['fleet', 'transportation', 'dispatch', 'freight logistics', 'delivery routing'],
      secondaryIn: ['optimasi rute pengiriman tms', 'biaya bbm solar tol', 'maintenance armada truk', 'sla on-time delivery otd 98%'],
      secondaryEn: ['route optimization tms', 'fuel and toll efficiency', 'fleet preventive maintenance', 'on-time in-full otif metrics']
    },
    {
      key: 'vendor_supplier_management',
      code: 'VMR',
      basesIn: [
        'vendor management', 'supplier management', 'hubungan vendor', 'manajemen pemasok',
        'evaluasi supplier', 'slas vendor', 'rekanan bisnis', 'supplier relationship'
      ],
      basesEn: [
        'vendor management specialist', 'supplier relationship manager srm', 'vendor performance lead',
        'supplier auditor', 'vendor governance manager'
      ],
      strongIn: ['vendor management', 'supplier management', 'manajemen pemasok', 'evaluasi supplier'],
      strongEn: ['vendor management', 'supplier relationship management', 'vendor governance', 'supplier auditing'],
      secondaryIn: ['scorecard vendor kpi', 'audit kepatuhan supplier', 'sla penalti keterlambatan', 'mitigasi risiko rantai pasok'],
      secondaryEn: ['vendor kpi scorecards', 'supplier compliance audits', 'service level agreements sla', 'single source supply risk mitigation']
    },
    {
      key: 'demand_planning_forecasting',
      code: 'DIP',
      basesIn: [
        'demand planning', 'demand planner', 'forecasting', 'peramalan permintaan',
        'demand forecast', 'peramalan stok', 'safety stock planning', 'sales & operations planning', 's&op'
      ],
      basesEn: [
        'demand planner', 'forecasting specialist', 'demand planning manager',
        'sales and operations planning s&op lead', 'supply planner'
      ],
      strongIn: ['demand planning', 'forecasting', 'demand forecast', 'peramalan permintaan', 's&op'],
      strongEn: ['demand planning', 'forecasting', 'demand planner', 's&op', 'supply planning'],
      secondaryIn: ['analisis tren historis penjualan', 'akurasi forecast mape', 'siklus musiman seasonality', 'penyelarasan s&op lintas divisi'],
      secondaryEn: ['historical sales trend analysis', 'forecast accuracy mape', 'seasonality modeling', 'cross functional s&op consensus']
    }
  ],
  synonymsIn: {
    'logistik': ['supply chain', 'scm', 'rantai pasok', 'pengiriman', 'ekspedisi', 'distribusi', 'pergudangan'],
    'pengadaan': ['procurement', 'purchasing', 'pembelian', 'sourcing', 'order barang', 'tender'],
    'gudang': ['warehouse', 'depo', 'distribusi', 'penyimpanan', 'stockist', 'racking'],
    'persediaan': ['inventory', 'stok', 'stock', 'cadangan barang', 'safety stock']
  },
  synonymsEn: {
    'logistics': ['supply chain', 'freight', 'distribution', 'transportation', 'warehousing'],
    'procurement': ['purchasing', 'sourcing', 'vendor acquisition', 'buying', 'contracting'],
    'inventory': ['stock', 'supplies', 'materials', 'warehousing stock', 'safety inventory']
  }
};

export const techDomain: DomainMetadata = {
  domain: 'tech',
  nameIn: 'Teknologi Informasi, ERP & Data',
  nameEn: 'Information Technology, ERP & Data',
  roles: [
    {
      key: 'digital_solutions_software',
      code: 'DIG',
      basesIn: [
        'digital solutions', 'software engineer', 'programmer', 'developer', 'it specialist',
        'pengembang perangkat lunak', 'aplikasi web', 'solusi digital', 'teknologi informasi'
      ],
      basesEn: [
        'software engineer', 'full stack developer', 'web developer', 'digital solutions architect',
        'software developer', 'it specialist', 'tech lead'
      ],
      strongIn: ['digital solutions', 'software engineer', 'programmer', 'developer', 'it specialist'],
      strongEn: ['software engineer', 'developer', 'web developer', 'digital solutions', 'tech lead'],
      secondaryIn: ['typescript react nodejs', 'restful api integration', 'database postgresql mysql', 'git version control', 'arsitektur cloud'],
      secondaryEn: ['typescript react nodejs', 'restful api architecture', 'relational databases sql', 'git workflows', 'cloud infrastructure']
    },
    {
      key: 'business_systems_analysis',
      code: 'BAN',
      basesIn: [
        'business analyst', 'ba', 'analis bisnis', 'systems analyst', 'analis sistem',
        'system analyst', 'business process analyst', 'kebutuhan sistem'
      ],
      basesEn: [
        'business analyst', 'systems analyst', 'it business analyst', 'business systems analyst',
        'lead business analyst', 'process systems analyst'
      ],
      strongIn: ['business analyst', 'ba', 'system analyst', 'analis bisnis', 'analis sistem'],
      strongEn: ['business analyst', 'systems analyst', 'business systems analyst', 'process analysis'],
      secondaryIn: ['brd business requirement document', 'flowchart bpmn proses bisnis', 'use case & user story', 'gap analysis sistem lama ke baru'],
      secondaryEn: ['business requirements document brd', 'bpmn workflow diagrams', 'user stories and acceptance criteria', 'systems gap analysis']
    },
    {
      key: 'data_analytics_bi_operations',
      code: 'DAT',
      basesIn: [
        'data analyst', 'analis data', 'data operations', 'pengolah data', 'data analytics',
        'data reporting', 'analisis statistik data'
      ],
      basesEn: [
        'data analyst', 'data operations specialist', 'analytics specialist', 'business data analyst',
        'lead data analyst', 'reporting analyst'
      ],
      strongIn: ['data analyst', 'analis data', 'data operations', 'data analytics'],
      strongEn: ['data analyst', 'data operations', 'analytics specialist', 'business analytics'],
      secondaryIn: ['query sql kompleks', 'python pandas data cleaning', 'visualisasi data insight', 'pembersihan data cleansing'],
      secondaryEn: ['complex sql queries', 'python pandas data wrangling', 'statistical visualization', 'data pipeline hygiene']
    },
    {
      key: 'frontend_web_development',
      code: 'FED',
      basesIn: [
        'frontend developer', 'front end developer', 'fe developer', 'web developer',
        'react developer', 'javascript developer', 'ui engineer', 'pengembang antarmuka web'
      ],
      basesEn: [
        'frontend developer', 'front end engineer', 'react developer', 'ui developer',
        'web application developer', 'frontend specialist'
      ],
      strongIn: ['frontend', 'front end', 'react developer', 'web developer', 'ui engineer'],
      strongEn: ['frontend developer', 'front end engineer', 'react developer', 'web developer'],
      secondaryIn: ['react tailwind css vite', 'responsive mobile friendly layout', 'state management hooks', 'aksesibilitas web a11y'],
      secondaryEn: ['react tailwindcss vite', 'responsive web design', 'modern state management', 'component modularity']
    },
    {
      key: 'technical_product_management',
      code: 'PDM',
      basesIn: [
        'product manager', 'pm', 'technical product manager', 'tpm', 'product owner',
        'po', 'manajer produk', 'product lead'
      ],
      basesEn: [
        'product manager', 'technical product manager', 'product owner', 'head of product',
        'principal product manager', 'product lead'
      ],
      strongIn: ['product manager', 'technical product manager', 'product owner', 'product lead'],
      strongEn: ['product manager', 'technical product manager', 'product owner', 'product lead'],
      secondaryIn: ['product roadmap strategi', 'backlog prioritization ricing', 'mvp minimum viable product', 'metrik produk daur hidup'],
      secondaryEn: ['product roadmapping', 'rice backlog prioritization', 'mvp scoping', 'feature adoption analytics']
    },
    {
      key: 'erp_crm_systems_implementation',
      code: 'ERP',
      basesIn: [
        'erp specialist', 'crm specialist', 'implementasi erp', 'odoo', 'sap',
        'konsultan erp', 'erp analyst', 'sistem erp crm'
      ],
      basesEn: [
        'erp specialist', 'erp implementation consultant', 'crm administrator',
        'odoo specialist', 'sap consultant', 'enterprise systems manager'
      ],
      strongIn: ['erp', 'crm', 'implementasi erp', 'odoo', 'sap', 'konsultan erp'],
      strongEn: ['erp implementation', 'crm administrator', 'odoo', 'sap', 'enterprise systems'],
      secondaryIn: ['kustomisasi modul erp', 'migrasi master data sistem', 'pelatihan staf pengguna erp', 'integrasi api modul keuangan'],
      secondaryEn: ['erp module customization', 'system data migration', 'user training and documentation', 'financial module integrations']
    },
    {
      key: 'business_intelligence_dashboard',
      code: 'BIA',
      basesIn: [
        'bi analyst', 'business intelligence', 'dashboard specialist', 'looker studio',
        'power bi', 'visualisasi data bi', 'tableau specialist'
      ],
      basesEn: [
        'business intelligence analyst', 'bi developer', 'bi dashboard specialist',
        'looker studio developer', 'power bi specialist', 'tableau developer'
      ],
      strongIn: ['business intelligence', 'bi analyst', 'looker studio', 'power bi', 'dashboard bi'],
      strongEn: ['business intelligence', 'bi analyst', 'power bi', 'looker studio', 'tableau'],
      secondaryIn: ['pemodelan data star schema', 'dax power bi formula', 'otomatisasi laporan eksekutif', 'koneksi bigquery data warehouse'],
      secondaryEn: ['star schema data modeling', 'dax formulas', 'automated executive reporting', 'data warehouse connectors']
    }
  ],
  synonymsIn: {
    'teknologi': ['it', 'digital', 'software', 'aplikasi', 'sistem informasi', 'tech'],
    'pemrograman': ['coding', 'programming', 'software development', 'pengembangan web', 'developer'],
    'data': ['analisis data', 'database', 'basis data', 'informasi', 'dataset', 'metrik']
  },
  synonymsEn: {
    'technology': ['it', 'software engineering', 'digital solutions', 'systems development', 'tech'],
    'developer': ['software engineer', 'programmer', 'coder', 'web developer', 'technical specialist'],
    'data': ['analytics', 'metrics', 'business data', 'database', 'information systems']
  }
};

export const consultingDomain: DomainMetadata = {
  domain: 'consulting',
  nameIn: 'Konsultansi Manajemen & Strategis',
  nameEn: 'Strategic Management & Consulting',
  roles: [
    {
      key: 'strategic_management_operations',
      code: 'MGT',
      basesIn: [
        'strategic management', 'manajemen strategis', 'strategi bisnis', 'general manager',
        'gm', 'corporate strategy', 'perencanaan strategis', 'business transformation',
        'strategic planning', 'direktur strategi'
      ],
      basesEn: [
        'strategic management specialist', 'corporate strategy manager', 'general manager',
        'director of strategic planning', 'head of strategy', 'business transformation director'
      ],
      strongIn: ['strategic management', 'manajemen strategis', 'corporate strategy', 'business transformation', 'general manager'],
      strongEn: ['strategic management', 'corporate strategy', 'business transformation', 'general manager', 'strategic planning'],
      secondaryIn: ['swot pestel framework', 'balanced scorecard bsc', 'penyelarasan visi misi bisnis', 'rekayasa ulang proses bisnis bpr'],
      secondaryEn: ['swot and pestle analysis', 'balanced scorecard', 'strategic vision alignment', 'business process reengineering']
    },
    {
      key: 'management_consulting_advisory',
      code: 'CON',
      basesIn: [
        'management consultant', 'konsultan manajemen', 'business consultant', 'konsultan bisnis',
        'advisory', 'penasihat bisnis', 'strategy consultant', 'operations consultant'
      ],
      basesEn: [
        'management consultant', 'strategy consultant', 'business advisory specialist',
        'management advisory lead', 'senior strategy consultant', 'advisory partner'
      ],
      strongIn: ['management consultant', 'konsultan manajemen', 'business consultant', 'advisory'],
      strongEn: ['management consultant', 'strategy consultant', 'business consultant', 'advisory'],
      secondaryIn: ['kajian kelayakan bisnis feasibility', 'rekomendasi strategis direksi', 'analisis pembanding benchmarking', 'penyusunan roadmap implementasi'],
      secondaryEn: ['feasibility study deliverables', 'executive recommendations', 'industry benchmarking', 'strategic roadmap execution']
    },
    {
      key: 'business_turnaround_restructuring',
      code: 'BTR',
      basesIn: [
        'turnaround', 'restrukturisasi bisnis', 'business restructuring', 'turnaround management',
        'penyelamatan bisnis', 'restrukturisasi operasional', 'cost reduction turnaround'
      ],
      basesEn: [
        'turnaround specialist', 'restructuring consultant', 'business turnaround manager',
        'operational restructuring lead', 'corporate recovery specialist'
      ],
      strongIn: ['turnaround', 'restrukturisasi', 'restructuring', 'turnaround management'],
      strongEn: ['turnaround', 'restructuring', 'corporate recovery', 'turnaround manager'],
      secondaryIn: ['penyelamatan arus kas darurat cash conservation', 'pemangkasan overhead tidak efisien', 'renegosiasi liabilitas & utang', 'restrukturisasi portofolio produk'],
      secondaryEn: ['cash conservation strategies', 'overhead cost rationalization', 'debt and liability restructuring', 'portfolio divestment']
    },
    {
      key: 'public_affairs_advocacy',
      code: 'PAR',
      basesIn: [
        'public affairs', 'kebijakan publik', 'advokasi', 'government affairs',
        'hubungan pemangku kepentingan', 'stakeholder relations', 'regulatory affairs'
      ],
      basesEn: [
        'public affairs manager', 'government affairs specialist', 'policy advocacy lead',
        'regulatory relations manager', 'stakeholder engagement director'
      ],
      strongIn: ['public affairs', 'kebijakan publik', 'advokasi', 'government affairs', 'regulatory affairs'],
      strongEn: ['public affairs', 'government affairs', 'policy advocacy', 'regulatory affairs'],
      secondaryIn: ['kajian dampak regulasi ria', 'posisi advokasi asosiasi industri', 'hubungan kemitraan lintas instansi', 'mitigasi risiko regulasi baru'],
      secondaryEn: ['regulatory impact assessments', 'industry association position papers', 'public policy engagement', 'regulatory risk mitigation']
    }
  ],
  synonymsIn: {
    'strategi': ['strategy', 'rencana strategis', 'taktik bisnis', 'haluan bisnis', 'transformasi'],
    'konsultan': ['consultant', 'adviser', 'advisor', 'penasihat', 'ahli strategi', 'pakar'],
    'restrukturisasi': ['turnaround', 'pembenahan', 'reorganisasi', 'penataan ulang', 'efisiensi radikal']
  },
  synonymsEn: {
    'strategy': ['strategic planning', 'corporate vision', 'business direction', 'transformation'],
    'consultant': ['advisory lead', 'management advisor', 'strategy consultant', 'expert counsel']
  }
};

export const featuredDomain: DomainMetadata = {
  domain: 'featured',
  nameIn: 'Rekomendasi Utama & Profil Lengkap (Featured)',
  nameEn: 'Top Recommendations & Comprehensive Profile (Featured)',
  roles: [
    {
      key: 'optimal',
      code: 'OPT',
      basesIn: [
        'hr specialist', 'human resources specialist', 'spesialis sdm', 'spesialis hrd', 'hr generalist',
        'generalis hr', 'hrbp', 'people operations', 'people ops', 'talent acquisition & ld',
        'hr strategic partner', 'human capital specialist', 'spesialis manajemen talenta'
      ],
      basesEn: [
        'hr specialist', 'human resources specialist', 'hr generalist', 'human resources generalist',
        'people operations lead', 'human capital specialist', 'hr business partner', 'people partner'
      ],
      strongIn: ['hr specialist', 'human resources specialist', 'hr generalist', 'hrbp', 'people operations', 'human capital'],
      strongEn: ['hr specialist', 'human resources specialist', 'hr generalist', 'hrbp', 'people operations', 'human capital'],
      secondaryIn: ['markplus certified hr specialist grade a', 'six sigma white belt cssc', 'pengelolaan 13 gerai ritel', 'koordinasi 6 divisi', 'efisiensi sop 70%'],
      secondaryEn: ['markplus certified hr specialist grade a', 'six sigma white belt cssc', '13 retail outlets supervision', '6 divisions coordination', '70% sop efficiency']
    },
    {
      key: 'all',
      code: 'ALL',
      basesIn: [
        'general manager', 'gm', 'chief operating officer', 'coo', 'head of operations',
        'business director', 'direktur bisnis', 'vp operations', 'executive director',
        'direktur eksekutif', 'deputy gm', 'direktur operasional', 'pemimpin operasional'
      ],
      basesEn: [
        'general manager', 'chief operating officer', 'coo', 'head of business operations',
        'director of operations', 'vice president operations', 'managing director', 'executive director'
      ],
      strongIn: ['general manager', 'chief operating officer', 'coo', 'head of operations', 'business director', 'direktur operasional'],
      strongEn: ['general manager', 'chief operating officer', 'coo', 'director of operations', 'managing director'],
      secondaryIn: ['supervisi komprehensif 100+ proyek', '50+ aplikasi web komersial maha karya', 'tata kelola multi unit bisnis', 'p&l dan transformasi organisasi'],
      secondaryEn: ['supervision of 100+ commercial projects', '50+ commercial web applications ecosystem', 'multi unit corporate governance', 'p&l turnaround']
    }
  ],
  synonymsIn: {
    'pimpinan': ['leader', 'head', 'kepala', 'direktur', 'manajer', 'executive', 'petinggi'],
    'spesialis': ['specialist', 'ahli', 'pakar', 'expert', 'profesional', 'lead practitioner']
  },
  synonymsEn: {
    'leader': ['executive', 'head', 'director', 'general manager', 'chief', 'principal'],
    'specialist': ['expert', 'professional', 'practitioner', 'analyst', 'lead']
  }
};
