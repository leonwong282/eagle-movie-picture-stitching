
// 多语言管理器
class I18nManager {
	constructor() {
		this.isInitialized = false;
		this.currentLanguage = 'zh_CN';
		this.fallbackLanguage = 'zh_CN';
		this.retryCount = 0;
		this.maxRetries = 5;
		this.initPromise = null;
	}

	// 检测当前语言
	detectLanguage() {
		try {
			// 优先使用 Eagle 的语言设置
			if (eagle && eagle.app && eagle.app.locale) {
				this.currentLanguage = eagle.app.locale;
				console.log('检测到 Eagle 语言设置:', this.currentLanguage);
				return this.currentLanguage;
			}
			
			// 降级到浏览器语言
			const browserLang = navigator.language || navigator.userLanguage;
			if (browserLang) {
				// 将浏览器语言代码转换为支持的语言
				const langMap = {
					'en': 'en',
					'en-US': 'en',
					'en-GB': 'en',
					'zh': 'zh_CN',
					'zh-CN': 'zh_CN',
					'zh-Hans': 'zh_CN',
					'zh-TW': 'zh_TW',
					'zh-Hant': 'zh_TW'
				};
				
				this.currentLanguage = langMap[browserLang] || langMap[browserLang.split('-')[0]] || this.fallbackLanguage;
				console.log('使用浏览器语言设置:', browserLang, '-> 映射为:', this.currentLanguage);
			}
		} catch (error) {
			console.warn('语言检测失败，使用默认语言:', error);
			this.currentLanguage = this.fallbackLanguage;
		}
		
		return this.currentLanguage;
	}

	// 等待 i18next 加载
	async waitForI18next() {
		console.log('等待 i18next 库加载...');
		return new Promise((resolve, reject) => {
			const checkI18next = () => {
				if (typeof i18next !== 'undefined') {
					console.log('i18next 库加载成功');
					// 检查是否有翻译数据
					const testTranslation = i18next.t('ui.buttons.preview');
					console.log('测试翻译结果:', testTranslation);
					resolve(true);
				} else if (this.retryCount >= this.maxRetries) {
					reject(new Error('i18next 加载超时'));
				} else {
					this.retryCount++;
					console.log(`等待 i18next 加载... (${this.retryCount}/${this.maxRetries})`);
					setTimeout(checkI18next, 200);
				}
			};
			checkI18next();
		});
	}

	// 初始化多语言
	async initialize() {
		if (this.initPromise) {
			return this.initPromise;
		}

		this.initPromise = this._doInitialize();
		return this.initPromise;
	}

	async _doInitialize() {
		try {
			console.log('开始初始化多语言系统...');
			
			// 检测语言
			this.detectLanguage();
			
			// 等待 i18next 加载
			await this.waitForI18next();
			
			// 设置初始化标志（在应用翻译之前）
			this.isInitialized = true;
			
			// 应用翻译
			this.applyTranslations();
			
			console.log('多语言系统初始化完成，当前语言:', this.currentLanguage);
			
			return true;
		} catch (error) {
			console.error('多语言初始化失败:', error);
			this.isInitialized = false;
			throw error;
		}
	}

	// 应用翻译到页面元素
	applyTranslations() {
		if (typeof i18next === 'undefined') {
			console.warn('i18next 未加载，跳过翻译应用');
			return;
		}

		try {
			console.log('开始应用翻译，当前语言:', this.currentLanguage);
			
			// 处理所有带有 data-i18n 属性的元素
			const elements = document.querySelectorAll('[data-i18n]');
			console.log(`找到 ${elements.length} 个需要翻译的元素`);
			
			elements.forEach(element => {
				this.translateElement(element);
			});

			// 特殊处理：动态更新的元素
			this.updateDynamicElements();
			
			console.log('翻译应用完成');
		} catch (error) {
			console.error('应用翻译时出错:', error);
		}
	}

