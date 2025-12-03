# Eagle React Template - Design System

A comprehensive design specification for the shadcn/ui-based component library. This document serves as the single source of truth for all component development in Eagle plugins.

---

## Table of Contents

- [Design Philosophy](#design-philosophy)
- [Color System](#color-system)
- [Typography](#typography)
- [Spacing & Layout](#spacing--layout)
- [Component Variants](#component-variants)
- [Animation System](#animation-system)
- [Eagle-Specific Patterns](#eagle-specific-patterns)
- [Accessibility](#accessibility)
- [File Structure](#file-structure)

---

## Design Philosophy

### Core Principles

1. **Consistency First** — All components follow shadcn/ui conventions for API design, variant naming, and styling patterns.

2. **Eagle Integration** — Seamless integration with Eagle's theme system (dark/light mode), frameless window controls, and desktop environment.

3. **Accessibility by Default** — Built on Radix UI primitives with full keyboard navigation, focus management, and ARIA compliance.

4. **Developer Experience** — CVA-based variants, TypeScript support, and predictable APIs that match shadcn/ui documentation.

5. **Performance** — Minimal bundle size, tree-shakeable components, single-bundle compatible for Eagle plugin environment.

### Design Language

| Aspect | Specification |
|--------|---------------|
| **Style** | Modern, minimal, glass-morphic accents |
| **Corners** | Rounded (`--radius: 0.5rem`) |
| **Shadows** | Subtle, layered for depth |
| **Colors** | HSL format for shadcn/ui compatibility |
| **Motion** | Quick, purposeful transitions (200-300ms) |

---

## Color System

### HSL Color Format

All colors use HSL (Hue Saturation Lightness) for shadcn/ui compatibility:

```
hsl(H S% L%)
    │ │  └── Lightness (0-100%)
    │ └───── Saturation (0-100%)  
    └─────── Hue (0-360 degrees)
```

**CSS Variable Format:** Variables store only the HSL values (e.g., `221.2 83.2% 53.3%`), then Tailwind wraps them with `hsl()` in the config.

**Browser Support:** All modern browsers (HSL is universally supported)

---

### Base Tokens

#### Light Mode

| Token | HSL Value | Hex Equivalent | Usage |
|-------|-----------|----------------|-------|
| `--background` | `0 0% 100%` | `#ffffff` | App background |
| `--foreground` | `240 10% 3.9%` | `#0a0a0b` | Default text |
| `--card` | `0 0% 100%` | `#ffffff` | Card backgrounds |
| `--card-foreground` | `240 10% 3.9%` | `#0a0a0b` | Card text |
| `--popover` | `0 0% 100%` | `#ffffff` | Popover/dropdown backgrounds |
| `--popover-foreground` | `240 10% 3.9%` | `#0a0a0b` | Popover text |
| `--muted` | `210 40% 96.1%` | `#f1f5f9` | Muted backgrounds |
| `--muted-foreground` | `215.4 16.3% 46.9%` | `#64748b` | Muted text |
| `--border` | `214.3 31.8% 91.4%` | `#e2e8f0` | Borders |
| `--input` | `214.3 31.8% 91.4%` | `#e2e8f0` | Input borders |
| `--ring` | `221.2 83.2% 53.3%` | `#3b82f6` | Focus rings |

#### Dark Mode

| Token | HSL Value | Hex Equivalent | Usage |
|-------|-----------|----------------|-------|
| `--background` | `222.2 84% 4.9%` | `#020817` | App background |
| `--foreground` | `210 40% 98%` | `#f8fafc` | Default text |
| `--card` | `222.2 84% 4.9%` | `#020817` | Card backgrounds |
| `--card-foreground` | `210 40% 98%` | `#f8fafc` | Card text |
| `--popover` | `222.2 84% 4.9%` | `#020817` | Popover backgrounds |
| `--popover-foreground` | `210 40% 98%` | `#f8fafc` | Popover text |
| `--muted` | `217.2 32.6% 17.5%` | `#1e293b` | Muted backgrounds |
| `--muted-foreground` | `215 20.2% 65.1%` | `#94a3b8` | Muted text |
| `--border` | `217.2 32.6% 17.5%` | `#1e293b` | Borders |
| `--input` | `217.2 32.6% 17.5%` | `#1e293b` | Input borders |
| `--ring` | `224.3 76.3% 48%` | `#2563eb` | Focus rings |

---

### Semantic Tokens

#### Primary (Blue - Default Actions)

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--primary` | `221.2 83.2% 53.3%` | `217.2 91.2% 59.8%` | Primary buttons, links |
| `--primary-foreground` | `210 40% 98%` | `222.2 47.4% 11.2%` | Text on primary |

#### Secondary (Neutral)

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--secondary` | `210 40% 96.1%` | `217.2 32.6% 17.5%` | Secondary buttons |
| `--secondary-foreground` | `222.2 47.4% 11.2%` | `210 40% 98%` | Text on secondary |

#### Accent (Hover States)

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--accent` | `210 40% 96.1%` | `217.2 32.6% 17.5%` | Hover backgrounds |
| `--accent-foreground` | `222.2 47.4% 11.2%` | `210 40% 98%` | Text on accent |

---

### Extended Semantic Tokens (Eagle-Specific)

These tokens extend shadcn/ui defaults for Eagle plugin needs:

#### Success (Emerald - Confirmations)

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--success` | `142.1 76.2% 36.3%` | `142.1 70.6% 45.3%` | Success states |
| `--success-foreground` | `355.7 100% 97.3%` | `144.9 80.4% 10%` | Text on success |

**Hex:** Light `#16a34a`, Dark `#22c55e`

#### Warning (Amber - Cautions)

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--warning` | `45.4 93.4% 47.5%` | `48 96.5% 53%` | Warning states |
| `--warning-foreground` | `240 10% 3.9%` | `240 10% 3.9%` | Text on warning |

**Hex:** Light `#eab308`, Dark `#facc15`

#### Info (Blue - Information)

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--info` | `199.4 95.5% 53.8%` | `199.4 95.5% 53.8%` | Info states |
| `--info-foreground` | `0 0% 100%` | `0 0% 100%` | Text on info |

**Hex:** Light `#0ea5e9`, Dark `#0ea5e9`

#### Destructive (Red - Errors)

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `--destructive` | `0 84.2% 60.2%` | `0 62.8% 30.6%` | Error states, delete actions |
| `--destructive-foreground` | `0 0% 98%` | `0 0% 98%` | Text on destructive |

**Hex:** Light `#ef4444`, Dark `#7f1d1d`

---

### Chart Colors (Data Visualization)

| Token | Light | Dark |
|-------|-------|------|
| `--chart-1` | `12 76% 61%` | `220 70% 50%` |
| `--chart-2` | `173 58% 39%` | `160 60% 45%` |
| `--chart-3` | `197 37% 24%` | `30 80% 55%` |
| `--chart-4` | `43 74% 66%` | `280 65% 60%` |
| `--chart-5` | `27 87% 67%` | `340 75% 55%` |

---

## Typography

### Font Stack

```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 
  'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 
  'Helvetica Neue', sans-serif;
```

### Scale

| Class | Size | Line Height | Weight | Usage |
|-------|------|-------------|--------|-------|
| `text-xs` | 0.75rem (12px) | 1rem | 400 | Labels, captions |
| `text-sm` | 0.875rem (14px) | 1.25rem | 400 | Body small, form labels |
| `text-base` | 1rem (16px) | 1.5rem | 400 | Body default |
| `text-lg` | 1.125rem (18px) | 1.75rem | 500 | Subheadings |
| `text-xl` | 1.25rem (20px) | 1.75rem | 600 | Card titles |
| `text-2xl` | 1.5rem (24px) | 2rem | 700 | Section headers |
| `text-3xl` | 1.875rem (30px) | 2.25rem | 700 | Page titles |

---

## Spacing & Layout

### Spacing Scale

| Token | Value | Usage |
|-------|-------|-------|
| `0` | 0 | No spacing |
| `0.5` | 0.125rem (2px) | Tight gaps |
| `1` | 0.25rem (4px) | Icon gaps |
| `1.5` | 0.375rem (6px) | Tight padding |
| `2` | 0.5rem (8px) | Default gap |
| `3` | 0.75rem (12px) | Form spacing |
| `4` | 1rem (16px) | Section padding |
| `5` | 1.25rem (20px) | Card padding |
| `6` | 1.5rem (24px) | Large padding |
| `8` | 2rem (32px) | Section margins |

### Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius` | 0.5rem (8px) | Base radius |
| `rounded-sm` | calc(var(--radius) - 4px) | Tight corners |
| `rounded-md` | calc(var(--radius) - 2px) | Medium corners |
| `rounded-lg` | var(--radius) | Default corners |
| `rounded-xl` | calc(var(--radius) + 4px) | Large corners |
| `rounded-full` | 9999px | Pills, avatars |

---

## Component Variants

### Button

```typescript
const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        success: 'bg-success text-success-foreground hover:bg-success/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-6',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);
```

#### Variant Usage Guide

| Variant | Use Case | Example |
|---------|----------|---------|
| `default` | Primary actions | "Save", "Submit", "Add to Library" |
| `success` | Positive confirmations | "Export Complete", "Confirm" |
| `destructive` | Dangerous actions | "Delete", "Remove", "Cancel Subscription" |
| `outline` | Secondary actions | "Cancel", "Back", "Reset" |
| `secondary` | Less prominent actions | "View Details", "More Options" |
| `ghost` | Tertiary actions, icon buttons | "Close", toolbar actions |
| `link` | Navigation, inline actions | "Learn more", "View all" |

### Card

```typescript
const cardVariants = {
  variant: {
    default: 'bg-card text-card-foreground border border-border',
    glass: 'bg-card/80 backdrop-blur-xl border border-border/50',
    outline: 'bg-transparent border-2 border-border',
  },
};
```

### Toast

| Type | Token Mapping |
|------|---------------|
| `success` | `bg-success text-success-foreground border-success` |
| `error` | `bg-destructive text-destructive-foreground border-destructive` |
| `warning` | `bg-warning text-warning-foreground border-warning` |
| `info` | `bg-info text-info-foreground border-info` |

---

## Animation System

### Keyframes

```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

@keyframes accordion-down {
  from { height: 0; }
  to { height: var(--radix-accordion-content-height); }
}

@keyframes accordion-up {
  from { height: var(--radix-accordion-content-height); }
  to { height: 0; }
}
```

### Animation Classes

| Class | Duration | Easing | Usage |
|-------|----------|--------|-------|
| `animate-fade-in` | 200ms | ease-out | General fade in |
| `animate-slide-up` | 300ms | ease-out | Modals, toasts from bottom |
| `animate-slide-down` | 300ms | ease-out | Dropdowns from top |
| `animate-shimmer` | 2s (infinite) | linear | Loading skeletons |
| `animate-accordion-down` | 200ms | ease-out | Accordion expand |
| `animate-accordion-up` | 200ms | ease-out | Accordion collapse |

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Eagle-Specific Patterns

### Window Drag Region

For frameless Eagle plugin windows, use these classes on the header:

```tsx
// Header component
<header className="drag-region h-10 flex items-center px-4">
  <span>Plugin Title</span>
  <button className="no-drag">✕</button>  {/* Buttons must be no-drag */}
</header>
```

```css
.drag-region {
  -webkit-app-region: drag;
}

.no-drag {
  -webkit-app-region: no-drag;
}
```

### Glass Effect

For glass-morphic panels (Eagle's signature look):

```tsx
<div className="glass rounded-lg p-4">
  {/* Content */}
</div>
```

```css
.glass {
  background: hsl(var(--background) / 0.8);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}
```

### Custom Scrollbar

```css
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: hsl(var(--muted-foreground) / 0.4);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: hsl(var(--muted-foreground) / 0.6);
}
```

---

## Accessibility

### Focus States

All interactive elements use consistent focus rings:

```css
*:focus-visible {
  outline: 2px solid hsl(var(--ring));
  outline-offset: 2px;
}

*:focus:not(:focus-visible) {
  outline: none;
}
```

### Keyboard Navigation

| Component | Keys |
|-----------|------|
| **Dialog** | `Esc` to close, focus trapped |
| **Dropdown** | `↑/↓` to navigate, `Enter` to select, `Esc` to close |
| **Tabs** | `←/→` to switch tabs |
| **Accordion** | `↑/↓` to navigate, `Enter/Space` to toggle |
| **Toast** | `Esc` to dismiss |

### ARIA Requirements

| Component | Required Attributes |
|-----------|---------------------|
| **Button** | `aria-disabled` when loading |
| **Dialog** | `role="dialog"`, `aria-modal="true"`, `aria-labelledby` |
| **Toast** | `role="alert"`, `aria-live="polite"` |
| **Tabs** | `role="tablist"`, `role="tab"`, `aria-selected` |

---

## File Structure

### Component Organization

```
src/components/ui/
├── button.tsx           # Button component with CVA variants
├── card.tsx             # Card + CardHeader, CardContent, etc.
├── dialog.tsx           # Radix Dialog wrapper
├── dropdown-menu.tsx    # Radix DropdownMenu wrapper
├── form.tsx             # Input, Label, Select, Checkbox, Slider
├── tabs.tsx             # Radix Tabs wrapper
├── toast.tsx            # Toast + ToastProvider + useToast
├── tooltip.tsx          # Radix Tooltip wrapper
├── header.tsx           # Eagle-specific header with drag region
├── error-boundary.tsx   # Error boundary + fallback
└── index.ts             # Barrel exports
```

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| **Component file** | kebab-case | `dropdown-menu.tsx` |
| **Component name** | PascalCase | `DropdownMenu` |
| **Variant const** | camelCase + "Variants" | `buttonVariants` |
| **Hook** | camelCase, `use` prefix | `useToast` |
| **Test file** | `.test.tsx` suffix | `button.test.tsx` |

### Barrel Exports

```typescript
// src/components/ui/index.ts
export { Button, buttonVariants, type ButtonProps } from './button';
export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './card';
export { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription, DialogClose } from './dialog';
export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from './dropdown-menu';
export { Input, Label, Select, Checkbox, Slider } from './form';
export { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs';
export { ToastProvider, useToast, toast } from './toast';
export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from './tooltip';
export { Header } from './header';
export { ErrorBoundary, ErrorFallback } from './error-boundary';
```

---

## shadcn/ui CLI Configuration

### components.json

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "src/styles/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
```

### Adding Components

```bash
# Add individual components
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add tabs
npx shadcn@latest add tooltip

# After adding, customize to match Eagle design tokens
```

---

## Migration Checklist

### From Current to shadcn/ui

- [x] Update `globals.css` with HSL tokens
- [x] Update `tailwind.config.js` with animation keyframes
- [x] Create `components.json` for shadcn CLI
- [x] Migrate `Button` to use new tokens (remove gradients)
- [x] Migrate `Card` to use new tokens
- [x] Migrate `Form` components to use new tokens
- [x] Migrate `Toast` to use semantic tokens
- [x] Add Radix-based `Dialog`
- [x] Add Radix-based `DropdownMenu`
- [x] Add Radix-based `Tabs`
- [x] Add Radix-based `Tooltip`
- [x] Update all tests
- [x] Verify dark mode switching

---

## Related Documents

- [KNOWN_LIMITATIONS.md](./KNOWN_LIMITATIONS.md) - Technical debt tracking
- [TESTING.md](./TESTING.md) - Testing guidelines
- [DEVELOPMENT.md](./DEVELOPMENT.md) - Development guide
