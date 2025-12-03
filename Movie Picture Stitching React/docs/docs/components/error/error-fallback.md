---
sidebar_position: 2
title: ErrorFallback
description: Pre-built fallback UI component for ErrorBoundary with multiple variants
---

# ErrorFallback

A pre-built fallback UI component designed to work with `ErrorBoundary`. Provides user-friendly error displays with recovery options, debug information, and copy-to-clipboard functionality.

## Import

```tsx
import { ErrorFallback } from '@/components';
```

## Basic Usage

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
| `error` | `Error` | Required | The error that was caught |
| `resetErrorBoundary` | `() => void` | Required | Function to reset the boundary |
| `variant` | `'fullscreen' \| 'inline'` | `'fullscreen'` | Display variant |
| `title` | `string` | `'Something went wrong'` | Custom error title |
| `showDetails` | `boolean` | `true` | Show expandable error details |
| `showStack` | `boolean` | `process.env.NODE_ENV === 'development'` | Show stack trace |
| `showReload` | `boolean` | `true` | Show reload button |
| `showCopy` | `boolean` | `true` | Show copy error button |
| `onCopy` | `() => void` | - | Custom copy handler |

## Variants

### Fullscreen (Default)

Centers the error in the viewport, suitable for global or page-level errors:

```tsx
<ErrorBoundary
  fallback={(props) => <ErrorFallback {...props} variant="fullscreen" />}
>
  <App />
</ErrorBoundary>
```

### Inline

Fits within the error boundary's container, suitable for section-level errors:

```tsx
<ErrorBoundary
  fallback={(props) => <ErrorFallback {...props} variant="inline" />}
>
  <Widget />
</ErrorBoundary>
```

## Examples

### Global Error with Custom Title

```tsx
<ErrorBoundary
  fallback={(props) => (
    <ErrorFallback
      {...props}
      title="Plugin Error"
      variant="fullscreen"
    />
  )}
>
  <PluginContent />
</ErrorBoundary>
```

### Section Error (Inline)

```tsx
function Dashboard() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <ErrorBoundary
        fallback={(props) => (
          <ErrorFallback
            {...props}
            variant="inline"
            title="Chart failed to load"
            showStack={false}
          />
        )}
      >
        <ChartWidget />
      </ErrorBoundary>

      <ErrorBoundary
        fallback={(props) => (
          <ErrorFallback
            {...props}
            variant="inline"
            title="Stats unavailable"
          />
        )}
      >
        <StatsWidget />
      </ErrorBoundary>
    </div>
  );
}
```

### Production-Safe Display

```tsx
<ErrorFallback
  error={error}
  resetErrorBoundary={reset}
  showStack={false}           // Hide stack in production
  showDetails={false}         // Hide error details
  title="Something went wrong"
/>
```

### Developer-Friendly Display

```tsx
<ErrorFallback
  error={error}
  resetErrorBoundary={reset}
  showStack={true}
  showDetails={true}
  showCopy={true}
/>
```

### Custom Copy Handler

```tsx
<ErrorFallback
  error={error}
  resetErrorBoundary={reset}
  showCopy={true}
  onCopy={() => {
    // Custom copy behavior
    const errorReport = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
    };
    navigator.clipboard.writeText(JSON.stringify(errorReport, null, 2));
    toast.success('Error report copied');
  }}
/>
```

### Without Reload Button

```tsx
<ErrorFallback
  error={error}
  resetErrorBoundary={reset}
  showReload={false}  // Only show "Try Again" button
/>
```

### Minimal Error Display

```tsx
<ErrorFallback
  error={error}
  resetErrorBoundary={reset}
  showDetails={false}
  showStack={false}
  showCopy={false}
  showReload={false}
/>
```

## UI Structure

### Fullscreen Variant

```tsx
<div className="fixed inset-0 flex items-center justify-center bg-background">
  <Card className="max-w-lg w-full mx-4">
    <CardHeader>
      <AlertCircle className="h-12 w-12 text-destructive" />
      <CardTitle>{title}</CardTitle>
      <CardDescription>{error.message}</CardDescription>
    </CardHeader>
    <CardContent>
      {showDetails && (
        <Collapsible>
          {/* Stack trace */}
        </Collapsible>
      )}
    </CardContent>
    <CardFooter>
      <Button onClick={resetErrorBoundary}>Try Again</Button>
      {showReload && <Button onClick={reload}>Reload</Button>}
      {showCopy && <Button onClick={copy}>Copy Error</Button>}
    </CardFooter>
  </Card>
</div>
```

