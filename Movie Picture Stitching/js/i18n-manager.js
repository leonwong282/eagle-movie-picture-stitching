/**
 * Eagle Plugin 多语言管理器
 * 提供完整的多语言支持功能
 */

class I18nManager {
	constructor() {
		this.isInitialized = false;
		this.currentLanguage = 'en';
		this.fallbackLanguage = 'en';
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
				console.log('Detected Eagle language setting:', this.currentLanguage);
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
					'zh-Hant': 'zh_TW',
					'ja': 'ja_JP',
					'ja-JP': 'ja_JP',
					'es': 'es_ES',
					'es-ES': 'es_ES',
					'de': 'de_DE',
					'de-DE': 'de_DE',
					'ko': 'ko_KR',
					'ko-KR': 'ko_KR',
					'ru': 'ru_RU',
					'ru-RU': 'ru_RU'
				};
				
				this.currentLanguage = langMap[browserLang] || langMap[browserLang.split('-')[0]] || this.fallbackLanguage;
				console.log('Using browser language setting:', browserLang, '-> mapped to:', this.currentLanguage);
			}
		} catch (error) {
			console.warn('Language detection failed, using default language:', error);
			this.currentLanguage = this.fallbackLanguage;
		}
		
		return this.currentLanguage;
	}

	// 等待 i18next 加载
	async waitForI18next() {
		console.log('Waiting for i18next library to load...');
		return new Promise((resolve, reject) => {
			const checkI18next = () => {
				if (typeof i18next !== 'undefined') {
					console.log('i18next library loaded successfully');
					// 检查是否有翻译数据
					const testTranslation = i18next.t('ui.buttons.preview');
					console.log('Test translation result:', testTranslation);
					resolve(true);
				} else if (this.retryCount >= this.maxRetries) {
					reject(new Error('i18next loading timeout'));
				} else {
					this.retryCount++;
					console.log(`Waiting for i18next loading... (${this.retryCount}/${this.maxRetries})`);
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
			console.log('Starting i18n system initialization...');
			
			// 检测语言
			this.detectLanguage();
			
			// 等待 i18next 加载
			await this.waitForI18next();
			
			// 设置初始化标志（在应用翻译之前）
			this.isInitialized = true;
			
			// 应用翻译
			this.applyTranslations();
			
			console.log('I18n system initialization completed, current language:', this.currentLanguage);
			
			return true;
		} catch (error) {
			console.error('I18n initialization failed:', error);
			this.isInitialized = false;
			throw error;
		}
	}

	// 应用翻译到页面元素
	applyTranslations() {
		if (typeof i18next === 'undefined') {
			console.warn('i18next not loaded, skipping translation application');
			return;
		}

		try {
			console.log('Starting translation application, current language:', this.currentLanguage);
			
			// 处理所有带有 data-i18n 属性的元素
			const elements = document.querySelectorAll('[data-i18n]');
			console.log(`Found ${elements.length} elements to translate`);
			
			elements.forEach(element => {
				this.translateElement(element);
			});

			// 特殊处理：动态更新的元素
			this.updateDynamicElements();
			
			console.log('Translation application completed');
		} catch (error) {
			console.error('Error applying translations:', error);
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
			console.warn('Element translation failed:', key, error);
		}
	}

	// 更新动态元素
	updateDynamicElements() {
		try {
			console.log('Updating dynamic elements...');
			
			// 更新按钮
			const buttons = {
				'previewButton': 'ui.buttons.preview',
				'saveButton': 'ui.buttons.save'
			};

			Object.entries(buttons).forEach(([id, key]) => {
				const button = document.getElementById(id);
				if (button) {
					const translation = this.t(key);
					console.log(`Updated button ${id}: ${key} -> ${translation}`);
					button.textContent = translation;
					button.setAttribute('aria-label', translation);
				} else {
					console.warn(`Button element not found: ${id}`);
				}
			});

			// 更新动态提示文本
			this.updateRemainingCropValues();
			
			console.log('Dynamic elements update completed');
		} catch (error) {
			console.error('Error updating dynamic elements:', error);
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
			console.warn('i18next not loaded, returning key:', key);
			return key;
		}

		try {
			const result = i18next.t(key, options);
			// 如果翻译结果和key相同，说明翻译不存在
			if (result === key) {
				console.warn('Translation key not found:', key);
			}
			return result !== key ? result : key;
		} catch (error) {
			console.warn('Translation failed:', key, error);
			return key;
		}
	}

	// 显示本地化消息
	showMessage(key, variables = {}) {
		const message = this.t(key, variables);
		alert(message);
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
		console.log('Force retranslating all elements...');
		this.applyTranslations();
		return this.validateTranslations();
	}

	// 设置DOM变化监听器和语言变化检测
	setupAdvancedFeatures() {
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
								this.translateElement(element);
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
		let lastDetectedLanguage = this.currentLanguage;
		setInterval(() => {
			const currentLanguage = this.detectLanguage();
			if (currentLanguage !== lastDetectedLanguage) {
				console.log('Language change detected:', lastDetectedLanguage, '->', currentLanguage);
				lastDetectedLanguage = currentLanguage;
				this.reinitialize().catch(error => {
					console.error('Reinitialization failed after language change:', error);
				});
			}
		}, 3000); // 每3秒检查一次
	}
}

// 导出多语言管理器类
if (typeof module !== 'undefined' && module.exports) {
	module.exports = I18nManager;
} else {
	window.I18nManager = I18nManager;
}
