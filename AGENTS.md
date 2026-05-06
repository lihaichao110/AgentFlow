# AGENTS.md

本文档是 AI 助手进入 AgentFlow 项目时的根入口。开始修改代码前，先阅读本文档，再根据任务类型阅读 `docs` 下的对应规范。

## 项目背景

AgentFlow 是一个基于 NestJS 10 + TypeScript 的后端项目，目标是构建 AI Agent 服务端框架。当前代码已经包含 LangChain / LangGraph / Anthropic 相关实验能力，但大量业务能力仍处于 scaffold 或 demo 阶段。

当前真实模块：

- `src/modules/agent`: AI Agent 实验模块
- `src/modules/user`: 用户 scaffold 模块
- `src/modules/demo`: NestJS 示例模块
- `src/common`: 全局过滤器、拦截器、守卫、管道
- `src/config`: 应用配置映射

README 中描述的部分能力是产品规划，不代表源码已经实现。

## 文档母舰

每个文档负责约束一个方向。AI 应按任务类型选择阅读，不要只看 README 或凭经验猜。

### `docs/ARCHITECTURE.md`

架构设计规范。用于理解启动流程、模块边界、依赖方向、请求链路、响应格式和新增模块限制。

适用任务：

- 新增、删除、重命名模块
- 修改 Controller、Service、DTO、Entity 分层
- 修改全局前缀、版本控制、拦截器、异常过滤器
- 新增接口、DTO 或 OpenAPI/Apifox 导出能力
- 接入数据库、Redis、队列、缓存、LLM provider
- 重构 Agent 模块或工具系统

### `docs/FRONTEND.md`

前端规范。当前项目没有独立前端，此文档用于限制未来新增 Web UI、管理台、调试台或静态页面。

适用任务：

- 新增前端目录或页面
- 修改 `src/assets` 下的 HTML/CSS/JS
- 接入 React、Vue、Next.js、Vite、Tailwind 等前端工具
- 开发 Agent 调试界面、管理台、表单、列表、流式输出页面

### `docs/SECURITY.md`

安全规范。用于约束鉴权、Session、密钥、输入校验、LLM 工具调用、日志和错误处理。

适用任务：

- 新增登录、注册、鉴权、权限控制
- 修改 `AuthGuard`、Session、Cookie、Token
- 新增 POST/PATCH/PUT 接口和 DTO
- 接入外部 API Key、LLM provider、webhook
- 新增 Agent 工具、文件读写、网络请求或数据库访问
- 修改日志、异常过滤器、响应结构

## 工作规则

- 以源码为准，文档和 README 冲突时先检查源码。
- 修改代码后，如果影响规范描述，必须同步更新对应 `docs` 文档。
- 不要假设未落地模块存在。
- 不要把 demo 逻辑当成生产能力复用。
- 默认使用 pnpm，因为仓库包含 `pnpm-lock.yaml`。
- 文档和注释使用中文，代码命名保持英文。

## 常用命令

```bash
pnpm install
pnpm run start:dev
pnpm run build
pnpm run test
pnpm run test:e2e
pnpm run lint
pnpm run format
pnpm run apifox:swagger
```
