---
sidebar_position: 6
title: Dialogs
description: Native system dialogs for file selection and messages
---

# Dialogs

Show native system dialogs for file selection, saving, and messages.

## Import

```tsx
import { eagleApi } from '@/lib/eagle-api';
```

## Open Dialog

Show a file/folder selection dialog.

```tsx
const result = await eagleApi.dialog.showOpenDialog(options);
```

### Options

| Option | Type | Description |
|--------|------|-------------|
| `title` | `string` | Dialog window title |
| `defaultPath` | `string` | Initial directory path |
| `buttonLabel` | `string` | Custom confirm button text |
| `filters` | `FileFilter[]` | File type filters |
| `properties` | `string[]` | Dialog behavior flags |
| `message` | `string` | Message above file list (macOS) |

### Properties

| Property | Description |
|----------|-------------|
| `openFile` | Allow file selection |
| `openDirectory` | Allow directory selection |
| `multiSelections` | Allow multiple selection |
| `showHiddenFiles` | Show hidden files |
| `createDirectory` | Allow creating directories |
| `promptToCreate` | Prompt to create non-existent path |

### FileFilter Type

```tsx
interface FileFilter {
  name: string;        // Filter display name
  extensions: string[]; // File extensions (without dots)
}
```

### Return Value

```tsx
interface OpenDialogResult {
  canceled: boolean;    // True if user cancelled
  filePaths: string[];  // Selected file/folder paths
}
```

### Example: Select Images

```tsx
async function selectImages() {
  const result = await eagleApi.dialog.showOpenDialog({
    title: 'Select Images',
    properties: ['openFile', 'multiSelections'],
    filters: [
      { name: 'Images', extensions: ['png', 'jpg', 'jpeg', 'gif', 'webp'] },
      { name: 'All Files', extensions: ['*'] },
    ],
  });

  if (result.canceled) {
    return null;
  }

  return result.filePaths;
}
```

### Example: Select Folder

```tsx
async function selectOutputFolder() {
  const result = await eagleApi.dialog.showOpenDialog({
    title: 'Select Output Folder',
    properties: ['openDirectory', 'createDirectory'],
    buttonLabel: 'Choose Folder',
  });

  if (result.canceled || result.filePaths.length === 0) {
    return null;
  }

  return result.filePaths[0];
}
```

### Example: Single File Selection

```tsx
async function selectFile() {
  const result = await eagleApi.dialog.showOpenDialog({
    title: 'Select File',
    properties: ['openFile'],
    filters: [
      { name: 'JSON Files', extensions: ['json'] },
    ],
  });

  if (!result.canceled && result.filePaths.length > 0) {
    return result.filePaths[0];
  }
  return null;
}
```

## Save Dialog

Show a file save dialog.

```tsx
const result = await eagleApi.dialog.showSaveDialog(options);
```

### Options

| Option | Type | Description |
|--------|------|-------------|
| `title` | `string` | Dialog window title |
| `defaultPath` | `string` | Default file name or path |
| `buttonLabel` | `string` | Custom save button text |
| `filters` | `FileFilter[]` | File type filters |
| `message` | `string` | Message above filename (macOS) |

### Return Value

```tsx
interface SaveDialogResult {
  canceled: boolean;  // True if user cancelled
  filePath: string;   // Selected save path (undefined if cancelled)
}
```

### Example: Save Export

```tsx
async function selectExportPath(defaultName: string) {
  const result = await eagleApi.dialog.showSaveDialog({
    title: 'Export Image',
    defaultPath: defaultName,
    buttonLabel: 'Export',
    filters: [
      { name: 'PNG Image', extensions: ['png'] },
      { name: 'JPEG Image', extensions: ['jpg'] },
      { name: 'WebP Image', extensions: ['webp'] },
    ],
  });

  if (result.canceled) {
    return null;
  }

  return result.filePath;
}
```

### Example: Save with Default Extension

```tsx
async function saveJSON(defaultName: string = 'data.json') {
  const result = await eagleApi.dialog.showSaveDialog({
    title: 'Save Data',
    defaultPath: defaultName,
    filters: [
      { name: 'JSON Files', extensions: ['json'] },
    ],
  });

  if (!result.canceled && result.filePath) {
    // Ensure .json extension
    let path = result.filePath;
    if (!path.endsWith('.json')) {
      path += '.json';
    }
    return path;
  }
  return null;
}
```

