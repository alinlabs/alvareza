/**
 * Safe Alert Helper for IFrame and Sandboxed Environments
 * Prevents DOMException "Blocked alert() inside an iframe with sandbox attribute"
 */

export function safeAlert(message: string): void {
  if (typeof window === 'undefined') return;

  try {
    const isSandboxedIframe = window.self !== window.top;
    if (isSandboxedIframe) {
      console.warn('[Application Notice (Iframe Safe)]:', message);
      // Dispatch a custom event for any UI notification listener if registered
      window.dispatchEvent(
        new CustomEvent('app:notice', { detail: { message, timestamp: Date.now() } })
      );
    } else if (typeof window.alert === 'function') {
      window.alert(message);
    } else {
      console.warn('[Application Notice]:', message);
    }
  } catch {
    console.warn('[Application Notice Fallback]:', message);
  }
}
