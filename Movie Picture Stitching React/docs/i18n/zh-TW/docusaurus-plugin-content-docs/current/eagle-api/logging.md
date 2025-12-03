---
sidebar_position: 10
title: 日誌記錄
description: 外掛日誌記錄和除錯
---

# 日誌記錄

記錄訊息和錯誤以進行除錯和監控。

## 匯入

```tsx
import { eagleApi } from '@/lib/eagle-api';
```

## 日誌方法

| 方法 | 層級 | 使用情境 |
|------|------|----------|
| `log()` | 預設 | 一般資訊 |
| `info()` | 資訊 | 資訊性訊息 |
| `warn()` | 警告 | 潛在問題 |
| `error()` | 錯誤 | 錯誤和例外 |

## 基本用法

```tsx
// 一般日誌
eagleApi.log('外掛已初始化');

// 資訊層級
eagleApi.log.info('使用者選取了', items.length, '個項目');

// 警告層級
eagleApi.log.warn('使用了已棄用的 API');

// 錯誤層級
eagleApi.log.error('儲存失敗', error);
```

## 方法簽名

### log

```tsx
eagleApi.log(...args: unknown[]): void
```

任何訊息的通用日誌記錄。

```tsx
eagleApi.log('簡單訊息');
eagleApi.log('數量：', 42);
eagleApi.log('資料：', { id: 1, name: 'test' });
eagleApi.log('多個', '值', 123, true);
```

### info

```tsx
eagleApi.log.info(...args: unknown[]): void
```

關於正常操作的資訊性訊息。

```tsx
eagleApi.log.info('應用程式已啟動');
eagleApi.log.info('已載入', folders.length, '個資料夾');
eagleApi.log.info('使用者：', { id: userId, action: 'login' });
```

### warn

```tsx
eagleApi.log.warn(...args: unknown[]): void
```

潛在問題的警告訊息。

```tsx
eagleApi.log.warn('未選取任何項目');
eagleApi.log.warn('接近速率限制：', remaining);
eagleApi.log.warn('已棄用：請改用 newMethod()');
```

### error

```tsx
eagleApi.log.error(...args: unknown[]): void
```

失敗和例外的錯誤訊息。

```tsx
eagleApi.log.error('儲存失敗');
eagleApi.log.error('API 錯誤：', error.message);
eagleApi.log.error('未處理的例外', error);
```

## 常見模式

### 函式進入/退出

```tsx
async function processItems(items: Item[]) {
  eagleApi.log.info('processItems 開始', { count: items.length });
  
  try {
    const result = await doProcessing(items);
    eagleApi.log.info('processItems 完成', { 
      success: result.success,
      failed: result.failed 
    });
    return result;
  } catch (error) {
    eagleApi.log.error('processItems 失敗', error);
    throw error;
  }
}
```

### 錯誤處理

```tsx
async function fetchData() {
  try {
    const data = await api.getData();
    return data;
  } catch (error) {
    if (error instanceof NetworkError) {
      eagleApi.log.warn('網路錯誤，正在重試...', error.message);
      return await retryFetch();
    }
    
    eagleApi.log.error('擷取失敗', {
      message: error.message,
      stack: error.stack,
    });
    throw error;
  }
}
```

### 效能日誌

```tsx
function logPerformance(operation: string, fn: () => Promise<void>) {
  return async () => {
    const start = performance.now();
    
    try {
      await fn();
      const duration = performance.now() - start;
      eagleApi.log.info(`${operation} 完成`, { 
        duration: `${duration.toFixed(2)}ms` 
      });
    } catch (error) {
      const duration = performance.now() - start;
      eagleApi.log.error(`${operation} 在 ${duration.toFixed(2)}ms 後失敗`, error);
      throw error;
    }
  };
}

// 使用方式
await logPerformance('圖片匯出', async () => {
  await exportImages(selectedItems);
})();
```

### 除錯模式日誌

```tsx
const DEBUG = import.meta.env.DEV;

function debugLog(...args: unknown[]) {
  if (DEBUG) {
    eagleApi.log('[DEBUG]', ...args);
  }
}

// 使用方式
debugLog('狀態：', currentState);
debugLog('收到的 Props：', props);
```

## 結構化日誌

### 記錄物件資料

```tsx
// 記錄結構化資料
eagleApi.log.info('操作', {
  type: 'export',
  itemCount: items.length,
  format: 'png',
  quality: 0.8,
});

// 帶上下文的日誌
eagleApi.log.error('API 錯誤', {
  endpoint: '/api/items',
  status: response.status,
  message: response.statusText,
  requestId: headers['x-request-id'],
});
```

### 記錄陣列

```tsx
// 記錄陣列摘要
eagleApi.log.info('選取的項目：', {
  count: items.length,
  ids: items.map(i => i.id),
  types: [...new Set(items.map(i => i.ext))],
});
```

## Logger 服務

建立集中式 Logger 服務：

