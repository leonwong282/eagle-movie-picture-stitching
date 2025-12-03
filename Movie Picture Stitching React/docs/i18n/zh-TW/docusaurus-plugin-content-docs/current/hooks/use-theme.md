---
sidebar_position: 3
title: useTheme
description: 與 Eagle 整合的主題管理 Hook
---

# useTheme

用於管理主題狀態並與 Eagle 整合的 Hook，支援亮色/暗色/自動模式，並與 Eagle 內建的主題系統同步。

## 匯入

```tsx
import { useTheme } from '@/hooks';
```

## 基本用法

```tsx
function ThemeToggle() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <Button onClick={toggleTheme} variant="ghost" size="icon">
      {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}
```

## 簽名

```tsx
const result = useTheme();
```

此 Hook 不接受參數。

## 回傳值

| 屬性 | 類型 | 說明 |
|----------|------|-------------|
| `theme` | `'light' \| 'dark' \| 'auto'` | 目前的主題偏好 |
| `isDarkMode` | `boolean` | 計算後的暗色模式狀態 |
| `setTheme` | `(theme: Theme) => void` | 設定主題偏好 |
| `toggleTheme` | `() => void` | 在亮色和暗色間切換 |

## 範例

### 簡單切換

```tsx
function ThemeButton() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <Button onClick={toggleTheme}>
      {isDarkMode ? '☀️ 亮色模式' : '🌙 暗色模式'}
    </Button>
  );
}
```

### 主題選擇器

```tsx
function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  return (
    <Select value={theme} onValueChange={setTheme}>
      <SelectTrigger className="w-32">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="light">
          <Sun className="mr-2 h-4 w-4 inline" />
          亮色
        </SelectItem>
        <SelectItem value="dark">
          <Moon className="mr-2 h-4 w-4 inline" />
          暗色
        </SelectItem>
        <SelectItem value="auto">
          <Monitor className="mr-2 h-4 w-4 inline" />
          系統
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
```

### 條件樣式

```tsx
function ThemedCard() {
  const { isDarkMode } = useTheme();

  return (
    <Card className={isDarkMode ? 'border-gray-700' : 'border-gray-200'}>
      <CardContent>
        <p>這張卡片會適應主題</p>
      </CardContent>
    </Card>
  );
}
```

### localStorage 持久化

主題會自動保存到 localStorage：

```tsx
function App() {
  const { theme } = useTheme();
  
  // 主題在頁面重新載入後會保留
  // 儲存為: localStorage.getItem('eagle-react-template:theme')
  
  return <div>目前: {theme}</div>;
}
```

## 主題解析

`isDarkMode` 的值是根據多個來源計算的：

```
┌─────────────────────────────────────────────────────┐
│  主題偏好: 'auto'                                   │
│         ↓                                           │
│  ┌─────────────────────────────────────────────┐   │
│  │  在 Eagle 中?                               │   │
│  │  ├─ 是 → 檢查 Eagle 主題                    │   │
│  │  │       (DARK, GRAY, BLUE, PURPLE = 暗色)  │   │
│  │  │       (LIGHT = 亮色)                     │   │
│  │  └─ 否 → 檢查系統偏好                       │   │
│  │          (prefers-color-scheme: dark)       │   │
│  └─────────────────────────────────────────────┘   │
│         ↓                                           │
│  isDarkMode: true/false                             │
└─────────────────────────────────────────────────────┘
```

### Eagle 主題對應

| Eagle 主題 | isDarkMode |
|-------------|------------|
| `LIGHT` | `false` |
| `DARK` | `true` |
| `GRAY` | `true` |
| `BLUE` | `true` |
| `PURPLE` | `true` |

## 運作方式

### DOM 類別管理

Hook 會自動將 `dark` 類別應用到文件根元素：

```tsx
// 當 isDarkMode 為 true 時
document.documentElement.classList.add('dark');

// 當 isDarkMode 為 false 時
document.documentElement.classList.remove('dark');
```

這可與 Tailwind 的暗色模式搭配使用：

```tsx
<div className="bg-white dark:bg-gray-900">
  內容會適應主題
</div>
```

### 事件監聽器

Hook 會監聽多個主題變更來源：

```typescript
// 系統偏好變更
window.matchMedia('(prefers-color-scheme: dark)')
  .addEventListener('change', handleChange);

// Eagle 主題變更（在 Eagle 中執行時）
window.addEventListener('eagle-theme-change', handleEagleTheme);
```

### 持久化

主題偏好會使用命名空間的鍵儲存在 localStorage：

```typescript
const STORAGE_KEY = 'eagle-react-template:theme';

// 變更時
localStorage.setItem(STORAGE_KEY, theme);

// 掛載時
const stored = localStorage.getItem(STORAGE_KEY);
```

## 與 Header 整合

範本的 Header 元件包含內建的主題切換：

```tsx
import { Header } from '@/components';

function App() {
  return (
    <div className="h-screen flex flex-col">
      <Header 
        title="我的外掛"
        showThemeToggle  // 包含主題切換按鈕
      />
      <main className="flex-1">
        {/* 內容 */}
      </main>
    </div>
  );
}
```

## 最佳實踐

### 應該做

- ✅ 使用 `isDarkMode` 進行條件樣式
- ✅ 對簡單切換按鈕使用 `toggleTheme`
- ✅ 對完整主題選擇器使用 `setTheme`
- ✅ 讓 Tailwind 的 `dark:` 變體處理大部分樣式
- ✅ 在開發期間測試兩種主題

### 不應該做

- ❌ 手動管理 `<html>` 上的 `dark` 類別
- ❌ 將主題偏好儲存在不同的鍵
- ❌ 在 Eagle 中執行時忽略 Eagle 的主題
- ❌ 對依賴主題的顏色使用行內樣式

## 搭配 Zustand 使用

對於複雜的應用程式，主題狀態也可透過 Zustand 取得：

```tsx
import { useSettings } from '@/stores';

function Component() {
  const { theme, toggleTheme } = useSettings();
  // 與 useTheme Hook 相同的 API
}
```

## CSS 變數

範本使用會回應主題的 CSS 變數：

```css
/* globals.css */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  /* ... */
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... */
}
```

在您的元件中使用這些：

```tsx
<div className="bg-background text-foreground">
  自動套用主題
</div>
```

## 相關

- [useLocalStorage](./use-local-storage) - 主題如何持久化
- [主題與 i18n](../core-concepts/theme-i18n) - 完整的主題指南
