import { Router } from 'express';
import fs from 'fs';
import path from 'path';

export const seoRouter = Router();

// Google Search Console HTML Verification File
  seoRouter.get('/google80999917237409d2.html', (req, res) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send('google-site-verification: google80999917237409d2.html');
  });

  // Explicit Sitemap.xml Handler with application/xml Content-Type and multi-alias support
  seoRouter.get(['/sitemap.xml', '/sitemap', '/sitemap_index.xml'], (req, res) => {
    const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
    if (fs.existsSync(sitemapPath)) {
      let content = fs.readFileSync(sitemapPath, 'utf-8');
      const host = (req.headers.host || '').toLowerCase();
      // If requested via www domain, adapt URLs dynamically to match verified property
      if (host.includes('www.alvareza.my.id')) {
        content = content.replace(/https:\/\/alvareza\.my\.id/g, 'https://www.alvareza.my.id');
      }
      res.setHeader('Content-Type', 'application/xml; charset=utf-8');
      res.setHeader('X-Robots-Tag', 'all, index, follow');
      res.setHeader('Cache-Control', 'public, max-age=3600');
      return res.send(content);
    }
    res.status(404).send('Sitemap not found');
  });

  // Explicit Robots.txt Handler
  seoRouter.get('/robots.txt', (req, res) => {
    const robotsPath = path.join(process.cwd(), 'public', 'robots.txt');
    if (fs.existsSync(robotsPath)) {
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('X-Robots-Tag', 'all');
      return res.sendFile(robotsPath);
    }
    res.status(404).send('Robots.txt not found');
  });

// oEmbed API endpoint for rich snippet embedding (LinkedIn, Discord, Slack, etc.)
  seoRouter.get('/api/oembed', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json({
      version: '1.0',
      type: 'rich',
      provider_name: 'Digital Profile',
      provider_url: 'https://alvareza.my.id',
      title: 'My Professional CV — Alvareza Hilka Pratama',
      author_name: 'Alvareza Hilka Pratama',
      author_url: 'https://alvareza.my.id',
      thumbnail_url: 'https://alvareza.my.id/og-image.jpg',
      thumbnail_width: 1200,
      thumbnail_height: 630,
      html: '<p>Curriculum Vitae (CV) ATS-Friendly &amp; Portofolio Alvareza Hilka Pratama. Business Operations &amp; Certified HR Specialist.</p>',
      width: 600,
      height: 800,
    });
  });

  // Dedicated endpoint to proxy / stream academic files with guaranteed CORS
  seoRouter.get(['/api/academic-pdf/:docId', '/akademik-stream/:docId'], (req, res) => {
    const docId = (req.params.docId || '').toLowerCase();
    let filename = '';
    if (docId.includes('transkrip')) {
      filename = 'transkrip.webp';
    } else {
      filename = 'skl.webp';
    }
    const filePath = path.join(process.cwd(), 'public', 'akademik', filename);

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');

    if (fs.existsSync(filePath)) {
      return res.sendFile(filePath);
    }
    return res.status(404).json({ error: 'Academic file not found' });
  });

  // Dedicated static file handler with URL decoding and CORS for /portofolio/
  seoRouter.get('/portofolio/:filename', (req, res, next) => {
    try {
      const decoded = decodeURIComponent(req.params.filename);
      const filePath = path.join(process.cwd(), 'public', 'portofolio', decoded);
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', '*');
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
      if (fs.existsSync(filePath)) {
        return res.sendFile(filePath);
      }
    } catch {
      // fallback
    }
    next();
  });

  // Dedicated static file handler with URL decoding and CORS for /sertifikasi/
  seoRouter.get('/sertifikasi/:filename', (req, res, next) => {
    try {
      const decoded = decodeURIComponent(req.params.filename);
      const filePath = path.join(process.cwd(), 'public', 'sertifikasi', decoded);
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', '*');
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
      if (fs.existsSync(filePath)) {
        return res.sendFile(filePath);
      }
    } catch {
      // fallback
    }
    next();
  });

  // Dedicated static file handler with URL decoding and CORS for /akademik/
  seoRouter.get('/akademik/:filename', (req, res, next) => {
    try {
      const decoded = decodeURIComponent(req.params.filename);
      const filePath = path.join(process.cwd(), 'public', 'akademik', decoded);
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', '*');
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
      if (fs.existsSync(filePath)) {
        return res.sendFile(filePath);
      }
    } catch {
      // fallback
    }
    next();
  });

  // Dedicated static file handler with URL decoding and CORS for /identitas/
  seoRouter.get('/identitas/:filename', (req, res, next) => {
    try {
      const decoded = decodeURIComponent(req.params.filename);
      const filePath = path.join(process.cwd(), 'public', 'identitas', decoded);
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', '*');
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
      if (fs.existsSync(filePath)) {
        return res.sendFile(filePath);
      }
    } catch {
      // fallback
    }
    next();
  });

