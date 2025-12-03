---
sidebar_position: 5
title: BatchProcessTemplate
description: 具有進度追蹤的批次操作佈局
---

# BatchProcessTemplate

專為批次處理工作流程設計的範本，具有佇列管理、進度追蹤和狀態視覺化。非常適合批次匯出、轉換和多項目操作。

## 匯入

```tsx
import { BatchProcessTemplate } from '@/templates';
```

## 基本用法

```tsx
import { BatchProcessTemplate } from '@/templates';

function BatchConverter() {
  const [items, setItems] = useState<ProcessItem[]>([]);
  const [status, setStatus] = useState<ProcessStatus>('idle');
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  return (
    <BatchProcessTemplate
      items={items}
      status={status}
      progress={progress}
      onStart={handleStart}
      onPause={handlePause}
      onCancel={handleCancel}
      currentPreview={<ImagePreview item={currentItem} />}
    />
  );
}
```

## 佈局結構

```
┌─────────────────────────────────────┐
│  批次匯出                  [▶ 開始] │  ← 帶控制項的標題列
├──────────────────────────────────────┤
│  進度：████████░░ 80% (8/10)        │  ← 進度條
├──────────┬──────────────────────────┤
│ 佇列     │  目前項目預覽             │
│ ✓ item1  │  ┌─────────────────────┐ │
│ ✓ item2  │  │                     │ │
│ → item3  │  │    處理中...         │ │
│ ○ item4  │  │                     │ │
│ ○ item5  │  └─────────────────────┘ │
└──────────┴──────────────────────────┘
```

## 類型

### ProcessItem

```tsx
interface ProcessItem {
  id: string;
  name: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'skipped';
  error?: string;
  progress?: number;  // 單一項目進度 0-100
  thumbnail?: string;
  metadata?: Record<string, unknown>;
}
```

### ProcessStatus

```tsx
type ProcessStatus = 
  | 'idle'       // 準備開始
  | 'processing' // 目前執行中
  | 'paused'     // 使用者暫停
  | 'completed'  // 所有項目完成
  | 'cancelled'  // 使用者取消
  | 'error';     // 發生嚴重錯誤
```

## Props

| Prop | 類型 | 預設值 | 說明 |
|------|------|--------|------|
| `items` | `ProcessItem[]` | **必要** | 佇列項目 |
| `status` | `ProcessStatus` | `'idle'` | 目前處理狀態 |
| `progress` | `{ current: number; total: number }` | `undefined` | 進度計數器 |
| `currentPreview` | `ReactNode` | `undefined` | 目前項目預覽 |
| `onStart` | `() => void` | `undefined` | 開始按鈕處理器 |
| `onPause` | `() => void` | `undefined` | 暫停按鈕處理器 |
| `onResume` | `() => void` | `undefined` | 繼續按鈕處理器 |
| `onCancel` | `() => void` | `undefined` | 取消按鈕處理器 |
| `onRetry` | `(itemId: string) => void` | `undefined` | 重試失敗項目 |
| `onRemove` | `(itemId: string) => void` | `undefined` | 從佇列移除項目 |
| `title` | `string` | `'Batch Process'` | 標題列標題 |
| `showPreview` | `boolean` | `true` | 顯示預覽面板 |
| `queueWidth` | `number` | `280` | 佇列面板寬度 |

## 範例

### 圖片匯出工作流程

```tsx
import { BatchProcessTemplate } from '@/templates';
import { useEagleSelection } from '@/hooks';

function BatchExport() {
  const { items: selectedItems } = useEagleSelection();
  const [queue, setQueue] = useState<ProcessItem[]>([]);
  const [status, setStatus] = useState<ProcessStatus>('idle');
  const [currentIndex, setCurrentIndex] = useState(0);

  // 從選取初始化佇列
  useEffect(() => {
    setQueue(selectedItems.map(item => ({
      id: item.id,
      name: item.name,
      status: 'pending',
      thumbnail: item.thumbnail,
    })));
  }, [selectedItems]);

  const handleStart = async () => {
    setStatus('processing');
    
    for (let i = 0; i < queue.length; i++) {
      setCurrentIndex(i);
      setQueue(prev => prev.map((item, idx) => 
        idx === i ? { ...item, status: 'processing' } : item
      ));

      try {
        await exportImage(queue[i]);
        setQueue(prev => prev.map((item, idx) =>
          idx === i ? { ...item, status: 'completed' } : item
        ));
      } catch (error) {
        setQueue(prev => prev.map((item, idx) =>
          idx === i ? { ...item, status: 'failed', error: error.message } : item
        ));
      }
    }

    setStatus('completed');
  };

  return (
    <BatchProcessTemplate
      title="匯出圖片"
      items={queue}
      status={status}
      progress={{ current: currentIndex + 1, total: queue.length }}
      onStart={handleStart}
      onCancel={() => setStatus('cancelled')}
      currentPreview={
        queue[currentIndex] && (
          <div className="flex flex-col items-center gap-4 p-4">
            <img 
              src={queue[currentIndex].thumbnail} 
              alt={queue[currentIndex].name}
              className="max-w-full max-h-64 rounded-lg"
            />
            <p className="text-sm text-gray-500">
              處理中：{queue[currentIndex].name}
            </p>
          </div>
        )
      }
    />
  );
}
```

### 帶重試和移除

