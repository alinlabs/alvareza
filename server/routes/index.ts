import { Express } from 'express';
import { healthRouter } from './health';
import { seoRouter } from './seo';
import { ocrRouter } from './ocr';
import { gasRouter } from './gas';

export function registerRoutes(app: Express): void {
  app.use(healthRouter);
  app.use(seoRouter);
  app.use(ocrRouter);
  app.use(gasRouter);
}

export * from './health';
export * from './seo';
export * from './ocr';
export * from './gas';
