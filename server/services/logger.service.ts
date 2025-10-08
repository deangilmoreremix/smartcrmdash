/**
 * Logger service for consistent logging across the application
 */
export const logger = {
  info: (message: string, metadata?: any) => {
    console.log(JSON.stringify({
      level: 'info',
      message,
      timestamp: new Date().toISOString(),
      ...metadata
    }));
  },

  warn: (message: string, error?: any, metadata?: any) => {
    console.warn(JSON.stringify({
      level: 'warn',
      message,
      error: error?.message || error,
      timestamp: new Date().toISOString(),
      ...metadata
    }));
  },

  error: (message: string, error?: any, metadata?: any) => {
    console.error(JSON.stringify({
      level: 'error',
      message,
      error: error?.message || error,
      timestamp: new Date().toISOString(),
      ...metadata
    }));
  },

  debug: (message: string, metadata?: any) => {
    console.debug(JSON.stringify({
      level: 'debug',
      message,
      timestamp: new Date().toISOString(),
      ...metadata
    }));
  }
};