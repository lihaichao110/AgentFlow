import { BadRequestException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { CreateUserDto } from "./dto/create-user.dto";
import { LoginUserDto } from "./dto/login-user.dto";

export interface LoginResult {
  token: string;
}

@Injectable()
export class UserService {
  constructor(private readonly jwtService: JwtService) {}

  create(createUserDto: CreateUserDto) {
    console.log(createUserDto, "post");
    return "This action adds a new user";
  }

  login(loginUserDto: LoginUserDto): LoginResult {
    if (loginUserDto.code !== "1234") {
      throw new BadRequestException("验证码错误");
    }

    return {
      token: this.jwtService.sign({
        sub: loginUserDto.phone,
        phone: loginUserDto.phone,
      }),
    };
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
}
