# Eagle React Template

A modern, componentized React + TypeScript template for building Eagle desktop plugin extensions. This template solves the challenge of developing and testing Eagle plugins efficiently while providing beautiful, unified UI components and a fully encapsulated Eagle Plugin API.

> **Why this template?** Eagle's official Plugin API doesn't include a React-based component system. This template fills that gap, providing a complete development environment with browser-based testing, hot reload, and production-ready build tooling.

## ✨ Features

### Core Technology
- **React 18** + **TypeScript 5** - Modern, type-safe development with full IntelliSense
- **Vite 5** - Lightning-fast HMR and optimized production builds
- **Tailwind CSS 3** - Utility-first styling with Eagle-specific design tokens
- **class-variance-authority (CVA)** - Type-safe component variants
- **Vitest** - Fast unit testing with 1,040+ tests

### Eagle Integration
- **Eagle API Adapter** - Fully typed wrapper with automatic mock support for browser development
- **Dual Environment** - Develop in browser with mocked data, deploy to Eagle seamlessly
- **Theme Sync** - Auto-detect and sync with Eagle's theme system (DARK/LIGHT/GRAY/BLUE/PURPLE)
- **Selection Tracking** - Polling-based hook to track user's selected items
- **Graceful Initialization** - Safe API access before `plugin-create` event with fallback defaults

### Internationalization
- **8 Languages** - Pre-configured (en, zh_CN, zh_TW, ja_JP, ko_KR, de_DE, es_ES, ru_RU)
- **i18next** - Industry-standard i18n with React bindings
- **Eagle Locale Detection** - Automatically matches Eagle's language setting

### UI Component Library
- **Button** - 7 variants with loading states and icons
- **Card** - Glass-morphic design with hover effects
- **Toast** - Non-blocking notifications (success/error/warning/info)
- **Header** - Drag region support with theme toggle
- **Form Controls** - Input, Select, Checkbox, Slider with dark mode
- **Dialog** - Modal dialogs with Radix UI
- **DropdownMenu** - Context menus and dropdowns
- **ImageGrid** - Responsive image grid with selection support

### Plugin Templates (5 Ready-to-Use)
- **SinglePanelTemplate** - Simple single-panel layout for focused tasks
- **SplitPanelTemplate** - Two-column sidebar + content layout
- **SettingsPanelTemplate** - Full settings panel with sections
- **BatchProcessTemplate** - Batch processing with progress tracking
- **ImageBrowserTemplate** - Image grid with search/filter capabilities

### Interactive Demo System
- **7 Demo Tabs** - Selection, Components, Forms, Dialogs, Canvas, Storage, Templates
- **Live Examples** - Interactive demos for all components
- **Template Showcase** - Preview all 5 plugin templates

