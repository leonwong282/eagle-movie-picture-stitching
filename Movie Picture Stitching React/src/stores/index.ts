/**
 * Plugin Store
 *
 * Main Zustand store combining all slices with persistence middleware.
 * Provides a unified state management solution for Eagle plugins.
 *
 * @example
 * ```tsx
 * // Access state
 * const items = usePluginStore(state => state.selection.items);
 *
 * // Access actions
 * const { setTheme } = usePluginStore(state => state.settings);
 *
 * // Multiple values (use useShallow for object stability)
 * const { items, isLoading } = usePluginStore(
 *   useShallow(state => ({
 *     items: state.selection.items,
 *     isLoading: state.selection.isLoading,
 *   }))
 * );
 * ```
 */

import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';
import type { Item } from '@/types/eagle';
import type { EagleTheme } from '@/types/eagle';
import { eagleApi } from '@/lib/eagle-api';

// ============================================================================
// Types
// ============================================================================

export type Theme = 'light' | 'dark' | 'auto';
export type OutputFormat = 'png' | 'jpg' | 'webp' | 'original';
export type ProcessingStatus =
  | 'idle'
  | 'preparing'
  | 'processing'
  | 'complete'
  | 'error'
  | 'cancelled';
export type PanelId = 'main' | 'settings' | 'history' | 'help';
export type ExportFormat = 'jpg' | 'png' | 'webp';

export interface ProcessResult {
  itemId: string;
  itemName: string;
  success: boolean;
  outputPath?: string;
  newItemId?: string;
  error?: string;
  duration: number;
}

export interface PluginState {
  // Selection
  selection: {
    items: Item[];
    isLoading: boolean;
    error: Error | null;
    lastUpdated: number;
    isPolling: boolean;
    isPaused: boolean;
  };

  // Settings
  settings: {
    theme: Theme;
    isDarkMode: boolean;
    autoPreview: boolean;
    outputFormat: OutputFormat;
    quality: number;
    preserveMetadata: boolean;
    custom: Record<string, unknown>;
  };

  // Processing
  processing: {
    status: ProcessingStatus;
    progress: number;
    currentItemId: string | null;
    currentItemName: string | null;
    totalItems: number;
    completedItems: number;
    results: ProcessResult[];
    startedAt: number | null;
    cancelRequested: boolean;
  };

  // UI
  ui: {
    activePanel: PanelId;
    selectedItemIds: string[];
    expandedFolders: string[];
    sidebarCollapsed: boolean;
    searchQuery: string;
    modalOpen: boolean;
    currentModal: string | null;
  };

  // Stitching (Movie Picture Stitching specific)
  stitching: {
    reorderedImages: Item[] | null;
    cropTopPercent: number;
    cropBottomPercent: number;
    exportFormat: ExportFormat;
    exportQuality: number;
    hasPreviewGenerated: boolean;
    previewCanvas: HTMLCanvasElement | null;
    isAlwaysOnTop: boolean;
    isLightboxOpen: boolean;
    lightboxZoom: number;
    lightboxOffset: { x: number; y: number };
  };

  // Hydration
  _hasHydrated: boolean;
}

export interface PluginActions {
  // Selection actions
  setItems: (items: Item[]) => void;
  setSelectionLoading: (loading: boolean) => void;
  setSelectionError: (error: Error | null) => void;
  refreshSelection: () => Promise<void>;
  startPolling: () => void;
  stopPolling: () => void;
  setSelectionPaused: (paused: boolean) => void;

  // Settings actions
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setAutoPreview: (enabled: boolean) => void;
  setOutputFormat: (format: OutputFormat) => void;
  setQuality: (quality: number) => void;
  setPreserveMetadata: (preserve: boolean) => void;
  setCustomSetting: <T>(key: string, value: T) => void;
  resetSettings: () => void;

