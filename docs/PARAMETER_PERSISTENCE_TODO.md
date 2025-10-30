# Parameter Persistence Implementation - TODO Document

## 📋 Executive Summary

**Objective:** Implement automatic saving and restoration of user-adjusted parameters so that when users reopen the plugin after closing it, their last settings are preserved.

**Current Problem:** All parameters reset to defaults (cropTop: 0%, cropBottom: 0%, format: JPG, quality: 0.92) every time the plugin is opened.

**Desired Behavior:** Plugin remembers and restores the last used parameters automatically.

---

## 🎯 Feature Requirements

### Functional Requirements
1. **Auto-Save Parameters:** Save parameters automatically when users adjust them
2. **Auto-Restore Parameters:** Load saved parameters when plugin initializes
3. **Fallback to Defaults:** Use default values if no saved parameters exist
4. **Storage Scope:** Parameters should persist across plugin sessions
5. **No User Action Required:** Completely transparent to users (no save/load buttons)

### Parameters to Persist
- `cropTopPercent` (0-99)
- `cropBottomPercent` (0-99)
- `exportFormat` ('jpg', 'png', 'webp')
- `exportQuality` (0.1-1.0)

### Non-Functional Requirements
- **Performance:** Loading/saving should not block UI (<10ms)
- **Data Safety:** Validate loaded data before applying
- **Backward Compatibility:** Plugin should work if storage is unavailable
- **Privacy:** Store data locally only (no external transmission)

---

## 🏗️ Architecture Design

### Storage Technology Selection

**Option 1: Browser localStorage (Recommended)**
- ✅ Persistent across sessions
- ✅ Simple API (synchronous)
- ✅ No external dependencies
- ✅ ~5-10MB storage limit (more than enough)
- ✅ Supported in all modern browsers
- ⚠️ Storage is per-origin (Eagle plugin environment)

**Option 2: Eagle Plugin Storage API**
- ❌ Not documented in current Eagle API
- ❌ Unknown if Eagle provides plugin-specific storage

**Option 3: File-based Storage (JSON file)**
- ⚠️ More complex (requires fs module)
- ⚠️ Need to manage file paths
- ⚠️ Slower than localStorage
- ✅ Good for large datasets (not needed here)

**Decision: Use localStorage with namespace prefix**

### Storage Schema

```javascript
// Storage key naming convention
const STORAGE_PREFIX = 'eagle-movie-stitching:';

// Individual keys
{
  'eagle-movie-stitching:cropTopPercent': '85',
  'eagle-movie-stitching:cropBottomPercent': '5',
  'eagle-movie-stitching:exportFormat': 'jpg',
  'eagle-movie-stitching:exportQuality': '0.92',
  'eagle-movie-stitching:lastSaved': '2025-10-30T10:30:00.000Z'  // metadata
}

// Alternative: Single key with JSON object (Not recommended for this use case)
{
  'eagle-movie-stitching:params': '{"cropTopPercent":85,...}'
}
```

**Recommendation:** Use individual keys for easier debugging and partial updates.

---

## 📐 Implementation Plan

### Phase 1: Core Storage Module (New File)

**File:** `js/modules/storage-manager.js`

**Responsibilities:**
1. Provide clean API for saving/loading parameters
2. Handle localStorage availability checks
3. Validate data integrity
4. Provide fallback mechanisms
5. Handle storage errors gracefully

**Class Structure:**
```javascript
class StorageManager {
  constructor(storagePrefix = 'eagle-movie-stitching:');
  
  // Core methods
  saveParameter(key, value);           // Save single parameter
  loadParameter(key, defaultValue);    // Load single parameter
  saveAllParameters(params);           // Save all at once
  loadAllParameters();                 // Load all parameters
  clearAllParameters();                // Reset to defaults
  
  // Utility methods
  isStorageAvailable();                // Check localStorage availability
  validateParameter(key, value);       // Validate parameter before saving
  getStorageInfo();                    // Debug info (size, keys, etc.)
}
```

