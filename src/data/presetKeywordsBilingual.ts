/**
 * PRESET KEYWORDS BILINGUAL & MULTI-LANGUAGE POSITION MATCHER
 * Mesin pencocokan posisi ke Preset CV ATS yang komprehensif,
 * mendukung ribuan variasi kata kunci posisi dalam Bahasa Indonesia,
 * Bahasa Inggris, singkatan resmi, slang dunia kerja, serta istilah bilingual.
 */

import { RolePresetOption, ALL_ROLE_PRESETS } from './rolePresetsConfig';

export interface PresetMatchingRule {
  key: string;
  code: string;
  /**
   * Frasa persis / gabungan kata kunci spesifik (Indonesian & English).
   * Bobot tertinggi (+350 jika identik, +260 jika cocok boundary)
   */
  exactPhrases: string[];
  /**
   * Kata kunci kuat yang khas untuk peran ini (+65 per kecocokan).
   */
  strongKeywords: string[];
  /**
   * Kata kunci pendukung (+25 per kecocokan).
   */
  secondaryKeywords?: string[];
  /**
   * Kata kunci negatif / diskualifikasi (-200 per kecocokan).
   * Mencegah preset umum (seperti office admin atau chief of staff)
   * merebut peran yang sebenarnya spesifik (seperti gudang, pajak, atau sales).
   */
  negativeKeywords?: string[];
  /**
   * Syarat mutlak: salah satu dari kata kunci ini HARUS ada agar aturan ini aktif.
   */
  mustIncludeAny?: string[];
}

/**
 * Normalisasi teks posisi agar kebal variasi bahasa, ejaan, tanda baca, dan noise OCR.
 */
