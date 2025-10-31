````instructions
# Eagle Movie Picture Stitching Plugin - AI Coding Instructions

## Project Overview

An Eagle desktop plugin for vertically stitching multiple movie screenshot images into panoramic compositions. Built with **vanilla JavaScript ES6+**, **Bootstrap 5.3.8**, **modular class-based architecture**, and **8-language i18n system**.

**Current Branch:** `reconstruct/bootstrap5` - UI fully migrated to Bootstrap 5  
**Tech Stack:** Bootstrap 5.3.8, HTML5 Canvas API, vanilla JavaScript, Eagle Plugin API v4.0+, Node.js fs/path, localStorage  
**Key Feature:** Auto-saves user parameters (crop %, format, quality) using localStorage with validation

## Bootstrap 5 Architecture (v3.0.0 - Hybrid Approach)

### CSS Philosophy: Bootstrap-First Design

**Core Principle:** Use Bootstrap utilities for ALL layout (in HTML `class=""`), custom CSS ONLY for theme overrides that Bootstrap doesn't provide.

**Rationale:** Single mental model - developers see layout structure directly in HTML without jumping between files. No "cognitive overhead" from mixing Bootstrap utilities with custom semantic classes.

### CSS Loading Order (CRITICAL)
```html
<!-- 1. Bootstrap base CSS -->
<link rel="stylesheet" href="vendor/bootstrap-5.3.8/css/bootstrap.min.css">

<!-- 2. Bootstrap configuration & design tokens -->
<link rel="stylesheet" href="css/bootstrap-config.css">

<!-- 3. Component overrides (theme only) -->
<link rel="stylesheet" href="css/components/forms.css">
<link rel="stylesheet" href="css/components/buttons.css">
<link rel="stylesheet" href="css/components/cards.css">
<link rel="stylesheet" href="css/components/navbar.css">

<!-- 4. Utilities & effects (minimal) -->
<link rel="stylesheet" href="css/utilities/layout.css">
<link rel="stylesheet" href="css/utilities/effects.css">

<!-- 5. Animations -->
<link rel="stylesheet" href="css/modules/animations.css">
```

### Modular CSS Architecture
**Philosophy:** Bootstrap for layout, custom CSS for theme ONLY.

**Structure:**
```
css/
├── bootstrap-config.css          # Design tokens & BS variable overrides (170 lines)
├── components/
│   ├── buttons.css               # Button gradients & shimmer effects (250 lines)
│   ├── forms.css                 # Form focus states & validation (135 lines)
│   ├── cards.css                 # Glassmorphism card effects (70 lines)
│   └── navbar.css                # Header styling (65 lines)
├── utilities/
│   ├── layout.css                # Eagle-specific utilities ONLY (40 lines)
│   └── effects.css               # Glassmorphism, scrollbars (130 lines)
└── modules/
    └── animations.css            # Keyframes & transitions (200 lines)
```

**What goes in custom CSS:**
✅ Theme overrides Bootstrap doesn't provide: gradients, glassmorphism, shimmer effects  
✅ Eagle-specific features: `.drag-region` (window drag area), `.no-drag` (disable drag)  
✅ Flexbox scroll fix: `.flex-1-0` (flex: 1 1 0 + min-height: 0)  
✅ Custom scrollbar styling (webkit-scrollbar, scrollbar-width)

**What stays in HTML class="":**
✅ ALL layout: `d-flex`, `flex-column`, `gap-2`, `p-2`, `m-0`, `overflow-auto`  
✅ Grid system: `container-fluid`, `row`, `col-md-3`, `col-md-6`  
✅ Sizing: `h-100`, `w-100`, `vh-100`, `min-h-0`  
✅ Spacing: `mb-3`, `mt-auto`, `pb-2`, `px-4`  
✅ Bootstrap components: `.card`, `.card-body`, `.btn`, `.form-control`

