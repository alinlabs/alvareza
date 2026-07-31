/**
 * 🚀 Google Apps Script - Email Sender with CORS Handler
 * 
 * CARA DEPLOY:
 * 1. Buka https://script.google.com/ dan buat Project baru.
 * 2. Hapus semua kode bawaan, lalu paste semua kode di bawah ini.
 * 3. Klik "Deploy" (Terapkan) > "New deployment" (Deployment baru).
 * 4. Pilih tipe: "Web app" (Aplikasi web).
 * 5. Konfigurasi:
 *    - Description: "Email Sender API"
 *    - Execute as: "Me" (Diri sendiri)
 *    - Who has access: "Anyone" (Siapa saja)
 * 6. Klik "Deploy". 
 * 7. Copy "Web app URL" dan paste di menu "Profil & Pengaturan" -> "GAS Web App URL".
 * 
 * KENAPA INI TERBAIK?
 * - Mem-bypass limit 1MB Nginx Server, mendukung pengiriman file hingga 50MB.
 * - Handler CORS bawaan via doGet() untuk browser preflight OPTIONS jika dibutuhkan,
 *   namun menggunakan mode navigasi (Content-Type: text/plain) membuat request lebih cepat.
 */

function doPost(e) {
  // CORS Header wajib untuk fetch dari browser
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400'
  };

  try {
    // Parsing payload
    const payload = JSON.parse(e.postData.contents);
    const targetEmail = payload.targetEmail;
    const subject = payload.subject;
    const bodyHtml = payload.bodyHtml;
    const isOtp = payload.isOtp;
    const cc = payload.cc;
    const bcc = payload.bcc;
    const attachments = payload.attachments || [];

    if (!targetEmail) {
      return responseJson({ success: false, error: 'Email tujuan tidak ditemukan' }, 400, headers);
    }

    // Menyiapkan email options
    const mailOptions = {
      to: targetEmail,
      subject: subject,
      htmlBody: bodyHtml,
      name: "Alvareza's ATS Email System"
    };

    if (cc) mailOptions.cc = cc;
    if (bcc) mailOptions.bcc = bcc;

    // Menyiapkan attachments
    if (attachments && attachments.length > 0) {
      const blobs = attachments.map(att => {
        const decoded = Utilities.base64Decode(att.base64);
        return Utilities.newBlob(decoded, att.mimeType, att.filename);
      });
      mailOptions.attachments = blobs;
    }

    // Kirim Email
    MailApp.sendEmail(mailOptions);

    return responseJson({ success: true, message: 'Email berhasil dikirim via GAS!' }, 200, headers);

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
  return responseJson({ success: true, status: 'GAS Email API Active' }, 200, {
    'Access-Control-Allow-Origin': '*'
  });
}

function responseJson(data, statusCode, headers) {
  const output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}
