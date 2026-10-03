import { TailoredProjectSet } from "../types";
export type { TailoredProjectSet };

// --- admin.ts ---
export const adminProjects: TailoredProjectSet = {
    summary:
      'Portofolio tata kelola administrasi operasional, kerapihan arsip dokumen, penyusunan laporan keuangan harian, administrasi tagihan pelanggan, dan konsistensi alur kerja.',
    projects: [
      {
        id: 'proj-10',
        role: 'Administrative & Financial Control Officer',
        organization: 'Tirta Raharja – BPSPAMS',
        sector: 'Water & Sanitation Organization',
        periodType: 'Monthly Project',
        category: 'admin_finance',
        highlights: [
          'Mengelola administrasi operasional dan pelaporan keuangan rutin bulanan untuk 2.000+ pelanggan aktif.',
          'Melakukan pencatatan kas, kalkulasi tagihan bulanan, dan rekonsiliasi berkas penggajian staf.',
          'Mendokumentasikan arsip administrasi dan laporan keuangan secara rapi dan transparan.',
        ],
      },
      {
        id: 'proj-3',
        role: 'Academic & Administrative Operations Officer',
        organization: 'Lingua First',
        sector: 'Lembaga Kursus Bahasa Inggris',
        periodType: 'Collabs 6 Months',
        category: 'operations_retail',
        highlights: [
          'Mengelola administrasi pendaftaran 300+ siswa, pencatatan presensi, dan arsip jadwal tutor.',
          'Menyusun laporan rekapitulasi operasional berkala untuk evaluasi manajemen lembaga.',
        ],
      },
      {
        id: 'proj-12',
        role: 'Interim Operations & Administrative Systems Manager',
        organization: 'PT Shansusdzar Indonesia',
        sector: 'Interior Design & Build',
        periodType: 'Project 1 Month',
        category: 'admin_finance',
        highlights: [
          "Menata ulang sistem pengarsipan administrasi, pencatatan keuangan operasional, dan dokumentasi proyek interior.",
          "Menyusun standardisasi format laporan berkala, surat-menyurat bisnis, dan alur sirkulasi dokumen antar divisi.",
          "Memastikan transparansi data administrasi dan ketertiban pembukuan operasional PT Shansusdzar Indonesia.",
        ],
      },
      {
        id: 'proj-13',
        role: 'Campaign Administration & Content Coordinator',
        organization: 'Mitra Usaha E-Commerce Tiens (Ambefit)',
        sector: 'Health & Wellness E-Commerce',
        periodType: 'Project 2 Months',
        category: 'admin_finance',
        highlights: [
          "Mengelola administrasi perjanjian kerjasama, kontrak influencer, dan dokumentasi bukti tayang (proof of posting).",
          "Menyusun rekapitulasi data performa kampanye dan pencatatan kompensasi mitra kreator secara rapi dan akurat.",
          "Mengoordinasikan kelengkapan aset promosi produk Ambefit dan pengiriman sampel produk ke influencer.",
        ],
      },
    ],
    digitalSolutions: [
      {
        id: 'sol-5',
        title: 'VYNANCE',
        subtitle: 'Accounting, Finance & Transaction Ledger App',
        category: 'enterprise',
        demoUrl: 'https://vynance.vercel.app',
        isPrototype: true,
        description:
          'Sistem administrasi transaksi keuangan personal dan buku besar modular siap upgrade enterprise, mencakup pencatatan arus kas, alokasi anggaran, dan rekapitulasi data keuangan.',
        impact:
          'Memangkas waktu penyusunan rekapitulasi harian hingga 50% dan meningkatkan akurasi data arus kas & laporan keuangan.',
        techStack: ['Ledger System', 'Transaction Tracking', 'Cash Flow Journal'],
        features: ['Automated Journaling', 'Category Breakdown', 'Monthly Balance Report'],
      },
    ],
  };

// --- b2b_sales.ts ---
export const b2b_salesProjects: TailoredProjectSet = {
    summary:
      'Portofolio pengelolaan akun korporat B2B, perancangan solusi penawaran komersial, akuisisi mitra distribusi/reseller, strategi penetapan harga komersial, dan penyampaian layanan untuk menjamin retensi & kepuasan klien.',
    projects: [
      {
        id: 'proj-1',
        role: 'Client Solutions & Account Delivery Lead',
        organization: 'Alinlabs Indonesia',
        sector: 'Digital Agency & AI Solutions',
        periodType: 'Project based',
        category: 'digital_tech',
        highlights: [
          'Mengelola relasi akun klien korporat untuk 30+ proyek pengembangan software dan multimedia.',
          'Mengidentifikasi kebutuhan bisnis klien, menyusun proposal solusi teknis, dan menyepakati ruang lingkup proyek (scope of work).',
          'Mengawal penyampaian deliverable proyek guna mempertahankan kepuasan klien (CSAT >95%) dan mendorong peluang repeat order.',
          'Berkoordinasi dengan tim eksekusi teknis untuk memastikan penyerahan solusi sesuai komitmen penawaran komersial.',
        ],
      },
      {
        id: 'proj-2',
        role: 'B2B & Reseller Channel Consultant',
        organization: 'World Street Trendy Fashion',
        sector: 'Footwear Retail',
        periodType: 'Project based',
        category: 'operations_retail',
        highlights: [
          'Merancang struktur harga grosir/reseller, kalkulasi HPP (COGS), margin profit mitra, dan skema komisi affiliator.',
          'Membangun alur pendaftaran dan sistem operasional kemitraan B2B untuk memperluas jangkauan jaringan penjualan.',
          'Memformulasi strategi penetapan harga komersial multi-channel yang kompetitif dan menguntungkan.',
        ],
      },
      {
        id: 'proj-9',
        role: 'B2B Sales & Digital Acquisition Specialist',
        organization: 'PT. Anugrah Dwi Tunggal',
        sector: 'Digital Printing Solution',
        periodType: 'Project based',
        category: 'marketing_media',
        highlights: [
          'Mengembangkan pipeline akuisisi prospek B2B untuk solusi percetakan digital komersial melalui strategi penetrasi digital.',
          'Mengelola iklan Meta Ads terarah dan etalase toko digital guna mendorong permintaan penawaran harga dari segmen korporasi.',
          'Meningkatkan inbound inquiry B2B sebesar 40% dan mengoptimalkan efisiensi biaya akuisisi pelanggan (CAC).',
        ],
      },
      {
        id: 'proj-12',
        role: 'Interim Operations & Commercial Systems Consultant',
        organization: 'PT Shansusdzar Indonesia',
        sector: 'Interior Design & Build',
        periodType: 'Project 1 Month',
        category: 'operations_retail',
        highlights: [
          "Mereformasi sistem operasional dan penawaran bisnis PT Shansusdzar Indonesia untuk meningkatkan daya saing pasar interior.",
          "Menata ulang standar presentasi portfolio, respon konsultasi klien, dan integrasi penawaran harga (quotation).",
          "Memperbaiki tata kelola media sosial sebagai etalase digital utama dalam menarik prospek proyek interior bernilai tinggi.",
        ],
      },
      {
        id: 'proj-13',
        role: 'E-Commerce Partnership & Influencer Marketing Specialist',
        organization: 'Mitra Usaha E-Commerce Tiens (Ambefit)',
        sector: 'Health & Wellness E-Commerce',
        periodType: 'Project 2 Months',
        category: 'marketing_media',
        highlights: [
          "Membangun skema kemitraan promosi dengan jaringan influencer e-commerce untuk produk kesehatan Ambefit.",
          "Merancang penawaran kolaborasi komersial yang menguntungkan antara brand Tiens, kreator, dan audiens target.",
          "Mendorong peningkatan omzet penjualan toko e-commerce melalui ekspansi jangkauan audiens kreator terpercaya.",
        ],
      },
    ],
    digitalSolutions: [
      {
        id: 'sol-4',
        title: 'NEXT MARKETING',
        subtitle: 'CRM & Marketing Automation',
        category: 'crm',
        demoUrl: 'https://nextmarkefing.vercel.app',
        isPrototype: true,
        description:
          'Platform CRM & manajemen pipeline prospek B2B: pelacakan status penawaran, otomatisasi follow-up klien, dan analitik tingkat konversi closing.',
        impact:
          'Meningkatkan closing rate prospek B2B hingga 45% dan mempercepat siklus konversi penawaran komersial 3x lebih cepat.',
        techStack: ['CRM Sales Pipeline', 'Lead Nurturing Automation', 'Deal Closing Analytics'],
        features: ['B2B Sales Funnel View', 'Automated Client Follow-up', 'Deal Valuation Analytics'],
      },
      {
        id: 'sol-6',
        title: 'MY DIBY',
        subtitle: 'B2B & Corporate Intelligence App',
        category: 'management',
        demoUrl: 'https://mydiby.vercel.app',
        isPrototype: true,
        description:
          'Direktori intelijen pasar B2B untuk memetakan 4.000+ data korporat (PIC HRGA, Purchasing, GM) dan pemetaan kawasan industri.',
        impact:
          'Memetakan 4.000+ korporasi dan 5.200+ kontak pengambil keputusan B2B, memangkas waktu prospeksi awal sebesar 85%.',
        techStack: ['Corporate Intelligence Database', 'Industrial Geo-Index', 'B2B Search Engine'],
        features: ['PIC Contact Directory', 'Industrial Zone Filtering', 'Target Account Profiling'],
      },
    ],
  };

// --- branch_manager.ts ---
export const branch_managerProjects: TailoredProjectSet = {
    summary:
      'Portofolio tata kelola operasional multi-cabang, audit standar pelayanan gerai, kontrol stok & POS, pengawasan tim store frontliner, dan pencapaian target komersial cabang.',
    projects: [
      {
        id: 'proj-11',
        role: 'Retail Store Network Manager',
        organization: 'CV Multi Sejahtera',
        sector: 'Retail Gadget & Smartphone',
        periodType: 'Project 4 Months',
        category: 'marketing_media',
        highlights: [
          'Memimpin operasional dan strategi pemasaran 5 gerai ritel gadget secara terpadu.',
          'Melakukan audit visual merchandising rutin di seluruh cabang dan menyelaraskan penawaran staf toko.',
          'Menganalisis performa penjualan antar-cabang dan efektivitas promosi lokal.',
        ],
      },
      {
        id: 'proj-2',
        role: 'Branch Operations & Retail Consultant',
        organization: 'World Street Trendy Fashion',
        sector: 'Footwear Retail',
        periodType: 'Project based',
        category: 'operations_retail',
        highlights: [
          'Merancang SOP operasional outlet toko, pengelolaan kasir/POS, dan sistem otomatisasi restock inventaris.',
          'Mengatur mekanisme kontrol penerimaan barang, audit stok berkala, dan pencegahan kehilangan barang.',
        ],
      },
      {
        id: 'proj-3',
        role: 'Branch Academic & Operations Manager',
        organization: 'Lingua First',
        sector: 'Lembaga Kursus Bahasa Inggris',
        periodType: 'Collabs 6 Months',
        category: 'operations_retail',
        highlights: [
          'Memimpin operasional cabang harian: penjadwalan 300+ siswa dengan 30 tutor dan kapasitas ruang kelas.',
          'Mengawasi kepatuhan alur kerja tim administrasi & tutor cabang untuk mempertahankan retensi siswa.',
        ],
      },
      {
        id: 'proj-12',
        role: 'Interim Operations & Branch Management Consultant',
        organization: 'PT Shansusdzar Indonesia',
        sector: 'Interior Design & Build',
        periodType: 'Project 1 Month',
        category: 'operations_retail',
        highlights: [
          "Melakukan perbaikan menyeluruh terhadap operasional harian, tata kelola kas operasional, dan SOP staf di PT Shansusdzar Indonesia.",
          "Menstandardisasi sistem pengawasan kerja, penyelarasan target operasional, dan kepatuhan alur kerja tim.",
          "Membangun ritme pelaporan berkala yang memudahkan pemantauan kinerja bisnis secara holistik.",
        ],
      },
      {
        id: 'proj-13',
        role: 'Multi-Channel Promotional Campaign Lead',
        organization: 'Mitra Usaha E-Commerce Tiens (Ambefit)',
        sector: 'Health & Wellness E-Commerce',
        periodType: 'Project 2 Months',
        category: 'marketing_media',
        highlights: [
          "Memimpin kampanye promosi digital produk Ambefit melalui kolaborasi terstruktur dengan kreator media sosial.",
          "Memastikan pesan promosi selaras dengan target penjualan e-commerce dan profil konsumen sasaran.",
          "Mengevaluasi hasil aktivasi kampanye untuk peningkatan performa promosi pada periode berikutnya.",
        ],
      },
    ],
    digitalSolutions: [
      {
        id: 'sol-2',
        title: 'LOGISTOR',
        subtitle: 'Logistics, Warehouse & Operations App',
        category: 'enterprise',
        demoUrl: 'https://logistor.vercel.app',
        isPrototype: true,
        description:
          'Sistem kontrol stok multi-cabang: pencatatan barang masuk/keluar, transfer stok antar-outlet, dan otomatisasi kalkulasi HPP.',
        impact:
          'Menekan selisih stok hingga 70% dan mempercepat proses opname stok cabang sebesar 60%.',
        techStack: ['Multi-Branch Inventory', 'POS Sync', 'Stock Transfer Engine'],
        features: ['Inter-Store Transfer', 'Outlet Stock Alerts', 'Automated HPP Ledger'],
      },
    ],
  };

