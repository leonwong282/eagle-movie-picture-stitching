---
sidebar_position: 1
title: 概覽
description: 使用 i18next 進行國際化
---

# 國際化概覽

此模板使用 **i18next** 搭配 **react-i18next** 進行國際化，支援 8 種語言，並根據 Eagle 的語言設定自動偵測。

## 支援的語言

| 代碼 | 語言 | 檔案 |
|------|------|------|
| `en` | 英文 | `_locales/en.json` |
| `zh_CN` | 簡體中文 | `_locales/zh_CN.json` |
| `zh_TW` | 繁體中文 | `_locales/zh_TW.json` |
| `ja_JP` | 日文 | `_locales/ja_JP.json` |
| `ko_KR` | 韓文 | `_locales/ko_KR.json` |
| `de_DE` | 德文 | `_locales/de_DE.json` |
| `es_ES` | 西班牙文 | `_locales/es_ES.json` |
| `ru_RU` | 俄文 | `_locales/ru_RU.json` |

## 快速入門

### 使用翻譯

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

### 帶變數

```tsx
const { t } = useTranslation();

// 翻譯檔案："selectedCount": "已選取 {{count}} 個項目"
<p>{t('demo.selectedCount', { count: 5 })}</p>
// 輸出："已選取 5 個項目"
```

### 複數形式

```tsx
// 翻譯檔案：
// "item": "{{count}} 個項目"
// "item_plural": "{{count}} 個項目"

<p>{t('item', { count: 1 })}</p>  // "1 個項目"
<p>{t('item', { count: 5 })}</p>  // "5 個項目"
```

## 架構

```
┌─────────────────────────────────────────────────────────────────┐
│                      i18n 偵測流程                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. window.i18next.language（Eagle 內建的 i18next）            │
│           ↓ 如果未定義                                          │
│  2. eagleApi.locale（Eagle 外掛 API）                          │
│           ↓ 如果無法使用                                        │
│  3. navigator.language（瀏覽器）                                │
│           ↓ 如果不支援                                          │
│  4. 回退到 'en'                                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 檔案結構

```
_locales/
├── en.json           # 英文（回退）
├── zh_CN.json        # 簡體中文
├── zh_TW.json        # 繁體中文
├── ja_JP.json        # 日文
├── ko_KR.json        # 韓文
├── de_DE.json        # 德文
├── es_ES.json        # 西班牙文
└── ru_RU.json        # 俄文

src/
├── lib/
│   └── i18n.ts       # i18next 設定
└── hooks/
    └── use-language-sync.ts  # Eagle 語言同步 hook
```

## 設定

### i18next 設定

```tsx
// src/lib/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// 匯入所有語言檔案
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
      escapeValue: false,  // React 已經會跳脫
    },
  });

export default i18n;
```

### 語言偵測

```tsx
// src/lib/i18n.ts
function detectLanguage(): string {
  // 1. 檢查 Eagle 的 i18next
  if (typeof window !== 'undefined' && window.i18next?.language) {
    return mapLanguage(window.i18next.language);
  }
  
  // 2. 檢查 Eagle API
  try {
    const eagleLocale = eagleApi.locale;
    if (eagleLocale) {
      return mapLanguage(eagleLocale);
    }
  } catch {
    // Eagle API 無法使用
  }
  
  // 3. 檢查瀏覽器語言
  if (typeof navigator !== 'undefined') {
    return mapLanguage(navigator.language);
  }
  
  // 4. 預設
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
  
  // 直接匹配
  if (resources[lang]) return lang;
  
  // 對應匹配
  if (langMap[lang]) return langMap[lang];
  
  // 僅語言代碼（例如 'en-US' → 'en'）
  const base = lang.split('-')[0];
  if (resources[base]) return base;
  if (langMap[base]) return langMap[base];
  
  return 'en';
}
```

## 翻譯檔案格式

### 基本結構

```json
{
  "app": {
    "title": "我的外掛",
    "description": "一個實用的 Eagle 外掛"
  },
  "ui": {
    "buttons": {
      "save": "儲存",
      "cancel": "取消",
      "export": "匯出"
    },
    "labels": {
      "quality": "品質",
      "format": "格式"
    }
  },
  "messages": {
    "success": "操作成功完成",
    "error": "發生錯誤"
  }
}
```

### 帶變數

```json
{
  "demo": {
    "selectedCount": "已選取 {{count}} 個項目",
    "exportProgress": "正在匯出 {{current}} / {{total}}...",
    "greeting": "你好，{{name}}！"
  }
}
```

### 巢狀存取

```tsx
// 使用點符號存取巢狀鍵
t('ui.buttons.save')      // "儲存"
t('messages.success')     // "操作成功完成"
```

## 變更語言

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

## 最佳實踐

### ✅ 建議

```tsx
// 所有面向使用者的文字都使用翻譯鍵
<button>{t('ui.buttons.save')}</button>

// 在鍵名中提供上下文
t('settings.theme.label')
t('settings.theme.description')

// 對動態內容使用變數
t('messages.itemCount', { count: items.length })

// 按功能組織翻譯
{
  "header": { ... },
  "sidebar": { ... },
  "settings": { ... }
}
```

### ❌ 避免

```tsx
// 不要硬編碼面向使用者的文字
<button>儲存</button>

// 不要串接翻譯字串
t('hello') + ' ' + t('world')  // 不同語言的詞序不同

// 不要將翻譯鍵用於內部邏輯
if (status === t('status.active')) { }  // 使用常數
```

## 相關資源

- [語言偵測](./language-detection) - 偵測策略
- [翻譯檔案](./translation-files) - 檔案格式和結構
