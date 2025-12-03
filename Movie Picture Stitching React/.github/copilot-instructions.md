# Eagle React Template - AI Coding Instructions

## Project Overview

Modern React + TypeScript template for building Eagle desktop plugin extensions. Uses **Vite**, **Tailwind CSS**, **i18next**, and **class-variance-authority** for type-safe component variants. Features dual-mode development: browser mock for rapid iteration + Eagle desktop runtime.

**Tech Stack:** React 18, TypeScript 5, Vite 5, Tailwind CSS 3, i18next 23, Vitest, Zustand  
**Current Version:** 1.0.0  
**Test Suite:** 1,040+ unit tests with full coverage  
**Key Constraint:** Must work in Eagle's Chromium environment (Node.js `require()` available in production)

## Quick Start

```bash
# Browser development with hot reload (mock Eagle API)
npm run dev  # → http://localhost:5173

# Eagle development with watch mode (real Eagle API) ⭐ Recommended
npm run build:watch
# Then: Eagle → Settings → Plugins → Developer → Import Local Project → select project root folder

# Production deploy to Eagle plugins directory
npm run deploy
# Then: Restart Eagle (auto-loads from plugins directory)
```

## Architecture - Dual Environment Pattern

### Critical: Eagle API is NOT available in browser development
Code **must detect environment** using `isEagleEnvironment()` and provide mock fallback:

```typescript
// ✅ CORRECT: Check environment before using Eagle API
import { eagleApi, isEagleEnvironment } from '@/lib/eagle-api';

if (isEagleEnvironment()) {
  const items = await eagleApi.getSelectedItems();
} else {
  // Use mock data or disable feature
}

// ❌ WRONG: Direct access crashes in dev
const eagle = window.eagle; // undefined in browser!
```

### Eagle API Adapter Pattern (`src/lib/eagle-api.ts`)
Single `EagleAPIAdapter` class wraps ALL Eagle API calls:
- **In Eagle:** Uses `window.eagle` directly
- **In Browser:** Returns mock data from `createMockEagleAPI()`
- **Usage:** Import singleton `eagleApi` - NEVER access `window.eagle` directly
- **Safe Initialization:** All property getters use try-catch to handle pre-`plugin-create` access

**Critical APIs:**
```typescript
// Selection (polling-based - Eagle doesn't push updates)
await eagleApi.getSelectedItems(); // Returns Item[]

// Add processed files back to library
await eagleApi.addItemFromPath('/path/to/image.png', {
  name: 'Result',
  tags: ['processed'],
  folders: [folderId]
});

// Environment detection
eagleApi.isMock       // true in browser dev
eagleApi.isDarkMode   // Computed from Eagle theme or system
eagleApi.locale       // 'en', 'zh_CN', etc.
```

## Component Architecture - CVA + Tailwind

### NO custom CSS files - Tailwind utilities + CVA variants ONLY
All styling through `className` props using:
1. **Tailwind utilities:** `bg-blue-600`, `hover:bg-blue-500`, `dark:bg-gray-800`
2. **CVA variants:** Type-safe component variations defined with `class-variance-authority`
3. **Design tokens:** CSS variables in `src/styles/globals.css` (Eagle theme colors)

**Component Pattern:**
```typescript
// src/components/ui/Button.tsx
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg transition-all', // base
  {
    variants: {
      variant: {
        primary: 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white',
        outline: 'border border-gray-300 dark:border-gray-600 bg-transparent',
      },
      size: {
        default: 'h-10 px-4',
        sm: 'h-8 px-3 text-xs',
      }
    },
    defaultVariants: { variant: 'primary', size: 'default' }
  }
);

interface ButtonProps extends VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
}

export const Button = ({ variant, size, isLoading, ...props }: ButtonProps) => (
  <button className={cn(buttonVariants({ variant, size }))} {...props} />
);
```

**Usage:**
```tsx
<Button variant="primary" size="sm">Click me</Button>
<Button variant="outline" isLoading>Loading...</Button>
```

