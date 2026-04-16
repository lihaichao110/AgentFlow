import { Injectable } from "@nestjs/common";
import { createAgent, tool } from "langchain";
import { z } from "zod";

@Injectable()
export class AgentService {
  create() {
    return "This action adds a new agent";
  }

  async findAll() {
    const getWeather = tool(
      ({ city }: { city: string }) => `It's always sunny in ${city}!`,
      {
        name: "get_weather",
        description: "Get the weather for a given city",
        schema: z.object({
          city: z.string(),
        }),
      },
    );

    const agent = createAgent({
      model: "anthropic:MiniMax-M2.7",
      tools: [getWeather],
    });

    const result = await agent.invoke(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { messages: [{ role: "user", content: "今天天气怎么样?" }] } as any,
    );
    console.log(result);
    return `This action returns all agent`;
  }

  findOne(id: number) {
    return `This action returns a #${id} agent`;
  }

  update(id: number) {
    return `This action updates a #${id} agent`;
  }

  remove(id: number) {
    return `This action removes a #${id} agent`;
  }
}
