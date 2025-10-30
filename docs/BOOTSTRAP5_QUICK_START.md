# Bootstrap 5 Reconstruction - Quick Start Guide

**Date:** October 30, 2025  
**Branch:** `reconstruct/bootstrap5`  
**Status:** Planning Phase - DO NOT EXECUTE YET

---

## 🎯 Objective

Reconstruct the Eagle Movie Picture Stitching plugin UI using **Bootstrap 5.3.2** while maintaining:
- ✅ Dark GitHub theme
- ✅ Glassmorphism effects
- ✅ All existing functionality
- ✅ 8-language i18n support
- ✅ Parameter persistence

---

## 📋 Pre-Flight Checklist

Before starting, ensure:
- [ ] Current code is committed to git
- [ ] Backup branch created: `git branch backup/pre-bootstrap5-migration`
- [ ] Version tagged: `git tag v1.0.1-pre-bs5`
- [ ] Bootstrap 5.3.2 downloaded to `vendor/bootstrap-5.3.2/`
- [ ] Full documentation read: `docs/BOOTSTRAP5_RECONSTRUCTION_PLAN.md`

---

## 🚀 Quick Migration Steps

### Step 1: Add Bootstrap (5 minutes)

**File:** `index.html`

Add before existing CSS:
```html
<head>
  <!-- Bootstrap 5.3.2 -->
  <link rel="stylesheet" href="vendor/bootstrap-5.3.2/css/bootstrap.min.css">
  
  <!-- Existing CSS -->
  <link rel="stylesheet" href="css/index.css">
</head>
```

Add before closing `</body>`:
```html
  <!-- Bootstrap JS Bundle -->
  <script src="vendor/bootstrap-5.3.2/js/bootstrap.bundle.min.js"></script>
  
  <!-- Existing scripts -->
  <script src="js/i18n-manager.js"></script>
  ...
</body>
```

### Step 2: Create Bootstrap Overrides (10 minutes)

**File:** `css/modules/bootstrap-overrides.css` (NEW)

```css
/* Bootstrap Dark Theme Overrides */
:root {
  --bs-body-bg: #0d1117;
  --bs-body-color: #ffffff;
  --bs-border-color: rgba(48, 54, 61, 0.3);
  --bs-border-radius: 12px;
}

.card {
  backdrop-filter: blur(10px);
  background: rgba(48, 54, 61, 0.9) !important;
}

.form-control, .form-select {
  backdrop-filter: blur(10px);
  background: rgba(48, 54, 61, 0.95);
  color: #ffffff;
  border-color: rgba(48, 54, 61, 0.5);
}

.form-control:focus {
  border-color: #238636;
  box-shadow: 0 0 0 0.25rem rgba(35, 134, 54, 0.25);
}

.btn-success {
  background: linear-gradient(135deg, #2ea043, #238636);
}

.btn-primary {
  background: linear-gradient(135deg, #0969da, #1f6feb);
}
```

Update `css/index.css`:
```css
@import "modules/variables.css";
@import "modules/bootstrap-overrides.css"; /* NEW */
@import "modules/base.css";
/* ... rest of imports */
```

### Step 3: Convert Layout (30 minutes)

**Before:**
```html
<div class="container">
  <header class="top">...</header>
  <main class="main">
    <div class="middle">
      <aside class="list">...</aside>
      <section class="preview">...</section>
      <aside class="property">...</aside>
    </div>
  </main>
</div>
```

**After:**
```html
<div class="container-fluid vh-100 d-flex flex-column p-0 m-0">
  <header class="navbar navbar-dark bg-dark border-bottom">...</header>
  
  <main class="row flex-grow-1 g-3 m-0 p-3">
    <aside class="col-md-2">
      <div class="card bg-dark border-secondary h-100">
        <div class="card-body"><!-- Image list --></div>
      </div>
    </aside>
    
    <section class="col-md-6">
      <div class="card bg-dark border-secondary h-100">
        <div class="card-body"><!-- Preview --></div>
      </div>
    </section>
    
    <aside class="col-md-4">
      <div class="card bg-dark border-secondary h-100">
        <div class="card-body"><!-- Settings --></div>
      </div>
    </aside>
  </main>
</div>
```

### Step 4: Convert Header (15 minutes)

**Before:**
```html
<header class="top" style="-webkit-app-region: drag">
  <div class="top-left">
    <div class="logo"></div>
    <h1 class="title">Movie Picture Stitching</h1>
  </div>
  <div class="top-right">
    <button class="pin-button" id="pinButton">📌</button>
    <button class="close-button" id="closeButton">X</button>
  </div>
</header>
```

