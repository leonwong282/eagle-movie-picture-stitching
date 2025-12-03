---
sidebar_position: 2
title: useEagleSelection
description: Polling-based hook for tracking Eagle's currently selected items
---

# useEagleSelection

A polling-based hook that tracks Eagle's currently selected items with optimizations for performance and visibility awareness.

## Import

```tsx
import { useEagleSelection } from '@/hooks';
```

## Basic Usage

```tsx
function Gallery() {
  const { items, isLoading } = useEagleSelection();

  if (isLoading) return <Spinner />;
  
  return (
    <div className="grid grid-cols-4 gap-2">
      {items.map(item => (
        <EagleImage key={item.id} item={item} />
      ))}
    </div>
  );
}
```

## Signature

```tsx
const result = useEagleSelection(options?: UseEagleSelectionOptions);
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `pollingInterval` | `number` | `500` | Polling interval in milliseconds |
| `autoStart` | `boolean` | `true` | Start polling immediately on mount |
| `pauseOnHidden` | `boolean` | `true` | Pause polling when document/plugin is hidden |

```tsx
// Custom options
const { items } = useEagleSelection({
  pollingInterval: 1000,  // Slower polling
  autoStart: false,       // Manual start
  pauseOnHidden: true,    // Pause when hidden
});
```

## Return Value

| Property | Type | Description |
|----------|------|-------------|
| `items` | `EagleItem[]` | Currently selected items |
| `isLoading` | `boolean` | True during initial load |
| `error` | `Error \| null` | Error if API call fails |
| `refresh` | `() => Promise<void>` | Force refresh (bypasses hash check) |
| `forceRefresh` | `() => Promise<void>` | Alias for `refresh` |
| `startPolling` | `() => void` | Start the polling loop |
| `stopPolling` | `() => void` | Stop the polling loop |
| `isPaused` | `boolean` | True when paused due to visibility |

## Examples

### Basic Selection Display

```tsx
function SelectionInfo() {
  const { items, isLoading, error } = useEagleSelection();

  if (error) return <div className="text-destructive">{error.message}</div>;
  if (isLoading) return <Spinner />;
  if (items.length === 0) return <p>No items selected</p>;

  return (
    <div>
      <p>{items.length} items selected</p>
      <ul>
        {items.map(item => (
          <li key={item.id}>{item.name}.{item.ext}</li>
        ))}
      </ul>
    </div>
  );
}
```

### With Manual Refresh

```tsx
function RefreshableGallery() {
  const { items, refresh, isLoading } = useEagleSelection();

  return (
    <div>
      <Button 
        onClick={refresh} 
        disabled={isLoading}
      >
        <RefreshCw className={isLoading ? 'animate-spin' : ''} />
        Refresh
      </Button>
      <ImageGrid items={items} />
    </div>
  );
}
```

### Manual Polling Control

```tsx
function ControlledPolling() {
  const { 
    items, 
    isPaused,
    startPolling, 
    stopPolling 
  } = useEagleSelection({ autoStart: false });

  return (
    <div>
      <div className="flex gap-2">
        <Button onClick={startPolling}>Start</Button>
        <Button onClick={stopPolling}>Stop</Button>
        <span>{isPaused ? '⏸️ Paused' : '▶️ Active'}</span>
      </div>
      <p>{items.length} items</p>
    </div>
  );
}
```

### Slower Polling for Heavy Operations

```tsx
function HeavyProcessing() {
  // Slower polling to reduce CPU usage during processing
  const { items } = useEagleSelection({
    pollingInterval: 2000,  // 2 seconds
  });

  // Heavy operation on items...
}
```

### Display Item Metadata

```tsx
function ItemDetails() {
  const { items } = useEagleSelection();
  const item = items[0];

  if (!item) return <p>Select an item to see details</p>;

  return (
    <dl className="grid grid-cols-2 gap-2 text-sm">
      <dt>Name</dt>
      <dd>{item.name}</dd>
      
      <dt>Format</dt>
      <dd>{item.ext.toUpperCase()}</dd>
      
      <dt>Dimensions</dt>
      <dd>{item.width} × {item.height}</dd>
      
      <dt>File Size</dt>
      <dd>{(item.size / 1024).toFixed(1)} KB</dd>
      
      <dt>Tags</dt>
      <dd>{item.tags?.join(', ') || 'None'}</dd>
      
      <dt>Star Rating</dt>
      <dd>{'⭐'.repeat(item.star || 0) || 'Unrated'}</dd>
    </dl>
  );
}
```

## EagleItem Type

The `items` array contains objects with these properties:

```typescript
interface EagleItem {
  id: string;
  name: string;
  ext: string;
  width: number;
  height: number;
  size: number;
  filePath: string;
  fileURL: string;
  
