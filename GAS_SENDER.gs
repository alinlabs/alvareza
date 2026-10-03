/**
 * 🚀 Google Apps Script - Email Sender with CORS Handler
 * 
 * CARA DEPLOY:
 * 1. Buka https://script.google.com/ dan buat Project baru.
 * 2. Hapus semua kode bawaan, lalu paste semua kode di bawah ini.
 * 3. Klik "Deploy" (Terapkan) > "New deployment" (Deployment baru).
 * 4. Pilih tipe: "Web app" (Aplikasi web).
 * 5. Konfigurasi:
 *    - Description: "Email Sender API - Lamaran Kerja Alvareza"
 *    - Execute as: "Me" (Diri sendiri)
 *    - Who has access: "Anyone" (Siapa saja)
 * 6. Klik "Deploy". 
 * 7. Copy "Web app URL" dan paste di Pengaturan Akun GAS.
 * 
 * KEUNGGULAN:
 * - Mengirimkan Plain Text Body dan HTML Body secara lengkap (tidak akan kosong).
 * - Penamaan pengirim konsisten: "Lamaran Kerja Alvareza".
 * - Mem-bypass limit Nginx Server, mendukung pengiriman lampiran file & CV PDF.
 */

function doPost(e) {
  // CORS Header wajib untuk fetch dari browser & backend proxy
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400'
  };

  try {
    let payload = {};
    if (e && e.postData && e.postData.contents) {
      try {
        payload = JSON.parse(e.postData.contents);
      } catch (err) {
        payload = e.parameter || {};
      }
    } else if (e && e.parameter) {
      payload = e.parameter;
    }

    const targetEmail = (payload.targetEmail || payload.to || payload.recipient || '').trim();
    const subject = (payload.subject || 'Lamaran Pekerjaan').trim();
    
    // Ekstraksi isi email lengkap (mendukung body, bodyText, text, message, bodyHtml)
    const rawBody = payload.body || payload.bodyText || payload.text || payload.message || payload.bodyHtml || '';
    const bodyText = typeof rawBody === 'string' ? rawBody.trim() : String(rawBody || '').trim();
    
    // Siapkan versi HTML jika bodyHtml tidak disediakan
    let bodyHtml = payload.bodyHtml;
    if (!bodyHtml || typeof bodyHtml !== 'string' || !bodyHtml.trim()) {
      const escaped = bodyText
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      bodyHtml = escaped.replace(/\n/g, '<br/>');
    }

    const senderName = "Lamaran Kerja Alvareza";
    const cc = payload.cc ? String(payload.cc).trim() : '';
    const bcc = payload.bcc ? String(payload.bcc).trim() : '';
    const attachments = payload.attachments || [];

    if (!targetEmail || targetEmail.indexOf('@') === -1) {
      return responseJson({ success: false, error: 'Email tujuan tidak ditemukan atau tidak valid' }, 400, headers);
    }

    // Menyiapkan email options lengkap untuk MailApp
    const mailOptions = {
      to: targetEmail,
      subject: subject,
      body: bodyText,       // Plain text body wajib agar terbaca sempurna di semua email client
      htmlBody: bodyHtml,   // HTML formatted body
      name: senderName      // Selalu menggunakan "Lamaran Kerja Alvareza"
    };

    if (cc) mailOptions.cc = cc;
    if (bcc) mailOptions.bcc = bcc;

    // Menyiapkan attachments
    if (attachments && attachments.length > 0) {
      const blobs = [];
      for (let i = 0; i < attachments.length; i++) {
        const att = attachments[i];
        if (att && att.base64) {
          const decoded = Utilities.base64Decode(att.base64);
          const blob = Utilities.newBlob(decoded, att.mimeType || 'application/pdf', att.filename || 'Lampiran.pdf');
          blobs.push(blob);
        }
      }
      if (blobs.length > 0) {
        mailOptions.attachments = blobs;
      }
    }

    // Kirim Email
    MailApp.sendEmail(mailOptions);

    return responseJson({
      success: true,
      message: 'Email berhasil dikirim via GAS!',
      recipient: targetEmail,
      subject: subject
    }, 200, headers);

  } catch (error) {
    return responseJson({ success: false, error: 'Terjadi kesalahan GAS: ' + error.message }, 500, headers);
  }
}

// Handler untuk CORS Preflight (OPTIONS)
function doOptions(e) {
  return responseJson({}, 200, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400'
  });
}

function doGet(e) {
  return responseJson({
    success: true,
    status: 'GAS Email API Active',
    name: 'Lamaran Kerja Alvareza',
    timestamp: new Date().toISOString()
  }, 200, {
    'Access-Control-Allow-Origin': '*'
  });
}

function responseJson(data, statusCode, headers) {
  const output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}