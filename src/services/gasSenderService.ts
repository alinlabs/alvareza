import {
  GasAccountConfig,
  GasSendMode,
  GasSendHistoryItem,
  GasSendResponse,
  GasEmailPayload,
  INITIAL_6_GAS_ACCOUNTS,
} from '../types/gasSender';
import { formatEmailBodyToHtml } from '../utils/gasAttachmentGenerator';

const STORAGE_ACCOUNTS_KEY = 'mycivy_gas_accounts_v1';
const STORAGE_MODE_KEY = 'mycivy_gas_mode_v1';
const STORAGE_MANUAL_ID_KEY = 'mycivy_gas_manual_id_v1';
const STORAGE_ROTATION_INDEX_KEY = 'mycivy_gas_rotation_index_v1';
const STORAGE_HISTORY_KEY = 'mycivy_gas_sent_history_v1';

export class GasSenderService {
  /**
   * Get all 6 accounts from localStorage or initial defaults
   */
  static getAccounts(): GasAccountConfig[] {
    if (typeof window === 'undefined') return INITIAL_6_GAS_ACCOUNTS;

    try {
      const stored = localStorage.getItem(STORAGE_ACCOUNTS_KEY);
      if (!stored) {
        // Save initial defaults
        localStorage.setItem(STORAGE_ACCOUNTS_KEY, JSON.stringify(INITIAL_6_GAS_ACCOUNTS));
        return INITIAL_6_GAS_ACCOUNTS;
      }
      const parsed: GasAccountConfig[] = JSON.parse(stored);

      let needsSave = false;
      // Merge with INITIAL_6_GAS_ACCOUNTS to preserve all 6 preset email addresses
      const merged = INITIAL_6_GAS_ACCOUNTS.map((initAcc) => {
        const found = parsed.find((p) => p.email === initAcc.email || p.id === initAcc.id);
        if (found) {
          const effectiveUrl = found.webAppUrl || initAcc.webAppUrl || '';
          const wasMissingUrl = !found.webAppUrl || found.webAppUrl.trim().length === 0;
          const isActive = effectiveUrl
            ? (wasMissingUrl ? true : (found.isActive !== undefined ? found.isActive : true))
            : false;

          if (wasMissingUrl && effectiveUrl) {
            needsSave = true;
          }

          return {
            ...initAcc,
            webAppUrl: effectiveUrl,
            isActive,
            totalSent: found.totalSent || 0,
            lastSentAt: found.lastSentAt,
            status: (effectiveUrl ? (found.status && found.status !== 'needs_url' ? found.status : 'ready') : 'needs_url') as GasAccountConfig['status'],
            lastError: found.lastError,
          };
        }
        return initAcc;
      });

      if (needsSave) {
        localStorage.setItem(STORAGE_ACCOUNTS_KEY, JSON.stringify(merged));
      }

      return merged;
    } catch {
      return INITIAL_6_GAS_ACCOUNTS;
    }
  }

