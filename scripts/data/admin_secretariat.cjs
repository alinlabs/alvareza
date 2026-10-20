module.exports = [
  {
    key: 'office_administration',
    code: 'ADM',
    exactPhrases: [
      'staff admin', 'admin staff', 'office admin', 'office administrator', 'admin kantor',
      'staff admin kantor', 'staff admin umum', 'general admin', 'administrative assistant',
      'back office', 'staff back office', 'admin back office', 'tata usaha', 'staff tata usaha',
      'staff tu', 'tu', 'tu sekolah', 'tu kantor', 'office coordinator', 'office assistant',
      'general administrative', 'admin perkantoran', 'staff perkantoran', 'clerk', 'office clerk',
      'admin umum', 'staff umum admin', 'administrasi umum', 'resepsionis', 'receptionist',
      'front desk', 'front desk officer', 'front office', 'frontliner', 'document controller',
      'doc controller', 'staff dokumen', 'data entry', 'staff data entry', 'operator data entry',
      'typist', 'juru ketik', 'fast typing', 'touch typing', 'supervisor admin', 'spv admin',
      'admin supervisor', 'head of admin', 'kepala tata usaha', 'kabag tata usaha',
      'office manager', 'manajer administrasi', 'manajer kantor', 'koordinator administrasi',
      'staf administrasi surat', 'pengadministrasi perkantoran', 'staf kearsipan kantor',
      'admin filing', 'sekretariat kantor', 'administrative clerk', 'junior administrator',
      'officer administrasi', 'staf operasional kantor', 'front desk receptionist',
      'reception staff', 'helpdesk admin', 'staf pengadministrasi umum', 'admin operasional kantor',
      'administrative officer', 'office support specialist', 'general administrative officer',
      'front office staff', 'staf kesekretariatan', 'admin mail & filing', 'staf resepsionis kantor',
      'front desk assistant', 'admin administrasi umum', 'staf tata kelola kantor'
    ],
    strongKeywords: [
      'back office', 'tata usaha', 'office assistant', 'office admin', 'admin kantor',
      'administrasi perkantoran', 'admin umum', 'resepsionis', 'receptionist', 'front desk',
      'front office', 'typist', 'touch typing', 'fast typing', 'office coordinator',
      'kearsipan kantor', 'korespondensi'
    ],
    secondaryKeywords: [
      'office', 'kantor', 'general', 'arsip', 'surat menyurat', 'pengetikan', 'typing',
      '72 wpm', 'wpm', 'surat resmi', 'notulensi rapat', 'ekspedisi surat', 'filing document'
    ],
    negativeKeywords: [
      'warehouse', 'gudang', 'tax', 'sales', 'billing', 'kasir', 'project', 'proyek',
      'hospital', 'rs', 'klinik', 'legal', 'social media', 'marketplace', 'purchasing', 'input data', 'data entry',
      'hr', 'hrd', 'recruitment', 'rekrutmen'
    ]
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
      'executive secretary to bod', 'asisten manajer direksi', 'sekretaris komisaris',
      'personal aide', 'confidential secretary', 'executive support specialist',
      'executive coordinator to c-level', 'secretarial officer', 'executive pa',
      'personal assistant to managing director', 'asisten pribadi pimpinan', 'sekretaris dewan direksi',
      'senior executive assistant', 'executive assistant to cfo', 'executive assistant to coo',
      'personal executive assistant', 'head of secretarial', 'lead executive assistant'
    ],
    strongKeywords: [
      'executive assistant', 'personal assistant', 'sekretaris', 'secretary', 'asisten direktur',
      'asisten direksi', 'asisten pribadi', 'executive secretary', 'board secretary',
      'sekretaris pimpinan', 'sekretaris ceo', 'ea to ceo'
    ],
    secondaryKeywords: [
      'agenda', 'jadwal', 'notulensi', 'travel', 'itinerary', 'rapat direksi', 'minutes of meeting',
      'bod meeting', 'confidential', 'protokoler eksekutif', 'executive briefing'
    ],
    negativeKeywords: [
      'proyek', 'project', 'klinik', 'warehouse', 'gudang', 'customer service', 'cs',
      'pelanggan', 'teknisi', 'security', 'cleaning', 'sales canvasser'
    ],
    mustIncludeAny: [
      'assistant', 'sekretaris', 'secretary', 'ea', 'pa', 'asisten'
    ]
  },
  {
    key: 'hospital_office_admin',
    code: 'HOS',
    exactPhrases: [
      'admin rs', 'admin rumah sakit', 'admin klinik', 'hospital admin', 'hospital administrator',
      'healthcare admin', 'clinic admin', 'rekam medis', 'medical records', 'administrasi pasien',
      'patient administration', 'admisi', 'admission staff', 'admin faskes', 'administrasi kesehatan',
      'front office rumah sakit', 'kasir klinik', 'kasir rumah sakit', 'staff pendaftaran rs',
      'petugas rekam medis', 'staf admisi rawat inap', 'staf admisi rawat jalan', 'registrasi pasien',
      'customer service rs', 'staf administrasi bpjs rs', 'verifikator klaim bpjs rs',
      'admin lab klinik', 'admin apotek klinik', 'sekretariat medis', 'medical office coordinator',
      'petugas rmiik', 'rekam medis dan informasi kesehatan', 'staf casemix rs', 'admisi rs',
      'staf loket pendaftaran rs', 'admin penunjang medis', 'administrasi layanan kesehatan',
      'clinic receptionist', 'medical clinic admin', 'staf administrasi faskes pratama'
    ],
    strongKeywords: [
      'rumah sakit', 'hospital', 'klinik', 'clinic', 'rekam medis', 'faskes', 'pasien',
      'admisi', 'healthcare', 'medical record', 'bpjs kesehatan', 'casemix', 'klaim bpjs'
    ],
    secondaryKeywords: [
      'medis', 'medical', 'bpjs kesehatan', 'rawat inap', 'rawat jalan', 'pendaftaran pasien',
      'surat rujukan', 'sep bpjs', 'fasilitas kesehatan', 'faskes pratama'
    ],
    mustIncludeAny: [
      'rs', 'rumah sakit', 'klinik', 'clinic', 'rekam medis', 'faskes', 'pasien',
      'admisi', 'healthcare', 'medical', 'casemix', 'bpjs'
    ]
  },
  {
    key: 'legal_document_admin',
    code: 'LGL',
    exactPhrases: [
      'legal staff', 'staff legal', 'legal admin', 'admin legal', 'legal officer', 'legal specialist',
      'corporate legal', 'legal corporate', 'staff hukum', 'administrasi hukum', 'paralegal',
      'notaris assistant', 'asisten notaris', 'legal document', 'perizinan usaha', 'legal permit',
      'kontrak hukum', 'legal contract', 'document controller', 'doc controller', 'document control',
      'staff dokumen', 'document controller legal', 'staff perizinan', 'legal compliance officer',
      'staf legal drafting', 'staf perizinan dan legalitas', 'legal corporate affairs',
      'junior lawyer assistant', 'staf advokasi dan legal', 'staf perizinan oss',
      'perizinan amdal / lkpm admin', 'contract specialist legal', 'staf legal compliance',
      'legal secretarial staff', 'staf administrasi kontrak', 'legal license specialist',
      'staf pbg slf oss', 'legal documentation officer', 'legal regulatory assistant'
    ],
    strongKeywords: [
      'legal', 'hukum', 'paralegal', 'notaris', 'perizinan', 'permit', 'kontrak', 'litigasi',
      'somasi', 'document controller', 'doc controller', 'document control', 'legal drafting',
      'oss rba', 'lkpm'
    ],
    secondaryKeywords: [
      'compliance', 'kepatuhan', 'akta', 'agreement', 'kearsipan digital', 'bast',
      'perjanjian kerjasama', 'mou', 'pbg', 'slf', 'amdal'
    ],
    mustIncludeAny: [
      'legal', 'hukum', 'paralegal', 'notaris', 'perizinan', 'permit', 'kontrak',
      'litigasi', 'document controller', 'doc controller', 'document control', 'dokumen'
    ]
  },
  {
    key: 'sales_administration',
    code: 'SAD',
    exactPhrases: [
      'admin sales', 'sales admin', 'admin penjualan', 'sales administrator', 'sales support',
      'staff admin sales', 'sales order admin', 'admin order', 'faktur penjualan', 'sales coordinator',
      'commercial admin', 'order processing', 'sales clerk', 'sales admin support',
      'admin marketing sales', 'staff quotation', 'staf pembuat penawaran', 'sales billing admin',
      'sales order processing', 'customer order specialist', 'b2b sales admin', 'telesales admin',
      'admin so', 'sales back office', 'staf pendukung penjualan', 'admin sales counter',
      'showroom sales admin', 'order management specialist', 'sales tracking admin',
      'staf administrasi tender sales', 'commercial sales administrator', 'sales operations admin support'
    ],
    strongKeywords: [
      'sales admin', 'admin sales', 'sales support', 'order processing', 'sales order',
      'faktur penjualan', 'sales coordinator', 'quotation', 'surat penawaran', 'sales back office'
    ],
    secondaryKeywords: [
      'po sales', 'invoice sales', 'sales', 'order so', 'customer po', 'tanda terima penawaran',
      'penjualan b2b', 'monitoring order'
    ],
    mustIncludeAny: [
      'sales', 'order', 'penjualan', 'quotation'
    ]
  },
  {
    key: 'finance_billing_admin',
    code: 'FBA',
    exactPhrases: [
      'admin finance', 'admin keuangan', 'billing admin', 'admin billing', 'admin invoice',
      'invoicing admin', 'admin kasir', 'cashier admin', 'admin penagihan', 'collection admin',
      'finance admin', 'finance clerk', 'admin pembukuan', 'admin piutang', 'finance billing',
      'staff invoice', 'staff billing', 'petugas billing', 'kasir kantor', 'billing officer',
      'staff pembukuan kasir kantor', 'kasir pembukuan', 'staff kasir kantor', 'staf penagihan faktur',
      'invoicing officer', 'staff ar billing', 'invoice controller', 'admin klaim keuangan',
      'staf kasir & administrasi', 'petugas kasir pembukuan', 'staf rekonsiliasi kasir',
      'admin verifikasi tagihan', 'finance administrative assistant', 'staf pembayaran vendor'
    ],
    strongKeywords: [
      'billing', 'invoice', 'admin kasir', 'penagihan', 'admin finance', 'finance admin',
      'kasir kantor', 'invoicing', 'faktur tagihan', 'admin keuangan', 'piutang dagang'
    ],
    secondaryKeywords: [
      'tanda terima', 'kwitansi', 'reimbursement', 'petty cash', 'kas kecil', 'faktur pajak',
      'verifikasi voucher', 'bukti kas keluar', 'tanda bayar'
    ]
  },
  {
    key: 'hr_personnel_admin',
    code: 'HRA',
    exactPhrases: [
      'admin hr', 'admin hrd', 'hr admin', 'hr administrator', 'hrd admin', 'admin personalia',
      'staff personalia', 'personalia', 'hr personalia', 'admin sdm', 'administrasi kepegawaian',
      'personnel admin', 'staff absensi', 'attendance admin', 'staff data karyawan',
      'employee records admin', 'hr assistant', 'personnel officer', 'staff personalia hrd',
      'staf hrd & personalia', 'administrasi kepersonaliaan', 'pengelola data kepegawaian',
      'staf arsip hrd', 'officer hrd personalia', 'hrd support', 'staf cuti dan absensi',
      'staf fingerprint hrd', 'staf administrasi bpjs ketenagakerjaan', 'hr clerk',
      'staf berkas karyawan', 'staf perjanjian kerja pkwt', 'personnel documentation officer'
    ],
    strongKeywords: [
      'personalia', 'admin personalia', 'staff personalia', 'admin hr', 'admin hrd',
      'kepegawaian', 'absensi', 'data karyawan', 'personnel admin', 'hr administrator'
    ],
    secondaryKeywords: [
      'cuti', 'lembur', 'fingerprint', 'pkwt', 'bpjs ketenagakerjaan', 'surat peringatan',
      'file karyawan', 'tata tertib kerja', 'rekap absensi'
    ],
    mustIncludeAny: [
      'personalia', 'kepegawaian', 'absensi', 'admin hr', 'admin hrd', 'hr admin',
      'hrd admin', 'staff personalia', 'personnel'
    ]
  },
  {
    key: 'project_administration',
    code: 'PRA',
    exactPhrases: [
      'project admin', 'admin proyek', 'project administrator', 'administrasi proyek',
      'site admin', 'admin site', 'project clerk', 'sekretaris proyek', 'project secretary',
      'project document controller', 'admin lapangan proyek', 'staff administrasi proyek',
      'proyek lapangan admin', 'admin proyek lapangan', 'site project secretary',
      'staf administrasi tender & proyek', 'admin progress proyek', 'pmo admin assistant',
      'project tracking admin', 'staf spk & bast proyek', 'admin teknik dan proyek',
      'admin proyek konstruksi', 'staf laporan harian proyek', 'project support officer',
      'project logistics admin', 'administrasi opname proyek', 'staf berkas proyek'
    ],
    strongKeywords: [
      'admin proyek', 'project admin', 'site admin', 'document controller proyek',
      'sekretaris proyek', 'admin proyek lapangan', 'bast proyek', 'spk proyek'
    ],
    secondaryKeywords: [
      'rab', 'opname', 'site', 'lapangan', 'time schedule', 'laporan mingguan proyek',
      'kurva s', 'surat perintah kerja', 'berita acara'
    ],
    mustIncludeAny: [
      'admin proyek', 'project admin', 'site admin', 'sekretaris proyek', 'project clerk',
      'administrasi proyek'
    ]
  },
  {
    key: 'procurement_administration',
    code: 'PPA',
    exactPhrases: [
      'procurement admin', 'admin procurement', 'admin purchasing', 'purchasing admin',
      'admin pengadaan', 'admin pembelian', 'purchase order admin', 'admin po', 'admin vendor',
      'procurement clerk', 'sourcing assistant', 'admin logistik pengadaan', 'buyer admin',
      'staf administrasi purchasing', 'order purchasing clerk', 'staf input po supplier',
      'staf administrasi supplier', 'purchasing support officer', 'purchasing assistant',
      'admin pengadaan barang dan jasa', 'staf surat pesanan pembelian', 'admin pr po',
      'vendor database admin', 'procurement documentation specialist', 'admin komparasi harga'
    ],
    strongKeywords: [
      'admin purchasing', 'purchasing admin', 'admin pengadaan', 'procurement admin',
      'purchase order', 'admin po', 'admin pembelian', 'sourcing assistant'
    ],
    secondaryKeywords: [
      'vendor', 'supplier', 'pr po', 'purchase requisition', 'surat jalan supplier',
      'daftar rekanan', 'penawaran harga supplier', 'surat pesanan'
    ],
    mustIncludeAny: [
      'admin purchasing', 'purchasing admin', 'admin pengadaan', 'procurement admin',
      'admin po', 'admin pembelian'
    ]
  },
  {
    key: 'data_entry_admin',
    code: 'DEA',
    exactPhrases: [
      'data entry', 'staff data entry', 'operator data entry', 'data entry clerk',
      'data entry specialist', 'operator input data', 'staff input data', 'admin input data',
      'master data admin', 'admin database', 'data processing clerk', 'verifikator data',
      'operator komputer data', 'data typing', 'input data operator', 'data validation clerk',
      'master sku admin', 'petugas verifikasi data', 'catalog data entry', 'data clerk back office',
      'excel data processor', 'operator entri data', 'staf input master barang',
      'staf validasi dan entri data', 'transcription clerk', 'data entry officer',
      'staf data cleansing', 'operator spreadsheet', 'data input specialist'
    ],
    strongKeywords: [
      'data entry', 'input data', 'master data', 'verifikator data', 'data clerk',
      'entri data', 'data processing', 'operator komputer'
    ],
    secondaryKeywords: [
      'entry', 'typing', 'verifikasi', 'akurasi 100%', 'speed typing', 'excel formulas',
      'spreadsheet', 'data master', 'input formulir'
    ]
  },
  {
    key: 'warehouse_inventory_admin',
    code: 'WHA',
    exactPhrases: [
      'staff gudang', 'admin gudang', 'warehouse admin', 'admin warehouse', 'admin pergudangan',
      'staff admin gudang', 'petugas gudang', 'staff pergudangan', 'admin surat jalan',
      'admin inventory', 'admin stock', 'stock admin', 'inventory admin', 'admin checker gudang',
      'checker gudang admin', 'warehouse clerk', 'admin logistik gudang', 'surat jalan admin',
      'staff input gudang', 'stock controller admin', 'admin gudang logistik',
      'staf penerimaan barang gudang', 'staf surat jalan & do', 'administrasi inventory gudang',
      'clerk inventory sparepart', 'staf tally gudang', 'staf administrasi stok gudang',
      'staf retur dan surat jalan', 'petugas mutasi gudang', 'admin fifo gudang',
      'warehouse documentation clerk', 'staf ekspedisi gudang'
    ],
    strongKeywords: [
      'staff gudang', 'admin gudang', 'warehouse admin', 'admin pergudangan',
      'admin inventory', 'admin stock', 'surat jalan', 'stock controller', 'checker gudang'
    ],
    secondaryKeywords: [
      'checker', 'stock opname', 'gudang', 'warehouse', 'delivery order', 'do',
      'kartu stok', 'bin card', 'fifo', 'barang masuk keluar'
    ],
    mustIncludeAny: [
      'gudang', 'warehouse', 'surat jalan', 'inventory', 'stock'
    ]
  }
];