// --- business_development.ts ---
export const business_developmentProjects: TailoredProjectSet = {
    summary:
      'Portofolio pengelolaan akun korporat B2B, perancangan solusi penawaran komersial, akuisisi mitra distribusi/reseller, strategi penetapan harga komersial, dan penyampaian layanan untuk menjamin retensi & kepuasan klien.',
    projects: [
      {
        id: 'proj-1',
        role: 'Client Solutions & Account Delivery Lead',
        organization: 'Alinlabs Indonesia',
        sector: 'Digital Agency & AI Solutions',
        periodType: 'Project based',
        category: 'digital_tech',
        highlights: [
          'Mengelola relasi akun klien korporat untuk 30+ proyek pengembangan software dan multimedia.',
          'Mengidentifikasi kebutuhan bisnis klien, menyusun proposal solusi teknis, dan menyepakati ruang lingkup proyek (scope of work).',
          'Mengawal penyampaian deliverable proyek guna mempertahankan kepuasan klien (CSAT >95%) dan mendorong peluang repeat order.',
          'Berkoordinasi dengan tim eksekusi teknis untuk memastikan penyerahan solusi sesuai komitmen penawaran komersial.',
        ],
      },
      {
        id: 'proj-2',
        role: 'B2B & Reseller Channel Consultant',
        organization: 'World Street Trendy Fashion',
        sector: 'Footwear Retail',
        periodType: 'Project based',
        category: 'operations_retail',
        highlights: [
          'Merancang struktur harga grosir/reseller, kalkulasi HPP (COGS), margin profit mitra, dan skema komisi affiliator.',
          'Membangun alur pendaftaran dan sistem operasional kemitraan B2B untuk memperluas jangkauan jaringan penjualan.',
          'Memformulasi strategi penetapan harga komersial multi-channel yang kompetitif dan menguntungkan.',
        ],
      },
      {
        id: 'proj-9',
        role: 'B2B Sales & Digital Acquisition Specialist',
        organization: 'PT. Anugrah Dwi Tunggal',
        sector: 'Digital Printing Solution',
        periodType: 'Project based',
        category: 'marketing_media',
        highlights: [
          'Mengembangkan pipeline akuisisi prospek B2B untuk solusi percetakan digital komersial melalui strategi penetrasi digital.',
          'Mengelola iklan Meta Ads terarah dan etalase toko digital guna mendorong permintaan penawaran harga dari segmen korporasi.',
          'Meningkatkan inbound inquiry B2B sebesar 40% dan mengoptimalkan efisiensi biaya akuisisi pelanggan (CAC).',
        ],
      },
      {
        id: 'proj-12',
        role: 'Interim Operations & Commercial Systems Consultant',
        organization: 'PT Shansusdzar Indonesia',
        sector: 'Interior Design & Build',
        periodType: 'Project 1 Month',
        category: 'operations_retail',
        highlights: [
          "Mereformasi sistem operasional dan penawaran bisnis PT Shansusdzar Indonesia untuk meningkatkan daya saing pasar interior.",
          "Menata ulang standar presentasi portfolio, respon konsultasi klien, dan integrasi penawaran harga (quotation).",
          "Memperbaiki tata kelola media sosial sebagai etalase digital utama dalam menarik prospek proyek interior bernilai tinggi.",
        ],
      },
      {
        id: 'proj-13',
        role: 'E-Commerce Partnership & Influencer Marketing Specialist',
        organization: 'Mitra Usaha E-Commerce Tiens (Ambefit)',
        sector: 'Health & Wellness E-Commerce',
        periodType: 'Project 2 Months',
        category: 'marketing_media',
        highlights: [
          "Membangun skema kemitraan promosi dengan jaringan influencer e-commerce untuk produk kesehatan Ambefit.",
          "Merancang penawaran kolaborasi komersial yang menguntungkan antara brand Tiens, kreator, dan audiens target.",
          "Mendorong peningkatan omzet penjualan toko e-commerce melalui ekspansi jangkauan audiens kreator terpercaya.",
        ],
      },
    ],
    digitalSolutions: [
      {
        id: 'sol-4',
        title: 'NEXT MARKETING',
        subtitle: 'CRM & Marketing Automation',
        category: 'crm',
        demoUrl: 'https://nextmarkefing.vercel.app',
        isPrototype: true,
        description:
          'Platform CRM & manajemen pipeline prospek B2B: pelacakan status penawaran, otomatisasi follow-up klien, dan analitik tingkat konversi closing.',
        impact:
          'Meningkatkan closing rate prospek B2B hingga 45% dan mempercepat siklus konversi penawaran komersial 3x lebih cepat.',
        techStack: ['CRM Sales Pipeline', 'Lead Nurturing Automation', 'Deal Closing Analytics'],
        features: ['B2B Sales Funnel View', 'Automated Client Follow-up', 'Deal Valuation Analytics'],
      },
      {
        id: 'sol-6',
        title: 'MY DIBY',
        subtitle: 'B2B & Corporate Intelligence App',
        category: 'management',
        demoUrl: 'https://mydiby.vercel.app',
        isPrototype: true,
        description:
          'Direktori intelijen pasar B2B untuk memetakan 4.000+ data korporat (PIC HRGA, Purchasing, GM) dan pemetaan kawasan industri.',
        impact:
          'Memetakan 4.000+ korporasi dan 5.200+ kontak pengambil keputusan B2B, memangkas waktu prospeksi awal sebesar 85%.',
        techStack: ['Corporate Intelligence Database', 'Industrial Geo-Index', 'B2B Search Engine'],
        features: ['PIC Contact Directory', 'Industrial Zone Filtering', 'Target Account Profiling'],
      },
    ],
  };

// --- business_operations.ts ---
export const business_operationsProjects: TailoredProjectSet = {
    summary:
      'Portofolio konsultasi sistem operasional bisnis, standardisasi SOP multi-unit, arsitektur database rantai pasok, tata kelola alur kerja 30+ proyek, dan efisiensi utilisasi operasional pada sektor ritel, edukasi, dan layanan publik.',
    projects: [
      {
        id: 'proj-1',
        role: 'Operations & Systems Consultant',
        organization: 'Alinlabs Indonesia',
        sector: 'Digital Agency & AI Solutions',
        periodType: 'Project based',
        category: 'digital_tech',
        highlights: [
          'Merancang standard operating procedure (SOP) dan alur kerja operasional terintegrasi untuk 30+ proyek pengembangan software dan multimedia.',
          'Menerapkan sistem monitoring bottleneck, alokasi kapasitas resource teknis, dan manajemen risiko jadwal rilis produk.',
          'Mengimplementasikan quality control (QC) berjenjang dan standardisasi dokumentasi serah terima proyek kepada klien korporat.',
          'Mencapai 96%+ on-time milestone delivery dengan efisiensi biaya operasional proyek meningkat 20%.',
        ],
      },
      {
        id: 'proj-2',
        role: 'Lead Business Operations Consultant',
        organization: 'World Street Trendy Fashion',
        sector: 'Footwear Retail',
        periodType: 'Project based',
        category: 'operations_retail',
        highlights: [
          'Membangun master database inventaris 100+ SKU dan merancang sistem otomasi replenishment stok guna mencegah out-of-stock.',
          'Merumuskan kalkulasi operasional HPP (COGS), margin kontribusi, dan mekanisme kontrol biaya packing serta logistik kurir multi-ekspedisi.',
          'Menyusun SOP operasional pemrosesan order harian e-commerce dan penanganan retur (RMA) terstandardisasi.',
          'Membangun sistem pelaporan operasional berkala yang memangkas waktu rekonsiliasi stok gudang sebesar 60%.',
        ],
      },
      {
        id: 'proj-3',
        role: 'Academic & Operations Director Consultant',
        organization: 'Lingua First',
        sector: 'Lembaga Kursus Bahasa Inggris',
        periodType: 'Collabs 6 Months',
        category: 'operations_retail',
        highlights: [
          'Memimpin tata kelola operasional harian lembaga kursus: sinkronisasi jadwal 300+ siswa dengan ketersediaan ruang kelas dan alokasi tutor.',
          'Mengoordinasikan 30 staf operasional dan pengajar melalui pembagian tugas terstruktur dan evaluasi kepatuhan SOP harian.',
          'Merancang alur administrasi operasional presensi, penjadwalan kelas pengganti (make-up class), dan manajemen fasilitas belajar.',
          'Mengoptimalkan utilisasi ruangan hingga 90% dan mengeliminasi 100% insiden bentrok jadwal tutor.',
        ],
      },
      {
        id: 'proj-4',
        role: 'Retail Operations Consultant',
        organization: 'Melin Parfum',
        sector: 'Perfume Retail',
        periodType: 'Project based',
        category: 'operations_retail',
        highlights: [
          'Merancang sistem manajemen inventaris dan kontrol restock otomatis untuk 50+ SKU parfum multi-kategori.',
          'Menyusun standardisasi alur kerja fulfillment pesanan e-commerce mulai dari picking, packing anti-pecah, hingga serah terima kurir.',
          'Menetapkan SOP audit fisik stok berkala (stock opname) yang menekan selisih stok gudang hingga di bawah 1%.',
          'Mengintegrasikan laporan rekapitulasi penjualan harian dengan data mutasi stok bahan baku.',
        ],
      },
      {
        id: 'proj-10',
        role: 'Operations & Billing Administration Lead',
        organization: 'Tirta Raharja – BPSPAMS',
        sector: 'Water & Sanitation Organization',
        periodType: 'Monthly Project',
        category: 'admin_finance',
        highlights: [
          'Mengelola sistem operasional pencatatan meteran dan penagihan terpadu untuk 2.000+ sambungan rumah tangga pelanggan.',
          'Merancang SOP pemeliharaan jaringan distribusi air, pelaporan gangguan pelanggan, dan dispatch teknisi lapangan.',
          'Mengotomasi rekapitulasi data operasional bulanan dan pembukuan penerimaan iuran secara transparan.',
          'Meningkatkan efisiensi penagihan tepat waktu sebesar 35% dan menurunkan tunggakan pelanggan 40%.',
        ],
      },
      {
        id: 'proj-11',
        role: 'Multi-Store Operations & Marketing Coordinator',
        organization: 'CV Multi Sejahtera',
        sector: 'Retail Gadget & Smartphone',
        periodType: 'Project 4 Months',
        category: 'marketing_media',
        highlights: [
          'Mengaudit dan menyelaraskan SOP operasional display promosi dan merchandising di 5 toko ritel gadget.',
          'Menyelenggarakan briefing dan pelatihan berkala kepada frontliner terkait eksekusi promo dan pencatatan transaksi di POS.',
          'Memantau kepatuhan standar pelayanan pelanggan (SLA) dan kesiapan stok unit promo di setiap cabang.',
          'Menyusun laporan evaluasi operasional cabang dan produktivitas penjualan mingguan.',
        ],
      },
      {
        id: 'proj-12',
        role: 'Interim Operations & Workflow Restructuring Manager',
        organization: 'PT Shansusdzar Indonesia',
        sector: 'Interior Design & Build',
        periodType: 'Project 1 Month',
        category: 'operations_retail',
        highlights: [
          "Memimpin audit proses bisnis dan restrukturisasi sistem operasional terpadu pada perusahaan interior design & build.",
          "Merumuskan dan menstandardisasi SOP alur kerja lintas fungsi (desain, produksi, logistik, finance) untuk memangkas inefisiensi.",
          "Membangun sistem kontrol dan sinkronisasi data operasional mingguan guna memastikan on-time delivery proyek interior.",
        ],
      },
      {
        id: 'proj-13',
        role: 'E-Commerce Campaign & Project Operations Lead',
        organization: 'Mitra Usaha E-Commerce Tiens (Ambefit)',
        sector: 'Health & Wellness E-Commerce',
        periodType: 'Project 2 Months',
        category: 'marketing_media',
        highlights: [
          "Mengorkestrasi alur kerja operasional kampanye influencer marketing produk kesehatan Ambefit dari brief hingga rilis konten.",
          "Mengatur timeline produksi konten, standardisasi approval materi visual, dan monitoring kepatuhan jadwal tayang influencer.",
          "Mengevaluasi metrik operasional kampanye dan efisiensi delivery konten promosi e-commerce.",
        ],
      },
    ],
    digitalSolutions: [
      {
        id: 'sol-1',
        title: 'MITRA GATEWAY',
        subtitle: 'Enterprise Resource Planning App',
        category: 'enterprise',
        demoUrl: 'https://mitragateway.vercel.app',
        isPrototype: true,
        description:
          'Sistem operasi terpusat (ERP) multi-divisi untuk mengontrol alur kerja operasional, sinkronisasi antar-departemen, dan pelaporan bottleneck produksi secara real-time.',
        impact:
          'Meningkatkan efisiensi alur kerja operasional lintas divisi hingga 65% dan memangkas hambatan koordinasi antar-cabang sebesar 80%.',
        techStack: ['Workflow Engine', 'Cross-Divisional ERP', 'Operational Dashboard'],
        features: ['Real-Time Workflow Tracking', 'Multi-Branch Sync', 'Bottleneck Alert'],
      },
      {
        id: 'sol-2',
        title: 'LOGISTOR',
        subtitle: 'Logistics, Warehouse & Operations App',
        category: 'enterprise',
        demoUrl: 'https://logistor.vercel.app',
        isPrototype: true,
        description:
          'Platform manajemen rantai pasok dan operasional logistik: kontrol stok masuk/keluar, HPP otomatis, penjadwalan produksi, dan dispatch pengiriman multi-kota.',
        impact:
          'Menekan selisih stok inventaris hingga 70%, mengotomasi jadwal produksi, dan memangkas siklus pelaporan gudang sebesar 60%.',
        techStack: ['Supply Chain Automation', 'Inventory Control Engine', 'Production Dispatcher'],
        features: ['Automated Reorder Point', 'Warehouse In/Out Tracking', 'Live Logistics SLA'],
      },
      {
        id: 'sol-8',
        title: 'MY TALENTY',
        subtitle: 'People Development & Assessment App',
        category: 'management',
        demoUrl: 'https://mytalenty.vercel.app',
        isPrototype: true,
        description:
          'Platform end-to-end people development & rekrutmen: Gudang Test (psikotes & tes bidang berstandar profesional dengan hasil skor akurat untuk evaluasi kandidat), SmartForm (anti-contek otomatis, pelacakan durasi & pola pengisian, ribuan bank soal), serta portal rekrutmen HR terintegrasi untuk akuisisi pelamar, perpindahan data status karyawan, dan konektivitas payroll.',
        impact:
          'Meningkatkan akurasi dan objektivitas evaluasi kandidat hingga 98%, mengeliminasi kecurangan tes lewat SmartForm anti-contek, dan mempercepat transisi akuisisi pelamar ke sistem payroll/HRIS secara seamless.',
        techStack: ['SmartForm Anti-Cheating Engine', 'Psychometric Test Repository', 'Applicant Score Analytics', 'HR Acquisition & Payroll Sync'],
        features: ['Professional Gudang Test & Score Card', 'SmartForm Tab-Switch Detection', 'Automated HR Candidate Acquisition', 'End-to-End Employee & Payroll Sync'],
      },
      {
        id: 'sol-4',
        title: 'NEXT MARKETING',
        subtitle: 'CRM & Marketing Automation',
        category: 'crm',
        demoUrl: 'https://nextmarkefing.vercel.app',
        isPrototype: true,
        description:
          'Sistem pengelolaan alur penanganan prospek, otomatisasi follow-up operasional, dan tracking SLA penanganan pelanggan.',
        impact:
          'Mempercepat waktu respons operasional prospek 3x lebih cepat dan mencegah kebocoran pipeline klien.',
        techStack: ['Lead Routing Engine', 'SLA Monitoring', 'CRM Automation'],
        features: ['Automated Lead Assignment', 'SLA Breach Warning', 'Activity History'],
      },
      {
        id: 'sol-5',
        title: 'VYNANCE',
        subtitle: 'Accounting, Finance & Transaction Ledger App',
        category: 'enterprise',
        demoUrl: 'https://vynance.vercel.app',
        isPrototype: true,
        description:
          'Sistem pencatatan transaksi keuangan dan aset operasional modular siap upgrade enterprise: tracking pemeliharaan barang modal, audit fasilitas, dan kontrol pengeluaran operasional cabang.',
        impact:
          'Meningkatkan akurasi data aset operasional hingga 95% dan mempercepat rekonsiliasi keuangan & inventaris aset harian.',
        techStack: ['Financial & Asset Registry', 'Facility Audit Engine', 'Depreciation Calculator'],
        features: ['Asset Lifecycle Tracking', 'Maintenance Schedule', 'Operational Expense Log'],
      },
      {
        id: 'sol-6',
        title: 'MY DIBY',
        subtitle: 'B2B & Corporate Intelligence App',
        category: 'management',
        demoUrl: 'https://mydiby.vercel.app',
        isPrototype: true,
        description:
          'Basis data direktori pemetaan 4.000+ profil perusahaan dan zonasi kawasan industri untuk perencanaan rute operasional logistik dan B2B.',
        impact:
          'Memangkas waktu perencanaan rute logistik dan kunjungan operasional hingga 85%.',
        techStack: ['Industrial Zoning Map', 'Logistics Database', 'Filter Matrix'],
        features: ['Industrial Zone Directory', 'Route Optimization', 'Decision Maker Contact'],
      },
    ],
  };

