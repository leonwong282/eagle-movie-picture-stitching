# 狀態管理概覽

Eagle React Template 使用 **Zustand** 進行狀態管理——一個小型、快速且可擴展的狀態管理解決方案。

## 為什麼選擇 Zustand？

### 與 Redux 比較
- **更少的樣板程式碼**：不需要 action creators、reducers 或 switch 語句
- **更小的套件體積**：約 1KB 對比 Redux 的約 7KB
- **內建持久化**：中介軟體讓狀態持久化變得簡單
- **對 TypeScript 更友好**：自動型別推斷

### 與 Context 比較
- **不會重新渲染**：只有使用狀態的元件才會重新渲染
- **不需要 Provider**：無需在元件樹中包裝 Provider
- **非同步 actions**：內建對非同步操作的支援
- **DevTools 整合**：連接 Redux DevTools 進行除錯

## 儲存庫架構

```
src/stores/
├── index.ts           # 主要儲存庫定義
├── selectors.ts       # 記憶化選擇器
└── slices/
    ├── selection.ts   # 選取狀態
    ├── settings.ts    # 使用者偏好設定
    ├── processing.ts  # 批次操作
    └── ui.ts          # UI 狀態
```

## 快速開始

### 基本使用

```typescript
import { usePluginStore } from '@/stores';

function MyComponent() {
  // 選取特定的狀態片段
  const items = usePluginStore(state => state.selection.items);
  const isLoading = usePluginStore(state => state.selection.isLoading);
  
  // 取得 actions
  const setItems = usePluginStore(state => state.setSelectedItems);
  
  return (
    <div>
      {isLoading ? (
        <p>載入中...</p>
      ) : (
        <p>已選取 {items.length} 個項目</p>
      )}
    </div>
  );
}
```

### 使用便利 Hooks

```typescript
import { useSelection, useSettings, useProcessing, useUI } from '@/stores';

function MyComponent() {
  // 便利 hooks 提供分組的狀態和 actions
  const { items, isLoading, startPolling, stopPolling } = useSelection();
  const { theme, language, outputFormat, toggleTheme } = useSettings();
  const { status, progress, startProcessing, completeProcessing } = useProcessing();
  const { activePanel, setActivePanel, searchQuery, setSearchQuery } = useUI();
  
  return (
    // 您的 JSX
  );
}
```

## Store 切片

儲存庫被組織成邏輯切片：

### Selection 切片
管理 Eagle 項目選取狀態和輪詢。

```typescript
interface SelectionSlice {
  items: Item[];
  isLoading: boolean;
  error: string | null;
  isPolling: boolean;
  isPaused: boolean;
  lastHash: string;
  
  setSelectedItems: (items: Item[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  startPolling: () => void;
  stopPolling: () => void;
  pausePolling: () => void;
  resumePolling: () => void;
}
```

### Settings 切片
管理持久化的使用者偏好設定。

```typescript
interface SettingsSlice {
  theme: Theme;
  language: string;
  outputFormat: OutputFormat;
  quality: number;
  autoPreview: boolean;
  
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setLanguage: (lang: string) => void;
  setOutputFormat: (format: OutputFormat) => void;
  setQuality: (quality: number) => void;
  toggleAutoPreview: () => void;
}
```

### Processing 切片
管理批次處理狀態。

```typescript
interface ProcessingSlice {
  status: 'idle' | 'processing' | 'completed' | 'error';
  progress: number;
  currentStep: string;
  results: ProcessingResult[];
  
  startProcessing: (totalItems: number) => void;
  updateProgress: (current: number, step?: string) => void;
  completeProcessing: (results: ProcessingResult[]) => void;
  setError: (error: string) => void;
  resetProcessing: () => void;
}
```

### UI 切片
管理臨時性 UI 狀態。

```typescript
interface UISlice {
  activePanel: string;
  searchQuery: string;
  sortOrder: SortOrder;
  viewMode: ViewMode;
  modalState: ModalState | null;
  
  setActivePanel: (panel: string) => void;
  setSearchQuery: (query: string) => void;
  setSortOrder: (order: SortOrder) => void;
  setViewMode: (mode: ViewMode) => void;
  openModal: (modal: ModalState) => void;
  closeModal: () => void;
}
```

## 常見模式

### 選取多個狀態值

```typescript
// ❌ 低效 - 每次狀態變更都會重新渲染
const { items, isLoading, error } = usePluginStore(state => ({
  items: state.selection.items,
  isLoading: state.selection.isLoading,
  error: state.selection.error
}));

// ✅ 高效 - 使用 shallow 比較
import { shallow } from 'zustand/shallow';

const { items, isLoading, error } = usePluginStore(
  state => ({
    items: state.selection.items,
    isLoading: state.selection.isLoading,
    error: state.selection.error
  }),
  shallow
);
```

### 使用選擇器

```typescript
import { selectImageItems, selectSelectionStats } from '@/stores/selectors';

function ImageGallery() {
  const images = usePluginStore(selectImageItems);
  const stats = usePluginStore(selectSelectionStats);
  
  return (
    <div>
      <p>總項目：{stats.total}，圖片：{stats.images}</p>
      <ImageGrid items={images} />
    </div>
  );
}
```

### 元件外的狀態存取

```typescript
// 直接存取儲存庫（適用於工具函式）
import { usePluginStore } from '@/stores';

function someUtilityFunction() {
  const state = usePluginStore.getState();
  const items = state.selection.items;
  
  // 直接呼叫 actions
  usePluginStore.getState().setSelectedItems(newItems);
}
```

## DevTools 整合

儲存庫已配置 Redux DevTools 整合：

```typescript
// 已在儲存庫中配置
import { devtools } from 'zustand/middleware';

const usePluginStore = create<PluginStore>()(
  devtools(
    persist(
      (set, get) => ({
        // 儲存庫定義
      }),
      { name: 'plugin-store' }
    ),
    { name: 'Eagle Plugin Store' }
  )
);
```

在瀏覽器中開啟 Redux DevTools 以：
- 檢視狀態變更
- 時間旅行除錯
- 匯出/匯入狀態

## 下一步

- [Store 切片](./slices.md) - 詳細的切片文件
- [選擇器](./selectors.md) - 建立高效的選擇器
- [持久化](./persistence.md) - 儲存庫持久化配置
