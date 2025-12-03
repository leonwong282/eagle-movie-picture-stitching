---
sidebar_position: 4
title: 除錯
description: 除錯工具與技巧
---

# 除錯

在瀏覽器與 Eagle 環境中除錯 Eagle 外掛的工具與技巧。

## DevTools 存取

### 瀏覽器開發

標準瀏覽器 DevTools：
- **Chrome/Edge：** `F12` 或 `Cmd+Option+I`（Mac）/ `Ctrl+Shift+I`（Windows）
- **Firefox：** `F12` 或 `Cmd+Option+I` / `Ctrl+Shift+I`

### Eagle 外掛

當 `manifest.json` 中設定 `devTools: true` 時：

| 平台 | 快捷鍵 |
|------|--------|
| macOS | `Cmd + Option + I` |
| Windows | `F12` 或 `Ctrl + Shift + I` |

## 記錄

### Eagle API 記錄

使用 `eagleApi.log` 進行結構化記錄：

```typescript
import { eagleApi } from '@/lib/eagle-api';

// 不同的記錄層級
eagleApi.log.info('Operation started');
eagleApi.log.warn('Deprecated API used');
eagleApi.log.error('Operation failed', error);
eagleApi.log.debug('Debug info', data);
```

### 各環境的記錄行為

| 方法 | 瀏覽器 | Eagle |
|------|--------|-------|
| `log.info()` | `console.log()` | Eagle 記錄檔 |
| `log.warn()` | `console.warn()` | Eagle 記錄檔 |
| `log.error()` | `console.error()` | Eagle 記錄檔 |
| `log.debug()` | `console.debug()` | Eagle 記錄檔 |

### 自訂記錄器

```typescript
// lib/logger.ts
const isDev = import.meta.env.DEV;

export const logger = {
  debug: (...args: unknown[]) => {
    if (isDev) {
      console.debug('[DEBUG]', ...args);
      eagleApi.log.debug(args.join(' '));
    }
  },
  
  info: (...args: unknown[]) => {
    console.info('[INFO]', ...args);
    eagleApi.log.info(args.join(' '));
  },
  
  warn: (...args: unknown[]) => {
    console.warn('[WARN]', ...args);
    eagleApi.log.warn(args.join(' '));
  },
  
  error: (...args: unknown[]) => {
    console.error('[ERROR]', ...args);
    eagleApi.log.error(args.join(' '));
  },
};
```

## 主控台命令

### 環境檢查

```javascript
// 檢查環境
eagleApi.isMock           // 瀏覽器中為 true，Eagle 中為 false

// 檢查 API 可用性
typeof eagle !== 'undefined'  // 瀏覽器中為 false

// 檢查平台
eagleApi.platform         // 'darwin'、'win32' 等

// 檢查語言區域
eagleApi.locale           // 'en'、'zh_CN' 等

// 檢查主題
eagleApi.isDarkMode       // 布林值
```

### 模擬系統（僅瀏覽器）

```javascript
// 檢視設定
window.mockEagle.getConfig()

// 變更模擬資料
window.mockEagle.setConfig({ selectedItemCount: 50 })

// 載入預設值
window.mockEagle.preset('largeLibrary')

// 模擬錯誤
window.mockEagle.simulateError('getSelectedItems', 'API error')

// 清除錯誤
window.mockEagle.clearErrors()

// 全部重設
window.mockEagle.reset()
```

### 儲存除錯

```javascript
// 檢視所有已儲存的資料
storageDebug.viewAll()

// 清除所有儲存
storageDebug.clearAll()

// 檢視特定命名空間
localStorage.getItem('eagle-react-template:settings')
```

### 狀態檢查

```javascript
// 如果使用 Zustand DevTools
// 安裝 Redux DevTools 擴充功能，然後：
// 開啟 DevTools → Redux 分頁 → 選擇 'EaglePlugin' store

// 手動狀態檢查
usePluginStore.getState()
usePluginStore.getState().selection
usePluginStore.getState().settings
```

## React DevTools

### 安裝

