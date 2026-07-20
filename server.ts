import express from "express";
import cors from "cors";
import path from "path";
import nodemailer from "nodemailer";
import multer from "multer";
import fs from "fs";

import { getEmailHTML, getOtpEmailHTML } from "./src/utils/emailTemplate";
const upload = multer({ storage: multer.memoryStorage() });

async function startServer() {
  const app = express();
  app.use(cors());
  const PORT = 3000;

  // Use JSON middleware for typical API calls
  app.use(express.json());

  
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

  // API endpoint for sending emails with attachments
  app.post("/api/send-email", upload.any(), async (req, res) => {
    try {
      const {
        targetEmail,
        subject,
        body,
        bodyFontFamily,
        emailFormat,
        paragraphAlign,
        isOtp,
        otpCode,
        location
      } = req.body;

      let EMAIL_USER = process.env.EMAIL_USER;
      let EMAIL_APP_PASSWORD = process.env.EMAIL_APP_PASSWORD;

      try {
        const profilRes = await fetch('https://portofolio.alvareza-work.workers.dev/profil');
        if (profilRes.ok) {
          const json: any = await profilRes.json();
          if (json.success && json.data) {
            if (json.data.email) EMAIL_USER = json.data.email;
            if (json.data.emailAppPassword) EMAIL_APP_PASSWORD = json.data.emailAppPassword;
            else if (json.data.email_app_password) EMAIL_APP_PASSWORD = json.data.email_app_password;
          }
        }
      } catch (err) {
        console.error("Gagal mengambil profil untuk kredensial email", err);
      }

      if (!EMAIL_USER || !EMAIL_APP_PASSWORD) {
        return res.status(500).json({ error: "Kredensial email (EMAIL_USER / EMAIL_APP_PASSWORD) belum dikonfigurasi di server (.env) atau tabel profil" });
      }

      // Configure Nodemailer transporter
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: EMAIL_USER,
          pass: EMAIL_APP_PASSWORD,
        },
      });

      // Prepare attachments if they exist
      const attachments = [];
      const files = req.files as Express.Multer.File[];
      if (files && files.length > 0) {
        for (const file of files) {
          attachments.push({
            filename: file.originalname || "document.pdf",
            content: file.buffer,
          });
        }
      }

      // Check if this is an OTP / Security Verification email
      const isOtpRequest = isOtp === "true" || (subject && (subject.includes("OTP") || subject.includes("Verifikasi")));
      const finalOtpCode = otpCode || (body && body.match(/\*\*(\d{4})\*\*/)?.[1]) || "0000";

      // Choose HTML template accordingly
      const htmlContent = isOtpRequest
        ? await getOtpEmailHTML(body, finalOtpCode)
        : await getEmailHTML(body, { bodyFontFamily, emailFormat, paragraphAlign, location });

      // Prepare email payload
      const mailOptions = {
        from: `"Alvareza Hilka Pratama" <${EMAIL_USER}>`,
        replyTo: EMAIL_USER,
        to: targetEmail,
        subject: subject,
        html: htmlContent,
        text: body ? body.replace(/\*\*/g, '') : '', // Include plain text fallback and strip basic markdown to prevent emails from going to spam
        attachments,
      };

      // Send Email
      await transporter.sendMail(mailOptions);
      
      res.status(200).json({ message: "Email berhasil terkirim!" });
    } catch (error: any) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: error.message || "Gagal mengirim email" });
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