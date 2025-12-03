---
sidebar_position: 3
title: EagleImage 圖片元件
description: 針對顯示 Eagle 素材庫資產進行最佳化的圖片元件，支援縮圖功能
---

# EagleImage 圖片元件

針對顯示 Eagle 素材庫資產進行最佳化的圖片元件，具有自動縮圖載入、延遲載入、錯誤處理和重試功能。

## 匯入

```tsx
import { EagleImage, ImagePlaceholder } from '@/components';
```

## 基本用法

```tsx
import { useEagleSelection } from '@/hooks';

function ImagePreview() {
  const { items } = useEagleSelection();
  const firstItem = items[0];

  if (!firstItem) return <ImagePlaceholder />;

  return (
    <EagleImage
      item={firstItem}
      className="w-full max-w-md rounded-lg"
    />
  );
}
```

## 屬性

### EagleImage

| 屬性 | 類型 | 預設值 | 說明 |
|------|------|---------|-------------|
| `item` | `EagleItem` | 必填 | 要顯示的 Eagle 項目物件 |
| `useThumbnail` | `boolean` | `true` | 使用 Eagle 縮圖而非原圖 |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | 縮圖大小偏好 |
| `lazy` | `boolean` | `true` | 啟用延遲載入 |
| `fallback` | `ReactNode` | `<ImagePlaceholder />` | 錯誤時的備用內容 |
| `retryCount` | `number` | `3` | 重試次數 |
| `retryDelay` | `number` | `1000` | 重試間隔（毫秒） |
| `onLoad` | `() => void` | - | 圖片載入完成時的回呼 |
| `onError` | `(error: Error) => void` | - | 載入錯誤時的回呼 |
| `className` | `string` | - | 額外的 CSS 類別 |
| `style` | `CSSProperties` | - | 行內樣式 |
| `alt` | `string` | `item.name` | 替代文字覆蓋 |

### ImagePlaceholder

| 屬性 | 類型 | 預設值 | 說明 |
|------|------|---------|-------------|
| `className` | `string` | - | 額外的 CSS 類別 |
| `icon` | `ReactNode` | `<ImageIcon />` | 自訂圖示 |
| `text` | `string` | - | 圖示下方的可選文字 |

## 縮圖大小

```tsx
// 小（150px）- 用於多項目網格
<EagleImage item={item} size="sm" />

// 中（300px）- 預設，良好平衡
<EagleImage item={item} size="md" />

// 大（600px）- 用於詳細預覽
<EagleImage item={item} size="lg" />

// 特大（1200px）- 用於全尺寸顯示
<EagleImage item={item} size="xl" />
```

## 範例

### 基本預覽

```tsx
function Preview({ item }: { item: EagleItem }) {
  return (
    <div className="aspect-video overflow-hidden rounded-lg">
      <EagleImage
        item={item}
        className="w-full h-full object-cover"
      />
    </div>
  );
}
```

### 帶載入狀態

```tsx
function LoadingImage({ item }: { item: EagleItem }) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}
      <EagleImage
        item={item}
        onLoad={() => setIsLoading(false)}
        className={isLoading ? 'opacity-0' : 'opacity-100 transition-opacity'}
      />
    </div>
  );
}
```

### 錯誤處理

```tsx
function RobustImage({ item }: { item: EagleItem }) {
  const [error, setError] = useState<Error | null>(null);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-4 bg-destructive/10 rounded-lg">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <p className="text-sm text-destructive mt-2">載入圖片失敗</p>
        <Button
          variant="outline"
          size="sm"
          className="mt-2"
          onClick={() => setError(null)}
        >
          重試
        </Button>
      </div>
    );
  }

  return (
    <EagleImage
      item={item}
      onError={setError}
      retryCount={5}
      retryDelay={2000}
    />
  );
}
```

### 自訂備用內容

```tsx
<EagleImage
  item={item}
  fallback={
    <div className="flex flex-col items-center justify-center h-full bg-muted">
      <FileQuestion className="h-12 w-12 text-muted-foreground" />
      <span className="text-sm text-muted-foreground mt-2">
        預覽不可用
      </span>
    </div>
  }
/>
```

### 原圖與縮圖比較

```tsx
function QualityComparison({ item }: { item: EagleItem }) {
  const [useOriginal, setUseOriginal] = useState(false);

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <Checkbox
          id="original"
          checked={useOriginal}
          onCheckedChange={setUseOriginal}
        />
        <Label htmlFor="original">使用原始品質</Label>
      </div>
      <EagleImage
        item={item}
        useThumbnail={!useOriginal}
        size={useOriginal ? 'xl' : 'lg'}
        className="max-w-full rounded-lg"
      />
    </div>
  );
}
```

### 延遲載入圖庫

```tsx
function LazyGallery({ items }: { items: EagleItem[] }) {
  return (
    <div className="grid grid-cols-4 gap-4">
      {items.map((item) => (
        <EagleImage
          key={item.id}
          item={item}
          lazy
          size="sm"
          className="w-full aspect-square object-cover rounded-md"
        />
      ))}
    </div>
  );
}
```

### 圖片比較