### Developer Experience
- **Deploy Script** - One-command deployment to Eagle plugins directory
- **Mock API** - Full mock implementation for browser testing
- **TypeScript Types** - Complete Eagle Plugin API v4.0 type definitions
- **Comprehensive Tests** - 1,040+ unit tests with Vitest
- **Zustand State Management** - Slice-based store with persistence
- **Error Boundary** - Graceful error handling with styled fallback UI
- **CLI Scaffolding** - Interactive plugin creation with `npm run create-plugin`

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or pnpm
- [Eagle](https://eagle.cool) desktop app (for deployment testing)

### Development (Browser)

```bash
# Install dependencies
npm install

# Start dev server with hot reload
npm run dev
```

Open http://localhost:5173 - the app runs with a **mock Eagle API**, allowing you to develop and test without Eagle running.

### Build & Deploy to Eagle

```bash
# Build and deploy in one command
npm run deploy
```

The deploy script copies the plugin to Eagle's plugins directory. Simply **restart Eagle** to load the plugin - Eagle automatically detects plugins in its plugins directory.

> **Plugin locations:**
> - macOS: `~/Library/Application Support/Eagle/plugins/`
> - Windows: `%APPDATA%\Eagle\plugins\`

---

## 📁 Project Structure

```
eagle-react-template/
├── _locales/                    # i18n translation files (8 languages)
│   ├── en.json                  # English (fallback)
│   ├── zh_CN.json               # Simplified Chinese
│   ├── zh_TW.json               # Traditional Chinese
│   └── ...
├── public/                      # Static assets (logo, icons)
├── scripts/
│   └── deploy.js                # Cross-platform deployment script
├── src/
│   ├── components/
│   │   ├── ui/                  # UI Component Library
│   │   │   ├── Button.tsx       # CVA-based button variants
│   │   │   ├── Card.tsx         # Glass-morphic card components
│   │   │   ├── Dialog.tsx       # Modal dialog component
│   │   │   ├── DropdownMenu.tsx # Dropdown menu component
│   │   │   ├── Form.tsx         # Input, Select, Checkbox, Slider
│   │   │   ├── Header.tsx       # Drag region + theme toggle
│   │   │   ├── ImageGrid.tsx    # Responsive image grid
│   │   │   ├── Toast.tsx        # Toast notification system
│   │   │   └── index.ts         # Barrel exports
│   │   └── index.ts
│   ├── demos/                   # Interactive demo components
│   │   ├── SelectionDemo.tsx    # Eagle selection API demo
│   │   ├── ComponentsDemo.tsx   # UI components showcase
│   │   ├── FormsDemo.tsx        # Form controls demo
│   │   ├── DialogsDemo.tsx      # Dialogs & menus demo
│   │   ├── CanvasDemo.tsx       # Canvas rendering demo
│   │   ├── StorageDemo.tsx      # localStorage persistence demo
│   │   ├── TemplatesDemo.tsx    # Plugin templates showcase
│   │   └── index.ts
│   ├── templates/               # Ready-to-use plugin templates
│   │   ├── SinglePanelTemplate.tsx
│   │   ├── SplitPanelTemplate.tsx
│   │   ├── SettingsPanelTemplate.tsx
│   │   ├── BatchProcessTemplate.tsx
│   │   ├── ImageBrowserTemplate.tsx
│   │   └── index.ts
│   ├── pages/
│   │   ├── DemoPage.tsx         # Main demo page with tabs
│   │   └── index.ts
│   ├── hooks/
│   │   ├── useEagleSelection.ts # Polling-based selection tracking
│   │   ├── useTheme.ts          # Eagle theme synchronization
│   │   ├── useLocalStorage.ts   # Type-safe localStorage hook
│   │   └── index.ts
│   ├── lib/
│   │   ├── eagle-api.ts         # ⭐ Eagle API Adapter (critical)
│   │   ├── mock-factory.ts      # Configurable mock data
│   │   ├── i18n.ts              # i18next configuration
│   │   ├── storage.ts           # Namespaced localStorage utilities
│   │   └── utils.ts             # cn(), debounce, formatters
│   ├── stores/                  # Zustand state management
│   ├── styles/
│   │   └── globals.css          # Eagle design tokens + Tailwind
│   ├── types/
│   │   └── eagle.d.ts           # Complete Eagle API type definitions
│   ├── App.tsx                  # Main application component
│   └── main.tsx                 # Entry point (i18n + theme init)
├── manifest.json                # Eagle plugin manifest
├── index.html
├── package.json
├── tailwind.config.js           # Eagle color tokens + animations
├── tsconfig.json
└── vite.config.ts               # Path aliases + build config
```

---

## 🏗️ Technical Architecture

### Dual Environment Pattern

The template's core innovation is the **dual environment pattern** - code runs identically in browser and Eagle:

```
┌─────────────────────────────────────────────────────────────┐
│                     Your React App                          │
├─────────────────────────────────────────────────────────────┤
│                   EagleAPIAdapter                           │
│         (src/lib/eagle-api.ts - singleton)                  │
├─────────────────┬───────────────────────────────────────────┤
│   Browser Dev   │              Eagle Runtime                │
│  (npm run dev)  │           (deployed plugin)               │
├─────────────────┼───────────────────────────────────────────┤
│  Mock Eagle API │           window.eagle                    │
│  (fake data)    │        (real Eagle API)                   │
└─────────────────┴───────────────────────────────────────────┘
```

**Critical Rule:** Never access `window.eagle` directly. Always use `eagleApi` singleton:

```typescript
import { eagleApi, isEagleEnvironment } from '@/lib/eagle-api';

// ✅ CORRECT: Works in both environments
const items = await eagleApi.getSelectedItems();
const isDark = eagleApi.isDarkMode;

// ❌ WRONG: Crashes in browser dev
const items = await window.eagle.item.getSelected(); // undefined!
```

### Safe API Initialization

Eagle API properties may not be available until the `plugin-create` event fires. The adapter handles this gracefully with try-catch and sensible defaults:

```typescript
// All property getters use try-catch with fallback defaults
get locale(): EagleLocale {
  try {
    return this._api.app?.locale || 'en';
  } catch {
    // Eagle API not ready yet - return default
    return 'en';
  }
}
```

This ensures the plugin can safely access properties during module initialization (e.g., i18n setup) without crashing.

### Component Architecture (CVA + Tailwind)

All styling uses **Tailwind utilities** + **CVA variants** - no custom CSS files:

```typescript
// Type-safe variants with class-variance-authority
const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-lg transition-all',
  {
    variants: {
      variant: {
        primary: 'bg-gradient-to-r from-emerald-600 to-emerald-700 text-white',
        outline: 'border border-gray-300 dark:border-gray-600',
        ghost: 'hover:bg-gray-100 dark:hover:bg-gray-800',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        default: 'h-10 px-4',
        lg: 'h-12 px-6 text-base',
      },
    },
    defaultVariants: { variant: 'primary', size: 'default' },
  }
);
```

### Build System

```
┌──────────────┐    ┌──────────────┐    ┌──────────────────────┐
│  Source      │    │   Vite       │    │   Eagle Plugin Dir   │
│  (src/)      │───▶│   Build      │───▶│   (deploy.js)        │
│              │    │   (dist/)    │    │                      │
└──────────────┘    └──────────────┘    └──────────────────────┘
                                                  │
                         ┌────────────────────────┼────────────────────────┐
                         ▼                        ▼                        ▼
                   macOS                    Windows                  Files Copied
    ~/Library/Application Support/    %APPDATA%\Eagle\       - dist/* (→ root)
         Eagle/plugins/                  plugins/             - manifest.json (transformed)
                                                              - _locales/
                                                              - public/*
```

### Manifest Path Transformation (Dev vs Deploy)

The `manifest.json` uses different paths for development and deployment:

| Environment | `main.url` | `logo` | Reason |
|-------------|-----------|--------|--------|
| **Development** | `dist/index.html` | `public/logo.png` | Source project structure |
| **Deployment** | `index.html` | `logo.png` | Files copied to plugin root |

The `deploy.js` script automatically transforms these paths during deployment. **You don't need to modify `manifest.json` manually** - keep it with development paths, and the deploy script handles the rest.

```javascript
// What deploy.js does:
// "dist/index.html" → "index.html"
// "public/logo.png" → "logo.png"
```

---

## 🧩 Plugin Templates

The template includes 5 ready-to-use layouts for common plugin patterns:

### SinglePanelTemplate
Simple single-panel layout for focused tasks. Best for utilities, quick actions, or single-purpose tools.

```tsx
import { SinglePanelTemplate } from '@/templates';

<SinglePanelTemplate
  title="My Plugin"
  description="Plugin description"
  actions={<Button>Action</Button>}
>
  <YourContent />
</SinglePanelTemplate>
```

### SplitPanelTemplate
Two-column layout with sidebar and main content. Best for navigation-based plugins or settings with preview.

```tsx
import { SplitPanelTemplate } from '@/templates';

<SplitPanelTemplate
  sidebarWidth="w-64"
  sidebar={<NavigationList />}
>
  <MainContent />
</SplitPanelTemplate>
```

### SettingsPanelTemplate
Full settings panel with categorized sections. Best for plugin configuration or preferences.

```tsx
import { SettingsPanelTemplate } from '@/templates';

const sections = [
  { id: 'general', title: 'General', icon: <Settings />, content: <GeneralSettings /> },
  { id: 'export', title: 'Export', icon: <Download />, content: <ExportSettings /> },
];

<SettingsPanelTemplate sections={sections} />
```

### BatchProcessTemplate
Batch processing layout with progress tracking. Best for bulk operations or long-running tasks.

```tsx
import { BatchProcessTemplate } from '@/templates';

<BatchProcessTemplate
  title="Batch Export"
  items={selectedItems}
  onProcess={async (item) => { /* process each item */ }}
  renderItem={(item) => <ItemPreview item={item} />}
