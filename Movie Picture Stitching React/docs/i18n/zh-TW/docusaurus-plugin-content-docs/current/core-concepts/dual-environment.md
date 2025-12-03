---
sidebar_position: 1
title: 雙環境模式
description: 範本如何在瀏覽器和 Eagle 環境中運作
---

# 雙環境模式

Eagle React 範本的核心創新是 **雙環境模式** — 撰寫一次程式碼，在瀏覽器開發和 Eagle 生產環境中無縫運行。

## 挑戰

建立 Eagle 外掛時，您會面臨開發困境：

| 環境 | 優點 | 缺點 |
|-------------|------|------|
| **僅 Eagle** | 真實 API、真實資料 | 無熱重載、迭代緩慢 |
| **僅瀏覽器** | 快速 HMR、DevTools | 無法測試 Eagle 整合 |

雙環境模式讓您 **同時獲得兩者優勢，毫無妥協**。

## 運作原理

```
┌─────────────────────────────────────────────────────────────┐
│                     您的 React 應用程式                      │
│                                                             │
│   - 元件渲染完全相同                                          │
│   - Hooks 以相同方式運作                                      │
│   - 狀態管理不變                                              │
├─────────────────────────────────────────────────────────────┤
│                   EagleAPIAdapter                           │
│         (src/lib/eagle-api.ts - 單例模式)                    │
│                                                             │
│   - 統一 API 介面                                            │
│   - 環境偵測                                                 │
│   - 模擬/真實切換                                            │
├─────────────────┬───────────────────────────────────────────┤
│   瀏覽器開發     │              Eagle 執行環境               │
│  (npm run dev)  │           (已部署的外掛)                   │
├─────────────────┼───────────────────────────────────────────┤
│  模擬 Eagle API │           window.eagle                    │
│  (假資料)       │        (真實 Eagle API)                   │
│                 │                                           │
│  - 可設定       │  - 即時資料庫資料                          │
│  - 即時         │  - 真實選擇                               │
│  - 可預測       │  - 實際檔案路徑                           │
└─────────────────┴───────────────────────────────────────────┘
```

## 環境偵測

範本提供工具函式來偵測當前環境：

```typescript
import { isEagleEnvironment, hasNodeRequire } from '@/lib/eagle-api';

// 檢查是否在 Eagle 內執行
if (isEagleEnvironment()) {
  // window.eagle 可用
  console.log('在 Eagle 中執行！');
} else {
  // 使用模擬 API
  console.log('在瀏覽器中執行');
}

// 檢查 Node.js require() 是否可用
if (hasNodeRequire()) {
  const fs = window.require('fs');
  const path = window.require('path');
}
```

### 實作

```typescript
// src/lib/eagle-api.ts

export const isEagleEnvironment = (): boolean => {
  return typeof window !== 'undefined' && 
         typeof (window as EagleWindow).eagle !== 'undefined';
};

export const hasNodeRequire = (): boolean => {
  return typeof window !== 'undefined' && 
         typeof (window as NodeWindow).require === 'function';
};
```

## 黃金法則

:::danger 關鍵模式
**永遠不要直接存取 `window.eagle`。** 始終使用 `eagleApi` 單例。
:::

```tsx
// ❌ 錯誤：在瀏覽器中會崩潰
const items = await window.eagle.item.getSelected();

// ✅ 正確：在任何地方都能運作
import { eagleApi } from '@/lib/eagle-api';
const items = await eagleApi.getSelectedItems();
```

## 實際範例

### 取得已選擇的項目

```tsx
import { eagleApi } from '@/lib/eagle-api';
import { useEffect, useState } from 'react';

function SelectionDisplay() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    async function fetchItems() {
      // 在兩種環境中都能運作
      const selected = await eagleApi.getSelectedItems();
      setItems(selected);
    }
    fetchItems();
  }, []);

  return (
    <div>
      <p>已選擇：{items.length} 個項目</p>
      {/* 在瀏覽器中：顯示模擬項目 */}
      {/* 在 Eagle 中：顯示真實選擇 */}
    </div>
  );
}
```

### 條件功能

某些功能只在 Eagle 中有意義：

```tsx
import { isEagleEnvironment, eagleApi } from '@/lib/eagle-api';

function ExportButton({ items }) {
  const handleExport = async () => {
    if (!isEagleEnvironment()) {
      // 在瀏覽器中顯示友善訊息
      alert('匯出功能僅在 Eagle 中可用');
      return;
    }

    // 真實匯出邏輯
    for (const item of items) {
      await eagleApi.addItemFromPath(item.filePath, {
        name: `已匯出-${item.name}`,
      });
    }
  };

  return (
    <Button onClick={handleExport}>
      匯出到資料庫
    </Button>
  );
}
```

### 主題同步

```tsx
import { eagleApi } from '@/lib/eagle-api';

function ThemeAwareComponent() {
  // 在兩種環境中都能運作：
  // - 瀏覽器：使用系統偏好或 localStorage
  // - Eagle：使用 Eagle 的主題設定
  const isDark = eagleApi.isDarkMode;

  return (
    <div className={isDark ? 'bg-gray-900' : 'bg-white'}>
      當前主題：{isDark ? '深色' : '淺色'}
    </div>
  );
}
```

## 開發工作流程

### 1. UI 開發（瀏覽器）

```bash
npm run dev
```

- 即時熱重載
- 完整 React DevTools
- 用於測試邊界情況的模擬資料
- 無需安裝 Eagle

### 2. 整合測試（Eagle 監聽）

```bash
npm run build:watch
```

1. 啟動監聽模式
2. 在 Eagle 中匯入專案（設定 → 外掛 → 開發者）
3. 變更後重新載入外掛（`Cmd+R`）
4. 使用真實 Eagle 資料測試

### 3. 生產（部署）

```bash
npm run deploy
```

- 最佳化建置
- 複製到 Eagle 外掛目錄
- 重新啟動 Eagle 以啟用

## 優勢

| 面向 | 瀏覽器開發 | Eagle 執行環境 |
|--------|-------------|---------------|
| **熱重載** | ✅ 即時 | ⚠️ 手動 `Cmd+R` |
| **DevTools** | ✅ 完整 Chrome DevTools | ✅ 內建 DevTools |
| **資料** | 模擬（可設定） | 真實資料庫資料 |
| **檔案系統** | ❌ 不可用 | ✅ 完整存取 |
| **Eagle API** | 模擬實作 | 真實 API |
| **使用情境** | UI 迭代 | 整合測試 |

## 下一步

- **[Eagle API 適配器](./eagle-api-adapter)** — 深入了解適配器模式
- **[模擬系統](./mock-system)** — 設定測試用的模擬資料
- **[主題與 i18n](./theme-i18n)** — 與 Eagle 設定同步