// --- digital_transformation.ts ---
export const digital_transformationProjects: TailoredProjectSet = {
    summary:
      'Portofolio perancangan arsitektur sistem digital, otomasi proses bisnis, pengembangan 30+ website/aplikasi, integrasi AI, dan modernisasi alur kerja perusahaan.',
    projects: [
      {
        id: 'proj-1',
        role: 'Software Architect & AI Consultant',
        organization: 'Alinlabs Indonesia',
        sector: 'Digital Agency & AI Solutions',
        periodType: 'Project based',
        category: 'digital_tech',
        highlights: [
          'Merancang dan membangun 30+ website, web apps, dan solusi AI automation sesuai kebutuhan operasional klien.',
          'Mengintegrasikan API modern, database cloud (Firebase/MySQL), dan workflow automation tools.',
          'Membantu klien korporat melakukan migrasi dari pencatatan manual berbasis kertas ke sistem digital berbasis web.',
          'Memberikan training teknis dan manual operasional kepada tim internal klien guna menjamin adopsi sistem 100%.',
        ],
      },
      {
        id: 'proj-6',
        role: 'Web Platform & Multimedia Architect',
        organization: 'Pesantren Minnatul Huda',
        sector: 'Islamic Boarding School',
        periodType: 'Project based',
        category: 'digital_tech',
        highlights: [
          'Mengembangkan website resmi institusi dengan portal informasi santri, donasi, dan profil akademik interaktif.',
          'Memproduksi aset visual video promosi beresolusi tinggi yang terintegrasi pada landing page institusi.',
        ],
      },
      {
        id: 'proj-12',
        role: 'Operations & Systems Modernization Consultant',
        organization: 'PT Shansusdzar Indonesia',
        sector: 'Interior Design & Build',
        periodType: 'Project 1 Month',
        category: 'digital_tech',
        highlights: [
          "Merancang digitalisasi tata kelola alur kerja dan integrasi data pelaporan operasional serta keuangan PT Shansusdzar Indonesia.",
          "Mengeliminasi pencatatan manual yang rentan redudansi melalui standardisasi sistem cloud database dan digital workflow.",
          "Menyinkronkan data progres proyek interior agar dapat dimonitor secara real-time oleh manajemen.",
        ],
      },
      {
        id: 'proj-13',
        role: 'Digital Content & E-Commerce Growth Strategist',
        organization: 'Mitra Usaha E-Commerce Tiens (Ambefit)',
        sector: 'Health & Wellness E-Commerce',
        periodType: 'Project 2 Months',
        category: 'digital_tech',
        highlights: [
          "Mengoptimalkan pemanfaatan kanal e-commerce dan platform media sosial melalui kampanye digital berbasis kreator.",
          "Memanfaatkan analitik data performa konten (reach, share, click rate) untuk optimasi konten promosi berkelanjutan.",
          "Mengintegrasikan call-to-action promosi influencer ke landing page dan toko e-commerce Tiens Ambefit.",
        ],
      },
    ],
    digitalSolutions: [
      {
        id: 'sol-1',
        title: 'MITRA GATEWAY',
        subtitle: 'Enterprise Resource Planning App',
        category: 'enterprise',
        demoUrl: 'https://mitragateway.vercel.app',
        isPrototype: true,
        description:
          'Arsitektur sistem informasi enterprise full-stack yang mendigitalisasi operasional, keuangan, HR, dan pelaporan C-Level dalam satu platform cloud terpadu.',
        impact:
          'Memangkas redundansi data hingga 80% dan mempercepat proses bisnis perusahaan hingga 2x lebih efisien.',
        techStack: ['Cloud ERP Architecture', 'REST API Integration', 'Real-Time Sync'],
        features: ['Multi-Module Sync', 'Executive Dashboard', 'Paperless Workflow'],
      },
      {
        id: 'sol-6',
        title: 'MY DIBY',
        subtitle: 'B2B & Corporate Intelligence App',
        category: 'management',
        demoUrl: 'https://mydiby.vercel.app',
        isPrototype: true,
        description:
          'Platform direktori intelijen berbasis web dengan fitur filter multi-level dan indeks pemetaan geospasial kawasan industri.',
        impact:
          'Mendigitalisasi 4.000+ data korporat dan mempercepat prospeksi pasar sebesar 85%.',
        techStack: ['Geo-Mapping Matrix', 'Database Indexing', 'Fast Query Engine'],
        features: ['Industrial Zoning Index', 'Instant Search & Filter', 'Contact Data Intelligence'],
      },
    ],
  };

// --- executive.ts ---
export const executiveProjects: TailoredProjectSet = {
    summary:
      'Portofolio tata kelola portofolio proyek strategis, arahan efisiensi operasional, C-level advisory, manajemen risiko bisnis, dan pengawasan eksekusi program lintas divisi.',
    projects: [
      {
        id: 'proj-1',
        role: 'Strategic Project Governance Lead',
        organization: 'Alinlabs Indonesia',
        sector: 'Digital Agency & AI Solutions',
        periodType: 'Project based',
        category: 'digital_tech',
        highlights: [
          'Mengawasi portofolio 35+ proyek digital & multimedia dari tahap penetapan tujuan bisnis hingga penyerahan.',
          'Menyelaraskan alokasi investasi proyek dengan target pertumbuhan strategis korporat.',
          'Memberikan arahan tata kelola risiko operasional, kepatuhan kualitas, dan laporan kinerja eksekutif.',
        ],
      },
      {
        id: 'proj-7',
        role: 'Executive Event Director & Keynote Speaker',
        organization: 'PRATAMA EVENT ORGANIZER',
        sector: 'Event Management & Public Speaking',
        periodType: 'Project based',
        category: 'event_public',
        highlights: [
          "Memimpin arahan strategis dan tata kelola eksekutif pelaksanaan 10+ perhelatan akbar formal berskala regional.",
          "Menjadi narasumber kunci (keynote speaker) dalam 15+ forum kepemimpinan, manajemen strategis, dan motivasi pemuda.",
          "Membangun aliansi kemitraan strategis dengan berbagai institusi korporasi dan lembaga pemerintahan.",
          "Menetapkan standar protokol acara, manajemen krisis panggung, dan jaminan reputasi penyelenggaraan event.",
        ],
      },
      {
        id: 'proj-12',
        role: 'Interim Executive Operations & Management Advisor',
        organization: 'PT Shansusdzar Indonesia',
        sector: 'Interior Design & Build',
        periodType: 'Project 1 Month',
        category: 'operations_retail',
        highlights: [
          "Menjalankan mandat audit menyeluruh dan restrukturisasi sistem manajemen operasional, finansial, dan branding PT Shansusdzar Indonesia.",
          "Merumuskan kerangka kerja tata kelola bisnis (governance framework) baru yang memangkas redundansi proses dalam 1 bulan.",
          "Menyajikan rekomendasi strategis bagi direksi untuk keberlanjutan efisiensi operasional dan pertumbuhan jangka panjang.",
        ],
      },
      {
        id: 'proj-13',
        role: 'E-Commerce Growth & Strategic Marketing Partner',
        organization: 'Mitra Usaha E-Commerce Tiens (Ambefit)',
        sector: 'Health & Wellness E-Commerce',
        periodType: 'Project 2 Months',
        category: 'marketing_media',
        highlights: [
          "Memimpin arah strategi pemasaran digital berbasis kolaborasi influencer untuk portofolio produk kesehatan Ambefit.",
          "Menyelaraskan investasi promosi digital dengan target penetrasi pasar dan pertumbuhan brand di platform e-commerce.",
          "Mengevaluasi ROI kampanye dan menyusun cetak biru strategi promosi kemitraan lanjutan.",
        ],
      },
    ],
    digitalSolutions: [
      {
        id: 'sol-1',
        title: 'MITRA GATEWAY',
        subtitle: 'Enterprise Resource Planning App',
        category: 'enterprise',
        demoUrl: 'https://mitragateway.vercel.app',
        isPrototype: true,
        description:
          'Platform ERP dan dashboard intelijen bisnis eksekutif untuk memantau performa keuangan, operasional, dan HR secara konsolidasi.',
        impact:
          'Mempercepat siklus pengambilan keputusan C-Level hingga 2x lebih cepat dengan transparansi data real-time.',
        techStack: ['Executive Dashboard', 'Cross-Divisional ERP', 'Business Intelligence'],
        features: ['C-Level Summary View', 'Real-time KPI Tracking', 'Multi-Unit Governance'],
      },
    ],
  };

// --- finance.ts ---
export const financeProjects: TailoredProjectSet = {
    summary:
      'Portofolio analisis keuangan operasional, kalkulasi HPP (COGS), penyusunan struktur harga & pajak platform, pembukuan jurnal kas, audit kasir, dan laporan laba rugi.',
    projects: [
      {
        id: 'proj-10',
        role: 'Financial & Administrative Control Officer',
        organization: 'Tirta Raharja – BPSPAMS',
        sector: 'Water & Sanitation Organization',
        periodType: 'Monthly Project',
        category: 'admin_finance',
        highlights: [
          'Mengelola administrasi operasional dan pelaporan keuangan bulanan untuk 2.000+ pelanggan aktif.',
          'Melakukan kalkulasi tagihan bulanan, pencatatan kas masuk/keluar, dan rekonsiliasi payroll staf teknis.',
          'Menyusun laporan jurnal keuangan dan transparansi kas bulanan.',
        ],
      },
      {
        id: 'proj-2',
        role: 'Financial & Pricing Operations Analyst',
        organization: 'World Street Trendy Fashion',
        sector: 'Footwear Retail',
        periodType: 'Project based',
        category: 'operations_retail',
        highlights: [
          'Merumuskan kalkulasi HPP (COGS), profit margin, dan struktur harga bottom price untuk 100+ SKU.',
          'Menyesuaikan kalkulasi harga jual e-commerce berdasarkan pajak (tax) dan potongan komisi platform.',
          'Menyusun laporan keuangan dan rekonsiliasi stok gudang berkala.',
        ],
      },
      {
        id: 'proj-12',
        role: 'Interim Financial & Operations Systems Auditor',
        organization: 'PT Shansusdzar Indonesia',
        sector: 'Interior Design & Build',
        periodType: 'Project 1 Month',
        category: 'admin_finance',
        highlights: [
          "Melakukan audit menyeluruh terhadap tata kelola pencatatan keuangan proyek, arus kas operasional, dan efisiensi biaya overhead.",
          "Menata ulang alur otorisasi pengeluaran, budgeting proyek interior, dan standardisasi rekonsiliasi keuangan antar divisi.",
          "Menyusun template pelaporan keuangan proyek terstruktur untuk meningkatkan akurasi margin profitabilitas bisnis.",
        ],
      },
      {
        id: 'proj-13',
        role: 'Commercial Marketing & Campaign Budget Analyst',
        organization: 'Mitra Usaha E-Commerce Tiens (Ambefit)',
        sector: 'Health & Wellness E-Commerce',
        periodType: 'Project 2 Months',
        category: 'admin_finance',
        highlights: [
          "Mengelola alokasi anggaran promosi influencer produk Ambefit dan memonitor efisiensi biaya per akuisisi (CPA / ROAS).",
          "Melakukan kalkulasi kompensasi performa kreator dan verifikasi laporan deliverable sebelum pencairan pembayaran kemitraan.",
          "Menyusun laporan evaluasi efisiensi biaya marketing e-commerce berbasis konversi penjualan.",
        ],
      },
    ],
    digitalSolutions: [
      {
        id: 'sol-5',
        title: 'VYNANCE',
        subtitle: 'Accounting, Finance & Transaction Ledger App',
        category: 'enterprise',
        demoUrl: 'https://vynance.vercel.app',
        isPrototype: true,
        description:
          'Platform pencatatan keuangan dan transaksi komprehensif modular siap upgrade enterprise: mencakup manajemen arus kas harian, buku besar korporat, kalkulasi depresiasi aset, dan neraca laba rugi.',
        impact:
          'Visibilitas arus kas 100%, eliminasi kesalahan pencatatan jurnal hingga 95%, dan percepatan tutup buku bulanan sebesar 50%.',
        techStack: ['Financial Ledger Engine', 'Asset Depreciation Engine', 'P&L Analytics'],
        features: ['Personal & Corporate Ledger', 'Asset Lifecycle Tracking', 'Balance Sheet Statement'],
      },
    ],
  };

