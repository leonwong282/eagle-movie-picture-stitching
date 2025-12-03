---
sidebar_position: 1
title: ErrorBoundary
description: React error boundary component for graceful error handling and recovery
---

# ErrorBoundary

A React error boundary component that catches JavaScript errors in child component trees, logs them, and displays a fallback UI instead of crashing the entire application.

## Import

```tsx
import { ErrorBoundary } from '@/components';
```

## Basic Usage

```tsx
<ErrorBoundary>
  <MyComponent />
</ErrorBoundary>
```

With custom fallback:

```tsx
<ErrorBoundary
  fallback={(props) => <ErrorFallback {...props} />}
>
  <MyComponent />
</ErrorBoundary>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | Required | Components to wrap |
| `fallback` | `ReactNode \| FallbackRender` | Default UI | Fallback to show on error |
| `onError` | `(error: Error, errorInfo: ErrorInfo) => void` | - | Callback when error occurs |
| `onReset` | `() => void` | - | Callback when boundary resets |
| `resetKeys` | `any[]` | - | Keys that trigger automatic reset |

### FallbackRender Type

```tsx
type FallbackRender = (props: {
  error: Error;
  resetErrorBoundary: () => void;
}) => ReactNode;
```

## Examples

### Global Error Boundary

Wrap your entire application:

```tsx
// main.tsx
import { ErrorBoundary, ErrorFallback } from '@/components';
import { eagleApi } from '@/lib/eagle-api';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary
      fallback={(props) => <ErrorFallback {...props} />}
      onError={(error, errorInfo) => {
        // Log to Eagle's console
        eagleApi.log.error('React Error:', error.message);
        eagleApi.log.error('Stack:', errorInfo.componentStack);
      }}
    >
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
```

### Section-Level Boundaries

Isolate errors to specific sections:

```tsx
function Dashboard() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <ErrorBoundary
        fallback={(props) => (
          <ErrorFallback {...props} variant="inline" />
        )}
      >
        <ChartWidget />
      </ErrorBoundary>
      
      <ErrorBoundary
        fallback={(props) => (
          <ErrorFallback {...props} variant="inline" />
        )}
      >
        <StatsWidget />
      </ErrorBoundary>
    </div>
  );
}
```

### With Reset Keys

Automatically reset when certain props change:

```tsx
function ImageProcessor({ selectedImage }: Props) {
  return (
    <ErrorBoundary
      resetKeys={[selectedImage?.id]}
      fallback={(props) => <ErrorFallback {...props} />}
    >
      <ProcessingPanel image={selectedImage} />
    </ErrorBoundary>
  );
}
```

When `selectedImage.id` changes, the boundary automatically resets.

### With Error Logging

```tsx
function LoggingBoundary({ children }: { children: ReactNode }) {
  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    // Log to Eagle
    if (isEagleEnvironment()) {
      eagleApi.log.error('Component Error:', error.message);
      eagleApi.log.error('Component Stack:', errorInfo.componentStack);
    }
    
    // Send to monitoring service
    if (process.env.NODE_ENV === 'production') {
      sendToErrorMonitoring({
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
      });
    }
  };

  return (
    <ErrorBoundary
      fallback={(props) => <ErrorFallback {...props} />}
      onError={handleError}
    >
      {children}
    </ErrorBoundary>
  );
}
```

### With Reset Handler

```tsx
function ResettableBoundary({ children }: { children: ReactNode }) {
  const handleReset = () => {
    // Clear any cached state
    queryClient.clear();
    
    // Reset global state
    usePluginStore.getState().reset();
    
    console.log('Error boundary reset');
  };

  return (
    <ErrorBoundary
      fallback={(props) => <ErrorFallback {...props} />}
      onReset={handleReset}
    >
      {children}
    </ErrorBoundary>
  );
}
```

### Simple Fallback

```tsx
<ErrorBoundary
  fallback={
    <div className="p-4 text-center">
      <p className="text-destructive">Something went wrong</p>
      <Button onClick={() => window.location.reload()}>
        Reload
      </Button>
    </div>
  }
>
  <MyComponent />
