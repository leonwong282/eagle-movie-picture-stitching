---
sidebar_position: 2
title: Store Slices
description: Modular state organization with slices
---

# Store Slices

The store is organized into focused slices, each managing a specific domain of application state.

## Overview

| Slice | Purpose | Persisted |
|-------|---------|-----------|
| `selection` | Eagle item selection | No |
| `settings` | User preferences | Yes |
| `processing` | Batch operation state | No |
| `ui` | UI state (panels, modals) | No |

## Selection Slice

Manages the current Eagle library selection.

### State

```tsx
interface SelectionState {
  items: EagleItem[];
  isLoading: boolean;
  isPolling: boolean;
  lastUpdated: number | null;
}
```

### Actions

```tsx
interface SelectionActions {
  setSelectedItems: (items: EagleItem[]) => void;
  startPolling: () => void;
  stopPolling: () => void;
  refresh: () => Promise<void>;
  clearSelection: () => void;
}
```

### Implementation

```tsx
// stores/slices/selection.ts
import { StateCreator } from 'zustand';

export interface SelectionSlice {
  selection: {
    items: EagleItem[];
    isLoading: boolean;
    isPolling: boolean;
    lastUpdated: number | null;
  };
  setSelectedItems: (items: EagleItem[]) => void;
  startPolling: () => void;
  stopPolling: () => void;
  refreshSelection: () => Promise<void>;
}

export const createSelectionSlice: StateCreator<SelectionSlice> = (set, get) => ({
  selection: {
    items: [],
    isLoading: false,
    isPolling: false,
    lastUpdated: null,
  },
  
  setSelectedItems: (items) => set((state) => ({
    selection: {
      ...state.selection,
      items,
      lastUpdated: Date.now(),
    },
  })),
  
  startPolling: () => set((state) => ({
    selection: { ...state.selection, isPolling: true },
  })),
  
  stopPolling: () => set((state) => ({
    selection: { ...state.selection, isPolling: false },
  })),
  
  refreshSelection: async () => {
    set((state) => ({
      selection: { ...state.selection, isLoading: true },
    }));
    
    try {
      const items = await eagleApi.item.getSelected();
      set((state) => ({
        selection: {
          ...state.selection,
          items,
          isLoading: false,
          lastUpdated: Date.now(),
        },
      }));
    } catch (error) {
      set((state) => ({
        selection: { ...state.selection, isLoading: false },
      }));
    }
  },
});
```

### Usage

```tsx
import { useSelection } from '@/stores';

function SelectionPanel() {
  const { items, isLoading, isPolling, startPolling, stopPolling } = useSelection();
  
  useEffect(() => {
    startPolling();
    return () => stopPolling();
  }, []);
  
  if (isLoading) return <Spinner />;
  
  return (
    <div>
      <p>{items.length} items selected</p>
      {items.map(item => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}
```

---

## Settings Slice

Manages user preferences with automatic persistence.

### State

```tsx
interface SettingsState {
  theme: 'light' | 'dark' | 'auto';
  outputFormat: 'png' | 'jpg' | 'webp';
  quality: number;
  autoPreview: boolean;
  confirmBeforeExport: boolean;
}
```

### Actions

```tsx
interface SettingsActions {
  setTheme: (theme: Theme) => void;
  setOutputFormat: (format: OutputFormat) => void;
  setQuality: (quality: number) => void;
  setAutoPreview: (enabled: boolean) => void;
  updateSettings: (partial: Partial<SettingsState>) => void;
  resetSettings: () => void;
}
```

### Implementation

```tsx
// stores/slices/settings.ts
const DEFAULT_SETTINGS: SettingsState = {
  theme: 'auto',
  outputFormat: 'png',
  quality: 0.9,
  autoPreview: true,
  confirmBeforeExport: true,
};

export const createSettingsSlice: StateCreator<SettingsSlice> = (set) => ({
  settings: { ...DEFAULT_SETTINGS },
  
  setTheme: (theme) => set((state) => ({
    settings: { ...state.settings, theme },
  })),
  
  setOutputFormat: (outputFormat) => set((state) => ({
    settings: { ...state.settings, outputFormat },
  })),
  
  setQuality: (quality) => set((state) => ({
    settings: { 
      ...state.settings, 
      quality: Math.max(0.1, Math.min(1, quality)),
    },
  })),
  
  setAutoPreview: (autoPreview) => set((state) => ({
    settings: { ...state.settings, autoPreview },
  })),
  
  updateSettings: (partial) => set((state) => ({
    settings: { ...state.settings, ...partial },
  })),
  
  resetSettings: () => set({ settings: { ...DEFAULT_SETTINGS } }),
});
```

### Usage

