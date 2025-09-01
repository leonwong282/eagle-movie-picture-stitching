// 初始化多语言支持
initializeAllI18nFeatures();

let lastSelectedIds = '';	// 记录 list 上一次选中的文件 ID
let listRenderTimer = null;		// 记录 list 渲染的定时器
let isAlwaysOnTop = false; // 记录当前窗口是否置顶
let pollingInterval = null; // 轮询定时器引用，用于清理

// 获取裁剪和导出参数
function getParams(adjustingElement = null) {
	const elements = {
		cropTop: document.getElementById('cropTopPercent'),
		cropBottom: document.getElementById('cropBottomPercent'),
		exportFormat: document.getElementById('exportFormat'),
		exportQuality: document.getElementById('exportQuality')
	};
	
	// 检查元素是否存在
	if (!elements.cropTop || !elements.cropBottom || !elements.exportFormat || !elements.exportQuality) {
		console.warn('Some parameter elements not found');
		return {
			cropTopPercent: 0,
			cropBottomPercent: 0,
			exportFormat: 'jpg',
			exportQuality: 0.92
		};
	}
	
	// 验证和限制导出质量参数
	let exportQuality = parseFloat(elements.exportQuality.value) || 0.92;
		if (exportQuality < 0.1) {
			exportQuality = 0.1;
			elements.exportQuality.value = '0.1';
			console.warn('Export quality adjusted to valid range (0.1-1.0)');
		} else if (exportQuality > 1.0) {
			exportQuality = 1.0;
			elements.exportQuality.value = '1.0';
			console.warn('Export quality adjusted to valid range (0.1-1.0)');
		}	// 验证和限制裁剪参数
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
	
	// 智能调整裁剪参数：只调整当前正在修改的参数
	if (cropTopPercent + cropBottomPercent >= 100) {
		const maxAllowed = 99;
		
		if (adjustingElement === 'cropTopPercent') {
				// 用户正在调整顶部，固定底部，调整顶部
				const maxTop = maxAllowed - cropBottomPercent;
				if (cropTopPercent > maxTop) {
					cropTopPercent = maxTop;
					elements.cropTop.value = cropTopPercent.toString();
					console.warn(`Top crop adjusted to maximum setting: ${cropTopPercent}% (bottom fixed at ${cropBottomPercent}%)`);
				}
			} else if (adjustingElement === 'cropBottomPercent') {
				// 用户正在调整底部，固定顶部，调整底部
				const maxBottom = maxAllowed - cropTopPercent;
				if (cropBottomPercent > maxBottom) {
					cropBottomPercent = maxBottom;
					elements.cropBottom.value = cropBottomPercent.toString();
					console.warn(`Bottom crop adjusted to maximum setting: ${cropBottomPercent}% (top fixed at ${cropTopPercent}%)`);
				}
			} else {
				// 程序初始化或其他情况，按比例调整
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
		exportQuality
	};
}

// 清理资源函数
function cleanup() {
	// 清理定时器
	if (listRenderTimer) {
		clearTimeout(listRenderTimer);
		listRenderTimer = null;
	}
	if (pollingInterval) {
		clearInterval(pollingInterval);
		pollingInterval = null;
	}
	
	// 清理全局变量
	if (window.previewCanvas) {
		window.previewCanvas = null;
	}
	if (window.getPreviewDataURL) {
		window.getPreviewDataURL = null;
	}
}

// 防抖函数
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

// 更新剩余可用值显示
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
	
	// 视觉反馈
	if (total >= 100) {
		topElement.style.borderColor = '#f44336';
		bottomElement.style.borderColor = '#f44336';
	} else {
		topElement.style.borderColor = '#666';
		bottomElement.style.borderColor = '#666';
	}
}

// 保存图片到 Eagle 当前文件夹
async function saveImage() {
	const saveButton = document.getElementById('saveButton');
	const originalText = saveButton ? saveButton.textContent : '';
	
	try {
		// 显示保存状态
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
		
		// 优化：直接使用预览 Canvas 而不是重新创建
		const previewCanvas = window.previewCanvas;
		if (!previewCanvas) {
			showMessage('ui.messages.selectImages');
			return;
		}
		
		// 根据格式生成数据URL（质量已在 getParams 中验证）
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
		
		// 转换为 Buffer
		const base64Data = exportDataUrl.replace(new RegExp(`^data:image/${mimeType};base64,`), '');
		const buffer = Buffer.from(base64Data, 'base64');
		
		// 生成文件名（包含时间戳避免冲突）
		const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
		const fileName = `liang_stitched_image_${timestamp}.${exportFormat === 'jpg' ? 'jpg' : exportFormat === 'webp' ? 'webp' : 'png'}`;
		const filePath = path.join(__dirname, fileName);
		
		// 保存文件到本地
		fs.writeFileSync(filePath, buffer);
		
		// 将文件路径添加到 Eagle
		await eagle.item.addFromPath(filePath, {
			name: fileName,
			folders: [folder.id]
		});
		
		// 清理临时文件
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
		// 恢复按钮状态
		if (saveButton) {
			saveButton.textContent = originalText;
			saveButton.disabled = false;
		}
	}
}

