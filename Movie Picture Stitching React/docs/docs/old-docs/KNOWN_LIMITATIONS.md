# Eagle React Template - Known Limitations & Areas for Improvement

A critical analysis of the template's current shortcomings, technical debt, and areas that need enhancement. This document helps contributors understand what needs work and guides future development.

---

## Table of Contents

- [Critical Issues](#critical-issues)
- [Architectural Limitations](#architectural-limitations)
- [Eagle API Coverage Gaps](#eagle-api-coverage-gaps)
- [Component Library Gaps](#component-library-gaps)
- [Developer Experience Issues](#developer-experience-issues)
- [Testing & Quality Assurance](#testing--quality-assurance)
- [Performance Concerns](#performance-concerns)
- [Documentation Gaps](#documentation-gaps)
- [Suggested Roadmap](#suggested-roadmap)

---

## Critical Issues

### 1. ~~No Automated Testing~~ ✅ RESOLVED

**Severity:** ~~🔴 High~~ → ✅ Fixed

**Resolution:** Implemented comprehensive testing infrastructure with 280 tests.

**Test Coverage:**
| Metric | Target | Current |
|--------|--------|---------|
| Statements | 60% | 76% |
| Branches | 50% | 66% |
| Functions | 50% | 54% |
| Lines | 60% | 78% |

**Test Stack:**
- **Vitest 4.0.14** - Fast, Vite-native test runner
- **@testing-library/react 16.3.0** - React component testing
- **happy-dom 20.0.11** - Fast DOM environment (2-3x faster than jsdom)
- **@vitest/coverage-v8** - V8-based code coverage

**Test Files Created:**
```
src/
├── __tests__/
│   ├── setup.ts                    # Global mocks (localStorage, matchMedia)
│   ├── mocks/eagle.mock.ts         # Mock factories for Eagle entities
│   └── utils/test-utils.tsx        # Custom render with providers
├── lib/
│   ├── utils.test.ts               # 43 tests
│   ├── storage.test.ts             # 37 tests
│   ├── eagle-api.test.ts           # 40 tests
│   └── mock-factory.test.ts        # 48 tests ← NEW
├── hooks/
│   ├── useLocalStorage.test.ts     # 20 tests
│   ├── useEagleSelection.test.ts   # 30 tests
│   └── useTheme.test.ts            # 28 tests
└── components/ui/
    └── Button.test.tsx             # 34 tests
```

**Commands:**
```bash
npm run test        # Watch mode
npm run test:run    # Single run
npm run test:coverage  # With coverage report
```

See [docs/TESTING.md](./TESTING.md) for comprehensive testing documentation.

---

### 2. ~~Selection Polling is Inefficient~~ ✅ RESOLVED

**Severity:** ~~🟡 Medium~~ → ✅ Fixed

**Resolution:** Implemented hash-based change detection and visibility-aware polling.

**Optimizations implemented:**
1. **Hash-based change detection** - Only updates React state when selection actually changes
2. **Visibility-aware polling** - Pauses polling when `document.hidden` or plugin is minimized
3. **Eagle event integration** - Listens to `onPluginShow`/`onPluginHide` for additional visibility detection
4. **New `forceRefresh()` method** - Bypasses hash check when needed
5. **`isPaused` state** - Exposes whether polling is paused due to visibility

**New API:**
```typescript
const { 
  items, 
  isLoading, 
  error, 
  refresh,       // Always fetches (backward compatible)
  forceRefresh,  // Same as refresh, explicit naming
  startPolling, 
  stopPolling,
  isPaused,      // NEW: true when paused due to visibility
} = useEagleSelection({
  pollingInterval: 500,  // default
  autoStart: true,       // default
  pauseOnHidden: true,   // NEW: default true
});
```

**Implementation highlights:**
```typescript
// Hash computation for efficient comparison
function computeSelectionHash(items: Item[]): string {
  if (items.length === 0) return '';
  return items.map(item => item.id).join(',');
}

// Only update state when hash changes
const newHash = computeSelectionHash(selected);
if (newHash !== lastHashRef.current) {
  lastHashRef.current = newHash;
  setItems(selected);  // State update only when needed
}
```

**Tests added:** 11 new tests covering hash comparison, visibility changes, and new methods.

---

### 3. ~~Mock Data is Hardcoded and Limited~~ ✅ RESOLVED

**Severity:** ~~🟡 Medium~~ → ✅ Fixed

**Resolution:** Implemented comprehensive configurable mock factory system with runtime control.

**Mock Factory Features:**
- **Configurable MockController** - Singleton class managing mock data state
- **Presets** - `empty`, `single`, `default`, `largeLibrary`, `stressTest`
- **URL parameter support** - `?mockItems=50&mockPreset=largeLibrary&mockTheme=light`
- **Console API** - Runtime configuration via `window.mockEagle.*`
- **Error simulation** - Test error handling with `simulateError()`
- **Custom data injection** - Pass custom items/folders arrays

**New APIs:**
```typescript
// URL params for quick testing
// http://localhost:5173/?mockItems=50&mockPreset=mixed&mockTheme=light

// Console API (dev mode only)
window.mockEagle.setConfig({ selectedItemCount: 50, totalItemCount: 100 });
window.mockEagle.preset('largeLibrary');  // 100 items, 20 folders
window.mockEagle.preset('stressTest');    // 1000 items, 50 folders
window.mockEagle.simulateError('getSelectedItems', 'API unavailable');
window.mockEagle.clearErrors();
window.mockEagle.reset();

// Programmatic usage
import { mockController, createMockItem, createMockItems } from '@/lib';

// Create custom mock data
const customItems = createMockItems(50, { ext: 'png' });
mockController.setConfig({ customItems });

// Access mock data
const items = await mockController.getSelectedItems();
const folders = await mockController.getAllFolders();
```

**File types supported:**
- **images** - jpg, png, gif, webp, svg
- **videos** - mp4, mov, webm
- **documents** - pdf, ai, psd
- **mixed** - all of the above (default)

**Test Coverage:** 48 tests covering all mock factory functionality.

---

## Architectural Limitations

### 4. ~~No State Management Solution~~ ✅ RESOLVED

**Severity:** ~~🟡 Medium~~ → ✅ Fixed

**Resolution:** Implemented Zustand state management with slice pattern, persistence, and memoized selectors.

**Implementation highlights:**
- **Zustand 5.0.9** - Minimal 1.2KB state management library
- **Slice Pattern** - Organized by domain (selection, settings, processing, ui)
- **Persistence Middleware** - Settings and UI preferences persist to localStorage
- **Memoized Selectors** - Derived state for images, videos, documents, starred items
- **Convenience Hooks** - `useSelection()`, `useSettings()`, `useProcessing()`, `useUI()`

**Store Structure:**
```typescript
// src/stores/index.ts
interface PluginStore {
  // State
  selection: { items, isLoading, error, isPolling, isPaused };
  settings: { theme, isDarkMode, autoPreview, outputFormat, quality };
  processing: { status, progress, results, cancelRequested };
  ui: { activePanel, selectedItemIds, searchQuery, modalOpen };
  
  // Actions
  setItems, refreshSelection, startPolling, stopPolling,
  setTheme, toggleTheme, setOutputFormat, setQuality,
  startProcessing, updateProgress, addResult, requestCancel,
  setActivePanel, openModal, closeModal, selectItems,
  // ... and more
}
```

**Usage examples:**
```tsx
// Basic usage
const items = usePluginStore(state => state.selection.items);
const { setTheme } = usePluginStore(state => state);

// With selectors (memoized)
import { selectImageItems, selectProcessingProgress } from '@/stores/selectors';
const images = usePluginStore(selectImageItems);
const progress = usePluginStore(selectProcessingProgress);

// Convenience hooks (shallow comparison for render optimization)
const { items, isLoading, startPolling } = useSelection();
const { theme, isDarkMode, toggleTheme } = useSettings();
const { status, progress, startProcessing } = useProcessing();
const { activePanel, openModal, closeModal } = useUI();
```

**Selectors available:**
| Selector | Purpose |
|----------|---------|
| `selectImageItems` | Filter items by image extensions |
| `selectVideoItems` | Filter items by video extensions |
| `selectDocumentItems` | Filter items by document extensions |
| `selectDesignItems` | Filter items by design file extensions |
| `selectStarredItems(minStars)` | Filter by star rating |
| `selectItemsByTag(tag)` | Filter by specific tag |
| `selectFilteredItems` | Items matching search query |
| `selectProcessingProgress` | Current processing progress |
| `selectCanStartProcessing` | Boolean: can start batch operation |
| `selectIsModalOpen(id)` | Boolean: is specific modal open |

**Test Coverage:** 60+ store tests including slice tests and selector tests.

**Files created:**
```
src/stores/
├── index.ts           # Main store with persistence middleware
├── selectors.ts       # Memoized derived state
├── types.ts           # TypeScript interfaces
├── store.test.ts      # Store tests
├── selectors.test.ts  # Selector tests
└── slices/
    ├── index.ts       # Slice exports
    ├── selection.ts   # Eagle selection state
    ├── settings.ts    # User preferences
    ├── processing.ts  # Batch operation state
    └── ui.ts          # Ephemeral UI state
```

---

### 5. ~~No Error Boundary Implementation~~ ✅ RESOLVED

**Severity:** ~~🟡 Medium~~ → ✅ Fixed

**Resolution:** Implemented comprehensive ErrorBoundary system with styled ErrorFallback component.

**Components created:**
- **`ErrorBoundary`** - Class component with `getDerivedStateFromError`, `componentDidCatch`, and `resetKeys` support
- **`ErrorFallback`** - Styled fallback UI with glass-morphic Card design, collapsible error details, and copy-to-clipboard

**Features:**
- **Fullscreen & Inline variants** - Use `variant="fullscreen"` for top-level, `variant="inline"` for section-level boundaries
- **Automatic reset** - `resetKeys` prop triggers reset when values change (e.g., route changes)
- **Error logging** - `onError` callback integrates with `eagleApi.log.error()` in production
- **i18n translations** - All 8 languages supported for error messages
- **Collapsible details** - Shows stack trace and component stack for debugging
- **Copy to clipboard** - One-click copy of full error information

**Usage:**
```tsx
import { ErrorBoundary, ErrorFallback } from '@/components';

// Global boundary (fullscreen fallback)
<ErrorBoundary
  fallback={(props) => <ErrorFallback {...props} />}
  onError={(error, info) => eagleApi.log.error(error.message)}
  onReset={() => resetAppState()}
>
  <App />
</ErrorBoundary>

// Section boundary (inline fallback)
<ErrorBoundary
  fallback={(props) => <ErrorFallback {...props} variant="inline" />}
  resetKeys={[dataId]}
>
  <DataTable data={data} />
</ErrorBoundary>
```

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `fallback` | `ReactNode \| (props) => ReactNode` | Fallback UI when error occurs |
| `onError` | `(error, errorInfo) => void` | Callback when error is caught |
| `onReset` | `() => void` | Callback when reset is triggered |
| `resetKeys` | `unknown[]` | Auto-reset when any key changes |

**ErrorFallback Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'fullscreen' \| 'inline'` | `'fullscreen'` | Layout style |
| `showDetails` | `boolean` | `true` | Show collapsible error details |
| `title` | `string` | i18n key | Custom title override |
| `description` | `string` | i18n key | Custom description override |

**Test Coverage:** 34 tests covering all functionality.

**Files created:**
```
src/components/ui/
├── ErrorBoundary.tsx       # Class component (170 lines)
├── ErrorBoundary.test.tsx  # 34 tests
└── ErrorFallback.tsx       # Styled fallback (180 lines)

_locales/{en,zh_CN,zh_TW,ja_JP,ko_KR,de_DE,es_ES,ru_RU}.json
└── errors.boundary.*       # 9 translation keys each
```

---

### 6. ~~i18n Language Change Detection is Hacky~~ ✅ RESOLVED

**Severity:** ~~🟢 Low~~ → ✅ Fixed

**Resolution:** Replaced 2-second polling with event-driven language detection and proper cleanup.

**Improvements:**
1. **Event-driven detection** - Uses `onPluginShow`, `visibilitychange`, and `MutationObserver` instead of aggressive polling
2. **Proper cleanup** - Returns cleanup function to prevent memory leaks during HMR
3. **Longer fallback interval** - If polling is needed, uses 10 seconds instead of 2 seconds
4. **State management** - Tracks listener state to prevent duplicate setups
5. **New hook** - `useLanguageSync()` for React components with automatic cleanup

**Detection Strategy (priority order):**
1. `eagle.event.onPluginShow()` - Primary trigger when plugin becomes visible
2. `MutationObserver` on `html[lang]` - Catches external language changes
3. `visibilitychange` event - Re-checks when tab becomes visible
4. Fallback polling (10s) - Only in Eagle environment, with proper cleanup

**New APIs:**
```typescript
// Setup listener (returns cleanup function)
import { setupEagleLanguageListener, cleanupLanguageListener } from '@/lib/i18n';

const cleanup = setupEagleLanguageListener({
  enablePolling: true,   // optional, default: true in Eagle
  pollingInterval: 10000 // optional, default: 10 seconds
});

// Later cleanup
cleanup();
// or
cleanupLanguageListener();

// Check listener status
import { isLanguageListenerActive } from '@/lib/i18n';
console.log(isLanguageListenerActive()); // true/false
```

**React Hook:**
```tsx
import { useLanguageSync } from '@/hooks';

function App() {
  const { 
    language,           // Current language code
    isListenerActive,   // Whether listener is running
    setLanguage,        // Manually change language
    detectAndSync,      // Force re-detect from Eagle
    startListener,      // Manual control
    stopListener,       // Manual control
  } = useLanguageSync({
    autoSetup: true,      // default: true
    enablePolling: false, // default: auto
    pollingInterval: 10000,
  });

  return <div>Language: {language}</div>;
}
```

**HMR Support:**
```typescript
// main.tsx - handles hot module replacement
cleanupLanguageListener();
const cleanup = setupEagleLanguageListener();

const hot = (import.meta as ImportMeta & { hot?: { dispose: (cb: () => void) => void } }).hot;
if (hot) {
  hot.dispose(() => cleanup());
}
```

**Test Coverage:** 32 tests covering language detection, listener lifecycle, hook behavior.

**Files modified/created:**
```
src/lib/i18n.ts              # Refactored (200 lines)
src/lib/i18n.test.tsx        # 32 tests
src/hooks/useLanguageSync.ts # New hook (150 lines)
src/hooks/index.ts           # Added export
src/main.tsx                 # HMR cleanup support
```

---

## Eagle API Coverage Gaps

### 7. ~~Incomplete API Wrapper~~ ✅ RESOLVED

**Severity:** ~~🟡 Medium~~ → ✅ Fixed

**Resolution:** Implemented comprehensive Eagle Plugin API coverage in `EagleAPIAdapter` with full mock support.

**Phase 1 - Core CRUD (Implemented):**
| Category | Methods Added |
|----------|---------------|
| **Tags** | `getTags()`, `getRecentTags()` |
| **TagGroups** | `getTagGroups()`, `createTagGroup()` |
| **Library** | `getLibraryInfo()`, `libraryName`, `libraryPath`, `libraryModificationTime` |
| **Folders** | `createFolder()`, `createSubfolder()`, `getFolderById()`, `getFoldersByIds()`, `getRecentFolders()`, `openFolder()` |
| **Items** | `getItems(options)`, `getItemsByIds()`, `addItemFromURL()`, `addBookmark()`, `openItem()` |

**Phase 2 - Enhanced Queries (Implemented):**
| Feature | Description |
|---------|-------------|
| `getItems({ ext, tags, folders, rating, ... })` | Filter items by extension, tags, folders, rating |
| `getItems({ id, ids })` | Query by ID or multiple IDs |
| `getItems({ isSelected })` | Get currently selected items |

**Phase 3 - System APIs (Implemented):**
| Category | Methods Added |
|----------|---------------|
| **Clipboard** | `clipboard.clear()`, `writeText()`, `readText()`, `writeHTML()`, `readHTML()`, `writeImage()`, `readImage()`, `copyFiles()`, `has()` |
| **Context Menu** | `showContextMenu(items)` |
| **Drag** | `startDrag(filePaths)` |
| **Screen** | `getCursorScreenPoint()`, `getPrimaryDisplay()`, `getAllDisplays()`, `getDisplayNearestPoint()` |
| **OS** | `os.tmpdir()`, `os.version()`, `os.type()`, `os.release()`, `os.hostname()`, `os.homedir()`, `os.arch()` |
| **App** | `version`, `build`, `arch`, `getPath()`, `getFileIcon()`, `createThumbnailFromPath()` |
| **Window** | 20+ window methods (show, hide, minimize, maximize, fullscreen, bounds, position, opacity, capture, etc.) |
| **Events** | `onLibraryChanged()`, `onPluginShow()`, `onPluginHide()` |

**Mock Factory Extensions:**
```typescript
// New mock factories
createMockTag(options)           // Create mock tags
createMockTags(count)            // Batch tag creation
createMockTagGroup(options)      // Create mock tag groups
createMockTagGroups(count)       // Batch tag group creation
createMockLibraryInfo(options)   // Mock library info
createMockDisplay(options)       // Mock display info
createMockDisplays()             // Primary + secondary displays
createMockNativeImage(w, h)      // Mock NativeImage
createMockPalettes(count)        // Mock color palettes

// MockController new methods
mockController.getTags()
mockController.getRecentTags()
mockController.getTagGroups()
mockController.getLibraryInfo()
mockController.getCursorScreenPoint()
mockController.getPrimaryDisplay()
mockController.getAllDisplays()
mockController.getDisplayNearestPoint(point)
mockController.clipboard*()      // Full clipboard mock state
mockController.os*()             // Platform-specific OS mocks
```

**Test Coverage:** 116 new tests for extended API in `eagle-api-extended.test.ts`.

---

### 8. ~~No TypeScript Strict Mode for Eagle Types~~ ✅ RESOLVED

**Severity:** ~~🟢 Low~~ → ✅ Fixed

**Resolution:** Replaced all `unknown` and weak types with proper TypeScript interfaces.

**Types Fixed:**
```typescript
// BEFORE: Weak typing
interface LibraryInfo { [key: string]: unknown; }
interface Display { [key: string]: unknown; }
palettes: unknown[];

// AFTER: Proper typing
interface LibraryInfo {
  name: string;
  path: string;
  modificationTime: number;
  folders: Folder[];
  smartFolders: SmartFolder[];
  tagGroups: TagGroup[];
  quickAccess: Item[];
  modifierShortcuts: ModifierShortcut[];
  applicationTheme: EagleTheme;
}

interface Display {
  id: number;
  bounds: Rectangle;
  workArea: Rectangle;
  accelerometerSupport: 'available' | 'unavailable' | 'unknown';
  colorDepth: number;
  colorSpace: string;
  scaleFactor: number;
  size: Size;
  workAreaSize: Size;
  rotation: number;
  internal: boolean;
  touchSupport: 'available' | 'unavailable' | 'unknown';
  monochrome: boolean;
  label: string;
}

interface ColorPalette {
  color: [number, number, number];  // RGB values
  ratio: number;                     // 0-1
}

palettes: ColorPalette[];  // Properly typed
```

**New Types Added:**
| Type | Purpose |
|------|---------|
| `ColorPalette` | RGB color with ratio from item analysis |
| `SmartFolder` | Smart folder with conditions |
| `SmartFolderCondition` | Condition for smart folder rules |
| `ModifierShortcut` | Quick access shortcut definition |

**Files Modified:**
- `src/types/eagle.d.ts` - Complete type definitions
- `src/lib/mock-factory.ts` - Type-safe mock factories
- `src/lib/eagle-api.ts` - Properly typed adapter methods

---

## Component Library Gaps

### 9. ~~Missing Common UI Components~~ ✅ RESOLVED

**Severity:** ~~🟡 Medium~~ → ✅ Fixed

**Resolution:** Migrated to shadcn/ui design system with Radix UI primitives. All existing components updated to use OKLCH semantic tokens, and new accessible components added.

**Components Migrated:**
| Component | Changes |
|-----------|---------|
| **Button** | Flat semantic tokens (`bg-primary`, `bg-success`, etc.), 8 variants including new `success` for Eagle primary actions |
| **Card** | OKLCH tokens (`bg-card`, `border-border`), preserved glass variant |
| **Form** | Input, Label, Select, Checkbox, Slider all using `border-input`, `ring-ring`, `text-muted-foreground` |
| **Toast** | Semantic tokens (`bg-success/10`, `bg-destructive/10`, `bg-warning/10`, `bg-info/10`) |
| **Header** | OKLCH tokens (`bg-background/80`, `border-border`) |

**New Components Added (Radix UI Primitives):**
| Component | Features |
|-----------|----------|
| **Dialog** | Focus trap, keyboard dismiss (Escape), ARIA compliant, animated open/close |
| **DropdownMenu** | Keyboard navigation (arrow keys), submenus, checkbox items, radio items |
| **Tabs** | Arrow key navigation, roving tabindex, ARIA tabpanel pattern |
| **Tooltip** | Delayed show/hide, keyboard accessible, proper positioning |
| **Popover** | Focus management, click-outside dismiss, collision detection |

**Design System:**
- Created comprehensive `docs/DESIGN_SYSTEM.md` (400+ lines) documenting OKLCH color system, component patterns, Eagle-specific considerations
- Added `components.json` for shadcn CLI compatibility
- OKLCH color format for perceptual uniformity across light/dark themes
- Extended semantic tokens: `--success`, `--warning`, `--info` for Eagle-specific needs

**Files Created/Modified:**
```
docs/DESIGN_SYSTEM.md              # NEW: Comprehensive design spec
components.json                     # NEW: shadcn CLI config
src/styles/globals.css             # UPDATED: OKLCH tokens for light/dark
tailwind.config.js                 # UPDATED: semantic colors, animations
src/components/ui/
├── Button.tsx                     # UPDATED: shadcn tokens
├── Card.tsx                       # UPDATED: shadcn tokens
├── Form.tsx                       # UPDATED: shadcn tokens
├── Toast.tsx                      # UPDATED: semantic tokens
├── Header.tsx                     # UPDATED: shadcn tokens
├── Dialog.tsx                     # NEW: Radix UI Dialog
├── DropdownMenu.tsx               # NEW: Radix UI Dropdown
├── Tabs.tsx                       # NEW: Radix UI Tabs
├── Tooltip.tsx                    # NEW: Radix UI Tooltip
├── Popover.tsx                    # NEW: Radix UI Popover
└── index.ts                       # UPDATED: exports new components
```

**Dependencies Added:**
```json
{
  "@radix-ui/react-dialog": "^1.x",
  "@radix-ui/react-dropdown-menu": "^2.x",
  "@radix-ui/react-tabs": "^1.x",
  "@radix-ui/react-tooltip": "^1.x",
  "@radix-ui/react-popover": "^1.x",
  "@radix-ui/react-slot": "^1.x",
  "tailwindcss-animate": "^1.x"
}
```

---

### 10. ~~No Keyboard Navigation Support~~ ✅ RESOLVED

**Severity:** ~~🟡 Medium~~ → ✅ Fixed

**Resolution:** All new Radix UI components have built-in keyboard navigation and ARIA compliance.

**Keyboard Support by Component:**
| Component | Keyboard Features |
|-----------|-------------------|
| **Dialog** | `Escape` to close, focus trap (Tab cycles within), autofocus on open |
| **DropdownMenu** | `↑↓` to navigate, `Enter/Space` to select, `Escape` to close, `→` for submenus |
| **Tabs** | `←→` to switch tabs, `Home/End` for first/last, `Enter/Space` for manual activation |
| **Tooltip** | Focus trigger shows tooltip, `Escape` dismisses |
| **Popover** | `Escape` to close, focus trap when open |

**ARIA Compliance:**
- All components use proper ARIA roles (`dialog`, `menu`, `tablist`, `tab`, `tabpanel`, `tooltip`)
- Screen reader announcements via live regions
- Focus indicators via `focus-visible:ring-2 focus-visible:ring-ring`

**Reduced Motion Support:**
```css
@media (prefers-reduced-motion: reduce) {
  *, ::before, ::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

### 11. ~~No Animation System~~ ✅ RESOLVED

**Severity:** ~~🟢 Low~~ → ✅ Fixed

**Resolution:** Implemented coordinated animation system using `tailwindcss-animate` plugin with Radix UI data attributes.

**Animation Classes Added:**
| Animation | Usage |
|-----------|-------|
| `animate-in` | Entry animation |
| `animate-out` | Exit animation |
| `fade-in-0` / `fade-out-0` | Opacity transitions |
| `zoom-in-95` / `zoom-out-95` | Scale transitions |
| `slide-in-from-*` / `slide-out-to-*` | Directional slides |
| `accordion-down` / `accordion-up` | Radix accordion |
| `collapsible-down` / `collapsible-up` | Radix collapsible |

**Radix Data Attribute Integration:**
```tsx
// Animations triggered by Radix state changes
<DialogContent className={cn(
  'data-[state=open]:animate-in data-[state=closed]:animate-out',
  'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
  'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
)} />
```

**Tailwind Config:**
```javascript
// tailwind.config.js
plugins: [require('tailwindcss-animate')],

animation: {
  'accordion-down': 'accordion-down 0.2s ease-out',
  'accordion-up': 'accordion-up 0.2s ease-out',
  'collapsible-down': 'collapsible-down 0.2s ease-out',
  'collapsible-up': 'collapsible-up 0.2s ease-out',
  'fade-in': 'fadeIn 0.2s ease-out',
  'slide-up': 'slideUp 0.3s ease-out',
  'shimmer': 'shimmer 2s linear infinite',
},
```

**Exit Animations:**
Components now properly animate out before unmounting, using Radix's `data-[state=closed]` attribute.

---

## Developer Experience Issues

### 12. ~~No CLI Scaffolding~~ ✅ RESOLVED

**Severity:** ~~🟡 Medium~~ → ✅ Fixed

**Resolution:** Implemented interactive CLI scaffolding tool with `@clack/prompts`.

**Usage:**
```bash
npm run create-plugin
# Interactive prompts:
# - Project directory name
# - Plugin display name (English)
# - Plugin description
# - Author name
# - Select additional languages (English always included)
```

**Features:**
- **Auto UUID generation** - Uses `crypto.randomUUID()` for unique plugin IDs
- **8-language support** - Select which languages to include (en, zh_CN, zh_TW, ja_JP, ko_KR, de_DE, es_ES, ru_RU)
- **Beautiful CLI** - Uses `@clack/prompts` for modern, interactive terminal UI
- **Validation** - Project name format, directory existence checks
- **Complete project copy** - Copies all necessary files and directories

**Files Created:**
```
scripts/create-plugin.ts         # CLI scaffolding script (200+ lines)
```

**Dependencies Added:**
```json
{
  "@clack/prompts": "^0.10.0",
  "picocolors": "^1.1.1"
}
```
---

### 14. ~~ESLint/Prettier Not Fully Configured~~ ✅ RESOLVED

**Severity:** ~~🟢 Low~~ → ✅ Fixed

**Resolution:** Implemented complete ESLint 9 flat config + Prettier + EditorConfig setup.

**Configuration Files Created:**

| File | Purpose |
|------|---------|
| `eslint.config.js` | ESLint 9 flat config with TypeScript, React |
| `.prettierrc` | Prettier code formatting rules |
| `.prettierignore` | Files to exclude from formatting |
| `.editorconfig` | Cross-IDE consistency |
| `.vscode/settings.json` | VS Code integration |

**ESLint Configuration Highlights:**
```javascript
// eslint.config.js
- TypeScript + React + React Hooks + React Refresh
- Global Eagle-specific variables (eagle, require)
- Relaxed rules for test files
- Relaxed rules for scripts folder
- CVA export patterns allowed
```

**Prettier Configuration:**
```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
```

**New npm Scripts:**
```json
{
  "lint": "eslint .",
  "lint:fix": "eslint . --fix",
  "format": "prettier --write \"src/**/*.{ts,tsx,css,json}\"",
  "format:check": "prettier --check \"src/**/*.{ts,tsx,css,json}\""
}
```

**Dependencies Added:**
```json
{
  "@eslint/js": "^9.14.0",
  "typescript-eslint": "^8.13.0",
  "globals": "^15.12.0",
  "prettier": "^3.4.2"
}
```

**VS Code Integration:**
- Format on save enabled
- ESLint fix on save enabled
- Tailwind CSS class regex for CVA
- TypeScript SDK from node_modules

---

## Testing & Quality Assurance

### 15. ~~No Type Checking in CI/CD~~ ✅ RESOLVED

**Severity:** ~~🟡 Medium~~ → ✅ Fixed

**Resolution:** Implemented comprehensive GitHub Actions CI/CD pipeline with parallel jobs and multi-version testing.

**Pipeline Jobs:**
| Job | Purpose |
|-----|---------|
| `lint-and-format` | TypeScript typecheck, ESLint (strict), Prettier check |
| `test` | Vitest tests with coverage, Node 18.x/20.x/22.x matrix |
| `build` | Production build verification, dist size check |
| `visual-tests` | Playwright visual regression (on push to main) |

**CI Configuration (`.github/workflows/ci.yml`):**
```yaml
jobs:
  lint-and-format:
    - npm run typecheck    # tsc --noEmit
    - npm run lint         # ESLint (fails on errors)
    - npm run format:check # Prettier check

  test:
    strategy:
      matrix:
        node-version: [18.x, 20.x, 22.x]
    - npm run test:coverage
    - Upload to Codecov

  build:
    needs: [lint-and-format, test]
    - npm run build
    - Verify dist/ output

  visual-tests:
    - Playwright visual regression
    - Upload artifacts on failure
```

**Pre-commit Hooks:**
```bash
# .husky/pre-commit
npx lint-staged
```

**lint-staged Configuration:**
```json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{css,json,md}": ["prettier --write"]
  }
}
```

**Dependencies Added:**
```json
{
  "husky": "^9.1.7",
  "lint-staged": "^15.2.10"
}
```

---

### 16. ~~No Visual Regression Testing~~ ✅ RESOLVED

**Severity:** ~~🟢 Low~~ → ✅ Fixed

**Resolution:** Implemented Playwright visual regression testing with snapshot comparison.

**Test Coverage:**
| Category | Tests |
|----------|-------|
| Visual Regression | Homepage, Header, Card, Buttons, Forms |
| Interactive States | Hover, Focus states |
| Theme Consistency | Light/Dark theme screenshots |
| Toast Notifications | Success, Error toasts |
| Responsive Layout | Mobile, Tablet, Desktop viewports |

**Configuration (`playwright.config.ts`):**
```typescript
{
  testDir: './e2e',
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'chromium-dark', use: { colorScheme: 'dark' } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
  },
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.001,  // 0.1% tolerance
      threshold: 0.2,            // Ignore anti-aliasing
    },
  },
}
```

**Test File (`e2e/visual.spec.ts`):**
```typescript
test.describe('Visual Regression Tests', () => {
  test('homepage renders correctly', async ({ page }) => {
    await expect(page).toHaveScreenshot('homepage.png', { fullPage: true });
  });
  
  test('dark theme consistency', async ({ page }) => {
    await page.evaluate(() => document.documentElement.classList.add('dark'));
    await expect(page).toHaveScreenshot('theme-dark.png', { fullPage: true });
  });
});
```

**npm Scripts:**
```json
{
  "test:e2e": "playwright test",
  "test:e2e:update": "playwright test --update-snapshots"
}
```

**Dependencies Added:**
```json
{
  "@playwright/test": "^1.49.0"
}
```

**CI Integration:**
- Visual tests run on push to main branch
- Artifacts uploaded on test failure for debugging
- Screenshot comparison with 0.1% tolerance

---

## Performance Concerns

### 17. ~~Bundle Size Not Optimized~~ ✅ RESOLVED

**Severity:** ~~🟢 Low~~ → ✅ Fixed

**Resolution:** Implemented comprehensive bundle analysis tooling, icon inventory documentation, and CI bundle size enforcement.

**Bundle Analyzer:**
```bash
npm run build:analyze  # Opens treemap visualization
```

**Configuration (`vite.config.ts`):**
```typescript
import { visualizer } from 'rollup-plugin-visualizer';

plugins: [
  react(),
  visualizer({
    filename: 'dist/bundle-stats.html',
    gzipSize: true,
    brotliSize: true,
    template: 'treemap',
  }),
],
```

**Current Bundle Size:**
| Asset | Size | Gzipped |
|-------|------|---------|
| JS Bundle | 456KB | 139KB |
| CSS Bundle | 40KB | 8KB |

**Icon Inventory (`docs/ICON_INVENTORY.md`):**
- Documents all 29 unique Lucide icons used
- Tracks icon usage by file location
- Confirms tree-shaking works correctly with Vite
- Provides guidelines for adding new icons

**CI Bundle Size Check (`.github/workflows/ci.yml`):**
```yaml
- name: Check bundle size
  run: |
    BUNDLE_SIZE=$(stat -c%s "$JS_FILE")
    MAX_SIZE=512000  # 500KB limit
    if [ $BUNDLE_SIZE -gt $MAX_SIZE ]; then
      echo "❌ Bundle exceeds limit"
      exit 1
    fi
```

**Dependencies Added:**
```json
{
  "rollup-plugin-visualizer": "^5.x"
}
```

---

### 18. ~~No Image Optimization Patterns~~ ✅ RESOLVED

**Severity:** ~~🟢 Low~~ → ✅ Fixed

**Resolution:** Implemented comprehensive image handling components and canvas memory management utilities.

**EagleImage Component (`src/components/ui/Image.tsx`):**
```tsx
import { EagleImage, ImageGrid, ImagePlaceholder } from '@/components';

// Use Eagle's pre-generated thumbnails (faster, lower memory)
<EagleImage item={item} useThumbnail />

// With loading skeleton and error fallback
<EagleImage
  item={item}
  showSkeleton
  fallback={<ImagePlaceholder text="Not available" />}
  aspectRatio="16/9"
/>

// Grid layout for multiple images
<ImageGrid columns={4} gap={2}>
  {items.map(item => (
    <EagleImage key={item.id} item={item} useThumbnail aspectRatio="1/1" />
  ))}
</ImageGrid>
```

**Features:**
| Feature | Implementation |
|---------|----------------|
| Native lazy loading | `loading="lazy"` attribute |
| Async decoding | `decoding="async"` for non-blocking |
| Thumbnail support | Uses `item.thumbnailURL` for previews |
| Loading skeleton | Animated pulse placeholder |
| Error fallback | Retry button or custom fallback |
| Memory cleanup | Clears src on unmount |

**Canvas Utilities (`src/lib/canvas.ts`):**
```typescript
import {
  validateCanvasSize,
  fitToCanvasLimits,
  cleanupCanvas,
  createCanvas,
  loadImage,
  processBatch,
  MAX_CANVAS_SIZE,
} from '@/lib';

// Validate before creating large canvases
const validation = validateCanvasSize(width, height);
if (!validation.valid) {
  console.error(validation.reason);
  // Use validation.suggestedSize for fallback
}

// Memory-safe canvas creation
const result = createCanvas(1920, 1080);
if (result) {
  const { canvas, ctx } = result;
  // ... draw operations ...
  cleanupCanvas(canvas);  // IMPORTANT: Free memory
}

// Batch processing with progress
const results = await processBatch(
  images,
  async (img) => processImage(img),
  {
    batchSize: 50,
    onProgress: (percent) => setProgress(percent),
    abortSignal: controller.signal,
  }
);
```

**Constants Exported:**
| Constant | Value | Purpose |
|----------|-------|---------|
| `MAX_CANVAS_SIZE` | 32767 | Browser pixel limit |
| `MAX_CANVAS_AREA` | 268M | Total pixels limit |
| `RECOMMENDED_BATCH_SIZE` | 50 | Prevent memory exhaustion |
| `IMAGE_LOAD_TIMEOUT` | 30000 | Loading timeout (ms) |

**Files Created:**
```
src/components/ui/Image.tsx  # EagleImage, ImageGrid, ImagePlaceholder
src/lib/canvas.ts            # Canvas validation, memory management
docs/ICON_INVENTORY.md       # Lucide icon tracking
```

---

## Documentation Gaps

### 19. No Storybook or Component Docs

**Severity:** 🟡 Medium

Component usage is only documented in README. No interactive documentation.

**What's needed:**
- Storybook for component playground
- Props documentation with JSDoc
- Usage examples for each variant

---

### 20. No Migration Guide

**Severity:** 🟢 Low

When template updates, there's no guide for existing plugins to migrate.

**Missing:**
- CHANGELOG with breaking changes
- Migration scripts
- Version compatibility matrix with Eagle versions

---

### 21. No Architecture Decision Records (ADRs)

**Severity:** 🟢 Low

Design decisions are not documented:

- Why CVA over styled-components?
- Why polling vs event-based selection?
- Why i18next over other i18n libraries?
- Why Tailwind over CSS-in-JS?

---

## Suggested Roadmap

### Phase 1: Critical (Now) ✅ COMPLETED
1. ✅ Add Vitest + React Testing Library (526 tests)
2. ✅ Improve selection polling efficiency (hash-based + visibility-aware)
3. ✅ Add configurable mock data factory
4. ✅ Add Zustand state management
5. ✅ Implement Error Boundary
6. ✅ Add GitHub Actions CI

### Phase 2: Important (Next) ✅ COMPLETED
7. ✅ Complete Eagle API wrapper coverage (116 new tests)
8. ✅ Add shadcn/ui design system with Dialog, Dropdown, Tabs, Tooltip, Popover
9. ✅ Implement keyboard navigation and accessibility (via Radix primitives)
10. ✅ Add animation system (tailwindcss-animate)
11. ✅ Create CLI scaffolding tool (`npm run create-plugin`)
12. ✅ ESLint 9 + Prettier configuration
13. ✅ Pre-commit hooks (Husky + lint-staged)
14. ✅ Visual regression testing (Playwright)
15. ✅ Bundle size analysis and optimization
16. ✅ Image optimization patterns (EagleImage, canvas utilities)

### Phase 3: Nice-to-Have (Future)
17. ⬜ Add Storybook for component documentation
18. ⬜ Architecture Decision Records (ADRs)
19. ⬜ Migration guide for template updates

---

## Contributing

Found another limitation? Please:
1. Open an issue describing the problem
2. Propose a solution if you have one
3. Reference this document in your PR if addressing any of these items

---

## Related Documents

- [Introduction](../getting-started/introduction) - Main documentation
- [DEVELOPMENT.md](./DEVELOPMENT.md) - Development guide
- [TESTING.md](./TESTING.md) - Testing documentation
- [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) - Component design system
