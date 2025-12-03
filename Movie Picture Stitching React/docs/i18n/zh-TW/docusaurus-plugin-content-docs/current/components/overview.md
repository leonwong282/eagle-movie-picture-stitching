---
sidebar_position: 1
title: 元件概覽
description: Eagle React 範本 UI 元件庫概覽
---

# 元件概覽

Eagle React 範本包含 **18 個生產就緒的 UI 元件**，專為 Eagle 外掛開發設計。所有元件都支援深色模式、完全無障礙，並與 Eagle 的主題系統無縫整合。

## 架構

### 建立在 shadcn/ui + Radix UI 之上

我們的元件庫遵循 [shadcn/ui](https://ui.shadcn.com/) 模式：

- **Radix UI Primitives** — 無障礙、無樣式的元件作為基礎
- **Tailwind CSS** — 工具優先的樣式與設計標記
- **Class Variance Authority (CVA)** — 型別安全的元件變體
- **完全擁有** — 元件在您的程式碼庫中，而非 `node_modules`

```tsx
// 元件使用 CVA 實現型別安全的變體
const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground',
        destructive: 'bg-destructive text-white',
        outline: 'border border-input bg-background',
        // ... 更多變體
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 px-3',
        lg: 'h-10 px-6',
      },
    },
  }
);
```

### 匯入元件

所有元件從單一進入點匯出：

```tsx
import {
  Button,
  Card,
  CardHeader,
  CardContent,
  Dialog,
  DialogTrigger,
  DialogContent,
  useToast,
  toast,
} from '@/components';
```

## 元件類別

### 🎨 UI 元件

用於建立介面的核心視覺元件。

| 元件 | 描述 | Radix UI |
|-----------|-------------|----------|
| [Button](./ui/button) | 8 種變體、載入狀態、圖示按鈕 | `@radix-ui/react-slot` |
| [Card](./ui/card) | 玻璃擬態卡片，帶有語意化區塊 | — |
| [Header](./ui/header) | Eagle 拖曳區域、主題切換、操作按鈕 | — |
| [Toast](./ui/toast) | 非阻塞通知（4 種類型） | — |

### 📝 表單元件

帶有驗證樣式的無障礙表單控制項。

| 元件 | 描述 | Radix UI |
|-----------|-------------|----------|
| [Input](./form/input) | 帶有焦點狀態的文字輸入框 | — |
| [Label](./form/label) | 帶有配對樣式的表單標籤 | `@radix-ui/react-label` |
| [Select](./form/select) | 帶有搜尋功能的下拉選擇 | `@radix-ui/react-select` |
| [Checkbox](./form/checkbox) | 帶有可選標籤的核取方塊 | `@radix-ui/react-checkbox` |
| [Slider](./form/slider) | 帶有數值顯示的範圍滑桿 | `@radix-ui/react-slider` |

### 🪟 覆蓋層元件

模態框、選單和浮動元素。

| 元件 | 描述 | Radix UI |
|-----------|-------------|----------|
| [Dialog](./overlay/dialog) | 帶有焦點陷阱的模態對話框 | `@radix-ui/react-dialog` |
| [DropdownMenu](./overlay/dropdown-menu) | 右鍵選單、子選單 | `@radix-ui/react-dropdown-menu` |
| [Tooltip](./overlay/tooltip) | 帶有延遲的懸停提示 | `@radix-ui/react-tooltip` |
| [Popover](./overlay/popover) | 點擊觸發的彈出框 | `@radix-ui/react-popover` |

### 📐 佈局元件

結構和組織元件。

| 元件 | 描述 | Radix UI |
|-----------|-------------|----------|
| [Tabs](./layout/tabs) | 帶有鍵盤支援的標籤頁導覽 | `@radix-ui/react-tabs` |
| [ImageGrid](./layout/image-grid) | 響應式圖片網格（2-6 欄） | — |
| [EagleImage](./layout/eagle-image) | 最佳化的 Eagle 圖片顯示 | — |

### ⚠️ 錯誤處理

優雅的錯誤復原元件。

| 元件 | 描述 | Radix UI |
|-----------|-------------|----------|
| [ErrorBoundary](./error/error-boundary) | 捕捉和處理 React 錯誤 | — |
| [ErrorFallback](./error/error-fallback) | 樣式化的錯誤顯示 UI | — |

## 設計原則

### 1. Eagle 優先設計

元件設計時考慮了 Eagle 外掛的限制：

- **拖曳區域支援** — Header 元件處理視窗拖曳
- **主題同步** — 自動與 Eagle 設定的深色/淺色模式同步
- **DEV 徽章** — 在瀏覽器模擬模式下執行時的視覺指示器

### 2. 無障礙

所有元件符合 WCAG 2.1 AA 標準：

- **鍵盤導覽** — 所有互動元素都完整支援鍵盤
- **ARIA 屬性** — 正確的角色、標籤和狀態
- **焦點管理** — 邏輯性的焦點順序和可見的焦點指示器
- **螢幕閱讀器** — 有意義的播報和 live region

### 3. 組合模式

使用 `asChild` prop（透過 Radix Slot）來組合元件：

```tsx
// Button 渲染為連結
<Button asChild>
  <a href="/docs">閱讀文件</a>
</Button>

// DialogTrigger 使用自訂按鈕
<DialogTrigger asChild>
  <Button variant="outline">開啟對話框</Button>
</DialogTrigger>
```

## 快速開始

```tsx
import { Button, Card, CardContent, useToast, toast } from '@/components';

function MyPlugin() {
  const { addToast } = useToast();

  const handleSave = () => {
    // 執行某些操作...
    addToast(toast.success('已儲存！', '您的變更已儲存。'));
  };

  return (
    <Card>
      <CardContent className="p-6">
        <Button onClick={handleSave}>
          儲存變更
        </Button>
      </CardContent>
    </Card>
  );
}
```

## 下一步

- **[Button](./ui/button)** — 從最常用的元件開始
- **[Card](./ui/card)** — 學習複合元件模式
- **[Toast](./ui/toast)** — 為您的外掛新增使用者回饋
