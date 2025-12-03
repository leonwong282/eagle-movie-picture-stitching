---
sidebar_position: 2
title: 項目操作
description: Eagle 素材庫項目的 CRUD 操作
---

# 項目操作

處理 Eagle 素材庫中的項目（圖片、影片、文件）。這些是最常用的 API 方法。

## 匯入

```tsx
import { eagleApi } from '@/lib/eagle-api';
```

## 取得選取項目

擷取 Eagle 主視窗中目前選取的項目。

```tsx
const items = await eagleApi.item.getSelected();
```

**回傳：** `Promise<EagleItem[]>`

### EagleItem 類型

```tsx
interface EagleItem {
  id: string;              // 唯一項目 ID
  name: string;            // 顯示名稱（不含副檔名）
  ext: string;             // 副檔名（例如 'png', 'jpg'）
  width: number;           // 圖片寬度（像素）
  height: number;          // 圖片高度（像素）
  size: number;            // 檔案大小（位元組）
  filePath: string;        // 絕對檔案路徑
  fileURL: string;         // 檔案 URL（file:// 協定）
  thumbnail: string;       // 縮圖路徑
  
  // 中繼資料
  tags: string[];          // 標籤名稱
  folders: string[];       // 資料夾 ID
  star: number;            // 評分 0-5
  annotation: string;      // 備註/描述
  url: string;             // 來源 URL
  
  // 時間戳記
  modificationTime: number; // 最後修改時間（Unix 毫秒）
  palettes: string[];      // 擷取的色彩調色盤
}
```

### 範例：顯示選取

