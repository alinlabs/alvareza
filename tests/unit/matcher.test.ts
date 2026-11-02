import { describe, it, expect } from 'vitest';
import {
  matchPresetFromJobTitle,
  ALL_ROLE_PRESETS,
  resolvePresetFromQuery,
  getPresetKeyFromCodeOrKey,
} from '../../src/data/preset/RoleConfig';

describe('Job Position Matcher Unit Tests', () => {
  it('correctly matches HR positions to hr preset', () => {
    const res = matchPresetFromJobTitle('HR Staff');
    expect(res).toBeDefined();
    expect(res.key).toMatch(/hr/i);
  });

  it('correctly matches Operational roles to operational preset', () => {
    const res = matchPresetFromJobTitle('Store Manager');
    expect(res).toBeDefined();
    expect(res.key).toMatch(/operasional|operations|retail/i);
  });

  it('correctly matches Marketing roles', () => {
    const res = matchPresetFromJobTitle('Digital Marketing Specialist');
    expect(res).toBeDefined();
    expect(res.key).toMatch(/marketing/i);
  });

  it('correctly matches Tech/Frontend roles', () => {
    const res = matchPresetFromJobTitle('Frontend Developer');
    expect(res).toBeDefined();
    expect(res.key).toMatch(/tech|it|frontend/i);
  });

  it('resolves preset codes and keys correctly', () => {
    expect(getPresetKeyFromCodeOrKey('OPT')).toBe('optimal');
    expect(getPresetKeyFromCodeOrKey('optimal')).toBe('optimal');
    expect(resolvePresetFromQuery('opt')).toBe('optimal');
    expect(resolvePresetFromQuery('all')).toBe('all');
  });

  it('every preset in ALL_ROLE_PRESETS has unique keys and codes', () => {
    const keys = new Set<string>();
    const codes = new Set<string>();

    for (const preset of ALL_ROLE_PRESETS) {
      expect(keys.has(preset.key)).toBe(false);
      expect(codes.has(preset.code)).toBe(false);
      keys.add(preset.key);
      codes.add(preset.code);
      expect(preset.titleId).toBeDefined();
      expect(preset.titleEn).toBeDefined();
    }
    expect(ALL_ROLE_PRESETS.length).toBeGreaterThanOrEqual(10);
  });
});
