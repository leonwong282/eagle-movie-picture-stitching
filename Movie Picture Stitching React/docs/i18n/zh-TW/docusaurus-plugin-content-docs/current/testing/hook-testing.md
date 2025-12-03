# Hook 測試

自訂 hooks 封裝可重複使用的邏輯，需要特殊的測試模式。Eagle React Template 使用來自 **@testing-library/react** 的 `renderHook` 來獨立測試 hooks。

## 基本 Hook 測試

### 使用 renderHook

```typescript
import { renderHook, act } from '@testing-library/react';
import { useState } from 'react';

// 簡單的自訂 hook
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

## 測試 useLocalStorage

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
    
    // 注意：真正的同步需要 storage 事件監聽器
    // 此測試驗證 localStorage 已更新
    expect(localStorage.getItem('eagle-react-template:sharedKey'))
      .toBe(JSON.stringify('updated from instance 1'));
  });
});
```

## 測試 useTheme

```typescript title="src/hooks/useTheme.test.ts"
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTheme } from './useTheme';

// 模擬 matchMedia
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
    mockMatchMedia(false); // 預設為淺色模式
  });

  it('returns light theme by default', () => {
    const { result } = renderHook(() => useTheme());
    
    expect(result.current.theme).toBe('light');
    expect(result.current.isDarkMode).toBe(false);
  });

  it('detects system dark mode preference', () => {
    mockMatchMedia(true); // 系統偏好深色
    
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

## 測試 useEagleSelection

```typescript title="src/hooks/useEagleSelection.test.ts"
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useEagleSelection } from './useEagleSelection';

// 模擬 Eagle API
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
    
    expect(eagleApi.getSelectedItems).toHaveBeenCalledTimes(2); // 初始 + 1 次輪詢
    
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
    
    // 模擬文件變為隱藏
    Object.defineProperty(document, 'hidden', { value: true, writable: true });
    document.dispatchEvent(new Event('visibilitychange'));
    
    const callsBefore = vi.mocked(eagleApi.getSelectedItems).mock.calls.length;
    
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });
    
    expect(result.current.isPaused).toBe(true);
    expect(vi.mocked(eagleApi.getSelectedItems).mock.calls.length).toBe(callsBefore);
    
    // 模擬文件變為可見
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
    
    // 返回相同項目 - 不應建立新參考
    await act(async () => {
      vi.advanceTimersByTime(100);
    });
    
    expect(result.current.items).toBe(firstItems); // 相同參考
  });
});
```

## 測試 useLanguageSync

```typescript title="src/hooks/useLanguageSync.test.ts"
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLanguageSync } from './useLanguageSync';

// 模擬 i18n
const mockI18n = {
  language: 'en',
  changeLanguage: vi.fn(),
};

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    i18n: mockI18n,
  }),
}));

// 模擬 Eagle API
vi.mock('@/lib/eagle-api', () => ({
  eagleApi: {
    locale: 'en',
    onPluginShow: vi.fn((callback) => {
      // 儲存回呼供測試使用
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
    
    // 模擬 Eagle 語言區域變更
    vi.mocked(require('@/lib/eagle-api').eagleApi).locale = 'ja_JP';
    
    // 觸發 onPluginShow 回呼
    act(() => {
      (window as any).__onPluginShow?.();
    });
    
    expect(mockI18n.changeLanguage).toHaveBeenCalledWith('ja_JP');
  });
});
```

## 使用 Providers 測試 Hooks

當 hooks 需要 context providers 時：

```typescript
import { renderHook } from '@testing-library/react';
import { ReactNode } from 'react';
import { ToastProvider, useToast } from '@/components';

// 建立包含 providers 的 wrapper
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

## 測試 Hook 清理

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
    expect(callback).toHaveBeenCalledTimes(2); // 沒有額外呼叫
  });

  it('updates interval when delay changes', () => {
    const callback = vi.fn();
    const { rerender } = renderHook(
      ({ delay }) => useInterval(callback, delay),
      { initialProps: { delay: 100 } }
    );
    
    vi.advanceTimersByTime(250);
    expect(callback).toHaveBeenCalledTimes(2);
    
    // 變更延遲
    rerender({ delay: 500 });
    
    vi.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(4); // 以 500ms 間隔再 2 次
  });
});
```

## Mock Factory 模式

為複雜 hooks 建立可重複使用的 mock factories：

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

**使用方式：**

```typescript
import { createMockEagleApi, createMockItems } from '@/test/mocks/eagle-api';

vi.mock('@/lib/eagle-api', () => ({
  eagleApi: createMockEagleApi({
    getSelectedItems: vi.fn().mockResolvedValue(createMockItems(5)),
  }),
}));
```

## 最佳實踐

### 1. 狀態更新時總是使用 `act`

```typescript
// ❌ 不好：缺少 act 包裝
result.current.setValue('new value');

// ✅ 好：包裝在 act 中
act(() => {
  result.current.setValue('new value');
});
```

### 2. 等待非同步操作

```typescript
// ❌ 不好：沒有等待非同步
renderHook(() => useAsyncHook());
expect(result.current.data).toBeDefined(); // 可能失敗

// ✅ 好：等待載入完成
const { result } = renderHook(() => useAsyncHook());
await waitFor(() => {
  expect(result.current.isLoading).toBe(false);
});
expect(result.current.data).toBeDefined();
```

### 3. 測試邊界情況

```typescript
describe('useDebounce', () => {
  it('handles rapid value changes', () => { ... });
  it('handles undefined values', () => { ... });
  it('handles zero delay', () => { ... });
  it('cancels pending debounce on unmount', () => { ... });
});
```

## 相關資源

- [測試概觀](./overview.md) - 測試設定
- [元件測試](./component-testing.md) - 測試 React 元件
- [E2E 測試](./e2e-testing.md) - 端對端測試
