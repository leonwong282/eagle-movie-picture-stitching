/**
 * Eagle Plugin Multilingual Manager
 * Provides complete multilingual support functionality
 */

class I18nManager {
  constructor() {
    this.isInitialized = false;
    this.currentLanguage = 'en';
    this.fallbackLanguage = 'en';
    this.retryCount = 0;
    this.maxRetries = 5;
    this.initPromise = null;
    this.translations = {}; // Store loaded translations
  }

  // Detect current language
  detectLanguage() {
    try {
      // Priority use Eagle's language settings
      if (eagle && eagle.app && eagle.app.locale) {
        this.currentLanguage = eagle.app.locale;
        console.log('Detected Eagle language setting:', this.currentLanguage);
        return this.currentLanguage;
      }

      // Fallback to browser language
      const browserLang = navigator.language || navigator.userLanguage;
      if (browserLang) {
        // Convert browser language code to supported language
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

  // Load translation file for current language
  async loadTranslations() {
    console.log('Loading translations for language:', this.currentLanguage);
    try {
      const response = await fetch(`_locales/${this.currentLanguage}.json`);
      if (!response.ok) {
        throw new Error(`Failed to load translation file: ${response.status}`);
      }
      const data = await response.json();
      this.translations = data;
      console.log('Translations loaded successfully:', Object.keys(data));
      return true;
    } catch (error) {
      console.error('Failed to load translations:', error);
      // Fallback to English if current language fails
      if (this.currentLanguage !== this.fallbackLanguage) {
        console.log(`Falling back to ${this.fallbackLanguage} language`);
        this.currentLanguage = this.fallbackLanguage;
        return this.loadTranslations();
      }
      throw error;
    }
  }

  // Initialize multilingual
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

      // Detect language
      this.detectLanguage();

      // Load translation files
      await this.loadTranslations();

      // Set initialization flag (before applying translations)
      this.isInitialized = true;

      // Apply translations
      this.applyTranslations();

      console.log('I18n system initialization completed, current language:', this.currentLanguage);

      return true;
    } catch (error) {
      console.error('I18n initialization failed:', error);
      this.isInitialized = false;
      throw error;
    }
  }

  // Apply translations to page elements
  applyTranslations() {
    if (!this.translations || Object.keys(this.translations).length === 0) {
      console.warn('No translations loaded, skipping translation application');
      return;
    }

    try {
      console.log('Starting translation application, current language:', this.currentLanguage);

      // Process all elements with data-i18n attribute
      const elements = document.querySelectorAll('[data-i18n]');
      console.log(`Found ${elements.length} elements to translate`);

      elements.forEach(element => {
        this.translateElement(element);
      });

      // Special handling: dynamic update elements
      this.updateDynamicElements();

      console.log('Translation application completed');
    } catch (error) {
      console.error('Error applying translations:', error);
    }
  }

  // Translate single element
  translateElement(element) {
    const key = element.getAttribute('data-i18n');
    if (!key) return;

    try {
      // Handle attribute binding: [attribute]translation.key
      if (key.startsWith('[') && key.includes(']')) {
        const match = key.match(/\[([^\]]+)\](.+)/);
        if (match) {
          const attribute = match[1];
          const translationKey = match[2];
          const translation = this.t(translationKey);
          element.setAttribute(attribute, translation);
        }
      } else {
        // Regular text translation
        const translation = this.t(key);
        if (translation && translation !== key) {
          // Only update textContent if element doesn't have child elements
          // This prevents overwriting button icons/structure
          if (element.children.length === 0) {
            element.textContent = translation;
          } else {
            // For elements with children (like buttons with icon+text spans),
            // only update if it's a .button-text span or similar
            if (element.classList.contains('button-text') ||
              element.tagName === 'SPAN' && element.parentElement.tagName === 'BUTTON') {
              element.textContent = translation;
            }
          }
        }
      }
    } catch (error) {
      console.warn('Element translation failed:', key, error);
    }
  }  // Update current language
  updateDynamicElements() {
    try {
      console.log('Updating dynamic elements...');

      // Update buttons - find .button-text spans instead of replacing entire button
      const buttons = {
        'previewButton': 'ui.buttons.preview',
        'saveButton': 'ui.buttons.save'
      };

      Object.entries(buttons).forEach(([id, key]) => {
        const button = document.getElementById(id);
        if (button) {
          const translation = this.t(key);
          console.log(`Updated button ${id}: ${key} -> ${translation}`);

          // Update the .button-text span instead of entire button
          const textSpan = button.querySelector('.button-text');
          if (textSpan) {
            textSpan.textContent = translation;
          } else {
            // Fallback: update button textContent (old behavior)
            button.textContent = translation;
          }

          // Update aria-label for accessibility
          button.setAttribute('aria-label', translation);
        } else {
          console.warn(`Button element not found: ${id}`);
        }
      });

      // Update dynamic tooltip text
      this.updateRemainingCropValues();

      console.log('Dynamic elements update completed');
    } catch (error) {
      console.error('Error updating dynamic elements:', error);
    }
  }

