# 📄 ANALISIS SISTEM MENYELURUH & DOKUMENTASI LENGKAP PLATFORM "MYCIVY"
**ATS-Friendly Professional CV Generator, Dynamic Preset Engine, Full-Page PDF View & Multi-Channel Sharing Ecosystem**

---

## 📌 1. RINGKASAN EKSEKUTIF & IDENTITAS PLATFORM

**MyCivy** adalah platform aplikasi web canggih (*Single Page Application* berkinerja tinggi) yang dirancang khusus sebagai **Pembangun, Penyesuai & Penjana Resume ATS-Compliant (Applicant Tracking System)** berstandar industri internasional yang sangat presisi, dinamis, dan terstruktur.

Platform ini menyajikan profil karir profesional eksekutif **Alvareza Hilka Pratama, S.IP** secara kontekstual, terukur, dan adaptif terhadap lebih dari **75 posisi jabatan spesifik (LinkedIn-relevant)** di berbagai sektor industri (mulai dari Manajemen Operasional, Manajemen SDM/HR, PMO/Manajemen Proyek, Pengembangan Bisnis & B2B, Rantai Pasok/Logistik, hingga Pemasaran Digital dan Rekayasa Perangkat Lunak).

### 🎯 Pilar Utama Platform:
1. **Personalisasi CV Otomatis Berbasis Peran (*Targeted Resume Tailoring*)**: Memuat preset kualifikasi yang relevan secara instan sesuai kriteria lowongan kerja (*Job Description*) dari 11 klaster industri.
2. **Engine Build PDF Vektor Presisi (*Pure Vector PDF Engine*)**: Mengubah data teks mentah terstruktur menjadi berkas PDF A4 berstandar vektor murni yang rapi, simetris, dan dapat dibaca 100% oleh parser ATS (Workday, Taleo, Greenhouse, Lever, BambooHR).
3. **Halaman Khusus Full PDF View & URL Dinamis (`/{role}`)**: Antarmuka tampilan penuh dokumen PDF responsif dengan dukungan permalink bersih (`/opt`, `/all`, `/hrs`, `/pmo`, `/adm`, `/ops`, dll.) yang langsung menampilkan dokumen siap baca dan cetak.
4. **Konfigurasi Desain & Tipografi Fleksibel**: Kustomisasi visual dokumen secara langsung (Ubah Tema Header, Ubah Warna Aksen HEX, serta Perataan Teks *Left Align* atau *Justify*).
5. **Ekosistem Berbagi Cerdas & QR Code Terintegrasi**: Bagikan CV melalui URL terparameterisasi, ekspor PDF instan, integrasi pesan WhatsApp otomatis, dan QR Code tersemat dengan branding MyCivy.
6. **Optimasi SEO & Metatag Kartu Sosial Dinamis**: Metatag Open Graph & Twitter Cards berkualitas tinggi dengan kartu gambar universal (`/public/metatag.webp`) serta diferensiasi judul dan deskripsi antara halaman web builder dan pratinjau dokumen PDF.

---

## 🏗️ 2. ARSITEKTUR TEKNOLOGI & SPESIFIKASI STACK

Platform ini dibangun di atas infrastruktur modern dengan *bundle size* yang sangat efisien dan performa *render* yang tinggi:

```
                  ┌───────────────────────────────────────────────┐
                  │            React 19 + TypeScript              │
                  │           (Vite 6 Single Page App)            │
                  └───────────────────────┬───────────────────────┘
                                          │
            ┌─────────────────────────────┼─────────────────────────────┐
            ▼                             ▼                             ▼
  ┌───────────────────┐         ┌───────────────────┐         ┌───────────────────┐
  │  Language Context │         │ Role Preset Engine│         │ Tailwind CSS v4   │
  │  (ID / EN State)  │         │ (75+ Presets/SOP) │         │ (Lucide + Motion) │
  └─────────┬─────────┘         └─────────┬─────────┘         └─────────┬─────────┘
            │                             │                             │
            ├─────────────────────────────┼─────────────────────────────┤
            ▼                             ▼                             ▼
  ┌───────────────────┐         ┌───────────────────┐         ┌───────────────────┐
  │ FullPagePdfView   │         │ Dynamic SEO Hook  │         │ QR Code Engine    │
  │ (Dynamic Route)   │         │ (useMetaTags)     │         │ (qrcode.react)    │
  └─────────┬─────────┘         └─────────┬─────────┘         └─────────┬─────────┘
            │                             │                             │
            └─────────────────────────────┼─────────────────────────────┘
                                          │
                                          ▼
                  ┌───────────────────────────────────────────────┐
                  │           jsPDF 4.2 Vector Engine             │
                  │       (Plain Text + ATS Multi-Style)          │
                  └───────────────────────┬───────────────────────┘
                                          │
                        ┌─────────────────┴─────────────────┐
                        ▼                                   ▼
             ┌─────────────────────┐             ┌─────────────────────┐
             │  doc.save(filename) │             │  Blob URL / PDF.js  │
             │   (Direct Export)   │             │  (Browser Preview)  │
             └─────────────────────┘             └─────────────────────┘
```