  // Processing actions
  startProcessing: (itemIds: string[]) => void;
  updateProgress: (
    current: number,
    total: number,
    currentItem?: { id: string; name: string }
  ) => void;
  addResult: (result: ProcessResult) => void;
  completeProcessing: () => void;
  setProcessingError: (error: string) => void;
  requestCancel: () => void;
  resetProcessing: () => void;

  // UI actions
  setActivePanel: (panel: PanelId) => void;
  toggleItemSelection: (itemId: string) => void;
  selectItems: (itemIds: string[]) => void;
  clearItemSelection: () => void;
  toggleFolderExpansion: (folderId: string) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setSearchQuery: (query: string) => void;
  openModal: (modalId: string) => void;
  closeModal: () => void;

  // Stitching actions
  setReorderedImages: (images: Item[] | null) => void;
  reorderImages: (fromIndex: number, toIndex: number) => void;
  resetImageOrder: () => void;
  setCropTopPercent: (percent: number) => void;
  setCropBottomPercent: (percent: number) => void;
  setCropValues: (top: number, bottom: number) => void;
  setStitchingExportFormat: (format: ExportFormat) => void;
  setExportQuality: (quality: number) => void;
  setHasPreviewGenerated: (generated: boolean) => void;
  setPreviewCanvas: (canvas: HTMLCanvasElement | null) => void;
  setIsAlwaysOnTop: (alwaysOnTop: boolean) => void;
  toggleAlwaysOnTop: () => void;
  openLightbox: () => void;
  closeLightbox: () => void;
  setLightboxZoom: (zoom: number) => void;
  setLightboxOffset: (offset: { x: number; y: number }) => void;
  resetLightboxView: () => void;
  clearStitchingCaches: () => void;
  resetStitchingState: () => void;

  // Hydration
  setHasHydrated: (hydrated: boolean) => void;
}

export type PluginStore = PluginState & PluginActions;

// ============================================================================
// Initial State
// ============================================================================

const initialState: PluginState = {
  selection: {
    items: [],
    isLoading: true,
    error: null,
    lastUpdated: 0,
    isPolling: false,
    isPaused: false,
  },
  settings: {
    theme: 'auto',
    isDarkMode: false,
    autoPreview: true,
    outputFormat: 'original',
    quality: 90,
    preserveMetadata: true,
    custom: {},
  },
  processing: {
    status: 'idle',
    progress: 0,
    currentItemId: null,
    currentItemName: null,
    totalItems: 0,
    completedItems: 0,
    results: [],
    startedAt: null,
    cancelRequested: false,
  },
  ui: {
    activePanel: 'main',
    selectedItemIds: [],
    expandedFolders: [],
    sidebarCollapsed: false,
    searchQuery: '',
    modalOpen: false,
    currentModal: null,
  },
  stitching: {
    reorderedImages: null,
    cropTopPercent: 0,
    cropBottomPercent: 15,
    exportFormat: 'jpg',
    exportQuality: 0.92,
    hasPreviewGenerated: false,
    previewCanvas: null,
    isAlwaysOnTop: false,
    isLightboxOpen: false,
    lightboxZoom: 1.0,
    lightboxOffset: { x: 0, y: 0 },
  },
  _hasHydrated: false,
};

// ============================================================================
// Theme Helpers
// ============================================================================

const DARK_THEMES: EagleTheme[] = ['DARK', 'GRAY', 'BLUE', 'PURPLE'];

function computeIsDark(theme: Theme): boolean {
  if (theme === 'auto') {
    const eagleTheme = eagleApi.theme;
    if (eagleTheme === 'Auto') {
      return eagleApi.isDarkMode;
    }
    return DARK_THEMES.includes(eagleTheme);
  }
  return theme === 'dark';
}

function applyDarkMode(isDark: boolean): void {
  if (typeof document !== 'undefined') {
    const html = document.documentElement;
    if (isDark) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }
}

// ============================================================================
// Polling State (module level)
// ============================================================================

let pollingInterval: ReturnType<typeof setInterval> | null = null;
let lastSelectionHash = '';
let pollingIntervalMs = 500;

