// This import must be before any other imports
import otelSDK from './tracer';

// These imports must be after the otelSDK import
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app/app.module';
import { patchLoggerEventToTracer } from './patch-logger-event-to-tracer';

async function bootstrap() {
  // Start the OpenTelemetry SDK
  otelSDK.start();

  // Patch the Logger to add events to the active span
  patchLoggerEventToTracer();

  // Application configuration
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  const logger = app.get(Logger);
  app.useLogger(logger);

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('The API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Start the application
  await app.listen(process.env.PORT ?? 3000);
  logger.log(`Server is running on port ${process.env.PORT ?? 3000}`);
}

bootstrap();
