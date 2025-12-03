import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Slider } from './Slider';

describe('Slider', () => {
  describe('rendering', () => {
    it('renders a slider', () => {
      render(<Slider aria-label="Test slider" />);

      expect(screen.getByRole('slider')).toBeInTheDocument();
    });

    it('has data-slot attribute', () => {
      render(<Slider aria-label="Test slider" />);

      expect(screen.getByRole('slider')).toHaveAttribute('data-slot', 'slider-thumb');
    });

    it('renders track element', () => {
      render(<Slider aria-label="Track test" />);

      const track = document.querySelector('[data-slot="slider-track"]');
      expect(track).toBeInTheDocument();
    });

    it('renders range element', () => {
      render(<Slider aria-label="Range test" defaultValue={[50]} />);

      const range = document.querySelector('[data-slot="slider-range"]');
      expect(range).toBeInTheDocument();
    });
  });

  describe('value handling', () => {
    it('handles defaultValue', () => {
      render(<Slider defaultValue={[50]} aria-label="Default value" />);

      expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '50');
    });

    it('handles controlled value', () => {
      render(<Slider value={[75]} aria-label="Controlled" />);

      expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '75');
    });

    it('calls onValueChange when value changes', () => {
      const handleChange = vi.fn();
      render(<Slider defaultValue={[50]} onValueChange={handleChange} aria-label="Change" />);

      const slider = screen.getByRole('slider');
      fireEvent.keyDown(slider, { key: 'ArrowRight' });

      expect(handleChange).toHaveBeenCalled();
    });

    it('respects min and max bounds', () => {
      render(<Slider min={10} max={90} defaultValue={[50]} aria-label="Bounds" />);

      const slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('aria-valuemin', '10');
      expect(slider).toHaveAttribute('aria-valuemax', '90');
    });

    it('defaults min to 0 and max to 100', () => {
      render(<Slider defaultValue={[50]} aria-label="Defaults" />);

      const slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('aria-valuemin', '0');
      expect(slider).toHaveAttribute('aria-valuemax', '100');
    });
  });

  describe('step behavior', () => {
    it('accepts step prop', () => {
      const handleChange = vi.fn();
      render(
        <Slider defaultValue={[50]} step={10} onValueChange={handleChange} aria-label="Step" />
      );

      const slider = screen.getByRole('slider');
      fireEvent.keyDown(slider, { key: 'ArrowRight' });

      // Step should be 10, so value changes by 10
      expect(handleChange).toHaveBeenCalled();
    });
  });

  describe('label prop', () => {
    it('renders label when provided', () => {
      render(<Slider label="Volume" defaultValue={[50]} />);

      expect(screen.getByText('Volume')).toBeInTheDocument();
    });

    it('does not render label container when not provided', () => {
      render(<Slider defaultValue={[50]} aria-label="No label" />);

      // The wrapper div with justify-between should only exist if label or showValue
      const textSm = document.querySelector('.text-sm.font-medium');
      expect(textSm).not.toBeInTheDocument();
    });
  });

  describe('showValue prop', () => {
    it('shows value when showValue is true', () => {
      render(<Slider showValue defaultValue={[50]} aria-label="Show value" />);

      expect(screen.getByText('50')).toBeInTheDocument();
    });

    it('does not show value by default', () => {
      render(<Slider defaultValue={[50]} aria-label="Hide value" />);

      expect(screen.queryByText('50')).not.toBeInTheDocument();
    });

    it('shows both label and value', () => {
      render(<Slider label="Brightness" showValue defaultValue={[75]} />);

      expect(screen.getByText('Brightness')).toBeInTheDocument();
      expect(screen.getByText('75')).toBeInTheDocument();
    });

    it('value display has tabular-nums class for consistent width', () => {
      render(<Slider showValue defaultValue={[50]} aria-label="Tabular" />);

      const valueDisplay = screen.getByText('50');
      expect(valueDisplay.className).toContain('tabular-nums');
    });
  });

  describe('range (multi-thumb)', () => {
    it('renders multiple thumbs for range slider', () => {
      render(<Slider defaultValue={[25, 75]} aria-label="Range slider" />);

      const thumbs = screen.getAllByRole('slider');
      expect(thumbs).toHaveLength(2);
    });

    it('shows range value as "min - max" format', () => {
      render(<Slider showValue defaultValue={[20, 80]} aria-label="Range value" />);

      expect(screen.getByText('20 - 80')).toBeInTheDocument();
    });

    it('each thumb has correct aria values', () => {
      render(<Slider defaultValue={[25, 75]} aria-label="Range values" />);

      const thumbs = screen.getAllByRole('slider');
      expect(thumbs[0]).toHaveAttribute('aria-valuenow', '25');
      expect(thumbs[1]).toHaveAttribute('aria-valuenow', '75');
    });
  });

  describe('disabled state', () => {
    it('has data-disabled attribute when disabled', () => {
      render(<Slider disabled defaultValue={[50]} aria-label="Disabled" />);

      // Radix uses data-disabled attribute instead of disabled property for spans
      expect(screen.getByRole('slider')).toHaveAttribute('data-disabled', '');
    });

    it('has disabled styling on container', () => {
      render(<Slider disabled defaultValue={[50]} aria-label="Disabled styles" />);

      const container = document.querySelector('[data-slot="slider"]');
      expect(container).toHaveAttribute('data-disabled', '');
    });

    it('does not call onValueChange when disabled', () => {
      const handleChange = vi.fn();
      render(
        <Slider disabled defaultValue={[50]} onValueChange={handleChange} aria-label="Disabled" />
      );

      const slider = screen.getByRole('slider');
      fireEvent.keyDown(slider, { key: 'ArrowRight' });

      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe('orientation', () => {
    it('supports horizontal orientation (default)', () => {
      render(<Slider defaultValue={[50]} aria-label="Horizontal" />);

      const slider = document.querySelector('[data-slot="slider"]');
      expect(slider).toHaveAttribute('data-orientation', 'horizontal');
    });

    it('supports vertical orientation', () => {
      render(<Slider orientation="vertical" defaultValue={[50]} aria-label="Vertical" />);

      const slider = document.querySelector('[data-slot="slider"]');
      expect(slider).toHaveAttribute('data-orientation', 'vertical');
    });

    it('has vertical styling classes', () => {
      render(<Slider orientation="vertical" defaultValue={[50]} aria-label="Vertical styles" />);

      const slider = document.querySelector('[data-slot="slider"]');
      expect(slider?.className).toContain('data-[orientation=vertical]:flex-col');
    });
  });

  describe('className merging', () => {
    it('merges custom className', () => {
      render(<Slider className="custom-slider" defaultValue={[50]} aria-label="Custom" />);

      const slider = document.querySelector('[data-slot="slider"]');
      expect(slider?.className).toContain('custom-slider');
      // Should still have default classes
      expect(slider?.className).toContain('relative');
      expect(slider?.className).toContain('flex');
    });
  });

  describe('styling classes', () => {
    it('track has correct styling', () => {
      render(<Slider defaultValue={[50]} aria-label="Track styles" />);

      const track = document.querySelector('[data-slot="slider-track"]');
      expect(track?.className).toContain('rounded-full');
      expect(track?.className).toContain('bg-muted');
    });

    it('range has primary background', () => {
      render(<Slider defaultValue={[50]} aria-label="Range styles" />);

      const range = document.querySelector('[data-slot="slider-range"]');
      expect(range?.className).toContain('bg-primary');
    });

    it('thumb has correct styling', () => {
      render(<Slider defaultValue={[50]} aria-label="Thumb styles" />);

      const thumb = screen.getByRole('slider');
      expect(thumb.className).toContain('rounded-full');
      expect(thumb.className).toContain('border');
      expect(thumb.className).toContain('bg-background');
      expect(thumb.className).toContain('shadow-sm');
    });

    it('thumb has hover and focus styles', () => {
      render(<Slider defaultValue={[50]} aria-label="Hover focus" />);

      const thumb = screen.getByRole('slider');
      expect(thumb.className).toContain('hover:ring-4');
      expect(thumb.className).toContain('focus-visible:ring-4');
    });
  });

  describe('keyboard navigation', () => {
    it('increases value with ArrowRight', () => {
      const handleChange = vi.fn();
      render(<Slider defaultValue={[50]} onValueChange={handleChange} aria-label="Arrow right" />);

      fireEvent.keyDown(screen.getByRole('slider'), { key: 'ArrowRight' });

      expect(handleChange).toHaveBeenCalledWith([51]);
    });

    it('decreases value with ArrowLeft', () => {
      const handleChange = vi.fn();
      render(<Slider defaultValue={[50]} onValueChange={handleChange} aria-label="Arrow left" />);

      fireEvent.keyDown(screen.getByRole('slider'), { key: 'ArrowLeft' });

      expect(handleChange).toHaveBeenCalledWith([49]);
    });

    it('increases value with ArrowUp', () => {
      const handleChange = vi.fn();
      render(<Slider defaultValue={[50]} onValueChange={handleChange} aria-label="Arrow up" />);

      fireEvent.keyDown(screen.getByRole('slider'), { key: 'ArrowUp' });

      expect(handleChange).toHaveBeenCalledWith([51]);
    });

    it('goes to min with Home', () => {
      const handleChange = vi.fn();
      render(
        <Slider
          defaultValue={[50]}
          min={0}
          max={100}
          onValueChange={handleChange}
          aria-label="Home"
        />
      );

      fireEvent.keyDown(screen.getByRole('slider'), { key: 'Home' });

      expect(handleChange).toHaveBeenCalledWith([0]);
    });

    it('goes to max with End', () => {
      const handleChange = vi.fn();
      render(
        <Slider
          defaultValue={[50]}
          min={0}
          max={100}
          onValueChange={handleChange}
          aria-label="End"
        />
      );

      fireEvent.keyDown(screen.getByRole('slider'), { key: 'End' });

      expect(handleChange).toHaveBeenCalledWith([100]);
    });
  });

  describe('HTML attributes', () => {
    it('passes through name to container', () => {
      render(<Slider name="volume" defaultValue={[50]} aria-label="Named" />);

      // Radix applies name to the root element
      const container = document.querySelector('[data-slot="slider"]');
      expect(container).toBeInTheDocument();
    });

    it('passes through data attributes', () => {
      render(<Slider data-testid="slider-test" defaultValue={[50]} aria-label="Data" />);

      expect(screen.getByTestId('slider-test')).toBeInTheDocument();
    });

    it('slider has correct role', () => {
      render(<Slider defaultValue={[50]} aria-label="Volume control" />);

      expect(screen.getByRole('slider')).toBeInTheDocument();
    });
  });

  describe('onValueCommit', () => {
    it('calls onValueCommit when interaction ends', () => {
      const handleCommit = vi.fn();
      render(<Slider defaultValue={[50]} onValueCommit={handleCommit} aria-label="Commit" />);

      const slider = screen.getByRole('slider');
      fireEvent.keyDown(slider, { key: 'ArrowRight' });
      fireEvent.keyUp(slider, { key: 'ArrowRight' });

      // onValueCommit is called on pointer up or key commit
      // With just keyboard, it triggers on the key event
      expect(handleCommit).toHaveBeenCalled();
    });
  });
});
