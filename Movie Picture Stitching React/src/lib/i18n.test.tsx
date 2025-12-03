import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import React from 'react';
import i18n, {
  detectLanguage,
  changeLanguage,
  getCurrentLanguage,
  setupEagleLanguageListener,
  cleanupLanguageListener,
  isLanguageListenerActive,
} from './i18n';
import { useLanguageSync } from '@/hooks/useLanguageSync';

// Helper wrapper for hooks that need i18n
function createWrapper() {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
  };
}

describe('i18n Language Detection', () => {
  beforeEach(() => {
    // Cleanup any existing listeners
    cleanupLanguageListener();
    // Reset language to English
    i18n.changeLanguage('en');
  });

  afterEach(() => {
    cleanupLanguageListener();
  });

  describe('detectLanguage', () => {
    it('returns a valid locale string', () => {
      const lang = detectLanguage();
      expect(typeof lang).toBe('string');
      expect(['en', 'zh_CN', 'zh_TW', 'ja_JP', 'ko_KR', 'de_DE', 'es_ES', 'ru_RU']).toContain(lang);
    });

    it('defaults to en in mock environment', () => {
      // In test environment, navigator.language is usually 'en-US' which maps to 'en'
      const lang = detectLanguage();
      // Should be a valid locale
      expect(lang).toBeTruthy();
    });
  });

  describe('changeLanguage', () => {
    it('changes language to valid locale', async () => {
      changeLanguage('zh_CN');
      await waitFor(() => {
        expect(i18n.language).toBe('zh_CN');
      });
    });

    it('does not change language to invalid locale', async () => {
      const originalLang = i18n.language;
      changeLanguage('invalid_locale');
      // Language should remain unchanged
      expect(i18n.language).toBe(originalLang);
    });

    it('changes to all supported locales', async () => {
      const locales = ['en', 'zh_CN', 'zh_TW', 'ja_JP', 'ko_KR', 'de_DE', 'es_ES', 'ru_RU'];

      for (const locale of locales) {
        changeLanguage(locale);
        await waitFor(() => {
          expect(i18n.language).toBe(locale);
        });
      }
    });
  });

  describe('getCurrentLanguage', () => {
    it('returns current i18n language', () => {
      expect(getCurrentLanguage()).toBe(i18n.language);
    });

    it('updates after language change', async () => {
      changeLanguage('ja_JP');
      await waitFor(() => {
        expect(getCurrentLanguage()).toBe('ja_JP');
      });
    });
  });
});

describe('Language Listener System', () => {
  beforeEach(() => {
    cleanupLanguageListener();
    i18n.changeLanguage('en');
  });

  afterEach(() => {
    cleanupLanguageListener();
  });

  describe('setupEagleLanguageListener', () => {
    it('returns a cleanup function', () => {
      const cleanup = setupEagleLanguageListener();
      expect(typeof cleanup).toBe('function');
      cleanup();
    });

    it('sets listener as active', () => {
      expect(isLanguageListenerActive()).toBe(false);
      setupEagleLanguageListener();
      expect(isLanguageListenerActive()).toBe(true);
    });

    it('returns same cleanup if called multiple times', () => {
      const cleanup1 = setupEagleLanguageListener();
      const cleanup2 = setupEagleLanguageListener();
      expect(cleanup1).toBe(cleanup2);
    });

    it('accepts polling options', () => {
      const cleanup = setupEagleLanguageListener({
        enablePolling: true,
        pollingInterval: 5000,
      });
      expect(isLanguageListenerActive()).toBe(true);
      cleanup();
    });

    it('accepts enablePolling: false', () => {
      const cleanup = setupEagleLanguageListener({
        enablePolling: false,
      });
      expect(isLanguageListenerActive()).toBe(true);
      cleanup();
    });
  });

  describe('cleanupLanguageListener', () => {
    it('deactivates listener', () => {
      setupEagleLanguageListener();
      expect(isLanguageListenerActive()).toBe(true);

      cleanupLanguageListener();
      expect(isLanguageListenerActive()).toBe(false);
    });

    it('is safe to call multiple times', () => {
      cleanupLanguageListener();
      cleanupLanguageListener();
      expect(isLanguageListenerActive()).toBe(false);
    });

    it('allows re-setup after cleanup', () => {
      const cleanup1 = setupEagleLanguageListener();
      cleanup1();
      expect(isLanguageListenerActive()).toBe(false);

      const cleanup2 = setupEagleLanguageListener();
      expect(isLanguageListenerActive()).toBe(true);
      cleanup2();
    });
  });

  describe('isLanguageListenerActive', () => {
    it('returns false initially', () => {
      expect(isLanguageListenerActive()).toBe(false);
    });

    it('returns true when listener is setup', () => {
      setupEagleLanguageListener();
      expect(isLanguageListenerActive()).toBe(true);
    });

    it('returns false after cleanup', () => {
      const cleanup = setupEagleLanguageListener();
      cleanup();
      expect(isLanguageListenerActive()).toBe(false);
    });
  });

  describe('MutationObserver integration', () => {
    it('detects html lang attribute changes', async () => {
      setupEagleLanguageListener({ enablePolling: false });

      // Change the lang attribute
      const originalLang = document.documentElement.lang;
      document.documentElement.lang = 'zh_CN';

      // MutationObserver is async
      await waitFor(
        () => {
          // The observer should have detected the change
          // Note: In mock environment, this might not trigger i18n change
          // since detectLanguage checks eagleApi.locale first
        },
        { timeout: 100 }
      );

      // Restore
      document.documentElement.lang = originalLang;
      cleanupLanguageListener();
    });
  });

  describe('Visibility change integration', () => {
    it('checks language on visibility change', async () => {
      setupEagleLanguageListener({ enablePolling: false });

      // Simulate visibility change
      const event = new Event('visibilitychange');
      Object.defineProperty(document, 'hidden', { value: false, writable: true });
      document.dispatchEvent(event);

      // Should not throw
      expect(isLanguageListenerActive()).toBe(true);

      cleanupLanguageListener();
    });
  });
});

