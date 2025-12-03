/**
 * Store Types
 *
 * TypeScript interfaces for the Zustand-based plugin state management.
 * All state is organized into focused slices for maintainability.
 */

import type { Item } from '@/types/eagle';

// ============================================================================
// Selection Slice Types
// ============================================================================

export interface SelectionState {
  /** Currently selected items from Eagle */
  items: Item[];
  /** Loading state for selection fetch */
  isLoading: boolean;
  /** Error from last selection fetch */
  error: Error | null;
  /** Timestamp of last successful update */
  lastUpdated: number;
  /** Whether polling is currently active */
  isPolling: boolean;
  /** Whether polling is paused due to visibility */
  isPaused: boolean;
}

export interface SelectionActions {
  /** Set selected items */
  setItems: (items: Item[]) => void;
  /** Set loading state */
  setLoading: (loading: boolean) => void;
  /** Set error state */
  setError: (error: Error | null) => void;
  /** Update selection from Eagle API */
  refreshSelection: () => Promise<void>;
  /** Start polling for selection changes */
  startPolling: () => void;
  /** Stop polling for selection changes */
  stopPolling: () => void;
  /** Set paused state */
  setPaused: (paused: boolean) => void;
}

export type SelectionSlice = SelectionState & SelectionActions;

// ============================================================================
// Settings Slice Types
// ============================================================================

export type Theme = 'light' | 'dark' | 'auto';
export type OutputFormat = 'png' | 'jpg' | 'webp' | 'original';

export interface SettingsState {
  /** Current theme preference */
  theme: Theme;
  /** Computed dark mode state */
  isDarkMode: boolean;
  /** Enable auto-preview on selection change */
  autoPreview: boolean;
  /** Default output format for processing */
  outputFormat: OutputFormat;
  /** Output quality (0-100) */
  quality: number;
  /** Preserve metadata in output */
  preserveMetadata: boolean;
  /** Custom settings (extensible by plugins) */
  custom: Record<string, unknown>;
}

export interface SettingsActions {
  /** Set theme preference */
  setTheme: (theme: Theme) => void;
  /** Toggle between light and dark theme */
  toggleTheme: () => void;
  /** Set auto-preview preference */
  setAutoPreview: (enabled: boolean) => void;
  /** Set output format */
  setOutputFormat: (format: OutputFormat) => void;
  /** Set output quality */
  setQuality: (quality: number) => void;
  /** Set preserve metadata preference */
  setPreserveMetadata: (preserve: boolean) => void;
  /** Set a custom setting value */
  setCustom: <T>(key: string, value: T) => void;
  /** Get a custom setting value with default */
  getCustom: <T>(key: string, defaultValue: T) => T;
  /** Reset all settings to defaults */
  resetSettings: () => void;
}

export type SettingsSlice = SettingsState & SettingsActions;

// ============================================================================
// Processing Slice Types
// ============================================================================

export type ProcessingStatus =
  | 'idle'
  | 'preparing'
  | 'processing'
  | 'complete'
  | 'error'
  | 'cancelled';

export interface ProcessResult {
  /** Source item ID */
  itemId: string;
  /** Source item name */
  itemName: string;
  /** Whether processing succeeded */
  success: boolean;
  /** Output file path (if successful) */
  outputPath?: string;
  /** New Eagle item ID (if added to library) */
  newItemId?: string;
  /** Error message (if failed) */
  error?: string;
  /** Processing duration in ms */
  duration: number;
}

export interface ProcessingState {
  /** Current processing status */
  status: ProcessingStatus;
  /** Progress percentage (0-100) */
  progress: number;
  /** Currently processing item ID */
  currentItemId: string | null;
  /** Currently processing item name */
  currentItemName: string | null;
  /** Total items to process */
  totalItems: number;
  /** Completed items count */
  completedItems: number;
  /** Results of completed items */
  results: ProcessResult[];
  /** Start timestamp */
  startedAt: number | null;
  /** Cancellation requested flag */
  cancelRequested: boolean;
}

export interface ProcessingActions {
  /** Start processing with items */
  startProcessing: (itemIds: string[]) => void;
  /** Update progress */
  updateProgress: (
    current: number,
    total: number,
    currentItem?: { id: string; name: string }
  ) => void;
  /** Add a result */
  addResult: (result: ProcessResult) => void;
  /** Mark processing complete */
  completeProcessing: () => void;
  /** Set error state */
  setProcessingError: (error: string) => void;
  /** Request cancellation */
  requestCancel: () => void;
  /** Reset processing state */
  resetProcessing: () => void;
}

export type ProcessingSlice = ProcessingState & ProcessingActions;

// ============================================================================
// UI Slice Types
// ============================================================================

export type PanelId = 'main' | 'settings' | 'history' | 'help';

export interface UIState {
  /** Currently active panel */
  activePanel: PanelId;
  /** Manually selected item IDs (for multi-select in UI) */
  selectedItemIds: Set<string>;
  /** Expanded folder IDs in tree view */
  expandedFolders: Set<string>;
  /** Whether sidebar is collapsed */
  sidebarCollapsed: boolean;
  /** Search query */
  searchQuery: string;
  /** Whether any modal is open */
  modalOpen: boolean;
  /** Current modal ID */
  currentModal: string | null;
}

export interface UIActions {
  /** Set active panel */
  setActivePanel: (panel: PanelId) => void;
  /** Toggle item selection */
  toggleItemSelection: (itemId: string) => void;
  /** Select multiple items */
  selectItems: (itemIds: string[]) => void;
  /** Clear item selection */
  clearItemSelection: () => void;
  /** Toggle folder expansion */
  toggleFolderExpansion: (folderId: string) => void;
  /** Set sidebar collapsed state */
  setSidebarCollapsed: (collapsed: boolean) => void;
  /** Set search query */
  setSearchQuery: (query: string) => void;
  /** Open a modal */
  openModal: (modalId: string) => void;
  /** Close modal */
  closeModal: () => void;
}

export type UISlice = UIState & UIActions;

// ============================================================================
// Combined Store Type
// ============================================================================

export interface PluginStore {
  // Slices
  selection: SelectionSlice;
  settings: SettingsSlice;
  processing: ProcessingSlice;
  ui: UISlice;

  // Hydration
  _hasHydrated: boolean;
  setHasHydrated: (hydrated: boolean) => void;
}

// ============================================================================
// Persistence Types
// ============================================================================

export interface PersistedState {
  settings: Pick<
    SettingsState,
    'theme' | 'autoPreview' | 'outputFormat' | 'quality' | 'preserveMetadata' | 'custom'
  >;
  ui: Pick<UIState, 'sidebarCollapsed'>;
}

// ============================================================================
// Store Options Types
// ============================================================================

export interface PluginStoreOptions {
  /** localStorage key for persistence (default: 'eagle-react-template:store') */
  persistKey?: string;
  /** Polling interval for selection updates in ms (default: 500) */
  pollingInterval?: number;
  /** Whether to enable Redux DevTools integration (default: true in dev) */
  devtools?: boolean;
}
