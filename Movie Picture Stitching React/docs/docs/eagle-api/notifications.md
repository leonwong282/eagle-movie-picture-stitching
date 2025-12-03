---
sidebar_position: 8
title: Notifications
description: System notifications and alerts
---

# Notifications

Display system notifications to alert users outside the plugin window.

## Import

```tsx
import { eagleApi } from '@/lib/eagle-api';
```

## Show Notification

Display a system notification.

```tsx
await eagleApi.notification.show(options);
```

### Options

| Option | Type | Required | Description |
|--------|------|----------|-------------|
| `title` | `string` | Yes | Notification title |
| `body` | `string` | No | Notification body text |
| `silent` | `boolean` | No | Suppress notification sound |

### Basic Example

```tsx
await eagleApi.notification.show({
  title: 'Export Complete',
  body: '10 images have been exported successfully.',
});
```

### Silent Notification

```tsx
await eagleApi.notification.show({
  title: 'Background Task',
  body: 'Processing complete.',
  silent: true,  // No sound
});
```

## Common Patterns

### Export Completion

```tsx
async function notifyExportComplete(count: number, folder: string) {
  await eagleApi.notification.show({
    title: 'Export Complete',
    body: `${count} images saved to ${folder}`,
  });
}
```

### Error Notification

```tsx
async function notifyError(operation: string, error: string) {
  await eagleApi.notification.show({
    title: `${operation} Failed`,
    body: error,
  });
}
```

### Progress Notification

```tsx
async function notifyProgress(current: number, total: number) {
  // Only notify at milestones
  const percentage = Math.round((current / total) * 100);
  
  if (percentage === 50 || percentage === 100) {
    await eagleApi.notification.show({
      title: 'Processing...',
      body: `${percentage}% complete (${current}/${total})`,
      silent: true,
    });
  }
}
```

### Batch Operation Summary

```tsx
interface BatchResult {
  success: number;
  failed: number;
  skipped: number;
}

async function notifyBatchComplete(result: BatchResult) {
  const { success, failed, skipped } = result;
  
  if (failed > 0) {
    await eagleApi.notification.show({
      title: 'Batch Complete with Errors',
      body: `✓ ${success} succeeded, ✗ ${failed} failed, ⊘ ${skipped} skipped`,
    });
  } else {
    await eagleApi.notification.show({
      title: 'Batch Complete',
      body: `Successfully processed ${success} items.`,
    });
  }
}
```

## When to Use Notifications

### ✅ Use Notifications For

- **Long-running tasks** that complete in the background
- **Important alerts** when the plugin window is hidden
- **Errors** that need immediate attention
- **Completion status** of batch operations

### ❌ Don't Use Notifications For

- **Every small action** (use toast instead)
- **Continuous updates** (shows too many notifications)
- **In-plugin feedback** (use UI components)
- **Non-essential information**

## Notifications vs Toast

| Feature | Notification | Toast |
|---------|--------------|-------|
| Visibility | System-wide | Plugin window only |
| Persistence | Stays in notification center | Auto-dismisses |
| Use case | Background tasks | Immediate feedback |
| Intrusiveness | High | Low |

### Example: Choosing the Right Feedback

```tsx
async function processImages(images: ImageItem[]) {
  // Start: Use toast (user is in plugin)
  toast.info(`Processing ${images.length} images...`);
  
  for (const image of images) {
    await processImage(image);
  }
  
  // Complete: Use notification if window might be hidden
  if (document.hidden) {
    await eagleApi.notification.show({
      title: 'Processing Complete',
      body: `${images.length} images processed`,
    });
  } else {
    toast.success('Processing complete!');
  }
}
```

## Browser vs Eagle Behavior

| Method | Browser (Mock) | Eagle |
|--------|----------------|-------|
| `show()` | Uses Web Notification API (if permitted) | Uses system notification |

### Browser Fallback

In browser development, the mock system uses the Web Notification API:

```tsx
// In mock mode, may require permission
if ('Notification' in window && Notification.permission === 'granted') {
  new Notification(title, { body });
}
```

## Best Practices

### ✅ Do

```tsx
// Keep titles short and clear
title: 'Export Complete'  // Good
title: 'The export operation has completed successfully'  // Too long

// Provide actionable information
body: '10 images saved to Desktop/Exports'

// Use silent for non-urgent updates
silent: true  // For progress updates

// Check visibility before notifying
if (document.hidden) {
  await eagleApi.notification.show({ ... });
}
```

### ❌ Don't

```tsx
// Don't spam notifications
for (const item of items) {
  await eagleApi.notification.show({ title: `Processing ${item.name}` });
  // Shows 100s of notifications!
}

// Don't use for in-plugin feedback
await eagleApi.notification.show({ title: 'Button clicked' });
// Use toast instead

// Don't include sensitive data
body: `Password: ${password}`  // Security risk!
```

## Integration Example

```tsx
function useNotificationFeedback() {
  const wasHidden = useRef(false);

  // Track if window was hidden during operation
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        wasHidden.current = true;
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  const notify = useCallback(async (title: string, body: string) => {
    // Only show system notification if window was hidden
    if (wasHidden.current) {
      await eagleApi.notification.show({ title, body });
      wasHidden.current = false;
    } else {
      // Window was visible, use toast
      toast.success(body);
    }
  }, []);

  return { notify };
}

// Usage
function ExportButton() {
  const { notify } = useNotificationFeedback();

  const handleExport = async () => {
    const count = await exportImages();
    await notify('Export Complete', `${count} images exported`);
  };

  return <Button onClick={handleExport}>Export</Button>;
}
```

## Related

- [Eagle API Overview](./overview) - API introduction
- [Toast Component](../components/ui/toast) - In-plugin notifications
- [Events & Lifecycle](./events-lifecycle) - Plugin visibility events
