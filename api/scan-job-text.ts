/**
 * Vercel Serverless Function: Scan Job via Extracted Text (Gemini AI + Fallback)
 */
import { GoogleGenAI } from '@google/genai';

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
    const { extractedText = '', filename = '', language = 'id' } = req.body || {};

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(200).json({
        success: true,
        isAi: false,
        isFallback: true,
        message: 'No GEMINI_API_KEY configured on server, client heuristic parser will be used.',
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
Portofolio & CV Online: https://alvareza.vercel.app
LinkedIn: linkedin.com/in/alvareza-hilka-pratama
Kualifikasi: Business Operations Specialist, Certified HR Specialist (MarkPlus Institute, Nilai 93,00, Grade A), Six Sigma White Belt (CSSC, USA), Supervisi 13 gerai ritel, koordinasi 6 divisi, eksekusi 100+ proyek komersial (CSAT 98%, SLA >95%), eliminasi 70% hambatan SOP, otomatisasi 50+ aplikasi web/ERP.

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
      contents: `Berikut adalah teks lowongan kerja:\n---\n${extractedText.slice(0, 4000)}\n---\nEkstrak entitas lowongan kerja dan susun draf email lamaran ringkas & padat.`,
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

    return res.status(200).json({
      success: true,
      isAi: true,
      data: parsedData,
    });
  } catch (err: any) {
    return res.status(200).json({
      success: true,
      isAi: false,
      isFallback: true,
      errorNote: err?.message,
    });
  }
}
