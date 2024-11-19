import { Logger, Provider } from '@nestjs/common';
import { prefixesForLoggers } from './decorator';
import { getLoggerToken } from './token';

export const createLoggerProviders = (): Provider<Logger>[] =>
  prefixesForLoggers.map(prefix => createLoggerProvider(prefix));

const createLoggerProvider = (prefix: string): Provider<Logger> => ({
  provide: getLoggerToken(prefix),
  useFactory: () => loggerFactory(prefix),
});

const loggerFactory = (prefix: string): Logger => {
  return new Logger(prefix);
};
