import { Controller, Get, Header } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { AppService } from "./app.service";
import { Public } from "./common/decorators/public.decorator";

@ApiTags("App")
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Public()
  @Header("Content-Type", "text/html; charset=utf-8")
  @ApiOperation({ summary: "获取服务状态页面" })
  @ApiResponse({
    status: 200,
    description: "返回服务状态 HTML",
    schema: {
      type: "string",
      example: "<html>...</html>",
    },
  })
  getServiceStatus(): string {
    return this.appService.getServiceStatus();
  }
}
