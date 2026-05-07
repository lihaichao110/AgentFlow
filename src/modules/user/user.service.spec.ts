import { BadRequestException } from "@nestjs/common";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "./user.service";

describe("UserService", () => {
  let service: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: "test-jwt-secret",
          signOptions: {
            expiresIn: "1d",
          },
        }),
      ],
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should return token when verification code is valid", () => {
    const result = service.login({
      phone: "13800138000",
      code: "1234",
    });

    expect(result.token).toMatch(/^[\w-]+\.[\w-]+\.[\w-]+$/);
    expect(jwtService.verify(result.token)).toMatchObject({
      sub: "13800138000",
      phone: "13800138000",
    });
  });

  it("should reject invalid verification code", () => {
    expect(() =>
      service.login({
        phone: "13800138000",
        code: "0000",
      }),
    ).toThrow(BadRequestException);
  });
});
