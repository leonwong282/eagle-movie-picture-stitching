---
sidebar_position: 5
title: Slider
description: Range slider with value display and label support
---

# Slider

A range slider component built on Radix UI Slider primitive, with optional label and value display.

## Import

```tsx
import { Slider } from '@/components';
import type { SliderProps } from '@/components';
```

## Basic Usage

```tsx
<Slider defaultValue={[50]} max={100} />
```

## Controlled Slider

```tsx
const [value, setValue] = useState([75]);

<Slider
  value={value}
  onValueChange={setValue}
  max={100}
/>
```

## With Label

```tsx
<Slider
  label="Quality"
  defaultValue={[80]}
  max={100}
/>
```

## With Value Display

Show the current value:

```tsx
<Slider
  label="Volume"
  showValue
  defaultValue={[50]}
  max={100}
/>
```

This displays the label on the left and value on the right.

## Range Slider

Use an array with two values for range selection:

```tsx
const [range, setRange] = useState([25, 75]);

<Slider
  label="Price Range"
  showValue
  value={range}
  onValueChange={setRange}
  max={100}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number[]` | — | Controlled value(s) |
| `defaultValue` | `number[]` | — | Default value(s) |
| `onValueChange` | `(value: number[]) => void` | — | Called when value changes |
| `min` | `number` | `0` | Minimum value |
| `max` | `number` | `100` | Maximum value |
| `step` | `number` | `1` | Step increment |
| `label` | `string` | — | Label text above slider |
| `showValue` | `boolean` | `false` | Show current value(s) |
| `disabled` | `boolean` | `false` | Disable the slider |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Slider orientation |
| `className` | `string` | — | Additional CSS classes |

Plus all Radix UI Slider props.

## Examples

### Quality Slider

```tsx
function QualitySlider() {
  const [quality, setQuality] = useState([80]);

  return (
    <div className="space-y-4">
      <Slider
        label="Export Quality"
        showValue
        value={quality}
        onValueChange={setQuality}
        min={10}
        max={100}
        step={5}
      />
      <p className="text-sm text-muted-foreground">
        {quality[0] < 50 ? 'Low quality, smaller file' :
         quality[0] < 80 ? 'Balanced quality and size' :
         'High quality, larger file'}
      </p>
    </div>
  );
}
```

### Image Resize Slider

```tsx
function ResizeSlider({ onResize }) {
  const [scale, setScale] = useState([100]);

  return (
    <Slider
      label="Scale"
      showValue
      value={scale}
      onValueChange={(v) => {
        setScale(v);
        onResize(v[0] / 100);
      }}
      min={10}
      max={200}
      step={10}
    />
  );
}
```

### Color Picker Sliders

```tsx
function RGBSliders() {
  const [r, setR] = useState([128]);
  const [g, setG] = useState([128]);
  const [b, setB] = useState([128]);

  return (
    <div className="space-y-4">
      <Slider
        label="Red"
        showValue
        value={r}
        onValueChange={setR}
        max={255}
        className="[&_[data-slot=slider-range]]:bg-red-500"
      />
      <Slider
        label="Green"
        showValue
        value={g}
        onValueChange={setG}
        max={255}
        className="[&_[data-slot=slider-range]]:bg-green-500"
      />
      <Slider
        label="Blue"
        showValue
        value={b}
        onValueChange={setB}
        max={255}
        className="[&_[data-slot=slider-range]]:bg-blue-500"
      />
      <div 
        className="h-16 rounded-lg"
        style={{ backgroundColor: `rgb(${r[0]}, ${g[0]}, ${b[0]})` }}
      />
    </div>
  );
}
```

### With Marks

```tsx
function SliderWithMarks() {
  const marks = [0, 25, 50, 75, 100];
  
  return (
    <div className="space-y-2">
      <Slider defaultValue={[50]} max={100} step={25} />
      <div className="flex justify-between text-xs text-muted-foreground">
        {marks.map(mark => (
          <span key={mark}>{mark}%</span>
        ))}
      </div>
    </div>
  );
}
```

### Form Integration

```tsx
import { Controller, useForm } from 'react-hook-form';

function SettingsForm() {
  const { control, handleSubmit } = useForm({
    defaultValues: { quality: [80] }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="quality"
        control={control}
        render={({ field }) => (
          <Slider
            label="Quality"
            showValue
            value={field.value}
            onValueChange={field.onChange}
            max={100}
          />
        )}
      />
      <Button type="submit" className="mt-4">Save</Button>
    </form>
  );
}
```

## Styling

### Track
The track is the full slider background:
```css
bg-muted rounded-full h-2
```

### Range
The filled portion:
```css
bg-primary
```

### Thumb
The draggable handle:
```css
size-4 rounded-full bg-background border-primary/50 shadow-sm
```

### Custom Colors

```tsx
// Green slider
<Slider 
  className="[&_[data-slot=slider-range]]:bg-green-500"
  defaultValue={[50]}
/>

// Larger thumb
<Slider
  className="[&_[data-slot=slider-thumb]]:size-6"
  defaultValue={[50]}
/>
```

## Keyboard Navigation

| Key | Action |
|-----|--------|
| `→` / `↑` | Increase by step |
| `←` / `↓` | Decrease by step |
| `Home` | Set to minimum |
| `End` | Set to maximum |
| `Page Up` | Increase by 10% |
| `Page Down` | Decrease by 10% |

## Accessibility

- **ARIA**: `role="slider"` with `aria-valuemin`, `aria-valuemax`, `aria-valuenow`
- **Keyboard**: Full keyboard navigation support
- **Focus**: Visible focus ring on thumb
- **Labels**: Use `label` prop or associate with `<Label>`

## Vertical Orientation

```tsx
<div className="h-48">
  <Slider
    orientation="vertical"
    defaultValue={[50]}
    max={100}
  />
</div>
```

Note: Vertical sliders need a height constraint on the container.