function computeSelectionHash(items: Item[]): string {
  if (items.length === 0) return '';
  return items.map((item) => item.id).join(',');
}

export function setPollingInterval(ms: number): void {
  pollingIntervalMs = ms;
}

// ============================================================================
// Store Creation
// ============================================================================

const storeCreator = (
  set: (partial: Partial<PluginStore> | ((state: PluginStore) => Partial<PluginStore>)) => void,
  get: () => PluginStore
): PluginStore => ({
  ...initialState,

  // Selection actions
  setItems: (items) => {
    set((state) => ({
      selection: { ...state.selection, items, lastUpdated: Date.now() },
    }));
  },

  setSelectionLoading: (loading) => {
    set((state) => ({
      selection: { ...state.selection, isLoading: loading },
    }));
  },

  setSelectionError: (error) => {
    set((state) => ({
      selection: { ...state.selection, error, isLoading: false },
    }));
  },

  refreshSelection: async () => {
    try {
      const items = await eagleApi.getSelectedItems();
      const newHash = computeSelectionHash(items);

      if (newHash !== lastSelectionHash) {
        lastSelectionHash = newHash;
        set((state) => ({
          selection: {
            ...state.selection,
            items,
            isLoading: false,
            error: null,
            lastUpdated: Date.now(),
          },
        }));
      } else {
        set((state) => ({
          selection: { ...state.selection, isLoading: false },
        }));
      }
    } catch (err) {
      set((state) => ({
        selection: {
          ...state.selection,
          error: err instanceof Error ? err : new Error('Failed to get selected items'),
          isLoading: false,
        },
      }));
    }
  },

  startPolling: () => {
    const state = get();
    if (state.selection.isPolling) return;

    // Initial fetch
    state.refreshSelection();

    // Start interval
    pollingInterval = setInterval(() => {
      const currentState = get();
      if (!currentState.selection.isPaused) {
        currentState.refreshSelection();
      }
    }, pollingIntervalMs);

    set((s) => ({
      selection: { ...s.selection, isPolling: true },
    }));

    // Set up visibility handler
    if (typeof document !== 'undefined') {
      const handleVisibilityChange = () => {
        const s = get();
        if (document.hidden) {
          s.setSelectionPaused(true);
        } else {
          s.setSelectionPaused(false);
          s.refreshSelection();
        }
      };
      document.addEventListener('visibilitychange', handleVisibilityChange);
    }
  },

  stopPolling: () => {
    if (pollingInterval) {
      clearInterval(pollingInterval);
      pollingInterval = null;
    }
    set((state) => ({
      selection: { ...state.selection, isPolling: false, isPaused: false },
    }));
  },

  setSelectionPaused: (paused) => {
    set((state) => ({
      selection: { ...state.selection, isPaused: paused },
    }));
  },

  // Settings actions
  setTheme: (theme) => {
    const isDarkMode = computeIsDark(theme);
    applyDarkMode(isDarkMode);
    set((state) => ({
      settings: { ...state.settings, theme, isDarkMode },
    }));
  },

  toggleTheme: () => {
    const state = get();
    const newTheme: Theme = state.settings.isDarkMode ? 'light' : 'dark';
    state.setTheme(newTheme);
  },

  setAutoPreview: (enabled) => {
    set((state) => ({
      settings: { ...state.settings, autoPreview: enabled },
    }));
  },

  setOutputFormat: (format) => {
    set((state) => ({
      settings: { ...state.settings, outputFormat: format },
    }));
  },

  setQuality: (quality) => {
    const clamped = Math.max(0, Math.min(100, quality));
    set((state) => ({
      settings: { ...state.settings, quality: clamped },
    }));
  },

  setPreserveMetadata: (preserve) => {
    set((state) => ({
      settings: { ...state.settings, preserveMetadata: preserve },
    }));
  },

  setCustomSetting: <T>(key: string, value: T) => {
    set((state) => ({
      settings: {
        ...state.settings,
        custom: { ...state.settings.custom, [key]: value },
      },
    }));
  },

  resetSettings: () => {
    const isDarkMode = computeIsDark(initialState.settings.theme);
    applyDarkMode(isDarkMode);
    set({ settings: { ...initialState.settings, isDarkMode } });
  },

  // Processing actions
  startProcessing: (itemIds) => {
    set({
      processing: {
        ...initialState.processing,
        status: 'preparing',
        totalItems: itemIds.length,
        startedAt: Date.now(),
      },
    });

    setTimeout(() => {
      const state = get();
      if (state.processing.status === 'preparing' && !state.processing.cancelRequested) {
        set((s) => ({
          processing: { ...s.processing, status: 'processing' },
        }));
      }
    }, 0);
  },

  updateProgress: (current, total, currentItem) => {
    const progress = total > 0 ? Math.round((current / total) * 100) : 0;
    set((state) => ({
      processing: {
        ...state.processing,
        progress,
        completedItems: current,
        totalItems: total,
        ...(currentItem && {
          currentItemId: currentItem.id,
          currentItemName: currentItem.name,
        }),
      },
    }));
  },

  addResult: (result) => {
    set((state) => ({
      processing: {
        ...state.processing,
        results: [...state.processing.results, result],
        completedItems: state.processing.completedItems + 1,
        progress:
          state.processing.totalItems > 0
            ? Math.round(
                ((state.processing.completedItems + 1) / state.processing.totalItems) * 100
              )
            : 0,
      },
    }));
  },

  completeProcessing: () => {
    set((state) => ({
      processing: {
        ...state.processing,
        status: 'complete',
        progress: 100,
        currentItemId: null,
        currentItemName: null,
      },
    }));
  },

  setProcessingError: (error) => {
    set((state) => ({
      processing: {
        ...state.processing,
        status: 'error',
        results: [
          ...state.processing.results,
          {
            itemId: state.processing.currentItemId ?? 'unknown',
            itemName: state.processing.currentItemName ?? 'Unknown',
            success: false,
            error,
            duration: state.processing.startedAt ? Date.now() - state.processing.startedAt : 0,
          },
        ],
      },
    }));
  },

  requestCancel: () => {
    set((state) => ({
      processing: {
        ...state.processing,
        cancelRequested: true,
        status: state.processing.status === 'processing' ? 'cancelled' : state.processing.status,
      },
    }));
  },

  resetProcessing: () => {
    set({ processing: initialState.processing });
  },

  // UI actions
  setActivePanel: (panel) => {
    set((state) => ({
      ui: { ...state.ui, activePanel: panel },
    }));
  },

  toggleItemSelection: (itemId) => {
    set((state) => {
      const ids = state.ui.selectedItemIds;
      const newIds = ids.includes(itemId) ? ids.filter((id) => id !== itemId) : [...ids, itemId];
      return { ui: { ...state.ui, selectedItemIds: newIds } };
    });
  },

  selectItems: (itemIds) => {
    set((state) => ({
      ui: { ...state.ui, selectedItemIds: itemIds },
    }));
  },

  clearItemSelection: () => {
    set((state) => ({
      ui: { ...state.ui, selectedItemIds: [] },
    }));
  },

  toggleFolderExpansion: (folderId) => {
    set((state) => {
      const folders = state.ui.expandedFolders;
      const newFolders = folders.includes(folderId)
        ? folders.filter((id) => id !== folderId)
        : [...folders, folderId];
      return { ui: { ...state.ui, expandedFolders: newFolders } };
    });
  },

  setSidebarCollapsed: (collapsed) => {
    set((state) => ({
      ui: { ...state.ui, sidebarCollapsed: collapsed },
    }));
  },

  setSearchQuery: (query) => {
    set((state) => ({
      ui: { ...state.ui, searchQuery: query },
    }));
  },

  openModal: (modalId) => {
    set((state) => ({
      ui: { ...state.ui, modalOpen: true, currentModal: modalId },
    }));
  },

  closeModal: () => {
    set((state) => ({
      ui: { ...state.ui, modalOpen: false, currentModal: null },
    }));
  },

  // Stitching actions
  setReorderedImages: (images) => {
    set((state) => ({
      stitching: { ...state.stitching, reorderedImages: images },
    }));
  },

  reorderImages: (fromIndex, toIndex) => {
    const state = get();
    const currentImages = state.stitching.reorderedImages;
    if (!currentImages) return;

    const newImages = [...currentImages];
    const [movedItem] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedItem);

    set((s) => ({
      stitching: { ...s.stitching, reorderedImages: newImages },
    }));
  },

  resetImageOrder: () => {
    set((state) => ({
      stitching: {
        ...state.stitching,
        reorderedImages: null,
        hasPreviewGenerated: false,
        previewCanvas: null,
      },
    }));
  },

  setCropTopPercent: (percent) => {
    const state = get();
    const clamped = Math.max(0, Math.min(99, Math.round(percent)));
    const maxAllowed = 99 - state.stitching.cropBottomPercent;
    const finalValue = Math.min(clamped, maxAllowed);

    set((s) => ({
      stitching: { ...s.stitching, cropTopPercent: finalValue },
    }));
  },

  setCropBottomPercent: (percent) => {
    const state = get();
    const clamped = Math.max(0, Math.min(99, Math.round(percent)));
    const maxAllowed = 99 - state.stitching.cropTopPercent;
    const finalValue = Math.min(clamped, maxAllowed);

    set((s) => ({
      stitching: { ...s.stitching, cropBottomPercent: finalValue },
    }));
  },

  setCropValues: (top, bottom) => {
    let topValue = Math.max(0, Math.min(99, Math.round(top)));
    let bottomValue = Math.max(0, Math.min(99, Math.round(bottom)));

    if (topValue + bottomValue > 99) {
      const ratio = 99 / (topValue + bottomValue);
      topValue = Math.floor(topValue * ratio);
      bottomValue = Math.floor(bottomValue * ratio);
    }

    set((state) => ({
      stitching: {
        ...state.stitching,
        cropTopPercent: topValue,
        cropBottomPercent: bottomValue,
      },
    }));
  },

  setStitchingExportFormat: (format) => {
    set((state) => ({
      stitching: { ...state.stitching, exportFormat: format },
    }));
  },

  setExportQuality: (quality) => {
    const clamped = Math.max(0.1, Math.min(1.0, quality));
    set((state) => ({
      stitching: {
        ...state.stitching,
        exportQuality: Math.round(clamped * 100) / 100,
      },
    }));
  },

  setHasPreviewGenerated: (generated) => {
    set((state) => ({
      stitching: { ...state.stitching, hasPreviewGenerated: generated },
    }));
  },

  setPreviewCanvas: (canvas) => {
    set((state) => ({
      stitching: {
        ...state.stitching,
        previewCanvas: canvas,
        hasPreviewGenerated: canvas !== null,
      },
    }));
  },

  setIsAlwaysOnTop: (alwaysOnTop) => {
    set((state) => ({
      stitching: { ...state.stitching, isAlwaysOnTop: alwaysOnTop },
    }));
  },

  toggleAlwaysOnTop: () => {
    const state = get();
    set((s) => ({
      stitching: { ...s.stitching, isAlwaysOnTop: !state.stitching.isAlwaysOnTop },
    }));
  },

  openLightbox: () => {
    set((state) => ({
      stitching: { ...state.stitching, isLightboxOpen: true },
    }));
  },

  closeLightbox: () => {
    set((state) => ({
      stitching: {
        ...state.stitching,
        isLightboxOpen: false,
        lightboxZoom: 1.0,
        lightboxOffset: { x: 0, y: 0 },
      },
    }));
  },

  setLightboxZoom: (zoom) => {
    const clamped = Math.max(0.1, Math.min(5.0, zoom));
    set((state) => ({
      stitching: { ...state.stitching, lightboxZoom: clamped },
    }));
  },

  setLightboxOffset: (offset) => {
    set((state) => ({
      stitching: { ...state.stitching, lightboxOffset: offset },
    }));
  },

  resetLightboxView: () => {
    set((state) => ({
      stitching: {
        ...state.stitching,
        lightboxZoom: 1.0,
        lightboxOffset: { x: 0, y: 0 },
      },
    }));
  },

  clearStitchingCaches: () => {
    set((state) => ({
      stitching: {
        ...state.stitching,
        reorderedImages: null,
        hasPreviewGenerated: false,
        previewCanvas: null,
      },
    }));
  },

  resetStitchingState: () => {
    set({ stitching: initialState.stitching });
  },

  // Hydration
  setHasHydrated: (hydrated) => {
    set({ _hasHydrated: hydrated });
  },
});