1. 安裝 [React DevTools](https://react.dev/learn/react-developer-tools) 瀏覽器擴充功能
2. 在瀏覽器開發與 Eagle 中皆可使用（如果啟用 DevTools）

### 使用方式

- **Components 分頁：** 檢查元件樹、props、狀態
- **Profiler 分頁：** 分析渲染效能
- **搜尋：** 依名稱尋找元件

### 除錯狀態

```javascript
// 在 React DevTools Components 分頁中：
// 1. 選擇一個元件
// 2. 檢查 "hooks" 區段的 useState、useEffect 值
// 3. 右鍵點擊 → "Store as global variable" 以便在主控台存取
```

## 中斷點除錯

### 瀏覽器 DevTools

1. 開啟 Sources 分頁
2. 在 `src/` 資料夾中找到檔案
3. 點擊行號設定中斷點
4. 與應用程式互動以觸發中斷點

### 條件中斷點

右鍵點擊行號 → "Add conditional breakpoint"：

```javascript
// 僅當條件為 true 時中斷
items.length > 10
item.id === 'specific-id'
```

### 記錄點

右鍵點擊行號 → "Add logpoint"：

```javascript
// 記錄但不暫停
'Processing item:', item.name, 'at index', index
```

## 錯誤追蹤

### Error Boundary 記錄

```typescript
// components/ErrorBoundary.tsx
componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
  // 記錄到主控台
  console.error('React Error:', error);
  console.error('Component Stack:', errorInfo.componentStack);
  
  // 記錄到 Eagle
  eagleApi.log.error(`React Error: ${error.message}`);
  eagleApi.log.error(`Stack: ${error.stack}`);
}
```

### 全域錯誤處理器

```typescript
// main.tsx
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  eagleApi.log.error(`Uncaught: ${event.error?.message}`);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled rejection:', event.reason);
  eagleApi.log.error(`Unhandled Promise: ${event.reason}`);
});
```

## 效能除錯

### React Profiler

```tsx
import { Profiler } from 'react';

function onRender(
  id: string,
  phase: 'mount' | 'update',
  actualDuration: number
) {
  if (actualDuration > 16) {  // 超過一個影格
    console.warn(`Slow render: ${id} took ${actualDuration}ms`);
  }
}

<Profiler id="Gallery" onRender={onRender}>
  <Gallery items={items} />
</Profiler>
```

### 效能計時

```typescript
// 測量操作時間
const start = performance.now();
await expensiveOperation();
const duration = performance.now() - start;
console.log(`Operation took ${duration.toFixed(2)}ms`);

// 使用輔助函式
function measureTime<T>(name: string, fn: () => T): T {
  const start = performance.now();
  const result = fn();
  console.log(`${name}: ${(performance.now() - start).toFixed(2)}ms`);
  return result;
}

const result = measureTime('processItems', () => {
  return items.map(processItem);
});
```

### 記憶體分析

1. 開啟 DevTools → Memory 分頁
2. 在操作前拍攝堆積快照
3. 執行操作
4. 在操作後拍攝堆積快照
5. 比較快照以找出洩漏

## 網路除錯

### 監控 Eagle API 呼叫

```typescript
// 包裝 Eagle API 用於除錯
const debugEagleApi = new Proxy(eagleApi, {
  get(target, prop) {
    const value = target[prop];
    if (typeof value === 'function') {
      return (...args: unknown[]) => {
        console.log(`[Eagle API] ${String(prop)}`, args);
        const result = value.apply(target, args);
        if (result instanceof Promise) {
          result.then(r => console.log(`[Eagle API] ${String(prop)} →`, r));
        }
        return result;
      };
    }
    return value;
  },
});
```

## 常見除錯情境

### 選取沒有更新

```javascript
// 檢查輪詢是否啟用
usePluginStore.getState().selection.isPolling

// 檢查最後擷取時間
usePluginStore.getState().selection.lastUpdated

// 強制重新整理
usePluginStore.getState().refreshSelection()

// 在模擬模式中，檢查模擬設定
window.mockEagle.getConfig().selectedItemCount
```

### 主題沒有同步

```javascript
// 檢查目前主題狀態
usePluginStore.getState().settings.theme

// 檢查 Eagle 的主題
eagleApi.isDarkMode

// 檢查 HTML 類別
document.documentElement.classList.contains('dark')
```

### i18n 沒有作用

```javascript
// 檢查目前語言
i18n.language

// 檢查可用語言
i18n.languages

// 強制變更語言
i18n.changeLanguage('zh_CN')

// 檢查翻譯是否存在
i18n.exists('app.title')
```

## 相關資源

- [瀏覽器開發](./browser-dev) - 模擬系統
- [Eagle 監視模式](./eagle-watch) - Eagle 整合
- [測試概觀](../testing/overview) - 測試策略
