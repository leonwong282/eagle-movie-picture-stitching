import * as React from 'react';
import { useTranslation } from 'react-i18next';
import {
  AlertTriangle,
  RefreshCw,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './Button';
import { Card, CardContent } from './Card';
import type { ErrorFallbackProps } from './ErrorBoundary';

/**
 * Props for the ErrorFallback component
 */
export interface ErrorFallbackComponentProps extends ErrorFallbackProps {
  /** Additional class names */
  className?: string;
  /** Variant style */
  variant?: 'fullscreen' | 'inline';
  /** Show error details section */
  showDetails?: boolean;
  /** Custom title override */
  title?: string;
  /** Custom description override */
  description?: string;
}

/**
 * Styled error fallback component that integrates with the design system.
 *
 * Features:
 * - Fullscreen and inline variants
 * - Collapsible error details with component stack
 * - Copy error to clipboard functionality
 * - i18n translations for all text
 * - Dark mode support
 * - Accessible with proper ARIA attributes
 *
 * @example Basic usage
 * ```tsx
 * <ErrorBoundary fallback={(props) => <ErrorFallback {...props} />}>
 *   <App />
 * </ErrorBoundary>
 * ```
 *
 * @example Inline variant for section-level errors
 * ```tsx
 * <ErrorBoundary fallback={(props) => <ErrorFallback {...props} variant="inline" />}>
 *   <DataTable />
 * </ErrorBoundary>
 * ```
 */
export function ErrorFallback({
  error,
  errorInfo,
  resetErrorBoundary,
  className,
  variant = 'fullscreen',
  showDetails = true,
  title,
  description,
}: ErrorFallbackComponentProps) {
  const { t } = useTranslation();
  const [isDetailsOpen, setIsDetailsOpen] = React.useState(false);
  const [isCopied, setIsCopied] = React.useState(false);

  const handleReload = () => {
    window.location.reload();
  };

  const handleCopyError = async () => {
    const errorText = [
      `Error: ${error.message}`,
      '',
      'Stack Trace:',
      error.stack || 'No stack trace available',
      '',
      'Component Stack:',
      errorInfo?.componentStack || 'No component stack available',
    ].join('\n');

    try {
      await navigator.clipboard.writeText(errorText);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      // Fallback for environments without clipboard API
      console.error('Failed to copy error to clipboard');
    }
  };

  const isFullscreen = variant === 'fullscreen';

  const containerClasses = cn(
    isFullscreen && 'min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900',
    !isFullscreen && 'w-full p-4',
    className
  );

  const cardClasses = cn('max-w-lg w-full', isFullscreen && 'animate-fade-in');

  return (
    <div className={containerClasses} role="alert" aria-live="assertive">
      <Card variant="glass" className={cardClasses}>
        <CardContent className="p-6 space-y-6">
          {/* Icon and Title */}
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {title || t('errors.boundary.title', 'Something went wrong')}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {description ||
                  t('errors.boundary.description', 'An unexpected error occurred in the plugin.')}
              </p>
            </div>
          </div>

          {/* Error Message */}
          <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-700 dark:text-red-300 font-mono break-all">
              {error.message || 'Unknown error'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="primary" className="flex-1" onClick={resetErrorBoundary}>
              <RotateCcw className="w-4 h-4" />
              {t('errors.boundary.retry', 'Try Again')}
            </Button>
            <Button variant="outline" className="flex-1" onClick={handleReload}>
              <RefreshCw className="w-4 h-4" />
              {t('errors.boundary.reload', 'Reload Plugin')}
            </Button>
          </div>

          {/* Collapsible Error Details */}
          {showDetails && (error.stack || errorInfo?.componentStack) && (
            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={() => setIsDetailsOpen(!isDetailsOpen)}
                className="flex items-center justify-between w-full text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                aria-expanded={isDetailsOpen}
                aria-controls="error-details"
              >
                <span className="flex items-center gap-2">
                  {isDetailsOpen ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                  {t('errors.boundary.details', 'Error Details')}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopyError();
                  }}
                  className="flex items-center gap-1 text-xs px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  title={t('errors.boundary.copy', 'Copy error details')}
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3 h-3 text-green-500" />
                      <span className="text-green-500">
                        {t('errors.boundary.copied', 'Copied!')}
                      </span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>{t('errors.boundary.copy', 'Copy')}</span>
                    </>
                  )}
                </button>
              </button>

              {isDetailsOpen && (
                <div id="error-details" className="mt-3 space-y-3 animate-fade-in">
                  {/* Stack Trace */}
                  {error.stack && (
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-500">
                        {t('errors.boundary.stackTrace', 'Stack Trace')}
                      </p>
                      <pre className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs text-gray-700 dark:text-gray-300 overflow-auto max-h-32 font-mono">
                        {error.stack}
                      </pre>
                    </div>
                  )}

                  {/* Component Stack */}
                  {errorInfo?.componentStack && (
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-500">
                        {t('errors.boundary.componentStack', 'Component Stack')}
                      </p>
                      <pre className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs text-gray-700 dark:text-gray-300 overflow-auto max-h-32 font-mono">
                        {errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
