---
sidebar_position: 1
title: Overview
description: Zustand-based state management architecture
---

# State Management Overview

The template uses **Zustand** for state management, providing a lightweight, flexible, and type-safe solution for React applications.

## Why Zustand?

| Feature | Zustand | Redux | Context |
|---------|---------|-------|---------|
| Bundle Size | ~1KB | ~7KB | 0KB |
| Boilerplate | Minimal | High | Medium |
| DevTools | ✅ | ✅ | ⚠️ Limited |
| Persistence | ✅ Built-in | ⚠️ Middleware | ❌ Manual |
| Learning Curve | Easy | Steep | Easy |

Zustand offers the best balance of simplicity and power for Eagle plugins.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     Zustand Store                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │  selection  │  │  settings   │  │ processing  │             │
│  │    slice    │  │    slice    │  │    slice    │             │
│  ├─────────────┤  ├─────────────┤  ├─────────────┤             │
│  │ • items     │  │ • theme     │  │ • status    │             │
│  │ • isLoading │  │ • format    │  │ • progress  │             │
│  │ • isPolling │  │ • quality   │  │ • results   │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
│                                                                 │
│  ┌─────────────┐                                               │
│  │     ui      │                                               │
│  │    slice    │                                               │
│  ├─────────────┤                                               │
│  │ • panel     │                                               │
│  │ • modal     │                                               │
│  │ • search    │                                               │
│  └─────────────┘                                               │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                     Persistence Layer                           │
│                   (localStorage adapter)                        │
└─────────────────────────────────────────────────────────────────┘
```

## Quick Start

### Import the Store

```tsx
import { usePluginStore } from '@/stores';
```

### Use Convenience Hooks

```tsx
import { useSelection, useSettings, useProcessing, useUI } from '@/stores';

function MyComponent() {
  // Selection state
  const { items, isLoading, startPolling, stopPolling } = useSelection();
  
  // Settings state
  const { theme, setTheme, quality, setQuality } = useSettings();
  
  // Processing state
  const { status, progress, startProcessing } = useProcessing();
  
  // UI state
  const { activePanel, setActivePanel, searchQuery } = useUI();
  
  return <div>...</div>;
}
```

### Direct Store Access

```tsx
// Read state
const items = usePluginStore(state => state.selection.items);

// Multiple values with shallow compare
const { items, isLoading } = usePluginStore(
  state => ({
    items: state.selection.items,
    isLoading: state.selection.isLoading,
  }),
  shallow
);

// Actions
const setItems = usePluginStore(state => state.setSelectedItems);
```

## Store Slices

The store is organized into focused slices:

### Selection Slice

Manages Eagle item selection state.

```tsx
interface SelectionSlice {
  items: EagleItem[];
  isLoading: boolean;
  isPolling: boolean;
  setSelectedItems: (items: EagleItem[]) => void;
  startPolling: () => void;
  stopPolling: () => void;
  refresh: () => Promise<void>;
}
```

[Learn more →](./slices#selection-slice)

### Settings Slice

Manages user preferences with persistence.

```tsx
interface SettingsSlice {
  theme: 'light' | 'dark' | 'auto';
  outputFormat: 'png' | 'jpg' | 'webp';
  quality: number;
  setTheme: (theme: Theme) => void;
  setOutputFormat: (format: Format) => void;
  setQuality: (quality: number) => void;
}
```

[Learn more →](./slices#settings-slice)

### Processing Slice

Manages batch operation state.

```tsx
interface ProcessingSlice {
  status: 'idle' | 'processing' | 'success' | 'error';
  progress: number;
  results: ProcessingResult[];
  startProcessing: () => void;
  updateProgress: (progress: number) => void;
  completeProcessing: (results: ProcessingResult[]) => void;
  reset: () => void;
}
```

[Learn more →](./slices#processing-slice)

### UI Slice

Manages ephemeral UI state (not persisted).

```tsx
interface UISlice {
  activePanel: string;
  modalOpen: boolean;
  searchQuery: string;
  setActivePanel: (panel: string) => void;
  openModal: () => void;
  closeModal: () => void;
  setSearchQuery: (query: string) => void;
}
```

[Learn more →](./slices#ui-slice)

## Using Selectors

Selectors derive computed state and improve performance.

```tsx
import { 
  selectImageItems, 
  selectVideoItems,
  selectStarredItems,
  selectItemsByFolder 
} from '@/stores/selectors';

function Gallery() {
  // Only re-renders when filtered items change
  const images = usePluginStore(selectImageItems);
  const videos = usePluginStore(selectVideoItems);
  const starred = usePluginStore(selectStarredItems);
  
  return (
    <div>
      <h2>Images ({images.length})</h2>
      <h2>Videos ({videos.length})</h2>
      <h2>Starred ({starred.length})</h2>
    </div>
  );
}
```

[Learn more →](./selectors)

## Persistence

Settings are automatically persisted to localStorage.

```tsx
// Store configuration
const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // ... state and actions
    }),
    {
      name: 'eagle-react-template:store',
      partialize: (state) => ({
        settings: state.settings,  // Only persist settings
      }),
    }
  )
);
```

[Learn more →](./persistence)

## Common Patterns

### Reading State in Effects

```tsx
function SelectionMonitor() {
  const items = usePluginStore(state => state.selection.items);
  
  useEffect(() => {
    console.log('Selection changed:', items.length);
  }, [items]);
  
  return null;
}
```

### Updating Multiple Values

```tsx
const updateSettings = usePluginStore(state => state.updateSettings);

// Update multiple settings at once
updateSettings({
  theme: 'dark',
  quality: 0.9,
  outputFormat: 'png',
});
```

### Conditional State Access

```tsx
function ItemDetails() {
  // Only subscribe to first item
  const firstItem = usePluginStore(
    state => state.selection.items[0] ?? null
  );
  
  if (!firstItem) {
    return <EmptyState />;
  }
  
  return <ItemCard item={firstItem} />;
}
```

### Async Actions

```tsx
const processItems = async () => {
  const { items } = usePluginStore.getState().selection;
  const { startProcessing, updateProgress, completeProcessing } = 
    usePluginStore.getState();
  
  startProcessing();
  
  const results = [];
  for (let i = 0; i < items.length; i++) {
    const result = await processItem(items[i]);
    results.push(result);
    updateProgress((i + 1) / items.length * 100);
  }
  
  completeProcessing(results);
};
```

## DevTools

Enable Redux DevTools for debugging:

```tsx
import { devtools } from 'zustand/middleware';

const useStore = create<StoreState>()(
  devtools(
    persist(
      (set, get) => ({
        // ... store definition
      }),
      { name: 'eagle-plugin-store' }
    ),
    { name: 'EaglePlugin' }
  )
);
```

## Best Practices

### ✅ Do

```tsx
// Use convenience hooks for common access
const { items, isLoading } = useSelection();

// Use selectors for derived state
const images = usePluginStore(selectImageItems);

// Use shallow compare for object selections
const { a, b } = usePluginStore(state => ({ a, b }), shallow);

// Access state outside React when needed
const items = usePluginStore.getState().selection.items;
```

### ❌ Don't

```tsx
// Don't subscribe to entire store
const everything = usePluginStore(state => state);

// Don't create inline selectors for objects
const items = usePluginStore(state => ({ 
  items: state.selection.items 
})); // Re-renders every time!

// Don't mutate state directly
state.items.push(newItem); // Won't trigger updates!
```

## Related

- [Store Slices](./slices) - Detailed slice documentation
- [Selectors](./selectors) - Computed state patterns
- [Persistence](./persistence) - State persistence configuration
