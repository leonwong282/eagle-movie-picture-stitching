---
sidebar_position: 2
title: Label
description: Accessible form label with peer styling support
---

# Label

An accessible label component built on Radix UI Label primitive, with automatic styling for disabled states.

## Import

```tsx
import { Label } from '@/components';
```

## Basic Usage

```tsx
<Label htmlFor="email">Email</Label>
<Input id="email" type="email" />
```

## With Form Controls

### Input

```tsx
<div className="space-y-2">
  <Label htmlFor="name">Name</Label>
  <Input id="name" placeholder="Enter your name" />
</div>
```

### Checkbox

```tsx
<div className="flex items-center gap-2">
  <Checkbox id="terms" />
  <Label htmlFor="terms">Accept terms and conditions</Label>
</div>
```

### Select

```tsx
<div className="space-y-2">
  <Label htmlFor="country">Country</Label>
  <Select>
    <SelectTrigger id="country">
      <SelectValue placeholder="Select country" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="us">United States</SelectItem>
      <SelectItem value="uk">United Kingdom</SelectItem>
    </SelectContent>
  </Select>
</div>
```

## Disabled State

Label automatically styles itself when its peer input is disabled:

```tsx
<div className="space-y-2">
  <Label htmlFor="disabled-input">Disabled Field</Label>
  <Input id="disabled-input" disabled />
</div>
```

The label becomes semi-transparent and shows `cursor-not-allowed` when the associated input is disabled.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `htmlFor` | `string` | — | ID of the associated form control |
| `className` | `string` | — | Additional CSS classes |
| `children` | `ReactNode` | — | Label text |

Plus all standard `<label>` HTML attributes via Radix UI.

## Examples

### Required Field

```tsx
<Label htmlFor="email">
  Email <span className="text-destructive">*</span>
</Label>
<Input id="email" required />
```

### With Description

```tsx
<div className="space-y-2">
  <Label htmlFor="bio">Bio</Label>
  <p className="text-sm text-muted-foreground">
    Tell us about yourself in 160 characters or less.
  </p>
  <Input id="bio" />
</div>
```

### Inline Label

```tsx
<div className="flex items-center gap-4">
  <Label htmlFor="quantity" className="whitespace-nowrap">
    Quantity
  </Label>
  <Input id="quantity" type="number" className="w-20" />
</div>
```

### Form Group Component

```tsx
interface FormFieldProps {
  label: string;
  name: string;
  required?: boolean;
  children: React.ReactNode;
}

function FormField({ label, name, required, children }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      {children}
    </div>
  );
}

// Usage
<FormField label="Email" name="email" required>
  <Input id="email" type="email" />
</FormField>
```

## Styling

Default styles:

```css
text-sm           /* Font size */
font-medium       /* Font weight */
leading-none      /* Line height */
peer-disabled:cursor-not-allowed
peer-disabled:opacity-70
```

### Custom Styling

```tsx
// Larger label
<Label className="text-base">Large Label</Label>

// Bold label
<Label className="font-bold">Bold Label</Label>

// With icon
<Label className="flex items-center gap-2">
  <Mail className="w-4 h-4" />
  Email
</Label>
```

## Accessibility

- **Semantic**: Uses native `<label>` element via Radix UI
- **Association**: Use `htmlFor` to associate with form controls
- **Clickable**: Clicking the label focuses the associated input

```tsx
// ✅ Correct - labels are associated
<Label htmlFor="email">Email</Label>
<Input id="email" />

// ❌ Incorrect - no association
<Label>Email</Label>
<Input />
```

## Radix UI Label

This component is built on [@radix-ui/react-label](https://www.radix-ui.com/primitives/docs/components/label), which provides:

- Native label semantics
- Click-to-focus behavior
- Proper accessibility attributes
