import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

/**
 * 认证守卫 - 用于验证请求是否合法
 * 当前实现：直接返回 true，放行所有请求
 *
 * 使用场景：
 * - 需要添加 JWT 验证时，在这里解析 token 并校验
 * - 需要添加 API Key 验证时，在这里校验 header
 */
@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // TODO: 实现真实的认证逻辑
    // 1. 从 context 获取请求信息（headers, body, query）
    // 2. 解析并验证 token / API Key
    // 3. 将用户信息挂载到 request 对象上
    // 4. 返回 true 允许访问，false 拒绝访问

    return true;
  }
}
