import { Injectable } from "@nestjs/common";
import { createAgent, initChatModel, tool, type ToolRuntime } from "langchain";
import { MemorySaver } from "@langchain/langgraph";
import { HumanMessage } from "@langchain/core/messages";
// import { ChatAnthropic } from "@langchain/anthropic";

import { z } from "zod";
// import { IterableReadableStream } from "@langchain/core/utils/stream";
import { Response } from "express";
import { ChatAnthropic } from "@langchain/anthropic";

@Injectable()
export class AgentService {
  create() {
    return "This action adds a new agent";
  }

  async findAll(res: Response) {
    res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
    // const search = tool(({ query }) => `结果如下: ${query}`, {
    //   name: "search",
    //   description: "查找信息",
    //   schema: z.object({
    //     query: z.string().describe("进行搜索的查询内容"),
    //   }),
    // });

    // const getWeather = tool(
    //   ({ location }) => `${location} 的天气：晴天，气温 72 华氏度`,
    //   {
    //     name: "get_weather",
    //     description: "获取某个地点的天气信息",
    //     schema: z.object({
    //       location: z.string().describe("获取天气信息的地点"),
    //     }),
    //   },
    // );

    // 写法一
    // const agent = createAgent({
    //   model: process.env.ANTHROPIC_MODAL,
    //   tools: [getWeather, search],
    // });

    // const result = await agent.stream(
    //   {
    //     // eslint-disable-next-line
    //     messages: [new HumanMessage("帮我搜一下，市场上流行的职业是什么？")],
    //   } as any,
    //   // {
    //   //   streamMode: "updates",
    //   // },
    // );
    // console.log(result);

    // for await (const chunk of result as IterableReadableStream<any>) {
    //   const chunkStr =
    //     typeof chunk === "string" ? chunk : JSON.stringify(chunk);
    //   res.write(chunkStr, "utf-8");
    // }
    // return res.end();

    //  写法二
    const anthropicAgent = new ChatAnthropic({
      model: process.env.ANTHROPIC_MODAL,
    });

    const response = await anthropicAgent.stream([
      new HumanMessage("帮我搜一下，市场上流行的职业是什么？"),
    ]);
    // console.log(response);

    for await (const chunk of response) {
      const chunkStr =
        typeof chunk === "string" ? chunk : JSON.stringify(chunk);
      res.write(chunkStr, "utf-8");
    }
    return res.end();
  }

  async findOne() {
    const systemPrompt = `你是一位擅长用双关语表达的天气预报专家。
    您拥有以下两种工具的使用权：
    - 获取特定地点的天气：使用此功能可获取特定地点的天气情况
    - 获取用户位置：使用此功能可获取用户的当前位置
    如果用户向你询问天气情况，务必将其所在地点搞清楚。如果从问题中可以推断出他们指的是他们所处的任何地方，那就使用“获取用户位置”工具来查找他们的具体位置。`;

    const getWeather = tool((input) => `It's always sunny in ${input.city}!`, {
      name: "get_weather_for_location",
      description: "Get the weather for a given city",
      schema: z.object({
        city: z.string().describe("The city to get the weather for"),
      }),
    });

    type AgentRuntime = ToolRuntime<unknown, { user_id: string }>;

    const getUserLocation = tool(
      (_, config: AgentRuntime) => {
        console.log("config.context", config.context);
        const { user_id } = config.context;
        return user_id === "1" ? "上海" : "哈尔滨";
      },
      {
        name: "get_user_location",
        description: "Retrieve user information based on user ID",
      },
    );

    const model = await initChatModel(process.env.ANTHROPIC_MODAL, {
      temperature: 0.5,
      timeout: 10,
      maxTokens: 1000,
    });

    const responseFormat = z.object({
      punny_response: z.string(),
      weather_conditions: z.string().optional(),
    });

    const checkpointer = new MemorySaver();

    const agent = createAgent({
      model,
      systemPrompt: systemPrompt,
      tools: [getUserLocation, getWeather],
      responseFormat,
      checkpointer,
    });

    const config = {
      configurable: { thread_id: "1" },
      context: { user_id: "1" },
    };

    const response = await agent.invoke(
      {
        messages: [new HumanMessage("外面的天气怎么样？")],
      } as any,
      config,
    );

    console.log(response);

    return response;
  }

  update(id: number) {
    return `This action updates a #${id} agent`;
  }

  remove(id: number) {
    return `This action removes a #${id} agent`;
  }
}
