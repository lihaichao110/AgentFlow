import { Test, TestingModule } from "@nestjs/testing";
import {
  INestApplication,
  ValidationPipe,
  VersioningType,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as request from "supertest";
import { AppModule } from "./../src/app.module";
import { HttpExceptionFilter } from "./../src/common/filters/http-exception.filter";
import { TransformInterceptor } from "./../src/common/interceptors/transform.interceptor";

describe("AppController (e2e)", () => {
  let app: INestApplication;
  let jwtService: JwtService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix("api");
    app.enableVersioning({
      type: VersioningType.URI,
    });
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
      }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalInterceptors(new TransformInterceptor());
    jwtService = moduleFixture.get<JwtService>(JwtService);
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it("/ (GET)", () => {
    return request(app.getHttpServer())
      .get("/api")
      .expect(200)
      .expect((response) => {
        expect(response.text).toContain("AgentFlow");
      });
  });

  it("/api/v1/user/login (POST) should allow public login without token", () => {
    return request(app.getHttpServer())
      .post("/api/v1/user/login")
      .send({
        phone: "13800138000",
        code: "1234",
      })
      .expect(200)
      .expect((response) => {
        expect(response.body.data.token).toMatch(/^[\w-]+\.[\w-]+\.[\w-]+$/);
      });
  });

  it("/api/v1/user/login (POST) should reject invalid code with 400", () => {
    return request(app.getHttpServer())
      .post("/api/v1/user/login")
      .send({
        phone: "13800138000",
        code: "0000",
      })
      .expect(400)
      .expect((response) => {
        expect(response.body).toMatchObject({
          code: 400,
          message: "验证码错误",
        });
      });
  });

  it("/api/v1/user (GET) should reject requests without token", () => {
    return request(app.getHttpServer())
      .get("/api/v1/user")
      .expect(401)
      .expect((response) => {
        expect(response.body).toMatchObject({
          code: 401,
          message: "未登录",
          error: "未登录",
        });
      });
  });

  it("/api/v1/user (GET) should reject invalid token", () => {
    return request(app.getHttpServer())
      .get("/api/v1/user")
      .set("Authorization", "Bearer invalid-token")
      .expect(401)
      .expect((response) => {
        expect(response.body).toMatchObject({
          code: 401,
          message: "登录状态无效",
          error: "登录状态无效",
        });
      });
  });

  it("/api/v1/user (GET) should reject expired token", () => {
    const token = jwtService.sign(
      {
        sub: "13800138000",
        phone: "13800138000",
      },
      { expiresIn: -1 },
    );

    return request(app.getHttpServer())
      .get("/api/v1/user")
      .set("Authorization", `Bearer ${token}`)
      .expect(401)
      .expect((response) => {
        expect(response.body).toMatchObject({
          code: 401,
          message: "登录已过期",
          error: "登录已过期",
        });
      });
  });

  it("/api/v1/user (GET) should allow valid token", () => {
    const token = jwtService.sign({
      sub: "13800138000",
      phone: "13800138000",
    });

    return request(app.getHttpServer())
      .get("/api/v1/user")
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect((response) => {
        expect(response.body).toMatchObject({
          code: 0,
          message: "success",
          data: "This action returns all user",
        });
      });
  });
});
