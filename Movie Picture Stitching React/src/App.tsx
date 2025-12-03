/**
 * Movie Picture Stitching - App Entry Point
 *
 * Main entry point for the Movie Picture Stitching Eagle plugin.
 * Sets up providers and renders the StitchingPage.
 */
import { ToastProvider, ErrorBoundary, ErrorFallback } from '@/components';
import { eagleApi } from '@/lib';
import { StitchingPage } from '@/pages';

function App() {
  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    // Log error to Eagle's logging system in production
    if (!eagleApi.isMock) {
      eagleApi.log.error(`[ErrorBoundary] ${error.message}`);
      eagleApi.log.error(`[ErrorBoundary] Component Stack: ${errorInfo.componentStack}`);
    }
    // Always log to console in development
    console.error('[ErrorBoundary] Caught error:', error);
  };

  return (
    <ErrorBoundary
      fallback={(props) => <ErrorFallback {...props} />}
      onError={handleError}
      onReset={() => {
        // Optional: Reset any app state here before retry
      }}
    >
      <ToastProvider>
        <StitchingPage />
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
