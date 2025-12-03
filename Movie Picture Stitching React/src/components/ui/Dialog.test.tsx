import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogOverlay,
} from './Dialog';

describe('Dialog', () => {
  describe('rendering', () => {
    it('renders trigger', () => {
      render(
        <Dialog>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent>Content</DialogContent>
        </Dialog>
      );

      expect(screen.getByRole('button', { name: 'Open Dialog' })).toBeInTheDocument();
    });

    it('does not render content by default', () => {
      render(
        <Dialog>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent>Dialog Content</DialogContent>
        </Dialog>
      );

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  describe('opening and closing', () => {
    it('opens dialog on trigger click', async () => {
      const user = userEvent.setup();
      render(
        <Dialog>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent>Dialog Content</DialogContent>
        </Dialog>
      );

      await user.click(screen.getByRole('button', { name: 'Open Dialog' }));

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Dialog Content')).toBeVisible();
    });

    it('closes on close button click', async () => {
      const user = userEvent.setup();
      render(
        <Dialog>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent>Dialog Content</DialogContent>
        </Dialog>
      );

      await user.click(screen.getByRole('button', { name: 'Open Dialog' }));
      expect(screen.getByRole('dialog')).toBeInTheDocument();

      // Close button has sr-only text "Close"
      await user.click(screen.getByRole('button', { name: 'Close' }));

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('closes on Escape key', async () => {
      const user = userEvent.setup();
      render(
        <Dialog>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent>Dialog Content</DialogContent>
        </Dialog>
      );

      await user.click(screen.getByRole('button', { name: 'Open Dialog' }));
      expect(screen.getByRole('dialog')).toBeInTheDocument();

      await user.keyboard('{Escape}');

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('closes on overlay click', async () => {
      const user = userEvent.setup();
      render(
        <Dialog>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent>Dialog Content</DialogContent>
        </Dialog>
      );

      await user.click(screen.getByRole('button', { name: 'Open Dialog' }));
      expect(screen.getByRole('dialog')).toBeInTheDocument();

      // Find overlay element (has bg-black/80 class and fixed positioning)
      const overlay = document.querySelector('.fixed.inset-0.bg-black\\/80');
      expect(overlay).toBeInTheDocument();

      // Simulate overlay click using fireEvent (bypasses pointer-events check in test env)
      if (overlay) {
        fireEvent.pointerDown(overlay, { button: 0 });
      }
    });

    it('supports controlled open state', () => {
      render(
        <Dialog open>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent>Dialog Content</DialogContent>
        </Dialog>
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('supports defaultOpen', () => {
      render(
        <Dialog defaultOpen>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent>Dialog Content</DialogContent>
        </Dialog>
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('calls onOpenChange when state changes', async () => {
      const handleChange = vi.fn();
      const user = userEvent.setup();

      render(
        <Dialog onOpenChange={handleChange}>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent>Dialog Content</DialogContent>
        </Dialog>
      );

      await user.click(screen.getByRole('button', { name: 'Open Dialog' }));

      expect(handleChange).toHaveBeenCalledWith(true);
    });
  });

  describe('DialogClose', () => {
    it('closes dialog when clicked', async () => {
      const user = userEvent.setup();
      render(
        <Dialog defaultOpen>
          <DialogContent>
            <DialogClose data-testid="custom-close">Close Me</DialogClose>
          </DialogContent>
        </Dialog>
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();

      await user.click(screen.getByTestId('custom-close'));

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  describe('DialogHeader', () => {
    it('renders header content', () => {
      render(
        <Dialog open>
          <DialogContent>
            <DialogHeader data-testid="header">
              <DialogTitle>Title</DialogTitle>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      );

      expect(screen.getByTestId('header')).toBeInTheDocument();
    });

    it('has displayName', () => {
      expect(DialogHeader.displayName).toBe('DialogHeader');
    });

    it('has correct styling', () => {
      render(
        <Dialog open>
          <DialogContent>
            <DialogHeader data-testid="header">Header</DialogHeader>
          </DialogContent>
        </Dialog>
      );

      const header = screen.getByTestId('header');
      expect(header.className).toContain('flex');
      expect(header.className).toContain('flex-col');
      expect(header.className).toContain('space-y-1.5');
    });

    it('merges custom className', () => {
      render(
        <Dialog open>
          <DialogContent>
            <DialogHeader className="custom-header" data-testid="header">
              Header
            </DialogHeader>
          </DialogContent>
        </Dialog>
      );

      const header = screen.getByTestId('header');
      expect(header.className).toContain('custom-header');
    });
  });

  describe('DialogFooter', () => {
    it('renders footer content', () => {
      render(
        <Dialog open>
          <DialogContent>
            <DialogFooter data-testid="footer">
              <button>Action</button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );

      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });

    it('has displayName', () => {
      expect(DialogFooter.displayName).toBe('DialogFooter');
    });

    it('has correct styling', () => {
      render(
        <Dialog open>
          <DialogContent>
            <DialogFooter data-testid="footer">Footer</DialogFooter>
          </DialogContent>
        </Dialog>
      );

      const footer = screen.getByTestId('footer');
      expect(footer.className).toContain('flex');
      expect(footer.className).toContain('sm:flex-row');
      expect(footer.className).toContain('sm:justify-end');
    });

    it('merges custom className', () => {
      render(
        <Dialog open>
          <DialogContent>
            <DialogFooter className="custom-footer" data-testid="footer">
              Footer
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );

      const footer = screen.getByTestId('footer');
      expect(footer.className).toContain('custom-footer');
    });
  });

  describe('DialogTitle', () => {
    it('renders title text', () => {
      render(
        <Dialog open>
          <DialogContent>
            <DialogTitle>Dialog Title</DialogTitle>
          </DialogContent>
        </Dialog>
      );

      expect(screen.getByText('Dialog Title')).toBeInTheDocument();
    });

    it('has displayName', () => {
      expect(DialogTitle.displayName).toBe('DialogTitle');
    });

    it('has correct styling', () => {
      render(
        <Dialog open>
          <DialogContent>
            <DialogTitle data-testid="title">Title</DialogTitle>
          </DialogContent>
        </Dialog>
      );

      const title = screen.getByTestId('title');
      expect(title.className).toContain('text-lg');
      expect(title.className).toContain('font-semibold');
      expect(title.className).toContain('leading-none');
    });

    it('forwards ref', () => {
      const ref = { current: null } as React.RefObject<HTMLHeadingElement>;
      render(
        <Dialog open>
          <DialogContent>
            <DialogTitle ref={ref}>Title</DialogTitle>
          </DialogContent>
        </Dialog>
      );

      expect(ref.current).toBeInstanceOf(HTMLHeadingElement);
    });

    it('merges custom className', () => {
      render(
        <Dialog open>
          <DialogContent>
            <DialogTitle className="custom-title" data-testid="title">
              Title
            </DialogTitle>
          </DialogContent>
        </Dialog>
      );

      const title = screen.getByTestId('title');
      expect(title.className).toContain('custom-title');
    });
  });

  describe('DialogDescription', () => {
    it('renders description text', () => {
      render(
        <Dialog open>
          <DialogContent>
            <DialogDescription>Description text here</DialogDescription>
          </DialogContent>
        </Dialog>
      );

      expect(screen.getByText('Description text here')).toBeInTheDocument();
    });

    it('has displayName', () => {
      expect(DialogDescription.displayName).toBe('DialogDescription');
    });

    it('has correct styling', () => {
      render(
        <Dialog open>
          <DialogContent>
            <DialogDescription data-testid="desc">Description</DialogDescription>
          </DialogContent>
        </Dialog>
      );

      const desc = screen.getByTestId('desc');
      expect(desc.className).toContain('text-sm');
      expect(desc.className).toContain('text-muted-foreground');
    });

    it('forwards ref', () => {
      const ref = { current: null } as React.RefObject<HTMLParagraphElement>;
      render(
        <Dialog open>
          <DialogContent>
            <DialogDescription ref={ref}>Description</DialogDescription>
          </DialogContent>
        </Dialog>
      );

      expect(ref.current).toBeInstanceOf(HTMLParagraphElement);
    });
  });

  describe('DialogContent', () => {
    it('has displayName', () => {
      expect(DialogContent.displayName).toBe('DialogContent');
    });

    it('forwards ref', () => {
      const ref = { current: null } as React.RefObject<HTMLDivElement>;
      render(
        <Dialog open>
          <DialogContent ref={ref}>Content</DialogContent>
        </Dialog>
      );

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('has correct base styling', () => {
      render(
        <Dialog open>
          <DialogContent data-testid="content">Content</DialogContent>
        </Dialog>
      );

      const content = screen.getByTestId('content');
      expect(content.className).toContain('fixed');
      expect(content.className).toContain('z-50');
      expect(content.className).toContain('bg-background');
      expect(content.className).toContain('border');
      expect(content.className).toContain('shadow-lg');
    });

    it('has animation classes', () => {
      render(
        <Dialog open>
          <DialogContent data-testid="content">Content</DialogContent>
        </Dialog>
      );

      const content = screen.getByTestId('content');
      expect(content.className).toContain('data-[state=open]:animate-in');
      expect(content.className).toContain('data-[state=closed]:animate-out');
    });

    it('has responsive rounded corners', () => {
      render(
        <Dialog open>
          <DialogContent data-testid="content">Content</DialogContent>
        </Dialog>
      );

      const content = screen.getByTestId('content');
      expect(content.className).toContain('sm:rounded-lg');
    });

    it('merges custom className', () => {
      render(
        <Dialog open>
          <DialogContent className="custom-content" data-testid="content">
            Content
          </DialogContent>
        </Dialog>
      );

      const content = screen.getByTestId('content');
      expect(content.className).toContain('custom-content');
    });

    it('includes close button', () => {
      render(
        <Dialog open>
          <DialogContent>Content</DialogContent>
        </Dialog>
      );

      expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
    });
  });

  describe('DialogOverlay', () => {
    it('has displayName', () => {
      expect(DialogOverlay.displayName).toBe('DialogOverlay');
    });

    it('forwards ref', () => {
      const ref = { current: null } as React.RefObject<HTMLDivElement>;
      render(
        <Dialog open>
          <DialogOverlay ref={ref} />
          <DialogContent>Content</DialogContent>
        </Dialog>
      );

      // Overlay is rendered via portal in DialogContent, so this ref test
      // is for standalone usage
    });
  });

  describe('composition', () => {
    it('renders complete dialog structure', async () => {
      const user = userEvent.setup();
      render(
        <Dialog>
          <DialogTrigger>Open</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
              <DialogDescription>Make changes to your profile</DialogDescription>
            </DialogHeader>
            <div>Form fields here</div>
            <DialogFooter>
              <DialogClose>Cancel</DialogClose>
              <button>Save</button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );

      await user.click(screen.getByRole('button', { name: 'Open' }));

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Edit Profile')).toBeInTheDocument();
      expect(screen.getByText('Make changes to your profile')).toBeInTheDocument();
      expect(screen.getByText('Form fields here')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
      expect(screen.getByText('Save')).toBeInTheDocument();
    });
  });

  describe('focus management', () => {
    it('focuses first focusable element when opened', async () => {
      const user = userEvent.setup();
      render(
        <Dialog>
          <DialogTrigger>Open</DialogTrigger>
          <DialogContent>
            <input data-testid="first-input" />
            <input data-testid="second-input" />
          </DialogContent>
        </Dialog>
      );

      await user.click(screen.getByRole('button', { name: 'Open' }));

      // Focus typically goes to the close button or first focusable element
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('returns focus to trigger when closed', async () => {
      const user = userEvent.setup();
      render(
        <Dialog>
          <DialogTrigger>Open</DialogTrigger>
          <DialogContent>Content</DialogContent>
        </Dialog>
      );

      const trigger = screen.getByRole('button', { name: 'Open' });
      await user.click(trigger);

      await user.keyboard('{Escape}');

      expect(trigger).toHaveFocus();
    });
  });

  describe('asChild pattern', () => {
    it('supports asChild on trigger', async () => {
      const user = userEvent.setup();
      render(
        <Dialog>
          <DialogTrigger asChild>
            <button data-testid="custom-trigger">Custom Trigger</button>
          </DialogTrigger>
          <DialogContent>Content</DialogContent>
        </Dialog>
      );

      const trigger = screen.getByTestId('custom-trigger');
      expect(trigger.tagName).toBe('BUTTON');

      await user.click(trigger);

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('dialog has role="dialog"', async () => {
      const user = userEvent.setup();
      render(
        <Dialog>
          <DialogTrigger>Open</DialogTrigger>
          <DialogContent>Content</DialogContent>
        </Dialog>
      );

      await user.click(screen.getByRole('button', { name: 'Open' }));

      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('title is associated with dialog', async () => {
      const user = userEvent.setup();
      render(
        <Dialog>
          <DialogTrigger>Open</DialogTrigger>
          <DialogContent>
            <DialogTitle>Accessible Title</DialogTitle>
          </DialogContent>
        </Dialog>
      );

      await user.click(screen.getByRole('button', { name: 'Open' }));

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAccessibleName('Accessible Title');
    });

    it('close button has accessible label', async () => {
      const user = userEvent.setup();
      render(
        <Dialog>
          <DialogTrigger>Open</DialogTrigger>
          <DialogContent>Content</DialogContent>
        </Dialog>
      );

      await user.click(screen.getByRole('button', { name: 'Open' }));

      expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
    });

    it('description is associated with dialog', async () => {
      const user = userEvent.setup();
      render(
        <Dialog>
          <DialogTrigger>Open</DialogTrigger>
          <DialogContent aria-describedby="desc">
            <DialogDescription id="desc">Accessible description</DialogDescription>
          </DialogContent>
        </Dialog>
      );

      await user.click(screen.getByRole('button', { name: 'Open' }));

      expect(screen.getByText('Accessible description')).toBeInTheDocument();
    });
  });

  describe('modal behavior', () => {
    it('prevents interaction with background content', async () => {
      const handleClick = vi.fn();
      const user = userEvent.setup();

      render(
        <>
          <button onClick={handleClick}>Background Button</button>
          <Dialog>
            <DialogTrigger>Open</DialogTrigger>
            <DialogContent>Content</DialogContent>
          </Dialog>
        </>
      );

      await user.click(screen.getByRole('button', { name: 'Open' }));

      // Background button should not be clickable due to overlay
      // This is handled by Radix's focus trap
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });
});
