# Keyboard Shortcuts Implementation TODO

**Feature:** Add keyboard shortcuts for common actions to improve power user workflow efficiency and accessibility.

**Status:** 📋 Planning Phase  
**Target Version:** 1.1.0  
**Estimated Effort:** 4-6 hours  
**Priority:** High (Significant UX improvement)

---

## 📑 Table of Contents
- [Overview](#overview)
- [Phase 1: Core Functionality (MVP)](#phase-1-core-functionality-mvp)
- [Phase 2: Discoverability & UX](#phase-2-discoverability--ux)
- [Phase 3: Advanced Features (Optional)](#phase-3-advanced-features-optional)
- [Testing Checklist](#testing-checklist)
- [i18n Requirements](#i18n-requirements)
- [Technical Specifications](#technical-specifications)

---

## Overview

### Goals
- ✅ Enable keyboard-only workflow for Preview → Save operations
- ✅ Improve accessibility (WCAG compliance)
- ✅ Reduce workflow time from 5-8s (mouse) to <3s (keyboard)
- ✅ Maintain consistency with Eagle's keyboard-first design language

### Key Requirements
- **CRITICAL:** Must not interfere with typing in input fields
- **CRITICAL:** Must not conflict with system shortcuts (Cmd+S, Cmd+W)
- **CRITICAL:** Must not conflict with Eagle shortcuts (Cmd+R reload)
- Must work cross-platform (macOS and Windows)
- Must be discoverable (visual hints + help documentation)
- Must support internationalization (8 languages)

### Shortcut Mapping (Final)

| Action | macOS | Windows | Priority |
|--------|-------|---------|----------|
| Preview | `⌘⇧P` | `Ctrl+Shift+P` | 🔴 Critical |
| Save to Eagle | `⌘⇧S` | `Ctrl+Shift+S` | 🔴 Critical |
| Help | `F1` | `F1` | 🟡 High |
| Pin Window | `⌘⇧T` | `Ctrl+Shift+T` | 🟢 Medium |
| Focus Top Crop | `Alt+1` | `Alt+1` | 🔵 Optional |
| Focus Bottom Crop | `Alt+2` | `Alt+2` | 🔵 Optional |
| Cycle Export Format | `Alt+F` | `Alt+F` | 🔵 Optional |

**Rationale for `Cmd+Shift+{Key}` pattern:**
- Avoids macOS system shortcuts (Cmd+S = Save, Cmd+W = Close)
- Avoids Eagle reserved shortcuts (Cmd+R = Reload plugin)
- Standard pattern for app-specific commands
- Requires two modifiers → prevents accidental triggers

---

## Phase 1: Core Functionality (MVP)
**Estimated Time:** 2-3 hours  
**Goal:** Basic keyboard shortcuts working without UI hints

### 1.1 Create KeyboardShortcutManager Module
**File:** `Movie Picture Stitching/js/modules/keyboard-shortcut-manager.js`

**Tasks:**
- [ ] Create new file with class structure
- [ ] Implement platform detection (macOS vs Windows)
  - Check `navigator.platform.toLowerCase().includes('mac')`
  - Store in `this.platform` property
- [ ] Create shortcut registry using `Map()` data structure
- [ ] Implement `registerShortcuts()` method
  ```javascript
  registerShortcuts() {
    // Preview: Cmd+Shift+P / Ctrl+Shift+P
    this.shortcuts.set('preview', {
      key: 'p',
      modifiers: { meta: true, shift: true, alt: false, ctrl: false },
      action: 'keyboard:previewRequested',
      description: 'ui.shortcuts.preview'
    });
    
    // Save: Cmd+Shift+S / Ctrl+Shift+S
    this.shortcuts.set('save', {
      key: 's',
      modifiers: { meta: true, shift: true, alt: false, ctrl: false },
      action: 'keyboard:saveRequested',
      description: 'ui.shortcuts.save'
    });
    
    // Help: F1
    this.shortcuts.set('help', {
      key: 'F1',
      modifiers: { meta: false, shift: false, alt: false, ctrl: false },
      action: 'keyboard:helpRequested',
      description: 'ui.shortcuts.help'
    });
  }
  ```

**Class Structure:**
```javascript
class KeyboardShortcutManager {
  constructor() {
    this.shortcuts = new Map();
    this.isEnabled = true;
    this.platform = this.detectPlatform();
  }

  initialize() {
    this.registerShortcuts();
    this.setupGlobalListener();
    console.log('[KeyboardShortcutManager] Initialized with platform:', this.platform);
  }

  detectPlatform() {
    // Returns 'mac' or 'windows'
  }

  registerShortcuts() {
    // Register all shortcuts
  }

  setupGlobalListener() {
    // Attach keydown listener to window
  }

  isInputFocused() {
    // Check if activeElement is INPUT/TEXTAREA/SELECT
  }

  matchShortcut(event) {
    // Compare event against registered shortcuts
  }

  getShortcutNotation(shortcutName) {
    // Returns "⌘⇧P" on Mac, "Ctrl+Shift+P" on Windows
  }

  cleanup() {
    // Remove event listeners
  }
}
```

### 1.2 Implement Global Keydown Listener
**Tasks:**
- [ ] Add `setupGlobalListener()` method
  ```javascript
  setupGlobalListener() {
    this.keydownHandler = (e) => {
      // CRITICAL: Ignore if typing in input field
      if (this.isInputFocused()) {
        return;
      }

      // Check if matches registered shortcut
      const shortcut = this.matchShortcut(e);
      if (shortcut) {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('[KeyboardShortcut] Triggered:', shortcut.action);
        
        // Dispatch CustomEvent for app to handle
        window.dispatchEvent(new CustomEvent(shortcut.action, {
          detail: { shortcut: shortcut.key }
        }));
      }
    };

    window.addEventListener('keydown', this.keydownHandler);
  }
  ```

### 1.3 Implement Input Focus Guard
**Tasks:**
- [ ] Add `isInputFocused()` method with comprehensive checks
  ```javascript
  isInputFocused() {
    const activeElement = document.activeElement;
    if (!activeElement) return false;

    const tagName = activeElement.tagName;
    const isContentEditable = activeElement.isContentEditable;

    // Check if focus is in form elements
    const isFormElement = ['INPUT', 'TEXTAREA', 'SELECT'].includes(tagName);
    
    return isFormElement || isContentEditable;
  }
  ```
- [ ] Test with all input types (number, range, text)

### 1.4 Implement Shortcut Matching Logic
**Tasks:**
- [ ] Add `matchShortcut(event)` method
  ```javascript
  matchShortcut(event) {
    for (const [name, config] of this.shortcuts) {
      const keyMatches = event.key.toLowerCase() === config.key.toLowerCase();
      
      // Platform-specific modifier mapping
      const metaKey = this.platform === 'mac' ? event.metaKey : event.ctrlKey;
      
      // Check all modifiers match
      const modifiersMatch = 
        metaKey === config.modifiers.meta &&
        event.shiftKey === config.modifiers.shift &&
        event.altKey === config.modifiers.alt &&
        event.ctrlKey === config.modifiers.ctrl;

      if (keyMatches && modifiersMatch) {
        return config;
      }
    }
    return null;
  }
  ```

### 1.5 Integrate with Main Application
**File:** `Movie Picture Stitching/js/plugin-modular.js`

**Tasks:**
- [ ] Import KeyboardShortcutManager in index.html
  ```html
  <!-- Add after other module imports -->
  <script src="js/modules/keyboard-shortcut-manager.js"></script>
  ```
- [ ] Initialize in constructor
  ```javascript
  constructor() {
    // ... existing code ...
    this.keyboardManager = new KeyboardShortcutManager();
  }
  ```
- [ ] Call initialize() in initialize() method
  ```javascript
  async initialize() {
    // ... existing initialization ...
    this.keyboardManager.initialize();
  }
  ```
- [ ] Add event listeners in `setupEventListeners()`
  ```javascript
  setupEventListeners() {
    // ... existing listeners ...

    // Keyboard shortcut events
    window.addEventListener('keyboard:previewRequested', () => {
      console.log('[App] Keyboard shortcut: Preview requested');
      this.handlePreviewClick();
    });

    window.addEventListener('keyboard:saveRequested', () => {
      console.log('[App] Keyboard shortcut: Save requested');
      this.handleSaveClick();
    });

    window.addEventListener('keyboard:helpRequested', () => {
      console.log('[App] Keyboard shortcut: Help requested');
      this.handleHelpClick();
    });
  }
  ```
- [ ] Add cleanup in `cleanup()` method
  ```javascript
  cleanup() {
    // ... existing cleanup ...
    if (this.keyboardManager) {
      this.keyboardManager.cleanup();
    }
  }
  ```

### 1.6 Add Cleanup Method
**File:** `keyboard-shortcut-manager.js`

**Tasks:**
- [ ] Implement cleanup() to remove event listeners
  ```javascript
  cleanup() {
    if (this.keydownHandler) {
      window.removeEventListener('keydown', this.keydownHandler);
      this.keydownHandler = null;
    }
    this.shortcuts.clear();
    console.log('[KeyboardShortcutManager] Cleaned up');
  }
  ```

### 1.7 Testing Phase 1
**Tasks:**
- [ ] Test Preview shortcut (`Cmd+Shift+P` on Mac, `Ctrl+Shift+P` on Windows)
- [ ] Test Save shortcut (`Cmd+Shift+S`)
- [ ] Test Help shortcut (`F1`)
- [ ] **CRITICAL:** Test shortcuts do NOT fire while typing in:
  - [ ] Top crop number input
  - [ ] Bottom crop number input
  - [ ] (Type "ps" and verify preview doesn't trigger)
- [ ] Test shortcuts work on macOS
- [ ] Test shortcuts work on Windows (if available)
- [ ] Test shortcuts are disabled when plugin loses focus
- [ ] Check DevTools console for proper logging

---

## Phase 2: Discoverability & UX
**Estimated Time:** 2-3 hours  
**Goal:** Users can easily discover and learn shortcuts

### 2.1 Add Shortcut Hints to Buttons
**File:** `Movie Picture Stitching/index.html`

**Tasks:**
- [ ] Update Preview button HTML
  ```html
  <button id="previewButton" class="btn btn-primary shadow-sm" type="button" style="min-width: 250px;">
    <span class="button-text" data-i18n="ui.buttons.preview">Preview</span>
    <span class="keyboard-hint text-muted ms-2" id="preview-shortcut-hint"></span>
  </button>
  ```
- [ ] Update Save button HTML
  ```html
  <button id="saveButton" class="btn btn-success shadow-sm" type="button" style="min-width: 250px;">
    <span class="button-text" data-i18n="ui.buttons.save">Save to Eagle</span>
    <span class="keyboard-hint text-muted ms-2" id="save-shortcut-hint"></span>
  </button>
  ```
- [ ] Update Help button HTML
  ```html
  <button id="helpButton" class="btn btn-sm btn-outline-info header-icon-btn" type="button">
    ❓
    <span class="keyboard-hint-tooltip" id="help-shortcut-hint"></span>
  </button>
  ```

### 2.2 Style Shortcut Hints
**File:** `Movie Picture Stitching/css/components/buttons.css`

**Tasks:**
- [ ] Add keyboard hint styles
  ```css
  /* Keyboard Shortcut Hints */
  .keyboard-hint {
    font-size: 0.75rem;
    opacity: 0.5;
    font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
    letter-spacing: 0.5px;
    font-weight: 400;
    transition: opacity 0.2s ease;
  }

  .btn:hover .keyboard-hint {
    opacity: 0.8;
  }

  .keyboard-hint-tooltip {
    position: absolute;
    bottom: -20px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 0.65rem;
    opacity: 0;
    transition: opacity 0.2s ease;
    pointer-events: none;
    white-space: nowrap;
  }

  .header-icon-btn:hover .keyboard-hint-tooltip {
    opacity: 0.6;
  }

  /* Platform-specific symbols */
  .keyboard-hint kbd {
    padding: 2px 5px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
    font-size: 0.7rem;
  }
  ```

### 2.3 Populate Shortcut Hints Dynamically
**File:** `keyboard-shortcut-manager.js`

**Tasks:**
- [ ] Add `getShortcutNotation()` method
  ```javascript
  getShortcutNotation(shortcutName) {
    const config = this.shortcuts.get(shortcutName);
    if (!config) return '';

    let notation = '';
    
    if (this.platform === 'mac') {
      if (config.modifiers.meta) notation += '⌘';
      if (config.modifiers.shift) notation += '⇧';
      if (config.modifiers.alt) notation += '⌥';
      if (config.modifiers.ctrl) notation += '⌃';
      notation += config.key.toUpperCase();
    } else {
      // Windows notation
      const parts = [];
      if (config.modifiers.meta) parts.push('Ctrl');
      if (config.modifiers.shift) parts.push('Shift');
      if (config.modifiers.alt) parts.push('Alt');
      parts.push(config.key.toUpperCase());
      notation = parts.join('+');
    }
    
    return notation;
  }
  ```
- [ ] Add `updateUIHints()` method to populate hint spans
  ```javascript
  updateUIHints() {
    // Preview button
    const previewHint = document.getElementById('preview-shortcut-hint');
    if (previewHint) {
      previewHint.textContent = `(${this.getShortcutNotation('preview')})`;
    }

    // Save button
    const saveHint = document.getElementById('save-shortcut-hint');
    if (saveHint) {
      saveHint.textContent = `(${this.getShortcutNotation('save')})`;
    }

    // Help button
    const helpHint = document.getElementById('help-shortcut-hint');
    if (helpHint) {
      helpHint.textContent = this.getShortcutNotation('help');
    }
  }
  ```
- [ ] Call `updateUIHints()` in `initialize()`

### 2.4 Create Help Modal Component
**File:** `Movie Picture Stitching/index.html`

**Tasks:**
- [ ] Add modal HTML before closing `</body>` tag
  ```html
  <!-- Keyboard Shortcuts Help Modal -->
  <div id="shortcuts-modal" class="modal fade" tabindex="-1" aria-labelledby="shortcuts-modal-title" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content bg-dark text-white border-secondary">
        <div class="modal-header border-secondary">
          <h5 class="modal-title" id="shortcuts-modal-title" data-i18n="ui.shortcuts.title">
            Keyboard Shortcuts
          </h5>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <table class="table table-dark table-sm">
            <thead>
              <tr>
                <th data-i18n="ui.shortcuts.actionColumn">Action</th>
                <th data-i18n="ui.shortcuts.shortcutColumn">Shortcut</th>
              </tr>
            </thead>
            <tbody id="shortcuts-table-body">
              <!-- Populated by JavaScript -->
            </tbody>
          </table>
        </div>
        <div class="modal-footer border-secondary">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" data-i18n="ui.buttons.close">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
  ```

### 2.5 Implement Help Modal Logic
**File:** `keyboard-shortcut-manager.js`

**Tasks:**
- [ ] Add `showHelpModal()` method
  ```javascript
  showHelpModal() {
    // Populate table body
    const tbody = document.getElementById('shortcuts-table-body');
    if (!tbody) return;

    tbody.innerHTML = '';

    // Add each shortcut to table
    for (const [name, config] of this.shortcuts) {
      const row = document.createElement('tr');
      
      const actionCell = document.createElement('td');
      actionCell.setAttribute('data-i18n', config.description);
      actionCell.textContent = config.description; // Fallback
      
      const shortcutCell = document.createElement('td');
      const kbd = document.createElement('kbd');
      kbd.className = 'keyboard-hint';
      kbd.textContent = this.getShortcutNotation(name);
      shortcutCell.appendChild(kbd);
      
      row.appendChild(actionCell);
      row.appendChild(shortcutCell);
      tbody.appendChild(row);
    }

    // Show modal using Bootstrap
    const modalElement = document.getElementById('shortcuts-modal');
    if (modalElement && typeof bootstrap !== 'undefined') {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }
  ```
- [ ] Update `registerShortcuts()` to include help shortcut trigger
  ```javascript
  // In setupGlobalListener, handle help action differently:
  if (shortcut.action === 'keyboard:helpRequested') {
    e.preventDefault();
    this.showHelpModal();
    return; // Don't dispatch event, handle directly
  }
  ```

### 2.6 Update Help Button Handler
**File:** `plugin-modular.js`

**Tasks:**
- [ ] Modify `handleHelpClick()` to show keyboard shortcuts modal
  ```javascript
  handleHelpClick() {
    console.log('[App] Help requested');
    
    // Show keyboard shortcuts modal
    if (this.keyboardManager) {
      this.keyboardManager.showHelpModal();
    } else {
      // Fallback if keyboard manager not initialized
      this.uiManager.showMessage('ui.messages.helpNotAvailable', {}, 'info', 3000);
    }
  }
  ```

### 2.7 Add First-Use Hint Toast
**File:** `plugin-modular.js`

**Tasks:**
- [ ] Add first-use hint in `initialize()` method
  ```javascript
  async initialize() {
    // ... existing initialization ...

    // Show keyboard shortcut hint on first use
    if (!localStorage.getItem('eagle-movie-stitching:shortcutHintShown')) {
      setTimeout(() => {
        const previewKey = this.keyboardManager.getShortcutNotation('preview');
        const saveKey = this.keyboardManager.getShortcutNotation('save');
        
        const message = window.i18nManager ? 
          window.i18nManager.t('ui.shortcuts.firstUseHint', { 
            preview: previewKey, 
            save: saveKey 
          }) :
          `Tip: Use ${previewKey} to preview, ${saveKey} to save. Press F1 for all shortcuts.`;
        
        this.uiManager.showToast(message, 'info', 8000);
        
        localStorage.setItem('eagle-movie-stitching:shortcutHintShown', 'true');
      }, 2000);
    }
  }
  ```

### 2.8 Style Help Modal
**File:** `Movie Picture Stitching/css/components/modal.css` (NEW FILE)

**Tasks:**
- [ ] Create new CSS file for modal styling
  ```css
  /* Keyboard Shortcuts Modal */
  #shortcuts-modal .modal-content {
    background: var(--gradient-card);
    backdrop-filter: var(--backdrop-blur);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  #shortcuts-modal .table {
    margin-bottom: 0;
  }

  #shortcuts-modal .table th {
    color: var(--color-accent-primary);
    font-weight: 600;
    border-bottom: 2px solid rgba(35, 134, 54, 0.3);
  }

  #shortcuts-modal .table td {
    vertical-align: middle;
    padding: 0.75rem;
  }

  #shortcuts-modal kbd {
    background: rgba(255, 255, 255, 0.1);
    padding: 4px 8px;
    border-radius: 4px;
    font-family: 'Monaco', 'Menlo', 'Consolas', monospace;
    font-size: 0.85rem;
    color: var(--color-accent-primary);
    border: 1px solid rgba(35, 134, 54, 0.3);
  }

  #shortcuts-modal .modal-header {
    background: rgba(35, 134, 54, 0.1);
  }

  #shortcuts-modal .modal-title {
    color: var(--color-accent-primary);
  }
  ```
- [ ] Import in index.html after other CSS files
  ```html
  <link rel="stylesheet" href="css/components/modal.css">
  ```

---

## Phase 3: Advanced Features (Optional)
**Estimated Time:** 1-2 hours  
**Goal:** Enhanced productivity features

### 3.1 Parameter Focus Shortcuts
**Tasks:**
- [ ] Add shortcuts to `registerShortcuts()`
  ```javascript
  // Focus Top Crop: Alt+1
  this.shortcuts.set('focusCropTop', {
    key: '1',
    modifiers: { meta: false, shift: false, alt: true, ctrl: false },
    action: 'keyboard:focusCropTop',
    description: 'ui.shortcuts.focusCropTop'
  });

  // Focus Bottom Crop: Alt+2
  this.shortcuts.set('focusCropBottom', {
    key: '2',
    modifiers: { meta: false, shift: false, alt: true, ctrl: false },
    action: 'keyboard:focusCropBottom',
    description: 'ui.shortcuts.focusCropBottom'
  });
  ```
- [ ] Add event listeners in `plugin-modular.js`
  ```javascript
  window.addEventListener('keyboard:focusCropTop', () => {
    const input = document.getElementById('cropTopPercent');
    if (input) {
      input.focus();
      input.select();
    }
  });

  window.addEventListener('keyboard:focusCropBottom', () => {
    const input = document.getElementById('cropBottomPercent');
    if (input) {
      input.focus();
      input.select();
    }
  });
  ```

### 3.2 Format Cycling Shortcut
**Tasks:**
- [ ] Add shortcut to `registerShortcuts()`
  ```javascript
  // Cycle Export Format: Alt+F
  this.shortcuts.set('cycleFormat', {
    key: 'f',
    modifiers: { meta: false, shift: false, alt: true, ctrl: false },
    action: 'keyboard:cycleFormat',
    description: 'ui.shortcuts.cycleFormat'
  });
  ```
- [ ] Implement cycling logic in `plugin-modular.js`
  ```javascript
  window.addEventListener('keyboard:cycleFormat', () => {
    const formats = ['jpg', 'webp', 'png'];
    const currentFormat = document.querySelector('input[name="exportFormat"]:checked')?.value;
    const currentIndex = formats.indexOf(currentFormat);
    const nextIndex = (currentIndex + 1) % formats.length;
    const nextFormat = formats[nextIndex];
    
    const nextRadio = document.getElementById(`format-${nextFormat}`);
    if (nextRadio) {
      nextRadio.checked = true;
      nextRadio.dispatchEvent(new Event('change', { bubbles: true }));
      
      // Show toast notification
      this.uiManager.showToast(
        `Format: ${nextFormat.toUpperCase()}`,
        'info',
        2000
      );
    }
  });
  ```

### 3.3 User-Customizable Shortcuts (Advanced)
**Tasks:**
- [ ] Add settings panel for shortcut customization
- [ ] Store custom shortcuts in localStorage
- [ ] Add reset to defaults button
- [ ] Validate custom shortcuts don't conflict

**Implementation Note:** This is complex - defer to future version if needed.

---

## Testing Checklist

### Functional Testing
- [ ] **Preview Shortcut (`Cmd+Shift+P` / `Ctrl+Shift+P`)**
  - [ ] Triggers preview generation
  - [ ] Shows loading state on button
  - [ ] Updates preview canvas
  - [ ] Enables save button after successful preview
  - [ ] Does NOT trigger while typing in input fields

- [ ] **Save Shortcut (`Cmd+Shift+S` / `Ctrl+Shift+S`)**
  - [ ] Only works after preview generated
  - [ ] Shows save processing state
  - [ ] Adds image to Eagle
  - [ ] Shows success toast
  - [ ] Does NOT trigger while typing

- [ ] **Help Shortcut (`F1`)**
  - [ ] Opens keyboard shortcuts modal
  - [ ] Modal displays all shortcuts correctly
  - [ ] Platform-specific notation shown (⌘ on Mac, Ctrl on Windows)
  - [ ] Modal can be closed with Escape key
  - [ ] Modal can be closed with X button

### Input Focus Guard Testing
- [ ] Type "p" in top crop input → Preview does NOT trigger
- [ ] Type "s" in bottom crop input → Save does NOT trigger
- [ ] Type "ps" quickly → Neither shortcut triggers
- [ ] Focus number input, press `Cmd+Shift+P` → Preview does NOT trigger
- [ ] Blur input field, press `Cmd+Shift+P` → Preview DOES trigger

### Platform Testing
- [ ] **macOS:**
  - [ ] `Cmd+Shift+P` triggers preview
  - [ ] `Cmd+Shift+S` triggers save
  - [ ] Shortcut hints show `⌘⇧P` notation
  - [ ] Modal shows Mac symbols (⌘, ⇧, ⌥, ⌃)

- [ ] **Windows:**
  - [ ] `Ctrl+Shift+P` triggers preview
  - [ ] `Ctrl+Shift+S` triggers save
  - [ ] Shortcut hints show `Ctrl+Shift+P` notation
  - [ ] Modal shows Windows notation (Ctrl+Shift+P)

### Conflict Testing
- [ ] `Cmd+R` still reloads plugin (not intercepted)
- [ ] `Cmd+W` still closes window (not intercepted)
- [ ] `Cmd+Q` still quits Eagle (not intercepted)
- [ ] No interference with browser DevTools shortcuts

### UI/UX Testing
- [ ] Shortcut hints visible on buttons
- [ ] Hints fade in on button hover
- [ ] Help modal renders correctly
- [ ] Modal table formatting correct
- [ ] First-use hint toast appears (on fresh localStorage)
- [ ] First-use hint only shows once

### i18n Testing
- [ ] Test all 8 languages:
  - [ ] English
  - [ ] Simplified Chinese (zh_CN)
  - [ ] Traditional Chinese (zh_TW)
  - [ ] Japanese (ja_JP)
  - [ ] Spanish (es_ES)
  - [ ] German (de_DE)
  - [ ] Korean (ko_KR)
  - [ ] Russian (ru_RU)
- [ ] Verify shortcut descriptions translate correctly
- [ ] Verify first-use hint translates with variables

### Performance Testing
- [ ] No lag when typing in inputs
- [ ] Shortcut response time < 50ms
- [ ] No memory leaks (check DevTools Memory profiler)
- [ ] Event listener properly cleaned up on plugin exit

### Edge Cases
- [ ] Plugin loses focus → Shortcuts disabled
- [ ] Plugin regains focus → Shortcuts re-enabled
- [ ] Multiple rapid keypresses don't trigger multiple actions
- [ ] Shortcuts work immediately after plugin load
- [ ] Shortcuts still work after parameter changes

---

## i18n Requirements

### Translation Keys to Add

**File:** `_locales/en.json`
```json
{
  "ui": {
    "shortcuts": {
      "title": "Keyboard Shortcuts",
      "actionColumn": "Action",
      "shortcutColumn": "Shortcut",
      "preview": "Preview",
      "save": "Save to Eagle",
      "help": "Help",
      "pin": "Pin Window",
      "close": "Close Window",
      "focusCropTop": "Focus Top Crop",
      "focusCropBottom": "Focus Bottom Crop",
      "cycleFormat": "Cycle Export Format",
      "firstUseHint": "Tip: Use {preview} to preview, {save} to save. Press F1 for all shortcuts."
    }
  }
}
```

### Translation Tasks
- [ ] Add English translations (template above)
- [ ] Translate to Simplified Chinese (zh_CN)
- [ ] Translate to Traditional Chinese (zh_TW)
- [ ] Translate to Japanese (ja_JP)
- [ ] Translate to Spanish (es_ES)
- [ ] Translate to German (de_DE)
- [ ] Translate to Korean (ko_KR)
- [ ] Translate to Russian (ru_RU)

### Platform-Specific Notation
**Do NOT translate these symbols:**
- macOS: `⌘` (Command), `⇧` (Shift), `⌥` (Option), `⌃` (Control)
- Windows: `Ctrl`, `Shift`, `Alt`

These are universal and should remain in English.

---

## Technical Specifications

### File Structure
```
Movie Picture Stitching/
├── index.html                           # Add modal HTML, shortcut hint spans
├── js/
│   ├── plugin-modular.js                # Integrate keyboard manager, add event listeners
│   └── modules/
│       └── keyboard-shortcut-manager.js # NEW FILE - Core shortcut logic
├── css/
│   └── components/
│       ├── buttons.css                  # Add keyboard hint styles
│       └── modal.css                    # NEW FILE - Modal styling
└── _locales/
    ├── en.json                          # Add shortcut translations
    ├── zh_CN.json                       # Add shortcut translations
    ├── zh_TW.json                       # Add shortcut translations
    ├── ja_JP.json                       # Add shortcut translations
    ├── es_ES.json                       # Add shortcut translations
    ├── de_DE.json                       # Add shortcut translations
    ├── ko_KR.json                       # Add shortcut translations
    └── ru_RU.json                       # Add shortcut translations
```

### Event-Driven Architecture
**CustomEvents Dispatched:**
- `keyboard:previewRequested` - User pressed preview shortcut
- `keyboard:saveRequested` - User pressed save shortcut
- `keyboard:helpRequested` - User pressed help shortcut (F1)
- `keyboard:focusCropTop` - User pressed Alt+1 (Phase 3)
- `keyboard:focusCropBottom` - User pressed Alt+2 (Phase 3)
- `keyboard:cycleFormat` - User pressed Alt+F (Phase 3)

**Event Flow:**
```
User Keypress
  ↓
KeyboardShortcutManager.keydownHandler
  ↓
Check isInputFocused() → Return if true
  ↓
matchShortcut(event) → Find matching shortcut config
  ↓
Dispatch CustomEvent (e.g., 'keyboard:previewRequested')
  ↓
MoviePictureStitchingApp event listener
  ↓
Call existing handler (e.g., handlePreviewClick())
```

### Platform Detection Logic
```javascript
detectPlatform() {
  const platform = navigator.platform.toLowerCase();
  
  // Check for macOS variants
  if (platform.includes('mac')) {
    return 'mac';
  }
  
  // Check for Windows variants
  if (platform.includes('win')) {
    return 'windows';
  }
  
  // Check for Linux (treat as Windows-style shortcuts)
  if (platform.includes('linux')) {
    return 'windows';
  }
  
  // Default to Windows for unknown platforms
  return 'windows';
}
```

### Modifier Key Mapping
**macOS:**
- `event.metaKey` → Command (⌘)
- `event.ctrlKey` → Control (⌃)
- `event.altKey` → Option (⌥)
- `event.shiftKey` → Shift (⇧)

**Windows:**
- `event.metaKey` → Windows key (not used)
- `event.ctrlKey` → Ctrl
- `event.altKey` → Alt
- `event.shiftKey` → Shift

**Cross-Platform Pattern:**
```javascript
const isModifierPressed = this.platform === 'mac' ? event.metaKey : event.ctrlKey;
```

### Cleanup Pattern
**CRITICAL:** Always cleanup event listeners in `cleanup()` to prevent memory leaks:
```javascript
cleanup() {
  // Remove keydown listener
  if (this.keydownHandler) {
    window.removeEventListener('keydown', this.keydownHandler);
    this.keydownHandler = null;
  }
  
  // Clear shortcuts map
  this.shortcuts.clear();
  
  // Mark as not enabled
  this.isEnabled = false;
}
```

### localStorage Keys
- `eagle-movie-stitching:shortcutHintShown` - Boolean, tracks if first-use hint shown

---

## Success Metrics

### Quantitative
- [ ] Preview→Save workflow time reduced from 5-8s to <3s
- [ ] 30%+ of users discover shortcuts within first week (track help modal opens)
- [ ] Zero reported conflicts with system/Eagle shortcuts
- [ ] 100% keyboard-only workflow possible (no mouse required)

### Qualitative
- [ ] Shortcut hints are discoverable (visible on buttons)
- [ ] Help modal is clear and well-formatted
- [ ] Platform-specific notation is accurate
- [ ] First-use hint is helpful, not annoying

---

## Known Limitations

1. **Cannot override system shortcuts** - macOS `Cmd+S` is reserved
2. **No customization in Phase 1-2** - Users cannot change shortcuts
3. **English-only symbols** - ⌘, Ctrl, Shift don't translate
4. **Requires focus** - Shortcuts only work when plugin window has focus
5. **No visual feedback** - Pressing shortcut doesn't show button press animation (future enhancement)

---

## Future Enhancements (Post-v1.1.0)

- [ ] Visual button press animation on shortcut trigger
- [ ] User-customizable shortcuts (settings panel)
- [ ] Cheatsheet overlay (press & hold Cmd/Ctrl)
- [ ] Accessibility mode with single-key shortcuts
- [ ] Shortcut conflicts detection and warnings
- [ ] Analytics tracking for shortcut usage patterns
- [ ] Undo/Redo shortcuts (Cmd+Z, Cmd+Shift+Z)
- [ ] Batch processing shortcuts (process next/previous image)

---

## References

- **Eagle Plugin API:** https://api.eagle.cool/plugin/introduction
- **Bootstrap 5 Modal:** https://getbootstrap.com/docs/5.3/components/modal/
- **MDN KeyboardEvent:** https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent
- **WCAG Keyboard Guidelines:** https://www.w3.org/WAI/WCAG21/Understanding/keyboard

---

## Changelog

### v1.0.0 (Current)
- No keyboard shortcuts

### v1.1.0 (Planned)
- ✅ Core shortcuts (Preview, Save, Help)
- ✅ Input focus guards
- ✅ Visual shortcut hints
- ✅ Help modal
- ✅ First-use hint toast
- ✅ Cross-platform support (macOS + Windows)
- ✅ 8-language i18n support

---

**Last Updated:** 2025-10-31  
**Document Version:** 1.0  
**Status:** Ready for Implementation
