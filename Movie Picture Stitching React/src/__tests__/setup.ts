/**
 * Vitest Global Setup
 * Configure global mocks and test utilities
 */

import '@testing-library/jest-dom/vitest';
import { vi, beforeEach, afterEach } from 'vitest';

// ============================================================================
// localStorage Mock
// ============================================================================

const createLocalStorageMock = () => {
  let store: Record<string, string> = {};

  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    key: vi.fn((index: number) => Object.keys(store)[index] ?? null),
    get length() {
      return Object.keys(store).length;
    },
    // Test helper to access store directly
    _getStore: () => store,
    _setStore: (newStore: Record<string, string>) => {
      store = newStore;
    },
  };
};

const localStorageMock = createLocalStorageMock();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// ============================================================================
// matchMedia Mock
// ============================================================================

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: query === '(prefers-color-scheme: dark)' ? false : false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// ============================================================================
// ResizeObserver Mock
// ============================================================================

class ResizeObserverMock {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  value: ResizeObserverMock,
});

// ============================================================================
// IntersectionObserver Mock
// ============================================================================

class IntersectionObserverMock {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  root = null;
  rootMargin = '';
  thresholds = [];
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: IntersectionObserverMock,
});

// ============================================================================
// scrollTo Mock
// ============================================================================

Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: vi.fn(),
});

// ============================================================================
// Crypto Mock (for generateId)
// ============================================================================

Object.defineProperty(globalThis, 'crypto', {
  value: {
    randomUUID: () => 'test-uuid-' + Math.random().toString(36).substring(2, 9),
    getRandomValues: (array: Uint8Array) => {
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
      return array;
    },
  },
});

// ============================================================================
// Console Suppression (optional)
// ============================================================================

// Suppress console.warn and console.error during tests unless needed
const originalWarn = console.warn;
const originalError = console.error;

beforeEach(() => {
  // Clear localStorage before each test
  localStorageMock.clear();
  localStorageMock._setStore({});

  // Reset all mocks
  vi.clearAllMocks();
});

afterEach(() => {
  // Restore console
  console.warn = originalWarn;
  console.error = originalError;
});

// ============================================================================
// Export helpers for tests
// ============================================================================

export { localStorageMock };

// Helper to set dark mode preference
export function setDarkModePreference(isDark: boolean) {
  (window.matchMedia as ReturnType<typeof vi.fn>).mockImplementation((query: string) => ({
    matches: query === '(prefers-color-scheme: dark)' ? isDark : false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

// Helper to seed localStorage with test data
export function seedLocalStorage(data: Record<string, unknown>) {
  Object.entries(data).forEach(([key, value]) => {
    localStorageMock.setItem(key, JSON.stringify(value));
  });
}
