---
sidebar_position: 2
title: 瀏覽器開發
description: 用於快速 UI 開發的模擬系統
---

# 瀏覽器開發

瀏覽器開發模式提供完整的模擬 Eagle API，無需 Eagle 桌面應用程式即可進行快速 UI 開發。

## 啟動瀏覽器開發模式

```bash
npm run dev
```

在 `http://localhost:5173` 開啟，包含：
- 熱模組替換（HMR）
- 可設定資料的模擬 Eagle API
- 主控台除錯工具
- URL 參數控制

## 模擬系統概觀

`src/lib/mock-factory.ts` 中的模擬系統提供：

- 模擬的 Eagle API 回應
- 可設定的項目數量與類型
- 用於測試的預設情境
- 邊界情況的錯誤模擬

### 偵測模擬模式

```tsx
import { eagleApi, isEagleEnvironment } from '@/lib/eagle-api';

// 檢查是否在模擬模式下執行
if (eagleApi.isMock) {
  console.log('Running with mock Eagle API');
}

// 檢查環境
if (!isEagleEnvironment()) {
  console.log('Browser development mode');
}
```

## URL 參數

透過 URL 參數控制模擬行為：

| 參數 | 值 | 說明 |
|------|-----|------|
| `mockItems` | `0-1000` | 已選取項目數量 |
| `mockPreset` | 見預設值 | 載入預設設定 |
| `mockTheme` | `light`, `dark` | 強制主題 |
| `mockLocale` | `en`, `zh_CN` 等 | 強制語言區域 |
| `mockErrors` | `true`, `false` | 啟用隨機錯誤 |
| `mockPlatform` | `darwin`, `win32` | 模擬平台 |

### 範例

```
# 50 個已選取項目
http://localhost:5173/?mockItems=50

# 大型資源庫預設
http://localhost:5173/?mockPreset=largeLibrary

# 深色主題搭配日文語言區域
http://localhost:5173/?mockTheme=dark&mockLocale=ja_JP

# 模擬錯誤
http://localhost:5173/?mockErrors=true
```

## 預設值

針對常見測試需求預先設定的情境：

| 預設值 | 項目 | 資料夾 | 標籤 | 使用案例 |
|--------|------|--------|------|----------|
| `empty` | 0 | 0 | 0 | 空狀態測試 |
| `single` | 1 | 1 | 1 | 單一項目情境 |
| `default` | 10 | 3 | 5 | 一般使用 |
| `largeLibrary` | 100 | 20 | 50 | 效能測試 |
| `stressTest` | 1000 | 50 | 200 | 壓力測試 |

### 檔案類型預設值

| 預設值 | 內容 |
|--------|------|
| `imagesOnly` | JPG、PNG、GIF、WebP 檔案 |
| `videosOnly` | MP4、WebM、MOV 檔案 |
| `mixedMedia` | 圖片 + 影片 |
| `documents` | PDF、DOC、TXT 檔案 |
| `design` | PSD、AI、Sketch、Figma 檔案 |

## 主控台命令

透過瀏覽器主控台存取模擬控制：

### 設定

```javascript
// 檢視目前設定
window.mockEagle.getConfig();

// 設定項目數量
window.mockEagle.setConfig({ selectedItemCount: 50 });

// 多個選項
window.mockEagle.setConfig({
  selectedItemCount: 100,
  folderCount: 20,
  tagCount: 50
});
```

### 預設值

```javascript
// 載入預設值
window.mockEagle.preset('largeLibrary');
window.mockEagle.preset('stressTest');
window.mockEagle.preset('empty');

// 重設為預設值
window.mockEagle.reset();
```

### 錯誤模擬

```javascript
// 模擬 API 錯誤
window.mockEagle.simulateError('getSelectedItems', 'API unavailable');
window.mockEagle.simulateError('addFromPath', 'Permission denied');

// 清除所有模擬錯誤
window.mockEagle.clearErrors();

// 檢查作用中的錯誤
window.mockEagle.getErrors();
```

