import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DemoModule } from './modules/demo/demo.module';
import { UserModule } from './modules/user/user.module';
import { AgentModule } from './modules/agent/agent.module';
import appConfig from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 全局注册，其他模块无需再引入
      load: [appConfig],
    }),
    DemoModule,
    UserModule,
    AgentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
