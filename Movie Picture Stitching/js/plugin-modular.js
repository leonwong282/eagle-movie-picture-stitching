/**
 * Movie Picture Stitching Plugin - Main Application
 * Modular architecture with separated concerns
 */

// Initialize internationalization support
initializeAllI18nFeatures();

class MoviePictureStitchingApp {
  constructor() {
    // Initialize module managers
    this.parameterManager = new ParameterManager();
    this.eagleAPI = new EagleAPIManager();
    this.canvasRenderer = new CanvasRenderer();
    this.uiManager = new UIManager(i18nManager);
    this.fileManager = new FileManager();

    // Application state
    this.isAlwaysOnTop = false;
    this.isProcessing = false;
    this.isAutoPreview = false;

    // Image caching for auto-preview performance
    this.lastImageData = null;
    this.lastValidImages = null;

    // Performance tracking
    this.performanceMonitor = {
      lastRenderTime: 0,
      renderCount: 0
    };
  }

  /**
   * Initialize the application
   */
  async initialize() {
    try {
      console.log('🚀 Initializing Movie Picture Stitching App...');

      // Initialize all modules
      this.parameterManager.initialize(); // Apply saved parameters to DOM
      await this.eagleAPI.initialize();
      this.canvasRenderer.initialize();
      this.uiManager.initialize();
      this.fileManager.initialize();

      // Setup event listeners
      this.setupEventListeners();

      // Initial UI render
      await this.renderImageList();
      this.parameterManager.updateRemainingValues();

      console.log('✅ Application initialization completed');
    } catch (error) {
      console.error('❌ Application initialization failed:', error);
      this.uiManager.showMessage('ui.messages.initError', { error: error.message });
    }
  }

  /**
   * Setup application event listeners
   */
  setupEventListeners() {
    // Eagle selection changes
    window.addEventListener('eagle:selectionChanged', (event) => {
      this.handleSelectionChange(event.detail.selected);
    });

    // Parameter changes
    window.addEventListener('ui:parameterChanged', (event) => {
      this.handleParameterChange(event.detail.element, event.detail);
    });

    // Auto-preview requests (real-time preview)
    window.addEventListener('ui:autoPreviewRequested', (event) => {
      this.handleAutoPreviewRequest(event.detail);
    });

    // Button clicks
    this.setupButtonListeners();

    // Window lifecycle
    this.setupWindowListeners();
  }

  /**
   * Setup button event listeners
   */
  setupButtonListeners() {
    // Preview button
    const previewButton = document.getElementById('previewButton');
    if (previewButton) {
      previewButton.addEventListener('click', () => this.handlePreviewClick());
    }

    // Save button
    const saveButton = document.getElementById('saveButton');
    if (saveButton) {
      saveButton.addEventListener('click', () => this.handleSaveClick());
    }

    // Pin button
    const pinButton = document.getElementById('pinButton');
    if (pinButton) {
      pinButton.addEventListener('click', () => this.handlePinClick());
    }

    // Close button
    const closeButton = document.getElementById('closeButton');
    if (closeButton) {
      closeButton.addEventListener('click', () => this.handleCloseClick());
    }
  }

