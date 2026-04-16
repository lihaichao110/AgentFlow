import { Controller, Get, Post, Patch, Param, Delete } from "@nestjs/common";
import { AgentService } from "./agent.service";

@Controller("agent")
export class AgentController {
  constructor(private readonly agentService: AgentService) {
    console.log("agent");
  }

  @Post()
  create() {
    return this.agentService.create();
  }

  @Get()
  findAll() {
    return this.agentService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.agentService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string) {
    return this.agentService.update(+id);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.agentService.remove(+id);
  }
}
