---
sidebar_position: 1
title: Eagle API 概覽
description: 了解 Eagle Plugin API 和適配器模式
---

# Eagle API 概覽

Eagle React Template 提供 Eagle Plugin API 的**類型安全包裝器**，讓開發者能在瀏覽器和 Eagle 執行環境中無縫開發。

## 問題

Eagle 的 Plugin API（`window.eagle`）僅在 Eagle 內執行時可用：

```tsx
// ❌ 在瀏覽器開發時會當機
const items = await window.eagle.item.getSelected();
// TypeError: Cannot read properties of undefined
```

## 解決方案：API 適配器

範本提供 `eagleApi` - 一個在任何地方都能運作的單例適配器：

```tsx
import { eagleApi, isEagleEnvironment } from '@/lib/eagle-api';

// ✅ 在瀏覽器（模擬資料）和 Eagle（真實資料）中都能運作
const items = await eagleApi.item.getSelected();
```

## 架構

```
┌─────────────────────────────────────────────────────┐
│                  您的外掛程式碼                      │
│                                                      │
│   import { eagleApi } from '@/lib/eagle-api'        │
└─────────────────────┬───────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────┐
│                 EagleAPIAdapter                      │
│                                                      │
│   • 環境偵測                                         │
│   • 安全屬性存取（try-catch）                        │
│   • 一致的介面                                       │
└─────────────────────┬───────────────────────────────┘
                      │
          ┌───────────┴───────────┐
          ▼                       ▼
┌─────────────────┐     ┌─────────────────┐
│   瀏覽器模式    │     │    Eagle 模式    │
│                 │     │                 │
│   Mock Factory  │     │  window.eagle   │
│   （假資料）    │     │  （真實 API）   │
└─────────────────┘     └─────────────────┘
```

## 環境偵測

### 檢查執行環境

```tsx
import { isEagleEnvironment, hasNodeRequire } from '@/lib/eagle-api';

// 檢查是否在 Eagle 中執行
if (isEagleEnvironment()) {
  console.log('在 Eagle 桌面應用程式中執行');
} else {
  console.log('在瀏覽器中執行（開發模式）');
}

// 檢查 Node.js require() 是否可用
if (hasNodeRequire()) {
  const fs = require('fs');
  const path = require('path');
}
```

### 適配器屬性

```tsx
import { eagleApi } from '@/lib/eagle-api';

// 環境資訊
eagleApi.isMock        // 瀏覽器中為 true，Eagle 中為 false
eagleApi.isDarkMode    // 從 Eagle 主題或系統偏好設定計算
eagleApi.locale        // 'en', 'zh_CN', 'zh_TW' 等

// 外掛資訊（僅 Eagle）
eagleApi.plugin.id     // 外掛 UUID
eagleApi.plugin.path   // 外掛安裝路徑
eagleApi.plugin.manifest // 外掛 manifest 物件
```

## API 分類

Eagle API 組織為以下分類：

| 分類 | 說明 | 主要方法 |
|------|------|----------|
| [項目操作](./item-operations) | 處理素材庫項目 | `getSelected`, `addFromPath`, `open` |
| [資料夾操作](./folder-operations) | 管理資料夾 | `getAll`, `create`, `getSelected` |
| [標籤操作](./tag-operations) | 管理標籤 | `getAll`, `create`, `get` |
| [視窗控制](./window-controls) | 外掛視窗 | `show`, `hide`, `setSize` |
| [對話框](./dialogs) | 系統對話框 | `showOpenDialog`, `showSaveDialog` |
| [剪貼簿](./clipboard) | 剪貼簿存取 | `writeText`, `readText`, `writeImage` |
| [通知](./notifications) | 使用者通知 | `showNotification` |
| [事件與生命週期](./events-lifecycle) | 外掛生命週期 | `onPluginCreate`, `onPluginShow` |

## 快速開始

### 取得選取項目

