# Production Logger Usage Guide

## Overview

The production logger system automatically manages console output based on the environment. In production builds, all console statements are removed to improve performance and reduce bundle size.

## Quick Start

```typescript
import { logger } from '@/config/logger.config';

// Instead of console.log
logger.info('User logged in successfully', { userId: user.id });

// Instead of console.warn
logger.warn('API rate limit approaching', { remaining: 10 });

// Instead of console.error
logger.error('Failed to save data', error, { context: 'saveUserProfile' });

// Instead of console.debug
logger.debug('Component rendered', { props, state });
```

## Features

### Environment-Aware Logging

- **Development**: All logs enabled (debug, info, warn, error)
- **Production**: Only error logs enabled
- **Automatic**: No manual configuration needed

### Log Levels

1. **debug** - Detailed diagnostic information
   - Use for: Component lifecycles, state changes, function calls
   - Shown in: Development only

2. **info** - General informational messages
   - Use for: Successful operations, user actions, state updates
   - Shown in: Development only

3. **warn** - Warning messages
   - Use for: Deprecated features, approaching limits, non-critical issues
   - Shown in: Development only

4. **error** - Error messages
   - Use for: Exceptions, failed operations, critical issues
   - Shown in: Development and Production

### Timestamps

All log messages include timestamps in ISO format:
```
[2025-10-06T13:45:23.123Z] [INFO] User logged in successfully
```

### Stack Traces

Errors automatically include stack traces in production for debugging:
```typescript
try {
  await saveData();
} catch (error) {
  logger.error('Failed to save data', error); // Stack trace included
}
```

## Migration Examples

### Before (Console Logging)
```typescript
// ❌ Don't do this
console.log('Fetching contacts...');
console.warn('Deprecated API endpoint');
console.error('Network request failed:', error);
console.debug('Component state:', this.state);
```

### After (Structured Logging)
```typescript
// ✅ Do this
logger.info('Fetching contacts...');
logger.warn('Deprecated API endpoint');
logger.error('Network request failed', error);
logger.debug('Component state:', this.state);
```

## Advanced Usage

### Grouping Logs

```typescript
logger.group('User Authentication');
logger.info('Validating credentials');
logger.info('Checking permissions');
logger.info('Generating token');
logger.groupEnd();
```

### Conditional Logging

```typescript
// Logger automatically handles environment checks
if (import.meta.env.DEV) {
  logger.debug('Development-only debug info', data);
}
```

### Dynamic Log Levels

```typescript
import { setLogLevel, enableLogging } from '@/config/logger.config';

// Change log level at runtime (useful for debugging)
setLogLevel('debug'); // 'debug' | 'info' | 'warn' | 'error'

// Disable logging completely
enableLogging(false);

// Re-enable logging
enableLogging(true);
```

## Path Aliases

The logger is available via path alias:
```typescript
// All of these work:
import { logger } from '@/config/logger.config';
import { logger } from '../config/logger.config';
import { logger } from '../../config/logger.config';
```

## Best Practices

### 1. Use Appropriate Log Levels
```typescript
// ✅ Good
logger.debug('Rendering component', { props });
logger.info('Data fetched successfully', { count: data.length });
logger.warn('Cache miss, fetching from API');
logger.error('Failed to parse response', error);

// ❌ Bad
logger.error('Component rendered'); // Should be debug
logger.info('Critical security issue'); // Should be error
```

### 2. Include Context
```typescript
// ✅ Good
logger.error('Failed to save contact', error, {
  contactId: contact.id,
  operation: 'update',
  retryCount: 3
});

// ❌ Bad
logger.error('Save failed', error); // Missing context
```

### 3. Avoid Logging Sensitive Data
```typescript
// ✅ Good
logger.info('User authenticated', {
  userId: user.id,
  role: user.role
});

// ❌ Bad
logger.info('User authenticated', {
  password: user.password, // Never log passwords!
  token: user.authToken    // Never log tokens!
});
```

### 4. Use in Error Boundaries
```typescript
class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error('React error boundary caught error', error, {
      componentStack: errorInfo.componentStack
    });
  }
}
```

## Production Behavior

In production builds:
- `logger.debug()` - **Removed** (no output, no code in bundle)
- `logger.info()` - **Removed** (no output, no code in bundle)
- `logger.warn()` - **Removed** (no output, no code in bundle)
- `logger.error()` - **Active** (includes stack traces)

This is enforced by:
1. **Vite build configuration** - Removes console.* via Terser
2. **Logger configuration** - Automatically adjusts based on environment
3. **Dead code elimination** - Unused log levels are tree-shaken

## Performance Impact

### Development
- Minimal overhead
- Full logging capabilities
- No performance concerns

### Production
- Zero overhead for debug/info/warn logs (removed from bundle)
- Minimal overhead for error logs
- Reduced bundle size (console.log statements removed)
- Faster execution (fewer function calls)

## TypeScript Support

The logger is fully typed:
```typescript
logger.debug(message: string, ...args: any[]): void
logger.info(message: string, ...args: any[]): void
logger.warn(message: string, ...args: any[]): void
logger.error(message: string, error?: Error | unknown, ...args: any[]): void
logger.group(label: string): void
logger.groupEnd(): void
```

## Testing

In tests, you can mock the logger:
```typescript
import { logger } from '@/config/logger.config';

jest.mock('@/config/logger.config', () => ({
  logger: {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  }
}));

it('logs error on failure', () => {
  // Your test code
  expect(logger.error).toHaveBeenCalledWith('Expected error message', expect.any(Error));
});
```

## Migration Checklist

- [ ] Import logger in files using console.*
- [ ] Replace console.log with logger.info or logger.debug
- [ ] Replace console.warn with logger.warn
- [ ] Replace console.error with logger.error
- [ ] Add context objects to error logs
- [ ] Remove sensitive data from logs
- [ ] Test in both development and production modes
- [ ] Update any existing logging utilities

## Common Patterns

### API Requests
```typescript
logger.info('Fetching data', { endpoint, params });
const response = await fetch(endpoint);
if (!response.ok) {
  logger.error('API request failed', new Error(response.statusText), {
    endpoint,
    status: response.status
  });
}
logger.info('Data fetched successfully', { count: data.length });
```

### User Actions
```typescript
logger.info('User action', {
  action: 'button_click',
  buttonId: 'save',
  timestamp: Date.now()
});
```

### State Updates
```typescript
logger.debug('State updated', {
  previous: prevState,
  current: newState,
  trigger: 'user_action'
});
```

### Error Handling
```typescript
try {
  await riskyOperation();
} catch (error) {
  logger.error('Operation failed', error, {
    operation: 'riskyOperation',
    retryable: true
  });
  throw error; // Re-throw if needed
}
```

## Questions?

For questions or issues with the logging system:
1. Check the logger configuration at `/client/src/config/logger.config.ts`
2. Review the build configuration at `/vite.config.ts`
3. Verify environment variables are set correctly

---

**Last Updated**: October 6, 2025
**Version**: 1.0.0