### Existing UI Components (`src/components/ui/`)
- **Button:** 7 variants (default, primary, destructive, outline, secondary, ghost, link), `isLoading` prop
- **Card:** Glass-morphic design, `variant="glass"` for blur effect
- **Toast:** Context-based with `useToast()` hook, 4 types (success/error/warning/info)
- **Form:** Input, Select, Checkbox, Slider with dark mode support
- **Header:** Window drag region support (Eagle-specific)
- **Dialog:** Modal dialogs with Radix UI primitives
- **DropdownMenu:** Context menus and dropdowns
- **ImageGrid:** Responsive image grid with selection support
- **Tooltip, Popover:** Overlay components for additional context

## Custom Hooks Pattern

### `useEagleSelection` - Optimized Polling-Based Selection Tracking
Eagle doesn't push selection updates - uses optimized polling with hash-based change detection:
```typescript
import { useEagleSelection } from '@/hooks';

function MyComponent() {
  const { 
    items, 
    isLoading, 
    refresh,
    isPaused,      // true when paused due to visibility
    startPolling, 
    stopPolling 
  } = useEagleSelection({
    pollingInterval: 500,  // default
    autoStart: true,       // start polling immediately
    pauseOnHidden: true    // pause when tab/plugin hidden
  });

  // items updates automatically when user selects different items in Eagle
}
```

**Optimizations:**
- **Hash-based change detection** - Only updates React state when selection actually changes
- **Visibility-aware** - Pauses polling when `document.hidden` or plugin minimized
- **Resource-efficient** - No unnecessary re-renders for unchanged selections

**Why polling?** Eagle Plugin API v4.0 has NO event for selection changes - only `item.getSelected()` query.

### `useTheme` - Eagle Theme Integration
Syncs with Eagle's theme system (DARK/LIGHT/GRAY/BLUE/PURPLE/Auto):
```typescript
import { useTheme } from '@/hooks';

const { theme, isDarkMode, setTheme, toggleTheme } = useTheme();

// theme: 'light' | 'dark' | 'auto'
// isDarkMode: computed from Eagle theme or system preference
// Persists to localStorage with key: 'eagle-react-template:theme'
```

### `useLocalStorage` - Type-Safe Persistence
Generic hook with validation:
```typescript
import { useLocalStorage } from '@/hooks';

const [settings, setSettings] = useLocalStorage('settings', {
  autoPreview: true,
  quality: 80
});
```

**Storage pattern:** All keys prefixed with `eagle-react-template:` to avoid conflicts.

## State Management (Zustand)

Uses **Zustand** with slice-based architecture and persistence middleware.

### Store Slices
- **selection** - Eagle selection state (`items`, `isLoading`, `isPolling`)
- **settings** - User preferences (`theme`, `outputFormat`, `quality`)
- **processing** - Batch operation state (`status`, `progress`, `results`)
- **ui** - Ephemeral UI state (`activePanel`, `modalOpen`, `searchQuery`)

### Usage Pattern
```typescript
import { usePluginStore } from '@/stores';
import { useSelection, useSettings } from '@/stores';

// Convenience hooks (recommended)
const { items, isLoading, startPolling } = useSelection();
const { theme, toggleTheme } = useSettings();

// Direct store access
const items = usePluginStore(state => state.selection.items);

// Memoized selectors
import { selectImageItems, selectStarredItems } from '@/stores/selectors';
const images = usePluginStore(selectImageItems);
```

### Persistence
Settings automatically persist to localStorage via Zustand middleware.

## Error Boundary

Graceful error handling with styled fallback UI:
```tsx
import { ErrorBoundary, ErrorFallback } from '@/components';

// Global boundary (in App.tsx)
<ErrorBoundary
  fallback={(props) => <ErrorFallback {...props} />}
  onError={(error) => eagleApi.log.error(error.message)}
>
  <App />
</ErrorBoundary>

// Section boundary with auto-reset
<ErrorBoundary
  fallback={(props) => <ErrorFallback {...props} variant="inline" />}
  resetKeys={[dataId]}  // Auto-reset when key changes
>
  <DataSection />
</ErrorBoundary>
```

## Mock Factory

