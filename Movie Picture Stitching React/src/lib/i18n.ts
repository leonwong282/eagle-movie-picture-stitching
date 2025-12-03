import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { eagleApi, isEagleEnvironment } from './eagle-api';

// Import all locale files
import en from '../../_locales/en.json';
import zh_CN from '../../_locales/zh_CN.json';
import zh_TW from '../../_locales/zh_TW.json';
import ja_JP from '../../_locales/ja_JP.json';
import ko_KR from '../../_locales/ko_KR.json';
import de_DE from '../../_locales/de_DE.json';
import es_ES from '../../_locales/es_ES.json';
import ru_RU from '../../_locales/ru_RU.json';

const resources = {
  en: { translation: en },
  zh_CN: { translation: zh_CN },
  zh_TW: { translation: zh_TW },
  ja_JP: { translation: ja_JP },
  ko_KR: { translation: ko_KR },
  de_DE: { translation: de_DE },
  es_ES: { translation: es_ES },
  ru_RU: { translation: ru_RU },
};

// Valid locale keys for type safety
type SupportedLocale = keyof typeof resources;

const isValidLocale = (locale: string): locale is SupportedLocale => {
  return locale in resources;
};

// Language code mapping from browser/Eagle to our locale keys
const langMap: Record<string, SupportedLocale> = {
  zh: 'zh_CN',
  'zh-CN': 'zh_CN',
  'zh-Hans': 'zh_CN',
  'zh-TW': 'zh_TW',
  'zh-Hant': 'zh_TW',
  ja: 'ja_JP',
  ko: 'ko_KR',
  de: 'de_DE',
  es: 'es_ES',
  ru: 'ru_RU',
  en: 'en',
};

/**
 * Detect language from Eagle or browser
 * Priority: Eagle's i18next > Eagle API locale > Browser language > 'en'
 */
export const detectLanguage = (): SupportedLocale => {
  // In Eagle environment, use Eagle's locale
  if (isEagleEnvironment()) {
    // Try to use Eagle's built-in i18next if available
    const eagleI18next = (window as Window & { i18next?: { language?: string } }).i18next;
    if (eagleI18next?.language && isValidLocale(eagleI18next.language)) {
      return eagleI18next.language;
    }
  }

  // Try Eagle API locale
  const eagleLocale = eagleApi.locale;
  if (eagleLocale && isValidLocale(eagleLocale)) {
    return eagleLocale;
  }

  // Fallback to browser language
  const browserLang = navigator.language;
  const mappedLang = langMap[browserLang] || langMap[browserLang.split('-')[0]];
  if (mappedLang) {
    return mappedLang;
  }

  return 'en';
};

i18n.use(initReactI18next).init({
  resources,
  lng: detectLanguage(),
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false, // React already escapes values
  },
  react: {
    useSuspense: false, // Disable suspense for better SSR compatibility
  },
});

/**
 * Change i18n language - call this when Eagle language changes
 */
export const changeLanguage = (lng: string): void => {
  if (isValidLocale(lng)) {
    i18n.changeLanguage(lng);
  }
};

/**
 * Get current i18n language
 */
export const getCurrentLanguage = (): string => {
  return i18n.language;
};

// ============================================================================
// Language Change Listener System
// ============================================================================

/**
 * Listener state to prevent duplicate setup
 */
interface LanguageListenerState {
  isSetup: boolean;
  cleanup: (() => void) | null;
  lastLocale: string;
}

const listenerState: LanguageListenerState = {
  isSetup: false,
  cleanup: null,
  lastLocale: detectLanguage(),
};

/**
 * Check for language changes and update i18n if needed
 */
const checkAndUpdateLanguage = (): void => {
  const newLang = detectLanguage();
  if (newLang !== listenerState.lastLocale && newLang !== i18n.language) {
    listenerState.lastLocale = newLang;
    i18n.changeLanguage(newLang);

    if (process.env.NODE_ENV === 'development') {
      console.log(`[i18n] Language changed: ${i18n.language} → ${newLang}`);
    }
  }
};

