---
sidebar_position: 6
title: 對話框
description: 用於檔案選擇和訊息的原生系統對話框
---

# 對話框

顯示用於檔案選擇、儲存和訊息的原生系統對話框。

## 匯入

```tsx
import { eagleApi } from '@/lib/eagle-api';
```

## 開啟對話框

顯示檔案/資料夾選擇對話框。

```tsx
const result = await eagleApi.dialog.showOpenDialog(options);
```

### 選項

| 選項 | 類型 | 說明 |
|------|------|------|
| `title` | `string` | 對話框視窗標題 |
| `defaultPath` | `string` | 初始目錄路徑 |
| `buttonLabel` | `string` | 自訂確認按鈕文字 |
| `filters` | `FileFilter[]` | 檔案類型篩選器 |
| `properties` | `string[]` | 對話框行為旗標 |
| `message` | `string` | 檔案列表上方的訊息（macOS） |

### 屬性

| 屬性 | 說明 |
|------|------|
| `openFile` | 允許選擇檔案 |
| `openDirectory` | 允許選擇目錄 |
| `multiSelections` | 允許多選 |
| `showHiddenFiles` | 顯示隱藏檔案 |
| `createDirectory` | 允許建立目錄 |
| `promptToCreate` | 提示建立不存在的路徑 |

### FileFilter 類型

```tsx
interface FileFilter {
  name: string;        // 篩選器顯示名稱
  extensions: string[]; // 副檔名（不含點號）
}
```

### 回傳值

```tsx
interface OpenDialogResult {
  canceled: boolean;    // 如果使用者取消則為 true
  filePaths: string[];  // 選取的檔案/資料夾路徑
}
```

### 範例：選擇圖片

```tsx
async function selectImages() {
  const result = await eagleApi.dialog.showOpenDialog({
    title: '選擇圖片',
    properties: ['openFile', 'multiSelections'],
    filters: [
      { name: '圖片', extensions: ['png', 'jpg', 'jpeg', 'gif', 'webp'] },
      { name: '所有檔案', extensions: ['*'] },
    ],
  });

  if (result.canceled) {
    return null;
  }

  return result.filePaths;
}
```

### 範例：選擇資料夾

```tsx
async function selectOutputFolder() {
  const result = await eagleApi.dialog.showOpenDialog({
    title: '選擇輸出資料夾',
    properties: ['openDirectory', 'createDirectory'],
    buttonLabel: '選擇資料夾',
  });

  if (result.canceled || result.filePaths.length === 0) {
    return null;
  }

  return result.filePaths[0];
}
```

### 範例：單一檔案選擇

```tsx
async function selectFile() {
  const result = await eagleApi.dialog.showOpenDialog({
    title: '選擇檔案',
    properties: ['openFile'],
    filters: [
      { name: 'JSON 檔案', extensions: ['json'] },
    ],
  });

  if (!result.canceled && result.filePaths.length > 0) {
    return result.filePaths[0];
  }
  return null;
}
```

## 儲存對話框

顯示檔案儲存對話框。

```tsx
const result = await eagleApi.dialog.showSaveDialog(options);
```

### 選項

| 選項 | 類型 | 說明 |
|------|------|------|
| `title` | `string` | 對話框視窗標題 |
| `defaultPath` | `string` | 預設檔案名稱或路徑 |
| `buttonLabel` | `string` | 自訂儲存按鈕文字 |
| `filters` | `FileFilter[]` | 檔案類型篩選器 |
| `message` | `string` | 檔案名稱上方的訊息（macOS） |

### 回傳值

```tsx
interface SaveDialogResult {
  canceled: boolean;  // 如果使用者取消則為 true
  filePath: string;   // 選取的儲存路徑（取消則為 undefined）
}
```

### 範例：儲存匯出

```tsx
async function selectExportPath(defaultName: string) {
  const result = await eagleApi.dialog.showSaveDialog({
    title: '匯出圖片',
    defaultPath: defaultName,
    buttonLabel: '匯出',
    filters: [
      { name: 'PNG 圖片', extensions: ['png'] },
      { name: 'JPEG 圖片', extensions: ['jpg'] },
      { name: 'WebP 圖片', extensions: ['webp'] },
    ],
  });

  if (result.canceled) {
    return null;
  }

  return result.filePath;
}
```

### 範例：使用預設副檔名儲存

```tsx
async function saveJSON(defaultName: string = 'data.json') {
  const result = await eagleApi.dialog.showSaveDialog({
    title: '儲存資料',
    defaultPath: defaultName,
    filters: [
      { name: 'JSON 檔案', extensions: ['json'] },
    ],
  });

  if (!result.canceled && result.filePath) {
    // 確保有 .json 副檔名
    let path = result.filePath;
    if (!path.endsWith('.json')) {
      path += '.json';
    }
    return path;
  }
  return null;
}
```

