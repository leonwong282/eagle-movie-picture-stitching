---
sidebar_position: 2
title: Item Operations
description: CRUD operations for Eagle library items
---

# Item Operations

Work with items (images, videos, documents) in the Eagle library. These are the most commonly used API methods.

## Import

```tsx
import { eagleApi } from '@/lib/eagle-api';
```

## Get Selected Items

Retrieve currently selected items in Eagle's main window.

```tsx
const items = await eagleApi.item.getSelected();
```

**Returns:** `Promise<EagleItem[]>`

### EagleItem Type

```tsx
interface EagleItem {
  id: string;              // Unique item ID
  name: string;            // Display name (without extension)
  ext: string;             // File extension (e.g., 'png', 'jpg')
  width: number;           // Image width in pixels
  height: number;          // Image height in pixels
  size: number;            // File size in bytes
  filePath: string;        // Absolute file path
  fileURL: string;         // File URL (file:// protocol)
  thumbnail: string;       // Thumbnail path
  
  // Metadata
  tags: string[];          // Tag names
  folders: string[];       // Folder IDs
  star: number;            // Rating 0-5
  annotation: string;      // Notes/description
  url: string;             // Source URL
  
  // Timestamps
  modificationTime: number; // Last modified (Unix ms)
  palettes: string[];      // Extracted color palette
}
```

### Example: Display Selection

```tsx
import { eagleApi } from '@/lib/eagle-api';
import { useEffect, useState } from 'react';

function SelectionDisplay() {
  const [items, setItems] = useState<EagleItem[]>([]);

  useEffect(() => {
    async function loadSelection() {
      const selected = await eagleApi.item.getSelected();
      setItems(selected);
    }
    loadSelection();
  }, []);

  return (
    <div>
      <h2>{items.length} items selected</h2>
      <ul>
        {items.map(item => (
          <li key={item.id}>
            {item.name}.{item.ext} ({item.width}×{item.height})
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## Get Items by Criteria

Query items with filters.

```tsx
const items = await eagleApi.item.get(options);
```

**Parameters:**

| Option | Type | Description |
|--------|------|-------------|
| `id` | `string` | Single item ID |
| `ids` | `string[]` | Multiple item IDs |
| `isSelected` | `boolean` | Currently selected items |
| `isUntagged` | `boolean` | Items without tags |
| `isUnfiled` | `boolean` | Items not in any folder |
| `keywords` | `string[]` | Search keywords |
| `tags` | `string[]` | Filter by tags |
| `folders` | `string[]` | Filter by folder IDs |
| `ext` | `string` | Filter by extension |
| `rating` | `number` | Filter by star rating |

### Example: Get Untagged Images

```tsx
const untaggedImages = await eagleApi.item.get({
  isUntagged: true,
  ext: 'png',
});
```

### Example: Search by Keywords

```tsx
const results = await eagleApi.item.get({
  keywords: ['landscape', 'mountain'],
});
```

## Get Item by ID

Retrieve a specific item by its ID.

```tsx
const item = await eagleApi.item.getById(itemId);
```

**Parameters:**
- `itemId: string` - The item's unique ID

**Returns:** `Promise<EagleItem | null>`

```tsx
const item = await eagleApi.item.getById('ABCD1234');
if (item) {
  console.log(`Found: ${item.name}`);
} else {
  console.log('Item not found');
}
```

## Add Item from File Path

Add a file to the Eagle library.

```tsx
const itemId = await eagleApi.item.addFromPath(filePath, options);
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `filePath` | `string` | Yes | Absolute path to file |
| `options.name` | `string` | No | Display name |
| `options.tags` | `string[]` | No | Tags to apply |
| `options.folders` | `string[]` | No | Folder IDs to add to |
| `options.annotation` | `string` | No | Notes/description |
| `options.website` | `string` | No | Source URL |
| `options.star` | `number` | No | Rating 0-5 |

