import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/lib/i18n';
import { ErrorBoundary } from './ErrorBoundary';
import { ErrorFallback } from './ErrorFallback';

// Suppress console.error for expected error throws
const originalConsoleError = console.error;
beforeEach(() => {
  console.error = vi.fn();
});
afterEach(() => {
  console.error = originalConsoleError;
});

// Test component that throws an error
function ThrowError({ shouldThrow = true }: { shouldThrow?: boolean }) {
  if (shouldThrow) {
    throw new Error('Test error message');
  }
  return <div>No error</div>;
}

// Test component that throws error conditionally based on prop
function ConditionalThrowError({ errorTrigger }: { errorTrigger: number }) {
  if (errorTrigger > 0) {
    throw new Error(`Error triggered: ${errorTrigger}`);
  }
  return <div data-testid="no-error">No error</div>;
}

// Wrapper for i18n
function TestWrapper({ children }: { children: React.ReactNode }) {
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}

describe('ErrorBoundary', () => {
  describe('normal rendering', () => {
    it('renders children when no error occurs', () => {
      render(
        <ErrorBoundary>
          <div data-testid="child">Child content</div>
        </ErrorBoundary>
      );

      expect(screen.getByTestId('child')).toBeInTheDocument();
      expect(screen.getByTestId('child')).toHaveTextContent('Child content');
    });

    it('renders multiple children', () => {
      render(
        <ErrorBoundary>
          <div data-testid="child1">First</div>
          <div data-testid="child2">Second</div>
        </ErrorBoundary>
      );

      expect(screen.getByTestId('child1')).toBeInTheDocument();
      expect(screen.getByTestId('child2')).toBeInTheDocument();
    });

    it('renders nested components', () => {
      function NestedChild() {
        return <span data-testid="nested">Nested</span>;
      }

      render(
        <ErrorBoundary>
          <div>
            <NestedChild />
          </div>
        </ErrorBoundary>
      );

      expect(screen.getByTestId('nested')).toBeInTheDocument();
    });
  });

  describe('error catching', () => {
    it('catches errors and renders default fallback', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      // Default fallback shows error message
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(screen.getByText('Test error message')).toBeInTheDocument();
    });

    it('catches errors and renders custom fallback element', () => {
      render(
        <ErrorBoundary fallback={<div data-testid="custom-fallback">Custom Error UI</div>}>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(screen.getByTestId('custom-fallback')).toBeInTheDocument();
      expect(screen.getByText('Custom Error UI')).toBeInTheDocument();
    });

    it('catches errors and renders fallback function with props', () => {
      const fallbackFn = vi.fn(({ error, resetErrorBoundary }) => (
        <div>
          <span data-testid="error-msg">{error.message}</span>
          <button onClick={resetErrorBoundary}>Reset</button>
        </div>
      ));

      render(
        <ErrorBoundary fallback={fallbackFn}>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(fallbackFn).toHaveBeenCalled();
      expect(screen.getByTestId('error-msg')).toHaveTextContent('Test error message');
    });

    it('shows error message in fallback UI', () => {
      render(
        <ErrorBoundary>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(screen.getByText('Test error message')).toBeInTheDocument();
    });
  });

  describe('onError callback', () => {
    it('calls onError with error and errorInfo', () => {
      const onError = vi.fn();

      render(
        <ErrorBoundary onError={onError}>
          <ThrowError />
        </ErrorBoundary>
      );

      expect(onError).toHaveBeenCalledTimes(1);
      expect(onError).toHaveBeenCalledWith(
        expect.any(Error),
        expect.objectContaining({
          componentStack: expect.any(String),
        })
      );
    });

    it('passes error message to onError', () => {
      const onError = vi.fn();

      render(
        <ErrorBoundary onError={onError}>
          <ThrowError />
        </ErrorBoundary>
      );

      const [error] = onError.mock.calls[0];
      expect(error.message).toBe('Test error message');
    });
  });

  describe('reset functionality', () => {
    it('resets when Try Again is clicked', async () => {
      let shouldThrow = true;

      function ConditionalError() {
        if (shouldThrow) {
          throw new Error('Error');
        }
        return <div data-testid="recovered">Recovered!</div>;
      }

      const { rerender } = render(
        <ErrorBoundary>
          <ConditionalError />
        </ErrorBoundary>
      );

      // Error state
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();

      // Fix the error condition
      shouldThrow = false;

      // Click Try Again
      fireEvent.click(screen.getByRole('button', { name: /try again/i }));

      // Force rerender to see recovered state
      rerender(
        <ErrorBoundary>
          <ConditionalError />
        </ErrorBoundary>
      );

      expect(screen.getByTestId('recovered')).toBeInTheDocument();
    });

    it('calls onReset when reset is triggered', () => {
      const onReset = vi.fn();

      render(
        <ErrorBoundary onReset={onReset}>
          <ThrowError />
        </ErrorBoundary>
      );

      fireEvent.click(screen.getByRole('button', { name: /try again/i }));

      expect(onReset).toHaveBeenCalledTimes(1);
    });
  });

  describe('resetKeys', () => {
    it('resets when resetKeys change', () => {
      const { rerender } = render(
        <ErrorBoundary resetKeys={[1]}>
          <ConditionalThrowError errorTrigger={1} />
        </ErrorBoundary>
      );

      // Should show error
      expect(screen.queryByTestId('no-error')).not.toBeInTheDocument();

      // Change resetKeys - this should trigger reset
      rerender(
        <ErrorBoundary resetKeys={[2]}>
          <ConditionalThrowError errorTrigger={0} />
        </ErrorBoundary>
      );

      // After reset with fixed component, should show content
      expect(screen.getByTestId('no-error')).toBeInTheDocument();
    });

    it('does not reset if resetKeys stay the same', () => {
      const onReset = vi.fn();

      const { rerender } = render(
        <ErrorBoundary resetKeys={[1]} onReset={onReset}>
          <ThrowError />
        </ErrorBoundary>
      );

      rerender(
        <ErrorBoundary resetKeys={[1]} onReset={onReset}>
          <ThrowError />
        </ErrorBoundary>
      );

      // onReset should not be called since keys didn't change
      expect(onReset).not.toHaveBeenCalled();
    });
  });
});

describe('ErrorFallback', () => {
  const defaultProps = {
    error: new Error('Test error'),
    errorInfo: { componentStack: '\n    at TestComponent\n    at App' },
    resetErrorBoundary: vi.fn(),
  };

  beforeEach(() => {
    defaultProps.resetErrorBoundary = vi.fn();
  });

  describe('rendering', () => {
    it('renders error message', () => {
      render(
        <TestWrapper>
          <ErrorFallback {...defaultProps} />
        </TestWrapper>
      );

      expect(screen.getByText('Test error')).toBeInTheDocument();
    });

    it('renders title and description', () => {
      render(
        <TestWrapper>
          <ErrorFallback {...defaultProps} />
        </TestWrapper>
      );

      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
      expect(screen.getByText(/unexpected error/i)).toBeInTheDocument();
    });

    it('renders Try Again button', () => {
      render(
        <TestWrapper>
          <ErrorFallback {...defaultProps} />
        </TestWrapper>
      );

      expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
    });

    it('renders Reload Plugin button', () => {
      render(
        <TestWrapper>
          <ErrorFallback {...defaultProps} />
        </TestWrapper>
      );

      expect(screen.getByRole('button', { name: /reload/i })).toBeInTheDocument();
    });

    it('has proper accessibility role', () => {
      render(
        <TestWrapper>
          <ErrorFallback {...defaultProps} />
        </TestWrapper>
      );

      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  describe('variants', () => {
    it('renders fullscreen variant by default', () => {
      const { container } = render(
        <TestWrapper>
          <ErrorFallback {...defaultProps} />
        </TestWrapper>
      );

      expect(container.firstChild).toHaveClass('min-h-screen');
    });

    it('renders inline variant', () => {
      const { container } = render(
        <TestWrapper>
          <ErrorFallback {...defaultProps} variant="inline" />
        </TestWrapper>
      );

      expect(container.firstChild).not.toHaveClass('min-h-screen');
    });
  });

  describe('custom props', () => {
    it('renders custom title', () => {
      render(
        <TestWrapper>
          <ErrorFallback {...defaultProps} title="Custom Title" />
        </TestWrapper>
      );

      expect(screen.getByText('Custom Title')).toBeInTheDocument();
    });

    it('renders custom description', () => {
      render(
        <TestWrapper>
          <ErrorFallback {...defaultProps} description="Custom description text" />
        </TestWrapper>
      );

      expect(screen.getByText('Custom description text')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      const { container } = render(
        <TestWrapper>
          <ErrorFallback {...defaultProps} className="custom-class" />
        </TestWrapper>
      );

      expect(container.firstChild).toHaveClass('custom-class');
    });
  });

  describe('actions', () => {
    it('calls resetErrorBoundary when Try Again is clicked', () => {
      render(
        <TestWrapper>
          <ErrorFallback {...defaultProps} />
        </TestWrapper>
      );

      fireEvent.click(screen.getByRole('button', { name: /try again/i }));

      expect(defaultProps.resetErrorBoundary).toHaveBeenCalledTimes(1);
    });

    it('reloads page when Reload Plugin is clicked', () => {
      const reloadMock = vi.fn();
      Object.defineProperty(window, 'location', {
        value: { reload: reloadMock },
        writable: true,
      });

      render(
        <TestWrapper>
          <ErrorFallback {...defaultProps} />
        </TestWrapper>
      );

      fireEvent.click(screen.getByRole('button', { name: /reload/i }));

      expect(reloadMock).toHaveBeenCalled();
    });
  });

  describe('error details', () => {
    it('shows Error Details toggle', () => {
      render(
        <TestWrapper>
          <ErrorFallback {...defaultProps} />
        </TestWrapper>
      );

      expect(screen.getByText(/error details/i)).toBeInTheDocument();
    });

    it('expands details when clicked', async () => {
      render(
        <TestWrapper>
          <ErrorFallback {...defaultProps} />
        </TestWrapper>
      );

      fireEvent.click(screen.getByText(/error details/i));

      await waitFor(() => {
        expect(screen.getByText(/stack trace/i)).toBeInTheDocument();
      });
    });

    it('shows component stack in details', async () => {
      render(
        <TestWrapper>
          <ErrorFallback {...defaultProps} />
        </TestWrapper>
      );

      fireEvent.click(screen.getByText(/error details/i));

      await waitFor(() => {
        expect(screen.getByText(/component stack/i)).toBeInTheDocument();
        expect(screen.getByText(/TestComponent/)).toBeInTheDocument();
      });
    });

    it('hides details when showDetails is false', () => {
      render(
        <TestWrapper>
          <ErrorFallback {...defaultProps} showDetails={false} />
        </TestWrapper>
      );

      expect(screen.queryByText(/error details/i)).not.toBeInTheDocument();
    });

    it('has copy button', () => {
      render(
        <TestWrapper>
          <ErrorFallback {...defaultProps} />
        </TestWrapper>
      );

      expect(screen.getByTitle(/copy/i)).toBeInTheDocument();
    });
  });

  describe('error without stack', () => {
    it('handles error without stack trace', () => {
      const errorWithoutStack = new Error('No stack error');
      errorWithoutStack.stack = undefined;

      render(
        <TestWrapper>
          <ErrorFallback error={errorWithoutStack} errorInfo={null} resetErrorBoundary={vi.fn()} />
        </TestWrapper>
      );

      expect(screen.getByText('No stack error')).toBeInTheDocument();
    });

    it('handles null errorInfo', () => {
      render(
        <TestWrapper>
          <ErrorFallback error={new Error('Test')} errorInfo={null} resetErrorBoundary={vi.fn()} />
        </TestWrapper>
      );

      // Should render without crashing
      expect(screen.getByText('Test')).toBeInTheDocument();
    });
  });
});

describe('ErrorBoundary with ErrorFallback integration', () => {
  it('works together as expected', () => {
    render(
      <TestWrapper>
        <ErrorBoundary fallback={(props) => <ErrorFallback {...props} />}>
          <ThrowError />
        </ErrorBoundary>
      </TestWrapper>
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Test error message')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
  });

  it('shows inline variant for nested boundaries', () => {
    render(
      <TestWrapper>
        <ErrorBoundary fallback={(props) => <ErrorFallback {...props} variant="inline" />}>
          <ThrowError />
        </ErrorBoundary>
      </TestWrapper>
    );

    const alert = screen.getByRole('alert');
    expect(alert).not.toHaveClass('min-h-screen');
  });
});