// --- finance_accounting.ts ---
export const finance_accountingProjects: TailoredProjectSet = {
    summary:
      'Portofolio konsultasi formulasi HPP (COGS), analisis margin keuntungan ritel, pembukuan kas 2.000+ pelanggan, audit anggaran proyek, dan perancangan sistem akuntansi aset.',
    projects: [
      {
        id: 'proj-2',
        role: 'Pricing & Financial Operations Consultant',
        organization: 'World Street Trendy Fashion',
        sector: 'Footwear Retail',
        periodType: 'Project based',
        category: 'operations_retail',
        highlights: [
          'Melakukan audit dan formulasi kalkulasi HPP (COGS) detail untuk 100+ SKU produk sepatu.',
          'Menetapkan pricing tiering: bottom price, harga reseller/distributor, dan harga jual marketplace dengan mempertimbangkan biaya komisi platform & pajak.',
          'Menghitung titik impas (Break Even Point) dan proyeksi arus kas margin kotor dari berbagai channel penjualan.',
          'Membantu meningkatkan margin profit bersih perusahaan sebesar +12% melalui efisiensi struktur harga.',
        ],
      },
      {
        id: 'proj-4',
        role: 'Costing & Pricing Consultant',
        organization: 'Melin Parfum',
        sector: 'Perfume Retail',
        periodType: 'Project based',
        category: 'operations_retail',
        highlights: [
          'Menghitung biaya pokok produksi per milliliter parfum dan kemasan botol untuk 50+ varian.',
          'Menyusun skema harga jual e-commerce terintegrasi pajak platform, promo diskon, dan margin reseller.',
          'Merancang format laporan laba-rugi sederhana untuk monitoring performa keuangan bulanan pemilik bisnis.',
        ],
      },
      {
        id: 'proj-10',
        role: 'Finance & Billing Administration Lead',
        organization: 'Tirta Raharja – BPSPAMS',
        sector: 'Water & Sanitation Organization',
        periodType: 'Monthly Project',
        category: 'admin_finance',
        highlights: [
          'Mengelola arus kas masuk dan pembukuan penerimaan iuran dari 2.000+ pelanggan setiap bulan.',
          'Menyusun laporan arus kas (cash flow), neraca kas kecil, serta rekapitulasi pengeluaran operasional dan payroll.',
          'Melakukan rekonsiliasi berkala antara catatan meteran dengan saldo kas fisik, menjamin 100% akurasi saldo.',
          'Menyajikan laporan keuangan berkala dalam musyawarah pertanggungjawaban warga secara transparan.',
        ],
      },
      {
        id: 'proj-12',
        role: 'Interim Financial & Operations Systems Auditor',
        organization: 'PT Shansusdzar Indonesia',
        sector: 'Interior Design & Build',
        periodType: 'Project 1 Month',
        category: 'admin_finance',
        highlights: [
          "Melakukan audit menyeluruh terhadap tata kelola pencatatan keuangan proyek, arus kas operasional, dan efisiensi biaya overhead.",
          "Menata ulang alur otorisasi pengeluaran, budgeting proyek interior, dan standardisasi rekonsiliasi keuangan antar divisi.",
          "Menyusun template pelaporan keuangan proyek terstruktur untuk meningkatkan akurasi margin profitabilitas bisnis.",
        ],
      },
      {
        id: 'proj-13',
        role: 'Commercial Marketing & Campaign Budget Analyst',
        organization: 'Mitra Usaha E-Commerce Tiens (Ambefit)',
        sector: 'Health & Wellness E-Commerce',
        periodType: 'Project 2 Months',
        category: 'admin_finance',
        highlights: [
          "Mengelola alokasi anggaran promosi influencer produk Ambefit dan memonitor efisiensi biaya per akuisisi (CPA / ROAS).",
          "Melakukan kalkulasi kompensasi performa kreator dan verifikasi laporan deliverable sebelum pencairan pembayaran kemitraan.",
          "Menyusun laporan evaluasi efisiensi biaya marketing e-commerce berbasis konversi penjualan.",
        ],
      },
    ],
    digitalSolutions: [
      {
        id: 'sol-5',
        title: 'VYNANCE',
        subtitle: 'Accounting, Finance & Transaction Ledger App',
        category: 'enterprise',
        demoUrl: 'https://vynance.vercel.app',
        isPrototype: true,
        description:
          'Sistem akuntansi & keuangan terintegrasi dengan modul siap upgrade enterprise: jurnal transaksi debit/kredit, buku besar personal/korporat, laporan laba rugi, serta kalkulasi depresiasi aset tetap.',
        impact:
          'Visibilitas arus kas 100%, eliminasi 95% kesalahan pencatatan manual, serta memangkas waktu tutup buku bulanan sebesar 50%.',
        techStack: ['General Ledger Engine', 'Depreciation Model', 'Financial Statement Generator'],
        features: ['Real-Time Balance Sheet', 'Automated P&L', 'Fixed Asset Depreciation'],
      },
      {
        id: 'sol-2',
        title: 'LOGISTOR',
        subtitle: 'Logistics, Warehouse & Operations App',
        category: 'enterprise',
        demoUrl: 'https://logistor.vercel.app',
        isPrototype: true,
        description:
          'Modul kalkulasi HPP otomatis (FIFO, LIFO, Average), pelacakan utang-piutang dagang (AP/AR), dan laporan nilai persediaan material secara presisi.',
        impact:
          'Mengotomasi 100% kalkulasi HPP bahan baku interior dan menekan kebocoran biaya persediaan hingga 70%.',
        techStack: ['FIFO/LIFO/Average Engine', 'Accounts Payable/Receivable', 'Inventory Valuation'],
        features: ['Multi-Method COGS', 'Supplier AP Aging', 'Inventory Asset Value'],
      },
    ],
  };

// --- hr_operations.ts ---
export const hr_operationsProjects: TailoredProjectSet = {
    summary:
      'Portofolio kepemimpinan Human Resources (HRGA), regulasi hukum ketenagakerjaan (UU Cipta Kerja & PP 35/2021), kepatuhan BPJS Ketenagakerjaan (5 program) & BPJS Kesehatan, perhitungan PPh 21 TER (A/B/C PP 58/2023) & progresif, perancangan KPI berbasis job desk & absensi, formulasi payroll digital, penjadwalan rotasi shift & lembur, serta arsitektur sistem HR Matrix (Web/PWA ATS).',
    projects: [
      {
        id: 'proj-12',
        role: 'Interim HR & Org Restructuring Lead',
        organization: 'PT Shansusdzar Indonesia',
        sector: 'Interior Design & Build',
        periodType: 'Project 1 Month',
        category: 'operations_retail',
        highlights: [
          "Melakukan audit struktur organisasi, analisis beban kerja (workload analysis), dan alur koordinasi tim operasional lintas 6 divisi PT Shansusdzar Indonesia.",
          "Menyusun pembagian peran kerja (RACI Matrix), standardisasi 20+ SOP personalia, tata tertib disiplin workshop, dan pedoman akuntabilitas antar departemen.",
          "Menjembatani restrukturisasi manajemen dan pembaharuan budaya kerja operasional yang berdisiplin tinggi, transparan, dan terukur.",
        ],
      },
      {
        id: 'proj-1',
        role: 'HR Operations & People Tech Lead',
        organization: 'AlinLabs Indonesia',
        sector: 'Digital Agency & AI Solutions',
        periodType: 'Project based',
        category: 'digital_tech',
        highlights: [
          'Mengelola siklus rekrutmen talenta teknologi dan kreatif (developer, designer, editor) untuk 30+ proyek sistem digital.',
          'Merancang arsitektur platform Talenty (End-to-End People Development & Psychometric Assessment) mencakup Gudang Test, SmartForm anti-contek, modul akuisisi pelamar, dan integrasi data status karyawan/payroll.',
          'Menetapkan skema kompensasi berbasis deliverable proyek, sistem evaluasi performa berbasis milestone, dan pembinaan budaya kolaborasi tim kerja remote.',
          'Menjaga kepuasan, retensi, dan keterlibatan talenta internal hingga menghasilkan penyerahan proyek bermutu tinggi.',
        ],
      },
      {
        id: 'proj-10',
        role: 'HR Administration & Payroll Officer',
        organization: 'Tirta Raharja (BPSPAMS)',
        sector: 'Water & Sanitation Organization',
        periodType: 'Monthly Project',
        category: 'admin_finance',
        highlights: [
          'Mengelola administrasi data kepegawaian, absensi presensi teknisi lapangan, dan kalkulasi payroll staf bulanan untuk utilitas 2.000+ pelanggan.',
          'Menyusun jadwal shift kerja teknisi pemeliharaan dan memastikan ketersediaan personel tanggap darurat 24/7.',
          'Menjadi mediator komunikasi ketenagakerjaan antara pengurus dan pekerja lapangan guna memastikan kepatuhan penyaluran hak pekerja 100% tepat waktu.',
          'Meningkatkan ketertiban administrasi kepegawaian, transparansi kas operasional, dan kepatuhan regulasi kerja paguyuban.',
        ],
      },
      {
        id: 'proj-3',
        role: 'Academic Team & HR Operations Lead',
        organization: 'Lingua First',
        sector: 'Lembaga Kursus Bahasa Inggris',
        periodType: 'Collabs 6 Months',
        category: 'operations_retail',
        highlights: [
          'Memimpin supervisi, penjadwalan, dan pembagian beban kerja untuk 30 orang tim pengajar (lead tutor, assistant tutor) dan staf administrasi.',
          'Menyusun pedoman kerja pengajar, standar etika pengajaran, dan mekanisme evaluasi kinerja (KPI) berkala.',
          'Menyelenggarakan program onboarding tutor baru dan sesi mentoring rutin guna menjaga mutu pengajaran serta retensi pengajar 95%.',
          'Menyelesaikan dinamika tim akademik dan keluhan siswa dengan pendekatan humanis yang solutif.',
        ],
      },
      {
        id: 'proj-7',
        role: 'People Development & Talent Coordinator',
        organization: 'PRATAMA EO',
        sector: 'Event Management & Public Speaking',
        periodType: 'Project based',
        category: 'event_public',
        highlights: [
          "Mengoordinasikan penugasan talent pembawa acara (MC), pengisi acara, dan kru pelaksana pada 50+ perhelatan acara formal dan pernikahan.",
          "Menjadi pembicara dan fasilitator pelatihan kepemimpinan, komunikasi publik, dan pengembangan talenta di 15+ sesi workshop.",
          "Mengelola penugasan tim lapangan, kedisiplinan kerja, dan standar etika pelayanan pada 10+ event berskala besar.",
          "Membangun standar etika pelayanan dan koordinasi interpersonal yang solid antar anggota kepanitiaan.",
        ],
      },
      {
        id: 'proj-13',
        role: 'Creator & Influencer Talent Coordinator',
        organization: 'Mitra Usaha E-Commerce Tiens (Ambefit)',
        sector: 'Health & Wellness E-Commerce',
        periodType: 'Project 2 Months',
        category: 'marketing_media',
        highlights: [
          "Mengelola hubungan kerja, penugasan kreatif, dan koordinasi engagement dengan talent/influencer eksternal.",
          "Menyusun guideline brief konten, jadwal produksi, dan evaluasi profesionalitas kolaborasi mitra konten.",
          "Memastikan kepatuhan etika komunikasi brand dan kualitas performa kreator dalam mempromosikan produk Ambefit.",
        ],
      },
    ],
    digitalSolutions: [
      {
        id: 'sol-3',
        title: 'HR MATRIX',
        subtitle: 'HRIS, ATS & Workforce Management App',
        category: 'management',
        demoUrl: 'https://hrmatrix.my.id',
        isPrototype: true,
        description:
          'Ekosistem HR terintegrasi yang mencakup manajemen HR, administrasi karyawan, penggajian, presensi, rekrutmen, kinerja, kepatuhan, dan manajemen tenaga kerja. Dilengkapi alat HR digital, ATS, akses PWA, dan otomatisasi proses tenaga kerja.',
        impact:
          'Mengotomasi 80% pipeline rekrutmen talenta, memangkas durasi pemrosesan payroll bulanan 75-85%, mengeliminasi kesalahan hitung PPh 21 & BPJS hingga 100%, serta menyajikan pedoman implementasi tata kelola HR & kepatuhan hukum ketenagakerjaan secara zero-error.',
        techStack: ['Web/PWA Multiplatform', 'Custom ATS & WA/Email Alerts', 'Digital Payroll (TER & BPJS 5 Program)', 'Master HR E-Book & Spreadsheet Engine'],
        features: ['Custom Web ATS & Online Skill Assessment', 'Automated Payroll (PPh 21 TER & BPJS TK 5 Program)', 'KPI Performance Matrix & QR Geo-Presensi', 'Master Implementation E-Book & Spreadsheet Kalkulator'],
      },
      {
        id: 'sol-8',
        title: 'MY TALENTY',
        subtitle: 'People Development & Assessment App',
        category: 'management',
        demoUrl: 'https://mytalenty.vercel.app',
        isPrototype: true,
        description:
          'Platform end-to-end people development & rekrutmen: Gudang Test (psikotes & tes bidang berstandar profesional dengan hasil skor akurat untuk evaluasi kandidat), SmartForm (anti-contek otomatis, pelacakan durasi & pola pengisian, ribuan bank soal), serta portal rekrutmen HR terintegrasi untuk akuisisi pelamar, perpindahan data status karyawan, dan konektivitas payroll.',
        impact:
          'Meningkatkan akurasi dan objektivitas evaluasi kandidat hingga 98%, mengeliminasi kecurangan tes lewat SmartForm anti-contek, dan mempercepat transisi akuisisi pelamar ke sistem payroll/HRIS secara seamless.',
        techStack: ['SmartForm Anti-Cheating Engine', 'Psychometric Test Repository', 'Applicant Score Analytics', 'HR Acquisition & Payroll Sync'],
        features: ['Professional Gudang Test & Score Card', 'SmartForm Tab-Switch Detection', 'Automated HR Candidate Acquisition', 'End-to-End Employee & Payroll Sync'],
      },
      {
        id: 'sol-1',
        title: 'MITRA GATEWAY',
        subtitle: 'Enterprise Resource Planning App',
        category: 'enterprise',
        demoUrl: 'https://mitragateway.vercel.app',
        isPrototype: true,
        description:
          'Modul HRGA pada ERP korporat untuk integrasi struktur organisasi, database karyawan, persetujuan cuti/izin, dan pelaporan produktivitas ke jajaran eksekutif.',
        impact:
          'Memangkas birokrasi perizinan karyawan sebesar 70% dan menyajikan metrik SDM real-time kepada manajemen.',
        techStack: ['HRGA Integration', 'Employee Directory', 'Executive BI'],
        features: ['Leave Approval Flow', 'Organizational Chart Sync', 'Productivity Metrics'],
      },
    ],
  };

// --- marketing.ts ---
export const marketingProjects: TailoredProjectSet = {
    summary:
      'Portofolio kampanye pemasaran multi-channel, manajemen iklan berbayar (Meta & TikTok Ads), aktivasi promosi ritel multi-cabang (CV Multi Sejahtera & Jaya Baru), dan produksi konten multimedia berorientasi ROI.',
    projects: [
      {
        id: 'proj-11',
        role: 'Marketing Communication Manager',
        organization: 'CV Multi Sejahtera',
        sector: 'Retail Gadget & Smartphone',
        periodType: 'Project 4 Months',
        category: 'marketing_media',
        highlights: [
          'Memimpin strategi komunikasi pemasaran, promosi terpadu, dan branding untuk jaringan 5 gerai ritel gadget.',
          'Merancang kampanye promosi bulanan, aktivasi penjualan toko, materi visual point-of-sale (POS), dan pengelolaan iklan digital multi-cabang.',
          'Melakukan supervisi rutin ke 5 gerai untuk audit visual merchandising dan standardisasi materi penawaran staf frontliner.',
          'Menganalisis performa penjualan cabang, efektivitas ROI promosi, dan tren permintaan produk gadget.',
        ],
      },
      {
        id: 'proj-8',
        role: 'Social Media & Digital Advertising Specialist',
        organization: "Vany's Group",
        sector: 'Retail Fashion & Hospitality',
        periodType: 'Project 4 Months',
        category: 'marketing_media',
        highlights: [
          'Mengelola kampanye berbayar Meta Ads & TikTok Ads dengan penargetan audiens yang menghasilkan peningkatan ROAS.',
          'Merancang content calendar kreatif, copywriting penawaran, dan strategi storytelling produk fashion.',
          'Memproduksi video promosi sinematik untuk Grand Opening Vany Villa Balige di Sumatera Utara.',
          'Memonitor conversion funnel iklan digital untuk mengoptimalkan click-through rate (CTR) dan konversi.',
        ],
      },
      {
        id: 'proj-9',
        role: 'Digital Marketing & Branding Consultant',
        organization: 'PT. Anugrah Dwi Tunggal',
        sector: 'Digital Printing Solution',
        periodType: 'Project based',
        category: 'marketing_media',
        highlights: [
          'Mengembangkan brand positioning dan strategi komunikasi online untuk solusi percetakan digital komersial.',
          'Mengelola kampanye iklan digital di Meta Ads dan optimasi etalase toko di 3 platform e-commerce.',
          'Meningkatkan inbound inquiry B2B sebesar 40% melalui penargetan iklan berbasis industri target.',
        ],
      },
      {
        id: 'proj-5',
        role: 'Social Media & Creative Campaign Lead',
        organization: 'STIE Wibawa Karta Raharja',
        sector: 'Higher Education',
        periodType: 'Project 1,5 Years',
        category: 'marketing_media',
        highlights: [
          'Mengelola konten media sosial institusi untuk meningkatkan engagement calon mahasiswa baru.',
          'Memproduksi video promosi kampus, liputan event akademik, dan konten testimoni mahasiswa berprestasi.',
          'Mendukung peningkatan pendaftaran mahasiswa baru melalui kampanye digital yang konsisten.',
        ],
      },
      {
        id: 'proj-12',
        role: 'Interim Operations & Social Media Strategy Consultant',
        organization: 'PT Shansusdzar Indonesia',
        sector: 'Interior Design & Build',
        periodType: 'Project 1 Month',
        category: 'marketing_media',
        highlights: [
          "Melakukan pembaharuan strategi media sosial, visual branding, dan portfolio showcase PT Shansusdzar Indonesia.",
          "Menyelaraskan alur kerja tim kreatif sosial media dengan operasional proyek interior untuk dokumentasi berkala.",
          "Meningkatkan keteraturan posting, konsistensi identitas visual, dan lead generation melalui kanal media sosial.",
        ],
      },
      {
        id: 'proj-13',
        role: 'Influencer Marketing & Digital Campaign Specialist',
        organization: 'Mitra Usaha E-Commerce Tiens (Ambefit)',
        sector: 'Health & Wellness E-Commerce',
        periodType: 'Project 2 Months',
        category: 'marketing_media',
        highlights: [
          "Merancang dan mengeksekusi kampanye digital influencer marketing terpadu untuk produk kesehatan Ambefit.",
          "Mengkurasi dan mengarahkan kreator konten dalam memproduksi konten promosi edukatif bernilai konversi tinggi.",
          "Menganalisis performa engagement, viralitas konten video pendek, dan efektivitas funnel penjualan produk e-commerce.",
        ],
      },
    ],
    digitalSolutions: [
      {
        id: 'sol-4',
        title: 'NEXT MARKETING',
        subtitle: 'CRM & Marketing Automation',
        category: 'crm',
        demoUrl: 'https://nextmarkefing.vercel.app',
        isPrototype: true,
        description:
          'Platform automasi pemasaran: pelacakan kampanye multi-channel, integrasi analitik performa iklan (ROAS/ROI), dan lead nurturing pipeline otomatis.',
        impact:
          'Meningkatkan closing rate prospek hingga 45% dan meningkatkan efisiensi alokasi anggaran iklan digital (ROAS) sebesar 35%.',
        techStack: ['Marketing Automation', 'Ad Performance Tracker', 'Conversion Analytics'],
        features: ['Multi-Channel Campaign View', 'ROAS Calculator', 'Automated Lead Workflow'],
      },
    ],
  };

