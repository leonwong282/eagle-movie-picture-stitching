# Bootstrap 5.3.8 Files - Keep or Delete Guide

**Location:** `Movie Picture Stitching/vendor/bootstrap-5.3.8-dist/`  
**Date:** October 30, 2025  
**Purpose:** Optimize Bootstrap distribution for Eagle plugin

---

## 📊 Current File Structure

```
bootstrap-5.3.8-dist/
├── css/                    (32 files - 1.9 MB total)
│   ├── bootstrap.css              328 KB
│   ├── bootstrap.css.map          505 KB
│   ├── bootstrap.min.css          160 KB ✅ KEEP
│   ├── bootstrap.min.css.map      392 KB
│   ├── bootstrap.rtl.css          329 KB
│   ├── bootstrap.rtl.css.map      506 KB
│   ├── bootstrap.rtl.min.css      161 KB
│   ├── bootstrap.rtl.min.css.map  394 KB
│   ├── bootstrap-grid.css          52 KB
│   ├── bootstrap-grid.css.map      62 KB
│   ├── bootstrap-grid.min.css      26 KB
│   ├── bootstrap-grid.min.css.map  47 KB
│   ├── bootstrap-grid.rtl.css      52 KB
│   ├── bootstrap-grid.rtl.css.map  62 KB
│   ├── bootstrap-grid.rtl.min.css  26 KB
│   ├── bootstrap-grid.rtl.min.css.map  47 KB
│   ├── bootstrap-reboot.css        12 KB
│   ├── bootstrap-reboot.css.map    14 KB
│   ├── bootstrap-reboot.min.css     6 KB
│   ├── bootstrap-reboot.min.css.map  11 KB
│   ├── bootstrap-reboot.rtl.css    12 KB
│   ├── bootstrap-reboot.rtl.css.map 14 KB
│   ├── bootstrap-reboot.rtl.min.css 6 KB
│   ├── bootstrap-reboot.rtl.min.css.map  11 KB
│   ├── bootstrap-utilities.css     76 KB
│   ├── bootstrap-utilities.css.map  91 KB
│   ├── bootstrap-utilities.min.css  38 KB
│   ├── bootstrap-utilities.min.css.map  72 KB
│   ├── bootstrap-utilities.rtl.css  77 KB
│   ├── bootstrap-utilities.rtl.css.map  91 KB
│   ├── bootstrap-utilities.rtl.min.css  39 KB
│   └── bootstrap-utilities.rtl.min.css.map  72 KB
│
└── js/                     (12 files - 1.5 MB total)
    ├── bootstrap.bundle.js         295 KB
    ├── bootstrap.bundle.js.map     445 KB
    ├── bootstrap.bundle.min.js      81 KB ✅ KEEP
    ├── bootstrap.bundle.min.js.map 342 KB ✅ OPTIONAL
    ├── bootstrap.esm.js            154 KB
    ├── bootstrap.esm.js.map        259 KB
    ├── bootstrap.esm.min.js         42 KB
    ├── bootstrap.esm.min.js.map    186 KB
    ├── bootstrap.js                154 KB
    ├── bootstrap.js.map            259 KB
    ├── bootstrap.min.js             42 KB
    └── bootstrap.min.js.map        186 KB
```

---

## ✅ Files to KEEP (Only 2-3 files needed!)

### CSS Files (Keep 1 file)

**✅ `css/bootstrap.min.css`** - 160 KB
- **Why:** Minified production-ready CSS with ALL Bootstrap components
- **Usage:** Main CSS file to load in plugin
- **Size:** Smallest production CSS with all features

### JavaScript Files (Keep 1-2 files)

**✅ `js/bootstrap.bundle.min.js`** - 81 KB
- **Why:** Minified JS with Popper.js bundled (needed for tooltips/dropdowns)
- **Usage:** Main JS file to load in plugin
- **Size:** Smallest production JS with all dependencies

