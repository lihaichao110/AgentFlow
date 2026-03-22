# 使用 node:22-alpine 作为基础镜像 并命名为 builder
FROM node:22-alpine as builder

# 设置工作目录
WORKDIR /app

# 复制项目依赖文件到容器的 工作 目录
COPY package.json pnpm-*.yaml ./

# 安装 pnpm
RUN npm install -g pnpm

# 安装项目依赖
RUN pnpm install

# 复制项目所有代码到容器的 工作 目录
COPY . .

# 编译 NestJS 项目
RUN pnpm build

# 第二阶段
FROM node:22-alpine as runner

# 设置工作目录
WORKDIR /app

# 复制编译阶段生成的依赖文件（只复制生产依赖，减少体积）
COPY --from=builder /app/package*.json /app/pnpm-*.yaml ./

# 安装项目依赖
RUN pnpm install --only=production

# 复制编译阶段生成的 dist 目录
COPY --from=builder /app/dist ./dist

# 暴露端口
EXPOSE 3000

# 安装 PM2
RUN npm install -g pm2

# 复制 PM2 配置文件
COPY pm2.config.js ./

# 用 pm2-runtime 启动（适配容器环境，避免容器退出）
CMD ["pm2-runtime", "start", "pm2.config.js"]