// ============================================================================
// Persisted State Type
// ============================================================================

interface PersistedState {
  settings: Pick<
    PluginState['settings'],
    'theme' | 'autoPreview' | 'outputFormat' | 'quality' | 'preserveMetadata' | 'custom'
  >;
  ui: Pick<PluginState['ui'], 'sidebarCollapsed'>;
  stitching: Pick<
    PluginState['stitching'],
    'cropTopPercent' | 'cropBottomPercent' | 'exportFormat' | 'exportQuality'
  >;
}

// ============================================================================
// Store Instance
// ============================================================================

/**
 * The main plugin store instance
 */
export const usePluginStore = create<PluginStore>()(
  devtools(
    persist(storeCreator, {
      name: 'eagle-react-template:store',
      partialize: (state): PersistedState => ({
        settings: {
          theme: state.settings.theme,
          autoPreview: state.settings.autoPreview,
          outputFormat: state.settings.outputFormat,
          quality: state.settings.quality,
          preserveMetadata: state.settings.preserveMetadata,
          custom: state.settings.custom,
        },
        ui: {
          sidebarCollapsed: state.ui.sidebarCollapsed,
        },
        stitching: {
          cropTopPercent: state.stitching.cropTopPercent,
          cropBottomPercent: state.stitching.cropBottomPercent,
          exportFormat: state.stitching.exportFormat,
          exportQuality: state.stitching.exportQuality,
        },
      }),
      merge: (persistedState, currentState) => {
        const persisted = persistedState as PersistedState | undefined;
        return {
          ...currentState,
          settings: {
            ...currentState.settings,
            ...(persisted?.settings ?? {}),
          },
          ui: {
            ...currentState.ui,
            ...(persisted?.ui ?? {}),
          },
          stitching: {
            ...currentState.stitching,
            ...(persisted?.stitching ?? {}),
          },
        };
      },
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
        // Apply theme after hydration
        if (state) {
          const isDark = computeIsDark(state.settings.theme);
          applyDarkMode(isDark);
        }
      },
    }),
    { name: 'EaglePluginStore', enabled: process.env.NODE_ENV === 'development' }
  )
);

