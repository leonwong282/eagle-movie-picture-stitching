/**
 * Store Selectors
 *
 * Memoized derived state selectors for efficient computed values.
 * Use these instead of computing values inline in components.
 *
 * @example
 * ```tsx
 * // Use selector directly
 * const imageItems = usePluginStore(selectImageItems);
 *
 * // Or with custom selector
 * const count = usePluginStore(selectSelectedCount);
 * ```
 */

import type { PluginStore, ProcessResult } from './index';
import type { Item } from '@/types/eagle';

// ============================================================================
// Selection Selectors
// ============================================================================

/**
 * Select all items that are images
 */
export const selectImageItems = (state: PluginStore): Item[] =>
  state.selection.items.filter((item) =>
    ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'bmp', 'ico', 'tiff', 'tif'].includes(
      item.ext.toLowerCase()
    )
  );

/**
 * Select all items that are videos
 */
export const selectVideoItems = (state: PluginStore): Item[] =>
  state.selection.items.filter((item) =>
    ['mp4', 'mov', 'webm', 'avi', 'mkv', 'wmv', 'flv', 'm4v'].includes(item.ext.toLowerCase())
  );

/**
 * Select all items that are documents
 */
export const selectDocumentItems = (state: PluginStore): Item[] =>
  state.selection.items.filter((item) =>
    ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'md', 'rtf'].includes(
      item.ext.toLowerCase()
    )
  );

/**
 * Select all items that are design files
 */
export const selectDesignItems = (state: PluginStore): Item[] =>
  state.selection.items.filter((item) =>
    ['psd', 'ai', 'sketch', 'fig', 'xd', 'eps', 'indd'].includes(item.ext.toLowerCase())
  );

/**
 * Select count of selected items
 */
export const selectSelectedCount = (state: PluginStore): number => state.selection.items.length;

/**
 * Select whether any items are selected
 */
export const selectHasSelection = (state: PluginStore): boolean => state.selection.items.length > 0;

/**
 * Select items filtered by search query
 */
export const selectFilteredItems = (state: PluginStore): Item[] => {
  const query = state.ui.searchQuery.toLowerCase().trim();
  if (!query) return state.selection.items;

  return state.selection.items.filter(
    (item) =>
      item.name.toLowerCase().includes(query) ||
      item.ext.toLowerCase().includes(query) ||
      item.tags.some((tag) => tag.toLowerCase().includes(query))
  );
};

/**
 * Select items by extension
 */
export const selectItemsByExtension =
  (ext: string) =>
  (state: PluginStore): Item[] =>
    state.selection.items.filter((item) => item.ext.toLowerCase() === ext.toLowerCase());

/**
 * Select items by tag
 */
export const selectItemsByTag =
  (tag: string) =>
  (state: PluginStore): Item[] =>
    state.selection.items.filter((item) =>
      item.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
    );

/**
 * Select items with star rating
 */
export const selectStarredItems =
  (minStars: number = 1) =>
  (state: PluginStore): Item[] =>
    state.selection.items.filter((item) => item.star >= minStars);

/**
 * Select total size of selected items
 */
export const selectTotalSize = (state: PluginStore): number =>
  state.selection.items.reduce((sum, item) => sum + item.size, 0);

/**
 * Select total size formatted
 */
