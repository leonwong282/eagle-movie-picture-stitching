/**
 * Selection Slice
 *
 * Manages Eagle's currently selected items with polling support.
 * Integrates with the Eagle API for real-time selection tracking.
 */

import type { StateCreator } from 'zustand';
import type { PluginStore, SelectionSlice } from '../types';
import { eagleApi } from '@/lib/eagle-api';

/**
 * Initial state for selection slice
 */
export const initialSelectionState = {
  items: [],
  isLoading: true,
  error: null,
  lastUpdated: 0,
  isPolling: false,
  isPaused: false,
};

/**
 * Compute a hash from item IDs for efficient change detection
 */
function computeSelectionHash(items: { id: string }[]): string {
  if (items.length === 0) return '';
  return items.map((item) => item.id).join(',');
}

// Module-level polling state
let pollingInterval: ReturnType<typeof setInterval> | null = null;
let lastHash = '';
let pollingIntervalMs = 500;

/**
 * Create selection slice
 */
export const createSelectionSlice: StateCreator<
  PluginStore,
  [],
  [],
  { selection: SelectionSlice }
> = (set, get) => ({
  selection: {
    ...initialSelectionState,

    setItems: (items) => {
      set((state) => ({
        selection: {
          ...state.selection,
          items,
          lastUpdated: Date.now(),
        },
      }));
    },

    setLoading: (loading) => {
      set((state) => ({
        selection: {
          ...state.selection,
          isLoading: loading,
        },
      }));
    },

    setError: (error) => {
      set((state) => ({
        selection: {
          ...state.selection,
          error,
          isLoading: false,
        },
      }));
    },

    refreshSelection: async () => {
      try {
        const items = await eagleApi.getSelectedItems();
        const newHash = computeSelectionHash(items);

        // Only update if selection has changed
        if (newHash !== lastHash) {
          lastHash = newHash;
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
          // Just clear loading state if no change
          set((state) => ({
            selection: {
              ...state.selection,
              isLoading: false,
            },
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
      const { selection } = get();
      if (selection.isPolling) return;

      // Initial fetch
      selection.refreshSelection();

      // Start interval
      pollingInterval = setInterval(() => {
        const { selection: currentSelection } = get();
        if (!currentSelection.isPaused) {
          currentSelection.refreshSelection();
        }
      }, pollingIntervalMs);

      set((state) => ({
        selection: {
          ...state.selection,
          isPolling: true,
        },
      }));

      // Set up visibility handlers
      const handleVisibilityChange = () => {
        const { selection: sel } = get();
        if (document.hidden) {
          sel.setPaused(true);
        } else {
          sel.setPaused(false);
          sel.refreshSelection();
        }
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);
    },

    stopPolling: () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
        pollingInterval = null;
      }

      set((state) => ({
        selection: {
          ...state.selection,
          isPolling: false,
          isPaused: false,
        },
      }));
    },

    setPaused: (paused) => {
      set((state) => ({
        selection: {
          ...state.selection,
          isPaused: paused,
        },
      }));
    },
  },
});

/**
 * Set the polling interval (call before startPolling)
 */
export function setPollingInterval(ms: number): void {
  pollingIntervalMs = ms;
}
