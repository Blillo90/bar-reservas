'use client';

import { useState, useEffect, useCallback } from 'react';

type Theme = 'light' | 'dark';
const KEY = 'bar-theme';

/**
 * Manages light/dark theme with:
 * - System preference detection on first visit
 * - localStorage persistence
 * - No flash: the layout.tsx inline script already sets the class;
 *   this hook just syncs React state to the DOM state.
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>('dark'); // safe SSR default

  useEffect(() => {
    // Read the class that the inline script already applied
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');
  }, []);

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === 'dark' ? 'light' : 'dark';
      document.documentElement.classList.toggle('dark', next === 'dark');
      try { localStorage.setItem(KEY, next); } catch { /* ignore */ }
      return next;
    });
  }, []);

  return { theme, toggle, isDark: theme === 'dark' };
}
