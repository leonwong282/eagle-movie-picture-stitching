# Bootstrap 5 UI Reconstruction Plan

## Executive Summary

This document outlines the complete strategy for reconstructing the Eagle Movie Picture Stitching plugin UI using Bootstrap 5 while maintaining the existing dark theme, glassmorphism effects, and modular architecture.

**Current Status:** Custom CSS with modular architecture (10 CSS module files)  
**Target:** Bootstrap 5 + Custom theme overrides  
**Branch:** `reconstruct/bootstrap5`  
**Date:** October 30, 2025

---

## 1. Project Analysis

### Current UI Architecture

**HTML Structure:**
```
index.html (106 lines)
├── <div class="container">              # Full viewport container
│   ├── <header class="top">             # Fixed header with drag region
│   │   ├── .top-left                    # Logo + Title
│   │   └── .top-right                   # Pin + Close buttons
│   └── <main class="main">              # Flex main area
│       └── <div class="middle">         # 3-column layout
│           ├── <aside class="list">     # Image list (flex: 1)
│           ├── <section class="preview"> # Canvas preview (flex: 2.5)
│           └── <aside class="property">  # Settings panel (flex: 1.2)
│               ├── <form class="property-controls">
│               │   └── .input-group × 4 # Form inputs
│               └── <div class="property-bottom">
│                   └── buttons × 2      # Preview + Save
```

**Current CSS Modules (10 files):**
1. `variables.css` - Design tokens (colors, spacing, shadows)
2. `base.css` - CSS reset and base styles
3. `layout.css` - Container, flexbox layouts
4. `header.css` - Top navigation bar
5. `forms.css` - Input groups, labels, inputs
6. `buttons.css` - Button styles with gradients
7. `components.css` - File list, preview area
8. `animations.css` - Transitions and keyframes
9. `scrollbar.css` - Custom scrollbar
10. `responsive.css` - Media queries

**Key Design Features:**
- **Dark GitHub Theme:** `--color-bg-primary: #0d1117`
- **Glassmorphism:** `backdrop-filter: blur(10px)`, `rgba(48, 54, 61, 0.9)`
- **Gradient Accents:** Linear/radial gradients on backgrounds
- **Custom Scrollbars:** Webkit-styled dark scrollbars
- **Smooth Animations:** `cubic-bezier(0.4, 0, 0.2, 1)` transitions
- **Glow Effects:** Box-shadows with color-matched glows

---

## 2. Bootstrap 5 Integration Strategy

### 2.1 Installation & Setup

**CDN Approach (Recommended for Eagle Plugin):**
```html
<!-- Bootstrap 5.3.x CSS -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">

<!-- Bootstrap 5.3.x JS Bundle (includes Popper) -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
```

**Local Installation (Offline Plugin Support):**
```bash
# Download Bootstrap 5 files to plugin directory
mkdir -p "Movie Picture Stitching/vendor/bootstrap-5.3.2"
# Copy bootstrap.min.css and bootstrap.bundle.min.js
```

### 2.2 CSS Loading Order (CRITICAL)

```html
<head>
  <!-- 1. Bootstrap Base -->
  <link rel="stylesheet" href="vendor/bootstrap-5.3.2/bootstrap.min.css">
  
  <!-- 2. Custom Variables (Override Bootstrap defaults) -->
  <link rel="stylesheet" href="css/modules/variables.css">
  
  <!-- 3. Bootstrap Theme Overrides -->
  <link rel="stylesheet" href="css/modules/bootstrap-overrides.css">
  
  <!-- 4. Custom Modules -->
  <link rel="stylesheet" href="css/index.css">
</head>
```

---

## 3. Component Mapping: Custom → Bootstrap 5

### 3.1 Layout System

#### Current Custom Layout
```css
.container {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.middle {
  display: flex;
  gap: var(--spacing-lg);
  flex: 1 1 auto;
}
```

#### Bootstrap 5 Equivalent
```html
<div class="container-fluid vh-100 d-flex flex-column p-0 m-0">
  <header class="navbar">...</header>
  
  <main class="row flex-grow-1 g-3 m-0">
    <aside class="col-md-2 col-lg-2"><!-- Image List --></aside>
    <section class="col-md-6 col-lg-7"><!-- Preview --></section>
    <aside class="col-md-4 col-lg-3"><!-- Settings --></aside>
  </main>
</div>
```

