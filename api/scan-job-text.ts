/**
 * Vercel Serverless Function: Scan Job via Extracted Text (Gemini AI + Fallback)
 */
import { GoogleGenAI } from '@google/genai';
import {
  parseJobTextHeuristically,
  detectLanguageFromText,
} from '../src/utils/jobApplicationDraft';
import { EmailLanguage } from '../src/types/jobApplication';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
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
    const { extractedText = '', filename = '' } = req.body || {};
    const detectedLang = detectLanguageFromText(extractedText);
    const language: EmailLanguage = req.body?.language || detectedLang;

    if (!extractedText || extractedText.trim().length < 5) {
      const fallback = parseJobTextHeuristically(extractedText, filename, language);
      return res.status(200).json({
        success: true,
        isAi: false,
        isFallback: true,
        data: fallback,
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      const parsed = parseJobTextHeuristically(extractedText, filename, language);
      return res.status(200).json({
        success: true,
        isAi: false,
        isFallback: true,
        message: 'No GEMINI_API_KEY configured on server, client heuristic parser used.',
        data: parsed,
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
Portofolio & CV Online: https://alvareza.my.id
LinkedIn: linkedin.com/in/alvareza-hilka-pratama
Kualifikasi: Business Operations Specialist, Certified HR Specialist (MarkPlus Institute, Nilai 93,00, Grade A), Six Sigma White Belt (CSSC, USA), Supervisi 13 gerai ritel, koordinasi 6 divisi, eksekusi 100+ proyek komersial (CSAT 98%, SLA >95%), eliminasi 70% hambatan SOP, otomatisasi 50+ aplikasi web/ERP.

ATURAN SELEKSI KETAT UNTUK ENTITAS POSTER LOWONGAN KERJA:
1. companyName (Nama Perusahaan):
   - HANYA AMBIL jika secara eksplisit terdapat kata badan usaha hukum resmi seperti 'PT.', 'PT', 'CV.', 'CV', 'UD.', 'UD', 'Yayasan', 'Firma'.
   - JIKA TIDAK ADA kata PT. atau CV. pada teks poster, WAJIB KOSONGKAN string ini (isi dengan "" string kosong). DILARANG mengisi 'Perusahaan Mitra' atau 'Perusahaan'.
   - DILARANG KERAS mengambil slogan seperti 'WE ARE HIRING', 'OPEN RECRUITMENT', 'LOWONGAN KERJA', 'JOIN US', atau nama kota.

2. jobTitle (Posisi / Jabatan yang Dilamar):
   - WAJIB mengambil nama posisi jabatan kerja yang spesifik dan cocok dengan keyword posisi.
   - DILARANG KERAS memasukkan teks syarat/kualifikasi seperti 'Minimal S1', 'Pria/Wanita', 'Usia Max 30 Tahun', atau gaji.
   - Tulis dalam format Title Case yang rapi.

3. recipientEmail (Email Tujuan):
   - Ekstrak alamat email HRD/rekrutmen/perusahaan.
   - Perbaiki kesalahan visual OCR jika ada.

4. recipientPhone (Nomor WhatsApp / Telepon):
   - Ekstrak nomor WhatsApp/kontak HRD yang tertera.

5. formatSubjectNotice (Instruksi Subjek dari Poster):
   - Catat pola format subjek jika ada di poster.

6. language (Deteksi Bahasa):
   - 'en' jika mayoritas bahasa Inggris, atau 'id' jika bahasa Indonesia.

7. emailSubject (Subjek Email):
   - Ikuti format subjek khusus jika ada, atau buat standar:
     * Ada company: 'Lamaran Pekerjaan: [jobTitle] - [companyName] - Alvareza Hilka Pratama'
     * Tanpa company: 'Lamaran Pekerjaan: [jobTitle] - Alvareza Hilka Pratama'

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
        rawExtractedText: extractedText,
        notes: parsedData.notes || '',
      },
    });
  } catch (err: any) {
    const detectedLang = detectLanguageFromText(req.body?.extractedText || '');
    const fallback = parseJobTextHeuristically(req.body?.extractedText || '', req.body?.filename, req.body?.language || detectedLang);
    return res.status(200).json({
      success: true,
      isAi: false,
      isFallback: true,
      errorNote: err?.message,
      data: fallback,
    });
  }
}
