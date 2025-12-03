/**
 * Plugin Store Tests
 *
 * Comprehensive tests for Zustand state management.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import {
  usePluginStore,
  useSelection,
  useSettings,
  useProcessing,
  useUI,
  type ProcessResult,
} from './index';

// Mock the Eagle API
vi.mock('@/lib/eagle-api', () => ({
  eagleApi: {
    getSelectedItems: vi.fn().mockResolvedValue([]),
    theme: 'Auto',
    isDarkMode: false,
    isMock: true,
  },
}));

describe('Plugin Store', () => {
  // Reset store before each test
  beforeEach(() => {
    const state = usePluginStore.getState();
    // Reset all slices to initial state
    state.resetProcessing();
    state.resetSettings();
    state.clearItemSelection();
    state.setSearchQuery('');
    state.closeModal();
    state.setActivePanel('main');
    state.stopPolling();
    state.setItems([]);
    state.setSelectionError(null);
    state.setSelectionLoading(true); // Reset loading state
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // ============================================================================
  // Selection Slice Tests
  // ============================================================================
  describe('Selection Slice', () => {
    it('should have initial state', () => {
      const state = usePluginStore.getState();
      expect(state.selection.items).toEqual([]);
      expect(state.selection.isLoading).toBe(true);
      expect(state.selection.error).toBeNull();
      expect(state.selection.isPolling).toBe(false);
      expect(state.selection.isPaused).toBe(false);
    });

    it('should set items', () => {
      const mockItems = [
        { id: 'item-1', name: 'Test 1', ext: 'png' },
        { id: 'item-2', name: 'Test 2', ext: 'jpg' },
      ] as any[];

      act(() => {
        usePluginStore.getState().setItems(mockItems);
      });

      const state = usePluginStore.getState();
      expect(state.selection.items).toHaveLength(2);
      expect(state.selection.items[0].id).toBe('item-1');
      expect(state.selection.lastUpdated).toBeGreaterThan(0);
    });

    it('should set loading state', () => {
      act(() => {
        usePluginStore.getState().setSelectionLoading(false);
      });

      expect(usePluginStore.getState().selection.isLoading).toBe(false);
    });

    it('should set error state', () => {
      const error = new Error('Test error');

      act(() => {
        usePluginStore.getState().setSelectionError(error);
      });

      const state = usePluginStore.getState();
      expect(state.selection.error).toBe(error);
      expect(state.selection.isLoading).toBe(false);
    });

    it('should set paused state', () => {
      act(() => {
        usePluginStore.getState().setSelectionPaused(true);
      });

      expect(usePluginStore.getState().selection.isPaused).toBe(true);
    });
  });

  // ============================================================================
  // Settings Slice Tests
  // ============================================================================
  describe('Settings Slice', () => {
    it('should have initial state', () => {
      const state = usePluginStore.getState();
      expect(state.settings.theme).toBe('auto');
      expect(state.settings.autoPreview).toBe(true);
      expect(state.settings.outputFormat).toBe('original');
      expect(state.settings.quality).toBe(90);
      expect(state.settings.preserveMetadata).toBe(true);
    });

    it('should set theme', () => {
      act(() => {
        usePluginStore.getState().setTheme('dark');
      });

      const state = usePluginStore.getState();
      expect(state.settings.theme).toBe('dark');
      expect(state.settings.isDarkMode).toBe(true);
    });

    it('should toggle theme', () => {
      // Start with light theme
      act(() => {
        usePluginStore.getState().setTheme('light');
      });
      expect(usePluginStore.getState().settings.isDarkMode).toBe(false);

      // Toggle to dark
      act(() => {
        usePluginStore.getState().toggleTheme();
      });
      expect(usePluginStore.getState().settings.theme).toBe('dark');
      expect(usePluginStore.getState().settings.isDarkMode).toBe(true);
    });

    it('should set auto preview', () => {
      act(() => {
        usePluginStore.getState().setAutoPreview(false);
      });

      expect(usePluginStore.getState().settings.autoPreview).toBe(false);
    });

    it('should set output format', () => {
      act(() => {
        usePluginStore.getState().setOutputFormat('png');
      });

      expect(usePluginStore.getState().settings.outputFormat).toBe('png');
    });

    it('should set quality with clamping', () => {
      // Normal value
      act(() => {
        usePluginStore.getState().setQuality(75);
      });
      expect(usePluginStore.getState().settings.quality).toBe(75);

      // Over 100 should clamp to 100
      act(() => {
        usePluginStore.getState().setQuality(150);
      });
      expect(usePluginStore.getState().settings.quality).toBe(100);

      // Below 0 should clamp to 0
      act(() => {
        usePluginStore.getState().setQuality(-10);
      });
      expect(usePluginStore.getState().settings.quality).toBe(0);
    });

    it('should set preserve metadata', () => {
      act(() => {
        usePluginStore.getState().setPreserveMetadata(false);
      });

      expect(usePluginStore.getState().settings.preserveMetadata).toBe(false);
    });

    it('should set custom settings', () => {
      act(() => {
        usePluginStore.getState().setCustomSetting('myOption', 'value1');
        usePluginStore.getState().setCustomSetting('myNumber', 42);
      });

      const state = usePluginStore.getState();
      expect(state.settings.custom['myOption']).toBe('value1');
      expect(state.settings.custom['myNumber']).toBe(42);
    });

    it('should reset settings to defaults', () => {
      // Change some settings
      act(() => {
        usePluginStore.getState().setTheme('dark');
        usePluginStore.getState().setQuality(50);
        usePluginStore.getState().setAutoPreview(false);
      });

      // Reset
      act(() => {
        usePluginStore.getState().resetSettings();
      });

      const state = usePluginStore.getState();
      expect(state.settings.theme).toBe('auto');
      expect(state.settings.quality).toBe(90);
      expect(state.settings.autoPreview).toBe(true);
    });
  });

  // ============================================================================
  // Processing Slice Tests
  // ============================================================================
  describe('Processing Slice', () => {
    it('should have initial state', () => {
      const state = usePluginStore.getState();
      expect(state.processing.status).toBe('idle');
      expect(state.processing.progress).toBe(0);
      expect(state.processing.totalItems).toBe(0);
      expect(state.processing.completedItems).toBe(0);
      expect(state.processing.results).toEqual([]);
      expect(state.processing.cancelRequested).toBe(false);
    });

    it('should start processing', async () => {
      const itemIds = ['item-1', 'item-2', 'item-3'];

      act(() => {
        usePluginStore.getState().startProcessing(itemIds);
      });

      const state = usePluginStore.getState();
      expect(state.processing.status).toBe('preparing');
      expect(state.processing.totalItems).toBe(3);
      expect(state.processing.startedAt).not.toBeNull();

      // Wait for transition to processing
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10));
      });

      expect(usePluginStore.getState().processing.status).toBe('processing');
    });

    it('should update progress', () => {
      act(() => {
        usePluginStore.getState().startProcessing(['a', 'b', 'c', 'd']);
        usePluginStore.getState().updateProgress(2, 4, { id: 'item-2', name: 'Test Item' });
      });

      const state = usePluginStore.getState();
      expect(state.processing.progress).toBe(50);
      expect(state.processing.completedItems).toBe(2);
      expect(state.processing.totalItems).toBe(4);
      expect(state.processing.currentItemId).toBe('item-2');
      expect(state.processing.currentItemName).toBe('Test Item');
    });

    it('should add results', () => {
      const result1: ProcessResult = {
        itemId: 'item-1',
        itemName: 'Test 1',
        success: true,
        outputPath: '/path/to/output.png',
        duration: 100,
      };
      const result2: ProcessResult = {
        itemId: 'item-2',
        itemName: 'Test 2',
        success: false,
        error: 'Failed to process',
        duration: 50,
      };

      act(() => {
        usePluginStore.getState().startProcessing(['item-1', 'item-2']);
        usePluginStore.getState().addResult(result1);
        usePluginStore.getState().addResult(result2);
      });

      const state = usePluginStore.getState();
      expect(state.processing.results).toHaveLength(2);
      expect(state.processing.results[0].success).toBe(true);
      expect(state.processing.results[1].success).toBe(false);
      expect(state.processing.completedItems).toBe(2);
      expect(state.processing.progress).toBe(100);
    });

    it('should complete processing', () => {
      act(() => {
        usePluginStore.getState().startProcessing(['a']);
        usePluginStore.getState().completeProcessing();
      });

      const state = usePluginStore.getState();
      expect(state.processing.status).toBe('complete');
      expect(state.processing.progress).toBe(100);
      expect(state.processing.currentItemId).toBeNull();
    });

    it('should handle processing error', () => {
      act(() => {
        usePluginStore.getState().startProcessing(['item-1']);
        usePluginStore.getState().updateProgress(0, 1, { id: 'item-1', name: 'Test' });
        usePluginStore.getState().setProcessingError('Something went wrong');
      });

      const state = usePluginStore.getState();
      expect(state.processing.status).toBe('error');
      expect(state.processing.results).toHaveLength(1);
      expect(state.processing.results[0].error).toBe('Something went wrong');
    });

    it('should request cancellation', () => {
      act(() => {
        usePluginStore.getState().startProcessing(['a', 'b']);
      });

      // Wait for processing status
      act(() => {
        const state = usePluginStore.getState();
        if (state.processing.status === 'processing') {
          state.requestCancel();
        }
      });

      // For preparing status, it should set cancelRequested
      act(() => {
        usePluginStore.getState().requestCancel();
      });

      expect(usePluginStore.getState().processing.cancelRequested).toBe(true);
    });

    it('should reset processing', () => {
      act(() => {
        usePluginStore.getState().startProcessing(['a', 'b']);
        usePluginStore.getState().updateProgress(1, 2);
        usePluginStore.getState().resetProcessing();
      });

      const state = usePluginStore.getState();
      expect(state.processing.status).toBe('idle');
      expect(state.processing.progress).toBe(0);
      expect(state.processing.totalItems).toBe(0);
      expect(state.processing.results).toEqual([]);
    });
  });

  // ============================================================================
  // UI Slice Tests
  // ============================================================================
  describe('UI Slice', () => {
    it('should have initial state', () => {
      const state = usePluginStore.getState();
      expect(state.ui.activePanel).toBe('main');
      expect(state.ui.selectedItemIds).toEqual([]);
      expect(state.ui.expandedFolders).toEqual([]);
      expect(state.ui.sidebarCollapsed).toBe(false);
      expect(state.ui.searchQuery).toBe('');
      expect(state.ui.modalOpen).toBe(false);
    });

    it('should set active panel', () => {
      act(() => {
        usePluginStore.getState().setActivePanel('settings');
      });

      expect(usePluginStore.getState().ui.activePanel).toBe('settings');
    });

    it('should toggle item selection', () => {
      // Select an item
      act(() => {
        usePluginStore.getState().toggleItemSelection('item-1');
      });
      expect(usePluginStore.getState().ui.selectedItemIds).toContain('item-1');

      // Select another
      act(() => {
        usePluginStore.getState().toggleItemSelection('item-2');
      });
      expect(usePluginStore.getState().ui.selectedItemIds).toHaveLength(2);

      // Deselect first item
      act(() => {
        usePluginStore.getState().toggleItemSelection('item-1');
      });
      expect(usePluginStore.getState().ui.selectedItemIds).not.toContain('item-1');
      expect(usePluginStore.getState().ui.selectedItemIds).toContain('item-2');
    });

    it('should select multiple items', () => {
      act(() => {
        usePluginStore.getState().selectItems(['a', 'b', 'c']);
      });

      expect(usePluginStore.getState().ui.selectedItemIds).toEqual(['a', 'b', 'c']);
    });

    it('should clear item selection', () => {
      act(() => {
        usePluginStore.getState().selectItems(['a', 'b']);
        usePluginStore.getState().clearItemSelection();
      });

      expect(usePluginStore.getState().ui.selectedItemIds).toEqual([]);
    });

    it('should toggle folder expansion', () => {
      // Expand folder
      act(() => {
        usePluginStore.getState().toggleFolderExpansion('folder-1');
      });
      expect(usePluginStore.getState().ui.expandedFolders).toContain('folder-1');

      // Collapse folder
      act(() => {
        usePluginStore.getState().toggleFolderExpansion('folder-1');
      });
      expect(usePluginStore.getState().ui.expandedFolders).not.toContain('folder-1');
    });

    it('should set sidebar collapsed', () => {
      act(() => {
        usePluginStore.getState().setSidebarCollapsed(true);
      });

      expect(usePluginStore.getState().ui.sidebarCollapsed).toBe(true);
    });

    it('should set search query', () => {
      act(() => {
        usePluginStore.getState().setSearchQuery('test query');
      });

      expect(usePluginStore.getState().ui.searchQuery).toBe('test query');
    });

    it('should open and close modal', () => {
      act(() => {
        usePluginStore.getState().openModal('confirm-delete');
      });

      let state = usePluginStore.getState();
      expect(state.ui.modalOpen).toBe(true);
      expect(state.ui.currentModal).toBe('confirm-delete');

      act(() => {
        usePluginStore.getState().closeModal();
      });

      state = usePluginStore.getState();
      expect(state.ui.modalOpen).toBe(false);
      expect(state.ui.currentModal).toBeNull();
    });
  });

  // ============================================================================
  // Convenience Hook Tests
  // ============================================================================
  describe('Convenience Hooks', () => {
    it('useSelection should return selection state and actions', () => {
      const { result } = renderHook(() => useSelection());

      expect(result.current).toHaveProperty('items');
      expect(result.current).toHaveProperty('isLoading');
      expect(result.current).toHaveProperty('error');
      expect(result.current).toHaveProperty('refresh');
      expect(result.current).toHaveProperty('startPolling');
      expect(result.current).toHaveProperty('stopPolling');
    });

    it('useSettings should return settings state and actions', () => {
      const { result } = renderHook(() => useSettings());

      expect(result.current).toHaveProperty('theme');
      expect(result.current).toHaveProperty('isDarkMode');
      expect(result.current).toHaveProperty('setTheme');
      expect(result.current).toHaveProperty('toggleTheme');
      expect(result.current).toHaveProperty('setQuality');
    });

    it('useProcessing should return processing state and actions', () => {
      const { result } = renderHook(() => useProcessing());

      expect(result.current).toHaveProperty('status');
      expect(result.current).toHaveProperty('progress');
      expect(result.current).toHaveProperty('startProcessing');
      expect(result.current).toHaveProperty('requestCancel');
    });

    it('useUI should return UI state and actions', () => {
      const { result } = renderHook(() => useUI());

      expect(result.current).toHaveProperty('activePanel');
      expect(result.current).toHaveProperty('setActivePanel');
      expect(result.current).toHaveProperty('toggleItemSelection');
      expect(result.current).toHaveProperty('openModal');
    });

    it('hooks should react to state changes', () => {
      const { result } = renderHook(() => useSettings());

      expect(result.current.theme).toBe('auto');

      act(() => {
        result.current.setTheme('dark');
      });

      expect(result.current.theme).toBe('dark');
      expect(result.current.isDarkMode).toBe(true);
    });
  });
});
