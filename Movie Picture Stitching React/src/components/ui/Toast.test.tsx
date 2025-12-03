import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ToastProvider, useToast, toast, type Toast, type ToastType } from './Toast';

// Helper component to access toast context
function ToastTester({ onMount }: { onMount?: (fns: ReturnType<typeof useToast>) => void }) {
  const toastFns = useToast();

  if (onMount) {
    // Call immediately on first render
    onMount(toastFns);
  }

  return null;
}

// Wrapper component for testing
function TestWrapper({ children }: { children: React.ReactNode }) {
  return <ToastProvider>{children}</ToastProvider>;
}

describe('Toast', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  describe('ToastProvider', () => {
    it('renders children', () => {
      render(
        <ToastProvider>
          <div data-testid="child">Child content</div>
        </ToastProvider>
      );

      expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('renders toast container', () => {
      render(
        <ToastProvider>
          <div>Content</div>
        </ToastProvider>
      );

      // Container has aria-live but no explicit role
      const container = document.querySelector('[aria-live="polite"]');
      expect(container).toBeInTheDocument();
    });
  });

  describe('useToast hook', () => {
    it('throws error when used outside provider', () => {
      // Suppress console.error for this test
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<ToastTester />);
      }).toThrow('useToast must be used within a ToastProvider');

      consoleSpy.mockRestore();
    });

    it('provides addToast function', () => {
      let toastFns: ReturnType<typeof useToast> | undefined;

      render(
        <TestWrapper>
          <ToastTester
            onMount={(fns) => {
              toastFns = fns;
            }}
          />
        </TestWrapper>
      );

      expect(toastFns?.addToast).toBeDefined();
      expect(typeof toastFns?.addToast).toBe('function');
    });

    it('provides removeToast function', () => {
      let toastFns: ReturnType<typeof useToast> | undefined;

      render(
        <TestWrapper>
          <ToastTester
            onMount={(fns) => {
              toastFns = fns;
            }}
          />
        </TestWrapper>
      );

      expect(toastFns?.removeToast).toBeDefined();
      expect(typeof toastFns?.removeToast).toBe('function');
    });

    it('provides toasts array', () => {
      let toastFns: ReturnType<typeof useToast> | undefined;

      render(
        <TestWrapper>
          <ToastTester
            onMount={(fns) => {
              toastFns = fns;
            }}
          />
        </TestWrapper>
      );

      expect(toastFns?.toasts).toBeDefined();
      expect(Array.isArray(toastFns?.toasts)).toBe(true);
    });
  });

  describe('addToast', () => {
    it('adds a toast to the list', async () => {
      let addToast: ReturnType<typeof useToast>['addToast'];

      render(
        <TestWrapper>
          <ToastTester
            onMount={(fns) => {
              addToast = fns.addToast;
            }}
          />
        </TestWrapper>
      );

      await act(async () => {
        addToast!({ type: 'success', title: 'Test Toast' });
      });

      expect(screen.getByText('Test Toast')).toBeInTheDocument();
    });

    it('displays toast with description', async () => {
      let addToast: ReturnType<typeof useToast>['addToast'];

      render(
        <TestWrapper>
          <ToastTester
            onMount={(fns) => {
              addToast = fns.addToast;
            }}
          />
        </TestWrapper>
      );

      await act(async () => {
        addToast!({ type: 'info', title: 'Title', description: 'Description text' });
      });

      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Description text')).toBeInTheDocument();
    });

    it('generates unique id for each toast', async () => {
      let addToast: ReturnType<typeof useToast>['addToast'];
      let toasts: Toast[];

      function ToastReader() {
        const fns = useToast();
        addToast = fns.addToast;
        toasts = fns.toasts;
        return null;
      }

      render(
        <TestWrapper>
          <ToastReader />
        </TestWrapper>
      );

      await act(async () => {
        addToast!({ type: 'success', title: 'Toast 1' });
        addToast!({ type: 'success', title: 'Toast 2' });
      });

      expect(toasts![0].id).not.toBe(toasts![1].id);
    });
  });

  describe('removeToast', () => {
    it('removes a toast by id', async () => {
      let addToast: ReturnType<typeof useToast>['addToast'];
      let removeToast: ReturnType<typeof useToast>['removeToast'];
      let toasts: Toast[];

      function ToastReader() {
        const fns = useToast();
        addToast = fns.addToast;
        removeToast = fns.removeToast;
        toasts = fns.toasts;
        return null;
      }

      render(
        <TestWrapper>
          <ToastReader />
        </TestWrapper>
      );

      await act(async () => {
        addToast!({ type: 'success', title: 'Toast to remove', duration: 0 });
      });

      expect(screen.getByText('Toast to remove')).toBeInTheDocument();
      const toastId = toasts![0].id;

      await act(async () => {
        removeToast!(toastId);
      });

      expect(screen.queryByText('Toast to remove')).not.toBeInTheDocument();
    });
  });

  describe('auto-dismiss', () => {
    it('auto-dismisses after default duration (4000ms)', async () => {
      let addToast: ReturnType<typeof useToast>['addToast'];

      render(
        <TestWrapper>
          <ToastTester
            onMount={(fns) => {
              addToast = fns.addToast;
            }}
          />
        </TestWrapper>
      );

      await act(async () => {
        addToast!({ type: 'success', title: 'Auto dismiss' });
      });

      expect(screen.getByText('Auto dismiss')).toBeInTheDocument();

      await act(async () => {
        vi.advanceTimersByTime(4000);
      });

      expect(screen.queryByText('Auto dismiss')).not.toBeInTheDocument();
    });

    it('respects custom duration', async () => {
      let addToast: ReturnType<typeof useToast>['addToast'];

      render(
        <TestWrapper>
          <ToastTester
            onMount={(fns) => {
              addToast = fns.addToast;
            }}
          />
        </TestWrapper>
      );

      await act(async () => {
        addToast!({ type: 'success', title: 'Custom duration', duration: 2000 });
      });

      expect(screen.getByText('Custom duration')).toBeInTheDocument();

      await act(async () => {
        vi.advanceTimersByTime(2000);
      });

      expect(screen.queryByText('Custom duration')).not.toBeInTheDocument();
    });

    it('does not auto-dismiss when duration is 0', async () => {
      let addToast: ReturnType<typeof useToast>['addToast'];

      render(
        <TestWrapper>
          <ToastTester
            onMount={(fns) => {
              addToast = fns.addToast;
            }}
          />
        </TestWrapper>
      );

      await act(async () => {
        addToast!({ type: 'error', title: 'Persistent', duration: 0 });
      });

      await act(async () => {
        vi.advanceTimersByTime(10000);
      });

      expect(screen.getByText('Persistent')).toBeInTheDocument();
    });
  });

  describe('toast types', () => {
    const types: ToastType[] = ['success', 'error', 'warning', 'info'];

    types.forEach((type) => {
      it(`renders ${type} toast`, async () => {
        let addToast: ReturnType<typeof useToast>['addToast'];

        render(
          <TestWrapper>
            <ToastTester
              onMount={(fns) => {
                addToast = fns.addToast;
              }}
            />
          </TestWrapper>
        );

        await act(async () => {
          addToast!({ type, title: `${type} toast`, duration: 0 });
        });

        expect(screen.getByText(`${type} toast`)).toBeInTheDocument();
      });
    });

    it('success toast has correct styling', async () => {
      let addToast: ReturnType<typeof useToast>['addToast'];

      render(
        <TestWrapper>
          <ToastTester
            onMount={(fns) => {
              addToast = fns.addToast;
            }}
          />
        </TestWrapper>
      );

      await act(async () => {
        addToast!({ type: 'success', title: 'Success', duration: 0 });
      });

      const toast = screen.getByRole('alert');
      expect(toast.className).toContain('bg-emerald-50');
    });

    it('error toast has correct styling', async () => {
      let addToast: ReturnType<typeof useToast>['addToast'];

      render(
        <TestWrapper>
          <ToastTester
            onMount={(fns) => {
              addToast = fns.addToast;
            }}
          />
        </TestWrapper>
      );

      await act(async () => {
        addToast!({ type: 'error', title: 'Error', duration: 0 });
      });

      const toast = screen.getByRole('alert');
      expect(toast.className).toContain('bg-red-50');
    });

    it('warning toast has correct styling', async () => {
      let addToast: ReturnType<typeof useToast>['addToast'];

      render(
        <TestWrapper>
          <ToastTester
            onMount={(fns) => {
              addToast = fns.addToast;
            }}
          />
        </TestWrapper>
      );

      await act(async () => {
        addToast!({ type: 'warning', title: 'Warning', duration: 0 });
      });

      const toast = screen.getByRole('alert');
      expect(toast.className).toContain('bg-amber-50');
    });

    it('info toast has correct styling', async () => {
      let addToast: ReturnType<typeof useToast>['addToast'];

      render(
        <TestWrapper>
          <ToastTester
            onMount={(fns) => {
              addToast = fns.addToast;
            }}
          />
        </TestWrapper>
      );

      await act(async () => {
        addToast!({ type: 'info', title: 'Info', duration: 0 });
      });

      const toast = screen.getByRole('alert');
      expect(toast.className).toContain('bg-sky-50');
    });
  });

  describe('dismiss button', () => {
    it('renders dismiss button', async () => {
      let addToast: ReturnType<typeof useToast>['addToast'];

      render(
        <TestWrapper>
          <ToastTester
            onMount={(fns) => {
              addToast = fns.addToast;
            }}
          />
        </TestWrapper>
      );

      await act(async () => {
        addToast!({ type: 'success', title: 'Dismissable', duration: 0 });
      });

      expect(screen.getByRole('button', { name: 'Dismiss' })).toBeInTheDocument();
    });

    it('dismisses toast when clicking dismiss button', async () => {
      let addToast: ReturnType<typeof useToast>['addToast'];

      render(
        <TestWrapper>
          <ToastTester
            onMount={(fns) => {
              addToast = fns.addToast;
            }}
          />
        </TestWrapper>
      );

      await act(async () => {
        addToast!({ type: 'success', title: 'Dismissable', duration: 0 });
      });

      expect(screen.getByText('Dismissable')).toBeInTheDocument();

      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: 'Dismiss' }));
      });

      expect(screen.queryByText('Dismissable')).not.toBeInTheDocument();
    });
  });

  describe('toast convenience functions', () => {
    it('toast.success creates success config', () => {
      const config = toast.success('Success Title', 'Description');

      expect(config.type).toBe('success');
      expect(config.title).toBe('Success Title');
      expect(config.description).toBe('Description');
    });

    it('toast.error creates error config with no auto-dismiss by default', () => {
      const config = toast.error('Error Title');

      expect(config.type).toBe('error');
      expect(config.title).toBe('Error Title');
      expect(config.duration).toBe(0);
    });

    it('toast.warning creates warning config', () => {
      const config = toast.warning('Warning Title');

      expect(config.type).toBe('warning');
      expect(config.title).toBe('Warning Title');
    });

    it('toast.info creates info config', () => {
      const config = toast.info('Info Title');

      expect(config.type).toBe('info');
      expect(config.title).toBe('Info Title');
    });

    it('toast functions accept custom duration', () => {
      const successConfig = toast.success('Title', 'Desc', 5000);
      const errorConfig = toast.error('Title', 'Desc', 3000);

      expect(successConfig.duration).toBe(5000);
      expect(errorConfig.duration).toBe(3000);
    });
  });

  describe('multiple toasts', () => {
    it('can display multiple toasts', async () => {
      let addToast: ReturnType<typeof useToast>['addToast'];

      render(
        <TestWrapper>
          <ToastTester
            onMount={(fns) => {
              addToast = fns.addToast;
            }}
          />
        </TestWrapper>
      );

      await act(async () => {
        addToast!({ type: 'success', title: 'First', duration: 0 });
        addToast!({ type: 'error', title: 'Second', duration: 0 });
        addToast!({ type: 'warning', title: 'Third', duration: 0 });
      });

      expect(screen.getByText('First')).toBeInTheDocument();
      expect(screen.getByText('Second')).toBeInTheDocument();
      expect(screen.getByText('Third')).toBeInTheDocument();
    });

    it('stacks toasts in container', async () => {
      let addToast: ReturnType<typeof useToast>['addToast'];

      render(
        <TestWrapper>
          <ToastTester
            onMount={(fns) => {
              addToast = fns.addToast;
            }}
          />
        </TestWrapper>
      );

      await act(async () => {
        addToast!({ type: 'success', title: 'First', duration: 0 });
        addToast!({ type: 'success', title: 'Second', duration: 0 });
      });

      const alerts = screen.getAllByRole('alert');
      expect(alerts).toHaveLength(2);
    });
  });

  describe('styling', () => {
    it('toast container has correct positioning', () => {
      render(
        <TestWrapper>
          <div>Content</div>
        </TestWrapper>
      );

      const container = document.querySelector('[aria-live="polite"]');
      expect(container?.className).toContain('fixed');
      expect(container?.className).toContain('bottom-4');
      expect(container?.className).toContain('right-4');
      expect(container?.className).toContain('z-50');
    });

    it('toast has animation class', async () => {
      let addToast: ReturnType<typeof useToast>['addToast'];

      render(
        <TestWrapper>
          <ToastTester
            onMount={(fns) => {
              addToast = fns.addToast;
            }}
          />
        </TestWrapper>
      );

      await act(async () => {
        addToast!({ type: 'success', title: 'Animated', duration: 0 });
      });

      const toast = screen.getByRole('alert');
      expect(toast.className).toContain('animate-slide-up');
    });

    it('toast has shadow and border', async () => {
      let addToast: ReturnType<typeof useToast>['addToast'];

      render(
        <TestWrapper>
          <ToastTester
            onMount={(fns) => {
              addToast = fns.addToast;
            }}
          />
        </TestWrapper>
      );

      await act(async () => {
        addToast!({ type: 'success', title: 'Styled', duration: 0 });
      });

      const toast = screen.getByRole('alert');
      expect(toast.className).toContain('shadow-lg');
      expect(toast.className).toContain('border');
      expect(toast.className).toContain('rounded-lg');
    });
  });

  describe('accessibility', () => {
    it('toast has role="alert"', async () => {
      let addToast: ReturnType<typeof useToast>['addToast'];

      render(
        <TestWrapper>
          <ToastTester
            onMount={(fns) => {
              addToast = fns.addToast;
            }}
          />
        </TestWrapper>
      );

      await act(async () => {
        addToast!({ type: 'success', title: 'Accessible', duration: 0 });
      });

      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('container has aria-live="polite"', () => {
      render(
        <TestWrapper>
          <div>Content</div>
        </TestWrapper>
      );

      const container = document.querySelector('[aria-live]');
      expect(container).toHaveAttribute('aria-live', 'polite');
    });

    it('dismiss button has accessible label', async () => {
      let addToast: ReturnType<typeof useToast>['addToast'];

      render(
        <TestWrapper>
          <ToastTester
            onMount={(fns) => {
              addToast = fns.addToast;
            }}
          />
        </TestWrapper>
      );

      await act(async () => {
        addToast!({ type: 'success', title: 'Test', duration: 0 });
      });

      expect(screen.getByRole('button', { name: 'Dismiss' })).toBeInTheDocument();
    });
  });

  describe('icons', () => {
    it('success toast shows check icon', async () => {
      let addToast: ReturnType<typeof useToast>['addToast'];

      render(
        <TestWrapper>
          <ToastTester
            onMount={(fns) => {
              addToast = fns.addToast;
            }}
          />
        </TestWrapper>
      );

      await act(async () => {
        addToast!({ type: 'success', title: 'Success', duration: 0 });
      });

      // Check for the icon SVG with the expected class
      const toast = screen.getByRole('alert');
      const icon = toast.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });

    it('error toast shows alert icon', async () => {
      let addToast: ReturnType<typeof useToast>['addToast'];

      render(
        <TestWrapper>
          <ToastTester
            onMount={(fns) => {
              addToast = fns.addToast;
            }}
          />
        </TestWrapper>
      );

      await act(async () => {
        addToast!({ type: 'error', title: 'Error', duration: 0 });
      });

      const toast = screen.getByRole('alert');
      const icon = toast.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });
  });
});