**Bootstrap Classes Used:**
- `container-fluid` - Full width container
- `vh-100` - 100vh height
- `d-flex flex-column` - Flexbox vertical layout
- `row` / `col-*` - Grid system for 3-column layout
- `g-3` - Gutter spacing (1rem = 16px)

### 3.2 Header / Navbar

#### Current Custom Header
```html
<header class="top" style="-webkit-app-region: drag">
  <div class="top-left">
    <div class="logo"></div>
    <h1 class="title">Movie Picture Stitching</h1>
  </div>
  <div class="top-right">
    <button class="pin-button">📌</button>
    <button class="close-button">X</button>
  </div>
</header>
```

#### Bootstrap 5 Equivalent
```html
<header class="navbar navbar-dark bg-dark border-bottom shadow-sm" 
        style="-webkit-app-region: drag">
  <div class="container-fluid px-4">
    <!-- Left: Logo + Title -->
    <div class="navbar-brand d-flex align-items-center gap-3">
      <img src="logo.png" alt="Logo" width="40" height="40" 
           class="rounded shadow-sm">
      <h1 class="h5 mb-0 text-white fw-bold text-uppercase" 
          data-i18n="ui.header.title">
        Movie Picture Stitching
      </h1>
    </div>
    
    <!-- Right: Action Buttons -->
    <div class="d-flex gap-2">
      <button class="btn btn-sm btn-outline-warning" 
              id="pinButton" type="button"
              data-i18n="[aria-label]ui.header.pinWindow">
        📌
      </button>
      <button class="btn btn-sm btn-outline-danger" 
              id="closeButton" type="button"
              data-i18n="[aria-label]ui.header.closeWindow">
        X
      </button>
    </div>
  </div>
</header>
```

**Bootstrap Classes Used:**
- `navbar` - Navbar component
- `navbar-dark` - Dark theme variant
- `bg-dark` - Dark background
- `border-bottom shadow-sm` - Border and shadow utilities
- `navbar-brand` - Brand/logo container
- `h5 mb-0` - Heading size with no margin
- `btn btn-sm btn-outline-*` - Outlined buttons

### 3.3 Form Controls

#### Current Custom Forms
```html
<div class="input-group">
  <label for="cropTopPercent">Top Crop Height (%):</label>
  <input type="number" id="cropTopPercent" value="85" min="0" max="99">
  <small class="help-text">Max setting: <span id="remaining-top">14</span>%</small>
</div>
```

#### Bootstrap 5 Equivalent
```html
<div class="mb-4">
  <label for="cropTopPercent" class="form-label fw-semibold text-uppercase small" 
         data-i18n="ui.settings.cropTop">
    Top Crop Height (%)
  </label>
  <input type="number" 
         class="form-control form-control-lg bg-dark text-white border-secondary" 
         id="cropTopPercent" 
         value="85" 
         min="0" 
         max="99"
         data-i18n="[title]ui.tooltips.cropTop"
         aria-describedby="crop-top-help">
  <div class="form-text text-white-50 small mt-2 ps-2 border-start border-success border-3" 
       id="crop-top-help">
    <span data-i18n="ui.settings.maxSettingTop">Max setting:</span> 
    <span id="remaining-top" class="fw-bold text-success">14</span>%
  </div>
</div>

<!-- Select Dropdown -->
<div class="mb-4">
  <label for="exportFormat" class="form-label fw-semibold text-uppercase small"
         data-i18n="ui.settings.exportFormat">
    Export Format
  </label>
  <select class="form-select form-select-lg bg-dark text-white border-secondary" 
          id="exportFormat"
          data-i18n="[title]ui.tooltips.exportFormat">
    <option value="jpg">JPG</option>
    <option value="webp">WEBP</option>
    <option value="png">PNG</option>
  </select>
</div>
```

**Bootstrap Classes Used:**
- `form-label` - Label styling
- `form-control` / `form-select` - Input/select styling
- `form-control-lg` - Large size variant
- `form-text` - Help text styling
- `bg-dark text-white` - Dark theme colors
- `border-secondary` - Border color
- `mb-4` - Margin bottom spacing

### 3.4 Buttons

#### Current Custom Buttons
```html
<button class="button" id="previewButton">Preview</button>
<button class="button" id="saveButton">Save</button>
```

