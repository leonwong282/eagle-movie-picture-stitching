/**
 * Lightbox Manager Module
 * Handles full-screen image preview with zoom and pan capabilities
 */

class LightboxManager {
  constructor(i18nManager) {
    this.i18n = i18nManager;
    this.isOpen = false;
    this.currentCanvas = null;
    this.currentZoom = 1.0;
    this.isDragging = false;
    this.dragStart = { x: 0, y: 0 };
    this.offset = { x: 0, y: 0 };

    // DOM elements
    this.lightboxElement = null;
    this.imageWrapper = null;
    this.closeButton = null;
    this.zoomInButton = null;
    this.zoomOutButton = null;
    this.zoomResetButton = null;
    this.dimensionsDisplay = null;
    this.zoomDisplay = null;

    // Zoom constraints
    this.minZoom = 0.5;
    this.maxZoom = 3.0;
    this.zoomStep = 0.1;

    // Bound event handlers (for proper cleanup)
    this.handleKeydown = this.handleKeydown.bind(this);
    this.handleWheel = this.handleWheel.bind(this);
    this.handleBackdropClick = this.handleBackdropClick.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
  }

  /**
   * Initialize lightbox - create DOM structure
   */
  initialize() {
    // Create lightbox DOM structure
    this.createLightboxDOM();

    // Cache DOM references
    this.lightboxElement = document.getElementById('lightbox');
    this.imageWrapper = this.lightboxElement.querySelector('.lightbox-image-wrapper');
    this.closeButton = this.lightboxElement.querySelector('.lightbox-close');
    this.zoomInButton = document.getElementById('zoom-in');
    this.zoomOutButton = document.getElementById('zoom-out');
    this.zoomResetButton = document.getElementById('zoom-reset');
    this.dimensionsDisplay = document.getElementById('lightbox-dimensions');
    this.zoomDisplay = document.getElementById('lightbox-zoom');

    // Setup event listeners
    this.setupEventListeners();

    console.log('✅ Lightbox manager initialized');
  }

  /**
   * Create lightbox DOM structure
   */
  createLightboxDOM() {
    // Check if already exists
    if (document.getElementById('lightbox')) {
      console.warn('Lightbox already exists in DOM');
      return;
    }

    const lightboxHTML = `
      <div id="lightbox" class="lightbox-overlay" role="dialog" aria-modal="true" aria-hidden="true">
        <button class="lightbox-close" aria-label="Close lightbox" data-i18n="[aria-label]ui.lightbox.close">
          ×
        </button>

        <div class="lightbox-content">
          <div class="lightbox-image-wrapper">
            <!-- Canvas will be inserted here -->
          </div>

          <div class="lightbox-controls">
            <button class="btn btn-sm btn-secondary" id="zoom-out"
                    data-i18n="[aria-label]ui.lightbox.zoomOut"
                    data-i18n-title="ui.lightbox.zoomOut"
                    title="Zoom Out (-)">
              <span>−</span>
            </button>
            <button class="btn btn-sm btn-secondary" id="zoom-reset"
                    data-i18n="[aria-label]ui.lightbox.resetZoom"
                    data-i18n-title="ui.lightbox.resetZoom"
                    title="Reset (0)">
              <span>⊙</span>
            </button>
            <button class="btn btn-sm btn-secondary" id="zoom-in"
                    data-i18n="[aria-label]ui.lightbox.zoomIn"
                    data-i18n-title="ui.lightbox.zoomIn"
                    title="Zoom In (+)">
              <span>+</span>
            </button>
          </div>

          <div class="lightbox-info">
            <span id="lightbox-dimensions" class="text-muted"></span>
            <span id="lightbox-zoom" class="text-muted ms-3"></span>
          </div>
        </div>
      </div>
    `;

    // Insert at end of body
    document.body.insertAdjacentHTML('beforeend', lightboxHTML);

    // Apply i18n translations if available
    if (this.i18n && typeof updateI18nElements === 'function') {
      updateI18nElements();
    }
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Close button
    this.closeButton?.addEventListener('click', () => this.close());

    // Backdrop click
    this.lightboxElement?.addEventListener('click', this.handleBackdropClick);

    // Zoom controls
    this.zoomInButton?.addEventListener('click', () => this.zoomIn());
    this.zoomOutButton?.addEventListener('click', () => this.zoomOut());
    this.zoomResetButton?.addEventListener('click', () => this.resetView());

    // Prevent content clicks from closing lightbox
    const content = this.lightboxElement?.querySelector('.lightbox-content');
    content?.addEventListener('click', (e) => e.stopPropagation());
  }

