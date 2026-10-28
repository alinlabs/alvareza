export interface SkillsData {
  soft: string[];
  hard: {
    category: string;
    items: string[];
  }[];
  tools: {
    name: string;
    category: string;
  }[];
  toolCategories?: {
    category: string;
    tools: string;
  }[];
}

export const skillsIn: SkillsData = {
  "soft": [
    "Kepemimpinan Eksekutif & Delegasi Tim: Mengelola 6 divisi kerja & 40+ staf dengan kejelasan struktur, ekspektasi, & akuntabilitas tinggi",
    "Pemikiran Analitis & Problem Solving: Identifikasi kendala & Root Cause Analysis yang memangkas bottleneck operasional sebesar 90%",
    "Komunikasi Strategis & Influencing B2B: Negosiasi tingkat tinggi dengan Pemilik Bisnis & Klien Korporat (Skor Kepuasan Klien / CSAT 98%)",
    "Perencanaan Proyek & Kontrol SLA: Eksekusi 100+ proyek komersial & residensial tepat waktu dengan On-Time Delivery Rate 95%",
    "Negosiasi Komersial & Resolusi Konflik: Mempertahankan 10+ akun korporat utama & memelihara iklim kerja lintas divisi yang harmonis",
    "Resiliensi Operasional & Manajemen Krisis: Menangani kendala lapangan, instalasi & tenggat ketat proyek secara adekuat dan profesional",
    "Pembimbingan Talenta & Development Mindset: Membimbing potensi tim melalui coaching berkala & pengembangan standar kompetensi (HR Certified)",
    "Adaptabilitas Strategis & Orientasi Efisiensi: Menyelaraskan visi pemilik bisnis ke dalam KPI terukur, efisiensi biaya (+15%) & eksekusi taktis"
  ],
  "hard": [
    {
      "category": "Hukum Ketenagakerjaan & Hubungan Industrial",
      "items": [
        "Regulasi UU 13/2003, UU Cipta Kerja 6/2023, PP 35/2021 (PKWT/PKWTT, Outsourcing, PHK, Pesangon), PP 36/2021 & PP 51/2023 (Upah); Penyusunan PP/PKB, Bipartit/Tripartit, SOP Personalia, SP 1/2/3, serta Pelaporan Kemenaker (WLKP, E-PP & PKB, PPHI, Teman K3, TKA Online, Karirhub)."
      ]
    },
    {
      "category": "Kompensasi & Benefit, Payroll, BPJS & PPh 21",
      "items": [
        "Kalkulasi PPh 21 TER (A/B/C PP 58/2023 & PMK 168/2023) & Pasal 17 via DJP Online (e-Bupot); 5 program BPJSTK (JKK, JKM, JHT, JP, JKP) via SIPP Online & BPJS Kesehatan via EDABU; lembur Depnaker 1/173; Struktur & Skala Upah (Permenaker 1/2017); THR & payroll digital bebas selisih."
      ]
    },
    {
      "category": "Rekrutmen End-to-End, HRIS & Performance Management",
      "items": [
        "Manpower Planning (MPP), sourcing multi-saluran, screening, psikotes, wawancara BEI, offering & onboarding; Candidate Background Checking (PDDikti, SIVIL, BNSP, SLIK OJK, Dukcapil, DJP Online, SKCK, SIPP MA, STR/SIP); KPI/OKR appraisal; implementasi HRIS/ATS HR Matrix & Talenty (WhatsApp/Email auto-alert)."
      ]
    },
    {
      "category": "Shift Management & HR Operations",
      "items": [
        "Manajemen roster multi-shift, presensi geo-tagging, over-shift, kontrol jam kerja, standardisasi workflow personalia, dan kepatuhan operasional naker."
      ]
    },
    {
      "category": "Manajemen Operasional, SOP & SLA",
      "items": [
        "Penyusunan & audit 20+ SOP, monitoring SLA, manajemen aset fasilitas (Aset+), logistik, dan mitigasi risiko; supervisi 100+ proyek dengan On-Time Delivery 95% dan CSAT 98%."
      ]
    },
    {
      "category": "B2B Sales, Account Management & CRM",
      "items": [
        "B2B sales & market intelligence, key account management, CRM NextMark, proposal komersial, dan pitching kemitraan; pengelolaan database 4.000+ korporasi (5.200+ kontak PIC)."
      ]
    },
    {
      "category": "Keuangan, Akuntansi, HPP & Cost Control",
      "items": [
        "General ledger, jurnal, arus kas, laba rugi, kalkulasi HPP/COGS otomatis, budgeting, rekonsiliasi kas/billing 2.000+ klien, dan cost control operasional (+15% efisiensi)."
      ]
    },
    {
      "category": "Project Management",
      "items": [
        "Project management end-to-end (scope, timeline, resource, milestone, QC, reporting); supervisi 100+ proyek komersial/residensial serta deployment sistem web Logistor App."
      ]
    },
    {
      "category": "ERP/CRM, Automation & Business Intelligence",
      "items": [
        "Implementasi HRIS, ERP Logistor, CRM NextMark, otomasi Google Workspace/Apps Script, integrasi AI workflow, database MySQL, dan dashboard BI Looker Studio."
      ]
    },
    {
      "category": "Retail, POS & Multi-Branch Operations",
      "items": [
        "Operasional 13 gerai ritel, supervisi 40+ staf, sistem POS, shift roster, inventory control, cash handling, pencegahan shrinkage, dan audit kepatuhan cabang."
      ]
    },
    {
      "category": "Digital Marketing & E-Commerce Operations",
      "items": [
        "Performance marketing (Meta Ads, Google Ads, TikTok Ads), pengelolaan marketplace (Shopee, Tokopedia, TikTok Shop), lead nurturing WhatsApp CRM, dan optimasi ROAS."
      ]
    },
    {
      "category": "Pelaporan Kelembagaan & Regulasi Pemerintah (HR & GA Compliance)",
      "items": [
        "Pelaporan instansi HR & GA: Kemenaker (WLKP, E-PP & PKB, PPHI, Teman K3 P2K3, TKA Online RPTKA, Karirhub); BPJSTK (SIPP); EDABU (BPJS Kes); DJP Online (e-Bupot PPh 21, KSWP); OSS-RBA (LKPM BKPM); SIMPEL KLHK; Festronik (Limbah B3); SIMBG PUPR (PBG/SLF); dan Pajak Daerah (Bapenda)."
      ]
    },
    {
      "category": "Background Checking Rekrutmen & Verifikasi Kredensial",
      "items": [
        "Protokol Candidate Due Diligence & Background Checking: Verifikasi Ijazah (PDDikti & SIVIL), Lisensi BNSP, SLIK OJK (iDebku), Cek KTP Dukcapil, Pajak DJP Online (KSWP/NPWP), SKCK Online Polri, Penelusuran Perkara SIPP Mahkamah Agung, dan STR/SIP Kemenkes."
      ]
    },
    {
      "category": "Administrasi Perkantoran, Data Entry & Pengetikan Cepat (Fast Typing)",
      "items": [
        "Kecepatan pengetikan cepat 72 WPM dengan akurasi 98% (10-Finger Touch Typing), input data cepat & presisi, digital document archiving, penyusunan korespondensi resmi, transkripsi notula rapat, serta tata kelola administrasi perkantoran bebas kesalahan."
      ]
    }
  ],
  "tools": [
    {
      "name": "Kemenaker (WLKP - Wajib Lapor Ketenagakerjaan Perusahaan)",
      "category": "HR & Government"
    },
    {
      "name": "BPJSTK (SIPP - Sistem Informasi Pelaporan Peserta)",
      "category": "HR & Government"
    },
    {
      "name": "EDABU (BPJS Kesehatan Badan Usaha)",
      "category": "HR & Government"
    },
    {
      "name": "DJP Online Pajak (e-Bupot PPh 21, e-Filing & KSWP)",
      "category": "Government & Tax"
    },
    {
      "name": "E-PP & PKB Kemenaker (Pengesahan PP & PKB)",
      "category": "HR & Government"
    },
    {
      "name": "Teman K3 Kemenaker (Pelaporan P2K3 & Norma K3)",
      "category": "HR & Government"
    },
    {
      "name": "TKA Online Kemenaker (RPTKA Tenaga Kerja Asing)",
      "category": "HR & Government"
    },
    {
      "name": "Karirhub (SIAPkerja Kemenaker)",
      "category": "HR & Government"
    },
    {
      "name": "PPHI Kemenaker (Perselisihan Hubungan Industrial)",
      "category": "HR & Government"
    },
    {
      "name": "OSS-RBA BKPM (Laporan LKPM Penanaman Modal)",
      "category": "GA & Compliance"
    },
    {
      "name": "SIMPEL KLHK (Pelaporan Lingkungan Hidup)",
      "category": "GA & Compliance"
    },
    {
      "name": "Festronik KLHK (Manifest Elektronik Limbah B3)",
      "category": "GA & Compliance"
    },
    {
      "name": "SIMBG PUPR (Persetujuan Bangunan Gedung / PBG & SLF)",
      "category": "GA & Compliance"
    },
    {
      "name": "Pajak Daerah Bapenda (Reklame, Air Tanah, PBB-P2)",
      "category": "GA & Compliance"
    },
    {
      "name": "PDDikti & SIVIL (Verifikasi Ijazah & Pendidikan Tinggi)",
      "category": "Recruitment Verification"
    },
    {
      "name": "Sertifikasi BNSP (bnsp.go.id - Cek Lisensi Profesi)",
      "category": "Recruitment Verification"
    },
    {
      "name": "SLIK OJK iDebku (Background Checking Finansial & Kredit)",
      "category": "Recruitment Verification"
    },
    {
      "name": "Cek KTP Dukcapil (Validasi NIK & Kependudukan)",
      "category": "Recruitment Verification"
    },
    {
      "name": "SKCK Online Polri (Pemeriksaan Catatan Kepolisian)",
      "category": "Recruitment Verification"
    },
    {
      "name": "SIPP Mahkamah Agung (Penelusuran Perkara Hukum PN/PHI/MA)",
      "category": "Recruitment Verification"
    },
    {
      "name": "STR / SIP Kemenkes (Verifikasi Izin Praktik Medis)",
      "category": "Recruitment Verification"
    },
    {
      "name": "10-Finger Touch Typing (72 WPM, Akurasi 98%)",
      "category": "Productivity"
    },
    {
      "name": "Fast Data Entry & Document Transcription Engine",
      "category": "Administration"
    },
    {
      "name": "HRMatriks (Web/PWA HRIS & GA Integrated Platform)",
      "category": "Human Resources"
    },
    {
      "name": "Talenty (End-to-End People Development & Assessment Platform)",
      "category": "Human Resources"
    },
    {
      "name": "Custom ATS Web/PWA (WA & Email Automated Alert)",
      "category": "Human Resources"
    },
    {
      "name": "Digital Payroll & Slip Gaji Online System",
      "category": "Human Resources"
    },
    {
      "name": "Kalkulator BPJS Ketenagakerjaan (5 Program: JKK 5 Risiko, JHT, JKM, JP, JKP) & BPJS Kesehatan",
      "category": "Human Resources"
    },
    {
      "name": "Kalkulator Pajak PPh 21 TER (A/B/C PP 58/2023) & Progresif Pasal 17",
      "category": "Human Resources"
    },
    {
      "name": "Performance KPI Matrix Appraisal (Job Desk & Absensi)",
      "category": "Human Resources"
    },
    {
      "name": "Presensi Digital QR Code & GPS Geo-Fencing System",
      "category": "Human Resources"
    },
    {
      "name": "Portal Tes & Ujian Online Mandiri Kandidat",
      "category": "Human Resources"
    },
    {
      "name": "Sistem Monitoring Aset & Inventaris Karyawan GA",
      "category": "Human Resources"
    },
    {
      "name": "Logistor App (PM & Supply Chain Tracking)",
      "category": "Operations"
    },
    {
      "name": "MyDiby POS (13 Outlets Retail Chain)",
      "category": "Operations"
    },
    {
      "name": "Standardized SOP & Workflow Hub",
      "category": "Operations"
    },
    {
      "name": "Google Maps Route Planning & Logistics Dispatch",
      "category": "Operations"
    },
    {
      "name": "Trello & Notion Kanban Workspaces",
      "category": "Operations"
    },
    {
      "name": "NextMark CRM (B2B Enterprise Lead Pipeline)",
      "category": "B2B Sales"
    },
    {
      "name": "WhatsApp Business API & Customer Care Desk",
      "category": "B2B Sales"
    },
    {
      "name": "Direktori Intelijen Pasar B2B (4.000+ Profil Perusahaan)",
      "category": "B2B Sales"
    },
    {
      "name": "Accurate & Mekari Jurnal Accounting",
      "category": "Finance"
    },
    {
      "name": "Spreadsheet Financial Ledger & COGS HPP Engine",
      "category": "Finance"
    },
    {
      "name": "Google Workspace (Docs, Sheets, Drive, Forms, Meet)",
      "category": "Productivity"
    },
    {
      "name": "Google Apps Script & Webhook Automation",
      "category": "Automation"
    },
    {
      "name": "AI Workflow & Prompt Engineering (Gemini API / ChatGPT)",
      "category": "AI Integration"
    },
    {
      "name": "Looker Studio Executive BI Dashboard",
      "category": "Analytics"
    },
    {
      "name": "MySQL & Enterprise Database Administration",
      "category": "Database"
    },
    {
      "name": "Meta Ads Manager & Business Suite",
      "category": "Advertising"
    },
    {
      "name": "Google Ads & Search Marketing",
      "category": "Advertising"
    },
    {
      "name": "TikTok Ads Manager & Marketplace Seller Center",
      "category": "Advertising"
    },
    {
      "name": "Figma (UI/UX Wireframing & Prototyping)",
      "category": "Design"
    },
    {
      "name": "Canva Pro & Visual Branding Graphics",
      "category": "Design"
    },
    {
      "name": "CapCut & Premiere Pro (Video Production)",
      "category": "Creative"
    },
    {
      "name": "React, TypeScript & Modern Web Stack",
      "category": "Development"
    },
    {
      "name": "Progressive Web Apps (PWA) & Service Workers",
      "category": "Development"
    },
    {
      "name": "Laravel Framework & PHP Engine",
      "category": "Development"
    },
    {
      "name": "Cloudflare & Firebase Hosting",
      "category": "Cloud Infrastructure"
    }
  ],
  "toolCategories": [
    {
      "category": "Human Resources (HR), Payroll & HRIS",
      "tools": "HRMatriks (HRIS & GA Platform), Talenty (People Development & Assessment Platform), Custom ATS, Digital Payroll, Kalkulator Pajak PPh 21 & BPJS, Performance KPI Matrix, Presensi Digital QR & Geofencing, Pelaporan Kemenaker (WLKP), BPJSTK (SIPP), EDABU (BPJS Kes), DJP Online Pajak, Background Checking (PDDikti, SIVIL, BNSP, SLIK OJK iDebku, Dukcapil, SKCK, SIPP MA, STR Kemenkes)"
    },
    {
      "category": "Manajemen Operasional, Proyek & Rantai Pasok",
      "tools": "Logistor App, MyDiby POS Ritel, Google Maps Route Planning, SOP & Workflows Hub, Trello & Notion"
    },
    {
      "category": "B2B CRM, Sales Pipeline & Komunikasi Bisnis",
      "tools": "NextMark CRM, WhatsApp Business API, Direktori Intelijen Pasar B2B"
    },
    {
      "category": "Keuangan, Akuntansi & General Ledger",
      "tools": "Accurate Accounting, Mekari Jurnal, Spreadsheet Accounting (Kalkulator HPP, Cash Flow, Laba Rugi), Sistem Rekonsiliasi Tagihan BPSPAMS"
    },
    {
      "category": "Otomasi AI, Workspace & Integrasi Workflow",
      "tools": "Google Workspace, Google Apps Script, Gemini API, ChatGPT, Make / Zapier, REST API Integration"
    },
    {
      "category": "Data Analytics & Executive Reporting",
      "tools": "Looker Studio (Executive BI Dashboard), MySQL Database, Advanced Google Sheets & Pivot Analytics"
    },
    {
      "category": "Digital Advertising & E-Commerce Multi-Channel",
      "tools": "Meta Ads Manager, Google Ads, TikTok Ads Manager, Shopee & Tokopedia Seller Center, TikTok Shop"
    },
    {
      "category": "Desain Grafis, Media Kreatif & UI/UX",
      "tools": "Figma (UI/UX), Canva Pro, Adobe Photoshop, CapCut, Adobe Premiere Pro"
    },
    {
      "category": "Web Stack Modern, PWA & Cloud Infrastructure",
      "tools": "React, TypeScript, Progressive Web Apps (PWA), Laravel & PHP, Cloudflare, Firebase Hosting, WordPress"
    },
    {
      "category": "Pelaporan Lembaga Pemerintah (HR & GA Compliance)",
      "tools": "Kemenaker (WLKP), BPJSTK (SIPP), EDABU (BPJS Kes), DJP Online Pajak, E-PP & PKB, Teman K3 (P2K3), TKA Online (RPTKA), Karirhub (SIAPkerja), PPHI (Hub Industrial), OSS RBA (LKPM), SIMPEL KLHK, Festronik (Limbah B3), SIMBG PUPR (PBG/SLF), Pajak Daerah (Bapenda)"
    },
    {
      "category": "Background Checking Rekrutmen & Verifikasi Kredensial",
      "tools": "PDDikti & SIVIL (Ijazah Pendidikan Tinggi), Cek Sertifikasi BNSP, SLIK OJK (iDebku), Cek KTP Dukcapil, DJP Online Pajak (Validasi NPWP & KSWP), SKCK Online Polri, SIPP Mahkamah Agung (PN/PHI/MA), STR / SIP Kemenkes (SatuSehat SDMK)"
    },
    {
      "category": "Administrasi Perkantoran, Kearsipan & Pengetikan Cepat",
      "tools": "10-Finger Touch Typing (72 WPM, Akurasi 98%), Google Workspace (Docs, Sheets), Microsoft Office 365, Manajemen Kearsipan Digital, Input Data Cepat Bebas Selisih, Transkripsi Notula Rapat"
    }
  ]
};

