# Testing Guide

Comprehensive testing documentation for Eagle React Template.

## Overview

This project uses **Vitest** as the test runner with **React Testing Library** for component testing and **happy-dom** for DOM simulation.

| Metric | Target | Current |
|--------|--------|---------|
| Statements | 60% | 76% |
| Branches | 50% | 66% |
| Functions | 50% | 54% |
| Lines | 60% | 78% |

## Quick Start

```bash
# Run all tests once
npm run test:run

# Run tests in watch mode (development)
npm run test

# Run with coverage report
npm run test:coverage

# Run with UI dashboard
npm run test:ui
```

## Test Stack

| Package | Version | Purpose |
|---------|---------|---------|
| `vitest` | ^4.0.14 | Test runner with native ESM support |
| `@testing-library/react` | ^16.3.0 | React component testing utilities |
| `@testing-library/user-event` | ^14.6.1 | User interaction simulation |
| `happy-dom` | ^20.0.11 | Fast DOM environment (2-3x faster than jsdom) |
| `@vitest/coverage-v8` | ^4.0.14 | V8-based code coverage |

## Directory Structure

```
src/
├── __tests__/
│   ├── setup.ts              # Global test setup & mocks
│   ├── mocks/
│   │   └── eagle.mock.ts     # Eagle API mock factories
│   └── utils/
│       └── test-utils.tsx    # Custom render & helpers
├── lib/
│   ├── utils.test.ts         # 43 tests - utility functions
│   ├── storage.test.ts       # 37 tests - localStorage wrapper
│   └── eagle-api.test.ts     # 40 tests - Eagle API adapter
├── hooks/
│   ├── useLocalStorage.test.ts    # 20 tests - debounced storage
│   ├── useEagleSelection.test.ts  # 19 tests - polling selection
│   └── useTheme.test.ts           # 28 tests - theme management
└── components/
    └── ui/
        └── Button.test.tsx   # 34 tests - Button component
```

## Configuration

### `vitest.config.ts`

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react() as any],
  test: {
    globals: true,           // Use global describe/it/expect
    environment: 'happy-dom', // Fast DOM simulation
    setupFiles: ['./src/__tests__/setup.ts'],
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/__tests__/',
        '**/*.d.ts',
        '**/*.config.*',
        'src/main.tsx',
        'src/vite-env.d.ts',
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
      '@components': path.resolve(__dirname, './src/components'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@lib': path.resolve(__dirname, './src/lib'),
    },
  },
});
```

## Global Mocks

The `src/__tests__/setup.ts` file provides global mocks required for all tests:

### localStorage Mock

```typescript
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => { store[key] = value; }),
    removeItem: vi.fn((key: string) => { delete store[key]; }),
    clear: vi.fn(() => { store = {}; }),
    get length() { return Object.keys(store).length; },
    key: vi.fn((index: number) => Object.keys(store)[index] ?? null),
  };
})();
```

### matchMedia Mock

```typescript
Object.defineProperty(window, 'matchMedia', {
  value: vi.fn().mockImplementation((query: string) => ({
    matches: query.includes('dark'),
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    // ...
  })),
});
```

### ResizeObserver Mock

```typescript
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
```

## Mock Factories

Located in `src/__tests__/mocks/eagle.mock.ts`:

### Creating Mock Items

```typescript
import { createMockItem, createMockItems } from '@/__tests__/mocks/eagle.mock';

// Single item with overrides
const item = createMockItem({ name: 'Custom Name', tags: ['tag1'] });

// Multiple items
const items = createMockItems(5);
```

### Creating Mock Folders

```typescript
import { createMockFolder, createMockFolders } from '@/__tests__/mocks/eagle.mock';

const folder = createMockFolder({ name: 'My Folder' });
const folders = createMockFolders(3);
```

### Mock Eagle API

```typescript
import { createMockEagleAPI } from '@/__tests__/mocks/eagle.mock';

const mockEagle = createMockEagleAPI();
// mockEagle.item.getSelected()
// mockEagle.folder.getAll()
// mockEagle.app.locale
```

## Custom Render

Use custom render for components that need providers:

```typescript
import { customRender, screen } from '@/__tests__/utils/test-utils';

