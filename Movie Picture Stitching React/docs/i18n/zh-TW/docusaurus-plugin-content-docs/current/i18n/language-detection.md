---
sidebar_position: 2
title: 語言偵測
description: 自動語言偵測策略
---

# 語言偵測

此模板根據多個來源自動偵測並套用適當的語言，優先使用 Eagle 的設定。

## 偵測優先順序

```
┌──────────────────────────────────────────────────────────────┐
│                      語言偵測鏈                               │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  1. window.i18next.language                         │    │
│  │     Eagle 內建的 i18next 實例                       │    │
│  │     可用時最準確                                    │    │
│  └───────────────────┬─────────────────────────────────┘    │
│                      │ 如果未定義                           │
│  ┌───────────────────▼─────────────────────────────────┐    │
│  │  2. eagleApi.locale                                 │    │
│  │     Eagle 外掛 API 的語言屬性                       │    │
│  │     回傳 'en'、'zh_CN'、'zh_TW' 等                  │    │
│  └───────────────────┬─────────────────────────────────┘    │
│                      │ 如果無法使用                         │
│  ┌───────────────────▼─────────────────────────────────┐    │
│  │  3. navigator.language                              │    │
│  │     瀏覽器的語言設定                                │    │
│  │     在瀏覽器開發模式下使用                          │    │
│  └───────────────────┬─────────────────────────────────┘    │
│                      │ 如果不支援                           │
│  ┌───────────────────▼─────────────────────────────────┐    │
│  │  4. 回退：'en'                                       │    │
│  │     英文作為預設                                    │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

## 偵測實作

### 主要偵測函式

```tsx
// src/lib/i18n.ts

export function detectLanguage(): string {
  // 優先順序 1：Eagle 的 i18next
  if (typeof window !== 'undefined' && window.i18next?.language) {
    const lang = window.i18next.language;
    console.log('[i18n] 從 Eagle i18next 偵測到：', lang);
    return normalizeLanguage(lang);
  }
  
  // 優先順序 2：Eagle API 語言
  try {
    const eagleLocale = eagleApi.locale;
    if (eagleLocale && eagleLocale !== 'en') {
      console.log('[i18n] 從 Eagle API 偵測到：', eagleLocale);
      return normalizeLanguage(eagleLocale);
    }
  } catch (error) {
    console.log('[i18n] Eagle API 無法使用');
  }
  
  // 優先順序 3：瀏覽器語言
  if (typeof navigator !== 'undefined' && navigator.language) {
    console.log('[i18n] 從瀏覽器偵測到：', navigator.language);
    return normalizeLanguage(navigator.language);
  }
  
  // 優先順序 4：回退
  console.log('[i18n] 使用回退：en');
  return 'en';
}
```

### 語言正規化

不同來源回傳不同格式。正規化將它們對應到我們的語言代碼：

```tsx
const LANGUAGE_MAP: Record<string, string> = {
  // 中文變體
  'zh': 'zh_CN',
  'zh-CN': 'zh_CN',
  'zh-Hans': 'zh_CN',
  'zh-Hans-CN': 'zh_CN',
  'zh-TW': 'zh_TW',
  'zh-Hant': 'zh_TW',
  'zh-Hant-TW': 'zh_TW',
  'zh-HK': 'zh_TW',
  
  // 日文
  'ja': 'ja_JP',
  'ja-JP': 'ja_JP',
  
  // 韓文
  'ko': 'ko_KR',
  'ko-KR': 'ko_KR',
  
  // 德文
  'de': 'de_DE',
  'de-DE': 'de_DE',
  'de-AT': 'de_DE',
  'de-CH': 'de_DE',
  
  // 西班牙文
  'es': 'es_ES',
  'es-ES': 'es_ES',
  'es-MX': 'es_ES',
  'es-AR': 'es_ES',
  
  // 俄文
  'ru': 'ru_RU',
  'ru-RU': 'ru_RU',
  
  // 英文（明確對應）
  'en': 'en',
  'en-US': 'en',
  'en-GB': 'en',
  'en-AU': 'en',
};

const SUPPORTED_LANGUAGES = ['en', 'zh_CN', 'zh_TW', 'ja_JP', 'ko_KR', 'de_DE', 'es_ES', 'ru_RU'];

