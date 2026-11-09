import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import {
  ALL_AWARDS_LIST,
  AWARDS_IMAGES,
  CV_ACHIEVEMENT_TO_AWARD_ID_MAP,
  AWARD_TO_CV_ACHIEVEMENT_MAP,
} from '../../src/data/awards/awardsCatalog';
import { AWARDS_ITEM_CREDENTIALS } from '../../src/config/esign-awards';

describe('Awards Catalog & Renaming Integrity ([tahun]-xxx-xxx.webp)', () => {
  const EXPECTED_AWARDS_COUNT = 19;
  const awardsPublicDir = path.resolve(__dirname, '../../public/penghargaan');

  it('contains exactly 19 awards in ALL_AWARDS_LIST', () => {
    expect(ALL_AWARDS_LIST.length).toBe(EXPECTED_AWARDS_COUNT);
  });

  it('all award IDs are sequentially numbered awd-1 through awd-19', () => {
    ALL_AWARDS_LIST.forEach((award, index) => {
      expect(award.id).toBe(`awd-${index + 1}`);
    });
  });

  it('all award filenames match the [tahun]-xxx-xxx.webp convention', () => {
    const filenamePattern = /^\d{4}-[a-z0-9-]+\.webp$/;
    for (const award of ALL_AWARDS_LIST) {
      expect(award.filename).toMatch(filenamePattern);
      expect(award.filename.startsWith(`${award.year}-`)).toBe(true);
    }
  });

  it('all 19 award files physically exist in public/penghargaan and are non-empty', () => {
    for (const award of ALL_AWARDS_LIST) {
      const filePath = path.join(awardsPublicDir, award.filename);
      expect(fs.existsSync(filePath), `File ${award.filename} should exist on disk`).toBe(true);
      const stat = fs.statSync(filePath);
      expect(stat.size).toBeGreaterThan(1000); // Must be a real image (>1KB)
    }
  });

  it('no old filenames remain in public/penghargaan', () => {
    const files = fs.readdirSync(awardsPublicDir);
    expect(files.length).toBe(EXPECTED_AWARDS_COUNT);
    for (const file of files) {
      expect(file).toMatch(/^\d{4}-[a-z0-9-]+\.webp$/);
    }
  });

  it('AWARDS_IMAGES maps every award ID to /penghargaan/[filename]', () => {
    for (const award of ALL_AWARDS_LIST) {
      expect(AWARDS_IMAGES[award.id]).toBe(`/penghargaan/${award.filename}`);
    }
  });

  it('AWARDS_ITEM_CREDENTIALS in esign-awards.ts covers all 19 award items with verified signers', () => {
    for (const award of ALL_AWARDS_LIST) {
      const cred = AWARDS_ITEM_CREDENTIALS[award.id];
      expect(cred, `Credentials for ${award.id} must be defined`).toBeDefined();
      expect(cred.authority.commonName).toBeTruthy();
      expect(cred.signer.commonName).toBeTruthy();
      expect(cred.reason).toContain('Verifikasi Keaslian');
      expect(cred.reason).toContain('Alvareza Hilka Pratama');

      if (cred.signatureType === 'DUAL') {
        expect(cred.coSigner, `${award.id} is DUAL and should have coSigner`).toBeDefined();
        expect(cred.coSigner?.commonName).toBeTruthy();
      }

      if (cred.signatureType === 'MULTI') {
        expect(cred.signers && cred.signers.length >= 3, `${award.id} is MULTI and should have >=3 signers`).toBe(true);
      }
    }
  });

  it('achievement mapping maps only to valid award IDs and is bidirectional', () => {
    const awardIds = new Set(ALL_AWARDS_LIST.map((a) => a.id));
    for (const [achId, awdId] of Object.entries(CV_ACHIEVEMENT_TO_AWARD_ID_MAP)) {
      expect(awardIds.has(awdId), `Achievement ${achId} maps to invalid award ID ${awdId}`).toBe(true);
      expect(AWARD_TO_CV_ACHIEVEMENT_MAP[awdId]).toBe(achId);
    }
  });

  it('ALL_AWARDS_LIST is strictly sorted chronologically from newest to oldest', () => {
    for (let i = 0; i < ALL_AWARDS_LIST.length - 1; i++) {
      const current = ALL_AWARDS_LIST[i];
      const next = ALL_AWARDS_LIST[i + 1];
      const dateCurrent = current.date || `${current.year}-01-01`;
      const dateNext = next.date || `${next.year}-01-01`;
      expect(dateCurrent >= dateNext, `Award ${current.id} (${dateCurrent}) must be >= ${next.id} (${dateNext})`).toBe(true);
    }
    // First item must be 2025, last item must be 2017
    expect(ALL_AWARDS_LIST[0].year).toBe('2025');
    expect(ALL_AWARDS_LIST[ALL_AWARDS_LIST.length - 1].year).toBe('2017');
  });
});