// ============================================================================
// Convenience Hooks
// ============================================================================

/**
 * Hook to access selection state with shallow comparison
 */
export function useSelection() {
  return usePluginStore(
    useShallow((state) => ({
      items: state.selection.items,
      isLoading: state.selection.isLoading,
      error: state.selection.error,
      isPolling: state.selection.isPolling,
      isPaused: state.selection.isPaused,
      refresh: state.refreshSelection,
      startPolling: state.startPolling,
      stopPolling: state.stopPolling,
    }))
  );
}

/**
 * Hook to access settings state with shallow comparison
 */
export function useSettings() {
  return usePluginStore(
    useShallow((state) => ({
      theme: state.settings.theme,
      isDarkMode: state.settings.isDarkMode,
      autoPreview: state.settings.autoPreview,
      outputFormat: state.settings.outputFormat,
      quality: state.settings.quality,
      preserveMetadata: state.settings.preserveMetadata,
      setTheme: state.setTheme,
      toggleTheme: state.toggleTheme,
      setAutoPreview: state.setAutoPreview,
      setOutputFormat: state.setOutputFormat,
      setQuality: state.setQuality,
      resetSettings: state.resetSettings,
    }))
  );
}

/**
 * Hook to access processing state with shallow comparison
 */
export function useProcessing() {
  return usePluginStore(
    useShallow((state) => ({
      status: state.processing.status,
      progress: state.processing.progress,
      currentItemId: state.processing.currentItemId,
      currentItemName: state.processing.currentItemName,
      totalItems: state.processing.totalItems,
      completedItems: state.processing.completedItems,
      results: state.processing.results,
      cancelRequested: state.processing.cancelRequested,
      startProcessing: state.startProcessing,
      updateProgress: state.updateProgress,
      addResult: state.addResult,
      completeProcessing: state.completeProcessing,
      requestCancel: state.requestCancel,
      resetProcessing: state.resetProcessing,
    }))
  );
}

