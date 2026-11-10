# 📜 LOG & REKAPITULASI DOKUMENTASI RENAMING FILE PENGHARGAAN (`public/penghargaan/`)

Pembaruan ini secara resmi mengubah struktur penamaan seluruh berkas gambar WebP piagam & penghargaan pada direktori `public/penghargaan/` dengan format standar baru:
👉 **`[tahun]-xxx-xxx.webp`** *(Format Tahun di Depan)*

Dokumen ini berfungsi sebagai acuan audit, verifikasi silang, dan pengecekan ulang agar seluruh pemanggilan berkas pada halaman Web, PDF generator, dan modul aplikasi berjalan 100% presisi tanpa error broken image.

---

## 📊 Tabel Pemetaan File Lama ➔ File Baru

| No | ID Item | Nama File Lama | Nama File Baru (`[tahun]-xxx-xxx.webp`) | Judul Dokumen / Sertifikat | Tahun |
| :---: | :---: | :--- | :--- | :--- | :---: |
| 1 | `awd-19` | `winner-duta-genre-2023.webp` | `2023-winner-duta-genre.webp` | Winner Duta GenRe Kab. Purwakarta | 2023 |
| 2 | `awd-10` | `ketua-wsc-piala-gubernur-2025.webp` | `2025-ketua-wsc-piala-gubernur.webp` | Ketua Pelaksana WSC Piala Gubernur Jabar | 2025 |
| 3 | `awd-9` | `ketua-bem-2025.webp` | `2025-ketua-bem.webp` | Ketua BEM STIE Wikara | 2025 |
| 4 | `awd-11` | `mahasiswa-terbaik-2022.webp` | `2022-mahasiswa-terbaik.webp` | Mahasiswa Terbaik PMB | 2022 |
| 5 | `awd-6` | `juri-umkm-2023.webp` | `2023-juri-umkm.webp` | Dewan Juri Lomba UPPKA UMKM | 2023 |
| 6 | `awd-13` | `moderator-kemeneku-2023.webp` | `2023-moderator-kemeneku.webp` | Moderator Kemenkeu Goes To Campus | 2023 |
| 7 | `awd-15` | `pemateri-edufest-2025.webp` | `2025-pemateri-edufest.webp` | Pemateri EduFest Kab. Purwakarta | 2025 |
| 8 | `awd-1` | `director-film-2025.webp` | `2025-director-film.webp` | Director Film Dokumenter Tak Kasat | 2025 |
| 9 | `awd-1` | `steering-committee-pkkmb-2025.webp` | `2025-steering-committee-pkkmb.webp` | Steering Committee PKKMB STIE Wikara | 2025 |
| 10 | `awd-16` | `pembicara-kwu-2024.webp` | `2024-pembicara-kwu.webp` | Pembicara Seminar Potensi Diri KWU | 2024 |
| 11 | `awd-14` | `moderator-seminar-keorganisasian-2023.webp` | `2023-moderator-seminar-keorganisasian.webp` | Moderator Seminar Keorganisasian Indonesia | 2023 |
| 12 | `awd-12` | `mc-porsa-2024.webp` | `2024-mc-porsa.webp` | Master of Ceremony PORSA STIE Wikara | 2024 |
| 13 | `awd-2` | `hbe-kwu-2024.webp` | `2024-hbe-kwu.webp` | Head of the Business Education UKM KWU | 2024 |
| 14 | `awd-17` | `seminar-fosta-2024.webp` | `2024-seminar-fosta.webp` | Pembicara Seminar FOSTA Purwakarta | 2024 |
| 15 | `awd-4` | `juara-i-lomba-pidato-smk-2019.webp` | `2019-juara-i-lomba-pidato-smk.webp` | Juara I Lomba Pidato Sumpah Pemuda SMK | 2019 |
| 16 | `awd-5` | `juara-ii-lomba-pidato-smk-2019.webp` | `2019-juara-ii-lomba-pidato-smk.webp` | Juara II Lomba Pidato Maulid Nabi SMK | 2019 |
| 17 | `awd-3` | `juara-harapan-ii-pidato-2019.webp` | `2019-juara-harapan-ii-pidato.webp` | Juara Harapan II Pidato SMK Se-Purwakarta | 2019 |
| 18 | `awd-8` | `kepesertaan-paskibra-kecamatan-2017.webp` | `2017-kepesertaan-paskibra-kecamatan.webp` | Peserta Paskibra HUT RI 72 Kecamatan | 2017 |
| 19 | `awd-7` | `kepesertaan-olimpiade-ipa-2017.webp` | `2017-kepesertaan-olimpiade-ipa.webp` | Peserta OSN IPA Terpadu SMP Se-Purwakarta | 2017 |

---

## 🔍 Lokasi Terintegrasi Berkas di Dalam Kode (*Code Audit Paths*)

Setiap kali halaman Full View Penghargaan atau PDF Generator dipanggil, sistem membaca gambar melalui jalur berikut:

1. **`src/data/awards/awardsCatalog.ts`**  
   - Mengelola katalog `ALL_AWARDS_LIST` dengan nama file baru `[tahun]-xxx-xxx.webp`.
   - Menghasilkan peta `AWARDS_IMAGES[id]` secara dinamis menuju `/penghargaan/[tahun]-xxx-xxx.webp`.
2. **`src/pages/full-view/awards.tsx`**  
   - Menggunakan `AWARDS_IMAGES[awd.id]` untuk merender galeri penghargaan fisik di web browser.
3. **`src/utils/portfolio-pdf/pdfBuilders.ts`**  
   - Menggunakan `/penghargaan/${awd.filename}` untuk mengompilasi lembar PDF piagam bertanda tangan digital.
4. **`src/config/esign-awards.ts`**  
   - Menyimpan metadata penandatangan kriptografi (*Issuer Authority & Signer*) yang dipetakan sesuai ID penghargaan.

---

## ✅ Status Verifikasi Sistem
- **Jumlah Berkas Terdaftar:** 19 dari 19 Berkas
- **Struktur Biner Gambar:** 100% Utuh & Tidak Mengalami Re-kompresi (Hanya mengubah nama lokasi file)
- **Kompilasi TypeScript:** Lolos 100% tanpa error
