import { PresetMatchingRule } from './types';

export const projectPmoRules: PresetMatchingRule[] = [
  {
    key: 'project_management',
    code: 'PMO',
    exactPhrases: [
      'project manager', 'manajer proyek', 'pmo', 'pmo lead', 'head of pmo',
      'pmo specialist', 'project operations manager', 'project coordinator', 'koordinator proyek', 'project officer',
      'project lead', 'delivery manager', 'program manager', 'manajer program', 'senior project manager',
      'assistant project manager', 'project supervisor', 'spv proyek', 'pmo manager', 'pmo coordinator',
      'implementation manager', 'project controller', 'lead project coordinator', 'technical project lead', 'project execution lead',
      'project delivery specialist', 'project governance lead', 'pmo analyst', 'project management officer', 'staf pmo'
    ],
    strongKeywords: [
      'project manager', 'manajer proyek', 'pmo', 'project lead', 'program manager',
      'delivery manager', 'project coordinator', 'project operations', 'manajemen proyek'
    ],
    secondaryKeywords: [
      '100+ proyek', 'sla 95%', 'timeline proyek', 'gantt chart', 'milestone',
      'alokasi sumber daya', 'manajemen risiko', 'stakeholder management', 'work breakdown structure'
    ],
    negativeKeywords: [
      'resepsionis', 'kasir', 'cleaning', 'security', 'operator mesin pabrik',
      'it project', 'software project', 'scrum master', 'event organizer', 'creative producer'
    ]
  },
  {
    key: 'it_project_manager',
    code: 'ITP',
    exactPhrases: [
      'it project manager', 'technical project manager', 'digital product delivery lead', 'software project manager', 'it delivery manager',
      'it project coordinator', 'software implementation manager', 'systems project manager', 'tech project manager', 'it pmo',
      'manajer proyek it', 'manajer proyek perangkat lunak', 'lead it project manager', 'web project manager', 'mobile app project manager',
      'scrum it manager', 'senior it project manager', 'it solutions project lead', 'it systems rollout lead', 'digital implementation manager',
      'erp it project lead', 'tech program manager'
    ],
    strongKeywords: [
      'it project manager', 'technical project manager', 'software project manager', 'it delivery manager', 'manajer proyek it',
      'tech project manager', 'software implementation'
    ],
    secondaryKeywords: [
      '50+ aplikasi web', 'erp logistor', 'crm nextmark', 'sprint backlog', 'uat testing',
      'sdlc', 'jira', 'trello', 'github', 'user acceptance test'
    ],
    mustIncludeAny: [
      'it', 'tech', 'software', 'perangkat lunak', 'digital systems',
      'technical project'
    ]
  },
  {
    key: 'event_program_manager',
    code: 'EVM',
    exactPhrases: [
      'event manager', 'manajer event', 'event project manager', 'event producer', 'produser acara',
      'conference coordinator', 'seminar coordinator', 'festival operations lead', 'creative event specialist', 'public program manager',
      'event organizer', 'eo lead', 'koordinator kepanitiaan', 'head of event', 'event operations manager',
      'event planner', 'event coordinator', 'manajer operasional acara', 'wedding organizer lead', 'mice specialist',
      'event staging coordinator', 'event budget manager', 'lead event producer'
    ],
    strongKeywords: [
      'event manager', 'event producer', 'event organizer', 'manajer acara', 'seminar',
      'festival', 'kepanitiaan', 'mice', 'event operations'
    ],
    secondaryKeywords: [
      '15+ seminar nasional', '100+ panitia', 'vendor panggung', 'protokoler', 'rundown acara',
      'venue booking', 'perizinan keramaian', 'anggaran acara'
    ],
    mustIncludeAny: [
      'event', 'acara', 'seminar', 'festival', 'eo',
      'mice', 'conference', 'kepanitiaan'
    ]
  },
  {
    key: 'nonprofit_program_lead',
    code: 'NGO',
    exactPhrases: [
      'nonprofit program manager', 'program officer yayasan', 'community development lead', 'ngo coordinator', 'social impact project manager',
      'manajer program nirlaba', 'program lead lsm', 'community empowerment specialist', 'grant project officer', 'advocacy program manager',
      'yayasan program coordinator', 'volunteer program manager', 'csr program specialist', 'community outreach manager', 'public advocacy lead',
      'head of community programs', 'social development officer', 'pengelola yayasan sosial'
    ],
    strongKeywords: [
      'nonprofit', 'nirlaba', 'yayasan', 'lsm', 'community development',
      'social impact', 'pengabdian masyarakat', 'csr program', 'advokasi publik'
    ],
    secondaryKeywords: [
      'relawan 300+ pemuda', 'dana hibah', 'proposal hibah', 'evaluasi dampak sosial', 'kemitraan nirlaba',
      'presiden mahasiswa', 'bantuan sosial'
    ],
    mustIncludeAny: [
      'nonprofit', 'nirlaba', 'yayasan', 'ngo', 'lsm',
      'community development', 'social impact', 'csr'
    ]
  },
  {
    key: 'agile_scrum_master',
    code: 'ASM',
    exactPhrases: [
      'scrum master', 'agile scrum master', 'technical delivery lead', 'agile coach', 'agile coach associate',
      'sprint facilitator', 'agile project coordinator', 'scrum facilitator', 'lead scrum master', 'senior scrum master',
      'agile project lead', 'agile process specialist', 'scrum delivery lead', 'scrum lead'
    ],
    strongKeywords: [
      'scrum master', 'agile scrum', 'agile coach', 'sprint facilitator', 'daily standup',
      'backlog grooming', 'retrospective'
    ],
    secondaryKeywords: [
      'saylor iacet mis', 'penghapusan blocker', 'velocity tim', 'scrum framework', 'kanban board',
      'user story estimation', 'agile transformation'
    ],
    mustIncludeAny: [
      'scrum', 'agile'
    ]
  },
  {
    key: 'product_operations',
    code: 'POM',
    exactPhrases: [
      'product operations', 'product operations manager', 'product ops', 'product ops specialist', 'system enablement lead',
      'digital product operations lead', 'user adoption specialist', 'product rollout manager', 'operations to product liaison', 'software adoption lead',
      'product process manager', 'feature enablement lead', 'head of product operations'
    ],
    strongKeywords: [
      'product operations', 'product ops', 'user adoption', 'feature rollout', 'system enablement',
      'software adoption'
    ],
    secondaryKeywords: [
      '50+ aplikasi web', 'feedback loop pengguna', 'metrik adopsi', 'change management software', 'panduan pengguna',
      'training end user'
    ],
    mustIncludeAny: [
      'product operations', 'product ops', 'user adoption', 'system enablement'
    ]
  },
  {
    key: 'implementation_manager',
    code: 'IPM',
    exactPhrases: [
      'implementation manager', 'manajer implementasi', 'solutions deployment lead', 'client onboarding specialist', 'technical implementation consultant',
      'systems rollout lead', 'b2b onboarding manager', 'software onboarding specialist', 'client solutions rollout manager', 'post-sales implementation lead',
      'senior implementation specialist', 'deployment coordinator'
    ],
    strongKeywords: [
      'implementation manager', 'solutions deployment', 'client onboarding', 'systems rollout', 'manajer implementasi',
      'kick-off go-live'
    ],
    secondaryKeywords: [
      'sla serah terima 95%', 'pelatihan user kunci', 'milestone kontrak', 'bast go-live', 'change management solusi',
      'penyelesaian kendala awal'
    ],
    mustIncludeAny: [
      'implementation', 'implementasi', 'onboarding', 'rollout', 'deployment'
    ]
  },
  {
    key: 'creative_project_manager',
    code: 'CPM',
    exactPhrases: [
      'creative project manager', 'creative producer', 'media production lead', 'content project manager', 'creative operations specialist',
      'video production manager', 'manajer proyek kreatif', 'produser konten video', 'manajer produksi media', 'head of creative production',
      'creative traffic manager', 'creative agency project manager'
    ],
    strongKeywords: [
      'creative project manager', 'creative producer', 'media production', 'content project', 'video production',
      'manajer kreatif', 'traffic manager'
    ],
    secondaryKeywords: [
      '60+ aset video promosi', 'timeline shooting', 'koordinasi talenta', 'desainer grafis', 'grand opening gerai',
      'jadwal rilis media'
    ],
    mustIncludeAny: [
      'creative project', 'creative producer', 'media production', 'content project', 'video production',
      'proyek kreatif'
    ]
  },
];