### 資料檢查

```javascript
// 取得目前模擬項目
window.mockEagle.getItems();

// 取得目前模擬資料夾
window.mockEagle.getFolders();

// 取得模擬資源庫資訊
window.mockEagle.getLibrary();
```

## 模擬資料結構

### 模擬項目

```typescript
interface MockItem {
  id: string;           // 'mock-item-1'
  name: string;         // 'Sample Image 1'
  ext: string;          // 'jpg'
  width: number;        // 1920
  height: number;       // 1080
  size: number;         // 1048576（位元組）
  star: number;         // 0-5
  tags: string[];       // ['tag1', 'tag2']
  folders: string[];    // ['folder-1']
  annotation: string;   // ''
  url: string;          // ''
  palettes: [];         // 色彩調色盤
  isDeleted: boolean;   // false
  noThumbnail: boolean; // false
  noPreview: boolean;   // false
  importedAt: number;   // 時間戳記
  modificationTime: number;
  filePath: string;     // '/mock/path/image.jpg'
  fileURL: string;      // 'file:///mock/path/image.jpg'
  thumbnailPath: string;
  thumbnailURL: string;
}
```

### 模擬資料夾

```typescript
interface MockFolder {
  id: string;           // 'mock-folder-1'
  name: string;         // 'Sample Folder'
  description: string;  // ''
  icon: string;         // 'folder'
  iconColor: string;    // '#4A90D9'
  createdAt: number;    // 時間戳記
  children: Folder[];   // 巢狀資料夾
}
```

## 自訂模擬資料

### 程式化設定

```typescript
import { mockController } from '@/lib/mock-factory';

// 在開發程式碼中
if (import.meta.env.DEV) {
  mockController.setConfig({
    selectedItemCount: 25,
    itemTypes: ['jpg', 'png', 'gif'],
    includeStarred: true,
    includeTagged: true,
  });
}
```

### 建立自訂項目

```typescript
import { createMockItem, createMockItems } from '@/lib/mock-factory';

// 單一項目與選項
const item = createMockItem({
  name: 'Custom Image',
  ext: 'png',
  width: 2000,
  height: 1500,
  star: 5,
  tags: ['featured', 'hero'],
});

// 多個項目
const items = createMockItems(10, {
  ext: 'jpg',
  star: 3,
});
```

## 開發技巧

### 測試空狀態

```javascript
window.mockEagle.preset('empty');
// 或
window.mockEagle.setConfig({ selectedItemCount: 0 });
```

### 測試錯誤處理

```javascript
// 模擬網路錯誤
window.mockEagle.simulateError('getSelectedItems', 'Network error');

// 測試錯誤復原
window.mockEagle.clearErrors();
```

### 測試效能

```javascript
// 大型資料集
window.mockEagle.preset('stressTest');

// 在 DevTools 中監控渲染效能
// 效能分頁 → 錄製 → 互動 → 停止
```

### 測試不同平台

```
# macOS 行為
http://localhost:5173/?mockPlatform=darwin

# Windows 行為
http://localhost:5173/?mockPlatform=win32
```

## 限制

模擬模式與真實 Eagle 相比有一些限制：

| 功能 | 模擬 | 真實 Eagle |
|------|------|------------|
| 檔案操作 | 模擬的 | 實際檔案 |
| 縮圖 | 佔位圖片 | 真實縮圖 |
| 選取同步 | 手動重新整理 | 即時更新 |
| 資源庫變更 | 不持久化 | 持久化 |
| 視窗控制 | 無操作 | 實際視窗 |

## 相關資源

- [Eagle 監視模式](./eagle-watch) - 使用真實 Eagle 測試
- [除錯](./debugging) - 除錯工具與技巧
- [模擬系統](../core-concepts/mock-system) - 架構詳情
