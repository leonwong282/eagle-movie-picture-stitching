// Initialize internationalization support
initializeAllI18nFeatures();

let lastSelectedIds = ''; // Track last selected file IDs in list
let listRenderTimer = null; // Timer for list rendering
let isAlwaysOnTop = false; // Track if current window is pinned on top
let pollingInterval = null; // Polling timer reference for cleanup

/**
 * Get cropping and export parameters with validation
 * @param {string|null} adjustingElement - Element currently being adjusted
 * @returns {Object} Configuration object with validated parameters
 */
function getParams(adjustingElement = null) {
  const elements = {
    cropTop: document.getElementById('cropTopPercent'),
    cropBottom: document.getElementById('cropBottomPercent'),
    exportFormat: document.getElementById('exportFormat'),
    exportQuality: document.getElementById('exportQuality'),
  };

  // Check if elements exist
  if (!elements.cropTop || !elements.cropBottom || !elements.exportFormat || !elements.exportQuality) {
    console.warn('Some parameter elements not found');
    return {
      cropTopPercent: 0,
      cropBottomPercent: 0,
      exportFormat: 'jpg',
      exportQuality: 0.92,
    };
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
 * Resource cleanup function
 * Clears timers and global variables
 */
function cleanup() {
  // Clear timers
  if (listRenderTimer) {
    clearTimeout(listRenderTimer);
    listRenderTimer = null;
  }
  if (pollingInterval) {
    clearInterval(pollingInterval);
    pollingInterval = null;
  }

  // Clear global variables
  if (window.previewCanvas) {
    window.previewCanvas = null;
  }
  if (window.getPreviewDataURL) {
    window.getPreviewDataURL = null;
  }
}

/**
 * Debounce function to limit the rate of function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
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
 * Update remaining available value display
 * Updates UI to show remaining crop percentages and visual feedback
 */
function updateRemainingValues() {
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
 * Save image to current Eagle folder
 * Handles export format, quality settings, and file saving
 */
async function saveImage() {
  const saveButton = document.getElementById('saveButton');
  const originalText = saveButton ? saveButton.textContent : '';

  try {
    // Show save status
    if (saveButton) {
      const processingText = i18nManager.t('ui.messages.processing');
      saveButton.textContent = processingText;
      saveButton.disabled = true;
    }

    const folders = await eagle.folder.getSelected();
    if (!folders || folders.length === 0) {
      showMessage('ui.messages.selectImages');
      return;
    }

    const folder = folders[0];
    const { exportFormat, exportQuality } = getParams();
    const fs = require('fs');
    const path = require('path');

    // Optimization: Use preview Canvas directly instead of recreating
    const previewCanvas = window.previewCanvas;
    if (!previewCanvas) {
      showMessage('ui.messages.selectImages');
      return;
    }

    // Generate data URL based on format (quality already validated in getParams)
    let exportDataUrl;
    let mimeType;
    switch (exportFormat) {
      case 'jpg':
        exportDataUrl = previewCanvas.toDataURL('image/jpeg', exportQuality);
        mimeType = 'jpeg';
        break;
      case 'webp':
        exportDataUrl = previewCanvas.toDataURL('image/webp', exportQuality);
        mimeType = 'webp';
        break;
      case 'png':
      default:
        exportDataUrl = previewCanvas.toDataURL('image/png');
        mimeType = 'png';
        break;
    }

    // Convert to Buffer
    const base64Data = exportDataUrl.replace(new RegExp(`^data:image/${mimeType};base64,`), '');
    const buffer = Buffer.from(base64Data, 'base64');

    // Generate filename (with timestamp to avoid conflicts)
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const fileName = `liang_stitched_image_${timestamp}.${exportFormat === 'jpg' ? 'jpg' : exportFormat === 'webp' ? 'webp' : 'png'}`;
    const filePath = path.join(__dirname, fileName);

    // Save file locally
    fs.writeFileSync(filePath, buffer);

    // Add file path to Eagle
    await eagle.item.addFromPath(filePath, {
      name: fileName,
      folders: [folder.id],
    });

    // Clean up temporary file
    setTimeout(() => {
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (err) {
        console.warn('Failed to cleanup temporary file:', err);
      }
    }, 1000);

    showMessage('ui.messages.success');
  } catch (error) {
    console.error('Error saving image:', error);
    showMessage('ui.messages.error');
  } finally {
    // Restore button state
    if (saveButton) {
      saveButton.textContent = originalText;
      saveButton.disabled = false;
    }
  }
}

eagle.onPluginCreate(async (plugin) => {
  // Initialize interface
  await renderList();

  // Set initial window state
  eagle.window.setAlwaysOnTop(isAlwaysOnTop);

  // Initialize remaining value display
  updateRemainingValues();

  // Debounced render list function
  const debouncedRenderList = debounce(renderList, 200);

  // Bind event listeners
  document.getElementById('previewButton')?.addEventListener('click', renderPreview);
  document.getElementById('saveButton')?.addEventListener('click', saveImage);
  document.getElementById('closeButton')?.addEventListener('click', () => {
    cleanup();
    window.close();
  });

  // Pin to top button event
  document.getElementById('pinButton')?.addEventListener('click', function() {
    isAlwaysOnTop = !isAlwaysOnTop;
    eagle.window.setAlwaysOnTop(isAlwaysOnTop);
    this.style.color = isAlwaysOnTop ? '#ffd700' : '#fff';
    this.title = isAlwaysOnTop ? i18nManager.t('ui.interface.unpinTitle') : i18nManager.t('ui.interface.pinTitle');
  });

  // Optimized polling: Use more efficient change detection
  pollingInterval = setInterval(async () => {
    try {
      const selected = await eagle.item.getSelected();
      const ids = selected ? selected.map(item => item.id).join(',') : '';
      if (ids !== lastSelectedIds) {
        lastSelectedIds = ids;
        if (listRenderTimer) clearTimeout(listRenderTimer);
        listRenderTimer = setTimeout(() => {
          debouncedRenderList();
        }, 300);
      }
    } catch (error) {
      console.error('Error polling selection changes:', error);
    }
  }, 500);

  // Add parameter change listeners (real-time preview and validation)
  const paramInputs = ['cropTopPercent', 'cropBottomPercent', 'exportQuality'];
  paramInputs.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      // Real-time validation on input
      element.addEventListener('input', debounce(() => {
        // Validate and adjust parameters, pass current adjusted element ID
        getParams(id);

        // If preview exists, auto-update
        if (window.previewCanvas && (id === 'cropTopPercent' || id === 'cropBottomPercent')) {
          renderPreview();
        }
      }, 500));

      // Validate immediately on blur
      element.addEventListener('blur', () => {
        getParams(id); // Immediately validate and adjust parameter values, pass current element ID
      });

      // Add real-time hints for crop parameters
      if (id === 'cropTopPercent' || id === 'cropBottomPercent') {
        element.addEventListener('input', () => {
          updateRemainingValues();
        });
      }

      // Add special handling for exportQuality
      if (id === 'exportQuality') {
        element.addEventListener('keydown', (e) => {
          // Only allow numbers, decimal points, backspace keys, etc.
          if (!/[\d.\-]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            e.preventDefault();
          }
        });
      }
    }
  });
});

