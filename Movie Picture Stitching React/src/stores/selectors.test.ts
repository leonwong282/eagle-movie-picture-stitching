/**
 * Store Selectors Tests
 *
 * Tests for memoized derived state selectors.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { act } from '@testing-library/react';
import { usePluginStore } from './index';
import {
  selectImageItems,
  selectVideoItems,
  selectDocumentItems,
  selectDesignItems,
  selectSelectedCount,
  selectHasSelection,
  selectFilteredItems,
  selectItemsByExtension,
  selectItemsByTag,
  selectStarredItems,
  selectTotalSize,
  selectTotalSizeFormatted,
  selectIsProcessing,
  selectCanStartProcessing,
  selectProcessingProgress,
  selectProcessingStats,
  selectFailedResults,
  selectSuccessfulResults,
  selectIsModalOpen,
  selectUISelectedItems,
  selectUISelectionCount,
} from './selectors';
import type { Item } from '@/types/eagle';

// Helper to create mock items
function createMockItem(overrides: Partial<Item> = {}): Item {
  return {
    id: `item-${Math.random().toString(36).substr(2, 9)}`,
    name: 'Test Item',
    ext: 'png',
    width: 1920,
    height: 1080,
    size: 1024 * 1024, // 1 MB
    star: 0,
    tags: [],
    folders: [],
    isDeleted: false,
    url: '',
    annotation: '',
    modificationTime: Date.now(),
    noThumbnail: false,
    lastModified: Date.now(),
    palettes: [],
    filePath: '/path/to/file.png',
    fileURL: 'file:///path/to/file.png',
    ...overrides,
  } as Item;
}

describe('Store Selectors', () => {
  beforeEach(() => {
    // Reset store to clean state
    const state = usePluginStore.getState();
    state.resetProcessing();
    state.clearItemSelection();
    state.setSearchQuery('');
    state.closeModal();
    state.setItems([]);
  });

  // ============================================================================
  // Selection Selectors
  // ============================================================================
  describe('Selection Selectors', () => {
    it('selectImageItems filters image files', () => {
      const items = [
        createMockItem({ id: '1', ext: 'png' }),
        createMockItem({ id: '2', ext: 'jpg' }),
        createMockItem({ id: '3', ext: 'mp4' }),
        createMockItem({ id: '4', ext: 'webp' }),
        createMockItem({ id: '5', ext: 'pdf' }),
      ];

      act(() => {
        usePluginStore.getState().setItems(items);
      });

      const result = selectImageItems(usePluginStore.getState());
      expect(result).toHaveLength(3);
      expect(result.map((i) => i.ext)).toEqual(['png', 'jpg', 'webp']);
    });

    it('selectVideoItems filters video files', () => {
      const items = [
        createMockItem({ id: '1', ext: 'mp4' }),
        createMockItem({ id: '2', ext: 'mov' }),
        createMockItem({ id: '3', ext: 'png' }),
        createMockItem({ id: '4', ext: 'webm' }),
      ];

      act(() => {
        usePluginStore.getState().setItems(items);
      });

      const result = selectVideoItems(usePluginStore.getState());
      expect(result).toHaveLength(3);
      expect(result.map((i) => i.ext)).toEqual(['mp4', 'mov', 'webm']);
    });

    it('selectDocumentItems filters document files', () => {
      const items = [
        createMockItem({ id: '1', ext: 'pdf' }),
        createMockItem({ id: '2', ext: 'doc' }),
        createMockItem({ id: '3', ext: 'png' }),
        createMockItem({ id: '4', ext: 'md' }),
      ];

      act(() => {
        usePluginStore.getState().setItems(items);
      });

      const result = selectDocumentItems(usePluginStore.getState());
      expect(result).toHaveLength(3);
    });

    it('selectDesignItems filters design files', () => {
      const items = [
        createMockItem({ id: '1', ext: 'psd' }),
        createMockItem({ id: '2', ext: 'ai' }),
        createMockItem({ id: '3', ext: 'png' }),
        createMockItem({ id: '4', ext: 'sketch' }),
      ];

      act(() => {
        usePluginStore.getState().setItems(items);
      });

      const result = selectDesignItems(usePluginStore.getState());
      expect(result).toHaveLength(3);
    });

    it('selectSelectedCount returns item count', () => {
      const items = [
        createMockItem({ id: '1' }),
        createMockItem({ id: '2' }),
        createMockItem({ id: '3' }),
      ];

      act(() => {
        usePluginStore.getState().setItems(items);
      });

      expect(selectSelectedCount(usePluginStore.getState())).toBe(3);
    });

    it('selectHasSelection returns boolean', () => {
      expect(selectHasSelection(usePluginStore.getState())).toBe(false);

      act(() => {
        usePluginStore.getState().setItems([createMockItem()]);
      });

      expect(selectHasSelection(usePluginStore.getState())).toBe(true);
    });

    it('selectFilteredItems filters by search query', () => {
      const items = [
        createMockItem({ id: '1', name: 'Apple Photo' }),
        createMockItem({ id: '2', name: 'Banana Image' }),
        createMockItem({ id: '3', name: 'Apple Pie', tags: ['fruit'] }),
      ];

      act(() => {
        usePluginStore.getState().setItems(items);
        usePluginStore.getState().setSearchQuery('apple');
      });

      const result = selectFilteredItems(usePluginStore.getState());
      expect(result).toHaveLength(2);
      expect(result.map((i) => i.name)).toEqual(['Apple Photo', 'Apple Pie']);
    });

    it('selectFilteredItems returns all items when query is empty', () => {
      const items = [createMockItem({ id: '1' }), createMockItem({ id: '2' })];

      act(() => {
        usePluginStore.getState().setItems(items);
        usePluginStore.getState().setSearchQuery('');
      });

      expect(selectFilteredItems(usePluginStore.getState())).toHaveLength(2);
    });

    it('selectItemsByExtension creates selector for specific extension', () => {
      const items = [
        createMockItem({ id: '1', ext: 'png' }),
        createMockItem({ id: '2', ext: 'PNG' }),
        createMockItem({ id: '3', ext: 'jpg' }),
      ];

      act(() => {
        usePluginStore.getState().setItems(items);
      });

      const pngSelector = selectItemsByExtension('png');
      const result = pngSelector(usePluginStore.getState());
      expect(result).toHaveLength(2);
    });

    it('selectItemsByTag creates selector for specific tag', () => {
      const items = [
        createMockItem({ id: '1', tags: ['nature', 'landscape'] }),
        createMockItem({ id: '2', tags: ['portrait'] }),
        createMockItem({ id: '3', tags: ['nature'] }),
      ];

      act(() => {
        usePluginStore.getState().setItems(items);
      });

      const natureSelector = selectItemsByTag('nature');
      const result = natureSelector(usePluginStore.getState());
      expect(result).toHaveLength(2);
    });

    it('selectStarredItems filters by star rating', () => {
      const items = [
        createMockItem({ id: '1', star: 0 }),
        createMockItem({ id: '2', star: 3 }),
        createMockItem({ id: '3', star: 5 }),
        createMockItem({ id: '4', star: 1 }),
      ];

      act(() => {
        usePluginStore.getState().setItems(items);
      });

      // Default: at least 1 star
      const starred = selectStarredItems()(usePluginStore.getState());
      expect(starred).toHaveLength(3);

      // At least 3 stars
      const highRated = selectStarredItems(3)(usePluginStore.getState());
      expect(highRated).toHaveLength(2);
    });

    it('selectTotalSize calculates total bytes', () => {
      const items = [
        createMockItem({ id: '1', size: 1000 }),
        createMockItem({ id: '2', size: 2000 }),
        createMockItem({ id: '3', size: 3000 }),
      ];

      act(() => {
        usePluginStore.getState().setItems(items);
      });

      expect(selectTotalSize(usePluginStore.getState())).toBe(6000);
    });

    it('selectTotalSizeFormatted returns human-readable size', () => {
      // Test empty
      expect(selectTotalSizeFormatted(usePluginStore.getState())).toBe('0 B');

      // Test KB
      act(() => {
        usePluginStore.getState().setItems([createMockItem({ size: 1024 })]);
      });
      expect(selectTotalSizeFormatted(usePluginStore.getState())).toBe('1 KB');

      // Test MB
      act(() => {
        usePluginStore.getState().setItems([createMockItem({ size: 1024 * 1024 })]);
      });
      expect(selectTotalSizeFormatted(usePluginStore.getState())).toBe('1 MB');
    });
  });

  // ============================================================================
  // Processing Selectors
  // ============================================================================
  describe('Processing Selectors', () => {
    it('selectIsProcessing returns true during active processing', () => {
      expect(selectIsProcessing(usePluginStore.getState())).toBe(false);

      act(() => {
        usePluginStore.getState().startProcessing(['a']);
      });

      expect(selectIsProcessing(usePluginStore.getState())).toBe(true);
    });

    it('selectCanStartProcessing checks conditions', () => {
      // No items - cannot start
      expect(selectCanStartProcessing(usePluginStore.getState())).toBe(false);

      // Add items
      act(() => {
        usePluginStore.getState().setItems([createMockItem()]);
      });
      expect(selectCanStartProcessing(usePluginStore.getState())).toBe(true);

      // Start processing - cannot start again
      act(() => {
        usePluginStore.getState().startProcessing(['a']);
      });
      expect(selectCanStartProcessing(usePluginStore.getState())).toBe(false);

      // Complete - can start again
      act(() => {
        usePluginStore.getState().completeProcessing();
      });
      expect(selectCanStartProcessing(usePluginStore.getState())).toBe(true);
    });

    it('selectProcessingProgress returns progress info', () => {
      act(() => {
        usePluginStore.getState().startProcessing(['a', 'b', 'c']);
        usePluginStore.getState().updateProgress(1, 3, { id: 'a', name: 'Item A' });
      });

      const progress = selectProcessingProgress(usePluginStore.getState());
      expect(progress.percent).toBe(33);
      expect(progress.current).toBe(1);
      expect(progress.total).toBe(3);
      expect(progress.currentItem).toBe('Item A');
    });

    it('selectProcessingStats calculates success rate', () => {
      act(() => {
        usePluginStore.getState().startProcessing(['a', 'b', 'c']);
        usePluginStore
          .getState()
          .addResult({ itemId: 'a', itemName: 'A', success: true, duration: 100 });
        usePluginStore
          .getState()
          .addResult({ itemId: 'b', itemName: 'B', success: true, duration: 100 });
        usePluginStore
          .getState()
          .addResult({ itemId: 'c', itemName: 'C', success: false, error: 'fail', duration: 50 });
      });

      const stats = selectProcessingStats(usePluginStore.getState());
      expect(stats.success).toBe(2);
      expect(stats.failed).toBe(1);
      expect(stats.total).toBe(3);
      expect(stats.successRate).toBe(67);
    });

    it('selectFailedResults returns only failures', () => {
      act(() => {
        usePluginStore.getState().startProcessing(['a', 'b']);
        usePluginStore
          .getState()
          .addResult({ itemId: 'a', itemName: 'A', success: true, duration: 100 });
        usePluginStore
          .getState()
          .addResult({ itemId: 'b', itemName: 'B', success: false, error: 'err', duration: 50 });
      });

      const failed = selectFailedResults(usePluginStore.getState());
      expect(failed).toHaveLength(1);
      expect(failed[0].itemId).toBe('b');
    });

    it('selectSuccessfulResults returns only successes', () => {
      act(() => {
        usePluginStore.getState().startProcessing(['a', 'b']);
        usePluginStore
          .getState()
          .addResult({ itemId: 'a', itemName: 'A', success: true, duration: 100 });
        usePluginStore
          .getState()
          .addResult({ itemId: 'b', itemName: 'B', success: false, error: 'err', duration: 50 });
      });

      const successful = selectSuccessfulResults(usePluginStore.getState());
      expect(successful).toHaveLength(1);
      expect(successful[0].itemId).toBe('a');
    });
  });

  // ============================================================================
  // UI Selectors
  // ============================================================================
  describe('UI Selectors', () => {
    it('selectIsModalOpen creates selector for specific modal', () => {
      const isConfirmOpen = selectIsModalOpen('confirm');
      const isSettingsOpen = selectIsModalOpen('settings');

      expect(isConfirmOpen(usePluginStore.getState())).toBe(false);

      act(() => {
        usePluginStore.getState().openModal('confirm');
      });

      expect(isConfirmOpen(usePluginStore.getState())).toBe(true);
      expect(isSettingsOpen(usePluginStore.getState())).toBe(false);
    });

    it('selectUISelectedItems returns items that are UI-selected', () => {
      const items = [
        createMockItem({ id: 'item-1' }),
        createMockItem({ id: 'item-2' }),
        createMockItem({ id: 'item-3' }),
      ];

      act(() => {
        usePluginStore.getState().setItems(items);
        usePluginStore.getState().selectItems(['item-1', 'item-3']);
      });

      const selected = selectUISelectedItems(usePluginStore.getState());
      expect(selected).toHaveLength(2);
      expect(selected.map((i) => i.id)).toEqual(['item-1', 'item-3']);
    });

    it('selectUISelectionCount returns count', () => {
      expect(selectUISelectionCount(usePluginStore.getState())).toBe(0);

      act(() => {
        usePluginStore.getState().selectItems(['a', 'b', 'c']);
      });

      expect(selectUISelectionCount(usePluginStore.getState())).toBe(3);
    });
  });
});