eagle.onPluginCreate(async (plugin) => {
	// 初始化界面
	await renderList();
	
	// 设置窗口初始状态
	eagle.window.setAlwaysOnTop(isAlwaysOnTop);
	
	// 初始化剩余值显示
	updateRemainingValues();
	
	// 防抖渲染列表函数
	const debouncedRenderList = debounce(renderList, 200);
	
	// 绑定事件监听器
	document.getElementById('previewButton')?.addEventListener('click', renderPreview);
	document.getElementById('saveButton')?.addEventListener('click', saveImage);
	document.getElementById('closeButton')?.addEventListener('click', () => {
		cleanup();
		window.close();
	});
	
	// 置顶按钮事件
	document.getElementById('pinButton')?.addEventListener('click', function() {
		isAlwaysOnTop = !isAlwaysOnTop;
		eagle.window.setAlwaysOnTop(isAlwaysOnTop);
		this.style.color = isAlwaysOnTop ? '#ffd700' : '#fff';
		this.title = isAlwaysOnTop ? i18nManager.t('ui.interface.unpinTitle') : i18nManager.t('ui.interface.pinTitle');
	});

	// 优化轮询：使用更高效的变化检测
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
	
	// 添加参数变化监听器（实时预览和验证）
	const paramInputs = ['cropTopPercent', 'cropBottomPercent', 'exportQuality'];
	paramInputs.forEach(id => {
		const element = document.getElementById(id);
		if (element) {
			// 输入时实时验证
			element.addEventListener('input', debounce(() => {
				// 验证并调整参数，传递当前调整的元素ID
				getParams(id);
				
				// 如果已有预览，自动更新
				if (window.previewCanvas && (id === 'cropTopPercent' || id === 'cropBottomPercent')) {
					renderPreview();
				}
			}, 500));
			
			// 失去焦点时立即验证
			element.addEventListener('blur', () => {
				getParams(id); // 立即验证和调整参数值，传递当前元素ID
			});
			
			// 针对裁剪参数添加实时提示
			if (id === 'cropTopPercent' || id === 'cropBottomPercent') {
				element.addEventListener('input', () => {
					updateRemainingValues();
				});
			}
			
			// 针对 exportQuality 添加特殊处理
			if (id === 'exportQuality') {
				element.addEventListener('keydown', (e) => {
					// 只允许数字、小数点、退格键等
					if (!/[\d.\-]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
						e.preventDefault();
					}
				});
			}
		}
	});
});

// 渲染图片列表
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
		
		// 显示选择的图片数量
		const countDiv = document.createElement('div');
		countDiv.style.cssText = 'text-align: center; padding: 10px; color: #666; font-size: 12px; border-bottom: 1px solid #444;';
		const selectedText = i18nManager.t('ui.interface.imagesSelected', { count: selected.length });
		countDiv.textContent = selectedText;
		list.appendChild(countDiv);
		
		// 创建图片容器
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

