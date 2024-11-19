export * from './logger.module';

declare global {
  namespace App {
    interface Configuration {
      logger?: LogConfiguration;
    }

    interface LogConfiguration {
      logLevel?: LogLevel;

      /**
       * Maximum number of logs to keep. If not set, no logs will be removed. This can be a number of files or number of days. If using days, add 'd' as the suffix. (default: null)
       */
      maxFiles?: string | number;
    }

    type LogLevel = 'verbose' | 'debug' | 'info' | 'warn' | 'error';
  }
}
