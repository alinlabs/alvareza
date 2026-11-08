import { DomainMetadata } from './domain-definitions';

export const hrDomain: DomainMetadata = {
  domain: 'hr',
  nameIn: 'HR (Sumber Daya Manusia)',
  nameEn: 'HR (Human Resources)',
  roles: [
    {
      key: 'hr_operations',
      code: 'HRS',
      basesIn: [
        'hr operations', 'operasional hr', 'operasional hrd', 'operasional sdm', 'hr shared services',
        'hr service delivery', 'people operations', 'people ops', 'tata kelola sdm', 'hr administrative',
        'administrasi kepegawaian', 'human resources operations', 'hc operations', 'human capital operations',
        'operasional kepersonaliaan', 'layanan operasional sdm', 'hr general affairs support', 'hr ops lead'
      ],
      basesEn: [
        'hr operations', 'human resources operations', 'people operations', 'people ops', 'hr service delivery',
        'hr shared services', 'head of people operations', 'hr operations specialist', 'human capital operations',
        'workforce operations', 'personnel operations', 'employee operations', 'hr operational excellence'
      ],
      strongIn: [
        'hr service delivery', 'shared services hr', 'operasional hrd', 'tata kelola sdm', 'hr operations',
        'people operations', 'operasional sdm', 'administrasi sdm', 'hris ops'
      ],
      strongEn: [
        'hr operations', 'people operations', 'hr service delivery', 'hr shared services', 'workforce operations',
        'human resources operations', 'people ops'
      ],
      secondaryIn: [
        'sop hrd', 'employee life cycle', 'efisiensi administrasi sdm', 'sla layanan sdm', 'sistem absensi & cuti',
        'tata tertib karyawan', 'surat peringatan sp', 'offboarding', 'onboarding checklist', 'hris talenty'
      ],
      secondaryEn: [
        'sop', 'employee lifecycle', 'hr service sla', 'leave and attendance system', 'hr compliance',
        'disciplinary policy', 'offboarding', 'onboarding workflow', 'hr ticketing system'
      ],
      negativeIn: ['kasir', 'sales counter', 'cleaning', 'security', 'waiter', 'programmer'],
      negativeEn: ['cashier', 'sales counter', 'cleaner', 'security guard', 'waiter', 'software engineer']
    },
    {
      key: 'hrga_generalist',
      code: 'HRG',
      basesIn: [
        'hrga', 'hr & ga', 'hr ga', 'hrd ga', 'hrd & ga', 'hrd dan ga', 'human resources & general affairs',
        'generalist hrga', 'hr generalist & general affairs', 'hrga workplace', 'umum dan hrd', 'kepegawaian dan umum',
        'sdm dan umum', 'sdm & ga', 'hr & general affairs', 'generalist sdm & ga', 'human capital & general affairs'
      ],
      basesEn: [
        'hrga', 'hr & ga', 'hr ga', 'human resources and general affairs', 'hr & general affairs',
        'general affairs and hr', 'workplace & people operations', 'hrga generalist', 'hr & ga generalist',
        'human capital and general affairs'
      ],
      strongIn: [
        'hrga', 'hr & ga', 'hr general affairs', 'hrd ga', 'manajer hrga', 'staf hrga',
        'human resources & general affairs', 'kepegawaian dan umum'
      ],
      strongEn: [
        'hrga', 'hr & ga', 'hr general affairs', 'human resources and general affairs', 'hrga manager',
        'hr & ga specialist'
      ],
      secondaryIn: [
        'fasilitas kantor', 'kepegawaian dan umum', 'perizinan kantor', 'aset kantor', 'absensi & rumah tangga kantor',
        'bpjs & legalitas kantor', 'inventaris kantor', 'pengelolaan driver dan ob', 'atk dan utilitas'
      ],
      secondaryEn: [
        'office facilities', 'workplace management', 'office assets', 'general affairs', 'vendor services',
        'building management', 'office supplies', 'fleet and general services'
      ],
      mustIncludeIn: ['hrga', 'hr ga', 'hr & ga', 'hrd ga', 'hrd & ga', 'ga'],
      mustIncludeEn: ['hrga', 'hr ga', 'hr & ga', 'general affairs']
    },
    {
      key: 'talent_acquisition',
      code: 'REC',
      basesIn: [
        'recruitment', 'recruiter', 'rekrutmen', 'talent acquisition', 'ta specialist', 'talent sourcer',
        'hiring', 'headhunter', 'corporate recruiter', 'technical recruiter', 'executive search',
        'campus recruitment', 'penyaring bakat', 'seleksi sdm', 'recruitment selection', 'talent scout',
        'rekruter', 'spesialis rekrutmen', 'staf talent acquisition', 'spv recruitment'
      ],
      basesEn: [
        'recruitment', 'recruiter', 'talent acquisition', 'ta specialist', 'talent sourcer', 'hiring specialist',
        'corporate recruiter', 'technical recruiter', 'executive recruiter', 'headhunter', 'talent partner',
        'recruitment consultant', 'lead recruiter', 'head of talent acquisition'
      ],
      strongIn: [
        'recruiter', 'recruitment', 'rekrutmen', 'talent acquisition', 'manajer rekrutmen', 'ta specialist',
        'talent sourcing', 'seleksi karyawan'
      ],
      strongEn: [
        'recruiter', 'recruitment', 'talent acquisition', 'talent sourcing', 'headhunter', 'technical recruiter',
        'talent partner'
      ],
      secondaryIn: [
        'interview bebi / star', 'psikotes', 'job portal glints jobstreet linkedin', 'ats applicant tracking system',
        'time to hire', 'penawaran kerja offering letter', 'sourcing talent', 'background check', 'talent pool'
      ],
      secondaryEn: [
        'star interview technique', 'psychometric testing', 'job portals linkedin jobstreet', 'ats applicant tracking system',
        'time to fill', 'job offering', 'candidate sourcing', 'talent pipeline', 'headhunting'
      ],
      mustIncludeIn: ['recruiter', 'recruitment', 'talent acquisition', 'rekrutmen', 'hiring', 'sourcer'],
      mustIncludeEn: ['recruiter', 'recruitment', 'talent acquisition', 'hiring', 'sourcer', 'headhunter']
    },
    {
      key: 'training_learning_dev',
      code: 'LND',
      basesIn: [
        'learning & development', 'l&d', 'lnd', 'training', 'pelatihan', 'trainer', 'people development',
        'diklat', 'instruktur pelatihan', 'tna specialist', 'instructional designer', 'learning specialist',
        'pengembangan kompetensi', 'pengembangan sdm', 'corporate trainer', 'manajer pelatihan'
      ],
      basesEn: [
        'learning and development', 'l&d', 'lnd', 'training specialist', 'corporate trainer', 'people development',
        'instructional designer', 'learning consultant', 'talent development', 'training coordinator',
        'head of l&d', 'training manager'
      ],
      strongIn: [
        'learning and development', 'l&d', 'training', 'pelatihan', 'tna', 'training need analysis',
        'people development', 'pengembangan sdm'
      ],
      strongEn: [
        'learning and development', 'l&d', 'training specialist', 'people development', 'talent development',
        'instructional design', 'tna'
      ],
      secondaryIn: [
        'tna training need analysis', 'kirkpatrick evaluation model', 'modul pelatihan', 'lms learning management system',
        'workshop & seminar', 'mentoring & coaching', 'kompetensi sdm', 'leadership development'
      ],
      secondaryEn: [
        'training needs analysis', 'kirkpatrick model', 'training curriculum', 'lms', 'e-learning',
        'mentorship and coaching', 'leadership development program', 'skill assessment'
      ]
    },
    {
      key: 'organization_development',
      code: 'ODD',
      basesIn: [
        'organization development', 'organizational development', 'od specialist', 'od manager', 'pengembangan organisasi',
        'culture & engagement', 'budaya perusahaan', 'workforce planning', 'job evaluation', 'grading & structure',
        'change management', 'intervensi organisasi', 'efektivitas organisasi', 'organizational design'
      ],
      basesEn: [
        'organizational development', 'organization development', 'od specialist', 'od consultant', 'workforce planning',
        'culture & engagement', 'change management', 'job evaluation', 'organization design', 'talent management'
      ],
      strongIn: [
        'organizational development', 'organization development', 'od specialist', 'pengembangan organisasi',
        'workforce planning', 'job evaluation', 'budaya organisasi'
      ],
      strongEn: [
        'organizational development', 'organization development', 'od specialist', 'workforce planning',
        'change management', 'organization design'
      ],
      secondaryIn: [
        'hay grading system', 'job analysis & job description', 'analisis beban kerja abk', 'manajemen suksesi',
        'culture transformation', 'survei keterikatan karyawan', 'struktur organisasi'
      ],
      secondaryEn: [
        'job grading system', 'job evaluation', 'workload analysis', 'succession planning',
        'employee engagement survey', 'culture transformation', 'competency dictionary'
      ]
    },
    {
      key: 'hr_business_partner',
      code: 'HBP',
      basesIn: [
        'hrbp', 'hr business partner', 'people partner', 'human resources business partner', 'mitra bisnis sdm',
        'strategic hr partner', 'business hr', 'hr account manager', 'hc partner', 'human capital business partner', 'hcbp'
      ],
      basesEn: [
        'hrbp', 'hr business partner', 'people partner', 'human resources business partner', 'strategic people partner',
        'human capital business partner', 'hcbp', 'lead hrbp', 'senior hr business partner'
      ],
      strongIn: [
        'hrbp', 'hr business partner', 'human resources business partner', 'mitra bisnis sdm', 'people partner'
      ],
      strongEn: [
        'hrbp', 'hr business partner', 'human resources business partner', 'people partner', 'strategic hr partner'
      ],
      secondaryIn: [
        'strategic workforce planning', 'stakeholder alignment', 'penyelarasan strategi bisnis sdm',
        'talent review & retention', 'retensi talenta', 'konsultasi kepemimpinan'
      ],
      secondaryEn: [
        'strategic workforce planning', 'stakeholder management', 'talent review', 'retention strategy',
        'leadership advisory', 'organizational health'
      ]
    },
    {
      key: 'compensation_benefits',
      code: 'CNB',
      basesIn: [
        'compensation & benefit', 'c&b', 'cnb', 'payroll', 'penggajian', 'remunerasi', 'total rewards',
        'salary administration', 'upah dan tunjangan', 'benefit specialist', 'analis kompensasi',
        'kompensasi dan benefit', 'payroll officer', 'petugas payroll', 'tax pph 21 payroll'
      ],
      basesEn: [
        'compensation and benefits', 'c&b', 'cnb', 'payroll specialist', 'payroll manager', 'remuneration',
        'total rewards', 'compensation analyst', 'benefits specialist', 'wage and salary administration'
      ],
      strongIn: [
        'compensation & benefit', 'c&b', 'payroll', 'penggajian', 'remunerasi', 'total rewards', 'bpjs ketenagakerjaan'
      ],
      strongEn: [
        'compensation and benefits', 'c&b', 'payroll', 'remuneration', 'total rewards', 'benefits analyst'
      ],
      secondaryIn: [
        'pph pasal 21 ter baru', 'bpjs kesehatan dan edabu', 'bpjstk sipp online', 'struktur skala upah ssu',
        'insentif dan bonus', 'rekap lembur dan absensi', 'slip gaji'
      ],
      secondaryEn: [
        'tax payroll calculation', 'statutory benefits', 'salary benchmarking', 'salary grading scale',
        'bonus and incentive modeling', 'overtime audit', 'payroll reconciliation'
      ]
    },
    {
      key: 'industrial_relations',
      code: 'IRL',
      basesIn: [
        'industrial relations', 'hubungan industrial', 'ir specialist', 'labor relations', 'hubungan ketenagakerjaan',
        'mediasi sdm', 'disnaker compliance', 'pkb & pp', 'perjanjian kerja bersama', 'peraturan perusahaan',
        'perselisihan hubungan industrial', 'phi', 'bipartit tripartit'
      ],
      basesEn: [
        'industrial relations', 'labor relations', 'ir specialist', 'employee relations', 'labor law compliance',
        'union relations', 'dispute resolution', 'collective bargaining'
      ],
      strongIn: [
        'industrial relations', 'hubungan industrial', 'serikat pekerja', 'disnaker', 'pkb', 'bipartit', 'uu cipta kerja'
      ],
      strongEn: [
        'industrial relations', 'labor relations', 'trade union', 'collective bargaining', 'labor compliance'
      ],
      secondaryIn: [
        'uu no 13 2003 ketenagakerjaan', 'uu ciptaker no 6 2023', 'perundingan bipartit tripartit', 'anjuran mediator disnaker',
        'somasi dan litigasi hubungan industrial', 'pemutusan hubungan kerja phk'
      ],
      secondaryEn: [
        'labor regulations', 'collective bargaining agreement', 'grievance handling', 'bipartite mediation',
        'employment termination protocols', 'severance calculation'
      ]
    },
    {
      key: 'people_analytics',
      code: 'PAS',
      basesIn: [
        'people analytics', 'hr analytics', 'workforce analytics', 'hris analyst', 'hr metrics', 'analis data sdm',
        'sistem informasi sdm', 'hr dashboard', 'hc analytics', 'workforce planning analyst', 'hr reporting'
      ],
      basesEn: [
        'people analytics', 'hr analytics', 'workforce analytics', 'hris analyst', 'hr metrics analyst',
        'people data specialist', 'workforce reporting specialist', 'talent analytics'
      ],
      strongIn: [
        'people analytics', 'hr analytics', 'workforce analytics', 'hris', 'dashboard sdm', 'analis data sdm'
      ],
      strongEn: [
        'people analytics', 'hr analytics', 'workforce analytics', 'hris specialist', 'talent metrics'
      ],
      secondaryIn: [
        'turnover rate & attrition rate', 'cost per hire & time to fill', 'looker studio / power bi hr dashboard',
        'sql & excel pivot data sdm', 'e-nps & retention modeling'
      ],
      secondaryEn: [
        'turnover and attrition modeling', 'cost per hire analytics', 'power bi hr dashboard', 'looker studio',
        'sql and advanced excel for hr', 'employee net promoter score'
      ]
    },
    {
      key: 'employer_branding',
      code: 'EBR',
      basesIn: [
        'employer branding', 'employer brand', 'campus hiring', 'campus recruitment', 'university relations',
        'talent attraction', 'citra perusahaan sdm', 'bursa karir', 'job fair coordinator', 'career page manager',
        'candidate experience'
      ],
      basesEn: [
        'employer branding', 'employer brand specialist', 'campus recruitment', 'university relations',
        'talent attraction specialist', 'career branding', 'candidate experience manager'
      ],
      strongIn: [
        'employer branding', 'campus recruitment', 'university relations', 'talent attraction', 'bursa karir'
      ],
      strongEn: [
        'employer branding', 'campus hiring', 'university relations', 'talent attraction', 'career branding'
      ],
      secondaryIn: [
        'linkedin company page', 'evp employee value proposition', 'job fair booth', 'internship program management',
        'social media recruitment branding'
      ],
      secondaryEn: [
        'employee value proposition evp', 'career site management', 'internship program leadership',
        'recruitment marketing campaign', 'social media employer branding'
      ]
    }
  ],
  synonymsIn: {
    'hrd': ['human resources department', 'hr', 'sdm', 'sumber daya manusia', 'human capital', 'hc', 'people operations', 'personalia', 'kepegawaian'],
    'rekrutmen': ['recruitment', 'recruiter', 'talent acquisition', 'ta', 'perekrutan', 'seleksi kerja', 'hiring', 'headhunting', 'sourcing'],
    'penggajian': ['payroll', 'remunerasi', 'gaji', 'upah', 'salary', 'slip gaji', 'payroll processing', 'c&b'],
    'pelatihan': ['training', 'l&d', 'learning development', 'pengembangan sdm', 'diklat', 'workshop', 'mentoring', 'coaching', 'edukasi'],
    'hubungan industrial': ['industrial relations', 'hi', 'serikat pekerja', 'pkb', 'perjanjian kerja bersama', 'peraturan perusahaan', 'disnaker', 'bipartit', 'tripartit'],
    'bpjs': ['bpjstk', 'bpjs ketenagakerjaan', 'bpjs kesehatan', 'sipp', 'edabu', 'jht', 'jkk', 'jkm', 'jp', 'jkp'],
    'absensi': ['kehadiran', 'presensi', 'fingerprint', 'timesheet', 'cuti', 'izin', 'lembur', 'attendance'],
    'kinerja': ['kpi', 'performance appraisal', 'penilaian kinerja', 'evaluasi kerja', 'okr', 'target kerja'],
    'kontrak kerja': ['pkwt', 'pkwtt', 'surat perjanjian kerja', 'spk', 'perjanjian kerja waktu tertentu']
  },
  synonymsEn: {
    'human resources': ['hr', 'hrd', 'people operations', 'people ops', 'human capital', 'hc', 'personnel', 'talent management'],
    'recruitment': ['recruiting', 'talent acquisition', 'ta', 'talent sourcing', 'hiring', 'headhunting', 'executive search', 'staffing'],
    'payroll': ['salary administration', 'compensation', 'remuneration', 'wage processing', 'c&b', 'total rewards'],
    'training': ['learning and development', 'l&d', 'talent development', 'employee development', 'instructional design', 'coaching', 'mentoring'],
    'industrial relations': ['labor relations', 'employee relations', 'union relations', 'collective bargaining', 'labor compliance'],
    'performance': ['kpi', 'okr', 'performance appraisal', 'performance management', 'employee evaluation', 'goal tracking'],
    'employment contract': ['job offer', 'employment agreement', 'contract of service', 'appointment letter', 'fixed term contract']
  }
};

