---
sidebar_position: 3
title: Header
description: Plugin header with Eagle drag region support and built-in actions
---

# Header

A specialized header component for Eagle plugins with window drag region support, theme toggle, and customizable actions.

## Import

```tsx
import { Header } from '@/components';
```

## Basic Usage

```tsx
<Header title="My Plugin" />
```

## Features

### Drag Region

The Header automatically enables window dragging on macOS and Windows:

```tsx
// The entire header is draggable
<Header title="My Plugin" />

// Action buttons have no-drag zones automatically
<Header 
  title="My Plugin"
  showThemeToggle
  showSettings
/>
```

:::info Eagle-Specific
The drag region uses `-webkit-app-region: drag` CSS property, which only works in Eagle's Chromium environment. In browser development mode, the header appears normal but dragging won't move the window.
:::

### DEV Badge

When running in browser development mode (`eagleApi.isMock === true`), a "DEV" badge automatically appears:

```tsx
// Shows "DEV" badge automatically in browser dev mode
<Header title="My Plugin" />
```

### Theme Toggle

Enable the built-in light/dark mode toggle:

```tsx
<Header 
  title="My Plugin"
  showThemeToggle
/>
```

### Settings Button

Add a settings button with custom handler:

```tsx
<Header 
  title="My Plugin"
  showSettings
  onSettingsClick={() => setSettingsOpen(true)}
/>
```

### Close Button

The close button is shown by default. Customize or hide it:

```tsx
// Default: closes Eagle plugin window
<Header title="My Plugin" />

// Custom close handler
<Header 
  title="My Plugin"
  onCloseClick={() => confirmBeforeClose()}
/>

// Hide close button
<Header 
  title="My Plugin"
  showClose={false}
/>
```

### Custom Actions

Add any custom actions to the right side:

```tsx
<Header 
  title="My Plugin"
  actions={
    <>
      <Button variant="ghost" size="icon">
        <RefreshCw className="w-5 h-5" />
      </Button>
      <Button variant="ghost" size="icon">
        <HelpCircle className="w-5 h-5" />
      </Button>
    </>
  }
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | i18n `app.title` | Plugin title displayed in header |
| `showThemeToggle` | `boolean` | `false` | Show sun/moon theme toggle button |
| `showSettings` | `boolean` | `false` | Show settings gear button |
| `onSettingsClick` | `() => void` | — | Handler for settings button click |
| `showClose` | `boolean` | `true` | Show close (X) button |
| `onCloseClick` | `() => void` | Hide window | Handler for close button click |
| `actions` | `ReactNode` | — | Custom action buttons |
| `className` | `string` | — | Additional CSS classes |

Plus all standard `<header>` HTML attributes.

## Examples

### Minimal Header

```tsx
<Header />
// Uses i18n app.title, shows only close button
```

### Full-Featured Header

```tsx
<Header
  title="Image Processor"
  showThemeToggle
  showSettings
  onSettingsClick={() => setShowSettings(true)}
  actions={
    <Button variant="ghost" size="icon" onClick={refresh}>
      <RefreshCw className="w-5 h-5" />
    </Button>
  }
/>
```

### Custom Styled Header

```tsx
<Header 
  title="My Plugin"
  className="border-b-2 border-primary"
/>
```

### With Dialog for Settings

```tsx
function App() {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <>
      <Header
        title="My Plugin"
        showSettings
        onSettingsClick={() => setSettingsOpen(true)}
      />
      
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
          </DialogHeader>
          {/* Settings form */}
        </DialogContent>
      </Dialog>
    </>
  );
}
```

## Layout

The header is designed to be sticky at the top:

```tsx
<div className="h-screen flex flex-col">
  <Header title="My Plugin" />
  <main className="flex-1 overflow-auto">
    {/* Scrollable content */}
  </main>
</div>
```

## Styling

The header uses these styles:

- **Background**: `bg-background/80` with `backdrop-blur-xl`
- **Border**: `border-b border-border`
- **Position**: `sticky top-0 z-10`
- **Drag**: `drag-region` class for Eagle window dragging

### Customizing

```tsx
// More prominent header
<Header 
  title="My Plugin"
  className="bg-primary text-primary-foreground"
/>

// Transparent header
<Header 
  title="My Plugin"
  className="bg-transparent border-none"
/>
```

## Accessibility

- **Semantic**: Uses `<header>` element
- **Keyboard**: All buttons are focusable and activatable
- **Labels**: Buttons have `title` attributes for tooltips

## Internationalization

The header uses i18n for:
- Default title: `t('app.title')`
- Theme toggle tooltip: `t('app.lightMode')` / `t('app.darkMode')`
- Settings tooltip: `t('app.settings')`
- Close tooltip: `t('app.close')`

Ensure these keys exist in your `_locales/*.json` files.
