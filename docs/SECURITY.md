# 安全规范

本文档用于约束 AgentFlow 的鉴权、配置、输入校验、AI 调用和日志安全。AI 修改项目时必须遵守这些限制。

## 当前安全状态

- `AuthGuard` 当前作为全局 JWT 鉴权入口，默认保护所有未标记 `@Public()` 的接口。
- 用户模块当前包含手机号验证码登录接口，验证码固定为 `1234`，登录成功返回 JWT token；JWT 密钥来自 `JWT_SECRET`，默认有效期来自 `JWT_EXPIRES_IN` 或 `1d`。
- `express-session` 已启用，默认 cookie 名称来自 `SESSION_NAME`，默认 `lhc.sid`。
- `SESSION_SECRET` 有默认值，但生产环境必须显式配置强密钥。
- `JWT_SECRET` 有默认值，但生产环境必须显式配置强密钥。
- DTO 当前大多为空，真实接口的输入校验还不完整。
- `AgentService` 中存在直接读取 `process.env.ANTHROPIC_MODAL` 的实验代码。

## 密钥和环境变量

限制：

- 不允许把 API Key、数据库密码、Session Secret 写入源码或文档示例中的真实值。
- 不允许提交 `.env` 中的敏感值。
- 文档示例只能使用占位符，例如 `your-api-key`。
- 新增第三方服务时，必须通过环境变量和配置层读取密钥。
- 生产环境不得使用默认 `SESSION_SECRET`。

## 鉴权和会话

限制：

- 新增需要用户身份的接口时，不能依赖当前空实现 `AuthGuard`。
- 引入 JWT、API Key 或 Session 鉴权时，必须明确 token 来源、过期策略和错误响应。
- JWT 来源固定为 `Authorization: Bearer <token>`；token 过期统一返回 `401` 和 `登录已过期`。
- 不允许在日志中打印完整 token、cookie、session、API Key。
- 修改 session 配置时必须考虑 cookie 的 `httpOnly`、`secure`、`sameSite`。

## 输入校验

限制：

- 新增 POST、PATCH、PUT 接口必须提供 DTO。
- DTO 应使用 `class-validator` 描述必填、类型、长度、枚举和格式。
- 不允许直接信任 `req.body`、`req.query`、`req.params`。
- 需要数字 ID 时必须显式转换和校验，不要只依赖 `+id`。
- 对外部 URL、文件路径、模型名、工具名等高风险输入必须白名单校验。

## Agent 和 LLM 安全

限制：

- 不要把用户输入直接拼接进系统提示词后执行高权限操作。
- 工具调用必须有权限边界，文件、网络、数据库操作都要限制作用域。
- 不允许让模型决定是否绕过鉴权、访问控制或数据隔离。
- 流式输出前要考虑异常中断和敏感信息泄露。
- 记录 prompt、response 或 tool call 时必须脱敏用户隐私和密钥。

## 错误和日志

限制：

- 生产环境错误响应不能暴露 stack trace。
- 日志中不要打印完整 request 对象，避免泄露 header、cookie 和 body。
- 异常过滤器返回给客户端的信息应稳定、可预期，不应泄露内部实现。
- 外部 SDK 错误需要转换为统一错误格式，不要原样透传敏感上下文。

## 依赖安全

限制：

- 新增依赖前确认是否必要，优先使用项目已有依赖。
- 不要引入无人维护或用途过大的依赖来解决小问题。
- 涉及加密、认证、权限、支付等场景时优先使用成熟库。
- 更新依赖后必须运行构建和相关测试。

## 安全变更检查清单

涉及以下变更时必须复查本文档：

- 新增登录、注册、用户资料、Token、Session 能力
- 新增 Agent 工具、文件读写、网络请求、数据库访问能力
- 新增 webhook、回调地址或外部集成
- 修改异常过滤器、响应拦截器或日志逻辑
- 修改环境变量、部署配置或 Docker 配置