### Bootstrap Components Used
- **Grid System:** `container-fluid`, `row`, `col-md-*` for 3-column layout
- **Navbar:** Dark theme navbar with drag region support
- **Cards:** Glass-effect panels using custom gradients (theme override)
- **Forms:** `form-control`, `form-select` with dark theme (theme override)
- **Buttons:** `btn`, `btn-success`, `btn-primary` with gradient overlays (theme override)
- **Utilities:** `d-flex`, `flex-column`, `gap-*`, `overflow-*`, `text-*`, `shadow-*`

### Minimal Inline Styles (Accepted)

**ONLY acceptable for properties Bootstrap doesn't cover:**
```html
<!-- ✅ Acceptable: Flexbox scroll fix (Bootstrap has no utility for this) -->
<div style="flex: 1 1 0; min-height: 0; overflow-y: auto;">

<!-- ✅ Acceptable: Fixed button width (specific to design) -->
<button style="min-width: 150px;">

<!-- ❌ WRONG: Bootstrap covers this -->
<div style="display: flex; gap: 0.5rem;">  <!-- Use d-flex gap-2 instead -->
```

### Theme Customization Pattern
**NEVER modify Bootstrap classes directly** - always override in component CSS files:

```css
/* ✅ CORRECT: Override in components/forms.css */
.form-control:focus {
  background: var(--gradient-form-control);
  border-color: var(--bs-success);
  box-shadow: 0 0 0 3px rgba(35, 134, 54, 0.15);
}

/* ✅ CORRECT: Override in components/cards.css */
.card {
  background: var(--gradient-card);
  backdrop-filter: var(--backdrop-blur);
}

/* ❌ WRONG: Custom semantic classes for layout */
.plugin-container { display: flex; flex-direction: column; }  /* Use d-flex flex-column */

/* ❌ WRONG: Inline styles in HTML */
<input style="background: rgba(30, 36, 43, 0.95);">
```

### Design Token System
All visual properties centralized in `bootstrap-config.css`:

```css
:root {
  /* Colors */
  --color-bg-primary: #0d1117;
  --color-accent-primary: #238636;
  
  /* Gradients */
  --gradient-card: linear-gradient(...);
  --gradient-button-success: linear-gradient(...);
  
  /* Effects */
  --glass-bg: rgba(48, 54, 61, 0.9);
  --backdrop-blur: blur(20px);
  
  /* Shadows */
  --shadow-card: 0 8px 32px rgba(0, 0, 0, 0.4), ...;
  
  /* Bootstrap overrides */
  --bs-body-bg: var(--color-bg-primary);
  --bs-border-radius: var(--border-radius-lg);
}
```

### Responsive Layout Structure
```html
<div class="container-fluid vh-100 d-flex flex-column p-0 m-0">
  <header class="navbar navbar-dark bg-dark drag-region">...</header>
  <main class="row g-2 m-0 p-2 flex-1-0 overflow-hidden">
    <aside class="col-md-3 d-flex flex-column">
      <div class="card h-100 d-flex flex-column">
        <div class="card-body list" style="flex: 1 1 0; min-height: 0; overflow-y: auto;">...</div>
      </div>
    </aside>
    <section class="col-md-6 d-flex flex-column">...</section>
    <aside class="col-md-3 d-flex flex-column">...</aside>
  </main>
</div>
```

**Key Constraints:** 
- **NO inline styles** - all styling through classes
- `min-height: 0` on flex children prevents overflow (defined in `.plugin-panel`)
- Semantic classes improve readability and maintainability

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

## CSS Architecture (Bootstrap 5 + Modular Components)

### Module Organization (v2.0.0 - Fully Modularized)
```
css/
├── bootstrap-config.css          # Design tokens + BS overrides (single source)
├── components/
│   ├── buttons.css               # All button styles & variants
│   ├── forms.css                 # Form controls & validation
│   ├── cards.css                 # Card components & scrollbars
│   └── navbar.css                # Header & navigation
├── utilities/
│   ├── layout.css                # Layout helpers & semantic classes
│   └── effects.css               # Glassmorphism, shadows, responsive
└── modules/
    └── animations.css            # Keyframes & transitions
```

