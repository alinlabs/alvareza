import { PresetMatchingRule } from './types';

export const operationsRetailRules: PresetMatchingRule[] = [
  {
    key: 'business_operations',
    code: 'OPS',
    exactPhrases: [
      'operations manager', 'manajer operasional', 'business operations', 'business operations manager', 'head of operations',
      'kepala operasional', 'operations lead', 'operations supervisor', 'spv operasional', 'operations officer',
      'ops manager', 'bizops', 'business operations lead', 'vp operations', 'vice president operations',
      'general manager operasional', 'coo', 'chief operating officer', 'operations coordinator', 'koordinator operasional',
      'asisten manajer operasional', 'assistant operations manager', 'staf operasional bisnis', 'business ops specialist', 'operational governance manager',
      'head of business operations', 'operations strategy manager', 'senior operations manager', 'director of operations', 'direktur operasional',
      'corporate operations manager', 'manajer operasional perusahaan', 'operations management trainee', 'lead business operations', 'manajemen operasional'
    ],
    strongKeywords: [
      'operations manager', 'business operations', 'manajer operasional', 'head of operations', 'coo',
      'chief operating officer', 'operations lead', 'ops manager', 'bizops', 'koordinator operasional',
      'tata kelola operasional'
    ],
    secondaryKeywords: [
      'sop', 'efisiensi', 'proses bisnis', 'kpi divisi', 'cross functional',
      'koordinasi 6 divisi', 'restrukturisasi proses', 'operasional harian', 'sla operasional'
    ],
    negativeKeywords: [
      'sales counter', 'teller', 'kasir toko', 'waiter', 'bartender',
      'driver', 'satpam', 'hr ops', 'people ops', 'people operations',
      'hr operations', 'manajer hr'
    ]
  },
  {
    key: 'branch_manager',
    code: 'BRN',
    exactPhrases: [
      'branch manager', 'kepala cabang', 'pimpinan cabang', 'kacab', 'wakil kepala cabang',
      'deputy branch manager', 'branch operations manager', 'manajer cabang', 'area manager', 'manajer area',
      'area operations manager', 'regional manager', 'manajer regional', 'kepala kantor cabang', 'pincab',
      'sub branch manager', 'kepala kcp', 'branch supervisor', 'spv cabang', 'multi unit manager',
      'multi unit operations', 'multi-unit operations manager', 'area coordinator cabang', 'regional operations lead', 'head of regional branch',
      'branch business manager', 'manajer operasional cabang', 'lead area manager', 'district manager cabang', 'territory manager retail',
      'pengelola cabang'
    ],
    strongKeywords: [
      'branch manager', 'kepala cabang', 'pimpinan cabang', 'kacab', 'pincab',
      'area manager', 'regional manager', 'manajer cabang', 'multi unit manager', 'branch operations'
    ],
    secondaryKeywords: [
      'p&l cabang', 'target cabang', 'omzet cabang', 'gerai ritel', '13 gerai',
      'supervisi cabang', 'audit cabang', 'layanan pelanggan cabang', 'operasional cabang'
    ],
    negativeKeywords: [
      'it support', 'programmer', 'graphic designer', 'copywriter', 'content creator'
    ]
  },
  {
    key: 'retail_store_operations',
    code: 'RTL',
    exactPhrases: [
      'store manager', 'kepala toko', 'store supervisor', 'spv toko', 'retail store manager',
      'manajer toko ritel', 'retail supervisor', 'asisten kepala toko', 'asst store manager', 'assistant store manager',
      'store leader', 'kepala gerai', 'store head', 'retail operations', 'retail operations supervisor',
      'supervisor ritel', 'pengelola toko', 'supervisor gerai ritel', 'area store supervisor', 'retail shop manager',
      'store coordinator', 'duty manager store', 'floor manager ritel', 'floor supervisor store', 'staf supervisor toko',
      'manajer butik', 'kepala minimarket', 'kepala supermarket', 'store operations officer', 'staf operasional gerai',
      'merchandiser supervisor', 'visual merchandising lead store', 'retail outlet manager'
    ],
    strongKeywords: [
      'store manager', 'kepala toko', 'store supervisor', 'retail store', 'toko ritel',
      'spv toko', 'kepala gerai', 'merchandising', 'pos kasir', 'manajer toko'
    ],
    secondaryKeywords: [
      'display toko', 'loss prevention', 'stock opname toko', 'omzet toko', 'kasir',
      'pelayanan toko', 'planogram', 'penataan produk', 'target toko ritel'
    ],
    mustIncludeAny: [
      'store', 'toko', 'ritel', 'retail', 'gerai',
      'outlet'
    ]
  },
  {
    key: 'general_affairs',
    code: 'GAF',
    exactPhrases: [
      'general affairs', 'ga', 'ga officer', 'ga supervisor', 'spv ga',
      'ga manager', 'manajer ga', 'head of ga', 'kepala ga', 'general affairs manager',
      'general affairs supervisor', 'general affairs staff', 'staff ga', 'staf ga', 'office manager',
      'workplace operations', 'facility management', 'manajer fasilitas', 'koordinator ga', 'ga and asset coordinator',
      'workplace specialist', 'ga procurement', 'staf umum dan rumah tangga', 'staf rumah tangga kantor', 'perizinan gedung dan fasilitas',
      'ga & building maintenance', 'workplace experience lead', 'building supervisor ga', 'fasilitas dan aset kantor', 'ga asset lead',
      'general affairs and legal officer', 'spv general affairs & fasilitas', 'staf operasional ga'
    ],
    strongKeywords: [
      'general affairs', 'ga officer', 'ga supervisor', 'ga manager', 'facility management',
      'office manager', 'fasilitas kantor', 'aset kantor', 'rumah tangga kantor', 'pemeliharaan gedung'
    ],
    secondaryKeywords: [
      'oss rba', 'lkpm', 'simpel klhk', 'festronik b3', 'simbg pupr',
      'pbg', 'slf', 'aset+', 'p2k3', 'k3 perkantoran',
      'perizinan bangunan', 'vendor katering & cleaning', 'kendaraan dinas'
    ],
    mustIncludeAny: [
      'ga', 'general affairs', 'fasilitas', 'facility', 'workplace',
      'office manager', 'rumah tangga kantor', 'building maintenance'
    ]
  },
  {
    key: 'qa_qc_compliance',
    code: 'QAC',
    exactPhrases: [
      'qa', 'qc', 'qa qc', 'quality assurance', 'quality control',
      'qa supervisor', 'qc supervisor', 'qa manager', 'qc manager', 'quality manager',
      'manajer mutu', 'qa officer', 'qc officer', 'staf qa', 'staf qc',
      'quality inspector', 'inspektur mutu', 'process compliance', 'compliance officer', 'standard & process auditor',
      'auditor sop', 'quality specialist', 'qa qc operations lead', 'operations quality specialist', 'penjamin mutu',
      'pengendali mutu', 'quality compliance specialist', 'sop auditor', 'lead quality auditor', 'qa process lead',
      'qc inspector pabrik', 'qa field inspector', 'staf audit kepatuhan sop', 'quality control lead'
    ],
    strongKeywords: [
      'quality assurance', 'quality control', 'qa qc', 'qa manager', 'qc manager',
      'penjamin mutu', 'pengendali mutu', 'compliance officer', 'process compliance', 'sop auditor',
      'inspektur mutu'
    ],
    secondaryKeywords: [
      'csat 98%', 'audit sop', 'standar mutu', 'iso 9001', 'inspeksi berkala',
      'reject rate', 'zero defect', 'kepatuhan prosedur', 'quality checklist'
    ],
    mustIncludeAny: [
      'qa', 'qc', 'quality', 'mutu', 'compliance',
      'inspektur', 'auditor'
    ]
  },
  {
    key: 'manufacturing_operations',
    code: 'MFG',
    exactPhrases: [
      'plant manager', 'factory manager', 'manajer pabrik', 'production manager', 'manajer produksi',
      'production supervisor', 'spv produksi', 'manufacturing manager', 'manajer manufaktur', 'workshop manager',
      'manajer workshop', 'plant operations lead', 'industrial operations', 'operations manager pabrik', 'kepala bengkel produksi',
      'supervisor pabrik', 'industrial engineering specialist', 'production planner workshop', 'floor manufacturing supervisor', 'manufacturing coordinator',
      'head of production', 'kepala produksi pabrik', 'line production supervisor', 'workshop production lead', 'manajer perakitan',
      'fabrication supervisor', 'assembly plant manager', 'staf operasional manufaktur'
    ],
    strongKeywords: [
      'plant manager', 'factory manager', 'manajer pabrik', 'production manager', 'manajer produksi',
      'manufacturing', 'manufaktur', 'workshop manager', 'lantai produksi', 'lini produksi'
    ],
    secondaryKeywords: [
      'output produksi', 'efisiensi biaya pabrik', 'workshop', 'mesin industri', 'sla 95%',
      'kapasitas produksi', 'downtime mesin', 'keselamatan kerja pabrik'
    ],
    mustIncludeAny: [
      'pabrik', 'factory', 'plant', 'produksi', 'production',
      'manufacturing', 'workshop', 'manufaktur'
    ]
  },
  {
    key: 'field_operations',
    code: 'FLD',
    exactPhrases: [
      'field operations', 'koordinator lapangan', 'field coordinator', 'site supervisor', 'supervisor lapangan',
      'field supervisor', 'field operations coordinator', 'on-site project lead', 'field team manager', 'field service coordinator',
      'maintenance supervisor', 'pengawas lapangan', 'mandor lapangan', 'penanggung jawab lapangan', 'field service supervisor',
      'site operations manager', 'staf teknisi lapangan', 'lead site coordinator', 'field execution lead', 'field officer',
      'koordinator on-site', 'site project coordinator', 'field service specialist', 'field support lead', 'supervisor pekerjaan lapangan'
    ],
    strongKeywords: [
      'field operations', 'koordinator lapangan', 'site supervisor', 'supervisor lapangan', 'pengawas lapangan',
      'field service', 'on-site', 'teknisi lapangan'
    ],
    secondaryKeywords: [
      'lokasi proyek', 'troubleshooting lapangan', 'k3 lapangan', 'inspeksi site', 'koordinasi teknisi',
      'instalasi on-site', 'lapangan kerja'
    ],
    mustIncludeAny: [
      'lapangan', 'field', 'site', 'on-site', 'mandor'
    ]
  },
  {
    key: 'public_utilities_ops',
    code: 'UTL',
    exactPhrases: [
      'utility operations', 'manajer utilitas', 'public utility lead', 'water utility lead', 'operasional utilitas publik',
      'bpspams', 'pengelola bpspams', 'municipal service supervisor', 'community operations specialist', 'public service coordinator',
      'koordinator layanan utilitas', 'manajer pengolahan air bersih', 'water treatment plant supervisor', 'petugas billing utilitas', 'operasional jaringan air bersih',
      'kepala unit utilitas publik', 'utility plant supervisor', 'staf distribusi air minum', 'pengelola sarana air bersih', 'public facilities utility manager'
    ],
    strongKeywords: [
      'utilitas publik', 'public utility', 'water utility', 'bpspams', 'air bersih',
      'layanan masyarakat', 'utility operations', 'pengolahan air'
    ],
    secondaryKeywords: [
      '2.000 pelanggan', 'debit air', 'jaringan distribusi', 'tarif utilitas', 'billing air',
      'koordinasi aparat desa', 'fasilitas umum'
    ],
    mustIncludeAny: [
      'utilitas', 'utility', 'utilities', 'bpspams', 'air bersih',
      'water treatment', 'layanan publik'
    ]
  },
  {
    key: 'operational_excellence',
    code: 'OPX',
    exactPhrases: [
      'operational excellence', 'opex', 'continuous improvement', 'ci manager', 'ci lead',
      'process excellence', 'process excellence manager', 'lean six sigma', 'six sigma white belt', 'six sigma green belt',
      'business process improvement', 'bpi lead', 'process optimization', 'manajer continuous improvement', 'spesialis efisiensi proses',
      'operational excellence specialist', 'kaizen lead', 'lean specialist', 'process improvement analyst', 'lead opex specialist',
      'continuous improvement coordinator', 'business transformation analyst opex', 'process re-engineering lead', 'efficiency optimization specialist'
    ],
    strongKeywords: [
      'operational excellence', 'opex', 'continuous improvement', 'process excellence', 'lean six sigma',
      'six sigma', 'bpi', 'kaizen', 'efisiensi proses', 'business process improvement'
    ],
    secondaryKeywords: [
      'cssc usa', 'white belt', 'eliminasi inefisiensi 90%', 'sop lintas divisi', 'root cause analysis',
      'dmaic', '5s', 'lean methodology', 'value stream mapping'
    ],
    mustIncludeAny: [
      'opex', 'operational excellence', 'continuous improvement', 'six sigma', 'lean',
      'process improvement', 'kaizen'
    ]
  },
  {
    key: 'service_operations_manager',
    code: 'SOM',
    exactPhrases: [
      'service operations manager', 'service delivery manager', 'manajer layanan jasa', 'field service manager', 'technical operations lead',
      'customer service delivery lead', 'operations support lead', 'manajer operasional layanan', 'service support manager', 'after sales operations manager',
      'service network supervisor', 'field technician manager', 'service dispatch manager', 'service operations coordinator', 'head of service operations',
      'lead service delivery', 'technical service operations supervisor', 'layanan teknis lapangan'
    ],
    strongKeywords: [
      'service operations', 'service delivery', 'field service manager', 'layanan jasa', 'technical operations',
      'after sales operations', 'sla pengerjaan'
    ],
    secondaryKeywords: [
      'sla 95%', 'armada teknisi', 'retensi klien 98%', 'instalasi teknis', 'work order jasa',
      'jadwal teknisi', 'service level agreement'
    ],
    mustIncludeAny: [
      'service operations', 'service delivery', 'field service manager', 'layanan jasa', 'after sales'
    ]
  },
  {
    key: 'chief_of_staff',
    code: 'COS',
    exactPhrases: [
      'chief of staff', 'cos', 'business operations associate', 'bizops associate', 'executive operations lead',
      'strategic operations associate', 'corporate operations coordinator', 'chief of staff to ceo', 'chief of staff to coo', 'strategic initiative lead',
      'special assistant to ceo', 'executive project associate', 'corporate strategy and operations lead', 'strategic planning associate', 'head of strategy and operations',
      'lead bizops associate'
    ],
    strongKeywords: [
      'chief of staff', 'bizops', 'business operations associate', 'executive operations', 'strategic operations',
      'chief of staff to ceo'
    ],
    secondaryKeywords: [
      'okrs', 'kpis eksekutif', 'penyelarasan 6 divisi', 'laporan pimpinan', 'agenda strategis',
      'decision support', 'executive presentation'
    ],
    mustIncludeAny: [
      'chief of staff', 'bizops', 'business operations associate', 'strategic operations associate'
    ]
  },
  {
    key: 'franchise_retail_expansion',
    code: 'FRE',
    exactPhrases: [
      'retail expansion', 'franchise operations', 'spesialis ekspansi ritel', 'manajer kemitraan waralaba', 'franchise manager',
      'new store opening lead', 'nso lead', 'multi-unit store auditor', 'retail operations coordinator', 'franchise relation lead',
      'store opening specialist', 'koordinator gerai baru', 'franchise support officer', 'retail rollout manager', 'partner store development lead',
      'business expansion retail lead', 'outlet expansion coordinator'
    ],
    strongKeywords: [
      'retail expansion', 'franchise operations', 'waralaba', 'ekspansi ritel', 'new store opening',
      'nso lead', 'standarisasi gerai', 'pos cloud 13 gerai'
    ],
    secondaryKeywords: [
      'audit cabang mitra', 'pos terintegrasi', 'sop gerai baru', 'pembukaan toko', 'pendampingan pengelola toko',
      'franchise agreement'
    ],
    mustIncludeAny: [
      'franchise', 'waralaba', 'expansion', 'ekspansi', 'new store opening',
      'nso'
    ]
  },
];