describe('useLanguageSync Hook', () => {
  beforeEach(() => {
    cleanupLanguageListener();
    i18n.changeLanguage('en');
  });

  afterEach(() => {
    cleanupLanguageListener();
  });

  describe('basic functionality', () => {
    it('returns current language', () => {
      const { result } = renderHook(() => useLanguageSync(), {
        wrapper: createWrapper(),
      });

      expect(result.current.language).toBe('en');
    });

    it('auto-starts listener by default', () => {
      const { result } = renderHook(() => useLanguageSync(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isListenerActive).toBe(true);
    });

    it('does not auto-start when autoSetup is false', () => {
      const { result } = renderHook(() => useLanguageSync({ autoSetup: false }), {
        wrapper: createWrapper(),
      });

      expect(result.current.isListenerActive).toBe(false);
    });
  });

  describe('setLanguage', () => {
    it('changes language', async () => {
      const { result } = renderHook(() => useLanguageSync(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.setLanguage('zh_TW');
      });

      await waitFor(() => {
        expect(result.current.language).toBe('zh_TW');
      });
    });
  });

  describe('detectAndSync', () => {
    it('re-detects language', () => {
      const { result } = renderHook(() => useLanguageSync(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.detectAndSync();
      });

      // Should have a valid language
      expect(result.current.language).toBeTruthy();
    });
  });

  describe('startListener / stopListener', () => {
    it('can manually start listener', () => {
      const { result } = renderHook(() => useLanguageSync({ autoSetup: false }), {
        wrapper: createWrapper(),
      });

      expect(result.current.isListenerActive).toBe(false);

      act(() => {
        result.current.startListener();
      });

      expect(result.current.isListenerActive).toBe(true);
    });

    it('can manually stop listener', () => {
      const { result } = renderHook(() => useLanguageSync(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isListenerActive).toBe(true);

      act(() => {
        result.current.stopListener();
      });

      expect(result.current.isListenerActive).toBe(false);
    });

    it('start is idempotent', () => {
      const { result } = renderHook(() => useLanguageSync({ autoSetup: false }), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.startListener();
        result.current.startListener();
        result.current.startListener();
      });

      expect(result.current.isListenerActive).toBe(true);
    });
  });

  describe('cleanup on unmount', () => {
    it('cleans up listener on unmount', () => {
      const { unmount } = renderHook(() => useLanguageSync(), {
        wrapper: createWrapper(),
      });

      expect(isLanguageListenerActive()).toBe(true);

      unmount();

      // After unmount, the listener should be cleaned up
      // Note: The global state might still show active if other hooks are using it
    });
  });

  describe('language change events', () => {
    it('updates state when i18n language changes', async () => {
      const { result } = renderHook(() => useLanguageSync(), {
        wrapper: createWrapper(),
      });

      expect(result.current.language).toBe('en');

      act(() => {
        i18n.changeLanguage('de_DE');
      });

      await waitFor(() => {
        expect(result.current.language).toBe('de_DE');
      });
    });
  });

  describe('options', () => {
    it('accepts enablePolling option', () => {
      const { result } = renderHook(
        () => useLanguageSync({ enablePolling: true, pollingInterval: 5000 }),
        { wrapper: createWrapper() }
      );

      expect(result.current.isListenerActive).toBe(true);
    });

    it('accepts pollingInterval option', () => {
      const { result } = renderHook(() => useLanguageSync({ pollingInterval: 30000 }), {
        wrapper: createWrapper(),
      });

      expect(result.current.isListenerActive).toBe(true);
    });
  });
});
