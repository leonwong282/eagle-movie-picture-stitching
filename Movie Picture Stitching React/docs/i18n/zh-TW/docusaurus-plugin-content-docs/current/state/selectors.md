# 選擇器

選擇器用於從儲存庫衍生狀態。它們可以提高效能，防止不必要的重新渲染，並保持元件簡潔。

## 基本選擇器

### 直接狀態存取

```typescript
import { usePluginStore } from '@/stores';

// 簡單選擇器 - 直接存取狀態
const items = usePluginStore(state => state.selection.items);
const theme = usePluginStore(state => state.settings.theme);
const isProcessing = usePluginStore(state => state.processing.status === 'processing');
```

### 多值選擇器

使用 `shallow` 比較在單一選擇器中選取多個值：

```typescript
import { shallow } from 'zustand/shallow';
import { usePluginStore } from '@/stores';

function SelectionInfo() {
  // ✅ 使用 shallow 比較的多值選擇器
  const { items, isLoading, error } = usePluginStore(
    state => ({
      items: state.selection.items,
      isLoading: state.selection.isLoading,
      error: state.selection.error,
    }),
    shallow
  );
  
  return (
    <div>
      {isLoading && <Spinner />}
      {error && <Error message={error} />}
      <ItemList items={items} />
    </div>
  );
}
```

## 衍生選擇器

### 計算選擇器

建立計算衍生值的可重用選擇器：

```typescript
// src/stores/selectors.ts

// 依類型篩選項目
export const selectImageItems = (state: PluginStore) =>
  state.selection.items.filter(item => 
    ['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(item.ext.toLowerCase())
  );

export const selectVideoItems = (state: PluginStore) =>
  state.selection.items.filter(item =>
    ['mp4', 'mov', 'avi', 'webm'].includes(item.ext.toLowerCase())
  );

// 依星級篩選
export const selectStarredItems = (state: PluginStore) =>
  state.selection.items.filter(item => item.star > 0);

export const selectUntaggedItems = (state: PluginStore) =>
  state.selection.items.filter(item => item.tags.length === 0);

// 使用方式
function ImageGallery() {
  const images = usePluginStore(selectImageItems);
  return <Gallery items={images} />;
}
```

### 統計選擇器

```typescript
// 選取統計
export const selectSelectionStats = (state: PluginStore) => {
  const items = state.selection.items;
  
  return {
    total: items.length,
    images: items.filter(i => isImage(i.ext)).length,
    videos: items.filter(i => isVideo(i.ext)).length,
    others: items.filter(i => !isImage(i.ext) && !isVideo(i.ext)).length,
    totalSize: items.reduce((sum, i) => sum + (i.size || 0), 0),
    starred: items.filter(i => i.star > 0).length,
    tagged: items.filter(i => i.tags.length > 0).length,
  };
};

// 處理統計
export const selectProcessingStats = (state: PluginStore) => {
  const { results, startTime, status } = state.processing;
  
  const successful = results.filter(r => r.status === 'success').length;
  const failed = results.filter(r => r.status === 'error').length;
  const skipped = results.filter(r => r.status === 'skipped').length;
  
  return {
    successful,
    failed,
    skipped,
    total: results.length,
    successRate: results.length > 0 ? successful / results.length : 0,
    duration: startTime && status === 'completed' 
      ? Date.now() - startTime 
      : null,
  };
};

// 使用方式
function StatsPanel() {
  const stats = usePluginStore(selectSelectionStats);
  
  return (
    <div className="stats-grid">
      <Stat label="總計" value={stats.total} />
      <Stat label="圖片" value={stats.images} />
      <Stat label="影片" value={stats.videos} />
      <Stat label="總大小" value={formatBytes(stats.totalSize)} />
    </div>
  );
}
```

## 參數化選擇器

### 建立選擇器工廠

對於需要參數的選擇器，建立工廠函式：

```typescript
// 依副檔名篩選
export const createExtensionSelector = (extensions: string[]) =>
  (state: PluginStore) =>
    state.selection.items.filter(item =>
      extensions.includes(item.ext.toLowerCase())
    );

// 依標籤篩選
export const createTagSelector = (tag: string) =>
  (state: PluginStore) =>
    state.selection.items.filter(item =>
      item.tags.includes(tag)
    );

// 依資料夾篩選
export const createFolderSelector = (folderId: string) =>
  (state: PluginStore) =>
    state.selection.items.filter(item =>
      item.folders.includes(folderId)
    );

// 使用方式
function PsdFiles() {
  const selectPsd = useMemo(
    () => createExtensionSelector(['psd']), 
    []
  );
  const psdFiles = usePluginStore(selectPsd);
  
  return <FileList files={psdFiles} />;
}
```

### 使用 createSelector 的記憶化選擇器

對於開銷較大的計算，使用記憶化：

