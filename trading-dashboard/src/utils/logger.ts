type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class Logger {
  private static instance: Logger;
  private logLevel: LogLevel = import.meta.env.DEV ? 'debug' : 'info';
  private performanceLogs: Map<string, number> = new Map();

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
    return levels.indexOf(level) >= levels.indexOf(this.logLevel);
  }

  private formatMessage(level: LogLevel, message: string, data?: unknown): string {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] ${level.toUpperCase()}`;
    return data ? `${prefix}: ${message} ${JSON.stringify(data)}` : `${prefix}: ${message}`;
  }

  debug(message: string, data?: unknown): void {
    if (this.shouldLog('debug')) {
      console.debug(this.formatMessage('debug', message, data));
    }
  }

  info(message: string, data?: unknown): void {
    if (this.shouldLog('info')) {
      console.info(this.formatMessage('info', message, data));
    }
  }

  warn(message: string, data?: unknown): void {
    if (this.shouldLog('warn')) {
      console.warn(this.formatMessage('warn', message, data));
    }
  }

  error(message: string, error?: unknown): void {
    if (this.shouldLog('error')) {
      console.error(this.formatMessage('error', message, error));
    }
  }

  startPerformance(operation: string): void {
    this.performanceLogs.set(operation, performance.now());
    this.debug(`Performance: Started ${operation}`);
  }

  endPerformance(operation: string): void {
    const start = this.performanceLogs.get(operation);
    if (start) {
      const duration = performance.now() - start;
      this.performanceLogs.delete(operation);
      this.debug(`Performance: ${operation} completed in ${duration.toFixed(2)}ms`);

      if (duration > 100) {
        this.warn(`Performance: ${operation} took ${duration.toFixed(2)}ms (slow)`);
      }
    }
  }
}

export const logger = Logger.getInstance();
