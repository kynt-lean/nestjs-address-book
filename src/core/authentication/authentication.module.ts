import { DynamicModule, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import {
  AUTHENTICATION_OPTIONS,
  AuthenticationOptions,
} from './authentication-options';
import { AuthenticationGuard } from './authentication.guard';
import { CurrentUserService } from './current-user.service';

@Module({})
export class AuthenticationModule {
  static forRoot(options?: AuthenticationOptions): DynamicModule {
    return {
      module: AuthenticationModule,
      global: true,
      providers: [
        {
          provide: AUTHENTICATION_OPTIONS,
          useValue: options,
        },
        {
          provide: APP_GUARD,
          useClass: AuthenticationGuard,
        },
        CurrentUserService,
      ],
      exports: [CurrentUserService],
    };
  }
}
