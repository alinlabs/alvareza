import { EmailLanguage, EmailTone } from '../../types/jobApplication';
import { matchPresetFromJobTitle } from '../../data/preset/RoleConfig';
import { APPLICANT_DATA } from './applicantData';

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
        'Formulation of 20+ standardized administrative SOPs and digital records cutting document processing lead time by 90%.',
        'Cross-departmental operational support, executive schedule coordination, and seamless office workflow management.'
      ];
    }
    return [
      'Tata kelola administrasi kantor, korespondensi resmi pimpinan, dan kearsipan digital dokumen legal dengan presisi tinggi.',
      'Perancangan 20+ SOP kerja administratif baru dan rekap digital yang memangkas 90% waktu pemrosesan dokumen.',
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
        'Technical problem solving with high code quality, optimal application performance, and 95% SLA execution.'
      ];
    }
    return [
      'Perancangan dan pembangunan 50+ aplikasi sistem digital/ERP kustom berbasis web untuk efisiensi operasional bisnis.',
      'Pengelolaan database prospek B2B CRM (4.000+ kontak) dan otomatisasi alur data antar departemen.',
      'Penyelesaian masalah teknis dengan standar kualitas tinggi, performa sistem optimal, serta eksekusi SLA 95%.'
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
        'Supply chain SLA execution (95%) eliminating stock discrepancies and operational bottlenecks by 90%.'
      ];
    }
    return [
      'Pengawasan alur persediaan stok gudang (metode FIFO), akurasi fisik stok, dan efisiensi penyimpanan.',
      'Koordinasi armada distribusi rantai pasok, negosiasi dengan vendor/pemasok, dan perancangan jadwal PPIC.',
      'Eksekusi pengiriman barang dengan pemenuhan SLA 95% dan pencegahan hambatan operasional hingga 90%.'
    ];
  }

  // 8. Default fallback
  if (lang === 'en') {
    return [
      'Supervised 13 retail branches and coordinated cross-functional execution across 6 divisions (98% CSAT, 95% SLA).',
      'Formulated standardized SOPs and continuous improvement frameworks, eliminating 90% of workflow bottlenecks.',
      'Engineered 50+ custom digital systems and business ERP tools for inventory and CRM operations.'
    ];
  }
  return [
    'Supervisi operasional 13 gerai ritel dan koordinasi lintas 6 divisi bisnis (CSAT 98%, SLA 95%).',
    'Standardisasi 20+ SOP kerja baru yang berhasil memangkas 90% hambatan operasional tim.',
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
export function getTailoredExperienceDetails(
  presetKey: string,
  lang: EmailLanguage = 'id',
  jobTitle?: string
): TailoredExperienceInfo {
  const keyLower = (presetKey || '').toLowerCase();
  const titleLower = (jobTitle || '').toLowerCase();
  const combined = `${keyLower} ${titleLower}`;

  // 1. HR, Talent, Recruitment & People Operations
  if (
    combined.includes('hr') ||
    combined.includes('talent') ||
    combined.includes('recruitment') ||
    combined.includes('rekrutmen') ||
    combined.includes('people') ||
    combined.includes('payroll') ||
    combined.includes('compensation') ||
    combined.includes('comben') ||
    combined.includes('industrial') ||
    combined.includes('personalia') ||
    combined.includes('sdm') ||
    combined.includes('employer_branding')
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

  // 2. Legal, Compliance & Contract Administration
  if (
    combined.includes('legal') ||
    combined.includes('hukum') ||
    combined.includes('compliance') ||
    combined.includes('perizinan') ||
    combined.includes('contract')
  ) {
    if (lang === 'en') {
      return {
        intro: 'practical experience in legal administration, contract verification & regulatory compliance',
        bullets: [
          'Validation and drafting of commercial contracts for 100+ projects and handover minutes (BAST)',
          'Corporate permits, digital legal document archiving, and official executive correspondence',
          'Administrative regulatory risk mitigation and high standards of legal governance',
        ],
      };
    }
    return {
      intro: 'pengalaman kerja dalam administrasi legalitas, verifikasi kontrak & kepatuhan perizinan',
      bullets: [
        'Verifikasi keabsahan dokumen kontrak kerja sama 100+ proyek dan Berita Acara Serah Terima (BAST)',
        'Standardisasi tata kelola arsip hukum, perizinan korporat & korespondensi legal eksekutif',
        'Pengawasan kepatuhan regulasi dan manajemen risiko administratif bisnis secara disiplin',
      ],
    };
  }

  // 3. Customer Service, CX & Client Relations
  if (
    combined.includes('customer_service') ||
    combined.includes('client_service') ||
    combined.includes('layanan pelanggan') ||
    combined.includes('call center') ||
    combined.includes('helpdesk') ||
    combined.includes('customer care') ||
    combined.includes('cx')
  ) {
    if (lang === 'en') {
      return {
        intro: 'proven track record in customer service operations, client satisfaction & support workflows',
        bullets: [
          'Multi-channel customer communication handling maintaining high satisfaction (98% CSAT)',
          'Structured problem resolution, complaint management, and rapid coordination escalation',
          'Service ticketing documentation, SLA compliance (95%), and workflow quality improvement',
        ],
      };
    }
    return {
      intro: 'rekam jejak dalam operasional layanan pelanggan (Customer Service) & kepuasan klien',
      bullets: [
        'Penanganan komunikasi pelanggan multi-saluran dengan tingkat kepuasan layanan 98% CSAT',
        'Penyelesaian keluhan/kendala pelanggan secara terstruktur dan eskalasi koordinasi cepat',
        'Dokumentasi tiket layanan, kepatuhan SLA 95%, dan perbaikan berkelanjutan kualitas interaksi',
      ],
    };
  }

  // 4. Retail, Store & Field Branch Operations
  if (
    combined.includes('retail') ||
    combined.includes('store') ||
    combined.includes('toko') ||
    combined.includes('gerai') ||
    combined.includes('outlet') ||
    combined.includes('cabang') ||
    combined.includes('field_operations')
  ) {
    if (lang === 'en') {
      return {
        intro: 'proven background in retail store operations, branch management & multi-outlet supervision',
        bullets: [
          'Operational supervision across 13 retail branches ensuring 95% SLA and 98% CSAT',
          'Standardization of 20+ store service SOPs, cashier procedures & branch audit compliance',
          'Stock turnover coordination, store visual display & loss prevention governance',
        ],
      };
    }
    return {
      intro: 'pengalaman kerja dalam manajemen operasional ritel, tata kelola cabang & kepemimpinan toko',
      bullets: [
        'Supervisi operasional 13 gerai ritel dengan kepatuhan SLA 95% dan kepuasan pelanggan CSAT 98%',
        'Standardisasi 20+ SOP pelayanan gerai, manajemen kasir & kepatuhan audit cabang',
        'Koordinasi perputaran stok barang, display gerai & tata kelola pencegahan kehilangan (loss prevention)',
      ],
    };
  }

  // 5. Administration, Secretariat, Office & General Affairs
  if (
    combined.includes('admin') ||
    combined.includes('secretary') ||
    combined.includes('sekretaris') ||
    combined.includes('executive_assistant') ||
    combined.includes('general_affairs') ||
    combined.includes('office') ||
    combined.includes('tata usaha') ||
    combined.includes('hospital') ||
    combined.includes('klinik') ||
    combined.includes('data_entry')
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

  // 6. Project Management, PMO & Program Delivery
  if (
    combined.includes('pmo') ||
    combined.includes('project') ||
    combined.includes('proyek') ||
    combined.includes('program') ||
    combined.includes('scrum')
  ) {
    if (lang === 'en') {
      return {
        intro: 'a proven track record in Project Management & Program Delivery (PMO)',
        bullets: [
          'Execution & monitoring of 100+ cross-functional projects with 95% SLA compliance',
          'Timeline governance, resource allocation & operational risk mitigation',
          'Continuous workflow improvement and business process optimization',
        ],
      };
    }
    return {
      intro: 'rekam jejak dalam manajemen proyek & Project Management Office (PMO)',
      bullets: [
        'Eksekusi & monitoring 100+ proyek lintas divisi dengan pemenuhan SLA 95%',
        'Tata kelola timeline, alokasi sumber daya & manajemen risiko operasional',
        'Continuous improvement alur kerja dan optimalisasi proses bisnis',
      ],
    };
  }

  // 7. B2B Sales, Key Account & Business Development
  if (
    combined.includes('sales') ||
    combined.includes('business_development') ||
    combined.includes('account') ||
    combined.includes('penjualan') ||
    combined.includes('bisnis') ||
    combined.includes('partner')
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

  // 8. Supply Chain, Logistics, Warehouse & Procurement
  if (
    combined.includes('logistics') ||
    combined.includes('logistik') ||
    combined.includes('warehouse') ||
    combined.includes('gudang') ||
    combined.includes('procurement') ||
    combined.includes('purchasing') ||
    combined.includes('pengadaan') ||
    combined.includes('supply') ||
    combined.includes('ppic')
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

  // 9. Tech, Software & Digital Systems Development
  if (
    combined.includes('software') ||
    combined.includes('frontend') ||
    combined.includes('backend') ||
    combined.includes('developer') ||
    combined.includes('programmer') ||
    combined.includes('systems') ||
    combined.includes('digital_tech') ||
    combined.includes('digital_transformation') ||
    combined.includes('it') ||
    combined.includes('teknik informatika') ||
    combined.includes('engineer')
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

  // 10. Finance, Accounting & Cost Control
  if (
    combined.includes('finance') ||
    combined.includes('accounting') ||
    combined.includes('akuntansi') ||
    combined.includes('keuangan') ||
    combined.includes('tax') ||
    combined.includes('pajak') ||
    combined.includes('billing') ||
    combined.includes('kasir') ||
    combined.includes('audit')
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

  // 11. Marketing, Branding & PR
  if (
    combined.includes('marketing') ||
    combined.includes('marcom') ||
    combined.includes('brand') ||
    combined.includes('media') ||
    combined.includes('content') ||
    combined.includes('digital marketing') ||
    combined.includes('pemasaran') ||
    combined.includes('humas') ||
    combined.includes('pr')
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

  // 12. General Operations & Management (Default / Optimal / All / Executive)
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
export function getTailoredExperienceSummary(
  presetKey: string,
  lang: EmailLanguage = 'id',
  jobTitle?: string
): string {
  const details = getTailoredExperienceDetails(presetKey, lang, jobTitle);
  return `${details.intro} (${details.bullets.join(', ')})`;
}

/**
 * Dynamic candidate certification summary tailored to the active CV preset category (No numeric scores, Grade & IACET USA inclusion)
 * STRICTLY aligns with the candidate's actual certifications in the CV data without cross-field contamination.
 */
export function getTailoredCertificationSummary(
  presetKey: string,
  lang: EmailLanguage = 'id',
  jobTitle?: string
): string {
  const keyLower = (presetKey || '').toLowerCase();
  const titleLower = (jobTitle || '').toLowerCase();
  const combined = `${keyLower} ${titleLower}`;

  // 1. HR & People Management Specific
  if (
    combined.includes('hr') ||
    combined.includes('talent') ||
    combined.includes('recruitment') ||
    combined.includes('rekrutmen') ||
    combined.includes('people') ||
    combined.includes('payroll') ||
    combined.includes('personalia') ||
    combined.includes('sdm') ||
    combined.includes('employer_branding')
  ) {
    if (lang === 'en') {
      return 'Human Resources from MarkPlus Institute (Grade A / Outstanding) and Human Resource Management from Saylor Academy (Grade A / IACET Accredited Provider, USA)';
    }
    return 'Human Resources dari MarkPlus Institute (Grade A / Predikat Outstanding) serta Human Resource Management dari Saylor Academy (Grade A / Terakreditasi IACET, USA)';
  }

  // 2. Tech, Software & Systems Development
  if (
    combined.includes('software') ||
    combined.includes('frontend') ||
    combined.includes('backend') ||
    combined.includes('developer') ||
    combined.includes('programmer') ||
    combined.includes('systems') ||
    combined.includes('digital_tech') ||
    combined.includes('digital_transformation') ||
    combined.includes('it') ||
    combined.includes('teknik informatika') ||
    combined.includes('engineer')
  ) {
    if (lang === 'en') {
      return 'Management Information Systems from Saylor Academy (Grade B / IACET Accredited Provider, USA) and Six Sigma White Belt from CSSC (USA)';
    }
    return 'Sistem Informasi Manajemen dari Saylor Academy (Grade B / Terakreditasi IACET, USA) serta Six Sigma White Belt dari CSSC (USA)';
  }

  // 3. Project Management, PMO & Program Delivery
  if (
    combined.includes('pmo') ||
    combined.includes('project') ||
    combined.includes('proyek') ||
    combined.includes('program') ||
    combined.includes('scrum')
  ) {
    if (lang === 'en') {
      return 'Six Sigma White Belt from CSSC (USA) and Operations Management from Saylor Academy (Grade A / IACET Accredited Provider, USA)';
    }
    return 'Six Sigma White Belt dari CSSC (USA) serta Operations Management dari Saylor Academy (Grade A / Terakreditasi IACET, USA)';
  }

  // 4. Marketing, Branding, PR & Digital Growth
  if (
    combined.includes('marketing') ||
    combined.includes('marcom') ||
    combined.includes('brand') ||
    combined.includes('media') ||
    combined.includes('content') ||
    combined.includes('digital marketing') ||
    combined.includes('pemasaran')
  ) {
    if (lang === 'en') {
      return 'Google Ads Search Certification and Google Analytics 4 (GA4) from Google Digital Academy';
    }
    return 'Google Ads Search Certification serta Google Analytics 4 (GA4) dari Google Digital Academy';
  }

  // 5. Supply Chain, Logistics, Warehouse & Procurement
  if (
    combined.includes('logistics') ||
    combined.includes('logistik') ||
    combined.includes('warehouse') ||
    combined.includes('gudang') ||
    combined.includes('procurement') ||
    combined.includes('purchasing') ||
    combined.includes('supply') ||
    combined.includes('ppic')
  ) {
    if (lang === 'en') {
      return 'Operations Management from Saylor Academy (Grade A / IACET Accredited Provider, USA) and Six Sigma White Belt from CSSC (USA)';
    }
    return 'Operations Management dari Saylor Academy (Grade A / Terakreditasi IACET, USA) serta Six Sigma White Belt dari CSSC (USA)';
  }

  // 6. Finance, Accounting & Cost Control
  if (
    combined.includes('finance') ||
    combined.includes('accounting') ||
    combined.includes('akuntansi') ||
    combined.includes('keuangan') ||
    combined.includes('tax') ||
    combined.includes('pajak') ||
    combined.includes('billing') ||
    combined.includes('audit')
  ) {
    if (lang === 'en') {
      return 'Operations Management from Saylor Academy (Grade A / IACET Accredited Provider, USA) and Six Sigma White Belt from CSSC (USA)';
    }
    return 'Operations Management dari Saylor Academy (Grade A / Terakreditasi IACET, USA) serta Six Sigma White Belt dari CSSC (USA)';
  }

  // 7. B2B Sales, Business Development & Key Account
  if (
    combined.includes('sales') ||
    combined.includes('business_development') ||
    combined.includes('account') ||
    combined.includes('penjualan') ||
    combined.includes('partner')
  ) {
    if (lang === 'en') {
      return 'Google Analytics 4 (GA4) from Google Digital Academy and Six Sigma White Belt from CSSC (USA)';
    }
    return 'Google Analytics 4 (GA4) dari Google Digital Academy serta Six Sigma White Belt dari CSSC (USA)';
  }

  // 8. Administration, Secretariat & General Affairs (Non-HR)
  if (
    combined.includes('admin') ||
    combined.includes('secretary') ||
    combined.includes('sekretaris') ||
    combined.includes('general_affairs') ||
    combined.includes('office') ||
    combined.includes('hospital') ||
    combined.includes('data_entry') ||
    combined.includes('legal')
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
    jobTitle = '',
    language = 'id',
    presetKey,
  } = params;

  const rawCompany = (companyName || '').trim();
  const hasCompany =
    !!rawCompany &&
    !/^(perusahaan|company|hiring company|organisasi|organization)$/i.test(rawCompany);
  const cleanCompany = hasCompany ? rawCompany : '';

  const rawTitle = (jobTitle || '').trim();
  const hasJobTitle =
    !!rawTitle &&
    !/^(posisi terkait|target position|posisi yang dilamar|posisi|jabatan|role)$/i.test(rawTitle);
  const cleanTitle = hasJobTitle ? rawTitle : '';

  const matchedPreset = cleanTitle ? matchPresetFromJobTitle(cleanTitle) : null;
  const activePresetKey = presetKey || (matchedPreset && matchedPreset.key ? matchedPreset.key : 'optimal');

  const experienceDetails = getTailoredExperienceDetails(activePresetKey, language, cleanTitle || undefined);
  const bulletsFormatted = experienceDetails.bullets.map((b) => `• ${b}`).join('\n');
  const certificationDesc = getTailoredCertificationSummary(activePresetKey, language, cleanTitle || undefined);

  if (language === 'en') {
    // English Subject
    let subject = '';
    if (hasJobTitle && hasCompany) {
      subject = `Job Application: ${cleanTitle} - ${cleanCompany} - ${APPLICANT_DATA.fullName}`;
    } else if (hasCompany) {
      subject = `Job Application - ${cleanCompany} - ${APPLICANT_DATA.fullName}`;
    } else if (hasJobTitle) {
      subject = `Job Application: ${cleanTitle} - ${APPLICANT_DATA.fullName}`;
    } else {
      subject = `Job Application - ${APPLICANT_DATA.fullName}`;
    }

    // English Greeting
    const greeting = hasCompany
      ? `Dear Recruitment Team at ${cleanCompany},`
      : 'Dear Recruitment Team / Hiring Manager,';

    // English Intro & Targets
    let introSentence = '';
    let contributeTarget = '';

    if (hasJobTitle && hasCompany) {
      introSentence = `My name is ${APPLICANT_DATA.fullName}. I am writing to formally submit my application for the ${cleanTitle} position at ${cleanCompany}.`;
      contributeTarget = `to ${cleanCompany}`;
    } else if (hasCompany) {
      introSentence = `My name is ${APPLICANT_DATA.fullName}. I am writing to express my keen interest and submit my job application to explore suitable career opportunities at ${cleanCompany} that align with my qualifications and professional background.`;
      contributeTarget = `to ${cleanCompany}`;
    } else if (hasJobTitle) {
      introSentence = `My name is ${APPLICANT_DATA.fullName}. I am writing to formally submit my application for the ${cleanTitle} position.`;
      contributeTarget = 'to the organization';
    } else {
      introSentence = `My name is ${APPLICANT_DATA.fullName}. I am writing to express my interest and submit my job application for opportunities that align with my professional background and qualifications.`;
      contributeTarget = 'to the organization';
    }

    const body = `${greeting}

${introSentence}

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
  let subject = '';
  if (hasJobTitle && hasCompany) {
    subject = `Lamaran Pekerjaan: ${cleanTitle} - ${cleanCompany} - ${APPLICANT_DATA.fullName}`;
  } else if (hasCompany) {
    subject = `Lamaran Pekerjaan - ${cleanCompany} - ${APPLICANT_DATA.fullName}`;
  } else if (hasJobTitle) {
    subject = `Lamaran Pekerjaan: ${cleanTitle} - ${APPLICANT_DATA.fullName}`;
  } else {
    subject = `Lamaran Pekerjaan - ${APPLICANT_DATA.fullName}`;
  }

  const greeting = hasCompany
    ? `Yth. Tim Rekrutmen / HRD ${cleanCompany},`
    : 'Yth. Tim Rekrutmen / HRD,';

  let introSentence = '';
  let contributeTarget = '';

  if (hasJobTitle && hasCompany) {
    introSentence = `Perkenalkan, saya ${APPLICANT_DATA.fullName}. Saya bermaksud mengajukan lamaran pekerjaan untuk posisi ${cleanTitle} di ${cleanCompany}.`;
    contributeTarget = `bersama ${cleanCompany}`;
  } else if (hasCompany) {
    introSentence = `Perkenalkan, saya ${APPLICANT_DATA.fullName}. Melalui email ini, saya bermaksud mengajukan lamaran pekerjaan untuk bergabung dan berkarier di ${cleanCompany} pada posisi yang relevan dengan kualifikasi dan pengalaman profesional saya.`;
    contributeTarget = `bersama ${cleanCompany}`;
  } else if (hasJobTitle) {
    introSentence = `Perkenalkan, saya ${APPLICANT_DATA.fullName}. Saya bermaksud mengajukan lamaran pekerjaan untuk posisi ${cleanTitle}.`;
    contributeTarget = 'secara optimal bagi kemajuan tim kerja';
  } else {
    introSentence = `Perkenalkan, saya ${APPLICANT_DATA.fullName}. Melalui email ini, saya bermaksud mengajukan lamaran pekerjaan untuk posisi yang relevan dengan latar belakang dan kompetensi profesional saya.`;
    contributeTarget = 'secara optimal bagi kemajuan organisasi';
  }

  const body = `${greeting}

${introSentence}

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
