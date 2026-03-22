<p align="center">
  <a href="https://github.com/lihaichao110/AgentFlow" target="blank">
    <img src="https://nestjs.com/img/logo-small.svg" width="200" alt="AgentFlow Logo" />
  </a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/~agentflow" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
  <a href="https://www.npmjs.com/~agentflow" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
  <a href="https://www.npmjs.com/~agentflow" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
  <a href="https://github.com/lihaichao110/AgentFlow/actions" target="_blank"><img src="https://img.shields.io/github/actions/workflow/status/lihaichao110/AgentFlow/main.yml" alt="GitHub Actions" /></a>
  <a href="https://github.com/lihaichao110/AgentFlow/stargazers" target="_blank"><img src="https://img.shields.io/github/stars/lihaichao110/AgentFlow" alt="Stars" /></a>
  <a href="https://github.com/lihaichao110/AgentFlow/network/members" target="_blank"><img src="https://img.shields.io/github/forks/lihaichao110/AgentFlow" alt="Forks" /></a>
</p>

## 简介

AgentFlow 是一个基于 **NestJS + LangChain** 构建的 AI Agent 开发框架，专为构建智能代理应用而设计。通过 LangChain 的强大能力，AgentFlow 支持多种类型的 AI Agent 开发，包括工具调用代理、对话代理、多步骤推理代理等。框架提供模块化的架构设计，让开发者能够快速构建、部署和管理生产级别的 AI Agent 应用。

## 核心特性

### 🤖 多类型 Agent 支持

- **ReAct Agent**：结合推理与行动的智能代理
- **对话 Agent**：支持多轮对话的交互式代理
- **工具调用 Agent**：通过工具扩展能力边界的代理
- **多步骤规划 Agent**：支持复杂任务分解与执行

### 🔧 工具系统

- 内置文件读写工具（模拟 Deep Agents 文件系统）
- 计划任务管理工具（write_todos）
- 子 Agent 派生能力（任务隔离与上下文管理）
- 易于扩展的自定义工具接口

### 📊 可观测性

- LangSmith 集成：Agent 运行状态实时追踪
- LangGraph Studio：可视化监控与调试
- 完整的请求链路追踪

### 🏗️ 企业级架构

- **模块化设计**：基于 NestJS 的模块化架构
- **API 版本控制**：支持 URI 方式的 API 版本管理
- **会话管理**：集成 express-session，支持用户状态管理
- **中间件系统**：支持 Hook 插件机制，可在模型调用前后注入逻辑

## 技术栈

