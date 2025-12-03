---
sidebar_position: 2
title: Browser Development
description: Mock system for rapid UI development
---

# Browser Development

Browser development mode provides a complete mock Eagle API, enabling rapid UI development without the Eagle desktop app.

## Starting Browser Dev Mode

```bash
npm run dev
```

Opens `http://localhost:5173` with:
- Hot Module Replacement (HMR)
- Mock Eagle API with configurable data
- Console debugging tools
- URL parameter controls

## Mock System Overview

The mock system in `src/lib/mock-factory.ts` provides:

- Simulated Eagle API responses
- Configurable item counts and types
- Preset scenarios for testing
- Error simulation for edge cases

### Detecting Mock Mode

```tsx
import { eagleApi, isEagleEnvironment } from '@/lib/eagle-api';

// Check if running in mock mode
if (eagleApi.isMock) {
  console.log('Running with mock Eagle API');
}

// Check environment
if (!isEagleEnvironment()) {
  console.log('Browser development mode');
}
```

## URL Parameters

Control mock behavior via URL parameters:

| Parameter | Values | Description |
|-----------|--------|-------------|
| `mockItems` | `0-1000` | Number of selected items |
| `mockPreset` | See presets | Load preset configuration |
| `mockTheme` | `light`, `dark` | Force theme |
| `mockLocale` | `en`, `zh_CN`, etc. | Force locale |
| `mockErrors` | `true`, `false` | Enable random errors |
| `mockPlatform` | `darwin`, `win32` | Simulate platform |

### Examples

```
# 50 selected items
http://localhost:5173/?mockItems=50

# Large library preset
http://localhost:5173/?mockPreset=largeLibrary

# Dark theme with Japanese locale
http://localhost:5173/?mockTheme=dark&mockLocale=ja_JP

# Simulate errors
http://localhost:5173/?mockErrors=true
```

## Presets

Pre-configured scenarios for common testing needs:

| Preset | Items | Folders | Tags | Use Case |
|--------|-------|---------|------|----------|
| `empty` | 0 | 0 | 0 | Empty state testing |
| `single` | 1 | 1 | 1 | Single item scenarios |
| `default` | 10 | 3 | 5 | Normal usage |
| `largeLibrary` | 100 | 20 | 50 | Performance testing |
| `stressTest` | 1000 | 50 | 200 | Stress testing |

### File Type Presets

| Preset | Contents |
|--------|----------|
| `imagesOnly` | JPG, PNG, GIF, WebP files |
| `videosOnly` | MP4, WebM, MOV files |
| `mixedMedia` | Images + Videos |
| `documents` | PDF, DOC, TXT files |
| `design` | PSD, AI, Sketch, Figma files |

## Console Commands

Access mock controls via browser console:

### Configuration

```javascript
// View current configuration
window.mockEagle.getConfig();

// Set number of items
window.mockEagle.setConfig({ selectedItemCount: 50 });

// Multiple options
window.mockEagle.setConfig({
  selectedItemCount: 100,
  folderCount: 20,
  tagCount: 50
});
```

### Presets

```javascript
// Load preset
window.mockEagle.preset('largeLibrary');
window.mockEagle.preset('stressTest');
window.mockEagle.preset('empty');

// Reset to defaults
window.mockEagle.reset();
```

### Error Simulation

```javascript
// Simulate API error
window.mockEagle.simulateError('getSelectedItems', 'API unavailable');
window.mockEagle.simulateError('addFromPath', 'Permission denied');

// Clear all simulated errors
window.mockEagle.clearErrors();

// Check active errors
window.mockEagle.getErrors();
```

### Data Inspection

```javascript
// Get current mock items
window.mockEagle.getItems();

// Get current mock folders
window.mockEagle.getFolders();

// Get mock library info
window.mockEagle.getLibrary();
```

## Mock Data Structure

### Mock Item

```typescript
interface MockItem {
  id: string;           // 'mock-item-1'
  name: string;         // 'Sample Image 1'
  ext: string;          // 'jpg'
  width: number;        // 1920
  height: number;       // 1080
  size: number;         // 1048576 (bytes)
  star: number;         // 0-5
  tags: string[];       // ['tag1', 'tag2']
  folders: string[];    // ['folder-1']
  annotation: string;   // ''
  url: string;          // ''
  palettes: [];         // Color palettes
  isDeleted: boolean;   // false
  noThumbnail: boolean; // false
  noPreview: boolean;   // false
  importedAt: number;   // timestamp
  modificationTime: number;
  filePath: string;     // '/mock/path/image.jpg'
  fileURL: string;      // 'file:///mock/path/image.jpg'
  thumbnailPath: string;
  thumbnailURL: string;
}
```

### Mock Folder

```typescript
interface MockFolder {
  id: string;           // 'mock-folder-1'
  name: string;         // 'Sample Folder'
  description: string;  // ''
  icon: string;         // 'folder'
  iconColor: string;    // '#4A90D9'
  createdAt: number;    // timestamp
  children: Folder[];   // Nested folders
}
```

## Customizing Mock Data

### Programmatic Configuration

```typescript
import { mockController } from '@/lib/mock-factory';

// In development code
if (import.meta.env.DEV) {
  mockController.setConfig({
    selectedItemCount: 25,
    itemTypes: ['jpg', 'png', 'gif'],
    includeStarred: true,
    includeTagged: true,
  });
}
```

### Creating Custom Items

```typescript
import { createMockItem, createMockItems } from '@/lib/mock-factory';

// Single item with options
const item = createMockItem({
  name: 'Custom Image',
  ext: 'png',
  width: 2000,
  height: 1500,
  star: 5,
  tags: ['featured', 'hero'],
});

// Multiple items
const items = createMockItems(10, {
  ext: 'jpg',
  star: 3,
});
```

## Development Tips

### Testing Empty States

```javascript
window.mockEagle.preset('empty');
// Or
window.mockEagle.setConfig({ selectedItemCount: 0 });
```

### Testing Error Handling

```javascript
// Simulate network error
window.mockEagle.simulateError('getSelectedItems', 'Network error');

// Test error recovery
window.mockEagle.clearErrors();
```

### Testing Performance

```javascript
// Large dataset
window.mockEagle.preset('stressTest');

// Monitor render performance in DevTools
// Performance tab → Record → Interact → Stop
```

### Testing Different Platforms

```
# macOS behavior
http://localhost:5173/?mockPlatform=darwin

# Windows behavior
http://localhost:5173/?mockPlatform=win32
```

## Limitations

Mock mode has some limitations compared to real Eagle:

| Feature | Mock | Real Eagle |
|---------|------|------------|
| File operations | Simulated | Actual files |
| Thumbnails | Placeholder images | Real thumbnails |
| Selection sync | Manual refresh | Live updates |
| Library changes | Not persisted | Persisted |
| Window controls | No-op | Actual window |

## Related

- [Eagle Watch Mode](./eagle-watch) - Testing with real Eagle
- [Debugging](./debugging) - Debug tools and techniques
- [Mock System](../core-concepts/mock-system) - Architecture details
