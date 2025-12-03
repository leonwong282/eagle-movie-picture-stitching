/**
 * Tests for lib/utils.ts
 * Pure utility functions - no mocking required
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  cn,
  debounce,
  throttle,
  formatFileSize,
  formatDate,
  sleep,
  generateId,
  safeJsonParse,
  isDefined,
  clamp,
} from '@/lib/utils';

// ============================================================================
// cn() - Class Name Merger
// ============================================================================

describe('cn', () => {
  it('merges multiple class strings', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('handles conditional classes', () => {
    const includeClass = true;
    const excludeClass = false;
    expect(cn('base', includeClass && 'included', excludeClass && 'excluded')).toBe(
      'base included'
    );
  });

  it('handles undefined and null', () => {
    expect(cn('base', undefined, null, 'end')).toBe('base end');
  });

  it('handles arrays of classes', () => {
    expect(cn(['foo', 'bar'], 'baz')).toBe('foo bar baz');
  });

  it('handles objects with boolean values', () => {
    expect(cn({ foo: true, bar: false, baz: true })).toBe('foo baz');
  });

  it('merges conflicting Tailwind classes correctly', () => {
    // Later class should override earlier
    expect(cn('px-4', 'px-6')).toBe('px-6');
    expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500');
    expect(cn('text-sm', 'text-lg')).toBe('text-lg');
  });

  it('preserves non-conflicting Tailwind classes', () => {
    expect(cn('px-4 py-2', 'mt-2')).toBe('px-4 py-2 mt-2');
  });

  it('handles empty inputs', () => {
    expect(cn()).toBe('');
    expect(cn('')).toBe('');
    expect(cn('', '', '')).toBe('');
  });
});

// ============================================================================
// debounce()
// ============================================================================

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('delays function execution', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced();
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(50);
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(50);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('resets timer on subsequent calls', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced();
    vi.advanceTimersByTime(50);
    debounced(); // Reset timer
    vi.advanceTimersByTime(50);
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(50);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('passes arguments to debounced function', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced('arg1', 'arg2');
    vi.advanceTimersByTime(100);

    expect(fn).toHaveBeenCalledWith('arg1', 'arg2');
  });

  it('uses latest arguments when called multiple times', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced('first');
    debounced('second');
    debounced('third');
    vi.advanceTimersByTime(100);

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith('third');
  });
});

// ============================================================================
// throttle()
// ============================================================================

describe('throttle', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('executes immediately on first call', () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 100);

    throttled();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('blocks subsequent calls within limit', () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 100);

    throttled();
    throttled();
    throttled();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('allows calls after limit expires', () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 100);

    throttled();
    vi.advanceTimersByTime(100);
    throttled();

    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('passes arguments to throttled function', () => {
    const fn = vi.fn();
    const throttled = throttle(fn, 100);

    throttled('arg1', 'arg2');
    expect(fn).toHaveBeenCalledWith('arg1', 'arg2');
  });
});

// ============================================================================
// formatFileSize()
// ============================================================================

describe('formatFileSize', () => {
  it('formats bytes', () => {
    expect(formatFileSize(0)).toBe('0 B');
    expect(formatFileSize(500)).toBe('500 B');
    expect(formatFileSize(1023)).toBe('1023 B');
  });

  it('formats kilobytes', () => {
    expect(formatFileSize(1024)).toBe('1 KB');
    expect(formatFileSize(1536)).toBe('1.5 KB');
    expect(formatFileSize(10240)).toBe('10 KB');
  });

  it('formats megabytes', () => {
    expect(formatFileSize(1048576)).toBe('1 MB');
    expect(formatFileSize(1572864)).toBe('1.5 MB');
    expect(formatFileSize(10485760)).toBe('10 MB');
  });

  it('formats gigabytes', () => {
    expect(formatFileSize(1073741824)).toBe('1 GB');
    expect(formatFileSize(1610612736)).toBe('1.5 GB');
  });

  it('formats terabytes', () => {
    expect(formatFileSize(1099511627776)).toBe('1 TB');
  });

  it('handles decimal precision correctly', () => {
    expect(formatFileSize(1234567)).toBe('1.18 MB');
    expect(formatFileSize(9876543210)).toBe('9.2 GB');
  });
});

// ============================================================================
// formatDate()
// ============================================================================

describe('formatDate', () => {
  it('formats timestamp to locale date string', () => {
    const timestamp = new Date('2024-06-15T12:00:00Z').getTime();
    const result = formatDate(timestamp, 'en-US');

    // Should contain month, day, year
    expect(result).toMatch(/Jun/);
    expect(result).toMatch(/15/);
    expect(result).toMatch(/2024/);
  });

  it('uses default locale when not specified', () => {
    const timestamp = Date.now();
    const result = formatDate(timestamp);

    // Should return a non-empty string
    expect(result).toBeTruthy();
    expect(typeof result).toBe('string');
  });

  it('handles different locales', () => {
    const timestamp = new Date('2024-01-15').getTime();

    const enResult = formatDate(timestamp, 'en-US');
    const deResult = formatDate(timestamp, 'de-DE');

    // Different locales should produce different results
    // (at least format should differ)
    expect(enResult).toContain('Jan');
    expect(deResult).toContain('Jan'); // German abbreviation is also "Jan"
  });
});

// ============================================================================
// sleep()
// ============================================================================

describe('sleep', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns a promise that resolves after specified time', async () => {
    const promise = sleep(100);

    vi.advanceTimersByTime(99);
    // Promise should still be pending

    vi.advanceTimersByTime(1);
    await promise;
    // Promise should be resolved now
  });

  it('resolves with undefined', async () => {
    const promise = sleep(0);
    await vi.advanceTimersByTimeAsync(0);
    const result = await promise;
    expect(result).toBeUndefined();
  });
});

// ============================================================================
// generateId()
// ============================================================================

describe('generateId', () => {
  it('generates string IDs', () => {
    const id = generateId();
    expect(typeof id).toBe('string');
    expect(id.length).toBeGreaterThan(0);
  });

  it('generates unique IDs', () => {
    const ids = new Set<string>();
    for (let i = 0; i < 1000; i++) {
      ids.add(generateId());
    }
    expect(ids.size).toBe(1000);
  });

  it('contains hyphen separator', () => {
    const id = generateId();
    expect(id).toContain('-');
  });
});

// ============================================================================
// safeJsonParse()
// ============================================================================

describe('safeJsonParse', () => {
  it('parses valid JSON', () => {
    expect(safeJsonParse('{"foo": "bar"}', {})).toEqual({ foo: 'bar' });
    expect(safeJsonParse('[1, 2, 3]', [])).toEqual([1, 2, 3]);
    expect(safeJsonParse('"hello"', '')).toBe('hello');
    expect(safeJsonParse('123', 0)).toBe(123);
    expect(safeJsonParse('true', false)).toBe(true);
    expect(safeJsonParse('null', 'default')).toBe(null);
  });

  it('returns fallback for invalid JSON', () => {
    expect(safeJsonParse('invalid', 'fallback')).toBe('fallback');
    expect(safeJsonParse('{broken}', {})).toEqual({});
    expect(safeJsonParse('', [])).toEqual([]);
    expect(safeJsonParse('undefined', null)).toBe(null);
  });

  it('returns fallback for syntax errors', () => {
    expect(safeJsonParse("{'single': 'quotes'}", {})).toEqual({});
    expect(safeJsonParse('[1, 2, 3,]', [])).toEqual([]); // Trailing comma
  });
});

// ============================================================================
// isDefined()
// ============================================================================

describe('isDefined', () => {
  it('returns true for defined values', () => {
    expect(isDefined('')).toBe(true);
    expect(isDefined(0)).toBe(true);
    expect(isDefined(false)).toBe(true);
    expect(isDefined([])).toBe(true);
    expect(isDefined({})).toBe(true);
    expect(isDefined('value')).toBe(true);
  });

  it('returns false for null', () => {
    expect(isDefined(null)).toBe(false);
  });

  it('returns false for undefined', () => {
    expect(isDefined(undefined)).toBe(false);
  });

  it('works as type guard', () => {
    const value: string | null | undefined = 'test';
    if (isDefined(value)) {
      // TypeScript should know value is string here
      expect(value.toUpperCase()).toBe('TEST');
    }
  });
});

// ============================================================================
// clamp()
// ============================================================================

describe('clamp', () => {
  it('returns value when within range', () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(0, 0, 10)).toBe(0);
    expect(clamp(10, 0, 10)).toBe(10);
  });

  it('returns min when value is below range', () => {
    expect(clamp(-5, 0, 10)).toBe(0);
    expect(clamp(-100, -50, 50)).toBe(-50);
  });

  it('returns max when value is above range', () => {
    expect(clamp(15, 0, 10)).toBe(10);
    expect(clamp(100, -50, 50)).toBe(50);
  });

  it('handles negative ranges', () => {
    expect(clamp(-25, -30, -20)).toBe(-25);
    expect(clamp(-35, -30, -20)).toBe(-30);
    expect(clamp(-15, -30, -20)).toBe(-20);
  });

  it('handles equal min and max', () => {
    expect(clamp(5, 5, 5)).toBe(5);
    expect(clamp(0, 5, 5)).toBe(5);
    expect(clamp(10, 5, 5)).toBe(5);
  });

  it('handles decimal values', () => {
    expect(clamp(0.5, 0, 1)).toBe(0.5);
    expect(clamp(-0.1, 0, 1)).toBe(0);
    expect(clamp(1.1, 0, 1)).toBe(1);
  });
});
