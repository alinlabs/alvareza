import { describe, it, expect } from 'vitest';
import { ALL_IDENTITY_DOCS } from '../../src/data/identityDocs';
import { buildIdentityDocsPdf } from '../../src/utils/identityPdfGenerator';

describe('Identity Documents & PDF Engine Unit Tests', () => {
  it('contains required official identity documents in catalog', () => {
    expect(ALL_IDENTITY_DOCS.length).toBeGreaterThanOrEqual(3);

    const ktp = ALL_IDENTITY_DOCS.find((d) => d.id === 'ktp');
    const kk = ALL_IDENTITY_DOCS.find((d) => d.id === 'kk');
    const npwp = ALL_IDENTITY_DOCS.find((d) => d.id === 'npwp');

    expect(ktp).toBeDefined();
    expect(ktp?.title).toContain('KTP');
    expect(kk).toBeDefined();
    expect(kk?.title).toContain('Kartu Keluarga');
    expect(npwp).toBeDefined();
  });

  it('rejects empty selection array when building identity PDF attachments', async () => {
    await expect(
      buildIdentityDocsPdf({
        selectedIds: [],
        isColorPrint: false,
      })
    ).rejects.toThrow('Tidak ada dokumen identitas yang dipilih.');
  });

  it('validates selected identity document IDs against registry', async () => {
    await expect(
      buildIdentityDocsPdf({
        selectedIds: ['non_existent_id'],
        isColorPrint: false,
      })
    ).rejects.toThrow('Pilihan dokumen identitas tidak valid.');
  });
});
