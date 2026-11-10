# Rencana Upgrade Fitur Ekspor & Tanda Tangan Digital Kriptografi (PKCS#7 / PAdES) Digital Profile

> **Dokumen Rencana Arsitektur & Spesifikasi Implementasi**  
> Target: Semua Halaman Full View (`/preview?file=...` / `/prev?f=...`: Academic, Certification, Awards, Identity, Portfolio, PDF/CV)  
> Tanggal Rencana: 9 November 2026  
> Versi: 1.0.0-PROPOSAL  

---

## 1. Ringkasan Eksekutif & Tujuan

Pembaruan ini bertujuan menghadirkan pengalaman ekspor dokumen standar korporat & institusi (*Enterprise-Grade Document Export*) pada seluruh halaman **Full View** di Digital Profile. Fitur ini terdiri dari dua pilar utama:

1. **Antarmuka Dropdown Unduh 2-Layer (Two-Tier Share/Download Popup Menu)**:
   - **Layer 1 (Utama)**: Menu ringkas berisi *QR Code*, *Salin Link*, dan *Unduh* (dengan navigasi transisi ke Layer 2).
   - **Layer 2 (Opsi Unduhan)**:
     - **Gambar Terpisah (`.zip`)**: Konversi otomatis berkas WebP ke format JPEG standar berkualitas tinggi, berukuran ringan & proporsional, dibundel dalam satu arsip ZIP.
     - **PDF Terpisah (`.zip`)**: Setiap lembar berkas WebP dikonversi menjadi dokumen PDF individual mandiri dengan rasio presisi, **disematkan Tanda Tangan Elektronik Kriptografi Tersertifikasi (PKCS#7 / PAdES)**, lalu dikompresi ke dalam satu arsip ZIP.
     - **PDF Lengkap (`.pdf`)**: Seluruh lembar berkas dikompilasi secara berurutan ke dalam 1 dokumen PDF terpadu, **disematkan Master Digital Signature Tersertifikasi**, dan langsung diunduh sebagai berkas `.pdf`.

2. **Native PDF Embedded Digital Signature (PKCS#7 / PAdES Standard)**:
   - Menanamkan struktur kriptografi *Public Key Infrastructure* (PKI) dengan algoritma RSA 2048-bit (atau ECDSA P-256) langsung ke dalam kamus struktur biner PDF (`/ByteRange` & `/Contents`).
   - Ketika dokumen dibuka menggunakan **Adobe Acrobat Reader**, **Foxit PDF Reader**, atau PDF Viewer standar industri, aplikasi akan memunculkan pita hijau/biru (*Security Signature Ribbon*) bertuliskan:  
     > *"Digitally signed by Digital Profile Certificate Authority. Document has not been modified since it was signed."*
   - Menjamin sifat **Integritas Dokumen (*Tamper-Evident*)**: Jika ada pihak yang memodifikasi teks, gambar, atau halaman PDF, tanda tangan digital otomatis dinyatakan rusak (*Invalid / Modified*).
   - **Konfigurasi Fleksibel & Modular via TypeScript**: Seluruh parameter penandatanganan, metadata sertifikat, otoritas penjamin (*Certificate Authority*), alasan (*Reason*), lokasi (*Location*), kontak, dan level sertifikasi dikelola dalam satu file konfigurasi terpusat yang mudah disunting.
   - **Diferensiasi Level Kriptografi**:
     - *Level Master / Full Dossier*: Untuk dokumen PDF Lengkap (kompilasi multi-halaman).
     - *Level Unit / Credential Verification*: Untuk setiap dokumen PDF Terpisah.

---

## 2. Analisis Halaman Target Full View

Mekanisme ini akan diimplementasikan secara seragam pada seluruh modul Full View di `src/pages/full-view/`:

| Modul Full View | Rute File URL | Tipe Dokumen Asal | Target Berkas Gambar Terpisah | Target PDF Terpisah | Target PDF Lengkap |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Penghargaan & Piagam** | `awards.tsx` (`file=penghargaan`) | 19 Berkas Piagam WebP | 19 Gambar JPEG dalam `.zip` | 19 PDF Bersertifikat dalam `.zip` | 1 Berkas PDF Master Kompilasi |
| **Sertifikasi Profesi** | `certification.tsx` (`file=sertifikasi`) | 10 Berkas Sertifikat WebP | 10 Gambar JPEG dalam `.zip` | 10 PDF Bersertifikat dalam `.zip` | 1 Berkas PDF Master Kompilasi |
| **Portofolio Eksekutif** | `portfolio.tsx` (`file=portofolio`) | 19 Slide Portofolio WebP | 19 Slide JPEG dalam `.zip` | 19 Slide PDF Bersertifikat dalam `.zip` | 1 Berkas PDF Master Portofolio |
| **Dokumen Akademik** | `academic.tsx` (`file=akademik`) | SKL & Transkrip Nilai WebP | 2 Gambar JPEG dalam `.zip` | 2 PDF Bersertifikat dalam `.zip` | 1 Berkas PDF Akademik Terpadu |
| **Identitas Resmi** | `identity.tsx` (`file=identitas`) | KTP, NPWP, Pas Foto, KK | Berkas JPEG Identitas dalam `.zip` | PDF Identitas Bersertifikat dalam `.zip` | 1 Berkas PDF Berkas Identitas |
| **Curriculum Vitae (ATS)**| `pdf.tsx` (`file=cv` / `f=cv`) | Data Vektor / Slide ATS | Export Halaman CV JPEG `.zip` | Export Lembar CV Terpisah `.zip` | 1 Berkas PDF CV ATS Master |

---

## 3. Desain Antarmuka Dropdown Menu 2-Layer

### 3.1 Diagram Alur Transisi Antarmuka

```
[ Tombol Ikon Bagikan / Share ] (Klik)
                 │
                 ▼
┌───────────────────────────────────────────────┐
│              LAYER 1: MENU UTAMA              │
│ ┌───────────────────────────────────────────┐ │
│ │ [QrCode]      QR Code                     │ │
│ │ [Copy]        Salin Link                  │ │
│ │ [Download]    Unduh Dokumen            >  │ │ ── (Klik Opsi Unduh)
│ └───────────────────────────────────────────┘ │      │
└───────────────────────────────────────────────┘      │
                                                       ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      LAYER 2: SUBMENU PILIHAN UNDUH                    │
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │ [< Kembali]   Pilih Format Unduhan                                 │ │
│ ├────────────────────────────────────────────────────────────────────┤ │
│ │ [Images]      Gambar Terpisah (.zip)                               │ │
│ │               Konversi WebP ke JPEG terkompresi ringan             │ │
│ │                                                                    │ │
│ │ [FileKey]     PDF Terpisah (.zip)                                  │ │
│ │               Masing-masing file PDF bertanda tangan digital       │ │
│ │                                                                    │ │
│ │ [FileCheck]   PDF Lengkap (.pdf)                                   │ │
│ │               1 Berkas PDF terpadu dengan Master Signature         │ │
│ └────────────────────────────────────────────────────────────────────┘ │
│ [ Status Progress Generator / Indikator Loading dengan Persentase ]    │
└────────────────────────────────────────────────────────────────────────┘
```

### 3.2 Spesifikasi Interaksi UI/UX
1. **Lebar Dropdown Konsisten**:
   - Layer 1 memiliki lebar `w-40 sm:w-44`.
   - Saat masuk ke Layer 2, container bertransisi secara halus (*smooth width/opacity animate-in*) menjadi `w-64 sm:w-72` agar teks deskripsi format unduhan terbaca jelas tanpa terpotong.
2. **Tombol Kembali**:
   - Header Layer 2 menyediakan tombol panah kiri (`ArrowLeft` atau `ChevronLeft`) dengan teks `"Kembali"` untuk kembali ke Layer 1 secara instan tanpa menutup dropdown.
3. **Indikator Proses (Processing State)**:
   - Saat proses unduh berjalan (konversi canvas, signing kriptografi, atau zip compression), tombol opsi menampilkan animasi `Loader2` dan progress teks real-time (contoh: *"Memproses 5/19..."* atau *"Menandatangani Dokumen..."*).
   - Pengguna dicegah melakukan *double-click* atau *concurrent download*.
4. **Klik di Luar (Backdrop Dismiss)**:
   - Menekan area luar dropdown menutup menu dan mereset layer kembali ke Layer 1 saat dibuka kembali.

---

## 4. Arsitektur Kriptografi PDF (PKCS#7 / PAdES)

### 4.1 Standar dan Mekanisme Teknis

Untuk memenuhi standar keamanan **PAdES (PDF Advanced Electronic Signatures)** dan format Adobe Acrobat:

```
+-----------------------------------------------------------------------------------+
|                              BERKAS PDF TERSERTIFIKASI                            |
|                                                                                   |
|  [Halaman Dokumen PDF Vektor / Raster Resolusi Tinggi]                            |
|  - Data Halaman 1 ... N                                                           |
|  - Visual Stempel / QR / Metadata Security Tag                                    |
|                                                                                   |
|  -------------------------------------------------------------------------------  |
|  [Kamus Tanda Tangan Digital Biner: /Type /Sig]                                   |
|  - /Filter /Adobe.PPKLite                                                         |
|  - /SubFilter /adbe.pkcs7.detached                                                |
|  - /ByteRange [ 0, 84210, 96500, 42100 ]                                          |
|  - /Contents < 308204... [HEX DER-ENCODED PKCS#7 SIGNATURE WITH RSA-2048] >       |
|  - /Reason (Verifikasi Keabsahan Dokumen Resmi Digital Profile)                           |
|  - /Location (Jakarta, Indonesia)                                                 |
|  - /ContactInfo (alvareza@digitalprofile.app)                                             |
|  - /M (D:20261109143000+07'00')                                                  |
+-----------------------------------------------------------------------------------+
```

#### Komponen Utama Kriptografi:
1. **Algoritma**: RSA 2048-bit dengan SHA-256 (Standar industri yang diterima global dan didukung native oleh Adobe PPKLite).
2. **Kamus ByteRange**: Array 4 integer penanda byte dokumen: `[start1, length1, start2, length2]` yang mengapit ruang alokasi biner `/Contents`.
3. **Detached Signature**: Digest hash SHA-256 dihitung dari seluruh byte dokumen (kecuali nilai heksadesimal `/Contents` itu sendiri), kemudian dienkripsi menggunakan Private Key milik entitas penandatangan.
4. **Sertifikat X.509**: Sertifikat digital berformat X.509 v3 yang memuat Subject DN, Issuer DN, Serial Number, Validitas Waktu, dan Public Key penandatangan.

---

### 4.2 Struktur Konfigurasi Terpusat (`src/config/digitalSignatureConfig.ts`)

File konfigurasi TypeScript dibuat modular agar pemilik aplikasi dapat mengubah identitas sertifikat, masa berlaku, kontak, alasan penandatanganan, dan tingkatan sertifikasi dengan sangat mudah:

```typescript
export interface DigitalSignatureProfile {
  commonName: string;
  organization: string;
  organizationalUnit: string;
  country: string;
  locality: string;
  email: string;
  validityYears: number;
}

export interface SignatureMetadataConfig {
  reason: string;
  location: string;
  contactInfo: string;
  certificationLevel: 'MASTER_DOSSIER' | 'UNIT_CREDENTIAL';
  embedVisualWatermark: boolean;
}

export interface AppDigitalSignatureConfig {
  authority: DigitalSignatureProfile;
  signer: DigitalSignatureProfile;
  levels: {
    masterDossier: SignatureMetadataConfig;
    unitCredential: SignatureMetadataConfig;
  };
  keyPair: {
    algorithm: 'RSA' | 'ECDSA';
    rsaBits: 2048;
    hashAlgorithm: 'sha256';
    // Otomatis men-generate atau memuat pasangan kunci privat/publik yang tersimpan
    privateKeyPem?: string;
    certificatePem?: string;
  };
}
```

### 4.3 Diferensiasi Level Sertifikasi
- **Level 1: Master Dossier / Compilation Signature (PDF Lengkap)**:
  - *Reason*: *"Pengesahan Dokumen Portofolio & Kompilasi Terpadu Resmi Alvareza Hilka Pratama (Master Dossier Verifikasi Digital Profile)."*
  - *Signer Role*: *"Lead Candidate & Certified Professional"*.
  - *Authority*: *"Digital Profile Enterprise Document Security Engine - Master Authority"*.
- **Level 2: Unit Credential Signature (PDF Terpisah)**:
  - *Reason*: *"Verifikasi Keaslian Dokumen Unit/Sertifikat Tunggal Resmi Alvareza Hilka Pratama."*
  - *Signer Role*: *"Verified Certificate Holder"*.
  - *Authority*: *"Digital Profile Credential Verification Authority"*.

---

## 5. Rencana Dependensi & Paket NPM

Untuk merealisasikan fitur ini secara stabil, ringan, dan 100% kompatibel di lingkungan browser Vite (serta backend Express server jika diperlukan), paket-paket berikut disiapkan:

| Nama Paket | Fungsi Utama | Ukuran / Karakteristik | Kebutuhan Lingkungan |
| :--- | :--- | :--- | :--- |
| **`jszip`** | Membuat arsip `.zip` langsung di browser/Node tanpa dependensi biner native | Sangat ringan (~45 KB gzip), mendukung streams dan blob output | Client-Side & Server |
| **`@types/jszip`** | TypeScript type definitions untuk JSZip | Dev Dependency | Build/Lint |
| **`node-forge`** | Menghasilkan sertifikat X.509, keypair RSA 2048, SHA-256 Digest, dan struktur PKCS#7 / CMS detached signature secara murni dalam JavaScript/TypeScript | Murni JS (tidak membutuhkan OpenSSL OS bindings), berjalan 100% di browser & Node | Client-Side & Server |
| **`@types/node-forge`** | Type definitions untuk modul node-forge | Dev Dependency | Build/Lint |
| **`pdf-lib`** *(Sudah terinstal `^1.17.1`)* | Manipulasi biner struktur PDF kamus kamus `/AcroForm`, `/Sig`, `/ByteRange`, dan visual layout | Sudah terpasang di `package.json` | Client-Side & Server |
| **`jspdf`** *(Sudah terinstal `^4.2.1`)* | Pembuat layout PDF vektor presisi | Sudah terpasang di `package.json` | Client-Side & Server |

### Perintah Instalasi Paket (Batched):
```bash
npm install jszip node-forge
npm install -D @types/jszip @types/node-forge
```

---

## 6. Rencana Implementasi Modul & Arsitektur Berkas

Struktur berkas modular yang akan dibuat/dimodifikasi:

```
src/
├── config/
│   └── digitalSignatureConfig.ts       <-- [BARU] Konfigurasi identitas penandatangan, otoritas sertifikat & metadata
│
├── utils/
│   ├── crypto/
│   │   ├── certGenerator.ts            <-- [BARU] Pembuat sertifikat X.509 v3 & PKCS#7 detached signature via forge
│   │   └── pdfDigitalSigner.ts         <-- [BARU] Mesin penyisip kamus /ByteRange & /Contents biner ke file PDF
│   │
│   ├── export/
│   │   ├── zipArchiver.ts              <-- [BARU] Utility pembungkus array file (JPEG/PDF) ke arsip .zip via JSZip
│   │   ├── imageConverter.ts           <-- [BARU] Konversi WebP -> JPEG teroptimasi (rasio presisi & ukuran ringan)
│   │   └── singlePdfExporter.ts        <-- [BARU] Konversi 1 berkas gambar ke 1 file PDF A4/aspek asli + Digital Signature
│   │
│   └── portfolio-pdf/
│       ├── pdfBuilders.ts              <-- [UPDATE] Menyematkan Master Digital Signature pada hasil akhir PDF Lengkap
│       └── imageLoader.ts              <-- [EXISTING] Digunakan kembali untuk cache rendering gambar
│
└── pages/
    └── full-view/
        ├── components/
        │   └── FullViewExportMenu.tsx  <-- [BARU] Komponen UI reusable Dropdown 2-Layer dengan indikator progress
        ├── awards.tsx                  <-- [UPDATE] Menggunakan FullViewExportMenu
        ├── certification.tsx           <-- [UPDATE] Menggunakan FullViewExportMenu
        ├── portfolio.tsx               <-- [UPDATE] Menggunakan FullViewExportMenu
        ├── academic.tsx                <-- [UPDATE] Menggunakan FullViewExportMenu
        ├── identity.tsx                <-- [UPDATE] Menggunakan FullViewExportMenu
        └── pdf.tsx                     <-- [UPDATE] Menggunakan FullViewExportMenu
```

---

## 7. Spesifikasi Logika Teknis Setiap Opsi Unduhan

### 7.1 Opsi 1: Gambar Terpisah (`.zip`)
- **Input**: Daftar item (contoh: 19 file WebP penghargaan di `public/penghargaan/*.webp`).
- **Proses**:
  1. Melalui canvas di browser, gambar WebP dibaca dan dikonversi ke JPEG dengan kualitas optimal (`quality: 0.82` atau adaptif `calculateAdaptivePortfolioQuality`).
  2. Resolusi diatur agar tajam terbaca (maksimal lebar/tinggi 1600px), menjaga ukuran berkas rata-rata berkisar 80–180 KB per lembar JPEG.
  3. Setiap berkas diberi nama terstruktur:  
     `01_Nama_Dokumen_Alvareza_H_Pratama.jpg`
  4. Seluruh berkas JPEG dimasukkan ke instance `JSZip`.
  5. Menghasilkan arsip biner ZIP terkompresi (`compression: "DEFLATE", level: 6`).
- **Output**: Unduhan berkas tunggal misal: `Penghargaan_Alvareza_H_Pratama_JPG.zip`.

### 7.2 Opsi 2: PDF Terpisah (`.zip`)
- **Input**: Daftar berkas WebP yang sama.
- **Proses**:
  1. Untuk setiap gambar, buat berkas PDF individual menggunakan `pdf-lib` atau `jsPDF`:
     - Menjaga proporsi asli (Landscape `297mm x 210mm` atau Portrait `210mm x 297mm` sesuai dimensi asli berkas).
     - Menempelkan JPEG teroptimasi ke lembar PDF.
  2. **Penyematan Digital Signature**:
     - Dokumen PDF biner dilewatkan ke `pdfDigitalSigner.signPdfBuffer()`.
     - Menyematkan digital signature dengan profil `unitCredential` (Level Unit).
     - Struktur `/ByteRange` dan `/Contents` terisi tanda tangan kriptografi sah.
  3. Berkas PDF tersertifikasi diberi nama:  
     `01_Nama_Dokumen_Signed.pdf`
  4. Seluruh PDF bertanda tangan digital dikompresi ke dalam `JSZip`.
- **Output**: Unduhan berkas misal: `Penghargaan_Alvareza_H_Pratama_PDF_Terpisah.zip`.

### 7.3 Opsi 3: PDF Lengkap (`.pdf`)
- **Input**: Semua gambar dalam urutan resmi katalog.
- **Proses**:
  1. Memanfaatkan generator kompilasi yang telah diuji (seperti `buildAwardsCompilationPdf` atau `buildAdaptivePortfolioPdf`).
  2. Mengompilasi seluruh lembar ke dalam 1 dokumen PDF multi-halaman yang rapi.
  3. **Penyematan Master Digital Signature**:
     - Dokumen PDF multi-halaman dilewatkan ke `pdfDigitalSigner.signPdfBuffer()`.
     - Menggunakan profil `masterDossier` (Level Master).
  4. Berkas PDF hasil tanda tangan langsung diunduh ke browser pengguna sebagai file `.pdf` murni.
- **Output**: Unduhan berkas misal: `Penghargaan_Alvareza_H_Pratama_Lengkap_Signed.pdf`.

---

## 8. Alur Eksekusi Bertahap (Roadmap Implementasi)

Rencana eksekusi akan dibagi ke dalam 4 fase terukur:

### Fase 1: Persiapan Dependensi & Fondasi Kriptografi
- Instalasi paket `jszip`, `node-forge`, `@types/jszip`, `@types/node-forge`.
- Pembuatan file konfigurasi terpusat `src/config/digitalSignatureConfig.ts`.
- Pembuatan modul generator sertifikat X.509 dan PKCS#7 di `src/utils/crypto/certGenerator.ts`.
- Pembuatan modul penyemat tanda tangan digital PDF di `src/utils/crypto/pdfDigitalSigner.ts`.
- Verifikasi unit test kriptografi: Uji coba penandatanganan buffer PDF tiruan dan validasi parsing `/ByteRange`.

### Fase 2: Mesin Konversi Gambar, Single PDF & ZIP Archiver
- Pembuatan `src/utils/export/imageConverter.ts` untuk konversi WebP ke JPEG terkompresi.
- Pembuatan `src/utils/export/singlePdfExporter.ts` untuk pembuatan satu berkas PDF bertanda tangan dari gambar.
- Pembuatan `src/utils/export/zipArchiver.ts` untuk kompresi multi-berkas ke format `.zip`.
- Uji coba performa memori (mencegah *memory leak* melalui pembersihan Object URL dan Garbage Collection kanvas).

### Fase 3: Komponen Dropdown 2-Layer Reusable
- Pembuatan komponen `src/pages/full-view/components/FullViewExportMenu.tsx`.
- Desain state management: `currentLayer` (`'main' | 'download'`), `isProcessing`, `progressStatus`.
- Penataan animasi transisi Tailwind yang halus (*fade-in*, *slide-in*).
- Penanganan responsif pada layar ponsel (*mobile bottom-sheet*) dan layar desktop (*dropdown popover*).

### Fase 4: Integrasi Menyeluruh & Verifikasi Adobe Reader
- Integrasi `FullViewExportMenu` ke 6 halaman Full View:
  1. `awards.tsx`
  2. `certification.tsx`
  3. `portfolio.tsx`
  4. `academic.tsx`
  5. `identity.tsx`
  6. `pdf.tsx`
- Pengujian build & lint (`compile_applet` & `lint_applet`).
- Pengujian rangkaian Vitest (`npm test`).
- Verifikasi file PDF hasil unduhan pada pembaca PDF (Adobe Acrobat Reader) untuk mengonfirmasi stempel kriptografi valid.

---

## 9. Catatan Khusus & Mitigasi Risiko

1. **Performa Memori di Ponsel (Low-End Mobile)**:
   - Jika pengguna memilih *Gambar Terpisah* pada 19 piagam di ponsel dengan RAM terbatas, konversi 19 canvas sekaligus dapat memicu beban memori.
   - **Solusi**: Konversi dijalankan secara berurutan (*sequential processing*) dengan *micro-task yielding* (`await new Promise(r => setTimeout(r, 10))`), sehingga UI tetap 60fps tanpa membeku.
2. **Kompatibilitas Sertifikat Mandiri (Self-Signed vs Trusted Root CA)**:
   - Secara default, sertifikat yang di-generate aplikasi adalah *Self-Signed Root CA* milik **Digital Profile Authority**.
   - Di Adobe Acrobat Reader, sertifikat akan terbaca sah dengan algoritma RSA 2048-bit, dan status dokumen dinyatakan *Unmodified*.
   - Jika pengguna nantinya memiliki sertifikat resmi berbayar (PKCS#12 `.p12` dari GlobalSign / Digicert / Peruri / BSrE), file `digitalSignatureConfig.ts` telah dirancang agar bisa langsung menampung Private Key dan Certificate Chain tersebut tanpa mengubah kode mesin penandatanganan.

---

## 10. Status Persetujuan & Kesiapan Eksekusi

Dokumen rencana ini telah rampung disusun secara komprehensif, terukur, dan mencakup seluruh aspek arsitektural. Rencana ini siap dieksekusi begitu Anda memberikan arahan untuk melanjutkan implementasi ke tahap pengkodean!
