/**
 * Vercel Serverless Function: Test GAS Connection
 */

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
    const { webAppUrl } = req.body || {};

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

    if (gasResponse.ok && (data.success !== false || data.status)) {
      return res.status(200).json({
        success: true,
        message: 'Koneksi ke Google Apps Script berhasil terverifikasi aktif!',
        details: data,
      });
    }

    return res.status(200).json({
      success: false,
      error: data.error || `Endpoint merespons dengan status ${gasResponse.status}`,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: `Gagal menguji koneksi: ${err?.message || 'Koneksi timeout'}`,
    });
  }
}