```tsx
// lib/logger.ts
import { eagleApi } from '@/lib/eagle-api';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  data?: unknown;
  timestamp: Date;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 1000;

  private addEntry(level: LogLevel, message: string, data?: unknown) {
    const entry: LogEntry = {
      level,
      message,
      data,
      timestamp: new Date(),
    };
    
    this.logs.push(entry);
    
    // 保持日誌大小有界
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
  }

  debug(message: string, data?: unknown) {
    if (import.meta.env.DEV) {
      this.addEntry('debug', message, data);
      eagleApi.log('[DEBUG]', message, data);
    }
  }

  info(message: string, data?: unknown) {
    this.addEntry('info', message, data);
    eagleApi.log.info(message, data);
  }

  warn(message: string, data?: unknown) {
    this.addEntry('warn', message, data);
    eagleApi.log.warn(message, data);
  }

  error(message: string, error?: unknown) {
    this.addEntry('error', message, error);
    eagleApi.log.error(message, error);
  }

  // 取得最近的日誌以進行除錯
  getRecentLogs(count = 50): LogEntry[] {
    return this.logs.slice(-count);
  }

  // 匯出日誌以供錯誤報告
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

export const logger = new Logger();
```

### 使用方式

```tsx
import { logger } from '@/lib/logger';

// 在元件中
logger.info('元件已掛載', { id: componentId });
logger.warn('偵測到緩慢渲染', { duration: renderTime });
logger.error('渲染錯誤', error);

// 取得日誌以進行除錯
const recentLogs = logger.getRecentLogs(100);

// 匯出以供錯誤報告
const logExport = logger.exportLogs();
```

## React 整合

### useLogger Hook

```tsx
import { useCallback, useMemo } from 'react';
import { eagleApi } from '@/lib/eagle-api';

function useLogger(prefix: string) {
  const log = useMemo(() => ({
    debug: (...args: unknown[]) => {
      if (import.meta.env.DEV) {
        eagleApi.log(`[${prefix}]`, ...args);
      }
    },
    info: (...args: unknown[]) => {
      eagleApi.log.info(`[${prefix}]`, ...args);
    },
    warn: (...args: unknown[]) => {
      eagleApi.log.warn(`[${prefix}]`, ...args);
    },
    error: (...args: unknown[]) => {
      eagleApi.log.error(`[${prefix}]`, ...args);
    },
  }), [prefix]);

  return log;
}

// 使用方式
function ImageEditor() {
  const log = useLogger('ImageEditor');

  useEffect(() => {
    log.info('編輯器已掛載');
    return () => log.info('編輯器已卸載');
  }, []);

  const handleSave = async () => {
    log.debug('儲存開始');
    try {
      await save();
      log.info('儲存完成');
    } catch (error) {
      log.error('儲存失敗', error);
    }
  };

  return <div>...</div>;
}
```

### 帶日誌的錯誤邊界

```tsx
class LoggingErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    eagleApi.log.error('React 錯誤邊界捕獲到錯誤', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    });
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}
```

## 瀏覽器 vs Eagle 行為

| 方法 | 瀏覽器（模擬） | Eagle |
|------|----------------|-------|
| `log()` | `console.log()` | 寫入 Eagle 日誌檔 |
| `info()` | `console.info()` | 寫入 Eagle 日誌檔 |
| `warn()` | `console.warn()` | 寫入 Eagle 日誌檔 |
| `error()` | `console.error()` | 寫入 Eagle 日誌檔 |

### 日誌檔位置

在 Eagle 中，日誌寫入外掛的日誌檔：
- **macOS：** `~/Library/Logs/Eagle/plugins/<plugin-id>.log`
- **Windows：** `%APPDATA%\Eagle\Logs\plugins\<plugin-id>.log`

## 最佳實踐

### ✅ 建議

```tsx
// 帶上下文記錄
eagleApi.log.info('匯出完成', { 
  count: items.length, 
  format: 'png',
  duration: '2.5s' 
});

// 記錄帶有堆疊追蹤的錯誤
try {
  await riskyOperation();
} catch (error) {
  eagleApi.log.error('操作失敗', {
    message: error.message,
    stack: error.stack,
  });
}

// 使用適當的日誌層級
eagleApi.log.info('正常操作');
eagleApi.log.warn('潛在問題');
eagleApi.log.error('實際錯誤');

// 為元件日誌加上前綴
eagleApi.log.info('[ImageEditor] 圖片已載入', { id });
```

### ❌ 避免

```tsx
// 不要記錄敏感資料
eagleApi.log('使用者密碼：', password);
eagleApi.log('API 金鑰：', apiKey);

// 不要記錄過多資料
eagleApi.log('所有項目：', allItems);  // 可能有數千個

// 不要在緊密迴圈中記錄
for (const item of items) {
  eagleApi.log('正在處理', item);  // 太多日誌！
}

// 改為記錄摘要
eagleApi.log.info('正在處理項目', { count: items.length });
// ... 處理所有項目 ...
eagleApi.log.info('處理完成', { count: items.length });
```

## 相關資源

- [Eagle API 概覽](./overview) - API 介紹
- [事件與生命週期](./events-lifecycle) - 外掛生命週期事件
- [錯誤邊界](../components/error/error-boundary) - 錯誤處理 UI
