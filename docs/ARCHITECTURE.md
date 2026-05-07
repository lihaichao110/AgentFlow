# 架构设计规范

本文档用于约束 AgentFlow 的后端架构设计。AI 修改项目时必须先阅读本文档，并以当前源码为准进行判断。

## 项目事实

AgentFlow 当前是 NestJS 10 + TypeScript 后端项目，目标是构建 AI Agent 服务端框架。当前已落地模块包括：

```text
src/
├── main.ts
├── app.module.ts
├── app.controller.ts
├── app.service.ts
├── assets/
├── common/
├── config/
└── modules/
    ├── agent/
    ├── demo/
    └── user/
```

README 中提到的 `chat`、`memory`、`tools/base.tool.ts`、`tools/file.tool.ts`、`tools/task.tool.ts` 当前没有出现在源码中。AI 不得假设这些模块已经存在。

## 启动流程

入口文件是 `src/main.ts`。启动顺序：

1. 通过 `NestFactory.create(AppModule)` 创建应用。
2. 从 `ConfigService` 读取应用配置。
3. 设置全局前缀，默认 `/api`。
4. 开启 URI 版本控制。
5. 注册全局验证管道、异常过滤器、响应拦截器。
6. 注册 `express-session`。
7. 监听 `APP_PORT`，默认 `3000`。

根模块是 `src/app.module.ts`。当前导入：

- `ConfigModule.forRoot({ isGlobal: true, load: [appConfig] })`
- 全局 `JwtModule`
- 全局 `AuthGuard`
- `DemoModule`
- `UserModule`
- `AgentModule`

## 分层限制

必须保持以下依赖方向：

```text
controller -> service -> external libraries
controller -> dto
module -> controller/service
main -> app.module/common/config
```

限制：

- `common` 不允许依赖任何业务模块。
- Controller 只负责 HTTP 入参、路由、状态码和调用 Service。
- Service 负责业务逻辑、AI SDK 调用和外部服务编排。
- DTO 负责请求结构和校验，不能写业务逻辑。
- Entity 只描述数据结构，不能依赖 Controller 或 Service。
- 新增共享能力前先确认是否已有 `common` 约定，避免重复抽象。

## 请求链路

常规 Controller 返回值会经过：

```text
HTTP request
  -> AuthGuard
  -> controller
  -> service
  -> TransformInterceptor
  -> HTTP response
```

异常会进入 `HttpExceptionFilter`，统一返回：

```json
{
  "code": 500,
  "message": "服务器内部错误",
  "error": "...",
  "timestamp": "..."
}
```

普通成功响应会被 `TransformInterceptor` 包装为：

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

使用 `@Res()` 或 `@Response()` 手动写响应的接口不完全遵循这个链路。

## OpenAPI 文档规范

项目只生成静态 OpenAPI JSON，用于手动上传 Apifox。不在运行时暴露 Swagger UI，也不新增 `/api/docs` 或 `/api/docs-json` 路由。

生成命令：

```bash
pnpm run apifox:swagger
```

生成文件：

```text
openapi/agentflow.openapi.json
```

接口变更限制：

- 新增或修改接口后，必须运行 `pnpm run apifox:swagger`。
- 生成后的 JSON 由开发者手动上传到 Apifox。
- Controller 必须使用 `@ApiTags()` 分组。
- 接口应使用 `@ApiOperation()` 描述用途。
- DTO 字段必须使用 `class-validator` 做输入校验，并使用 `@ApiProperty()` 或 `@ApiPropertyOptional()` 描述 OpenAPI schema。
- 路径参数和查询参数应使用 `@ApiParam()`、`@ApiQuery()` 补充说明。
- 手写响应接口，例如使用 `@Res()` 或 `@Response()` 的接口，必须显式补充 `@ApiResponse()`，因为自动推断不可靠。
- 不允许为了文档生成在 `src/main.ts` 中调用 `SwaggerModule.setup()`。

## 模块职责

### App

文件：

