import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useEagleSelection } from './useEagleSelection';

// Mock the eagle-api module
vi.mock('@/lib/eagle-api', () => ({
  eagleApi: {
    getSelectedItems: vi.fn(),
    isMock: true,
    raw: {
      event: {
        onPluginShow: vi.fn(),
        onPluginHide: vi.fn(),
      },
    },
  },
}));

import { eagleApi } from '@/lib/eagle-api';
import type { Item } from '@/types/eagle';

// Helper to create mock items with all required properties
function createMockItems(count: number): Item[] {
  return Array.from(
    { length: count },
    (_, i) =>
      ({
        id: `item-${i + 1}`,
        name: `Test Item ${i + 1}`,
        ext: 'png',
        width: 1920,
        height: 1080,
        size: 1024000,
        mtime: Date.now(),
        tags: [] as string[],
        folders: [] as string[],
        url: '',
        isDeleted: false,
        filePath: `/path/to/item-${i + 1}.png`,
        fileURL: `file:///path/to/item-${i + 1}.png`,
        annotation: '',
        palettes: [],
        star: 0,
        importedAt: Date.now(),
        noThumbnail: false,
        noPreview: false,
        thumbnailPath: `/path/to/thumbnails/item-${i + 1}.png`,
        thumbnailURL: `file:///path/to/thumbnails/item-${i + 1}.png`,
        metadataFilePath: `/path/to/metadata/item-${i + 1}.json`,
        lastModified: Date.now(),
        modificationTime: Date.now(),
        comments: '',
        btime: Date.now(),
        duration: 0,
        save: async () => true,
        refreshThumbnail: async () => true,
        setCustomThumbnail: async (_thumbnailPath: string) => true,
        open: async () => {},
        moveToTrash: async () => true,
        replaceFile: async (_filePath: string) => true,
      }) as Item
  );
}