**🔧 `js/bootstrap.bundle.min.js.map`** - 342 KB (OPTIONAL)
- **Why:** Source map for debugging (only useful during development)
- **Usage:** Helps debug Bootstrap JS issues in DevTools
- **Recommendation:** Keep during development, remove for production release

---

## ❌ Files to DELETE (42 files - save ~3.3 MB!)

### CSS Files to Delete (31 files)

#### Delete: Unminified versions (development only)
```
❌ bootstrap.css                    (328 KB) - Use .min.css instead
❌ bootstrap.rtl.css                (329 KB) - Use .min.css instead
❌ bootstrap-grid.css               ( 52 KB) - Not needed (using full Bootstrap)
❌ bootstrap-grid.rtl.css           ( 52 KB) - Not needed
❌ bootstrap-reboot.css             ( 12 KB) - Not needed (using full Bootstrap)
❌ bootstrap-reboot.rtl.css         ( 12 KB) - Not needed
❌ bootstrap-utilities.css          ( 76 KB) - Not needed (using full Bootstrap)
❌ bootstrap-utilities.rtl.css      ( 77 KB) - Not needed
```

#### Delete: Source maps (development debugging only)
```
❌ bootstrap.css.map                (505 KB)
❌ bootstrap.min.css.map            (392 KB) - Not needed unless debugging CSS
❌ bootstrap.rtl.css.map            (506 KB)
❌ bootstrap.rtl.min.css.map        (394 KB)
❌ bootstrap-grid.css.map           ( 62 KB)
❌ bootstrap-grid.min.css.map       ( 47 KB)
❌ bootstrap-grid.rtl.css.map       ( 62 KB)
❌ bootstrap-grid.rtl.min.css.map   ( 47 KB)
❌ bootstrap-reboot.css.map         ( 14 KB)
❌ bootstrap-reboot.min.css.map     ( 11 KB)
❌ bootstrap-reboot.rtl.css.map     ( 14 KB)
❌ bootstrap-reboot.rtl.min.css.map ( 11 KB)
❌ bootstrap-utilities.css.map      ( 91 KB)
❌ bootstrap-utilities.min.css.map  ( 72 KB)
❌ bootstrap-utilities.rtl.css.map  ( 91 KB)
❌ bootstrap-utilities.rtl.min.css.map (72 KB)
```

#### Delete: RTL (Right-to-Left) versions
```
❌ bootstrap.rtl.min.css            (161 KB) - Plugin uses LTR languages only
❌ bootstrap-grid.rtl.min.css       ( 26 KB)
❌ bootstrap-reboot.rtl.min.css     (  6 KB)
❌ bootstrap-utilities.rtl.min.css  ( 39 KB)
```

#### Delete: Partial builds (grid/reboot/utilities only)
```
❌ bootstrap-grid.min.css           ( 26 KB) - Using full Bootstrap instead
❌ bootstrap-reboot.min.css         (  6 KB) - Using full Bootstrap instead
❌ bootstrap-utilities.min.css      ( 38 KB) - Using full Bootstrap instead
```

### JavaScript Files to Delete (11 files)

#### Delete: Unminified versions
```
❌ bootstrap.bundle.js              (295 KB) - Use .min.js instead
❌ bootstrap.js                     (154 KB) - Missing Popper.js
❌ bootstrap.esm.js                 (154 KB) - ES Module version (not needed)
```

#### Delete: Source maps (except bundle.min.js.map if debugging)
```
❌ bootstrap.bundle.js.map          (445 KB)
❌ bootstrap.esm.js.map             (259 KB)
❌ bootstrap.esm.min.js.map         (186 KB)
❌ bootstrap.js.map                 (259 KB)
❌ bootstrap.min.js.map             (186 KB)
```

#### Delete: Non-bundle versions (missing Popper.js)
```
❌ bootstrap.min.js                 ( 42 KB) - Missing Popper.js dependency
❌ bootstrap.esm.min.js             ( 42 KB) - ES Module version
```

