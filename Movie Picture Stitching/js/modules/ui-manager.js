/**
 * UI Management Module
 * Handles user interface updates, rendering, and interaction
 */

class UIManager {
  constructor(i18nManager) {
    this.i18n = i18nManager;
    this.isButtonsDisabled = false;
    this.sortableInstance = null; // Sortable.js instance
  }

  /**
   * Initialize UI manager
   */
  initialize() {
    this.setupEventListeners();
    console.log('UI manager initialized');

    // Test toast on initialization (DEBUG - remove in production)
    console.log('Testing toast system...');
    setTimeout(() => {
      this.showToast('Toast system initialized!', 'success', 3000);
    }, 1000);
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

    // Export format change listener (radio button group)
    const formatRadios = document.querySelectorAll('input[name="exportFormat"]');
    formatRadios.forEach(radio => {
      radio.addEventListener('change', () => {
        // Update format description
        this.updateFormatDescription(radio.value);

        // Dispatch parameter change event
        window.dispatchEvent(new CustomEvent('ui:parameterChanged', {
          detail: { element: 'exportFormat' }
        }));
      });
    });

    // Initialize format description and quality state based on default selection
    const checkedFormat = document.querySelector('input[name="exportFormat"]:checked');
    if (checkedFormat) {
      this.updateFormatDescription(checkedFormat.value);
    }
  }

  /**
   * Update format description text based on selected format
   * @param {string} format - Selected format (jpg, webp, png)
   */
  updateFormatDescription(format) {
    const descriptionEl = document.getElementById('format-description');
    const qualitySlider = document.getElementById('exportQuality');
    const qualityLabel = document.querySelector('label[for="exportQuality"]');
    const qualityBadge = document.getElementById('qualityValue');
    const qualityHelp = document.getElementById('quality-help');

    if (!descriptionEl) return;

    const descriptions = {
      jpg: 'Good compression, smaller files',
      webp: 'Best compression, modern browsers',
      png: 'Lossless quality, larger files'
    };

    descriptionEl.textContent = descriptions[format] || '';

    // Disable quality slider for PNG (lossless format)
    const isPNG = format === 'png';

    if (qualitySlider) {
      qualitySlider.disabled = isPNG;

      // Add visual feedback by reducing opacity
      if (isPNG) {
        qualitySlider.style.opacity = '0.5';
        qualitySlider.style.cursor = 'not-allowed';
      } else {
        qualitySlider.style.opacity = '1';
        qualitySlider.style.cursor = 'pointer';
      }
    }

    // Update label and badge opacity
    if (qualityLabel) {
      qualityLabel.style.opacity = isPNG ? '0.5' : '1';
    }

    if (qualityBadge) {
      qualityBadge.style.opacity = isPNG ? '0.5' : '1';
      if (isPNG) {
        qualityBadge.textContent = 'N/A';
      } else {
        // Restore numeric value when switching back from PNG
        if (qualitySlider && !qualitySlider.disabled) {
          qualityBadge.textContent = parseFloat(qualitySlider.value).toFixed(2);
        }
      }
    }

    if (qualityHelp) {
      if (isPNG) {
        // Use i18n for PNG message
        const message = window.i18nManager ?
          window.i18nManager.t('ui.settings.qualityNotApplicable') :
          'PNG is lossless - quality setting not applicable';
        qualityHelp.textContent = message;
        qualityHelp.style.color = 'rgba(255, 255, 255, 0.4)';
        qualityHelp.removeAttribute('data-i18n');
      } else {
        qualityHelp.setAttribute('data-i18n', 'ui.settings.qualityHelp');
        const message = window.i18nManager ?
          window.i18nManager.t('ui.settings.qualityHelp') :
          'Higher value = better quality, larger file';
        qualityHelp.textContent = message;
        qualityHelp.style.color = '';
      }
    }
  }

  /**
   * Show message to user using Toast notifications
   * @param {string} messageKey - i18n key for message
   * @param {Object} variables - Variables for message interpolation
   * @param {string} type - Toast type: 'success', 'error', 'warning', 'info' (default: 'info')
   * @param {number} duration - Auto-dismiss duration in ms (default: 4000, 0 = no auto-dismiss)
   */
  showMessage(messageKey, variables = {}, type = 'info', duration = 4000) {
    if (!this.i18n) {
      // Fallback to alert if i18n not available
      alert(messageKey);
      return;
    }

    const message = this.i18n.t(messageKey, variables);
    this.showToast(message, type, duration);
  }

