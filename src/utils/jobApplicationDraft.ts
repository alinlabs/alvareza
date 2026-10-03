import { EmailLanguage, EmailTone, JobScanResult } from '../types/jobApplication';
import { matchExactJobPositionFromCatalog, stripOcrArtifactsFromText } from '../data/jobPositionsCatalog';
import { matchPresetFromJobTitle } from '../data/rolePresetsConfig';
import {
  detectLanguageFromText,
  extractEmailStrict,
  extractPhoneStrict,
  extractSubjectFormatNotice,
  extractCompanyNameStrict,
  extractJobPositionStrict,
} from './ocrEntityExtractor';

export const APPLICANT_DATA = {
  fullName: 'Alvareza Hilka Pratama',
  email: 'alvareza.work@gmail.com',
  phone: '+62 857-9718-4059',
  portfolioUrl: 'https://alvareza.vercel.app',
  linkedinUrl: 'https://linkedin.com/in/alvareza-hilka-pratama',
  headline: 'Business Operations & Strategic Management Specialist',
  certification: 'Human Resources (MarkPlus Institute, Nilai 93,00) & Six Sigma White Belt',
  keyHighlights: [
    'Supervisi operasional 13 gerai ritel dan koordinasi lintas 6 divisi bisnis',
    'Eksekusi 100+ proyek komersial dengan CSAT 98% dan kepatuhan SLA >95%',
    'Perancangan 20+ SOP yang memangkas hambatan operasional hingga 70%',
    'Pembangunan 50+ aplikasi sistem digital/ERP kustom untuk efisiensi bisnis',
    'Pengelolaan database prospek B2B CRM 4.000+ kontak',
  ],
};

// Export all OCR entity extraction utilities
export * from './ocrEntityExtractor';

/**
 * Dynamic keyword-based highlights tailored to the target job position & preset category
 */
