import { DomainMetadata } from './domain-definitions';

export const salesDomain: DomainMetadata = {
  domain: 'sales',
  nameIn: 'Penjualan & Pengembangan Bisnis (B2B)',
  nameEn: 'Sales & Business Development (B2B)',
  roles: [
    {
      key: 'business_development',
      code: 'BDV',
      basesIn: [
        'business development', 'bizdev', 'bd', 'bdv', 'pengembangan bisnis', 'business partnership',
        'kemitraan bisnis', 'growth business', 'strategi kemitraan', 'corporate alliance', 'spesialis ekspansi bisnis'
      ],
      basesEn: [
        'business development', 'bizdev', 'bd', 'business development manager', 'head of business development',
        'strategic partnerships manager', 'growth partnerships lead', 'alliance manager'
      ],
      strongIn: ['business development', 'bizdev', 'bd', 'pengembangan bisnis', 'kemitraan bisnis', 'strategic partnership'],
      strongEn: ['business development', 'bizdev', 'head of business development', 'strategic partnerships', 'alliances'],
      secondaryIn: ['b2b deal closing', 'mou & pks kemitraan', 'market penetration', 'revenue generation', 'ekspansi pasar baru'],
      secondaryEn: ['b2b deal closing', 'contract negotiation', 'market penetration', 'revenue expansion', 'strategic networking']
    },
    {
      key: 'b2b_corporate_sales',
      code: 'SLS',
      basesIn: [
        'b2b sales', 'sales executive', 'account executive', 'ae', 'sales officer', 'penjualan b2b',
        'tenaga penjualan', 'sales representative', 'direct sales', 'corporate sales', 'sales consultant'
      ],
      basesEn: [
        'b2b sales', 'account executive', 'sales executive', 'sales representative', 'corporate sales officer',
        'direct sales specialist', 'commercial sales executive'
      ],
      strongIn: ['b2b sales', 'sales executive', 'account executive', 'ae', 'penjualan b2b', 'corporate sales'],
      strongEn: ['b2b sales', 'account executive', 'sales executive', 'corporate sales', 'direct sales'],
      secondaryIn: ['sales quota target', 'canvassing & prospecting', 'cold calling & email pitch', 'presentasi produk', 'crm pipeline closing'],
      secondaryEn: ['sales quotas', 'lead prospecting', 'cold outreach', 'sales presentations', 'pipeline management']
    },
    {
      key: 'key_account_management',
      code: 'KAM',
      basesIn: [
        'key account manager', 'kam', 'strategic account manager', 'manajer akun utama', 'key account executive',
        'pengelola klien strategis', 'major account', 'national account manager'
      ],
      basesEn: [
        'key account manager', 'kam', 'strategic account manager', 'national account manager', 'global account manager',
        'key account executive', 'major accounts director'
      ],
      strongIn: ['key account manager', 'kam', 'strategic account', 'akun utama', 'klien strategis'],
      strongEn: ['key account manager', 'kam', 'strategic account manager', 'major accounts'],
      secondaryIn: ['retensi akun kunci', 'cross selling & up selling', 'kontrak tahunan korporasi', 'qbr quarterly business review'],
      secondaryEn: ['account retention', 'cross selling and upselling', 'annual commercial contracts', 'quarterly business reviews qbr']
    },
    {
      key: 'government_institutional_relations',
      code: 'GOV',
      basesIn: [
        'government relations', 'hubungan pemerintah', 'institutional relations', 'kemitraan bumn',
        'hubungan instansi', 'kerjasama pemerintah', 'govrel', 'public policy liaison'
      ],
      basesEn: [
        'government relations', 'institutional relations', 'public sector partnerships', 'govrel specialist',
        'government affairs manager', 'b2g sales lead'
      ],
      strongIn: ['government relations', 'hubungan pemerintah', 'govrel', 'b2g', 'kemitraan bumn', 'hubungan instansi'],
      strongEn: ['government relations', 'institutional relations', 'govrel', 'b2g sales', 'public sector relations'],
      secondaryIn: ['mou kementerian bumn dinas', 'kepatuhan regulasi pemerintah', 'audiensi pejabat publik', 'pengadaan b2g pemerintah'],
      secondaryEn: ['ministry and agency mou', 'regulatory compliance', 'public policy briefings', 'b2g procurement']
    },
    {
      key: 'client_success_retention',
      code: 'CSM',
      basesIn: [
        'customer success', 'client success', 'csm', 'retensi klien', 'customer retention',
        'client satisfaction', 'account servicing', 'client manager'
      ],
      basesEn: [
        'customer success manager', 'client success manager', 'csm', 'client retention specialist',
        'customer onboarding specialist', 'head of customer success'
      ],
      strongIn: ['customer success', 'client success', 'csm', 'retensi klien', 'churn reduction'],
      strongEn: ['customer success', 'client success', 'csm', 'client retention', 'churn reduction'],
      secondaryIn: ['nps net promoter score', 'csat 95%', 'churn rate prevention', 'klien onboarding & training', 'health score account'],
      secondaryEn: ['net promoter score nps', 'csat customer satisfaction', 'churn mitigation', 'client onboarding', 'account health score']
    },
    {
      key: 'channel_distribution_sales',
      code: 'CSD',
      basesIn: [
        'channel sales', 'partner manager', 'distribusi penjualan', 'reseller network', 'agen dan distributor',
        'channel partnership', 'distributor manager', 'mitra distribusi'
      ],
      basesEn: [
        'channel sales manager', 'distribution manager', 'partner account manager', 'reseller channel lead',
        'indirect sales manager', 'channel development specialist'
      ],
      strongIn: ['channel sales', 'distributor', 'reseller network', 'mitra distribusi', 'partner manager'],
      strongEn: ['channel sales', 'distribution manager', 'partner account manager', 'reseller network'],
      secondaryIn: ['perjanjian distribusi keagenan', 'skema komisi mitra reseller', 'monitoring sell-in & sell-out', 'ekspansi jaringan toko mitra'],
      secondaryEn: ['distributor agreements', 'reseller commission structure', 'sell-in sell-out tracking', 'dealer network expansion']
    },
    {
      key: 'enterprise_strategic_sales',
      code: 'CSE',
      basesIn: [
        'enterprise sales', 'high ticket sales', 'corporate enterprise sales', 'penjualan korporasi besar',
        'strategic sales', 'enterprise commercial', 'large enterprise sales'
      ],
      basesEn: [
        'enterprise sales executive', 'strategic sales director', 'enterprise account executive',
        'high ticket sales specialist', 'head of enterprise sales'
      ],
      strongIn: ['enterprise sales', 'penjualan korporasi', 'high ticket sales', 'strategic sales'],
      strongEn: ['enterprise sales', 'strategic sales', 'enterprise account executive', 'large enterprise accounts'],
      secondaryIn: ['closing kontrak miliaran', 'konsorsium & solusi kustom enterprise', 'siklus penjualan panjang long sales cycle'],
      secondaryEn: ['multi million deal closing', 'complex solutions sales', 'long enterprise sales cycles', 'c-suite executive pitching']
    },
    {
      key: 'sales_operations_enablement',
      code: 'SOP',
      basesIn: [
        'sales operations', 'sales ops', 'sales enablement', 'crm sales', 'pipeline sales',
        'operasional penjualan', 'sales support manager', 'sales analytics'
      ],
      basesEn: [
        'sales operations', 'sales ops', 'sales enablement manager', 'crm administrator',
        'sales productivity lead', 'commercial operations lead'
      ],
      strongIn: ['sales operations', 'sales ops', 'sales enablement', 'crm sales', 'sales pipeline'],
      strongEn: ['sales operations', 'sales ops', 'sales enablement', 'crm pipeline', 'sales analytics'],
      secondaryIn: ['hubspot salesforce crm', 'sales commission modeling', 'analisis win-loss deal', 'sales playbook training'],
      secondaryEn: ['salesforce hubspot crm', 'sales compensation design', 'win loss deal analysis', 'sales collateral enablement']
    },
    {
      key: 'tender_bid_commercial_proposal',
      code: 'TND',
      basesIn: [
        'tender', 'bid manager', 'tender specialist', 'bidding proposal', 'rfp rfq',
        'lelang tender', 'proposal komersial', 'tender lpse', 'dokumen lelang'
      ],
      basesEn: [
        'tender specialist', 'bid manager', 'proposal manager', 'rfp specialist',
        'commercial bidding lead', 'tender coordinator'
      ],
      strongIn: ['tender', 'bid manager', 'proposal komersial', 'rfp', 'rfq', 'lelang tender', 'lpse'],
      strongEn: ['tender specialist', 'bid manager', 'proposal manager', 'rfp', 'rfq', 'bidding manager'],
      secondaryIn: ['dokumen kualifikasi tender', 'penyusunan rab penawaran', 'pendaftaran lpse e-katalog', 'jaminan penawaran bank garansi'],
      secondaryEn: ['tender compliance matrix', 'commercial pricing sheet', 'rfp submission on time', 'bid bond requirements']
    }
  ],
  synonymsIn: {
    'penjualan': ['sales', 'commercial', 'selling', 'niaga', 'transaksi penjualan', 'tenaga penjual'],
    'kemitraan': ['partnership', 'partner', 'aliansi bisnis', 'kerjasama', 'rekanan bisnis', 'kolaborasi usaha'],
    'prospek': ['lead', 'calon klien', 'potensial customer', 'pipeline', 'opportunity', 'sasaran pasar'],
    'negosiasi': ['bargaining', 'closing deal', 'kesepakatan', 'tawar menawar harga', 'kontrak kerjasama']
  },
  synonymsEn: {
    'sales': ['commercial operations', 'business development', 'revenue generation', 'selling', 'client acquisition'],
    'partnership': ['strategic alliance', 'joint venture', 'business collaboration', 'channel partner'],
    'leads': ['prospects', 'sales pipeline', 'business opportunities', 'deal flow', 'potential clients']
  }
};

