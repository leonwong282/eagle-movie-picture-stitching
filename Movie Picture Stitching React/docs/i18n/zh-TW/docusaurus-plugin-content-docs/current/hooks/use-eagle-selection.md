---
sidebar_position: 2
title: useEagleSelection
description: 基於輪詢的 Hook，用於追蹤 Eagle 目前選取的項目
---

# useEagleSelection

基於輪詢的 Hook，追蹤 Eagle 目前選取的項目，具有效能最佳化和可見性感知功能。

## 匯入

```tsx
import { useEagleSelection } from '@/hooks';
```

## 基本用法

```tsx
function Gallery() {
  const { items, isLoading } = useEagleSelection();

  if (isLoading) return <Spinner />;
  
  return (
    <div className="grid grid-cols-4 gap-2">
      {items.map(item => (
        <EagleImage key={item.id} item={item} />
      ))}
    </div>
  );
}
```

## 簽名

```tsx
const result = useEagleSelection(options?: UseEagleSelectionOptions);
```

## 選項

| 選項 | 類型 | 預設值 | 說明 |
|--------|------|---------|-------------|
| `pollingInterval` | `number` | `500` | 輪詢間隔（毫秒） |
| `autoStart` | `boolean` | `true` | 掛載時立即開始輪詢 |
| `pauseOnHidden` | `boolean` | `true` | 文件/外掛隱藏時暫停輪詢 |

```tsx
// 自訂選項
const { items } = useEagleSelection({
  pollingInterval: 1000,  // 較慢的輪詢
  autoStart: false,       // 手動啟動
  pauseOnHidden: true,    // 隱藏時暫停
});
```

## 回傳值

| 屬性 | 類型 | 說明 |
|----------|------|-------------|
| `items` | `EagleItem[]` | 目前選取的項目 |
| `isLoading` | `boolean` | 初始載入期間為 true |
| `error` | `Error \| null` | API 呼叫失敗時的錯誤 |
| `refresh` | `() => Promise<void>` | 強制重新整理（跳過雜湊檢查） |
| `forceRefresh` | `() => Promise<void>` | `refresh` 的別名 |
| `startPolling` | `() => void` | 開始輪詢循環 |
| `stopPolling` | `() => void` | 停止輪詢循環 |
| `isPaused` | `boolean` | 因可見性暫停時為 true |

## 範例

### 基本選取顯示

```tsx
function SelectionInfo() {
  const { items, isLoading, error } = useEagleSelection();

  if (error) return <div className="text-destructive">{error.message}</div>;
  if (isLoading) return <Spinner />;
  if (items.length === 0) return <p>未選取任何項目</p>;

  return (
    <div>
      <p>已選取 {items.length} 個項目</p>
      <ul>
        {items.map(item => (
          <li key={item.id}>{item.name}.{item.ext}</li>
        ))}
      </ul>
    </div>
  );
}
```

### 帶手動重新整理

```tsx
function RefreshableGallery() {
  const { items, refresh, isLoading } = useEagleSelection();

  return (
    <div>
      <Button 
        onClick={refresh} 
        disabled={isLoading}
      >
        <RefreshCw className={isLoading ? 'animate-spin' : ''} />
        重新整理
      </Button>
      <ImageGrid items={items} />
    </div>
  );
}
```

### 手動輪詢控制

```tsx
function ControlledPolling() {
  const { 
    items, 
    isPaused,
    startPolling, 
    stopPolling 
  } = useEagleSelection({ autoStart: false });

  return (
    <div>
      <div className="flex gap-2">
        <Button onClick={startPolling}>開始</Button>
        <Button onClick={stopPolling}>停止</Button>
        <span>{isPaused ? '⏸️ 已暫停' : '▶️ 進行中'}</span>
      </div>
      <p>{items.length} 個項目</p>
    </div>
  );
}
```

### 重度操作的慢速輪詢

```tsx
function HeavyProcessing() {
  // 處理期間降低輪詢頻率以減少 CPU 使用
  const { items } = useEagleSelection({
    pollingInterval: 2000,  // 2 秒
  });

  // 對項目進行重度操作...
}
```

### 顯示項目中繼資料

```tsx
function ItemDetails() {
  const { items } = useEagleSelection();
  const item = items[0];

  if (!item) return <p>選取項目以查看詳情</p>;

  return (
    <dl className="grid grid-cols-2 gap-2 text-sm">
      <dt>名稱</dt>
      <dd>{item.name}</dd>
      
      <dt>格式</dt>
      <dd>{item.ext.toUpperCase()}</dd>
      
      <dt>尺寸</dt>
      <dd>{item.width} × {item.height}</dd>
      
      <dt>檔案大小</dt>
      <dd>{(item.size / 1024).toFixed(1)} KB</dd>
      
      <dt>標籤</dt>
      <dd>{item.tags?.join(', ') || '無'}</dd>
      
      <dt>星級評分</dt>
      <dd>{'⭐'.repeat(item.star || 0) || '未評分'}</dd>
    </dl>
  );
}
```

## EagleItem 類型