export function getTailoredEmailHighlights(jobTitle: string, presetKey: string, lang: EmailLanguage): string[] {
  const titleLower = (jobTitle || '').toLowerCase();
  const keyLower = (presetKey || '').toLowerCase();

  // 1. HR, Recruitment, People Ops & Personnel
  if (
    keyLower.includes('hr') ||
    keyLower.includes('talent') ||
    keyLower.includes('recruitment') ||
    keyLower.includes('people') ||
    keyLower.includes('payroll') ||
    keyLower.includes('compensation') ||
    keyLower.includes('comben') ||
    keyLower.includes('industrial') ||
    titleLower.includes('hr') ||
    titleLower.includes('recruitment') ||
    titleLower.includes('rekrutmen') ||
    titleLower.includes('personalia') ||
    titleLower.includes('sdm') ||
    titleLower.includes('payroll') ||
    titleLower.includes('comben') ||
    titleLower.includes('ta')
  ) {
    if (lang === 'en') {
      return [
        'End-to-end talent acquisition & recruitment lifecycle (sourcing, Behavioral Event Interview / BEI, candidate assessment, offering, and structured onboarding) powered by custom ATS/HRIS.',
        'In-depth Indonesian Labor Law compliance (Job Creation Law & GR 35/2021), PKWT/PKWTT contract drafting, workplace policies, and bipartite industrial relations.',
        'Comprehensive Compensation & Benefits management, statutory PPh 21 TER tax modeling (PP 58/2023), BPJS Employment (all 5 programs) & Healthcare, and zero-variance digital payroll automation.'
      ];
    }
    return [
      'Penyelenggaraan siklus rekrutmen & akuisisi talenta end-to-end (sourcing multi-channel, Behavioral Event Interview / BEI, online assessment, offering letter, hingga onboarding) terintegrasi sistem ATS/HRIS.',
      'Penguasaan mendalam hukum ketenagakerjaan (UU Cipta Kerja, PP 35/2021 & PP 36/2021), standardisasi kontrak kerja PKWT/PKWTT, Peraturan Perusahaan, serta penanganan hubungan industrial bipartit.',
      'Pengelolaan Kompensasi & Benefit, formula PPh 21 TER (A/B/C PP 58/2023), BPJS Ketenagakerjaan (5 program) & BPJS Kesehatan, serta otomasi pembukuan payroll digital bebas selisih.'
    ];
  }

  // 2. Administration, Secretariat & Legal
  if (
    keyLower.includes('admin') ||
    keyLower.includes('secretary') ||
    keyLower.includes('executive_assistant') ||
    keyLower.includes('legal') ||
    keyLower.includes('hospital') ||
    titleLower.includes('admin') ||
    titleLower.includes('sekretaris') ||
    titleLower.includes('office') ||
    titleLower.includes('legal') ||
    titleLower.includes('tata usaha')
  ) {
    if (lang === 'en') {
      return [
        'Office administration governance, official executive correspondence, and high-precision digital archiving of legal documents.',
        'Formulation of 20+ standardized administrative SOPs and digital records cutting document processing lead time by 70%.',
        'Cross-departmental operational support, executive schedule coordination, and seamless office workflow management.'
      ];
    }
    return [
      'Tata kelola administrasi kantor, korespondensi resmi pimpinan, dan kearsipan digital dokumen legal dengan presisi tinggi.',
      'Perancangan 20+ SOP kerja administratif baru dan rekap digital yang memangkas 70% waktu pemrosesan dokumen.',
      'Dukungan operasional lintas departemen, pengelolaan agenda pimpinan, serta kelancaran alur kerja kantor.'
    ];
  }

  // 3. Tech, Software & IT Engineering
  if (
    keyLower.includes('software') ||
    keyLower.includes('frontend') ||
    keyLower.includes('backend') ||
    keyLower.includes('developer') ||
    keyLower.includes('systems') ||
    keyLower.includes('erp') ||
    keyLower.includes('data') ||
    titleLower.includes('developer') ||
    titleLower.includes('software') ||
    titleLower.includes('programmer') ||
    titleLower.includes('it') ||
    titleLower.includes('frontend') ||
    titleLower.includes('backend')
  ) {
    if (lang === 'en') {
      return [
        'Architected and deployed 50+ custom web-based digital systems & ERP business tools for operational efficiency.',
        'B2B CRM prospect database management (4,000+ contacts) and cross-departmental data pipeline automation.',
        'Technical problem solving with high code quality, optimal application performance, and >95% SLA execution.'
      ];
    }
    return [
      'Perancangan dan pembangunan 50+ aplikasi sistem digital/ERP kustom berbasis web untuk efisiensi operasional bisnis.',
      'Pengelolaan database prospek B2B CRM (4.000+ kontak) dan otomatisasi alur data antar departemen.',
      'Penyelesaian masalah teknis dengan standar kualitas tinggi, performa sistem optimal, serta eksekusi SLA >95%.'
    ];
  }

  // 4. Finance, Accounting, Tax & Billing
  if (
    keyLower.includes('finance') ||
    keyLower.includes('accounting') ||
    keyLower.includes('tax') ||
    keyLower.includes('billing') ||
    keyLower.includes('audit') ||
    titleLower.includes('finance') ||
    titleLower.includes('accounting') ||
    titleLower.includes('keuangan') ||
    titleLower.includes('pajak') ||
    titleLower.includes('tax') ||
    titleLower.includes('billing') ||
    titleLower.includes('kasir')
  ) {
    if (lang === 'en') {
      return [
        'Financial reconciliation, cash/bank transaction processing, invoice billing verification, and accurate reporting.',
        'Operational budget tracking, periodic tax compliance, expense variance control, and financial documentation.',
        'ERP/accounting software operation maintaining >99% data accuracy and standardized financial workflows.'
      ];
    }
    return [
      'Rekonsiliasi transaksi kas/bank, pemrosesan invoice/faktur billing, dan verifikasi dokumen keuangan secara akurat.',
      'Pengawasan realisasi anggaran operasional, pelaporan pajak berkala, serta pengendalian biaya secara cermat.',
      'Pengoperasian perangkat lunak akuntansi/ERP dengan tingkat ketelitian data >99% dan alur kerja terstandar.'
    ];
  }

  // 5. Marketing, Marcom, Branding & Media
  if (
    keyLower.includes('marketing') ||
    keyLower.includes('marcom') ||
    keyLower.includes('brand') ||
    keyLower.includes('media') ||
    keyLower.includes('content') ||
    keyLower.includes('growth') ||
    titleLower.includes('marketing') ||
    titleLower.includes('marcom') ||
    titleLower.includes('brand') ||
    titleLower.includes('media') ||
    titleLower.includes('sosmed')
  ) {
    if (lang === 'en') {
      return [
        'Promotional campaign execution, social media channel management, and targeted brand message positioning.',
        'Market trend analysis, target audience engagement optimization, and multi-channel marketing communications.',
        'Data-driven marketing campaign optimization delivering measurable brand growth and 98% CSAT.'
      ];
    }
    return [
      'Perancangan kampanye promosi, manajemen saluran media sosial, dan penyusunan pesan merek yang tepat sasaran.',
      'Analisis tren pasar, optimasi retensi audiens, serta strategi komunikasi pemasaran multi-saluran.',
      'Optimalisasi kampanye pemasaran berbasis data yang mendorong pertumbuhan brand dan kepuasan pelanggan 98%.'
    ];
  }

  // 6. Sales, B2B, Key Account & Business Development
  if (
    keyLower.includes('sales') ||
    keyLower.includes('business_development') ||
    keyLower.includes('account') ||
    keyLower.includes('partner') ||
    titleLower.includes('sales') ||
    titleLower.includes('b2b') ||
    titleLower.includes('penjualan') ||
    titleLower.includes('bisnis') ||
    titleLower.includes('account')
  ) {
    if (lang === 'en') {
      return [
        'B2B CRM prospect pipeline management (4,000+ contacts) and strategic institutional client penetration.',
        'Commercial solution presentations, contract deal negotiation, and consistent sales volume growth target delivery.',
        'Key Account Management (KAM) maintaining long-term corporate partnerships with 98% CSAT service quality.'
      ];
    }
    return [
      'Pengelolaan pipeline prospek B2B CRM 4.000+ kontak dan penetrasi pasar ke klien institusi strategis.',
      'Presentasi solusi bisnis komersial, negosiasi kontrak kerja sama, serta pencapaian target pertumbuhan penjualan.',
      'Manajemen hubungan klien kunci (Key Accounts) berkelanjutan dengan tingkat kepuasan layanan (CSAT) 98%.'
    ];
  }

  // 7. Supply Chain, Logistics, Warehouse & Procurement
  if (
    keyLower.includes('logistics') ||
    keyLower.includes('warehouse') ||
    keyLower.includes('procurement') ||
    keyLower.includes('supply') ||
    keyLower.includes('ppic') ||
    titleLower.includes('logistik') ||
    titleLower.includes('gudang') ||
    titleLower.includes('warehouse') ||
    titleLower.includes('procurement') ||
    titleLower.includes('pengadaan') ||
    titleLower.includes('ppic')
  ) {
    if (lang === 'en') {
      return [
        'Warehouse inventory stock flow control (FIFO method), stock accuracy audits, and storage layout optimization.',
        'Supply chain distribution fleet coordination, vendor/supplier purchasing negotiations, and PPIC scheduling.',
        'Supply chain SLA execution (>95%) eliminating stock discrepancies and operational bottlenecks by 70%.'
      ];
    }
    return [
      'Pengawasan alur persediaan stok gudang (metode FIFO), akurasi fisik stok, dan efisiensi penyimpanan.',
      'Koordinasi armada distribusi rantai pasok, negosiasi dengan vendor/pemasok, dan perancangan jadwal PPIC.',
      'Eksekusi pengiriman barang dengan pemenuhan SLA >95% dan pencegahan hambatan operasional hingga 70%.'
    ];
  }

  // 8. Default fallback
  if (lang === 'en') {
    return [
      'Supervised 13 retail branches and coordinated cross-functional execution across 6 divisions (98% CSAT, >95% SLA).',
      'Formulated standardized SOPs and continuous improvement frameworks, eliminating 70% of workflow bottlenecks.',
      'Engineered 50+ custom digital systems and business ERP tools for inventory and CRM operations.'
    ];
  }
  return [
    'Supervisi operasional 13 gerai ritel dan koordinasi lintas 6 divisi bisnis (CSAT 98%, SLA >95%).',
    'Standardisasi 20+ SOP kerja baru yang berhasil memangkas 70% hambatan operasional tim.',
    'Transformasi digital dan otomatisasi sistem kerja berbasis web/ERP (50+ aplikasi).'
  ];
}

