# Keyboard Shortcuts Testing Guide

**Version:** 1.1.0  
**Feature:** Keyboard Shortcuts  
**Date:** 2025-10-31  
**Status:** Ready for Testing ✅

---

## 📋 Quick Testing Checklist

### Prerequisites
- [ ] Eagle desktop app installed
- [ ] Plugin copied to Eagle plugins directory
- [ ] Plugin enabled in Eagle Settings → Plugins
- [ ] At least 2-3 images selected in Eagle

### Installation (macOS)
```bash
# Copy plugin to Eagle plugins directory
cp -r "Movie Picture Stitching/" ~/Library/Application\ Support/Eagle/plugins/

# Or import via Eagle UI:
# Eagle → Settings → Plugins → Developer → Import Local Project
```

---

## 🧪 Test Suite

### Test 1: Core Shortcuts Functionality ⌨️

#### 1.1 Preview Shortcut (`⌘⇧P` / `Ctrl+Shift+P`)
- [ ] **Setup:** Select 2-3 images in Eagle, open plugin
- [ ] **Action:** Press `Cmd+Shift+P` (macOS) or `Ctrl+Shift+P` (Windows)
- [ ] **Expected:** Preview button activates, shows "Processing...", generates preview image
- [ ] **Expected:** Save button becomes enabled after preview completes
- [ ] **Expected:** Console logs: `[KeyboardShortcut] Triggered: keyboard:previewRequested`

#### 1.2 Save Shortcut (`⌘⇧S` / `Ctrl+Shift+S`)
- [ ] **Setup:** Generate preview first (Test 1.1)
- [ ] **Action:** Press `Cmd+Shift+S`
- [ ] **Expected:** Save process starts, shows "Saving..." toast
- [ ] **Expected:** Success toast appears: "Image saved successfully!"
- [ ] **Expected:** Saved image appears in Eagle current folder
- [ ] **Expected:** Console logs: `[KeyboardShortcut] Triggered: keyboard:saveRequested`

**Edge Case: Save Before Preview**
- [ ] **Setup:** Reload plugin (`Cmd+R`), do NOT generate preview
- [ ] **Action:** Press `Cmd+Shift+S`
- [ ] **Expected:** Warning toast: "Please click preview button to generate image first"
- [ ] **Expected:** Save button shows shake animation

#### 1.3 Help Shortcut (`F1`)
- [ ] **Action:** Press `F1` key
- [ ] **Expected:** Modal opens with title "Keyboard Shortcuts"
- [ ] **Expected:** Table displays 4 shortcuts: Preview, Save, Help, Pin
- [ ] **Expected:** Platform-specific notation shown (⌘⇧P on Mac, Ctrl+Shift+P on Windows)
- [ ] **Expected:** Console logs: `[KeyboardShortcutManager] Help modal shown`

**Modal Interaction**
- [ ] Press `Esc` → Modal closes
- [ ] Click `×` button → Modal closes
- [ ] Click outside modal → Modal closes
- [ ] Click "Close" button → Modal closes

