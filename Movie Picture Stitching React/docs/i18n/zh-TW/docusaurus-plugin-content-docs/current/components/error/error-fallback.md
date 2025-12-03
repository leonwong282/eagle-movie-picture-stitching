---
sidebar_position: 2
title: ErrorFallback 錯誤備用元件
description: 預建的 ErrorBoundary 備用 UI 元件，具有多種變體
---

# ErrorFallback 錯誤備用元件

專為 `ErrorBoundary` 設計的預建備用 UI 元件。提供使用者友善的錯誤顯示，具有恢復選項、除錯資訊和複製到剪貼簿功能。

## 匯入

```tsx
import { ErrorFallback } from '@/components';
```

## 基本用法

```tsx
<ErrorBoundary
  fallback={(props) => <ErrorFallback {...props} />}
>
  <MyComponent />
</ErrorBoundary>
```

## 屬性

| 屬性 | 類型 | 預設值 | 說明 |
|------|------|---------|-------------|
| `error` | `Error` | 必填 | 被捕獲的錯誤 |
| `resetErrorBoundary` | `() => void` | 必填 | 重置邊界的函式 |
| `variant` | `'fullscreen' \| 'inline'` | `'fullscreen'` | 顯示變體 |
| `title` | `string` | `'發生錯誤'` | 自訂錯誤標題 |
| `showDetails` | `boolean` | `true` | 顯示可展開的錯誤詳情 |
| `showStack` | `boolean` | `process.env.NODE_ENV === 'development'` | 顯示堆疊追蹤 |
| `showReload` | `boolean` | `true` | 顯示重新載入按鈕 |
| `showCopy` | `boolean` | `true` | 顯示複製錯誤按鈕 |
| `onCopy` | `() => void` | - | 自訂複製處理器 |

## 變體

### 全螢幕（預設）

將錯誤置中於視窗，適合全域或頁面級別的錯誤：

```tsx
<ErrorBoundary
  fallback={(props) => <ErrorFallback {...props} variant="fullscreen" />}
>
  <App />
</ErrorBoundary>
```

### 內嵌

適合錯誤邊界的容器內，適合區段級別的錯誤：

```tsx
<ErrorBoundary
  fallback={(props) => <ErrorFallback {...props} variant="inline" />}
>
  <Widget />
</ErrorBoundary>
```

## 範例

### 帶自訂標題的全域錯誤

```tsx
<ErrorBoundary
  fallback={(props) => (
    <ErrorFallback
      {...props}
      title="外掛錯誤"
      variant="fullscreen"
    />
  )}
>
  <PluginContent />
</ErrorBoundary>
```

### 區段錯誤（內嵌）

```tsx
function Dashboard() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <ErrorBoundary
        fallback={(props) => (
          <ErrorFallback
            {...props}
            variant="inline"
            title="圖表載入失敗"
            showStack={false}
          />
        )}
      >
        <ChartWidget />
      </ErrorBoundary>

      <ErrorBoundary
        fallback={(props) => (
          <ErrorFallback
            {...props}
            variant="inline"
            title="統計資料不可用"
          />
        )}
      >
        <StatsWidget />
      </ErrorBoundary>
    </div>
  );
}
```

### 生產環境安全顯示

```tsx
<ErrorFallback
  error={error}
  resetErrorBoundary={reset}
  showStack={false}           // 在生產環境隱藏堆疊
  showDetails={false}         // 隱藏錯誤詳情
  title="發生錯誤"
/>
```

### 開發者友善顯示

```tsx
<ErrorFallback
  error={error}
  resetErrorBoundary={reset}
  showStack={true}
  showDetails={true}
  showCopy={true}
/>
```

### 自訂複製處理器

```tsx
<ErrorFallback
  error={error}
  resetErrorBoundary={reset}
  showCopy={true}
  onCopy={() => {
    // 自訂複製行為
    const errorReport = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
    };
    navigator.clipboard.writeText(JSON.stringify(errorReport, null, 2));
    toast.success('錯誤報告已複製');
  }}
/>
```

### 不含重新載入按鈕

```tsx
<ErrorFallback
  error={error}
  resetErrorBoundary={reset}
  showReload={false}  // 只顯示「重試」按鈕
/>
```

### 極簡錯誤顯示

```tsx
<ErrorFallback
  error={error}
  resetErrorBoundary={reset}
  showDetails={false}
  showStack={false}
  showCopy={false}
  showReload={false}
/>
```

## UI 結構

### 全螢幕變體

