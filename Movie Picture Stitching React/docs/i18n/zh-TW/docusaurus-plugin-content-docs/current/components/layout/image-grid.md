---
sidebar_position: 2
title: ImageGrid 圖片網格
description: 用於顯示圖片縮圖並支援選取的響應式網格元件
---

# ImageGrid 圖片網格

專為顯示 Eagle 圖片縮圖設計的響應式網格元件，具有可配置的欄數、間距和選取支援。

## 匯入

```tsx
import { ImageGrid } from '@/components';
```

## 基本用法

```tsx
import { useEagleSelection } from '@/hooks';

function Gallery() {
  const { items } = useEagleSelection();

  return (
    <ImageGrid
      items={items}
      columns={4}
      gap="md"
      onItemClick={(item) => console.log('點擊:', item.name)}
    />
  );
}
```

## 屬性

| 屬性 | 類型 | 預設值 | 說明 |
|------|------|---------|-------------|
| `items` | `EagleItem[]` | 必填 | 要顯示的 Eagle 項目陣列 |
| `columns` | `number \| ResponsiveColumns` | `4` | 網格欄數 |
| `gap` | `'none' \| 'sm' \| 'md' \| 'lg'` | `'md'` | 網格項目間的間距 |
| `onItemClick` | `(item: EagleItem) => void` | - | 項目被點擊時的回呼 |
| `onItemDoubleClick` | `(item: EagleItem) => void` | - | 雙擊時的回呼 |
| `selectedIds` | `Set<string> \| string[]` | - | 目前選取的項目 ID |
| `onSelectionChange` | `(ids: string[]) => void` | - | 選取變更時的回呼 |
| `showName` | `boolean` | `true` | 在縮圖下方顯示項目名稱 |
| `showExtension` | `boolean` | `false` | 顯示副檔名 |
| `aspectRatio` | `'square' \| 'original' \| number` | `'square'` | 縮圖長寬比 |
| `useThumbnail` | `boolean` | `true` | 使用 Eagle 縮圖而非原圖 |
| `className` | `string` | - | 額外的 CSS 類別 |
| `emptyMessage` | `string` | `'無項目'` | 項目陣列為空時的訊息 |

## 欄數選項

### 固定欄數

```tsx
// 始終 4 欄
<ImageGrid items={items} columns={4} />

// 始終 6 欄
<ImageGrid items={items} columns={6} />
```

### 響應式欄數

```tsx
// 在不同斷點使用不同欄數
<ImageGrid
  items={items}
  columns={{
    default: 2,  // 行動裝置
    sm: 3,       // ≥640px
    md: 4,       // ≥768px
    lg: 5,       // ≥1024px
    xl: 6,       // ≥1280px
  }}
/>
```

## 間距選項

```tsx
// 無間距
<ImageGrid items={items} gap="none" />

// 小間距（0.25rem）
<ImageGrid items={items} gap="sm" />

// 中間距（0.5rem）- 預設
<ImageGrid items={items} gap="md" />

// 大間距（1rem）
<ImageGrid items={items} gap="lg" />
```

## 範例

### 基本圖庫

```tsx
function BasicGallery() {
  const { items, isLoading } = useEagleSelection();

  if (isLoading) {
    return <div>載入中...</div>;
  }

  return (
    <ImageGrid
      items={items}
      columns={4}
      gap="md"
      showName
      showExtension
    />
  );
}
```

### 帶選取功能

```tsx
function SelectableGallery() {
  const { items } = useEagleSelection();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleSelectionChange = (ids: string[]) => {
    setSelectedIds(ids);
    console.log('已選取:', ids.length, '個項目');
  };

  return (
    <div>
      <div className="mb-4 text-sm text-muted-foreground">
        已選取 {selectedIds.length} 個項目
      </div>
      <ImageGrid
        items={items}
        selectedIds={selectedIds}
        onSelectionChange={handleSelectionChange}
        columns={5}
      />
    </div>
  );
}
```

### 自訂點擊處理

```tsx
function ClickableGallery() {
  const { items } = useEagleSelection();
  const [preview, setPreview] = useState<EagleItem | null>(null);

  return (
    <>
      <ImageGrid
        items={items}
        onItemClick={(item) => console.log('單擊:', item.name)}
        onItemDoubleClick={(item) => setPreview(item)}
        columns={4}
      />
      {preview && (
        <Dialog open onOpenChange={() => setPreview(null)}>
          <DialogContent>
            <EagleImage item={preview} className="w-full" />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
```

### 不同的長寬比

```tsx
// 正方形縮圖（預設）
<ImageGrid items={items} aspectRatio="square" />

// 原始長寬比
<ImageGrid items={items} aspectRatio="original" />

// 自訂長寬比（16:9）
<ImageGrid items={items} aspectRatio={16/9} />

// 自訂長寬比（4:3）
<ImageGrid items={items} aspectRatio={4/3} />
```

