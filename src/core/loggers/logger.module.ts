import { DynamicModule, Module } from '@nestjs/common';
import { createLoggerProviders } from './providers';

@Module({})
export class LoggerModule {
  public static forRoot(): DynamicModule {
    const prefixedLoggerProviders = createLoggerProviders();
    return {
      module: LoggerModule,
      providers: [...prefixedLoggerProviders],
      exports: [...prefixedLoggerProviders],
      global: true,
    };
  }
}
