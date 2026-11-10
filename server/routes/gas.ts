import { Router } from 'express';
import { formatEmailBodyToHtml } from '../../src/utils/gasAttachmentGenerator';

export const gasRouter = Router();

// API: Proxy Send Email via Google Apps Script (GAS) Web App URL
  gasRouter.post('/api/send-email-gas', async (req, res) => {
    try {
      const {
        gasUrl,
        targetEmail,
        subject,
        body,
        bodyText,
        bodyHtml,
        senderName,
        cc,
        bcc,
        attachments = [],
        senderEmail,
        accountId,
      } = req.body;

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

      console.log(`[GAS Proxy] Forwarding email to GAS Web App for ${targetEmail} via ${senderEmail || 'GAS'}`);

      // Forward to Google Apps Script with both plain text body and HTML formatted body
      const plainBody = (body || bodyText || bodyHtml || '').trim();
      const formattedHtml = (bodyHtml && typeof bodyHtml === 'string' && bodyHtml.trim().length > 0)
        ? bodyHtml.trim()
        : formatEmailBodyToHtml(plainBody);

      const payload = {
        targetEmail: targetEmail.trim(),
        subject: (subject || 'Lamaran Pekerjaan').trim(),
        body: plainBody,
        bodyText: plainBody,
        bodyHtml: formattedHtml,
        senderName: (senderName && typeof senderName === 'string' && senderName.trim().length > 0 && senderName !== 'Lamaran Kerja Alvareza')
          ? senderName.trim()
          : 'Alvareza Hilka Pratama',
        replyTo: senderEmail || 'alvareza.work@gmail.com',
        cc: cc ? String(cc).trim() : '',
        bcc: bcc ? String(bcc).trim() : '',
        attachments: Array.isArray(attachments) ? attachments : [],
      };

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 35000); // 35s timeout for attachments

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

      return res.json({
        success: true,
        message: responseJson.message || 'Email lamaran berhasil dikirim via GAS!',
        accountId,
        senderEmail,
      });
    } catch (err: any) {
      console.error('[GAS Proxy Error]:', err?.message || err);
      const isTimeout = err?.name === 'AbortError';
      return res.status(500).json({
        success: false,
        error: isTimeout
          ? 'Koneksi ke Google Apps Script timeout (>35 detik). Periksa deployment GAS Anda.'
          : `Gagal menghubungi Google Apps Script: ${err?.message || 'Koneksi terputus'}`,
      });
    }
  });

  // API: Test GAS Web App Connection
  gasRouter.post('/api/test-gas-account', async (req, res) => {
    try {
      const { webAppUrl } = req.body;

      if (!webAppUrl || !webAppUrl.startsWith('https://script.google.com/')) {
        return res.status(400).json({
          success: false,
          error: 'URL Web App harus diawali dengan https://script.google.com/macros/s/.../exec',
        });
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      const gasResponse = await fetch(webAppUrl.trim(), {
        method: 'GET',
        signal: controller.signal,
        redirect: 'follow',
      });

      clearTimeout(timeoutId);

      const text = await gasResponse.text();
      let data: any;
      try {
        data = JSON.parse(text);
      } catch {
        data = { success: gasResponse.ok, statusText: text.slice(0, 100) };
      }

      return res.json({
        success: true,
        message: 'Koneksi ke Google Apps Script aktif dan dapat diakses!',
        data,
      });
    } catch (err: any) {
      return res.json({
        success: false,
        error: `Gagal terhubung ke GAS: ${err?.message || 'Periksa pengaturan Who has access: Anyone'}`,
      });
    }
  });
