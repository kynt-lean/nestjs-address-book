import { Inject } from '@nestjs/common';
import { getLoggerToken } from './token';

export const prefixesForLoggers: string[] = [];
export const InjectLogger = (prefix = ''): PropertyDecorator & ParameterDecorator => {
  if (!prefixesForLoggers.includes(prefix)) {
    prefixesForLoggers.push(prefix);
  }
  return Inject(getLoggerToken(prefix));
};