export interface TailoredExperienceInfo {
  intro: string;
  bullets: string[];
}

/**
 * Dynamic candidate experience breakdown tailored to the active CV preset category (Structured Bullet Points)
 * Carefully calibrated to avoid over-claiming years of experience across specialized fields while highlighting real CV accomplishments.
 */
export function getTailoredExperienceDetails(presetKey: string, lang: EmailLanguage = 'id'): TailoredExperienceInfo {
  const keyLower = (presetKey || '').toLowerCase();

  // 1. HR, Talent, Recruitment & People Operations
  if (
    keyLower.includes('hr') ||
    keyLower.includes('talent') ||
    keyLower.includes('recruitment') ||
    keyLower.includes('people') ||
    keyLower.includes('payroll') ||
    keyLower.includes('compensation') ||
    keyLower.includes('comben') ||
    keyLower.includes('industrial') ||
    keyLower.includes('employer_branding')
  ) {
    if (lang === 'en') {
      return {
        intro: 'a solid professional background in Human Resources & People Operations',
        bullets: [
          'End-to-end talent acquisition (sourcing, BEI interview, skill testing & onboarding)',
          'Indonesian Labor Law compliance, PKWT/PKWTT contracts & industrial relations',
          'Compensation & benefits, PPh 21 TER, BPJS 5 programs & automated payroll ledger',
          'Job description-linked KPI appraisal matrix & HR Matrix Web/PWA ATS architecture',
        ],
      };
    }
    return {
      intro: 'rekam jejak pengalaman dalam tata kelola SDM (Human Resources & People Operations)',
      bullets: [
        'Rekrutmen talenta end-to-end (sourcing, wawancara BEI, asesmen & onboarding)',
        'Kepatuhan hukum ketenagakerjaan, perjanjian kerja PKWT/PKWTT & hubungan industrial',
        'Kompensasi & benefit, kalkulasi PPh 21 TER, BPJS 5 program & pembukuan payroll digital',
        'Penyusunan matriks penilaian kinerja KPI berbasis job desk & arsitektur ATS HR Matrix',
      ],
    };
  }

  // 2. Administration, Secretariat, Office & General Affairs
  if (
    keyLower.includes('admin') ||
    keyLower.includes('secretary') ||
    keyLower.includes('executive_assistant') ||
    keyLower.includes('general_affairs') ||
    keyLower.includes('office') ||
    keyLower.includes('hospital') ||
    keyLower.includes('data_entry')
  ) {
    if (lang === 'en') {
      return {
        intro: 'proven professional experience in office administration and operational governance',
        bullets: [
          'Executive correspondence, document archiving & records management',
          'Standardization of 20+ operational SOPs & facility coordination',
          'Workflow optimization and structured data management',
        ],
      };
    }
    return {
      intro: 'pengalaman kerja dalam administrasi perkantoran & tata kelola operasional',
      bullets: [
        'Korespondensi resmi, administrasi eksekutif & tata kelola arsip',
        'Standardisasi 20+ SOP operasional & pengelolaan fasilitas kantor',
        'Optimalisasi alur kerja dokumen & pengolahan data terstruktur',
      ],
    };
  }

  // 3. Project Management, PMO & Program Delivery
  if (
    keyLower.includes('pmo') ||
    keyLower.includes('project') ||
    keyLower.includes('program')
  ) {
    if (lang === 'en') {
      return {
        intro: 'a proven track record in Project Management & Program Delivery (PMO)',
        bullets: [
          'Execution & monitoring of 100+ cross-functional projects with >95% SLA compliance',
          'Timeline governance, resource allocation & operational risk mitigation',
          'Continuous workflow improvement and business process optimization',
        ],
      };
    }
    return {
      intro: 'rekam jejak dalam manajemen proyek & Project Management Office (PMO)',
      bullets: [
        'Eksekusi & monitoring 100+ proyek lintas divisi dengan pemenuhan SLA >95%',
        'Tata kelola timeline, alokasi sumber daya & manajemen risiko operasional',
        'Continuous improvement alur kerja dan optimalisasi proses bisnis',
      ],
    };
  }

  // 4. B2B Sales, Key Account & Business Development
  if (
    keyLower.includes('sales') ||
    keyLower.includes('business_development') ||
    keyLower.includes('account') ||
    keyLower.includes('partner')
  ) {
    if (lang === 'en') {
      return {
        intro: 'solid professional experience in B2B business development & corporate account management',
        bullets: [
          'Management of 4,000+ business relationship contacts in CRM pipeline',
          'Commercial partnership negotiations & revenue target attainment',
          'High-standard client satisfaction delivery (98% CSAT)',
        ],
      };
    }
    return {
      intro: 'pengalaman kerja dalam pengembangan bisnis B2B & pengelolaan relasi klien',
      bullets: [
        'Manajemen 4.000+ kontak relasi dalam pipeline CRM bisnis',
        'Negosiasi kemitraan komersial & pencapaian target kerja sama',
        'Pelayanan kepuasan klien berstandar tinggi (CSAT 98%)',
      ],
    };
  }

  // 5. Supply Chain, Logistics, Warehouse & Procurement
  if (
    keyLower.includes('logistics') ||
    keyLower.includes('warehouse') ||
    keyLower.includes('procurement') ||
    keyLower.includes('supply') ||
    keyLower.includes('ppic')
  ) {
    if (lang === 'en') {
      return {
        intro: 'proven background in supply chain management, warehouse governance & logistics coordination',
        bullets: [
          'Warehouse inventory management utilizing standardized FIFO methodology',
          'Procurement sourcing, vendor coordination & purchase order verification',
          'On-time logistics distribution across multi-branch networks',
        ],
      };
    }
    return {
      intro: 'pengalaman kerja dalam manajemen rantai pasok, logistik & pergudangan',
      bullets: [
        'Pengelolaan persediaan inventaris gudang dengan metode alur FIFO terstandar',
        'Koordinasi pengadaan barang (procurement) & evaluasi vendor penyedia',
        'Distribusi logistik tepat waktu dan efisiensi rantai pasok multi-cabang',
      ],
    };
  }

  // 6. Tech, Software & Digital Systems Development
  if (
    keyLower.includes('software') ||
    keyLower.includes('frontend') ||
    keyLower.includes('backend') ||
    keyLower.includes('developer') ||
    keyLower.includes('systems') ||
    keyLower.includes('digital_tech') ||
    keyLower.includes('digital_transformation')
  ) {
    if (lang === 'en') {
      return {
        intro: 'practical experience in digital systems engineering & web/ERP workflow automation',
        bullets: [
          'Engineering & deployment of 50+ custom web/ERP system applications',
          'Workflow automation to maximize operational productivity',
          'System reliability maintenance & rapid technical problem solving',
        ],
      };
    }
    return {
      intro: 'pengalaman dalam perancangan sistem digital & otomatisasi alur kerja web/ERP',
      bullets: [
        'Pengembangan & deployment 50+ aplikasi sistem digital/ERP operasional',
        'Otomatisasi proses kerja untuk percepatan produktivitas bisnis',
        'Pemeliharaan keandalan sistem dan penanganan kendala teknis operasional',
      ],
    };
  }

  // 7. Finance, Accounting & Cost Control
  if (
    keyLower.includes('finance') ||
    keyLower.includes('accounting') ||
    keyLower.includes('tax') ||
    keyLower.includes('billing') ||
    keyLower.includes('audit')
  ) {
    if (lang === 'en') {
      return {
        intro: 'practical experience in operational financial administration, transaction records & cost control',
        bullets: [
          'Invoice verification, financial records filing & cash reconciliation',
          'Operational budget analysis and cost control optimization',
          'Accurate, verified periodic financial reporting',
        ],
      };
    }
    return {
      intro: 'pengalaman dalam administrasi keuangan, pencatatan transaksi & cost control',
      bullets: [
        'Verifikasi faktur/invoice, pengarsipan keuangan & rekonsiliasi kas',
        'Analisis pengendalian anggaran biaya (cost control) operasional',
        'Pelaporan keuangan berkala yang akurat dan terverifikasi',
      ],
    };
  }

  // 8. Marketing, Branding & PR
  if (
    keyLower.includes('marketing') ||
    keyLower.includes('marcom') ||
    keyLower.includes('brand') ||
    keyLower.includes('media') ||
    keyLower.includes('content')
  ) {
    if (lang === 'en') {
      return {
        intro: 'professional experience in marketing strategy formulation, promotional campaigns & brand management',
        bullets: [
          'Multi-channel promotional campaign planning and execution',
          'Target audience research analysis & engagement growth',
          'Brand reputation management & external communications',
        ],
      };
    }
    return {
      intro: 'pengalaman kerja dalam komunikasi pemasaran, kampanye promosi & manajemen brand',
      bullets: [
        'Perencanaan & eksekusi kampanye promosi multi-saluran',
        'Analisis riset pasar, audiens sasaran & pertumbuhan engagement',
        'Pengelolaan citra brand serta komunikasi eksternal',
      ],
    };
  }

  // 9. General Operations & Management (Default / Optimal / All)
  if (lang === 'en') {
    return {
      intro: '4+ years of professional experience in cross-functional operations management',
      bullets: [
        'Supervision of 13 retail branches & coordination across 6 business divisions',
        'Standardization of 20+ operational SOPs & governance frameworks',
        'Team leadership and end-to-end workflow efficiency optimization',
      ],
    };
  }
  return {
    intro: '4+ tahun pengalaman kerja dalam manajemen operasional lintas fungsi',
    bullets: [
      'Supervisi 13 gerai ritel & koordinasi 6 divisi bisnis',
      'Standardisasi 20+ SOP operasional & tata kelola sistem kerja',
      'Kepemimpinan tim dan optimalisasi efisiensi alur kerja',
    ],
  };
}

