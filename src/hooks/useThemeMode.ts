import { useState, useEffect, useCallback } from 'react';

export type ThemeMode = 'dark' | 'light';

/**
 * Resolves initial theme mode from URL query parameters (mode=dark/light)
 * with fallback to localStorage (digitalprofile_theme_preference).
 */
export function getInitialThemeMode(): ThemeMode {
  if (typeof window === 'undefined') return 'light';

  try {
    const params = new URLSearchParams(window.location.search);
    const rawMode = (
      params.get('mode') ||
      params.get('theme') ||
      params.get('th') ||
      params.get('ui') ||
      ''
    ).toLowerCase().trim();

    if (rawMode === 'dark' || rawMode === 'night' || rawMode === 'gelap') {
      return 'dark';
    }
    if (rawMode === 'light' || rawMode === 'terang' || rawMode === 'white') {
      return 'light';
    }

    const saved = localStorage.getItem('digitalprofile_theme_preference');
    if (saved === 'dark' || saved === 'light') {
      return saved;
    }
  } catch {}

  return 'light';
}

/**
 * Synchronizes document.documentElement with the 'dark' CSS class
 */
export function syncDocumentTheme(mode: ThemeMode): void {
  if (typeof document === 'undefined') return;
  if (mode === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

/**
 * Updates URL search params to include &mode=dark or &mode=light
 */
export function updateUrlThemeParam(mode: ThemeMode): void {
  if (typeof window === 'undefined') return;
  try {
    const url = new URL(window.location.href);
    url.searchParams.set('mode', mode);
    url.searchParams.delete('theme');
    url.searchParams.delete('th');
    url.searchParams.delete('ui');
    window.history.replaceState(null, '', url.toString());
  } catch {}
}

/**
 * Unified Theme Mode Hook for Executive, Admin, and Preview pages.
 * Handles mode=dark / mode=light query parameter synchronization.
 */
export function useThemeMode() {
  const [mode, setModeState] = useState<ThemeMode>(getInitialThemeMode);
  const isDarkMode = mode === 'dark';

  const setMode = useCallback((newMode: ThemeMode, updateUrl: boolean = true) => {
    setModeState(newMode);
    try {
      localStorage.setItem('digitalprofile_theme_preference', newMode);
    } catch {}
    syncDocumentTheme(newMode);
    if (updateUrl) {
      updateUrlThemeParam(newMode);
    }
    window.dispatchEvent(
      new CustomEvent('digitalprofile_theme_change', { detail: { mode: newMode } })
    );
  }, []);

  const toggleTheme = useCallback(() => {
    const next = mode === 'dark' ? 'light' : 'dark';
    setMode(next);
  }, [mode, setMode]);

  // Sync on mount and subscribe to changes across components
  useEffect(() => {
    syncDocumentTheme(mode);

    const handleThemeChange = (e: Event) => {
      const customEvt = e as CustomEvent;
      if (
        customEvt.detail?.mode &&
        (customEvt.detail.mode === 'dark' || customEvt.detail.mode === 'light')
      ) {
        setModeState(customEvt.detail.mode);
        syncDocumentTheme(customEvt.detail.mode);
      }
    };

    const handlePopState = () => {
      const current = getInitialThemeMode();
      setModeState(current);
      syncDocumentTheme(current);
    };

    window.addEventListener('digitalprofile_theme_change', handleThemeChange);
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('digitalprofile_theme_change', handleThemeChange);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [mode]);

  return {
    mode,
    isDarkMode,
    setMode,
    toggleTheme,
  };
}
