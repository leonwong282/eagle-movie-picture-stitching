---
sidebar_position: 2
title: Card
description: Flexible card container with glass-morphic variants and semantic sections
---

# Card

A flexible container component with multiple variants and semantic sub-components for structured content.

## Import

```tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
  cardVariants,
} from '@/components';
```

## Basic Usage

```tsx
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description goes here</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content...</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

## Variants

```tsx
// Default - solid background with shadow
<Card variant="default">...</Card>

// Glass - translucent with backdrop blur (great for Eagle plugins)
<Card variant="glass">...</Card>

// Outline - transparent with prominent border
<Card variant="outline">...</Card>
```

| Variant | Effect | Use Case |
|---------|--------|----------|
| `default` | Solid `bg-card` with subtle shadow | Standard cards |
| `glass` | 80% opacity + `backdrop-blur-xl` | Overlay content, Eagle panels |
| `outline` | Transparent with 2px border | Selectable items, emphasis |

## Compound Components

Cards use a compound component pattern for flexible layouts:

### CardHeader

Container for the title area. Automatically arranges title, description, and actions.

```tsx
<CardHeader>
  <CardTitle>Title</CardTitle>
  <CardDescription>Description</CardDescription>
  <CardAction>
    <Button size="sm">Edit</Button>
  </CardAction>
</CardHeader>
```

### CardTitle

The main heading. Renders as a `<div>` with semibold font.

```tsx
<CardTitle>My Card Title</CardTitle>

// With icon
<CardTitle className="flex items-center gap-2">
  <Settings className="w-5 h-5" />
  Settings
</CardTitle>
```

### CardDescription

Secondary text below the title.

```tsx
<CardDescription>
  Configure your plugin preferences here.
</CardDescription>
```

### CardAction

Positions action buttons in the top-right of the header.

```tsx
<CardHeader>
  <CardTitle>Items</CardTitle>
  <CardAction>
    <Button variant="ghost" size="icon-sm">
      <MoreHorizontal className="w-4 h-4" />
    </Button>
  </CardAction>
</CardHeader>
```

### CardContent

The main content area. Has horizontal padding and bottom padding by default.

```tsx
<CardContent>
  <p>Your content here...</p>
</CardContent>

// Remove default padding
<CardContent className="p-0">
  <img src="..." className="w-full" />
</CardContent>
```

### CardFooter

Bottom section for actions. Uses flexbox for alignment.

```tsx
<CardFooter>
  <Button variant="outline">Cancel</Button>
  <Button className="ml-auto">Save</Button>
</CardFooter>
```

## Props

### Card

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'glass' \| 'outline'` | `'default'` | Visual style |
| `className` | `string` | — | Additional CSS classes |
| `children` | `ReactNode` | — | Card content |

Plus all standard `<div>` HTML attributes.

### Other Components

All sub-components (`CardHeader`, `CardTitle`, etc.) accept:
- `className` for additional styling
- All standard `<div>` HTML attributes
- `children` for content

## Examples

### Feature Card

```tsx
<Card>
  <CardHeader>
    <CardTitle className="flex items-center gap-2">
      <Zap className="w-5 h-5 text-primary" />
      Fast Processing
    </CardTitle>
    <CardDescription>
      Process thousands of images in seconds
    </CardDescription>
  </CardHeader>
  <CardContent>
    <ul className="space-y-2 text-sm">
      <li>✓ Batch processing</li>
      <li>✓ Parallel execution</li>
      <li>✓ Memory efficient</li>
    </ul>
  </CardContent>
</Card>
```

### Settings Card

```tsx
<Card variant="glass">
  <CardHeader>
    <CardTitle>Export Settings</CardTitle>
    <CardAction>
      <Button variant="ghost" size="sm">Reset</Button>
    </CardAction>
  </CardHeader>
  <CardContent className="space-y-4">
    <div>
      <Label>Format</Label>
      <Select>...</Select>
    </div>
    <div>
      <Label>Quality</Label>
      <Slider defaultValue={[80]} />
    </div>
  </CardContent>
  <CardFooter>
    <Button className="w-full">Apply Settings</Button>
  </CardFooter>
</Card>
```

### Selectable Card

```tsx
function SelectableCard({ selected, onSelect }) {
  return (
    <Card 
      variant={selected ? 'outline' : 'default'}
      className={cn(
        'cursor-pointer transition-all',
        selected && 'ring-2 ring-primary'
      )}
      onClick={onSelect}
    >
      <CardContent className="p-4">
        <p>Click to select</p>
      </CardContent>
    </Card>
  );
}
```

### Image Card

```tsx
<Card className="overflow-hidden">
  <CardContent className="p-0">
    <EagleImage 
      item={item} 
      useThumbnail 
      aspectRatio="16/9"
    />
  </CardContent>
  <CardHeader>
    <CardTitle className="text-base">{item.name}</CardTitle>
    <CardDescription>{item.ext.toUpperCase()}</CardDescription>
  </CardHeader>
</Card>
```

## Using cardVariants

For custom card-like elements:

```tsx
import { cardVariants } from '@/components';

<section className={cardVariants({ variant: 'glass' })}>
  Custom card-styled section
</section>
```

## Styling

Cards use CSS variables for theming:

```css
/* Light mode */
--card: 0 0% 100%;
--card-foreground: 222.2 84% 4.9%;

/* Dark mode */
--card: 222.2 84% 4.9%;
--card-foreground: 210 40% 98%;
```

## Accessibility

- **Semantic**: Uses `<div>` elements; add `role="region"` and `aria-labelledby` for landmark regions
- **Focus**: Cards are not focusable by default; interactive cards should use `tabIndex={0}`
- **Headings**: Use appropriate heading levels in `CardTitle` when needed

```tsx
// Accessible card with heading
<Card role="region" aria-labelledby="card-title">
  <CardHeader>
    <CardTitle>
      <h3 id="card-title">Settings</h3>
    </CardTitle>
  </CardHeader>
  ...
</Card>
```