```tsx
import { eagleApi } from '@/lib/eagle-api';
import { useEffect, useState } from 'react';

function SelectionDisplay() {
  const [items, setItems] = useState<EagleItem[]>([]);

  useEffect(() => {
    async function loadSelection() {
      const selected = await eagleApi.item.getSelected();
      setItems(selected);
    }
    loadSelection();
  }, []);

  return (
    <div>
      <h2>已選取 {items.length} 個項目</h2>
      <ul>
        {items.map(item => (
          <li key={item.id}>
            {item.name}.{item.ext} ({item.width}×{item.height})
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## 依條件取得項目

使用篩選條件查詢項目。

```tsx
const items = await eagleApi.item.get(options);
```

**參數：**

| 選項 | 類型 | 說明 |
|------|------|------|
| `id` | `string` | 單一項目 ID |
| `ids` | `string[]` | 多個項目 ID |
| `isSelected` | `boolean` | 目前選取的項目 |
| `isUntagged` | `boolean` | 沒有標籤的項目 |
| `isUnfiled` | `boolean` | 不在任何資料夾中的項目 |
| `keywords` | `string[]` | 搜尋關鍵字 |
| `tags` | `string[]` | 依標籤篩選 |
| `folders` | `string[]` | 依資料夾 ID 篩選 |
| `ext` | `string` | 依副檔名篩選 |
| `rating` | `number` | 依星級篩選 |

### 範例：取得無標籤圖片

```tsx
const untaggedImages = await eagleApi.item.get({
  isUntagged: true,
  ext: 'png',
});
```

### 範例：依關鍵字搜尋

```tsx
const results = await eagleApi.item.get({
  keywords: ['風景', '山'],
});
```

## 依 ID 取得項目

依 ID 擷取特定項目。

```tsx
const item = await eagleApi.item.getById(itemId);
```

**參數：**
- `itemId: string` - 項目的唯一 ID

**回傳：** `Promise<EagleItem | null>`

```tsx
const item = await eagleApi.item.getById('ABCD1234');
if (item) {
  console.log(`找到：${item.name}`);
} else {
  console.log('找不到項目');
}
```

## 從檔案路徑加入項目

將檔案加入 Eagle 素材庫。

```tsx
const itemId = await eagleApi.item.addFromPath(filePath, options);
```

**參數：**

| 參數 | 類型 | 必要 | 說明 |
|------|------|------|------|
| `filePath` | `string` | 是 | 檔案的絕對路徑 |
| `options.name` | `string` | 否 | 顯示名稱 |
| `options.tags` | `string[]` | 否 | 要套用的標籤 |
| `options.folders` | `string[]` | 否 | 要加入的資料夾 ID |
| `options.annotation` | `string` | 否 | 備註/描述 |
| `options.website` | `string` | 否 | 來源 URL |
| `options.star` | `number` | 否 | 評分 0-5 |

**回傳：** `Promise<string>` - 新項目的 ID

### 範例：加入處理後的圖片

```tsx
async function saveResult(canvas: HTMLCanvasElement) {
  // 將 canvas 儲存到暫存檔
  const tempPath = await saveCanvasToTemp(canvas);
  
  // 加入 Eagle 素材庫
  const itemId = await eagleApi.item.addFromPath(tempPath, {
    name: '處理結果',
    tags: ['已處理', '外掛輸出'],
    annotation: `建立於 ${new Date().toLocaleDateString()}`,
  });
  
  // 清理暫存檔
  await deleteFile(tempPath);
  
  return itemId;
}
```

## 從 URL 加入項目

從 URL 下載並加入圖片。

```tsx
const itemId = await eagleApi.item.addFromURL(url, options);
```

**參數：**

| 參數 | 類型 | 必要 | 說明 |
|------|------|------|------|
| `url` | `string` | 是 | 要下載的圖片 URL |
| `options.name` | `string` | 否 | 顯示名稱 |
| `options.tags` | `string[]` | 否 | 要套用的標籤 |
| `options.folders` | `string[]` | 否 | 資料夾 ID |
| `options.website` | `string` | 否 | 來源網站 |

**回傳：** `Promise<string>` - 新項目的 ID

```tsx
const itemId = await eagleApi.item.addFromURL(
  'https://example.com/image.png',
  {
    name: '下載的圖片',
    website: 'https://example.com',
    tags: ['已下載'],
  }
);
```

## 從 Base64 加入項目

從 base64 編碼字串加入圖片。

```tsx
const itemId = await eagleApi.item.addFromBase64(base64, options);
```

**參數：**

| 參數 | 類型 | 必要 | 說明 |
|------|------|------|------|
| `base64` | `string` | 是 | Base64 編碼的圖片資料 |
| `options.name` | `string` | 否 | 顯示名稱 |
| `options.ext` | `string` | 否 | 副檔名 |
| `options.tags` | `string[]` | 否 | 要套用的標籤 |

**回傳：** `Promise<string>` - 新項目的 ID

```tsx
// 從 canvas
const base64 = canvas.toDataURL('image/png').split(',')[1];
const itemId = await eagleApi.item.addFromBase64(base64, {
  name: 'Canvas 匯出',
  ext: 'png',
});
```

## 加入書籤

將 URL 書籤加入素材庫。

```tsx
const itemId = await eagleApi.item.addBookmark(url, options);
```

```tsx
await eagleApi.item.addBookmark('https://example.com/article', {
  name: '有趣的文章',
  tags: ['參考', '文章'],
});
```

## 開啟項目

在 Eagle 檢視器或外部應用程式中開啟項目。

```tsx
await eagleApi.item.open(itemId);
```

```tsx
// 開啟第一個選取的項目
const items = await eagleApi.item.getSelected();
if (items.length > 0) {
  await eagleApi.item.open(items[0].id);
}
```

## 重新整理縮圖

重新產生項目的縮圖。

```tsx
await eagleApi.item.refreshThumbnail(itemId);
```

在外部修改項目檔案後很有用。

## 取得所有項目

取得素材庫中的所有項目（大型素材庫請謹慎使用）。

```tsx
const allItems = await eagleApi.item.getAll();
```

:::warning 效能
對於有數千個項目的素材庫，這可能會很慢。建議使用帶篩選的 `get()`。
:::

## 瀏覽器 vs Eagle 行為

| 方法 | 瀏覽器（模擬） | Eagle |
|------|----------------|-------|
| `getSelected()` | 回傳模擬項目 | 回傳真實選取 |
| `addFromPath()` | 模擬加入，回傳假 ID | 加入真實檔案 |
| `addFromURL()` | 無網路請求 | 下載圖片 |
| `open()` | 無操作 | 在檢視器中開啟 |

## 錯誤處理

```tsx
try {
  const itemId = await eagleApi.item.addFromPath(filePath, options);
  toast.success(`已加入項目：${itemId}`);
} catch (error) {
  if (error.message.includes('not found')) {
    toast.error('找不到檔案');
  } else if (error.message.includes('permission')) {
    toast.error('權限被拒');
  } else {
    toast.error('加入項目失敗');
  }
}
```

## 相關資源

- [Eagle API 概覽](./overview) - API 介紹
- [資料夾操作](./folder-operations) - 整理項目
- [標籤操作](./tag-operations) - 標籤管理
- [useEagleSelection](../hooks/use-eagle-selection) - 選取 hook