| Komponen / Lapisan | Teknologi / Pustaka | Peran & Fungsi Utama |
| :--- | :--- | :--- |
| **Frontend Framework** | `React 19.0.1` | Mengelola reaktivitas UI, state seleksi item, dan siklus hidup komponen antarmuka. |
| **Language & Typings** | `TypeScript 5.8.2` | Menjamin *type safety* pada struktur data CV, preset peran, dan opsi generator PDF. |
| **Build Tool & Bundler** | `Vite 6.2.3` | Menyediakan server pengembang super cepat (Port 3000) dan *production bundling* teroptimasi. |
| **Styling & Animasi** | `Tailwind CSS 4.1.14` & `Motion 12.23` | Tata letak responsif, transisi halus, dan sistem visual kontras tinggi. |
| **Iconography** | `Lucide React 0.546.0` | Ikonografi modern dan konsisten untuk navigasi, menu popup, badge, dan kontrol status. |
| **QR Code Generator** | `qrcode.react 4.2.0` | Pembuatan kode QR vektor SVG interaktif dengan logo embedded MyCivy. |
| **PDF Generation Engine** | `jsPDF 4.2.1` | Penjana berkas PDF berbasis instruksi vektor murni (teks terindeks & aman parser ATS). |
| **In-Memory PDF Preview** | `pdfjs-dist 4.10.38` | Merender berkas PDF vektor menjadi kanvas resolusi tinggi 2x untuk pratinjau instan multi-halaman. |
| **Dynamic SEO & Metatags**| `useMetaTags` + Vite Plugin | Pengelolaan metadata OpenGraph & Twitter Cards secara dinamis dan saat waktu build (*SSG-style*). |

---

## ⚡ 3. MEKANISME & SOURCE PDF BUILD ENGINE: TEKS KE PDF ATS-COMPLIANT

Bagian ini menguraikan secara mendalam bagaimana arsitektur generator PDF MyCivy (`src/utils/pdf/coreGenerator.ts` dan `src/utils/pdf/helpers.ts`) mentransformasikan data teks JSON mentah menjadi berkas PDF vektor berstandar industri dengan kerapian tipografi dan presisi tata letak yang sempurna.

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           ALUR PIPELINE DATA KE PDF                             │
└─────────────────────────────────────────────────────────────────────────────────┘

  [1. Input Data]           [2. Tailoring Layer]          [3. Layout & Geometry]
  • cvData.ts / cvDataEn    • getTailoredExperiences()    • Format: A4 (210 x 297 mm)
  • Role Preset Code        • getTailoredProjects()       • Margins: 10 mm (x: 10, y: 10)
  • Language (id / en)      • presetHeadlinesSummaries    • Usable Width: 190 mm
  • Style & Alignment       • Section Visibility Config   • Dynamic Y-Cursor Tracker
            │                          │                             │
            └──────────────────────────┼─────────────────────────────┘
                                       │
                                       ▼
  [4. Vector Construction Engine (jsPDF)]
  ┌─────────────────────────────────────────────────────────────────────────────┐
  │ • Header Builder: Nama Besar, Dynamic Sub-Headline, Multi-Column Kontak     │
  │ • Interactive Links: doc.link() anotasi URL aktif pada Email/LinkedIn/Web   │
  │ • Section Generator: 4 Gaya Header ATS (Solid Banner, Line, Badge, Plain)   │
  │ • Smart Pagination: ensureSpace(neededHeight) otomatis cegah Orphan Title   │
  │ • Typography & Line Wrapping: doc.splitTextToSize() & Hanging Indentation   │
  │ • Alignment Engine: Left Align vs Justified Text Calculation                │
  │ • Two-Column Grids: Metrics Cards, Skill Badges, dan Proyek Konsultansi     │
  │ • Dynamic Running Footer: Halaman X dari Y + Disclaimer ATS Confidential    │
  └─────────────────────────────────────────────────────────────────────────────┘
                                       │
            ┌──────────────────────────┴──────────────────────────┐
            ▼                                                     ▼
  [5A. Direct Download Pipeline]                       [5B. In-Memory Preview Pipeline]
  • doc.save(filename)                                 • doc.output('blob')
  • Ukuran berkas sangat ringan (<120 KB)              • URL.createObjectURL(blob)
  • 100% Text Vektor Asli                              • Di-render via pdfjs-dist / iframe
