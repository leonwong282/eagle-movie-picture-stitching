---
sidebar_position: 3
title: Dark Mode
description: Theme switching implementation
---

# Dark Mode

The template supports light, dark, and system-preference themes using Tailwind's class-based dark mode strategy.

## Overview

| Feature | Implementation |
|---------|----------------|
| Strategy | Class-based (`.dark` on `<html>`) |
| Modes | Light, Dark, Auto (system) |
| Persistence | localStorage |
| Eagle Integration | Syncs with Eagle's theme |

## How It Works

```
┌─────────────────────────────────────────────────────────────────┐
│                     Theme Detection Flow                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. Check localStorage for user preference                     │
│           ↓                                                     │
│  2. If 'auto', check Eagle theme via eagleApi.isDarkMode       │
│           ↓                                                     │
│  3. Fallback to system preference (prefers-color-scheme)       │
│           ↓                                                     │
│  4. Apply .dark class to <html> element                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Configuration

### Tailwind Setup

```js
// tailwind.config.js
module.exports = {
  darkMode: 'class',  // Use .dark class strategy
  // ...
};
```

### CSS Variables

```css
/* src/styles/globals.css */

/* Light mode (default) */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  /* ... */
}

/* Dark mode */
.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... */
}
```

## useTheme Hook

The `useTheme` hook provides theme state and controls:

```tsx
import { useTheme } from '@/hooks';

function ThemeToggle() {
  const { theme, setTheme, isDarkMode, toggleTheme } = useTheme();
  
  return (
    <div>
      <p>Current theme: {theme}</p>
      <p>Is dark: {isDarkMode ? 'Yes' : 'No'}</p>
      
      <button onClick={toggleTheme}>
        Toggle Theme
      </button>
      
      {/* Or explicit controls */}
      <button onClick={() => setTheme('light')}>Light</button>
      <button onClick={() => setTheme('dark')}>Dark</button>
      <button onClick={() => setTheme('auto')}>Auto</button>
    </div>
  );
}
```

### Hook API

```tsx
interface UseThemeReturn {
  theme: 'light' | 'dark' | 'auto';  // Current setting
  setTheme: (theme: Theme) => void;   // Change theme
  isDarkMode: boolean;                 // Computed dark mode state
  toggleTheme: () => void;             // Cycle through themes
}
```

## Implementation

### Theme Provider

```tsx
// src/lib/theme.ts
const STORAGE_KEY = 'eagle-react-template:theme';

export type Theme = 'light' | 'dark' | 'auto';

export function getStoredTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark' || stored === 'auto') {
    return stored;
  }
  return 'auto';
}

export function setStoredTheme(theme: Theme): void {
  localStorage.setItem(STORAGE_KEY, theme);
}

