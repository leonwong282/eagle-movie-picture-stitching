---
sidebar_position: 2
title: 設計標記
description: CSS 變數和語意化顏色系統
---

# 設計標記

設計標記是設計系統中的視覺設計原子 — 具體而言，它們是使用 CSS 變數儲存視覺設計屬性的具名實體。

## 標記架構

```
┌─────────────────────────────────────────────────────────────────┐
│                      設計標記層級                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                     語意化標記                            │   │
│  │  background, foreground, primary, secondary, muted       │   │
│  └────────────────────────┬─────────────────────────────────┘   │
│                           │ 參考                                │
│  ┌────────────────────────▼─────────────────────────────────┐   │
│  │                      HSL 值                               │   │
│  │  --primary: 221.2 83.2% 53.3%                            │   │
│  └────────────────────────┬─────────────────────────────────┘   │
│                           │ 使用於                              │
│  ┌────────────────────────▼─────────────────────────────────┐   │
│  │                  Tailwind 設定                            │   │
│  │  primary: 'hsl(var(--primary))'                          │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 顏色標記

### 核心顏色

定義於 `src/styles/globals.css`：

```css
:root {
  /* 背景 */
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;

  /* 卡片/面板背景 */
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;

  /* 彈出視窗/下拉選單 */
  --popover: 0 0% 100%;
  --popover-foreground: 222.2 84% 4.9%;

  /* 主要操作顏色 */
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;

  /* 次要/低調操作 */
  --secondary: 210 40% 96.1%;
  --secondary-foreground: 222.2 47.4% 11.2%;

  /* 柔和/停用狀態 */
  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;

  /* 強調/高亮 */
  --accent: 210 40% 96.1%;
  --accent-foreground: 222.2 47.4% 11.2%;

  /* 破壞性操作 */
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;

  /* 邊框和輸入框 */
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 221.2 83.2% 53.3%;
}
```

### 深色模式顏色

```css
.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;

  --card: 222.2 84% 4.9%;
  --card-foreground: 210 40% 98%;

  --popover: 222.2 84% 4.9%;
  --popover-foreground: 210 40% 98%;

  --primary: 217.2 91.2% 59.8%;
  --primary-foreground: 222.2 47.4% 11.2%;

  --secondary: 217.2 32.6% 17.5%;
  --secondary-foreground: 210 40% 98%;

  --muted: 217.2 32.6% 17.5%;
  --muted-foreground: 215 20.2% 65.1%;

  --accent: 217.2 32.6% 17.5%;
  --accent-foreground: 210 40% 98%;

  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 210 40% 98%;

  --border: 217.2 32.6% 17.5%;
  --input: 217.2 32.6% 17.5%;
  --ring: 224.3 76.3% 48%;
}
```

## HSL 格式

標記使用不含 `hsl()` 包裝的 HSL 值以提供靈活性：

```css
/* 標記定義 */
--primary: 221.2 83.2% 53.3%;

/* 使用時搭配不透明度 */
background: hsl(var(--primary));           /* 完全不透明 */
background: hsl(var(--primary) / 0.5);     /* 50% 不透明 */
```

這允許 Tailwind 的不透明度修飾符：

```tsx
// 完全不透明
<div className="bg-primary">

// 使用不透明度修飾符
<div className="bg-primary/50">
<div className="bg-primary/10">
```

## Tailwind 整合

### 設定

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
    },
  },
};
```

### 在元件中使用

```tsx
// 背景顏色
<div className="bg-background">        {/* 主背景 */}
<div className="bg-card">              {/* 卡片背景 */}
<div className="bg-popover">           {/* 彈出視窗背景 */}
<div className="bg-muted">             {/* 柔和/停用背景 */}

// 文字顏色
<p className="text-foreground">        {/* 主要文字 */}
<p className="text-muted-foreground">  {/* 次要文字 */}
<p className="text-primary">           {/* 主色文字 */}

// 邊框顏色
<div className="border-border">        {/* 預設邊框 */}
<input className="border-input">       {/* 輸入框邊框 */}

// 互動狀態
<button className="bg-primary text-primary-foreground">
<button className="bg-secondary text-secondary-foreground">
<button className="bg-destructive text-destructive-foreground">
```

