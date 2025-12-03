---
sidebar_position: 4
title: Persistence
description: Automatic state persistence configuration
---

# Persistence

The store uses Zustand's persist middleware to automatically save and restore state across sessions.

## Overview

| Feature | Description |
|---------|-------------|
| **Storage** | localStorage (configurable) |
| **Key** | `eagle-react-template:store` |
| **Partial** | Only settings slice persisted |
| **Hydration** | Automatic on app load |

## Basic Configuration

```tsx
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const usePluginStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // ... state and actions
    }),
    {
      name: 'eagle-react-template:store',  // localStorage key
    }
  )
);
```

## Partial Persistence

Only persist specific slices to avoid storing ephemeral state:

```tsx
export const usePluginStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Selection - NOT persisted (changes frequently)
      selection: {
        items: [],
        isLoading: false,
        isPolling: false,
      },
      
      // Settings - PERSISTED
      settings: {
        theme: 'auto',
        quality: 0.9,
        outputFormat: 'png',
      },
      
      // Processing - NOT persisted (transient)
      processing: {
        status: 'idle',
        progress: 0,
        results: [],
      },
      
      // UI - NOT persisted (ephemeral)
      ui: {
        activePanel: 'selection',
        modalOpen: false,
      },
      
      // ... actions
    }),
    {
      name: 'eagle-react-template:store',
      partialize: (state) => ({
        settings: state.settings,  // Only persist settings
      }),
    }
  )
);
```

## Storage Options

### localStorage (Default)

```tsx
persist(
  storeDefinition,
  {
    name: 'my-store',
    // Uses localStorage by default
  }
)
```

### sessionStorage

```tsx
persist(
  storeDefinition,
  {
    name: 'my-store',
    storage: createJSONStorage(() => sessionStorage),
  }
)
```

### Custom Storage

```tsx
import { createJSONStorage, StateStorage } from 'zustand/middleware';

const customStorage: StateStorage = {
  getItem: async (name) => {
    // Fetch from IndexedDB, remote server, etc.
    return await customGet(name);
  },
  setItem: async (name, value) => {
    await customSet(name, value);
  },
  removeItem: async (name) => {
    await customRemove(name);
  },
};

persist(
  storeDefinition,
  {
    name: 'my-store',
    storage: createJSONStorage(() => customStorage),
  }
)
```

## Versioning & Migration

Handle store schema changes between versions:

```tsx
interface SettingsV1 {
  theme: 'light' | 'dark';
  quality: number;
}

interface SettingsV2 {
  theme: 'light' | 'dark' | 'auto';  // Added 'auto'
  quality: number;
  outputFormat: 'png' | 'jpg' | 'webp';  // New field
}

persist(
  storeDefinition,
  {
    name: 'eagle-react-template:store',
    version: 2,  // Current version
    
    migrate: (persistedState, version) => {
      const state = persistedState as any;
      
      // Migrate from v1 to v2
      if (version === 1) {
        state.settings.outputFormat = 'png';  // Add default
        // 'auto' theme is now valid
      }
      
      return state;
    },
  }
)
```

### Migration Best Practices

```tsx
const migrations = {
  1: (state: any) => ({
    ...state,
    settings: {
      ...state.settings,
      outputFormat: 'png',
    },
  }),
  
  2: (state: any) => ({
    ...state,
    settings: {
      ...state.settings,
      autoPreview: true,  // New in v2
    },
  }),
  
  3: (state: any) => ({
    ...state,
    settings: {
      ...state.settings,
      // Rename property
      confirmExport: state.settings.confirmBeforeExport,
    },
  }),
};

persist(
  storeDefinition,
  {
    name: 'eagle-react-template:store',
    version: 3,
    
    migrate: (state, version) => {
      // Run all migrations from current version to latest
      let migrated = state;
      for (let v = version; v < 3; v++) {
        migrated = migrations[v + 1]?.(migrated) ?? migrated;
      }
      return migrated;
    },
  }
)
```

## Hydration State

Detect when the store has finished loading from storage:

```tsx
import { useEffect, useState } from 'react';

function useHydration() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Wait for Zustand to finish hydration
    const unsubFinishHydration = usePluginStore.persist.onFinishHydration(
      () => setHydrated(true)
    );

    // Check if already hydrated
    setHydrated(usePluginStore.persist.hasHydrated());

    return () => {
      unsubFinishHydration();
    };
  }, []);

  return hydrated;
}

// Usage
function App() {
  const hydrated = useHydration();
  
  if (!hydrated) {
    return <LoadingScreen />;
  }
  
  return <MainApp />;
}
```

