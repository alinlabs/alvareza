import { PresetMatchingRule } from './types';

export const hrTalentRules: PresetMatchingRule[] = [
  {
    key: 'hr_operations',
    code: 'HRS',
    exactPhrases: [
      'hr operations', 'hr operations manager', 'people operations manager', 'hr operations lead', 'head of hr operations',
      'hr operations specialist', 'people operations lead', 'manajer operasional hrd', 'manajer operasional sdm', 'spv hr operations',
      'hr service delivery manager', 'hr shared services lead', 'hr operations supervisor', 'lead people operations', 'people ops manager',
      'staf operasional hrd', 'senior hr operations specialist', 'human resources operations lead', 'head of people operations', 'hr operations officer'
    ],
    strongKeywords: [
      'hr operations', 'people operations', 'hr service delivery', 'shared services hr', 'operasional hrd',
      'people ops', 'tata kelola sdm'
    ],
    secondaryKeywords: [
      'sop hrd', 'employee life cycle', 'efisiensi administrasi sdm', 'onboarding offboarding', 'sla layanan sdm',
      'sistem absensi & cuti', 'tata tertib karyawan'
    ],
    negativeKeywords: [
      'kasir', 'sales counter', 'cleaning', 'security', 'waiter'
    ]
  },
  {
    key: 'hrga_generalist',
    code: 'HRG',
    exactPhrases: [
      'hrga', 'hr & ga', 'hr ga', 'hrga manager', 'manajer hrga',
      'hrga supervisor', 'spv hrga', 'hrga specialist', 'hrga staff', 'staf hrga',
      'hr & ga supervisor', 'hr & ga manager', 'hr & ga staff', 'human resources & general affairs', 'hr general affairs',
      'hrd ga', 'hrd & ga', 'hrd dan ga', 'kepala hrga', 'lead hrga',
      'hrga coordinator', 'staf hrd ga', 'hrga officer', 'senior hrga specialist', 'human resources and general affairs manager',
      'koordinator hrga', 'officer hr ga', 'hr & general affairs specialist'
    ],
    strongKeywords: [
      'hrga', 'hr ga', 'hr & ga', 'hr general affairs', 'hrd ga',
      'manajer hrga', 'spv hrga', 'staf hrga', 'human resources & general affairs'
    ],
    secondaryKeywords: [
      'fasilitas kantor', 'kepegawaian dan umum', 'perizinan kantor', 'aset kantor', 'absensi & rumah tangga kantor',
      'bpjs & legalitas kantor'
    ],
    mustIncludeAny: [
      'hrga', 'hr ga', 'hr & ga', 'hrd ga', 'hrd & ga'
    ]
  },
  {
    key: 'talent_acquisition',
    code: 'REC',
    exactPhrases: [
      'recruiter', 'recruitment', 'talent acquisition', 'ta specialist', 'recruitment specialist',
      'talent acquisition specialist', 'head of talent acquisition', 'recruitment manager', 'manajer rekrutmen', 'staf rekrutmen',
      'recruitment supervisor', 'spv recruitment', 'talent sourcer', 'lead recruiter', 'technical recruiter',
      'talent acquisition partner', 'spesialis rekrutmen', 'corporate recruiter', 'head of recruitment', 'talent partner',
      'talent acquisition lead', 'staf talent acquisition', 'senior recruiter', 'executive search consultant', 'hiring specialist',
      'recruitment and selection officer', 'talent attraction specialist'
    ],
    strongKeywords: [
      'recruiter', 'recruitment', 'talent acquisition', 'rekrutmen', 'talent sourcer',
      'hiring specialist', 'manajer rekrutmen', 'seleksi karyawan'
    ],
    secondaryKeywords: [
      'interview bebi / star', 'psikotes', 'sourcing kandidat', 'job portal glints jobstreet linkedin', 'ats applicant tracking system',
      'time to hire', 'penawaran kerja offering letter'
    ],
    mustIncludeAny: [
      'recruiter', 'recruitment', 'talent acquisition', 'rekrutmen', 'hiring',
      'sourcer'
    ]
  },
  {
    key: 'training_learning_dev',
    code: 'LND',
    exactPhrases: [
      'learning and development', 'l&d', 'lnd', 'training specialist', 'training manager',
      'manajer pelatihan', 'learning development manager', 'training & development', 'staf pelatihan', 'head of l&d',
      'corporate trainer', 'pelatih korporat', 'learning specialist', 'training supervisor', 'spv training',
      'instructional designer', 'people development specialist', 'training need analysis specialist', 'lead l&d specialist', 'learning experience designer',
      'spesialis pelatihan sdm', 'corporate learning lead'
    ],
    strongKeywords: [
      'learning and development', 'l&d', 'training manager', 'pelatihan sdm', 'corporate trainer',
      'people development', 'tna'
    ],
    secondaryKeywords: [
      'training need analysis', 'modul pelatihan', 'kirkpatrick level', 'evaluasi pelatihan', 'kompetensi karyawan',
      'on the job training', 'sertifikasi profesi'
    ],
    mustIncludeAny: [
      'learning', 'training', 'pelatihan', 'l&d', 'lnd'
    ]
  },
  {
    key: 'organizational_development',
    code: 'ODD',
    exactPhrases: [
      'organizational development', 'od', 'od specialist', 'od manager', 'manajer od',
      'organizational effectiveness', 'organization development lead', 'head of od', 'spesialis pengembangan organisasi', 'culture & engagement manager',
      'change management lead', 'job analysis specialist', 'grading and job leveling specialist', 'lead od specialist', 'organization design manager',
      'people and culture development lead'
    ],
    strongKeywords: [
      'organizational development', 'od manager', 'od specialist', 'pengembangan organisasi', 'job leveling',
      'analisis beban kerja'
    ],
    secondaryKeywords: [
      'kamus kompetensi', 'evaluasi jabatan', 'struktur organisasi', 'budaya kerja', 'change management',
      'employee engagement survey', 'grading struktur'
    ],
    mustIncludeAny: [
      'organizational development', 'od specialist', 'od manager', 'pengembangan organisasi', 'organization development'
    ]
  },
  {
    key: 'hr_business_partner',
    code: 'HBP',
    exactPhrases: [
      'hr business partner', 'hrbp', 'human resources business partner', 'senior hrbp', 'lead hrbp',
      'head of hrbp', 'strategic hr partner', 'people partner', 'hrbp manager', 'manajer hrbp',
      'corporate hrbp', 'commercial hrbp', 'operational hrbp', 'business unit hr partner', 'senior human resources business partner'
    ],
    strongKeywords: [
      'hrbp', 'hr business partner', 'human resources business partner', 'people partner', 'mitra bisnis sdm'
    ],
    secondaryKeywords: [
      'keselarasan strategi bisnis', 'workforce planning', 'penanganan eskalasi sdm unit bisnis', 'manajemen suksesi', 'retensi talenta kunci'
    ],
    mustIncludeAny: [
      'hrbp', 'hr business partner', 'human resources business partner', 'people partner'
    ]
  },
  {
    key: 'compensation_benefits_payroll',
    code: 'CNB',
    exactPhrases: [
      'compensation and benefits', 'c&b', 'cnb', 'payroll specialist', 'spesialis penggajian',
      'payroll manager', 'manajer payroll', 'compensation manager', 'total rewards specialist', 'c&b specialist',
      'staf payroll', 'payroll officer', 'spv payroll', 'c&b supervisor', 'remunerasi sdm',
      'payroll and tax officer', 'staf gaji bpjs pph21', 'head of c&b', 'lead payroll specialist', 'remuneration specialist'
    ],
    strongKeywords: [
      'compensation and benefits', 'c&b', 'cnb', 'payroll', 'penggajian',
      'remunerasi', 'total rewards', 'manajer payroll'
    ],
    secondaryKeywords: [
      'bpjs ketenagakerjaan', 'bpjs kesehatan', 'pph pasal 21', 'salary structure', 'tunjangan karyawan',
      'lembur & pesangon', 'slip gaji'
    ],
    mustIncludeAny: [
      'payroll', 'compensation', 'c&b', 'cnb', 'penggajian',
      'remunerasi', 'total rewards'
    ]
  },
  {
    key: 'industrial_relations_compliance',
    code: 'IRL',
    exactPhrases: [
      'industrial relations', 'ir', 'hubungan industrial', 'ir specialist', 'ir manager',
      'manajer hubungan industrial', 'labor relations specialist', 'spesialis hubungan industrial', 'head of industrial relations', 'staf hubungan industrial',
      'ir compliance officer', 'staf perselisihan kerja', 'mediator hubungan industrial', 'lead industrial relations', 'labor law compliance specialist',
      'staf pkwt dan pkb'
    ],
    strongKeywords: [
      'industrial relations', 'hubungan industrial', 'ir manager', 'labor relations', 'perselisihan hubungan industrial',
      'hukum ketenagakerjaan'
    ],
    secondaryKeywords: [
      'uu cipta kerja', 'uu 13/2003', 'peraturan perusahaan pp', 'perjanjian kerja bersama pkb', 'tripartit biparitit',
      'spk disnaker', 'mediasi ketenagakerjaan'
    ],
    mustIncludeAny: [
      'industrial relations', 'hubungan industrial', 'labor relations', 'disnaker'
    ]
  },
  {
    key: 'people_analytics_hris',
    code: 'PAS',
    exactPhrases: [
      'people analytics', 'hris specialist', 'hris manager', 'manajer hris', 'hr data analyst',
      'hris administrator', 'workforce analytics specialist', 'people data specialist', 'head of people analytics', 'hr system specialist',
      'talenty admin', 'analis data sdm', 'lead people analytics', 'hris implementation lead', 'human resources analyst'
    ],
    strongKeywords: [
      'people analytics', 'hris', 'hr data analyst', 'workforce analytics', 'analis data sdm',
      'hris specialist', 'sistem informasi sdm'
    ],
    secondaryKeywords: [
      'platform talenty', 'hr matrix', 'turnover rate', 'absenteeism rate', 'dashboard sdm',
      'headcount modeling', 'laporan data karyawan'
    ],
    mustIncludeAny: [
      'people analytics', 'hris', 'hr data analyst', 'workforce analytics'
    ]
  },
  {
    key: 'employer_branding_campus',
    code: 'EBC',
    exactPhrases: [
      'employer branding', 'employer branding specialist', 'campus recruitment lead', 'campus hiring specialist', 'university relations lead',
      'employer branding manager', 'talent attraction lead', 'head of employer branding', 'spesialis citra perusahaan', 'campus relations officer',
      'early careers lead', 'management trainee recruiter', 'lead employer branding specialist'
    ],
    strongKeywords: [
      'employer branding', 'campus recruitment', 'campus hiring', 'university relations', 'talent attraction',
      'citra perusahaan'
    ],
    secondaryKeywords: [
      'job fair kampus', 'program magang mbkm', 'bursa kerja', 'kemitraan kampus', 'kampanye linkedin employer',
      'keterlibatan alumni'
    ],
    mustIncludeAny: [
      'employer branding', 'campus recruitment', 'campus hiring', 'university relations'
    ]
  },
];
