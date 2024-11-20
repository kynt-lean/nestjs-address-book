import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  ForbiddenException,
  HttpException,
  Inject,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';
import { InjectLogger } from '../loggers/decorator';
import {
  BusinessException,
  PermissionException,
  ResourceNotFoundException,
  ValidationException,
} from './common-exceptions';
import { ExceptionMapping } from './exception-mapping';

@Catch(Error)
export class RequestExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject('EXCEPTION_MAPPINGS') private readonly mappings: ExceptionMapping[],
    @InjectLogger('RequestExceptionFilter') private logger: Logger,
  ) {}

  public catch(exception: Error, host: ArgumentsHost): any {
    const ctxType = host.getType();

    this.logger.error(exception.stack);

    switch (ctxType) {
      case 'http':
        {
          const req = host.switchToHttp().getRequest<Request>();
          const res = host.switchToHttp().getResponse<Response>();
          const httpException = this.createHttpExceptionFactory(exception);
          res
            .status(httpException.getStatus())
            .json(httpException.getResponse());
        }
        break;

      default:
        break;
    }
  }

  protected createHttpExceptionFactory(exception: Error): HttpException {
    if (exception instanceof HttpException) return exception;

    for (const mapping of this.mappings) {
      if (exception instanceof mapping.exception) {
        return new mapping.httpException(exception.message);
      }
    }

    if (exception instanceof ValidationException)
      return new BadRequestException(exception.message);

    if (exception instanceof PermissionException)
      return new ForbiddenException(exception.message);

    if (exception instanceof ResourceNotFoundException)
      return new NotFoundException(exception.message);

    if (exception instanceof BusinessException)
      return new BadRequestException(exception.message);

    return new InternalServerErrorException(
      exception instanceof QueryFailedError
        ? 'Query failed error, view log to see detail.'
        : exception.message,
    );
  }
}