### Suspense-Style Loading

```tsx
function HydrationGate({ children }: { children: React.ReactNode }) {
  const hydrated = useHydration();
  
  if (!hydrated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }
  
  return <>{children}</>;
}

// Usage
function App() {
  return (
    <HydrationGate>
      <MainApp />
    </HydrationGate>
  );
}
```

## Merge Strategies

Control how stored state merges with initial state:

```tsx
persist(
  storeDefinition,
  {
    name: 'eagle-react-template:store',
    
    // Deep merge (default: shallow)
    merge: (persistedState, currentState) => {
      return {
        ...currentState,
        settings: {
          ...currentState.settings,
          ...(persistedState as any).settings,
        },
      };
    },
  }
)
```

## Clear Persisted State

```tsx
// Clear all persisted data
function resetStore() {
  usePluginStore.persist.clearStorage();
  
  // Also reset in-memory state
  usePluginStore.setState({
    settings: defaultSettings,
  });
}

// In a component
function SettingsPanel() {
  const handleReset = () => {
    if (confirm('Reset all settings?')) {
      resetStore();
    }
  };
  
  return (
    <button onClick={handleReset}>
      Reset to Defaults
    </button>
  );
}
```

## Skip Persistence

Temporarily disable persistence:

```tsx
// Access store without triggering persistence
const { settings } = usePluginStore.getState();

// Modify without persisting
usePluginStore.setState(
  { settings: tempSettings },
  false  // Don't trigger persist
);
```

## Error Handling

Handle storage errors gracefully:

```tsx
const storage = createJSONStorage(() => ({
  getItem: (name) => {
    try {
      return localStorage.getItem(name);
    } catch (error) {
      console.warn('Failed to read from storage:', error);
      return null;
    }
  },
  setItem: (name, value) => {
    try {
      localStorage.setItem(name, value);
    } catch (error) {
      // Handle quota exceeded
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        console.warn('Storage quota exceeded, clearing old data');
        localStorage.clear();
        localStorage.setItem(name, value);
      } else {
        console.error('Failed to write to storage:', error);
      }
    }
  },
  removeItem: (name) => {
    try {
      localStorage.removeItem(name);
    } catch (error) {
      console.error('Failed to remove from storage:', error);
    }
  },
}));
```

## Debugging

### Inspect Persisted State

```tsx
// In browser console
const stored = localStorage.getItem('eagle-react-template:store');
console.log(JSON.parse(stored));
```

### Log Persistence Events

```tsx
persist(
  storeDefinition,
  {
    name: 'eagle-react-template:store',
    
    onRehydrateStorage: (state) => {
      console.log('Starting hydration');
      
      return (state, error) => {
        if (error) {
          console.error('Hydration failed:', error);
        } else {
          console.log('Hydration complete:', state);
        }
      };
    },
  }
)
```

## Multiple Stores

Persist multiple independent stores:

```tsx
// Main plugin store
export const usePluginStore = create<PluginState>()(
  persist(
    (set, get) => ({ /* ... */ }),
    { name: 'eagle-plugin:main' }
  )
);

// User preferences store
export const usePrefsStore = create<PrefsState>()(
  persist(
    (set, get) => ({ /* ... */ }),
    { name: 'eagle-plugin:prefs' }
  )
);

// Cache store (shorter retention)
export const useCacheStore = create<CacheState>()(
  persist(
    (set, get) => ({ /* ... */ }),
    { 
      name: 'eagle-plugin:cache',
      storage: createJSONStorage(() => sessionStorage),  // Cleared on close
    }
  )
);
```

## Best Practices

### ✅ Do

```tsx
// Persist only essential user preferences
partialize: (state) => ({
  settings: state.settings,
})

// Version your store for migrations
version: 2,
migrate: (state, version) => { /* ... */ }

// Handle hydration in UI
function App() {
  if (!useHydration()) return <Loading />;
  return <MainApp />;
}

// Use namespaced keys
name: 'eagle-react-template:store'
```

### ❌ Don't

```tsx
// Don't persist transient state
partialize: (state) => state  // Persists everything!

// Don't persist sensitive data
partialize: (state) => ({
  apiKey: state.apiKey,  // Security risk!
})

// Don't persist large data
partialize: (state) => ({
  allItems: state.items,  // Could be thousands of items
})

// Don't ignore hydration timing
function App() {
  const theme = usePluginStore(s => s.settings.theme);
  // Theme might flash if checked before hydration
}
```

## Related

- [State Overview](./overview) - Architecture introduction
- [Store Slices](./slices) - State organization
- [Selectors](./selectors) - Computed state patterns
