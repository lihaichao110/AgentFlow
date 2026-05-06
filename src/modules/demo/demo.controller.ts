import {
  Controller,
  Get,
  Res,
  Session,
  HttpCode,
  Header,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DemoService } from './demo.service';

@ApiTags('Demo')
@Controller('demo')
export class DemoController {
  constructor(private readonly demoService: DemoService) {}

  @Get()
  @HttpCode(404)
  @Header('lhc', 'lihaichao')
  @ApiOperation({ summary: 'Demo 手写响应示例' })
  @ApiResponse({
    status: 200,
    description: '手写 Express Response 返回字符串示例',
    schema: {
      type: 'string',
      example: '123',
    },
  })
  getHello(@Res() res, @Session() session) {
    // console.log(req);
    session.code = 200;
    res.status(200).send('123');
    // return this.demoService.getHelloFunc();
  }
}