  /**
   * Open lightbox with canvas
   * @param {HTMLCanvasElement} canvas - Canvas to display
   */
  open(canvas) {
    if (!canvas) {
      console.error('Cannot open lightbox: no canvas provided');
      return;
    }

    if (this.isOpen) {
      console.warn('Lightbox is already open');
      return;
    }

    this.currentCanvas = canvas;
    this.isOpen = true;

    // Clone canvas to avoid affecting original
    const clonedCanvas = document.createElement('canvas');
    clonedCanvas.width = canvas.width;
    clonedCanvas.height = canvas.height;
    const ctx = clonedCanvas.getContext('2d');
    ctx.drawImage(canvas, 0, 0);

    // Style cloned canvas
    clonedCanvas.className = 'lightbox-image';
    clonedCanvas.style.cursor = 'grab';

    // Clear and insert canvas
    this.imageWrapper.innerHTML = '';
    this.imageWrapper.appendChild(clonedCanvas);

    // Calculate initial zoom to fit viewport
    const fitZoom = this.calculateFitZoom(canvas.width, canvas.height);
    this.currentZoom = fitZoom;
    this.offset = { x: 0, y: 0 };
    this.updateCanvasTransform(clonedCanvas);

    // Update info displays
    this.updateInfoDisplays(canvas.width, canvas.height);

    // Show lightbox
    this.lightboxElement.classList.add('show');
    this.lightboxElement.setAttribute('aria-hidden', 'false');

    // Add document-level event listeners
    document.addEventListener('keydown', this.handleKeydown);
    window.addEventListener('wheel', this.handleWheel, { passive: false });

    // Add drag handlers to canvas
    clonedCanvas.addEventListener('mousedown', this.handleMouseDown);

    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('lightbox:opened', {
      detail: {
        canvas,
        dimensions: { width: canvas.width, height: canvas.height }
      }
    }));