```

### 3.1. Filosofi & Keunggulan Pure Vector Rendering vs HTML-to-Canvas

Banyak generator PDF di web menggunakan pendekatan `html2canvas` atau `dom-to-image` yang memotret DOM HTML lalu menempelkannya sebagai gambar raster ke PDF. Pendekatan tersebut memiliki kelemahan fatal:
- **Ditolak Parser ATS**: Teks berubah menjadi piksel gambar (raster image) sehingga sistem ATS seperti Workday atau Taleo tidak dapat mengekstrak teks nama, pengalaman, maupun kata kunci.
- **Ukuran Berkas Membengkak**: File PDF hasil raster gambar bisa mencapai 2 MB hingga 8 MB.
- **Hasil Cetak Buram**: Jika di-zoom atau dicetak pada printer beresolusi tinggi, tepi huruf tampak pecah (blur).

Sebaliknya, **MyCivy menggunakan Pure Vector Engine (jsPDF)**:
1. **100% Teks Terindeks & Dapat Dipilih (*Selectable Text*)**: Setiap huruf ditulis menggunakan instruksi teks PDF murni (`doc.text()`), menjamin skor lolos parser ATS 100%.
2. **Ukuran Berkas Sangat Ringan**: Berkas PDF lengkap 2-3 halaman hanya berukuran **70 KB hingga 120 KB**, mempercepat proses unggah di portal lamaran kerja.
3. **Resolusi Vektor Tak Terbatas (300+ DPI)**: Teks dan garis diproduksi secara matematis sehingga tetap tajam sempurna pada pembesaran berapapun.
4. **Anotasi Tautan Interaktif**: Link portfolio, email, LinkedIn, dan GitHub dapat diklik langsung di dalam PDF melalui pemanggilan `doc.link(x, y, w, h, { url })`.

---

### 3.2. Siklus Hidup Eksekusi (*Step-by-Step Execution Lifecycle*)

Proses pembuatan PDF di `src/utils/pdf/coreGenerator.ts` dijalankan melalui tahapan berurutan berikut:

#### Tahap 1: Resolusi State & Dynamic Data Tailoring
Generator menerima parameter `options` yang mencakup:
- Bahasa aktif (`id` atau `en`).
- Kode preset peran aktif (misal: `HRS`, `OPT`, `ADM`, `PMO`, `OPS`, dll.).
- Opsi gaya visual: `headerStyle` (`solid-banner`, `minimal-thin`, `badge`, `plain`), warna aksen `accentColor` (RGB), dan perataan paragraf `textAlign` (`left` atau `justify`).
- Filter visibilitas seksi (`PDFSectionsConfig`) dan item terpilih (`PDFItemSelectionConfig`).

Data pengalaman kerja dan portofolio kemudian disaring melalui fungsi penyesuai kontekstual:
- `getTailoredExperiences(lang, presetKey)`: Memetakan peran khusus di perusahaan target (misalnya: di PT Galaksi Mitra Gemilang disesuaikan menjadi *HR Manager* untuk preset `HRS`).
- `getTailoredConsultingProjects(lang, presetKey)`: Menampilkan proyek konsultansi independen yang paling relevan dengan posisi yang dilamar.
- `getTailoredDigitalSolutions(lang, presetKey)`: Menampilkan ekosistem produk web/sistem digital yang sesuai.

#### Tahap 2: Inisialisasi Kanvas & Geometri Halaman A4
- Dimensi halaman: Lebar `210 mm`, Tinggi `297 mm` (Standar Internasional ISO 216 A4).
- Batas margin: `marginMm = 10 mm` (kiri, kanan, atas).
- Lebar area kerja efektif:
  $$\text{usableWidth} = \text{pageWidth} - (2 \times \text{marginMm}) = 210 - 20 = 190\text{ mm}$$
- Titik koordinat vertikal (`y`) dilacak secara dinamis oleh penunjuk (*cursor pointer*) dari atas ke bawah.

#### Tahap 3: Konstruksi Header Eksekutif & Kontak Terstruktur
Header utama dokumen dirender di bagian atas halaman pertama:
1. **Nama Lengkap Kandidat**: Tipografi sans-serif tegas (`helvetica`, `bold`) berukuran 19-21 pt dengan pewarnaan aksen terpilih.
2. **Dynamic Headline / Posisi Target**: Ditampilkan tepat di bawah nama dengan ukuran 10.5 pt, memuat jabatan target yang sinkron dengan preset aktif (misal: *HR Manager | Strategic People Operations & Governance*).
3. **Baris Kontak Ringkas & Anotasi Link Aktif**:
   - Menampilkan lokasi, email, nomor WhatsApp/telepon, profil LinkedIn, dan URL portfolio web.
   - Menggunakan pemisah elegan berupa titik tengah (*bullet dot* ` • `).
   - Setiap elemen kontak dihitung koordinat geometrisnya ($x, y, w, h$) dan didaftarkan ke sistem link PDF menggunakan `doc.link(x, y - textHeight, width, textHeight, { url: targetUrl })` sehingga rekruter dapat langsung mengklik kontak dari PDF viewer.

#### Tahap 4: Algoritma `ensureSpace()` & Pencegahan Orphaned Headings
Salah satu tantangan terbesar penulisan teks ke PDF adalah mengontrol pergantian halaman (*page break*) agar tidak terjadi judul seksi yang menggantung di dasar halaman (*orphan heading*).

Generator mengimplementasikan fungsi penjaga ruang vertikal:
```typescript
const ensureSpace = (neededHeight: number) => {
  const pageHeight = doc.internal.pageSize.getHeight();
  const bottomThreshold = pageHeight - margin - footerMarginMm;
  
  if (currentY + neededHeight > bottomThreshold) {
    doc.addPage();
    currentPageNumber++;
    currentY = margin + topMarginOffset;
    // Opsi: Render running header ringkas pada halaman lanjutan
  }
};
```
Sebelum merender judul seksi atau blok pengalaman kerja baru, sistem menghitung estimasi tinggi minimum yang dibutuhkan (`judul + margin + minimal 2 baris deskripsi awal ≈ 28-35 mm`). Jika ruang vertikal tersisa kurang dari batas tersebut, sistem secara otomatis membuat halaman baru (`doc.addPage()`), memastikan tata letak dokumen selalu tampak rapi dan berimbang secara estetika.

#### Tahap 5: 4 Gaya Header Seksi Berstandar ATS
Setiap seksi dokumen (Ringkasan Profil, Metrik Kunci, Pengalaman Kerja, Proyek Konsultansi, Portofolio Digital, Pendidikan, Keterampilan, Sertifikasi, Organisasi) dipisahkan oleh header seksi dengan 4 pilihan gaya:
1. **`solid-banner` (Solid Rectangular Banner)**:
   - Menggambar persegi panjang berwarna aksen solid di sepanjang lebar kerja (`190 mm`) setinggi `6.5 mm`.
   - Menempatkan teks putih kontras tinggi (`#FFFFFF`, `bold`, `uppercase`) dengan padding simetris.