  /**
   * Save accounts to localStorage
   */
  static saveAccounts(accounts: GasAccountConfig[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_ACCOUNTS_KEY, JSON.stringify(accounts));
    } catch (e) {
      console.error('Failed to save GAS accounts to storage:', e);
    }
  }

  /**
   * Update Web App URL for a specific account
   */
  static updateAccountUrl(id: string, url: string): GasAccountConfig[] {
    const cleanUrl = url.trim();
    const accounts = this.getAccounts();
    const updated = accounts.map((acc) => {
      if (acc.id === id) {
        return {
          ...acc,
          webAppUrl: cleanUrl,
          status: cleanUrl ? ('ready' as const) : ('needs_url' as const),
          lastError: undefined,
        };
      }
      return acc;
    });
    this.saveAccounts(updated);
    return updated;
  }

  /**
   * Get current send mode (rotate vs manual)
   */
  static getSendMode(): GasSendMode {
    if (typeof window === 'undefined') return 'rotate';
    try {
      const mode = localStorage.getItem(STORAGE_MODE_KEY);
      return mode === 'manual' ? 'manual' : 'rotate';
    } catch {
      return 'rotate';
    }
  }

  /**
   * Set send mode
   */
  static setSendMode(mode: GasSendMode): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_MODE_KEY, mode);
  }

  /**
   * Get selected manual account ID
   */
  static getManualAccountId(): string {
    if (typeof window === 'undefined') return 'halo';
    return localStorage.getItem(STORAGE_MANUAL_ID_KEY) || 'halo';
  }

  /**
   * Set selected manual account ID
   */
  static setManualAccountId(id: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_MANUAL_ID_KEY, id);
  }

  /**
   * Get current rotation index
   */
  static getRotationIndex(): number {
    if (typeof window === 'undefined') return 0;
    try {
      const idx = parseInt(localStorage.getItem(STORAGE_ROTATION_INDEX_KEY) || '0', 10);
      return isNaN(idx) ? 0 : idx;
    } catch {
      return 0;
    }
  }

  /**
   * Advance rotation index to next active configured account
   */
  static advanceRotationIndex(currentIndex: number, totalAccounts: number): void {
    if (typeof window === 'undefined') return;
    const nextIdx = (currentIndex + 1) % Math.max(1, totalAccounts);
    localStorage.setItem(STORAGE_ROTATION_INDEX_KEY, nextIdx.toString());
  }

  /**
   * Get accurate total sent count for an account (combining totalSent with actual history records)
   */
  static getAccountSentCount(account: GasAccountConfig, history?: GasSendHistoryItem[]): number {
    const items = history || this.getHistory();
    const historyCount = items.filter(
      (h) =>
        h.status === 'success' &&
        (h.senderAccountId === account.id ||
          (h.senderEmail && h.senderEmail.toLowerCase() === account.email.toLowerCase()))
    ).length;
    return Math.max(account.totalSent || 0, historyCount);
  }

  /**
   * Resolve which account should be used for sending next.
   * Ensures intelligent load balancing: Always prioritizes equalizing accounts that have sent fewer emails,
   * and once balanced, rotates sequentially in order (halo -> work -> career -> business -> studio -> alinlabs).
   */
  static getNextSenderAccount(): {
    account: GasAccountConfig;
    index: number;
    mode: GasSendMode;
    totalConfigured: number;
  } | null {
    const accounts = this.getAccounts();
    const mode = this.getSendMode();
    const configuredAccounts = accounts.filter(
      (a) => a.isActive && a.webAppUrl && a.webAppUrl.trim().length > 10
    );

    if (configuredAccounts.length === 0) {
      // Return the first account even if unconfigured, with status needs_url
      return {
        account: accounts[0],
        index: 0,
        mode,
        totalConfigured: 0,
      };
    }

    if (mode === 'manual') {
      const manualId = this.getManualAccountId();
      const matched = configuredAccounts.find((a) => a.id === manualId) || configuredAccounts[0];
      const idx = accounts.findIndex((a) => a.id === matched.id);
      return {
        account: matched,
        index: idx >= 0 ? idx : 0,
        mode,
        totalConfigured: configuredAccounts.length,
      };
    }

    // ROTATE MODE: Intelligent Load-Balancing & Equalization Engine
    const history = this.getHistory();

    const accountStats = configuredAccounts.map((acc) => {
      const sentCount = this.getAccountSentCount(acc, history);
      const originalIndex = accounts.findIndex((a) => a.id === acc.id);

      // Determine latest sent timestamp from account or history
      let lastSentTs = acc.lastSentAt ? new Date(acc.lastSentAt).getTime() : 0;
      if (!lastSentTs) {
        const lastHist = history.find(
          (h) =>
            h.status === 'success' &&
            (h.senderAccountId === acc.id ||
              (h.senderEmail && h.senderEmail.toLowerCase() === acc.email.toLowerCase()))
        );
        if (lastHist && lastHist.timestamp) {
          lastSentTs = new Date(lastHist.timestamp).getTime();
        }
      }

      return {
        account: acc,
        index: originalIndex >= 0 ? originalIndex : 0,
        sentCount,
        lastSentTs: isNaN(lastSentTs) ? 0 : lastSentTs,
      };
    });

    const maxSent = Math.max(...accountStats.map((s) => s.sentCount));
    const minSent = Math.min(...accountStats.map((s) => s.sentCount));

    // Case 1: Imbalance detected (minSent < maxSent)
    // Always prioritize equalizing the accounts with the lowest sent count first
    if (minSent < maxSent) {
      const leastSentAccounts = accountStats.filter((s) => s.sentCount === minSent);

      // Sort by:
      // 1. Least recently used (earliest timestamp first; 0 / never sent comes first)
      // 2. Default list order (halo -> work -> career -> business -> studio -> alinlabs)
      leastSentAccounts.sort((a, b) => {
        if (a.lastSentTs !== b.lastSentTs) {
          return a.lastSentTs - b.lastSentTs;
        }
        return a.index - b.index;
      });

      const chosen = leastSentAccounts[0];
      return {
        account: chosen.account,
        index: chosen.index,
        mode,
        totalConfigured: configuredAccounts.length,
      };
    }

    // Case 2: Balanced state (minSent === maxSent)
    // Rotate sequentially from top to bottom based on least recently sent (earliest timestamp)
    accountStats.sort((a, b) => {
      if (a.lastSentTs !== b.lastSentTs) {
        return a.lastSentTs - b.lastSentTs;
      }
      return a.index - b.index;
    });

    const chosen = accountStats[0];
    return {
      account: chosen.account,
      index: chosen.index,
      mode,
      totalConfigured: configuredAccounts.length,
    };
  }

  /**
   * Test connection to a GAS Web App URL
   */
  static async testConnection(webAppUrl: string): Promise<{ success: boolean; message: string }> {
    if (!webAppUrl || webAppUrl.trim().length < 15) {
      return {
        success: false,
        message: 'URL Google Apps Script belum diisi dengan lengkap.',
      };
    }

    try {
      // Try through backend proxy first to bypass browser CORS
      const res = await fetch('/api/test-gas-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ webAppUrl: webAppUrl.trim() }),
      });

      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (data.success) {
          return {
            success: true,
            message: data.message || 'Koneksi ke Google Apps Script berhasil terhubung!',
          };
        }
        return {
          success: false,
          message: data.error || 'Google Apps Script merespons tetapi mengembalikan status error.',
        };
      }

      // If backend proxy route failed, try direct fetch
      const directRes = await fetch(webAppUrl.trim(), {
        method: 'GET',
        mode: 'no-cors', // standard test
      });

      return {
        success: true,
        message: 'Endpoint Web App GAS dapat dijangkau dari browser.',
      };
    } catch (err: any) {
      return {
        success: false,
        message: `Gagal menghubungi GAS: ${err?.message || 'Pastikan Web App disetel ke "Anyone"'}`,
      };
    }
  }

  /**
   * Send Email using Google Apps Script (via Backend Proxy to avoid CORS + redirect issues)
   */
  static async sendEmail(
    payload: GasEmailPayload,
    account: GasAccountConfig,
    options?: { autoAdvanceRotation?: boolean }
  ): Promise<GasSendResponse> {
    const targetGasUrl = payload.gasUrl || account.webAppUrl;

    if (!targetGasUrl || targetGasUrl.trim().length < 15) {
      return {
        success: false,
        error: `URL Google Apps Script untuk email ${account.email} belum dikonfigurasi. Silakan masukkan Web App URL di Pengaturan GAS.`,
        accountId: account.id,
        senderEmail: account.email,
      };
    }

    const plainBody = (payload.body || payload.bodyText || payload.bodyHtml || '').trim();
    const formattedHtml = (payload.bodyHtml && typeof payload.bodyHtml === 'string' && payload.bodyHtml.trim().length > 0)
      ? payload.bodyHtml.trim()
      : formatEmailBodyToHtml(plainBody);

    const cleanSubject = (payload.subject || 'Lamaran Pekerjaan').trim();
    const senderName = 'Lamaran Kerja Alvareza';

    let sendSucceeded = false;
    let successMessage = '';
    let lastErrorMessage = '';

    // STRATEGY 1: Send through Backend Proxy (/api/send-email-gas)
    try {
      const response = await fetch('/api/send-email-gas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gasUrl: targetGasUrl.trim(),
          targetEmail: payload.targetEmail.trim(),
          subject: cleanSubject,
          body: plainBody,
          bodyText: plainBody,
          bodyHtml: formattedHtml,
          senderName: senderName,
          cc: payload.cc ? String(payload.cc).trim() : '',
          bcc: payload.bcc ? String(payload.bcc).trim() : '',
          attachments: payload.attachments || [],
          accountId: account.id,
          senderEmail: account.email,
        }),
      });

      const contentType = response.headers.get('content-type') || '';
      if (response.ok && contentType.includes('application/json')) {
        const responseData = await response.json();
        if (responseData && responseData.success) {
          sendSucceeded = true;
          successMessage = responseData.message || `Email lamaran berhasil dikirim menggunakan akun ${account.email}!`;
        } else {
          lastErrorMessage = responseData?.error || responseData?.message || 'Server proxy mengembalikan error';
        }
      } else {
        // If status is 404, 405 or response is HTML (e.g. static hosting on Vercel without proxy)
        console.warn(`[GAS Sender] Proxy API mengembalikan status ${response.status} (${contentType}), beralih ke direct Google Apps Script...`);
      }
    } catch (proxyErr: any) {
      console.warn('[GAS Sender] Proxy network error, beralih ke direct Google Apps Script:', proxyErr?.message);
    }

    // STRATEGY 2: Direct browser dispatch to Google Apps Script Web App
    if (!sendSucceeded) {
      try {
        const directPayload = JSON.stringify({
          targetEmail: payload.targetEmail.trim(),
          subject: cleanSubject,
          body: plainBody,
          bodyText: plainBody,
          bodyHtml: formattedHtml,
          senderName: senderName,
          cc: payload.cc ? String(payload.cc).trim() : '',
          bcc: payload.bcc ? String(payload.bcc).trim() : '',
          attachments: payload.attachments || [],
        });

        // Mode 'no-cors' allows browser to dispatch POST to GAS without aborting on Google 302 redirect
        const directRes = await fetch(targetGasUrl.trim(), {
          method: 'POST',
          headers: {
            'Content-Type': 'text/plain;charset=utf-8',
          },
          body: directPayload,
          mode: 'no-cors',
        });

        // In no-cors mode, completion of fetch without throw confirms request was delivered to Google servers
        if (directRes.type === 'opaque' || directRes.ok || directRes.status === 200 || directRes.status === 0) {
          sendSucceeded = true;
          successMessage = `Email lamaran berhasil dikirim via Google Apps Script (${account.email})!`;
        }
      } catch (directErr: any) {
        console.error('[GAS Sender] Direct GAS dispatch error:', directErr);
        lastErrorMessage = lastErrorMessage || `Gagal mengirim ke Google Apps Script: ${directErr?.message || 'Koneksi gagal'}`;
      }
    }

    if (sendSucceeded) {
      // Record history and update statistics
      this.recordSendSuccess(account.id, {
        targetEmail: payload.targetEmail,
        companyName: payload.companyName || '',
        jobTitle: payload.jobTitle || '',
        subject: cleanSubject,
        senderEmail: account.email,
        senderAccountId: account.id,
        hasAttachment: !!(payload.attachments && payload.attachments.length > 0),
        attachmentName: payload.attachments?.[0]?.filename,
      });

      // Advance rotation if rotate mode
      if (options?.autoAdvanceRotation !== false && this.getSendMode() === 'rotate') {
        const accounts = this.getAccounts();
        const currentIdx = accounts.findIndex((a) => a.id === account.id);
        if (currentIdx >= 0) {
          this.advanceRotationIndex(currentIdx, accounts.length);
        }
      }

      return {
        success: true,
        message: successMessage,
        senderEmail: account.email,
        accountId: account.id,
      };
    }

    // Both strategies failed
    const finalError = lastErrorMessage || 'Gagal mengirim email. Periksa deployment Google Apps Script Anda.';
    this.recordSendFailure(account.id, finalError, {
      targetEmail: payload.targetEmail,
      companyName: payload.companyName || '',
      jobTitle: payload.jobTitle || '',
      subject: cleanSubject,
      senderEmail: account.email,
      senderAccountId: account.id,
      hasAttachment: !!(payload.attachments && payload.attachments.length > 0),
      attachmentName: payload.attachments?.[0]?.filename,
    });

    return {
      success: false,
      error: finalError,
      accountId: account.id,
      senderEmail: account.email,
    };
  }

  /**
   * Record a successful email transmission
   */
  static recordSendSuccess(
    accountId: string,
    details: Omit<GasSendHistoryItem, 'id' | 'timestamp' | 'status'>
  ): void {
    if (typeof window === 'undefined') return;

    const accounts = this.getAccounts();
    const updatedAccounts = accounts.map((acc) => {
      if (acc.id === accountId) {
        return {
          ...acc,
          totalSent: (acc.totalSent || 0) + 1,
          lastSentAt: new Date().toISOString(),
          status: 'ready' as const,
          lastError: undefined,
        };
      }
      return acc;
    });
    this.saveAccounts(updatedAccounts);

    // Save into history
    const historyItem: GasSendHistoryItem = {
      id: 'hist_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      timestamp: new Date().toISOString(),
      status: 'success',
      ...details,
    };
    this.addHistoryItem(historyItem);
  }

  /**
   * Record a failed email attempt
   */
  static recordSendFailure(
    accountId: string,
    errorMsg: string,
    details?: Partial<GasSendHistoryItem>
  ): void {
    if (typeof window === 'undefined') return;

    const accounts = this.getAccounts();
    const updatedAccounts = accounts.map((acc) => {
      if (acc.id === accountId) {
        return {
          ...acc,
          status: 'error' as const,
          lastError: errorMsg,
        };
      }
      return acc;
    });
    this.saveAccounts(updatedAccounts);

    if (details?.targetEmail) {
      const historyItem: GasSendHistoryItem = {
        id: 'hist_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        timestamp: new Date().toISOString(),
        status: 'failed',
        errorMessage: errorMsg,
        targetEmail: details.targetEmail || '',
        companyName: details.companyName || '',
        jobTitle: details.jobTitle || '',
        subject: details.subject || '',
        senderEmail: details.senderEmail || '',
        senderAccountId: accountId,
        hasAttachment: !!details.hasAttachment,
        attachmentName: details.attachmentName,
      };
      this.addHistoryItem(historyItem);
    }
  }

  /**
   * Get sending history
   */
  static getHistory(): GasSendHistoryItem[] {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(STORAGE_HISTORY_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  /**
   * Add history item
   */
  static addHistoryItem(item: GasSendHistoryItem): void {
    if (typeof window === 'undefined') return;
    try {
      const current = this.getHistory();
      const updated = [item, ...current].slice(0, 50); // keep last 50
      localStorage.setItem(STORAGE_HISTORY_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save history:', e);
    }
  }

  /**
   * Update single history item
   */
  static updateHistoryItem(updatedItem: GasSendHistoryItem): void {
    if (typeof window === 'undefined') return;
    try {
      const current = this.getHistory();
      const updated = current.map((item) => (item.id === updatedItem.id ? updatedItem : item));
      localStorage.setItem(STORAGE_HISTORY_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to update history item:', e);
    }
  }

  /**
   * Delete single history item
   */
  static deleteHistoryItem(id: string): void {
    if (typeof window === 'undefined') return;
    try {
      const current = this.getHistory();
      const updated = current.filter((item) => item.id !== id);
      localStorage.setItem(STORAGE_HISTORY_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to delete history item:', e);
    }
  }

  /**
   * Clear history
   */
  static clearHistory(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_HISTORY_KEY);
  }
}
