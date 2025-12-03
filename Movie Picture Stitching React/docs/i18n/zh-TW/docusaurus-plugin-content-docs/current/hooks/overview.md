---
sidebar_position: 1
title: Hooks 總覽
description: 用於 Eagle 外掛開發的自訂 React Hooks
---

# Hooks 總覽

Eagle React Template 提供 **4 個自訂 Hooks**，專為 Eagle 外掛開發設計。這些 Hooks 處理常見模式，如選取追蹤、主題管理、持久化儲存和國際化。

## 快速參考

| Hook | 用途 | 關鍵功能 |
|------|---------|-------------|
| [`useEagleSelection`](./use-eagle-selection) | 追蹤 Eagle 中選取的項目 | 基於雜湊的輪詢變更偵測 |
| [`useTheme`](./use-theme) | 管理亮色/暗色主題 | 與 Eagle 主題系統同步 |
| [`useLocalStorage`](./use-local-storage) | 將狀態持久化到 localStorage | 防抖寫入與驗證 |
| [`useLanguageSync`](./use-language-sync) | 同步 i18n 與 Eagle 語系 | 事件驅動，帶備用輪詢 |

## 匯入

所有 Hooks 都從 `@/hooks` barrel 匯出：

```tsx
import { 
  useEagleSelection,
  useTheme,
  useLocalStorage,
  useLanguageSync,
} from '@/hooks';
```

## 設計原則

### 1. 雙環境相容性

所有 Hooks 都可在瀏覽器開發和 Eagle 執行時運作：

```tsx
// 在瀏覽器（模擬資料）和 Eagle（真實資料）中都能運作
const { items } = useEagleSelection();
```

### 2. 效能最佳化

- **基於雜湊的變更偵測** - 只有在資料實際改變時才更新狀態
- **防抖寫入** - 防止過度的 localStorage 操作
- **可見性感知** - 當外掛隱藏時暫停輪詢

### 3. TypeScript 優先

在適當的地方使用泛型，提供完整的類型安全：

```tsx
// 類型安全的儲存
const [settings, setSettings] = useLocalStorage<Settings>('settings', defaultSettings);
```

## 何時使用各個 Hook

### useEagleSelection

當您需要：
- 顯示 Eagle 中目前選取的項目
- 即時回應選取變更
- 存取項目中繼資料（名稱、路徑、尺寸、標籤）

```tsx
function Gallery() {
  const { items, isLoading } = useEagleSelection();
  return <ImageGrid items={items} />;
}
```

### useTheme

當您需要：
- 在亮色和暗色主題間切換
- 與 Eagle 內建的主題系統同步
- 跨工作階段保留主題偏好

```tsx
function ThemeToggle() {
  const { isDarkMode, toggleTheme } = useTheme();
  return <Button onClick={toggleTheme}>{isDarkMode ? '☀️' : '🌙'}</Button>;
}
```

### useLocalStorage

當您需要：
- 保留使用者偏好
- 快取昂貴的計算
- 在工作階段間儲存表單狀態

```tsx
function Settings() {
  const [prefs, setPrefs] = useLocalStorage('prefs', { quality: 80 });
  return <Slider value={prefs.quality} onChange={(v) => setPrefs({ ...prefs, quality: v })} />;
}
```

### useLanguageSync

當您需要：
- 保持 i18n 與 Eagle 語系同步
- 無需重新整理即可回應語言變更
- 支援 Eagle 的 8 種內建語言

```tsx
function App() {
  useLanguageSync(); // 自動將 i18next 與 Eagle 同步
  return <TranslatedContent />;
}
```

## Hooks vs Zustand Store

對於簡單的使用情境，Hooks 就足夠了。對於許多元件共享的複雜狀態，請考慮使用 Zustand store：

| 情境 | 建議 |
|----------|----------------|
| 單一元件需要選取 | `useEagleSelection` |
| 多個元件共享選取狀態 | Zustand `useSelection()` |
| 簡單的主題切換 | `useTheme` |
| 深層巢狀元件中的主題 | Zustand `useSettings()` |

## 常見模式

### 組合多個 Hooks

```tsx
function SmartGallery() {
  const { items, isLoading } = useEagleSelection();
  const { isDarkMode } = useTheme();
  const [viewMode, setViewMode] = useLocalStorage('viewMode', 'grid');

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <ViewToggle mode={viewMode} onChange={setViewMode} />
      {isLoading ? <Spinner /> : <ImageGrid items={items} mode={viewMode} />}
    </div>
  );
}
```

### 錯誤處理

```tsx
function SafeGallery() {
  const { items, error, refresh } = useEagleSelection();

  if (error) {
    return (
      <ErrorFallback 
        error={error} 
        resetErrorBoundary={refresh} 
      />
    );
  }

  return <ImageGrid items={items} />;
}
```

## 相關

- [核心概念：雙環境](../core-concepts/dual-environment) - 了解瀏覽器 vs Eagle 執行時
- [核心概念：Eagle API 適配器](../core-concepts/eagle-api-adapter) - Hooks 如何存取 Eagle