// --- office_administration.ts ---
export const office_administrationProjects: TailoredProjectSet = {
    summary:
      'Portofolio tata kelola administrasi operasional, kerapihan arsip dokumen, penyusunan laporan keuangan harian, administrasi tagihan pelanggan, dan konsistensi alur kerja.',
    projects: [
      {
        id: 'proj-10',
        role: 'Administrative & Financial Control Officer',
        organization: 'Tirta Raharja – BPSPAMS',
        sector: 'Water & Sanitation Organization',
        periodType: 'Monthly Project',
        category: 'admin_finance',
        highlights: [
          'Mengelola administrasi operasional dan pelaporan keuangan rutin bulanan untuk 2.000+ pelanggan aktif.',
          'Melakukan pencatatan kas, kalkulasi tagihan bulanan, dan rekonsiliasi berkas penggajian staf.',
          'Mendokumentasikan arsip administrasi dan laporan keuangan secara rapi dan transparan.',
        ],
      },
      {
        id: 'proj-3',
        role: 'Academic & Administrative Operations Officer',
        organization: 'Lingua First',
        sector: 'Lembaga Kursus Bahasa Inggris',
        periodType: 'Collabs 6 Months',
        category: 'operations_retail',
        highlights: [
          'Mengelola administrasi pendaftaran 300+ siswa, pencatatan presensi, dan arsip jadwal tutor.',
          'Menyusun laporan rekapitulasi operasional berkala untuk evaluasi manajemen lembaga.',
        ],
      },
      {
        id: 'proj-12',
        role: 'Interim Operations & Administrative Systems Manager',
        organization: 'PT Shansusdzar Indonesia',
        sector: 'Interior Design & Build',
        periodType: 'Project 1 Month',
        category: 'admin_finance',
        highlights: [
          "Menata ulang sistem pengarsipan administrasi, pencatatan keuangan operasional, dan dokumentasi proyek interior.",
          "Menyusun standardisasi format laporan berkala, surat-menyurat bisnis, dan alur sirkulasi dokumen antar divisi.",
          "Memastikan transparansi data administrasi dan ketertiban pembukuan operasional PT Shansusdzar Indonesia.",
        ],
      },
      {
        id: 'proj-13',
        role: 'Campaign Administration & Content Coordinator',
        organization: 'Mitra Usaha E-Commerce Tiens (Ambefit)',
        sector: 'Health & Wellness E-Commerce',
        periodType: 'Project 2 Months',
        category: 'admin_finance',
        highlights: [
          "Mengelola administrasi perjanjian kerjasama, kontrak influencer, dan dokumentasi bukti tayang (proof of posting).",
          "Menyusun rekapitulasi data performa kampanye dan pencatatan kompensasi mitra kreator secara rapi dan akurat.",
          "Mengoordinasikan kelengkapan aset promosi produk Ambefit dan pengiriman sampel produk ke influencer.",
        ],
      },
    ],
    digitalSolutions: [
      {
        id: 'sol-5',
        title: 'VYNANCE',
        subtitle: 'Accounting, Finance & Transaction Ledger App',
        category: 'management',
        demoUrl: 'https://vynance.vercel.app',
        isPrototype: true,
        description:
          'Sistem administrasi transaksi keuangan, pencatatan jurnal kas, dan arsip dokumen pembukuan terstruktur.',
        impact:
          'Memangkas waktu penyusunan rekapitulasi administrasi hingga 50% dan meningkatkan ketelitian data.',
        techStack: ['Ledger System', 'Document Archiving', 'Cash Flow Journal'],
        features: ['Automated Journaling', 'Receipt Archiving', 'Monthly Balance Report'],
      },
    ],
  };

// --- optimal.ts ---
export const optimalProjects: TailoredProjectSet = {
    summary:
      'Portofolio konsultasi operasional, pengembangan solusi AI & aplikasi digital, tata kelola SDM, strategi harga ritel, koordinasi event skala besar, hingga kampanye digital multi-channel untuk berbagai institusi dan industri.',
    projects: [
      {
        id: 'proj-1',
        role: 'HR & Operations',
        organization: 'AlinLabs Indonesia',
        sector: 'Digital Agency & AI Solutions',
        periodType: 'Project based',
        category: 'digital_tech',
        highlights: [
          'Mengelola 30+ website & application development projects serta 5+ video production projects end-to-end.',
          'Mengembangkan website, mobile/web applications, AI solutions, otomasi sistem, dan strategi digital terpadu sesuai kebutuhan berbagai klien korporat.',
          'Memimpin project lifecycle mulai dari perencanaan (planning), alokasi resource, eksekusi teknis, hingga project delivery dan client training.',
          'Berkoordinasi intensif dengan stakeholders kunci untuk memastikan SLA, timeline, kepatuhan anggaran, dan standar kualitas tercapai.',
        ],
      },
      {
        id: 'proj-2',
        role: 'Business Operations Consultant',
        organization: 'World Street Trendy Fashion',
        sector: 'Footwear Retail',
        periodType: 'Project based',
        category: 'operations_retail',
        highlights: [
          'Mengembangkan master database terstruktur untuk 100+ SKU produk menggunakan Google Sheets & cloud data architecture.',
          'Formulasi pricing strategy komprehensif: kalkulasi HPP (COGS), margin keuntungan, penetapan bottom price, dan penyesuaian harga jual e-commerce dengan kalkulasi tax/pajak khusus.',
          'Membangun sistem operasional & skema kemitraan komersial multi-channel meliputi jaringan reseller hingga program affiliator.',
          'Merancang SOP pelaporan operasional/keuangan berkala serta alur otomatis restock inventaris guna menjaga stabilitas rantai pasok.',
        ],
      },
      {
        id: 'proj-3',
        role: 'Academic & Operations Consultant',
        organization: 'Lingua First',
        sector: 'Lembaga Kursus Bahasa Inggris',
        periodType: 'Collabs 6 Months',
        category: 'operations_retail',
        highlights: [
          'Mengelola operasional akademik dan sinkronisasi 300+ member/siswa aktif dengan jadwal tutor, klasifikasi paket kursus (reguler, private, intensive), dan kuota pertemuan.',
          'Memimpin dan mengoordinasikan 30 orang tim pengajar dan operasional (lead tutor, asisten tutor, dan staf administrasi).',
          'Merancang workflow penjadwalan terintegrasi, administrasi kehadiran, dan sistem monitoring evaluasi progres belajar siswa.',
          'Meningkatkan efisiensi utilisasi ruang kelas dan jadwal tutor, mengeliminasi konflik jadwal, serta menjaga skor kepuasan peserta >95%.',
        ],
      },
      {
        id: 'proj-4',
        role: 'Business Operations Consultant',
        organization: 'Melin Parfum',
        sector: 'Perfume Retail',
        periodType: 'Project based',
        category: 'operations_retail',
        highlights: [
          'Mengembangkan master database terstruktur & katalog produk untuk 50+ SKU varian parfum.',
          'Formulasi pricing strategy terintegrasi: kalkulasi HPP (COGS), profit margin, penetapan bottom price, dan penyesuaian tax multi-platform e-commerce.',
          'Membangun skema operasional & kemitraan komersial multi-channel (reseller, distributor, affiliator).',
          'Standardisasi laporan operasional/keuangan berkala serta kontrol otomatis replenishment stok toko.',
        ],
      },
      {
        id: 'proj-5',
        role: 'Social Media & Project Coordinator',
        organization: 'STIE Wibawa Karta Raharja',
        sector: 'Higher Education',
        periodType: 'Project 1,5 Years',
        category: 'marketing_media',
        highlights: [
          'Mengelola strategi social media dan kampanye digital institusi pendidikan tinggi.',
          'Mendukung administrasi kontrak kemitraan, legal document, dan koordinasi stakeholder terkait.',
          'Mengoordinasikan talent, vendor visual, dan tim teknis untuk berbagai produksi media institusi.',
          'Mengarahkan proses shooting serta produksi video promosi berkala untuk kegiatan kampus.',
        ],
      },
      {
        id: 'proj-6',
        role: 'Multimedia & Website Project',
        organization: 'Pesantren Minnatul Huda',
        sector: 'Islamic Boarding School',
        periodType: 'Project based',
        category: 'digital_tech',
        highlights: [
          'Memproduksi company profile video profesional sebagai media promosi dan visual branding institusi.',
          'Mengembangkan website resmi institusi berbasis standar UI/UX modern dan responsif.',
          'Berkoordinasi dengan pengurus yayasan dalam kurasi konten dan arsitektur informasi digital.',
          'Mendukung penguatan digital branding dan media komunikasi santri/wali santri.',
        ],
      },
      {
        id: 'proj-7',
        role: 'Speaker & Event Organizer',
        organization: 'PRATAMA EO',
        sector: 'Event Management & Public Speaking',
        periodType: 'Project based',
        category: 'event_public',
        highlights: [
          "Menjadi Master of Ceremony (MC) profesional untuk 50+ wedding events dan agenda formal korporasi/pemerintahan.",
          "Menjadi narasumber/speaker pada 15+ seminar, workshop manajemen, dan kegiatan edukasi generasi muda.",
          "Mengelola pelaksanaan 10+ large-scale events mulai dari timeline, koordinasi vendor, budgeting, hingga eksekusi live event.",
          "Menyusun rundown teknis, flow acara, serta mitigasi risiko untuk menjamin kelancaran event.",
        ],
      },
      {
        id: 'proj-8',
        role: 'Social Media Ads Specialist',
        organization: "Vany's Group",
        sector: 'Retail Fashion',
        periodType: 'Project 4 Months',
        category: 'marketing_media',
        highlights: [
          'Mengelola kampanye Meta Ads dan TikTok Ads terarah untuk kebutuhan penetrasi pasar ritel fashion.',
          'Menyusun content calendar kreatif dan advertising strategy berbasis data konversi audiens.',
          'Memproduksi video promosi komersial untuk peluncuran akbar (Grand Opening) Villa di Sumatera Utara.',
          'Melakukan monitoring ROAS dan optimasi performa campaign secara berkala.',
        ],
      },
      {
        id: 'proj-9',
        role: 'Digital Marketing & Consultant',
        organization: 'PT. Anugrah Dwi Tunggal',
        sector: 'Digital Printing Solution',
        periodType: 'Project based',
        category: 'marketing_media',
        highlights: [
          'Mengembangkan strategi digital marketing dan reposisi branding korporat di ranah online.',
          'Mengelola 2 Meta Ads campaigns dan 3 storefront e-commerce untuk menjangkau pasar B2B & B2C.',
          'Mengoptimalkan funnel akuisisi digital untuk meningkatkan volume permintaan cetak komersial.',
          'Menyusun laporan analitik konversi dan efisiensi biaya akuisisi pelanggan (CAC).',
        ],
      },
      {
        id: 'proj-10',
        role: 'Administrative & Finance Officer',
        organization: 'Tirta Raharja (BPSPAMS)',
        sector: 'Water & Sanitation Organization',
        periodType: 'Monthly Project',
        category: 'admin_finance',
        highlights: [
          'Mengelola administrasi operasional dan pelaporan keuangan rutin untuk 2.000+ pelanggan aktif.',
          'Melakukan kalkulasi tagihan bulanan, pencatatan kas masuk/keluar, dan rekonsiliasi payroll staf teknis.',
          'Mendokumentasikan arsip administrasi, pembukuan jurnal kas, dan transparansi laporan keuangan.',
          'Menyajikan data laporan periodik sebagai dasar evaluasi operasional dan tata kelola organisasi.',
        ],
      },
      {
        id: 'proj-11',
        role: 'Marketing Communication Manager',
        organization: 'CV Multi Sejahtera',
        sector: 'Retail Gadget & Smartphone',
        periodType: 'Project 4 Months',
        category: 'marketing_media',
        highlights: [
          'Memimpin strategi komunikasi pemasaran, promosi terpadu, dan branding multi-cabang untuk jaringan 5 gerai ritel gadget & smartphone.',
          'Merancang dan mengeksekusi kampanye promosi bulanan, aktivasi penjualan toko, materi visual point-of-sale (POS), dan pengelolaan iklan digital multi-cabang.',
          'Melakukan supervisi rutin ke 5 gerai toko untuk audit visual merchandising, standardisasi display promo, dan penyelarasan materi penawaran staf frontliner.',
          'Menganalisis performa penjualan cabang, efektivitas ROI promosi, dan tren permintaan produk gadget sebagai dasar strategi pemasaran berkelanjutan.',
        ],
      },
      {
        id: 'proj-12',
        role: 'Interim Operations Manager',
        organization: 'PT Shansusdzar Indonesia',
        sector: 'Interior Design & Build',
        periodType: 'Project 1 Month',
        category: 'operations_retail',
        highlights: [
          "Melakukan audit dan restrukturisasi menyeluruh pada sistem manajemen operasional, tata kelola keuangan, dan strategi media sosial.",
          "Menstandardisasi SOP alur kerja (workflow) internal lintas divisi untuk memangkas inefisiensi proses bisnis.",
          "Mengembangkan tata kelola integrasi data dan pelaporan operasional untuk mendukung pengambilan keputusan eksekutif.",
        ],
      },
      {
        id: 'proj-13',
        role: 'Influencer Marketing & Content Strategist',
        organization: 'Mitra Usaha E-Commerce Tiens (Ambefit)',
        sector: 'Health & Wellness E-Commerce',
        periodType: 'Project 2 Months',
        category: 'marketing_media',
        highlights: [
          "Mengelola kolaborasi dan aktivasi influencer untuk kampanye promosi digital produk kesehatan Ambefit.",
          "Merancang creative concept dan memproduksi konten promosi untuk meningkatkan brand awareness dan konversi penjualan.",
          "Mendukung strategi pemasaran digital dan evaluasi engagement untuk memperluas jangkauan target audiens.",
        ],
      },
    ],
    digitalSolutions: [
      {
        id: 'sol-1',
        title: 'MITRA GATEWAY',
        subtitle: 'Enterprise Resource Planning App',
        category: 'enterprise',
        demoUrl: 'https://mitragateway.vercel.app',
        isPrototype: true,
        description:
          'Ekosistem ERP korporasi full-stack multi-modul terintegrasi yang menghubungkan Marketing, Finance & Accounting, HRGA, Operasional, hingga Executive Dashboard untuk C-Level/Owner secara real-time.',
        impact:
          'Meningkatkan efisiensi alur kerja lintas divisi hingga 65%, memangkas redundansi data operasional sebesar 80%, serta mempercepat siklus pelaporan eksekutif dan pengambilan keputusan strategis C-Level hingga 2x lebih cepat.',
        techStack: ['Full-Stack ERP', 'Executive BI Dashboard', 'Cross-Department Sync'],
        features: ['Multi-Module Integration', 'Owner/Executive Portal', 'Cross-Divisional Workflow'],
      },
      {
        id: 'sol-2',
        title: 'LOGISTOR',
        subtitle: 'Logistics, Warehouse & Operations App',
        category: 'enterprise',
        demoUrl: 'https://logistor.vercel.app',
        isPrototype: true,
        description:
          'Sistem manajemen rantai pasok & logistik komprehensif: kontrol bahan baku, inventaris masuk/keluar, kalkulasi HPP otomatis (FIFO/LIFO/Average), manajemen database supplier, tracking utang-piutang dagang, jadwal produksi, serta monitoring distribusi klien.',
        impact:
          'Menekan selisih stok & kerugian operasional inventaris hingga 70%, mengotomasi 100% kalkulasi HPP akurat, serta memangkas waktu rekonsiliasi utang-piutang dan siklus pelaporan gudang sebesar 60%.',
        techStack: ['Inventory Engine (FIFO/LIFO)', 'Supply Chain & AP/AR', 'Production Scheduling'],
        features: ['Multi-Method HPP Engine', 'Supplier & Debt/Receivable Tracking', 'End-to-End Production & Distribution'],
      },
      {
        id: 'sol-3',
        title: 'HR MATRIX',
        subtitle: 'HRIS, ATS & Workforce Management App',
        category: 'management',
        demoUrl: 'https://hrmatrix.my.id',
        isPrototype: true,
        description:
          'Ekosistem HR terintegrasi yang mencakup manajemen HR, administrasi karyawan, penggajian, presensi, rekrutmen, kinerja, kepatuhan, dan manajemen tenaga kerja. Dilengkapi alat HR digital, ATS, akses PWA, dan otomatisasi proses tenaga kerja.',
        impact:
          'Mengotomasi 80% pipeline rekrutmen talenta, memangkas durasi pemrosesan payroll bulanan 75-85%, mengeliminasi kesalahan hitung PPh 21 & BPJS hingga 100%, serta menyajikan pedoman implementasi tata kelola HR & kepatuhan hukum ketenagakerjaan secara zero-error.',
        techStack: ['Web/PWA Multiplatform', 'Custom ATS & WA/Email Alerts', 'Digital Payroll (TER & BPJS 5 Program)', 'Master HR E-Book & Spreadsheet Engine'],
        features: ['Custom Web ATS & Online Skill Assessment', 'Automated Payroll (PPh 21 TER & BPJS TK 5 Program)', 'KPI Performance Matrix & QR Geo-Presensi', 'Master Implementation E-Book & Spreadsheet Kalkulator'],
      },
      {
        id: 'sol-8',
        title: 'MY TALENTY',
        subtitle: 'People Development & Assessment App',
        category: 'management',
        demoUrl: 'https://mytalenty.vercel.app',
        isPrototype: true,
        description:
          'Platform end-to-end people development & rekrutmen: Gudang Test (psikotes & tes bidang berstandar profesional dengan hasil skor akurat untuk evaluasi kandidat), SmartForm (anti-contek otomatis, pelacakan durasi & pola pengisian, ribuan bank soal), serta portal rekrutmen HR terintegrasi untuk akuisisi pelamar, perpindahan data status karyawan, dan konektivitas payroll.',
        impact:
          'Meningkatkan akurasi dan objektivitas evaluasi kandidat hingga 98%, mengeliminasi kecurangan tes lewat SmartForm anti-contek, dan mempercepat transisi akuisisi pelamar ke sistem payroll/HRIS secara seamless.',
        techStack: ['SmartForm Anti-Cheating Engine', 'Psychometric Test Repository', 'Applicant Score Analytics', 'HR Acquisition & Payroll Sync'],
        features: ['Professional Gudang Test & Score Card', 'SmartForm Tab-Switch Detection', 'Automated HR Candidate Acquisition', 'End-to-End Employee & Payroll Sync'],
      },
      {
        id: 'sol-4',
        title: 'NEXT MARKETING',
        subtitle: 'CRM & Marketing Automation',
        category: 'crm',
        demoUrl: 'https://nextmarkefing.vercel.app',
        isPrototype: true,
        description:
          'Platform CRM dan otomasi pemasaran multi-channel terpadu untuk mengelola pipeline prospek B2B, otomatisasi lead follow-up, serta analitik performa iklan digital, evaluasi ROAS/ROI kampanye, dan tracking konversi closing.',
        impact:
          'Meningkatkan closing rate konversi prospek B2B hingga 45%, mempercepat respons follow-up otomatis 3x lebih cepat, serta mengoptimalkan efisiensi alokasi anggaran iklan digital (ROAS) sebesar 35%.',
        techStack: ['CRM Pipeline', 'Ad Performance & ROI Analytics', 'Marketing Automation Engine'],
        features: ['Multi-Channel Campaign Tracking', 'Ad Spend & ROI Analytics', 'Automated Lead Nurturing'],
      },
      {
        id: 'sol-5',
        title: 'VYNANCE',
        subtitle: 'Accounting, Finance & Transaction Ledger App',
        category: 'enterprise',
        demoUrl: 'https://vynance.vercel.app',
        isPrototype: true,
        description:
          'Platform pencatatan keuangan dan transaksi komprehensif yang dirancang modular serta siap di-upgrade ke skala enterprise: mencakup manajemen arus kas harian, buku besar keuangan korporat, inventarisasi dan depresiasi aset bisnis, jurnal transaksi otomatis, neraca laba rugi, hingga pelaporan keuangan terpadu.',
        impact:
          'Visibilitas arus kas 100%, otomatisasi jurnal & depresiasi aset real-time, penurunan kesalahan pencatatan hingga 95%, serta kesiapan skalabilitas sistem dari personal ke operasional bisnis/enterprise.',
        techStack: ['Financial Ledger Engine', 'Enterprise Asset Management', 'Cashflow & Depreciation Analytics'],
        features: ['Personal & Corporate Ledger', 'Depresiasi Aset & Audit Lifecycle', 'Laporan Keuangan & Arus Kas'],
      },
      {
        id: 'sol-6',
        title: 'MY DIBY',
        subtitle: 'B2B & Corporate Intelligence App',
        category: 'management',
        demoUrl: 'https://mydiby.vercel.app',
        isPrototype: true,
        description:
          'Direktori intelijen pasar perusahaan untuk memetakan 4.000+ data korporat (PIC HRGA, Purchasing, GM) beserta koordinat pemetaan zonasi kawasan industri strategis.',
        impact:
          'Memetakan 4.000+ korporasi dan 5.200+ kontak pengambil keputusan kunci di berbagai kawasan industri strategis, meningkatkan efisiensi waktu prospeksi B2B hingga 85%.',
        techStack: ['Database Management', 'Geo-Mapping Index', 'Export & Filter Engine'],
        features: ['4000+ Company Profiling', 'Geo-Mapping Kawasan Industri', 'Multi-level Filter'],
      },
    ],
  };