/**
 * Render image list from Eagle selected items
 * Updates the UI to display selected images with thumbnails
 */
async function renderList() {
  try {
    const list = document.querySelector('.list');
    if (!list) return;

    list.innerHTML = '';
    const selected = await eagle.item.getSelected();
    if (!selected || selected.length === 0) {
      const noImagesText = i18nManager.t('ui.interface.noImagesSelected');
      list.innerHTML = `<div style="text-align: center; padding: 20px; color: #999; font-size: 14px;">${noImagesText}</div>`;
      return;
    }

    // Display number of selected images
    const countDiv = document.createElement('div');
    countDiv.style.cssText = 'text-align: center; padding: 10px; color: #666; font-size: 12px; border-bottom: 1px solid #444;';
    const selectedText = i18nManager.t('ui.interface.imagesSelected', { count: selected.length });
    countDiv.textContent = selectedText;
    list.appendChild(countDiv);

    // Create image container
    const imagesContainer = document.createElement('div');
    imagesContainer.style.cssText = 'display: flex; flex-direction: column; gap: 5px; padding: 10px;';

    selected.forEach((item, index) => {
      const imgWrapper = document.createElement('div');
      imgWrapper.style.cssText = 'display: flex; align-items: center; padding: 5px; background: #333; border-radius: 4px;';

      const img = document.createElement('img');
      img.src = item.thumbnailURL;
      img.style.cssText = 'width: 60px; height: 60px; object-fit: cover; border-radius: 3px; margin-right: 10px;';
      img.alt = item.name || `Image ${index + 1}`;

      const info = document.createElement('div');
      info.style.cssText = 'flex: 1; color: #ccc; font-size: 12px;';
      const imageName = item.name || i18nManager.t('ui.interface.imageName', { index: index + 1 });
      info.innerHTML = `
        <div style="font-weight: bold; margin-bottom: 2px;">${index + 1}. ${imageName}</div>
        <div>${item.width} × ${item.height}px</div>
      `;

      imgWrapper.appendChild(img);
      imgWrapper.appendChild(info);
      imagesContainer.appendChild(imgWrapper);
    });

    list.appendChild(imagesContainer);
  } catch (error) {
    console.error('Error rendering image list:', error);
    const list = document.querySelector('.list');
    if (list) {
      const loadFailedText = i18nManager.t('ui.interface.loadFailed');
      list.innerHTML = `<div style="text-align: center; padding: 20px; color: #f44;">${loadFailedText}</div>`;
    }
  }
}

