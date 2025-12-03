# Contributing

Thank you for your interest in contributing to the Eagle React Template! This guide will help you get started.

## Code of Conduct

Please read our [Code of Conduct](../community/code-of-conduct) before contributing.

## Development Setup

### Prerequisites

- Node.js 18+
- npm or pnpm
- Eagle desktop app (for testing deployment)
- Git

### Getting Started

```bash
# Clone the repository
git clone https://github.com/your-org/eagle-react-template.git
cd eagle-react-template

# Install dependencies
npm install

# Start development server
npm run dev
```

### Development Commands

```bash
# Development
npm run dev          # Start dev server with HMR
npm run build        # Build for production
npm run preview      # Preview production build

# Testing
npm test             # Run unit tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Generate coverage report
npm run test:e2e     # Run E2E tests
npm run test:visual  # Run visual regression tests

# Code Quality
npm run typecheck    # TypeScript type checking
npm run lint         # ESLint
npm run lint:fix     # Fix lint errors

# Deployment
npm run deploy       # Deploy to Eagle plugins directory
```

## Project Structure

```
src/
├── components/      # React components
│   └── ui/          # UI component library
├── hooks/           # Custom React hooks
├── lib/             # Utility functions and Eagle API
├── stores/          # Zustand state management
├── templates/       # Layout templates
├── demos/           # Demo components
├── pages/           # Page components
├── styles/          # Global styles and tokens
├── test/            # Test utilities and mocks
└── types/           # TypeScript type definitions
```

## Coding Standards

### TypeScript

- Enable strict mode
- Prefer explicit types over `any`
- Use interfaces for object shapes
- Document complex types with JSDoc

```typescript
// ✅ Good
interface ButtonProps {
  /** Button visual style */
  variant?: 'default' | 'primary' | 'destructive';
  /** Click handler */
  onClick?: () => void;
}

// ❌ Avoid
const handleClick = (data: any) => { ... }
```

### React Components

- Use functional components with hooks
- Use CVA for component variants
- Export from barrel files

```typescript
// ✅ Good: CVA variant pattern
const buttonVariants = cva('base-classes', {
  variants: {
    variant: {
      default: 'default-classes',
      primary: 'primary-classes',
    },
  },
});

// ✅ Good: Proper typing
interface ComponentProps extends VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
}
```

### CSS/Tailwind

- Use Tailwind utilities
- Define design tokens in CSS variables
- Support dark mode with `dark:` prefix

```tsx
// ✅ Good
<button className="bg-primary text-white hover:bg-primary/90 dark:bg-primary-dark">

// ❌ Avoid inline styles
<button style={{ backgroundColor: '#238636' }}>
```

### Testing

- Co-locate tests with source files
- Test behavior, not implementation
- Use descriptive test names

```typescript
// ✅ Good
describe('Button', () => {
  it('calls onClick when clicked', () => { ... });
  it('disables interaction when disabled prop is true', () => { ... });
});

// ❌ Bad
it('works', () => { ... });
it('test1', () => { ... });
```

## Commit Guidelines

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation changes |
| `style` | Code style (formatting, no logic change) |
| `refactor` | Code refactoring |
| `perf` | Performance improvements |
| `test` | Adding or updating tests |
| `chore` | Maintenance tasks |

### Examples

```bash
feat(components): add Slider component
fix(hooks): resolve useEagleSelection memory leak
docs(api): update item operations documentation
test(Button): add accessibility tests
```

## Branch Naming

- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring

## Pull Request Process

### Before Submitting

- [ ] All tests pass (`npm test`)
- [ ] No TypeScript errors (`npm run typecheck`)
- [ ] No lint errors (`npm run lint`)
- [ ] Build succeeds (`npm run build`)
- [ ] Documentation updated if needed
- [ ] Changelog updated for significant changes

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] E2E tests added/updated
- [ ] Manual testing completed

## Screenshots (if applicable)
```

### Review Checklist

Reviewers will check:
- Code quality and style
- Test coverage
- Documentation
- Performance implications
- Breaking changes

## Adding Components

### Component Checklist

When adding new UI components:

1. **Create component file:** `src/components/ui/NewComponent.tsx`
2. **Add types:** Define props interface
3. **Use CVA:** For variant support
4. **Add tests:** `src/components/ui/NewComponent.test.tsx`
5. **Export:** Add to `src/components/ui/index.ts`
6. **Document:** Add to documentation

### Example Component

```typescript title="src/components/ui/Badge.tsx"
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground',
        secondary: 'bg-secondary text-secondary-foreground',
        destructive: 'bg-destructive text-destructive-foreground',
        outline: 'border border-input',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
```

## Adding Hooks

### Hook Checklist

1. **Create hook file:** `src/hooks/useNewHook.ts`
2. **Add tests:** `src/hooks/useNewHook.test.ts`
3. **Export:** Add to `src/hooks/index.ts`
4. **Document:** Usage and parameters

### Example Hook

```typescript title="src/hooks/useDebounce.ts"
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
```

## Reporting Issues

### Bug Reports

Include:
- Clear description
- Steps to reproduce
- Expected vs actual behavior
- Environment (OS, Node version, Eagle version)
- Screenshots/logs if applicable

### Feature Requests

Include:
- Problem statement
- Proposed solution
- Use cases
- Alternatives considered

## Getting Help

- Read the [documentation](../getting-started/introduction.md)
- Check existing [issues](https://github.com/your-org/eagle-react-template/issues)
- Ask in [discussions](https://github.com/your-org/eagle-react-template/discussions)

---

**Thank you for contributing! 🎉**
