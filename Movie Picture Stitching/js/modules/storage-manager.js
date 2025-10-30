/**
 * Storage Management Module
 * Handles localStorage operations for parameter persistence
 */

class StorageManager {
  constructor(storagePrefix = 'eagle-movie-stitching:') {
    this.storagePrefix = storagePrefix;
    this.storageAvailable = this.checkStorageAvailability();

    // Validation rules for each parameter
    this.validationRules = {
      cropTopPercent: {
        type: 'number',
        min: 0,
        max: 99
      },
      cropBottomPercent: {
        type: 'number',
        min: 0,
        max: 99
      },
      exportQuality: {
        type: 'number',
        min: 0.1,
        max: 1.0
      },
      exportFormat: {
        type: 'string',
        values: ['jpg', 'png', 'webp']
      }
    };
  }

  /**
   * Check if localStorage is available
   * @returns {boolean} True if localStorage is available
   */
  checkStorageAvailability() {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (error) {
      console.warn('localStorage not available:', error.message);
      return false;
    }
  }

  /**
   * Get storage key with prefix
   * @param {string} key - Parameter key
   * @returns {string} Prefixed storage key
   */
  getStorageKey(key) {
    return this.storagePrefix + key;
  }

  /**
   * Validate parameter value
   * @param {string} key - Parameter key
   * @param {*} value - Parameter value
   * @returns {boolean} True if valid
   */
  validateParameter(key, value) {
    const rules = this.validationRules[key];
    if (!rules) {
      console.warn(`No validation rules for parameter: ${key}`);
      return false;
    }

    // Type validation
    if (rules.type === 'number') {
      if (!Number.isFinite(value)) {
        console.warn(`Invalid number for ${key}:`, value);
        return false;
      }

      // Range validation
      if (value < rules.min || value > rules.max) {
        console.warn(`${key} out of range (${rules.min}-${rules.max}):`, value);
        return false;
      }
    }

    // String enum validation
    if (rules.type === 'string') {
      if (typeof value !== 'string') {
        console.warn(`Invalid string for ${key}:`, value);
        return false;
      }

      if (rules.values && !rules.values.includes(value)) {
        console.warn(`${key} not in allowed values:`, value);
        return false;
      }
    }

    return true;
  }

  /**
   * Save single parameter to localStorage
   * @param {string} key - Parameter key
   * @param {*} value - Parameter value
   * @returns {boolean} True if saved successfully
   */
  saveParameter(key, value) {
    if (!this.storageAvailable) {
      return false;
    }

    try {
      // Validate before saving
      if (!this.validateParameter(key, value)) {
        return false;
      }

      const storageKey = this.getStorageKey(key);
      localStorage.setItem(storageKey, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Failed to save parameter ${key}:`, error);

      // Handle quota exceeded error
      if (error.name === 'QuotaExceededError') {
        console.error('localStorage quota exceeded');
      }

      return false;
    }
  }

  /**
   * Load single parameter from localStorage
   * @param {string} key - Parameter key
   * @param {*} defaultValue - Default value if not found or invalid
   * @returns {*} Loaded value or default
   */
  loadParameter(key, defaultValue) {
    if (!this.storageAvailable) {
      return defaultValue;
    }

    try {
      const storageKey = this.getStorageKey(key);
      const storedValue = localStorage.getItem(storageKey);

      if (storedValue === null) {
        return defaultValue;
      }

      // Parse stored value
      const parsedValue = JSON.parse(storedValue);

      // Validate loaded value
      if (!this.validateParameter(key, parsedValue)) {
        console.warn(`Loaded invalid value for ${key}, using default`);
        return defaultValue;
      }

      return parsedValue;
    } catch (error) {
      console.error(`Failed to load parameter ${key}:`, error);

      // Optionally clear corrupted data
      try {
        localStorage.removeItem(this.getStorageKey(key));
      } catch (e) {
        // Ignore cleanup errors
      }

      return defaultValue;
    }
  }

  /**
   * Save all parameters at once
   * @param {Object} params - Parameters object
   * @returns {boolean} True if all saved successfully
   */
  saveAllParameters(params) {
    if (!this.storageAvailable) {
      return false;
    }

    let allSucceeded = true;
    const timestamp = new Date().toISOString();

    // Save each parameter
    Object.keys(params).forEach(key => {
      const success = this.saveParameter(key, params[key]);
      if (!success) {
        allSucceeded = false;
      }
    });

    // Save metadata
    if (allSucceeded) {
      try {
        localStorage.setItem(
          this.getStorageKey('lastSaved'),
          JSON.stringify(timestamp)
        );
      } catch (error) {
        console.warn('Failed to save metadata:', error);
      }
    }

    return allSucceeded;
  }

  /**
   * Load all parameters
   * @returns {Object} Parameters object with loaded values
   */
  loadAllParameters() {
    const defaultParams = {
      cropTopPercent: 0,
      cropBottomPercent: 0,
      exportFormat: 'jpg',
      exportQuality: 0.92
    };

    if (!this.storageAvailable) {
      return defaultParams;
    }

    return {
      cropTopPercent: this.loadParameter('cropTopPercent', defaultParams.cropTopPercent),
      cropBottomPercent: this.loadParameter('cropBottomPercent', defaultParams.cropBottomPercent),
      exportFormat: this.loadParameter('exportFormat', defaultParams.exportFormat),
      exportQuality: this.loadParameter('exportQuality', defaultParams.exportQuality)
    };
  }

  /**
   * Clear all saved parameters
   */
  clearAllParameters() {
    if (!this.storageAvailable) {
      return;
    }

    const keys = ['cropTopPercent', 'cropBottomPercent', 'exportFormat', 'exportQuality', 'lastSaved'];

    keys.forEach(key => {
      try {
        localStorage.removeItem(this.getStorageKey(key));
      } catch (error) {
        console.error(`Failed to remove ${key}:`, error);
      }
    });

    console.log('All parameters cleared from storage');
  }

  /**
   * Get storage information for debugging
   * @returns {Object} Storage info
   */
  getStorageInfo() {
    if (!this.storageAvailable) {
      return { available: false };
    }

    try {
      const keys = Object.keys(localStorage).filter(key =>
        key.startsWith(this.storagePrefix)
      );

      const params = {};
      keys.forEach(key => {
        const shortKey = key.replace(this.storagePrefix, '');
        params[shortKey] = localStorage.getItem(key);
      });

      return {
        available: true,
        prefix: this.storagePrefix,
        keys: keys,
        count: keys.length,
        parameters: params,
        lastSaved: this.loadParameter('lastSaved', null)
      };
    } catch (error) {
      return { available: false, error: error.message };
    }
  }

  /**
   * Check if storage is available
   * @returns {boolean} True if available
   */
  isStorageAvailable() {
    return this.storageAvailable;
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = StorageManager;
} else {
  window.StorageManager = StorageManager;
}
