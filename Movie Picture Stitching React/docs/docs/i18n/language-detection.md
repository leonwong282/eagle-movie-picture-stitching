---
sidebar_position: 2
title: Language Detection
description: Automatic language detection strategies
---

# Language Detection

The template automatically detects and applies the appropriate language based on multiple sources, prioritizing Eagle's settings.

## Detection Priority

```
┌──────────────────────────────────────────────────────────────┐
│                  Language Detection Chain                     │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  1. window.i18next.language                         │    │
│  │     Eagle's built-in i18next instance               │    │
│  │     Most accurate when available                    │    │
│  └───────────────────┬─────────────────────────────────┘    │
│                      │ if undefined                         │
│  ┌───────────────────▼─────────────────────────────────┐    │
│  │  2. eagleApi.locale                                 │    │
│  │     Eagle Plugin API locale property                │    │
│  │     Returns 'en', 'zh_CN', 'zh_TW', etc.           │    │
│  └───────────────────┬─────────────────────────────────┘    │
│                      │ if unavailable                       │
│  ┌───────────────────▼─────────────────────────────────┐    │
│  │  3. navigator.language                              │    │
│  │     Browser's language setting                      │    │
│  │     Used in browser development mode                │    │
│  └───────────────────┬─────────────────────────────────┘    │
│                      │ if not supported                     │
│  ┌───────────────────▼─────────────────────────────────┐    │
│  │  4. Fallback: 'en'                                  │    │
│  │     English as default                              │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

## Detection Implementation

### Main Detection Function

```tsx
// src/lib/i18n.ts

export function detectLanguage(): string {
  // Priority 1: Eagle's i18next
  if (typeof window !== 'undefined' && window.i18next?.language) {
    const lang = window.i18next.language;
    console.log('[i18n] Detected from Eagle i18next:', lang);
    return normalizeLanguage(lang);
  }
  
  // Priority 2: Eagle API locale
  try {
    const eagleLocale = eagleApi.locale;
    if (eagleLocale && eagleLocale !== 'en') {
      console.log('[i18n] Detected from Eagle API:', eagleLocale);
      return normalizeLanguage(eagleLocale);
    }
  } catch (error) {
    console.log('[i18n] Eagle API not available');
  }
  
  // Priority 3: Browser language
  if (typeof navigator !== 'undefined' && navigator.language) {
    console.log('[i18n] Detected from browser:', navigator.language);
    return normalizeLanguage(navigator.language);
  }
  
  // Priority 4: Fallback
  console.log('[i18n] Using fallback: en');
  return 'en';
}
```

### Language Normalization

Different sources return different formats. Normalization maps them to our locale codes:

```tsx
const LANGUAGE_MAP: Record<string, string> = {
  // Chinese variants
  'zh': 'zh_CN',
  'zh-CN': 'zh_CN',
  'zh-Hans': 'zh_CN',
  'zh-Hans-CN': 'zh_CN',
  'zh-TW': 'zh_TW',
  'zh-Hant': 'zh_TW',
  'zh-Hant-TW': 'zh_TW',
  'zh-HK': 'zh_TW',
  
  // Japanese
  'ja': 'ja_JP',
  'ja-JP': 'ja_JP',
  
  // Korean
  'ko': 'ko_KR',
  'ko-KR': 'ko_KR',
  
  // German
  'de': 'de_DE',
  'de-DE': 'de_DE',
  'de-AT': 'de_DE',
  'de-CH': 'de_DE',
  
  // Spanish
  'es': 'es_ES',
  'es-ES': 'es_ES',
  'es-MX': 'es_ES',
  'es-AR': 'es_ES',
  
  // Russian
  'ru': 'ru_RU',
  'ru-RU': 'ru_RU',
  
  // English (explicit mappings)
  'en': 'en',
  'en-US': 'en',
  'en-GB': 'en',
  'en-AU': 'en',
};

const SUPPORTED_LANGUAGES = ['en', 'zh_CN', 'zh_TW', 'ja_JP', 'ko_KR', 'de_DE', 'es_ES', 'ru_RU'];

function normalizeLanguage(lang: string): string {
  // Direct match in our supported languages
  if (SUPPORTED_LANGUAGES.includes(lang)) {
    return lang;
  }
  
  // Check mapping table
  if (LANGUAGE_MAP[lang]) {
    return LANGUAGE_MAP[lang];
  }
  
  // Try base language code
  const baseCode = lang.split('-')[0].split('_')[0];
  if (LANGUAGE_MAP[baseCode]) {
    return LANGUAGE_MAP[baseCode];
  }
  
  // Fallback to English
  return 'en';
}
```

## Runtime Language Sync

### useLanguageSync Hook

Sync language when Eagle's settings change:

```tsx
// src/hooks/use-language-sync.ts
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { eagleApi, isEagleEnvironment } from '@/lib/eagle-api';

