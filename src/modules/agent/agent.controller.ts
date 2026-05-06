import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Delete,
  Response,
} from "@nestjs/common";
import {
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { AgentService } from "./agent.service";

@ApiTags("Agent")
@Controller("agent")
export class AgentController {
  constructor(private readonly agentService: AgentService) {
    console.log("agent");
  }

  @Post()
  @ApiOperation({ summary: "创建 Agent 示例" })
  @ApiResponse({
    status: 201,
    description: "返回创建 Agent 的示例文案",
    schema: {
      example: {
        code: 0,
        message: "success",
        data: "This action adds a new agent",
      },
    },
  })
  create() {
    return this.agentService.create();
  }

  @Get()
  @ApiOperation({ summary: "流式运行 Agent 示例" })
  @ApiResponse({
    status: 200,
    description: "以 text/event-stream 返回模型流式输出",
    content: {
      "text/event-stream": {
        schema: {
          type: "string",
          example: '{"content":"stream chunk"}',
        },
      },
    },
  })
  findAll(@Response() res) {
    return this.agentService.findAll(res);
  }

  @Get(":id")
  @ApiOperation({ summary: "运行单个 Agent 示例" })
  @ApiParam({ name: "id", description: "Agent ID", example: "1" })
  @ApiResponse({
    status: 200,
    description: "返回 LangChain Agent 执行结果",
  })
  findOne(@Param("id") id: string) {
    console.log(id);
    return this.agentService.findOne();
  }

  @Patch(":id")
  @ApiOperation({ summary: "更新 Agent 示例" })
  @ApiParam({ name: "id", description: "Agent ID", example: "1" })
  @ApiResponse({
    status: 200,
    description: "返回更新 Agent 的示例文案",
    schema: {
      example: {
        code: 0,
        message: "success",
        data: "This action updates a #1 agent",
      },
    },
  })
  update(@Param("id") id: string) {
    return this.agentService.update(+id);
  }

  @Delete(":id")
  @ApiOperation({ summary: "删除 Agent 示例" })
  @ApiParam({ name: "id", description: "Agent ID", example: "1" })
  @ApiResponse({
    status: 200,
    description: "返回删除 Agent 的示例文案",
    schema: {
      example: {
        code: 0,
        message: "success",
        data: "This action removes a #1 agent",
      },
    },
  })
  remove(@Param("id") id: string) {
    return this.agentService.remove(+id);
  }
}
