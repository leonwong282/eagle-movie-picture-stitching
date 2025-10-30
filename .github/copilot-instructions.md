# Eagle Movie Picture Stitching Plugin - AI Coding Instructions

## Project Overview

An Eagle desktop plugin for vertically stitching multiple images into panoramic compositions. Built with vanilla JavaScript, modular architecture, and comprehensive i18n support for 8 languages.

**Tech Stack:** HTML5 Canvas API, vanilla JavaScript ES6+, Eagle Plugin API, Node.js (fs/path for file ops)

## Architecture Patterns

### Modular JavaScript Architecture
The plugin uses **class-based modules** with clear separation of concerns:

```javascript
// Core modules (js/modules/):
ParameterManager      // Input validation & parameter management
EagleAPIManager       // Eagle API integration & polling
CanvasRenderer        // Image processing & rendering
UIManager             // DOM manipulation & user feedback
FileManager           // File system operations & cleanup

// Main app (js/plugin-modular.js):
MoviePictureStitchingApp  // Orchestrates all modules with event-driven communication
```

**Critical Pattern:** Modules communicate via **custom DOM events** (`eagle:selectionChanged`, `ui:parameterChanged`, `ui:autoPreviewRequested`). Never use direct module coupling.

### Event-Driven Communication
```javascript
// Dispatch events from modules
window.dispatchEvent(new CustomEvent('eagle:selectionChanged', {
  detail: { selected }
}));

// Listen in main app
window.addEventListener('eagle:selectionChanged', (event) => {
  this.handleSelectionChange(event.detail.selected);
});
```

### Eagle Plugin Lifecycle
**Always** hook into Eagle's lifecycle:
```javascript
eagle.onPluginCreate(async (plugin) => {
  app = new MoviePictureStitchingApp();
  await app.initialize();
});

eagle.onPluginBeforeExit(() => {
  app?.cleanup();  // CRITICAL: cleanup resources
});
```

## Internationalization (i18n)

### Translation System
Uses **i18next** with custom `I18nManager` class. Language files in `_locales/*.json` (8 languages).

**Critical Pattern:** All UI text MUST use `data-i18n` attributes:
```html
<!-- Correct: -->
<button data-i18n="ui.buttons.save">Save</button>
<input data-i18n="[title]ui.tooltips.cropTop" />

<!-- Wrong: Never hardcode text -->
<button>Save Image</button>
```

**Dynamic Translation:**
```javascript
// Use i18nManager.t() for runtime text
this.uiManager.showMessage('ui.messages.success');
i18nManager.t('ui.interface.imagesProcessed', { count: 5, width: 1920, height: 1080 });
```

### Language Detection Flow
1. Check `eagle.app.locale` (primary)
2. Fallback to `navigator.language` with mapping
3. Default to `'en'` if unavailable

## Canvas Rendering Patterns

### Image Stitching Algorithm
Images are stitched **vertically** with percentage-based cropping:
- **First image:** Only crop bottom
- **Remaining images:** Crop top AND bottom

```javascript
// Key constraint: cropTopPercent + cropBottomPercent < 100
const totalHeight = validImages.reduce((sum, { data }, i) => {
  if (i === 0) {
    return sum + (data.height - Math.round(data.height * (cropBottomPercent / 100)));
  } else {
    const cropTop = Math.round(data.height * (cropTopPercent / 100));
    const cropBottom = Math.round(data.height * (cropBottomPercent / 100));
    return sum + (data.height - cropTop - cropBottom);
  }
}, 0);
```

### Canvas Limits
**Always validate canvas dimensions** before rendering:
```javascript
const MAX_CANVAS_SIZE = 32767;  // Browser hard limit
if (width > MAX_CANVAS_SIZE || height > MAX_CANVAS_SIZE) {
  throw new Error(`Canvas size exceeds maximum`);
}
```

### Performance Optimizations
1. **Image Caching:** Cache loaded images for auto-preview to avoid reloading
2. **Debounced Updates:** Real-time preview uses `isAutoPreview` flag for reduced UI feedback
3. **Parallel Loading:** Load all images with `Promise.all()`, filter failures

## Parameter Validation

### Smart Adjustment Pattern
When users adjust crop parameters, **only adjust the active parameter**:
```javascript
// User adjusting top crop -> constrain top, keep bottom fixed
if (adjustingElement === 'cropTopPercent') {
  const maxTop = 99 - cropBottomPercent;
  cropTopPercent = Math.min(cropTopPercent, maxTop);
}
```

### Remaining Value Display
Update `#remaining-top` and `#remaining-bottom` spans **immediately** when parameters change. Access via `window.parameterManager.updateRemainingValues()`.

## File Management

### Parameter Persistence

**Storage Strategy:**
Uses browser localStorage with namespaced keys:
- Prefix: `eagle-movie-stitching:`
- Individual keys per parameter for granular control
- Auto-save on parameter change (debounced 300ms)
- Auto-load on ParameterManager construction

