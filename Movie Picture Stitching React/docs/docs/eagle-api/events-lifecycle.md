---
sidebar_position: 9
title: Events & Lifecycle
description: Plugin lifecycle events and callbacks
---

# Events & Lifecycle

Handle plugin lifecycle events to respond to visibility changes, activation, and cleanup.

## Import

```tsx
import { eagleApi } from '@/lib/eagle-api';
```

## Event Overview

| Event | Trigger | Use Case |
|-------|---------|----------|
| `onPluginShow` | Plugin window becomes visible | Resume polling, animations |
| `onPluginHide` | Plugin window becomes hidden | Pause expensive operations |
| `onPluginRun` | Plugin starts executing | Initialize state |
| `onPluginBeforeExit` | Plugin is about to close | Save state, cleanup |
| `onLibraryChanged` | Eagle library switches | Refresh data |

## Plugin Show

Fired when the plugin window becomes visible.

```tsx
eagleApi.onPluginShow(() => {
  console.log('Plugin is now visible');
});
```

### Common Uses

```tsx
// Resume polling when visible
eagleApi.onPluginShow(() => {
  startSelectionPolling();
});

// Refresh data on show
eagleApi.onPluginShow(async () => {
  await refreshSelectedItems();
});

// Resume animations
eagleApi.onPluginShow(() => {
  resumeAnimations();
});
```

## Plugin Hide

Fired when the plugin window becomes hidden.

```tsx
eagleApi.onPluginHide(() => {
  console.log('Plugin is now hidden');
});
```

### Common Uses

```tsx
// Pause polling when hidden
eagleApi.onPluginHide(() => {
  stopSelectionPolling();
});

// Pause expensive operations
eagleApi.onPluginHide(() => {
  pauseAnimations();
  pauseVideoPlayback();
});

// Save draft state
eagleApi.onPluginHide(() => {
  saveDraftToStorage();
});
```

## Plugin Run

Fired when the plugin starts executing.

```tsx
eagleApi.onPluginRun(() => {
  console.log('Plugin started');
});
```

### Common Uses

```tsx
// Initialize application state
eagleApi.onPluginRun(() => {
  initializeApp();
  loadUserPreferences();
});

// Start initial data fetch
eagleApi.onPluginRun(async () => {
  const items = await eagleApi.item.getSelected();
  setSelectedItems(items);
});

// Setup event listeners
eagleApi.onPluginRun(() => {
  setupKeyboardShortcuts();
  setupDragAndDrop();
});
```

## Plugin Before Exit

Fired before the plugin closes. Supports async cleanup.

```tsx
eagleApi.onPluginBeforeExit(async () => {
  console.log('Plugin is closing');
  await saveState();
});
```

### Common Uses

```tsx
// Save user preferences
eagleApi.onPluginBeforeExit(async () => {
  await savePreferences(userSettings);
});

// Cleanup temporary files
eagleApi.onPluginBeforeExit(async () => {
  await cleanupTempFiles();
});

// Cancel pending operations
eagleApi.onPluginBeforeExit(async () => {
  cancelAllPendingOperations();
});

// Save unsaved work
eagleApi.onPluginBeforeExit(async () => {
  if (hasUnsavedChanges) {
    await saveDraft();
  }
});
```

## Library Changed

Fired when the user switches to a different Eagle library.

```tsx
eagleApi.onLibraryChanged(() => {
  console.log('Library changed');
});
```

### Common Uses

```tsx
// Reset plugin state
eagleApi.onLibraryChanged(() => {
  resetState();
  clearCache();
});

// Reload data for new library
eagleApi.onLibraryChanged(async () => {
  const folders = await eagleApi.folder.getAll();
  setFolders(folders);
});

// Update UI for new library
eagleApi.onLibraryChanged(() => {
  showLoadingState();
  refreshUI();
});
```

## Complete Setup Pattern

```tsx
function setupPluginLifecycle() {
  // Initialize on start
  eagleApi.onPluginRun(() => {
    console.log('Initializing plugin...');
    initializeApp();
  });

  // Handle visibility
  eagleApi.onPluginShow(() => {
    console.log('Plugin shown');
    resumeOperations();
  });

  eagleApi.onPluginHide(() => {
    console.log('Plugin hidden');
    pauseOperations();
  });

  // Handle library switch
  eagleApi.onLibraryChanged(() => {
    console.log('Library changed');
    resetForNewLibrary();
  });

  // Cleanup before exit
  eagleApi.onPluginBeforeExit(async () => {
    console.log('Plugin closing...');
    await saveAllState();
    await cleanup();
  });
}
```

## React Integration

### usePluginLifecycle Hook