```tsx
import { useSettings } from '@/stores';

function SettingsPanel() {
  const { 
    theme, 
    quality, 
    outputFormat,
    setTheme, 
    setQuality,
    setOutputFormat,
    resetSettings,
  } = useSettings();
  
  return (
    <div className="space-y-4">
      <div>
        <label>Theme</label>
        <select 
          value={theme} 
          onChange={(e) => setTheme(e.target.value as Theme)}
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="auto">Auto</option>
        </select>
      </div>
      
      <div>
        <label>Quality: {Math.round(quality * 100)}%</label>
        <input
          type="range"
          min="0.1"
          max="1"
          step="0.05"
          value={quality}
          onChange={(e) => setQuality(parseFloat(e.target.value))}
        />
      </div>
      
      <div>
        <label>Format</label>
        <select 
          value={outputFormat}
          onChange={(e) => setOutputFormat(e.target.value as OutputFormat)}
        >
          <option value="png">PNG</option>
          <option value="jpg">JPEG</option>
          <option value="webp">WebP</option>
        </select>
      </div>
      
      <button onClick={resetSettings}>Reset to Defaults</button>
    </div>
  );
}
```

---

## Processing Slice

Manages batch operation progress and results.

### State

```tsx
type ProcessingStatus = 'idle' | 'processing' | 'success' | 'error';

interface ProcessingResult {
  itemId: string;
  success: boolean;
  outputPath?: string;
  error?: string;
}

interface ProcessingState {
  status: ProcessingStatus;
  progress: number;  // 0-100
  currentItem: string | null;
  results: ProcessingResult[];
  error: string | null;
}
```

### Actions

```tsx
interface ProcessingActions {
  startProcessing: () => void;
  updateProgress: (progress: number, currentItem?: string) => void;
  addResult: (result: ProcessingResult) => void;
  completeProcessing: (results: ProcessingResult[]) => void;
  failProcessing: (error: string) => void;
  reset: () => void;
}
```

### Implementation

```tsx
// stores/slices/processing.ts
export const createProcessingSlice: StateCreator<ProcessingSlice> = (set) => ({
  processing: {
    status: 'idle',
    progress: 0,
    currentItem: null,
    results: [],
    error: null,
  },
  
  startProcessing: () => set({
    processing: {
      status: 'processing',
      progress: 0,
      currentItem: null,
      results: [],
      error: null,
    },
  }),
  
  updateProgress: (progress, currentItem) => set((state) => ({
    processing: {
      ...state.processing,
      progress: Math.min(100, Math.max(0, progress)),
      currentItem: currentItem ?? state.processing.currentItem,
    },
  })),
  
  addResult: (result) => set((state) => ({
    processing: {
      ...state.processing,
      results: [...state.processing.results, result],
    },
  })),
  
  completeProcessing: (results) => set({
    processing: {
      status: 'success',
      progress: 100,
      currentItem: null,
      results,
      error: null,
    },
  }),
  
  failProcessing: (error) => set((state) => ({
    processing: {
      ...state.processing,
      status: 'error',
      error,
    },
  })),
  
  resetProcessing: () => set({
    processing: {
      status: 'idle',
      progress: 0,
      currentItem: null,
      results: [],
      error: null,
    },
  }),
});
```

### Usage

```tsx
import { useProcessing } from '@/stores';

function ProcessingProgress() {
  const { 
    status, 
    progress, 
    currentItem, 
    results,
    error,
    reset,
  } = useProcessing();
  
  if (status === 'idle') return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        {status === 'processing' && (
          <>
            <h3>Processing...</h3>
            <ProgressBar value={progress} />
            {currentItem && <p>Current: {currentItem}</p>}
          </>
        )}
        
        {status === 'success' && (
          <>
            <h3>Complete!</h3>
            <p>
              {results.filter(r => r.success).length} succeeded,
              {results.filter(r => !r.success).length} failed
            </p>
            <button onClick={reset}>Close</button>
          </>
        )}
        
        {status === 'error' && (
          <>
            <h3>Error</h3>
            <p className="text-red-500">{error}</p>
            <button onClick={reset}>Close</button>
          </>
        )}
      </div>
    </div>
  );
}
```

---

## UI Slice

Manages ephemeral UI state that doesn't need persistence.

### State

```tsx
interface UIState {
  activePanel: string;
  modalOpen: boolean;
  modalContent: React.ReactNode | null;
  searchQuery: string;
  sortBy: 'name' | 'date' | 'size';
  sortOrder: 'asc' | 'desc';
  viewMode: 'grid' | 'list';
}
```

### Actions

