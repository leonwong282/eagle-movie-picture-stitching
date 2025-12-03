# 單元測試

單元測試驗證個別函式與工具程式能獨立正確運作。Eagle React Template 使用 **Vitest**，具有快速執行與優秀的 TypeScript 支援。

## 測試工具程式

### `cn` 工具程式

最常測試的工具程式用於合併 Tailwind 類別：

```typescript title="src/lib/utils.test.ts"
import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn', () => {
  it('merges multiple class names', () => {
    expect(cn('foo', 'bar', 'baz')).toBe('foo bar baz');
  });

  it('handles undefined and null values', () => {
    expect(cn('foo', undefined, 'bar', null)).toBe('foo bar');
  });

  it('handles conditional classes', () => {
    const isActive = true;
    const isDisabled = false;
    expect(cn(
      'base',
      isActive && 'active',
      isDisabled && 'disabled'
    )).toBe('base active');
  });

  it('merges Tailwind classes correctly', () => {
    // 後面的類別會覆蓋前面的
    expect(cn('p-2', 'p-4')).toBe('p-4');
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
  });

  it('handles arrays of classes', () => {
    expect(cn(['foo', 'bar'], 'baz')).toBe('foo bar baz');
  });

  it('handles objects with boolean values', () => {
    expect(cn({
      'foo': true,
      'bar': false,
      'baz': true,
    })).toBe('foo baz');
  });
});
```

### 儲存工具程式

測試 localStorage 操作：

```typescript title="src/lib/storage.test.ts"
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { storage } from './storage';

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('get', () => {
    it('returns parsed value from localStorage', () => {
      localStorage.setItem(
        'eagle-react-template:settings',
        JSON.stringify({ theme: 'dark' })
      );
      
      expect(storage.get('settings')).toEqual({ theme: 'dark' });
    });

    it('returns default value when key does not exist', () => {
      expect(storage.get('missing', { default: true }))
        .toEqual({ default: true });
    });

    it('returns default value on parse error', () => {
      localStorage.setItem('eagle-react-template:corrupt', 'invalid json');
      
      expect(storage.get('corrupt', 'fallback')).toBe('fallback');
    });
  });

  describe('set', () => {
    it('stores stringified value', () => {
      storage.set('settings', { theme: 'light' });
      
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'eagle-react-template:settings',
        JSON.stringify({ theme: 'light' })
      );
    });

    it('handles complex objects', () => {
      const complex = {
        nested: { value: [1, 2, 3] },
        date: '2024-01-01',
      };
      
      storage.set('complex', complex);
      expect(storage.get('complex')).toEqual(complex);
    });
  });

  describe('remove', () => {
    it('removes item from localStorage', () => {
      storage.set('temp', 'value');
      storage.remove('temp');
      
      expect(storage.get('temp')).toBeUndefined();
    });
  });

  describe('clear', () => {
    it('clears all namespaced items', () => {
      storage.set('a', 1);
      storage.set('b', 2);
      
      storage.clear();
      
      expect(storage.get('a')).toBeUndefined();
      expect(storage.get('b')).toBeUndefined();
    });
  });
});
```

## 測試非同步函式

### API 回應處理

```typescript title="src/lib/api-utils.test.ts"
import { describe, it, expect, vi } from 'vitest';
import { fetchWithTimeout, retryFetch } from './api-utils';

describe('fetchWithTimeout', () => {
  it('resolves when fetch completes in time', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: 'test' }),
    });

    const result = await fetchWithTimeout('/api/data', { timeout: 5000 });
    expect(result.data).toBe('test');
  });

  it('rejects when fetch times out', async () => {
    global.fetch = vi.fn().mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 10000))
    );

    await expect(fetchWithTimeout('/api/data', { timeout: 100 }))
      .rejects.toThrow('Request timed out');
  });
});

describe('retryFetch', () => {
  it('retries on failure', async () => {
    const mockFetch = vi.fn()
      .mockRejectedValueOnce(new Error('Network error'))
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce({ ok: true, data: 'success' });

    global.fetch = mockFetch;

    const result = await retryFetch('/api/data', { retries: 3 });
    
    expect(mockFetch).toHaveBeenCalledTimes(3);
    expect(result.data).toBe('success');
  });

  it('throws after max retries', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

    await expect(retryFetch('/api/data', { retries: 2 }))
      .rejects.toThrow('Network error');
    
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });
});
```

## 測試型別守衛

