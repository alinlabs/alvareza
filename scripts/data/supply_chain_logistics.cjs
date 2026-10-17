module.exports = [
  {
    key: 'supply_chain_logistics',
    code: 'SCM',
    exactPhrases: [
      'supply chain', 'supply chain manager', 'manajer supply chain', 'scm', 'scm lead',
      'head of supply chain', 'supply chain supervisor', 'spv supply chain', 'supply chain specialist',
      'rantai pasok', 'manajer rantai pasok', 'supply chain officer', 'director of supply chain',
      'direktur supply chain', 'supply chain analyst', 'analis rantai pasok', 'supply chain coordinator',
      'vp supply chain', 'supply chain operations lead', 'end-to-end supply chain manager',
      'lead scm specialist', 'staf manajemen rantai pasok', 'supply chain planner'
    ],
    strongKeywords: [
      'supply chain', 'scm', 'rantai pasok', 'supply chain manager', 'head of supply chain',
      'supply chain operations', 'end-to-end scm'
    ],
    secondaryKeywords: [
      'distribusi multi cabang', 'sinkronisasi pasokan', 'sla pengiriman', 'lead time pengiriman',
      'efisiensi logistik', 'visibilitas supply chain', 'aliran barang'
    ],
    negativeKeywords: [
      'kasir', 'waiter', 'resepsionis', 'content creator', 'telemarketing'
    ]
  },
  {
    key: 'ppic_inventory',
    code: 'PPC',
    exactPhrases: [
      'ppic', 'ppic supervisor', 'spv ppic', 'ppic manager', 'manajer ppic', 'ppic staff',
      'staf ppic', 'production planning and inventory control', 'production planning',
      'inventory control', 'pengendali produksi dan persediaan', 'head of ppic', 'lead ppic',
      'ppic specialist', 'ppic officer', 'production scheduler', 'production planner',
      'staf perencanaan produksi', 'staf kontrol persediaan', 'ppic coordinator', 'ppic engineer'
    ],
    strongKeywords: [
      'ppic', 'production planning', 'inventory control', 'manajer ppic', 'spv ppic',
      'kontrol persediaan', 'perencanaan produksi'
    ],
    secondaryKeywords: [
      'stok fifo', 'buffer stock', 'reorder point', 'jadwal produksi', 'peramalan kebutuhan bahan',
      'kapasitas workshop', 'kartu stok', 'turnover inventory'
    ],
    mustIncludeAny: [
      'ppic', 'production planning', 'inventory control'
    ]
  },
  {
    key: 'procurement_purchasing',
    code: 'PRC',
    exactPhrases: [
      'procurement manager', 'manajer pengadaan', 'purchasing manager', 'manajer purchasing',
      'purchasing supervisor', 'spv purchasing', 'procurement supervisor', 'spv procurement',
      'head of procurement', 'kepala pengadaan', 'senior buyer', 'procurement specialist',
      'purchasing specialist', 'sourcing specialist', 'strategic sourcing manager', 'lead buyer',
      'procurement officer', 'purchasing officer', 'staf purchasing', 'staf pengadaan barang',
      'buyer specialist', 'pengadaan korporat', 'lead procurement specialist', 'staf sourcing vendor'
    ],
    strongKeywords: [
      'procurement manager', 'purchasing manager', 'pengadaan barang', 'procurement supervisor',
      'purchasing supervisor', 'strategic sourcing', 'senior buyer', 'sourcing specialist'
    ],
    secondaryKeywords: [
      'negosiasi harga supplier', 'penghematan biaya 15%', 'termin pembayaran', 'katalog pengadaan',
      'rfq tender', 'vendor agreement', 'kontrak pembelian'
    ],
    negativeKeywords: [
      'admin arsip', 'kasir', 'resepsionis', 'driver'
    ]
  },
  {
    key: 'warehouse_logistics_lead',
    code: 'WHS',
    exactPhrases: [
      'warehouse manager', 'manajer gudang', 'head of warehouse', 'kepala gudang',
      'warehouse supervisor', 'spv gudang', 'logistics supervisor', 'spv logistik',
      'logistics manager', 'manajer logistik', 'warehouse operations manager', 'dc manager',
      'distribution center manager', 'kepala pergudangan', 'warehouse lead', 'warehouse superintendent',
      'distribution center supervisor', 'logistics lead', 'staf supervisor gudang',
      'manajer pusat distribusi', 'lead warehouse operations', 'warehouse operations officer'
    ],
    strongKeywords: [
      'warehouse manager', 'manajer gudang', 'kepala gudang', 'warehouse supervisor',
      'spv gudang', 'logistics manager', 'manajer logistik', 'distribution center'
    ],
    secondaryKeywords: [
      'tata letak gudang', 'wms', 'akurasi stok 99%', 'loading unloading', 'safety gudang',
      'penataan pallet', 'aliran masuk keluar barang', 'inbound outbound'
    ],
    mustIncludeAny: [
      'warehouse', 'gudang', 'distribution center', 'dc manager'
    ]
  },
  {
    key: 'logistics_fleet_dispatch',
    code: 'LDC',
    exactPhrases: [
      'fleet manager', 'manajer armada', 'dispatch supervisor', 'spv armada', 'transportation manager',
      'manajer transportasi', 'fleet supervisor', 'logistics dispatch officer', 'koordinator armada',
      'head of fleet', 'fleet coordinator', 'transport logistics specialist', 'staf pengatur rute',
      'route planning specialist', 'delivery fleet lead', 'staf ekspedisi & armada',
      'pengawas kendaraan logistik', 'traffic and dispatch supervisor', 'fleet maintenance supervisor'
    ],
    strongKeywords: [
      'fleet manager', 'manajer armada', 'dispatch supervisor', 'transportation manager',
      'koordinator armada', 'rute pengiriman', 'distribusi armada'
    ],
    secondaryKeywords: [
      'jadwal dispatch', 'optimasi rute', 'pemeliharaan kendaraan', 'monitoring gps armada',
      'sla ketepatan pengantaran', 'surat jalan kurir', 'biaya solar & tol'
    ],
    mustIncludeAny: [
      'fleet', 'armada', 'dispatch', 'transportation', 'rute', 'transport'
    ]
  },
  {
    key: 'vendor_supplier_management',
    code: 'VMR',
    exactPhrases: [
      'vendor management', 'vendor manager', 'supplier relationship manager', 'srm',
      'vendor performance specialist', 'supplier quality lead', 'head of vendor management',
      'vendor relationship officer', 'koordinator mitra supplier', 'manajer hubungan vendor',
      'supplier performance auditor', 'vendor compliance specialist', 'strategic supplier manager'
    ],
    strongKeywords: [
      'vendor management', 'supplier relationship', 'vendor performance', 'srm',
      'evaluasi supplier', 'kemitraan vendor', 'supplier auditor'
    ],
    secondaryKeywords: [
      'sla supplier', 'scorecard vendor', 'kualitas pasokan', 'audit mutu rekanan',
      'renegosiasi kontrak vendor', 'onboarding rekanan'
    ],
    mustIncludeAny: [
      'vendor', 'supplier', 'srm'
    ]
  },
  {
    key: 'demand_inventory_planning',
    code: 'DIP',
    exactPhrases: [
      'demand planner', 'demand planning manager', 'inventory planner', 'inventory planning specialist',
      'supply and demand analyst', 'forecasting specialist', 'demand & supply planner',
      'stock planning manager', 'staf peramalan permintaan', 'lead demand planner',
      'inventory optimization analyst', 'sales and operations planning specialist', 's&op planner'
    ],
    strongKeywords: [
      'demand planner', 'demand planning', 'inventory planner', 'forecasting persediaan',
      'peramalan permintaan', 's&op'
    ],
    secondaryKeywords: [
      'safety stock modeling', 'seasonality forecasting', 'lead time analysis', 'turnover ratio',
      'dead stock reduction', 'sales and operations planning'
    ],
    mustIncludeAny: [
      'demand', 'peramalan', 'planner', 'planning', 'forecasting', 's&op'
    ]
  }
];
