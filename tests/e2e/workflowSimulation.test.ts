import { describe, it, expect } from 'vitest';
import { matchPresetFromJobTitle } from '../../src/data/preset/RoleConfig';
import { generateTailoredApplicationDraft } from '../../src/utils/draft/draftEmailTemplates';
import { generateCvPdfAttachment, generateCoverLetterPdfAttachment } from '../../src/utils/gasAttachmentGenerator';

describe('End-to-End Application Workflow Simulation', () => {
  it('simulates end-to-end flow from job title detection to email attachment creation', () => {
    // 1. User inputs a job title from a poster
    const jobTitleInput = 'HR Staff & General Affairs';
    const companyInput = 'PT Global Logistik Indonesia';

    // 2. Role Matcher automatically determines optimal ATS preset
    const matchedPreset = matchPresetFromJobTitle(jobTitleInput);
    expect(matchedPreset).toBeDefined();
    expect(matchedPreset.key).toBeDefined();

    // 3. Application draft engine creates personalized email body
    const draft = generateTailoredApplicationDraft({
      companyName: companyInput,
      jobTitle: jobTitleInput,
      recipientEmail: 'hrd@globallogistik.co.id',
      language: 'in',
    });

    expect(draft.emailSubject).toContain(companyInput);
    expect(draft.emailSubject).toContain(jobTitleInput);
    expect(draft.emailBody).toContain('Alvareza Hilka Pratama');
    expect(draft.emailBody).toContain('MarkPlus Institute');

    // 4. Attachments are generated for dispatch
    const cvAttachment = generateCvPdfAttachment({
      preset: matchedPreset.key,
      language: 'in',
      jobTitle: jobTitleInput,
      companyName: companyInput,
    });

    expect(cvAttachment.base64).toBeDefined();
    expect(cvAttachment.mimeType).toBe('application/pdf');

    const coverLetterAttachment = generateCoverLetterPdfAttachment({
      companyName: companyInput,
      jobTitle: jobTitleInput,
      language: 'in',
      presetKey: matchedPreset.key,
    });

    expect(coverLetterAttachment.base64).toBeDefined();
    expect(coverLetterAttachment.mimeType).toBe('application/pdf');

    // 5. Final payload structure check
    const finalAttachments = [cvAttachment, coverLetterAttachment];
    expect(finalAttachments.length).toBe(2);
    expect(finalAttachments.every((a) => a.base64.length > 500)).toBe(true);
  });
});
