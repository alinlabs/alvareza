-- Seeding data for Table: portofolio
DELETE FROM portofolio;

INSERT INTO portofolio (id, kategori, judul, deskripsi, fitur, teknologi, gambar, link) VALUES
(
    'portfolio-20',
    'Web & Multimedia',
    'Alin Labs – Advanced AI Research Platform',
    'Platform kecerdasan buatan (AI) buatan Indonesia yang mendukung penulisan dokumen, pemrograman, riset, dan eksplorasi ide melalui antarmuka AI interaktif.',
    '["AI Chat Interface", "Chat History Management", "Session Management", "Live Voice AI", "File Upload", "Document Upload", "About Page", "FAQ", "Privacy Policy", "Terms & Conditions"]',
    '["React", "TypeScript", "Tailwind CSS", "Vite", "Node.js", "Express.js", "PostgreSQL", "Framer Motion"]',
    NULL,
    'https://ai-alinlabs.vercel.app/'
),
(
    'portfolio-26',
    'Web & Multimedia',
    'Vynance - Aplikasi Pencatatan Keuangan Pribadi & Jurnal Umum',
    'Vynance adalah platform manajemen keuangan pribadi berbasis web yang membantu pengguna mencatat arus kas, mengelola saldo dari berbagai rekening, memantau utang-piutang, serta menyusun target tabungan secara terstruktur.',
    '["Ringkasan arus kas (saldo, pemasukan, pengeluaran, utang, piutang)", "Analisis kesehatan keuangan", "Manajemen multi-rekening (bank, e-wallet, kas tunai)", "Pelacakan target tabungan (savings goal)", "Pencatatan dan pengkategorian transaksi", "Visualisasi grafik transaksi harian dan per transaksi", "Pencatatan serta pemantauan utang dan piutang", "Fitur pencarian dan filter transaksi (berdasarkan waktu dan mata uang)", "Akses eksplorasi Mode Demo"]',
    '["React / Next.js", "Tailwind CSS", "Chart.js / Recharts", "Vercel"]',
    NULL,
    'https://vynance.vercel.app/dashboard?demo=true'
),
(
    'portfolio-19',
    'Web & Multimedia',
    'Geo Mitra Gateway – Smart Internal Management System',
    'Dashboard manajemen internal untuk memantau kinerja perusahaan, mengelola penjualan, partner, tim sales, serta operasional bisnis secara terpusat.',
    '["Dashboard Kinerja", "Ringkasan Pendapatan", "Monitoring Target Penjualan", "Peta Distribusi Partner", "Manajemen Partner", "Manajemen Sales", "Riwayat Transaksi", "Manajemen Produk", "Targeting Penjualan", "Jadwal & Agenda", "Broadcast Pesan", "Manajemen Hak Akses", "Pengaturan Sistem", "Progressive Web App (PWA)"]',
    '["React", "TypeScript", "Tailwind CSS", "Vite", "Recharts", "Node.js", "Express.js", "PostgreSQL", "PWA"]',
    NULL,
    'https://www.geomitragateway.com/dashboard'
),
(
    'portfolio-25',
    'Web & Multimedia',
    'Review Website NemaFilm (Perencana Produksi Film)',
    'NemaFilm adalah platform dasbor manajemen produksi film yang dirancang untuk memantau dan mengelola seluruh siklus pembuatan film secara terintegrasi, mulai dari tahap pra-produksi, eksekusi produksi, infrastruktur teknis, keuangan, hingga pasca-produksi.',
    '["Dasbor Ringkasan Status Proyek", "Pitch Deck & Informasi Presentasi Proyek", "Pengelolaan Naskah Film", "Pemantauan Storyboard", "Penjadwalan & Pengelolaan Shot List", "Penyusunan Jadwal Syuting", "Manajemen Lokasi & Set", "Pendataan Aktor & Figuran", "Manajemen Art, Properti, & Kostum", "Pendataan Kru & Tim Produksi", "Inventarisasi Alat & Kamera", "Penyusunan Anggaran & RAB", "Pengelolaan Mitra, Sponsor, & Donasi", "Pelacakan Dokumen Perizinan Lokasi", "Catatan Editing & Pasca-Produksi"]',
    '["Vercel Cloud Hosting Platform", "Web Application Stack (HTML5, CSS3, JavaScript)"]',
    NULL,
    'https://nemafilm.vercel.app/dashboard'
),
(
    'portfolio-24',
    'Web & Multimedia',
    'Portal AMANAH | MTs Salafiyah - Inovasi Digital Absensi Secara Real-time',
    'Sistem portal administrator sekolah berbasis web yang dirancang untuk mengelola data akademis, jadwal pelajaran, serta memantau kehadiran siswa secara terintegrasi dan real-time.',
    '["Dasbor ikhtisar statistik harian sekolah", "Pengelolaan data siswa aktif", "Pengelolaan data mata pelajaran (Mapel)", "Manajemen jadwal kelas", "Pemantauan absensi siswa real-time", "Grafik rekapitulasi kehadiran mingguan", "Pencatatan log aktivitas tap RFID", "Fitur ekspor data statistik sekolah"]',
    '["RFID (Radio-Frequency Identification)", "Recharts / Chart.js", "Vercel Cloud Platform"]',
    NULL,
    'https://amanahkita.vercel.app/dash/admin'
),
(
    'portfolio-12',
    'Web & Multimedia',
    'AlinLabs – Modern Workforce Platform',
    'Platform HR dan manajemen tenaga kerja untuk mengelola karyawan, rekrutmen, serta memantau performa tim secara real-time.',
    '["Live Workspace Monitoring", "Employee Management", "Organization Management", "Recruitment Portal", "Applicant Tracking", "Performance Dashboard", "Performance Index", "Operational Monitoring"]',
    '["React", "TypeScript", "Tailwind CSS", "Vite", "Node.js", "Express.js", "PostgreSQL", "Framer Motion"]',
    NULL,
    'https://hrworkforce.vercel.app/'
),
(
    'portfolio-11',
    'Web & Multimedia',
    'NextMark – Digital Marketing Suite',
    'Platform pemasaran digital dan CRM untuk mengelola penjualan, kampanye, pelanggan, serta operasional bisnis dalam satu dashboard.',
    '["Dashboard Penjualan", "Analitik Bisnis", "CRM", "Lead Management", "Campaign Management", "Social Media Management", "AI Studio", "Inventory Management", "Financial Dashboard", "Supplier Management", "Team Management"]',
    '["React", "TypeScript", "Tailwind CSS", "Vite", "Node.js", "Express.js", "PostgreSQL", "Recharts"]',
    NULL,
    'https://nextmarketing.vercel.app/'
),
(
    'portfolio-10',
    'Web & Multimedia',
    'Logistor – Smart Logistics Management',
    'Platform manajemen logistik dan operasional untuk mengelola stok, aset, proyek, dan aktivitas gudang secara terpusat.',
    '["Monitoring Stok", "Notifikasi Stok Kritis", "Barang Masuk & Keluar", "Stock Opname", "Manajemen Proyek", "Manajemen Klien", "Inventory Costing", "Estimasi Anggaran", "Manajemen Aset", "Manajemen SDM", "Dashboard Operasional"]',
    '["React", "TypeScript", "Tailwind CSS", "Vite", "Node.js", "Express.js", "PostgreSQL", "D3.js"]',
    NULL,
    'https://logistor.vercel.app/'
),
(
    'portfolio-13',
    'Web & Multimedia',
    'Global Management Gateway – Enterprise ERP Platform',
    'Sistem Enterprise Resource Planning (ERP) berbasis web untuk mengelola operasional perusahaan secara terpusat dan terintegrasi.',
    '["Autentikasi Pengguna", "Reset Password", "Single Sign-On (Google, Microsoft, Apple)", "Demo Account", "ERP Dashboard", "Company Management Portal"]',
    '["React", "TypeScript", "Tailwind CSS", "Vite", "Node.js", "Express.js", "PostgreSQL", "Lucide Icons"]',
    NULL,
    'https://gmgindonesia.vercel.app/'
),
(
    'portfolio-23',
    'Web & Multimedia',
    'KPPM Kertasari — Portal Pemberdayaan',
    'Website aplikasi web yang dirancang untuk mengelola, memantau, dan mendokumentasikan seluruh rangkaian program kerja, agenda harian, tata kelola administrasi, serta keuangan selama masa kegiatan pengabdian masyarakat KPPM di Dusun I dan Dusun II, Desa Kertasari.',
    '["Manajemen Program Kerja (Proker) dan Agenda Kegiatan", "Kalender Interaktif dan Analisis Statistik Status Kegiatan", "Fitur Pencarian Agenda, Proker, Lokasi, dan PIC", "Modul Keanggotaan", "Modul Keuangan", "Modul Administrasi", "Informasi Seputar Kami dan Pengaturan App"]',
    '["React / Next.js", "Tailwind CSS", "Vercel Hosting Platform"]',
    NULL,
    'https://kertasari.vercel.app/beranda'
),
(
    'portfolio-22',
    'Web & Multimedia',
    'Pondok Pesantren Minnatul Huda | Pendidikan Islam Modern & Berprestasi',
    'Website ini merupakan platform informasi resmi Pondok Pesantren Minnatul Huda yang menyajikan gambaran umum lembaga, integrasi kurikulum (diniyah, pendidikan formal, dan agribisnis), profil pengajar, berita kegiatan, serta fasilitas formulir pendaftaran siswa baru (PPDB) secara daring.',
    '["Formulir Pendaftaran Siswa Baru (PPDB Online)", "Informasi Jenjang Pendidikan (MI, MTs, SMP, SMK, MA)", "Penjelasan Kurikulum Terpadu (Tahfidz, Formal, Agribisnis)", "Berita dan Kegiatan Pesantren", "Profil Pimpinan dan Tenaga Pendidik", "Fitur Pencarian Informasi", "Akses Portal Akun dan Menu Cepat", "Testimoni Wali Santri, Alumni, dan Santri", "Layanan Kontak WhatsApp Admin", "Informasi FAQ (Pertanyaan Umum)"]',
    '["HTML5", "CSS3", "JavaScript", "Responsive Web Design", "Progressive Web App (PWA / Fitur Install App)"]',
    NULL,
    'https://www.minnatulhuda.com/'
),
(
    'portfolio-21',
    'Web & Multimedia',
    'Alinlabs Utility Technology Operations (AUTO)',
    'Platform utilitas pengembang berbasis web untuk mengelola konfigurasi, menghasilkan skrip automasi, dan mensimulasikan eksekusi terminal dalam satu dashboard.',
    '["PowerShell Script Generator", "Folder Path Configuration", "Output File Configuration", "Source Code Editor", "Terminal Simulator", "System Cache Reset", "Execution Status Monitoring", "File Size Monitoring", "User Session Management", "Logout"]',
    '["React", "TypeScript", "Tailwind CSS", "Vite", "Node.js", "Express.js", "PowerShell Scripting"]',
    NULL,
    'https://alinlabs-auto.vercel.app/'
),
(
    'portfolio-16',
    'Web & Multimedia',
    'AlinLabs – Integrated Digital & IT Solutions',
    'Website resmi agensi digital yang menyediakan solusi pengembangan website, aplikasi, digital marketing, media sosial, dan produksi konten kreatif dalam satu ekosistem.',
    '["Website Development", "Custom Application Development", "Social Media Management", "Digital Marketing", "Live Streaming Studio", "Content Production", "Service Catalog", "Portfolio Showcase", "Promo Countdown", "Client Testimonials", "Partnership Registration"]',
    '["React", "TypeScript", "Tailwind CSS", "Vite", "Node.js", "Express.js", "PostgreSQL", "Framer Motion"]',
    NULL,
    'https://alinlabs.vercel.app/'
),
(
    'portfolio-8',
    'Web & Multimedia',
    'DataBank – Smart Password Vault',
    'Aplikasi web serverless untuk menyimpan dan mengelola kredensial akun secara aman langsung di browser pengguna.',
    '["Password Manager", "Local Storage", "Pencarian Data", "Statistik Akun", "Export JSON", "Export CSV", "Import Data", "Dark Mode", "Progressive Web App (PWA)"]',
    '["React", "TypeScript", "Tailwind CSS", "Vite", "LocalStorage API", "PWA"]',
    NULL,
    'https://databank-serverless.vercel.app/'
),
(
    'portfolio-15',
    'Web & Multimedia',
    'SIMA – Smart Village Marketplace',
    'Marketplace digital Desa Sindang Sari yang menghubungkan masyarakat dengan petani dan UMKM lokal melalui platform berbasis web.',
    '["Katalog Produk", "Pencarian Produk", "Direktori UMKM", "Direktori Petani", "Kategori Produk", "Produk Unggulan", "WhatsApp Direct Chat", "Edukasi UMKM", "Pendaftaran Mitra", "Progressive Web App (PWA)"]',
    '["React", "TypeScript", "Tailwind CSS", "Vite", "Node.js", "Express.js", "PostgreSQL", "PWA"]',
    NULL,
    'https://sindangsari.vercel.app/'
),
(
    'portfolio-17',
    'Web & Multimedia',
    'DimDump – Smart Food Ordering Platform',
    'Platform pemesanan online DimDump, usaha kuliner mahasiswa STIE Wikara yang menyediakan dimsum goreng krispi dengan layanan praktis dan modern.',
    '["Menu Catalog", "Online Ordering", "Shopping Cart", "Promo Packages", "COD Service", "Free Delivery", "Pickup Order", "Dimo Chatbot", "Admin Dashboard", "Customer Reviews", "FAQ", "Progressive Web App (PWA)"]',
    '["React", "TypeScript", "Tailwind CSS", "Vite", "Node.js", "Express.js", "PostgreSQL", "PWA"]',
    NULL,
    'https://dimdump.vercel.app/'
),
(
    'portfolio-7',
    'Web & Multimedia',
    'CAKRAWALA – Portal Transparansi BEM STIE WIKARA',
    'Portal resmi BEM STIE WIKARA Periode 2025/2026 sebagai pusat publikasi MUBES, LPJ, dan informasi organisasi secara transparan.',
    '["Laporan Pertanggungjawaban (LPJ)", "Informasi MUBES 2026", "Draft AD/ART", "Statistik Organisasi", "Informasi Sekretariat", "Kontak Resmi", "Responsive Design", "Proteksi Developer Tools"]',
    '["React", "TypeScript", "Tailwind CSS", "Vite", "LocalStorage API"]',
    NULL,
    'https://www.bem-wikara.my.id/'
),
(
    'portfolio-9',
    'Web & Multimedia',
    'Siregar Planner – Premium Wedding Experience',
    'Website Wedding Organizer profesional untuk menampilkan layanan, paket pernikahan, portofolio, vendor, dan informasi bagi calon pengantin.',
    '["Promo Countdown", "Paket Pernikahan", "Galeri Portofolio", "Vendor Partner", "Testimoni Klien", "FAQ", "Responsive Design", "Dark Mode"]',
    '["React", "TypeScript", "Tailwind CSS", "Vite", "Framer Motion"]',
    NULL,
    'https://www.wedding-organizer.my.id/'
),
(
    'portfolio-14',
    'Web & Multimedia',
    'Pratama MC – Professional MC & Wedding Services',
    'Website portofolio dan layanan Master of Ceremony (MC) serta Wedding Organizer profesional untuk berbagai kebutuhan acara dan pernikahan.',
    '["Paket MC Pernikahan", "Galeri Portofolio", "Vendor Directory", "Wedding Budget Planner", "Wedding Education", "Music Entertainment", "Client Area", "Countdown Timer", "Testimoni Klien", "FAQ"]',
    '["React", "TypeScript", "Tailwind CSS", "Vite", "Framer Motion"]',
    NULL,
    'https://www.pratamamc.my.id/'
),
(
    'portfolio-18',
    'Web & Multimedia',
    'Kampung Tajur Kahuripan – Digital Tourism Experience',
    'Website resmi destinasi wisata budaya dan alam Kampung Tajur Kahuripan yang menyediakan informasi, reservasi, dan promosi wisata berbasis digital.',
    '["Tour Package Search", "Tourism Catalog", "Homestay Booking", "Traditional Attractions", "Local Products Marketplace", "Navigation & Maps", "Cultural Tourism Information"]',
    '["React", "TypeScript", "Tailwind CSS", "Vite", "Leaflet Maps"]',
    NULL,
    'https://www.kampungtajurkahuripan.com/'
),
(
    'portfolio-2',
    'Web & Multimedia',
    'Video Profil Pesantren Minnatul Huda',
    'Transformasi digital menyeluruh melalui pembuatan video profil yang sinematik, serta pengembangan website dan aplikasi mobile custom untuk mempermudah sistem administrasi dan informasi pesantren agar lebih modern dan terstruktur.',
    '["Produksi video profil pesantren sinematik berkualitas tinggi", "Sistem administrasi pesantren terintegrasi", "Aplikasi mobile penyebaran informasi pesantren", "Akses cepat jadwal kegiatan dan administrasi santri"]',
    '["React", "TypeScript", "Tailwind CSS", "Vite", "Node.js", "Express.js", "PostgreSQL", "Cinematography"]',
    NULL,
    'https://www.alinlabs.biz.id/portofolio?project=minnatulhuda#minnatulhuda'
),
(
    'portfolio-6',
    'Video Production',
    'Video Promosi Vany Songket & Vany Villa Balige',
    'Pembuatan video promosi eksklusif yang memadukan keindahan wastra tradisional Vany Songket dengan pesona akomodasi premium Vany Villa Balige di Sumatera Utara untuk menarik wisatawan nusantara maupun mancanegara.',
    '["Produksi video promosi wastra tenun songket", "Pengambilan gambar sinematik villa eksklusif Balige", "Konseptualisasi tema pariwisata budaya & modernitas", "Pengemasan konten promosi destinasi wisata Danau Toba"]',
    '["Videography", "Creative Direction", "Cultural Marketing", "Drone Footage", "Tourism Promotion"]',
    NULL,
    'https://www.alinlabs.biz.id/portofolio?project=vanysongket#vanysongket'
),
(
    'portfolio-1',
    'Digital Marketing',
    'Konten & Iklan dengan Ambefit',
    'Meningkatkan brand awareness melalui kampanye media sosial yang strategis dengan konten video potrait yang mengundang interaksi tinggi, menjangkau audiens secara luas di berbagai platform.',
    '["Pembuatan konsep video potrait kreatif", "Penyusunan copywriting iklan persuasif", "Kampanye promosi terarah di platform media sosial", "Optimasi konversi dan perluasan jangkauan audiens"]',
    '["Social Media Ads", "TikTok & Reels", "Video Production", "Copywriting", "Audience Targeting"]',
    NULL,
    'https://www.alinlabs.biz.id/portofolio?project=ambefit#ambefit'
),
(
    'portfolio-4',
    'Digital Marketing',
    'Sosial Media & Desain Kreatif STIE Wikara',
    'Pengelolaan media sosial dan pembuatan konten desain publikasi kreatif untuk STIE Wikara guna mengedukasi calon mahasiswa serta memperkuat brand identity institusi di era digital.',
    '["Desain publikasi kreatif penerimaan mahasiswa baru", "Pengelolaan feeds dan stories harian", "Penyusunan infografis akademik yang komunikatif", "Meningkatkan interaksi di akun resmi kampus"]',
    '["Social Media Management", "Content Creation", "Graphic Design", "Brand Identity", "Edu-Marketing"]',
    NULL,
    'https://www.alinlabs.biz.id/portofolio?project=stie-wikara#stie-wikara'
),
(
    'portfolio-5',
    'Digital Marketing',
    'Digital Marketing & Branding UMKM Worldstreet',
    'Pengembangan strategi digital marketing dan aset desain promosi visual interaktif untuk UMKM Worldstreet guna memperluas jangkauan pasar kuliner dan meningkatkan penjualan online.',
    '["Perancangan visual menu digital interaktif", "Copywriting kreatif promosi kuliner harian", "Strategi jangkauan pasar lokal kuliner terarah", "Peningkatan trafik penjualan online UMKM"]',
    '["Digital Marketing", "Social Media Design", "Content Strategy", "Culinary Branding", "UMKM Growth"]',
    NULL,
    'https://www.alinlabs.biz.id/portofolio?project=worldstreet#worldstreet'
),
(
    'portfolio-3',
    'Creative Design',
    'Desain Promosi & Pemasaran Melin Perfume',
    'Koleksi desain promosi kreatif yang dirancang untuk menarik audiens, meningkatkan engagement, dan membangun identitas visual yang elegan dan memikat.',
    '["Aset desain promosi kreatif dan berkelas", "Pengembangan identitas visual produk parfum", "Penyusunan materi konten media sosial estetis", "Peningkatan brand engagement secara berkala"]',
    '["Visual Branding", "Social Media Design", "Creative Direction", "Content Strategy", "Adobe Creative Suite"]',
    NULL,
    'https://www.alinlabs.biz.id/portofolio?project=melin#melin'
);
