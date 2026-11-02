import { CVAchievement } from '../../types';

export interface EducationItem {
  degree: string;
  institution: string;
  period: string;
  detail: string;
  gpa?: string;
  predicate?: string;
}

export const educationIn: EducationItem[] = [
  {
    degree: "Sarjana Manajemen (S1 Manajemen)",
    institution: "STIE Wibawa Karta Raharja",
    period: "2022 - 2026",
    gpa: "3,63 / 4,00",
    predicate: "Dengan Pujian",
    detail: "Fokus pendalaman kurikulum pada Manajemen Operasional, Manajemen SDM, Manajemen Pemasaran, Manajemen Keuangan, Manajemen Risiko, dan Manajemen Strategi guna perumusan strategi bisnis, tata kelola organisasi, dan efisiensi operasional terukur."
  },
  {
    degree: "Diploma / SMK Akuntansi",
    institution: "SMKN Kiarapedes",
    period: "2019 - 2021",
    detail: "Mempelajari siklus akuntansi keuangan, akuntansi pemerintahan, pembukuan jurnal transaksi, penyusunan laporan keuangan dasar, rekonsiliasi kas, administrasi perpajakan, dan tata kelola pembukuan bisnis."
  }
];

export const educationEn: EducationItem[] = [
  {
    degree: "Bachelor of Science in Management (S.M. / S1 Management)",
    institution: "STIE Wibawa Karta Raharja",
    period: "2022 - 2026",
    gpa: "3.63 / 4.00",
    predicate: "With Honors",
    detail: "Core curriculum focused on Operations Management, Human Resource Management, Marketing Management, Financial Management, Risk Management, and Strategic Management to drive business performance, organizational governance, and operational efficiency."
  },
  {
    degree: "Diploma / Vocational High School in Accounting",
    institution: "SMKN Kiarapedes",
    period: "2019 - 2021",
    detail: "Comprehensive coursework covering financial accounting cycles, governmental accounting, transaction journal bookkeeping, basic financial reporting, cash reconciliation, tax administration, and business record-keeping."
  }
];

