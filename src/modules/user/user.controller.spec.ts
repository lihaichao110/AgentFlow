import { JwtModule } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

describe("UserController", () => {
  let controller: UserController;

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
      controllers: [UserController],
      providers: [UserService],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("should login with phone and code", () => {
    expect(
      controller.login({
        phone: "13800138000",
        code: "1234",
      }).token,
    ).toMatch(/^[\w-]+\.[\w-]+\.[\w-]+$/);
  });
});
