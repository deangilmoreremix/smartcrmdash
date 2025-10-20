type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  data?: any;
  timestamp: string;
  userAgent?: string;
  url?: string;
}

class Logger {
  private isDevelopment = import.meta.env.DEV;
  private logs: LogEntry[] = [];
  private maxLogs = 1000;

  private createLogEntry(level: LogLevel, message: string, data?: any): LogEntry {
    return {
      level,
      message,
      data,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };
  }

  private log(level: LogLevel, message: string, data?: any) {
    const entry = this.createLogEntry(level, message, data);

    // Store in memory for debugging
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Only log to console in development
    if (this.isDevelopment) {
      const logMethod = level === 'debug' ? 'log' :
                        level === 'info' ? 'info' :
                        level === 'warn' ? 'warn' : 'error';

      console[logMethod](`[${level.toUpperCase()}] ${message}`, data || '');
    }

    // In production, you could send to logging service
    if (!this.isDevelopment && level === 'error') {
      this.sendToLoggingService(entry);
    }
  }

  debug(message: string, data?: any) {
    this.log('debug', message, data);
  }

  info(message: string, data?: any) {
    this.log('info', message, data);
  }

  warn(message: string, data?: any) {
    this.log('warn', message, data);
  }

  error(message: string, data?: any) {
    this.log('error', message, data);
  }

  // Get recent logs for debugging
  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  // Clear logs
  clearLogs() {
    this.logs = [];
  }

  // Send critical errors to logging service (implement based on your needs)
  private sendToLoggingService(entry: LogEntry) {
    // Example: Send to your logging service
    // fetch('/api/logs', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(entry),
    // }).catch(() => {
    //   // Silently fail if logging service is unavailable
    // });
  }
}

export const logger = new Logger();

// Performance logging utility
export const performanceLogger = {
  start: (label: string) => {
    if (import.meta.env.DEV) {
      console.time(label);
    }
  },

  end: (label: string) => {
    if (import.meta.env.DEV) {
      console.timeEnd(label);
    }
  },

  measure: (label: string, fn: () => void) => {
    if (import.meta.env.DEV) {
      console.time(label);
      fn();
      console.timeEnd(label);
    } else {
      fn();
    }
  }
};