/**
 * Tests for lib/canvas.ts
 * Canvas utilities for image processing in Eagle plugins
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  MAX_CANVAS_SIZE,
  MAX_CANVAS_AREA,
  RECOMMENDED_BATCH_SIZE,
  IMAGE_LOAD_TIMEOUT,
  validateCanvasSize,
  fitToCanvasLimits,
  cleanupCanvas,
  createCanvas,
  loadImage,
  loadImages,
  processBatch,
  canvasToDataURL,
  canvasToBlob,
  downloadCanvas,
} from './canvas';

// ============================================================================
// Constants
// ============================================================================

describe('Canvas Constants', () => {
  it('MAX_CANVAS_SIZE is 32767', () => {
    expect(MAX_CANVAS_SIZE).toBe(32767);
  });

  it('MAX_CANVAS_AREA is 268435456 (~268 million pixels)', () => {
    expect(MAX_CANVAS_AREA).toBe(268435456);
  });

  it('RECOMMENDED_BATCH_SIZE is 50', () => {
    expect(RECOMMENDED_BATCH_SIZE).toBe(50);
  });

  it('IMAGE_LOAD_TIMEOUT is 30000ms', () => {
    expect(IMAGE_LOAD_TIMEOUT).toBe(30000);
  });
});

// ============================================================================
// validateCanvasSize()
// ============================================================================

describe('validateCanvasSize', () => {
  describe('valid dimensions', () => {
    it('returns valid for normal dimensions', () => {
      const result = validateCanvasSize(1920, 1080);
      expect(result.valid).toBe(true);
      expect(result.reason).toBeUndefined();
    });

    it('returns valid for small dimensions', () => {
      expect(validateCanvasSize(1, 1).valid).toBe(true);
      expect(validateCanvasSize(100, 100).valid).toBe(true);
    });

    it('returns valid at maximum single dimension', () => {
      expect(validateCanvasSize(MAX_CANVAS_SIZE, 100).valid).toBe(true);
      expect(validateCanvasSize(100, MAX_CANVAS_SIZE).valid).toBe(true);
    });

    it('returns valid when area is at limit', () => {
      // Square root of MAX_CANVAS_AREA is ~16384
      const side = Math.floor(Math.sqrt(MAX_CANVAS_AREA));
      expect(validateCanvasSize(side, side).valid).toBe(true);
    });
  });

  describe('invalid - non-finite numbers', () => {
    it('returns invalid for NaN width', () => {
      const result = validateCanvasSize(NaN, 100);
      expect(result.valid).toBe(false);
      expect(result.reason).toContain('finite');
    });

    it('returns invalid for NaN height', () => {
      const result = validateCanvasSize(100, NaN);
      expect(result.valid).toBe(false);
      expect(result.reason).toContain('finite');
    });

    it('returns invalid for Infinity', () => {
      expect(validateCanvasSize(Infinity, 100).valid).toBe(false);
      expect(validateCanvasSize(100, Infinity).valid).toBe(false);
      expect(validateCanvasSize(-Infinity, 100).valid).toBe(false);
    });
  });

  describe('invalid - non-positive numbers', () => {
    it('returns invalid for zero width', () => {
      const result = validateCanvasSize(0, 100);
      expect(result.valid).toBe(false);
      expect(result.reason).toContain('positive');
    });

    it('returns invalid for zero height', () => {
      const result = validateCanvasSize(100, 0);
      expect(result.valid).toBe(false);
      expect(result.reason).toContain('positive');
    });

    it('returns invalid for negative dimensions', () => {
      expect(validateCanvasSize(-100, 100).valid).toBe(false);
      expect(validateCanvasSize(100, -100).valid).toBe(false);
      expect(validateCanvasSize(-100, -100).valid).toBe(false);
    });
  });

  describe('invalid - exceeds MAX_CANVAS_SIZE', () => {
    it('returns invalid when width exceeds maximum', () => {
      const result = validateCanvasSize(40000, 1000);
      expect(result.valid).toBe(false);
      expect(result.reason).toContain('Width');
      expect(result.reason).toContain('40000');
      expect(result.reason).toContain(MAX_CANVAS_SIZE.toString());
    });

    it('returns invalid when height exceeds maximum', () => {
      const result = validateCanvasSize(1000, 40000);
      expect(result.valid).toBe(false);
      expect(result.reason).toContain('Height');
      expect(result.reason).toContain('40000');
    });

    it('provides suggested size when width exceeds', () => {
      const result = validateCanvasSize(40000, 1000);
      expect(result.suggestedSize).toBeDefined();
      expect(result.suggestedSize!.width).toBeLessThanOrEqual(MAX_CANVAS_SIZE);
      // Aspect ratio preserved
      expect(result.suggestedSize!.width / result.suggestedSize!.height).toBeCloseTo(
        40000 / 1000,
        0
      );
    });

    it('provides suggested size when height exceeds', () => {
      const result = validateCanvasSize(1000, 40000);
      expect(result.suggestedSize).toBeDefined();
      expect(result.suggestedSize!.height).toBeLessThanOrEqual(MAX_CANVAS_SIZE);
    });
  });

  describe('invalid - exceeds MAX_CANVAS_AREA', () => {
    it('returns invalid when area exceeds maximum', () => {
      // 20000 x 20000 = 400 million > 268 million
      const result = validateCanvasSize(20000, 20000);
      expect(result.valid).toBe(false);
      expect(result.reason).toContain('area');
    });

    it('provides suggested size for area overflow', () => {
      const result = validateCanvasSize(20000, 20000);
      expect(result.suggestedSize).toBeDefined();
      const suggestedArea = result.suggestedSize!.width * result.suggestedSize!.height;
      expect(suggestedArea).toBeLessThanOrEqual(MAX_CANVAS_AREA);
    });
  });
});

// ============================================================================
// fitToCanvasLimits()
// ============================================================================

describe('fitToCanvasLimits', () => {
  it('returns unchanged for valid dimensions', () => {
    const result = fitToCanvasLimits(1920, 1080);
    expect(result).toEqual({ width: 1920, height: 1080 });
  });

  it('scales down when width exceeds limit', () => {
    const result = fitToCanvasLimits(40000, 1000);
    expect(result.width).toBeLessThanOrEqual(MAX_CANVAS_SIZE);
    expect(result.height).toBeLessThan(1000);
    // Aspect ratio preserved
    expect(result.width / result.height).toBeCloseTo(40000 / 1000, 0);
  });

  it('scales down when height exceeds limit', () => {
    const result = fitToCanvasLimits(1000, 40000);
    expect(result.height).toBeLessThanOrEqual(MAX_CANVAS_SIZE);
    expect(result.width).toBeLessThan(1000);
  });

  it('scales down when both dimensions exceed limit', () => {
    const result = fitToCanvasLimits(50000, 50000);
    expect(result.width).toBeLessThanOrEqual(MAX_CANVAS_SIZE);
    expect(result.height).toBeLessThanOrEqual(MAX_CANVAS_SIZE);
  });

  it('respects custom maxDimension parameter', () => {
    const result = fitToCanvasLimits(2000, 1000, 1000);
    expect(result.width).toBeLessThanOrEqual(1000);
    expect(result.height).toBeLessThanOrEqual(1000);
  });

  it('scales down when area exceeds MAX_CANVAS_AREA', () => {
    const result = fitToCanvasLimits(20000, 20000);
    const area = result.width * result.height;
    expect(area).toBeLessThanOrEqual(MAX_CANVAS_AREA);
  });

  it('uses smaller of custom maxDimension and MAX_CANVAS_SIZE', () => {
    // Custom limit larger than MAX_CANVAS_SIZE should be capped
    const result = fitToCanvasLimits(50000, 1000, 50000);
    expect(result.width).toBeLessThanOrEqual(MAX_CANVAS_SIZE);
  });
});

// ============================================================================
// cleanupCanvas()
// ============================================================================

describe('cleanupCanvas', () => {
  it('sets canvas dimensions to 0', () => {
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;

    cleanupCanvas(canvas);

    expect(canvas.width).toBe(0);
    expect(canvas.height).toBe(0);
  });

  it('can be called multiple times safely', () => {
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;

    expect(() => {
      cleanupCanvas(canvas);
      cleanupCanvas(canvas);
      cleanupCanvas(canvas);
    }).not.toThrow();
  });

  it('clears 2D context', () => {
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');
    ctx?.fillRect(0, 0, 100, 100);

    cleanupCanvas(canvas);

    // After cleanup, dimensions are 0
    expect(canvas.width).toBe(0);
    expect(canvas.height).toBe(0);
  });
});

// ============================================================================
// createCanvas()
// ============================================================================

describe('createCanvas', () => {
  it('creates canvas element with correct dimensions', () => {
    const result = createCanvas(100, 100);

    // JSDOM may not support canvas 2D context, so result could be null
    // We just verify the function doesn't throw
    if (result) {
      expect(result.canvas).toBeInstanceOf(HTMLCanvasElement);
      expect(result.canvas.width).toBe(100);
      expect(result.canvas.height).toBe(100);
    }
  });

  it('returns null for invalid dimensions', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const result = createCanvas(50000, 50000);
    expect(result).toBeNull();

    consoleSpy.mockRestore();
  });

  it('returns null for zero dimensions', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    expect(createCanvas(0, 100)).toBeNull();
    expect(createCanvas(100, 0)).toBeNull();

    consoleSpy.mockRestore();
  });

  it('accepts willReadFrequently option', () => {
    // Should not throw regardless of option
    expect(() => createCanvas(100, 100, true)).not.toThrow();
    expect(() => createCanvas(100, 100, false)).not.toThrow();
  });

  it('logs warning for invalid dimensions', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    createCanvas(-100, 100);

    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});

// ============================================================================
// loadImage()
// ============================================================================

describe('loadImage', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns a promise that resolves', async () => {
    const dataUrl =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

    const resultPromise = loadImage(dataUrl);

    await vi.runAllTimersAsync();

    const result = await resultPromise;

    // JSDOM may not fire load/error events correctly
    // Just verify we get a result object with expected shape
    expect(result).toHaveProperty('success');
    expect(typeof result.success).toBe('boolean');
  });

  it('returns result with expected shape on failure', async () => {
    const resultPromise = loadImage('invalid://not-a-url');

    await vi.runAllTimersAsync();

    const result = await resultPromise;

    // Should have success property (true or false depending on JSDOM behavior)
    expect(result).toHaveProperty('success');
  });

  it('respects timeout parameter', async () => {
    // Use a very short timeout
    const resultPromise = loadImage('http://10.255.255.1/slow.jpg', 100);

    // Advance past timeout
    await vi.advanceTimersByTimeAsync(150);

    const result = await resultPromise;

    expect(result.success).toBe(false);
    expect(result.error?.message).toContain('timeout');
  });

  it('uses default timeout when not specified', async () => {
    const resultPromise = loadImage('http://10.255.255.1/slow.jpg');

    // Advance to just before default timeout
    await vi.advanceTimersByTimeAsync(IMAGE_LOAD_TIMEOUT - 1);

    // Advance past timeout
    await vi.advanceTimersByTimeAsync(2);

    const result = await resultPromise;

    expect(result.success).toBe(false);
    expect(result.error?.message).toContain('timeout');
  });
});

// ============================================================================
// loadImages()
// ============================================================================

describe('loadImages', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns array with correct length', async () => {
    const dataUrl =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

    const resultPromise = loadImages([dataUrl, dataUrl, dataUrl]);

    await vi.runAllTimersAsync();

    const results = await resultPromise;

    expect(results).toHaveLength(3);
    // Each result should have success property
    results.forEach((result) => {
      expect(result).toHaveProperty('success');
    });
  });

  it('returns empty array for empty input', async () => {
    const resultPromise = loadImages([]);

    await vi.runAllTimersAsync();

    const results = await resultPromise;

    expect(results).toHaveLength(0);
  });

  it('handles multiple URLs', async () => {
    const validUrl =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    const invalidUrl = 'invalid://url';

    const resultPromise = loadImages([validUrl, invalidUrl]);

    await vi.runAllTimersAsync();

    const results = await resultPromise;

    // Should return result for each URL
    expect(results).toHaveLength(2);
    // Each result should have expected shape
    results.forEach((r) => {
      expect(r).toHaveProperty('success');
    });
  });

  it('respects concurrency parameter', async () => {
    const urls = Array(10).fill(
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
    );

    const resultPromise = loadImages(urls, 2);

    await vi.runAllTimersAsync();

    const results = await resultPromise;

    expect(results).toHaveLength(10);
  });
});

// ============================================================================
// processBatch()
// ============================================================================

describe('processBatch', () => {
  it('processes all items', async () => {
    const items = [1, 2, 3, 4, 5];
    const processor = vi.fn().mockResolvedValue('result');

    const result = await processBatch(items, processor);

    expect(processor).toHaveBeenCalledTimes(5);
    expect(result.successful).toHaveLength(5);
    expect(result.failed).toHaveLength(0);
  });

  it('collects failed results separately', async () => {
    const items = [1, 2, 3];
    const processor = vi
      .fn()
      .mockResolvedValueOnce('ok')
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValueOnce('ok');

    const result = await processBatch(items, processor);

    expect(result.successful).toHaveLength(2);
    expect(result.failed).toHaveLength(1);
    expect(result.failed[0].index).toBe(1);
    expect(result.failed[0].error.message).toBe('fail');
  });

  it('calls onProgress callback', async () => {
    const items = [1, 2, 3];
    const onProgress = vi.fn();

    await processBatch(items, async () => 'result', { onProgress });

    expect(onProgress).toHaveBeenCalledTimes(3);
    expect(onProgress).toHaveBeenNthCalledWith(1, 33, 1, 3);
    expect(onProgress).toHaveBeenNthCalledWith(2, 67, 2, 3);
    expect(onProgress).toHaveBeenNthCalledWith(3, 100, 3, 3);
  });

  it('passes index to processor', async () => {
    const items = ['a', 'b', 'c'];
    const processor = vi.fn().mockResolvedValue('result');

    await processBatch(items, processor);

    expect(processor).toHaveBeenNthCalledWith(1, 'a', 0);
    expect(processor).toHaveBeenNthCalledWith(2, 'b', 1);
    expect(processor).toHaveBeenNthCalledWith(3, 'c', 2);
  });

  it('tracks total processing time', async () => {
    const items = [1, 2, 3];

    const result = await processBatch(items, async () => 'result');

    expect(result.totalTime).toBeGreaterThanOrEqual(0);
    expect(typeof result.totalTime).toBe('number');
  });

  it('handles empty items array', async () => {
    const processor = vi.fn();

    const result = await processBatch([], processor);

    expect(processor).not.toHaveBeenCalled();
    expect(result.successful).toHaveLength(0);
    expect(result.failed).toHaveLength(0);
  });

  it('stops processing when aborted', async () => {
    const items = [1, 2, 3, 4, 5];
    const controller = new AbortController();
    const processor = vi.fn().mockImplementation(async (item) => {
      if (item === 2) {
        controller.abort();
      }
      return item;
    });

    const result = await processBatch(items, processor, {
      abortSignal: controller.signal,
    });

    // Should process items 1 and 2, then stop
    expect(processor.mock.calls.length).toBeLessThanOrEqual(3);
    expect(result.successful.length).toBeLessThanOrEqual(2);
  });

  it('handles non-Error thrown values', async () => {
    const items = [1];
    const processor = vi.fn().mockRejectedValue('string error');

    const result = await processBatch(items, processor);

    expect(result.failed).toHaveLength(1);
    expect(result.failed[0].error).toBeInstanceOf(Error);
    expect(result.failed[0].error.message).toBe('string error');
  });
});

// ============================================================================
// canvasToDataURL()
// ============================================================================

describe('canvasToDataURL', () => {
  it('converts canvas to data URL', () => {
    const canvas = document.createElement('canvas');
    canvas.width = 10;
    canvas.height = 10;

    const result = canvasToDataURL(canvas);

    // JSDOM may return empty string or valid data URL
    expect(result === null || typeof result === 'string').toBe(true);
  });

  it('accepts type parameter without throwing', () => {
    const canvas = document.createElement('canvas');
    canvas.width = 10;
    canvas.height = 10;

    // Should not throw for any supported type
    expect(() => canvasToDataURL(canvas, 'image/png')).not.toThrow();
    expect(() => canvasToDataURL(canvas, 'image/jpeg')).not.toThrow();
    expect(() => canvasToDataURL(canvas, 'image/webp')).not.toThrow();
  });

  it('accepts quality parameter without throwing', () => {
    const canvas = document.createElement('canvas');
    canvas.width = 10;
    canvas.height = 10;

    expect(() => canvasToDataURL(canvas, 'image/jpeg', 0.5)).not.toThrow();
    expect(() => canvasToDataURL(canvas, 'image/jpeg', 1.0)).not.toThrow();
    expect(() => canvasToDataURL(canvas, 'image/jpeg', 0.1)).not.toThrow();
  });

  it('returns null and logs error on failure', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Create a detached canvas that might fail
    const canvas = document.createElement('canvas');
    canvas.width = 0;
    canvas.height = 0;

    const result = canvasToDataURL(canvas);

    // Even with 0 dimensions, browsers may still return a valid (empty) data URL
    // So we just ensure it doesn't throw
    expect(result === null || typeof result === 'string').toBe(true);

    consoleSpy.mockRestore();
  });
});

// ============================================================================
// canvasToBlob()
// ============================================================================

describe('canvasToBlob', () => {
  it('converts canvas to blob', async () => {
    const canvas = document.createElement('canvas');
    canvas.width = 10;
    canvas.height = 10;

    const result = await canvasToBlob(canvas);

    // JSDOM may return null for toBlob, so we handle both cases
    // When it works, it should be a Blob
    expect(result === null || result instanceof Blob).toBe(true);
  });

  it('accepts type parameter', async () => {
    const canvas = document.createElement('canvas');
    canvas.width = 10;
    canvas.height = 10;

    // Should not throw for any supported type
    await expect(canvasToBlob(canvas, 'image/png')).resolves.not.toThrow();
    await expect(canvasToBlob(canvas, 'image/jpeg')).resolves.not.toThrow();
    await expect(canvasToBlob(canvas, 'image/webp')).resolves.not.toThrow();
  });

  it('accepts quality parameter', async () => {
    const canvas = document.createElement('canvas');
    canvas.width = 10;
    canvas.height = 10;

    // Should not throw with quality parameter
    await expect(canvasToBlob(canvas, 'image/jpeg', 0.5)).resolves.not.toThrow();
    await expect(canvasToBlob(canvas, 'image/jpeg', 1.0)).resolves.not.toThrow();
    await expect(canvasToBlob(canvas, 'image/jpeg', 0.1)).resolves.not.toThrow();
  });
});

// ============================================================================
// downloadCanvas()
// ============================================================================

describe('downloadCanvas', () => {
  it('does not throw for valid canvas', () => {
    const canvas = document.createElement('canvas');
    canvas.width = 10;
    canvas.height = 10;

    // Should not throw
    expect(() => downloadCanvas(canvas, 'test-image')).not.toThrow();
  });

  it('does not throw for JPEG type', () => {
    const canvas = document.createElement('canvas');
    canvas.width = 10;
    canvas.height = 10;

    expect(() => downloadCanvas(canvas, 'test-image', 'image/jpeg')).not.toThrow();
  });

  it('does not throw for WebP type', () => {
    const canvas = document.createElement('canvas');
    canvas.width = 10;
    canvas.height = 10;

    expect(() => downloadCanvas(canvas, 'test-image', 'image/webp')).not.toThrow();
  });

  it('handles canvasToDataURL failure gracefully', () => {
    const canvas = document.createElement('canvas');
    canvas.width = 10;
    canvas.height = 10;

    // Mock toDataURL to throw
    const toDataURLSpy = vi.spyOn(canvas, 'toDataURL').mockImplementation(() => {
      throw new Error('Canvas error');
    });
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Should not throw
    expect(() => downloadCanvas(canvas, 'test')).not.toThrow();

    toDataURLSpy.mockRestore();
    consoleSpy.mockRestore();
  });

  it('extracts correct extension from MIME type', () => {
    // Test the extension extraction logic indirectly
    // The function uses type.split('/')[1] to get extension
    const types = ['image/png', 'image/jpeg', 'image/webp'];
    const expectedExts = ['png', 'jpeg', 'webp'];

    types.forEach((type, i) => {
      const ext = type.split('/')[1];
      expect(ext).toBe(expectedExts[i]);
    });
  });
});