## Message Box

Show a message dialog with buttons.

```tsx
const result = await eagleApi.dialog.showMessageBox(options);
```

### Options

| Option | Type | Description |
|--------|------|-------------|
| `type` | `string` | Icon type: 'none', 'info', 'error', 'question', 'warning' |
| `title` | `string` | Dialog title |
| `message` | `string` | Main message text |
| `detail` | `string` | Additional detail text |
| `buttons` | `string[]` | Button labels |
| `defaultId` | `number` | Default button index |
| `cancelId` | `number` | Cancel button index |

### Return Value

```tsx
interface MessageBoxResult {
  response: number;  // Index of clicked button
}
```

### Example: Confirmation Dialog

```tsx
async function confirmDelete(itemName: string): Promise<boolean> {
  const result = await eagleApi.dialog.showMessageBox({
    type: 'warning',
    title: 'Confirm Delete',
    message: `Delete "${itemName}"?`,
    detail: 'This action cannot be undone.',
    buttons: ['Cancel', 'Delete'],
    defaultId: 0,
    cancelId: 0,
  });

  return result.response === 1; // Delete button
}
```

### Example: Save Changes Prompt

```tsx
async function promptSaveChanges(): Promise<'save' | 'discard' | 'cancel'> {
  const result = await eagleApi.dialog.showMessageBox({
    type: 'question',
    title: 'Unsaved Changes',
    message: 'Do you want to save changes?',
    buttons: ['Save', "Don't Save", 'Cancel'],
    defaultId: 0,
    cancelId: 2,
  });

  switch (result.response) {
    case 0: return 'save';
    case 1: return 'discard';
    default: return 'cancel';
  }
}
```

### Example: Error Dialog

```tsx
async function showError(title: string, message: string) {
  await eagleApi.dialog.showMessageBox({
    type: 'error',
    title,
    message,
    buttons: ['OK'],
  });
}
```

## Complete Workflow Example

```tsx
async function exportWorkflow() {
  // 1. Select output folder
  const folder = await selectOutputFolder();
  if (!folder) {
    return; // User cancelled
  }

  // 2. Process images...
  const results = await processImages();

  // 3. Show completion or error
  if (results.errors.length > 0) {
    const proceed = await eagleApi.dialog.showMessageBox({
      type: 'warning',
      title: 'Export Complete with Errors',
      message: `${results.success} exported, ${results.errors.length} failed.`,
      buttons: ['View Errors', 'OK'],
      defaultId: 1,
    });

    if (proceed.response === 0) {
      showErrorDetails(results.errors);
    }
  } else {
    await eagleApi.dialog.showMessageBox({
      type: 'info',
      title: 'Export Complete',
      message: `Successfully exported ${results.success} images.`,
      buttons: ['OK'],
    });
  }
}
```

## Browser vs Eagle Behavior

| Method | Browser (Mock) | Eagle |
|--------|----------------|-------|
| `showOpenDialog()` | Returns mock paths | Shows native dialog |
| `showSaveDialog()` | Returns mock path | Shows native dialog |
| `showMessageBox()` | Returns `{ response: 0 }` | Shows native dialog |

## Best Practices

### ✅ Do

```tsx
// Always check for cancellation
const result = await eagleApi.dialog.showOpenDialog(options);
if (result.canceled) return;

// Use appropriate dialog types
type: 'warning'  // Destructive actions
type: 'question' // User choices
type: 'info'     // Information
type: 'error'    // Errors

// Provide sensible defaults
defaultPath: lastUsedPath || homePath
```

### ❌ Don't

```tsx
// Don't assume dialogs always return paths
const path = result.filePaths[0]; // May be undefined!

// Don't use dialogs for simple messages
await showMessageBox({ message: 'Done!' }); // Use toast instead

// Don't block UI without feedback
await lengthyOperation(); // Show loading state
```

## Related

- [Eagle API Overview](./overview) - API introduction
- [Toast Component](../components/ui/toast) - Non-blocking messages
- [Item Operations](./item-operations) - Add files to library
