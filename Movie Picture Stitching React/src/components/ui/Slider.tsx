'use client';

import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';

import { cn } from '@/lib/utils';

interface SliderProps extends React.ComponentProps<typeof SliderPrimitive.Root> {
  /** Optional label displayed above the slider */
  label?: string;
  /** Whether to show the current value */
  showValue?: boolean;
}

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  label,
  showValue = false,
  ...props
}: SliderProps) {
  // Compute display values for the slider
  const displayValues = React.useMemo(
    () => (Array.isArray(value) ? value : Array.isArray(defaultValue) ? defaultValue : [min]),
    [value, defaultValue, min]
  );

  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-2">
          {label && <span className="text-sm font-medium">{label}</span>}
          {showValue && (
            <span className="text-sm text-muted-foreground tabular-nums">
              {displayValues.join(' - ')}
            </span>
          )}
        </div>
      )}
      <SliderPrimitive.Root
        data-slot="slider"
        defaultValue={defaultValue}
        value={value}
        min={min}
        max={max}
        className={cn(
          'relative flex w-full touch-none select-none items-center',
          'data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed',
          'data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col',
          className
        )}
        {...props}
      >
        <SliderPrimitive.Track
          data-slot="slider-track"
          className={cn(
            'relative grow overflow-hidden rounded-full bg-muted',
            'data-[orientation=horizontal]:h-2 data-[orientation=horizontal]:w-full',
            'data-[orientation=vertical]:h-full data-[orientation=vertical]:w-2'
          )}
        >
          <SliderPrimitive.Range
            data-slot="slider-range"
            className={cn(
              'absolute bg-primary',
              'data-[orientation=horizontal]:h-full',
              'data-[orientation=vertical]:w-full'
            )}
          />
        </SliderPrimitive.Track>
        {Array.from({ length: displayValues.length }, (_, index) => (
          <SliderPrimitive.Thumb
            data-slot="slider-thumb"
            key={index}
            className={cn(
              'block size-4 shrink-0 rounded-full border border-primary/50 bg-background shadow-sm',
              'ring-ring/50 transition-[color,box-shadow]',
              'hover:ring-4 focus-visible:ring-4 focus-visible:outline-none',
              'disabled:pointer-events-none disabled:opacity-50'
            )}
          />
        ))}
      </SliderPrimitive.Root>
    </div>
  );
}

export { Slider };
export type { SliderProps };
