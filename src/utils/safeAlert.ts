/**
 * Non-blocking Safe Alert & Toast System
 *
 * Designed to eliminate window.alert() crashes in sandboxed iframes (e.g., AI Studio Preview,
 * embedded webviews) while providing a responsive, elegant toast notification.
 */

export type ToastType = 'info' | 'error' | 'success' | 'warning';

let toastContainer: HTMLDivElement | null = null;

function getOrCreateToastContainer(): HTMLDivElement | null {
  if (typeof document === 'undefined') return null;

  if (toastContainer && document.body.contains(toastContainer)) {
    return toastContainer;
  }

  const existing = document.getElementById('mycivy-toast-container') as HTMLDivElement | null;
  if (existing) {
    toastContainer = existing;
    return existing;
  }

  const container = document.createElement('div');
  container.id = 'mycivy-toast-container';
  container.setAttribute('aria-live', 'polite');
  container.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 99999;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    pointer-events: none;
    max-width: 90vw;
    width: max-content;
  `;

  document.body.appendChild(container);
  toastContainer = container;
  return container;
}

export function showToastBanner(message: string, type: ToastType = 'info', durationMs: number = 3800): void {
  if (typeof document === 'undefined') return;

  const container = getOrCreateToastContainer();
  if (!container) return;

  const toast = document.createElement('div');
  toast.setAttribute('role', 'alert');

  const bgColors: Record<ToastType, string> = {
    error: '#fef2f2',
    warning: '#fffbeb',
    success: '#f0fdf4',
    info: '#eff6ff',
  };

  const textColors: Record<ToastType, string> = {
    error: '#991b1b',
    warning: '#92400e',
    success: '#166534',
    info: '#1e40af',
  };

  const borderColors: Record<ToastType, string> = {
    error: '#fecaca',
    warning: '#fde68a',
    success: '#bbf7d0',
    info: '#bfdbfe',
  };

  const icons: Record<ToastType, string> = {
    error: '⚠️',
    warning: '⚡',
    success: '✅',
    info: 'ℹ️',
  };

  toast.style.cssText = `
    background-color: ${bgColors[type]};
    color: ${textColors[type]};
    border: 1px solid ${borderColors[type]};
    padding: 10px 18px;
    border-radius: 12px;
    font-size: 13px;
    font-weight: 500;
    font-family: inherit;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.12), 0 8px 10px -6px rgba(0, 0, 0, 0.08);
    display: flex;
    align-items: center;
    gap: 8px;
    pointer-events: auto;
    max-width: 540px;
    line-height: 1.45;
    opacity: 0;
    transform: translateY(-8px) scale(0.96);
    transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
  `;

  toast.innerHTML = `<span style="font-size: 15px; flex-shrink: 0;">${icons[type]}</span><span>${message}</span>`;
  container.appendChild(toast);

  // Animate in
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0) scale(1)';
  });

  // Auto remove
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-6px) scale(0.96)';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 250);
  }, durationMs);
}

/**
 * Universal safe alert replacement:
 * Completely avoids blocking window.alert() in iframe sandboxes,
 * preventing DOMException / SecurityError crashes.
 */
export function safeAlert(message: string, type: ToastType = 'warning'): void {
  if (typeof window === 'undefined') return;

  // Try creating a visual toast banner first
  try {
    showToastBanner(message, type);
  } catch {
    // If DOM is somehow not ready or restricted, fallback to console
    console.warn(`[SafeAlert - ${type.toUpperCase()}]:`, message);
  }
}
