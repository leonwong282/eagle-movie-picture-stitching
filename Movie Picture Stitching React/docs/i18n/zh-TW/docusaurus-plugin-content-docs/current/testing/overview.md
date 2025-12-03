# 測試概觀

Eagle React Template 包含完整的測試設定，擁有 **1,040+ 單元測試**，完整涵蓋元件、hooks 與工具程式。測試技術堆疊使用針對 React 與 TypeScript 開發最佳化的現代工具。

## 測試技術堆疊

| 工具 | 用途 | 設定 |
|------|------|------|
| **Vitest** | 單元與整合測試 | `vitest.config.ts` |
| **happy-dom** | DOM 模擬 | 比 jsdom 輕量 |
| **@testing-library/react** | 元件測試 | 以使用者為中心的查詢 |
| **Playwright** | E2E 與視覺迴歸測試 | `playwright.config.ts` |

## 快速指令

```bash
# 執行所有測試
npm test

# 以監視模式執行測試
npm run test:watch

# 以 UI 執行測試
npm run test:ui

# 產生覆蓋率報告
npm run test:coverage

# 執行 E2E 測試
npm run test:e2e

# 執行視覺迴歸測試
npm run test:visual
```

## 設定

### Vitest 設定

```typescript title="vitest.config.ts"
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/index.ts',
      ],
      thresholds: {
        statements: 60,
        branches: 50,
        functions: 50,
        lines: 60,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### 測試設定檔案

設定檔案配置全域模擬與測試工具：

```typescript title="src/test/setup.ts"
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// 模擬 localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// 模擬 matchMedia 用於主題偵測
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// 模擬 ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// 模擬 IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
```

## 覆蓋率門檻

專案強制執行最低覆蓋率門檻：

| 指標 | 門檻 | 目前 |
|------|------|------|
| Statements | 60% | ~85% |
| Branches | 50% | ~75% |
| Functions | 50% | ~80% |
| Lines | 60% | ~85% |

:::tip 覆蓋率報告
執行 `npm run test:coverage` 在 `coverage/` 目錄中產生詳細的 HTML 覆蓋率報告。
:::

## 測試組織

測試與原始檔案並置：

```
src/
├── components/
│   └── ui/
│       ├── Button.tsx
│       └── Button.test.tsx      # 元件測試
├── hooks/
│   ├── useEagleSelection.ts
│   └── useEagleSelection.test.ts # Hook 測試
├── lib/
│   ├── eagle-api.ts
│   └── eagle-api.test.ts        # 工具測試
└── test/
    ├── setup.ts                  # 全域設定
    ├── test-utils.tsx            # 自訂 render
    └── mocks/                    # 共享模擬
        └── eagle-api.ts
```

## 測試類別

### 1. 單元測試

獨立測試個別函式與工具程式：

```typescript
import { describe, it, expect } from 'vitest';
import { cn } from '@/lib/utils';

describe('cn utility', () => {
  it('merges class names', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('handles conditional classes', () => {
    expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz');
  });
});
```

### 2. 元件測試

測試 React 元件與使用者互動：

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components';

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('calls onClick when clicked', () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
```

### 3. Hook 測試

使用 `renderHook` 測試自訂 hooks：

```typescript
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '@/hooks';

describe('useLocalStorage', () => {
  it('returns initial value', () => {
    const { result } = renderHook(() => 
      useLocalStorage('key', 'initial')
    );
    expect(result.current[0]).toBe('initial');
  });

  it('updates value', () => {
    const { result } = renderHook(() => 
      useLocalStorage('key', 'initial')
    );
    act(() => {
      result.current[1]('updated');
    });
    expect(result.current[0]).toBe('updated');
  });
});
```

### 4. 整合測試

測試多個元件協同運作：

```typescript
import { render, screen } from '@/test/test-utils';
import { ToastProvider, useToast } from '@/components';

function TestComponent() {
  const { addToast } = useToast();
  return (
    <button onClick={() => addToast({ type: 'success', message: 'Done!' })}>
      Show Toast
    </button>
  );
}

describe('Toast Integration', () => {
  it('shows toast when triggered', async () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );
    
    fireEvent.click(screen.getByText('Show Toast'));
    expect(await screen.findByText('Done!')).toBeInTheDocument();
  });
});
```

## 執行測試

### 監視模式

在開發期間，使用監視模式獲得即時回饋：

```bash
npm run test:watch
```

### 篩選測試

執行特定測試檔案或模式：

```bash
# 執行符合模式的測試
npm test -- Button

# 執行特定檔案中的測試
npm test -- src/components/ui/Button.test.tsx

# 執行特定名稱的測試
npm test -- -t "renders children"
```

### 測試 UI

Vitest 提供互動式 UI 來探索測試：

```bash
npm run test:ui
```

這會開啟一個瀏覽器介面，您可以：
- 檢視所有測試檔案及其狀態
- 重新執行個別測試
- 查看詳細的錯誤訊息
- 依狀態篩選（通過/失敗/跳過）

## 模擬策略

### 模擬 Eagle API

對於需要 Eagle API 功能的測試：

```typescript
import { vi } from 'vitest';
import { eagleApi } from '@/lib/eagle-api';

vi.mock('@/lib/eagle-api', () => ({
  eagleApi: {
    isMock: true,
    getSelectedItems: vi.fn().mockResolvedValue([]),
    isDarkMode: false,
    locale: 'en',
  },
  isEagleEnvironment: vi.fn().mockReturnValue(false),
}));
```

### 模擬 i18n

對於使用翻譯的元件：

```typescript
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en' },
  }),
  Trans: ({ children }) => children,
}));
```

## 最佳實踐

### 1. 測試行為，而非實作

```typescript
// ❌ 不好：測試實作細節
expect(component.state.isOpen).toBe(true);

// ✅ 好：測試使用者可見的行為
expect(screen.getByRole('dialog')).toBeVisible();
```

### 2. 使用無障礙查詢

```typescript
// ❌ 不好：不必要時使用 test ID
screen.getByTestId('submit-button');

// ✅ 好：使用無障礙查詢
screen.getByRole('button', { name: 'Submit' });
```

### 3. 避免測試污染

```typescript
beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
});

afterEach(() => {
  cleanup();
});
```

### 4. 撰寫描述性的測試名稱

```typescript
// ❌ 不好
it('works', () => { ... });

// ✅ 好
it('disables button when form is invalid', () => { ... });
```

## 相關資源

- [單元測試](./unit-testing.md) - 測試工具程式與函式
- [元件測試](./component-testing.md) - 測試 React 元件
- [Hook 測試](./hook-testing.md) - 測試自訂 hooks
- [E2E 測試](./e2e-testing.md) - 端對端與視覺迴歸測試