#### 1.4 Pin Window Shortcut (`⌘⇧T` / `Ctrl+Shift+T`)
- [ ] **Action:** Press `Cmd+Shift+T`
- [ ] **Expected:** Pin button (📌) changes color to gold (#ffd700)
- [ ] **Expected:** Window stays on top of other windows
- [ ] **Expected:** Console logs: `[KeyboardShortcut] Triggered: keyboard:pinRequested`
- [ ] **Action:** Press `Cmd+Shift+T` again
- [ ] **Expected:** Pin button returns to normal color
- [ ] **Expected:** Window no longer stays on top

---

### Test 2: Input Focus Guard 🛡️

**CRITICAL:** Shortcuts must NOT fire while typing in input fields

#### 2.1 Number Input Focus
- [ ] **Setup:** Click on "Top Crop Height" number input
- [ ] **Action:** Type "85" (contains 'p' and 's')
- [ ] **Expected:** Input value becomes "85"
- [ ] **Expected:** Preview shortcut does NOT trigger
- [ ] **Expected:** Save shortcut does NOT trigger
- [ ] **Expected:** No console logs from keyboard shortcuts

#### 2.2 Blur and Re-test
- [ ] **Setup:** Click outside the number input (blur it)
- [ ] **Action:** Press `Cmd+Shift+P`
- [ ] **Expected:** Preview DOES trigger now
- [ ] **Verification:** Console shows: `[KeyboardShortcut] Triggered: keyboard:previewRequested`

#### 2.3 Slider Focus
- [ ] **Setup:** Click and drag "Bottom Crop Height" slider
- [ ] **Action:** While dragging, try pressing shortcuts
- [ ] **Expected:** Shortcuts should still work (slider is not an INPUT element)

---

### Test 3: UI/UX Elements 🎨

#### 3.1 Shortcut Hints on Buttons
- [ ] **Preview Button:** Check if text shows `(⌘⇧P)` or `(Ctrl+Shift+P)` in gray text
- [ ] **Save Button:** Check if text shows `(⌘⇧S)` or `(Ctrl+Shift+S)` in gray text
- [ ] **Hover:** Hover over buttons → Hint text should become more visible (opacity 0.8)

#### 3.2 Help Button Tooltip
- [ ] **Action:** Hover over Help button (❓)
- [ ] **Expected:** Small tooltip appears below showing "F1" in monospace font
- [ ] **Expected:** Tooltip fades in smoothly (opacity 0.6)

#### 3.3 First-Use Hint Toast
- [ ] **Setup:** Clear localStorage: Open DevTools Console, run:
  ```javascript
  localStorage.removeItem('eagle-movie-stitching:shortcutHintShown');
  ```
- [ ] **Action:** Reload plugin (`Cmd+R`)
- [ ] **Expected:** After 2 seconds, blue info toast appears
- [ ] **Expected:** Message shows: "Tip: Use ⌘⇧P to preview, ⌘⇧S to save. Press F1 for all shortcuts."
- [ ] **Expected:** Toast auto-dismisses after 8 seconds
- [ ] **Action:** Reload plugin again (`Cmd+R`)
- [ ] **Expected:** Toast does NOT appear (shown only once)

---

### Test 4: Platform Detection 🖥️

#### 4.1 macOS
- [ ] Shortcut hints show Apple symbols: `⌘` `⇧`
- [ ] Console shows: `[KeyboardShortcutManager] Initialized with platform: mac`
- [ ] Help modal shortcuts display: `⌘⇧P`, `⌘⇧S`, `⌘⇧T`
- [ ] Pressing `Cmd+Shift+P` triggers preview (not `Ctrl+Shift+P`)

#### 4.2 Windows (if available)
- [ ] Shortcut hints show: `Ctrl+Shift+P`, `Ctrl+Shift+S`
- [ ] Console shows: `[KeyboardShortcutManager] Initialized with platform: windows`
- [ ] Help modal shortcuts display: `Ctrl+Shift+P`, `Ctrl+Shift+S`, `Ctrl+Shift+T`
- [ ] Pressing `Ctrl+Shift+P` triggers preview (not `Cmd+Shift+P`)

---

### Test 5: Internationalization (i18n) 🌍

**Test all 8 languages:**

#### English (en)
- [ ] Change Eagle language to English
- [ ] Reload plugin
- [ ] Press `F1`
- [ ] Verify modal title: "Keyboard Shortcuts"
- [ ] Verify table headers: "Action" | "Shortcut"
- [ ] Verify actions: "Preview", "Save to Eagle", "Help", "Pin Window"

#### Simplified Chinese (zh_CN)
- [ ] Change Eagle language to 简体中文
- [ ] Reload plugin
- [ ] Press `F1`
- [ ] Verify modal title: "键盘快捷键"
- [ ] Verify actions: "预览", "保存到 Eagle", "帮助", "窗口置顶"

#### Traditional Chinese (zh_TW)
- [ ] Change Eagle language to 繁體中文
- [ ] Reload plugin
- [ ] Press `F1`
- [ ] Verify modal title: "鍵盤快捷鍵"
- [ ] Verify actions: "預覽", "儲存到 Eagle", "幫助", "視窗置頂"

#### Japanese (ja_JP)
- [ ] Change Eagle language to 日本語
- [ ] Reload plugin
- [ ] Press `F1`
- [ ] Verify modal title: "キーボードショートカット"
- [ ] Verify actions: "プレビュー", "Eagle に保存", "ヘルプ", "ウィンドウを固定"

#### Spanish (es_ES)
- [ ] Change Eagle language to Español
- [ ] Reload plugin
- [ ] Press `F1`
- [ ] Verify modal title: "Atajos de Teclado"
- [ ] Verify actions: "Vista Previa", "Guardar en Eagle", "Ayuda", "Fijar Ventana"

#### German (de_DE)
- [ ] Change Eagle language to Deutsch
- [ ] Reload plugin
- [ ] Press `F1`
- [ ] Verify modal title: "Tastaturkürzel"
- [ ] Verify actions: "Vorschau", "In Eagle Speichern", "Hilfe", "Fenster Anheften"

#### Korean (ko_KR)
- [ ] Change Eagle language to 한국어
- [ ] Reload plugin
- [ ] Press `F1`
- [ ] Verify modal title: "키보드 단축키"
- [ ] Verify actions: "미리보기", "Eagle에 저장", "도움말", "창 고정"

#### Russian (ru_RU)
- [ ] Change Eagle language to Русский
- [ ] Reload plugin
- [ ] Press `F1`
- [ ] Verify modal title: "Горячие Клавиши"
- [ ] Verify actions: "Предпросмотр", "Сохранить в Eagle", "Справка", "Закрепить Окно"

---

### Test 6: Conflict Detection ⚠️

#### 6.1 System Shortcuts (Should NOT Be Intercepted)
- [ ] Press `Cmd+R` (macOS) / `Ctrl+R` (Windows)
- [ ] **Expected:** Plugin reloads (Eagle's shortcut, not plugin's)
- [ ] **Expected:** No interference from plugin

- [ ] Press `Cmd+W` (macOS) / `Ctrl+W` (Windows)
- [ ] **Expected:** Plugin window closes (browser/system shortcut)

- [ ] Press `Cmd+Q` (macOS) / `Alt+F4` (Windows)
- [ ] **Expected:** Eagle quits (system shortcut)

#### 6.2 DevTools Shortcuts (Should Work)
- [ ] Press `Cmd+Option+I` (macOS) / `F12` (Windows)
- [ ] **Expected:** DevTools open
- [ ] Press `Cmd+Shift+P` with DevTools focused
- [ ] **Expected:** DevTools command palette opens (DevTools has priority when focused)

---

### Test 7: Edge Cases 🔬

#### 7.1 Rapid Keypresses
- [ ] **Action:** Press `Cmd+Shift+P` multiple times quickly (5 times in 1 second)
- [ ] **Expected:** Preview only triggers once
- [ ] **Expected:** Button shows loading state, prevents duplicate triggers

#### 7.2 Plugin Loses Focus
- [ ] **Setup:** Open plugin, click on Eagle main window
- [ ] **Action:** Press `Cmd+Shift+P` while Eagle main window has focus
- [ ] **Expected:** Plugin shortcuts do NOT trigger
- [ ] **Action:** Click back on plugin window
- [ ] **Action:** Press `Cmd+Shift+P`
- [ ] **Expected:** Preview triggers normally

#### 7.3 Shortcuts After Parameter Changes
- [ ] **Action:** Change "Top Crop Height" to 50%
- [ ] **Action:** Press `Cmd+Shift+P`
- [ ] **Expected:** Preview generates with new parameters
- [ ] **Expected:** Shortcuts still work correctly

#### 7.4 Cleanup on Plugin Close
- [ ] **Action:** Close plugin window
- [ ] **Expected:** Console shows: `[KeyboardShortcutManager] Cleaned up`
- [ ] **Expected:** No error messages
- [ ] **Action:** Reopen plugin
- [ ] **Expected:** Shortcuts work normally again

---

### Test 8: Performance 🚀

#### 8.1 Typing Performance
- [ ] **Action:** Focus number input, type quickly: "123456789"
- [ ] **Expected:** All characters appear immediately, no lag
- [ ] **Expected:** Input focus guard check is fast (< 1ms)

#### 8.2 Shortcut Response Time
- [ ] **Setup:** Open DevTools Console, run:
  ```javascript
  performance.mark('shortcut-start');
  ```
- [ ] **Action:** Press `Cmd+Shift+P`
- [ ] **Action:** In console, run:
  ```javascript
  performance.mark('shortcut-end');
  performance.measure('shortcut-latency', 'shortcut-start', 'shortcut-end');
  performance.getEntriesByType('measure')[0].duration;
  ```
- [ ] **Expected:** Duration < 50ms

#### 8.3 Memory Leaks
- [ ] **Setup:** Open DevTools → Memory tab
- [ ] **Action:** Take heap snapshot
- [ ] **Action:** Open/close plugin 10 times
- [ ] **Action:** Take another heap snapshot
- [ ] **Expected:** Memory delta < 5MB
- [ ] **Expected:** Event listeners are properly cleaned up

---

## 🐛 Common Issues & Solutions

### Issue 1: Shortcuts Not Working
**Symptoms:** Pressing shortcuts does nothing

**Debug Steps:**
1. Open DevTools Console (`Cmd+Option+I`)
2. Check for initialization message:
   ```
   [KeyboardShortcutManager] Initialized with platform: mac
   [KeyboardShortcutManager] Registered 4 shortcuts
   [KeyboardShortcutManager] Global keydown listener attached
   ```
3. If missing, check for JavaScript errors
4. Verify `keyboard-shortcut-manager.js` is loaded in Network tab

**Solution:**
- Reload plugin (`Cmd+R`)
- If still not working, disable and re-enable plugin in Eagle Settings

### Issue 2: Shortcuts Fire While Typing
**Symptoms:** Preview triggers when typing "p" in input field

**Debug Steps:**
1. Console should show: `[KeyboardShortcut] Triggered: keyboard:previewRequested`
2. Check if input has focus: `document.activeElement.tagName` → Should be "INPUT"

**Solution:**
- This is a bug! Check `isInputFocused()` method in `keyboard-shortcut-manager.js`
- Expected code:
  ```javascript
  isInputFocused() {
    const activeElement = document.activeElement;
    return ['INPUT', 'TEXTAREA', 'SELECT'].includes(activeElement?.tagName);
  }
  ```

### Issue 3: Help Modal Not Showing
**Symptoms:** Pressing F1 does nothing

**Debug Steps:**
1. Check console for errors
2. Verify modal HTML exists: `document.getElementById('shortcuts-modal')`
3. Check Bootstrap is loaded: `typeof bootstrap !== 'undefined'`

**Solution:**
- Ensure `modal.css` is loaded
- Ensure Bootstrap 5.3.8 is loaded before plugin JavaScript
- Clear browser cache and reload

### Issue 4: Wrong Platform Symbols
**Symptoms:** Shows `Ctrl+Shift+P` on macOS or vice versa

**Debug Steps:**
1. Check console: `[KeyboardShortcutManager] Initialized with platform: ???`
2. Check `navigator.platform`: Run in console:
   ```javascript
   navigator.platform.toLowerCase()
   ```

**Solution:**
- Should show "macintel" on macOS, "win32" on Windows
- If wrong, check `detectPlatform()` method logic

### Issue 5: First-Use Hint Shows Every Time
**Symptoms:** Toast appears on every plugin load

**Debug Steps:**
1. Check localStorage: Run in console:
   ```javascript
   localStorage.getItem('eagle-movie-stitching:shortcutHintShown')
   ```
2. Should return `"true"` after first load

**Solution:**
- Check if localStorage is enabled
- Check if `showFirstUseHint()` properly sets the flag
- Clear and test: `localStorage.removeItem('eagle-movie-stitching:shortcutHintShown')`

---

## 📊 Test Results Template

```markdown
## Test Results - Keyboard Shortcuts v1.1.0

**Tester:** [Your Name]
**Date:** [Date]
**Platform:** macOS 14.x / Windows 11
**Eagle Version:** [Version]

### Core Functionality
- [ ] ✅ Preview shortcut (Cmd+Shift+P)
- [ ] ✅ Save shortcut (Cmd+Shift+S)
- [ ] ✅ Help shortcut (F1)
- [ ] ✅ Pin shortcut (Cmd+Shift+T)

### Input Focus Guard
- [ ] ✅ Shortcuts disabled while typing in inputs
- [ ] ✅ Shortcuts work after blurring input

### UI/UX
- [ ] ✅ Shortcut hints visible on buttons
- [ ] ✅ Help modal displays correctly
- [ ] ✅ First-use toast appears once

### i18n (Languages Tested)
- [ ] ✅ English
- [ ] ✅ Simplified Chinese
- [ ] ⚠️ Japanese (minor translation issue)
- [ ] ❌ Spanish (modal not translating)

### Issues Found
1. [Description of issue]
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable

### Overall Assessment
- **Status:** Pass / Fail / Pass with Minor Issues
- **Recommendation:** Ready for Release / Needs Fixes
```

---

## 🎯 Success Criteria

**Feature is considered READY when:**
- ✅ All 4 core shortcuts work correctly
- ✅ Input focus guard prevents false triggers
- ✅ Help modal displays all shortcuts
- ✅ First-use hint shows once
- ✅ All 8 languages translate correctly
- ✅ No conflicts with system/Eagle shortcuts
- ✅ No memory leaks detected
- ✅ Zero JavaScript errors in console

---

**Happy Testing! 🚀**

For issues or questions, check:
- `docs/KEYBOARD_SHORTCUTS_TODO.md` - Implementation details
- `.github/copilot-instructions.md` - Architecture documentation
- Console logs - Debug information
