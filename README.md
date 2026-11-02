# 📄 ANALISIS SISTEM MENYELURUH & DOKUMENTASI LENGKAP PLATFORM "MYCIVY"
**ATS-Friendly Professional CV Generator, Dynamic Preset Engine, Standardized Full-Page PDF View, Short Link Obfuscation & Multi-Channel Admin Workspace**

---

## 📌 1. RINGKASAN EKSEKUTIF & IDENTITAS PLATFORM

**MyCivy** adalah platform aplikasi web canggih (*Single Page Application* berkinerja tinggi berbasis React 19, TypeScript, dan Vite 6) yang dirancang secara terpadu sebagai:
1. **Pembangun & Penyesuai Resume ATS-Compliant (Applicant Tracking System)** berstandar internasional yang sangat presisi, dinamis, dan terstruktur.
2. **Hub Dokumen Portofolio, Sertifikasi, dan Akademik Terverifikasi** dengan engine rendering PDF vektor murni, mode cetak fleksibel (BW vs. Warna), serta kompresi cerdas.
3. **Pusat Navigasi & Peta Tautan (Mindmap & Direct Link Engine)** yang menghasilkan URL terparameterisasi dengan sistem **Short Link Obfuscation** untuk menjaga privasi dokumen.
4. **Ruang Kerja Admin & Job Application Dispatcher** terintegrasi dengan Google Apps Script (GAS) untuk pengiriman berkas lamaran kerja, pelacakan draft, dan instalasi PWA (*Progressive Web App*).

Platform ini menyajikan profil karir profesional eksekutif **Alvareza Hilka Pratama, S.IP** secara kontekstual, terukur, dan adaptif terhadap lebih dari **75 posisi jabatan spesifik (LinkedIn-relevant)** di berbagai klaster industri (Manajemen Operasional, SDM/HR, PMO/Manajemen Proyek, Rantai Pasok/Logistik, Business Development & B2B, Pemasaran Digital, hingga Rekayasa Perangkat Lunak).

---

## 🏗️ 2. ARSITEKTUR TEKNOLOGI & SPESIFIKASI STACK

Platform ini dibangun di atas infrastruktur modern tanpa dependensi berat yang memperlambat browser:

```
                  ┌─────────────────────────────────────────────────────────┐
                  │                 React 19 + TypeScript                   │
                  │                (Vite 6 Single Page App)                 │
                  └────────────────────────────┬────────────────────────────┘
                                               │
             ┌─────────────────────────────────┼─────────────────────────────────┐
             ▼                                 ▼                                 ▼
   ┌───────────────────┐             ┌───────────────────┐             ┌───────────────────┐
   │ Language Context  │             │ Short Link Codec  │             │ Tailwind CSS v4   │
   │ (Bilingual ID/EN) │             │ (Auto-Correction) │             │ (Lucide + Motion) │
   └─────────┬─────────┘             └─────────┬─────────┘             └─────────┬─────────┘
             │                                 │                                 │
             ├─────────────────────────────────┼─────────────────────────────────┤
             ▼                                 ▼                                 ▼
   ┌───────────────────┐             ┌───────────────────┐             ┌───────────────────┐
   │ Full-View Router  │             │ Admin Workspace   │             │ PWA Engine        │
   │ (/prev & /preview)│             │ (/sr?pg=adm)      │             │ (beforeinstall)   │
   └─────────┬─────────┘             └─────────┬─────────┘             └─────────┬─────────┘
             │                                 │                                 │
             ├─────────────────────────────────┼─────────────────────────────────┤
             ▼                                 ▼                                 ▼
   ┌───────────────────┐             ┌───────────────────┐             ┌───────────────────┐
   │ Vector PDF Engine │             │ Direct Link Hub   │             │ GAS Integration   │
   │ (jsPDF + ATS Safe)│             │ (Peta Links Modal)│             │ (Email Dispatch)  │
   └─────────┬─────────┘             └─────────┬─────────┘             └─────────┬─────────┘
             │                                 │                                 │
             └─────────────────────────────────┴─────────────────────────────────┘
```

