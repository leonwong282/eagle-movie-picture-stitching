/**
 * Parameter Management Module
 * Handles validation and management of user input parameters
 */

class ParameterManager {
  constructor() {
    this.defaultParams = {
      cropTopPercent: 0,
      cropBottomPercent: 0,
      exportFormat: 'jpg',
      exportQuality: 0.92,
    };
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

    return {
      cropTopPercent,
      cropBottomPercent,
      exportFormat: elements.exportFormat.value || 'jpg',
      exportQuality,
    };
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