#### Bootstrap 5 Equivalent
```html
<div class="d-flex gap-3 justify-content-end pt-4 border-top border-secondary">
  <button class="btn btn-lg btn-success px-4 shadow-sm" 
          id="previewButton" 
          type="button"
          data-i18n="[aria-label]ui.buttons.preview">
    <i class="bi bi-eye me-2"></i><!-- Optional icon -->
    Preview
  </button>
  <button class="btn btn-lg btn-primary px-4 shadow-sm" 
          id="saveButton" 
          type="button"
          data-i18n="[aria-label]ui.buttons.save">
    <i class="bi bi-save me-2"></i><!-- Optional icon -->
    Save
  </button>
</div>
```

**Bootstrap Classes Used:**
- `btn btn-lg` - Large button
- `btn-success` / `btn-primary` - Color variants
- `px-4` - Horizontal padding
- `shadow-sm` - Small shadow
- `d-flex gap-3 justify-content-end` - Flex layout

### 3.5 Cards (Panels)

#### Current Custom Panels
```html
<aside class="list"><!-- Image list --></aside>
<section class="preview"><!-- Canvas preview --></section>
<aside class="property"><!-- Settings --></aside>
```

#### Bootstrap 5 Equivalent
```html
<!-- Image List Panel -->
<aside class="col-md-2 h-100">
  <div class="card bg-dark text-white border-secondary h-100 shadow-lg">
    <div class="card-body overflow-auto" 
         data-i18n="[aria-label]ui.panels.imageList">
      <!-- Image list content -->
    </div>
  </div>
</aside>

<!-- Preview Panel -->
<section class="col-md-6 h-100">
  <div class="card bg-dark text-white border-secondary h-100 shadow-lg">
    <div class="card-body d-flex flex-column align-items-center justify-content-center overflow-auto"
         data-i18n="[aria-label]ui.panels.preview">
      <!-- Canvas preview -->
    </div>
  </div>
</section>

<!-- Settings Panel -->
<aside class="col-md-4 h-100">
  <div class="card bg-dark text-white border-secondary h-100 shadow-lg">
    <div class="card-body d-flex flex-column overflow-hidden"
         data-i18n="[aria-label]ui.panels.settings">
      <!-- Settings form -->
    </div>
  </div>
</aside>
```

**Bootstrap Classes Used:**
- `card` - Card component
- `card-body` - Card content area
- `bg-dark text-white` - Dark theme
- `border-secondary` - Border styling
- `h-100` - Full height
- `shadow-lg` - Large shadow
- `overflow-auto` - Scrollable content

---

## 4. Bootstrap Theme Customization

### 4.1 SCSS Variables Override (Recommended)

Create `css/modules/bootstrap-custom.scss`:

```scss
// Override Bootstrap default variables BEFORE importing Bootstrap

// Color System - Match current dark theme
$primary: #1f6feb;        // Blue accent
$success: #238636;        // Green accent  
$warning: #d29922;        // Orange/yellow
$danger: #da3633;         // Red
$info: #0969da;           // Info blue

$dark: #0d1117;           // Main background
$body-bg: #0d1117;
$body-color: #ffffff;

// Borders
$border-color: rgba(48, 54, 61, 0.3);
$border-radius: 12px;
$border-radius-lg: 16px;

// Shadows - Glassmorphism
$box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
$box-shadow-sm: 0 4px 16px rgba(0, 0, 0, 0.2);
$box-shadow-lg: 0 16px 48px rgba(0, 0, 0, 0.4);

// Forms
$input-bg: rgba(48, 54, 61, 0.95);
$input-border-color: rgba(48, 54, 61, 0.5);
$input-color: #ffffff;
$input-focus-border-color: $success;
$input-focus-box-shadow: 0 0 0 0.25rem rgba(35, 134, 54, 0.25);

// Buttons
$btn-border-radius: 12px;
$btn-border-radius-lg: 14px;
$btn-padding-y: 0.75rem;
$btn-padding-x: 1.5rem;
$btn-font-weight: 600;

// Cards
$card-bg: rgba(48, 54, 61, 0.9);
$card-border-color: rgba(255, 255, 255, 0.1);
$card-cap-bg: rgba(48, 54, 61, 0.95);

// Navbar
$navbar-dark-color: rgba(255, 255, 255, 0.9);
$navbar-dark-hover-color: rgba(255, 255, 255, 1);
$navbar-dark-active-color: #ffffff;
$navbar-dark-brand-color: #ffffff;

// Spacing - Match current system
$spacer: 1rem;
$spacers: (
  0: 0,
  1: ($spacer * .25),   // 4px
  2: ($spacer * .5),    // 8px
  3: $spacer,           // 16px
  4: ($spacer * 1.5),   // 24px
  5: ($spacer * 2),     // 32px
  6: ($spacer * 3),     // 48px
);

// Import Bootstrap
@import "../../vendor/bootstrap-5.3.2/scss/bootstrap";
```

