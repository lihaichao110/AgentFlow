import { ApiProperty } from "@nestjs/swagger";

export class CommonResponse {
  @ApiProperty({ description: "状态码", example: 0 })
  code: number;

  @ApiProperty({ description: "状态信息", example: "success" })
  message: string;

  @ApiProperty({ description: "响应数据" })
  data: unknown;
}