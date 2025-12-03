/**
 * Stitching Slice
 *
 * Manages state specific to the Movie Picture Stitching functionality:
 * - Cropping parameters
 * - Export format and quality
 * - Image reordering
 * - Preview generation state
 * - Lightbox state
 */

import type { StateCreator } from 'zustand';
import type { Item } from '@/types/eagle';

// ============================================================================
// Types
// ============================================================================

export type ExportFormat = 'jpg' | 'png' | 'webp';

export interface StitchingState {
  /** Reordered images (null = use Eagle selection order) */
  reorderedImages: Item[] | null;

  /** Top crop percentage (0-99) */
  cropTopPercent: number;

  /** Bottom crop percentage (0-99) */
  cropBottomPercent: number;

  /** Export format */
  exportFormat: ExportFormat;

  /** Export quality (0.1-1.0, applies to jpg/webp only) */
  exportQuality: number;

  /** Whether preview has been generated at least once */
  hasPreviewGenerated: boolean;

  /** Preview canvas element (stored as ref for React) */
  previewCanvas: HTMLCanvasElement | null;

  /** Whether window is pinned (always on top) */
  isAlwaysOnTop: boolean;

  /** Whether lightbox is open */
  isLightboxOpen: boolean;

  /** Current zoom level in lightbox (1.0 = 100%) */
  lightboxZoom: number;

  /** Lightbox pan offset */
  lightboxOffset: { x: number; y: number };

  /** Loaded images cache for auto-preview performance */
  loadedImagesCache: Array<{
    img: HTMLImageElement;
    data: { url: string; width: number; height: number; name: string };
  }> | null;

  /** Last image URLs for cache invalidation */
  lastImageUrls: string[] | null;
}

export interface StitchingActions {
  /** Set reordered images */
  setReorderedImages: (images: Item[] | null) => void;

  /** Reorder images by moving from one index to another */
  reorderImages: (fromIndex: number, toIndex: number) => void;

  /** Reset image order to Eagle selection */
  resetImageOrder: () => void;

  /** Set top crop percentage */
  setCropTopPercent: (percent: number) => void;

  /** Set bottom crop percentage */
  setCropBottomPercent: (percent: number) => void;

  /** Set both crop values with validation */
  setCropValues: (top: number, bottom: number) => void;

  /** Get maximum allowed crop for top (considering current bottom) */
  getMaxCropTop: () => number;

  /** Get maximum allowed crop for bottom (considering current top) */
  getMaxCropBottom: () => number;

  /** Set export format */
  setExportFormat: (format: ExportFormat) => void;

  /** Set export quality */
  setExportQuality: (quality: number) => void;

  /** Set preview generated flag */
  setHasPreviewGenerated: (generated: boolean) => void;

  /** Set preview canvas */
  setPreviewCanvas: (canvas: HTMLCanvasElement | null) => void;

  /** Set always on top state */
  setIsAlwaysOnTop: (alwaysOnTop: boolean) => void;

  /** Toggle always on top */
  toggleAlwaysOnTop: () => void;

  /** Open lightbox */
  openLightbox: () => void;

  /** Close lightbox */
  closeLightbox: () => void;

  /** Set lightbox zoom */
  setLightboxZoom: (zoom: number) => void;

  /** Set lightbox offset (for panning) */
  setLightboxOffset: (offset: { x: number; y: number }) => void;

  /** Reset lightbox view */
  resetLightboxView: () => void;

  /** Set loaded images cache */
  setLoadedImagesCache: (
    cache: Array<{
      img: HTMLImageElement;
      data: { url: string; width: number; height: number; name: string };
    }> | null
  ) => void;

  /** Set last image URLs */
  setLastImageUrls: (urls: string[] | null) => void;

  /** Clear all caches (call when selection changes) */
  clearCaches: () => void;

  /** Reset all stitching state to defaults */
  resetStitchingState: () => void;
}

export type StitchingSlice = { stitching: StitchingState & StitchingActions };

// ============================================================================
// Constants
// ============================================================================

const MAX_CROP_TOTAL = 99;
const MIN_CROP = 0;
const MAX_CROP = 99;
const MIN_QUALITY = 0.1;
const MAX_QUALITY = 1.0;
const MIN_ZOOM = 0.1;
const MAX_ZOOM = 5.0;

// ============================================================================
// Initial State
// ============================================================================

