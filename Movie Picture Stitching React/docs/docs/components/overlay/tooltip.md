---
sidebar_position: 3
title: Tooltip
description: Accessible tooltip component for displaying contextual information on hover
---

# Tooltip

A tooltip component built on [Radix UI Tooltip](https://www.radix-ui.com/primitives/docs/components/tooltip) providing accessible hover hints with customizable positioning and delay.

## Import

```tsx
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components';
```

## Basic Usage

Wrap your application (or a section) with `TooltipProvider`, then use tooltips anywhere:

```tsx
// In your App or layout
<TooltipProvider>
  <App />
</TooltipProvider>

// Then use tooltips
<Tooltip>
  <TooltipTrigger asChild>
    <Button variant="outline" size="icon">
      <Settings className="h-4 w-4" />
    </Button>
  </TooltipTrigger>
  <TooltipContent>
    <p>Settings</p>
  </TooltipContent>
</Tooltip>
```

## Components

| Component | Description |
|-----------|-------------|
| `TooltipProvider` | Provides shared state for tooltips |
| `Tooltip` | Root component for individual tooltip |
| `TooltipTrigger` | Element that triggers the tooltip |
| `TooltipContent` | The tooltip popup content |

## Props

### TooltipProvider

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `delayDuration` | `number` | `700` | Delay in ms before tooltip shows |
| `skipDelayDuration` | `number` | `300` | Time in ms to skip delay when moving between tooltips |
| `disableHoverableContent` | `boolean` | `false` | Disable hovering over content |

### Tooltip

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | - | Controlled open state |
| `onOpenChange` | `(open: boolean) => void` | - | Callback when open state changes |
| `defaultOpen` | `boolean` | `false` | Initial open state |
| `delayDuration` | `number` | - | Override provider delay |

### TooltipContent

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |
| `sideOffset` | `number` | `4` | Distance from trigger |
| `side` | `'top' \| 'right' \| 'bottom' \| 'left'` | `'top'` | Preferred side |
| `align` | `'start' \| 'center' \| 'end'` | `'center'` | Alignment on side |
| `alignOffset` | `number` | `0` | Offset from alignment |
| `avoidCollisions` | `boolean` | `true` | Flip to avoid viewport edges |

### TooltipTrigger

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `asChild` | `boolean` | `false` | Merge props onto child element |

## Examples

### Icon Buttons with Tooltips

```tsx
import { Bold, Italic, Underline, AlignLeft } from 'lucide-react';

function Toolbar() {
  return (
    <TooltipProvider>
      <div className="flex gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon">
              <Bold className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Bold (⌘B)</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon">
              <Italic className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Italic (⌘I)</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon">
              <Underline className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Underline (⌘U)</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
```

### Custom Delay

```tsx
// Fast tooltips (200ms)
<TooltipProvider delayDuration={200}>
  <Tooltip>
    <TooltipTrigger>Quick info</TooltipTrigger>
    <TooltipContent>Shows quickly!</TooltipContent>
  </Tooltip>
</TooltipProvider>

// Instant tooltip (override individual)
<Tooltip delayDuration={0}>
  <TooltipTrigger>Instant</TooltipTrigger>
  <TooltipContent>No delay!</TooltipContent>
</Tooltip>
```

### Positioning

```tsx
<div className="flex gap-4">
  <Tooltip>
    <TooltipTrigger asChild>
      <Button>Top (default)</Button>
    </TooltipTrigger>
    <TooltipContent side="top">
      <p>Tooltip on top</p>
    </TooltipContent>
  </Tooltip>

  <Tooltip>
    <TooltipTrigger asChild>
      <Button>Right</Button>
    </TooltipTrigger>
    <TooltipContent side="right">
      <p>Tooltip on right</p>
    </TooltipContent>
  </Tooltip>

  <Tooltip>
    <TooltipTrigger asChild>
      <Button>Bottom</Button>
    </TooltipTrigger>
    <TooltipContent side="bottom">
      <p>Tooltip on bottom</p>
    </TooltipContent>
  </Tooltip>

  <Tooltip>
    <TooltipTrigger asChild>
      <Button>Left</Button>
    </TooltipTrigger>
    <TooltipContent side="left">
      <p>Tooltip on left</p>
    </TooltipContent>
  </Tooltip>
</div>
```

### Alignment

```tsx
<Tooltip>
  <TooltipTrigger asChild>
    <Button className="w-40">Aligned Start</Button>
  </TooltipTrigger>
  <TooltipContent align="start">
    <p>Aligned to start</p>
  </TooltipContent>
</Tooltip>

<Tooltip>
  <TooltipTrigger asChild>
    <Button className="w-40">Aligned End</Button>
  </TooltipTrigger>
  <TooltipContent align="end">
    <p>Aligned to end</p>
  </TooltipContent>
</Tooltip>
```

### Rich Content

```tsx
<Tooltip>
  <TooltipTrigger asChild>
    <Button variant="outline">
      <Info className="mr-2 h-4 w-4" />
      More Info
    </Button>
  </TooltipTrigger>
  <TooltipContent className="max-w-[300px]">
    <div className="space-y-2">
      <p className="font-semibold">Image Details</p>
      <p className="text-sm text-muted-foreground">
        This image was imported on March 15, 2024.
        It has been viewed 42 times.
      </p>
    </div>
  </TooltipContent>
</Tooltip>
```

### Controlled Tooltip

```tsx
function ControlledTooltip() {
  const [open, setOpen] = useState(false);

  return (
    <Tooltip open={open} onOpenChange={setOpen}>
      <TooltipTrigger asChild>
        <Button
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
        >
          Controlled
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>This tooltip is controlled</p>
      </TooltipContent>
    </Tooltip>
  );
}
```

### Disabled Elements

Wrap disabled elements in a span for tooltips to work:

```tsx
<Tooltip>
  <TooltipTrigger asChild>
    <span tabIndex={0}>
      <Button disabled>Disabled Button</Button>
    </span>
  </TooltipTrigger>
  <TooltipContent>
    <p>This action is currently unavailable</p>
  </TooltipContent>
</Tooltip>
```

### With Custom Offset

```tsx
<Tooltip>
  <TooltipTrigger asChild>
    <Button>With Offset</Button>
  </TooltipTrigger>
  <TooltipContent sideOffset={10}>
    <p>10px away from trigger</p>
  </TooltipContent>
</Tooltip>
```

## Styling

### Default Styles

```tsx
// TooltipContent default styling
"z-50 overflow-hidden rounded-md border"
"bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md"
"animate-in fade-in-0 zoom-in-95"
"data-[state=closed]:animate-out data-[state=closed]:fade-out-0"
"data-[state=closed]:zoom-out-95"
```

### Custom Styling

```tsx
// Dark tooltip
<TooltipContent className="bg-gray-900 text-white border-gray-700">
  <p>Dark styled tooltip</p>
</TooltipContent>

// Success tooltip
<TooltipContent className="bg-green-500 text-white border-green-600">
  <p>Success!</p>
</TooltipContent>

// Larger tooltip
<TooltipContent className="px-4 py-2 text-base">
  <p>Larger text</p>
</TooltipContent>
```

## Accessibility

Tooltips implement proper accessibility patterns:

- **Keyboard Accessible**: Shows on focus, hides on blur
- **Screen Readers**: Content is announced when tooltip opens
- **ARIA**: Uses `role="tooltip"` with proper labeling
- **Timing**: Respects `prefers-reduced-motion`
- **Escape**: Tooltip can be dismissed with Escape key

### Important Considerations

```tsx
// ✅ Good: Trigger is focusable
<TooltipTrigger asChild>
  <Button>Focusable</Button>
</TooltipTrigger>

// ⚠️ Needs wrapper: Non-focusable element
<TooltipTrigger asChild>
  <span tabIndex={0}>
    <span>Make me focusable</span>
  </span>
</TooltipTrigger>

// ⚠️ Disabled elements need wrapper
<TooltipTrigger asChild>
  <span tabIndex={0}>
    <Button disabled>Disabled</Button>
  </span>
</TooltipTrigger>
```

## Best Practices

### Do

- ✅ Use for supplementary information only
- ✅ Keep tooltip text concise (ideally one line)
- ✅ Include keyboard shortcuts in tooltips
- ✅ Use consistent delay across your app
- ✅ Ensure trigger elements are focusable
- ✅ Position tooltips to avoid obscuring important content

### Don't

- ❌ Put essential information only in tooltips
- ❌ Use tooltips for form validation messages
- ❌ Make tooltips too large or complex
- ❌ Use on touch-only devices (no hover)
- ❌ Set delay to 0 for all tooltips (jarring UX)
- ❌ Rely on tooltips for critical actions

## Provider Placement

Place `TooltipProvider` at a high level to share state:

```tsx
// ✅ Good: Provider wraps entire app
function App() {
  return (
    <TooltipProvider>
      <Router>
        <Layout>
          <Routes />
        </Layout>
      </Router>
    </TooltipProvider>
  );
}

// ⚠️ Works but redundant: Multiple providers
<TooltipProvider>
  <Button />
</TooltipProvider>
<TooltipProvider>
  <Button />
</TooltipProvider>
```

## Skip Delay Duration

When moving between tooltips quickly, the delay can be skipped:

```tsx
<TooltipProvider 
  delayDuration={700}
  skipDelayDuration={300}
>
  {/* Moving between these within 300ms skips the 700ms delay */}
  <Tooltip>...</Tooltip>
  <Tooltip>...</Tooltip>
  <Tooltip>...</Tooltip>
</TooltipProvider>
```

## Related Components

- [Popover](./popover) - For interactive content that needs to persist
- [Dialog](./dialog) - For complex interactions requiring user action
- [DropdownMenu](./dropdown-menu) - For action menus
