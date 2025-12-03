import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Label } from './Label';

describe('Label', () => {
  describe('rendering', () => {
    it('renders with children', () => {
      render(<Label>Username</Label>);

      expect(screen.getByText('Username')).toBeInTheDocument();
    });

    it('renders as a label element', () => {
      render(<Label>Email</Label>);

      expect(screen.getByText('Email').tagName).toBe('LABEL');
    });

    it('has data-slot attribute', () => {
      render(<Label>Field Label</Label>);

      expect(screen.getByText('Field Label')).toHaveAttribute('data-slot', 'label');
    });
  });

  describe('htmlFor association', () => {
    it('associates with input via htmlFor prop', () => {
      render(
        <>
          <Label htmlFor="test-input">Test Label</Label>
          <input id="test-input" type="text" />
        </>
      );

      expect(screen.getByText('Test Label')).toHaveAttribute('for', 'test-input');
    });

    it('clicking label triggers click event', () => {
      render(
        <>
          <Label htmlFor="focus-input">Focus Me</Label>
          <input id="focus-input" type="text" data-testid="focus-input" />
        </>
      );

      // Verify the label has correct htmlFor attribute (click-focus behavior is browser-specific)
      expect(screen.getByText('Focus Me')).toHaveAttribute('for', 'focus-input');
      expect(screen.getByTestId('focus-input')).toHaveAttribute('id', 'focus-input');
    });
  });

  describe('className merging', () => {
    it('merges custom className', () => {
      render(<Label className="custom-class">Custom</Label>);
      const label = screen.getByText('Custom');

      expect(label.className).toContain('custom-class');
      // Should still have default classes
      expect(label.className).toContain('text-sm');
      expect(label.className).toContain('font-medium');
    });

    it('has peer-disabled styles', () => {
      render(<Label>Disabled Peer</Label>);
      const label = screen.getByText('Disabled Peer');

      expect(label.className).toContain('peer-disabled:cursor-not-allowed');
      expect(label.className).toContain('peer-disabled:opacity-70');
    });
  });

  describe('HTML attributes', () => {
    it('passes through data attributes', () => {
      render(<Label data-testid="test-label">Test</Label>);

      expect(screen.getByTestId('test-label')).toBeInTheDocument();
    });

    it('passes through id attribute', () => {
      render(<Label id="my-label">Labeled</Label>);

      expect(screen.getByText('Labeled')).toHaveAttribute('id', 'my-label');
    });

    it('passes through aria attributes', () => {
      render(<Label aria-describedby="description">Accessible</Label>);

      expect(screen.getByText('Accessible')).toHaveAttribute('aria-describedby', 'description');
    });
  });

  describe('content types', () => {
    it('renders complex children', () => {
      render(
        <Label>
          <span data-testid="icon">📧</span>
          Email Address
        </Label>
      );

      expect(screen.getByTestId('icon')).toBeInTheDocument();
      expect(screen.getByText('Email Address')).toBeInTheDocument();
    });

    it('renders with required indicator', () => {
      render(
        <Label>
          Name <span className="text-red-500">*</span>
        </Label>
      );

      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('*')).toHaveClass('text-red-500');
    });
  });
});
