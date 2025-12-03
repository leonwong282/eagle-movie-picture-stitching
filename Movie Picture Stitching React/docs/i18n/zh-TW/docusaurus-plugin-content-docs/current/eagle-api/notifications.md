---
sidebar_position: 8
title: 通知
description: 系統通知和警示
---

# 通知

在外掛視窗外顯示系統通知以提醒使用者。

## 匯入

```tsx
import { eagleApi } from '@/lib/eagle-api';
```

## 顯示通知

顯示系統通知。

```tsx
await eagleApi.notification.show(options);
```

### 選項

| 選項 | 類型 | 必要 | 說明 |
|------|------|------|------|
| `title` | `string` | 是 | 通知標題 |
| `body` | `string` | 否 | 通知內文 |
| `silent` | `boolean` | 否 | 靜音通知 |

### 基本範例

```tsx
await eagleApi.notification.show({
  title: '匯出完成',
  body: '10 張圖片已成功匯出。',
});
```

### 靜音通知

```tsx
await eagleApi.notification.show({
  title: '背景任務',
  body: '處理完成。',
  silent: true,  // 無聲音
});
```

## 常見模式

### 匯出完成

```tsx
async function notifyExportComplete(count: number, folder: string) {
  await eagleApi.notification.show({
    title: '匯出完成',
    body: `${count} 張圖片已儲存到 ${folder}`,
  });
}
```

### 錯誤通知

```tsx
async function notifyError(operation: string, error: string) {
  await eagleApi.notification.show({
    title: `${operation} 失敗`,
    body: error,
  });
}
```

### 進度通知

```tsx
async function notifyProgress(current: number, total: number) {
  // 僅在里程碑時通知
  const percentage = Math.round((current / total) * 100);
  
  if (percentage === 50 || percentage === 100) {
    await eagleApi.notification.show({
      title: '處理中...',
      body: `已完成 ${percentage}%（${current}/${total}）`,
      silent: true,
    });
  }
}
```

### 批次操作摘要

```tsx
interface BatchResult {
  success: number;
  failed: number;
  skipped: number;
}

async function notifyBatchComplete(result: BatchResult) {
  const { success, failed, skipped } = result;
  
  if (failed > 0) {
    await eagleApi.notification.show({
      title: '批次完成但有錯誤',
      body: `✓ ${success} 成功、✗ ${failed} 失敗、⊘ ${skipped} 跳過`,
    });
  } else {
    await eagleApi.notification.show({
      title: '批次完成',
      body: `成功處理 ${success} 個項目。`,
    });
  }
}
```

## 何時使用通知

### ✅ 適合使用通知

- **長時間執行的任務**在背景完成時
- **重要警示**當外掛視窗隱藏時
- **錯誤**需要立即注意時
- **完成狀態**批次操作的狀態

### ❌ 不適合使用通知

- **每個小動作**（改用 toast）
- **持續更新**（會顯示太多通知）
- **外掛內回饋**（使用 UI 元件）
- **非必要資訊**

## 通知 vs Toast

| 特性 | 通知 | Toast |
|------|------|-------|
| 可見性 | 系統層級 | 僅外掛視窗 |
| 持續性 | 留在通知中心 | 自動消失 |
| 使用情境 | 背景任務 | 即時回饋 |
| 干擾程度 | 高 | 低 |

### 範例：選擇正確的回饋方式

```tsx
async function processImages(images: ImageItem[]) {
  // 開始：使用 toast（使用者在外掛中）
  toast.info(`正在處理 ${images.length} 張圖片...`);
  
  for (const image of images) {
    await processImage(image);
  }
  
  // 完成：如果視窗可能隱藏則使用通知
  if (document.hidden) {
    await eagleApi.notification.show({
      title: '處理完成',
      body: `已處理 ${images.length} 張圖片`,
    });
  } else {
    toast.success('處理完成！');
  }
}
```

## 瀏覽器 vs Eagle 行為

| 方法 | 瀏覽器（模擬） | Eagle |
|------|----------------|-------|
| `show()` | 使用 Web Notification API（如果允許） | 使用系統通知 |

### 瀏覽器備援

在瀏覽器開發中，模擬系統使用 Web Notification API：

```tsx
// 在模擬模式下，可能需要權限
if ('Notification' in window && Notification.permission === 'granted') {
  new Notification(title, { body });
}
```

## 最佳實踐

### ✅ 建議

```tsx
// 標題保持簡短明確
title: '匯出完成'  // 好
title: '匯出操作已成功完成'  // 太長

// 提供可操作的資訊
body: '10 張圖片已儲存到桌面/匯出'

// 非緊急更新使用靜音
silent: true  // 用於進度更新

// 通知前檢查可見性
if (document.hidden) {
  await eagleApi.notification.show({ ... });
}
```

### ❌ 避免

```tsx
// 不要濫發通知
for (const item of items) {
  await eagleApi.notification.show({ title: `正在處理 ${item.name}` });
  // 會顯示數百個通知！
}

// 不要用於外掛內回饋
await eagleApi.notification.show({ title: '按鈕已點擊' });
// 改用 toast

// 不要包含敏感資料
body: `密碼：${password}`  // 安全風險！
```

## 整合範例

```tsx
function useNotificationFeedback() {
  const wasHidden = useRef(false);

  // 追蹤操作期間視窗是否曾隱藏
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        wasHidden.current = true;
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  const notify = useCallback(async (title: string, body: string) => {
    // 僅在視窗曾隱藏時顯示系統通知
    if (wasHidden.current) {
      await eagleApi.notification.show({ title, body });
      wasHidden.current = false;
    } else {
      // 視窗可見時使用 toast
      toast.success(body);
    }
  }, []);

  return { notify };
}

// 使用方式
function ExportButton() {
  const { notify } = useNotificationFeedback();

  const handleExport = async () => {
    const count = await exportImages();
    await notify('匯出完成', `已匯出 ${count} 張圖片`);
  };

  return <Button onClick={handleExport}>匯出</Button>;
}
```

## 相關資源

- [Eagle API 概覽](./overview) - API 介紹
- [Toast 元件](../components/ui/toast) - 外掛內通知
- [事件與生命週期](./events-lifecycle) - 外掛可見性事件
