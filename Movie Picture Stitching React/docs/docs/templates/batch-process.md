---
sidebar_position: 5
title: BatchProcessTemplate
description: Layout for bulk operations with progress tracking
---

# BatchProcessTemplate

A specialized template for bulk processing workflows with queue management, progress tracking, and status visualization. Perfect for batch exports, conversions, and multi-item operations.

## Import

```tsx
import { BatchProcessTemplate } from '@/templates';
```

## Basic Usage

```tsx
import { BatchProcessTemplate } from '@/templates';

function BatchConverter() {
  const [items, setItems] = useState<ProcessItem[]>([]);
  const [status, setStatus] = useState<ProcessStatus>('idle');
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  return (
    <BatchProcessTemplate
      items={items}
      status={status}
      progress={progress}
      onStart={handleStart}
      onPause={handlePause}
      onCancel={handleCancel}
      currentPreview={<ImagePreview item={currentItem} />}
    />
  );
}
```

## Layout Structure

```
┌─────────────────────────────────────┐
│  Batch Export        [▶ Start]     │  ← Header with controls
├──────────────────────────────────────┤
│  Progress: ████████░░ 80% (8/10)   │  ← Progress bar
├──────────┬──────────────────────────┤
│ Queue    │  Current Item Preview    │
│ ✓ item1  │  ┌─────────────────────┐ │
│ ✓ item2  │  │                     │ │
│ → item3  │  │    Processing...    │ │
│ ○ item4  │  │                     │ │
│ ○ item5  │  └─────────────────────┘ │
└──────────┴──────────────────────────┘
```

## Types

### ProcessItem

```tsx
interface ProcessItem {
  id: string;
  name: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'skipped';
  error?: string;
  progress?: number;  // 0-100 for individual item progress
  thumbnail?: string;
  metadata?: Record<string, unknown>;
}
```

### ProcessStatus

```tsx
type ProcessStatus = 
  | 'idle'       // Ready to start
  | 'processing' // Currently running
  | 'paused'     // User paused
  | 'completed'  // All items done
  | 'cancelled'  // User cancelled
  | 'error';     // Fatal error occurred
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `ProcessItem[]` | **required** | Queue items |
| `status` | `ProcessStatus` | `'idle'` | Current process status |
| `progress` | `{ current: number; total: number }` | `undefined` | Progress counters |
| `currentPreview` | `ReactNode` | `undefined` | Preview of current item |
| `onStart` | `() => void` | `undefined` | Start button handler |
| `onPause` | `() => void` | `undefined` | Pause button handler |
| `onResume` | `() => void` | `undefined` | Resume button handler |
| `onCancel` | `() => void` | `undefined` | Cancel button handler |
| `onRetry` | `(itemId: string) => void` | `undefined` | Retry failed item |
| `onRemove` | `(itemId: string) => void` | `undefined` | Remove item from queue |
| `title` | `string` | `'Batch Process'` | Header title |
| `showPreview` | `boolean` | `true` | Show preview panel |
| `queueWidth` | `number` | `280` | Queue panel width |

## Examples

### Image Export Workflow

```tsx
import { BatchProcessTemplate } from '@/templates';
import { useEagleSelection } from '@/hooks';

