import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  ForbiddenException,
  HttpException,
  Inject,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';
import {
  PermissionException,
  ResourceNotFoundException,
  ValidationException,
} from './common-exceptions';
import { ExceptionMapping } from './exception-mapping';

@Catch(Error)
export class RequestExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject('EXCEPTION_MAPPINGS') private readonly mappings: ExceptionMapping[],
  ) {}

  public catch(exception: Error, host: ArgumentsHost): any {
    const ctxType = host.getType();

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
    for (const mapping of this.mappings) {
      if (exception instanceof mapping.exception) {
        return new mapping.httpException(exception.message);
      }
    }

    if (exception instanceof HttpException) return exception;
    if (exception instanceof ValidationException)
      return new BadRequestException(exception.message);
    if (exception instanceof PermissionException)
      return new ForbiddenException(exception.message);
    if (exception instanceof ResourceNotFoundException)
      return new NotFoundException(exception.message);

    return new InternalServerErrorException(
      exception instanceof QueryFailedError
        ? 'Query failed error, view log to see detail.'
        : exception.message,
    );
  }
}
