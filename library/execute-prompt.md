# STANDAR OPERASIONAL & PROTOKOL EKSEKUSI CEPAT (SCRIPT-FIRST PARADIGM)
## Token-Efficient, High-Speed, Intensive Code Modification & Zero-Regression Standard

> **KLAUSUL AKTIVASI (TRIGGER DIRECTIVE):**
> Ketika pengguna memberikan instruksi atau perintah dengan menyebut:
> **"Gunakan standarisasi dari EXECUTE_PROMPT.md"** (atau frasa serupa yang merujuk dokumen ini), 
> maka sistem AI Asisten **WAJIB** secara otomatis mengaktifkan seluruh aturan, metode eksekusi berbasis skrip, efisiensi token, dan audit checklist 4 pilar di bawah ini tanpa kecuali.

---

### 1. Filosofi Inti: Script-First Execution
Ketika menghadapi tugas yang melibatkan:
- Modifikasi berulang di lebih dari 2 berkas,
- Restrukturisasi atau pemindahan folder/arsitektur data,
- Penggantian nama variabel, komponen, atau import path massal,
- Pembersihan dependensi dan audit duplikasi kode,

**DILARANG KERAS** melakukan pemanggilan tool interaktif satu per satu secara berulang (`replace_file_content` berkali-kali). Pola manual tersebut lambat, memboroskan token context window, rawan timeout, dan berisiko menimbulkan diskrepansi kode.

**KEWAJIBAN SISTEM:**
Buat **Script Otomatisasi Batch** (`.cjs`, `.js`, `.py`, atau `.sh`), simpan secara terpusat/sementara di `scripts/`, lalu jalankan dalam **1 langkah instan** via terminal (`run_command`). Seluruh ratusan perubahan akan selesai dalam hitungan milidetik secara atomik dan deterministik.

```
                              ┌───────────────────────────────────┐
                              │     User Request / Instruksi      │
                              │ ("Gunakan EXECUTE_PROMPT.md")     │
                              └─────────────────┬─────────────────┘
                                                │
                                  Skala Tugas: Multi-File / Batch?
                                                │
                        ┌───────────────────────┴───────────────────────┐
                      [YA]                                            [TIDAK]
                        │                                               │
           ┌────────────────────────────┐                  ┌────────────────────────────┐
           │ Buat Script Batch          │                  │ Edit Langsung 1-2 File     │
           │ (.cjs / .sh / .py)         │                  │ (replace_file_content)     │
           └────────────┬───────────────┘                  └────────────┬───────────────┘
                        │                                               │
           ┌────────────┴───────────────┐                               │
           │ Jalankan: run_command      │                               │
           │ (1-Pass Execution < 1s)    │                               │
           └────────────┬───────────────┘                               │
                        │                                               │
                        └───────────────────────┬───────────────────────┘
                                                │
                                ┌───────────────┴───────────────┐
                                │   4 PILAR AUDIT & CHECKLIST   │
                                │   1. Cek Error (tsc & build)  │
                                │   2. Cek Bug & Regresi        │
                                │   3. Cek Duplikasi Kode/File  │
                                │   4. Cek Preservasi UI (Utuh) │
                                └───────────────┬───────────────┘
                                                │
                                ┌───────────────┴───────────────┐
                                │ Laporan Akhir Berbasis Format │
                                └───────────────────────────────┘
```

---

### 2. Panduan Pemilihan Jenis Skrip (Script Language Matrix)

| Ekstensi | Kasus Penggunaan Ideal | Keunggulan & Mengapa Dipilih |
| :--- | :--- | :--- |
| **`.cjs` (Node.js)** | • Mengganti import path massal<br>• Regex find & replace kode<br>• Transformasi data JSON / TypeScript<br>• AST manipulation | Paling native di ekosistem React/Vite. Tidak butuh compile tambahan, memiliki modul `fs` dan `path` bawaan yang sangat kencang. |
| **`.sh` (Bash)** | • Reorganisasi folder (`mkdir`, `mv`, `rm`)<br>• Scanning file tree massal (`find`, `grep`)<br>• Menjalankan pipeline build beruntun | Tercepat untuk urusan sistem berkas tingkat OS (Linux) dalam satu sub-shell. |
| **`.py` (Python)** | • Pemrosesan teks dan data kompleks<br>• Pemetaan semantik kata kunci OCR<br>• Analisis frekuensi teks dataset besar | Kaya dengan pustaka parsing teks dan struktur kamus data tingkat tinggi. |

---

### 3. Template Skrip Batch Siap Pakai

#### A. Node.js Batch Import & Content Rewriter (`scripts/batch_rewrite.cjs`)
```javascript
const fs = require('fs');
const path = require('path');

const TARGET_DIRS = ['src'];
const EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx'];

// Daftar aturan perubahan: regex target -> replacement string
const RULES = [
  {
    regex: /from ['"](\.\.\/)+data\/tailored([A-Za-z]+)['"]/g,
    replace: (match) => {
      // Menjaga kedalaman relative path sesuai lokasi file pemanggil
      return match.replace('/data/tailored', '/data/tailored/tailored');
    }
  }
];

let filesScanned = 0;
let filesModified = 0;

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!['node_modules', '.git', 'dist'].includes(entry.name)) {
        walk(fullPath);
      }
    } else if (EXTENSIONS.includes(path.extname(entry.name))) {
      processFile(fullPath);
    }
  }
}

function processFile(filePath) {
  filesScanned++;
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  for (const rule of RULES) {
    if (typeof rule.replace === 'function') {
      content = content.replace(rule.regex, rule.replace);
    } else {
      content = content.replace(rule.regex, rule.replace);
    }
  }

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    filesModified++;
    console.log(`[MODIFIED] ${path.relative(process.cwd(), filePath)}`);
  }
}

console.log('==> Memulai Batch Replacement...');
TARGET_DIRS.forEach(walk);
console.log(`==> Selesai! ${filesModified}/${filesScanned} berkas diperbarui.`);
```