  /**
   * Show toast notification
   * @param {string} message - Message to display
   * @param {string} type - Toast type: 'success', 'error', 'warning', 'info'
   * @param {number} duration - Auto-dismiss duration in ms (0 = no auto-dismiss)
   */
  showToast(message, type = 'info', duration = 4000) {
    console.log('showToast called:', { message, type, duration }); // DEBUG

    const container = document.getElementById('toast-container');
    console.log('Toast container found:', !!container); // DEBUG

    if (!container) {
      console.warn('Toast container not found, falling back to alert');
      alert(message);
      return;
    }

    // Create toast element
    const toast = this.createToastElement(message, type);
    console.log('Toast element created:', toast); // DEBUG

    // Add to container
    container.appendChild(toast);
    console.log('Toast appended to container'); // DEBUG

    // Trigger slide-in animation
    requestAnimationFrame(() => {
      toast.classList.add('app-toast-slide-in');
      console.log('Slide-in animation triggered'); // DEBUG
    });

    // Auto-dismiss after duration
    if (duration > 0) {
      const progressBar = toast.querySelector('.app-toast-progress');
      if (progressBar) {
        progressBar.style.width = '100%';
        progressBar.style.transition = `width ${duration}ms linear`;

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            progressBar.style.width = '0%';
          });
        });
      }

      setTimeout(() => {
        this.dismissToast(toast);
      }, duration);
    }
  }

  /**
   * Create toast element
   * @param {string} message - Toast message
   * @param {string} type - Toast type
   * @returns {HTMLElement} Toast element
   */
  createToastElement(message, type) {
    const toast = document.createElement('div');
    toast.className = `app-toast app-toast-${type}`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');

    // Icon mapping
    const icons = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ'
    };

    toast.innerHTML = `
      <div class="app-toast-icon">${icons[type] || icons.info}</div>
      <div class="app-toast-content">
        <p class="app-toast-message">${this.escapeHtml(message)}</p>
      </div>
      <button class="app-toast-close" type="button" aria-label="Close">×</button>
      <div class="app-toast-progress"></div>
    `;

    // Add close button handler
    const closeBtn = toast.querySelector('.app-toast-close');
    closeBtn.addEventListener('click', () => {
      this.dismissToast(toast);
    });

    return toast;
  }

  /**
 * Dismiss a toast notification
 * @param {HTMLElement} toast - Toast element to dismiss
 */
  dismissToast(toast) {
    if (!toast || !toast.parentElement) return;

    // Add slide-out animation
    toast.classList.remove('app-toast-slide-in');
    toast.classList.add('app-toast-slide-out');

    // Remove element after animation completes
    setTimeout(() => {
      if (toast.parentElement) {
        toast.remove();
      }
    }, 300);
  }

  /**
   * Escape HTML to prevent XSS
   * @param {string} text - Text to escape
   * @returns {string} Escaped text
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Set button state (enabled/disabled)
   * @param {string} buttonId - Button element ID
   * @param {boolean} enabled - Whether button should be enabled
   * @param {string} textKey - i18n key for button text
   * @param {boolean} showLoading - Whether to show loading animation
   */
  setButtonState(buttonId, enabled, textKey = null, showLoading = false) {
    const button = document.getElementById(buttonId);
    if (!button) return;

    button.disabled = !enabled;

    // Add or remove loading class
    if (showLoading) {
      button.classList.add('btn-loading');
    } else {
      button.classList.remove('btn-loading');
    }

    // Update button text
    if (textKey && this.i18n) {
      const buttonTextSpan = button.querySelector('.button-text');
      const translatedText = this.i18n.t(textKey);

      if (buttonTextSpan) {
        buttonTextSpan.textContent = translatedText;
      } else {
        button.textContent = translatedText;
      }
    }
  }

  /**
   * Disable all main action buttons
   */
  disableButtons() {
    this.isButtonsDisabled = true;
    this.setButtonState('previewButton', false, 'ui.buttons.processing', true);
    this.setButtonState('saveButton', false);
  }

  /**
   * Enable all main action buttons
   * @param {boolean} enableSaveButton - Whether to enable the save button (default: true)
   */
  enableButtons(enableSaveButton = true) {
    this.isButtonsDisabled = false;
    this.setButtonState('previewButton', true, 'ui.buttons.preview', false);

    // Only enable save button if explicitly allowed
    if (enableSaveButton) {
      this.setButtonState('saveButton', true, 'ui.buttons.save', false);
    }
  }

  /**
   * Set save button disabled state with animation
   * @param {boolean} disabled - Whether the save button should be disabled
   */
  setSaveButtonDisabledState(disabled) {
    const saveButton = document.getElementById('saveButton');
    if (!saveButton) return;

    // Don't actually disable the button - use class for visual state
    // This allows click events to still fire for showing the alert
    if (disabled) {
      saveButton.classList.add('btn-disabled-animated');
      saveButton.setAttribute('aria-disabled', 'true');
    } else {
      saveButton.classList.remove('btn-disabled-animated');
      saveButton.removeAttribute('aria-disabled');
    }
  }

  /**
   * Show shake animation on disabled save button
   */
  showSaveButtonShake() {
    const saveButton = document.getElementById('saveButton');
    if (!saveButton) return;

    saveButton.classList.add('btn-disabled-shake');

    // Remove class after animation completes
    setTimeout(() => {
      saveButton.classList.remove('btn-disabled-shake');
    }, 400);
  }

  /**
   * Render image list in the UI
   * @param {Array} images - Array of image objects
   */
  async renderImageList(images) {
    const list = document.querySelector('.list');
    if (!list) return;

    list.innerHTML = '';

    // Destroy existing Sortable instance
    if (this.sortableInstance) {
      this.sortableInstance.destroy();
      this.sortableInstance = null;
    }

    // Update image count display in header
    this.updateImageCount(images ? images.length : 0);

    if (!images || images.length === 0) {
      const noImagesText = this.i18n ? this.i18n.t('ui.interface.noImagesSelected') : 'No images selected';
      list.innerHTML = `<div style="text-align: center; padding: 20px; color: #999; font-size: 14px;">${noImagesText}</div>`;
      return;
    }

    try {
      // Create container for images
      const imagesContainer = document.createElement('div');
      imagesContainer.style.cssText = 'display: flex; flex-direction: column; gap: 8px; padding: 8px;';
      imagesContainer.id = 'sortable-image-list';

      images.forEach((item, index) => {
        const imgWrapper = this.createImageListItem(item, index);
        imagesContainer.appendChild(imgWrapper);
      });

      list.appendChild(imagesContainer);

      // Initialize Sortable.js for drag-and-drop reordering
      this.initializeSortable(imagesContainer, images);

    } catch (error) {
      console.error('Error rendering image list:', error);
      const loadFailedText = this.i18n ? this.i18n.t('ui.interface.loadFailed') : 'Load failed';
      list.innerHTML = `<div style="text-align: center; padding: 20px; color: #f44;">${loadFailedText}</div>`;
    }
  }

  /**
   * Initialize Sortable.js for drag-and-drop reordering
   * @param {HTMLElement} container - Container element
   * @param {Array} images - Images array
   */
  initializeSortable(container, images) {
    if (typeof Sortable === 'undefined') {
      console.warn('Sortable.js not loaded, drag-and-drop disabled');
      return;
    }

    this.sortableInstance = Sortable.create(container, {
      animation: 200,
      easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
      ghostClass: 'sortable-ghost',
      chosenClass: 'sortable-chosen',
      dragClass: 'sortable-drag',

      // Disable during processing
      disabled: window.app?.isProcessing || false,

      // Handle drag start
      onStart: () => {
        document.body.style.cursor = 'grabbing';
      },

      // Handle drag end - dispatch reorder event
      onEnd: (evt) => {
        document.body.style.cursor = '';

        const oldIndex = evt.oldIndex;
        const newIndex = evt.newIndex;

        // Only dispatch if order actually changed
        if (oldIndex !== newIndex) {
          console.log(`Image reordered: ${oldIndex} → ${newIndex}`);

          // Dispatch custom event for main app to handle
          window.dispatchEvent(new CustomEvent('ui:imagesReordered', {
            detail: {
              oldIndex: oldIndex,
              newIndex: newIndex
            }
          }));
        }
      }
    });

    console.log('✅ Sortable.js initialized for image list');
  }

  /**
   * Create individual image list item
   * @param {Object} item - Image item object
   * @param {number} index - Item index
   * @returns {HTMLElement} Created list item element
   */
  createImageListItem(item, index) {
    const imgWrapper = document.createElement('div');
    imgWrapper.className = 'sortable-item';
    imgWrapper.style.cssText = 'display: flex; align-items: center; gap: 8px; padding: 8px; background: rgba(255,255,255,0.05); border-radius: 6px; min-height: 60px; cursor: grab;';
    imgWrapper.setAttribute('data-image-index', index);

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
   * Update image count display in the left panel header
   * @param {number} count - Number of selected images
   */
  updateImageCount(count) {
    const countDisplay = document.getElementById('image-count-display');
    if (!countDisplay) return;

    const countText = this.i18n ?
      this.i18n.t('ui.interface.imagesSelected', { count }) :
      `${count} images selected`;

    countDisplay.innerHTML = `<span>${this.escapeHtml(countText)}</span>`;
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

    // Add click-to-zoom functionality
    canvas.style.cursor = 'zoom-in';
    canvas.setAttribute('title', this.i18n ?
      this.i18n.t('ui.lightbox.clickToEnlarge') :
      'Click to enlarge');

    // Add lightbox click handler
    canvas.addEventListener('click', () => {
      if (window.lightboxManager) {
        window.lightboxManager.open(canvas);
      }
    });

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
    // Destroy Sortable instance
    if (this.sortableInstance) {
      this.sortableInstance.destroy();
      this.sortableInstance = null;
      console.log('Sortable.js instance destroyed');
    }

    // Remove any dynamic event listeners if needed
    console.log('UI manager cleaned up');
  }

  /**
   * Test toast notifications (DEBUG - for console testing)
   * Usage: window.app.uiManager.testToast('success')
   */
  testToast(type = 'info') {
    const messages = {
      success: 'This is a success message!',
      error: 'This is an error message!',
      warning: 'This is a warning message!',
      info: 'This is an info message!'
    };
    this.showToast(messages[type] || messages.info, type, 5000);
    console.log(`Test toast triggered: ${type}`);
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = UIManager;
} else {
  window.UIManager = UIManager;
}
