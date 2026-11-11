import { Express } from 'express';
import { healthRouter } from './health';
import { seoRouter } from './seo';
import { gasRouter } from './gas';

export function registerRoutes(app: Express): void {
  app.use(healthRouter);
  app.use(seoRouter);
  app.use(gasRouter);
}

export * from './health';
export * from './seo';
export * from './gas';