```typescript
import { createSelector } from 'reselect';

// 基礎選擇器
const selectItems = (state: PluginStore) => state.selection.items;
const selectSearchQuery = (state: PluginStore) => state.ui.searchQuery;
const selectSortOrder = (state: PluginStore) => state.ui.sortOrder;
const selectSortDirection = (state: PluginStore) => state.ui.sortDirection;

// 記憶化搜尋選擇器
export const selectFilteredItems = createSelector(
  [selectItems, selectSearchQuery],
  (items, query) => {
    if (!query.trim()) return items;
    
    const lowerQuery = query.toLowerCase();
    return items.filter(item =>
      item.name.toLowerCase().includes(lowerQuery) ||
      item.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }
);

// 記憶化排序選擇器
export const selectSortedItems = createSelector(
  [selectFilteredItems, selectSortOrder, selectSortDirection],
  (items, order, direction) => {
    const sorted = [...items].sort((a, b) => {
      switch (order) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'date':
          return (a.modificationTime || 0) - (b.modificationTime || 0);
        case 'size':
          return (a.size || 0) - (b.size || 0);
        case 'type':
          return a.ext.localeCompare(b.ext);
        default:
          return 0;
      }
    });
    
    return direction === 'desc' ? sorted.reverse() : sorted;
  }
);

// 使用方式
function ItemGrid() {
  const items = usePluginStore(selectSortedItems);
  return <Grid items={items} />;
}
```

## 組合選擇器

### 組合多個選擇器

```typescript
import { createSelector } from 'reselect';

// 組合選擇器以建立複雜查詢
export const selectProcessableImages = createSelector(
  [selectImageItems, selectSettings],
  (images, settings) => {
    return images.filter(img => {
      // 依據設定篩選
      if (settings.minSize && img.size < settings.minSize) return false;
      if (settings.maxSize && img.size > settings.maxSize) return false;
      return true;
    });
  }
);

// 已篩選項目的統計
export const selectFilteredStats = createSelector(
  [selectSortedItems],
  (items) => ({
    count: items.length,
    totalSize: items.reduce((sum, i) => sum + (i.size || 0), 0),
    types: [...new Set(items.map(i => i.ext))],
  })
);
```

### 複雜衍生狀態

```typescript
// 完整的儀表板狀態
export const selectDashboardState = createSelector(
  [
    selectSelectionStats,
    selectProcessingStats,
    (state: PluginStore) => state.processing.status,
    (state: PluginStore) => state.settings.theme,
  ],
  (selectionStats, processingStats, status, theme) => ({
    selection: selectionStats,
    processing: processingStats,
    isProcessing: status === 'processing',
    theme,
    // 衍生標誌
    hasSelection: selectionStats.total > 0,
    hasImages: selectionStats.images > 0,
    canProcess: selectionStats.images > 0 && status !== 'processing',
  })
);

// 使用方式
function Dashboard() {
  const dashboard = usePluginStore(selectDashboardState);
  
  return (
    <div className={`dashboard theme-${dashboard.theme}`}>
      <SelectionPanel stats={dashboard.selection} />
      {dashboard.isProcessing && (
        <ProcessingPanel stats={dashboard.processing} />
      )}
      <ActionBar 
        canProcess={dashboard.canProcess}
        hasSelection={dashboard.hasSelection}
      />
    </div>
  );
}
```

## 效能優化

### 避免不必要的重新渲染

```typescript
// ❌ 錯誤 - 每次都建立新物件
function BadComponent() {
  const data = usePluginStore(state => ({
    items: state.selection.items,
    theme: state.settings.theme,
  })); // 每次渲染都是新的參照！
}

// ✅ 正確 - 使用 shallow 比較
function GoodComponent() {
  const data = usePluginStore(
    state => ({
      items: state.selection.items,
      theme: state.settings.theme,
    }),
    shallow
  );
}

// ✅ 正確 - 分開訂閱
function BetterComponent() {
  const items = usePluginStore(state => state.selection.items);
  const theme = usePluginStore(state => state.settings.theme);
}

// ✅ 最佳 - 使用記憶化選擇器
function BestComponent() {
  const items = usePluginStore(selectSortedItems);
}
```

### 選擇器效能提示

1. **保持選擇器純淨**：選擇器不應有副作用
2. **記憶化開銷大的計算**：對複雜衍生使用 `createSelector`
3. **避免內聯選擇器建立物件**：使用 `shallow` 或分開訂閱
4. **對依賴相同基礎狀態的選擇器重用基礎選擇器**

```typescript
// ✅ 重用基礎選擇器
const selectItems = (state: PluginStore) => state.selection.items;

export const selectImageCount = createSelector(
  [selectItems],
  (items) => items.filter(i => isImage(i.ext)).length
);

export const selectVideoCount = createSelector(
  [selectItems],
  (items) => items.filter(i => isVideo(i.ext)).length
);
```

## 下一步

- [持久化](./persistence.md) - 配置狀態持久化
- [Store 切片](./slices.md) - 詳細的切片文件