export function useLanguageSync() {
  const { i18n } = useTranslation();

  useEffect(() => {
    if (!isEagleEnvironment()) {
      return;
    }

    // Check for language changes periodically
    const checkLanguage = () => {
      const currentLocale = normalizeLanguage(eagleApi.locale);
      if (currentLocale !== i18n.language) {
        console.log('[i18n] Language changed to:', currentLocale);
        i18n.changeLanguage(currentLocale);
      }
    };

    // Check on plugin show
    eagleApi.onPluginShow(checkLanguage);

    // Check on visibility change
    const handleVisibility = () => {
      if (!document.hidden) {
        checkLanguage();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    // Watch for HTML lang attribute changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'lang') {
          checkLanguage();
        }
      });
    });
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['lang'],
    });

    // Fallback: periodic check
    const interval = setInterval(checkLanguage, 10000);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      observer.disconnect();
      clearInterval(interval);
    };
  }, [i18n]);
}
```

### Usage

```tsx
// src/App.tsx
import { useLanguageSync } from '@/hooks/use-language-sync';

function App() {
  // Sync language with Eagle
  useLanguageSync();
  
  return (
    <div>
      {/* App content */}
    </div>
  );
}
```

## Browser Development

In browser development mode, the template uses `navigator.language`:

```tsx
// Mock behavior when Eagle API is not available
if (!isEagleEnvironment()) {
  // Uses browser's language setting
  const browserLang = navigator.language;  // e.g., 'en-US', 'zh-CN'
  const normalizedLang = normalizeLanguage(browserLang);
  i18n.changeLanguage(normalizedLang);
}
```

### Testing Different Languages

```tsx
// In browser console, manually change language:
window.i18n.changeLanguage('zh_CN');
window.i18n.changeLanguage('ja_JP');

// Or use URL parameter (if implemented):
// http://localhost:5173/?lang=zh_CN
```

## Eagle Locale Values

Eagle API returns these locale codes:

| Eagle Locale | Template Mapping |
|--------------|------------------|
| `en` | `en` |
| `zh_CN` | `zh_CN` |
| `zh_TW` | `zh_TW` |
| `ja_JP` | `ja_JP` |
| `ko_KR` | `ko_KR` |
| `de_DE` | `de_DE` |
| `es_ES` | `es_ES` |
| `ru_RU` | `ru_RU` |

## Debug Language Detection

```tsx
// Add to your app for debugging
useEffect(() => {
  console.group('Language Detection Debug');
  console.log('window.i18next?.language:', window.i18next?.language);
  console.log('eagleApi.locale:', eagleApi.locale);
  console.log('navigator.language:', navigator.language);
  console.log('Resolved language:', i18n.language);
  console.groupEnd();
}, [i18n.language]);
```

## Handling Detection Failures

```tsx
// Graceful fallback with user notification
function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { i18n, t } = useTranslation();
  const [detectionFailed, setDetectionFailed] = useState(false);

  useEffect(() => {
    const detected = detectLanguage();
    
    // If detection resulted in fallback when it shouldn't
    if (detected === 'en' && isEagleEnvironment()) {
      const eagleLocale = eagleApi.locale;
      if (eagleLocale && eagleLocale !== 'en') {
        console.warn('Language detection may have failed');
        setDetectionFailed(true);
      }
    }
  }, []);

  return (
    <>
      {detectionFailed && (
        <div className="bg-warning/10 p-2 text-sm">
          {t('messages.languageDetectionWarning')}
          <LanguageSelector />
        </div>
      )}
      {children}
    </>
  );
}
```

## Best Practices

### ✅ Do

```tsx
// Initialize i18n early
// In main.tsx:
import './lib/i18n';  // Before App import

// Use the sync hook at app root
function App() {
  useLanguageSync();
  // ...
}

// Log detection for debugging
console.log('[i18n] Detected:', detectLanguage());

// Handle all supported locales
const SUPPORTED = ['en', 'zh_CN', 'zh_TW', 'ja_JP', 'ko_KR', 'de_DE', 'es_ES', 'ru_RU'];
```

### ❌ Don't

```tsx
// Don't assume Eagle API is always available
const lang = eagleApi.locale;  // May throw

// Don't forget normalization
i18n.changeLanguage(navigator.language);  // 'en-US' not in resources!

// Don't detect on every render
function Component() {
  detectLanguage();  // Move to effect or initialization
}
```

## Related

- [i18n Overview](./overview) - Setup and usage
- [Translation Files](./translation-files) - File format and structure
