# Store 切片

儲存庫被組織成邏輯切片，每個切片管理特定的關注領域。

## Selection 切片

管理 Eagle 選取狀態和輪詢邏輯。

### 介面

```typescript
interface SelectionSlice {
  // 狀態
  items: Item[];
  isLoading: boolean;
  error: string | null;
  isPolling: boolean;
  isPaused: boolean;
  lastHash: string;
  
  // Actions
  setSelectedItems: (items: Item[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  startPolling: () => void;
  stopPolling: () => void;
  pausePolling: () => void;
  resumePolling: () => void;
  updateLastHash: (hash: string) => void;
}
```

### 實作

```typescript
import { StateCreator } from 'zustand';
import type { Item } from '@/types/eagle';

export const createSelectionSlice: StateCreator<
  PluginStore,
  [],
  [],
  SelectionSlice
> = (set) => ({
  // 初始狀態
  items: [],
  isLoading: false,
  error: null,
  isPolling: false,
  isPaused: false,
  lastHash: '',
  
  // Actions
  setSelectedItems: (items) => set(
    (state) => ({ 
      selection: { ...state.selection, items, error: null }
    }),
    false,
    'selection/setItems'
  ),
  
  setLoading: (isLoading) => set(
    (state) => ({ 
      selection: { ...state.selection, isLoading }
    }),
    false,
    'selection/setLoading'
  ),
  
  setError: (error) => set(
    (state) => ({ 
      selection: { ...state.selection, error, isLoading: false }
    }),
    false,
    'selection/setError'
  ),
  
  startPolling: () => set(
    (state) => ({ 
      selection: { ...state.selection, isPolling: true, isPaused: false }
    }),
    false,
    'selection/startPolling'
  ),
  
  stopPolling: () => set(
    (state) => ({ 
      selection: { ...state.selection, isPolling: false }
    }),
    false,
    'selection/stopPolling'
  ),
  
  pausePolling: () => set(
    (state) => ({ 
      selection: { ...state.selection, isPaused: true }
    }),
    false,
    'selection/pause'
  ),
  
  resumePolling: () => set(
    (state) => ({ 
      selection: { ...state.selection, isPaused: false }
    }),
    false,
    'selection/resume'
  ),
  
  updateLastHash: (lastHash) => set(
    (state) => ({ 
      selection: { ...state.selection, lastHash }
    }),
    false,
    'selection/updateHash'
  ),
});
```

### 使用方式

```typescript
import { useSelection } from '@/stores';

function SelectionManager() {
  const { 
    items, 
    isLoading, 
    error,
    isPolling,
    startPolling,
    stopPolling 
  } = useSelection();
  
  useEffect(() => {
    startPolling();
    return () => stopPolling();
  }, []);
  
  if (error) return <ErrorMessage error={error} />;
  if (isLoading) return <LoadingSpinner />;
  
  return (
    <div>
      <p>已選取 {items.length} 個項目</p>
      <p>輪詢狀態：{isPolling ? '啟用' : '停用'}</p>
    </div>
  );
}
```

---

## Settings 切片

管理持久化的使用者偏好設定。

### 介面

```typescript
interface SettingsSlice {
  // 狀態
  theme: 'light' | 'dark' | 'auto';
  language: string;
  outputFormat: 'png' | 'jpeg' | 'webp';
  quality: number;
  autoPreview: boolean;
  notifications: boolean;
  
  // Actions
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setLanguage: (lang: string) => void;
  setOutputFormat: (format: OutputFormat) => void;
  setQuality: (quality: number) => void;
  toggleAutoPreview: () => void;
  toggleNotifications: () => void;
  resetSettings: () => void;
}
```

### 實作