### Phase 2: Parameter Manager Integration

**File:** `js/modules/parameter-manager.js` (Modifications)

**Changes Required:**

1. **Constructor Enhancement:**
   - Initialize StorageManager instance
   - Load saved parameters on construction
   - Apply loaded values to defaults

2. **Auto-Save Trigger:**
   - Save parameters whenever `getParams()` is called AND values change
   - Debounce saves to avoid excessive writes (300ms delay)

3. **New Methods:**
   - `loadSavedParameters()` - Load from storage on init
   - `saveCurrentParameters(params)` - Save to storage
   - `resetToDefaults()` - Clear storage and reset UI

**Implementation Details:**
```javascript
class ParameterManager {
  constructor() {
    this.storageManager = new StorageManager();
    this.defaultParams = { /* ... */ };
    this.lastSavedParams = null;  // Track to avoid redundant saves
    this.savePending = false;     // Debounce flag
    
    // Load saved parameters on construction
    this.loadSavedParameters();
  }
  
  loadSavedParameters() {
    // Load from storage and apply to DOM
  }
  
  saveCurrentParameters(params) {
    // Debounced save to localStorage
  }
  
  getParams(adjustingElement = null) {
    const params = /* existing logic */;
    
    // Trigger save if parameters changed
    this.saveCurrentParameters(params);
    
    return params;
  }
}
```

### Phase 3: UI Integration

**File:** `js/modules/ui-manager.js` (Modifications)

**Changes Required:**

1. **Event Listener Enhancement:**
   - Trigger save on parameter change events
   - No UI changes needed (transparent to users)

2. **Optional: Visual Feedback (Future Enhancement):**
   - Small "Settings saved" toast notification (optional)
   - Parameter indicator showing "last saved time" (optional)

### Phase 4: Main Application Integration

**File:** `js/plugin-modular.js` (Modifications)

**Changes Required:**

1. **Initialize Order:**
   - Ensure ParameterManager loads parameters BEFORE rendering UI
   - Update initial rendering to use loaded values

2. **Add Storage Manager Import:**
   - Include `storage-manager.js` in HTML before `parameter-manager.js`

3. **Cleanup Enhancement:**
   - Optional: Save parameters one final time on cleanup
   - Clear any pending save operations

### Phase 5: HTML Updates

**File:** `Movie Picture Stitching/index.html`

**Changes Required:**

1. **Script Loading Order:**
   ```html
   <!-- Add before parameter-manager.js -->
   <script type="text/javascript" src="js/modules/storage-manager.js"></script>
   ```

2. **No UI Changes:** Feature is completely transparent to users

---

## 🔧 Detailed Implementation Tasks

### Task 1: Create StorageManager Module
**Estimated Time:** 2-3 hours

**Subtasks:**
- [ ] Create `js/modules/storage-manager.js`
- [ ] Implement `isStorageAvailable()` with try-catch for quota errors
- [ ] Implement `saveParameter(key, value)` with validation
- [ ] Implement `loadParameter(key, defaultValue)` with type checking
- [ ] Implement `saveAllParameters(params)` batch save
- [ ] Implement `loadAllParameters()` batch load
- [ ] Add parameter validation logic for each parameter type
- [ ] Add error handling for storage quota exceeded
- [ ] Add JSDoc comments for all methods
- [ ] Add module export for browser/Node.js environments

**Validation Rules:**
```javascript
validateParameter(key, value) {
  switch(key) {
    case 'cropTopPercent':
    case 'cropBottomPercent':
      return Number.isFinite(value) && value >= 0 && value <= 99;
    case 'exportQuality':
      return Number.isFinite(value) && value >= 0.1 && value <= 1.0;
    case 'exportFormat':
      return ['jpg', 'png', 'webp'].includes(value);
    default:
      return false;
  }
}
```

