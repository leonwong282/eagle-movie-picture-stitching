import { useState, useCallback, useRef } from 'react';
import { debounce } from '@/lib/utils';
import { getStorageItem, setStorageItem, type StorageOptions } from '@/lib/storage';

interface UseLocalStorageOptions<T> extends Omit<StorageOptions<T>, 'key'> {
  /** Debounce delay for writes (default: 300ms) */
  debounceMs?: number;
}

type UseLocalStorageReturn<T> = [
  T,
  (value: T | ((prev: T) => T)) => void,
  () => void, // reset to default
];

/**
 * Hook to sync state with localStorage
 */
export function useLocalStorage<T>(
  key: string,
  options: UseLocalStorageOptions<T>
): UseLocalStorageReturn<T> {
  const { defaultValue, validate, debounceMs = 300 } = options;

  // Initialize state from storage
  const [value, setValue] = useState<T>(() => getStorageItem({ key, defaultValue, validate }));

  // Create debounced save function
  const saveToStorage = useRef(
    debounce((val: T) => {
      setStorageItem(key, val);
    }, debounceMs)
  );

  // Update state and storage
  const updateValue = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved =
          typeof newValue === 'function' ? (newValue as (prev: T) => T)(prev) : newValue;
        saveToStorage.current(resolved);
        return resolved;
      });
    },
    [] // key is stable, saveToStorage.current handles the key internally
  );

  // Reset to default
  const reset = useCallback(() => {
    setValue(defaultValue);
    setStorageItem(key, defaultValue);
  }, [key, defaultValue]);

  return [value, updateValue, reset];
}

export default useLocalStorage;
