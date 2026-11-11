import { useEffect } from 'react';

/**
 * Global Scroll Lock Manager
 * Thread-safe reference-counting lock for modal backdrops.
 * Prevents scroll leaks, layout jumps, and stuck 'overflow: hidden' bugs.
 */

const activeLocks = new Set<string>();

export function acquireScrollLock(key: string = 'default'): () => void {
  if (typeof document === 'undefined') return () => {};

  activeLocks.add(key);
  applyScrollLock();

  let released = false;
  return () => {
    if (released) return;
    released = true;
    releaseScrollLock(key);
  };
}

export function releaseScrollLock(key: string = 'default'): void {
  if (typeof document === 'undefined') return;

  activeLocks.delete(key);
  if (activeLocks.size === 0) {
    clearScrollLock();
  }
}

export function forceUnlockScroll(): void {
  if (typeof document === 'undefined') return;
  activeLocks.clear();
  clearScrollLock();
}

function applyScrollLock(): void {
  if (typeof document === 'undefined') return;

  const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
  document.body.style.overflow = 'hidden';
  document.documentElement.style.overflow = 'hidden';
  if (scrollBarWidth > 0) {
    document.body.style.paddingRight = `${scrollBarWidth}px`;
  }
}

function clearScrollLock(): void {
  if (typeof document === 'undefined') return;

  document.body.style.overflow = '';
  document.documentElement.style.overflow = '';
  document.body.style.paddingRight = '';
}

/**
 * React hook to automatically acquire and release scroll lock based on modal open state
 */
export function useScrollLock(isOpen: boolean, key?: string): void {
  useEffect(() => {
    if (!isOpen) {
      // In case key was held, release it immediately
      if (key) releaseScrollLock(key);
      return;
    }

    const lockKey = key || `lock-${Math.random().toString(36).substring(2, 9)}`;
    const release = acquireScrollLock(lockKey);

    return () => {
      release();
    };
  }, [isOpen, key]);
}