### 🧩 Rincian Komponen Teknologi:
- **Framework Inti**: React 19 (Hooks, Context, Memoized Selectors) & TypeScript 5 (Strict Mode).
- **Bundler & Dev Server**: Vite 6 dengan konfigurasi port 3000 dan prerendering SEO otomatis.
- **Styling & Ikon**: Tailwind CSS v4 dengan token modern, Lucide React Icons, dan animasi CSS halus.
- **PDF Engine**: jsPDF 4.2 (Instruksi Vektor Teks Murni, Kepatuhan Parser ATS, No-Raster Text) & integrasi `@react-pdf/renderer` / `pdfjs-dist`.
- **Integrasi PWA**: `manifest.json`, Service Worker, pendengar event `beforeinstallprompt`, serta antarmuka tombol instalasi 2-baris yang adaptif.
- **Backend Bridge**: Integrasi Webhook Google Apps Script (GAS) untuk pengiriman email lamaran otomatis beserta berkas lampiran.

---

## 🔗 3. MEKANISME SHORT LINK OBFUSCATION & KODE IDENTIFIKASI

Untuk menjaga privasi dan mencegah pihak luar menebak-nebak struktur tautan dokumen saat dibagikan secara publik, MyCivy menerapkan **Short Link Obfuscation & Identification Codec** (`src/utils/shortLinkCodec.ts`). Sistem ini secara otomatis memendekkan path dan query parameter, serta langsung mengoreksi URL panjang pada *address bar* browser (*seamless auto-correction*).

### 🏷️ Tabel Pemetaan Path & Parameter

| Kategori | Parameter Lengkap | Parameter Ringkas (*Short*) | Deskripsi / Nilai Contoh |
| :--- | :--- | :--- | :--- |
| **Path** | `/search` | `/sr` | Halaman sistem / pencarian internal |
| **Path** | `/preview` | `/prev` | Halaman tampilan dokumen penuh |
| **Key** | `page` | `pg` | Penanda halaman target (`adm`, `prf`) |
| **Key** | `file` | `f` | Jenis dokumen (`p`, `s`, `a`, `id`, `ft`, `cv`) |
| **Key** | `color` | `cl` | Mode cetak warna (`true` / kode hex warna CV) |
| **Key** | `quality` | `q` | Kualitas berkas (`ori` untuk kualitas penuh) |
| **Key** | `spesifik` / `doc` | `spec` | Sub-dokumen spesifik (`skl`, `trk`, `kk`, `ktp`, `sb`) |
| **Key** | `preset` / `role` | `pr` | Kode preset kualifikasi (misal: `opt`, `adm`, `hrs`) |
| **Key** | `design` | `ds` | Varian layout CV (`blok`, `garis`, dll.) |
| **Key** | `lang` | `lng` | Bahasa dokumen (`id`, `en`) |
| **Key** | `align` | `al` | Perataan teks (`left`, `justify`) |

### 📋 Contoh Standar URL:

1. **Akses Admin Workspace**:
   - URL Lengkap: `https://[domain]/search?page=admin`
   - URL Ringkas: `https://[domain]/sr?pg=adm`
2. **Akses Profil Eksekutif**:
   - URL Lengkap: `https://[domain]/search?page=profile`
   - URL Ringkas: `https://[domain]/sr?pg=prf`
3. **Pratinjau Portofolio Berwarna**:
   - URL Lengkap: `https://[domain]/preview?file=portofolio&color=true`
   - URL Ringkas: `https://[domain]/prev?f=p&cl=true`
4. **Pratinjau Sertifikasi Berwarna Kualitas Penuh**:
   - URL Lengkap: `https://[domain]/preview?file=sertifikasi&color=true&quality=ori`
   - URL Ringkas: `https://[domain]/prev?f=s&cl=true&q=ori`
