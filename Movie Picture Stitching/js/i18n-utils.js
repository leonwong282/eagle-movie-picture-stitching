/**
 * Eagle Plugin Multilingual Initialization and Utility Functions
 * Provides convenient multilingual function interfaces
 */

// Create global multilingual manager instance
const i18nManager = new I18nManager();

// Compatibility functions (maintain backward compatibility)
function initializeI18n() {
  return i18nManager.initialize().catch(error => {
    console.error('I18n initialization failed:', error);
  });
}

function showMessage(key, variables = {}) {
  i18nManager.showMessage(key, variables);
}

// Quick translation function
function t(key, variables = {}) {
  return i18nManager.t(key, variables);
}

// Eagle plugin lifecycle event handling
function setupEagleI18nEvents() {
  // Plugin create event
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
      // Try fallback handling
      console.log('Attempting fallback initialization...');
      setTimeout(() => {
        i18nManager.reinitialize().catch(e => {
          console.error('Fallback initialization also failed:', e);
        });
      }, 1000);
    }
  });

  // Plugin show event
  eagle.onPluginShow(async () => {
    console.log('👁️ Eagle plugin show event triggered');
    console.log('Current initialization state:', {
      isInitialized: i18nManager.isInitialized,
      currentLanguage: i18nManager.currentLanguage,
      eagleLocale: eagle?.app?.locale
    });

    // Ensure multilingual is correctly applied, support language switching
    try {
      if (!i18nManager.isInitialized) {
        console.log('I18n not initialized, starting initialization...');
        await i18nManager.initialize();
      } else {
        // Re-detect language (user may have switched language in Eagle)
        const newLanguage = i18nManager.detectLanguage();
        if (newLanguage !== i18nManager.currentLanguage) {
          console.log('🔄 Language change detected, reinitializing:', i18nManager.currentLanguage, '->', newLanguage);
          await i18nManager.reinitialize();
        } else {
          console.log('Language unchanged, reapplying translations...');
          // Reapply translations (ensure dynamic content is correct)
          i18nManager.applyTranslations();
        }
      }
      console.log('✅ I18n processing completed');
    } catch (error) {
      console.error('❌ I18n processing failed during plugin show:', error);
    }
  });
}

// Setup advanced multilingual features
function setupAdvancedI18nFeatures() {
  i18nManager.setupAdvancedFeatures();
}

// Development debugging tools
function setupI18nDebugTools() {
  if (typeof window !== 'undefined') {
    window.i18nDebug = {
      manager: i18nManager,
      getInfo: () => i18nManager.getDebugInfo(),
      validate: () => i18nManager.validateTranslations(),
      retranslate: () => i18nManager.forceRetranslate(),
      reinit: () => i18nManager.reinitialize(),
      // Quick language test
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

    // Add quick status check
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

// Global error handling
function setupI18nErrorHandling() {
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
      event.preventDefault(); // Prevent error from showing to user
      setTimeout(() => {
        i18nManager.reinitialize().catch(error => {
          console.error('I18n promise recovery failed:', error);
        });
      }, 1000);
    }
  });
}

// Initialize all multilingual features
function initializeAllI18nFeatures() {
  // Setup Eagle event handling
  setupEagleI18nEvents();

  // Setup debugging tools
  setupI18nDebugTools();

  // Setup error handling
  setupI18nErrorHandling();

  // Setup advanced features after DOM is loaded
  if (document.readyState !== 'loading') {
    setupAdvancedI18nFeatures();
  } else {
    document.addEventListener('DOMContentLoaded', setupAdvancedI18nFeatures);
  }
}

// Export functions
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
  // Browser environment, add functions to global scope
  window.i18nManager = i18nManager;
  window.initializeI18n = initializeI18n;
  window.showMessage = showMessage;
  window.t = t;
  window.initializeAllI18nFeatures = initializeAllI18nFeatures;
}