	// 翻译单个元素
	translateElement(element) {
		const key = element.getAttribute('data-i18n');
		if (!key) return;

		try {
			// 处理属性绑定：[attribute]translation.key
			if (key.startsWith('[') && key.includes(']')) {
				const match = key.match(/\[([^\]]+)\](.+)/);
				if (match) {
					const attribute = match[1];
					const translationKey = match[2];
					const translation = i18next.t(translationKey);
					element.setAttribute(attribute, translation);
				}
			} else {
				// 普通文本翻译
				const translation = i18next.t(key);
				if (translation && translation !== key) {
					element.textContent = translation;
				}
			}
		} catch (error) {
			console.warn('翻译元素失败:', key, error);
		}
	}

	// 更新动态元素
	updateDynamicElements() {
		try {
			console.log('更新动态元素...');
			
			// 更新按钮
			const buttons = {
				'previewButton': 'ui.buttons.preview',
				'saveButton': 'ui.buttons.save'
			};

			Object.entries(buttons).forEach(([id, key]) => {
				const button = document.getElementById(id);
				if (button) {
					const translation = this.t(key);
					console.log(`更新按钮 ${id}: ${key} -> ${translation}`);
					button.textContent = translation;
					button.setAttribute('aria-label', translation);
				} else {
					console.warn(`按钮元素不存在: ${id}`);
				}
			});

			// 更新动态提示文本
			this.updateRemainingCropValues();
			
			console.log('动态元素更新完成');
		} catch (error) {
			console.error('更新动态元素时出错:', error);
		}
	}

	// 更新裁剪剩余值显示
	updateRemainingCropValues() {
		const topElement = document.getElementById('remaining-top');
		const bottomElement = document.getElementById('remaining-bottom');
		
		if (topElement && bottomElement) {
			// 重新计算并更新显示
			const { cropTopPercent, cropBottomPercent } = getParams();
			const remainingTop = Math.max(0, 99 - cropBottomPercent);
			const remainingBottom = Math.max(0, 99 - cropTopPercent);
			
			topElement.textContent = remainingTop;
			bottomElement.textContent = remainingBottom;
		}
	}

	// 安全的翻译函数
	t(key, options = {}) {
		// 只要i18next可用就尝试翻译，不必等待完整初始化
		if (typeof i18next === 'undefined') {
			console.warn('i18next 未加载，返回 key:', key);
			return key;
		}

		try {
			const result = i18next.t(key, options);
			// 如果翻译结果和key相同，说明翻译不存在
			if (result === key) {
				console.warn('翻译键不存在:', key);
			}
			return result !== key ? result : key;
		} catch (error) {
			console.warn('翻译失败:', key, error);
			return key;
		}
	}

	// 显示本地化消息
	showMessage(key, variables = {}) {
		const message = this.t(key, variables);
		alert(message);
	}

	// 本地化日志
	logMessage(key, variables = {}) {
		const message = this.t(key, variables);
		console.warn(message);
	}

	// 强制重新初始化
	async reinitialize() {
		this.isInitialized = false;
		this.initPromise = null;
		this.retryCount = 0;
		return this.initialize();
	}

	// 调试功能：获取多语言状态
	getDebugInfo() {
		return {
			isInitialized: this.isInitialized,
			currentLanguage: this.currentLanguage,
			fallbackLanguage: this.fallbackLanguage,
			retryCount: this.retryCount,
			i18nextAvailable: typeof i18next !== 'undefined',
			eagleLocale: eagle?.app?.locale,
			supportedLanguages: ['en', 'zh_CN', 'zh_TW'],
			translatedElementsCount: document.querySelectorAll('[data-i18n]').length
		};
	}

	// 调试功能：验证翻译完整性
	validateTranslations() {
		const issues = [];
		const elements = document.querySelectorAll('[data-i18n]');
		
		elements.forEach(element => {
			const key = element.getAttribute('data-i18n');
			if (key) {
				const translation = this.t(key);
				if (translation === key) {
					issues.push({
						element: element,
						key: key,
						issue: 'Translation missing or key not found'
					});
				}
			}
		});
		
		return {
			totalElements: elements.length,
			issues: issues,
			healthScore: ((elements.length - issues.length) / elements.length * 100).toFixed(1) + '%'
		};
	}

	// 调试功能：手动触发翻译
	forceRetranslate() {
		console.log('强制重新翻译所有元素...');
		this.applyTranslations();
		return this.validateTranslations();
	}
}

// 创建全局多语言管理器实例
const i18nManager = new I18nManager();