```typescript title="src/lib/type-guards.test.ts"
import { describe, it, expect } from 'vitest';
import { isEagleItem, isFolder, isValidLocale } from './type-guards';

describe('isEagleItem', () => {
  it('returns true for valid Eagle item', () => {
    const item = {
      id: 'item-123',
      name: 'test.png',
      ext: 'png',
      width: 1920,
      height: 1080,
      filePath: '/path/to/file.png',
    };
    
    expect(isEagleItem(item)).toBe(true);
  });

  it('returns false for missing required fields', () => {
    expect(isEagleItem({ id: '123' })).toBe(false);
    expect(isEagleItem({ name: 'test' })).toBe(false);
    expect(isEagleItem(null)).toBe(false);
    expect(isEagleItem(undefined)).toBe(false);
  });

  it('returns false for wrong types', () => {
    expect(isEagleItem({ id: 123, name: 'test' })).toBe(false);
    expect(isEagleItem('string')).toBe(false);
    expect(isEagleItem([])).toBe(false);
  });
});

describe('isValidLocale', () => {
  it('returns true for supported locales', () => {
    expect(isValidLocale('en')).toBe(true);
    expect(isValidLocale('zh_CN')).toBe(true);
    expect(isValidLocale('zh_TW')).toBe(true);
    expect(isValidLocale('ja_JP')).toBe(true);
  });

  it('returns false for unsupported locales', () => {
    expect(isValidLocale('fr')).toBe(false);
    expect(isValidLocale('invalid')).toBe(false);
    expect(isValidLocale('')).toBe(false);
  });
});
```

## 測試純函式

### 資料轉換

```typescript title="src/lib/transforms.test.ts"
import { describe, it, expect } from 'vitest';
import {
  formatFileSize,
  truncateString,
  groupBy,
  sortByProperty,
} from './transforms';

describe('formatFileSize', () => {
  it('formats bytes correctly', () => {
    expect(formatFileSize(0)).toBe('0 B');
    expect(formatFileSize(500)).toBe('500 B');
    expect(formatFileSize(1024)).toBe('1 KB');
    expect(formatFileSize(1536)).toBe('1.5 KB');
    expect(formatFileSize(1048576)).toBe('1 MB');
    expect(formatFileSize(1073741824)).toBe('1 GB');
  });

  it('handles negative values', () => {
    expect(formatFileSize(-100)).toBe('0 B');
  });
});

describe('truncateString', () => {
  it('truncates long strings', () => {
    expect(truncateString('Hello World', 5)).toBe('Hello...');
    expect(truncateString('Short', 10)).toBe('Short');
  });

  it('handles edge cases', () => {
    expect(truncateString('', 5)).toBe('');
    expect(truncateString('Test', 0)).toBe('...');
  });
});

describe('groupBy', () => {
  it('groups array by key', () => {
    const items = [
      { type: 'image', name: 'a.png' },
      { type: 'video', name: 'b.mp4' },
      { type: 'image', name: 'c.jpg' },
    ];

    const grouped = groupBy(items, 'type');

    expect(grouped).toEqual({
      image: [
        { type: 'image', name: 'a.png' },
        { type: 'image', name: 'c.jpg' },
      ],
      video: [{ type: 'video', name: 'b.mp4' }],
    });
  });

  it('handles empty array', () => {
    expect(groupBy([], 'type')).toEqual({});
  });
});

describe('sortByProperty', () => {
  it('sorts by string property', () => {
    const items = [
      { name: 'Charlie' },
      { name: 'Alice' },
      { name: 'Bob' },
    ];

    expect(sortByProperty(items, 'name')).toEqual([
      { name: 'Alice' },
      { name: 'Bob' },
      { name: 'Charlie' },
    ]);
  });

  it('sorts by number property', () => {
    const items = [
      { size: 300 },
      { size: 100 },
      { size: 200 },
    ];

    expect(sortByProperty(items, 'size')).toEqual([
      { size: 100 },
      { size: 200 },
      { size: 300 },
    ]);
  });

  it('supports descending order', () => {
    const items = [{ value: 1 }, { value: 3 }, { value: 2 }];

    expect(sortByProperty(items, 'value', 'desc')).toEqual([
      { value: 3 },
      { value: 2 },
      { value: 1 },
    ]);
  });
});
```

## 模擬依賴

### 模擬模組

