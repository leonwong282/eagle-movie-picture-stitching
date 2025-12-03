---
sidebar_position: 1
title: Hooks Overview
description: Custom React hooks for Eagle plugin development
---

# Hooks Overview

The Eagle React Template provides **4 custom hooks** designed specifically for Eagle plugin development. These hooks handle common patterns like selection tracking, theme management, persistent storage, and internationalization.

## Quick Reference

| Hook | Purpose | Key Feature |
|------|---------|-------------|
| [`useEagleSelection`](./use-eagle-selection) | Track selected items in Eagle | Polling with hash-based change detection |
| [`useTheme`](./use-theme) | Manage light/dark theme | Syncs with Eagle's theme system |
| [`useLocalStorage`](./use-local-storage) | Persist state to localStorage | Debounced writes with validation |
| [`useLanguageSync`](./use-language-sync) | Sync i18n with Eagle locale | Event-driven with fallback polling |

## Import

All hooks are exported from the `@/hooks` barrel:

```tsx
import { 
  useEagleSelection,
  useTheme,
  useLocalStorage,
  useLanguageSync,
} from '@/hooks';
```

## Design Principles

### 1. Dual Environment Compatibility

All hooks work in both browser development and Eagle runtime:

```tsx
// Works in browser (mock data) and Eagle (real data)
const { items } = useEagleSelection();
```

### 2. Performance Optimized

- **Hash-based change detection** - Only updates state when data actually changes
- **Debounced writes** - Prevents excessive localStorage operations
- **Visibility-aware** - Pauses polling when plugin is hidden

### 3. TypeScript First

Full type safety with generics where appropriate:

```tsx
// Type-safe storage
const [settings, setSettings] = useLocalStorage<Settings>('settings', defaultSettings);
```

## When to Use Each Hook

### useEagleSelection

Use when you need to:
- Display currently selected items from Eagle
- React to selection changes in real-time
- Access item metadata (name, path, dimensions, tags)

```tsx
function Gallery() {
  const { items, isLoading } = useEagleSelection();
  return <ImageGrid items={items} />;
}
```

### useTheme

Use when you need to:
- Toggle between light and dark themes
- Sync with Eagle's built-in theme system
- Persist theme preference across sessions

```tsx
function ThemeToggle() {
  const { isDarkMode, toggleTheme } = useTheme();
  return <Button onClick={toggleTheme}>{isDarkMode ? '☀️' : '🌙'}</Button>;
}
```

### useLocalStorage

Use when you need to:
- Persist user preferences
- Cache expensive computations
- Store form state between sessions

```tsx
function Settings() {
  const [prefs, setPrefs] = useLocalStorage('prefs', { quality: 80 });
  return <Slider value={prefs.quality} onChange={(v) => setPrefs({ ...prefs, quality: v })} />;
}
```

### useLanguageSync

Use when you need to:
- Keep i18n in sync with Eagle's locale
- React to language changes without refresh
- Support Eagle's 8 built-in languages

```tsx
function App() {
  useLanguageSync(); // Auto-syncs i18next with Eagle
  return <TranslatedContent />;
}
```

## Hooks vs Zustand Store

For simple use cases, hooks are sufficient. For complex state sharing across many components, consider using the Zustand store:

| Scenario | Recommendation |
|----------|----------------|
| Single component needs selection | `useEagleSelection` |
| Many components share selection state | Zustand `useSelection()` |
| Simple theme toggle | `useTheme` |
| Theme in deeply nested components | Zustand `useSettings()` |

## Common Patterns

### Combining Multiple Hooks

```tsx
function SmartGallery() {
  const { items, isLoading } = useEagleSelection();
  const { isDarkMode } = useTheme();
  const [viewMode, setViewMode] = useLocalStorage('viewMode', 'grid');

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <ViewToggle mode={viewMode} onChange={setViewMode} />
      {isLoading ? <Spinner /> : <ImageGrid items={items} mode={viewMode} />}
    </div>
  );
}
```

### Error Handling

```tsx
function SafeGallery() {
  const { items, error, refresh } = useEagleSelection();

  if (error) {
    return (
      <ErrorFallback 
        error={error} 
        resetErrorBoundary={refresh} 
      />
    );
  }

  return <ImageGrid items={items} />;
}
```

## Related

- [Core Concepts: Dual Environment](../core-concepts/dual-environment) - Understanding browser vs Eagle runtime
- [Core Concepts: Eagle API Adapter](../core-concepts/eagle-api-adapter) - How hooks access Eagle
