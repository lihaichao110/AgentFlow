/**
 * 应用配置
 * 统一管理所有环境变量和配置项
 */
export default () => ({
  // 应用配置
  app: {
    port: parseInt(process.env.APP_PORT, 10) || 3000,
    prefix: process.env.APP_PREFIX || 'api',
    env: process.env.NODE_ENV || 'development',
  },

  // 数据库配置
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    name: process.env.DB_NAME || 'agentflow',
  },

  // Redis 配置
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
    db: parseInt(process.env.REDIS_DB, 10) || 0,
  },

  // Session 配置
  session: {
    secret: process.env.SESSION_SECRET || 'default-secret-change-in-production',
    name: process.env.SESSION_NAME || 'lhc.sid',
    maxAge: parseInt(process.env.SESSION_MAX_AGE, 10) || 3600000, // 1小时
  },
});