**Storage Manager API:**
```javascript
// Save single parameter
storageManager.saveParameter('cropTopPercent', 85);

// Load with default fallback
const value = storageManager.loadParameter('cropTopPercent', 0);

// Batch operations
storageManager.saveAllParameters(params);
const params = storageManager.loadAllParameters();

// Debug utilities
storageDebug.viewAll();      // View all saved parameters
storageDebug.clearAll();     // Clear storage
storageDebug.resetDefaults(); // Reset to defaults
```

**Critical:** Always validate loaded data before applying to DOM/logic.

### Temporary File Lifecycle
```javascript
// 1. Save canvas to temp file
const filePath = await this.fileManager.saveCanvasAsImage(canvas, { format, quality });

// 2. Add to Eagle
await this.eagleAPI.addImageToEagle(filePath, { name, folders });

// 3. Schedule cleanup (1 second delay for Eagle to import)
this.fileManager.scheduleCleanup(filePath, 1000);
```

**Never** keep temp files longer than necessary. Track with `Set()` in FileManager.

## CSS Modular System

### Variable-Based Theming
All colors, spacing, and effects in `css/modules/variables.css`:
```css
--color-bg-primary: #0d1117;        /* Dark GitHub theme */
--color-accent-primary: #238636;     /* Green accent */
--border-radius-lg: 12px;
--transition-normal: 0.25s cubic-bezier(0.4, 0, 0.2, 1);
--glass-bg: rgba(48, 54, 61, 0.9);  /* Frosted glass effect */
```

**Never use hardcoded colors/sizes.** Reference variables in all module CSS files.

### Module Organization
```
css/
├── index.css           # Import all modules
└── modules/
    ├── variables.css   # CSS custom properties (source of truth)
    ├── base.css        # Reset & base styles
    ├── layout.css      # Grid & flexbox layouts
    ├── components.css  # Reusable UI components
    ├── animations.css  # Transitions & keyframes
    └── responsive.css  # Media queries
```

## Error Handling

### Global Error Recovery
Plugin implements **i18n recovery** for translation failures:
```javascript
window.addEventListener('error', (event) => {
  if (error?.message?.includes('i18n')) {
    setTimeout(() => {
      i18nManager.reinitialize().catch(recoveryError => {
        console.error('I18n recovery failed:', recoveryError);
      });
    }, 1000);
  }
});
```

### User-Facing Error Messages
**Always** show localized errors with context:
```javascript
// Wrong:
alert('Error');

// Correct:
this.uiManager.showMessage('ui.messages.saveError', { error: error.message });
```

## Development Workflows

### Testing Changes
1. Copy `Movie Picture Stitching/` folder to Eagle plugins directory
2. In Eagle: Settings → Plugins → Developer → Import Local Project
3. Enable plugin and reload Eagle (Cmd+R on macOS)

### Debugging Tips
- Use `window.getApp()` to access app instance in console
- Check `app.getPerformanceStats()` for render metrics
- Validate i18n: `i18nManager.validateTranslations()`
- Inspect Eagle API: `eagle.item.getSelected()` in console

### Performance Profiling
```javascript
const startTime = performance.now();
// ... operation ...
const duration = performance.now() - startTime;
console.log(`Operation took ${duration.toFixed(2)}ms`);
```

## Common Pitfalls

1. **Never use `innerHTML` for user-generated content** (XSS risk). Use `textContent` or `createElement()`.
2. **Always cleanup canvas references** in `cleanup()` methods to prevent memory leaks.
3. **Check Eagle API availability** with `typeof eagle !== 'undefined'` before use.
4. **Validate file paths** to prevent path traversal: reject paths with `..` characters.
5. **Respect parameter constraints:** Total crop must be < 100%, quality 0.1-1.0.

## Feature Branches

Currently on `feature/save-parameters` branch. When adding parameter persistence:
- Store in `localStorage` with namespaced keys: `eagle-movie-stitching:cropTopPercent`
- Load in `ParameterManager.constructor()`
- Save on `ui:parameterChanged` events

## Key Files Reference

- **Entry point:** `Movie Picture Stitching/index.html`
- **Main logic:** `js/plugin-modular.js` (orchestration)
- **Manifest:** `manifest.json` (plugin metadata, 8 language support)
- **Translations:** `_locales/en.json` (template for all languages)
- **Optimization plan:** `OPTIMIZATION_PLAN.md` (future improvements)

## Testing Checklist

Before committing changes:
- [ ] Test with 2, 10, and 50 images
- [ ] Verify all 8 language UIs work
- [ ] Check parameter validation edge cases (0%, 99%, total=99%)
- [ ] Confirm temp files are cleaned up
- [ ] Test all export formats (JPG, PNG, WebP)
- [ ] Validate canvas doesn't exceed 32767px
