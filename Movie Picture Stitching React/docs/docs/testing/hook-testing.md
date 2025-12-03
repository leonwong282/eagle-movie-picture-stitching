# Hook Testing

Custom hooks encapsulate reusable logic and require special testing patterns. The Eagle React Template uses `renderHook` from **@testing-library/react** to test hooks in isolation.

## Basic Hook Testing

### Using renderHook

```typescript
import { renderHook, act } from '@testing-library/react';
import { useState } from 'react';

// Simple custom hook
function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);
  
  const increment = () => setCount(c => c + 1);
  const decrement = () => setCount(c => c - 1);
  const reset = () => setCount(initialValue);
  
  return { count, increment, decrement, reset };
}

describe('useCounter', () => {
  it('initializes with default value', () => {
    const { result } = renderHook(() => useCounter());
    expect(result.current.count).toBe(0);
  });

  it('initializes with custom value', () => {
    const { result } = renderHook(() => useCounter(10));
    expect(result.current.count).toBe(10);
  });

  it('increments count', () => {
    const { result } = renderHook(() => useCounter());
    
    act(() => {
      result.current.increment();
    });
    
    expect(result.current.count).toBe(1);
  });

  it('decrements count', () => {
    const { result } = renderHook(() => useCounter(5));
    
    act(() => {
      result.current.decrement();
    });
    
    expect(result.current.count).toBe(4);
  });

  it('resets to initial value', () => {
    const { result } = renderHook(() => useCounter(10));
    
    act(() => {
      result.current.increment();
      result.current.increment();
    });
    
    expect(result.current.count).toBe(12);
    
    act(() => {
      result.current.reset();
    });
    
    expect(result.current.count).toBe(10);
  });
});
```

## Testing useLocalStorage

```typescript title="src/hooks/useLocalStorage.test.ts"
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from './useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('returns initial value when localStorage is empty', () => {
    const { result } = renderHook(() => 
      useLocalStorage('testKey', 'defaultValue')
    );
    
    expect(result.current[0]).toBe('defaultValue');
  });

  it('returns stored value from localStorage', () => {
    localStorage.setItem(
      'eagle-react-template:existingKey',
      JSON.stringify('storedValue')
    );
    
    const { result } = renderHook(() => 
      useLocalStorage('existingKey', 'defaultValue')
    );
    
    expect(result.current[0]).toBe('storedValue');
  });

  it('updates localStorage when setValue is called', () => {
    const { result } = renderHook(() => 
      useLocalStorage('testKey', 'initial')
    );
    
    act(() => {
      result.current[1]('updated');
    });
    
    expect(result.current[0]).toBe('updated');
    expect(localStorage.getItem('eagle-react-template:testKey'))
      .toBe(JSON.stringify('updated'));
  });

  it('handles complex objects', () => {
    const initialValue = { nested: { value: [1, 2, 3] } };
    
    const { result } = renderHook(() => 
      useLocalStorage('objectKey', initialValue)
    );
    
    expect(result.current[0]).toEqual(initialValue);
    
    act(() => {
      result.current[1]({ nested: { value: [4, 5, 6] } });
    });
    
    expect(result.current[0]).toEqual({ nested: { value: [4, 5, 6] } });
  });

  it('handles function updates', () => {
    const { result } = renderHook(() => 
      useLocalStorage('countKey', 0)
    );
    
    act(() => {
      result.current[1](prev => prev + 1);
    });
    
    expect(result.current[0]).toBe(1);
    
    act(() => {
      result.current[1](prev => prev + 1);
    });
    
    expect(result.current[0]).toBe(2);
  });

  it('handles localStorage parse errors gracefully', () => {
    localStorage.setItem('eagle-react-template:corruptKey', 'invalid json');
    
    const { result } = renderHook(() => 
      useLocalStorage('corruptKey', 'fallback')
    );
    
    expect(result.current[0]).toBe('fallback');
  });

  it('syncs across hook instances', () => {
    const { result: result1 } = renderHook(() => 
      useLocalStorage('sharedKey', 'initial')
    );
    const { result: result2 } = renderHook(() => 
      useLocalStorage('sharedKey', 'initial')
    );
    
    act(() => {
      result1.current[1]('updated from instance 1');
    });
    
    // Note: Real sync requires storage event listener
    // This test verifies localStorage is updated
    expect(localStorage.getItem('eagle-react-template:sharedKey'))
      .toBe(JSON.stringify('updated from instance 1'));
  });
});
```

