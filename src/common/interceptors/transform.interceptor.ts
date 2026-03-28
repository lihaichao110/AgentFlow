import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  code: number;
  message: string;
  data: T;
}

/**
 * 响应转换拦截器 - 统一处理响应格式
 * 当前实现：包装所有响应为 { code, message, data } 格式
 *
 * 使用场景：
 * - 统一 API 响应格式
 * - 记录请求日志
 * - 添加请求耗时统计
 * - 统一处理分页响应
 */
@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T> | string>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T> | string> {
    // TODO: 实现真实的拦截逻辑
    // 1. 请求前记录日志（开始时间等）
    // 2. 在 handle() 之后处理响应
    // 3. 添加统一包装格式

    const now = Date.now();
    const request = context.switchToHttp().getRequest();

    console.log(`[${new Date().toISOString()}] ${request.method} ${request.url} - 开始`);

    return next.handle().pipe(
      map((data) => {
        // 请求完成后的处理
        console.log(
          `[${new Date().toISOString()}] ${request.method} ${request.url} - 耗时: ${Date.now() - now}ms`,
        );

        // 如果是 HTML 响应（字符串且以 < 开头），直接返回不进行包装
        if (typeof data === 'string' && data.trim().startsWith('<')) {
          return data;
        }

        return {
          code: 0,
          message: 'success',
          data,
        } as Response<T>;
      }),
    );
  }
}
