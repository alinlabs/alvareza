import { ApiService } from '../../../../services/api';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Save, Trash2, Copy, FileText, Check, AlertCircle, Sparkles, X, Loader2 } from 'lucide-react';

export interface CoverLetterTemplate {
  id: string;
  name: string;
  body: string;
  bahasa?: string;
  rekomendasi?: string[] | string;
}

export const DEFAULT_TEMPLATES: CoverLetterTemplate[] = [
  {
    id: 'tpl-0',
    name: 'Umum & Non-Spesifik (Lamaran General)',
    bahasa: 'Indonesia',
    rekomendasi: ['Umum', 'General', 'Semua Posisi', 'Kandidat Umum'],
    body: `Saya merupakan lulusan **Sarjana Manajemen dari STIE Wikara** yang **berpengalaman 3+ tahun di bidang Operasional & Manajemen Proyek, serta 5+ tahun di bidang Kepemimpinan Strategis**. Rekam jejak profesional saya mencakup pengelolaan efisiensi alur kerja operasional, pengawasan alur pasokan, serta penyelesaian proyek distribusi sumber daya skala besar. Didukung dengan kepemimpinan kuat selaku mantan **Presiden Mahasiswa** dan prestasi **Duta GenRe Kabupaten Purwakarta**, saya terbiasa mengoordinasikan tim lintas divisi dan membangun kemitraan strategis.

Sebagai bukti nyata atas kompetensi dan rekam jejak tersebut, saya melampirkan **portofolio hasil kerja** yang memuat visualisasi kontribusi riil saya. Saya sangat antusias untuk mengaplikasikan keahlian dan pengalaman ini guna memberikan kontribusi terbaik bagi kemajuan **[Perusahaan]**.`
  },
  {
    id: 'tpl-1',
    name: 'Social Media Manager & Branding Specialist',
    bahasa: 'Indonesia',
    rekomendasi: ['Social Media', 'Marketing', 'Creative Agency'],
    body: `Sebagai lulusan **Sarjana Manajemen dari STIE Wikara** yang **berpengalaman 3+ tahun di bidang Social Media Management & Branding, serta 5+ tahun dalam Strategic Communication**, saya sangat tertarik mengisi posisi **[Posisi]** di **[Perusahaan]**. Saya berpengalaman merancang pilar konten, menganalisis algoritma dan tren sosial media, mengelola tim kreatif, serta mengoptimalkan pertumbuhan audiens organik secara terukur. Kepemimpinan saya selaku mantan **Presiden Mahasiswa STIE Wikara** dan rekam jejak diplomasi sebagai **Duta GenRe Purwakarta** membuktikan keahlian saya dalam komunikasi persuasif untuk membangun interaksi komunitas yang solid.

Sebagai referensi hasil kerja nyata, saya melampirkan **portofolio konten kreatif** yang berisi visualisasi kampanye media sosial, analisis pertumbuhan akun, serta strategi digital yang sukses saya eksekusi. Saya siap membawa keahlian ini untuk melejitkan kehadiran digital **[Perusahaan]**.`
  },
  {
    id: 'tpl-2',
    name: 'Digital Marketing & Growth Campaign',
    bahasa: 'Indonesia',
    rekomendasi: ['Digital Marketing', 'Growth', 'Pemasaran'],
    body: `Sebagai lulusan **Sarjana Manajemen dari STIE Wikara** yang **berpengalaman 3+ tahun di bidang Digital Pemasaran, Performance Marketing, dan Growth Campaign**, saya mengajukan diri untuk posisi **[Posisi]** di **[Perusahaan]**. Saya menguasai strategi optimasi iklan digital (Meta Ads, Google Ads), analisis funnel konversi, serta riset pasar berbasis data. Didukung kepemilikan **Sertifikat Kompetensi Bisnis & Digital**, saya memiliki rekam jejak dalam mereduksi biaya akuisisi pelanggan (CAC) dan memaksimalkan ROI kampanye.

Saya melampirkan **portofolio digital marketing** yang berisi laporan metrik performa, studi kasus konversi, dan rincian kampanye digital sebelumnya sebagai bukti kualifikasi saya. Saya berkomitmen penuh untuk mengoptimalkan performa pemasaran digital **[Perusahaan]**.`
  },
  {
    id: 'tpl-3',
    name: 'Graphic Designer & Visual Branding Creator',
    bahasa: 'Indonesia',
    rekomendasi: ['Desainer Grafis', 'Branding', 'Kreatif'],
    body: `Dengan berbekal pendidikan **Sarjana Manajemen STIE Wikara** dan **pengalaman 3+ tahun di bidang Creative Design & Visual Branding**, saya mengajukan lamaran untuk posisi **[Posisi]** di **[Perusahaan]**. Keahlian saya mencakup penerjemahan strategi pemasaran menjadi aset visual yang memikat, perancangan identitas merek, serta pembuatan konten promosi multi-platform. Selaku mantan **Presiden Mahasiswa**, saya terbiasa memimpin tim kreatif dalam mengeksekusi kampanye visual skala besar.

Sebagai bukti atas kesesuaian estetika dan teknis saya, silakan merujuk pada **portofolio desain kreatif** terlampir yang menampilkan kompilasi karya visual, rancangan layout, serta branding proyek yang telah sukses diluncurkan. Saya antusias berkolaborasi dengan **[Perusahaan]**.`
  },
  {
    id: 'tpl-4',
    name: 'Web Developer & Systems Specialist',
    bahasa: 'Indonesia',
    rekomendasi: ['Web Developer', 'IT', 'Software Engineer'],
    body: `Sebagai lulusan **Sarjana Manajemen dari STIE Wikara** yang juga memegang **Sertifikat Kompetensi Bisnis Digital & Sistem Informasi**, saya memiliki **pengalaman 3+ tahun dalam Web Development & Pembuatan Aplikasi Full-Stack**. Keahlian teknis saya meliputi pengembangan antarmuka pengguna yang responsif, integrasi database, hingga optimasi server. Kombinasi latar belakang manajemen dan keahlian koding memungkinkan saya memahami kebutuhan bisnis sekaligus merancang solusi perangkat lunak yang fungsional dan efisien.

Semua dokumentasi proyek pemrograman, repositori kode, dan aplikasi web interaktif yang pernah saya bangun telah saya rangkum dalam **portofolio web developer** terlampir. Saya sangat tertarik untuk berkontribusi sebagai **[Posisi]** di **[Perusahaan]**.`
  },
  {
    id: 'tpl-5',
    name: 'Content Writer & Copywriter Profesional',
    bahasa: 'Indonesia',
    rekomendasi: ['Writer', 'Copywriter', 'Humas'],
    body: `Sebagai lulusan **Sarjana Manajemen dari STIE Wikara** yang memegang **Sertifikat Kompetensi Public Speaking & Komunikasi**, saya memiliki **pengalaman 3+ tahun sebagai Copywriter & Content Writer**. Saya ahli merancang copy iklan yang persuasif, menulis artikel ramah SEO, serta mengemas storytelling merek agar relevan dengan audiens target. Prestasi saya sebagai **Duta GenRe Kabupaten Purwakarta** membuktikan kemampuan saya merangkai pesan informatif sekaligus komunikatif untuk publik luas.

Saya melampirkan **portofolio penulisan kreatif** yang memuat artikel, materi copy iklan, dan draf kampanye humas yang telah dipublikasikan sebagai bahan pertimbangan Bapak/Ibu. Saya siap berkontribusi pada posisi **[Posisi]** di **[Perusahaan]**.`
  },
  {
    id: 'tpl-6',
    name: 'Video Editor & Videographer Creator',
    bahasa: 'Indonesia',
    rekomendasi: ['Video Editor', 'Kreatif', 'Media'],
    body: `Dengan **pengalaman 3+ tahun di bidang Video Editing, Motion Graphics, dan Produksi Konten Audiovisual**, saya melamar untuk bergabung dengan **[Perusahaan]** sebagai **[Posisi]**. Didukung latar belakang **Sarjana Manajemen STIE Wikara**, saya mahir mengemas video promosi, konten kreatif TikTok/Reels, serta video profil perusahaan agar memiliki daya tarik visual yang tinggi dan alur cerita yang kuat. Kepemimpinan saya selaku **Presiden Mahasiswa** mengasah kemampuan saya berkoordinasi di bawah tenggat waktu yang ketat.

Saya menyertakan **portofolio video editing** terlampir yang menampilkan potongan klip, reel kompilasi, serta visual efek hasil karya saya. Saya siap membantu meningkatkan performa engagement video **[Perusahaan]**.`
  },
  {
    id: 'tpl-7',
    name: 'Sales & Business Development Executive',
    bahasa: 'Indonesia',
    rekomendasi: ['Sales', 'Business Development', 'Kemitraan'],
    body: `Sebagai lulusan **Sarjana Manajemen dari STIE Wikara** yang **berpengalaman 3+ tahun di bidang Field Sales & Business Development, serta 5+ tahun dalam Negosiasi Strategis**, saya mengajukan diri untuk posisi **[Posisi]** di **[Perusahaan]**. Portofolio kerja saya mencakup perluasan jangkauan distribusi, pemetaan potensi pasar lokal, penetrasi ritel, dan fasilitasi kemitraan strategis antar-lembaga. Prestasi diplomasi saya selaku mantan **Presiden Mahasiswa** dan **Duta GenRe** mengasah kemampuan saya melakukan lobi dan memenangkan kesepakatan bisnis.

Semua dokumentasi penetrasi pasar dan hasil penjualan lapangan tersebut terangkum jelas di dalam **portofolio bisnis** terlampir. Saya siap mengakselerasi perluasan pasar dan pertumbuhan pendapatan bagi **[Perusahaan]**.`
  },
  {
    id: 'tpl-8',
    name: 'Customer Service & Client Relations Officer',
    bahasa: 'Indonesia',
    rekomendasi: ['Customer Service', 'Client Relations', 'Frontliner'],
    body: `Dengan **pengalaman 2+ tahun di bidang Customer Service & Client Engagement, serta 3+ tahun di bidang Administrasi Operasional & Keuangan**, didukung latar belakang pendidikan **Sarjana Manajemen dari STIE Wikara**, saya mengajukan diri untuk posisi **[Posisi]** di **[Perusahaan]**. Pengalaman saya mencakup pelayanan pelanggan, penanganan keluhan secara solutif, serta pemeliharaan standar kepuasan pelanggan yang tinggi. Didukung **Sertifikat Kompetensi Public Speaking & Komunikasi**, saya terbiasa membangun hubungan kemitraan yang ramah dan profesional.

Saya juga melampirkan **portofolio pelayanan** yang mendokumentasikan pencapaian kepuasan pelanggan dan evaluasi kinerja saya sebagai bahan pertimbangan Bapak/Ibu. Saya siap menjaga standar keunggulan pelayanan di **[Perusahaan]**.`
  },
  {
    id: 'tpl-9',
    name: 'Management Trainee & Future Leader Program',
    bahasa: 'Indonesia',
    rekomendasi: ['Management Trainee', 'Leadership', 'Fresh Graduate'],
    body: `Sebagai lulusan **Sarjana Manajemen dari STIE Wikara** yang **berpengalaman 2+ tahun di bidang Manajemen Operasional dan 5+ tahun di bidang Kepemimpinan Eksekutif**, saya sangat berambisi untuk bergabung dalam program **Management Trainee** di **[Perusahaan]**. Latar belakang akademis saya diperkuat oleh kepemimpinan nyata selaku mantan **Presiden Mahasiswa STIE Wikara** serta pengalaman lapangan mengelola efisiensi ritel dan administrasi proyek strategis.

Sebagai bukti komparatif dari rekam jejak tersebut, saya menyertakan **portofolio kepemimpinan & proyek** terlampir. Memegang **Sertifikat Kompetensi Bisnis, Digital, Kepemimpinan, dan Public Speaking**, saya siap mendedikasikan potensi terbaik ini untuk berkembang dan memberikan kontribusi bernilai tinggi bagi **[Perusahaan]** pada posisi **[Posisi]**.`
  },
  {
    id: 'tpl-10',
    name: 'Project Manager & Scrum Specialist',
    bahasa: 'Indonesia',
    rekomendasi: ['Project Manager', 'Agile', 'Operations'],
    body: `Sebagai lulusan **Sarjana Manajemen dari STIE Wikara** yang **berpengalaman 2+ tahun di bidang Manajemen Proyek & Pengalokasian Sumber Daya, serta 5+ tahun di bidang Kepemimpinan Tim Lintas Divisi**, saya bermaksud melamar untuk posisi **[Posisi]** di **[Perusahaan]**. Saya berpengalaman merencanakan timeline proyek, memantau KPI kinerja operasional, mengawasi alur logistik, serta memastikan kepatuhan anggaran proyek tepat waktu menggunakan metodologi lincah (Agile/Scrum).

Sebagai bukti nyata atas kompetensi ini, saya menyertakan **portofolio manajemen proyek** terlampir yang merinci kontribusi dan hasil akhir proyek yang dikelola. Dengan **Sertifikat Kompetensi Kepemimpinan & Manajemen**, saya siap mengawal keberhasilan eksekusi proyek-proyek strategis di **[Perusahaan]**.`
  },
  {
    id: 'tpl-11',
    name: 'Umum & Manajemen Operasional Perusahaan',
    bahasa: 'Indonesia',
    rekomendasi: ['HRD', 'Operasional', 'Manajemen'],
    body: `Saya merupakan lulusan **Sarjana Manajemen dari STIE Wikara** yang **berpengalaman 3+ tahun di bidang Operasional Ritel & Manajemen Proyek, serta 5+ tahun di bidang Kepemimpinan Strategis**. Rekam jejak profesional saya mencakup pengelolaan efisiensi alur kerja operasional, pengawasan alur pasokan, serta penyelesaian proyek distribusi sumber daya skala besar. Didukung dengan kepemimpinan kuat selaku mantan **Presiden Mahasiswa** dan prestasi **Duta GenRe Kabupaten Purwakarta**, saya terbiasa mengoordinasikan tim lintas divisi.

Sebagai bukti nyata atas kompetensi tersebut, saya melampirkan **portofolio hasil kerja** yang memuat visualisasi kontribusi riil saya. Saya sangat antusias untuk mengaplikasikan keahlian manajerial ini guna mendukung target **[Perusahaan]** sebagai **[Posisi]**.`
  },
  {
    id: 'tpl-12',
    name: 'Public Relations (Humas) & Partnership',
    bahasa: 'Indonesia',
    rekomendasi: ['Humas', 'PR', 'Hubungan Eksternal'],
    body: `Dengan **pengalaman 3+ tahun di bidang Public Relations & External Relations, serta 5+ tahun di bidang Public Speaking & Stakeholder Engagement**, didukung prestasi sebagai **Duta GenRe Kabupaten Purwakarta** dan pemegang **Sertifikat Kompetensi Public Speaking**, saya bermaksud melamar untuk posisi **[Posisi]** di **[Perusahaan]**. Keahlian komunikasi publik saya terasah nyata melalui peran diplomasi di **Aliansi BEM Purwakarta** serta koordinasi kemitraan lintas instansi pada berbagai program strategis.

Kumpulan dokumentasi kampanye kehumasan dan bukti kerja nyata tersebut telah saya rangkum dalam **portofolio kerja** terlampir. Didukung pendidikan **Sarjana Manajemen STIE Wikara**, saya yakin dapat memperkuat reputasi merek dan memperluas jaringan kemitraan strategis **[Perusahaan]**.`
  },
  {
    id: 'tpl-13',
    name: 'Administrasi Kantor & Dukungan Operasional',
    bahasa: 'Indonesia',
    rekomendasi: ['Administrasi', 'Office Support', 'Kearsipan'],
    body: `Sebagai lulusan **Sarjana Manajemen dari STIE Wikara** yang **berpengalaman 3+ tahun di bidang Administrasi Operasional & Office Management, serta 5+ tahun di bidang Tata Kelola Dokumen**, saya mengajukan diri untuk posisi **[Posisi]** di **[Perusahaan]**. Keahlian manajerial saya terbentuk dari pengelolaan administrasi skala besar selaku **Presiden Mahasiswa STIE Wikara** serta penyusunan sistem kearsipan, logistik, dan pelaporan keuangan operasional pada berbagai proyek strategis.

Sebagai bukti nyata atas keteraturan administrasi ini, saya melampirkan **portofolio administrasi** terlampir. Didukung **Sertifikat Kompetensi Akademik dan Bisnis Digital**, saya berkomitmen penuh menjaga kelancaran operasional harian dan ketertiban administrasi di **[Perusahaan]**.`
  },
  {
    id: 'tpl-14',
    name: 'Human Resources & Talent Acquisition Support',
    bahasa: 'Indonesia',
    rekomendasi: ['HR', 'Talent Acquisition', 'Personalia'],
    body: `Sebagai lulusan **Sarjana Manajemen dari STIE Wikara** yang **berpengalaman 2+ tahun di bidang Administrasi SDM & Talent Engagement, serta 5+ tahun di bidang Pengelolaan Organisasi**, saya mengajukan diri untuk posisi **[Posisi]** di **[Perusahaan]**. Pengalaman saya mencakup koordinasi rekrutmen, orientasi anggota baru, pengarsipan berkas personalia, serta pemeliharaan hubungan kerja harmonis antar-anggota tim.

Sebagian rekam jejak program rekrutmen dan pelatihan internal saya tampilkan dalam **portofolio personalia** terlampir. Memegang **Sertifikat Kompetensi Kepemimpinan & Public Speaking**, saya siap berkontribusi dalam pengelolaan talenta dan pengembangan SDM di **[Perusahaan]**.`
  },
  {
    id: 'tpl-15',
    name: 'Brand Strategist & Marketing Communication',
    bahasa: 'Indonesia',
    rekomendasi: ['Brand Strategy', 'Marcom', 'Pemasaran'],
    body: `Dengan latar belakang **Sarjana Manajemen STIE Wikara** dan **pengalaman 3+ tahun di bidang Brand Strategy & Marketing Communication**, saya mengajukan lamaran untuk posisi **[Posisi]** di **[Perusahaan]**. Saya memiliki kemampuan mumpuni dalam menganalisis posisi pasar kompetitor, merancang strategi komunikasi merek terpadu, serta merencanakan aktivasi brand offline maupun online. Kepemimpinan saya selaku **Presiden Mahasiswa** dan prestasi **Duta GenRe** memperkuat insting saya dalam menangkap perilaku dan psikologi audiens target.

Saya melampirkan **portofolio kampanye brand** yang memuat analisis strategi, riset pasar, dan keberhasilan eksekusi peluncuran produk sebelumnya. Saya siap memosisikan merek **[Perusahaan]** secara terdepan.`
  },
  {
    id: 'tpl-16',
    name: 'SEO Specialist & Content Strategist',
    bahasa: 'Indonesia',
    rekomendasi: ['SEO', 'Content Strategy', 'Traffic'],
    body: `Sebagai lulusan **Sarjana Manajemen STIE Wikara** yang memegang **Sertifikat Kompetensi Digital**, saya memiliki **pengalaman 3+ tahun di bidang Search Engine Optimization (SEO) & Content Strategy**. Saya berpengalaman meningkatkan traffic organik website melalui optimasi on-page/off-page SEO, riset keyword mendalam, analisis kompetitor, serta perencanaan konten yang relevan dan bernilai tinggi.

Bukti riil berupa peningkatan grafik traffic organik, posisi peringkat kata kunci utama, dan performa teknis SEO situs web yang saya tangani dapat Bapak/Ibu lihat pada **portofolio SEO** terlampir. Saya siap mengoptimalkan visibilitas pencarian organik **[Perusahaan]**.`
  },
  {
    id: 'tpl-17',
    name: 'Data Analyst & Business Intelligence Specialist',
    bahasa: 'Indonesia',
    rekomendasi: ['Data Analyst', 'Analytics', 'Visualisasi'],
    body: `Sebagai lulusan **Sarjana Manajemen STIE Wikara** yang mengombinasikan pemahaman bisnis dengan analitik data, saya memiliki **pengalaman 2+ tahun di bidang Data Analysis & Business Intelligence**. Saya mahir mengolah database, merancang dashboard visualisasi data interaktif, serta memberikan insight bisnis yang berharga untuk mendukung pengambilan keputusan strategis.

Sebagai bukti atas keahlian analisis saya, silakan merujuk pada **portofolio data analitik** terlampir yang menampilkan visualisasi dashboard Tableau/PowerBI, laporan analisis tren bisnis, serta kesimpulan data yang membuahkan efisiensi biaya. Saya siap berkontribusi sebagai **[Posisi]** di **[Perusahaan]**.`
  },
  {
    id: 'tpl-18',
    name: 'Virtual Assistant & Executive Remote Support',
    bahasa: 'Indonesia',
    rekomendasi: ['Virtual Assistant', 'Admin', 'Remote Support'],
    body: `Dengan **pengalaman 3+ tahun di bidang Virtual Assistant & Executive Support, serta 5+ tahun dalam Pengorganisasian Administrasi**, saya melamar untuk posisi **[Posisi]** di **[Perusahaan]**. Saya ahli dalam mengelola jadwal pimpinan, merespons korespondensi klien secara profesional, menyusun laporan operasional, serta menangani berbagai tugas administratif harian dengan tingkat akurasi dan kecepatan tinggi dari jarak jauh.

Beberapa alur kerja kearsipan digital dan sistem manajemen tugas yang pernah saya kelola secara sukses saya sertakan dalam **portofolio administratif** terlampir. Saya siap memberikan dukungan penuh bagi produktivitas tim Bapak/Ibu.`
  },
  {
    id: 'tpl-19',
    name: 'Staff Finance & Administrasi Keuangan',
    bahasa: 'Indonesia',
    rekomendasi: ['Finance', 'Keuangan', 'Akuntansi', 'Staff Finance', 'Administrasi Keuangan'],
    body: `Sebagai lulusan **Sarjana Manajemen dari STIE Wikara** dengan pemahaman mendalam tentang manajemen keuangan, anggaran, serta **pengalaman 3+ tahun di bidang Administrasi Keuangan & Operasional**, saya sangat tertarik mengisi posisi **[Posisi]** di **[Perusahaan]**. Saya berpengalaman dalam penyusunan laporan keuangan harian, rekonsiliasi kas, manajemen arus dokumen kasir, serta pengawasan anggaran operasional. Selaku mantan **Presiden Mahasiswa**, saya juga terbiasa mengelola alokasi anggaran kemahasiswaan secara transparan, akuntabel, dan rapi secara administratif.

Saya melampirkan **portofolio administrasi keuangan** terlampir yang memuat visualisasi rancangan anggaran, laporan arus dokumen, serta sertifikasi kompetensi bisnis digital yang relevan sebagai bahan pertimbangan Bapak/Ibu. Saya siap berkontribusi penuh untuk menjaga akurasi keuangan dan ketertiban administrasi di **[Perusahaan]**.`
  },
  {
    id: 'tpl-20',
    name: 'Operator Gudang & Logistik Pabrik',
    bahasa: 'Indonesia',
    rekomendasi: ['Gudang', 'Warehouse', 'Logistik', 'Operator Gudang', 'Staf Gudang'],
    body: `Sebagai lulusan **Sarjana Manajemen STIE Wikara** dengan **pengalaman 3+ tahun di bidang Manajemen Operasional, Inventarisasi, dan Tata Kelola Supply Chain**, saya mengajukan diri untuk mengisi posisi **[Posisi]** di **[Perusahaan]**. Saya memiliki keahlian dalam pengelolaan inventaris barang (stock opname), pengawasan alur pasokan masuk-keluar barang, serta peningkatan efisiensi penyimpanan gudang. Kepemimpinan saya selaku mantan **Presiden Mahasiswa** memperkuat ketahanan fisik, kerja sama tim, dan koordinasi distribusi logistik lapangan skala besar di bawah tekanan.

Saya melampirkan **portofolio manajemen operasional** yang mendokumentasikan sistem administrasi logistik, laporan tata letak penyimpanan, serta sertifikasi kompetensi kepemimpinan dan bisnis digital saya. Saya berkomitmen penuh menjaga ketertiban, akurasi data stok, dan efisiensi logistik di **[Perusahaan]**.`
  },
  {
    id: 'tpl-21',
    name: 'Operator Produksi & Technical Support',
    bahasa: 'Indonesia',
    rekomendasi: ['Operator Produksi', 'Pabrik', 'Technical Support', 'Staf Produksi'],
    body: `Sebagai lulusan **Sarjana Manajemen dari STIE Wikara** yang memegang **Sertifikat Kompetensi Bisnis Digital & Sistem**, serta memiliki **pengalaman operasional dan kepemimpinan lapangan selama 5+ tahun**, saya bermaksud melamar untuk posisi **[Posisi]** di **[Perusahaan]**. Saya memiliki pemahaman yang kuat tentang efisiensi alur kerja (workflow), kedisiplinan kerja yang tinggi, serta kemampuan pemeliharaan perangkat kerja (technical support). Pengalaman saya dalam memimpin organisasi kemahasiswaan selaku **Presiden Mahasiswa** mengasah kedisiplinan, koordinasi tim shift, serta kepatuhan penuh terhadap standar operasional prosedur (SOP) kerja.

Sebagai bahan pertimbangan Bapak/Ibu, saya melampirkan **portofolio kerja lapangan** dan sertifikat kompetensi kepemimpinan saya. Saya siap memberikan dedikasi penuh, ketelitian, dan kedisiplinan tinggi untuk menjaga produktivitas produksi di **[Perusahaan]**.`
  },
  {
    id: 'tpl-22',
    name: 'Staff IT & Admin Technical Support',
    bahasa: 'Indonesia',
    rekomendasi: ['IT Support', 'Staff IT', 'Teknisi IT', 'Technical Support', 'Jaringan'],
    body: `Sebagai lulusan **Sarjana Manajemen dari STIE Wikara** yang memegang **Sertifikat Kompetensi Bisnis Digital & Sistem Informasi** serta **berpengalaman 3+ tahun dalam Web Development & IT Support**, saya mengajukan diri untuk posisi **[Posisi]** di **[Perusahaan]**. Keahlian teknis saya meliputi pemeliharaan perangkat keras dan lunak, trouble-shooting sistem, instalasi jaringan, serta pengelolaan infrastruktur web. Latar belakang manajemen membantu saya mengomunikasikan solusi teknis secara ramah dan profesional kepada seluruh pengguna (user support).

Seluruh rekam jejak pemeliharaan sistem, proyek teknologi, dan sertifikasi keahlian IT saya rangkum dalam **portofolio sistem informasi** terlampir. Saya siap menjaga kelancaran infrastruktur IT di **[Perusahaan]**.`
  },
  {
    id: 'tpl-23',
    name: 'Admin Gudang & Inventory Controller',
    bahasa: 'Indonesia',
    rekomendasi: ['Admin Gudang', 'Inventory Controller', 'Staf Logistik', 'Stock Opname', 'Gudang'],
    body: `Sebagai lulusan **Sarjana Manajemen dari STIE Wikara** yang **berpengalaman 3+ tahun di bidang Manajemen Gudang, Administrasi Inventory, dan Logistik**, saya sangat berantusias melamar untuk posisi **[Posisi]** di **[Perusahaan]**. Saya ahli dalam melakukan rekonsiliasi data stok fisik (stock opname), mengoperasikan sistem administrasi pergudangan digital, serta memastikan ketepatan alur penerimaan dan pengiriman barang. Latar belakang kepemimpinan sebagai **Presiden Mahasiswa** memperkuat ketelitian saya dalam audit stok dan koordinasi dengan kurir/pihak eksternal.

Sebagai acuan kinerja operasional, saya melampirkan **portofolio manajemen logistik** terlampir. Saya siap memberikan dedikasi tinggi guna mewujudkan akurasi data stok 100% di gudang **[Perusahaan]**.`
  },
  {
    id: 'tpl-24',
    name: 'Koordinator Wilayah & Field Supervisor',
    bahasa: 'Indonesia',
    rekomendasi: ['Koordinator Wilayah', 'Field Supervisor', 'SPV Lapangan', 'Operasional Lapangan'],
    body: `Sebagai lulusan **Sarjana Manajemen STIE Wikara** yang **berpengalaman 5+ tahun dalam Kepemimpinan Strategis & Koordinasi Lapangan**, saya sangat tertarik mengisi posisi **[Posisi]** di **[Perusahaan]**. Rekam jejak saya selaku mantan **Presiden Mahasiswa STIE Wikara** dan pemenang **Duta GenRe Kabupaten Purwakarta** membuktikan keahlian saya dalam menggalang tim, memimpin operasi lapangan berskala luas, serta berdiplomasi dengan pemangku kepentingan. Saya terbiasa memantau KPI kinerja tim di lapangan dan memastikan kepatuhan standar kerja.

Saya melampirkan **portofolio kepemimpinan & supervisi** yang menampilkan hasil pengorganisasian program, efisiensi alur kerja, serta kemitraan taktis sebagai bahan pertimbangan Bapak/Ibu. Saya siap membawa pertumbuhan wilayah kerja bagi **[Perusahaan]**.`
  },
  {
    id: 'tpl-25',
    name: 'UI/UX Designer & Product Researcher',
    bahasa: 'Indonesia',
    rekomendasi: ['UI/UX', 'Product Design', 'Figma', 'UX Researcher', 'Desain Produk'],
    body: `Sebagai lulusan **Sarjana Manajemen STIE Wikara** yang memiliki hasrat tinggi dalam interaksi produk digital, didukung kepemilikan **Sertifikat Kompetensi Bisnis Digital & Sistem**, saya mengajukan diri untuk posisi **[Posisi]** di **[Perusahaan]**. Saya memiliki **pengalaman 3+ tahun di bidang UI/UX Design & User Research**, mahir merancang wireframe, user flow, high-fidelity mockups (Figma), serta menguji kegunaan aplikasi (usability testing). Latar belakang manajemen membekali saya perspektif bisnis yang kuat untuk menyelaraskan desain antarmuka dengan tujuan peningkatan konversi produk.

Koleksi rancangan desain antarmuka, studi kasus UX, serta analisis riset produk digital telah saya kumpulkan dalam **portofolio UI/UX** terlampir. Saya siap berkolaborasi untuk mengoptimalkan pengalaman pengguna di **[Perusahaan]**.`
  },
  {
    id: 'tpl-26',
    name: 'Staff Accounting & Tax Executive',
    bahasa: 'Indonesia',
    rekomendasi: ['Accounting', 'Tax', 'Staff Akuntansi', 'Perpajakan', 'Finance'],
    body: `Dengan latar belakang **Sarjana Manajemen STIE Wikara** dan **pengalaman 3+ tahun di bidang Akuntansi Keuangan, Rekonsiliasi Bank, dan Pajak (Brevet/SOP)**, saya melamar untuk posisi **[Posisi]** di **[Perusahaan]**. Saya terbiasa menyusun neraca keuangan, jurnal penyesuaian, laporan rugi laba, serta mengurusi kewajiban perpajakan rutin secara rapi dan akurat. Didukung **Sertifikat Kompetensi Bisnis**, saya mahir mengidentifikasi efisiensi biaya operasional demi menjaga kesehatan fiskal perusahaan.

Saya melampirkan **portofolio keuangan & akuntansi** yang memuat rancangan pelaporan keuangan, analisis margin biaya, serta sertifikat kompetensi terkait. Saya siap memastikan ketertiban pelaporan keuangan dan kepatuhan regulasi di **[Perusahaan]**.`
  },
  {
    id: 'tpl-27',
    name: 'Operational Generalist & Supervisor Produksi',
    bahasa: 'Indonesia',
    rekomendasi: ['Supervisor', 'Supervisor Produksi', 'Operational Generalist', 'Kordinator Operasional'],
    body: `Sebagai lulusan **Sarjana Manajemen STIE Wikara** yang memiliki **pengalaman 3+ tahun dalam Manajemen Operasional Ritel dan 5+ tahun dalam Kepemimpinan Lapangan**, saya mengajukan diri untuk posisi **[Posisi]** di **[Perusahaan]**. Keahlian saya mencakup koordinasi pergantian shift kerja (shift coordination), pengawasan Standard Operating Procedure (SOP), optimasi kapasitas produksi, hingga penyelesaian masalah operasional harian secara taktis. Karakter kepemimpinan saya selaku **Presiden Mahasiswa** sangat menunjang kemampuan saya memotivasi dan memimpin kru lapangan demi mencapai target harian.

Semua dokumentasi efisiensi tim dan sertifikat kompetensi kepemimpinan saya rangkum dalam **portofolio operasional** terlampir. Saya siap memberikan komitmen penuh untuk menyukseskan operasional di **[Perusahaan]**.`
  },
  {
    id: 'tpl-28',
    name: 'HR Recruiter & Employee Relations Staff',
    bahasa: 'Indonesia',
    rekomendasi: ['Recruiter', 'Employee Relations', 'HR Staff', 'Hubungan Karyawan'],
    body: `Sebagai lulusan **Sarjana Manajemen dari STIE Wikara** yang **berpengalaman 2+ tahun di bidang End-to-End Recruitment & Employee Relations, serta 5+ tahun dalam Manajemen Organisasi**, saya melamar sebagai **[Posisi]** di **[Perusahaan]**. Saya ahli dalam melakukan screening kandidat (sourcing), melaksanakan wawancara awal, mengorganisasi program orientasi karyawan baru, serta memfasilitasi program retensi dan engagement karyawan. Kompetensi kehumasan saya selaku **Duta GenRe** dan pemegang **Sertifikat Kompetensi Public Speaking** menjamin komunikasi yang harmonis antara manajemen dan karyawan.

Kumpulan dokumentasi perekrutan dan inisiatif employee engagement saya rangkum dalam **portofolio personalia** terlampir. Saya berkomitmen penuh membangun budaya kerja yang positif di **[Perusahaan]**.`
  },
  {
    id: 'tpl-29',
    name: 'Junior Business Analyst & Sistem Bisnis',
    bahasa: 'Indonesia',
    rekomendasi: ['Business Analyst', 'Sistem Informasi Bisnis', 'Analis Bisnis', 'Sistem Bisnis'],
    body: `Sebagai lulusan **Sarjana Manajemen STIE Wikara** dengan **Sertifikat Kompetensi Bisnis Digital & Sistem Informasi**, saya memiliki **pengalaman 2+ tahun sebagai Junior Business Analyst**. Saya terbiasa menjembatani kebutuhan operasional bisnis dengan solusi teknologi sistem informasi, melakukan pemetaan proses bisnis (flowcharting), serta menganalisis kepuasan pengguna sistem. Kombinasi pengetahuan manajemen bisnis dan kemampuan analisis sistem membekali saya solusi pemecahan masalah yang komprehensif.

Sebagai bahan evaluasi, saya melampirkan **portofolio analisis bisnis** yang memuat studi kasus proses operasional, rancangan requirement sistem, dan rekomendasi efisiensi biaya. Saya sangat antusias untuk berkolaborasi dengan **[Perusahaan]** sebagai **[Posisi]**.`
  },
  {
    id: 'tpl-30',
    name: 'Customer Success & Escalation Specialist',
    bahasa: 'Indonesia',
    rekomendasi: ['Customer Success', 'Escalation Officer', 'Client Relations', 'Pelayanan'],
    body: `Dengan **pengalaman 3+ tahun di bidang Customer Success, Client Relations, dan Penanganan Komplain Tingkat Lanjut**, didukung latar belakang **Sarjana Manajemen dari STIE Wikara**, saya melamar untuk posisi **[Posisi]** di **[Perusahaan]**. Saya mahir meredam situasi ketegangan komplain (conflict resolution), menjaga tingkat retensi klien (customer retention), serta berkoordinasi dengan tim teknis untuk menyelesaikan masalah sistem pengguna secara cepat. Didukung **Sertifikat Kompetensi Public Speaking & Komunikasi**, saya terbiasa menyajikan solusi ramah, efisien, dan memuaskan bagi pelanggan VVIP.

Saya juga menyertakan **portofolio pelayanan pelanggan** terlampir yang mendokumentasikan nilai kepuasan pengguna (NPS/CSAT) sebagai referensi kualifikasi saya. Saya siap meningkatkan kepuasan pelanggan di **[Perusahaan]**.`
  }
];