### 4.2 CSS Custom Properties Override

Create `css/modules/bootstrap-overrides.css`:

```css
/* Bootstrap 5 Theme Overrides - Match Eagle Plugin Dark Theme */

:root {
  /* Override Bootstrap CSS variables */
  --bs-body-bg: #0d1117;
  --bs-body-color: #ffffff;
  --bs-border-color: rgba(48, 54, 61, 0.3);
  --bs-border-radius: 12px;
  --bs-border-radius-lg: 16px;
  
  /* Glassmorphism support */
  --bs-card-bg: rgba(48, 54, 61, 0.9);
  --bs-card-border-color: rgba(255, 255, 255, 0.1);
  
  /* Form controls */
  --bs-form-control-bg: rgba(48, 54, 61, 0.95);
  --bs-form-control-color: #ffffff;
  --bs-form-select-bg: rgba(48, 54, 61, 0.95);
  
  /* Buttons */
  --bs-btn-border-radius: 12px;
  --bs-btn-border-radius-lg: 14px;
}

/* Glassmorphism effects on cards */
.card {
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  background: var(--bs-card-bg) !important;
}

/* Form controls - Dark theme */
.form-control,
.form-select {
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.form-control:focus,
.form-select:focus {
  box-shadow: 
    inset 0 0 0 1px var(--bs-success),
    inset 0 0 10px rgba(35, 134, 54, 0.2),
    0 4px 16px rgba(0, 0, 0, 0.2);
  transform: translateY(-1px);
}

/* Buttons - Gradient overlays */
.btn-success {
  background: linear-gradient(135deg, #2ea043, #238636);
  border: none;
  position: relative;
  overflow: hidden;
}

.btn-success::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.25s;
}

.btn-success:hover::before {
  left: 100%;
}

.btn-success:hover {
  background: linear-gradient(135deg, #2ea043, #238636);
  transform: translateY(-3px);
  box-shadow: 
    0 8px 24px rgba(35, 134, 54, 0.4),
    0 0 20px rgba(35, 134, 54, 0.3);
}

.btn-primary {
  background: linear-gradient(135deg, #0969da, #1f6feb);
  border: none;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #0969da, #1f6feb);
  transform: translateY(-3px);
  box-shadow: 
    0 8px 24px rgba(31, 111, 235, 0.4),
    0 0 20px rgba(31, 111, 235, 0.3);
}

/* Navbar customization */
.navbar {
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  background: rgba(22, 27, 34, 0.95) !important;
}

/* Custom scrollbar for Bootstrap components */
.card-body::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.card-body::-webkit-scrollbar-track {
  background: rgba(48, 54, 61, 0.3);
  border-radius: 4px;
}

.card-body::-webkit-scrollbar-thumb {
  background: rgba(110, 118, 129, 0.6);
  border-radius: 4px;
}

.card-body::-webkit-scrollbar-thumb:hover {
  background: rgba(110, 118, 129, 0.8);
}
```

---

## 5. Migration Strategy

### 5.1 Phase 1: Setup Bootstrap (Week 1)

**Tasks:**
1. ✅ Add Bootstrap 5.3.2 to plugin
   - Download to `vendor/bootstrap-5.3.2/`
   - Or use CDN links
2. ✅ Create `bootstrap-overrides.css`
3. ✅ Update `index.html` CSS loading order
4. ✅ Test Bootstrap loads without breaking existing CSS

**Files Modified:**
- `index.html` - Add Bootstrap CSS/JS links
- `css/modules/bootstrap-overrides.css` - NEW file
- `.gitignore` - Add `vendor/bootstrap*` if using CDN fallback

### 5.2 Phase 2: Convert Layout (Week 1-2)

**Tasks:**
1. ✅ Replace custom `.container` with Bootstrap grid
2. ✅ Convert header to Bootstrap navbar
3. ✅ Convert 3-column layout to Bootstrap columns
4. ✅ Test responsive behavior

**Files Modified:**
- `index.html` - Update HTML structure
- `css/modules/layout.css` - Remove replaced styles
- `css/modules/header.css` - Remove replaced styles

### 5.3 Phase 3: Convert Forms (Week 2)