```typescript
const DEFAULT_SETTINGS = {
  theme: 'auto' as const,
  language: 'en',
  outputFormat: 'png' as const,
  quality: 0.9,
  autoPreview: true,
  notifications: true,
};

export const createSettingsSlice: StateCreator<
  PluginStore,
  [],
  [],
  SettingsSlice
> = (set) => ({
  ...DEFAULT_SETTINGS,
  
  setTheme: (theme) => set(
    (state) => ({ settings: { ...state.settings, theme }}),
    false,
    'settings/setTheme'
  ),
  
  toggleTheme: () => set(
    (state) => ({
      settings: {
        ...state.settings,
        theme: state.settings.theme === 'dark' ? 'light' : 'dark'
      }
    }),
    false,
    'settings/toggleTheme'
  ),
  
  setLanguage: (language) => set(
    (state) => ({ settings: { ...state.settings, language }}),
    false,
    'settings/setLanguage'
  ),
  
  setOutputFormat: (outputFormat) => set(
    (state) => ({ settings: { ...state.settings, outputFormat }}),
    false,
    'settings/setFormat'
  ),
  
  setQuality: (quality) => set(
    (state) => ({ 
      settings: { 
        ...state.settings, 
        quality: Math.max(0.1, Math.min(1, quality))
      }
    }),
    false,
    'settings/setQuality'
  ),
  
  toggleAutoPreview: () => set(
    (state) => ({
      settings: {
        ...state.settings,
        autoPreview: !state.settings.autoPreview
      }
    }),
    false,
    'settings/toggleAutoPreview'
  ),
  
  toggleNotifications: () => set(
    (state) => ({
      settings: {
        ...state.settings,
        notifications: !state.settings.notifications
      }
    }),
    false,
    'settings/toggleNotifications'
  ),
  
  resetSettings: () => set(
    () => ({ settings: DEFAULT_SETTINGS }),
    false,
    'settings/reset'
  ),
});
```

### 使用方式

```typescript
import { useSettings } from '@/stores';

function SettingsPanel() {
  const { 
    theme, 
    quality, 
    autoPreview,
    setTheme, 
    setQuality, 
    toggleAutoPreview,
    resetSettings
  } = useSettings();
  
  return (
    <div className="space-y-4">
      <div>
        <label>主題</label>
        <select 
          value={theme} 
          onChange={(e) => setTheme(e.target.value as Theme)}
        >
          <option value="light">淺色</option>
          <option value="dark">深色</option>
          <option value="auto">系統</option>
        </select>
      </div>
      
      <div>
        <label>品質：{Math.round(quality * 100)}%</label>
        <input 
          type="range" 
          min="0.1" 
          max="1" 
          step="0.1"
          value={quality}
          onChange={(e) => setQuality(Number(e.target.value))}
        />
      </div>
      
      <div>
        <label>
          <input 
            type="checkbox" 
            checked={autoPreview}
            onChange={toggleAutoPreview}
          />
          自動預覽
        </label>
      </div>
      
      <button onClick={resetSettings}>
        重設為預設值
      </button>
    </div>
  );
}
```

---

## Processing 切片

管理批次處理操作。

### 介面

```typescript
interface ProcessingResult {
  id: string;
  name: string;
  status: 'success' | 'error' | 'skipped';
  message?: string;
  outputPath?: string;
}

interface ProcessingSlice {
  // 狀態
  status: 'idle' | 'processing' | 'completed' | 'error';
  progress: number;
  total: number;
  currentItem: string;
  currentStep: string;
  results: ProcessingResult[];
  startTime: number | null;
  
  // Actions
  startProcessing: (total: number, firstItem?: string) => void;
  updateProgress: (current: number, item?: string, step?: string) => void;
  addResult: (result: ProcessingResult) => void;
  completeProcessing: () => void;
  setError: (error: string) => void;
  resetProcessing: () => void;
}
```

### 實作