**Benefits:**
- ✅ **Zero inline styles** in HTML
- ✅ **Single responsibility:** Each file handles one component type
- ✅ **~60% size reduction:** From 546-line monolith to focused modules
- ✅ **Easy to locate:** Know exactly which file to edit for any component

**Removed files** (replaced or consolidated):
- ~~`variables.css`~~ → Merged into `bootstrap-config.css`
- ~~`bootstrap-overrides.css`~~ → Split into component modules
- ~~`base.css`~~ → Merged into `bootstrap-config.css`
- ~~`scrollbar.css`~~ → Merged into `utilities/effects.css`

### Design Token Hierarchy
```css
/* bootstrap-config.css - Single source of truth */
:root {
  /* 1. Custom design tokens */
  --color-bg-primary: #0d1117;
  --gradient-card: linear-gradient(...);
  --shadow-card: 0 8px 32px rgba(0, 0, 0, 0.4);
  
  /* 2. Bootstrap variable overrides (point to custom tokens) */
  --bs-body-bg: var(--color-bg-primary);
  --bs-card-bg: var(--glass-bg);
}
```

**Usage Pattern:**
```css
/* ✅ Reference design tokens */
.plugin-card {
  background: var(--gradient-card);
  box-shadow: var(--shadow-card);
}

/* ❌ Never hardcode values */
.plugin-card {
  background: rgba(48, 54, 61, 0.9);  /* DON'T DO THIS */
}
```

### Semantic Class Naming Convention
**Pattern:** `plugin-{component}__{element}--{modifier}`

```css
/* Component */
.plugin-card { }

/* Element (child of component) */
.plugin-card__body { }
.plugin-card__header { }

/* Modifier (variation) */
.plugin-card__body--scrollable { }
.plugin-card__body--centered { }
```

**Benefits:**
- Clear hierarchy (component → element → modifier)
- Self-documenting (`.plugin-action-button` vs `.btn.btn-lg.shadow-sm.style-...`)
- Easy to search and replace

### When to Create New Modules

**Create NEW component file when:**
- Adding a major UI component (modal, tooltip, dropdown)
- Component has 50+ lines of CSS
- Component has multiple states/variants

**Add to EXISTING file when:**
- Small variations of existing components
- Component-specific utilities
- One-off adjustments

**Example:**
```css
/* ✅ Add to components/buttons.css */
.btn-outline-info { }  /* New button variant */

/* ❌ DON'T create new file for single button variant */
```

## Toast Notification System

### Architecture
Non-blocking toast notifications replace `alert()` for better UX. Located in `css/components/toast.css` and `js/modules/ui-manager.js`.

### Usage Pattern
```javascript
// Show toast with type and duration
this.uiManager.showMessage(messageKey, variables, type, duration);

// Types: 'success', 'error', 'warning', 'info'
// Duration: milliseconds (default: 4000, 0 = no auto-dismiss)
```

### Examples
```javascript
// Success message (green, auto-dismiss in 4s)
this.uiManager.showMessage('ui.messages.success', {}, 'success');

// Error message (red, stays visible)
this.uiManager.showMessage('ui.messages.saveError', { error: err.message }, 'error', 0);

// Warning message (yellow, custom duration)
this.uiManager.showMessage('ui.messages.generatePreview', {}, 'warning', 3000);

// Info message (blue, default duration)
this.uiManager.showMessage('ui.messages.processing', {}, 'info');
```

### Toast Features
- **Auto-dismiss** with progress bar
- **Stackable** - multiple toasts can show simultaneously
- **Closeable** - manual dismiss with × button
- **Animated** - slide-in from right, slide-out on dismiss
- **Accessible** - ARIA live regions, keyboard navigable
- **Responsive** - adapts to mobile screens
- **i18n** - fully internationalized messages