## 訊息對話框

顯示帶有按鈕的訊息對話框。

```tsx
const result = await eagleApi.dialog.showMessageBox(options);
```

### 選項

| 選項 | 類型 | 說明 |
|------|------|------|
| `type` | `string` | 圖示類型：'none'、'info'、'error'、'question'、'warning' |
| `title` | `string` | 對話框標題 |
| `message` | `string` | 主要訊息文字 |
| `detail` | `string` | 額外詳細文字 |
| `buttons` | `string[]` | 按鈕標籤 |
| `defaultId` | `number` | 預設按鈕索引 |
| `cancelId` | `number` | 取消按鈕索引 |

### 回傳值

```tsx
interface MessageBoxResult {
  response: number;  // 點擊的按鈕索引
}
```

### 範例：確認對話框

```tsx
async function confirmDelete(itemName: string): Promise<boolean> {
  const result = await eagleApi.dialog.showMessageBox({
    type: 'warning',
    title: '確認刪除',
    message: `刪除「${itemName}」？`,
    detail: '此操作無法復原。',
    buttons: ['取消', '刪除'],
    defaultId: 0,
    cancelId: 0,
  });

  return result.response === 1; // 刪除按鈕
}
```

### 範例：儲存變更提示

```tsx
async function promptSaveChanges(): Promise<'save' | 'discard' | 'cancel'> {
  const result = await eagleApi.dialog.showMessageBox({
    type: 'question',
    title: '未儲存的變更',
    message: '您要儲存變更嗎？',
    buttons: ['儲存', '不儲存', '取消'],
    defaultId: 0,
    cancelId: 2,
  });

  switch (result.response) {
    case 0: return 'save';
    case 1: return 'discard';
    default: return 'cancel';
  }
}
```

### 範例：錯誤對話框

```tsx
async function showError(title: string, message: string) {
  await eagleApi.dialog.showMessageBox({
    type: 'error',
    title,
    message,
    buttons: ['確定'],
  });
}
```

## 完整工作流程範例

```tsx
async function exportWorkflow() {
  // 1. 選擇輸出資料夾
  const folder = await selectOutputFolder();
  if (!folder) {
    return; // 使用者取消
  }

  // 2. 處理圖片...
  const results = await processImages();

  // 3. 顯示完成或錯誤訊息
  if (results.errors.length > 0) {
    const proceed = await eagleApi.dialog.showMessageBox({
      type: 'warning',
      title: '匯出完成但有錯誤',
      message: `${results.success} 個成功匯出，${results.errors.length} 個失敗。`,
      buttons: ['檢視錯誤', '確定'],
      defaultId: 1,
    });

    if (proceed.response === 0) {
      showErrorDetails(results.errors);
    }
  } else {
    await eagleApi.dialog.showMessageBox({
      type: 'info',
      title: '匯出完成',
      message: `成功匯出 ${results.success} 張圖片。`,
      buttons: ['確定'],
    });
  }
}
```

## 瀏覽器 vs Eagle 行為

| 方法 | 瀏覽器（模擬） | Eagle |
|------|----------------|-------|
| `showOpenDialog()` | 回傳模擬路徑 | 顯示原生對話框 |
| `showSaveDialog()` | 回傳模擬路徑 | 顯示原生對話框 |
| `showMessageBox()` | 回傳 `{ response: 0 }` | 顯示原生對話框 |

## 最佳實踐

### ✅ 建議

```tsx
// 始終檢查是否取消
const result = await eagleApi.dialog.showOpenDialog(options);
if (result.canceled) return;

// 使用適當的對話框類型
type: 'warning'  // 破壞性操作
type: 'question' // 使用者選擇
type: 'info'     // 資訊
type: 'error'    // 錯誤

// 提供合理的預設值
defaultPath: lastUsedPath || homePath
```

### ❌ 避免

```tsx
// 不要假設對話框總是回傳路徑
const path = result.filePaths[0]; // 可能是 undefined！

// 不要將對話框用於簡單訊息
await showMessageBox({ message: '完成！' }); // 改用 toast

// 不要在沒有回饋的情況下阻塞 UI
await lengthyOperation(); // 顯示載入狀態
```

## 相關資源

- [Eagle API 概覽](./overview) - API 介紹
- [Toast 元件](../components/ui/toast) - 非阻塞式訊息
- [項目操作](./item-operations) - 將檔案加入素材庫
