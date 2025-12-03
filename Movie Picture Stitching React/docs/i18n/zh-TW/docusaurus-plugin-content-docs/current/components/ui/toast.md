---
sidebar_position: 4
title: Toast
description: 支援 4 種類型和自動消失的非阻塞通知系統
---

# Toast

一個用於顯示回饋訊息的非阻塞通知系統。支援 4 種類型（success、error、warning、info），具有自動消失和手動關閉功能。

## 匯入

```tsx
import { ToastProvider, useToast, toast } from '@/components';
import type { Toast, ToastType } from '@/components';
```

## 設定

使用 `ToastProvider` 包裝您的應用程式：

```tsx
// App.tsx 或 main.tsx
import { ToastProvider } from '@/components';

function App() {
  return (
    <ToastProvider>
      <YourApp />
    </ToastProvider>
  );
}
```

## 基本用法

```tsx
import { useToast, toast } from '@/components';

function MyComponent() {
  const { addToast } = useToast();

  const handleSuccess = () => {
    addToast(toast.success('已儲存！', '您的變更已儲存。'));
  };

  return <Button onClick={handleSuccess}>儲存</Button>;
}
```

## Toast 類型

### Success

帶有勾選圖示的綠色 toast。4 秒後自動消失。

```tsx
addToast(toast.success('成功！', '操作已完成。'));
```

### Error

帶有警示圖示的紅色 toast。預設**不會**自動消失（保持直到手動關閉）。

```tsx
addToast(toast.error('錯誤', '發生了錯誤。'));

// 帶自動消失（5 秒）
addToast(toast.error('錯誤', '發生了錯誤。', 5000));
```

### Warning

帶有警告圖示的黃色/琥珀色 toast。

```tsx
addToast(toast.warning('警告', '請檢查您的輸入。'));
```

### Info

帶有資訊圖示的藍色 toast。

```tsx
addToast(toast.info('資訊', '這是一些資訊。'));
```

## API

### useToast Hook

```tsx
const { toasts, addToast, removeToast } = useToast();
```

| 回傳 | 型別 | 描述 |
|--------|------|-------------|
| `toasts` | `Toast[]` | 當前 toast 物件的陣列 |
| `addToast` | `(toast: Omit<Toast, 'id'>) => void` | 新增一個 toast |
| `removeToast` | `(id: string) => void` | 依 ID 移除 toast |

### toast 輔助函式

建立 toast 物件的便利函式：

```tsx
toast.success(title: string, description?: string, duration?: number)
toast.error(title: string, description?: string, duration?: number)
toast.warning(title: string, description?: string, duration?: number)
toast.info(title: string, description?: string, duration?: number)
```

| 參數 | 型別 | 預設值 | 描述 |
|-----------|------|---------|-------------|
| `title` | `string` | — | Toast 標題（必填） |
| `description` | `string` | — | 可選的描述文字 |
| `duration` | `number` | 4000（error 為 0） | 自動消失時間（毫秒）。0 = 不自動消失 |

### Toast 物件

```tsx
interface Toast {
  id: string;          // 自動產生的唯一 ID
  type: ToastType;     // 'success' | 'error' | 'warning' | 'info'
  title: string;       // 主要訊息
  description?: string; // 可選的詳細文字
  duration?: number;   // 自動消失時間（毫秒）
}
```

## 範例

### 表單提交

```tsx
const handleSubmit = async (data) => {
  try {
    await saveData(data);
    addToast(toast.success('已儲存！', '您的設定已更新。'));
  } catch (error) {
    addToast(toast.error('儲存失敗', error.message));
  }
};
```

### 搭配載入狀態

```tsx
const handleExport = async () => {
  const processingToast = toast.info('匯出中...', '請稍候。');
  addToast(processingToast);
  
  try {
    await exportImages();
    removeToast(processingToast.id); // 移除「匯出中...」toast
    addToast(toast.success('匯出完成', '已匯出 10 張圖片。'));
  } catch (error) {
    removeToast(processingToast.id);
    addToast(toast.error('匯出失敗', error.message));
  }
};
```

### 帶操作的確認

```tsx
// 注意：目前的實作不支援 toast 中的操作按鈕。
// 對於確認操作，請改用 Dialog 元件。

// 簡單通知
addToast(toast.warning(
  '未儲存的變更', 
  '您有未儲存的變更將會遺失。'
));
```

### 自訂持續時間

```tsx
// 快速通知（2 秒）
addToast(toast.info('已複製！', undefined, 2000));

// 較長通知（10 秒）
addToast(toast.warning('需要審核', '請在繼續之前審核。', 10000));

// 永久（直到關閉）
addToast(toast.error('嚴重錯誤', '請聯繫支援。', 0));
```

## 定位

Toast 出現在螢幕的**右下角**並垂直堆疊：

```tsx
// Toast 容器樣式（內建）
<div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
  {/* Toast 在此渲染 */}
</div>
```

## 樣式

每種 toast 類型有不同的顏色：

| 類型 | 淺色模式 | 深色模式 |
|------|------------|-----------|
| `success` | 綠色背景 | 深綠色背景 |
| `error` | 紅色背景 | 深紅色背景 |
| `warning` | 琥珀色背景 | 深琥珀色背景 |
| `info` | 天藍色背景 | 深天藍色背景 |

Toast 包含：
- 類型專用圖示（CheckCircle、AlertCircle、AlertTriangle、Info）
- 關閉按鈕（X）
- 進入時的上滑動畫

## 無障礙

- **ARIA**：容器有 `aria-live="polite"` 用於螢幕閱讀器播報
- **角色**：每個 toast 有 `role="alert"`
- **鍵盤**：關閉按鈕可聚焦且支援鍵盤存取
- **動態**：使用細微的滑動動畫（遵守 `prefers-reduced-motion`）

## 最佳實踐

### 應該

```tsx
// ✅ 提供可操作的資訊
addToast(toast.error('儲存失敗', '請檢查您的網路連線並重試。'));

// ✅ 保持訊息簡潔
addToast(toast.success('已儲存！'));

// ✅ 使用適當的類型
addToast(toast.warning('磁碟空間不足'));  // 警告，而非錯誤
```

### 不應該

```tsx
// ❌ 不要將 toast 用於重要確認
// 對於危險操作請改用 Dialog

// ❌ 不要同時顯示太多 toast
// 它們會堆疊並可能讓使用者感到不知所措

// ❌ 不要將 toast 用於表單驗證
// 請改為顯示內嵌錯誤
```

## TypeScript

```tsx
import type { Toast, ToastType } from '@/components';

// 型別安全的 toast 建立
const myToast: Omit<Toast, 'id'> = {
  type: 'success',
  title: '完成！',
  description: '所有任務已完成。',
  duration: 3000,
};

addToast(myToast);
```