2. **`minimal-thin` / `line` (Underline Minimalis)**:
   - Menuliskan teks seksi berwarna gelap/aksen dengan ukuran 11.5 pt `bold`.
   - Menggambar garis vektor horizontal presisi setebal `0.4 mm` tepat `1.5 mm` di bawah teks di sepanjang lebar `usableWidth`.
3. **`badge` (Pill Capsule Badge)**:
   - Menggambar kotak bersudut melengkung (*rounded rectangle*) dengan radius `1.5 mm` di sekeliling teks judul seksi.
4. **`plain` (Tipografi Bersih)**:
   - Menampilkan judul seksi berukuran 12 pt `bold` dengan aksen huruf kapital penuh (*small caps*) tanpa elemen dekoratif, mengandalkan kekuatan ruang negatif (*white space*).

#### Tahap 6: Engine Tipografi, Dynamic Text Wrapping & Perataan Paragraf
Teks paragraf dan poin tanggung jawab (*bullet highlights*) ditangani dengan perhitungan presisi:
1. **Pemotongan Baris Otomatis (*Line Wrapping*)**:
   - Menggunakan `doc.splitTextToSize(rawText, maxWidth)` untuk menghitung daftar baris string yang pas dengan batas lebar dokumen.
2. **Hanging Indentation untuk Bullet Points**:
   - Titik peluru (*bullet dot* `•`) dirender pada koordinat `x`.
   - Teks isi baris pertama dan baris-baris lanjutannya dirender pada koordinat $x + 4\text{ mm}$ dengan lebar kerja $\text{usableWidth} - 4\text{ mm}$. Hal ini menghasilkan format *hanging indent* (gantung) yang sangat profesional, di mana baris lanjutan tidak pernah berada di bawah titik peluru.
