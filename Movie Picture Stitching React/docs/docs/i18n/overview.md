---
sidebar_position: 1
title: Overview
description: Internationalization with i18next
---

# Internationalization Overview

The template uses **i18next** with **react-i18next** for internationalization, supporting 8 languages with automatic detection based on Eagle's locale settings.

## Supported Languages

| Code | Language | File |
|------|----------|------|
| `en` | English | `_locales/en.json` |
| `zh_CN` | Simplified Chinese | `_locales/zh_CN.json` |
| `zh_TW` | Traditional Chinese | `_locales/zh_TW.json` |
| `ja_JP` | Japanese | `_locales/ja_JP.json` |
| `ko_KR` | Korean | `_locales/ko_KR.json` |
| `de_DE` | German | `_locales/de_DE.json` |
| `es_ES` | Spanish | `_locales/es_ES.json` |
| `ru_RU` | Russian | `_locales/ru_RU.json` |

## Quick Start

### Using Translations

```tsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('app.title')}</h1>
      <p>{t('app.description')}</p>
    </div>
  );
}
```

### With Variables

```tsx
const { t } = useTranslation();

// Translation file: "selectedCount": "{{count}} items selected"
<p>{t('demo.selectedCount', { count: 5 })}</p>
// Output: "5 items selected"
```

### Pluralization

```tsx
// Translation file:
// "item": "{{count}} item"
// "item_plural": "{{count}} items"

<p>{t('item', { count: 1 })}</p>  // "1 item"
<p>{t('item', { count: 5 })}</p>  // "5 items"
```

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    i18n Detection Flow                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. window.i18next.language (Eagle's built-in i18next)         │
│           ↓ if undefined                                        │
│  2. eagleApi.locale (Eagle Plugin API)                         │
│           ↓ if unavailable                                      │
│  3. navigator.language (browser)                                │
│           ↓ if not supported                                    │
│  4. Fallback to 'en'                                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## File Structure

```
_locales/
├── en.json           # English (fallback)
├── zh_CN.json        # Simplified Chinese
├── zh_TW.json        # Traditional Chinese
├── ja_JP.json        # Japanese
├── ko_KR.json        # Korean
├── de_DE.json        # German
├── es_ES.json        # Spanish
└── ru_RU.json        # Russian

src/
├── lib/
│   └── i18n.ts       # i18next configuration
└── hooks/
    └── use-language-sync.ts  # Eagle language sync hook
```

## Configuration

### i18next Setup

```tsx
// src/lib/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

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

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: detectLanguage(),
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,  // React already escapes
    },
  });

export default i18n;
```

### Language Detection

```tsx
// src/lib/i18n.ts
function detectLanguage(): string {
  // 1. Check Eagle's i18next
  if (typeof window !== 'undefined' && window.i18next?.language) {
    return mapLanguage(window.i18next.language);
  }
  
  // 2. Check Eagle API
  try {
    const eagleLocale = eagleApi.locale;
    if (eagleLocale) {
      return mapLanguage(eagleLocale);
    }
  } catch {
    // Eagle API not available
  }
  
  // 3. Check browser language
  if (typeof navigator !== 'undefined') {
    return mapLanguage(navigator.language);
  }
  
  // 4. Default
  return 'en';
}

function mapLanguage(lang: string): string {
  const langMap: Record<string, string> = {
    'zh': 'zh_CN',
    'zh-CN': 'zh_CN',
    'zh-Hans': 'zh_CN',
    'zh-TW': 'zh_TW',
    'zh-Hant': 'zh_TW',
    'ja': 'ja_JP',
    'ko': 'ko_KR',
    'de': 'de_DE',
    'es': 'es_ES',
    'ru': 'ru_RU',
  };
  
  // Direct match
  if (resources[lang]) return lang;
  
  // Mapped match
  if (langMap[lang]) return langMap[lang];
  
  // Language code only (e.g., 'en-US' → 'en')
  const base = lang.split('-')[0];
  if (resources[base]) return base;
  if (langMap[base]) return langMap[base];
  
  return 'en';
}
```

## Translation File Format

### Basic Structure

```json
{
  "app": {
    "title": "My Plugin",
    "description": "A useful Eagle plugin"
  },
  "ui": {
    "buttons": {
      "save": "Save",
      "cancel": "Cancel",
      "export": "Export"
    },
    "labels": {
      "quality": "Quality",
      "format": "Format"
    }
  },
  "messages": {
    "success": "Operation completed successfully",
    "error": "An error occurred"
  }
}
```

### With Variables

```json
{
  "demo": {
    "selectedCount": "{{count}} items selected",
    "exportProgress": "Exporting {{current}} of {{total}}...",
    "greeting": "Hello, {{name}}!"
  }
}
```

### Nested Access

```tsx
// Access nested keys with dot notation
t('ui.buttons.save')      // "Save"
t('messages.success')     // "Operation completed successfully"
```

## Changing Language

```tsx
import { useTranslation } from 'react-i18next';

function LanguageSelector() {
  const { i18n } = useTranslation();
  
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'zh_CN', name: '简体中文' },
    { code: 'zh_TW', name: '繁體中文' },
    { code: 'ja_JP', name: '日本語' },
    { code: 'ko_KR', name: '한국어' },
    { code: 'de_DE', name: 'Deutsch' },
    { code: 'es_ES', name: 'Español' },
    { code: 'ru_RU', name: 'Русский' },
  ];
  
  return (
    <select
      value={i18n.language}
      onChange={(e) => i18n.changeLanguage(e.target.value)}
    >
      {languages.map(({ code, name }) => (
        <option key={code} value={code}>
          {name}
        </option>
      ))}
    </select>
  );
}
```

## Best Practices

### ✅ Do

```tsx
// Use translation keys for all user-facing text
<button>{t('ui.buttons.save')}</button>

// Provide context in key names
t('settings.theme.label')
t('settings.theme.description')

// Use variables for dynamic content
t('messages.itemCount', { count: items.length })

// Keep translations organized by feature
{
  "header": { ... },
  "sidebar": { ... },
  "settings": { ... }
}
```

### ❌ Don't

```tsx
// Don't hardcode user-facing text
<button>Save</button>

// Don't concatenate translated strings
t('hello') + ' ' + t('world')  // Word order varies by language

// Don't use translation keys for internal logic
if (status === t('status.active')) { }  // Use constants
```

## Related

- [Language Detection](./language-detection) - Detection strategies
- [Translation Files](./translation-files) - File format and structure
