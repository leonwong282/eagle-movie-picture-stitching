---
sidebar_position: 3
title: Tooltip 工具提示
description: 用於在懸停時顯示上下文資訊的無障礙工具提示元件
---

# Tooltip 工具提示

基於 [Radix UI Tooltip](https://www.radix-ui.com/primitives/docs/components/tooltip) 建構的工具提示元件，提供具有可自訂定位和延遲的無障礙懸停提示。

## 匯入

```tsx
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components';
```

## 基本用法

使用 `TooltipProvider` 包裹您的應用程式（或某個區域），然後在任何地方使用工具提示：

```tsx
// 在您的 App 或佈局中
<TooltipProvider>
  <App />
</TooltipProvider>

// 然後使用工具提示
<Tooltip>
  <TooltipTrigger asChild>
    <Button variant="outline" size="icon">
      <Settings className="h-4 w-4" />
    </Button>
  </TooltipTrigger>
  <TooltipContent>
    <p>設定</p>
  </TooltipContent>
</Tooltip>
```

## 元件

| 元件 | 說明 |
|-----------|-------------|
| `TooltipProvider` | 為工具提示提供共享狀態 |
| `Tooltip` | 單個工具提示的根元件 |
| `TooltipTrigger` | 觸發工具提示的元素 |
| `TooltipContent` | 工具提示的彈出內容 |

## 屬性

### TooltipProvider

| 屬性 | 類型 | 預設值 | 說明 |
|------|------|---------|-------------|
| `delayDuration` | `number` | `700` | 工具提示顯示前的延遲（毫秒） |
| `skipDelayDuration` | `number` | `300` | 在工具提示間移動時跳過延遲的時間（毫秒） |
| `disableHoverableContent` | `boolean` | `false` | 停用懸停內容 |

### Tooltip

| 屬性 | 類型 | 預設值 | 說明 |
|------|------|---------|-------------|
| `open` | `boolean` | - | 受控的開啟狀態 |
| `onOpenChange` | `(open: boolean) => void` | - | 開啟狀態變更時的回呼 |
| `defaultOpen` | `boolean` | `false` | 初始開啟狀態 |
| `delayDuration` | `number` | - | 覆蓋 Provider 的延遲 |

### TooltipContent

| 屬性 | 類型 | 預設值 | 說明 |
|------|------|---------|-------------|
| `className` | `string` | - | 額外的 CSS 類別 |
| `sideOffset` | `number` | `4` | 與觸發器的距離 |
| `side` | `'top' \| 'right' \| 'bottom' \| 'left'` | `'top'` | 偏好的位置方向 |
| `align` | `'start' \| 'center' \| 'end'` | `'center'` | 在該方向上的對齊方式 |
| `alignOffset` | `number` | `0` | 對齊的偏移量 |
| `avoidCollisions` | `boolean` | `true` | 翻轉以避免超出視窗邊緣 |

### TooltipTrigger

| 屬性 | 類型 | 預設值 | 說明 |
|------|------|---------|-------------|
| `asChild` | `boolean` | `false` | 將屬性合併到子元素上 |

## 範例

### 帶工具提示的圖示按鈕

```tsx
import { Bold, Italic, Underline, AlignLeft } from 'lucide-react';

function Toolbar() {
  return (
    <TooltipProvider>
      <div className="flex gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon">
              <Bold className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>粗體 (⌘B)</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon">
              <Italic className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>斜體 (⌘I)</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon">
              <Underline className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>底線 (⌘U)</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
```

### 自訂延遲

```tsx
// 快速工具提示（200ms）
<TooltipProvider delayDuration={200}>
  <Tooltip>
    <TooltipTrigger>快速資訊</TooltipTrigger>
    <TooltipContent>快速顯示！</TooltipContent>
  </Tooltip>
</TooltipProvider>

// 即時工具提示（個別覆蓋）
<Tooltip delayDuration={0}>
  <TooltipTrigger>即時</TooltipTrigger>
  <TooltipContent>無延遲！</TooltipContent>
</Tooltip>
```

### 定位

```tsx
<div className="flex gap-4">
  <Tooltip>
    <TooltipTrigger asChild>
      <Button>上方（預設）</Button>
    </TooltipTrigger>
    <TooltipContent side="top">
      <p>工具提示在上方</p>
    </TooltipContent>
  </Tooltip>

  <Tooltip>
    <TooltipTrigger asChild>
      <Button>右側</Button>
    </TooltipTrigger>
    <TooltipContent side="right">
      <p>工具提示在右側</p>
    </TooltipContent>
  </Tooltip>

  <Tooltip>
    <TooltipTrigger asChild>
      <Button>下方</Button>
    </TooltipTrigger>
    <TooltipContent side="bottom">
      <p>工具提示在下方</p>
    </TooltipContent>
  </Tooltip>

  <Tooltip>
    <TooltipTrigger asChild>
      <Button>左側</Button>
    </TooltipTrigger>
    <TooltipContent side="left">
      <p>工具提示在左側</p>
    </TooltipContent>
  </Tooltip>
</div>
```

### 對齊方式

```tsx
<Tooltip>
  <TooltipTrigger asChild>
    <Button className="w-40">起始對齊</Button>
  </TooltipTrigger>
  <TooltipContent align="start">
    <p>對齊到起始位置</p>
  </TooltipContent>
</Tooltip>

<Tooltip>
  <TooltipTrigger asChild>
    <Button className="w-40">結尾對齊</Button>
  </TooltipTrigger>
  <TooltipContent align="end">
    <p>對齊到結尾位置</p>
  </TooltipContent>
</Tooltip>
```

### 豐富內容

```tsx
<Tooltip>
  <TooltipTrigger asChild>
    <Button variant="outline">
      <Info className="mr-2 h-4 w-4" />
      更多資訊
    </Button>
  </TooltipTrigger>
  <TooltipContent className="max-w-[300px]">
    <div className="space-y-2">
      <p className="font-semibold">圖片詳情</p>
      <p className="text-sm text-muted-foreground">
        此圖片於 2024 年 3 月 15 日匯入。
        已被檢視 42 次。
      </p>
    </div>
  </TooltipContent>
</Tooltip>
```

### 受控工具提示

```tsx
function ControlledTooltip() {
  const [open, setOpen] = useState(false);

  return (
    <Tooltip open={open} onOpenChange={setOpen}>
      <TooltipTrigger asChild>
        <Button
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
        >
          受控
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>這個工具提示是受控的</p>
      </TooltipContent>
    </Tooltip>
  );
}
```

### 停用元素

將停用的元素包裹在 span 中以使工具提示正常運作：

```tsx
<Tooltip>
  <TooltipTrigger asChild>
    <span tabIndex={0}>
      <Button disabled>停用的按鈕</Button>
    </span>
  </TooltipTrigger>
  <TooltipContent>
    <p>此操作目前不可用</p>
  </TooltipContent>
</Tooltip>
```

### 自訂偏移

```tsx
<Tooltip>
  <TooltipTrigger asChild>
    <Button>帶偏移</Button>
  </TooltipTrigger>
  <TooltipContent sideOffset={10}>
    <p>距離觸發器 10px</p>
  </TooltipContent>
</Tooltip>
```

## 樣式

### 預設樣式

```tsx
// TooltipContent 預設樣式
"z-50 overflow-hidden rounded-md border"
"bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md"
"animate-in fade-in-0 zoom-in-95"
"data-[state=closed]:animate-out data-[state=closed]:fade-out-0"
"data-[state=closed]:zoom-out-95"
```

### 自訂樣式

```tsx
// 深色工具提示
<TooltipContent className="bg-gray-900 text-white border-gray-700">
  <p>深色樣式的工具提示</p>
</TooltipContent>

// 成功工具提示
<TooltipContent className="bg-green-500 text-white border-green-600">
  <p>成功！</p>
</TooltipContent>

// 較大的工具提示
<TooltipContent className="px-4 py-2 text-base">
  <p>較大的文字</p>
</TooltipContent>
```

## 無障礙性

工具提示實作了正確的無障礙模式：

- **鍵盤可存取**：焦點時顯示，失去焦點時隱藏
- **螢幕閱讀器**：工具提示開啟時會朗讀內容
- **ARIA**：使用 `role="tooltip"` 和正確的標籤
- **時間**：尊重 `prefers-reduced-motion`
- **Escape**：可以使用 Escape 鍵關閉工具提示

### 重要注意事項

```tsx
// ✅ 好：觸發器可聚焦
<TooltipTrigger asChild>
  <Button>可聚焦</Button>
</TooltipTrigger>

// ⚠️ 需要包裝器：不可聚焦的元素
<TooltipTrigger asChild>
  <span tabIndex={0}>
    <span>讓我可聚焦</span>
  </span>
</TooltipTrigger>

// ⚠️ 停用的元素需要包裝器
<TooltipTrigger asChild>
  <span tabIndex={0}>
    <Button disabled>停用</Button>
  </span>
</TooltipTrigger>
```

## 最佳實踐

### 應該做

- ✅ 僅用於補充資訊
- ✅ 保持工具提示文字簡潔（最好一行）
- ✅ 在工具提示中包含鍵盤快捷鍵
- ✅ 在整個應用程式中使用一致的延遲
- ✅ 確保觸發元素可聚焦
- ✅ 定位工具提示以避免遮擋重要內容

### 不應該做

- ❌ 將重要資訊僅放在工具提示中
- ❌ 用工具提示顯示表單驗證訊息
- ❌ 使工具提示過大或過於複雜
- ❌ 在僅觸控裝置上使用（無法懸停）
- ❌ 將所有工具提示的延遲設為 0（體驗不佳）
- ❌ 依賴工具提示進行關鍵操作

## Provider 放置位置

將 `TooltipProvider` 放置在較高層級以共享狀態：

```tsx
// ✅ 好：Provider 包裹整個應用程式
function App() {
  return (
    <TooltipProvider>
      <Router>
        <Layout>
          <Routes />
        </Layout>
      </Router>
    </TooltipProvider>
  );
}

// ⚠️ 可行但冗餘：多個 Provider
<TooltipProvider>
  <Button />
</TooltipProvider>
<TooltipProvider>
  <Button />
</TooltipProvider>
```

## 跳過延遲時間

在工具提示之間快速移動時，可以跳過延遲：

```tsx
<TooltipProvider 
  delayDuration={700}
  skipDelayDuration={300}
>
  {/* 在 300ms 內在這些之間移動會跳過 700ms 的延遲 */}
  <Tooltip>...</Tooltip>
  <Tooltip>...</Tooltip>
  <Tooltip>...</Tooltip>
</TooltipProvider>
```

## 相關元件

- [Popover](./popover) - 用於需要持續顯示的互動內容
- [Dialog](./dialog) - 用於需要使用者操作的複雜互動
- [DropdownMenu](./dropdown-menu) - 用於操作選單
