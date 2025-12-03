---
sidebar_position: 6
title: ImageBrowserTemplate
description: 具有篩選和選取功能的網格式圖片瀏覽器
---

# ImageBrowserTemplate

響應式圖片網格瀏覽器，具有搜尋、篩選、排序和多選功能。專為素材瀏覽、圖片選擇和藝廊檢視設計。

## 匯入

```tsx
import { ImageBrowserTemplate } from '@/templates';
```

## 基本用法

```tsx
import { ImageBrowserTemplate } from '@/templates';

function AssetBrowser() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  return (
    <ImageBrowserTemplate
      items={images}
      selectedIds={selectedIds}
      onSelectionChange={setSelectedIds}
    />
  );
}
```

## 佈局結構

```
┌─────────────────────────────────────┐
│  🔍 搜尋...      [網格▼] [排序▼]    │  ← 工具列
├─────────────────────────────────────┤
│ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐   │
│ │ img │ │ img │ │ img │ │ img │   │
│ │  ✓  │ │     │ │  ✓  │ │     │   │  ← 響應式網格
│ └─────┘ └─────┘ └─────┘ └─────┘   │
│ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐   │
│ │ img │ │ img │ │ img │ │ img │   │
│ └─────┘ └─────┘ └─────┘ └─────┘   │
├─────────────────────────────────────┤
│  已選取：2 個項目        [清除]     │  ← 狀態列
└─────────────────────────────────────┘
```

## 類型

### BrowserItem

```tsx
interface BrowserItem {
  id: string;
  name: string;
  thumbnail: string;
  width?: number;
  height?: number;
  size?: number;
  ext?: string;
  tags?: string[];
  folders?: string[];
  modificationTime?: number;
  star?: number;
}
```

### FilterOptions

```tsx
interface FilterOptions {
  search?: string;
  extensions?: string[];
  tags?: string[];
  folders?: string[];
  starred?: boolean;
  minWidth?: number;
  maxWidth?: number;
}
```

### SortOptions

```tsx
interface SortOptions {
  field: 'name' | 'size' | 'modificationTime' | 'width' | 'star';
  direction: 'asc' | 'desc';
}
```

## Props

| Prop | 類型 | 預設值 | 說明 |
|------|------|--------|------|
| `items` | `BrowserItem[]` | **必要** | 要顯示的項目 |
| `selectedIds` | `string[]` | `[]` | 目前選取的項目 ID |
| `onSelectionChange` | `(ids: string[]) => void` | `undefined` | 選取變更處理器 |
| `onItemClick` | `(item: BrowserItem) => void` | `undefined` | 單擊處理器 |
| `onItemDoubleClick` | `(item: BrowserItem) => void` | `undefined` | 雙擊處理器 |
| `multiSelect` | `boolean` | `true` | 允許多選 |
| `columns` | `number` | `4` | 網格欄數（2-6） |
| `showToolbar` | `boolean` | `true` | 顯示搜尋/篩選工具列 |
| `showStatusBar` | `boolean` | `true` | 顯示選取狀態列 |
| `filters` | `FilterOptions` | `undefined` | 啟用的篩選條件 |
| `onFiltersChange` | `(filters: FilterOptions) => void` | `undefined` | 篩選變更處理器 |
| `sort` | `SortOptions` | `undefined` | 啟用的排序 |
| `onSortChange` | `(sort: SortOptions) => void` | `undefined` | 排序變更處理器 |
| `emptyMessage` | `string` | `'No items'` | 空狀態訊息 |
| `isLoading` | `boolean` | `false` | 顯示載入狀態 |

## 範例

### 使用 Eagle 選取

```tsx
import { ImageBrowserTemplate } from '@/templates';
import { useEagleSelection } from '@/hooks';

function EagleBrowser() {
  const { items, isLoading } = useEagleSelection();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const browserItems = items.map(item => ({
    id: item.id,
    name: item.name,
    thumbnail: item.thumbnail,
    width: item.width,
    height: item.height,
    ext: item.ext,
    tags: item.tags,
  }));

  return (
    <ImageBrowserTemplate
      items={browserItems}
      selectedIds={selectedIds}
      onSelectionChange={setSelectedIds}
      isLoading={isLoading}
    />
  );
}
```

### 帶篩選

```tsx
function FilteredBrowser() {
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    extensions: [],
  });

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      if (filters.search && !item.name.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      if (filters.extensions?.length && !filters.extensions.includes(item.ext)) {
        return false;
      }
      if (filters.starred && !item.star) {
        return false;
      }
      return true;
    });
  }, [items, filters]);

  return (
    <ImageBrowserTemplate
      items={filteredItems}
      filters={filters}
      onFiltersChange={setFilters}
      selectedIds={selectedIds}
      onSelectionChange={setSelectedIds}
    />
  );
}
```

### 帶排序

```tsx
function SortableBrowser() {
  const [sort, setSort] = useState<SortOptions>({
    field: 'name',
    direction: 'asc',
  });

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const aVal = a[sort.field] ?? 0;
      const bVal = b[sort.field] ?? 0;
      const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      return sort.direction === 'asc' ? comparison : -comparison;
    });
  }, [items, sort]);

  return (
    <ImageBrowserTemplate
      items={sortedItems}
      sort={sort}
      onSortChange={setSort}
      selectedIds={selectedIds}
      onSelectionChange={setSelectedIds}
    />
  );
}
```