// 开发调试：将管理器暴露到全局作用域（仅在开发环境）
if (typeof window !== 'undefined') {
	window.i18nDebug = {
		manager: i18nManager,
		getInfo: () => i18nManager.getDebugInfo(),
		validate: () => i18nManager.validateTranslations(),
		retranslate: () => i18nManager.forceRetranslate(),
		reinit: () => i18nManager.reinitialize(),
		// 快速语言测试
		testLanguage: (lang) => {
			const oldLang = i18nManager.currentLanguage;
			i18nManager.currentLanguage = lang;
			i18nManager.applyTranslations();
			console.log(`已切换到语言: ${lang} (之前: ${oldLang})`);
			return i18nManager.validateTranslations();
		}
	};
	
	console.log('🌐 多语言调试工具已加载！');
	console.log('使用 window.i18nDebug 访问调试功能：');
	console.log('- i18nDebug.getInfo() - 获取状态信息');
	console.log('- i18nDebug.validate() - 验证翻译完整性');
	console.log('- i18nDebug.retranslate() - 强制重新翻译');
	console.log('- i18nDebug.testLanguage("en") - 测试语言切换');
	console.log('- i18nDebug.quickCheck() - 快速状态检查');
	
	// 添加快速状态检查
	window.i18nDebug.quickCheck = () => {
		const info = i18nManager.getDebugInfo();
		console.table(info);
		
		if (!info.isInitialized) {
			console.warn('⚠️ 多语言系统未初始化');
			console.log('尝试手动初始化: i18nDebug.reinit()');
		}
		
		if (!info.i18nextAvailable) {
			console.error('❌ i18next 库未加载');
		}
		
		return info;
	};
}

// 兼容性函数（保持向后兼容）
function initializeI18n() {
	return i18nManager.initialize().catch(error => {
		console.error('多语言初始化失败:', error);
	});
}

function showMessage(key, variables = {}) {
	i18nManager.showMessage(key, variables);
}

function logMessage(key, variables = {}) {
	i18nManager.logMessage(key, variables);
}

// Eagle 插件生命周期事件
eagle.onPluginCreate(async () => {
	console.log('🚀 Eagle 插件创建事件触发');
	console.log('Eagle 对象可用性检查:', {
		eagle: typeof eagle !== 'undefined',
		app: eagle?.app ? 'available' : 'not available',
		locale: eagle?.app?.locale || 'not detected'
	});
	
	try {
		console.log('开始初始化多语言...');
		await i18nManager.initialize();
		console.log('✅ 多语言初始化成功');
	} catch (error) {
		console.error('❌ 插件创建时多语言初始化失败:', error);
		// 尝试降级处理
		console.log('尝试降级初始化...');
		setTimeout(() => {
			i18nManager.reinitialize().catch(e => {
				console.error('降级初始化也失败:', e);
			});
		}, 1000);
	}
});

eagle.onPluginShow(async () => {
	console.log('👁️ Eagle 插件显示事件触发');
	console.log('当前初始化状态:', {
		isInitialized: i18nManager.isInitialized,
		currentLanguage: i18nManager.currentLanguage,
		eagleLocale: eagle?.app?.locale
	});
	
	// 确保多语言正确应用，支持语言切换
	try {
		if (!i18nManager.isInitialized) {
			console.log('多语言未初始化，开始初始化...');
			await i18nManager.initialize();
		} else {
			// 重新检测语言（用户可能在 Eagle 中切换了语言）
			const newLanguage = i18nManager.detectLanguage();
			if (newLanguage !== i18nManager.currentLanguage) {
				console.log('🔄 检测到语言变化，重新初始化:', i18nManager.currentLanguage, '->', newLanguage);
				await i18nManager.reinitialize();
			} else {
				console.log('语言未变化，重新应用翻译...');
				// 重新应用翻译（确保动态内容正确）
				i18nManager.applyTranslations();
			}
		}
		console.log('✅ 多语言处理完成');
	} catch (error) {
		console.error('插件显示时多语言处理失败:', error);
	}
});

// eagle.onPluginRun(() => {
// 	console.log('eagle.onPluginRun');
// });

// eagle.onPluginHide(() => {
// 	console.log('eagle.onPluginHide');
// });