**After:**
```html
<header class="navbar navbar-dark bg-dark border-bottom shadow-sm" 
        style="-webkit-app-region: drag">
  <div class="container-fluid px-4">
    <div class="navbar-brand d-flex align-items-center gap-3">
      <img src="logo.png" alt="Logo" width="40" height="40" class="rounded">
      <h1 class="h5 mb-0 text-white fw-bold" data-i18n="ui.header.title">
        Movie Picture Stitching
      </h1>
    </div>
    
    <div class="d-flex gap-2">
      <button class="btn btn-sm btn-outline-warning" id="pinButton">📌</button>
      <button class="btn btn-sm btn-outline-danger" id="closeButton">X</button>
    </div>
  </div>
</header>
```

### Step 5: Convert Forms (30 minutes)

**Before:**
```html
<div class="input-group">
  <label for="cropTopPercent">Top Crop Height (%):</label>
  <input type="number" id="cropTopPercent" value="85" min="0" max="99">
  <small class="help-text">Max setting: <span id="remaining-top">14</span>%</small>
</div>
```

**After:**
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
         max="99">
  <div class="form-text text-white-50 small mt-2" id="crop-top-help">
    <span data-i18n="ui.settings.maxSettingTop">Max setting:</span> 
    <span id="remaining-top" class="fw-bold text-success">14</span>%
  </div>
</div>
```

### Step 6: Convert Buttons (10 minutes)

**Before:**
```html
<div class="property-bottom">
  <button class="button" id="previewButton">Preview</button>
  <button class="button" id="saveButton">Save</button>
</div>
```

**After:**
```html
<div class="d-flex gap-3 justify-content-end pt-4 border-top border-secondary">
  <button class="btn btn-lg btn-success px-4" id="previewButton">
    Preview
  </button>
  <button class="btn btn-lg btn-primary px-4" id="saveButton">
    Save
  </button>
</div>
```

### Step 7: Test & Verify (15 minutes)

Run through checklist:
- [ ] Plugin loads without errors
- [ ] Dark theme displays correctly
- [ ] All form inputs work
- [ ] Buttons respond to clicks
- [ ] Preview/Save functionality intact
- [ ] i18n translations display
- [ ] Parameter persistence works
- [ ] Responsive layout adjusts properly

---

## 🔍 Key Bootstrap Classes Reference

### Layout
- `container-fluid` - Full width container
- `vh-100` - 100% viewport height
- `d-flex flex-column` - Vertical flexbox
- `row` / `col-*` - Grid system
- `g-3` - Gap spacing (1rem)

### Components
- `card` - Card container
- `card-body` - Card content
- `navbar` - Navigation bar
- `navbar-brand` - Brand/logo area

### Forms
- `form-label` - Input label
- `form-control` - Text/number input
- `form-select` - Select dropdown
- `form-text` - Help text

### Buttons
- `btn` - Button base class
- `btn-lg` - Large button
- `btn-success` / `btn-primary` - Color variants
- `btn-outline-*` - Outlined buttons

### Utilities
- `bg-dark text-white` - Dark background + white text
- `border-secondary` - Secondary border color
- `shadow-sm` / `shadow-lg` - Shadows
- `mb-4` - Margin bottom (1.5rem)
- `px-4` - Horizontal padding (1.5rem)

---

## ⚠️ Common Pitfalls

1. **Don't remove IDs** - JavaScript depends on element IDs
2. **Keep data-i18n attributes** - Required for translations
3. **Preserve -webkit-app-region** - Needed for Eagle window dragging
4. **Test incrementally** - Convert one section at a time
5. **Check console** - Watch for JavaScript errors after changes

---

## 🔄 Rollback Command

If something goes wrong:
```bash
git checkout backup/pre-bootstrap5-migration
```

---

## 📚 Full Documentation

For complete details, see:
- **Full Plan:** `docs/BOOTSTRAP5_RECONSTRUCTION_PLAN.md`
- **Bootstrap Docs:** https://getbootstrap.com/docs/5.3/
- **Current Architecture:** `.github/copilot-instructions.md`

---

**Next Steps:**
1. ✅ Read full reconstruction plan
2. ⏸️ Wait for approval to proceed
3. 🚀 Follow steps above incrementally
4. ✅ Test thoroughly at each step
5. 📝 Update documentation when complete

**Estimated Time:** 3-4 weeks total  
**First Milestone:** Complete Steps 1-2 (Bootstrap setup) in Week 1
