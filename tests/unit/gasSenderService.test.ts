import { describe, it, expect, beforeEach } from 'vitest';
import { GasSenderService } from '../../src/services/gasSenderService';

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

describe('GasSenderService Unit Tests', () => {
  beforeEach(() => {
    storageMock.clear();
  });

  it('initializes with all 6 default accounts', () => {
    const accounts = GasSenderService.getAccounts();
    expect(accounts.length).toBe(6);
    expect(accounts[0].email).toBe('halo.alvareza@gmail.com');
    expect(accounts[5].email).toBe('alvarezastudio@gmail.com');
  });

  it('updates account webAppUrl correctly', () => {
    const updated = GasSenderService.updateAccountUrl('halo', 'https://script.google.com/macros/s/test/exec');
    const target = updated.find((a) => a.id === 'halo');
    expect(target).toBeDefined();
    expect(target?.webAppUrl).toBe('https://script.google.com/macros/s/test/exec');
    expect(target?.status).toBe('ready');
  });

  it('correctly toggles and gets send modes (rotate vs manual)', () => {
    expect(GasSenderService.getSendMode()).toBe('rotate');
    GasSenderService.setSendMode('manual');
    expect(GasSenderService.getSendMode()).toBe('manual');
    GasSenderService.setSendMode('rotate');
    expect(GasSenderService.getSendMode()).toBe('rotate');
  });

  it('manages manual sender account ID', () => {
    GasSenderService.setManualAccountId('career');
    expect(GasSenderService.getManualAccountId()).toBe('career');
  });

  it('records send history item on success', () => {
    GasSenderService.recordSendSuccess('halo', {
      targetEmail: 'hrd@company.com',
      companyName: 'PT Sukses Makmur',
      jobTitle: 'Operations Lead',
      subject: 'Lamaran Pekerjaan: Operations Lead',
      senderEmail: 'halo.alvareza@gmail.com',
      senderAccountId: 'halo',
      hasAttachment: true,
      attachmentNames: ['cv.pdf'],
    });

    const history = GasSenderService.getHistory();
    expect(history.length).toBe(1);
    expect(history[0].status).toBe('success');
    expect(history[0].targetEmail).toBe('hrd@company.com');
  });
});
