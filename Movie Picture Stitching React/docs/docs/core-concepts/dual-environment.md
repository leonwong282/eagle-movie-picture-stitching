---
sidebar_position: 1
title: Dual Environment Pattern
description: How the template works in both browser and Eagle environments
---

# Dual Environment Pattern

The Eagle React Template's core innovation is the **dual environment pattern** — write code once, run it seamlessly in both browser development and Eagle production.

## The Challenge

When building Eagle plugins, you face a development dilemma:

| Environment | Pros | Cons |
|-------------|------|------|
| **Eagle Only** | Real API, real data | No hot reload, slow iteration |
| **Browser Only** | Fast HMR, DevTools | Can't test Eagle integration |

The dual environment pattern gives you **both advantages with no compromises**.

## How It Works

```
┌─────────────────────────────────────────────────────────────┐
│                     Your React App                          │
│                                                             │
│   - Components render identically                           │
│   - Hooks work the same way                                 │
│   - State management unchanged                              │
├─────────────────────────────────────────────────────────────┤
│                   EagleAPIAdapter                           │
│         (src/lib/eagle-api.ts - singleton)                  │
│                                                             │
│   - Unified API interface                                   │
│   - Environment detection                                   │
│   - Mock/Real switching                                     │
├─────────────────┬───────────────────────────────────────────┤
│   Browser Dev   │              Eagle Runtime                │
│  (npm run dev)  │           (deployed plugin)               │
├─────────────────┼───────────────────────────────────────────┤
│  Mock Eagle API │           window.eagle                    │
│  (fake data)    │        (real Eagle API)                   │
│                 │                                           │
│  - Configurable │  - Live library data                      │
│  - Instant      │  - Real selections                        │
│  - Predictable  │  - Actual file paths                      │
└─────────────────┴───────────────────────────────────────────┘
```

## Environment Detection

The template provides utility functions to detect the current environment:

```typescript
import { isEagleEnvironment, hasNodeRequire } from '@/lib/eagle-api';

// Check if running inside Eagle
if (isEagleEnvironment()) {
  // window.eagle is available
  console.log('Running in Eagle!');
} else {
  // Using mock API
  console.log('Running in browser');
}

// Check if Node.js require() is available
if (hasNodeRequire()) {
  const fs = window.require('fs');
  const path = window.require('path');
}
```

### Implementation

```typescript
// src/lib/eagle-api.ts

export const isEagleEnvironment = (): boolean => {
  return typeof window !== 'undefined' && 
         typeof (window as EagleWindow).eagle !== 'undefined';
};

export const hasNodeRequire = (): boolean => {
  return typeof window !== 'undefined' && 
         typeof (window as NodeWindow).require === 'function';
};
```

## The Golden Rule

:::danger Critical Pattern
**Never access `window.eagle` directly.** Always use the `eagleApi` singleton.
:::

```tsx
// ❌ WRONG: Crashes in browser
const items = await window.eagle.item.getSelected();

// ✅ CORRECT: Works everywhere
import { eagleApi } from '@/lib/eagle-api';
const items = await eagleApi.getSelectedItems();
```

## Practical Examples

### Fetching Selected Items

```tsx
import { eagleApi } from '@/lib/eagle-api';
import { useEffect, useState } from 'react';

function SelectionDisplay() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    async function fetchItems() {
      // Works in both environments
      const selected = await eagleApi.getSelectedItems();
      setItems(selected);
    }
    fetchItems();
  }, []);

  return (
    <div>
      <p>Selected: {items.length} items</p>
      {/* In browser: shows mock items */}
      {/* In Eagle: shows real selection */}
    </div>
  );
}
```

### Conditional Features

Some features only make sense in Eagle:

```tsx
import { isEagleEnvironment, eagleApi } from '@/lib/eagle-api';

function ExportButton({ items }) {
  const handleExport = async () => {
    if (!isEagleEnvironment()) {
      // Show user-friendly message in browser
      alert('Export only works in Eagle');
      return;
    }

    // Real export logic
    for (const item of items) {
      await eagleApi.addItemFromPath(item.filePath, {
        name: `Exported-${item.name}`,
      });
    }
  };

  return (
    <Button onClick={handleExport}>
      Export to Library
    </Button>
  );
}
```

### Theme Synchronization

```tsx
import { eagleApi } from '@/lib/eagle-api';

function ThemeAwareComponent() {
  // Works in both environments:
  // - Browser: Uses system preference or localStorage
  // - Eagle: Uses Eagle's theme setting
  const isDark = eagleApi.isDarkMode;

  return (
    <div className={isDark ? 'bg-gray-900' : 'bg-white'}>
      Current theme: {isDark ? 'Dark' : 'Light'}
    </div>
  );
}
```

## Development Workflow

### 1. UI Development (Browser)

```bash
npm run dev
```

- Instant hot reload
- Full React DevTools
- Mock data for testing edge cases
- No Eagle installation required

### 2. Integration Testing (Eagle Watch)

```bash
npm run build:watch
```

1. Start watch mode
2. Import project in Eagle (Settings → Plugins → Developer)
3. Reload plugin after changes (`Cmd+R`)
4. Test with real Eagle data

### 3. Production (Deploy)

```bash
npm run deploy
```

- Optimized build
- Copied to Eagle plugins directory
- Restart Eagle to activate

## Benefits

| Aspect | Browser Dev | Eagle Runtime |
|--------|-------------|---------------|
| **Hot Reload** | ✅ Instant | ⚠️ Manual `Cmd+R` |
| **DevTools** | ✅ Full Chrome DevTools | ✅ Built-in DevTools |
| **Data** | Mock (configurable) | Real library data |
| **File System** | ❌ Not available | ✅ Full access |
| **Eagle API** | Mock implementation | Real API |
| **Use Case** | UI iteration | Integration testing |

## Next Steps

- **[Eagle API Adapter](./eagle-api-adapter)** — Deep dive into the adapter pattern
- **[Mock System](./mock-system)** — Configure mock data for testing
- **[Theme & i18n](./theme-i18n)** — Sync with Eagle's settings
