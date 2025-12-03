---
sidebar_position: 4
title: useLocalStorage
description: Type-safe localStorage hook with debounced writes
---

# useLocalStorage

A hook for syncing React state with localStorage, featuring debounced writes, type safety, and optional validation.

## Import

```tsx
import { useLocalStorage } from '@/hooks';
```

## Basic Usage

```tsx
function Settings() {
  const [quality, setQuality] = useLocalStorage('quality', 80);

  return (
    <Slider 
      value={quality} 
      onChange={setQuality}
      min={0}
      max={100}
    />
  );
}
```

## Signature

```tsx
const [value, setValue, reset] = useLocalStorage<T>(
  key: string,
  defaultValue: T,
  options?: UseLocalStorageOptions<T>
);
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `key` | `string` | Storage key (auto-namespaced with `eagle-react-template:`) |
| `defaultValue` | `T` | Default value if nothing in storage |
| `options` | `UseLocalStorageOptions<T>` | Optional configuration |

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `validator` | `(value: unknown) => T \| null` | - | Validate stored values |
| `debounceMs` | `number` | `300` | Debounce delay for writes |

## Return Value

Returns a tuple similar to `useState`:

| Index | Type | Description |
|-------|------|-------------|
| `0` | `T` | Current value |
| `1` | `(value: T \| ((prev: T) => T)) => void` | Update function |
| `2` | `() => void` | Reset to default value |

## Examples

### Simple Value

```tsx
function Counter() {
  const [count, setCount] = useLocalStorage('counter', 0);

  return (
    <div>
      <p>Count: {count}</p>
      <Button onClick={() => setCount(c => c + 1)}>Increment</Button>
    </div>
  );
}
```

### Object State

```tsx
interface UserPrefs {
  theme: 'light' | 'dark';
  quality: number;
  autoSave: boolean;
}

function Preferences() {
  const [prefs, setPrefs] = useLocalStorage<UserPrefs>('prefs', {
    theme: 'light',
    quality: 80,
    autoSave: true,
  });

  const updateQuality = (quality: number) => {
    setPrefs(prev => ({ ...prev, quality }));
  };

  return (
    <div className="space-y-4">
      <Slider 
        value={prefs.quality} 
        onChange={updateQuality}
      />
      <Checkbox 
        checked={prefs.autoSave}
        onCheckedChange={(checked) => 
          setPrefs(prev => ({ ...prev, autoSave: checked }))
        }
      />
    </div>
  );
}
```

### With Validation

```tsx
interface Settings {
  quality: number;
  format: 'png' | 'jpg' | 'webp';
}

const validateSettings = (value: unknown): Settings | null => {
  if (!value || typeof value !== 'object') return null;
  
  const obj = value as Record<string, unknown>;
  
  if (typeof obj.quality !== 'number' || obj.quality < 0 || obj.quality > 100) {
    return null;
  }
  
  if (!['png', 'jpg', 'webp'].includes(obj.format as string)) {
    return null;
  }
  
  return obj as Settings;
};

function SettingsPanel() {
  const [settings, setSettings] = useLocalStorage<Settings>(
    'settings',
    { quality: 80, format: 'png' },
    { validator: validateSettings }
  );

  // If stored value is invalid, falls back to default
  return <div>Quality: {settings.quality}</div>;
}
```

### With Reset

```tsx
function ResettableSettings() {
  const [settings, setSettings, resetSettings] = useLocalStorage('settings', {
    volume: 50,
    muted: false,
  });

  return (
    <div className="space-y-4">
      <Slider 
        value={settings.volume} 
        onChange={(v) => setSettings(s => ({ ...s, volume: v }))}
      />
      <Button variant="outline" onClick={resetSettings}>
        Reset to Defaults
      </Button>
    </div>
  );
}
```

### Custom Debounce

```tsx
function RealTimeSync() {
  // Faster saves for important data
  const [draft, setDraft] = useLocalStorage('draft', '', {
    debounceMs: 100,  // Save quickly
  });

  return (
    <textarea 
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      placeholder="Start typing..."
    />
  );
}

function LargeData() {
  // Slower saves for large data
  const [data, setData] = useLocalStorage('largeData', [], {
    debounceMs: 1000,  // Batch writes
  });
  
  // ...
}
```

### Functional Updates

```tsx
function TodoList() {
  const [todos, setTodos] = useLocalStorage<string[]>('todos', []);

  const addTodo = (text: string) => {
    setTodos(prev => [...prev, text]);
  };

  const removeTodo = (index: number) => {
    setTodos(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div>
      {todos.map((todo, i) => (
        <div key={i}>
          {todo}
          <Button size="sm" onClick={() => removeTodo(i)}>×</Button>
        </div>
      ))}
    </div>
  );
}
```

## How It Works

### Key Namespacing

All keys are automatically prefixed to avoid collisions:

```typescript
// Your code
useLocalStorage('settings', {});

// Actual storage key
'eagle-react-template:settings'
```

### Debounced Writes

Writes are debounced to prevent excessive disk I/O:

```
┌─────────────────────────────────────────────────────┐
│  setValue() called                                  │
│         ↓                                           │
│  State updated immediately (for responsive UI)     │
│         ↓                                           │
│  Debounce timer starts (300ms default)             │
│         ↓                                           │
│  ┌─────────────────┬──────────────────────────┐    │
│  │ Timer expires   │ Another setValue() call  │    │
│  │ → Write to      │ → Timer resets           │    │
│  │   localStorage  │                          │    │
│  └─────────────────┴──────────────────────────┘    │
└─────────────────────────────────────────────────────┘
```

### JSON Serialization

Values are automatically serialized/deserialized:

```typescript
// Storing
localStorage.setItem(key, JSON.stringify(value));

// Reading
const value = JSON.parse(localStorage.getItem(key));
```

### Error Handling

The hook handles common edge cases:

```typescript
// Invalid JSON in storage → returns default
// Storage quota exceeded → logs warning, keeps state in memory
// Validation fails → returns default
```

## Storage Size Considerations

localStorage typically has a 5-10MB limit. For large data:

```tsx
// ❌ Don't store large data
const [images] = useLocalStorage('images', largeArray);

// ✅ Store references instead
const [imageIds] = useLocalStorage('selectedImageIds', []);
```

## Cross-Tab Synchronization

The hook listens for storage events from other tabs:

```tsx
function MultiTabApp() {
  const [count, setCount] = useLocalStorage('count', 0);
  
  // If another tab updates 'count', this tab sees the change
  return <div>Count: {count}</div>;
}
```

## Best Practices

### Do

- ✅ Use descriptive, unique key names
- ✅ Provide sensible default values
- ✅ Use validators for complex data structures
- ✅ Use functional updates for arrays/objects
- ✅ Keep stored data small (< 100KB per key)

### Don't

- ❌ Store sensitive data (localStorage is not secure)
- ❌ Store frequently changing data without debounce
- ❌ Store large blobs or images
- ❌ Use the same key for different data types
- ❌ Forget that storage persists across sessions

## Debugging

View stored values in DevTools:

```javascript
// In browser console
Object.entries(localStorage)
  .filter(([key]) => key.startsWith('eagle-react-template:'))
  .forEach(([key, value]) => {
    console.log(key, JSON.parse(value));
  });
```

Or use the `storageDebug` helper:

```javascript
storageDebug.viewAll();   // View all stored values
storageDebug.clearAll();  // Clear all plugin storage
```

## Related

- [useTheme](./use-theme) - Uses localStorage for theme persistence
- [Hooks Overview](./overview) - All available hooks
