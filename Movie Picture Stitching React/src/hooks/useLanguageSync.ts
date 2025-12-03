import { useEffect, useState, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  setupEagleLanguageListener,
  detectLanguage,
  changeLanguage,
  isLanguageListenerActive,
} from '@/lib/i18n';

/**
 * Options for useLanguageSync hook
 */
export interface UseLanguageSyncOptions {
  /**
   * Whether to automatically setup language listener on mount
   * @default true
   */
  autoSetup?: boolean;

  /**
   * Enable fallback polling for environments without good event support
   * @default true in Eagle, false in browser
   */
  enablePolling?: boolean;

  /**
   * Polling interval in milliseconds (only used as fallback)
   * @default 10000 (10 seconds)
   */
  pollingInterval?: number;
}

/**
 * Return type for useLanguageSync hook
 */
export interface UseLanguageSyncReturn {
  /**
   * Current language code (e.g., 'en', 'zh_CN')
   */
  language: string;

  /**
   * Whether the language listener is active
   */
  isListenerActive: boolean;

  /**
   * Manually change the language
   */
  setLanguage: (lng: string) => void;

  /**
   * Force re-detect language from Eagle/browser
   */
  detectAndSync: () => void;

  /**
   * Manually start the language listener (if autoSetup is false)
   */
  startListener: () => void;

  /**
   * Manually stop the language listener
   */
  stopListener: () => void;
}

/**
 * React hook for synchronizing i18n language with Eagle's locale.
 *
 * Handles automatic language detection and change events with proper cleanup.
 * Uses event-driven approach (onPluginShow, MutationObserver, visibilitychange)
 * instead of aggressive polling.
 *
 * @param options Configuration options
 * @returns Language state and control functions
 *
 * @example Basic usage (auto-setup)
 * ```tsx
 * function App() {
 *   const { language } = useLanguageSync();
 *
 *   return <div>Current language: {language}</div>;
 * }
 * ```
 *
 * @example Manual control
 * ```tsx
 * function App() {
 *   const {
 *     language,
 *     setLanguage,
 *     detectAndSync,
 *     startListener,
 *     stopListener
 *   } = useLanguageSync({ autoSetup: false });
 *
 *   useEffect(() => {
 *     // Start listener when ready
 *     startListener();
 *
 *     return () => stopListener();
 *   }, []);
 *
 *   return (
 *     <select value={language} onChange={(e) => setLanguage(e.target.value)}>
 *       <option value="en">English</option>
 *       <option value="zh_CN">简体中文</option>
 *     </select>
 *   );
 * }
 * ```
 */
export function useLanguageSync(options: UseLanguageSyncOptions = {}): UseLanguageSyncReturn {
  const { autoSetup = true, enablePolling, pollingInterval } = options;

  const { i18n } = useTranslation();
  const [language, setLanguageState] = useState<string>(i18n.language);
  const [isListenerActive, setIsListenerActive] = useState<boolean>(isLanguageListenerActive());
  const cleanupRef = useRef<(() => void) | null>(null);

  // Sync state when i18n language changes
  useEffect(() => {
    const handleLanguageChanged = (lng: string) => {
      setLanguageState(lng);
    };

    i18n.on('languageChanged', handleLanguageChanged);

    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [i18n]);

  // Start listener
  const startListener = useCallback(() => {
    if (cleanupRef.current) {
      // Already running
      return;
    }

    cleanupRef.current = setupEagleLanguageListener({
      enablePolling,
      pollingInterval,
    });
    setIsListenerActive(true);
  }, [enablePolling, pollingInterval]);

  // Stop listener
  const stopListener = useCallback(() => {
    if (cleanupRef.current) {
      cleanupRef.current();
      cleanupRef.current = null;
    }
    setIsListenerActive(false);
  }, []);

  // Auto-setup on mount
  useEffect(() => {
    if (autoSetup) {
      startListener();
    }

    return () => {
      // Cleanup on unmount
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
    };
  }, [autoSetup, startListener]);

  // Manual language change
  const setLanguage = useCallback((lng: string) => {
    changeLanguage(lng);
  }, []);

  // Force re-detect and sync
  const detectAndSync = useCallback(() => {
    const detected = detectLanguage();
    if (detected !== i18n.language) {
      changeLanguage(detected);
    }
  }, [i18n.language]);

  return {
    language,
    isListenerActive,
    setLanguage,
    detectAndSync,
    startListener,
    stopListener,
  };
}
