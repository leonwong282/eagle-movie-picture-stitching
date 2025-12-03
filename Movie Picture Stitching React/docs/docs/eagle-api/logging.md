---
sidebar_position: 10
title: Logging
description: Plugin logging and debugging
---

# Logging

Log messages and errors for debugging and monitoring.

## Import

```tsx
import { eagleApi } from '@/lib/eagle-api';
```

## Logging Methods

| Method | Level | Use Case |
|--------|-------|----------|
| `log()` | Default | General information |
| `info()` | Info | Informational messages |
| `warn()` | Warning | Potential issues |
| `error()` | Error | Errors and exceptions |

## Basic Usage

```tsx
// General logging
eagleApi.log('Plugin initialized');

// Info level
eagleApi.log.info('User selected', items.length, 'items');

// Warning level
eagleApi.log.warn('Deprecated API used');

// Error level
eagleApi.log.error('Failed to save', error);
```

## Method Signatures

### log

```tsx
eagleApi.log(...args: unknown[]): void
```

General-purpose logging for any message.

```tsx
eagleApi.log('Simple message');
eagleApi.log('Count:', 42);
eagleApi.log('Data:', { id: 1, name: 'test' });
eagleApi.log('Multiple', 'values', 123, true);
```

### info

```tsx
eagleApi.log.info(...args: unknown[]): void
```

Informational messages about normal operations.

```tsx
eagleApi.log.info('App started');
eagleApi.log.info('Loaded', folders.length, 'folders');
eagleApi.log.info('User:', { id: userId, action: 'login' });
```

### warn

```tsx
eagleApi.log.warn(...args: unknown[]): void
```

Warning messages for potential issues.

```tsx
eagleApi.log.warn('No items selected');
eagleApi.log.warn('Rate limit approaching:', remaining);
eagleApi.log.warn('Deprecated: use newMethod() instead');
```

### error

```tsx
eagleApi.log.error(...args: unknown[]): void
```

Error messages for failures and exceptions.

```tsx
eagleApi.log.error('Save failed');
eagleApi.log.error('API error:', error.message);
eagleApi.log.error('Unhandled exception', error);
```

## Common Patterns

### Function Entry/Exit

```tsx
async function processItems(items: Item[]) {
  eagleApi.log.info('processItems started', { count: items.length });
  
  try {
    const result = await doProcessing(items);
    eagleApi.log.info('processItems completed', { 
      success: result.success,
      failed: result.failed 
    });
    return result;
  } catch (error) {
    eagleApi.log.error('processItems failed', error);
    throw error;
  }
}
```

### Error Handling

```tsx
async function fetchData() {
  try {
    const data = await api.getData();
    return data;
  } catch (error) {
    if (error instanceof NetworkError) {
      eagleApi.log.warn('Network error, retrying...', error.message);
      return await retryFetch();
    }
    
    eagleApi.log.error('Fetch failed', {
      message: error.message,
      stack: error.stack,
    });
    throw error;
  }
}
```

### Performance Logging

```tsx
function logPerformance(operation: string, fn: () => Promise<void>) {
  return async () => {
    const start = performance.now();
    
    try {
      await fn();
      const duration = performance.now() - start;
      eagleApi.log.info(`${operation} completed`, { 
        duration: `${duration.toFixed(2)}ms` 
      });
    } catch (error) {
      const duration = performance.now() - start;
      eagleApi.log.error(`${operation} failed after ${duration.toFixed(2)}ms`, error);
      throw error;
    }
  };
}

// Usage
await logPerformance('Image export', async () => {
  await exportImages(selectedItems);
})();
```

### Debug Mode Logging

```tsx
const DEBUG = import.meta.env.DEV;

function debugLog(...args: unknown[]) {
  if (DEBUG) {
    eagleApi.log('[DEBUG]', ...args);
  }
}

// Usage
debugLog('State:', currentState);
debugLog('Props received:', props);
```

## Structured Logging

### Log Object Data

```tsx
// Log structured data
eagleApi.log.info('Operation', {
  type: 'export',
  itemCount: items.length,
  format: 'png',
  quality: 0.8,
});

// Log with context
eagleApi.log.error('API Error', {
  endpoint: '/api/items',
  status: response.status,
  message: response.statusText,
  requestId: headers['x-request-id'],
});
```

### Log Arrays

```tsx
// Log array summary
eagleApi.log.info('Selected items:', {
  count: items.length,
  ids: items.map(i => i.id),
  types: [...new Set(items.map(i => i.ext))],
});
```

## Logger Service

Create a centralized logger service:

```tsx
// lib/logger.ts
import { eagleApi } from '@/lib/eagle-api';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  data?: unknown;
  timestamp: Date;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 1000;

  private addEntry(level: LogLevel, message: string, data?: unknown) {
    const entry: LogEntry = {
      level,
      message,
      data,
      timestamp: new Date(),
    };
    
    this.logs.push(entry);
    
    // Keep log size bounded
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
  }

  debug(message: string, data?: unknown) {
    if (import.meta.env.DEV) {
      this.addEntry('debug', message, data);
      eagleApi.log('[DEBUG]', message, data);
    }
  }

  info(message: string, data?: unknown) {
    this.addEntry('info', message, data);
    eagleApi.log.info(message, data);
  }

  warn(message: string, data?: unknown) {
    this.addEntry('warn', message, data);
    eagleApi.log.warn(message, data);
  }

  error(message: string, error?: unknown) {
    this.addEntry('error', message, error);
    eagleApi.log.error(message, error);
  }

  // Get recent logs for debugging
  getRecentLogs(count = 50): LogEntry[] {
    return this.logs.slice(-count);
  }

  // Export logs for bug reports
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

export const logger = new Logger();
```

### Usage

```tsx
import { logger } from '@/lib/logger';

// In components
logger.info('Component mounted', { id: componentId });
logger.warn('Slow render detected', { duration: renderTime });
logger.error('Render error', error);

// Get logs for debugging
const recentLogs = logger.getRecentLogs(100);

// Export for bug report
const logExport = logger.exportLogs();
```

## React Integration

### useLogger Hook

```tsx
import { useCallback, useMemo } from 'react';
import { eagleApi } from '@/lib/eagle-api';

function useLogger(prefix: string) {
  const log = useMemo(() => ({
    debug: (...args: unknown[]) => {
      if (import.meta.env.DEV) {
        eagleApi.log(`[${prefix}]`, ...args);
      }
    },
    info: (...args: unknown[]) => {
      eagleApi.log.info(`[${prefix}]`, ...args);
    },
    warn: (...args: unknown[]) => {
      eagleApi.log.warn(`[${prefix}]`, ...args);
    },
    error: (...args: unknown[]) => {
      eagleApi.log.error(`[${prefix}]`, ...args);
    },
  }), [prefix]);

  return log;
}

// Usage
function ImageEditor() {
  const log = useLogger('ImageEditor');

  useEffect(() => {
    log.info('Editor mounted');
    return () => log.info('Editor unmounted');
  }, []);

  const handleSave = async () => {
    log.debug('Save started');
    try {
      await save();
      log.info('Save completed');
    } catch (error) {
      log.error('Save failed', error);
    }
  };

  return <div>...</div>;
}
```

### Error Boundary with Logging

```tsx
class LoggingErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    eagleApi.log.error('React Error Boundary caught error', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    });
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}
```

## Browser vs Eagle Behavior

| Method | Browser (Mock) | Eagle |
|--------|----------------|-------|
| `log()` | `console.log()` | Writes to Eagle log file |
| `info()` | `console.info()` | Writes to Eagle log file |
| `warn()` | `console.warn()` | Writes to Eagle log file |
| `error()` | `console.error()` | Writes to Eagle log file |

### Log File Location

In Eagle, logs are written to the plugin's log file:
- **macOS:** `~/Library/Logs/Eagle/plugins/<plugin-id>.log`
- **Windows:** `%APPDATA%\Eagle\Logs\plugins\<plugin-id>.log`

## Best Practices

### ✅ Do

```tsx
// Log with context
eagleApi.log.info('Export completed', { 
  count: items.length, 
  format: 'png',
  duration: '2.5s' 
});

// Log errors with stack traces
try {
  await riskyOperation();
} catch (error) {
  eagleApi.log.error('Operation failed', {
    message: error.message,
    stack: error.stack,
  });
}

// Use appropriate log levels
eagleApi.log.info('Normal operation');
eagleApi.log.warn('Potential issue');
eagleApi.log.error('Actual error');

// Prefix component logs
eagleApi.log.info('[ImageEditor] Image loaded', { id });
```

### ❌ Don't

```tsx
// Don't log sensitive data
eagleApi.log('User password:', password);
eagleApi.log('API key:', apiKey);

// Don't log excessive data
eagleApi.log('All items:', allItems);  // Could be thousands

// Don't log in tight loops
for (const item of items) {
  eagleApi.log('Processing', item);  // Too many logs!
}

// Instead, log summary
eagleApi.log.info('Processing items', { count: items.length });
// ... process all items ...
eagleApi.log.info('Processing complete', { count: items.length });
```

## Related

- [Eagle API Overview](./overview) - API introduction
- [Events & Lifecycle](./events-lifecycle) - Plugin lifecycle events
- [Error Boundary](../components/error/error-boundary) - Error handling UI
