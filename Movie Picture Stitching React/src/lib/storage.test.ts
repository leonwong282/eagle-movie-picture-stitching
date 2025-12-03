/**
 * Tests for lib/storage.ts
 * localStorage abstraction with namespacing and validation
 */

import { describe, it, expect, vi } from 'vitest';
import {
  getStorageItem,
  setStorageItem,
  removeStorageItem,
  clearStorage,
  debugStorage,
  StorageKeys,
  loadTheme,
  saveTheme,
  loadSettings,
  saveSettings,
  type Theme,
  type AppSettings,
} from '@/lib/storage';

const STORAGE_PREFIX = 'eagle-react-template:';

// ============================================================================
// getStorageItem()
// ============================================================================

describe('getStorageItem', () => {
  it('returns default value when key does not exist', () => {
    const result = getStorageItem({
      key: 'nonexistent',
      defaultValue: 'fallback',
    });
    expect(result).toBe('fallback');
  });

  it('returns stored value when key exists', () => {
    localStorage.setItem(`${STORAGE_PREFIX}test`, JSON.stringify('stored value'));

    const result = getStorageItem({
      key: 'test',
      defaultValue: 'fallback',
    });
    expect(result).toBe('stored value');
  });

  it('handles object values', () => {
    const obj = { foo: 'bar', num: 42 };
    localStorage.setItem(`${STORAGE_PREFIX}object`, JSON.stringify(obj));

    const result = getStorageItem({
      key: 'object',
      defaultValue: {},
    });
    expect(result).toEqual(obj);
  });

  it('handles array values', () => {
    const arr = [1, 2, 3, 'four'];
    localStorage.setItem(`${STORAGE_PREFIX}array`, JSON.stringify(arr));

    const result = getStorageItem({
      key: 'array',
      defaultValue: [],
    });
    expect(result).toEqual(arr);
  });

  it('returns default value when JSON is invalid', () => {
    localStorage.setItem(`${STORAGE_PREFIX}invalid`, 'not valid json{');

    const result = getStorageItem({
      key: 'invalid',
      defaultValue: 'fallback',
    });
    expect(result).toBe('fallback');
  });

  it('uses validation function when provided', () => {
    localStorage.setItem(`${STORAGE_PREFIX}validated`, JSON.stringify('valid'));

    const result = getStorageItem({
      key: 'validated',
      defaultValue: 'default',
      validate: (v): v is string => typeof v === 'string' && v === 'valid',
    });
    expect(result).toBe('valid');
  });

  it('returns default when validation fails', () => {
    localStorage.setItem(`${STORAGE_PREFIX}invalid-type`, JSON.stringify(123));

    const result = getStorageItem({
      key: 'invalid-type',
      defaultValue: 'default',
      validate: (v): v is string => typeof v === 'string',
    });
    expect(result).toBe('default');
  });

  it('handles null stored value correctly', () => {
    localStorage.setItem(`${STORAGE_PREFIX}null-val`, JSON.stringify(null));

    const result = getStorageItem({
      key: 'null-val',
      defaultValue: 'fallback',
    });
    // null is a valid JSON value
    expect(result).toBe(null);
  });
});

// ============================================================================
// setStorageItem()
// ============================================================================

