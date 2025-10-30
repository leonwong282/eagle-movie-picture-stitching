/**
 * UI Management Module
 * Handles user interface updates, rendering, and interaction
 */

class UIManager {
  constructor(i18nManager) {
    this.i18n = i18nManager;
    this.isButtonsDisabled = false;
  }

  /**
   * Initialize UI manager
   */
  initialize() {
    this.setupEventListeners();
    console.log('UI manager initialized');
  }

  /**
   * Setup event listeners for UI interactions
   */
  setupEventListeners() {
    // Parameter input listeners with debounced preview updates
    const paramInputs = ['cropTopPercent', 'cropBottomPercent', 'exportQuality'];

    paramInputs.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        // Input event with debounced preview update
        element.addEventListener('input', this.debounce(() => {
          // Dispatch parameter change event
          window.dispatchEvent(new CustomEvent('ui:parameterChanged', {
            detail: { element: id }
          }));

          // Auto-trigger preview for crop parameters if preview exists
          if ((id === 'cropTopPercent' || id === 'cropBottomPercent') && window.previewCanvas) {
            window.dispatchEvent(new CustomEvent('ui:autoPreviewRequested', {
              detail: { trigger: id }
            }));
          }
        }, 500));

        // Blur event for immediate validation
        element.addEventListener('blur', () => {
          window.dispatchEvent(new CustomEvent('ui:parameterChanged', {
            detail: { element: id, immediate: true }
          }));
        });

        // Real-time remaining values update for crop parameters
        if (id === 'cropTopPercent' || id === 'cropBottomPercent') {
          element.addEventListener('input', () => {
            window.dispatchEvent(new CustomEvent('ui:parameterChanged', {
              detail: { element: id, updateOnly: true }
            }));
          });
        }
      }
    });

    // Export format change listener
    const exportFormat = document.getElementById('exportFormat');
    if (exportFormat) {
      exportFormat.addEventListener('change', () => {
        window.dispatchEvent(new CustomEvent('ui:parameterChanged', {
          detail: { element: 'exportFormat' }
        }));
      });
    }
  }

  /**
   * Show message to user
   * @param {string} messageKey - i18n key for message
   * @param {Object} variables - Variables for message interpolation
   */
  showMessage(messageKey, variables = {}) {
    if (!this.i18n) {
      alert(messageKey);
      return;
    }

    const message = this.i18n.t(messageKey, variables);
    alert(message);
  }

  /**
   * Set button state (enabled/disabled)
   * @param {string} buttonId - Button element ID
   * @param {boolean} enabled - Whether button should be enabled
   * @param {string} textKey - i18n key for button text
   */
  setButtonState(buttonId, enabled, textKey = null) {
    const button = document.getElementById(buttonId);
    if (!button) return;

    button.disabled = !enabled;

    if (textKey && this.i18n) {
      button.textContent = this.i18n.t(textKey);
    }
  }

  /**
   * Disable all main action buttons
   */
  disableButtons() {
    this.isButtonsDisabled = true;
    this.setButtonState('previewButton', false, 'ui.buttons.processing');
    this.setButtonState('saveButton', false);
  }

  /**
   * Enable all main action buttons
   */
  enableButtons() {
    this.isButtonsDisabled = false;
    this.setButtonState('previewButton', true, 'ui.buttons.preview');
    this.setButtonState('saveButton', true, 'ui.buttons.save');
  }

  /**
   * Render image list in the UI
   * @param {Array} images - Array of image objects
   */
  async renderImageList(images) {
    const list = document.querySelector('.list');
    if (!list) return;

    list.innerHTML = '';

    if (!images || images.length === 0) {
      const noImagesText = this.i18n ? this.i18n.t('ui.interface.noImagesSelected') : 'No images selected';
      list.innerHTML = `<div style="text-align: center; padding: 20px; color: #999; font-size: 14px;">${noImagesText}</div>`;
      return;
    }

    try {
      // Create container for images
      const imagesContainer = document.createElement('div');
      imagesContainer.style.cssText = 'display: flex; flex-direction: column; gap: 8px; padding: 8px;';

      images.forEach((item, index) => {
        const imgWrapper = this.createImageListItem(item, index);
        imagesContainer.appendChild(imgWrapper);
      });

      list.appendChild(imagesContainer);
    } catch (error) {
      console.error('Error rendering image list:', error);
      const loadFailedText = this.i18n ? this.i18n.t('ui.interface.loadFailed') : 'Load failed';
      list.innerHTML = `<div style="text-align: center; padding: 20px; color: #f44;">${loadFailedText}</div>`;
    }
  }

  /**
   * Create individual image list item
   * @param {Object} item - Image item object
   * @param {number} index - Item index
   * @returns {HTMLElement} Created list item element
   */
  createImageListItem(item, index) {
    const imgWrapper = document.createElement('div');
    imgWrapper.style.cssText = 'display: flex; align-items: center; gap: 8px; padding: 8px; background: rgba(255,255,255,0.05); border-radius: 6px; min-height: 60px;';

    // Create image thumbnail
    const img = document.createElement('img');
    img.src = item.fileURL;
    img.style.cssText = 'width: 50px; height: 50px; object-fit: cover; border-radius: 4px; flex-shrink: 0;';
    img.alt = item.name || `Image ${index + 1}`;

    // Create info container
    const info = document.createElement('div');
    info.style.cssText = 'flex: 1; color: #ccc; font-size: 12px;';

    const imageName = item.name || (this.i18n ?
      this.i18n.t('ui.interface.imageName', { index: index + 1 }) :
      `Image ${index + 1}`);

    info.innerHTML = `
      <div style="font-weight: bold; margin-bottom: 2px;">${index + 1}. ${this.escapeHtml(imageName)}</div>
      <div>${item.width} × ${item.height}px</div>
    `;

    imgWrapper.appendChild(img);
    imgWrapper.appendChild(info);

    return imgWrapper;
  }

  /**
   * Show loading state in preview area
   */
  showPreviewLoading() {
    const previewContainer = document.querySelector('.preview');
    if (!previewContainer) return;

    const loadingText = this.i18n ? this.i18n.t('ui.status.loading') : 'Loading...';
    previewContainer.innerHTML = `<div style="text-align: center; padding: 20px; color: #666;">${loadingText}</div>`;
  }

  /**
   * Show error in preview area
   * @param {string} errorKey - i18n key for error message
   * @param {Object} variables - Variables for error message
   */
  showPreviewError(errorKey, variables = {}) {
    const previewContainer = document.querySelector('.preview');
    if (!previewContainer) return;

    const errorText = this.i18n ? this.i18n.t(errorKey, variables) : errorKey;
    previewContainer.innerHTML = `<div style="text-align: center; padding: 20px; color: #f44;">${errorText}</div>`;
  }

  /**
   * Display rendered canvas in preview area
   * @param {HTMLCanvasElement} canvas - Canvas to display
   * @param {Object} stats - Processing statistics
   */
  displayPreview(canvas, stats = {}) {
    const previewContainer = document.querySelector('.preview');
    if (!previewContainer) return;

    // Clear container
    previewContainer.innerHTML = '';

    // Add canvas
    previewContainer.appendChild(canvas);

    // Add processing info
    if (stats.count) {
      const infoDiv = document.createElement('div');
      infoDiv.style.cssText = 'text-align: center; padding: 10px; color: #999; font-size: 12px;';

      const processedText = this.i18n ?
        this.i18n.t('ui.interface.imagesProcessed', {
          count: stats.count,
          width: stats.width || 0,
          height: stats.height || 0
        }) :
        `Processed ${stats.count} images (${stats.width}×${stats.height}px)`;

      infoDiv.textContent = processedText;
      previewContainer.appendChild(infoDiv);
    }
  }

  /**
   * Update pin button state
   * @param {boolean} isPinned - Whether window is pinned
   */
  updatePinButton(isPinned) {
    const pinButton = document.getElementById('pinButton');
    if (!pinButton) return;

    pinButton.style.color = isPinned ? '#ffd700' : '#fff';

    const titleKey = isPinned ? 'ui.header.unpinWindow' : 'ui.header.pinWindow';
    if (this.i18n) {
      pinButton.title = this.i18n.t(titleKey);
    }
  }

  /**
   * Escape HTML special characters
   * @param {string} text - Text to escape
   * @returns {string} Escaped text
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Create debounced function
   * @param {Function} func - Function to debounce
   * @param {number} wait - Wait time in milliseconds
   * @returns {Function} Debounced function
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  /**
   * Setup responsive behavior for UI elements
   */
  setupResponsiveBehavior() {
    // Add window resize listener for responsive adjustments
    window.addEventListener('resize', this.debounce(() => {
      // Trigger custom event for responsive updates
      window.dispatchEvent(new CustomEvent('ui:resize'));
    }, 250));
  }

  /**
   * Cleanup UI resources
   */
  cleanup() {
    // Remove any dynamic event listeners if needed
    console.log('UI manager cleaned up');
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = UIManager;
} else {
  window.UIManager = UIManager;
}