it('renders with providers', () => {
  customRender(<MyComponent />);
  expect(screen.getByText('Hello')).toBeInTheDocument();
});
```

The custom render wraps components with:
- `ToastProvider` - Toast notification context
- `I18nextProvider` - i18n translations

## Testing Patterns

### Testing Hooks with Timers

For hooks using `setInterval` or `setTimeout`, use fake timers:

```typescript
import { vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

it('polls at interval', async () => {
  const { result } = renderHook(() => useEagleSelection());
  
  // Advance time
  await act(async () => {
    await vi.advanceTimersByTimeAsync(500);
  });
  
  expect(eagleApi.getSelectedItems).toHaveBeenCalled();
});
```

### Testing Async Operations

Use `waitFor` for async assertions:

```typescript
import { waitFor } from '@testing-library/react';

it('loads data asynchronously', async () => {
  const { result } = renderHook(() => useData());
  
  await waitFor(() => {
    expect(result.current.isLoading).toBe(false);
  });
  
  expect(result.current.data).toEqual(expected);
});
```

### Testing User Interactions

```typescript
import userEvent from '@testing-library/user-event';

it('handles click', async () => {
  const user = userEvent.setup();
  const onClick = vi.fn();
  
  customRender(<Button onClick={onClick}>Click me</Button>);
  
  await user.click(screen.getByRole('button'));
  
  expect(onClick).toHaveBeenCalledOnce();
});
```

### Testing Components with CVA Variants

```typescript
it('applies variant classes', () => {
  customRender(<Button variant="primary" size="sm">Text</Button>);
  
  const button = screen.getByRole('button');
  expect(button).toHaveClass('bg-gradient-to-r');
  expect(button).toHaveClass('h-8'); // sm size
});
```

### Testing Dark Mode

```typescript
import { simulateDarkModeChange } from '@/__tests__/utils/test-utils';

it('responds to dark mode', async () => {
  const { result } = renderHook(() => useTheme());
  
  act(() => {
    simulateDarkModeChange(true);
  });
  
  expect(result.current.isDarkMode).toBe(true);
});
```

## Mocking Modules

### Mocking Eagle API

```typescript
vi.mock('@/lib/eagle-api', () => ({
  eagleApi: {
    getSelectedItems: vi.fn().mockResolvedValue([]),
    isMock: true,
  },
}));

import { eagleApi } from '@/lib/eagle-api';

// In tests
vi.mocked(eagleApi.getSelectedItems).mockResolvedValue(mockItems);
```

### Mocking i18n

```typescript
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en' },
  }),
}));
```

## Test Categories

### Unit Tests (Library Functions)

Test pure functions in isolation:

```typescript
// src/lib/utils.test.ts
describe('cn', () => {
  it('merges class names', () => {
    expect(cn('a', 'b')).toBe('a b');
  });
  
  it('handles Tailwind conflicts', () => {
    expect(cn('p-2', 'p-4')).toBe('p-4');
  });
});
```

### Hook Tests

Test hooks with `renderHook`:

```typescript
// src/hooks/useLocalStorage.test.ts
describe('useLocalStorage', () => {
  it('persists value', () => {
    const { result } = renderHook(() => 
      useLocalStorage('key', 'default')
    );
    
    act(() => {
      result.current[1]('new value');
    });
    
    expect(localStorage.setItem).toHaveBeenCalled();
  });
});
```

### Component Tests

Test components with user interactions:

```typescript
// src/components/ui/Button.test.tsx
describe('Button', () => {
  it('shows loading state', () => {
    customRender(<Button isLoading>Submit</Button>);
    
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
  });
});
```

## Coverage Reports

### Viewing Coverage

After running `npm run test:coverage`:

```bash
# Open HTML report
open coverage/index.html
```

### Coverage Output

```
----------------------|---------|----------|---------|---------|
File                  | % Stmts | % Branch | % Funcs | % Lines |
----------------------|---------|----------|---------|---------|
All files             |   76.00 |    66.66 |   54.54 |   78.68 |
 lib/eagle-api.ts     |   93.75 |    91.30 |   76.47 |   93.75 |
 lib/storage.ts       |     100 |      100 |     100 |     100 |
 lib/utils.ts         |     100 |      100 |     100 |     100 |
 hooks/useTheme.ts    |   85.71 |    77.77 |   83.33 |   85.71 |