/>
```

### ImageBrowserTemplate
Image grid with search and filter. Best for asset browsers or gallery views.

```tsx
import { ImageBrowserTemplate } from '@/templates';

<ImageBrowserTemplate
  items={images}
  columns={4}
  onSelect={(item) => { /* handle selection */ }}
  searchPlaceholder="Search images..."
/>
```

---

## 🎯 Interactive Demo System

The template includes a comprehensive demo system with 7 tabs:

| Tab | Description |
|-----|-------------|
| **Selection** | Eagle selection API with live item display |
| **Components** | Buttons, Cards, Toasts, HSL color utilities |
| **Forms** | Input, Select, Checkbox, Slider controls |
| **Dialogs** | Dialog, DropdownMenu, Tooltip, Popover |
| **Canvas** | Canvas rendering and transformations |
| **Storage** | localStorage persistence patterns |
| **Templates** | All 5 plugin templates showcase |

Run `npm run dev` and explore the demos to understand each component's capabilities.

---

## 🎨 UI Component Library

### Button

7 variants with loading state and icon support:

```tsx
import { Button } from '@/components';

// Variants
<Button variant="default">Default (Blue)</Button>
<Button variant="primary">Primary (Green)</Button>
<Button variant="destructive">Danger (Red)</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon"><Icon /></Button>

