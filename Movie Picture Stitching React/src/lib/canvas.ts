/**
 * Canvas Utilities for Eagle Plugin Development
 *
 * Provides memory-safe canvas operations, size validation, and batch processing
 * patterns for image manipulation in Eagle plugins.
 *
 * @module canvas
 */

// ============================================================================
// Constants
// ============================================================================

/**
 * Maximum canvas dimension supported by browsers.
 * Both width and height must be <= this value.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas#maximum_canvas_size
 */
export const MAX_CANVAS_SIZE = 32767;

/**
 * Maximum total canvas area (width × height) in pixels.
 * Some browsers limit total pixels regardless of individual dimensions.
 * ~268 million pixels (roughly 16384 × 16384)
 */
export const MAX_CANVAS_AREA = 268435456;

/**
 * Recommended maximum images for batch processing.
 * Prevents memory exhaustion in typical plugin scenarios.
 */
export const RECOMMENDED_BATCH_SIZE = 50;

/**
 * Image loading timeout in milliseconds.
 */
export const IMAGE_LOAD_TIMEOUT = 30000;

// ============================================================================
// Types
// ============================================================================

export interface CanvasSize {
  width: number;
  height: number;
}

export interface CanvasValidationResult {
  valid: boolean;
  reason?: string;
  suggestedSize?: CanvasSize;
}

export interface ImageLoadResult {
  success: boolean;
  image?: HTMLImageElement;
  error?: Error;
  loadTime?: number;
}

export interface BatchProcessResult<T> {
  successful: T[];
  failed: Array<{ index: number; error: Error }>;
  totalTime: number;
}

// ============================================================================
// Canvas Validation
// ============================================================================

/**
 * Validates if canvas dimensions are within browser limits.
 *
 * @param width - Canvas width in pixels
 * @param height - Canvas height in pixels
 * @returns Validation result with reason if invalid
 *
 * @example
 * ```typescript
 * const result = validateCanvasSize(50000, 1000);
 * if (!result.valid) {
 *   console.error(result.reason);
 *   // Use result.suggestedSize for fallback
 * }
 * ```
 */
export function validateCanvasSize(width: number, height: number): CanvasValidationResult {
  // Check for valid positive numbers
  if (!Number.isFinite(width) || !Number.isFinite(height)) {
    return {
      valid: false,
      reason: 'Canvas dimensions must be finite numbers',
    };
  }

  if (width <= 0 || height <= 0) {
    return {
      valid: false,
      reason: 'Canvas dimensions must be positive',
    };
  }

  // Check individual dimension limits
  if (width > MAX_CANVAS_SIZE) {
    return {
      valid: false,
      reason: `Width ${width}px exceeds maximum ${MAX_CANVAS_SIZE}px`,
      suggestedSize: {
        width: MAX_CANVAS_SIZE,
        height: Math.round(height * (MAX_CANVAS_SIZE / width)),
      },
    };
  }

  if (height > MAX_CANVAS_SIZE) {
    return {
      valid: false,
      reason: `Height ${height}px exceeds maximum ${MAX_CANVAS_SIZE}px`,
      suggestedSize: {
        width: Math.round(width * (MAX_CANVAS_SIZE / height)),
        height: MAX_CANVAS_SIZE,
      },
    };
  }

  // Check total area limit
  const area = width * height;
  if (area > MAX_CANVAS_AREA) {
    const scale = Math.sqrt(MAX_CANVAS_AREA / area);
    return {
      valid: false,
      reason: `Total area ${area}px² exceeds maximum ${MAX_CANVAS_AREA}px²`,
      suggestedSize: {
        width: Math.floor(width * scale),
        height: Math.floor(height * scale),
      },
    };
  }

  return { valid: true };
}

/**
 * Calculates scaled dimensions that fit within canvas limits.
 *
 * @param width - Original width
 * @param height - Original height
 * @param maxDimension - Maximum dimension (defaults to MAX_CANVAS_SIZE)
 * @returns Scaled dimensions that fit within limits
 */