</ErrorBoundary>
```

### Function Fallback

```tsx
<ErrorBoundary
  fallback={({ error, resetErrorBoundary }) => (
    <Card className="p-4">
      <CardHeader>
        <CardTitle className="text-destructive">Error</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          {error.message}
        </p>
        <div className="flex gap-2">
          <Button onClick={resetErrorBoundary}>
            Try Again
          </Button>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Reload Page
          </Button>
        </div>
      </CardContent>
    </Card>
  )}
>
  <MyComponent />
</ErrorBoundary>
```

### Nested Boundaries

```tsx
function App() {
  return (
    // Global boundary catches unhandled errors
    <ErrorBoundary fallback={<GlobalError />}>
      <Header />
      
      {/* Isolated boundary for main content */}
      <ErrorBoundary
        fallback={(props) => <ContentError {...props} />}
        resetKeys={[currentRoute]}
      >
        <MainContent />
      </ErrorBoundary>
      
      {/* Sidebar errors don't affect main content */}
      <ErrorBoundary
        fallback={<SidebarFallback />}
      >
        <Sidebar />
      </ErrorBoundary>
    </ErrorBoundary>
  );
}
```

## Error Recovery Patterns

### Manual Reset

```tsx
function ErrorWithRetry({ error, resetErrorBoundary }) {
  return (
    <div>
      <p>Error: {error.message}</p>
      <Button onClick={resetErrorBoundary}>
        Try Again
      </Button>
    </div>
  );
}
```

### Automatic Reset on Navigation

```tsx
import { useLocation } from 'react-router-dom';

function RouteErrorBoundary({ children }) {
  const location = useLocation();

  return (
    <ErrorBoundary
      resetKeys={[location.pathname]}
      fallback={(props) => <ErrorFallback {...props} />}
    >
      {children}
    </ErrorBoundary>
  );
}
```

### Reset with State Cleanup

```tsx
function DataBoundary({ dataId, children }) {
  const queryClient = useQueryClient();

  const handleReset = () => {
    // Invalidate related queries
    queryClient.invalidateQueries(['data', dataId]);
  };

  return (
    <ErrorBoundary
      resetKeys={[dataId]}
      onReset={handleReset}
      fallback={(props) => <ErrorFallback {...props} />}
    >
      {children}
    </ErrorBoundary>
  );
}
```

## What Errors Are Caught

ErrorBoundary catches:

- ✅ Errors during rendering
- ✅ Errors in lifecycle methods
- ✅ Errors in constructors

ErrorBoundary does NOT catch:

- ❌ Event handlers (use try/catch)
- ❌ Async code (use try/catch or .catch())
- ❌ Server-side rendering
- ❌ Errors in the boundary itself

### Handling Event Handler Errors

```tsx
function MyComponent() {
  const { addToast } = useToast();

  const handleClick = async () => {
    try {
      await riskyOperation();
    } catch (error) {
      // Event handler errors need explicit handling
      addToast(toast.error('Operation failed', error.message));
    }
  };

  return <Button onClick={handleClick}>Do Something</Button>;
}
```

### Handling Async Errors

```tsx
function AsyncComponent() {
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchData()
      .catch(setError);
  }, []);

  if (error) {
    // Re-throw to let boundary catch it
    throw error;
  }

  return <div>Content</div>;
}
```

## Best Practices

### Do

- ✅ Place boundaries at strategic points in the component tree
- ✅ Use multiple boundaries to isolate failures
- ✅ Log errors for debugging (especially to Eagle's console)
- ✅ Provide helpful error messages to users
- ✅ Include a way to recover (reset or reload)
- ✅ Use `resetKeys` for automatic recovery when context changes

### Don't

- ❌ Wrap every component in a boundary (too granular)
- ❌ Ignore the `onError` callback in production
- ❌ Show technical error details to end users
- ❌ Forget to handle async errors separately
- ❌ Rely on boundary for event handler errors

## Integration with Eagle

```tsx
<ErrorBoundary
  fallback={(props) => <ErrorFallback {...props} />}
  onError={(error, errorInfo) => {
    // Log to Eagle's system log
    if (isEagleEnvironment()) {
      eagleApi.log.error(`[Plugin Error] ${error.message}`);
      eagleApi.log.error(`[Stack] ${error.stack}`);
    }
  }}
>
  <PluginContent />
</ErrorBoundary>
```

## Related Components

- [ErrorFallback](./error-fallback) - Pre-built fallback UI component
- [Toast](../ui/toast) - For non-fatal error notifications
