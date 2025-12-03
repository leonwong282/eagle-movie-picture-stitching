---
sidebar_position: 2
title: Design Tokens
description: CSS variables and semantic color system
---

# Design Tokens

Design tokens are the visual design atoms of the design system — specifically, they are named entities that store visual design attributes using CSS variables.

## Token Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Design Token Layers                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                   Semantic Tokens                         │   │
│  │  background, foreground, primary, secondary, muted       │   │
│  └────────────────────────┬─────────────────────────────────┘   │
│                           │ Reference                           │
│  ┌────────────────────────▼─────────────────────────────────┐   │
│  │                    HSL Values                             │   │
│  │  --primary: 221.2 83.2% 53.3%                            │   │
│  └────────────────────────┬─────────────────────────────────┘   │
│                           │ Used by                             │
│  ┌────────────────────────▼─────────────────────────────────┐   │
│  │                  Tailwind Config                          │   │
│  │  primary: 'hsl(var(--primary))'                          │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Color Tokens

### Core Colors

Defined in `src/styles/globals.css`:

```css
:root {
  /* Backgrounds */
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;

  /* Card/Panel backgrounds */
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;

  /* Popovers/Dropdowns */
  --popover: 0 0% 100%;
  --popover-foreground: 222.2 84% 4.9%;

  /* Primary action color */
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;

  /* Secondary/subtle actions */
  --secondary: 210 40% 96.1%;
  --secondary-foreground: 222.2 47.4% 11.2%;

  /* Muted/disabled states */
  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;

  /* Accents/highlights */
  --accent: 210 40% 96.1%;
  --accent-foreground: 222.2 47.4% 11.2%;

  /* Destructive actions */
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;

  /* Borders and inputs */
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 221.2 83.2% 53.3%;
}
```

### Dark Mode Colors

```css
.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;

  --card: 222.2 84% 4.9%;
  --card-foreground: 210 40% 98%;

  --popover: 222.2 84% 4.9%;
  --popover-foreground: 210 40% 98%;

  --primary: 217.2 91.2% 59.8%;
  --primary-foreground: 222.2 47.4% 11.2%;

  --secondary: 217.2 32.6% 17.5%;
  --secondary-foreground: 210 40% 98%;

  --muted: 217.2 32.6% 17.5%;
  --muted-foreground: 215 20.2% 65.1%;

  --accent: 217.2 32.6% 17.5%;
  --accent-foreground: 210 40% 98%;

  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 210 40% 98%;

  --border: 217.2 32.6% 17.5%;
  --input: 217.2 32.6% 17.5%;
  --ring: 224.3 76.3% 48%;
}
```

## HSL Format

Tokens use HSL values without the `hsl()` wrapper for flexibility:

```css
/* Token definition */
--primary: 221.2 83.2% 53.3%;

/* Usage with opacity */
background: hsl(var(--primary));           /* Full opacity */
background: hsl(var(--primary) / 0.5);     /* 50% opacity */
```

This allows Tailwind's opacity modifiers:

```tsx
// Full opacity
<div className="bg-primary">

// With opacity modifier
<div className="bg-primary/50">
<div className="bg-primary/10">
```

## Tailwind Integration

### Configuration

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
    },
  },
};
```

### Usage in Components

```tsx
// Background colors
<div className="bg-background">        {/* Main background */}
<div className="bg-card">              {/* Card background */}
<div className="bg-popover">           {/* Popover background */}
<div className="bg-muted">             {/* Muted/disabled background */}

// Text colors
<p className="text-foreground">        {/* Main text */}
<p className="text-muted-foreground">  {/* Secondary text */}
<p className="text-primary">           {/* Primary color text */}

// Border colors
<div className="border-border">        {/* Default border */}
<input className="border-input">       {/* Input border */}

// Interactive states
<button className="bg-primary text-primary-foreground">
<button className="bg-secondary text-secondary-foreground">
<button className="bg-destructive text-destructive-foreground">
```

## Spacing Tokens

Using Tailwind's default spacing scale:

| Token | Value | Usage |
|-------|-------|-------|
| `0` | 0px | Reset |
| `0.5` | 2px | Tiny gap |
| `1` | 4px | Small gap |
| `2` | 8px | Default gap |
| `3` | 12px | Medium gap |
| `4` | 16px | Large gap |
| `6` | 24px | Section spacing |
| `8` | 32px | Major spacing |

```tsx
// Padding
<div className="p-4">      {/* 16px all sides */}
<div className="px-4 py-2"> {/* 16px horizontal, 8px vertical */}

// Margin
<div className="mt-6">     {/* 24px top margin */}
<div className="mb-4">     {/* 16px bottom margin */}

// Gap (flexbox/grid)
<div className="gap-2">    {/* 8px gap */}
<div className="gap-4">    {/* 16px gap */}
```

## Border Radius Tokens

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
};
```

```css
:root {
  --radius: 0.5rem;
}
```

```tsx
<div className="rounded-sm">   {/* 4px */}
<div className="rounded-md">   {/* 6px */}
<div className="rounded-lg">   {/* 8px */}
```

## Shadow Tokens

```css
:root {
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
}
```

```tsx
<div className="shadow-sm">    {/* Subtle shadow */}
<div className="shadow">       {/* Default shadow */}
<div className="shadow-md">    {/* Medium shadow */}
<div className="shadow-lg">    {/* Large shadow */}
```

## Custom Tokens

### Adding New Tokens

1. Define in CSS:
```css
:root {
  --success: 142.1 76.2% 36.3%;
  --success-foreground: 355.7 100% 97.3%;
  
  --warning: 45.4 93.4% 47.5%;
  --warning-foreground: 26 83.3% 14.1%;
}

.dark {
  --success: 142.1 70.6% 45.3%;
  --warning: 48 96.5% 53%;
}
```

2. Add to Tailwind config:
```js
colors: {
  success: {
    DEFAULT: 'hsl(var(--success))',
    foreground: 'hsl(var(--success-foreground))',
  },
  warning: {
    DEFAULT: 'hsl(var(--warning))',
    foreground: 'hsl(var(--warning-foreground))',
  },
}
```

3. Use in components:
```tsx
<div className="bg-success text-success-foreground">
  Success message
</div>
```

## Token Reference

### Semantic Color Mapping

| Token | Light Mode | Dark Mode | Usage |
|-------|------------|-----------|-------|
| `background` | White | Near-black | Page background |
| `foreground` | Near-black | White | Primary text |
| `card` | White | Near-black | Card backgrounds |
| `primary` | Blue | Light blue | Primary actions |
| `secondary` | Light gray | Dark gray | Secondary actions |
| `muted` | Light gray | Dark gray | Disabled states |
| `accent` | Light gray | Dark gray | Highlights |
| `destructive` | Red | Dark red | Delete actions |
| `border` | Light gray | Dark gray | Borders |

## Best Practices

### ✅ Do

```tsx
// Use semantic tokens
<div className="bg-background text-foreground">
<button className="bg-primary text-primary-foreground">

// Use token with opacity when needed
<div className="bg-primary/10">

// Use consistent spacing
<div className="p-4 gap-4">
```

### ❌ Don't

```tsx
// Avoid hardcoded colors
<div style={{ backgroundColor: '#1a1a1a' }}>

// Avoid arbitrary values when tokens exist
<div className="bg-[#3b82f6]">

// Avoid mixing color systems
<div className="bg-blue-500">  {/* When primary is available */}
```

## Related

- [Styling Overview](./overview) - Styling architecture
- [Dark Mode](./dark-mode) - Theme switching
- [Animations](./animations) - Motion tokens
