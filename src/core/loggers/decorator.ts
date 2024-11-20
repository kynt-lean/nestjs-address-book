import { Inject } from '@nestjs/common';
import { prefixesForLoggers } from './constants';
import { getLoggerToken } from './token';

export const InjectLogger = (
  prefix = '',
): PropertyDecorator & ParameterDecorator => {
  if (!prefixesForLoggers.includes(prefix)) {
    prefixesForLoggers.push(prefix);
  }
  return Inject(getLoggerToken(prefix));
};
