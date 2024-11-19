import { HttpException } from '@nestjs/common';

export interface ExceptionMapping {
  exception: new (...args: any[]) => Error;
  httpException: new (message: string) => HttpException;
}
