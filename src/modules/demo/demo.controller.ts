import {
  Controller,
  Get,
  Res,
  Session,
  HttpCode,
  Header,
} from '@nestjs/common';
import { DemoService } from './demo.service';

@Controller('demo')
export class DemoController {
  constructor(private readonly demoService: DemoService) {}

  @Get()
  @HttpCode(404)
  @Header('lhc', 'lihaichao')
  getHello(@Res() res, @Session() session) {
    // console.log(req);
    session.code = 200;
    res.status(200).send('123');
    // return this.demoService.getHelloFunc();
  }
}