```typescript
export const createProcessingSlice: StateCreator<
  PluginStore,
  [],
  [],
  ProcessingSlice
> = (set, get) => ({
  status: 'idle',
  progress: 0,
  total: 0,
  currentItem: '',
  currentStep: '',
  results: [],
  startTime: null,
  
  startProcessing: (total, firstItem = '') => set(
    () => ({
      processing: {
        status: 'processing',
        progress: 0,
        total,
        currentItem: firstItem,
        currentStep: '初始化中...',
        results: [],
        startTime: Date.now(),
      }
    }),
    false,
    'processing/start'
  ),
  
  updateProgress: (progress, currentItem, currentStep) => set(
    (state) => ({
      processing: {
        ...state.processing,
        progress,
        ...(currentItem && { currentItem }),
        ...(currentStep && { currentStep }),
      }
    }),
    false,
    'processing/update'
  ),
  
  addResult: (result) => set(
    (state) => ({
      processing: {
        ...state.processing,
        results: [...state.processing.results, result],
      }
    }),
    false,
    'processing/addResult'
  ),
  
  completeProcessing: () => set(
    (state) => ({
      processing: {
        ...state.processing,
        status: 'completed',
        progress: state.processing.total,
        currentStep: '完成',
      }
    }),
    false,
    'processing/complete'
  ),
  
  setError: (error) => set(
    (state) => ({
      processing: {
        ...state.processing,
        status: 'error',
        currentStep: error,
      }
    }),
    false,
    'processing/error'
  ),
  
  resetProcessing: () => set(
    () => ({
      processing: {
        status: 'idle',
        progress: 0,
        total: 0,
        currentItem: '',
        currentStep: '',
        results: [],
        startTime: null,
      }
    }),
    false,
    'processing/reset'
  ),
});
```

### 使用方式

```typescript
import { useProcessing } from '@/stores';

function ProcessingView() {
  const { 
    status, 
    progress, 
    total,
    currentItem,
    currentStep,
    results,
    startTime,
    startProcessing,
    updateProgress,
    addResult,
    completeProcessing,
    resetProcessing
  } = useProcessing();
  
  const elapsedTime = startTime 
    ? Math.floor((Date.now() - startTime) / 1000) 
    : 0;
  
  const processItems = async (items: Item[]) => {
    startProcessing(items.length);
    
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      updateProgress(i + 1, item.name, '處理中...');
      
      try {
        const result = await processItem(item);
        addResult({
          id: item.id,
          name: item.name,
          status: 'success',
          outputPath: result.path
        });
      } catch (error) {
        addResult({
          id: item.id,
          name: item.name,
          status: 'error',
          message: error.message
        });
      }
    }
    
    completeProcessing();
  };
  
  return (
    <div>
      {status === 'processing' && (
        <div>
          <ProgressBar value={progress} max={total} />
          <p>正在處理：{currentItem}</p>
          <p>{currentStep}</p>
          <p>已耗時：{elapsedTime}秒</p>
        </div>
      )}
      
      {status === 'completed' && (
        <div>
          <p>已完成 {results.length} 個項目</p>
          <ResultsList results={results} />
          <button onClick={resetProcessing}>開始新任務</button>
        </div>
      )}
    </div>
  );
}
```

---

## UI 切片

管理臨時性 UI 狀態（不持久化）。

### 介面

```typescript
interface ModalState {
  type: string;
  props?: Record<string, unknown>;
}

interface UISlice {
  // 狀態
  activePanel: string;
  searchQuery: string;
  sortOrder: 'name' | 'date' | 'size' | 'type';
  sortDirection: 'asc' | 'desc';
  viewMode: 'grid' | 'list';
  gridSize: 'small' | 'medium' | 'large';
  modalState: ModalState | null;
  sidebarCollapsed: boolean;
  
  // Actions
  setActivePanel: (panel: string) => void;
  setSearchQuery: (query: string) => void;
  setSortOrder: (order: SortOrder) => void;
  setSortDirection: (direction: SortDirection) => void;
  setViewMode: (mode: ViewMode) => void;
  setGridSize: (size: GridSize) => void;
  openModal: (modal: ModalState) => void;
  closeModal: () => void;
  toggleSidebar: () => void;
  resetUI: () => void;
}
```

### 實作

