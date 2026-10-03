/**
 * COMPREHENSIVE JOB POSITIONS CATALOG & EXACT MATCHER
 * Menyimpan ribuan keyword dan nama jabatan standar (Indonesian & English)
 * Digunakan oleh mesin validasi OCR untuk mencocokkan nama posisi secara presisi,
 * sekaligus membersihkan artefak OCR (seperti 'Ee', '1.', 'We', dll).
 */

import { ALL_ROLE_PRESETS } from './rolePresetsConfig';

/**
 * Daftar Jabatan Standar Lengkap Lintas Industri
 */
export const COMPREHENSIVE_JOB_TITLES: string[] = [
  // --- Human Resources & General Affairs (HR / GA) ---
  'HRD Staff',
  'HR Staff',
  'HR Officer',
  'HR Specialist',
  'HR Generalist',
  'HR Manager',
  'HR Supervisor',
  'HR Coordinator',
  'HR Assistant',
  'HR Administrator',
  'HR & GA Staff',
  'HR & GA Supervisor',
  'HR & GA Manager',
  'HR & GA Officer',
  'HRD & GA Staff',
  'HRD & GA Officer',
  'HRD & GA Supervisor',
  'HRD & GA Manager',
  'HRGA Staff',
  'HRGA Officer',
  'HRGA Supervisor',
  'HRGA Manager',
  'Supervisor HR',
  'Supervisor HRD',
  'Supervisor HRGA',
  'Manager HR',
  'Manager HRD',
  'Manager HRGA',
  'Manajer HR',
  'Manajer HRD',
  'Manajer HRGA',
  'Staff HRGA',
  'Talent Acquisition Staff',
  'Talent Acquisition Specialist',
  'Talent Acquisition Officer',
  'Talent Acquisition Lead',
  'Talent Acquisition Supervisor',
  'Talent Acquisition Manager',
  'Recruitment Staff',
  'Recruitment Officer',
  'Recruitment Specialist',
  'Recruitment Supervisor',
  'Recruitment Manager',
  'Recruiter',
  'Spesialis SDM',
  'Staff Personalia',
  'Supervisor Personalia',
  'Staff Payroll',
  'Payroll Officer',
  'Payroll Specialist',
  'Payroll Supervisor',
  'Payroll Manager',
  'Compensation & Benefit Staff',
  'People Operations Specialist',
  'Learning & Development Staff',
  'L&D Specialist',
  'Training Specialist',
  'Training Supervisor',
  'Training Manager',
  'Industrial Relations Officer',
  'Staff Hubungan Industrial',
  'Supervisor Hubungan Industrial',

  // --- Administration, Secretary & Office Support ---
  'Staff Administrasi',
  'Staff Administrasi Operasional',
  'Staff Administrasi Kantor',
  'Staff Administrasi Keuangan',
  'Staff Administrasi Gudang',
  'Staff Administrasi Logistik',
  'Staff Administrasi Sales',
  'Staff Administrasi Marketing',
  'Staff Administrasi Proyek',
  'Staff Administrasi HRD',
  'Admin Operasional',
  'Admin Kantor',
  'Admin Gudang',
  'Admin Logistik',
  'Admin Sales',
  'Admin Marketing',
  'Admin Finance',
  'Admin Keuangan',
  'Admin Pajak',
  'Admin Sosmed',
  'Admin Social Media',
  'Admin Online Shop',
  'Admin Marketplace',
  'Admin E-Commerce',
  'Admin Kasir',
  'Admin Input Data',
  'Data Entry Staff',
  'Data Entry Officer',
  'General Affair Staff',
  'GA Staff',
  'GA Officer',
  'GA Supervisor',
  'GA Manager',
  'Sekretaris',
  'Secretary',
  'Executive Secretary',
  'Executive Assistant',
  'Personal Assistant',
  'Office Administrator',
  'Office Assistant',
  'Office Boy',
  'Office Girl',
  'Front Office Staff',
  'Front Desk Officer',
  'Receptionist',
  'Resepsionis',

  // --- Operations, Retail & Store Management ---
  'Store Manager',
  'Assistant Store Manager',
  'Store Supervisor',
  'Store Leader',
  'Kepala Toko',
  'Wakil Kepala Toko',
  'Kepala Cabang',
  'Branch Manager',
  'Assistant Branch Manager',
  'Supervisor Operasional',
  'Operational Supervisor',
  'Operations Manager',
  'Operational Manager',
  'Operations Officer',
  'Staff Operasional',
  'Operational Staff',
  'Operations Specialist',
  'Business Operations Specialist',
  'Area Manager',
  'Area Supervisor',
  'Area Coordinator',
  'Shift Supervisor',
  'Shift Leader',
  'Team Leader',
  'Management Trainee',
  'Management Trainee Operations',
  'Crew Store',
  'Crew Outlet',
  'Service Crew',
  'Pramuniaga',
  'Kasir',
  'Cashier',
  'Head Cashier',
  'SPG',
  'SPB',
  'Sales Promotion Girl',
  'Sales Promotion Boy',
  'Staff Toko',
  'Pramusaji',
  'Merchandiser',
  'Visual Merchandiser',
  'Floor Supervisor',

  // --- Sales, Marketing, Business Development ---
  'Marketing Staff',
  'Marketing Officer',
  'Marketing Specialist',
  'Marketing Executive',
  'Marketing Supervisor',
  'Marketing Manager',
  'Marketing Coordinator',
  'Staff Marketing',
  'Staff Pemasaran',
  'Digital Marketing Staff',
  'Digital Marketing Specialist',
  'Digital Marketing Officer',
  'Digital Marketer',
  'Sales Staff',
  'Sales Officer',
  'Sales Executive',
  'Sales Representative',
  'Sales Consultant',
  'Sales Supervisor',
  'Sales Manager',
  'Sales Specialist',
  'Sales Associate',
  'Sales Canvasser',
  'Sales Motoris',
  'Sales Counter',
  'Staff Penjualan',
  'Business Development Staff',
  'Business Development Officer',
  'Business Development Executive',
  'Business Development Specialist',
  'Business Development Manager',
  'Account Executive',
  'Senior Account Executive',
  'Key Account Executive',
  'Key Account Manager',
  'Account Manager',
  'B2B Sales Specialist',
  'B2B Sales Executive',
  'Telemarketing',
  'Telemarketing Staff',
  'Telesales',
  'Telesales Officer',
  'Direct Sales Executive',
  'Public Relations Officer',
  'PR Specialist',
  'Brand Specialist',
  'Brand Manager',

  // --- Project Management & PMO ---
  'Project Manager',
  'Assistant Project Manager',
  'Project Officer',
  'Project Coordinator',
  'Project Assistant',
  'Project Administrator',
  'Project Management Officer',
  'PMO Specialist',
  'PMO Officer',
  'Site Manager',
  'Site Supervisor',
  'Site Engineer',
  'Field Officer',
  'Field Coordinator',
  'Event Coordinator',
  'Event Organizer',
  'Event Specialist',

  // --- Supply Chain, Logistics, Warehouse & Procurement ---
  'Logistics Staff',
  'Logistics Officer',
  'Logistics Supervisor',
  'Logistics Manager',
  'Staff Logistik',
  'Staff Gudang',
  'Kepala Gudang',
  'Warehouse Supervisor',
  'Warehouse Manager',
  'Warehouse Staff',
  'Warehouse Officer',
  'Warehouse Admin',
  'Staff Inventory',
  'Inventory Control Staff',
  'Inventory Supervisor',
  'Stock Keeper',
  'Staff Pengadaan',
  'Procurement Staff',
  'Procurement Officer',
  'Procurement Specialist',
  'Procurement Manager',
  'Purchasing Staff',
  'Purchasing Officer',
  'Purchasing Supervisor',
  'Purchasing Manager',
  'Buyer',
  'Supply Chain Staff',
  'Supply Chain Officer',
  'Supply Chain Specialist',
  'Supply Chain Manager',
  'PPIC Staff',
  'PPIC Officer',
  'PPIC Supervisor',
  'Staff Ekspedisi',
  'Dispatcher',
  'Kurir',
  'Driver',
  'Driver Operasional',
  'Driver Logistik',
  'Forklift Operator',
  'Helper Gudang',
  'Picker Packer',
  'Checker Gudang',

  // --- Accounting, Finance & Tax ---
  'Accounting Staff',
  'Accounting Officer',
  'Accounting Supervisor',
  'Accounting Manager',
  'Staff Akuntansi',
  'Finance Staff',
  'Finance Officer',
  'Finance Supervisor',
  'Finance Manager',
  'Staff Keuangan',
  'Finance & Accounting Staff',
  'Finance & Accounting Officer',
  'Tax Staff',
  'Tax Officer',
  'Tax Specialist',
  'Staff Pajak',
  'Auditor',
  'Internal Auditor',
  'Junior Auditor',
  'Senior Auditor',
  'Cost Accountant',
  'Account Payable Staff',
  'Account Receivable Staff',
  'Billing Officer',
  'Cash Management Officer',

  // --- Customer Service & Contact Center ---
  'Customer Service Staff',
  'Customer Service Officer',
  'Customer Service Representative',
  'Customer Service Specialist',
  'Customer Care Officer',
  'Customer Support',
  'Helpdesk Staff',
  'Helpdesk Support',
  'Call Center Officer',
  'Call Center Agent',
  'Contact Center Specialist',
  'Client Relations Officer',
  'Customer Experience Specialist',

  // --- Food & Beverage (F&B) & Hospitality ---
  'Barista',
  'Head Barista',
  'Bartender',
  'Waiter',
  'Waitress',
  'Server',
  'Captain Server',
  'Chef',
  'Head Chef',
  'Sous Chef',
  'Chef de Partie',
  'Cook',
  'Cook Helper',
  'Kitchen Crew',
  'Kitchen Staff',
  'Baker',
  'Pastry Chef',
  'Steward',
  'Dishwasher',
  'Housekeeping Staff',
  'Housekeeping Attendant',
  'Room Attendant',
  'Hotel Front Desk',

  // --- Creative, Media & Content ---
  'Graphic Designer',
  'Junior Graphic Designer',
  'Senior Graphic Designer',
  'Desainer Grafis',
  'Content Creator',
  'Content Writer',
  'Copywriter',
  'Social Media Specialist',
  'Social Media Officer',
  'Social Media Manager',
  'Video Editor',
  'Videographer',
  'Photographer',
  'Motion Graphic Designer',
  'UI/UX Designer',
  'UI Designer',
  'UX Designer',
  'Creative Designer',
  'Creative Director',

  // --- Information Technology & Engineering ---
  'IT Support',
  'IT Staff',
  'IT Officer',
  'IT Specialist',
  'IT Administrator',
  'IT Helpdesk',
  'Network Administrator',
  'Network Engineer',
  'System Administrator',
  'Web Developer',
  'Frontend Developer',
  'Backend Developer',
  'Fullstack Developer',
  'Mobile Developer',
  'Android Developer',
  'iOS Developer',
  'Software Engineer',
  'QA Tester',
  'Quality Assurance Engineer',
  'Database Administrator',
  'DevOps Engineer',
  'Data Analyst',
  'Data Scientist',
  'Data Engineer',
  'Cyber Security Analyst',

  // --- Manufacturing, Quality & Technical ---
  'Operator Produksi',
  'Production Operator',
  'Production Staff',
  'Production Supervisor',
  'Production Manager',
  'Quality Control Staff',
  'QC Inspector',
  'QC Staff',
  'QC Supervisor',
  'Quality Assurance Staff',
  'QA Staff',
  'QA Supervisor',
  'Maintenance Staff',
  'Maintenance Technician',
  'Teknisi Listrik',
  'Teknisi Mesin',
  'Teknisi Gedung',
  'Teknisi AC',
  'Drafter',
  'Engineering Staff',
  'HSE Officer',
  'K3 Officer',
  'Safety Officer',

  // --- Healthcare, Legal, Education & Services ---
  'Staff Legal',
  'Legal Officer',
  'Legal Specialist',
  'Legal Corporate',
  'Perawat',
  'Nurse',
  'Bidan',
  'Apoteker',
  'Asisten Apoteker',
  'Tenaga Teknis Kefarmasian',
  'Analis Kesehatan',
  'Radiografer',
  'Dokter Umum',
  'Guru',
  'Teacher',
  'Tutor',
  'Instruktur',
  'Security',
  'Satpam',
  'Anggota Keamanan',
  'Cleaning Service',
  'Petugas Kebersihan'
];

