---
sidebar_position: 5
title: useLanguageSync
description: 事件驅動的 Hook，用於同步 i18n 與 Eagle 的語系設定
---

# useLanguageSync

事件驅動的 Hook，將 i18next 語言與 Eagle 的語系設定同步，具有智慧的備用輪詢功能以處理邊緣情況。

## 匯入

```tsx
import { useLanguageSync } from '@/hooks';
```

## 基本用法

```tsx
function App() {
  // 自動將 i18next 與 Eagle 的語系同步
  useLanguageSync();

  return (
    <div>
      <h1>{t('app.title')}</h1>
    </div>
  );
}
```

## 簽名

```tsx
const result = useLanguageSync(options?: UseLanguageSyncOptions);
```

## 選項

| 選項 | 類型 | 預設值 | 說明 |
|--------|------|---------|-------------|
| `autoSetup` | `boolean` | `true` | 掛載時自動設定監聽器 |
| `enablePolling` | `boolean` | 在 Eagle 中為 `true` | 啟用備用輪詢 |
| `pollingInterval` | `number` | `10000` | 輪詢間隔（10 秒） |

## 回傳值

| 屬性 | 類型 | 說明 |
|----------|------|-------------|
| `language` | `string` | 目前的語言代碼（例如 'en'、'zh_CN'） |
| `isListening` | `boolean` | 事件監聽器是否活動 |
| `setLanguage` | `(lang: string) => Promise<void>` | 手動變更語言 |
| `detectLanguage` | `() => void` | 強制從 Eagle 重新偵測 |
| `startListening` | `() => void` | 開始事件監聽器 |
| `stopListening` | `() => void` | 停止事件監聽器 |

## 範例

### 基本自動同步

```tsx
function App() {
  // 最常見的用法 - 只需自動同步
  useLanguageSync();

  return <TranslatedContent />;
}
```

### 存取目前語言

```tsx
function LanguageDisplay() {
  const { language } = useLanguageSync();

  return (
    <span className="text-sm text-muted-foreground">
      目前: {language}
    </span>
  );
}
```

### 手動語言選擇

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

### 強制重新偵測

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

### 手動控制

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
      <p>語言: {language}</p>
      <p>監聽中: {isListening ? '是' : '否'}</p>
      <Button onClick={startListening}>開始</Button>
      <Button onClick={stopListening}>停止</Button>
    </div>
  );
}
```

## 支援的語言

範本開箱即支援 8 種語言：

| 代碼 | 語言 | Eagle 語系 |
|------|----------|--------------|
| `en` | 英文 | `en` |
| `zh_CN` | 簡體中文 | `zh_CN` |
| `zh_TW` | 繁體中文 | `zh_TW` |
| `ja_JP` | 日文 | `ja_JP` |
| `ko_KR` | 韓文 | `ko_KR` |
| `de_DE` | 德文 | `de_DE` |
| `es_ES` | 西班牙文 | `es_ES` |
| `ru_RU` | 俄文 | `ru_RU` |

## 語言偵測流程

Hook 使用多種策略來偵測目前語言：

```
┌─────────────────────────────────────────────────────┐
│  1. 檢查 window.i18next.language                    │
│     (Eagle 內建的 i18next 實例)                     │
│         ↓                                           │
│  2. 檢查 eagleApi.locale                            │
│     (Eagle 的語系設定)                              │
│         ↓                                           │
│  3. 檢查 navigator.language                         │
│     (瀏覽器的語言)                                  │
│         ↓                                           │
│  4. 預設為 'en'                                     │
└─────────────────────────────────────────────────────┘
```

### 瀏覽器語言對應

瀏覽器語言代碼會對應到 Eagle 語系代碼：

```typescript
const langMap = {
  'zh': 'zh_CN',      // zh → 簡體中文
  'zh-CN': 'zh_CN',
  'zh-TW': 'zh_TW',   // zh-TW → 繁體中文
  'zh-HK': 'zh_TW',
  'ja': 'ja_JP',
  'ko': 'ko_KR',
  'de': 'de_DE',
  'es': 'es_ES',
  'ru': 'ru_RU',
};
```

## 事件驅動更新

Hook 會監聽多個語言變更事件：

### 1. 外掛可見性事件

```typescript
// 當外掛變為可見時
window.addEventListener('plugin-show', detectLanguage);
document.addEventListener('visibilitychange', detectLanguage);
```

### 2. HTML Lang 屬性變更

```typescript
// 對 <html lang="..."> 的 MutationObserver
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

### 3. 備用輪詢

當事件偵測不可靠時（罕見的邊緣情況）：

```typescript
// 每 10 秒輪詢作為備用
setInterval(detectLanguage, 10000);
```

## 與 i18next 整合

Hook 與範本的 i18next 設定整合：

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

// 在 App.tsx 中
function App() {
  useLanguageSync(); // 保持 i18next 與 Eagle 同步
  
  return (
    <div>
      <h1>{t('app.title')}</h1>
    </div>
  );
}
```

## 最佳實踐

### 應該做

- ✅ 在應用程式根層級呼叫一次 `useLanguageSync()`
- ✅ 對所有文字使用 react-i18next 的 `t()`
- ✅ 將翻譯檔案保存在 `_locales/` 目錄
- ✅ 使用不同的 Eagle 語系設定進行測試
- ✅ 為缺少的翻譯提供備用文字

### 不應該做

- ❌ 在多個元件中呼叫 `useLanguageSync()`
- ❌ 在元件中硬編碼文字字串
- ❌ 直接透過 i18next 變更語言（使用 `setLanguage`）
- ❌ 在沒有測試事件偵測的情況下停用輪詢

## 除錯

檢查目前的語言偵測：

```javascript
// 在瀏覽器主控台中
console.log('i18next 語言:', i18next.language);
console.log('Eagle 語系:', eagleApi.locale);
console.log('Navigator 語言:', navigator.language);
```

## 翻譯檔案

翻譯檔案位於 `_locales/`：

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

結構：

```json
{
  "app": {
    "title": "Eagle 外掛",
    "description": "說明文字"
  },
  "buttons": {
    "save": "儲存",
    "cancel": "取消"
  }
}
```

使用方式：

```tsx
const { t } = useTranslation();

<h1>{t('app.title')}</h1>
<Button>{t('buttons.save')}</Button>
```

## 相關

- [核心概念：主題與 i18n](../core-concepts/theme-i18n) - 完整的 i18n 設定指南
- [Hooks 總覽](./overview) - 所有可用的 Hooks
