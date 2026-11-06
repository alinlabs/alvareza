import { describe, it, expect } from 'vitest';
import express from 'express';
import { healthRouter } from '../../server/routes/health';
import { seoRouter } from '../../server/routes/seo';
import { gasRouter } from '../../server/routes/gas';

describe('Server Modular Routes Integration Tests', () => {
  it('instantiates all routers without error', () => {
    expect(healthRouter).toBeDefined();
    expect(seoRouter).toBeDefined();
    expect(gasRouter).toBeDefined();
  });

  it('verifies express app mounts all routers without conflict', () => {
    const app = express();
    app.use(express.json());
    expect(() => {
      app.use(healthRouter);
      app.use(seoRouter);
      app.use(gasRouter);
    }).not.toThrow();
  });
});