// States
<Button isLoading>Processing...</Button>
<Button leftIcon={<SaveIcon />}>Save</Button>
<Button rightIcon={<ArrowIcon />}>Next</Button>
```

### Card

Glass-morphic cards with variants:

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components';

<Card variant="default">...</Card>    // Solid background
<Card variant="glass">...</Card>      // Blur + transparency
<Card variant="outline">...</Card>    // Border only
<Card hoverable>...</Card>            // Lift on hover

// Full example
<Card variant="glass">
  <CardHeader>
    <CardTitle>Image Processing</CardTitle>
    <CardDescription>Process selected images</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Your content */}
  </CardContent>
  <CardFooter>
    <Button>Process</Button>
  </CardFooter>
</Card>
```

### Toast Notifications

Context-based toast system (no prop drilling):

```tsx
import { ToastProvider, useToast, toast } from '@/components';

// Wrap app with provider (done in App.tsx)
<ToastProvider>
  <YourApp />
</ToastProvider>

// Use in any component
function MyComponent() {
  const { addToast } = useToast();

  const handleSuccess = () => {
    addToast(toast.success('Saved!', 'File exported successfully'));
  };

  const handleError = (error: Error) => {
    // Error toasts stay visible (duration: 0)
    addToast(toast.error('Export Failed', error.message));
  };

  const handleWarning = () => {
    addToast(toast.warning('Please select items first'));
  };

  const handleInfo = () => {
    addToast(toast.info('Processing...', 'This may take a moment', 3000));
  };
}
```

### Header

Plugin header with drag region and controls:

```tsx
import { Header } from '@/components';

<Header 
  title="My Plugin"           // Optional, defaults to t('app.title')
  showThemeToggle             // Light/Dark toggle button
  showSettings                // Settings button
  onSettingsClick={handleSettings}
  showClose                   // Close button
  onCloseClick={handleClose}  // Optional, defaults to eagle.window.hide()
  actions={<CustomButtons />} // Custom action buttons
/>
```

