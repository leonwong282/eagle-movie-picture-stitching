---
sidebar_position: 3
title: Selectors
description: Derived state and memoization patterns
---

# Selectors

Selectors derive computed state from the store, enabling efficient re-renders and clean component code.

## Why Selectors?

| Benefit | Description |
|---------|-------------|
| **Performance** | Components only re-render when their specific data changes |
| **Reusability** | Share complex filtering logic across components |
| **Testability** | Pure functions that are easy to unit test |
| **Readability** | Move complex logic out of components |

## Basic Selectors

Simple selectors extract specific pieces of state:

```tsx
// stores/selectors.ts

// Select entire slice
export const selectSelection = (state: StoreState) => state.selection;
export const selectSettings = (state: StoreState) => state.settings;

// Select specific values
export const selectItems = (state: StoreState) => state.selection.items;
export const selectTheme = (state: StoreState) => state.settings.theme;
export const selectProgress = (state: StoreState) => state.processing.progress;

// Usage
const items = usePluginStore(selectItems);
const theme = usePluginStore(selectTheme);
```

## Computed Selectors

Selectors can compute derived values:

```tsx
// Filter by type
export const selectImageItems = (state: StoreState) => 
  state.selection.items.filter(item => 
    ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(item.ext.toLowerCase())
  );

export const selectVideoItems = (state: StoreState) => 
  state.selection.items.filter(item => 
    ['mp4', 'webm', 'mov', 'avi'].includes(item.ext.toLowerCase())
  );

// Filter by metadata
export const selectStarredItems = (state: StoreState) => 
  state.selection.items.filter(item => item.star > 0);

export const selectTaggedItems = (state: StoreState) => 
  state.selection.items.filter(item => item.tags.length > 0);

// Count
export const selectItemCount = (state: StoreState) => 
  state.selection.items.length;

export const selectImageCount = (state: StoreState) => 
  selectImageItems(state).length;
```

### Usage in Components

```tsx
function Gallery() {
  const images = usePluginStore(selectImageItems);
  const videos = usePluginStore(selectVideoItems);
  
  return (
    <div>
      <Section title={`Images (${images.length})`}>
        {images.map(item => <ImageCard key={item.id} item={item} />)}
      </Section>
      
      <Section title={`Videos (${videos.length})`}>
        {videos.map(item => <VideoCard key={item.id} item={item} />)}
      </Section>
    </div>
  );
}
```

## Parameterized Selectors

Create selectors that accept parameters:

```tsx
// Factory function returns a selector
export const selectItemsByFolder = (folderId: string) => 
  (state: StoreState) => 
    state.selection.items.filter(item => 
      item.folders.includes(folderId)
    );

export const selectItemsByTag = (tagName: string) => 
  (state: StoreState) => 
    state.selection.items.filter(item => 
      item.tags.includes(tagName)
    );

export const selectItemById = (id: string) => 
  (state: StoreState) => 
    state.selection.items.find(item => item.id === id);

// Usage
function FolderView({ folderId }: { folderId: string }) {
  const items = usePluginStore(selectItemsByFolder(folderId));
  
  return (
    <div>
      {items.map(item => <ItemCard key={item.id} item={item} />)}
    </div>
  );
}
```

### Stable Selector References

For parameterized selectors, use `useMemo` to avoid creating new selectors on every render:

```tsx
function FolderView({ folderId }: { folderId: string }) {
  // ✅ Stable reference
  const selector = useMemo(
    () => selectItemsByFolder(folderId),
    [folderId]
  );
  
  const items = usePluginStore(selector);
  
  return <ItemList items={items} />;
}
```

## Memoized Selectors

For expensive computations, use memoization:

```tsx
import { createSelector } from 'reselect';

// Reselect createSelector memoizes based on input selectors
export const selectSortedItems = createSelector(
  [selectItems, (state: StoreState) => state.ui.sortBy, (state: StoreState) => state.ui.sortOrder],
  (items, sortBy, sortOrder) => {
    const sorted = [...items].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'date':
          return a.modificationTime - b.modificationTime;
        case 'size':
          return a.size - b.size;
        default:
          return 0;
      }
    });
    
    return sortOrder === 'desc' ? sorted.reverse() : sorted;
  }
);

export const selectFilteredItems = createSelector(
  [selectSortedItems, (state: StoreState) => state.ui.searchQuery],
  (items, searchQuery) => {
    if (!searchQuery.trim()) return items;
    
    const query = searchQuery.toLowerCase();
    return items.filter(item => 
      item.name.toLowerCase().includes(query) ||
      item.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }
);
```

### Manual Memoization

Without reselect, you can manually memoize:

```tsx
// Simple memoization for single-value dependencies
const memoizedSelectImageItems = (() => {
  let lastItems: EagleItem[] = [];
  let lastResult: EagleItem[] = [];
  
  return (state: StoreState) => {
    if (state.selection.items === lastItems) {
      return lastResult;
    }
    
    lastItems = state.selection.items;
    lastResult = state.selection.items.filter(item => 
      ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(item.ext.toLowerCase())
    );
    
    return lastResult;
  };
})();
```

## Composing Selectors

Build complex selectors by composing simpler ones:

```tsx
// Base selectors
const selectItems = (state: StoreState) => state.selection.items;
const selectSearchQuery = (state: StoreState) => state.ui.searchQuery;
const selectSortConfig = (state: StoreState) => ({
  sortBy: state.ui.sortBy,
  sortOrder: state.ui.sortOrder,
});

// Composed selectors
const selectSearchedItems = createSelector(
  [selectItems, selectSearchQuery],
  (items, query) => {
    if (!query) return items;
    return items.filter(item => 
      item.name.toLowerCase().includes(query.toLowerCase())
    );
  }
);

const selectSortedSearchedItems = createSelector(
  [selectSearchedItems, selectSortConfig],
  (items, { sortBy, sortOrder }) => {
    const sorted = sortItems(items, sortBy);
    return sortOrder === 'desc' ? sorted.reverse() : sorted;
  }
);

// Further composition
const selectDisplayItems = createSelector(
  [selectSortedSearchedItems, (state: StoreState) => state.ui.viewMode],
  (items, viewMode) => ({
    items,
    viewMode,
    isEmpty: items.length === 0,
  })
);
```

## Statistics Selectors

Compute statistics from the store:

```tsx
export const selectSelectionStats = createSelector(
  [selectItems],
  (items) => {
    const totalSize = items.reduce((sum, item) => sum + item.size, 0);
    const byType = items.reduce((acc, item) => {
      const type = item.ext.toLowerCase();
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      count: items.length,
      totalSize,
      averageSize: items.length ? totalSize / items.length : 0,
      byType,
      hasImages: items.some(i => isImage(i)),
      hasVideos: items.some(i => isVideo(i)),
    };
  }
);

// Usage
function SelectionInfo() {
  const stats = usePluginStore(selectSelectionStats);
  
  return (
    <div>
      <p>{stats.count} items selected</p>
      <p>Total: {formatBytes(stats.totalSize)}</p>
      <p>Types: {Object.entries(stats.byType).map(([type, count]) => 
        `${type}: ${count}`
      ).join(', ')}</p>
    </div>
  );
}
```

## Validation Selectors

Check if operations are valid:

```tsx
export const selectCanExport = (state: StoreState) => 
  state.selection.items.length > 0 && 
  state.processing.status !== 'processing';

export const selectCanProcess = createSelector(
  [selectImageItems, (state: StoreState) => state.processing.status],
  (images, status) => images.length > 0 && status !== 'processing'
);

export const selectHasUnsavedChanges = (state: StoreState) =>
  state.processing.results.length > 0 && 
  !state.processing.results.every(r => r.saved);

// Usage
function ExportButton() {
  const canExport = usePluginStore(selectCanExport);
  
  return (
    <Button disabled={!canExport}>
      Export
    </Button>
  );
}
```

## Hook-Based Selectors

Create custom hooks that encapsulate selectors:

```tsx
// Custom hook with built-in selector
function useImageItems() {
  return usePluginStore(selectImageItems);
}

function useItemById(id: string) {
  const selector = useMemo(() => selectItemById(id), [id]);
  return usePluginStore(selector);
}

function useSelectionStats() {
  return usePluginStore(selectSelectionStats);
}

// Compound hook
function useGalleryState() {
  const items = usePluginStore(selectFilteredItems);
  const { viewMode, sortBy } = usePluginStore(state => ({
    viewMode: state.ui.viewMode,
    sortBy: state.ui.sortBy,
  }), shallow);
  const stats = usePluginStore(selectSelectionStats);
  
  return {
    items,
    viewMode,
    sortBy,
    stats,
  };
}
```

## Testing Selectors

Selectors are pure functions, making them easy to test:

```tsx
import { selectImageItems, selectStarredItems, selectSelectionStats } from './selectors';

describe('selectors', () => {
  const mockState = {
    selection: {
      items: [
        { id: '1', name: 'photo.jpg', ext: 'jpg', star: 5, size: 1000 },
        { id: '2', name: 'video.mp4', ext: 'mp4', star: 0, size: 2000 },
        { id: '3', name: 'icon.png', ext: 'png', star: 3, size: 500 },
      ],
      isLoading: false,
      isPolling: false,
    },
    // ... other slices
  };
  
  test('selectImageItems filters correctly', () => {
    const images = selectImageItems(mockState);
    expect(images).toHaveLength(2);
    expect(images.map(i => i.ext)).toEqual(['jpg', 'png']);
  });
  
  test('selectStarredItems filters starred items', () => {
    const starred = selectStarredItems(mockState);
    expect(starred).toHaveLength(2);
    expect(starred.every(i => i.star > 0)).toBe(true);
  });
  
  test('selectSelectionStats computes correctly', () => {
    const stats = selectSelectionStats(mockState);
    expect(stats.count).toBe(3);
    expect(stats.totalSize).toBe(3500);
    expect(stats.byType).toEqual({ jpg: 1, mp4: 1, png: 1 });
  });
});
```

## Best Practices

### ✅ Do

```tsx
// Keep selectors focused
const selectItems = (state) => state.selection.items;

// Compose for complex logic
const selectFilteredItems = createSelector(
  [selectItems, selectFilter],
  (items, filter) => items.filter(filter)
);

// Memoize expensive computations
const selectStats = createSelector([selectItems], computeStats);

// Use stable references for parameterized selectors
const selector = useMemo(() => selectByFolder(id), [id]);
```

### ❌ Don't

```tsx
// Don't compute in component
const items = usePluginStore(s => s.items.filter(...));  // Runs every render!

// Don't create selectors inline
usePluginStore(state => state.items.find(i => i.id === id));  // New function each render

// Don't mutate in selectors
const selectSorted = (state) => {
  state.items.sort(...);  // Mutates state!
  return state.items;
};
```

## Related

- [State Overview](./overview) - Architecture introduction
- [Store Slices](./slices) - State organization
- [Persistence](./persistence) - State persistence configuration