#### B. Bash Script untuk Migrasi Berkas & Cleanup (`scripts/bulk_move.sh`)
```bash
#!/usr/bin/env bash
set -e

echo "==> 1. Memastikan direktori target tersedia..."
mkdir -p src/data/preset
mkdir -p src/data/tailored

echo "==> 2. Memindahkan berkas..."
# Pindahkan file secara aman
for f in src/data/tailored*.ts; do
  [ -f "$f" ] && mv "$f" src/data/tailored/
done

echo "==> 3. Memverifikasi tidak ada berkas tertinggal..."
find src/data -maxdepth 1 -name "tailored*.ts" | grep -q . && {
  echo "[ERROR] Berkas lama masih ada di direktori asal!";
  exit 1;
} || echo "[OK] Folder asal bersih seutuhnya."

echo "==> 4. Validasi kompilasi..."
npm run lint
```

---

### 4. Siklus Kerja Standar (Workflow Lifecycle 5 Tahap)

1. **Tahap 1: Scanning & Pemetaan Pola**
   - Periksa pola teks, struktur folder, atau dependensi yang terpengaruh menggunakan `grep` / `find` lewat terminal.
2. **Tahap 2: Buat Skrip Otomatisasi Terfokus**
   - Tulis file skrip di folder `scripts/` (misal: `scripts/tmp_refactor.cjs` atau `scripts/reorganize.sh`).
   - Pastikan skrip bersifat *idempotent* (aman dijalankan berkali-kali tanpa merusak kode).
3. **Tahap 3: Eksekusi 1-Langkah**
   - Jalankan skrip via `run_command`: `node scripts/tmp_refactor.cjs`.
4. **Tahap 4: Verifikasi & Audit Kualitas**
   - Jalankan `npm run lint` (`tsc --noEmit`).
   - Jalankan `compile_applet` (`npm run build`).
5. **Tahap 5: Pembersihan & Pelaporan Checklist**
   - Hapus file script sementara jika bersifat satu kali pakai (`rm scripts/tmp_*.cjs`).
   - Berikan rangkuman hasil eksekusi lengkap dengan **Checklist 4 Pilar**.

---

### 5. CHECKLIST AKHIR WAJIB PASCA-EKSEKUSI (MANDATORY 4-PILLAR CHECKLIST)

Setiap kali tugas selesai dikerjakan berdasarkan standarisasi ini, Asisten **WAJIB MENAMPILKAN CHECKLIST INI** di akhir respons kepada pengguna:

```markdown
### 📋 Checklist Audit Pasca-Eksekusi (Standard EXECUTE_PROMPT.md):

#### 1. [x] Cek Error (Zero Compile & Lint Errors)
- TypeScript Linter (`tsc --noEmit`): Lolos 0 error (tidak ada missing types, broken imports, atau syntax error).
- Production Build (`npm run build`): Berhasil 100% tanpa komplain module resolution atau bundle chunk failure.

#### 2. [x] Cek Bug & Regresi Logika (Zero Functional Bugs)
- Fallback Data: Seluruh fungsi selector/resolver memiliki fallback aman jika data kustom tidak ditemukan (mencegah blank screen / `undefined`).
- Event & State: Handler tombol, navigasi URL query (`?role=...`), dialog modal, dan generator PDF tetap berjalan normal.

#### 3. [x] Cek Duplikasi Kode & Berkas (Zero Redundancy & Clean File Tree)
- Pembersihan Direktori Asal: Berkas yang telah dipindahkan sudah terhapus seutuhnya dari folder lama (tidak ada file duplikat).
- Zero Orphan/Temporary Files: Tidak ada file sisa/sampah (`*.bak`, `*.tmp`, script sementara yang tidak terpakai).
- Single Source of Truth: Barrel exports (`index.ts`) tidak menduplikasi konstanta atau nama ekspor ganda.

#### 4. [x] Cek Preservasi UI (Zero UI Regression — Tampilan Tetap Identik)
- Tampilan Visual: Layout, tipografi, warna, jarak (padding/margin), dan ikon tetap 100% presisi sesuai desain awal.
- Responsive Design: Tampilan desktop, tablet, dan mobile tidak mengalami pergeseran atau kerusakan layout.
- Styling Tailwind: Seluruh class utility Tailwind CSS tetap terkompilasi utuh tanpa ada styling yang terlepas.
- Interaktivitas: Fitur interaktif (switch bahasa ID/EN, modal pemilihan preset peran, filter dropdown, preview sheet, download PDF) tetap responsif dan mulus.
```

---

### 6. Keuntungan yang Dijamin oleh Standar Ini
* **Penghematan Token Ekstrem**: Mengurangi konsumsi token konteks hingga 85–90% dibandingkan puluhan tool call berulang.
* **Kecepatan Tinggi**: Eksekusi batch selesai dalam hitungan detik.
* **Akurasi 100%**: Menghilangkan *human error* dan *AI hallucination* pada pembaruan massal.
* **Keamanan Tampilan UI**: Menjamin tampilan antarmuka dan pengalaman pengguna tidak pernah rusak atau berubah sedikit pun akibat refactoring internal.