Configurable mock data for browser development:
```typescript
// URL params: ?mockItems=50&mockPreset=largeLibrary&mockTheme=light

// Console API (dev mode)
window.mockEagle.preset('largeLibrary');  // 100 items, 20 folders
window.mockEagle.simulateError('getSelectedItems', 'API error');
window.mockEagle.reset();

// Programmatic
import { mockController, createMockItems } from '@/lib';
mockController.setConfig({ selectedItemCount: 50 });
```

**Presets:** `empty`, `single`, `default`, `largeLibrary`, `stressTest`

## Internationalization (i18n)

### 8-Language Support with Dynamic Detection
Uses **i18next** + **react-i18next** with auto-detection:
1. Check `window.i18next.language` (Eagle's built-in i18next)
2. Fallback to `eagleApi.locale` 
3. Map browser language (`navigator.language`)
4. Default to `'en'`

**Language mapping:**
```typescript
// src/lib/i18n.ts
const langMap = {
  'zh': 'zh_CN',      // Simplified Chinese
  'zh-TW': 'zh_TW',   // Traditional Chinese
  'ja': 'ja_JP',      // Japanese
  // ... 8 total languages in _locales/*.json
};
```

**Usage:**
```tsx
import { useTranslation } from 'react-i18next';

const { t } = useTranslation();

<h1>{t('app.title')}</h1>
<p>{t('demo.selectedCount', { count: items.length })}</p>
```

**Translation files:** `_locales/{en,zh_CN,zh_TW,ja_JP,ko_KR,de_DE,es_ES,ru_RU}.json`

**Language change detection:** Event-driven using `onPluginShow`, `visibilitychange`, and `MutationObserver` on `html[lang]`. Fallback polling at 10s interval if needed.

## Build & Deploy System

### Vite Configuration (`vite.config.ts`)
**Critical settings:**
```typescript
{
  base: './',  // MUST be relative paths for Eagle
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: undefined  // Single bundle (Eagle limitation)
      }
    }
  },
  resolve: {
    alias: {
      '@': './src',
      '@components': './src/components',
      '@hooks': './src/hooks',
      '@lib': './src/lib'
    }
  }
}
```

### Deploy Script (`scripts/deploy.js`)
Automates installation to Eagle plugins directory:
- **macOS:** `~/Library/Application Support/Eagle/plugins/`
- **Windows:** `%APPDATA%\Eagle\plugins\`

**What gets copied:**
1. `dist/*` → root (build output files)
2. `manifest.json` (**transformed** - paths adjusted for deployment)
3. `_locales/` (i18n translations)
4. `public/*` (static assets like `logo.png`)

**Manifest Path Transformation:**
The deploy script automatically transforms paths in `manifest.json`:
```
Development                →    Deployment
"url": "dist/index.html"   →    "url": "index.html"
"logo": "public/logo.png"  →    "logo": "logo.png"
```

**Post-deploy:** Simply restart Eagle - it auto-loads plugins from the plugins directory.

## Manifest Configuration

### Critical Fields (`manifest.json`)
**Note:** Keep development paths in `manifest.json` - the deploy script transforms them automatically.

```json
{
  "id": "7af1dd74-1da3-4892-962d-ce5b4a493526",  // Unique UUID
  "name": "{{manifest.app.name}}",               // i18n key
  "fallbackLanguage": "en",
  "languages": ["en", "zh_TW", "zh_CN", ...],    // 8 languages
  "main": {
    "url": "dist/index.html", // DEV path (deploy.js → "index.html")
    "vibrancy": true,         // macOS translucency effect
    "minWidth": 800,
    "minHeight": 600,
    "devTools": true          // Enable Chromium DevTools
  },
  "logo": "public/logo.png"   // DEV path (deploy.js → "logo.png")
}
```

## Tailwind Design Tokens

### Eagle Theme Variables (`src/styles/globals.css`)
CSS variables map Eagle's color system:
```css
:root {
  --eagle-bg-primary: #ffffff;
  --eagle-text-primary: #1a1a1a;
  --eagle-accent-primary: #238636;
  /* ... */
}

