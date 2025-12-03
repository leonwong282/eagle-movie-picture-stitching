---
sidebar_position: 1
title: 概覽
description: Tailwind CSS 樣式架構
---

# 樣式概覽

此模板使用 **Tailwind CSS** 進行樣式設計，結合 **CSS 變數** 進行主題設定和 **class-variance-authority (CVA)** 處理元件變體。

## 技術堆疊

| 工具 | 用途 |
|------|------|
| **Tailwind CSS 3** | 工具優先的樣式設計 |
| **CSS Variables** | 設計標記與主題 |
| **CVA** | 類型安全的元件變體 |
| **clsx/cn** | 條件式類別合併 |
| **PostCSS** | CSS 處理 |

## 設計理念

### 工具優先

直接在元件中使用 Tailwind 工具類別：

```tsx
// ✅ Tailwind 工具類別
<div className="flex items-center gap-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
  <span className="text-sm font-medium">標籤</span>
</div>

// ❌ 自訂 CSS 類別
<div className="card-container">
  <span className="card-label">標籤</span>
</div>
```

### 使用 CVA 的元件變體

使用 CVA 建立可重用的元件樣式：

```tsx
import { cva } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);
```

### 透過 CSS 變數的設計標記

主題值定義為 CSS 變數：

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --primary: 217.2 91.2% 59.8%;
}
```

## 檔案結構

```
src/
├── styles/
│   └── globals.css         # CSS 變數、基礎樣式、工具類別
├── lib/
│   └── utils.ts            # cn() 類別合併輔助函式
├── components/
│   └── ui/
│       └── Button.tsx      # 基於 CVA 的元件
├── tailwind.config.js      # Tailwind 設定
└── postcss.config.js       # PostCSS 外掛
```

## 快速參考

### 使用 cn() 合併類別

```tsx
import { cn } from '@/lib/utils';

// 合併類別並支援覆蓋
<div className={cn(
  'base-classes',
  isActive && 'active-classes',
  className
)} />
```

### 常見模式

```tsx
// Flex 佈局
<div className="flex items-center justify-between gap-4">

// Grid 佈局
<div className="grid grid-cols-3 gap-4">

// 響應式
<div className="p-2 md:p-4 lg:p-6">

// 深色模式
<div className="bg-white dark:bg-gray-900">

// 懸停/聚焦狀態
<button className="hover:bg-gray-100 focus:ring-2">

// 過渡效果
<div className="transition-colors duration-200">
```

### 顏色使用

```tsx
// 語意化顏色（建議使用）
<div className="bg-background text-foreground">
<button className="bg-primary text-primary-foreground">
<span className="text-muted-foreground">

// 直接顏色（需要時使用）
<div className="bg-emerald-500 text-white">
```

## 設定檔

### tailwind.config.js

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        // ... 更多語意化顏色
      },
      // ... 更多擴展
    },
  },
  plugins: [require('tailwindcss-animate')],
};
```

### postcss.config.js

```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

## 核心概念

| 概念 | 文件 |
|------|------|
| 設計標記 | [設計標記 →](./design-tokens) |
| 深色模式 | [深色模式 →](./dark-mode) |
| 動畫 | [動畫 →](./animations) |

## 最佳實踐

### ✅ 建議

```tsx
// 使用語意化顏色名稱
className="bg-primary text-primary-foreground"

// 使用間距比例
className="p-4 gap-2 mt-6"

// 響應式行動優先
className="text-sm md:text-base lg:text-lg"

// 分組相關的工具類別
className={cn(
  // 佈局
  'flex items-center gap-4',
  // 外觀
  'bg-white dark:bg-gray-800 rounded-lg',
  // 間距
  'p-4',
)}
```

### ❌ 避免

```tsx
// 有比例時避免任意值
className="p-[17px]"  // 改用 p-4

// 避免內聯樣式
style={{ marginTop: 16 }}  // 改用 mt-4

// 避免 !important 覆蓋
className="!bg-red-500"

// 避免深度巢狀的自訂 CSS
.card .header .title { }
```

## 相關資源

- [設計標記](./design-tokens) - 顏色和間距系統
- [深色模式](./dark-mode) - 主題切換實作
- [動畫](./animations) - 動態效果和過渡