// 渲染预览图片
async function renderPreview() {
	const previewButton = document.getElementById('previewButton');
	const originalText = previewButton ? previewButton.textContent : '';
	
	try {
		// 显示处理状态
		if (previewButton) {
			const processingText = i18nManager.t('ui.buttons.processing');
			previewButton.textContent = processingText;
			previewButton.disabled = true;
		}
		
		const previewContainer = document.querySelector('.preview');
		if (!previewContainer) return;
		
		// 显示加载状态
		const loadingText = i18nManager.t('ui.status.loading');
		previewContainer.innerHTML = `<div style="text-align: center; padding: 20px; color: #666;">${loadingText}</div>`;
		
		const selected = await eagle.item.getSelected();
		if (!selected || selected.length === 0) {
			const selectFirstText = i18nManager.t('ui.interface.selectImagesFirst');
			previewContainer.innerHTML = `<div style="text-align: center; padding: 20px; color: #999;">${selectFirstText}</div>`;
			return;
		}
		
		// 验证图片数量
		if (selected.length > 50) {
			const tooManyText = i18nManager.t('ui.interface.tooManyImages');
			previewContainer.innerHTML = `<div style="text-align: center; padding: 20px; color: #f44;">${tooManyText}</div>`;
			return;
		}
		
		const images = selected.map((item, index) => ({ 
			url: item.fileURL, 
			width: item.width, 
			height: item.height,
			name: item.name || i18nManager.t('ui.interface.imageName', { index: index + 1 })
		}));
		const { cropTopPercent, cropBottomPercent } = getParams();
		
		// 验证裁剪参数
		if (cropTopPercent + cropBottomPercent >= 100) {
			const cropErrorText = i18nManager.t('ui.interface.cropParameterError');
			previewContainer.innerHTML = `<div style="text-align: center; padding: 20px; color: #f44;">${cropErrorText}</div>`;
			return;
		}
		
		// 添加性能监控
		const startTime = performance.now();
		
		// 预加载所有图片以提高性能
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
				// 设置加载超时
				setTimeout(() => {
					if (!img.complete) {
						console.warn(`Image load timeout: ${imgData.name}`);
						resolve(null);
					}
				}, 10000); // 10秒超时
				img.src = imgData.url;
			})
		);
		
		const loadedImages = await Promise.all(loadPromises);
		
		// 过滤掉加载失败的图片
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
		
		// 计算总高度和验证尺寸
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
		
		// 检查canvas尺寸限制
		if (maxWidth > 32767 || totalHeight > 32767) {
			const sizeExceededText = i18nManager.t('ui.interface.imageSizeExceeded');
			previewContainer.innerHTML = `<div style="text-align: center; padding: 20px; color: #f44;">${sizeExceededText}</div>`;
			return;
		}
		
		canvas.width = maxWidth;
		canvas.height = totalHeight;
		
		let currentY = 0;
		
		// 批量绘制图片（已预加载，性能更好）
		validImages.forEach(({ img, data }, i) => {
			if (i === 0) {
				// 第一张图片只裁剪底部
				const cropBottom = Math.round(data.height * (cropBottomPercent / 100));
				const cropHeight = data.height - cropBottom;
				if (cropHeight > 0) {
					ctx.drawImage(img, 0, 0, data.width, cropHeight, 0, currentY, data.width, cropHeight);
					currentY += cropHeight;
				}
			} else {
				// 其他图片裁剪顶部和底部
				const cropTop = Math.round(data.height * (cropTopPercent / 100));
				const cropBottom = Math.round(data.height * (cropBottomPercent / 100));
				const cropHeight = data.height - cropTop - cropBottom;
				if (cropHeight > 0) {
					ctx.drawImage(img, 0, cropTop, data.width, cropHeight, 0, currentY, data.width, cropHeight);
					currentY += cropHeight;
				}
			}
		});
		
		// 清空加载状态
		previewContainer.innerHTML = '';
		
		// 优化：直接使用 Canvas 显示，避免不必要的转换
		canvas.style.maxWidth = '100%';
		canvas.style.maxHeight = '100%';
		canvas.style.display = 'block';
		canvas.style.margin = '0 auto';
		canvas.style.border = '1px solid #444';
		canvas.setAttribute('alt', 'Stitched preview');
		
		previewContainer.appendChild(canvas);
		
		// 存储 canvas 引用以便保存时使用
		window.previewCanvas = canvas;
		
		// 性能统计
		const endTime = performance.now();
		console.log(`Preview generation completed in ${(endTime - startTime).toFixed(2)}ms, processed ${validImages.length} images`);
		
		// 显示生成信息
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
		// 恢复按钮状态
		if (previewButton) {
			previewButton.textContent = originalText;
			previewButton.disabled = false;
		}
	}
}

// 添加窗口关闭前的清理
window.addEventListener('beforeunload', cleanup);

// 添加 Eagle 插件生命周期事件
if (typeof eagle !== 'undefined') {
	eagle.onPluginBeforeExit && eagle.onPluginBeforeExit(() => {
		cleanup();
	});
}

// 全局错误处理
window.addEventListener('error', (event) => {
	console.error('Global error:', event.error);
	// 如果是多语言相关错误，尝试恢复
	if (event.error?.message?.includes('i18n') || event.error?.message?.includes('translation')) {
		console.log('Detected i18n related error, attempting recovery...');
		setTimeout(() => {
			i18nManager.reinitialize().catch(error => {
				console.error('I18n recovery failed:', error);
			});
		}, 1000);
	}
});

// 未处理的Promise拒绝处理
window.addEventListener('unhandledrejection', (event) => {
	console.error('Unhandled promise rejection:', event.reason);
	if (event.reason?.message?.includes('i18n') || event.reason?.message?.includes('translation')) {
		console.log('Detected i18n promise error, attempting recovery...');
		event.preventDefault(); // 防止错误显示给用户
		setTimeout(() => {
			i18nManager.reinitialize().catch(error => {
				console.error('I18n promise recovery failed:', error);
			});
		}, 1000);
	}
});
