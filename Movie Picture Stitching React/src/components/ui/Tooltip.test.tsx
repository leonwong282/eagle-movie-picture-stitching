import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from './Tooltip';

/**
 * Tooltip Component Tests
 *
 * Note: Radix Tooltip renders content twice (visual + accessibility region).
 * Use getAllByText for content queries and getByRole('tooltip') for semantic queries.
 */
describe('Tooltip', () => {
  describe('rendering', () => {
    it('renders trigger element', () => {
      render(
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>Hover me</TooltipTrigger>
            <TooltipContent>Tooltip text</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );

      expect(screen.getByText('Hover me')).toBeInTheDocument();
    });

    it('does not render content by default', () => {
      render(
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>Hover me</TooltipTrigger>
            <TooltipContent>Tooltip text</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );

      expect(screen.queryByText('Tooltip text')).not.toBeInTheDocument();
    });

    it('trigger has data-state attribute', () => {
      render(
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger data-testid="trigger">Hover me</TooltipTrigger>
            <TooltipContent>Tooltip text</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );

      expect(screen.getByTestId('trigger')).toHaveAttribute('data-state', 'closed');
    });
  });

  describe('controlled state', () => {
    it('shows content when open is true', () => {
      render(
        <TooltipProvider>
          <Tooltip open>
            <TooltipTrigger>Hover me</TooltipTrigger>
            <TooltipContent>Tooltip text</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );

      // Radix renders tooltip content in multiple places
      expect(screen.getAllByText('Tooltip text').length).toBeGreaterThan(0);
    });

    it('hides content when open is false', () => {
      render(
        <TooltipProvider>
          <Tooltip open={false}>
            <TooltipTrigger>Hover me</TooltipTrigger>
            <TooltipContent>Tooltip text</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );

      expect(screen.queryByText('Tooltip text')).not.toBeInTheDocument();
    });

    it('supports defaultOpen', () => {
      render(
        <TooltipProvider>
          <Tooltip defaultOpen>
            <TooltipTrigger>Hover me</TooltipTrigger>
            <TooltipContent>Tooltip text</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );

      expect(screen.getAllByText('Tooltip text').length).toBeGreaterThan(0);
    });

    it('trigger has data-state when opened', () => {
      render(
        <TooltipProvider>
          <Tooltip defaultOpen>
            <TooltipTrigger data-testid="trigger">Hover me</TooltipTrigger>
            <TooltipContent>Tooltip text</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );

      const trigger = screen.getByTestId('trigger');
      expect(['delayed-open', 'instant-open']).toContain(trigger.getAttribute('data-state'));
    });
  });

  describe('asChild pattern', () => {
    it('supports asChild on trigger', () => {
      render(
        <TooltipProvider>
          <Tooltip open>
            <TooltipTrigger asChild>
              <button data-testid="custom-button">Custom button</button>
            </TooltipTrigger>
            <TooltipContent>Tooltip text</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );

      const button = screen.getByTestId('custom-button');
      expect(button.tagName).toBe('BUTTON');
      expect(button).toHaveAttribute('data-state');
    });

    it('renders trigger as button by default', () => {
      render(
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger data-testid="trigger">Hover me</TooltipTrigger>
            <TooltipContent>Tooltip text</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );

      expect(screen.getByTestId('trigger').tagName).toBe('BUTTON');
    });
  });

  describe('positioning', () => {
    it('accepts sideOffset prop', () => {
      render(
        <TooltipProvider>
          <Tooltip open>
            <TooltipTrigger>Hover me</TooltipTrigger>
            <TooltipContent sideOffset={10}>Tooltip text</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );

      expect(screen.getAllByText('Tooltip text').length).toBeGreaterThan(0);
    });

    it('content has data-side attribute', () => {
      render(
        <TooltipProvider>
          <Tooltip open>
            <TooltipTrigger>Hover me</TooltipTrigger>
            <TooltipContent>Tooltip text</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );

      const content = document.querySelector('[data-side]');
      expect(content).toHaveAttribute('data-side');
    });

    it('content has data-align attribute', () => {
      render(
        <TooltipProvider>
          <Tooltip open>
            <TooltipTrigger>Hover me</TooltipTrigger>
            <TooltipContent>Tooltip text</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );

      const content = document.querySelector('[data-align]');
      expect(content).toHaveAttribute('data-align');
    });
  });

  describe('displayName', () => {
    it('TooltipContent has displayName', () => {
      expect(TooltipContent.displayName).toBe('TooltipContent');
    });
  });

  describe('ref forwarding', () => {
    it('TooltipContent forwards ref', () => {
      const ref = { current: null } as React.RefObject<HTMLDivElement>;
      render(
        <TooltipProvider>
          <Tooltip open>
            <TooltipTrigger>Hover me</TooltipTrigger>
            <TooltipContent ref={ref}>Tooltip text</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('className merging', () => {
    it('merges custom className on content', () => {
      render(
        <TooltipProvider>
          <Tooltip open>
            <TooltipTrigger>Hover me</TooltipTrigger>
            <TooltipContent className="custom-tooltip">Tooltip text</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );

      const styledElement = document.querySelector('.custom-tooltip');
      expect(styledElement).toBeInTheDocument();
      expect(styledElement).toHaveClass('z-50');
    });
  });

  describe('styling classes', () => {
    it('has correct base styling', () => {
      render(
        <TooltipProvider>
          <Tooltip open>
            <TooltipTrigger>Hover me</TooltipTrigger>
            <TooltipContent>Tooltip text</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );

      const content = document.querySelector('.z-50');
      expect(content).toBeInTheDocument();
      expect(content).toHaveClass('overflow-hidden');
      expect(content).toHaveClass('rounded-md');
      expect(content).toHaveClass('bg-primary');
      expect(content).toHaveClass('px-3');
      expect(content).toHaveClass('py-1.5');
      expect(content).toHaveClass('text-xs');
      expect(content).toHaveClass('text-primary-foreground');
    });

    it('has animation classes', () => {
      render(
        <TooltipProvider>
          <Tooltip open>
            <TooltipTrigger>Hover me</TooltipTrigger>
            <TooltipContent>Tooltip text</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );

      const content = document.querySelector('.z-50');
      expect(content).toHaveClass('animate-in');
      expect(content).toHaveClass('fade-in-0');
      expect(content).toHaveClass('zoom-in-95');
    });

    it('has close animation classes in className', () => {
      render(
        <TooltipProvider>
          <Tooltip open>
            <TooltipTrigger>Hover me</TooltipTrigger>
            <TooltipContent>Tooltip text</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );

      const content = document.querySelector('.z-50');
      expect(content?.className).toContain('data-[state=closed]:animate-out');
      expect(content?.className).toContain('data-[state=closed]:fade-out-0');
      expect(content?.className).toContain('data-[state=closed]:zoom-out-95');
    });

    it('has slide-in animation classes', () => {
      render(
        <TooltipProvider>
          <Tooltip open>
            <TooltipTrigger>Hover me</TooltipTrigger>
            <TooltipContent>Tooltip text</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );

      const content = document.querySelector('.z-50');
      expect(content?.className).toContain('data-[side=bottom]:slide-in-from-top-2');
      expect(content?.className).toContain('data-[side=left]:slide-in-from-right-2');
      expect(content?.className).toContain('data-[side=right]:slide-in-from-left-2');
      expect(content?.className).toContain('data-[side=top]:slide-in-from-bottom-2');
    });
  });

  describe('content types', () => {
    it('renders string content', () => {
      render(
        <TooltipProvider>
          <Tooltip open>
            <TooltipTrigger>Hover me</TooltipTrigger>
            <TooltipContent>Simple text</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );

      expect(screen.getAllByText('Simple text').length).toBeGreaterThan(0);
    });

    it('renders complex content', () => {
      render(
        <TooltipProvider>
          <Tooltip open>
            <TooltipTrigger>Hover me</TooltipTrigger>
            <TooltipContent>
              <div>
                <strong>Title</strong>
                <p>Description</p>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );

      expect(screen.getAllByText('Title').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Description').length).toBeGreaterThan(0);
    });

    it('renders with icon', () => {
      render(
        <TooltipProvider>
          <Tooltip open>
            <TooltipTrigger>Hover me</TooltipTrigger>
            <TooltipContent>
              <span data-testid="icon">ℹ️</span>
              Info message
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );

      expect(screen.getAllByTestId('icon').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Info message').length).toBeGreaterThan(0);
    });
  });

  describe('provider requirements', () => {
    it('works with TooltipProvider wrapper', () => {
      render(
        <TooltipProvider>
          <Tooltip open>
            <TooltipTrigger>Hover me</TooltipTrigger>
            <TooltipContent>Tooltip text</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );

      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });

    it('supports delayDuration prop on provider', () => {
      render(
        <TooltipProvider delayDuration={500}>
          <Tooltip>
            <TooltipTrigger>Hover me</TooltipTrigger>
            <TooltipContent>Tooltip text</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );

      // Provider is set up but tooltip is closed by default
      expect(screen.queryByText('Tooltip text')).not.toBeInTheDocument();
    });

    it('renders multiple tooltips within one provider', () => {
      render(
        <TooltipProvider>
          <Tooltip open>
            <TooltipTrigger>First</TooltipTrigger>
            <TooltipContent>First tooltip</TooltipContent>
          </Tooltip>
          <Tooltip open>
            <TooltipTrigger>Second</TooltipTrigger>
            <TooltipContent>Second tooltip</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );

      expect(screen.getAllByText('First tooltip').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Second tooltip').length).toBeGreaterThan(0);
    });
  });

  describe('HTML attributes', () => {
    it('passes through data attributes to trigger', () => {
      render(
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger data-custom="value">Hover me</TooltipTrigger>
            <TooltipContent>Tooltip text</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );

      expect(screen.getByText('Hover me')).toHaveAttribute('data-custom', 'value');
    });

    it('passes through data attributes to content', () => {
      render(
        <TooltipProvider>
          <Tooltip open>
            <TooltipTrigger>Hover me</TooltipTrigger>
            <TooltipContent data-testid="tooltip-content">Tooltip text</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );

      expect(screen.getByTestId('tooltip-content')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('content has role=tooltip', () => {
      render(
        <TooltipProvider>
          <Tooltip open>
            <TooltipTrigger>Hover me</TooltipTrigger>
            <TooltipContent>Tooltip text</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );

      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });

    it('trigger has aria-describedby when tooltip is open', () => {
      render(
        <TooltipProvider>
          <Tooltip open>
            <TooltipTrigger data-testid="trigger">Hover me</TooltipTrigger>
            <TooltipContent>Tooltip text</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );

      const trigger = screen.getByTestId('trigger');
      expect(trigger).toHaveAttribute('aria-describedby');
    });
  });
});
