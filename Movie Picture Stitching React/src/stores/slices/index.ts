/**
 * Store Slices
 *
 * Re-exports all slice creators for use in main store.
 */

export { createSelectionSlice, initialSelectionState, setPollingInterval } from './selection';
export { createSettingsSlice, initialSettingsState, initializeTheme } from './settings';
export {
  createProcessingSlice,
  initialProcessingState,
  canStartProcessing,
  getProcessingDuration,
  getProcessingStats,
} from './processing';
export { createUISlice, initialUIState, hasUISelection, getUISelectionCount } from './ui';
export {
  createStitchingSlice,
  initialStitchingState,
  selectCropParams,
  selectExportParams,
  selectStitchingParams,
  selectLightboxState,
  selectPreviewState,
  validateCropParams,
  validateQuality,
  type ExportFormat,
  type StitchingState,
  type StitchingActions,
  type StitchingSlice,
} from './stitching';
