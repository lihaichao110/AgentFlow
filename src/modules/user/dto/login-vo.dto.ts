import { ApiProperty } from "@nestjs/swagger";

export class LoginVo {
  @ApiProperty({ description: "JWT token" })
  token: string;

  @ApiProperty({ description: "过期时间", example: "7d" })
  expiresIn: string;
}