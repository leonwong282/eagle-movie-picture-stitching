---
sidebar_position: 7
title: 剪貼簿
description: 系統剪貼簿讀寫操作
---

# 剪貼簿

存取系統剪貼簿以讀寫文字、圖片和其他資料。

## 匯入

```tsx
import { eagleApi } from '@/lib/eagle-api';
```

## 文字操作

### 寫入文字

將文字複製到剪貼簿。

```tsx
await eagleApi.clipboard.writeText(text);
```

```tsx
async function copyToClipboard(text: string) {
  await eagleApi.clipboard.writeText(text);
  toast.success('已複製到剪貼簿');
}

// 使用方式
await copyToClipboard('Hello, World!');
await copyToClipboard(JSON.stringify(data, null, 2));
```

### 讀取文字

從剪貼簿讀取文字。

```tsx
const text = await eagleApi.clipboard.readText();
```

```tsx
async function pasteFromClipboard() {
  const text = await eagleApi.clipboard.readText();
  if (text) {
    console.log('剪貼簿內容：', text);
    return text;
  }
  console.log('剪貼簿為空或包含非文字資料');
  return null;
}
```

## HTML 操作

### 寫入 HTML

將 HTML 內容複製到剪貼簿。

```tsx
await eagleApi.clipboard.writeHTML(html);
```

```tsx
const html = '<strong>粗體文字</strong> 和 <em>斜體</em>';
await eagleApi.clipboard.writeHTML(html);
```

### 讀取 HTML

從剪貼簿讀取 HTML。

```tsx
const html = await eagleApi.clipboard.readHTML();
```

## 圖片操作

### 寫入圖片

將圖片複製到剪貼簿。

```tsx
await eagleApi.clipboard.writeImage(nativeImage);
```

:::note
這需要 Electron 的 NativeImage 物件。在瀏覽器模式下，此操作無效。
:::

### 讀取圖片

從剪貼簿讀取圖片。

```tsx
const image = await eagleApi.clipboard.readImage();
```

**回傳：** NativeImage，如果剪貼簿中沒有圖片則為 null。

```tsx
async function pasteImage() {
  const image = await eagleApi.clipboard.readImage();
  if (image && !image.isEmpty()) {
    // 轉換為 data URL 以供顯示
    const dataUrl = image.toDataURL();
    return dataUrl;
  }
  return null;
}
```

## 書籤操作

### 寫入書籤

將書籤（標題 + URL）複製到剪貼簿。

```tsx
await eagleApi.clipboard.writeBookmark(title, url);
```

```tsx
await eagleApi.clipboard.writeBookmark(
  'Eagle - 組織您的設計檔案',
  'https://eagle.cool'
);
```

### 讀取書籤

從剪貼簿讀取書籤。

```tsx
const bookmark = await eagleApi.clipboard.readBookmark();
// { title: string, url: string } 或 undefined
```

## RTF 操作

### 寫入 RTF

複製 Rich Text Format 內容。

```tsx
await eagleApi.clipboard.writeRTF(rtf);
```

### 讀取 RTF

從剪貼簿讀取 RTF。

```tsx
const rtf = await eagleApi.clipboard.readRTF();
```

## 緩衝區操作

### 寫入緩衝區

將原始二進位資料寫入剪貼簿。

```tsx
await eagleApi.clipboard.writeBuffer(format, buffer);
```

**參數：**
- `format: string` - 資料格式識別碼
- `buffer: Buffer` - 二進位資料

### 讀取緩衝區

從剪貼簿讀取原始二進位資料。

```tsx
const buffer = await eagleApi.clipboard.readBuffer(format);
```

## 工具方法

### 清除剪貼簿

移除剪貼簿中的所有內容。

```tsx
await eagleApi.clipboard.clear();
```

### 可用格式

取得剪貼簿中可用格式的列表。

```tsx
const formats = await eagleApi.clipboard.availableFormats();
// ['text/plain', 'text/html', ...]
```

```tsx
async function getClipboardInfo() {
  const formats = await eagleApi.clipboard.availableFormats();
  
  console.log('剪貼簿包含：');
  formats.forEach(format => console.log(`  - ${format}`));
  
  return {
    hasText: formats.includes('text/plain'),
    hasHTML: formats.includes('text/html'),
    hasImage: formats.some(f => f.startsWith('image/')),
  };
}
```