/**
 * Ekstraksi dinamis semua nama posisi dari konfigurasi preset
 */
export function getPresetRolesList(): string[] {
  const titles = new Set<string>();
  for (const opt of ALL_ROLE_PRESETS) {
    if (opt.titleId) titles.add(opt.titleId.trim());
    if (opt.positionsId) {
      opt.positionsId.split(/[,/•;|\n]+/).forEach(p => {
        const clean = p.trim();
        if (clean && clean.length >= 3 && clean.length <= 45) {
          titles.add(clean);
        }
      });
    }
    if (opt.titleEn) titles.add(opt.titleEn.trim());
    if (opt.positionsEn) {
      opt.positionsEn.split(/[,/•;|\n]+/).forEach(p => {
        const clean = p.trim();
        if (clean && clean.length >= 3 && clean.length <= 45) {
          titles.add(clean);
        }
      });
    }
  }
  return Array.from(titles);
}

/**
 * Daftar master posisi gabungan yang selalu bersih
 */
export const ALL_CANONICAL_POSITIONS: string[] = Array.from(
  new Set([...COMPREHENSIVE_JOB_TITLES, ...getPresetRolesList()])
);

/**
 * Keyword atomik untuk deteksi kombinasi posisi
 */
export const POSITION_KEYWORD_ATOMS = [
  'hrd', 'hr', 'staff', 'supervisor', 'manager', 'spv', 'admin', 'administrator',
  'store', 'operasional', 'operations', 'marketing', 'sales', 'barista', 'kasir',
  'cashier', 'recruiter', 'recruitment', 'accounting', 'finance', 'pajak', 'tax',
  'logistik', 'logistics', 'gudang', 'warehouse', 'purchasing', 'procurement',
  'project', 'pmo', 'designer', 'developer', 'teknisi', 'operator', 'crew',
  'driver', 'kurir', 'security', 'satpam', 'waiter', 'waitress', 'cook', 'chef',
  'customer service', 'cs', 'telemarketing', 'public relations', 'pr', 'qa', 'qc',
  'it support', 'helper', 'checker', 'merchandiser', 'spg', 'spb', 'legal',
  'general affair', 'ga', 'personalia', 'payroll', 'sekretaris', 'secretary'
];

