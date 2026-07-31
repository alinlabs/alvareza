import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { GoogleGenAI } from "@google/genai";

import { getEmailHTML } from "./src/utils/emailTemplate";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function startServer() {
  const app = express();
  app.use(cors());
  const PORT = 3000;

  // Use JSON middleware for typical API calls
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  app.get("/api/berkas", (req, res) => {
    try {
      const getFiles = (dirPath, basePath) => {
        const fullPath = path.join(process.cwd(), 'public', dirPath);
        if (!fs.existsSync(fullPath)) return [];
        return fs.readdirSync(fullPath)
          .filter(file => fs.statSync(path.join(fullPath, file)).isFile())
          .map(file => ({
            name: file,
            url: `/${dirPath}/${file}`,
            category: basePath
          }));
      };

      const files = [
        ...getFiles('gambar/cv', 'CV'),
        ...getFiles('gambar/portofolio', 'Portofolio'),
        ...getFiles('gambar/paklaring', 'Paklaring'),
        ...getFiles('gambar/sertifikat', 'Sertifikat (Gambar)'),
        ...getFiles('pdf', 'PDF Umum'),
        ...getFiles('pdf/sertifikat', 'Sertifikat (PDF)')
      ];

      res.json({ success: true, data: files });
    } catch (e) {
      res.json({ success: false, message: e.message });
    }
  });

  app.post("/api/preview-email", async (req, res) => {
    try {
      const { body, bodyFontFamily, emailFormat, paragraphAlign, location } = req.body;
      let html = await getEmailHTML(body || "", { bodyFontFamily, emailFormat, paragraphAlign, location });
      // Override container styles for preview to use full width and no centering margin
      const previewOverride = `
      <style>
        .container {
          max-width: 100% !important;
          width: 100% !important;
          margin: 0 !important;
          border-radius: 0 !important;
          box-shadow: none !important;
          border: none !important;
        }
      </style>`;
      html = html.replace('</head>', `${previewOverride}\n</head>`);
      res.status(200).json({ html });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/api/generate-cover-letter", async (req, res) => {
    try {
      const { targetPosition, profileData, experienceData, portfolioData, skillsData, certificatesData } = req.body;
      
      if (!targetPosition) {
        return res.status(400).json({ success: false, message: "Posisi yang dituju harus diisi" });
      }
      
      const prompt = `Anda adalah asisten karir profesional. Buatkan surat lamaran kerja (cover letter) profesional dalam bahasa Indonesia untuk posisi "${targetPosition}".

**PENTING: Jangan overclaim/mengarang (jangan membuat klaim bahwa kandidat memiliki sertifikasi atau pengalaman yang tidak ada di bawah ini). Anda BISA menyesuaikan pengalaman yang ADA agar lebih relevan (nyambung) dengan posisi yang dilamar.**
Jika kandidat melamar posisi di bidang lain (misal pabrik/IT/Finance), ambil sudut pandang dari pengalaman yang paling nyambung, namun JANGAN menambahkan sertifikasi palsu (seperti K3) jika tidak ada di data.

DATA KANDIDAT:
1. Profil: ${JSON.stringify(profileData || {})}
2. Pengalaman: ${JSON.stringify(experienceData || [])}
3. Portofolio: ${JSON.stringify(portfolioData || [])}
4. Keahlian: ${JSON.stringify(skillsData || [])}
5. Pelatihan/Sertifikat: ${JSON.stringify(certificatesData || [])}

Aturan Penulisan Cover Letter:
- Hanya tuliskan paragraf isi surat pengantar (tanpa salam pembuka, nama, tanggal, header perusahaan, atau tanda tangan).
- Bisa gunakan tag \`**teks**\` untuk bold bagian penting/kompetensi.
- Gunakan bahasa formal, percaya diri, namun rendah hati.
- Fokus pada pengalaman yang paling relevan dengan posisi "${targetPosition}". Jika relevansi jauh, tonjolkan kemampuan manajerial/soft skill yang bisa ditransfer (transferable skills).`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const body = response.text;
      res.status(200).json({ success: true, body });
    } catch (error: any) {
      console.error('Error generating cover letter:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: "spa" });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }
  return app;
}

export const appPromise = startServer();
