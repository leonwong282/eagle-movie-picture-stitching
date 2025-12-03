export {
  eagleApi,
  isEagleEnvironment,
  hasNodeRequire,
  mockController,
  createMockNativeImage,
} from './eagle-api';
export {
  cn,
  debounce,
  throttle,
  formatFileSize,
  formatDate,
  sleep,
  generateId,
  clamp,
} from './utils';
export {
  getStorageItem,
  setStorageItem,
  removeStorageItem,
  clearStorage,
  debugStorage,
  loadTheme,
  saveTheme,
  loadSettings,
  saveSettings,
  StorageKeys,
  type Theme,
  type AppSettings,
} from './storage';

// Canvas utilities for image processing
export {
  // Constants
  MAX_CANVAS_SIZE,
  MAX_CANVAS_AREA,
  RECOMMENDED_BATCH_SIZE,
  IMAGE_LOAD_TIMEOUT,
  // Validation
  validateCanvasSize,
  fitToCanvasLimits,
  // Canvas operations
  cleanupCanvas,
  createCanvas,
  // Image loading
  loadImage,
  loadImages,
  // Batch processing
  processBatch,
  // Data operations
  canvasToDataURL,
  canvasToBlob,
  downloadCanvas,
  // Types
  type CanvasSize,
  type CanvasValidationResult,
  type ImageLoadResult,
  type BatchProcessResult,
} from './canvas';

// Mock factory exports for development and testing
export {
  createMockItem,
  createMockItems,
  createMockFolder,
  createMockFolders,
  createMockTag,
  createMockTags,
  createMockTagGroup,
  createMockTagGroups,
  createMockLibraryInfo,
  createMockDisplay,
  createMockDisplays,
  createMockPalettes,
  createItemsFromPreset,
  createNestedFolders,
  resetAllMocks,
  resetItemCounter,
  resetFolderCounter,
  resetTagCounter,
  resetTagGroupCounter,
  type MockItemOptions,
  type MockFolderOptions,
  type MockTagOptions,
  type MockTagGroupOptions,
  type MockLibraryInfoOptions,
  type MockDisplayOptions,
  type MockConfig,
  type FileTypePreset,
} from './mock-factory';

// Stitching engine for Movie Picture Stitching
export {
  // Constants
  MAX_CROP_TOTAL,
  RECOMMENDED_MAX_IMAGES,
  IMAGE_LOAD_TIMEOUT as STITCHING_LOAD_TIMEOUT,
  // Validation
  validateParams,
  validateSelection,
  validateCanvasDimensions,
  // Calculations
  calculateTotalHeight,
  calculateMaxWidth,
  // Image loading
  loadSingleImage,
  loadImages as loadStitchingImages,
  // Rendering
  renderStitchedImage,
  // Export
  getFileExtension,
  canvasToDataUrlWithFormat,
  canvasToBlobWithFormat,
  dataUrlToBuffer,
  generateFilename,
  // Full pipeline
  stitchImages,
  // Types
  type ImageData as StitchingImageData,
  type LoadedImage,
  type StitchingParams,
  type ExportOptions,
  type StitchingResult,
  type ValidationResult as StitchingValidationResult,
} from './stitching-engine';
