/**
 * Eagle Plugin 多语言初始化和工具函数
 * 提供便捷的多语言功能接口
 */

// 创建全局多语言管理器实例
const i18nManager = new I18nManager();

// 兼容性函数（保持向后兼容）
function initializeI18n() {
	return i18nManager.initialize().catch(error => {
		console.error('I18n initialization failed:', error);
	});
}

function showMessage(key, variables = {}) {
	i18nManager.showMessage(key, variables);
}

// 快速翻译函数
function t(key, variables = {}) {
	return i18nManager.t(key, variables);
}

// Eagle 插件生命周期事件处理
function setupEagleI18nEvents() {
	// 插件创建事件
	eagle.onPluginCreate(async () => {
		console.log('🚀 Eagle plugin create event triggered');
		console.log('Eagle object availability check:', {
			eagle: typeof eagle !== 'undefined',
			app: eagle?.app ? 'available' : 'not available',
			locale: eagle?.app?.locale || 'not detected'
		});
		
		try {
			console.log('Starting i18n initialization...');
			await i18nManager.initialize();
			console.log('✅ I18n initialization successful');
		} catch (error) {
			console.error('❌ I18n initialization failed during plugin create:', error);
			// 尝试降级处理
			console.log('Attempting fallback initialization...');
			setTimeout(() => {
				i18nManager.reinitialize().catch(e => {
					console.error('Fallback initialization also failed:', e);
				});
			}, 1000);
		}
	});

	// 插件显示事件
	eagle.onPluginShow(async () => {
		console.log('👁️ Eagle plugin show event triggered');
		console.log('Current initialization state:', {
			isInitialized: i18nManager.isInitialized,
			currentLanguage: i18nManager.currentLanguage,
			eagleLocale: eagle?.app?.locale
		});
		
		// 确保多语言正确应用，支持语言切换
		try {
			if (!i18nManager.isInitialized) {
				console.log('I18n not initialized, starting initialization...');
				await i18nManager.initialize();
			} else {
				// 重新检测语言（用户可能在 Eagle 中切换了语言）
				const newLanguage = i18nManager.detectLanguage();
				if (newLanguage !== i18nManager.currentLanguage) {
					console.log('🔄 Language change detected, reinitializing:', i18nManager.currentLanguage, '->', newLanguage);
					await i18nManager.reinitialize();
				} else {
					console.log('Language unchanged, reapplying translations...');
					// 重新应用翻译（确保动态内容正确）
					i18nManager.applyTranslations();
				}
			}
			console.log('✅ I18n processing completed');
		} catch (error) {
			console.error('❌ I18n processing failed during plugin show:', error);
		}
	});
}

// 设置高级多语言功能
function setupAdvancedI18nFeatures() {
	i18nManager.setupAdvancedFeatures();
}

// 开发调试工具
function setupI18nDebugTools() {
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
				console.log(`Switched to language: ${lang} (previous: ${oldLang})`);
				return i18nManager.validateTranslations();
			}
		};
		
		console.log('🌐 I18n debug tools loaded!');
		console.log('Use window.i18nDebug to access debug functions:');
		console.log('- i18nDebug.getInfo() - Get status information');
		console.log('- i18nDebug.validate() - Validate translation completeness');
		console.log('- i18nDebug.retranslate() - Force retranslation');
		console.log('- i18nDebug.testLanguage("en") - Test language switching');
		console.log('- i18nDebug.quickCheck() - Quick status check');
		
		// 添加快速状态检查
		window.i18nDebug.quickCheck = () => {
			const info = i18nManager.getDebugInfo();
			console.table(info);
			
			if (!info.isInitialized) {
				console.warn('⚠️ I18n system not initialized');
				console.log('Try manual initialization: i18nDebug.reinit()');
			}
			
			if (!info.i18nextAvailable) {
				console.error('❌ i18next library not loaded');
			}
			
			return info;
		};
	}
}

// 全局错误处理
function setupI18nErrorHandling() {
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
}

// 初始化所有多语言功能
function initializeAllI18nFeatures() {
	// 设置 Eagle 事件处理
	setupEagleI18nEvents();
	
	// 设置调试工具
	setupI18nDebugTools();
	
	// 设置错误处理
	setupI18nErrorHandling();
	
	// 在DOM加载完成后设置高级功能
	if (document.readyState !== 'loading') {
		setupAdvancedI18nFeatures();
	} else {
		document.addEventListener('DOMContentLoaded', setupAdvancedI18nFeatures);
	}
}

// 导出函数
if (typeof module !== 'undefined' && module.exports) {
	module.exports = {
		i18nManager,
		initializeI18n,
		showMessage,
		t,
		setupEagleI18nEvents,
		setupAdvancedI18nFeatures,
		setupI18nDebugTools,
		setupI18nErrorHandling,
		initializeAllI18nFeatures
	};
} else {
	// 浏览器环境，将函数添加到全局作用域
	window.i18nManager = i18nManager;
	window.initializeI18n = initializeI18n;
	window.showMessage = showMessage;
	window.t = t;
	window.initializeAllI18nFeatures = initializeAllI18nFeatures;
}