export function normalizeJobTitle(raw: string): string {
  if (!raw) return '';
  let str = raw.toLowerCase().trim();

  // 1. Hapus tag lowongan kerja / noise umum di awal
  str = str.replace(/^(?:posisi|position|role|job\s*title|sebagai|dibutuhkan|dibuka|loker|lowongan|we\s*are\s*hiring|we're\s*hiring|hiring|open\s*position|urgently\s*needed)\s*[:=\-–—]\s*/i, '');

  // 2. Hapus noise tanda kurung di akhir seperti (pria/wanita), (fresh graduate), (magang), (kontrak), dll.
  str = str.replace(/\((?:pria|wanita|p\/w|p|w|male|female|m\/f|fresh\s*graduate|fg|magang|intern|internship|kontrak|contract|full\s*time|part\s*time|hybrid|remote|wfh|wfo|min\s*pengalaman[^)]*|\d+\s*tahun[^)]*)\)/gi, '');

  // 3. Normalisasi semua tanda kurung dan tanda baca menjadi spasi
  str = str.replace(/[/\\|•·\-–—_,:;+&()[\]{}'"`]/g, ' ');

  // 4. Normalisasi variasi kata serapan umum (ID <-> EN & singkatan)
  // 'staf' -> 'staff'
  str = str.replace(/\bstaf\b/g, 'staff');
  // 'adm' -> 'admin'
  str = str.replace(/\badm\b/g, 'admin');
  // 'administrasi' -> 'admin'
  str = str.replace(/\badministrasi\b/g, 'admin');
  // 'administration' -> 'admin'
  str = str.replace(/\badministration\b/g, 'admin');
  // 'spv' -> 'supervisor'
  str = str.replace(/\bspv\b/g, 'supervisor');
  // 'mgr' -> 'manager'
  str = str.replace(/\bmgr\b/g, 'manager');
  // 'manajer' -> 'manager'
  str = str.replace(/\bmanajer\b/g, 'manager');
  // 'asisten' -> 'assistant'
  str = str.replace(/\basisten\b/g, 'assistant');
  // 'koordinator' -> 'coordinator'
  str = str.replace(/\bkoordinator\b/g, 'coordinator');
  // 'spesialis' -> 'specialist'
  str = str.replace(/\bspesialis\b/g, 'specialist');
  // 'eksekutif' -> 'executive'
  str = str.replace(/\beksekutif\b/g, 'executive');
  // 'kepegawaian' / 'personalia' -> 'hr'
  str = str.replace(/\b(kepegawaian|personalia)\b/g, 'hr');
  // 'akuntansi' / 'akunting' -> 'accounting'
  str = str.replace(/\b(akuntansi|akunting)\b/g, 'accounting');
  // 'keuangan' -> 'finance'
  str = str.replace(/\bkeuangan\b/g, 'finance');
  // 'pemasaran' -> 'marketing'
  str = str.replace(/\bpemasaran\b/g, 'marketing');
  // 'penjualan' -> 'sales'
  str = str.replace(/\bpenjualan\b/g, 'sales');
  // 'pengadaan' / 'pembelian' -> 'purchasing'
  str = str.replace(/\b(pengadaan|pembelian)\b/g, 'purchasing');
  // 'perpajakan' -> 'tax'
  str = str.replace(/\b(pajak|perpajakan)\b/g, 'tax');
  // 'medsos' / 'media sosial' -> 'social media'
  str = str.replace(/\b(medsos|media\s+sosial)\b/g, 'social media');
  // 'layanan pelanggan' / 'pelayanan pelanggan' / 'customer support' -> 'customer service'
  str = str.replace(/\b(pelayanan\s+pelanggan|layanan\s+pelanggan|customer\s+support)\b/g, 'customer service');
  // 'gudang' / 'pergudangan' -> 'warehouse'
  str = str.replace(/\b(gudang|pergudangan)\b/g, 'warehouse');
  // 'penggajian' -> 'payroll'
  str = str.replace(/\bpenggajian\b/g, 'payroll');

  // Bersihkan spasi berlebih
  return str.replace(/\s+/g, ' ').trim();
}

/**
 * Pengecekan kecocokan kata atau frasa dengan boundary kata (\b atau awal/akhir spasi)
 * Menghindari jebakan substring (misal kata 'logistics' yang berakhiran 'cs' tidak boleh mencocokkan 'cs')
 */
export function matchesWordBoundary(text: string, term: string): boolean {
  if (!text || !term) return false;
  if (text === term) return true;
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(?:^|\\s)${escaped}(?:\\s|$)`, 'i');
  return regex.test(text);
}

/**
 * 85 Aturan Lengkap Pencocokan Preset CV ATS Bilingual (Indonesia & Inggris)
 */
export const BILINGUAL_PRESET_RULES: PresetMatchingRule[] = [
  // ==========================================
  // GRUP 1: ADMINISTRASI, KESEKRETARIATAN & SUPPORT
  // ==========================================
  {
    key: 'office_administration',
    code: 'ADM',
    exactPhrases: [
      'staff admin', 'admin staff', 'office admin', 'office administrator', 'admin kantor',
      'staff admin kantor', 'staff admin umum', 'general admin', 'administrative assistant',
      'back office', 'staff back office', 'admin back office', 'tata usaha', 'staff tata usaha',
      'office coordinator', 'office assistant', 'general administrative', 'admin perkantoran',
      'staff perkantoran', 'clerk', 'office clerk', 'admin umum', 'staff umum admin', 'administrasi umum',
      'supervisor admin', 'spv admin', 'admin supervisor', 'head of admin', 'kepala tata usaha',
      'kabag tata usaha', 'office manager', 'manajer administrasi', 'manajer kantor', 'koordinator administrasi'
    ],
    strongKeywords: ['back office', 'tata usaha', 'office assistant', 'office admin', 'admin kantor', 'administrasi perkantoran', 'admin umum'],
    secondaryKeywords: ['office', 'kantor', 'general', 'arsip', 'surat menyurat'],
    negativeKeywords: ['warehouse', 'gudang', 'tax', 'sales', 'billing', 'kasir', 'project', 'proyek', 'hospital', 'rs', 'klinik', 'legal', 'social media', 'marketplace', 'purchasing', 'hr', 'hrd']
  },
  {
    key: 'executive_assistant',
    code: 'AST',
    exactPhrases: [
      'executive assistant', 'personal assistant', 'sekretaris', 'secretary', 'sekretaris eksekutif',
      'executive secretary', 'sekretaris direksi', 'sekretaris pimpinan', 'asisten direktur',
      'asisten pimpinan', 'ea', 'pa', 'board secretary', 'private secretary', 'asisten eksekutif',
      'asisten pribadi', 'sekretaris manajemen', 'chief secretary', 'corporate secretary assistant',
      'executive assistant to ceo', 'asisten direksi', 'sekretaris ceo', 'personal assistant to director',
      'executive secretary to bod', 'asisten manajer direksi'
    ],
    strongKeywords: ['executive assistant', 'personal assistant', 'sekretaris', 'secretary', 'direksi', 'direktur', 'pimpinan', 'asisten pribadi'],
    secondaryKeywords: ['agenda', 'jadwal', 'notulensi', 'travel', 'itinerary', 'rapat direksi'],
    negativeKeywords: ['proyek', 'project', 'klinik', 'warehouse', 'gudang', 'customer service', 'cs', 'pelanggan']
  },
  {
    key: 'hospital_office_admin',
    code: 'HOS',
    exactPhrases: [
      'admin rs', 'admin rumah sakit', 'admin klinik', 'hospital admin', 'hospital administrator',
      'healthcare admin', 'clinic admin', 'rekam medis', 'medical records', 'administrasi pasien',
      'patient administration', 'admisi', 'admission staff', 'admin faskes', 'administrasi kesehatan',
      'front office rumah sakit', 'kasir klinik', 'kasir rumah sakit', 'staff pendaftaran rs'
    ],
    strongKeywords: ['rumah sakit', 'hospital', 'klinik', 'clinic', 'rekam medis', 'faskes', 'pasien', 'admisi', 'healthcare'],
    secondaryKeywords: ['medis', 'medical', 'bpjs kesehatan', 'rawat'],
    mustIncludeAny: ['rs', 'rumah sakit', 'klinik', 'clinic', 'rekam medis', 'faskes', 'pasien', 'admisi', 'healthcare', 'medical']
  },
  {
    key: 'legal_document_admin',
    code: 'LGL',
    exactPhrases: [
      'legal staff', 'staff legal', 'legal admin', 'admin legal', 'legal officer', 'legal specialist',
      'legal corporate', 'staff hukum', 'administrasi hukum', 'paralegal', 'notaris assistant',
      'asisten notaris', 'legal document', 'perizinan usaha', 'legal permit', 'kontrak hukum',
      'legal contract', 'document controller legal', 'staff perizinan', 'legal compliance officer'
    ],
    strongKeywords: ['legal', 'hukum', 'paralegal', 'notaris', 'perizinan', 'permit', 'kontrak', 'litigasi', 'somasi'],
    secondaryKeywords: ['compliance', 'kepatuhan', 'akta', 'agreement'],
    mustIncludeAny: ['legal', 'hukum', 'paralegal', 'notaris', 'perizinan', 'permit', 'kontrak', 'litigasi']
  },
  {
    key: 'sales_administration',
    code: 'SAD',
    exactPhrases: [
      'admin sales', 'sales admin', 'admin penjualan', 'sales administrator', 'sales support',
      'staff admin sales', 'sales order admin', 'admin order', 'faktur penjualan', 'sales coordinator',
      'commercial admin', 'order processing', 'sales clerk', 'sales admin support', 'admin marketing sales'
    ],
    strongKeywords: ['sales admin', 'admin sales', 'sales support', 'order processing', 'sales order', 'faktur penjualan'],
    secondaryKeywords: ['po sales', 'invoice sales', 'sales'],
    mustIncludeAny: ['sales', 'order', 'penjualan']
  },
  {
    key: 'finance_billing_admin',
    code: 'FBA',
    exactPhrases: [
      'admin finance', 'admin keuangan', 'billing admin', 'admin billing', 'admin invoice',
      'invoicing admin', 'admin kasir', 'cashier admin', 'admin penagihan', 'collection admin',
      'finance admin', 'finance clerk', 'admin pembukuan', 'admin piutang', 'finance billing',
      'staff invoice', 'staff billing', 'petugas billing', 'kasir kantor', 'billing officer',
      'staff pembukuan kasir kantor', 'kasir pembukuan', 'staff kasir kantor'
    ],
    strongKeywords: ['billing', 'invoice', 'admin kasir', 'penagihan', 'admin finance', 'finance admin', 'kasir kantor'],
    secondaryKeywords: ['tanda terima', 'kwitansi', 'reimbursement']
  },
  {
    key: 'hr_personnel_admin',
    code: 'HRA',
    exactPhrases: [
      'admin hr', 'admin hrd', 'hr admin', 'hr administrator', 'hrd admin', 'admin personalia',
      'staff personalia', 'admin sdm', 'administrasi kepegawaian', 'personnel admin',
      'staff absensi', 'attendance admin', 'staff data karyawan', 'employee records admin', 'hr assistant'
    ],
    strongKeywords: ['admin hr', 'admin hrd', 'admin personalia', 'kepegawaian', 'absensi', 'data karyawan'],
    secondaryKeywords: ['personalia', 'cuti', 'lembur', 'fingerprint'],
    mustIncludeAny: ['admin hr', 'admin hrd', 'hr admin', 'hrd admin', 'personalia', 'kepegawaian', 'absensi']
  },
  {
    key: 'project_administration',
    code: 'PRA',
    exactPhrases: [
      'project admin', 'admin proyek', 'project administrator', 'administrasi proyek', 'site admin',
      'admin site', 'project clerk', 'sekretaris proyek', 'project secretary', 'project document controller',
      'admin lapangan proyek', 'staff administrasi proyek', 'proyek lapangan admin', 'admin proyek lapangan'
    ],
    strongKeywords: ['admin proyek', 'project admin', 'site admin', 'document controller proyek', 'sekretaris proyek', 'admin proyek lapangan'],
    secondaryKeywords: ['rab', 'opname', 'site', 'lapangan'],
    mustIncludeAny: ['admin proyek', 'project admin', 'site admin', 'sekretaris proyek', 'project clerk']
  },
  {
    key: 'procurement_administration',
    code: 'PPA',
    exactPhrases: [
      'procurement admin', 'admin procurement', 'admin purchasing', 'purchasing admin', 'admin pengadaan',
      'admin pembelian', 'purchase order admin', 'admin po', 'admin vendor', 'procurement clerk',
      'sourcing assistant', 'admin logistik pengadaan', 'buyer admin'
    ],
    strongKeywords: ['admin purchasing', 'purchasing admin', 'admin pengadaan', 'procurement admin', 'purchase order', 'admin po'],
    secondaryKeywords: ['vendor', 'supplier', 'pr po'],
    mustIncludeAny: ['admin purchasing', 'purchasing admin', 'admin pengadaan', 'procurement admin', 'admin po']
  },
  {
    key: 'data_entry_admin',
    code: 'DEA',
    exactPhrases: [
      'data entry', 'staff data entry', 'operator data entry', 'data entry clerk', 'data entry specialist',
      'operator input data', 'staff input data', 'admin input data', 'master data admin', 'admin database',
      'data processing clerk', 'verifikator data', 'operator komputer data', 'data typing', 'input data operator'
    ],
    strongKeywords: ['data entry', 'input data', 'master data', 'verifikator data', 'data clerk'],
    secondaryKeywords: ['entry', 'typing', 'verifikasi']
  },
  {
    key: 'warehouse_inventory_admin',
    code: 'WHA',
    exactPhrases: [
      'admin gudang', 'warehouse admin', 'admin warehouse', 'admin pergudangan', 'staff admin gudang',
      'admin surat jalan', 'admin inventory', 'admin stock', 'stock admin', 'inventory admin',
      'admin checker gudang', 'checker gudang admin', 'warehouse clerk', 'admin logistik gudang',
      'surat jalan admin', 'staff input gudang', 'stock controller admin', 'admin gudang logistik'
    ],
    strongKeywords: ['admin gudang', 'warehouse admin', 'admin pergudangan', 'admin inventory', 'admin stock', 'surat jalan'],
    secondaryKeywords: ['checker', 'stock opname', 'gudang', 'warehouse'],
    mustIncludeAny: ['gudang', 'warehouse', 'surat jalan', 'inventory', 'stock']
  },

  // ==========================================
  // GRUP 2: OPERASIONAL, RITEL & LAPANGAN
  // ==========================================
  {
    key: 'business_operations',
    code: 'OPS',
    exactPhrases: [
      'business operations', 'operations manager', 'manajer operasional', 'operations officer',
      'staff operasional', 'operations specialist', 'business ops', 'operations lead', 'ops manager',
      'supervisor operasional', 'spv operasional', 'operational specialist', 'head of operations',
      'chief operating officer', 'operations coordinator', 'manajemen operasional', 'asisten manajer operasional',
      'assistant operations manager', 'operations supervisor', 'kabag operasional', 'kepala operasional',
      'operations generalist', 'lead operations', 'senior operations officer', 'koordinator operasional'
    ],
    strongKeywords: ['business operations', 'operations manager', 'operasional', 'ops', 'sop perusahaan', 'supervisor operasional', 'spv operasional', 'manajer operasional'],
    secondaryKeywords: ['efisiensi', 'proses bisnis', 'branch ops', 'kpi operasional', 'standarisasi'],
    negativeKeywords: ['toko', 'ritel', 'store', 'gudang', 'pabrik', 'lapangan', 'sales', 'cs', 'customer service', 'support']
  },
  {
    key: 'branch_manager',
    code: 'BRN',
    exactPhrases: [
      'branch manager', 'kepala cabang', 'pimpinan cabang', 'wakil kepala cabang', 'assistant branch manager',
      'kepala kantor cabang', 'branch head', 'area branch manager', 'branch operations manager',
      'manajer cabang', 'kepala unit', 'unit manager', 'branch director', 'kacab', 'wakacab', 'kepala sub cabang',
      'area manager', 'area supervisor', 'spv area'
    ],
    strongKeywords: ['branch manager', 'kepala cabang', 'pimpinan cabang', 'branch head', 'kantor cabang', 'manajer cabang', 'kacab', 'area manager'],
    secondaryKeywords: ['kacab', 'cabang', 'branch', 'target cabang']
  },
  {
    key: 'retail_store_operations',
    code: 'RTL',
    exactPhrases: [
      'store manager', 'kepala toko', 'store supervisor', 'store leader', 'retail store supervisor',
      'spv toko', 'supervisor toko', 'asisten kepala toko', 'assistant store manager', 'retail operations',
      'crew store', 'crew outlet', 'service crew', 'pramuniaga', 'staff toko', 'kasir toko', 'kasir', 'cashier',
      'head cashier', 'floor supervisor', 'retail supervisor', 'merchandiser toko', 'barista', 'head barista',
      'waiter', 'waitress', 'pramusaji', 'kitchen crew', 'spg', 'spb', 'sales promotion', 'frontliner toko',
      'outlet supervisor', 'restoran crew', 'cafe crew', 'crew f b', 'pramuniaga toko kasir ritel',
      'asst store manager', 'area store supervisor', 'spv outlet', 'kepala gerai', 'leader store', 'crew resto'
    ],
    strongKeywords: ['store manager', 'kepala toko', 'store supervisor', 'store leader', 'ritel', 'retail', 'outlet', 'crew', 'barista', 'pramuniaga', 'kasir', 'cashier', 'waiter', 'spv toko'],
    secondaryKeywords: ['pos', 'shift', 'display', 'merchandise', 'restock', 'toko ritel'],
    negativeKeywords: ['kantor', 'office', 'pembukuan', 'accounting', 'finance']
  },
  {
    key: 'general_affairs',
    code: 'GAF',
    exactPhrases: [
      'general affairs', 'ga staff', 'staff ga', 'ga officer', 'ga supervisor', 'ga manager',
      'general affair', 'manajemen fasilitas', 'facility management', 'building management',
      'pengelola gedung', 'aset dan fasilitas', 'building maintenance', 'office boy', 'ob',
      'cleaning service', 'security', 'satpam', 'petugas keamanan', 'bagian umum', 'rumah tangga kantor',
      'staff general affair fasilitas kantor', 'spv ga', 'supervisor ga', 'supervisor general affairs',
      'manager ga', 'manajer ga', 'manajer general affairs', 'kepala bagian umum', 'kabag umum',
      'koordinator ga', 'ga coordinator', 'facility supervisor', 'facility manager'
    ],
    strongKeywords: ['general affairs', 'general affair', 'ga', 'fasilitas', 'facility', 'gedung', 'building', 'cleaning service', 'security', 'satpam', 'office boy', 'bagian umum', 'spv ga', 'supervisor ga', 'manager ga'],
    secondaryKeywords: ['kendaraan dinas', 'pemeliharaan', 'inventaris kantor', 'atk', 'sarana prasarana']
  },
  {
    key: 'qa_qc_compliance',
    code: 'QAC',
    exactPhrases: [
      'quality control', 'qc staff', 'staff qc', 'qc inspector', 'qc supervisor', 'quality assurance',
      'qa staff', 'staff qa', 'qa supervisor', 'qa qc', 'inspektur mutu', 'pengendalian mutu',
      'penjaminan mutu', 'process compliance', 'kepatuhan sop', 'auditor mutu', 'qa engineer',
      'quality compliance officer', 'petugas qc', 'qc analyst', 'quality assurance inspector',
      'spv qc', 'supervisor qc', 'spv qa', 'supervisor qa', 'qa manager', 'qc manager', 'manajer mutu'
    ],
    strongKeywords: ['quality control', 'quality assurance', 'qc', 'qa', 'inspektur mutu', 'pengendalian mutu', 'kepatuhan sop', 'penjaminan mutu', 'spv qc', 'qc supervisor'],
    secondaryKeywords: ['inspeksi', 'sampling', 'toleransi', 'standar mutu', 'iso']
  },
  {
    key: 'manufacturing_operations',
    code: 'MFG',
    exactPhrases: [
      'operator produksi', 'production operator', 'staff produksi', 'production staff', 'supervisor produksi',
      'production supervisor', 'production manager', 'manajer produksi', 'plant manager', 'manajer pabrik',
      'manufacturing operations', 'operasional pabrik', 'kepala regu produksi', 'foreman produksi',
      'line leader produksi', 'teknisi produksi', 'machine operator', 'operator mesin', 'operator mesin pabrik produksi',
      'plant production supervisor', 'spv produksi', 'kepala pabrik', 'production engineer', 'process engineer',
      'leader produksi', 'mandor produksi', 'foreman'
    ],
    strongKeywords: ['produksi', 'manufacturing', 'pabrik', 'plant', 'operator mesin', 'line leader', 'operator produksi', 'supervisor produksi', 'spv produksi', 'manajer produksi'],
    secondaryKeywords: ['output', 'kapasitas', 'mesin pabrik', 'shift pabrik']
  },
  {
    key: 'field_operations',
    code: 'FLD',
    exactPhrases: [
      'field operations', 'koordinator lapangan', 'korlap', 'field officer', 'field coordinator',
      'field supervisor', 'supervisi on site', 'petugas lapangan', 'on site supervisor', 'surveyor lapangan',
      'site supervisor', 'pengawas lapangan', 'field team leader', 'on site lead', 'koordinator lapangan proyek'
    ],
    strongKeywords: ['lapangan', 'field', 'on site', 'korlap', 'surveyor', 'pengawas lapangan', 'koordinator lapangan'],
    secondaryKeywords: ['lokasi', 'inspeksi lapangan']
  },
  {
    key: 'public_utilities_ops',
    code: 'UTL',
    exactPhrases: [
      'public utilities', 'utilitas publik', 'layanan masyarakat', 'operasional pdam', 'operasional pln',
      'operasional pelayanan publik', 'fasilitas umum', 'public works', 'municipal services',
      'dinas kebersihan', 'layanan infrastruktur publik'
    ],
    strongKeywords: ['utilitas', 'utilities', 'layanan publik', 'pelayanan masyarakat', 'fasilitas umum'],
    secondaryKeywords: ['infrastruktur', 'dinas']
  },
  {
    key: 'operational_excellence',
    code: 'OPX',
    exactPhrases: [
      'operational excellence', 'opex', 'continuous improvement', 'lean six sigma', 'kaizen',
      'kaizen specialist', 'business process improvement', 'bpi', 'lean manufacturing specialist',
      'efisiensi proses', 'process excellence', 'six sigma green belt', 'six sigma black belt'
    ],
    strongKeywords: ['operational excellence', 'opex', 'continuous improvement', 'six sigma', 'kaizen', 'lean'],
    secondaryKeywords: ['waste reduction', '5s', 'process mapping']
  },
  {
    key: 'service_operations_manager',
    code: 'SOM',
    exactPhrases: [
      'service operations manager', 'service manager', 'after sales manager', 'layanan purna jual',
      'service center manager', 'kepala bengkel', 'workshop supervisor', 'manajer layanan lapangan',
      'customer service center lead', 'field service manager', 'teknisi service manager'
    ],
    strongKeywords: ['service operations', 'after sales', 'service center', 'purna jual', 'kepala bengkel'],
    secondaryKeywords: ['garansi', 'reparasi', 'sparepart']
  },
  {
    key: 'chief_of_staff',
    code: 'COS',
    exactPhrases: [
      'chief of staff', 'cos', 'staf ahli direksi', 'staff ahli direksi', 'bizops associate',
      'special assistant to ceo', 'staff khusus pimpinan', 'strategic assistant to management',
      'strategy ops associate', 'kanan kiri direksi'
    ],
    strongKeywords: ['chief of staff', 'special assistant to ceo', 'staf ahli direksi', 'bizops associate'],
    secondaryKeywords: ['c level', 'strategic initiatives'],
    mustIncludeAny: ['chief', 'cos', 'ahli direksi', 'special assistant', 'bizops']
  },
  {
    key: 'franchise_retail_expansion',
    code: 'FRE',
    exactPhrases: [
      'franchise operations', 'kemitraan waralaba', 'ekspansi ritel', 'retail expansion', 'franchise development',
      'new store opening', 'nso specialist', 'spesialis ekspansi', 'store rollout', 'business expansion specialist'
    ],
    strongKeywords: ['franchise', 'waralaba', 'ekspansi', 'expansion', 'new store opening', 'nso', 'rollout'],
    secondaryKeywords: ['lokasi baru', 'mitra waralaba']
  },

  // ==========================================
  // GRUP 3: MANAJEMEN PROYEK & PMO
  // ==========================================
  {
    key: 'project_management',
    code: 'PMO',
    exactPhrases: [
      'project manager', 'manajer proyek', 'project management officer', 'pmo', 'pmo specialist',
      'pmo officer', 'project coordinator', 'koordinator proyek', 'project lead', 'asisten project manager',
      'assistant project manager', 'project operations', 'delivery manager', 'program manager',
      'project delivery lead', 'manajer proyek konstruksi', 'project supervisor', 'spv proyek',
      'supervisor proyek', 'site manager proyek', 'project engineer', 'project director', 'lead pmo',
      'pmo lead', 'senior project manager', 'project scheduler', 'project officer'
    ],
    strongKeywords: ['project manager', 'manajer proyek', 'pmo', 'project management', 'project coordinator', 'project lead', 'supervisor proyek', 'spv proyek', 'site manager'],
    secondaryKeywords: ['timeline', 'sla', 'deliverables', 'scrum', 'gantt', 'rab proyek'],
    negativeKeywords: ['admin proyek', 'project admin', 'it project', 'software', 'event', 'acara', 'desain']
  },
  {
    key: 'it_project_manager',
    code: 'ITP',
    exactPhrases: [
      'it project manager', 'project manager it', 'technical project manager', 'digital project manager',
      'software project manager', 'it delivery manager', 'tech pm', 'digital pm', 'manajer proyek teknologi',
      'it pmo', 'tech project lead', 'software project lead'
    ],
    strongKeywords: ['it project manager', 'technical project manager', 'digital project manager', 'tech pm', 'manajer proyek it'],
    secondaryKeywords: ['software delivery', 'sprint', 'sdlc', 'aplikasi'],
    mustIncludeAny: ['it', 'tech', 'digital', 'software', 'teknologi', 'technical']
  },
  {
    key: 'event_program_manager',
    code: 'EVM',
    exactPhrases: [
      'event manager', 'event organizer', 'manajer acara', 'event coordinator', 'koordinator acara',
      'event producer', 'eo specialist', 'wedding organizer', 'mice specialist', 'festival producer',
      'program acara', 'stage manager acara', 'event production lead', 'eo', 'event supervisor',
      'spv event', 'project manager event', 'event lead', 'koordinator eo'
    ],
    strongKeywords: ['event', 'acara', 'organizer', 'mice', 'festival', 'stage manager', 'rundown', 'event organizer'],
    secondaryKeywords: ['venue', 'konser', 'exhibition', 'bazaar', 'lighting', 'sound'],
    mustIncludeAny: ['event', 'acara', 'mice', 'wedding organizer', 'eo']
  },
  {
    key: 'nonprofit_program_lead',
    code: 'NGO',
    exactPhrases: [
      'ngo program manager', 'program manager yayasan', 'program manager nirlaba', 'community development lead',
      'csr specialist', 'csr officer', 'community relations specialist', 'staff program sosial', 'grant manager',
      'pemberdayaan masyarakat', 'ngo lead', 'nonprofit lead', 'koordinator yayasan', 'program coordinator yayasan'
    ],
    strongKeywords: ['ngo', 'nonprofit', 'nirlaba', 'yayasan', 'csr', 'pemberdayaan masyarakat', 'community development'],
    secondaryKeywords: ['sosial', 'donatur', 'relawan', 'volunteer'],
    mustIncludeAny: ['ngo', 'nonprofit', 'nirlaba', 'yayasan', 'csr', 'pemberdayaan']
  },
  {
    key: 'agile_scrum_master',
    code: 'ASM',
    exactPhrases: [
      'scrum master', 'agile coach', 'agile delivery lead', 'kanban master', 'sprint facilitator',
      'scrum master bersertifikat', 'psm', 'csm', 'technical delivery lead', 'scrum master agile delivery',
      'lead scrum master'
    ],
    strongKeywords: ['scrum master', 'agile coach', 'agile delivery', 'scrum', 'sprint', 'kanban'],
    secondaryKeywords: ['standup', 'retrospective', 'backlog grooming'],
    mustIncludeAny: ['scrum', 'agile', 'kanban', 'sprint']
  },
  {
    key: 'product_operations',
    code: 'POM',
    exactPhrases: [
      'product operations', 'product ops', 'product operations manager', 'system adoption lead',
      'operasional produk', 'feature adoption specialist', 'product enablement'
    ],
    strongKeywords: ['product operations', 'product ops', 'system adoption', 'feature rollout'],
    secondaryKeywords: ['user feedback', 'product release'],
    mustIncludeAny: ['product operations', 'product ops', 'operasional produk']
  },
  {
    key: 'implementation_manager',
    code: 'IPM',
    exactPhrases: [
      'implementation manager', 'manajer implementasi', 'client onboarding specialist', 'onboarding manager',
      'solution implementation', 'deployment specialist', 'technical onboarding lead', 'implementation lead'
    ],
    strongKeywords: ['implementation manager', 'implementasi', 'onboarding', 'deployment specialist'],
    secondaryKeywords: ['go live', 'setup klien'],
    mustIncludeAny: ['implementation', 'implementasi', 'onboarding']
  },
  {
    key: 'creative_project_manager',
    code: 'CPM',
    exactPhrases: [
      'creative project manager', 'creative producer', 'produser kreatif', 'manajer proyek kreatif',
      'media production lead', 'design project manager', 'agency account executive', 'creative lead'
    ],
    strongKeywords: ['creative project', 'creative producer', 'produser kreatif', 'agency creative'],
    secondaryKeywords: ['studio', 'videografi', 'desain']
  },

  // ==========================================
  // GRUP 4: BISNIS, B2B SALES & KEMITRAAN
  // ==========================================
  {
    key: 'business_development',
    code: 'BDV',
    exactPhrases: [
      'business development', 'bizdev', 'bd', 'staff pengembangan bisnis', 'business development officer',
      'business development specialist', 'business development manager', 'bdr', 'business development executive',
      'growth associate', 'lead generation bisnis', 'pengembangan kemitraan bisnis', 'bd staff', 'staff bd',
      'spv bd', 'bd supervisor', 'manajer business development', 'business development lead', 'head of bizdev',
      'business development coordinator', 'senior bd'
    ],
    strongKeywords: ['business development', 'bizdev', 'pengembangan bisnis', 'bdr', 'new market', 'bd supervisor', 'manager business development'],
    secondaryKeywords: ['pipeline', 'partnership', 'ekspansi bisnis', 'leads'],
    negativeKeywords: ['sales retail', 'kasir', 'pramuniaga']
  },
  {
    key: 'sales_executive',
    code: 'SLS',
    exactPhrases: [
      'sales executive', 'eksekutif penjualan', 'sales representative', 'sales rep', 'sales specialist',
      'staff sales', 'staff penjualan', 'sales b2b', 'b2b sales', 'sales consultant', 'sales officer',
      'account executive', 'direct sales', 'commercial sales', 'sales associate', 'sales canvasser',
      'sales motoris', 'sales force', 'sales counter', 'b2b sales executive', 'sales supervisor',
      'spv sales', 'supervisor sales', 'sales manager', 'manajer sales', 'manajer penjualan',
      'sales coordinator', 'sales lead', 'area sales manager', 'head of sales', 'senior sales executive'
    ],
    strongKeywords: ['sales executive', 'sales representative', 'sales b2b', 'account executive', 'canvasser', 'penjualan', 'sales supervisor', 'spv sales', 'sales manager'],
    secondaryKeywords: ['closing', 'kuota sales', 'prospek', 'omset', 'pipeline'],
    negativeKeywords: ['admin sales', 'sales admin', 'supervisor toko', 'kasir']
  },
  {
    key: 'key_account_manager',
    code: 'KAM',
    exactPhrases: [
      'key account manager', 'kam', 'manajer klien utama', 'key account executive', 'senior account manager',
      'corporate account lead', 'strategic account manager', 'enterprise client partner', 'retensi klien korporat',
      'account manager', 'corporate account manager', 'key account supervisor', 'spv key account'
    ],
    strongKeywords: ['key account', 'kam', 'corporate account', 'klien utama', 'retensi klien', 'account manager'],
    secondaryKeywords: ['b2b enterprise', 'kontrak tahunan', 'corporate client']
  },
  {
    key: 'partnership_government',
    code: 'GOV',
    exactPhrases: [
      'partnership specialist', 'kemitraan strategis', 'hubungan pemerintah', 'government relations',
      'public sector alliances', 'kerjasama antar lembaga', 'institutional partnership', 'staff kemitraan',
      'hubungan instansi', 'external relations government'
    ],
    strongKeywords: ['government relations', 'hubungan pemerintah', 'kemitraan', 'partnership', 'antar lembaga', 'bumn'],
    secondaryKeywords: ['mou', 'regulasi', 'kementerian', 'dinas']
  },
  {
    key: 'client_success_manager',
    code: 'CSM',
    exactPhrases: [
      'client success manager', 'customer success manager', 'csm', 'manajer kepuasan klien',
      'client success lead', 'customer success lead', 'account servicing', 'client relationship manager'
    ],
    strongKeywords: ['client success', 'customer success', 'csm', 'retention', 'nps klien'],
    secondaryKeywords: ['churn', 'renewal', 'kepuasan klien'],
    mustIncludeAny: ['client success', 'customer success', 'csm']
  },
  {
    key: 'channel_distribution_sales',
    code: 'CSD',
    exactPhrases: [
      'channel sales', 'distributor manager', 'mitra distribusi', 'channel partner manager',
      'keagenan dan reseller', 'area channel manager', 'distribution sales lead', 'reseller manager'
    ],
    strongKeywords: ['channel sales', 'distribusi', 'distributor', 'reseller', 'keagenan'],
    secondaryKeywords: ['outlet', 'wholesaler']
  },
  {
    key: 'enterprise_sales_lead',
    code: 'CSE',
    exactPhrases: [
      'enterprise sales', 'penjualan enterprise', 'high ticket b2b', 'corporate sales director',
      'enterprise account executive', 'b2b enterprise lead'
    ],
    strongKeywords: ['enterprise sales', 'high ticket', 'corporate sales director', 'b2b enterprise'],
    secondaryKeywords: ['tender korporat', 'deal size']
  },
  {
    key: 'sales_operations_enablement',
    code: 'SOP',
    exactPhrases: [
      'sales operations', 'sales ops', 'sales enablement', 'pelatihan sales', 'analis kinerja sales',
      'sales productivity', 'crm pipeline analyst'
    ],
    strongKeywords: ['sales operations', 'sales ops', 'sales enablement', 'crm pipeline'],
    secondaryKeywords: ['kuota', 'sales playbook']
  },
  {
    key: 'tender_bid_specialist',
    code: 'TND',
    exactPhrases: [
      'tender specialist', 'spesialis tender', 'proposal komersial', 'bidding specialist',
      'staff lelang', 'lpse', 'tender officer', 'bid manager', 'rfp specialist', 'contract bidding'
    ],
    strongKeywords: ['tender', 'bidding', 'lelang', 'lpse', 'rfp', 'proposal komersial', 'aanwijzing'],
    secondaryKeywords: ['dokumen tender', 'spph', 'jaminan penawaran']
  },

  // ==========================================
  // GRUP 5: SUPPLY CHAIN, LOGISTIK & PENGADAAN
  // ==========================================
  {
    key: 'supply_chain_logistics',
    code: 'SCM',
    exactPhrases: [
      'supply chain', 'rantai pasok', 'supply chain specialist', 'scm specialist', 'staff scm',
      'supply chain officer', 'supply chain manager', 'logistik dan rantai pasok', 'supply chain operations',
      'logistics specialist', 'logistics officer', 'staff logistik', 'logistics staff', 'manajer logistik',
      'logistik', 'supervisor logistik', 'spv logistik', 'spv scm', 'scm supervisor', 'head of supply chain',
      'supply chain lead', 'manajer rantai pasok', 'koordinator logistik'
    ],
    strongKeywords: ['supply chain', 'scm', 'rantai pasok', 'logistik', 'logistics', 'supervisor logistik', 'spv logistik', 'manajer logistik'],
    secondaryKeywords: ['distribusi barang', 'inbound', 'outbound', 'tata kelola logistik'],
    negativeKeywords: ['admin gudang', 'checker', 'driver', 'kurir', 'admin warehouse']
  },
  {
    key: 'ppic_inventory',
    code: 'PPC',
    exactPhrases: [
      'ppic', 'staff ppic', 'ppic staff', 'ppic supervisor', 'production planning', 'perencanaan produksi',
      'inventory control', 'production planning and inventory control', 'jadwal produksi', 'materials planner',
      'inventory control administrator', 'spv ppic', 'supervisor ppic', 'ppic manager', 'manajer ppic',
      'ppic officer', 'inventory planner'
    ],
    strongKeywords: ['ppic', 'production planning', 'inventory control', 'perencanaan produksi', 'materials planner', 'spv ppic', 'supervisor ppic'],
    secondaryKeywords: ['bom', 'bill of materials', 'safety stock', 'lead time'],
    mustIncludeAny: ['ppic', 'production planning', 'materials planner', 'inventory control']
  },
  {
    key: 'procurement_purchasing',
    code: 'PRC',
    exactPhrases: [
      'purchasing staff', 'staff purchasing', 'procurement staff', 'staff procurement', 'procurement specialist',
      'staff pengadaan', 'staff pembelian', 'buyer', 'strategic buyer', 'purchasing officer', 'purchasing supervisor',
      'procurement officer', 'purchasing manager', 'procurement manager', 'spesialis pengadaan', 'sourcing specialist',
      'staff pengadaan barang purchasing', 'spv purchasing', 'supervisor purchasing', 'manajer purchasing',
      'manajer pengadaan', 'procurement supervisor', 'spv procurement', 'head of procurement'
    ],
    strongKeywords: ['purchasing', 'procurement', 'pengadaan', 'pembelian', 'buyer', 'sourcing', 'supervisor purchasing', 'spv purchasing', 'purchasing manager'],
    secondaryKeywords: ['vendor', 'supplier', 'negosiasi harga', 'rfq', 'penawaran harga'],
    negativeKeywords: ['admin purchasing', 'admin po']
  },
  {
    key: 'warehouse_logistics_lead',
    code: 'WHS',
    exactPhrases: [
      'kepala gudang', 'warehouse manager', 'supervisor gudang', 'warehouse supervisor', 'staff gudang',
      'warehouse officer', 'warehouse operations', 'manajemen pergudangan', 'warehouse lead',
      'kepala logistik pergudangan', 'depot manager', 'gudang transit lead', 'checker gudang lead',
      'supervisor pergudangan', 'warehouse operations supervisor', 'spv gudang', 'manajer gudang',
      'koordinator gudang', 'head of warehouse', 'lead warehouse'
    ],
    strongKeywords: ['kepala gudang', 'warehouse manager', 'supervisor gudang', 'pergudangan', 'staff gudang', 'warehouse operations', 'supervisor pergudangan', 'spv gudang'],
    secondaryKeywords: ['fifo', 'rak gudang', 'forklift', 'bongkar muat', 'stock opname', 'tata letak gudang'],
    negativeKeywords: ['admin gudang', 'admin warehouse']
  },
  {
    key: 'logistics_fleet_dispatch',
    code: 'LDC',
    exactPhrases: [
      'koordinator armada', 'fleet coordinator', 'dispatcher', 'koordinator pengiriman', 'logistics dispatch',
      'transport operations', 'fleet management', 'supervisor armada', 'rute logistik', 'ekspedisi',
      'driver logistik', 'driver operasional', 'kurir supervisor', 'dispatch officer', 'driver', 'kurir'
    ],
    strongKeywords: ['armada', 'fleet', 'dispatch', 'dispatcher', 'pengiriman', 'ekspedisi', 'rute kirim', 'transportasi', 'driver', 'kurir'],
    secondaryKeywords: ['truk', 'delivery', 'kendaraan pengiriman']
  },
  {
    key: 'vendor_supplier_management',
    code: 'VMR',
    exactPhrases: [
      'vendor management', 'manajemen vendor', 'supplier relations', 'manajemen pemasok',
      'vendor performance', 'negosiasi vendor', 'supplier development specialist'
    ],
    strongKeywords: ['vendor management', 'supplier relations', 'manajemen pemasok', 'vendor performance'],
    secondaryKeywords: ['sla vendor', 'evaluasi supplier'],
    mustIncludeAny: ['vendor management', 'supplier relations', 'manajemen pemasok']
  },
  {
    key: 'demand_inventory_planning',
    code: 'DIP',
    exactPhrases: [
      'demand planner', 'demand planning', 'perencanaan kebutuhan stok', 'inventory planner',
      'forecasting stok', 'analis persediaan', 'supply planner', 'stock replenishment'
    ],
    strongKeywords: ['demand planner', 'demand planning', 'inventory planning', 'forecasting stok', 'perencanaan stok'],
    secondaryKeywords: ['buffer stock', 'min max stock'],
    mustIncludeAny: ['demand planner', 'demand planning', 'inventory planner', 'forecasting stok']
  },

  // ==========================================
  // GRUP 6: SDM, REKRUTMEN & TALENTA
  // ==========================================
  {
    key: 'hr_operations',
    code: 'HRS',
    exactPhrases: [
      'hr operations', 'hr generalist', 'hr specialist', 'hr officer', 'hr staff', 'staff hr',
      'hrd staff', 'staff hrd', 'human resources specialist', 'people operations', 'operasional sdm',
      'manajemen sdm', 'hr manager', 'hr supervisor', 'human capital specialist', 'hrd',
      'human resources generalist', 'supervisor hr', 'supervisor hrd', 'supervisor hrga', 'spv hr',
      'spv hrd', 'spv hrga', 'hr supervisor', 'hrd supervisor', 'hrga supervisor', 'manager hr',
      'manager hrd', 'manager hrga', 'manajer hr', 'manajer hrd', 'manajer hrga', 'hr manager',
      'hrd manager', 'hrga manager', 'asisten manager hr', 'assistant hr manager', 'assistant hrd manager',
      'hr & ga supervisor', 'hr ga supervisor', 'hr ga manager', 'hrga officer', 'hrga specialist',
      'hrga coordinator', 'hrga staff', 'staff hrga', 'human resource officer', 'human resources supervisor',
      'human resources manager', 'hr lead', 'head of hr', 'head of hrd', 'kepala bagian hr', 'kabag hrd',
      'kabag personalia', 'chief hr', 'kabag sdm', 'staff sdm', 'spv sdm', 'manager sdm', 'kepala sdm',
      'lead hr', 'senior hr officer', 'hr coordinator', 'koordinator hr', 'koordinator hrd', 'koordinator hrga',
      'officer hrd', 'officer hr', 'specialist hrd', 'specialist hr', 'people & culture lead'
    ],
    strongKeywords: ['hr operations', 'hr generalist', 'hr specialist', 'people operations', 'human resources', 'sdm', 'hrd', 'hrga', 'supervisor hr', 'manager hr', 'spv hr', 'spv hrd', 'manager hrd', 'personalia'],
    secondaryKeywords: ['karyawan', 'kebijakan sdm', 'manpower planning', 'hr policy', 'penilaian kinerja'],
    negativeKeywords: ['admin hrd', 'admin personalia', 'recruiter', 'rekruter', 'payroll', 'penggajian']
  },
  {
    key: 'talent_acquisition',
    code: 'REC',
    exactPhrases: [
      'recruiter', 'recruitment', 'talent acquisition', 'staff rekrutmen', 'recruitment officer',
      'recruitment specialist', 'talent acquisition specialist', 'headhunter', 'talent sourcer',
      'hiring specialist', 'rekruter', 'recruitment lead', 'technical recruiter', 'talent scout',
      'staff rekrutmen seleksi karyawan', 'spv rekrutmen', 'supervisor recruitment', 'recruitment supervisor',
      'manager recruitment', 'recruitment manager', 'manajer rekrutmen', 'talent acquisition lead',
      'talent acquisition manager', 'talent acquisition supervisor', 'lead recruiter', 'senior recruiter',
      'staff rekruter', 'officer rekrutmen', 'spesialis rekrutmen', 'koordinator rekrutmen', 'spv recruitment'
    ],
    strongKeywords: ['recruiter', 'recruitment', 'talent acquisition', 'rekrutmen', 'headhunter', 'hiring', 'interview kandidat', 'rekrutmen karyawan', 'sourcing kandidat'],
    secondaryKeywords: ['sourcing', 'job portal', 'screening cv', 'psikotes', 'job vacancy'],
    mustIncludeAny: ['recruiter', 'recruitment', 'talent acquisition', 'rekrutmen', 'headhunter', 'hiring', 'rekruter']
  },
  {
    key: 'training_learning_dev',
    code: 'LND',
    exactPhrases: [
      'learning and development', 'l&d', 'lnd', 'training specialist', 'staff pelatihan', 'pelatihan sdm',
      'corporate trainer', 'training coordinator', 'training officer', 'instruktur pelatihan',
      'employee training', 'people development specialist', 'learning development',
      'learning and development coordinator', 'training supervisor', 'spv training', 'supervisor training',
      'training manager', 'manajer pelatihan', 'lead trainer', 'l&d specialist', 'l&d manager',
      'l&d supervisor', 'spv l&d', 'learning & development lead', 'people development supervisor',
      'people development manager', 'trainer sdm', 'instruktur corporate training'
    ],
    strongKeywords: ['training', 'pelatihan', 'learning and development', 'l&d', 'trainer', 'tna', 'training needs', 'people development'],
    secondaryKeywords: ['modul pelatihan', 'onboarding training', 'evaluasi pelatihan', 'silabus', 'workshop'],
    mustIncludeAny: ['training', 'pelatihan', 'l&d', 'learning', 'trainer']
  },
  {
    key: 'organizational_development',
    code: 'ODD',
    exactPhrases: [
      'organizational development', 'od', 'od specialist', 'pengembangan organisasi', 'budaya kerja',
      'kpi specialist', 'performance management specialist', 'restrukturisasi organisasi', 'corporate culture',
      'od supervisor', 'od manager', 'spv od', 'manajer pengembangan organisasi', 'culture lead', 'culture specialist',
      'spesialis od', 'performance management lead', 'kpi supervisor', 'job grading specialist'
    ],
    strongKeywords: ['organizational development', 'od', 'budaya kerja', 'kpi', 'performance management', 'pengembangan organisasi'],
    secondaryKeywords: ['kompetensi', 'job grading', 'career path', 'okr'],
    mustIncludeAny: ['organizational development', 'od', 'budaya kerja', 'kpi', 'pengembangan organisasi']
  },
  {
    key: 'hr_business_partner',
    code: 'HBP',
    exactPhrases: [
      'hr business partner', 'hrbp', 'strategic hr partner', 'people partner', 'hr consultant internal',
      'senior hrbp', 'lead hrbp', 'hr business partner specialist', 'hrbp supervisor', 'hrbp manager',
      'business unit hr partner', 'divisional hr partner', 'people & business partner'
    ],
    strongKeywords: ['hr business partner', 'hrbp', 'people partner', 'strategic hr', 'hrbp lead'],
    secondaryKeywords: ['business unit hr', 'talent management', 'strategic partner'],
    mustIncludeAny: ['hrbp', 'business partner', 'hr business partner']
  },
  {
    key: 'compensation_benefits_payroll',
    code: 'CNB',
    exactPhrases: [
      'compensation and benefits', 'comben', 'c&b', 'payroll specialist', 'staff payroll', 'payroll officer',
      'gaji karyawan', 'remunerasi', 'bpjs ketenagakerjaan', 'pph 21', 'salary admin', 'payroll manager', 'payroll',
      'staff payroll personalia', 'staff penggajian personalia payroll', 'payroll supervisor', 'spv payroll',
      'supervisor payroll', 'manajer payroll', 'manajer penggajian', 'compensation & benefits specialist',
      'c&b specialist', 'c&b supervisor', 'c&b manager', 'remuneration specialist', 'staff penggajian',
      'petugas payroll', 'payroll lead', 'senior payroll officer'
    ],
    strongKeywords: ['payroll', 'compensation and benefits', 'comben', 'c&b', 'gaji', 'remunerasi', 'bpjs', 'pph 21', 'penggajian'],
    secondaryKeywords: ['slip gaji', 'overtime', 'tunjangan', 'ter pph 21', 'upah'],
    mustIncludeAny: ['payroll', 'compensation', 'comben', 'c&b', 'gaji', 'remunerasi', 'penggajian']
  },
  {
    key: 'industrial_relations_compliance',
    code: 'IRL',
    exactPhrases: [
      'industrial relations', 'hubungan industrial', 'hubungan ketenagakerjaan', 'uu ketenagakerjaan',
      'mediator sengketa kerja', 'serikat pekerja', 'perjanjian kerja bersama', 'pkb', 'disnaker',
      'staff hubungan industrial disnaker', 'ir specialist', 'ir supervisor', 'ir manager',
      'manajer hubungan industrial', 'supervisor hubungan industrial', 'spv ir', 'spv hubungan industrial',
      'labor relations specialist', 'labor relations manager', 'spesialis hubungan industrial'
    ],
    strongKeywords: ['industrial relations', 'hubungan industrial', 'disnaker', 'uu ketenagakerjaan', 'serikat pekerja', 'labor relations'],
    secondaryKeywords: ['mediasi', 'pkwt', 'pkwtt', 'peraturan perusahaan', 'tripartit', 'bipartit'],
    mustIncludeAny: ['industrial relations', 'hubungan industrial', 'disnaker', 'serikat pekerja', 'labor relations']
  },
  {
    key: 'people_analytics_hris',
    code: 'PAS',
    exactPhrases: [
      'people analytics', 'hris specialist', 'hr data analyst', 'hr database', 'sistem informasi sdm',
      'workforce analytics', 'mekari specialist', 'talenta specialist', 'sunfish admin',
      'hris supervisor', 'hris manager', 'hr data specialist', 'hr analytics officer', 'hris officer'
    ],
    strongKeywords: ['people analytics', 'hris', 'hr data', 'workforce analytics', 'sistem informasi sdm'],
    secondaryKeywords: ['turnover rate', 'headcount analysis', 'dashboard sdm'],
    mustIncludeAny: ['people analytics', 'hris', 'talenta', 'sunfish', 'workforce analytics']
  },
  {
    key: 'employer_branding_campus',
    code: 'EBR',
    exactPhrases: [
      'employer branding', 'campus recruitment', 'campus hiring', 'magang coordinator', 'internship program',
      'university relations', 'karir expo lead', 'student ambassador lead', 'employer branding specialist',
      'employer branding lead', 'campus relation specialist', 'employer branding supervisor'
    ],
    strongKeywords: ['employer branding', 'campus hiring', 'campus recruitment', 'magang program', 'university relations'],
    secondaryKeywords: ['job fair', 'karir kampus', 'student relations'],
    mustIncludeAny: ['employer branding', 'campus', 'university relations']
  },

  // ==========================================
  // GRUP 7: PEMASARAN, HUMAS & CUSTOMER SERVICE
  // ==========================================
  {
    key: 'marketing',
    code: 'MKT',
    exactPhrases: [
      'marketing staff', 'staff marketing', 'marketing officer', 'marketing specialist', 'marketing executive',
      'marketing coordinator', 'marketing manager', 'staff pemasaran', 'pemasaran produk', 'digital marketing',
      'manajer marketing', 'manajer pemasaran', 'supervisor marketing', 'spv marketing', 'marketing lead',
      'head of marketing', 'marketing supervisor', 'area marketing manager', 'marketing communication manager'
    ],
    strongKeywords: ['marketing', 'pemasaran', 'campaign', 'promosi produk', 'supervisor marketing', 'spv marketing', 'marketing manager'],
    secondaryKeywords: ['market research', 'branding', 'brosur', 'sales marketing'],
    negativeKeywords: ['admin sales', 'social media admin', 'medsos', 'customer service', 'cs']
  },
  {
    key: 'public_relations',
    code: 'PRS',
    exactPhrases: [
      'public relations', 'pr', 'pr officer', 'pr specialist', 'humas', 'hubungan masyarakat',
      'corporate communications', 'corcom', 'media relations', 'juru bicara', 'press release specialist',
      'spv humas', 'pr manager', 'manajer humas', 'supervisor humas', 'pr supervisor', 'head of pr'
    ],
    strongKeywords: ['public relations', 'pr', 'humas', 'hubungan masyarakat', 'corporate communications', 'corcom', 'media relations', 'pr supervisor', 'pr manager'],
    secondaryKeywords: ['siaran pers', 'konferensi pers', 'wartawan', 'liputan media', 'press release'],
    mustIncludeAny: ['public relations', 'pr', 'humas', 'hubungan masyarakat', 'corcom', 'corporate communications']
  },
  {
    key: 'customer_service_operations',
    code: 'CSO',
    exactPhrases: [
      'customer service', 'cs', 'cs staff', 'staff cs', 'customer care', 'layanan pelanggan',
      'pelayanan pelanggan', 'call center', 'call center officer', 'contact center', 'helpdesk',
      'helpdesk support', 'frontliner service', 'petugas layanan', 'cs online', 'customer support',
      'customer support specialist', 'client care', 'staff customer service cs', 'staff pelayanan pelanggan cs',
      'cs supervisor', 'spv cs', 'supervisor customer service', 'cs manager', 'manajer customer service',
      'team leader cs', 'leader cs', 'call center lead', 'customer service lead', 'head of customer service'
    ],
    strongKeywords: ['customer service', 'customer care', 'call center', 'layanan pelanggan', 'pelayanan pelanggan', 'helpdesk', 'contact center', 'customer support', 'cs supervisor', 'spv cs', 'cs manager'],
    secondaryKeywords: ['csat', 'tiket komplain', 'live chat', 'telepon pelanggan'],
    mustIncludeAny: ['customer service', 'customer care', 'call center', 'layanan pelanggan', 'pelayanan pelanggan', 'helpdesk', 'contact center', 'customer support', 'cs']
  },
  {
    key: 'marcom_branding',
    code: 'MCB',
    exactPhrases: [
      'marcom', 'marketing communications', 'brand activation', 'komunikasi pemasaran',
      'event marketing lead', 'promosi brand', 'marcom specialist', 'marcom manager',
      'marcom supervisor', 'spv marcom', 'brand communication manager'
    ],
    strongKeywords: ['marcom', 'marketing communications', 'brand activation', 'komunikasi pemasaran', 'marcom supervisor'],
    secondaryKeywords: ['sponsorship', 'kolaborasi brand', 'media promosi'],
    mustIncludeAny: ['marcom', 'marketing communications', 'brand activation', 'komunikasi pemasaran']
  },
  {
    key: 'performance_marketing_ads',
    code: 'PMA',
    exactPhrases: [
      'performance marketing', 'paid ads', 'meta ads specialist', 'google ads specialist',
      'facebook ads', 'media buyer', 'sem specialist', 'iklan berbayar', 'digital advertising specialist',
      'performance marketing manager', 'lead performance marketing'
    ],
    strongKeywords: ['performance marketing', 'meta ads', 'google ads', 'media buyer', 'sem', 'roas', 'cpc'],
    secondaryKeywords: ['conversion rate', 'retargeting', 'pixel'],
    mustIncludeAny: ['performance marketing', 'meta ads', 'google ads', 'facebook ads', 'media buyer', 'sem', 'paid ads']
  },
  {
    key: 'ecommerce_marketplace_ops',
    code: 'ECO',
    exactPhrases: [
      'ecommerce', 'e commerce', 'marketplace specialist', 'admin marketplace', 'admin shopee',
      'admin tokopedia', 'admin tiktok shop', 'toko online specialist', 'live streamer host',
      'host live streaming', 'live commerce', 'ecommerce operations', 'admin e commerce',
      'admin e commerce marketplace shopee tokped', 'ecommerce supervisor', 'spv ecommerce',
      'ecommerce manager', 'marketplace lead'
    ],
    strongKeywords: ['ecommerce', 'e commerce', 'marketplace', 'shopee', 'tokopedia', 'tiktok shop', 'live streaming', 'live streamer', 'ecommerce supervisor'],
    secondaryKeywords: ['flash sale', 'voucher toko', 'pesanan marketplace', 'etalase'],
    mustIncludeAny: ['ecommerce', 'e commerce', 'marketplace', 'shopee', 'tokopedia', 'tiktok shop', 'live streamer', 'live streaming']
  },
  {
    key: 'social_media_content_lead',
    code: 'SMM',
    exactPhrases: [
      'social media', 'admin medsos', 'admin media sosial', 'sosmed specialist', 'social media specialist',
      'content creator', 'konten kreator', 'copywriter', 'admin tiktok', 'admin instagram',
      'social media officer', 'social media manager', 'creative content lead', 'spesialis media sosial',
      'spesialis media sosial kreator konten', 'social media supervisor', 'spv medsos', 'head of social media'
    ],
    strongKeywords: ['social media', 'medsos', 'sosmed', 'content creator', 'konten kreator', 'copywriter', 'instagram', 'tiktok'],
    secondaryKeywords: ['engagement', 'reels', 'story', 'caption', 'feeds'],
    mustIncludeAny: ['social media', 'medsos', 'sosmed', 'content creator', 'konten kreator', 'copywriter', 'instagram', 'tiktok']
  },
  {
    key: 'growth_marketing_lead',
    code: 'GRM',
    exactPhrases: [
      'growth marketing', 'growth lead', 'user acquisition', 'growth hacker', 'funnel optimization',
      'lead generation marketing', 'growth marketing specialist', 'growth manager', 'head of growth'
    ],
    strongKeywords: ['growth marketing', 'growth hacker', 'user acquisition', 'growth lead'],
    secondaryKeywords: ['a/b testing', 'funnel', 'retention marketing'],
    mustIncludeAny: ['growth marketing', 'growth hacker', 'growth lead']
  },
  {
    key: 'brand_manager_creative',
    code: 'BRM',
    exactPhrases: [
      'brand manager', 'brand specialist', 'brand strategy', 'desainer grafis', 'graphic designer',
      'creative director', 'brand identity', 'visual branding', 'spesialis brand', 'head of brand'
    ],
    strongKeywords: ['brand manager', 'brand strategy', 'graphic designer', 'desainer grafis', 'creative director', 'brand identity'],
    secondaryKeywords: ['panduan brand', 'visual guideline', 'tipografi']
  },

  // ==========================================
  // GRUP 8: KEUANGAN, AKUNTANSI & PAJAK
  // ==========================================
  {
    key: 'finance_accounting',
    code: 'ACC',
    exactPhrases: [
      'finance accounting', 'finance & accounting', 'accounting staff', 'staff akuntansi',
      'accounting officer', 'finance staff', 'staff finance', 'staff keuangan',
      'pembukuan', 'bookkeeper', 'general ledger', 'accounting manager', 'finance manager',
      'manajer keuangan', 'manajer akuntansi', 'supervisor finance', 'supervisor accounting',
      'spv finance', 'spv accounting', 'spv keuangan', 'spv akuntansi', 'laporan keuangan',
      'financial report specialist', 'akuntan', 'accountant', 'finance', 'accounting',
      'staff keuangan dan akuntansi', 'head of finance', 'finance lead', 'senior accountant'
    ],
    strongKeywords: ['accounting', 'akuntansi', 'pembukuan', 'bookkeeper', 'general ledger', 'neraca', 'laba rugi', 'finance', 'supervisor finance', 'spv finance', 'accounting manager', 'finance manager'],
    secondaryKeywords: ['jurnal', 'rekonsiliasi bank', 'financial statement', 'tutup buku']
  },
  {
    key: 'financial_analyst_cost',
    code: 'FAC',
    exactPhrases: [
      'financial analyst', 'analis keuangan', 'cost control', 'pengendalian biaya', 'cost accountant',
      'akuntansi biaya', 'hpp analyst', 'budgeting specialist', 'fp&a', 'financial planning & analysis',
      'junior financial analyst', 'cost control supervisor', 'spv cost control', 'finance analyst manager'
    ],
    strongKeywords: ['financial analyst', 'cost control', 'cost accounting', 'hpp', 'budgeting', 'fp&a'],
    secondaryKeywords: ['varians biaya', 'forecast keuangan', 'margin'],
    mustIncludeAny: ['financial analyst', 'cost control', 'cost accounting', 'hpp', 'budgeting', 'fp&a']
  },
  {
    key: 'tax_accounting_officer',
    code: 'TAX',
    exactPhrases: [
      'tax staff', 'staff tax', 'staff pajak', 'tax officer', 'tax specialist',
      'spesialis pajak', 'konsultan pajak', 'brevet pajak', 'brevet ab', 'e faktur', 'spt tahunan',
      'pph 21 23', 'ppn specialist', 'tax compliance', 'tax', 'senior tax consultant',
      'staff perpajakan verifikasi spt', 'tax supervisor', 'spv tax', 'spv pajak', 'supervisor pajak',
      'tax manager', 'manajer pajak', 'head of tax'
    ],
    strongKeywords: ['tax', 'pajak', 'brevet', 'e faktur', 'pph', 'ppn', 'spt', 'fiskal', 'tax supervisor', 'spv tax'],
    secondaryKeywords: ['efaktur', 'pajak penghasilan', 'kantor pajak', 'faktur pajak'],
    mustIncludeAny: ['tax', 'pajak', 'brevet', 'e faktur', 'pph', 'ppn', 'spt']
  },
  {
    key: 'ap_ar_accounting',
    code: 'APA',
    exactPhrases: [
      'accounts payable', 'ap staff', 'accounts receivable', 'ar staff', 'ap ar', 'hutang piutang',
      'staff piutang', 'staff hutang', 'penagihan piutang', 'cash management', 'rekonsiliasi piutang'
    ],
    strongKeywords: ['accounts payable', 'accounts receivable', 'ap ar', 'hutang piutang', 'piutang'],
    secondaryKeywords: ['aging schedule', 'kontra bon', 'penagihan'],
    mustIncludeAny: ['accounts payable', 'accounts receivable', 'ap ar', 'hutang piutang', 'piutang', 'hutang']
  },
  {
    key: 'pricing_commercial_analyst',
    code: 'PSC',
    exactPhrases: [
      'pricing analyst', 'analis harga', 'commercial analyst', 'profitabilitas sku', 'pricing specialist',
      'strategi harga', 'margin analyst'
    ],
    strongKeywords: ['pricing', 'analis harga', 'commercial analyst', 'margin analyst'],
    secondaryKeywords: ['mark up', 'diskon promo'],
    mustIncludeAny: ['pricing', 'analis harga', 'commercial analyst']
  },
  {
    key: 'internal_audit_finance',
    code: 'IAF',
    exactPhrases: [
      'internal audit', 'auditor internal', 'internal auditor', 'kepatuhan finansial', 'audit operasional',
      'pemeriksa keuangan', 'fraud auditor', 'junior auditor', 'senior auditor', 'auditor'
    ],
    strongKeywords: ['internal audit', 'auditor', 'audit keuangan', 'fraud', 'temuan audit'],
    secondaryKeywords: ['kertas kerja audit', 'risk based audit'],
    mustIncludeAny: ['audit', 'auditor']
  },

  // ==========================================
  // GRUP 9: DIGITAL, ERP & TEKNOLOGI
  // ==========================================
  {
    key: 'digital_transformation',
    code: 'DIG',
    exactPhrases: [
      'digital transformation', 'transformasi digital', 'process automation', 'otomasi bisnis',
      'digital solutions specialist', 'digital innovation'
    ],
    strongKeywords: ['digital transformation', 'transformasi digital', 'otomasi proses', 'digital innovation'],
    secondaryKeywords: ['paperless', 'digitalisasi'],
    mustIncludeAny: ['digital transformation', 'transformasi digital', 'process automation', 'otomasi bisnis']
  },
  {
    key: 'software_development',
    code: 'SWE',
    exactPhrases: [
      'software engineer', 'software developer', 'programmer', 'backend developer', 'fullstack developer',
      'mobile developer', 'android developer', 'ios developer', 'web developer', 'pembuat aplikasi',
      'fullstack software engineer'
    ],
    strongKeywords: ['software engineer', 'software developer', 'programmer', 'backend', 'fullstack', 'api', 'database', 'web developer'],
    secondaryKeywords: ['git', 'golang', 'nodejs', 'python', 'sql'],
    negativeKeywords: ['frontend', 'front end', 'react developer', 'ui developer']
  },
  {
    key: 'business_systems_analyst',
    code: 'BSA',
    exactPhrases: [
      'business analyst', 'systems analyst', 'analis sistem', 'analis bisnis', 'system flow analyst',
      'it business analyst', 'functional consultant', 'analis sistem informasi'
    ],
    strongKeywords: ['business analyst', 'systems analyst', 'analis sistem', 'analis bisnis', 'brd', 'user story'],
    secondaryKeywords: ['flowchart', 'requirement gathering'],
    mustIncludeAny: ['business analyst', 'systems analyst', 'analis sistem', 'analis bisnis']
  },
  {
    key: 'data_business_reporting',
    code: 'DAT',
    exactPhrases: [
      'data analyst', 'analis data', 'business reporting', 'pelaporan data bisnis', 'data specialist',
      'operations data analyst', 'analis pelaporan', 'data reporting analyst'
    ],
    strongKeywords: ['data analyst', 'analis data', 'business reporting', 'pelaporan bisnis', 'excel advanced'],
    secondaryKeywords: ['vlookup', 'pivot table', 'query data'],
    negativeKeywords: ['hris', 'people analytics']
  },
  {
    key: 'frontend_developer',
    code: 'FED',
    exactPhrases: [
      'frontend developer', 'front end developer', 'react developer', 'web programmer frontend',
      'ui developer', 'web designer html', 'frontend engineer', 'pengembang antarmuka web',
      'frontend web developer', 'front end web developer'
    ],
    strongKeywords: ['frontend', 'react', 'typescript', 'javascript', 'html', 'css', 'tailwind'],
    secondaryKeywords: ['component', 'responsive ui'],
    mustIncludeAny: ['frontend', 'front end', 'react', 'ui developer']
  },
  {
    key: 'product_manager',
    code: 'PDM',
    exactPhrases: [
      'product manager', 'associate product manager', 'apm', 'product owner', 'po', 'manajer produk digital',
      'saas product manager', 'digital product specialist'
    ],
    strongKeywords: ['product manager', 'product owner', 'apm', 'manajer produk', 'product roadmap'],
    secondaryKeywords: ['wireframe', 'mvp', 'backlog'],
    mustIncludeAny: ['product manager', 'product owner', 'apm', 'manajer produk digital']
  },
  {
    key: 'erp_crm_implementation',
    code: 'ERP',
    exactPhrases: [
      'erp consultant', 'konsultan erp', 'implementasi crm', 'odoo specialist', 'sap specialist',
      'erp implementor', 'salesforce admin', 'crm specialist'
    ],
    strongKeywords: ['erp', 'odoo', 'sap', 'salesforce', 'crm implementation'],
    secondaryKeywords: ['modul erp', 'user training erp'],
    mustIncludeAny: ['erp', 'odoo', 'sap', 'salesforce', 'crm']
  },
  {
    key: 'bi_dashboard_specialist',
    code: 'BIA',
    exactPhrases: [
      'business intelligence', 'bi analyst', 'dashboard specialist', 'power bi', 'tableau specialist',
      'visualisasi data', 'looker studio specialist', 'bi developer'
    ],
    strongKeywords: ['business intelligence', 'power bi', 'tableau', 'looker studio', 'dashboard specialist', 'dax'],
    secondaryKeywords: ['data modeling', 'kpi dashboard'],
    mustIncludeAny: ['business intelligence', 'power bi', 'tableau', 'looker studio', 'dashboard']
  },

  // ==========================================
  // GRUP 10: MANAJEMEN STRATEGIS & KONSULTANSI
  // ==========================================
  {
    key: 'strategic_management',
    code: 'MGT',
    exactPhrases: [
      'strategic management', 'manajemen strategis', 'general management', 'general manager',
      'tata kelola organisasi', 'strategic planning', 'eksekutif manajemen'
    ],
    strongKeywords: ['strategic management', 'manajemen strategis', 'strategic planning', 'tata kelola'],
    secondaryKeywords: ['rencana strategis', 'visi misi']
  },
  {
    key: 'business_management_consultant',
    code: 'CON',
    exactPhrases: [
      'management consultant', 'konsultan manajemen', 'business consultant', 'konsultan bisnis',
      'advisory', 'rekomendasi restrukturisasi', 'business advisory'
    ],
    strongKeywords: ['management consultant', 'konsultan manajemen', 'business consultant', 'konsultan bisnis', 'advisory'],
    secondaryKeywords: ['kajian bisnis', 'audit operasional'],
    mustIncludeAny: ['consultant', 'konsultan', 'advisory']
  },
  {
    key: 'business_turnaround_specialist',
    code: 'BTR',
    exactPhrases: [
      'business turnaround', 'restrukturisasi bisnis', 'penyehatan bisnis', 'pembenahan sop',
      'turnaround specialist', 'operational restructuring'
    ],
    strongKeywords: ['turnaround', 'restrukturisasi bisnis', 'penyehatan bisnis', 'efisiensi total'],
    secondaryKeywords: ['turnaround plan', 'restrukturisasi'],
    mustIncludeAny: ['turnaround', 'restrukturisasi', 'penyehatan bisnis']
  },
  {
    key: 'public_affairs_lead',
    code: 'PAR',
    exactPhrases: [
      'public affairs', 'urusan publik', 'advokasi kebijakan', 'hubungan stakeholder',
      'regulasi pemerintah', 'external affairs manager', 'public policy'
    ],
    strongKeywords: ['public affairs', 'urusan publik', 'advokasi', 'public policy', 'stakeholder relations'],
    secondaryKeywords: ['kebijakan publik', 'regulasi'],
    mustIncludeAny: ['public affairs', 'urusan publik', 'advokasi', 'public policy']
  }
];

/**
 * Mesin Pencocok Presisi Bilingual
 * Menghitung skor kecocokan matematis berbasis bobot frasa, kata kunci kuat,
 * dan penalti kata kunci negatif dengan proteksi boundary kata.
 */
export function matchPresetBilingual(rawJobTitle: string): RolePresetOption {
  if (!rawJobTitle || !rawJobTitle.trim()) {
    return ALL_ROLE_PRESETS[0]; // Fallback ke 'optimal'
  }

  const rawClean = rawJobTitle.trim().toLowerCase();

  // 1. Cek kecocokan langsung via kode 3-karakter atau nama key persis (misal 'ADM', 'PMO', 'WHA', 'office_administration')
  const directMatch = ALL_ROLE_PRESETS.find(
    (p) =>
      p.code.toLowerCase() === rawClean ||
      p.key.toLowerCase() === rawClean ||
      p.code.toLowerCase() === rawClean.replace(/[^a-z0-9]/g, '')
  );
  if (directMatch) return directMatch;

  // 2. Normalisasi teks posisi (kebal bahasa ID/EN, ejaan, tanda baca, noise OCR)
  const normalized = normalizeJobTitle(rawJobTitle);

  let bestMatchKey = 'optimal';
  let highestScore = 0;

  for (const rule of BILINGUAL_PRESET_RULES) {
    // Jika aturan memiliki syarat mutlak, pastikan salah satu katanya ada
    if (rule.mustIncludeAny && rule.mustIncludeAny.length > 0) {
      const hasRequired = rule.mustIncludeAny.some((req) => {
        const normReq = normalizeJobTitle(req);
        return matchesWordBoundary(normalized, normReq) || normalized.includes(normReq);
      });
      if (!hasRequired) continue;
    }

    let score = 0;

    // A. Frasa persis / multi-word phrases (+350 jika identik, +260 jika cocok boundary)
    for (const phrase of rule.exactPhrases) {
      const normPhrase = normalizeJobTitle(phrase);
      if (normalized === normPhrase) {
        score += 350; // Identik sempurna
      } else if (matchesWordBoundary(normalized, normPhrase)) {
        score += 260; // Mengandung frasa lengkap dengan batas kata aman
      } else if (normPhrase.length >= 6 && normPhrase.includes(normalized) && normalized.length >= 4) {
        score += 180;
      }
    }

    // B. Kata kunci kuat (+65 poin per kecocokan kata utuh dengan batas kata aman)
    for (const kw of rule.strongKeywords) {
      const normKw = normalizeJobTitle(kw);
      if (!normKw) continue;
      if (matchesWordBoundary(normalized, normKw)) {
        score += 65;
      }
    }

    // C. Kata kunci sekunder (+20 poin)
    if (rule.secondaryKeywords) {
      for (const sk of rule.secondaryKeywords) {
        const normSk = normalizeJobTitle(sk);
        if (normSk && matchesWordBoundary(normalized, normSk)) {
          score += 20;
        }
      }
    }

    // D. Penalti kata kunci negatif (-200 poin agar tidak salah sasaran)
    if (rule.negativeKeywords) {
      for (const nk of rule.negativeKeywords) {
        const normNk = normalizeJobTitle(nk);
        if (!normNk) continue;
        if (matchesWordBoundary(normalized, normNk)) {
          score -= 200;
        }
      }
    }

    if (score > highestScore) {
      highestScore = score;
      bestMatchKey = rule.key;
    }
  }

  // Jika skor cukup meyakinkan (>= 40), kembalikan preset terbaik
  if (highestScore >= 40) {
    const found = ALL_ROLE_PRESETS.find((p) => p.key === bestMatchKey);
    if (found) return found;
  }

  // 3. Cadangan: Fallback ke pengecekan token cerdas terhadap titleId, positionsId, titleEn, positionsEn
  const tokens = normalized.split(/\s+/).filter((t) => t.length > 2);
  let tokenBestKey = 'optimal';
  let tokenHighScore = 0;

  for (const preset of ALL_ROLE_PRESETS) {
    if (preset.key === 'optimal' || preset.key === 'all') continue;
    let tScore = 0;

    const posId = (preset.positionsId || '').toLowerCase();
    const posEn = (preset.positionsEn || '').toLowerCase();
    const titleId = (preset.titleId || '').toLowerCase();
    const titleEn = (preset.titleEn || '').toLowerCase();

    for (const t of tokens) {
      if (matchesWordBoundary(posId, t)) tScore += 15;
      if (matchesWordBoundary(posEn, t)) tScore += 15;
      if (matchesWordBoundary(titleId, t)) tScore += 15;
      if (matchesWordBoundary(titleEn, t)) tScore += 15;
    }

    if (tScore > tokenHighScore) {
      tokenHighScore = tScore;
      tokenBestKey = preset.key;
    }
  }

  if (tokenHighScore >= 20) {
    const found = ALL_ROLE_PRESETS.find((p) => p.key === tokenBestKey);
    if (found) return found;
  }

  // Default jika tidak ada yang cocok sama sekali
  return ALL_ROLE_PRESETS[0]; // 'optimal'
}