/**
 * Dynamic candidate experience summary tailored to the active CV preset category (Legacy String Form)
 */
export function getTailoredExperienceSummary(presetKey: string, lang: EmailLanguage = 'id'): string {
  const details = getTailoredExperienceDetails(presetKey, lang);
  return `${details.intro} (${details.bullets.join(', ')})`;
}

/**
 * Dynamic candidate certification summary tailored to the active CV preset category (No numeric scores, Grade & IACET USA inclusion)
 * STRICTLY aligns with the candidate's actual certifications in the CV data without cross-field contamination.
 */
export function getTailoredCertificationSummary(presetKey: string, lang: EmailLanguage = 'id'): string {
  const keyLower = (presetKey || '').toLowerCase();

  // 1. HR & People Management Specific
  if (
    keyLower.includes('hr') ||
    keyLower.includes('talent') ||
    keyLower.includes('recruitment') ||
    keyLower.includes('people') ||
    keyLower.includes('payroll') ||
    keyLower.includes('employer_branding')
  ) {
    if (lang === 'en') {
      return 'Human Resources from MarkPlus Institute (Grade A / Outstanding) and Human Resource Management from Saylor Academy (Grade A / IACET Accredited Provider, USA)';
    }
    return 'Human Resources dari MarkPlus Institute (Grade A / Predikat Outstanding) serta Human Resource Management dari Saylor Academy (Grade A / Terakreditasi IACET, USA)';
  }

  // 2. Tech, Software & Systems Development
  if (
    keyLower.includes('software') ||
    keyLower.includes('frontend') ||
    keyLower.includes('backend') ||
    keyLower.includes('developer') ||
    keyLower.includes('systems') ||
    keyLower.includes('digital_tech') ||
    keyLower.includes('digital_transformation')
  ) {
    if (lang === 'en') {
      return 'Management Information Systems from Saylor Academy (Grade B / IACET Accredited Provider, USA) and Six Sigma White Belt from CSSC (USA)';
    }
    return 'Sistem Informasi Manajemen dari Saylor Academy (Grade B / Terakreditasi IACET, USA) serta Six Sigma White Belt dari CSSC (USA)';
  }

  // 3. Project Management, PMO & Program Delivery
  if (
    keyLower.includes('pmo') ||
    keyLower.includes('project') ||
    keyLower.includes('program')
  ) {
    if (lang === 'en') {
      return 'Six Sigma White Belt from CSSC (USA) and Operations Management from Saylor Academy (Grade A / IACET Accredited Provider, USA)';
    }
    return 'Six Sigma White Belt dari CSSC (USA) serta Operations Management dari Saylor Academy (Grade A / Terakreditasi IACET, USA)';
  }

  // 4. Marketing, Branding, PR & Digital Growth
  if (
    keyLower.includes('marketing') ||
    keyLower.includes('marcom') ||
    keyLower.includes('brand') ||
    keyLower.includes('media') ||
    keyLower.includes('content')
  ) {
    if (lang === 'en') {
      return 'Google Ads Search Certification and Google Analytics 4 (GA4) from Google Digital Academy';
    }
    return 'Google Ads Search Certification serta Google Analytics 4 (GA4) dari Google Digital Academy';
  }

  // 5. Supply Chain, Logistics, Warehouse & Procurement
  if (
    keyLower.includes('logistics') ||
    keyLower.includes('warehouse') ||
    keyLower.includes('procurement') ||
    keyLower.includes('supply') ||
    keyLower.includes('ppic')
  ) {
    if (lang === 'en') {
      return 'Operations Management from Saylor Academy (Grade A / IACET Accredited Provider, USA) and Six Sigma White Belt from CSSC (USA)';
    }
    return 'Operations Management dari Saylor Academy (Grade A / Terakreditasi IACET, USA) serta Six Sigma White Belt dari CSSC (USA)';
  }

  // 6. Finance, Accounting & Cost Control
  if (
    keyLower.includes('finance') ||
    keyLower.includes('accounting') ||
    keyLower.includes('tax') ||
    keyLower.includes('billing') ||
    keyLower.includes('audit')
  ) {
    if (lang === 'en') {
      return 'Operations Management from Saylor Academy (Grade A / IACET Accredited Provider, USA) and Six Sigma White Belt from CSSC (USA)';
    }
    return 'Operations Management dari Saylor Academy (Grade A / Terakreditasi IACET, USA) serta Six Sigma White Belt dari CSSC (USA)';
  }

  // 7. B2B Sales, Business Development & Key Account
  if (
    keyLower.includes('sales') ||
    keyLower.includes('business_development') ||
    keyLower.includes('account') ||
    keyLower.includes('partner')
  ) {
    if (lang === 'en') {
      return 'Google Analytics 4 (GA4) from Google Digital Academy and Six Sigma White Belt from CSSC (USA)';
    }
    return 'Google Analytics 4 (GA4) dari Google Digital Academy serta Six Sigma White Belt dari CSSC (USA)';
  }

  // 8. Administration, Secretariat & General Affairs (Non-HR)
  if (
    keyLower.includes('admin') ||
    keyLower.includes('secretary') ||
    keyLower.includes('general_affairs') ||
    keyLower.includes('office') ||
    keyLower.includes('hospital') ||
    keyLower.includes('data_entry') ||
    keyLower.includes('legal')
  ) {
    if (lang === 'en') {
      return 'Operations Management from Saylor Academy (Grade A / IACET Accredited Provider, USA) and Six Sigma White Belt from CSSC (USA)';
    }
    return 'Operations Management dari Saylor Academy (Grade A / Terakreditasi IACET, USA) serta Six Sigma White Belt dari CSSC (USA)';
  }

  // 9. Strategic Consulting & General Leadership (Default / Optimal / All / Executive)
  if (lang === 'en') {
    return 'Human Resources from MarkPlus Institute (Grade A / Outstanding) and Six Sigma White Belt from CSSC (USA)';
  }
  return 'Human Resources dari MarkPlus Institute (Grade A / Predikat Outstanding) serta Six Sigma White Belt dari CSSC (USA)';
}