```typescript
import { vi, describe, it, expect, beforeEach } from 'vitest';

// 模擬整個模組
vi.mock('@/lib/eagle-api', () => ({
  eagleApi: {
    isMock: true,
    isDarkMode: false,
    locale: 'en',
    getSelectedItems: vi.fn(),
  },
  isEagleEnvironment: vi.fn().mockReturnValue(false),
}));

import { eagleApi } from '@/lib/eagle-api';
import { processItems } from './item-processor';

describe('processItems', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('processes selected items', async () => {
    vi.mocked(eagleApi.getSelectedItems).mockResolvedValue([
      { id: '1', name: 'test.png', ext: 'png' },
    ]);

    const result = await processItems();
    
    expect(eagleApi.getSelectedItems).toHaveBeenCalled();
    expect(result).toHaveLength(1);
  });
});
```

### 模擬計時器

```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { debounce, throttle } from './timing';

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('delays execution', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced();
    debounced();
    debounced();

    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('resets timer on subsequent calls', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced();
    vi.advanceTimersByTime(50);
    debounced();
    vi.advanceTimersByTime(50);
    debounced();
    vi.advanceTimersByTime(100);

    expect(fn).toHaveBeenCalledTimes(1);
  });
});

describe('throttle', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('limits execution rate', () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 100);

    throttled(); // 立即執行
    throttled(); // 忽略
    throttled(); // 忽略

    expect(fn).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(100);
    throttled(); // 執行

    expect(fn).toHaveBeenCalledTimes(2);
  });
});
```

## 快照測試

用於複雜資料結構：

```typescript
import { describe, it, expect } from 'vitest';
import { generateConfig } from './config-generator';

describe('generateConfig', () => {
  it('generates correct config structure', () => {
    const config = generateConfig({
      name: 'test-plugin',
      version: '1.0.0',
      features: ['dark-mode', 'i18n'],
    });

    expect(config).toMatchSnapshot();
  });

  it('handles minimal options', () => {
    const config = generateConfig({ name: 'minimal' });
    expect(config).toMatchSnapshot();
  });
});
```

## 測試模式

### 參數化測試

```typescript
import { describe, it, expect } from 'vitest';
import { validateEmail } from './validators';

describe('validateEmail', () => {
  it.each([
    ['test@example.com', true],
    ['user.name@domain.org', true],
    ['invalid', false],
    ['@nodomain.com', false],
    ['no@tld', false],
    ['', false],
  ])('validateEmail(%s) = %s', (email, expected) => {
    expect(validateEmail(email)).toBe(expected);
  });
});
```

### 測試錯誤情況

```typescript
import { describe, it, expect } from 'vitest';
import { parseJSON, divideNumbers } from './utils';

describe('parseJSON', () => {
  it('throws on invalid JSON', () => {
    expect(() => parseJSON('invalid')).toThrow(SyntaxError);
  });

  it('throws with descriptive message', () => {
    expect(() => parseJSON('{')).toThrow(/Unexpected end/);
  });
});

describe('divideNumbers', () => {
  it('throws on division by zero', () => {
    expect(() => divideNumbers(10, 0)).toThrow('Cannot divide by zero');
  });
});
```

## 最佳實踐

### 1. 每個測試只測試一件事

```typescript
// ❌ 不好：多個斷言測試不同行為
it('processes items', () => {
  const result = processItems([item1, item2]);
  expect(result).toHaveLength(2);
  expect(result[0].processed).toBe(true);
  expect(processItems([])).toEqual([]);
});

// ✅ 好：每個行為分開測試
it('returns processed items', () => {
  const result = processItems([item1, item2]);
  expect(result).toHaveLength(2);
});

it('marks items as processed', () => {
  const result = processItems([item1]);
  expect(result[0].processed).toBe(true);
});

it('handles empty array', () => {
  expect(processItems([])).toEqual([]);
});
```

### 2. 使用描述性名稱

```typescript
// ❌ 不好
it('works', () => { ... });
it('test 1', () => { ... });

// ✅ 好
it('returns empty array when input is null', () => { ... });
it('throws error when file path contains invalid characters', () => { ... });
```

### 3. Arrange-Act-Assert 模式

```typescript
it('filters items by extension', () => {
  // Arrange（安排）
  const items = [
    { name: 'a.png', ext: 'png' },
    { name: 'b.jpg', ext: 'jpg' },
    { name: 'c.png', ext: 'png' },
  ];

  // Act（執行）
  const result = filterByExtension(items, 'png');

  // Assert（斷言）
  expect(result).toHaveLength(2);
  expect(result.every(item => item.ext === 'png')).toBe(true);
});
```

## 相關資源

- [測試概觀](./overview.md) - 測試堆疊設定
- [元件測試](./component-testing.md) - 測試 React 元件
- [Hook 測試](./hook-testing.md) - 測試自訂 hooks
