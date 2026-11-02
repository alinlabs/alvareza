/**
 * Vercel Serverless Function: Scan Job Flyer Image via Gemini Vision
 */
import { GoogleGenAI } from '@google/genai';
import { createFallbackJobScan } from '../src/utils/jobApplicationDraft';
import { EmailLanguage } from '../src/types/jobApplication';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '20mb',
    },
  },
};

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    const { imageBase64, mimeType = 'image/jpeg', filename = '', language = 'id' } = req.body || {};

    if (!imageBase64) {
      return res.status(400).json({
        success: false,
        error: 'Image data (base64) is required',
      });
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, '');
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      const fallback = createFallbackJobScan(filename, language as EmailLanguage);
      return res.status(200).json({
        success: true,
        isAi: false,
        isFallback: true,
        data: fallback,
      });
    }

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
Website/Portofolio: https://alvareza.my.id
LinkedIn: linkedin.com/in/alvareza-hilka-pratama
Kualifikasi: Business Operations Specialist, Certified HR Specialist (MarkPlus Institute, Nilai 93,00, Grade A), Six Sigma White Belt (CSSC, USA), Berpengalaman supervisi 13 gerai ritel, koordinasi 6 divisi, eksekusi 100+ proyek komersial (CSAT 98%, SLA >95%), eliminasi 70% hambatan SOP, otomatisasi 50+ aplikasi web/ERP.

ATURAN SELEKSI KETAT UNTUK ENTITAS GAMBAR POSTER LOWONGAN KERJA:
1. companyName (Nama Perusahaan):
   - HANYA AMBIL jika secara eksplisit terdapat kata badan usaha hukum resmi seperti 'PT.', 'PT', 'CV.', 'CV', 'UD.', 'UD', 'Yayasan', 'Firma'.
   - JIKA TIDAK ADA kata PT. atau CV. pada gambar poster, WAJIB KOSONGKAN string ini (isi dengan "" string kosong).
   - DILARANG KERAS mengambil slogan seperti 'WE ARE HIRING', 'OPEN RECRUITMENT', 'LOWONGAN KERJA', 'JOIN US', atau nama kota.

2. jobTitle (Posisi / Jabatan yang Dilamar):
   - WAJIB mengambil nama posisi jabatan kerja yang spesifik dan cocok dengan keyword posisi.
   - DILARANG KERAS memasukkan teks syarat/kualifikasi atau gaji.
   - Tulis dalam format Title Case yang rapi.

3. recipientEmail (Email Tujuan):
   - Ekstrak alamat email HRD/rekrutmen/perusahaan.
   - Perbaiki kesalahan visual OCR jika ada.

4. recipientPhone (Nomor WhatsApp / Telepon):
   - Ekstrak nomor WhatsApp/kontak HRD yang tertera.

5. formatSubjectNotice (Instruksi Subjek dari Poster):
   - Jika poster menulis instruksi subjek, catat polanya.

6. language (Deteksi Bahasa):
   - Otomatis deteksi 'en' jika poster mayoritas berbahasa Inggris, atau 'id' jika Bahasa Indonesia.

7. emailSubject (Subjek Email):
   - Sesuaikan instruksi poster atau buat format default:
     * Jika ada companyName: 'Lamaran Pekerjaan: [jobTitle] - [companyName] - Alvareza Hilka Pratama'
     * Jika companyName kosong: 'Lamaran Pekerjaan: [jobTitle] - Alvareza Hilka Pratama'

8. emailBody (Draf Isi Email):
   - 2 paragraf terpisah (Pengalaman & Sertifikasi) dengan bullets '•'.

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
      const cleaned = responseText.replace(/```json\n?|\n?```/gi, '').trim();
      parsedData = JSON.parse(cleaned);
    }

    const finalLang: EmailLanguage = parsedData.language === 'en' || parsedData.language === 'id'
      ? parsedData.language
      : (language as EmailLanguage);

    return res.status(200).json({
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
    const fallback = createFallbackJobScan(req.body?.filename, req.body?.language as EmailLanguage);
    return res.status(200).json({
      success: true,
      isAi: false,
      isFallback: true,
      errorNote: err?.message,
      data: fallback,
    });
  }
}
