---
sidebar_position: 4
title: Checkbox
description: Accessible checkbox with optional label and animations
---

# Checkbox

An accessible checkbox component built on Radix UI Checkbox primitive, with optional inline label and check animation.

## Import

```tsx
import { Checkbox } from '@/components';
import type { CheckboxProps } from '@/components';
```

## Basic Usage

```tsx
<Checkbox />
```

## With Label

The checkbox supports an optional `label` prop for inline labels:

```tsx
<Checkbox label="Accept terms and conditions" />
```

Or use with a separate Label component:

```tsx
<div className="flex items-center gap-2">
  <Checkbox id="terms" />
  <Label htmlFor="terms">Accept terms and conditions</Label>
</div>
```

## Controlled Checkbox

```tsx
const [checked, setChecked] = useState(false);

<Checkbox
  checked={checked}
  onCheckedChange={setChecked}
  label="Enable notifications"
/>
```

## Checkbox States

### Unchecked (Default)

```tsx
<Checkbox label="Unchecked" />
```

### Checked

```tsx
<Checkbox checked label="Checked" />
```

### Indeterminate

For "select all" patterns:

```tsx
<Checkbox checked="indeterminate" label="Select all" />
```

### Disabled

```tsx
<Checkbox disabled label="Disabled unchecked" />
<Checkbox disabled checked label="Disabled checked" />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `checked` | `boolean \| 'indeterminate'` | — | Controlled checked state |
| `defaultChecked` | `boolean` | `false` | Default checked state (uncontrolled) |
| `onCheckedChange` | `(checked: boolean) => void` | — | Called when checked state changes |
| `label` | `string` | — | Optional inline label text |
| `disabled` | `boolean` | `false` | Disable the checkbox |
| `id` | `string` | Auto-generated | Checkbox ID for label association |
| `className` | `string` | — | Additional CSS classes |

Plus all Radix UI Checkbox props.

## Examples

### Form with Multiple Checkboxes

```tsx
const [selected, setSelected] = useState<string[]>([]);

const handleChange = (value: string, checked: boolean) => {
  setSelected(prev => 
    checked 
      ? [...prev, value]
      : prev.filter(v => v !== value)
  );
};

<div className="space-y-3">
  <Checkbox
    label="Photos"
    checked={selected.includes('photos')}
    onCheckedChange={(checked) => handleChange('photos', checked)}
  />
  <Checkbox
    label="Videos"
    checked={selected.includes('videos')}
    onCheckedChange={(checked) => handleChange('videos', checked)}
  />
  <Checkbox
    label="Documents"
    checked={selected.includes('documents')}
    onCheckedChange={(checked) => handleChange('documents', checked)}
  />
</div>
```

### Select All Pattern

```tsx
function SelectAllExample({ items }) {
  const [selected, setSelected] = useState<string[]>([]);
  
  const allSelected = selected.length === items.length;
  const someSelected = selected.length > 0 && !allSelected;
  
  return (
    <div className="space-y-3">
      <Checkbox
        checked={allSelected ? true : someSelected ? 'indeterminate' : false}
        onCheckedChange={(checked) => {
          setSelected(checked ? items.map(i => i.id) : []);
        }}
        label="Select all"
      />
      <div className="ml-6 space-y-2">
        {items.map(item => (
          <Checkbox
            key={item.id}
            label={item.name}
            checked={selected.includes(item.id)}
            onCheckedChange={(checked) => {
              setSelected(prev =>
                checked
                  ? [...prev, item.id]
                  : prev.filter(id => id !== item.id)
              );
            }}
          />
        ))}
      </div>
    </div>
  );
}
```

### With Form Validation

```tsx
import { useForm } from 'react-hook-form';

function TermsForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <Checkbox
          {...register('terms', { required: 'You must accept the terms' })}
          label="I accept the terms and conditions"
          aria-invalid={!!errors.terms}
        />
        {errors.terms && (
          <p className="text-sm text-destructive">{errors.terms.message}</p>
        )}
      </div>
      <Button type="submit" className="mt-4">Submit</Button>
    </form>
  );
}
```

### Checkbox Card

```tsx
function CheckboxCard({ title, description, checked, onChange }) {
  return (
    <Card 
      className={cn(
        'cursor-pointer transition-all',
        checked && 'ring-2 ring-primary'
      )}
      onClick={() => onChange(!checked)}
    >
      <CardContent className="flex items-start gap-4 p-4">
        <Checkbox checked={checked} onCheckedChange={onChange} />
        <div>
          <p className="font-medium">{title}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
```

## Styling

Default styles include:

- **Size**: 20×20px (`size-5`)
- **Border**: 2px solid with rounded corners
- **Checked**: Primary color background with white checkmark
- **Animation**: Zoom-in effect on check

### Custom Styling

```tsx
// Larger checkbox
<Checkbox className="size-6" label="Large" />

// Custom colors
<Checkbox 
  className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
  label="Green when checked"
/>
```

## Accessibility

- **ARIA**: Proper `role="checkbox"` and `aria-checked` states
- **Keyboard**: `Space` to toggle, `Tab` to navigate
- **Focus**: Visible focus ring
- **Labels**: Clickable label toggles checkbox

## Animation

The check icon animates in when checked:

```css
animate-in zoom-in-50 duration-150
```
