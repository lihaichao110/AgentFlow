import { Injectable } from '@nestjs/common';
import * as SvgCaptcha from 'svg-captcha';

@Injectable()
export class DemoService {
  getHelloFunc() {
    const res = SvgCaptcha.create({
      size: 4,
      fontSize: 50,
      color: true,
      width: 300,
      height: 80,
      background: '#cc9966',
    });
    // session.code = res.text;
    return res.data;
  }
}