## Testing useTheme

```typescript title="src/hooks/useTheme.test.ts"
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTheme } from './useTheme';

// Mock matchMedia
const mockMatchMedia = (matches: boolean) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
};

describe('useTheme', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark', 'light');
    mockMatchMedia(false); // Default to light mode
  });

  it('returns light theme by default', () => {
    const { result } = renderHook(() => useTheme());
    
    expect(result.current.theme).toBe('light');
    expect(result.current.isDarkMode).toBe(false);
  });

  it('detects system dark mode preference', () => {
    mockMatchMedia(true); // System prefers dark
    
    const { result } = renderHook(() => useTheme());
    
    expect(result.current.theme).toBe('auto');
    expect(result.current.isDarkMode).toBe(true);
  });

  it('sets theme to dark', () => {
    const { result } = renderHook(() => useTheme());
    
    act(() => {
      result.current.setTheme('dark');
    });
    
    expect(result.current.theme).toBe('dark');
    expect(result.current.isDarkMode).toBe(true);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('sets theme to light', () => {
    mockMatchMedia(true);
    const { result } = renderHook(() => useTheme());
    
    act(() => {
      result.current.setTheme('light');
    });
    
    expect(result.current.theme).toBe('light');
    expect(result.current.isDarkMode).toBe(false);
    expect(document.documentElement.classList.contains('light')).toBe(true);
  });

  it('toggles theme', () => {
    const { result } = renderHook(() => useTheme());
    
    expect(result.current.isDarkMode).toBe(false);
    
    act(() => {
      result.current.toggleTheme();
    });
    
    expect(result.current.isDarkMode).toBe(true);
    
    act(() => {
      result.current.toggleTheme();
    });
    
    expect(result.current.isDarkMode).toBe(false);
  });

  it('persists theme to localStorage', () => {
    const { result } = renderHook(() => useTheme());
    
    act(() => {
      result.current.setTheme('dark');
    });
    
    expect(localStorage.getItem('eagle-react-template:theme'))
      .toBe(JSON.stringify('dark'));
  });

  it('loads persisted theme from localStorage', () => {
    localStorage.setItem(
      'eagle-react-template:theme',
      JSON.stringify('dark')
    );
    
    const { result } = renderHook(() => useTheme());
    
    expect(result.current.theme).toBe('dark');
  });
});
```

## Testing useEagleSelection

