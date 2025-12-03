import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Button variants using shadcn/ui pattern with CVA
 * Based on shadcn/ui v4 button implementation
 */
const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*="size-"])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90',
        // Alias for default - commonly used name
        primary: 'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90',
        destructive:
          'bg-destructive text-white shadow-sm hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40',
        outline:
          'border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        // Additional semantic variants for Eagle plugin compatibility
        success:
          'bg-success text-success-foreground shadow-sm hover:bg-success/90 focus-visible:ring-success/20',
        warning:
          'bg-warning text-warning-foreground shadow-sm hover:bg-warning/90 focus-visible:ring-warning/20',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        icon: 'size-9',
        'icon-sm': 'size-8',
        'icon-lg': 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  /**
   * When true, the button will render as a Slot component,
   * allowing the first child to receive the button props
   */
  asChild?: boolean;
  /**
   * Loading state - shows a spinner and disables the button
   */
  isLoading?: boolean;
}

/**
 * Button component based on shadcn/ui pattern
 *
 * Features:
 * - Uses Radix UI Slot for composition via `asChild` prop
 * - 8 variants: default, destructive, outline, secondary, ghost, link, success, warning
 * - 6 sizes: default, sm, lg, icon, icon-sm, icon-lg
 * - Loading state with spinner
 * - Full accessibility support
 *
 * @example
 * // Basic usage
 * <Button variant="default">Click me</Button>
 *
 * // As a link (composition pattern)
 * <Button asChild variant="link">
 *   <a href="/docs">Documentation</a>
 * </Button>
 *
 * // With loading state
 * <Button isLoading>Saving...</Button>
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, isLoading, disabled, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        data-slot="button"
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            {children}
          </>
        ) : (
          children
        )}
      </Comp>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
