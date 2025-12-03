# Testing Overview

The Eagle React Template includes a comprehensive testing setup with **1,040+ unit tests** and full coverage across components, hooks, and utilities. The test stack uses modern tools optimized for React and TypeScript development.

## Test Stack

| Tool | Purpose | Configuration |
|------|---------|---------------|
| **Vitest** | Unit & integration tests | `vitest.config.ts` |
| **happy-dom** | DOM simulation | Lighter than jsdom |
| **@testing-library/react** | Component testing | User-centric queries |
| **Playwright** | E2E & visual regression | `playwright.config.ts` |

## Quick Commands

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Generate coverage report
npm run test:coverage

# Run E2E tests
npm run test:e2e

# Run visual regression tests
npm run test:visual
```

## Configuration

### Vitest Configuration

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

### Test Setup File

The setup file configures global mocks and test utilities:

```typescript title="src/test/setup.ts"
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock matchMedia for theme detection
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

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
```

## Coverage Thresholds

The project enforces minimum coverage thresholds:

| Metric | Threshold | Current |
|--------|-----------|---------|
| Statements | 60% | ~85% |
| Branches | 50% | ~75% |
| Functions | 50% | ~80% |
| Lines | 60% | ~85% |

:::tip Coverage Reports
Run `npm run test:coverage` to generate detailed HTML coverage reports in the `coverage/` directory.
:::

## Test Organization

Tests are co-located with source files:

```
src/
├── components/
│   └── ui/
│       ├── Button.tsx
│       └── Button.test.tsx      # Component tests
├── hooks/
│   ├── useEagleSelection.ts
│   └── useEagleSelection.test.ts # Hook tests
├── lib/
│   ├── eagle-api.ts
│   └── eagle-api.test.ts        # Utility tests
└── test/
    ├── setup.ts                  # Global setup
    ├── test-utils.tsx            # Custom render
    └── mocks/                    # Shared mocks
        └── eagle-api.ts
```

## Test Categories

### 1. Unit Tests

Test individual functions and utilities in isolation:

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

### 2. Component Tests

Test React components with user interactions:

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

### 3. Hook Tests

Test custom hooks with `renderHook`:

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

### 4. Integration Tests

Test multiple components working together:

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

## Running Tests

### Watch Mode

During development, use watch mode for instant feedback:

```bash
npm run test:watch
```

### Filtering Tests

Run specific test files or patterns:

```bash
# Run tests matching pattern
npm test -- Button

# Run tests in specific file
npm test -- src/components/ui/Button.test.tsx

# Run tests with specific name
npm test -- -t "renders children"
```

### Test UI

Vitest provides an interactive UI for exploring tests:

```bash
npm run test:ui
```

This opens a browser interface where you can:
- View all test files and their status
- Re-run individual tests
- See detailed error messages
- Filter by status (passed/failed/skipped)

## Mocking Strategies

### Mock Eagle API

For tests that need Eagle API functionality:

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

### Mock i18n

For components using translations:

```typescript
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: 'en' },
  }),
  Trans: ({ children }) => children,
}));
```

## Best Practices

### 1. Test Behavior, Not Implementation

```typescript
// ❌ Bad: Testing implementation details
expect(component.state.isOpen).toBe(true);

// ✅ Good: Testing user-visible behavior
expect(screen.getByRole('dialog')).toBeVisible();
```

### 2. Use Accessible Queries

```typescript
// ❌ Bad: Using test IDs when not necessary
screen.getByTestId('submit-button');

// ✅ Good: Using accessible queries
screen.getByRole('button', { name: 'Submit' });
```

### 3. Avoid Test Pollution

```typescript
beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
});

afterEach(() => {
  cleanup();
});
```

### 4. Write Descriptive Test Names

```typescript
// ❌ Bad
it('works', () => { ... });

// ✅ Good
it('disables button when form is invalid', () => { ... });
```

## Related

- [Unit Testing](./unit-testing.md) - Testing utilities and functions
- [Component Testing](./component-testing.md) - Testing React components
- [Hook Testing](./hook-testing.md) - Testing custom hooks
- [E2E Testing](./e2e-testing.md) - End-to-end and visual regression tests
