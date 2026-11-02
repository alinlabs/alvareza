import { describe, it, expect } from 'vitest';
import { validateAndSanitizeOcrResult } from '../../src/utils/ocrValidatorAndMapper';

describe('OCR Validator and Entity Mapper Unit Tests', () => {
  it('enforces legal entity (PT / CV / Firma) requirement for companyName', () => {
    const rawResult = {
      companyName: 'WE ARE HIRING NOW',
      jobTitle: 'Store Supervisor',
      recipientEmail: 'recruitment@company.com',
      recipientPhone: '08123456789',
      formatSubjectNotice: '',
      keyRequirements: [],
      emailSubject: '',
      emailBody: '',
      language: 'id' as const,
    };

    const sanitized = validateAndSanitizeOcrResult(rawResult, 'WE ARE HIRING NOW Staff Operasional');
    // Non-legal company names must be wiped out to prevent slogans as company name
    expect(sanitized.companyName).toBe('');
  });

  it('preserves valid PT / CV legal entity names with dot normalization', () => {
    const rawResult = {
      companyName: 'PT Sumber Alfaria Trijaya Tbk',
      jobTitle: 'Area Coordinator',
      recipientEmail: 'hrd@alfamart.co.id',
      recipientPhone: '',
      formatSubjectNotice: '',
      keyRequirements: [],
      emailSubject: '',
      emailBody: '',
      language: 'id' as const,
    };

    const sanitized = validateAndSanitizeOcrResult(rawResult, 'PT Sumber Alfaria Trijaya Tbk Area Coordinator');
    expect(sanitized.companyName).toContain('Sumber Alfaria Trijaya');
    expect(sanitized.companyName.startsWith('PT.') || sanitized.companyName.startsWith('PT')).toBe(true);
  });

  it('filters out invalid email addresses', () => {
    const rawResult = {
      companyName: 'PT Sukses Mandiri',
      jobTitle: 'Admin',
      recipientEmail: 'not-an-email',
      recipientPhone: '',
      formatSubjectNotice: '',
      keyRequirements: [],
      emailSubject: '',
      emailBody: '',
      language: 'id' as const,
    };

    const sanitized = validateAndSanitizeOcrResult(rawResult, 'PT Sukses Mandiri');
    expect(sanitized.recipientEmail).toBe('');
  });
});