/**
 * Generate Tailored Application Draft (Matching User's Specified Standard Structure)
 * Strictly separates Experience and Certification into 2 distinct paragraphs.
 */
export function generateTailoredApplicationDraft(params: {
  companyName: string;
  jobTitle: string;
  recipientEmail: string;
  keyRequirements?: string[];
  tone?: EmailTone;
  language?: EmailLanguage;
  presetKey?: string;
}): { emailSubject: string; emailBody: string; autoMatchedPresetKey: string } {
  const {
    companyName = '',
    jobTitle = 'Posisi Terkait',
    language = 'id',
    presetKey,
  } = params;

  const rawCompany = (companyName || '').trim();
  const hasRealCompany = !!rawCompany && rawCompany.toLowerCase() !== 'perusahaan' && rawCompany.toLowerCase() !== 'company' && rawCompany.toLowerCase() !== 'hiring company';
  const cleanCompany = hasRealCompany ? rawCompany : '';

  const cleanTitle = (jobTitle || '').trim() || (language === 'en' ? 'Target Position' : 'Posisi Terkait');
  const matchedPreset = matchPresetFromJobTitle(cleanTitle);
  const activePresetKey = presetKey || matchedPreset.key;

  const experienceDetails = getTailoredExperienceDetails(activePresetKey, language);
  const bulletsFormatted = experienceDetails.bullets.map((b) => `• ${b}`).join('\n');
  const certificationDesc = getTailoredCertificationSummary(activePresetKey, language);

  if (language === 'en') {
    const subject = cleanCompany
      ? `Job Application: ${cleanTitle} - ${cleanCompany} - ${APPLICANT_DATA.fullName}`
      : `Job Application: ${cleanTitle} - ${APPLICANT_DATA.fullName}`;

    const greeting = cleanCompany ? `Dear Recruitment Team at ${cleanCompany},` : 'Dear Recruitment Team,';
    const applyTarget = cleanCompany ? `for the ${cleanTitle} position at ${cleanCompany}` : `for the ${cleanTitle} position`;
    const contributeTarget = cleanCompany ? `to ${cleanCompany}` : 'to the organization';

    const body = `${greeting}

My name is ${APPLICANT_DATA.fullName}. I am writing to formally submit my application ${applyTarget}.

I bring a solid professional background with ${experienceDetails.intro}, such as:
${bulletsFormatted}
Through these experiences, I have developed a structured, proactive approach and am eager to contribute effectively ${contributeTarget}.

To further substantiate my expertise, I hold official certifications in ${certificationDesc} that directly complement this role's requirements.

For your consideration, I have attached my CV and required supporting documents.

Thank you for your time and consideration. I look forward to the opportunity to discuss my qualifications further in the next selection process.

Warm regards,
${APPLICANT_DATA.fullName}
${APPLICANT_DATA.phone}`;

    return { emailSubject: subject, emailBody: body, autoMatchedPresetKey: activePresetKey };
  }

  // Indonesian Draft (Bulleted Experience & Separate Certification Paragraph)
  const subject = cleanCompany
    ? `Lamaran Pekerjaan: ${cleanTitle} - ${cleanCompany} - ${APPLICANT_DATA.fullName}`
    : `Lamaran Pekerjaan: ${cleanTitle} - ${APPLICANT_DATA.fullName}`;

  const greeting = cleanCompany ? `Yth. Tim Recruitment ${cleanCompany},` : 'Yth. Tim Recruitment / HRD,';
  const applyTarget = cleanCompany ? `untuk posisi ${cleanTitle} di ${cleanCompany}` : `untuk posisi ${cleanTitle}`;
  const contributeTarget = cleanCompany ? `bersama ${cleanCompany}` : 'secara optimal';

  const body = `${greeting}

Perkenalkan, saya ${APPLICANT_DATA.fullName}. Saya bermaksud mengajukan lamaran ${applyTarget}.

Saya memiliki latar belakang dan pengalaman kerja dalam ${experienceDetails.intro}, seperti:
${bulletsFormatted}
Dengan pengalaman tersebut, saya terbiasa bekerja secara terstruktur, proaktif, dan siap berkontribusi ${contributeTarget}.

Sebagai penguatan kompetensi, saya memiliki sertifikasi ${certificationDesc} yang relevan dalam menunjang keberhasilan peran ini.

Sebagai bahan pertimbangan, saya melampirkan CV dan dokumen pendukung yang diperlukan.

Terima kasih atas waktu dan perhatiannya. Saya berharap dapat memperoleh kesempatan untuk mengikuti proses seleksi lebih lanjut.

Hormat saya,
${APPLICANT_DATA.fullName}
${APPLICANT_DATA.phone}`;

  return { emailSubject: subject, emailBody: body, autoMatchedPresetKey: activePresetKey };
}

