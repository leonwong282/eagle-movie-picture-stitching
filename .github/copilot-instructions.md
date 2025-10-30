# Eagle Movie Picture Stitching Plugin - AI Coding Instructions

## Project Overview

An Eagle desktop plugin for vertically stitching multiple movie screenshot images into panoramic compositions. Built with **vanilla JavaScript ES6+**, **modular class-based architecture**, and **8-language i18n system**.

**Current Branch:** `reconstruct/bootstrap5` - UI reconstruction using Bootstrap 5  
**Tech Stack:** HTML5 Canvas API, vanilla JavaScript, Eagle Plugin API v4.0+, Node.js fs/path, localStorage, i18next  
**Key Feature:** Auto-saves user parameters (crop %, format, quality) using localStorage with validation

## Architecture - Event-Driven Modular System

### Core Module Hierarchy
```javascript
// Main orchestrator (js/plugin-modular.js)
MoviePictureStitchingApp
  ├── ParameterManager      // Validates inputs, persists to localStorage
  ├── StorageManager        // localStorage abstraction with validation rules
  ├── EagleAPIManager       // Eagle desktop app integration (polling-based)
  ├── CanvasRenderer        // Image stitching algorithm, canvas operations
  ├── UIManager             // DOM manipulation, i18n translations
  └── FileManager           // Temp file lifecycle, path sanitization
```

### Critical Pattern: Custom Event Communication
**Modules NEVER directly call each other** - use window-level CustomEvents:

```javascript
// Module dispatches event:
window.dispatchEvent(new CustomEvent('eagle:selectionChanged', {
  detail: { selected: imageArray }
}));

// App listens and coordinates:
window.addEventListener('eagle:selectionChanged', (e) => {
  this.handleSelectionChange(e.detail.selected);
});
```

**Event Catalog:**
- `eagle:selectionChanged` - Eagle image selection updated (from EagleAPIManager polling)
- `ui:parameterChanged` - User modified crop/format/quality (from UIManager)
- `ui:autoPreviewRequested` - Real-time preview triggered (debounced 500ms)
- `ui:resize` - Window resized (for responsive adjustments)

### Eagle Plugin Lifecycle & Integration

**Eagle API is ONLY available in plugin context** - check before use:
```javascript
// REQUIRED lifecycle hooks in index.html <script>:
eagle.onPluginCreate(async (plugin) => {
  window.app = new MoviePictureStitchingApp();
  await app.initialize();
});

eagle.onPluginBeforeExit(() => {
  app?.cleanup();  // CRITICAL: cleanup temp files, canvas refs
});
```

**Eagle API Surface** (polling-based, async):
```javascript
// Get selected images (returns array of {id, name, ext, size, filePath, folders})
const selected = await eagle.item.getSelected();

// Add processed image back to Eagle's current folder
await eagle.item.addFromPath(filePath, { name, folders: [selectedFolder] });

// Window controls
eagle.window.setAlwaysOnTop(boolean);

// Language detection
const locale = eagle.app.locale; // 'en', 'zh_CN', 'zh_TW', etc.
```

**Polling Pattern:** EagleAPIManager checks selection every 500ms - Eagle doesn't push updates.

## Internationalization (i18n) System

### Translation Architecture
Uses **i18next** with custom `I18nManager` class. 8 languages in `_locales/*.json`.

**CRITICAL:** All UI text MUST use `data-i18n` attributes - never hardcode:
```html
<!-- ✅ Correct: -->
<button data-i18n="ui.buttons.save">Save</button>
<input data-i18n="[title]ui.tooltips.cropTop" />

<!-- ❌ Wrong: -->
<button>Save Image</button>
```

**Dynamic Translation API:**
```javascript
// Use i18nManager globally (loaded in i18n-manager.js)
i18nManager.t('ui.messages.success');
i18nManager.t('ui.interface.imagesProcessed', { count: 5, width: 1920 });

// In modules, pass through UIManager:
this.uiManager.showMessage('ui.messages.saveError', { error: error.message });
```

**Language Detection Flow:**
1. Check `eagle.app.locale` (primary)
2. Fallback to `navigator.language` with mapping (zh → zh_CN, zh-TW → zh_TW)
3. Default to `'en'`