### Toast Variants
| Type | Color | Icon | Use Case |
|------|-------|------|----------|
| `success` | Green | ✓ | Save successful, operation complete |
| `error` | Red | ✕ | Save failed, validation error |
| `warning` | Yellow | ⚠ | Preview required, parameter warning |
| `info` | Blue | ℹ | Processing status, general info |

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

### User-Facing Messages
**Always** use toast notifications with appropriate type:
```javascript
// ❌ Wrong: Blocking alert
alert('Error');

// ✅ Correct: Non-blocking toast with type
this.uiManager.showMessage('ui.messages.saveError', { error: error.message }, 'error');

// ✅ Success toast
this.uiManager.showMessage('ui.messages.success', {}, 'success');

// ✅ Warning toast
this.uiManager.showMessage('ui.messages.generatePreview', {}, 'warning');
```

## Development Workflows

### Testing in Eagle (macOS)

**Installation:**
1. Copy entire `Movie Picture Stitching/` folder to Eagle plugins directory:
   - **macOS:** `~/Library/Application Support/Eagle/plugins/`
   - **Windows:** `%APPDATA%\Eagle\plugins\`
2. Open Eagle → Settings → Plugins → Developer → "Import Local Project"
3. Select the `Movie Picture Stitching/` folder
4. Enable the plugin in Plugins list

**Live Development:**
- Eagle uses **Chromium DevTools** - press `Cmd+Option+I` (macOS) or `F12` (Windows) when plugin is open
- Reload plugin: `Cmd+R` (macOS) or `Ctrl+R` (Windows) to refresh after code changes
- **NO build step required** - changes to JS/CSS are reflected on reload
- Hot reload doesn't work - must manually reload after each change

**Critical:** Eagle caches plugins aggressively. If changes don't appear:
1. Close the plugin window
2. Disable plugin in Eagle settings
3. Re-enable plugin
4. Reopen plugin

### Debugging Tools

**Console Access:**
```javascript
// Access app instance globally (set in plugin-modular.js)
window.app

// Check storage state
storageDebug.viewAll()       // View all saved parameters
storageDebug.clearAll()      // Clear localStorage
storageDebug.testCycle()     // Test save/load cycle

// Validate translations
i18nManager.validateTranslations()  // Check for missing keys

// Inspect Eagle API
await eagle.item.getSelected()     // Currently selected images
eagle.app.locale                   // Current language
```

**Performance Profiling:**
```javascript
const startTime = performance.now();
// ... operation ...
const duration = performance.now() - startTime;
console.log(`Operation took ${duration.toFixed(2)}ms`);
```

### Working with Eagle API

**Polling Pattern (CRITICAL):**
Eagle API is **pull-based**, not push-based. `EagleAPIManager` polls every 500ms:
```javascript
// In eagle-api-manager.js
startMonitoring() {
  this.selectionCheckInterval = setInterval(async () => {
    const selected = await eagle.item.getSelected();
    // Dispatch event if selection changed
  }, 500);
}
```

**API Availability Check:**
```javascript
// ALWAYS check before using Eagle API
if (typeof eagle === 'undefined') {
  console.warn('Eagle API not available (not running in Eagle context)');
  return;
}
```

**Common API Calls:**
```javascript
// Get selected images (returns array of image objects)
const selected = await eagle.item.getSelected();
// Returns: [{id, name, ext, size, filePath, folders, tags, ...}]

// Add image to Eagle library
await eagle.item.addFromPath(filePath, {
  name: 'Stitched Result',
  folders: [selectedFolderID]
});