export const operationsDomain: DomainMetadata = {
  domain: 'operations',
  nameIn: 'Operasional & Ritel',
  nameEn: 'Operations & Retail',
  roles: [
    {
      key: 'operations_management',
      code: 'OPS',
      basesIn: [
        'operations', 'operasional', 'business operations', 'bizops', 'head of operations', 'manajer operasional',
        'spv operasional', 'director of operations', 'coo', 'operations lead', 'operations coordinator',
        'operasional bisnis', 'manajemen operasional', 'general operations'
      ],
      basesEn: [
        'operations', 'business operations', 'bizops', 'head of operations', 'operations manager',
        'director of operations', 'coo', 'operations lead', 'operational management', 'commercial operations'
      ],
      strongIn: ['operations', 'operasional', 'business operations', 'manajer operasional', 'head of operations', 'coo'],
      strongEn: ['operations', 'business operations', 'operations manager', 'director of operations', 'coo', 'operations lead'],
      secondaryIn: ['sop operasional', 'efisiensi biaya operasional', 'sla operasional', 'kpi toko dan operasional', 'pengawasan ritel'],
      secondaryEn: ['operational sop', 'cost efficiency', 'operational sla', 'kpi tracking', 'process streamlining']
    },
    {
      key: 'retail_store_operations',
      code: 'RTL',
      basesIn: [
        'retail', 'ritel', 'store operations', 'store manager', 'kepala toko', 'supervisor toko', 'spv store',
        'outlet manager', 'supermarket', 'minimarket', 'pramuniaga', 'retail lead', 'retail supervisor',
        'gerai toko', 'manajer gerai', 'store associate', 'cashier lead'
      ],
      basesEn: [
        'retail', 'store operations', 'store manager', 'retail supervisor', 'outlet manager', 'store lead',
        'retail operations manager', 'shop manager', 'store director'
      ],
      strongIn: ['retail', 'ritel', 'store manager', 'kepala toko', 'outlet', 'gerai', 'spv store'],
      strongEn: ['retail', 'store operations', 'store manager', 'outlet manager', 'retail supervisor'],
      secondaryIn: ['pos point of sales', 'visual merchandising vm', 'loss prevention shrinkage', 'stock opname toko', 'target omzet ritel'],
      secondaryEn: ['point of sale pos', 'visual merchandising', 'shrinkage control', 'inventory counting', 'retail sales target']
    },
    {
      key: 'branch_multi_unit_management',
      code: 'BRN',
      basesIn: [
        'branch manager', 'kepala cabang', 'kacab', 'area manager', 'multi unit manager', 'district manager',
        'regional manager', 'pimpinan cabang', 'branch operations', 'operasional cabang', 'area coordinator'
      ],
      basesEn: [
        'branch manager', 'area manager', 'multi unit manager', 'district manager', 'regional manager',
        'branch operations manager', 'area operations lead'
      ],
      strongIn: ['branch manager', 'kepala cabang', 'kacab', 'area manager', 'multi unit', 'regional manager'],
      strongEn: ['branch manager', 'area manager', 'multi unit manager', 'district manager', 'regional operations'],
      secondaryIn: ['audit cabang', 'p&l cabang', 'target pertumbuhan cabang', 'supervisi multi gerai', 'standardisasi cabang'],
      secondaryEn: ['branch audit', 'branch p&l', 'multi unit supervision', 'regional growth', 'operational consistency']
    },
    {
      key: 'general_affairs_facilities',
      code: 'GAF',
      basesIn: [
        'general affairs', 'ga', 'umum', 'fasilitas kantor', 'facility management', 'workplace operations',
        'office manager', 'building management', 'aset kantor', 'urusan rumah tangga kantor', 'operasional kantor ga'
      ],
      basesEn: [
        'general affairs', 'facility management', 'facilities manager', 'workplace operations', 'office manager',
        'building manager', 'corporate services', 'facilities coordinator'
      ],
      strongIn: ['general affairs', 'ga', 'fasilitas kantor', 'facility management', 'office manager', 'building management'],
      strongEn: ['general affairs', 'facility management', 'workplace operations', 'office manager', 'facilities director'],
      secondaryIn: ['pemeliharaan gedung me', 'perpanjangan perizinan genset amdal', 'pengelolaan vendor outsourcing', 'atk dan kebersihan'],
      secondaryEn: ['building maintenance mep', 'statutory compliance', 'outsourced vendor management', 'office cleaning and security']
    },
    {
      key: 'quality_assurance_control',
      code: 'QAC',
      basesIn: [
        'quality assurance', 'quality control', 'qa', 'qc', 'qa/qc', 'qa qc', 'pengendalian mutu', 'penjaminan mutu',
        'inspektur mutu', 'quality inspector', 'mutu produk', 'quality compliance', 'iso auditor'
      ],
      basesEn: [
        'quality assurance', 'quality control', 'qa', 'qc', 'qa/qc', 'quality inspector', 'quality manager',
        'quality compliance', 'qa lead'
      ],
      strongIn: ['quality assurance', 'quality control', 'qa', 'qc', 'pengendalian mutu', 'penjaminan mutu', 'iso 9001'],
      strongEn: ['quality assurance', 'quality control', 'qa', 'qc', 'quality compliance', 'iso 9001'],
      secondaryIn: ['iso 9001 2015', 'audit mutu internal', 'standar reject & defect', 'capa corrective action', 'pengujian produk'],
      secondaryEn: ['iso 9001', 'internal quality audit', 'defect rate reduction', 'corrective and preventive actions capa', 'batch testing']
    },
    {
      key: 'manufacturing_production_ops',
      code: 'MFG',
      basesIn: [
        'manufacturing', 'manufaktur', 'production', 'produksi', 'plant manager', 'kepala pabrik',
        'supervisor produksi', 'spv produksi', 'production operations', 'workshop manager', 'lini produksi'
      ],
      basesEn: [
        'manufacturing', 'production', 'plant manager', 'factory manager', 'production supervisor',
        'manufacturing operations', 'production manager'
      ],
      strongIn: ['manufacturing', 'manufaktur', 'produksi', 'plant manager', 'kepala pabrik', 'spv produksi'],
      strongEn: ['manufacturing', 'production', 'plant manager', 'production manager', 'factory head'],
      secondaryIn: ['oee overall equipment effectiveness', 'tpm total productive maintenance', 'target output harian', 'keselamatan kerja k3'],
      secondaryEn: ['overall equipment effectiveness oee', 'total productive maintenance tpm', 'daily production quota', 'workplace safety ehs']
    },
    {
      key: 'field_operations_management',
      code: 'FLD',
      basesIn: [
        'field operations', 'lapangan', 'koordinator lapangan', 'korlap', 'field supervisor', 'site supervisor',
        'inspektur lapangan', 'petugas lapangan', 'operasional lapangan', 'field officer'
      ],
      basesEn: [
        'field operations', 'field supervisor', 'site supervisor', 'field operations manager', 'site operations lead',
        'field coordinator'
      ],
      strongIn: ['field operations', 'lapangan', 'koordinator lapangan', 'korlap', 'field supervisor', 'site supervisor'],
      strongEn: ['field operations', 'field supervisor', 'site supervisor', 'field operations manager'],
      secondaryIn: ['inspeksi lapangan', 'survei lokasi', 'koordinasi tim lapangan', 'laporan harian lapangan', 'problem solving on-site'],
      secondaryEn: ['field inspection', 'site survey', 'field team leadership', 'daily site reports', 'incident resolution']
    },
    {
      key: 'public_utilities_operations',
      code: 'UTL',
      basesIn: [
        'utility', 'utilitas', 'pdam', 'bpspams', 'air bersih', 'layanan utilitas', 'sanitasi',
        'public utilities', 'jaringan pipa', 'instalasi air', 'operator utilitas'
      ],
      basesEn: [
        'utilities', 'public utilities', 'water utility', 'utility operations', 'water distribution',
        'utility manager', 'municipal services'
      ],
      strongIn: ['utility', 'utilitas', 'pdam', 'bpspams', 'air bersih', 'public utilities'],
      strongEn: ['utilities', 'public utilities', 'water utility', 'utility operations'],
      secondaryIn: ['jaringan transmisi pipa', 'uji kelayakan air ph klorin', 'layanan pelanggan meteran air', 'pemeliharaan pompa'],
      secondaryEn: ['pipe distribution network', 'water quality testing', 'meter reading and billing', 'pump station maintenance']
    },
    {
      key: 'operational_excellence_lean',
      code: 'OPX',
      basesIn: [
        'operational excellence', 'opx', 'continuous improvement', 'ci', 'kaizen', 'lean', 'six sigma',
        'lean six sigma', '5s', 'efisiensi proses', 'rekayasa proses', 'process improvement'
      ],
      basesEn: [
        'operational excellence', 'opx', 'continuous improvement', 'ci', 'lean', 'six sigma', 'kaizen',
        'lean six sigma', 'process optimization', 'lean transformation'
      ],
      strongIn: ['operational excellence', 'opx', 'continuous improvement', 'kaizen', 'lean', 'six sigma', '5s'],
      strongEn: ['operational excellence', 'opx', 'continuous improvement', 'lean six sigma', 'kaizen', 'process optimization'],
      secondaryIn: ['dmaic methodology', 'value stream mapping vsm', 'eliminasi waste muda', 'kanban system', 'root cause analysis rca'],
      secondaryEn: ['dmaic framework', 'value stream mapping', 'waste reduction muda', 'kanban methodology', 'root cause analysis']
    },
    {
      key: 'franchise_retail_expansion',
      code: 'FRE',
      basesIn: [
        'franchise', 'waralaba', 'retail expansion', 'ekspansi ritel', 'franchise operations',
        'kemitraan waralaba', 'franchise manager', 'new store opening', 'nso', 'pembukaan cabang baru'
      ],
      basesEn: [
        'franchise', 'franchise operations', 'retail expansion', 'franchise manager', 'new store opening',
        'nso specialist', 'store rollout lead'
      ],
      strongIn: ['franchise', 'waralaba', 'retail expansion', 'ekspansi ritel', 'new store opening', 'nso'],
      strongEn: ['franchise', 'franchise operations', 'retail expansion', 'new store opening', 'store rollout'],
      secondaryIn: ['studi kelayakan lokasi feasibility study', 'standardisasi kemitraan', 'onboarding mitra waralaba', 'timeline launching gerai'],
      secondaryEn: ['location feasibility study', 'franchisee onboarding', 'store launch roadmap', 'franchise compliance audit']
    },
    {
      key: 'product_operations_tech',
      code: 'POM',
      basesIn: [
        'product operations', 'product ops', 'operasional produk', 'prodops', 'tech operations',
        'platform operations', 'product release ops', 'product enablement'
      ],
      basesEn: [
        'product operations', 'product ops', 'prodops', 'platform operations', 'product enablement',
        'head of product operations', 'product operations lead'
      ],
      strongIn: ['product operations', 'product ops', 'operasional produk', 'prodops', 'product enablement'],
      strongEn: ['product operations', 'product ops', 'prodops', 'product enablement', 'platform operations'],
      secondaryIn: ['user feedback loop', 'product release checklist', 'analisis adopsi fitur', 'sla resolusi bug', 'cross-functional product alignment'],
      secondaryEn: ['user feedback triage', 'feature adoption tracking', 'release operations', 'cross functional alignment', 'product metrics analytics']
    }
  ],
  synonymsIn: {
    'operasional': ['operations', 'ops', 'tata kelola', 'manajemen operasional', 'pelaksanaan kerja', 'kegiatan usaha'],
    'ritel': ['retail', 'toko', 'store', 'outlet', 'gerai', 'supermarket', 'minimarket', 'swalayan'],
    'cabang': ['branch', 'area', 'regional', 'unit kerja', 'wilayah kerja', 'gerai cabang'],
    'mutu': ['kualitas', 'quality', 'qa', 'qc', 'quality assurance', 'quality control', 'pengendalian mutu'],
    'gudang': ['warehouse', 'pergudangan', 'depo', 'penyimpanan', 'stok barang', 'inventory'],
    'efisiensi': ['streamlining', 'optimasi', 'penghematan', 'eliminasi waste', 'lean', 'kaizen']
  },
  synonymsEn: {
    'operations': ['operational management', 'ops', 'business operations', 'bizops', 'service delivery'],
    'retail': ['store management', 'shop operations', 'outlet operations', 'supermarket', 'merchandising'],
    'branch': ['regional office', 'area office', 'multi unit', 'district office', 'local affiliate'],
    'quality': ['qa', 'qc', 'quality assurance', 'quality control', 'standards compliance', 'defect prevention'],
    'excellence': ['continuous improvement', 'lean', 'six sigma', 'kaizen', 'process optimization']
  }
};

