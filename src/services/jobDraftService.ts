import { JobApplicationDraftItem } from '../types/jobDraft';

const STORAGE_DRAFTS_KEY = 'mycivy_job_application_drafts_v1';
const STORAGE_BULK_DELAY_KEY = 'mycivy_bulk_delay_seconds_v1';

export class JobDraftService {
  /**
   * Get all drafts sorted by creation date descending
   */
  static getDrafts(): JobApplicationDraftItem[] {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(STORAGE_DRAFTS_KEY);
      if (!stored) return [];
      const parsed: JobApplicationDraftItem[] = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  /**
   * Save or update a draft
   */
  static saveDraft(
    data: Omit<JobApplicationDraftItem, 'id' | 'createdAt' | 'updatedAt' | 'status'> & {
      id?: string;
      status?: JobApplicationDraftItem['status'];
    }
  ): JobApplicationDraftItem {
    const drafts = this.getDrafts();
    const now = new Date().toISOString();

    if (data.id) {
      const existingIndex = drafts.findIndex((d) => d.id === data.id);
      if (existingIndex >= 0) {
        const updated: JobApplicationDraftItem = {
          ...drafts[existingIndex],
          ...data,
          id: data.id,
          updatedAt: now,
          status: data.status || drafts[existingIndex].status || 'draft',
        };
        drafts[existingIndex] = updated;
        this.writeDrafts(drafts);
        return updated;
      }
    }

    const newDraft: JobApplicationDraftItem = {
      ...data,
      id: data.id || `draft_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: now,
      updatedAt: now,
      status: data.status || 'draft',
    };

    drafts.unshift(newDraft);
    this.writeDrafts(drafts);
    return newDraft;
  }

  /**
   * Update specific fields of a draft
   */
  static updateDraft(id: string, updates: Partial<JobApplicationDraftItem>): void {
    const drafts = this.getDrafts();
    const index = drafts.findIndex((d) => d.id === id);
    if (index >= 0) {
      drafts[index] = {
        ...drafts[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      this.writeDrafts(drafts);
    }
  }

  /**
   * Delete a draft by ID
   */
  static deleteDraft(id: string): void {
    const drafts = this.getDrafts();
    const filtered = drafts.filter((d) => d.id !== id);
    this.writeDrafts(filtered);
  }

  /**
   * Clear all drafts
   */
  static clearDrafts(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(STORAGE_DRAFTS_KEY);
    } catch (e) {
      console.error('Failed to clear drafts:', e);
    }
  }

  /**
   * Get draft count
   */
  static getDraftCount(): number {
    return this.getDrafts().length;
  }

  /**
   * Get configured bulk delay in seconds (default 8s)
   */
  static getBulkDelaySeconds(): number {
    if (typeof window === 'undefined') return 8;
    try {
      const stored = localStorage.getItem(STORAGE_BULK_DELAY_KEY);
      if (!stored) return 8;
      const num = parseInt(stored, 10);
      return isNaN(num) || num < 3 ? 8 : num;
    } catch {
      return 8;
    }
  }

  /**
   * Save configured bulk delay in seconds
   */
  static setBulkDelaySeconds(seconds: number): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_BULK_DELAY_KEY, seconds.toString());
    } catch (e) {
      console.error('Failed to set bulk delay:', e);
    }
  }

  private static writeDrafts(drafts: JobApplicationDraftItem[]): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_DRAFTS_KEY, JSON.stringify(drafts));
    } catch (e) {
      console.error('Failed to write drafts to storage:', e);
    }
  }
}