**Error Handling:**
```javascript
saveParameter(key, value) {
  try {
    if (!this.isStorageAvailable()) {
      console.warn('localStorage not available, parameter not saved');
      return false;
    }
    
    if (!this.validateParameter(key, value)) {
      console.warn(`Invalid parameter: ${key}=${value}`);
      return false;
    }
    
    localStorage.setItem(this.storagePrefix + key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error('Storage save failed:', error);
    return false;
  }
}
```

---

### Task 2: Modify ParameterManager
**Estimated Time:** 2-3 hours

**Subtasks:**
- [ ] Import StorageManager in constructor
- [ ] Implement `loadSavedParameters()` method
- [ ] Call `loadSavedParameters()` in constructor
- [ ] Apply loaded values to DOM elements in `loadSavedParameters()`
- [ ] Implement `saveCurrentParameters(params)` with debouncing
- [ ] Add debounce mechanism (300ms delay)
- [ ] Track `lastSavedParams` to avoid redundant saves
- [ ] Integrate save trigger in `getParams()` method
- [ ] Add `resetToDefaults()` method for future use
- [ ] Test with missing DOM elements (early initialization)
- [ ] Add logging for debugging (removable in production)

**LoadSavedParameters Implementation:**
```javascript
loadSavedParameters() {
  if (!this.storageManager.isStorageAvailable()) {
    console.log('Storage not available, using default parameters');
    return;
  }
  
  // Load each parameter with defaults as fallback
  const savedParams = {
    cropTopPercent: this.storageManager.loadParameter('cropTopPercent', this.defaultParams.cropTopPercent),
    cropBottomPercent: this.storageManager.loadParameter('cropBottomPercent', this.defaultParams.cropBottomPercent),
    exportFormat: this.storageManager.loadParameter('exportFormat', this.defaultParams.exportFormat),
    exportQuality: this.storageManager.loadParameter('exportQuality', this.defaultParams.exportQuality)
  };
  
  // Apply to DOM (must wait for DOM ready)
  this.applyParametersToDOM(savedParams);
  
  console.log('Loaded saved parameters:', savedParams);
}

applyParametersToDOM(params) {
  // Wait for DOM if needed
  const applyValues = () => {
    const elements = {
      cropTop: document.getElementById('cropTopPercent'),
      cropBottom: document.getElementById('cropBottomPercent'),
      exportFormat: document.getElementById('exportFormat'),
      exportQuality: document.getElementById('exportQuality')
    };
    
    if (elements.cropTop) elements.cropTop.value = params.cropTopPercent;
    if (elements.cropBottom) elements.cropBottom.value = params.cropBottomPercent;
    if (elements.exportFormat) elements.exportFormat.value = params.exportFormat;
    if (elements.exportQuality) elements.exportQuality.value = params.exportQuality;
    
    // Update remaining values display
    this.updateRemainingValues();
  };
  
  // Execute immediately if DOM ready, otherwise wait
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyValues);
  } else {
    applyValues();
  }
}

saveCurrentParameters(params) {
  // Check if parameters actually changed
  if (JSON.stringify(params) === JSON.stringify(this.lastSavedParams)) {
    return; // No changes, skip save
  }
  
  // Debounce save operation
  if (this.savePending) {
    clearTimeout(this.saveTimeout);
  }
  
  this.savePending = true;
  this.saveTimeout = setTimeout(() => {
    this.storageManager.saveAllParameters(params);
    this.lastSavedParams = { ...params };
    this.savePending = false;
    console.log('Parameters saved to storage');
  }, 300); // 300ms debounce
}
```

---

### Task 3: Update HTML Script Loading
**Estimated Time:** 15 minutes

**Subtasks:**
- [ ] Add `<script>` tag for `storage-manager.js`
- [ ] Ensure correct loading order (before parameter-manager.js)
- [ ] Test script loading in Eagle environment
- [ ] Verify no console errors on initialization

