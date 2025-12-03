import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  describe('rendering', () => {
    it('renders a checkbox button', () => {
      render(<Checkbox aria-label="Test checkbox" />);

      expect(screen.getByRole('checkbox')).toBeInTheDocument();
    });

    it('has data-slot attribute', () => {
      render(<Checkbox aria-label="Test checkbox" />);

      expect(screen.getByRole('checkbox')).toHaveAttribute('data-slot', 'checkbox');
    });

    it('renders without label by default', () => {
      render(<Checkbox aria-label="Test" />);

      expect(screen.queryByRole('label')).not.toBeInTheDocument();
    });
  });

  describe('label prop', () => {
    it('renders with label when provided', () => {
      render(<Checkbox label="Accept terms" />);

      expect(screen.getByText('Accept terms')).toBeInTheDocument();
    });

    it('associates label with checkbox via generated id', () => {
      render(<Checkbox label="Subscribe" />);

      const checkbox = screen.getByRole('checkbox');
      const label = screen.getByText('Subscribe');

      expect(checkbox.id).toBeTruthy();
      expect(label).toHaveAttribute('for', checkbox.id);
    });

    it('uses provided id for label association', () => {
      render(<Checkbox id="my-checkbox" label="Custom ID" />);

      const checkbox = screen.getByRole('checkbox');
      const label = screen.getByText('Custom ID');

      expect(checkbox).toHaveAttribute('id', 'my-checkbox');
      expect(label).toHaveAttribute('for', 'my-checkbox');
    });

    it('clicking label toggles checkbox', () => {
      const handleChange = vi.fn();
      render(<Checkbox label="Toggle me" onCheckedChange={handleChange} />);

      fireEvent.click(screen.getByText('Toggle me'));

      expect(handleChange).toHaveBeenCalled();
    });
  });

  describe('checked state', () => {
    it('is unchecked by default', () => {
      render(<Checkbox aria-label="Test" />);

      expect(screen.getByRole('checkbox')).not.toBeChecked();
      expect(screen.getByRole('checkbox')).toHaveAttribute('data-state', 'unchecked');
    });

    it('can be controlled as checked', () => {
      render(<Checkbox checked aria-label="Checked" />);

      expect(screen.getByRole('checkbox')).toBeChecked();
      expect(screen.getByRole('checkbox')).toHaveAttribute('data-state', 'checked');
    });

    it('supports defaultChecked', () => {
      render(<Checkbox defaultChecked aria-label="Default checked" />);

      expect(screen.getByRole('checkbox')).toBeChecked();
    });

    it('calls onCheckedChange when toggled', () => {
      const handleChange = vi.fn();
      render(<Checkbox onCheckedChange={handleChange} aria-label="Toggle" />);

      fireEvent.click(screen.getByRole('checkbox'));

      expect(handleChange).toHaveBeenCalledWith(true);
    });

    it('toggles state when clicked (uncontrolled)', () => {
      render(<Checkbox defaultChecked={false} aria-label="Uncontrolled" />);
      const checkbox = screen.getByRole('checkbox');

      expect(checkbox).toHaveAttribute('data-state', 'unchecked');

      fireEvent.click(checkbox);

      expect(checkbox).toHaveAttribute('data-state', 'checked');
    });
  });

  describe('disabled state', () => {
    it('is disabled when disabled prop is true', () => {
      render(<Checkbox disabled aria-label="Disabled" />);

      expect(screen.getByRole('checkbox')).toBeDisabled();
    });

    it('applies disabled styles', () => {
      render(<Checkbox disabled aria-label="Disabled" />);
      const checkbox = screen.getByRole('checkbox');

      expect(checkbox.className).toContain('disabled:cursor-not-allowed');
      expect(checkbox.className).toContain('disabled:opacity-50');
    });

    it('does not call onCheckedChange when disabled', () => {
      const handleChange = vi.fn();
      render(<Checkbox disabled onCheckedChange={handleChange} aria-label="Disabled" />);

      fireEvent.click(screen.getByRole('checkbox'));

      expect(handleChange).not.toHaveBeenCalled();
    });

    it('label has peer-disabled styling when checkbox is disabled', () => {
      render(<Checkbox disabled label="Disabled label" />);
      const label = screen.getByText('Disabled label');

      expect(label.className).toContain('peer-disabled:cursor-not-allowed');
      expect(label.className).toContain('peer-disabled:opacity-70');
    });
  });

  describe('aria-invalid state', () => {
    it('applies aria-invalid styling', () => {
      render(<Checkbox aria-invalid="true" aria-label="Invalid" />);
      const checkbox = screen.getByRole('checkbox');

      expect(checkbox).toHaveAttribute('aria-invalid', 'true');
      expect(checkbox.className).toContain('aria-invalid:ring-destructive/20');
      expect(checkbox.className).toContain('aria-invalid:border-destructive');
    });
  });

  describe('className merging', () => {
    it('merges custom className', () => {
      render(<Checkbox className="custom-checkbox" aria-label="Custom" />);
      const checkbox = screen.getByRole('checkbox');

      expect(checkbox.className).toContain('custom-checkbox');
      // Should still have default classes
      expect(checkbox.className).toContain('rounded-[4px]');
      expect(checkbox.className).toContain('border-2');
    });
  });

  describe('styling classes', () => {
    it('has size classes', () => {
      render(<Checkbox aria-label="Size test" />);
      const checkbox = screen.getByRole('checkbox');

      expect(checkbox.className).toContain('size-5');
    });

    it('has hover styles', () => {
      render(<Checkbox aria-label="Hover" />);
      const checkbox = screen.getByRole('checkbox');

      expect(checkbox.className).toContain('hover:border-primary/50');
    });

    it('has focus-visible styles', () => {
      render(<Checkbox aria-label="Focus" />);
      const checkbox = screen.getByRole('checkbox');

      expect(checkbox.className).toContain('focus-visible:border-ring');
      expect(checkbox.className).toContain('focus-visible:ring-[3px]');
    });

    it('has checked state styles', () => {
      render(<Checkbox checked aria-label="Checked styles" />);
      const checkbox = screen.getByRole('checkbox');

      expect(checkbox.className).toContain('data-[state=checked]:bg-primary');
      expect(checkbox.className).toContain('data-[state=checked]:text-primary-foreground');
    });
  });

  describe('indicator', () => {
    it('shows check indicator when checked', () => {
      render(<Checkbox checked aria-label="Checked" />);

      // The indicator contains an SVG check icon
      const checkbox = screen.getByRole('checkbox');
      const indicator = checkbox.querySelector('[data-slot="checkbox-indicator"]');

      expect(indicator).toBeInTheDocument();
    });

    it('indicator has animation classes', () => {
      render(<Checkbox checked aria-label="Animated" />);
      const checkbox = screen.getByRole('checkbox');
      const indicator = checkbox.querySelector('[data-slot="checkbox-indicator"]');

      expect(indicator?.className).toContain('animate-in');
      expect(indicator?.className).toContain('zoom-in-50');
    });
  });

  describe('HTML attributes', () => {
    it('accepts name attribute for form integration', () => {
      render(<Checkbox name="agreement" checked aria-label="Agreement" />);

      // Radix Checkbox accepts name prop for form submission
      // The actual form submission behavior requires real browser context
      // Here we just verify the checkbox renders correctly with the name prop
      const checkbox = screen.getByRole('checkbox');
      expect(checkbox).toBeInTheDocument();
      expect(checkbox).toBeChecked();
    });

    it('passes through value attribute', () => {
      render(<Checkbox value="yes" aria-label="Value" />);

      expect(screen.getByRole('checkbox')).toHaveAttribute('value', 'yes');
    });

    it('passes through required attribute', () => {
      render(<Checkbox required aria-label="Required" />);

      expect(screen.getByRole('checkbox')).toBeRequired();
    });

    it('passes through data attributes', () => {
      render(<Checkbox data-testid="custom-checkbox" aria-label="Data" />);

      expect(screen.getByTestId('custom-checkbox')).toBeInTheDocument();
    });
  });

  describe('indeterminate state', () => {
    it('supports indeterminate state', () => {
      render(<Checkbox checked="indeterminate" aria-label="Indeterminate" />);

      expect(screen.getByRole('checkbox')).toHaveAttribute('data-state', 'indeterminate');
    });
  });

  describe('form integration', () => {
    it('works within a form', () => {
      const handleSubmit = vi.fn((e) => e.preventDefault());
      render(
        <form onSubmit={handleSubmit}>
          <Checkbox name="terms" label="Accept terms" />
          <button type="submit">Submit</button>
        </form>
      );

      fireEvent.click(screen.getByText('Accept terms'));
      fireEvent.click(screen.getByText('Submit'));

      expect(handleSubmit).toHaveBeenCalled();
    });
  });
});
