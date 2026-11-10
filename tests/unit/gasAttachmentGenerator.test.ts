import { describe, it, expect } from 'vitest';
import {
  formatEmailBodyToHtml,
  generateCvPdfAttachment,
  generateCoverLetterPdfAttachment,
} from '../../src/utils/gasAttachmentGenerator';

describe('GAS Attachment Generator & Email Formatter Unit Tests', () => {
  it('formats email body plain text into clean HTML with bullets and paragraphs', () => {
    const raw = `Yth. Tim Rekrutmen PT Jaya Abadi
Perkenalkan saya Alvareza Hilka Pratama.

Pengalaman kerja saya:
• Supervisi 13 gerai retail
• Standardisasi 20+ SOP operasional

Hubungi saya di 085797184059.`;

    const html = formatEmailBodyToHtml(raw);
    expect(html).toContain('font-family:');
    expect(html).toContain('<ul');
    expect(html).toContain('<li');
    expect(html).toContain('Supervisi 13 gerai retail');
    expect(html).toContain('wa.me/6285797184059');
  });

  it('generates valid CV ATS PDF attachment object with base64 and filename', () => {
    const att = generateCvPdfAttachment({
      preset: 'optimal',
      language: 'in',
      jobTitle: 'Operations Lead',
      companyName: 'PT Maju Bersama',
    });

    expect(att).toBeDefined();
    expect(att.filename).toMatch(/\.pdf$/);
    expect(att.mimeType).toBe('application/pdf');
    expect(typeof att.base64).toBe('string');
    expect(att.base64.length).toBeGreaterThan(100);
  });

  it('generates valid Cover Letter PDF attachment object', () => {
    const att = generateCoverLetterPdfAttachment({
      companyName: 'PT Teknologi Bangsa',
      jobTitle: 'Project Manager',
      language: 'in',
      presetKey: 'pmo',
    });

    expect(att).toBeDefined();
    expect(att.filename).toMatch(/\.pdf$/);
    expect(att.mimeType).toBe('application/pdf');
    expect(typeof att.base64).toBe('string');
    expect(att.base64.length).toBeGreaterThan(100);
  });
});