export function getSystemTheme(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

export function getEagleTheme(): 'light' | 'dark' {
  // eagleApi.isDarkMode checks Eagle's theme setting
  return eagleApi.isDarkMode ? 'dark' : 'light';
}

export function resolveTheme(theme: Theme): 'light' | 'dark' {
  if (theme === 'auto') {
    // In Eagle, prefer Eagle's theme
    if (isEagleEnvironment()) {
      return getEagleTheme();
    }
    // In browser, use system preference
    return getSystemTheme();
  }
  return theme;
}

export function applyTheme(theme: Theme): void {
  const resolved = resolveTheme(theme);
  
  if (resolved === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}
```

### useTheme Hook Implementation

```tsx
// src/hooks/use-theme.ts
import { useState, useEffect, useCallback } from 'react';
import { 
  Theme, 
  getStoredTheme, 
  setStoredTheme, 
  applyTheme,
  resolveTheme 
} from '@/lib/theme';

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(getStoredTheme);

  // Apply theme on mount and changes
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // Listen for system preference changes
  useEffect(() => {
    if (theme !== 'auto') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => applyTheme('auto');
    
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [theme]);

  const setTheme = useCallback((newTheme: Theme) => {
    setStoredTheme(newTheme);
    setThemeState(newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    const themes: Theme[] = ['light', 'dark', 'auto'];
    const currentIndex = themes.indexOf(theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    setTheme(nextTheme);
  }, [theme, setTheme]);

  const isDarkMode = resolveTheme(theme) === 'dark';

  return {
    theme,
    setTheme,
    isDarkMode,
    toggleTheme,
  };
}
```

## Using Dark Mode Styles

### With Tailwind Classes

```tsx
// Text colors
<p className="text-gray-900 dark:text-gray-100">
<p className="text-foreground">  {/* Semantic - preferred */}

// Background colors
<div className="bg-white dark:bg-gray-900">
<div className="bg-background">  {/* Semantic - preferred */}

// Borders
<div className="border-gray-200 dark:border-gray-700">
<div className="border-border">  {/* Semantic - preferred */}

// Shadows (often reduced in dark mode)
<div className="shadow-lg dark:shadow-none">
<div className="shadow-lg dark:shadow-2xl dark:shadow-black/25">
```

### Conditional Rendering

```tsx
function Icon() {
  const { isDarkMode } = useTheme();
  
  return isDarkMode ? <MoonIcon /> : <SunIcon />;
}
```

### CSS-Only Dark Mode

```tsx
// Using CSS variables - no JS needed
<div className="bg-background text-foreground">
  Content adapts automatically
</div>
```

## Theme Selector Component

```tsx
import { useTheme } from '@/hooks';
import { Button } from '@/components/ui';
import { Sun, Moon, Monitor } from 'lucide-react';

const themes = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'auto', label: 'System', icon: Monitor },
] as const;

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  
  return (
    <div className="flex gap-1 p-1 bg-muted rounded-lg">
      {themes.map(({ value, label, icon: Icon }) => (
        <Button
          key={value}
          variant={theme === value ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setTheme(value)}
          aria-label={label}
        >
          <Icon className="h-4 w-4" />
        </Button>
      ))}
    </div>
  );
}
```

## Eagle Theme Sync

Sync with Eagle's theme setting:

```tsx
// Detect Eagle theme changes
useEffect(() => {
  if (!isEagleEnvironment()) return;
  
  // Eagle may change theme while plugin is open
  const interval = setInterval(() => {
    if (theme === 'auto') {
      applyTheme('auto');  // Re-evaluate Eagle theme
    }
  }, 1000);
  
  return () => clearInterval(interval);
}, [theme]);
```

### Eagle Theme Values

```tsx
// eagleApi.app.theme returns one of:
type EagleTheme = 'LIGHT' | 'LIGHTGRAY' | 'GRAY' | 'DARK' | 'BLUE' | 'PURPLE';

// Dark themes: GRAY, DARK, BLUE, PURPLE
// Light themes: LIGHT, LIGHTGRAY

// isDarkMode is computed as:
const isDarkMode = ['GRAY', 'DARK', 'BLUE', 'PURPLE'].includes(eagleTheme);
```

## Flash Prevention

Prevent theme flash on page load:

```html
<!-- index.html - Add script before body -->
<script>
  (function() {
    const stored = localStorage.getItem('eagle-react-template:theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    let isDark = false;
    if (stored === 'dark') isDark = true;
    else if (stored === 'light') isDark = false;
    else isDark = prefersDark;  // 'auto' or not set
    
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
  })();
</script>
```

## Testing Dark Mode

```tsx
// Vitest/Jest test
describe('Dark mode', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });
  
  test('applies dark class when theme is dark', () => {
    const { result } = renderHook(() => useTheme());
    
    act(() => {
      result.current.setTheme('dark');
    });
    
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });
  
  test('removes dark class when theme is light', () => {
    document.documentElement.classList.add('dark');
    
    const { result } = renderHook(() => useTheme());
    
    act(() => {
      result.current.setTheme('light');
    });
    
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });
});
```

## Best Practices

### ✅ Do

```tsx
// Use semantic colors
<div className="bg-background text-foreground">

// Use CSS variables for automatic switching
<div className="bg-card border-border">

// Provide all three theme options
<ThemeSelector options={['light', 'dark', 'auto']} />

// Test both themes
test.each(['light', 'dark'])('renders in %s mode', (mode) => {
  // ...
});
```

### ❌ Don't

```tsx
// Avoid hardcoded colors
<div className="bg-white text-black">  {/* Won't adapt to dark mode */}

// Avoid checking theme for every element
{isDarkMode ? (
  <div className="bg-gray-900">...</div>
) : (
  <div className="bg-white">...</div>
)}
// Use: <div className="bg-background"> instead

// Don't forget focus/ring states in dark mode
<button className="focus:ring-2">
// Add: focus:ring-ring for proper color
```

## Related

- [Styling Overview](./overview) - Architecture overview
- [Design Tokens](./design-tokens) - Color system
- [useTheme Hook](../hooks/use-theme) - Hook API reference