export const skillsEn: SkillsData = {
  "soft": [
    "Executive Leadership & Team Delegation: Managing 6 cross-functional divisions & 40+ staff with clear structure, expectations, & high accountability",
    "Analytical Thinking & Problem Solving: Issue identification & Root Cause Analysis reducing operational bottlenecks by 90%",
    "Strategic Communication & B2B Stakeholder Influence: High-level negotiation with Business Owners & Corporate Clients (98% Client CSAT)",
    "Project Planning & SLA Execution: Executing 100+ commercial & residential projects on schedule with 95% On-Time Delivery Rate",
    "Commercial Negotiation & Conflict Resolution: Retaining 10+ key corporate accounts & fostering a cohesive cross-functional work culture",
    "Operational Resilience & Crisis Management: Resolving field constraints, installation hurdles, & tight commercial deadlines professionally",
    "Talent Coaching & Development Mindset: Mentoring team potential through structured coaching & competency standards (HR Certified)",
    "Strategic Adaptability & Efficiency Focus: Aligning owner vision into measurable KPIs, cost efficiency (+15%), & tactical execution"
  ],
  "hard": [
    {
      "category": "Labor Law & Industrial Relations",
      "items": [
        "Indonesian Labor Law (Law 13/2003, Job Creation Law 6/2023, GR 35/2021 on PKWT/PKWTT, Outsourcing, Severance, GR 36/2021 & GR 51/2023 on Wages); Company Regulations (PP/PKB), Bipartite/Tripartite negotiations, HR SOPs, Disciplinary notices (SP 1/2/3), and Kemenaker reporting (WLKP, E-PP & PKB, PPHI, Teman K3, TKA Online, Karirhub)."
      ]
    },
    {
      "category": "Compensation & Benefits, Payroll, BPJS & PPh 21 Tax",
      "items": [
        "PPh 21 TER tax formulas (Categories A/B/C GR 58/2023 & MoF 168/2023) & Article 17 via DJP Online (e-Bupot); 5 programs of BPJS Employment via SIPP Online & BPJS Healthcare via EDABU; statutory 1/173 overtime; Wage Structures & Scales (Permenaker 1/2017); religious holiday bonus (THR) & zero-discrepancy digital payroll."
      ]
    },
    {
      "category": "End-to-End Recruitment, HRIS & Performance Management",
      "items": [
        "Manpower Planning (MPP), multi-channel sourcing, screening, psychometric testing, BEI interviews, offering & onboarding; Candidate Background Checks (PDDikti, SIVIL, BNSP, SLIK OJK, Dukcapil, DJP Online, SKCK, Supreme Court SIPP, STR/SIP); KPI/OKR frameworks; HRIS/ATS HR Matrix & Talenty implementation."
      ]
    },
    {
      "category": "Shift Management & HR Operations",
      "items": [
        "Multi-shift roster management, geo-attendance tracking, over-shift controls, personnel workflow standardization, and statutory labor operational compliance."
      ]
    },
    {
      "category": "Operations Management, SOP & SLA",
      "items": [
        "Development & auditing of 20+ operational SOPs, SLA monitoring, facility asset management (Aset+), logistics, and risk mitigation; supervision of 100+ projects with 95% On-Time Delivery and 98% CSAT."
      ]
    },
    {
      "category": "B2B Sales, Account Management & CRM",
      "items": [
        "B2B sales & market intelligence, key account management, NextMark CRM, commercial proposals, and partnership pitching; administration of 4,000+ corporate accounts (5,200+ decision makers)."
      ]
    },
    {
      "category": "Finance, Accounting, COGS & Cost Control",
      "items": [
        "General ledger, journals, cash flow, P&L, automated COGS/HPP calculations, budgeting, utility billing reconciliation for 2,000+ clients, and operational cost control (+15% efficiency)."
      ]
    },
    {
      "category": "Project Management",
      "items": [
        "End-to-end project management (scope, timeline, resources, milestones, QC, reporting); supervision of 100+ commercial/residential projects and Logistor App deployment."
      ]
    },
    {
      "category": "ERP/CRM, Automation & Business Intelligence",
      "items": [
        "Implementation of HRIS, Logistor ERP, NextMark CRM, Google Workspace/Apps Script automation, AI workflow integration, MySQL database, and Looker Studio executive BI dashboards."
      ]
    },
    {
      "category": "Retail, POS & Multi-Branch Operations",
      "items": [
        "Operations of 13 retail stores, supervision of 40+ staff, POS systems, shift rosters, inventory control, cash handling, shrinkage prevention, and store compliance auditing."
      ]
    },
    {
      "category": "Digital Marketing & E-Commerce Operations",
      "items": [
        "Performance marketing (Meta Ads, Google Ads, TikTok Ads), marketplace management (Shopee, Tokopedia, TikTok Shop), WhatsApp CRM lead nurturing, and ROAS optimization."
      ]
    },
    {
      "category": "Government & Institutional Compliance (HR & GA Reporting)",
      "items": [
        "Statutory institutional reporting for HR & GA: Kemenaker (WLKP, E-PP & PKB, PPHI, Teman K3 P2K3, TKA Online RPTKA, Karirhub); BPJSTK (SIPP); EDABU (BPJS Healthcare); DJP Online (e-Bupot PPh 21, KSWP); OSS-RBA (BKPM LKPM); SIMPEL KLHK; Festronik (B3 Waste); SIMBG PUPR (PBG/SLF); and Regional Tax (Bapenda)."
      ]
    },
    {
      "category": "Recruitment Background Checking & Credential Verification",
      "items": [
        "Candidate Due Diligence & Background Verification Protocols: Degree validation (PDDikti & SIVIL), BNSP credentials, SLIK OJK (iDebku credit bureau), Dukcapil National ID, DJP Online tax status, SKCK Online police clearance, Supreme Court SIPP litigation records, and Kemenkes STR/SIP medical licenses."
      ]
    },
    {
      "category": "Office Administration, Data Entry & Fast Touch Typing",
      "items": [
        "High-speed touch typing at 72 WPM with 98% accuracy (10-Finger Blind Typing), rapid & error-free data entry, digital document archiving, official executive correspondence, meeting minutes transcription, and clerical workflow administration."
      ]
    }
  ],
  "tools": [
    {
      "name": "Kemenaker (WLKP - Mandatory Company Employment Reporting)",
      "category": "HR & Government"
    },
    {
      "name": "BPJSTK (SIPP - Employee Registration & Wage System)",
      "category": "HR & Government"
    },
    {
      "name": "EDABU (BPJS Healthcare Corporate Portal)",
      "category": "HR & Government"
    },
    {
      "name": "DJP Online Tax (e-Bupot PPh 21, e-Filing & KSWP)",
      "category": "Government & Tax"
    },
    {
      "name": "E-PP & PKB Kemenaker (Company Regulations & CLA Legalization)",
      "category": "HR & Government"
    },
    {
      "name": "Teman K3 Kemenaker (P2K3 Safety Committee Reporting)",
      "category": "HR & Government"
    },
    {
      "name": "TKA Online Kemenaker (RPTKA Expatriate Work Permits)",
      "category": "HR & Government"
    },
    {
      "name": "Karirhub (SIAPkerja Kemenaker Vacancy Portal)",
      "category": "HR & Government"
    },
    {
      "name": "PPHI Kemenaker (Industrial Relations Dispute Resolution)",
      "category": "HR & Government"
    },
    {
      "name": "OSS-RBA BKPM (LKPM Capital Investment Reporting)",
      "category": "GA & Compliance"
    },
    {
      "name": "SIMPEL KLHK (Environmental Compliance Reporting)",
      "category": "GA & Compliance"
    },
    {
      "name": "Festronik KLHK (Electronic Hazardous B3 Waste Manifest)",
      "category": "GA & Compliance"
    },
    {
      "name": "SIMBG PUPR (PBG Building Approval & SLF Licensing)",
      "category": "GA & Compliance"
    },
    {
      "name": "Regional Tax Bapenda (Advertising, Groundwater, Property Tax)",
      "category": "GA & Compliance"
    },
    {
      "name": "PDDikti & SIVIL (Higher Education Degree & Academic Verification)",
      "category": "Recruitment Verification"
    },
    {
      "name": "BNSP Certification Registry (bnsp.go.id - Competency Check)",
      "category": "Recruitment Verification"
    },
    {
      "name": "SLIK OJK iDebku (Credit History & Financial Screening)",
      "category": "Recruitment Verification"
    },
    {
      "name": "Dukcapil National Registry (NIK & Civil ID Verification)",
      "category": "Recruitment Verification"
    },
    {
      "name": "SKCK Online National Police (Criminal Background Check)",
      "category": "Recruitment Verification"
    },
    {
      "name": "Supreme Court SIPP (Civil, Criminal & Labor Court Litigation Search)",
      "category": "Recruitment Verification"
    },
    {
      "name": "Kemenkes STR / SIP (Healthcare Professional License Verification)",
      "category": "Recruitment Verification"
    },
    {
      "name": "10-Finger Touch Typing (72 WPM, 98% Accuracy)",
      "category": "Productivity"
    },
    {
      "name": "Fast Data Entry & Document Transcription Engine",
      "category": "Administration"
    },
    {
      "name": "HRMatriks (Web/PWA HRIS & GA Integrated Platform)",
      "category": "Human Resources"
    },
    {
      "name": "Talenty (End-to-End People Development & Assessment Platform)",
      "category": "Human Resources"
    },
    {
      "name": "Custom ATS Web/PWA (WA & Email Automated Alert)",
      "category": "Human Resources"
    },
    {
      "name": "Digital Payroll & Slip Gaji Online System",
      "category": "Human Resources"
    },
    {
      "name": "BPJS Employment Calculator (5 Programs: JKK 5 Tiers, JHT, JKM, JP, JKP) & Healthcare",
      "category": "Human Resources"
    },
    {
      "name": "Income Tax PPh 21 TER (A/B/C GR 58/2023) & Progressive Rates",
      "category": "Human Resources"
    },
    {
      "name": "Performance KPI Matrix Appraisal (Job Description & Attendance)",
      "category": "Human Resources"
    },
    {
      "name": "Digital QR Code & GPS Geo-Fencing Attendance System",
      "category": "Human Resources"
    },
    {
      "name": "Self-Administered Online Candidate Testing Portal",
      "category": "Human Resources"
    },
    {
      "name": "GA Employee Asset & Equipment Tracking System",
      "category": "Human Resources"
    },
    {
      "name": "Logistor App (PM & Supply Chain Tracking)",
      "category": "Operations"
    },
    {
      "name": "MyDiby POS (13 Outlets Retail Chain)",
      "category": "Operations"
    },
    {
      "name": "Standardized SOP & Workflow Hub",
      "category": "Operations"
    },
    {
      "name": "Google Maps Route Planning & Logistics Dispatch",
      "category": "Operations"
    },
    {
      "name": "Trello & Notion Kanban Workspaces",
      "category": "Operations"
    },
    {
      "name": "NextMark CRM (B2B Enterprise Lead Pipeline)",
      "category": "B2B Sales"
    },
    {
      "name": "WhatsApp Business API & Customer Care Desk",
      "category": "B2B Sales"
    },
    {
      "name": "B2B Market Intelligence Directory (4,000+ Corporate Profiles)",
      "category": "B2B Sales"
    },
    {
      "name": "Accurate & Mekari Jurnal Accounting",
      "category": "Finance"
    },
    {
      "name": "Spreadsheet Financial Ledger & COGS HPP Engine",
      "category": "Finance"
    },
    {
      "name": "Google Workspace (Docs, Sheets, Drive, Forms, Meet)",
      "category": "Productivity"
    },
    {
      "name": "Google Apps Script & Webhook Automation",
      "category": "Automation"
    },
    {
      "name": "AI Workflow & Prompt Engineering (Gemini API / ChatGPT)",
      "category": "AI Integration"
    },
    {
      "name": "Looker Studio Executive BI Dashboard",
      "category": "Analytics"
    },
    {
      "name": "MySQL & Enterprise Database Administration",
      "category": "Database"
    },
    {
      "name": "Meta Ads Manager & Business Suite",
      "category": "Advertising"
    },
    {
      "name": "Google Ads & Search Marketing",
      "category": "Advertising"
    },
    {
      "name": "TikTok Ads Manager & Marketplace Seller Center",
      "category": "Advertising"
    },
    {
      "name": "Figma (UI/UX Wireframing & Prototyping)",
      "category": "Design"
    },
    {
      "name": "Canva Pro & Visual Branding Graphics",
      "category": "Design"
    },
    {
      "name": "CapCut & Premiere Pro (Video Production)",
      "category": "Creative"
    },
    {
      "name": "React, TypeScript & Modern Web Stack",
      "category": "Development"
    },
    {
      "name": "Progressive Web Apps (PWA) & Service Workers",
      "category": "Development"
    },
    {
      "name": "Laravel Framework & PHP Engine",
      "category": "Development"
    },
    {
      "name": "Cloudflare & Firebase Hosting",
      "category": "Cloud Infrastructure"
    }
  ],
  "toolCategories": [
    {
      "category": "Human Resources (HR), Payroll & HRIS",
      "tools": "HRMatriks (HRIS & GA Platform), Talenty (People Development & Assessment Platform), Custom ATS, Digital Payroll, PPh 21 Tax & BPJS Calculator, Performance KPI Matrix, Digital QR & Geofencing Attendance, Government Reporting (Kemenaker WLKP, BPJSTK SIPP, EDABU BPJS Kes, DJP Online), Background Checking (PDDikti, SIVIL, BNSP, SLIK OJK iDebku, Dukcapil, SKCK, SIPP MA, STR Kemenkes)"
    },
    {
      "category": "Operations Management, Projects & Supply Chain",
      "tools": "Logistor App, MyDiby Retail POS, Google Maps Route Planning, SOP & Workflows Hub, Trello & Notion"
    },
    {
      "category": "B2B Enterprise CRM, Sales Pipeline & Communications",
      "tools": "NextMark CRM, WhatsApp Business API, B2B Market Intelligence Directory"
    },
    {
      "category": "Finance, Accounting & General Ledger",
      "tools": "Accurate Accounting, Mekari Jurnal, Spreadsheet Accounting (COGS, Cash Flow, P&L), BPSPAMS Utility Billing System"
    },
    {
      "category": "AI Automation, Workspace & Workflow Integration",
      "tools": "Google Workspace, Google Apps Script, Gemini API, ChatGPT, Make / Zapier, REST API Integration"
    },
    {
      "category": "Data Analytics & Executive Reporting",
      "tools": "Looker Studio (Executive BI Dashboard), MySQL Database, Advanced Google Sheets & Pivot Analytics"
    },
    {
      "category": "Digital Advertising & Multi-Channel E-Commerce",
      "tools": "Meta Ads Manager, Google Ads, TikTok Ads Manager, Shopee & Tokopedia Seller Center, TikTok Shop"
    },
    {
      "category": "Graphic Design, Creative Media & UI/UX",
      "tools": "Figma (UI/UX), Canva Pro, Adobe Photoshop, CapCut, Adobe Premiere Pro"
    },
    {
      "category": "Modern Web Stack, PWA & Cloud Infrastructure",
      "tools": "React, TypeScript, Progressive Web Apps (PWA), Laravel & PHP, Cloudflare, Firebase Hosting, WordPress"
    },
    {
      "category": "Government Institutional Reporting (HR & GA Compliance)",
      "tools": "Kemenaker (WLKP), BPJSTK (SIPP), EDABU (BPJS Healthcare), DJP Online Tax, E-PP & PKB, Teman K3 (P2K3), TKA Online (RPTKA), Karirhub (SIAPkerja), PPHI (Industrial Relations), OSS RBA (LKPM), SIMPEL KLHK, Festronik (B3 Waste), SIMBG PUPR (PBG/SLF), Regional Tax (Bapenda)"
    },
    {
      "category": "Recruitment Background Checking & Credential Verification",
      "tools": "Degree Verification (PDDikti & SIVIL), BNSP Certification Registry, SLIK OJK (iDebku Credit Bureau), Dukcapil National ID Verification, DJP Online Tax Validation, SKCK Online National Police, Supreme Court SIPP (Civil/Criminal/Labor Courts), Kemenkes STR / SIP License"
    },
    {
      "category": "Office Administration, Archiving & Fast Touch Typing",
      "tools": "10-Finger Touch Typing (72 WPM, 98% Accuracy), Google Workspace (Docs, Sheets), Microsoft Office 365, Digital Archiving, High-Speed Data Entry, Meeting Minutes Transcription"
    }
  ]
};

export const skillsId = skillsIn;

export const skills = {
  in: skillsIn,
  id: skillsIn,
  en: skillsEn,
};


