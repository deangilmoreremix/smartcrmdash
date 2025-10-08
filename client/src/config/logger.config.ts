/**
 * Production Logger Configuration
 * Replaces console logging with structured logging that can be disabled in production
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LoggerConfig {
  enabled: boolean;
  level: LogLevel;
  includeTimestamp: boolean;
  includeStackTrace: boolean;
}

const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;

const config: LoggerConfig = {
  enabled: isDevelopment,
  level: isDevelopment ? 'debug' : 'error',
  includeTimestamp: true,
  includeStackTrace: isProduction,
};

class Logger {
  private config: LoggerConfig;

  constructor(config: LoggerConfig) {
    this.config = config;
  }

  private shouldLog(level: LogLevel): boolean {
    if (!this.config.enabled) return false;

    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
    const currentLevelIndex = levels.indexOf(this.config.level);
    const requestedLevelIndex = levels.indexOf(level);

    return requestedLevelIndex >= currentLevelIndex;
  }

  private formatMessage(level: LogLevel, message: string, ...args: any[]): string {
    const timestamp = this.config.includeTimestamp
      ? `[${new Date().toISOString()}]`
      : '';

    return `${timestamp} [${level.toUpperCase()}] ${message}`;
  }

  debug(message: string, ...args: any[]): void {
    if (this.shouldLog('debug')) {
      console.debug(this.formatMessage('debug', message), ...args);
    }
  }

  info(message: string, ...args: any[]): void {
    if (this.shouldLog('info')) {
      console.info(this.formatMessage('info', message), ...args);
    }
  }

  warn(message: string, ...args: any[]): void {
    if (this.shouldLog('warn')) {
      console.warn(this.formatMessage('warn', message), ...args);
    }
  }

  error(message: string, error?: Error | unknown, ...args: any[]): void {
    if (this.shouldLog('error')) {
      console.error(this.formatMessage('error', message), error, ...args);

      if (this.config.includeStackTrace && error instanceof Error) {
        console.error('Stack trace:', error.stack);
      }
    }
  }

  group(label: string): void {
    if (this.shouldLog('debug')) {
      console.group(label);
    }
  }

  groupEnd(): void {
    if (this.shouldLog('debug')) {
      console.groupEnd();
    }
  }
}

export const logger = new Logger(config);

export const setLogLevel = (level: LogLevel): void => {
  config.level = level;
};

export const enableLogging = (enabled: boolean): void => {
  config.enabled = enabled;
};
