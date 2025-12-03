---
sidebar_position: 3
title: Eagle Watch Mode
description: Development with real Eagle integration
---

# Eagle Watch Mode

Eagle Watch Mode enables development with the real Eagle API and live data while maintaining fast iteration cycles.

## How It Works

```
┌─────────────────────────────────────────────────────────────────┐
│                    Eagle Watch Mode Flow                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │  Edit Code   │ → │  Vite Watch  │ → │  Rebuild     │      │
│  │  in VS Code  │    │  Detects     │    │  dist/       │      │
│  └──────────────┘    └──────────────┘    └──────────────┘      │
│                                                 │               │
│                                                 ▼               │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐      │
│  │  See Changes │ ← │  Press Cmd+R │ ← │  Eagle Reads │      │
│  │  in Plugin   │    │  to Reload   │    │  manifest    │      │
│  └──────────────┘    └──────────────┘    └──────────────┘      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Quick Start

### Step 1: Start Watch Mode

```bash
npm run build:watch
```

This runs `tsc && vite build --watch`:
- TypeScript compilation
- Vite builds to `dist/`
- Watches for file changes
- Rebuilds automatically (~1-2 seconds)

### Step 2: Import in Eagle (First Time Only)

1. Open Eagle desktop app
2. Go to **Settings** → **Plugins** → **Developer**
3. Click **"Import Local Project"**
4. Navigate to your project **root folder** (contains `manifest.json`)
5. Click **Select** / **Open**

Eagle reads `manifest.json` and loads `dist/index.html`.

### Step 3: Development Cycle

1. Edit code in VS Code
2. Wait for rebuild (watch terminal output)
3. Press `Cmd+R` (Mac) or `Ctrl+R` (Windows) in plugin window
4. See changes

## Manifest Configuration

The `manifest.json` configures how Eagle loads your plugin:

```json
{
  "id": "your-unique-plugin-id",
  "version": "1.0.0",
  "name": "{{manifest.app.name}}",
  "main": {
    "url": "dist/index.html",  // Development path
    "width": 1024,
    "height": 720,
    "minWidth": 800,
    "minHeight": 600
  },
  "logo": "public/logo.png",   // Development path
  "devTools": true             // Enable DevTools
}
```

:::info Path Convention
- **Development:** Paths point to build output (`dist/index.html`)
- **Deployment:** Paths are transformed (`index.html`)

The deploy script handles this transformation automatically.
:::

## Reload Methods

### Soft Reload (Recommended)

Press `Cmd+R` (Mac) or `Ctrl+R` (Windows) in the plugin window.

- Reloads the plugin content
- Maintains Eagle state
- Fast (~100ms)

### Hard Reload

If soft reload doesn't pick up changes:

1. Close the plugin window
2. Reopen from Eagle's plugin menu

### Plugin Toggle (Cache Issues)

If changes still don't appear:

1. Go to **Settings** → **Plugins**
2. **Disable** the plugin (toggle off)
3. **Enable** the plugin (toggle on)
4. Reopen the plugin

This clears Eagle's plugin cache.

## DevTools Access

When `devTools: true` in manifest:

| Platform | Shortcut |
|----------|----------|
| macOS | `Cmd + Option + I` |
| Windows | `F12` or `Ctrl + Shift + I` |

DevTools provides:
- Console for logs and errors
- Network tab for API calls
- Elements for DOM inspection
- Sources for debugging

## Common Issues

### Changes Not Appearing

1. **Check build completed:** Look for "built in Xs" in terminal
2. **Reload plugin:** Press `Cmd+R`
3. **Toggle plugin:** Disable → Enable in settings
4. **Check errors:** Open DevTools console

### Build Errors

```bash
# Check TypeScript errors
npm run typecheck

# Check for syntax errors in terminal output
# Fix errors and save - watch mode will rebuild
```

### Plugin Not Loading

1. Verify `manifest.json` is valid JSON
2. Check `dist/index.html` exists
3. Ensure Eagle has permission to read project folder
4. Check Eagle's plugin console for errors

### Slow Rebuilds

If rebuilds are slow:

```bash
# Check what's being rebuilt
npm run build:watch -- --debug

# Ensure node_modules isn't being watched
# Check vite.config.ts server.watch settings
```

## Development Tips

### Use Browser Dev First

Start with browser development for UI work:

```bash
npm run dev  # Browser with mock API
```

Switch to Eagle watch mode for:
- Testing real Eagle API
- File operations
- Selection integration
- Platform-specific features

### Keep Both Running

You can run both modes simultaneously:

```bash
# Terminal 1: Browser dev
npm run dev

# Terminal 2: Eagle watch
npm run build:watch
```

This allows:
- Rapid UI iteration in browser
- Integration testing in Eagle
- Quick comparison of mock vs real behavior

### Console Logging

Use `eagleApi.log` for logs visible in Eagle:

```typescript
import { eagleApi } from '@/lib/eagle-api';

// These appear in Eagle's DevTools console
eagleApi.log.info('Info message');
eagleApi.log.warn('Warning message');
eagleApi.log.error('Error message');
```

### Test with Real Selection

1. Select items in Eagle's main window
2. Open your plugin
3. Items are available via `eagleApi.item.getSelected()`

### Test Different Libraries

1. Switch to a different Eagle library
2. Plugin's `onLibraryChanged` event fires
3. Test library-specific behavior

## Watch Mode vs Browser Dev

| Feature | Browser Dev | Eagle Watch |
|---------|-------------|-------------|
| Reload Speed | Instant (HMR) | ~1-2s + manual |
| Eagle API | Mock | Real |
| File Operations | Simulated | Real |
| Selection | Mock data | Live selection |
| DevTools | Browser built-in | Eagle DevTools |
| Platform Features | Simulated | Real |

## Related

- [Browser Development](./browser-dev) - Mock system
- [Debugging](./debugging) - Debug techniques
- [Deploy Script](../deployment/deploy-script) - Production deployment