/**
 * Membersihkan kata-kata sampah / artefak OCR di awal/akhir string
 * seperti 'Ee', 'We', '1.', 'A.', '-', '~', '*', 'Posisi:', 'Lowongan:', dll.
 */
export function stripOcrArtifactsFromText(text: string): string {
  return text
    .replace(/^[^a-zA-Z0-9(]+/g, '')
    .replace(/[^a-zA-Z0-9.)]+$/g, '')
    // Hapus artefak OCR kata pendek di awal yang bukan singkatan resmi (misal: 'Ee ', 'Et ', '1. ', 'We ')
    .replace(/^(?:ee|et|oo|ii|aa|we|ad|di|ke|se|un|yo|no|nr|mr|ms|1|2|3|4|5|a|b|c|d|e|f|g)\s+/i, '')
    .replace(/^(?:posisi|position|role|job\s*title|sebagai|dibutuhkan|dibuka|loker|lowongan)\s*[:=\-]\s*/i, '')
    .trim();
}

/**
 * Mesin Pencocok Posisi Presisi Tinggi
 * Mencari kecocokan terbaik di katalog posisi standar.
 * Mengembalikan HANYA nama posisi standar yang bersih tanpa artefak OCR.
 */
export function matchExactJobPositionFromCatalog(rawText: string, lines: string[] = []): string | null {
  const combinedLines = [...lines, rawText].filter(Boolean);
  const fullText = combinedLines.join(' ');
  const cleanFullText = fullText.toLowerCase();

  // 1. Cek Exact Substring Match pada katalog posisi terurut dari yang terpanjang (paling spesifik)
  const sortedCatalog = [...ALL_CANONICAL_POSITIONS].sort((a, b) => b.length - a.length);

  for (const canonical of sortedCatalog) {
    const canonicalLower = canonical.toLowerCase();
    // Gunakan regex boundary kata agar tidak salah cocok parsial
    const escaped = canonicalLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(`(?:^|[^a-zA-Z0-9])${escaped}(?:$|[^a-zA-Z0-9])`, 'i');
    
    if (pattern.test(cleanFullText)) {
      return canonical;
    }
  }

  // 2. Cek gabungan atom keyword posisi penting jika tidak exact match
  if ((cleanFullText.includes('hrga') || (cleanFullText.includes('hr') && cleanFullText.includes('ga'))) && (cleanFullText.includes('supervisor') || cleanFullText.includes('spv'))) {
    return 'HRGA Supervisor';
  }
  if ((cleanFullText.includes('hrga') || (cleanFullText.includes('hr') && cleanFullText.includes('ga'))) && (cleanFullText.includes('manager') || cleanFullText.includes('manajer'))) {
    return 'HRGA Manager';
  }
  if (cleanFullText.includes('hrga') && (cleanFullText.includes('staff') || cleanFullText.includes('staf'))) {
    return 'HRGA Staff';
  }
  if ((cleanFullText.includes('hrd') || cleanFullText.includes('hr')) && (cleanFullText.includes('supervisor') || cleanFullText.includes('spv'))) {
    return 'HR Supervisor';
  }
  if ((cleanFullText.includes('hrd') || cleanFullText.includes('hr')) && (cleanFullText.includes('manager') || cleanFullText.includes('manajer'))) {
    return 'HR Manager';
  }
  if (cleanFullText.includes('hrd') && (cleanFullText.includes('staff') || cleanFullText.includes('staf'))) {
    return 'HRD Staff';
  }
  if (cleanFullText.includes('hr') && cleanFullText.includes('specialist')) {
    return 'HR Specialist';
  }
  if (cleanFullText.includes('hr') && cleanFullText.includes('generalist')) {
    return 'HR Generalist';
  }
  if (cleanFullText.includes('hr') && cleanFullText.includes('officer')) {
    return 'HR Officer';
  }
  if (cleanFullText.includes('store') && cleanFullText.includes('manager')) {
    return 'Store Manager';
  }
  if (cleanFullText.includes('store') && cleanFullText.includes('supervisor')) {
    return 'Store Supervisor';
  }
  if (cleanFullText.includes('admin') && cleanFullText.includes('operasional')) {
    return 'Admin Operasional';
  }
  if (cleanFullText.includes('admin') && cleanFullText.includes('gudang')) {
    return 'Admin Gudang';
  }
  if (cleanFullText.includes('admin') && cleanFullText.includes('sales')) {
    return 'Admin Sales';
  }
  if (cleanFullText.includes('staff') && cleanFullText.includes('administrasi')) {
    return 'Staff Administrasi';
  }
  if (cleanFullText.includes('marketing') && cleanFullText.includes('staff')) {
    return 'Marketing Staff';
  }
  if (cleanFullText.includes('sales') && cleanFullText.includes('executive')) {
    return 'Sales Executive';
  }
  if (cleanFullText.includes('project') && cleanFullText.includes('manager')) {
    return 'Project Manager';
  }
  if (cleanFullText.includes('customer') && cleanFullText.includes('service')) {
    return 'Customer Service';
  }
  if (cleanFullText.includes('barista')) {
    return 'Barista';
  }
  if (cleanFullText.includes('kasir') || cleanFullText.includes('cashier')) {
    return 'Kasir';
  }
  if (cleanFullText.includes('graphic') && cleanFullText.includes('designer')) {
    return 'Graphic Designer';
  }
  if (cleanFullText.includes('content') && cleanFullText.includes('creator')) {
    return 'Content Creator';
  }

  return null;
}
