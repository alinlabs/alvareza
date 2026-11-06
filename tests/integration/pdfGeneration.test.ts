import { describe, it, expect } from 'vitest';
import { buildATSPDFDocument } from '../../src/utils/pdf/coreGenerator';
import { ALL_ROLE_PRESETS } from '../../src/data/preset/RoleConfig';
import { getItemSelectionForPreset, getPresetSectionOrders } from '../../src/data/preset/ItemSelections';

describe('PDF Generation Integration Tests', () => {
  it('generates a valid PDF for default optimal preset', () => {
    const { doc, totalPages, filename } = buildATSPDFDocument({
      preset: 'optimal',
      language: 'in',
    });

    expect(doc).toBeDefined();
    expect(totalPages).toBeGreaterThanOrEqual(1);
    expect(filename).toMatch(/\.pdf$/);

    const buffer = doc.output('arraybuffer');
    expect(buffer.byteLength).toBeGreaterThan(1000);
  });

  it('generates valid PDFs across first 5 diverse role presets', () => {
    const presetsToTest = ALL_ROLE_PRESETS.slice(0, 5);

    for (const preset of presetsToTest) {
      const items = getItemSelectionForPreset(preset.key);
      const sectionOrders = getPresetSectionOrders(preset.key);

      const { doc, totalPages } = buildATSPDFDocument({
        preset: preset.key,
        language: 'in',
        items: items as any,
        sectionOrders,
      });

      expect(totalPages).toBeGreaterThanOrEqual(1);
      const buffer = doc.output('arraybuffer');
      expect(buffer.byteLength).toBeGreaterThan(1000);
    }
  });

  it('supports English language generation without errors', () => {
    const { doc, totalPages } = buildATSPDFDocument({
      preset: 'optimal',
      language: 'en',
    });

    expect(doc).toBeDefined();
    expect(totalPages).toBeGreaterThanOrEqual(1);
    const buffer = doc.output('arraybuffer');
    expect(buffer.byteLength).toBeGreaterThan(1000);
  });

  it('generates a valid PDF with modern design preset including profile photo on left', () => {
    const { doc, totalPages, filename } = buildATSPDFDocument({
      preset: 'optimal',
      language: 'in',
      designPreset: 'modern',
      headerStyle: 'modern',
    });

    expect(doc).toBeDefined();
    expect(totalPages).toBeGreaterThanOrEqual(1);
    expect(filename).toMatch(/\.pdf$/);

    const buffer = doc.output('arraybuffer');
    expect(buffer.byteLength).toBeGreaterThan(15000); // contains embedded 3x4 photo
  });

  it('generates valid PDFs for modern and line designs with custom headerColor', () => {
    const { doc: modernDoc } = buildATSPDFDocument({
      preset: 'optimal',
      language: 'in',
      designPreset: 'modern',
      headerColor: '#DC2626',
    });
    expect(modernDoc).toBeDefined();

    const { doc: lineDoc } = buildATSPDFDocument({
      preset: 'optimal',
      language: 'in',
      designPreset: 'line',
      headerColor: '#059669',
    });
    expect(lineDoc).toBeDefined();
  });
});
