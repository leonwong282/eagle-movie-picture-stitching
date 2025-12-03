---
sidebar_position: 5
title: Window Controls
description: Control the plugin window appearance and behavior
---

# Window Controls

Control the plugin window's size, position, visibility, and behavior.

## Import

```tsx
import { eagleApi } from '@/lib/eagle-api';
```

## Show/Hide Window

### Show Window

Bring the plugin window to the foreground.

```tsx
await eagleApi.window.show();
```

### Hide Window

Hide the plugin window.

```tsx
await eagleApi.window.hide();
```

### Close Window

Close the plugin window completely.

```tsx
await eagleApi.window.close();
```

## Window Size

### Set Size

Set the window dimensions.

```tsx
await eagleApi.window.setSize(width, height);
```

**Parameters:**
- `width: number` - Window width in pixels
- `height: number` - Window height in pixels

```tsx
// Set to 800x600
await eagleApi.window.setSize(800, 600);
```

### Set Minimum Size

Set the minimum allowed window size.

```tsx
await eagleApi.window.setMinimumSize(minWidth, minHeight);
```

```tsx
// Prevent window from being smaller than 400x300
await eagleApi.window.setMinimumSize(400, 300);
```

### Set Maximum Size

Set the maximum allowed window size.

```tsx
await eagleApi.window.setMaximumSize(maxWidth, maxHeight);
```

```tsx
// Limit window to 1200x800 max
await eagleApi.window.setMaximumSize(1200, 800);
```

## Window Position

### Set Position

Move the window to specific coordinates.

```tsx
await eagleApi.window.setPosition(x, y);
```

**Parameters:**
- `x: number` - X coordinate from screen left
- `y: number` - Y coordinate from screen top

```tsx
// Move to top-left corner
await eagleApi.window.setPosition(0, 0);

// Center on screen (approximate)
await eagleApi.window.setPosition(
  (screenWidth - windowWidth) / 2,
  (screenHeight - windowHeight) / 2
);
```

### Center Window

Center the window on screen.

```tsx
await eagleApi.window.center();
```

## Window State

### Minimize

Minimize the window to the dock/taskbar.

```tsx
await eagleApi.window.minimize();
```

### Maximize/Restore

Toggle between maximized and normal state.

```tsx
// Maximize
await eagleApi.window.maximize();

// Restore from maximized
await eagleApi.window.unmaximize();
```

### Check Maximized State

```tsx
const isMaximized = await eagleApi.window.isMaximized();
```

### Fullscreen

Toggle fullscreen mode.

```tsx
await eagleApi.window.setFullScreen(true);

// Exit fullscreen
await eagleApi.window.setFullScreen(false);
```

## Window Behavior

### Always On Top

Keep window above other windows.

```tsx
await eagleApi.window.setAlwaysOnTop(true);

// Disable
await eagleApi.window.setAlwaysOnTop(false);
```

### Focus Window

Focus the plugin window (bring to front and activate).

```tsx
await eagleApi.window.focus();
```

### Check Focused State

```tsx
const isFocused = await eagleApi.window.isFocused();
```

### Check Visible State

```tsx
const isVisible = await eagleApi.window.isVisible();
```

## Window Appearance

### Set Opacity

Set window transparency (0.0 to 1.0).

```tsx
await eagleApi.window.setOpacity(0.9); // 90% opaque
```

### Set Background Color

Set the window background color.

```tsx
await eagleApi.window.setBackgroundColor('#1a1a1a');
```

### Resizable

Control whether the window can be resized.

```tsx
await eagleApi.window.setResizable(true);

// Lock size
await eagleApi.window.setResizable(false);
```

### Movable

Control whether the window can be moved.

```tsx
await eagleApi.window.setMovable(true);

// Lock position
await eagleApi.window.setMovable(false);
```

## Common Patterns

### Responsive Window

Adjust window based on content:

```tsx
async function adjustWindowToContent(contentHeight: number) {
  const baseHeight = 100; // Header, padding, etc.
  const maxHeight = 800;
  
  const targetHeight = Math.min(
    baseHeight + contentHeight,
    maxHeight
  );
  
  await eagleApi.window.setSize(600, targetHeight);
}
```

### Compact Mode Toggle

```tsx
const [isCompact, setIsCompact] = useState(false);

async function toggleCompactMode() {
  if (isCompact) {
    await eagleApi.window.setSize(800, 600);
  } else {
    await eagleApi.window.setSize(400, 200);
  }
  setIsCompact(!isCompact);
}
```

### Picture-in-Picture Mode

```tsx
async function enablePiP() {
  await eagleApi.window.setAlwaysOnTop(true);
  await eagleApi.window.setSize(320, 240);
  await eagleApi.window.setOpacity(0.9);
}

async function disablePiP() {
  await eagleApi.window.setAlwaysOnTop(false);
  await eagleApi.window.setSize(800, 600);
  await eagleApi.window.setOpacity(1);
}
```

### Remember Window Position

```tsx
const STORAGE_KEY = 'window-bounds';

async function saveWindowBounds() {
  const bounds = {
    width: window.innerWidth,
    height: window.innerHeight,
    // Position requires additional APIs
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bounds));
}

async function restoreWindowBounds() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    const { width, height } = JSON.parse(saved);
    await eagleApi.window.setSize(width, height);
  }
}
```

## Drag Region

For frameless windows, specify draggable areas in CSS:

```css
/* Header is draggable */
.drag-region {
  -webkit-app-region: drag;
}

/* Buttons inside header are not draggable */
.drag-region button,
.drag-region input,
.no-drag {
  -webkit-app-region: no-drag;
}
```

```tsx
<header className="drag-region">
  <h1>Plugin Title</h1>
  <button className="no-drag" onClick={handleClose}>
    Close
  </button>
</header>
```

## Browser vs Eagle Behavior

| Method | Browser (Mock) | Eagle |
|--------|----------------|-------|
| `show()` | No-op | Shows window |
| `hide()` | No-op | Hides window |
| `setSize()` | No-op | Resizes window |
| `setPosition()` | No-op | Moves window |
| `setAlwaysOnTop()` | No-op | Pins window |
| `center()` | No-op | Centers window |

## Best Practices

### ✅ Do

```tsx
// Set size constraints in manifest.json
{
  "main": {
    "minWidth": 400,
    "minHeight": 300,
    "width": 800,
    "height": 600
  }
}

// Use CSS drag regions for custom titlebars
<header className="drag-region">

// Respect user preferences
const savedSize = localStorage.getItem('windowSize');
```

### ❌ Don't

```tsx
// Don't make windows too small
await eagleApi.window.setSize(100, 100); // Unusable!

// Don't disable resizing without good reason
await eagleApi.window.setResizable(false);

// Don't force always-on-top without user consent
await eagleApi.window.setAlwaysOnTop(true); // Ask first!
```

## Related

- [Eagle API Overview](./overview) - API introduction
- [Events & Lifecycle](./events-lifecycle) - Window events
- [Header Component](../components/ui/header) - Window controls UI
