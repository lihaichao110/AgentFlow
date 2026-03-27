import { NestFactory } from '@nestjs/core';
import { VersioningType, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import * as session from 'express-session';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // 全局前缀
  const prefix = configService.get<string>('app.prefix') || 'api';
  app.setGlobalPrefix(prefix);

  // 全局版本控制
  app.enableVersioning({
    type: VersioningType.URI,
  });

  // 全局管道 - 验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  // 全局异常过滤器
  app.useGlobalFilters(new HttpExceptionFilter());

  // 全局响应转换拦截器
  app.useGlobalInterceptors(new TransformInterceptor());

  // session 配置
  const sessionConfig = {
    secret: configService.get<string>('session.secret') || 'default-secret',
    rolling: true,
    name: configService.get<string>('session.name') || 'lhc.sid',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: configService.get<number>('session.maxAge') || 3600000,
    },
  };
  app.use(session(sessionConfig));

  const port = configService.get<number>('app.port') || 3000;
  await app.listen(port);
  console.log(`\n  🚀 应用已启动，访问地址: http://localhost:${port}/${prefix}\n`);
}
bootstrap();