    console.log('✅ Lightbox opened');
  }

  /**
   * Close lightbox
   */
  close() {
    if (!this.isOpen) return;

    const startTime = performance.now();

    // Hide lightbox
    this.lightboxElement.classList.remove('show');
    this.lightboxElement.setAttribute('aria-hidden', 'true');

    // Clear canvas
    this.imageWrapper.innerHTML = '';

    // Remove document-level event listeners
    document.removeEventListener('keydown', this.handleKeydown);
    window.removeEventListener('wheel', this.handleWheel);
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseup', this.handleMouseUp);

    // Reset state
    this.currentCanvas = null;
    this.isOpen = false;
    this.isDragging = false;
    this.currentZoom = 1.0;
    this.offset = { x: 0, y: 0 };

    // Dispatch custom event
    const duration = performance.now() - startTime;
    window.dispatchEvent(new CustomEvent('lightbox:closed', {
      detail: { duration }
    }));

    console.log('✅ Lightbox closed');
  }

  /**
   * Zoom in
   */
  zoomIn() {
    const newZoom = Math.min(this.currentZoom + this.zoomStep, this.maxZoom);
    this.setZoom(newZoom);
  }

  /**
   * Zoom out
   */
  zoomOut() {
    const newZoom = Math.max(this.currentZoom - this.zoomStep, this.minZoom);
    this.setZoom(newZoom);
  }

  /**
   * Set zoom level
   * @param {number} zoom - Zoom level (0.5 to 3.0)
   */
  setZoom(zoom) {
    zoom = Math.max(this.minZoom, Math.min(this.maxZoom, zoom));
    this.currentZoom = zoom;

    const canvas = this.imageWrapper.querySelector('.lightbox-image');
    if (canvas) {
      this.updateCanvasTransform(canvas);
      this.updateZoomDisplay();
    }

    // Dispatch zoom event
    window.dispatchEvent(new CustomEvent('lightbox:zoomChanged', {
      detail: { zoom, level: Math.round(zoom * 100) }
    }));
  }

  /**
   * Reset view to fit viewport
   */
  resetView() {
    const canvas = this.imageWrapper.querySelector('.lightbox-image');
    if (!canvas) return;

    // Calculate fit zoom based on current canvas size
    const fitZoom = this.calculateFitZoom(canvas.width, canvas.height);
    this.currentZoom = fitZoom;
    this.offset = { x: 0, y: 0 };

    this.updateCanvasTransform(canvas);
    this.updateZoomDisplay();
  }

  /**
   * Calculate zoom level to fit image in viewport
   * @param {number} imageWidth - Image width
   * @param {number} imageHeight - Image height
   * @returns {number} Zoom level to fit viewport
   */
  calculateFitZoom(imageWidth, imageHeight) {
    if (!this.imageWrapper) return 1.0;

    // Get available space in lightbox
    const containerWidth = this.imageWrapper.clientWidth;
    const containerHeight = this.imageWrapper.clientHeight;

    // Calculate scale to fit both dimensions
    const scaleX = containerWidth / imageWidth;
    const scaleY = containerHeight / imageHeight;

    // Use the smaller scale to ensure entire image fits
    const fitScale = Math.min(scaleX, scaleY, 1.0); // Don't zoom in beyond 100%

    // Clamp to min/max zoom levels
    return Math.max(this.minZoom, Math.min(this.maxZoom, fitScale));
  }

  /**
   * Update canvas transform (zoom and position)
   * @param {HTMLCanvasElement} canvas - Canvas element
   */
  updateCanvasTransform(canvas) {
    canvas.style.transform = `scale(${this.currentZoom}) translate(${this.offset.x}px, ${this.offset.y}px)`;
  }

  /**
   * Update info displays (dimensions and zoom level)
   * @param {number} width - Canvas width
   * @param {number} height - Canvas height
   */
  updateInfoDisplays(width, height) {
    // Update dimensions
    if (this.dimensionsDisplay) {
      const dimensionsText = this.i18n ?
        this.i18n.t('ui.lightbox.dimensions', { width, height }) :
        `${width}×${height}px`;
      this.dimensionsDisplay.textContent = dimensionsText;
    }

    this.updateZoomDisplay();
  }

  /**
   * Update zoom display
   */
  updateZoomDisplay() {
    if (this.zoomDisplay) {
      const zoomPercent = Math.round(this.currentZoom * 100);
      const zoomText = this.i18n ?
        this.i18n.t('ui.lightbox.zoomLevel', { zoom: zoomPercent }) :
        `Zoom: ${zoomPercent}%`;
      this.zoomDisplay.textContent = zoomText;
    }
  }

  /**
   * Handle keyboard events
   * @param {KeyboardEvent} e - Keyboard event
   */
  handleKeydown(e) {
    if (!this.isOpen) return;

    switch (e.key) {
      case 'Escape':
        this.close();
        e.preventDefault();
        break;
      case '+':
      case '=':
        this.zoomIn();
        e.preventDefault();
        break;
      case '-':
      case '_':
        this.zoomOut();
        e.preventDefault();
        break;
      case '0':
        this.resetView();
        e.preventDefault();
        break;
    }
  }

  /**
   * Handle mouse wheel for zoom
   * @param {WheelEvent} e - Wheel event
   */
  handleWheel(e) {
    if (!this.isOpen) return;

    // Check if hovering over lightbox content
    const content = this.lightboxElement.querySelector('.lightbox-content');
    if (!content.contains(e.target)) return;

    e.preventDefault();

    const delta = e.deltaY > 0 ? -this.zoomStep : this.zoomStep;
    const newZoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.currentZoom + delta));
    this.setZoom(newZoom);
  }

  /**
   * Handle backdrop click to close
   * @param {MouseEvent} e - Click event
   */
  handleBackdropClick(e) {
    // Only close if clicking the overlay itself, not its children
    if (e.target === this.lightboxElement) {
      this.close();
    }
  }

  /**
   * Handle mouse down for drag
   * @param {MouseEvent} e - Mouse event
   */
  handleMouseDown(e) {
    if (this.currentZoom <= 1.0) return; // Only allow drag when zoomed in

    this.isDragging = true;
    this.dragStart = { x: e.clientX - this.offset.x, y: e.clientY - this.offset.y };

    const canvas = this.imageWrapper.querySelector('.lightbox-image');
    if (canvas) {
      canvas.style.cursor = 'grabbing';
    }

    document.addEventListener('mousemove', this.handleMouseMove);
    document.addEventListener('mouseup', this.handleMouseUp);

    e.preventDefault();
  }

  /**
   * Handle mouse move for drag
   * @param {MouseEvent} e - Mouse event
   */
  handleMouseMove(e) {
    if (!this.isDragging) return;

    this.offset.x = e.clientX - this.dragStart.x;
    this.offset.y = e.clientY - this.dragStart.y;

    const canvas = this.imageWrapper.querySelector('.lightbox-image');
    if (canvas) {
      this.updateCanvasTransform(canvas);
    }
  }

  /**
   * Handle mouse up to end drag
   */
  handleMouseUp() {
    if (!this.isDragging) return;

    this.isDragging = false;

    const canvas = this.imageWrapper.querySelector('.lightbox-image');
    if (canvas) {
      canvas.style.cursor = 'grab';
    }

    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseup', this.handleMouseUp);
  }

  /**
   * Cleanup resources
   */
  cleanup() {
    // Close if open
    if (this.isOpen) {
      this.close();
    }

    // Remove DOM element
    if (this.lightboxElement) {
      this.lightboxElement.remove();
      this.lightboxElement = null;
    }

    console.log('✅ Lightbox manager cleaned up');
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LightboxManager;
} else {
  window.LightboxManager = LightboxManager;
}