  /**
   * Setup window lifecycle listeners
   */
  setupWindowListeners() {
    // Before unload cleanup
    window.addEventListener('beforeunload', () => this.cleanup());

    // Global error handling
    window.addEventListener('error', (event) => {
      console.error('Global error:', event.error);
      this.handleGlobalError(event.error);
    });

    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      this.handleGlobalError(event.reason);
    });
  }

  /**
   * Handle Eagle selection changes
   * @param {Array} selected - Selected images
   */
  async handleSelectionChange(selected) {
    try {
      // Clear image cache when selection changes
      this.lastImageData = null;
      this.lastValidImages = null;

      await this.renderImageList();
    } catch (error) {
      console.error('Failed to handle selection change:', error);
    }
  }

  /**
   * Handle parameter changes
   * @param {string} element - Changed element identifier
   * @param {Object} details - Additional event details
   */
  handleParameterChange(element, details = {}) {
    try {
      // Update remaining values with context of what changed
      this.parameterManager.updateRemainingValues();

      // Skip validation for update-only events
      if (details.updateOnly) {
        return;
      }

      // Validate current parameters
      const params = this.parameterManager.getParams(element);
      const validation = this.parameterManager.validateParams(params);

      if (!validation.isValid) {
        console.warn('Parameter validation issues:', validation.errors);
      }
    } catch (error) {
      console.error('Failed to handle parameter change:', error);
    }
  }

  /**
   * Handle auto-preview requests (real-time preview)
   * @param {Object} details - Auto-preview request details
   */
  async handleAutoPreviewRequest(details) {
    // Prevent auto-preview if already processing or no existing preview
    if (this.isProcessing || !this.canvasRenderer.getPreviewCanvas()) {
      return;
    }

    try {
      console.log('Auto-preview triggered by:', details.trigger);

      // Set a flag to indicate this is an auto-preview
      this.isAutoPreview = true;

      // Perform preview update with reduced UI feedback
      await this.renderPreview(true);
    } catch (error) {
      console.warn('Auto-preview failed:', error);
      // Don't show error for auto-preview failures
    } finally {
      this.isAutoPreview = false;
    }
  }

  /**
   * Handle preview button click
   */
  async handlePreviewClick() {
    if (this.isProcessing) {
      console.warn('Already processing, ignoring preview click');
      return;
    }

    try {
      this.isProcessing = true;
      this.uiManager.disableButtons();

      await this.renderPreview();
    } catch (error) {
      console.error('Preview generation failed:', error);
      this.uiManager.showPreviewError('ui.messages.saveError', { error: error.message });
    } finally {
      this.isProcessing = false;
      this.uiManager.enableButtons();
    }
  }

  /**
   * Handle save button click
   */
  async handleSaveClick() {
    if (this.isProcessing) {
      console.warn('Already processing, ignoring save click');
      return;
    }

    try {
      this.isProcessing = true;
      this.uiManager.setButtonState('saveButton', false, 'ui.buttons.saving');

      await this.saveImage();
    } catch (error) {
      console.error('Save operation failed:', error);
      this.uiManager.showMessage('ui.messages.saveError', { error: error.message });
    } finally {
      this.isProcessing = false;
      this.uiManager.setButtonState('saveButton', true, 'ui.buttons.save');
    }
  }

  /**
   * Handle pin button click
   */
  handlePinClick() {
    try {
      this.isAlwaysOnTop = !this.isAlwaysOnTop;
      this.eagleAPI.setAlwaysOnTop(this.isAlwaysOnTop);
      this.uiManager.updatePinButton(this.isAlwaysOnTop);
    } catch (error) {
      console.error('Failed to toggle pin state:', error);
    }
  }

  /**
   * Handle close button click
   */
  handleCloseClick() {
    try {
      this.cleanup();
      window.close();
    } catch (error) {
      console.error('Failed to close application:', error);
    }
  }

  /**
   * Handle global errors
   * @param {Error} error - Error object
   */
  handleGlobalError(error) {
    // Check for i18n related errors and attempt recovery
    if (error?.message?.includes('i18n') || error?.message?.includes('translation')) {
      console.log('Detected i18n related error, attempting recovery...');
      setTimeout(() => {
        i18nManager.reinitialize().catch(recoveryError => {
          console.error('I18n recovery failed:', recoveryError);
        });
      }, 1000);
    }
  }

  /**
   * Render image list
   */
  async renderImageList() {
    try {
      const selected = await this.eagleAPI.getSelectedImages();
      await this.uiManager.renderImageList(selected);
    } catch (error) {
      console.error('Failed to render image list:', error);
      await this.uiManager.renderImageList([]);
    }
  }

  /**
   * Render preview image
   * @param {boolean} isAutoPreview - Whether this is an auto-preview (less UI feedback)
   */
  async renderPreview(isAutoPreview = false) {
    const startTime = performance.now();

    try {
      // Show loading state only for manual preview
      if (!isAutoPreview) {
        this.uiManager.showPreviewLoading();
      }

      // Get and validate selected images
      const selected = await this.eagleAPI.getSelectedImages();
      const selectionValidation = this.eagleAPI.validateSelection(selected);

      if (!selectionValidation.isValid) {
        throw new Error(selectionValidation.errors.join(', '));
      }

      // Get and validate parameters
      const params = this.parameterManager.getParams();
      const paramValidation = this.parameterManager.validateParams(params);

      if (!paramValidation.isValid) {
        throw new Error(paramValidation.errors.join(', '));
      }

      // Prepare image data
      const images = selected.map((item, index) => ({
        url: item.fileURL,
        width: item.width,
        height: item.height,
        name: item.name || `Image ${index + 1}`,
      }));

      // For auto-preview, check if we need to reload images
      // (Skip if images haven't changed and we're just updating crop parameters)
      let validImages;

      if (isAutoPreview && this.lastImageData &&
        JSON.stringify(images.map(i => i.url)) === JSON.stringify(this.lastImageData.map(i => i.url))) {
        // Reuse previously loaded images for performance
        validImages = this.lastValidImages;
        console.log('Auto-preview: Reusing loaded images');
      } else {
        // Load images
        console.log(`Loading ${images.length} images...`);
        validImages = await this.canvasRenderer.loadImages(images);

        if (validImages.length === 0) {
          throw new Error('All images failed to load');
        }

        console.log(`Successfully loaded ${validImages.length}/${images.length} images`);

        // Cache for auto-preview
        this.lastImageData = images;
        this.lastValidImages = validImages;
      }

      // Render stitched image
      const canvas = this.canvasRenderer.renderStitchedImage(validImages, params);

      // Style and display canvas
      this.canvasRenderer.styleCanvasForPreview(canvas);
      this.canvasRenderer.setPreviewCanvas(canvas);

      // Calculate statistics
      const stats = {
        count: validImages.length,
        width: canvas.width,
        height: canvas.height,
        processingTime: performance.now() - startTime
      };

      // Display preview with stats
      this.uiManager.displayPreview(canvas, stats);

      // Update performance monitoring
      this.performanceMonitor.lastRenderTime = stats.processingTime;
      this.performanceMonitor.renderCount++;

      if (!isAutoPreview) {
        console.log(`Preview generated in ${stats.processingTime.toFixed(2)}ms`);
      } else {
        console.log(`Auto-preview updated in ${stats.processingTime.toFixed(2)}ms`);
      }

    } catch (error) {
      console.error('Preview rendering failed:', error);

      // Only show error UI for manual preview
      if (!isAutoPreview) {
        this.uiManager.showPreviewError('ui.messages.previewError', { error: error.message });
      }

      throw error;
    }
  }

  /**
   * Save stitched image
   */
  async saveImage() {
    try {
      // Get current folder
      const folder = await this.eagleAPI.getSelectedFolder();

      // Get parameters
      const params = this.parameterManager.getParams();

      // Get preview canvas
      const canvas = this.canvasRenderer.getPreviewCanvas();
      if (!canvas) {
        throw new Error('No preview available. Please generate preview first.');
      }

      // Save canvas as image file
      const filePath = await this.fileManager.saveCanvasAsImage(canvas, {
        format: params.exportFormat,
        quality: params.exportQuality
      });

      // Generate safe filename
      const filename = this.fileManager.getSafeFilename(
        this.fileManager.generateFilename(params.exportFormat)
      );

      // Add to Eagle
      await this.eagleAPI.addImageToEagle(filePath, {
        name: filename,
        folders: [folder.id],
      });

      // Schedule cleanup of temporary file
      this.fileManager.scheduleCleanup(filePath, 1000);

      // Show success message
      this.uiManager.showMessage('ui.messages.success');

      console.log('Image saved successfully:', filename);

    } catch (error) {
      console.error('Save operation failed:', error);
      throw error;
    }
  }

  /**
   * Cleanup application resources
   */
  cleanup() {
    try {
      console.log('🧹 Cleaning up application resources...');

      // Clear image cache
      this.lastImageData = null;
      this.lastValidImages = null;

      // Clean up global references
      if (typeof window !== 'undefined') {
        window.parameterManager = null;
      }

      // Cleanup all modules
      this.eagleAPI.cleanup();
      this.canvasRenderer.cleanup();
      this.uiManager.cleanup();
      this.fileManager.cleanup();

      console.log('✅ Cleanup completed');
    } catch (error) {
      console.error('❌ Cleanup failed:', error);
    }
  }

  /**
   * Get application performance stats
   * @returns {Object} Performance statistics
   */
  getPerformanceStats() {
    return {
      lastRenderTime: this.performanceMonitor.lastRenderTime,
      renderCount: this.performanceMonitor.renderCount,
      averageRenderTime: this.performanceMonitor.renderCount > 0 ?
        this.performanceMonitor.lastRenderTime / this.performanceMonitor.renderCount : 0
    };
  }
}