// eagle.onPluginBeforeExit((event) => {
// 	console.log('eagle.onPluginBeforeExit');
// });

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
		console.warn('某些参数元素不存在');
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
			logMessage('ui.messages.invalidQuality');
		} else if (exportQuality > 1.0) {
			exportQuality = 1.0;
			elements.exportQuality.value = '1.0';
			logMessage('ui.messages.invalidQuality');
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
					logMessage('ui.messages.topCropAdjusted', { percent: cropTopPercent, bottom: cropBottomPercent });
				}
			} else if (adjustingElement === 'cropBottomPercent') {
				// 用户正在调整底部，固定顶部，调整底部
				const maxBottom = maxAllowed - cropTopPercent;
				if (cropBottomPercent > maxBottom) {
					cropBottomPercent = maxBottom;
					elements.cropBottom.value = cropBottomPercent.toString();
					logMessage('ui.messages.bottomCropAdjusted', { percent: cropBottomPercent, top: cropTopPercent });
				}
			} else {
				// 程序初始化或其他情况，按比例调整
				const total = cropTopPercent + cropBottomPercent;
				const ratio = maxAllowed / total;
				cropTopPercent = Math.floor(cropTopPercent * ratio);
				cropBottomPercent = Math.floor(cropBottomPercent * ratio);
				
				elements.cropTop.value = cropTopPercent.toString();
				elements.cropBottom.value = cropBottomPercent.toString();
				logMessage('ui.messages.cropAdjusted');
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
				console.warn('清理临时文件失败:', err);
			}
		}, 1000);
		
		showMessage('ui.messages.success');
	} catch (error) {
		console.error('保存图片时出错:', error);
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
		this.title = isAlwaysOnTop ? '取消置顶' : '窗口置顶';
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
			console.error('轮询选中变化时出错:', error);
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
			list.innerHTML = '<div style="text-align: center; padding: 20px; color: #999; font-size: 14px;">未选择图片<br>请在 Eagle 中选择要拼接的图片</div>';
			return;
		}
		
		// 显示选择的图片数量
		const countDiv = document.createElement('div');
		countDiv.style.cssText = 'text-align: center; padding: 10px; color: #666; font-size: 12px; border-bottom: 1px solid #444;';
		countDiv.textContent = `已选择 ${selected.length} 张图片`;
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
			info.innerHTML = `
				<div style="font-weight: bold; margin-bottom: 2px;">${index + 1}. ${item.name || 'Unknown'}</div>
				<div>${item.width} × ${item.height}px</div>
			`;
			
			imgWrapper.appendChild(img);
			imgWrapper.appendChild(info);
			imagesContainer.appendChild(imgWrapper);
		});
		
		list.appendChild(imagesContainer);
	} catch (error) {
		console.error('渲染图片列表时出错:', error);
		const list = document.querySelector('.list');
		if (list) {
			list.innerHTML = '<div style="text-align: center; padding: 20px; color: #f44;">加载失败</div>';
		}
	}
}

// 添加 DOM 变化监听器和语言变化检测
function setupAdvancedI18nFeatures() {
	// 监听DOM变化，自动翻译新添加的元素
	const observer = new MutationObserver((mutations) => {
		mutations.forEach((mutation) => {
			mutation.addedNodes.forEach((node) => {
				if (node.nodeType === Node.ELEMENT_NODE) {
					// 检查新添加的元素是否需要翻译
					const elementsToTranslate = node.querySelectorAll ? 
						[node, ...node.querySelectorAll('[data-i18n]')] : 
						[node];
					
					elementsToTranslate.forEach(element => {
						if (element.hasAttribute && element.hasAttribute('data-i18n')) {
							i18nManager.translateElement(element);
						}
					});
				}
			});
		});
	});
	
	// 开始监听DOM变化
	observer.observe(document.body, {
		childList: true,
		subtree: true
	});
	
	// 定期检查语言变化（Eagle用户可能会切换语言）
	let lastDetectedLanguage = i18nManager.currentLanguage;
	setInterval(() => {
		const currentLanguage = i18nManager.detectLanguage();
		if (currentLanguage !== lastDetectedLanguage) {
			console.log('检测到语言变化:', lastDetectedLanguage, '->', currentLanguage);
			lastDetectedLanguage = currentLanguage;
			i18nManager.reinitialize().catch(error => {
				console.error('语言变化后重新初始化失败:', error);
			});
		}
	}, 3000); // 每3秒检查一次
}

// 添加窗口关闭前的清理
window.addEventListener('beforeunload', cleanup);

// 在DOM加载完成后设置高级功能
document.addEventListener('DOMContentLoaded', () => {
	setupAdvancedI18nFeatures();
});

// 如果DOM已经加载完成，立即设置
if (document.readyState !== 'loading') {
	setupAdvancedI18nFeatures();
}