### 空狀態

```tsx
<ImageGrid
  items={[]}
  emptyMessage="未選取圖片。在 Eagle 中選取圖片以開始使用。"
  className="min-h-[200px]"
/>
```

### 帶載入狀態

```tsx
function LoadingGallery() {
  const { items, isLoading } = useEagleSelection();

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}
      <ImageGrid
        items={items}
        columns={4}
        className={isLoading ? 'opacity-50' : ''}
      />
    </div>
  );
}
```

### 精簡模式

```tsx
<ImageGrid
  items={items}
  columns={8}
  gap="sm"
  showName={false}
  aspectRatio="square"
  useThumbnail
/>
```

### 完整功能範例

```tsx
function AdvancedGallery() {
  const { items, isLoading, refresh } = useEagleSelection();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [columns, setColumns] = useState(4);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>圖庫（{items.length} 個項目）</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={refresh}>
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Select
              value={columns.toString()}
              onValueChange={(v) => setColumns(parseInt(v))}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="4">4</SelectItem>
                <SelectItem value="6">6</SelectItem>
                <SelectItem value="8">8</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {selectedIds.length > 0 && (
          <div className="mb-4 p-2 bg-muted rounded-md flex items-center justify-between">
            <span>已選取 {selectedIds.length} 個項目</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedIds([])}
            >
              清除
            </Button>
          </div>
        )}
        <ImageGrid
          items={items}
          columns={columns}
          gap="md"
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          showName
          showExtension
          aspectRatio="square"
          emptyMessage="在 Eagle 中選取圖片以在此處檢視"
        />
      </CardContent>
    </Card>
  );
}
```

## 樣式

### 預設樣式

網格使用 CSS Grid 進行佈局：

```css
/* 網格容器 */
display: grid;
grid-template-columns: repeat(var(--columns), minmax(0, 1fr));
gap: var(--gap);

/* 網格項目 */
aspect-ratio: var(--aspect-ratio);
border-radius: 0.5rem;
overflow: hidden;
cursor: pointer;
transition: transform 0.2s, box-shadow 0.2s;
```

### 懸停效果

```css
/* 預設懸停 */
.grid-item:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 選取狀態 */
.grid-item[data-selected="true"] {
  ring: 2px solid var(--primary);
}
```

### 自訂樣式

```tsx
// 新增自訂容器樣式
<ImageGrid
  items={items}
  className="bg-muted/50 p-4 rounded-lg"
/>

// 深色主題最佳化
<ImageGrid
  items={items}
  className="bg-gray-900"
  gap="sm"
/>
```

## 效能

### 縮圖最佳化

```tsx
// 使用縮圖以獲得更好的效能（預設）
<ImageGrid items={items} useThumbnail />

// 使用原圖以獲得更好的品質
<ImageGrid items={items} useThumbnail={false} />
```

### 虛擬化注意事項

對於非常大的項目數量（100+），請考慮使用虛擬化網格：

```tsx
// 對於大型資料集，實作虛擬化
import { useVirtualizer } from '@tanstack/react-virtual';

function VirtualizedGrid({ items }: { items: EagleItem[] }) {
  // 自訂虛擬化實作
  // ImageGrid 針對典型選取大小（< 100 個項目）進行了最佳化
}
```

## 與 Eagle 整合

### 搭配 useEagleSelection 使用

```tsx
function EagleGallery() {
  const {
    items,
    isLoading,
    isPaused,
    refresh,
    startPolling,
    stopPolling,
  } = useEagleSelection({
    pollingInterval: 500,
    pauseOnHidden: true,
  });

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm text-muted-foreground">
          已選取 {items.length} 個項目
          {isPaused && '（已暫停）'}
        </span>
        <Button variant="ghost" size="sm" onClick={refresh}>
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
      <ImageGrid items={items} columns={4} />
    </div>
  );
}
```

## 最佳實踐

### 應該做

- ✅ 對於網格檢視使用 `useThumbnail`
- ✅ 提供有意義的 `emptyMessage`
- ✅ 對於不同螢幕大小使用響應式欄數
- ✅ 在取得項目時顯示載入狀態
- ✅ 根據內容類型考慮長寬比

### 不應該做

- ❌ 不使用虛擬化顯示超過 100 個項目
- ❌ 當縮圖就足夠時使用原圖
- ❌ 忘記處理空狀態
- ❌ 將欄數設定得太高以致超出容器寬度
- ❌ 對於互動式網格忽略選取狀態

## 相關元件

- [EagleImage](./eagle-image) - 網格中使用的單個圖片元件
- [Card](../ui/card) - 帶標題/頁尾的網格容器
- [Select](../form/select) - 用於欄數選擇