5. **Pratinjau Akademik (SKL) Berwarna**:
   - URL Lengkap: `https://[domain]/preview?file=akademik&color=true&spesifik=skl`
   - URL Ringkas: `https://[domain]/prev?f=a&cl=true&spec=skl`
6. **Pratinjau Transkrip Nilai Akademik**:
   - URL Lengkap: `https://[domain]/preview?file=akademik&spesifik=transkrip`
   - URL Ringkas: `https://[domain]/prev?f=a&spec=trk`
7. **Pratinjau Identitas (Kartu Keluarga)**:
   - URL Lengkap: `https://[domain]/preview?file=identitas&spesifik=kartu%20keluarga`
   - URL Ringkas: `https://[domain]/prev?f=id&spec=kk`

---

## 🖥️ 4. STANDARISASI FULL-PAGE VIEW & HEADER UNIVERSAL

Halaman tampilan penuh dokumen (`/prev` atau `/preview`) telah distandarisasi secara ketat di semua jenis dokumen (**CV, Portofolio, Sertifikasi, Akademik, Identitas, Pas Foto**) untuk memberikan tampilan yang bersih, formal, dan tidak dapat dimanipulasi oleh pengunjung sembarangan.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│ Alvareza H. Pratama                                          [ ☼ / ☾ ]  [ 🔗 Share ]  │
│ Identitas - My Civy                                                                    │
├────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                        │
│                                  KONTEN DOKUMEN                                        │
│                            (PDF / Vector Sheet / Image)                                │
│                                                                                        │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### 🔒 Aturan Standarisasi Header:
1. **Sisi Kiri**:
   - Baris Pertama: **`Alvareza H. Pratama`** (Font tebal berwibawa).
   - Baris Kedua: **`[Nama Dokumen] - My Civy`** (Contoh: `Identitas - My Civy`, `Portofolio - My Civy`, `Akademik - My Civy`).
2. **Sisi Kanan**:
   - Hanya terdapat **Icon Pengubah Tema (Gelap/Terang)** dan **Icon Bagikan (Share)**.
3. **Bebas Tombol Pengaturan**:
   - **TIDAK ADA** tombol toggle kualitas, badge status kompresi, atau pemilih mode cetak warna/BW di header.
   - Semua pengaturan dokumen dikendalikan **100% secara ketat melalui parameter URL**. Hal ini memastikan integritas dokumen yang diterima oleh pihak ketiga (*recruiter/klien*).

---

## 🗺️ 5. PETA LINKS (DIRECT LINKS HUB) & MODAL PARAMETER

Modal Peta Tautan (`src/pages/admin/direct-link/`) adalah pusat pembangkit URL cerdas untuk semua aset dokumen Alvareza Hilka Pratama.

### ✨ Karakteristik & Pembaruan Sistem:
1. **Judul Bersih "Parameter Link"**:
   - Label kolom input URL distandarisasi menjadi **"Parameter Link"**.
   - Menghapus semua teks atau badge metadata tambahan di sebelah kanan judul demi kerapian visual.
2. **Penampilan Tautan Instan Tanpa Klik Tambahan**:
   - Kolom tautan secara otomatis memperbarui dan menampilkan nilai URL yang dipilih secara instan tanpa mengharuskan pengguna mengeklik kolom terlebih dahulu.
3. **Kustom Pop-up Menu untuk Opsi**:
   - Pemilihan opsi sub-dokumen atau varian desain tidak lagi menggunakan badge atau chip yang padat, melainkan **Menu Pop-up Stylish** yang ringkas dan intuitif.
4. **Desain CV & Kode Preset Tanpa Badge**:
   - Bagian CV menyediakan pemilih kartu desain popup (`&ds=blok`, dll.).
   - Kode preset peran ditampilkan sebagai teks normal rapi tanpa badge tebal.
