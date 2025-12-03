---
sidebar_position: 3
title: Header
description: 支援 Eagle 拖曳區域和內建操作的外掛標題列
---

# Header

一個專為 Eagle 外掛設計的標題列元件，支援視窗拖曳區域、主題切換和可自訂操作。

## 匯入

```tsx
import { Header } from '@/components';
```

## 基本用法

```tsx
<Header title="我的外掛" />
```

## 功能

### 拖曳區域

Header 自動在 macOS 和 Windows 上啟用視窗拖曳：

```tsx
// 整個 header 都可拖曳
<Header title="我的外掛" />

// 操作按鈕自動有不可拖曳區域
<Header 
  title="我的外掛"
  showThemeToggle
  showSettings
/>
```

:::info Eagle 專用
拖曳區域使用 `-webkit-app-region: drag` CSS 屬性，僅在 Eagle 的 Chromium 環境中有效。在瀏覽器開發模式下，標題列看起來正常但拖曳不會移動視窗。
:::

### DEV 徽章

在瀏覽器開發模式下執行時（`eagleApi.isMock === true`），會自動顯示「DEV」徽章：

```tsx
// 在瀏覽器開發模式下自動顯示「DEV」徽章
<Header title="我的外掛" />
```

### 主題切換

啟用內建的淺色/深色模式切換：

```tsx
<Header 
  title="我的外掛"
  showThemeToggle
/>
```

### 設定按鈕

新增帶有自訂處理程式的設定按鈕：

```tsx
<Header 
  title="我的外掛"
  showSettings
  onSettingsClick={() => setSettingsOpen(true)}
/>
```

### 關閉按鈕

預設顯示關閉按鈕。可自訂或隱藏：

```tsx
// 預設：關閉 Eagle 外掛視窗
<Header title="我的外掛" />

// 自訂關閉處理程式
<Header 
  title="我的外掛"
  onCloseClick={() => confirmBeforeClose()}
/>

// 隱藏關閉按鈕
<Header 
  title="我的外掛"
  showClose={false}
/>
```

### 自訂操作

在右側新增任何自訂操作：

```tsx
<Header 
  title="我的外掛"
  actions={
    <>
      <Button variant="ghost" size="icon">
        <RefreshCw className="w-5 h-5" />
      </Button>
      <Button variant="ghost" size="icon">
        <HelpCircle className="w-5 h-5" />
      </Button>
    </>
  }
/>
```

## Props

| Prop | 型別 | 預設值 | 描述 |
|------|------|---------|-------------|
| `title` | `string` | i18n `app.title` | 顯示在標題列的外掛名稱 |
| `showThemeToggle` | `boolean` | `false` | 顯示太陽/月亮主題切換按鈕 |
| `showSettings` | `boolean` | `false` | 顯示設定齒輪按鈕 |
| `onSettingsClick` | `() => void` | — | 設定按鈕點擊處理程式 |
| `showClose` | `boolean` | `true` | 顯示關閉（X）按鈕 |
| `onCloseClick` | `() => void` | 隱藏視窗 | 關閉按鈕點擊處理程式 |
| `actions` | `ReactNode` | — | 自訂操作按鈕 |
| `className` | `string` | — | 額外的 CSS class |

加上所有標準的 `<header>` HTML 屬性。

## 範例

### 最簡標題列

```tsx
<Header />
// 使用 i18n app.title，僅顯示關閉按鈕
```

### 完整功能標題列

```tsx
<Header
  title="圖片處理器"
  showThemeToggle
  showSettings
  onSettingsClick={() => setShowSettings(true)}
  actions={
    <Button variant="ghost" size="icon" onClick={refresh}>
      <RefreshCw className="w-5 h-5" />
    </Button>
  }
/>
```

### 自訂樣式標題列

```tsx
<Header 
  title="我的外掛"
  className="border-b-2 border-primary"
/>
```

### 搭配設定對話框

```tsx
function App() {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <>
      <Header
        title="我的外掛"
        showSettings
        onSettingsClick={() => setSettingsOpen(true)}
      />
      
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>設定</DialogTitle>
          </DialogHeader>
          {/* 設定表單 */}
        </DialogContent>
      </Dialog>
    </>
  );
}
```

## 佈局

標題列設計為固定在頂部：

```tsx
<div className="h-screen flex flex-col">
  <Header title="我的外掛" />
  <main className="flex-1 overflow-auto">
    {/* 可捲動內容 */}
  </main>
</div>
```

## 樣式

標題列使用以下樣式：

- **背景**：`bg-background/80` 搭配 `backdrop-blur-xl`
- **邊框**：`border-b border-border`
- **定位**：`sticky top-0 z-10`
- **拖曳**：用於 Eagle 視窗拖曳的 `drag-region` class

### 自訂

```tsx
// 更突出的標題列
<Header 
  title="我的外掛"
  className="bg-primary text-primary-foreground"
/>

// 透明標題列
<Header 
  title="我的外掛"
  className="bg-transparent border-none"
/>
```

## 無障礙

- **語意化**：使用 `<header>` 元素
- **鍵盤**：所有按鈕都可聚焦和啟動
- **標籤**：按鈕有 `title` 屬性提供工具提示

## 國際化

標題列使用 i18n 處理以下內容：
- 預設標題：`t('app.title')`
- 主題切換提示：`t('app.lightMode')` / `t('app.darkMode')`
- 設定提示：`t('app.settings')`
- 關閉提示：`t('app.close')`

確保這些鍵值存在於您的 `_locales/*.json` 檔案中。
