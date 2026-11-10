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
    "title": "Ketua Pelaksana WSC Piala Gubernur Jabar",
    "organization": "CADISDIK Provinsi Jawa Barat Wilayah IV",
    "year": "2025",
    "level": "Provinsi",
    "description": "Penghargaan sebagai Ketua Pelaksana ajang kompetisi Stand Up Comedy Champion Piala Gubernur Jawa Barat 2025 dalam rangka Dies Natalis ke-25 STIE Wikara bagi peserta SMA/SMK se-Jawa Barat Wilayah IV dengan SLA kelancaran 100%."
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
    "description": "Penghargaan sebagai Winner Duta Generasi Berencana (GenRe) Kabupaten Purwakarta Tahun 2023 dalam Apresiasi Duta & Jambore Ajang Kreativitas; memimpin advokasi kesehatan reproduksi dan perencanaan masa depan remaja daerah."
  },
  {
    "id": "ach-8",
    "title": "Dewan Juri Lomba UPPKA UMKM",
    "organization": "DPPKB Kab. Purwakarta & Kec. Campaka",
    "year": "2023",
    "level": "Kabupaten/Kota",
    "description": "Penghargaan atas kontribusi sebagai Dewan Juri dalam kegiatan Lomba UPPKA Kecamatan Campaka, Purwakarta, pada 14 Agustus 2023; mengevaluasi kelayakan finansial, inovasi produk, dan efektivitas pemasaran digital pelaku UMKM."
  },
  {
    "id": "ach-9",
    "title": "Pemateri EduFest Kab. Purwakarta",
    "organization": "Saduta Foundation & Edufest Purwakarta",
    "year": "2025",
    "level": "Kabupaten/Kota",
    "description": "Apresiasi atas dedikasi dan kontribusi sebagai pemateri dalam kegiatan Pengenalan Program Studi Manajemen pada Edukasi Festival Kabupaten Purwakarta (Edufest) tahun 2025 yang diselenggarakan oleh Saduta Foundation pada 1 April 2025."
  },
  {
    "id": "ach-10",
    "title": "Moderator Kemenkeu Goes To Campus",
    "organization": "Kemenkeu RI (KPKNL Purwakarta)",
    "year": "2023",
    "level": "Nasional",
    "description": "Penghargaan atas kontribusi sebagai moderator kegiatan Ministry of Finance Goes to Campus di Purwakarta bersama instansi vertikal Kementerian Keuangan RI (KPPBC TMP A, KPP Pratama, KPKNL, dan KPPN Purwakarta)."
  },
  {
    "id": "ach-11",
    "title": "Steering Committee PKKMB STIE Wikara",
    "organization": "STIE Wibawa Karta Raharja",
    "year": "2025",
    "level": "Kampus",
    "description": "Apresiasi atas dedikasi, komitmen, dan kontribusi sebagai Steering Committee kegiatan Pengenalan Kehidupan Kampus bagi Mahasiswa Baru (PKKMB) STIE Wikara Tahun Akademik 2025/2026 bertema \"Wikara Next Generation\"."
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
    "title": "Master of Ceremony PORSA STIE Wikara",
    "organization": "STIE Wibawa Karta Raharja",
    "year": "2024",
    "level": "Kampus",
    "description": "Apresiasi atas kontribusi sebagai Master of Ceremony (MC) dalam kegiatan Pekan Olahraga Mahasiswa (PORSA) yang diselenggarakan di STIE Wibawa Karta Raharja pada 8 Juli 2024; memandu upacara dan dinamika panggung secara profesional."
  },
  {
    "id": "ach-14",
    "title": "Director Film Dokumenter Tak Kasat",
    "organization": "KPPM STIE Wikara & Desa Gunung Hejo",
    "year": "2025",
    "level": "Kampus",
    "description": "Penghargaan atas kontribusi sebagai Director dalam proses pembuatan film \"Tak Kasat – Misteri Gunung Hejo\" pada kegiatan KPPM STIE Wikara tahun 2025 di Desa Gunung Hejo, Purwakarta sebagai karya audiovisual edukasi budaya."
  },
  {
    "id": "ach-15",
    "title": "Pembicara Seminar Potensi Diri KWU",
    "organization": "UKM Kewirausahaan STIE Wikara",
    "year": "2024",
    "level": "Kampus",
    "description": "Apresiasi atas kontribusi sebagai pembicara atau narasumber dalam Mini Seminar \"Menggali Potensi Diri\" yang diselenggarakan oleh UKM Kewirausahaan STIE Wikara pada 31 Maret 2024 terkait riset pasar dan pemodelan usaha rintisan."
  },
  {
    "id": "ach-16",
    "title": "Moderator Seminar Keorganisasian Indonesia",
    "organization": "BEM STIE Wikara",
    "year": "2023",
    "level": "Kampus",
    "description": "Apresiasi atas dedikasi dan kontribusi sebagai moderator dalam Seminar Keorganisasian Indonesia 2023; memandu dialog interaktif tata kelola kepemimpinan, resolusi konflik, dan kultur tim akuntabel."
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
    "title": "Mahasiswa Terbaik PMB",
    "organization": "STIE Wibawa Karta Raharja",
    "year": "2022",
    "level": "Kampus",
    "description": "Dianugerahi predikat Mahasiswa Terbaik pada rangkaian Penerimaan Mahasiswa Baru atas keunggulan performa tes skolastik, pemecahan masalah kelompok, dan inisiatif kepemimpinan."
  },
  {
    "id": "ach-19",
    "title": "Ketua BEM STIE Wikara",
    "organization": "STIE Wibawa Karta Raharja",
    "year": "2025",
    "level": "Kampus",
    "description": "Penghargaan atas pencapaian sebagai Ketua Badan Eksekutif Mahasiswa (BEM) STIE Wikara periode 2025/2026; memimpin kepengurusan tertinggi mahasiswa, mengoordinasikan program kerja strategis kampus, serta membangun representasi sivitas akademika."
  },
  {
    "id": "ach-20",
    "title": "Head of the Business Education UKM KWU",
    "organization": "UKM Kewirausahaan STIE Wikara",
    "year": "2024",
    "level": "Kampus",
    "description": "Apresiasi sebagai Head of the Business Education dalam organisasi Kewirausahaan STIE Wikara periode kepengurusan 2024–2025 atas dedikasi dalam kurikulum edukasi kewirausahaan dan inkubasi bisnis mahasiswa."
  },
  {
    "id": "ach-21",
    "title": "Pembicara Seminar \"Berani Jadi Beda\"",
    "organization": "FOSTA Purwakarta",
    "year": "2024",
    "level": "Kabupaten/Kota",
    "description": "Apresiasi atas kontribusi sebagai pembicara atau narasumber dalam Seminar \"Berani Jadi Beda\" yang diselenggarakan oleh FOSTA Purwakarta pada 4 Juli 2024; membagikan wawasan motivasi, potensi diri, dan komunikasi inspiratif."
  },
  {
    "id": "ach-22",
    "title": "Peserta OSN IPA Terpadu SMP Se-Purwakarta",
    "organization": "Dinas Pendidikan Kab. Purwakarta",
    "year": "2017",
    "level": "Kabupaten/Kota",
    "description": "Sertifikat penghargaan sebagai peserta Olimpiade Sains Nasional (OSN) tingkat SMP se-Kabupaten Purwakarta tahun 2017 pada mata pelajaran Ilmu Pengetahuan Alam (IPA) di SMPN 2 Purwakarta pada 11 Maret 2017."
  },
  {
    "id": "ach-23",
    "title": "Peserta Paskibra HUT RI 72 Kecamatan",
    "organization": "Muspika Kecamatan Kiarapedes",
    "year": "2017",
    "level": "Kecamatan",
    "description": "Penghargaan sebagai peserta Pasukan Pengibar Bendera (PASKIBRA) Kecamatan Kiarapedes tahun 2017 dalam upacara peringatan Hari Ulang Tahun ke-72 Kemerdekaan Republik Indonesia pada 18 Agustus 2017."
  },
  {
    "id": "ach-24",
    "title": "Juara I Lomba Pidato Sumpah Pemuda SMK",
    "organization": "OSIS & MPK SMKN Kiarapedes",
    "year": "2019",
    "level": "Sekolah",
    "description": "Penghargaan Juara I dalam kompetisi lomba pidato yang diselenggarakan oleh OSIS dan MPK SMK Negeri Kiarapedes pada 2 November 2019 dalam rangka peringatan Hari Sumpah Pemuda untuk keterampilan berbicara di depan umum persuasif."
  },
  {
    "id": "ach-25",
    "title": "Juara II Lomba Pidato Maulid Nabi SMK",
    "organization": "OSIS & MPK SMKN Kiarapedes",
    "year": "2019",
    "level": "Sekolah",
    "description": "Penghargaan Juara II dalam kompetisi lomba pidato yang diselenggarakan oleh OSIS dan MPK SMK Negeri Kiarapedes pada 11–16 November 2019 dalam rangka memperingati Maulid Nabi Muhammad SAW."
  },
  {
    "id": "ach-26",
    "title": "Juara Harapan II Pidato SMK Se-Purwakarta",
    "organization": "Dinas Pendidikan & SMKN Bojong",
    "year": "2019",
    "level": "Kabupaten/Kota",
    "description": "Penghargaan sebagai Juara Harapan II dalam kompetisi lomba pidato tingkat SMK se-Kabupaten Purwakarta pada Bulan Bahasa pada 3 Oktober 2019 di SMKN Bojong bertema \"Pembentukan Karakter Menghadapi Industri 4.0\"."
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
    "title": "Head Organizer WSC Governor Cup West Java",
    "organization": "CADISDIK West Java Region IV",
    "year": "2025",
    "level": "Provinsi",
    "description": "Awarded as Head of Committee for the West Java Governor Cup Stand Up Comedy Championship 2025 in conjunction with STIE Wikara's 25th Dies Natalis for high school students across Region IV with a 100% operational SLA."
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
    "title": "Winner Duta GenRe Purwakarta Regency",
    "organization": "DPPKB Purwakarta Regency",
    "year": "2023",
    "level": "Kabupaten/Kota",
    "description": "Awarded as the Winner of Duta Generasi Berencana (GenRe) Purwakarta Regency 2023; recognized for youth leadership, public communication, and adolescent future planning advocacy."
  },
  {
    "id": "ach-8",
    "title": "Jury Board Member UPPKA MSME Competition",
    "organization": "DPPKB Purwakarta Regency & Campaka District",
    "year": "2023",
    "level": "Kabupaten/Kota",
    "description": "Appointed as an independent judge for the Campaka District UPPKA MSME Competition on August 14, 2023; evaluated business model viability, product innovation, and digital marketing strategies."
  },
  {
    "id": "ach-9",
    "title": "Keynote Speaker Management EduFest Purwakarta",
    "organization": "Saduta Foundation & Edufest Purwakarta",
    "year": "2025",
    "level": "Kabupaten/Kota",
    "description": "Recognized for contributions as keynote speaker on Business Management at the Purwakarta Education Festival (Edufest) 2025 organized by Saduta Foundation on April 1, 2025."
  },
  {
    "id": "ach-10",
    "title": "Moderator Ministry of Finance Goes To Campus",
    "organization": "Ministry of Finance RI (KPKNL Purwakarta)",
    "year": "2023",
    "level": "Nasional",
    "description": "Honored as moderator for the Ministry of Finance Goes to Campus event in Purwakarta alongside vertical institutions (Customs KPPBC, Tax KPP Pratama, KPKNL, and Treasury KPPN)."
  },
  {
    "id": "ach-11",
    "title": "Steering Committee PKKMB STIE Wikara",
    "organization": "STIE Wibawa Karta Raharja",
    "year": "2025",
    "level": "Kampus",
    "description": "Appreciated for dedication as Steering Committee member for the 2025/2026 Freshmen Campus Orientation (PKKMB) themed 'Wikara Next Generation'."
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
    "title": "Master of Ceremony PORSA STIE Wikara",
    "organization": "STIE Wibawa Karta Raharja",
    "year": "2024",
    "level": "Kampus",
    "description": "Recognized for professional contributions as Master of Ceremony (MC) for the Student Sports Week (PORSA) at STIE Wibawa Karta Raharja on July 8, 2024."
  },
  {
    "id": "ach-14",
    "title": "Director of Tak Kasat Documentary Film",
    "organization": "KPPM STIE Wikara & Gunung Hejo Village",
    "year": "2025",
    "level": "Kampus",
    "description": "Awarded as Director of the documentary film 'Tak Kasat – Misteri Gunung Hejo' during the 2025 KPPM community outreach program in Gunung Hejo Village, Purwakarta."
  },
  {
    "id": "ach-15",
    "title": "Speaker Mini Seminar Entrepreneurship UKM KWU",
    "organization": "UKM KWU STIE Wikara",
    "year": "2024",
    "level": "Kampus",
    "description": "Appreciated as guest speaker for the 'Menggali Potensi Diri' Mini Seminar hosted by UKM Kewirausahaan on March 31, 2024 covering startup validation and market research."
  },
  {
    "id": "ach-16",
    "title": "Moderator Seminar Organizational Leadership Indonesia",
    "organization": "BEM STIE Wikara",
    "year": "2023",
    "level": "Kampus",
    "description": "Appreciated for moderating the 2023 Indonesian Organizational Leadership Seminar; facilitated dialogues on governance, conflict resolution, and accountability."
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
    "description": "Honored as the Best Freshman during the university new student admission and orientation program (PMB) for scholastic excellence, collaborative problem-solving, and exemplary leadership potential."
  },
  {
    "id": "ach-19",
    "title": "President of Student Executive Board (BEM)",
    "organization": "STIE Wibawa Karta Raharja",
    "year": "2025",
    "level": "Kampus",
    "description": "Honored for leadership as President/Chairman of the Student Executive Board (BEM) STIE Wikara for the 2025/2026 term; spearheaded strategic organizational programs and campus-wide governance."
  },
  {
    "id": "ach-20",
    "title": "Head of the Business Education UKM KWU",
    "organization": "UKM Kewirausahaan STIE Wikara",
    "year": "2024",
    "level": "Kampus",
    "description": "Awarded as Head of the Business Education in STIE Wikara Entrepreneurship Organization for the 2024–2025 term; led entrepreneurship education curricula and student venture incubation."
  },
  {
    "id": "ach-21",
    "title": "Keynote Speaker Seminar \"Berani Jadi Beda\"",
    "organization": "FOSTA Purwakarta",
    "year": "2024",
    "level": "Kabupaten/Kota",
    "description": "Recognized as speaker for the 'Berani Jadi Beda' Youth Seminar organized by FOSTA Purwakarta on July 4, 2024; delivered motivational talks on youth self-development."
  },
  {
    "id": "ach-22",
    "title": "Participant National Science Olympiad (OSN) Science",
    "organization": "Purwakarta Regency Education Office",
    "year": "2017",
    "level": "Kabupaten/Kota",
    "description": "Certificate of participation in the Regency-Level National Science Olympiad (OSN) for Natural Sciences at SMPN 2 Purwakarta on March 11, 2017."
  },
  {
    "id": "ach-23",
    "title": "Flag Hoisting Troop (PASKIBRA) Member 72nd Independence Day",
    "organization": "Kiarapedes District Committee",
    "year": "2017",
    "level": "Kecamatan",
    "description": "Honored as a member of the official Independence Day Flag Hoisting Troop (PASKIBRA) for Kiarapedes District on August 18, 2017."
  },
  {
    "id": "ach-24",
    "title": "1st Place Winner Speech Competition Youth Pledge Day",
    "organization": "OSIS & MPK SMKN Kiarapedes",
    "year": "2019",
    "level": "Sekolah",
    "description": "1st Place Winner in the Vocational Speech Competition for Youth Pledge Day on November 2, 2019 at SMKN Kiarapedes for persuasive rhetoric and public speaking."
  },
  {
    "id": "ach-25",
    "title": "2nd Place Winner Speech Competition Prophet's Birthday",
    "organization": "OSIS & MPK SMKN Kiarapedes",
    "year": "2019",
    "level": "Sekolah",
    "description": "2nd Place Winner in the Speech Competition commemorating the Prophet's Birthday on November 11–16, 2019 at SMKN Kiarapedes for structured delivery."
  },
  {
    "id": "ach-26",
    "title": "2nd Consolation Winner Regency Speech Competition",
    "organization": "Dinas Pendidikan & SMKN Bojong",
    "year": "2019",
    "level": "Kabupaten/Kota",
    "description": "2nd Consolation Winner (Juara Harapan II) in the Regency-Level Vocational Speech Competition for Language Month on October 3, 2019 at SMKN Bojong."
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



