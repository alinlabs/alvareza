import { JobDraftService } from './jobDraftService';
import { GasSenderService } from './gasSenderService';

const STORAGE_DISMISS_KEY = 'digitalprofile_cache_rec_dismissed_v1';

export const RECOMMENDED_LIMITS = {
  MAX_DRAFTS: 15,
  MAX_HISTORY: 25,
  MAX_TOTAL_BYTES: 350 * 1024, // 350 KB
};

export interface CacheRecommendationStatus {
  draftsCount: number;
  draftsSizeBytes: number;
  historyCount: number;
  historySizeBytes: number;
  totalSizeBytes: number;
  formattedTotalSize: string;
  isOverDraftLimit: boolean;
  isOverHistoryLimit: boolean;
  isOverSizeLimit: boolean;
  shouldRecommend: boolean;
  reasonText: string;
}

export class CacheRecommendationService {
  /**
   * Format bytes to human readable string (KB / MB)
   */
  static formatBytes(bytes: number): string {
    if (bytes <= 0) return '0 B';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  /**
   * Check if recommendation has been dismissed in current session
   */
  static isDismissed(): boolean {
    if (typeof window === 'undefined') return false;
    try {
      return sessionStorage.getItem(STORAGE_DISMISS_KEY) === 'true';
    } catch {
      return false;
    }
  }

  /**
   * Dismiss recommendation for current browser session
   */
  static dismiss(): void {
    if (typeof window === 'undefined') return;
    try {
      sessionStorage.setItem(STORAGE_DISMISS_KEY, 'true');
    } catch {
      // ignore
    }
  }

  /**
   * Reset dismissal state
   */
  static resetDismissal(): void {
    if (typeof window === 'undefined') return;
    try {
      sessionStorage.removeItem(STORAGE_DISMISS_KEY);
    } catch {
      // ignore
    }
  }

  /**
   * Get complete status and recommendation logic
   */
  static getStatus(): CacheRecommendationStatus {
    const draftsCount = JobDraftService.getDraftCount();
    const draftsSizeBytes = JobDraftService.getDraftsSizeInBytes();
    const historyCount = GasSenderService.getHistory().length;
    const historySizeBytes = GasSenderService.getHistorySizeInBytes();
    const totalSizeBytes = draftsSizeBytes + historySizeBytes;

    const isOverDraftLimit = draftsCount >= RECOMMENDED_LIMITS.MAX_DRAFTS;
    const isOverHistoryLimit = historyCount >= RECOMMENDED_LIMITS.MAX_HISTORY;
    const isOverSizeLimit = totalSizeBytes >= RECOMMENDED_LIMITS.MAX_TOTAL_BYTES;

    const shouldRecommend = (isOverDraftLimit || isOverHistoryLimit || isOverSizeLimit) && !this.isDismissed();

    let reasonText = '';
    if (isOverDraftLimit && isOverHistoryLimit) {
      reasonText = `Jumlah draf (${draftsCount}) dan riwayat (${historyCount}) telah melampaui batas rekomendasi kinerja optimal.`;
    } else if (isOverDraftLimit) {
      reasonText = `Anda memiliki ${draftsCount} draf tersimpan (batas rekomendasi ${RECOMMENDED_LIMITS.MAX_DRAFTS} draf).`;
    } else if (isOverHistoryLimit) {
      reasonText = `Anda memiliki ${historyCount} riwayat pengiriman tersimpan (batas rekomendasi ${RECOMMENDED_LIMITS.MAX_HISTORY} entri).`;
    } else if (isOverSizeLimit) {
      reasonText = `Ukuran penyimpanan lokal mencapai ${this.formatBytes(totalSizeBytes)}.`;
    }

    return {
      draftsCount,
      draftsSizeBytes,
      historyCount,
      historySizeBytes,
      totalSizeBytes,
      formattedTotalSize: this.formatBytes(totalSizeBytes),
      isOverDraftLimit,
      isOverHistoryLimit,
      isOverSizeLimit,
      shouldRecommend,
      reasonText,
    };
  }

  /**
   * Clear only drafts cache
   */
  static clearDrafts(): void {
    JobDraftService.clearDrafts();
  }

  /**
   * Clear only history cache
   */
  static clearHistory(): void {
    GasSenderService.clearHistory();
  }

  /**
   * Clear both drafts and history cache
   */
  static clearAll(): void {
    JobDraftService.clearDrafts();
    GasSenderService.clearHistory();
    this.dismiss();
  }
}