**Tasks:**
1. ✅ Replace `.input-group` with Bootstrap form controls
2. ✅ Update input/select styling
3. ✅ Test form validation states
4. ✅ Verify i18n still works on form elements

**Files Modified:**
- `index.html` - Update form HTML
- `css/modules/forms.css` - Remove replaced styles, keep custom overrides
- `js/modules/ui-manager.js` - Update DOM selectors if needed

### 5.4 Phase 4: Convert Buttons & Cards (Week 2-3)

**Tasks:**
1. ✅ Replace `.button` with Bootstrap buttons
2. ✅ Convert panels to Bootstrap cards
3. ✅ Test button states and interactions
4. ✅ Verify glassmorphism effects

**Files Modified:**
- `index.html` - Update button/card HTML
- `css/modules/buttons.css` - Remove replaced styles
- `css/modules/components.css` - Remove replaced styles

### 5.5 Phase 5: Testing & Refinement (Week 3)

**Tasks:**
1. ✅ Cross-browser testing (Chrome, Edge, Safari via Eagle)
2. ✅ Test all 8 language UIs
3. ✅ Verify responsive breakpoints
4. ✅ Performance testing (load time, memory)
5. ✅ Accessibility audit (ARIA labels, keyboard nav)

**Testing Checklist:**
- [ ] All existing functionality works
- [ ] Parameter persistence still functions
- [ ] Image selection/preview/save workflow intact
- [ ] Custom scrollbars render correctly
- [ ] Glassmorphism effects display properly
- [ ] Gradients and shadows match original design
- [ ] Responsive layout works at 800px-1920px widths
- [ ] All i18n translations display correctly
- [ ] No console errors or warnings

### 5.6 Phase 6: Cleanup (Week 3-4)

**Tasks:**
1. ✅ Remove unused custom CSS modules
2. ✅ Consolidate remaining custom CSS
3. ✅ Update documentation
4. ✅ Update `.github/copilot-instructions.md`

**Files to Archive/Remove:**
- `css/modules/layout.css` - Mostly replaced by Bootstrap
- `css/modules/header.css` - Replaced by navbar
- `css/modules/forms.css` - Mostly replaced
- `css/modules/buttons.css` - Replaced by btn classes

**Files to Keep:**
- `css/modules/variables.css` - CSS custom properties
- `css/modules/base.css` - Base resets not covered by Bootstrap
- `css/modules/animations.css` - Custom animations
- `css/modules/scrollbar.css` - Custom scrollbar styles
- `css/modules/responsive.css` - Plugin-specific responsive rules
- `css/modules/bootstrap-overrides.css` - NEW - Bootstrap theme

---

## 6. Responsive Design

### 6.1 Bootstrap Breakpoints

```scss
// Bootstrap 5 default breakpoints
$grid-breakpoints: (
  xs: 0,
  sm: 576px,
  md: 768px,
  lg: 992px,
  xl: 1200px,
  xxl: 1400px
);
```

### 6.2 Layout Adjustments by Breakpoint

```html
<!-- Responsive column sizing -->
<main class="row flex-grow-1 g-3 m-0">
  <!-- Image List: Hidden on mobile, 25% on tablet, 20% on desktop -->
  <aside class="col-12 col-md-3 col-lg-2 d-none d-md-block">
    <div class="card">...</div>
  </aside>
  
  <!-- Preview: Full width mobile, 50% tablet, 60% desktop -->
  <section class="col-12 col-md-6 col-lg-7">
    <div class="card">...</div>
  </section>
  
  <!-- Settings: Full width mobile, 50% tablet, 25% desktop -->
  <aside class="col-12 col-md-3 col-lg-3">
    <div class="card">...</div>
  </aside>
</main>
```

### 6.3 Plugin Window Constraints

```json
// manifest.json
{
  "main": {
    "width": 1280,
    "height": 800,
    "minWidth": 800,
    "minHeight": 450
  }
}
```

**Target Breakpoints:**
- Minimum: 800×450 (manifest constraint)
- Default: 1280×800
- Maximum: 1920×1080 (common desktop)

---

## 7. JavaScript Compatibility

### 7.1 Bootstrap JS Components Used

**None required for current UI** - Plugin uses custom event handlers

Optional Bootstrap JS features to consider:
- **Tooltips** - Enhanced tooltips for form labels
- **Popper** - Better positioned tooltips/dropdowns
- **Modal** - Error/success message dialogs

### 7.2 DOM Selector Updates

