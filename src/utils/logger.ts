type LogLevel = 'debug' | 'info' | 'warn' | 'error';

class Logger {
  private static instance: Logger;
  private logLevel: LogLevel = import.meta.env.DEV ? 'debug' : 'info';

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  debug(message: string, data?: any): void {
    if (this.logLevel === 'debug') {
      console.debug(`[DEBUG] ${message}`, data || '');
    }
  }

  info(message: string, data?: any): void {
    console.info(`[INFO] ${message}`, data || '');
  }

  warn(message: string, data?: any): void {
    console.warn(`[WARN] ${message}`, data || '');
  }

  error(message: string, error?: any): void {
    console.error(`[ERROR] ${message}`, error || '');
  }
}

export const logger = Logger.getInstance();