---

## 📂 Final Optimized Structure

After cleanup, you should have:

```
Movie Picture Stitching/vendor/bootstrap-5.3.8-dist/
├── css/
│   └── bootstrap.min.css           (160 KB) ✅
└── js/
    ├── bootstrap.bundle.min.js      ( 81 KB) ✅
    └── bootstrap.bundle.min.js.map  (342 KB) 🔧 Optional - delete for production
```

**Total Size:**
- **Production:** 241 KB (2 files only)
- **Development:** 583 KB (3 files with source map)
- **Original:** ~3.4 MB (44 files)
- **Space Saved:** ~3.2 MB (94% reduction!)

---

## 🔧 Quick Delete Commands

### Option 1: Keep Development Files (with source map)
```bash
cd "Movie Picture Stitching/vendor/bootstrap-5.3.8-dist"

# Delete unnecessary CSS files
cd css
rm bootstrap.css bootstrap.css.map
rm bootstrap.rtl.* bootstrap-grid.* bootstrap-reboot.* bootstrap-utilities.*
rm bootstrap.min.css.map
cd ..

# Delete unnecessary JS files
cd js
rm bootstrap.bundle.js bootstrap.bundle.js.map
rm bootstrap.js bootstrap.js.map bootstrap.min.js bootstrap.min.js.map
rm bootstrap.esm.*
cd ..
```

### Option 2: Production-Only (minimal size)
```bash
cd "Movie Picture Stitching/vendor/bootstrap-5.3.8-dist"

# Keep only these 2 files:
# css/bootstrap.min.css
# js/bootstrap.bundle.min.js

# Delete everything else
cd css
ls | grep -v "^bootstrap\.min\.css$" | xargs rm
cd ../js
ls | grep -v "^bootstrap\.bundle\.min\.js$" | xargs rm
cd ../..
```

### Option 3: Safe Manual Deletion (Recommended)

1. **Navigate to CSS folder:**
   ```bash
   cd "Movie Picture Stitching/vendor/bootstrap-5.3.8-dist/css"
   ```

2. **Keep only `bootstrap.min.css`**, delete all others:
   ```bash
   # On macOS/Linux
   find . -type f ! -name 'bootstrap.min.css' -delete
   
   # Or manually select and delete in Finder/File Explorer
   ```

3. **Navigate to JS folder:**
   ```bash
   cd ../js
   ```

4. **Keep only `bootstrap.bundle.min.js` (and optionally `.map`):**
   ```bash
   # Keep both files
   find . -type f ! -name 'bootstrap.bundle.min.js*' -delete
   
   # Or keep only .min.js (delete .map too)
   find . -type f ! -name 'bootstrap.bundle.min.js' -delete
   ```

---

## 📝 Update index.html

After cleanup, update your HTML to reference the correct files:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Movie Picture Stitching - Eagle Plugin</title>
  
  <!-- Bootstrap 5.3.8 CSS -->
  <link rel="stylesheet" href="vendor/bootstrap-5.3.8-dist/css/bootstrap.min.css">
  
  <!-- Custom CSS (load after Bootstrap) -->
  <link rel="stylesheet" href="css/index.css">
</head>
<body>
  <!-- Your plugin content -->
  
  <!-- Bootstrap 5.3.8 JS Bundle (includes Popper) -->
  <script src="vendor/bootstrap-5.3.8-dist/js/bootstrap.bundle.min.js"></script>
  
  <!-- Your plugin scripts -->
  <script src="js/i18n-manager.js"></script>
  <script src="js/modules/storage-manager.js"></script>
  <!-- ... rest of your scripts ... -->
