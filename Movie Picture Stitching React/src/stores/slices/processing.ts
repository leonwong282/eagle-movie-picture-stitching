/**
 * Processing Slice
 *
 * Manages batch processing state for multi-item operations.
 * Tracks progress, results, and supports cancellation.
 */

import type { StateCreator } from 'zustand';
import type { PluginStore, ProcessingSlice, ProcessResult, ProcessingStatus } from '../types';

/**
 * Initial state for processing slice
 */
export const initialProcessingState = {
  status: 'idle' as ProcessingStatus,
  progress: 0,
  currentItemId: null,
  currentItemName: null,
  totalItems: 0,
  completedItems: 0,
  results: [] as ProcessResult[],
  startedAt: null,
  cancelRequested: false,
};

/**
 * Create processing slice
 */
export const createProcessingSlice: StateCreator<
  PluginStore,
  [],
  [],
  { processing: ProcessingSlice }
> = (set, get) => ({
  processing: {
    ...initialProcessingState,

    startProcessing: (itemIds) => {
      set((state) => ({
        processing: {
          ...state.processing,
          status: 'preparing',
          progress: 0,
          currentItemId: null,
          currentItemName: null,
          totalItems: itemIds.length,
          completedItems: 0,
          results: [],
          startedAt: Date.now(),
          cancelRequested: false,
        },
      }));

      // Transition to processing after preparation
      setTimeout(() => {
        const { processing } = get();
        if (processing.status === 'preparing' && !processing.cancelRequested) {
          set((state) => ({
            processing: {
              ...state.processing,
              status: 'processing',
            },
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
      set((state) => ({
        processing: {
          ...state.processing,
          ...initialProcessingState,
        },
      }));
    },
  },
});

/**
 * Helper to check if processing can be started
 */
export function canStartProcessing(state: ProcessingSlice): boolean {
  return (
    state.status === 'idle' ||
    state.status === 'complete' ||
    state.status === 'error' ||
    state.status === 'cancelled'
  );
}

/**
 * Helper to get processing duration
 */
export function getProcessingDuration(state: ProcessingSlice): number {
  if (!state.startedAt) return 0;
  return Date.now() - state.startedAt;
}

/**
 * Helper to get success/failure counts
 */
export function getProcessingStats(state: ProcessingSlice): {
  success: number;
  failed: number;
  total: number;
  successRate: number;
} {
  const success = state.results.filter((r) => r.success).length;
  const failed = state.results.filter((r) => !r.success).length;
  const total = state.results.length;
  return {
    success,
    failed,
    total,
    successRate: total > 0 ? Math.round((success / total) * 100) : 0,
  };
}
