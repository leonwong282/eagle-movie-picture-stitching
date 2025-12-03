---
sidebar_position: 1
title: ErrorBoundary 錯誤邊界
description: 用於優雅錯誤處理和恢復的 React 錯誤邊界元件
---

# ErrorBoundary 錯誤邊界

一個 React 錯誤邊界元件，可以捕獲子元件樹中的 JavaScript 錯誤，記錄它們，並顯示備用 UI 而不是讓整個應用程式崩潰。

## 匯入

```tsx
import { ErrorBoundary } from '@/components';
```

## 基本用法

```tsx
<ErrorBoundary>
  <MyComponent />
</ErrorBoundary>
```

使用自訂備用內容：

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
| `children` | `ReactNode` | 必填 | 要包裹的元件 |
| `fallback` | `ReactNode \| FallbackRender` | 預設 UI | 錯誤時顯示的備用內容 |
| `onError` | `(error: Error, errorInfo: ErrorInfo) => void` | - | 發生錯誤時的回呼 |
| `onReset` | `() => void` | - | 邊界重置時的回呼 |
| `resetKeys` | `any[]` | - | 觸發自動重置的鍵值 |

### FallbackRender 類型

```tsx
type FallbackRender = (props: {
  error: Error;
  resetErrorBoundary: () => void;
}) => ReactNode;
```

## 範例

### 全域錯誤邊界

包裹整個應用程式：

```tsx
// main.tsx
import { ErrorBoundary, ErrorFallback } from '@/components';
import { eagleApi } from '@/lib/eagle-api';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary
      fallback={(props) => <ErrorFallback {...props} />}
      onError={(error, errorInfo) => {
        // 記錄到 Eagle 的主控台
        eagleApi.log.error('React 錯誤:', error.message);
        eagleApi.log.error('堆疊:', errorInfo.componentStack);
      }}
    >
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
```

### 區段級別邊界

將錯誤隔離到特定區段：

```tsx
function Dashboard() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <ErrorBoundary
        fallback={(props) => (
          <ErrorFallback {...props} variant="inline" />
        )}
      >
        <ChartWidget />
      </ErrorBoundary>
      
      <ErrorBoundary
        fallback={(props) => (
          <ErrorFallback {...props} variant="inline" />
        )}
      >
        <StatsWidget />
      </ErrorBoundary>
    </div>
  );
}
```

### 使用重置鍵值

當特定屬性改變時自動重置：

```tsx
function ImageProcessor({ selectedImage }: Props) {
  return (
    <ErrorBoundary
      resetKeys={[selectedImage?.id]}
      fallback={(props) => <ErrorFallback {...props} />}
    >
      <ProcessingPanel image={selectedImage} />
    </ErrorBoundary>
  );
}
```

當 `selectedImage.id` 改變時，邊界會自動重置。

### 帶錯誤記錄

```tsx
function LoggingBoundary({ children }: { children: ReactNode }) {
  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    // 記錄到 Eagle
    if (isEagleEnvironment()) {
      eagleApi.log.error('元件錯誤:', error.message);
      eagleApi.log.error('元件堆疊:', errorInfo.componentStack);
    }
    
    // 傳送到監控服務
    if (process.env.NODE_ENV === 'production') {
      sendToErrorMonitoring({
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
      });
    }
  };

  return (
    <ErrorBoundary
      fallback={(props) => <ErrorFallback {...props} />}
      onError={handleError}
    >
      {children}
    </ErrorBoundary>
  );
}
```

### 帶重置處理

```tsx
function ResettableBoundary({ children }: { children: ReactNode }) {
  const handleReset = () => {
    // 清除任何快取狀態
    queryClient.clear();
    
    // 重置全域狀態
    usePluginStore.getState().reset();
    
    console.log('錯誤邊界已重置');
  };

  return (
    <ErrorBoundary
      fallback={(props) => <ErrorFallback {...props} />}
      onReset={handleReset}
    >
      {children}
    </ErrorBoundary>
  );
}
```

### 簡單備用內容

```tsx
<ErrorBoundary
  fallback={
    <div className="p-4 text-center">
      <p className="text-destructive">發生錯誤</p>
      <Button onClick={() => window.location.reload()}>
        重新載入
      </Button>
    </div>
  }
>
  <MyComponent />
</ErrorBoundary>
```

### 函式備用內容

