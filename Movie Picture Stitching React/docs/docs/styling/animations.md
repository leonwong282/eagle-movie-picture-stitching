---
sidebar_position: 4
title: Animations
description: Motion and transition patterns
---

# Animations

The template includes pre-configured animations using Tailwind CSS and the `tailwindcss-animate` plugin.

## Animation Classes

### Built-in Animations

| Class | Effect | Duration |
|-------|--------|----------|
| `animate-fade-in` | Fade from 0 to 1 opacity | 200ms |
| `animate-fade-out` | Fade from 1 to 0 opacity | 200ms |
| `animate-slide-up` | Slide up with fade | 300ms |
| `animate-slide-down` | Slide down with fade | 300ms |
| `animate-scale-in` | Scale from 95% with fade | 200ms |
| `animate-spin` | Continuous rotation | 1s |
| `animate-pulse` | Gentle pulse effect | 2s |
| `animate-bounce` | Bouncing effect | 1s |

### Usage

```tsx
// Fade in on mount
<div className="animate-fade-in">
  Content fades in
</div>

// Slide up modal
<div className="animate-slide-up">
  Modal content
</div>

// Loading spinner
<div className="animate-spin">
  <Spinner />
</div>
```

## Keyframe Definitions

```css
/* src/styles/globals.css */

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fade-out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slide-down {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
```

## Tailwind Configuration

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'fade-out': {
          from: { opacity: '1' },
          to: { opacity: '0' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-down': {
          from: { opacity: '0', transform: 'translateY(-10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.2s ease-out',
        'fade-out': 'fade-out 0.2s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
        'slide-down': 'slide-down 0.3s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
```

## Transitions

### Transition Utilities

```tsx
// Color transitions (for hover states)
<button className="transition-colors duration-200 hover:bg-primary">

// All properties
<div className="transition-all duration-300">

// Transform only
<div className="transition-transform duration-200 hover:scale-105">

// Opacity
<div className="transition-opacity duration-150">

// Multiple with delay
<div className="transition-all duration-300 delay-100">
```

### Duration Scale

| Class | Duration |
|-------|----------|
| `duration-75` | 75ms |
| `duration-100` | 100ms |
| `duration-150` | 150ms |
| `duration-200` | 200ms |
| `duration-300` | 300ms |
| `duration-500` | 500ms |
| `duration-700` | 700ms |
| `duration-1000` | 1000ms |

### Easing Functions

| Class | Curve |
|-------|-------|
| `ease-linear` | Linear |
| `ease-in` | Slow start |
| `ease-out` | Slow end |
| `ease-in-out` | Slow start and end |

## Component Animation Patterns

### Animated Card

```tsx
function AnimatedCard({ children }: { children: React.ReactNode }) {
  return (
    <div className={cn(
      'bg-card rounded-lg p-4 shadow',
      'transition-all duration-200',
      'hover:shadow-lg hover:-translate-y-1'
    )}>
      {children}
    </div>
  );
}
```

### Fade In List Items

```tsx
function AnimatedList({ items }: { items: Item[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li
          key={item.id}
          className="animate-fade-in"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          {item.name}
        </li>
      ))}
    </ul>
  );
}
```

### Modal Animation

```tsx
function Modal({ open, onClose, children }: ModalProps) {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 animate-fade-in"
        onClick={onClose}
      />
      
      {/* Content */}
      <div className={cn(
        'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
        'bg-background rounded-lg p-6 shadow-lg',
        'animate-scale-in'
      )}>
        {children}
      </div>
    </div>
  );
}
```

### Skeleton Loading

```tsx
function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'bg-muted rounded animate-pulse',
        className
      )}
    />
  );
}

// Usage
<Skeleton className="h-4 w-32" />
<Skeleton className="h-24 w-full" />
```

### Shimmer Effect

```tsx
function ShimmerSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded bg-muted',
        className
      )}
    >
      <div
        className={cn(
          'absolute inset-0',
          'bg-gradient-to-r from-transparent via-white/20 to-transparent',
          'animate-shimmer'
        )}
        style={{
          backgroundSize: '200% 100%',
        }}
      />
    </div>
  );
}
```

## Loading States

### Spinner

```tsx
function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };
  
  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-current border-t-transparent',
        sizeClasses[size]
      )}
    />
  );
}
```

### Loading Button

```tsx
function LoadingButton({ 
  isLoading, 
  children, 
  ...props 
}: ButtonProps & { isLoading?: boolean }) {
  return (
    <Button {...props} disabled={isLoading}>
      {isLoading && (
        <Spinner size="sm" className="mr-2" />
      )}
      <span className={isLoading ? 'opacity-70' : ''}>
        {children}
      </span>
    </Button>
  );
}
```

## Enter/Exit Animations

Using a custom hook for mount/unmount animations:

```tsx
function useAnimatedMount(isVisible: boolean, duration = 200) {
  const [shouldRender, setShouldRender] = useState(isVisible);
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
      // Small delay to allow DOM update before animation
      requestAnimationFrame(() => setIsAnimating(true));
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setShouldRender(false), duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration]);
  
  return { shouldRender, isAnimating };
}

// Usage
function AnimatedPanel({ open }: { open: boolean }) {
  const { shouldRender, isAnimating } = useAnimatedMount(open);
  
  if (!shouldRender) return null;
  
  return (
    <div className={cn(
      'transition-all duration-200',
      isAnimating 
        ? 'opacity-100 translate-y-0' 
        : 'opacity-0 translate-y-2'
    )}>
      Panel content
    </div>
  );
}
```

## Reduced Motion

Respect user's motion preferences:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  ::before,
  ::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

```tsx
// Check in JavaScript
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

// Tailwind class
<div className="motion-safe:animate-bounce motion-reduce:animate-none">
```

## Animation Variants with CVA

```tsx
import { cva } from 'class-variance-authority';

const animatedBox = cva('rounded-lg p-4', {
  variants: {
    animate: {
      fade: 'animate-fade-in',
      slide: 'animate-slide-up',
      scale: 'animate-scale-in',
      none: '',
    },
  },
  defaultVariants: {
    animate: 'fade',
  },
});

function AnimatedBox({ animate, children }) {
  return (
    <div className={animatedBox({ animate })}>
      {children}
    </div>
  );
}
```

## Best Practices

### ✅ Do

```tsx
// Use consistent durations
className="transition-all duration-200"  // Fast interactions
className="transition-all duration-300"  // Standard animations

// Prefer transform/opacity (GPU accelerated)
className="hover:scale-105 hover:opacity-90"

// Add will-change for complex animations
className="will-change-transform"

// Respect reduced motion
className="motion-safe:animate-slide-up"
```

### ❌ Don't

```tsx
// Avoid animating expensive properties
className="transition-all"  // Don't use when only changing opacity

// Avoid very long animations
className="duration-[2000ms]"  // Too slow for UI

// Don't animate layout properties frequently
className="transition-[width,height]"  // Can cause layout thrashing

// Don't forget to disable on reduced motion
className="animate-bounce"  // Add motion-reduce:animate-none
```

## Related

- [Styling Overview](./overview) - Architecture overview
- [Design Tokens](./design-tokens) - Color and spacing
- [Dark Mode](./dark-mode) - Theme switching
