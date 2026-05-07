import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService, TokenExpiredError } from "@nestjs/jwt";
import { Reflector } from "@nestjs/core";
import { IS_PUBLIC_KEY } from "../decorators/public.decorator";

/**
 * 认证守卫 - 用于验证请求是否合法
 *
 * 使用场景：
 * - 解析 Authorization Bearer token 并校验 JWT
 * - 将校验通过后的用户信息挂载到 request.user
 * - 通过 @Public() 放行登录、健康检查等公开接口
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request.headers?.authorization);

    if (!token) {
      throw this.createUnauthorizedException("未登录");
    }

    try {
      request.user = await this.jwtService.verifyAsync(token);
      return true;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw this.createUnauthorizedException("登录已过期");
      }

      throw this.createUnauthorizedException("登录状态无效");
    }
  }

  private extractTokenFromHeader(authorization?: string): string | undefined {
    const [type, token] = authorization?.split(" ") ?? [];
    return type === "Bearer" && token ? token : undefined;
  }

  private createUnauthorizedException(message: string): UnauthorizedException {
    return new UnauthorizedException({
      message,
      error: message,
    });
  }
}
