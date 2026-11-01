import { Router } from 'express';

export const healthRouter = Router();

// API Health Check
  healthRouter.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      hasApiKey: !!process.env.GEMINI_API_KEY,
      timestamp: new Date().toISOString(),
    });
  });
