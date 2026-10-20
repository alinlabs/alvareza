module.exports = [
  {
    key: 'business_development',
    code: 'BDV',
    exactPhrases: [
      'business development', 'business development manager', 'bdm', 'business development lead',
      'business development executive', 'bde', 'head of business development', 'b2b account manager',
      'key account executive', 'enterprise sales manager', 'commercial lead', 'staf business development',
      'spv business development', 'bizdev', 'manajer pengembangan bisnis', 'pengembangan bisnis',
      'corporate development manager', 'strategic business development', 'lead business development',
      'b2b growth manager', 'new business manager', 'commercial partnership manager',
      'business development associate', 'senior bdm', 'director of business development',
      'direktur business development', 'head of commercial', 'commercial manager'
    ],
    strongKeywords: [
      'business development', 'bdm', 'bizdev', 'b2b sales', 'pengembangan bisnis',
      'commercial lead', 'b2b account manager', 'enterprise sales', 'akuisisi korporat'
    ],
    secondaryKeywords: [
      'database b2b 4.000+', 'pitching solusi', 'kemitraan 100+ klien', 'kontrak komersial',
      'pipeline b2b', 'negosiasi enterprise', 'revenue expansion', 'prospek industri'
    ],
    negativeKeywords: [
      'kasir', 'waiter', 'security', 'cleaning', 'resepsionis', 'teller bank'
    ]
  },
  {
    key: 'sales_executive',
    code: 'SLS',
    exactPhrases: [
      'sales executive', 'b2b sales', 'account executive', 'ae', 'sales solution pitcher',
      'commercial sales lead', 'regional sales representative', 'direct sales lead',
      'sales manager', 'manajer penjualan', 'sales supervisor', 'spv sales', 'senior sales executive',
      'corporate sales executive', 'industrial sales representative', 'b2b sales consultant',
      'sales specialist', 'sales consultant', 'sales representative', 'staf penjualan korporat',
      'lead sales executive', 'sales officer b2b', 'enterprise account executive',
      'executive sales officer', 'field sales executive b2b', 'sales representative b2b'
    ],
    strongKeywords: [
      'sales executive', 'b2b sales', 'account executive', 'sales manager', 'sales solution pitcher',
      'commercial sales', 'penjualan korporat', 'sales representative'
    ],
    secondaryKeywords: [
      'regional solution pitcher', 'konica minolta', 'penetrasi 5.200 kontak', 'presentasi c-suite',
      'closing deal', 'kuota sales', 'prospecting b2b', 'mesin industri'
    ],
    negativeKeywords: [
      'admin arsip', 'tata usaha', 'cleaning', 'kasir ritel'
    ]
  },
  {
    key: 'key_account_manager',
    code: 'KAM',
    exactPhrases: [
      'key account manager', 'kam', 'senior account executive', 'corporate client partner',
      'enterprise relationship manager', 'strategic account specialist', 'head of key accounts',
      'lead key account manager', 'manajer akun utama', 'key account lead', 'strategic client partner',
      'corporate account lead', 'lead relationship manager b2b', 'key customer manager',
      'industrial account manager', 'major accounts manager', 'strategic account director'
    ],
    strongKeywords: [
      'key account manager', 'kam', 'enterprise relationship', 'strategic account',
      'corporate client partner', 'manajer akun utama', 'retensi korporat'
    ],
    secondaryKeywords: [
      '100+ akun korporat', 'kawasan cikarang & karawang', 'up-selling solusi', 'sla klien prioritas',
      'retensi akun', 'cross-selling b2b', 'kontrak tahunan'
    ],
    mustIncludeAny: [
      'key account', 'kam', 'strategic account', 'major accounts', 'enterprise relationship',
      'akun utama'
    ]
  },
  {
    key: 'partnership_government',
    code: 'GOV',
    exactPhrases: [
      'government relations', 'government relations specialist', 'institutional partnership lead',
      'external affairs manager', 'public policy liaison', 'strategic alliance manager',
      'manajer hubungan pemerintah', 'hubungan kelembagaan', 'spesialis kemitraan pemerintah',
      'head of government relations', 'public affairs manager', 'government liaison officer',
      'institutional relations specialist', 'mou & partnership specialist', 'corporate external relations'
    ],
    strongKeywords: [
      'government relations', 'hubungan pemerintah', 'institutional partnership', 'external affairs',
      'public policy liaison', 'diplomasi kelembagaan', 'hubungan instansi'
    ],
    secondaryKeywords: [
      'mou 100+ instansi', 'bumd', 'perguruan tinggi', 'advokasi kebijakan', 'presiden mahasiswa',
      'regulasi kementerian', 'protokoler kedinasan'
    ],
    mustIncludeAny: [
      'government', 'pemerintah', 'institutional', 'kelembagaan', 'public policy',
      'external affairs', 'instansi'
    ]
  },
  {
    key: 'client_success_manager',
    code: 'CSM',
    exactPhrases: [
      'client success manager', 'customer success lead', 'csm', 'account servicing specialist',
      'client relationship manager', 'post-sales implementation lead', 'customer success manager',
      'head of customer success', 'lead client success', 'customer experience manager b2b',
      'client onboarding and retention manager', 'client care lead b2b', 'customer satisfaction manager'
    ],
    strongKeywords: [
      'client success', 'customer success', 'csm', 'account servicing', 'client retention',
      'kepuasan klien korporat'
    ],
    secondaryKeywords: [
      'csat 98%', 'mencegah churn', 'feedback implementasi', 'onboarding klien',
      'health score akun', 'qbr quarterly business review'
    ],
    mustIncludeAny: [
      'client success', 'customer success', 'csm', 'account servicing'
    ]
  },
  {
    key: 'channel_distribution_sales',
    code: 'CSD',
    exactPhrases: [
      'channel sales manager', 'partner account manager', 'distribution channel specialist',
      'regional channel lead', 'reseller network manager', 'manajer penjualan jalur distribusi',
      'head of channel sales', 'partner development manager', 'distributor relationship manager',
      'wholesale channel manager', 'dealer sales manager', 'channel partner specialist'
    ],
    strongKeywords: [
      'channel sales', 'distribution partner', 'reseller network', 'jalur distribusi',
      'partner account manager', 'distributor manager', 'mitra principal'
    ],
    secondaryKeywords: [
      '10+ mitra principal', 'skema insentif reseller', 'pasokan gerai daerah', 'target grosir',
      'channel margin', 'afiliator ritel'
    ],
    mustIncludeAny: [
      'channel', 'distribusi', 'distribution', 'reseller', 'dealer', 'wholesale'
    ]
  },
  {
    key: 'enterprise_sales_lead',
    code: 'CSE',
    exactPhrases: [
      'enterprise sales lead', 'corporate solutions specialist', 'high-ticket b2b sales executive',
      'strategic solutions consultant', 'senior enterprise pitcher', 'head of enterprise sales',
      'director of enterprise sales', 'enterprise solutions executive', 'c-suite solutions pitcher',
      'industrial equipment sales lead', 'complex deal sales executive', 'lead enterprise sales'
    ],
    strongKeywords: [
      'enterprise sales', 'high-ticket sales', 'corporate solutions', 'c-suite pitcher',
      'penjualan enterprise', 'mesin industri konica minolta'
    ],
    secondaryKeywords: [
      'regional solution pitcher', 'presentasi direksi', 'negosiasi kontrak ratusan juta',
      'deal size besar', 'solusi teknologi kantor & industri'
    ],
    mustIncludeAny: [
      'enterprise sales', 'high-ticket', 'corporate solutions', 'enterprise pitcher'
    ]
  },
  {
    key: 'sales_operations_enablement',
    code: 'SOP',
    exactPhrases: [
      'sales operations', 'sales enablement', 'commercial operations analyst', 'crm sales administrator',
      'revenue operations', 'revops', 'revops associate', 'sales ops specialist', 'head of sales operations',
      'sales efficiency lead', 'sales performance analyst', 'sales enablement manager',
      'sales territory planner', 'lead sales operations', 'commercial ops specialist'
    ],
    strongKeywords: [
      'sales operations', 'sales ops', 'sales enablement', 'revenue operations', 'revops',
      'crm architecture', 'pipeline analytics'
    ],
    secondaryKeywords: [
      'crm nextmark', 'pemetaan wilayah industri cikarang karawang', 'analisis konversi deal',
      'sales collateral', 'sales playbook', 'win rate'
    ],
    mustIncludeAny: [
      'sales operations', 'sales ops', 'sales enablement', 'revops', 'revenue operations'
    ]
  },
  {
    key: 'tender_bid_specialist',
    code: 'TND',
    exactPhrases: [
      'tender specialist', 'bid specialist', 'proposal manager', 'tender officer', 'spesialis tender',
      'staf tender dan lelang', 'rfp rfq proposal specialist', 'tender & bidding specialist',
      'government tender officer', 'commercial bidding specialist', 'manajer tender',
      'staf administrasi lelang lpse', 'bidding coordinator', 'procurement tender specialist'
    ],
    strongKeywords: [
      'tender specialist', 'bid specialist', 'bidding', 'proposal komersial', 'lelang',
      'rfp', 'rfq', 'lpse', 'spesialis tender'
    ],
    secondaryKeywords: [
      'dokumen kualifikasi tender', 'kalkulasi biaya bidding', 'aanwijzing', 'jaminan penawaran',
      'bumn tender', 'syarat lelang pemerintah'
    ],
    mustIncludeAny: [
      'tender', 'bid', 'bidding', 'lelang', 'rfp', 'rfq', 'lpse'
    ]
  }
];