```tsx
import { useEffect } from 'react';
import { eagleApi } from '@/lib/eagle-api';

function usePluginLifecycle(callbacks: {
  onShow?: () => void;
  onHide?: () => void;
  onRun?: () => void;
  onBeforeExit?: () => Promise<void>;
  onLibraryChanged?: () => void;
}) {
  useEffect(() => {
    const { onShow, onHide, onRun, onBeforeExit, onLibraryChanged } = callbacks;

    if (onShow) eagleApi.onPluginShow(onShow);
    if (onHide) eagleApi.onPluginHide(onHide);
    if (onRun) eagleApi.onPluginRun(onRun);
    if (onBeforeExit) eagleApi.onPluginBeforeExit(onBeforeExit);
    if (onLibraryChanged) eagleApi.onLibraryChanged(onLibraryChanged);

    // Note: Eagle API doesn't provide unsubscribe methods
    // Events are cleaned up when plugin closes
  }, []);
}

// Usage
function App() {
  usePluginLifecycle({
    onShow: () => console.log('Shown!'),
    onHide: () => console.log('Hidden!'),
    onLibraryChanged: () => window.location.reload(),
  });

  return <div>My Plugin</div>;
}
```

### Visibility-Aware Polling

```tsx
function useVisibilityAwarePolling(
  pollFn: () => Promise<void>,
  interval: number = 500
) {
  const [isPolling, setIsPolling] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    eagleApi.onPluginShow(() => {
      setIsPolling(true);
    });

    eagleApi.onPluginHide(() => {
      setIsPolling(false);
    });
  }, []);

  useEffect(() => {
    if (isPolling) {
      intervalRef.current = setInterval(pollFn, interval);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPolling, pollFn, interval]);

  return { isPolling };
}
```

### Auto-Save on Hide

```tsx
function useAutoSaveOnHide(data: unknown, saveFn: (data: unknown) => void) {
  const dataRef = useRef(data);
  
  // Keep ref updated
  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  useEffect(() => {
    eagleApi.onPluginHide(() => {
      saveFn(dataRef.current);
    });
  }, [saveFn]);
}

// Usage
function Editor() {
  const [content, setContent] = useState('');
  
  useAutoSaveOnHide(content, (data) => {
    localStorage.setItem('draft', data as string);
  });

  return <textarea value={content} onChange={e => setContent(e.target.value)} />;
}
```

## Lifecycle Sequence

```
┌─────────────────────────────────────────────────────────────────┐
│                        Plugin Lifecycle                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  User opens plugin                                               │
│         │                                                        │
│         ▼                                                        │
│  ┌─────────────────┐                                             │
│  │  onPluginRun    │  ← Initialize state, load preferences      │
│  └────────┬────────┘                                             │
│           │                                                      │
│           ▼                                                      │
│  ┌─────────────────┐                                             │
│  │  onPluginShow   │  ← Start polling, animations               │
│  └────────┬────────┘                                             │
│           │                                                      │
│           ▼                                                      │
│  ┌─────────────────────────────────────────┐                     │
│  │           Plugin is Active              │                     │
│  │                                         │                     │
│  │   ┌─────────────┐     ┌─────────────┐   │                     │
│  │   │onPluginHide │ ←─→ │onPluginShow │   │  User toggles      │
│  │   └─────────────┘     └─────────────┘   │  visibility        │
│  │                                         │                     │
│  │   ┌───────────────────┐                 │                     │
│  │   │ onLibraryChanged  │                 │  User switches     │
│  │   └───────────────────┘                 │  library           │
│  └─────────────────────────────────────────┘                     │
│           │                                                      │
│           ▼  User closes plugin                                  │
│  ┌─────────────────────┐                                         │
│  │ onPluginBeforeExit  │  ← Save state, cleanup                 │
│  └─────────────────────┘                                         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Browser vs Eagle Behavior

| Event | Browser (Mock) | Eagle |
|-------|----------------|-------|
| `onPluginShow` | Uses `visibilitychange` event | Native Eagle event |
| `onPluginHide` | Uses `visibilitychange` event | Native Eagle event |
| `onPluginRun` | Fires immediately on load | Fires on plugin activation |
| `onPluginBeforeExit` | Uses `beforeunload` event | Native Eagle event |
| `onLibraryChanged` | Not triggered | Native Eagle event |

## Best Practices

### ✅ Do

```tsx
// Use async for cleanup operations
eagleApi.onPluginBeforeExit(async () => {
  await saveData();  // Ensures save completes before exit
});

// Pause expensive operations when hidden
eagleApi.onPluginHide(() => {
  stopPolling();
  pauseAnimations();
});

// Reset state on library change
eagleApi.onLibraryChanged(() => {
  store.getState().reset();
});
```

### ❌ Don't

```tsx
// Don't rely on onPluginHide for critical saves
// User might force-quit Eagle
eagleApi.onPluginHide(() => {
  saveImportantData();  // Might not complete!
});

// Instead, save frequently
useAutoSave(data, { interval: 5000 });  // Save every 5 seconds

// Don't do heavy work in onPluginShow
eagleApi.onPluginShow(async () => {
  await loadEntireDatabase();  // Blocks UI!
});

// Instead, load progressively
eagleApi.onPluginShow(() => {
  loadMinimalData().then(() => loadFullData());
});
```

## Related

- [Eagle API Overview](./overview) - API introduction
- [Window Controls](./window-controls) - Window visibility control
- [Notifications](./notifications) - User alerts
