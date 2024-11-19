import { CanActivate, Type } from '@nestjs/common';
import { ModuleRefGetOrResolveOpts } from '@nestjs/core';
import { CurrentUserMapper } from './current-user-mapper';

export interface AuthenticationOptions {
  sequence?: boolean;
  authenGuards?: AuthenticationGuardWrapper[];
  authorGuards?: AuthenticationGuardWrapper[];
  userMapper?: CurrentUserMapper;
}

export type AuthenticationGuardWrapper =
  | Type<CanActivate>
  | {
      guard: Type<CanActivate>;
      activeWhen: (
        getInject: <TInput = any, TResult = TInput>(
          typeOrToken: Type<TInput> | string | symbol,
          options?: ModuleRefGetOrResolveOpts,
        ) => TResult,
      ) => boolean | Promise<boolean>;
    };

export const AUTHENTICATION_OPTIONS = 'AUTHENTICATION_OPTIONS';