// Window controls
eagle.window.setAlwaysOnTop(true);
eagle.window.close();
```

### Browser/Canvas Limits

**Maximum Canvas Size:** 32767 pixels (hard browser limit)
```javascript
// ALWAYS validate before rendering
if (width > 32767 || height > 32767) {
  throw new Error('Canvas exceeds browser maximum (32767px)');
}
```

**Memory Management:**
- Limit batch processing to 50 images (recommended)
- Clear canvas references in cleanup: `canvas.width = 0; canvas.height = 0;`
- Use `Promise.all()` with timeouts for parallel image loading (10s per image)

## Common Pitfalls

1. **Never use `innerHTML` for user-generated content** (XSS risk). Use `textContent` or `createElement()`.
2. **Always cleanup canvas references** in `cleanup()` methods to prevent memory leaks.
3. **Check Eagle API availability** with `typeof eagle !== 'undefined'` before use.
4. **Validate file paths** to prevent path traversal: reject paths with `..` characters.
5. **Respect parameter constraints:** Total crop must be < 100%, quality 0.1-1.0.
6. **NEVER wait for DOM in constructor** - causes 5s+ delay. Load params synchronously, apply in `initialize()`.

## Key Files Reference

### Core Application
- **Entry point:** `Movie Picture Stitching/index.html` (loads Bootstrap → CSS → JS modules in order)
- **Main logic:** `js/plugin-modular.js` (app orchestration, event coordination)
- **Manifest:** `manifest.json` (Eagle plugin config, 8-language support, window constraints)

### Modules (Specialized Classes)
- **Storage:** `js/modules/storage-manager.js` (localStorage abstraction with validation)
- **Parameters:** `js/modules/parameter-manager.js` (input validation, smart constraints)
- **Eagle API:** `js/modules/eagle-api-manager.js` (polling-based image selection, 500ms intervals)
- **Canvas:** `js/modules/canvas-renderer.js` (stitching algorithm, 32767px limit checks)
- **UI:** `js/modules/ui-manager.js` (DOM manipulation, i18n translations)
- **File:** `js/modules/file-manager.js` (temp file lifecycle, cleanup scheduling)

### Internationalization
- **Manager:** `js/i18n-manager.js` (i18next wrapper, language detection from Eagle)
- **Utilities:** `js/i18n-utils.js` (DOM translation helpers, `data-i18n` attribute processing)
- **Translations:** `_locales/{en,zh_CN,zh_TW,ja_JP,es_ES,de_DE,ko_KR,ru_RU}.json`

### Styling (Bootstrap 5 + Modular CSS v3.0 - Hybrid Approach)
- **Bootstrap:** `vendor/bootstrap-5.3.8/css/bootstrap.min.css` (framework base)
- **Config:** `css/bootstrap-config.css` (design tokens, Bootstrap variable overrides, 170 lines)
- **Components:** `css/components/{buttons,forms,cards,navbar,toast}.css` (theme-only overrides: gradients, glassmorphism, focus states, toast notifications)
- **Utilities:** `css/utilities/layout.css` (Eagle-specific ONLY: .drag-region, .flex-1-0, 40 lines)
- **Effects:** `css/utilities/effects.css` (glassmorphism, custom scrollbars, 130 lines)
- **Animations:** `css/modules/animations.css` (keyframes, transitions, button states, 300+ lines)
- **Deprecated:** `css/modules/{variables,bootstrap-overrides,base,scrollbar}.css` - DELETED, merged into new structure

### Documentation
- **Architecture:** `docs/PARAMETER_PERSISTENCE_ARCHITECTURE.md` (storage flow diagrams)
- **Bootstrap:** `docs/BOOTSTRAP5_RECONSTRUCTION_PLAN.md` (migration guide, class mappings)
- **Modules:** `Movie Picture Stitching/js/modules/README.md` (module architecture)
- **CSS:** `Movie Picture Stitching/css/README.md` (CSS module system)

## Testing Checklist

Before committing changes:
- [ ] Test with 2, 10, and 50 images
- [ ] Verify all 8 language UIs work
- [ ] Check parameter validation edge cases (0%, 99%, total=99%)
- [ ] Confirm temp files are cleaned up (check `/tmp` or OS temp dir)
- [ ] Test all export formats (JPG, PNG, WebP)
- [ ] Validate canvas doesn't exceed 32767px
- [ ] Test parameter persistence: close/reopen plugin, verify saved values
