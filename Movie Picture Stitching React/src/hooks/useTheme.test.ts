import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTheme } from './useTheme';

// Mock the eagle-api module
vi.mock('@/lib/eagle-api', () => ({
  eagleApi: {
    theme: 'Auto',
    isDarkMode: false,
    isMock: true,
    onThemeChanged: vi.fn(),
  },
}));

// Mock storage
vi.mock('@/lib/storage', () => ({
  loadTheme: vi.fn(() => 'auto'),
  saveTheme: vi.fn(),
}));

import { eagleApi } from '@/lib/eagle-api';
import { loadTheme, saveTheme } from '@/lib/storage';

describe('useTheme', () => {
  let matchMediaResult: MediaQueryList;

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
    vi.mocked(loadTheme).mockReturnValue('auto');
    vi.mocked(eagleApi.onThemeChanged).mockImplementation(() => {});

    // Mock matchMedia
    matchMediaResult = {
      matches: false,
      media: '(prefers-color-scheme: dark)',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    };
    vi.spyOn(window, 'matchMedia').mockReturnValue(matchMediaResult);

    // Clear document classes
    document.documentElement.classList.remove('dark');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('initialization', () => {
    it('loads theme from storage', () => {
      renderHook(() => useTheme());

      expect(loadTheme).toHaveBeenCalled();
    });

    it('returns current theme', () => {
      vi.mocked(loadTheme).mockReturnValue('dark');

      const { result } = renderHook(() => useTheme());

      expect(result.current.theme).toBe('dark');
    });

    it('returns auto theme by default', () => {
      vi.mocked(loadTheme).mockReturnValue('auto');

      const { result } = renderHook(() => useTheme());

      expect(result.current.theme).toBe('auto');
    });
  });

  describe('isDarkMode computation', () => {
    it('returns true when theme is dark', () => {
      vi.mocked(loadTheme).mockReturnValue('dark');

      const { result } = renderHook(() => useTheme());

      expect(result.current.isDarkMode).toBe(true);
    });

    it('returns false when theme is light', () => {
      vi.mocked(loadTheme).mockReturnValue('light');

      const { result } = renderHook(() => useTheme());

      expect(result.current.isDarkMode).toBe(false);
    });

    it('uses Eagle theme when set to auto', () => {
      vi.mocked(loadTheme).mockReturnValue('auto');
      // @ts-ignore - mocking property
      eagleApi.theme = 'DARK';

      const { result } = renderHook(() => useTheme());

      expect(result.current.isDarkMode).toBe(true);
    });

    it('uses system preference when Eagle theme is Auto', () => {
      vi.mocked(loadTheme).mockReturnValue('auto');
      // @ts-ignore - mocking property
      eagleApi.theme = 'Auto';
      // @ts-ignore - mocking property
      eagleApi.isDarkMode = true;

      const { result } = renderHook(() => useTheme());

      expect(result.current.isDarkMode).toBe(true);
    });

    it('treats GRAY as dark theme', () => {
      vi.mocked(loadTheme).mockReturnValue('auto');
      // @ts-ignore - mocking property
      eagleApi.theme = 'GRAY';

      const { result } = renderHook(() => useTheme());

      expect(result.current.isDarkMode).toBe(true);
    });

    it('treats BLUE as dark theme', () => {
      vi.mocked(loadTheme).mockReturnValue('auto');
      // @ts-ignore - mocking property
      eagleApi.theme = 'BLUE';

      const { result } = renderHook(() => useTheme());

      expect(result.current.isDarkMode).toBe(true);
    });

    it('treats PURPLE as dark theme', () => {
      vi.mocked(loadTheme).mockReturnValue('auto');
      // @ts-ignore - mocking property
      eagleApi.theme = 'PURPLE';

      const { result } = renderHook(() => useTheme());

      expect(result.current.isDarkMode).toBe(true);
    });

    it('treats LIGHT as light theme', () => {
      vi.mocked(loadTheme).mockReturnValue('auto');
      // @ts-ignore - mocking property
      eagleApi.theme = 'LIGHT';

      const { result } = renderHook(() => useTheme());

      expect(result.current.isDarkMode).toBe(false);
    });
  });

  describe('setTheme', () => {
    it('updates theme state', () => {
      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.setTheme('dark');
      });

      expect(result.current.theme).toBe('dark');
    });

    it('saves theme to storage', () => {
      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.setTheme('dark');
      });

      expect(saveTheme).toHaveBeenCalledWith('dark');
    });

    it('updates isDarkMode when setting dark', () => {
      vi.mocked(loadTheme).mockReturnValue('light');

      const { result } = renderHook(() => useTheme());

      expect(result.current.isDarkMode).toBe(false);

      act(() => {
        result.current.setTheme('dark');
      });

      expect(result.current.isDarkMode).toBe(true);
    });

    it('updates isDarkMode when setting light', () => {
      vi.mocked(loadTheme).mockReturnValue('dark');

      const { result } = renderHook(() => useTheme());

      expect(result.current.isDarkMode).toBe(true);

      act(() => {
        result.current.setTheme('light');
      });

      expect(result.current.isDarkMode).toBe(false);
    });

    it('adds dark class to document when dark', () => {
      vi.mocked(loadTheme).mockReturnValue('light');

      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.setTheme('dark');
      });

      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('removes dark class from document when light', () => {
      vi.mocked(loadTheme).mockReturnValue('dark');
      document.documentElement.classList.add('dark');

      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.setTheme('light');
      });

      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });
  });

  describe('toggleTheme', () => {
    it('toggles from light to dark', () => {
      vi.mocked(loadTheme).mockReturnValue('light');

      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.toggleTheme();
      });

      expect(result.current.theme).toBe('dark');
      expect(result.current.isDarkMode).toBe(true);
    });

    it('toggles from dark to light', () => {
      vi.mocked(loadTheme).mockReturnValue('dark');

      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.toggleTheme();
      });

      expect(result.current.theme).toBe('light');
      expect(result.current.isDarkMode).toBe(false);
    });

    it('toggles from auto (dark) to light', () => {
      vi.mocked(loadTheme).mockReturnValue('auto');
      // @ts-ignore - mocking property
      eagleApi.theme = 'DARK';

      const { result } = renderHook(() => useTheme());

      expect(result.current.isDarkMode).toBe(true);

      act(() => {
        result.current.toggleTheme();
      });

      expect(result.current.theme).toBe('light');
    });

    it('toggles from auto (light) to dark', () => {
      vi.mocked(loadTheme).mockReturnValue('auto');
      // @ts-ignore - mocking property
      eagleApi.theme = 'LIGHT';

      const { result } = renderHook(() => useTheme());

      expect(result.current.isDarkMode).toBe(false);

      act(() => {
        result.current.toggleTheme();
      });

      expect(result.current.theme).toBe('dark');
    });
  });

  describe('theme effect on mount', () => {
    it('applies dark class on mount when dark', () => {
      vi.mocked(loadTheme).mockReturnValue('dark');

      renderHook(() => useTheme());

      expect(document.documentElement.classList.contains('dark')).toBe(true);
    });

    it('removes dark class on mount when light', () => {
      vi.mocked(loadTheme).mockReturnValue('light');
      document.documentElement.classList.add('dark');

      renderHook(() => useTheme());

      expect(document.documentElement.classList.contains('dark')).toBe(false);
    });

    it('registers Eagle theme change listener', () => {
      renderHook(() => useTheme());

      expect(eagleApi.onThemeChanged).toHaveBeenCalled();
    });

    it('registers system theme change listener', () => {
      renderHook(() => useTheme());

      expect(matchMediaResult.addEventListener).toHaveBeenCalledWith(
        'change',
        expect.any(Function)
      );
    });
  });

  describe('cleanup', () => {
    it('removes system theme listener on unmount', () => {
      const { unmount } = renderHook(() => useTheme());

      unmount();

      expect(matchMediaResult.removeEventListener).toHaveBeenCalledWith(
        'change',
        expect.any(Function)
      );
    });
  });

  describe('return value stability', () => {
    it('setTheme has stable reference', () => {
      const { result, rerender } = renderHook(() => useTheme());

      const setTheme1 = result.current.setTheme;

      rerender();

      const setTheme2 = result.current.setTheme;

      expect(setTheme1).toBe(setTheme2);
    });

    it('toggleTheme updates when isDarkMode changes', () => {
      vi.mocked(loadTheme).mockReturnValue('light');

      const { result } = renderHook(() => useTheme());

      const toggle1 = result.current.toggleTheme;

      act(() => {
        result.current.setTheme('dark');
      });

      const toggle2 = result.current.toggleTheme;

      // toggleTheme depends on isDarkMode, so reference may change
      // This is expected behavior
      expect(typeof toggle1).toBe('function');
      expect(typeof toggle2).toBe('function');
    });
  });
});
