import { useState, useEffect, useCallback } from 'react';
import { eagleApi } from '@/lib/eagle-api';
import { loadTheme, saveTheme, type Theme } from '@/lib/storage';
import type { EagleTheme } from '@/types/eagle';

interface UseThemeReturn {
  /** Current theme */
  theme: Theme;
  /** Computed dark mode state */
  isDarkMode: boolean;
  /** Set theme */
  setTheme: (theme: Theme) => void;
  /** Toggle between light and dark */
  toggleTheme: () => void;
  /** Cycle through light → dark → auto */
  cycleTheme: () => void;
}

/**
 * Theme mapping from Eagle themes to dark mode
 */
const DARK_THEMES: EagleTheme[] = ['DARK', 'GRAY', 'BLUE', 'PURPLE'];

/**
 * Hook to manage theme with Eagle integration
 *
 * Note: For shared state across components, use the Zustand store directly:
 * import { useSettings } from '@/stores';
 */
export function useTheme(): UseThemeReturn {
  const [theme, setThemeState] = useState<Theme>(() => loadTheme());
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => computeIsDark(loadTheme()));

  // Compute dark mode based on theme and system preference
  function computeIsDark(t: Theme): boolean {
    if (t === 'auto') {
      // Check Eagle theme first
      const eagleTheme = eagleApi.theme;
      if (eagleTheme === 'Auto') {
        return eagleApi.isDarkMode;
      }
      return DARK_THEMES.includes(eagleTheme);
    }
    return t === 'dark';
  }

  // Apply theme to document
  const applyTheme = useCallback((dark: boolean) => {
    const html = document.documentElement;
    if (dark) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, []);

  // Set theme and persist
  const setTheme = useCallback(
    (newTheme: Theme) => {
      setThemeState(newTheme);
      saveTheme(newTheme);
      const dark = computeIsDark(newTheme);
      setIsDarkMode(dark);
      applyTheme(dark);
    },
    [applyTheme]
  );

  // Toggle between light and dark
  const toggleTheme = useCallback(() => {
    setTheme(isDarkMode ? 'light' : 'dark');
  }, [isDarkMode, setTheme]);

  // Cycle through light → dark → auto
  const cycleTheme = useCallback(() => {
    const themes = ['light', 'dark', 'auto'] as const;
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  }, [theme, setTheme]);

  // Initialize theme on mount
  useEffect(() => {
    const dark = computeIsDark(theme);
    setIsDarkMode(dark);
    applyTheme(dark);

    // Listen for Eagle theme changes
    eagleApi.onThemeChanged((newEagleTheme) => {
      if (theme === 'auto') {
        const dark =
          DARK_THEMES.includes(newEagleTheme) || (newEagleTheme === 'Auto' && eagleApi.isDarkMode);
        setIsDarkMode(dark);
        applyTheme(dark);
      }
    });

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = () => {
      if (theme === 'auto' && !eagleApi.isMock) {
        // Only respond to system changes if not in Eagle
        return;
      }
      if (theme === 'auto') {
        const dark = mediaQuery.matches;
        setIsDarkMode(dark);
        applyTheme(dark);
      }
    };

    mediaQuery.addEventListener('change', handleSystemChange);
    return () => {
      mediaQuery.removeEventListener('change', handleSystemChange);
    };
  }, [theme, applyTheme]);

  return {
    theme,
    isDarkMode,
    setTheme,
    toggleTheme,
    cycleTheme,
  };
}

export default useTheme;
