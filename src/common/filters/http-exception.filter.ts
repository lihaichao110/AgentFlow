import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

/**
 * 全局异常过滤器 - 统一处理所有未捕获的异常
 * 当前实现：返回格式化错误响应
 *
 * 使用场景：
 * - 统一 API 错误响应格式
 * - 记录错误日志
 * - 对特定异常进行特殊处理
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // TODO: 实现真实的异常处理逻辑
    // 1. 判断异常类型（HttpException 还是普通 Error）
    // 2. 提取错误信息和状态码
    // 3. 记录错误日志到文件/数据库/日志服务
    // 4. 根据环境决定是否返回详细错误信息

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = '服务器内部错误';
    let error = 'Internal Server Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      message =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as any).message || exception.message;
      error =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as any).error || exception.name;
    }

    // 生产环境不返回详细错误信息
    const isProduction = process.env.NODE_ENV === 'production';

    response.status(status).json({
      code: status,
      message: message,
      error: isProduction ? error : exception instanceof Error ? exception.message : String(exception),
      timestamp: new Date().toISOString(),
      // stack: isProduction ? undefined : exception instanceof Error ? exception.stack : undefined,
    });
  }
}
