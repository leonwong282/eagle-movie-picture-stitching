---
sidebar_position: 4
title: Project Structure
description: Understanding the Eagle React Template file organization
---

# Project Structure

This guide explains the file organization and key directories in the Eagle React Template.

## Overview

```
eagle-react-template/
├── 📁 _locales/              # Internationalization (8 languages)
├── 📁 docs/                  # Docusaurus documentation (this site)
├── 📁 e2e/                   # Playwright E2E tests
├── 📁 public/                # Static assets (logo, favicon)
├── 📁 scripts/               # Build and deployment scripts
├── 📁 src/                   # Application source code
├── 📄 index.html             # HTML entry point
├── 📄 manifest.json          # Eagle plugin manifest
├── 📄 package.json           # Dependencies and scripts
├── 📄 tailwind.config.js     # Tailwind CSS configuration
├── 📄 tsconfig.json          # TypeScript configuration
└── 📄 vite.config.ts         # Vite build configuration
```

## Source Directory (`src/`)

The main application code:

```
src/
├── 📁 components/
│   ├── 📁 ui/                # UI Component Library
│   │   ├── Button.tsx        # Button with 7 variants
│   │   ├── Card.tsx          # Glass-morphic cards
│   │   ├── Dialog.tsx        # Modal dialogs (Radix UI)
│   │   ├── DropdownMenu.tsx  # Context menus (Radix UI)
│   │   ├── Form.tsx          # Input, Select, Checkbox, Slider
│   │   ├── Header.tsx        # App header with drag region
│   │   ├── Image.tsx         # EagleImage, ImageGrid
│   │   ├── Popover.tsx       # Popovers (Radix UI)
│   │   ├── Tabs.tsx          # Tab navigation (Radix UI)
│   │   ├── Toast.tsx         # Notifications
│   │   ├── Tooltip.tsx       # Tooltips (Radix UI)
│   │   ├── ErrorBoundary.tsx # Error handling
│   │   └── index.ts          # Barrel exports
│   └── index.ts
│
├── 📁 demos/                 # Interactive demo components
│   ├── SelectionDemo.tsx     # Eagle selection showcase
│   ├── ComponentsDemo.tsx    # UI components showcase
│   ├── FormsDemo.tsx         # Form controls demo
│   ├── DialogsDemo.tsx       # Overlay components demo
│   ├── CanvasDemo.tsx        # Canvas rendering demo
│   ├── StorageDemo.tsx       # Persistence demo
│   ├── TemplatesDemo.tsx     # Plugin templates demo
│   └── index.ts
│
├── 📁 hooks/                 # Custom React hooks
│   ├── useEagleSelection.ts  # ⭐ Polling-based selection tracking
│   ├── useTheme.ts           # Eagle theme synchronization
│   ├── useLocalStorage.ts    # Type-safe localStorage
│   ├── useLanguageSync.ts    # i18n with Eagle sync
│   └── index.ts
│
├── 📁 lib/                   # Core utilities
│   ├── eagle-api.ts          # ⭐ Eagle API Adapter (critical)
│   ├── mock-factory.ts       # Mock data generation
│   ├── i18n.ts               # i18next configuration
│   ├── storage.ts            # Namespaced localStorage
│   ├── canvas.ts             # Canvas utilities
│   └── utils.ts              # cn(), debounce, formatters
│
├── 📁 pages/                 # Page components
│   ├── DemoPage.tsx          # Main demo page with tabs
│   └── index.ts
│
├── 📁 stores/                # Zustand state management
│   ├── index.ts              # Main store with slices
│   ├── selectors.ts          # Memoized selectors
│   └── slices/               # Store slices
│       ├── selection.ts      # Eagle selection state
│       ├── settings.ts       # User preferences
│       ├── processing.ts     # Batch operations
│       └── ui.ts             # UI state
│
├── 📁 styles/
│   └── globals.css           # Tailwind + Eagle design tokens
│
├── 📁 templates/             # Ready-to-use plugin layouts
│   ├── SinglePanelTemplate.tsx
│   ├── SplitPanelTemplate.tsx
│   ├── SettingsPanelTemplate.tsx
│   ├── BatchProcessTemplate.tsx
│   ├── ImageBrowserTemplate.tsx
│   ├── ThreeColumnTemplate.tsx
│   └── index.ts
│
├── 📁 types/
│   └── eagle.d.ts            # ⭐ Complete Eagle API types
│
├── App.tsx                   # Main application component
└── main.tsx                  # Entry point (i18n + theme init)
```

