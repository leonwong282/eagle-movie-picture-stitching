/**
 * File Operations Module
 * Handles file system operations, saving, and cleanup
 */

class FileManager {
  constructor() {
    this.fs = null;
    this.path = null;
    this.tempFiles = new Set();

    // Initialize Node.js modules if available
    try {
      this.fs = require('fs');
      this.path = require('path');
    } catch (error) {
      console.warn('Node.js modules not available:', error.message);
    }
  }

  /**
   * Initialize file manager
   */
  initialize() {
    if (!this.fs || !this.path) {
      throw new Error('File system modules not available');
    }
    console.log('File manager initialized');
  }

  /**
   * Generate unique filename with timestamp
   * @param {string} format - File format (jpg, png, webp)
   * @param {string} prefix - Filename prefix
   * @returns {string} Generated filename
   */
  generateFilename(format = 'jpg', prefix = 'liang_stitched_image') {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const extension = format === 'jpg' ? 'jpg' : format === 'webp' ? 'webp' : 'png';
    return `${prefix}_${timestamp}.${extension}`;
  }

  /**
   * Save buffer to file
   * @param {Buffer} buffer - File buffer
   * @param {string} filename - Target filename
   * @param {string} directory - Target directory (defaults to __dirname)
   * @returns {string} Full file path
   */
  saveBufferToFile(buffer, filename, directory = __dirname) {
    if (!this.fs || !this.path) {
      throw new Error('File system not available');
    }

    const filePath = this.path.join(directory, filename);

    try {
      this.fs.writeFileSync(filePath, buffer);
      this.tempFiles.add(filePath);
      console.log('File saved:', filePath);
      return filePath;
    } catch (error) {
      console.error('Failed to save file:', error);
      throw error;
    }
  }

  /**
   * Save canvas as image file
   * @param {HTMLCanvasElement} canvas - Canvas to save
   * @param {Object} options - Save options
   * @returns {Promise<string>} File path
   */
  async saveCanvasAsImage(canvas, options = {}) {
    const {
      format = 'jpg',
      quality = 0.92,
      filename = null,
      directory = __dirname
    } = options;

    if (!canvas) {
      throw new Error('Canvas is required');
    }

    // Generate data URL
    let dataUrl;
    let mimeType;

    switch (format.toLowerCase()) {
      case 'jpg':
      case 'jpeg':
        dataUrl = canvas.toDataURL('image/jpeg', quality);
        mimeType = 'jpeg';
        break;
      case 'webp':
        dataUrl = canvas.toDataURL('image/webp', quality);
        mimeType = 'webp';
        break;
      case 'png':
      default:
        dataUrl = canvas.toDataURL('image/png');
        mimeType = 'png';
        break;
    }

    // Convert to buffer
    const base64Data = dataUrl.replace(new RegExp(`^data:image/${mimeType};base64,`), '');
    const buffer = Buffer.from(base64Data, 'base64');

    // Generate filename if not provided
    const targetFilename = filename || this.generateFilename(format);

    // Save file
    return this.saveBufferToFile(buffer, targetFilename, directory);
  }

  /**
   * Delete file
   * @param {string} filePath - Path to file to delete
   * @returns {boolean} Success status
   */
  deleteFile(filePath) {
    if (!this.fs) {
      console.warn('File system not available for deletion');
      return false;
    }

    try {
      if (this.fs.existsSync(filePath)) {
        this.fs.unlinkSync(filePath);
        this.tempFiles.delete(filePath);
        console.log('File deleted:', filePath);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to delete file:', filePath, error);
      return false;
    }
  }

  /**
   * Schedule file cleanup after delay
   * @param {string} filePath - Path to file to cleanup
   * @param {number} delay - Delay in milliseconds
   */
  scheduleCleanup(filePath, delay = 1000) {
    setTimeout(() => {
      this.deleteFile(filePath);
    }, delay);
  }

  /**
   * Check if file exists
   * @param {string} filePath - Path to check
   * @returns {boolean} File exists
   */
  fileExists(filePath) {
    if (!this.fs) {
      return false;
    }

    try {
      return this.fs.existsSync(filePath);
    } catch (error) {
      return false;
    }
  }

  /**
   * Get file stats
   * @param {string} filePath - Path to file
   * @returns {Object|null} File stats or null if error
   */
  getFileStats(filePath) {
    if (!this.fs) {
      return null;
    }

    try {
      return this.fs.statSync(filePath);
    } catch (error) {
      console.error('Failed to get file stats:', error);
      return null;
    }
  }

  /**
   * Validate file path
   * @param {string} filePath - Path to validate
   * @returns {Object} Validation result
   */
  validateFilePath(filePath) {
    const errors = [];

    if (!filePath || typeof filePath !== 'string') {
      errors.push('File path is required and must be a string');
    }

    if (filePath && filePath.includes('..')) {
      errors.push('File path contains invalid characters (..)');
    }

    if (filePath && filePath.length > 260) {
      errors.push('File path too long (max 260 characters)');
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  /**
   * Create temporary directory if needed
   * @param {string} dirPath - Directory path
   * @returns {boolean} Success status
   */
  ensureDirectory(dirPath) {
    if (!this.fs) {
      return false;
    }

    try {
      if (!this.fs.existsSync(dirPath)) {
        this.fs.mkdirSync(dirPath, { recursive: true });
        console.log('Directory created:', dirPath);
      }
      return true;
    } catch (error) {
      console.error('Failed to create directory:', error);
      return false;
    }
  }

  /**
   * Get safe filename by removing invalid characters
   * @param {string} filename - Original filename
   * @returns {string} Safe filename
   */
  getSafeFilename(filename) {
    // Remove or replace invalid characters
    return filename
      .replace(/[<>:"/\\|?*]/g, '_')
      .replace(/\s+/g, '_')
      .replace(/_{2,}/g, '_')
      .replace(/^_|_$/g, '');
  }

  /**
   * Cleanup all temporary files
   */
  cleanupTempFiles() {
    console.log(`Cleaning up ${this.tempFiles.size} temporary files`);

    for (const filePath of this.tempFiles) {
      this.deleteFile(filePath);
    }

    this.tempFiles.clear();
  }

  /**
   * Cleanup file manager resources
   */
  cleanup() {
    this.cleanupTempFiles();
    console.log('File manager cleaned up');
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FileManager;
} else {
  window.FileManager = FileManager;
}