export const achievementsIn: CVAchievement[] = [
  {
    "id": "ach-1",
    "title": "Regional Representative & Solution Pitch Presenter",
    "organization": "PT Perdana Jatiputra (Konica Minolta)",
    "year": "2024",
    "level": "Nasional",
    "description": "Terpilih mewakili kantor cabang yang memegang wilayah operasional Bekasi, Cikarang, Karawang, dan Purwakarta pada peluncuran produk baru oleh Marketing Manager Nasional, mempresentasikan solusi penawaran B2B & pitch strategi penjualan terbaik."
  },
  {
    "id": "ach-2",
    "title": "Brand Marketing & Event Promotions Bincang Ulos",
    "organization": "Vany's Group",
    "year": "2024",
    "level": "Nasional",
    "description": "Merancang strategi komunikasi pemasaran terpadu, aktivasi media digital, dan materi promosi visual untuk perhelatan budaya tingkat nasional; berhasil memperluas jangkauan audiens lintas daerah serta meningkatkan tingkat kehadiran peserta hingga melampaui target."
  },
  {
    "id": "ach-3",
    "title": "Event Promotions Specialist GO Vany Villa Balige",
    "organization": "Vany's Group",
    "year": "2024",
    "level": "Nasional",
    "description": "Mengelola seluruh rangkaian promosi peluncuran akbar (Grand Opening) fasilitas perhotelan, mencakup koordinasi kampanye media, materi publisitas, serta manajemen relasi tamu undangan kehormatan; sukses membangun awareness pasar dan mendongkrak okupansi awal."
  },
  {
    "id": "ach-4",
    "title": "Exclusive Host Podcast Putra Batik Indonesia",
    "organization": "Komunitas Pena Lensa",
    "year": "2023",
    "level": "Nasional",
    "description": "Memandu sesi wawancara eksklusif bersama tokoh wirausaha muda dan pegiat pelestarian wastra nusantara; menyusun kerangka dialog strategis yang menjembatani edukasi nilai budaya dengan peluang bisnis kreatif, menghasilkan peningkatan engagement audiens hingga ribuan pendengar."
  },
  {
    "id": "ach-5",
    "title": "Event Manager WSC Piala Gubernur Wil. IV",
    "organization": "CADISDIK Provinsi Wilayah IV",
    "year": "2025",
    "level": "Provinsi",
    "description": "Memimpin perencanaan dan eksekusi turnamen multi-cabang olahraga dan kreativitas pelajar tingkat Jawa Barat; mengoordinasikan operasional venue, manajemen perwasitan, sponsorship, dan protokol keselamatan bagi 500+ peserta dengan SLA kelancaran acara 100%."
  },
  {
    "id": "ach-6",
    "title": "Steering Committee Wikara CUP Volleyball",
    "organization": "STIE Wibawa Karta Raharja",
    "year": "2026",
    "level": "Kabupaten/Kota",
    "description": "Bertindak sebagai komite pengarah turnamen bola voli tingkat kabupaten/kota; menyusun regulasi teknis pertandingan, mengawasi alokasi anggaran kepanitiaan, serta menjamin tertib administratif dan koordinasi keamanan bersama stakeholder lokal."
  },
  {
    "id": "ach-7",
    "title": "Winner Duta GenRe Kab. Purwakarta",
    "organization": "DPPKB Kab. Purwakarta",
    "year": "2023",
    "level": "Kabupaten/Kota",
    "description": "Meraih Juara 1 dalam seleksi Duta Generasi Berencana atas keunggulan presentasi program advokasi kesehatan reproduksi dan perencanaan masa depan remaja; memimpin kampanye sosialisasi terpadu yang menjangkau puluhan sekolah dan komunitas pemuda daerah."
  },
  {
    "id": "ach-8",
    "title": "Dewan Juri | Kompetisi UMKM Fest. Bangga Kencana",
    "organization": "DPPKB Kab. Purwakarta",
    "year": "2023",
    "level": "Kabupaten/Kota",
    "description": "Dipercaya sebagai juri independen untuk mengevaluasi kelayakan finansial, diferensiasi produk, dan efektivitas strategi pemasaran digital dari puluhan pelaku UMKM; memberikan umpan balik taktis guna mendorong kesiapan komersial dan daya saing pasar lokal."
  },
  {
    "id": "ach-9",
    "title": "Pembicara Prodi Manajemen EduFest Kab. Purwakarta",
    "organization": "Education Festival Kab. Purwakarta",
    "year": "2023",
    "level": "Kabupaten/Kota",
    "description": "Menjadi narasumber utama dalam seminar edukasi kejuruan manajemen bisnis di hadapan ratusan pelajar dan mahasiswa; memaparkan tren kepemimpinan transformasional, keahlian industri 4.0, dan strategi adaptasi karier di era digital secara interaktif."
  },
  {
    "id": "ach-10",
    "title": "Moderator Seminar Kementerian Keuangan Goes To Campus",
    "organization": "KPKNL Kab. Purwakarta",
    "year": "2023",
    "level": "Kampus",
    "description": "Memoderatori forum diskusi strategis literasi pengelolaan aset negara dan disiplin anggaran publik bersama perwakilan DJKN Kementerian Keuangan RI; memfasilitasi interaksi kritis antara narasumber eksekutif dengan sivitas akademika secara dinamis dan profesional."
  },
  {
    "id": "ach-11",
    "title": "Steering Committee PKKMB Wikara Next Generations",
    "organization": "BEM STIE Wikara",
    "year": "2025",
    "level": "Kampus",
    "description": "Mengarahkan tim kepanitiaan dalam merumuskan kurikulum pengenalan kampus berbasis penguatan karakter, etika akademik, dan wawasan kepemimpinan; memastikan seluruh agenda orientasi berlangsung tertib, edukatif, inklusif, dan bebas dari praktik non-akademik."
  },
  {
    "id": "ach-12",
    "title": "Executive Producer WIHUB UKM",
    "organization": "Collaboration UKM STIE Wikara",
    "year": "2023",
    "level": "Kampus",
    "description": "Memimpin produksi platform kolaborasi digital terintegrasi yang menghimpun seluruh karya kreasi unit kegiatan mahasiswa; mengoordinasikan standardisasi konten, jadwal publikasi, dan sinergi lintas UKM guna mengoptimalkan eksposur prestasi kampus."
  },
  {
    "id": "ach-13",
    "title": "Event Manager Pekan Olahraga Mahasiswa",
    "organization": "BEM STIE Wikara",
    "year": "2024",
    "level": "Kampus",
    "description": "Menjabat sebagai manajer acara utama dalam kompetisi olahraga multi-cabang antar-jurusan; mengawasi manajemen operasional lapangan, kepatuhan jadwal tanding, dan alokasi logistik, berhasil membina sportivitas serta meningkatkan partisipasi mahasiswa hingga 40%."
  },
  {
    "id": "ach-14",
    "title": "Director of Tak Kasat Film Dokumenter Horor",
    "organization": "KPPM Desa Gunung Hejo",
    "year": "2025",
    "level": "Kampus",
    "description": "Menyutradarai karya dokumenter berbasis riset etnografi dan kearifan lokal selama program pengabdian masyarakat; memimpin proses pra-produksi hingga pasca-produksi video, menghasilkan tayangan audio-visual yang sukses mengedukasi dan menarik apresiasi luas audiens kampus."
  },
  {
    "id": "ach-15",
    "title": "Pembicara Mini Seminar Kewirausahaan KWU",
    "organization": "UKM KWU STIE Wikara",
    "year": "2023",
    "level": "Kampus",
    "description": "Membawakan materi fundamental mengenai riset segmentasi pasar, pemodelan keuangan dasar, dan validasi kelayakan usaha rintisan bagi mahasiswa; membimbing sesi studi kasus langsung yang membantu peserta merumuskan proposal bisnis siap uji."
  },
  {
    "id": "ach-16",
    "title": "Moderator Seminar Keorganisasian Indonesia",
    "organization": "BEM STIE Wikara",
    "year": "2023",
    "level": "Kampus",
    "description": "Bertindak sebagai pemandu seminar kepemimpinan yang membahas tata kelola organisasi modern, resolusi konflik internal, dan pembentukan kultur tim akuntabel; memicu diskursus aktif dan menghasilkan rumusan strategi pengembangan kelembagaan mahasiswa."
  },
  {
    "id": "ach-17",
    "title": "Moderator Debat Pemira",
    "organization": "Panitia Pemira KPUM STIE Wikara",
    "year": "2023",
    "level": "Kampus",
    "description": "Memimpin jalannya debat kandidat pemilihan umum raya mahasiswa secara netral, tegas, dan berintegritas tinggi; menyusun alur penajaman visi misi serta dinamika tanya-jawab terstruktur yang dihadiri oleh ratusan mahasiswa dan pimpinan fakultas."
  },
  {
    "id": "ach-18",
    "title": "Best Student / Mahasiswa Terbaik PMB",
    "organization": "STIE Wibawa Karta Raharja",
    "year": "2022",
    "level": "Kampus",
    "description": "Dianugerahi predikat Mahasiswa Terbaik pada rangkaian Penerimaan Mahasiswa Baru atas keunggulan performa tes skolastik, pemecahan masalah kelompok, dan inisiatif kepemimpinan; terpilih mewakili angkatan dalam berbagai forum kolaborasi akademik awal."
  }
];