export const marketingDomain: DomainMetadata = {
  domain: 'marketing',
  nameIn: 'Pemasaran, Digital & Layanan Pelanggan',
  nameEn: 'Marketing, Digital & Customer Experience',
  roles: [
    {
      key: 'marketing_management',
      code: 'MKT',
      basesIn: [
        'marketing', 'pemasaran', 'digital marketing', 'marketer', 'marketing lead',
        'manajer pemasaran', 'spesialis pemasaran', 'marketing operations', 'integrated marketing'
      ],
      basesEn: [
        'marketing manager', 'head of marketing', 'marketing lead', 'integrated marketing specialist',
        'commercial marketing lead', 'marketing director'
      ],
      strongIn: ['marketing', 'pemasaran', 'digital marketing', 'manajer pemasaran', 'marketing lead'],
      strongEn: ['marketing manager', 'head of marketing', 'digital marketing', 'marketing director'],
      secondaryIn: ['strategi kampanye 360', 'anggaran pemasaran marketing budget', 'roi pemasaran', 'riset pasar market research'],
      secondaryEn: ['360 campaign strategy', 'marketing roi', 'market research and segmentation', 'go to market strategy']
    },
    {
      key: 'public_relations_corporate_comms',
      code: 'PRS',
      basesIn: [
        'public relations', 'pr', 'humas', 'hubungan masyarakat', 'corporate communications',
        'corcom', 'media relations', 'press release', 'juru bicara', 'kehumasan'
      ],
      basesEn: [
        'public relations', 'pr manager', 'corporate communications', 'corcom specialist',
        'media relations lead', 'press secretary', 'communications manager'
      ],
      strongIn: ['public relations', 'pr', 'humas', 'corporate communications', 'media relations', 'press release'],
      strongEn: ['public relations', 'pr', 'corporate communications', 'media relations', 'press release'],
      secondaryIn: ['jumpa pers konferensi pers', 'manajemen krisis komunikasi', 'jaringan jurnalis & media', 'siaran pers resmi'],
      secondaryEn: ['press conference organization', 'crisis communications', 'journalist media network', 'corporate press release']
    },
    {
      key: 'customer_experience_support',
      code: 'CSO',
      basesIn: [
        'customer service', 'cs', 'customer experience', 'cx', 'customer care',
        'helpdesk', 'layanan pelanggan', 'call center', 'customer support', 'contact center'
      ],
      basesEn: [
        'customer service', 'customer experience', 'cx manager', 'customer care lead',
        'call center manager', 'customer support specialist', 'contact center lead'
      ],
      strongIn: ['customer service', 'cs', 'customer experience', 'cx', 'layanan pelanggan', 'customer care'],
      strongEn: ['customer service', 'customer experience', 'cx', 'customer care', 'call center'],
      secondaryIn: ['sla penyelesaian komplain 98%', 'omnichannel whatsapp email telepon', 'tiket kendala zendesk freshdesk', 'csat & ces'],
      secondaryEn: ['98% complaint resolution sla', 'omnichannel support', 'ticketing system zendesk freshdesk', 'csat and nps']
    },
    {
      key: 'marcom_brand_activation',
      code: 'MCB',
      basesIn: [
        'marcom', 'marketing communications', 'brand activation', 'event marketing', 'komunikasi pemasaran',
        'aktivasi merek', 'promosi brand', 'event organizer marketing'
      ],
      basesEn: [
        'marcom manager', 'marketing communications', 'brand activation specialist', 'experiential marketing',
        'event marketing lead', 'promotions manager'
      ],
      strongIn: ['marcom', 'marketing communications', 'brand activation', 'komunikasi pemasaran', 'aktivasi merek'],
      strongEn: ['marcom', 'marketing communications', 'brand activation', 'event marketing', 'promotions'],
      secondaryIn: ['booth expo pameran', 'kol & influencer activation', 'materi promosi posm', 'kampanye promosi on-ground'],
      secondaryEn: ['trade show booths', 'influencer activations', 'posm promotional material', 'on ground brand roadshows']
    },
    {
      key: 'performance_paid_marketing',
      code: 'PMA',
      basesIn: [
        'performance marketing', 'paid ads', 'media buyer', 'meta ads', 'facebook ads',
        'google ads', 'tiktok ads', 'sem', 'roas', 'ppc specialist', 'periklanan berbayar'
      ],
      basesEn: [
        'performance marketing specialist', 'paid media buyer', 'meta ads manager', 'google ads specialist',
        'growth media buyer', 'ppc manager', 'paid acquisition lead'
      ],
      strongIn: ['performance marketing', 'paid ads', 'media buyer', 'meta ads', 'google ads', 'roas', 'sem'],
      strongEn: ['performance marketing', 'media buyer', 'meta ads', 'google ads', 'roas', 'paid acquisition'],
      secondaryIn: ['roas 5x+', 'cpc cpm cac ltv optimization', 'ab testing ad creative', 'conversion tracking pixel gtm'],
      secondaryEn: ['roas optimization', 'cpc cpa ltv metrics', 'creative split testing', 'pixel and tag tracking setup']
    },
    {
      key: 'ecommerce_marketplace_operations',
      code: 'ECO',
      basesIn: [
        'ecommerce', 'e-commerce', 'marketplace', 'olshop', 'shopee', 'tokopedia',
        'lazada', 'tiktok shop', 'admin marketplace', 'operasional toko online', 'toko online'
      ],
      basesEn: [
        'ecommerce specialist', 'marketplace operations manager', 'ecommerce store manager',
        'marketplace specialist', 'online shop operations'
      ],
      strongIn: ['ecommerce', 'e-commerce', 'marketplace', 'shopee', 'tokopedia', 'tiktok shop'],
      strongEn: ['ecommerce', 'e-commerce', 'marketplace operations', 'online store', 'marketplace manager'],
      secondaryIn: ['campaign marketplace 9.9 11.11 12.12', 'dekorasi toko flash sale', 'live streaming sales', 'manajemen sku stok online'],
      secondaryEn: ['double date mega campaigns', 'flash sale optimization', 'live shopping sales', 'e-store sku inventory sync']
    },
    {
      key: 'social_media_content_management',
      code: 'SMM',
      basesIn: [
        'social media', 'medsos', 'content creator', 'social media specialist', 'admin medsos',
        'konten kreator', 'tiktok', 'instagram', 'reels', 'copywriter'
      ],
      basesEn: [
        'social media manager', 'content creator', 'social media specialist', 'content strategist',
        'social media coordinator', 'copywriter'
      ],
      strongIn: ['social media', 'medsos', 'content creator', 'instagram', 'tiktok', 'social media specialist'],
      strongEn: ['social media', 'content creator', 'social media manager', 'content strategy'],
      secondaryIn: ['content calendar bulanan', 'short video reels tiktok viral', 'engagement rate & follower growth', 'copywriting persuasive'],
      secondaryEn: ['monthly content calendar', 'viral short form video', 'engagement metrics and audience growth', 'persuasive copywriting']
    },
    {
      key: 'growth_marketing_lead_gen',
      code: 'GRM',
      basesIn: [
        'growth marketing', 'growth hacker', 'lead generation', 'pertumbuhan pengguna',
        'growth specialist', 'user acquisition', 'funnel marketing', 'lead gen'
      ],
      basesEn: [
        'growth marketing manager', 'growth hacker', 'head of growth', 'lead generation specialist',
        'user acquisition manager', 'growth lead'
      ],
      strongIn: ['growth marketing', 'growth hacker', 'lead generation', 'user acquisition', 'funnel marketing'],
      strongEn: ['growth marketing', 'growth hacker', 'lead generation', 'user acquisition', 'growth lead'],
      secondaryIn: ['aarrr pirate metrics', 'growth experimentation sprint', 'viral loop & referral system', 'landing page conversion rate'],
      secondaryEn: ['aarrr funnel metrics', 'growth sprint testing', 'referral loop architecture', 'landing page cro optimization']
    },
    {
      key: 'brand_management_strategy',
      code: 'BRM',
      basesIn: [
        'brand manager', 'branding', 'brand strategy', 'manajemen merek', 'brand executive',
        'brand strategist', 'brand positioning', 'brand equity'
      ],
      basesEn: [
        'brand manager', 'brand strategist', 'head of brand', 'brand marketing lead',
        'brand director', 'brand equity manager'
      ],
      strongIn: ['brand manager', 'branding', 'brand strategy', 'brand positioning', 'manajemen merek'],
      strongEn: ['brand manager', 'brand strategy', 'brand positioning', 'brand marketing', 'head of brand'],
      secondaryIn: ['brand guideline bible', 'brand awareness survei', 'diferensiasi produk', 'rebranding & repositioning'],
      secondaryEn: ['brand guideline governance', 'brand awareness surveys', 'competitive differentiation', 'rebranding and positioning']
    }
  ],
  synonymsIn: {
    'pemasaran': ['marketing', 'promosi', 'iklan', 'branding', 'campaign', 'penjualan digital'],
    'medsos': ['social media', 'sosmed', 'instagram', 'tiktok', 'facebook', 'media sosial'],
    'layanan pelanggan': ['customer service', 'cs', 'cx', 'customer support', 'layanan pengaduan', 'bantuan konsumen'],
    'konten': ['content', 'artikel', 'video pendek', 'reels', 'infografis', 'materi promosi']
  },
  synonymsEn: {
    'marketing': ['commercial advertising', 'brand promotion', 'outreach', 'market development', 'campaign management'],
    'social media': ['digital media', 'content creation', 'online community', 'social channels'],
    'customer service': ['customer support', 'client support', 'helpdesk', 'customer experience', 'service desk']
  }
};

