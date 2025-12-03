---
sidebar_position: 4
title: Debugging
description: Debug tools and techniques
---

# Debugging

Tools and techniques for debugging Eagle plugins in both browser and Eagle environments.

## DevTools Access

### Browser Development

Standard browser DevTools:
- **Chrome/Edge:** `F12` or `Cmd+Option+I` (Mac) / `Ctrl+Shift+I` (Windows)
- **Firefox:** `F12` or `Cmd+Option+I` / `Ctrl+Shift+I`

### Eagle Plugin

When `devTools: true` in `manifest.json`:

| Platform | Shortcut |
|----------|----------|
| macOS | `Cmd + Option + I` |
| Windows | `F12` or `Ctrl + Shift + I` |

## Logging

### Eagle API Logging

Use `eagleApi.log` for structured logging:

```typescript
import { eagleApi } from '@/lib/eagle-api';

// Different log levels
eagleApi.log.info('Operation started');
eagleApi.log.warn('Deprecated API used');
eagleApi.log.error('Operation failed', error);
eagleApi.log.debug('Debug info', data);
```

### Log Behavior by Environment

| Method | Browser | Eagle |
|--------|---------|-------|
| `log.info()` | `console.log()` | Eagle log file |
| `log.warn()` | `console.warn()` | Eagle log file |
| `log.error()` | `console.error()` | Eagle log file |
| `log.debug()` | `console.debug()` | Eagle log file |

### Custom Logger

```typescript
// lib/logger.ts
const isDev = import.meta.env.DEV;

export const logger = {
  debug: (...args: unknown[]) => {
    if (isDev) {
      console.debug('[DEBUG]', ...args);
      eagleApi.log.debug(args.join(' '));
    }
  },
  
  info: (...args: unknown[]) => {
    console.info('[INFO]', ...args);
    eagleApi.log.info(args.join(' '));
  },
  
  warn: (...args: unknown[]) => {
    console.warn('[WARN]', ...args);
    eagleApi.log.warn(args.join(' '));
  },
  
  error: (...args: unknown[]) => {
    console.error('[ERROR]', ...args);
    eagleApi.log.error(args.join(' '));
  },
};
```

## Console Commands

### Environment Inspection

```javascript
// Check environment
eagleApi.isMock           // true in browser, false in Eagle

// Check API availability
typeof eagle !== 'undefined'  // false in browser

// Check platform
eagleApi.platform         // 'darwin', 'win32', etc.

// Check locale
eagleApi.locale           // 'en', 'zh_CN', etc.

// Check theme
eagleApi.isDarkMode       // boolean
```

### Mock System (Browser Only)

```javascript
// View configuration
window.mockEagle.getConfig()

// Change mock data
window.mockEagle.setConfig({ selectedItemCount: 50 })

// Load preset
window.mockEagle.preset('largeLibrary')

// Simulate error
window.mockEagle.simulateError('getSelectedItems', 'API error')

// Clear errors
window.mockEagle.clearErrors()

// Reset all
window.mockEagle.reset()
```

### Storage Debugging

```javascript
// View all stored data
storageDebug.viewAll()

// Clear all storage
storageDebug.clearAll()

// View specific namespace
localStorage.getItem('eagle-react-template:settings')
```

### State Inspection

```javascript
// If using Zustand DevTools
// Install Redux DevTools extension, then:
// Open DevTools → Redux tab → Select 'EaglePlugin' store

// Manual state inspection
usePluginStore.getState()
usePluginStore.getState().selection
usePluginStore.getState().settings
```

## React DevTools

### Installation

