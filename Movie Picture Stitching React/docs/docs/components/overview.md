---
sidebar_position: 1
title: Components Overview
description: Overview of the Eagle React Template UI component library
---

# Components Overview

The Eagle React Template includes **18 production-ready UI components** designed specifically for Eagle plugin development. All components support dark mode, are fully accessible, and integrate seamlessly with Eagle's theme system.

## Architecture

### Built on shadcn/ui + Radix UI

Our component library follows the [shadcn/ui](https://ui.shadcn.com/) pattern:

- **Radix UI Primitives** — Accessible, unstyled components as the foundation
- **Tailwind CSS** — Utility-first styling with design tokens
- **Class Variance Authority (CVA)** — Type-safe component variants
- **Full Ownership** — Components live in your codebase, not `node_modules`

```tsx
// Components use CVA for type-safe variants
const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground',
        destructive: 'bg-destructive text-white',
        outline: 'border border-input bg-background',
        // ... more variants
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 px-3',
        lg: 'h-10 px-6',
      },
    },
  }
);
```

### Importing Components

All components are exported from a single entry point:

```tsx
import {
  Button,
  Card,
  CardHeader,
  CardContent,
  Dialog,
  DialogTrigger,
  DialogContent,
  useToast,
  toast,
} from '@/components';
```

## Component Categories

### 🎨 UI Components

Core visual components for building interfaces.

| Component | Description | Radix UI |
|-----------|-------------|----------|
| [Button](./ui/button) | 8 variants, loading states, icon buttons | `@radix-ui/react-slot` |
| [Card](./ui/card) | Glass-morphic cards with semantic sections | — |
| [Header](./ui/header) | Eagle drag region, theme toggle, actions | — |
| [Toast](./ui/toast) | Non-blocking notifications (4 types) | — |

### 📝 Form Components

Accessible form controls with validation styling.

| Component | Description | Radix UI |
|-----------|-------------|----------|
| [Input](./form/input) | Text input with focus states | — |
| [Label](./form/label) | Form labels with peer styling | `@radix-ui/react-label` |
| [Select](./form/select) | Dropdown select with search | `@radix-ui/react-select` |
| [Checkbox](./form/checkbox) | Checkbox with optional label | `@radix-ui/react-checkbox` |
| [Slider](./form/slider) | Range slider with value display | `@radix-ui/react-slider` |

### 🪟 Overlay Components

Modals, menus, and floating elements.

| Component | Description | Radix UI |
|-----------|-------------|----------|
| [Dialog](./overlay/dialog) | Modal dialogs with focus trap | `@radix-ui/react-dialog` |
| [DropdownMenu](./overlay/dropdown-menu) | Context menus, submenus | `@radix-ui/react-dropdown-menu` |
| [Tooltip](./overlay/tooltip) | Hover tooltips with delay | `@radix-ui/react-tooltip` |
| [Popover](./overlay/popover) | Click-triggered popovers | `@radix-ui/react-popover` |

### 📐 Layout Components

Structure and organization components.

| Component | Description | Radix UI |
|-----------|-------------|----------|
| [Tabs](./layout/tabs) | Tab navigation with keyboard support | `@radix-ui/react-tabs` |
| [ImageGrid](./layout/image-grid) | Responsive image grid (2-6 columns) | — |
| [EagleImage](./layout/eagle-image) | Optimized Eagle image display | — |

### ⚠️ Error Handling

Graceful error recovery components.

| Component | Description | Radix UI |
|-----------|-------------|----------|
| [ErrorBoundary](./error/error-boundary) | Catch and handle React errors | — |
| [ErrorFallback](./error/error-fallback) | Styled error display UI | — |

## Design Principles

### 1. Eagle-First Design

Components are designed with Eagle plugin constraints in mind:

- **Drag Region Support** — Header component handles window dragging
- **Theme Sync** — Automatic dark/light mode with Eagle's settings
- **DEV Badge** — Visual indicator when running in browser mock mode

### 2. Accessibility

All components meet WCAG 2.1 AA standards:

- **Keyboard Navigation** — Full keyboard support for all interactive elements
- **ARIA Attributes** — Proper roles, labels, and states
- **Focus Management** — Logical focus order and visible focus indicators
- **Screen Readers** — Meaningful announcements and live regions

### 3. Composition Pattern

Use the `asChild` prop (via Radix Slot) to compose components:

```tsx
// Button renders as a link
<Button asChild>
  <a href="/docs">Read Documentation</a>
</Button>

// DialogTrigger uses custom button
<DialogTrigger asChild>
  <Button variant="outline">Open Dialog</Button>
</DialogTrigger>
```

## Quick Start

```tsx
import { Button, Card, CardContent, useToast, toast } from '@/components';

function MyPlugin() {
  const { addToast } = useToast();

  const handleSave = () => {
    // Do something...
    addToast(toast.success('Saved!', 'Your changes have been saved.'));
  };

  return (
    <Card>
      <CardContent className="p-6">
        <Button onClick={handleSave}>
          Save Changes
        </Button>
      </CardContent>
    </Card>
  );
}
```

## Next Steps

- **[Button](./ui/button)** — Start with the most common component
- **[Card](./ui/card)** — Learn the compound component pattern
- **[Toast](./ui/toast)** — Add user feedback to your plugin