```typescript title="src/hooks/useEagleSelection.test.ts"
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useEagleSelection } from './useEagleSelection';

// Mock Eagle API
vi.mock('@/lib/eagle-api', () => ({
  eagleApi: {
    isMock: true,
    getSelectedItems: vi.fn(),
  },
  isEagleEnvironment: vi.fn().mockReturnValue(false),
}));

import { eagleApi } from '@/lib/eagle-api';

describe('useEagleSelection', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
    vi.mocked(eagleApi.getSelectedItems).mockResolvedValue([]);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns empty array initially', () => {
    const { result } = renderHook(() => useEagleSelection());
    
    expect(result.current.items).toEqual([]);
    expect(result.current.isLoading).toBe(true);
  });

  it('loads selected items', async () => {
    const mockItems = [
      { id: '1', name: 'test.png', ext: 'png' },
      { id: '2', name: 'test.jpg', ext: 'jpg' },
    ];
    vi.mocked(eagleApi.getSelectedItems).mockResolvedValue(mockItems);
    
    const { result } = renderHook(() => useEagleSelection({ autoStart: true }));
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    expect(result.current.items).toEqual(mockItems);
  });

  it('polls for updates at specified interval', async () => {
    const { result } = renderHook(() => 
      useEagleSelection({ pollingInterval: 500, autoStart: true })
    );
    
    await act(async () => {
      vi.advanceTimersByTime(500);
    });
    
    expect(eagleApi.getSelectedItems).toHaveBeenCalledTimes(2); // Initial + 1 poll
    
    await act(async () => {
      vi.advanceTimersByTime(500);
    });
    
    expect(eagleApi.getSelectedItems).toHaveBeenCalledTimes(3);
  });

  it('stops polling when stopPolling is called', async () => {
    const { result } = renderHook(() => 
      useEagleSelection({ pollingInterval: 500, autoStart: true })
    );
    
    await act(async () => {
      vi.advanceTimersByTime(500);
    });
    
    const callsBefore = vi.mocked(eagleApi.getSelectedItems).mock.calls.length;
    
    act(() => {
      result.current.stopPolling();
    });
    
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });
    
    expect(vi.mocked(eagleApi.getSelectedItems).mock.calls.length).toBe(callsBefore);
  });

  it('restarts polling when startPolling is called', async () => {
    const { result } = renderHook(() => 
      useEagleSelection({ autoStart: false })
    );
    
    expect(result.current.isLoading).toBe(true);
    
    act(() => {
      result.current.startPolling();
    });
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    expect(eagleApi.getSelectedItems).toHaveBeenCalled();
  });

  it('pauses polling when document is hidden', async () => {
    const { result } = renderHook(() => 
      useEagleSelection({ pauseOnHidden: true, autoStart: true })
    );
    
    // Simulate document becoming hidden
    Object.defineProperty(document, 'hidden', { value: true, writable: true });
    document.dispatchEvent(new Event('visibilitychange'));
    
    const callsBefore = vi.mocked(eagleApi.getSelectedItems).mock.calls.length;
    
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });
    
    expect(result.current.isPaused).toBe(true);
    expect(vi.mocked(eagleApi.getSelectedItems).mock.calls.length).toBe(callsBefore);
    
    // Simulate document becoming visible
    Object.defineProperty(document, 'hidden', { value: false, writable: true });
    document.dispatchEvent(new Event('visibilitychange'));
    
    await act(async () => {
      vi.advanceTimersByTime(500);
    });
    
    expect(result.current.isPaused).toBe(false);
    expect(vi.mocked(eagleApi.getSelectedItems).mock.calls.length).toBeGreaterThan(callsBefore);
  });

  it('provides refresh function', async () => {
    const { result } = renderHook(() => useEagleSelection({ autoStart: false }));
    
    await act(async () => {
      await result.current.refresh();
    });
    
    expect(eagleApi.getSelectedItems).toHaveBeenCalled();
  });

  it('only updates state when selection changes', async () => {
    const mockItems = [{ id: '1', name: 'test.png', ext: 'png' }];
    vi.mocked(eagleApi.getSelectedItems).mockResolvedValue(mockItems);
    
    const { result } = renderHook(() => 
      useEagleSelection({ pollingInterval: 100, autoStart: true })
    );
    
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    
    const firstItems = result.current.items;
    
    // Same items returned - should not create new reference
    await act(async () => {
      vi.advanceTimersByTime(100);
    });
    
    expect(result.current.items).toBe(firstItems); // Same reference
  });
});
```

## Testing useLanguageSync

```typescript title="src/hooks/useLanguageSync.test.ts"
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLanguageSync } from './useLanguageSync';

// Mock i18n
const mockI18n = {
  language: 'en',
  changeLanguage: vi.fn(),
};

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    i18n: mockI18n,
  }),
}));

// Mock Eagle API
vi.mock('@/lib/eagle-api', () => ({
  eagleApi: {
    locale: 'en',
    onPluginShow: vi.fn((callback) => {
      // Store callback for testing
      (window as any).__onPluginShow = callback;
    }),
  },
}));

describe('useLanguageSync', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockI18n.language = 'en';
  });

  it('returns current language', () => {
    const { result } = renderHook(() => useLanguageSync());
    
    expect(result.current.language).toBe('en');
  });

  it('changes language', async () => {
    mockI18n.changeLanguage.mockResolvedValue(undefined);
    
    const { result } = renderHook(() => useLanguageSync());
    
    await act(async () => {
      await result.current.changeLanguage('zh_CN');
    });
    
    expect(mockI18n.changeLanguage).toHaveBeenCalledWith('zh_CN');
  });

  it('syncs with Eagle locale on plugin show', () => {
    const { result } = renderHook(() => useLanguageSync());
    
    // Simulate Eagle locale change
    vi.mocked(require('@/lib/eagle-api').eagleApi).locale = 'ja_JP';
    
    // Trigger onPluginShow callback
    act(() => {
      (window as any).__onPluginShow?.();
    });
    
    expect(mockI18n.changeLanguage).toHaveBeenCalledWith('ja_JP');
  });
});
```