export const initialStitchingState: StitchingState = {
  reorderedImages: null,
  cropTopPercent: 84,
  cropBottomPercent: 5, // Default 5% for movie subtitles
  exportFormat: 'jpg',
  exportQuality: 0.92,
  hasPreviewGenerated: false,
  previewCanvas: null,
  isAlwaysOnTop: false,
  isLightboxOpen: false,
  lightboxZoom: 1.0,
  lightboxOffset: { x: 0, y: 0 },
  loadedImagesCache: null,
  lastImageUrls: null,
};

// ============================================================================
// Slice Creator
// ============================================================================

export const createStitchingSlice: StateCreator<
  StitchingSlice,
  [],
  [],
  StitchingSlice
> = (set, get) => ({
  stitching: {
    ...initialStitchingState,

    setReorderedImages: (images) => {
      set((state) => ({
        stitching: {
          ...state.stitching,
          reorderedImages: images,
        },
      }));
    },

    reorderImages: (fromIndex, toIndex) => {
      const state = get();
      const currentImages = state.stitching.reorderedImages;

      if (!currentImages) {
        console.warn('[Stitching] Cannot reorder: no images set');
        return;
      }

      const newImages = [...currentImages];
      const [movedItem] = newImages.splice(fromIndex, 1);
      newImages.splice(toIndex, 0, movedItem);

      set((s) => ({
        stitching: {
          ...s.stitching,
          reorderedImages: newImages,
          // Clear cache when order changes
          loadedImagesCache: null,
          lastImageUrls: null,
        },
      }));
    },

    resetImageOrder: () => {
      set((state) => ({
        stitching: {
          ...state.stitching,
          reorderedImages: null,
          loadedImagesCache: null,
          lastImageUrls: null,
        },
      }));
    },

    setCropTopPercent: (percent) => {
      const clamped = Math.max(MIN_CROP, Math.min(MAX_CROP, Math.round(percent)));
      const state = get();
      const maxAllowed = MAX_CROP_TOTAL - state.stitching.cropBottomPercent;
      const finalValue = Math.min(clamped, maxAllowed);

      set((s) => ({
        stitching: {
          ...s.stitching,
          cropTopPercent: finalValue,
        },
      }));
    },

    setCropBottomPercent: (percent) => {
      const clamped = Math.max(MIN_CROP, Math.min(MAX_CROP, Math.round(percent)));
      const state = get();
      const maxAllowed = MAX_CROP_TOTAL - state.stitching.cropTopPercent;
      const finalValue = Math.min(clamped, maxAllowed);

      set((s) => ({
        stitching: {
          ...s.stitching,
          cropBottomPercent: finalValue,
        },
      }));
    },

    setCropValues: (top, bottom) => {
      let topValue = Math.max(MIN_CROP, Math.min(MAX_CROP, Math.round(top)));
      let bottomValue = Math.max(MIN_CROP, Math.min(MAX_CROP, Math.round(bottom)));

      // Ensure total doesn't exceed maximum
      if (topValue + bottomValue > MAX_CROP_TOTAL) {
        const ratio = MAX_CROP_TOTAL / (topValue + bottomValue);
        topValue = Math.floor(topValue * ratio);
        bottomValue = Math.floor(bottomValue * ratio);
      }

      set((state) => ({
        stitching: {
          ...state.stitching,
          cropTopPercent: topValue,
          cropBottomPercent: bottomValue,
        },
      }));
    },

    getMaxCropTop: () => {
      const state = get();
      return MAX_CROP_TOTAL - state.stitching.cropBottomPercent;
    },

    getMaxCropBottom: () => {
      const state = get();
      return MAX_CROP_TOTAL - state.stitching.cropTopPercent;
    },

    setExportFormat: (format) => {
      set((state) => ({
        stitching: {
          ...state.stitching,
          exportFormat: format,
        },
      }));
    },

    setExportQuality: (quality) => {
      const clamped = Math.max(MIN_QUALITY, Math.min(MAX_QUALITY, quality));
      set((state) => ({
        stitching: {
          ...state.stitching,
          exportQuality: Math.round(clamped * 100) / 100, // Round to 2 decimal places
        },
      }));
    },

    setHasPreviewGenerated: (generated) => {
      set((state) => ({
        stitching: {
          ...state.stitching,
          hasPreviewGenerated: generated,
        },
      }));
    },

    setPreviewCanvas: (canvas) => {
      set((state) => ({
        stitching: {
          ...state.stitching,
          previewCanvas: canvas,
          hasPreviewGenerated: canvas !== null,
        },
      }));
    },

    setIsAlwaysOnTop: (alwaysOnTop) => {
      set((state) => ({
        stitching: {
          ...state.stitching,
          isAlwaysOnTop: alwaysOnTop,
        },
      }));
    },

    toggleAlwaysOnTop: () => {
      const state = get();
      set((s) => ({
        stitching: {
          ...s.stitching,
          isAlwaysOnTop: !state.stitching.isAlwaysOnTop,
        },
      }));
    },

    openLightbox: () => {
      set((state) => ({
        stitching: {
          ...state.stitching,
          isLightboxOpen: true,
          // Reset zoom and offset when opening lightbox so it recalculates fit
          lightboxZoom: 1.0,
          lightboxOffset: { x: 0, y: 0 },
        },
      }));
    },

    closeLightbox: () => {
      set((state) => ({
        stitching: {
          ...state.stitching,
          isLightboxOpen: false,
          lightboxZoom: 1.0,
          lightboxOffset: { x: 0, y: 0 },
        },
      }));
    },

    setLightboxZoom: (zoom) => {
      const clamped = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom));
      set((state) => ({
        stitching: {
          ...state.stitching,
          lightboxZoom: clamped,
        },
      }));
    },

    setLightboxOffset: (offset) => {
      set((state) => ({
        stitching: {
          ...state.stitching,
          lightboxOffset: offset,
        },
      }));
    },

    resetLightboxView: () => {
      set((state) => ({
        stitching: {
          ...state.stitching,
          lightboxZoom: 1.0,
          lightboxOffset: { x: 0, y: 0 },
        },
      }));
    },

    setLoadedImagesCache: (cache) => {
      set((state) => ({
        stitching: {
          ...state.stitching,
          loadedImagesCache: cache,
        },
      }));
    },

    setLastImageUrls: (urls) => {
      set((state) => ({
        stitching: {
          ...state.stitching,
          lastImageUrls: urls,
        },
      }));
    },

    clearCaches: () => {
      set((state) => ({
        stitching: {
          ...state.stitching,
          loadedImagesCache: null,
          lastImageUrls: null,
          reorderedImages: null,
          hasPreviewGenerated: false,
          previewCanvas: null,
        },
      }));
    },

    resetStitchingState: () => {
      set((state) => ({
        stitching: {
          ...state.stitching,
          ...initialStitchingState,
        },
      }));
    },
  },
});