**Returns:** `Promise<string>` - The new item's ID

### Example: Add Processed Image

```tsx
async function saveResult(canvas: HTMLCanvasElement) {
  // Save canvas to temp file
  const tempPath = await saveCanvasToTemp(canvas);
  
  // Add to Eagle library
  const itemId = await eagleApi.item.addFromPath(tempPath, {
    name: 'Processed Result',
    tags: ['processed', 'plugin-output'],
    annotation: `Created on ${new Date().toLocaleDateString()}`,
  });
  
  // Cleanup temp file
  await deleteFile(tempPath);
  
  return itemId;
}
```

## Add Item from URL

Download and add an image from a URL.

```tsx
const itemId = await eagleApi.item.addFromURL(url, options);
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `url` | `string` | Yes | Image URL to download |
| `options.name` | `string` | No | Display name |
| `options.tags` | `string[]` | No | Tags to apply |
| `options.folders` | `string[]` | No | Folder IDs |
| `options.website` | `string` | No | Source website |

**Returns:** `Promise<string>` - The new item's ID

```tsx
const itemId = await eagleApi.item.addFromURL(
  'https://example.com/image.png',
  {
    name: 'Downloaded Image',
    website: 'https://example.com',
    tags: ['downloaded'],
  }
);
```

## Add Item from Base64

Add an image from a base64-encoded string.

```tsx
const itemId = await eagleApi.item.addFromBase64(base64, options);
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `base64` | `string` | Yes | Base64-encoded image data |
| `options.name` | `string` | No | Display name |
| `options.ext` | `string` | No | File extension |
| `options.tags` | `string[]` | No | Tags to apply |

**Returns:** `Promise<string>` - The new item's ID

```tsx
// From canvas
const base64 = canvas.toDataURL('image/png').split(',')[1];
const itemId = await eagleApi.item.addFromBase64(base64, {
  name: 'Canvas Export',
  ext: 'png',
});
```

## Add Bookmark

Add a URL bookmark to the library.

```tsx
const itemId = await eagleApi.item.addBookmark(url, options);
```

```tsx
await eagleApi.item.addBookmark('https://example.com/article', {
  name: 'Interesting Article',
  tags: ['reference', 'article'],
});
```

## Open Item

Open an item in Eagle's viewer or external application.

```tsx
await eagleApi.item.open(itemId);
```

```tsx
// Open first selected item
const items = await eagleApi.item.getSelected();
if (items.length > 0) {
  await eagleApi.item.open(items[0].id);
}
```

## Refresh Thumbnail

Regenerate an item's thumbnail.

```tsx
await eagleApi.item.refreshThumbnail(itemId);
```

Useful after modifying an item's file externally.

## Get All Items

Get all items in the library (use with caution for large libraries).

```tsx
const allItems = await eagleApi.item.getAll();
```

:::warning Performance
This can be slow for libraries with thousands of items. Prefer `get()` with filters.
:::

## Browser vs Eagle Behavior

| Method | Browser (Mock) | Eagle |
|--------|----------------|-------|
| `getSelected()` | Returns mock items | Returns real selection |
| `addFromPath()` | Simulates add, returns fake ID | Adds real file |
| `addFromURL()` | No network request | Downloads image |
| `open()` | No-op | Opens in viewer |

## Error Handling

```tsx
try {
  const itemId = await eagleApi.item.addFromPath(filePath, options);
  toast.success(`Added item: ${itemId}`);
} catch (error) {
  if (error.message.includes('not found')) {
    toast.error('File not found');
  } else if (error.message.includes('permission')) {
    toast.error('Permission denied');
  } else {
    toast.error('Failed to add item');
  }
}
```

## Related

- [Eagle API Overview](./overview) - API introduction
- [Folder Operations](./folder-operations) - Organize items
- [Tag Operations](./tag-operations) - Tag management
- [useEagleSelection](../hooks/use-eagle-selection) - Selection hook
