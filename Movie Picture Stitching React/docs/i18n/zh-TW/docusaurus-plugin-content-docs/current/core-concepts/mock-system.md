---
sidebar_position: 3
title: 模擬系統
description: 用於瀏覽器開發和測試的可配置模擬資料
---

# 模擬系統

模擬系統為瀏覽器開發提供可配置的假資料。測試邊界情況、壓力測試效能，並在沒有執行 Eagle 的情況下進行開發。

## 概覽

在瀏覽器中執行時（`npm run dev`），Eagle API 會被模擬實作取代：

```typescript
import { eagleApi } from '@/lib/eagle-api';

console.log(eagleApi.isMock); // 瀏覽器中為 true

const items = await eagleApi.getSelectedItems();
// 返回具有真實資料結構的模擬項目
```

## 快速配置

### URL 參數

直接在 URL 中配置模擬：

```
http://localhost:5173/?mockItems=50&mockPreset=largeLibrary&mockTheme=dark
```

| 參數 | 值 | 描述 |
|-----------|--------|-------------|
| `mockItems` | `0-1000` | 模擬項目數量 |
| `mockFolders` | `0-100` | 模擬資料夾數量 |
| `mockPreset` | 預設名稱 | 使用預設配置 |
| `mockTheme` | `light`, `dark` | 強制主題 |
| `mockLocale` | `en`, `zh_CN` 等 | 強制語系 |

### 主控台 API

用於動態測試，使用全域 `mockEagle` 物件：

```javascript
// 在瀏覽器 DevTools 主控台中

// 載入預設
window.mockEagle.preset('largeLibrary');

// 自訂配置
window.mockEagle.setConfig({
  selectedItemCount: 100,
  folderCount: 20,
  theme: 'DARK',
});

// 模擬 API 錯誤
window.mockEagle.simulateError('getSelectedItems', 'Network timeout');

// 重置為預設值
window.mockEagle.reset();
```

## 預設

常見測試需求的預配置場景：

| 預設 | 項目 | 資料夾 | 使用情境 |
|--------|-------|---------|----------|
| `empty` | 0 | 0 | 空狀態 UI |
| `single` | 1 | 1 | 單一項目處理 |
| `default` | 10 | 3 | 正常使用 |
| `largeLibrary` | 100 | 20 | 效能測試 |
| `stressTest` | 1000 | 50 | 壓力測試 |

### 使用預設

```javascript
// 主控台
window.mockEagle.preset('stressTest');

// URL
http://localhost:5173/?mockPreset=largeLibrary
```

## 程式化配置

### 在程式碼中

```typescript
import { mockController, createMockItems } from '@/lib/mock-factory';

// 設定配置
mockController.setConfig({
  selectedItemCount: 50,
  folderCount: 10,
  theme: 'DARK',
  locale: 'zh_CN',
});

// 建立自訂項目
const customItems = createMockItems(20, {
  ext: 'png',
  tags: ['processed'],
  star: 5,
});

mockController.setConfig({ customItems });
```

### 模擬工廠函式

```typescript
import {
  createMockItem,
  createMockItems,
  createMockFolder,
  createMockFolders,
  createMockTag,
  createMockTags,
} from '@/lib/mock-factory';

// 帶選項的單一項目
const item = createMockItem({
  name: '測試圖片',
  ext: 'png',
  width: 1920,
  height: 1080,
  tags: ['test', 'mock'],
});

// 多個項目
const items = createMockItems(50, {
  ext: 'jpg',
  star: 3,
});

// 資料夾階層
const folders = createMockFolders(5, {
  childCount: 3, // 每個 3 個子資料夾
});

// 標籤
const tags = createMockTags(20);
```

## 模擬資料結構

### 模擬項目

