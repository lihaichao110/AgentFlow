module.exports = {
  apps: [
    {
      name: 'agentflow',
      script: 'dist/main.js', // NestJS 编译后的入口
      // instances: 'max', // 多核利用
      // exec_mode: 'cluster', // 集群模式
      autorestart: true, // 崩溃自动重启
      max_memory_restart: '1G', // 内存超限重启
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
}