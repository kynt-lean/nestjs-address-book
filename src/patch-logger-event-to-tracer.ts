import { Logger } from '@nestjs/common';
import api from '@opentelemetry/api';

export const patchLoggerEventToTracer = () => {
  const patchMethods = (target: any) => {
    Object.getOwnPropertyNames(target).forEach((method) => {
      if (typeof target[method] === 'function') {
        const paramNames = getParamNames(target[method]);
        if (paramNames[0] === 'message') {
          const originalMethod = target[method];
          target[method] = function (
            message: string,
            ...optionalParams: any[]
          ) {
            // Add event to the active span
            const activeSpan = api.trace.getSpan(api.context.active());
            if (activeSpan) {
              activeSpan.addEvent(message);
            }
            // Call the original method
            originalMethod.call(this, message, ...optionalParams);
          };
        }
      }
    });
  };

  const getParamNames = (func: Function): string[] => {
    const fnStr = func
      .toString()
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\/\/(.)*/g, '');
    const result = fnStr
      .slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')'))
      .match(/([^\s,]+)/g);
    return result === null ? [] : result;
  };

  // Patch instance methods
  patchMethods(Logger.prototype);

  // Patch static methods
  patchMethods(Logger);
};