## Key Files Explained

### `manifest.json` — Plugin Configuration

The Eagle plugin manifest defines your plugin's identity:

```json
{
  "id": "your-unique-plugin-id",
  "name": "{{manifest.app.name}}",          // i18n key
  "description": "{{manifest.app.description}}",
  "main": {
    "url": "dist/index.html",               // Entry point
    "devTools": true,                       // Enable DevTools
    "vibrancy": true,                       // macOS blur
    "minWidth": 800,
    "minHeight": 600
  },
  "languages": ["en", "zh_CN", "zh_TW", "ja_JP", ...],
  "fallbackLanguage": "en"
}
```

:::note Path Transformation
The `deploy.js` script transforms `dist/index.html` → `index.html` during deployment. Keep development paths in `manifest.json`.
:::

### `src/lib/eagle-api.ts` — Eagle API Adapter

The most critical file. Provides a unified interface for both browser and Eagle:

```typescript
class EagleAPIAdapter {
  private _api: EagleAPI | MockEagleAPI;
  private _isMock: boolean;

  constructor() {
    if (isEagleEnvironment()) {
      this._api = window.eagle;
      this._isMock = false;
    } else {
      this._api = createMockEagleAPI();
      this._isMock = true;
    }
  }

  // All Eagle API methods wrapped here
  async getSelectedItems() { ... }
  async addItemFromPath(path, options) { ... }
}

export const eagleApi = new EagleAPIAdapter();
```

### `src/types/eagle.d.ts` — Type Definitions

Complete TypeScript types for Eagle Plugin API v4.0:

```typescript
interface EagleAPI {
  app: EagleApp;
  item: EagleItemAPI;
  folder: EagleFolderAPI;
  tag: EagleTagAPI;
  window: EagleWindow;
  dialog: EagleDialog;
  // ... 50+ interfaces
}

interface Item {
  id: string;
  name: string;
  ext: string;
  filePath: string;
  thumbnailURL: string;
  // ... 30+ properties
}
```

### `tailwind.config.js` — Design Tokens

Eagle-specific color tokens and animations:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        // Semantic colors
        primary: 'oklch(var(--primary))',
        success: 'oklch(var(--success))',
        // Eagle-specific
        'eagle-bg': 'var(--eagle-bg-primary)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
    },
  },
};
```

## Locales Directory (`_locales/`)

Translation files for 8 languages:

```
_locales/
├── en.json       # English (fallback)
├── zh_CN.json    # Simplified Chinese
├── zh_TW.json    # Traditional Chinese
├── ja_JP.json    # Japanese
├── ko_KR.json    # Korean
├── de_DE.json    # German
├── es_ES.json    # Spanish
└── ru_RU.json    # Russian
```

Example structure:

```json
{
  "manifest": {
    "app": {
      "name": "Eagle React Template",
      "description": "Modern React template for Eagle plugins"
    }
  },
  "app": {
    "title": "Eagle React Template"
  },
  "demo": {
    "tabs": {
      "selection": "Selection",
      "components": "Components"
    }
  }
}
```

## Scripts Directory (`scripts/`)

Build and deployment utilities:

```
scripts/
├── deploy.js         # Cross-platform deployment
└── create-plugin.ts  # CLI scaffolding tool
```

The `deploy.js` script:
1. Runs `npm run build`
2. Transforms manifest paths
3. Copies to Eagle plugins directory
4. Handles macOS/Windows differences

## Import Aliases

The template configures path aliases in `vite.config.ts`:

```typescript
resolve: {
  alias: {
    '@': './src',
    '@components': './src/components',
    '@hooks': './src/hooks',
    '@lib': './src/lib',
  },
}
```

Usage:

```typescript
// Instead of relative paths
import { Button } from '../../../components/ui/Button';

// Use aliases
import { Button } from '@/components';
import { useTheme } from '@hooks';
import { eagleApi } from '@lib/eagle-api';
```

## Next Steps

Now that you understand the structure:

1. **[Core Concepts](/docs/core-concepts/dual-environment)** — Learn the architecture
2. **[Components](/docs/components/overview)** — Explore UI components
3. **[Eagle API](/docs/eagle-api/overview)** — Master the API wrapper