**Before (Custom CSS):**
```javascript
const container = document.querySelector('.container');
const list = document.querySelector('.list');
const preview = document.querySelector('.preview');
const property = document.querySelector('.property');
```

**After (Bootstrap Classes):**
```javascript
// No changes needed - keep existing IDs/data attributes
const container = document.querySelector('.container-fluid');
const list = document.querySelector('[data-panel="image-list"]');
const preview = document.querySelector('[data-panel="preview"]');
const property = document.querySelector('[data-panel="settings"]');
```

**Recommendation:** Add `data-*` attributes to panels for JS targeting instead of relying on classes.

### 7.3 Event Handling

**No changes required** - existing event system uses:
- Element IDs (`#previewButton`, `#saveButton`, `#cropTopPercent`)
- Custom events (`eagle:selectionChanged`, `ui:parameterChanged`)
- i18n `data-i18n` attributes

---

## 8. Performance Considerations

### 8.1 Bundle Size Analysis

**Current (Custom CSS):**
- Total CSS: ~15KB minified
- No external dependencies

**After Bootstrap 5:**
- Bootstrap CSS: ~200KB (unminified), ~25KB (minified + gzip)
- Custom overrides: ~5KB
- Total: ~30KB (gzipped)

**Mitigation:**
- Use minified Bootstrap CSS
- Remove unused Bootstrap components via PurgeCSS
- CDN caching for Bootstrap files

### 8.2 Rendering Performance

**Concerns:**
- Bootstrap adds more DOM classes
- Potential CSS specificity conflicts

**Solutions:**
- Use `!important` sparingly in overrides
- Scope custom CSS to plugin container
- Test with Chrome DevTools Performance panel

### 8.3 Eagle Plugin Context

**Considerations:**
- Eagle uses Electron/Chromium engine
- No need for IE11 support
- Can use modern CSS features (grid, flexbox, custom properties)

---

## 9. File Structure Changes

### 9.1 Before (Current)

```
Movie Picture Stitching/
├── index.html
├── manifest.json
├── logo.png
├── css/
│   ├── index.css                    # Main CSS entry
│   └── modules/
│       ├── variables.css            # 2KB
│       ├── base.css                 # 1KB
│       ├── layout.css               # 3KB
│       ├── header.css               # 2KB
│       ├── forms.css                # 2KB
│       ├── buttons.css              # 2KB
│       ├── components.css           # 2KB
│       ├── animations.css           # 1KB
│       ├── scrollbar.css            # 1KB
│       └── responsive.css           # 1KB
└── js/
    └── [existing modules]
```

### 9.2 After (Bootstrap 5)

```
Movie Picture Stitching/
├── index.html                       # MODIFIED - Bootstrap classes
├── manifest.json
├── logo.png
├── vendor/                          # NEW - Bootstrap files
│   └── bootstrap-5.3.2/
│       ├── css/
│       │   ├── bootstrap.min.css    # 25KB gzipped
│       │   └── bootstrap.min.css.map
│       └── js/
│           ├── bootstrap.bundle.min.js
│           └── bootstrap.bundle.min.js.map
├── css/
│   ├── index.css                    # MODIFIED - New import order
│   └── modules/
│       ├── variables.css            # KEEP - CSS custom properties
│       ├── base.css                 # KEEP - Plugin-specific resets
│       ├── bootstrap-overrides.css  # NEW - Bootstrap theme
│       ├── animations.css           # KEEP - Custom animations
│       ├── scrollbar.css            # KEEP - Custom scrollbars
│       ├── responsive.css           # MODIFIED - Reduced scope
│       ├── layout.css               # ARCHIVE - Replaced by Bootstrap
│       ├── header.css               # ARCHIVE - Replaced by navbar
│       ├── forms.css                # ARCHIVE - Replaced by form-control
│       ├── buttons.css              # ARCHIVE - Replaced by btn
│       └── components.css           # ARCHIVE - Replaced by card
└── js/
    └── [no changes to modules]
```

---

## 10. Risk Assessment & Mitigation

### 10.1 High Risk Areas

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Bootstrap conflicts with existing CSS | High | Medium | Use Bootstrap overrides, test incrementally |
| JavaScript breaks due to class changes | High | Low | Keep IDs and data-attributes, update selectors carefully |
| i18n attributes lost in conversion | High | Low | Audit all `data-i18n` after HTML changes |
| Performance degradation | Medium | Low | Measure bundle size, use minified files |
| Glassmorphism effects don't work | Medium | Medium | Test backdrop-filter in Eagle's Chromium version |