3. **Perataan Teks (*Left Align* vs *Justify*)**:
   - Jika opsi `textAlign: 'justify'` diaktifkan, generator menghitung selisih spasi antar kata pada setiap baris non-terakhir dan mendistribusikan spasi ekstra secara merata agar tepi kanan teks lurus sejajar dengan margin dokumen.

#### Tahap 7: Dua Jalur Distribusi Output (*Dual Output Pipeline*)
Berkas PDF yang telah selesai dirakit diekspor melalui dua mekanisme di `src/utils/pdf/helpers.ts`:
1. **`generateATSPDF(...)` (Direct Download)**:
   - Memanggil `doc.save(filename)` untuk langsung memicu unduhan berkas PDF ke penyimpanan lokal pengguna.
2. **`getATSPDFBlobUrl(...)` (In-Memory Browser Preview)**:
   - Mengekstrak data biner dokumen sebagai Blob via `doc.output('blob')`.
   - Mengonversi Blob menjadi URL sementara peramban melalui `URL.createObjectURL(blob)`.
   - URL ini di-binding ke `iframe` pada halaman `FullPagePdfView`, memungkinkan pengguna melihat pratinjau dokumen PDF vektor secara instan tanpa perlu mengunduh file berulang kali.
3. **`renderPdfToPageImages(...)` (Multi-Page Canvas Preview)**:
   - Memanfaatkan pustaka `pdfjs-dist` untuk merender setiap halaman dokumen PDF ke elemen `<canvas>` dengan skala 2.0x (*retina crisp quality*), menghasilkan gambar PNG transparan untuk pratinjau yang sangat tajam di perangkat mobile.

---

## 🎨 4. DESAIN ATS & SISTEM KUSTOMISASI VISUAL

Platform MyCivy menyediakan engine kustomisasi tampilan dokumen yang tetap menjaga **100% Kompatibilitas ATS**:

### 🌟 4 Opsi Desain Header ATS:
1. **Block (Header Blok Solid)**: Banner persegi panjang dengan kontras tinggi. Formal, tegas, dan modern.
2. **Line (Underline Minimalis)**: Garis horizontal tegas di bawah judul. Paling disukai oleh rekruter internasional dan korporasi multinasional.
3. **Badge (Kapsul Header)**: Judul dibingkai dalam bentuk kapsul lembut. Cocok untuk industri kreatif, agensi, dan startup.
4. **Plain (Minimalis Murni)**: Mengutamakan ritme tipografi dan kesederhanaan ruang negatif.

### 🎨 Pilihan Palet Warna Aksen:
- **Hitam Slate**: `#0F172A` (Default Elegan & Netral)
- **Biru Korporat**: `#0062E3` (Teknologi & Manajemen)
- **Hijau Zamrud**: `#059669` (Operasional, SCM & Keuangan)
- **Merah Karmin**: `#DC2626` (Pemasaran, Sales & Media)
- **Ungu Slate**: `#7C3AED` (Desain & Produk Digital)
- **Dukungan Warna Hex Kustom**: Pengguna bebas memasukkan kode warna hex spesifik (misal: warna identitas perusahaan pelamar).

### 📐 Opsi Perataan Teks (Text Alignment):
- **Rata Kiri (*Left Align*)**: Standar industri tradisional yang memprioritaskan ritme baca alami mata manusia.
- **Rata Kanan-Kiri (*Justify*)**: Tata letak dokumen formal dengan margin rata kanan-kiri yang rapi dan simetris.

---

## 📄 5. SISTEM FULL-PAGE PDF VIEW & NAVIGASI RUTE DINAMIS

Selain antarmuka builder interaktif di root (`/`), MyCivy dilengkapi dengan antarmuka **Full Page PDF View** (`src/components/FullPagePdfView.tsx`) yang didesain khusus untuk menampilkan dokumen CV utuh langsung di layar tanpa gangguan panel editor:

### 🌟 Fitur Unggulan Full Page PDF View:
1. **Header Minimalis 2-Aksi**:
   - **Tombol Desain (Palette Icon)**: Membuka menu popup kustom untuk mengubah tema, warna aksen, dan perataan teks.
   - **Tombol Share (Share2 Icon)**: Membuka menu popup aksi lengkap untuk menyalin tautan, mengunduh PDF, berbagi ke WhatsApp, dan menampilkan modal QR Code.