1. Install [React DevTools](https://react.dev/learn/react-developer-tools) browser extension
2. Works in both browser dev and Eagle (if DevTools enabled)

### Usage

- **Components tab:** Inspect component tree, props, state
- **Profiler tab:** Analyze render performance
- **Search:** Find components by name

### Debugging State

```javascript
// In React DevTools Components tab:
// 1. Select a component
// 2. Check "hooks" section for useState, useEffect values
// 3. Right-click → "Store as global variable" for console access
```

## Breakpoint Debugging

### Browser DevTools

1. Open Sources tab
2. Find file in `src/` folder
3. Click line number to set breakpoint
4. Interact with app to trigger breakpoint

### Conditional Breakpoints

Right-click line number → "Add conditional breakpoint":

```javascript
// Break only when condition is true
items.length > 10
item.id === 'specific-id'
```

### Logpoints

Right-click line number → "Add logpoint":

```javascript
// Log without pausing
'Processing item:', item.name, 'at index', index
```

## Error Tracking

### Error Boundary Logging

```typescript
// components/ErrorBoundary.tsx
componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
  // Log to console
  console.error('React Error:', error);
  console.error('Component Stack:', errorInfo.componentStack);
  
  // Log to Eagle
  eagleApi.log.error(`React Error: ${error.message}`);
  eagleApi.log.error(`Stack: ${error.stack}`);
}
```

### Global Error Handler

```typescript
// main.tsx
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  eagleApi.log.error(`Uncaught: ${event.error?.message}`);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled rejection:', event.reason);
  eagleApi.log.error(`Unhandled Promise: ${event.reason}`);
});
```

## Performance Debugging

### React Profiler

```tsx
import { Profiler } from 'react';

function onRender(
  id: string,
  phase: 'mount' | 'update',
  actualDuration: number
) {
  if (actualDuration > 16) {  // Longer than one frame
    console.warn(`Slow render: ${id} took ${actualDuration}ms`);
  }
}

<Profiler id="Gallery" onRender={onRender}>
  <Gallery items={items} />
</Profiler>
```

### Performance Timing

```typescript
// Measure operation duration
const start = performance.now();
await expensiveOperation();
const duration = performance.now() - start;
console.log(`Operation took ${duration.toFixed(2)}ms`);

// With helper
function measureTime<T>(name: string, fn: () => T): T {
  const start = performance.now();
  const result = fn();
  console.log(`${name}: ${(performance.now() - start).toFixed(2)}ms`);
  return result;
}

const result = measureTime('processItems', () => {
  return items.map(processItem);
});
```

### Memory Profiling

1. Open DevTools → Memory tab
2. Take heap snapshot before operation
3. Perform operation
4. Take heap snapshot after
5. Compare snapshots for leaks

## Network Debugging

### Monitor Eagle API Calls

```typescript
// Wrap Eagle API for debugging
const debugEagleApi = new Proxy(eagleApi, {
  get(target, prop) {
    const value = target[prop];
    if (typeof value === 'function') {
      return (...args: unknown[]) => {
        console.log(`[Eagle API] ${String(prop)}`, args);
        const result = value.apply(target, args);
        if (result instanceof Promise) {
          result.then(r => console.log(`[Eagle API] ${String(prop)} →`, r));
        }
        return result;
      };
    }
    return value;
  },
});
```

## Common Debug Scenarios

### Selection Not Updating

```javascript
// Check if polling is active
usePluginStore.getState().selection.isPolling

// Check last fetch time
usePluginStore.getState().selection.lastUpdated

// Force refresh
usePluginStore.getState().refreshSelection()

// In mock mode, check mock config
window.mockEagle.getConfig().selectedItemCount
```

### Theme Not Syncing

```javascript
// Check current theme state
usePluginStore.getState().settings.theme

// Check Eagle's theme
eagleApi.isDarkMode

// Check HTML class
document.documentElement.classList.contains('dark')
```

### i18n Not Working

```javascript
// Check current language
i18n.language

// Check available languages
i18n.languages

// Force language change
i18n.changeLanguage('zh_CN')

// Check translation exists
i18n.exists('app.title')
```

## Related

- [Browser Development](./browser-dev) - Mock system
- [Eagle Watch Mode](./eagle-watch) - Eagle integration
- [Test Overview](../testing/overview) - Testing strategies
