/**
 * Storage Manager
 * Provides localStorage abstraction with namespacing and validation
 */

const STORAGE_PREFIX = 'eagle-react-template:';

export interface StorageOptions<T> {
  key: string;
  defaultValue: T;
  validate?: (value: unknown) => value is T;
}

/**
 * Get item from localStorage with type safety
 */
export function getStorageItem<T>(options: StorageOptions<T>): T {
  const { key, defaultValue, validate } = options;
  const fullKey = `${STORAGE_PREFIX}${key}`;

  try {
    const stored = localStorage.getItem(fullKey);
    if (stored === null) {
      return defaultValue;
    }

    const parsed = JSON.parse(stored);

    if (validate && !validate(parsed)) {
      console.warn(`[Storage] Invalid value for key "${key}", using default`);
      return defaultValue;
    }

    return parsed as T;
  } catch (error) {
    console.error(`[Storage] Error reading key "${key}":`, error);
    return defaultValue;
  }
}

/**
 * Set item in localStorage
 */
export function setStorageItem<T>(key: string, value: T): boolean {
  const fullKey = `${STORAGE_PREFIX}${key}`;

  try {
    localStorage.setItem(fullKey, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`[Storage] Error writing key "${key}":`, error);
    return false;
  }
}

/**
 * Remove item from localStorage
 */
export function removeStorageItem(key: string): boolean {
  const fullKey = `${STORAGE_PREFIX}${key}`;

  try {
    localStorage.removeItem(fullKey);
    return true;
  } catch (error) {
    console.error(`[Storage] Error removing key "${key}":`, error);
    return false;
  }
}

/**
 * Clear all plugin storage items
 */
export function clearStorage(): void {
  const keysToRemove: string[] = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(STORAGE_PREFIX)) {
      keysToRemove.push(key);
    }
  }

  keysToRemove.forEach((key) => localStorage.removeItem(key));
}

/**
 * Debug utility to view all stored items
 */
export function debugStorage(): Record<string, unknown> {
  const items: Record<string, unknown> = {};

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(STORAGE_PREFIX)) {
      const shortKey = key.replace(STORAGE_PREFIX, '');
      try {
        items[shortKey] = JSON.parse(localStorage.getItem(key) || 'null');
      } catch {
        items[shortKey] = localStorage.getItem(key);
      }
    }
  }

  return items;
}

// ============================================================================
// Pre-defined Storage Keys
// ============================================================================

export const StorageKeys = {
  THEME: 'theme',
  LOCALE: 'locale',
  SETTINGS: 'settings',
  RECENT_ITEMS: 'recentItems',
} as const;

// ============================================================================
// Type-safe Storage Hooks Helpers
// ============================================================================

export type Theme = 'light' | 'dark' | 'auto';

export function loadTheme(): Theme {
  return getStorageItem({
    key: StorageKeys.THEME,
    defaultValue: 'auto' as Theme,
    validate: (v): v is Theme => v === 'light' || v === 'dark' || v === 'auto',
  });
}

export function saveTheme(theme: Theme): void {
  setStorageItem(StorageKeys.THEME, theme);
}

export interface AppSettings {
  alwaysOnTop: boolean;
  autoPreview: boolean;
  previewDelay: number;
}

const defaultSettings: AppSettings = {
  alwaysOnTop: false,
  autoPreview: true,
  previewDelay: 300,
};

export function loadSettings(): AppSettings {
  return getStorageItem({
    key: StorageKeys.SETTINGS,
    defaultValue: defaultSettings,
  });
}

export function saveSettings(settings: Partial<AppSettings>): void {
  const current = loadSettings();
  setStorageItem(StorageKeys.SETTINGS, { ...current, ...settings });
}
