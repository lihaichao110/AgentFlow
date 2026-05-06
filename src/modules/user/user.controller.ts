import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
} from "@nestjs/common";
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";

@ApiTags("User")
@Controller({
  path: "user",
  version: "1",
})
export class UserController {
  constructor(private readonly userService: UserService) {
    console.log("user");
  }

  @Post()
  @ApiOperation({ summary: "创建用户示例" })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: "返回创建用户的示例文案",
    schema: {
      example: {
        code: 0,
        message: "success",
        data: "This action adds a new user",
      },
    },
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: "查询用户列表示例" })
  @ApiQuery({
    name: "id",
    required: false,
    description: "示例查询参数",
    example: "1",
  })
  @ApiResponse({
    status: 200,
    description: "返回用户列表的示例文案",
    schema: {
      example: {
        code: 0,
        message: "success",
        data: "This action returns all user",
      },
    },
  })
  findAll(@Request() req) {
    console.log(req, "req");
    return this.userService.findAll(req);
  }

  @Get(":id")
  @ApiOperation({ summary: "查询单个用户示例" })
  @ApiParam({ name: "id", description: "用户 ID", example: "1" })
  @ApiResponse({
    status: 200,
    description: "返回单个用户的示例文案",
    schema: {
      example: {
        code: 0,
        message: "success",
        data: "This action returns a #1 user",
      },
    },
  })
  findOne(@Param("id") id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "更新用户示例" })
  @ApiParam({ name: "id", description: "用户 ID", example: "1" })
  @ApiResponse({
    status: 200,
    description: "返回更新用户的示例文案",
    schema: {
      example: {
        code: 0,
        message: "success",
        data: "This action updates a #1 user",
      },
    },
  })
  update(@Param("id") id: string) {
    return this.userService.update(+id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "删除用户示例" })
  @ApiParam({ name: "id", description: "用户 ID", example: "1" })
  @ApiResponse({
    status: 200,
    description: "返回删除用户的示例文案",
    schema: {
      example: {
        code: 0,
        message: "success",
        data: "This action removes a #1 user",
      },
    },
  })
  remove(@Param("id") id: string) {
    return this.userService.remove(+id);
  }
}
