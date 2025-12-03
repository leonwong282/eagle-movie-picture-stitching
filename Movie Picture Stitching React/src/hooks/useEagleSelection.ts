import { useState, useEffect, useCallback, useRef } from 'react';
import { eagleApi } from '@/lib/eagle-api';
import type { Item } from '@/types/eagle';

interface UseEagleSelectionOptions {
  /** Polling interval in milliseconds (default: 500) */
  pollingInterval?: number;
  /** Whether to start polling immediately (default: true) */
  autoStart?: boolean;
  /** Whether to pause polling when document is hidden (default: true) */
  pauseOnHidden?: boolean;
}

interface UseEagleSelectionReturn {
  /** Currently selected items */
  items: Item[];
  /** Whether data is loading */
  isLoading: boolean;
  /** Error if any */
  error: Error | null;
  /** Manually refresh selection (skips hash check) */
  refresh: () => Promise<void>;
  /** Force refresh that bypasses hash comparison */
  forceRefresh: () => Promise<void>;
  /** Start polling */
  startPolling: () => void;
  /** Stop polling */
  stopPolling: () => void;
  /** Whether polling is currently paused due to visibility */
  isPaused: boolean;
}

/**
 * Compute a hash from item IDs for efficient change detection
 * Uses ID concatenation - fast and sufficient for comparison
 */
function computeSelectionHash(items: Item[]): string {
  if (items.length === 0) return '';
  return items.map((item) => item.id).join(',');
}

/**
 * Hook to track Eagle's currently selected items
 *
 * Optimizations:
 * - Hash-based change detection: Only updates state when selection actually changes
 * - Visibility-aware polling: Pauses when document is hidden to save CPU
 * - Eagle event integration: Listens to onPluginShow/onPluginHide
 *
 * Note: For shared state across components, use the Zustand store directly:
 * import { useSelection } from '@/stores';
 */
export function useEagleSelection(options: UseEagleSelectionOptions = {}): UseEagleSelectionReturn {
  const { pollingInterval = 500, autoStart = true, pauseOnHidden = true } = options;

  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isPolling, setIsPolling] = useState(autoStart);
  const [isPaused, setIsPaused] = useState(false);

  // Hash of current selection for change detection
  const lastHashRef = useRef<string>('');
  // Interval ID ref for cleanup
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /**
   * Internal refresh that uses hash comparison
   * Only updates state if selection has changed
   */
  const refreshWithHashCheck = useCallback(async () => {
    try {
      const selected = await eagleApi.getSelectedItems();
      const newHash = computeSelectionHash(selected);

      // Only update state if selection has changed
      if (newHash !== lastHashRef.current) {
        lastHashRef.current = newHash;
        setItems(selected);
      }
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to get selected items'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Force refresh that bypasses hash comparison
   * Useful when you need to ensure fresh data
   */
  const forceRefresh = useCallback(async () => {
    try {
      const selected = await eagleApi.getSelectedItems();
      lastHashRef.current = computeSelectionHash(selected);
      setItems(selected);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to get selected items'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Public refresh always forces update (backward compatible behavior)
  const refresh = forceRefresh;

  const startPolling = useCallback(() => {
    setIsPolling(true);
  }, []);

  const stopPolling = useCallback(() => {
    setIsPolling(false);
  }, []);

  /**
   * Start the polling interval
   */
  const startInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(refreshWithHashCheck, pollingInterval);
  }, [pollingInterval, refreshWithHashCheck]);

  /**
   * Stop the polling interval
   */
  const stopInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Main effect: Handle polling lifecycle
  useEffect(() => {
    // Initial fetch (always force to get initial state)
    forceRefresh();

    if (!isPolling) return;

    // Start polling
    startInterval();

    return () => {
      stopInterval();
    };
  }, [isPolling, forceRefresh, startInterval, stopInterval]);

  // Visibility-aware polling effect
  useEffect(() => {
    if (!pauseOnHidden || !isPolling) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Pause polling when hidden
        setIsPaused(true);
        stopInterval();
      } else {
        // Resume polling when visible
        setIsPaused(false);
        // Immediate refresh to catch up on any changes
        refreshWithHashCheck();
        startInterval();
      }
    };

    // Listen to browser visibility changes
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Set initial paused state based on current visibility
    if (document.hidden) {
      setIsPaused(true);
      stopInterval();
    }

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [pauseOnHidden, isPolling, refreshWithHashCheck, startInterval, stopInterval]);

  // Eagle plugin visibility events (additional layer of visibility detection)
  useEffect(() => {
    if (!pauseOnHidden || !isPolling) return;

    // Try to register Eagle's plugin visibility events
    const raw = eagleApi.raw;

    const handlePluginHide = () => {
      setIsPaused(true);
      stopInterval();
    };

    const handlePluginShow = () => {
      setIsPaused(false);
      refreshWithHashCheck();
      startInterval();
    };

    // Register Eagle events if available
    if (raw?.event?.onPluginHide) {
      raw.event.onPluginHide(handlePluginHide);
    }
    if (raw?.event?.onPluginShow) {
      raw.event.onPluginShow(handlePluginShow);
    }

    // Note: Eagle events don't provide unsubscribe, but they're scoped to plugin lifecycle
  }, [pauseOnHidden, isPolling, refreshWithHashCheck, startInterval, stopInterval]);

  return {
    items,
    isLoading,
    error,
    refresh,
    forceRefresh,
    startPolling,
    stopPolling,
    isPaused,
  };
}

export default useEagleSelection;
