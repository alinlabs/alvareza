import { describe, it, expect } from 'vitest';
import { generateTailoredApplicationDraft } from '../../src/utils/draft/draftEmailTemplates';

describe('Draft Email Templates Unit Tests', () => {
  it('generates professional Indonesian application email draft with company name and job title', () => {
    const result = generateTailoredApplicationDraft({
      companyName: 'PT Sampoerna Agro Tbk',
      jobTitle: 'Assistant Operations Manager',
      recipientEmail: 'recruitment@sampoerna.co.id',
      language: 'in',
    });

    expect(result.emailSubject).toContain('PT Sampoerna Agro Tbk');
    expect(result.emailSubject).toContain('Assistant Operations Manager');
    expect(result.emailSubject).toContain('Alvareza Hilka Pratama');

    expect(result.emailBody).toContain('PT Sampoerna Agro Tbk');
    expect(result.emailBody).toContain('Assistant Operations Manager');
    expect(result.emailBody).toContain('MarkPlus Institute');
    expect(result.emailBody).toContain('Six Sigma');
  });

  it('generates professional English application email draft when language is en', () => {
    const result = generateTailoredApplicationDraft({
      companyName: 'McKinsey & Company',
      jobTitle: 'Business Analyst',
      recipientEmail: 'careers@mckinsey.com',
      language: 'en',
    });

    expect(result.emailSubject).toContain('Job Application: Business Analyst - McKinsey & Company');
    expect(result.emailBody).toContain('Dear Recruitment Team at McKinsey & Company');
    expect(result.emailBody).toContain('Business Analyst position at McKinsey & Company');
  });

  it('handles missing company name gracefully without generating broken subject strings', () => {
    const result = generateTailoredApplicationDraft({
      companyName: '',
      jobTitle: 'HR Specialist',
      recipientEmail: 'hrd@company.com',
      language: 'in',
    });

    expect(result.emailSubject).toBe('Lamaran Pekerjaan: HR Specialist - Alvareza Hilka Pratama');
    expect(result.emailSubject).not.toContain('- -');
  });
});