```tsx
<ErrorBoundary
  fallback={({ error, resetErrorBoundary }) => (
    <Card className="p-4">
      <CardHeader>
        <CardTitle className="text-destructive">錯誤</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          {error.message}
        </p>
        <div className="flex gap-2">
          <Button onClick={resetErrorBoundary}>
            重試
          </Button>
          <Button variant="outline" onClick={() => window.location.reload()}>
            重新載入頁面
          </Button>
        </div>
      </CardContent>
    </Card>
  )}
>
  <MyComponent />
</ErrorBoundary>
```

### 巢狀邊界

```tsx
function App() {
  return (
    // 全域邊界捕獲未處理的錯誤
    <ErrorBoundary fallback={<GlobalError />}>
      <Header />
      
      {/* 主要內容的隔離邊界 */}
      <ErrorBoundary
        fallback={(props) => <ContentError {...props} />}
        resetKeys={[currentRoute]}
      >
        <MainContent />
      </ErrorBoundary>
      
      {/* 側邊欄錯誤不影響主要內容 */}
      <ErrorBoundary
        fallback={<SidebarFallback />}
      >
        <Sidebar />
      </ErrorBoundary>
    </ErrorBoundary>
  );
}
```

## 錯誤恢復模式

### 手動重置

```tsx
function ErrorWithRetry({ error, resetErrorBoundary }) {
  return (
    <div>
      <p>錯誤：{error.message}</p>
      <Button onClick={resetErrorBoundary}>
        重試
      </Button>
    </div>
  );
}
```

### 導覽時自動重置

```tsx
import { useLocation } from 'react-router-dom';

function RouteErrorBoundary({ children }) {
  const location = useLocation();

  return (
    <ErrorBoundary
      resetKeys={[location.pathname]}
      fallback={(props) => <ErrorFallback {...props} />}
    >
      {children}
    </ErrorBoundary>
  );
}
```

### 帶狀態清理的重置

```tsx
function DataBoundary({ dataId, children }) {
  const queryClient = useQueryClient();

  const handleReset = () => {
    // 使相關查詢失效
    queryClient.invalidateQueries(['data', dataId]);
  };

  return (
    <ErrorBoundary
      resetKeys={[dataId]}
      onReset={handleReset}
      fallback={(props) => <ErrorFallback {...props} />}
    >
      {children}
    </ErrorBoundary>
  );
}
```

## 會捕獲哪些錯誤

ErrorBoundary 會捕獲：

- ✅ 渲染期間的錯誤
- ✅ 生命週期方法中的錯誤
- ✅ 建構函式中的錯誤

ErrorBoundary 不會捕獲：

- ❌ 事件處理器（使用 try/catch）
- ❌ 非同步程式碼（使用 try/catch 或 .catch()）
- ❌ 伺服器端渲染
- ❌ 邊界本身的錯誤

### 處理事件處理器錯誤

```tsx
function MyComponent() {
  const { addToast } = useToast();

  const handleClick = async () => {
    try {
      await riskyOperation();
    } catch (error) {
      // 事件處理器錯誤需要明確處理
      addToast(toast.error('操作失敗', error.message));
    }
  };

  return <Button onClick={handleClick}>執行操作</Button>;
}
```

### 處理非同步錯誤

```tsx
function AsyncComponent() {
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchData()
      .catch(setError);
  }, []);

  if (error) {
    // 重新拋出以讓邊界捕獲
    throw error;
  }

  return <div>內容</div>;
}
```

## 最佳實踐

### 應該做

- ✅ 在元件樹的策略點放置邊界
- ✅ 使用多個邊界隔離故障
- ✅ 記錄錯誤以便除錯（特別是到 Eagle 的主控台）
- ✅ 向使用者提供有用的錯誤訊息
- ✅ 包含恢復方式（重置或重新載入）
- ✅ 使用 `resetKeys` 在上下文改變時自動恢復

### 不應該做

- ❌ 為每個元件包裹邊界（太細粒度）
- ❌ 在生產環境忽略 `onError` 回呼
- ❌ 向終端使用者顯示技術錯誤詳情
- ❌ 忘記單獨處理非同步錯誤
- ❌ 依賴邊界處理事件處理器錯誤

## 與 Eagle 整合

```tsx
<ErrorBoundary
  fallback={(props) => <ErrorFallback {...props} />}
  onError={(error, errorInfo) => {
    // 記錄到 Eagle 的系統日誌
    if (isEagleEnvironment()) {
      eagleApi.log.error(`[外掛錯誤] ${error.message}`);
      eagleApi.log.error(`[堆疊] ${error.stack}`);
    }
  }}
>
  <PluginContent />
</ErrorBoundary>
```

## 相關元件

- [ErrorFallback](./error-fallback) - 預建的備用 UI 元件
- [Toast](../ui/toast) - 用於非致命性錯誤通知
