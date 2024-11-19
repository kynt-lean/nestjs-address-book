import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  HttpException,
  Inject,
  Injectable,
  Logger,
  Optional,
  Type,
  UnauthorizedException,
} from '@nestjs/common';
import { ModuleRef, ModuleRefGetOrResolveOpts } from '@nestjs/core';
import { AsyncResource } from 'async_hooks';
import {
  Observable,
  catchError,
  concatMap,
  count,
  defer,
  filter,
  from,
  mergeMap,
  of,
  switchMap,
  takeWhile,
  tap,
  throwError,
} from 'rxjs';
import { getRequestUser } from '../../utils/request.util';
import { InjectLogger } from '../loggers/decorator';
import {
  AUTHENTICATION_OPTIONS,
  AuthenticationGuardWrapper,
  AuthenticationOptions,
} from './authentication-options';
import { CurrentUserService } from './current-user.service';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    @InjectLogger('AuthenticationGuard') private readonly logger: Logger,
    private readonly currentUserService: CurrentUserService,
    private readonly moduleRef: ModuleRef,
    @Inject(AUTHENTICATION_OPTIONS)
    @Optional()
    private readonly options?: AuthenticationOptions,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    if (this.options) {
      const { sequence, authenGuards, authorGuards } = this.options;
      return defer(() => {
        if (authenGuards?.length) {
          const authenChain = this.activateChain(
            context,
            authenGuards,
            sequence,
          );
          return authorGuards?.length
            ? authenChain.pipe(
                tap((_) => this.setCurrentUser(context)),
                switchMap(() =>
                  this.activateChain(
                    context,
                    authorGuards,
                    sequence,
                    ForbiddenException,
                  ),
                ),
              )
            : authenChain;
        } else {
          if (authorGuards?.length) {
            return this.activateChain(context, authorGuards, sequence);
          }
        }
        return of(true).pipe(tap((_) => this.setCurrentUser(context)));
      });
    }
    return true;
  }

  private setCurrentUser(context: ExecutionContext) {
    const currentUserMapper = this.options?.currentUserMapper;
    if (currentUserMapper) {
      const user = getRequestUser(context);
      const mappedUser = currentUserMapper(user);
      this.currentUserService.setCurrentUser(mappedUser);
    }
  }

  private activateChain(
    context: ExecutionContext,
    guards: AuthenticationGuardWrapper[],
    sequence?: boolean,
    exceptionType?: Type<HttpException>,
  ): Observable<boolean> {
    let activeGuardsLength = guards.length;
    return from(guards).pipe(
      (sequence ? concatMap : mergeMap)((wrapper) => {
        return (
          ('activeWhen' in wrapper
            ? defer(
                AsyncResource.bind(() =>
                  transformDeferred(() => this.transformGuardWrapper(wrapper)),
                ),
              )
            : of({
                guard: wrapper,
                active: true,
              })) as Observable<{
            guard: Type<CanActivate>;
            active: boolean;
          }>
        ).pipe(
          tap(({ active }) => {
            if (!active) {
              activeGuardsLength--;
            }
          }),
          filter(({ active }) => active),
          switchMap(({ guard }) => {
            const activation = () =>
              Promise.resolve(
                this.moduleRef
                  .get(guard, { strict: false })
                  .canActivate(context),
              );
            return defer(
              AsyncResource.bind(() => transformDeferred(activation)),
            );
          }),
          catchError((err) => {
            this.logger.error(err.stack);
            return of(false);
          }),
        );
      }),
      takeWhile((pass) => pass !== true),
      count(),
      switchMap((count) =>
        count < activeGuardsLength
          ? of(true)
          : throwError(() =>
              exceptionType ? new exceptionType() : new UnauthorizedException(),
            ),
      ),
    );
  }

  private async transformGuardWrapper(wrapper: {
    guard: Type<CanActivate>;
    activeWhen: (
      getInject: <TInput = any, TResult = TInput>(
        typeOrToken: Type<TInput> | string | symbol,
        options?: ModuleRefGetOrResolveOpts,
      ) => TResult,
    ) => boolean | Promise<boolean>;
  }) {
    const getInject = this.moduleRef.get.bind(this.moduleRef);
    const active = await transformPromiseBoolean(() =>
      wrapper.activeWhen(getInject),
    );
    return {
      guard: wrapper.guard,
      active,
    };
  }
}

const transformPromiseBoolean = async (
  promise: () => boolean | Promise<boolean>,
) => {
  const res = promise();
  return res instanceof Promise ? await res : res;
};

const transformDeferred = (promise: () => Promise<any>): Observable<any> => {
  return from(promise()).pipe(
    switchMap((res) => {
      const isDeferred = res instanceof Promise || res instanceof Observable;
      return isDeferred ? res : Promise.resolve(res);
    }),
  );
};
