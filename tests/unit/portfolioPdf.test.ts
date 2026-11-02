import { describe, it, expect } from 'vitest';
import {
  getAdaptivePortfolioSlides,
  sortPortfolioSlideIds,
  getActiveCertificateList,
  isHrPosition,
  isRecruitmentScreeningFocus,
} from '../../src/utils/portfolio-pdf/slideSelector';
import { ALL_PORTFOLIO_SLIDES } from '../../src/utils/portfolio-pdf/slideCatalog';

describe('Executive Portfolio PDF Engine Unit Tests', () => {
  it('ALL_PORTFOLIO_SLIDES contains all essential slide sections', () => {
    expect(ALL_PORTFOLIO_SLIDES.length).toBeGreaterThanOrEqual(10);
    const cover = ALL_PORTFOLIO_SLIDES.find((s) => s.id === 'cover');
    const keyImpact = ALL_PORTFOLIO_SLIDES.find((s) => s.id === 'key-impact');

    expect(cover).toBeDefined();
    expect(cover?.section).toBe('I');
    expect(keyImpact).toBeDefined();
    expect(keyImpact?.section).toBe('I');
  });

  it('correctly identifies HR positions and recruitment screening focus', () => {
    expect(isHrPosition('hr_personnel_admin', 'HR Officer')).toBe(true);
    expect(isHrPosition('talent_acquisition', 'Recruiter Specialist')).toBe(true);
    expect(isHrPosition('operasional', 'Store Manager')).toBe(false);

    expect(isRecruitmentScreeningFocus('talent_acquisition', 'Talent Acquisition Lead')).toBe(true);
    expect(isRecruitmentScreeningFocus('hr_personnel_admin', 'Payroll & General Affairs')).toBe(false);
  });

  it('adapts portfolio slides for HR roles with specific solution prioritization', () => {
    const hrSlides = getAdaptivePortfolioSlides('talent_acquisition', {
      jobTitle: 'Recruitment & Screening Specialist',
    });

    const slideIds = hrSlides.map((s) => s.id);
    expect(slideIds).toContain('cover');
    // For recruitment focus, sol-8 (Talenty) should be present
    expect(slideIds).toContain('sol-8');
  });

  it('adapts portfolio slides for non-HR operational roles', () => {
    const opsSlides = getAdaptivePortfolioSlides('operasional', {
      jobTitle: 'Operations Manager',
    });

    const slideIds = opsSlides.map((s) => s.id);
    expect(slideIds).toContain('cover');
    expect(slideIds).toContain('efficiency-ops');
  });

  it('sorts portfolio slide IDs canonically by section order (I -> II -> III -> IV -> V)', () => {
    const unsorted = ['cert-industri', 'efficiency-ops', 'cover', 'sol-1'];
    const sorted = sortPortfolioSlideIds(unsorted);

    expect(sorted[0]).toBe('cover'); // Section I
    expect(sorted[1]).toBe('efficiency-ops'); // Section II
    expect(sorted[sorted.length - 1]).toBe('cert-industri'); // Section V
  });

  it('returns valid active certificate file configs for preset', () => {
    const certs = getActiveCertificateList('optimal');
    expect(Array.isArray(certs)).toBe(true);
    expect(certs.length).toBeGreaterThan(0);
    expect(certs[0].id).toBeDefined();
    expect(certs[0].filename).toBeDefined();
  });
});
