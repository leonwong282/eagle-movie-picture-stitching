/**
 * Parameter Management Module
 * Handles validation and management of user input parameters
 */

class ParameterManager {
  constructor() {
    // Initialize storage manager for parameter persistence
    this.storageManager = new StorageManager();

    // Default parameters
    this.defaultParams = {
      cropTopPercent: 0,
      cropBottomPercent: 0,
      exportFormat: 'jpg',
      exportQuality: 0.92,
    };

    // Track last saved params to avoid redundant saves
    this.lastSavedParams = null;

    // Debounce tracking
    this.savePending = false;
    this.saveTimeout = null;

    // Load saved parameters immediately (synchronous - localStorage is fast)
    this.savedParams = this.storageManager.loadAllParameters();
    console.log('[ParameterManager] Parameters loaded in constructor:', this.savedParams);

    // DO NOT apply to DOM here - will be done after initialization
    // This prevents blocking the constructor
  }

  /**
   * Initialize parameter manager after DOM is ready
   * Should be called from app.initialize() after DOM is confirmed ready
   */
  initialize() {
    // Apply saved parameters to DOM elements
    this.applyParametersToDOMSync();
  }

  /**
   * Apply saved parameters to DOM (synchronous version for after DOM is ready)
   */
  applyParametersToDOMSync() {
    // Apply values to DOM elements
    if (!this.savedParams || Object.keys(this.savedParams).length === 0) {
      console.log('[ParameterManager] No saved parameters to apply');
      return;
    }

    try {
      // Apply crop top (using correct element IDs from HTML)
      if (this.savedParams.cropTopPercent !== undefined) {
        const cropTopInput = document.getElementById('cropTopPercent');
        if (cropTopInput) {
          cropTopInput.value = this.savedParams.cropTopPercent;
        }
      }

      // Apply crop bottom
      if (this.savedParams.cropBottomPercent !== undefined) {
        const cropBottomInput = document.getElementById('cropBottomPercent');
        if (cropBottomInput) {
          cropBottomInput.value = this.savedParams.cropBottomPercent;
        }
      }

      // Apply export format
      if (this.savedParams.exportFormat !== undefined) {
        const exportFormatSelect = document.getElementById('exportFormat');
        if (exportFormatSelect) {
          exportFormatSelect.value = this.savedParams.exportFormat;
        }
      }

      // Apply export quality
      if (this.savedParams.exportQuality !== undefined) {
        const exportQualityInput = document.getElementById('exportQuality');
        if (exportQualityInput) {
          exportQualityInput.value = this.savedParams.exportQuality;
        }
      }

      // Update remaining values display
      this.updateRemainingValues();

      console.log('[ParameterManager] Parameters applied to DOM');
    } catch (error) {
      console.error('[ParameterManager] Failed to apply parameters to DOM:', error);
    }
  }

  /**
   * Save current parameters to storage (with debouncing)
   * @param {Object} params - Parameters to save
   */
  saveCurrentParameters(params) {
    // Check if parameters actually changed
    if (this.lastSavedParams &&
      JSON.stringify(params) === JSON.stringify(this.lastSavedParams)) {
      return; // No changes, skip save
    }

    // Clear existing timeout if any
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }

    // Set pending flag
    this.savePending = true;

