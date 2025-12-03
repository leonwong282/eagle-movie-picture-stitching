/**
 * Stitching Engine
 *
 * Core image stitching functionality for vertical concatenation of images
 * with configurable crop parameters.
 *
 * @module stitching-engine
 */

import {
  validateCanvasSize,
  createCanvas,
  cleanupCanvas,
  loadImage,
  canvasToDataURL,
  canvasToBlob,
  MAX_CANVAS_SIZE,
  type ImageLoadResult,
} from './canvas';
import type { ExportFormat } from '@/stores';

// ============================================================================
// Types
// ============================================================================

export interface ImageData {
  /** Image source URL */
  url: string;
  /** Image width in pixels */
  width: number;
  /** Image height in pixels */
  height: number;
  /** Image name (for display) */
  name: string;
}

export interface LoadedImage {
  /** Loaded HTMLImageElement */
  img: HTMLImageElement;
  /** Original image data */
  data: ImageData;
}

export interface StitchingParams {
  /** Top crop percentage (0-99) */
  cropTopPercent: number;
  /** Bottom crop percentage (0-99) */
  cropBottomPercent: number;
}

export interface ExportOptions {
  /** Export format */
  format: ExportFormat;
  /** Quality for lossy formats (0.1-1.0) */
  quality: number;
}

export interface StitchingResult {
  /** Resulting canvas element */
  canvas: HTMLCanvasElement;
  /** Final width in pixels */
  width: number;
  /** Final height in pixels */
  height: number;
  /** Number of images stitched */
  imageCount: number;
  /** Processing time in milliseconds */
  processingTime: number;
}

export interface ValidationResult {
  /** Whether validation passed */
  isValid: boolean;
  /** Validation error messages */
  errors: string[];
  /** Suggested dimensions if resize needed */
  suggestedDimensions?: { width: number; height: number };
}

// ============================================================================
// Constants
// ============================================================================

/** Maximum total crop percentage allowed */
export const MAX_CROP_TOTAL = 99;

/** Recommended maximum images for batch processing */
export const RECOMMENDED_MAX_IMAGES = 50;

/** Image loading timeout in milliseconds */
export const IMAGE_LOAD_TIMEOUT = 30000;

// ============================================================================
// Validation
// ============================================================================

/**
 * Validate stitching parameters
 */
