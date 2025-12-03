---
sidebar_position: 3
title: 深色模式
description: 主題切換實作
---

# 深色模式

此模板支援淺色、深色和系統偏好主題，使用 Tailwind 基於類別的深色模式策略。

## 概覽

| 功能 | 實作 |
|------|------|
| 策略 | 基於類別（`<html>` 上的 `.dark`） |
| 模式 | 淺色、深色、自動（系統） |
| 持久化 | localStorage |
| Eagle 整合 | 與 Eagle 主題同步 |

## 運作方式

```
┌─────────────────────────────────────────────────────────────────┐
│                      主題偵測流程                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. 檢查 localStorage 中的使用者偏好                            │
│           ↓                                                     │
│  2. 如果是 'auto'，透過 eagleApi.isDarkMode 檢查 Eagle 主題     │
│           ↓                                                     │
│  3. 回退到系統偏好（prefers-color-scheme）                      │
│           ↓                                                     │
│  4. 將 .dark 類別套用到 <html> 元素                             │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 設定

### Tailwind 設定

```js
// tailwind.config.js
module.exports = {
  darkMode: 'class',  // 使用 .dark 類別策略
  // ...
};
```

### CSS 變數

```css
/* src/styles/globals.css */

/* 淺色模式（預設） */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  /* ... */
}

/* 深色模式 */
.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... */
}
```

## useTheme Hook

`useTheme` hook 提供主題狀態和控制：

```tsx
import { useTheme } from '@/hooks';

function ThemeToggle() {
  const { theme, setTheme, isDarkMode, toggleTheme } = useTheme();
  
  return (
    <div>
      <p>目前主題：{theme}</p>
      <p>是否深色：{isDarkMode ? '是' : '否'}</p>
      
      <button onClick={toggleTheme}>
        切換主題
      </button>
      
      {/* 或明確控制 */}
      <button onClick={() => setTheme('light')}>淺色</button>
      <button onClick={() => setTheme('dark')}>深色</button>
      <button onClick={() => setTheme('auto')}>自動</button>
    </div>
  );
}
```

### Hook API

```tsx
interface UseThemeReturn {
  theme: 'light' | 'dark' | 'auto';  // 目前設定
  setTheme: (theme: Theme) => void;   // 變更主題
  isDarkMode: boolean;                 // 計算的深色模式狀態
  toggleTheme: () => void;             // 循環切換主題
}
```

## 實作

### Theme Provider

```tsx
// src/lib/theme.ts
const STORAGE_KEY = 'eagle-react-template:theme';

export type Theme = 'light' | 'dark' | 'auto';

export function getStoredTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark' || stored === 'auto') {
    return stored;
  }
  return 'auto';
}

export function setStoredTheme(theme: Theme): void {
  localStorage.setItem(STORAGE_KEY, theme);
}

