# CSS Architecture Documentation

This project uses a modular CSS architecture that provides clear code organization and excellent maintainability.

## 📁 File Structure

```
css/
├── index.css              # Main stylesheet importing all modules
├── README.md              # Documentation (Chinese)
├── README_EN.md           # Documentation (English)
└── modules/               # CSS modules directory
    ├── variables.css      # CSS variables and design system
    ├── base.css          # Base reset styles
    ├── layout.css        # Layout and container styles
    ├── header.css        # Header navigation styles
    ├── forms.css         # Form control styles
    ├── buttons.css       # Button styles
    ├── components.css    # Component styles
    ├── scrollbar.css     # Scrollbar styling
    ├── animations.css    # Animation and transition effects
    └── responsive.css    # Responsive design
```

## 🎯 Module Functions

### variables.css
**Design System Core**
- 🎨 Color variables: Theme colors, background colors, text colors
- 📏 Size variables: Spacing, border radius, font sizes
- 🎭 Effect variables: Shadows, gradients, transition animations
- 🌓 Dark theme: GitHub-style dark design

### base.css
**Base Style Reset**
- 📱 Modern CSS reset
- 🔤 Font system setup
- 🎯 Selection state styling
- ♿ Accessibility foundations

### layout.css
**Layout Structure**
- 🏗️ Main container layout
- 🪟 Glass effect backgrounds
- 📦 Content area layout
- 🔄 Flexbox layout system

### header.css
**Header Navigation**
- 🧭 Navigation bar styles
- 🎨 Gradient text effects
- 🏷️ Brand identity design
- 📱 Responsive navigation

### forms.css
**Form Controls**
- 📝 Input field styles
- 🎯 Focus state animations
- ⚠️ Error state indicators
- 📊 Sliders and selectors

### buttons.css
**Button System**
- 🎨 Gradient button design
- 🖱️ Hover and active states
- 🔄 Loading state animations
- 📏 Multiple size variants

### components.css
**Independent Components**
- 📋 File list styles
- 🖼️ Preview area design
- 📄 Card component styles
- 🎯 Status indicators

### scrollbar.css
**Scrollbar Styling**
- 🎨 Custom scrollbar design
- 🌗 Theme-matching styles
- 📱 Cross-browser compatibility
- 🎯 Interactive state effects

### animations.css
**Animation System**
- 🔄 Page loading animations
- 📱 Interaction feedback animations
- 🎭 Transition effect library
- ⚡ Performance-optimized animations

### responsive.css
**Responsive Design**
- 📱 Mobile adaptation
- 💻 Desktop optimization
- 📐 Breakpoint system
- 🔄 Flexible layouts

## 🎨 Design System

### Color Scheme
```css
/* Primary colors */
--color-bg-primary: #0d1117      /* Main background */
--color-bg-secondary: #161b22    /* Secondary background */
--color-accent-primary: #238636  /* Primary theme color */
--color-accent-secondary: #1f6feb /* Secondary theme color */

/* Functional colors */
--color-success: #28a745         /* Success state */
--color-error: #dc3545           /* Error state */
--color-warning: #ffc107         /* Warning state */
--color-info: #17a2b8            /* Info state */
```

### Spacing System
```css
/* Spacing sizes */
--spacing-xs: 4px    /* Extra small spacing */
--spacing-sm: 8px    /* Small spacing */
--spacing-md: 12px   /* Medium spacing */
--spacing-lg: 16px   /* Large spacing */
--spacing-xl: 24px   /* Extra large spacing */
--spacing-2xl: 32px  /* Huge spacing */
```

### Animation System
```css
/* Transition animations */
--transition-fast: 0.15s cubic-bezier(0.4, 0, 0.2, 1)
--transition-normal: 0.25s cubic-bezier(0.4, 0, 0.2, 1)
--transition-slow: 0.4s cubic-bezier(0.4, 0, 0.2, 1)
```

## 🔧 Customization Guide

### Modify Theme Colors
```css
/* Modify in variables.css */
:root {
  --color-accent-primary: #your-color;
  --color-accent-secondary: #your-secondary-color;
}
```

### Adjust Spacing
```css
/* Modify in variables.css */
:root {
  --spacing-lg: 20px; /* Adjust main spacing */
}
```

### Add New Components
1. Add styles in the appropriate module file
2. Follow BEM naming conventions
3. Use CSS variables for consistency
4. Add necessary responsive adaptations

### Custom Animations
```css
/* Add in animations.css */
@keyframes your-animation {
  from { /* Start state */ }
  to { /* End state */ }
}

.your-element {
  animation: your-animation var(--transition-normal) ease-out;
}
```

## 📱 Responsive Breakpoints

```css
/* Mobile */
@media (max-width: 768px) { }

/* Tablet */
@media (min-width: 769px) and (max-width: 1024px) { }

/* Desktop */
@media (min-width: 1025px) { }
```

## 🎯 Best Practices

### 1. Use CSS Variables
```css
/* ✅ Good practice */
.button {
  background: var(--color-accent-primary);
  padding: var(--spacing-md);
}

/* ❌ Avoid hardcoding */
.button {
  background: #238636;
  padding: 12px;
}
```

### 2. Follow BEM Naming
```css
/* ✅ Good practice */
.form-control { }
.form-control__input { }
.form-control--error { }

/* ❌ Avoid deep nesting */
.form .control .input.error { }
```

### 3. Modular Organization
```css
/* ✅ Group related functionality */
/* forms.css */
.form-control { }
.form-input { }
.form-button { }

/* ❌ Avoid mixing different functions */
```

### 4. Performance Optimization
```css
/* ✅ Use transform instead of layout changes */
.animate {
  transform: translateY(10px);
  transition: transform var(--transition-normal);
}

/* ❌ Avoid animating layout properties */
.animate {
  top: 10px;
  transition: top var(--transition-normal);
}
```

## 🔄 Maintenance Guide

### Adding New Features
1. Determine which module the feature belongs to
2. Add styles in the corresponding module file
3. Update related documentation
4. Test responsive effects

### Refactoring Existing Styles
1. Backup original styles
2. Refactor gradually while maintaining functionality
3. Test all states and breakpoints
4. Update documentation

### Performance Monitoring
1. Regularly check CSS file sizes
2. Remove unused styles
3. Optimize selector performance
4. Monitor animation performance

---

**Note**: When modifying CSS, please maintain modular principles to ensure style maintainability and consistency.