| 技术 | 说明 |
|------|------|
| [NestJS](https://github.com/nestjs/nest) | 核心 Web 框架 |
| [LangChain](https://github.com/langchain-ai/langchain) | Agent 开发框架 |
| [LangGraph](https://github.com/langchain-ai/langgraph) | 图状态机运行时 |
| TypeScript | 开发语言 |
| [LangSmith](https://smith.langchain.com/) | Agent 可观测性平台 |

## 项目结构

```
src/
├── main.ts                      # 应用入口
├── app.module.ts                # 根模块
├── agent/                      # 🤖 Agent 核心模块
│   ├── agent.module.ts
│   ├── agent.service.ts         # Agent 服务（创建、运行、管理）
│   ├── agent.controller.ts      # Agent HTTP 接口
│   ├── tools/                   # 工具集
│   │   ├── base.tool.ts         # 工具基类
│   │   ├── file.tool.ts         # 文件操作工具
│   │   └── task.tool.ts         # 任务规划工具
│   └── types/
│       └── agent.types.ts       # 类型定义
├── chat/                        # 💬 对话模块
│   ├── chat.module.ts
│   ├── chat.service.ts          # 对话管理服务
│   └── chat.controller.ts       # 对话接口
├── memory/                      # 🧠 记忆模块
│   ├── memory.module.ts
│   └── memory.service.ts        # 会话记忆管理
├── user/                        # 👤 用户模块
│   ├── user.module.ts
│   ├── user.controller.ts
│   ├── user.service.ts
│   ├── entities/
│   │   └── user.entity.ts
│   └── dto/
│       ├── create-user.dto.ts
│       └── update-user.dto.ts
└── demo/                        # 📝 Demo 模块
    ├── demo.module.ts
    ├── demo.controller.ts
    └── demo.service.ts
```

## 快速开始

### 环境要求

- Node.js >= 18.x
- npm >= 9.x

### 安装依赖

```bash
npm install
```

### 配置环境变量

创建 `.env` 文件：

```bash
# LLM 配置
OPENAI_API_KEY=your-openai-api-key
# 或其他支持的 LLM
# ANTHROPIC_API_KEY=your-anthropic-api-key

# LangSmith 配置（可选）
LANGSMITH_TRACING=true
LANGSMITH_API_KEY=your-langsmith-api-key

# 服务配置
PORT=3000
SESSION_SECRET=your-session-secret
```

### 运行应用

```bash
# 开发模式
npm run start

# 监听模式（热重载）
npm run start:dev

# 生产模式
npm run start:prod
```

### 测试

```bash
# 单元测试
npm run test

# E2E 测试
npm run test:e2e

# 测试覆盖率
npm run test:cov
```

## Agent 开发指南

### 创建你的第一个 Agent

```typescript
import { AgentService } from './agent/agent.service';

@Injectable()
export class YourService {
  constructor(private readonly agentService: AgentService) {}

  async createResearchAgent() {
    return this.agentService.createAgent({
      name: 'research-assistant',
      description: '一个研究助手代理',
      model: 'openai',
      tools: ['file-read', 'task-planner'],
    });
  }

  async runAgent(agentId: string, task: string) {
    return this.agentService.run(agentId, { input: task });
  }
}
```

### 内置工具

AgentFlow 提供以下内置工具，可直接使用或扩展：

| 工具名称 | 功能 | 适用场景 |
|---------|------|---------|
| `file-read` | 读取文件内容 | 知识库问答、文档处理 |
| `file-write` | 写入文件内容 | 结果保存、日志记录 |
| `task-planner` | 任务规划与跟踪 | 复杂任务分解 |
| `task-spawn` | 派生子 Agent | 多任务并行处理 |

## 适用场景

AgentFlow 可用于构建以下类型的应用：

### 1. 智能客服系统
- 多轮对话支持
- 意图识别与分类
- 工单创建与流转
- 知识库检索增强

### 2. 代码助手
- 代码审查与优化建议
- 自动化测试生成
- 文档生成与维护
- 代码搜索与解释

### 3. 数据分析代理
- 自动化数据 ETL
- 报表生成与解读
- 异常检测与告警
- 自然语言查询数据库

### 4. 自动化工作流
- 邮件处理与回复
- 日程管理与提醒
- 文档处理与归档
- 跨系统数据同步

### 5. 研究助手
- 文献检索与摘要
- 竞品分析
- 市场调研报告生成
- 趋势分析与预测

### 6. 个人效率助手
- 任务管理与提醒
- 会议纪要生成
- 邮件智能分类与回复
- 旅行规划与预订

## 发展规划

### Phase 1 - 核心框架（当前）
- [x] NestJS 基础架构
- [x] LangChain 集成
- [x] 基础 Agent 实现
- [x] 工具系统框架
- [ ] 内置工具集

### Phase 2 - 能力扩展
- [ ] 多模型支持（OpenAI、Anthropic、Azure OpenAI、本地模型）
- [ ] LangGraph 深度集成
- [ ] Deep Agents 功能支持
- [ ] 记忆系统增强

### Phase 3 - 企业特性
- [ ] LangSmith 完整集成
- [ ] 角色权限系统
- [ ] Agent 编排平台
- [ ] 监控与告警

### Phase 4 - 生态建设
- [ ] Agent 市场/模板市场
- [ ] 可视化编排工具
- [ ] 一键部署支持
- [ ] SDK/CLI 工具

## API 接口

### Agent 模块

| 方法 | 路径 | 描述 |
|------|------|------|
| POST | `/agent` | 创建 Agent |
| GET | `/agent` | 获取 Agent 列表 |
| GET | `/agent/:id` | 获取单个 Agent |
| POST | `/agent/:id/run` | 运行 Agent |
| DELETE | `/agent/:id` | 删除 Agent |

### Chat 模块

| 方法 | 路径 | 描述 |
|------|------|------|
| POST | `/chat` | 发送消息 |
| GET | `/chat/:sessionId` | 获取对话历史 |
| DELETE | `/chat/:sessionId` | 清除对话 |

### User 模块

| 方法 | 路径 | 描述 |
|------|------|------|
| POST | `/user` | 创建用户 |
| GET | `/user` | 获取用户列表 |
| GET | `/user/:id` | 获取单个用户 |
| PATCH | `/user/:id` | 更新用户 |
| DELETE | `/user/:id` | 删除用户 |

## 配置说明

| 配置项 | 环境变量 | 默认值 | 说明 |
|--------|---------|--------|------|
| 服务端口 | `PORT` | 3000 | 服务监听端口 |
| 会话密钥 | `SESSION_SECRET` | lihaichao | Session 加密密钥 |
| LLM 提供商 | `LLM_PROVIDER` | openai | openai / anthropic / azure |
| API Key | `OPENAI_API_KEY` | - | LLM API Key |
| LangSmith | `LANGSMITH_TRACING` | false | 是否启用追踪 |

## 代码规范

```bash
# 代码格式化
npm run format

# 代码检查与修复
npm run lint
```

## 贡献

欢迎提交 Issue 和 Pull Request！

## License

AgentFlow 项目采用 [MIT](LICENSE) 许可证。