### Form Controls

All form controls support dark mode automatically:

```tsx
import { Input, Label, Select, Checkbox, Slider } from '@/components';

// Text Input
<div>
  <Label htmlFor="name">Name</Label>
  <Input id="name" placeholder="Enter name..." />
</div>

// Select Dropdown
<Select defaultValue="png">
  <option value="png">PNG</option>
  <option value="jpg">JPG</option>
  <option value="webp">WebP</option>
</Select>

// Checkbox
<Checkbox label="Enable auto-preview" defaultChecked />

// Slider with value display
<Slider 
  label="Quality" 
  min={0} 
  max={100} 
  defaultValue={80}
  showValue  // Shows current value
/>
```

---

## 🔌 Eagle API Usage

### EagleAPIAdapter

The `eagleApi` singleton provides a unified interface:

```tsx
import { eagleApi, isEagleEnvironment, hasNodeRequire } from '@/lib/eagle-api';

// Environment detection
eagleApi.isMock        // true in browser dev, false in Eagle
eagleApi.isDarkMode    // Computed from Eagle theme or system preference
eagleApi.locale        // 'en', 'zh_CN', etc.
eagleApi.platform      // 'darwin' | 'win32'
eagleApi.isMac         // boolean
eagleApi.isWindows     // boolean

// Item operations
const items = await eagleApi.getSelectedItems();
const allItems = await eagleApi.getAllItems();
const item = await eagleApi.getItemById('item-id');

// Add new items to Eagle
await eagleApi.addItemFromPath('/path/to/image.png', {
  name: 'Processed Image',
  tags: ['processed', 'output'],
  folders: [folderId],
});

// Folder operations
const folders = await eagleApi.getAllFolders();
const selected = await eagleApi.getSelectedFolders();

// Notifications
await eagleApi.showNotification('Success', 'Operation completed');

// Dialogs
const result = await eagleApi.showOpenDialog({
  properties: ['openFile', 'multiSelections'],
  filters: [{ name: 'Images', extensions: ['png', 'jpg'] }],
});

// Window controls
await eagleApi.setAlwaysOnTop(true);
await eagleApi.setWindowSize(1200, 800);

// Logging (writes to Eagle's log file in production)
eagleApi.log.info('Processing started');
eagleApi.log.warn('Quality is low');
eagleApi.log.error('File not found');

// Shell operations
await eagleApi.openExternal('https://eagle.cool');
await eagleApi.showItemInFolder('/path/to/file.png');
```

### useEagleSelection Hook