### 10.2 Testing Strategy

**Unit Testing (Manual):**
1. Test each converted component in isolation
2. Verify against original design screenshots
3. Check all 8 language variants

**Integration Testing:**
1. Full workflow testing (select → preview → save)
2. Parameter persistence testing
3. Error handling scenarios

**Visual Regression Testing:**
1. Take screenshots before/after at key breakpoints
2. Compare with original UI design
3. Verify dark theme consistency

**Performance Testing:**
1. Measure plugin load time (target: <500ms)
2. Check memory usage with 50 images
3. Verify canvas rendering performance unchanged

---

## 11. Documentation Updates Required

### 11.1 Update `.github/copilot-instructions.md`

**New sections to add:**
```markdown
## Bootstrap 5 Architecture

### CSS Framework
Uses **Bootstrap 5.3.2** with custom dark theme overrides.

**Loading Order:**
1. Bootstrap base CSS
2. Custom CSS variables (design tokens)
3. Bootstrap overrides (theme customization)
4. Plugin-specific modules

### Bootstrap Components Used
- **Grid System:** `container-fluid`, `row`, `col-*` for layout
- **Navbar:** Dark theme navbar for header
- **Cards:** Glassmorphism panels for content areas
- **Forms:** `form-control`, `form-select` for inputs
- **Buttons:** `btn` with gradient overlays

### Custom Overrides
All overrides in `css/modules/bootstrap-overrides.css`:
- Dark theme colors (`bg-dark`, `text-white`)
- Glassmorphism effects (`backdrop-filter`)
- Custom gradients on buttons
- Form focus states with glow effects

**NEVER override Bootstrap classes directly** - use CSS custom properties or additional classes.
```

### 11.2 Update `README.md`

Add Bootstrap attribution:
```markdown
## Tech Stack

- **Frontend Framework:** Bootstrap 5.3.2
- **UI Components:** Custom dark theme with glassmorphism
- **JavaScript:** Vanilla ES6+ (modular architecture)
- **Image Processing:** HTML5 Canvas API
```

### 11.3 Update `CHANGELOG.md`

```markdown
## [Unreleased] - Bootstrap 5 Reconstruction

### Changed
- 🎨 **UI Framework:** Migrated from custom CSS to Bootstrap 5.3.2
  - Replaced custom layout with Bootstrap grid system
  - Replaced custom forms with Bootstrap form controls
  - Replaced custom buttons with Bootstrap button components
  - Replaced custom panels with Bootstrap cards
  
### Added
- ✨ **Bootstrap Integration:** Bootstrap 5.3.2 with custom dark theme
- 🎨 **Theme System:** `bootstrap-overrides.css` for glassmorphism effects
- 📱 **Enhanced Responsive:** Better mobile/tablet layouts using Bootstrap breakpoints

### Improved
- ⚡ **Maintainability:** Reduced custom CSS by 60% (~15KB → ~6KB)
- 🎯 **Consistency:** Standardized UI components across plugin
- ♿ **Accessibility:** Improved with Bootstrap's built-in ARIA support

### Technical
- **Bundle Size:** +25KB (Bootstrap CSS minified + gzipped)
- **Performance:** No degradation in load time or rendering
- **Compatibility:** Tested on Eagle 4.0+ (Chromium engine)
```

---

## 12. Rollback Plan

### 12.1 Backup Strategy

**Before starting migration:**
```bash
# Create branch backup
git checkout reconstruct/bootstrap5
git branch backup/pre-bootstrap5-migration

# Tag current state
git tag -a v1.0.1-pre-bs5 -m "Pre-Bootstrap 5 migration state"
```

### 12.2 Rollback Procedure

**If critical issues arise:**
1. Revert to backup branch
2. Cherry-pick any bug fixes made during migration
3. Document why rollback was necessary
4. Plan alternative approach

```bash
# Rollback to pre-migration state
git checkout backup/pre-bootstrap5-migration
git checkout -b reconstruct/bootstrap5-v2

# Or use tag
git checkout v1.0.1-pre-bs5
```

---

## 13. Success Criteria

### 13.1 Functional Requirements

- ✅ All existing features work identically
- ✅ Parameter persistence functions correctly
- ✅ Image selection/preview/save workflow intact
- ✅ i18n system works for all 8 languages
- ✅ Eagle API integration unchanged
- ✅ Error handling remains robust

### 13.2 Visual Requirements