.dark {
  --eagle-bg-primary: #0d1117;
  --eagle-text-primary: #c9d1d9;
  /* ... */
}
```

**Usage in Tailwind:**
```tsx
<div className="bg-eagle-bg-primary text-eagle-text-primary">
  <button className="bg-eagle-accent-primary hover:opacity-90">
```

### Custom Animations (`tailwind.config.js`)
Pre-defined keyframes:
- `animate-fade-in` (0.2s opacity)
- `animate-slide-up` (0.3s translateY)
- `animate-shimmer` (loading effect)

## Common Patterns & Gotchas

### 1. Window Drag Region (macOS/Windows)
Header must have `drag-region` class for window dragging:
```tsx
// src/components/ui/Header.tsx
<header className="drag-region bg-eagle-bg-secondary">
  <button className="no-drag">Close</button> {/* Prevent drag on buttons */}
</header>
```

**CSS:**
```css
.drag-region { -webkit-app-region: drag; }
.no-drag { -webkit-app-region: no-drag; }
```

### 2. Toast Notifications (Non-Blocking)
Replace `alert()` with toast system:
```tsx
import { useToast, toast } from '@/components';

const { addToast } = useToast();

// Success (auto-dismiss in 4s)
addToast(toast.success('Saved!', 'File exported successfully'));

// Error (stays visible, duration: 0)
addToast(toast.error('Failed', errorMessage, 0));

// Warning/Info
addToast(toast.warning('Select items first'));
addToast(toast.info('Processing...', undefined, 3000));
```

### 3. File Path Handling
Eagle provides **file URLs** - convert for Node.js operations:
```typescript
const item = await eagleApi.getSelectedItems()[0];

// ✅ CORRECT: Use filePath for fs operations
const absolutePath = item.filePath; // '/Users/...'

// ❌ WRONG: fileURL is URI format
const badPath = item.fileURL; // 'file:///Users/...'
```

### 4. Node.js Modules in Eagle Context
Access via `window.require()` when in Eagle:
```typescript
if (hasNodeRequire()) {
  const fs = require('fs');
  const path = require('path');
  // Use Node.js APIs
}
```

### 5. Canvas Size Limits
Browser limit: **32767px** per dimension:
```typescript
const MAX_SIZE = 32767;
if (width > MAX_SIZE || height > MAX_SIZE) {
  throw new Error('Canvas exceeds browser maximum');
}
```

### 6. Safe API Initialization
Eagle API properties may throw before `plugin-create` event fires. All getters use try-catch:
```typescript
// In eagle-api.ts - all property getters are protected
get locale(): EagleLocale {
  try {
    return this._api.app?.locale || 'en';
  } catch {
    return 'en';  // Safe default if API not ready
  }
}
```

This allows i18n and theme initialization during module load without crashing.

## Plugin Templates

The template provides 5 ready-to-use layouts in `src/templates/`:

### Available Templates
| Template | Use Case |
|----------|----------|
| `SinglePanelTemplate` | Simple utilities, focused tasks |
| `SplitPanelTemplate` | Sidebar + content, navigation-based |
| `SettingsPanelTemplate` | Plugin configuration, preferences |
| `BatchProcessTemplate` | Bulk operations, progress tracking |
| `ImageBrowserTemplate` | Image grids, asset browsers |

### Usage Pattern
```tsx
import { SplitPanelTemplate } from '@/templates';

<SplitPanelTemplate
  sidebarWidth="w-64"
  sidebar={<NavigationList />}
>
  <MainContent />