```typescript
interface MockItem {
  id: string;              // 'mock-item-1'
  name: string;            // 'Mock Image 1'
  ext: string;             // 'png', 'jpg' 等
  width: number;           // 1920
  height: number;          // 1080
  size: number;            // 檔案大小（位元組）
  filePath: string;        // '/mock/path/to/image.png'
  thumbnailURL: string;    // Data URL 或佔位符
  tags: string[];          // ['tag1', 'tag2']
  folders: string[];       // 資料夾 ID
  star: number;            // 0-5
  annotation: string;      // 使用者備註
  url: string;             // 來源 URL
  modificationTime: number; // Unix 時間戳
  // ... 更多屬性
}
```

### 模擬資料夾

```typescript
interface MockFolder {
  id: string;              // 'mock-folder-1'
  name: string;            // 'Mock Folder 1'
  children: MockFolder[];  // 子資料夾
  // ... 更多屬性
}
```

## 錯誤模擬

透過模擬 API 失敗來測試錯誤處理：

```javascript
// 模擬網路錯誤
window.mockEagle.simulateError('getSelectedItems', 'Network timeout');

// 模擬空回應
window.mockEagle.simulateError('getSelectedItems', null);

// 清除錯誤模擬
window.mockEagle.clearErrors();
```

### 在您的程式碼中

```tsx
async function fetchItems() {
  try {
    const items = await eagleApi.getSelectedItems();
    setItems(items);
  } catch (error) {
    // 這也會捕捉模擬的錯誤
    showErrorToast(error.message);
  }
}
```

## 主題與語系模擬

### 主題

```javascript
// 強制深色模式
window.mockEagle.setConfig({ theme: 'DARK' });

// 強制淺色模式
window.mockEagle.setConfig({ theme: 'LIGHT' });

// 測試自動主題
window.mockEagle.setConfig({ theme: 'Auto' });
```

### 語系

```javascript
// 測試不同語言
window.mockEagle.setConfig({ locale: 'ja_JP' }); // 日文
window.mockEagle.setConfig({ locale: 'zh_CN' }); // 中文
window.mockEagle.setConfig({ locale: 'de_DE' }); // 德文
```

## 測試模式

### 單元測試

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { mockController, createMockItems } from '@/lib/mock-factory';

describe('ItemList', () => {
  beforeEach(() => {
    mockController.reset();
  });

  it('沒有項目時顯示空狀態', async () => {
    mockController.preset('empty');
    
    render(<ItemList />);
    
    expect(screen.getByText('未選擇項目')).toBeInTheDocument();
  });

  it('處理大量資料集', async () => {
    mockController.setConfig({ selectedItemCount: 1000 });
    
    render(<ItemList />);
    
    // 應使用虛擬化
    expect(screen.queryAllByRole('listitem').length).toBeLessThan(100);
  });
});
```

### 整合測試

```typescript
import { test, expect } from '@playwright/test';

test('使用預設載入', async ({ page }) => {
  await page.goto('/?mockPreset=largeLibrary');
  
  // 應顯示 100 個項目
  await expect(page.getByText('100 個項目')).toBeVisible();
});
```

## 最佳實踐

### 1. 對常見場景使用預設

```javascript
// 不要每次都手動配置
// ❌ 
mockController.setConfig({ selectedItemCount: 100, folderCount: 20 });

// ✅
mockController.preset('largeLibrary');
```

### 2. 測試之間重置

```typescript
beforeEach(() => {
  mockController.reset();
});
```

### 3. 測試邊界情況

```javascript
// 空狀態
mockController.preset('empty');

// 單一項目（邊界條件）
mockController.preset('single');

// 大量資料集（效能）
mockController.preset('stressTest');
```

### 4. 記錄模擬依賴

```typescript
// 如果測試需要特定的模擬資料，請記錄它
/**
 * @requires mockPreset: largeLibrary
 * @requires mockTheme: DARK
 */
it('使用深色主題渲染網格', async () => {
  mockController.preset('largeLibrary');
  mockController.setConfig({ theme: 'DARK' });
  // ...
});
```

## 下一步

- **[主題與 i18n](./theme-i18n)** — 與 Eagle 設定同步
- **[元件](/docs/components/overview)** — UI 元件
