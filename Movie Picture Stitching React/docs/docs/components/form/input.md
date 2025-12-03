---
sidebar_position: 1
title: Input
description: Text input field with focus states and validation styling
---

# Input

A styled text input component with focus states, validation styling, and file input support.

## Import

```tsx
import { Input } from '@/components';
import type { InputProps } from '@/components';
```

## Basic Usage

```tsx
<Input type="text" placeholder="Enter your name" />
```

## Input Types

```tsx
// Text input (default)
<Input type="text" placeholder="Username" />

// Password
<Input type="password" placeholder="Password" />

// Email
<Input type="email" placeholder="email@example.com" />

// Number
<Input type="number" min={0} max={100} />

// Search
<Input type="search" placeholder="Search..." />

// File upload
<Input type="file" accept="image/*" />
```

## With Label

Use with the Label component for accessible forms:

```tsx
import { Label, Input } from '@/components';

<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" placeholder="you@example.com" />
</div>
```

## States

### Disabled

```tsx
<Input disabled placeholder="Disabled input" />
```

### Invalid (Validation Error)

Use `aria-invalid` for validation error styling:

```tsx
<Input aria-invalid="true" placeholder="Invalid input" />
```

The input will show a red border and focus ring when invalid.

### Read Only

```tsx
<Input readOnly value="Read-only value" />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `string` | `'text'` | Input type (text, password, email, etc.) |
| `placeholder` | `string` | — | Placeholder text |
| `disabled` | `boolean` | `false` | Disable the input |
| `aria-invalid` | `boolean` | — | Show validation error styling |
| `className` | `string` | — | Additional CSS classes |

Plus all standard `<input>` HTML attributes.

## Examples

### Form with Validation

```tsx
import { useForm } from 'react-hook-form';

function SignupForm() {
  const { register, formState: { errors } } = useForm();

  return (
    <form>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          aria-invalid={!!errors.email}
          {...register('email', { required: true })}
        />
        {errors.email && (
          <p className="text-sm text-destructive">Email is required</p>
        )}
      </div>
    </form>
  );
}
```

### Search Input

```tsx
import { Search } from 'lucide-react';

<div className="relative">
  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
  <Input 
    type="search" 
    placeholder="Search..." 
    className="pl-9"
  />
</div>
```

### Input with Button

```tsx
<div className="flex gap-2">
  <Input placeholder="Enter URL" className="flex-1" />
  <Button>Add</Button>
</div>
```

### File Input

```tsx
<Input 
  type="file" 
  accept="image/*"
  onChange={(e) => handleFileSelect(e.target.files)}
/>
```

## Styling

The Input uses semantic color tokens:

```css
/* Base styles */
border-input        /* Border color */
bg-transparent      /* Background */
text-foreground     /* Text color */
placeholder:text-muted-foreground

/* Focus state */
focus-visible:ring-1
focus-visible:ring-ring

/* Invalid state */
aria-invalid:border-destructive
aria-invalid:ring-destructive/20
```

### Custom Styling

```tsx
// Full width
<Input className="w-full" />

// Larger input
<Input className="h-12 text-lg" />

// Custom colors
<Input className="border-primary focus-visible:ring-primary" />
```

## Accessibility

- **Labels**: Always pair with `<Label>` for accessibility
- **IDs**: Use matching `htmlFor` and `id` attributes
- **Validation**: Use `aria-invalid` and `aria-describedby` for errors
- **Keyboard**: Standard input keyboard behavior

```tsx
<div className="space-y-2">
  <Label htmlFor="username">Username</Label>
  <Input 
    id="username"
    aria-invalid={!!error}
    aria-describedby={error ? 'username-error' : undefined}
  />
  {error && (
    <p id="username-error" className="text-sm text-destructive">
      {error.message}
    </p>
  )}
</div>
```

## TypeScript

```tsx
import type { InputProps } from '@/components';

// Extend with custom props
interface SearchInputProps extends InputProps {
  onSearch: (value: string) => void;
}

function SearchInput({ onSearch, ...props }: SearchInputProps) {
  return (
    <Input 
      type="search"
      onChange={(e) => onSearch(e.target.value)}
      {...props}
    />
  );
}
```
