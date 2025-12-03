'use client';

import * as React from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';

import { cn } from '@/lib/utils';

interface CheckboxProps extends React.ComponentProps<typeof CheckboxPrimitive.Root> {
  /** Optional label displayed next to the checkbox */
  label?: string;
}

function Checkbox({ className, label, id, ...props }: CheckboxProps) {
  const generatedId = React.useId();
  const checkboxId = id || `checkbox-${generatedId}`;

  const checkboxElement = (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      id={checkboxId}
      className={cn(
        'peer size-5 shrink-0 rounded-[4px] border-2 border-input shadow-sm',
        'bg-background dark:bg-input/30',
        'transition-all duration-150 outline-none',
        'hover:border-primary/50',
        'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
        'data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:border-primary data-[state=checked]:shadow-md',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current animate-in zoom-in-50 duration-150"
      >
        <Check className="size-4 text-primary-foreground" strokeWidth={3} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );

  if (label) {
    return (
      <div className="flex items-center gap-2">
        {checkboxElement}
        <label
          htmlFor={checkboxId}
          className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
        </label>
      </div>
    );
  }

  return checkboxElement;
}

export { Checkbox };
export type { CheckboxProps };
