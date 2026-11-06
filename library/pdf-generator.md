# Panduan Arsitektur & Pembuatan PDF A4 untuk Laporan dan Dokumen Resmi

Dokumen ini merupakan panduan teknis universal bagi pengembang (*software engineers*) untuk merancang, mengonversi, dan memanipulasi dokumen menjadi berkas **PDF A4 presisi tinggi**. Panduan ini mencakup konversi teks terstruktur (laporan bisnis, laporan operasional, faktur, surat dinas, proposal), penyisipan grafik/gambar, pratinjau modal *real-time* yang 100% identik (*pixel-perfect WYSIWYG*), optimasi kompresi, hingga mekanisme cetak monokrom (*Black & White / Grayscale*).

---

## Daftar Isi
1. [Standar & Dimensi Dokumen A4 (ISO 216)](#1-standar--dimensi-dokumen-a4-iso-216)
2. [Ekosistem & Pustaka (Libraries) yang Wajib Diinstal](#2-ekosistem--pustaka-libraries-yang-wajib-diinstal)
3. [Arsitektur Konversi Teks ke Laporan PDF A4 Presisi Tinggi](#3-arsitektur-konversi-teks-ke-laporan-pdf-a4-presisi-tinggi)
   - Struktur Anatomi Laporan (Kop Dokumen, Judul, Metadata, Paragraf, Tabel)
   - Algoritma Auto-Wrapping & Auto-Pagination (Batas Margin)
   - Penomoran Halaman Dinamis (*"Halaman X dari Y"*)
4. [Mekanisme Modal Pratinjau 1:1 (*Pixel-Perfect WYSIWYG*)](#4-mekanisme-modal-pratinjau-11-pixel-perfect-wysiwyg)
   - Mengapa Pratinjau HTML Biasa Menipu?
   - Pola Rekayasa: In-Memory Binary PDF → `pdfjs-dist` → Canvas Retina 2x
   - Komponen React Modal Laporan Lengkap
5. [Penyisipan & Konversi Gambar ke PDF (Grafik, Foto, Lampiran Laporan)](#5-penyisipan--konversi-gambar-ke-pdf-grafik-foto-lampiran-laporan)
   - Perhitungan Proporsi (Contain vs Full-Bleed A4)
   - Kompresi Gambar Cerdas agar Berkas Ringan (< 1–2 MB)
6. [Mekanisme Black & White (BW / Monokrom / Grayscale)](#6-mekanisme-black--white-bw--monokrom--grayscale)
   - Mengapa Mode BW Krusial untuk Dokumen Laporan Kantor?
   - Algoritma Luminance Pixel Manipulation (Kanvas Grayscale)
   - Binary Thresholding (Efek Scanner / Fotokopi Bersih)
7. [Penggabungan & Pemisahan Multi-Dokumen (`pdf-lib`)](#7-penggabungan--pemisahan-multi-dokumen-pdf-lib)
8. [Matriks Diagnosa Masalah & Solusi (*Troubleshooting*)](#8-matriks-diagnosa-masalah--solusi-troubleshooting)

---

## 1. Standar & Dimensi Dokumen A4 (ISO 216)

Dalam sistem cetak internasional, ukuran standar dokumen dan laporan resmi adalah **A4** dengan perbandingan rasio aspek $\sqrt{2} \approx 1:1.4142$.

| Satuan Ukuran | Dimensi (Lebar × Tinggi) | Rasio Aspek | Kegunaan dalam Rekayasa Web & PDF |
| :--- | :--- | :--- | :--- |
| **Milimeter (mm)** | `210 mm × 297 mm` | 1 : 1.4143 | Standar acuan printer fisik & parameter utama `jsPDF` |
| **Points (pt)** | `595.28 pt × 841.89 pt` | 1 : 1.4142 | Standar PostScript / PDF (`pdf-lib`), 72 points per inch |
| **CSS Pixel (96 DPI)**| `794 px × 1123 px` | 1 : 1.4143 | Standar render browser web (`1 in = 96 px = 25.4 mm`) |
| **Layar Retina (192 DPI)**| `1588 px × 2246 px` | 1 : 1.4143 | Standar rendering pratinjau tajam (2.0x scale viewport) |
| **Cetak HD (300 DPI)**| `2480 px × 3508 px` | 1 : 1.4145 | Kualitas cetak offset / dokumen arsip negara |

### Vektor Murni vs Raster HTML Screenshot
Terdapat dua pendekatan mendasar saat mengubah data web menjadi PDF:
1. **Direct Vector Generation (Sangat Direkomendasikan)**: Teks digambar menggunakan instruksi biner font PDF (`doc.text()`).
   - Teks **dapat disorot (selectable)**, disalin (*copy-paste*), dicari (*searchable* via `Ctrl+F`), dan dibaca oleh parser otomatis.
   - Ukuran berkas sangat kecil (umumnya hanya 30 KB – 150 KB untuk laporan multi-halaman).
   - Teks tetap tajam berapapun level zoom (100% hingga 1000%).
2. **Raster Screenshot (`html2canvas`)**: Mengambil *snapshot* DOM menjadi bitmap gambar lalu ditempelkan ke PDF.
   - Digunakan **hanya** jika dokumen memiliki tata letak grafis yang sangat acak atau elemen chart SVG yang sulit dipetakan ulang.
   - Kelemahan: Teks menjadi gambar mati, tidak bisa di-copy, font buram saat di-zoom, dan ukuran berkas membengkak (2 MB – 6 MB per lembar).

---

## 2. Ekosistem & Pustaka (Libraries) yang Wajib Diinstal

Instal dependensi inti berikut ke dalam proyek Node.js / Vite / Next.js:

```bash
# 1. Mesin Pembuat Dokumen PDF Vektor (Text, Shapes, Lines, Tables)
npm install jspdf

# 2. Mesin Manipulasi, Penggabung (Merge), & Pemecah (Split) PDF
npm install pdf-lib

# 3. Mesin Parser & Renderer PDF Resmi dari Mozilla (Untuk Modal Preview 1:1)
npm install pdfjs-dist

# 4. Optional: Rasterizer DOM (Jika perlu men-capture bagan/grafik interaktif dari layar)
npm install html2canvas

# 5. Type Definitions untuk TypeScript
npm install -D @types/node
```

### Kapan Menggunakan Pustaka yang Mana?

```
┌────────────────────────────────────────────────────────────────────────┐
│                          Kebutuhan Pengembang                          │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
          ┌─────────────────────────┴─────────────────────────┐
          ▼                                                   ▼
[ Membuat Dokumen Baru ]                            [ Mengolah PDF yang Ada ]
(Laporan, Faktur, Berita Acara)                     (Merge Lampiran, Split, Watermark)
          │                                                   │
          ▼                                                   ▼
       `jsPDF`                                             `pdf-lib`
          │
          ├───────────────────────────────────────────────────┐
          ▼                                                   ▼
[ Ingin Menampilkan Preview 1:1 di Modal ]          [ Ingin Download Langsung ]
(Tanpa distorsi font, persis aslinya)               (Simpan ke komputer pengguna)
          │                                                   │
          ▼                                                   ▼
     `pdfjs-dist`                                        `doc.save()`
(Render ke Canvas High-DPI)
```

---

## 3. Arsitektur Konversi Teks ke Laporan PDF A4 Presisi Tinggi

### 3.1 Anatomi Tata Letak Laporan Resmi
Laporan formal umumnya memiliki hierarki elemen sebagai berikut:
1. **Kop Dokumen / Header**: Logo instansi/perusahaan, nama lembaga, alamat, kontak, dan garis pemisah ganda.
2. **Nomor & Metadata Dokumen**: Tanggal terbit, nomor surat/dokumen, divisi pengesah, status (Draft / Final).
3. **Judul Laporan**: Tipografi tebal (14–18 pt), center atau left-aligned.
4. **Ringkasan Eksekutif (*Executive Summary*)**: Kotak berlatar abu-abu tipis atau paragraf pengantar dengan aksen garis vertikal di sebelah kiri.
5. **Tabel Data & Metrik**: Kolom data tabular terstruktur dengan header berlatar kontras.
6. **Isi Pembahasan**: Teks dinamis dengan *auto-wrapping* dan margin yang terjaga.
7. **Blok Pengesahan (Tanda Tangan / Stempel)**: Diposisikan di bawah pembahasan dengan proteksi agar tidak terpisah sendirian di halaman baru.
8. **Footer Dinamis**: Keterangan rahasia (*Confidentiality clause*) dan nomor halaman ("Halaman 1 dari 4").

### 3.2 Inisialisasi Kanvas & Sistem Koordinat Milimeter

```typescript
import { jsPDF } from 'jspdf';

export function initReportDocument(): {
  doc: jsPDF;
  pageWidth: number;
  pageHeight: number;
  margin: number;
  contentWidth: number;
} {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true, // Kompresi stream internal FlateDecode
  });

  const pageWidth = doc.internal.pageSize.getWidth();   // 210 mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297 mm
  const margin = 15;                                    // 15 mm margin aman
  const contentWidth = pageWidth - margin * 2;          // 180 mm lebar efektif

  return { doc, pageWidth, pageHeight, margin, contentWidth };
}
```

### 3.3 Penanganan Auto-Wrapping & Deteksi Batas Halaman (Auto-Pagination)
Kunci laporan yang rapi adalah menghitung kursor $Y$ secara deterministik sebelum teks digambar:

```typescript
export interface ReportCursorState {
  currentY: number;
  pageIndex: number;
}

/**
 * Memastikan jika penambahan teks melebihi batas bawah, lembar halaman baru dibuat
 * dan kursor dikembalikan ke batas atas margin.
 */
export function checkAndPageBreak(
  doc: jsPDF,
  currentY: number,
  neededHeightMm: number,
  margin = 15
): number {
  const pageHeight = doc.internal.pageSize.getHeight();
  const bottomThreshold = pageHeight - margin - 10; // Sisakan 10mm untuk footer

  if (currentY + neededHeightMm > bottomThreshold) {
    doc.addPage();
    return margin + 5; // Posisi awal Y pada halaman selanjutnya
  }
  return currentY;
}

/**
 * Mencetak paragraf teks dinamis dengan pemecahan kata otomatis (word-wrapping).
 */
export function drawParagraph(
  doc: jsPDF,
  text: string,
  startX: number,
  startY: number,
  maxWidthMm: number,
  fontSizePt = 10,
  lineHeightFactor = 1.3,
  isBold = false
): number {
  doc.setFont('helvetica', isBold ? 'bold' : 'normal');
  doc.setFontSize(fontSizePt);
  doc.setTextColor(30, 41, 59); // Slate-800

  // Konversi satuan font point ke millimeter: 1 pt ≈ 0.352778 mm
  const lineSpacingMm = fontSizePt * 0.352778 * lineHeightFactor;

  // jsPDF memotong kalimat panjang menjadi baris-baris sesuai maxWidthMm
  const lines: string[] = doc.splitTextToSize(text, maxWidthMm);

  let cursorY = startY;
  for (const line of lines) {
    cursorY = checkAndPageBreak(doc, cursorY, lineSpacingMm);
    doc.text(line, startX, cursorY);
    cursorY += lineSpacingMm;
  }

  return cursorY;
}
```

### 3.4 Generator Laporan Lengkap (Kop Dokumen, Judul, Tabel, dan Footer)

```typescript
export interface ReportData {
  companyName: string;
  companyAddress: string;
  reportTitle: string;
  reportNumber: string;
  date: string;
  author: string;
  summary: string;
  tableData: { no: number; item: string; category: string; value: string }[];
  contentParagraphs: string[];
}

export function buildOfficialReportPdf(data: ReportData): jsPDF {
  const { doc, pageWidth, pageHeight, margin, contentWidth } = initReportDocument();
  let currentY = margin;

  // ==========================================
  // 1. KOP SURAT / DOKUMEN
  // ==========================================
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42); // Deep Navy Slate
  doc.text(data.companyName.toUpperCase(), margin, currentY);
  currentY += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139); // Slate-500
  doc.text(data.companyAddress, margin, currentY);
  currentY += 4;

  // Garis Pembatas Ganda Kop Surat
  doc.setDrawColor(30, 41, 59);
  doc.setLineWidth(0.6);
  doc.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 1;
  doc.setLineWidth(0.2);
  doc.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 8;

  // ==========================================
  // 2. JUDUL LAPORAN & METADATA
  // ==========================================
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42);
  doc.text(data.reportTitle, margin, currentY);
  currentY += 6;

  // Metadata Bar (No. Laporan, Tanggal, Penyusun)
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(`No. Dokumen: ${data.reportNumber}`, margin, currentY);
  doc.text(`Tanggal: ${data.date}`, margin + 80, currentY);
  doc.text(`Disusun Oleh: ${data.author}`, margin + 130, currentY);
  currentY += 6;

  // Garis Tipis Pembatas Subjudul
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 6;

  // ==========================================
  // 3. RINGKASAN EKSEKUTIF (CALLOUT BOX)
  // ==========================================
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text('I. RINGKASAN EKSEKUTIF', margin, currentY);
  currentY += 4;

  // Hitung tinggi teks ringkasan untuk background kotak
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  const summaryLines = doc.splitTextToSize(data.summary, contentWidth - 10);
  const summaryHeight = summaryLines.length * 4.2 + 6;

  // Kotak abu-abu lembut
  doc.setFillColor(248, 250, 252); // Slate-50
  doc.setDrawColor(203, 213, 225); // Slate-300
  doc.rect(margin, currentY, contentWidth, summaryHeight, 'FD');

  // Aksen garis vertikal tebal biru di sisi kiri kotak
  doc.setFillColor(37, 99, 235); // Blue-600
  doc.rect(margin, currentY, 2, summaryHeight, 'F');

  doc.setTextColor(51, 65, 85);
  doc.text(summaryLines, margin + 6, currentY + 5);
  currentY += summaryHeight + 8;

  // ==========================================
  // 4. TABEL DATA LAPORAN
  // ==========================================
  currentY = checkAndPageBreak(doc, currentY, 40, margin);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text('II. REKAPITULASI DATA UTAMA', margin, currentY);
  currentY += 5;

  // Header Kolom Tabel
  const colWidths = [12, 70, 48, 50]; // Total = 180mm (sama dengan contentWidth)
  const headerHeight = 7;

  doc.setFillColor(15, 23, 42); // Latar gelap header tabel
  doc.rect(margin, currentY, contentWidth, headerHeight, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);

  let colX = margin;
  doc.text('No', colX + 3, currentY + 4.8);
  colX += colWidths[0];
  doc.text('Deskripsi Parameter / Posisi', colX + 3, currentY + 4.8);
  colX += colWidths[1];
  doc.text('Kategori', colX + 3, currentY + 4.8);
  colX += colWidths[2];
  doc.text('Nilai / Realisasi', colX + 3, currentY + 4.8);

  currentY += headerHeight;

  // Baris-baris Data Tabel
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  const rowHeight = 6.5;

  data.tableData.forEach((row, idx) => {
    currentY = checkAndPageBreak(doc, currentY, rowHeight, margin);

    // Striping abu-abu bergantian untuk keterbacaan
    if (idx % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, currentY, contentWidth, rowHeight, 'F');
    }

    doc.setTextColor(30, 41, 59);
    let cellX = margin;
    doc.text(String(row.no), cellX + 3, currentY + 4.5);
    cellX += colWidths[0];
    doc.text(row.item, cellX + 3, currentY + 4.5);
    cellX += colWidths[1];
    doc.text(row.category, cellX + 3, currentY + 4.5);
    cellX += colWidths[2];
    doc.text(row.value, cellX + 3, currentY + 4.5);

    // Garis pembatas bawah baris
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, currentY + rowHeight, margin + contentWidth, currentY + rowHeight);

    currentY += rowHeight;
  });

  currentY += 8;

  // ==========================================
  // 5. ISI PEMBAHASAN LAPORAN (PARAGRAF DINAMIS)
  // ==========================================
  currentY = checkAndPageBreak(doc, currentY, 20, margin);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text('III. ANALISIS & EVALUASI OPERASIONAL', margin, currentY);
  currentY += 5;

  for (const para of data.contentParagraphs) {
    currentY = drawParagraph(doc, para, margin, currentY, contentWidth, 9.5, 1.35);
    currentY += 4; // Jeda antar paragraf
  }

  // ==========================================
  // 6. FOOTER DINAMIS PADA SETIAP HALAMAN
  // ==========================================
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    const footerY = pageHeight - margin + 5;

    // Garis halus di atas footer
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.3);
    doc.line(margin, footerY - 4, pageWidth - margin, footerY - 4);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184); // Slate-400
    doc.text(`Dokumen Resmi: ${data.reportTitle} — Rahasia & Terbatas`, margin, footerY);

    // Nomor Halaman Rata Kanan
    const pageText = `Halaman ${i} dari ${totalPages}`;
    doc.text(pageText, pageWidth - margin - doc.getTextWidth(pageText), footerY);
  }

  return doc;
}
```

---

## 4. Mekanisme Modal Pratinjau 1:1 (*Pixel-Perfect WYSIWYG*)

### 4.1 Mengapa Pratinjau Berbasis HTML/CSS Sering Tidak Akurat?
Sering kali pengembang membuat pratinjau dokumen dengan merender elemen HTML (misal komponen `<div>` dengan Tailwind CSS) di layar, lalu ketika tombol "Unduh" ditekan, fungsi `jsPDF` dipanggil secara terpisah.

Masalah mendasar yang selalu muncul:
- **Perbedaan Line-Wrap Teks**: Browser web menggunakan mesin render font OS (DirectWrite di Windows, CoreText di macOS), sedangkan PDF viewer membaca koordinat glyph PDF langsung. Kata terakhir pada baris ke-3 di HTML bisa berpindah ke baris ke-4 di PDF asli.
- **Tumpahan Halaman Tersembunyi (*Phantom Page Breaks*)**: Di layar HTML, dokumen terlihat rapi 1 halaman. Namun saat diunduh, 2 baris terakhir tumpah ke halaman 2, merusak tampilan laporan.
- **Skala Rasio Aspek**: Rasio layar ponsel dan laptop yang bervariasi dapat mendistorsi margin jika hanya mengandalkan CSS responsif biasa.

### 4.2 Solusi Standar Emas: In-Memory PDF Rendering via `pdfjs-dist`
Prinsip utamanya adalah: **Hanya ada satu berkas PDF yang dibuat**, yaitu berkas biner di memori. Pratinjau di dalam modal adalah gambar hasil *raster* langsung dari berkas biner tersebut menggunakan pustaka `pdfjs-dist`:

```
                 [ User Mengubah Parameter Laporan ]
                                  │
                                  ▼
                 [ Generate jsPDF Document di Memori ]
                                  │
                                  ▼
                 [ ArrayBuffer = doc.output('arraybuffer') ]
                                  │
                                  ▼
                 [ pdfjs-dist Memuat Buffer Dokumen ]
                                  │
                  ┌───────────────┴───────────────┐
                  ▼                               ▼
          Halaman 1 (Canvas)              Halaman 2 (Canvas)
        (Skala 2.0x Retina)             (Skala 2.0x Retina)
                  │                               │
                  ▼                               ▼
             DataURL PNG                     DataURL PNG
                  │                               │
                  └───────────────┬───────────────┘
                                  ▼
                    [ Tampilkan di Modal Pratinjau ]
                 (100% Identik dengan Hasil Unduhan)
```

### 4.3 Implementasi Fungsi Render Halaman PDF ke Gambar

```typescript
import * as pdfjsLib from 'pdfjs-dist';
import { jsPDF } from 'jspdf';

// Konfigurasi Web Worker resmi pdfjs-dist
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version || '4.10.38'}/build/pdf.worker.min.mjs`;
}

/**
 * Merender setiap lembar halaman dokumen jsPDF menjadi array PNG Data URL (Crisp 2.0x High-DPI).
 */
export async function renderPdfToHighResImages(doc: jsPDF): Promise<string[]> {
  try {
    const arrayBuffer = doc.output('arraybuffer');
    const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
    const pdfDoc = await loadingTask.promise;

    const pageImages: string[] = [];

    for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
      const page = await pdfDoc.getPage(pageNum);

      // Skala 2.0x menjamin teks laporan tajam di layar Retina / ponsel
      const viewport = page.getViewport({ scale: 2.0 });

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      if (ctx) {
        await page.render({
          canvasContext: ctx,
          viewport,
          canvas,
        }).promise;

        pageImages.push(canvas.toDataURL('image/png'));
      }
    }

    return pageImages;
  } catch (err) {
    console.error('Gagal merender halaman PDF ke kanvas:', err);
    return [];
  }
}
```

### 4.4 Komponen React Modal Pratinjau Laporan Presisi Tinggi

```tsx
import React, { useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';
import { renderPdfToHighResImages } from './pdfReportUtils';

interface ReportPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfDoc: jsPDF | null;
  filename?: string;
}

export const ReportPreviewModal: React.FC<ReportPreviewModalProps> = ({
  isOpen,
  onClose,
  pdfDoc,
  filename = 'Laporan_Resmi.pdf',
}) => {
  const [pages, setPages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  useEffect(() => {
    if (!isOpen || !pdfDoc) return;

    let isMounted = true;
    setIsLoading(true);

    renderPdfToHighResImages(pdfDoc).then((renderedPages) => {
      if (isMounted) {
        setPages(renderedPages);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [isOpen, pdfDoc]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-sm p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="relative flex flex-col w-full max-w-5xl h-[92vh] bg-slate-100 rounded-2xl shadow-2xl overflow-hidden border border-slate-700">
        
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-white border-b border-slate-200 z-10">
          <div className="flex items-center gap-3">
            <span className="p-2 bg-blue-50 text-blue-600 rounded-lg font-bold text-sm">PDF A4</span>
            <div>
              <h3 className="font-semibold text-slate-900 text-sm sm:text-base leading-tight">{filename}</h3>
              <p className="text-xs text-slate-500">{pages.length} Halaman Dokumen Terverifikasi</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Zoom Controls */}
            <div className="hidden sm:flex items-center bg-slate-100 rounded-lg p-1 border border-slate-200 text-xs text-slate-700">
              <button
                onClick={() => setZoomLevel((z) => Math.max(70, z - 15))}
                className="px-2 py-1 hover:bg-white rounded transition"
              >
                -
              </button>
              <span className="px-2 font-medium">{zoomLevel}%</span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(150, z + 15))}
                className="px-2 py-1 hover:bg-white rounded transition"
              >
                +
              </button>
            </div>

            {/* Action Buttons */}
            <button
              onClick={() => pdfDoc?.save(filename)}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm transition active:scale-95"
            >
              Unduh PDF Asli
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Scrollable Viewport Kertas A4 */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-200 flex flex-col items-center gap-8">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center my-auto py-24 text-slate-500 gap-3">
              <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-medium animate-pulse">Merender pratinjau A4 presisi tinggi...</p>
            </div>
          ) : (
            pages.map((imgSrc, pageIdx) => (
              <div
                key={pageIdx}
                className="relative bg-white shadow-2xl rounded-sm border border-slate-300 transition-all duration-200"
                style={{
                  width: `${(620 * zoomLevel) / 100}px`,
                  aspectRatio: '210 / 297', // Mengunci rasio A4 persis
                }}
              >
                {/* Badge Nomor Lembar */}
                <div className="absolute top-2 right-2 px-2 py-0.5 bg-slate-900/60 backdrop-blur text-white text-[10px] rounded font-mono">
                  Hal. {pageIdx + 1}
                </div>

                <img
                  src={imgSrc}
                  alt={`Halaman ${pageIdx + 1}`}
                  className="w-full h-full object-contain select-none block"
                  loading="lazy"
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
```

---

## 5. Penyisipan & Konversi Gambar ke PDF (Grafik, Foto, Lampiran Laporan)

Laporan operasional sering memuat bagan performa, foto inspeksi lapangan, atau lampiran bukti transaksi.

### 5.1 Menghitung Skala Pas (*Fit*) di Lembar A4
Terdapat dua mode penempatan citra pada halaman PDF A4:

```typescript
import { jsPDF } from 'jspdf';

export function placeImageOnA4Page(
  doc: jsPDF,
  imageDataUrl: string,
  imgWidthPx: number,
  imgHeightPx: number,
  mode: 'contain' | 'full-bleed' = 'contain',
  marginMm = 15
) {
  const pageWidth = doc.internal.pageSize.getWidth();   // 210 mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297 mm

  if (mode === 'full-bleed') {
    // Gambar memenuhi seluruh halaman dari ujung ke ujung tanpa margin (misal: Cover Laporan)
    doc.addImage(imageDataUrl, 'JPEG', 0, 0, pageWidth, pageHeight, undefined, 'FAST');
    return;
  }

  // Mode Contain: Menyesuaikan aspek rasio di dalam batas margin
  const availWidth = pageWidth - marginMm * 2;
  const availHeight = pageHeight - marginMm * 2;

  const imgAspect = imgWidthPx / imgHeightPx;
  const availAspect = availWidth / availHeight;

  let finalW = availWidth;
  let finalH = availHeight;

  if (imgAspect > availAspect) {
    // Gambar lebih memanjang ke samping (landscape)
    finalW = availWidth;
    finalH = availWidth / imgAspect;
  } else {
    // Gambar lebih memanjang ke bawah (portrait)
    finalH = availHeight;
    finalW = availHeight * imgAspect;
  }

  // Posisikan tepat di tengah area kerja (center-aligned)
  const posX = marginMm + (availWidth - finalW) / 2;
  const posY = marginMm + (availHeight - finalH) / 2;

  doc.addImage(imageDataUrl, 'JPEG', posX, posY, finalW, finalH, undefined, 'FAST');
}
```

### 5.2 Kompresi Kanvas Gambar Adaptif
Jika pengguna melampirkan 8 foto dokumentasi masing-masing berukuran 4 MB dari kamera ponsel, PDF dapat membengkak hingga 32 MB. Fungsi ini mengecilkan dimensi maksimum piksel dan melakukan re-encoding JPEG sebelum diserahkan ke `jsPDF`:

```typescript
export async function optimizeImageForReport(
  fileOrUrl: File | string,
  maxDimension = 1600, // Batas resolusi (misal 1600px sudah sangat tajam untuk A4)
  jpegQuality = 0.75   // Kualitas kompresi 75% memangkas ukuran hingga 80% tanpa artefak visual
): Promise<{ dataUrl: string; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      let w = img.naturalWidth || img.width;
      let h = img.naturalHeight || img.height;

      // Rescaling proporsional jika melebihi batas
      if (w > maxDimension || h > maxDimension) {
        if (w > h) {
          h = Math.round((h * maxDimension) / w);
          w = maxDimension;
        } else {
          w = Math.round((w * maxDimension) / h);
          h = maxDimension;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');

      if (!ctx) return reject(new Error('Canvas 2D Context tidak tersedia'));

      // Lapisan dasar putih (mencegah PNG transparan berubah menjadi hitam pekat saat disimpan sebagai JPEG)
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, w, h);

      ctx.drawImage(img, 0, 0, w, h);

      const optimizedDataUrl = canvas.toDataURL('image/jpeg', jpegQuality);
      resolve({ dataUrl: optimizedDataUrl, width: w, height: h });
    };

    img.onerror = () => reject(new Error('Gagal memuat gambar untuk dioptimasi'));

    if (typeof fileOrUrl === 'string') {
      img.src = fileOrUrl;
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(fileOrUrl);
    }
  });
}
```

---

## 6. Mekanisme Black & White (BW / Monokrom / Grayscale)

### 6.1 Mengapa Fitur Black & White Penting pada Laporan?
1. **Efisiensi Cetak & Penghematan Tinta Kantor**: Sebagian besar printer kantor mencetak laporan harian dalam mode monokrom.
2. **Keterbacaan Hasil Fotokopi**: Bagan berwarna biru tua dan teks merah sering kali berubah menjadi abu-abu gelap yang sulit dibedakan jika difotokopi. Mode BW dengan *contrast boost* menjamin keterbacaan tinggi.
3. **Optimasi OCR & Ukuran Data**: Format dokumen monokrom mengurangi kompleksitas warna sehingga mempercepat pemrosesan arsip digital.

### 6.2 Rumus Luminance Grayscale Standar (ITU-R BT.601)
Konversi warna RGB ke nilai kecerahan tunggal menggunakan bobot spektral mata manusia:
$$Y = 0.299 \times R + 0.587 \times G + 0.114 \times B$$

### 6.3 Algoritma Pengubah Gambar Berwarna Menjadi Grayscale / Monokrom Tajam

```typescript
/**
 * Mengubah gambar berwarna menjadi format Grayscale alami atau Monokrom tajam (BW Fotokopi).
 */
export async function convertReportImageToBw(
  imageDataUrl: string,
  options: {
    isBinaryBw?: boolean; // True: Hitam-Putih 1-bit murni; False: Grayscale bertingkat (DeviceGray)
    contrastBoost?: number; // Tambahan kontras (-100 hingga +100, default +20)
    threshold?: number;     // Titik potong hitam/putih (0 - 255, default 135)
  } = {}
): Promise<string> {
  const { isBinaryBw = false, contrastBoost = 20, threshold = 135 } = options;

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext('2d');

      if (!ctx) return reject(new Error('Canvas 2D Context tidak tersedia'));

      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      // Rumus penyesuaian kontras matematis
      const contrastFactor = (259 * (contrastBoost + 255)) / (255 * (259 - contrastBoost));

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // 1. Hitung Luminance
        let gray = 0.299 * r + 0.587 * g + 0.114 * b;

        // 2. Tingkatkan Kontras agar teks dokumen lebih jelas
        gray = contrastFactor * (gray - 128) + 128;
        gray = Math.min(255, Math.max(0, gray));

        if (isBinaryBw) {
          // 3a. Binary Thresholding (Hitam pekat atau Putih bersih)
          const val = gray >= threshold ? 255 : 0;
          data[i] = val;
          data[i + 1] = val;
          data[i + 2] = val;
        } else {
          // 3b. Grayscale Halus
          data[i] = gray;
          data[i + 1] = gray;
          data[i + 2] = gray;
        }
      }

      ctx.putImageData(imgData, 0, 0);
      resolve(canvas.toDataURL('image/jpeg', 0.85));
    };

    img.onerror = () => reject(new Error('Gagal memuat gambar untuk konversi BW'));
    img.src = imageDataUrl;
  });
}
```

### 6.4 Palet Monokrom Programatik di `jsPDF`
Jika pengguna memilih opsi cetak laporan "Hitam Putih":
```typescript
export function applyMonochromePalette(isBw: boolean) {
  return {
    headerColor: isBw ? [0, 0, 0] : [15, 23, 42],
    titleColor: isBw ? [0, 0, 0] : [30, 41, 59],
    bodyColor: isBw ? [40, 40, 40] : [51, 65, 85],
    accentFill: isBw ? [240, 240, 240] : [248, 250, 252],
    lineColor: isBw ? [100, 100, 100] : [203, 213, 225],
  };
}
```

---

## 7. Penggabungan & Pemisahan Multi-Dokumen (`pdf-lib`)

Dalam laporan bisnis lengkap, Anda sering kali perlu menggabungkan **Laporan Utama** yang digenerate dari `jsPDF` dengan **Dokumen Lampiran Tambahan** (misal PDF lampiran faktur, surat audit, atau sertifikasi yang diunggah pengguna).

### 7.1 Menggabungkan Dokumen di Sisi Klien (*Client-Side Merging*)

```typescript
import { PDFDocument } from 'pdf-lib';
import { jsPDF } from 'jspdf';

/**
 * Menggabungkan laporan jsPDF utama dengan array berkas PDF lampiran eksternal.
 */
export async function mergeReportWithAttachments(
  mainDoc: jsPDF,
  attachmentPdfs: ArrayBuffer[]
): Promise<Uint8Array> {
  // 1. Buat dokumen master menggunakan pdf-lib
  const finalPdf = await PDFDocument.create();

  // 2. Muat dan salin halaman laporan utama (jsPDF)
  const mainPdfBuffer = mainDoc.output('arraybuffer');
  const loadedMainPdf = await PDFDocument.load(mainPdfBuffer);
  const mainPages = await finalPdf.copyPages(loadedMainPdf, loadedMainPdf.getPageIndices());
  mainPages.forEach((page) => finalPdf.addPage(page));

  // 3. Muat dan gabungkan setiap lampiran
  for (const attachBuffer of attachmentPdfs) {
    const loadedAttachPdf = await PDFDocument.load(attachBuffer);
    const attachPages = await finalPdf.copyPages(loadedAttachPdf, loadedAttachPdf.getPageIndices());
    attachPages.forEach((page) => finalPdf.addPage(page));
  }

  // 4. Hasilkan biner gabungan
  return await finalPdf.save();
}

/**
 * Trigger download file gabungan biner ke browser
 */
export function downloadMergedPdf(bytes: Uint8Array, filename = 'Laporan_Lengkap_Beserta_Lampiran.pdf') {
  const blob = new Blob([bytes], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
```

---

## 8. Matriks Diagnosa Masalah & Solusi (*Troubleshooting*)

| Gejala Kendala | Faktor Penyebab Utama | Solusi Teruji |
| :--- | :--- | :--- |
| **Pratinjau modal terlihat buram di layar Retina / ponsel** | Kanvas preview dirender dengan resolusi standar `1.0x` (96 DPI). | Gunakan parameter `page.getViewport({ scale: 2.0 })` saat memanggil `pdfjs-dist`. |
| **Error `workerSrc` atau Web Worker 404** | Bundler modern (Vite / Next.js) tidak menyertakan script worker secara otomatis. | Set `pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@<version>/build/pdf.worker.min.mjs'` di luar daur hidup komponen. |
| **Gambar transparan PNG berubah jadi latar hitam pekat** | Format kompresi JPEG tidak mendukung kanal alpha (transparansi), sehingga warna transparan diubah ke hitam (RGB: 0,0,0). | Isi seluruh latar kanvas dengan warna putih (`ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0,0,w,h);`) sebelum menempelkan citra. |
| **Teks laporan menimpa margin bawah atau header baru** | Koordinat kursor vertikal `currentY` tidak di-reset setelah pemanggilan `doc.addPage()`. | Selalu update variabel `currentY = topMargin` segera setelah fungsi `doc.addPage()` dieksekusi. |
| **Peramban terasa lambat setelah sering membuka modal** | Blob URL yang dihasilkan `URL.createObjectURL(blob)` tidak pernah dibersihkan dari memori peramban. | Selalu panggil `URL.revokeObjectURL(url)` pada fungsi *cleanup* `useEffect` atau setelah pengunduhan berkas selesai. |
| **Judul bab berada di dasar halaman tanpa konten (*Orphan Title*)** | Kurangnya proteksi batas minimum (*keep-together lookahead*). | Periksa apakah sisa ruang halaman masih mencukupi untuk judul + minimal 2 baris paragraf pertama sebelum menggambar judul. |

---

*Panduan arsitektur ini dirancang sebagai standar baku pembuatan laporan dan konversi dokumen PDF presisi tinggi di lingkungan aplikasi web modern.*