### Inline Variant

```tsx
<Card className="border-destructive/50 bg-destructive/5">
  <CardHeader className="pb-2">
    <div className="flex items-center gap-2">
      <AlertCircle className="h-5 w-5 text-destructive" />
      <CardTitle className="text-base">{title}</CardTitle>
    </div>
  </CardHeader>
  <CardContent>
    <p className="text-sm text-muted-foreground">{error.message}</p>
    {showDetails && /* ... */}
  </CardContent>
  <CardFooter className="pt-0">
    <Button size="sm" onClick={resetErrorBoundary}>
      Try Again
    </Button>
  </CardFooter>
</Card>
```

## Error Details Panel

When `showDetails={true}`, users can expand to see technical information:

```tsx
<Collapsible>
  <CollapsibleTrigger className="flex items-center gap-2">
    <ChevronDown className="h-4 w-4" />
    Technical Details
  </CollapsibleTrigger>
  <CollapsibleContent>
    <pre className="mt-2 p-3 bg-muted rounded-md text-xs overflow-auto">
      {error.stack}
    </pre>
  </CollapsibleContent>
</Collapsible>
```

## Copy Error Feature

The copy button includes complete error information:

```tsx
const handleCopy = () => {
  const errorInfo = `
Error: ${error.message}
Stack: ${error.stack}
Timestamp: ${new Date().toISOString()}
URL: ${window.location.href}
  `.trim();

  navigator.clipboard.writeText(errorInfo);
  // Shows toast confirmation
};
```

## Styling

### Default Colors

```css
/* Fullscreen background */
.error-fullscreen {
  @apply bg-background;
}

/* Error icon */
.error-icon {
  @apply text-destructive;
}

/* Inline card */
.error-inline {
  @apply border-destructive/50 bg-destructive/5;
}

/* Stack trace */
.error-stack {
  @apply bg-muted text-muted-foreground font-mono text-xs;
}
```

### Custom Styling

```tsx
<ErrorFallback
  error={error}
  resetErrorBoundary={reset}
  className="border-2 border-red-500"
/>

// Or with wrapper
<div className="p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
  <ErrorFallback
    {...props}
    variant="inline"
  />
</div>
```

## Accessibility

The component includes proper accessibility features:

- Error icon has `aria-hidden="true"` (decorative)
- Error message is in heading hierarchy
- Buttons have clear labels
- Collapsible uses proper ARIA states
- Focus management on actions

## Integration with Toast

Show a toast notification when copying:

```tsx
import { useToast, toast } from '@/components';

function ErrorFallbackWithToast(props: ErrorFallbackProps) {
  const { addToast } = useToast();

  return (
    <ErrorFallback
      {...props}
      onCopy={() => {
        // Default copy behavior
        navigator.clipboard.writeText(formatError(props.error));
        addToast(toast.success('Error details copied to clipboard'));
      }}
    />
  );
}
```

## Best Practices

### Do

- ✅ Use `variant="inline"` for non-critical sections
- ✅ Use `variant="fullscreen"` for app-level errors
- ✅ Hide stack traces in production
- ✅ Provide clear, user-friendly titles
- ✅ Always include a recovery action (Try Again or Reload)
- ✅ Keep copy feature for debugging support

### Don't

- ❌ Show raw error messages to non-technical users
- ❌ Expose stack traces in production
- ❌ Remove all recovery options
- ❌ Use fullscreen variant for small widgets
- ❌ Forget to handle the `resetErrorBoundary` callback

## Environment-Based Configuration

```tsx
const isDev = process.env.NODE_ENV === 'development';

<ErrorFallback
  error={error}
  resetErrorBoundary={reset}
  showStack={isDev}
  showDetails={isDev}
  title={isDev 
    ? `Error: ${error.name}` 
    : 'Something went wrong'
  }
/>
```

## Related Components

- [ErrorBoundary](./error-boundary) - Parent component that catches errors
- [Card](../ui/card) - Base component used for layout
- [Button](../ui/button) - Used for action buttons
- [Toast](../ui/toast) - For copy confirmation notifications
