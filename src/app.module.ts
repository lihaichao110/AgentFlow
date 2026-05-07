import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { ConfigModule } from "@nestjs/config";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import type { JwtSignOptions } from "@nestjs/jwt";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DemoModule } from "./modules/demo/demo.module";
import { UserModule } from "./modules/user/user.module";
import { AgentModule } from "./modules/agent/agent.module";
import appConfig from "./config/configuration";
import { AuthGuard } from "./common/guards/auth.guard";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 全局注册，其他模块无需再引入
      load: [appConfig],
    }),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>("jwt.secret"),
        signOptions: {
          expiresIn: configService.get<string>(
            "jwt.expiresIn",
          ) as JwtSignOptions["expiresIn"],
        },
      }),
    }),
    DemoModule,
    UserModule,
    AgentModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
