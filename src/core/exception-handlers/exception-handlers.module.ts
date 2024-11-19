import { DynamicModule, Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { ExceptionMapping } from './exception-mapping';
import { RequestExceptionFilter } from './request-exception-filter';

@Module({})
export class ExceptionHandlersModule {
  static forRoot(mappings: ExceptionMapping[] = []): DynamicModule {
    return {
      module: ExceptionHandlersModule,
      providers: [
        {
          provide: 'EXCEPTION_MAPPINGS',
          useValue: mappings,
        },
        {
          provide: APP_FILTER,
          useClass: RequestExceptionFilter,
        },
      ],
    };
  }
}
