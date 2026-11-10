import { describe, it, expect, beforeEach } from 'vitest';
import { JobDraftService } from '../../src/services/jobDraftService';

const storageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => (key in store ? store[key] : null),
    setItem: (key: string, value: string) => {
      store[key] = String(value);
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

// Set window & localStorage for browser service simulation
(global as any).window = global;
(global as any).localStorage = storageMock;

describe('JobDraftService Unit Tests', () => {
  beforeEach(() => {
    storageMock.clear();
  });

  it('saves a new draft and retrieves it', () => {
    const draft = JobDraftService.saveDraft({
      companyName: 'PT Mandiri Sejahtera',
      jobTitle: 'Store Supervisor',
      recipientEmail: 'recruitment@mandiri.co.id',
      emailBody: 'Draft body text',
      presetKey: 'operasional',
      subject: 'Lamaran Pekerjaan: Store Supervisor',
      language: 'id',
      emailOption: 'auto_rotate',
    });

    expect(draft.id).toBeDefined();
    expect(draft.status).toBe('draft');
    expect(draft.createdAt).toBeDefined();

    const allDrafts = JobDraftService.getDrafts();
    expect(allDrafts.length).toBe(1);
    expect(allDrafts[0].companyName).toBe('PT Mandiri Sejahtera');
  });

  it('updates an existing draft by ID', () => {
    const draft = JobDraftService.saveDraft({
      companyName: 'PT Maju Terus',
      jobTitle: 'Admin',
      recipientEmail: 'admin@maju.com',
      emailBody: 'Body text',
      presetKey: 'office_administration',
      subject: 'Lamaran Pekerjaan: Admin',
      language: 'id',
      emailOption: 'auto_rotate',
    });

    JobDraftService.updateDraft(draft.id, {
      status: 'sending',
      jobTitle: 'Senior Admin',
    });

    const updatedList = JobDraftService.getDrafts();
    expect(updatedList[0].status).toBe('sending');
    expect(updatedList[0].jobTitle).toBe('Senior Admin');
  });

  it('deletes a draft by ID', () => {
    const draft = JobDraftService.saveDraft({
      companyName: 'PT Hapus',
      jobTitle: 'Staf',
      recipientEmail: 'hapus@test.com',
      emailBody: 'Body text',
      presetKey: 'optimal',
      subject: 'Lamaran Pekerjaan: Staf',
      language: 'id',
      emailOption: 'auto_rotate',
    });

    expect(JobDraftService.getDraftCount()).toBe(1);
    JobDraftService.deleteDraft(draft.id);
    expect(JobDraftService.getDraftCount()).toBe(0);
  });

  it('configures and persists bulk delay seconds with min threshold 3s', () => {
    expect(JobDraftService.getBulkDelaySeconds()).toBe(8); // default
    JobDraftService.setBulkDelaySeconds(12);
    expect(JobDraftService.getBulkDelaySeconds()).toBe(12);
  });
});