  // Update crop remaining value display
  updateRemainingCropValues() {
    const topElement = document.getElementById('remaining-top');
    const bottomElement = document.getElementById('remaining-bottom');

    if (topElement && bottomElement) {
      // Check if global parameter manager is available
      if (typeof window !== 'undefined' && window.parameterManager && typeof window.parameterManager.getParams === 'function') {
        // Recalculate and update display using global parameter manager
        const { cropTopPercent, cropBottomPercent } = window.parameterManager.getParams();
        const remainingTop = Math.max(0, 99 - cropBottomPercent);
        const remainingBottom = Math.max(0, 99 - cropTopPercent);

        topElement.textContent = remainingTop;
        bottomElement.textContent = remainingBottom;
      } else {
        // Fallback: read values directly from DOM elements
        const cropTopInput = document.getElementById('cropTopPercent');
        const cropBottomInput = document.getElementById('cropBottomPercent');

        if (cropTopInput && cropBottomInput) {
          const cropTopPercent = parseFloat(cropTopInput.value) || 0;
          const cropBottomPercent = parseFloat(cropBottomInput.value) || 0;
          const remainingTop = Math.max(0, 99 - cropBottomPercent);
          const remainingBottom = Math.max(0, 99 - cropTopPercent);

          topElement.textContent = remainingTop;
          bottomElement.textContent = remainingBottom;
        }
      }
    }
  }

  // Safe translation function
  t(key, options = {}) {
    // Check if translations are loaded
    if (!this.translations || Object.keys(this.translations).length === 0) {
      console.warn('Translations not loaded, returning key:', key);
      return key;
    }

    try {
      // Navigate nested object path (e.g., "ui.buttons.preview" -> translations.ui.buttons.preview)
      const keys = key.split('.');
      let result = this.translations;

      for (const k of keys) {
        if (result && typeof result === 'object' && k in result) {
          result = result[k];
        } else {
          console.warn('Translation key not found:', key);
          return key;
        }
      }

      // Handle interpolation if options provided
      if (typeof result === 'string' && options && Object.keys(options).length > 0) {
        Object.keys(options).forEach(optKey => {
          const placeholder = new RegExp(`{{\\s*${optKey}\\s*}}`, 'g');
          result = result.replace(placeholder, options[optKey]);
        });
      }

      return typeof result === 'string' ? result : key;
    } catch (error) {
      console.warn('Translation failed:', key, error);
      return key;
    }
  }

  // Show localized message
  showMessage(key, variables = {}) {
    const message = this.t(key, variables);
    alert(message);
  }

  // Force reinitialization
  async reinitialize() {
    this.isInitialized = false;
    this.initPromise = null;
    this.retryCount = 0;
    return this.initialize();
  }

  // Debug function: get multilingual status
  getDebugInfo() {
    return {
      isInitialized: this.isInitialized,
      currentLanguage: this.currentLanguage,
      fallbackLanguage: this.fallbackLanguage,
      retryCount: this.retryCount,
      translationsLoaded: Object.keys(this.translations).length > 0,
      translationKeys: Object.keys(this.translations),
      eagleLocale: eagle?.app?.locale,
      supportedLanguages: ['en', 'zh_CN', 'zh_TW', 'ja_JP', 'es_ES', 'de_DE', 'ko_KR', 'ru_RU'],
      translatedElementsCount: document.querySelectorAll('[data-i18n]').length
    };
  }

  // Debug function: validate translation integrity
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

  // Debug function: manually trigger translation
  forceRetranslate() {
    console.log('Force retranslating all elements...');
    this.applyTranslations();
    return this.validateTranslations();
  }

  // Setup DOM change listeners and language change detection
  setupAdvancedFeatures() {
    // Listen for DOM changes and automatically translate newly added elements
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Check if newly added elements need translation
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

    // Start listening for DOM changes
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Periodically check for language changes (Eagle users might switch languages)
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
    }, 3000); // Check every 3 seconds
  }
}

// Export multilingual manager class
if (typeof module !== 'undefined' && module.exports) {
  module.exports = I18nManager;
} else {
  window.I18nManager = I18nManager;
}