5. **Standarisasi Aturan Nilai Bawaan (Default Parameter)**:
   - **Mode Cetak**: Standar *default* adalah **Hitam Putih (BW)**. Parameter `&cl=true` hanya ditambahkan jika pengguna memilih mode "Cetak Berwarna". Jika BW, parameter `color` ditiadakan sama sekali (`&color=false` tidak pernah dimunculkan).
   - **Kompresi**: Standar *default* adalah **Model Kompresi (≤1MB)**. Parameter `&q=ori` hanya ditambahkan jika pengguna memilih "Kualitas Penuh". Jika memilih kompresi, parameter ditiadakan (`&kompresi=false` atau `true` tidak dimunculkan).

---

## 🛡️ 6. RUANG KERJA ADMIN & HEADER NAVBAR RESPONSIF

Halaman Admin (`/sr?pg=adm`) dilengkapi dengan **HeaderNavbar** canggih (`src/pages/admin/HeaderNavbar.tsx`) yang memiliki arsitektur terpisah antara tampilan Mobile dan Desktop.

```
[ Mobile Header ]
┌────────────────────────────────────────────────────────┐
│ MyCivy                                   ┌──────┐ ┌──┐ │
│ Alvareza H. Pratama                      │INSTAL│ │ >│ │
│                                          │ APP  │ └──┘ │
│                                          └──────┘ Share│
└────────────────────────────────────────────────────────┘

[ Desktop Header ]
┌─────────────────────────────────────────────────────────────────────────┐
│ MyCivy                      ┌──────┐                                    │
│ Alvareza H. Pratama         │INSTAL│  [🏠]   [🌐]   [🖨️]   [☼/☾]   [⚙️] │
│                             │ APP  │  Home  Mindmap Print Theme  Gear   │
│                             └──────┘                                    │
└─────────────────────────────────────────────────────────────────────────┘
```

### 📱 1. Tata Letak Mode Mobile (`md:hidden`):
- **Tombol Instal App**: Tombol kompak 2-baris (`INSTAL` di atas, `APP` di bawah) dengan teks biru dan outline abu-abu tipis presisi, sejajar di sebelah kiri ikon share.
- **Ikon Share**: Menggunakan ikon panah/sudut hadap ke kanan (`Share2` bernuansa `>`) yang terhubung langsung ke Web Share API atau penyalinan ke *clipboard* dengan notifikasi *toast*.

### 💻 2. Tata Letak Mode Desktop (`hidden md:flex`):
Urutan tombol navigasi di sebelah kanan diatur secara konsisten:
1. **Tombol Instal App** (Badge kompak 2-baris `INSTAL\nAPP`).
2. **Ikon Home** (Navigasi cepat ke beranda profil).
3. **Ikon Mindmap / Peta Links** (Membuka modal direct link seluruh ekosistem).
4. **Ikon Print** (Membuka dialog cetak PDF langsung).
5. **Ikon Tema** (Pengalih tema Gelap/Terang).
6. **Ikon Gear / Settings** (Pengaturan sistem admin).
*(Catatan: Mode desktop tidak menampilkan ikon share di header karena telah tersedia pada menu mindmap dan aksi dokumen).*

---

## 📲 7. INTEGRASI PROGRESSIVE WEB APP (PWA)

Platform MyCivy siap diinstal sebagai aplikasi native di desktop (Windows/macOS/ChromeOS) maupun smartphone (Android/iOS):

1. **Manifest Standar PWA (`public/manifest.json`)**:
   - Mendefinisikan nama aplikasi, tema warna biru eksekutif (`#0062E3`), ikon resolusi tinggi, serta orientasi layar.
2. **Event Listener `beforeinstallprompt`**:
   - Disematkan secara reaktif pada `HeaderNavbar.tsx`.
   - Mengambil event prompt instalasi peramban dan memicunya saat tombol **INSTAL APP** ditekan.