**Error Recovery:** Global error handler auto-reinitializes i18n on translation failures (see plugin-modular.js window.addEventListener('error')).

## Canvas Rendering & Image Processing

### Vertical Stitching Algorithm
Images stitch **top-to-bottom** with percentage-based cropping:
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

### Browser Limits & Validation
**Always validate canvas dimensions** before rendering:
```javascript
const MAX_CANVAS_SIZE = 32767;  // Hard browser limit
if (width > MAX_CANVAS_SIZE || height > MAX_CANVAS_SIZE) {
  throw new Error('Canvas size exceeds maximum');
}
```

### Performance Patterns
1. **Image Caching:** Cache loaded images for auto-preview (avoid reloading)
2. **Parallel Loading:** `Promise.all()` with 10s timeout per image
3. **Debounced Preview:** `isAutoPreview` flag reduces UI feedback during real-time updates

## Parameter Persistence & Storage

### Auto-Save Architecture (NEW in v1.0.1)
Uses browser localStorage with **namespaced keys** and **debounced writes**:

```javascript
// Storage keys: 'eagle-movie-stitching:cropTopPercent', etc.
storageManager.saveParameter('cropTopPercent', 85);  // Auto-validates
const value = storageManager.loadParameter('cropTopPercent', 0);  // Fallback on error
```

**Critical Flow:**
1. **On Plugin Open:** `ParameterManager.constructor()` loads params → `initialize()` applies to DOM (after ready)
2. **On User Input:** Debounced 300ms → `saveCurrentParameters()` → localStorage
3. **Validation:** All saves/loads validate type, range, and constraints

**Initialization Order (CRITICAL):**
```javascript
// ✅ Correct - prevents 5s delay on plugin open:
constructor() {
  this.savedParams = storageManager.loadAllParameters();  // Synchronous
  // DO NOT apply to DOM here
}
initialize() {
  this.applyParametersToDOMSync();  // After DOM ready
}

// ❌ Wrong - blocks UI:
constructor() {
  waitForDOM().then(() => this.applyParameters());  // NEVER wait in constructor
}
```

## Parameter Validation

### Smart Adjustment Pattern
When users adjust crop parameters, **only adjust the active parameter**:
```javascript
// User adjusting top crop → constrain top, keep bottom fixed
if (adjustingElement === 'cropTopPercent') {
  const maxTop = 99 - cropBottomPercent;
  cropTopPercent = Math.min(cropTopPercent, maxTop);
}
```

**Remaining Value Display:** Update `#remaining-top` and `#remaining-bottom` spans immediately via `window.parameterManager.updateRemainingValues()`.

## File Management

### Storage Manager API
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
- Use `window.app` to access app instance in console
- Check localStorage: `storageDebug.viewAll()`, `storageDebug.clearAll()`, `storageDebug.testCycle()`
- Validate i18n: `i18nManager.validateTranslations()`
- Inspect Eagle API: `await eagle.item.getSelected()` in console

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
6. **NEVER wait for DOM in constructor** - causes 5s+ delay. Load params synchronously, apply in `initialize()`.

## Key Files Reference

- **Entry point:** `Movie Picture Stitching/index.html` (loads all modules in order)
- **Main logic:** `js/plugin-modular.js` (orchestration, event coordination)
- **Storage:** `js/modules/storage-manager.js` (v1.0.1 - NEW, localStorage abstraction)
- **Manifest:** `manifest.json` (plugin metadata, 8 language support)
- **Translations:** `_locales/en.json` (base language, template for others)
- **Architecture docs:** `docs/PARAMETER_PERSISTENCE_ARCHITECTURE.md`, `Movie Picture Stitching/js/modules/README.md`

## Testing Checklist

Before committing changes:
- [ ] Test with 2, 10, and 50 images
- [ ] Verify all 8 language UIs work
- [ ] Check parameter validation edge cases (0%, 99%, total=99%)
- [ ] Confirm temp files are cleaned up (check `/tmp` or OS temp dir)
- [ ] Test all export formats (JPG, PNG, WebP)
- [ ] Validate canvas doesn't exceed 32767px
- [ ] Test parameter persistence: close/reopen plugin, verify saved values
