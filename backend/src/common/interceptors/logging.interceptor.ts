import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { randomUUID } from 'crypto';

const SENSITIVE_KEYS = [
  'password',
  'token',
  'authorization',
  'secret',
  'accessToken',
  'refreshToken',
];

function sanitize(obj: any): any {
  if (!obj || typeof obj !== 'object') return obj;
  const clone: any = Array.isArray(obj) ? [] : {};
  for (const key of Object.keys(obj)) {
    if (SENSITIVE_KEYS.includes(key.toLowerCase())) {
      clone[key] = '***REDACTED***';
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      clone[key] = sanitize(obj[key]);
    } else {
      clone[key] = obj[key];
    }
  }
  return clone;
}

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const { method, url, body, query, params } = request;
    const userAgent = request.get('user-agent') || 'unknown';
    const userId = request?.user?.id || 'unauthenticated';
    const ip = request.ip || request.connection?.remoteAddress || 'unknown';

    // 请求追踪 ID：优先复用上游传入的（比如网关/前端生成的），否则自己生成
    const requestId = request.headers['x-request-id'] || randomUUID();
    request.requestId = requestId; // 方便在其它地方（如全局异常过滤器）取用
    if (response?.setHeader) {
      response.setHeader('x-request-id', requestId);
    }

    const startTime = Date.now();

    this.logger.log({
      requestId,
      method,
      url,
      userId,
      ip,
      userAgent,
      query,
      params,
      body: sanitize(body),
      msg: 'Incoming request',
    });

    return next.handle().pipe(
      tap({
        next: (data) => {
          const duration = Date.now() - startTime;
          const statusCode = response?.statusCode;
          const size = data ? JSON.stringify(data).length : 0;

          this.logger.log({
            requestId,
            method,
            url,
            statusCode,
            duration: `${duration}ms`,
            responseSize: size,
            msg: 'Request completed',
          });
        },
        error: (error) => {
          const duration = Date.now() - startTime;
          const statusCode = error?.status || response?.statusCode || 500;

          // 用 error 级别，附带堆栈，方便在日志系统里按级别过滤/告警
          this.logger.error(
            {
              requestId,
              method,
              url,
              statusCode,
              duration: `${duration}ms`,
              userId,
              message: error?.message,
              msg: 'Request failed',
            },
            error?.stack,
          );
        },
      }),
    );
  }
}
