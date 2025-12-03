---
sidebar_position: 5
title: useLanguageSync
description: Event-driven hook for syncing i18n with Eagle's locale
---

# useLanguageSync

An event-driven hook that synchronizes i18next language with Eagle's locale setting, with intelligent fallback polling for edge cases.

## Import

```tsx
import { useLanguageSync } from '@/hooks';
```

## Basic Usage

```tsx
function App() {
  // Auto-syncs i18next with Eagle's locale
  useLanguageSync();

  return (
    <div>
      <h1>{t('app.title')}</h1>
    </div>
  );
}
```

## Signature

```tsx
const result = useLanguageSync(options?: UseLanguageSyncOptions);
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `autoSetup` | `boolean` | `true` | Auto-setup listeners on mount |
| `enablePolling` | `boolean` | `true` in Eagle | Enable fallback polling |
| `pollingInterval` | `number` | `10000` | Polling interval (10s) |

## Return Value

| Property | Type | Description |
|----------|------|-------------|
| `language` | `string` | Current language code (e.g., 'en', 'zh_CN') |
| `isListening` | `boolean` | Whether event listeners are active |
| `setLanguage` | `(lang: string) => Promise<void>` | Manually change language |
| `detectLanguage` | `() => void` | Force re-detect from Eagle |
| `startListening` | `() => void` | Start event listeners |
| `stopListening` | `() => void` | Stop event listeners |

## Examples

### Basic Auto-Sync

```tsx
function App() {
  // Most common usage - just sync automatically
  useLanguageSync();

  return <TranslatedContent />;
}
```

### Access Current Language

```tsx
function LanguageDisplay() {
  const { language } = useLanguageSync();

  return (
    <span className="text-sm text-muted-foreground">
      Current: {language}
    </span>
  );
}
```

### Manual Language Selection

```tsx
function LanguagePicker() {
  const { language, setLanguage } = useLanguageSync();

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'zh_CN', name: '简体中文' },
    { code: 'zh_TW', name: '繁體中文' },
    { code: 'ja_JP', name: '日本語' },
  ];

  return (
    <Select value={language} onValueChange={setLanguage}>
      <SelectTrigger className="w-40">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {languages.map(lang => (
          <SelectItem key={lang.code} value={lang.code}>
            {lang.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
```

### Force Re-Detection

```tsx
function LanguageRefresh() {
  const { detectLanguage, language } = useLanguageSync();

  return (
    <div className="flex items-center gap-2">
      <span>{language}</span>
      <Button 
        variant="ghost" 
        size="sm"
        onClick={detectLanguage}
      >
        <RefreshCw className="h-4 w-4" />
      </Button>
    </div>
  );
}
```

### With Manual Control

```tsx
function ControlledSync() {
  const { 
    language,
    isListening,
    startListening,
    stopListening 
  } = useLanguageSync({ autoSetup: false });

  return (
    <div>
      <p>Language: {language}</p>
      <p>Listening: {isListening ? 'Yes' : 'No'}</p>
      <Button onClick={startListening}>Start</Button>
      <Button onClick={stopListening}>Stop</Button>
    </div>
  );
}
```

## Supported Languages

The template supports 8 languages out of the box:

| Code | Language | Eagle Locale |
|------|----------|--------------|
| `en` | English | `en` |
| `zh_CN` | Simplified Chinese | `zh_CN` |
| `zh_TW` | Traditional Chinese | `zh_TW` |
| `ja_JP` | Japanese | `ja_JP` |
| `ko_KR` | Korean | `ko_KR` |
| `de_DE` | German | `de_DE` |
| `es_ES` | Spanish | `es_ES` |
| `ru_RU` | Russian | `ru_RU` |

## Language Detection Flow

The hook uses multiple strategies to detect the current language:

```
┌─────────────────────────────────────────────────────┐
│  1. Check window.i18next.language                   │
│     (Eagle's built-in i18next instance)             │
│         ↓                                           │
│  2. Check eagleApi.locale                           │
│     (Eagle's locale setting)                        │
│         ↓                                           │
│  3. Check navigator.language                        │
│     (Browser's language)                            │
│         ↓                                           │
│  4. Default to 'en'                                 │
└─────────────────────────────────────────────────────┘
```

### Browser Language Mapping

Browser language codes are mapped to Eagle locale codes:

```typescript
const langMap = {
  'zh': 'zh_CN',      // zh → Simplified Chinese
  'zh-CN': 'zh_CN',
  'zh-TW': 'zh_TW',   // zh-TW → Traditional Chinese
  'zh-HK': 'zh_TW',
  'ja': 'ja_JP',
  'ko': 'ko_KR',
  'de': 'de_DE',
  'es': 'es_ES',
  'ru': 'ru_RU',
};
```

## Event-Driven Updates

The hook listens to multiple events for language changes:

### 1. Plugin Visibility Events

```typescript
// When plugin becomes visible
window.addEventListener('plugin-show', detectLanguage);
document.addEventListener('visibilitychange', detectLanguage);
```

### 2. HTML Lang Attribute Changes

```typescript
// MutationObserver on <html lang="...">
const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    if (mutation.attributeName === 'lang') {
      detectLanguage();
    }
  }
});

observer.observe(document.documentElement, {
  attributes: true,
  attributeFilter: ['lang'],
});
```

### 3. Fallback Polling

When event-based detection isn't reliable (rare edge cases):

```typescript
// Poll every 10 seconds as fallback
setInterval(detectLanguage, 10000);
```

## Integration with i18next

The hook integrates with the template's i18next setup:

```tsx
// lib/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: require('@/_locales/en.json') },
    zh_CN: { translation: require('@/_locales/zh_CN.json') },
    // ...
  },
  fallbackLng: 'en',
});

// In App.tsx
function App() {
  useLanguageSync(); // Keeps i18next in sync with Eagle
  
  return (
    <div>
      <h1>{t('app.title')}</h1>
    </div>
  );
}
```

## Best Practices

### Do

- ✅ Call `useLanguageSync()` once at the app root level
- ✅ Use `t()` from react-i18next for all text
- ✅ Keep translation files in `_locales/` directory
- ✅ Test with different Eagle locale settings
- ✅ Provide fallback text for missing translations

### Don't

- ❌ Call `useLanguageSync()` in multiple components
- ❌ Hardcode text strings in components
- ❌ Change language directly via i18next (use `setLanguage`)
- ❌ Disable polling without testing event detection

## Debugging

Check current language detection:

```javascript
// In browser console
console.log('i18next language:', i18next.language);
console.log('Eagle locale:', eagleApi.locale);
console.log('Navigator language:', navigator.language);
```

## Translation Files

Translation files are located in `_locales/`:

```
_locales/
├── en.json
├── zh_CN.json
├── zh_TW.json
├── ja_JP.json
├── ko_KR.json
├── de_DE.json
├── es_ES.json
└── ru_RU.json
```

Structure:

```json
{
  "app": {
    "title": "Eagle Plugin",
    "description": "Description text"
  },
  "buttons": {
    "save": "Save",
    "cancel": "Cancel"
  }
}
```

Usage:

```tsx
const { t } = useTranslation();

<h1>{t('app.title')}</h1>
<Button>{t('buttons.save')}</Button>
```

## Related

- [Core Concepts: Theme & i18n](../core-concepts/theme-i18n) - Full i18n setup guide
- [Hooks Overview](./overview) - All available hooks