```tsx
function ImageComparison({ item }: { item: EagleItem }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <h4 className="text-sm font-medium mb-2">縮圖</h4>
        <EagleImage
          item={item}
          useThumbnail
          size="md"
          className="w-full rounded-lg"
        />
      </div>
      <div>
        <h4 className="text-sm font-medium mb-2">原圖</h4>
        <EagleImage
          item={item}
          useThumbnail={false}
          className="w-full rounded-lg"
        />
      </div>
    </div>
  );
}
```

### 帶覆蓋資訊

```tsx
function ImageWithInfo({ item }: { item: EagleItem }) {
  return (
    <div className="relative group">
      <EagleImage
        item={item}
        className="w-full rounded-lg"
      />
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-end">
        <div className="p-4 text-white">
          <p className="font-medium truncate">{item.name}</p>
          <p className="text-sm text-white/80">
            {item.width} × {item.height}
          </p>
          <p className="text-xs text-white/60">
            {(item.size / 1024 / 1024).toFixed(2)} MB
          </p>
        </div>
      </div>
    </div>
  );
}
```

## ImagePlaceholder 佔位符

用於空狀態或載入狀態的佔位符元件：

```tsx
// 基本佔位符
<ImagePlaceholder />

// 自訂圖示
<ImagePlaceholder icon={<FileImage className="h-12 w-12" />} />

// 帶文字
<ImagePlaceholder text="未選取圖片" />

// 自訂樣式
<ImagePlaceholder className="h-64 bg-muted/50" />
```

### 佔位符範例

```tsx
// 空選取
function EmptyState() {
  return (
    <ImagePlaceholder
      icon={<MousePointer className="h-12 w-12" />}
      text="在 Eagle 中選取圖片"
      className="h-96"
    />
  );
}

// 載入狀態
function LoadingState() {
  return (
    <ImagePlaceholder
      icon={<Loader2 className="h-12 w-12 animate-spin" />}
      text="載入中..."
      className="h-96"
    />
  );
}

// 錯誤狀態
function ErrorState() {
  return (
    <ImagePlaceholder
      icon={<AlertCircle className="h-12 w-12 text-destructive" />}
      text="載入圖片失敗"
      className="h-96 border-destructive"
    />
  );
}
```

## 效能最佳化

### 縮圖大小策略

```tsx
// 用於網格檢視（多張圖片）
<EagleImage item={item} size="sm" />  // 150px - 最快

// 用於預覽面板
<EagleImage item={item} size="md" />  // 300px - 平衡

// 用於詳細檢視
<EagleImage item={item} size="lg" />  // 600px - 詳細

// 用於全螢幕/匯出預覽
<EagleImage item={item} useThumbnail={false} />  // 原圖
```

### 延遲載入最佳實踐

```tsx
// 對於列表/網格始終使用延遲載入
<div className="grid grid-cols-4">
  {items.map(item => (
    <EagleImage key={item.id} item={item} lazy />
  ))}
</div>

// 對於首屏內容使用立即載入
<EagleImage item={heroItem} lazy={false} />
```

## 錯誤重試邏輯

元件包含具有指數退避的自動重試：

```tsx
<EagleImage
  item={item}
  retryCount={3}      // 嘗試 3 次重試
  retryDelay={1000}   // 從 1 秒延遲開始
  // 實際延遲：1 秒、2 秒、4 秒（指數退避）
/>
```

## 與 Eagle API 整合

### 使用項目屬性

```tsx
function ImageDetails({ item }: { item: EagleItem }) {
  return (
    <div className="space-y-4">
      <EagleImage item={item} size="lg" />
      <dl className="text-sm">
        <div className="flex justify-between">
          <dt className="text-muted-foreground">名稱</dt>
          <dd>{item.name}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">尺寸</dt>
          <dd>{item.width} × {item.height}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">格式</dt>
          <dd>{item.ext.toUpperCase()}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">大小</dt>
          <dd>{(item.size / 1024).toFixed(1)} KB</dd>
        </div>
      </dl>
    </div>
  );
}
```

## 最佳實踐

### 應該做

- ✅ 對於網格和列表使用縮圖
- ✅ 根據顯示大小選擇縮圖大小
- ✅ 對於螢幕外的圖片啟用延遲載入
- ✅ 提供有意義的替代文字
- ✅ 處理載入和錯誤狀態
- ✅ 使用適當的重試設定

### 不應該做

- ❌ 當縮圖就足夠時載入原圖
- ❌ 對於大型圖庫停用延遲載入
- ❌ 忽略錯誤處理
- ❌ 設定過多的重試次數
- ❌ 忘記設定尺寸/長寬比

## 無障礙性

```tsx
// 好：描述性的替代文字
<EagleImage
  item={item}
  alt={`${item.name} - ${item.width}×${item.height} ${item.ext.toUpperCase()}`}
/>

// 好：裝飾性圖片
<EagleImage
  item={item}
  alt=""
  role="presentation"
/>

// 好：搭配 figcaption
<figure>
  <EagleImage item={item} />
  <figcaption className="text-sm text-muted-foreground mt-2">
    {item.name}
  </figcaption>
</figure>
```

## 相關元件

- [ImageGrid](./image-grid) - 使用 EagleImage 的網格佈局
- [Dialog](../overlay/dialog) - 用於全螢幕圖片預覽
- [Card](../ui/card) - 帶中繼資料的圖片容器