## 間距標記

使用 Tailwind 的預設間距比例：

| 標記 | 值 | 用途 |
|------|------|------|
| `0` | 0px | 重設 |
| `0.5` | 2px | 極小間隙 |
| `1` | 4px | 小間隙 |
| `2` | 8px | 預設間隙 |
| `3` | 12px | 中間隙 |
| `4` | 16px | 大間隙 |
| `6` | 24px | 區段間距 |
| `8` | 32px | 主要間距 |

```tsx
// 內距
<div className="p-4">      {/* 四邊 16px */}
<div className="px-4 py-2"> {/* 水平 16px、垂直 8px */}

// 外距
<div className="mt-6">     {/* 上方外距 24px */}
<div className="mb-4">     {/* 下方外距 16px */}

// 間隙（flexbox/grid）
<div className="gap-2">    {/* 8px 間隙 */}
<div className="gap-4">    {/* 16px 間隙 */}
```

## 圓角標記

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
};
```

```css
:root {
  --radius: 0.5rem;
}
```

```tsx
<div className="rounded-sm">   {/* 4px */}
<div className="rounded-md">   {/* 6px */}
<div className="rounded-lg">   {/* 8px */}
```

## 陰影標記

```css
:root {
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
}
```

```tsx
<div className="shadow-sm">    {/* 微妙陰影 */}
<div className="shadow">       {/* 預設陰影 */}
<div className="shadow-md">    {/* 中等陰影 */}
<div className="shadow-lg">    {/* 大陰影 */}
```

## 自訂標記

### 新增標記

1. 在 CSS 中定義：
```css
:root {
  --success: 142.1 76.2% 36.3%;
  --success-foreground: 355.7 100% 97.3%;
  
  --warning: 45.4 93.4% 47.5%;
  --warning-foreground: 26 83.3% 14.1%;
}

.dark {
  --success: 142.1 70.6% 45.3%;
  --warning: 48 96.5% 53%;
}
```

2. 新增至 Tailwind 設定：
```js
colors: {
  success: {
    DEFAULT: 'hsl(var(--success))',
    foreground: 'hsl(var(--success-foreground))',
  },
  warning: {
    DEFAULT: 'hsl(var(--warning))',
    foreground: 'hsl(var(--warning-foreground))',
  },
}
```

3. 在元件中使用：
```tsx
<div className="bg-success text-success-foreground">
  成功訊息
</div>
```

## 標記參考

### 語意化顏色對應

| 標記 | 淺色模式 | 深色模式 | 用途 |
|------|----------|----------|------|
| `background` | 白色 | 近黑色 | 頁面背景 |
| `foreground` | 近黑色 | 白色 | 主要文字 |
| `card` | 白色 | 近黑色 | 卡片背景 |
| `primary` | 藍色 | 淺藍色 | 主要操作 |
| `secondary` | 淺灰色 | 深灰色 | 次要操作 |
| `muted` | 淺灰色 | 深灰色 | 停用狀態 |
| `accent` | 淺灰色 | 深灰色 | 高亮 |
| `destructive` | 紅色 | 深紅色 | 刪除操作 |
| `border` | 淺灰色 | 深灰色 | 邊框 |

## 最佳實踐

### ✅ 建議

```tsx
// 使用語意化標記
<div className="bg-background text-foreground">
<button className="bg-primary text-primary-foreground">

// 需要時使用帶不透明度的標記
<div className="bg-primary/10">

// 使用一致的間距
<div className="p-4 gap-4">
```

### ❌ 避免

```tsx
// 避免硬編碼顏色
<div style={{ backgroundColor: '#1a1a1a' }}>

// 標記存在時避免任意值
<div className="bg-[#3b82f6]">

// 避免混用顏色系統
<div className="bg-blue-500">  {/* 當 primary 可用時 */}
```

## 相關資源

- [樣式概覽](./overview) - 樣式架構
- [深色模式](./dark-mode) - 主題切換
- [動畫](./animations) - 動態標記