Polling-based selection tracking (Eagle doesn't push updates):

```tsx
import { useEagleSelection } from '@/hooks';

function ImageProcessor() {
  const { 
    items,        // Currently selected Item[]
    isLoading,    // true during initial load
    error,        // Error if any
    refresh,      // Manual refresh function
    startPolling, // Start polling
    stopPolling,  // Stop polling (save resources)
  } = useEagleSelection({
    pollingInterval: 500,  // Default: 500ms
    autoStart: true,       // Default: true
  });

  return (
    <div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <p>{items.length} items selected</p>
      )}
      {items.map(item => (
        <div key={item.id}>
          <img src={item.thumbnailURL} alt={item.name} />
          <span>{item.name}.{item.ext}</span>
        </div>
      ))}
    </div>
  );
}
```

### Item Properties

Each `Item` object contains:

```typescript
interface Item {
  id: string;              // Unique identifier
  name: string;            // File name (without extension)
  ext: string;             // File extension
  width: number;           // Image width
  height: number;          // Image height
  size: number;            // File size in bytes
  tags: string[];          // Assigned tags
  folders: string[];       // Parent folder IDs
  star: number;            // Rating (0-5)
  annotation: string;      // User notes
  
  // Paths
  filePath: string;        // Absolute file path (use this for fs operations)
  fileURL: string;         // file:// URL (for display)
  thumbnailPath: string;   // Thumbnail file path
  thumbnailURL: string;    // Thumbnail URL (for <img src>)
  
  // Methods
  save(): Promise<boolean>;
  moveToTrash(): Promise<boolean>;
  open(): Promise<void>;
}
```

---

## 🗃️ State Management (Zustand)

The template uses **Zustand** for state management with a slice-based architecture:

### Store Structure

```typescript
import { usePluginStore } from '@/stores';
import { useSelection, useSettings, useProcessing, useUI } from '@/stores';

// Slice-based access
const { items, isLoading, startPolling } = useSelection();
const { theme, isDarkMode, toggleTheme } = useSettings();
const { status, progress, startProcessing } = useProcessing();
const { activePanel, openModal, closeModal } = useUI();
```

### Memoized Selectors

```typescript
import { selectImageItems, selectStarredItems, selectFilteredItems } from '@/stores/selectors';

// Filter items by type
const images = usePluginStore(selectImageItems);
const starred = usePluginStore(selectStarredItems(3)); // 3+ stars

// Search filtering
const filtered = usePluginStore(selectFilteredItems);
```

### Persistence

Settings and UI preferences automatically persist to localStorage via Zustand middleware.

---

## 🛡️ Error Boundary

Graceful error handling with styled fallback UI:

```tsx
import { ErrorBoundary, ErrorFallback } from '@/components';

// Global boundary (fullscreen fallback)
<ErrorBoundary
  fallback={(props) => <ErrorFallback {...props} />}
  onError={(error, info) => eagleApi.log.error(error.message)}
  onReset={() => window.location.reload()}
>
  <App />
</ErrorBoundary>

// Section boundary (inline fallback)
<ErrorBoundary
  fallback={(props) => <ErrorFallback {...props} variant="inline" />}
  resetKeys={[dataId]}  // Auto-reset when key changes
>
  <DataSection data={data} />
</ErrorBoundary>
```

---

## 🧪 Mock Factory

Configurable mock data for browser development:

```typescript
// URL params for quick testing
// http://localhost:5173/?mockItems=50&mockPreset=largeLibrary&mockTheme=light

// Console API (dev mode)
window.mockEagle.setConfig({ selectedItemCount: 50 });
window.mockEagle.preset('largeLibrary');  // 100 items, 20 folders
window.mockEagle.preset('stressTest');    // 1000 items, 50 folders
window.mockEagle.simulateError('getSelectedItems', 'API unavailable');
window.mockEagle.reset();

// Programmatic usage
import { mockController, createMockItems } from '@/lib';
const customItems = createMockItems(50, { ext: 'png' });
mockController.setConfig({ customItems });
```

**Presets:** `empty`, `single`, `default`, `largeLibrary`, `stressTest`

---

## 🌐 Internationalization (i18n)

### Language Detection Flow

```
1. Check window.i18next.language (Eagle's built-in i18next)
       ↓
2. Check eagleApi.locale
       ↓
3. Map navigator.language to our locale keys
       ↓
4. Fallback to 'en'
```

### Using Translations

```tsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('app.title')}</h1>
      <p>{t('demo.selectedCount', { count: items.length })}</p>
      <button>{t('actions.save')}</button>
    </div>
  );
}
```

### Translation File Structure

`_locales/en.json`:
```json
{
  "manifest": {
    "app": {
      "name": "My Plugin"
    }
  },
  "app": {
    "title": "My Plugin",
    "description": "Plugin description"
  },
  "actions": {
    "save": "Save",
    "cancel": "Cancel",
    "export": "Export"
  },
  "messages": {
    "success": "Operation completed",
    "error": "An error occurred",
    "selectItems": "Please select items first"
  }
}
```

### Adding a New Language

1. Create `_locales/new_LOCALE.json` (copy from `en.json`)
2. Translate all keys
3. Add to `manifest.json`:
   ```json
   "languages": ["en", "zh_TW", "zh_CN", "new_LOCALE", ...]
   ```
4. Add to `src/lib/i18n.ts`:
   ```typescript
   import new_LOCALE from '../../_locales/new_LOCALE.json';
   
   const resources = {
     // ...existing
     new_LOCALE: { translation: new_LOCALE },
   };
   ```

---

## 🎯 Theme Support

### useTheme Hook

```tsx
import { useTheme } from '@/hooks';

function ThemeDemo() {
  const { 
    theme,        // 'light' | 'dark' | 'auto'
    isDarkMode,   // Computed boolean
    setTheme,     // Set specific theme
    toggleTheme,  // Toggle light/dark
  } = useTheme();

  return (
    <div>
      <p>Current: {isDarkMode ? 'Dark' : 'Light'}</p>
      <button onClick={toggleTheme}>Toggle</button>
      <select value={theme} onChange={e => setTheme(e.target.value)}>
        <option value="auto">Auto (follow Eagle)</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </div>
  );
}
```

### Eagle Theme Mapping

| Eagle Theme | isDarkMode |
|-------------|------------|
| LIGHT       | `false`    |
| LIGHTGRAY   | `false`    |
| GRAY        | `true`     |
| DARK        | `true`     |
| BLUE        | `true`     |
| PURPLE      | `true`     |
| Auto        | System pref|

### Design Tokens

CSS variables defined in `src/styles/globals.css`:

```css
:root {
  --eagle-bg-primary: #ffffff;
  --eagle-bg-secondary: #f9fafb;
  --eagle-text-primary: #111827;
  --eagle-accent-primary: #3b82f6;
  --eagle-border: #e5e7eb;
}

.dark {
  --eagle-bg-primary: #0d1117;
  --eagle-bg-secondary: #161b22;
  --eagle-text-primary: #f0f6fc;
  --eagle-accent-primary: #58a6ff;
  --eagle-border: #30363d;
}
```

Use in components via Tailwind:
```tsx
<div className="bg-eagle-bg-primary text-eagle-text-primary">
  <span className="text-eagle-accent-primary">Accent text</span>
</div>
```

---

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server at http://localhost:5173 with HMR |
| `npm run build` | TypeScript check + Vite production build |
| `npm run build:watch` | Build with file watching |
| `npm run deploy` | Build + copy to Eagle plugins directory |
| `npm run typecheck` | Run TypeScript type checking only |
| `npm run test` | Run tests in watch mode |
| `npm run test:run` | Run tests once |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Run ESLint with auto-fix |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check code formatting |
| `npm run create-plugin` | Interactive CLI to scaffold new plugin |
| `npm run preview` | Preview production build locally |

---

## 🔧 Configuration

### manifest.json

Eagle plugin manifest - **required fields**:

```json
{
  "id": "your-unique-uuid",              // Generate unique UUID
  "version": "1.0.0",
  "platform": "all",                      // "all" | "darwin" | "win32"
  "arch": "all",                          // "all" | "x64" | "arm64"
  "name": "{{manifest.app.name}}",        // i18n key for plugin name
  "logo": "/logo.png",                    // Plugin icon
  "keywords": ["your", "keywords"],
  "fallbackLanguage": "en",
  "languages": ["en", "zh_TW", "zh_CN", "ja_JP", "ko_KR", "de_DE", "es_ES", "ru_RU"],
  "devTools": true,                       // Enable DevTools (Cmd+Option+I)
  "main": {
    "url": "index.html",                  // Entry point (relative to plugin root)
    "width": 1024,
    "height": 720,
    "minWidth": 800,
    "minHeight": 600,
    "maxWidth": 1600,
    "maxHeight": 1000,
    "frame": false,                       // Frameless window (custom header)
    "vibrancy": true,                     // macOS translucency
    "maximizable": true,
    "minimizable": true,
    "fullscreenable": true
  }
}
```

### vite.config.ts

Critical settings for Eagle compatibility:

```typescript
export default defineConfig({
  base: './',  // ⚠️ MUST be relative for Eagle
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: undefined,  // Single bundle (Eagle requirement)
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@lib': path.resolve(__dirname, './src/lib'),
    },
  },
});
```

### tailwind.config.js

Eagle-specific extensions:

```javascript
module.exports = {
  darkMode: 'class',  // Class-based dark mode
  theme: {
    extend: {
      colors: {
        eagle: {
          bg: { primary: 'var(--eagle-bg-primary)', /* ... */ },
          text: { primary: 'var(--eagle-text-primary)', /* ... */ },
          accent: { primary: 'var(--eagle-accent-primary)', /* ... */ },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
      },
    },
  },
};
```

---

## 🐛 Debugging

### Option 1: Browser Development (Mock API)

```bash
npm run dev
```

- Open http://localhost:5173
- Uses **mock Eagle API** - no real Eagle data
- Full hot reload (HMR) support
- Open DevTools: `Cmd+Option+I` (Mac) / `F12` (Windows)
- Check `eagleApi.isMock === true` to verify mock mode

### Option 2: Eagle Development (Real API + Watch Mode) ⭐ Recommended

Develop directly in Eagle with real data and near-instant rebuilds:

```bash
npm run build:watch
```

Then import the **project root folder** (not `dist/`) into Eagle:
1. **Settings** → **Plugins** → **Developer**
2. Click **"Import Local Project"**
3. Select **this project's root folder** (contains `manifest.json`)
4. The plugin loads `dist/index.html` as configured in manifest

**How it works:** The `manifest.json` in the root folder points to `dist/index.html`. Eagle reads this config and loads the built output. With `build:watch` running, Vite rebuilds on every file change. Press `Cmd+R` to reload the plugin and see updates.

> **Tip:** This gives you real Eagle API access + fast iteration, similar to browser HMR but with actual data.

### Eagle DevTools

- Open DevTools in Eagle: `Cmd+Option+I` (Mac) / `F12` (Windows)
- Reload plugin after changes: `Cmd+R` / `Ctrl+R`
- Check `eagleApi.isMock === false` to verify real API mode

**Common Issues:**

| Issue | Solution |
|-------|----------|
| Changes not appearing | Press `Cmd+R` to reload, or restart Eagle |
| `window.eagle undefined` | Check `isEagleEnvironment()` before API calls |
| i18n not loading | Check `manifest.json` languages array |
| Theme not syncing | Verify `useTheme` hook is used |

---

## 📋 Development Checklist

Before releasing:

- [ ] Run `npm run test` - all tests pass
- [ ] Run `npm run typecheck` - no TypeScript errors
- [ ] Run `npm run lint` - no ESLint errors
- [ ] Test in browser (`npm run dev`) with mock data
- [ ] Test in Eagle (`npm run deploy`)
- [ ] Verify all 8 languages display correctly
- [ ] Test dark/light theme transitions
- [ ] Test with 0, 1, and 10+ selected items
- [ ] Verify localStorage persistence across sessions
- [ ] Check all buttons/forms work in both environments
- [ ] Validate toast notifications display properly
- [ ] Test window drag region (Header)

---

## 🛠️ Creating a New Plugin

1. **Clone this template:**
   ```bash
   git clone https://github.com/your-org/eagle-react-template my-plugin
   cd my-plugin
   npm install
   ```

2. **Update manifest.json:**
   - Generate new UUID for `id`
   - Update `name` key to match your translation key
   - Adjust window dimensions as needed

3. **Update translations:**
   - Edit all files in `_locales/`
   - Update `manifest.app.name` in each file

4. **Develop:**
   ```bash
   npm run dev
   ```

5. **Deploy:**
   ```bash
   npm run deploy
   ```

---

## 📄 License

MIT

## 🙏 Credits

- [Eagle](https://eagle.cool) - Powerful asset management for creatives
- [Vite](https://vitejs.dev) - Next generation frontend tooling
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework
- [Lucide](https://lucide.dev) - Beautiful & consistent icons
- [i18next](https://www.i18next.com) - Internationalization framework
- [class-variance-authority](https://cva.style) - Type-safe component variants