- `src/app.controller.ts`
- `src/app.service.ts`
- `src/app.module.ts`

职责：应用根模块和基础示例接口。

限制：

- 不承载业务逻辑。
- 不直接调用 LangChain、数据库或第三方业务 SDK。

### Common

文件：

- `src/common/filters/http-exception.filter.ts`
- `src/common/guards/auth.guard.ts`
- `src/common/interceptors/transform.interceptor.ts`
- `src/common/pipes/validation.pipe.ts`

职责：跨模块基础设施。当前实现偏示例性质，后续可扩展日志、鉴权、错误脱敏、响应格式和参数验证。

限制：

- 只能放通用能力。
- 不允许引用 `src/modules/*`。
- `AuthGuard` 是全局 JWT 鉴权入口；公开接口必须使用 `@Public()` 显式放行。

### Config

文件：

- `src/config/configuration.ts`
- `src/config/index.ts`

职责：集中管理环境变量映射。当前没有强 schema 校验。

限制：

- 新增环境变量必须同步到配置文档或本文件说明。
- 业务代码中不要散落读取 `process.env`，优先通过配置层读取。

### Demo

文件：

- `src/modules/demo/demo.controller.ts`
- `src/modules/demo/demo.service.ts`
- `src/modules/demo/demo.module.ts`

职责：NestJS 控制器、响应对象、Session、Header、验证码生成等示例。

限制：

- Demo 模块不应被生产业务依赖。
- 示例能力迁移到正式模块后，应删除或隔离演示逻辑。

### User

文件：

- `src/modules/user/user.controller.ts`
- `src/modules/user/user.service.ts`
- `src/modules/user/dto/*`
- `src/modules/user/entities/*`

职责：用户模块 scaffold。当前没有持久化；已包含手机号验证码登录接口，验证码固定为 `1234`，登录成功返回客户端 JWT token。

路由使用版本声明：

```ts
@Controller({
  path: "user",
  version: "1",
})
```

默认访问路径是 `/api/v1/user`。

限制：

- 当前没有数据库或 ORM，不要假设用户数据可持久化。
- 登录 token 当前为 JWT，默认有效期为 `JWT_EXPIRES_IN` 或 `1d`；由于当前没有数据库，payload 使用手机号作为 `sub`。
- 新增真实接口前必须补充输入校验。

### Agent

文件：

- `src/modules/agent/agent.controller.ts`
- `src/modules/agent/agent.service.ts`
- `src/modules/agent/dto/*`
- `src/modules/agent/entities/*`

职责：AI Agent 实验模块。

当前包含两类示例：

- `findAll`: 使用 `ChatAnthropic.stream()` 向 HTTP 响应写入流式内容。
- `findOne`: 使用 LangChain `createAgent`、tool、`MemorySaver`、结构化 `responseFormat` 和上下文 `config` 运行天气示例。

限制：

- 当前 Agent 代码是实验接口，不是完整生产抽象。
- LangChain 模型配置目前部分直接读取 `process.env.ANTHROPIC_MODAL`。
- 不要把工具、模型、线程 ID、用户上下文继续写死在生产接口中。
- 流式接口必须明确响应头、异常处理和结束逻辑。
- 新增多模型支持前，应先设计统一配置层。

## 新增模块规范

新增模块应保持以下结构：

```text
src/modules/<name>/
├── <name>.module.ts
├── <name>.controller.ts
├── <name>.service.ts
├── dto/
└── entities/
```

新增模块后必须在 `src/app.module.ts` 或对应上层模块中导入。

## 变更检查清单

涉及以下变更时必须同步检查架构：

- 新增、删除、重命名模块
- 修改全局前缀、版本控制、响应格式或异常格式
- 新增或修改接口文档、DTO schema、OpenAPI 生成脚本
- 引入数据库、Redis、队列、缓存、对象存储等基础设施
- 引入新的 LLM provider、Agent runtime 或工具系统
- 将 README 中的规划能力落地到源码
