import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from './useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('initialization', () => {
    it('returns default value when storage is empty', () => {
      const { result } = renderHook(() => useLocalStorage('test-key', { defaultValue: 'default' }));

      expect(result.current[0]).toBe('default');
    });

    it('returns stored value when exists', () => {
      localStorage.setItem('eagle-react-template:existing-key', JSON.stringify('stored-value'));

      const { result } = renderHook(() =>
        useLocalStorage('existing-key', { defaultValue: 'default' })
      );

      expect(result.current[0]).toBe('stored-value');
    });

    it('works with object values', () => {
      const defaultObj = { name: 'test', count: 0 };
      const { result } = renderHook(() =>
        useLocalStorage('object-key', { defaultValue: defaultObj })
      );

      expect(result.current[0]).toEqual(defaultObj);
    });

    it('works with array values', () => {
      const defaultArr = [1, 2, 3];
      const { result } = renderHook(() =>
        useLocalStorage('array-key', { defaultValue: defaultArr })
      );

      expect(result.current[0]).toEqual(defaultArr);
    });

    it('validates stored value and returns default if invalid', () => {
      localStorage.setItem('eagle-react-template:validated-key', JSON.stringify(-5));

      const { result } = renderHook(() =>
        useLocalStorage('validated-key', {
          defaultValue: 10,
          validate: (v): v is number => typeof v === 'number' && v >= 0,
        })
      );

      expect(result.current[0]).toBe(10);
    });
  });

  describe('setValue', () => {
    it('updates state immediately', () => {
      const { result } = renderHook(() =>
        useLocalStorage('update-key', { defaultValue: 'initial' })
      );

      act(() => {
        result.current[1]('updated');
      });

      expect(result.current[0]).toBe('updated');
    });

    it('supports functional update', () => {
      const { result } = renderHook(() => useLocalStorage('counter', { defaultValue: 0 }));

      act(() => {
        result.current[1]((prev) => prev + 1);
      });

      expect(result.current[0]).toBe(1);

      act(() => {
        result.current[1]((prev) => prev + 10);
      });

      expect(result.current[0]).toBe(11);
    });

    it('persists to localStorage after debounce', async () => {
      const { result } = renderHook(() =>
        useLocalStorage('persist-key', { defaultValue: 'initial', debounceMs: 300 })
      );

      act(() => {
        result.current[1]('new-value');
      });

      // Before debounce, storage should not be updated
      expect(localStorage.getItem('eagle-react-template:persist-key')).toBeNull();

      // Advance timers past debounce
      await act(async () => {
        vi.advanceTimersByTime(300);
      });

      expect(localStorage.getItem('eagle-react-template:persist-key')).toBe(
        JSON.stringify('new-value')
      );
    });

    it('debounces multiple rapid updates', async () => {
      const { result } = renderHook(() =>
        useLocalStorage('debounce-key', { defaultValue: 0, debounceMs: 300 })
      );

      // Rapid updates
      act(() => {
        result.current[1](1);
        result.current[1](2);
        result.current[1](3);
      });

      expect(result.current[0]).toBe(3); // State updated immediately

      // Advance timers
      await act(async () => {
        vi.advanceTimersByTime(300);
      });

      // Only final value should be in storage
      expect(localStorage.getItem('eagle-react-template:debounce-key')).toBe(JSON.stringify(3));
    });

    it('works with object updates', async () => {
      interface Settings {
        theme: string;
        count: number;
      }

      const { result } = renderHook(() =>
        useLocalStorage<Settings>('settings', {
          defaultValue: { theme: 'light', count: 0 },
        })
      );

      act(() => {
        result.current[1]({ theme: 'dark', count: 5 });
      });

      expect(result.current[0]).toEqual({ theme: 'dark', count: 5 });
    });
  });

  describe('reset', () => {
    it('resets to default value', async () => {
      const { result } = renderHook(() =>
        useLocalStorage('reset-key', { defaultValue: 'default' })
      );

      // Set a new value
      act(() => {
        result.current[1]('modified');
      });

      expect(result.current[0]).toBe('modified');

      // Reset
      act(() => {
        result.current[2](); // reset function is the third element
      });

      expect(result.current[0]).toBe('default');
    });

    it('persists default value immediately (no debounce)', async () => {
      const { result } = renderHook(() =>
        useLocalStorage('reset-persist-key', { defaultValue: 'default', debounceMs: 300 })
      );

      // Set a value and wait for debounce
      act(() => {
        result.current[1]('modified');
      });

      await act(async () => {
        vi.advanceTimersByTime(300);
      });

      // Reset
      act(() => {
        result.current[2]();
      });

      // Reset should persist immediately (setStorageItem is called directly)
      expect(localStorage.getItem('eagle-react-template:reset-persist-key')).toBe(
        JSON.stringify('default')
      );
    });
  });

  describe('custom debounce', () => {
    it('respects custom debounce delay', async () => {
      const { result } = renderHook(() =>
        useLocalStorage('custom-debounce', { defaultValue: 0, debounceMs: 1000 })
      );

      act(() => {
        result.current[1](42);
      });

      // Advance less than debounce time
      await act(async () => {
        vi.advanceTimersByTime(500);
      });

      expect(localStorage.getItem('eagle-react-template:custom-debounce')).toBeNull();

      // Advance past debounce time
      await act(async () => {
        vi.advanceTimersByTime(500);
      });

      expect(localStorage.getItem('eagle-react-template:custom-debounce')).toBe(JSON.stringify(42));
    });

    it('uses default 300ms debounce when not specified', async () => {
      const { result } = renderHook(() =>
        useLocalStorage('default-debounce', { defaultValue: 'test' })
      );

      act(() => {
        result.current[1]('updated');
      });

      // Just before 300ms
      await act(async () => {
        vi.advanceTimersByTime(299);
      });

      expect(localStorage.getItem('eagle-react-template:default-debounce')).toBeNull();

      // At 300ms
      await act(async () => {
        vi.advanceTimersByTime(1);
      });

      expect(localStorage.getItem('eagle-react-template:default-debounce')).toBe(
        JSON.stringify('updated')
      );
    });
  });

  describe('type safety', () => {
    it('preserves boolean types', () => {
      localStorage.setItem('eagle-react-template:bool-key', JSON.stringify(true));

      const { result } = renderHook(() => useLocalStorage('bool-key', { defaultValue: false }));

      expect(result.current[0]).toBe(true);
      expect(typeof result.current[0]).toBe('boolean');
    });

    it('preserves number types', () => {
      localStorage.setItem('eagle-react-template:num-key', JSON.stringify(42.5));

      const { result } = renderHook(() => useLocalStorage('num-key', { defaultValue: 0 }));

      expect(result.current[0]).toBe(42.5);
      expect(typeof result.current[0]).toBe('number');
    });

    it('preserves null values', () => {
      localStorage.setItem('eagle-react-template:null-key', JSON.stringify(null));

      const { result } = renderHook(() =>
        useLocalStorage<string | null>('null-key', { defaultValue: 'not-null' })
      );

      expect(result.current[0]).toBeNull();
    });
  });

  describe('edge cases', () => {
    it('handles empty string values', () => {
      localStorage.setItem('eagle-react-template:empty-string', JSON.stringify(''));

      const { result } = renderHook(() =>
        useLocalStorage('empty-string', { defaultValue: 'default' })
      );

      expect(result.current[0]).toBe('');
    });

    it('handles zero values', () => {
      localStorage.setItem('eagle-react-template:zero', JSON.stringify(0));

      const { result } = renderHook(() => useLocalStorage('zero', { defaultValue: 100 }));

      expect(result.current[0]).toBe(0);
    });

    it('handles nested object structures', () => {
      const complex = {
        level1: {
          level2: {
            value: 'deep',
          },
        },
        array: [{ id: 1 }, { id: 2 }],
      };

      const { result } = renderHook(() => useLocalStorage('complex', { defaultValue: complex }));

      expect(result.current[0]).toEqual(complex);
    });
  });
});