export default function Templates() {
  const [templates, setTemplates] = useState<CoverLetterTemplate[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');
  const [name, setName] = useState('');
  const [body, setBody] = useState('');
  const [bahasa, setBahasa] = useState('Indonesia');
  const [rekomendasiInput, setRekomendasiInput] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showMobileSheet, setShowMobileSheet] = useState(false);

  const [showAIModal, setShowAIModal] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiTargetPosition, setAiTargetPosition] = useState('');

  const backdropRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Synchronize scroll from textarea to backdrop
  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    if (backdropRef.current) {
      backdropRef.current.scrollTop = e.currentTarget.scrollTop;
      backdropRef.current.scrollLeft = e.currentTarget.scrollLeft;
    }
  };

  // Sync scroll on body value changes
  useEffect(() => {
    if (textareaRef.current && backdropRef.current) {
      backdropRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  }, [body]);

  // Handle Ctrl+B / Cmd+B formatting and backspace behavior
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const val = textarea.value;

    if (e.key === 'Backspace' && start === end) {
      const beforeCursor = val.substring(0, start);
      if (beforeCursor.endsWith('**')) {
        const textBeforeStars = beforeCursor.slice(0, -2);
        const lastStartIndex = textBeforeStars.lastIndexOf('**');
        if (lastStartIndex !== -1 && !textBeforeStars.slice(lastStartIndex + 2).includes('**')) {
          // Cursor is immediately after a completed bold block: **text**|
          e.preventDefault();
          const beforeBlock = val.substring(0, lastStartIndex);
          const blockText = textBeforeStars.slice(lastStartIndex + 2);
          const afterCursor = val.substring(start);
          
          setBody(beforeBlock + blockText + afterCursor);
          
          const newCursorPos = lastStartIndex + blockText.length;
          setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(newCursorPos, newCursorPos);
          }, 0);
          return;
        } else {
          // Fallback: just delete the two asterisks
          e.preventDefault();
          const before = val.substring(0, start - 2);
          const after = val.substring(start);
          setBody(before + after);
          setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start - 2, start - 2);
          }, 0);
          return;
        }
      }
    }

    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
      e.preventDefault();
      const selectedText = val.substring(start, end);
      if (!selectedText) {
        // If nothing is selected, we insert **** and place cursor in the middle
        const before = val.substring(0, start);
        const after = val.substring(end);
        const newValue = before + '****' + after;
        setBody(newValue);

        // Restore cursor position inside the asterisks
        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(start + 2, start + 2);
        }, 0);
        return;
      }

      let newValue = '';
      let newStart = start;
      let newEnd = end;

      // Toggle bold if already wrapped in double asterisks internally OR externally
      const isWrappedInternally = selectedText.startsWith('**') && selectedText.endsWith('**') && selectedText.length >= 4;
      const isWrappedExternally = start >= 2 && end <= val.length - 2 && val.substring(start - 2, start) === '**' && val.substring(end, end + 2) === '**';

      if (isWrappedInternally) {
        const unwrapped = selectedText.slice(2, -2);
        const before = val.substring(0, start);
        const after = val.substring(end);
        newValue = before + unwrapped + after;
        newStart = start;
        newEnd = start + unwrapped.length;
      } else if (isWrappedExternally) {
        const before = val.substring(0, start - 2);
        const after = val.substring(end + 2);
        newValue = before + selectedText + after;
        newStart = start - 2;
        newEnd = start - 2 + selectedText.length;
      } else {
        const wrapped = `**${selectedText}**`;
        const before = val.substring(0, start);
        const after = val.substring(end);
        newValue = before + wrapped + after;
        newStart = start;
        newEnd = start + wrapped.length;
      }

      setBody(newValue);

      // Restore selection range of the formatted text
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(newStart, newEnd);
      }, 0);
    }
  };

  // Render text highlighting markdown bold blocks (**word**)
  const renderHighlightedText = (text: string) => {
    if (!text) {
      return <span className="text-slate-400 dark:text-slate-600 font-normal">Tulis badan email surat lamaran...</span>;
    }

    // Split using double asterisks format with no space right inside
    const parts = text.split(/(\*\*[^\*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-bold text-[#02227e] dark:text-[#60a5fa] bg-slate-200/40 dark:bg-slate-800/50 px-0.5 rounded border border-slate-300/30 dark:border-slate-700/30">
            {part}
          </strong>
        );
      }
      return part;
    });
  };

  useEffect(() => {
    ApiService.get<CoverLetterTemplate[]>('cover-letter-templates').then(res => {
      if (res.success && res.data && res.data.length > 0) {
        const dbTemplates = res.data;
        // Merge DEFAULT_TEMPLATES with dbTemplates, prioritizing dbTemplates
        const merged = DEFAULT_TEMPLATES.map(tpl => {
          const dbTpl = dbTemplates.find(d => d.id === tpl.id);
          if (dbTpl) {
            if ((tpl.body !== dbTpl.body || tpl.name !== dbTpl.name) && tpl.id.startsWith('tpl-')) {
              ApiService.put('cover-letter-templates', tpl).catch(() => {});
              return tpl;
            }
            return dbTpl;
          } else {
            if (tpl.id.startsWith('tpl-')) {
              ApiService.post('cover-letter-templates', tpl).catch(() => {});
            }
            return tpl;
          }
        });
        
        // Find custom templates from database that are not part of DEFAULT_TEMPLATES
        const mergedIds = new Set(merged.map(m => m.id));
        const extraDbTemplates = dbTemplates.filter(d => !mergedIds.has(d.id) && !d.id.startsWith('tpl-'));
        const synchronized = [...merged, ...extraDbTemplates];

        setTemplates(synchronized);
        selectTemplate(synchronized[0]);
      } else {
        setTemplates(DEFAULT_TEMPLATES);
        if (DEFAULT_TEMPLATES.length > 0) {
          selectTemplate(DEFAULT_TEMPLATES[0]);
        }
      }
    });
  }, []);

  const selectTemplate = (tpl: CoverLetterTemplate, isUserAction = false) => {
    setSelectedId(tpl.id);
    setName(tpl.name);
    setBody(tpl.body);
    setBahasa(tpl.bahasa || 'Indonesia');

    if (Array.isArray(tpl.rekomendasi)) {
      setRekomendasiInput(tpl.rekomendasi.join(', '));
    } else if (typeof tpl.rekomendasi === 'string') {
      try {
        const parsed = JSON.parse(tpl.rekomendasi);
        if (Array.isArray(parsed)) {
          setRekomendasiInput(parsed.join(', '));
        } else {
          setRekomendasiInput(tpl.rekomendasi);
        }
      } catch {
        setRekomendasiInput(tpl.rekomendasi || '');
      }
    } else {
      setRekomendasiInput('');
    }

    if (isUserAction) {
      setShowMobileSheet(true);
    }
  };

  const handleSave = () => {
    if (!name || !body) return;

    const recsArray = rekomendasiInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    let updated: CoverLetterTemplate[];
    
    if (selectedId) {
      const updatedTpl: CoverLetterTemplate = { 
         id: selectedId, 
         name, 
         body,
         bahasa,
         rekomendasi: recsArray
      };
      updated = (templates || []).map(t => t.id === selectedId ? updatedTpl : t);
      ApiService.put('cover-letter-templates', updatedTpl);
    } else {
      const newTpl: CoverLetterTemplate = {
        id: 'tpl-' + Date.now().toString(),
        name,
        body,
        bahasa,
        rekomendasi: recsArray
      };
      updated = [newTpl, ...templates];
      setSelectedId(newTpl.id);
      ApiService.post('cover-letter-templates', newTpl);
    }
    
    setTemplates(updated);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleAddNew = () => {
    setSelectedId('');
    setName('Template Baru');
    setBahasa('Indonesia');
    setRekomendasiInput('HRD, PR');
    setBody(`Tuliskan paragraf pengantar dan kualifikasi Anda di sini. 
Header, salam pembuka, dan penutup akan otomatis ditambahkan oleh sistem berdasarkan pengaturan.`);
    setShowMobileSheet(true);
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Apakah Anda yakin ingin menghapus template ini?')) {
      try {
        const response = await ApiService.delete('cover-letter-templates', { body: JSON.stringify({ id }) });
        if (!response.success) throw new Error(response.message);
      } catch (err: any) {
        alert('Gagal menghapus template: ' + err.message);
        return;
      }
      const filtered = (templates || []).filter(t => t.id !== id);
      setTemplates(filtered);
      if (selectedId === id) {
        if (filtered.length > 0) {
          selectTemplate(filtered[0]);
        } else {
          handleAddNew();
        }
      }
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleResetToDefault = () => {
    if (confirm('Apakah Anda yakin ingin mereset ke template bawaan? Semua template yang Anda buat akan terhapus.')) {
      setTemplates(DEFAULT_TEMPLATES);
      selectTemplate(DEFAULT_TEMPLATES[0]);
    }
  };

  const handleAIGenerate = async () => {
    if (!aiTargetPosition.trim()) {
      alert("Mohon isi posisi yang dituju.");
      return;
    }
    
    setIsGeneratingAI(true);
    try {
      const [profileRes, expRes, portRes, skillRes, certRes] = await Promise.all([
        ApiService.get<any>('profil'),
        ApiService.get<any>('pengalaman-profesi'),
        ApiService.get<any>('portofolio'),
        ApiService.get<any>('keahlian'),
        ApiService.get<any>('pelatihan')
      ]);

      const response = await fetch('/api/generate-cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetPosition: aiTargetPosition,
          profileData: profileRes.data,
          experienceData: expRes.data,
          portfolioData: portRes.data,
          skillsData: skillRes.data,
          certificatesData: certRes.data
        })
      });

      const result = await response.json();
      if (result.success) {
        setBody(result.body);
        setName(`Template AI: ${aiTargetPosition}`);
        setRekomendasiInput(aiTargetPosition);
        setShowAIModal(false);
        setAiTargetPosition('');
      } else {
        alert('Gagal membuat dengan AI: ' + result.message);
      }
    } catch (error: any) {
      alert('Gagal memanggil AI: ' + error.message);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const renderEditForm = (isMobileSheet = false) => (
    <div className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 ${isMobileSheet ? 'border-0 p-4 sm:p-6' : 'rounded-2xl p-6 md:p-8'} space-y-6 shadow-sm dark:shadow-none relative`}>
      <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center justify-between text-left">
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
          <FileText className="w-4 h-4 text-accent" />
          {selectedId ? 'Ubah Template' : 'Buat Template Baru'}
        </h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowAIModal(true)}
            className="px-3 py-1.5 bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 hover:bg-indigo-500/20 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Buat dengan AI
          </button>
          {isMobileSheet && (
            <button
              type="button"
              onClick={() => setShowMobileSheet(false)}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Tutup"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4 text-left">
        {/* Template Name */}
        <div>
          <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            Nama Template
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Misal: Digital Marketer"
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold text-[#1e293b] dark:text-[#f8fafc] focus:border-accent focus:outline-none shadow-inner"
          />
        </div>

        {/* Rekomendasi */}
        <div>
          <label className="block text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            Rekomendasi Perusahaan / Divisi (Pisahkan dengan koma)
          </label>
          <input
            type="text"
            value={rekomendasiInput}
            onChange={(e) => setRekomendasiInput(e.target.value)}
            placeholder="Misal: HRD, PR, Pemasaran"
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-xs font-semibold text-[#1e293b] dark:text-[#f8fafc] focus:border-accent focus:outline-none shadow-inner"
          />
        </div>

        {/* Body */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Isi Surat Pengantar (Cover Letter)
            </label>
            <button
              type="button"
              onClick={() => copyToClipboard(body, 'body')}
              className="text-[10px] text-accent hover:text-accent/80 font-medium flex items-center gap-1 cursor-pointer"
            >
              {copiedId === 'body' ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Tersalin
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Salin Semua
                </>
              )}
            </button>
          </div>
          <div className="relative w-full h-[320px] sm:h-[380px] bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-inner focus-within:border-accent transition-colors">
            <div
              ref={backdropRef}
              className="custom-backdrop-class absolute inset-0 w-full h-full whitespace-pre-wrap break-words overflow-y-auto pointer-events-none select-none"
            >
              {renderHighlightedText(body)}
            </div>
            <textarea
              ref={textareaRef}
              value={body}
              onChange={(e) => {
                setBody(e.target.value);
                if (backdropRef.current) {
                  backdropRef.current.scrollTop = e.target.scrollTop;
                }
              }}
              onScroll={handleScroll}
              onKeyDown={handleKeyDown}
              spellCheck="false"
              className="custom-textarea-class absolute inset-0 w-full h-full bg-transparent border-0 focus:ring-0 focus:outline-none whitespace-pre-wrap break-words resize-none overflow-y-auto"
              placeholder="Tulis badan email surat lamaran..."
            />
          </div>
        </div>
      </div>

      {/* Save Buttons & Alert */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2 text-[10px] text-slate-450 dark:text-slate-500 text-left">
          <AlertCircle className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
          <span>Format variabel yang di-replace otomatis: <code className="text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-950 px-1 py-0.5 rounded font-mono">[Posisi]</code> dan <code className="text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-950 px-1 py-0.5 rounded font-mono">[Perusahaan]</code></span>
        </div>

        <div className="flex items-center gap-3">
          {isSaved && (
            <motion.span 
              initial={{ opacity: 0, x: 5 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xs font-semibold text-accent flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" /> Berhasil Disimpan
            </motion.span>
          )}
          <button
            onClick={handleSave}
            disabled={!name || !body}
            className="px-5 py-3 bg-accent hover:bg-accent/90 disabled:opacity-50 disabled:pointer-events-none text-white font-bold rounded-xl text-xs transition-all flex items-center gap-2 cursor-pointer shadow-[0_4px_12px_rgba(2,34,126,0.1)] hover:shadow-[0_4px_18px_rgba(2,34,126,0.25)] active:scale-98 animate-none w-full sm:w-auto justify-center"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Template</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div id="admin-templates-page" className="space-y-8">
      {/* AI Modal */}
      <AnimatePresence>
        {showAIModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs"
              onClick={() => !isGeneratingAI && setShowAIModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-xl max-w-md w-full z-20"
            >
              <button
                onClick={() => !isGeneratingAI && setShowAIModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500 shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-slate-800 dark:text-slate-200">Buat Surat dengan AI</h3>
                  <p className="text-[10px] text-slate-500">AI akan menyesuaikan pengalaman kerja nyatamu agar relevan dengan posisi yang dilamar tanpa mengarang data.</p>
                </div>
              </div>
              
              <div className="space-y-4 text-left">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-400 mb-1.5">
                    Posisi Pekerjaan yang Dituju
                  </label>
                  <input
                    type="text"
                    autoFocus
                    placeholder="Contoh: Staff Finance, IT Support, Operator Produksi"
                    value={aiTargetPosition}
                    onChange={e => setAiTargetPosition(e.target.value)}
                    disabled={isGeneratingAI}
                    className="w-full px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:border-indigo-500"
                  />
                </div>
                
                <button
                  onClick={handleAIGenerate}
                  disabled={isGeneratingAI || !aiTargetPosition.trim()}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-sm rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  {isGeneratingAI ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Menganalisis & Menyusun...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Buat Surat Lamaran
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Templates List */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-1">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider text-left">
              Daftar Template ({(templates || []).length})
            </p>
            <button
              onClick={handleAddNew}
              className="text-[10px] font-bold text-accent hover:text-accent/80 transition-colors cursor-pointer flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              <span>Buat Baru</span>
            </button>
          </div>
          <div className="space-y-2 lg:max-h-[680px] max-h-[500px] overflow-y-auto pr-1">
            {(templates || []).map((tpl) => (
              <div
                key={tpl.id}
                onClick={() => selectTemplate(tpl, true)}
                className={`p-4 rounded-xl border transition-all text-left cursor-pointer group flex items-start justify-between gap-3 ${
                  selectedId === tpl.id
                    ? 'bg-slate-50 dark:bg-slate-900 border-accent/40 text-slate-900 dark:text-slate-100 shadow-md'
                    : 'bg-white dark:bg-slate-950/60 border-slate-200 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-900/60 text-slate-500 dark:text-slate-400 shadow-sm dark:shadow-none'
                }`}
              >
                <div className="space-y-1.5 overflow-hidden">
                  <h3 className={`text-xs font-semibold truncate ${selectedId === tpl.id ? 'text-accent' : 'text-slate-750 dark:text-slate-300'}`}>
                    {tpl.name}
                  </h3>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {Array.isArray(tpl.rekomendasi) ? (
                      tpl.rekomendasi.map((tag, i) => (
                        <span key={i} className="text-[9px] font-medium px-1.5 py-0.5 bg-accent/5 rounded-md text-accent">
                          {tag}
                        </span>
                      ))
                    ) : typeof tpl.rekomendasi === 'string' && tpl.rekomendasi ? (
                      <span className="text-[9px] font-medium px-1.5 py-0.5 bg-accent/5 rounded-md text-accent">
                        {tpl.rekomendasi}
                      </span>
                    ) : null}
                  </div>
                </div>
                {/* Delete button (prevent deleting all) */}
                {(templates || []).length > 1 && (
                  <button
                    onClick={(e) => handleDelete(tpl.id, e)}
                    className="p-1 text-slate-400 hover:text-red-500 rounded hover:bg-slate-150 dark:hover:bg-slate-800 shrink-0 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer"
                    title="Hapus template"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Edit Form */}
        <div className="hidden lg:block lg:col-span-8">
          {renderEditForm(false)}
        </div>
      </div>

      {/* Mobile Edit Form Bottom Sheet */}
      <AnimatePresence>
        {showMobileSheet && (
          <div 
            className="lg:hidden fixed inset-0 z-50 flex items-end justify-center p-0 bg-slate-950/70 backdrop-blur-sm"
            onClick={() => setShowMobileSheet(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-h-[88vh] bg-white dark:bg-slate-900 rounded-t-3xl shadow-2xl flex flex-col overflow-hidden border-t border-slate-200 dark:border-slate-800"
            >
              {/* Drag handle for mobile bottom sheet */}
              <div className="flex justify-center pt-2.5 pb-1 shrink-0 bg-white dark:bg-slate-900">
                <div className="w-10 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
              </div>

              {/* Scrollable Form Content */}
              <div className="overflow-y-auto flex-1">
                {renderEditForm(true)}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