/**
 * Strict Heuristic OCR Parser with Entity Disambiguation
 */
export function parseJobTextHeuristically(rawText: string, filename?: string, language?: EmailLanguage): JobScanResult {
  const text = rawText || '';
  const detectedLang = language || detectLanguageFromText(text);
  const activeLanguage = detectedLang;
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

  // 1. Extract Email with OCR error correction
  const detectedEmail = extractEmailStrict(text);

  // 2. Extract Phone / WhatsApp
  const detectedPhone = extractPhoneStrict(text);

  // 3. Extract Subject Format Notice
  const detectedSubjectNotice = extractSubjectFormatNotice(lines);

  // 4. Extract Company Name with strict entity validation
  const detectedCompany = extractCompanyNameStrict(lines, detectedEmail);

  // 5. Extract Job Title / Position with strict role detection
  const detectedRole = extractJobPositionStrict(lines, filename, activeLanguage);

  // 6. Extract Key Requirements
  const keyRequirements: string[] = [];
  let reqSection = false;
  for (const line of lines) {
    if (/(?:kualifikasi|persyaratan|requirements|kriteria|job\s*description|tanggung\s*jawab)/i.test(line)) {
      reqSection = true;
      continue;
    }
    if (reqSection) {
      if (/(?:kirim|send|email|kontak|contact|hubungi|apply|deadline|lokasi|penempatan)/i.test(line)) {
        reqSection = false;
      } else if (line.length > 5 && line.length < 80) {
        keyRequirements.push(line.replace(/^[-•*–\d\.\)]\s*/, ''));
        if (keyRequirements.length >= 4) break;
      }
    }
  }

  if (keyRequirements.length === 0) {
    keyRequirements.push(
      activeLanguage === 'en' ? 'Operational management & SOP governance' : 'Manajemen operasional & standardisasi SOP',
      activeLanguage === 'en' ? 'Cross-functional team coordination' : 'Koordinasi tim lintas divisi bisnis',
      activeLanguage === 'en' ? 'Process efficiency & digital automation' : 'Efisiensi proses kerja & otomatisasi sistem'
    );
  }

  // Construct Final Subject
  let customSubject = '';
  if (detectedSubjectNotice) {
    customSubject = detectedSubjectNotice
      .replace(/\[posisi\]|\[position\]|\[job title\]/gi, detectedRole)
      .replace(/\[nama\]|\[name\]|\[nama pelamar\]/gi, APPLICANT_DATA.fullName)
      .replace(/\[perusahaan\]|\[company\]/gi, detectedCompany);
  } else {
    customSubject = activeLanguage === 'en'
      ? `Job Application: ${detectedRole} - ${detectedCompany} - ${APPLICANT_DATA.fullName}`
      : `Lamaran Pekerjaan: ${detectedRole} - ${detectedCompany} - ${APPLICANT_DATA.fullName}`;
  }

  const { emailBody } = generateTailoredApplicationDraft({
    companyName: detectedCompany,
    jobTitle: detectedRole,
    recipientEmail: detectedEmail || 'recruitment@perusahaan.com',
    keyRequirements,
    tone: 'concise',
    language: activeLanguage,
  });

  return {
    companyName: detectedCompany,
    jobTitle: detectedRole,
    recipientEmail: detectedEmail || '',
    recipientPhone: detectedPhone,
    formatSubjectNotice: detectedSubjectNotice,
    keyRequirements,
    emailSubject: customSubject,
    emailBody,
    language: activeLanguage,
    rawExtractedText: rawText,
    notes: activeLanguage === 'en'
      ? 'Extracted and verified via strict entity disambiguation engine.'
      : 'Berhasil diekstrak dan diseleksi secara ketat melalui mesin analisis entitas cerdas.',
    isAi: false,
    isFallback: true,
  };
}