`items` 陣列包含具有以下屬性的物件：

```typescript
interface EagleItem {
  id: string;
  name: string;
  ext: string;
  width: number;
  height: number;
  size: number;
  filePath: string;
  fileURL: string;
  
  // 中繼資料
  tags?: string[];
  folders?: string[];
  star?: number;        // 0-5
  annotation?: string;
  url?: string;         // 從網頁匯入的來源 URL
  
  // 時間戳記
  mtime: number;        // 修改時間
  btime: number;        // 建立時間
  
  // 其他
  palettes?: ColorPalette[];
  isDeleted?: boolean;
}
```

## 效能最佳化

### 基於雜湊的變更偵測

Hook 使用項目 ID 的雜湊來高效偵測變更：

```
┌─────────────────────────────────────────────────────┐
│  輪詢 Eagle API                                     │
│         ↓                                           │
│  計算雜湊: SHA(item1.id + item2.id + ...)          │
│         ↓                                           │
│  與前一個雜湊比較                                   │
│         ↓                                           │
│  ┌─────────────────┬──────────────────────────┐    │
│  │ 雜湊相同        │ 雜湊不同                 │    │
│  │ → 跳過更新      │ → 更新狀態               │    │
│  └─────────────────┴──────────────────────────┘    │
└─────────────────────────────────────────────────────┘
```

這可以在選取未改變時防止不必要的重新渲染。

### 可見性感知輪詢

當 `pauseOnHidden: true`（預設）時，輪詢在以下情況暫停：
- 文件變為隱藏（`document.hidden === true`）
- Eagle 外掛視窗最小化
- 使用者切換到另一個分頁

```
┌──────────────────────────────────────────┐
│  外掛可見     →  輪詢進行中              │
│  外掛隱藏     →  輪詢暫停                │
│  外掛可見     →  輪詢恢復                │
│                  + 立即取得              │
└──────────────────────────────────────────┘
```

### 為何使用輪詢？

Eagle 的外掛 API v4.0 不提供推送式的選取事件。偵測選取變更的唯一方式是輪詢 `eagle.item.getSelected()`。500ms 的預設間隔在響應性和 CPU 使用之間取得平衡。

## 內部實作

### 狀態管理

```typescript
// 內部狀態結構
const [items, setItems] = useState<EagleItem[]>([]);
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState<Error | null>(null);
const [isPaused, setIsPaused] = useState(false);

// 雜湊儲存在 ref 中以避免觸發重新渲染
const hashRef = useRef<string>('');
```

### 輪詢循環

```typescript
useEffect(() => {
  if (!autoStart) return;
  
  const poll = async () => {
    const selected = await eagleApi.getSelectedItems();
    const newHash = computeHash(selected);
    
    if (newHash !== hashRef.current) {
      hashRef.current = newHash;
      setItems(selected);
    }
  };
  
  const interval = setInterval(poll, pollingInterval);
  return () => clearInterval(interval);
}, [pollingInterval, autoStart]);
```

### 可見性監聽器

```typescript
useEffect(() => {
  if (!pauseOnHidden) return;
  
  const handleVisibility = () => {
    if (document.hidden) {
      stopPolling();
      setIsPaused(true);
    } else {
      startPolling();
      setIsPaused(false);
      refresh(); // 恢復時立即取得
    }
  };
  
  document.addEventListener('visibilitychange', handleVisibility);
  
  // 也監聽 Eagle 的外掛可見性事件
  window.addEventListener('plugin-show', handleVisibility);
  
  return () => {
    document.removeEventListener('visibilitychange', handleVisibility);
    window.removeEventListener('plugin-show', handleVisibility);
  };
}, [pauseOnHidden]);
```

## 最佳實踐

### 應該做

- ✅ 大多數情況使用預設選項（已最佳化）
- ✅ 在初始取得期間顯示載入狀態
- ✅ 優雅地處理錯誤狀態
- ✅ 對使用者觸發的更新使用 `refresh()`
- ✅ 對 CPU 密集型操作考慮使用較慢的輪詢

### 不應該做

- ❌ 將輪詢間隔設定為低於 200ms（太激進）
- ❌ 在迴圈中呼叫 `refresh()`（導致過多 API 呼叫）
- ❌ 在 UI 中忽略 `isPaused` 狀態
- ❌ 在同一元件樹中使用多個實例（改用 Zustand）

## 何時改用 Zustand

對於許多元件需要選取資料的複雜應用程式，請使用 Zustand store：

```tsx
// 多個元件共享選取
import { useSelection } from '@/stores';

function ComponentA() {
  const { items } = useSelection();
  // ...
}

function ComponentB() {
  const { items } = useSelection();
  // ...
}
```

Zustand store 提供單一輪詢實例，在所有消費者之間共享。

## 相關

- [useTheme](./use-theme) - 主題管理 Hook
- [useLocalStorage](./use-local-storage) - 保留選取偏好
- [ImageGrid](../components/layout/image-grid) - 顯示選取的項目
- [EagleImage](../components/layout/eagle-image) - 顯示單個項目