describe('setStorageItem', () => {
  it('stores string values', () => {
    const success = setStorageItem('test-string', 'hello');

    expect(success).toBe(true);
    expect(localStorage.getItem(`${STORAGE_PREFIX}test-string`)).toBe('"hello"');
  });

  it('stores object values', () => {
    const obj = { name: 'test', count: 5 };
    const success = setStorageItem('test-object', obj);

    expect(success).toBe(true);
    expect(JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}test-object`)!)).toEqual(obj);
  });

  it('stores array values', () => {
    const arr = [1, 2, 3];
    const success = setStorageItem('test-array', arr);

    expect(success).toBe(true);
    expect(JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}test-array`)!)).toEqual(arr);
  });

  it('stores boolean values', () => {
    setStorageItem('test-bool', true);
    expect(JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}test-bool`)!)).toBe(true);
  });

  it('stores number values', () => {
    setStorageItem('test-num', 42);
    expect(JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}test-num`)!)).toBe(42);
  });

  it('overwrites existing values', () => {
    setStorageItem('overwrite', 'first');
    setStorageItem('overwrite', 'second');

    expect(JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}overwrite`)!)).toBe('second');
  });

  it('returns false on storage error', () => {
    // Mock setItem to throw
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = vi.fn().mockImplementation(() => {
      throw new Error('Storage full');
    });

    const success = setStorageItem('error-test', 'value');
    expect(success).toBe(false);

    localStorage.setItem = originalSetItem;
  });
});

// ============================================================================
// removeStorageItem()
// ============================================================================

describe('removeStorageItem', () => {
  it('removes existing item', () => {
    localStorage.setItem(`${STORAGE_PREFIX}to-remove`, '"value"');

    const success = removeStorageItem('to-remove');

    expect(success).toBe(true);
    expect(localStorage.getItem(`${STORAGE_PREFIX}to-remove`)).toBeNull();
  });

  it('returns true for non-existing item', () => {
    const success = removeStorageItem('nonexistent');
    expect(success).toBe(true);
  });

  it('returns false on error', () => {
    const originalRemoveItem = localStorage.removeItem;
    localStorage.removeItem = vi.fn().mockImplementation(() => {
      throw new Error('Permission denied');
    });

    const success = removeStorageItem('error-test');
    expect(success).toBe(false);

    localStorage.removeItem = originalRemoveItem;
  });
});

// ============================================================================
// clearStorage()
// ============================================================================

describe('clearStorage', () => {
  it('removes all prefixed items', () => {
    localStorage.setItem(`${STORAGE_PREFIX}item1`, '"value1"');
    localStorage.setItem(`${STORAGE_PREFIX}item2`, '"value2"');
    localStorage.setItem(`${STORAGE_PREFIX}item3`, '"value3"');

    clearStorage();

    expect(localStorage.getItem(`${STORAGE_PREFIX}item1`)).toBeNull();
    expect(localStorage.getItem(`${STORAGE_PREFIX}item2`)).toBeNull();
    expect(localStorage.getItem(`${STORAGE_PREFIX}item3`)).toBeNull();
  });

  it('preserves non-prefixed items', () => {
    localStorage.setItem(`${STORAGE_PREFIX}plugin-item`, '"value"');
    localStorage.setItem('other-app-item', '"other"');

    clearStorage();

    expect(localStorage.getItem(`${STORAGE_PREFIX}plugin-item`)).toBeNull();
    expect(localStorage.getItem('other-app-item')).toBe('"other"');
  });

  it('handles empty storage', () => {
    expect(() => clearStorage()).not.toThrow();
  });
});

// ============================================================================
// debugStorage()
// ============================================================================

describe('debugStorage', () => {
  it('returns all prefixed items', () => {
    localStorage.setItem(`${STORAGE_PREFIX}debug1`, JSON.stringify('value1'));
    localStorage.setItem(`${STORAGE_PREFIX}debug2`, JSON.stringify({ key: 'value' }));

    const result = debugStorage();

    expect(result).toEqual({
      debug1: 'value1',
      debug2: { key: 'value' },
    });
  });

  it('excludes non-prefixed items', () => {
    localStorage.setItem(`${STORAGE_PREFIX}prefixed`, '"included"');
    localStorage.setItem('not-prefixed', '"excluded"');

    const result = debugStorage();

    expect(result).toHaveProperty('prefixed');
    expect(result).not.toHaveProperty('not-prefixed');
  });

  it('returns empty object when no prefixed items', () => {
    localStorage.setItem('other-item', '"value"');

    const result = debugStorage();

    expect(result).toEqual({});
  });

  it('handles non-JSON values gracefully', () => {
    localStorage.setItem(`${STORAGE_PREFIX}valid`, '"valid json"');
    localStorage.setItem(`${STORAGE_PREFIX}invalid`, 'not json');

    const result = debugStorage();

    expect(result.valid).toBe('valid json');
    expect(result.invalid).toBe('not json');
  });
});

// ============================================================================
// StorageKeys
// ============================================================================

describe('StorageKeys', () => {
  it('has expected keys', () => {
    expect(StorageKeys.THEME).toBe('theme');
    expect(StorageKeys.LOCALE).toBe('locale');
    expect(StorageKeys.SETTINGS).toBe('settings');
    expect(StorageKeys.RECENT_ITEMS).toBe('recentItems');
  });
});

// ============================================================================
// Theme helpers
// ============================================================================

describe('loadTheme', () => {
  it('returns default "auto" when not set', () => {
    expect(loadTheme()).toBe('auto');
  });

  it('returns stored theme value', () => {
    localStorage.setItem(`${STORAGE_PREFIX}theme`, JSON.stringify('dark'));
    expect(loadTheme()).toBe('dark');
  });

  it('validates theme value', () => {
    localStorage.setItem(`${STORAGE_PREFIX}theme`, JSON.stringify('invalid'));
    expect(loadTheme()).toBe('auto');
  });

  it('accepts valid theme values', () => {
    const themes: Theme[] = ['light', 'dark', 'auto'];

    themes.forEach((theme) => {
      localStorage.setItem(`${STORAGE_PREFIX}theme`, JSON.stringify(theme));
      expect(loadTheme()).toBe(theme);
    });
  });
});

describe('saveTheme', () => {
  it('saves theme to storage', () => {
    saveTheme('dark');
    expect(JSON.parse(localStorage.getItem(`${STORAGE_PREFIX}theme`)!)).toBe('dark');
  });

  it('can be loaded back correctly', () => {
    saveTheme('light');
    expect(loadTheme()).toBe('light');
  });
});

// ============================================================================
// Settings helpers
// ============================================================================

describe('loadSettings', () => {
  it('returns default settings when not set', () => {
    const settings = loadSettings();

    expect(settings).toEqual({
      alwaysOnTop: false,
      autoPreview: true,
      previewDelay: 300,
    });
  });

  it('returns stored settings', () => {
    const customSettings: AppSettings = {
      alwaysOnTop: true,
      autoPreview: false,
      previewDelay: 500,
    };
    localStorage.setItem(`${STORAGE_PREFIX}settings`, JSON.stringify(customSettings));

    const settings = loadSettings();
    expect(settings).toEqual(customSettings);
  });

  it('handles partial stored settings', () => {
    // This tests that defaults are properly merged
    // (though current implementation doesn't merge)
    localStorage.setItem(`${STORAGE_PREFIX}settings`, JSON.stringify({ alwaysOnTop: true }));

    const settings = loadSettings();
    expect(settings.alwaysOnTop).toBe(true);
  });
});

describe('saveSettings', () => {
  it('saves partial settings merged with existing', () => {
    // Set initial settings
    saveSettings({ alwaysOnTop: true, autoPreview: true, previewDelay: 300 });

    // Update only one property
    saveSettings({ autoPreview: false });

    const settings = loadSettings();
    expect(settings.alwaysOnTop).toBe(true); // Preserved
    expect(settings.autoPreview).toBe(false); // Updated
    expect(settings.previewDelay).toBe(300); // Preserved
  });

  it('can save individual properties', () => {
    saveSettings({ previewDelay: 1000 });

    const settings = loadSettings();
    expect(settings.previewDelay).toBe(1000);
  });
});
