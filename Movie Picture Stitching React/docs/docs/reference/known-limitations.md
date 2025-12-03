# Known Limitations

This document outlines the current limitations and constraints when developing Eagle plugins with the React Template.

## Browser vs Eagle Environment

### API Availability

| Feature | Browser Dev | Eagle Runtime |
|---------|-------------|---------------|
| `window.eagle` | ❌ Undefined | ✅ Available |
| `require()` | ❌ Not available | ✅ Node.js require |
| File system | ❌ No access | ✅ Full access |
| Local storage | ✅ Available | ✅ Available |
| Selection polling | ⚠️ Mock data | ✅ Real selection |

### Environment Detection

Always check the environment before using Eagle-specific features:

```typescript
import { isEagleEnvironment, eagleApi } from '@/lib/eagle-api';

if (isEagleEnvironment()) {
  // Safe to use Eagle API
  const items = await eagleApi.getSelectedItems();
} else {
  // Browser mode - use mock data or disable feature
  console.log('Running in browser mode');
}
```

## Canvas Limitations

### Maximum Canvas Size

**Hard limit: 32,767 pixels** in any dimension.

```typescript
const MAX_CANVAS_SIZE = 32767;

function validateCanvasSize(width: number, height: number): boolean {
  if (width > MAX_CANVAS_SIZE || height > MAX_CANVAS_SIZE) {
    throw new Error(
      `Canvas size (${width}x${height}) exceeds browser maximum (${MAX_CANVAS_SIZE}px)`
    );
  }
  return true;
}
```

### Memory Constraints

Large canvas operations can exhaust memory:

```typescript
// Estimate memory usage (RGBA = 4 bytes per pixel)
function estimateMemoryUsage(width: number, height: number): number {
  return width * height * 4; // bytes
}

// Example: 10000x10000 image = 400MB
const usage = estimateMemoryUsage(10000, 10000);
console.log(`Memory usage: ${(usage / 1024 / 1024).toFixed(2)} MB`);
```

**Recommendations:**
- Process images in batches for large operations
- Release canvas references when done: `canvas.width = 0; canvas.height = 0;`
- Use Web Workers for heavy processing

## Selection Polling

### No Push Updates

Eagle doesn't push selection changes - plugins must poll:

```typescript
// Eagle has NO selection change events
// Must poll periodically
const POLL_INTERVAL = 500; // ms

function startPolling() {
  setInterval(async () => {
    const selected = await eagleApi.getSelectedItems();
    // Compare with previous selection
  }, POLL_INTERVAL);
}
```

### Polling Optimization

The `useEagleSelection` hook uses hash-based change detection to minimize re-renders:

```typescript
// Hook only updates state when selection actually changes
const { items } = useEagleSelection({
  pollingInterval: 500,
  pauseOnHidden: true, // Stop polling when tab is hidden
});
```

## File Path Handling

### Path vs URL

Eagle provides both paths and URLs - use the correct one:

```typescript
const item = (await eagleApi.getSelectedItems())[0];

// ✅ Use filePath for Node.js operations
const path = item.filePath; // '/Users/.../image.png'

// ❌ Don't use fileURL for fs operations
const url = item.fileURL; // 'file:///Users/.../image.png'
```

### Path Separators

Handle platform differences:

```typescript
import path from 'path';

// ✅ Use path.join for cross-platform paths
const fullPath = path.join(baseDir, 'subfolder', 'file.png');

// ❌ Don't hardcode separators
const badPath = baseDir + '/subfolder/file.png'; // Fails on Windows
```

## API Timing

### Plugin Lifecycle

Some API calls fail before `onPluginCreate`:

```typescript
// ❌ May fail - API not ready
const locale = eagle.app.locale; // Can throw

// ✅ Wait for plugin creation
eagle.onPluginCreate(async () => {
  const locale = eagle.app.locale; // Safe
});
```

### Safe Initialization

The `eagleApi` adapter handles this with try-catch:

```typescript
// In eagle-api.ts - all getters are protected
get locale(): EagleLocale {
  try {
    return this._api.app?.locale || 'en';
  } catch {
    return 'en'; // Safe default
  }
}
```

## Storage Limitations