// --- pr.ts ---
export const prProjects: TailoredProjectSet = {
    summary:
      'Portofolio komunikasi korporat, hubungan masyarakat, manajemen media massa & digital, pengarahan event formal, serta pembawa acara (MC) profesional untuk institusi.',
    projects: [
      {
        id: 'proj-7',
        role: 'Public Relations Speaker & MC Director',
        organization: 'PRATAMA EVENT ORGANIZER',
        sector: 'Event Management & Public Speaking',
        periodType: 'Project based',
        category: 'event_public',
        highlights: [
          "Mewakili citra profesional dan reputasi institusi sebagai Master of Ceremony (MC) pada 50+ event formal dan korporat.",
          "Menjadi narasumber/speaker pada 15+ seminar publik, workshop hubungan masyarakat, dan forum edukasi.",
          "Mengarahkan manajemen komunikasi panggung, rundown acara, dan koordinasi VIP guest untuk 10+ event skala besar.",
          "Menjaga standar etika komunikasi publik dan kelancaran interaksi audiens selama rangkaian acara berlangsung.",
        ],
      },
      {
        id: 'proj-5',
        role: 'Public Relations & Media Project Lead',
        organization: 'STIE Wibawa Karta Raharja',
        sector: 'Higher Education',
        periodType: 'Project 1,5 Years',
        category: 'marketing_media',
        highlights: [
          'Mengelola komunikasi publik, media sosial institusi, dan produksi media promosi kampus.',
          'Mengoordinasikan administrasi kemitraan, dokumen legal, dan hubungan dengan pemangku kepentingan eksternal.',
        ],
      },
      {
        id: 'proj-6',
        role: 'Institutional Communications & Video Lead',
        organization: 'Pesantren Minnatul Huda',
        sector: 'Islamic Boarding School',
        periodType: 'Project based',
        category: 'digital_tech',
        highlights: [
          'Memproduksi video profil institusi dan mengarahkan konten website untuk komunikasi publik.',
        ],
      },
      {
        id: 'proj-12',
        role: 'Interim Corporate Communications & Operations Consultant',
        organization: 'PT Shansusdzar Indonesia',
        sector: 'Interior Design & Build',
        periodType: 'Project 1 Month',
        category: 'marketing_media',
        highlights: [
          "Merestrukturisasi citra visual brand dan narasi komunikasi digital PT Shansusdzar Indonesia melalui pembenahan media sosial.",
          "Menyelaraskan pesan brand (brand messaging) arsitektur & interior dengan standar kualitas operasional perusahaan.",
          "Menata ulang SOP komunikasi publik dan respon interaksi calon klien di kanal digital.",
        ],
      },
      {
        id: 'proj-13',
        role: 'Influencer Relations & Digital PR Strategist',
        organization: 'Mitra Usaha E-Commerce Tiens (Ambefit)',
        sector: 'Health & Wellness E-Commerce',
        periodType: 'Project 2 Months',
        category: 'marketing_media',
        highlights: [
          "Membangun dan membina relasi strategis dengan komunitas influencer kesehatan untuk promosi produk Ambefit.",
          "Menyusun panduan narasi komunikasi brand (brand storytelling) agar pesan manfaat produk tersampaikan secara kredibel.",
          "Mengelola sentimen audiens dan mengoptimalkan publikasi konten untuk memperkuat reputasi produk kesehatan di ranah online.",
        ],
      },
    ],
    digitalSolutions: [
      {
        id: 'sol-4',
        title: 'NEXT MARKETING',
        subtitle: 'CRM & Marketing Automation',
        category: 'crm',
        demoUrl: 'https://nextmarkefing.vercel.app',
        isPrototype: true,
        description:
          'Platform pengelolaan kampanye komunikasi media digital, publikasi promosi, dan pemantauan jangkauan audiens.',
        impact:
          'Meningkatkan visibilitas pesan komunikasi institusi dan efisiensi penyebaran publikasi media.',
        techStack: ['Media Campaign Analytics', 'Content Scheduler', 'Public Engagement Tracker'],
        features: ['Multi-Channel Distribution', 'Audience Reach Analytics', 'Campaign Monitor'],
      },
    ],
  };

