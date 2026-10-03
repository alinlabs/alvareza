import express from 'express';
import fs from 'fs';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import {
  createFallbackJobScan,
  parseJobTextHeuristically,
  generateTailoredApplicationDraft,
  detectLanguageFromText,
} from './src/utils/jobApplicationDraft';
import { formatEmailBodyToHtml } from './src/utils/gasAttachmentGenerator';
import { EmailLanguage } from './src/types/jobApplication';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Increase body limit to handle payloads
  app.use(express.json({ limit: '20mb' }));
  app.use(express.urlencoded({ extended: true, limit: '20mb' }));

  // API Health Check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      hasApiKey: !!process.env.GEMINI_API_KEY,
      timestamp: new Date().toISOString(),
    });
  });

  // API: Scan Job via Extracted Text (Token-Saving OCR -> Text Only AI)
  app.post('/api/scan-job-text', async (req, res) => {
    try {
      const { extractedText = '', filename = '' } = req.body;
      const detectedLang = detectLanguageFromText(extractedText);
      const language: EmailLanguage = req.body.language || detectedLang;

      if (!extractedText || extractedText.trim().length < 5) {
        // If OCR returned empty or very short text, use heuristic with filename
        const fallback = parseJobTextHeuristically(extractedText, filename, language);
        return res.json({
          success: true,
          isAi: false,
          isFallback: true,
          data: fallback,
        });
      }

      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        console.log('[API] GEMINI_API_KEY not set. Using local text heuristic parser.');
        const parsed = parseJobTextHeuristically(extractedText, filename, language);
        return res.json({
          success: true,
          isAi: false,
          isFallback: true,
          data: parsed,
        });
      }

      // Initialize Gemini SDK with Text-Only Input (Ultra Low Token Usage)
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const promptSystem = `Anda adalah asisten rekrutmen & analisis lowongan kerja profesional tingkat tinggi (expert ATS parser) untuk pelamar kerja:
Nama: Alvareza Hilka Pratama
Email: alvareza.work@gmail.com
No. WhatsApp: +62 857-9718-4059
Portofolio & CV Online: https://alvareza.vercel.app
LinkedIn: linkedin.com/in/alvareza-hilka-pratama
Kualifikasi: Business Operations Specialist, Certified HR Specialist (MarkPlus Institute, Nilai 93,00, Grade A), Six Sigma White Belt (CSSC, USA), Supervisi 13 gerai ritel, koordinasi 6 divisi, eksekusi 100+ proyek komersial (CSAT 98%, SLA >95%), eliminasi 70% hambatan SOP, otomatisasi 50+ aplikasi web/ERP.

ATURAN SELEKSI KETAT UNTUK ENTITAS POSTER LOWONGAN KERJA:
1. companyName (Nama Perusahaan):
   - HANYA AMBIL jika secara eksplisit terdapat kata badan usaha hukum resmi seperti 'PT.', 'PT', 'CV.', 'CV', 'UD.', 'UD', 'Yayasan', 'Firma' (contoh: 'PT Sumber Alfaria Trijaya', 'CV Abadi Jaya').
   - JIKA TIDAK ADA kata PT. atau CV. pada teks poster, WAJIB KOSONGKAN string ini (isi dengan "" string kosong). DILARANG mengisi 'Perusahaan Mitra' atau 'Perusahaan'.
   - DILARANG KERAS mengambil slogan seperti 'WE ARE HIRING', 'OPEN RECRUITMENT', 'LOWONGAN KERJA', 'JOIN US', atau nama kota.

2. jobTitle (Posisi / Jabatan yang Dilamar):
   - WAJIB mengambil nama posisi jabatan kerja yang spesifik dan cocok dengan keyword posisi (contoh: jika ada 'HRD' dan 'Staff' -> 'HRD Staff', 'Store Manager', 'Supervisor Operasional', 'Staff Administrasi', 'Marketing Staff', 'Barista', 'Operations Lead').
   - DILARANG KERAS memasukkan teks syarat/kualifikasi seperti 'Minimal S1', 'Pria/Wanita', 'Usia Max 30 Tahun', 'Pengalaman 2-3 Tahun', atau gaji.
   - Tulis dalam format Title Case yang rapi (atau singkatan baku seperti HRD / HR / IT).

3. recipientEmail (Email Tujuan):
   - Ekstrak alamat email HRD/rekrutmen/perusahaan (contoh: 'indoflour.rekrutmen@gmail.com').
   - Perbaiki kesalahan visual OCR jika ada (contoh: 'gmai1.com' -> 'gmail.com', '.con' -> '.com').
   - Jangan gunakan email pelamar (alvareza...).

4. recipientPhone (Nomor WhatsApp / Telepon):
   - Ekstrak nomor WhatsApp/kontak HRD yang tertera.
   - Format menjadi nomor telepon standar ('08...' atau '+62...'). Jika tidak ada, kosongkan ("").

5. formatSubjectNotice (Instruksi Subjek dari Poster):
   - Jika poster menulis instruksi subjek (misal: 'Subject: HRD - Nama', 'Subject : POSISI_NAMA', 'Subjek: [Posisi]_[Nama]'), catat pola tersebut.

6. language (Deteksi Bahasa):
   - Otomatis deteksi 'en' jika poster mayoritas berbahasa Inggris, atau 'id' jika Bahasa Indonesia.

7. emailSubject (Subjek Email):
   - Jika poster memiliki format subjek khusus:
     * Gantikan placeholder [Posisi] atau 'POSISI' dengan nama posisi yang tervalidasi.
     * Gantikan placeholder [Nama] atau 'Nama' / 'NAMA' dengan 'Alvareza' (atau 'ALVAREZA' jika formatnya kapital).
     * CONTOH 1: Jika di poster 'Subject: HRD - Nama', maka hasil emailSubject = 'HRD - Alvareza'.
     * CONTOH 2: Jika di poster 'Subject : POSISI_NAMA' dan posisinya Marketing, maka hasil emailSubject = 'MARKETING_ALVAREZA'.
     * Pertahankan gaya huruf kapital / normal persis seperti contoh di poster.
   - Jika TIDAK ADA format khusus di poster:
     * Jika ada companyName: 'Lamaran Pekerjaan: [jobTitle] - [companyName] - Alvareza Hilka Pratama'
     * Jika companyName kosong: 'Lamaran Pekerjaan: [jobTitle] - Alvareza Hilka Pratama'

8. emailBody (Draf Isi Email):
   - WAJIB MEMISAHKAN PARAGRAF PENGALAMAN DAN PARAGRAF SERTIFIKASI MENJADI 2 PARAGRAF TERPISAH DENGAN BULLETS BAWAAN '•' (jangan gunakan tanda minus '-'):
     * Salam & Pembuka: Salam hormat tim rekrutmen dan pengenalan diri serta posisi yang dilamar.
     * Paragraf Pengalaman: Penjelasan latar belakang pengalaman kerja yang relevan dan proporsional dengan CV (jangan overclaim tahun pengalaman pada bidang spesifik di luar operasional umum) dengan poin-poin ringkas menggunakan simbol bullet '•' (contoh:
       Saya memiliki latar belakang dan pengalaman kerja dalam manajemen operasional lintas fungsi, seperti:
       • Supervisi 13 gerai ritel & koordinasi 6 divisi bisnis
       • Standardisasi 20+ SOP operasional & tata kelola arsip
       • Kepemimpinan tim dan optimalisasi efisiensi alur kerja
       Dengan pengalaman tersebut, saya terbiasa bekerja secara terstruktur, proaktif, dan siap berkontribusi secara optimal.)
     * Paragraf Sertifikasi: Penjelasan sertifikasi resmi yang relevan di bawah paragraf pengalaman (cukup cantumkan Grade dan sertifikasi Terakreditasi IACET (USA) tanpa perlu nilai numerik, misal: Sebagai penguatan kompetensi, saya memiliki sertifikasi Certified HR Specialist dari MarkPlus Institute (Grade A / Predikat Outstanding) serta Six Sigma White Belt dari CSSC (USA) yang relevan dalam menunjang keberhasilan peran ini.)
     * Lampiran & Penutup: Melampirkan CV dan dokumen pendukung, ucapan terima kasih, dan kontak Alvareza.

Format output JSON:
{
  "companyName": "string",
  "jobTitle": "string",
  "recipientEmail": "string",
  "recipientPhone": "string",
  "formatSubjectNotice": "string",
  "keyRequirements": ["string", "string"],
  "emailSubject": "string",
  "emailBody": "string",
  "language": "id" | "en",
  "notes": "string"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Berikut adalah teks hasil OCR poster loker:\n---\n${extractedText.slice(0, 4000)}\n---\nEkstrak entitas lowongan kerja dan susun draf email lamaran ringkas & padat sesuai instruksi.`,
        config: {
          systemInstruction: promptSystem,
          responseMimeType: 'application/json',
        },
      });

      const responseText = response.text || '';
      let parsedData: any;

      try {
        parsedData = JSON.parse(responseText.trim());
      } catch {
        const cleaned = responseText.replace(/```json\n?|\n?```/gi, '').trim();
        parsedData = JSON.parse(cleaned);
      }

      const finalLang: EmailLanguage = parsedData.language === 'en' || parsedData.language === 'id'
        ? parsedData.language
        : language;

      return res.json({
        success: true,
        isAi: true,
        isFallback: false,
        data: {
          companyName: parsedData.companyName !== undefined ? parsedData.companyName : '',
          jobTitle: parsedData.jobTitle || 'Posisi Terkait',
          recipientEmail: parsedData.recipientEmail || '',
          recipientPhone: parsedData.recipientPhone || '',
          formatSubjectNotice: parsedData.formatSubjectNotice || '',
          keyRequirements: Array.isArray(parsedData.keyRequirements) ? parsedData.keyRequirements : [],
          emailSubject: parsedData.emailSubject || (finalLang === 'en'
            ? `Job Application: ${parsedData.jobTitle || 'Position'} - Alvareza Hilka Pratama`
            : `Lamaran Pekerjaan: ${parsedData.jobTitle || 'Posisi Terkait'} - Alvareza Hilka Pratama`),
          emailBody: parsedData.emailBody || '',
          language: finalLang,
          rawExtractedText: extractedText,
          notes: parsedData.notes || '',
        },
      });
    } catch (err: any) {
      console.error('[API] Error calling Gemini API on OCR text:', err?.message || err);
      const detectedLang = detectLanguageFromText(req.body.extractedText);
      const fallback = parseJobTextHeuristically(req.body.extractedText, req.body.filename, req.body.language || detectedLang);
      return res.json({
        success: true,
        isAi: false,
        isFallback: true,
        errorNote: err?.message,
        data: fallback,
      });
    }
  });

  // API: Scan Job Flyer / Poster Image (Direct Image Vision fallback)
  app.post('/api/scan-job', async (req, res) => {
    try {
      const { imageBase64, mimeType = 'image/jpeg', filename = '', language = 'id' } = req.body;

      if (!imageBase64) {
        return res.status(400).json({
          success: false,
          error: 'Image data (base64) is required',
        });
      }

      // Clean base64 string if it contains data URI header
      const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, '');

      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        console.log('[API] GEMINI_API_KEY not set. Using intelligent fallback generator.');
        const fallback = createFallbackJobScan(filename, language as EmailLanguage);
        return res.json({
          success: true,
          isAi: false,
          isFallback: true,
          data: fallback,
        });
      }

      // Initialize Gemini SDK
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const promptSystem = `Anda adalah asisten rekrutmen & analisis lowongan kerja profesional tingkat tinggi (expert ATS parser) untuk pelamar kerja:
Nama: Alvareza Hilka Pratama
Email: alvareza.work@gmail.com
No. WhatsApp: +62 857-9718-4059
Website/Portofolio: https://alvareza.vercel.app
LinkedIn: linkedin.com/in/alvareza-hilka-pratama
Kualifikasi Inti: Business Operations Specialist, Certified HR Specialist (MarkPlus Institute, Nilai 93,00, Grade A), Six Sigma White Belt (CSSC, USA), Berpengalaman koordinasi 6 divisi, supervisi 13 gerai ritel, eksekusi 100+ proyek komersial (CSAT 98%, SLA >95%), eliminasi 70% hambatan SOP, otomatisasi 50+ aplikasi web/ERP.

ATURAN SELEKSI KETAT UNTUK ENTITAS GAMBAR POSTER LOWONGAN KERJA:
1. companyName (Nama Perusahaan):
   - HANYA AMBIL jika secara eksplisit terdapat kata badan usaha hukum resmi seperti 'PT.', 'PT', 'CV.', 'CV', 'UD.', 'UD', 'Yayasan', 'Firma' (contoh: 'PT Sumber Alfaria Trijaya', 'CV Abadi Jaya').
   - JIKA TIDAK ADA kata PT. atau CV. pada gambar poster, WAJIB KOSONGKAN string ini (isi dengan "" string kosong). DILARANG mengisi 'Perusahaan Mitra' atau 'Perusahaan'.
   - DILARANG KERAS mengambil slogan seperti 'WE ARE HIRING', 'OPEN RECRUITMENT', 'LOWONGAN KERJA', 'JOIN US', atau nama kota.

2. jobTitle (Posisi / Jabatan yang Dilamar):
   - WAJIB mengambil nama posisi jabatan kerja yang spesifik dan cocok dengan keyword posisi (contoh: jika ada badge 'HRD' dan 'Staff' -> 'HRD Staff', 'Store Manager', 'Supervisor Operasional', 'Staff Administrasi', 'Marketing Staff', 'Barista', 'Operations Lead').
   - DILARANG KERAS memasukkan teks syarat/kualifikasi seperti 'Minimal S1', 'Pria/Wanita', 'Usia Max 30 Tahun', 'Pengalaman 2-3 Tahun', atau gaji.
   - Tulis dalam format Title Case yang rapi (atau singkatan baku seperti HRD / HR / IT).

3. recipientEmail (Email Tujuan):
   - Ekstrak alamat email HRD/rekrutmen/perusahaan (contoh: 'indoflour.rekrutmen@gmail.com').
   - Perbaiki kesalahan visual OCR jika ada (contoh: 'gmai1.com' -> 'gmail.com', '.con' -> '.com').
   - Jangan gunakan email pelamar (alvareza...).

4. recipientPhone (Nomor WhatsApp / Telepon):
   - Ekstrak nomor WhatsApp/kontak HRD yang tertera.
   - Format menjadi nomor telepon standar ('08...' atau '+62...'). Jika tidak ada, kosongkan ("").

5. formatSubjectNotice (Instruksi Subjek dari Poster):
   - Jika poster menulis instruksi subjek (misal: 'Subject: HRD - Nama', 'Subject : POSISI_NAMA', 'Subjek: [Posisi]_[Nama]'), catat pola tersebut.

6. language (Deteksi Bahasa):
   - Otomatis deteksi 'en' jika poster mayoritas berbahasa Inggris, atau 'id' jika Bahasa Indonesia.

7. emailSubject (Subjek Email):
   - Jika poster memiliki format subjek khusus:
     * Gantikan placeholder [Posisi] atau 'POSISI' dengan nama posisi yang tervalidasi.
     * Gantikan placeholder [Nama] atau 'Nama' / 'NAMA' dengan 'Alvareza' (atau 'ALVAREZA' jika formatnya kapital).
     * CONTOH 1: Jika di poster tertulis 'Subject: HRD - Nama', maka hasil emailSubject = 'HRD - Alvareza'.
     * CONTOH 2: Jika di poster tertulis 'Subject : POSISI_NAMA' dan posisinya Marketing, maka hasil emailSubject = 'MARKETING_ALVAREZA'.
     * Pertahankan gaya huruf kapital / normal persis seperti contoh di poster.
   - Jika TIDAK ADA format khusus di poster:
     * Jika ada companyName: 'Lamaran Pekerjaan: [jobTitle] - [companyName] - Alvareza Hilka Pratama'
     * Jika companyName kosong: 'Lamaran Pekerjaan: [jobTitle] - Alvareza Hilka Pratama'

8. emailBody (Draf Isi Email):
   - WAJIB MEMISAHKAN PARAGRAF PENGALAMAN DAN PARAGRAF SERTIFIKASI MENJADI 2 PARAGRAF TERPISAH DENGAN BULLETS BAWAAN '•' (jangan gunakan tanda minus '-'):
     * Salam & Pembuka: Salam hormat tim rekrutmen dan pengenalan diri serta posisi yang dilamar.
     * Paragraf Pengalaman: Penjelasan latar belakang pengalaman kerja yang relevan dan proporsional dengan CV (jangan overclaim tahun pengalaman pada bidang spesifik di luar operasional umum) dengan poin-poin ringkas menggunakan simbol bullet '•' (contoh:
       Saya memiliki latar belakang dan pengalaman kerja dalam manajemen operasional lintas fungsi, seperti:
       • Supervisi 13 gerai ritel & koordinasi 6 divisi bisnis
       • Standardisasi 20+ SOP operasional & tata kelola arsip
       • Kepemimpinan tim dan optimalisasi efisiensi alur kerja
       Dengan pengalaman tersebut, saya terbiasa bekerja secara terstruktur, proaktif, dan siap berkontribusi secara optimal.)
     * Paragraf Sertifikasi: Penjelasan sertifikasi resmi yang relevan di bawah paragraf pengalaman (cukup cantumkan Grade dan sertifikasi Terakreditasi IACET (USA) tanpa perlu nilai numerik, misal: Sebagai penguatan kompetensi, saya memiliki sertifikasi Certified HR Specialist dari MarkPlus Institute (Grade A / Predikat Outstanding) serta Six Sigma White Belt dari CSSC (USA) yang relevan dalam menunjang keberhasilan peran ini.)
     * Lampiran & Penutup: Melampirkan CV dan dokumen pendukung, ucapan terima kasih, dan kontak Alvareza.

Format output JSON:
{
  "companyName": "string",
  "jobTitle": "string",
  "recipientEmail": "string",
  "recipientPhone": "string",
  "formatSubjectNotice": "string",
  "keyRequirements": ["string", "string"],
  "emailSubject": "string",
  "emailBody": "string",
  "language": "id" | "en",
  "notes": "string"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: mimeType || 'image/jpeg',
                data: cleanBase64,
              },
            },
            {
              text: 'Analisis flyer/poster lowongan kerja ini, ekstrak informasinya, dan buatkan draf email lamaran kerja resmi siap kirim sesuai instruksi ketat.',
            },
          ],
        },
        config: {
          systemInstruction: promptSystem,
          responseMimeType: 'application/json',
        },
      });

      const responseText = response.text || '';
      let parsedData: any;

      try {
        parsedData = JSON.parse(responseText.trim());
      } catch {
        // Strip markdown backticks if any
        const cleaned = responseText.replace(/```json\n?|\n?```/gi, '').trim();
        parsedData = JSON.parse(cleaned);
      }

      const finalLang: EmailLanguage = parsedData.language === 'en' || parsedData.language === 'id'
        ? parsedData.language
        : (language as EmailLanguage);

      return res.json({
        success: true,
        isAi: true,
        isFallback: false,
        data: {
          companyName: parsedData.companyName !== undefined ? parsedData.companyName : '',
          jobTitle: parsedData.jobTitle || 'Posisi Terkait',
          recipientEmail: parsedData.recipientEmail || '',
          recipientPhone: parsedData.recipientPhone || '',
          formatSubjectNotice: parsedData.formatSubjectNotice || '',
          keyRequirements: Array.isArray(parsedData.keyRequirements) ? parsedData.keyRequirements : [],
          emailSubject: parsedData.emailSubject || (finalLang === 'en'
            ? `Job Application: ${parsedData.jobTitle || 'Position'} - Alvareza Hilka Pratama`
            : `Lamaran Pekerjaan: ${parsedData.jobTitle || 'Posisi Terkait'} - Alvareza Hilka Pratama`),
          emailBody: parsedData.emailBody || '',
          language: finalLang,
          notes: parsedData.notes || '',
        },
      });
    } catch (err: any) {
      console.error('[API] Error calling Gemini API:', err?.message || err);
      // Fallback gracefully so user experience never fails
      const fallback = createFallbackJobScan(req.body.filename, req.body.language as EmailLanguage);
      return res.json({
        success: true,
        isAi: false,
        isFallback: true,
        errorNote: err?.message,
        data: fallback,
      });
    }
  });

  // API: Proxy Send Email via Google Apps Script (GAS) Web App URL
  app.post('/api/send-email-gas', async (req, res) => {
    try {
      const {
        gasUrl,
        targetEmail,
        subject,
        body,
        bodyText,
        bodyHtml,
        senderName,
        cc,
        bcc,
        attachments = [],
        senderEmail,
        accountId,
      } = req.body;

      if (!gasUrl || typeof gasUrl !== 'string' || !gasUrl.startsWith('https://script.google.com/')) {
        return res.status(400).json({
          success: false,
          error: 'URL Google Apps Script tidak valid. Format URL harus diawali dengan https://script.google.com/macros/s/.../exec',
        });
      }

      if (!targetEmail || !targetEmail.includes('@')) {
        return res.status(400).json({
          success: false,
          error: 'Alamat email tujuan penerima (HRD) tidak valid.',
        });
      }

      console.log(`[GAS Proxy] Forwarding email to GAS Web App for ${targetEmail} via ${senderEmail || 'GAS'}`);

      // Forward to Google Apps Script with both plain text body and HTML formatted body
      const plainBody = (body || bodyText || bodyHtml || '').trim();
      const formattedHtml = (bodyHtml && typeof bodyHtml === 'string' && bodyHtml.trim().length > 0)
        ? bodyHtml.trim()
        : formatEmailBodyToHtml(plainBody);

      const payload = {
        targetEmail: targetEmail.trim(),
        subject: (subject || 'Lamaran Pekerjaan').trim(),
        body: plainBody,
        bodyText: plainBody,
        bodyHtml: formattedHtml,
        senderName: 'Lamaran Kerja Alvareza',
        cc: cc ? String(cc).trim() : '',
        bcc: bcc ? String(bcc).trim() : '',
        attachments: Array.isArray(attachments) ? attachments : [],
      };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 35000); // 35s timeout for attachments

      const gasResponse = await fetch(gasUrl.trim(), {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
        redirect: 'follow',
      });

      clearTimeout(timeoutId);

      const responseText = await gasResponse.text();
      let responseJson: any;

      try {
        responseJson = JSON.parse(responseText);
      } catch {
        if (gasResponse.ok) {
          responseJson = { success: true, message: 'Email berhasil diproses oleh Google Apps Script' };
        } else {
          responseJson = {
            success: false,
            error: responseText.slice(0, 300) || `GAS mengembalikan status HTTP ${gasResponse.status}`,
          };
        }
      }

      if (!gasResponse.ok || (responseJson && responseJson.success === false)) {
        return res.status(gasResponse.status >= 400 && gasResponse.status < 600 ? gasResponse.status : 500).json({
          success: false,
          error: responseJson.error || responseJson.message || 'Gagal mengirim email via Google Apps Script',
          accountId,
          senderEmail,
        });
      }

      return res.json({
        success: true,
        message: responseJson.message || 'Email lamaran berhasil dikirim via GAS!',
        accountId,
        senderEmail,
      });
    } catch (err: any) {
      console.error('[GAS Proxy Error]:', err?.message || err);
      const isTimeout = err?.name === 'AbortError';
      return res.status(500).json({
        success: false,
        error: isTimeout
          ? 'Koneksi ke Google Apps Script timeout (>35 detik). Periksa deployment GAS Anda.'
          : `Gagal menghubungi Google Apps Script: ${err?.message || 'Koneksi terputus'}`,
      });
    }
  });

  // API: Test GAS Web App Connection
  app.post('/api/test-gas-account', async (req, res) => {
    try {
      const { webAppUrl } = req.body;

      if (!webAppUrl || !webAppUrl.startsWith('https://script.google.com/')) {
        return res.status(400).json({
          success: false,
          error: 'URL Web App harus diawali dengan https://script.google.com/macros/s/.../exec',
        });
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      const gasResponse = await fetch(webAppUrl.trim(), {
        method: 'GET',
        signal: controller.signal,
        redirect: 'follow',
      });

      clearTimeout(timeoutId);

      const text = await gasResponse.text();
      let data: any;
      try {
        data = JSON.parse(text);
      } catch {
        data = { success: gasResponse.ok, statusText: text.slice(0, 100) };
      }

      return res.json({
        success: true,
        message: 'Koneksi ke Google Apps Script aktif dan dapat diakses!',
        data,
      });
    } catch (err: any) {
      return res.json({
        success: false,
        error: `Gagal terhubung ke GAS: ${err?.message || 'Periksa pengaturan Who has access: Anyone'}`,
      });
    }
  });

  // oEmbed API endpoint for rich snippet embedding (LinkedIn, Discord, Slack, etc.)
  app.get('/api/oembed', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json({
      version: '1.0',
      type: 'rich',
      provider_name: 'MyCivy',
      provider_url: 'https://alvareza.vercel.app',
      title: 'My Professional CV — Alvareza Hilka Pratama',
      author_name: 'Alvareza Hilka Pratama',
      author_url: 'https://alvareza.vercel.app',
      thumbnail_url: 'https://alvareza.vercel.app/og-image.jpg',
      thumbnail_width: 1200,
      thumbnail_height: 630,
      html: '<p>Curriculum Vitae (CV) ATS-Friendly &amp; Portofolio Alvareza Hilka Pratama. Business Operations &amp; Certified HR Specialist.</p>',
      width: 600,
      height: 800,
    });
  });

  // Dedicated endpoint to proxy / stream academic PDFs with guaranteed CORS & inline disposition
  app.get(['/api/academic-pdf/:docId', '/akademik-stream/:docId'], (req, res) => {
    const docId = req.params.docId?.toLowerCase();
    const filename = docId === 'transkrip' ? 'transkrip_alvareza.pdf' : 'skl_alvareza.pdf';
    const filePath = path.join(process.cwd(), 'public', 'akademik', filename);

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');

    if (fs.existsSync(filePath)) {
      return res.sendFile(filePath);
    }
    return res.status(404).json({ error: 'PDF file not found' });
  });

  // Global CORS headers for static files
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');
    if (req.path.endsWith('.pdf')) {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline');
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    }
    next();
  });

  // Serve public assets (static files like favicon, lottie.min.js, etc.)
  app.use(
    express.static(path.join(process.cwd(), 'public'), {
      setHeaders: (res, filePath) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', '*');
        if (filePath.endsWith('.pdf')) {
          res.setHeader('Content-Type', 'application/pdf');
          res.setHeader('Content-Disposition', 'inline');
          res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
        }
      },
    })
  );

  // Vite middleware for development vs static for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MyCivy Server with Gemini AI running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