</SplitPanelTemplate>
```

## Development Workflow

### Option 1: Browser Development (Mock API)
1. `npm run dev` → http://localhost:5173
2. Edit components → instant hot reload (HMR)
3. Test with mock data (`eagleApi.isMock === true`)
4. No real Eagle data - uses fake items/folders

**Debugging:**
- Open DevTools (`Cmd+Option+I`)
- Check `eagleApi.isMock === true` to verify mock mode

### Option 2: Eagle Watch Mode (Real API) ⭐ Recommended
Develop with real Eagle data + fast rebuilds:

1. `npm run build:watch` (Vite rebuilds on file changes)
2. Eagle → Settings → Plugins → Developer → Import Local Project
3. Select **project root folder** (contains `manifest.json`)
4. Eagle loads `dist/index.html` as configured in manifest
5. After code changes: `Cmd+R` to reload plugin

**Why this works:** `manifest.json` points to `dist/index.html`. Eagle reads the manifest and loads the built output. With `build:watch`, Vite rebuilds instantly on save.

### Production Deployment
1. `npm run deploy` (builds + copies to Eagle plugins dir)
2. **Restart Eagle** - it auto-loads plugins from the plugins directory
3. No manual import needed for deployed plugins

## Error Handling

### User-Facing Errors
Always use toast notifications:
```typescript
try {
  await eagleApi.addItemFromPath(path);
  addToast(toast.success('Added to library'));
} catch (error) {
  addToast(toast.error('Export failed', error.message, 0));
}
```

### Console Logging
Use `eagleApi.log` for production logging (writes to Eagle's log file):
```typescript
eagleApi.log.info('Processing started');
eagleApi.log.warn('Quality too low');
eagleApi.log.error('File not found');
```

## Testing Checklist

Before committing:
- [ ] Run `npm test` - all 1,040+ tests must pass
- [ ] Run `npm run typecheck` - no TypeScript errors
- [ ] Test in browser dev mode (`npm run dev`)
- [ ] Test in Eagle after `npm run deploy`
- [ ] Verify all 8 languages switch correctly
- [ ] Check dark/light theme transitions
- [ ] Confirm polling updates selection (change selection in Eagle, see UI update)
- [ ] Test with 0, 1, and 10+ selected items
- [ ] Validate localStorage persistence (close/reopen plugin)

## Key Files Reference

### Core Application
- **Entry:** `src/main.tsx` (initializes i18n + theme)
- **App:** `src/App.tsx` (providers + DemoPage)
- **Manifest:** `manifest.json` (Eagle plugin config)

### Pages & Demos
- **DemoPage:** `src/pages/DemoPage.tsx` (7-tab navigation)
- **Demos:** `src/demos/` (SelectionDemo, ComponentsDemo, FormsDemo, DialogsDemo, CanvasDemo, StorageDemo, TemplatesDemo)

### Plugin Templates
- **Templates:** `src/templates/` (SinglePanelTemplate, SplitPanelTemplate, SettingsPanelTemplate, BatchProcessTemplate, ImageBrowserTemplate)
- **Index:** `src/templates/index.ts` (barrel exports)

### Libraries
- **Eagle API:** `src/lib/eagle-api.ts` (dual-environment adapter with safe initialization)
- **Mock Factory:** `src/lib/mock-factory.ts` (configurable mock data)
- **i18n:** `src/lib/i18n.ts` (8-language detection + setup)
- **Storage:** `src/lib/storage.ts` (namespaced localStorage)
- **Utils:** `src/lib/utils.ts` (`cn()` for className merging)

### State Management
- **Store:** `src/stores/index.ts` (Zustand store with persistence)
- **Selectors:** `src/stores/selectors.ts` (memoized derived state)
- **Slices:** `src/stores/slices/` (selection, settings, processing, ui)

### Components
- **UI Library:** `src/components/ui/{Button,Card,Dialog,DropdownMenu,Form,Header,ImageGrid,Toast,ErrorBoundary}.tsx`
- **Index:** `src/components/ui/index.ts` (barrel exports)

### Hooks
- **Selection:** `src/hooks/useEagleSelection.ts` (optimized polling with hash-based change detection)
- **Theme:** `src/hooks/useTheme.ts` (Eagle theme sync)
- **Storage:** `src/hooks/useLocalStorage.ts` (generic persistence)

### Configuration
- **Vite:** `vite.config.ts` (build config, aliases)
- **Tailwind:** `tailwind.config.js` (design tokens, animations)
- **TypeScript:** `tsconfig.json` (React + path aliases)
- **Deploy:** `scripts/deploy.js` (platform-specific install)

### Type Definitions
- **Eagle API:** `src/types/eagle.d.ts` (complete Eagle Plugin API v4.0 types)
