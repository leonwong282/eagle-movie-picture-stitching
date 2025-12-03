---
sidebar_position: 3
title: Select
description: Dropdown select component with search, groups, and keyboard navigation
---

# Select

A dropdown select component built on Radix UI Select primitive, with full keyboard navigation, groups, and animations.

## Import

```tsx
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
} from '@/components';
```

## Basic Usage

```tsx
<Select>
  <SelectTrigger className="w-48">
    <SelectValue placeholder="Select a fruit" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="apple">Apple</SelectItem>
    <SelectItem value="banana">Banana</SelectItem>
    <SelectItem value="orange">Orange</SelectItem>
  </SelectContent>
</Select>
```

## Controlled Select

```tsx
const [value, setValue] = useState('');

<Select value={value} onValueChange={setValue}>
  <SelectTrigger>
    <SelectValue placeholder="Select format" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="jpg">JPEG</SelectItem>
    <SelectItem value="png">PNG</SelectItem>
    <SelectItem value="webp">WebP</SelectItem>
  </SelectContent>
</Select>
```

## With Groups

```tsx
<Select>
  <SelectTrigger className="w-64">
    <SelectValue placeholder="Select a timezone" />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectLabel>North America</SelectLabel>
      <SelectItem value="est">Eastern Time (ET)</SelectItem>
      <SelectItem value="cst">Central Time (CT)</SelectItem>
      <SelectItem value="pst">Pacific Time (PT)</SelectItem>
    </SelectGroup>
    <SelectSeparator />
    <SelectGroup>
      <SelectLabel>Europe</SelectLabel>
      <SelectItem value="gmt">Greenwich Mean Time (GMT)</SelectItem>
      <SelectItem value="cet">Central European Time (CET)</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>
```

## With Label

```tsx
<div className="space-y-2">
  <Label htmlFor="format">Export Format</Label>
  <Select>
    <SelectTrigger id="format">
      <SelectValue placeholder="Select format" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="jpg">JPEG (.jpg)</SelectItem>
      <SelectItem value="png">PNG (.png)</SelectItem>
      <SelectItem value="webp">WebP (.webp)</SelectItem>
    </SelectContent>
  </Select>
</div>
```

## Disabled States

```tsx
// Entire select disabled
<Select disabled>
  <SelectTrigger>
    <SelectValue placeholder="Disabled" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="a">Option A</SelectItem>
  </SelectContent>
</Select>

// Individual items disabled
<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="free">Free Plan</SelectItem>
    <SelectItem value="pro" disabled>Pro Plan (Coming Soon)</SelectItem>
    <SelectItem value="enterprise">Enterprise</SelectItem>
  </SelectContent>
</Select>
```

## Components

### SelectTrigger

The button that opens the dropdown.

```tsx
<SelectTrigger className="w-full">
  <SelectValue placeholder="Select..." />
</SelectTrigger>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | — | Additional CSS classes |
| `children` | `ReactNode` | — | Usually `<SelectValue>` |

### SelectValue

Displays the selected value or placeholder.

```tsx
<SelectValue placeholder="Choose an option" />
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `placeholder` | `string` | — | Text shown when no value selected |

### SelectContent

The dropdown panel containing options.

```tsx
<SelectContent position="popper">
  {/* Items */}
</SelectContent>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `position` | `'popper' \| 'item-aligned'` | `'popper'` | Positioning strategy |
| `className` | `string` | — | Additional CSS classes |

### SelectItem

An individual option.

```tsx
<SelectItem value="unique-value">Display Text</SelectItem>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | — | Unique value (required) |
| `disabled` | `boolean` | `false` | Disable this option |
| `children` | `ReactNode` | — | Display content |

### SelectGroup & SelectLabel

Group related options with a label.

```tsx
<SelectGroup>
  <SelectLabel>Category</SelectLabel>
  <SelectItem value="a">Option A</SelectItem>
  <SelectItem value="b">Option B</SelectItem>
</SelectGroup>
```

### SelectSeparator

Visual separator between groups.

```tsx
<SelectGroup>...</SelectGroup>
<SelectSeparator />
<SelectGroup>...</SelectGroup>
```

## Examples

### Image Format Selector

```tsx
function FormatSelector({ value, onChange }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-32">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="jpg">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-yellow-500 rounded-full" />
            JPEG
          </span>
        </SelectItem>
        <SelectItem value="png">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full" />
            PNG
          </span>
        </SelectItem>
        <SelectItem value="webp">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full" />
            WebP
          </span>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
```

### Form Integration

```tsx
import { useForm, Controller } from 'react-hook-form';

function MyForm() {
  const { control } = useForm();

  return (
    <Controller
      name="category"
      control={control}
      render={({ field }) => (
        <Select value={field.value} onValueChange={field.onChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="photos">Photos</SelectItem>
            <SelectItem value="videos">Videos</SelectItem>
            <SelectItem value="documents">Documents</SelectItem>
          </SelectContent>
        </Select>
      )}
    />
  );
}
```

## Keyboard Navigation

| Key | Action |
|-----|--------|
| `Space` / `Enter` | Open dropdown / Select item |
| `↑` / `↓` | Navigate options |
| `Home` / `End` | Jump to first/last option |
| `Escape` | Close dropdown |
| Type characters | Jump to matching option |

## Accessibility

- **ARIA**: Proper `role="listbox"` and `role="option"` attributes
- **Keyboard**: Full keyboard navigation support
- **Focus**: Focus trap when open, returns focus on close
- **Labels**: Associate with `<Label>` using matching IDs

## Animations

The select content animates on open/close:

- `fade-in` / `fade-out` for opacity
- `zoom-in-95` / `zoom-out-95` for scale
- Direction-aware slide animations based on dropdown position