describe('useEagleSelection', () => {
  beforeEach(() => {
    vi.mocked(eagleApi.getSelectedItems).mockResolvedValue([]);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('starts with empty items array', async () => {
      const { result } = renderHook(() => useEagleSelection({ autoStart: false }));

      // Wait for the initial fetch to complete
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.items).toEqual([]);
    });

    it('has no error initially', async () => {
      const { result } = renderHook(() => useEagleSelection({ autoStart: false }));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toBeNull();
    });
  });

  describe('initial fetch', () => {
    it('fetches items on mount', async () => {
      const mockItems = createMockItems(3);
      vi.mocked(eagleApi.getSelectedItems).mockResolvedValue(mockItems);

      const { result } = renderHook(() => useEagleSelection({ autoStart: false }));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.items).toEqual(mockItems);
      expect(eagleApi.getSelectedItems).toHaveBeenCalledTimes(1);
    });

    it('sets loading to false after fetch', async () => {
      vi.mocked(eagleApi.getSelectedItems).mockResolvedValue([]);

      const { result } = renderHook(() => useEagleSelection({ autoStart: false }));

      // Initially loading is true
      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });

    it('handles fetch error', async () => {
      const testError = new Error('API Error');
      vi.mocked(eagleApi.getSelectedItems).mockRejectedValue(testError);

      const { result } = renderHook(() => useEagleSelection({ autoStart: false }));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.error).toEqual(testError);
      expect(result.current.items).toEqual([]);
    });

    it('wraps non-Error objects in Error', async () => {
      vi.mocked(eagleApi.getSelectedItems).mockRejectedValue('string error');

      const { result } = renderHook(() => useEagleSelection({ autoStart: false }));

      await waitFor(() => {
        expect(result.current.error).toBeInstanceOf(Error);
      });

      expect(result.current.error?.message).toBe('Failed to get selected items');
    });
  });

  describe('polling', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('starts polling by default (autoStart: true)', async () => {
      const mockItems = createMockItems(2);
      vi.mocked(eagleApi.getSelectedItems).mockResolvedValue(mockItems);

      renderHook(() => useEagleSelection()); // autoStart defaults to true

      // Let initial effect run
      await act(async () => {
        await Promise.resolve();
      });

      const initialCalls = vi.mocked(eagleApi.getSelectedItems).mock.calls.length;

      // Advance past polling interval
      await act(async () => {
        await vi.advanceTimersByTimeAsync(500);
      });

      // Should have more calls after interval
      expect(eagleApi.getSelectedItems).toHaveBeenCalledTimes(initialCalls + 1);
    });

    it('does not poll when autoStart is false', async () => {
      vi.mocked(eagleApi.getSelectedItems).mockResolvedValue([]);

      renderHook(() => useEagleSelection({ autoStart: false }));

      // Wait for initial fetch
      await act(async () => {
        await Promise.resolve();
      });

      const callsAfterInit = vi.mocked(eagleApi.getSelectedItems).mock.calls.length;

      // Advance time significantly
      await act(async () => {
        await vi.advanceTimersByTimeAsync(2000);
      });

      // Should still be same number of calls (no polling)
      expect(eagleApi.getSelectedItems).toHaveBeenCalledTimes(callsAfterInit);
    });

    it('uses custom polling interval', async () => {
      vi.mocked(eagleApi.getSelectedItems).mockResolvedValue([]);

      renderHook(() => useEagleSelection({ pollingInterval: 1000 }));

      await act(async () => {
        await Promise.resolve();
      });

      const callsAfterInit = vi.mocked(eagleApi.getSelectedItems).mock.calls.length;

      // At 500ms, should not have polled yet
      await act(async () => {
        await vi.advanceTimersByTimeAsync(500);
      });

      expect(eagleApi.getSelectedItems).toHaveBeenCalledTimes(callsAfterInit);

      // At 1000ms, should poll
      await act(async () => {
        await vi.advanceTimersByTimeAsync(500);
      });

      expect(eagleApi.getSelectedItems).toHaveBeenCalledTimes(callsAfterInit + 1);
    });

    it('updates items on poll', async () => {
      // First call returns empty
      vi.mocked(eagleApi.getSelectedItems).mockResolvedValueOnce([]);

      // Second call returns items
      const newItems = createMockItems(5);
      vi.mocked(eagleApi.getSelectedItems).mockResolvedValue(newItems);

      const { result } = renderHook(() => useEagleSelection());

      // Wait for initial fetch to complete
      await act(async () => {
        await Promise.resolve();
        await Promise.resolve(); // Extra tick for state update
      });

      // Items should be empty or new depending on timing
      // Trigger poll to definitely get new items
      await act(async () => {
        await vi.advanceTimersByTimeAsync(500);
      });

      expect(result.current.items).toEqual(newItems);
    });
  });

  describe('startPolling and stopPolling', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('stopPolling stops the polling', async () => {
      vi.mocked(eagleApi.getSelectedItems).mockResolvedValue([]);

      const { result } = renderHook(() => useEagleSelection());

      // Wait for initial fetch
      await act(async () => {
        await Promise.resolve();
      });

      // Stop polling immediately
      act(() => {
        result.current.stopPolling();
      });

      // Record calls after stopping
      const callsAfterStop = vi.mocked(eagleApi.getSelectedItems).mock.calls.length;

      // Advance time significantly
      await act(async () => {
        await vi.advanceTimersByTimeAsync(2000);
      });

      // Should not have additional calls after stopping
      expect(eagleApi.getSelectedItems).toHaveBeenCalledTimes(callsAfterStop);
    });

    it('startPolling resumes polling', async () => {
      vi.mocked(eagleApi.getSelectedItems).mockResolvedValue([]);

      const { result } = renderHook(() => useEagleSelection({ autoStart: false }));

      // Wait for initial fetch
      await act(async () => {
        await Promise.resolve();
      });

      const callsAfterInit = vi.mocked(eagleApi.getSelectedItems).mock.calls.length;

      // Start polling
      act(() => {
        result.current.startPolling();
      });

      // Advance past interval
      await act(async () => {
        await vi.advanceTimersByTimeAsync(500);
      });

      // Should have more calls
      expect(vi.mocked(eagleApi.getSelectedItems).mock.calls.length).toBeGreaterThan(
        callsAfterInit
      );
    });
  });

  describe('manual refresh', () => {
    it('refresh fetches items immediately', async () => {
      vi.mocked(eagleApi.getSelectedItems).mockResolvedValue([]);

      const { result } = renderHook(() => useEagleSelection({ autoStart: false }));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(eagleApi.getSelectedItems).toHaveBeenCalledTimes(1);

      const newItems = createMockItems(3);
      vi.mocked(eagleApi.getSelectedItems).mockResolvedValue(newItems);

      await act(async () => {
        await result.current.refresh();
      });

      expect(result.current.items).toEqual(newItems);
      expect(eagleApi.getSelectedItems).toHaveBeenCalledTimes(2);
    });

    it('refresh clears previous error', async () => {
      // First call fails
      vi.mocked(eagleApi.getSelectedItems).mockRejectedValueOnce(new Error('fail'));

      const { result } = renderHook(() => useEagleSelection({ autoStart: false }));

      await waitFor(() => {
        expect(result.current.error).not.toBeNull();
      });

      // Second call succeeds
      vi.mocked(eagleApi.getSelectedItems).mockResolvedValue([]);

      await act(async () => {
        await result.current.refresh();
      });

      expect(result.current.error).toBeNull();
    });
  });

  describe('cleanup', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('clears interval on unmount', async () => {
      vi.mocked(eagleApi.getSelectedItems).mockResolvedValue([]);

      const { unmount } = renderHook(() => useEagleSelection());

      // Wait for initial fetch
      await act(async () => {
        await Promise.resolve();
      });

      const callsBeforeUnmount = vi.mocked(eagleApi.getSelectedItems).mock.calls.length;

      unmount();

      // Advance time after unmount
      await act(async () => {
        await vi.advanceTimersByTimeAsync(2000);
      });

      // Should not have additional calls after unmount
      expect(eagleApi.getSelectedItems).toHaveBeenCalledTimes(callsBeforeUnmount);
    });
  });

  describe('test scenarios', () => {
    it('handles empty selection', async () => {
      vi.mocked(eagleApi.getSelectedItems).mockResolvedValue([]);

      const { result } = renderHook(() => useEagleSelection({ autoStart: false }));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.items).toHaveLength(0);
    });

    it('handles single item selection', async () => {
      vi.mocked(eagleApi.getSelectedItems).mockResolvedValue(createMockItems(1));

      const { result } = renderHook(() => useEagleSelection({ autoStart: false }));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.items).toHaveLength(1);
    });

    it('handles multiple items selection', async () => {
      vi.mocked(eagleApi.getSelectedItems).mockResolvedValue(createMockItems(5));

      const { result } = renderHook(() => useEagleSelection({ autoStart: false }));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.items).toHaveLength(5);
    });

    it('handles large selection', async () => {
      vi.mocked(eagleApi.getSelectedItems).mockResolvedValue(createMockItems(100));

      const { result } = renderHook(() => useEagleSelection({ autoStart: false }));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.items).toHaveLength(100);
    });
  });

  describe('hash-based change detection', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('does not update state when selection has not changed', async () => {
      const mockItems = createMockItems(2);
      vi.mocked(eagleApi.getSelectedItems).mockResolvedValue(mockItems);

      const { result } = renderHook(() => useEagleSelection());

      // Wait for initial fetch
      await act(async () => {
        await Promise.resolve();
      });

      // Capture initial items reference
      const initialItems = result.current.items;
      expect(initialItems).toHaveLength(2);

      // Return same items on next poll
      await act(async () => {
        await vi.advanceTimersByTimeAsync(500);
      });

      // Items should be the same reference (no state update)
      expect(result.current.items).toBe(initialItems);
    });

    it('updates state when selection changes', async () => {
      const initialItems = createMockItems(2);
      vi.mocked(eagleApi.getSelectedItems).mockResolvedValue(initialItems);

      const { result } = renderHook(() => useEagleSelection());

      // Wait for initial fetch
      await act(async () => {
        await Promise.resolve();
      });

      expect(result.current.items).toHaveLength(2);

      // Return different items on next poll
      const newItems = createMockItems(3);
      vi.mocked(eagleApi.getSelectedItems).mockResolvedValue(newItems);

      await act(async () => {
        await vi.advanceTimersByTimeAsync(500);
      });

      // Items should be updated
      expect(result.current.items).toHaveLength(3);
      expect(result.current.items).toEqual(newItems);
    });

    it('detects change from empty to items', async () => {
      vi.mocked(eagleApi.getSelectedItems).mockResolvedValue([]);

      const { result } = renderHook(() => useEagleSelection());

      await act(async () => {
        await Promise.resolve();
      });

      expect(result.current.items).toHaveLength(0);

      // Return items on next poll
      const newItems = createMockItems(3);
      vi.mocked(eagleApi.getSelectedItems).mockResolvedValue(newItems);

      await act(async () => {
        await vi.advanceTimersByTimeAsync(500);
      });

      expect(result.current.items).toHaveLength(3);
    });

    it('detects change from items to empty', async () => {
      const initialItems = createMockItems(2);
      vi.mocked(eagleApi.getSelectedItems).mockResolvedValue(initialItems);

      const { result } = renderHook(() => useEagleSelection());

      await act(async () => {
        await Promise.resolve();
      });

      expect(result.current.items).toHaveLength(2);

      // Return empty on next poll
      vi.mocked(eagleApi.getSelectedItems).mockResolvedValue([]);

      await act(async () => {
        await vi.advanceTimersByTimeAsync(500);
      });

      expect(result.current.items).toHaveLength(0);
    });

    it('forceRefresh always updates state', async () => {
      const mockItems = createMockItems(2);
      vi.mocked(eagleApi.getSelectedItems).mockResolvedValue(mockItems);

      const { result } = renderHook(() => useEagleSelection({ autoStart: false }));

      await act(async () => {
        await Promise.resolve();
      });

      // Force refresh with same data should still update
      await act(async () => {
        await result.current.forceRefresh();
      });

      // forceRefresh updates even with same data
      expect(eagleApi.getSelectedItems).toHaveBeenCalledTimes(2);
    });
  });

  describe('visibility-aware polling', () => {
    let hiddenDescriptor: PropertyDescriptor | undefined;
    let visibilityListeners: Array<EventListener>;

    beforeEach(() => {
      vi.useFakeTimers();
      visibilityListeners = [];

      // Mock document.hidden
      hiddenDescriptor = Object.getOwnPropertyDescriptor(document, 'hidden');
      Object.defineProperty(document, 'hidden', {
        configurable: true,
        get: () => false,
      });

      // Mock addEventListener to capture visibility change listeners
      vi.spyOn(document, 'addEventListener').mockImplementation((event, handler) => {
        if (event === 'visibilitychange' && typeof handler === 'function') {
          visibilityListeners.push(handler as EventListener);
        }
      });
      vi.spyOn(document, 'removeEventListener').mockImplementation(() => {});
    });

    afterEach(() => {
      vi.useRealTimers();
      if (hiddenDescriptor) {
        Object.defineProperty(document, 'hidden', hiddenDescriptor);
      } else {
        // Restore to default behavior
        Object.defineProperty(document, 'hidden', {
          configurable: true,
          get: () => false,
        });
      }
      vi.restoreAllMocks();
    });

    it('pauses polling when document becomes hidden', async () => {
      vi.mocked(eagleApi.getSelectedItems).mockResolvedValue([]);

      const { result } = renderHook(() => useEagleSelection({ pauseOnHidden: true }));

      await act(async () => {
        await Promise.resolve();
      });

      const callsAfterInit = vi.mocked(eagleApi.getSelectedItems).mock.calls.length;

      // Simulate document becoming hidden
      Object.defineProperty(document, 'hidden', {
        configurable: true,
        get: () => true,
      });

      // Trigger visibility change
      act(() => {
        visibilityListeners.forEach((listener) => listener(new Event('visibilitychange')));
      });

      expect(result.current.isPaused).toBe(true);

      // Advance time
      await act(async () => {
        await vi.advanceTimersByTimeAsync(2000);
      });

      // Should not have polled while hidden
      expect(eagleApi.getSelectedItems).toHaveBeenCalledTimes(callsAfterInit);
    });

    it('resumes polling when document becomes visible', async () => {
      vi.mocked(eagleApi.getSelectedItems).mockResolvedValue([]);

      const { result } = renderHook(() => useEagleSelection({ pauseOnHidden: true }));

      await act(async () => {
        await Promise.resolve();
      });

      // Simulate hiding
      Object.defineProperty(document, 'hidden', {
        configurable: true,
        get: () => true,
      });
      act(() => {
        visibilityListeners.forEach((listener) => listener(new Event('visibilitychange')));
      });

      expect(result.current.isPaused).toBe(true);

      // Record calls while hidden
      const callsWhileHidden = vi.mocked(eagleApi.getSelectedItems).mock.calls.length;

      // Simulate becoming visible
      Object.defineProperty(document, 'hidden', {
        configurable: true,
        get: () => false,
      });
      await act(async () => {
        visibilityListeners.forEach((listener) => listener(new Event('visibilitychange')));
        await Promise.resolve();
      });

      expect(result.current.isPaused).toBe(false);

      // Should have refreshed immediately on visibility
      expect(vi.mocked(eagleApi.getSelectedItems).mock.calls.length).toBeGreaterThan(
        callsWhileHidden
      );
    });

    it('does not pause when pauseOnHidden is false', async () => {
      vi.mocked(eagleApi.getSelectedItems).mockResolvedValue([]);

      const { result } = renderHook(() => useEagleSelection({ pauseOnHidden: false }));

      await act(async () => {
        await Promise.resolve();
      });

      const callsAfterInit = vi.mocked(eagleApi.getSelectedItems).mock.calls.length;

      // Simulate document becoming hidden
      Object.defineProperty(document, 'hidden', {
        configurable: true,
        get: () => true,
      });

      // Advance time - should still poll
      await act(async () => {
        await vi.advanceTimersByTimeAsync(500);
      });

      // Should have continued polling
      expect(vi.mocked(eagleApi.getSelectedItems).mock.calls.length).toBeGreaterThan(
        callsAfterInit
      );
      expect(result.current.isPaused).toBe(false);
    });

    it('returns isPaused state', async () => {
      vi.mocked(eagleApi.getSelectedItems).mockResolvedValue([]);

      const { result } = renderHook(() => useEagleSelection({ pauseOnHidden: true }));

      await act(async () => {
        await Promise.resolve();
      });

      // Initially not paused
      expect(result.current.isPaused).toBe(false);
    });
  });

  describe('forceRefresh vs refresh', () => {
    it('exposes forceRefresh method', async () => {
      vi.mocked(eagleApi.getSelectedItems).mockResolvedValue([]);

      const { result } = renderHook(() => useEagleSelection({ autoStart: false }));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(typeof result.current.forceRefresh).toBe('function');
    });

    it('refresh and forceRefresh both fetch items', async () => {
      vi.mocked(eagleApi.getSelectedItems).mockResolvedValue([]);

      const { result } = renderHook(() => useEagleSelection({ autoStart: false }));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      const callsAfterInit = vi.mocked(eagleApi.getSelectedItems).mock.calls.length;

      await act(async () => {
        await result.current.refresh();
      });

      expect(vi.mocked(eagleApi.getSelectedItems).mock.calls.length).toBe(callsAfterInit + 1);

      await act(async () => {
        await result.current.forceRefresh();
      });

      expect(vi.mocked(eagleApi.getSelectedItems).mock.calls.length).toBe(callsAfterInit + 2);
    });
  });
});