**HTML Changes:**
```html
<!-- In index.html, in the scripts section -->

<!-- Modular architecture - Core modules -->
<script type="text/javascript" src="js/modules/storage-manager.js"></script>  <!-- NEW -->
<script type="text/javascript" src="js/modules/parameter-manager.js"></script>
<script type="text/javascript" src="js/modules/eagle-api-manager.js"></script>
<!-- ... rest of modules ... -->
```

---

### Task 4: Integration Testing
**Estimated Time:** 1-2 hours

**Test Scenarios:**

- [ ] **Test 1: First Run (No Saved Data)**
  - Open plugin for first time
  - Verify default parameters are shown
  - Adjust parameters
  - Close plugin
  - Reopen plugin
  - Verify adjusted parameters are restored

- [ ] **Test 2: Parameter Persistence**
  - Set cropTop: 80%, cropBottom: 10%
  - Set format: WebP, quality: 0.85
  - Close and reopen plugin
  - Verify all parameters match

- [ ] **Test 3: Invalid Saved Data**
  - Manually corrupt localStorage data
  - Open plugin
  - Verify fallback to defaults without crash

- [ ] **Test 4: Storage Unavailable**
  - Disable localStorage (browser dev tools)
  - Open plugin
  - Verify defaults are used
  - Verify no console errors

- [ ] **Test 5: Parameter Validation**
  - Set invalid values in localStorage (cropTop: 150)
  - Open plugin
  - Verify invalid values are rejected and defaults used

- [ ] **Test 6: Rapid Parameter Changes**
  - Quickly adjust multiple parameters
  - Verify debouncing works (no excessive saves)
  - Verify final values are saved correctly

- [ ] **Test 7: Multi-Language Compatibility**
  - Test in all 8 supported languages
  - Verify parameter persistence works regardless of language

- [ ] **Test 8: Edge Cases**
  - Test with cropTop + cropBottom = 99% (maximum)
  - Test with quality = 0.1 (minimum)
  - Test with quality = 1.0 (maximum)
  - Test all export formats

---

### Task 5: Error Handling & Edge Cases
**Estimated Time:** 1 hour

**Subtasks:**
- [ ] Handle localStorage quota exceeded error
- [ ] Handle localStorage disabled by user/browser
- [ ] Handle corrupted JSON data in storage
- [ ] Handle missing parameter keys (partial data)
- [ ] Handle invalid parameter values (out of range)
- [ ] Handle DOM not ready during load
- [ ] Add graceful degradation if storage fails
- [ ] Log warnings but don't crash on errors

**Error Scenarios & Solutions:**

| Scenario | Solution |
|----------|----------|
| localStorage quota exceeded | Log warning, continue with in-memory only |
| localStorage disabled | Detect early, skip storage operations |
| Corrupted JSON | Catch parse error, use defaults |
| Invalid parameter value | Validate and reject, use default |
| DOM not ready | Queue application until DOMContentLoaded |
| Storage read error | Log error, use defaults |
| Storage write error | Log error, continue execution |

---

### Task 6: Documentation Updates
**Estimated Time:** 30 minutes

**Subtasks:**
- [ ] Update `README.md` with parameter persistence feature
- [ ] Update `.github/copilot-instructions.md` with storage patterns
- [ ] Add JSDoc comments to all new methods
- [ ] Document storage key naming convention
- [ ] Add troubleshooting section for storage issues
- [ ] Update CHANGELOG.md (when feature is complete)

**Documentation Additions:**

**For README.md:**
```markdown
### 🎯 Parameter Persistence
The plugin automatically remembers your last used settings:
- Crop percentages (top and bottom)
- Export format (JPG, PNG, WebP)
- Export quality

Your preferences are restored automatically when you reopen the plugin. No manual saving required!
```