2. **Struktur Pola URL Parameter Fleksibel**:
   ```
   https://alvareza.vercel.app/{role}?theme={design}&color={hex}&align={justify}
   ```
   - `{role}`: Kode peran preset (`opt`, `all`, `hrs`, `swe`, `pmo`, `adm`, `ops`, `mkt`, dll.).
   - `theme`: Pilihan tema dokumen (`block`, `line`, `badge`, `plain`).
   - `color`: Kode warna heksadesimal tanpa pagar (misal: `0F172A`, `0062E3`, `059669`, `DC2626`).
   - `align`: Opsi perataan teks paragraf (`justify` untuk rata kanan-kiri, atau default rata kiri).
   - *Contoh*: `https://alvareza.vercel.app/hrs?theme=line&color=0062E3&align=justify`
3. **Sinkronisasi State & URL Tanpa Reload**:
   - Setiap perubahan tema, warna, atau perataan langsung memperbarui URL di address bar peramban menggunakan `window.history.replaceState` secara instan dan mulus.
4. **Fokus Bebas Gangguan (Modal Scroll Lock)**:
   - Ketika modal atau bottom sheet dibuka (Ubah Tema, Ubah Warna, Share, atau QR Code), scrollbar halaman dan progress bar dokumen otomatis dinonaktifkan (`overflow-hidden max-h-screen`) agar fokus pengguna tetap terjaga.

---

## 📱 6. EKOSISTEM BERBAGI & MODAL QR CODE MYCIVY

Menu Berbagi cerdas terintegrasi langsung pada tampilan Full PDF View:

1. **Unduh PDF Instan**: Mengekspor dokumen langsung dari instruksi vektor `jsPDF` berkecepatan tinggi.
2. **Salin Tautan**: Menyalin URL spesifik lengkap dengan preset peran, tema, warna, dan perataan yang sedang aktif.
3. **Bagikan ke WhatsApp**: Menyiapkan teks salam profesional otomatis dan tautan pratinjau yang langsung dapat dikirim ke rekruter atau kolega.
4. **Modal QR Code Vektor**:
   - Menghasilkan QR Code SVG dari URL aktif.
   - Dilengkapi logo tengah bertuliskan **MyCivy** (berbasis teks rata tengah tanpa garis outline tebal) yang presisi dan mudah dipindai oleh kamera ponsel.
   - Tombol unduh langsung gambar QR Code (SVG/PNG).
5. **Web Share API**: Terhubung ke sistem *native share* bawaan perangkat (iOS / Android / macOS / Windows).

---

## 🌐 7. ARSITEKTUR METATAG & SEO DINAMIS

Platform ini mengimplementasikan strategi SEO canggih untuk memastikan pratinjau kartu sosial (*Open Graph & Twitter Cards*) tampil optimal di seluruh platform perpesanan dan media sosial (WhatsApp, Telegram, LinkedIn, Facebook, Discord, X):

### 🖼️ Universal Social Card Image:
- Seluruh tautan web menggunakan aset gambar resolusi tinggi dari:
  ```
  https://alvareza.vercel.app/metatag.webp
  ```
- Format WebP berukuran 1200 x 630 px dengan kompresi optimal untuk waktu muat pratinjau instan.

### 🏷️ Diferensiasi Konten Metatag:
1. **Halaman Utama / Web Builder (`/`)**:
   - **Judul**: *MyCivy | Generator & Builder CV ATS Professional*
   - **Deskripsi**: *Platform CV ATS-Friendly & Portfolio Professional. Kustomisasi preset peran kerja spesifik, sesuaikan tata letak dan tema, lalu unduh resume PDF siap kirim ke HRD instan.*
2. **Halaman Full PDF View (`/{role}`)**:
   - **Judul**: Menyesuaikan dengan kode peran aktif, misal: *Curriculum Vitae (CV) ATS - Alvareza H. Pratama (HRS) | MyCivy PDF Preview*.
   - **Deskripsi**: *Lihat pratinjau Curriculum Vitae (CV) ATS-Friendly resmi Alvareza H. Pratama. Format standar industri dengan struktur terverifikasi, siap cetak dan diunduh langsung dalam format PDF.*

### ⚡ Strategi Prarating Ganda (SSG + Client-Side Hook):
- **Build-Time Prerender (Vite Plugin)**: Secara otomatis menghasilkan file `index.html` statis pada folder dist rute seperti `/all`, `/opt`, `/hrs`, `/swe`, `/pmo`, `/adm`, `/ops`, `/mkt`, `/fin` agar bot *crawler* yang tidak menjalankan JavaScript (seperti WhatsApp dan Telegram) langsung membaca metatag dokumen secara akurat.
- **Client-Side Hook (`useMetaTags`)**: Memperbarui tag `<title>`, `<meta>`, `<link rel="canonical">`, dan `<link rel="image_src">` di runtime saat pengguna berpindah halaman tanpa memicu *full page reload*.

