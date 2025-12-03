---
sidebar_position: 3
title: Mock System
description: Configurable mock data for browser development and testing
---

# Mock System

The mock system provides configurable fake data for browser development. Test edge cases, stress test performance, and develop without Eagle running.

## Overview

When running in browser (`npm run dev`), the Eagle API is replaced with a mock implementation:

```typescript
import { eagleApi } from '@/lib/eagle-api';

console.log(eagleApi.isMock); // true in browser

const items = await eagleApi.getSelectedItems();
// Returns mock items with realistic data
```

## Quick Configuration

### URL Parameters

Configure mocks directly in the URL:

```
http://localhost:5173/?mockItems=50&mockPreset=largeLibrary&mockTheme=dark
```

| Parameter | Values | Description |
|-----------|--------|-------------|
| `mockItems` | `0-1000` | Number of mock items |
| `mockFolders` | `0-100` | Number of mock folders |
| `mockPreset` | Preset name | Use a preset configuration |
| `mockTheme` | `light`, `dark` | Force theme |
| `mockLocale` | `en`, `zh_CN`, etc. | Force locale |

### Console API

For dynamic testing, use the global `mockEagle` object:

```javascript
// In browser DevTools console

// Load a preset
window.mockEagle.preset('largeLibrary');

// Custom configuration
window.mockEagle.setConfig({
  selectedItemCount: 100,
  folderCount: 20,
  theme: 'DARK',
});

// Simulate API errors
window.mockEagle.simulateError('getSelectedItems', 'Network timeout');

// Reset to defaults
window.mockEagle.reset();
```

## Presets

Pre-configured scenarios for common testing needs:

| Preset | Items | Folders | Use Case |
|--------|-------|---------|----------|
| `empty` | 0 | 0 | Empty state UI |
| `single` | 1 | 1 | Single item handling |
| `default` | 10 | 3 | Normal usage |
| `largeLibrary` | 100 | 20 | Performance testing |
| `stressTest` | 1000 | 50 | Stress testing |

### Using Presets

```javascript
// Console
window.mockEagle.preset('stressTest');

// URL
http://localhost:5173/?mockPreset=largeLibrary
```

## Programmatic Configuration

### In Code

```typescript
import { mockController, createMockItems } from '@/lib/mock-factory';

// Set configuration
mockController.setConfig({
  selectedItemCount: 50,
  folderCount: 10,
  theme: 'DARK',
  locale: 'zh_CN',
});

// Create custom items
const customItems = createMockItems(20, {
  ext: 'png',
  tags: ['processed'],
  star: 5,
});

mockController.setConfig({ customItems });
```

### Mock Factory Functions

```typescript
import {
  createMockItem,
  createMockItems,
  createMockFolder,
  createMockFolders,
  createMockTag,
  createMockTags,
} from '@/lib/mock-factory';

// Single item with options
const item = createMockItem({
  name: 'Test Image',
  ext: 'png',
  width: 1920,
  height: 1080,
  tags: ['test', 'mock'],
});

// Multiple items
const items = createMockItems(50, {
  ext: 'jpg',
  star: 3,
});

// Folder hierarchy
const folders = createMockFolders(5, {
  childCount: 3, // 3 subfolders each
});

// Tags
const tags = createMockTags(20);
```

## Mock Data Structure

### Mock Item

```typescript
interface MockItem {
  id: string;              // 'mock-item-1'
  name: string;            // 'Mock Image 1'
  ext: string;             // 'png', 'jpg', etc.
  width: number;           // 1920
  height: number;          // 1080
  size: number;            // File size in bytes
  filePath: string;        // '/mock/path/to/image.png'
  thumbnailURL: string;    // Data URL or placeholder
  tags: string[];          // ['tag1', 'tag2']
  folders: string[];       // Folder IDs
  star: number;            // 0-5
  annotation: string;      // User notes
  url: string;             // Source URL
  modificationTime: number; // Unix timestamp
  // ... more properties
}
```

### Mock Folder

```typescript
interface MockFolder {
  id: string;              // 'mock-folder-1'
  name: string;            // 'Mock Folder 1'
  children: MockFolder[];  // Subfolders
  // ... more properties
}
```

## Error Simulation

Test error handling by simulating API failures:

```javascript
// Simulate network error
window.mockEagle.simulateError('getSelectedItems', 'Network timeout');

// Simulate empty response
window.mockEagle.simulateError('getSelectedItems', null);

// Clear error simulation
window.mockEagle.clearErrors();
```

### In Your Code

```tsx
async function fetchItems() {
  try {
    const items = await eagleApi.getSelectedItems();
    setItems(items);
  } catch (error) {
    // This catches simulated errors too
    showErrorToast(error.message);
  }
}
```

## Theme and Locale Mocking

### Theme

```javascript
// Force dark mode
window.mockEagle.setConfig({ theme: 'DARK' });

// Force light mode
window.mockEagle.setConfig({ theme: 'LIGHT' });

// Test auto theme
window.mockEagle.setConfig({ theme: 'Auto' });
```

### Locale

```javascript
// Test different languages
window.mockEagle.setConfig({ locale: 'ja_JP' }); // Japanese
window.mockEagle.setConfig({ locale: 'zh_CN' }); // Chinese
window.mockEagle.setConfig({ locale: 'de_DE' }); // German
```

## Testing Patterns

### Unit Tests

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { mockController, createMockItems } from '@/lib/mock-factory';

describe('ItemList', () => {
  beforeEach(() => {
    mockController.reset();
  });

  it('shows empty state when no items', async () => {
    mockController.preset('empty');
    
    render(<ItemList />);
    
    expect(screen.getByText('No items selected')).toBeInTheDocument();
  });

  it('handles large datasets', async () => {
    mockController.setConfig({ selectedItemCount: 1000 });
    
    render(<ItemList />);
    
    // Should use virtualization
    expect(screen.queryAllByRole('listitem').length).toBeLessThan(100);
  });
});
```

### Integration Tests

```typescript
import { test, expect } from '@playwright/test';

test('loads with preset', async ({ page }) => {
  await page.goto('/?mockPreset=largeLibrary');
  
  // Should show 100 items
  await expect(page.getByText('100 items')).toBeVisible();
});
```

## Best Practices

### 1. Use Presets for Common Scenarios

```javascript
// Don't manually configure every time
// ❌ 
mockController.setConfig({ selectedItemCount: 100, folderCount: 20 });

// ✅
mockController.preset('largeLibrary');
```

### 2. Reset Between Tests

```typescript
beforeEach(() => {
  mockController.reset();
});
```

### 3. Test Edge Cases

```javascript
// Empty state
mockController.preset('empty');

// Single item (boundary condition)
mockController.preset('single');

// Large dataset (performance)
mockController.preset('stressTest');
```

### 4. Document Mock Dependencies

```typescript
// If a test requires specific mock data, document it
/**
 * @requires mockPreset: largeLibrary
 * @requires mockTheme: DARK
 */
it('renders grid with dark theme', async () => {
  mockController.preset('largeLibrary');
  mockController.setConfig({ theme: 'DARK' });
  // ...
});
```

## Next Steps

- **[Theme & i18n](./theme-i18n)** — Sync with Eagle's settings
- **[Components](/docs/components/overview)** — UI components