function normalizeLanguage(lang: string): string {
  // 直接匹配我們支援的語言
  if (SUPPORTED_LANGUAGES.includes(lang)) {
    return lang;
  }
  
  // 檢查對應表
  if (LANGUAGE_MAP[lang]) {
    return LANGUAGE_MAP[lang];
  }
  
  // 嘗試基本語言代碼
  const baseCode = lang.split('-')[0].split('_')[0];
  if (LANGUAGE_MAP[baseCode]) {
    return LANGUAGE_MAP[baseCode];
  }
  
  // 回退到英文
  return 'en';
}
```

## 執行階段語言同步

### useLanguageSync Hook

當 Eagle 的設定變更時同步語言：

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

    // 定期檢查語言變更
    const checkLanguage = () => {
      const currentLocale = normalizeLanguage(eagleApi.locale);
      if (currentLocale !== i18n.language) {
        console.log('[i18n] 語言已變更為：', currentLocale);
        i18n.changeLanguage(currentLocale);
      }
    };

    // 外掛顯示時檢查
    eagleApi.onPluginShow(checkLanguage);

    // 可見性變更時檢查
    const handleVisibility = () => {
      if (!document.hidden) {
        checkLanguage();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    // 監視 HTML lang 屬性變更
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

    // 備援：定期檢查
    const interval = setInterval(checkLanguage, 10000);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      observer.disconnect();
      clearInterval(interval);
    };
  }, [i18n]);
}
```

### 使用方式

```tsx
// src/App.tsx
import { useLanguageSync } from '@/hooks/use-language-sync';

function App() {
  // 與 Eagle 同步語言
  useLanguageSync();
  
  return (
    <div>
      {/* 應用程式內容 */}
    </div>
  );
}
```

## 瀏覽器開發

在瀏覽器開發模式下，模板使用 `navigator.language`：

```tsx
// Eagle API 無法使用時的模擬行為
if (!isEagleEnvironment()) {
  // 使用瀏覽器的語言設定
  const browserLang = navigator.language;  // 例如 'en-US'、'zh-CN'
  const normalizedLang = normalizeLanguage(browserLang);
  i18n.changeLanguage(normalizedLang);
}
```

### 測試不同語言

```tsx
// 在瀏覽器主控台中手動變更語言：
window.i18n.changeLanguage('zh_CN');
window.i18n.changeLanguage('ja_JP');

// 或使用 URL 參數（如果已實作）：
// http://localhost:5173/?lang=zh_CN
```

## Eagle 語言值

Eagle API 回傳這些語言代碼：

| Eagle 語言 | 模板對應 |
|------------|----------|
| `en` | `en` |
| `zh_CN` | `zh_CN` |
| `zh_TW` | `zh_TW` |
| `ja_JP` | `ja_JP` |
| `ko_KR` | `ko_KR` |
| `de_DE` | `de_DE` |
| `es_ES` | `es_ES` |
| `ru_RU` | `ru_RU` |

## 除錯語言偵測

```tsx
// 新增到你的應用程式以進行除錯
useEffect(() => {
  console.group('語言偵測除錯');
  console.log('window.i18next?.language:', window.i18next?.language);
  console.log('eagleApi.locale:', eagleApi.locale);
  console.log('navigator.language:', navigator.language);
  console.log('解析的語言:', i18n.language);
  console.groupEnd();
}, [i18n.language]);
```

## 處理偵測失敗

```tsx
// 帶使用者通知的優雅回退
function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { i18n, t } = useTranslation();
  const [detectionFailed, setDetectionFailed] = useState(false);

  useEffect(() => {
    const detected = detectLanguage();
    
    // 如果偵測結果在不應該回退時回退了
    if (detected === 'en' && isEagleEnvironment()) {
      const eagleLocale = eagleApi.locale;
      if (eagleLocale && eagleLocale !== 'en') {
        console.warn('語言偵測可能失敗');
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

## 最佳實踐

### ✅ 建議

```tsx
// 儘早初始化 i18n
// 在 main.tsx 中：
import './lib/i18n';  // 在 App 匯入之前

// 在應用程式根目錄使用同步 hook
function App() {
  useLanguageSync();
  // ...
}

// 記錄偵測以進行除錯
console.log('[i18n] 偵測到：', detectLanguage());

// 處理所有支援的語言
const SUPPORTED = ['en', 'zh_CN', 'zh_TW', 'ja_JP', 'ko_KR', 'de_DE', 'es_ES', 'ru_RU'];
```

### ❌ 避免

```tsx
// 不要假設 Eagle API 總是可用
const lang = eagleApi.locale;  // 可能拋出錯誤

// 不要忘記正規化
i18n.changeLanguage(navigator.language);  // 'en-US' 不在資源中！

// 不要在每次渲染時偵測
function Component() {
  detectLanguage();  // 移到 effect 或初始化
}
```

## 相關資源

- [i18n 概覽](./overview) - 設定和使用
- [翻譯檔案](./translation-files) - 檔案格式和結構