```tsx
interface UIActions {
  setActivePanel: (panel: string) => void;
  openModal: (content?: React.ReactNode) => void;
  closeModal: () => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sortBy: SortOption) => void;
  toggleSortOrder: () => void;
  setViewMode: (mode: ViewMode) => void;
}
```

### Implementation

```tsx
// stores/slices/ui.ts
export const createUISlice: StateCreator<UISlice> = (set) => ({
  ui: {
    activePanel: 'selection',
    modalOpen: false,
    modalContent: null,
    searchQuery: '',
    sortBy: 'name',
    sortOrder: 'asc',
    viewMode: 'grid',
  },
  
  setActivePanel: (activePanel) => set((state) => ({
    ui: { ...state.ui, activePanel },
  })),
  
  openModal: (content = null) => set((state) => ({
    ui: { ...state.ui, modalOpen: true, modalContent: content },
  })),
  
  closeModal: () => set((state) => ({
    ui: { ...state.ui, modalOpen: false, modalContent: null },
  })),
  
  setSearchQuery: (searchQuery) => set((state) => ({
    ui: { ...state.ui, searchQuery },
  })),
  
  setSortBy: (sortBy) => set((state) => ({
    ui: { ...state.ui, sortBy },
  })),
  
  toggleSortOrder: () => set((state) => ({
    ui: { 
      ...state.ui, 
      sortOrder: state.ui.sortOrder === 'asc' ? 'desc' : 'asc',
    },
  })),
  
  setViewMode: (viewMode) => set((state) => ({
    ui: { ...state.ui, viewMode },
  })),
});
```

### Usage

```tsx
import { useUI } from '@/stores';

function Toolbar() {
  const { 
    viewMode, 
    setViewMode,
    sortBy,
    setSortBy,
    sortOrder,
    toggleSortOrder,
    searchQuery,
    setSearchQuery,
  } = useUI();
  
  return (
    <div className="flex items-center gap-4">
      <input
        type="search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search..."
      />
      
      <select 
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value as SortOption)}
      >
        <option value="name">Name</option>
        <option value="date">Date</option>
        <option value="size">Size</option>
      </select>
      
      <button onClick={toggleSortOrder}>
        {sortOrder === 'asc' ? '↑' : '↓'}
      </button>
      
      <div className="flex">
        <button 
          className={viewMode === 'grid' ? 'active' : ''}
          onClick={() => setViewMode('grid')}
        >
          Grid
        </button>
        <button 
          className={viewMode === 'list' ? 'active' : ''}
          onClick={() => setViewMode('list')}
        >
          List
        </button>
      </div>
    </div>
  );
}
```

---

## Combining Slices

All slices are combined in the main store:

```tsx
// stores/index.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createSelectionSlice, SelectionSlice } from './slices/selection';
import { createSettingsSlice, SettingsSlice } from './slices/settings';
import { createProcessingSlice, ProcessingSlice } from './slices/processing';
import { createUISlice, UISlice } from './slices/ui';

type StoreState = SelectionSlice & SettingsSlice & ProcessingSlice & UISlice;

export const usePluginStore = create<StoreState>()(
  persist(
    (...args) => ({
      ...createSelectionSlice(...args),
      ...createSettingsSlice(...args),
      ...createProcessingSlice(...args),
      ...createUISlice(...args),
    }),
    {
      name: 'eagle-react-template:store',
      partialize: (state) => ({
        settings: state.settings,
      }),
    }
  )
);

// Convenience hooks
export const useSelection = () => usePluginStore((state) => ({
  ...state.selection,
  setSelectedItems: state.setSelectedItems,
  startPolling: state.startPolling,
  stopPolling: state.stopPolling,
  refresh: state.refreshSelection,
}));

export const useSettings = () => usePluginStore((state) => ({
  ...state.settings,
  setTheme: state.setTheme,
  setOutputFormat: state.setOutputFormat,
  setQuality: state.setQuality,
  updateSettings: state.updateSettings,
  resetSettings: state.resetSettings,
}));

export const useProcessing = () => usePluginStore((state) => ({
  ...state.processing,
  startProcessing: state.startProcessing,
  updateProgress: state.updateProgress,
  completeProcessing: state.completeProcessing,
  failProcessing: state.failProcessing,
  reset: state.resetProcessing,
}));

export const useUI = () => usePluginStore((state) => ({
  ...state.ui,
  setActivePanel: state.setActivePanel,
  openModal: state.openModal,
  closeModal: state.closeModal,
  setSearchQuery: state.setSearchQuery,
  setSortBy: state.setSortBy,
  toggleSortOrder: state.toggleSortOrder,
  setViewMode: state.setViewMode,
}));
```

## Related

- [State Overview](./overview) - Architecture introduction
- [Selectors](./selectors) - Computed state patterns
- [Persistence](./persistence) - State persistence configuration