// --- project_management.ts ---
export const project_managementProjects: TailoredProjectSet = {
    summary:
      'Portofolio tata kelola siklus proyek (Project Lifecycle Management), pengawalan timeline & deliverables, mitigasi risiko, alokasi anggaran, dan koordinasi multi-stakeholder untuk 30+ proyek digital, konsultasi, dan event.',
    projects: [
      {
        id: 'proj-1',
        role: 'Project Director & Delivery Specialist',
        organization: 'Alinlabs Indonesia',
        sector: 'Digital Agency & AI Solutions',
        periodType: 'Project based',
        category: 'digital_tech',
        highlights: [
          'Memimpin project lifecycle management untuk 30+ website/app projects dan 5+ video projects dari scoping, milestone planning, hingga UAT (User Acceptance Testing).',
          'Menerapkan metodologi kerja agile/waterfall sesuai skala proyek dan mengontrol timeline menggunakan Gantt chart & Trello/Notion board.',
          'Mengelola ekspektasi klien korporat, scope change request, serta mitigasi risiko keterlambatan delivery.',
          'Mencapai tingkat kepuasan serah terima proyek (project acceptance rate) 98% tepat waktu.',
        ],
      },
      {
        id: 'proj-7',
        role: 'Lead Event Project Manager',
        organization: 'PRATAMA EVENT ORGANIZER',
        sector: 'Event Management & Public Speaking',
        periodType: 'Project based',
        category: 'event_public',
        highlights: [
          "Memimpin manajemen proyek perhelatan 50+ event pernikahan dan 10+ agenda akbar korporat/komunitas.",
          "Menyusun Work Breakdown Structure (WBS), master timeline acara, dan sistem pengawasan vendor multi-pihak.",
          "Mengendalikan anggaran pelaksanaan event dan memitigasi risiko teknis panggung dengan tingkat keberhasilan 100%.",
          "Memastikan seluruh milestone persiapan dan eksekusi hari H selesai sesuai target dan ekspektasi klien.",
        ],
      },
      {
        id: 'proj-6',
        role: 'Project Manager Website & Multimedia',
        organization: 'Pesantren Minnatul Huda',
        sector: 'Islamic Boarding School',
        periodType: 'Project based',
        category: 'digital_tech',
        highlights: [
          'Mengelola proyek pembuatan video company profile dan website institusi dengan timeline ketat 1 bulan.',
          'Menyusun storyboard, jadwal shooting, alokasi kru, dan tahapan revisi konten bersama dewan pimpinan pesantren.',
          'Mengawal delivery hasil video dan peluncuran website tepat waktu dengan respon positif dari stakeholder.',
        ],
      },
      {
        id: 'proj-2',
        role: 'Operations Project Consultant',
        organization: 'World Street Trendy Fashion',
        sector: 'Footwear Retail',
        periodType: 'Project based',
        category: 'operations_retail',
        highlights: [
          'Menginisiasi proyek restrukturisasi sistem data SKU dan sistem pricing e-commerce selesai dalam 2 bulan.',
          'Memetakan milestone implementasi, pelatihan staf admin, dan transisi menuju katalog terstruktur.',
          'Menyerahkan dokumentasi SOP lengkap kepada owner sebagai deliverable akhir proyek.',
        ],
      },
      {
        id: 'proj-12',
        role: 'Interim Operations Project Manager (1-Month Sprint)',
        organization: 'PT Shansusdzar Indonesia',
        sector: 'Interior Design & Build',
        periodType: 'Project 1 Month',
        category: 'operations_retail',
        highlights: [
          "Memimpin fast-track project 1 bulan untuk restrukturisasi menyeluruh sistem operasional, keuangan, dan media sosial.",
          "Merancang milestone sprint mingguan, mengidentifikasi bottleneck operasional, dan mengeksekusi problem solving taktis.",
          "Menyelesaikan 100% target pembaharuan sistem manajemen tepat waktu dengan serah terima SOP terstandardisasi.",
        ],
      },
      {
        id: 'proj-13',
        role: 'Influencer Marketing Campaign Project Manager',
        organization: 'Mitra Usaha E-Commerce Tiens (Ambefit)',
        sector: 'Health & Wellness E-Commerce',
        periodType: 'Project 2 Months',
        category: 'marketing_media',
        highlights: [
          "Mengelola project lifecycle kampanye influencer marketing 2 bulan untuk produk kesehatan Ambefit.",
          "Mengendalikan timeline produksi aset kreatif, jadwal publikasi multi-influencer, dan manajemen deliverable konten.",
          "Memantau KPI performa kampanye (reach, impressions, CTR) serta mitigasi kendala jadwal rilis materi promosi.",
        ],
      },
    ],
    digitalSolutions: [
      {
        id: 'sol-2',
        title: 'LOGISTOR',
        subtitle: 'Logistics, Warehouse & Operations App',
        category: 'enterprise',
        demoUrl: 'https://logistor.vercel.app',
        isPrototype: true,
        description:
          'Sistem manajemen proyek internal untuk penjadwalan fase produksi, pelacakan milestone pemasangan interior, dokumentasi progres visual, dan SLA serah terima klien.',
        impact:
          'Memastikan 95%+ proyek komersial selesai on-time dan memangkas waktu pelaporan progres kepada klien hingga 60%.',
        techStack: ['Gantt & Timeline Engine', 'Milestone Tracker', 'Visual Documentation'],
        features: ['Phase Scheduling', 'SLA Monitoring', 'Client Delivery Portal'],
      },
      {
        id: 'sol-1',
        title: 'MITRA GATEWAY',
        subtitle: 'Enterprise Resource Planning App',
        category: 'enterprise',
        demoUrl: 'https://mitragateway.vercel.app',
        isPrototype: true,
        description:
          'Dashboard terpadu untuk monitoring portofolio proyek multi-divisi, realisasi anggaran per proyek, dan performa tim eksekusi.',
        impact:
          'Meningkatkan visibilitas progres proyek C-Level 2x lebih cepat dan mencegah deviasi anggaran proyek.',
        techStack: ['Executive Project BI', 'Budget Tracking', 'Milestone Alert'],
        features: ['Cross-Project Dashboard', 'Budget vs Actual Tracker', 'Resource Allocation'],
      },
    ],
  };

// --- public_relations.ts ---
export const public_relationsProjects: TailoredProjectSet = {
    summary:
      'Portofolio komunikasi korporat, hubungan masyarakat, manajemen media massa & digital, pengarahan event formal, serta pembawa acara (MC) profesional untuk institusi.',
    projects: [
      {
        id: 'proj-7',
        role: 'Public Relations Speaker & MC Director',
        organization: 'PRATAMA EVENT ORGANIZER',
        sector: 'Event Management & Public Speaking',
        periodType: 'Project based',
        category: 'event_public',
        highlights: [
          "Mewakili citra profesional dan reputasi institusi sebagai Master of Ceremony (MC) pada 50+ event formal dan korporat.",
          "Menjadi narasumber/speaker pada 15+ seminar publik, workshop hubungan masyarakat, dan forum edukasi.",
          "Mengarahkan manajemen komunikasi panggung, rundown acara, dan koordinasi VIP guest untuk 10+ event skala besar.",
          "Menjaga standar etika komunikasi publik dan kelancaran interaksi audiens selama rangkaian acara berlangsung.",
        ],
      },
      {
        id: 'proj-5',
        role: 'Public Relations & Media Project Lead',
        organization: 'STIE Wibawa Karta Raharja',
        sector: 'Higher Education',
        periodType: 'Project 1,5 Years',
        category: 'marketing_media',
        highlights: [
          'Mengelola komunikasi publik, media sosial institusi, dan produksi media promosi kampus.',
          'Mengoordinasikan administrasi kemitraan, dokumen legal, dan hubungan dengan pemangku kepentingan eksternal.',
        ],
      },
      {
        id: 'proj-6',
        role: 'Institutional Communications & Video Lead',
        organization: 'Pesantren Minnatul Huda',
        sector: 'Islamic Boarding School',
        periodType: 'Project based',
        category: 'digital_tech',
        highlights: [
          'Memproduksi video profil institusi dan mengarahkan konten website untuk komunikasi publik.',
        ],
      },
      {
        id: 'proj-12',
        role: 'Interim Corporate Communications & Operations Consultant',
        organization: 'PT Shansusdzar Indonesia',
        sector: 'Interior Design & Build',
        periodType: 'Project 1 Month',
        category: 'marketing_media',
        highlights: [
          "Merestrukturisasi citra visual brand dan narasi komunikasi digital PT Shansusdzar Indonesia melalui pembenahan media sosial.",
          "Menyelaraskan pesan brand (brand messaging) arsitektur & interior dengan standar kualitas operasional perusahaan.",
          "Menata ulang SOP komunikasi publik dan respon interaksi calon klien di kanal digital.",
        ],
      },
      {
        id: 'proj-13',
        role: 'Influencer Relations & Digital PR Strategist',
        organization: 'Mitra Usaha E-Commerce Tiens (Ambefit)',
        sector: 'Health & Wellness E-Commerce',
        periodType: 'Project 2 Months',
        category: 'marketing_media',
        highlights: [
          "Membangun dan membina relasi strategis dengan komunitas influencer kesehatan untuk promosi produk Ambefit.",
          "Menyusun panduan narasi komunikasi brand (brand storytelling) agar pesan manfaat produk tersampaikan secara kredibel.",
          "Mengelola sentimen audiens dan mengoptimalkan publikasi konten untuk memperkuat reputasi produk kesehatan di ranah online.",
        ],
      },
    ],
    digitalSolutions: [
      {
        id: 'sol-4',
        title: 'NEXT MARKETING',
        subtitle: 'CRM & Marketing Automation',
        category: 'crm',
        demoUrl: 'https://nextmarkefing.vercel.app',
        isPrototype: true,
        description:
          'Platform pengelolaan kampanye komunikasi media digital, publikasi promosi, dan pemantauan jangkauan audiens.',
        impact:
          'Meningkatkan visibilitas pesan komunikasi institusi dan efisiensi penyebaran publikasi media.',
        techStack: ['Media Campaign Analytics', 'Content Scheduler', 'Public Engagement Tracker'],
        features: ['Multi-Channel Distribution', 'Audience Reach Analytics', 'Campaign Monitor'],
      },
    ],
  };

// --- sales_executive.ts ---
export const sales_executiveProjects: TailoredProjectSet = {
    summary:
      'Portofolio penjualan B2B, penetrasi pasar korporat, negosiasi penawaran harga, manajemen pipeline prospek, dan retensi akun bisnis.',
    projects: [
      {
        id: 'proj-9',
        role: 'B2B Sales & Account Consultant',
        organization: 'PT. Anugrah Dwi Tunggal',
        sector: 'Digital Printing Solution',
        periodType: 'Project based',
        category: 'marketing_media',
        highlights: [
          'Memimpin akuisisi klien korporat B2B untuk kebutuhan percetakan digital skala besar.',
          'Menyusun proposal penawaran komersial, negosiasi harga, dan presentasi solusi kepada calon pembeli B2B.',
          'Meningkatkan volume inquiry prospek B2B sebesar 40% melalui kampanye digital terarah.',
        ],
      },
      {
        id: 'proj-1',
        role: 'Client Account Delivery Specialist',
        organization: 'Alinlabs Indonesia',
        sector: 'Digital Agency & AI Solutions',
        periodType: 'Project based',
        category: 'digital_tech',
        highlights: [
          'Mengelola hubungan kerja dengan 30+ klien proyek agency untuk menjamin pemenuhan ekspektasi komersial.',
          'Mengawal penyampaian solusi tepat waktu guna menjaga retensi akun bisnis dan kepuasan klien.',
        ],
      },
      {
        id: 'proj-12',
        role: 'Interim Operations & Commercial Systems Consultant',
        organization: 'PT Shansusdzar Indonesia',
        sector: 'Interior Design & Build',
        periodType: 'Project 1 Month',
        category: 'operations_retail',
        highlights: [
          "Mereformasi sistem operasional dan penawaran bisnis PT Shansusdzar Indonesia untuk meningkatkan daya saing pasar interior.",
          "Menata ulang standar presentasi portfolio, respon konsultasi klien, dan integrasi penawaran harga (quotation).",
          "Memperbaiki tata kelola media sosial sebagai etalase digital utama dalam menarik prospek proyek interior bernilai tinggi.",
        ],
      },
      {
        id: 'proj-13',
        role: 'Influencer Marketing & Commercial Sales Specialist',
        organization: 'Mitra Usaha E-Commerce Tiens (Ambefit)',
        sector: 'Health & Wellness E-Commerce',
        periodType: 'Project 2 Months',
        category: 'marketing_media',
        highlights: [
          "Mengarahkan kampanye promosi digital berbasis kreator untuk mendongkrak volume penjualan ritel produk Ambefit di e-commerce.",
          "Mengintegrasikan voucher promosi eksklusif influencer dan tracking conversion rate antar channel penjualan.",
          "Meningkatkan performa omzet e-commerce melalui aktivasi promosi serentak multi-influencer.",
        ],
      },
    ],
    digitalSolutions: [
      {
        id: 'sol-4',
        title: 'NEXT MARKETING',
        subtitle: 'CRM & Marketing Automation',
        category: 'crm',
        demoUrl: 'https://nextmarkefing.vercel.app',
        isPrototype: true,
        description:
          'Aplikasi manajemen pipeline sales dan CRM untuk pelacakan prospek, jadwal meeting klien, dan prediksi nilai closing.',
        impact:
          'Meningkatkan efisiensi penanganan prospek B2B hingga 45% dan mempercepat tindak lanjut penawaran komersial.',
        techStack: ['Sales Pipeline', 'Lead Tracking', 'Opportunity Matrix'],
        features: ['Deal Funnel', 'Client Task Reminder', 'Revenue Forecasting'],
      },
    ],
  };

// --- software_dev.ts ---
export const software_devProjects: TailoredProjectSet = {
    summary:
      'Portofolio rekayasa perangkat lunak web full-stack, integrasi AI automation API, optimasi database MySQL/Firebase, dan pengawasan siklus hidup rilis aplikasi.',
    projects: [
      {
        id: 'proj-1',
        role: 'Full-Stack Software & AI Specialist',
        organization: 'Alinlabs Indonesia',
        sector: 'Digital Agency & AI Solutions',
        periodType: 'Project based',
        category: 'digital_tech',
        highlights: [
          'Merancang dan membangun 30+ website, web apps, dan solusi AI automation berbasis API.',
          'Mengintegrasikan REST API, database cloud (Firebase/MySQL), dan skrip otomatisasi workflow.',
          'Menjamin kualitas kode, keamanan data, dan reliabilitas rilis sistem.',
        ],
      },
      {
        id: 'proj-6',
        role: 'Web Platform & System Developer',
        organization: 'Pesantren Minnatul Huda',
        sector: 'Islamic Boarding School',
        periodType: 'Project based',
        category: 'digital_tech',
        highlights: [
          'Mengembangkan website resmi institusi berbasis teknologi web modern yang responsif dan terstruktur.',
        ],
      },
      {
        id: 'proj-12',
        role: 'Operations & Systems Modernization Consultant',
        organization: 'PT Shansusdzar Indonesia',
        sector: 'Interior Design & Build',
        periodType: 'Project 1 Month',
        category: 'digital_tech',
        highlights: [
          "Merancang digitalisasi tata kelola alur kerja dan integrasi data pelaporan operasional serta keuangan PT Shansusdzar Indonesia.",
          "Mengeliminasi pencatatan manual yang rentan redudansi melalui standardisasi sistem cloud database dan digital workflow.",
          "Menyinkronkan data progres proyek interior agar dapat dimonitor secara real-time oleh manajemen.",
        ],
      },
      {
        id: 'proj-13',
        role: 'Digital Content & E-Commerce Growth Strategist',
        organization: 'Mitra Usaha E-Commerce Tiens (Ambefit)',
        sector: 'Health & Wellness E-Commerce',
        periodType: 'Project 2 Months',
        category: 'digital_tech',
        highlights: [
          "Mengoptimalkan pemanfaatan kanal e-commerce dan platform media sosial melalui kampanye digital berbasis kreator.",
          "Memanfaatkan analitik data performa konten (reach, share, click rate) untuk optimasi konten promosi berkelanjutan.",
          "Mengintegrasikan call-to-action promosi influencer ke landing page dan toko e-commerce Tiens Ambefit.",
        ],
      },
    ],
    digitalSolutions: [
      {
        id: 'sol-1',
        title: 'MITRA GATEWAY',
        subtitle: 'Enterprise Resource Planning App',
        category: 'enterprise',
        demoUrl: 'https://mitragateway.vercel.app',
        isPrototype: true,
        description:
          'Aplikasi web enterprise full-stack dengan arsitektur modular, integrasi REST API, dan sinkronisasi data real-time.',
        impact:
          'Memangkas redundansi data hingga 80% dan memberikan performa akses sistem yang cepat.',
        techStack: ['React & Node', 'REST API Engine', 'Real-Time Database'],
        features: ['Modular Architecture', 'Role-Based Access', 'Real-Time Data Sync'],
      },
    ],
  };

