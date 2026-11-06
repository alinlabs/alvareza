import { describe, it, expect } from 'vitest';
import { ALL_ROLE_PRESETS } from '../../src/data/preset/RoleConfig';
import { PRESET_HEADLINES, PRESET_SUMMARIES } from '../../src/data/preset/HeadlinesSummaries';
import { getItemSelectionForPreset, getPresetSectionOrders } from '../../src/data/preset/ItemSelections';
import { ALL_ACADEMIC_DOCS } from '../../src/data/academicDocs';
import { ALL_IDENTITY_DOCS } from '../../src/data/identityDocs';

describe('Data Integrity & Regression Test Suite', () => {
  it('all presets in ALL_ROLE_PRESETS have valid non-empty headlines and summaries', () => {
    for (const preset of ALL_ROLE_PRESETS) {
      const headlineObj = PRESET_HEADLINES[preset.key];
      const summaryObj = PRESET_SUMMARIES[preset.key];

      expect(headlineObj, `Preset ${preset.key} must have a valid headline object`).toBeDefined();
      const headlineText = headlineObj.in || headlineObj.en || (headlineObj as any).id;
      expect(typeof headlineText, `Preset ${preset.key} headline must be string`).toBe('string');
      expect(headlineText.trim().length, `Preset ${preset.key} headline must not be empty`).toBeGreaterThan(3);

      expect(summaryObj, `Preset ${preset.key} must have a valid summary object`).toBeDefined();
      const summaryText = summaryObj.in || summaryObj.en || (summaryObj as any).id;
      expect(typeof summaryText, `Preset ${preset.key} summary must be string`).toBe('string');
      expect(summaryText.trim().length, `Preset ${preset.key} summary must not be empty`).toBeGreaterThan(20);
    }
  });

  it('all presets in ALL_ROLE_PRESETS have valid section orders and item selections', () => {
    for (const preset of ALL_ROLE_PRESETS) {
      const items = getItemSelectionForPreset(preset.key);
      const orders = getPresetSectionOrders(preset.key);

      expect(items, `Preset ${preset.key} must resolve valid items`).toBeDefined();
      expect(typeof orders, `Preset ${preset.key} orders must be an object`).toBe('object');
      expect(Array.isArray(orders.skills_hard), `Preset ${preset.key} skills_hard must be array`).toBe(true);
      expect(orders.skills_hard.length, `Preset ${preset.key} skills_hard must have items`).toBeGreaterThan(0);
    }
  });

  it('verifies academic docs integrity', () => {
    expect(ALL_ACADEMIC_DOCS.length).toBeGreaterThanOrEqual(2);
    for (const doc of ALL_ACADEMIC_DOCS) {
      expect(doc.id).toBeDefined();
      expect(doc.title).toBeDefined();
      expect(doc.url).toBeDefined();
    }
  });

  it('verifies identity docs integrity', () => {
    expect(ALL_IDENTITY_DOCS.length).toBeGreaterThanOrEqual(3);
    for (const doc of ALL_IDENTITY_DOCS) {
      expect(doc.id).toBeDefined();
      expect(doc.title).toBeDefined();
      expect(doc.url).toBeDefined();
    }
  });
});
