import { PresetMatchingRule } from './types';

export const financeAccountingRules: PresetMatchingRule[] = [
  {
    key: 'finance_accounting',
    code: 'ACC',
    exactPhrases: [
      'accounting', 'finance accounting', 'finance & accounting', 'accounting manager', 'manajer akuntansi',
      'accounting supervisor', 'spv accounting', 'accounting staff', 'staf akuntansi', 'head of accounting',
      'finance manager', 'manajer keuangan', 'finance supervisor', 'spv finance', 'chief accountant',
      'general accountant', 'staf pembukuan', 'senior accountant', 'junior accountant', 'lead accountant',
      'akuntansi dan keuangan', 'staf keuangan dan akuntansi', 'accounting officer', 'finance and accounting specialist', 'asst accounting manager',
      'kepala bagian akuntansi', 'staf laporan keuangan', 'general ledger accountant', 'gl accountant'
    ],
    strongKeywords: [
      'accounting', 'finance accounting', 'manajer akuntansi', 'spv accounting', 'staf akuntansi',
      'pembukuan', 'laporan keuangan', 'general ledger', 'neraca laba rugi'
    ],
    secondaryKeywords: [
      'jurnal umum', 'buku besar', 'rekonsiliasi bank', 'tutup buku bulanan', 'akrual',
      'psak standar akuntansi', 'aplikasi vynance', 'trial balance'
    ],
    negativeKeywords: [
      'resepsionis', 'security', 'cleaning', 'waiter', 'bartender',
      'sales lapangan'
    ]
  },
  {
    key: 'financial_analyst_cost',
    code: 'FAC',
    exactPhrases: [
      'financial analyst', 'analis keuangan', 'cost analyst', 'analis biaya', 'cost accountant',
      'akuntan biaya', 'cost control', 'cost controller', 'spv cost control', 'cost control manager',
      'manajer cost control', 'financial planning and analysis', 'fp&a', 'fpa specialist', 'budget analyst',
      'analis anggaran', 'lead financial analyst', 'senior cost controller', 'business finance analyst', 'staf cost control manufaktur',
      'pengendali biaya proyek', 'financial modeling analyst', 'corporate finance analyst'
    ],
    strongKeywords: [
      'financial analyst', 'cost analyst', 'cost control', 'cost controller', 'fp&a',
      'analis biaya', 'analis keuangan', 'pengendali biaya'
    ],
    secondaryKeywords: [
      'kalkulasi hpp', 'analisis varians biaya', 'penganggaran modal capex opex', 'proyeksi arus kas', 'break even point bep',
      'efisiensi margin laba'
    ],
    mustIncludeAny: [
      'analyst', 'analis', 'cost control', 'controller', 'fp&a',
      'biaya'
    ]
  },
  {
    key: 'tax_accounting_officer',
    code: 'TAX',
    exactPhrases: [
      'tax specialist', 'spesialis pajak', 'tax officer', 'staf pajak', 'tax supervisor',
      'spv pajak', 'tax manager', 'manajer pajak', 'tax consultant', 'konsultan pajak',
      'tax accounting', 'akuntansi perpajakan', 'head of tax', 'staf perpajakan', 'brevet ab specialist',
      'e-faktur specialist', 'tax compliance officer', 'corporate tax specialist', 'lead tax officer', 'senior tax accountant',
      'staf pelaporan spt', 'petugas pajak korporat'
    ],
    strongKeywords: [
      'tax specialist', 'staf pajak', 'tax officer', 'tax manager', 'perpajakan',
      'akuntansi perpajakan', 'brevet a/b', 'spt tahunan'
    ],
    secondaryKeywords: [
      'pph pasal 21/23/25/29', 'ppn dan e-faktur', 'djp online', 'ebupot', 'ekualisasi pajak',
      'pemeriksaan pajak', 'kepatuhan regulasi fiskal'
    ],
    mustIncludeAny: [
      'tax', 'pajak', 'perpajakan', 'fiskal', 'brevet'
    ]
  },
  {
    key: 'ap_ar_accounting',
    code: 'APA',
    exactPhrases: [
      'account payable', 'account receivable', 'ap ar', 'ap staff', 'ar staff',
      'staf ap', 'staf ar', 'ap ar supervisor', 'spv ap ar', 'accounts payable specialist',
      'accounts receivable specialist', 'staf hutang piutang', 'staf piutang dagang', 'staf hutang usaha', 'ap ar specialist',
      'lead ap ar', 'ap officer', 'ar officer', 'credit controller', 'collection and ar officer',
      'vendor payment specialist ap', 'staf penagihan piutang ar'
    ],
    strongKeywords: [
      'account payable', 'account receivable', 'ap ar', 'hutang piutang', 'piutang dagang',
      'hutang usaha', 'credit controller'
    ],
    secondaryKeywords: [
      'aging schedule piutang', 'rekonsiliasi invoice vendor', 'verifikasi faktur masuk', 'jadwal jatuh tempo pembayaran', 'konfirmasi saldo piutang',
      'dunning penagihan'
    ],
    mustIncludeAny: [
      'payable', 'receivable', 'ap', 'ar', 'hutang',
      'piutang'
    ]
  },
  {
    key: 'pricing_commercial_analyst',
    code: 'PSC',
    exactPhrases: [
      'pricing analyst', 'analis harga', 'pricing specialist', 'commercial finance analyst', 'pricing manager',
      'manajer penetapan harga', 'revenue management analyst', 'lead pricing analyst', 'commercial pricing officer', 'b2b pricing specialist',
      'retail pricing analyst', 'margin optimization specialist', 'deal pricing consultant', 'commercial finance specialist'
    ],
    strongKeywords: [
      'pricing analyst', 'pricing specialist', 'pricing manager', 'commercial finance analyst', 'analis harga',
      'penetapan harga komersial'
    ],
    secondaryKeywords: [
      'analisis elastisitas harga', 'struktur margin kotor', 'skema diskon berjenjang', 'benchmark harga kompetitor', 'kalkulasi profitability deal'
    ],
    mustIncludeAny: [
      'pricing', 'penetapan harga', 'harga'
    ]
  },
  {
    key: 'internal_audit_finance',
    code: 'IAF',
    exactPhrases: [
      'internal audit', 'auditor internal', 'financial auditor', 'auditor keuangan', 'internal audit manager',
      'manajer audit internal', 'internal audit supervisor', 'spv audit', 'staf audit internal', 'fraud auditor',
      'compliance auditor', 'head of internal audit', 'lead internal auditor', 'senior internal auditor', 'staf inspeksi keuangan',
      'audit operasional & keuangan', 'forensic audit specialist'
    ],
    strongKeywords: [
      'internal audit', 'auditor internal', 'financial auditor', 'manajer audit', 'pemeriksaan keuangan',
      'fraud auditor', 'audit kepatuhan'
    ],
    secondaryKeywords: [
      'temuan audit', 'pengujian kepatuhan sop kasir', 'stock opname audit', 'rekomendasi perbaikan tata kelola', 'kertas kerja audit kka',
      'risk assessment'
    ],
    mustIncludeAny: [
      'audit', 'auditor', 'internal audit', 'pemeriksaan keuangan'
    ]
  },
];