3. **Fallback Toast Ramah Pengguna**:
   - Apabila aplikasi telah terinstal atau browser tidak mendukung auto-prompt (seperti Safari di iOS), sistem akan memunculkan *toast notification* elegan dengan instruksi langkah instalasi manual ("Tap Share lalu pilih Add to Home Screen").

---

## ✉️ 8. MODUL LAMARAN KERJA & INTEGRASI GOOGLE APPS SCRIPT (GAS)

Ruang kerja admin menyediakan modul otomatisasi lamaran kerja terpadu (`src/pages/admin/lamar-kerja/`):

1. **Smart Input Parser**:
   - Mampu mengekstrak teks deskripsi lowongan kerja dari LinkedIn, JobStreet, Glints, atau email secara otomatis.
   - Mengidentifikasi nama perusahaan, posisi yang dilamar, nama kontak HRD, serta alamat email tujuan.
2. **Penyesuaian Berkas Otomatis**:
   - Menghubungkan posisi target dengan preset kualifikasi yang paling tepat.
   - Menyiapkan lampiran otomatis (CV ATS teroptimasi, Portofolio, Sertifikasi, dan Transkrip Nilai).
3. **Pengiriman Melalui Webhook GAS (`gasSenderService.ts`)**:
   - Mengirim data lamaran dalam bentuk *payload* aman ke Google Apps Script Web App.
   - GAS memproses pembuatan draft atau pengiriman email formal berformat HTML profesional langsung dari akun Gmail pengguna.
4. **Manajemen Draft Lokal (`jobDraftService.ts`)**:
   - Menyimpan histori lamaran dan draft secara aman pada `localStorage`.

---

## 📄 9. ENGINE BUILD PDF VEKTOR PRESISI & STANDAR KEPATUHAN ATS

Engine PDF MyCivy dibangun untuk melampaui keterbatasan generator HTML-to-Image yang sering menghasilkan teks kabur atau tidak dapat dibaca oleh mesin ATS.

### ⚙️ Keunggulan Arsitektur jsPDF:
1. **100% Vektor Teks Asli**: Semua teks dicetak menggunakan instruksi font native (`doc.text()`). Teks dapat diseleksi, dicari (*searchable*), dan diekstraksi tanpa degradasi kualitas berapapun tingkat pembesarannya.
2. **Kepatuhan Parser ATS**:
   - Menggunakan tata letak satu kolom (*single column*) yang bersih untuk menghindari kesalahan pembacaan urutan kolom pada parser ATS lama.
   - Judul seksi terstandarisasi: *Professional Summary*, *Work Experience*, *Education & Certifications*, *Key Skills*.
   - Karakter peluru (*bullet points*) standar Unicode yang diakui secara global.
3. **Manajemen Margin & Garis Simetris**:
   - Perhitungan posisi vertikal (koordinat Y) dinamis dengan *auto-paging* presisi untuk mencegah teks terpotong di tepi bawah halaman A4.

---

## 🎓 10. HUB DOKUMEN AKADEMIK, SERTIFIKASI & PORTOFOLIO ADAPTIF

Platform mengelola seluruh dokumen legalitas karir secara terpusat:

### 1. Dokumen Akademik (`/prev?f=a`):
- **Surat Keterangan Lulus (SKL)** & **Transkrip Nilai Akademik**:
  - Menyertakan data legalitas universitas, nomor ijazah, status akreditasi, dan rincian Indeks Prestasi Kumulatif (IPK).
  - Pilihan sub-dokumen langsung via URL: `&spec=skl` atau `&spec=trk`.

### 2. Berkas Portofolio (`/prev?f=p`):
- **Dual-Mode Portfolio**:
  - *Standard Grid View*: Ikhtisar visual proyek terkurasi.
  - *Detailed Case Study*: Pembahasan mendalam mengenai metodologi, metrik keberhasilan (*ROI/KPI*), dan peran spesifik.
- Mendukung filter preset: `https://[domain]/prev?f=p&pr=pmo` (Portofolio khusus Project Management).

