import { PresetMatchingRule } from './types';

export const marketingCxRules: PresetMatchingRule[] = [
  {
    key: 'marketing',
    code: 'MKT',
    exactPhrases: [
      'marketing manager', 'manajer pemasaran', 'marketing supervisor', 'spv marketing', 'marketing lead',
      'head of marketing', 'kepala pemasaran', 'marketing officer', 'staf marketing', 'marketing specialist',
      'digital marketing manager', 'marketing coordinator', 'commercial marketing lead', 'lead marketer', 'marketing executive',
      'senior marketing executive', 'marketing director', 'direktur marketing', 'marketing communication', 'b2b marketing specialist',
      'retail marketing lead', 'trade marketing manager', 'field marketing coordinator', 'marketing associate', 'asst marketing manager',
      'staf promosi & pemasaran'
    ],
    strongKeywords: [
      'marketing manager', 'manajer pemasaran', 'marketing supervisor', 'head of marketing', 'digital marketing',
      'marketing lead', 'pemasaran produk', 'strategi pemasaran'
    ],
    secondaryKeywords: [
      'kampanye multi cabang', 'roas', 'lead generation', 'brand awareness', 'promosi ritel',
      'anggaran pemasaran', 'akuisisi pelanggan', 'b2b & b2c marketing'
    ],
    negativeKeywords: [
      'resepsionis', 'kasir', 'cleaning', 'security', 'warehouse gudang'
    ]
  },
  {
    key: 'public_relations',
    code: 'PRS',
    exactPhrases: [
      'public relations', 'pr', 'pr manager', 'manajer pr', 'pr specialist',
      'spesialis pr', 'public relations officer', 'pro', 'humas', 'hubungan masyarakat',
      'kepala humas', 'staf humas', 'corporate communications', 'corpcomm', 'manajer humas',
      'head of pr', 'media relations specialist', 'spesialis hubungan media', 'spokesperson', 'press officer',
      'corporate affairs specialist', 'lead public relations', 'external communications officer', 'pr and communication lead', 'staf protokoler dan humas',
      'media communications manager'
    ],
    strongKeywords: [
      'public relations', 'pr manager', 'humas', 'hubungan masyarakat', 'corporate communications',
      'corpcomm', 'media relations', 'hubungan media', 'press release'
    ],
    secondaryKeywords: [
      'konferensi pers', 'wartawan & jurnalis', 'krisis komunikasi', 'citra positif korporat', 'siaran pers',
      'hubungan pemangku kepentingan', 'liputan media'
    ],
    mustIncludeAny: [
      'public relations', 'pr', 'humas', 'hubungan masyarakat', 'corpcomm',
      'corporate communications', 'media relations'
    ]
  },
  {
    key: 'customer_service_operations',
    code: 'CSO',
    exactPhrases: [
      'customer service', 'cs', 'customer care', 'customer experience', 'cx',
      'cs supervisor', 'spv cs', 'customer service manager', 'manajer cs', 'head of customer service',
      'cs lead', 'call center supervisor', 'contact center manager', 'customer support specialist', 'layanan pelanggan',
      'pelayanan pelanggan', 'kepala layanan pelanggan', 'lead customer care', 'helpdesk supervisor', 'client servicing officer',
      'customer retention specialist', 'cx specialist', 'customer service team lead', 'senior customer service officer', 'staf customer support',
      'customer care executive'
    ],
    strongKeywords: [
      'customer service', 'customer care', 'customer experience', 'cx', 'cs supervisor',
      'layanan pelanggan', 'pelayanan pelanggan', 'call center', 'csat'
    ],
    secondaryKeywords: [
      'csat 98%', 'sla respon pelanggan', 'penanganan komplain', 'helpdesk ticketing', 'kepuasan pelanggan',
      'nps net promoter score', 'first contact resolution'
    ],
    mustIncludeAny: [
      'customer service', 'customer care', 'customer support', 'layanan pelanggan', 'pelayanan pelanggan',
      'customer experience', 'call center', 'contact center', 'helpdesk'
    ]
  },
  {
    key: 'marcom_branding',
    code: 'MCB',
    exactPhrases: [
      'marketing communication', 'marcom', 'marcomm', 'marcom manager', 'manajer marcom',
      'marcom supervisor', 'spv marcom', 'marcom specialist', 'spesialis marcom', 'head of marcom',
      'brand communications lead', 'marcom coordinator', 'integrated marketing communication', 'imc specialist', 'marcomm officer',
      'staf marcom', 'lead marcom', 'marcom executive', 'marketing communications specialist', 'senior marcomm officer'
    ],
    strongKeywords: [
      'marketing communication', 'marcom', 'marcomm', 'marcom manager', 'brand communications',
      'integrated marketing communication', 'komunikasi pemasaran'
    ],
    secondaryKeywords: [
      'kampanye terpadu', 'branding collateral', 'event activation marcom', 'pesan merek', 'media placement',
      'promosi terintegrasi'
    ],
    mustIncludeAny: [
      'marcom', 'marcomm', 'marketing communication', 'marketing communications'
    ]
  },
  {
    key: 'performance_marketing_ads',
    code: 'PMA',
    exactPhrases: [
      'performance marketing', 'performance marketing manager', 'performance marketer', 'paid ads specialist', 'spesialis iklan berbayar',
      'meta ads specialist', 'google ads specialist', 'media buyer', 'senior media buyer', 'head of performance marketing',
      'digital advertising specialist', 'sem specialist', 'ppc specialist', 'paid traffic specialist', 'lead performance marketer',
      'staf iklan meta & google', 'performance marketing lead', 'digital ads manager'
    ],
    strongKeywords: [
      'performance marketing', 'media buyer', 'paid ads', 'meta ads', 'google ads',
      'sem', 'ppc', 'iklan digital', 'roas optimizer'
    ],
    secondaryKeywords: [
      'google ads certification', 'roas positif', 'cpc cpm ctr', 'skaling budget iklan', 'a/b testing ad creative',
      'konversi landing page', 'retargeting pixel'
    ],
    mustIncludeAny: [
      'performance marketing', 'media buyer', 'paid ads', 'meta ads', 'google ads',
      'sem', 'ppc', 'ads specialist'
    ]
  },
  {
    key: 'ecommerce_marketplace_ops',
    code: 'ECO',
    exactPhrases: [
      'ecommerce manager', 'marketplace specialist', 'ecommerce specialist', 'marketplace supervisor', 'spv marketplace',
      'head of ecommerce', 'admin marketplace', 'ecommerce operations', 'shopee tokopedia specialist', 'marketplace lead',
      'ecommerce lead', 'manajer ecommerce', 'staf operasional marketplace', 'toko online specialist', 'marketplace account manager',
      'ecommerce store manager', 'staf upload produk marketplace', 'lead ecommerce specialist'
    ],
    strongKeywords: [
      'ecommerce', 'marketplace', 'shopee', 'tokopedia', 'lazada',
      'tiktok shop', 'ecommerce operations', 'manajer marketplace'
    ],
    secondaryKeywords: [
      'optimasi katalog online', 'live streaming sales', 'kampanye tanggal kembar', 'chat response rate', 'manajemen pesanan toko daring',
      'marketplace ads', 'voucher diskon marketplace'
    ],
    mustIncludeAny: [
      'ecommerce', 'e-commerce', 'marketplace', 'shopee', 'tokopedia',
      'tiktok shop'
    ]
  },
  {
    key: 'social_media_content_lead',
    code: 'SMM',
    exactPhrases: [
      'social media specialist', 'social media manager', 'manajer media sosial', 'spesialis medsos', 'social media officer',
      'content creator lead', 'head of social media', 'social media strategist', 'social media lead', 'staf media sosial',
      'content specialist', 'social media coordinator', 'admin media sosial', 'admin instagram tiktok', 'social media executive',
      'senior social media specialist', 'lead content creator', 'social media producer', 'digital content manager'
    ],
    strongKeywords: [
      'social media specialist', 'social media manager', 'medsos', 'media sosial', 'content creator',
      'social media strategist', 'instagram tiktok specialist'
    ],
    secondaryKeywords: [
      '60+ konten video', 'engagement rate', 'kalender editorial konten', 'viral reach', 'reels & tiktok',
      'copywriting konten', 'story telling merek'
    ],
    mustIncludeAny: [
      'social media', 'media sosial', 'medsos', 'content creator', 'social media strategist'
    ]
  },
  {
    key: 'growth_marketing_lead',
    code: 'GRM',
    exactPhrases: [
      'growth marketing', 'growth marketer', 'growth manager', 'growth lead', 'head of growth',
      'growth hacker', 'growth hacking specialist', 'user acquisition lead', 'growth strategist', 'director of growth',
      'product growth lead', 'customer acquisition manager', 'lead growth marketer', 'senior growth marketing specialist'
    ],
    strongKeywords: [
      'growth marketing', 'growth marketer', 'growth lead', 'growth hacker', 'head of growth',
      'user acquisition', 'akuisisi pengguna'
    ],
    secondaryKeywords: [
      'funnel konversi', 'retention cohort', 'viral loops', 'eksperimen pertumbuhan cepat', 'cac ltv ratio',
      'skalabilitas pengguna baru'
    ],
    mustIncludeAny: [
      'growth marketing', 'growth marketer', 'growth lead', 'growth hacker', 'head of growth'
    ]
  },
  {
    key: 'brand_manager_creative',
    code: 'BRM',
    exactPhrases: [
      'brand manager', 'manajer brand', 'brand specialist', 'spesialis brand', 'head of brand',
      'brand lead', 'creative brand manager', 'brand marketing manager', 'senior brand manager', 'brand strategist',
      'brand custodian', 'brand identity manager', 'lead brand strategist', 'director of brand', 'asst brand manager',
      'staf pengembangan merek'
    ],
    strongKeywords: [
      'brand manager', 'manajer brand', 'brand strategist', 'head of brand', 'brand equity',
      'identitas merek', 'brand custodian'
    ],
    secondaryKeywords: [
      'positioning merek', 'brand guidelines', 'rebranding', 'diferensiasi pasar', 'brand perception survey',
      'arsitektur portofolio merek'
    ],
    mustIncludeAny: [
      'brand manager', 'brand strategist', 'manajer brand', 'brand custodian', 'head of brand'
    ]
  },
];
