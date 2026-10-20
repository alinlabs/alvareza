/**
 * Kamus Komprehensif Sinonim & Persamaan Istilah Karir / Lowongan Kerja Bahasa Indonesia
 * src/data/position-detektor/sinonim-in.ts
 *
 * Digunakan oleh mesin pencocokan presisi (matcher) untuk memperluas kata kunci dari
 * Judul Posisi, Deskripsi Pekerjaan (Jobdesk), dan Syarat/Kualifikasi sehingga sistem
 * mampu mengenali kesamaan makna secara intensif meskipun terminologi bervariasi.
 */

export const SINONIM_INDONESIA: Record<string, string[]> = {
  // =========================================================================
  // 1. HUMAN RESOURCES, SDM, PERSONALIA & TALENT MANAGEMENT
  // =========================================================================
  'hrd': [
    'hr', 'human resources', 'sdm', 'sumber daya manusia', 'personalia', 'kepegawaian',
    'human capital', 'people operations', 'people ops', 'talent management', 'manajemen sdm',
    'hc', 'tata kelola sdm', 'hr department'
  ],
  'hr': [
    'hrd', 'human resources', 'sdm', 'sumber daya manusia', 'personalia', 'kepegawaian',
    'human capital', 'people operations', 'people ops', 'manajemen sdm', 'hc'
  ],
  'sdm': [
    'hr', 'hrd', 'human resources', 'sumber daya manusia', 'personalia', 'kepegawaian',
    'human capital', 'tenaga kerja', 'karyawan', 'manajemen sdm', 'pengembangan sdm'
  ],
  'sumber daya manusia': [
    'hr', 'hrd', 'sdm', 'human resources', 'personalia', 'kepegawaian', 'human capital', 'people operations'
  ],
  'personalia': [
    'hr', 'hrd', 'kepegawaian', 'sdm', 'human resources', 'administrasi personalia',
    'data karyawan', 'kontrak kerja', 'absensi', 'pengarsipan karyawan'
  ],
  'kepegawaian': [
    'personalia', 'hr', 'hrd', 'sdm', 'administrasi karyawan', 'tata usaha kepegawaian', 'status karyawan'
  ],
  'human capital': [
    'hr', 'hrd', 'sdm', 'human resources', 'people operations', 'talent management', 'hc'
  ],
  'people operations': [
    'hr', 'hrd', 'human resources', 'sdm', 'people ops', 'hr operations', 'tata kelola sdm', 'hr service delivery'
  ],
  'people ops': [
    'people operations', 'hr', 'hrd', 'human resources', 'sdm', 'hr operations'
  ],
  'rekrutmen': [
    'recruitment', 'recruiter', 'talent acquisition', 'perekrutan', 'seleksi', 'sourcing',
    'headhunting', 'hiring', 'interview', 'wawancara kerja', 'penjaringan kandidat', 'psikotes', 'asesmen'
  ],
  'recruitment': [
    'rekrutmen', 'talent acquisition', 'recruiter', 'perekrutan', 'seleksi', 'hiring',
    'sourcing', 'interview', 'screening', 'candidate selection'
  ],
  'recruiter': [
    'rekruter', 'recruitment', 'talent acquisition', 'perekrut', 'headhunter', 'talent sourcer'
  ],
  'talent acquisition': [
    'rekrutmen', 'recruitment', 'recruiter', 'perekrutan talenta', 'headhunter', 'hiring', 'sourcing talenta'
  ],
  'payroll': [
    'penggajian', 'gaji', 'upah', 'remunerasi', 'slip gaji', 'pph 21', 'pph21',
    'bpjs ketenagakerjaan', 'bpjstk', 'bpjs kesehatan', 'lembur', 'overtime', 'take home pay',
    'kompensasi', 'benefit', 'tunjangan'
  ],
  'penggajian': [
    'payroll', 'gaji', 'upah', 'remunerasi', 'kompensasi', 'benefit', 'c&b', 'tunjangan',
    'pph 21', 'bpjs', 'slip gaji'
  ],
  'gaji': [
    'payroll', 'penggajian', 'upah', 'remunerasi', 'take home pay', 'slip gaji'
  ],
  'kompensasi': [
    'compensation', 'benefit', 'c&b', 'remunerasi', 'tunjangan', 'upah', 'reward', 'payroll', 'insentif'
  ],
  'pelatihan': [
    'training', 'l&d', 'learning development', 'pengembangan sdm', 'diklat', 'edukasi',
    'workshop', 'pembelajaran', 'mentoring', 'onboarding training', 'coaching'
  ],
  'training': [
    'pelatihan', 'l&d', 'learning development', 'diklat', 'edukasi', 'workshop',
    'pengembangan kompetensi', 'mentoring', 'pembelajaran'
  ],
  'learning & development': [
    'pelatihan', 'training', 'l&d', 'pengembangan karyawan', 'diklat', 'talent development'
  ],
  'hubungan industrial': [
    'industrial relations', 'hi', 'serikat pekerja', 'serikat buruh', 'pkb',
    'perjanjian kerja bersama', 'peraturan perusahaan', 'pp', 'bipartit', 'tripartit',
    'disnaker', 'perselisihan kerja', 'mediasi', 'uu ketenagakerjaan', 'uu cipta kerja'
  ],
  'industrial relations': [
    'hubungan industrial', 'hi', 'serikat pekerja', 'serikat buruh', 'disnaker',
    'pkb', 'perjanjian kerja bersama', 'bipartit', 'tripartit', 'perselisihan hubungan industrial'
  ],
  'labor law': [
    'hukum ketenagakerjaan', 'uu ketenagakerjaan', 'uu cipta kerja', 'labor compliance',
    'kepatuhan hukum ketenagakerjaan', 'hukum perburuhan'
  ],
  'bpjs': [
    'bpjstk', 'bpjs ketenagakerjaan', 'bpjs kesehatan', 'sipp', 'edabu', 'jht', 'jkk',
    'jkm', 'jp', 'jkp'
  ],
  'absensi': [
    'kehadiran', 'presensi', 'fingerprint', 'timesheet', 'cuti', 'izin', 'lembur', 'time attendance'
  ],
  'onboarding': [
    'orientasi karyawan', 'pengenalan karyawan', 'onboarding training', 'induksi karyawan'
  ],
  'kinerja': [
    'kpi', 'performance appraisal', 'penilaian kinerja', 'evaluasi kerja', 'okr', 'target kerja'
  ],
  'kontrak kerja': [
    'pkwt', 'pkwtt', 'surat perjanjian kerja', 'spk', 'perjanjian kerja waktu tertentu'
  ],

  // =========================================================================
  // 2. TINGKAT JABATAN / HIERARKI KEPEMIMPINAN
  // =========================================================================
  'manager': [
    'manajer', 'head', 'kepala', 'lead', 'leader', 'pimpinan', 'kabag', 'kadiv',
    'pengelola', 'in-charge'
  ],
  'manajer': [
    'manager', 'head', 'kepala', 'lead', 'leader', 'pimpinan', 'pengelola', 'kabag', 'kadiv'
  ],
  'supervisor': [
    'spv', 'penyelia', 'pengawas', 'team lead', 'koordinator lapangan', 'kepala regu', 'mandor'
  ],
  'spv': [
    'supervisor', 'penyelia', 'pengawas', 'team lead', 'koordinator'
  ],
  'staff': [
    'staf', 'officer', 'pelaksana', 'anggota', 'admin', 'operator', 'asisten'
  ],
  'staf': [
    'staff', 'officer', 'pelaksana', 'anggota', 'admin', 'operator'
  ],
  'asisten': [
    'assistant', 'sekretaris', 'aide', 'wakil', 'pendamping', 'deputy'
  ],
  'assistant': [
    'asisten', 'sekretaris', 'aide', 'deputy'
  ],
  'koordinator': [
    'coordinator', 'penanggung jawab', 'pic', 'lead', 'penghubung', 'liaison'
  ],
  'coordinator': [
    'koordinator', 'penanggung jawab', 'pic', 'lead', 'liaison'
  ],
  'direktur': [
    'director', 'c-level', 'vp', 'vice president', 'head of', 'general manager', 'gm'
  ],
  'general manager': [
    'gm', 'direktur operasional', 'kepala cabang', 'pimpinan unit', 'head of operations'
  ],
  'kepala': [
    'head', 'manager', 'lead', 'pimpinan', 'chief'
  ],

  // =========================================================================
  // 3. OPERASIONAL, RETAIL, GERAI & STANDARDISASI (SOP)
  // =========================================================================
  'operasional': [
    'operations', 'operational', 'ops', 'tata kelola operasional', 'lapangan',
    'alur kerja', 'efisiensi proses', 'sop', 'supervisi operasional'
  ],
  'operations': [
    'operasional', 'operational', 'ops', 'workflow', 'operations management', 'business operations'
  ],
  'toko': [
    'store', 'outlet', 'gerai', 'cabang', 'ritel', 'retail', 'shop', 'butik', 'minimarket'
  ],
  'store': [
    'toko', 'outlet', 'gerai', 'cabang', 'ritel', 'retail', 'storefront'
  ],
  'gerai': [
    'toko', 'store', 'outlet', 'cabang', 'ritel', 'retail'
  ],
  'outlet': [
    'toko', 'store', 'gerai', 'cabang', 'ritel'
  ],
  'ritel': [
    'retail', 'toko', 'gerai', 'supermarket', 'minimarket', 'fmcg', 'penjualan langsung'
  ],
  'retail': [
    'ritel', 'store', 'toko', 'gerai', 'outlet', 'merchandising'
  ],
  'cabang': [
    'branch', 'unit', 'area', 'kantor cabang', 'outlet'
  ],
  'branch': [
    'cabang', 'unit cabang', 'branch office', 'kantor cabang'
  ],
  'sop': [
    'standard operating procedure', 'prosedur operasional standar', 'prosedur',
    'instruksi kerja', 'ik', 'standardisasi', 'alur kerja', 'workflow', 'tata kerja'
  ],
  'standard operating procedure': [
    'sop', 'prosedur operasional', 'standar kerja', 'workflow'
  ],
  'stock opname': [
    'so', 'penghitungan stok', 'opname fisik', 'cek stok', 'audit persediaan', 'stok barang'
  ],
  'kasir': [
    'cashier', 'pos', 'point of sales', 'kasir toko', 'pembayaran', 'transaksi kasir'
  ],
  'pramuniaga': [
    'sales promotion girl', 'spg', 'sales promotion boy', 'spb', 'shopkeeper', 'pelayan toko', 'crew store'
  ],

  // =========================================================================
  // 4. PROJECT MANAGEMENT & PMO
  // =========================================================================
  'proyek': [
    'project', 'program', 'pekerjaan proyek', 'manajemen proyek', 'pmo'
  ],
  'project': [
    'proyek', 'program', 'project management', 'pmo', 'deliverables'
  ],
  'pmo': [
    'project management office', 'manajemen proyek', 'project operations', 'project coordinator', 'project officer'
  ],
  'project manager': [
    'manajer proyek', 'pmo', 'project lead', 'program manager', 'delivery manager', 'project coordinator'
  ],
  'manajer proyek': [
    'project manager', 'pmo', 'project lead', 'program manager', 'koordinator proyek'
  ],
  'agile': [
    'scrum', 'sprint', 'kanban', 'backlog', 'standup', 'iterasi'
  ],
  'scrum': [
    'agile', 'scrum master', 'sprint', 'backlog grooming', 'retrospective'
  ],
  'milestone': [
    'tahapan proyek', 'target waktu', 'timeline', 'jadwal kerja', 'progress proyek'
  ],
  'timeline': [
    'jadwal', 'time schedule', 'gantt chart', 'tenggat waktu', 'deadline'
  ],

  // =========================================================================
  // 5. KREATIF, MEDIA, VIDEO & KONTEN (CPM)
  // =========================================================================
  'kreatif': [
    'creative', 'konten kreatif', 'ide kreatif', 'desain kreatif', 'produksi kreatif'
  ],
  'creative': [
    'kreatif', 'creative production', 'content creation', 'art direction'
  ],
  'produser': [
    'producer', 'produser konten', 'produser video', 'creative producer', 'executive producer'
  ],
  'video': [
    'videografi', 'shooting', 'rekaman video', 'produksi video', 'video editing', 'videografer'
  ],
  'konten': [
    'content', 'media sosial', 'video konten', 'aset konten', 'creative assets'
  ],
  'creative project': [
    'proyek kreatif', 'creative production', 'media production', 'produksi konten'
  ],

  // =========================================================================
  // 6. ADMINISTRASI, KESEKRETARIATAN & UMUM
  // =========================================================================
  'administrasi': [
    'admin', 'administration', 'kearsipan', 'tata usaha', 'pembukuan', 'surat menyurat',
    'notulensi', 'pengarsipan', 'rekap data', 'entri data', 'data entry', 'clerk'
  ],
  'admin': [
    'administrasi', 'administration', 'staf administrasi', 'tata usaha', 'petugas arsip', 'data entry'
  ],
  'sekretaris': [
    'secretary', 'executive assistant', 'ea', 'personal assistant', 'pa', 'sekretariat', 'notulis'
  ],
  'arsip': [
    'kearsipan', 'filling', 'filing dokumen', 'penataan berkas', 'document controller', 'arsiparis'
  ],
  'surat': [
    'korespondensi', 'surat menyurat', 'surat keluar', 'surat masuk', 'draft surat', 'disposisi'
  ],
  'petty cash': [
    'kas kecil', 'kas operasional', 'uang muka', 'reimbursement', 'reimburse', 'nota belanja'
  ],
  'resepsionis': [
    'receptionist', 'front desk', 'front office', 'penerima tamu', 'telepon kantor'
  ],

  // =========================================================================
  // 7. PEMASARAN (MARKETING) & MEDIA SOSIAL
  // =========================================================================
  'pemasaran': [
    'marketing', 'promosi', 'iklan', 'advertising', 'branding', 'penetrasi pasar', 'kampanye'
  ],
  'marketing': [
    'pemasaran', 'digital marketing', 'promosi', 'branding', 'campaign', 'iklan'
  ],
  'digital marketing': [
    'pemasaran digital', 'online marketing', 'internet marketing', 'social media marketing',
    'ads', 'meta ads', 'google ads', 'seo', 'sem', 'tiktok ads'
  ],
  'social media': [
    'media sosial', 'sosmed', 'instagram', 'tiktok', 'facebook', 'linkedin', 'konten sosmed'
  ],
  'iklan': [
    'advertising', 'ads', 'periklanan', 'billboard', 'endorsement', 'paid ads'
  ],

  // =========================================================================
  // 8. PENJUALAN (SALES) & BUSINESS DEVELOPMENT
  // =========================================================================
  'penjualan': [
    'sales', 'jual', 'toko', 'canvassing', 'closing', 'omset', 'revenue', 'target penjualan'
  ],
  'sales': [
    'penjualan', 'account executive', 'ae', 'sales executive', 'sales representative',
    'sales force', 'direct sales', 'canvasser'
  ],
  'business development': [
    'pengembangan bisnis', 'bizdev', 'bd', 'kemitraan bisnis', 'partnership', 'b2b sales',
    'ekspansi bisnis', 'akuisisi klien'
  ],
  'b2b': [
    'business to business', 'korporat', 'corporate sales', 'institusi', 'kemitraan b2b'
  ],

  // =========================================================================
  // 9. KEUANGAN (FINANCE) & AKUNTANSI (ACCOUNTING)
  // =========================================================================
  'keuangan': [
    'finance', 'arus kas', 'cash flow', 'anggaran', 'budgeting', 'perbendaharaan', 'treasury'
  ],
  'finance': [
    'keuangan', 'financial', 'arus kas', 'cash flow', 'budget', 'treasury', 'pengeluaran kas'
  ],
  'akuntansi': [
    'accounting', 'akunting', 'pembukuan', 'bookkeeping', 'jurnal', 'buku besar',
    'laporan keuangan', 'neraca', 'rugi laba', 'closing bulanan'
  ],
  'accounting': [
    'akuntansi', 'akunting', 'pembukuan', 'general ledger', 'gl', 'financial report', 'trial balance'
  ],
  'pajak': [
    'tax', 'perpajakan', 'pph', 'ppn', 'efaktur', 'e-faktur', 'espt', 'e-spt', 'spt masa', 'spt tahunan', 'faktur pajak'
  ],
  'tax': [
    'pajak', 'perpajakan', 'pph 21', 'pph 23', 'pph 4 ayat 2', 'ppn', 'tax compliance', 'tax planning'
  ],

  // =========================================================================
  // 10. SUPPLY CHAIN, GUDANG & LOGISTIK
  // =========================================================================
  'logistik': [
    'logistics', 'pengiriman', 'distribusi', 'ekspedisi', 'transportasi', 'armada', 'supply chain'
  ],
  'logistics': [
    'logistik', 'freight', 'distribution', 'shipping', 'fleet management', 'supply chain'
  ],
  'gudang': [
    'warehouse', 'pergudangan', 'penyimpanan', 'stok barang', 'inbound', 'outbound', 'picking', 'packing'
  ],
  'warehouse': [
    'gudang', 'pergudangan', 'inventory storage', 'stok', 'logistik gudang'
  ],
  'pengadaan': [
    'purchasing', 'procurement', 'pembelian', 'sourcing supplier', 'po', 'purchase order', 'vendor management'
  ],
  'purchasing': [
    'pengadaan', 'procurement', 'pembelian', 'vendor sourcing', 'negosiasi harga', 'purchase order'
  ],
  'procurement': [
    'pengadaan', 'purchasing', 'tender', 'strategic sourcing', 'manajemen vendor', 'kontrak supplier'
  ],

  // =========================================================================
  // 11. TEKNOLOGI INFORMASI (IT) & PERANGKAT LUNAK
  // =========================================================================
  'it': [
    'teknologi informasi', 'information technology', 'ti', 'tech', 'digital', 'sistem komputer'
  ],
  'developer': [
    'programmer', 'software engineer', 'pengembang aplikasi', 'coder', 'web developer'
  ],
  'software': [
    'perangkat lunak', 'aplikasi', 'sistem informasi', 'program'
  ]
};
