import { ApiProperty } from "@nestjs/swagger";
import { IsString, Matches } from "class-validator";

export class LoginUserDto {
  @ApiProperty({
    description: "手机号",
    example: "13800138000",
  })
  @IsString()
  @Matches(/^1[3-9]\d{9}$/, {
    message: "手机号格式不正确",
  })
  phone: string;

  @ApiProperty({
    description: "4 位短信验证码，当前临时验证码固定为 1234",
    example: "1234",
  })
  @IsString()
  @Matches(/^\d{4}$/, {
    message: "验证码必须是 4 位数字",
  })
  code: string;
}
