import {
  ArgumentMetadata,
  Inject,
  Injectable,
  Optional,
  ValidationError,
  ValidationPipe,
  ValidationPipeOptions,
} from '@nestjs/common';
import { isIso8601 } from '../../utils/date.util';
import { specialStringMapper } from '../../utils/string.util';
import { ValidationException } from '../exception-handlers/common-exceptions';
import { TRANSFORMATION_AND_VALIDATION_OPTIONS } from './transformation-and-validation-options.token';

@Injectable()
export class TransformationAndValidationPipe extends ValidationPipe {
  constructor(
    @Optional()
    @Inject(TRANSFORMATION_AND_VALIDATION_OPTIONS)
    options?: ValidationPipeOptions,
  ) {
    super({
      transform: true,
      transformOptions: {
        excludeExtraneousValues: true,
      },
      ...(options || {}),
    });
  }

  public override transform(
    value: any,
    metadata: ArgumentMetadata,
  ): Promise<any> {
    const { type, metatype } = metadata;
    if (this.isTransformEnabled && type !== 'custom' && metatype && value) {
      this.recursiveDeserializeValue(value);
    }
    return super.transform(value, metadata);
  }

  public override createExceptionFactory(): (
    validationErrors?: ValidationError[],
  ) => unknown {
    return (validationErrors = []) => {
      const errors = this.flattenValidationErrors(validationErrors);
      if (this.isDetailedOutputDisabled) {
        return new ValidationException(errors);
      }
      return new ValidationException(errors, true);
    };
  }

  protected recursiveDeserializeValue(obj: any): any {
    if (obj === null || obj === undefined) {
      return obj;
    }

    if (typeof obj !== 'object') {
      return obj;
    }

    for (const key of Object.keys(obj)) {
      const value = obj[key];

      if (typeof value === 'object') {
        this.recursiveDeserializeValue(value);
      }

      if (typeof value === 'string') {
        if (isIso8601(value)) {
          obj[key] = new Date(value);
        } else if (specialStringMapper.has(value)) {
          obj[key] = specialStringMapper.get(value);
        }
      }
    }
  }
}