```tsx
function BatchWithRetry() {
  const handleRetry = async (itemId: string) => {
    setQueue(prev => prev.map(item =>
      item.id === itemId ? { ...item, status: 'pending', error: undefined } : item
    ));
    // 重新排隊項目進行處理
  };

  const handleRemove = (itemId: string) => {
    setQueue(prev => prev.filter(item => item.id !== itemId));
  };

  return (
    <BatchProcessTemplate
      items={queue}
      status={status}
      onRetry={handleRetry}
      onRemove={handleRemove}
      // ... 其他 props
    />
  );
}
```

### 帶暫停/繼續

```tsx
function PausableProcess() {
  const [isPaused, setIsPaused] = useState(false);
  const pauseRef = useRef(false);

  const handlePause = () => {
    pauseRef.current = true;
    setIsPaused(true);
    setStatus('paused');
  };

  const handleResume = () => {
    pauseRef.current = false;
    setIsPaused(false);
    setStatus('processing');
    continueProcessing();
  };

  const processItem = async (item: ProcessItem) => {
    // 在項目之間檢查暫停
    while (pauseRef.current) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    // 處理項目...
  };

  return (
    <BatchProcessTemplate
      items={queue}
      status={status}
      onStart={handleStart}
      onPause={handlePause}
      onResume={handleResume}
      onCancel={handleCancel}
    />
  );
}
```

### 自訂佇列項目渲染

```tsx
function CustomQueueItems() {
  return (
    <BatchProcessTemplate
      items={queue}
      renderQueueItem={(item, index) => (
        <div 
          key={item.id}
          className={cn(
            'flex items-center gap-3 p-2 rounded-lg',
            item.status === 'completed' && 'bg-green-50 dark:bg-green-900/20',
            item.status === 'failed' && 'bg-red-50 dark:bg-red-900/20',
            item.status === 'processing' && 'bg-blue-50 dark:bg-blue-900/20',
          )}
        >
          <StatusIcon status={item.status} />
          <img src={item.thumbnail} className="w-10 h-10 rounded" />
          <div className="flex-1 min-w-0">
            <p className="truncate font-medium">{item.name}</p>
            {item.error && (
              <p className="text-xs text-red-500">{item.error}</p>
            )}
          </div>
          {item.status === 'failed' && (
            <Button size="sm" onClick={() => onRetry(item.id)}>
              重試
            </Button>
          )}
        </div>
      )}
    />
  );
}
```

### 詳細進度

```tsx
function DetailedProgress() {
  const stats = useMemo(() => ({
    completed: queue.filter(i => i.status === 'completed').length,
    failed: queue.filter(i => i.status === 'failed').length,
    pending: queue.filter(i => i.status === 'pending').length,
  }), [queue]);

  return (
    <BatchProcessTemplate
      items={queue}
      status={status}
      progress={{ current: stats.completed, total: queue.length }}
      headerContent={
        <div className="flex gap-4 text-sm">
          <span className="text-green-600">✓ {stats.completed}</span>
          <span className="text-red-600">✕ {stats.failed}</span>
          <span className="text-gray-500">○ {stats.pending}</span>
        </div>
      }
    />
  );
}
```

## 佇列項目狀態

| 狀態 | 圖示 | 顏色 | 說明 |
|------|------|------|------|
| `pending` | ○ | 灰色 | 等待處理 |
| `processing` | → (動畫) | 藍色 | 目前處理中 |
| `completed` | ✓ | 綠色 | 成功完成 |
| `failed` | ✕ | 紅色 | 發生錯誤 |
| `skipped` | ⊘ | 黃色 | 使用者跳過 |

## 控制按鈕狀態

| 狀態 | 開始 | 暫停 | 繼續 | 取消 |
|------|------|------|------|------|
| `idle` | 啟用 | 隱藏 | 隱藏 | 隱藏 |
| `processing` | 隱藏 | 啟用 | 隱藏 | 啟用 |
| `paused` | 隱藏 | 隱藏 | 啟用 | 啟用 |
| `completed` | 啟用* | 隱藏 | 隱藏 | 隱藏 |
| `cancelled` | 啟用 | 隱藏 | 隱藏 | 隱藏 |

*啟用為「再次處理」

## 最佳實踐

### ✅ 建議

```tsx
// 顯示清晰的進度回饋
<BatchProcessTemplate
  progress={{ current: 5, total: 10 }}
  currentPreview={<DetailedPreview />}
/>

// 處理所有狀態
<BatchProcessTemplate
  onStart={handleStart}
  onPause={handlePause}
  onResume={handleResume}
  onCancel={handleCancel}
  onRetry={handleRetry}
/>

// 不可變地更新項目
setQueue(prev => prev.map(item =>
  item.id === currentId ? { ...item, status: 'completed' } : item
));
```

### ❌ 避免

```tsx
// 不要直接變更項目
queue[index].status = 'completed';  // 錯誤！

// 處理期間不要阻塞 UI
await processAll();  // 使用帶狀態更新的非同步

// 不要忘記錯誤處理
try {
  await processItem(item);
} catch (error) {
  // 處理並向使用者顯示錯誤
}
```

## 使用時機

**使用 BatchProcessTemplate 的情況：**
- 依序處理多個項目
- 需要佇列視覺化
- 需要暫停/繼續功能
- 想要顯示單一項目進度

**考慮其他範本的情況：**
- 單一項目處理 → [`SinglePanelTemplate`](./single-panel)
- 瀏覽/選取圖片 → [`ImageBrowserTemplate`](./image-browser)
- 複雜三面板工作流程 → [`ThreeColumnTemplate`](./three-column)

## 相關資源

- [範本概覽](./overview) - 所有可用範本
- [useEagleSelection](../hooks/use-eagle-selection) - 取得選取項目
