---
sidebar_position: 3
title: useTheme
description: Theme management hook with Eagle integration
---

# useTheme

A hook for managing theme state with Eagle integration, supporting light/dark/auto modes and syncing with Eagle's built-in theme system.

## Import

```tsx
import { useTheme } from '@/hooks';
```

## Basic Usage

```tsx
function ThemeToggle() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <Button onClick={toggleTheme} variant="ghost" size="icon">
      {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}
```

## Signature

```tsx
const result = useTheme();
```

This hook takes no parameters.

## Return Value

| Property | Type | Description |
|----------|------|-------------|
| `theme` | `'light' \| 'dark' \| 'auto'` | Current theme preference |
| `isDarkMode` | `boolean` | Computed dark mode state |
| `setTheme` | `(theme: Theme) => void` | Set theme preference |
| `toggleTheme` | `() => void` | Toggle between light and dark |

## Examples

### Simple Toggle

```tsx
function ThemeButton() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <Button onClick={toggleTheme}>
      {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
    </Button>
  );
}
```

### Theme Selector

```tsx
function ThemeSelector() {
  const { theme, setTheme } = useTheme();

  return (
    <Select value={theme} onValueChange={setTheme}>
      <SelectTrigger className="w-32">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="light">
          <Sun className="mr-2 h-4 w-4 inline" />
          Light
        </SelectItem>
        <SelectItem value="dark">
          <Moon className="mr-2 h-4 w-4 inline" />
          Dark
        </SelectItem>
        <SelectItem value="auto">
          <Monitor className="mr-2 h-4 w-4 inline" />
          System
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
```

### Conditional Styling

```tsx
function ThemedCard() {
  const { isDarkMode } = useTheme();

  return (
    <Card className={isDarkMode ? 'border-gray-700' : 'border-gray-200'}>
      <CardContent>
        <p>This card adapts to the theme</p>
      </CardContent>
    </Card>
  );
}
```

### With localStorage Persistence

The theme is automatically persisted to localStorage:

```tsx
function App() {
  const { theme } = useTheme();
  
  // theme persists across page reloads
  // Stored as: localStorage.getItem('eagle-react-template:theme')
  
  return <div>Current: {theme}</div>;
}
```

## Theme Resolution

The `isDarkMode` value is computed based on multiple sources:

```
┌─────────────────────────────────────────────────────┐
│  Theme Preference: 'auto'                           │
│         ↓                                           │
│  ┌─────────────────────────────────────────────┐   │
│  │  In Eagle?                                  │   │
│  │  ├─ Yes → Check Eagle theme                 │   │
│  │  │        (DARK, GRAY, BLUE, PURPLE = dark) │   │
│  │  │        (LIGHT = light)                   │   │
│  │  └─ No  → Check system preference           │   │
│  │           (prefers-color-scheme: dark)      │   │
│  └─────────────────────────────────────────────┘   │
│         ↓                                           │
│  isDarkMode: true/false                             │
└─────────────────────────────────────────────────────┘
```

### Eagle Theme Mapping

| Eagle Theme | isDarkMode |
|-------------|------------|
| `LIGHT` | `false` |
| `DARK` | `true` |
| `GRAY` | `true` |
| `BLUE` | `true` |
| `PURPLE` | `true` |

## How It Works

### DOM Class Management

The hook automatically applies the `dark` class to the document root:

```tsx
// When isDarkMode is true
document.documentElement.classList.add('dark');

// When isDarkMode is false
document.documentElement.classList.remove('dark');
```

This works with Tailwind's dark mode:

```tsx
<div className="bg-white dark:bg-gray-900">
  Content adapts to theme
</div>
```

### Event Listeners

The hook listens to multiple sources for theme changes:

```typescript
// System preference changes
window.matchMedia('(prefers-color-scheme: dark)')
  .addEventListener('change', handleChange);

// Eagle theme changes (when running in Eagle)
window.addEventListener('eagle-theme-change', handleEagleTheme);
```

### Persistence

Theme preference is stored in localStorage with a namespaced key:

```typescript
const STORAGE_KEY = 'eagle-react-template:theme';

// On change
localStorage.setItem(STORAGE_KEY, theme);

// On mount
const stored = localStorage.getItem(STORAGE_KEY);
```

## Integration with Header

The template's Header component includes a built-in theme toggle:

```tsx
import { Header } from '@/components';

function App() {
  return (
    <div className="h-screen flex flex-col">
      <Header 
        title="My Plugin"
        showThemeToggle  // Includes theme toggle button
      />
      <main className="flex-1">
        {/* Content */}
      </main>
    </div>
  );
}
```

## Best Practices

### Do

- ✅ Use `isDarkMode` for conditional styling
- ✅ Use `toggleTheme` for simple toggle buttons
- ✅ Use `setTheme` for full theme selectors
- ✅ Let Tailwind's `dark:` variants handle most styling
- ✅ Test both themes during development

### Don't

- ❌ Manually manage the `dark` class on `<html>`
- ❌ Store theme preference in a different key
- ❌ Ignore Eagle's theme when running in Eagle
- ❌ Use inline styles for theme-dependent colors

## Using with Zustand

For complex applications, the theme state is also available via Zustand:

```tsx
import { useSettings } from '@/stores';

function Component() {
  const { theme, toggleTheme } = useSettings();
  // Same API as useTheme hook
}
```

## CSS Variables

The template uses CSS variables that respond to the theme:

```css
/* globals.css */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  /* ... */
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... */
}
```

Use these in your components:

```tsx
<div className="bg-background text-foreground">
  Automatically themed
</div>
```

## Related

- [useLocalStorage](./use-local-storage) - How theme is persisted
- [Theme & i18n](../core-concepts/theme-i18n) - Full theming guide