## Testing Hooks with Providers

When hooks require context providers:

```typescript
import { renderHook } from '@testing-library/react';
import { ReactNode } from 'react';
import { ToastProvider, useToast } from '@/components';

// Create wrapper with providers
const wrapper = ({ children }: { children: ReactNode }) => (
  <ToastProvider>{children}</ToastProvider>
);

describe('useToast', () => {
  it('provides addToast function', () => {
    const { result } = renderHook(() => useToast(), { wrapper });
    
    expect(typeof result.current.addToast).toBe('function');
  });

  it('adds toast to context', () => {
    const { result } = renderHook(() => useToast(), { wrapper });
    
    act(() => {
      result.current.addToast({
        type: 'success',
        title: 'Test Toast',
      });
    });
    
    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].title).toBe('Test Toast');
  });
});
```

## Testing Hook Cleanup

```typescript
import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';

function useInterval(callback: () => void, delay: number) {
  useEffect(() => {
    const id = setInterval(callback, delay);
    return () => clearInterval(id);
  }, [callback, delay]);
}

describe('useInterval', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('clears interval on unmount', () => {
    const callback = vi.fn();
    const { unmount } = renderHook(() => useInterval(callback, 100));
    
    vi.advanceTimersByTime(250);
    expect(callback).toHaveBeenCalledTimes(2);
    
    unmount();
    
    vi.advanceTimersByTime(200);
    expect(callback).toHaveBeenCalledTimes(2); // No additional calls
  });

  it('updates interval when delay changes', () => {
    const callback = vi.fn();
    const { rerender } = renderHook(
      ({ delay }) => useInterval(callback, delay),
      { initialProps: { delay: 100 } }
    );
    
    vi.advanceTimersByTime(250);
    expect(callback).toHaveBeenCalledTimes(2);
    
    // Change delay
    rerender({ delay: 500 });
    
    vi.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(4); // 2 more at 500ms interval
  });
});
```

## Mock Factory Pattern

Create reusable mock factories for complex hooks:

```typescript title="src/test/mocks/eagle-api.ts"
import { vi } from 'vitest';

export const createMockEagleApi = (overrides = {}) => ({
  isMock: true,
  isDarkMode: false,
  locale: 'en',
  getSelectedItems: vi.fn().mockResolvedValue([]),
  addItemFromPath: vi.fn().mockResolvedValue({ id: 'new-item' }),
  getFolders: vi.fn().mockResolvedValue([]),
  getTags: vi.fn().mockResolvedValue([]),
  ...overrides,
});

export const createMockItems = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `item-${i}`,
    name: `file-${i}.png`,
    ext: 'png',
    width: 1920,
    height: 1080,
    filePath: `/path/to/file-${i}.png`,
  }));
};
```

**Usage:**

```typescript
import { createMockEagleApi, createMockItems } from '@/test/mocks/eagle-api';

vi.mock('@/lib/eagle-api', () => ({
  eagleApi: createMockEagleApi({
    getSelectedItems: vi.fn().mockResolvedValue(createMockItems(5)),
  }),
}));
```

## Best Practices

### 1. Always Use `act` for State Updates

```typescript
// ❌ Bad: Missing act wrapper
result.current.setValue('new value');

// ✅ Good: Wrapped in act
act(() => {
  result.current.setValue('new value');
});
```

### 2. Wait for Async Operations

```typescript
// ❌ Bad: Not waiting for async
renderHook(() => useAsyncHook());
expect(result.current.data).toBeDefined(); // May fail

// ✅ Good: Wait for loading to complete
const { result } = renderHook(() => useAsyncHook());
await waitFor(() => {
  expect(result.current.isLoading).toBe(false);
});
expect(result.current.data).toBeDefined();
```

### 3. Test Edge Cases

```typescript
describe('useDebounce', () => {
  it('handles rapid value changes', () => { ... });
  it('handles undefined values', () => { ... });
  it('handles zero delay', () => { ... });
  it('cancels pending debounce on unmount', () => { ... });
});
```

## Related

- [Testing Overview](./overview.md) - Test configuration
- [Component Testing](./component-testing.md) - Testing React components
- [E2E Testing](./e2e-testing.md) - End-to-end tests
