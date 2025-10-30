/**
 * Canvas Rendering Module
 * Handles image processing, canvas operations, and rendering
 */

class CanvasRenderer {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.previewCanvas = null;
  }

  /**
   * Initialize canvas renderer
   */
  initialize() {
    // Canvas will be created dynamically when needed
    console.log('Canvas renderer initialized');
  }

  /**
   * Create a new canvas with specified dimensions
   * @param {number} width - Canvas width
   * @param {number} height - Canvas height
   * @returns {HTMLCanvasElement} Created canvas element
   */
  createCanvas(width, height) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;
  }

  /**
   * Validate canvas dimensions against browser limits
   * @param {number} width - Canvas width
   * @param {number} height - Canvas height
   * @returns {Object} Validation result
   */
  validateCanvasDimensions(width, height) {
    const MAX_CANVAS_SIZE = 32767; // Browser limit for canvas dimensions
    const errors = [];

    if (width > MAX_CANVAS_SIZE) {
      errors.push(`Canvas width ${width} exceeds maximum ${MAX_CANVAS_SIZE}`);
    }

    if (height > MAX_CANVAS_SIZE) {
      errors.push(`Canvas height ${height} exceeds maximum ${MAX_CANVAS_SIZE}`);
    }

    if (width <= 0 || height <= 0) {
      errors.push('Canvas dimensions must be positive');
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  /**
   * Load image from URL
   * @param {string} url - Image URL
   * @param {number} timeout - Load timeout in milliseconds
   * @returns {Promise<HTMLImageElement>} Loaded image element
   */
  loadImage(url, timeout = 10000) {
    return new Promise((resolve, reject) => {
      const img = new Image();

      const timeoutId = setTimeout(() => {
        reject(new Error(`Image load timeout: ${url}`));
      }, timeout);

      img.onload = () => {
        clearTimeout(timeoutId);
        resolve(img);
      };

      img.onerror = (error) => {
        clearTimeout(timeoutId);
        reject(new Error(`Image load failed: ${url}`));
      };

      img.src = url;
    });
  }

  /**
   * Load multiple images in parallel
   * @param {Array} imageData - Array of image data objects with url property
   * @returns {Promise<Array>} Array of loaded images with metadata
   */
  async loadImages(imageData) {
    const loadPromises = imageData.map(async (data, index) => {
      try {
        const img = await this.loadImage(data.url);
        console.log(`Image ${index + 1}/${imageData.length} loaded: ${data.name || 'Unknown'}`);
        return { img, data };
      } catch (error) {
        console.error(`Image load failed [${index + 1}]:`, data.url, error);
        return null;
      }
    });

    const results = await Promise.all(loadPromises);
    return results.filter(result => result !== null);
  }

  /**
   * Calculate total height for stitched image
   * @param {Array} validImages - Array of valid image objects
   * @param {Object} params - Cropping parameters
   * @returns {number} Total height
   */
  calculateTotalHeight(validImages, params) {
    const { cropTopPercent, cropBottomPercent } = params;

    return validImages.reduce((sum, { data }, i) => {
      if (i === 0) {
        // First image only crop bottom
        const cropBottom = Math.round(data.height * (cropBottomPercent / 100));
        return sum + (data.height - cropBottom);
      } else {
        // Other images crop top and bottom
        const cropTop = Math.round(data.height * (cropTopPercent / 100));
        const cropBottom = Math.round(data.height * (cropBottomPercent / 100));
        return sum + (data.height - cropTop - cropBottom);
      }
    }, 0);
  }

  /**
   * Render stitched image preview
   * @param {Array} validImages - Array of valid image objects
   * @param {Object} params - Rendering parameters
   * @returns {HTMLCanvasElement} Rendered canvas
   */
  renderStitchedImage(validImages, params) {
    const { cropTopPercent, cropBottomPercent } = params;

    // Calculate dimensions
    const totalHeight = this.calculateTotalHeight(validImages, params);
    const maxWidth = Math.max(...validImages.map(({ data }) => data.width));

    // Validate canvas dimensions
    const validation = this.validateCanvasDimensions(maxWidth, totalHeight);
    if (!validation.isValid) {
      throw new Error(`Canvas size validation failed: ${validation.errors.join(', ')}`);
    }

    // Create canvas
    const canvas = this.createCanvas(maxWidth, totalHeight);
    const ctx = canvas.getContext('2d');

    let currentY = 0;

    // Draw images
    validImages.forEach(({ img, data }, i) => {
      if (i === 0) {
        // First image only crop bottom
        const cropBottom = Math.round(data.height * (cropBottomPercent / 100));
        const cropHeight = data.height - cropBottom;
        if (cropHeight > 0) {
          ctx.drawImage(img, 0, 0, data.width, cropHeight, 0, currentY, data.width, cropHeight);
          currentY += cropHeight;
        }
      } else {
        // Other images crop top and bottom
        const cropTop = Math.round(data.height * (cropTopPercent / 100));
        const cropBottom = Math.round(data.height * (cropBottomPercent / 100));
        const cropHeight = data.height - cropTop - cropBottom;
        if (cropHeight > 0) {
          ctx.drawImage(img, 0, cropTop, data.width, cropHeight, 0, currentY, data.width, cropHeight);
          currentY += cropHeight;
        }
      }
    });

    return canvas;
  }

  /**
   * Convert canvas to data URL with specified format and quality
   * @param {HTMLCanvasElement} canvas - Canvas to convert
   * @param {string} format - Export format (jpg, png, webp)
   * @param {number} quality - Quality for lossy formats (0.1-1.0)
   * @returns {Object} Data URL and MIME type
   */
  canvasToDataURL(canvas, format = 'jpg', quality = 0.92) {
    let mimeType;
    let dataUrl;

    switch (format.toLowerCase()) {
      case 'jpg':
      case 'jpeg':
        mimeType = 'jpeg';
        dataUrl = canvas.toDataURL('image/jpeg', quality);
        break;
      case 'webp':
        mimeType = 'webp';
        dataUrl = canvas.toDataURL('image/webp', quality);
        break;
      case 'png':
      default:
        mimeType = 'png';
        dataUrl = canvas.toDataURL('image/png');
        break;
    }

    return { dataUrl, mimeType };
  }

  /**
   * Convert data URL to buffer
   * @param {string} dataUrl - Data URL to convert
   * @param {string} mimeType - MIME type
   * @returns {Buffer} Image buffer
   */
  dataURLToBuffer(dataUrl, mimeType) {
    const base64Data = dataUrl.replace(new RegExp(`^data:image/${mimeType};base64,`), '');
    return Buffer.from(base64Data, 'base64');
  }

  /**
   * Style canvas for display in preview
   * @param {HTMLCanvasElement} canvas - Canvas to style
   */
  styleCanvasForPreview(canvas) {
    canvas.style.maxWidth = '100%';
    canvas.style.maxHeight = '100%';
    canvas.style.display = 'block';
    canvas.style.margin = '0 auto';
    canvas.style.border = '1px solid #444';
    canvas.setAttribute('alt', 'Stitched preview');
  }

  /**
   * Set global preview canvas reference
   * @param {HTMLCanvasElement} canvas - Canvas to set as preview
   */
  setPreviewCanvas(canvas) {
    this.previewCanvas = canvas;
    window.previewCanvas = canvas; // For backward compatibility
  }

  /**
   * Get current preview canvas
   * @returns {HTMLCanvasElement|null} Current preview canvas
   */
  getPreviewCanvas() {
    return this.previewCanvas || window.previewCanvas || null;
  }

  /**
   * Clear preview canvas reference
   */
  clearPreviewCanvas() {
    this.previewCanvas = null;
    if (window.previewCanvas) {
      window.previewCanvas = null;
    }
  }

  /**
   * Cleanup canvas resources
   */
  cleanup() {
    this.clearPreviewCanvas();
    this.canvas = null;
    this.ctx = null;
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CanvasRenderer;
} else {
  window.CanvasRenderer = CanvasRenderer;
}
