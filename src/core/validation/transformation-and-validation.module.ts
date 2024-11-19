import { DynamicModule, Module, ValidationPipeOptions } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { TRANSFORMATION_AND_VALIDATION_OPTIONS } from './transformation-and-validation-options.token';
import { TransformationAndValidationPipe } from './transformation-and-validation.pipe';

export interface TransformationAndValidationOptions {
  validation?: ValidationPipeOptions;
}

@Module({})
export class TransformationAndValidationModule {
  public static forRoot(options?: TransformationAndValidationOptions): DynamicModule {
    return {
      module: TransformationAndValidationModule,
      providers: [
        {
          provide: TRANSFORMATION_AND_VALIDATION_OPTIONS,
          useValue: options?.validation,
        },
        {
          provide: APP_PIPE,
          useClass: TransformationAndValidationPipe,
        },
        TransformationAndValidationPipe,
      ],
      exports: [TransformationAndValidationPipe],
      global: true,
    };
  }
}