---

## 🗂️ 8. KELOMPOK INDUSTRI & 75+ PRESET PERAN (LINKEDIN TARGETED)

Platform mendukung lebih dari **75 preset kualifikasi karir spesifik** yang terbagi ke dalam 11 klaster industri, disesuaikan langsung dengan kata kunci dan kriteria pencarian rekruter di LinkedIn:

1. **Featured Profiles**: `OPT` (Rekomendasi Utama), `ALL` (Profil Lengkap Komprehensif).
2. **Administrasi & Kesekretariatan**: `ADM` (Admin Perkantoran), `AST` (Sekretaris Eksekutif), `PJA` (Project Administration), `PRA` (Procurement Administration), `DEA` (Data Entry & Database Admin), `WIA` (Warehouse & Inventory Admin), `HOS` (Admin Rumah Sakit), `LGL` (Admin Legal), `SAD` (Admin Penjualan), `FBA` (Admin Keuangan & Kasir), `HRA` (Admin Personalia).
3. **Operasional & Manajemen Ritel**: `OPS` (Operations Manager), `OPX` (Operational Excellence & Continuous Improvement), `SOM` (Service Operations Manager), `COS` (Chief of Staff / BizOps), `FRE` (Retail Expansion & Franchise Ops), `BRN` (Branch Manager), `RTL` (Supervisor Toko), `GAF` (General Affairs), `QAC` (QA & Kepatuhan SOP), `MFG` (Operasional Produksi), `FLD` (Koordinator Lapangan), `UTL` (Utilitas Publik & Air).
4. **Manajemen Proyek & PMO**: `PMO` (Project Manager Umum), `ASM` (Agile Scrum Master), `PRO` (Product Operations), `CLT` (Client Implementation Manager), `CPM` (Creative Project Manager), `ITP` (IT Project Manager), `EVM` (Event Project Manager), `NGO` (Program Lead Nirlaba).
5. **Business Development & Penjualan**: `BDV` (Business Development), `CSD` (Channel Sales & Distribution), `CSE` (Enterprise Corporate Sales), `SOP` (Sales Operations & Enablement), `TND` (Commercial Tender & RFP Specialist), `SLS` (Sales Executive B2B), `KAM` (Key Account Manager), `GOV` (Government Relations), `CSM` (Client Success Manager).
6. **Rantai Pasok & Logistik**: `SCM` (Supply Chain Lead), `LDC` (Logistics Fleet & Dispatch), `VMR` (Vendor & Supplier Relations), `DIP` (Demand & Inventory Planning), `PPC` (PPIC & Stok FIFO), `PRC` (Procurement & Purchasing), `WHS` (Kepala Pergudangan).
7. **Sumber Daya Manusia (HR)**: `HRS` (HR Manager — Kepemimpinan SDM Strategis & Hubungan Industrial), `HBP` / `HRBP` (HR Business Partner), `CNB` (Comp-Ben & Payroll Specialist), `IRL` (Industrial Relations & Labor Compliance), `PAS` / `HRIS` (People Analytics & HRIS), `EBR` (Employer Branding & Campus Relations), `REC` (Talent Acquisition / Rekruter), `LND` (Learning & Development), `ODD` (Organizational Development).
8. **Pemasaran, Humas & CX**: `MKT` (Digital Marketing), `PMA` (Performance Marketing & Ads), `ECO` (E-Commerce & Marketplace Ops), `SMM` (Social Media & Content Strategy), `GRM` (Growth Marketing & B2B Lead Gen), `BRM` (Brand Manager & Creative Comms), `PRS` (Public Relations), `CSO` (Customer Service & CX), `MCB` (Marcom & Brand Activation).
9. **Keuangan & Akuntansi**: `ACC` (Finance & Accounting), `APA` (AP/AR Specialist), `PSC` (Commercial Pricing Analyst), `IAF` (Internal Audit & Financial Compliance), `FAC` (Financial Analyst & Cost Control), `TAX` (Akuntansi Perpajakan).
10. **Teknologi, ERP & Rekayasa Perangkat Lunak**: `DIG` (Digital Transformation Lead), `FED` (Frontend Web Developer), `PDM` (Product Manager / APM), `ERP` (Enterprise ERP & CRM Implementation), `BIA` (BI & Executive Dashboard Specialist), `SWE` (Software Engineer), `FE` (Frontend Engineer), `BSA` (Business Systems Analyst).
11. **Manajemen Strategis & Konsultansi**: `MGT` (Strategic Management), `BTR` (Business Turnaround & Restructuring), `PAR` (Public Affairs & Institutional Advocacy), `CON` (Management Consultant).