export function fitToCanvasLimits(
  width: number,
  height: number,
  maxDimension: number = MAX_CANVAS_SIZE
): CanvasSize {
  const maxDim = Math.min(maxDimension, MAX_CANVAS_SIZE);

  if (width <= maxDim && height <= maxDim) {
    // Check area limit
    if (width * height <= MAX_CANVAS_AREA) {
      return { width, height };
    }
  }

  // Scale down to fit
  let scale = 1;

  if (width > maxDim || height > maxDim) {
    scale = Math.min(maxDim / width, maxDim / height);
  }

  let newWidth = Math.floor(width * scale);
  let newHeight = Math.floor(height * scale);

  // Also check area
  if (newWidth * newHeight > MAX_CANVAS_AREA) {
    const areaScale = Math.sqrt(MAX_CANVAS_AREA / (newWidth * newHeight));
    newWidth = Math.floor(newWidth * areaScale);
    newHeight = Math.floor(newHeight * areaScale);
  }

  return { width: newWidth, height: newHeight };
}

// ============================================================================
// Canvas Memory Management
// ============================================================================

/**
 * Cleans up a canvas element to free GPU/memory resources.
 *
 * IMPORTANT: Always call this when done with a canvas to prevent memory leaks,
 * especially when processing multiple images.
 *
 * @param canvas - The canvas element to clean up
 *
 * @example
 * ```typescript
 * const canvas = document.createElement('canvas');
 * // ... do work ...
 * cleanupCanvas(canvas);  // Free memory
 * ```
 */
export function cleanupCanvas(canvas: HTMLCanvasElement): void {
  // Setting dimensions to 0 releases the backing buffer
  canvas.width = 0;
  canvas.height = 0;

  // Clear any context references
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.clearRect(0, 0, 0, 0);
  }
}

/**
 * Creates a canvas with specified dimensions, validating limits first.
 *
 * @param width - Desired width
 * @param height - Desired height
 * @param willReadFrequently - Optimize for getImageData calls
 * @returns Canvas element and 2D context, or null if dimensions invalid
 *
 * @example
 * ```typescript
 * const result = createCanvas(1920, 1080);
 * if (result) {
 *   const { canvas, ctx } = result;
 *   // ... draw operations ...
 *   cleanupCanvas(canvas);
 * }
 * ```
 */
export function createCanvas(
  width: number,
  height: number,
  willReadFrequently = false
): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } | null {
  const validation = validateCanvasSize(width, height);

  if (!validation.valid) {
    console.warn(`[Canvas] ${validation.reason}`);
    return null;
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d', { willReadFrequently });

  if (!ctx) {
    console.error('[Canvas] Failed to get 2D context');
    cleanupCanvas(canvas);
    return null;
  }

  return { canvas, ctx };
}

// ============================================================================
// Image Loading
// ============================================================================

/**
 * Loads an image with timeout and error handling.
 *
 * @param src - Image source URL or path
 * @param timeout - Timeout in milliseconds (default: 30000)
 * @returns Promise resolving to load result
 *
 * @example
 * ```typescript
 * const result = await loadImage('/path/to/image.jpg');
 * if (result.success && result.image) {
 *   ctx.drawImage(result.image, 0, 0);
 * }
 * ```
 */
export function loadImage(
  src: string,
  timeout: number = IMAGE_LOAD_TIMEOUT
): Promise<ImageLoadResult> {
  return new Promise((resolve) => {
    const startTime = performance.now();
    const img = new Image();
    let resolved = false;

    const timeoutId = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        resolve({
          success: false,
          error: new Error(`Image load timeout after ${timeout}ms: ${src}`),
        });
      }
    }, timeout);

    img.onload = () => {
      if (!resolved) {
        resolved = true;
        clearTimeout(timeoutId);
        resolve({
          success: true,
          image: img,
          loadTime: performance.now() - startTime,
        });
      }
    };

    img.onerror = () => {
      if (!resolved) {
        resolved = true;
        clearTimeout(timeoutId);
        resolve({
          success: false,
          error: new Error(`Failed to load image: ${src}`),
        });
      }
    };

    img.src = src;
  });
}

/**
 * Loads multiple images in parallel with concurrency control.
 *
 * @param sources - Array of image source URLs
 * @param concurrency - Maximum concurrent loads (default: 5)
 * @returns Promise resolving to array of load results
 */
