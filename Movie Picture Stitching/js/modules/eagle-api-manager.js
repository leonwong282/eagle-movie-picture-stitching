/**
 * Eagle API Integration Module
 * Handles all interactions with Eagle application APIs
 */

class EagleAPIManager {
  constructor() {
    this.isEagleAvailable = typeof eagle !== 'undefined';
    this.lastSelectedIds = '';
    this.pollingInterval = null;
  }

  /**
   * Initialize Eagle API integration
   */
  async initialize() {
    if (!this.isEagleAvailable) {
      throw new Error('Eagle API not available');
    }

    // Start polling for selection changes
    this.startSelectionPolling();
  }

  /**
   * Get selected images from Eagle
   * @returns {Promise<Array>} Array of selected image items
   */
  async getSelectedImages() {
    if (!this.isEagleAvailable) {
      throw new Error('Eagle API not available');
    }

    try {
      const selected = await eagle.item.getSelected();
      return selected || [];
    } catch (error) {
      console.error('Failed to get selected images:', error);
      throw error;
    }
  }

  /**
   * Get selected folder from Eagle
   * @returns {Promise<Object>} Selected folder object
   */
  async getSelectedFolder() {
    if (!this.isEagleAvailable) {
      throw new Error('Eagle API not available');
    }

    try {
      const folders = await eagle.folder.getSelected();
      if (!folders || folders.length === 0) {
        throw new Error('No folder selected');
      }
      return folders[0];
    } catch (error) {
      console.error('Failed to get selected folder:', error);
      throw error;
    }
  }

  /**
   * Add image file to Eagle
   * @param {string} filePath - Path to the image file
   * @param {Object} options - Additional options (name, folders, etc.)
   * @returns {Promise<Object>} Eagle item object
   */
  async addImageToEagle(filePath, options = {}) {
    if (!this.isEagleAvailable) {
      throw new Error('Eagle API not available');
    }

    try {
      const result = await eagle.item.addFromPath(filePath, options);
      return result;
    } catch (error) {
      console.error('Failed to add image to Eagle:', error);
      throw error;
    }
  }

  /**
   * Set window always on top state
   * @param {boolean} alwaysOnTop - Whether to keep window on top
   */
  setAlwaysOnTop(alwaysOnTop) {
    if (!this.isEagleAvailable) {
      console.warn('Eagle API not available for setAlwaysOnTop');
      return;
    }

    try {
      eagle.window.setAlwaysOnTop(alwaysOnTop);
    } catch (error) {
      console.error('Failed to set always on top:', error);
    }
  }

  /**
   * Get Eagle application locale
   * @returns {string} Current locale
   */
  getLocale() {
    if (!this.isEagleAvailable) {
      return 'en';
    }

    try {
      return eagle.app?.locale || 'en';
    } catch (error) {
      console.error('Failed to get Eagle locale:', error);
      return 'en';
    }
  }

  /**
   * Start polling for selection changes
   * @param {Function} callback - Callback function for selection changes
   * @param {number} interval - Polling interval in milliseconds
   */
  startSelectionPolling(callback = null, interval = 1000) {
    if (this.pollingInterval) {
      this.stopSelectionPolling();
    }

    this.pollingInterval = setInterval(async () => {
      try {
        const selected = await this.getSelectedImages();
        const currentIds = selected.map(item => item.id).join(',');

        if (currentIds !== this.lastSelectedIds) {
          this.lastSelectedIds = currentIds;
          if (callback) {
            callback(selected);
          }
          // Dispatch custom event for other modules to listen
          window.dispatchEvent(new CustomEvent('eagle:selectionChanged', {
            detail: { selected }
          }));
        }
      } catch (error) {
        console.error('Selection polling error:', error);
      }
    }, interval);
  }

  /**
   * Stop selection polling
   */
  stopSelectionPolling() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }

  /**
   * Setup Eagle plugin lifecycle events
   * @param {Object} handlers - Event handlers object
   */
  setupLifecycleEvents(handlers = {}) {
    if (!this.isEagleAvailable) {
      console.warn('Eagle API not available for lifecycle events');
      return;
    }

    if (handlers.onCreate && eagle.onPluginCreate) {
      eagle.onPluginCreate(handlers.onCreate);
    }

    if (handlers.onShow && eagle.onPluginShow) {
      eagle.onPluginShow(handlers.onShow);
    }

    if (handlers.onBeforeExit && eagle.onPluginBeforeExit) {
      eagle.onPluginBeforeExit(handlers.onBeforeExit);
    }
  }

  /**
   * Cleanup Eagle API resources
   */
  cleanup() {
    this.stopSelectionPolling();
  }

  /**
   * Validate image selection
   * @param {Array} selected - Selected images array
   * @returns {Object} Validation result
   */
  validateSelection(selected) {
    const errors = [];

    if (!selected || selected.length === 0) {
      errors.push('No images selected');
    }

    if (selected && selected.length > 50) {
      errors.push('Too many images selected (maximum 50)');
    }

    // Check for valid image formats
    if (selected) {
      const invalidImages = selected.filter(item => {
        const ext = item.ext?.toLowerCase();
        return !['jpg', 'jpeg', 'png', 'webp', 'bmp', 'gif'].includes(ext);
      });

      if (invalidImages.length > 0) {
        errors.push(`Invalid image formats detected: ${invalidImages.length} files`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors: errors,
      count: selected?.length || 0
    };
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EagleAPIManager;
} else {
  window.EagleAPIManager = EagleAPIManager;
}
