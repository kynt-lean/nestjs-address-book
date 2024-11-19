import { Module } from '@nestjs/common';
import { context, trace } from '@opentelemetry/api';
import { ClsModule } from 'nestjs-cls';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { AuditLoggingCoreModule } from '../core/audit-logging/audit-logging-core.module';
import { AuthenticationModule } from '../core/authentication';
import { ConfigurationModule } from '../core/configuration';
import { DatabaseModule } from '../core/database';
import { ExceptionHandlersModule } from '../core/exception-handlers/exception-handlers.module';
import { ExceptionMapping } from '../core/exception-handlers/exception-mapping';
import { LoggerModule } from '../core/loggers';
import { parsePostgresConnectionString } from '../utils/pg.util';
import { config } from './app.config';
import { AuditLoggingModule } from './audit-logging/audit-logging.module';
import { LocationsModule } from './locations/locations.module';

const loggingRedactPaths = [
  'req.headers.cookie',
  'req.headers.authorization',
  'req.body.token',
  'req.body.refreshToken',
  'req.body.email',
  'req.body.password',
  'req.body.oldPassword',
];

const exceptionMappings: ExceptionMapping[] = [
  // { exception: CustomException, httpException: CustomHttpException },
  // Add more mappings as needed
];

@Module({
  imports: [
    ConfigurationModule.forRoot({ config }),
    LoggerModule.forRoot(),
    PinoLoggerModule.forRoot({
      pinoHttp: {
        redact: loggingRedactPaths,
        formatters: {
          log(object) {
            const span = trace.getSpan(context.active());
            if (!span) return { ...object };
            const { spanId, traceId } = trace
              .getSpan(context.active())
              ?.spanContext();
            return { ...object, spanId, traceId };
          },
        },
      },
    }),
    DatabaseModule.forRoot({
      dataSourceOptions: { autoLoadEntities: true },
      parseConnectionStringFactory: parsePostgresConnectionString,
    }),
    ClsModule.forRootAsync({
      useFactory: () => ({
        interceptor: { mount: true },
        guard: { mount: true },
        middleware: { mount: true },
      }),
      global: true,
    }),
    AuthenticationModule.forRoot({
      authenGuards: [],
      userMapper: (user) => ({
        userId: 'fake user id',
        appId: 'fake app id',
      }),
    }),
    ExceptionHandlersModule.forRoot(exceptionMappings),
    AuditLoggingCoreModule.forRoot(),
    AuditLoggingModule,
    LocationsModule,
  ],
})
export class AppModule {}