```typescript
const DEFAULT_UI = {
  activePanel: 'main',
  searchQuery: '',
  sortOrder: 'date' as const,
  sortDirection: 'desc' as const,
  viewMode: 'grid' as const,
  gridSize: 'medium' as const,
  modalState: null,
  sidebarCollapsed: false,
};

export const createUISlice: StateCreator<
  PluginStore,
  [],
  [],
  UISlice
> = (set) => ({
  ...DEFAULT_UI,
  
  setActivePanel: (activePanel) => set(
    (state) => ({ ui: { ...state.ui, activePanel }}),
    false,
    'ui/setPanel'
  ),
  
  setSearchQuery: (searchQuery) => set(
    (state) => ({ ui: { ...state.ui, searchQuery }}),
    false,
    'ui/setSearch'
  ),
  
  setSortOrder: (sortOrder) => set(
    (state) => ({ ui: { ...state.ui, sortOrder }}),
    false,
    'ui/setSortOrder'
  ),
  
  setSortDirection: (sortDirection) => set(
    (state) => ({ ui: { ...state.ui, sortDirection }}),
    false,
    'ui/setSortDirection'
  ),
  
  setViewMode: (viewMode) => set(
    (state) => ({ ui: { ...state.ui, viewMode }}),
    false,
    'ui/setViewMode'
  ),
  
  setGridSize: (gridSize) => set(
    (state) => ({ ui: { ...state.ui, gridSize }}),
    false,
    'ui/setGridSize'
  ),
  
  openModal: (modalState) => set(
    (state) => ({ ui: { ...state.ui, modalState }}),
    false,
    'ui/openModal'
  ),
  
  closeModal: () => set(
    (state) => ({ ui: { ...state.ui, modalState: null }}),
    false,
    'ui/closeModal'
  ),
  
  toggleSidebar: () => set(
    (state) => ({ 
      ui: { ...state.ui, sidebarCollapsed: !state.ui.sidebarCollapsed }
    }),
    false,
    'ui/toggleSidebar'
  ),
  
  resetUI: () => set(
    () => ({ ui: DEFAULT_UI }),
    false,
    'ui/reset'
  ),
});
```

### 使用方式

```typescript
import { useUI } from '@/stores';

function Toolbar() {
  const { 
    viewMode, 
    sortOrder,
    sortDirection,
    gridSize,
    searchQuery,
    setViewMode,
    setSortOrder,
    setSortDirection,
    setGridSize,
    setSearchQuery
  } = useUI();
  
  return (
    <div className="flex items-center gap-4">
      <input 
        type="search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="搜尋..."
      />
      
      <select 
        value={viewMode} 
        onChange={(e) => setViewMode(e.target.value as ViewMode)}
      >
        <option value="grid">網格</option>
        <option value="list">列表</option>
      </select>
      
      <select 
        value={sortOrder}
        onChange={(e) => setSortOrder(e.target.value as SortOrder)}
      >
        <option value="name">名稱</option>
        <option value="date">日期</option>
        <option value="size">大小</option>
        <option value="type">類型</option>
      </select>
      
      <button 
        onClick={() => setSortDirection(
          sortDirection === 'asc' ? 'desc' : 'asc'
        )}
      >
        {sortDirection === 'asc' ? '↑' : '↓'}
      </button>
      
      {viewMode === 'grid' && (
        <select 
          value={gridSize}
          onChange={(e) => setGridSize(e.target.value as GridSize)}
        >
          <option value="small">小</option>
          <option value="medium">中</option>
          <option value="large">大</option>
        </select>
      )}
    </div>
  );
}
```

---

## 組合切片

所有切片在主要儲存庫中組合：

```typescript
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { createSelectionSlice } from './slices/selection';
import { createSettingsSlice } from './slices/settings';
import { createProcessingSlice } from './slices/processing';
import { createUISlice } from './slices/ui';

export const usePluginStore = create<PluginStore>()(
  devtools(
    persist(
      (...args) => ({
        selection: createSelectionSlice(...args),
        settings: createSettingsSlice(...args),
        processing: createProcessingSlice(...args),
        ui: createUISlice(...args),
      }),
      {
        name: 'eagle-plugin-store',
        partialize: (state) => ({
          // 僅持久化設定
          settings: state.settings,
        }),
      }
    ),
    { name: 'Eagle Plugin Store' }
  )
);
```

## 下一步

- [選擇器](./selectors.md) - 建立高效的選擇器
- [持久化](./persistence.md) - 配置狀態持久化