// --- software_development.ts ---
export const software_developmentProjects: TailoredProjectSet = {
    summary:
      'Portofolio rekayasa perangkat lunak web full-stack, integrasi AI automation API, optimasi database MySQL/Firebase, dan pengawasan siklus hidup rilis aplikasi.',
    projects: [
      {
        id: 'proj-1',
        role: 'Full-Stack Software & AI Specialist',
        organization: 'Alinlabs Indonesia',
        sector: 'Digital Agency & AI Solutions',
        periodType: 'Project based',
        category: 'digital_tech',
        highlights: [
          'Merancang dan membangun 30+ website, web apps, dan solusi AI automation berbasis API.',
          'Mengintegrasikan REST API, database cloud (Firebase/MySQL), dan skrip otomatisasi workflow.',
          'Menjamin kualitas kode, keamanan data, dan reliabilitas rilis sistem.',
        ],
      },
      {
        id: 'proj-6',
        role: 'Web Platform & System Developer',
        organization: 'Pesantren Minnatul Huda',
        sector: 'Islamic Boarding School',
        periodType: 'Project based',
        category: 'digital_tech',
        highlights: [
          'Mengembangkan website resmi institusi berbasis teknologi web modern yang responsif dan terstruktur.',
        ],
      },
      {
        id: 'proj-12',
        role: 'Operations & Systems Modernization Consultant',
        organization: 'PT Shansusdzar Indonesia',
        sector: 'Interior Design & Build',
        periodType: 'Project 1 Month',
        category: 'digital_tech',
        highlights: [
          "Merancang digitalisasi tata kelola alur kerja dan integrasi data pelaporan operasional serta keuangan PT Shansusdzar Indonesia.",
          "Mengeliminasi pencatatan manual yang rentan redudansi melalui standardisasi sistem cloud database dan digital workflow.",
          "Menyinkronkan data progres proyek interior agar dapat dimonitor secara real-time oleh manajemen.",
        ],
      },
      {
        id: 'proj-13',
        role: 'Digital Content & E-Commerce Growth Strategist',
        organization: 'Mitra Usaha E-Commerce Tiens (Ambefit)',
        sector: 'Health & Wellness E-Commerce',
        periodType: 'Project 2 Months',
        category: 'digital_tech',
        highlights: [
          "Mengoptimalkan pemanfaatan kanal e-commerce dan platform media sosial melalui kampanye digital berbasis kreator.",
          "Memanfaatkan analitik data performa konten (reach, share, click rate) untuk optimasi konten promosi berkelanjutan.",
          "Mengintegrasikan call-to-action promosi influencer ke landing page dan toko e-commerce Tiens Ambefit.",
        ],
      },
    ],
    digitalSolutions: [
      {
        id: 'sol-1',
        title: 'MITRA GATEWAY',
        subtitle: 'Enterprise Resource Planning App',
        category: 'enterprise',
        demoUrl: 'https://mitragateway.vercel.app',
        isPrototype: true,
        description:
          'Aplikasi web enterprise full-stack dengan arsitektur modular, integrasi REST API, dan sinkronisasi data real-time.',
        impact:
          'Memangkas redundansi data hingga 80% dan memberikan performa akses sistem yang cepat.',
        techStack: ['React & Node', 'REST API Engine', 'Real-Time Database'],
        features: ['Modular Architecture', 'Role-Based Access', 'Real-Time Data Sync'],
      },
    ],
  };

// --- strategic_management.ts ---
export const strategic_managementProjects: TailoredProjectSet = {
    summary:
      'Portofolio tata kelola portofolio proyek strategis, arahan efisiensi operasional, C-level advisory, manajemen risiko bisnis, dan pengawasan eksekusi program lintas divisi.',
    projects: [
      {
        id: 'proj-1',
        role: 'Strategic Project Governance Lead',
        organization: 'Alinlabs Indonesia',
        sector: 'Digital Agency & AI Solutions',
        periodType: 'Project based',
        category: 'digital_tech',
        highlights: [
          'Mengawasi portofolio 35+ proyek digital & multimedia dari tahap penetapan tujuan bisnis hingga penyerahan.',
          'Menyelaraskan alokasi investasi proyek dengan target pertumbuhan strategis korporat.',
          'Memberikan arahan tata kelola risiko operasional, kepatuhan kualitas, dan laporan kinerja eksekutif.',
        ],
      },
      {
        id: 'proj-7',
        role: 'Executive Event Director & Keynote Speaker',
        organization: 'PRATAMA EVENT ORGANIZER',
        sector: 'Event Management & Public Speaking',
        periodType: 'Project based',
        category: 'event_public',
        highlights: [
          "Memimpin arahan strategis dan tata kelola eksekutif pelaksanaan 10+ perhelatan akbar formal berskala regional.",
          "Menjadi narasumber kunci (keynote speaker) dalam 15+ forum kepemimpinan, manajemen strategis, dan motivasi pemuda.",
          "Membangun aliansi kemitraan strategis dengan berbagai institusi korporasi dan lembaga pemerintahan.",
          "Menetapkan standar protokol acara, manajemen krisis panggung, dan jaminan reputasi penyelenggaraan event.",
        ],
      },
      {
        id: 'proj-12',
        role: 'Interim Executive Operations & Management Advisor',
        organization: 'PT Shansusdzar Indonesia',
        sector: 'Interior Design & Build',
        periodType: 'Project 1 Month',
        category: 'operations_retail',
        highlights: [
          "Menjalankan mandat audit menyeluruh dan restrukturisasi sistem manajemen operasional, finansial, dan branding PT Shansusdzar Indonesia.",
          "Merumuskan kerangka kerja tata kelola bisnis (governance framework) baru yang memangkas redundansi proses dalam 1 bulan.",
          "Menyajikan rekomendasi strategis bagi direksi untuk keberlanjutan efisiensi operasional dan pertumbuhan jangka panjang.",
        ],
      },
      {
        id: 'proj-13',
        role: 'E-Commerce Growth & Strategic Marketing Partner',
        organization: 'Mitra Usaha E-Commerce Tiens (Ambefit)',
        sector: 'Health & Wellness E-Commerce',
        periodType: 'Project 2 Months',
        category: 'marketing_media',
        highlights: [
          "Memimpin arah strategi pemasaran digital berbasis kolaborasi influencer untuk portofolio produk kesehatan Ambefit.",
          "Menyelaraskan investasi promosi digital dengan target penetrasi pasar dan pertumbuhan brand di platform e-commerce.",
          "Mengevaluasi ROI kampanye dan menyusun cetak biru strategi promosi kemitraan lanjutan.",
        ],
      },
    ],
    digitalSolutions: [
      {
        id: 'sol-1',
        title: 'MITRA GATEWAY',
        subtitle: 'Enterprise Resource Planning App',
        category: 'enterprise',
        demoUrl: 'https://mitragateway.vercel.app',
        isPrototype: true,
        description:
          'Platform ERP dan dashboard intelijen bisnis eksekutif untuk memantau performa keuangan, operasional, dan HR secara konsolidasi.',
        impact:
          'Mempercepat siklus pengambilan keputusan C-Level hingga 2x lebih cepat dengan transparansi data real-time.',
        techStack: ['Executive Dashboard', 'Cross-Divisional ERP', 'Business Intelligence'],
        features: ['C-Level Summary View', 'Real-time KPI Tracking', 'Multi-Unit Governance'],
      },
    ],
  };

// --- supply_chain.ts ---
export const supply_chainProjects: TailoredProjectSet = {
    summary:
      'Portofolio arsitektur database inventaris, otomatisasi replenishment stok, koordinasi logistik ekspedisi, efisiensi rantai pasok, dan penekanan kerugian barang gudang.',
    projects: [
      {
        id: 'proj-2',
        role: 'Supply Chain & Inventory Consultant',
        organization: 'World Street Trendy Fashion',
        sector: 'Footwear Retail',
        periodType: 'Project based',
        category: 'operations_retail',
        highlights: [
          'Membangun master database 100+ SKU dan merancang sistem otomasi replenishment stok guna mencegah out-of-stock.',
          'Mengatur mekanisme rantai pasok multi-ekspedisi, kontrol biaya logistik, dan efisiensi waktu pemrosesan kiriman.',
          'Mengimplementasikan SOP opname stok gudang yang memangkas waktu rekonsiliasi inventaris sebesar 60%.',
        ],
      },
      {
        id: 'proj-4',
        role: 'Retail Supply Chain & Inventory Specialist',
        organization: 'Melin Parfum',
        sector: 'Perfume Retail',
        periodType: 'Project based',
        category: 'operations_retail',
        highlights: [
          'Mengelola database dan struktur katalog produk 50+ SKU varian parfum.',
          'Merancang alur kontrol pengisian ulang stok otomatis untuk menjaga ketersediaan barang di gudang.',
        ],
      },
      {
        id: 'proj-12',
        role: 'Interim Operations & Supply Flow Restructuring Manager',
        organization: 'PT Shansusdzar Indonesia',
        sector: 'Interior Design & Build',
        periodType: 'Project 1 Month',
        category: 'operations_retail',
        highlights: [
          "Mengaudit dan memperbaiki alur rantai pasok material interior, koordinasi vendor sub-kon, dan jadwal pengiriman workshop.",
          "Menyusun SOP penerimaan material, kontrol inventaris proyek, dan mitigasi keterlambatan supply chain konstruksi interior.",
          "Meningkatkan sinkronisasi antara jadwal pengadaan material dan tahapan instalasi di lapangan.",
        ],
      },
      {
        id: 'proj-13',
        role: 'E-Commerce Product Fulfillment & Campaign Coordinator',
        organization: 'Mitra Usaha E-Commerce Tiens (Ambefit)',
        sector: 'Health & Wellness E-Commerce',
        periodType: 'Project 2 Months',
        category: 'operations_retail',
        highlights: [
          "Mengoordinasikan kesiapan stok produk Ambefit di gudang e-commerce saat lonjakan pesanan dari kampanye influencer.",
          "Memantau kecepatan proses fulfillment dan pengiriman produk sampel ke alamat para kreator konten.",
          "Mengevaluasi keselarasan antara timeline promo influencer dan ketersediaan stok di marketplace.",
        ],
      },
    ],
    digitalSolutions: [
      {
        id: 'sol-2',
        title: 'LOGISTOR',
        subtitle: 'Logistics, Warehouse & Operations App',
        category: 'enterprise',
        demoUrl: 'https://logistor.vercel.app',
        isPrototype: true,
        description:
          'Sistem pengelolaan rantai pasok: kontrol bahan baku, pelacakan stok masuk/keluar, dan manajemen utang-piutang supplier.',
        impact:
          'Menekan selisih stok hingga 70% dan mengotomasi kalkulasi HPP inventaris 100% akurat.',
        techStack: ['Inventory Engine', 'Supplier Ledger', 'Warehouse Distribution Tracker'],
        features: ['Real-time Stock Balance', 'Supplier Order Tracking', 'HPP FIFO/LIFO Calculator'],
      },
    ],
  };

// --- supply_chain_logistics.ts ---
export const supply_chain_logisticsProjects: TailoredProjectSet = {
    summary:
      'Portofolio arsitektur database inventaris, otomatisasi replenishment stok, koordinasi logistik ekspedisi, efisiensi rantai pasok, dan penekanan kerugian barang gudang.',
    projects: [
      {
        id: 'proj-2',
        role: 'Supply Chain & Inventory Consultant',
        organization: 'World Street Trendy Fashion',
        sector: 'Footwear Retail',
        periodType: 'Project based',
        category: 'operations_retail',
        highlights: [
          'Membangun master database 100+ SKU dan merancang sistem otomasi replenishment stok guna mencegah out-of-stock.',
          'Mengatur mekanisme rantai pasok multi-ekspedisi, kontrol biaya logistik, dan efisiensi waktu pemrosesan kiriman.',
          'Mengimplementasikan SOP opname stok gudang yang memangkas waktu rekonsiliasi inventaris sebesar 60%.',
        ],
      },
      {
        id: 'proj-4',
        role: 'Retail Supply Chain & Inventory Specialist',
        organization: 'Melin Parfum',
        sector: 'Perfume Retail',
        periodType: 'Project based',
        category: 'operations_retail',
        highlights: [
          'Mengelola database dan struktur katalog produk 50+ SKU varian parfum.',
          'Merancang alur kontrol pengisian ulang stok otomatis untuk menjaga ketersediaan barang di gudang.',
        ],
      },
      {
        id: 'proj-12',
        role: 'Interim Operations & Supply Flow Restructuring Manager',
        organization: 'PT Shansusdzar Indonesia',
        sector: 'Interior Design & Build',
        periodType: 'Project 1 Month',
        category: 'operations_retail',
        highlights: [
          "Mengaudit dan memperbaiki alur rantai pasok material interior, koordinasi vendor sub-kon, dan jadwal pengiriman workshop.",
          "Menyusun SOP penerimaan material, kontrol inventaris proyek, dan mitigasi keterlambatan supply chain konstruksi interior.",
          "Meningkatkan sinkronisasi antara jadwal pengadaan material dan tahapan instalasi di lapangan.",
        ],
      },
      {
        id: 'proj-13',
        role: 'E-Commerce Product Fulfillment & Campaign Coordinator',
        organization: 'Mitra Usaha E-Commerce Tiens (Ambefit)',
        sector: 'Health & Wellness E-Commerce',
        periodType: 'Project 2 Months',
        category: 'operations_retail',
        highlights: [
          "Mengoordinasikan kesiapan stok produk Ambefit di gudang e-commerce saat lonjakan pesanan dari kampanye influencer.",
          "Memantau kecepatan proses fulfillment dan pengiriman produk sampel ke alamat para kreator konten.",
          "Mengevaluasi keselarasan antara timeline promo influencer dan ketersediaan stok di marketplace.",
        ],
      },
    ],
    digitalSolutions: [
      {
        id: 'sol-2',
        title: 'LOGISTOR',
        subtitle: 'Logistics, Warehouse & Operations App',
        category: 'enterprise',
        demoUrl: 'https://logistor.vercel.app',
        isPrototype: true,
        description:
          'Sistem pengelolaan rantai pasok: kontrol bahan baku, pelacakan stok masuk/keluar, dan manajemen utang-piutang supplier.',
        impact:
          'Menekan selisih stok hingga 70% dan mengotomasi kalkulasi HPP inventaris 100% akurat.',
        techStack: ['Inventory Engine', 'Supplier Ledger', 'Warehouse Distribution Tracker'],
        features: ['Real-time Stock Balance', 'Supplier Order Tracking', 'HPP FIFO/LIFO Calculator'],
      },
    ],
  };

export const PRESET_PROJECTS_ID: Record<string, TailoredProjectSet> = {
  optimal: optimalProjects,
  business_operations: business_operationsProjects,
  hr_operations: hr_operationsProjects,
  project_management: project_managementProjects,
  finance_accounting: finance_accountingProjects,
  marketing: marketingProjects,
  digital_transformation: digital_transformationProjects,
  business_development: business_developmentProjects,
  strategic_management: strategic_managementProjects,
  office_administration: office_administrationProjects,
  public_relations: public_relationsProjects,
  supply_chain_logistics: supply_chain_logisticsProjects,
  software_development: software_developmentProjects,
  b2b_sales: b2b_salesProjects,
  sales_executive: sales_executiveProjects,
  executive: executiveProjects,
  branch_manager: branch_managerProjects,
  admin: adminProjects,
  pr: prProjects,
  supply_chain: supply_chainProjects,
  finance: financeProjects,
  software_dev: software_devProjects,
};