### localStorage Limits

| Browser | Typical Limit |
|---------|---------------|
| Chrome | 5-10 MB |
| Safari | 5 MB |
| Firefox | 10 MB |

```typescript
// Check available storage
function getStorageUsage(): number {
  let total = 0;
  for (const key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      total += localStorage[key].length * 2; // UTF-16
    }
  }
  return total;
}
```

### Storage Namespace

All template storage uses prefix to avoid conflicts:

```typescript
const STORAGE_PREFIX = 'eagle-react-template:';

// Keys are namespaced
localStorage.setItem(`${STORAGE_PREFIX}theme`, 'dark');
```

## i18n Limitations

### Dynamic Language Detection

Eagle locale changes require re-detection:

```typescript
// Language may change when plugin is re-shown
eagle.onPluginShow(() => {
  const newLocale = eagle.app.locale;
  if (newLocale !== currentLocale) {
    i18n.changeLanguage(newLocale);
  }
});
```

### Missing Translations

Fallback chain: requested → fallback → key

```typescript
// If 'zh_TW' translation missing, falls back to 'en'
i18n.init({
  fallbackLng: 'en',
  lng: 'zh_TW',
});
```

## Build Constraints

### No Code Splitting

Eagle requires single-file bundles:

```typescript title="vite.config.ts"
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        // REQUIRED: No code splitting
        manualChunks: undefined,
      },
    },
  },
});
```

### Relative Base Path

Must use relative paths for Eagle:

```typescript title="vite.config.ts"
export default defineConfig({
  base: './', // REQUIRED for Eagle
});
```

## Component Limitations

### Window Drag Region

Only works with proper CSS:

```css
/* Header must have drag region for window dragging */
.drag-region {
  -webkit-app-region: drag;
}

/* Buttons inside must disable drag */
.drag-region button {
  -webkit-app-region: no-drag;
}
```

### Dialog Focus Trap

Radix UI dialogs may have issues with Eagle's window:

```typescript
// May need to disable portal for proper focus
<Dialog modal={true}>
  <DialogContent
    onOpenAutoFocus={(e) => e.preventDefault()}
    onCloseAutoFocus={(e) => e.preventDefault()}
  >
    ...
  </DialogContent>
</Dialog>
```

## Performance Considerations

### Image Loading

Large images can block the main thread:

```typescript
// ✅ Load images asynchronously
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

// ✅ Use Promise.all with timeout
async function loadImages(sources: string[], timeout = 10000) {
  return Promise.all(
    sources.map(src => 
      Promise.race([
        loadImage(src),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), timeout)
        ),
      ])
    )
  );
}
```

### Batch Processing

Limit concurrent operations:

```typescript
async function processBatch<T, R>(
  items: T[],
  processor: (item: T) => Promise<R>,
  batchSize = 10
): Promise<R[]> {
  const results: R[] = [];
  
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(processor));
    results.push(...batchResults);
  }
  
  return results;
}
```

## Workarounds

### Mock Factory for Testing

Use mock factory to simulate Eagle environment:

```typescript
// In browser dev mode
import { mockController } from '@/lib/mock-factory';

// Simulate different scenarios
mockController.preset('largeLibrary'); // 100 items
mockController.simulateError('getSelectedItems', 'API error');
```

### Console Commands

Debug in Eagle DevTools:

```javascript
// Check environment
eagleApi.isMock // false in Eagle

// Force refresh selection
window.app?.refreshSelection?.()

// View stored settings
storageDebug?.viewAll?.()
```

## Future Improvements

Features planned or under consideration:

| Feature | Status | Notes |
|---------|--------|-------|
| Push-based selection | ⏳ Waiting on Eagle API | Currently requires polling |
| Code splitting | ⏳ Waiting on Eagle | Bundle size concerns |
| Service Workers | ❌ Not supported | Eagle limitation |
| WebGL acceleration | ⏳ Under evaluation | For image processing |

## Related

- [Dual Environment Pattern](../core-concepts/dual-environment.md) - Understanding environments
- [Eagle API Overview](../eagle-api/overview.md) - API capabilities
- [Debugging](../development/debugging.md) - Troubleshooting tips
