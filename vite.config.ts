import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig, Plugin} from 'vite';
import { ALL_ROLE_PRESETS } from './src/data/rolePresetsConfig';

function generateRouteMetatagsPlugin(): Plugin {
  return {
    name: 'generate-route-metatags',
    closeBundle() {
      const distDir = path.resolve(__dirname, 'dist');
      const indexPath = path.join(distDir, 'index.html');
      if (!fs.existsSync(indexPath)) return;

      const template = fs.readFileSync(indexPath, 'utf-8');

      interface RouteMeta {
        route: string;
        title: string;
        desc: string;
      }

      const routeMetaMap = new Map<string, RouteMeta>();

      const addRoute = (route: string, title: string, desc: string) => {
        const cleanRoute = route.toLowerCase().trim();
        if (!cleanRoute || cleanRoute === '/' || routeMetaMap.has(cleanRoute)) return;
        routeMetaMap.set(cleanRoute, { route: cleanRoute, title, desc });
      };

      // Dedicated /cv route for LinkedIn Featured & direct sharing
      addRoute(
        'cv',
        'My Professional CV — Alvareza Hilka Pratama',
        'Curriculum Vitae (CV) ATS-Friendly resmi Alvareza Hilka Pratama. Business Operations & Certified HR Specialist. Rekam jejak supervisi 13 gerai ritel, koordinasi 6 divisi, 100+ proyek komersial, dan sertifikasi IACET & Six Sigma.'
      );

      // Base predefined routes
      addRoute('all', 'Curriculum Vitae (CV) ATS - Alvareza H. Pratama (ALL) | MyCivy PDF Preview', 'Lihat pratinjau Curriculum Vitae (CV) ATS-Friendly profil komprehensif Alvareza H. Pratama. Format standar industri, siap cetak dan unduh langsung format PDF.');
      addRoute('opt', 'Curriculum Vitae (CV) ATS - Alvareza H. Pratama (OPTIMAL) | MyCivy PDF Preview', 'Lihat pratinjau Curriculum Vitae (CV) ATS-Friendly rekomendasi optimal Alvareza H. Pratama. Padat, efisien, dan siap cetak langsung format PDF.');
      addRoute('preview', 'Curriculum Vitae (CV) ATS - Alvareza H. Pratama | MyCivy PDF Preview', 'Pratinjau Curriculum Vitae (CV) ATS-Friendly resmi Alvareza H. Pratama. Terverifikasi standar sistem pelacak pelamar kerja, siap unduh instan format PDF.');
      addRoute('pdf', 'Curriculum Vitae (CV) ATS - Alvareza H. Pratama | MyCivy PDF Preview', 'Pratinjau Curriculum Vitae (CV) ATS-Friendly resmi Alvareza H. Pratama. Format standar industri, siap cetak dan unduh langsung format PDF.');
      addRoute('full', 'Curriculum Vitae (CV) ATS - Alvareza H. Pratama | MyCivy PDF Preview', 'Pratinjau Curriculum Vitae (CV) ATS-Friendly resmi Alvareza H. Pratama. Format standar industri, siap cetak dan unduh langsung format PDF.');

      // Portfolio and Certification routes
      addRoute('portofolio', 'Portofolio Profesional & Solusi Digital — Alvareza Hilka Pratama', 'Koleksi proyek strategis, otomatisasi operasional, efisiensi proses bisnis, dan 50+ solusi aplikasi web yang dikembangkan oleh Alvareza Hilka Pratama.');
      addRoute('portfolio', 'Portofolio Profesional & Solusi Digital — Alvareza Hilka Pratama', 'Koleksi proyek strategis, otomatisasi operasional, efisiensi proses bisnis, dan 50+ solusi aplikasi web yang dikembangkan oleh Alvareza Hilka Pratama.');
      addRoute('sertifikasi', 'Sertifikasi Resmi & Lisensi Profesi — Alvareza Hilka Pratama', 'Daftar sertifikasi kompetensi industri resmi Alvareza Hilka Pratama: MarkPlus Institute Certified HR Specialist (Grade A), Six Sigma White Belt CSSC USA, Saylor IACET, dan Google Certified.');
      addRoute('sertifikat', 'Sertifikasi Resmi & Lisensi Profesi — Alvareza Hilka Pratama', 'Daftar sertifikasi kompetensi industri resmi Alvareza Hilka Pratama: MarkPlus Institute Certified HR Specialist (Grade A), Six Sigma White Belt CSSC USA, Saylor IACET, dan Google Certified.');
      addRoute('certifications', 'Sertifikasi Resmi & Lisensi Profesi — Alvareza Hilka Pratama', 'Daftar sertifikasi kompetensi industri resmi Alvareza Hilka Pratama: MarkPlus Institute Certified HR Specialist (Grade A), Six Sigma White Belt CSSC USA, Saylor IACET, dan Google Certified.');

      // Academic Document routes
      addRoute('skl', 'Surat Keterangan Lulus (SKL) Resmi — Alvareza Hilka Pratama, S.M.', 'Pratinjau berkas resmi Surat Keterangan Lulus (SKL) Program Studi S1 Manajemen Universitas Al-Ghifari - Alvareza Hilka Pratama, S.M.');
      addRoute('transkrip', 'Transkrip Nilai Akademik Resmi — Alvareza Hilka Pratama, S.M.', 'Pratinjau berkas resmi Transkrip Nilai Akademik Program Studi S1 Manajemen Universitas Al-Ghifari - Alvareza Hilka Pratama, S.M.');
      addRoute('akademik', 'Dokumen Akademik Resmi — Alvareza Hilka Pratama, S.M.', 'Pratinjau berkas resmi Surat Keterangan Lulus (SKL) dan Transkrip Nilai Akademik Alvareza Hilka Pratama, S.M.');

      // Add all presets and their short codes
      for (const preset of ALL_ROLE_PRESETS) {
        const title = `Curriculum Vitae (CV) ATS - ${preset.titleId} | MyCivy PDF Preview`;
        const desc = `Pratinjau Curriculum Vitae (CV) ATS posisi ${preset.titleId} Alvareza H. Pratama. ${preset.descId} Siap cetak dan unduh langsung format PDF.`;
        
        addRoute(preset.key, title, desc);
        addRoute(preset.code, title, desc);
        addRoute(preset.key.replace(/_/g, '-'), title, desc);
      }

      for (const item of routeMetaMap.values()) {
        const itemDir = path.join(distDir, item.route);
        if (!fs.existsSync(itemDir)) {
          fs.mkdirSync(itemDir, { recursive: true });
        }

        const canonicalUrl = `https://alvareza.vercel.app/${item.route}`;
        let ogImageUrl = 'https://alvareza.vercel.app/og-image.jpg';
        if (item.route === 'portofolio' || item.route === 'portfolio') {
          ogImageUrl = 'https://alvareza.vercel.app/og-portfolio.jpg';
        } else if (item.route === 'sertifikasi' || item.route === 'sertifikat' || item.route === 'certifications') {
          ogImageUrl = 'https://alvareza.vercel.app/og-certification.jpg';
        }
        let pageHtml = template;

        pageHtml = pageHtml.replace(/<title>[\s\S]*?<\/title>/i, `<title>${item.title}</title>`);
        pageHtml = pageHtml.replace(/<meta\s+name="title"\s+content="[^"]*"\s*\/?>/i, `<meta name="title" content="${item.title}" />`);
        pageHtml = pageHtml.replace(/<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:title" content="${item.title}" />`);
        pageHtml = pageHtml.replace(/<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/i, `<meta name="twitter:title" content="${item.title}" />`);

        pageHtml = pageHtml.replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i, `<meta name="description" content="${item.desc}" />`);
        pageHtml = pageHtml.replace(/<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:description" content="${item.desc}" />`);
        pageHtml = pageHtml.replace(/<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/i, `<meta name="twitter:description" content="${item.desc}" />`);

        pageHtml = pageHtml.replace(/<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i, `<link rel="canonical" href="${canonicalUrl}" />`);
        pageHtml = pageHtml.replace(/<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:url" content="${canonicalUrl}" />`);
        pageHtml = pageHtml.replace(/<meta\s+name="twitter:url"\s+content="[^"]*"\s*\/?>/i, `<meta name="twitter:url" content="${canonicalUrl}" />`);

        // Ensure JPEG OpenGraph image
        pageHtml = pageHtml.replace(/<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:image" content="${ogImageUrl}" />`);
        pageHtml = pageHtml.replace(/<meta\s+property="og:image:secure_url"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:image:secure_url" content="${ogImageUrl}" />`);
        pageHtml = pageHtml.replace(/<meta\s+property="og:image:type"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:image:type" content="image/jpeg" />`);
        pageHtml = pageHtml.replace(/<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/?>/i, `<meta name="twitter:image" content="${ogImageUrl}" />`);
        pageHtml = pageHtml.replace(/<link\s+rel="image_src"\s+href="[^"]*"\s*\/?>/i, `<link rel="image_src" href="${ogImageUrl}" />`);

        // Set og:type to profile for cv and resume presets
        const isProfilePage = item.route === 'cv' || item.route === 'all' || item.route === 'opt' || item.route === 'full';
        if (isProfilePage) {
          pageHtml = pageHtml.replace(/<meta\s+property="og:type"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:type" content="profile" />\n    <meta property="profile:first_name" content="Alvareza Hilka" />\n    <meta property="profile:last_name" content="Pratama" />\n    <meta property="profile:username" content="alvareza" />`);
        }

        fs.writeFileSync(path.join(itemDir, 'index.html'), pageHtml, 'utf-8');
      }
    },
  };
}

export default defineConfig(() => {
  return {
    base: '/',
    plugins: [react(), tailwindcss(), generateRouteMetatagsPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      target: 'esnext',
      outDir: 'dist',
      emptyOutDir: true,
      chunkSizeWarningLimit: 1500,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('jspdf') || id.includes('html2canvas') || id.includes('pdfjs-dist') || id.includes('canvg')) {
                return 'vendor-pdf';
              }
              if (id.includes('tesseract.js')) {
                return 'vendor-ocr';
              }
              if (id.includes('lottie-react') || id.includes('lottie-web')) {
                return 'vendor-lottie';
              }
              if (id.includes('lucide-react')) {
                return 'vendor-icons';
              }
              return 'vendor-core';
            }
            if (
              id.includes('src/data/presetProjects') ||
              id.includes('src/data/presetExperiences') ||
              id.includes('src/data/presetHeadlinesSummaries') ||
              id.includes('src/data/rolePresetsConfig') ||
              id.includes('src/data/presetKeywordsBilingual')
            ) {
              return 'preset-data';
            }
          },
        },
      },
    },
    optimizeDeps: {
      esbuildOptions: {
        target: 'esnext',
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
