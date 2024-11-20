import { Injectable, NestMiddleware } from '@nestjs/common';
import { context, trace } from '@opentelemetry/api';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class TraceIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const currentSpan = trace.getSpan(context.active());
    if (currentSpan) {
      const traceId = currentSpan.spanContext().traceId;
      res.setHeader('X-Trace-Id', traceId);
    }
    next();
  }
}