---

## 🛠️ 9. PANDUAN PENGEMBANGAN & CARA MENJALANKAN LOKAL

### 1. Prasyarat Sistem:
- Node.js (v18.x atau lebih baru)
- npm / yarn / pnpm / bun

### 2. Instalasi Dependensi:
```bash
npm install
```

### 3. Menjalankan Server Pengembangan:
```bash
npm run dev
```
Aplikasi dapat diakses pada `http://localhost:3000`.

### 4. Menjalankan Linter & Validasi Tipe:
```bash
npm run lint
```

### 5. Kompilasi Produksi (Production Build):
```bash
npm run build
```
Proses ini secara otomatis mengompilasi bundel Vite dan mengeksekusi plugin pembuat rute statis SEO ke direktori `dist/`.

---

## 🚀 10. STRUKTUR BERKAS UTAMA

```
/
├── index.html                           # Entry point HTML utama dengan tag meta OpenGraph lengkap
├── metadata.json                        # Metadata konfigurasi sistem AI Studio
├── package.json                         # Dependensi dan script build
├── tsconfig.json                        # Konfigurasi TypeScript
├── vite.config.ts                       # Konfigurasi Vite & Plugin Generator SEO Statis
├── public/
│   ├── metatag.webp                     # Gambar kartu sosial universal (1200x630px)
│   ├── logo.svg                         # Favicon & logo vektor resmi
│   ├── mycivy-qr-logo.svg               # Aset SVG logo badge MyCivy untuk QR
│   ├── manifest.json                    # Manifest web capabilities (PWA)
│   └── README.md                        # Dokumentasi komprehensif sistem MyCivy & PDF Engine
└── src/
    ├── App.tsx                          # Root controller & detektor routing (Home vs Full PDF)
    ├── main.tsx                         # Mount React 19 application
    ├── types.ts                         # Deklarasi tipe TypeScript global
    ├── components/
    │   ├── FullPagePdfView.tsx          # Tampilan Full Page PDF dokumen interaktif
    │   ├── AtsDocumentSheet.tsx         # Komponen lembar dokumen berstandar ATS
    │   ├── HeaderNavbar.tsx             # Navbar utama antarmuka builder
    │   ├── PrintableView.tsx            # Editor & builder pemilihan item CV
    │   └── RolePresetModal.tsx          # Modal pemilihan 75+ preset peran
    ├── context/
    │   └── LanguageContext.tsx          # State provider bilinguistik (ID / EN)
    ├── data/
    │   ├── cvData.ts                    # Data profil profesional Bahasa Indonesia
    │   ├── cvDataEn.ts                  # Data profil profesional Bahasa Inggris
    │   ├── tailoredExperiences.ts       # Penyesuai peran kontekstual per preset
    │   ├── tailoredProjects.ts          # Penyesuai proyek konsultansi & portofolio digital
    │   ├── presetExperiencesId.ts       # Detil pengalaman kerja Bahasa Indonesia per preset
    │   ├── presetExperiencesEn.ts       # Detil pengalaman kerja Bahasa Inggris per preset
    │   ├── presetHeadlinesSummaries.ts  # Headline & ringkasan eksekutif dinamis per preset
    │   ├── presetKeywordsBilingual.ts   # Database 75+ aturan pencocokan kata kunci otomatis
    │   └── rolePresetsConfig.ts         # Konfigurasi 75+ preset peran & pemetaan kode
    ├── hooks/
    │   ├── useCvSelection.ts            # Hook seleksi dan aktivasi item kualifikasi
    │   ├── useMetaTags.ts               # Hook dinamis pembaruan OpenGraph & SEO tags
    │   └── usePdfPreview.ts             # Hook sinkronisasi state pratinjau & unduh PDF
    └── utils/
        └── pdf/
            ├── coreGenerator.ts         # Engine instruksi vektor jsPDF aman parser ATS
            ├── helpers.ts               # Helper ekspor PDF, Blob URL & render canvas via PDF.js
            ├── types.ts                 # Definisi tipe konfigurasi gaya dan seksi PDF
            └── index.ts                 # Ekspor modul PDF terpadu
```

---

Dibuat dengan standar rekayasa perangkat lunak modern dan dedikasi terhadap keterbacaan dokumen karir profesional.  
**MyCivy — Your ATS Success Navigator**