### 3. Berkas Sertifikasi (`/prev?f=s`):
- Memuat lisensi dan sertifikasi kompetensi resmi (BNSP, Manajemen Operasional, Keahlian Digital) dengan tautan verifikasi kredensial.

---

## 🎯 11. MATRIKS 75+ PRESET PERAN & KATA KUNCI ATS

MyCivy memiliki bank data preset kualifikasi yang mencakup 11 klaster industri:

1. **Manajemen Operasional**: `OPT` (General Operations), `OPS` (Operations Supervisor), `OPM` (Operations Manager), `COO` (Chief Operating Officer), `QAC` (Quality Assurance & Compliance).
2. **Manajemen Proyek & PMO**: `PMO` (Project Management Officer), `PMM` (Project Manager), `AGM` (Agile Scrum Master), `PRM` (Program Manager).
3. **Administrasi & Tata Kelola**: `ADM` (Office Administration & Governance), `SEC` (Corporate Secretary), `EXT` (Executive Assistant).
4. **Business Development & Penjualan**: `BDV` (Business Development), `CSD` (Channel Sales & Distribution), `CSE` (Enterprise Corporate Sales), `SLS` (B2B Sales), `KAM` (Key Account Manager).
5. **Rantai Pasok & Logistik**: `SCM` (Supply Chain Lead), `LDC` (Logistics Fleet & Dispatch), `DIP` (Demand & Inventory Planning), `PRC` (Procurement & Purchasing), `WHS` (Kepala Pergudangan).
6. **Sumber Daya Manusia (HR)**: `HRS` (HR Manager), `HRBP` (HR Business Partner), `CNB` (Compensation & Benefit), `REC` (Talent Acquisition Specialist), `LND` (Learning & Development).
7. **Pemasaran & Digital**: `MKT` (Marketing Specialist), `PMA` (Performance Marketing), `ECO` (E-Commerce Operations), `BRM` (Brand Manager).
8. **Keuangan & Akuntansi**: `ACC` (Finance & Accounting), `APA` (AP/AR Specialist), `IAF` (Internal Audit & Financial Compliance).
9. **Teknologi & Software**: `FED` (Frontend Web Developer), `SWE` (Software Engineer), `ERP` (ERP Implementation Specialist), `BIA` (Business Intelligence Analyst).
10. **Konsultansi & Strategis**: `MGT` (Strategic Management), `CON` (Management Consultant).

---

## 🌐 12. OPTIMASI SEO, METATAG SOSIAL & JSON-LD

1. **Metatag Universal Beresolusi Tinggi**:
   - Memanfaatkan kartu media `/public/metatag.webp` (1200x630px) untuk pratinjau tautan di WhatsApp, Telegram, LinkedIn, Twitter/X, dan Facebook.
2. **Hook Dinamis `useMetaTags`**:
   - Memperbarui `<title>`, `<meta name="description">`, serta tag Open Graph secara langsung saat pengguna beralih antara builder, pratinjau PDF, dan halaman admin.
3. **JSON-LD Structured Data**:
   - Skema `Person` dan `CreativeWork` tersemat di `index.html` untuk meningkatkan keterbacaan profil di mesin pencari Google.

---

## 🛠️ 13. PANDUAN PENGEMBANGAN LOKAL

### 1. Prasyarat Sistem:
- Node.js (v18.x atau lebih baru)
- npm / yarn / pnpm

### 2. Instalasi Dependensi:
```bash
npm install
```

### 3. Menjalankan Server Pengembangan:
```bash
npm run dev
```
Aplikasi aktif pada port `http://localhost:3000`.

### 4. Pengecekan Sintaks & Validasi Tipe:
```bash
npm run lint
```

### 5. Kompilasi Produksi (Production Build):
```bash
npm run build
```

---

## 📂 14. STRUKTUR BERKAS LENGKAP PROYEK

