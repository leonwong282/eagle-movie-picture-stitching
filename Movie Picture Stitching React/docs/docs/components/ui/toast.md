---
sidebar_position: 4
title: Toast
description: Non-blocking notification system with 4 types and auto-dismiss
---

# Toast

A non-blocking notification system for displaying feedback messages. Supports 4 types (success, error, warning, info) with auto-dismiss and manual close.

## Import

```tsx
import { ToastProvider, useToast, toast } from '@/components';
import type { Toast, ToastType } from '@/components';
```

## Setup

Wrap your app with `ToastProvider`:

```tsx
// App.tsx or main.tsx
import { ToastProvider } from '@/components';

function App() {
  return (
    <ToastProvider>
      <YourApp />
    </ToastProvider>
  );
}
```

## Basic Usage

```tsx
import { useToast, toast } from '@/components';

function MyComponent() {
  const { addToast } = useToast();

  const handleSuccess = () => {
    addToast(toast.success('Saved!', 'Your changes have been saved.'));
  };

  return <Button onClick={handleSuccess}>Save</Button>;
}
```

## Toast Types

### Success

Green toast with checkmark icon. Auto-dismisses after 4 seconds.

```tsx
addToast(toast.success('Success!', 'Operation completed.'));
```

### Error

Red toast with alert icon. Does **not** auto-dismiss by default (stays until manually closed).

```tsx
addToast(toast.error('Error', 'Something went wrong.'));

// With auto-dismiss (5 seconds)
addToast(toast.error('Error', 'Something went wrong.', 5000));
```

### Warning

Yellow/amber toast with warning icon.

```tsx
addToast(toast.warning('Warning', 'Please check your input.'));
```

### Info

Blue toast with info icon.

```tsx
addToast(toast.info('Info', 'Here is some information.'));
```

## API

### useToast Hook

```tsx
const { toasts, addToast, removeToast } = useToast();
```

| Return | Type | Description |
|--------|------|-------------|
| `toasts` | `Toast[]` | Array of current toast objects |
| `addToast` | `(toast: Omit<Toast, 'id'>) => void` | Add a new toast |
| `removeToast` | `(id: string) => void` | Remove a toast by ID |

### toast Helpers

Convenience functions for creating toast objects:

```tsx
toast.success(title: string, description?: string, duration?: number)
toast.error(title: string, description?: string, duration?: number)
toast.warning(title: string, description?: string, duration?: number)
toast.info(title: string, description?: string, duration?: number)
```

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `title` | `string` | — | Toast title (required) |
| `description` | `string` | — | Optional description text |
| `duration` | `number` | 4000 (0 for error) | Auto-dismiss time in ms. 0 = no auto-dismiss |

### Toast Object

```tsx
interface Toast {
  id: string;          // Auto-generated unique ID
  type: ToastType;     // 'success' | 'error' | 'warning' | 'info'
  title: string;       // Main message
  description?: string; // Optional detail text
  duration?: number;   // Auto-dismiss duration (ms)
}
```

## Examples

### Form Submission

```tsx
const handleSubmit = async (data) => {
  try {
    await saveData(data);
    addToast(toast.success('Saved!', 'Your settings have been updated.'));
  } catch (error) {
    addToast(toast.error('Save Failed', error.message));
  }
};
```

### With Loading State

```tsx
const handleExport = async () => {
  const processingToast = toast.info('Exporting...', 'Please wait.');
  addToast(processingToast);
  
  try {
    await exportImages();
    removeToast(processingToast.id); // Remove "Exporting..." toast
    addToast(toast.success('Export Complete', '10 images exported.'));
  } catch (error) {
    removeToast(processingToast.id);
    addToast(toast.error('Export Failed', error.message));
  }
};
```

### Confirmation with Action

```tsx
// Note: Current implementation doesn't support action buttons in toasts.
// For confirmations, use Dialog component instead.

// Simple notification
addToast(toast.warning(
  'Unsaved Changes', 
  'You have unsaved changes that will be lost.'
));
```

### Custom Duration

```tsx
// Quick notification (2 seconds)
addToast(toast.info('Copied!', undefined, 2000));

// Longer notification (10 seconds)
addToast(toast.warning('Review Required', 'Please review before proceeding.', 10000));

// Permanent (until closed)
addToast(toast.error('Critical Error', 'Please contact support.', 0));
```

## Positioning

Toasts appear in the **bottom-right** corner of the screen and stack vertically:

```tsx
// Toast container styles (built-in)
<div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
  {/* Toasts render here */}
</div>
```

## Styling

Each toast type has distinct colors:

| Type | Light Mode | Dark Mode |
|------|------------|-----------|
| `success` | Green bg | Dark green bg |
| `error` | Red bg | Dark red bg |
| `warning` | Amber bg | Dark amber bg |
| `info` | Sky blue bg | Dark sky bg |

Toasts include:
- Type-specific icon (CheckCircle, AlertCircle, AlertTriangle, Info)
- Close button (X)
- Slide-up animation on entry

## Accessibility

- **ARIA**: Container has `aria-live="polite"` for screen reader announcements
- **Role**: Each toast has `role="alert"`
- **Keyboard**: Close button is focusable and keyboard-accessible
- **Motion**: Uses subtle slide animation (respects `prefers-reduced-motion`)

## Best Practices

### Do

```tsx
// ✅ Provide actionable information
addToast(toast.error('Save Failed', 'Check your network connection and try again.'));

// ✅ Keep messages concise
addToast(toast.success('Saved!'));

// ✅ Use appropriate types
addToast(toast.warning('Low disk space'));  // Warning, not error
```

### Don't

```tsx
// ❌ Don't use toasts for critical confirmations
// Use Dialog instead for destructive actions

// ❌ Don't show too many toasts at once
// They stack and can overwhelm the user

// ❌ Don't use toasts for form validation
// Show inline errors instead
```

## TypeScript

```tsx
import type { Toast, ToastType } from '@/components';

// Type-safe toast creation
const myToast: Omit<Toast, 'id'> = {
  type: 'success',
  title: 'Done!',
  description: 'All tasks completed.',
  duration: 3000,
};

addToast(myToast);
```