/**
 * Setup listener for Eagle language changes
 *
 * Uses event-driven approach instead of polling:
 * 1. Eagle's onPluginShow event (primary - fires when plugin becomes visible)
 * 2. MutationObserver on html[lang] attribute (backup - catches external changes)
 * 3. Optional fallback polling (only if needed, with longer interval)
 *
 * @param options Configuration options
 * @returns Cleanup function to remove listeners
 *
 * @example
 * ```typescript
 * // Setup in main.tsx
 * const cleanup = setupEagleLanguageListener();
 *
 * // Later, cleanup if needed (e.g., during HMR)
 * cleanup();
 * ```
 */
export const setupEagleLanguageListener = (
  options: {
    /** Enable fallback polling (default: false in mock, true in Eagle) */
    enablePolling?: boolean;
    /** Polling interval in ms (default: 10000ms - only used as fallback) */
    pollingInterval?: number;
  } = {}
): (() => void) => {
  // Already setup - return existing cleanup
  if (listenerState.isSetup && listenerState.cleanup) {
    return listenerState.cleanup;
  }

  const cleanupFunctions: (() => void)[] = [];
  const inEagle = isEagleEnvironment();

  // Determine if polling should be enabled (default: only in Eagle environment)
  const enablePolling = options.enablePolling ?? inEagle;
  const pollingInterval = options.pollingInterval ?? 10000; // 10 seconds fallback

  // -------------------------------------------------------------------------
  // 1. Eagle Plugin Events (primary trigger)
  // -------------------------------------------------------------------------
  if (inEagle) {
    const globalEagle = (
      window as Window & {
        eagle?: {
          event?: {
            onPluginShow?: (cb: () => void) => void;
          };
        };
      }
    ).eagle;

    if (globalEagle?.event?.onPluginShow) {
      // Note: Eagle doesn't provide a way to remove this listener,
      // but it's cleaned up when the plugin is destroyed
      globalEagle.event.onPluginShow(() => {
        checkAndUpdateLanguage();
      });
    }
  }

  // -------------------------------------------------------------------------
  // 2. MutationObserver on html[lang] attribute (backup trigger)
  // -------------------------------------------------------------------------
  if (typeof MutationObserver !== 'undefined') {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'lang') {
          checkAndUpdateLanguage();
          break;
        }
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['lang'],
    });

    cleanupFunctions.push(() => observer.disconnect());
  }

  // -------------------------------------------------------------------------
  // 3. Fallback Polling (only if explicitly enabled or in Eagle)
  // -------------------------------------------------------------------------
  if (enablePolling) {
    const intervalId = setInterval(() => {
      checkAndUpdateLanguage();
    }, pollingInterval);

    cleanupFunctions.push(() => clearInterval(intervalId));
  }

  // -------------------------------------------------------------------------
  // 4. Visibility Change Event (pause/resume awareness)
  // -------------------------------------------------------------------------
  const handleVisibilityChange = () => {
    if (!document.hidden) {
      // Page became visible - check for language changes
      checkAndUpdateLanguage();
    }
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);
  cleanupFunctions.push(() => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  });

  // Create combined cleanup function
  const cleanup = () => {
    cleanupFunctions.forEach((fn) => fn());
    listenerState.isSetup = false;
    listenerState.cleanup = null;
  };

  listenerState.isSetup = true;
  listenerState.cleanup = cleanup;

  return cleanup;
};

/**
 * Cleanup any existing language listeners
 * Call this before setting up new listeners (e.g., during HMR)
 */
export const cleanupLanguageListener = (): void => {
  if (listenerState.cleanup) {
    listenerState.cleanup();
  }
};

/**
 * Check if language listener is currently active
 */
export const isLanguageListenerActive = (): boolean => {
  return listenerState.isSetup;
};

export default i18n;