```
/
├── index.html                                 # Entry point HTML dengan metadata OpenGraph & JSON-LD
├── metadata.json                              # Metadata konfigurasi sistem AI Studio
├── package.json                               # Dependensi dan script build
├── tsconfig.json                              # Konfigurasi TypeScript ketat
├── vite.config.ts                             # Konfigurasi Vite & SEO prerenderer
├── public/
│   ├── metatag.webp                           # Banner kartu sosial universal (1200x630px)
│   ├── logo.svg                               # Favicon & logo vektor resmi
│   ├── mycivy-qr-logo.svg                     # Aset logo tersemat untuk QR Code
│   ├── manifest.json                          # Web App Manifest untuk dukungan PWA
│   └── README.md                              # Dokumentasi komprehensif sistem MyCivy
└── src/
    ├── App.tsx                                # Root Controller & Router (Home, Full-View, Admin)
    ├── main.tsx                               # React 19 DOM Mount
    ├── types.ts                               # Definisi tipe data global
    ├── context/
    │   └── LanguageContext.tsx                # State bilingual (ID / EN)
    ├── hooks/
    │   ├── useCvSelection.ts                  # State seleksi kualifikasi CV
    │   ├── useMetaTags.ts                     # Sinkronisasi metadata SEO dinamis
    │   └── usePdfPreview.ts                   # Sinkronisasi pratinjau dokumen
    ├── utils/
    │   ├── shortLinkCodec.ts                  # Engine encode/decode & auto-correct short link
    │   └── pdf/
    │       ├── coreGenerator.ts               # Engine vektor PDF jsPDF standar ATS
    │       ├── helpers.ts                     # Utilitas Blob & konversi PDF
    │       └── types.ts                       # Definisi tipe PDF builder
    ├── services/
    │   ├── gasSenderService.ts                # Integrasi Webhook Google Apps Script
    │   └── jobDraftService.ts                 # Manajemen penyimpanan draft lamaran kerja
    └── pages/
        ├── executive/                         # Halaman Beranda Profil Eksekutif
        │   ├── ExecutiveLandingPage.tsx       # Tampilan antarmuka utama pengguna publik
        │   └── components/                    # Komponen modular landing page
        ├── full-view/                         # Standarisasi Halaman Full View Dokumen
        │   ├── container.tsx                  # Header universal & wrapper dokumen
        │   ├── pdf.tsx                        # Tampilan CV ATS Full-View
        │   ├── portfolio.tsx                  # Tampilan Portofolio Dokumen
        │   ├── certification.tsx              # Tampilan Sertifikasi Dokumen
        │   ├── academic.tsx                   # Tampilan Dokumen Akademik (SKL/Transkrip)
        │   └── identity.tsx                   # Tampilan Berkas Identitas Resmi
        └── admin/                             # Ruang Kerja Admin Terpadu
            ├── HeaderNavbar.tsx               # Navbar responsif (Mobile: 2-line PWA + Share; Desktop: 6 icon tools)
            ├── ToolsWorkspacePage.tsx         # Workspace alat manajemen karir
            ├── modal-mindmap.tsx              # Modal visualisasi mindmap & direct link
            ├── direct-link/                   # Engine Peta Tautan (Direct Link Generator)
            │   ├── container.tsx              # Modal container peta links
            │   ├── utils.ts                   # Generator parameter link & penyalin clipboard
            │   └── sections/                  # Seksi dokumen (CV, Portfolio, Cert, Academic, dll.)
            └── lamar-kerja/                   # Modul Otomatisasi Lamaran Kerja
                ├── container.tsx              # Container alur lamaran kerja
                ├── SmartInputSection.tsx      # Parser teks lowongan kerja cerdas
                └── AttachmentsSection.tsx     # Pengelola lampiran dokumen otomatis
```

---

Dibuat dengan standar rekayasa perangkat lunak modern dan dedikasi terhadap transparansi serta keterbacaan dokumen karir profesional.  
**MyCivy — Your ATS Success Navigator**