export const achievementsEn: CVAchievement[] = [
  {
    "id": "ach-1",
    "title": "Regional Representative & Solution Pitch Presenter",
    "organization": "PT Perdana Jatiputra (Konica Minolta)",
    "year": "2024",
    "level": "Nasional",
    "description": "Selected to represent the branch office covering Bekasi, Cikarang, Karawang, and Purwakarta territories at the national product launch; delivered strategic B2B offering pitches and market penetration strategies before corporate leadership and regional partners."
  },
  {
    "id": "ach-2",
    "title": "Brand Marketing & Event Promotions Lead – Bincang Ulos",
    "organization": "Vany's Group",
    "year": "2024",
    "level": "Nasional",
    "description": "Designed integrated marketing communications, digital media activations, and creative promotional assets for a national cultural heritage event; successfully expanded multi-regional audience reach and surpassed attendance engagement targets."
  },
  {
    "id": "ach-3",
    "title": "Event Promotions Specialist GO Vany Villa Balige",
    "organization": "Vany's Group",
    "year": "2024",
    "level": "Nasional",
    "description": "Orchestrated the comprehensive promotional and launch campaign for a hospitality resort Grand Opening; managed media relations, high-profile invitation protocols, and publicity materials, driving substantial brand awareness and initial occupancy rates."
  },
  {
    "id": "ach-4",
    "title": "Exclusive Host Podcast Putra Batik Indonesia",
    "organization": "Komunitas Pena Lensa",
    "year": "2023",
    "level": "Nasional",
    "description": "Conducted strategic interview sessions with national cultural entrepreneurs and youth innovators; structured high-impact dialogues connecting traditional textile heritage with creative commerce, boosting digital audience engagement to thousands of listeners."
  },
  {
    "id": "ach-5",
    "title": "Event Manager WSC Governor Cup Region IV",
    "organization": "CADISDIK West Java Region IV",
    "year": "2025",
    "level": "Provinsi",
    "description": "Spearheaded end-to-end event planning and operational management for inter-school sports championships and creative arts competitions across West Java; coordinated venue operations, committee logistics, and safety protocols for 500+ participants with 100% SLA delivery."
  },
  {
    "id": "ach-6",
    "title": "Steering Committee Wikara CUP Volleyball",
    "organization": "STIE Wibawa Karta Raharja",
    "year": "2026",
    "level": "Kabupaten/Kota",
    "description": "Served on the executive steering committee for a regency-wide collegiate volleyball tournament; formulated competition regulations, oversaw budget allocations, and coordinated venue security logistics with regional government stakeholders."
  },
  {
    "id": "ach-7",
    "title": "1st Winner Duta GenRe Purwakarta Regency",
    "organization": "DPPKB Purwakarta Regency",
    "year": "2023",
    "level": "Kabupaten/Kota",
    "description": "Earned 1st Place Youth Ambassador for Purwakarta Regency recognizing excellence in designing and presenting youth reproductive health and future planning programs; led advocacy campaigns reaching dozens of schools and youth organizations across the district."
  },
  {
    "id": "ach-8",
    "title": "Jury Board Member | MSME Competition Bangga Kencana",
    "organization": "DPPKB Purwakarta Regency",
    "year": "2023",
    "level": "Kabupaten/Kota",
    "description": "Appointed as an independent judge evaluating business model viability, product differentiation, and digital marketing strategies for local MSME competitors; delivered actionable critique to empower commercial readiness and regional market competitiveness."
  },
  {
    "id": "ach-9",
    "title": "Keynote Speaker Management Dept EduFest Purwakarta",
    "organization": "Education Festival Purwakarta Regency",
    "year": "2023",
    "level": "Kabupaten/Kota",
    "description": "Delivered keynote lectures on business management fundamentals and modern leadership to an audience of hundreds of students; shared insights on transformational management, Industry 4.0 competencies, and agile career navigation in the digital economy."
  },
  {
    "id": "ach-10",
    "title": "Moderator Ministry of Finance Goes To Campus Seminar",
    "organization": "KPKNL Purwakarta Regency",
    "year": "2023",
    "level": "Kampus",
    "description": "Moderated a high-profile public symposium on state asset management and fiscal governance featuring executive officials from the Indonesian Ministry of Finance (DJKN); facilitated dynamic intellectual discourse between guest dignitaries and university scholars."
  },
  {
    "id": "ach-11",
    "title": "Steering Committee PKKMB Wikara Next Generations",
    "organization": "BEM STIE Wikara",
    "year": "2025",
    "level": "Kampus",
    "description": "Directed the committee framework in establishing comprehensive orientation curricula centered on academic ethics, character development, and leadership principles; ensured all freshmen transition activities ran smoothly, inclusively, and free of non-academic practices."
  },
  {
    "id": "ach-12",
    "title": "Executive Producer WIHUB Student Activity Hub",
    "organization": "Collaboration Student Units STIE Wikara",
    "year": "2023",
    "level": "Kampus",
    "description": "Led the executive production of an integrated digital collaboration platform uniting student activity organizations; standardized media publishing workflows, creative schedules, and cross-functional alignment to elevate campus achievements."
  },
  {
    "id": "ach-13",
    "title": "Event Manager Campus Student Sports Week",
    "organization": "BEM STIE Wikara",
    "year": "2024",
    "level": "Kampus",
    "description": "Directed operations as head event manager for multi-sport inter-departmental athletic championships; managed field logistics, match scheduling compliance, and referee coordination, fostering strong sportsmanship and increasing student participation by 40%."
  },
  {
    "id": "ach-14",
    "title": "Director of Tak Kasat Documentary Film",
    "organization": "KPPM Gunung Hejo Village",
    "year": "2025",
    "level": "Kampus",
    "description": "Directed an ethnographic documentary film capturing local wisdom and environmental heritage during community empowerment initiatives; oversaw pre-production through post-production, delivering an impactful narrative widely commended across campus showcases."
  },
  {
    "id": "ach-15",
    "title": "Speaker Mini Seminar Entrepreneurship UKM KWU",
    "organization": "UKM KWU STIE Wikara",
    "year": "2023",
    "level": "Kampus",
    "description": "Delivered structured workshops covering market segmentation research, financial break-even modeling, and startup idea validation for aspiring entrepreneurs; mentored hands-on case studies helping student teams refine pitch-ready venture proposals."
  },
  {
    "id": "ach-16",
    "title": "Moderator Seminar Organizational Leadership Indonesia",
    "organization": "BEM STIE Wikara",
    "year": "2023",
    "level": "Kampus",
    "description": "Facilitated university leadership development seminars addressing institutional governance, conflict mediation, and accountable team culture; moderated interactive discussions producing actionable roadmaps for student body organizational advancement."
  },
  {
    "id": "ach-17",
    "title": "Moderator Student Presidential Debate",
    "organization": "KPUM Electoral Committee STIE Wikara",
    "year": "2023",
    "level": "Kampus",
    "description": "Chaired official student presidential debates with strict neutrality, decorum, and structural integrity; guided policy cross-examinations and audience Q&A sessions attended by hundreds of students and university faculty leadership."
  },
  {
    "id": "ach-18",
    "title": "Best Student Award - New Student Orientation (PMB)",
    "organization": "STIE Wibawa Karta Raharja",
    "year": "2022",
    "level": "Kampus",
    "description": "Honored as the Best Freshman during the university new student admission and orientation program (PMB) for scholastic excellence, collaborative problem-solving, and exemplary leadership potential across incoming student cohorts."
  }
];

export const educationId = educationIn;
export const achievementsId = achievementsIn;

export const education = {
  in: educationIn,
  id: educationIn,
  en: educationEn,
};

export const achievements = {
  in: achievementsIn,
  id: achievementsIn,
  en: achievementsEn,
};

export const educationsIn = educationIn;
export const educationsId = educationIn;
export const educationsEn = educationEn;
export const educations = education;