export function getSystemTheme(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

export function getEagleTheme(): 'light' | 'dark' {
  // eagleApi.isDarkMode 檢查 Eagle 的主題設定
  return eagleApi.isDarkMode ? 'dark' : 'light';
}

export function resolveTheme(theme: Theme): 'light' | 'dark' {
  if (theme === 'auto') {
    // 在 Eagle 中，優先使用 Eagle 的主題
    if (isEagleEnvironment()) {
      return getEagleTheme();
    }
    // 在瀏覽器中，使用系統偏好
    return getSystemTheme();
  }
  return theme;
}

export function applyTheme(theme: Theme): void {
  const resolved = resolveTheme(theme);
  
  if (resolved === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}
```

### useTheme Hook 實作

```tsx
// src/hooks/use-theme.ts
import { useState, useEffect, useCallback } from 'react';
import { 
  Theme, 
  getStoredTheme, 
  setStoredTheme, 
  applyTheme,
  resolveTheme 
} from '@/lib/theme';

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(getStoredTheme);

  // 掛載時和變更時套用主題
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // 監聽系統偏好變更
  useEffect(() => {
    if (theme !== 'auto') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => applyTheme('auto');
    
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [theme]);

  const setTheme = useCallback((newTheme: Theme) => {
    setStoredTheme(newTheme);
    setThemeState(newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    const themes: Theme[] = ['light', 'dark', 'auto'];
    const currentIndex = themes.indexOf(theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    setTheme(nextTheme);
  }, [theme, setTheme]);

  const isDarkMode = resolveTheme(theme) === 'dark';

  return {
    theme,
    setTheme,
    isDarkMode,
    toggleTheme,
  };
}
```

## 使用深色模式樣式

### 使用 Tailwind 類別

```tsx
// 文字顏色
<p className="text-gray-900 dark:text-gray-100">
<p className="text-foreground">  {/* 語意化 - 建議使用 */}

// 背景顏色
<div className="bg-white dark:bg-gray-900">
<div className="bg-background">  {/* 語意化 - 建議使用 */}

// 邊框
<div className="border-gray-200 dark:border-gray-700">
<div className="border-border">  {/* 語意化 - 建議使用 */}

// 陰影（深色模式通常減少）
<div className="shadow-lg dark:shadow-none">
<div className="shadow-lg dark:shadow-2xl dark:shadow-black/25">
```

### 條件式渲染

```tsx
function Icon() {
  const { isDarkMode } = useTheme();
  
  return isDarkMode ? <MoonIcon /> : <SunIcon />;
}
```

### 純 CSS 深色模式

```tsx
// 使用 CSS 變數 - 不需要 JS
<div className="bg-background text-foreground">
  內容自動適應
</div>
```

## 主題選擇器元件

```tsx
import { useTheme } from '@/hooks';
import { Button } from '@/components/ui';
import { Sun, Moon, Monitor } from 'lucide-react';

const themes = [
  { value: 'light', label: '淺色', icon: Sun },
  { value: 'dark', label: '深色', icon: Moon },
  { value: 'auto', label: '系統', icon: Monitor },
] as const;

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  
  return (
    <div className="flex gap-1 p-1 bg-muted rounded-lg">
      {themes.map(({ value, label, icon: Icon }) => (
        <Button
          key={value}
          variant={theme === value ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setTheme(value)}
          aria-label={label}
        >
          <Icon className="h-4 w-4" />
        </Button>
      ))}
    </div>
  );
}
```

## Eagle 主題同步

與 Eagle 的主題設定同步：

```tsx
// 偵測 Eagle 主題變更
useEffect(() => {
  if (!isEagleEnvironment()) return;
  
  // 外掛開啟時 Eagle 可能會變更主題
  const interval = setInterval(() => {
    if (theme === 'auto') {
      applyTheme('auto');  // 重新評估 Eagle 主題
    }
  }, 1000);
  
  return () => clearInterval(interval);
}, [theme]);
```

### Eagle 主題值

```tsx
// eagleApi.app.theme 回傳以下之一：
type EagleTheme = 'LIGHT' | 'LIGHTGRAY' | 'GRAY' | 'DARK' | 'BLUE' | 'PURPLE';

// 深色主題：GRAY、DARK、BLUE、PURPLE
// 淺色主題：LIGHT、LIGHTGRAY

// isDarkMode 計算方式：
const isDarkMode = ['GRAY', 'DARK', 'BLUE', 'PURPLE'].includes(eagleTheme);
```

## 防止閃爍

防止頁面載入時的主題閃爍：

```html
<!-- index.html - 在 body 之前新增腳本 -->
<script>
  (function() {
    const stored = localStorage.getItem('eagle-react-template:theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    let isDark = false;
    if (stored === 'dark') isDark = true;
    else if (stored === 'light') isDark = false;
    else isDark = prefersDark;  // 'auto' 或未設定
    
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
  })();
</script>
```

## 測試深色模式

```tsx
// Vitest/Jest 測試
describe('深色模式', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });
  
  test('主題為深色時套用 dark 類別', () => {
    const { result } = renderHook(() => useTheme());
    
    act(() => {
      result.current.setTheme('dark');
    });
    
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });
  
  test('主題為淺色時移除 dark 類別', () => {
    document.documentElement.classList.add('dark');
    
    const { result } = renderHook(() => useTheme());
    
    act(() => {
      result.current.setTheme('light');
    });
    
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });
});
```

## 最佳實踐

### ✅ 建議

```tsx
// 使用語意化顏色
<div className="bg-background text-foreground">

// 使用 CSS 變數實現自動切換
<div className="bg-card border-border">

// 提供所有三個主題選項
<ThemeSelector options={['light', 'dark', 'auto']} />

// 測試兩種主題
test.each(['light', 'dark'])('在 %s 模式下渲染', (mode) => {
  // ...
});
```

### ❌ 避免

```tsx
// 避免硬編碼顏色
<div className="bg-white text-black">  {/* 無法適應深色模式 */}

// 避免為每個元素檢查主題
{isDarkMode ? (
  <div className="bg-gray-900">...</div>
) : (
  <div className="bg-white">...</div>
)}
// 改用：<div className="bg-background">

// 不要忘記深色模式中的聚焦/環狀態
<button className="focus:ring-2">
// 新增：focus:ring-ring 以獲得正確顏色
```

## 相關資源

- [樣式概覽](./overview) - 架構概覽
- [設計標記](./design-tokens) - 顏色系統
- [useTheme Hook](../hooks/use-theme) - Hook API 參考