export function validateParams(params: StitchingParams): ValidationResult {
  const errors: string[] = [];

  if (params.cropTopPercent < 0 || params.cropTopPercent > 99) {
    errors.push('Top crop percentage must be between 0 and 99');
  }

  if (params.cropBottomPercent < 0 || params.cropBottomPercent > 99) {
    errors.push('Bottom crop percentage must be between 0 and 99');
  }

  if (params.cropTopPercent + params.cropBottomPercent >= 100) {
    errors.push('Total crop percentage cannot exceed 99%');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate image selection
 */
export function validateSelection(images: ImageData[]): ValidationResult {
  const errors: string[] = [];

  if (!images || images.length === 0) {
    errors.push('No images selected');
  }

  if (images && images.length > RECOMMENDED_MAX_IMAGES) {
    errors.push(`Too many images selected (${images.length}). Maximum recommended: ${RECOMMENDED_MAX_IMAGES}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// ============================================================================
// Dimension Calculations
// ============================================================================

/**
 * Calculate the total height of the stitched image
 *
 * @param images - Array of loaded images
 * @param params - Cropping parameters
 * @returns Total height in pixels
 */
export function calculateTotalHeight(
  images: LoadedImage[],
  params: StitchingParams
): number {
  const { cropTopPercent, cropBottomPercent } = params;

  return images.reduce((sum, { data }, index) => {
    if (index === 0) {
      // First image: only crop bottom
      const cropBottom = Math.round(data.height * (cropBottomPercent / 100));
      return sum + (data.height - cropBottom);
    } else {
      // Other images: crop top and bottom
      const cropTop = Math.round(data.height * (cropTopPercent / 100));
      const cropBottom = Math.round(data.height * (cropBottomPercent / 100));
      return sum + (data.height - cropTop - cropBottom);
    }
  }, 0);
}

/**
 * Calculate the maximum width among all images
 *
 * @param images - Array of loaded images
 * @returns Maximum width in pixels
 */
export function calculateMaxWidth(images: LoadedImage[]): number {
  return Math.max(...images.map(({ data }) => data.width));
}

/**
 * Validate final canvas dimensions
 *
 * @param width - Canvas width
 * @param height - Canvas height
 * @returns Validation result with suggested resize if needed
 */
export function validateCanvasDimensions(
  width: number,
  height: number
): ValidationResult {
  const validation = validateCanvasSize(width, height);

  if (!validation.valid) {
    return {
      isValid: false,
      errors: [validation.reason || 'Canvas dimensions exceed browser limits'],
      suggestedDimensions: validation.suggestedSize,
    };
  }

  return {
    isValid: true,
    errors: [],
  };
}

// ============================================================================
// Image Loading
// ============================================================================

/**
 * Load a single image with metadata
 *
 * @param imageData - Image data with URL
 * @param index - Image index (for logging)
 * @param total - Total images (for logging)
 * @returns Loaded image with metadata or null if failed
 */
export async function loadSingleImage(
  imageData: ImageData,
  index: number,
  total: number
): Promise<LoadedImage | null> {
  try {
    const result: ImageLoadResult = await loadImage(imageData.url, IMAGE_LOAD_TIMEOUT);

    if (result.success && result.image) {
      console.log(`[Stitching] Image ${index + 1}/${total} loaded: ${imageData.name}`);
      return {
        img: result.image,
        data: imageData,
      };
    } else {
      console.warn(`[Stitching] Image ${index + 1}/${total} failed: ${result.error?.message}`);
      return null;
    }
  } catch (error) {
    console.error(`[Stitching] Image ${index + 1}/${total} error:`, error);
    return null;
  }
}

/**
 * Load multiple images in parallel
 *
 * @param images - Array of image data
 * @returns Array of successfully loaded images
 */
export async function loadImages(images: ImageData[]): Promise<LoadedImage[]> {
  const loadPromises = images.map((data, index) =>
    loadSingleImage(data, index, images.length)
  );

  const results = await Promise.all(loadPromises);
  return results.filter((result): result is LoadedImage => result !== null);
}

// ============================================================================
// Rendering
// ============================================================================

/**
 * Render stitched image to canvas
 *
 * @param images - Array of loaded images
 * @param params - Cropping parameters
 * @returns Stitched canvas element
 * @throws Error if canvas creation fails
 */
export function renderStitchedImage(
  images: LoadedImage[],
  params: StitchingParams
): HTMLCanvasElement {
  const startTime = performance.now();

  // Validate parameters
  const paramValidation = validateParams(params);
  if (!paramValidation.isValid) {
    throw new Error(paramValidation.errors.join(', '));
  }

  // Calculate dimensions
  const totalHeight = calculateTotalHeight(images, params);
  const maxWidth = calculateMaxWidth(images);

  // Validate canvas dimensions
  const dimensionValidation = validateCanvasDimensions(maxWidth, totalHeight);
  if (!dimensionValidation.isValid) {
    throw new Error(dimensionValidation.errors.join(', '));
  }

  // Create canvas
  const result = createCanvas(maxWidth, totalHeight);
  if (!result) {
    throw new Error('Failed to create canvas');
  }

  const { canvas, ctx } = result;
  const { cropTopPercent, cropBottomPercent } = params;

  let currentY = 0;

  // Draw images
  images.forEach(({ img, data }, index) => {
    if (index === 0) {
      // First image: only crop bottom
      const cropBottom = Math.round(data.height * (cropBottomPercent / 100));
      const cropHeight = data.height - cropBottom;

      if (cropHeight > 0) {
        ctx.drawImage(
          img,
          0, 0, data.width, cropHeight, // Source
          0, currentY, data.width, cropHeight // Destination
        );
        currentY += cropHeight;
      }
    } else {
      // Other images: crop top and bottom
      const cropTop = Math.round(data.height * (cropTopPercent / 100));
      const cropBottom = Math.round(data.height * (cropBottomPercent / 100));
      const cropHeight = data.height - cropTop - cropBottom;

      if (cropHeight > 0) {
        ctx.drawImage(
          img,
          0, cropTop, data.width, cropHeight, // Source
          0, currentY, data.width, cropHeight // Destination
        );
        currentY += cropHeight;
      }
    }
  });

  const processingTime = performance.now() - startTime;
  console.log(`[Stitching] Rendered ${images.length} images in ${processingTime.toFixed(2)}ms`);

  return canvas;
}

// ============================================================================
// Export
// ============================================================================

/**
 * Get MIME type for export format
 */
function getMimeType(format: ExportFormat): 'image/png' | 'image/jpeg' | 'image/webp' {
  switch (format) {
    case 'png':
      return 'image/png';
    case 'webp':
      return 'image/webp';
    case 'jpg':
    default:
      return 'image/jpeg';
  }
}

/**
 * Get file extension for export format
 */
export function getFileExtension(format: ExportFormat): string {
  switch (format) {
    case 'png':
      return 'png';
    case 'webp':
      return 'webp';
    case 'jpg':
    default:
      return 'jpg';
  }
}

/**
 * Convert canvas to data URL
 *
 * @param canvas - Source canvas
 * @param options - Export options
 * @returns Data URL string or null on error
 */
export function canvasToDataUrlWithFormat(
  canvas: HTMLCanvasElement,
  options: ExportOptions
): string | null {
  const mimeType = getMimeType(options.format);
  // PNG doesn't use quality parameter
  const quality = options.format === 'png' ? undefined : options.quality;

  return canvasToDataURL(canvas, mimeType, quality ?? 0.92);
}

/**
 * Convert canvas to Blob
 *
 * @param canvas - Source canvas
 * @param options - Export options
 * @returns Promise resolving to Blob or null on error
 */
export async function canvasToBlobWithFormat(
  canvas: HTMLCanvasElement,
  options: ExportOptions
): Promise<Blob | null> {
  const mimeType = getMimeType(options.format);
  const quality = options.format === 'png' ? undefined : options.quality;

  return canvasToBlob(canvas, mimeType, quality ?? 0.92);
}

/**
 * Convert data URL to Buffer (for saving to file)
 *
 * @param dataUrl - Data URL string
 * @param format - Export format
 * @returns Buffer
 */
export function dataUrlToBuffer(dataUrl: string, format: ExportFormat): Buffer {
  const mimeType = getMimeType(format).split('/')[1];
  const base64Data = dataUrl.replace(new RegExp(`^data:image/${mimeType};base64,`), '');
  return Buffer.from(base64Data, 'base64');
}

/**
 * Generate a safe filename for the stitched image
 *
 * @param format - Export format
 * @returns Generated filename
 */
export function generateFilename(format: ExportFormat): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const extension = getFileExtension(format);
  return `stitched_${timestamp}.${extension}`;
}

// ============================================================================
// Full Stitching Pipeline
// ============================================================================

/**
 * Complete stitching pipeline: load images, validate, render
 *
 * @param imageData - Array of image data
 * @param params - Cropping parameters
 * @returns Stitching result
 */
export async function stitchImages(
  imageData: ImageData[],
  params: StitchingParams
): Promise<StitchingResult> {
  const startTime = performance.now();

  // Validate selection
  const selectionValidation = validateSelection(imageData);
  if (!selectionValidation.isValid) {
    throw new Error(selectionValidation.errors.join(', '));
  }

  // Validate parameters
  const paramValidation = validateParams(params);
  if (!paramValidation.isValid) {
    throw new Error(paramValidation.errors.join(', '));
  }

  // Load images
  const loadedImages = await loadImages(imageData);

  if (loadedImages.length === 0) {
    throw new Error('All images failed to load');
  }

  if (loadedImages.length < imageData.length) {
    console.warn(
      `[Stitching] ${imageData.length - loadedImages.length} images failed to load`
    );
  }

  // Render stitched image
  const canvas = renderStitchedImage(loadedImages, params);

  const processingTime = performance.now() - startTime;

  return {
    canvas,
    width: canvas.width,
    height: canvas.height,
    imageCount: loadedImages.length,
    processingTime,
  };
}

// ============================================================================
// Utility Exports
// ============================================================================

export {
  cleanupCanvas,
  MAX_CANVAS_SIZE,
};

