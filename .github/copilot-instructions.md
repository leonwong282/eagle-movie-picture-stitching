# Eagle Movie Picture Stitching Plugin - AI Development Guide

## Project Overview
This is an Eagle plugin for vertically stitching multiple movie images into panoramic compositions. It features a modern glass-effect UI with comprehensive internationalization support for 8 languages.

## Architecture & Key Components

### Plugin Structure
- **`manifest.json`**: Eagle plugin configuration with i18n template strings (`{{manifest.app.name}}`)
- **`index.html`**: Single-page application entry point
- **`js/plugin.js`**: Core business logic with Eagle API integration (655 lines)
- **`js/i18n-manager.js`**: Comprehensive internationalization system
- **`_locales/`**: Translation files for 8 languages (en, zh_CN, zh_TW, ja_JP, es_ES, de_DE, ko_KR, ru_RU)
- **`css/`**: Modular CSS architecture with 10+ component modules

### Core APIs & Integration Points

#### Eagle API Integration
```javascript
// Key Eagle API patterns used throughout:
eagle.onPluginCreate() // Plugin lifecycle
eagle.item.getSelected() // Get selected images
eagle.folder.getSelected() // Get current folder
eagle.item.addFromPath() // Save stitched image
eagle.window.setAlwaysOnTop() // Window management
eagle.app.locale // Language detection
```

#### Canvas-Based Image Processing
- Uses HTML5 Canvas API for real-time preview and stitching
- Implements percentage-based cropping (top/bottom) with smart validation
- Supports JPG/PNG/WebP export with quality control
- Global `window.previewCanvas` object for performance optimization

### Internationalization System

#### Language Detection Flow
1. Detect Eagle's `eagle.app.locale` setting
2. Fallback to browser `navigator.language`
3. Auto-map language codes (e.g., `zh-CN` → `zh_CN`)
4. Load appropriate JSON translation file from `_locales/`

#### i18n Manager API
```javascript
// Core i18n patterns:
i18nManager.init() // Initialize with Eagle language detection
i18nManager.t('ui.messages.success') // Translate keys
i18nManager.setLanguage('en') // Runtime language switching
initializeAllI18nFeatures() // Apply translations to DOM
```

#### Translation File Structure
```json
{
  "manifest": { "app": { "name": "...", "description": "..." } },
  "ui": {
    "header": { "title": "...", "pinWindow": "..." },
    "settings": { "cropTop": "...", "formatOptions": {...} },
    "messages": { "selectImages": "...", "success": "..." }
  }
}
```

### CSS Architecture

#### Modular Design Pattern
- **`css/index.css`**: Central import hub for all modules
- **`css/modules/variables.css`**: CSS custom properties system
- **`css/modules/base.css`**: Reset and base styles
- **Component modules**: `buttons.css`, `forms.css`, `header.css`, etc.

#### Design System Variables
```css
:root {
  --color-bg-primary: #0d1117; /* GitHub dark theme colors */
  --color-accent-primary: #238636; /* Green accent */
  --border-radius-lg: 12px; /* Modern rounded corners */
  --transition-normal: 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
```

## Development Workflows

### Parameter Validation Logic
The plugin implements smart crop validation where total cropping cannot exceed 99%:
```javascript
// Key validation pattern in getParams():
if (adjustingElement === 'cropTopPercent') {
  // Fix bottom value, adjust top to maximum allowed
} else if (adjustingElement === 'cropBottomPercent') {
  // Fix top value, adjust bottom to maximum allowed
}
```

### Performance Optimization Patterns
- **Debounced rendering**: 200ms debounce on parameter changes
- **Canvas reuse**: Global `window.previewCanvas` prevents recreation
- **Memory cleanup**: `cleanup()` function clears timers and references
- **Polling management**: Clear intervals on plugin close

### File System Integration
- **Temp file pattern**: Save to `__dirname` then import to Eagle
- **Auto cleanup**: Remove temp files after 1 second delay
- **Buffer handling**: Convert Canvas dataURL to Buffer for fs operations

## Critical Conventions

### Error Handling & User Feedback
- Use `showMessage()` with i18n keys: `showMessage('ui.messages.error')`
- Always provide fallback values in parameter validation
- Log warnings for auto-corrections: `console.warn('Export quality adjusted...')`

### Event Binding Pattern
```javascript
// Standard event binding in eagle.onPluginCreate():
document.getElementById('previewButton')?.addEventListener('click', renderPreview);
// Always use optional chaining for robustness
```

### State Management
- **Global variables**: `lastSelectedIds`, `isAlwaysOnTop`, `pollingInterval`
- **Timer cleanup**: Always clear timers in `cleanup()` function
- **Window state**: Persist pin-to-top state across operations

## Testing & Debugging

### Local Development Setup
1. Copy `Movie Picture Stitching/` folder to Eagle plugins directory
2. Enable developer mode in Eagle settings
3. Use Eagle's plugin developer tools for debugging

### Common Testing Scenarios
- Multi-language UI switching (test all 8 languages)
- Edge cases: extreme crop values, very large images, 50+ image batches
- Format validation: JPG quality settings, PNG transparency, WebP compression
- Performance: Memory usage with large canvases, cleanup verification

## File Naming & Organization

### Critical Files to Understand
- **`js/plugin.js`**: Contains all core logic - start here for any business logic changes
- **`js/i18n-manager.js`**: Language detection and translation system
- **`css/modules/variables.css`**: All design tokens and theme variables
- **`_locales/en.json`**: Base language file - template for other translations

### Adding New Features
1. Add UI strings to `_locales/en.json` first
2. Implement logic in `js/plugin.js` with proper validation
3. Add styles to appropriate CSS module in `css/modules/`
4. Test across all supported languages
5. Update `manifest.json` version if needed

This plugin emphasizes robust internationalization, modern CSS architecture, and Eagle API integration. Focus on maintaining the modular structure and comprehensive i18n support when making changes.