  // Metadata
  tags?: string[];
  folders?: string[];
  star?: number;        // 0-5
  annotation?: string;
  url?: string;         // Source URL if imported from web
  
  // Timestamps
  mtime: number;        // Modified time
  btime: number;        // Birth (created) time
  
  // Additional
  palettes?: ColorPalette[];
  isDeleted?: boolean;
}
```

## Performance Optimizations

### Hash-Based Change Detection

The hook uses a hash of item IDs to detect changes efficiently:

```
┌─────────────────────────────────────────────────────┐
│  Poll Eagle API                                     │
│         ↓                                           │
│  Calculate hash: SHA(item1.id + item2.id + ...)    │
│         ↓                                           │
│  Compare with previous hash                         │
│         ↓                                           │
│  ┌─────────────────┬──────────────────────────┐    │
│  │ Same hash       │ Different hash           │    │
│  │ → Skip update   │ → Update state           │    │
│  └─────────────────┴──────────────────────────┘    │
└─────────────────────────────────────────────────────┘
```

This prevents unnecessary re-renders when the selection hasn't changed.

### Visibility-Aware Polling

When `pauseOnHidden: true` (default), polling pauses when:
- Document becomes hidden (`document.hidden === true`)
- Eagle plugin window is minimized
- User switches to another tab

```
┌──────────────────────────────────────────┐
│  Plugin visible     →  Polling active    │
│  Plugin hidden      →  Polling paused    │
│  Plugin visible     →  Polling resumes   │
│                        + immediate fetch │
└──────────────────────────────────────────┘
```

### Why Polling?

Eagle's Plugin API v4.0 doesn't provide push-based selection events. The only way to detect selection changes is to poll `eagle.item.getSelected()`. The 500ms default interval balances responsiveness with CPU usage.

## Internals

### State Management

```typescript
// Internal state structure
const [items, setItems] = useState<EagleItem[]>([]);
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState<Error | null>(null);
const [isPaused, setIsPaused] = useState(false);

// Hash stored in ref to avoid triggering re-renders
const hashRef = useRef<string>('');
```

### Polling Loop

```typescript
useEffect(() => {
  if (!autoStart) return;
  
  const poll = async () => {
    const selected = await eagleApi.getSelectedItems();
    const newHash = computeHash(selected);
    
    if (newHash !== hashRef.current) {
      hashRef.current = newHash;
      setItems(selected);
    }
  };
  
  const interval = setInterval(poll, pollingInterval);
  return () => clearInterval(interval);
}, [pollingInterval, autoStart]);
```

### Visibility Listener

```typescript
useEffect(() => {
  if (!pauseOnHidden) return;
  
  const handleVisibility = () => {
    if (document.hidden) {
      stopPolling();
      setIsPaused(true);
    } else {
      startPolling();
      setIsPaused(false);
      refresh(); // Immediate fetch on resume
    }
  };
  
  document.addEventListener('visibilitychange', handleVisibility);
  
  // Also listen to Eagle's plugin visibility events
  window.addEventListener('plugin-show', handleVisibility);
  
  return () => {
    document.removeEventListener('visibilitychange', handleVisibility);
    window.removeEventListener('plugin-show', handleVisibility);
  };
}, [pauseOnHidden]);
```

## Best Practices

### Do

- ✅ Use default options for most cases (optimized defaults)
- ✅ Display loading state during initial fetch
- ✅ Handle error state gracefully
- ✅ Use `refresh()` for user-triggered updates
- ✅ Consider slower polling for CPU-intensive operations

### Don't

- ❌ Set polling interval below 200ms (too aggressive)
- ❌ Call `refresh()` in a loop (causes excessive API calls)
- ❌ Ignore the `isPaused` state in UI
- ❌ Use multiple instances in the same component tree (use Zustand instead)

## When to Use Zustand Instead

For complex apps with many components needing selection data, use the Zustand store:

```tsx
// Multiple components sharing selection
import { useSelection } from '@/stores';

function ComponentA() {
  const { items } = useSelection();
  // ...
}

function ComponentB() {
  const { items } = useSelection();
  // ...
}
```

The Zustand store provides a single polling instance shared across all consumers.

## Related

- [useTheme](./use-theme) - Theme management hook
- [useLocalStorage](./use-local-storage) - Persist selection preferences
- [ImageGrid](../components/layout/image-grid) - Display selected items
- [EagleImage](../components/layout/eagle-image) - Display individual items
