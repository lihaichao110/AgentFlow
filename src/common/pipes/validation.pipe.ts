import {
  Injectable,
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

/**
 * 验证管道 - 用于参数校验和转换
 * 当前实现：不做实际验证，直接返回原值
 *
 * 使用场景：
 * - 使用 class-validator 结合 ValidationPipe 进行 DTO 验证
 * - 对参数进行类型转换（如字符串转数字）
 * - 统一处理参数格式化
 */
@Injectable()
export class ValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    // TODO: 实现真实的验证逻辑
    // 1. 获取 metadata 信息（参数类型、参数名称等）
    // 2. 使用 class-validator 的 validate 方法进行验证
    // 3. 如果验证失败，抛出 BadRequestException
    // 4. 返回转换后的值

    // 示例：验证字符串参数不能为空
    // if (metadata.type === 'param' && !value) {
    //   throw new BadRequestException('参数不能为空');
    // }

    return value;
  }
}
