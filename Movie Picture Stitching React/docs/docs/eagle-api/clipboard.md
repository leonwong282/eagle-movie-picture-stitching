---
sidebar_position: 7
title: Clipboard
description: System clipboard read and write operations
---

# Clipboard

Access the system clipboard to read and write text, images, and other data.

## Import

```tsx
import { eagleApi } from '@/lib/eagle-api';
```

## Text Operations

### Write Text

Copy text to the clipboard.

```tsx
await eagleApi.clipboard.writeText(text);
```

```tsx
async function copyToClipboard(text: string) {
  await eagleApi.clipboard.writeText(text);
  toast.success('Copied to clipboard');
}

// Usage
await copyToClipboard('Hello, World!');
await copyToClipboard(JSON.stringify(data, null, 2));
```

### Read Text

Read text from the clipboard.

```tsx
const text = await eagleApi.clipboard.readText();
```

```tsx
async function pasteFromClipboard() {
  const text = await eagleApi.clipboard.readText();
  if (text) {
    console.log('Clipboard contains:', text);
    return text;
  }
  console.log('Clipboard is empty or contains non-text data');
  return null;
}
```

## HTML Operations

### Write HTML

Copy HTML content to the clipboard.

```tsx
await eagleApi.clipboard.writeHTML(html);
```

```tsx
const html = '<strong>Bold text</strong> and <em>italic</em>';
await eagleApi.clipboard.writeHTML(html);
```

### Read HTML

Read HTML from the clipboard.

```tsx
const html = await eagleApi.clipboard.readHTML();
```

## Image Operations

### Write Image

Copy an image to the clipboard.

```tsx
await eagleApi.clipboard.writeImage(nativeImage);
```

:::note
This requires a NativeImage object from Electron. In browser mode, this is a no-op.
:::

### Read Image

Read an image from the clipboard.

```tsx
const image = await eagleApi.clipboard.readImage();
```

**Returns:** NativeImage or null if no image in clipboard.

```tsx
async function pasteImage() {
  const image = await eagleApi.clipboard.readImage();
  if (image && !image.isEmpty()) {
    // Convert to data URL for display
    const dataUrl = image.toDataURL();
    return dataUrl;
  }
  return null;
}
```

## Bookmark Operations

### Write Bookmark

Copy a bookmark (title + URL) to the clipboard.

```tsx
await eagleApi.clipboard.writeBookmark(title, url);
```

```tsx
await eagleApi.clipboard.writeBookmark(
  'Eagle - Organize your design files',
  'https://eagle.cool'
);
```

### Read Bookmark

Read a bookmark from the clipboard.

```tsx
const bookmark = await eagleApi.clipboard.readBookmark();
// { title: string, url: string } or undefined
```

## RTF Operations

### Write RTF

Copy Rich Text Format content.

```tsx
await eagleApi.clipboard.writeRTF(rtf);
```

### Read RTF

Read RTF from clipboard.

```tsx
const rtf = await eagleApi.clipboard.readRTF();
```

## Buffer Operations

### Write Buffer

Write raw binary data to clipboard.

```tsx
await eagleApi.clipboard.writeBuffer(format, buffer);
```

**Parameters:**
- `format: string` - Data format identifier
- `buffer: Buffer` - Binary data

### Read Buffer

Read raw binary data from clipboard.

```tsx
const buffer = await eagleApi.clipboard.readBuffer(format);
```

## Utility Methods

### Clear Clipboard

Remove all content from the clipboard.

```tsx
await eagleApi.clipboard.clear();
```

### Available Formats

Get list of formats available in clipboard.

```tsx
const formats = await eagleApi.clipboard.availableFormats();
// ['text/plain', 'text/html', ...]
```

```tsx
async function getClipboardInfo() {
  const formats = await eagleApi.clipboard.availableFormats();
  
  console.log('Clipboard contains:');
  formats.forEach(format => console.log(`  - ${format}`));
  
  return {
    hasText: formats.includes('text/plain'),
    hasHTML: formats.includes('text/html'),
    hasImage: formats.some(f => f.startsWith('image/')),
  };
}
```

