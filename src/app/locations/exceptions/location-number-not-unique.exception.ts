import { BusinessException } from '../../../core/exception-handlers/common-exceptions';

export class LocationNumberNotUniqueException extends BusinessException {
  constructor(locationNumber: string) {
    super(`The location number "${locationNumber}" is already in use.`);
  }
}