### 檢查內容

檢查剪貼簿是否有特定內容類型。

```tsx
const hasText = await eagleApi.clipboard.has('text/plain');
const hasHTML = await eagleApi.clipboard.has('text/html');
```

## 常見模式

### 帶備援的複製

```tsx
async function smartCopy(content: { text?: string; html?: string }) {
  if (content.html && content.text) {
    // 複製兩種格式
    await eagleApi.clipboard.writeHTML(content.html);
    // 注意：某些應用程式偏好 HTML，其他偏好純文字
  } else if (content.html) {
    await eagleApi.clipboard.writeHTML(content.html);
  } else if (content.text) {
    await eagleApi.clipboard.writeText(content.text);
  }
}
```

### 複製 JSON 資料

```tsx
async function copyAsJSON(data: object) {
  const formatted = JSON.stringify(data, null, 2);
  await eagleApi.clipboard.writeText(formatted);
  toast.success('JSON 已複製到剪貼簿');
}
```

### 從 Canvas 複製圖片

```tsx
async function copyCanvasToClipboard(canvas: HTMLCanvasElement) {
  // 將 canvas 轉換為 blob
  const blob = await new Promise<Blob | null>(resolve => {
    canvas.toBlob(resolve, 'image/png');
  });
  
  if (blob) {
    // 使用 Clipboard API（在瀏覽器中也可用）
    await navigator.clipboard.write([
      new ClipboardItem({ 'image/png': blob }),
    ]);
    toast.success('圖片已複製到剪貼簿');
  }
}
```

### 貼上處理器

```tsx
function usePasteHandler(onPaste: (data: ClipboardData) => void) {
  useEffect(() => {
    async function handlePaste(event: ClipboardEvent) {
      event.preventDefault();
      
      const formats = await eagleApi.clipboard.availableFormats();
      
      if (formats.includes('text/plain')) {
        const text = await eagleApi.clipboard.readText();
        onPaste({ type: 'text', data: text });
      } else if (formats.some(f => f.startsWith('image/'))) {
        const image = await eagleApi.clipboard.readImage();
        onPaste({ type: 'image', data: image });
      }
    }
    
    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [onPaste]);
}
```

### 複製選取資訊

```tsx
async function copySelectionInfo() {
  const items = await eagleApi.item.getSelected();
  
  if (items.length === 0) {
    toast.warning('未選取任何項目');
    return;
  }
  
  const info = items.map(item => ({
    name: item.name,
    size: `${item.width}×${item.height}`,
    path: item.filePath,
  }));
  
  await copyAsJSON(info);
}
```

## 瀏覽器 vs Eagle 行為

| 方法 | 瀏覽器（模擬） | Eagle |
|------|----------------|-------|
| `writeText()` | 使用 navigator.clipboard | 使用 Electron 剪貼簿 |
| `readText()` | 使用 navigator.clipboard | 使用 Electron 剪貼簿 |
| `writeImage()` | 無操作 | 複製 NativeImage |
| `readImage()` | 回傳 null | 回傳 NativeImage |
| `writeHTML()` | 無操作或備援 | 完整支援 |
| `clear()` | navigator.clipboard | 清除所有格式 |

## 最佳實踐

### ✅ 建議

```tsx
// 複製後提供回饋
await eagleApi.clipboard.writeText(text);
toast.success('已複製！');

// 讀取前檢查格式
const formats = await eagleApi.clipboard.availableFormats();
if (formats.includes('text/plain')) {
  const text = await eagleApi.clipboard.readText();
}

// 處理空剪貼簿
const text = await eagleApi.clipboard.readText();
if (!text) {
  toast.info('剪貼簿為空');
  return;
}
```

### ❌ 避免

```tsx
// 不要在沒有回饋的情況下靜默複製
await eagleApi.clipboard.writeText(text);
// 使用者不知道是否成功！

// 不要假設剪貼簿總是有資料
const text = await eagleApi.clipboard.readText();
processText(text); // 可能是空的！

// 不要在沒有確認的情況下清除剪貼簿
await eagleApi.clipboard.clear(); // 使用者的資料消失了！
```

## 相關資源

- [Eagle API 概覽](./overview) - API 介紹
- [項目操作](./item-operations) - 處理項目
- [對話框](./dialogs) - 檔案對話框