// 添加 Eagle 插件生命周期事件
if (typeof eagle !== 'undefined') {
	eagle.onPluginBeforeExit && eagle.onPluginBeforeExit(() => {
		cleanup();
	});
}

// 全局错误处理
window.addEventListener('error', (event) => {
	console.error('全局错误:', event.error);
	// 如果是多语言相关错误，尝试恢复
	if (event.error?.message?.includes('i18n') || event.error?.message?.includes('translation')) {
		console.log('检测到多语言相关错误，尝试恢复...');
		setTimeout(() => {
			i18nManager.reinitialize().catch(error => {
				console.error('多语言恢复失败:', error);
			});
		}, 1000);
	}
});

// 未处理的Promise拒绝处理
window.addEventListener('unhandledrejection', (event) => {
	console.error('未处理的Promise拒绝:', event.reason);
	if (event.reason?.message?.includes('i18n') || event.reason?.message?.includes('translation')) {
		console.log('检测到多语言Promise错误，尝试恢复...');
		event.preventDefault(); // 防止错误显示给用户
		setTimeout(() => {
			i18nManager.reinitialize().catch(error => {
				console.error('多语言Promise恢复失败:', error);
			});
		}, 1000);
	}
});

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
			previewContainer.innerHTML = '<div style="text-align: center; padding: 20px; color: #999;">请先选择图片</div>';
			return;
		}
		
		// 验证图片数量
		if (selected.length > 50) {
			previewContainer.innerHTML = '<div style="text-align: center; padding: 20px; color: #f44;">选择的图片过多（超过50张），请减少选择</div>';
			return;
		}
		
		const images = selected.map(item => ({ 
			url: item.fileURL, 
			width: item.width, 
			height: item.height,
			name: item.name || 'Unknown'
		}));
		const { cropTopPercent, cropBottomPercent } = getParams();
		
		// 验证裁剪参数
		if (cropTopPercent + cropBottomPercent >= 100) {
			previewContainer.innerHTML = '<div style="text-align: center; padding: 20px; color: #f44;">裁剪参数错误：顶部+底部裁剪不能超过100%</div>';
			return;
		}
		
		// 添加性能监控
		const startTime = performance.now();
		
		// 预加载所有图片以提高性能
		const loadPromises = images.map((imgData, index) => 
			new Promise((resolve) => {
				const img = new Image();
				img.onload = () => {
					console.log(`图片 ${index + 1}/${images.length} 加载完成: ${imgData.name}`);
					resolve({ img, data: imgData });
				};
				img.onerror = (error) => {
					console.error(`图片加载失败 [${index + 1}]:`, imgData.url, error);
					resolve(null);
				};
				// 设置加载超时
				setTimeout(() => {
					if (!img.complete) {
						console.warn(`图片加载超时 [${index + 1}]:`, imgData.url);
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
			previewContainer.innerHTML = '<div style="text-align: center; padding: 20px; color: #f44;">所有图片加载失败</div>';
			return;
		}
		
		if (validImages.length !== images.length) {
			console.warn(`${images.length - validImages.length} 张图片加载失败，继续处理剩余图片`);
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
			previewContainer.innerHTML = '<div style="text-align: center; padding: 20px; color: #f44;">图片尺寸过大，请减少图片数量或降低图片分辨率</div>';
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
		console.log(`预览生成完成，用时: ${(endTime - startTime).toFixed(2)}ms, 处理了 ${validImages.length} 张图片`);
		
		// 显示生成信息
		const infoDiv = document.createElement('div');
		infoDiv.style.cssText = 'text-align: center; padding: 10px; color: #999; font-size: 12px;';
		infoDiv.textContent = `已处理 ${validImages.length} 张图片，尺寸: ${maxWidth}×${totalHeight}px`;
		previewContainer.appendChild(infoDiv);
		
	} catch (error) {
		console.error('渲染预览时出错:', error);
		const previewContainer = document.querySelector('.preview');
		if (previewContainer) {
			previewContainer.innerHTML = `<div style="text-align: center; padding: 20px; color: #f44;">预览生成失败: ${error.message || '未知错误'}</div>`;
		}
	} finally {
		// 恢复按钮状态
		if (previewButton) {
			previewButton.textContent = originalText;
			previewButton.disabled = false;
		}
	}
}