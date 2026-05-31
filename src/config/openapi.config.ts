import { DocumentBuilder } from '@nestjs/swagger';

export const OPENAPI_OUTPUT_DIR = 'openapi';
export const OPENAPI_OUTPUT_FILE = 'agentflow.openapi.json';

export function createOpenApiConfig(version = '0.1.0') {
  return new DocumentBuilder()
    .setTitle('AgentFlow API')
    .setDescription('AgentFlow 后端接口文档')
    .setVersion(version)
    .build();
}