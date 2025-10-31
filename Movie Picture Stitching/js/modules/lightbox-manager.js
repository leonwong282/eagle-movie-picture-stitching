/**
 * Lightbox Manager Module
 * Simple overlay lightbox for preview image viewing
 * @version 1.0.0
 */

class LightboxManager {
  constructor(i18nManager) {
    this.i18n = i18nManager;
    this.lightboxElement = null;
    this.currentCanvas = null;
    this.isOpen = false;
  }

  /**
   * Initialize lightbox - create DOM structure
   */
  initialize() {
    console.log('✨ Lightbox manager initialized');
    this.createLightboxDOM();
  }

  /**
   * Create lightbox DOM structure
   */
  createLightboxDOM() {
    // Create lightbox overlay
    this.lightboxElement = document.createElement('div');
    this.lightboxElement.className = 'lightbox-overlay';
    this.lightboxElement.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.95);
      backdrop-filter: blur(10px);
      z-index: 9999;
      display: none;
      align-items: center;
      justify-content: center;
      cursor: zoom-out;
    `;

    // Create image container
    const container = document.createElement('div');
    container.className = 'lightbox-container';
    container.style.cssText = `
      max-width: 95vw;
      max-height: 95vh;
      overflow: auto;
      position: relative;
    `;

    // Create canvas clone container
    const canvasWrapper = document.createElement('div');
    canvasWrapper.className = 'lightbox-canvas-wrapper';
    canvasWrapper.style.cssText = `
      display: flex;
      align-items: center;
      justify-content: center;
    `;

    // Create close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'lightbox-close';
    closeBtn.innerHTML = '×';
    closeBtn.setAttribute('aria-label', this.i18n ? this.i18n.t('ui.lightbox.close') : 'Close');
    closeBtn.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      width: 40px;
      height: 40px;
      border: none;
      border-radius: 50%;
      background: linear-gradient(135deg, #dc3545, #bd2130);
      color: white;
      font-size: 24px;
      cursor: pointer;
      z-index: 10000;
      transition: transform 0.2s;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    `;

    // Add hover effect
    closeBtn.addEventListener('mouseenter', () => {
      closeBtn.style.transform = 'scale(1.1)';
    });
    closeBtn.addEventListener('mouseleave', () => {
      closeBtn.style.transform = 'scale(1)';
    });

    // Assemble DOM
    container.appendChild(canvasWrapper);
    this.lightboxElement.appendChild(container);
    this.lightboxElement.appendChild(closeBtn);
    document.body.appendChild(this.lightboxElement);

    // Add event listeners
    this.setupEventListeners(closeBtn, canvasWrapper);
  }

  /**
   * Setup event listeners
   */
  setupEventListeners(closeBtn, canvasWrapper) {
    // Close button click
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.close();
    });

    // Click overlay to close
    this.lightboxElement.addEventListener('click', (e) => {
      if (e.target === this.lightboxElement) {
        this.close();
      }
    });

    // Prevent clicks on canvas from closing
    canvasWrapper.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    // ESC key to close
    this.handleKeydown = (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    };
    document.addEventListener('keydown', this.handleKeydown);
  }

  /**
   * Open lightbox with canvas element
   * @param {HTMLCanvasElement} canvas - Canvas to display
   */
  open(canvas) {
    if (!canvas) {
      console.warn('No canvas provided to lightbox');
      return;
    }

    this.currentCanvas = canvas;
    const wrapper = this.lightboxElement.querySelector('.lightbox-canvas-wrapper');

    // Clear previous content
    wrapper.innerHTML = '';

    // Clone the canvas
    const clonedCanvas = document.createElement('canvas');
    clonedCanvas.width = canvas.width;
    clonedCanvas.height = canvas.height;
    const ctx = clonedCanvas.getContext('2d');
    ctx.drawImage(canvas, 0, 0);

    // Style the cloned canvas
    clonedCanvas.style.cssText = `
      max-width: 100%;
      max-height: 95vh;
      display: block;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
    `;

    // Add canvas to wrapper
    wrapper.appendChild(clonedCanvas);

    // Show lightbox
    this.lightboxElement.style.display = 'flex';
    this.isOpen = true;

    // Dispatch event
    console.log('�️ Lightbox opened');
    window.dispatchEvent(new CustomEvent('lightbox:opened', {
      detail: { width: canvas.width, height: canvas.height }
    }));
  }

  /**
   * Close lightbox
   */
  close() {
    if (!this.isOpen) return;

    this.lightboxElement.style.display = 'none';
    this.isOpen = false;

    // Clear canvas wrapper
    const wrapper = this.lightboxElement.querySelector('.lightbox-canvas-wrapper');
    if (wrapper) {
      wrapper.innerHTML = '';
    }

    // Dispatch event
    console.log('🔒 Lightbox closed');
    window.dispatchEvent(new CustomEvent('lightbox:closed'));
  }

  /**
   * Cleanup resources
   */
  cleanup() {
    // Remove event listener
    if (this.handleKeydown) {
      document.removeEventListener('keydown', this.handleKeydown);
    }

    // Remove DOM element
    if (this.lightboxElement && this.lightboxElement.parentNode) {
      this.lightboxElement.parentNode.removeChild(this.lightboxElement);
    }

    this.lightboxElement = null;
    this.currentCanvas = null;
    this.isOpen = false;
    console.log('🧹 Lightbox manager cleaned up');
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LightboxManager;
} else {
  window.LightboxManager = LightboxManager;
}
