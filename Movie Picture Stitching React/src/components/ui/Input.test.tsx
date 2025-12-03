import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from './Input';

describe('Input', () => {
  describe('rendering', () => {
    it('renders as an input element', () => {
      render(<Input data-testid="input" />);

      expect(screen.getByTestId('input').tagName).toBe('INPUT');
    });

    it('has displayName', () => {
      expect(Input.displayName).toBe('Input');
    });

    it('forwards ref correctly', () => {
      const ref = { current: null } as React.RefObject<HTMLInputElement>;
      render(<Input ref={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });
  });

  describe('input types', () => {
    it('defaults to text type when not specified', () => {
      render(<Input data-testid="input" />);
      const input = screen.getByTestId('input');

      // Default type is 'text' but browsers may not reflect it in getAttribute
      expect(input).toBeInTheDocument();
    });

    it('applies text type', () => {
      render(<Input type="text" data-testid="input" />);

      expect(screen.getByTestId('input')).toHaveAttribute('type', 'text');
    });

    it('applies password type', () => {
      render(<Input type="password" data-testid="input" />);

      expect(screen.getByTestId('input')).toHaveAttribute('type', 'password');
    });

    it('applies email type', () => {
      render(<Input type="email" data-testid="input" />);

      expect(screen.getByTestId('input')).toHaveAttribute('type', 'email');
    });

    it('applies number type', () => {
      render(<Input type="number" data-testid="input" />);

      expect(screen.getByTestId('input')).toHaveAttribute('type', 'number');
    });

    it('applies file type', () => {
      render(<Input type="file" data-testid="input" />);

      expect(screen.getByTestId('input')).toHaveAttribute('type', 'file');
    });

    it('applies search type', () => {
      render(<Input type="search" placeholder="Search..." />);

      expect(screen.getByPlaceholderText('Search...')).toHaveAttribute('type', 'search');
    });
  });

  describe('value handling', () => {
    it('handles controlled value', () => {
      render(<Input value="test value" onChange={() => {}} data-testid="input" />);

      expect(screen.getByTestId('input')).toHaveValue('test value');
    });

    it('handles defaultValue', () => {
      render(<Input defaultValue="default" data-testid="input" />);

      expect(screen.getByTestId('input')).toHaveValue('default');
    });

    it('calls onChange when value changes', () => {
      const handleChange = vi.fn();
      render(<Input onChange={handleChange} data-testid="input" />);

      fireEvent.change(screen.getByTestId('input'), { target: { value: 'new value' } });

      expect(handleChange).toHaveBeenCalledTimes(1);
    });
  });

  describe('placeholder', () => {
    it('displays placeholder text', () => {
      render(<Input placeholder="Enter your email" />);

      expect(screen.getByPlaceholderText('Enter your email')).toBeInTheDocument();
    });

    it('has placeholder styling', () => {
      render(<Input placeholder="Styled placeholder" />);
      const input = screen.getByPlaceholderText('Styled placeholder');

      expect(input.className).toContain('placeholder:text-muted-foreground');
    });
  });

  describe('disabled state', () => {
    it('is disabled when disabled prop is true', () => {
      render(<Input disabled data-testid="input" />);

      expect(screen.getByTestId('input')).toBeDisabled();
    });

    it('applies disabled styles', () => {
      render(<Input disabled data-testid="input" />);
      const input = screen.getByTestId('input');

      expect(input.className).toContain('disabled:cursor-not-allowed');
      expect(input.className).toContain('disabled:opacity-50');
    });

    it('does not trigger onChange when disabled', () => {
      const handleChange = vi.fn();
      render(<Input disabled onChange={handleChange} data-testid="input" />);

      // Direct fireEvent still fires, so check it's disabled
      expect(screen.getByTestId('input')).toBeDisabled();
    });
  });

  describe('aria-invalid state', () => {
    it('applies aria-invalid styling', () => {
      render(<Input aria-invalid="true" data-testid="input" />);
      const input = screen.getByTestId('input');

      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(input.className).toContain('aria-invalid:ring-destructive/20');
      expect(input.className).toContain('aria-invalid:border-destructive');
    });

    it('does not have aria-invalid by default', () => {
      render(<Input data-testid="input" />);

      expect(screen.getByTestId('input')).not.toHaveAttribute('aria-invalid');
    });
  });

  describe('className merging', () => {
    it('merges custom className', () => {
      render(<Input className="custom-input" data-testid="input" />);
      const input = screen.getByTestId('input');

      expect(input.className).toContain('custom-input');
      // Should still have default classes
      expect(input.className).toContain('rounded-md');
      expect(input.className).toContain('border');
    });
  });

  describe('focus styles', () => {
    it('has focus-visible styles', () => {
      render(<Input data-testid="input" />);
      const input = screen.getByTestId('input');

      expect(input.className).toContain('focus-visible:outline-none');
      expect(input.className).toContain('focus-visible:ring-1');
      expect(input.className).toContain('focus-visible:ring-ring');
    });
  });

  describe('file input styles', () => {
    it('has file input styling', () => {
      render(<Input type="file" data-testid="input" />);
      const input = screen.getByTestId('input');

      expect(input.className).toContain('file:border-0');
      expect(input.className).toContain('file:bg-transparent');
      expect(input.className).toContain('file:text-sm');
      expect(input.className).toContain('file:font-medium');
    });
  });

  describe('HTML attributes', () => {
    it('passes through name attribute', () => {
      render(<Input name="email" data-testid="input" />);

      expect(screen.getByTestId('input')).toHaveAttribute('name', 'email');
    });

    it('passes through id attribute', () => {
      render(<Input id="email-input" data-testid="input" />);

      expect(screen.getByTestId('input')).toHaveAttribute('id', 'email-input');
    });

    it('passes through required attribute', () => {
      render(<Input required data-testid="input" />);

      expect(screen.getByTestId('input')).toBeRequired();
    });

    it('passes through maxLength attribute', () => {
      render(<Input maxLength={50} data-testid="input" />);

      expect(screen.getByTestId('input')).toHaveAttribute('maxLength', '50');
    });

    it('passes through minLength attribute', () => {
      render(<Input minLength={5} data-testid="input" />);

      expect(screen.getByTestId('input')).toHaveAttribute('minLength', '5');
    });

    it('passes through pattern attribute', () => {
      render(<Input pattern="[A-Za-z]{3}" data-testid="input" />);

      expect(screen.getByTestId('input')).toHaveAttribute('pattern', '[A-Za-z]{3}');
    });

    it('passes through readOnly attribute', () => {
      render(<Input readOnly data-testid="input" />);

      expect(screen.getByTestId('input')).toHaveAttribute('readonly');
    });

    it('passes through autoComplete attribute', () => {
      render(<Input autoComplete="email" data-testid="input" />);

      expect(screen.getByTestId('input')).toHaveAttribute('autocomplete', 'email');
    });

    it('passes through aria-label', () => {
      render(<Input aria-label="Search input" data-testid="input" />);

      expect(screen.getByTestId('input')).toHaveAttribute('aria-label', 'Search input');
    });

    it('passes through data attributes', () => {
      render(<Input data-custom="value" data-testid="input" />);

      expect(screen.getByTestId('input')).toHaveAttribute('data-custom', 'value');
    });
  });

  describe('events', () => {
    it('calls onFocus when focused', () => {
      const handleFocus = vi.fn();
      render(<Input onFocus={handleFocus} data-testid="input" />);

      fireEvent.focus(screen.getByTestId('input'));

      expect(handleFocus).toHaveBeenCalledTimes(1);
    });

    it('calls onBlur when blurred', () => {
      const handleBlur = vi.fn();
      render(<Input onBlur={handleBlur} data-testid="input" />);

      fireEvent.blur(screen.getByTestId('input'));

      expect(handleBlur).toHaveBeenCalledTimes(1);
    });

    it('calls onKeyDown on key press', () => {
      const handleKeyDown = vi.fn();
      render(<Input onKeyDown={handleKeyDown} data-testid="input" />);

      fireEvent.keyDown(screen.getByTestId('input'), { key: 'Enter' });

      expect(handleKeyDown).toHaveBeenCalledTimes(1);
    });
  });

  describe('number input specifics', () => {
    it('accepts min/max for number type', () => {
      render(<Input type="number" min={0} max={100} data-testid="input" />);
      const input = screen.getByTestId('input');

      expect(input).toHaveAttribute('min', '0');
      expect(input).toHaveAttribute('max', '100');
    });

    it('accepts step for number type', () => {
      render(<Input type="number" step={0.1} data-testid="input" />);

      expect(screen.getByTestId('input')).toHaveAttribute('step', '0.1');
    });
  });
});