// ============================================================================
// Selectors
// ============================================================================

export const selectCropParams = (state: StitchingSlice) => ({
  cropTopPercent: state.stitching.cropTopPercent,
  cropBottomPercent: state.stitching.cropBottomPercent,
});

export const selectExportParams = (state: StitchingSlice) => ({
  exportFormat: state.stitching.exportFormat,
  exportQuality: state.stitching.exportQuality,
});

export const selectStitchingParams = (state: StitchingSlice) => ({
  cropTopPercent: state.stitching.cropTopPercent,
  cropBottomPercent: state.stitching.cropBottomPercent,
  exportFormat: state.stitching.exportFormat,
  exportQuality: state.stitching.exportQuality,
});

export const selectLightboxState = (state: StitchingSlice) => ({
  isOpen: state.stitching.isLightboxOpen,
  zoom: state.stitching.lightboxZoom,
  offset: state.stitching.lightboxOffset,
});

export const selectPreviewState = (state: StitchingSlice) => ({
  hasGenerated: state.stitching.hasPreviewGenerated,
  canvas: state.stitching.previewCanvas,
});

// ============================================================================
// Validation Helpers
// ============================================================================

export function validateCropParams(top: number, bottom: number): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (top < MIN_CROP || top > MAX_CROP) {
    errors.push(`Top crop must be between ${MIN_CROP} and ${MAX_CROP}`);
  }

  if (bottom < MIN_CROP || bottom > MAX_CROP) {
    errors.push(`Bottom crop must be between ${MIN_CROP} and ${MAX_CROP}`);
  }

  if (top + bottom > MAX_CROP_TOTAL) {
    errors.push(`Total crop cannot exceed ${MAX_CROP_TOTAL}%`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function validateQuality(quality: number): boolean {
  return quality >= MIN_QUALITY && quality <= MAX_QUALITY;
}

