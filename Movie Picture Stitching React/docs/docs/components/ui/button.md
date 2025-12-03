---
sidebar_position: 1
title: Button
description: Versatile button component with 8 variants and loading states
---

# Button

A versatile button component with 8 style variants, 6 size options, and built-in loading state support.

## Import

```tsx
import { Button, buttonVariants } from '@/components';
```

## Basic Usage

```tsx
<Button>Click me</Button>
```

## Variants

The Button component supports 8 style variants:

```tsx
<Button variant="default">Default</Button>
<Button variant="primary">Primary</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
<Button variant="success">Success</Button>
<Button variant="warning">Warning</Button>
```

| Variant | Use Case |
|---------|----------|
| `default` / `primary` | Primary actions |
| `destructive` | Dangerous or irreversible actions |
| `outline` | Secondary actions with border |
| `secondary` | Alternative to primary |
| `ghost` | Subtle actions, toolbar buttons |
| `link` | Navigation, inline links |
| `success` | Positive confirmations (Eagle-specific) |
| `warning` | Cautionary actions (Eagle-specific) |

## Sizes

```tsx
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon"><Plus /></Button>
<Button size="icon-sm"><Plus /></Button>
<Button size="icon-lg"><Plus /></Button>
```

| Size | Height | Use Case |
|------|--------|----------|
| `sm` | 32px | Compact UI, tables |
| `default` | 36px | Standard buttons |
| `lg` | 40px | Prominent CTAs |
| `icon` | 36×36px | Icon-only buttons |
| `icon-sm` | 32×32px | Compact icon buttons |
| `icon-lg` | 40×40px | Large icon buttons |

## Loading State

Show a spinner and disable the button during async operations:

```tsx
const [isLoading, setIsLoading] = useState(false);

const handleSave = async () => {
  setIsLoading(true);
  try {
    await saveData();
  } finally {
    setIsLoading(false);
  }
};

<Button isLoading={isLoading} onClick={handleSave}>
  Save Changes
</Button>
```

When `isLoading` is `true`:
- A spinner appears before the text
- The button is automatically disabled
- Click events are prevented

## Composition with asChild

Use the `asChild` prop to render the button as a different element while keeping all styles:

```tsx
// Render as a link
<Button asChild variant="link">
  <a href="/docs">Read Documentation</a>
</Button>

// Render as Next.js Link
<Button asChild>
  <Link href="/settings">Settings</Link>
</Button>
```

## With Icons

```tsx
import { Plus, Download, Trash2 } from 'lucide-react';

// Icon before text
<Button>
  <Plus className="w-4 h-4" />
  Add Item
</Button>

// Icon after text
<Button>
  Download
  <Download className="w-4 h-4" />
</Button>

// Icon-only button
<Button variant="ghost" size="icon">
  <Trash2 className="w-4 h-4" />
</Button>
```

## Disabled State

```tsx
<Button disabled>Disabled</Button>
<Button disabled variant="outline">Disabled Outline</Button>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'primary' \| 'destructive' \| 'outline' \| 'secondary' \| 'ghost' \| 'link' \| 'success' \| 'warning'` | `'default'` | Visual style variant |
| `size` | `'default' \| 'sm' \| 'lg' \| 'icon' \| 'icon-sm' \| 'icon-lg'` | `'default'` | Button size |
| `asChild` | `boolean` | `false` | Render as child element via Radix Slot |
| `isLoading` | `boolean` | `false` | Show loading spinner and disable button |
| `disabled` | `boolean` | `false` | Disable the button |
| `className` | `string` | — | Additional CSS classes |
| `children` | `ReactNode` | — | Button content |

Plus all standard `<button>` HTML attributes.

## Using buttonVariants

For non-button elements that need button styling:

```tsx
import { buttonVariants } from '@/components';
import Link from 'next/link';

<Link 
  href="/docs" 
  className={buttonVariants({ variant: 'outline', size: 'lg' })}
>
  Documentation
</Link>
```

## Accessibility

- **Keyboard**: `Tab` to focus, `Enter` or `Space` to activate
- **ARIA**: Uses native `<button>` semantics
- **Focus**: Visible focus ring (`focus-visible:ring-[3px]`)
- **Disabled**: Sets `aria-disabled` implicitly via `disabled` attribute

## Examples

### Form Submit Button

```tsx
<form onSubmit={handleSubmit}>
  <Button type="submit" isLoading={isSubmitting}>
    {isSubmitting ? 'Saving...' : 'Save'}
  </Button>
</form>
```

### Button Group

```tsx
<div className="flex gap-2">
  <Button variant="outline">Cancel</Button>
  <Button>Confirm</Button>
</div>
```

### Toolbar

```tsx
<div className="flex gap-1 p-1 bg-muted rounded-lg">
  <Button variant="ghost" size="icon-sm"><Bold /></Button>
  <Button variant="ghost" size="icon-sm"><Italic /></Button>
  <Button variant="ghost" size="icon-sm"><Underline /></Button>
</div>
```
