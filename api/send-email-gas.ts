/**
 * Vercel Serverless Function: Proxy Send Email via Google Apps Script (GAS)
 */

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '25mb',
    },
  },
};

export default async function handler(req: any, res: any) {
  // CORS Headers
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
    const {
      gasUrl,
      targetEmail,
      subject,
      body,
      bodyText,
      bodyHtml,
      senderName = 'Lamaran Kerja Alvareza',
      cc,
      bcc,
      attachments = [],
      senderEmail,
      accountId,
    } = req.body || {};

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

    const plainBody = (body || bodyText || bodyHtml || '').trim();
    let finalHtml = bodyHtml;
    if (!finalHtml || typeof finalHtml !== 'string' || !finalHtml.trim()) {
      const escaped = plainBody
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
      finalHtml = `<div style="font-family: Arial, sans-serif; font-size: 14px; line-height: 1.6; color: #1e293b;">${escaped.replace(/\n/g, '<br/>')}</div>`;
    }

    const payload = {
      targetEmail: targetEmail.trim(),
      subject: (subject || 'Lamaran Pekerjaan').trim(),
      body: plainBody,
      bodyText: plainBody,
      bodyHtml: finalHtml,
      senderName: senderName || 'Lamaran Kerja Alvareza',
      cc: cc ? String(cc).trim() : '',
      bcc: bcc ? String(bcc).trim() : '',
      attachments: Array.isArray(attachments) ? attachments : [],
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 35000);

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

    return res.status(200).json({
      success: true,
      message: responseJson.message || 'Email lamaran berhasil dikirim via GAS!',
      accountId,
      senderEmail,
    });
  } catch (err: any) {
    const isTimeout = err?.name === 'AbortError';
    return res.status(500).json({
      success: false,
      error: isTimeout
        ? 'Koneksi ke Google Apps Script timeout (>35 detik). Periksa deployment GAS Anda.'
        : `Gagal menghubungi Google Apps Script: ${err?.message || 'Koneksi terputus'}`,
    });
  }
}