- ✅ Dark GitHub theme preserved
- ✅ Glassmorphism effects maintained
- ✅ Gradient accents on buttons
- ✅ Smooth animations and transitions
- ✅ Custom scrollbars render correctly
- ✅ Glow effects on hover/focus states

### 13.3 Technical Requirements

- ✅ No JavaScript errors in console
- ✅ Plugin loads in <500ms
- ✅ Bundle size increase <30KB (gzipped)
- ✅ No memory leaks or performance degradation
- ✅ Code passes linting/validation
- ✅ All tests pass (manual testing checklist)

### 13.4 Documentation Requirements

- ✅ `.github/copilot-instructions.md` updated
- ✅ `README.md` reflects Bootstrap usage
- ✅ `CHANGELOG.md` documents all changes
- ✅ Code comments updated where needed
- ✅ Migration guide created (this document)

---

## 14. Timeline & Milestones

### Week 1: Foundation (Nov 1-7, 2025)
- [ ] Day 1-2: Setup Bootstrap, create overrides
- [ ] Day 3-4: Convert layout structure
- [ ] Day 5-7: Convert header/navbar

### Week 2: Components (Nov 8-14, 2025)
- [ ] Day 1-3: Convert forms
- [ ] Day 4-5: Convert buttons
- [ ] Day 6-7: Convert cards/panels

### Week 3: Testing (Nov 15-21, 2025)
- [ ] Day 1-2: Functional testing
- [ ] Day 3-4: Visual regression testing
- [ ] Day 5-6: Performance testing
- [ ] Day 7: Bug fixes

### Week 4: Finalization (Nov 22-28, 2025)
- [ ] Day 1-2: Cleanup unused CSS
- [ ] Day 3-4: Documentation updates
- [ ] Day 5-6: Final review and testing
- [ ] Day 7: Merge to main branch

**Target Completion:** November 28, 2025

---

## 15. Additional Resources

### 15.1 Bootstrap 5 Documentation
- **Official Docs:** https://getbootstrap.com/docs/5.3/
- **Grid System:** https://getbootstrap.com/docs/5.3/layout/grid/
- **Forms:** https://getbootstrap.com/docs/5.3/forms/overview/
- **Components:** https://getbootstrap.com/docs/5.3/components/

### 15.2 Customization Guides
- **Theming:** https://getbootstrap.com/docs/5.3/customize/overview/
- **SCSS Variables:** https://getbootstrap.com/docs/5.3/customize/sass/
- **CSS Variables:** https://getbootstrap.com/docs/5.3/customize/css-variables/

### 15.3 Tools
- **PurgeCSS:** Remove unused Bootstrap CSS
- **Bootstrap Icons:** Optional icon library
- **Bootstrap Studio:** Visual design tool

---

## Appendix A: Quick Reference - Class Mapping

| Current Custom Class | Bootstrap 5 Equivalent | Notes |
|---------------------|------------------------|-------|
| `.container` | `.container-fluid` | Full width |
| `.main` | `.row` | Flex row |
| `.middle` | `.row g-3` | Row with gaps |
| `.list` | `.col-md-2` + `.card` | Column + card |
| `.preview` | `.col-md-6` + `.card` | Column + card |
| `.property` | `.col-md-4` + `.card` | Column + card |
| `.input-group` | `.mb-4` | Margin bottom |
| `.input-group label` | `.form-label` | Form label |
| `.input-group input` | `.form-control` | Form input |
| `.input-group select` | `.form-select` | Form select |
| `.help-text` | `.form-text` | Help text |
| `.button` | `.btn .btn-lg` | Large button |
| `.property-bottom` | `.d-flex .gap-3` | Flex container |

---

## Appendix B: Color Palette Reference

```css
/* Current Theme Colors */
--color-bg-primary: #0d1117;        /* Main background */
--color-bg-secondary: #161b22;      /* Secondary background */
--color-accent-primary: #238636;    /* Green (success) */
--color-accent-secondary: #1f6feb;  /* Blue (primary) */
--color-accent-warning: #d29922;    /* Orange/yellow */
--color-accent-danger: #da3633;     /* Red */

/* Bootstrap 5 Variable Mapping */
$dark: #0d1117;
$primary: #1f6feb;
$success: #238636;
$warning: #d29922;
$danger: #da3633;
```

---

**Document Version:** 1.0  
**Last Updated:** October 30, 2025  
**Author:** AI Assistant  
**Reviewer:** [To be assigned]  
**Status:** Draft - Awaiting approval