// Global application instance
let app = null;

// Eagle plugin lifecycle integration
if (typeof eagle !== 'undefined') {
  eagle.onPluginCreate(async (plugin) => {
    try {
      console.log('🎬 Movie Picture Stitching Plugin Create Event');

      // Create and initialize application
      app = new MoviePictureStitchingApp();

      // Make parameter manager globally accessible for i18n dynamic updates
      window.parameterManager = app.parameterManager;

      await app.initialize();

      // Set initial window state
      app.eagleAPI.setAlwaysOnTop(app.isAlwaysOnTop);

      console.log('🎉 Plugin successfully created and initialized');
    } catch (error) {
      console.error('❌ Plugin creation failed:', error);
    }
  });

  // Plugin before exit cleanup
  if (eagle.onPluginBeforeExit) {
    eagle.onPluginBeforeExit(() => {
      if (app) {
        app.cleanup();
      }
      // Clean up global references
      if (typeof window !== 'undefined') {
        window.parameterManager = null;
      }
    });
  }
}

// Export for debugging and testing
if (typeof window !== 'undefined') {
  window.MoviePictureStitchingApp = MoviePictureStitchingApp;
  window.getApp = () => app;

  // Storage debugging utilities
  window.storageDebug = {
    // Quick access to storage manager
    getManager: () => app?.parameterManager?.storageManager,

    // View all saved parameters
    viewAll: function () {
      const manager = this.getManager();
      if (!manager) {
        console.error('Storage manager not available');
        return null;
      }
      const info = manager.getStorageInfo();
      console.table(info.parameters);
      return info;
    },

    // Clear all parameters
    clearAll: function () {
      const manager = this.getManager();
      if (!manager) {
        console.error('Storage manager not available');
        return;
      }
      manager.clearAllParameters();
      console.log('✅ All parameters cleared');
    },

    // Reset to defaults
    resetDefaults: function () {
      if (app && app.parameterManager) {
        app.parameterManager.resetToDefaults();
        console.log('✅ Reset to defaults');
      } else {
        console.error('Parameter manager not available');
      }
    },

    // Test save/load cycle
    testCycle: function () {
      const manager = this.getManager();
      if (!manager) {
        console.error('Storage manager not available');
        return;
      }

      const testParams = {
        cropTopPercent: 80,
        cropBottomPercent: 15,
        exportFormat: 'webp',
        exportQuality: 0.85
      };

      console.log('Saving test params:', testParams);
      manager.saveAllParameters(testParams);

      console.log('Loading params...');
      const loaded = manager.loadAllParameters();

      console.log('Loaded params:', loaded);
      const match = JSON.stringify(testParams) === JSON.stringify(loaded);
      console.log(match ? '✅ Test passed!' : '❌ Test failed!');

      return { testParams, loaded, match };
    },

    // Check storage status
    status: function () {
      const manager = this.getManager();
      if (!manager) {
        return { available: false, error: 'Manager not initialized' };
      }

      const info = manager.getStorageInfo();
      console.log('Storage Status:');
      console.log('- Available:', info.available);
      console.log('- Parameters stored:', info.count);
      console.log('- Last saved:', info.lastSaved);
      console.log('\nStored parameters:');
      console.table(info.parameters);

      return info;
    }
  };

  console.log('💾 Storage debug tools loaded! Use:');
  console.log('  storageDebug.viewAll()      - View all saved parameters');
  console.log('  storageDebug.clearAll()     - Clear all saved parameters');
  console.log('  storageDebug.resetDefaults() - Reset to default values');
  console.log('  storageDebug.testCycle()    - Test save/load cycle');
  console.log('  storageDebug.status()       - Check storage status');
}
