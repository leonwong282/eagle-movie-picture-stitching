---
sidebar_position: 1
title: Overview
description: Tailwind CSS styling architecture
---

# Styling Overview

The template uses **Tailwind CSS** for styling, combined with **CSS variables** for theming and **class-variance-authority (CVA)** for component variants.

## Stack

| Tool | Purpose |
|------|---------|
| **Tailwind CSS 3** | Utility-first styling |
| **CSS Variables** | Design tokens & theming |
| **CVA** | Type-safe component variants |
| **clsx/cn** | Conditional class merging |
| **PostCSS** | CSS processing |

## Philosophy

### Utility-First

Use Tailwind utilities directly in components:

```tsx
// ✅ Tailwind utilities
<div className="flex items-center gap-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
  <span className="text-sm font-medium">Label</span>
</div>

// ❌ Custom CSS classes
<div className="card-container">
  <span className="card-label">Label</span>
</div>
```

### Component Variants with CVA

Use CVA for reusable component styles:

```tsx
import { cva } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);
```

### Design Tokens via CSS Variables

Theme values defined as CSS variables:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --primary: 217.2 91.2% 59.8%;
}
```

## File Structure

```
src/
├── styles/
│   └── globals.css         # CSS variables, base styles, utilities
├── lib/
│   └── utils.ts            # cn() helper for class merging
├── components/
│   └── ui/
│       └── Button.tsx      # CVA-based component
├── tailwind.config.js      # Tailwind configuration
└── postcss.config.js       # PostCSS plugins
```

## Quick Reference

### Class Merging with cn()

```tsx
import { cn } from '@/lib/utils';

// Merge classes with overrides
<div className={cn(
  'base-classes',
  isActive && 'active-classes',
  className
)} />
```

### Common Patterns

```tsx
// Flex layouts
<div className="flex items-center justify-between gap-4">

// Grid layouts
<div className="grid grid-cols-3 gap-4">

// Responsive
<div className="p-2 md:p-4 lg:p-6">

// Dark mode
<div className="bg-white dark:bg-gray-900">

// Hover/focus states
<button className="hover:bg-gray-100 focus:ring-2">

// Transitions
<div className="transition-colors duration-200">
```

### Color Usage

```tsx
// Semantic colors (recommended)
<div className="bg-background text-foreground">
<button className="bg-primary text-primary-foreground">
<span className="text-muted-foreground">

// Direct colors (when needed)
<div className="bg-emerald-500 text-white">
```

## Configuration Files

### tailwind.config.js

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        // ... more semantic colors
      },
      // ... more extensions
    },
  },
  plugins: [require('tailwindcss-animate')],
};
```

### postcss.config.js

```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

## Key Concepts

| Concept | Documentation |
|---------|---------------|
| Design tokens | [Design Tokens →](./design-tokens) |
| Dark mode | [Dark Mode →](./dark-mode) |
| Animations | [Animations →](./animations) |

## Best Practices

### ✅ Do

```tsx
// Use semantic color names
className="bg-primary text-primary-foreground"

// Use spacing scale
className="p-4 gap-2 mt-6"

// Responsive mobile-first
className="text-sm md:text-base lg:text-lg"

// Group related utilities
className={cn(
  // Layout
  'flex items-center gap-4',
  // Appearance
  'bg-white dark:bg-gray-800 rounded-lg',
  // Spacing
  'p-4',
)}
```

### ❌ Don't

```tsx
// Avoid arbitrary values when scale exists
className="p-[17px]"  // Use p-4 instead

// Avoid inline styles
style={{ marginTop: 16 }}  // Use mt-4

// Avoid !important overrides
className="!bg-red-500"

// Avoid deeply nested custom CSS
.card .header .title { }
```

## Related

- [Design Tokens](./design-tokens) - Color and spacing system
- [Dark Mode](./dark-mode) - Theme switching implementation
- [Animations](./animations) - Motion and transitions