/**
 * Render preview image by stitching selected images
 * Handles image loading, cropping, and canvas composition
 */
async function renderPreview() {
  const previewButton = document.getElementById('previewButton');
  const originalText = previewButton ? previewButton.textContent : '';

  try {
    // Show processing status
    if (previewButton) {
      const processingText = i18nManager.t('ui.buttons.processing');
      previewButton.textContent = processingText;
      previewButton.disabled = true;
    }

    const previewContainer = document.querySelector('.preview');
    if (!previewContainer) return;

    // Show loading status
    const loadingText = i18nManager.t('ui.status.loading');
    previewContainer.innerHTML = `<div style="text-align: center; padding: 20px; color: #666;">${loadingText}</div>`;

    const selected = await eagle.item.getSelected();
    if (!selected || selected.length === 0) {
      const selectFirstText = i18nManager.t('ui.interface.selectImagesFirst');
      previewContainer.innerHTML = `<div style="text-align: center; padding: 20px; color: #999;">${selectFirstText}</div>`;
      return;
    }

    // Validate image count
    if (selected.length > 50) {
      const tooManyText = i18nManager.t('ui.interface.tooManyImages');
      previewContainer.innerHTML = `<div style="text-align: center; padding: 20px; color: #f44;">${tooManyText}</div>`;
      return;
    }

    const images = selected.map((item, index) => ({
      url: item.fileURL,
      width: item.width,
      height: item.height,
      name: item.name || i18nManager.t('ui.interface.imageName', { index: index + 1 }),
    }));
    const { cropTopPercent, cropBottomPercent } = getParams();

    // Validate crop parameters
    if (cropTopPercent + cropBottomPercent >= 100) {
      const cropErrorText = i18nManager.t('ui.interface.cropParameterError');
      previewContainer.innerHTML = `<div style="text-align: center; padding: 20px; color: #f44;">${cropErrorText}</div>`;
      return;
    }

    // Add performance monitoring
    const startTime = performance.now();

    // Preload all images to improve performance
    const loadPromises = images.map((imgData, index) =>
      new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          console.log(`Image ${index + 1}/${images.length} loaded: ${imgData.name}`);
          resolve({ img, data: imgData });
        };
        img.onerror = (error) => {
          console.error(`Image load failed [${index + 1}]:`, imgData.url, error);
          resolve(null);
        };
        // Set loading timeout
        setTimeout(() => {
          if (!img.complete) {
            console.warn(`Image load timeout: ${imgData.name}`);
            resolve(null);
          }
        }, 10000); // 10 second timeout
        img.src = imgData.url;
      })
    );

    const loadedImages = await Promise.all(loadPromises);
		
		// Filter out failed to load images
		const validImages = loadedImages.filter(item => item !== null);
		
		if (validImages.length === 0) {
			const allFailedText = i18nManager.t('ui.interface.allImagesLoadFailed');
			previewContainer.innerHTML = `<div style="text-align: center; padding: 20px; color: #f44;">${allFailedText}</div>`;
			return;
		}
		
		if (validImages.length !== images.length) {
			const failedCount = images.length - validImages.length;
			const partialFailedMsg = i18nManager.t('ui.interface.imageLoadFailed', { count: failedCount });
			console.warn(`${failedCount} images failed to load, continuing with remaining images`);
		}
		
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');
		
		// Calculate total height and validate dimensions
		const totalHeight = validImages.reduce((sum, { data }, idx) => {
			if (idx === 0) {
				const cropBottom = Math.round(data.height * (cropBottomPercent / 100));
				return sum + (data.height - cropBottom);
			} else {
				const cropTop = Math.round(data.height * (cropTopPercent / 100));
				const cropBottom = Math.round(data.height * (cropBottomPercent / 100));
				return sum + (data.height - cropTop - cropBottom);
			}
		}, 0);
		
		const maxWidth = Math.max(...validImages.map(({ data }) => data.width));
		
		// Check canvas size limits
		if (maxWidth > 32767 || totalHeight > 32767) {
			const sizeExceededText = i18nManager.t('ui.interface.imageSizeExceeded');
			previewContainer.innerHTML = `<div style="text-align: center; padding: 20px; color: #f44;">${sizeExceededText}</div>`;
			return;
		}
		
		canvas.width = maxWidth;
		canvas.height = totalHeight;
		
		let currentY = 0;
		
		// Batch draw images (preloaded, better performance)
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
				// Crop top and bottom of other images
				const cropTop = Math.round(data.height * (cropTopPercent / 100));
				const cropBottom = Math.round(data.height * (cropBottomPercent / 100));
				const cropHeight = data.height - cropTop - cropBottom;
				if (cropHeight > 0) {
					ctx.drawImage(img, 0, cropTop, data.width, cropHeight, 0, currentY, data.width, cropHeight);
					currentY += cropHeight;
				}
			}
		});
		
		// Clear loading state
		previewContainer.innerHTML = '';
		
		// Optimization: Use Canvas directly for display, avoiding unnecessary conversions
		canvas.style.maxWidth = '100%';
		canvas.style.maxHeight = '100%';
		canvas.style.display = 'block';
		canvas.style.margin = '0 auto';
		canvas.style.border = '1px solid #444';
		canvas.setAttribute('alt', 'Stitched preview');
		
		previewContainer.appendChild(canvas);
		
		// Store canvas reference for save use
		window.previewCanvas = canvas;
		
		// Performance statistics
		const endTime = performance.now();
		console.log(`Preview generation completed in ${(endTime - startTime).toFixed(2)}ms, processed ${validImages.length} images`);
		
		// Show generation information
		const infoDiv = document.createElement('div');
		infoDiv.style.cssText = 'text-align: center; padding: 10px; color: #999; font-size: 12px;';
		const processedText = i18nManager.t('ui.interface.imagesProcessed', { 
			count: validImages.length, 
			width: maxWidth, 
			height: totalHeight 
		});
		infoDiv.textContent = processedText;
		previewContainer.appendChild(infoDiv);
		
	} catch (error) {
		console.error('Error rendering preview:', error);
		const previewContainer = document.querySelector('.preview');
		if (previewContainer) {
			const failedText = i18nManager.t('ui.interface.previewGenerationFailed', { 
				error: error.message || i18nManager.t('ui.interface.unknownError')
			});
			previewContainer.innerHTML = `<div style="text-align: center; padding: 20px; color: #f44;">${failedText}</div>`;
		}
	} finally {
		// Restore button state
		if (previewButton) {
			previewButton.textContent = originalText;
			previewButton.disabled = false;
		}
	}
}

// Add cleanup before window close
window.addEventListener('beforeunload', cleanup);

// Add Eagle plugin lifecycle events
if (typeof eagle !== 'undefined') {
	eagle.onPluginBeforeExit && eagle.onPluginBeforeExit(() => {
		cleanup();
	});
}

// Global error handling
window.addEventListener('error', (event) => {
	console.error('Global error:', event.error);
	// If it's a multilingual related error, try to recover
	if (event.error?.message?.includes('i18n') || event.error?.message?.includes('translation')) {
		console.log('Detected i18n related error, attempting recovery...');
		setTimeout(() => {
			i18nManager.reinitialize().catch(error => {
				console.error('I18n recovery failed:', error);
			});
		}, 1000);
	}
});

// Unhandled Promise rejection handling
window.addEventListener('unhandledrejection', (event) => {
	console.error('Unhandled promise rejection:', event.reason);
	if (event.reason?.message?.includes('i18n') || event.reason?.message?.includes('translation')) {
		console.log('Detected i18n promise error, attempting recovery...');
		event.preventDefault(); // Prevent error from being shown to user
		setTimeout(() => {
			i18nManager.reinitialize().catch(error => {
				console.error('I18n promise recovery failed:', error);
			});
		}, 1000);
	}
});