### Has Content

Check if clipboard has specific content type.

```tsx
const hasText = await eagleApi.clipboard.has('text/plain');
const hasHTML = await eagleApi.clipboard.has('text/html');
```

## Common Patterns

### Copy with Fallback

```tsx
async function smartCopy(content: { text?: string; html?: string }) {
  if (content.html && content.text) {
    // Copy both formats
    await eagleApi.clipboard.writeHTML(content.html);
    // Note: Some apps prefer HTML, others plain text
  } else if (content.html) {
    await eagleApi.clipboard.writeHTML(content.html);
  } else if (content.text) {
    await eagleApi.clipboard.writeText(content.text);
  }
}
```

### Copy JSON Data

```tsx
async function copyAsJSON(data: object) {
  const formatted = JSON.stringify(data, null, 2);
  await eagleApi.clipboard.writeText(formatted);
  toast.success('JSON copied to clipboard');
}
```

### Copy Image from Canvas

```tsx
async function copyCanvasToClipboard(canvas: HTMLCanvasElement) {
  // Convert canvas to blob
  const blob = await new Promise<Blob | null>(resolve => {
    canvas.toBlob(resolve, 'image/png');
  });
  
  if (blob) {
    // Use Clipboard API (works in browser too)
    await navigator.clipboard.write([
      new ClipboardItem({ 'image/png': blob }),
    ]);
    toast.success('Image copied to clipboard');
  }
}
```

### Paste Handler

```tsx
function usePasteHandler(onPaste: (data: ClipboardData) => void) {
  useEffect(() => {
    async function handlePaste(event: ClipboardEvent) {
      event.preventDefault();
      
      const formats = await eagleApi.clipboard.availableFormats();
      
      if (formats.includes('text/plain')) {
        const text = await eagleApi.clipboard.readText();
        onPaste({ type: 'text', data: text });
      } else if (formats.some(f => f.startsWith('image/'))) {
        const image = await eagleApi.clipboard.readImage();
        onPaste({ type: 'image', data: image });
      }
    }
    
    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [onPaste]);
}
```

### Copy Selection Info

```tsx
async function copySelectionInfo() {
  const items = await eagleApi.item.getSelected();
  
  if (items.length === 0) {
    toast.warning('No items selected');
    return;
  }
  
  const info = items.map(item => ({
    name: item.name,
    size: `${item.width}×${item.height}`,
    path: item.filePath,
  }));
  
  await copyAsJSON(info);
}
```

## Browser vs Eagle Behavior

| Method | Browser (Mock) | Eagle |
|--------|----------------|-------|
| `writeText()` | Uses navigator.clipboard | Uses Electron clipboard |
| `readText()` | Uses navigator.clipboard | Uses Electron clipboard |
| `writeImage()` | No-op | Copies NativeImage |
| `readImage()` | Returns null | Returns NativeImage |
| `writeHTML()` | No-op or fallback | Full support |
| `clear()` | navigator.clipboard | Clears all formats |

## Best Practices

### ✅ Do

```tsx
// Provide feedback after copy
await eagleApi.clipboard.writeText(text);
toast.success('Copied!');

// Check formats before reading
const formats = await eagleApi.clipboard.availableFormats();
if (formats.includes('text/plain')) {
  const text = await eagleApi.clipboard.readText();
}

// Handle empty clipboard
const text = await eagleApi.clipboard.readText();
if (!text) {
  toast.info('Clipboard is empty');
  return;
}
```

### ❌ Don't

```tsx
// Don't copy silently without feedback
await eagleApi.clipboard.writeText(text);
// User doesn't know it worked!

// Don't assume clipboard always has data
const text = await eagleApi.clipboard.readText();
processText(text); // May be empty!

// Don't clear clipboard without confirmation
await eagleApi.clipboard.clear(); // User's data is gone!
```

## Related

- [Eagle API Overview](./overview) - API introduction
- [Item Operations](./item-operations) - Work with items
- [Dialogs](./dialogs) - File dialogs
