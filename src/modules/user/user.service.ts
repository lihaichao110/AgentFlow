import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { CreateUserDto } from "./dto/create-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";
import { LoginVo } from "./dto/login-vo.dto";

@Injectable()
export class UserService {
  constructor(private readonly jwtService: JwtService) {}

  private mockUsers = [
    {
      id: 1,
      account: "admin",
      // 密码是 "123456" 的 bcrypt 哈希
      password: "$2b$10$rQZ8K8Lh5f1Lh5f1Lh5f1O5f1Lh5f1Lh5f1Lh5f1Lh5f1Lh5f1L",
    },
  ];

  private async findByAccount(account: string) {
    return this.mockUsers.find((u) => u.account === account);
  }

  async login(loginDto: LoginUserDto): Promise<LoginVo> {
    const user = await this.findByAccount(loginDto.account);
    if (!user) {
      throw new UnauthorizedException("账号或密码错误");
    }

    // TODO: 需要在注册时用 bcrypt.hash(password, 10) 存储哈希
    // 这里先用明文比较模拟，实际使用时替换为 bcrypt.compare
    const isPasswordValid = loginDto.password === "123456";
    if (!isPasswordValid) {
      throw new UnauthorizedException("账号或密码错误");
    }

    const payload = { sub: user.id, account: user.account };
    return {
      token: this.jwtService.sign(payload),
      expiresIn: "7d",
    };
  }

  create(createUserDto: CreateUserDto) {
    console.log(createUserDto, "post");
    return "This action adds a new user";
  }

  findAll(req) {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  // 密码哈希方法，供注册时使用
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
}