export const selectTotalSizeFormatted = (state: PluginStore): string => {
  const bytes = selectTotalSize(state);
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

// ============================================================================
// Settings Selectors
// ============================================================================

/**
 * Select effective output format (resolve 'original')
 */
export const selectEffectiveFormat = (state: PluginStore): string => {
  if (state.settings.outputFormat === 'original') {
    // If only one item, use its format
    if (state.selection.items.length === 1) {
      return state.selection.items[0].ext;
    }
    // Otherwise return 'original' and let processing decide per-item
    return 'original';
  }
  return state.settings.outputFormat;
};

// ============================================================================
// Processing Selectors
// ============================================================================

/**
 * Select whether processing is active
 */
export const selectIsProcessing = (state: PluginStore): boolean =>
  state.processing.status === 'processing' || state.processing.status === 'preparing';

/**
 * Select whether processing can be started
 */
export const selectCanStartProcessing = (state: PluginStore): boolean =>
  ['idle', 'complete', 'error', 'cancelled'].includes(state.processing.status) &&
  state.selection.items.length > 0;

/**
 * Select processing progress info
 */
export const selectProcessingProgress = (
  state: PluginStore
): {
  percent: number;
  current: number;
  total: number;
  currentItem: string | null;
} => ({
  percent: state.processing.progress,
  current: state.processing.completedItems,
  total: state.processing.totalItems,
  currentItem: state.processing.currentItemName,
});

/**
 * Select processing statistics
 */
export const selectProcessingStats = (
  state: PluginStore
): {
  success: number;
  failed: number;
  total: number;
  successRate: number;
} => {
  const results = state.processing.results;
  const success = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success).length;
  const total = results.length;
  return {
    success,
    failed,
    total,
    successRate: total > 0 ? Math.round((success / total) * 100) : 0,
  };
};

/**
 * Select failed results only
 */
export const selectFailedResults = (state: PluginStore): ProcessResult[] =>
  state.processing.results.filter((r) => !r.success);

/**
 * Select successful results only
 */
export const selectSuccessfulResults = (state: PluginStore): ProcessResult[] =>
  state.processing.results.filter((r) => r.success);

/**
 * Select processing duration in ms
 */
export const selectProcessingDuration = (state: PluginStore): number => {
  if (!state.processing.startedAt) return 0;
  if (state.processing.status === 'processing' || state.processing.status === 'preparing') {
    return Date.now() - state.processing.startedAt;
  }
  // Return duration of last completed processing
  const lastResult = state.processing.results[state.processing.results.length - 1];
  return lastResult?.duration ?? 0;
};

/**
 * Select estimated time remaining
 */
export const selectEstimatedTimeRemaining = (state: PluginStore): number | null => {
  if (state.processing.completedItems === 0 || !state.processing.startedAt) {
    return null;
  }

  const elapsed = Date.now() - state.processing.startedAt;
  const perItem = elapsed / state.processing.completedItems;
  const remaining = state.processing.totalItems - state.processing.completedItems;

  return Math.round(perItem * remaining);
};

// ============================================================================
// UI Selectors
// ============================================================================

/**
 * Select whether modal is open with specific ID
 */
export const selectIsModalOpen =
  (modalId: string) =>
  (state: PluginStore): boolean =>
    state.ui.modalOpen && state.ui.currentModal === modalId;

/**
 * Select UI-selected items that exist in Eagle selection
 */
export const selectUISelectedItems = (state: PluginStore): Item[] =>
  state.selection.items.filter((item) => state.ui.selectedItemIds.includes(item.id));

/**
 * Select count of UI-selected items
 */
export const selectUISelectionCount = (state: PluginStore): number =>
  state.ui.selectedItemIds.length;

// ============================================================================
// Combined Selectors
// ============================================================================

/**
 * Select all relevant state for a processing workflow
 */
export const selectProcessingWorkflow = (state: PluginStore) => ({
  // What to process
  items: state.selection.items,
  itemCount: state.selection.items.length,

  // How to process
  format: state.settings.outputFormat,
  quality: state.settings.quality,
  preserveMetadata: state.settings.preserveMetadata,

  // Processing state
  status: state.processing.status,
  progress: state.processing.progress,
  canStart: selectCanStartProcessing(state),
  isActive: selectIsProcessing(state),

  // Actions (at root level)
  startProcessing: state.startProcessing,
  requestCancel: state.requestCancel,
  resetProcessing: state.resetProcessing,
});

/**
 * Select all relevant state for display
 */
export const selectDisplayState = (state: PluginStore) => ({
  // Selection
  items: state.selection.items,
  isLoading: state.selection.isLoading,
  error: state.selection.error,

  // Theme
  isDarkMode: state.settings.isDarkMode,
  theme: state.settings.theme,

  // UI
  activePanel: state.ui.activePanel,
  searchQuery: state.ui.searchQuery,
  sidebarCollapsed: state.ui.sidebarCollapsed,

  // Processing (if active)
  isProcessing: selectIsProcessing(state),
  processingProgress: state.processing.progress,
});
