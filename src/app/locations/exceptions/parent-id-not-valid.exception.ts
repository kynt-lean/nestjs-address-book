import { BusinessException } from '../../../core/exception-handlers/common-exceptions';

export class ParentIdNotValidException extends BusinessException {
  constructor(parentId: string) {
    super(`The provided location's parentId ${parentId} is not valid.`);
  }
}
