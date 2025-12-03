---
sidebar_position: 1
title: Eagle API Overview
description: Understanding the Eagle Plugin API and adapter pattern
---

# Eagle API Overview

The Eagle React Template provides a **type-safe wrapper** around Eagle's Plugin API, enabling seamless development in both browser and Eagle runtime environments.

## The Problem

Eagle's Plugin API (`window.eagle`) is only available when running inside Eagle:

```tsx
// ❌ Crashes in browser development
const items = await window.eagle.item.getSelected();
// TypeError: Cannot read properties of undefined
```

## The Solution: API Adapter

The template provides `eagleApi` - a singleton adapter that works everywhere:

```tsx
import { eagleApi, isEagleEnvironment } from '@/lib/eagle-api';

// ✅ Works in browser (mock data) AND Eagle (real data)
const items = await eagleApi.item.getSelected();
```

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                  Your Plugin Code                    │
│                                                      │
│   import { eagleApi } from '@/lib/eagle-api'        │
└─────────────────────┬───────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────┐
│                 EagleAPIAdapter                      │
│                                                      │
│   • Environment detection                            │
│   • Safe property access (try-catch)                │
│   • Consistent interface                             │
└─────────────────────┬───────────────────────────────┘
                      │
          ┌───────────┴───────────┐
          ▼                       ▼
┌─────────────────┐     ┌─────────────────┐
│  Browser Mode   │     │   Eagle Mode    │
│                 │     │                 │
│  Mock Factory   │     │  window.eagle   │
│  (Fake Data)    │     │  (Real API)     │
└─────────────────┘     └─────────────────┘
```

## Environment Detection

### Check Runtime Environment

```tsx
import { isEagleEnvironment, hasNodeRequire } from '@/lib/eagle-api';

// Check if running in Eagle
if (isEagleEnvironment()) {
  console.log('Running in Eagle desktop app');
} else {
  console.log('Running in browser (development mode)');
}

// Check if Node.js require() is available
if (hasNodeRequire()) {
  const fs = require('fs');
  const path = require('path');
}
```

### Adapter Properties

```tsx
import { eagleApi } from '@/lib/eagle-api';

// Environment info
eagleApi.isMock        // true in browser, false in Eagle
eagleApi.isDarkMode    // Computed from Eagle theme or system preference
eagleApi.locale        // 'en', 'zh_CN', 'zh_TW', etc.

// Plugin info (Eagle only)
eagleApi.plugin.id     // Plugin UUID
eagleApi.plugin.path   // Plugin installation path
eagleApi.plugin.manifest // Plugin manifest object
```

## API Categories

The Eagle API is organized into these categories:

| Category | Description | Key Methods |
|----------|-------------|-------------|
| [Item Operations](./item-operations) | Work with library items | `getSelected`, `addFromPath`, `open` |
| [Folder Operations](./folder-operations) | Manage folders | `getAll`, `create`, `getSelected` |
| [Tag Operations](./tag-operations) | Manage tags | `getAll`, `create`, `get` |
| [Window Controls](./window-controls) | Plugin window | `show`, `hide`, `setSize` |
| [Dialogs](./dialogs) | System dialogs | `showOpenDialog`, `showSaveDialog` |
| [Clipboard](./clipboard) | Clipboard access | `writeText`, `readText`, `writeImage` |
| [Notifications](./notifications) | User notifications | `showNotification` |
| [Events & Lifecycle](./events-lifecycle) | Plugin lifecycle | `onPluginCreate`, `onPluginShow` |

## Quick Start

### Get Selected Items

```tsx
import { eagleApi } from '@/lib/eagle-api';

async function showSelection() {
  const items = await eagleApi.item.getSelected();
  
  console.log(`${items.length} items selected`);
  
  items.forEach(item => {
    console.log(`- ${item.name} (${item.ext})`);
    console.log(`  Path: ${item.filePath}`);
    console.log(`  Size: ${item.width}x${item.height}`);
  });
}
```

### Add Image to Library

```tsx
import { eagleApi } from '@/lib/eagle-api';

async function addProcessedImage(filePath: string) {
  const itemId = await eagleApi.item.addFromPath(filePath, {
    name: 'Processed Image',
    tags: ['processed', 'plugin-output'],
    annotation: 'Created by My Plugin',
  });
  
  console.log(`Added item: ${itemId}`);
}
```

### Show System Dialog

```tsx
import { eagleApi } from '@/lib/eagle-api';

async function selectOutputFolder() {
  const result = await eagleApi.dialog.showOpenDialog({
    title: 'Select Output Folder',
    properties: ['openDirectory', 'createDirectory'],
  });
  
  if (!result.canceled && result.filePaths.length > 0) {
    return result.filePaths[0];
  }
  return null;
}
```

## Safe Initialization

The adapter uses try-catch for all property getters to handle the timing between module load and Eagle's `plugin-create` event:

```tsx
// Inside EagleAPIAdapter
get locale(): EagleLocale {
  try {
    return this._api.app?.locale || 'en';
  } catch {
    return 'en';  // Safe default before API is ready
  }
}
```

This allows safe access during module initialization:

```tsx
// Safe to use at module level
import { eagleApi } from '@/lib/eagle-api';

const initialLocale = eagleApi.locale; // Won't throw
```

## Mock System

In browser development, the adapter returns mock data:

```tsx
// Browser development mode
const items = await eagleApi.item.getSelected();
// Returns: [{ id: 'mock-1', name: 'Sample Image', ... }, ...]
```

Configure mock behavior:

```tsx
// URL parameters
// ?mockItems=50 - Set number of mock items
// ?mockPreset=largeLibrary - Use preset configuration

// Console API
window.mockEagle.preset('largeLibrary');
window.mockEagle.simulateError('getSelectedItems', 'Network error');
window.mockEagle.reset();
```

See [Mock System](../core-concepts/mock-system) for details.

## Type Safety

Full TypeScript definitions for all API methods:

```tsx
import type { 
  EagleItem, 
  EagleFolder, 
  EagleTag,
  OpenDialogOptions,
  SaveDialogOptions,
} from '@/types/eagle';

// Type-safe item access
const items: EagleItem[] = await eagleApi.item.getSelected();
items.forEach(item => {
  const name: string = item.name;
  const tags: string[] = item.tags;
  const rating: number = item.star;  // 0-5
});
```

## Best Practices

### ✅ Do

```tsx
// Always use the adapter
import { eagleApi } from '@/lib/eagle-api';
const items = await eagleApi.item.getSelected();

// Check environment when needed
if (isEagleEnvironment()) {
  // Eagle-specific code
}

// Handle errors gracefully
try {
  await eagleApi.item.addFromPath(path, options);
} catch (error) {
  toast.error('Failed to add item', error.message);
}
```

### ❌ Don't

```tsx
// Never access window.eagle directly
const items = await window.eagle.item.getSelected(); // Crashes in browser!

// Don't assume Eagle is always available
if (window.eagle) { // Fragile check
  // ...
}
```

## Related

- [Item Operations](./item-operations) - Work with library items
- [Mock System](../core-concepts/mock-system) - Mock configuration
- [Dual Environment](../core-concepts/dual-environment) - Environment pattern