export const adminDomain: DomainMetadata = {
  domain: 'admin',
  nameIn: 'Administrasi & Kesekretariatan',
  nameEn: 'Administration & Secretariat',
  roles: [
    {
      key: 'office_administration',
      code: 'ADM',
      basesIn: [
        'office admin', 'admin kantor', 'administrasi perkantoran', 'tata usaha', 'tu', 'staf tu',
        'general admin', 'admin umum', 'back office', 'front office', 'resepsionis', 'receptionist',
        'front desk', 'clerk', 'administrasi umum', 'administrasi surat', 'kearsipan'
      ],
      basesEn: [
        'office admin', 'office administrator', 'administrative assistant', 'general admin', 'back office clerk',
        'office coordinator', 'receptionist', 'front desk officer', 'administrative officer', 'office support'
      ],
      strongIn: ['office admin', 'admin kantor', 'administrasi perkantoran', 'tata usaha', 'admin umum', 'resepsionis', 'front desk'],
      strongEn: ['office admin', 'office administrator', 'administrative assistant', 'receptionist', 'front desk', 'back office'],
      secondaryIn: ['surat menyurat korespondensi', 'notulensi rapat', 'filing & kearsipan', 'typing 72 wpm', 'rekap data spreadsheet'],
      secondaryEn: ['business correspondence', 'meeting minutes', 'digital filing', 'data recording', 'calendar management']
    },
    {
      key: 'executive_assistant',
      code: 'AST',
      basesIn: [
        'executive assistant', 'ea', 'personal assistant', 'pa', 'sekretaris', 'secretary', 'sekretaris direksi',
        'sekretaris pimpinan', 'asisten direktur', 'asisten direksi', 'asisten pribadi', 'private secretary', 'board secretary'
      ],
      basesEn: [
        'executive assistant', 'personal assistant', 'secretary', 'executive secretary', 'board secretary',
        'private secretary', 'assistant to ceo', 'executive coordinator'
      ],
      strongIn: ['executive assistant', 'personal assistant', 'sekretaris', 'secretary', 'asisten direksi', 'asisten direktur'],
      strongEn: ['executive assistant', 'personal assistant', 'secretary', 'executive secretary', 'assistant to ceo'],
      secondaryIn: ['itinerary & travel arrangement', 'minutes of meeting mom', 'pengaturan jadwal c-level', 'protokoler direksi', 'kerahasiaan dokumen'],
      secondaryEn: ['executive travel arrangements', 'board meeting minutes', 'c-level schedule management', 'confidential correspondence']
    },
    {
      key: 'hospital_office_admin',
      code: 'HOS',
      basesIn: [
        'admin rumah sakit', 'admin rs', 'admin klinik', 'hospital admin', 'healthcare admin', 'rekam medis',
        'medical records', 'admisi rs', 'pendaftaran pasien', 'administrasi faskes', 'casemix rs', 'klaim bpjs rs'
      ],
      basesEn: [
        'hospital admin', 'hospital administrator', 'healthcare admin', 'clinic admin', 'medical records clerk',
        'patient administrator', 'hospital admissions officer'
      ],
      strongIn: ['admin rs', 'admin rumah sakit', 'admin klinik', 'hospital admin', 'rekam medis', 'casemix', 'admisi rs'],
      strongEn: ['hospital admin', 'healthcare admin', 'clinic admin', 'medical records', 'patient administration'],
      secondaryIn: ['sep bpjs kesehatan', 'bridging simrs vclaim', 'rawat jalan dan rawat inap', 'berkas rujukan faskes', 'verifikasi klaim asuransi'],
      secondaryEn: ['electronic health records ehr', 'health insurance claims', 'inpatient outpatient admissions', 'medical referral tracking']
    },
    {
      key: 'legal_document_admin',
      code: 'LGL',
      basesIn: [
        'legal admin', 'admin hukum', 'paralegal', 'legal officer', 'document controller', 'doc controller',
        'perizinan usaha', 'kontrak kerja legal', 'staf legalitas', 'oss rba', 'lkpm admin'
      ],
      basesEn: [
        'legal admin', 'paralegal', 'legal assistant', 'document controller', 'contract administrator',
        'corporate legal officer', 'legal compliance clerk'
      ],
      strongIn: ['legal admin', 'paralegal', 'document controller', 'kontrak legal', 'perizinan oss', 'admin hukum'],
      strongEn: ['legal admin', 'paralegal', 'document controller', 'contract administrator', 'legal compliance'],
      secondaryIn: ['legal drafting perjanjian', 'oss rba dan lkpm bkpm', 'akta pendirian & perubahan kumham', 'arsip dokumen rahasia', 'pbg dan slf'],
      secondaryEn: ['contract drafting', 'statutory business permits', 'regulatory submissions', 'archival management', 'corporate resolutions']
    },
    {
      key: 'sales_administration',
      code: 'SAD',
      basesIn: [
        'sales admin', 'admin penjualan', 'admin sales', 'sales support', 'sales order admin', 'admin so',
        'faktur penjualan', 'quotation admin', 'commercial admin', 'surat penawaran'
      ],
      basesEn: [
        'sales admin', 'sales administrator', 'sales support', 'sales order processing', 'order management clerk',
        'commercial administration', 'quotation administrator'
      ],
      strongIn: ['sales admin', 'admin sales', 'admin penjualan', 'sales order', 'faktur penjualan', 'quotation'],
      strongEn: ['sales admin', 'sales administrator', 'sales support', 'sales order', 'order processing'],
      secondaryIn: ['surat penawaran harga sph', 'sales order so di sistem erp', 'monitoring lead time pengiriman', 'faktur penjualan dan tanda terima'],
      secondaryEn: ['sales quotations', 'sales order creation in erp', 'delivery tracking', 'customer invoicing verification']
    },
    {
      key: 'finance_billing_admin',
      code: 'FBA',
      basesIn: [
        'finance admin', 'admin keuangan', 'billing admin', 'admin invoice', 'admin kasir', 'admin penagihan',
        'invoicing officer', 'ar billing', 'kasir kantor', 'klaim keuangan', 'verifikasi tagihan'
      ],
      basesEn: [
        'finance admin', 'billing administrator', 'invoicing clerk', 'accounts clerk', 'cashier administrator',
        'collections administrator', 'billing officer'
      ],
      strongIn: ['finance admin', 'admin keuangan', 'billing admin', 'admin invoice', 'admin kasir', 'admin penagihan'],
      strongEn: ['finance admin', 'billing admin', 'invoicing clerk', 'billing officer', 'accounts clerk'],
      secondaryIn: ['reimbursement klaim', 'petty cash kas kecil', 'tukar faktur vendor', 'kwitansi dan bukti kas keluar', 'rekap piutang outstanding'],
      secondaryEn: ['petty cash reconciliation', 'vendor invoice verification', 'payment receipts', 'aging receivables tracking']
    },
    {
      key: 'hr_personnel_admin',
      code: 'HRA',
      basesIn: [
        'admin hr', 'admin hrd', 'admin personalia', 'personnel admin', 'administrasi kepegawaian',
        'admin absensi', 'admin data karyawan', 'staf arsip hrd', 'bpjs ketenagakerjaan admin'
      ],
      basesEn: [
        'hr admin', 'personnel administrator', 'hr clerk', 'attendance administrator', 'employee records administrator',
        'hr administrative assistant'
      ],
      strongIn: ['admin hr', 'admin hrd', 'admin personalia', 'personnel admin', 'administrasi kepegawaian', 'admin absensi'],
      strongEn: ['hr admin', 'personnel admin', 'hr clerk', 'attendance admin', 'employee records'],
      secondaryIn: ['rekap sidik jari fingerprint', 'pengarsipan berkas pkwt pkwtt', 'administrasi cuti karyawan', 'surat keterangan kerja paklaring'],
      secondaryEn: ['time and attendance logging', 'personnel file management', 'leave request tracking', 'certificate of employment issuance']
    },
    {
      key: 'project_administration',
      code: 'PRA',
      basesIn: [
        'project admin', 'admin proyek', 'site admin', 'administrasi proyek', 'project secretary',
        'sekretaris proyek', 'bast proyek admin', 'spk proyek', 'laporan harian proyek'
      ],
      basesEn: [
        'project admin', 'project administrator', 'site admin', 'project coordinator assistant', 'project documentation clerk',
        'site project secretary'
      ],
      strongIn: ['project admin', 'admin proyek', 'site admin', 'administrasi proyek', 'sekretaris proyek'],
      strongEn: ['project admin', 'project administrator', 'site admin', 'project documentation'],
      secondaryIn: ['surat perintah kerja spk', 'berita acara serah terima bast', 'rekap progress kurva s', 'laporan mingguan dan bulanan proyek'],
      secondaryEn: ['work order documentation', 'handover certificates bast', 's-curve tracking', 'weekly project progress logging']
    },
    {
      key: 'procurement_administration',
      code: 'PPA',
      basesIn: [
        'procurement admin', 'purchasing admin', 'admin purchasing', 'admin pengadaan', 'admin po',
        'admin pembelian', 'purchase order admin', 'admin supplier', 'admin vendor'
      ],
      basesEn: [
        'procurement admin', 'purchasing admin', 'purchase order clerk', 'buying administrator',
        'supplier documentation officer', 'procurement assistant'
      ],
      strongIn: ['purchasing admin', 'admin purchasing', 'procurement admin', 'admin pengadaan', 'admin po', 'admin pembelian'],
      strongEn: ['purchasing admin', 'procurement admin', 'purchase order clerk', 'buying administrator'],
      secondaryIn: ['purchase requisition pr to po', 'komparasi penawaran harga supplier', 'surat jalan supplier', 'arsip kontrak rekanan vendor'],
      secondaryEn: ['purchase requisition to po tracking', 'supplier price comparison table', 'delivery notes reconciliation', 'vendor records management']
    },
    {
      key: 'data_entry_admin',
      code: 'DEA',
      basesIn: [
        'data entry', 'input data', 'operator komputer', 'entri data', 'master data admin', 'verifikator data',
        'typing clerk', 'transcriptionist', 'data processing clerk'
      ],
      basesEn: [
        'data entry clerk', 'data entry operator', 'data input specialist', 'database entry clerk',
        'data verification officer', 'data processing assistant'
      ],
      strongIn: ['data entry', 'input data', 'entri data', 'master data', 'verifikator data', 'operator komputer'],
      strongEn: ['data entry', 'data entry clerk', 'data processing', 'data input', 'data verification'],
      secondaryIn: ['speed typing 75 wpm', 'kecepatan dan akurasi 100%', 'vlookup xlookup rumus excel', 'validasi formulir master data'],
      secondaryEn: ['high typing speed 70+ wpm', '100% data accuracy', 'advanced excel formula input', 'master data cleansing']
    },
    {
      key: 'warehouse_inventory_admin',
      code: 'WHA',
      basesIn: [
        'warehouse admin', 'admin gudang', 'admin pergudangan', 'admin stok', 'admin inventory',
        'surat jalan admin', 'checker gudang', 'stock controller admin', 'tally gudang'
      ],
      basesEn: [
        'warehouse admin', 'warehouse clerk', 'inventory administrator', 'stock admin', 'shipping & receiving clerk',
        'warehouse documentation specialist'
      ],
      strongIn: ['admin gudang', 'warehouse admin', 'admin inventory', 'admin stock', 'surat jalan', 'checker gudang'],
      strongEn: ['warehouse admin', 'inventory admin', 'stock clerk', 'warehouse clerk', 'shipping clerk'],
      secondaryIn: ['delivery order surat jalan', 'kartu stok bin card', 'input sistem erp wms', 'rekap stock opname', 'monitoring barang masuk keluar'],
      secondaryEn: ['delivery orders and bills of lading', 'bin card updating', 'wms system entry', 'stock count reconciliation', 'inbound outbound logging']
    }
  ],
  synonymsIn: {
    'administrasi': ['admin', 'tata usaha', 'kearsipan', 'clerk', 'office work', 'pembukuan', 'surat menyurat'],
    'sekretaris': ['secretary', 'executive assistant', 'ea', 'personal assistant', 'pa', 'asisten pribadi'],
    'data entry': ['input data', 'entri data', 'operator data', 'pemroses data', 'perekam data', 'pengetikan data'],
    'surat jalan': ['delivery order', 'do', 'manifest', 'surat pengantar', 'bukti serah terima barang'],
    'arsip': ['filling', 'filing dokumen', 'penataan berkas', 'arsiparis', 'dokumen kearsipan']
  },
  synonymsEn: {
    'administration': ['office administration', 'clerical', 'administrative support', 'recordkeeping', 'office coordination'],
    'secretary': ['executive assistant', 'personal assistant', 'ea', 'pa', 'administrative liaison'],
    'data entry': ['data transcription', 'data processing', 'record update', 'database input'],
    'delivery order': ['bill of lading', 'waybill', 'shipping document', 'dispatch note', 'proof of delivery']
  }
};