### 單選模式

```tsx
function ImagePicker({ onSelect }: { onSelect: (item: BrowserItem) => void }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <ImageBrowserTemplate
      items={images}
      selectedIds={selectedId ? [selectedId] : []}
      onSelectionChange={(ids) => setSelectedId(ids[0] ?? null)}
      multiSelect={false}
      onItemDoubleClick={(item) => {
        onSelect(item);
      }}
    />
  );
}
```

### 自訂欄數

```tsx
function ResponsiveBrowser() {
  const [columns, setColumns] = useState(4);

  return (
    <ImageBrowserTemplate
      items={images}
      columns={columns}
      headerActions={
        <div className="flex gap-1">
          {[2, 3, 4, 5, 6].map(n => (
            <Button
              key={n}
              variant={columns === n ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setColumns(n)}
            >
              {n}
            </Button>
          ))}
        </div>
      }
      selectedIds={selectedIds}
      onSelectionChange={setSelectedIds}
    />
  );
}
```

### 帶右鍵選單

```tsx
function BrowserWithContextMenu() {
  const handleItemContextMenu = (item: BrowserItem, event: React.MouseEvent) => {
    event.preventDefault();
    showContextMenu({
      x: event.clientX,
      y: event.clientY,
      items: [
        { label: '開啟', onClick: () => openItem(item) },
        { label: '複製', onClick: () => copyItem(item) },
        { label: '刪除', onClick: () => deleteItem(item) },
      ],
    });
  };

  return (
    <ImageBrowserTemplate
      items={images}
      onItemContextMenu={handleItemContextMenu}
      selectedIds={selectedIds}
      onSelectionChange={setSelectedIds}
    />
  );
}
```

### 載入狀態

```tsx
function LoadingBrowser() {
  const { items, isLoading, error } = useAsyncItems();

  if (error) {
    return <ErrorFallback error={error} />;
  }

  return (
    <ImageBrowserTemplate
      items={items}
      isLoading={isLoading}
      emptyMessage="找不到圖片"
      selectedIds={selectedIds}
      onSelectionChange={setSelectedIds}
    />
  );
}
```

### 自訂空狀態

```tsx
function CustomEmptyBrowser() {
  return (
    <ImageBrowserTemplate
      items={[]}
      emptyContent={
        <div className="flex flex-col items-center gap-4 py-12">
          <ImageIcon className="w-16 h-16 text-gray-400" />
          <p className="text-gray-500">未選取圖片</p>
          <Button onClick={openSelector}>選擇圖片</Button>
        </div>
      }
      selectedIds={selectedIds}
      onSelectionChange={setSelectedIds}
    />
  );
}
```

## 鍵盤導覽

| 按鍵 | 操作 |
|------|------|
| `方向鍵` | 導覽網格 |
| `空白鍵` | 切換選取 |
| `Ctrl/Cmd + A` | 全選 |
| `Ctrl/Cmd + 點擊` | 加入選取 |
| `Shift + 點擊` | 範圍選取 |
| `Escape` | 清除選取 |
| `Enter` | 開啟已選取 |

## 選取行為

### 多選（預設）

- 點擊：選取單一項目，清除其他
- Ctrl/Cmd + 點擊：切換項目在選取中
- Shift + 點擊：從最後選取項目範圍選取

### 單選

- 點擊：僅選取單一項目
- 無範圍或多選

## 最佳實踐

### ✅ 建議

```tsx
// 記憶化篩選/排序的項目
const filteredItems = useMemo(() => {
  return items.filter(item => matchesFilters(item, filters));
}, [items, filters]);

// 處理載入狀態
<ImageBrowserTemplate
  items={items}
  isLoading={isLoading}
  emptyMessage="載入中..."
/>

// 提供清晰的空狀態
<ImageBrowserTemplate
  emptyContent={<HelpfulEmptyState />}
/>
```

### ❌ 避免

```tsx
// 不要內聯篩選（導致每次渲染都重新篩選）
<ImageBrowserTemplate
  items={items.filter(i => i.name.includes(search))}  // 錯誤！
/>

// 不要忘記處理選取
<ImageBrowserTemplate
  items={items}
  // 缺少 onSelectionChange = 無互動
/>
```

## 使用時機

**使用 ImageBrowserTemplate 的情況：**
- 顯示圖片/素材網格
- 需要多選功能
- 想要搜尋和篩選
- 建立圖片選擇器

**考慮其他範本的情況：**
- 單一圖片預覽 → [`SinglePanelTemplate`](./single-panel)
- 批次處理 → [`BatchProcessTemplate`](./batch-process)
- 三面板編輯 → [`ThreeColumnTemplate`](./three-column)

## 相關資源

- [範本概覽](./overview) - 所有可用範本
- [useEagleSelection](../hooks/use-eagle-selection) - 取得 Eagle 項目