```tsx
<div className="fixed inset-0 flex items-center justify-center bg-background">
  <Card className="max-w-lg w-full mx-4">
    <CardHeader>
      <AlertCircle className="h-12 w-12 text-destructive" />
      <CardTitle>{title}</CardTitle>
      <CardDescription>{error.message}</CardDescription>
    </CardHeader>
    <CardContent>
      {showDetails && (
        <Collapsible>
          {/* 堆疊追蹤 */}
        </Collapsible>
      )}
    </CardContent>
    <CardFooter>
      <Button onClick={resetErrorBoundary}>重試</Button>
      {showReload && <Button onClick={reload}>重新載入</Button>}
      {showCopy && <Button onClick={copy}>複製錯誤</Button>}
    </CardFooter>
  </Card>
</div>
```

### 內嵌變體

```tsx
<Card className="border-destructive/50 bg-destructive/5">
  <CardHeader className="pb-2">
    <div className="flex items-center gap-2">
      <AlertCircle className="h-5 w-5 text-destructive" />
      <CardTitle className="text-base">{title}</CardTitle>
    </div>
  </CardHeader>
  <CardContent>
    <p className="text-sm text-muted-foreground">{error.message}</p>
    {showDetails && /* ... */}
  </CardContent>
  <CardFooter className="pt-0">
    <Button size="sm" onClick={resetErrorBoundary}>
      重試
    </Button>
  </CardFooter>
</Card>
```

## 錯誤詳情面板

當 `showDetails={true}` 時，使用者可以展開查看技術資訊：

```tsx
<Collapsible>
  <CollapsibleTrigger className="flex items-center gap-2">
    <ChevronDown className="h-4 w-4" />
    技術詳情
  </CollapsibleTrigger>
  <CollapsibleContent>
    <pre className="mt-2 p-3 bg-muted rounded-md text-xs overflow-auto">
      {error.stack}
    </pre>
  </CollapsibleContent>
</Collapsible>
```

## 複製錯誤功能

複製按鈕包含完整的錯誤資訊：

```tsx
const handleCopy = () => {
  const errorInfo = `
錯誤: ${error.message}
堆疊: ${error.stack}
時間戳記: ${new Date().toISOString()}
URL: ${window.location.href}
  `.trim();

  navigator.clipboard.writeText(errorInfo);
  // 顯示 toast 確認
};
```

## 樣式

### 預設顏色

```css
/* 全螢幕背景 */
.error-fullscreen {
  @apply bg-background;
}

/* 錯誤圖示 */
.error-icon {
  @apply text-destructive;
}

/* 內嵌卡片 */
.error-inline {
  @apply border-destructive/50 bg-destructive/5;
}

/* 堆疊追蹤 */
.error-stack {
  @apply bg-muted text-muted-foreground font-mono text-xs;
}
```

### 自訂樣式

```tsx
<ErrorFallback
  error={error}
  resetErrorBoundary={reset}
  className="border-2 border-red-500"
/>

// 或使用包裝器
<div className="p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
  <ErrorFallback
    {...props}
    variant="inline"
  />
</div>
```

## 無障礙性

元件包含適當的無障礙功能：

- 錯誤圖示有 `aria-hidden="true"`（裝飾性）
- 錯誤訊息在標題層級中
- 按鈕有清楚的標籤
- 可摺疊元件使用正確的 ARIA 狀態
- 操作時的焦點管理

## 與 Toast 整合

複製時顯示 toast 通知：

```tsx
import { useToast, toast } from '@/components';

function ErrorFallbackWithToast(props: ErrorFallbackProps) {
  const { addToast } = useToast();

  return (
    <ErrorFallback
      {...props}
      onCopy={() => {
        // 預設複製行為
        navigator.clipboard.writeText(formatError(props.error));
        addToast(toast.success('錯誤詳情已複製到剪貼簿'));
      }}
    />
  );
}
```

## 最佳實踐

### 應該做

- ✅ 對於非關鍵區段使用 `variant="inline"`
- ✅ 對於應用程式級別錯誤使用 `variant="fullscreen"`
- ✅ 在生產環境隱藏堆疊追蹤
- ✅ 提供清楚、使用者友善的標題
- ✅ 始終包含恢復操作（重試或重新載入）
- ✅ 保留複製功能以支援除錯

### 不應該做

- ❌ 向非技術使用者顯示原始錯誤訊息
- ❌ 在生產環境暴露堆疊追蹤
- ❌ 移除所有恢復選項
- ❌ 對小型元件使用全螢幕變體
- ❌ 忘記處理 `resetErrorBoundary` 回呼

## 基於環境的配置

```tsx
const isDev = process.env.NODE_ENV === 'development';

<ErrorFallback
  error={error}
  resetErrorBoundary={reset}
  showStack={isDev}
  showDetails={isDev}
  title={isDev 
    ? `錯誤：${error.name}` 
    : '發生錯誤'
  }
/>
```

## 相關元件

- [ErrorBoundary](./error-boundary) - 捕獲錯誤的父元件
- [Card](../ui/card) - 用於佈局的基礎元件
- [Button](../ui/button) - 用於操作按鈕
- [Toast](../ui/toast) - 用於複製確認通知