----------------------|---------|----------|---------|---------|
```

## CI Integration

Tests run automatically on push/PR via GitHub Actions:

```yaml
# .github/workflows/ci.yml
- name: Run tests
  run: npm run test:run

- name: Run coverage
  run: npm run test:coverage
```

## Debugging Tests

### VS Code Integration

Add to `.vscode/launch.json`:

```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Vitest",
  "program": "${workspaceFolder}/node_modules/vitest/vitest.mjs",
  "args": ["run", "--reporter=verbose"],
  "console": "integratedTerminal"
}
```

### Running Single Test File

```bash
npx vitest run src/lib/utils.test.ts
```

### Running Tests Matching Pattern

```bash
npx vitest run -t "handles dark mode"
```

### Verbose Output

```bash
npm run test:run -- --reporter=verbose
```

## Best Practices

### 1. Test Behavior, Not Implementation

```typescript
// ✅ Good: Tests behavior
it('shows error when validation fails', async () => {
  customRender(<Form />);
  await user.click(screen.getByText('Submit'));
  expect(screen.getByText('Required')).toBeInTheDocument();
});

// ❌ Bad: Tests implementation
it('calls setError with message', () => {
  expect(setError).toHaveBeenCalledWith('Required');
});
```

### 2. Use Descriptive Test Names

```typescript
// ✅ Good
it('disables button when form is submitting', () => {});

// ❌ Bad
it('button disabled', () => {});
```

### 3. One Assertion Per Concept

```typescript
// ✅ Good
it('shows loading spinner', () => {
  expect(screen.getByRole('progressbar')).toBeInTheDocument();
});

it('disables submit button while loading', () => {
  expect(screen.getByRole('button')).toBeDisabled();
});
```

### 4. Avoid Test Interdependence

Each test should be independent:

```typescript
beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});
```

### 5. Mock at the Right Level

```typescript
// ✅ Mock external dependencies
vi.mock('@/lib/eagle-api');

// ❌ Don't mock internal implementation details
vi.mock('./useInternalHelper');
```

## Troubleshooting

### Timer Tests Failing

Use `vi.advanceTimersByTimeAsync()` instead of `vi.advanceTimersByTime()`:

```typescript
await act(async () => {
  await vi.advanceTimersByTimeAsync(500);
});
```

### Mock Not Being Used

Ensure mock is defined before import:

```typescript
// ✅ Correct order
vi.mock('@/lib/api');
import { api } from '@/lib/api';

// ❌ Wrong order
import { api } from '@/lib/api';
vi.mock('@/lib/api');
```

### Type Errors in Mocks

Use `vi.mocked()` for type-safe mock access:

```typescript
const mockFn = vi.mocked(someModule.someFunction);
mockFn.mockReturnValue('value');
expect(mockFn.mock.calls).toHaveLength(1);
```

### Happy-DOM Limitations

If a test requires browser-specific features not in happy-dom:

```typescript
// Skip in happy-dom
it.skipIf(typeof window.IntersectionObserver === 'undefined')(
  'uses IntersectionObserver',
  () => {}
);
```

## Adding New Tests

### 1. Create Test File

```typescript
// src/lib/newModule.test.ts
import { describe, it, expect, vi } from 'vitest';
import { myFunction } from './newModule';

describe('myFunction', () => {
  it('does something', () => {
    expect(myFunction()).toBe(expected);
  });
});
```

### 2. Run Tests

```bash
npm run test:run
```

### 3. Check Coverage

```bash
npm run test:coverage
```

### 4. Update Thresholds if Needed

If coverage drops below thresholds, either:
- Add more tests to meet thresholds
- Adjust thresholds in `vitest.config.ts` (with justification)

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Library Queries](https://testing-library.com/docs/queries/about)
- [Vitest Mocking](https://vitest.dev/guide/mocking.html)
- [Happy-DOM](https://github.com/nickersoft/happy-dom)