function BatchExport() {
  const { items: selectedItems } = useEagleSelection();
  const [queue, setQueue] = useState<ProcessItem[]>([]);
  const [status, setStatus] = useState<ProcessStatus>('idle');
  const [currentIndex, setCurrentIndex] = useState(0);

  // Initialize queue from selection
  useEffect(() => {
    setQueue(selectedItems.map(item => ({
      id: item.id,
      name: item.name,
      status: 'pending',
      thumbnail: item.thumbnail,
    })));
  }, [selectedItems]);

  const handleStart = async () => {
    setStatus('processing');
    
    for (let i = 0; i < queue.length; i++) {
      setCurrentIndex(i);
      setQueue(prev => prev.map((item, idx) => 
        idx === i ? { ...item, status: 'processing' } : item
      ));

      try {
        await exportImage(queue[i]);
        setQueue(prev => prev.map((item, idx) =>
          idx === i ? { ...item, status: 'completed' } : item
        ));
      } catch (error) {
        setQueue(prev => prev.map((item, idx) =>
          idx === i ? { ...item, status: 'failed', error: error.message } : item
        ));
      }
    }

    setStatus('completed');
  };

  return (
    <BatchProcessTemplate
      title="Export Images"
      items={queue}
      status={status}
      progress={{ current: currentIndex + 1, total: queue.length }}
      onStart={handleStart}
      onCancel={() => setStatus('cancelled')}
      currentPreview={
        queue[currentIndex] && (
          <div className="flex flex-col items-center gap-4 p-4">
            <img 
              src={queue[currentIndex].thumbnail} 
              alt={queue[currentIndex].name}
              className="max-w-full max-h-64 rounded-lg"
            />
            <p className="text-sm text-gray-500">
              Processing: {queue[currentIndex].name}
            </p>
          </div>
        )
      }
    />
  );
}
```

### With Retry and Remove

```tsx
function BatchWithRetry() {
  const handleRetry = async (itemId: string) => {
    setQueue(prev => prev.map(item =>
      item.id === itemId ? { ...item, status: 'pending', error: undefined } : item
    ));
    // Re-queue item for processing
  };

  const handleRemove = (itemId: string) => {
    setQueue(prev => prev.filter(item => item.id !== itemId));
  };

  return (
    <BatchProcessTemplate
      items={queue}
      status={status}
      onRetry={handleRetry}
      onRemove={handleRemove}
      // ... other props
    />
  );
}
```

### With Pause/Resume

```tsx
function PausableProcess() {
  const [isPaused, setIsPaused] = useState(false);
  const pauseRef = useRef(false);

  const handlePause = () => {
    pauseRef.current = true;
    setIsPaused(true);
    setStatus('paused');
  };

  const handleResume = () => {
    pauseRef.current = false;
    setIsPaused(false);
    setStatus('processing');
    continueProcessing();
  };

  const processItem = async (item: ProcessItem) => {
    // Check for pause between items
    while (pauseRef.current) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    // Process item...
  };

  return (
    <BatchProcessTemplate
      items={queue}
      status={status}
      onStart={handleStart}
      onPause={handlePause}
      onResume={handleResume}
      onCancel={handleCancel}
    />
  );
}
```

### Custom Queue Item Rendering

```tsx
function CustomQueueItems() {
  return (
    <BatchProcessTemplate
      items={queue}
      renderQueueItem={(item, index) => (
        <div 
          key={item.id}
          className={cn(
            'flex items-center gap-3 p-2 rounded-lg',
            item.status === 'completed' && 'bg-green-50 dark:bg-green-900/20',
            item.status === 'failed' && 'bg-red-50 dark:bg-red-900/20',
            item.status === 'processing' && 'bg-blue-50 dark:bg-blue-900/20',
          )}
        >
          <StatusIcon status={item.status} />
          <img src={item.thumbnail} className="w-10 h-10 rounded" />
          <div className="flex-1 min-w-0">
            <p className="truncate font-medium">{item.name}</p>
            {item.error && (
              <p className="text-xs text-red-500">{item.error}</p>
            )}
          </div>
          {item.status === 'failed' && (
            <Button size="sm" onClick={() => onRetry(item.id)}>
              Retry
            </Button>
          )}
        </div>
      )}
    />
  );
}
```

### Progress with Details

```tsx
function DetailedProgress() {
  const stats = useMemo(() => ({
    completed: queue.filter(i => i.status === 'completed').length,
    failed: queue.filter(i => i.status === 'failed').length,
    pending: queue.filter(i => i.status === 'pending').length,
  }), [queue]);

  return (
    <BatchProcessTemplate
      items={queue}
      status={status}
      progress={{ current: stats.completed, total: queue.length }}
      headerContent={
        <div className="flex gap-4 text-sm">
          <span className="text-green-600">✓ {stats.completed}</span>
          <span className="text-red-600">✕ {stats.failed}</span>
          <span className="text-gray-500">○ {stats.pending}</span>
        </div>
      }
    />
  );
}
```

## Queue Item States

| Status | Icon | Color | Description |
|--------|------|-------|-------------|
| `pending` | ○ | Gray | Waiting to process |
| `processing` | → (animated) | Blue | Currently processing |
| `completed` | ✓ | Green | Successfully completed |
| `failed` | ✕ | Red | Error occurred |
| `skipped` | ⊘ | Yellow | Skipped by user |

## Control Button States

| Status | Start | Pause | Resume | Cancel |
|--------|-------|-------|--------|--------|
| `idle` | Enabled | Hidden | Hidden | Hidden |
| `processing` | Hidden | Enabled | Hidden | Enabled |
| `paused` | Hidden | Hidden | Enabled | Enabled |
| `completed` | Enabled* | Hidden | Hidden | Hidden |
| `cancelled` | Enabled | Hidden | Hidden | Hidden |

*Enabled for "Process Again"

## Best Practices

### ✅ Do

```tsx
// Show clear progress feedback
<BatchProcessTemplate
  progress={{ current: 5, total: 10 }}
  currentPreview={<DetailedPreview />}
/>

// Handle all states
<BatchProcessTemplate
  onStart={handleStart}
  onPause={handlePause}
  onResume={handleResume}
  onCancel={handleCancel}
  onRetry={handleRetry}
/>

// Update items immutably
setQueue(prev => prev.map(item =>
  item.id === currentId ? { ...item, status: 'completed' } : item
));
```

### ❌ Don't

```tsx
// Don't mutate items directly
queue[index].status = 'completed';  // Wrong!

// Don't block UI during processing
await processAll();  // Use async with status updates

// Don't forget error handling
try {
  await processItem(item);
} catch (error) {
  // Handle and show error to user
}
```

## When to Use

**Use BatchProcessTemplate when:**
- Processing multiple items sequentially
- Need queue visualization
- Require pause/resume capability
- Want to show individual item progress

**Consider other templates when:**
- Single item processing → [`SinglePanelTemplate`](./single-panel)
- Browsing/selecting images → [`ImageBrowserTemplate`](./image-browser)
- Complex three-panel workflow → [`ThreeColumnTemplate`](./three-column)

## Related

- [Templates Overview](./overview) - All available templates
- [useEagleSelection](../hooks/use-eagle-selection) - Get selected items
