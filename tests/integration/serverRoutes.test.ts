import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import express from 'express';
import http from 'http';
import { healthRouter } from '../../server/routes/health';
import { seoRouter } from '../../server/routes/seo';
import { gasRouter } from '../../server/routes/gas';
import { ocrRouter } from '../../server/routes/ocr';

describe('Server Modular Routes Live Integration Tests', () => {
  let server: http.Server;
  let baseUrl: string;

  beforeAll(async () => {
    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(healthRouter);
    app.use(seoRouter);
    app.use(gasRouter);
    app.use(ocrRouter);

    await new Promise<void>((resolve) => {
      server = app.listen(0, '127.0.0.1', () => {
        const addr = server.address() as any;
        baseUrl = `http://127.0.0.1:${addr.port}`;
        resolve();
      });
    });
  });

  afterAll(async () => {
    if (server) {
      if (typeof (server as any).closeAllConnections === 'function') {
        (server as any).closeAllConnections();
      }
      await new Promise<void>((resolve) => server.close(() => resolve()));
    }
  });

  it('GET /api/health responds with 200 and ok status', async () => {
    const res = await fetch(`${baseUrl}/api/health`, { headers: { Connection: 'close' } });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.status).toBe('ok');
    expect(data.timestamp).toBeDefined();
  });

  it('POST /api/send-email-gas rejects missing or invalid GAS URL with 400', async () => {
    const res = await fetch(`${baseUrl}/api/send-email-gas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Connection: 'close' },
      body: JSON.stringify({
        gasUrl: 'https://evil-attacker.com/steal',
        targetEmail: 'hrd@company.com',
      }),
    });

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.success).toBe(false);
    expect(data.error).toContain('tidak valid');
  });

  it('POST /api/send-email-gas rejects invalid target email with 400', async () => {
    const res = await fetch(`${baseUrl}/api/send-email-gas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Connection: 'close' },
      body: JSON.stringify({
        gasUrl: 'https://script.google.com/macros/s/AKfycbxTest/exec',
        targetEmail: 'not-an-email',
      }),
    });

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.success).toBe(false);
    expect(data.error).toContain('tidak valid');
  });

  it('POST /api/test-gas-account rejects non-Google GAS URLs with 400', async () => {
    const res = await fetch(`${baseUrl}/api/test-gas-account`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Connection: 'close' },
      body: JSON.stringify({
        webAppUrl: 'https://phishing.site/webhook',
      }),
    });

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.success).toBe(false);
    expect(data.error).toContain('https://script.google.com/macros/s/.../exec');
  });

  it('POST /api/scan-job-text processes fallback text without API key gracefully', async () => {
    const res = await fetch(`${baseUrl}/api/scan-job-text`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Connection: 'close' },
      body: JSON.stringify({
        extractedText: 'Lowongan Kerja PT Indofood Sukses Makmur. Posisi: HR Staff. Email: recruitment@indofood.com',
        filename: 'poster.jpg',
      }),
    });

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.data).toBeDefined();
    expect(data.data.companyName).toContain('Indofood');
    expect(data.data.recipientEmail).toBe('recruitment@indofood.com');
  });

  it('GET /sitemap.xml returns XML content with standard header', async () => {
    const res = await fetch(`${baseUrl}/sitemap.xml`, { headers: { Connection: 'close' } });
    expect(res.status).toBe(200);
    const contentType = res.headers.get('content-type') || '';
    expect(contentType).toContain('xml');
    const xmlText = await res.text();
    expect(xmlText).toContain('urlset');
    expect(xmlText).toContain('https://alvareza.my.id/');
  });

  it('GET /robots.txt returns plain text directives', async () => {
    const res = await fetch(`${baseUrl}/robots.txt`, { headers: { Connection: 'close' } });
    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text).toContain('User-agent:');
    expect(text).toContain('Sitemap:');
  });
});
