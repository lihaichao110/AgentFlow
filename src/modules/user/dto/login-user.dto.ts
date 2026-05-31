import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";

export class LoginUserDto {
  @ApiProperty({
    description: "账号",
    example: "admin",
  })
  @IsString()
  @MinLength(2, { message: "账号至少 2 个字符" })
  account: string;

  @ApiProperty({
    description: "密码",
    example: "123456",
  })
  @IsString()
  @MinLength(6, { message: "密码至少 6 个字符" })
  password: string;
}