</body>
</html>
```

---

## 🎯 File Explanation

### Why `bootstrap.min.css`?
- **Complete:** Contains all Bootstrap components (grid, forms, buttons, cards, utilities)
- **Minified:** Optimized for production (160KB vs 328KB unminified)
- **LTR:** Left-to-right layout (matches all plugin languages)

### Why `bootstrap.bundle.min.js`?
- **Complete:** Contains Bootstrap JS + Popper.js (for tooltips/dropdowns)
- **Minified:** Optimized for production (81KB vs 295KB unminified)
- **Self-contained:** No need to load Popper.js separately

### Why Delete RTL Files?
- **Plugin languages:** All 8 languages use left-to-right layout
  - English, Chinese (Simplified/Traditional), Japanese, Spanish, German, Korean, Russian
- **None use RTL:** Arabic/Hebrew not supported
- **Space savings:** 161KB per RTL file × 4 variants = 644KB saved

### Why Delete Grid/Reboot/Utilities Only?
- **Full Bootstrap:** Using complete `bootstrap.min.css` which includes all components
- **Partial builds:** Only useful if you need JUST grid or JUST utilities
- **Plugin needs:** Using forms, buttons, cards, navbar → need full Bootstrap

### Why Delete Source Maps?
- **Development tool:** Only helps debug Bootstrap's internal code
- **Production:** Users never see Bootstrap source code
- **Space:** Source maps are often 2-3x larger than the actual files
- **Optional:** Keep `bootstrap.bundle.min.js.map` (342KB) during development, delete before release

---

## 🚀 Verification Steps

After cleanup, verify the structure:

```bash
# Check final structure
tree "Movie Picture Stitching/vendor/bootstrap-5.3.8-dist"

# Should output:
# bootstrap-5.3.8-dist/
# ├── css/
# │   └── bootstrap.min.css
# └── js/
#     ├── bootstrap.bundle.min.js
#     └── bootstrap.bundle.min.js.map  (optional)

# Check file sizes
du -sh "Movie Picture Stitching/vendor/bootstrap-5.3.8-dist"
# Should be ~241KB (or ~583KB with source map)
```

Test in plugin:
1. Open Eagle
2. Load plugin
3. Open browser console (DevTools)
4. Check for errors:
   - ✅ No "404 Not Found" errors for Bootstrap files
   - ✅ Bootstrap classes work (check with `getComputedStyle`)
   - ✅ Bootstrap JS works (if using tooltips/modals)

---

## 📦 Alternative: Use Minimal Custom Build

If 241KB is still too large, consider creating a custom Bootstrap build with only needed components:

**Components Actually Used by Plugin:**
- Grid system (layout)
- Forms (inputs, selects)
- Buttons
- Cards
- Navbar
- Utilities (spacing, colors, display)

**Components NOT Used (can remove):**
- Accordion, Alerts, Badges, Breadcrumb, Button Group
- Carousel, Close Button, Collapse, Dropdowns
- List Group, Modal, Nav, Offcanvas, Pagination
- Placeholders, Popovers, Progress, Scrollspy
- Spinners, Toasts, Tooltips

**How to create custom build:**
1. Use Bootstrap's online customizer: https://getbootstrap.com/docs/5.3/customize/overview/
2. Or use SASS compilation with only needed imports
3. Potential size: ~80-100KB (50% smaller)

---

## ✅ Recommended Action

**For Now (Development Phase):**
```bash
Keep: bootstrap.min.css (160KB)
Keep: bootstrap.bundle.min.js (81KB)
Keep: bootstrap.bundle.min.js.map (342KB) - for debugging
Total: 583KB
```

**Before Production Release:**
```bash
Keep: bootstrap.min.css (160KB)
Keep: bootstrap.bundle.min.js (81KB)
Delete: bootstrap.bundle.min.js.map
Total: 241KB
```

**Space Saved:** 3.2 MB → 241 KB = **94% reduction!**

---

**Last Updated:** October 30, 2025  
**Bootstrap Version:** 5.3.8  
**Plugin:** Eagle Movie Picture Stitching
