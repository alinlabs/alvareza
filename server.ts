import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { registerRoutes } from './server/routes';

dotenv.config();

// Global process error safety to avoid abrupt crashes
process.on('unhandledRejection', (reason, promise) => {
  console.warn('[Server] Unhandled Rejection at:', promise, 'reason:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('[Server] Uncaught Exception:', err);
});

async function startServer() {
  const app = express();

  // Parse command line arguments or environment variables
  const getArgValue = (argName: string): string | undefined => {
    const index = process.argv.indexOf(argName);
    return index !== -1 && process.argv[index + 1] ? process.argv[index + 1] : undefined;
  };

  const PORT = parseInt(getArgValue('--port') || process.env.PORT || '3000', 10);
  const HOST = getArgValue('--host') || process.env.HOST || '0.0.0.0';

  // Universal CORS Handler for all routes, static assets, and preflight requests
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, HEAD');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, *');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // Increase body limit to handle payloads
  app.use(express.json({ limit: '20mb' }));
  app.use(express.urlencoded({ extended: true, limit: '20mb' }));

  // Register all modular route handlers (health, seo, ocr, gas)
  registerRoutes(app);

  // Global CORS headers for static files
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');
    if (req.path.endsWith('.pdf')) {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'inline');
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    }
    next();
  });

  // Serve public assets (static files like favicon, lottie.min.js, etc.)
  app.use(
    express.static(path.join(process.cwd(), 'public'), {
      setHeaders: (res, filePath) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', '*');
        if (filePath.endsWith('.pdf')) {
          res.setHeader('Content-Type', 'application/pdf');
          res.setHeader('Content-Disposition', 'inline');
          res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
        }
        if (filePath.endsWith('manifest.json') || filePath.endsWith('manifest-admin.json')) {
          res.setHeader('Content-Type', 'application/manifest+json');
        }
      },
    })
  );

  // Vite middleware for development vs static for production
  let vite: any = null;
  if (process.env.NODE_ENV !== 'production') {
    vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR === 'true' ? false : undefined,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const server = app.listen(PORT, HOST, () => {
    console.log(`Digital Profile Server with Gemini AI running on http://${HOST}:${PORT}`);
  });

  server.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`[Server] Port ${PORT} is temporarily in use. Retrying in 1.5s...`);
      setTimeout(() => {
        try {
          server.close();
        } catch {}
        server.listen(PORT, HOST, () => {
          console.log(`Digital Profile Server recovered and listening on http://${HOST}:${PORT}`);
        });
      }, 1500);
    } else {
      console.error('[Server] Fatal server error:', err);
    }
  });

  const shutdown = async () => {
    console.log('[Server] Gracefully shutting down...');
    if (vite) {
      await vite.close().catch(() => {});
    }
    server.close(() => {
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
