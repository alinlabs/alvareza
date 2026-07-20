-- Seed data for email_template
DROP TABLE IF EXISTS email_template;
CREATE TABLE IF NOT EXISTS email_template (
    id TEXT PRIMARY KEY,
    jenis TEXT NOT NULL,
    html TEXT NOT NULL
);

INSERT INTO email_template (id, jenis, html) VALUES
('otp', 'Verifikasi OTP', '<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Kode OTP Verifikasi Keamanan</title>
  <style>
    body { font-family: ''Segoe UI'', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #1e293b; margin: 0; padding: 0; background-color: #f8fafc; }
    .container { max-width: 500px; margin: 40px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; }
    .header { background-color: #0f172a; color: #ffffff; padding: 32px 24px; text-align: center; }
    .header .shield-icon { font-size: 40px; margin-bottom: 12px; display: block; }
    .header h1 { margin: 0; font-size: 20px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase; color: #f8fafc; }
    .content { padding: 40px 32px; font-size: 15px; color: #334155; }
    .greeting { font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 16px; }
    .desc { margin-bottom: 24px; color: #475569; }
    .otp-container { text-align: center; margin: 32px 0; }
    .otp-card { display: inline-block; background-color: #f1f5f9; border: 2px dashed #cbd5e1; border-radius: 12px; padding: 16px 32px; }
    .otp-code { font-family: ''Courier New'', Courier, monospace; font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #02227E; margin: 0; }
    .warning-box { background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 16px; border-radius: 8px; margin-top: 32px; font-size: 13px; color: #991b1b; }
    .warning-box p { margin: 0; }
    .footer { background-color: #f1f5f9; padding: 24px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; }
    .footer p { margin: 4px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <span class="shield-icon">🛡️</span>
      <h1>Verifikasi Keamanan</h1>
    </div>
    <div class="content">
      <div class="greeting">Halo Administrator,</div>
      <p class="desc">Seseorang mencoba mengakses Dashboard Admin menggunakan fitur Lupa Kata Sandi. Guna melanjutkan proses verifikasi identitas, silakan gunakan Kode Keamanan (OTP) berikut:</p>
      
      <div class="otp-container">
        <div class="otp-card">
          <div class="otp-code">{{OTP_CODE}}</div>
        </div>
      </div>
      
      <p class="desc" style="font-size: 14px; color: #64748b;">Kode OTP di atas hanya berlaku untuk sesi login saat ini dan bersifat sangat rahasia.</p>
      
      <div class="warning-box">
        <p><strong>PENTING:</strong> Demi keamanan akun Anda, harap jangan membagikan kode verifikasi ini kepada siapapun termasuk pihak yang mengaku sebagai teknisi atau sistem pengelola.</p>
      </div>
    </div>
    <div class="footer">
      <p style="font-weight: 700; color: #475569;">Sistem Otentikasi Dashboard Admin</p>
      <p>Email ini dihasilkan secara otomatis. Mohon tidak membalas email ini.</p>
    </div>
  </div>
</body>
</html>
'),
('formal', 'Surat Lamaran Kerja - Formal', '<!DOCTYPE html><html><head><meta charset="UTF-8"><style>body { font-family: Arial, sans-serif !important; background: #ffffff; color: #000000; margin: 0; padding: 20px; } .container { max-width: 800px; margin: 0 auto; line-height: 1.6; font-size: 15px; } table { font-family: Arial, sans-serif !important; } .kop-surat { text-align: center; margin-bottom: 30px; } .kop-surat h1 { margin: 0; font-size: 22px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; } .kop-garis-tebal { margin-top: 15px; margin-bottom: 2px; border: 0; border-top: 3px solid #000; } .kop-garis-tipis { margin-top: 0; margin-bottom: 25px; border: 0; border-top: 1px solid #000; }</style></head><body><div class="container"><div class="kop-surat"><h1>SURAT LAMARAN KERJA</h1><hr class="kop-garis-tebal" /><hr class="kop-garis-tipis" /></div>{{BODY_CONTENT}}</div></body></html>'),
('surat-lamaran', 'Surat Lamaran Kerja', '<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: ''Arial'', sans-serif; line-height: 1.6; color: #333333; margin: 0; padding: 0; background-color: #f9fafb; }
    .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #e5e7eb; }
    .header { background-color: #02227E; color: #ffffff; padding: 24px; text-align: center; }
    .header h1 { margin: 0; font-size: 20px; font-weight: 600; letter-spacing: 0.5px; }
    .content { padding: 32px 32px; font-size: 15px; color: #374151; text-align: justify; }
    .footer { background-color: #f8fafc; padding: 24px 32px; text-align: center; border-top: 1px solid #e5e7eb; font-size: 13px; color: #64748b; }
    .social-icon { display: inline-block; margin: 0 12px; opacity: 0.6; text-decoration: none; }
    .social-icon img { width: 22px; height: 22px; border: 0; }
    .date-text { text-align: right; margin-bottom: 24px; font-size: 14px; color: #64748b; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header" style="background: linear-gradient(135deg, #02227E 0%, #0439b5 100%); padding: 32px 24px; text-align: center; border-bottom: 4px solid #facc15;">       <h1 style="margin: 0; font-size: 28px; font-weight: 800; color: #ffffff; letter-spacing: 1px; text-transform: uppercase; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">Surat Lamaran Kerja</h1>     </div>
    <div class="content">
      <div class="date-text">
        {{DATE_NOW}}
      </div>
      {{BODY_CONTENT}}
      
      <div style="text-align: center; margin-top: 40px; margin-bottom: 10px;">
        <a href="https://www.alvareza.my.id/" style="display: inline-block; text-decoration: none; border: 1px solid #e2e8f0; border-radius: 50px; padding: 6px 20px 6px 6px; background-color: #ffffff;">
          <table cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td valign="middle" style="padding-right: 14px; border-right: 1px solid #e2e8f0;">
                <img src="https://www.alvareza.my.id/gambar/profil.png" alt="Profile" style="width: 46px; height: 46px; border-radius: 50%; display: block; object-fit: cover;" />
              </td>
              <td valign="middle" style="padding-left: 14px;">
                <div style="font-size: 15px; font-weight: 700; color: #0f172a; font-family: ''Arial'', sans-serif; line-height: 1.2;">Alvareza Hilka Pratama</div>
                <div style="font-size: 13px; font-weight: 400; color: #64748b; margin-top: 4px; font-family: ''Arial'', sans-serif; line-height: 1;">
                  Lihat Portofolio <span style="font-size: 12px; margin-left: 2px;">&#10095;</span>
                </div>
              </td>
            </tr>
          </table>
        </a>
      </div>
    </div>
    <div class="footer">
      <p style="margin-top: 0; margin-bottom: 4px; font-size: 13px; font-weight: 500; color: #64748b;">Email ini dikirim melalui sistem portofolio terintegrasi</p>
      <p style="margin-top: 0; margin-bottom: 16px; font-size: 13px;"><a href="https://www.alvareza.my.id" style="color: #02227E; text-decoration: none; font-weight: 600;">www.alvareza.my.id</a></p>
      <div>
        <a href="https://wa.me/6285797184059" class="social-icon">
          <img src="https://img.icons8.com/color/96/whatsapp.png" alt="WhatsApp" />
        </a>
        <a href="mailto:alvareza.work@gmail.com" class="social-icon">
          <img src="https://img.icons8.com/color/96/gmail-new.png" alt="Email" />
        </a>
        <a href="https://instagram.com/varezza_" class="social-icon">
          <img src="https://img.icons8.com/color/96/instagram-new.png" alt="Instagram" />
        </a>
      </div>
    </div>
  </div>
</body>
</html>
');