export async function loadImages(
  sources: string[],
  concurrency: number = 5
): Promise<ImageLoadResult[]> {
  const results: ImageLoadResult[] = [];
  const queue = [...sources];

  async function worker(): Promise<void> {
    while (queue.length > 0) {
      const src = queue.shift();
      if (src) {
        const result = await loadImage(src);
        results.push(result);
      }
    }
  }

  // Start workers
  const workers = Array(Math.min(concurrency, sources.length))
    .fill(null)
    .map(() => worker());

  await Promise.all(workers);

  return results;
}

// ============================================================================
// Batch Processing
// ============================================================================

/**
 * Processes items in batches to prevent memory exhaustion.
 *
 * @param items - Array of items to process
 * @param processor - Async function to process each item
 * @param options - Batch processing options
 * @returns Promise resolving to batch results
 *
 * @example
 * ```typescript
 * const results = await processBatch(
 *   images,
 *   async (img) => {
 *     const canvas = createCanvas(img.width, img.height);
 *     // ... process ...
 *     cleanupCanvas(canvas);
 *     return processedData;
 *   },
 *   { batchSize: 10, onProgress: (p) => console.log(`${p}%`) }
 * );
 * ```
 */
export async function processBatch<T, R>(
  items: T[],
  processor: (item: T, index: number) => Promise<R>,
  options: {
    batchSize?: number;
    onProgress?: (percent: number, completed: number, total: number) => void;
    abortSignal?: AbortSignal;
  } = {}
): Promise<BatchProcessResult<R>> {
  const { batchSize = RECOMMENDED_BATCH_SIZE, onProgress, abortSignal } = options;

  const startTime = performance.now();
  const successful: R[] = [];
  const failed: Array<{ index: number; error: Error }> = [];

  for (let i = 0; i < items.length; i++) {
    // Check for abort
    if (abortSignal?.aborted) {
      break;
    }

    try {
      const result = await processor(items[i], i);
      successful.push(result);
    } catch (error) {
      failed.push({
        index: i,
        error: error instanceof Error ? error : new Error(String(error)),
      });
    }

    // Progress callback
    const completed = i + 1;
    const percent = Math.round((completed / items.length) * 100);
    onProgress?.(percent, completed, items.length);

    // Yield to event loop periodically to prevent UI freeze
    if (completed % batchSize === 0) {
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
  }

  return {
    successful,
    failed,
    totalTime: performance.now() - startTime,
  };
}

// ============================================================================
// Canvas Data Operations
// ============================================================================

/**
 * Converts canvas to data URL with memory-safe handling.
 *
 * @param canvas - Source canvas
 * @param type - Image MIME type
 * @param quality - Quality for lossy formats (0-1)
 * @returns Data URL string or null on error
 */
export function canvasToDataURL(
  canvas: HTMLCanvasElement,
  type: 'image/png' | 'image/jpeg' | 'image/webp' = 'image/png',
  quality: number = 0.92
): string | null {
  try {
    return canvas.toDataURL(type, quality);
  } catch (error) {
    console.error('[Canvas] Failed to convert to data URL:', error);
    return null;
  }
}

/**
 * Converts canvas to Blob with memory-safe handling.
 *
 * @param canvas - Source canvas
 * @param type - Image MIME type
 * @param quality - Quality for lossy formats (0-1)
 * @returns Promise resolving to Blob or null on error
 */
export function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: 'image/png' | 'image/jpeg' | 'image/webp' = 'image/png',
  quality: number = 0.92
): Promise<Blob | null> {
  return new Promise((resolve) => {
    try {
      canvas.toBlob(
        (blob) => {
          resolve(blob);
        },
        type,
        quality
      );
    } catch (error) {
      console.error('[Canvas] Failed to convert to blob:', error);
      resolve(null);
    }
  });
}

/**
 * Downloads canvas as image file.
 *
 * @param canvas - Source canvas
 * @param filename - Download filename (without extension)
 * @param type - Image MIME type
 * @param quality - Quality for lossy formats (0-1)
 */
export function downloadCanvas(
  canvas: HTMLCanvasElement,
  filename: string,
  type: 'image/png' | 'image/jpeg' | 'image/webp' = 'image/png',
  quality: number = 0.92
): void {
  const dataUrl = canvasToDataURL(canvas, type, quality);
  if (!dataUrl) return;

  const ext = type.split('/')[1];
  const link = document.createElement('a');
  link.download = `${filename}.${ext}`;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