**For copilot-instructions.md:**
```markdown
## Parameter Persistence Pattern

### Storage Strategy
Uses browser localStorage with namespaced keys:
- Prefix: `eagle-movie-stitching:`
- Individual keys per parameter for granular control
- Auto-save on parameter change (debounced 300ms)
- Auto-load on ParameterManager construction

### Storage Manager API
```javascript
// Save single parameter
storageManager.saveParameter('cropTopPercent', 85);

// Load with default fallback
const value = storageManager.loadParameter('cropTopPercent', 0);

// Batch operations
storageManager.saveAllParameters(params);
const params = storageManager.loadAllParameters();
```

**Critical:** Always validate loaded data before applying to DOM/logic.

---

## 🧪 Testing Checklist

### Unit Testing (Manual)
- [ ] StorageManager.saveParameter() with valid values
- [ ] StorageManager.saveParameter() with invalid values
- [ ] StorageManager.loadParameter() with existing data
- [ ] StorageManager.loadParameter() with missing data
- [ ] StorageManager.isStorageAvailable() in normal environment
- [ ] StorageManager.validateParameter() for each parameter type
- [ ] ParameterManager.loadSavedParameters() first run
- [ ] ParameterManager.loadSavedParameters() with saved data
- [ ] ParameterManager.saveCurrentParameters() debouncing

### Integration Testing
- [ ] Complete user workflow (adjust → close → reopen → verify)
- [ ] Parameter validation chain (UI → Manager → Storage)
- [ ] Error recovery (corrupt data → fallback → continue)
- [ ] Multi-session persistence (close Eagle → reopen Eagle)

### Cross-Browser Testing (if applicable)
- [ ] Chromium-based browsers (Eagle likely uses Electron/Chromium)
- [ ] Storage persistence across Eagle restarts
- [ ] Storage isolation between plugin instances

### Performance Testing
- [ ] Save operation < 10ms (synchronous localStorage)
- [ ] Load operation < 10ms
- [ ] No UI blocking during save/load
- [ ] No memory leaks after multiple open/close cycles

---

## 🚨 Risk Assessment

### High Risk Items
1. **localStorage unavailability**
   - **Mitigation:** Detect early, graceful fallback to defaults
   - **Impact:** Feature disabled but plugin still works

2. **Data corruption**
   - **Mitigation:** Validate all loaded data, use try-catch for JSON parsing
   - **Impact:** Falls back to defaults, user re-adjusts parameters once

3. **Storage quota exceeded**
   - **Mitigation:** Catch QuotaExceededError, log warning
   - **Impact:** Parameters not saved, but plugin functions normally

### Medium Risk Items
1. **DOM timing issues**
   - **Mitigation:** Check DOM ready state, use DOMContentLoaded event
   - **Impact:** Parameters may not apply on first load

2. **Parameter validation gaps**
   - **Mitigation:** Comprehensive validation in StorageManager
   - **Impact:** Invalid values could crash rendering

### Low Risk Items
1. **Save performance**
   - **Mitigation:** Debounce saves (300ms), synchronous localStorage is fast
   - **Impact:** Minimal, < 10ms operations

2. **Storage size**
   - **Mitigation:** Only 4 parameters × ~20 bytes each = ~80 bytes total
   - **Impact:** Negligible, localStorage typically 5-10MB limit

---

## 📊 Success Metrics

### Functional Metrics
- ✅ Parameters persist across 100% of sessions
- ✅ Load time < 10ms for parameter restoration
- ✅ Save operation completes within 300ms debounce window
- ✅ Zero crashes due to storage errors

### User Experience Metrics
- ✅ Users never see default parameters after first adjustment
- ✅ No manual save/load actions required
- ✅ No visible delay or UI blocking
- ✅ Seamless experience across plugin reopens

### Code Quality Metrics
- ✅ 100% error handling coverage for storage operations
- ✅ Full JSDoc documentation for StorageManager
- ✅ No console errors in normal operation
- ✅ All validation rules enforced

---

## 🔄 Future Enhancements (Post-MVP)

### Phase 2 Features (Not in Scope Now)
1. **Export/Import Settings**
   - Button to export parameters to file
   - Button to import parameters from file
   - Share settings between users

2. **Parameter Presets**
   - Save multiple named presets (e.g., "Movie Subtitles", "Manga Pages")
   - Quick switch between presets
   - Delete/rename presets

3. **Reset to Defaults Button**
   - UI button to clear saved parameters
   - Confirmation dialog before reset

4. **Last Used Timestamp**
   - Show when parameters were last adjusted
   - "Settings from [date/time]" indicator

5. **Cloud Sync (Advanced)**
   - Sync parameters across devices via Eagle account
   - Requires Eagle API support (if available)

6. **Visual Feedback**
   - Toast notification: "Settings saved ✓"
   - Fade-in animation when restored
   - Settings indicator icon in UI

---

## 📝 Implementation Estimate

### Time Breakdown
| Task | Estimated Time |
|------|----------------|
| StorageManager module | 2-3 hours |
| ParameterManager integration | 2-3 hours |
| HTML updates | 15 minutes |
| Integration testing | 1-2 hours |
| Error handling | 1 hour |
| Documentation | 30 minutes |
| **Total** | **7-10 hours** |

### Recommended Approach
1. **Day 1 (3-4 hours):**
   - Create StorageManager module
   - Write unit tests for StorageManager
   - Test in isolation (browser console)

2. **Day 2 (3-4 hours):**
   - Integrate with ParameterManager
   - Update HTML script loading
   - Initial integration testing

3. **Day 3 (1-2 hours):**
   - Complete error handling
   - Full integration testing
   - Documentation updates
   - Final polish

---

## ✅ Pre-Implementation Checklist

Before starting implementation:
- [ ] Review this TODO document with team/stakeholders
- [ ] Confirm localStorage is available in Eagle plugin environment
- [ ] Verify no conflicts with existing storage usage
- [ ] Confirm parameter value ranges and validation rules
- [ ] Set up test environment for localStorage testing
- [ ] Review current ParameterManager code one more time
- [ ] Check if Eagle provides official storage API (documentation)
- [ ] Prepare rollback plan if issues arise
- [ ] Create feature branch: `feature/save-parameters` (already exists)

---

## 🎯 Definition of Done

Feature is complete when:
- [ ] All code implemented and tested
- [ ] All test scenarios pass
- [ ] No console errors in normal operation
- [ ] Parameters persist across plugin reopens
- [ ] Error handling covers all edge cases
- [ ] Code reviewed (self or peer)
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
- [ ] No performance regression
- [ ] Feature works in all 8 supported languages
- [ ] Graceful degradation if storage unavailable
- [ ] Code follows existing architecture patterns
- [ ] JSDoc comments complete

---

## 📞 Questions & Decisions Needed

Before implementation, please confirm:

1. **Storage Approval:** Is localStorage acceptable for this plugin? (No privacy/security concerns?)
2. **Scope Confirmation:** Only the 4 parameters listed, or any others?
3. **Reset Feature:** Should we add a "Reset to Defaults" button now or later?
4. **Visual Feedback:** Should we show "Settings saved" toast notification?
5. **Eagle API:** Is there an official Eagle storage API we should use instead?
6. **Migration:** Do we need to support migration if we change storage format later?

---

## 🏁 Next Steps

1. **Review this document** and confirm approach
2. **Answer questions** in section above
3. **Create feature branch** (already exists: `feature/save-parameters`)
4. **Begin implementation** starting with Task 1 (StorageManager)
5. **Iterate** through tasks in order
6. **Test thoroughly** at each integration point
7. **Document** as you build
8. **Review & merge** when complete

---

**Document Version:** 1.0  
**Created:** October 30, 2025  
**Last Updated:** October 30, 2025  
**Status:** Ready for Review & Approval