    // Debounce save operation (300ms)
    this.saveTimeout = setTimeout(() => {
      const success = this.storageManager.saveAllParameters(params);

      if (success) {
        this.lastSavedParams = { ...params };
        console.log('Parameters saved to storage');
      } else {
        console.warn('Failed to save parameters to storage');
      }

      this.savePending = false;
      this.saveTimeout = null;
    }, 300);
  }

  /**
   * Reset all parameters to defaults
   * Clears storage and resets UI
   */
  resetToDefaults() {
    // Clear storage
    this.storageManager.clearAllParameters();

    // Reset to default params
    this.lastSavedParams = null;

    // Apply defaults to DOM
    this.savedParams = this.defaultParams;
    this.applyParametersToDOMSync();

    console.log('Parameters reset to defaults');
  }

  /**
   * Get cropping and export parameters with validation
   * @param {string|null} adjustingElement - Element currently being adjusted
   * @returns {Object} Configuration object with validated parameters
   */
  getParams(adjustingElement = null) {
    const elements = {
      cropTop: document.getElementById('cropTopPercent'),
      cropBottom: document.getElementById('cropBottomPercent'),
      exportFormat: document.getElementById('exportFormat'),
      exportQuality: document.getElementById('exportQuality'),
    };

    // Check if elements exist
    if (!elements.cropTop || !elements.cropBottom || !elements.exportFormat || !elements.exportQuality) {
      console.warn('Some parameter elements not found');
      return this.defaultParams;
    }

    // Validate and limit export quality parameters
    let exportQuality = parseFloat(elements.exportQuality.value) || 0.92;
    if (exportQuality < 0.1) {
      exportQuality = 0.1;
      elements.exportQuality.value = '0.1';
      console.warn('Export quality adjusted to valid range (0.1-1.0)');
    } else if (exportQuality > 1.0) {
      exportQuality = 1.0;
      elements.exportQuality.value = '1.0';
      console.warn('Export quality adjusted to valid range (0.1-1.0)');
    }

    // Validate and limit cropping parameters
    let cropTopPercent = parseFloat(elements.cropTop.value) || 0;
    let cropBottomPercent = parseFloat(elements.cropBottom.value) || 0;

    if (cropTopPercent < 0) {
      cropTopPercent = 0;
      elements.cropTop.value = '0';
    } else if (cropTopPercent > 99) {
      cropTopPercent = 99;
      elements.cropTop.value = '99';
    }

    if (cropBottomPercent < 0) {
      cropBottomPercent = 0;
      elements.cropBottom.value = '0';
    } else if (cropBottomPercent > 99) {
      cropBottomPercent = 99;
      elements.cropBottom.value = '99';
    }

    // Smart cropping parameter adjustment: only adjust the parameter currently being modified
    if (cropTopPercent + cropBottomPercent >= 100) {
      const maxAllowed = 99;

      if (adjustingElement === 'cropTopPercent') {
        // User is adjusting top, fix bottom, adjust top
        const maxTop = maxAllowed - cropBottomPercent;
        if (cropTopPercent > maxTop) {
          cropTopPercent = maxTop;
          elements.cropTop.value = cropTopPercent.toString();
          console.warn(`Top crop adjusted to maximum setting: ${cropTopPercent}% (bottom fixed at ${cropBottomPercent}%)`);
        }
      } else if (adjustingElement === 'cropBottomPercent') {
        // User is adjusting bottom, fix top, adjust bottom
        const maxBottom = maxAllowed - cropTopPercent;
        if (cropBottomPercent > maxBottom) {
          cropBottomPercent = maxBottom;
          elements.cropBottom.value = cropBottomPercent.toString();
          console.warn(`Bottom crop adjusted to maximum setting: ${cropBottomPercent}% (top fixed at ${cropTopPercent}%)`);
        }
      } else {
        // Program initialization or other cases, proportional adjustment
        const total = cropTopPercent + cropBottomPercent;
        const ratio = maxAllowed / total;
        cropTopPercent = Math.floor(cropTopPercent * ratio);
        cropBottomPercent = Math.floor(cropBottomPercent * ratio);

        elements.cropTop.value = cropTopPercent.toString();
        elements.cropBottom.value = cropBottomPercent.toString();
        console.warn('Crop parameters have been adjusted to valid range');
      }
    }

    const params = {
      cropTopPercent,
      cropBottomPercent,
      exportFormat: elements.exportFormat.value || 'jpg',
      exportQuality,
    };

    // Auto-save parameters after validation
    this.saveCurrentParameters(params);

    return params;
  }

  /**
   * Update remaining available value display
   * Updates UI to show remaining crop percentages and visual feedback
   */
  updateRemainingValues() {
    const topElement = document.getElementById('cropTopPercent');
    const bottomElement = document.getElementById('cropBottomPercent');
    const remainingTopSpan = document.getElementById('remaining-top');
    const remainingBottomSpan = document.getElementById('remaining-bottom');

    if (!topElement || !bottomElement || !remainingTopSpan || !remainingBottomSpan) return;

    const topValue = parseFloat(topElement.value) || 0;
    const bottomValue = parseFloat(bottomElement.value) || 0;
    const total = topValue + bottomValue;

    const remainingForTop = Math.max(0, 99 - bottomValue);
    const remainingForBottom = Math.max(0, 99 - topValue);

    remainingTopSpan.textContent = remainingForTop;
    remainingBottomSpan.textContent = remainingForBottom;

    // Visual feedback
    if (total >= 100) {
      topElement.style.borderColor = '#f44336';
      bottomElement.style.borderColor = '#f44336';
    } else {
      topElement.style.borderColor = '#666';
      bottomElement.style.borderColor = '#666';
    }
  }

  /**
   * Validate parameters for image processing
   * @param {Object} params - Parameters to validate
   * @returns {Object} Validation result with isValid and errors
   */
  validateParams(params) {
    const errors = [];

    if (params.cropTopPercent + params.cropBottomPercent >= 100) {
      errors.push('Total crop percentage cannot exceed 99%');
    }

    if (params.exportQuality < 0.1 || params.exportQuality > 1.0) {
      errors.push('Export quality must be between 0.1 and 1.0');
    }

    if (!['jpg', 'png', 'webp'].includes(params.exportFormat)) {
      errors.push('Invalid export format');
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ParameterManager;
} else {
  window.ParameterManager = ParameterManager;
}