```tsx
import { eagleApi } from '@/lib/eagle-api';

async function showSelection() {
  const items = await eagleApi.item.getSelected();
  
  console.log(`已選取 ${items.length} 個項目`);
  
  items.forEach(item => {
    console.log(`- ${item.name} (${item.ext})`);
    console.log(`  路徑：${item.filePath}`);
    console.log(`  尺寸：${item.width}x${item.height}`);
  });
}
```

### 將圖片加入素材庫

```tsx
import { eagleApi } from '@/lib/eagle-api';

async function addProcessedImage(filePath: string) {
  const itemId = await eagleApi.item.addFromPath(filePath, {
    name: '處理後的圖片',
    tags: ['已處理', '外掛輸出'],
    annotation: '由我的外掛建立',
  });
  
  console.log(`已加入項目：${itemId}`);
}
```

### 顯示系統對話框

```tsx
import { eagleApi } from '@/lib/eagle-api';

async function selectOutputFolder() {
  const result = await eagleApi.dialog.showOpenDialog({
    title: '選擇輸出資料夾',
    properties: ['openDirectory', 'createDirectory'],
  });
  
  if (!result.canceled && result.filePaths.length > 0) {
    return result.filePaths[0];
  }
  return null;
}
```

## 安全初始化

適配器對所有屬性 getter 使用 try-catch，以處理模組載入和 Eagle 的 `plugin-create` 事件之間的時機問題：

```tsx
// EagleAPIAdapter 內部
get locale(): EagleLocale {
  try {
    return this._api.app?.locale || 'en';
  } catch {
    return 'en';  // API 就緒前的安全預設值
  }
}
```

這允許在模組初始化期間安全存取：

```tsx
// 可以在模組層級安全使用
import { eagleApi } from '@/lib/eagle-api';

const initialLocale = eagleApi.locale; // 不會拋出例外
```

## 模擬系統

在瀏覽器開發中，適配器回傳模擬資料：

```tsx
// 瀏覽器開發模式
const items = await eagleApi.item.getSelected();
// 回傳：[{ id: 'mock-1', name: 'Sample Image', ... }, ...]
```

配置模擬行為：

```tsx
// URL 參數
// ?mockItems=50 - 設定模擬項目數量
// ?mockPreset=largeLibrary - 使用預設配置

// Console API
window.mockEagle.preset('largeLibrary');
window.mockEagle.simulateError('getSelectedItems', 'Network error');
window.mockEagle.reset();
```

詳見[模擬系統](../core-concepts/mock-system)。

## 類型安全

所有 API 方法的完整 TypeScript 定義：

```tsx
import type { 
  EagleItem, 
  EagleFolder, 
  EagleTag,
  OpenDialogOptions,
  SaveDialogOptions,
} from '@/types/eagle';

// 類型安全的項目存取
const items: EagleItem[] = await eagleApi.item.getSelected();
items.forEach(item => {
  const name: string = item.name;
  const tags: string[] = item.tags;
  const rating: number = item.star;  // 0-5
});
```

## 最佳實踐

### ✅ 建議

```tsx
// 永遠使用適配器
import { eagleApi } from '@/lib/eagle-api';
const items = await eagleApi.item.getSelected();

// 需要時檢查環境
if (isEagleEnvironment()) {
  // Eagle 專用程式碼
}

// 優雅處理錯誤
try {
  await eagleApi.item.addFromPath(path, options);
} catch (error) {
  toast.error('新增項目失敗', error.message);
}
```

### ❌ 避免

```tsx
// 永遠不要直接存取 window.eagle
const items = await window.eagle.item.getSelected(); // 瀏覽器中會當機！

// 不要假設 Eagle 總是可用
if (window.eagle) { // 脆弱的檢查
  // ...
}
```

## 相關資源

- [項目操作](./item-operations) - 處理素材庫項目
- [模擬系統](../core-concepts/mock-system) - 模擬配置
- [雙重環境](../core-concepts/dual-environment) - 環境模式
