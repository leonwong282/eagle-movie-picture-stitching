/**
 * Settings Slice
 *
 * Manages user preferences with localStorage persistence.
 * Handles theme integration with Eagle's theme system.
 */

import type { StateCreator } from 'zustand';
import type { PluginStore, SettingsSlice, Theme, OutputFormat } from '../types';
import type { EagleTheme } from '@/types/eagle';
import { eagleApi } from '@/lib/eagle-api';

/**
 * Theme mapping from Eagle themes to dark mode
 */
const DARK_THEMES: EagleTheme[] = ['DARK', 'GRAY', 'BLUE', 'PURPLE'];

/**
 * Compute isDarkMode based on theme setting
 */
function computeIsDark(theme: Theme): boolean {
  if (theme === 'auto') {
    // Check Eagle theme first
    const eagleTheme = eagleApi.theme;
    if (eagleTheme === 'Auto') {
      return eagleApi.isDarkMode;
    }
    return DARK_THEMES.includes(eagleTheme);
  }
  return theme === 'dark';
}

/**
 * Apply dark mode to document
 */
function applyDarkMode(isDark: boolean): void {
  const html = document.documentElement;
  if (isDark) {
    html.classList.add('dark');
  } else {
    html.classList.remove('dark');
  }
}

/**
 * Initial state for settings slice
 */
export const initialSettingsState = {
  theme: 'auto' as Theme,
  isDarkMode: false,
  autoPreview: true,
  outputFormat: 'original' as OutputFormat,
  quality: 90,
  preserveMetadata: true,
  custom: {},
};

/**
 * Create settings slice
 */
export const createSettingsSlice: StateCreator<PluginStore, [], [], { settings: SettingsSlice }> = (
  set,
  get
) => ({
  settings: {
    ...initialSettingsState,
    // Compute initial dark mode
    isDarkMode: computeIsDark(initialSettingsState.theme),

    setTheme: (theme) => {
      const isDarkMode = computeIsDark(theme);
      applyDarkMode(isDarkMode);

      set((state) => ({
        settings: {
          ...state.settings,
          theme,
          isDarkMode,
        },
      }));
    },

    toggleTheme: () => {
      const { settings } = get();
      const newTheme: Theme = settings.isDarkMode ? 'light' : 'dark';
      settings.setTheme(newTheme);
    },

    setAutoPreview: (enabled) => {
      set((state) => ({
        settings: {
          ...state.settings,
          autoPreview: enabled,
        },
      }));
    },

    setOutputFormat: (format) => {
      set((state) => ({
        settings: {
          ...state.settings,
          outputFormat: format,
        },
      }));
    },

    setQuality: (quality) => {
      // Clamp to valid range
      const clamped = Math.max(0, Math.min(100, quality));
      set((state) => ({
        settings: {
          ...state.settings,
          quality: clamped,
        },
      }));
    },

    setPreserveMetadata: (preserve) => {
      set((state) => ({
        settings: {
          ...state.settings,
          preserveMetadata: preserve,
        },
      }));
    },

    setCustom: <T>(key: string, value: T) => {
      set((state) => ({
        settings: {
          ...state.settings,
          custom: {
            ...state.settings.custom,
            [key]: value,
          },
        },
      }));
    },

    getCustom: <T>(key: string, defaultValue: T): T => {
      const { settings } = get();
      return (settings.custom[key] as T) ?? defaultValue;
    },

    resetSettings: () => {
      const isDarkMode = computeIsDark(initialSettingsState.theme);
      applyDarkMode(isDarkMode);

      set((state) => ({
        settings: {
          ...state.settings,
          ...initialSettingsState,
          isDarkMode,
        },
      }));
    },
  },
});

/**
 * Initialize theme from Eagle
 * Call this after store creation to sync with Eagle's theme
 */
export function initializeTheme(store: { getState: () => PluginStore }): void {
  const { settings } = store.getState();
  const isDark = computeIsDark(settings.theme);
  applyDarkMode(isDark);

  // Listen for Eagle theme changes
  eagleApi.onThemeChanged((newEagleTheme) => {
    const { settings: currentSettings } = store.getState();
    if (currentSettings.theme === 'auto') {
      const isDarkMode =
        DARK_THEMES.includes(newEagleTheme) || (newEagleTheme === 'Auto' && eagleApi.isDarkMode);
      applyDarkMode(isDarkMode);
      // Update store
      store.getState().settings.setTheme('auto');
    }
  });

  // Listen for system theme changes (for mock mode)
  if (typeof window !== 'undefined') {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', () => {
      const { settings: currentSettings } = store.getState();
      if (currentSettings.theme === 'auto' && eagleApi.isMock) {
        const isDarkMode = mediaQuery.matches;
        applyDarkMode(isDarkMode);
        store.getState().settings.setTheme('auto');
      }
    });
  }
}
