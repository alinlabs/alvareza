import nodemailer from 'nodemailer';
import multer from 'multer';
import express from 'express';
import { getEmailHTML, getOtpEmailHTML } from '../src/utils/emailTemplate';

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.post('/api/send-email', upload.any(), async (req: any, res: any) => {
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

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: EMAIL_USER,
          pass: EMAIL_APP_PASSWORD,
        },
      });

      const attachments = [];
      const files = req.files;
      if (files && files.length > 0) {
        for (const file of files) {
          attachments.push({
            filename: file.originalname || "document.pdf",
            content: file.buffer,
          });
        }
      }

      const isOtpRequest = isOtp === "true" || (subject && (subject.includes("OTP") || subject.includes("Verifikasi")));
      const finalOtpCode = otpCode || (body && body.match(/\*\*(\d{4})\*\*/)?.[1]) || "0000";

      const htmlContent = isOtpRequest
        ? await getOtpEmailHTML(body, finalOtpCode)
        : await getEmailHTML(body, { bodyFontFamily, emailFormat, paragraphAlign, location });

      const mailOptions = {
        from: `"Alvareza Hilka Pratama" <${EMAIL_USER}>`,
        replyTo: EMAIL_USER,
        to: targetEmail,
        subject: subject,
        html: htmlContent,
        text: body ? body.replace(/\*\*/g, '') : '', 
        attachments,
      };

      await transporter.sendMail(mailOptions);
      
      res.status(200).json({ message: "Email berhasil terkirim!" });
    } catch (error: any) {
      console.error("Error sending email:", error);
      res.status(500).json({ error: error.message || "Gagal mengirim email" });
    }
});

export default app;

export const config = {
  api: {
    bodyParser: false,
  },
};
