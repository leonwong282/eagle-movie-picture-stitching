import * as React from 'react';

/**
 * Props for the ErrorBoundary component
 */
export interface ErrorBoundaryProps {
  /** Children to render when there's no error */
  children: React.ReactNode;
  /** Fallback UI to render when an error is caught */
  fallback?: React.ReactNode | ((props: ErrorFallbackProps) => React.ReactNode);
  /** Callback fired when an error is caught */
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  /** Callback fired when the error boundary resets */
  onReset?: () => void;
  /**
   * Keys that, when changed, will reset the error boundary.
   * Useful for resetting when navigation or key props change.
   */
  resetKeys?: unknown[];
}

/**
 * Props passed to the fallback component
 */
export interface ErrorFallbackProps {
  /** The error that was caught */
  error: Error;
  /** Component stack trace */
  errorInfo: React.ErrorInfo | null;
  /** Function to reset the error boundary and retry */
  resetErrorBoundary: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

/**
 * Default fallback component shown when no custom fallback is provided
 */
function DefaultFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg text-center space-y-4">
        <div className="w-16 h-16 mx-auto bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-red-600 dark:text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Something went wrong
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          {error.message || 'An unexpected error occurred'}
        </p>
        <button
          onClick={resetErrorBoundary}
          className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

/**
 * React Error Boundary component that catches JavaScript errors in child components.
 *
 * Error boundaries catch errors during rendering, in lifecycle methods, and in
 * constructors of the whole tree below them. They do NOT catch errors inside
 * event handlers, async code, or server-side rendering.
 *
 * @example
 * ```tsx
 * <ErrorBoundary
 *   fallback={<ErrorFallback />}
 *   onError={(error, info) => logErrorToService(error, info)}
 *   onReset={() => resetAppState()}
 * >
 *   <App />
 * </ErrorBoundary>
 * ```
 *
 * @example With resetKeys for automatic reset on route changes
 * ```tsx
 * <ErrorBoundary resetKeys={[location.pathname]}>
 *   <PageContent />
 * </ErrorBoundary>
 * ```
 */
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Update state so the next render shows the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Store error info for display
    this.setState({ errorInfo });

    // Call optional error handler
    this.props.onError?.(error, errorInfo);

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error);
      console.error('Component stack:', errorInfo.componentStack);
    }
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps): void {
    // Reset error state when resetKeys change
    if (this.state.hasError && this.props.resetKeys) {
      const prevResetKeys = prevProps.resetKeys || [];
      const currentResetKeys = this.props.resetKeys;

      // Check if any reset key has changed
      const hasResetKeyChanged = currentResetKeys.some(
        (key, index) => key !== prevResetKeys[index]
      );

      if (hasResetKeyChanged) {
        this.reset();
      }
    }
  }

  reset = (): void => {
    this.props.onReset?.();
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): React.ReactNode {
    const { hasError, error, errorInfo } = this.state;
    const { children, fallback } = this.props;

    if (hasError && error) {
      const fallbackProps: ErrorFallbackProps = {
        error,
        errorInfo,
        resetErrorBoundary: this.reset,
      };

      // If fallback is a function, call it with props
      if (typeof fallback === 'function') {
        return fallback(fallbackProps);
      }

      // If fallback is a React element, clone it with props
      if (React.isValidElement(fallback)) {
        return React.cloneElement(
          fallback as React.ReactElement<ErrorFallbackProps>,
          fallbackProps
        );
      }

      // If fallback is provided but not a function or element, render it as-is
      if (fallback) {
        return fallback;
      }

      // Use default fallback
      return <DefaultFallback {...fallbackProps} />;
    }

    return children;
  }
}

export { ErrorBoundary };