export function createFallbackJobScan(filename?: string, language: EmailLanguage = 'id'): JobScanResult {
  const detectedRole = extractJobPositionStrict([], filename, language);
  const detectedCompany = language === 'en' ? 'Hiring Company' : 'Perusahaan';

  const keyRequirements = language === 'en'
    ? ['Operational efficiency & workflow design', 'Team leadership & cross-functional coordination', 'SOP implementation & problem solving']
    : ['Efisiensi operasional & standardisasi SOP', 'Koordinasi tim lintas divisi bisnis', 'Orientasi pada data & perbaikan proses'];

  const { emailSubject, emailBody } = generateTailoredApplicationDraft({
    companyName: detectedCompany,
    jobTitle: detectedRole,
    recipientEmail: '',
    keyRequirements,
    tone: 'concise',
    language,
  });

  return {
    companyName: detectedCompany,
    jobTitle: detectedRole,
    recipientEmail: '',
    recipientPhone: '',
    keyRequirements,
    emailSubject,
    emailBody,
    language,
    notes: language === 'en'
      ? 'Preset for Alvareza Hilka Pratama with verified credentials.'
      : 'Draf siap kirim tersusun otomatis untuk Alvareza Hilka Pratama.',
    isAi: false,
    isFallback: true,
  };
}

export function createMailtoUrl(recipientEmail: string, subject: string, body: string, ccEmail?: string): string {
  const cleanEmail = (recipientEmail || '').trim();
  const encodedSubject = encodeURIComponent(subject || '');
  const encodedBody = encodeURIComponent(body || '');
  let url = `mailto:${cleanEmail}?subject=${encodedSubject}&body=${encodedBody}`;
  if (ccEmail && ccEmail.trim().length > 0) {
    url += `&cc=${encodeURIComponent(ccEmail.trim())}`;
  }
  return url;
}
