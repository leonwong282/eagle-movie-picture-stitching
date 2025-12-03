import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button, buttonVariants } from './Button';

describe('Button', () => {
  describe('rendering', () => {
    it('renders with children', () => {
      render(<Button>Click me</Button>);

      expect(screen.getByRole('button')).toHaveTextContent('Click me');
    });

    it('renders as a button element', () => {
      render(<Button>Button</Button>);

      expect(screen.getByRole('button').tagName).toBe('BUTTON');
    });

    it('forwards ref correctly', () => {
      const ref = { current: null } as React.RefObject<HTMLButtonElement>;
      render(<Button ref={ref}>Ref Button</Button>);

      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });

    it('has displayName', () => {
      expect(Button.displayName).toBe('Button');
    });

    it('has data-slot attribute', () => {
      render(<Button>Slotted</Button>);

      expect(screen.getByRole('button')).toHaveAttribute('data-slot', 'button');
    });
  });

  describe('variants', () => {
    it('applies default variant', () => {
      render(<Button>Default</Button>);
      const button = screen.getByRole('button');

      expect(button.className).toContain('bg-primary');
      expect(button.className).toContain('text-primary-foreground');
    });

    it('applies primary variant (alias for default)', () => {
      render(<Button variant="primary">Primary</Button>);
      const button = screen.getByRole('button');

      expect(button.className).toContain('bg-primary');
      expect(button.className).toContain('text-primary-foreground');
    });

    it('applies destructive variant', () => {
      render(<Button variant="destructive">Delete</Button>);
      const button = screen.getByRole('button');

      expect(button.className).toContain('bg-destructive');
    });

    it('applies outline variant', () => {
      render(<Button variant="outline">Outline</Button>);
      const button = screen.getByRole('button');

      expect(button.className).toContain('border');
      expect(button.className).toContain('border-input');
      expect(button.className).toContain('bg-background');
    });

    it('applies secondary variant', () => {
      render(<Button variant="secondary">Secondary</Button>);
      const button = screen.getByRole('button');

      expect(button.className).toContain('bg-secondary');
      expect(button.className).toContain('text-secondary-foreground');
    });

    it('applies ghost variant', () => {
      render(<Button variant="ghost">Ghost</Button>);
      const button = screen.getByRole('button');

      expect(button.className).not.toContain('bg-primary');
      expect(button.className).toContain('hover:bg-accent');
    });

    it('applies link variant', () => {
      render(<Button variant="link">Link</Button>);
      const button = screen.getByRole('button');

      expect(button.className).toContain('underline-offset-4');
    });

    it('applies success variant', () => {
      render(<Button variant="success">Success</Button>);
      const button = screen.getByRole('button');

      expect(button.className).toContain('bg-success');
      expect(button.className).toContain('text-success-foreground');
    });

    it('applies warning variant', () => {
      render(<Button variant="warning">Warning</Button>);
      const button = screen.getByRole('button');

      expect(button.className).toContain('bg-warning');
      expect(button.className).toContain('text-warning-foreground');
    });
  });

  describe('sizes', () => {
    it('applies default size', () => {
      render(<Button>Default Size</Button>);
      const button = screen.getByRole('button');

      expect(button.className).toContain('h-9');
      expect(button.className).toContain('px-4');
    });

    it('applies small size', () => {
      render(<Button size="sm">Small</Button>);
      const button = screen.getByRole('button');

      expect(button.className).toContain('h-8');
    });

    it('applies large size', () => {
      render(<Button size="lg">Large</Button>);
      const button = screen.getByRole('button');

      expect(button.className).toContain('h-10');
      expect(button.className).toContain('px-6');
    });

    it('applies icon size', () => {
      render(<Button size="icon">🔍</Button>);
      const button = screen.getByRole('button');

      expect(button.className).toContain('size-9');
    });

    it('applies icon-sm size', () => {
      render(<Button size="icon-sm">🔍</Button>);
      const button = screen.getByRole('button');

      expect(button.className).toContain('size-8');
    });

    it('applies icon-lg size', () => {
      render(<Button size="icon-lg">🔍</Button>);
      const button = screen.getByRole('button');

      expect(button.className).toContain('size-10');
    });
  });

  describe('disabled state', () => {
    it('is disabled when disabled prop is true', () => {
      render(<Button disabled>Disabled</Button>);

      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('applies disabled styles', () => {
      render(<Button disabled>Disabled</Button>);
      const button = screen.getByRole('button');

      expect(button.className).toContain('disabled:pointer-events-none');
      expect(button.className).toContain('disabled:opacity-50');
    });
  });

  describe('loading state', () => {
    it('is disabled when loading', () => {
      render(<Button isLoading>Loading</Button>);

      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('shows loading spinner', () => {
      render(<Button isLoading>Loading</Button>);

      // Should have spinner SVG with animate-spin class
      const svg = screen.getByRole('button').querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg?.classList.contains('animate-spin')).toBe(true);
    });

    it('preserves children when loading', () => {
      render(<Button isLoading>Loading</Button>);

      expect(screen.getByRole('button')).toHaveTextContent('Loading');
    });
  });

  describe('asChild pattern (Radix Slot)', () => {
    it('renders as Slot when asChild is true', () => {
      render(
        <Button asChild variant="link">
          <a href="/test">Link Button</a>
        </Button>
      );

      const link = screen.getByRole('link');
      expect(link).toBeInTheDocument();
      expect(link.tagName).toBe('A');
      expect(link).toHaveTextContent('Link Button');
    });

    it('applies button styles to slotted element', () => {
      render(
        <Button asChild variant="outline">
          <a href="/test">Styled Link</a>
        </Button>
      );

      const link = screen.getByRole('link');
      expect(link.className).toContain('border');
      expect(link.className).toContain('inline-flex');
    });
  });

  describe('events', () => {
    it('calls onClick when clicked', () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Click</Button>);

      fireEvent.click(screen.getByRole('button'));

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('does not call onClick when disabled', () => {
      const handleClick = vi.fn();
      render(
        <Button onClick={handleClick} disabled>
          Click
        </Button>
      );

      fireEvent.click(screen.getByRole('button'));

      expect(handleClick).not.toHaveBeenCalled();
    });

    it('does not call onClick when loading', () => {
      const handleClick = vi.fn();
      render(
        <Button onClick={handleClick} isLoading>
          Click
        </Button>
      );

      fireEvent.click(screen.getByRole('button'));

      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('className merging', () => {
    it('merges custom className', () => {
      render(<Button className="custom-class">Custom</Button>);
      const button = screen.getByRole('button');

      expect(button.className).toContain('custom-class');
      // Should still have default classes
      expect(button.className).toContain('inline-flex');
    });
  });

  describe('HTML attributes', () => {
    it('passes through type attribute', () => {
      render(<Button type="submit">Submit</Button>);

      expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
    });

    it('passes through aria-label', () => {
      render(<Button aria-label="Close dialog">×</Button>);

      expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Close dialog');
    });

    it('passes through data attributes', () => {
      render(<Button data-testid="test-button">Test</Button>);

      expect(screen.getByTestId('test-button')).toBeInTheDocument();
    });
  });

  describe('icon children', () => {
    it('renders icon as child', () => {
      render(
        <Button>
          <span data-testid="icon">←</span>
          Back
        </Button>
      );

      expect(screen.getByTestId('icon')).toBeInTheDocument();
      expect(screen.getByRole('button')).toHaveTextContent('Back');
    });

    it('renders multiple children including icons', () => {
      render(
        <Button>
          <span data-testid="left-icon">←</span>
          Navigate
          <span data-testid="right-icon">→</span>
        </Button>
      );

      expect(screen.getByTestId('left-icon')).toBeInTheDocument();
      expect(screen.getByTestId('right-icon')).toBeInTheDocument();
    });
  });
});

describe('buttonVariants', () => {
  it('exports buttonVariants function', () => {
    expect(typeof buttonVariants).toBe('function');
  });

  it('generates class string for default variant', () => {
    const classes = buttonVariants();

    expect(classes).toContain('bg-primary');
    expect(classes).toContain('h-9');
  });

  it('generates class string for specific variant', () => {
    const classes = buttonVariants({ variant: 'destructive', size: 'lg' });

    expect(classes).toContain('bg-destructive');
    expect(classes).toContain('h-10');
  });

  it('generates class string with custom className', () => {
    const classes = buttonVariants({ className: 'custom-class' });

    expect(classes).toContain('custom-class');
    expect(classes).toContain('bg-primary');
  });
});
