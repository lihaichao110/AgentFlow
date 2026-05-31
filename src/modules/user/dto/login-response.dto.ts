import { ApiExtraModels, ApiProperty } from "@nestjs/swagger";
import { CommonResponse } from "../../../common/dto/common-response.dto";

class LoginData {
  @ApiProperty({ description: "JWT token", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." })
  token: string;

  @ApiProperty({ description: "过期时间", example: "7d" })
  expiresIn: string;
}

@ApiExtraModels(LoginData)
export class LoginResponseDto extends CommonResponse {
  @ApiProperty({ description: "登录数据", type: LoginData })
  data: LoginData;
}