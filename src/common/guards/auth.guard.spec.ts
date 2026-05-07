import { ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { Reflector } from "@nestjs/core";
import { Test, TestingModule } from "@nestjs/testing";
import { AuthGuard } from "./auth.guard";

describe("AuthGuard", () => {
  let guard: AuthGuard;
  let jwtService: JwtService;
  let reflector: Reflector;

  const createContext = (authorization?: string) => {
    const request = {
      headers: {
        authorization,
      },
    };

    const context = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: jest.fn(() => ({
        getRequest: jest.fn(() => request),
      })),
    } as unknown as ExecutionContext;

    return { context, request };
  };

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
      providers: [AuthGuard, Reflector],
    }).compile();

    guard = module.get<AuthGuard>(AuthGuard);
    jwtService = module.get<JwtService>(JwtService);
    reflector = module.get<Reflector>(Reflector);
  });

  it("should allow public routes without token", async () => {
    jest.spyOn(reflector, "getAllAndOverride").mockReturnValue(true);
    const { context } = createContext();

    await expect(guard.canActivate(context)).resolves.toBe(true);
  });

  it("should reject requests without token", async () => {
    jest.spyOn(reflector, "getAllAndOverride").mockReturnValue(false);
    const { context } = createContext();

    await expect(guard.canActivate(context)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it("should reject expired token with expired message", async () => {
    jest.spyOn(reflector, "getAllAndOverride").mockReturnValue(false);
    const token = jwtService.sign(
      { sub: "13800138000", phone: "13800138000" },
      { expiresIn: -1 },
    );
    const { context } = createContext(`Bearer ${token}`);

    await expect(guard.canActivate(context)).rejects.toMatchObject({
      response: {
        message: "登录已过期",
        error: "登录已过期",
      },
    });
  });

  it("should attach jwt payload to request user", async () => {
    jest.spyOn(reflector, "getAllAndOverride").mockReturnValue(false);
    const token = jwtService.sign({
      sub: "13800138000",
      phone: "13800138000",
    });
    const { context, request } = createContext(`Bearer ${token}`);

    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(request).toHaveProperty("user");
    expect(request["user"]).toMatchObject({
      sub: "13800138000",
      phone: "13800138000",
    });
  });
});