/**
 * Hook to access UI state with shallow comparison
 */
export function useUI() {
  return usePluginStore(
    useShallow((state) => ({
      activePanel: state.ui.activePanel,
      selectedItemIds: state.ui.selectedItemIds,
      expandedFolders: state.ui.expandedFolders,
      sidebarCollapsed: state.ui.sidebarCollapsed,
      searchQuery: state.ui.searchQuery,
      modalOpen: state.ui.modalOpen,
      currentModal: state.ui.currentModal,
      setActivePanel: state.setActivePanel,
      toggleItemSelection: state.toggleItemSelection,
      selectItems: state.selectItems,
      clearItemSelection: state.clearItemSelection,
      toggleFolderExpansion: state.toggleFolderExpansion,
      setSidebarCollapsed: state.setSidebarCollapsed,
      setSearchQuery: state.setSearchQuery,
      openModal: state.openModal,
      closeModal: state.closeModal,
    }))
  );
}

/**
 * Hook to access stitching state with shallow comparison
 */
export function useStitching() {
  return usePluginStore(
    useShallow((state) => ({
      // State
      reorderedImages: state.stitching.reorderedImages,
      cropTopPercent: state.stitching.cropTopPercent,
      cropBottomPercent: state.stitching.cropBottomPercent,
      exportFormat: state.stitching.exportFormat,
      exportQuality: state.stitching.exportQuality,
      hasPreviewGenerated: state.stitching.hasPreviewGenerated,
      previewCanvas: state.stitching.previewCanvas,
      isAlwaysOnTop: state.stitching.isAlwaysOnTop,
      isLightboxOpen: state.stitching.isLightboxOpen,
      lightboxZoom: state.stitching.lightboxZoom,
      lightboxOffset: state.stitching.lightboxOffset,

      // Computed
      maxCropTop: 99 - state.stitching.cropBottomPercent,
      maxCropBottom: 99 - state.stitching.cropTopPercent,

      // Actions
      setReorderedImages: state.setReorderedImages,
      reorderImages: state.reorderImages,
      resetImageOrder: state.resetImageOrder,
      setCropTopPercent: state.setCropTopPercent,
      setCropBottomPercent: state.setCropBottomPercent,
      setCropValues: state.setCropValues,
      setExportFormat: state.setStitchingExportFormat,
      setExportQuality: state.setExportQuality,
      setHasPreviewGenerated: state.setHasPreviewGenerated,
      setPreviewCanvas: state.setPreviewCanvas,
      setIsAlwaysOnTop: state.setIsAlwaysOnTop,
      toggleAlwaysOnTop: state.toggleAlwaysOnTop,
      openLightbox: state.openLightbox,
      closeLightbox: state.closeLightbox,
      setLightboxZoom: state.setLightboxZoom,
      setLightboxOffset: state.setLightboxOffset,
      resetLightboxView: state.resetLightboxView,
      clearCaches: state.clearStitchingCaches,
      resetState: state.resetStitchingState,
    }))
  );
}

// ============================================================================
// Exports
// ============================================================================

export { useShallow } from 'zustand/react/shallow';