export const financeDomain: DomainMetadata = {
  domain: 'finance',
  nameIn: 'Keuangan, Akuntansi & Perpajakan',
  nameEn: 'Finance, Accounting & Tax',
  roles: [
    {
      key: 'financial_accounting_reporting',
      code: 'ACC',
      basesIn: [
        'accounting', 'akuntansi', 'finance', 'keuangan', 'pembukuan', 'general ledger',
        'laporan keuangan', 'financial statement', 'jurnal keuangan', 'neraca rugi laba',
        'accountant', 'akuntan', 'senior accountant', 'spv akuntansi'
      ],
      basesEn: [
        'accounting manager', 'senior accountant', 'financial accountant', 'general ledger accountant',
        'financial reporting manager', 'head of accounting', 'corporate controller'
      ],
      strongIn: ['accounting', 'akuntansi', 'pembukuan', 'general ledger', 'laporan keuangan', 'neraca'],
      strongEn: ['accounting', 'accountant', 'general ledger', 'financial statements', 'financial reporting'],
      secondaryIn: ['psak standar akuntansi keuangan', 'rekonsiliasi bank harian', 'jurnal penyesuaian akrual', 'audit kap eksternal', 'accurate odoo sap'],
      secondaryEn: ['ifrs and gaap standards', 'daily bank reconciliations', 'accrual adjusting journals', 'external audit readiness', 'erp systems']
    },
    {
      key: 'financial_analysis_cost_control',
      code: 'FAC',
      basesIn: [
        'financial analyst', 'analis keuangan', 'cost control', 'pengendali biaya', 'hpp',
        'cogs', 'budgeting', 'anggaran', 'fp&a', 'financial planning & analysis', 'analisis varians biaya'
      ],
      basesEn: [
        'financial analyst', 'cost controller', 'fp&a specialist', 'financial planning and analysis',
        'cost accountant', 'financial modeling analyst'
      ],
      strongIn: ['financial analyst', 'cost control', 'hpp', 'budgeting', 'anggaran', 'fp&a'],
      strongEn: ['financial analyst', 'cost control', 'fp&a', 'financial planning and analysis', 'cost controller'],
      secondaryIn: ['variance analysis anggaran vs realisasi', 'analisis margin laba kotor kotoran', 'financial forecasting & run rate', 'dcf valuation model'],
      secondaryEn: ['budget vs actual variance analysis', 'gross margin optimization', 'financial forecasting modeling', 'dcf valuation']
    },
    {
      key: 'tax_compliance_planning',
      code: 'TAX',
      basesIn: [
        'tax', 'pajak', 'perpajakan', 'tax officer', 'staf pajak', 'brevet a b',
        'fiskal', 'spt tahunan', 'spt masa', 'e-faktur', 'pph 21', 'pph 23', 'ppn', 'efiling pajak'
      ],
      basesEn: [
        'tax specialist', 'tax accountant', 'tax manager', 'tax compliance officer',
        'corporate tax analyst', 'statutory tax consultant'
      ],
      strongIn: ['tax', 'pajak', 'perpajakan', 'e-faktur', 'pph 21', 'pph 23', 'ppn', 'brevet'],
      strongEn: ['tax specialist', 'tax compliance', 'corporate tax', 'vat specialist', 'tax manager'],
      secondaryIn: ['djp online e-spt', 'e-faktur pajak masukan keluaran', 'rekonsiliasi fiskal koreksi positif negatif', 'pemeriksaan sp2dk pajak'],
      secondaryEn: ['statutory tax filing', 'vat tax invoice reconciliation', 'fiscal tax corrections', 'tax audit defense preparation']
    },
    {
      key: 'accounts_payable_receivable',
      code: 'APA',
      basesIn: [
        'accounts payable', 'ap', 'accounts receivable', 'ar', 'ap/ar', 'ap & ar',
        'piutang', 'utang', 'billing', 'invoicing', 'penagihan invoice', 'collection'
      ],
      basesEn: [
        'accounts payable specialist', 'accounts receivable specialist', 'ap/ar accountant',
        'billing manager', 'credit and collection specialist', 'credit controller'
      ],
      strongIn: ['accounts payable', 'accounts receivable', 'ap', 'ar', 'piutang', 'utang dagang'],
      strongEn: ['accounts payable', 'accounts receivable', 'ap/ar', 'billing', 'collections'],
      secondaryIn: ['aging report piutang aging schedule', 'verifikasi 3-way matching po do invoice', 'tukar faktur vendor', 'collection dso tracking'],
      secondaryEn: ['aging receivables report', '3-way matching purchase orders', 'vendor payment runs', 'days sales outstanding dso reduction']
    },
    {
      key: 'pricing_commercial_finance',
      code: 'PSC',
      basesIn: [
        'pricing', 'pricing analyst', 'commercial finance', 'harga jual', 'margin laba',
        'sku profitability', 'analisis harga', 'commercial analyst', 'strategi harga'
      ],
      basesEn: [
        'pricing analyst', 'commercial finance manager', 'pricing strategist', 'commercial analyst',
        'revenue management analyst', 'margin analyst'
      ],
      strongIn: ['pricing', 'commercial finance', 'harga jual', 'margin', 'sku profitability'],
      strongEn: ['pricing analyst', 'commercial finance', 'pricing strategist', 'margin optimization'],
      secondaryIn: ['cost plus & value based pricing', 'margin contribution per sku', 'diskon & promosi komersial', 'elastisitas harga produk'],
      secondaryEn: ['cost plus pricing models', 'sku unit economics', 'promotional discount impact', 'price elasticity analytics']
    },
    {
      key: 'internal_audit_financial_control',
      code: 'IAF',
      basesIn: [
        'internal audit', 'auditor internal', 'audit keuangan', 'financial control', 'audit kepatuhan',
        'pemeriksa keuangan', 'fraud audit', 'internal control', 'spv audit'
      ],
      basesEn: [
        'internal auditor', 'financial auditor', 'internal control manager', 'fraud investigator',
        'compliance auditor', 'head of internal audit'
      ],
      strongIn: ['internal audit', 'auditor internal', 'financial control', 'pemeriksaan keuangan', 'audit fraud'],
      strongEn: ['internal audit', 'financial controller', 'internal controls', 'compliance audit', 'fraud audit'],
      secondaryIn: ['audit sampling & fieldwork', 'laporan hasil audit lha', 'rekomendasi temuan perbaikan', 'sop & risk control matrix rcm'],
      secondaryEn: ['audit fieldwork and sampling', 'internal audit reports', 'corrective audit recommendations', 'risk control matrix']
    }
  ],
  synonymsIn: {
    'keuangan': ['finance', 'financial', 'kas', 'anggaran', 'dana', 'arus kas', 'fiskal'],
    'akuntansi': ['accounting', 'pembukuan', 'laporan keuangan', 'general ledger', 'neraca', 'jurnal'],
    'pajak': ['tax', 'perpajakan', 'fiskal', 'spt', 'pph', 'ppn', 'e-faktur', 'brevet'],
    'piutang': ['receivable', 'ar', 'tagihan', 'kreditur', 'penagihan', 'invoice customer'],
    'utang': ['payable', 'ap', 'kewajiban bayar', 'tunggakan', 'vendor payment', 'tagihan masuk']
  },
  synonymsEn: {
    'finance': ['financial management', 'treasury', 'fiscal planning', 'capital management', 'cashflow'],
    'accounting': ['bookkeeping', 'financial reporting', 'general ledger', 'audit preparation', 'ledger balancing'],
    'taxation': ['tax compliance', 'tax filing', 'corporate tax', 'vat', 'withholding tax']
  }
};
